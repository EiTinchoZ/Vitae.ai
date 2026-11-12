import { cvPdf, type Lang } from '@/content/lang';
import { LangSwitch } from './LangSwitch';

const links: Record<Lang, readonly (readonly [string, string])[]> = {
  es: [
    ['#pelicula', 'Película'],
    ['#formacion', 'Quién soy'],
    ['#aporto', 'Dónde aporto'],
    ['#trayectoria', 'Trayectoria'],
    ['#hoy', 'Experiencia'],
    ['#proyectos', 'Proyectos'],
    ['#laptop', 'RGB'],
    ['#contacto', 'Contacto'],
  ],
  en: [
    ['#pelicula', 'Film'],
    ['#formacion', 'About'],
    ['#aporto', 'Where I fit'],
    ['#trayectoria', 'Path'],
    ['#hoy', 'Experience'],
    ['#proyectos', 'Projects'],
    ['#laptop', 'RGB'],
    ['#contacto', 'Contact'],
  ],
};

export function Nav({ lang }: { lang: Lang }) {
  const en = lang === 'en';
  return (
    <nav className="nav" aria-label={en ? 'Sections' : 'Secciones'}>
      <b>Martín Bundy</b>
      {links[lang].map(([href, label]) => (
        <a key={href} href={href}>
          {label}
        </a>
      ))}
      <button className="snd" id="snd" type="button" aria-pressed="false" aria-label={en ? 'Sound' : 'Sonido'}>
        <i />
        <i />
        <i />
        <i />
        <span>{en ? 'Sound' : 'Sonido'}</span>
      </button>
      <LangSwitch lang={lang} />
      <a className="cvb" href={cvPdf[lang]} target="_blank" rel="noopener">
        CV · PDF
      </a>
    </nav>
  );
}
