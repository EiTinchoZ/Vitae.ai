// Figuras isométricas: tools/figs genera <nombre>.<lang>.html, <nombre>.<lang>.js e iso.css en public/fig/.
// El marcado estático deja un comentario <!--fig:nombre--> donde va la figura. Unos 600 px antes de que se vea, se
// traen iso.css (una vez por página) y el fragmento, se pone en su lugar y se importa el runtime, que exporta mount().
// El runtime se importa una sola vez; mount() se llama en cada montaje. La limpieza deja el comentario como estaba.
type Runtime = { mount: () => () => void };

const runtimes = new Map<string, Promise<Runtime>>();
const runtime = (name: string, lang: 'es' | 'en') => {
  const url = `/fig/${name}.${lang}.js`;
  if (!runtimes.has(url)) runtimes.set(url, import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url));
  return runtimes.get(url)!;
};

let css: Promise<void> | null = null;
const isoCss = () => (css ??= new Promise((ok, ko) => {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = '/fig/iso.css';
  l.onload = () => ok();
  l.onerror = () => ko(new Error('iso.css no cargó'));
  document.head.append(l);
}));

// el comentario que marca la figura; su padre es el anfitrión
function findHost(root: ParentNode, name: string): HTMLElement | null {
  const w = document.createTreeWalker(root as Node, NodeFilter.SHOW_COMMENT);
  for (let n = w.nextNode(); n; n = w.nextNode()) if (n.nodeValue === `fig:${name}`) return n.parentElement;
  return null;
}

export function mount(root: ParentNode, name: string, lang: 'es' | 'en'): () => void {
  const host = findHost(root, name);
  if (!host) return () => {};
  const ctl = new AbortController();
  let stop: (() => void) | null = null;

  async function load() {
    const [html] = await Promise.all([
      fetch(`/fig/${name}.${lang}.html`, { signal: ctl.signal }).then((r) => {
        if (!r.ok) throw new Error(`fig ${name}: ${r.status}`);
        return r.text();
      }),
      isoCss(),
    ]);
    if (ctl.signal.aborted) return;
    const rt = await runtime(name, lang);
    if (ctl.signal.aborted) return;
    host!.innerHTML = `<!--fig:${name}-->` + html;
    stop = rt.mount();
  }

  const io = new IntersectionObserver((es) => {
    if (!es.some((e) => e.isIntersecting)) return;
    io.disconnect();
    load().catch((e) => { if (!ctl.signal.aborted) console.error(e); });
  }, { rootMargin: '600px 0px' });
  io.observe(host);

  return () => {
    io.disconnect();
    ctl.abort();
    stop?.();
    host.innerHTML = `<!--fig:${name}-->`;
  };
}
