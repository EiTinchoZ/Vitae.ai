import es from '@/content/es/laptop';
import en from '@/content/en/laptop';
import type { Lang } from '@/content/lang';
import { IsoFigure } from '@/components/pieces/IsoFigure';
import { LaptopZoom } from '@/components/pieces/LaptopZoom';
import { Section } from './Section';

export function Laptop({ lang }: { lang: Lang }) {
  return (
    <>
      <Section id="laptop" className="rig" tone="#FF6A2A" html={lang === 'en' ? en : es} />
      <IsoFigure section="laptop" name="laptop" lang={lang} />
      <LaptopZoom lang={lang} />
    </>
  );
}
