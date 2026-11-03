// ¿Hay WebGL? Se prueba una vez con un canvas suelto y se suelta el contexto. Sin WebGL las piezas 3D no cargan three
// (ni ensucian la consola): el hero y la cinta quedan con su HTML, y el mapa pinta su lista (metro-map.ts).
let ok: boolean | null = null;

export function hasWebGL() {
  if (ok !== null) return ok;
  try {
    const gl = document.createElement('canvas').getContext('webgl2') ?? document.createElement('canvas').getContext('webgl');
    ok = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    ok = false;
  }
  return ok;
}
