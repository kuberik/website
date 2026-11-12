/**
 * The hero's wall clock (STORYBOARD section 2). Story second `t` maps to a time of day on a piecewise-linear time-lapse:
 * the wait for a person is fast, the catch plays in near real time. Every CR timestamp is placed through this one map, so every age
 * or timer the product prints agrees with the chrome clock. Pure; no display strings except the clock face.
 */
export const LOOP = 28.2; /* scene lane 6 (item 17d/i): the all-green Pipeline tab holds ~3.3 s */ // /* scene lane 5: the all-sites beat on the App page's Pipeline tab; the last frame (every site green) holds ~1.8 s before the wrap */ /* scene lane 4: the all-sites beat is out until the App page's Pipeline tab lands (owner item 8): the loop ends as prod us-east-1's bake completes */
/** [story second, minutes after 00:00]. 10:11 as the release lands, staging in minutes, the approval wait and the canary compressed, the waves fastest (lane 33) */
const PTS: [number, number][] = [[0, 10 * 60 + 11], [4.4, 10 * 60 + 19], [9.3, 10 * 60 + 40], [17.2, 10 * 60 + 52], [24.9, 11 * 60 + 38], [28.2, 11 * 60 + 41]];

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
