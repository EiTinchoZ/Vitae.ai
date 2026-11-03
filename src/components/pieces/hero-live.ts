// Lo vivo del hero sin three, portado de la maqueta: el nombre que se angosta cerca del cursor, la foto con
// paralaje, el sello de logros que rota y la bandera de Panamá con la hora real. mount() devuelve la limpieza.

type Copy = { wins: [string, string][]; clockLocale: string };

export function mount(hero: HTMLElement, { wins: WINS, clockLocale }: Copy): () => void {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(pointer:fine)').matches;
  const off: (() => void)[] = [];
  const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Window, ev: K, fn: (e: HTMLElementEventMap[K]) => void) => {
    el.addEventListener(ev, fn as EventListener);
    off.push(() => el.removeEventListener(ev, fn as EventListener));
  };
  const $ = <T extends HTMLElement = HTMLElement>(id: string) => hero.querySelector<T>('#' + id)!;

  /* nombre: cada letra se angosta, adelgaza y se enciende cerca del cursor */
  const h = $('h');
  const words = [...h.querySelectorAll<HTMLElement>('.w')].map((w) => [w, w.textContent ?? ''] as const);
  words.forEach(([w, t]) => { w.innerHTML = [...t].map((c) => `<i>${c}</i>`).join(''); });
  const LET = [...h.querySelectorAll<HTMLElement>('i')];
  if (FINE && !RM) on(window, 'pointermove', (e) => {
    if (scrollY > innerHeight) return;
    LET.forEach((s) => {
      const r = s.getBoundingClientRect(), d = Math.hypot(e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2), k = Math.max(0, 1 - d / 320);
      s.style.fontVariationSettings = `"wdth" ${125 - k * 63}, "wght" ${900 - k * 600}`;
      s.classList.toggle('hot', k > 0.72);
    });
  });

  /* foto: paralaje contra el disco */
  const core = $('core'), ph = $('ph'), disc = $('disc');
  if (FINE && !RM) {
    on(core, 'pointermove', (e) => {
      const r = core.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      ph.style.transform = `translate(${x * 16}px,${y * 10}px)`;
      disc.style.transform = `translate(${-x * 10}px,${-y * 8}px)`;
    });
    on(core, 'pointerleave', () => { ph.style.transform = ''; disc.style.transform = ''; });
  }

  /* sello de logros que rota */
  const stk = $('stk');
  let wi = 0, paused = false, flipT = 0;
  const stk0 = [stk.querySelector('small')!.textContent, stk.querySelector('span')!.textContent];
  stk.querySelector('.dots')!.innerHTML = WINS.map(() => '<b></b>').join('');
  function win(n: number) {
    wi = (n + WINS.length) % WINS.length;
    const set = () => {
      stk.querySelector('small')!.textContent = WINS[wi][0];
      stk.querySelector('span')!.textContent = WINS[wi][1];
      stk.classList.toggle('alt', wi % 2 === 1);
      stk.querySelectorAll('.dots b').forEach((b, i) => b.classList.toggle('on', i === wi));
    };
    if (RM) { set(); return; }
    stk.classList.remove('flip');
    void stk.offsetWidth;
    stk.classList.add('flip');
    clearTimeout(flipT);
    flipT = window.setTimeout(set, 225);
  }
  win(0);
  const rot = setInterval(() => { if (!paused && !document.hidden) win(wi + 1); }, 3200);
  on(stk, 'pointerenter', () => { paused = true; });
  on(stk, 'pointerleave', () => { paused = false; });
  on(stk, 'click', () => win(wi + 1));

  /* Panamá: bandera en 23 tiras que ondean, hora real de Panamá */
  const fl = $('fl'), flag = $('flag'), N = 23, W = 69;
  let gustT = 0;
  fl.innerHTML = Array.from({ length: N }, (_, k) => `<i style="background-position:${(-k * W) / N}px 0;animation-delay:${(-k * 0.075).toFixed(3)}s"></i>`).join('');
  on(flag, 'click', () => {
    flag.classList.remove('gust');
    void flag.offsetWidth;
    flag.classList.add('gust');
    window.SFX?.play('click');
    clearTimeout(gustT);
    gustT = window.setTimeout(() => flag.classList.remove('gust'), 1400);
  });
  const clk = $('clk'), fmt = new Intl.DateTimeFormat(clockLocale, { timeZone: 'America/Panama', hour: 'numeric', minute: '2-digit', hour12: true });
  const tick = () => { clk.textContent = fmt.format(new Date()).replace(/\s?a\.\s?m\./, ' a. m.').replace(/\s?p\.\s?m\./, ' p. m.'); };
  tick();
  const clkT = setInterval(tick, 15000);

  /* carreras (R2): la moneda gira sola al logo oficial, una y después la otra, y gira y se inclina hacia el cursor */
  const coins = [...hero.querySelectorAll<HTMLElement>('.cr')].map((cr) => ({ cr, in: cr.querySelector<HTMLElement>('.coin .in')!, near: false, idle: false }));
  const coinT: number[] = [];
  const paint = (c: (typeof coins)[number]) => c.in.style.setProperty('--flip', RM || c.near || c.idle ? '180deg' : '0deg');
  coins.forEach(paint);
  let coinI = 0;
  if (!RM) {
    const cycle = () => coins.forEach((c, i) => coinT.push(window.setTimeout(() => {
      if (c.near) return;
      c.idle = true; paint(c);
      coinT.push(window.setTimeout(() => { c.idle = false; paint(c); }, 2600));
    }, i * 1300)));
    coinT.push(window.setTimeout(cycle, 1200));
    coinI = window.setInterval(() => { coinT.length = 0; cycle(); }, 7000);
    if (FINE) on(window, 'pointermove', (e) => {
      if (scrollY > innerHeight) return;
      for (const c of coins) {
        const r = c.cr.getBoundingClientRect();
        const d = Math.hypot(Math.max(r.left - e.clientX, 0, e.clientX - r.right), Math.max(r.top - e.clientY, 0, e.clientY - r.bottom));
        const near = d < 70;
        if (near !== c.near) { c.near = near; paint(c); }
        const b = c.in.getBoundingClientRect(), k = Math.max(0, 1 - d / 260);
        const x = (e.clientX - b.left - b.width / 2) / 260, y = (e.clientY - b.top - b.height / 2) / 260;
        c.in.style.setProperty('--tx', (-y * 22 * k).toFixed(1) + 'deg');
        c.in.style.setProperty('--ty', (x * 22 * k).toFixed(1) + 'deg');
        c.in.style.setProperty('--gx', (140 - k * 100 - x * 40).toFixed(0) + '%');
      }
    });
  }

  return () => {
    off.forEach((f) => f());
    coinT.forEach(clearTimeout);
    clearInterval(coinI);
    coins.forEach((c) => ['--flip', '--tx', '--ty', '--gx'].forEach((p) => c.in.style.removeProperty(p)));
    clearInterval(rot);
    clearInterval(clkT);
    clearTimeout(flipT);
    clearTimeout(gustT);
    words.forEach(([w, t]) => { w.textContent = t; });
    ph.style.transform = '';
    disc.style.transform = '';
    stk.querySelector('.dots')!.innerHTML = '';
    stk.querySelector('small')!.textContent = stk0[0];
    stk.querySelector('span')!.textContent = stk0[1];
    stk.classList.remove('flip', 'alt');
    fl.innerHTML = '';
    flag.classList.remove('gust');
  };
}
