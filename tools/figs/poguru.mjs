// Fig. PO Guru, la línea completa (bloque 3, 2026-11-02). El flujo real del hackathon, como una línea de producción:
// 1 la cotización cae de la tolva y arma los 10 campos · 2 el cabezal baja 10 palpadores (los 10 chequeos) y el reloj
// cuenta lo que falta · 3 si falta algo, la línea vuelve y le pregunta al solicitante (decide una persona) · 4 el sello la
// marca lista para revisión · 5 una cápsula sube por el tubo: el brief al buyer en Teams · 6 la compuerta de aprobación
// espera; cada día hábil suena la campana (un recordatorio) hasta que el aprobador dice que sí · 7 la orden sale al proveedor.
// El carro con el foco verde es el agente: hace el recorrido. Las luces del frente son la lista compartida de estados.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { homedir } from "node:os";

const SKILL = join(homedir(), ".claude", "skills", "anatomy");
const k = await import(pathToFileURL(join(SKILL, "kit", "iso-kit.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts", "inline-kit.mjs")).href);
const HERE = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(HERE, "..", "..", "public");
const OUT = join(PUBLIC, "fig");
mkdirSync(OUT, { recursive: true });

// diez campos de ejemplo, genéricos de cualquier compra: nada interno de Philips (Tín, 2026-11-02)
const FIELDS = ["Solicitante", "Descripción", "Proveedor", "Cantidad", "Precio", "Moneda", "Lugar de entrega", "Fecha de entrega", "Cotización", "Motivo"];
const COLS = [-26, -13, 0, 13, 26], ROWS = [-8, 8];
const SLOT = (i) => [COLS[i % 5], ROWS[Math.floor(i / 5)]];

const WIDTH = 760, HEIGHT = 350;
const PLATE = { x: -262, y: -62, w: 500, d: 118, r: 8 };
const PLATE_H = 12, FOOT_H = 5;
const TRAY = { x: -38, y: -20, w: 82, d: 40, r: 3 }; // local al carro
const TRAY_Z = 3, TRAY_TOP = 8, BLOCK_H = 6, BLOCK_TOP = TRAY_TOP + BLOCK_H;
const PAD = { x: 33.5, y: -8, w: 8, d: 16, r: 1.4 };
const BEACON = [-33, -15];
const COL_Y = -46;
// estaciones en el mundo
const HOP_X = -212, CHK_X = -124, STAMP_X = -34, TUBE = [58, -44], GATE_X = 132, END_X = 234;
// paradas del carro (centro del carro)
const X_IN = HOP_X, X_CHK = CHK_X, X_STAMP = STAMP_X - (PAD.x + PAD.w / 2), X_BRIEF = 40, X_WAIT = GATE_X - 50, X_OUT = 192;
const HEAD = { x: -34, y: -17, w: 68, d: 34, r: 3 };
const HEAD_H = 8, HEAD_UP = 40, HEAD_DOWN = 22, REACH = 14;
const ARM_Z = 70, ARM_H = 8, DIAL_R = 12, DIAL_H = 7;
const RAM_UP = 34, RAM_DOWN = TRAY_TOP + 1;
const HOP_Z = 38; // boca de la tolva
const GATE_H = 22, GATE_LIFT = 17, BAR_Z = 42;
const CAP_Z0 = 7, CAP_Z1 = 80;
const LAMP_Y = 45;
const STAGES = [HOP_X, CHK_X, STAMP_X, TUBE[0], GATE_X, X_OUT + 12]; // una luz por estación

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [CHK_X, -6, ARM_Z + ARM_H + DIAL_H + 2], [CHK_X, COL_Y, ARM_Z + ARM_H + 4], [HOP_X, COL_Y, 66], [TUBE[0], TUBE[1], 100], [GATE_X, 0, BAR_Z + 12]],
  WIDTH, HEIGHT, { pad: 22, azimuth: 65, elevation: 26 },
);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const depth = (x, y, z = 0) => k.depthOf([x, y, z], P);
const byDepth = (pts) => [...pts].sort((a, b) => depth(a[0], a[1]) - depth(b[0], b[1]));
const shift = (plan, dx, dy = 0) => ({ ...plan, x: plan.x + dx, y: plan.y + dy });
const NEAR_Y = depth(0, 1) > depth(0, 0) ? 1 : -1; // hacia dónde queda el espectador en y

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // tira de estados al frente: regla con una luz por estación (la lista compartida)
  const strip = { x: PLATE.x + 14, y: LAMP_Y - 6, w: PLATE.w - 28, d: 12, r: 1.5 };
  out.push(S(k.slabOf(strip, 0, 1.2, P, 3, 0.3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 6, 5, strip.y + strip.d - 0.6, 1.2, [-1.8, -3.2], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2.2, strip.y + 3, 1.2]), at([strip.x + strip.w - 2.2, strip.y + 3, 1.2])], { size: 0.45 }));
  return out.join("");
}

