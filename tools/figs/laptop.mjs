// Fig. La laptop: una ROG Strix G16 (2024) abierta sobre su alfombrilla. En la pantalla, VS Code con Claude Code:
// escribes una tarea, Claude planea, lee, edita y verifica. Al verificar la CPU trabaja, se calienta y los
// ventiladores suben (un lazo de control). El RGB por tecla y la barra de luz van en arcoíris o en el color que elijas.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { homedir } from "node:os";
import { asModule } from "./as-module.mjs";
import strings from "./strings/laptop.mjs";

const SKILL = join(homedir(), ".claude", "skills", "anatomy");
const k = await import(pathToFileURL(join(SKILL, "kit", "iso-kit.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts", "inline-kit.mjs")).href);
const HERE = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(HERE, "..", "..", "public");
const OUT = join(PUBLIC, "fig");
mkdirSync(OUT, { recursive: true });
const logo = (name) => readFileSync(join(PUBLIC, "img", "logos", name + ".svg"), "utf8").match(/ d="([^"]+)"/)[1];

for (const lang of ["es", "en"]) {
const T = strings[lang];

// mundo: 1 unidad = 2,5 mm. x ancho de la laptop, y fondo (frente en +y), z alto
const WIDTH = 640, HEIGHT = 600;
const MAT = { x: -84, y: -60, w: 168, d: 130, r: 7 };
const MAT_H = 1.6;
const BASE = { x: -71, y: -53, w: 142, d: 106, r: 3 };
const FOOT = 1.5, DECK = 11.5;
const FRONT = BASE.y + BASE.d, RIGHT = BASE.x + BASE.w;
// tapa: gira sobre la bisagra y queda 14° hacia atrás
const TILT = 14 * Math.PI / 180, LID_H = 99, LID_T = 2.4;
const HINGE = { y: -47.5, z: 12.6 };
const UP = [0, -Math.sin(TILT), Math.cos(TILT)], NORMAL = [0, Math.cos(TILT), Math.sin(TILT)];
const PANEL = { u: 3, v: 4.6, w: 136, h: 85 }; // 16:10
// teclado: 15 unidades de tecla a 7,6 (19 mm)
const PITCH = 7.6, GAP = 1.1, KB_X = -57, CAP_H = 1.4;

const lidPoint = (x, s, t = LID_T) => [x, HINGE.y + NORMAL[1] * t + UP[1] * s, HINGE.z + NORMAL[2] * t + UP[2] * s];
const P = k.fitProjection(
  [...k.boxCorners(MAT, -MAT_H, 0), ...[-71, 71].flatMap((x) => [lidPoint(x, LID_H), lidPoint(x, LID_H, 0)])],
  WIDTH, HEIGHT, { pad: 12, azimuth: 66, elevation: 24 },
);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const depth = (x, y, z = 0) => k.depthOf([x, y, z], P);
const box = (x, y, w, d, z0, z1, tone = "mid", r = 0.6, bevel = 0.4, style = {}) => S(k.slabOf({ x, y, w, d, r }, z0, z1 - z0, P, 3, bevel), { tone, ...style });
const f2 = (n) => (+n).toFixed(2);
const rect = (u0, v0, u1, v1, r = 0) => k.pathOf(k.roundedPlan({ x: Math.min(u0, u1), y: Math.min(v0, v1), w: Math.abs(u1 - u0), d: Math.abs(v1 - v0), r }, 4), true);
const circle = (u, v, r) => `M${f2(u - r)} ${f2(v)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const onX = (x, inner) => `<g transform="${k.sideMatrix([x, 0], 0, P, "right")}">${inner}</g>`; // (-y, -z)
const onY = (y, inner) => `<g transform="${k.sideMatrix([0, y], 0, P, "left")}">${inner}</g>`; // (x, -z)
const onTop = (z, inner) => `<g transform="${k.topMatrix([0, 0], z, P)}">${inner}</g>`; // (x, y)
// un plano cualquiera: origen y dos ejes del mundo, para la pantalla inclinada
function planeMatrix(o, u, v) {
  const a = at(o), b = at([o[0] + u[0], o[1] + u[1], o[2] + u[2]]), c = at([o[0] + v[0], o[1] + v[1], o[2] + v[2]]);
  return `matrix(${[b[0] - a[0], b[1] - a[1], c[0] - a[0], c[1] - a[1], a[0], a[1]].map((n) => n.toFixed(4)).join(" ")})`;
}
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const txt = (u, v, size, text, cls = "lap-t", extra = "") => `<text class="${cls}" x="${f2(u)}" y="${f2(v)}" font-size="${size}"${extra}>${esc(text)}</text>`;
const icon = (d, u, v, s, cls) => `<path class="${cls}" transform="translate(${f2(u)} ${f2(v)}) scale(${(s / 24).toFixed(4)})" d="${d}"/>`;

let rgbN = 0;
const glowPos = (x) => ((x - BASE.x) / BASE.w).toFixed(3);

function mat() {
  const out = [`<path class="iso-halo" d="${k.haloOf(MAT, -MAT_H, MAT_H, P)}"/>`];
  out.push(S(k.slabOf(MAT, -MAT_H, MAT_H, P, 8, 0.5), { tone: "lo", className: "lap-mat" }));
  out.push(L(k.planOutline(k.insetPlan(MAT, 1.6), 0, P, 8), { tone: "lo", dotted: true }));
  // la luz de la barra frontal sobre la alfombrilla
  out.push(onTop(0.02, `<ellipse class="lap-floor" cx="0" cy="${FRONT + 7}" rx="78" ry="8" fill="url(#lapFloor)"/>`));
  return out.join("");
}

function base() {
  const out = [];
  for (const [x0, x1] of [[-62, -20], [20, 62]]) for (const y of [BASE.y + 6, FRONT - 7]) out.push(box(x0, y - 1, x1 - x0, 2, 0, FOOT, "lo", 1, 0));
  out.push(`<path class="iso-halo" d="${k.haloOf(BASE, FOOT, DECK - FOOT, P)}"/>`);
  out.push(box(BASE.x, BASE.y, BASE.w, BASE.d, FOOT, DECK, "mid", BASE.r, 0.8, { className: "lap-shell" }));
  // barra trasera con las rayas diagonales, detrás de la bisagra
  const stripes = [];
  for (let x = BASE.x + 4; x < RIGHT - 5; x += 2.2) stripes.push(k.lineOnTop([x, BASE.y + 1.2], [x + 3.4, HINGE.y - 3.2], DECK, P));
  out.push(L(stripes.join(""), { tone: "faint" }));
  out.push(L(k.lineOnTop([BASE.x + 2, HINGE.y - 2.6], [RIGHT - 2, HINGE.y - 2.6], DECK, P), { tone: "lo" }));
  // rejilla del lado derecho: el aire caliente sale por aquí
  const slits = [], well = rect(-(BASE.y + 9), -(FOOT + 2.4), -(BASE.y + 44), -(DECK - 1.8), 1);
  for (let y = BASE.y + 10.4; y <= BASE.y + 43; y += 1.8) slits.push(rect(-y - 0.45, -(FOOT + 3), -y + 0.45, -(DECK - 2.4), 0.4));
  out.push(onX(RIGHT, `<path class="lap-well" d="${well}"/><path class="lap-heatwell" d="${well}"/><path class="lap-slat" d="${slits.join("")}"/><path class="iso-line" data-tone="lo" d="${well}"/>`));
  // aire caliente que sale de la rejilla, más fuerte con las rpm
  const heat = [];
  for (const y of [BASE.y + 14, BASE.y + 26, BASE.y + 38]) {
    const pts = [];
    for (let i = 0; i <= 12; i++) { const s = i / 12; pts.push([RIGHT + 0.5 + s * 18, -(DECK - 4 + s * 7 + Math.sin(s * 9 + y) * 1.2)]); }
    heat.push(`<g transform="${k.sideMatrix([0, y], 0, P, "left")}"><path class="lap-heat" d="M${pts.map((p) => p.map(f2).join(" ")).join("L")}"/></g>`);
  }
  out.push(`<g data-heat>${heat.join("")}</g>`);
  // barra de luz del frente, que dobla la esquina
  const bar = [];
  const segs = 16, x0 = BASE.x + 5, x1 = RIGHT - 3;
  for (let i = 0; i < segs; i++) {
    const a = x0 + (i * (x1 - x0)) / segs, b = x0 + ((i + 1) * (x1 - x0)) / segs;
    bar.push(`<g class="lap-rgb" data-rgb="${rgbN++}" data-p="${glowPos((a + b) / 2)}"><path class="lap-halo" d="M${f2(a)} ${-(FOOT + 1.2)}H${f2(b)}"/><path class="lap-led" d="M${f2(a)} ${-(FOOT + 1.2)}H${f2(b)}"/></g>`);
  }
  out.push(onY(FRONT, `<path class="lap-slot" d="${rect(x0 - 0.6, -(FOOT + 0.5), x1 + 0.6, -(FOOT + 1.9), 0.7)}"/>${bar.join("")}`));
  out.push(onX(RIGHT, `<g class="lap-rgb" data-rgb="${rgbN++}" data-p="1"><path class="lap-halo" d="M${-(FRONT - 3)} ${-(FOOT + 1.2)}H${-(FRONT - 16)}"/><path class="lap-led" d="M${-(FRONT - 3)} ${-(FOOT + 1.2)}H${-(FRONT - 16)}"/></g>`));
  // muesca para abrir la tapa y los LED de estado
  out.push(onY(FRONT, `<path class="iso-line" data-tone="lo" d="${rect(-12, -(DECK - 0.4), 12, -(DECK - 1.8), 0.7)}"/>`));
  out.push(D([42, 45, 48, 51].map((x) => at([x, FRONT, DECK - 3.4])), { size: 0.4, tone: "hi" }));
  return out.join("");
}

function hinge() {
  return box(-60, HINGE.y - 2.2, 120, 3.2, DECK, 14.4, "lo", 1.4, 0.5);
}

// la tapa: dos cantos sombreados y la cara con la pantalla, dibujada en su propio plano
function lid() {
  const out = [];
  const poly = (pts, cls, extra = "") => `<path class="${cls}"${extra} d="M${pts.map((p) => at(p).map(f2).join(" ")).join("L")}Z"/>`;
  out.push(poly([lidPoint(RIGHT, -1, 0), lidPoint(RIGHT, LID_H, 0), lidPoint(RIGHT, LID_H), lidPoint(RIGHT, -1)], "iso-shade", ' data-shade="1"'));
  out.push(poly([lidPoint(BASE.x, LID_H, 0), lidPoint(RIGHT, LID_H, 0), lidPoint(RIGHT, LID_H), lidPoint(BASE.x, LID_H)], "iso-top"));
  out.push(`<path class="iso-line" data-tone="mid" d="M${[lidPoint(BASE.x, LID_H, 0), lidPoint(RIGHT, LID_H, 0), lidPoint(RIGHT, -1, 0), lidPoint(RIGHT, -1), lidPoint(RIGHT, LID_H), lidPoint(BASE.x, LID_H), lidPoint(BASE.x, LID_H, 0)].map((p) => at(p).map(f2).join(" ")).join("L")}"/>`);
  const o = lidPoint(BASE.x, LID_H), down = [0, -UP[1], -UP[2]];
  out.push(`<g transform="${planeMatrix(o, [1, 0, 0], down)}">${face()}</g>`);
  return out.join("");
}

// pantalla: bisel, fondo ROG, VS Code con Claude Code, barra de tareas
function face() {
  const W = BASE.w, H = LID_H + 1;
  const out = [`<path class="lap-bezel" d="${rect(0, 0, W, H, 2.2)}"/>`];
  out.push(`<path class="lap-cam" d="${circle(W / 2, 2.3, 0.7)}"/>`);
  out.push(txt(W / 2, H - 3.2, 2.2, "ROG STRIX", "lap-chin", ' text-anchor="middle"'));
  out.push(`<g data-scr transform="translate(${PANEL.u} ${PANEL.v})">${screen()}</g>`);
  out.push(`<path class="lap-glass" d="${rect(PANEL.u, PANEL.v, PANEL.u + PANEL.w, PANEL.v + PANEL.h, 0.4)}"/>`);
  out.push(`<path class="iso-line" data-tone="lo" d="${rect(0, 0, W, H, 2.2)}"/>`);
  return out.join("");
}

const ROW = 2.75, ROWS = 17, ED = { u: 22.6, v: 7.4, w: 56.8 }, CL = { u: 80, w: 56 };
function screen() {
  const { w: W, h: H } = PANEL;
  const o = [];
  // fondo: el logo de ROG sobre negro, como el arranque de la laptop
  o.push(`<path class="lap-wall" d="${rect(0, 0, W, H)}"/>`);
  o.push(`<g data-lock>${icon(logo("republicofgamers"), W / 2 - 17, 14, 34, "lap-rog")}${txt(W / 2, 62, 9, "00:00", "lap-lockclock", ' text-anchor="middle" data-clock')}${txt(W / 2, 67.5, 2.4, "Republic of Gamers", "lap-dim", ' text-anchor="middle"')}</g>`);
  // ventana de VS Code
  const win = [];
  win.push(`<path class="lap-vs" d="${rect(0, 0, W, 81)}"/>`);
  win.push(`<path class="lap-bar" d="${rect(0, 0, W, 3.2)}"/>`);
  win.push(icon(logo("visualstudiocode"), 1, 0.45, 2.3, "lap-vscode"));
  win.push(txt(W / 2, 2.25, 1.6, T.screenTitle, "lap-dim", ' text-anchor="middle" data-title'));
  win.push(`<path class="lap-ui" d="M${W - 11} 1.6h1.6M${W - 6.8} 0.9h1.4v1.4h-1.4zM${W - 2.9} 0.9l1.4 1.4M${W - 1.5} 0.9l-1.4 1.4"/>`);
  // barra de actividad
  win.push(`<path class="lap-act" d="${rect(0, 3.2, 4, 78)}"/>`);
  win.push(`<path class="lap-ui" d="M1.1 5.2h1.4l0.8 0.8v2h-2.2zM2 11.4a0.9 0.9 0 1 0 0.01 0M2.6 12l0.8 0.8M1.4 16.2v2.4M2.8 16.6a0.6 0.6 0 1 0 0.01 0M1.4 18.6a0.6 0.6 0 1 0 0.01 0M1.4 17.4q0 1 1.4 -0.2"/>`);
  win.push(icon(logo("claude"), 0.8, 21.4, 2.4, "lap-claude"));
  // explorador
  const files = T.files;
  win.push(`<path class="lap-side" d="${rect(4, 3.2, 22, 78)}"/>`);
  win.push(txt(5.4, 6, 1.5, T.project, "lap-dim"));
  files.forEach((f, i) => {
    const v = 8.6 + i * 2.6, sub = !f.endsWith("/") && i > 1 && i < 5 || i === 8 || i === 9;
    win.push(`<rect class="lap-fh" data-f="${f}" x="4.3" y="${f2(v - 1.9)}" width="17.4" height="2.5" rx="0.3"/>`);
    win.push(txt(sub ? 7.4 : 5.6, v, 1.6, (f.endsWith("/") ? "› " : "") + f, "lap-file"));
  });
  // editor
  win.push(`<path class="lap-tabs" d="${rect(22, 3.2, 79.4, 6)}"/>`);
  win.push(`<path class="lap-tab" d="${rect(22, 3.2, 37.4, 6)}"/>${txt(23.4, 5.1, 1.55, T.files[2], "lap-file", " data-tab")}`);
  for (let i = 0; i < ROWS; i++) {
    const v = ED.v + i * ROW;
    win.push(`<rect class="lap-row" data-rowbg="${i}" x="${ED.u}" y="${f2(v - 1.95)}" width="${ED.w}" height="${ROW}"/>`);
    win.push(txt(ED.u + 4.4, v, 1.6, String(40 + i), "lap-gut", ` text-anchor="end" data-gut="${i}"`));
    win.push(txt(ED.u + 6, v, 1.75, "", "lap-code", ` data-row="${i}"`));
  }
  // terminal
  win.push(`<path class="lap-term" d="${rect(22, 55, 79.4, 78)}"/>`);
  win.push(`<path class="lap-ui" d="M22 55H79.4"/>`);
  win.push(txt(23.4, 58, 1.45, T.terminal, "lap-dim"));
  for (let i = 0; i < 4; i++) win.push(txt(23.4, 61.6 + i * 3, 1.7, i ? "" : T.prompt, "lap-code", ` data-term="${i}"`));
  win.push(`<rect class="lap-progbg" x="23.4" y="74.6" width="40" height="1.1" rx="0.5"/><rect class="lap-prog" data-prog x="23.4" y="74.6" width="0" height="1.1" rx="0.5"/>`);
  // Claude Code
  win.push(`<path class="lap-cc" d="${rect(CL.u - 0.6, 3.2, W, 78)}"/>`);
  win.push(icon(logo("claude"), CL.u + 1.4, 4.2, 3.6, "lap-claude"));
  win.push(txt(CL.u + 6.2, 7.1, 2.5, "Claude Code", "lap-cct"));
  win.push(`<rect class="lap-bubble" data-bubble x="${CL.u + 1}" y="10.6" width="${CL.w - 3}" height="9.4" rx="1.2"/>`);
  win.push(txt(CL.u + 2.6, 14.3, 2.4, "", "lap-msg", ' data-user="0"') + txt(CL.u + 2.6, 17.9, 2.4, "", "lap-msg", ' data-user="1"'));
  T.steps.forEach((s, i) => {
    const v = 26.5 + i * 8;
    win.push(`<g class="lap-step" data-step="${i}"><circle class="lap-sdot" cx="${CL.u + 3.2}" cy="${f2(v - 1.1)}" r="1.4"/>${txt(CL.u + 6.4, v, 3.4, s, "lap-stxt")}${txt(CL.u + 6.4, v + 3.2, 2.1, "", "lap-sub", ` data-sub="${i}"`)}</g>`);
  });
  win.push(`<rect class="lap-input" x="${CL.u + 1}" y="68.6" width="${CL.w - 3}" height="7" rx="1.2"/>`);
  win.push(txt(CL.u + 2.4, 73.2, 2.4, "›", "lap-cct") + txt(CL.u + 5, 73.2, 2.4, "", "lap-msg", " data-input") + `<rect class="lap-caret" data-caret x="${CL.u + 5}" y="70.8" width="1" height="3.2"/>`);
  // barra de estado
  win.push(`<path class="lap-status" d="${rect(0, 78, W, 81)}"/>`);
  win.push(txt(2, 80, 1.5, T.status, "lap-stat") + txt(W - 2, 80, 1.5, T.position, "lap-stat", ' text-anchor="end"'));
  o.push(`<g data-win class="lap-win" style="opacity:0">${win.join("")}</g>`);
  // barra de tareas
  o.push(`<path class="lap-task" d="${rect(0, 81, W, H)}"/>`);
  const c = W / 2 - 6;
  o.push(`<path class="lap-win11" d="M${c - 0.9} 81.9h0.85v0.85h-0.85zM${c + 0.05} 81.9h0.85v0.85h-0.85zM${c - 0.9} 82.85h0.85v0.85h-0.85zM${c + 0.05} 82.85h0.85v0.85h-0.85z"/>`);
  o.push(icon(logo("visualstudiocode"), c + 3.2, 81.85, 2, "lap-vscode") + icon(logo("claude"), c + 7, 81.85, 2, "lap-claude"));
  o.push(`<path class="lap-ui" d="M${c + 11} 82h2v1.8h-2zM${c + 11.4} 82.9l0.4 0.3l-0.4 0.3"/>`);
  o.push(txt(W - 2, 83.6, 1.5, "00:00", "lap-stat", ' text-anchor="end" data-clock'));
  return o.join("");
}

// teclado en español, como el de la foto: fila de atajos, F, números y cuatro filas más
const ROWS_KB = [
  { y: -38.6, d: 3.6, keys: [[" vol-", 1], ["vol+", 1], ["mic", 1], ["rog", 1]], x: -7.6 },
  { y: -33.6, d: 4.6, keys: [["esc", 1], ...Array.from({ length: 12 }, (_, i) => ["f" + (i + 1), 1]), ["supr", 1], ["⏻", 1]] },
  { y: -27.2, keys: [["º", 1], ..."1234567890".split("").map((c) => [c, 1]), ["'", 1], ["¡", 1], ["⌫", 2]] },
  { y: -19.6, keys: [["⇥", 1.5], ..."qwertyuiop".split("").map((c) => [c, 1]), ["`", 1], ["+", 1], ["↵", 1.5]] },
  { y: -12, keys: [["bloq", 1.75], ..."asdfghjklñ".split("").map((c) => [c, 1]), ["´", 1], ["ç", 1], ["↵ ", 1.25]] },
  { y: -4.4, keys: [["⇧", 1.25], ["<", 1], ..."zxcvbnm,.-".split("").map((c) => [c, 1]), ["⇧ ", 1.75], ["↑", 1]] },
  { y: 3.2, keys: [["ctrl", 1], ["fn", 1], ["win", 1], ["alt", 1], [" ", 6], ["alt gr", 1], ["ctrl ", 1], ["←", 1], ["↓", 1], ["→", 1]] },
];
const CLEAR = new Set(["w", "a", "s", "d"]);
const LABEL = T.keyLabels;
function keyboard() {
  const keys = [];
  for (const row of ROWS_KB) {
    let x = row.x ?? KB_X;
    const d = (row.d ?? PITCH) - GAP;
    for (const [id, units] of row.keys) {
      const w = units * PITCH - GAP;
      keys.push({ id: id.trim() || id, x, y: row.y, w, d, label: LABEL[id] ?? id.toUpperCase(), small: !!row.d });
      x += units * PITCH;
    }
  }
  keys.sort((a, b) => depth(a.x + a.w / 2, a.y + a.d / 2) - depth(b.x + b.w / 2, b.y + b.d / 2));
  const out = [];
  // marco del teclado hundido un poco en la cubierta
  out.push(L(k.planOutline({ x: KB_X - 1.6, y: -35.4, w: 15 * PITCH + 2.1, d: 46.2, r: 1.6 }, DECK, P, 4), { tone: "faint" }));
  for (const key of keys) {
    const plan = { x: key.x, y: key.y, w: key.w, d: key.d, r: 0.7 };
    const glow = k.planOutline(k.insetPlan(plan, -0.3), DECK + 0.05, P, 3);
    const cx = key.x + key.w / 2, cy = key.y + key.d / 2, top = DECK + CAP_H;
    const fs = key.label.length > 2 ? 1.5 : key.small ? 1.8 : 2.5;
    const legend = key.label ? `<g transform="${k.topMatrix([cx, cy], top, P)}"><text class="lap-leg" x="0" y="${(fs * 0.36).toFixed(2)}" font-size="${fs}" text-anchor="middle">${esc(key.label === "⏻" ? "" : key.label)}</text></g>` : "";
    const power = key.label === "⏻" ? `<path class="lap-led" transform="${k.topMatrix([cx, cy], top, P)}" d="M-0.9 -0.7a1.2 1.2 0 1 0 1.8 0M0 -1.4v1.1"/>` : "";
    const cap = S(k.slabOf(plan, DECK, CAP_H, P, 3, 0.3), { tone: "lo", className: CLEAR.has(key.id) ? "lap-cap lap-clear" : "lap-cap" });
    const sw = CLEAR.has(key.id) ? L(k.ring(cx, cy, 1.2, top, P, 14), { tone: "faint" }) : "";
    out.push(`<g class="lap-rgb lap-key" data-rgb="${rgbN++}" data-p="${glowPos(cx)}" data-k="${esc(key.id)}"><path class="lap-soft" d="${glow}"/><path class="lap-led" d="${glow}"/><g data-press>${cap}${sw}${legend}${power}</g></g>`);
  }
  return out.join("");
}

