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
// Motion grammar = the hero's (railway-motion.md): EXPO moves 240-540 ms, fall 320 ms, 200 ms fades,
// holds >= 600 ms, one focal change at a time across the row (one 6 s clock, fig n bursts at n x 1100 ms).
import { writeFileSync, mkdirSync } from 'node:fs';
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
const EASE = { expo: bez(0.16, 1, 0.3, 1), fall: bez(0.55, 0, 1, 0.45) };
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
// A ramp between two plan points at two heights: two rails and treads.
function ramp({ a, b, za, zb, wd = 12, cls = '', treads = 6 }) {
	const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
	const nx = (-dy / len) * wd / 2, ny = (dx / len) * wd / 2;
	const pt = (t, side) => P(a[0] + dx * t + nx * side, a[1] + dy * t + ny * side, za + (zb - za) * t);
	const rail = (side) => `M${pt(0, side).join(' ')}L${pt(1, side).join(' ')}`;
	let tr = '';
	for (let i = 1; i < treads; i++) { const t = i / treads; tr += `M${pt(t, -1).join(' ')}L${pt(t, 1).join(' ')}`; }
	return `<g class="fig-ramp ${cls}"><path class="fig-rail" ${NS} d="${rail(-1)}${rail(1)}"/><path class="fig-tread" ${NS} d="${tr}"/></g>`;
}
// A measurement ring of plan radius r, in a <g> so a CSS scale never replaces the iso matrix on the circle (A5).
function ring({ px, py, z, r, cls, dash = false }) {
	const [sx, sy] = P(px, py, z + 1);
	for (const q of [[r, 0], [-r, 0], [0, r], [0, -r]]) P(px + q[0], py + q[1], z);
	return `<g class="${cls}"><circle class="fig-pulse${dash ? ' fig-dash' : ''}" ${NS} r="${r}" transform="${iso(sx, sy)}"/></g>`;
}
function label(x, y, text, cls = '', cw = 14.5) { grow(x + text.length * cw, y - 14); return `<text class="fig-label ${cls}" x="${f(x)}" y="${f(y)}">${text}</text>`; }

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

