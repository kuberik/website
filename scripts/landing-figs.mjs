// Generates the landing page's isometric drawings (the five loop FIGS and the install STAIRCASE) and their motion:
//
//   node scripts/landing-figs.mjs
//     -> layouts/_partials/landing-figs/*.html   (SVG with classes only; the staircase also carries its HTML chips)
//     -> the GENERATED block of the thesis stylesheet: scripts/landing-figs.rules.css (the hand-written fig
//        tokens and rules) followed by the @keyframes computed here from the same P() that draws the geometry.
//
// v6 REDRAW (owner, 2026-11-13: the gates and stairs drawings were "wonky"). One lattice for everything:
//   - true isometric, 30 degrees; plan unit U = 12. EVERY vertex (plate corners, cube corners, tile corners,
//     wire turn points, path ends) sits on a multiple of U. Corner radii are not vertices; they are U (plates),
//     U/4 (tiles) and the dashboard's own 8 (wires).
//   - one plate: 10U x 10U, 1U thick, radius U. Every fig and the staircase use that footprint.
//   - one build: a 2U cube.
//   - three stroke weights (rules.css): 1 structure and wires, 1.5 the active teal, 2 the answer mark.
//     Strokes are non-scaling, so a 1 px line stays 1 px at every size; joins are round.
//   - wires are the dashboard's Gates wire (#145, frontend/src/lib/graph-wire.ts): orthogonal runs joined by
//     8 px quarter circles, a 1 px stroke for every state, an open chevron (no fill) whose apex sits on the edge
//     it points at. They are drawn in PLAN space under the iso matrix, so the runs lie on the plate like the
//     tiles do. Ink: --k-wire at rest, held-orange for the held wire, teal once passed.
//
// MOTION: one 12 s page clock for the row, 2.4 s per phase. Fig n acts only inside its own window
// [n x 2.4 s, n x 2.4 s + 2.4 s) and holds its REST pose the rest of the loop, so exactly one fig moves at a
// time. Every action starts and ends on the rest pose (no jump when a window opens or closes). The keyframes
// are 12 s long with the action in the first 20%; the stylesheet offsets fig n by n x 2.4 s minus --clk.
// The staircase plays once (3 s) and ends on the finished picture, which is also its rest pose.
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'layouts', '_partials', 'landing-figs');
mkdirSync(OUT, { recursive: true });

const C = Math.cos(Math.PI / 6), S = 0.5;
const f = (n) => +(+n).toFixed(2);
let BB = null; // running screen-space bounding box of the figure being drawn
const grow = (X, Y) => { if (!BB) return; BB[0] = Math.min(BB[0], X); BB[1] = Math.min(BB[1], Y); BB[2] = Math.max(BB[2], X); BB[3] = Math.max(BB[3], Y); };
// plan (x, y, z) -> screen. +x runs down-right, +y down-left, +z up.
const P = (x, y, z = 0) => { const X = f((x - y) * C), Y = f((x + y) * S - z); grow(X, Y); return [X, Y]; };
const iso = (ox, oy) => `matrix(${C.toFixed(5)} ${S} ${(-C).toFixed(5)} ${S} ${f(ox)} ${f(oy)})`;
const NS = 'vector-effect="non-scaling-stroke"';
const d = (A, B) => [f(B[0] - A[0]), f(B[1] - A[1])];

// ---- the lattice ---------------------------------------------------------------------------------
const U = 12;           // plan unit
const W = 10 * U;       // plate side
const T = U;            // plate thickness
const E = 2 * U;        // the build cube
const G = 2 * U;        // the gap between two plates on one level
const R = U;            // plate corner radius
const onLattice = (...v) => v.forEach((n) => { if (Math.abs(n / U - Math.round(n / U)) > 1e-9) throw new Error(`off lattice: ${v}`); });

