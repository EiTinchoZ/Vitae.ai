import { guardedStream } from '@/lib/ai-guard';
import { buildSystemPrompt } from '@/lib/ai-system-prompt';
import { getCvData } from '@/data/cv-data';
import { readJsonObject, validateCvDataSize, validateMessages, validateLanguage, createErrorResponse } from '@/lib/api-validation';
import { enforceRateLimit } from '@/lib/api-rate-limit';
import { IS_DEMO } from '@/lib/app-config';
import { EMPTY_CV_DATA, mergeCvData } from '@/lib/cv-data-utils';


export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const rateLimitResponse = enforceRateLimit(req, {
      windowMs: 60_000,
      max: 20,
      keyPrefix: 'chat',
    });
    if (rateLimitResponse) return rateLimitResponse;

    const body = await readJsonObject(req);
    if (!body || !validateCvDataSize(body.cvData)) {
      return createErrorResponse('Invalid request', 400, 'invalid_request');
    }
    const language = validateLanguage(body.language);

    if (!validateMessages(body.messages)) {
      return createErrorResponse('Invalid messages format', 400, 'invalid_messages');
    }

    const override = IS_DEMO && body?.cvData && typeof body.cvData === 'object' ? body.cvData : null;
    const cvData = override ? mergeCvData(EMPTY_CV_DATA, override as Partial<import('@/types').CVData>) : getCvData(language);
    const enhancedSystemPrompt = buildSystemPrompt(language, cvData);

    return await guardedStream({
      system: enhancedSystemPrompt,
      messages: body.messages,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return createErrorResponse('Failed to process chat request', 500, 'processing_failed');
  }
}
