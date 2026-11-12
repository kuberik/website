import { describe, expect, it } from 'vitest';
import { clockFace, clockSeconds, LOOP } from './clock';
describe('hero clock', () => {
	it('starts at 10:11, inside the deploy window', () => {
		expect(clockFace(0)).toBe('10:11');
	});
	it('is monotone over the loop', () => {
		let last = -1;
		for (let t = 0; t <= LOOP; t += 0.25) { const s = clockSeconds(t); expect(s).toBeGreaterThan(last); last = s; }
	});
	it('the waves are the fastest stretch (a time-lapse)', () => {
		expect((clockSeconds(34) - clockSeconds(24.5)) / 9.5).toBeGreaterThan((clockSeconds(24.5) - clockSeconds(13.5)) / 11);
	});
});
