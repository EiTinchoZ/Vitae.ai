import { cvPdf, type Lang } from '@/content/lang';
import { LangSwitch } from './LangSwitch';

const links: Record<Lang, readonly (readonly [string, string])[]> = {
  es: [
    ['#pelicula', 'Película'],
    ['#trayectoria', 'Trayectoria'],
    ['#hoy', 'Hoy'],
    ['#proyectos', 'Proyectos'],
    ['#laptop', 'RGB'],
    ['#formacion', 'Formación'],
    ['#contacto', 'Contacto'],
  ],
  en: [
    ['#pelicula', 'Film'],
    ['#trayectoria', 'Path'],
    ['#hoy', 'Now'],
    ['#proyectos', 'Projects'],
    ['#laptop', 'RGB'],
    ['#formacion', 'Learning'],
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
