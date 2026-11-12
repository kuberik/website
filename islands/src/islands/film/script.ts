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
	{ key: 'release', label: 'Released', from: 0, to: EV.devGo, settled: 1.9 },
	{ key: 'staging', label: 'Dev, staging', from: EV.devGo, to: EV.promo, settled: 6.6 },
	{ key: 'approve', label: 'Approval', from: EV.promo, to: EV.deploy, settled: 9.4 },
	{ key: 'canary', label: 'Canary', from: EV.deploy, to: EV.us1Done, settled: 15.6 },
	{ key: 'waves', label: 'Every site', from: EV.us1Done, to: LOOP, settled: 28.5 }
] as const;
/** reduced motion rests on the whole fleet on the new build (the App page: every environment green on 4.46.0-46) */
export const REST_T = 28.5;
export const chapterAt = (t: number) => Math.max(0, CHAPTERS.findIndex((c) => t >= c.from && t < c.to));
export const chapterFill = (t: number) => { const c = CHAPTERS[chapterAt(t)]; return Math.min(1, Math.max(0, (t - c.from) / (c.to - c.from))); };

/** which surface the window shows: two views (RAILWAY.md: one app, few views, the full-view swap is a short cross-fade) */
const SURF: [number, Surf][] = [[0, 'app'], [EV.deploy, 'overview']];
export const surfAt = (t: number): Surf => [...SURF].reverse().find(([at]) => t >= at)![1];
/** surfaces whose cut comes within `ahead` story seconds (their chunks are fetched before the beat) */
export const upcoming = (t: number, ahead = 3): Surf[] => SURF.filter(([at]) => at > t && at - t <= ahead).map(([, s]) => s);
export const FADE_AT = LOOP - 1;

/** camera: a keyframe is a framing that STARTS at `at`. Scene lane 2: NO zoom (s = 1 always; RAILWAY.md section 3). A keyframe only says where the page is scrolled, set at a cut. */
export type Move = { at: number; to: string; s: number; dur: number; ease: string; dim?: string; min?: number; desk?: boolean; hole?: string; dimOff?: number; beside?: string; rows?: string; h?: number; stay?: boolean /* scene lane 2: s = 1 and the page is not scrolled; only the dim's hole moves */ };
const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const CAMERA: Move[] = [
	{ at: 0, to: 'rest', s: 1, dur: 0, ease: EXPO },
	{ at: EV.deploy, to: 'rest', s: 1, dur: 0, ease: EXPO }, /* the cut lands on the whole rollout page */
	{ at: EV.deploy + 0.7, to: 'pipeline', s: 1, stay: true, dur: 300, ease: EXPO, dim: 'both' }, /* RAILWAY.md 3/7: focus by dimming the rest, never by zoom: the pipeline card is lit through the canary */
	{ at: EV.us1Done + 0.4, to: 'env-strip', s: 1, stay: true, dur: 300, ease: EXPO, dim: 'both' } /* then the header's strip: the waves fill its prod dots */
];
export const moveAt = (t: number, phone = false): Move => [...CAMERA].reverse().find((m) => t >= m.at && !(phone && m.desk))!;

/** the presses: a person decides. `go` = cursor appears, `press` = the real click, `off` = it fades. */
export type Press = { id: 'approve' | 'confirm'; target: string; go: number; press: number; off: number };
export const PRESSES: Press[] = [
	{ id: 'approve', target: 'approve', go: 8.2, press: 8.9, off: 9.2 },
	{ id: 'confirm', target: 'approve-confirm', go: 9.7, press: 10.6, off: 10.8 }
];
export const pressAt = (t: number): Press | null => PRESSES.find((p) => t >= p.go && t < p.off) ?? null;
/** the approval confirm (ApprovalLayer) is open between the first press and the approval landing */
export const confirmOpen = (t: number) => t >= 9.05 && t < EV.approved;
export const CONFIRM_SURF: Surf = 'app';

/** the tally: checks passed and decisions by a person. Each entry is the second its CR passes. */
const PASSED = [EV.hcDevErr, EV.hcDevLat, EV.hcStagingErr, EV.hcStagingLat, EV.testPassed, EV.hcLat, EV.hcErr, ...[EV.w2Check0, EV.w2Check1, EV.w3Check0, EV.w3Check1].flatMap((x) => [x, x])];
const PEOPLE = [EV.approved];
export const tallyAt = (t: number) => ({ passed: PASSED.filter((x) => t >= x).length, failed: 0, people: PEOPLE.filter((x) => t >= x).length });
export const tallyShown = (t: number) => tallyAt(t);

/** Product reflows hidden under a still of the page before them (desktop: none; on the phone every reflow is covered and slides, Film.svelte) */
export const COVER_DESKTOP_AT: number[] = [];
/** the reflows that PLAY as a slide (flip.ts, by transform: no layout shift): the release's stop entering the Builds card, staging stepping onto it,
 *  and its pipeline closing again, the approved card leaving the Rollouts list, each wave's regions stepping onto the release (rows travel, flip.ts) */
export const FLIP_AT: number[] = [EV.devGo, EV.stagingGo, EV.promo]; /* lane 35: the release is there at t=0, staging plays on the Change page's fixed strip, the approve beat cuts before its list re-sorts; only a wave starting adds its event at the top of History (newest first), and the rows under it slide down one row */
export const flipEvent = (t: number, phone: boolean) => !phone && FLIP_AT.some((c) => Math.abs(t - c) < 0.35);
export function coverEvent(t: number, phone: boolean): boolean { return phone || COVER_DESKTOP_AT.some((c) => Math.abs(t - c) < 0.35); }

/** the NEW tag: on the newest build's line in the Builds card from the first frame; it shines once, after the loop's wrap dissolve has cleared */
export const NEW_AT = EV.release;
export const NEW_SHINE = 0.5;