function lamps() {
  return STAGES.map((x, i) => `<g data-lamp="${i}">${S(k.cylinder(x, LAMP_Y - 1.5, 3.6, 1.2, 1.2, P, 24), { tone: "mid" })}${S(k.cylinder(x, LAMP_Y - 1.5, 2.6, 2.4, 1.6, P, 24, 0.4), { tone: "hi", crease: "lo" })}</g>`).join("");
}

function rails() {
  const out = [];
  for (const y of [-24, 18]) {
    out.push(S(k.slabOf({ x: PLATE.x + 8, y, w: PLATE.w - 16, d: 5, r: 1 }, 0, 3, P, 3, 0.4), { tone: "mid" }));
    out.push(D([-240, -170, -100, -30, 40, 110, 180, 222].map((x) => at([x, y + 2.5, 3])), { size: 0.4 }));
  }
  // topes de los extremos
  for (const x of [PLATE.x + 4, PLATE.x + PLATE.w - 9]) {
    out.push(S(k.slabOf({ x, y: -28, w: 5, d: 52, r: 1.2 }, 0, 8, P, 3, 0.5), { tone: "mid" }));
    out.push(D([at([x + 2.5, -22, 8]), at([x + 2.5, 18, 8])], { size: 0.45 }));
  }
  return out.join("");
}

// columna en C atrás: pie, columna; el brazo sale sobre la vía
function column(x, top) {
  const out = [];
  const foot = { x: x - 12, y: COL_Y - 10, w: 24, d: 18, r: 2 };
  out.push(S(k.slabOf(foot, 0, 6, P, 4, 0.6), { tone: "mid" }));
  out.push(D(k.corners(foot, 3).map(([a, b]) => at([a, b, 6])), { size: 0.45 }));
  const col = { x: x - 6, y: COL_Y - 5, w: 12, d: 10, r: 2 };
  out.push(S(k.slabOf(col, 6, top - 6, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(col, 24, P, 4), { tone: "faint" }) }));
  return out.join("");
}
function arm(x, z, h, reach, width) {
  const plan = { x: x - width / 2, y: COL_Y - 5, w: width, d: reach - COL_Y + 5, r: 2.5 };
  const out = [S(k.slabOf(plan, z, h, P, 4, 0.6), { tone: "mid" })];
  out.push(L(k.planOutline(k.insetPlan(plan, 2.2), z + h, P, 3), { tone: "faint" }));
  out.push(D([at([x - width / 2 + 3, COL_Y - 1, z + h]), at([x + width / 2 - 3, COL_Y - 1, z + h])], { size: 0.45 }));
  return out.join("");
}

