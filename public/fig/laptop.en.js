const AZIMUTH = 45;
const ELEVATION = 30;
const SHADES = 4;
const RADIANS = Math.PI / 180;
const UNIT = Math.sqrt(1.6);
function cameraOf({ scale, azimuth = AZIMUTH, elevation = ELEVATION }) {
    const a = azimuth * RADIANS;
    const e = elevation * RADIANS;
    return { sinA: Math.sin(a), cosA: Math.cos(a), sinE: Math.sin(e), cosE: Math.cos(e), k: scale * UNIT };
}
function iso([x, y, z], projection) {
    const { origin } = projection;
    const { sinA, cosA, sinE, cosE, k } = cameraOf(projection);
    return [origin[0] + (x * sinA - y * cosA) * k, origin[1] + ((x * cosA + y * sinA) * sinE - z * cosE) * k];
}
function towardViewer(projection) {
    const { sinA, cosA } = cameraOf(projection);
    return [cosA, sinA];
}
function depthOf([x, y, z], projection) {
    const { sinA, cosA, sinE, cosE } = cameraOf(projection);
    return (x * cosA + y * sinA) * cosE + z * sinE;
}
const tenth = (value) => {
    const text = (Math.round(value * 10) / 10).toFixed(1).replace(/\.0$/, "");
    return text === "-0" ? "0" : text;
};
function pathOf(points, closed = false) {
    if (!points.length)
        return "";
    return points.map(([x, y], at) => `${at ? "L" : "M"}${tenth(x)} ${tenth(y)}`).join("") + (closed ? "Z" : "");
}
const joinPaths = (paths) => paths.filter(Boolean).join("");
function roundedPlan({ x, y, w, d, r }, steps = 8) {
    const radius = Math.max(0, Math.min(r, w / 2, d / 2));
    const corners = [
        [x + w - radius, y + radius, -90],
        [x + w - radius, y + d - radius, 0],
        [x + radius, y + d - radius, 90],
        [x + radius, y + radius, 180],
    ];
    const out = [];
    for (const [cx, cy, start] of corners) {
        const count = radius > 0 ? steps : 0;
        for (let step = 0; step <= count; step++) {
            const angle = (start + (count ? (90 * step) / count : 45)) * RADIANS;
            out.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
        }
    }
    return out;
}
function signedArea(points) {
    let area = 0;
    for (let index = 0; index < points.length; index++) {
        const [ax, ay] = points[index];
        const [bx, by] = points[(index + 1) % points.length];
        area += ax * by - bx * ay;
    }
    return area / 2;
}
const oriented = (points) => (signedArea(points) < 0 ? [...points].reverse() : points);
function convexHull(points) {
    const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (sorted.length < 3)
        return sorted;
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower = [];
    for (const point of sorted) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0)
            lower.pop();
        lower.push(point);
    }
    const upper = [];
    for (let index = sorted.length - 1; index >= 0; index--) {
        const point = sorted[index];
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0)
            upper.pop();
        upper.push(point);
    }
    return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
