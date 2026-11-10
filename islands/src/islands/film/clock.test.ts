import { describe, expect, it } from 'vitest';
import { clockFace, clockSeconds } from './clock';
describe('hero clock', () => {
	it('starts at 09:02 and crosses 10:00 when the deploy window opens (t = 16.6)', () => {
		expect(clockFace(0)).toBe('09:02');
		expect(clockFace(16.5)).toBe('09:59');
		expect(clockFace(16.6)).toBe('10:00');
	});
	it('is monotone and ends at 10:52', () => {
		let last = -1;
		for (let t = 0; t <= 48; t += 0.25) { const s = clockSeconds(t); expect(s).toBeGreaterThan(last); last = s; }
		expect(clockFace(48)).toBe('10:52');
	});
	it('the catch (27..36) runs near real time', () => {
		expect((clockSeconds(36) - clockSeconds(27)) / 9).toBeLessThan(25);
	});
});