// el carro del agente: bandeja, bolsillos, cojín del sello y el foco verde
function tray() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(TRAY, 3), TRAY_Z, 0.1, P)}" style="filter:blur(4px)"/>`];
  // bujes sobre los rieles
  for (const [x, y] of [[-32, -23], [36, -23], [-32, 18], [36, 18]]) out.push(S(k.slabOf({ x: x - 3.5, y: y - 1, w: 7, d: 7, r: 1 }, 1.5, TRAY_Z - 1.5 + 0.5, P, 3, 0.3), { tone: "lo" }));
  out.push(S(k.slabOf(TRAY, TRAY_Z, TRAY_TOP - TRAY_Z, P, 5, 0.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(TRAY, 2.4), TRAY_TOP, P, 3), { tone: "faint" }));
  out.push(L(FIELDS.map((_, i) => { const [x, y] = SLOT(i); return k.planOutline({ x: x - 5.5, y: y - 5.5, w: 11, d: 11, r: 1 }, TRAY_TOP, P, 3); }).join(""), { tone: "lo" }));
  out.push(S(k.slabOf(PAD, TRAY_TOP, 0.8, P, 3), { tone: "lo", crease: "none" }));
  out.push(`<g data-part="mark" opacity="0">${S(k.slabOf(k.insetPlan(PAD, 1.6), TRAY_TOP + 0.8, 0.4, P, 3), { tone: "lit", lit: true, crease: "none" })}</g>`);
  out.push(D([at([PAD.x + PAD.w / 2, PAD.y - 2.4, TRAY_TOP]), at([PAD.x + PAD.w / 2, PAD.y + PAD.d + 2.4, TRAY_TOP])], { size: 0.4 }));
  // foco del agente
  const [bx, by] = BEACON;
  out.push(S(k.cylinder(bx, by, 2.6, TRAY_TOP, 1.4, P, 20), { tone: "mid" }));
  out.push(`<g data-part="beacon">${S(k.cylinder(bx, by, 1.9, TRAY_TOP + 1.4, 3.2, P, 20, 0.5), { tone: "lit", lit: true })}</g>`);
  // agarradera
  out.push(S(k.slabOf({ x: TRAY.x - 4, y: -6, w: 4, d: 12, r: 1 }, TRAY_Z + 1, 4, P, 2), { tone: "mid" }));
  out.push(D([at([TRAY.x - 2, -3, TRAY_Z + 5]), at([TRAY.x - 2, 3, TRAY_Z + 5])], { size: 0.4 }));
  return out.join("");
}
// cada campo se dibuja apoyado en la bandeja; la caída desde la tolva es un transform
const block = (i) => {
  const [x, y] = SLOT(i);
  const plan = { x: x - 4.8, y: y - 4.8, w: 9.6, d: 9.6, r: 1 };
  return `<g data-field="${i}">${S(k.slabOf(plan, TRAY_TOP, BLOCK_H, P, 3, 0.5), { tone: "hi", crease: "lo" })}${L(k.planOutline(k.insetPlan(plan, 2), BLOCK_TOP, P, 3), { tone: "faint" })}</g>`;
};

const probe = (i) => {
  const [x, y] = SLOT(i);
  const X = CHK_X + x;
  return `<g data-probe="${i}">${S(k.cylinder(X, y, 1.7, 0, 2, P, 18), { tone: "hi" })}${S(k.cylinder(X, y, 0.9, 2, REACH + 4, P, 14), { tone: "hi", crease: "none" })}${S(k.cylinder(X, y, 2, REACH - 2, 1.6, P, 18), { tone: "mid" })}</g>`;
};
function head() {
  const plan = shift(HEAD, CHK_X);
  const out = [S(k.slabOf(plan, 0, HEAD_H, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(plan, 4, P, 4), { tone: "faint" }) })];
  out.push(D(k.corners(plan, 3.5).map(([x, y]) => at([x, y, HEAD_H])), { size: 0.45 }));
  for (const y of [-10, 10]) out.push(S(k.cylinder(CHK_X, y, 2.2, HEAD_H, ARM_Z - HEAD_DOWN - HEAD_H, P, 18), { tone: "mid", crease: "none" }));
  return out.join("");
}
function dial() {
  const [x, y] = [CHK_X, -6];
  const z = ARM_Z + ARM_H, top = z + DIAL_H;
  const out = [];
  out.push(S(k.cylinder(x, y, DIAL_R, z, DIAL_H, P, 64, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(x, y, DIAL_R, top - 2.6, top, 64, P, 0.3), { tone: "lo" }));
  out.push(L(k.ring(x, y, DIAL_R - 2, top, P, 64), { tone: "lo" }));
  const t = k.radialTicks(x, y, DIAL_R - 2.4, 10, 5, top, [1, 2.4], P);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  out.push(L(k.ring(x, y, 1.3, top, P, 16), { tone: "mid" }));
  return { svg: out.join(""), x, y, top };
}
const DIAL = dial();
const needleAt = (dx, dy, top, r, turn) => {
  const a = turn * Math.PI * 2;
  return k.lineOnTop([dx - Math.sin(a) * 2.6, dy + Math.cos(a) * 2.6], [dx + Math.sin(a) * (r - 3.2), dy - Math.cos(a) * (r - 3.2)], top + 0.2, P);
};

// tolva: la cotización entra por arriba y suelta los campos en la bandeja
function hopper() {
  const out = [];
  out.push(S(k.slabOf({ x: HOP_X - 9, y: -8, w: 18, d: 16, r: 1.5 }, HOP_Z, 8, P, 3, 0.4), { tone: "mid" }));
  const body = { x: HOP_X - 17, y: -15, w: 34, d: 30, r: 2.5 };
  out.push(S(k.slabOf(body, HOP_Z + 8, 14, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(body, HOP_Z + 15, P, 4), { tone: "faint" }) }));
  out.push(S(k.slabOf(k.insetPlan(body, 3), HOP_Z + 22, 0.6, P, 3), { tone: "lo", crease: "none" }));
  out.push(D(k.corners(body, 2).map(([x, y]) => at([x, y, HOP_Z + 22])), { size: 0.45 }));
  return out.join("");
}

