import es from '@/content/es/pelicula';
import en from '@/content/en/pelicula';
import type { Lang } from '@/content/lang';
import { FilmScreen } from '@/components/pieces/FilmScreen';
import { Section } from './Section';

export function Pelicula({ lang }: { lang: Lang }) {
  return (
    <>
      <Section id="pelicula" className="film" tone="#F3EEE3" html={lang === 'en' ? en : es} />
      <FilmScreen />
    </>
  );
}
