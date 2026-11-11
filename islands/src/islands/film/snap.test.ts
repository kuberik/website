import { describe, it, expect } from 'vitest';
import { freeStart, snapFrame, type Box } from './snap';

describe('snap', () => {
	it('slides a frame start into a gutter', () => {
		// text 0-100 and 120-300; a 150 wide frame wanting start 20 would slice the first block at 20 and the second at 170
		const p = freeStart(0, 200, 20, [[0, 100], [120, 300]], 20);
		expect(p).not.toBeNull();
	});
	it('returns null when every position slices something', () => {
		expect(freeStart(0, 10, 50, [[-100, 1000]], 5)).toBeNull();
	});
	it('puts both edges of a two-column page frame in the gutter', () => {
		// left column 0..800, gutter 800..820, right column 820..1100 (a line in each); target = the left column
		const rects: Box[] = [{ x: 20, y: 10, w: 700, h: 14 }, { x: 840, y: 10, w: 200, h: 14 }];
		const f = snapFrame({ x: 0, y: 0, w: 800, h: 300 }, rects, 1100, 500, 1100, 900, 1.2, 1.0, 1.3);
		const left = -f.x / f.s, right = left + 1100 / f.s;
		expect(rects.every((r) => !(left > r.x + 1.5 && left < r.x + r.w - 1.5) && !(right > r.x + 1.5 && right < r.x + r.w - 1.5))).toBe(true);
	});
});