function ram() {
  const X = STAMP_X;
  return [
    S(k.slabOf({ x: X - 7, y: -9, w: 14, d: 18, r: 1.6 }, 0, 3, P, 3, 0.4), { tone: "mid" }),
    S(k.slabOf({ x: X - 5.5, y: -7.5, w: 11, d: 15, r: 1.2 }, -0.6, 0.6, P, 3), { tone: "lit", lit: true, crease: "none" }),
    S(k.cylinder(X, 0, 2.6, 3, 40, P, 18), { tone: "mid", crease: "none" }),
  ].join("");
}

// tubo del brief: dos guías y una cápsula que sube al receptor
const [TX, TY] = TUBE;
const rod = (y) => S(k.cylinder(TX, y, 1.1, 6, CAP_Z1 + 10 - 6, P, 14), { tone: "mid", crease: "none" });
function tubeBase() {
  return [
    S(k.slabOf({ x: TX - 11, y: TY - 11, w: 22, d: 22, r: 2 }, 0, 6, P, 4, 0.6), { tone: "mid" }),
    D(k.corners({ x: TX - 11, y: TY - 11, w: 22, d: 22 }, 2.6).map(([x, y]) => at([x, y, 6])), { size: 0.45 }),
    L(k.ring(TX, TY, 5, 6, P, 24), { tone: "lo" }),
  ].join("");
}
const capsule = () => `<g data-part="capsule" transform="${k.translateAlong(P, [0, 0, 0])}">${S(k.cylinder(TX, TY, 3.4, CAP_Z0, 1.4, P, 24), { tone: "mid" })}${S(k.cylinder(TX, TY, 3.1, CAP_Z0 + 1.4, 6, P, 24, 0.6), { tone: "lit", lit: true })}${S(k.cylinder(TX, TY, 3.4, CAP_Z0 + 7.4, 1.4, P, 24), { tone: "mid" })}</g>`;
function receiver() {
  const box = { x: TX - 12, y: TY - 12, w: 24, d: 24, r: 3 };
  return [
    S(k.slabOf(box, CAP_Z1 + 10, 12, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(box, CAP_Z1 + 16, P, 4), { tone: "faint" }) }),
    L(k.ring(TX, TY, 5, CAP_Z1 + 22, P, 24), { tone: "lo" }),
    `<g data-part="rx">${S(k.cylinder(TX, TY, 3, CAP_Z1 + 22, 1.4, P, 20, 0.4), { tone: "hi", crease: "lo" })}</g>`,
  ].join("");
}

// compuerta de aprobación: dos postes, travesaño, campana y la hoja que sube
const post = (y) => S(k.cylinder(GATE_X, y, 3, 0, BAR_Z, P, 20), { tone: "mid", crease: "none" }) + S(k.cylinder(GATE_X, y, 4.4, 0, 3, P, 24), { tone: "lo" });
const gateLeaf = () => {
  const plan = { x: GATE_X - 2, y: -29, w: 4, d: 58, r: 1 };
  return `<g data-part="gate">${S(k.slabOf(plan, 2, GATE_H, P, 3, 0.4), { tone: "hi", crease: "lo" })}${D([at([GATE_X, -24, 2 + GATE_H]), at([GATE_X, 24, 2 + GATE_H])], { size: 0.45 })}</g>`;
};
function crossbar() {
  const plan = { x: GATE_X - 4, y: -37, w: 8, d: 74, r: 1.6 };
  return [
    S(k.slabOf(plan, BAR_Z, 5, P, 3, 0.5), { tone: "mid" }),
    D([at([GATE_X, -33, BAR_Z + 5]), at([GATE_X, 33, BAR_Z + 5])], { size: 0.45 }),
    S(k.cylinder(GATE_X, 0, 1.4, BAR_Z + 5, 3, P, 14), { tone: "mid" }),
    `<g data-part="bell">${S(k.cylinder(GATE_X, 0, 5.2, BAR_Z + 8, 4.6, P, 32, 0.8), { tone: "hi", crease: "lo" })}${S(k.cylinder(GATE_X, 0, 1.6, BAR_Z + 12.6, 1.6, P, 16), { tone: "mid" })}</g>`,
  ].join("");
}

