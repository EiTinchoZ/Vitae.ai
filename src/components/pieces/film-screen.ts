// Película: pantalla con foco que sigue al cursor y aviso de placeholder al reproducir (maqueta, línea ~1180).
// El botón de idioma solo marca cuál está elegido hasta que exista el video. mount() devuelve la limpieza.
export function mount(sec: HTMLElement): () => void {
  const scr = sec.querySelector<HTMLElement>('#screen')!;
  const toast = sec.querySelector<HTMLElement>('#toast')!;
  const langs = [...scr.querySelectorAll<HTMLButtonElement>('.lang button')];
  let hide = 0;
  const onMove = (e: PointerEvent) => {
    const r = scr.getBoundingClientRect();
    scr.style.setProperty('--mx', (e.clientX - r.left) / r.width * 100 + '%');
    scr.style.setProperty('--my', (e.clientY - r.top) / r.height * 100 + '%');
  };
  const play = (e: Event) => {
    if ((e.target as Element).closest('.lang')) return;
    toast.classList.add('on');
    clearTimeout(hide);
    hide = window.setTimeout(() => toast.classList.remove('on'), 2600);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(e); }
  };
  const pick = (e: Event) => langs.forEach((o) => o.setAttribute('aria-pressed', String(o === e.currentTarget)));
  scr.addEventListener('pointermove', onMove);
  scr.addEventListener('click', play);
  scr.addEventListener('keydown', onKey);
  langs.forEach((b) => b.addEventListener('click', pick));
  return () => {
    clearTimeout(hide);
    scr.removeEventListener('pointermove', onMove);
    scr.removeEventListener('click', play);
    scr.removeEventListener('keydown', onKey);
    langs.forEach((b) => b.removeEventListener('click', pick));
    toast.classList.remove('on');
    scr.style.removeProperty('--mx');
    scr.style.removeProperty('--my');
  };
}
