/* Bob, el pug de Tín, en cuatro estilos que se cambian en vivo: voxel | toon | dibujo | pixel.
   Bob.mount(stage, { walkIn, scrollExplode, yaw, zoom, style, onEvent }) → { style(n), set(estado), jump() }
   Estados: idle | ok | ojo | fail | signal. Requiere THREE r128 para los estilos 3D.
   Colores tomados de las fotos de Bob (2026-10-23): beige claro, máscara gris oscura con hocico canoso,
   orejas negras, arrugas marcadas, patas claras. Bandana color Claude. */
(function () {
  const C = {
    fawn: 0xd9c4a0, fawnDark: 0xb8a07c, belly: 0xebdfc8, paw: 0xf1e9da, mask: 0x2f2b29, silver: 0x8e8983,
    nose: 0x161413, eye: 0x161413, shine: 0xffffff, wrinkle: 0xa48d6b, tongue: 0xf08a98, ear: 0x1f1c1b,
    claude: 0xd97757, claudeDeep: 0xc6613f, ok: 0x2fbf71, ojo: 0xf2a20c, fail: 0xe5483d, signal: 0x2f6bff,
  };
  const hex = (n) => "#" + n.toString(16).padStart(6, "0");
  const SYM = {
    ok: ["....#", "...#.", "#.#..", ".#...", "....."],
    ojo: ["..#..", "..#..", "..#..", ".....", "..#.."],
    fail: ["#...#", ".#.#.", "..#..", ".#.#.", "#...#"],
    signal: [".###.", "#...#", "..##.", ".....", "..#.."],
    love: [".#.#.", "#####", "#####", ".###.", "..#.."],
  };
  const SYMCOL = { ok: C.ok, ojo: C.ojo, fail: C.fail, signal: C.signal, love: C.claude };
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= 3D: cuerpo común ================= */
  function shell(x0, x1, y0, y1, z0, z1) {
    const out = [];
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) {
      const ex = x === x0 || x === x1, ey = y === y0 || y === y1, ez = z === z0 || z === z1;
      if (!(ex || ey || ez)) continue;
      if ((ex && ey) || (ey && ez && y === y1) || (ex && ez)) continue;
      out.push([x, y, z]);
    }
    return out;
  }

  function buildVoxel(THREE) {
    const geo = new THREE.BoxGeometry(0.94, 0.94, 0.94);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.62 });
    const col = new THREE.Color();
    const meshes = [];
    let n = 1;
    const rnd = () => { const s = Math.sin(n++ * 12.9898) * 43758.5453; return s - Math.floor(s); };
    const root = new THREE.Group(), lift = new THREE.Group();
    root.add(lift);
    function part(cells, pivot, parent) {
      const g = new THREE.Group();
      g.position.set(...pivot);
      const m = new THREE.InstancedMesh(geo, mat, cells.length);
      m.castShadow = true;
      const home = [], dir = [], m4 = new THREE.Matrix4();
      cells.forEach(([x, y, z, c], i) => {
        m4.makeTranslation(x, y, z); m.setMatrixAt(i, m4);
        col.setHex(c);
        if (c === C.fawn || c === C.belly) col.offsetHSL(0, 0, (rnd() - 0.5) * 0.045);
        m.setColorAt(i, col);
        home.push(new THREE.Vector3(x, y, z));
        dir.push(new THREE.Vector3(x + rnd() - 0.5, y + rnd() * 2, z + rnd() - 0.5).normalize().multiplyScalar(5 + rnd() * 18));
      });
      g.add(m); (parent || lift).add(g);
      meshes.push({ m, home, dir });
      return g;
    }
    // cuerpo redondo y ancho, como Bob
    const body = [];
    shell(-5, 4, 0, 6, -6, 5).forEach(([x, y, z]) => body.push([x, y, z, y === 0 || (z === 5 && y < 4) ? C.belly : C.fawn]));
    [[6, -3, 2], [5, -2, 1], [4, -1, 0]].forEach(([y, a, b]) => { for (let x = a; x <= b; x++) body.push([x, y, 6, y === 6 ? C.claudeDeep : C.claude]); });
    for (let x = -4; x <= 3; x++) body.push([x, 7, 4, C.claude]);
    const bodyG = part(body, [0, 3, 0]);
    const legCells = [];
    for (let y = -3; y <= -1; y++) for (let x = 0; x <= 1; x++) for (let z = 0; z <= 1; z++) legCells.push([x, y, z, y === -3 ? C.paw : C.fawn]);
    const legs = [[-4, 2], [2, 2], [-4, -6], [2, -6]].map(([x, z]) => part(legCells, [x, 3, z]));
    // cabeza: máscara oscura, hocico canoso, arrugas en la frente
    const head = [];
    shell(-4, 4, -3, 4, -2, 4).forEach(([x, y, z]) => {
      let c = C.fawn;
      if (z === 4 && y <= -1 && Math.abs(x) <= 3) c = C.mask;
      if (z === 4 && y === 0 && Math.abs(x) <= 2) c = C.mask;
      if (z === 4 && (y === 2 || y === 3) && (x === -4 || x === -1 || x === 1 || x === 4)) c = C.mask;
      if (z === 4 && y === 1 && Math.abs(x) <= 1) c = C.wrinkle;
      if (z === 4 && y === 4 && Math.abs(x) <= 2) c = C.wrinkle;
      head.push([x, y, z, c]);
    });
    for (let x = -2; x <= 2; x++) for (let y = -2; y <= -1; y++) head.push([x, y, 5, (y === -2 && Math.abs(x) <= 1) ? C.silver : C.mask]);
    for (let x = -1; x <= 1; x++) head.push([x, -1, 6, C.nose]);
    const eyes = [];
    for (const ex of [-3, 2]) for (let dx = 0; dx <= 1; dx++) for (let y = 2; y <= 3; y++) eyes.push([ex + dx, y, 5, dx === 0 && y === 3 ? C.shine : C.eye]);
    const headG = part(head, [-0.5, 9, 4.5]);
    const eyesG = part(eyes, [0, 0, 0], headG);
    const tongueG = part([[-1, -3, 6, C.tongue], [0, -3, 6, C.tongue], [-1, -4, 6, C.tongue], [0, -4, 6, C.tongue]], [0, 0, 0], headG);
    const earCells = (s) => [[0, 0, 0], [0, 0, 1], [0, 0, 2], [s, -1, 0], [s, -1, 1], [s, -1, 2], [s, -2, 1]].map(([x, y, z]) => [x, y, z, C.ear]);
    const earL = part(earCells(-1), [-5, 4, 0], headG);
    const earR = part(earCells(1), [5, 4, 0], headG);
    const tailG = part([[0, 0, 0], [0, 1, 0], [0, 2, 1], [1, 2, 2], [1, 1, 2], [0, 1, 1]].map(([x, y, z]) => [x, y, z, C.fawnDark]), [-0.5, 9, -6]);
    return { root, lift, body: bodyG, legs, head: headG, eyes: eyesG, tongue: tongueG, earL, earR, tail: tailG, meshes, symY: 17.5 };
  }

  function buildToon(THREE) {
    // Same three toon shades, with RGBA storage supported by Three r170 / WebGL2.
    const grad = new THREE.DataTexture(new Uint8Array([110, 110, 110, 255, 185, 185, 185, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat);
    grad.minFilter = grad.magFilter = THREE.NearestFilter; grad.needsUpdate = true;
    const line = new THREE.MeshBasicMaterial({ color: 0x1a1716, side: THREE.BackSide });
    const sph = new THREE.SphereGeometry(1, 32, 22);
    const root = new THREE.Group(), lift = new THREE.Group();
    root.add(lift);
    function blob(parent, color, pos, scale, rot, outline = true, geo = sph) {
      const m = new THREE.Mesh(geo, new THREE.MeshToonMaterial({ color, gradientMap: grad }));
      m.position.set(...pos); m.scale.set(...scale); if (rot) m.rotation.set(...rot);
      m.castShadow = true;
      if (outline) { const o = new THREE.Mesh(geo, line); o.scale.setScalar(1.08); m.add(o); }
      parent.add(m);
      return m;
    }
    const body = new THREE.Group(); body.position.set(0, 0, 0); lift.add(body);
    blob(body, C.fawn, [0, 6.4, -0.6], [5.6, 4.6, 6.6]);
    blob(body, C.belly, [0, 5.6, 4.2], [3.6, 3.2, 2.4], null, false);
    const collar = blob(body, C.claude, [0, 8.4, 2.9], [1, 1, 1], [Math.PI / 2 - 0.35, 0, 0], true, new THREE.TorusGeometry(3.3, 0.55, 12, 36));
    collar.castShadow = false;
    const legs = [[-2.9, 3], [2.9, 3], [-2.9, -4.2], [2.9, -4.2]].map(([x, z]) => {
      const g = new THREE.Group(); g.position.set(x, 4.2, z); lift.add(g);
      blob(g, C.fawn, [0, -1.8, 0], [1.25, 2.4, 1.3]);
      blob(g, C.paw, [0, -3.8, 0.4], [1.35, 0.75, 1.6]);
      return g;
    });
    const head = new THREE.Group(); head.position.set(0, 9.2, 3.4); lift.add(head);
    blob(head, C.fawn, [0, 1.6, 1.4], [5.2, 4.7, 4.5]);
    blob(head, C.mask, [0, 0.2, 4.4], [3.7, 2.9, 2.5], null, false);
    blob(head, C.silver, [0, -1.2, 5.7], [2.2, 1.2, 1.3], null, false);
    blob(head, C.nose, [0, 0.9, 6.6], [1.25, 0.75, 0.7], null, false);
    const wr = new THREE.TorusGeometry(1.4, 0.2, 8, 24, Math.PI);
    blob(head, C.wrinkle, [0, 4.1, 5.0], [1, 1, 1], [-0.5, 0, 0], false, wr);
    blob(head, C.wrinkle, [0, 4.9, 4.4], [1.3, 1, 1], [-0.7, 0, 0], false, wr);
    const eyes = new THREE.Group(); head.add(eyes);
    for (const s of [-1, 1]) {
      blob(eyes, C.eye, [s * 2.15, 2.3, 5.0], [1.15, 1.15, 1.0], null, false);
      blob(eyes, C.shine, [s * 2.15 - 0.4, 2.75, 5.95], [0.36, 0.36, 0.2], null, false);
    }
    const tongue = blob(head, C.tongue, [0, -1.9, 5.7], [0.9, 0.4, 1.1], null, false);
    const ear = (s) => { const g = new THREE.Group(); g.position.set(s * 4.3, 4.4, 1.6); head.add(g); blob(g, C.ear, [s * 0.5, -1.5, 0], [0.75, 2.2, 1.7], [0, 0, s * 0.45]); return g; };
    const earL = ear(-1), earR = ear(1);
    const tail = new THREE.Group(); tail.position.set(0, 10, -6.4); lift.add(tail);
    blob(tail, C.fawnDark, [0, 0.8, 0], [1, 1, 1], [0, Math.PI / 2, 0], true, new THREE.TorusGeometry(1.2, 0.55, 12, 28, Math.PI * 1.6));
    return { root, lift, body, legs, head, eyes, tongue, earL, earR, tail, meshes: null, symY: 18 };
  }

  /* ================= 2D: dibujo con contorno ================= */
  const SVG = `
<svg viewBox="0 0 400 400" class="bob-svg" aria-hidden="true">
  <ellipse cx="200" cy="378" rx="120" ry="14" fill="rgba(20,20,19,.14)"/>
  <g class="t2-tail" style="transform-origin:300px 250px"><path d="M300 250c40-10 50-50 25-60-22-8-35 18-15 28" fill="none" stroke="#1a1716" stroke-width="22" stroke-linecap="round"/><path d="M300 250c40-10 50-50 25-60-22-8-35 18-15 28" fill="none" stroke="${hex(C.fawnDark)}" stroke-width="10" stroke-linecap="round"/></g>
  <g class="t2-body">
    <ellipse cx="200" cy="275" rx="128" ry="98" fill="${hex(C.fawn)}" stroke="#1a1716" stroke-width="7"/>
    <ellipse cx="200" cy="292" rx="70" ry="62" fill="${hex(C.belly)}"/>
    <rect x="138" y="318" width="40" height="54" rx="18" fill="${hex(C.fawn)}" stroke="#1a1716" stroke-width="7"/>
    <rect x="222" y="318" width="40" height="54" rx="18" fill="${hex(C.fawn)}" stroke="#1a1716" stroke-width="7"/>
    <ellipse cx="158" cy="370" rx="28" ry="13" fill="${hex(C.paw)}" stroke="#1a1716" stroke-width="7"/>
    <ellipse cx="242" cy="370" rx="28" ry="13" fill="${hex(C.paw)}" stroke="#1a1716" stroke-width="7"/>
    <path d="M118 222q82 46 164 0l-6 22q-76 40-152 0z" fill="${hex(C.claude)}" stroke="#1a1716" stroke-width="7" stroke-linejoin="round"/>
  </g>
  <g class="t2-head" style="transform-origin:200px 215px">
    <g class="t2-earL" style="transform-origin:110px 95px"><path d="M112 92c-40-10-70 20-62 62 10 10 30-6 46-22 12-12 22-28 16-40z" fill="${hex(C.ear)}" stroke="#1a1716" stroke-width="7" stroke-linejoin="round"/></g>
    <g class="t2-earR" style="transform-origin:290px 95px"><path d="M288 92c40-10 70 20 62 62-10 10-30-6-46-22-12-12-22-28-16-40z" fill="${hex(C.ear)}" stroke="#1a1716" stroke-width="7" stroke-linejoin="round"/></g>
    <circle cx="200" cy="165" r="108" fill="${hex(C.fawn)}" stroke="#1a1716" stroke-width="7"/>
    <path d="M168 92q32-16 64 0M160 108q40-18 80 0M182 126q18-8 36 0" fill="none" stroke="${hex(C.wrinkle)}" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="200" cy="208" rx="74" ry="56" fill="${hex(C.mask)}"/>
    <ellipse cx="200" cy="236" rx="40" ry="20" fill="${hex(C.silver)}"/>
    <g class="t2-eyes" style="transform-origin:200px 160px">
      <circle cx="150" cy="160" r="27" fill="${hex(C.eye)}" stroke="#1a1716" stroke-width="5"/><circle cx="141" cy="150" r="8" fill="#fff"/>
      <circle cx="250" cy="160" r="27" fill="${hex(C.eye)}" stroke="#1a1716" stroke-width="5"/><circle cx="241" cy="150" r="8" fill="#fff"/>
    </g>
    <ellipse cx="200" cy="196" rx="24" ry="15" fill="${hex(C.nose)}"/>
    <path d="M200 211v12M180 230q20 12 40 0" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
    <path class="t2-tongue" d="M190 232q10 34 20 0z" fill="${hex(C.tongue)}" stroke="#1a1716" stroke-width="5" stroke-linejoin="round"/>
  </g>
</svg>`;

  /* ================= píxel: sprite de lado ================= */
  const PX = { f: hex(C.fawn), l: hex(C.paw), k: hex(C.mask), e: hex(C.ear), g: hex(C.silver), w: "#ffffff", p: hex(C.tongue), o: hex(C.claude), t: hex(C.fawnDark) };
  const TOP = [
    "..............ee.......",
    ".............eeffff....",
    "............effffffe...",
    "............ffwkfffee..",
    "............ffkkffkkkk.",
    "...tt.......ffffffkkgk.",
    "..t..t......offfffkkk..",
    "...tt.ffffffoffffff....",
    "....fffffffffoofff.....",
    "....fffffffffffff......",
    "....ffffffffffllf......",
    "....fffffffffflll......",
  ];
  const LEGS_A = [".....ff..ff..ff.ff.....", ".....ll..ll..ll.ll....."];
  const LEGS_B = ["....ff...ff.ff...ff....", "...ll.....llll....ll..."];
  const TAIL_B = ["..tt...", ".t..t..", "..tt..."];

  /* ================= montaje ================= */
  function mount(stage, opt = {}) {
    stage.classList.add("bob-stage");
    stage.innerHTML = `<canvas class="bob-3d"></canvas><div class="bob-2d">${SVG}</div><canvas class="bob-px"></canvas><div class="bob-sym" aria-hidden="true"></div>`;
    const cv3 = stage.querySelector(".bob-3d"), d2 = stage.querySelector(".bob-2d"), cvp = stage.querySelector(".bob-px"), symEl = stage.querySelector(".bob-sym");
    const ev = (n) => opt.onEvent && opt.onEvent(n);
    let style = opt.style || "voxel", state = "idle", hover = false, jumpT = -1, tYaw = 0, tPitch = 0;
    let explode = 0, explodeTarget = 0;

    addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      tYaw = Math.max(-0.7, Math.min(0.7, (e.clientX - (r.left + r.width / 2)) / (innerWidth / 2) * 0.9));
      tPitch = Math.max(-0.35, Math.min(0.35, (e.clientY - (r.top + r.height * 0.4)) / (innerHeight / 2) * 0.4));
    }, { passive: true });
    stage.addEventListener("pointerenter", () => { hover = true; });
    stage.addEventListener("pointerleave", () => { hover = false; });
    stage.addEventListener("click", () => api.jump());
    if (opt.scrollExplode) addEventListener("scroll", () => {
      const r = stage.getBoundingClientRect();
      explodeTarget = Math.min(1, Math.max(0, -r.top / (r.height * 0.85)));
    }, { passive: true });

    /* --- 3D --- */
    const T = window.THREE;
    let renderer, scene, camera, rig = null, rigs = {}, symG, symMesh = null, symPop = 1;
    const walk = { on: !!opt.walkIn && !calm, t: 0, dur: 2.8, from: -46 };
    if (T) {
      renderer = new T.WebGLRenderer({ canvas: cv3, antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFShadowMap;
      addEventListener("modoligero", () => { renderer.setPixelRatio(1); renderer.shadowMap.enabled = false; sizeAll(); });
      scene = new T.Scene();
      camera = new T.PerspectiveCamera(28, 1, 0.1, 500);
      scene.add(new T.HemisphereLight(0xffffff, 0xe9ddd0, 0.85));
      const sun = new T.DirectionalLight(0xfff4ea, 0.75);
      sun.position.set(20, 40, 30); sun.castShadow = true; sun.shadow.mapSize.set(512, 512);
      Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 26, bottom: -6 });
      scene.add(sun);
      const floor = new T.Mesh(new T.PlaneGeometry(400, 400), new T.ShadowMaterial({ opacity: 0.14 }));
      floor.rotation.x = -Math.PI / 2; floor.position.y = -0.5; floor.receiveShadow = true; scene.add(floor);
      symG = new T.Group(); scene.add(symG);
    }
    function useRig(name) {
      if (!T) return;
      if (rig) scene.remove(rig.root);
      if (!rigs[name]) rigs[name] = name === "toon" ? buildToon(T) : buildVoxel(T);
      rig = rigs[name];
      scene.add(rig.root);
      if (walk.on) rig.root.position.x = walk.from;
      rig.root.add(symG);
      symG.position.set(0, rig.symY, 6);
    }
    function sym3d(name) {
      if (!T) return;
      if (symMesh) { symG.remove(symMesh); symMesh = null; }
      const pat = SYM[name]; if (!pat) return;
      const cells = [];
      pat.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === "#") cells.push([c - 2, 2 - r]); }));
      symMesh = new T.InstancedMesh(new T.BoxGeometry(0.94, 0.94, 0.94), new T.MeshStandardMaterial({ color: SYMCOL[name], roughness: 0.4 }), cells.length);
      const m4 = new T.Matrix4();
      cells.forEach(([x, y], i) => { m4.makeTranslation(x, y, 0); symMesh.setMatrixAt(i, m4); });
      symG.add(symMesh); symG.scale.setScalar(0.01); symPop = 0;
    }
    function sizeAll() {
      const w = stage.clientWidth, h = stage.clientHeight;
      if (renderer) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        const d = 78 * Math.max(1, 1.05 / camera.aspect) / (opt.zoom || 1);
        camera.position.set(0, 16, d); camera.lookAt(0, 7.5, 0); camera.updateProjectionMatrix();
      }
      const dpr = Math.min(devicePixelRatio, 2);
      cvp.width = Math.round(w * dpr); cvp.height = Math.round(h * dpr);
    }
    new ResizeObserver(sizeAll).observe(stage);

    function placeExplode() {
      if (!rig || !rig.meshes) return;
      const t = explode * explode * (3 - 2 * explode);
      const m4 = new T.Matrix4(), q = new T.Quaternion(), e3 = new T.Euler(), v = new T.Vector3(), one = new T.Vector3(1, 1, 1);
      rig.meshes.forEach(({ m, home, dir }) => {
        for (let i = 0; i < home.length; i++) {
          v.copy(home[i]).addScaledVector(dir[i], t);
          e3.set(dir[i].x * t * 0.3, dir[i].y * t * 0.3, 0); q.setFromEuler(e3);
          m4.compose(v, q, one); m.setMatrixAt(i, m4);
        }
        m.instanceMatrix.needsUpdate = true;
      });
    }

    /* --- 2D --- */
    const s2 = {
      head: d2.querySelector(".t2-head"), tail: d2.querySelector(".t2-tail"), eyes: d2.querySelector(".t2-eyes"),
      tongue: d2.querySelector(".t2-tongue"), earL: d2.querySelector(".t2-earL"), earR: d2.querySelector(".t2-earR"), body: d2.querySelector(".bob-svg"),
    };

    /* --- píxel --- */
    const px = { x: 0.2, dir: 1, ctx: cvp.getContext("2d"), frame: 0, acc: 0, jy: 0 };

    function symbol(name) {
      sym3d(name);
      symEl.className = "bob-sym" + (name ? " on s-" + name : "");
      symEl.innerHTML = name ? SYM[name].map((r) => [...r].map((c) => `<i class="${c === "#" ? "f" : ""}"></i>`).join("")).join("") : "";
      symEl.style.setProperty("--sc", name ? hex(SYMCOL[name]) : "transparent");
    }

    const api = {
      style(name) {
        style = name;
        stage.dataset.style = name;
        if (name === "voxel" || name === "toon") useRig(name);
        poof();
        ev("style");
      },
      set(s) { state = s; symbol(s === "idle" ? null : s); },
      jump() { jumpT = 0; symbol("love"); ev("jump"); setTimeout(() => symbol(state === "idle" ? null : state), 1300); },
    };
    function poof() {
      if (calm) return;
      for (let i = 0; i < 14; i++) {
        const p = document.createElement("i");
        p.className = "bob-poof";
        const a = (i / 14) * Math.PI * 2, r = 80 + Math.random() * 90;
        p.style.setProperty("--dx", Math.cos(a) * r + "px"); p.style.setProperty("--dy", Math.sin(a) * r + "px");
        p.style.background = ["#D97757", "#141413", "#F0EEE6", "#2F6BFF", "#D9C4A0"][i % 5];
        stage.appendChild(p); setTimeout(() => p.remove(), 700);
      }
    }

    api.style(style);
    sizeAll();
    let visible = true;
    new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(stage);
    let last = performance.now(), t = 0, blinkAt = 2.5;
    let hY = 0, hP = 0, hR = 0;

    (function loop(now) {
      requestAnimationFrame(loop);
      if (!visible) { last = now; return; }
      const dt = Math.min((now - last) / 1000, 0.05); last = now; t += dt;
      const happy = hover || state === "ok";
      let jy = 0, spin = 0;
      if (jumpT >= 0) { jumpT += dt; const j = jumpT / 0.55; if (j < 1) { jy = Math.sin(j * Math.PI); spin = j; } else jumpT = -1; }
      let roll = 0, pAdd = 0;
      if (state === "ojo") roll = 0.28;
      if (state === "signal") { roll = -0.22; pAdd = -0.25; }
      if (state === "fail") pAdd = 0.32;
      hY += (tYaw * (walk.on ? 0 : 1) - hY) * 0.1; hP += (tPitch + pAdd - hP) * 0.1; hR += (roll - hR) * 0.1;
      const wag = state === "fail" ? 0 : happy ? 0.7 : 0.35;
      const wagV = calm ? 0 : Math.sin(t * (happy ? 18 : 8)) * wag;
      if (!calm && t > blinkAt + 0.12) blinkAt = t + 3 + Math.random() * 2;
      const blinking = !calm && t > blinkAt;

      if ((style === "voxel" || style === "toon") && rig) {
        let gait = 0;
        if (walk.on) {
          walk.t += dt; const k = Math.min(1, walk.t / walk.dur);
          rig.root.position.x = walk.from * Math.pow(1 - k, 2); gait = 1 - k * k;
          const turn = Math.min(1, Math.max(0, (k - 0.7) / 0.3));
          rig.root.rotation.y = Math.PI / 2 * (1 - turn) + (opt.yaw ?? -0.4) * turn;
          if (k >= 1) { walk.on = false; Object.values(rigs).forEach((r) => (r.root.position.x = 0)); }
        } else rig.root.rotation.y += ((opt.yaw ?? -0.4) - rig.root.rotation.y) * 0.08;
        const sw = Math.sin(t * 11) * 0.6 * gait;
        rig.legs[0].rotation.x = sw; rig.legs[3].rotation.x = sw; rig.legs[1].rotation.x = -sw; rig.legs[2].rotation.x = -sw;
        rig.body.scale.y = 1 + (calm ? 0 : Math.sin(t * 2.6) * 0.018);
        rig.lift.position.y = Math.abs(Math.sin(t * 11)) * 0.5 * gait + jy * 6;
        rig.lift.rotation.y = spin * Math.PI * 2;
        rig.head.rotation.set(hP, hY, hR);
        const earT = state === "fail" ? 0.5 : state === "ojo" ? -0.35 : 0;
        rig.earL.rotation.z += (-earT - rig.earL.rotation.z) * 0.1; rig.earR.rotation.z += (earT - rig.earR.rotation.z) * 0.1;
        rig.tail.rotation.y = wagV;
        const ts = happy ? 1 : 0.001; rig.tongue.scale.setScalar(rig.tongue.scale.x + (ts - rig.tongue.scale.x) * 0.2);
        rig.eyes.scale.y = blinking ? 0.15 : 1;
        if (symMesh) { symPop = Math.min(1, symPop + dt * 4); symG.scale.setScalar(0.9 * symPop * (1 + Math.sin(symPop * Math.PI) * 0.25) + 0.001); symG.rotation.y = Math.sin(t * 2) * 0.4; }
        if (Math.abs(explodeTarget - explode) > 0.001 && style === "voxel") { explode += (explodeTarget - explode) * (calm ? 1 : 0.1); placeExplode(); }
        renderer.render(scene, camera);
      } else if (style === "dibujo") {
        s2.head.style.transform = `translate(${hY * 18}px, ${hP * 22}px) rotate(${(hR + hY * 0.15) * 57}deg)`;
        s2.tail.style.transform = `rotate(${wagV * 40}deg)`;
        s2.eyes.style.transform = `scaleY(${blinking ? 0.12 : 1})`;
        s2.tongue.style.opacity = happy ? 1 : 0;
        const ear = state === "fail" ? 18 : state === "ojo" ? -22 : Math.sin(t * 3) * 2;
        s2.earL.style.transform = `rotate(${-ear}deg)`; s2.earR.style.transform = `rotate(${ear}deg)`;
        s2.body.style.transform = `translateY(${-jy * 60}px) scale(${1 + (calm ? 0 : Math.sin(t * 2.6) * 0.012)}, ${1 - (calm ? 0 : Math.sin(t * 2.6) * 0.012)}) rotate(${spin * 360}deg)`;
      } else if (style === "pixel") {
        const ctx = px.ctx, W = cvp.width, H = cvp.height;
        const rows = TOP.length + 2, cols = 23;
        const u = Math.max(2, Math.floor(Math.min(W / (cols * 2.2), H / (rows * 1.6))));
        const moving = !hover && !calm && jumpT < 0;
        if (moving) { px.x += px.dir * dt * 0.12; if (px.x > 0.8) px.dir = -1; if (px.x < 0.2) px.dir = 1; }
        px.acc += dt; if (px.acc > (moving ? 0.12 : 0.3)) { px.acc = 0; px.frame ^= 1; }
        ctx.clearRect(0, 0, W, H); ctx.imageSmoothingEnabled = false;
        const ox = Math.round(px.x * W - (cols * u) / 2), oy = Math.round(H * 0.82 - rows * u - jy * 8 * u);
        ctx.fillStyle = "rgba(20,20,19,.14)"; ctx.fillRect(ox + 3 * u, Math.round(H * 0.82), (cols - 6) * u, u);
        const sprite = TOP.map((r, i) => (i >= 5 && i <= 7 && px.frame && !moving ? TAIL_B[i - 5] + r.slice(7) : r)).concat(moving && px.frame ? LEGS_B : LEGS_A);
        sprite.forEach((row, r) => [...row].forEach((ch, c) => {
          let k = ch;
          if (k === "g" && happy) k = "p";
          if (k === "w" && blinking) k = "k";
          if (!PX[k]) return;
          const cx = px.dir > 0 ? c : cols - 1 - c;
          ctx.fillStyle = PX[k]; ctx.fillRect(ox + cx * u, oy + r * u, u, u);
        }));
        stage.style.setProperty("--px-x", (px.x * 100).toFixed(1) + "%");
      }
    })(performance.now());
    return api;
  }

  /* dibuja el sprite de píxel en cualquier canvas (lo usa el mapa del camino) */
  function sprite(ctx, ox, oy, u, dir, moving, frame, happy) {
    const rows = TOP.map((r, i) => (i >= 5 && i <= 7 && frame && !moving ? TAIL_B[i - 5] + r.slice(7) : r)).concat(moving && frame ? LEGS_B : LEGS_A);
    rows.forEach((row, r) => [...row].forEach((ch, c) => {
      const k = ch === "g" && happy ? "p" : ch;
      if (!PX[k]) return;
      ctx.fillStyle = PX[k];
      ctx.fillRect(ox + (dir > 0 ? c : 22 - c) * u, oy + r * u, u, u);
    }));
  }

  window.Bob = { mount, sprite, rows: TOP.length + 2, cols: 23 };
})();
