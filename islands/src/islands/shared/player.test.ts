import { test, expect } from 'vitest';
import { Player } from './player';

function rig() {
	let now = 0; const timers: { at: number; fn: () => void; id: number }[] = []; let id = 0; const seen: number[] = [];
	const p = new Player({ loop: 36, rest: 16, onTime: (t) => seen.push(t), now: () => now, setTimer: (fn, ms) => { timers.push({ at: now + ms, fn, id: ++id }); return id; }, clearTimer: (h) => { const i = timers.findIndex((x) => x.id === h); if (i >= 0) timers.splice(i, 1); } });
	const run = (ms: number) => { const end = now + ms; for (;;) { timers.sort((a, b) => a.at - b.at); const n = timers[0]; if (!n || n.at > end) break; now = n.at; timers.shift(); n.fn(); } now = end; };
	return { p, run, seen };
}
test('advances only while on screen; leaving freezes; re-entry restarts at 0', () => {
	const { p, run } = rig();
	run(5000); expect(p.time).toBe(0);
	p.gate('onscreen', true); run(4000); expect(p.time).toBeCloseTo(4, 1);
	p.gate('onscreen', false); run(10_000); expect(p.time).toBeCloseTo(4, 1);
	p.gate('onscreen', true); expect(p.time).toBe(0);
});
test('pause holds, chips seek and keep playing, loop wraps', () => {
	const { p, run } = rig(); p.gate('onscreen', true);
	run(3000); p.toggle(); run(5000); expect(p.time).toBeCloseTo(3, 1); expect(p.playing).toBe(false);
	p.seek(19.4); expect(p.playing).toBe(true); run(1000); expect(p.time).toBeCloseTo(20.4, 1);
	p.seek(35); run(2000); expect(p.time).toBeCloseTo(1, 1);
});
test('hidden tab freezes; reduced motion parks on the rest frame and only jumps', () => {
	const { p, run } = rig(); p.gate('onscreen', true); run(2000);
	p.gate('visible', false); run(9000); expect(p.time).toBeCloseTo(2, 1); p.gate('visible', true); run(1000); expect(p.time).toBeCloseTo(3, 1);
	p.gate('motion', false); expect(p.time).toBe(16); run(5000); expect(p.time).toBe(16);
	p.seek(7.7); run(5000); expect(p.time).toBeCloseTo(7.7, 1); expect(p.playing).toBe(false);
});
