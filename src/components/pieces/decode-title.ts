// Títulos que se arman letra por letra al entrar (maqueta): cada .dec dentro de root corre una vez, 750 ms,
// cuando se ve al 60 %. Con movimiento reducido no hace nada. La limpieza deja el texto original.

const GL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&';
const DUR = 750;

export function mount(root: Element): () => void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const running = new Map<Element, { raf: number; nodes: [Text, string][] }>();

  function decode(el: Element) {
    const nodes: [Text, string][] = [];
    const walk = (n: Node) => n.childNodes.forEach((c) => {
      if (c.nodeType === 3 && c.textContent!.trim()) nodes.push([c as Text, c.textContent!]);
      else if (c.nodeType === 1) walk(c);
    });
    walk(el);
    const run = { raf: 0, nodes };
    running.set(el, run);
    const t0 = performance.now();
    (function step() {
      const k = (performance.now() - t0) / DUR;
      nodes.forEach(([n, txt]) => {
        n.textContent = [...txt].map((ch, i) => (ch === ' ' || k > (i / txt.length) * 0.8 ? ch : GL[(Math.random() * GL.length) | 0])).join('');
      });
      if (k < 1) run.raf = requestAnimationFrame(step);
      else {
        nodes.forEach(([n, t]) => (n.textContent = t));
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
    running.forEach(({ raf, nodes }) => {
      cancelAnimationFrame(raf);
      nodes.forEach(([n, t]) => (n.textContent = t));
    });
    running.clear();
  };
}
