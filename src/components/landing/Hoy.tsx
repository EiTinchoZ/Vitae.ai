import html from '@/content/es/hoy';
import { HoySteps } from '@/components/pieces/HoySteps';
import { IsoFigure } from '@/components/pieces/IsoFigure';
import { Section } from './Section';

export function Hoy() {
  return (
    <>
      <Section id="hoy" className="hoy" tone="#FFD23F" html={html} />
      <HoySteps />
      <IsoFigure section="hoy" name="poguru" />
    </>
  );
}
