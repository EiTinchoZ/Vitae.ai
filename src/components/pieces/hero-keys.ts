// Portada: teclas 3D imantadas alrededor de la foto, portado de la maqueta (línea ~1340). Cada tecla tiene su
// lugar fijo fuera de las zonas prohibidas (foto, nombre, textos, botones, menú); el cursor la aparta un poco,
// al pasar suena y muestra su tooltip, el clic la hace girar. three llega por loadThree (chunk aparte, compartido).
// mount() devuelve la limpieza: si three todavía no llegó, la carga se descarta al llegar.
import { loadThree } from '@/lib/three/load';
import type { Tool } from '@/lib/three/kit';

type Kit = Awaited<ReturnType<typeof loadThree>>;
type Tips = { social: string; cert: string; daily: string };

declare global {
  interface Window {
    __keysPx?: () => { x: number; y: number }[];
  }
}

export function mount(hero: HTMLElement, tips: Tips): () => void {
  let alive = true;
  let stop: (() => void) | null = null;
  loadThree()
    .then((kit) => (alive ? start(kit, hero, tips, () => alive) : null))
    .then((s) => { if (alive) stop = s; else s?.(); })
    .catch((e) => console.error(e));
  return () => {
    alive = false;
    stop?.();
  };
}

async function start({ THREE, TOOLS, makeKey, scene }: Kit, hero: HTMLElement, T: Tips, alive: () => boolean) {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tip = document.getElementById('tip')!;
  const core = hero.querySelector<HTMLElement>('#core')!;
  const tipHTML = (tl: Tool) => `<small>${tl.social ? T.social : tl.cert ? T.cert : T.daily}</small>${tl.label}`;

  const HERO_TOOLS = TOOLS.filter((t) => !['react', 'fastapi'].includes(t.id)); // 12 teclas: con 14 no caben sin pisarse
  const keys = await Promise.all((innerWidth < 900 ? HERO_TOOLS.slice(0, 8) : HERO_TOOLS).map((t) => makeKey(t, { base: '#232327', size: innerWidth < 900 ? 0.7 : 0.86 })));
  if (!alive()) {
    keys.forEach((k) => k.traverse((o) => {
      const m = o as InstanceType<typeof THREE.Mesh>;
      m.geometry?.dispose();
      ([m.material ?? []].flat() as InstanceType<typeof THREE.MeshBasicMaterial>[]).forEach((mt) => { mt.map?.dispose(); mt.dispose(); });
    }));
    return null;
  }

  const { r, sc, run, dispose } = scene(hero.querySelector<HTMLCanvasElement>('#cHero')!, hero);
  const rim = new THREE.DirectionalLight(0xff7a3d, 2.4);
  rim.position.set(-4, -3, 3);
  sc.add(rim);
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  cam.position.z = 20;

  type Zone = { x0: number; x1: number; y0: number; y1: number };
  type V2 = InstanceType<typeof THREE.Vector2>;
  let W = 16, H = 9, cx = 0, cy = 0, R = 3, ZONES: Zone[] = [], PAD = 0.6, BX = 7, YMIN = -4, YMAX = 4, MIN = 1.35, MOB = false, RH = 2;
  const sep = new THREE.Vector2();
  // empuja un punto fuera de toda zona prohibida (foto, nombre, textos, botones) y dentro de la pantalla
  const keepOut = (p: V2, v?: V2) => {
    if (p.x < -BX) { p.x = -BX; if (v) v.x = Math.abs(v.x) * 0.3; }
    if (p.x > BX) { p.x = BX; if (v) v.x = -Math.abs(v.x) * 0.3; }
    if (p.y < YMIN) { p.y = YMIN; if (v) v.y = Math.abs(v.y) * 0.3; }
    if (p.y > YMAX) { p.y = YMAX; if (v) v.y = -Math.abs(v.y) * 0.3; }
    for (let pass = 0; pass < 3; pass++) for (const z of ZONES) {
      const x0 = z.x0 - PAD, x1 = z.x1 + PAD, y0 = z.y0 - PAD, y1 = z.y1 + PAD;
      if (p.x <= x0 || p.x >= x1 || p.y <= y0 || p.y >= y1) continue;
      // salidas posibles, solo las que quedan dentro de la pantalla; gana la más corta
      const ex = ([[x0, p.y, p.x - x0, 'x', -1], [x1, p.y, x1 - p.x, 'x', 1], [p.x, y0, p.y - y0, 'y', -1], [p.x, y1, y1 - p.y, 'y', 1]] as [number, number, number, 'x' | 'y', number][])
        .filter((e) => Math.abs(e[0]) <= BX && e[1] >= YMIN && e[1] <= YMAX).sort((a, b) => a[2] - b[2]);
      const e = ex[0];
      if (!e) continue;
      p.x = e[0];
      p.y = e[1];
      if (v && Math.sign(v[e[3]]) !== e[4]) v[e[3]] *= -0.3;
    }
  };
  keys.forEach((k) => {
    Object.assign(k.userData, { p: new THREE.Vector2(), v: new THREE.Vector2(), home: new THREE.Vector2(), spin: new THREE.Vector2() });
    sc.add(k);
  });

  function size() {
    const b = hero.getBoundingClientRect(), w = b.width, hh = b.height;
    r.setSize(w, hh, false);
    W = w < 900 ? 7.5 : 16;
    H = (W * hh) / w;
    Object.assign(cam, { left: -W / 2, right: W / 2, top: H / 2, bottom: -H / 2 });
    cam.updateProjectionMatrix();
    const c = core.getBoundingClientRect();
    cx = ((c.left - b.left + c.width / 2) / w - 0.5) * W;
    cy = -((c.top - b.top + c.height / 2) / hh - 0.5) * H;
    R = (c.width / 2 / w) * W + (w < 900 ? 0.62 : 1.6);
    const toW = (q: DOMRect | { left: number; right: number; top: number; bottom: number }, top = 0): Zone => ({
      x0: ((q.left - b.left) / w - 0.5) * W, x1: ((q.right - b.left) / w - 0.5) * W,
      y0: -((q.bottom - b.top) / hh - 0.5) * H, y1: -((q.top - top - b.top) / hh - 0.5) * H,
    });
    const rg = { left: c.left - c.width * 0.1, right: c.right + c.width * 0.1, top: c.top - c.height * 0.1, bottom: c.bottom + c.height * 0.1 };
    ZONES = [toW(c, c.height * 0.45), toW(rg), toW(document.querySelector('.nav')!.getBoundingClientRect()),
      ...['#h', '.foot p', '.chips', '.acts', '#stk', '.loc', '.carr'].map((q) => toW(hero.querySelector(q)!.getBoundingClientRect()))];
    PAD = (w < 900 ? 0.7 : 0.86) * 0.62;
    BX = W / 2 - PAD;
    MIN = (w < 900 ? 0.7 : 0.86) * 1.35;
    MOB = w < 900;
    RH = ((c.width * 0.6) / w) * W;
    // las teclas viven entre el nombre (en celular está arriba) y el bloque de abajo
    const ft = hero.querySelector('.foot')!.getBoundingClientRect(), nm = hero.querySelector('.name')!.getBoundingClientRect();
    YMIN = -((ft.top - b.top) / hh - 0.5) * H + PAD;
    YMAX = w < 900 ? -((nm.bottom - b.top) / hh - 0.5) * H - PAD : Math.min(H / 2 - PAD, ZONES[2].y0 - PAD); // en escritorio, debajo del menú
  }
  const SPAN = 1.75;
  const homes = (t: number) => {
    // escritorio: un arco de 4 sobre la foto y dos columnas en zigzag a los lados; cada tecla con su espacio
    if (!MOB) {
      const zz = 0.42, k0 = 0.43, yT = ZONES[0].y1 + PAD + 0.06, nT = yT <= Math.min(YMAX, ZONES[2].y0 - PAD) ? 4 : 0, sp = Math.max(MIN * 1.08, RH * 0.5), n = Math.ceil((keys.length - nT) / 2); // el arco solo si cabe entre el menú y la cabeza
      const xR = Math.min(cx + RH + PAD + k0 + zz, BX - zz), xL = cx - RH - PAD - k0 - zz;
      keys.forEach((k, i) => {
        let x, y;
        if (i < nT) {
          const u = i - (nT - 1) / 2;
          x = cx + u * sp;
          y = yT + (1.5 - Math.abs(u)) * 0.08;
        } else {
          const right = i - nT >= n, j = right ? i - nT - n : i - nT;
          const top = nT ? Math.min(YMAX, yT - MIN * 0.95) : YMAX;
          y = YMIN + ((j + 0.5) / n) * (top - YMIN);
          x = (right ? xR : xL) + (j % 2 ? zz : -zz) * (right ? -1 : 1);
        }
        k.userData.home.set(x + Math.sin(t * 0.0004 + i) * 0.05, y + Math.cos(t * 0.0005 + i) * 0.05);
        keepOut(k.userData.home);
      });
      return;
    }
    const n = keys.length / 2, rx = Math.min(R * 1.22, W / 2 - Math.abs(cx) - 0.95), ry = R * 0.95;
    keys.forEach((k, i) => {
      const side = i < n ? 0 : Math.PI, j = i % n, a = side + (-SPAN / 2 + ((j + 0.5) / n) * SPAN) * (i < n ? 1 : -1) + Math.sin(t * 0.0004 + i) * 0.04;
      k.userData.home.set(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry);
      keepOut(k.userData.home);
    });
    // ninguna tecla encima de otra
    for (let it = 0; it < 4; it++) keys.forEach((a, i) => keys.forEach((bk, j) => {
      if (j <= i) return;
      const ha = a.userData.home, hb = bk.userData.home, L = sep.copy(ha).sub(hb).length() || 0.001;
      if (L < MIN) { sep.multiplyScalar((MIN - L) / 2 / L); ha.add(sep); hb.sub(sep); keepOut(ha); keepOut(hb); }
    }));
  };
  size();
  homes(0);
  keys.forEach((k) => k.userData.p.copy(k.userData.home));
  addEventListener('resize', size);
  // para la prueba automática de solapes (Playwright), igual que en la maqueta
  window.__keysPx = () => {
    const b = hero.getBoundingClientRect();
    return keys.map((k) => ({ x: b.left + (k.position.x / W + 0.5) * b.width, y: b.top + (-k.position.y / H + 0.5) * b.height }));
  };

  const mouse = new THREE.Vector2(), nd = new THREE.Vector2(9, 9), ray = new THREE.Raycaster(), tmp = new THREE.Vector2(), tmp3 = new THREE.Vector3();
  let active = false;
  let hover: (typeof keys)[number] | null = null;
  // cada tecla tiene su lugar fijo; el cursor solo la aparta un poco, con una curva continua (sin cambio de signo, sin temblor)
  const ease = (q: number) => 1 - Math.pow(1 - q, 3);
  const spin = (k: (typeof keys)[number], delay = 0) => { if (!RM) k.userData.s0 = performance.now() + delay; };
  keys.forEach((k) => Object.assign(k.userData, { rx: 0, ry: 0, s0: 0 }));
  const onMove = (e: PointerEvent) => {
    const b = hero.getBoundingClientRect();
    nd.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
    mouse.set((nd.x * W) / 2, (nd.y * H) / 2);
    active = true;
    tip.style.left = e.clientX + 'px';
    tip.style.top = e.clientY + 'px';
  };
  const onLeave = () => { active = false; nd.set(9, 9); };
  // clic en una tecla: da una vuelta completa; clic en el vacío: una ola de vueltas que sale desde el cursor
  const onDown = (e: PointerEvent) => {
    if ((e.target as Element).closest('a,button,.chip')) return;
    if (hover) { spin(hover); return; }
    keys.forEach((k) => spin(k, k.userData.p.distanceTo(mouse) * 70));
  };
  hero.addEventListener('pointermove', onMove);
  hero.addEventListener('pointerleave', onLeave);
  hero.addEventListener('pointerdown', onDown);

  run((t) => {
    homes(RM ? 0 : t);
    const f = RM ? 0 : 1, now = performance.now();
    keys.forEach((k, i) => {
      const u = k.userData;
      tmp.copy(u.home);
      if (active && !RM && k !== hover) {
        const d = tmp3.set(u.home.x - mouse.x, u.home.y - mouse.y, 0), L = d.length() || 0.001, q = Math.max(0, 1 - L / 3.5);
        tmp.x += (d.x / L) * q * q * 0.3;
        tmp.y += (d.y / L) * q * q * 0.3;
      }
      keepOut(tmp);
      u.p.lerp(tmp, 0.07);
      const lx = active ? Math.max(-1, Math.min(1, (mouse.y - u.p.y) / 4)) : 0, ly = active ? Math.max(-1, Math.min(1, (mouse.x - u.p.x) / 4)) : 0;
      u.rx += ((-lx * 0.45 + Math.sin(t * 0.0008 + i) * 0.12) * f - u.rx) * 0.08;
      u.ry += ((ly * 0.55 + Math.cos(t * 0.0009 + i) * 0.16) * f - u.ry) * 0.08;
      let sa = 0;
      if (u.s0) {
        const q = (now - u.s0) / 900;
        if (q >= 1) u.s0 = 0;
        else if (q > 0) sa = ease(q) * Math.PI * 2;
      }
      k.position.set(u.p.x, u.p.y, 0);
      k.rotation.set(u.rx, u.ry + sa, 0);
      const s = k === hover ? 1.18 : 1;
      k.scale.lerp(tmp3.set(s, s, s), 0.12);
    });
    ray.setFromCamera(nd, cam);
    const hit = ray.intersectObjects(keys, true)[0];
    let hv: (typeof keys)[number] | null = null;
    if (hit) {
      let o = hit.object;
      while (o.parent && !keys.includes(o as (typeof keys)[number])) o = o.parent;
      hv = o as (typeof keys)[number];
    }
    if (hv !== hover) {
      hover = hv;
      hero.style.cursor = hv ? 'pointer' : '';
      if (hv) {
        window.SFX?.play('key');
        tip.innerHTML = tipHTML(hv.userData.tool);
        tip.style.opacity = '1';
      } else tip.style.opacity = '0';
    }
    r.render(sc, cam);
  });

  return () => {
    removeEventListener('resize', size);
    hero.removeEventListener('pointermove', onMove);
    hero.removeEventListener('pointerleave', onLeave);
    hero.removeEventListener('pointerdown', onDown);
    hero.style.cursor = '';
    tip.style.opacity = '0';
    delete window.__keysPx;
    dispose();
  };
}
