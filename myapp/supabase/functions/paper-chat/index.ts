import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const paper = body.paper ?? {};
    const level = String(body.level ?? 'intermediate').toUpperCase();
    const question = String(body.question ?? '');
    const messages = Array.isArray(body.messages) ? body.messages : [];

    const defaultSystem =
      `You are PaperMind AI, an expert research assistant.\n` +
      `User level: ${level}.\n` +
      `Use this paper context:\n` +
      `Title: ${String(paper.title ?? 'Unknown')}\n` +
      `Authors: ${Array.isArray(paper.authors) ? paper.authors.join(', ') : 'Unknown'}\n` +
      `Venue: ${String(paper.venue ?? 'Unknown')} (${String(paper.year ?? 'Unknown')})\n` +
      `Domain: ${String(paper.domain ?? 'General')}\n` +
      `Difficulty: ${String(paper.difficulty ?? 'intermediate')} (${String(paper.difficulty_score ?? 'N/A')}/10)\n` +
      `Abstract: ${String(paper.abstract ?? '')}\n` +
      `Summary: ${String(paper.summary ?? 'No summary available.')}\n\n` +
      `Guidelines:\n` +
      `- Answer directly and avoid repeating the abstract verbatim.\n` +
      `- If context is insufficient, say what is missing and provide the best high-confidence guidance.\n` +
      `- Keep answers matched to the user's level.`;

    const systemPrompt = String(body.system_prompt ?? defaultSystem);

    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openRouterKey) {
      throw new Error('OPENROUTER_API_KEY is missing');
    }

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: Record<string, unknown>) => ({
        role: String(m.role ?? 'user'),
        content: String(m.content ?? ''),
      })),
      { role: 'user', content: question },
    ];

    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-70b-instruct',
        messages: chatMessages,
      }),
    });

    const data = await resp.json();
    const answer =
      data?.choices?.[0]?.message?.content ??
      'I could not generate an answer right now. Please try again.';

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        answer: 'I could not generate an answer right now. Please try again.',
        error: error instanceof Error ? error.message : 'unknown error',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
