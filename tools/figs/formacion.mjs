// Fig. Formación: dos objetos en un banco, uno por carrera.
// Industrial (ADEN): un estante de almacén con 60 cajas, una por materia; 54 puestas y 6 huecos que brillan.
// IA (ITSE): un chip de 7 capas apiladas, una por cuatrimestre; I a V encendidas, VI en curso, VII por venir.
// Entre los dos, una cinta lleva cajas del estante al chip: el cruce de las dos carreras.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { homedir } from "node:os";
import { asModule } from "./as-module.mjs";
import strings from "./strings/formacion.mjs";

const SKILL = join(homedir(), ".claude", "skills", "anatomy");
const k = await import(pathToFileURL(join(SKILL, "kit", "iso-kit.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts", "inline-kit.mjs")).href);
const HERE = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(HERE, "..", "..", "public");
const OUT = join(PUBLIC, "fig");
mkdirSync(OUT, { recursive: true });

for (const lang of ["es", "en"]) {
const t = strings[lang];

// ---------- la verdad ----------
const MATERIAS = 60, HECHAS = 54; // ~60 en el plan, 54 contando las 7 de este cuatrimestre (Tín, 2026-11-01)
const QUADS = t.quads; // plan oficial ITSE, CD-001-2024
const NOW_Q = 5;

// ---------- mundo ----------
const WIDTH = 640, HEIGHT = 430;
const PLATE = { x: -164, y: -40, w: 300, d: 80, r: 8 };
const PLATE_H = 10, FOOT_H = 5;
// estante: 6 bahías x 5 niveles x 2 cajas
const BAYS = 6, LEVELS = 5, BW = 18, LH = 16, POST = 3;
const RX0 = -154, RX1 = RX0 + BAYS * BW, RY0 = -30, RY1 = -4, RTOP = LEVELS * LH + 4;
const BOX = { w: 6.6, d: 17, h: 11 };
// chip
const SUB = { x: 34, y: -34, w: 86, d: 52, r: 2.5 };
const DIE = { x: 44, y: -27, w: 66, d: 38, r: 1.5 };
const QH = 6.2, STEP = 2.6, SUB_H = 3;
const qPlan = (i) => k.insetPlan(DIE, i * STEP);
const qZ = (i) => SUB_H + i * QH;
// cinta
const CONV = { x: -40, y: -8, w: 66, d: 13, r: 1.5 };
const BELT_Z = 12, CBOX = 5.6;
const RUN = [CONV.x + 4, CONV.x + CONV.w - 4];

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [RX0, RY0, RTOP], [RX1, RY1, RTOP], [DIE.x + DIE.w, DIE.y, qZ(7)], [-20, PLATE.y + PLATE.d, -40], [PLATE.x + PLATE.w, PLATE.y + PLATE.d, -40]],
  WIDTH, HEIGHT, { pad: 18, azimuth: 66 },
);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const depth = (x, y, z = 0) => k.depthOf([x, y, z], P);
const pct = ([x, y]) => [((x / WIDTH) * 100).toFixed(2), ((y / HEIGHT) * 100).toFixed(2)];

