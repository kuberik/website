// Generates the landing page's isometric line drawings (the five loop FIGS, the dependency graph and the
// closing staircase) AND their motion:
//
//   node scripts/landing-figs.mjs
//     -> layouts/_partials/landing-figs/*.html   (SVG, classes only)
//     -> assets/css/landing-figs.gen.css          (@keyframes; waypoints computed from P() below)
//
// ONE OBJECT, ONE LANGUAGE (owner rule, film and page): every drawing is the environment plate from the
// film in a state. Colours are classes, not values (sections.css `.fig*`, tokens from PALETTE.md s4), so
// both themes are drawn by the stylesheet. Spec: .work/landing-v5/figs-design/FIGS-SPEC.md; the designer's
// proof is figs-design/proof/figs-proof.mjs. No stylesheet ever hard-codes a pixel offset: the keyframes
// are emitted here from the same P() that draws the geometry (FIGS-SPEC A4).
//
// Geometry: true isometric (30 deg). A plate is a rounded square drawn in plan coordinates under the iso
// matrix; strokes use non-scaling-stroke so a 1px line stays 1px after the shear. Top faces are filled
// with the ground colour so they occlude what is behind them; that is the whole hidden-line model.
// Resets (absorb, check fade, gate close, next build) all run in the row's quiet window, global 5500-6000 ms,
// so no reset overlaps another fig's burst (AD r1 #4).
// Motion grammar = the hero's (railway-motion.md): EXPO moves 240-540 ms, fall 320 ms, 200 ms fades,
// holds >= 600 ms, one focal change at a time across the row (one 6 s clock, fig n bursts at n x 1100 ms).
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'layouts', '_partials', 'landing-figs');
mkdirSync(OUT, { recursive: true });

const C = Math.cos(Math.PI / 6), S = 0.5;
const f = (n) => +n.toFixed(2);
// plan (x, y, z) -> screen
let BB = null; // running screen-space bounding box of the figure being drawn
const grow = (X, Y) => { if (!BB) return; BB[0] = Math.min(BB[0], X); BB[1] = Math.min(BB[1], Y); BB[2] = Math.max(BB[2], X); BB[3] = Math.max(BB[3], Y); };
const P = (x, y, z = 0) => { const X = f((x - y) * C), Y = f((x + y) * S - z); grow(X, Y); return [X, Y]; };
// A1: the matrix carries cos 30 at full precision (f(C) = 0.87 made every rect/circle 0.46% wider than the paths)
const iso = (ox, oy) => `matrix(${C.toFixed(5)} ${S} ${(-C).toFixed(5)} ${S} ${f(ox)} ${f(oy)})`;
const NS = 'vector-effect="non-scaling-stroke"';
const d = (A, B) => [f(B[0] - A[0]), f(B[1] - A[1])];

