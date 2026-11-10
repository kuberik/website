// Generates the landing page's isometric line drawings (the "FIG" set and the
// hero/closing staircase) into layouts/_partials/landing-figs/*.html.
//
//   node scripts/landing-figs.mjs
//
// ONE OBJECT, ONE LANGUAGE (owner rule, film and page): every drawing is the
// environment plate from the film in a state — at rest, a build waiting at a
// gate, a build rising to the next environment, a plate glowing healthy. The
// colours are classes, not values (landing.css `.fig*`), so both themes are
// drawn by the stylesheet and nothing here knows about light or dark.
//
// Geometry: true isometric (30°). A plate is a rounded square drawn in plan
// coordinates under the iso matrix; strokes use non-scaling-stroke so a 1px
// line stays 1px after the shear. Top faces are filled with the ground colour
// so they occlude what is behind them; that is the whole hidden-line model.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'layouts', '_partials', 'landing-figs');
mkdirSync(OUT, { recursive: true });

const C = Math.cos(Math.PI / 6), S = 0.5;
const f = (n) => +n.toFixed(2);
// plan (x, y, z) -> screen
let BB = null; // running screen-space bounding box of the figure being drawn
const grow = (X, Y) => { if (!BB) return; BB[0] = Math.min(BB[0], X); BB[1] = Math.min(BB[1], Y); BB[2] = Math.max(BB[2], X); BB[3] = Math.max(BB[3], Y); };
const P = (x, y, z = 0) => { const X = f((x - y) * C), Y = f((x + y) * S - z); grow(X, Y); return [X, Y]; };
const iso = (ox, oy) => `matrix(${f(C)} ${S} ${f(-C)} ${S} ${f(ox)} ${f(oy)})`;
const NS = 'vector-effect="non-scaling-stroke"';