function deck() {
  const out = [];
  // panel táctil
  const pad = { x: -27, y: 15, w: 54, d: 32, r: 2 };
  out.push(S(k.slabOf(pad, DECK, 0.25, P, 4), { tone: "lo", crease: "none", className: "lap-pad" }));
  out.push(L(k.lineOnTop([pad.x, pad.y + pad.d - 7], [pad.x + pad.w, pad.y + pad.d - 7], DECK + 0.25, P), { tone: "faint" }));
  // etiquetas del reposamanos, como en la foto
  const st = (x, y, w, d, inner) => onTop(DECK + 0.05, `<g transform="translate(${x} ${y})">${inner}</g>`);
  out.push(st(-62, 13, 7, 7.6, `<path class="lap-intel" d="${rect(0, 0, 7, 7.6, 0.4)}"/>${icon(logo("intel"), 0.6, -0.8, 4.2, "lap-white")}<text class="lap-white" x="0.7" y="5.2" font-size="1.7">CORE</text><text class="lap-white" x="6.4" y="7" font-size="1.2" text-anchor="end">i9</text>`));
  out.push(st(-54, 13, 7, 7.6, `<path class="lap-nv" d="${rect(0, 0, 7, 2.8, 0.4)}"/>${icon(logo("nvidia"), 0.4, 0.2, 2.4, "lap-black")}<text class="lap-black" x="2.9" y="2" font-size="1.05">NVIDIA</text><path class="lap-black" d="${rect(0, 2.8, 7, 7.6, 0.4)}"/><text class="lap-white" x="0.6" y="5" font-size="1.25">GEFORCE</text><text class="lap-white" x="0.6" y="6.7" font-size="1.25">RTX</text>`));
  out.push(st(-62, 21.6, 10, 2.6, `<path class="lap-nv" d="${rect(0, 0, 5, 2.6, 0.3)}"/>${icon(logo("nvidia"), 0.3, 0.3, 2, "lap-black")}<path class="lap-black" d="${rect(5, 0, 10, 2.6, 0.3)}"/><text class="lap-white" x="5.4" y="1.8" font-size="1.05">G-SYNC</text>`));
  // rejilla de los altavoces, junto a la bisagra
  out.push(D(Array.from({ length: 56 }, (_, i) => at([-55 + i * 2, -42.8, DECK])), { size: 0.3, tone: "lo" }));
  return out.join("");
}

