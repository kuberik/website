/**
 * THE FILM'S SCRIPT: what is on screen, where the camera is, and what the chrome says, as pure functions of story second `t` (STORYBOARD sections 2-4).
 * It names things (surfaces, targets, overlays); Film.svelte resolves the names against the product's real DOM. Camera, dim, cursor, overlay and
 * chrome are landing chrome (anything the storyboard specifies); every word inside a surface is the product's.
 */
import { LOOP } from './clock';

export { LOOP };
export type Surf = 'change' | 'rollouts' | 'gates' | 'overview' | 'history' | 'envs' | 'app';

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
const SURF: [number, Surf][] = [[0, 'change'], [6.3, 'rollouts'], [12.5, 'gates'], [18, 'overview'], [42.6, 'history'], [44, 'app']];
export const surfAt = (t: number): Surf => [...SURF].reverse().find(([at]) => t >= at)![1];
/** surfaces whose cut comes within `ahead` story seconds (their chunks are fetched before the beat: STORYBOARD section 9) */
export const upcoming = (t: number, ahead = 3): Surf[] => SURF.filter(([at]) => at > t && at - t <= ahead).map(([, s]) => s);
/** (retired) the loop end no longer fades to empty ground: the wrap cross-fades into b1 */
export const FADE_AT = 47.0;

/** camera: a keyframe is a move that STARTS at `at`. `to` names a target the film resolves in the surface's DOM ('rest' = scale 1, origin). `dur` in ms. */
export type Move = { at: number; to: string; s: number; dur: number; ease: string; dim?: string; min?: number; desk?: boolean /* desktop only: a phone has no camera on the sheet, and every extra keyframe costs it a layout shift */; hole?: string /* the dim's hole when it is not the camera target (the catch: frame the text, light the whole banner) */ };
const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)', SPRING = 'cubic-bezier(0.34, 1.15, 0.64, 1)', ANTIC = 'cubic-bezier(0.34, 1.3, 0.64, 1)';
const PULL = 'cubic-bezier(0.45, 0, 0.2, 1)';
/* FIVE zooms in all (L3): merge (where it runs -> history, a pan), gates (held across both beats), the pipeline (pans to the health checks and back for the final check), the rollback aftermath (banners -> pipeline -> timeline, panning) and the finale's pull-back over the resolved Environments page.
   Every zoom is 1.5x; between consecutive beats on one object the camera PANS, it never returns to rest and re-zooms. The catch (27.3-30.4) and the approval are dims at 1x. */
export const CAMERA: Move[] = [
	{ at: 0, to: 'rest', s: 1, dur: 500, ease: EXPO }, /* the loop wrap eases the camera home under the cross-fade */
	{ at: 1.4, to: 'where-it-runs', s: 1.5, dur: 434, ease: EXPO },
	{ at: 3.9, to: 'history', s: 2.5, dur: 460, ease: SPRING }, /* 2.5x: the History card sits at the page's right edge, and only a frame narrower than the card plus its 16 px gutter can start right of the Where-it-runs card without running off the page (at 2.4x a 20 px strip of it showed at 1440, AD r8) */
	{ at: 5.2, to: 'rest', s: 1, dur: 537, ease: EXPO },
	/* the PERSON beats (the approval and its confirm, the catch, the rollback fields): zoomed until the smallest text renders at 15 px, and the ONLY dimmed beats besides the dialog's own scrim */
	{ at: 7.3, to: 'attention', s: 1.5, dur: 520, ease: EXPO, dim: 'both', min: 15 },
	{ at: 8.9, to: 'approve-pair', s: 1.5, dur: 460, ease: SPRING, dim: 'both', min: 15 },
	{ at: 10.4, to: 'rest', s: 1, dur: 420, ease: EXPO },
	{ at: 13.4, to: 'gate-column', s: 1.5, dur: 380, ease: ANTIC },
	{ at: 17.3, to: 'rest', s: 1, dur: 537, ease: EXPO },
	{ at: 18.4, to: 'pipeline', s: 1.5, dur: 434, ease: EXPO }, /* the WHOLE pipeline card held through the canary (Stage 1 -> the final check -> its health checks); the old pan to the rail's Health checks card left the pipeline half out of frame (AD r6 P1-1) */
	{ at: 27.3, to: 'figure', s: 1.5, dur: 480, ease: EXPO, dim: 'both', min: 15 }, /* the phone's Catch frame (the tight rest below is desktop only and wins there: moveAt reads from the end) */
	{ at: 27.3, to: 'figure-tight', s: 1.5, dur: 480, ease: EXPO, dim: 'both', min: 15, hole: 'figure', desk: true }, /* AD r8 P2-3: the Catch's ONE tight rest, on the failure banner's words at 1.5x (the whole banner fills the page width: whole, it lands near 1.07x), lit as the whole banner */
	{ at: 29.0, to: 'figure', s: 1.5, dur: 480, ease: EXPO, dim: 'both', min: 15 }, /* then wide: the whole banner with its actions, still lit (on the phone this is the Catch's only frame, from 27.3) */
	{ at: 30.4, to: 'rest', s: 1, dur: 400, ease: EXPO },
	{ at: 33.2, to: 'rest', s: 1, dur: 420, ease: EXPO },
	{ at: 34.5, to: 'modal', s: 1.5, dur: 460, ease: EXPO, dim: 'shade', min: 15 }, /* the recovery-mode warning (the product's own dialog before the version dialog) */
	{ at: 35.8, to: 'modal-top', s: 1.5, dur: 460, ease: EXPO, dim: 'shade', min: 15 },
	{ at: 36.6, to: 'modal-fields', s: 1.5, dur: 460, ease: EXPO, dim: 'shade', min: 15, desk: true },
	{ at: 39.0, to: 'rest', s: 1, dur: 300, ease: EXPO },
	{ at: 39.4, to: 'banners', s: 1, dur: 434, ease: EXPO },
	{ at: 42.2, to: 'rest', s: 1, dur: 340, ease: EXPO }, /* clear before the History cut (42.6) and held through the Environments cut (44.0): a cut never lands under another page's zoom. The History strip spans the page's whole content width, so no zoom can frame it without slicing the rail beside it (AD r4: no cropped words): it is shown at rest. */

	{ at: 44.7, to: 'builds', s: 1.5, dur: 2400, ease: PULL }, /* the finale pushes in on the five regions, slowly, and the loop's wrap eases it home under the cross-fade */
];
export const moveAt = (t: number, phone = false): Move => [...CAMERA].reverse().find((m) => t >= m.at && !(phone && m.desk))!;

