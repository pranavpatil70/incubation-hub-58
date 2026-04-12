import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

type Difficulty = 'beginner' | 'intermediate' | 'expert';

const extractArxivId = (source: unknown): string | null => {
  if (typeof source !== 'string') {
    return null;
  }

  const trimmed = source.trim();
  if (trimmed.length === 0) {
    return null;
  }

  const uriMatch = /arxiv\.org\/(?:abs|pdf)\/([0-9]{4}\.[0-9]{4,5}(?:v\d+)?)/i.exec(trimmed);
  if (uriMatch?.[1]) {
    return uriMatch[1];
  }

  const rawMatch = /^([0-9]{4}\.[0-9]{4,5}(?:v\d+)?)$/i.exec(trimmed);
  if (rawMatch?.[1]) {
    return rawMatch[1];
  }

  return null;
};

const extractArxivIdFromCanonicalDoi = (source: unknown): string | null => {
  if (typeof source !== 'string') {
    return null;
  }

  const trimmed = source.trim();
  if (trimmed.length === 0) {
    return null;
  }

  const normalized = trimmed
    .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '')
    .replace(/^doi:/i, '');

  const canonicalMatch = /^10\.48550\/arXiv\.([0-9]{4}\.[0-9]{4,5}(?:v\d+)?)$/i.exec(normalized);
  return canonicalMatch?.[1] ?? null;
};

const levelToScore = (level: Difficulty) =>
  level === 'beginner' ? 1 : level === 'intermediate' ? 2 : 3;

