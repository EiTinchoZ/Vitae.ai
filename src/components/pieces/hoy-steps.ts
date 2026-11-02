// Hoy: hitos en Philips con su estado real, portado de la maqueta (línea ~1186). La línea de botones a la izquierda
// abre la ficha a la derecha. La carrera del agente de la maqueta salió con los datos internos (Tín, 2026-11-02).
// mount() devuelve la limpieza: listener de la línea y el marcado generado.
import type { Step, ui as UI } from '@/content/es/hoy';

type Data = { steps: Step[]; ui: typeof UI };

export function mount(sec: HTMLElement, { steps, ui }: Data): () => void {
  const line = sec.querySelector<HTMLElement>('#line')!, det = sec.querySelector<HTMLElement>('#det')!;
  line.innerHTML = steps.map((s, i) => `<button class="stop ${s.s === ui.done ? '' : 'pend'}" role="tab" data-i="${i}"><span class="d"></span><span><span class="w">${s.w}</span><span class="t">${s.t}</span></span></button>`).join('');

  function show(i: number) {
    line.querySelectorAll<HTMLElement>('.stop').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.i === String(i))));
    const d = steps[i], c = d.s === ui.done ? 'ok' : 'pend';
    det.innerHTML = `<span class="st ${c}">${d.s}</span><div class="swap"><span class="mono" style="color:#3B2716">${d.w}</span><h3>${d.t}</h3><p>${d.p}</p>${d.k.length ? `<div class="kpis">${d.k.map((x) => `<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div>` : ''}</div>
  ${d.img ? `<figure class="pic ${d.img[2] || ''}"><img src="${d.img[0]}" alt=""><small>${d.img[1]}</small></figure>` : ''}`;
  }

  const onClick = (e: MouseEvent) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.stop');
    if (b) show(Number(b.dataset.i));
  };
  line.addEventListener('click', onClick);
  show(ui.first);

  return () => {
    line.removeEventListener('click', onClick);
    line.innerHTML = '';
    det.innerHTML = '';
  };
}
