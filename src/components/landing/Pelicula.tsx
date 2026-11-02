import html from '@/content/es/pelicula';
import { FilmScreen } from '@/components/pieces/FilmScreen';
import { Section } from './Section';

export function Pelicula() {
  return (
    <>
      <Section id="pelicula" className="film" tone="#F3EEE3" html={html} />
      <FilmScreen />
    </>
  );
}
