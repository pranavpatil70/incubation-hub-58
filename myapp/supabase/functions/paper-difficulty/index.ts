import { corsHeaders } from '../_shared/cors.ts';

type DifficultyResponse = {
  difficulty: 'beginner' | 'intermediate' | 'expert';
  score: number;
  reasoning: string;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { title, abstract } = await req.json();

    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const prompt = `Analyze this research paper and return a JSON object only:\n{\n  \"difficulty\": \"beginner\" | \"intermediate\" | \"expert\",\n  \"score\": 1-10,\n  \"reasoning\": \"one sentence\"\n}\n\nPaper Title: ${title}\nAbstract: ${abstract}\n\nBase difficulty on: mathematical complexity, assumed prior knowledge, citation depth, jargon density.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-70b-instruct',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const content: string =
      data?.choices?.[0]?.message?.content ??
      '{"difficulty":"intermediate","score":5,"reasoning":"Unable to classify."}';

    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    const jsonSlice =
      firstBrace >= 0 && lastBrace >= 0
        ? content.slice(firstBrace, lastBrace + 1)
        : content;

    const parsed = JSON.parse(jsonSlice) as DifficultyResponse;

    const safe: DifficultyResponse = {
      difficulty: ['beginner', 'intermediate', 'expert'].includes(parsed.difficulty)
        ? parsed.difficulty
        : 'intermediate',
      score: Math.min(10, Math.max(1, Number(parsed.score) || 5)),
      reasoning: String(parsed.reasoning || 'No reasoning provided'),
    };

    return new Response(JSON.stringify(safe), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        difficulty: 'intermediate',
        score: 5,
        reasoning: error instanceof Error ? error.message : 'unknown error',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
