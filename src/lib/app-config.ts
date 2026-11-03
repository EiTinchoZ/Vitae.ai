export const APP_MODE = (process.env.NEXT_PUBLIC_APP_MODE ?? 'personal').trim();
export const IS_DEMO = APP_MODE === 'demo';

export const PERSONAL_URL = process.env.NEXT_PUBLIC_PERSONAL_URL ?? '';
export const REPO_URL = 'https://github.com/EiTinchoZ/Vitae.ai';