// ---- motion --------------------------------------------------------------------------------------
function bez(x1, y1, x2, y2) {
	const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
	const X = (t) => ((ax * t + bx) * t + cx) * t, Y = (t) => ((ay * t + by) * t + cy) * t;
	return (u) => { let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (X(m) < u) lo = m; else hi = m; } return Y((lo + hi) / 2); };
}
// calm: the move curve for travel (<= 35% of the distance in the first 25% of the time; no teleport-then-creep).
// fall: gravity, the impact is the stop.
const EASE = { calm: bez(0.45, 0, 0.2, 1), fall: bez(0.55, 0, 1, 0.45) };
function along(pts, p) {
	const seg = []; let L = 0;
	for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
	let rest = p * L;
	for (let i = 0; i < seg.length; i++) {
		if (rest <= seg[i] || i === seg.length - 1) { const t = seg[i] ? Math.min(1, rest / seg[i]) : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]; }
		rest -= seg[i];
	}
}
const KF = [];
const LOOP = 12000, PHASE = 2400;
const pct = (ms, T0) => `${f(ms / T0 * 100)}%`;
// track(name, T0, steps): steps = [{t, x, y, o}] or a sampled move {t, dur, pts, ease, o:[from,to]}
function track(name, T0, steps) {
	const kf = [];
	for (const s of steps) {
		if (s.pts) {
			const n = 16;
			for (let i = 0; i <= n; i++) {
				const u = i / n, p = EASE[s.ease || 'calm'](u), [x, y] = along(s.pts, p);
				const o = s.o ? s.o[0] + (s.o[1] - s.o[0]) * u : undefined;
				kf.push(`${pct(s.t + u * s.dur, T0)}{transform:translate(${f(x)}px,${f(y)}px)${o !== undefined ? `;opacity:${f(o)}` : ''}}`);
			}
		} else kf.push(`${pct(s.t, T0)}{transform:translate(${f(s.x || 0)}px,${f(s.y || 0)}px)${s.o !== undefined ? `;opacity:${s.o}` : ''}}`);
	}
	KF.push(`@keyframes ${name}{${kf.join('')}}`);
}
// opacity only: [[ms, o], ...]
function fade(name, T0, pts) { KF.push(`@keyframes ${name}{${pts.map(([t, o]) => `${pct(t, T0)}{opacity:${o}}`).join('')}}`); }

