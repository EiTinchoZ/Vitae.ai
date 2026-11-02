import html from '@/content/es/hero';
import { HeroPieces } from '@/components/pieces/HeroPieces';
import { Section } from './Section';

export function Hero() {
  return (
    <>
      <Section id="top" className="hero" tone="#FF5A14" html={html} />
      <HeroPieces />
    </>
  );
}
