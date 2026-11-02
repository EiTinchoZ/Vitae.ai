// Lo que reciben las piezas al cargar three (ver load.ts). No importar directo desde componentes.
import * as THREE from 'three';

export { THREE };
export { scene, studio } from './scene';
export { TOOLS, makeKey, type Tool } from './logos3d';
export { loadGLB } from './loader';