// ---- primitives ----------------------------------------------------------------------------------
// A plate (or a terrace block when t > U): a rounded square of side w at plan (px, py), top at z, t thick.
function plate({ px, py, z = 0, w = W, t = T, r = R, cls = '', ring = true, tiles = true }) {
	onLattice(px, py, z, w, t);
	const [sx, sy] = P(px, py, z);
	const k = 1 / Math.SQRT2;
	// the silhouette's extreme screen-left / right points (corner arcs facing -X / +X)
	const Lp = (zz) => P(px + r - r * k, py + w - r + r * k, zz), Rp = (zz) => P(px + w - r + r * k, py + r - r * k, zz);
	for (const [a, b] of [[0, 0], [w, 0], [w, w], [0, w]]) { const q = P(px + a, py + b, z); grow(q[0], q[1] + t); }
	const Lt = Lp(z), Lb = Lp(z - t), Rt = Rp(z), Rb = Rp(z - t);
	const out = [`<g class="fig-plate ${cls}">`];
	out.push(`<rect class="fig-side" ${NS} width="${w}" height="${w}" rx="${r}" transform="${iso(sx, sy + t)}"/>`);
	// the band between the top and the underside: a hull fill (no stroke) so a tall block is solid, then the two verticals
	out.push(`<path class="fig-hull" d="M${Lt.join(' ')}L${Lb.join(' ')}L${Rb.join(' ')}L${Rt.join(' ')}Z"/>`);
	out.push(`<path class="fig-line" ${NS} d="M${Lt[0]} ${Lt[1]}V${Lb[1]}M${Rt[0]} ${Rt[1]}V${Rb[1]}"/>`);
	out.push(`<rect class="fig-top" ${NS} width="${w}" height="${w}" rx="${r}" transform="${iso(sx, sy)}"/>`);
	if (ring) out.push(`<circle class="fig-ring" ${NS} cx="${w / 2}" cy="${w / 2}" r="${2 * U}" transform="${iso(sx, sy)}"/>`);
	// four corner tiles, 1U square, corners on the lattice
	if (tiles) for (const [a, b] of [[1, 1], [8, 1], [8, 8], [1, 8]]) out.push(rect2({ x: px + a * U, y: py + b * U, z, w: U, h: U, rx: 3, cls: 'fig-tile' }));
	out.push(`<rect class="fig-flash" ${NS} width="${w}" height="${w}" rx="${r}" transform="${iso(sx, sy)}"/>`);
	out.push('</g>');
	return out.join('');
}
// a flat rounded rectangle lying on a face at height z, plan corner (x, y), size w x h
function rect2({ x, y, z, w, h, rx = 3, cls }) {
	onLattice(x, y, w, h);
	const [sx, sy] = P(x, y, z);
	P(x + w, y + h, z);
	return `<rect class="${cls}" ${NS} width="${w}" height="${h}" rx="${rx}" transform="${iso(sx, sy)}"/>`;
}
// the build: a solid 2U cube, base centre at plan (px, py, z). A silhouette underlay is drawn first so no
// shared face edge antialiases against the ground.
function cube({ px, py, z = 0, e = E, cls = '' }) {
	onLattice(px, py, z);
	const h = e / 2;
	const p = (x, y, zz) => P(px + x, py + y, z + zz).join(' ');
	const top = `M${p(-h, -h, e)}L${p(h, -h, e)}L${p(h, h, e)}L${p(-h, h, e)}Z`;
	const left = `M${p(-h, h, e)}L${p(h, h, e)}L${p(h, h, 0)}L${p(-h, h, 0)}Z`;
	const right = `M${p(h, -h, e)}L${p(h, h, e)}L${p(h, h, 0)}L${p(h, -h, 0)}Z`;
	const sil = `M${p(-h, -h, e)}L${p(h, -h, e)}L${p(h, -h, 0)}L${p(h, h, 0)}L${p(-h, h, 0)}L${p(-h, h, e)}Z`;
	return `<g class="fig-cube ${cls}"><path class="fig-cube-s" d="${sil}"/><path class="fig-cube-l" d="${left}"/><path class="fig-cube-r" d="${right}"/><path class="fig-cube-t" d="${top}"/></g>`;
}
// an outlined cube (queued, or where a build is about to be)
function ghost({ px, py, z = 0, e = E, cls = '' }) {
	onLattice(px, py, z);
	const h = e / 2;
	const p = (x, y, zz) => P(px + x, py + y, z + zz).join(' ');
	const dd = `M${p(-h, -h, e)}L${p(h, -h, e)}L${p(h, h, e)}L${p(-h, h, e)}Z M${p(-h, h, e)}L${p(-h, h, 0)}L${p(h, h, 0)}L${p(h, -h, 0)}L${p(h, -h, e)} M${p(h, h, e)}L${p(h, h, 0)}`;
	return `<path class="fig-ghost ${cls}" ${NS} d="${dd}"/>`;
}
// a ring of plan radius r lying on a face, wrapped in a <g> so a CSS scale never replaces the iso matrix
function ring({ px, py, z, r, cls, dash = false }) {
	const [sx, sy] = P(px, py, z);
	for (const q of [[r, 0], [-r, 0], [0, r], [0, -r]]) P(px + q[0], py + q[1], z);
	return `<g class="${cls}"><circle class="fig-pulse${dash ? ' fig-dash' : ''}" ${NS} r="${r}" transform="${iso(sx, sy)}"/></g>`;
}

