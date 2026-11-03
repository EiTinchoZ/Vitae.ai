import { createGroq } from '@ai-sdk/groq';
import { APICallError, generateText, streamText, type ModelMessage } from 'ai';
import { createErrorResponse } from '@/lib/api-validation';

type Input = { system?: string; maxOutputTokens?: number; temperature?: number }
  & ({ prompt: string; messages?: never } | { messages: ModelMessage[]; prompt?: never });
const MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'] as const;

export function aiBusyResponse() {
  return createErrorResponse('AI temporarily unavailable', 503, 'ai_busy');
}

function retryable(error: unknown): boolean {
  if (APICallError.isInstance(error)) {
    return error.statusCode === 429 || (error.statusCode !== undefined && error.statusCode >= 500)
      || (error.statusCode === undefined && error.isRetryable);
  }
  return error instanceof TypeError; // fetch network failure
}

export async function guardedText(input: Input): Promise<string> {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not configured');
  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
  const abortSignal = AbortSignal.timeout(25_000);
  for (let i = 0; i < MODELS.length; i++) {
    try {
      const result = await generateText({ ...input, model: groq(MODELS[i]), maxOutputTokens: input.maxOutputTokens ?? 600,
        maxRetries: 0, abortSignal });
      return result.text;
    } catch (error) {
      if (i === 1 || !retryable(error)) throw error;
      console.warn('[ai] Primary unavailable; trying fallback');
    }
  }
  throw new Error('AI unavailable');
}

export async function guardedStream(input: Input): Promise<Response> {
  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY is not configured');
    return aiBusyResponse();
  }
  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
  const abortSignal = AbortSignal.timeout(25_000);
  for (let i = 0; i < MODELS.length; i++) {
    let iterator: AsyncIterator<string> | undefined;
    try {
      let streamError: unknown;
      const result = streamText({ ...input, model: groq(MODELS[i]), maxOutputTokens: input.maxOutputTokens ?? 600,
        maxRetries: 0, abortSignal,
        onError: ({ error }) => { streamError = error; } });
      iterator = result.textStream[Symbol.asyncIterator]();
      // textStream filters error parts: onError is essential for an empty failed stream.
      const first = await iterator.next();
      if (streamError) throw streamError;
      if (first.done) throw new Error('Empty AI response');
      const activeIterator = iterator;
      const encoder = new TextEncoder();
      return new Response(new ReadableStream<Uint8Array>({
        start(controller) { controller.enqueue(encoder.encode(first.value)); },
        async pull(controller) {
          try {
            const next = await activeIterator.next();
            if (streamError) throw streamError;
            if (next.done) controller.close();
            else controller.enqueue(encoder.encode(next.value));
          } catch {
            controller.error(new Error('AI temporarily unavailable'));
            await activeIterator.return?.();
          }
        },
        async cancel() { await activeIterator.return?.(); },
      }), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
    } catch (error) {
      await iterator?.return?.();
      if (i === 1 || !retryable(error)) {
        console.error('[ai] Generation unavailable');
        return aiBusyResponse();
      }
      console.warn('[ai] Primary unavailable; trying fallback');
    }
  }
  return aiBusyResponse();
}
