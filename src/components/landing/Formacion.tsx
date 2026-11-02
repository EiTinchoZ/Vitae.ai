import html from '@/content/es/formacion';
import { FormacionPieces } from '@/components/pieces/FormacionPieces';
import { IsoFigure } from '@/components/pieces/IsoFigure';
import { Section } from './Section';

export function Formacion() {
  return (
    <>
      <Section id="formacion" className="edu" tone="#F5B700" html={html} />
      <FormacionPieces />
      <IsoFigure section="formacion" name="formacion" />
    </>
  );
}