function runsOf(flags, want) {
    const count = flags.length;
    const runs = [];
    const start = flags.findIndex((flag, index) => flag !== flags[(index + count - 1) % count]);
    if (start < 0)
        return flags[0] === want ? [Array.from({ length: count + 1 }, (_, index) => index % count)] : [];
    let run = null;
    for (let step = 0; step < count; step++) {
        const index = (start + step) % count;
        if (flags[index] === want) {
            if (!run)
                run = [index];
            run.push((index + 1) % count);
        }
        else if (run) {
            runs.push(run);
            run = null;
        }
    }
    if (run)
        runs.push(run);
    return runs;
}
function extrude(ring, z, height, projection, options = {}) {
    const convex = options.convex ?? true;
    const count = ring.length;
    const counter = signedArea(ring) > 0;
    const [vx, vy] = towardViewer(projection);
    const { sinA, cosA } = cameraOf(projection);
    const normals = ring.map(([ax, ay], index) => {
        const [bx, by] = ring[(index + 1) % count];
        const dx = bx - ax;
        const dy = by - ay;
        const length = Math.hypot(dx, dy) || 1;
        return (counter ? [dy / length, -dx / length] : [-dy / length, dx / length]);
    });
    const facing = normals.map(([nx, ny]) => nx * vx + ny * vy > 1e-9);
    const top = ring.map(([x, y]) => iso([x, y, z + height], projection));
    const bottom = ring.map(([x, y]) => iso([x, y, z], projection));
    const outline = [];
    const crease = [];
    for (const run of runsOf(facing, false))
        outline.push(pathOf(run.map((index) => top[index])));
    for (const run of runsOf(facing, true)) {
        crease.push(pathOf(run.map((index) => top[index])));
        if (height > 0)
            outline.push(pathOf(run.map((index) => bottom[index])));
    }
    if (height > 0) {
        for (let index = 0; index < count; index++) {
            if (facing[(index + count - 1) % count] !== facing[index])
                outline.push(pathOf([top[index], bottom[index]]));
        }
    }
    let fill;
    if (convex) {
        fill = pathOf(convexHull([...top, ...bottom]), true);
    }
    else {
        const parts = [pathOf(oriented(top), true), pathOf(oriented(bottom), true)];
        for (let index = 0; index < count; index++) {
            if (!facing[index])
                continue;
            const next = (index + 1) % count;
            parts.push(pathOf(oriented([top[index], top[next], bottom[next], bottom[index]]), true));
        }
        fill = parts.join("");
    }
    const buckets = Array.from({ length: SHADES }, () => []);
    if (height > 0) {
        const [lx, ly] = [-sinA, cosA];
        for (let index = 0; index < count; index++) {
            if (!facing[index])
                continue;
            const [nx, ny] = normals[index];
            const lit = (nx * lx + ny * ly + 1) / 2;
            const shade = Math.min(SHADES - 1, Math.max(0, Math.floor(lit * SHADES)));
            const next = (index + 1) % count;
            buckets[shade].push(pathOf(oriented([top[index], top[next], bottom[next], bottom[index]]), true));
        }
    }
    let bevel;
    if (options.bevel && options.bevel > 0) {
        const by = options.bevel;
        const inset = ring.map(([x, y], index) => {
            const [ax, ay] = normals[(index + count - 1) % count];
            const [bx, by2] = normals[index];
            const mx = ax + bx;
            const my = ay + by2;
            const length = Math.hypot(mx, my) || 1;
            return [x - (mx / length) * by, y - (my / length) * by];
        });
        const insetTop = inset.map(([x, y]) => iso([x, y, z + height], projection));
        bevel = runsOf(facing, true)
            .map((run) => pathOf([top[run[0]], ...run.slice(1, -1).map((index) => insetTop[index]), top[run[run.length - 1]]]))
            .join("");
    }
    return {
        fill,
        outline: outline.join(""),
        crease: crease.join(""),
        top: pathOf(oriented(top), true),
        shades: buckets.map((paths) => paths.join("")),
        bevel,
    };
}
const ringOf = (plan, steps = 8) => roundedPlan(plan, steps);
function slabOf(plan, z, height, projection, steps = 8, bevel = 0) {
    return extrude(ringOf(plan, steps), z, height, projection, { convex: true, bevel });
}
function circleRing(cx, cy, radius, steps = 40) {
    return Array.from({ length: steps }, (_, step) => {
        const angle = (step / steps) * Math.PI * 2;
        return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
    });
}
function cylinder(cx, cy, radius, z, height, projection, steps = 32, bevel = 0) {
    return extrude(circleRing(cx, cy, radius, steps), z, height, projection, { convex: true, bevel });
}
const insetPlan = ({ x, y, w, d, r }, by) => ({ x: x + by, y: y + by, w: w - by * 2, d: d - by * 2, r: Math.max(0, r - by) });
function onTop(points, z, projection, closed = false) {
    return pathOf(points.map(([x, y]) => iso([x, y, z], projection)), closed);
}
const planOutline = (plan, z, projection, steps = 8) => onTop(ringOf(plan, steps), z, projection, true);
const lineOnTop = (from, to, z, projection) => onTop([from, to], z, projection);
const segment = (from, to, projection) => pathOf([iso(from, projection), iso(to, projection)]);
const rise = (at, from, to, projection) => segment([at[0], at[1], from], [at[0], at[1], to], projection);
const ring = (cx, cy, radius, z, projection, steps = 40) => onTop(circleRing(cx, cy, radius, steps), z, projection, true);
const pointsAt = (points, projection) => points.map((point) => iso(point, projection));
function dotGrid(x, y, columns, rows, gap, z, projection) {
    const dots = [];
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++)
            dots.push(iso([x + column * gap, y + row * gap, z], projection));
    }
    return dots;
}
function corners({ x, y, w, d }, inset = 0) {
    return [
        [x + inset, y + inset],
        [x + w - inset, y + inset],
        [x + inset, y + d - inset],
        [x + w - inset, y + d - inset],
    ];
}
function boxCorners({ x, y, w, d }, z0, z1) {
    const out = [];
    for (const px of [x, x + w])
        for (const py of [y, y + d])
            for (const z of [z0, z1])
                out.push([px, py, z]);
    return out;
}
function knurl(cx, cy, radius, z0, z1, count, projection, inset = 0.4) {
    const [vx, vy] = towardViewer(projection);
    const lines = [];
    for (let index = 0; index < count; index++) {
        const angle = (index / count) * Math.PI * 2;
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);
        if (nx * vx + ny * vy < 0.15)
            continue;
        lines.push(segment([cx + radius * nx, cy + radius * ny, z0 + inset], [cx + radius * nx, cy + radius * ny, z1 - inset], projection));
    }
    return lines.join("");
}
function sideArc(cx, cy, radius, z, projection, steps = 24) {
    const [vx, vy] = towardViewer(projection);
    const facing = Math.atan2(vy, vx);
    const points = [];
    for (let step = 0; step <= steps; step++) {
        const angle = facing - Math.PI / 2 + (step / steps) * Math.PI;
        points.push(iso([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), z], projection));
    }
    return pathOf(points);
}
function ringSeam(ring, z, projection) {
    const count = ring.length;
    const counter = signedArea(ring) > 0;
    const [vx, vy] = towardViewer(projection);
    const facing = ring.map(([ax, ay], index) => {
        const [bx, by] = ring[(index + 1) % count];
        const dx = bx - ax;
        const dy = by - ay;
        const [nx, ny] = counter ? [dy, -dx] : [-dy, dx];
        return nx * vx + ny * vy > 1e-9;
    });
    return runsOf(facing, true).map((run) => pathOf(run.map((index) => iso([ring[index][0], ring[index][1], z], projection)))).join("");
}
const sideSeam = (plan, z, projection, steps = 8) => ringSeam(ringOf(plan, steps), z, projection);
function sideRing(center, radius, axis, projection, steps = 20) {
    const [px, py, pz] = center;
    const points = [];
    for (let step = 0; step < steps; step++) {
        const angle = (step / steps) * Math.PI * 2;
        const u = radius * Math.cos(angle);
        const v = radius * Math.sin(angle);
        points.push(iso(axis === "x" ? [px, py + u, pz + v] : [px + u, py, pz + v], projection));
    }
    return pathOf(points, true);
}
function coil(from, to, center, radius, turns, axis, projection, perTurn = 16) {
    const count = Math.max(1, Math.round(turns * perTurn));
    const back = [];
    const front = [];
    let run = [];
    let near = null;
    for (let index = 0; index <= count; index++) {
        const share = index / count;
        const angle = share * turns * Math.PI * 2;
        const u = radius * Math.cos(angle);
        const v = radius * Math.sin(angle);
        const along = from + (to - from) * share;
        const point = axis === "x" ? [along, center[0] + u, center[1] + v] : [center[0] + u, along, center[1] + v];
        const normal = axis === "x" ? [0, Math.cos(angle), Math.sin(angle)] : [Math.cos(angle), 0, Math.sin(angle)];
        const facing = depthOf(normal, projection) > 0;
        const flat = iso(point, projection);
        if (near === null)
            near = facing;
        if (facing !== near) {
            run.push(flat);
            (near ? front : back).push(pathOf(run));
            run = [flat];
            near = facing;
            continue;
        }
        run.push(flat);
    }
    if (run.length > 1)
        (near ? front : back).push(pathOf(run));
    return { back: back.join(""), front: front.join("") };
}
function topTicks(from, to, step, every, edge, z, lengths, projection, axis = "x") {
    const minor = [];
    const major = [];
    const first = Math.ceil(from / step) * step;
    for (let at = first, index = Math.round(first / step); at <= to + 1e-9; at += step, index++) {
        const big = index % every === 0;
        const length = big ? lengths[1] : lengths[0];
        const a = axis === "x" ? [at, edge] : [edge, at];
        const b = axis === "x" ? [at, edge + length] : [edge + length, at];
        (big ? major : minor).push(lineOnTop(a, b, z, projection));
    }
    return { minor: minor.join(""), major: major.join("") };
}
function sideTicks(from, to, step, every, face, top, lengths, projection, axis = "x") {
    const minor = [];
    const major = [];
    const first = Math.ceil(from / step) * step;
    for (let at = first, index = Math.round(first / step); at <= to + 1e-9; at += step, index++) {
        const big = index % every === 0;
        const length = big ? lengths[1] : lengths[0];
        const a = axis === "x" ? [at, face, top] : [face, at, top];
        const b = axis === "x" ? [at, face, top - length] : [face, at, top - length];
        (big ? major : minor).push(segment(a, b, projection));
    }
    return { minor: minor.join(""), major: major.join("") };
}
function radialTicks(cx, cy, radius, count, every, z, lengths, projection, from = 0, span = Math.PI * 2) {
    const minor = [];
    const major = [];
    const closed = Math.abs(span - Math.PI * 2) < 1e-9;
    const steps = closed ? count : count + 1;
    for (let index = 0; index < steps; index++) {
        const angle = from + (index / count) * span;
        const big = index % every === 0;
        const inner = radius - (big ? lengths[1] : lengths[0]);
        const sx = Math.sin(angle);
        const sy = -Math.cos(angle);
        (big ? major : minor).push(lineOnTop([cx + sx * inner, cy + sy * inner], [cx + sx * radius, cy + sy * radius], z, projection));
    }
    return { minor: minor.join(""), major: major.join("") };
}
const haloOf = (plan, z, height, projection) => slabOf(plan, z, height, projection).fill;
function axisVector(projection, [dx, dy, dz]) {
    const origin = iso([0, 0, 0], projection);
    const moved = iso([dx, dy, dz], projection);
    return [moved[0] - origin[0], moved[1] - origin[1]];
}
const fine = (value) => Math.round(value * 100) / 100;
function translateAlong(projection, by) {
    const [x, y] = axisVector(projection, by);
    return `translate(${fine(x)} ${fine(y)})`;
}
const thousandth = (value) => Math.round(value * 1000) / 1000;
function axesAt(at, z, projection) {
    const origin = iso([at[0], at[1], z], projection);
    const along = (point) => {
        const [px, py] = iso(point, projection);
        return [px - origin[0], py - origin[1]];
    };
    return { origin, x: along([at[0] + 1, at[1], z]), y: along([at[0], at[1] + 1, z]), z: along([at[0], at[1], z + 1]) };
}
const matrixOf = (u, v, origin) => `matrix(${thousandth(u[0])} ${thousandth(u[1])} ${thousandth(v[0])} ${thousandth(v[1])} ${thousandth(origin[0])} ${thousandth(origin[1])})`;
function holdStill(element, [dx, dy]) {
    const text = dx || dy ? `translate(${-dx} ${-dy})` : "";
    element.querySelectorAll("[data-hold]").forEach((node) => (text ? node.setAttribute("transform", text) : node.removeAttribute("transform")));
}
function topMatrix(at, z, projection, along = "x") {
    const { origin, x, y } = axesAt(at, z, projection);
    return along === "x" ? matrixOf(x, y, origin) : matrixOf([-y[0], -y[1]], x, origin);
}
function sideMatrix(at, z, projection, face) {
    const { origin, x, y, z: up } = axesAt(at, z, projection);
    const down = [-up[0], -up[1]];
    return face === "left" ? matrixOf(x, down, origin) : matrixOf([-y[0], -y[1]], down, origin);
}
function screenRise(height, projection) {
    const { cosE, k } = cameraOf(projection);
    return height * cosE * k;
}
function fitProjection(points, width, height, { pad = 24, headroom = 0, azimuth = AZIMUTH, elevation = ELEVATION } = {}) {
    const unit = { origin: [0, 0], scale: 1, azimuth, elevation };
    const flat = points.map((point) => iso(point, unit));
    const xs = flat.map(([x]) => x);
    const ys = flat.map(([, y]) => y);
    const left = Math.min(...xs);
    const right = Math.max(...xs);
    const up = Math.min(...ys);
    const down = Math.max(...ys);
    const scale = Math.min((width - pad * 2) / (right - left), (height - pad * 2 - headroom) / (down - up));
    return {
        origin: [width / 2 - ((left + right) / 2) * scale, headroom + (height - headroom) / 2 - ((up + down) / 2) * scale],
        scale,
        azimuth,
        elevation,
    };
}
const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attrs = (pairs) => Object.entries(pairs)
    .filter(([, value]) => value !== undefined && value !== false)
    .map(([key, value]) => ` ${key}="${escape(String(value))}"`)
    .join("");
