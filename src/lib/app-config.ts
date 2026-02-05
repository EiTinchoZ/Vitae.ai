export const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE ?? 'personal';
export const IS_DEMO = APP_MODE === 'demo';

export const DEMO_URL = process.env.NEXT_PUBLIC_DEMO_URL ?? '/demo';
export const PERSONAL_URL = process.env.NEXT_PUBLIC_PERSONAL_URL ?? '';
export const REPO_URL = 'https://github.com/EiTinchoZ/Portafolio-CV-Interactivo';