// ---- motion: an easing sampled over a polyline into linear keyframes ----------------------------
function bez(x1, y1, x2, y2) {
	const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
	const X = (t) => ((ax * t + bx) * t + cx) * t, Y = (t) => ((ay * t + by) * t + cy) * t;
	return (u) => { let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (X(m) < u) lo = m; else hi = m; } return Y((lo + hi) / 2); };
}
// EXPO is the hero's move curve (90% of the travel in the first 45%); fall is gravity (impact = the stop)
// calm is the climb curve (AD r2 #1): EXPO along a long polyline covered 80% in the first 150 ms and read as a
// teleport then a creep; calm covers <= 35% of the distance in the first 25% of the time.
const EASE = { expo: bez(0.16, 1, 0.3, 1), fall: bez(0.55, 0, 1, 0.45), calm: bez(0.45, 0, 0.2, 1) };
function along(pts, p) { // pts: screen points; p 0..1 by arc length
	const seg = []; let L = 0;
	for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
	let rest = p * L;
	for (let i = 0; i < seg.length; i++) {
		if (rest <= seg[i] || i === seg.length - 1) { const t = seg[i] ? Math.min(1, rest / seg[i]) : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]; }
		rest -= seg[i];
	}
}
const CSS = [];
// track(name, T, steps): steps = [{t(ms), x, y, o, ease?}] or a sampled move {t, dur, pts, ease, o:[from,to], ofast}
function track(name, T, steps) {
	const kf = []; const pct = (ms) => `${f(ms / T * 100)}%`;
	for (const s of steps) {
		if (s.pts) {
			const n = 14;
			for (let i = 0; i <= n; i++) {
				const u = i / n, p = EASE[s.ease || 'expo'](u), [x, y] = along(s.pts, p);
				const o = s.o ? s.o[0] + (s.o[1] - s.o[0]) * Math.min(1, u * (s.ofast || 1)) : undefined;
				kf.push(`${pct(s.t + u * s.dur)}{transform:translate(${f(x)}px,${f(y)}px)${o !== undefined ? `;opacity:${f(o)}` : ''}}`);
			}
		} else kf.push(`${pct(s.t)}{transform:translate(${f(s.x || 0)}px,${f(s.y || 0)}px)${s.o !== undefined ? `;opacity:${s.o}` : ''}}`);
	}
	CSS.push(`@keyframes ${name}{${kf.join('')}}`);
}
const CYCLE = 6000;

