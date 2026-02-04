import type { LanguageCode } from '@/i18n';

const languageInstructions: Record<LanguageCode, string> = {
  es: 'Responde siempre en español.',
  en: 'Always respond in English.',
  pt: 'Responda sempre em português.',
  de: 'Antworte immer auf Deutsch.',
  fr: 'Réponds toujours en français.',
  zh: '请始终用中文回答。',
  ja: '常に日本語で回答してください。',
  ar: 'أجب دائمًا باللغة العربية.',
  hi: 'हमेशा हिंदी में जवाब दें।',
  ko: '항상 한국어로 답변하세요.',
};

const languageNames: Record<LanguageCode, string> = {
  es: 'español',
  en: 'inglés',
  pt: 'portugués',
  de: 'alemán',
  fr: 'francés',
  zh: 'chino',
  ja: 'japonés',
  ar: 'árabe',
  hi: 'hindi',
  ko: 'coreano',
};

export function getLanguageInstruction(language: LanguageCode): string {
  return languageInstructions[language] ?? languageInstructions.es;
}

export function getLanguageName(language: LanguageCode): string {
  return languageNames[language] ?? languageNames.es;
}
