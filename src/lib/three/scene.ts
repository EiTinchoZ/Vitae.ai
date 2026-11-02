// Escena base de las piezas 3D de la landing (hero, mapa): renderer transparente, luz de estudio,
// y un bucle que solo dibuja mientras la sección se ve. dispose() suelta todo lo de GPU.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function studio(renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
  const pm = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pm.fromScene(room, 0.04).texture;
  room.dispose();
  pm.dispose();
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 5, 4);
  scene.add(key);
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
}

export function scene(canvas: HTMLCanvasElement, section: Element) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  r.setPixelRatio(Math.min(devicePixelRatio, 2));
  r.toneMapping = THREE.ACESFilmicToneMapping;
  const sc = new THREE.Scene();
  studio(r, sc);
  let on = false;
  const io = new IntersectionObserver((es) => { on = es[0].isIntersecting; });
  io.observe(section);
  return {
    r,
    sc,
    run: (fn: (t: number) => void) => r.setAnimationLoop((t) => { if (on) fn(t); }),
    // sin forceContextLoss: si React vuelve a montar (StrictMode) el canvas es el mismo y el contexto perdido no vuelve
    dispose() {
      r.setAnimationLoop(null);
      io.disconnect();
      sc.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        for (const mat of [m.material ?? []].flat()) {
          (mat as THREE.MeshBasicMaterial).map?.dispose();
          mat.dispose();
        }
      });
      sc.environment?.dispose();
      r.dispose();
    },
  };
}
