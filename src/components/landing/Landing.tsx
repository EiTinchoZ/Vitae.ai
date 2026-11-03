import { preload } from 'react-dom';
import type { Lang } from '@/content/lang';
import footerEs from '@/content/es/footer';
import footerEn from '@/content/en/footer';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { Pelicula } from './Pelicula';
import { Trayectoria } from './Trayectoria';
import { Hoy } from './Hoy';
import { Proyectos } from './Proyectos';
import { Laptop } from './Laptop';
import { Formacion } from './Formacion';
import { Contacto } from './Contacto';
import { InkField } from '@/components/pieces/InkField';
import { DecodeTitles } from '@/components/pieces/DecodeTitles';
import { SoundProvider } from '@/components/sound/SoundProvider';

// La landing completa en un idioma: / la pinta en ES y /en en EN.
export function Landing({ lang }: { lang: Lang }) {
  // Archivo se precarga aquí y no en el layout raíz, que también envuelve /demo (que no la usa).
  preload('/fonts/archivo-var.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  return (
    <>
      <InkField />
      <Nav lang={lang} />
      <SoundProvider />
      <DecodeTitles>
        <Hero lang={lang} />
        <Pelicula lang={lang} />
        <Trayectoria lang={lang} />
        <Hoy lang={lang} />
        <Proyectos lang={lang} />
        <Laptop lang={lang} />
        <Formacion lang={lang} />
        <Contacto lang={lang} />
      </DecodeTitles>
      <footer dangerouslySetInnerHTML={{ __html: lang === 'en' ? footerEn : footerEs }} />
      <div className="tip" id="tip" />
    </>
  );
}