// ---------- banco ----------
function bench() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of k.corners(PLATE, 20).sort((a, b) => depth(...a) - depth(...b))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // regla del frente: una marca por materia bajo el estante, una por cuatrimestre bajo el chip
  const sy = PLATE.y + PLATE.d - 13;
  const strip = { x: RX0, y: sy, w: RX1 - RX0, d: 6, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const t = k.topTicks(RX0 + 3, RX1 - 3, (RX1 - RX0 - 6) / 59, 10, sy + 0.6, 0.6, [1.4, 3], P);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  const strip2 = { x: DIE.x, y: sy, w: DIE.w, d: 6, r: 1 };
  out.push(S(k.slabOf(strip2, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const t2 = k.topTicks(DIE.x + 4, DIE.x + DIE.w - 4, (DIE.w - 8) / 6, 1, sy + 0.6, 0.6, [3, 3], P);
  out.push(L(t2.major, { tone: "mid" }));
  return out.join("");
}

// ---------- estante ----------
const postXs = Array.from({ length: BAYS + 1 }, (_, i) => RX0 + i * BW - POST / 2);
function upright(x, y) {
  const out = [S(k.slabOf({ x: x - 1.2, y: y - 1.2, w: POST + 2.4, d: POST + 2.4, r: 0.4 }, 0, 1, P, 2), { tone: "lo" })];
  out.push(S(k.slabOf({ x, y, w: POST, d: POST, r: 0.3 }, 1, RTOP - 1, P, 2, 0.3), { tone: "mid" }));
  out.push(D([at([x + POST / 2, y + POST / 2, RTOP])], { size: 0.4 }));
  return out.join("");
}
const deckZ = (l) => l * LH + 3;
const slotOf = (n) => { const l = Math.floor(n / (BAYS * 2)), r = n % (BAYS * 2), bay = Math.floor(r / 2), side = r % 2; return { l, x: RX0 + bay * BW + POST / 2 + 1.2 + side * (BOX.w + 0.9), y: RY0 + 4.5, z: deckZ(l) + 1.2 }; };
function boxSvg(n) {
  const s = slotOf(n), plan = { x: s.x, y: s.y, w: BOX.w, d: BOX.d, r: 0.5 };
  if (n >= HECHAS) {
    return `<g class="ed-slot" data-b="${n}">${L(k.planOutline(plan, s.z, P, 2), { tone: "lit" })}${D([at([s.x + BOX.w / 2, s.y + BOX.d / 2, s.z])], { size: 0.6, tone: "lit" })}</g>`;
  }
  const tape = k.lineOnTop([s.x + BOX.w / 2, s.y], [s.x + BOX.w / 2, s.y + BOX.d], s.z + BOX.h, P);
  return `<g class="ed-box" data-b="${n}" style="--i:${n}">${S(k.slabOf(plan, s.z, BOX.h, P, 2, 0.4), { tone: "hi", className: "kraft" })}${L(tape, { tone: "lo" })}</g>`;
}
function level(l) {
  const z = deckZ(l), out = [];
  out.push(S(k.slabOf({ x: RX0, y: RY0 + 2, w: RX1 - RX0, d: RY1 - RY0 - 4, r: 0.4 }, z, 1.2, P, 2), { tone: "lo" }));
  for (const y of [RY0, RY1 - 2.4]) out.push(S(k.slabOf({ x: RX0, y, w: RX1 - RX0, d: 2.4, r: 0.4 }, z - 1.6, 2.8, P, 2), { tone: "mid" }));
  out.push(D(postXs.map((x) => at([x + POST / 2, RY1 - 1.2, z + 1.2])), { size: 0.38 }));
  const boxes = Array.from({ length: BAYS * 2 }, (_, i) => l * BAYS * 2 + i).sort((a, b) => depth(slotOf(a).x, 0) - depth(slotOf(b).x, 0));
  out.push(...boxes.map(boxSvg));
  return out.join("");
}
function rack() {
  const out = [];
  out.push(...postXs.map((x) => upright(x, RY0 - POST / 2)));
  for (let l = 0; l < LEVELS; l++) out.push(level(l));
  out.push(...postXs.map((x) => upright(x, RY1 - POST / 2)));
  // cabezal con placa de carga
  out.push(S(k.slabOf({ x: RX0 - 1.5, y: RY0 - 2, w: RX1 - RX0 + 3, d: RY1 - RY0 + 2.5, r: 0.6 }, RTOP, 1.6, P, 2, 0.3), { tone: "mid" }));
  return `<g data-part="rack">${out.join("")}</g>`;
}

// ---------- cinta ----------
function conveyor() {
  const out = [];
  for (const x of [CONV.x + 6, CONV.x + CONV.w - 10]) {
    out.push(S(k.slabOf({ x, y: CONV.y + 2, w: 4, d: CONV.d - 4, r: 0.6 }, 0, BELT_Z - 3, P, 2), { tone: "lo" }));
    out.push(S(k.slabOf({ x: x - 1.5, y: CONV.y + 1, w: 7, d: CONV.d - 2, r: 0.6 }, 0, 1, P, 2), { tone: "mid" }));
  }
  out.push(S(k.slabOf(CONV, BELT_Z - 3, 3, P, 4, 0.4), { tone: "mid" }));
  const belt = { x: CONV.x + 1.5, y: CONV.y + 2.2, w: CONV.w - 3, d: CONV.d - 4.4, r: 1 };
  out.push(S(k.slabOf(belt, BELT_Z, 0.4, P, 3), { tone: "lo", crease: "none" }));
  const rollers = [];
  for (let x = belt.x + 4; x < belt.x + belt.w - 2; x += 5) rollers.push(k.lineOnTop([x, belt.y], [x, belt.y + belt.d], BELT_Z + 0.4, P));
  out.push(L(rollers.join(""), { tone: "faint" }));
  // motor con perilla en el frente
  const mx = CONV.x + CONV.w - 16, my = CONV.y + CONV.d + 5;
  out.push(S(k.slabOf({ x: mx - 4, y: my - 4, w: 8, d: 8, r: 1 }, 0, 2, P, 2), { tone: "lo" }));
  out.push(S(k.cylinder(mx, my, 3.4, 2, 7, P, 24), { tone: "mid" }));
  out.push(L(k.knurl(mx, my, 3.4, 6, 9, 20, P), { tone: "lo" }));
  out.push(D([at([mx, my, 9])], { size: 0.6, tone: "lit" }));
  return `<g data-part="conv" data-c="1">${out.join("")}</g>`;
}
const cbox = () => {
  const plan = { x: -CBOX / 2, y: CONV.y + CONV.d / 2 - CBOX / 2, w: CBOX, d: CBOX, r: 0.4 };
  return `<g class="ed-cb-a">${S(k.slabOf(plan, BELT_Z + 0.4, 4.6, P, 2, 0.3), { tone: "hi", className: "kraft" })}</g><g class="ed-cb-b">${S(k.slabOf(plan, BELT_Z + 0.4, 4.6, P, 2, 0.3), { tone: "hi", className: "spark" })}</g>`;
};

// ---------- chip ----------
function chip() {
  const out = [`<path class="iso-halo" d="${k.haloOf(SUB, 0, 0.1, P)}" style="filter:blur(3px)"/>`];
  out.push(S(k.slabOf(SUB, 0, SUB_H, P, 4, 0.4), { tone: "mid" }));
  // capacitores y pads alrededor del dado
  const caps = [];
  for (let i = 0; i < 6; i++) caps.push({ x: SUB.x + 3, y: SUB.y + 6 + i * 7, w: 3, d: 4.4, r: 0.3 });
  for (let i = 0; i < 9; i++) caps.push({ x: SUB.x + 8 + i * 8.6, y: SUB.y + SUB.d - 5, w: 4.4, d: 2.6, r: 0.3 });
  caps.sort((a, b) => depth(a.x, a.y) - depth(b.x, b.y));
  out.push(...caps.map((c) => S(k.slabOf(c, SUB_H, 1.6, P, 2), { tone: "lo" })));
  const pads = [];
  for (let i = 0; i < 16; i++) pads.push(at([SUB.x + SUB.w - 3, SUB.y + 4 + i * 2.95, SUB_H]));
  out.push(D(pads, { size: 0.45 }));
  for (let i = 0; i < QUADS.length; i++) {
    const p = qPlan(i), z = qZ(i);
    const state = i < NOW_Q ? "on" : i === NOW_Q ? "cur" : "off";
    const vias = [];
    for (let j = 0; j < 7; j++) vias.push(at([p.x + 4 + j * ((p.w - 8) / 6), p.y + p.d - STEP / 2, z + QH]));
    const top = i === QUADS.length - 1 ? D(k.dotGrid(p.x + 5, p.y + 5, 9, 4, (p.w - 10) / 8, z + QH, P), { size: 0.5, tone: "mid" }) : "";
    out.push(`<g class="ed-q" data-q="${i}" data-s="${state}">${S(k.slabOf(p, z, QH, P, 3, 0.3), { tone: "hi", className: "die" })}${i < QUADS.length - 1 ? D(vias, { size: 0.42, tone: "lo" }) : ""}${top}</g>`);
  }
  return `<g data-part="chip">${out.join("")}</g>`;
}

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: t.label,
  body: [bench(), rack(), conveyor(), ...[0, 1, 2].map((i) => `<g data-part="cb" data-n="${i}" transform="${k.translateAlong(P, [RUN[0], 0, 0])}">${cbox()}</g>`), chip()],
});

// chapas con logo, bajo cada objeto (HTML para que el texto sea legible)
const tagAt = (x) => pct(at([x, PLATE.y + PLATE.d, -PLATE_H - FOOT_H - 6]));
const [ix, iy] = tagAt((RX0 + RX1) / 2), [cx, cy] = tagAt(DIE.x + DIE.w / 2);
const tags = `
<a class="ed-tag" data-deg="ind" href="#deg-ind" style="left:${ix}%"><img src="img/logos/aden.png" alt="${t.aden}" width="70" height="22"><span><b>${t.industrial}</b><i>${t.progress}</i></span></a>
<a class="ed-tag" data-deg="ia" href="#deg-ia" style="left:${cx}%"><img src="img/logos/itse.png" alt="${t.itse}" width="40" height="28"><span><b>${t.ai}</b><i>${t.quarter}</i></span></a>`;

const live = `
const TEXT = ${JSON.stringify(Object.fromEntries(["rest", "chip", "passed", "current", "pending", "rack", "missing", "cross"].map((key) => [key, t[key]])))};
const P = ${JSON.stringify(P)};
const QUADS = ${JSON.stringify(QUADS)};
const NOW_Q = ${NOW_Q}, HECHAS = ${HECHAS}, MATERIAS = ${MATERIAS}, RUN = ${JSON.stringify(RUN)};
const fig = document.getElementById("figEdu");
const stage = fig.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const readout = fig.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const boxes = [...svg.querySelectorAll(".ed-box")].sort((a, b) => a.dataset.b - b.dataset.b);
const quads = [...svg.querySelectorAll(".ed-q")].sort((a, b) => a.dataset.q - b.dataset.q);
const cbs = [...svg.querySelectorAll('[data-part="cb"]')];
const cards = { ind: document.querySelector('.deg[data-deg="ind"]'), ia: document.querySelector('.deg[data-deg="ia"]') };
const REST = TEXT.rest;
const say = (text, deg) => {
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuetext", text);
  for (const [id, el] of Object.entries(cards)) el?.classList.toggle("hot", id === deg);
  fig.querySelectorAll(".ed-tag").forEach((t) => t.classList.toggle("hot", t.dataset.deg === deg));
  svg.querySelectorAll(".ed-q.sel").forEach((q) => q.classList.remove("sel"));
};
const textOf = (el) => {
  if (el.dataset.q !== undefined) {
    const i = +el.dataset.q, [n, what] = QUADS[i];
    return [TEXT.chip.replace("{n}", n).replace("{what}", what).replace("{state}", i < NOW_Q ? TEXT.passed : i === NOW_Q ? TEXT.current : TEXT.pending), "ia"];
  }
  if (el.dataset.b !== undefined) return +el.dataset.b < HECHAS ? [TEXT.rack.replace("{done}", HECHAS).replace("{total}", MATERIAS), "ind"] : [TEXT.missing, "ind"];
  if (el.dataset.c) return [TEXT.cross, null];
  return null;
};
let current = null;
const show = (el) => {
  if (el === current) return;
  current = el;
  const r = el && textOf(el);
  if (!r) return say(REST, null);
  say(r[0], r[1]);
  if (el.dataset.q !== undefined) { el.classList.add("sel"); window.SFX?.play("tick"); }
};
stage.addEventListener("pointerover", (e) => show(e.target.closest("[data-q],[data-b],[data-c]")));
stage.addEventListener("pointerleave", () => show(null));
// teclado: las flechas recorren las 7 capas, el estante y la cinta
const stops = [svg.querySelector('.ed-box[data-b="0"]'), svg.querySelector('[data-c]'), ...quads];
let pick = -1;
stage.addEventListener("keydown", (e) => {
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (!step) return;
  e.preventDefault();
  pick = (pick + step + stops.length) % stops.length;
  show(stops[pick]);
});
stage.addEventListener("blur", () => { pick = -1; show(null); });

// entrada: las cajas se acomodan y las capas se encienden, una vez
let started = false, visible = false, frame = 0, last = 0, clock = 0;
function intro() {
  started = true;
  if (still.matches) return;
  fig.classList.add("ed-intro");
  quads.forEach((q) => q.dataset.live = "off");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    fig.classList.add("ed-go");
    quads.forEach((q, i) => setTimeout(() => { q.dataset.live = q.dataset.s; if (i <= NOW_Q) window.SFX?.play("tick"); }, 1500 + i * 180));
    setTimeout(() => fig.classList.remove("ed-intro", "ed-go"), 3400);
  }));
}
// la cinta: tres cajas que salen del estante y entran al chip
const span = RUN[1] - RUN[0], SPEED = 9;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now; clock += dt;
  cbs.forEach((g, i) => {
    const u = ((clock * SPEED + (i * span) / cbs.length) % span) / span;
    g.setAttribute("transform", translateAlong(P, [RUN[0] + u * span, 0, 0]));
    g.style.opacity = Math.min(1, u / 0.12, (1 - u) / 0.12).toFixed(3);
    g.style.setProperty("--m", Math.min(1, Math.max(0, (u - 0.4) / 0.25)).toFixed(3));
  });
  frame = visible && !still.matches ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
cbs.forEach((g, i) => { const u = i / cbs.length; g.setAttribute("transform", translateAlong(P, [RUN[0] + u * span, 0, 0])); g.style.setProperty("--m", Math.min(1, Math.max(0, (u - 0.4) / 0.25)).toFixed(3)); });
new IntersectionObserver((es) => {
  visible = es[es.length - 1].isIntersecting;
  if (visible && !started) intro();
  if (visible) run();
}, { rootMargin: "0px 0px -15% 0px" }).observe(stage);
still.addEventListener?.("change", run);
say(REST, null);
`;

const figure = k.plateHtml({
  fig: t.figure,
  title: t.title,
  hint: t.hint,
  readout: t.rest,
  keys: [],
  caption: t.caption,
  body: `<div class="iso-stage ed-stage" tabindex="0" role="group" aria-roledescription="${t.role}" aria-label="${t.navigation}">${svg}${tags}</div>`,
}).replace('<figure class="iso-figure"', '<figure class="iso-figure" id="figEdu"');

const script = kitScript() + asModule(live);
// Conserva los saltos CRLF del fragmento de referencia.
writeFileSync(join(OUT, `formacion.${lang}.html`), figure.replaceAll('src="img/', 'src="/img/').replaceAll('\n', '\r\n'));
writeFileSync(join(OUT, `formacion.${lang}.js`), script);
if (lang === "es") writeFileSync(join(OUT, "formacion.js"), script);
console.log(`Generado: formacion.${lang}.html, formacion.${lang}.js`);
}
writeFileSync(join(OUT, "iso.css"), k.ISO_CSS);
