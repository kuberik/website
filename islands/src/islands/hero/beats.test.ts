import { test, expect } from 'vitest';
import { CHIPS, chipAt, whereAt, LOOP } from './model';
test('chips are the production steps, cover the story and light in order', () => {
	expect(CHIPS.map((c) => c.label)).toEqual(['Staging', 'Approval', 'Contract', 'Tests', 'Canary', 'Checks', 'Waves']);
	expect(chipAt(0)).toBe(-1); expect(chipAt(3)).toBe(0); expect(chipAt(7)).toBe(1); expect(chipAt(13)).toBe(2); expect(chipAt(18)).toBe(3); expect(chipAt(23)).toBe(4); expect(chipAt(26)).toBe(5); expect(chipAt(30)).toBe(6);
	for (const c of CHIPS) expect(chipAt(c.settled)).toBe(CHIPS.indexOf(c));
	expect(whereAt(8)).toBe('approval'); expect(whereAt(13)).toBe('contract'); expect(whereAt(26)).toBe('checks'); expect(whereAt(35)).toBe('done');
	expect(LOOP).toBe(40);
});
