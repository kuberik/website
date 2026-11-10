import { test, expect } from 'vitest';
import { CHIPS, chipAt, whereAt } from './model';
test('chips cover the story and light in order', () => {
	expect(chipAt(0)).toBe(-1); expect(chipAt(2.5)).toBe(0); expect(chipAt(6)).toBe(1); expect(chipAt(9)).toBe(2); expect(chipAt(15)).toBe(3); expect(chipAt(25)).toBe(4);
	for (const c of CHIPS) expect(chipAt(c.settled)).toBe(CHIPS.indexOf(c));
	expect(whereAt(16)).toBe('ask'); expect(whereAt(20)).toBe('wave1'); expect(whereAt(26)).toBe('wave2'); expect(whereAt(32)).toBe('done');
});
