const links = [
  ['#pelicula', 'Película'],
  ['#trayectoria', 'Trayectoria'],
  ['#hoy', 'Hoy'],
  ['#proyectos', 'Proyectos'],
  ['#laptop', 'RGB'],
  ['#formacion', 'Formación'],
  ['#contacto', 'Contacto'],
] as const;

export function Nav() {
  return (
    <nav className="nav" aria-label="Secciones">
      <b>Martín Bundy</b>
      {links.map(([href, label]) => (
        <a key={href} href={href}>
          {label}
        </a>
      ))}
      <button className="snd" id="snd" type="button" aria-pressed="false" aria-label="Sonido">
        <i />
        <i />
        <i />
        <i />
        <span>Sonido</span>
      </button>
      <a className="cvb" href="#">
        CV · PDF
      </a>
    </nav>
  );
}
