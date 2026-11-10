import { test, expect } from 'vitest';
import { choreoAt } from './choreo';
test('pointer presses Approve, then the confirm; toast follows; nothing outside', () => {
	expect(choreoAt(10)).toMatchObject({ visible: false, ask: false, done: false });
	expect(choreoAt(17.6)).toMatchObject({ visible: true, target: 'approve', ask: false });
	expect(choreoAt(18.15)).toMatchObject({ press: true, target: 'approve' });
	expect(choreoAt(18.5)).toMatchObject({ ask: true, target: 'confirm', press: false });
	expect(choreoAt(19.05)).toMatchObject({ press: true, ask: false, done: true });
	expect(choreoAt(24.9).done).toBe(true); expect(choreoAt(25.1).done).toBe(false);
});