// ---- the dashboard's Gates wire, in plan space ----------------------------------------------------
// graph-wire.ts: CORNER 8, SOFT 12, SNAP 4, 1 px stroke, open chevron depth 4 / half 3.5 with its apex on the edge.
// Here a wire runs along -y (up-right on screen) from (x1, y1) to the port (x2, y2) and changes lane once on the
// trunk at ty, exactly as elbow() changes height on its trunk at tx. The chevron is scaled 1.5x in plan units
// because the loop draws the plate at ~0.56 px per unit at 1440 (4 x 3.4 px on screen, the dashboard's size).
const CORNER = 8, SOFT = 12, SNAP = 4, CHEV = { depth: 7, half: 6 };
function wirePath(x1, y1, x2, y2, ty) {
	onLattice(x1, y1, x2, y2, ty);
	const dx = x2 - x1;
	if (Math.abs(dx) < SNAP) return `M${x2} ${y1}V${y2}`;
	const room = Math.min(y1 - ty, ty - y2);
	if (Math.abs(dx) < 2 * CORNER) { const l = Math.min(SOFT, room); return `M${x1} ${y1}V${ty + l}C${x1} ${ty} ${x2} ${ty} ${x2} ${ty - l}V${y2}`; }
	const s = dx > 0 ? 1 : -1, r = Math.min(CORNER, room);
	// travelling -y then turning toward +x is a clockwise turn in plan (y down); sweep flags follow
	const cw1 = s > 0 ? 1 : 0, cw2 = s > 0 ? 0 : 1; // the iso matrix keeps orientation (det > 0)
	return `M${x1} ${y1}V${ty + r}A${r} ${r} 0 0 ${cw1} ${x1 + s * r} ${ty}H${x2 - s * r}A${r} ${r} 0 0 ${cw2} ${x2} ${ty - r}V${y2}`;
}
const chevron = (x, y) => `M${x - CHEV.half} ${y + CHEV.depth}L${x} ${y}L${x + CHEV.half} ${y + CHEV.depth}`;
// one wire = path + chevron, in a plan-space group under the iso matrix at plate height z
function wire({ x1, y1, x2, y2, ty, z = 0, cls }) {
	const [sx, sy] = P(0, 0, z);
	return `<g class="fig-wire ${cls}" transform="${iso(sx, sy)}"><path ${NS} d="${wirePath(x1, y1, x2, y2, ty)}"/><path ${NS} d="${chevron(x2, y2)}"/></g>`;
}

function begin() { BB = [Infinity, Infinity, -Infinity, -Infinity]; }
// loop figures share one frame so the five plates stand on one baseline at one scale, like plates on a shelf
const SHELF = { w: 372, h: 252 };
function svg(name, body, { shelf = true, extra = '', pad = 6 } = {}) {
	const vb = shelf
		? [f((BB[0] + BB[2]) / 2 - SHELF.w / 2), f(BB[3] + pad - SHELF.h), SHELF.w, SHELF.h]
		: [f(BB[0] - pad), f(BB[1] - pad), f(BB[2] - BB[0] + 2 * pad), f(BB[3] - BB[1] + 2 * pad)];
	if (shelf && (BB[2] - BB[0] + 2 * pad > SHELF.w || BB[3] - BB[1] + 2 * pad > SHELF.h)) throw new Error(`${name} overflows the shelf: ${BB}`);
	BB = null;
	return { vb, html: `<svg class="fig fig6 fig-${name}" viewBox="${vb.join(' ')}" ${extra} aria-hidden="true" focusable="false">${body}</svg>` };
}
const HEAD = '{{/* GENERATED by scripts/landing-figs.mjs: edit the generator, not this file. */}}\n';
const emit = (name, html) => { writeFileSync(join(OUT, `${name}.html`), HEAD + html + '\n'); console.log('wrote', name); };
const scr = (A, pts) => pts.map((q) => d(A, P(...q)));
const CX = W / 2; // plate centre (5U)