// orden de pintado
const nearRow = depth(0, ROWS[1]) > depth(0, ROWS[0]) ? 1 : 0;
const farRow = 1 - nearRow;
const rowFields = (r) => FIELDS.map((_, i) => i).filter((i) => Math.floor(i / 5) === r).sort((a, b) => depth(SLOT(a)[0], SLOT(a)[1]) - depth(SLOT(b)[0], SLOT(b)[1]));
const carGroup = (name, inner) => `<g data-part="${name}" transform="${k.translateAlong(P, [X_IN, 0, 0])}">${inner}</g>`;
const backY = NEAR_Y > 0 ? -37 : 37, frontY = -backY;
const svg = k.figureSvg({
  width: WIDTH, height: HEIGHT,
  label: "Una línea de producción en seis estaciones. Una tolva suelta los diez campos de una solicitud en el carro del agente. Diez palpadores revisan cada campo y un reloj cuenta los que faltan; si falta alguno, el carro vuelve y el solicitante lo agrega. Un sello la marca lista para revisión, una cápsula sube por un tubo con el aviso al comprador, y una compuerta espera la aprobación mientras una campana suena cada día hábil. Al final la orden sale al proveedor. Seis luces al frente muestran el estado.",
  body: [
    plate(), lamps(), rails(),
    column(HOP_X, 60), column(CHK_X, ARM_Z), column(STAMP_X, 56),
    tubeBase(), rod(TY + (NEAR_Y > 0 ? -4 : 4)),
    post(backY),
    carGroup("car", tray() + rowFields(farRow).map(block).join("")),
    `<g data-part="probes-far">${rowFields(farRow).map(probe).join("")}</g>`,
    carGroup("car-near", rowFields(nearRow).map(block).join("")),
    `<g data-part="probes-near">${rowFields(nearRow).map(probe).join("")}</g>`,
    gateLeaf(),
    `<g data-part="head" transform="${k.translateAlong(P, [0, 0, HEAD_UP])}">${head()}</g>`,
    arm(CHK_X, ARM_Z, ARM_H, 22, 16),
    DIAL.svg,
    `<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" d="${needleAt(DIAL.x, DIAL.y, DIAL.top, DIAL_R, 0)}" style="stroke-width:1.1"/>`,
    `<g data-part="ram" transform="${k.translateAlong(P, [0, 0, RAM_UP])}">${ram()}</g>`,
    arm(STAMP_X, 56, 8, 10, 14),
    S(k.cylinder(STAMP_X, 0, 4.4, 52, 12, P, 24), { tone: "mid" }),
    arm(HOP_X, 60, 8, 0, 16),
    hopper(),
    capsule(), rod(TY + (NEAR_Y > 0 ? 4 : -4)), receiver(),
    post(frontY), crossbar(),
  ],
});

