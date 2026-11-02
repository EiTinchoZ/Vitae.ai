// three entra aparte del bundle inicial, una sola vez: todas las piezas 3D piden el mismo módulo
// (un chunk, una copia de THREE y una caché de logos compartidas).
const kit = () => import('./kit');
let p: ReturnType<typeof kit> | null = null;

export const loadThree = () => (p ??= kit());
