/**
 * FLIP by transform (lane 27, the Approve collapse): when the product re-lays itself out in ONE step (the approved card leaves the Rollouts list and everything under
 * it jumps up: one 0.105 layout shift at 10.3 s), every element that moved is put back where it was with a transform and released to its new place with a Web
 * Animation. A transform is not layout: the browser sees no shift, the viewer sees the page slide up the way a person expects it to. It is landing chrome in the
 * same family as the camera (it never touches a word the product prints), and it only runs on the moments script.ts lists in FLIP_AT.
 */
export type Pos = Map<Element | string, { x: number; y: number }>;
/** a row the product RE-MOUNTS elsewhere (a place moving from one build's stop to another's: a new <li> under the new stop) is matched by its href (lane 33: the wave picture, rows travel to the new build) */
const KEY = 'data-truth-href';

/** where every element of `root` is, in canvas px relative to `root`'s own box (stable under the camera's transform and zoom) */
export function flipRecord(root: HTMLElement, unit: number): Pos {
	const g = root.getBoundingClientRect(), out: Pos = new Map();
	for (const e of root.querySelectorAll<HTMLElement>('*')) {
		if (e.closest('svg') && e.tagName.toLowerCase() !== 'svg') continue;
		const r = e.getBoundingClientRect(); if (!r.width && !r.height) continue;
		const p = { x: (r.left - g.left) / unit, y: (r.top - g.top) / unit };
		out.set(e, p);
		const k = e.getAttribute(KEY); if (k && !out.has('k:' + k)) out.set('k:' + k, p);
	}
	return out;
}

/** play the inverse: returns how many roots of moved subtrees it released (0 = nothing moved) */
export function flipPlay(root: HTMLElement, before: Pos, unit: number, ms = 340, easing = 'cubic-bezier(0.2, 0.8, 0.2, 1)'): number {
	const g = root.getBoundingClientRect(), now = new Map<Element, { x: number; y: number }>();
	for (const e of before.keys()) { if (typeof e === 'string' || !e.isConnected) continue; const r = e.getBoundingClientRect(); now.set(e, { x: (r.left - g.left) / unit, y: (r.top - g.top) / unit }); }
	const d = (e: Element) => { const a = before.get(e), b = now.get(e); return a && b ? { dx: a.x - b.x, dy: a.y - b.y } : null; };
	let n = 0;
	for (const e of now.keys()) {
		const m = d(e); if (!m || (Math.abs(m.dx) < 0.5 && Math.abs(m.dy) < 0.5)) continue;
		const pm = e.parentElement && e.parentElement !== root ? d(e.parentElement) : null;
		if (pm && Math.abs(pm.dx - m.dx) < 0.5 && Math.abs(pm.dy - m.dy) < 0.5) continue; /* it rides its parent */
		(e as HTMLElement).animate([{ transform: `translate(${m.dx}px, ${m.dy}px)` }, { transform: 'translate(0, 0)' }], { duration: ms, easing, fill: 'backwards' });
		n++;
	}
	/* re-mounted rows: slide from where the old one stood */
	for (const e of root.querySelectorAll<HTMLElement>(`[${KEY}]`)) {
		if (before.has(e)) continue;
		const a = before.get('k:' + e.getAttribute(KEY)); if (!a) continue;
		const r = e.getBoundingClientRect(), dx = a.x - (r.left - g.left) / unit, dy = a.y - (r.top - g.top) / unit;
		if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
		e.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }], { duration: ms * 1.6, easing, fill: 'backwards' });
		n++;
	}
	return n;
}