// ---- Fig 1 release: "which versions are available" ------------------------------------------------
// Rest: the next build hovers over the plate on a dotted drop line; two more wait in a straight queue behind
// and above it (each one 2U back and 3U up). Action: it drops, the rim answers, it is absorbed, the queue steps down.
{
	begin(); let b = plate({ px: 0, py: 0 });
	const hz = 3 * U, step = [-2 * U, 3 * U];
	const q = (i) => [CX, CX + i * step[0], hz + i * step[1]];
	const land = P(CX, CX, 0), hover = P(...q(0)), g1 = P(...q(1)), g2 = P(...q(2));
	b += `<path class="fig-drop" ${NS} d="M${P(CX, CX, 6).join(' ')}L${P(CX, CX, hz - 6).join(' ')}"/>`;
	b += `<g class="m6 m6-rel-g3">${ghost({ px: q(2)[0], py: q(2)[1], z: q(2)[2] })}</g>`;
	b += `<g class="m6 m6-rel-g2">${ghost({ px: q(2)[0], py: q(2)[1], z: q(2)[2] })}</g>`;
	b += `<g class="m6 m6-rel-g1">${ghost({ px: q(1)[0], py: q(1)[1], z: q(1)[2] })}</g>`;
	b += `<g class="m6 m6-rel-next">${cube({ px: q(1)[0], py: q(1)[1], z: q(1)[2] })}</g>`;
	b += `<g class="m6 m6-rel-cube">${cube({ px: CX, py: CX, z: hz })}</g>`;
	const fall = d(hover, land), up1 = d(g1, hover), up2 = d(g2, g1);
	// 0-360 fall; 360 rim; 1000-1200 absorbed; 1200-1700 the queue steps down; 1700-2000 a new build joins the back
	track('f6-rel-cube', LOOP, [{ t: 0, o: 1 }, { t: 0, dur: 360, pts: [[0, 0], fall], ease: 'fall' }, { t: 1000, x: fall[0], y: fall[1], o: 1 }, { t: 1200, x: fall[0], y: fall[1], o: 0 }, { t: PHASE - 1, x: fall[0], y: fall[1], o: 0 }, { t: PHASE, o: 1 }, { t: LOOP, o: 1 }]);
	track('f6-rel-next', LOOP, [{ t: 0, o: 0 }, { t: 1200, o: 0 }, { t: 1200, dur: 500, pts: [[0, 0], up1], o: [0, 1] }, { t: PHASE - 1, x: up1[0], y: up1[1], o: 1 }, { t: PHASE, o: 0 }, { t: LOOP, o: 0 }]);
	track('f6-rel-g1', LOOP, [{ t: 0, o: 1 }, { t: 1200, o: 1 }, { t: 1200, dur: 500, pts: [[0, 0], up1], o: [1, 0] }, { t: PHASE - 1, x: up1[0], y: up1[1], o: 0 }, { t: PHASE, o: 1 }, { t: LOOP, o: 1 }]);
	track('f6-rel-g2', LOOP, [{ t: 0, o: 1 }, { t: 1300 }, { t: 1300, dur: 500, pts: [[0, 0], up2] }, { t: PHASE - 1, x: up2[0], y: up2[1] }, { t: PHASE }, { t: LOOP }]);
	fade('f6-rel-g3', LOOP, [[0, 0], [1700, 0], [2000, 1], [PHASE - 1, 1], [PHASE, 0], [LOOP, 0]]);
	fade('f6-rel-flash', LOOP, [[0, 0], [350, 0], [370, 1], [1000, 0], [LOOP, 0]]);
	emit('release', svg('release', b).html);
}
// ---- Fig 2 guard: "is it safe to deploy here" -------------------------------------------------------
// The fence lies on the ground the plate stands on, one unit out. Rest: the check lies on the plate.
// Action: the check lifts away, a scan runs once round the fence, the check is drawn again.
{
	begin(); let b = '';
	const [sx, sy] = P(-U, -U, -T); P(W + U, -U, -T); P(-U, W + U, -T); P(W + U, W + U, -T);
	const fence = `width="${W + 2 * U}" height="${W + 2 * U}" rx="${2 * U}" transform="${iso(sx, sy)}"`;
	b += `<rect class="fig-fence" ${NS} ${fence}/>`;
	b += `<rect class="fig-scan" pathLength="100" ${fence}/>`; // no non-scaling-stroke: pathLength must be honoured
	b += plate({ px: 0, py: 0 });
	// the check lies on the plate on lattice points: a short run along +x, then a long one along -y
	const ck = [[3 * U, 6 * U], [5 * U, 6 * U], [5 * U, 2 * U]].map((q) => P(q[0], q[1], 0));
	b += `<path class="fig-check" pathLength="1" d="M${ck.map((q) => q.join(' ')).join('L')}"/>`;
	fade('f6-check-o', LOOP, [[0, 1], [200, 0], [1100, 0], [1101, 1], [LOOP, 1]]);
	KF.push(`@keyframes f6-check{0%{stroke-dashoffset:0}${pct(1100, LOOP)}{stroke-dashoffset:1}${pct(1500, LOOP)},100%{stroke-dashoffset:0}}`);
	KF.push(`@keyframes f6-scan{0%,${pct(200, LOOP)}{opacity:0;stroke-dashoffset:0}${pct(260, LOOP)}{opacity:1;stroke-dashoffset:0}${pct(1100, LOOP)}{opacity:1;stroke-dashoffset:-100}${pct(1200, LOOP)},100%{opacity:0;stroke-dashoffset:-100}}`);
	emit('guard', svg('guard', b).html);
}
// two plates on one level, the far one up-right on screen (plan -y), a G gap between them (gates: a wider gap,
// so the wires change lane in open air where the reader can see the corners)
const FAR = -(W + G), GW = 4 * U, FARW = -(W + GW);
// ---- Fig 3 gates: "which version may go now" --------------------------------------------------------
// The near plate carries three gate tiles (2U square, centred on lattice columns 2U, 5U, 8U, mid-plate). Each sends a wire across
// the gap into the build's plate; the outer two change lane once on the trunk in the middle of the gap with the
// dashboard's 8 px corners and land on ports two units apart (a one-unit shift is the dashboard's soft S), each with its open chevron on the plate's edge.
// Rest: two wires at --k-wire, the held one orange (its tile too), the build waiting on the far plate.
// Action: the held wire passes and all three turn teal; the build moves on and leaves; the next one arrives.
{
	begin(); let b = '';
	b += plate({ px: 0, py: FARW, tiles: false, cls: 'fig-to' });
	const bc = [CX, FARW + W / 2];
	b += `<g class="m6 m6-gate-cube">${cube({ px: bc[0], py: bc[1] })}</g>`;
	b += `<g class="m6 m6-gate-next">${cube({ px: bc[0], py: bc[1] })}</g>`;
	b += plate({ px: 0, py: 0, tiles: false, ring: false });
	const cols = [2 * U, 5 * U, 8 * U], ports = [3 * U, 5 * U, 7 * U], held = 2; // the right-hand (nearest) gate holds
	const ty = -GW / 2, y1 = 3 * U, y2 = -GW;
	cols.forEach((x, i) => {
		const st = i === held ? 'is-held' : 'is-clear';
		b += rect2({ x: x - U, y: 3 * U, z: 0, w: 2 * U, h: 2 * U, rx: 4, cls: `fig-gtile ${st}` });
		b += rect2({ x: x - U, y: 3 * U, z: 0, w: 2 * U, h: 2 * U, rx: 4, cls: 'fig-gtile is-pass m6 m6-gate-pass' });
	});
	cols.forEach((x, i) => {
		const st = i === held ? 'is-held' : 'is-clear';
		b += wire({ x1: x, y1, x2: ports[i], y2, ty, cls: st });
		b += wire({ x1: x, y1, x2: ports[i], y2, ty, cls: 'is-pass m6 m6-gate-pass' });
	});
	const A = P(bc[0], bc[1], 0), out = d(A, P(bc[0], bc[1] - 3 * U, 0));
	// 0-240 the wires pass; 300-1100 the build moves on (fades over its last 300 ms); 1500 the wires return; 1700-2000 the next build
	fade('f6-gate-pass', LOOP, [[0, 0], [240, 1], [1500, 1], [1700, 0], [LOOP, 0]]);
	track('f6-gate-cube', LOOP, [{ t: 0, o: 1 }, { t: 300, o: 1 }, { t: 300, dur: 800, pts: [[0, 0], out], o: [1, 0] }, { t: PHASE - 1, x: out[0], y: out[1], o: 0 }, { t: PHASE, o: 1 }, { t: LOOP, o: 1 }]);
	fade('f6-gate-next', LOOP, [[0, 0], [1700, 0], [2000, 1], [PHASE - 1, 1], [PHASE, 0], [LOOP, 0]]);
	emit('gates', svg('gates', b).html);
}
// ---- Fig 4 update: "how does it reach the cluster" --------------------------------------------------
// Two plates on one level joined by a 2U path slab on lattice columns 4U-6U. Rest: the build on the near plate,
// its outline waiting on the far one. Action: it travels the straight path, the far rim answers, the next build appears.
{
	begin(); let b = '';
	b += plate({ px: 0, py: FAR, cls: 'fig-to' });
	b += plate({ px: 4 * U, py: -G, w: 2 * U, r: 0, ring: false, tiles: false, cls: 'fig-path' }); // the path: square ends, abutting both plates
	b += plate({ px: 0, py: 0 });
	const from = [CX, CX], to = [CX, FAR + W / 2];
	b += `<g class="m6 m6-upd-ghost">${ghost({ px: to[0], py: to[1] })}</g>`;
	b += `<g class="m6 m6-upd-cube">${cube({ px: from[0], py: from[1] })}</g>`;
	const A = P(from[0], from[1], 0), go = d(A, P(to[0], to[1], 0));
	// 0-900 the trip; 900 rim; 1700-1900 absorbed; 1900-2200 the next build and the outline return
	track('f6-upd-cube', LOOP, [{ t: 0, o: 1 }, { t: 0, dur: 900, pts: [[0, 0], go], ease: 'calm' }, { t: 1700, x: go[0], y: go[1], o: 1 }, { t: 1900, x: go[0], y: go[1], o: 0 }, { t: 1901, o: 0 }, { t: 2200, o: 1 }, { t: LOOP, o: 1 }]);
	fade('f6-upd-ghost', LOOP, [[0, 1], [700, 1], [880, 0], [1900, 0], [2200, 1], [LOOP, 1]]);
	fade('f6-upd-flash', LOOP, [[0, 0], [880, 0], [900, 1], [1600, 0], [LOOP, 0]]);
	emit('update', svg('update', b).html);
}
// ---- Fig 5 health: "did it actually work" -----------------------------------------------------------
// Rest: the build with its inner ring and the dashed outer ring (the "yours" check) at rest.
// Action: the measurement goes out twice from the build; the dashed ring settles back.
{
	begin(); let b = plate({ px: 0, py: 0, cls: 'is-healthy', ring: false });
	b += ring({ px: CX, py: CX, z: 0, r: 1.5 * U, cls: 'fig-ring-rest' });
	b += ring({ px: CX, py: CX, z: 0, r: 3.5 * U, cls: 'm6 m6-hp1' });
	b += ring({ px: CX, py: CX, z: 0, r: 3.5 * U, cls: 'm6 m6-hp2', dash: true });
	b += cube({ px: CX, py: CX });
	KF.push(`@keyframes f6-hp1{0%{transform:scale(.4);opacity:0}${pct(160, LOOP)}{opacity:.9}${pct(1100, LOOP)},100%{transform:scale(1);opacity:0}}`);
	KF.push(`@keyframes f6-hp2{0%{transform:scale(1);opacity:.4}${pct(300, LOOP)}{transform:scale(1);opacity:0}${pct(301, LOOP)}{transform:scale(.4);opacity:0}${pct(460, LOOP)}{opacity:.9}${pct(1400, LOOP)},100%{transform:scale(1);opacity:.4}}`);
	emit('health', svg('health', b).html);
}