// ---- the five loop phases (one plate scale for all five) -----------------------------------------
const W = 100;
const T4 = [{ u: .5, v: .17 }, { u: .83, v: .5 }, { u: .5, v: .83 }, { u: .17, v: .5 }];
{
	// release: "a new version arrives". The builds wait in a queue in the air; the front one drops onto
	// the plate and the queue steps down. Rest pose: front build hovering, dotted drop, two ghosts.
	begin(); const cx = W / 2, cy = W / 2; let b = plate({ px: 0, py: 0, w: W, tiles: T4 });
	const land = P(cx, cy, 0), hover = P(cx, cy, 64), g1 = P(cx, cy - 30, 92), g2 = P(cx, cy - 56, 104);
	b += `<path class="fig-drop" ${NS} d="M${P(cx, cy, 4).join(' ')}L${P(cx, cy, 62).join(' ')}"/>`;
	b += `<g class="m m-rel-g2">${ghost({ px: cx, py: cy - 56, z: 104, e: 15 })}</g>`;
	b += `<g class="m m-rel-g3">${ghost({ px: cx, py: cy - 56, z: 104, e: 15 })}</g>`;
	b += `<g class="m m-rel-g1">${ghost({ px: cx, py: cy - 30, z: 92, e: 15 })}</g>`;
	b += `<g class="m m-rel-next">${cube({ px: cx, py: cy - 30, z: 92, e: 15 })}</g>`;
	b += `<g class="m m-rel-cube">${cube({ px: cx, py: cy, z: 64, e: 18 })}</g>`;
	const fall = d(hover, land), up1 = d(g1, hover), up2 = d(g2, g1);
	track('rel-cube', CYCLE, [{ t: 0, o: 1 }, { t: 0, dur: 320, pts: [[0, 0], fall], ease: 'fall' }, { t: 5300, x: fall[0], y: fall[1], o: 1 }, { t: 5500, x: fall[0], y: fall[1], o: 0 }, { t: 5999, x: fall[0], y: fall[1], o: 0 }, { t: 6000, o: 1 }]);
	track('rel-next', CYCLE, [{ t: 0, o: 0 }, { t: 520, o: 0 }, { t: 520, dur: 434, pts: [[0, 0], up1], o: [0, 1], ofast: 2 }, { t: 5999, x: up1[0], y: up1[1], o: 1 }, { t: 6000, o: 0 }]);
	track('rel-g1', CYCLE, [{ t: 0, o: 1 }, { t: 520, o: 1 }, { t: 520, dur: 434, pts: [[0, 0], up1], o: [1, 0], ofast: 2 }, { t: 5999, x: up1[0], y: up1[1], o: 0 }, { t: 6000, o: 1 }]);
	track('rel-g2', CYCLE, [{ t: 0 }, { t: 600 }, { t: 600, dur: 434, pts: [[0, 0], up2] }, { t: 5999, x: up2[0], y: up2[1] }, { t: 6000 }]);
	track('rel-g3', CYCLE, [{ t: 0, o: 0 }, { t: 760, o: 0 }, { t: 960, o: 1 }, { t: 5999, o: 1 }, { t: 6000, o: 0 }]);
	CSS.push('@keyframes rel-flash{0%,5.2%{opacity:0}5.4%{opacity:1}16%,100%{opacity:0}}'); // lands at 320 ms; 660 ms fade
	svg('release', 'shelf', b);
}
{
	// guard: "the environment is checked before anything lands". A scan runs once round the fence
	// (on the ground, concentric with the plate), then the check is drawn and held. Rest: check drawn.
	begin(); let b = '';
	const [sx, sy] = P(-14, -14, -10); P(W + 14, -14, -10); P(-14, W + 14, -10); P(W + 14, W + 14, -10);
	const fence = `width="${W + 28}" height="${W + 28}" rx="${f((W + 28) * .2)}" transform="${iso(sx, sy)}"`;
	b += `<rect class="fig-fence" ${NS} x="0" y="0" ${fence}/>`;
	b += `<rect class="fig-scan" pathLength="100" x="0" y="0" ${fence}/>`; // no non-scaling-stroke: pathLength must be honoured
	b += plate({ px: 0, py: 0, w: W, tiles: T4 });
	const [cx, cy] = P(W / 2, W / 2, 30);
	b += `<path class="fig-check" pathLength="1" d="M${f(cx - 10)} ${f(cy)}l7 7l14 -15"/>`;
	CSS.push('@keyframes scan{0%{opacity:0;stroke-dashoffset:0}0.3%{opacity:1;stroke-dashoffset:0}9%{opacity:1;stroke-dashoffset:-100}10%,100%{opacity:0;stroke-dashoffset:-100}}');
	CSS.push('@keyframes check{0%,9%{stroke-dashoffset:1;opacity:1}13%{stroke-dashoffset:0}50%{stroke-dashoffset:0;opacity:1}53.3%,100%{stroke-dashoffset:0;opacity:0}}');
	svg('guard', 'shelf', b);
}
// two environments, one step apart (gates, update)
const TW = 100, TG = 34, TZ = 46;
function twoPlates(rampCls) {
	return plate({ px: 0, py: -(TW + TG), z: TZ, w: TW, tiles: [{ u: .5, v: .2 }, { u: .2, v: .5 }, { u: .8, v: .5 }], cls: 'fig-up' })
		+ ramp({ a: [TW / 2, 0], b: [TW / 2, -TG], za: 0, zb: TZ, wd: 14, treads: 5, cls: rampCls })
		+ plate({ px: 0, py: 0, w: TW, tiles: [{ u: .2, v: .5 }, { u: .5, v: .8 }, { u: .8, v: .5 }] });
}
{
	// gates: "your gate decides which version may go now". The dashed bar (the only "yours" mark) lifts,
	// the waiting build goes through to mid-ramp, the gate drops back, the next build arrives.
	begin(); let b = twoPlates('is-idle');
	const gw = 7 + 12; // lane 23 (AD L11): the cube (half-width ~13 at e 14) passes BETWEEN the posts, which stand 12 outside the rails (they were 3: the cube overlapped its post)
	const g1 = P(TW / 2 - gw, 4, 0), g2 = P(TW / 2 + gw, 4, 0);
	b += `<path class="fig-gate" ${NS} d="M${g1[0]} ${g1[1]}v-36M${g2[0]} ${g2[1]}v-36"/>`;
	b += `<g class="m m-gate-bar"><path class="fig-gate fig-dash" ${NS} d="M${g1[0]} ${f(g1[1] - 28)}L${g2[0]} ${f(g2[1] - 28)}"/></g>`;
	const wait = P(TW / 2, 38, 0), foot = P(TW / 2, -2, 0), mid = P(TW / 2, -TG / 2, TZ / 2);
	b += `<g class="m m-gate-cube">${cube({ px: TW / 2, py: 38, e: 12 })}</g>`;
	const pass = d(wait, foot), up = d(wait, mid);
	track('gate-bar', CYCLE, [{ t: 0, o: 1 }, { t: 0, x: 0, y: 0 }, { t: 240, x: 0, y: -8, o: 0 }, { t: 1900, x: 0, y: -8, o: 0 }, { t: 2140, x: 0, y: 0, o: 1 }, { t: 6000, o: 1 }]);
	track('gate-cube', CYCLE, [{ t: 0, o: 1 }, { t: 160, o: 1 }, { t: 160, dur: 700, pts: [[0, 0], pass, up], o: [1, 1] }, { t: 1500, x: up[0], y: up[1], o: 1 }, { t: 1700, x: up[0], y: up[1], o: 0 }, { t: 2200, o: 0 }, { t: 2400, o: 1 }, { t: 6000, o: 1 }]);
	svg('gates', 'shelf', b);
}
{
	// update: "it reaches the next environment". One continuous climb, plate centre -> ramp foot -> ramp top
	// -> next plate centre (EXPO sampled over the polyline); the upper plate's rim answers.
	// Rest pose (reduced motion / before live): mid-ramp, from --rest emitted here.
	begin(); let b = twoPlates('is-active');
	const A = P(TW / 2, TW / 2, 0), foot = P(TW / 2, 0, 0), top = P(TW / 2, -TG, TZ), B = P(TW / 2, -TG - TW / 2, TZ), mid = P(TW / 2, -TG / 2, TZ / 2);
	const rest = d(A, mid);
	b += `<g class="m m-upd-cube" style="--rest:translate(${rest[0]}px,${rest[1]}px)">${cube({ px: TW / 2, py: TW / 2, e: 16 })}</g>`;
	const path = [[0, 0], d(A, foot), d(A, top), d(A, B)], end = d(A, B);
	track('upd-cube', CYCLE, [{ t: 0, o: 1 }, { t: 0, dur: 900, pts: path, o: [1, 1] }, { t: 2600, x: end[0], y: end[1], o: 1 }, { t: 2800, x: end[0], y: end[1], o: 0 }, { t: 2900, o: 0 }, { t: 3100, o: 1 }, { t: 6000, o: 1 }]);
	CSS.push('@keyframes upd-flash{0%,7.9%{opacity:0}8%{opacity:1}19%{opacity:0}100%{opacity:0}}'); // arrival ~480 ms (900 ms, 660 ms fade)
	svg('update', 'shelf', b);
}
{
	// health: "did it actually work: the plate answers". The measurement goes out twice from the build
	// (the second one dashed, the "yours" check); the inner ring stays. Rest: inner ring, ring A at r 23 .5, ring B r 46 .22.
	begin(); let b = plate({ px: 0, py: 0, w: W, tiles: T4, cls: 'is-healthy' });
	b += ring({ px: W / 2, py: W / 2, z: 0, r: 18, cls: 'fig-ring-rest' });
	b += ring({ px: W / 2, py: W / 2, z: 0, r: 46, cls: 'm m-hp1' });
	b += ring({ px: W / 2, py: W / 2, z: 0, r: 46, cls: 'm m-hp2', dash: true });
	b += cube({ px: W / 2, py: W / 2, e: 18 });
	CSS.push('@keyframes hp{0%{transform:scale(.36);opacity:0}4%{opacity:.9}15%{transform:scale(1);opacity:0}100%{transform:scale(1);opacity:0}}');
	svg('health', 'shelf', b);
}

