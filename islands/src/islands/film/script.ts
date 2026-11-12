/**
 * THE FILM'S SCRIPT: what is on screen, where the camera is, and what the chrome says, as pure functions of story second `t`.
 * It names things (surfaces, targets, overlays); Film.svelte resolves the names against the product's real DOM. Camera, dim, cursor, the NEW tag and
 * chrome are landing chrome; every word inside a surface is the product's.
 *
 * LANE 33 (owner 2026-11-12: "too hectic"): four shots, Railway's pacing. A shot's framing is set AT its cut, under the cross-fade, and then HOLDS: the
 * camera never moves in front of the viewer.
 *   App 0-7          the release appears ("Newest" + the NEW tag) and staging takes it at once
 *   Rollouts 7-11.3  a person approves production (the attention card, framed at the cut); the approved card slides out of the list
 *   Overview 11.3-24.5  the canary in us-east-1 (wave 1): stage 1, the test passes, stage 2, the health checks pass
 *   Environments 24.5-40  wave 2 (four regions) takes the build by itself, sped up, on the fleet picture; the loop dissolves into the opening
 */
import { LOOP } from './clock';
import { EV } from './scenario';

export { LOOP };
export type Surf = 'change' | 'rollouts' | 'gates' | 'overview' | 'history' | 'envs' | 'app';

/** the chapters (chips): label, [from, to), and the settled frame reduced motion seeks to */
export const CHAPTERS = [
	{ key: 'release', label: 'Release', from: 0, to: 2.2, settled: 1.9 },
	{ key: 'staging', label: 'Staging', from: 2.2, to: 7, settled: 6.2 },
	{ key: 'approve', label: 'Approve', from: 7, to: 11.3, settled: 9.6 },
	{ key: 'canary', label: 'Canary', from: 11.3, to: 24.5, settled: 17.4 },
	{ key: 'waves', label: 'Waves', from: 24.5, to: 40, settled: 34 }
] as const;
/** reduced motion rests on the whole fleet on the new build (the Environments page, every region healthy on 4.46.0-46) */
export const REST_T = 34;
export const chapterAt = (t: number) => Math.max(0, CHAPTERS.findIndex((c) => t >= c.from && t < c.to));
export const chapterFill = (t: number) => { const c = CHAPTERS[chapterAt(t)]; return Math.min(1, Math.max(0, (t - c.from) / (c.to - c.from))); };

/** which surface the window shows */
const SURF: [number, Surf][] = [[0, 'app'], [7, 'rollouts'], [11.3, 'overview'], [24.5, 'envs']];
export const surfAt = (t: number): Surf => [...SURF].reverse().find(([at]) => t >= at)![1];
/** surfaces whose cut comes within `ahead` story seconds (their chunks are fetched before the beat) */
export const upcoming = (t: number, ahead = 3): Surf[] => SURF.filter(([at]) => at > t && at - t <= ahead).map(([, s]) => s);
/** (retired) the loop end no longer fades to empty ground: the wrap cross-fades into the opening */
export const FADE_AT = 39.0;

/** camera: a keyframe is a framing that STARTS at `at`. `to` names a target the film resolves in the surface's DOM ('rest' = scale 1, origin). `dur` in ms; 0 = set at a cut, under the cross-fade (never seen moving). */
export type Move = { at: number; to: string; s: number; dur: number; ease: string; dim?: string; min?: number; desk?: boolean /* desktop only */; hole?: string /* the dim's hole when it is not the camera target */; dimOff?: number /* the light lifts at this second, the frame stays */ };
const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const CAMERA: Move[] = [
	{ at: 0, to: 'builds', s: 1.35, dur: 0, ease: EXPO }, /* the App page's Builds card, the release lands in it as its newest stop */
	{ at: 7, to: 'approve-stage', s: 1.5, dur: 0, ease: EXPO, dim: 'both', min: 15, hole: 'attention', dimOff: EV.approved - 0.03 }, /* the light lifts as the approved card leaves (a lit hole over the empty slot read as a blank card) */ /* the person's beat: the attention card and the room its confirm opens into, framed at the cut; the card is lit */
	{ at: 11.3, to: 'pipeline', s: 1.5, dur: 0, ease: EXPO }, /* the whole pipeline card, held through the canary */
	{ at: 24.5, to: 'rest', s: 1, dur: 0, ease: EXPO } /* the waves: the Environments page from its top, the fleet at once (Staging, Production's regions, what arrived in prod) */
];
export const moveAt = (t: number, phone = false): Move => [...CAMERA].reverse().find((m) => t >= m.at && !(phone && m.desk))!;

/** the presses: a person decides. `go` = cursor appears, `press` = the real click, `off` = it fades. */
export type Press = { id: 'approve' | 'confirm'; target: string; go: number; press: number; off: number };
export const PRESSES: Press[] = [
	{ id: 'approve', target: 'approve', go: 8.0, press: 8.8, off: 9.1 },
	{ id: 'confirm', target: 'approve-confirm', go: 9.8, press: 10.6, off: 10.85 }
];
export const pressAt = (t: number): Press | null => PRESSES.find((p) => t >= p.go && t < p.off) ?? null;
/** the approval confirm (ApprovalLayer) is open between the first press and the second */
export const confirmOpen = (t: number) => t >= 8.95 && t < 10.65; /* closes with the press, before the card leaves (10.7) */

/** the tally: checks passed and decisions by a person. Each entry is the second its CR passes. */
const PASSED = [EV.hcStagingErr, EV.hcStagingLat, EV.testPassed, EV.hcLat, EV.hcErr, ...[EV.w2Check0, EV.w2Check1, EV.w2Check2, EV.w2Check3].flatMap((x) => [x, x])];
const PEOPLE = [EV.approved];
export const tallyAt = (t: number) => ({ passed: PASSED.filter((x) => t >= x).length, failed: 0, people: PEOPLE.filter((x) => t >= x).length });
export const tallyShown = (t: number) => tallyAt(t);

/** Product reflows hidden under a still of the page before them (desktop: none; on the phone every reflow is covered and slides, Film.svelte) */
export const COVER_DESKTOP_AT: number[] = [];
/** the reflows that PLAY as a slide (flip.ts, by transform: no layout shift): the release's stop entering the Builds card, staging stepping onto it,
 *  and its pipeline closing again, the approved card leaving the Rollouts list, wave 2's region tiles opening and folding back into "N regions healthy" */
export const FLIP_AT = [EV.release, EV.stagingGo, EV.stagingDone, EV.approved, EV.w2Deploy, EV.w2Done0, EV.w2Done1, EV.w2Done2, EV.w2Done3];
export const flipEvent = (t: number, phone: boolean) => !phone && FLIP_AT.some((c) => Math.abs(t - c) < 0.35);
export function coverEvent(t: number, phone: boolean): boolean { return phone || COVER_DESKTOP_AT.some((c) => Math.abs(t - c) < 0.35); }

/** the NEW tag: from the release until the loop ends, beside the newest build's id in the Builds card; it shines once as it lands */
export const NEW_AT = EV.release;
