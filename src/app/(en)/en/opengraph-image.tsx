import { alt as alts, ogCard } from '@/app/_og/card';

export const alt = alts.en;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return ogCard('en');
}