// ---- the staircase: three environments, three equal 2U rises ---------------------------------------
// Terrace blocks on one footprint, abutting along -y, each top 2U above the last; all stand on one ground.
// The build climbs dev -> staging -> production: along the plate to the riser, up the 2U rise, on to the centre.
// Environment names are HTML chips in the product's Chip style, placed left of each block's left corner (in
// viewBox %, so they ride the drawing at any size). Plays ONCE (3 s); rest = the finished picture: the build in
// every environment, production lit. `room` = viewBox units reserved left of the drawing for the chips: the
// compact variant renders at about half scale, so it reserves more to keep the same px of chip.
const RISE = 2 * U;
function staircase(name, k, { room }) {
	begin(); let b = '';
	const env = [0, 1, 2].map((i) => ({ py: -i * W, z: i * RISE, tier: ['dev', 'staging', 'prod'][i], label: ['development', 'staging', 'production'][i] }));
	for (let i = 2; i >= 0; i--) {
		const e = env[i];
		b += plate({ px: 0, py: e.py, z: e.z, t: T + e.z, cls: i === 2 ? 'is-healthy' : '', ring: i !== 2 });
		if (i === 2) {
			b += ring({ px: CX, py: e.py + CX, z: e.z, r: 1.5 * U, cls: `fig-ring-rest m6 m6-${k}-lit` });
			b += ring({ px: CX, py: e.py + CX, z: e.z, r: 3.5 * U, cls: `m6 m6-${k}-pulse` });
		}
	}
	b += `<g class="m6 m6-${k}-p">${cube({ px: CX, py: env[2].py + CX, z: env[2].z })}</g>`;
	b += `<g class="m6 m6-${k}-s">${cube({ px: CX, py: env[1].py + CX, z: env[1].z })}</g>`;
	b += cube({ px: CX, py: CX, z: 0 });
	b += `<g class="m6 m6-${k}-t">${cube({ px: CX, py: CX, z: 0 })}</g>`;
	// chip anchors: each block's top-left corner on screen (plan x 0, y = the block's near edge)
	const anchors = env.map((e) => P(0, e.py + W - R, e.z));
	grow(BB[0] - room, BB[1]);
	const A = P(CX, CX, 0);
	const leg = (i) => { const e = env[i]; return scr(A, [[CX, e.py + CX, e.z], [CX, e.py + E / 2, e.z], [CX, e.py + E / 2, e.z + RISE], [CX, e.py - W + CX, e.z + RISE]]); };
	const T3 = 3000, s1 = leg(0)[3], s2 = leg(1)[3];
	// 0-300 hold; 300-1100 to staging; 1100-1300 hold; 1300-2100 to production; 2100-2900 production lit, one pulse
	track(`f6-${k}-t`, T3, [{ t: 0, o: 1 }, { t: 300, o: 1 }, { t: 300, dur: 800, pts: leg(0) }, { t: 1300, x: s1[0], y: s1[1] }, { t: 1300, dur: 800, pts: leg(1) }, { t: T3, x: s2[0], y: s2[1] }]);
	fade(`f6-${k}-s`, T3, [[0, 0], [1099, 0], [1100, 1], [T3, 1]]);
	fade(`f6-${k}-p`, T3, [[0, 0], [2099, 0], [2100, 1], [T3, 1]]);
	fade(`f6-${k}-lit`, T3, [[0, 0], [2100, 0], [2300, 1], [T3, 1]]);
	KF.push(`@keyframes f6-${k}-pulse{0%,${pct(2100, T3)}{transform:scale(.4);opacity:0}${pct(2260, T3)}{opacity:.9}${pct(2900, T3)},100%{transform:scale(1);opacity:0}}`);
	const { vb, html } = svg(name, b, { shelf: false, pad: 4 });
	const chips = env.map((e, i) => {
		const [x, y] = anchors[i];
		return `<span class="fig-chip fig-chip-${e.tier}" style="--x:${f((x - vb[0]) / vb[2] * 100)}%;--y:${f((y - vb[1]) / vb[3] * 100)}%">${e.label}</span>`;
	}).join('');
	emit(name, `<div class="stair stair-${k}" style="aspect-ratio:${vb[2]}/${vb[3]}">${html}${chips}</div>`);
}
staircase('staircase-done', 'st', { room: 116 });
staircase('staircase-done-compact', 'stc', { room: 150 });

