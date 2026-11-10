/**
 * The hero's wall clock (STORYBOARD section 2). Story second `t` maps to a time of day on a piecewise-linear time-lapse:
 * the wait for a person is fast, the catch plays in near real time. Every CR timestamp is placed through this one map, so every age
 * or timer the product prints agrees with the chrome clock. Pure; no display strings except the clock face.
 */
export const LOOP = 48;
/** [story second, minutes after 00:00]. 09:02 at the merge, 10:00 at t = 16.6 (the deploy window opens), 10:52 at the loop's end. */
const PTS: [number, number][] = [[0, 9 * 60 + 2], [6.5, 9 * 60 + 14], [12.5, 9 * 60 + 41], [16.6, 10 * 60], [18, 10 * 60 + 1], [27, 10 * 60 + 31], [36, 10 * 60 + 34], [48, 10 * 60 + 52]];

/** seconds after 00:00 at story second `t` (extrapolated linearly outside 0..LOOP) */
export function clockSeconds(t: number): number {
	const n = PTS.length;
	let i = 0;
	while (i < n - 2 && t > PTS[i + 1][0]) i++;
	const [t0, m0] = PTS[i], [t1, m1] = PTS[i + 1];
	return (m0 + ((t - t0) / (t1 - t0)) * (m1 - m0)) * 60;
}
/** the chrome clock face, "10:24" */
export function clockFace(t: number): string {
	const m = Math.floor(clockSeconds(Math.min(Math.max(t, 0), LOOP)) / 60);
	return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}
