// Títulos que se arman letra por letra al entrar (maqueta): cada .dec dentro de root corre una vez, 750 ms,
// cuando se ve al 60 %. Con movimiento reducido no hace nada. La limpieza deja el texto original.

const GL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&';
const DUR = 750;

export function mount(root: Element): () => void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const running = new Map<Element, { raf: number; restore: () => void }>();

  function decode(el: Element) {
    const nodes: { node: Text; path: Element[] }[] = [];
    const walk = (n: Node, path: Element[]) => n.childNodes.forEach((c) => {
      if (c.nodeType === 3) nodes.push({ node: c as Text, path });
      else if (c.nodeType === 1) walk(c, [...path, c as Element]);
    });
    walk(el, []);
    const originalChildren = [...el.childNodes];
    const fonts = new Map<string, Map<string, number>>();
    const fontProperties = ['font-family', 'font-size', 'font-weight', 'font-style', 'font-stretch',
      'font-variation-settings', 'font-feature-settings', 'font-kerning', 'letter-spacing', 'text-transform'];
    // Todas las lecturas ocurren sobre el texto original, antes de introducir cajas.
    const measured = nodes.map(({ node, path }) => {
      const text = node.data, cs = getComputedStyle(node.parentElement!);
      const properties = fontProperties.map((name) => cs.getPropertyValue(name));
      const key = JSON.stringify(properties);
      let glyphs = fonts.get(key);
      if (!glyphs) { glyphs = new Map(); fonts.set(key, glyphs); }
      const probe = document.createElement('span');
      probe.style.cssText = 'position:fixed;visibility:hidden;white-space:pre;pointer-events:none';
      fontProperties.forEach((name, i) => probe.style.setProperty(name, properties[i]));
      const probeText = document.createTextNode('');
      probe.appendChild(probeText);
      document.body.appendChild(probe);
      for (const ch of new Set([...GL, ...text])) {
        if (glyphs.has(ch)) continue;
        probeText.data = ch;
        const range = document.createRange();
        range.selectNodeContents(probeText);
        glyphs.set(ch, range.getBoundingClientRect().width);
      }
      probe.remove();
      let offset = 0;
      return [...text].map((ch, index) => {
        const range = document.createRange();
        range.setStart(node, offset);
        offset += ch.length;
        range.setEnd(node, offset);
        return { ch, width: range.getBoundingClientRect().width, path, index, length: text.length, glyphs };
      });
    });
    const style = (el as HTMLElement).style;
    const height = style.getPropertyValue('height'), priority = style.getPropertyPriority('height');
    const label = el.getAttribute('aria-label');
    const originalText = el.textContent!;
    const letters: { glyph: HTMLSpanElement; ch: string; index: number; length: number; width: number; glyphs: Map<string, number> }[] = [];
    const restoreHeight = () => {
      if (height) style.setProperty('height', height, priority);
      else style.removeProperty('height');
    };
    style.height = `${el.getBoundingClientRect().height}px`;
    el.setAttribute('aria-label', originalText);
    const fragment = document.createDocumentFragment();
    let word: HTMLSpanElement | undefined;
    let activePath: Element[] = [], clones: Element[] = [];
    // Los originales permanecen intactos; una palabra puede cruzar varios elementos de formato.
    const formattedParent = (base: Node, path: Element[]) => {
      let shared = 0;
      while (shared < path.length && activePath[shared] === path[shared]) shared++;
      clones.length = shared;
      for (let i = shared; i < path.length; i++) {
        const clone = path[i].cloneNode(false) as Element;
        (i ? clones[i - 1] : base).appendChild(clone);
        clones.push(clone);
      }
      activePath = path;
      return clones.at(-1) || base;
    };
    measured.flat().forEach(({ ch, width, path, index, length, glyphs }) => {
        if (/\s/.test(ch)) {
          word = undefined;
          activePath = []; clones = [];
          formattedParent(fragment, path).appendChild(document.createTextNode(ch));
          activePath = []; clones = [];
          return;
        }
        if (!word) {
          word = document.createElement('span');
          word.style.whiteSpace = 'nowrap';
          word.setAttribute('aria-hidden', 'true');
          fragment.appendChild(word);
          activePath = []; clones = [];
        }
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.width = `${width}px`;
        span.style.textAlign = 'center';
        span.style.overflow = 'visible';
        const glyph = document.createElement('span');
        glyph.style.cssText = 'display:block;position:relative;left:50%;transform-origin:center;transition:none';
        span.appendChild(glyph);
        formattedParent(word, path).appendChild(span);
        letters.push({ glyph, ch, index, length, width, glyphs: glyphs! });
    });
    el.replaceChildren(fragment);
    const restore = () => {
      el.replaceChildren(...originalChildren);
      if (label === null) el.removeAttribute('aria-label');
      else el.setAttribute('aria-label', label);
      restoreHeight();
    };
    const run = { raf: 0, restore };
    running.set(el, run);
    const t0 = performance.now();
    (function step() {
      const k = (performance.now() - t0) / DUR;
      letters.forEach(({ glyph, ch, index, length, width, glyphs }) => {
        const current = k > (index / length) * 0.8 ? ch : GL[(Math.random() * GL.length) | 0];
        const glyphWidth = glyphs.get(current)!;
        glyph.textContent = current;
        glyph.style.width = `${glyphWidth}px`;
        glyph.style.transform = `translateX(-50%) scaleX(${Math.min(1, width / (glyphWidth || 1))})`;
      });
      if (k < 1) run.raf = requestAnimationFrame(step);
      else {
        restore();
        running.delete(el);
      }
    })();
  }

  const io = new IntersectionObserver(
    (es) => es.forEach((e) => {
      if (e.isIntersecting) {
        decode(e.target);
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.6 },
  );
  root.querySelectorAll('.dec').forEach((el) => io.observe(el));

  return () => {
    io.disconnect();
    running.forEach(({ raf, restore }) => {
      cancelAnimationFrame(raf);
      restore();
    });
    running.clear();
  };
}
