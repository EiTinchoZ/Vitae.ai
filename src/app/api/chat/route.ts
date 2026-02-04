import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { systemPrompt } from '@/lib/ai-system-prompt';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
