// Envuelve el código vivo de una figura en `export function mount()`. La página importa el runtime una sola vez
// (IsoFigure) y llama a mount() cada vez que pone el fragmento, así que una figura que se vuelve a montar (StrictMode,
// volver desde /demo) no queda muerta. rAF, timers e IntersectionObserver se sombrean dentro de mount() para que la
// limpieza los corte; los listeners viven en nodos del fragmento y se van con él.
export const asModule = (live, dispose = "") => `export function mount() {
let dead = false;
const rafs = new Set(), timers = new Set(), observers = [];
const requestAnimationFrame = (cb) => { if (dead) return 0; const id = window.requestAnimationFrame((t) => { rafs.delete(id); cb(t); }); rafs.add(id); return id; };
const cancelAnimationFrame = (id) => { rafs.delete(id); window.cancelAnimationFrame(id); };
const setTimeout = (cb, ms, ...a) => { if (dead) return 0; const id = window.setTimeout(() => { timers.delete(id); cb(...a); }, ms); timers.add(id); return id; };
const clearTimeout = (id) => { timers.delete(id); window.clearTimeout(id); };
class IntersectionObserver extends window.IntersectionObserver { constructor(cb, o) { super(cb, o); observers.push(this); } }
${live}
return () => { dead = true;${dispose ? " " + dispose : ""} rafs.forEach((id) => window.cancelAnimationFrame(id)); timers.forEach((id) => window.clearTimeout(id)); observers.forEach((o) => o.disconnect()); };
}
`;
