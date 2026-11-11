/**
 * Camera snapping (AD r4: "camera rests crop words"): a frame edge never slices a line of text. After the camera has worked out its scale and a centred
 * origin, the origin slides along each axis (and the scale gives a little) until BOTH frame edges fall in a gap between text boxes: the column gutters on
 * x, the row gaps on y. Pure functions of boxes; Film.svelte feeds them the product's own text rects.
 */
export type Box = { x: number; y: number; w: number; h: number };
/** a span [a, b] of text on the axis being snapped */
export type Span = [number, number];

/** does an edge at `e` slice a span (strictly inside, with 1.5 px slack so touching is fine)? */
const slices = (e: number, spans: Span[]) => spans.some(([a, b]) => e > a + 1.5 && e < b - 1.5);

/**
 * The frame start `P` nearest to `pref` in [lo, hi] such that neither P nor P+len slices a span. Null when no position qualifies.
 * Sliding is limited to [lo, hi] (the target must stay in frame, the frame must stay on the page).
 */
export function freeStart(lo: number, hi: number, len: number, spans: Span[], pref: number, leadOnly = false): number | null {
	if (hi < lo) return null;
	const p0 = Math.min(hi, Math.max(lo, pref));
	for (let d = 0; d <= hi - lo + 1; d++) {
		for (const p of d === 0 ? [p0] : [p0 - d, p0 + d]) {
			if (p < lo || p > hi) continue;
			if (!slices(p, spans) && (leadOnly || !slices(p + len, spans))) return p;
		}
	}
	return null;
}

/** text spans on one axis whose OTHER-axis extent overlaps the frame band [b0, b1] */
export function spansIn(rects: Box[], axis: 'x' | 'y', b0: number, b1: number): Span[] {
	const out: Span[] = [];
	for (const r of rects) {
		const [o0, o1, a, b] = axis === 'x' ? [r.y, r.y + r.h, r.x, r.x + r.w] : [r.x, r.x + r.w, r.y, r.y + r.h];
		if (o1 > b0 && o0 < b1) out.push([a, b]);
	}
	return out;
}

/**
 * Frame (scale s, screen offset x/y in the camera wrapper) for target `T` in a viewport vw x vh over a page gw x gh, with edges in gutters.
 * `s0` is the wanted scale; scales down to `sMin` are tried (a wider frame has more gutter to choose from). `m` = screen margin around the target.
 */
export function snapFrame(T: Box, rects: Box[], vw: number, vh: number, gw: number, gh: number, s0: number, sMin: number, sMax: number, m = 14): { s: number; x: number; y: number; ok: boolean } {
	/* nearest to the wanted scale first, bigger before smaller (bigger text), up to the scale at which the target fills the frame */
	const tries: number[] = [s0];
	for (let d = 0.02; s0 + d <= sMax + 1e-6 || s0 - d >= sMin - 1e-6; d += 0.02) { if (s0 + d <= sMax + 1e-6) tries.push(+(s0 + d).toFixed(3)); if (s0 - d >= sMin - 1e-6) tries.push(+(s0 - d).toFixed(3)); }
	let fallback: { s: number; x: number; y: number; ok: boolean } | null = null;
	for (const s of tries) {
		const lenX = vw / s, lenY = vh / s, mg = m / s;
		// y first, on the page's own rows, then x against the lines inside the chosen band
		const prefY = T.y + T.h / 2 - lenY / 2, prefX = T.x + T.w / 2 - lenX / 2;
		const loX = Math.max(0, T.x + T.w + mg - lenX), hiX = Math.max(loX, Math.min(gw - lenX, T.x - mg));
		const loY = T.h + 2 * mg <= lenY ? Math.max(0, T.y + T.h + mg - lenY) : Math.max(0, T.y - 90 / s), hiY0 = T.h + 2 * mg <= lenY ? Math.min(Math.max(0, gh - lenY), T.y - mg) : Math.min(Math.max(0, gh - lenY), T.y + 50 / s), hiY = Math.max(loY, hiY0);
		const clampX = (v: number) => Math.min(Math.max(0, gw - lenX), Math.max(0, v));
		const clampY = (v: number) => Math.min(Math.max(0, gh - lenY), Math.max(0, v));
		if (T.w + 2 * mg > lenX + 0.5) continue; // the target does not fit at this scale
		const ySp = spansIn(rects, 'y', prefX, prefX + lenX);
		let py = freeStart(loY, hiY, lenY, ySp, prefY) ?? freeStart(loY, hiY, lenY, ySp, prefY, true) ?? clampY(prefY); /* both edges in a row gap, else at least the TOP edge (a tall page runs on past the bottom) */
		const px = freeStart(loX, hiX, lenX, spansIn(rects, 'x', py, py + lenY), prefX);
		if (px === null) { fallback ??= { s, x: -clampX(prefX) * s, y: -py * s, ok: false }; continue; }
		const ySp2 = spansIn(rects, 'y', px, px + lenX);
		py = freeStart(loY, hiY, lenY, ySp2, py) ?? freeStart(loY, hiY, lenY, ySp2, py, true) ?? py;
		return { s, x: -px * s, y: -py * s, ok: true };
	}
	return fallback ?? { s: s0, x: 0, y: 0, ok: false };
}
