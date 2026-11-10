import { describe, it, expect } from 'vitest';
import { Timeline } from './timeline';

function rig(restMs = 1000) {
	let t = 0; let pending: { at: number; fn: () => void } | null = null; const seen: string[] = [];
	const tl = new Timeline<string>({
		beats: [{ at: 0, state: 'a' }, { at: 500, state: 'b' }, { at: 1000, state: 'c' }], restMs,
		apply: (s) => seen.push(s), now: () => t,
		setTimer: (fn, ms) => (pending = { at: t + ms, fn }), clearTimer: () => (pending = null)
	});
	const advance = (ms: number) => { const end = t + ms; while (pending && pending.at <= end) { t = pending.at; const f = pending.fn; pending = null; f(); } t = end; };
	return { tl, seen, advance };
}

describe('Timeline', () => {
	it('plays beats in order and loops after the rest', () => {
		const { tl, seen, advance } = rig();
		tl.setGate('onscreen', true);
		advance(2600);
		expect(seen).toEqual(['a', 'b', 'c', 'a', 'b']);
	});
	it('freezes offscreen and resumes where it stopped', () => {
		const { tl, seen, advance } = rig();
		tl.setGate('onscreen', true); advance(600); // a, b
		tl.setGate('onscreen', false); advance(5000);
		expect(seen).toEqual(['a', 'b']);
		tl.setGate('onscreen', true); advance(450); // 600+450 > 1000 -> c
		expect(seen).toEqual(['a', 'b', 'c']);
	});
	it('reduced motion shows the representative beat and never autoplays', () => {
		const { tl, seen, advance } = rig();
		tl.setGate('motion', false); tl.setGate('onscreen', true); advance(5000);
		expect(seen).toEqual(['c']);
		tl.next(); expect(seen).toEqual(['c', 'a']);
	});
});
