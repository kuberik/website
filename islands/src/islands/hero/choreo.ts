/**
 * The two presses of the story (SPEC 2.3 beats 9-10) as a pure function of story time: where the pointer is, whether the confirm is
 * open, whether the after-state toast shows. The pointer is the only thing in the window that is not a dashboard component (SPEC 2.2).
 */
export type Target = 'approve' | 'confirm' | null;
export type Choreo = { target: Target; visible: boolean; press: boolean; ask: boolean; done: boolean };

const PRESS_MS = 0.15;
export function choreoAt(t: number): Choreo {
	const target: Target = t < 17.5 || t >= 19.45 ? null : t < 18.3 ? 'approve' : 'confirm';
	const press = (t >= 18.1 && t < 18.1 + PRESS_MS) || (t >= 19.0 && t < 19.0 + PRESS_MS);
	return { target, visible: t >= 17.5 && t < 19.2, press, ask: t >= 18.2 && t < 19.0, done: t >= 19.05 && t < 25 };
}
