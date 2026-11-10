/**
 * THE FILM'S SCRIPT: what is on screen, where the camera is, and what the chrome says, as pure functions of story second `t` (STORYBOARD sections 2-4).
 * It names things (surfaces, targets, overlays); Film.svelte resolves the names against the product's real DOM. Camera, dim, cursor, overlay and
 * chrome are landing chrome (anything the storyboard specifies); every word inside a surface is the product's.
 */
import { LOOP } from './clock';

export { LOOP };
export type Surf = 'change' | 'rollouts' | 'gates' | 'overview' | 'history' | 'envs';

/** the 6 chapters (STORYBOARD section 2): label, [from, to), and the settled frame reduced motion seeks to */
export const CHAPTERS = [
	{ key: 'merge', label: 'Merge', from: 0, to: 6.5, settled: 4.9 },
	{ key: 'approve', label: 'Approve', from: 6.5, to: 12.5, settled: 9.3 },
	{ key: 'gates', label: 'Gates', from: 12.5, to: 18, settled: 17.0 },
	{ key: 'canary', label: 'Canary', from: 18, to: 27, settled: 21.2 },
	{ key: 'catch', label: 'Catch', from: 27, to: 33.8, settled: 30.5 },
	{ key: 'rollback', label: 'Roll back', from: 33.8, to: 48, settled: 43.2 }
] as const;
/** reduced motion rests on b15's settled frame: the rollout Overview, tests Passed, the final check failed, the banner and Roll back */
export const REST_T = 28.4;
export const chapterAt = (t: number) => Math.max(0, CHAPTERS.findIndex((c) => t >= c.from && t < c.to));
export const chapterFill = (t: number) => { const c = CHAPTERS[chapterAt(t)]; return Math.min(1, Math.max(0, (t - c.from) / (c.to - c.from))); };

/** which surface the window shows (the cut times are the storyboard's: N() sidebar steps and T() tab slides) */
const SURF: [number, Surf][] = [[0, 'change'], [6.3, 'rollouts'], [12.5, 'gates'], [18, 'overview'], [31.4, 'envs'], [33.8, 'overview'], [42.6, 'history'], [44, 'envs']];
export const surfAt = (t: number): Surf => [...SURF].reverse().find(([at]) => t >= at)![1];
/** surfaces whose cut comes within `ahead` story seconds (their chunks are fetched before the beat: STORYBOARD section 9) */
export const upcoming = (t: number, ahead = 3): Surf[] => SURF.filter(([at]) => at > t && at - t <= ahead).map(([, s]) => s);
/** (retired) the loop end no longer fades to empty ground: the wrap cross-fades into b1 */
export const FADE_AT = 47.0;

