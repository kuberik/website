/**
 * The two presses of the story (SPEC 2.3 beats 9-10) as a pure function of story time: where the pointer is, whether the confirm is
 * open, (no after-state toast: the product's toast says "is deploying" and this approval is followed by a hold). The pointer is the only thing in the window that is not a dashboard component (SPEC 2.2).
 */
export type Target = 'approve' | 'confirm' | null;
export type Choreo = { target: Target; visible: boolean; press: boolean; ask: boolean };

const PRESS_MS = 0.15;
export function choreoAt(t: number): Choreo {
	const target: Target = t < 9.0 || t >= 11.05 ? null : t < 9.8 ? 'approve' : 'confirm';
	const press = (t >= 9.6 && t < 9.6 + PRESS_MS) || (t >= 10.85 && t < 10.85 + PRESS_MS);
	return { target, visible: t >= 9.0 && t < 11.0, press, ask: t >= 9.7 && t < 10.85 };
}
