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
export type Surf = 'change' | 'rollouts' | 'gates' | 'overview' | 'history' | 'envs' | 'app' | 'stg';

/** the chapters (chips): label, [from, to), and the settled frame reduced motion seeks to */
export const CHAPTERS = [ /* scene lane 4 (owner item 13): health checks come after the canary */
	{ key: 'release', label: 'New release', from: 0, to: EV.devGo, settled: 1.9 },
	{ key: 'staging', label: 'Staging', from: EV.devGo, to: EV.gatesCut, settled: 4.6 },
	{ key: 'gates', label: 'Gates', from: EV.gatesCut, to: EV.ovCut, settled: 9.7 },
	{ key: 'canary', label: 'Canary', from: EV.ovCut, to: EV.step2Done, settled: 14.6 },
	{ key: 'health', label: 'Health checks', from: EV.step2Done, to: LOOP, settled: 19.2 }
	/* owner item 8: the all-sites beat returns on the App page's Pipeline tab (design/app-pipeline-tab); the Change page's History list is out */
] as const;
/** reduced motion rests on the whole fleet on the new build (the App page: every environment green on 4.46.0-46) */
export const REST_T = 19.6; /* scene lane 4: prod's bake has completed (the last beat's end) */
export const chapterAt = (t: number) => Math.max(0, CHAPTERS.findIndex((c) => t >= c.from && t < c.to));
export const chapterFill = (t: number) => { const c = CHAPTERS[chapterAt(t)]; return Math.min(1, Math.max(0, (t - c.from) / (c.to - c.from))); };

/** which surface the window shows: two views (RAILWAY.md: one app, few views, the full-view swap is a short cross-fade) */
/* scene lane 3 (owner checklist): the App page (the release, NEW), staging's rollout page (staging deploys quickly, then its health checks hold for the whole
   bake), the prod rollout's Gates tab (the person approves there) and its Overview (canary and tests), then the change's page (every site, wave by wave) */
const SURF: [number, Surf][] = [[0, 'app'], [EV.devGo, 'stg'], [EV.gatesCut, 'gates'], [EV.ovCut, 'overview']];
export const surfAt = (t: number): Surf => [...SURF].reverse().find(([at]) => t >= at)![1];
/** surfaces whose cut comes within `ahead` story seconds (their chunks are fetched before the beat) */
export const upcoming = (t: number, ahead = 3): Surf[] => SURF.filter(([at]) => at > t && at - t <= ahead).map(([, s]) => s);
export const FADE_AT = LOOP - 1;

/** camera: a keyframe is a framing that STARTS at `at`. Scene lane 2: NO zoom (s = 1 always; RAILWAY.md section 3). A keyframe only says where the page is scrolled, set at a cut. */
export type Move = { at: number; to: string; s: number; dur: number; ease: string; dim?: string; min?: number; desk?: boolean; hole?: string; dimOff?: number; beside?: string; rows?: string; h?: number; foot?: boolean /* scene lane 4: frame so the target is the window's foot */; pad?: number /* the room above a top-framed target (default 24) */; stay?: boolean /* scene lane 2: s = 1 and the page is not scrolled; only the dim's hole moves */ };
const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const CAMERA: Move[] = [ /* scene lane 3: one fixed scale; a framing is set AT a cut or a chapter boundary (dur 0) and holds */
	{ at: 0, to: 'rest', s: 1, dur: 0, ease: EXPO },
	{ at: EV.devGo, to: 'rest', s: 1, dur: 0, ease: EXPO }, /* staging's rollout page: its strip and pipeline, quickly */
	{ at: EV.gatesCut, to: 'attention', s: 1, dur: 0, ease: EXPO }, /* the phone: the Release approval card at the top of the frame, the confirm opens as a sheet */
	{ at: EV.gatesCut, to: 'gates-graph', s: 1, foot: true, desk: true, dur: 0, ease: EXPO }, /* the prod rollout's Gates tab: every gate (staging's promotion, Release approval, Business hours) and this rollout, whole, at the frame's foot */
	{ at: EV.ovCut, to: 'pipeline', s: 1, foot: true, dur: 0, ease: EXPO }, /* its Overview: the pipeline card through the canary */
	{ at: EV.step2Done, to: 'health-checks', s: 1, pad: 10, dur: 0, ease: EXPO }, /* scene lane 4: the same page, cut to its Health checks card: kustomization, error-rate, latency-p99 pass one by one */
	{ at: EV.bakeCut, to: 'bake', s: 1, dur: 0, ease: EXPO }, /* the phone: the Check step's bake line and its timer card */
	{ at: EV.bakeCut, to: 'pipeline', s: 1, foot: true, desk: true, dur: 0, ease: EXPO }, /* then back to the pipeline: its Check step holds the bake (the timer bar) to the end */
];
export const moveAt = (t: number, phone = false): Move => [...CAMERA].reverse().find((m) => t >= m.at && !(phone && m.desk))!;

