// La vista de cerca de la laptop, portada de la maqueta (fig/zoom.js): un VS Code plano y legible donde Claude Code
// y Codex arman el mini-sitio del QR, archivo por archivo, hasta que el teléfono muestra la tarjeta terminada.
// Lee el modelo de la laptop (window.LAP, del runtime de la figura) para la carga, la CPU y el color del RGB.
// La figura llega tarde (IsoFigure), así que #figLap se busca al abrir. mount() devuelve la limpieza: listeners,
// rAF, animaciones y el marcado de #vsz como estaba.
import type { Action, Agent, zoom as Z } from '@/content/es/laptop';

type Lap = {
  drive(w: number, t: number): void;
  release(): void;
  state(): { tps: number; temp: number; rpm: number; load: number };
  color(): string;
  colorKey(): string;
  setColor(m: string): void;
  screen(): Element | null;
};
type Sfx = { play(name: string): void };
type Act = { kind?: string; update(dt: number): boolean; finish(): void; file?: string; line?: number };

export function mount(sec: HTMLElement, z: typeof Z): () => void {
  const root = sec.querySelector<HTMLElement>('#vsz');
  if (!root) return () => {};
  const html0 = root.innerHTML;
  const wrap = sec.querySelector<HTMLElement>('.wrap')!, copy = sec.querySelector<HTMLElement>('.rig-copy')!;
  const fig = () => sec.querySelector<HTMLElement>('#figLap');
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const $ = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const $$ = (s: string) => [...root.querySelectorAll<HTMLElement>(s)];
  const el = {
    title: $('[data-z-title]'), tabs: $('[data-z-tabs]'), code: $('[data-z-code]'), term: $('[data-z-term]'),
    files: $$('[data-file]'), agents: $$('[data-agent]'),
    chat: { claude: $('[data-z-chat=claude]'), codex: $('[data-z-chat=codex]') } as Record<Agent, HTMLElement>,
    site: $('[data-z-site]'), extra: $('[data-z-extra]'), step: $('[data-z-step]'), who: $('[data-z-who]'), hw: $('[data-z-hw]'), ln: $('[data-z-ln]'),
    pause: $('[data-z-pause]'), next: $('[data-z-next]'), close: $('[data-z-close]'), ask: $<HTMLFormElement>('[data-z-ask]'), input: $<HTMLInputElement>('[data-z-ask] input'),
  };
  const LAP = () => (window as unknown as { LAP?: Lap }).LAP;
  const SFX = () => (window as unknown as { SFX?: Sfx }).SFX;
  const off = new AbortController(), on = { signal: off.signal };

  let files: Record<string, string>, tabs: string[], active: string, fresh: Record<string, Set<number>>;
  let isOpen = false, opener: Element | null = null, anims: Animation[] = [];

  const acc = () => (LAP()?.colorKey?.() === 'rainbow' ? 'var(--rgb)' : LAP()?.colorKey?.() || '#FF5A14');

  let steps: typeof z.script, si = 0, ai = 0, cur: Act | null = null, paused = false, finished = false;

  // resaltado mínimo por tipo de archivo
  const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  function hl(line: string, ext: string) {
    const h = esc(line);
    if (ext === 'md') {
      if (/^#/.test(line)) return '<b class="zk">' + h + '</b>';
      return h.replace(/^(\s*)(-|\d+\.)/, '$1<i class="zp">$2</i>').replace(/^([A-ZÁÉÍÓÚa-z][\wáéíóú ]{2,14}):/, '<i class="za">$1</i>:');
    }
    if (ext === 'html' || ext === 'svg') return h.replace(/([\w-]+)=(&quot;.*?&quot;)/g, '<i class="za">$1</i>=<i class="zs">$2</i>').replace(/(&lt;\/?)([a-z0-9]+)/g, '$1<b class="zk">$2</b>');
    if (ext === 'css') {
      const i = h.indexOf('{');
      if (i < 0) return h;
      return '<b class="zk">' + h.slice(0, i) + '</b>' + h.slice(i).replace(/([{;])([\w-]+):/g, '$1<i class="za">$2</i>:');
    }
    return h;
  }
  function render() {
    const text = files[active] ?? '', ext = active.split('.').pop()!;
    const lines = text.split('\n');
    if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
    const typing = cur?.kind === 'type' && cur.file === active;
    el.code.innerHTML = lines.map((l, i) => '<span class="zl' + (fresh[active]?.has(i) ? ' zn' : '') + '"><i class="zg">' + (i + 1) + '</i>' + hl(l, ext) + (typing && i === cur!.line ? '<i class="zc"></i>' : '') + '</span>').join('') || '<span class="zl"><i class="zg">1</i><i class="zc"></i></span>';
    // solo mueve el panel de código: scrollIntoView también arrastraba la página hacia la laptop
    const zc = typing ? el.code.querySelector('.zc') : null;
    if (zc) {
      const c = zc.getBoundingClientRect(), b = el.code.getBoundingClientRect();
      if (c.bottom > b.bottom) el.code.scrollTop += c.bottom - b.bottom + 8;
      else if (c.top < b.top) el.code.scrollTop -= b.top - c.top + 8;
    }
    el.ln.textContent = 'Ln ' + (typing ? cur!.line! + 1 : lines.length) + ' · ' + z.langs[ext];
  }
  function renderTabs() {
    el.tabs.innerHTML = tabs.map((f) => '<span class="zt' + (f === active ? ' on' : '') + '" data-ext="' + f.split('.').pop() + '">' + esc(f) + '</span>').join('');
    el.files.forEach((li) => li.classList.toggle('on', li.dataset.file === active));
    el.title.textContent = active + z.titleTail;
  }
  function openFile(f: string) {
    if (!tabs.includes(f)) tabs.push(f);
    active = f; renderTabs(); render();
  }
  function agent(a: Agent) {
    el.agents.forEach((b) => { const sel = b.dataset.agent === a; b.setAttribute('aria-selected', String(sel)); b.tabIndex = sel ? 0 : -1; });
    (Object.entries(el.chat) as [Agent, HTMLElement][]).forEach(([k, c]) => (c.hidden = k !== a));
    el.who.textContent = z.names[a];
    root!.dataset.agent = a;
  }
  function bubble(a: Agent, text: string, user: boolean) {
    const p = document.createElement('p');
    p.className = user ? 'zu' : 'zm';
    p.textContent = text;
    el.chat[a].append(p);
    el.chat[a].scrollTop = el.chat[a].scrollHeight;
    return p;
  }
  function piece(name: string) {
    if (name === 'styled' || name === 'focus' || name === 'big') el.site.classList.add(name);
    else el.site.querySelector('[data-piece="' + name + '"]')?.classList.add('on');
  }
  function addButton(label: string) {
    // un botón por etiqueta y como mucho 6 extra, para que la mini web siga cabiendo en el teléfono
    if ([...el.extra.children].some((x) => x.textContent === label)) return;
    if (el.extra.children.length >= 8) el.extra.firstElementChild?.remove();
    const a = document.createElement('a');
    a.textContent = label; a.className = 'on';
    el.extra.append(a);
    const nav = el.extra.closest('nav');
    nav?.classList.toggle('many', nav.querySelectorAll('a').length > 3);
  }
  // achica la tarjeta lo justo para que todo quepa en la pantalla del teléfono, pidan lo que pidan
  function fitSite() {
    const card = el.site.querySelector<HTMLElement>('.mq-card');
    if (!card) return;
    card.style.zoom = '';
    const kids = [...card.children].map((k) => k.getBoundingClientRect()).filter((r) => r.height);
    if (!kids.length) return;
    const pad = parseFloat(getComputedStyle(card).paddingTop) * 2;
    const need = Math.max(...kids.map((r) => r.bottom)) - Math.min(...kids.map((r) => r.top)) + pad;
    const room = el.site.clientHeight;
    if (need > room) card.style.zoom = String(Math.max(0.5, room / need));
  }
  let fitQ = 0;
  let fitT = 0;
  const fitObs = new MutationObserver(() => { cancelAnimationFrame(fitQ); fitQ = requestAnimationFrame(fitSite); clearTimeout(fitT); fitT = window.setTimeout(fitSite, 600); });
  fitObs.observe(el.site, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });

  // cada acción devuelve { update(dt) -> terminó, finish() }
  const wait = (s: number): Act => { let t = 0; return { update(dt) { return (t += dt) >= s; }, finish() {} }; };
  const ACT: Record<string, (...a: never[]) => Act> = {
    agent: (a: Agent) => (agent(a), wait(0.3)),
    open: (f: string) => (openFile(f), wait(0.35)),
    load: (w: number, t: number) => (LAP()?.drive(w, t), wait(0)),
    wait: (s: number) => wait(s),
    term: (text: string, cls?: string) => {
      const d = document.createElement('div');
      d.textContent = text; if (cls) d.className = cls;
      el.term.append(d); el.term.scrollTop = el.term.scrollHeight;
      SFX()?.play(cls ? 'probe' : 'key');
      return wait(0.15);
    },
    user: (a: Agent, text: string) => { bubble(a, text, true); SFX()?.play('prompt'); return wait(0.4 + text.length * 0.012); },
    say: (a: Agent, text: string) => {
      const dots = bubble(a, '', false); dots.classList.add('zdots');
      let t = 0, done = false;
      const o: Act = {
        update(dt) { t += dt; if (t > 0.55 && !done) o.finish(); return t > 0.5 + text.length * 0.014; },
        finish() { if (done) return; done = true; dots.classList.remove('zdots'); dots.textContent = text; el.chat[a].scrollTop = el.chat[a].scrollHeight; },
      };
      return o;
    },
    type: (file: string, src: string | ((acc: string) => string), marks: Record<number, string> = {}) => {
      const text = typeof src === 'function' ? src(acc()) : src;
      if (active !== file) openFile(file);
      const base = files[file], first = base ? base.split('\n').length - 1 : 0;
      let n = 0, nl0 = 0;
      const apply = (k: number) => {
        const part = text.slice(0, k);
        files[file] = base + part;
        const nl = (part.match(/\n/g) || []).length;
        const f = (fresh[file] ||= new Set());
        for (let i = 0; i <= nl; i++) f.add(first + i);
        for (let i = nl0 + 1; i <= nl; i++) if (marks[i]) piece(marks[i]);
        nl0 = nl; o.line = first + nl;
        if (active === file) render();
      };
      const o: Act = {
        kind: 'type', file, line: first,
        update(dt) {
          const before = Math.floor(n);
          n = Math.min(text.length, n + dt * 58);
          const now = Math.floor(n);
          if (now !== before) { apply(now); if (now % 3 === 0) SFX()?.play('key'); }
          return now >= text.length;
        },
        finish() { apply(text.length); n = text.length; },
      };
      return o;
    },
    rgb: (hex: string) => { LAP()?.setColor(hex); return wait(0.2); },
    btn: (label: string) => (addButton(label), wait(0.2)),
    piece: (name: string) => (piece(name), wait(0.2)),
  };

  function reset() {
    files = { ...z.start }; tabs = ['agents.md']; active = 'agents.md'; fresh = {};
    steps = z.script.slice(); si = 0; ai = 0; cur = null; finished = false;
    el.chat.claude.textContent = ''; el.chat.codex.textContent = '';
    el.term.innerHTML = '<div class="zdim">' + esc(z.prompt) + '</div>';
    el.site.className = 'mq'; el.site.querySelectorAll('[data-piece]').forEach((p) => p.classList.remove('on')); el.extra.textContent = ''; el.extra.closest('nav')?.classList.remove('many');
    el.next.textContent = z.ui.next;
    agent('claude'); renderTabs(); render(); setStep();
  }
  function setStep() {
    const s = steps[Math.min(si, steps.length - 1)];
    el.step.textContent = finished ? z.ui.done : si + 1 + '/' + steps.length + ' · ' + s.name;
  }
  function begin(a: Action) {
    const [kind, ...args] = a;
    const o = (ACT[kind] as (...x: unknown[]) => Act)(...args);
    o.kind ||= kind;
    return o;
  }
  // un paso del guion por cuadro; al terminar todos, queda esperando al visitante
  function advance(dt: number) {
    if (finished) return;
    if (!cur) {
      if (si >= steps.length) return finish();
      const st = steps[si];
      if (ai >= st.run.length) { si++; ai = 0; fresh = {}; if (si >= steps.length) return finish(); setStep(); return; }
      cur = begin(st.run[ai]);
    }
    if (cur.update(dt)) { cur.finish(); cur = null; ai++; render(); }
  }
  function finish() {
    finished = true; cur = null; LAP()?.drive(0.06, 0); setStep();
    el.next.textContent = z.ui.again;
  }
  // termina el paso en curso al instante
  function skipStep() {
    if (finished) { reset(); return; }
    const st = steps[si];
    if (cur) { cur.finish(); cur = null; ai++; }
    while (ai < st.run.length) { const o = begin(st.run[ai]); o.finish(); ai++; }
    render();
  }
  function skipAll() { while (!finished) { skipStep(); advance(0); } }

  // lo que pide el visitante: Claude lo anota en agents.md y, si sabe hacerlo, lo hace
  function request(text: string) {
    const q = z.ask;
    const t = text.trim().replace(/\s+/g, ' ').slice(0, 60);
    if (!t) return;
    skipAll();
    const low = t.toLowerCase();
    const run: Action[] = [['agent', 'claude'], ['user', 'claude', t], ['load', 0.2, 72], ['say', 'claude', q.note], ['open', 'agents.md'], ['type', 'agents.md', q.line(t)]];
    let doneMsg = q.later;
    const color = Object.keys(q.colors).find((c) => low.includes(c));
    const social = (low.match(q.social) || [])[0];
    if (color || q.isColor.test(low)) {
      const order = Object.keys(q.colorName), now = LAP()?.colorKey?.() || 'rainbow';
      const hex = color ? q.colors[color] : order[(order.indexOf(now) + 1) % order.length];
      run.push(['open', 'styles.css'], ['type', 'styles.css', ':root{--acc:' + (hex === 'rainbow' ? 'var(--rgb)' : hex) + '}\n'], ['rgb', hex]);
      doneMsg = q.colorDone(q.colorName[hex]);
    } else if (q.isMail.test(low)) {
      run.push(['open', 'index.html'], ['type', 'index.html', q.mail.code], ['btn', q.mail.label]);
      doneMsg = q.mail.done;
    } else if (social || q.isLink.test(low)) {
      const brand: Record<string, string> = { tiktok: 'TikTok', youtube: 'YouTube', whatsapp: 'WhatsApp', linkedin: 'LinkedIn', github: 'GitHub' };
      const label = social ? brand[social] ?? social[0].toUpperCase() + social.slice(1) : q.link.label;
      run.push(['open', 'index.html'], ['type', 'index.html', '<a href="/' + (social || q.link.slug) + '">' + label + '</a>\n'], ['btn', label]);
      doneMsg = q.link.done(label);
    } else if (q.isPhoto.test(low)) {
      run.push(['open', 'index.html'], ['type', 'index.html', q.photo.code], ['piece', 'ava']);
      doneMsg = q.photo.done;
    } else if (q.isBig.test(low)) {
      run.push(['open', 'styles.css'], ['type', 'styles.css', q.big.code], ['piece', 'big']);
      doneMsg = q.big.done;
    }
    run.push(['load', 0.06, 0], ['say', 'claude', doneMsg]);
    steps = [...steps, { name: z.ui.yourStep, who: 'claude', run }];
    si = steps.length - 1; ai = 0; finished = false; fresh = {};
    el.next.textContent = z.ui.next; setStep();
    if (still.matches) skipAll();
    else play();
  }

  // el bucle: corre solo con la vista abierta y sin pausa
  let frame = 0, last = 0;
  function tick(now: number) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
    last = now;
    if (!paused) advance(dt);
    const s = LAP()?.state?.();
    if (s) el.hw.textContent = 'CPU ' + Math.round(s.temp) + ' °C · ' + Math.round(s.rpm / 50) * 50 + ' rpm';
    root!.style.setProperty('--acc', LAP()?.color?.() || '#FF5A14');
    el.code.classList.toggle('typing', cur?.kind === 'type');
    frame = isOpen ? requestAnimationFrame(tick) : 0;
  }
  function play() { if (!frame && isOpen) { last = 0; frame = requestAnimationFrame(tick); } }

  // entrar: la laptop vuela hacia la pantalla y la ventana crece desde ese rectángulo
  const box = (a: Element, b: Element) => { const r = a.getBoundingClientRect(), q = b.getBoundingClientRect(); return { x: r.left - q.left, y: r.top - q.top, w: r.width, h: r.height }; };
  const EASE = 'cubic-bezier(.7,0,.2,1)';
  function openZoom() {
    if (isOpen) return;
    isOpen = true; opener = document.activeElement;
    if (!files) reset();
    root!.hidden = false;
    wrap.style.minHeight = root!.offsetHeight + 'px';
    const scr = LAP()?.screen?.(), f0 = fig();
    anims.forEach((a) => a.cancel()); anims = [];
    if (!still.matches && scr && f0) {
      const s = box(scr, wrap), o = box(root!, wrap), f = box(f0, wrap);
      const k = Math.min(6, o.w / s.w), dx = o.x + o.w / 2 - (s.x + s.w / 2), dy = o.y + o.h / 2 - (s.y + s.h / 2);
      f0.style.transformOrigin = (s.x - f.x + s.w / 2) + 'px ' + (s.y - f.y + s.h / 2) + 'px';
      const opt: KeyframeAnimationOptions = { duration: 640, easing: EASE, fill: 'forwards' };
      anims = [
        f0.animate([{ transform: 'none', opacity: 1 }, { opacity: 1, offset: 0.55 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + k + ')', opacity: 0 }], opt),
        root!.animate([{ transform: 'translate(' + -dx + 'px,' + -dy + 'px) scale(' + s.w / o.w + ',' + s.h / o.h + ')', opacity: 0 }, { opacity: 0, offset: 0.4 }, { transform: 'none', opacity: 1 }], opt),
        copy.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }),
      ];
    }
    sec.classList.add('zoomed');
    SFX()?.play('click');
    root!.focus({ preventScroll: true });
    const r = root!.getBoundingClientRect();
    if (r.top < 70 || r.bottom > innerHeight) root!.scrollIntoView({ block: r.height > innerHeight - 90 ? 'start' : 'center', behavior: still.matches ? 'auto' : 'smooth' });
    if (still.matches) skipAll(); else play();
  }
  const settle = () => { root!.hidden = true; wrap.style.minHeight = ''; anims.forEach((a) => a.cancel()); anims = []; const f0 = fig(); if (f0) f0.style.transformOrigin = ''; };
  function closeZoom() {
    if (!isOpen) return;
    isOpen = false;
    LAP()?.release();
    sec.classList.remove('zoomed');
    if (anims.length) { anims.forEach((a) => a.reverse()); anims[0].onfinish = settle; } else settle();
    SFX()?.play('click');
    (opener && opener !== document.body ? (opener as HTMLElement) : fig()?.querySelector<HTMLElement>('.iso-stage'))?.focus({ preventScroll: true });
  }

  document.addEventListener('lap:zoom', openZoom, on);
  sec.querySelectorAll('[data-zoom-open]').forEach((b) => b.addEventListener('click', openZoom, on));
  el.close.addEventListener('click', closeZoom, on);
  el.pause.addEventListener('click', () => { paused = !paused; el.pause.setAttribute('aria-pressed', String(paused)); el.pause.textContent = paused ? z.ui.resume : z.ui.pause; }, on);
  el.next.addEventListener('click', () => { skipStep(); advance(0); }, on);
  el.agents.forEach((b) => b.addEventListener('click', () => agent(b.dataset.agent as Agent), on));
  el.files.forEach((li) => li.addEventListener('click', () => { if (files?.[li.dataset.file!] !== undefined) openFile(li.dataset.file!); }, on));
  el.ask.addEventListener('submit', (e) => { e.preventDefault(); request(el.input.value); el.input.value = ''; }, on);
  $$('[data-z-chip]').forEach((b) => b.addEventListener('click', () => request(b.textContent!), on));
  root.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); closeZoom(); } }, on);
  addEventListener('resize', () => { if (isOpen) { wrap.style.minHeight = ''; wrap.style.minHeight = root!.offsetHeight + 'px'; } }, on);

  return () => {
    off.abort();
    cancelAnimationFrame(frame); frame = 0;
    fitObs.disconnect(); cancelAnimationFrame(fitQ); clearTimeout(fitT);
    if (isOpen) LAP()?.release();
    isOpen = false;
    anims.forEach((a) => a.onfinish = null);
    settle();
    sec.classList.remove('zoomed');
    root.innerHTML = html0;
    root.removeAttribute('data-agent');
    root.style.removeProperty('--acc');
  };
}
