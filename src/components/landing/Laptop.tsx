import html from '@/content/es/laptop';
import { IsoFigure } from '@/components/pieces/IsoFigure';
import { LaptopZoom } from '@/components/pieces/LaptopZoom';
import { Section } from './Section';

export function Laptop() {
  return (
    <>
      <Section id="laptop" className="rig" tone="#FF6A2A" html={html} />
      <IsoFigure section="laptop" name="laptop" />
      <LaptopZoom />
    </>
  );
}
