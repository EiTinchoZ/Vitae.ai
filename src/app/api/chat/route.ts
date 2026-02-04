import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { buildSystemPrompt } from '@/lib/ai-system-prompt';
import { getCvData } from '@/data/cv-data';


export async function POST(req: Request) {
  try {
    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const { messages, language = 'es' } = await req.json();
    const cvData = getCvData(language);
    const enhancedSystemPrompt = buildSystemPrompt(language, cvData);

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: enhancedSystemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
