import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { buildSystemPrompt } from '@/lib/ai-system-prompt';
import { getCvData } from '@/data/cv-data';
import { validateLanguage, createErrorResponse } from '@/lib/api-validation';
import { enforceRateLimit } from '@/lib/api-rate-limit';


export async function POST(req: Request) {
  try {
    const rateLimitResponse = enforceRateLimit(req, {
      windowMs: 60_000,
      max: 20,
      keyPrefix: 'chat',
    });
    if (rateLimitResponse) return rateLimitResponse;

    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not configured');
      return createErrorResponse('API key not configured', 500, 'api_key_missing');
    }

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const body = await req.json();
    const language = validateLanguage(body.language);

    if (!body.messages || !Array.isArray(body.messages)) {
      return createErrorResponse('Invalid messages format', 400, 'invalid_messages');
    }

    const cvData = getCvData(language);
    const enhancedSystemPrompt = buildSystemPrompt(language, cvData);

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: enhancedSystemPrompt,
      messages: body.messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return createErrorResponse('Failed to process chat request', 500, 'processing_failed');
  }
}