// ---- the staircase: three environments; the build climbs dev -> staging -> production (plays ONCE) ----
// k = keyframe/class prefix ('st' wide, 'stc' compact). Rest = the finished picture: the build in every
// environment, production lit.
function staircase(name, k, { w, step, gap, wd, treads, e, rest, pulse, labels }) {
	begin(); let b = '';
	const E = [0, 1, 2].map((i) => ({ px: 0, py: -i * (w + gap), z: i * step, label: ['development', 'staging', 'production'][i] }));
	for (let i = 2; i >= 0; i--) {
		const en = E[i];
		if (i < 2) { const n = E[i + 1]; b += ramp({ a: [w / 2, en.py], b: [w / 2, n.py + w], za: en.z, zb: n.z, wd, treads, cls: 'is-active' }); }
		b += plate({ px: 0, py: en.py, z: en.z, w, t: w > 120 ? 12 : 10, cls: i === 2 ? 'is-healthy' : '', tiles: T4 });
		if (i === 2) { b += ring({ px: w / 2, py: en.py + w / 2, z: en.z, r: rest, cls: `fig-ring-rest ${k}-ring` }); b += ring({ px: w / 2, py: en.py + w / 2, z: en.z, r: pulse, cls: `m m-${k}-pulse` }); }
		if (labels) { const [lx, ly] = P(w, en.py, en.z); b += label(lx + 16, ly + 10, en.label, 'fig-env'); }
	}
	b += `<g class="m m-${k}-s">${cube({ px: w / 2, py: E[1].py + w / 2, z: E[1].z, e })}</g>`;
	b += `<g class="m m-${k}-p">${cube({ px: w / 2, py: E[2].py + w / 2, z: E[2].z, e })}</g>`;
	b += cube({ px: w / 2, py: w / 2, z: 0, e });
	b += `<g class="m m-${k}-t">${cube({ px: w / 2, py: w / 2, z: 0, e })}</g>`;
	const c = (i) => P(w / 2, E[i].py + w / 2, E[i].z), ft = (i) => P(w / 2, E[i].py, E[i].z), tp = (i) => P(w / 2, E[i + 1].py + w, E[i + 1].z);
	const A = c(0), leg = (i) => [d(A, c(i)), d(A, ft(i)), d(A, tp(i)), d(A, c(i + 1))];
	const T = 4200, s1 = d(A, c(1)), s2 = d(A, c(2));
	// hold 400 -> dev..staging 1000 -> hold 600 -> staging..prod 1000 -> prod pulse
	track(`${k}-t`, T, [{ t: 0, o: 1 }, { t: 400, o: 1 }, { t: 400, dur: 1000, pts: leg(0) }, { t: 2000, x: s1[0], y: s1[1] }, { t: 2000, dur: 1000, pts: leg(1) }, { t: 4200, x: s2[0], y: s2[1] }]);
	CSS.push(`@keyframes ${k}-s{0%,33.3%{opacity:0}33.4%,100%{opacity:1}}@keyframes ${k}-p{0%,71.3%{opacity:0}71.4%,100%{opacity:1}}@keyframes ${k}-pulse{0%,71.4%{transform:scale(.4);opacity:0}74%{opacity:.9}92%,100%{transform:scale(1);opacity:0}}`);
	svg(name, '', b);
}
// labels 24 units (13 px rendered at 0.54), A10
staircase('staircase-done', 'st', { w: 150, step: 46, gap: 96, wd: 16, treads: 7, e: 22, rest: 26, pulse: 64, labels: true });
staircase('staircase-done-compact', 'stc', { w: 110, step: 34, gap: 70, wd: 14, treads: 5, e: 20, rest: 22, pulse: 44, labels: false });