function solidSvg(paths, { tone = "hi", crease = "faint", halo = false, lit = false, flat = false, className, inner = "" } = {}) {
    const parts = [];
    if (halo)
        parts.push(`<path class="iso-halo" d="${paths.fill}"/>`);
    parts.push(`<path class="iso-fill" d="${paths.fill}"/>`);
    if (!flat) {
        paths.shades.forEach((d, shade) => {
            if (d)
                parts.push(`<path class="iso-shade" data-shade="${shade}" d="${d}"/>`);
        });
        parts.push(`<path class="iso-top" d="${paths.top}"/>`);
    }
    if (crease !== "none" && paths.crease)
        parts.push(`<path class="iso-line iso-crease" data-tone="${crease}" d="${paths.crease}"/>`);
    if (crease !== "none" && paths.bevel)
        parts.push(`<path class="iso-line iso-bevel" data-tone="${crease}" d="${paths.bevel}"/>`);
    if (inner)
        parts.push(inner);
    parts.push(`<path class="iso-line iso-edge" data-tone="${tone}" d="${paths.outline}"/>`);
    return `<g${attrs({ class: className ? `iso-solid ${className}` : "iso-solid", "data-lit": lit ? "" : undefined, "data-seamless": paths.seamless ? "" : undefined })}>${parts.join("")}</g>`;
}
function lineSvg(d, { tone = "lo", dotted = false, dashed = false, flow = false, className, free } = {}) {
    if (!d)
        return "";
    return `<path${attrs({
        class: className ? `iso-line ${className}` : "iso-line",
        "data-tone": tone,
        "data-free": free === true ? "" : free || undefined,
        "data-dotted": dotted ? "" : undefined,
        "data-dashed": dashed ? "" : undefined,
        "data-flow": flow ? "" : undefined,
        d,
    })}/>`;
}
function dotsSvg(points, { size = 0.5, tone = "mid", pulse = false } = {}) {
    const dots = points
        .map(([x, y, alpha], index) => `<circle cx="${tenth(x)}" cy="${tenth(y)}" r="${size}"${alpha !== undefined && alpha < 1 ? ` fill-opacity="${Math.max(0, alpha).toFixed(2)}"` : ""}${pulse ? ` data-pulse="" style="--pulse-at:${(index * 137) % 1600}ms"` : ""}/>`)
        .join("");
    return `<g class="iso-dots" data-tone="${tone}">${dots}</g>`;
}
function fadedSvg(list, style = {}) {
    const groups = new Map();
    for (const entry of list) {
        const [d, alpha] = Array.isArray(entry) ? entry : [entry.d, entry.alpha];
        if (!d || !(alpha > 0.02))
            continue;
        const level = Math.min(1, Math.round(alpha * 20) / 20);
        groups.set(level, (groups.get(level) ?? "") + d);
    }
    return [...groups].map(([alpha, d]) => (alpha >= 1 ? lineSvg(d, style) : `<g opacity="${alpha.toFixed(2)}">${lineSvg(d, style)}</g>`)).join("");
}
function fadeLineSvg(points, { fade = [0, 0], tone = "lo", className, stops = 6 } = {}) {
    if (points.length < 2)
        return "";
    const ease = (t) => t * t * (3 - 2 * t);
    const hashOf = (text) => {
        let hash = 2166136261;
        for (let index = 0; index < text.length; index++)
            hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
        return (hash >>> 0).toString(36);
    };
    const lengths = [0];
    for (let index = 1; index < points.length; index++)
        lengths.push(lengths[index - 1] + Math.hypot(points[index][0] - points[index - 1][0], points[index][1] - points[index - 1][1]));
    const at = (length) => {
        let index = 1;
        while (index < points.length - 1 && lengths[index] < length)
            index++;
        const span = lengths[index] - lengths[index - 1] || 1;
        const t = Math.max(0, Math.min(1, (length - lengths[index - 1]) / span));
        return [points[index - 1][0] + (points[index][0] - points[index - 1][0]) * t, points[index - 1][1] + (points[index][1] - points[index - 1][1]) * t];
    };
    const pieceOf = (from, to) => [at(from), ...points.filter((_, index) => lengths[index] > from + 1e-6 && lengths[index] < to - 1e-6), at(to)];
    const total = lengths[lengths.length - 1];
    if (total < 1e-6)
        return "";
    let [start, end] = Array.isArray(fade) ? fade : [fade, fade];
    if (start + end > total) {
        const share = total / (start + end);
        start *= share;
        end *= share;
    }
    const paint = `var(--anatomy-${tone})`;
    const ramp = (piece, rising) => {
        const d = pathOf(piece);
        const [x1, y1] = piece[0];
        const [x2, y2] = piece[piece.length - 1];
        const id = `iso-fade-${hashOf(`${d}|${tone}|${rising}`)}`;
        const marks = Array.from({ length: stops + 1 }, (_, index) => {
            const t = index / stops;
            const alpha = ease(rising ? t : 1 - t);
            return `<stop offset="${t.toFixed(3)}" stop-opacity="${alpha.toFixed(3)}" style="stop-color:${paint}"/>`;
        }).join("");
        const gradient = `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${tenth(x1)}" y1="${tenth(y1)}" x2="${tenth(x2)}" y2="${tenth(y2)}">${marks}</linearGradient>`;
        return `<defs>${gradient}</defs><path${attrs({ class: className ? `iso-line ${className}` : "iso-line", "data-tone": tone, "data-free": rising ? "start" : "end", d, style: `stroke:url(#${id})` })}/>`;
    };
    const parts = [];
    if (start > 0.05)
        parts.push(ramp(pieceOf(0, start), true));
    if (total - end - start > 0.05)
        parts.push(lineSvg(pathOf(pieceOf(start, total - end)), { tone, className }));
    if (end > 0.05)
        parts.push(ramp(pieceOf(total - end, total), false));
    return `<g class="iso-fade">${parts.join("")}</g>`;
}
function wireSvg(from, to, { via = [], tone = "lo", dotted = false, dashed = false, flow = false, ends = "both", size = 1.2 } = {}) {
    const d = pathOf([from, ...via, to]);
    const end = ([x, y]) => `<circle class="iso-wire-end" cx="${tenth(x)}" cy="${tenth(y)}" r="${size}"/>`;
    return `<g class="iso-wire" data-tone="${tone}">${lineSvg(d, { tone, dotted, dashed, flow })}${ends === "both" || ends === "from" ? end(from) : ""}${ends === "both" || ends === "to" ? end(to) : ""}</g>`;
}
function faceTextSvg(transform, text, { size = 3, tone = "mid", anchor = "start" } = {}) {
    return `<text class="iso-face-text" data-tone="${tone}" transform="${transform}" font-size="${size}" text-anchor="${anchor}">${escape(text)}</text>`;
}
function groupSvg(children, extra = {}) {
    return `<g${attrs(extra)}>${Array.isArray(children) ? children.join("") : children}</g>`;
}
function figureSvg({ width, height, label, body, standalone = false, className }) {
    const style = standalone ? `<style>${ISO_CSS}</style>` : "";
    return `<svg${attrs({
        xmlns: "http://www.w3.org/2000/svg",
        class: `iso-svg${standalone ? " iso" : ""}${className ? ` ${className}` : ""}`,
        "data-theme": standalone || undefined,
        viewBox: `0 0 ${width} ${height}`,
        role: "img",
        "aria-label": label,
    })}>${style}${Array.isArray(body) ? body.join("") : body}</svg>`;
}
function swatchSvg(mark) {
    if (mark === "raised" || mark === "flat" || mark === "lit") {
        const body = mark === "flat" ? "M2 6.5 8 3.5 14 6.5 8 9.5Z" : "M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z";
        const crease = mark === "flat" ? "" : `<path class="iso-swatch-crease" d="M2 4.5 8 7.5 14 4.5"/>`;
        return `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true"><path d="${body}"/>${crease}</svg>`;
    }
    return `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true"><path d="M1.5 5h13"/></svg>`;
}
function plateHtml({ fig, title, hint, readout = "", keys = [], caption, body }) {
    const corner = (name, text, extra = "") => `<span class="iso-plate-corner" data-corner="${name}"${extra}>${escape(text)}</span>`;
    const legend = keys.length || caption
        ? `<figcaption class="iso-legend">${keys.length ? `<span class="iso-keys">${keys.map((key) => `<span class="iso-key">${swatchSvg(key.mark)}${escape(key.label)}</span>`).join("")}</span>` : ""}${caption ? `<span class="iso-caption">${escape(caption)}</span>` : ""}</figcaption>`
        : "";
    return `<figure class="iso-figure"><div class="iso-plate"><div class="iso-plate-corners" aria-hidden="true">${corner("fig", fig)}${title ? corner("title", title) : ""}${hint ? corner("hint", hint) : ""}${corner("readout", readout, " data-readout")}</div>${body}</div>${legend}</figure>`;
}
function pageHtml({ title, theme = "dark", body, script = "", width = 650 }) {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><style>${ISO_CSS}${PAGE_CSS.replace("__WIDTH__", String(width))}</style></head><body class="iso" data-theme="${theme}"><main class="iso-page">${body}</main>${script ? `<script type="module">${script.replace(/<\/(script)/gi, "<\\/$1")}</script>` : ""}</body></html>`;
}
const PAGE_CSS = `
*{box-sizing:border-box}
html{color-scheme:dark}
body[data-theme="light"]{color-scheme:light}
body{margin:0;background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
.iso-page{width:min(__WIDTH__px,100% - 32px);margin:64px auto 96px}
`;
const ISO_CSS = `
.iso{
  --anatomy-page:#0b0b0b;--anatomy-card:#131313;--anatomy-text:#a3a3a3;--anatomy-strong:#e6e6e6;--anatomy-muted:#6e6e6e;
  --anatomy-paper:#131313;--anatomy-face:#1b1b1b;--anatomy-top:#1c1c1c;
  --anatomy-shade-0:#0f0f0f;--anatomy-shade-1:#121212;--anatomy-shade-2:#151515;--anatomy-shade-3:#181818;
  --anatomy-lit-top:#262626;--anatomy-lit-shade:#1d1d1d;
  --anatomy-hi:#d4d4d4;--anatomy-mid:#6a6a6a;--anatomy-lo:#3e3e3e;--anatomy-faint:#2a2a2a;--anatomy-lit:#ffffff;
  --anatomy-halo:#050505;--anatomy-halo-opacity:.9;--anatomy-dot:#e6e6e6;
  --anatomy-red:#ff6b6b;--anatomy-green:#6be0a0;--anatomy-blue:#6b9bff;
  --anatomy-weight:.6px;--anatomy-ease:cubic-bezier(.32,.72,0,1);
  --anatomy-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --anatomy-lift:inset 0 1px 0 0 #ffffff0a,inset 0 0 0 1px #ffffff06,0 0 0 1px #00000026,0 1px 1px -.5px #00000014,0 3px 3px -1.5px #00000014,0 6px 6px -3px #00000014,0 12px 12px -6px #00000014;
}
.iso[data-theme="light"]{
  --anatomy-page:#f2f2ef;--anatomy-card:#fbfbfa;--anatomy-text:#57575a;--anatomy-strong:#18181a;--anatomy-muted:#8c8c90;
  --anatomy-paper:#fbfbfa;--anatomy-face:#ffffff;--anatomy-top:#ffffff;
  --anatomy-shade-0:#dcdcd9;--anatomy-shade-1:#e5e5e2;--anatomy-shade-2:#ededea;--anatomy-shade-3:#f4f4f1;
  --anatomy-lit-top:#ffffff;--anatomy-lit-shade:#eeeeeb;
  --anatomy-hi:#26262a;--anatomy-mid:#8a8a8f;--anatomy-lo:#b4b4b8;--anatomy-faint:#d4d4d6;--anatomy-lit:#000000;
  --anatomy-halo:#8a8a80;--anatomy-halo-opacity:.32;--anatomy-dot:#3a3a3e;
  --anatomy-red:#e5484d;--anatomy-green:#30a46c;--anatomy-blue:#3e63dd;
  --anatomy-lift:inset 0 1px 0 0 #ffffff,0 0 0 1px #0000000f,0 1px 1px -.5px #0000000a,0 3px 3px -1.5px #0000000a,0 6px 6px -3px #0000000a,0 12px 12px -6px #0000000a;
}
.iso-svg{display:block;width:100%;height:auto;overflow:visible}
.iso-svg path,.iso-svg circle{vector-effect:non-scaling-stroke}
.iso-fill{fill:var(--anatomy-paper);stroke:none}
.iso-solid[data-lit]>.iso-fill{fill:var(--anatomy-face)}
.iso-shade,.iso-top{stroke:none}
.iso-shade[data-shade="0"]{fill:var(--anatomy-shade-0)}
.iso-shade[data-shade="1"]{fill:var(--anatomy-shade-1)}
.iso-shade[data-shade="2"]{fill:var(--anatomy-shade-2)}
.iso-shade[data-shade="3"]{fill:var(--anatomy-shade-3)}
.iso-top{fill:var(--anatomy-top)}
.iso-solid[data-lit]>.iso-top{fill:var(--anatomy-lit-top)}
.iso-solid[data-lit]>.iso-shade{fill:var(--anatomy-lit-shade)}
.iso-solid[data-seamless]>.iso-shade,.iso-solid[data-seamless]>.iso-top{stroke-width:.4;stroke-linejoin:round}
.iso-solid[data-seamless]>.iso-shade[data-shade="0"]{stroke:var(--anatomy-shade-0)}
.iso-solid[data-seamless]>.iso-shade[data-shade="1"]{stroke:var(--anatomy-shade-1)}
.iso-solid[data-seamless]>.iso-shade[data-shade="2"]{stroke:var(--anatomy-shade-2)}
.iso-solid[data-seamless]>.iso-shade[data-shade="3"]{stroke:var(--anatomy-shade-3)}
.iso-solid[data-seamless]>.iso-top{stroke:var(--anatomy-top)}
.iso-solid[data-seamless][data-lit]>.iso-top{stroke:var(--anatomy-lit-top)}
.iso-solid[data-seamless][data-lit]>.iso-shade{stroke:var(--anatomy-lit-shade)}
.iso-solid[data-lit]>.iso-edge{stroke:var(--anatomy-lit)}
.iso-halo{fill:var(--anatomy-halo);stroke:none;filter:blur(9px);opacity:var(--anatomy-halo-opacity);transform:translateY(3px)}
.iso-line{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linecap:round;stroke-linejoin:round}
.iso-line[data-tone="hi"]{stroke:var(--anatomy-hi)}
.iso-line[data-tone="mid"]{stroke:var(--anatomy-mid)}
.iso-line[data-tone="lo"]{stroke:var(--anatomy-lo)}
.iso-line[data-tone="faint"]{stroke:var(--anatomy-faint)}
.iso-line[data-tone="lit"]{stroke:var(--anatomy-lit)}
.iso-line[data-tone="red"]{stroke:var(--anatomy-red)}
.iso-line[data-tone="green"]{stroke:var(--anatomy-green)}
.iso-line[data-tone="blue"]{stroke:var(--anatomy-blue)}
.iso-line[data-dotted]{stroke-dasharray:.01 3.5;stroke-width:1}
.iso-line[data-dashed]{stroke-dasharray:3 3}
.iso-line[data-flow]{stroke-dasharray:2 6}
.iso-wire-end{fill:var(--anatomy-paper);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.iso-wire[data-tone="hi"] .iso-wire-end{stroke:var(--anatomy-hi)}
.iso-wire[data-tone="mid"] .iso-wire-end{stroke:var(--anatomy-mid)}
.iso-wire[data-tone="faint"] .iso-wire-end{stroke:var(--anatomy-faint)}
.iso-wire[data-tone="lit"] .iso-wire-end{stroke:var(--anatomy-lit)}
.iso-dots circle{fill:var(--anatomy-dot);stroke:none;opacity:.32}
.iso-dots[data-tone="hi"] circle{opacity:.85}
.iso-dots[data-tone="mid"] circle{opacity:.45}
.iso-dots[data-tone="lo"] circle{opacity:.22}
.iso-dots[data-tone="faint"] circle{opacity:.12}
.iso-face-text{fill:var(--anatomy-mid);font-family:var(--anatomy-mono);letter-spacing:.04em}
.iso-face-text[data-tone="hi"]{fill:var(--anatomy-hi)}
.iso-face-text[data-tone="lo"]{fill:var(--anatomy-lo)}
.iso-face-text[data-tone="faint"]{fill:var(--anatomy-faint)}
.tb-body{fill:var(--anatomy-shade-2);stroke:none}
.tb-shine{fill:var(--anatomy-top);stroke:none}
.tb-shade{fill:var(--anatomy-shade-0);stroke:none}
.tb-ring{fill:none;stroke:var(--anatomy-lo);stroke-width:.45;stroke-linecap:butt;stroke-linejoin:round}
.tb-ring[data-tone="mid"]{stroke:var(--anatomy-mid)}
.tb-ring[data-tone="faint"]{stroke:var(--anatomy-faint)}
.tb-ring[data-tone="hi"]{stroke:var(--anatomy-hi)}
@keyframes iso-flow{to{stroke-dashoffset:-32}}
@keyframes iso-pulse{0%,100%{opacity:.18}12%{opacity:1}40%{opacity:.18}}
.iso-line[data-flow]{animation:iso-flow 1600ms linear infinite}
.iso-dots circle[data-pulse]{animation:iso-pulse 1600ms steps(1,end) infinite;animation-delay:var(--pulse-at,0ms)}
.iso-figure{margin:32px 0 36px}
.iso-plate{position:relative;padding:52px 24px;border-radius:0;background:var(--anatomy-card);box-shadow:0 0 0 1px var(--anatomy-mid);--anatomy-paper:var(--anatomy-card)}
.iso-plate-corners{position:absolute;inset:18px 20px;pointer-events:none}
.iso-plate-corner{position:absolute;color:var(--anatomy-muted);font-family:var(--anatomy-mono);font-size:10.5px;line-height:1;letter-spacing:.04em;white-space:nowrap}
.iso-plate-corner[data-corner="fig"]{top:0;left:0;color:var(--anatomy-text)}
.iso-plate-corner[data-corner="title"]{top:0;right:0;text-transform:uppercase;letter-spacing:.1em}
.iso-plate-corner[data-corner="hint"]{bottom:0;left:0;text-transform:uppercase;letter-spacing:.1em}
.iso-plate-corner[data-corner="readout"]{right:0;bottom:0;color:var(--anatomy-text);font-variant-numeric:tabular-nums}
.iso-plate .iso-svg{margin:0 auto}
.iso-legend{display:grid;gap:8px;margin-top:12px;color:var(--anatomy-muted);font-size:13px;line-height:1.55}
.iso-keys{display:flex;flex-wrap:wrap;gap:6px 18px}
.iso-key{display:inline-flex;align-items:center;gap:7px}
.iso-swatch{width:16px;height:10px;flex:none;overflow:visible}
.iso-swatch path{fill:none;stroke:var(--anatomy-hi);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.iso-swatch[data-mark="raised"] path,.iso-swatch[data-mark="flat"] path{stroke:var(--anatomy-mid)}
.iso-swatch[data-mark="lit"] path{stroke:var(--anatomy-lit)}
.iso-swatch[data-mark="dim"] path{stroke:var(--anatomy-lo)}
.iso-swatch[data-mark="dotted"] path{stroke-dasharray:.01 3;stroke-width:1.4}
.iso-swatch[data-mark="dashed"] path{stroke-dasharray:3 2.5}
.iso-swatch[data-mark="red"] path{stroke:var(--anatomy-red)}
.iso-swatch[data-mark="green"] path{stroke:var(--anatomy-green)}
.iso-swatch[data-mark="blue"] path{stroke:var(--anatomy-blue)}
.iso-swatch-crease{stroke:var(--anatomy-lo)!important}
@media (max-width:560px){.iso-plate{padding:48px 12px 70px}.iso-plate-corner[data-corner="hint"]{bottom:18px}}
@media (prefers-reduced-motion:reduce){.iso-line[data-flow],.iso-dots circle[data-pulse]{animation:none}}
`;
export function mount() {
let dead = false;
const rafs = new Set(), timers = new Set(), observers = [];
const requestAnimationFrame = (cb) => { if (dead) return 0; const id = window.requestAnimationFrame((t) => { rafs.delete(id); cb(t); }); rafs.add(id); return id; };
const cancelAnimationFrame = (id) => { rafs.delete(id); window.cancelAnimationFrame(id); };
const setTimeout = (cb, ms, ...a) => { if (dead) return 0; const id = window.setTimeout(() => { timers.delete(id); cb(...a); }, ms); timers.add(id); return id; };
const clearTimeout = (id) => { timers.delete(id); window.clearTimeout(id); };
class IntersectionObserver extends window.IntersectionObserver { constructor(cb, o) { super(cb, o); observers.push(this); } }

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
const DOWN = "translate(0 2.45)";
const PROG_W = 40;

// tareas de ejemplo: lo que de verdad le pido a Claude Code en mis proyectos
const TASKS = [{"p":"Fix the menu on mobile","read":["index.html","styles.css"],"file":"styles.css","line":212,"ctx":[".nav{display:flex;gap:28px}",".nav a{white-space:nowrap}","","@media (max-width:1360px){","  .snd span{display:none}","}","",".hero{min-height:100svh}",".hero h1{font:900 9vw/.85 Archivo}",".hero .lead{max-width:34ch}","",".rig{padding:120px 40px}",".rnums{display:grid;gap:4px}"],"at":6,"add":["@media (max-width:860px){","  .nav{overflow-x:auto}","}"],"del":1,"plan":"1 file, 3 lines","cmd":"npx playwright test --project=mobile","ok":"menu on one line at 390 px ✓"},{"p":"Make the RGB follow the load","read":["laptop.mjs","sfx.js"],"file":"laptop.mjs","line":318,"ctx":["function draw(tps) {","  for (const l of leds) {","    const h = hue(l.p);","    l.g.style.color = h;","  }","  svg.style.setProperty(","    \"--lap-on\", on);","}","","function tick(now) {","  const dt = (now - last) / 1000;","  draw(step(dt));","}"],"at":3,"add":["    const light = 52 + 14 * load;","    const h = hsl(l.p, light);"],"del":2,"plan":"reads the load model, 2 lines","cmd":"node fig/laptop.mjs","ok":"line ends: 0 ✓"},{"p":"Translate the CV to English","read":["cv/","es.md","en.md"],"file":"en.md","line":12,"ctx":["# Martín Bundy","AI & Industrial Engineering · Panamá","","## Education","- AI Technician · ITSE · 2026","- Industrial Engineering · ADEN","","## Certificates","- Claude Code in Action · Anthropic","- AI Fluency · Anthropic","","## Languages","- Spanish · English C2"],"at":7,"add":["## Skills","- Python · SQL · Power BI · Claude Code",""],"del":-1,"plan":"same order as the Spanish CV","cmd":"node scripts/ats-check.mjs en.md","ok":"ATS-readable ✓"},{"p":"Lazy-load the photos","read":["index.html"],"file":"index.html","line":451,"ctx":["<section class=\"hoy\" id=\"hoy\">","  <div class=\"wrap\">","    <figure class=\"shot\">","      <img src=\"img/expo.jpg\" alt=\"\">","    </figure>","    <h2>Hoy</h2>","  </div>","</section>","","<section id=\"proyectos\">","  <div class=\"wrap\">","    <h2>Proyectos</h2>","  </div>"],"at":4,"add":["      <img src=\"img/expo.jpg\" alt=\"\"","           loading=\"lazy\" decoding=\"async\">"],"del":3,"plan":"only the photos below the fold","cmd":"npx playwright test --project=web","ok":"lazy loading ✓"}];
const SUBS = (t) => [t.plan, "reads " + t.read.filter((f) => !f.endsWith("/")).join(", "), t.file + "  +" + t.add.filter(Boolean).length + (t.del >= 0 ? " −1" : ""), "runs the tests", "ready for review"];
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
  document.querySelectorAll("[data-lap-rgb]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lapRgb === m || (b.type === "color" && colorMode === "fixed" && !document.querySelector('[data-lap-rgb="' + m + '"]:not([type=color])')))));
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
  const c = ch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || ch;
  const key = keyOf[ch === "ñ" || ch === "Ñ" ? "ñ" : c] || keyOf[{ " ": " ", Enter: "↵", Backspace: "⌫", Tab: "⇥", Shift: "⇧", Escape: "esc" }[ch]];
  if (key) key.hit = 1;
  window.SFX?.play("key");
}
function setInput(t) { const v = clip(t, 34); scr.input.textContent = v; scr.caret.setAttribute("x", (85 + v.length * 1.44 + 0.3).toFixed(2)); }
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
  scr.term.forEach((r, i) => (r.textContent = i ? "" : "PS C:\\vitae-cv>"));
  scr.prog.setAttribute("width", 0);
  scr.files.forEach((f) => f.removeAttribute("data-on"));
  scr.tab.textContent = t.file; scr.title.textContent = t.file + " · vitae-cv · Visual Studio Code";
  setRows(t, false);
  enter(0);
}
function enter(i) {
  phase = i; pt = 0;
  scr.steps.forEach((s, j) => { s.toggleAttribute("data-on", j <= i); s.toggleAttribute("data-done", j < i || (i === 4 && j === 4)); });
  if (i < 5) scr.subs[i].textContent = SUBS(task)[i];
  if (i === 2) setRows(task, false);
  if (i === 3) { scr.term[0].textContent = "PS C:\\vitae-cv> " + clip(task.cmd, 30); scr.term[1].textContent = "running…"; }
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
    scr.term[1].textContent = "running" + ".".repeat(1 + Math.floor(pt * 3) % 3);
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
  return { p: text, read: ["agents.md","notas.md"], file: "notas.md", line: 1,
    ctx: ["# Session notes","","## Today","- laptop mockup","- check on mobile","","## Next","- MOTION.md","- CV as PDF","","## Done","- RGB tower","- sound"],
    at: 5, add: ["- " + clip(text, 40)], del: -1, plan: "1 new note, no code touched", cmd: "node scripts/check.mjs", ok: "verified ✓" };
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
  const text = Math.round(tps) + " tok/s · CPU " + Math.round(temp) + " °C · " + (Math.round(rpm / 50) * 50) + " rpm";
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

return () => { dead = true; off.abort(); if (window.LAP === lap) delete window.LAP; window.SFX?.hum(0); rafs.forEach((id) => window.cancelAnimationFrame(id)); timers.forEach((id) => window.clearTimeout(id)); observers.forEach((o) => o.disconnect()); };
}
