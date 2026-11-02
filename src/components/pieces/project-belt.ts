// Proyectos: cinta transportadora en 3D con una caja por proyecto, portada de la maqueta (línea ~1526). Pasar sobre una
// caja la levanta, frena la cinta y abre su ficha; clic en la cinta la acelera y las cajas saltan. Las tapas se pintan en
// canvas (logo o nombre, sello, "hecho en Panamá"). three llega por loadThree (chunk compartido con hero y mapa).
// mount() devuelve la limpieza; la ficha vuelve a la del primer proyecto, como sale del servidor.
import type { Mesh } from 'three';
import { loadThree } from '@/lib/three/load';
import type { Project } from '@/content/es/proyectos';

type Kit = Awaited<ReturnType<typeof loadThree>>;
type Data = { projects: Project[]; card: (d: Project) => string; lidText: { made: string } };

export function mount(sec: HTMLElement, data: Data): () => void {
  let alive = true;
  let stop: (() => void) | null = null;
  loadThree()
    .then((kit) => (alive ? start(kit, sec, data, () => alive) : null))
    .then((s) => { if (alive) stop = s; else s?.(); })
    .catch((e) => console.error(e));
  return () => {
    alive = false;
    stop?.();
  };
}

async function start({ THREE, scene }: Kit, sec: HTMLElement, D: Data, alive: () => boolean) {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const P = D.projects;
  const cv = sec.querySelector<HTMLCanvasElement>('#cPrj')!;
  const pc = sec.querySelector<HTMLElement>('#pcard')!;
  let shown = 0;
  const card = (i: number) => { shown = i; pc.innerHTML = D.card(P[i]); };

  const logos: Record<string, HTMLImageElement> = {};
  await Promise.all([
    document.fonts.load('900 80px "Big Shoulders Display"'),
    ...P.filter((d) => d.logo).map((d) => new Promise<void>((ok) => {
      const im = new Image();
      im.onload = () => { logos[d.n] = im; ok(); };
      im.onerror = () => ok();
      im.src = d.logo!;
    })),
  ]);
  if (!alive()) return null;

  const { r, sc, run, dispose } = scene(cv, sec);
  const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const rim = new THREE.DirectionalLight(0xFF7A3D, 1.8);
  rim.position.set(-5, 2, -4);
  sc.add(rim);
  const rig = new THREE.Group();
  sc.add(rig);
  const beltTex = (() => {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 512;
    const x = c.getContext('2d')!;
    x.fillStyle = '#202024'; x.fillRect(0, 0, 64, 512);
    x.fillStyle = '#303036';
    for (let i = 0; i < 512; i += 32) x.fillRect(0, i, 64, 14);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1, 6);
    return t;
  })();
  const LEN = 28;
  rig.add(new THREE.Mesh(new THREE.BoxGeometry(3, 0.25, LEN), new THREE.MeshStandardMaterial({ map: beltTex, roughness: 0.8 })));
  const railM = new THREE.MeshStandardMaterial({ color: '#FFD23F', roughness: 0.4, metalness: 0.3 });
  [-1.6, 1.6].forEach((x) => {
    const rl = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.42, LEN), railM);
    rl.position.set(x, 0.08, 0);
    rig.add(rl);
  });
  for (let z = -LEN / 2; z < LEN / 2; z += 2.2) {
    const ro = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 3.4, 16), new THREE.MeshStandardMaterial({ color: '#4a4a52', metalness: 0.8, roughness: 0.3 }));
    ro.rotation.z = Math.PI / 2;
    ro.position.set(0, -0.25, z);
    rig.add(ro);
  }
  const lid = (d: Project) => {
    const c = document.createElement('canvas');
    c.width = c.height = 1024;
    const x = c.getContext('2d')!;
    x.scale(2, 2);
    x.imageSmoothingQuality = 'high';
    x.fillStyle = '#F4F1EC'; x.fillRect(0, 0, 512, 512);
    x.strokeStyle = '#141416'; x.lineWidth = 14; x.strokeRect(7, 7, 498, 498);
    x.textAlign = 'center'; x.textBaseline = 'middle';
    if (logos[d.n]) {
      x.fillStyle = '#03080F'; x.fillRect(14, 120, 484, 160);
      x.drawImage(logos[d.n], 14, 124, 484, 154);
    } else {
      x.fillStyle = '#141416';
      x.font = '900 ' + (d.n.length > 9 ? 84 : 110) + 'px "Big Shoulders Display"';
      x.fillText(d.n.toUpperCase(), 256, 230);
    }
    x.save();
    x.translate(256, 370); x.rotate(-0.12);
    x.strokeStyle = '#FF5A14'; x.lineWidth = 8; x.strokeRect(-130, -38, 260, 76);
    x.fillStyle = '#FF5A14'; x.font = '800 46px "Big Shoulders Display"'; x.fillText(d.s.toUpperCase(), 0, 4);
    x.restore();
    x.font = '500 22px "IBM Plex Mono"'; x.fillStyle = '#141416'; x.fillText(D.lidText.made, 256, 470);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = r.capabilities.getMaxAnisotropy();
    t.center.set(0.5, 0.5);
    t.rotation = Math.PI / 2;
    return t;
  };
  const side = new THREE.MeshStandardMaterial({ color: '#C9A27A', roughness: 0.85 });
  const boxes: Mesh[] = P.map((d, i) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(2, 1.1, 2), [side, side, new THREE.MeshStandardMaterial({ map: lid(d), roughness: 0.7 }), side, side, side]);
    b.userData = { i, z: -LEN / 2 + i * LEN / P.length, lift: 0, hop: 0 };
    rig.add(b);
    return b;
  });
  const hitM = new THREE.MeshBasicMaterial({ visible: false });
  const hits: Mesh[] = boxes.map((b) => {
    const h = new THREE.Mesh(new THREE.BoxGeometry(2.1, 3.2, 2.1), hitM);
    h.userData.box = b;
    rig.add(h);
    return h;
  });
  rig.rotation.y = -0.62;

  let speed = 1.2, target = 1.2, mx = 0, my = 0, hover: Mesh | null = null, slow = 0;
  const ray = new THREE.Raycaster(), m = new THREE.Vector2(9, 9);
  const onMove = (e: PointerEvent) => {
    const b = sec.getBoundingClientRect();
    m.set((e.clientX - b.left) / b.width * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
    mx = (e.clientX - b.left) / b.width - 0.5;
    my = (e.clientY - b.top) / b.height - 0.5;
  };
  const onLeave = () => m.set(9, 9);
  const onDown = () => {
    if (hover) { card(hover.userData.i); return; }
    target = 8;
    boxes.forEach((b) => { b.userData.hop = 1; });
    clearTimeout(slow);
    slow = window.setTimeout(() => { target = 1.2; }, 900);
  };
  sec.addEventListener('pointermove', onMove);
  sec.addEventListener('pointerleave', onLeave);
  cv.addEventListener('pointerdown', onDown);
  function size() {
    const b = sec.getBoundingClientRect(), w = b.width, hh = b.height;
    r.setSize(w, hh, false);
    cam.aspect = w / hh;
    cam.updateProjectionMatrix();
    const s = w < 900;
    cam.position.set(s ? 3 : 9, s ? 15 : 10, s ? 16 : 17);
    cam.lookAt(s ? 0 : -3.2, 0, s ? -4 : 0);
  }
  size();
  addEventListener('resize', size);

  const clock = new THREE.Clock();
  run(() => {
    const dt = Math.min(clock.getDelta(), 0.05), f = RM ? 0 : 1;
    speed += ((hover ? 0 : target) - speed) * 0.08;
    beltTex.offset.y -= dt * speed * 0.23 * f;
    ray.setFromCamera(m, cam);
    const hit = ray.intersectObjects(hits, false)[0], hv = hit ? (hit.object.userData.box as Mesh) : null;
    if (hv !== hover) {
      hover = hv;
      cv.style.cursor = hv ? 'pointer' : 'default';
      if (hv) card(hv.userData.i);
    }
    boxes.forEach((b) => {
      const u = b.userData;
      u.z += dt * speed * f;
      if (u.z > LEN / 2) u.z -= LEN;
      u.lift += ((b === hover ? 1.2 : 0) - u.lift) * 0.15;
      u.hop *= 0.93;
      b.position.set(0, 0.8 + u.lift + Math.sin(u.hop * Math.PI) * 1.1, u.z);
      hits[u.i].position.set(0, 1.5, u.z);
      b.rotation.y = u.lift * 0.35 + u.hop * Math.PI * 2;
      b.rotation.z = Math.sin(performance.now() / 900 + u.z) * 0.03 * f;
    });
    rig.rotation.y = -0.62 + mx * 0.2 * f;
    rig.rotation.x = my * 0.1 * f;
    r.render(sc, cam);
  });

  return () => {
    clearTimeout(slow);
    removeEventListener('resize', size);
    sec.removeEventListener('pointermove', onMove);
    sec.removeEventListener('pointerleave', onLeave);
    cv.removeEventListener('pointerdown', onDown);
    cv.style.cursor = '';
    if (shown !== 0) pc.innerHTML = D.card(P[0]);
    dispose();
  };
}
