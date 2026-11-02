// GLTF con Draco servido desde public/draco/ (copia de three/examples/jsm/libs/draco/gltf/, misma versión de three).
// Un solo loader para toda la página: el decoder y sus workers se crean una vez y se reusan.
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

let gltf: GLTFLoader | null = null;

export function loadGLB(url: string): Promise<GLTF> {
  gltf ??= new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath('/draco/'));
  return gltf.loadAsync(url);
}
