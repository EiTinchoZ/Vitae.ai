// Idiomas de la landing: ES en /, EN en /en. Cada sección tiene su par en content/es y content/en.
export type Lang = 'es' | 'en';

export const home: Record<Lang, string> = { es: '/', en: '/en' };
export const cvPdf: Record<Lang, string> = {
  es: '/cv/CV_Martin_Bundy_2026_ES.pdf',
  en: '/cv/CV_Martin_Bundy_2026_EN.pdf',
};
