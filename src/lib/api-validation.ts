import type { LanguageCode } from '@/i18n';

const VALID_LANGUAGES: LanguageCode[] = [
  'es', 'en'
];

const VALID_SECTIONS = ['skills', 'projects', 'experience', 'education'];

export function validateLanguage(language: unknown): LanguageCode {
  if (typeof language !== 'string' || !VALID_LANGUAGES.includes(language as LanguageCode)) {
    return 'es';
  }
  return language as LanguageCode;
}

export function validateSection(section: unknown): string | null {
  if (typeof section !== 'string' || !VALID_SECTIONS.includes(section)) {
    return null;
  }
  return section;
}

export function validateQuestion(question: unknown): string | null {
  if (typeof question !== 'string' || question.trim().length === 0) {
    return null;
  }
  if (question.length > 500) {
    return question.slice(0, 500);
  }
  return question.trim();
}

export function createErrorResponse(
  message: string,
  status: number = 400,
  errorCode: string = 'invalid_request'
) {
  return new Response(
    JSON.stringify({ error: message, errorCode }),
    { status, headers: { 'Content-Type': 'application/json' } }
  );
}

export function validateMessages(messages: unknown): messages is Array<{ role: 'user' | 'assistant'; content: string }> {
  return Array.isArray(messages) && messages.length >= 1 && messages.length <= 12
    && messages.every((message) => message && typeof message === 'object'
      && (message.role === 'user' || message.role === 'assistant')
      && typeof message.content === 'string' && message.content.trim().length >= 1
      && message.content.length <= 1_000);
}

export function validateCvDataSize(cvData: unknown): boolean {
  return cvData === undefined || JSON.stringify(cvData).length <= 20_000;
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json();
    return body !== null && typeof body === 'object' && !Array.isArray(body)
      ? body as Record<string, unknown> : null;
  } catch {
    return null;
  }
}