const style = `<style>
.iso .lap-mat>.iso-fill{fill:#0B0B0D}.iso .lap-mat>.iso-top{fill:#111114}
.iso .lap-shell>.iso-top{fill:#2A2A2F}.iso .lap-shell>.iso-fill{fill:#1D1D21}
.iso .lap-cap>.iso-top{fill:#121215}.iso .lap-cap>.iso-fill{fill:#0A0A0C}.iso .lap-cap>.iso-shade{fill:#060607}
.iso .lap-clear>.iso-top{fill:currentColor;fill-opacity:.22}.iso .lap-clear>.iso-shade{fill:currentColor;fill-opacity:.12}
.iso .lap-pad>.iso-top{fill:#202024}
.iso .lap-rgb{color:#FF0029}
.iso .lap-led{fill:none;stroke:currentColor;stroke-width:1.2;vector-effect:non-scaling-stroke;stroke-linecap:round;opacity:var(--lap-on,.8)}
.iso .lap-halo{fill:none;stroke:currentColor;stroke-width:8;opacity:calc(.3 * var(--lap-on,.8));vector-effect:non-scaling-stroke;filter:blur(3px);stroke-linecap:round}
.iso .lap-soft{fill:none;stroke:currentColor;stroke-width:3.4;opacity:calc(.32 * var(--lap-on,.8));vector-effect:non-scaling-stroke;stroke-linejoin:round}
.iso .lap-leg{fill:currentColor;font-weight:700;font-family:"Archivo",sans-serif;letter-spacing:.02em}
.iso .lap-floor{filter:blur(7px);opacity:calc(.5 * var(--lap-on,.8))}
.iso .lap-slot,.iso .lap-well{fill:#050506}
.iso .lap-slat{fill:#26262B}
.iso .lap-heatwell{fill:#FF5A14;opacity:calc(var(--lap-heat,0) * .5);filter:blur(1px)}
.iso .lap-heat{fill:none;stroke:#FF7A2A;stroke-width:1.4;vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-dasharray:3 5;opacity:calc(var(--lap-heat,0) * .55)}
.iso .lap-bezel{fill:#08080A}.iso .lap-cam{fill:#1A1A1E}
.iso .lap-chin{fill:#3A3A40;font-weight:800;font-family:"Archivo",sans-serif;letter-spacing:.3em}
.iso .lap-glass{fill:url(#lapGlass);pointer-events:none}
.iso .lap-wall{fill:#030304}
.iso .lap-rog{fill:#FF0029;filter:drop-shadow(0 0 2px rgba(255,0,41,.6))}
.iso .lap-lockclock{fill:#E8E4DC;font-weight:300;font-family:"Archivo",sans-serif}
.iso [data-lock]{transition:opacity .6s}
.iso .lap-win{transition:opacity .5s}
.iso .lap-vs{fill:#18181B}.iso .lap-bar,.iso .lap-tabs,.iso .lap-act{fill:#111113}.iso .lap-side,.iso .lap-cc{fill:#141417}.iso .lap-tab{fill:#18181B}
.iso .lap-term{fill:#121214}.iso .lap-task{fill:#0D0D10}
.iso .lap-status{fill:var(--lap-c,#FF6A2A);opacity:.85}
.iso .lap-stat{fill:#0A0A0C;font-weight:600;font-family:"IBM Plex Mono",monospace}
.iso .lap-task~.lap-stat{fill:#C9C4BA}
.iso .lap-ui{fill:none;stroke:#8A867F;stroke-width:.25;stroke-linecap:round;stroke-linejoin:round}
.iso .lap-vscode{fill:#0A84D6}.iso .lap-claude{fill:#D97757}.iso .lap-win11{fill:#5AA9F0}
.iso .lap-t,.iso .lap-dim{fill:#7A766F;font-weight:500;font-family:"IBM Plex Mono",monospace}
.iso .lap-file{fill:#B9B4AA;font-weight:500;font-family:"IBM Plex Mono",monospace}
.iso .lap-fh{fill:var(--lap-c,#FF6A2A);opacity:0}
.iso .lap-fh[data-on]{opacity:.22}
.iso .lap-gut{fill:#4E4B46;font-weight:500;font-family:"IBM Plex Mono",monospace}
.iso .lap-code{fill:#C9C4BA;font-weight:500;font-family:"IBM Plex Mono",monospace;white-space:pre}
.iso .lap-row{fill:transparent}.iso .lap-row[data-add]{fill:#FF8A3D;fill-opacity:.16}.iso .lap-row[data-del]{fill:#FF2E4D;fill-opacity:.16}
.iso .lap-progbg{fill:#26262B}.iso .lap-prog{fill:var(--lap-c,#FF6A2A)}
.iso .lap-cct{fill:#E8E4DC;font-weight:700;font-family:"Archivo",sans-serif}
.iso .lap-bubble{fill:#222226;opacity:0}.iso .lap-bubble[data-on]{opacity:1}
.iso .lap-msg{fill:#E8E4DC;font-weight:500;font-family:"IBM Plex Mono",monospace;white-space:pre}
.iso .lap-input{fill:#0E0E10;stroke:#3A3A40;stroke-width:.2}
.iso .lap-caret{fill:#D97757}
.iso .lap-step{opacity:.28;transition:opacity .3s}.iso .lap-step[data-on]{opacity:1}
.iso .lap-sdot{fill:#3A3A40}.iso .lap-step[data-on] .lap-sdot{fill:#D97757}.iso .lap-step[data-done] .lap-sdot{fill:var(--lap-c,#FF6A2A)}
.iso .lap-stxt{fill:#E8E4DC;font-weight:700;font-family:"Archivo",sans-serif}
.iso .lap-sub{fill:#8A867F;font-weight:500;font-family:"IBM Plex Mono",monospace}
.iso .lap-intel{fill:#0068B5}.iso .lap-nv{fill:#76B900}.iso .lap-black{fill:#0A0A0A}.iso .lap-white{fill:#F2F2F2;font-weight:800;font-family:"Archivo",sans-serif}
.iso text.lap-black{font-weight:800;font-family:"Archivo",sans-serif}
</style>`;

