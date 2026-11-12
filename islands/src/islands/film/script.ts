/**
 * THE FILM'S SCRIPT: what is on screen, where the camera is, and what the chrome says, as pure functions of story second `t`.
 * It names things (surfaces, targets, overlays); Film.svelte resolves the names against the product's real DOM. Camera, dim, cursor, the NEW tag and
 * chrome are landing chrome; every word inside a surface is the product's.
 *
 * LANE 33 (owner 2026-11-12: "too hectic"): Railway's pacing. A shot's framing is set AT its cut, under the cross-fade, and then HOLDS: the
 * camera never moves in front of the viewer.
 * LANE 35 (owner 2026-11-12: "environments jumping"; dashboard #135): staging and the waves play on the CHANGE page, whose header and environment strip
 * stay put while only the marks change (nothing on screen moves position as state changes):
 *   App 0-2.2         the release is there from the first frame: the newest build on the Builds card, the NEW tag shines
 *   Change 2.2-7      #112's strip: staging takes the build at once (ring, checking, green)
 *   Rollouts 7-10.7   a person approves production (the attention card, framed at the cut); the cut lands on the confirm, before the list re-sorts
 *   Overview 10.7-19.9  the canary in us-east-1 (wave 1): stage 1, the test passes, stage 2, the health checks pass; the cut lands as it finishes
 *   Change 19.9-35.5  wave 1 green; waves 2 and 3 (two regions each) step onto the release by themselves, sped up; the loop dissolves into the opening
 */
import { LOOP } from './clock';
import { EV } from './scenario';

export { LOOP };
export type Surf = 'change' | 'rollouts' | 'gates' | 'overview' | 'history' | 'envs' | 'app';

/** the chapters (chips): label, [from, to), and the settled frame reduced motion seeks to */
export const CHAPTERS = [
	{ key: 'release', label: 'Release', from: 0, to: 2.2, settled: 1.9 },
	{ key: 'staging', label: 'Staging', from: 2.2, to: 7, settled: 6.2 },
	{ key: 'approve', label: 'Approve', from: 7, to: EV.approved, settled: 9.6 },
	{ key: 'canary', label: 'Canary', from: EV.approved, to: EV.us1Done, settled: 15.4 },
	{ key: 'waves', label: 'Waves', from: EV.us1Done, to: LOOP, settled: 29.5 }
] as const;
/** reduced motion rests on the whole fleet on the new build (the Change page's strip, every site green on 4.46.0-46) */
export const REST_T = 29.5;
export const chapterAt = (t: number) => Math.max(0, CHAPTERS.findIndex((c) => t >= c.from && t < c.to));
export const chapterFill = (t: number) => { const c = CHAPTERS[chapterAt(t)]; return Math.min(1, Math.max(0, (t - c.from) / (c.to - c.from))); };

/** which surface the window shows */
const SURF: [number, Surf][] = [[0, 'app'], [2.2, 'change'], [7, 'rollouts'], [EV.approved, 'overview'], [EV.us1Done, 'change']];
export const surfAt = (t: number): Surf => [...SURF].reverse().find(([at]) => t >= at)![1];
/** surfaces whose cut comes within `ahead` story seconds (their chunks are fetched before the beat) */
export const upcoming = (t: number, ahead = 3): Surf[] => SURF.filter(([at]) => at > t && at - t <= ahead).map(([, s]) => s);
/** (retired) the loop end no longer fades to empty ground: the wrap cross-fades into the opening */
export const FADE_AT = LOOP - 1;

