import es from '@/content/es/hoy';
import en from '@/content/en/hoy';
import type { Lang } from '@/content/lang';
import { HoySteps } from '@/components/pieces/HoySteps';
import { IsoFigure } from '@/components/pieces/IsoFigure';
import { Section } from './Section';

export function Hoy({ lang }: { lang: Lang }) {
  return (
    <>
      <Section id="hoy" className="hoy" tone="#FFD23F" html={lang === 'en' ? en : es} />
      <HoySteps lang={lang} />
      <IsoFigure section="hoy" name="poguru" lang={lang} />
    </>
  );
}
