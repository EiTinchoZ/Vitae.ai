import type { LanguageCode } from '@/i18n';

const languageInstructions: Record<LanguageCode, string> = {
  es: 'Responde siempre en español.',
  en: 'Always respond in English.',
};

export function getLanguageInstruction(language: LanguageCode): string {
  return languageInstructions[language] ?? languageInstructions.es;
}