// ---- primitives ------------------------------------------------------------------------------
// A plate: rounded square of side w at plan origin (px, py), height z, thickness t. Radius 0.16 w (= the page's 12px cards at the loop's scale).
function plate({ px, py, z = 0, w, t = 10, r = w * 0.16, cls = '', ring = true, tiles = [] }) {
	const [sx, sy] = P(px, py, z);
	const out = [];
	const k = 1 / Math.SQRT2;
	// extreme screen-left / right points of the rounded square (corner arcs facing +-x screen)
	const L = P(px + r - r * k, py + w - r + r * k, z), R = P(px + w - r + r * k, py + r - r * k, z);
	for (const [a, b] of [[0, 0], [w, 0], [w, w], [0, w]]) { const q = P(px + a, py + b, z); grow(q[0], q[1] + t); }
	out.push(`<g class="fig-plate ${cls}">`);
	// underside (shifted down by t), then the two silhouette verticals, then the top face over them
	out.push(`<rect class="fig-side" ${NS} x="0" y="0" width="${w}" height="${w}" rx="${f(r)}" transform="${iso(sx, sy + t)}"/>`);
	out.push(`<path class="fig-line" ${NS} d="M${L[0]} ${L[1]}v${t}M${R[0]} ${R[1]}v${t}"/>`);
	out.push(`<rect class="fig-top" ${NS} x="0" y="0" width="${w}" height="${w}" rx="${f(r)}" transform="${iso(sx, sy)}"/>`);
	if (ring) out.push(`<circle class="fig-ring" ${NS} cx="${w / 2}" cy="${w / 2}" r="${f(w * 0.33)}" transform="${iso(sx, sy)}"/>`);
	for (const tl of tiles) out.push(tile({ px: px + tl.u * w, py: py + tl.v * w, z }));
	// the rim that lights on arrival (opacity 0 at rest; animated where a build arrives)
	out.push(`<rect class="fig-flash" ${NS} x="0" y="0" width="${w}" height="${w}" rx="${f(r)}" transform="${iso(sx, sy)}"/>`);
	out.push('</g>');
	return out.join('');
}
// A small tile sitting on a plate (centre at plan px, py), side s. Lifted 1.5 (was 3) so it hugs the face.
function tile({ px, py, z, s = 14 }) {
	const [sx, sy] = P(px - s / 2, py - s / 2, z + 1.5);
	return `<rect class="fig-tile" ${NS} x="0" y="0" width="${s}" height="${s}" rx="${f(s * 0.26)}" transform="${iso(sx, sy)}"/>`;
}
// A solid cube (the build), base centre at plan (px, py, z), edge e. A2: a silhouette underlay in the darkest
// face colour is drawn first, so no shared face edge antialiases against the stage.
function cube({ px, py, z = 0, e = 16, cls = '' }) {
	const h = e / 2;
	const p = (x, y, zz) => P(px + x, py + y, z + zz).join(' ');
	const top = `M${p(-h, -h, e)}L${p(h, -h, e)}L${p(h, h, e)}L${p(-h, h, e)}Z`;
	const left = `M${p(-h, h, e)}L${p(h, h, e)}L${p(h, h, 0)}L${p(-h, h, 0)}Z`;
	const right = `M${p(h, -h, e)}L${p(h, h, e)}L${p(h, h, 0)}L${p(h, -h, 0)}Z`;
	const sil = `M${p(-h, -h, e)}L${p(h, -h, e)}L${p(h, -h, 0)}L${p(h, h, 0)}L${p(-h, h, 0)}L${p(-h, h, e)}Z`;
	return `<g class="fig-cube ${cls}"><path class="fig-cube-s" d="${sil}"/><path class="fig-cube-l" d="${left}"/><path class="fig-cube-r" d="${right}"/><path class="fig-cube-t" d="${top}"/></g>`;
}
// An outlined (not yet built / queued) cube.
function ghost({ px, py, z = 0, e = 16, cls = '' }) {
	const h = e / 2;
	const p = (x, y, zz) => P(px + x, py + y, z + zz).join(' ');
	const dd = `M${p(-h, -h, e)}L${p(h, -h, e)}L${p(h, h, e)}L${p(-h, h, e)}Z M${p(-h, h, e)}L${p(-h, h, 0)}L${p(h, h, 0)}L${p(h, -h, 0)}L${p(h, -h, e)} M${p(h, h, e)}L${p(h, h, 0)}`;
	return `<path class="fig-ghost ${cls}" ${NS} d="${dd}"/>`;
}
// A flight of stairs between two plates (FIGS r2 redraw). Plan axis = -y (the climb runs up-right on screen).
// ONE GRID: the riser equals the plate thickness T and the tread depth equals the riser, so every step is a
// 10 x 10 cell of the same lattice the plates sit on; the upper plate's own front face is the last riser.
// Each step is a solid block (tread on top, riser facing the climber); the right-hand side is one stepped
// profile polygon whose underside runs T below the nosing line (a floating flight, as thick as a plate),
// from the near plate's top face up to the far plate's underside.
// Painter's order: far step first; the side profile last (it never overlaps a riser, x-ranges are disjoint).
function stairs({ x0, y0, z0, n, wd = SW }) {
	const xa = x0 - wd / 2, xb = x0 + wd / 2, out = [];
	const poly = (pts) => `M${pts.map((q) => P(...q).join(' ')).join('L')}Z`;
	for (let i = n - 1; i >= 0; i--) {
		const yf = y0 - i * T, yb = y0 - (i + 1) * T, zt = z0 + (i + 1) * T;
		out.push(`<path class="fig-st-top" ${NS} d="${poly([[xa, yb, zt], [xb, yb, zt], [xb, yf, zt], [xa, yf, zt]])}"/>`);
		out.push(`<path class="fig-st-side" ${NS} d="${poly([[xa, yf, zt], [xb, yf, zt], [xb, yf, zt - T], [xa, yf, zt - T]])}"/>`);
	}
	const WA = 3; // underside: parallel to the nosing line with a 3-unit waist under each inner corner, cut on the near plate's top face (AD r1 #1, r2 #4)
	const prof = [[xb, y0, z0]];
	for (let i = 0; i < n; i++) prof.push([xb, y0 - i * T, z0 + (i + 1) * T], [xb, y0 - (i + 1) * T, z0 + (i + 1) * T]);
	
	prof.push([xb, y0 - n * T, z0 + n * T - WA], [xb, y0 - WA, z0]);
	out.push(`<path class="fig-st-side" ${NS} d="${poly(prof)}"/>`);
	return `<g class="fig-stairs">${out.join('')}</g>`;
}
// A measurement ring of plan radius r, in a <g> so a CSS scale never replaces the iso matrix on the circle (A5).
function ring({ px, py, z, r, cls, dash = false }) {
	const [sx, sy] = P(px, py, z + 1);
	for (const q of [[r, 0], [-r, 0], [0, r], [0, -r]]) P(px + q[0], py + q[1], z);
	return `<g class="${cls}"><circle class="fig-pulse${dash ? ' fig-dash' : ''}" ${NS} r="${r}" transform="${iso(sx, sy)}"/></g>`;
}
function label(x, y, text, cls = '', cw = 14.5) { grow(x + text.length * cw + 14, y - 14); return `<text class="fig-label ${cls}" x="${f(x)}" y="${f(y)}">${text}</text>`; }

