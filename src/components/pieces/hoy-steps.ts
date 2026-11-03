// Hoy: hitos en Philips con su estado real, portado de la maqueta (línea ~1186). La línea de botones a la izquierda
// abre la ficha a la derecha. La carrera del agente de la maqueta salió con los datos internos (Tín, 2026-11-02).
// Ronda 2 (R5): los hitos 1 a 4 llevan un objeto que se inclina hacia el cursor (maqueta 2026-11-03-tanda-c).
// mount() devuelve la limpieza: listeners, temporizadores y el marcado generado.
import type { Step, ui as UI, fx as FX } from '@/content/es/hoy';

type Data = { steps: Step[]; ui: typeof UI; fx: typeof FX };

const DOC = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 1.5h6.5L13 5v9.5H3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M5.5 8.5h5M5.5 11h3.5" stroke="currentColor" stroke-width="1.6"/></svg>';

function piece(kind: NonNullable<Step['fx']>, fx: typeof FX): string {
  if (kind === 'day') return `<div class="fx day"><div class="obj"><span class="tape" aria-hidden="true"></span><img src="${fx.day.src}" alt="${fx.day.alt}" width="900" height="900"><i class="glare" aria-hidden="true"></i><small>${fx.day.cap}</small></div></div>`;
  if (kind === 'dash') return `<div class="fx dash"><div class="obj"><div class="top"><i></i><i></i><i></i><span>${fx.dash.title}</span></div><div class="pw"><span class="tok" aria-hidden="true"></span><ol class="pipe">${fx.dash.stages.map((s, i) => `<li><span class="n">${i + 1}</span><b>${s}</b><i class="lamp"></i></li>`).join('')}</ol></div><div class="dfoot"><span>${fx.dash.kpi}</span><span class="nc">${fx.dash.nc}</span></div></div></div>`;
  if (kind === 'docs') {
    const [a, b, c] = fx.docs.sheets, sh = (cls: string, t: string) => `<div class="sheet ${cls}"><b>${t}</b><i></i><i></i><i></i><i></i></div>`;
    return `<div class="fx docs" aria-hidden="true"><div class="obj" style="--f:1">${sh('s1', a)}${sh('s3', c)}${sh('s2', b)}<div class="fold"><span>${fx.docs.fold}</span></div></div></div>`;
  }
  return `<div class="fx chat"><div class="obj"><div class="hd"><span class="av"><img src="/img/logos/copilot-color.svg" alt="" width="26" height="26"></span><span><b>${fx.chat.name}</b><small>${fx.chat.by}</small></span></div><div class="msgs"><div class="q">${fx.chat.q}</div><div class="dots" aria-hidden="true"><i></i><i></i><i></i></div><div class="a">${fx.chat.a}<span class="src">${DOC}${fx.chat.src}</span></div><span class="t">${fx.chat.t}</span></div></div></div>`;
}