const live = `
const P = ${JSON.stringify(P)};
const FIELDS = ${JSON.stringify(FIELDS)};
const X = { in: ${X_IN}, chk: ${X_CHK}, stamp: ${X_STAMP}, brief: ${X_BRIEF}, wait: ${X_WAIT}, out: ${X_OUT} };
const HEAD_UP = ${HEAD_UP}, HEAD_DOWN = ${HEAD_DOWN}, REACH = ${REACH}, TRAY_TOP = ${TRAY_TOP}, BLOCK_TOP = ${BLOCK_TOP}, RAM_UP = ${RAM_UP}, RAM_DOWN = ${RAM_DOWN};
const DROP = ${HOP_Z - TRAY_TOP}, CAP = ${CAP_Z1 - CAP_Z0}, LIFT = ${GATE_LIFT};
const DX = ${DIAL.x}, DY = ${DIAL.y}, DTOP = ${DIAL.top}, DR = ${DIAL_R};
const fig = document.getElementById("figPo");
const svg = fig.querySelector("svg");
const q = (s) => svg.querySelector(s);
const cars = [q('[data-part="car"]'), q('[data-part="car-near"]')];
const head = q('[data-part="head"]'), ram = q('[data-part="ram"]'), needle = q('[data-part="needle"]'), mark = q('[data-part="mark"]');
const cap = q('[data-part="capsule"]'), gate = q('[data-part="gate"]'), bell = q('[data-part="bell"]'), beacon = q('[data-part="beacon"]'), rx = q('[data-part="rx"]');
const blocks = FIELDS.map((_, i) => q('[data-field="' + i + '"]'));
const probes = FIELDS.map((_, i) => q('[data-probe="' + i + '"]'));
const lamps = [...svg.querySelectorAll("[data-lamp]")];
const readout = fig.querySelector("[data-readout]");
const steps = [...document.querySelectorAll("#poSteps li")];
const live = document.getElementById("poLive");
const btnAdd = document.getElementById("poAdd"), btnOk = document.getElementById("poOk"), btnMiss = document.getElementById("poMiss");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const needleAt = ${needleAt.toString().replace("k.lineOnTop", "lineOnTop")};
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const lerp = (a, b, t) => a + (b - a) * ease(t);
const DAY = 1.5; // segundos por día hábil en la demo
// fases: d = duración; wait = espera a una persona (o al recorrido solo, a los 'auto' segundos)
const PH = [
  { id: "llena", d: 1.6, step: 0 }, { id: "a-rev", d: 1.1, step: 1 }, { id: "baja", d: 0.6, step: 1 }, { id: "lee", d: 1.2, step: 1 }, { id: "sube", d: 0.5, step: 1 },
  { id: "pregunta", wait: "add", auto: 2.6, step: 2 }, { id: "vuelve", d: 1.2, step: 2 }, { id: "agrega", d: 0.9, step: 2 },
  { id: "a-sello", d: 1.0, step: 3 }, { id: "sella", d: 1.3, step: 3 },
  { id: "a-brief", d: 1.0, step: 4 }, { id: "brief", d: 1.4, step: 4 },
  { id: "a-puerta", d: 0.9, step: 5 }, { id: "espera", wait: "ok", auto: DAY * 2.2, step: 5 }, { id: "abre", d: 0.7, step: 5 },
  { id: "sale", d: 1.2, step: 6 }, { id: "entrega", d: 1.0, step: 6 }, { id: "regresa", d: 1.6, step: 6 },
];
const idx = (id) => PH.findIndex((p) => p.id === id);
let have = FIELDS.map(() => 1), missOn = true, round = 0, user = false;
let ph = 0, t = 0, checked = 0;
function newRequest() {
  have = FIELDS.map(() => 1);
  if (missOn) { const a = [7, 1, 8][round % 3]; have[a] = 0; if (round % 2) have[(a + 4) % 10] = 0; }
  round++; checked = 0;
}
const missing = () => have.filter((v) => !v).length;
function pose() {
  const p = PH[ph], v = p.d ? t / p.d : 0;
  const o = { x: X.in, hz: HEAD_UP, rz: RAM_UP, cap: 0, rx: 0, gate: 0, bell: 0, marked: 0, drop: 1, fade: 1, lamps: 0, counted: 0, under: false };
  const base = { "llena": 0, "a-rev": 0, "baja": 1, "lee": 1, "sube": 1, "pregunta": 1, "vuelve": 1, "agrega": 1, "a-sello": 2, "sella": 2, "a-brief": 3, "brief": 3, "a-puerta": 4, "espera": 4, "abre": 4, "sale": 5, "entrega": 5, "regresa": 6 }[p.id];
  o.lamps = base;
  switch (p.id) {
    case "llena": o.drop = v; break;
    case "a-rev": o.x = lerp(X.in, X.chk, v); break;
    case "baja": o.x = X.chk; o.hz = lerp(HEAD_UP, HEAD_DOWN, v); o.under = true; o.counted = v > .8 ? missing() : 0; break;
    case "lee": o.x = X.chk; o.hz = HEAD_DOWN; o.under = true; o.counted = missing(); break;
    case "sube": o.x = X.chk; o.hz = lerp(HEAD_DOWN, HEAD_UP, v); o.under = true; o.counted = missing(); break;
    case "pregunta": o.x = X.chk; o.counted = missing(); break;
    case "vuelve": o.x = lerp(X.chk, X.in, v); o.counted = missing() * (1 - v); break;
    case "agrega": o.x = X.in; o.drop = v; break;
    case "a-sello": o.x = lerp(X.chk, X.stamp, v); o.lamps = 2; break;
    case "sella": { o.x = X.stamp; const a = v / .3, b = (v - .55) / .3; o.rz = v < .55 ? lerp(RAM_UP, RAM_DOWN, a) : lerp(RAM_DOWN, RAM_UP, b); o.marked = v > .25 ? 1 : 0; break; }
    case "a-brief": o.x = lerp(X.stamp, X.brief, v); o.marked = 1; break;
    case "brief": o.x = X.brief; o.marked = 1; o.cap = v; o.rx = v > .85 ? 1 : 0; break;
    case "a-puerta": o.x = lerp(X.brief, X.wait, v); o.marked = 1; o.rx = 1; o.cap = 1; break;
    case "espera": o.x = X.wait; o.marked = 1; o.rx = 1; o.cap = 1; o.bell = 1; break;
    case "abre": o.x = X.wait; o.marked = 1; o.rx = 1; o.cap = 1; o.gate = v; break;
    case "sale": o.x = lerp(X.wait, X.out, v); o.marked = 1; o.rx = 1; o.cap = 1; o.gate = 1; break;
    case "entrega": o.x = X.out; o.marked = 1; o.rx = 1; o.cap = 1; o.gate = 1 - v; o.fade = 1 - v; o.lamps = 6; break;
    case "regresa": o.x = lerp(X.out, X.in, v); o.fade = 0; o.lamps = 6; break;
  }
  return o;
}
const days = () => Math.floor(t / DAY) + 1;
function textOf() {
  const id = PH[ph].id, m = missing();
  const gone = FIELDS.filter((_, i) => !have[i]).map((f) => f.toLowerCase());
  if (id === "llena") return "entra la cotización";
  if (["a-rev", "baja"].includes(id)) return "revisa 10 puntos";
  if (id === "lee" || id === "sube") return m ? "falta " + gone.join(" y ") : "10 de 10 · completa";
  if (id === "pregunta") return "te pregunta: falta " + gone.join(" y ");
  if (id === "vuelve" || id === "agrega") return "el solicitante agrega " + gone.join(" y ");
  if (id === "a-sello" || id === "sella") return "lista para revisión";
  if (id === "a-brief" || id === "brief") return "brief al buyer en Teams";
  if (id === "a-puerta") return "espera la aprobación";
  if (id === "espera") return days() === 1 ? "día hábil 1 · espera al aprobador" : "día hábil " + days() + " · " + (days() - 1) + " recordatorio" + (days() - 1 === 1 ? "" : "s");
  if (id === "abre") return "aprobada por una persona";
  return "la orden sale al proveedor";
}
let last = 0, frame = 0, visible = false, lastDay = 0, said = "";
function draw(o) {
  const tr = translateAlong(P, [o.x, 0, 0]);
  for (const c of cars) c.setAttribute("transform", tr);
  head.setAttribute("transform", translateAlong(P, [0, 0, o.hz]));
  ram.setAttribute("transform", translateAlong(P, [0, 0, o.rz]));
  cap.setAttribute("transform", translateAlong(P, [0, 0, ease(o.cap) * CAP]));
  cap.style.opacity = o.cap > .92 ? String(1 - (o.cap - .92) / .08) : "1";
  gate.setAttribute("transform", translateAlong(P, [0, 0, ease(o.gate) * LIFT]));
  gate.toggleAttribute("data-open", o.gate > .5);
  rx.toggleAttribute("data-lit", !!o.rx); rx.querySelectorAll(".iso-solid").forEach((n) => n.toggleAttribute("data-lit", !!o.rx));
  if (o.marked && mark.getAttribute("opacity") === "0") window.SFX?.play("stamp");
  mark.setAttribute("opacity", String(o.marked));
  // campana: un golpe por día hábil
  const ring = o.bell ? Math.max(0, 1 - (t % DAY) / .5) : 0;
  bell.setAttribute("transform", translateAlong(P, [Math.sin(t * 40) * 0.9 * ring, 0, 0]));
  bell.querySelectorAll(".iso-solid").forEach((n) => n.toggleAttribute("data-lit", ring > .05));
  if (o.bell && days() !== lastDay) { lastDay = days(); if (lastDay > 1 || t > 0) window.SFX?.play("probe"); }
  if (!o.bell) lastDay = 0;
  // campos: caen de la tolva en fila; los que faltan no caen
  const id = PH[ph].id;
  blocks.forEach((b, i) => {
    const present = id === "llena" || id === "a-rev" || id === "baja" || id === "lee" || id === "sube" || id === "pregunta" || id === "vuelve" ? have[i] : 1;
    const late = id === "agrega" ? !have[i] : id === "llena";
    let z = 0;
    if (late) { const k0 = id === "agrega" ? 0 : i / FIELDS.length * .6; z = (1 - ease((o.drop - k0) / .4)) * DROP; }
    const show = present && (!late || o.drop > (id === "agrega" ? 0 : i / FIELDS.length * .6));
    b.style.display = show ? "" : "none";
    b.setAttribute("transform", translateAlong(P, [0, 0, z]));
    b.style.opacity = String(o.fade);
  });
  probes.forEach((g, i) => {
    const floor = o.under ? (have[i] ? BLOCK_TOP : TRAY_TOP) : -99;
    const tip = Math.max(floor, o.hz - REACH);
    g.setAttribute("transform", translateAlong(P, [0, 0, tip]));
    const deep = o.under && !have[i] && tip <= TRAY_TOP + 0.01;
    if (deep !== g.hasAttribute("data-on")) { if (deep) window.SFX?.play("probe"); g.toggleAttribute("data-on", deep); g.querySelectorAll(".iso-edge").forEach((n) => n.setAttribute("data-tone", deep ? "lit" : "hi")); g.querySelectorAll(".iso-solid").forEach((n) => n.toggleAttribute("data-lit", deep)); }
  });
  needle.setAttribute("d", needleAt(DX, DY, DTOP, DR, o.counted / 10));
  lamps.forEach((l, i) => { const on = i < o.lamps; if (on !== l.hasAttribute("data-on")) { l.toggleAttribute("data-on", on); l.querySelectorAll(".iso-solid").forEach((n) => n.toggleAttribute("data-lit", on)); } });
  beacon.style.opacity = String(.55 + .45 * Math.abs(Math.sin(performance.now() / 420)));
  const text = textOf();
  if (readout.textContent !== text) readout.textContent = text;
  const st = PH[ph].step;
  steps.forEach((s, i) => s.toggleAttribute("data-on", i === st));
  steps.forEach((s, i) => s.toggleAttribute("data-done", i < st && (i !== 2 || asked)));
  btnAdd.disabled = id !== "pregunta"; btnOk.disabled = id !== "espera";
  const say = id === "pregunta" ? "Falta un dato. Te toca: agrégalo." : id === "espera" ? "Espera tu aprobación." : "";
  if (say !== said) { said = say; live.textContent = say; }
}
let asked = false;
function advance(to) {
  let n = to ?? ph + 1;
  if (PH[ph].id === "sube" && to === undefined) n = missing() ? idx("pregunta") : idx("a-sello");
  if (PH[ph].id === "agrega") { have = have.map(() => 1); n = idx("a-rev"); }
  if (n >= PH.length) { n = 0; newRequest(); asked = false; }
  if (PH[n].id === "pregunta") asked = true;
  if (PH[n].id === "pregunta" || PH[n].id === "espera") window.SFX?.play("reject");
  ph = n; t = 0;
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now; t += dt;
  const p = PH[ph];
  if (p.d && t >= p.d) advance();
  else if (p.wait && t >= p.auto * (user ? 3 : 1)) advance();
  draw(pose());
  frame = visible ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
function rest() { ph = idx("espera"); t = 0; draw(pose()); }
btnAdd.addEventListener("click", () => { if (PH[ph].id !== "pregunta") return; user = true; window.SFX?.play("click"); advance(); if (still.matches) { have = have.map(() => 1); rest(); } });
btnOk.addEventListener("click", () => { if (PH[ph].id !== "espera") return; user = true; window.SFX?.play("click"); advance(); if (still.matches) { ph = idx("entrega"); t = 0; draw(pose()); } });
btnMiss.addEventListener("change", () => { missOn = btnMiss.checked; user = true; window.SFX?.play("click"); });
new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(svg);
newRequest();
if (still.matches) rest(); else draw(pose());
`;

