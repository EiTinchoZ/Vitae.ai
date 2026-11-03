export const languages = [
  { code: 'es', name: 'Espanol', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
] as const;

export type LanguageCode = (typeof languages)[number]['code'];

export const defaultLanguage: LanguageCode = 'es';

export const languageNames: Record<LanguageCode, string> = {
  es: 'Espanol',
  en: 'English',
};