// ---- the stylesheet half ---------------------------------------------------------------------------
// One marked block in the thesis stylesheet: the hand-written fig tokens and rules (landing-figs.rules.css), then
// the keyframes above. Until lane D's step 0 lands (thesis.css exists) the block is written to sections.css.
const RULES = readFileSync(join(ROOT, 'scripts', 'landing-figs.rules.css'), 'utf8');
const GEN = RULES.replace(/\n*$/, '\n') + KF.join('\n') + '\n';
const THESIS = join(ROOT, 'assets', 'css', 'thesis.css'), LEGACY = join(ROOT, 'assets', 'css', 'sections.css');
const TARGET = existsSync(THESIS) ? THESIS : LEGACY;
const B0 = '/* BEGIN landing-figs (GENERATED by scripts/landing-figs.mjs from landing-figs.rules.css; do not edit here) */', B1 = '/* END landing-figs */';
let css = readFileSync(TARGET, 'utf8');
const i0 = css.indexOf(B0), i1 = css.indexOf(B1);
css = i0 >= 0 ? css.slice(0, i0) + B0 + '\n' + GEN + css.slice(i1) : css.replace(/\n*$/, '\n') + B0 + '\n' + GEN + B1 + '\n';
writeFileSync(TARGET, css);
console.log('wrote the fig block into', TARGET.replace(ROOT + '/', ''));
