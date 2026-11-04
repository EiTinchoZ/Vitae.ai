// Trayectoria: mapa de metro en 3D, portado de la maqueta (línea ~1404). Cinco líneas que desembocan en HOY,
// trenes que corren, estaciones con ficha al pasar, la leyenda resalta una línea, y una vía en construcción con dos
// estaciones fantasma. El personaje (avatar v8, public/models/tin.glb con Draco) está parado en HOY, mira al cursor
// y señala la estación fantasma que se toca. three y el GLB llegan por loadThree (chunk compartido con el hero).
// mount() devuelve la limpieza: si three o el GLB llegan tarde, se descartan al llegar.
import type { Mesh, Object3D, Quaternion, Vector3 } from 'three';
import { loadThree } from '@/lib/three/load';
import { hasWebGL } from '@/lib/three/webgl';
import type { Station } from '@/content/es/trayectoria';

type Kit = Awaited<ReturnType<typeof loadThree>>;
type Data = { lines: Record<string, string>; future: string; hub: string[]; stations: Station[]; ghosts: Station[]; logos?: Record<string, string> };

const C: Record<string, string> = { base: '#B7AE9F', edu: '#F5B700', ia: '#FF4B2B', pro: '#3D6BFF', prj: '#B6F23A', fut: '#FFD23F' };

const freeAll = (o: Object3D) => o.traverse((n) => {
  const m = n as Mesh;
  m.geometry?.dispose();
  [m.material ?? []].flat().forEach((mt) => mt.dispose());
});