function begin() { BB = [Infinity, Infinity, -Infinity, -Infinity]; }
function svg(name, _vb, body, extra = '') {
	const pad = 6;
	// loop figures share one frame (300 x 240), centred and standing on one baseline, so the five sit in a
	// row like plates on a shelf; the staircases and the graph are cropped to their own box.
	const vb = _vb === 'shelf'
		? `${f((BB[0] + BB[2]) / 2 - 150)} ${f(BB[3] + pad - 240)} 300 240`
		: `${f(BB[0] - pad)} ${f(BB[1] - pad)} ${f(BB[2] - BB[0] + 2 * pad)} ${f(BB[3] - BB[1] + 2 * pad)}`;
	BB = null;
	const html = `{{/* GENERATED by scripts/landing-figs.mjs — edit the generator, not this file. */}}\n<svg class="fig fig-${name}" viewBox="${vb}" ${extra} aria-hidden="true" focusable="false">${body}</svg>\n`;
	writeFileSync(join(OUT, `${name}.html`), html);
	console.log('wrote', name);
}

// ---- one grid, one cube, one projection (FIGS r2 redraw) ----------------------------------------
// Every figure is drawn on one plan lattice of T = 10 units: plates are 100 x 100 x 10, a step is 10 x 10 x 10,
// a level is 4 risers (40), the gap between two plates is 3 treads (30). Every build is the same 16-unit cube
// (the release queue, the gate, the climb, health and the staircase all share it). Posts and bars stand on
// a plate's top face (z = 0) and are vertical in plan, so they read as standing, not floating.
const W = 100, T = 10, E = 16, SW = 36, NB = 3, LZ = (NB + 1) * T, GAP = NB * T, LVL = W + GAP;
const T4 = [{ u: .5, v: .17 }, { u: .83, v: .5 }, { u: .5, v: .83 }, { u: .17, v: .5 }];
// the climb, as a polyline of cube-base points in plan: plate centre -> stair foot -> the nosing line (z rises
// one unit per unit of travel, so the cube's front-bottom edge rides the step nosings) -> next plate centre.
// The cube (16) is 6 longer than the tread (10), so at yc = 8 - k*10 its base sits exactly on step k's tread.
const climb = (cx, py, z) => [[cx, py + W / 2, z], [cx, py + E / 2, z], [cx, py + E / 2 - LZ, z + LZ], [cx, py - GAP - W / 2, z + LZ]];
const scr = (A, pts) => pts.map((q) => d(A, P(...q)));
{
	// release: "a new version arrives". The builds wait in a queue in the air; the front one drops onto
	// the plate and the queue steps down. Rest pose: front build hovering, dotted drop, two ghosts.
	begin(); const cx = W / 2, cy = W / 2; let b = plate({ px: 0, py: 0, w: W, tiles: T4 });
	const land = P(cx, cy, 0), hover = P(cx, cy, 56), g1 = P(cx, cy - 30, 84), g2 = P(cx, cy - 60, 112); // lowered 8: headroom (AD r2 #3) // one straight queue, equal steps (AD r1 #3)
	b += `<path class="fig-drop" ${NS} d="M${P(cx, cy, 4).join(' ')}L${P(cx, cy, 52).join(' ')}"/>`;
	b += `<g class="m m-rel-g2">${ghost({ px: cx, py: cy - 60, z: 112, e: E })}</g>`;
	b += `<g class="m m-rel-g3">${ghost({ px: cx, py: cy - 60, z: 112, e: E })}</g>`;
	b += `<g class="m m-rel-g1">${ghost({ px: cx, py: cy - 30, z: 84, e: E })}</g>`;
	b += `<g class="m m-rel-next">${cube({ px: cx, py: cy - 30, z: 84, e: E })}</g>`;
	b += `<g class="m m-rel-cube">${cube({ px: cx, py: cy, z: 56, e: E })}</g>`;
	const fall = d(hover, land), up1 = d(g1, hover), up2 = d(g2, g1);
	track('rel-cube', CYCLE, [{ t: 0, o: 1 }, { t: 0, dur: 320, pts: [[0, 0], fall], ease: 'fall' }, { t: 5500, x: fall[0], y: fall[1], o: 1 }, { t: 5700, x: fall[0], y: fall[1], o: 0 }, { t: 5999, x: fall[0], y: fall[1], o: 0 }, { t: 6000, o: 1 }]);
	track('rel-next', CYCLE, [{ t: 0, o: 0 }, { t: 520, o: 0 }, { t: 520, dur: 434, pts: [[0, 0], up1], o: [0, 1], ofast: 2 }, { t: 5999, x: up1[0], y: up1[1], o: 1 }, { t: 6000, o: 0 }]);
	track('rel-g1', CYCLE, [{ t: 0, o: 1 }, { t: 520, o: 1 }, { t: 520, dur: 434, pts: [[0, 0], up1], o: [1, 0], ofast: 2 }, { t: 5999, x: up1[0], y: up1[1], o: 0 }, { t: 6000, o: 1 }]);
	track('rel-g2', CYCLE, [{ t: 0 }, { t: 600 }, { t: 600, dur: 434, pts: [[0, 0], up2] }, { t: 5999, x: up2[0], y: up2[1] }, { t: 6000 }]);
	track('rel-g3', CYCLE, [{ t: 0, o: 0 }, { t: 760, o: 0 }, { t: 960, o: 1 }, { t: 5999, o: 1 }, { t: 6000, o: 0 }]);
	CSS.push('@keyframes rel-flash{0%,5.2%{opacity:0}5.4%{opacity:1}16%,100%{opacity:0}}'); // lands at 320 ms; 660 ms fade
	svg('release', 'shelf', b);
}
{
	// guard: "the environment is checked before anything lands". The fence lies on the plate's underside
	// plane (the ground the plate stands on), one grid cell out and concentric; a scan runs once round it,
	// then the check is drawn and held. Rest: check drawn.
	begin(); let b = '';
	const o = 1.4 * T, fw = W + 2 * o;
	const [sx, sy] = P(-o, -o, -T); P(W + o, -o, -T); P(-o, W + o, -T); P(W + o, W + o, -T);
	const fence = `width="${fw}" height="${fw}" rx="${f(W * 0.16 + o)}" transform="${iso(sx, sy)}"`;
	b += `<rect class="fig-fence" ${NS} x="0" y="0" ${fence}/>`;
	b += `<rect class="fig-scan" pathLength="100" x="0" y="0" ${fence}/>`; // no non-scaling-stroke: pathLength must be honoured
	b += plate({ px: 0, py: 0, w: W, tiles: T4 });
	const [cx, cy] = P(W / 2, W / 2, 30);
	b += `<path class="fig-check" pathLength="1" d="M${f(cx - 10)} ${f(cy)}l7 7l14 -15"/>`;
	CSS.push('@keyframes scan{0%{opacity:0;stroke-dashoffset:0}0.3%{opacity:1;stroke-dashoffset:0}9%{opacity:1;stroke-dashoffset:-100}10%,100%{opacity:0;stroke-dashoffset:-100}}');
	CSS.push('@keyframes check{0%,9%{stroke-dashoffset:1;opacity:1}13%{stroke-dashoffset:0}73.3%{stroke-dashoffset:0;opacity:1}76.7%,100%{stroke-dashoffset:0;opacity:0}}');
	svg('guard', 'shelf', b);
}
// two environments, one level apart (gates, update): far plate, the stairs, near plate (painter's order)
function twoPlates() {
	return plate({ px: 0, py: -LVL, z: LZ, w: W, tiles: [{ u: .5, v: .2 }, { u: .2, v: .5 }, { u: .8, v: .5 }], cls: 'fig-up' })
		+ stairs({ x0: W / 2, y0: 0, z0: 0, n: NB })
		+ plate({ px: 0, py: 0, w: W, tiles: [{ u: .2, v: .5 }, { u: .5, v: .8 }, { u: .8, v: .5 }] });
}
{
	// gates: "your gate decides which version may go now". Two posts stand on the near plate's top face at
	// the stair foot, straddling the flight (stair half-width + 4); the dashed bar (the only "yours" mark)
	// spans them. The bar lifts, the waiting build moves into the gateway, the gate drops back,
	// the next build arrives. Posts and bar stand in front of or behind the build by plan depth (x + y).
	begin(); let b = twoPlates();
	// Gate r3 (legible at 1440): the posts are solid pillars of the plate's own material (6 x 6, 30 tall, a teal
	// cap = "yours"), 3 outside the flight; the bar is the 2-unit answer weight, dashed 4/3, on a ground-coloured
	// knock-out so it reads in front of the stair lines it crosses.
	const gx = SW / 2 + 6, gy = 6, pw = 3, ph = 30, bz = 22;
	const wait = [W / 2, 40, 0], A = P(...wait);
	const post = (x) => {
		const q = (a, c, z) => P(x + a, gy + c, z).join(' ');
		return `<path class="fig-post-l" ${NS} d="M${q(-pw, pw, ph)}L${q(pw, pw, ph)}L${q(pw, pw, 0)}L${q(-pw, pw, 0)}Z"/>`
			+ `<path class="fig-post-r" ${NS} d="M${q(pw, -pw, ph)}L${q(pw, pw, ph)}L${q(pw, pw, 0)}L${q(pw, -pw, 0)}Z"/>`
			+ `<path class="fig-post-t" ${NS} d="M${q(-pw, -pw, ph)}L${q(pw, -pw, ph)}L${q(pw, pw, ph)}L${q(-pw, pw, ph)}Z"/>`;
	};
	// painter's order: left post (behind the build, smaller x + y), build, bar, right post (in front of both)
	b += `<g class="fig-posts">${post(W / 2 - gx)}</g>`;
	b += `<g class="m m-gate-cube">${cube({ px: wait[0], py: wait[1], z: 0, e: E })}</g>`;
	const bar = `M${P(W / 2 - gx + pw, gy, bz).join(' ')}L${P(W / 2 + gx - pw, gy, bz).join(' ')}`;
	b += `<g class="m m-gate-bar"><path class="fig-bar-ko" ${NS} d="${bar}"/><path class="fig-gate fig-dash" ${NS} d="${bar}"/></g>`;
	b += `<g class="fig-posts">${post(W / 2 + gx)}</g>`; // after the bar: its near face hides the bar's end (AD r3 #1)
	const c = climb(W / 2, 0, 0); // the build stops inside the gateway, on the plate (AD r2 #2); climbing is Fig 4's job
	const path = scr(A, [wait, c[1]]), up = path[1];
	track('gate-bar', CYCLE, [{ t: 0, o: 1 }, { t: 0, x: 0, y: 0 }, { t: 240, x: 0, y: -8, o: 0 }, { t: 3500, x: 0, y: -8, o: 0 }, { t: 3740, x: 0, y: 0, o: 1 }, { t: 6000, o: 1 }]);
	track('gate-cube', CYCLE, [{ t: 0, o: 1 }, { t: 160, o: 1 }, { t: 160, dur: 700, pts: path, o: [1, 1], ease: 'calm' }, { t: 3300, x: up[0], y: up[1], o: 1 }, { t: 3500, x: up[0], y: up[1], o: 0 }, { t: 3600, o: 0 }, { t: 3800, o: 1 }, { t: 6000, o: 1 }]);
	svg('gates', 'shelf', b);
}
{
	// update: "it reaches the next environment". One continuous climb, plate centre -> stair foot -> up the
	// nosing line -> next plate centre (EXPO sampled over the polyline); the upper plate's rim answers.
	// Rest pose (reduced motion / before live): arrived on the next plate, from --rest emitted here.
	begin(); let b = twoPlates();
	const c = climb(W / 2, 0, 0), A = P(...c[0]);
	const rest = d(A, P(...c[3])); // arrived on the upper plate: a cube perched across two treads read as wonky (AD r2 #2)
	b += `<g class="m m-upd-cube" style="--rest:translate(${rest[0]}px,${rest[1]}px)">${cube({ px: c[0][0], py: c[0][1], z: 0, e: E })}</g>`;
	const path = scr(A, c), end = path[3];
	track('upd-cube', CYCLE, [{ t: 0, o: 1 }, { t: 0, dur: 800, pts: path, o: [1, 1], ease: 'calm' }, { t: 2200, x: end[0], y: end[1], o: 1 }, { t: 2400, x: end[0], y: end[1], o: 0 }, { t: 2500, o: 0 }, { t: 2700, o: 1 }, { t: 6000, o: 1 }]);
	CSS.push('@keyframes upd-flash{0%,11.6%{opacity:0}11.7%{opacity:1}22.7%{opacity:0}100%{opacity:0}}'); // arrival ~700 ms (800 ms calm), 660 ms fade
	svg('update', 'shelf', b);
}
{
	// health: "did it actually work: the plate answers". The measurement goes out twice from the build
	// (the second one dashed, the "yours" check); the inner ring stays. Rest: inner ring, ring A at r 23 .5, ring B r 46 .22.
	begin(); let b = plate({ px: 0, py: 0, w: W, tiles: T4, cls: 'is-healthy' });
	b += ring({ px: W / 2, py: W / 2, z: 0, r: 18, cls: 'fig-ring-rest' });
	b += ring({ px: W / 2, py: W / 2, z: 0, r: 46, cls: 'm m-hp1' });
	b += ring({ px: W / 2, py: W / 2, z: 0, r: 46, cls: 'm m-hp2', dash: true });
	b += cube({ px: W / 2, py: W / 2, e: E });
	CSS.push('@keyframes hp{0%{transform:scale(.36);opacity:0}4%{opacity:.9}15%{transform:scale(1);opacity:0}100%{transform:scale(1);opacity:0}}');
	svg('health', 'shelf', b);
}

