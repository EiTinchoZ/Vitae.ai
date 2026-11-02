// Teclas 3D con los logos oficiales (Simple Icons, viewBox 24) extruidos sobre una tecla redondeada.
// Portado de maqueta/direcciones/logos3d.js; los SVG se sirven desde public/img/logos (sin CDN).
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export type Tool = {
  id: string;
  label: string;
  icon?: string;
  img?: string;
  color: string;
  cert?: boolean;
  social?: boolean;
};

const L = '/img/logos/';
export const TOOLS: Tool[] = [
  { id: 'claude', label: 'Claude', icon: L + 'claude.svg', color: '#D97757', cert: true },
  { id: 'ccode', label: 'Claude Code', icon: L + 'anthropic.svg', color: '#F0EEE6', cert: true },
  { id: 'chatgpt', label: 'ChatGPT', icon: L + 'openai.svg', color: '#FFFFFF' },
  { id: 'codex', label: 'Codex', img: L + 'codex-mark.png', color: '#FFFFFF' },
  { id: 'copilot', label: 'Copilot Studio', icon: L + 'copilot.svg', color: '#7FD6FF' },
  { id: 'ghcop', label: 'GitHub Copilot', icon: L + 'githubcopilot.svg', color: '#FFFFFF' },
  { id: 'python', label: 'Python', icon: L + 'python.svg', color: '#FFD43B' },
  { id: 'sap', label: 'SAP', icon: L + 'sap-mono.svg', color: '#3DA9F5' },
  { id: 'powerbi', label: 'Power BI', icon: L + 'powerbi.svg', color: '#F2C811' },
  { id: 'react', label: 'React', icon: L + 'react.svg', color: '#61DAFB' },
  { id: 'fastapi', label: 'FastAPI', icon: L + 'fastapi.svg', color: '#05C3A7' },
  { id: 'ts', label: 'TypeScript', icon: L + 'typescript.svg', color: '#4F8EF7' },
  { id: 'ig', label: 'Instagram', icon: L + 'instagram.svg', color: '#FF3D7F', social: true },
  { id: 'tiktok', label: 'TikTok', icon: L + 'tiktok.svg', color: '#FFFFFF', social: true },
];

// una geometría por logo, compartida entre piezas (hero, mapa); cada tecla usa un clon
const cache = new Map<string, Promise<THREE.ExtrudeGeometry>>();
async function logoGeometry(path: string, size: number) {
  if (!cache.has(path)) {
    cache.set(path, fetch(path).then((r) => {
      if (!r.ok) throw new Error(`${path}: ${r.status}`);
      return r.text();
    }).then((txt) => {
      const data = new SVGLoader().parse(txt);
      const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
      const g = new THREE.ExtrudeGeometry(shapes, { depth: 3, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.3, bevelSegments: 2, curveSegments: 10 });
      g.center();
      g.computeBoundingBox();
      const bb = g.boundingBox!, span = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y) / 24; // normaliza a 24 como los de Simple Icons
      if (span > 1.5) g.scale(1 / span, 1 / span, 1);
      return g;
    }));
  }
  const g = (await cache.get(path)!).clone();
  g.scale(size / 24, size / 24, size / 24);
  g.rotateX(Math.PI); // el SVG tiene y hacia abajo: girar en vez de escalar en negativo, así las caras no se invierten
  return g;
}

// Devuelve un Group: tecla + logo encima. base = color de la tecla.
export async function makeKey(tool: Tool, { base = '#17171B', size = 1, cap = 0.42 } = {}) {
  const g = new THREE.Group();
  const keyMat = new THREE.MeshPhysicalMaterial({ color: base, roughness: 0.35, metalness: 0.1, clearcoat: 0.8, clearcoatRoughness: 0.25 });
  const keyMesh = new THREE.Mesh(new RoundedBoxGeometry(size, size, cap * size, 4, 0.2 * size), keyMat);
  g.add(keyMesh);
  if (tool.img) { // marca sin SVG: calcomanía con su PNG oficial
    const tex = await new THREE.TextureLoader().loadAsync(tool.img).catch(() => null);
    if (tex) {
      tex.colorSpace = THREE.SRGBColorSpace;
      const d = new THREE.Mesh(new THREE.PlaneGeometry(size * 0.6, size * 0.6), new THREE.MeshBasicMaterial({ map: tex, color: tool.color, transparent: true, alphaTest: 0.3 }));
      d.position.z = (cap * size) / 2 + 0.012 * size;
      g.add(d);
    }
    g.userData = { tool, keyMat };
    return g;
  }
  try {
    const lg = await logoGeometry(tool.icon!, size * 0.58);
    const logo = new THREE.Mesh(lg, new THREE.MeshPhysicalMaterial({ color: tool.color, roughness: 0.25, metalness: 0.55, clearcoat: 1 }));
    logo.position.z = (cap * size) / 2 + 0.03 * size;
    g.add(logo);
  } catch { /* sin el SVG: queda la tecla sola */ }
  g.userData = { tool, keyMat };
  return g;
}