/** the presses: a person decides. `go` = cursor appears, `press` = the real click, `off` = it fades. */
export type Press = { id: 'approve' | 'confirm'; target: string; go: number; press: number; off: number };
export const PRESSES: Press[] = [
	{ id: 'approve', target: 'approve', go: 6.3, press: 7.0, off: 7.3 },
	{ id: 'confirm', target: 'approve-confirm', go: 7.7, press: 8.4, off: 8.6 }
];
export const pressAt = (t: number): Press | null => PRESSES.find((p) => t >= p.go && t < p.off) ?? null;
/** the approval confirm (ApprovalLayer) is open between the first press and the approval landing */
export const confirmOpen = (t: number) => t >= 7.15 && t < EV.approved;
export const CONFIRM_SURF: Surf = 'gates';

/** the tally: checks passed and decisions by a person. Each entry is the second its CR passes. */
const PASSED = [EV.hcDevErr, EV.hcDevErr, EV.hcDevLat, EV.hcStagingErr, EV.hcStagingErr, EV.hcStagingLat, EV.testPassed, EV.hcKust, EV.hcErr, EV.hcLat, ...[EV.w2Check0, EV.w2Check1, EV.w3Check0, EV.w3Check1].flatMap((x) => [x, x, x])]; /* three health checks per place (kustomization, error-rate, latency-p99) and the canary's test */
const PEOPLE = [EV.approved];
export const tallyAt = (t: number) => ({ passed: PASSED.filter((x) => t >= x).length, failed: 0, people: PEOPLE.filter((x) => t >= x).length });
export const tallyShown = (t: number) => tallyAt(t);

/** Product reflows hidden under a still of the page before them (desktop: none; on the phone every reflow is covered and slides, Film.svelte) */
export const COVER_DESKTOP_AT: number[] = [];
/** the reflows that PLAY as a slide (flip.ts, by transform: no layout shift): the release's stop entering the Builds card, staging stepping onto it,
 *  and its pipeline closing again, the approved card leaving the Rollouts list, each wave's regions stepping onto the release (rows travel, flip.ts) */
export const FLIP_AT: number[] = []; /* scene lane 3: the only reflow on screen: History logs dev's then staging's deploy at its top, and the rows under it slide down one row (flip.ts) */ /* lane 35: the release is there at t=0, staging plays on the Change page's fixed strip, the approve beat cuts before its list re-sorts; only a wave starting adds its event at the top of History (newest first), and the rows under it slide down one row */
export const flipEvent = (t: number, phone: boolean) => !phone && FLIP_AT.some((c) => Math.abs(t - c) < 0.35);
export function coverEvent(t: number, phone: boolean): boolean { return phone || COVER_DESKTOP_AT.some((c) => Math.abs(t - c) < 0.35); }

/** the NEW tag: on the newest build's line in the Builds card from the first frame; it shines once, after the loop's wrap dissolve has cleared */
export const NEW_AT = EV.release;
export const NEW_SHINE = 0.5;