const scoreToLevel = (score: number): Difficulty => {
  if (score <= 1) return 'beginner';
  if (score >= 3) return 'expert';
  return 'intermediate';
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, domains, level } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');

    if (!supabaseUrl || !serviceRoleKey || !openRouterKey) {
      throw new Error('Missing required Supabase/OpenRouter environment variables');
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const domainQuery = Array.isArray(domains) && domains.length > 0
      ? domains.join(' OR ')
      : 'machine learning';

    const semanticUrl =
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
        domainQuery,
      )}&limit=20&fields=title,abstract,authors,year,venue,citationCount,paperId,openAccessPdf,externalIds`;

    const semanticResp = await fetch(semanticUrl);
    const semanticData = await semanticResp.json();
    const papers: Array<Record<string, unknown>> = semanticData?.data ?? [];

    const scored = await Promise.all(
      papers.map(async (paper) => {
        const title = String(paper.title ?? 'Untitled');
        const abstract = String(paper.abstract ?? '');

        const prompt = `Analyze this research paper and return a JSON object only:\n{\n  \"difficulty\": \"beginner\" | \"intermediate\" | \"expert\",\n  \"score\": 1-10,\n  \"reasoning\": \"one sentence\"\n}\n\nPaper Title: ${title}\nAbstract: ${abstract}\n\nBase difficulty on: mathematical complexity, assumed prior knowledge, citation depth, jargon density.`;

        const llmResp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.1-70b-instruct',
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        const llmData = await llmResp.json();
        const content = String(llmData?.choices?.[0]?.message?.content ?? '');
        const firstBrace = content.indexOf('{');
        const lastBrace = content.lastIndexOf('}');
        const jsonSlice =
          firstBrace >= 0 && lastBrace >= 0
            ? content.slice(firstBrace, lastBrace + 1)
            : content;

        let parsed: { difficulty: Difficulty; score: number; reasoning: string };
        try {
          parsed = JSON.parse(jsonSlice);
        } catch {
          parsed = { difficulty: 'intermediate', score: 5, reasoning: 'fallback parse' };
        }

        return {
          ...paper,
          difficulty: parsed.difficulty,
          difficulty_score: parsed.score,
          difficulty_reasoning: parsed.reasoning,
        };
      }),
    );

    const userLevelScore = levelToScore(level as Difficulty);
    const filtered = scored
      .filter((paper) => {
        const diffLevel = scoreToLevel(levelToScore((paper.difficulty ?? 'intermediate') as Difficulty));
        const diffScore = levelToScore(diffLevel);
        return Math.abs(diffScore - userLevelScore) <= 1;
      })
      .sort((a, b) => {
        const byYear = Number(b.year ?? 0) - Number(a.year ?? 0);
        if (byYear !== 0) {
          return byYear;
        }
        return Number(b.citationCount ?? 0) - Number(a.citationCount ?? 0);
      });

    const ranked = filtered.length > 0
      ? filtered
      : [...scored].sort((a, b) => {
        const byYear = Number(b.year ?? 0) - Number(a.year ?? 0);
        if (byYear !== 0) {
          return byYear;
        }
        return Number(b.citationCount ?? 0) - Number(a.citationCount ?? 0);
      });

    const enriched = ranked.map((paper) => {
      const externalIdsRaw = paper.externalIds;
      const externalIds =
        externalIdsRaw && typeof externalIdsRaw === 'object' && !Array.isArray(externalIdsRaw)
          ? externalIdsRaw as Record<string, unknown>
          : null;

      const externalArxivId = extractArxivId(externalIds?.ArXiv);
      const doi = typeof externalIds?.DOI === 'string' ? externalIds.DOI : null;
      const arxivIdFromDoi = extractArxivIdFromCanonicalDoi(doi);
      const resolvedArxivId = externalArxivId ?? arxivIdFromDoi;
      const directArxivPdfUrl = resolvedArxivId == null
        ? null
        : `https://arxiv.org/pdf/${resolvedArxivId}.pdf`;
      const openAccessPdfUrl = (paper.openAccessPdf as { url?: string } | undefined)?.url ?? null;

      return {
        ...paper,
        externalIds,
        doi,
        resolvedArxivId,
        resolvedPdfUrl: directArxivPdfUrl ?? openAccessPdfUrl,
      };
    });

    const topPaper =
      enriched.find((paper) => paper.resolvedArxivId != null && paper.resolvedPdfUrl != null) ??
      enriched.find((paper) => paper.resolvedPdfUrl != null) ??
      enriched[0];

    if (!topPaper) {
      return new Response(JSON.stringify({ ok: true, scheduled: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const paperInsert = {
      title: String(topPaper.title ?? 'Untitled'),
      authors: (topPaper.authors as Array<{ name?: string }> | undefined)?.map((a) => a.name ?? 'Unknown') ?? [],
      abstract: String(topPaper.abstract ?? ''),
      pdf_url: topPaper.resolvedPdfUrl ?? null,
      year: Number(topPaper.year ?? new Date().getFullYear()),
      venue: String(topPaper.venue ?? 'Unknown Venue'),
      domain: Array.isArray(domains) && domains.length > 0 ? String(domains[0]) : 'General',
      difficulty: String(topPaper.difficulty ?? 'intermediate'),
      difficulty_score: Number(topPaper.difficulty_score ?? 5),
      semantic_scholar_id: String(topPaper.paperId ?? crypto.randomUUID()),
      arxiv_id: topPaper.resolvedArxivId,
      external_ids: topPaper.externalIds,
      doi: topPaper.doi,
      citation_count: Number(topPaper.citationCount ?? 0),
      summary: String(topPaper.abstract ?? '').slice(0, 200),
      word_count: String(topPaper.abstract ?? '').split(/\s+/).length,
    };

    const { data: insertedPaper } = await supabase
      .from('papers')
      .upsert(paperInsert, { onConflict: 'semantic_scholar_id' })
      .select()
      .single();

    await supabase.from('user_daily_papers').upsert({
      user_id: userId,
      paper_id: insertedPaper.id,
      scheduled_date: new Date().toISOString().slice(0, 10),
      read: false,
    }, { onConflict: 'user_id,scheduled_date' });

    return new Response(
      JSON.stringify({ ok: true, scheduled: true, paper_id: insertedPaper.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : 'unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