const figure = k.plateHtml({
  fig: "Fig 2",
  title: "PO Guru, de punta a punta",
  hint: "Tú decides en 3 y en 6",
  readout: "entra la cotización",
  keys: [
    { mark: "lit", label: "Verde: el agente trabajando o un paso cumplido" },
  ],
  caption: "Demo con datos de ejemplo.",
  body: `<div class="iso-stage">${svg}</div>`,
}).replace('<figure class="iso-figure"', '<figure class="iso-figure" id="figPo"');
const ctl = `<div class="po-ctl" role="group" aria-label="Tus decisiones en la demo">
<button type="button" id="poAdd" disabled><small>3 · Solicitante</small>Agregar el dato</button>
<button type="button" id="poOk" disabled><small>6 · Aprobador</small>Aprobar</button>
<label class="po-miss"><input type="checkbox" id="poMiss" checked><span>Que le falte un dato</span></label>
<p class="po-live" id="poLive" aria-live="polite"></p>
</div>`;
const fragment = figure + ctl;

const script = kitScript() + live;
// Conserva los saltos CRLF del fragmento de referencia.
writeFileSync(join(OUT, "poguru.es.html"), fragment.replaceAll('src="img/', 'src="/img/').replaceAll('\n', '\r\n'));
writeFileSync(join(OUT, "poguru.js"), script);
writeFileSync(join(OUT, "iso.css"), k.ISO_CSS);
console.log("Generado: poguru.es.html, poguru.js, iso.css");
