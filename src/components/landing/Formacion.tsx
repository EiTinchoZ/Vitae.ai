import es from '@/content/es/formacion';
import en from '@/content/en/formacion';
import type { Lang } from '@/content/lang';
import { FormacionPieces } from '@/components/pieces/FormacionPieces';
import { IsoFigure } from '@/components/pieces/IsoFigure';
import { Section } from './Section';

export function Formacion({ lang }: { lang: Lang }) {
  return (
    <>
      <Section id="formacion" className="edu" tone="#F5B700" html={lang === 'en' ? en : es} />
      <FormacionPieces lang={lang} />
      <IsoFigure section="formacion" name="formacion" lang={lang} />
    </>
  );
}
