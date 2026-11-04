// Reuse the scene's canvas: a detached probe followed by loseContext() produces
// a misleading Firefox warning. Three r170 requires WebGL2; WebGL1 is not enough.
// WebGLRenderer reuses this same context, including after a StrictMode remount.
export function hasWebGL(canvas: HTMLCanvasElement | null) {
  try {
    return !!canvas?.getContext('webgl2', { antialias: true, alpha: true });
  } catch {
    return false;
  }
}