// ---- the staircase: three environments on the same lattice; the build climbs dev -> staging -> production
// (plays ONCE). k = keyframe/class prefix ('st' wide, 'stc' compact; same drawing, the compact one has no
// labels). Rest = the finished picture: the build in every environment, production lit.
function staircase(name, k, { labels }) {
	begin(); let b = '';
	const E3 = [0, 1, 2].map((i) => ({ py: -i * LVL, z: i * LZ, label: ['development', 'staging', 'production'][i] }));
	const tl = [{ u: .17, v: .5 }, { u: .83, v: .5 }];
	for (let i = 2; i >= 0; i--) {
		const en = E3[i];
		b += plate({ px: 0, py: en.py, z: en.z, w: W, cls: i === 2 ? 'is-healthy' : '', tiles: tl });
		if (i === 2) { b += ring({ px: W / 2, py: en.py + W / 2, z: en.z, r: 18, cls: `fig-ring-rest ${k}-ring` }); b += ring({ px: W / 2, py: en.py + W / 2, z: en.z, r: 44, cls: `m m-${k}-pulse` }); }
		if (labels) { const [lx, ly] = P(W, en.py, en.z); b += label(lx + 12, ly + 6, en.label, 'fig-env', 7.4); }
		if (i > 0) b += stairs({ x0: W / 2, y0: E3[i - 1].py, z0: E3[i - 1].z, n: NB });
	}
	b += `<g class="m m-${k}-s">${cube({ px: W / 2, py: E3[1].py + W / 2, z: E3[1].z, e: E })}</g>`;
	b += `<g class="m m-${k}-p">${cube({ px: W / 2, py: E3[2].py + W / 2, z: E3[2].z, e: E })}</g>`;
	b += cube({ px: W / 2, py: W / 2, z: 0, e: E });
	b += `<g class="m m-${k}-t">${cube({ px: W / 2, py: W / 2, z: 0, e: E })}</g>`;
	const A = P(W / 2, W / 2, 0), leg = (i) => scr(A, climb(W / 2, E3[i].py, E3[i].z));
	const T42 = 4200, s1 = leg(0)[3], s2 = leg(1)[3];
	// hold 400 -> dev..staging 1000 -> hold 600 -> staging..prod 1000 -> prod pulse
	track(`${k}-t`, T42, [{ t: 0, o: 1 }, { t: 400, o: 1 }, { t: 400, dur: 1000, pts: leg(0), ease: 'calm' }, { t: 2000, x: s1[0], y: s1[1] }, { t: 2000, dur: 1000, pts: leg(1), ease: 'calm' }, { t: 4200, x: s2[0], y: s2[1] }]);
	CSS.push(`@keyframes ${k}-s{0%,33.3%{opacity:0}33.4%,100%{opacity:1}}@keyframes ${k}-p{0%,71.3%{opacity:0}71.4%,100%{opacity:1}}@keyframes ${k}-pulse{0%,71.4%{transform:scale(.4);opacity:0}74%{opacity:.9}92%,100%{transform:scale(1);opacity:0}}`);
	svg(name, '', b);
}
staircase('staircase-done', 'st', { labels: true });
staircase('staircase-done-compact', 'stc', { labels: false });