export function mount(sec: HTMLElement, { steps, ui, fx }: Data): () => void {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches, FINE = matchMedia('(pointer:fine)').matches;
  const line = sec.querySelector<HTMLElement>('#line')!, det = sec.querySelector<HTMLElement>('#det')!;
  line.innerHTML = steps.map((s, i) => `<button class="stop ${s.s === ui.done ? '' : 'pend'}" role="tab" data-i="${i}"><span class="d"></span><span><span class="w">${s.w}</span><span class="t">${s.t}</span></span></button>`).join('');
  let stopFx = () => {};

  function show(i: number) {
    stopFx();
    stopFx = () => {};
    line.querySelectorAll<HTMLElement>('.stop').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.i === String(i))));
    const d = steps[i], c = d.s === ui.done ? 'ok' : 'pend';
    det.innerHTML = `<span class="st ${c}">${d.s}</span><div class="swap"><span class="mono" style="color:#3B2716">${d.w}</span><h3>${d.t}</h3><p>${d.p}</p>${d.k.length ? `<div class="kpis">${d.k.map((x) => `<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div>` : ''}</div>
  ${d.img ? `<figure class="pic ${d.img[2] || ''}"><img src="${d.img[0]}" alt=""><small>${d.img[1]}</small></figure>` : ''}${d.fx ? piece(d.fx, fx) : ''}`;
    const el = det.querySelector<HTMLElement>('.fx');
    if (d.fx && el) stopFx = run(d.fx, el);
  }

  // Inclinación hacia el cursor en toda la ficha (máx. 9°) y la animación propia de cada pieza.
  function run(kind: NonNullable<Step['fx']>, el: HTMLElement): () => void {
    const obj = el.querySelector<HTMLElement>('.obj')!, T: number[] = [], ac = new AbortController(), sig = { signal: ac.signal };
    const later = (f: () => void, ms: number) => { T.push(window.setTimeout(f, ms)); };
    let hov = false;
    if (FINE && !RM) {
      det.addEventListener('pointerenter', () => { hov = true; }, sig);
      det.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        const cx = Math.max(-1, Math.min(1, x * 2 - 1)), cy = Math.max(-1, Math.min(1, y * 2 - 1));
        obj.style.setProperty('--tx', (-cy * 9).toFixed(1) + 'deg');
        obj.style.setProperty('--ty', (cx * 9).toFixed(1) + 'deg');
        obj.style.setProperty('--sx', (x * 100).toFixed(0) + '%');
        obj.style.setProperty('--sy', (y * 100).toFixed(0) + '%');
        obj.style.setProperty('--so', '1');
        if (kind === 'docs') obj.style.setProperty('--f', Math.max(0, Math.min(1, 1.35 - Math.hypot(cx, cy) * 0.55)).toFixed(2));
      }, sig);
      det.addEventListener('pointerleave', () => {
        hov = false;
        ['--tx', '--ty', '--so'].forEach((p) => obj.style.removeProperty(p));
        if (kind === 'docs') obj.style.setProperty('--f', '1');
      }, sig);
    }
    if (kind === 'dash') {
      const lis = [...el.querySelectorAll<HTMLElement>('.pipe li')], tok = el.querySelector<HTMLElement>('.tok')!;
      let hold = -1, i = 0;
      const go = (k: number) => {
        const li = lis[k];
        tok.style.setProperty('--y', li.offsetTop + (li.offsetHeight - 29) / 2 + 'px');
        lis.forEach((l, j) => { l.classList.toggle('on', j <= k); l.classList.toggle('here', j === k); });
      };
      if (RM) { go(3); lis[3].classList.remove('here'); }
      else {
        const tick = () => { if (hold < 0) { go(i); i = (i + 1) % 4; } later(tick, i === 0 ? 1600 : 900); };
        tick();
        lis.forEach((l, k) => {
          l.addEventListener('pointerenter', () => { hold = k; go(k); }, sig);
          l.addEventListener('pointerleave', () => { hold = -1; }, sig);
        });
      }
    }
    if (kind === 'docs' && !RM) {
      const fold = () => {
        if (!hov) { obj.style.setProperty('--f', '0'); later(() => { if (!hov) obj.style.setProperty('--f', '1'); }, 2200); }
        later(fold, 4400);
      };
      later(fold, 1400);
    }
    if (kind === 'chat') {
      const q = el.querySelector('.q')!, a = el.querySelector('.a')!, t = el.querySelector('.t')!;
      const play = () => {
        T.splice(0).forEach(clearTimeout);
        [q, a, t].forEach((n) => n.classList.remove('show'));
        el.classList.remove('think');
        if (RM) { [q, a, t].forEach((n) => n.classList.add('show')); return; }
        later(() => q.classList.add('show'), 300);
        later(() => el.classList.add('think'), 900);
        later(() => { el.classList.remove('think'); a.classList.add('show'); }, 2300);
        later(() => t.classList.add('show'), 2700);
        later(play, 8000);
      };
      play();
      el.addEventListener('pointerenter', play, sig);
    }
    return () => { T.forEach(clearTimeout); ac.abort(); };
  }

  const onClick = (e: MouseEvent) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.stop');
    if (b) show(Number(b.dataset.i));
  };
  line.addEventListener('click', onClick);
  show(ui.first);

  return () => {
    stopFx();
    line.removeEventListener('click', onClick);
    line.innerHTML = '';
    det.innerHTML = '';
  };
}