// A plate: rounded square of side w at plan origin (px, py), height z, thickness t.
function plate({ px, py, z = 0, w, t = 10, r = w * 0.13, cls = '', ring = true, tiles = [], dash = false }) {
	const [sx, sy] = P(px, py, z);
	const out = [];
	const k = 1 / Math.SQRT2;
	// extreme screen-left / right points of the rounded square (corner arcs facing ±x screen)
	const L = P(px + r - r * k, py + w - r + r * k, z), R = P(px + w - r + r * k, py + r - r * k, z);
	for (const [a, b] of [[0, 0], [w, 0], [w, w], [0, w]]) { P(px + a, py + b, z); const q = P(px + a, py + b, z); grow(q[0], q[1] + t); }
	out.push(`<g class="fig-plate ${cls}">`);
	// underside (shifted down by t), then the two silhouette verticals, then the top face over them
	out.push(`<rect class="fig-side" ${NS} x="0" y="0" width="${w}" height="${w}" rx="${f(r)}" transform="${iso(sx, sy + t)}"/>`);
	out.push(`<path class="fig-line" ${NS} d="M${L[0]} ${L[1]}v${t}M${R[0]} ${R[1]}v${t}"/>`);
	out.push(`<rect class="fig-top${dash ? ' fig-dash' : ''}" ${NS} x="0" y="0" width="${w}" height="${w}" rx="${f(r)}" transform="${iso(sx, sy)}"/>`);
	if (ring) out.push(`<circle class="fig-ring" ${NS} cx="${w / 2}" cy="${w / 2}" r="${f(w * 0.33)}" transform="${iso(sx, sy)}"/>`);
	for (const tl of tiles) out.push(tile({ ...tl, px: px + tl.u * w, py: py + tl.v * w, z }));
	out.push('</g>');
	return out.join('');
}
// A small tile sitting on a plate (u, v in 0..1 of the plate), side s.
function tile({ px, py, z, s = 14, cls = '' }) {
	const [sx, sy] = P(px - s / 2, py - s / 2, z + 3);
	return `<rect class="fig-tile ${cls}" ${NS} x="0" y="0" width="${s}" height="${s}" rx="${f(s * 0.26)}" transform="${iso(sx, sy)}"/>`;
}
// A solid cube (the build) with its base centre at plan (px, py, z), edge e.
function cube({ px, py, z = 0, e = 16, cls = '' }) {
	const h = e / 2;
	const p = (x, y, zz) => P(px + x, py + y, z + zz).join(' ');
	const top = `M${p(-h, -h, e)}L${p(h, -h, e)}L${p(h, h, e)}L${p(-h, h, e)}Z`;
	const left = `M${p(-h, h, e)}L${p(h, h, e)}L${p(h, h, 0)}L${p(-h, h, 0)}Z`;
	const right = `M${p(h, -h, e)}L${p(h, h, e)}L${p(h, h, 0)}L${p(h, -h, 0)}Z`;
	return `<g class="fig-cube ${cls}"><path class="fig-cube-l" d="${left}"/><path class="fig-cube-r" d="${right}"/><path class="fig-cube-t" d="${top}"/></g>`;
}
// An outlined (not yet built / queued) cube.
function ghost({ px, py, z = 0, e = 16, cls = '' }) {
	const h = e / 2;
	const p = (x, y, zz) => P(px + x, py + y, z + zz).join(' ');
	const d = `M${p(-h, -h, e)}L${p(h, -h, e)}L${p(h, h, e)}L${p(-h, h, e)}Z M${p(-h, h, e)}L${p(-h, h, 0)}L${p(h, h, 0)}L${p(h, -h, 0)}L${p(h, -h, e)} M${p(h, h, e)}L${p(h, h, 0)}`;
	return `<path class="fig-ghost ${cls}" ${NS} d="${d}"/>`;
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
function pulse({ px, py, z, rs = [18, 30, 44], cls = '' }) {
	for (const r of rs) { P(px - r, py, z); P(px + r, py, z); P(px, py - r, z); P(px, py + r, z); }
	return rs.map((r, i) => { const [sx, sy] = P(px, py, z + 1); return `<circle class="fig-pulse fig-pulse-${i + 1} ${cls}" ${NS} cx="0" cy="0" r="${r}" transform="${iso(sx, sy)}"/>`; }).join('');
}
function label(x, y, text, cls = '', cw = 8.6) { grow(x + text.length * cw, y - 12); return `<text class="fig-label ${cls}" x="${f(x)}" y="${f(y)}">${text}</text>`; }

function begin() { BB = [Infinity, Infinity, -Infinity, -Infinity]; }
function svg(name, _vb, body, extra = '') {
	const pad = 6;
	// loop figures share one frame (290 x 250), centred and standing on one baseline, so the
	// five sit in a row like plates on a shelf; the staircases are cropped to their own box.
	const vb = _vb === 'shelf'
		? `${f((BB[0] + BB[2]) / 2 - 150)} ${f(BB[3] + pad - 240)} 300 240`
		: `${f(BB[0] - pad)} ${f(BB[1] - pad)} ${f(BB[2] - BB[0] + 2 * pad)} ${f(BB[3] - BB[1] + 2 * pad)}`;
	BB = null;
	const html = `{{/* GENERATED by scripts/landing-figs.mjs — edit the generator, not this file. */}}\n<svg class="fig fig-${name}" viewBox="${vb}" ${extra} aria-hidden="true" focusable="false">${body}</svg>\n`;
	writeFileSync(join(OUT, `${name}.html`), html);
	console.log('wrote', name);
}

// ---- the five loop phases (each 240 x 200) -------------------------------
const W = 100; // ONE plate scale for all five figures (single- and two-plate alike)
const T4 = [{ u: .5, v: .17 }, { u: .83, v: .5 }, { u: .5, v: .83 }, { u: .17, v: .5 }];
{
	// release: versions waiting in the air; the newest one drops onto the plate
	begin(); const px = 0, py = 0; let b = '';
	b += plate({ px, py, w: W, tiles: T4 });
	b += `<path class="fig-drop" ${NS} d="M${P(px + W / 2, py + W / 2, 6).join(' ')}L${P(px + W / 2, py + W / 2, 64).join(' ')}"/>`;
	b += ghost({ px: px + W / 2, py: py + W / 2 - 30, z: 92, e: 15 });
	b += ghost({ px: px + W / 2, py: py + W / 2 - 56, z: 104, e: 15 });
	b += cube({ px: px + W / 2, py: py + W / 2, z: 64, e: 18, cls: 'is-live fig-float' });
	svg('release', 'shelf', b);
}
{
	// guard: the plate inside a fence; the environment is checked before anything lands
	begin(); const px = 0, py = 0; let b = '';
	const [sx, sy] = P(px - 14, py - 14); P(px + W + 14, py - 14); P(px - 14, py + W + 14); P(px + W + 14, py + W + 14);
	b += `<rect class="fig-fence" ${NS} x="0" y="0" width="${W + 28}" height="${W + 28}" rx="${f((W + 28) * .16)}" transform="${iso(sx, sy - 2)}"/>`;
	b += plate({ px, py, w: W, tiles: T4 });
	const [cx, cy] = P(px + W / 2, py + W / 2, 58);
	b += `<path class="fig-check" ${NS} d="M${cx - 10} ${cy}l7 7l14 -15"/>`;
	b += `<path class="fig-drop" ${NS} d="M${P(px + W / 2, py + W / 2, 6).join(' ')}L${P(px + W / 2, py + W / 2, 40).join(' ')}"/>`;
	svg('guard', 'shelf', b);
}
// two environments, one step apart (gates, update)
const TW = 100, TG = 34, TZ = 46;
function twoPlates(rampCls) {
	let b = '';
	b += plate({ px: 0, py: -(TW + TG), z: TZ, w: TW, tiles: [{ u: .5, v: .2 }, { u: .2, v: .5 }, { u: .8, v: .5 }] });
	b += ramp({ a: [TW / 2, 0], b: [TW / 2, -TG], za: 0, zb: TZ, wd: 14, treads: 5, cls: rampCls });
	b += plate({ px: 0, py: 0, w: TW, tiles: [{ u: .2, v: .5 }, { u: .5, v: .8 }, { u: .8, v: .5 }] });
	return b;
}
{
	// gates: a build waits at a gate across the foot of the ramp (dashed: the gate is yours)
	begin(); let b = twoPlates('is-idle');
	const g1 = P(TW / 2 - 13, 2, 0), g2 = P(TW / 2 + 13, 2, 0);
	b += `<path class="fig-gate" ${NS} d="M${g1[0]} ${g1[1]}v-26M${g2[0]} ${g2[1]}v-26"/>`;
	b += `<path class="fig-gate fig-dash" ${NS} d="M${g1[0]} ${g1[1] - 20}L${g2[0]} ${g2[1] - 20}"/>`;
	b += cube({ px: TW / 2, py: 24, e: 16, cls: 'is-live is-waiting' });
	svg('gates', 'shelf', b);
}
{
	// update: the build climbs the ramp to the next environment
	begin(); let b = twoPlates('is-active');
	b += cube({ px: TW / 2, py: -TG / 2, z: TZ / 2, e: 16, cls: 'is-live fig-climb' });
	svg('update', 'shelf', b);
}
{
	// health: the build sits on the plate and the plate answers
	begin(); const px = 0, py = 0; let b = '';
	b += plate({ px, py, w: W, tiles: T4, cls: 'is-healthy' });
	b += pulse({ px: px + W / 2, py: py + W / 2, z: 0 });
	b += cube({ px: px + W / 2, py: py + W / 2, e: 18, cls: 'is-live' });
	svg('health', 'shelf', b);
}

// ---- the staircase: three environments, a build travelling up ---------------
function staircase(name, { labels = true, travel = true, done = false } = {}) {
	begin(); const w = 150, step = 46, gap = 96;
	const envs = [
		{ px: 0, py: 0, z: 0, label: 'development' },
		{ px: 0, py: -(w + gap), z: step, label: 'staging' },
		{ px: 0, py: -2 * (w + gap), z: 2 * step, label: 'production' },
	];
	let b = '';
	// draw back to front: production first
	for (let i = envs.length - 1; i >= 0; i--) {
		const e = envs[i];
		if (i < envs.length - 1) {
			const n = envs[i + 1];
			b += ramp({ a: [e.px + w * .5, e.py], b: [n.px + w * .5, n.py + w], za: e.z, zb: n.z, wd: 16, treads: 7, cls: (done || i === 0) ? 'is-active' : 'is-idle' });
		}
		if (done && i === envs.length - 1) b += pulse({ px: e.px + w * .5, py: e.py + w * .5, z: e.z, rs: [26, 44, 64] });
		b += plate({ px: e.px, py: e.py, z: e.z, w, t: 12, cls: done && i === envs.length - 1 ? 'is-healthy' : '', tiles: [{ u: .5, v: .17 }, { u: .83, v: .5 }, { u: .5, v: .83 }, { u: .17, v: .5 }] });
		if (labels) { const [lx, ly] = P(e.px + w, e.py, e.z); b += label(lx + 16, ly + 10, e.label, 'fig-env', 21); /* room for the label at up to ~32 user units (landing.css sizes it per band) */ }
	}
	// builds that have arrived (done: the same build now stands in every environment)
	if (done) {
		for (const e of envs) b += cube({ px: e.px + w * .5, py: e.py + w * .5, z: e.z, e: 22, cls: 'is-live' });
		svg(name, '', b); return;
	}
	b += cube({ px: envs[2].px + w * .5, py: envs[2].py + w * .17, z: envs[2].z, e: 18, cls: 'is-live' });
	b += cube({ px: envs[1].px + w * .5, py: envs[1].py + w * .17, z: envs[1].z, e: 18, cls: 'is-live' });
	b += cube({ px: envs[1].px + w * .83, py: envs[1].py + w * .5, z: envs[1].z, e: 18, cls: 'is-live' });
	b += cube({ px: envs[0].px + w * .17, py: envs[0].py + w * .5, z: envs[0].z, e: 18, cls: 'is-live' });
	// the build in motion: dev -> staging, along the first ramp (CSS animates the group)
	if (travel) {
		const a = [envs[0].px + w * .5, envs[0].py + w * .5, 0], c = [envs[1].px + w * .5, envs[1].py + w * .5, step];
		const A = P(...a), B = P(c[0], c[1], c[2]);
		b += `<g class="fig-traveller" style="--fig-dx:${f(B[0] - A[0])}px;--fig-dy:${f(B[1] - A[1])}px">${cube({ px: a[0], py: a[1], z: 0, e: 18, cls: 'is-live is-moving' })}</g>`;
	}
	svg(name, '-150 -380 780 560', b);
}
staircase('staircase-done', { travel: false, done: true });

// ---- the dependency graph: four services, one environment ---------------------
// checkout-api's new build needs payments-svc 3.0.0, which is still rolling out here: the build
// waits at the (dashed, yours) gate on that one edge. checkout-worker needs nothing new and is
// not held; storefront is at rest. The copy beside it says exactly this.
function depsGraph(name, { compact = false } = {}) {
	begin(); const w = 120, g = compact ? 70 : 96; let b = '';
	const N = compact ? {
		pay:  { px: 0, py: 0, label: 'payments-svc', v: '3.0.0 rolling out' },
		api:  { px: w + g, py: w + g, label: 'checkout-api', v: '4.45.0 waiting' },
	} : {
		pay:   { px: 0, py: 0, label: 'payments-svc', v: '3.0.0 rolling out' },
		api:   { px: 0, py: -(w + g), label: 'checkout-api', v: '4.45.0 waiting' },
		work:  { px: w + g, py: 0, label: 'checkout-worker', v: '2.8.1 not held' },
		front: { px: w + g, py: -(w + g), label: 'storefront', v: '1.12.0' },
	};
	const edge = (a, c, cls) => ramp({ a, b: c, za: 0, zb: 0, wd: 12, treads: 6, cls });
	const T2 = [{ u: .2, v: .5 }, { u: .8, v: .5 }];
	// the waiting edge: from payments-svc to checkout-api, with the gate and the held build on it
	let wait, gateAt, ghostAt;
	if (compact) {
		wait = [[N.pay.px + w, N.pay.py + w / 2], [N.api.px, N.api.py + w / 2]];
	} else {
		wait = [[N.pay.px + w / 2, N.pay.py], [N.api.px + w / 2, N.api.py + w]];
	}
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
	// gate: two posts and a dashed bar across the waiting edge, near checkout-api; the held build before it
	const mx = wait[0][0] + (wait[1][0] - wait[0][0]) * .72, my = wait[0][1] + (wait[1][1] - wait[0][1]) * .72;
	const ex = wait[1][0] - wait[0][0], ey = wait[1][1] - wait[0][1], L = Math.hypot(ex, ey), nx = -ey / L * 14, ny = ex / L * 14;
	{ const a = P(mx + nx, my + ny), c = P(mx - nx, my - ny);
	  b += `<path class="fig-gate" ${NS} d="M${a[0]} ${a[1]}v-24M${c[0]} ${c[1]}v-24"/><path class="fig-gate fig-dash" ${NS} d="M${a[0]} ${a[1] - 18}L${c[0]} ${c[1] - 18}"/>`; }
	const gx = wait[0][0] + ex * .45, gy = wait[0][1] + ey * .45;
	b += cube({ px: gx, py: gy, e: 18, cls: 'is-live is-waiting' });
	b += pulse({ px: N.pay.px + w / 2, py: N.pay.py + w / 2, z: 0, rs: [24, 40, 58] });
	b += cube({ px: N.pay.px + w / 2, py: N.pay.py + w / 2, e: 22, cls: 'is-live' });
	b += ghost({ px: N.api.px + w / 2, py: N.api.py + w / 2, e: 20 });
	if (!compact) {
		b += cube({ px: N.work.px + w / 2, py: N.work.py + w / 2, e: 20, cls: 'is-live' });
		b += cube({ px: N.front.px + w / 2, py: N.front.py + w / 2, e: 20, cls: 'is-live' });
	}
	for (const n of Object.values(N)) {
		// every label at the same place relative to its plate: right of the plate's right corner
		const [lx, ly] = P(n.px + w, n.py, 0);
		const ox = 16, oy = 2;
		// room for the labels at up to ~17 user units (landing.css sizes them per breakpoint for >= 12px on screen)
		b += label(lx + ox, ly + oy, n.label, 'fig-env', 10.4);
		b += label(lx + ox, ly + oy + 20, n.v, /waiting/.test(n.v) ? 'fig-sub is-waiting' : 'fig-sub', 10.4);
	}
	svg(name, '', b);
}
depsGraph('dependencies');
depsGraph('dependencies-compact', { compact: true });

// ---- the finished staircase, compact (phones) --------------------------------------------
{
	begin(); const w = 110, step = 34, gap = 70; let b = '';
	const E = [0, 1, 2].map((i) => ({ px: 0, py: -i * (w + gap), z: i * step }));
	for (let i = 2; i >= 0; i--) {
		const e = E[i];
		if (i < 2) { const n = E[i + 1]; b += ramp({ a: [e.px + w / 2, e.py], b: [n.px + w / 2, n.py + w], za: e.z, zb: n.z, wd: 14, treads: 5, cls: 'is-active' }); }
		if (i === 2) b += pulse({ px: e.px + w / 2, py: e.py + w / 2, z: e.z, rs: [22, 36, 52] });
		b += plate({ px: e.px, py: e.py, z: e.z, w, t: 10, cls: i === 2 ? 'is-healthy' : '', tiles: [{ u: .5, v: .17 }, { u: .83, v: .5 }, { u: .5, v: .83 }, { u: .17, v: .5 }] });
	}
	for (const e of E) b += cube({ px: e.px + w / 2, py: e.py + w / 2, z: e.z, e: 20, cls: 'is-live' });
	svg('staircase-done-compact', '', b);
}