/** camera: a keyframe is a framing that STARTS at `at`. `to` names a target the film resolves in the surface's DOM ('rest' = scale 1, origin). `dur` in ms; 0 = set at a cut, under the cross-fade (never seen moving). */
export type Move = { at: number; to: string; s: number; dur: number; ease: string; dim?: string; min?: number; desk?: boolean /* desktop only */; hole?: string /* the dim's hole when it is not the camera target */; dimOff?: number /* the light lifts at this second, the frame stays */; beside?: string /* the frame's right edge stays left of this element */; rows?: string /* the frame's foot lands on a boundary of these fixed-pitch rows */; h?: number /* canvas px: frame the target as if it were this tall (a card that grows step by step frames the same at every second) */ };
const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const CAMERA: Move[] = [
	{ at: 0, to: 'app-builds', s: 1.35, dur: 0, ease: EXPO }, /* the App page's Builds card, the release on it as its newest stop from the first frame */
	{ at: 2.2, to: 'change-strip', s: 1.75, dur: 0, ease: EXPO, rows: '.cd-history li', beside: '.cd-rail' }, /* the Change page's header and environment strip: staging's mark turns */
	{ at: 7, to: 'approve-stage', s: 1.5, dur: 0, ease: EXPO, dim: 'both', min: 15, hole: 'attention' }, /* the person's beat: the attention card and the room its confirm opens into, framed at the cut; the card is lit */
	{ at: EV.approved, to: 'pipeline', s: 1.5, dur: 0, ease: EXPO, h: 424 }, /* h: the card's tallest (stage 1 with the passed test and Continue, 1440): framed whole from the cut, it grows into the frame */ /* the whole pipeline card, held through the canary */
	{ at: EV.us1Done, to: 'change-strip', s: 1.75, dur: 0, ease: EXPO, rows: '.cd-history li', beside: '.cd-rail' } /* the waves, on the same strip: each site's mark turns, a wave at a time */
];
export const moveAt = (t: number, phone = false): Move => [...CAMERA].reverse().find((m) => t >= m.at && !(phone && m.desk))!;

/** the presses: a person decides. `go` = cursor appears, `press` = the real click, `off` = it fades. */
export type Press = { id: 'approve' | 'confirm'; target: string; go: number; press: number; off: number };
export const PRESSES: Press[] = [
	{ id: 'approve', target: 'approve', go: 8.0, press: 8.8, off: 9.1 },
	{ id: 'confirm', target: 'approve-confirm', go: 9.7, press: 10.4, off: 10.6 } /* lane 36 (AD r1 P1-1): the dot is gone 0.15 s after the press, before the cut at EV.approved (10.7) */
];
export const pressAt = (t: number): Press | null => PRESSES.find((p) => t >= p.go && t < p.off) ?? null;
/** the approval confirm (ApprovalLayer) is open between the first press and the second */
export const confirmOpen = (t: number) => t >= 8.95 && t < EV.approved; /* lane 36 (AD r1 P1-1): open through the press up to the cut; the cut's still carries it (Film.svelte takeSnap), so the shot ends on the pressed confirm, never on the card asking again */

/** the tally: checks passed and decisions by a person. Each entry is the second its CR passes. */
const PASSED = [EV.hcStagingErr, EV.hcStagingLat, EV.testPassed, EV.hcLat, EV.hcErr, ...[EV.w2Check0, EV.w2Check1, EV.w3Check0, EV.w3Check1].flatMap((x) => [x, x])];
const PEOPLE = [EV.approved];
export const tallyAt = (t: number) => ({ passed: PASSED.filter((x) => t >= x).length, failed: 0, people: PEOPLE.filter((x) => t >= x).length });
export const tallyShown = (t: number) => tallyAt(t);

/** Product reflows hidden under a still of the page before them (desktop: none; on the phone every reflow is covered and slides, Film.svelte) */
export const COVER_DESKTOP_AT: number[] = [];
/** the reflows that PLAY as a slide (flip.ts, by transform: no layout shift): the release's stop entering the Builds card, staging stepping onto it,
 *  and its pipeline closing again, the approved card leaving the Rollouts list, each wave's regions stepping onto the release (rows travel, flip.ts) */
export const FLIP_AT: number[] = [EV.w2Deploy, EV.w3Deploy]; /* lane 35: the release is there at t=0, staging plays on the Change page's fixed strip, the approve beat cuts before its list re-sorts; only a wave starting adds its event at the top of History (newest first), and the rows under it slide down one row */
export const flipEvent = (t: number, phone: boolean) => !phone && FLIP_AT.some((c) => Math.abs(t - c) < 0.35);
export function coverEvent(t: number, phone: boolean): boolean { return phone || COVER_DESKTOP_AT.some((c) => Math.abs(t - c) < 0.35); }

/** the NEW tag: on the newest build's line in the Builds card from the first frame; it shines once, after the loop's wrap dissolve has cleared */
export const NEW_AT = EV.release;
export const NEW_SHINE = 0.5;