const defs = `<defs>
<linearGradient id="lapFloor" x1="0" x2="1" y1="0" y2="0">${[0, 1, 2, 3, 4].map((i) => `<stop data-stop="${i}" offset="${i / 4}" stop-color="#FF0029"/>`).join("")}</linearGradient>
<linearGradient id="lapGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".06"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
</defs>`;

const svg = k.figureSvg({
  width: WIDTH, height: HEIGHT,
  label: T.description,
  body: [defs, mat(), base(), hinge(), lid(), keyboard(), deck()],
});

const live = `
const fig = document.getElementById("figLap");
const svg = fig.querySelector("svg");
const stage = fig.querySelector(".iso-stage");
const readout = fig.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const $ = (s) => svg.querySelector(s), $$ = (s) => [...svg.querySelectorAll(s)];
const leds = $$("[data-rgb]").map((g) => ({ g, p: +g.dataset.p, hit: 0, k: g.dataset.k, press: g.querySelector("[data-press]") }));
const keyOf = {}; for (const l of leds) if (l.k) keyOf[l.k] = l;
const stops = $$("[data-stop]");
const heat = $("[data-heat]");
const scr = {
  lock: $("[data-lock]"), win: $("[data-win]"), clocks: $$("[data-clock]"), title: $("[data-title]"), tab: $("[data-tab]"),
  files: $$("[data-f]"), rows: $$("[data-row]"), bgs: $$("[data-rowbg]"), gut: $$("[data-gut]"), term: $$("[data-term]"), prog: $("[data-prog]"),
  user: $$("[data-user]"), bubble: $("[data-bubble]"), steps: $$("[data-step]"), subs: $$("[data-sub]"), input: $("[data-input]"), caret: $("[data-caret]"),
};
const nums = { box: document.getElementById("laptop") || document.querySelector("[data-rig]"), tps: document.querySelector("[data-rig-n=tps]"), temp: document.querySelector("[data-rig-n=temp]"), rpm: document.querySelector("[data-rig-n=rpm]") };
const DOWN = "${k.translateAlong(P, [0, 0, -0.9])}";
const PROG_W = 40;

// tareas de ejemplo: lo que de verdad le pido a Claude Code en mis proyectos
const TASKS = ${JSON.stringify(T.tasks)};
const SUBS = (t) => [t.plan, ${JSON.stringify(T.readPrefix)} + t.read.filter((f) => !f.endsWith("/")).join(", "), t.file + "  +" + t.add.filter(Boolean).length + (t.del >= 0 ? " −1" : ""), ${JSON.stringify(T.testStep)}, ${JSON.stringify(T.readyStep)}];
const DUR = [1.6, 1.4, 2.2, 2.8, 2.6];

// el modelo: la CPU se calienta con la carga (primer orden) y la curva de ventilador responde
const AMB = 40, HOT = 52, TAU_T = 3.2, TAU_FAN = 1.1;
const fanCurve = (t) => Math.min(6000, Math.max(1800, 1800 + (t - 50) * 120));
let load = 0, want = 0.06, temp = 42, rpm = 1800, tps = 0, wantTps = 0, wave = 0, last = 0, frame = 0, visible = false;
let mode = "type", phase = -1, pt = 0, task = null, typed = "", queue = "", next = 0, tour = 0, idle = 0, awake = false, autoGap = 2.6;
let colorMode = "rainbow", colorKey = "rainbow", fixed = [350, 100, 50], ext = null;
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

function hexHsl(hex) {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l * 100];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s * 100, l * 100];
}
function colorAt(p, boost = 0) {
  let h, s, l;
  if (colorMode === "rainbow") { h = (wave * 60 - p * 300) % 360; if (h < 0) h += 360; s = 100; l = 56; }
  else [h, s, l] = fixed;
  l = Math.min(96, l + boost * 30);
  return "hsl(" + h.toFixed(0) + " " + s.toFixed(0) + "% " + l.toFixed(0) + "%)";
}
function setColor(m) {
  colorMode = m === "rainbow" ? "rainbow" : "fixed"; colorKey = m;
  if (colorMode === "fixed") fixed = hexHsl(m);
  document.querySelectorAll("button[data-lap-rgb]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lapRgb === m || (b.type === "color" && colorMode === "fixed" && !document.querySelector('[data-lap-rgb="' + m + '"]:not([type=color])')))));
  try { localStorage.setItem("vitae-rgb", m); } catch {}
  if (!frame) draw();
}

function setRows(t, edited) {
  const lines = edited ? [...t.ctx.slice(0, t.at), ...t.add, ...t.ctx.slice(t.at)] : t.ctx;
  scr.rows.forEach((r, i) => {
    r.textContent = clip(lines[i] ?? "", 44);
    const added = edited && i >= t.at && i < t.at + t.add.length;
    scr.bgs[i].toggleAttribute("data-add", added);
    scr.bgs[i].toggleAttribute("data-del", !edited && i === t.del && phase === 2);
    scr.gut[i].textContent = t.line + i;
  });
}
function wrap(text) {
  if (text.length <= 34) return [text, ""];
  const cut = text.lastIndexOf(" ", 34);
  const a = cut > 10 ? text.slice(0, cut) : text.slice(0, 34);
  return [a, clip(text.slice(a.length).trim(), 34)];
}
function pressKey(ch) {
  const c = ch.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "") || ch;
  const key = keyOf[ch === "ñ" || ch === "Ñ" ? "ñ" : c] || keyOf[{ " ": " ", Enter: "↵", Backspace: "⌫", Tab: "⇥", Shift: "⇧", Escape: "esc" }[ch]];
  if (key) key.hit = 1;
  window.SFX?.play("key");
}
function setInput(t) { const v = clip(t, 34); scr.input.textContent = v; scr.caret.setAttribute("x", (${CL.u + 5} + v.length * 1.44 + 0.3).toFixed(2)); }
function wake() { if (awake) return; awake = true; scr.lock.style.opacity = 0; scr.win.style.opacity = 1; }
function start(t) {
  wake();
  task = t; phase = 0; pt = 0; mode = "run";
  window.SFX?.play("prompt");
  const [a, b] = wrap(t.p);
  scr.user[0].textContent = a; scr.user[1].textContent = b; scr.bubble.setAttribute("data-on", "");
  setInput(""); typed = ""; queue = "";
  scr.steps.forEach((s) => { s.removeAttribute("data-on"); s.removeAttribute("data-done"); });
  scr.subs.forEach((s) => (s.textContent = ""));
  scr.term.forEach((r, i) => (r.textContent = i ? "" : ${JSON.stringify(T.prompt)}));
  scr.prog.setAttribute("width", 0);
  scr.files.forEach((f) => f.removeAttribute("data-on"));
  scr.tab.textContent = t.file; scr.title.textContent = t.file + ${JSON.stringify(T.titleSuffix)};
  setRows(t, false);
  enter(0);
}
function enter(i) {
  phase = i; pt = 0;
  scr.steps.forEach((s, j) => { s.toggleAttribute("data-on", j <= i); s.toggleAttribute("data-done", j < i || (i === 4 && j === 4)); });
  if (i < 5) scr.subs[i].textContent = SUBS(task)[i];
  if (i === 2) setRows(task, false);
  if (i === 3) { scr.term[0].textContent = ${JSON.stringify(T.prompt + " ")} + clip(task.cmd, 30); scr.term[1].textContent = ${JSON.stringify(T.runningStart)}; }
  if (i === 4) { scr.subs[3].textContent = task.ok; scr.term[2].textContent = task.ok; window.SFX?.play("stamp"); }
  if (i === 5) { mode = "type"; phase = -1; idle = 0; }
}
function runPhase(dt) {
  pt += dt;
  const d = DUR[phase];
  if (phase === 0) { wantTps = 70 + 15 * Math.sin(pt * 7); want = 0.16; }
  if (phase === 1) {
    wantTps = 24; want = 0.3;
    const reads = task.read, n = Math.min(reads.length - 1, Math.floor((pt / d) * reads.length));
    scr.files.forEach((f) => f.toggleAttribute("data-on", f.dataset.f === reads[n]));
  }
  if (phase === 2) {
    wantTps = 82 + 10 * Math.sin(pt * 9); want = 0.34;
    if (pt > 0.7 && !scr.bgs[task.at].hasAttribute("data-add")) { setRows(task, true); window.SFX?.play("click"); }
  }
  if (phase === 3) {
    wantTps = 0; want = 1;
    scr.prog.setAttribute("width", (PROG_W * Math.min(1, pt / d)).toFixed(2));
    scr.term[1].textContent = ${JSON.stringify(T.running)} + ".".repeat(1 + Math.floor(pt * 3) % 3);
  }
  if (phase === 4) { wantTps = 0; want = 0.08; scr.files.forEach((f) => f.removeAttribute("data-on")); }
  if (pt >= d) enter(phase + 1);
}
// teclear: la tarea entra letra por letra y cada letra baja su tecla
function typeStep(dt) {
  wantTps = 0; want = 0.06;
  if (ext) { want = ext.w; wantTps = ext.t; return; } // la vista de cerca manda la carga
  if (queue && (next -= dt) <= 0) {
    const ch = queue[0]; queue = queue.slice(1); typed += ch; pressKey(ch);
    setInput(typed); next = 0.05 + Math.random() * 0.06;
    if (!queue) next = 0.45;
  } else if (!queue && typed && tour && (next -= dt) <= 0) { tour = 0; pressKey("Enter"); start({ ...TASKS[(start.n = ((start.n ?? -1) + 1) % TASKS.length)], p: typed }); }
  if (!queue && !typed && idle > autoGap) { wake(); const t = TASKS[((start.n ?? -1) + 1) % TASKS.length]; queue = t.p; tour = 1; next = 0.3; autoGap = 4; }
}
function custom(text) {
  // la tarea del visitante: Claude la anota en notas.md y la verifica
  return { p: text, read: ${JSON.stringify(T.noteFiles)}, file: ${JSON.stringify(T.noteFile)}, line: 1,
    ctx: ${JSON.stringify(T.notes)},
    at: 5, add: ["- " + clip(text, 40)], del: -1, plan: ${JSON.stringify(T.notePlan)}, cmd: ${JSON.stringify(T.noteCommand)}, ok: ${JSON.stringify(T.noteOk)} };
}

function step(dt) {
  idle += dt; wave += dt * (0.5 + load * 0.9);
  if (mode === "run") runPhase(dt); else typeStep(dt);
  load += (want - load) * (1 - Math.exp(-dt / 0.35));
  tps += (wantTps - tps) * (1 - Math.exp(-dt / 0.25));
  temp += (AMB + HOT * load - temp) * (1 - Math.exp(-dt / TAU_T));
  rpm += (fanCurve(temp) - rpm) * (1 - Math.exp(-dt / TAU_FAN));
  for (const l of leds) if (l.hit) l.hit = Math.max(0, l.hit - dt * 5);
  scr.caret.style.opacity = mode === "type" && (wave * 3) % 2 < 1.2 ? 1 : 0;
}
let clockText = "";
function draw() {
  for (const l of leds) {
    l.g.style.color = colorAt(l.p, l.hit);
    if (l.press) { const down = l.hit > 0.55; if (l.down !== down) { l.down = down; down ? l.press.setAttribute("transform", DOWN) : l.press.removeAttribute("transform"); } }
  }
  stops.forEach((s, i) => s.setAttribute("stop-color", colorAt(i / 4)));
  const c = colorAt(0.5);
  svg.style.setProperty("--lap-on", (0.55 + 0.45 * Math.min(1, load * 1.4 + 0.2)).toFixed(3));
  svg.style.setProperty("--lap-c", c);
  svg.style.setProperty("--lap-heat", Math.max(0, (rpm - 1800) / 4200).toFixed(3));
  if (heat) heat.style.strokeDashoffset = 0;
  heat?.querySelectorAll("path").forEach((p) => p.style.strokeDashoffset = (-wave * 18 * (0.4 + (rpm - 1800) / 2000)).toFixed(1));
  const now = new Date(), ct = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
  if (ct !== clockText) { clockText = ct; scr.clocks.forEach((e) => (e.textContent = ct)); }
  const text = Math.round(tps) + ${JSON.stringify(T.tokenCpu)} + Math.round(temp) + ${JSON.stringify(T.temperatureFan)} + (Math.round(rpm / 50) * 50) + ${JSON.stringify(T.rpm)};
  if (readout.textContent !== text) readout.textContent = text;
  window.SFX?.hum(0.2 + 0.8 * (rpm - 1800) / 4200, rpm * 0.45);
  if (nums.tps) { nums.tps.textContent = Math.round(tps); nums.temp.textContent = Math.round(temp); nums.rpm.textContent = Math.round(rpm / 50) * 50; nums.box.style.setProperty("--rig-c", c); nums.box.style.setProperty("--rig-load", load.toFixed(3)); }
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  step(dt); draw();
  frame = visible ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };

// el visitante escribe su propia tarea con el foco en la figura
stage.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  idle = 0; wake();
  if (mode === "run" && e.key !== "Tab") { e.preventDefault(); return; }
  if (e.key === "Enter") { e.preventDefault(); pressKey("Enter"); const t = typed.trim(); if (t && !tour) start(custom(t)); else if (!t) { queue = ""; tour = 0; typed = ""; start(TASKS[(start.n = ((start.n ?? -1) + 1) % TASKS.length)]); } else { queue = ""; } return; }
  if (e.key === "Backspace") { e.preventDefault(); pressKey("Backspace"); typed = typed.slice(0, -1); }
  else if (e.key.length === 1) { e.preventDefault(); if (tour) { tour = 0; queue = ""; typed = ""; } if (typed.length < 40) { typed += e.key; pressKey(e.key); } }
  else return;
  setInput(typed);
  if (still.matches) draw();
});
stage.addEventListener("click", (e) => {
  idle = 0; wake();
  if (e.target.closest("[data-scr]")) { document.dispatchEvent(new CustomEvent("lap:zoom")); return; }
  if (mode === "run") return;
  if (typed.trim() && !tour) start(custom(typed.trim()));
  else { queue = ""; tour = 0; typed = ""; start(TASKS[(start.n = ((start.n ?? -1) + 1) % TASKS.length)]); }
  if (still.matches) rest();
});
stage.addEventListener("pointermove", () => { if (mode !== "run") idle = Math.min(idle, autoGap - 1.2); });
// los botones de color viven fuera del fragmento: sus listeners se cortan al limpiar
const off = new AbortController();
document.querySelectorAll("[data-lap-rgb]").forEach((b) => b.addEventListener(b.type === "color" ? "input" : "click", () => { setColor(b.type === "color" ? b.value : b.dataset.lapRgb); window.SFX?.play("click"); }, { signal: off.signal }));
function rest() {
  // movimiento reducido: una tarea terminada y la máquina tibia, sin animar
  wake(); const t = TASKS[0]; start(t); enter(4); setRows(t, true); scr.prog.setAttribute("width", PROG_W);
  scr.steps.forEach((s) => { s.setAttribute("data-on", ""); s.setAttribute("data-done", ""); });
  TASKS[0] && SUBS(t).forEach((x, i) => (scr.subs[i].textContent = x));
  load = 0.45; temp = AMB + HOT * 0.45; rpm = fanCurve(temp); tps = 0; wave = 1; draw();
}
// la vista de cerca (zoom.js) lee el modelo y le pide carga
const lap = window.LAP = {
  drive(w, t) { ext = { w, t }; if (mode === "run") enter(5); wake(); },
  release() { ext = null; idle = 0; },
  state: () => ({ tps, temp, rpm, load }),
  color: () => colorAt(0.5),
  colorKey: () => colorKey,
  setColor,
  screen: () => svg.querySelector("[data-scr]"),
};
let saved = "rainbow";
try { saved = localStorage.getItem("vitae-rgb") || "rainbow"; } catch {}
setRows(TASKS[1], false);
setColor(/^#[0-9a-f]{6}$/i.test(saved) || saved === "rainbow" ? saved : "rainbow");
new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; if (visible) run(); else window.SFX?.hum(0); }, { rootMargin: "120px 0px" }).observe(svg);
if (still.matches) rest(); else draw();
`;

const figure = k.plateHtml({
  fig: T.figure,
  title: T.title,
  hint: T.hint,
  readout: T.readout,
  keys: [{ mark: "lit", label: T.rgb }],
  caption: "",
  body: `<div class="iso-stage" tabindex="0" role="button" aria-label="${T.aria}">${svg}</div>`,
}).replace('<figure class="iso-figure"', '<figure class="iso-figure" id="figLap"');
const fragment = style + figure;

const script = kitScript() + asModule(live, "off.abort(); if (window.LAP === lap) delete window.LAP; window.SFX?.hum(0);");
// Conserva los saltos CRLF del fragmento de referencia.
writeFileSync(join(OUT, `laptop.${lang}.html`), fragment.replaceAll('src="img/', 'src="/img/').replaceAll('\n', '\r\n'));
writeFileSync(join(OUT, `laptop.${lang}.js`), script);
if (lang === "es") writeFileSync(join(OUT, "laptop.js"), script);
writeFileSync(join(OUT, "iso.css"), k.ISO_CSS);
console.log(`Generado: laptop.${lang}.html, laptop.${lang}.js, iso.css`);
}