// The cube dependency graph left the page (landing v5 page: dependencies are one gate among six peers).

// ---- the stylesheet half: the keyframes the drawings above need ------------------------------------
// Written twice: the standalone file (the spec's artifact) and a marked block at the end of sections.css,
// because home.html concatenates only home.css + sections.css (the .gen.css file alone never reached the page).
const GEN = CSS.join('\n') + '\n';
writeFileSync(join(ROOT, 'assets', 'css', 'landing-figs.gen.css'),
	'/* GENERATED by scripts/landing-figs.mjs: keyframes for the landing figs. Waypoints come from the same P() that draws\n   the geometry (FIGS-SPEC A4); edit the generator, not this file. Attached in sections.css. */\n' + GEN);
const SEC = join(ROOT, 'assets', 'css', 'sections.css'), B0 = '/* BEGIN landing-figs keyframes (GENERATED by scripts/landing-figs.mjs, do not edit) */', B1 = '/* END landing-figs keyframes */';
let sec = readFileSync(SEC, 'utf8');
const i0 = sec.indexOf(B0), i1 = sec.indexOf(B1);
sec = i0 >= 0 ? sec.slice(0, i0) + B0 + '\n' + GEN + sec.slice(i1) : sec.replace(/\n*$/, '\n') + B0 + '\n' + GEN + B1 + '\n';
writeFileSync(SEC, sec);
console.log('wrote assets/css/landing-figs.gen.css + sections.css keyframes block');