/** the presses: a person decides (STORYBOARD cursor rule). `go` = cursor appears, `press` = the real click, `off` = it fades. */
export type Press = { id: 'approve' | 'confirm' | 'rollback' | 'warn' | 'continue'; target: string; go: number; press: number; off: number };
export const PRESSES: Press[] = [
	{ id: 'approve', target: 'approve', go: 7.9, press: 8.6, off: 8.9 },
	{ id: 'confirm', target: 'approve-confirm', go: 9.5, press: 10.2, off: 10.4 },
	{ id: 'rollback', target: 'banner-rollback', go: 33.9, press: 34.2, off: 34.45 },
	{ id: 'warn', target: 'warn-continue', go: 35.0, press: 35.5, off: 35.75 },
	{ id: 'continue', target: 'modal-continue', go: 38.0, press: 38.7, off: 39.0 }
];
export const pressAt = (t: number): Press | null => PRESSES.find((p) => t >= p.go && t < p.off) ?? null;
/** overlays: the approval confirm (ApprovalLayer) is open between the first press and the second; the rollback confirm between its two */
export const confirmOpen = (t: number) => t >= 8.75 && t < 10.4;
export const rollbackOpen = (t: number) => t >= 34.4 && t < 38.75;
/** the real prod ceremony, typed on screen at Railway's speed (about 30 characters a second): the reason, then the version to confirm; the real Roll back is pressed at 38.7 */
export const REASON = 'Error rate over budget, back to the last good build';
export const TYPING = { reason: [36.0, 37.2], confirm: [37.4, 38.0] } as const;
export const typedLen = (t: number, [a, b]: readonly [number, number], n: number) => Math.max(0, Math.min(n, Math.floor(((t - a) / (b - a)) * n)));

/** the tally (STORYBOARD section 2): checks passed, failed, decided by a person. Each entry is the second its CR passes. */
const PASSED = [3.8, 4.2, 6.5, 14.4, 16.6, 20.9, 24.8, 40.4, 41.8, 42.2];
const PEOPLE = [10.2, 38.7];
const FAILED = [27.0];
export const tallyAt = (t: number) => ({ passed: PASSED.filter((x) => t >= x).length, failed: FAILED.filter((x) => t >= x).length, people: PEOPLE.filter((x) => t >= x).length });
/** the page fades with the loop's end, so the tally clears with it */
export const tallyShown = (t: number) => tallyAt(t);

/** Which product reflows are hidden under a still of the page before them (Film.svelte takeSnap). The product's own transitions (a banner opening, a dialog closing,
 *  rows sliding) are the point of the film, so they PLAY, unless one alone costs more layout shift than the page can spend: measured at 1440 the Approve collapse is one
 *  0.105 shift, over the whole 0.1 budget, so it is the single desktop cover. On the phone the same reflows move 2-3x the viewport area (0.12-0.19 each): all covered. */
export const COVER_DESKTOP_AT = [38.7];
/** the reflows that PLAY as a slide (flip.ts, by transform: no layout shift) instead of being covered or left to jump: the approved card leaving the Rollouts list */
export const FLIP_AT = [10.3];
/** the moment the rollback sheet closes (the Roll back press, 38.7): on the phone the still that covers the reflow is of the PAGE, without the sheet. A copy of a
 *  fixed full-screen sheet cannot be laid out like the real one (it came back at its top with the nav over it, AD r8 P2-1), and the press sends the sheet away:
 *  the page then slides from where it was laid out under the sheet (Film.svelte settleThenReveal) */
export const SHEET_CLOSE_AT = 38.7;
export const sheetClosing = (t: number) => Math.abs(t - SHEET_CLOSE_AT) < 0.35;
export const flipEvent = (t: number, phone: boolean) => !phone && FLIP_AT.some((c) => Math.abs(t - c) < 0.35);
export function coverEvent(t: number, phone: boolean): boolean { return phone || COVER_DESKTOP_AT.some((c) => Math.abs(t - c) < 0.35); }