/** camera: a keyframe is a move that STARTS at `at`. `to` names a target the film resolves in the surface's DOM ('rest' = scale 1, origin). `dur` in ms. */
export type Move = { at: number; to: string; s: number; dur: number; ease: string; dim?: string };
const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)', SPRING = 'cubic-bezier(0.34, 1.15, 0.64, 1)', ANTIC = 'cubic-bezier(0.34, 1.3, 0.64, 1)';
export const CAMERA: Move[] = [
	{ at: 0, to: 'rest', s: 1, dur: 0, ease: EXPO },
	{ at: 1.4, to: 'where-it-runs', s: 1.4, dur: 434, ease: EXPO, dim: 'both' },
	{ at: 4.6, to: 'rest', s: 1, dur: 537, ease: EXPO },
	{ at: 7.3, to: 'attention', s: 1, dur: 0, ease: EXPO, dim: 'page' },
	{ at: 10.4, to: 'rest', s: 1, dur: 240, ease: EXPO },
	{ at: 13.4, to: 'gate-column', s: 1.5, dur: 380, ease: ANTIC, dim: 'both' },
	{ at: 17.4, to: 'rest', s: 1, dur: 537, ease: EXPO },
	{ at: 18.4, to: 'pipeline', s: 2, dur: 434, ease: EXPO, dim: 'both' },
	{ at: 23.7, to: 'rest', s: 1, dur: 537, ease: EXPO },
	{ at: 24.2, to: 'health-checks', s: 1, dur: 274, ease: SPRING },
	{ at: 27.0, to: 'rest', s: 1, dur: 280, ease: SPRING },
	{ at: 27.3, to: 'banner', s: 1, dur: 0, ease: EXPO, dim: 'page' },
	{ at: 28.9, to: 'figure', s: 1.6, dur: 434, ease: EXPO, dim: 'both' },
	{ at: 30.9, to: 'rest', s: 1, dur: 537, ease: EXPO },
	{ at: 31.8, to: 'prod-card', s: 1, dur: 0, ease: EXPO, dim: 'page' },
	{ at: 33.8, to: 'rest', s: 1, dur: 0, ease: EXPO },
	{ at: 39.4, to: 'banners', s: 1.2, dur: 434, ease: EXPO, dim: 'both' },
	{ at: 40.8, to: 'pipeline', s: 2, dur: 434, ease: EXPO, dim: 'both' },
	{ at: 42.4, to: 'rest', s: 1, dur: 537, ease: EXPO },
	{ at: 43.0, to: 'timeline', s: 1.3, dur: 434, ease: EXPO, dim: 'both' },
	{ at: 44.0, to: 'rest', s: 1, dur: 0, ease: EXPO },
	{ at: 44.4, to: 'prod-card', s: 1, dur: 0, ease: EXPO, dim: 'page' }
];
export const moveAt = (t: number): Move => [...CAMERA].reverse().find((m) => t >= m.at)!;

/** the presses: a person decides (STORYBOARD cursor rule). `go` = cursor appears, `press` = the real click, `off` = it fades. */
export type Press = { id: 'approve' | 'confirm' | 'rollback' | 'continue'; target: string; go: number; press: number; off: number };
export const PRESSES: Press[] = [
	{ id: 'approve', target: 'approve', go: 7.9, press: 8.6, off: 8.9 },
	{ id: 'confirm', target: 'approve-confirm', go: 9.5, press: 10.2, off: 10.4 },
	{ id: 'rollback', target: 'banner-rollback', go: 33.9, press: 34.2, off: 34.45 },
	{ id: 'continue', target: 'modal-continue', go: 38.0, press: 38.7, off: 39.0 }
];
export const pressAt = (t: number): Press | null => PRESSES.find((p) => t >= p.go && t < p.off) ?? null;
/** overlays: the approval confirm (ApprovalLayer) is open between the first press and the second; the rollback confirm between its two */
export const confirmOpen = (t: number) => t >= 8.75 && t < 10.4;
export const rollbackOpen = (t: number) => t >= 34.4 && t < 38.75;
/** the real prod ceremony, typed on screen at Railway's speed (about 30 characters a second): the reason, then the version to confirm; the real Roll back is pressed at 38.7 */
export const REASON = 'Error rate over budget, back to the last good build';
export const TYPING = { reason: [35.0, 36.8], confirm: [37.1, 37.8] } as const;
export const typedLen = (t: number, [a, b]: readonly [number, number], n: number) => Math.max(0, Math.min(n, Math.floor(((t - a) / (b - a)) * n)));

/** the tally (STORYBOARD section 2): checks passed, failed, decided by a person. Each entry is the second its CR passes. */
const PASSED = [3.8, 4.2, 6.5, 14.4, 16.6, 20.9, 24.8, 40.4, 41.8, 42.2];
const PEOPLE = [10.2, 38.7];
const FAILED = [27.0];
export const tallyAt = (t: number) => ({ passed: PASSED.filter((x) => t >= x).length, failed: FAILED.filter((x) => t >= x).length, people: PEOPLE.filter((x) => t >= x).length });
/** the page fades with the loop's end, so the tally clears with it */
export const tallyShown = (t: number) => tallyAt(t);
