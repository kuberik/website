import { test, expect } from 'vitest';
import { choreoAt } from './choreo';
test('pointer presses Approve, then the confirm; nothing outside', () => {
	expect(choreoAt(5)).toMatchObject({ visible: false, ask: false });
	expect(choreoAt(9.2)).toMatchObject({ visible: true, target: 'approve', ask: false });
	expect(choreoAt(9.65)).toMatchObject({ press: true, target: 'approve' });
	expect(choreoAt(10.2)).toMatchObject({ ask: true, target: 'confirm', press: false });
	expect(choreoAt(10.9)).toMatchObject({ press: true, ask: false });
	expect(choreoAt(11.2).visible).toBe(false);
});
