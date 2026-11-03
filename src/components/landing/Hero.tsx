import es from '@/content/es/hero';
import en from '@/content/en/hero';
import type { Lang } from '@/content/lang';
import { HeroPieces } from '@/components/pieces/HeroPieces';
import { Section } from './Section';

export function Hero({ lang }: { lang: Lang }) {
  return (
    <>
      <Section id="top" className="hero" tone="#FF5A14" html={lang === 'en' ? en : es} />
      <HeroPieces lang={lang} />
    </>
  );
}