// ---- the dependency graph: four services, one environment ---------------------------------------
// checkout-api's new build needs payments-svc 3.0.0, which is still rolling out here: the build waits at the
// (dashed, yours) gate on that one edge. checkout-worker needs nothing new and is not held; storefront is at
// rest. The copy beside it says exactly this. Motion: payments-svc answers (the health pulse, once per 6 s).
function depsGraph(name, { compact = false } = {}) {
	begin(); const w = 120, g = compact ? 70 : 96, gv = 120; let b = '';
	const N = compact ? {
		pay: { px: 0, py: 0, label: 'payments-svc', v: '3.1.0 rolling out' },
		api: { px: w + g, py: w + g, label: 'checkout-api', v: '4.46.0-46 waiting' },
	} : {
		pay: { px: 0, py: 0, label: 'payments-svc', v: '3.1.0 rolling out' },
		api: { px: 0, py: -(w + gv), label: 'checkout-api', v: '4.46.0-46 waiting' }, // A7: only the waiting edge is widened
		work: { px: w + g, py: 0, label: 'checkout-worker', v: '2.8.1 not held' },
		front: { px: w + g, py: -(w + gv), label: 'storefront', v: '1.12.0' },
	};
	const wd = 12;
	const edge = (a, c, cls) => ramp({ a, b: c, za: 0, zb: 0, wd, treads: 6, cls });
	const T2 = [{ u: .2, v: .5 }, { u: .8, v: .5 }];
	const wait = compact
		? [[N.pay.px + w, N.pay.py + w / 2], [N.api.px, N.api.py + w / 2]]
		: [[N.pay.px + w / 2, N.pay.py], [N.api.px + w / 2, N.api.py + w]];
	if (!compact) {
		b += plate({ px: N.api.px, py: N.api.py, w, t: 10, tiles: T2 });
		b += plate({ px: N.front.px, py: N.front.py, w, t: 10, tiles: T2 });
		b += edge([N.api.px + w, N.api.py + w / 2], [N.front.px, N.front.py + w / 2], 'is-idle');
		b += edge([N.work.px + w / 2, N.work.py], [N.front.px + w / 2, N.front.py + w], 'is-idle');
	}
	b += edge(wait[0], wait[1], 'is-active');
	b += plate({ px: N.pay.px, py: N.pay.py, w, t: 10, cls: 'is-healthy', tiles: T2 });
	if (!compact) {
		b += plate({ px: N.work.px, py: N.work.py, w, t: 10, tiles: T2 });
		b += edge([N.pay.px + w, N.pay.py + w / 2], [N.work.px, N.work.py + w / 2], 'is-idle');
	} else {
		b += plate({ px: N.api.px, py: N.api.py, w, t: 10, tiles: T2 });
	}
	// gate: posts and a dashed bar across the waiting edge; the held build before it (A7: half-width = edge + 3,
	// gate at .58, build at .30, posts 20 tall, bar at 14)
	const ex = wait[1][0] - wait[0][0], ey = wait[1][1] - wait[0][1], L = Math.hypot(ex, ey);
	const gh = wd / 2 + 3, nx = -ey / L * gh, ny = ex / L * gh;
	const mx = wait[0][0] + ex * .58, my = wait[0][1] + ey * .58;
	{
		const a = P(mx + nx, my + ny), c = P(mx - nx, my - ny);
		b += `<path class="fig-gate" ${NS} d="M${a[0]} ${a[1]}v-20M${c[0]} ${c[1]}v-20"/><path class="fig-gate fig-dash" ${NS} d="M${a[0]} ${f(a[1] - 14)}L${c[0]} ${f(c[1] - 14)}"/>`;
	}
	b += cube({ px: wait[0][0] + ex * .30, py: wait[0][1] + ey * .30, e: 18 });
	// A8: outer ring <= 0.4 w; animated like health (the rest ring stays)
	b += ring({ px: N.pay.px + w / 2, py: N.pay.py + w / 2, z: 0, r: 24, cls: 'fig-ring-rest' });
	b += ring({ px: N.pay.px + w / 2, py: N.pay.py + w / 2, z: 0, r: 46, cls: 'm m-dp' });
	b += cube({ px: N.pay.px + w / 2, py: N.pay.py + w / 2, e: 22 });
	b += ghost({ px: N.api.px + w / 2, py: N.api.py + w / 2, e: 20 });
	if (!compact) {
		b += cube({ px: N.work.px + w / 2, py: N.work.py + w / 2, e: 20 });
		b += cube({ px: N.front.px + w / 2, py: N.front.py + w / 2, e: 20 });
	}
	for (const n of Object.values(N)) {
		// every label at the same place relative to its plate: right of the plate's right corner
		const [lx, ly] = P(n.px + w, n.py, 0);
		const ox = 16, oy = 2;
		// compact: 16 / 15 units at 0.82 scale = 13 / 12.3 px (A10); wide: 15 / 14 units (see sections.css)
		const cw = 9.6; // reserve for 16-unit labels (the widest step, see sections.css)
		b += label(lx + ox, ly + oy, n.label, 'fig-env', cw);
		b += label(lx + ox, ly + oy + (compact ? 22 : 21), n.v, /waiting/.test(n.v) ? 'fig-sub is-waiting' : 'fig-sub', cw * .94);
	}
	svg(name, '', b);
}
depsGraph('dependencies');
depsGraph('dependencies-compact', { compact: true });

// ---- the stylesheet half: the keyframes the drawings above need ------------------------------------
writeFileSync(join(ROOT, 'assets', 'css', 'landing-figs.gen.css'),
	'/* GENERATED by scripts/landing-figs.mjs: keyframes for the landing figs. Waypoints come from the same P() that draws\n   the geometry (FIGS-SPEC A4); edit the generator, not this file. Attached in sections.css. */\n' + CSS.join('\n') + '\n');
console.log('wrote assets/css/landing-figs.gen.css');