export function mount(sec: HTMLElement, data: Data): () => void {
  if (!hasWebGL(sec.querySelector<HTMLCanvasElement>('#cMap'))) return list(sec, data);
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

// Sin WebGL: las estaciones como lista, con el color de su línea y el mismo marcado de la ficha. Cierra con HOY.
function list(sec: HTMLElement, D: Data): () => void {
  const ol = document.createElement('ol');
  ol.className = 'mlist';
  ol.innerHTML = D.stations.map((s) => `<li><span class="mono"><i style="background:${C[s[0]]}"></i>${D.lines[s[0]]} · ${s[1]}</span><b>${s[2]}</b>${s[3]}</li>`).join('')
    + `<li><span class="mono"><i style="background:#FF5A14"></i>${D.hub[0]}</span><b>${D.hub[1]}</b></li>`;
  sec.querySelector('.txt')?.append(ol);
  sec.classList.add('nogl');
  return () => {
    ol.remove();
    sec.classList.remove('nogl');
  };
}

async function start({ THREE, TOOLS, makeKey, scene, loadGLB }: Kit, sec: HTMLElement, D: Data, alive: () => boolean) {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const keys = await Promise.all(TOOLS.slice(0, 8).map((t) => makeKey(t, { base: '#232327', size: 0.8 })));
  if (!alive()) { keys.forEach(freeAll); return null; }

  const cv = sec.querySelector<HTMLCanvasElement>('#cMap')!;
  const card = sec.querySelector<HTMLElement>('#mcard')!;
  const leg = sec.querySelector<HTMLElement>('#leg')!;
  const { r, sc, run, dispose } = scene(cv, sec);
  const cam = new THREE.PerspectiveCamera(36, 1, 0.1, 200);
  const LINES: Record<string, string> = { ...D.lines };
  const S: Station[] = [...D.stations];
  leg.innerHTML = Object.keys(LINES).map((k) => `<button data-l="${k}"><i style="background:${C[k]}"></i>${LINES[k]}</button>`).join('');

  const HUB = [5, 0], map = new THREE.Group();
  sc.add(map);
  const grid = new THREE.GridHelper(44, 44, '#2a2722', '#1a1916');
  grid.position.y = -0.3;
  map.add(grid);
  const trains: Mesh[] = [], labels: [HTMLElement, Object3D][] = [], tubes: Mesh[] = [];
  Object.keys(LINES).forEach((l) => {
    const pts = S.filter((s) => s[0] === l).map((s) => new THREE.Vector3(s[4], 0, s[5]));
    pts.push(l === 'base' ? new THREE.Vector3(-4.5, 0, -4.6) : new THREE.Vector3(HUB[0], 0, HUB[1])); // la base desemboca en Industrial
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.16, 12), new THREE.MeshPhysicalMaterial({ color: C[l], roughness: 0.3, clearcoat: 1, emissive: C[l], emissiveIntensity: 0.25 }));
    tube.userData.line = l;
    map.add(tube);
    tubes.push(tube);
    const tr = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.6, 6, 12), new THREE.MeshStandardMaterial({ color: '#F3EEE3', emissive: C[l], emissiveIntensity: 0.7 }));
    tr.userData = { curve, t: Math.random(), l };
    map.add(tr);
    trains.push(tr);
  });
  const mk = (el: HTMLElement, o: Object3D) => { sec.appendChild(el); labels.push([el, o]); };
  const lbl = (cls: string, s: Station) => {
    const el = document.createElement('div');
    el.className = cls + (D.logos?.[s[2]] ? ' hl' : '');
    el.innerHTML = s[2] === 'Philips'
      ? `<b class="ph"><img src="/img/logos/philips-shield.png" alt=""><img src="/img/logos/philips.png" alt="Philips"></b><small>${s[1]}</small>`
      : D.logos?.[s[2]]
        ? `<img class="sl" src="${D.logos[s[2]]}" alt=""><b>${s[2]}</b><small>${s[1]}</small>`
        : `<b>${s[2]}</b><small>${s[1]}</small>`;
    return el;
  };
  const st: Mesh[] = S.map((s, i) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.5, 32), new THREE.MeshPhysicalMaterial({ color: '#F3EEE3', roughness: 0.2, clearcoat: 1 }));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.09, 12, 40), new THREE.MeshStandardMaterial({ color: C[s[0]], emissive: C[s[0]], emissiveIntensity: 0.3 }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.26;
    m.add(ring);
    m.position.set(s[4], 0.05, s[5]);
    m.userData.i = i;
    map.add(m);
    mk(lbl('lbl', s), m);
    return m;
  });
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.7, 48), new THREE.MeshPhysicalMaterial({ color: '#FF5A14', clearcoat: 1, roughness: 0.15, emissive: '#FF5A14', emissiveIntensity: 0.25 }));
  hub.position.set(HUB[0], 0.1, HUB[1]);
  map.add(hub);
  const hubA = new THREE.Object3D();
  hubA.position.set(HUB[0], -0.3, HUB[1] + 3.4); // etiqueta delante del hub, el personaje queda libre
  map.add(hubA);
  const hl = document.createElement('div');
  hl.className = 'lbl hub';
  hl.innerHTML = `<b>${D.hub[0]}</b><small>${D.hub[1]}</small>`;
  mk(hl, hubA);
  keys.forEach((k, i) => { k.userData.a = (i / keys.length) * Math.PI * 2; map.add(k); });

  /* lo que viene: vía en construcción que se pierde, con dos estaciones fantasma */
  LINES.fut = D.future;
  const futC = new THREE.CatmullRomCurve3([[HUB[0], HUB[1]], [4.3, -5.5], [3.4, -9.5], [2.9, -13.5], [2.6, -17.5]].map((p) => new THREE.Vector3(p[0], 0, p[1])), false, 'centripetal');
  for (let k = 0, N = 26; k < N; k++) {
    const a = k / N, b = (k + 0.55) / N, seg = new THREE.CatmullRomCurve3([0, 0.5, 1].map((u) => futC.getPoint(a + (b - a) * u)));
    map.add(new THREE.Mesh(new THREE.TubeGeometry(seg, 6, 0.13, 10), new THREE.MeshStandardMaterial({ color: '#F3EEE3', emissive: '#FFD23F', emissiveIntensity: 0.35, transparent: true, opacity: Math.max(0.06, 1 - a * 1.05) * 0.9, depthWrite: false })));
  }
  D.ghosts.forEach((s) => {
    S.push(s);
    const g = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.5, 32), new THREE.MeshStandardMaterial({ color: '#F3EEE3', transparent: true, opacity: 0.16, depthWrite: false }));
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(g.geometry, 30), new THREE.LineBasicMaterial({ color: '#FFD23F' })));
    g.position.set(s[4], 0.05, s[5]);
    g.userData.i = S.length - 1;
    map.add(g);
    st.push(g);
    mk(lbl('lbl fut', s), g);
  });
  const G1 = S.length - 2;

  /* personaje: el avatar v8 de tincho.ia, parado en HOY mirando lo que viene.
     Piezas rígidas colgadas de los huesos; las poses salen de rotar los huesos en el marco del personaje. */
  type Tin = { o: Object3D; B: Record<string, Object3D>; armDir: Vector3; yaw: number; pt: number; p: Quaternion; tg: Vector3 };
  let tin: Tin | null = null;
  loadGLB('/models/tin.glb').then((g) => {
    const o = g.scene;
    if (!alive()) { freeAll(o); return; }
    o.scale.setScalar(2);
    o.position.set(HUB[0] + 0.25, 0.45, HUB[1] + 0.1);
    o.rotation.y = 1.05;
    map.add(o);
    const B: Record<string, Object3D> = {};
    o.traverse((n) => { B[n.name.replace(/\./g, '')] = n; if ((n as Mesh).isMesh) n.castShadow = false; });
    const need = ['hips', 'spine', 'chest', 'neck', 'head', 'thighL', 'thighR', 'upper_armL', 'forearmL', 'upper_armR', 'handR'];
    if (need.some((n) => !B[n])) return;
    need.forEach((n) => { B[n].userData.rest = B[n].quaternion.clone(); });
    o.updateWorldMatrix(true, true);
    const wp = (n: string) => o.worldToLocal(B[n].getWorldPosition(new THREE.Vector3()));
    const armDir = wp('forearmL').sub(wp('upper_armL')).normalize();
    // laptop cerrada en la mano derecha, con la barra de luz del lado RGB
    const lap = new THREE.Group(), lb = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.25, 0.36), new THREE.MeshStandardMaterial({ color: '#18181B', roughness: 0.45, metalness: 0.4 }));
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.012, 0.3), new THREE.MeshStandardMaterial({ color: '#FF6A2A', emissive: '#FF6A2A', emissiveIntensity: 2 }));
    bar.position.y = -0.125;
    lap.add(lb, bar);
    lap.position.copy(wp('handR')).add(new THREE.Vector3(-0.05, -0.09, 0));
    o.add(lap);
    o.updateWorldMatrix(true, true);
    B.handR.attach(lap);
    tin = { o, B, armDir, yaw: 0.9, pt: 0, p: new THREE.Quaternion(), tg: new THREE.Vector3() };
  }).catch((e) => console.error(e));

  // rota un hueso un ángulo qR expresado en el marco del personaje: local = P⁻¹·qR·P·reposo
  const turn = (T: Tin, n: string, qR: Quaternion) => {
    const b = T.B[n], P = T.p;
    b.parent!.updateWorldMatrix(true, false);
    T.o.getWorldQuaternion(P).invert();
    P.multiply(b.parent!.getWorldQuaternion(new THREE.Quaternion()));
    b.quaternion.copy(P).invert().multiply(qR).multiply(P).multiply(b.userData.rest);
  };
  const ax = (x: number, y: number, z: number, ang: number) => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(x, y, z), ang);
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hitP = new THREE.Vector3();
  function tinTick(t: number, f: number) {
    if (!tin) return;
    const T = tin, { o, B } = T;
    const sw = Math.sin(t * 0.0011) * 0.035 * f, br = Math.sin(t * 0.0019) * 0.02 * f;
    turn(T, 'hips', ax(0, 0, 1, sw)); turn(T, 'thighL', ax(0, 0, 1, -sw)); turn(T, 'thighR', ax(0, 0, 1, -sw));
    turn(T, 'spine', ax(0, 0, 1, -sw * 1.3)); turn(T, 'chest', ax(1, 0, 0, -br));
    // a dónde mira: el cursor sobre el piso del mapa, o el final de la vía
    const pointing = sel >= G1, tg = T.tg;
    if (pointing) map.localToWorld(tg.set(S[sel][4], 0.4, S[sel][5]));
    else if (m.x < 5 && f && ray.ray.intersectPlane(plane, hitP)) tg.copy(hitP);
    else map.localToWorld(tg.set(3.4, 0.4, -9.5));
    const lt = o.worldToLocal(tg.clone()), want = Math.max(-1.15, Math.min(1.15, Math.atan2(lt.x, lt.z)));
    T.yaw += (want - T.yaw) * (f ? 0.07 : 1);
    turn(T, 'neck', ax(0, 1, 0, T.yaw * 0.4));
    turn(T, 'head', ax(0, 1, 0, T.yaw * 0.6).multiply(ax(1, 0, 0, 0.12 + br)));
    // señala la estación fantasma: el brazo izquierdo va hacia ella, un poco por encima del hombro
    T.pt += ((pointing ? 1 : 0) - T.pt) * (f ? 0.09 : 1);
    if (T.pt > 0.001) {
      const sh = o.worldToLocal(B.upper_armL.getWorldPosition(new THREE.Vector3())), d = lt.sub(sh);
      d.y = 0; d.normalize(); d.y = 0.35; d.normalize();
      turn(T, 'upper_armL', new THREE.Quaternion().slerp(new THREE.Quaternion().setFromUnitVectors(T.armDir, d), T.pt));
    } else turn(T, 'upper_armL', new THREE.Quaternion());
    turn(T, 'upper_armR', ax(1, 0, 0, br * 0.5));
  }

  let rotY = -0.35, tRotY = -0.35, drag: number | null = null, mx = 0, my = 0, sel = -1, focus: string | null = null, small = false;
  const ray = new THREE.Raycaster(), m = new THREE.Vector2(9, 9);
  let down: { id: number; x: number; y: number; travel: number } | null = null;
  let touch = false;
  const originalSelection = sec.getAttribute('data-sel');
  sec.dataset.sel = '-1';
  const select = (i: number) => {
    if (i === sel) return;
    sel = i;
    sec.dataset.sel = String(i);
    if (i >= 0) {
      const s = S[i];
      card.innerHTML = `<span class="mono"><i style="background:${C[s[0]]}"></i>${LINES[s[0]]} · ${s[1]}</span><b>${s[2]}</b>${s[3]}`;
      card.classList.add('on');
    } else card.classList.remove('on');
  };
  const pointer = (e: PointerEvent) => {
    const b = sec.getBoundingClientRect();
    m.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
  };
  const onDown = (e: PointerEvent) => {
    touch = e.pointerType !== 'mouse';
    down = { id: e.pointerId, x: e.clientX, y: e.clientY, travel: 0 };
    drag = e.clientX;
  };
  const onUp = (e: PointerEvent) => {
    if (!down || down.id !== e.pointerId) return;
    if (touch && Math.max(down.travel, Math.hypot(e.clientX - down.x, e.clientY - down.y)) < 8) {
      pointer(e);
      sc.updateMatrixWorld(true);
      cam.updateMatrixWorld();
      ray.setFromCamera(m, cam);
      const hit = ray.intersectObjects(st, false)[0];
      select(hit ? hit.object.userData.i : -1);
    }
    drag = null;
    down = null;
  };
  const onCancel = () => { drag = null; down = null; };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') touch = false;
    const b = sec.getBoundingClientRect();
    pointer(e);
    mx = (e.clientX - b.left) / b.width - 0.5;
    my = (e.clientY - b.top) / b.height - 0.5;
    if (down && down.id === e.pointerId) down.travel = Math.max(down.travel, Math.hypot(e.clientX - down.x, e.clientY - down.y));
    if (drag !== null) { tRotY += (e.clientX - drag) * 0.005; drag = e.clientX; }
  };
  const onLeave = () => m.set(9, 9);
  cv.addEventListener('pointerdown', onDown);
  addEventListener('pointerup', onUp);
  addEventListener('pointercancel', onCancel);
  cv.addEventListener('pointermove', onMove);
  cv.addEventListener('pointerleave', onLeave);
  const legOn = (e: Event) => { focus = (e.currentTarget as HTMLElement).dataset.l!; };
  const legOff = () => { focus = null; };
  const btns = [...leg.querySelectorAll<HTMLButtonElement>('button')];
  btns.forEach((b) => {
    b.addEventListener('pointerenter', legOn); b.addEventListener('pointerleave', legOff);
    b.addEventListener('focus', legOn); b.addEventListener('blur', legOff);
  });
  function size() {
    const b = sec.getBoundingClientRect(), w = b.width, hh = b.height;
    r.setSize(w, hh, false);
    cam.aspect = w / hh;
    cam.updateProjectionMatrix();
    small = w < 900;
    cam.clearViewOffset();
    if (!small) {
      cam.position.set(6, 21, 20);
      cam.lookAt(-4.6, 0, 0.4);
      return;
    }
    // Celular: encaja estaciones, hub y personaje entre la leyenda y el espacio que ocupa la ficha abajo.
    const top = sec.querySelector('.txt')!.getBoundingClientRect().bottom - b.top + 28;
    const bot = hh - Math.min(195, hh * 0.25);
    map.rotation.set(0, rotY, 0);
    map.updateMatrixWorld(true);
    const pts = [...st, hub, hubA].map((o) => o.getWorldPosition(new THREE.Vector3()));
    pts.push(pts[st.length].clone().setY(3.2)); // cabeza del personaje
    const c = pts.reduce((a, p) => a.add(p), new THREE.Vector3()).divideScalar(pts.length);
    const dir = new THREE.Vector3(3.5, 34, 29.5).normalize();
    const q = new THREE.Vector3();
    let d = 45, box = [0, 0, 0, 0];
    for (let k = 0; k < 7; k++) {
      cam.position.copy(c).addScaledVector(dir, d);
      cam.lookAt(c);
      cam.updateMatrixWorld();
      box = [1, -1, 1, -1];
      pts.forEach((p) => {
        q.copy(p).project(cam);
        box = [Math.min(box[0], q.x), Math.max(box[1], q.x), Math.min(box[2], q.y), Math.max(box[3], q.y)];
      });
      if (k < 6) d *= Math.max((box[1] - box[0]) / 1.7, (box[3] - box[2]) / (((bot - top) / hh) * 2 * 0.9));
    }
    const cx = ((box[0] + box[1]) / 4 + 0.5) * w, cy = (0.5 - (box[2] + box[3]) / 4) * hh;
    cam.setViewOffset(w, hh, cx - w / 2, cy - (top + bot) / 2, w, hh);
  }
  size();
  addEventListener('resize', size);

  const v = new THREE.Vector3();
  run((t) => {
    const f = RM ? 0 : 1;
    rotY += (tRotY + mx * 0.25 * f - rotY) * 0.06;
    map.rotation.y = rotY;
    map.rotation.x = my * 0.08 * f;
    trains.forEach((tr) => {
      const u = tr.userData;
      u.t = (u.t + 0.0016 * f) % 1;
      tr.position.copy(u.curve.getPoint(u.t));
      tr.lookAt(tr.position.clone().add(u.curve.getTangent(u.t)));
      tr.rotateX(Math.PI / 2);
      tr.position.y = 0.28;
      tr.visible = !focus || focus === u.l;
    });
    tubes.forEach((o) => { (o.material as InstanceType<typeof THREE.MeshPhysicalMaterial>).emissiveIntensity = focus === o.userData.line ? 1 : 0.25; });
    keys.forEach((k, i) => {
      const a = k.userData.a + t * 0.00025 * f;
      k.position.set(HUB[0] + Math.cos(a) * 2.4, 1.6 + Math.sin(t * 0.002 + i) * 0.25 * f, HUB[1] + Math.sin(a) * 2.4);
      k.lookAt(cam.position);
    });
    hub.scale.y = 1 + Math.sin(t * 0.004) * 0.08 * f;
    ray.setFromCamera(m, cam);
    if (!touch) {
      const hit = ray.intersectObjects(st, false)[0];
      select(hit ? hit.object.userData.i : -1);
    }
    st.forEach((s, j) => { const w = j === sel ? 1.35 : focus && S[j][0] === focus ? 1.2 : 1; s.scale.lerp(v.set(w, w, w), 0.2); });
    const b = sec.getBoundingClientRect();
    labels.forEach(([el, o]) => {
      o.getWorldPosition(v);
      v.project(cam);
      el.style.left = (v.x * 0.5 + 0.5) * b.width + 'px';
      el.style.top = (-v.y * 0.5 + 0.5) * b.height + 'px';
      el.style.opacity = v.z < 1 && (!small || el === hl || (sel >= 0 && o === st[sel])) ? '1' : '0';
    });
    tinTick(t, f);
    r.render(sc, cam);
  });

  return () => {
    removeEventListener('resize', size);
    removeEventListener('pointerup', onUp);
    removeEventListener('pointercancel', onCancel);
    cv.removeEventListener('pointerdown', onDown);
    cv.removeEventListener('pointermove', onMove);
    cv.removeEventListener('pointerleave', onLeave);
    labels.forEach(([el]) => el.remove());
    leg.innerHTML = '';
    card.innerHTML = '';
    card.classList.remove('on');
    if (originalSelection === null) sec.removeAttribute('data-sel');
    else sec.setAttribute('data-sel', originalSelection);
    dispose();
  };
}
