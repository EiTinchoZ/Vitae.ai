import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { systemPrompt } from '@/lib/ai-system-prompt';

const languageInstructions: Record<string, string> = {
  es: 'Responde siempre en espanol.',
  en: 'Always respond in English.',
  pt: 'Sempre responda em portugues.',
  de: 'Antworte immer auf Deutsch.',
  fr: 'Reponds toujours en francais.',
  zh: '始终用中文回复。',
  ja: '常に日本語で回答してください。',
  ar: 'قم بالرد دائمًا باللغة العربية.',
  hi: 'हमेशा हिंदी में जवाब दें।',
  ko: '항상 한국어로 대답하세요.',
};

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

    const langInstruction = languageInstructions[language] || languageInstructions.es;
    const enhancedSystemPrompt = `${systemPrompt}\n\nIMPORTANT: ${langInstruction}`;

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
