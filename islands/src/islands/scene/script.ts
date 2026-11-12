/**
 * THE HERO SCENE's script (landing scene lane 1, owner 2026-11-12): one build promoted across environments, drawn as ONE object that changes state.
 * Spine: the environment strip dev -> staging -> prod (the dashboard's EnvRow). The build's chip travels along it; one fixed panel under it explains each hop.
 *   Released -> dev (quick) | dev -> staging: health checks + bake | staging -> prod: gates (» staging, Business hours, Approval + a click)
 *   | prod wave 1: canary (traffic 10% -> canary tests pass -> 50% -> 100%) | prod's other sites fill (sped up) | calm hold, soft dissolve, loop.
 * Everything here is a pure function of story time `t` (seconds): seeking, reduced motion and the 10 fps sheets all read the same frame.
 * Layout never moves: the strip's shape is topology, the panel is one fixed slot; only marks, words, the bar and the chip's x change.
 */
import type { SiteState } from '$lib/components/SiteMark.svelte';

export const LOOP = 21.2;
/** reduced motion rests here: every place green, the panel on prod's sites */
export const REST_T = 20.3;
/** the wrap: the scene fades out over the last DISSOLVE seconds and back in after t=0 */
export const DISSOLVE = 0.45;

export const BUILD = '4.46.0-46';
export const PREV = '4.45.0-45';
export const TITLE = 'Save cards at checkout';
export const AUTHOR = 'Olivia Bennett';
export const APPROVER = 'Noah Carter';

export type Phase = 'release' | 'health' | 'gates' | 'canary' | 'sites';
export const CHAPTERS: { key: Phase; label: string; from: number; settled: number }[] = [
	{ key: 'release', label: 'Released', from: 0, settled: 1.9 },
	{ key: 'health', label: 'Health checks', from: 2.2, settled: 7.0 },
	{ key: 'gates', label: 'Gates', from: 7.1, settled: 10.1 },
	{ key: 'canary', label: 'Canary', from: 10.9, settled: 14.9 },
	{ key: 'sites', label: 'Every site', from: 15.1, settled: REST_T }
];
export const chapterAt = (t: number) => { let i = 0; CHAPTERS.forEach((c, j) => { if (t >= c.from) i = j; }); return i; };
export const chapterFill = (t: number) => {
	const i = chapterAt(t), a = CHAPTERS[i].from, b = i + 1 < CHAPTERS.length ? CHAPTERS[i + 1].from : LOOP;
	return Math.max(0, Math.min(1, (t - a) / (b - a)));
};

/* ---- the events (story seconds) ---- */
export const EV = {
	devDeploy: 0.5, devCheck: 0.95, devDone: 1.7,
	hop1: 2.2, stgDeploy: 2.75, stgCheck: 3.15,
	hc: [3.6, 4.05, 4.5] as number[], bakeFrom: 3.15, bakeTo: 6.6, stgDone: 6.8,
	gates: 7.1, promo: 7.55, ptrIn: 8.35, press: 9.35, approved: 9.5, allPassed: 9.8,
	hop2: 10.0, w1Deploy: 10.55, w1Check: 10.95,
	pct10: 10.9, tests: [11.4, 11.75, 12.1] as number[], pct50: 12.55, pct100: 13.55, w1Done: 14.6,
	sites: 15.1,
	w2: { deploy: 15.35, check: 15.7, done: [16.35, 16.75] as number[] },
	w3: { deploy: 16.9, check: 17.2, done: [17.85, 18.25] as number[] }
};

export const phaseAt = (t: number): Phase => (t < EV.hop1 ? 'release' : t < EV.gates ? 'health' : t < 10.9 ? 'gates' : t < EV.sites ? 'canary' : 'sites');

/* ---- the strip ---- */
export type Tier = 'dev' | 'staging' | 'prod';
export const TIERS: Tier[] = ['dev', 'staging', 'prod'];
/** prod's sites in topology order (wave, leader, name): the shape never changes */
export const PROD_SITES: { name: string; wave: number }[] = [
	{ name: 'us-east-1', wave: 1 },
	{ name: 'eu-west-1', wave: 2 },
	{ name: 'us-east-2', wave: 2 },
	{ name: 'ap-southeast-2', wave: 3 },
	{ name: 'eu-central-1', wave: 3 }
];

const step = (t: number, deploy: number, check: number, done: number, before: SiteState = 'notreached'): SiteState =>
	t < deploy ? before : t < check ? 'deploying' : t < done ? 'checking' : 'done';

export function siteState(t: number, tier: Tier, site = ''): SiteState {
	if (tier === 'dev') return step(t, EV.devDeploy, EV.devCheck, EV.devDone);
	if (tier === 'staging') return step(t, EV.stgDeploy, EV.stgCheck, EV.stgDone);
	/* prod: not reached while the gates hold (AD r1: the hold lives on the Approval row, not in orange marks), then wave 1 (the canary), then waves 2 and 3 */
	const i = PROD_SITES.findIndex((s) => s.name === site);
	const s = PROD_SITES[i];
	if (s.wave === 1) return step(t, EV.w1Deploy, EV.w1Check, EV.w1Done);
	const w = s.wave === 2 ? EV.w2 : EV.w3;
	const k = PROD_SITES.filter((x) => x.wave === s.wave).indexOf(s);
	return step(t, w.deploy, w.check, w.done[k]);
}

/** where the build's chip sits (the tier it runs in or is entering) */
export const chipAt = (t: number): Tier => (t < EV.hop1 ? 'dev' : t < EV.hop2 ? 'staging' : 'prod');

export const WORD: Record<SiteState, string> = { done: 'Healthy', checking: 'Checking', deploying: 'Deploying', held: 'Held', approval: 'Waiting for approval', failed: 'Failed', stuck: 'Stuck', notreached: 'Not reached', notaffected: 'Not affected' };

/* ---- the panel ---- */
export type Check = { name: string; state: 'pending' | 'passing' | 'idle' };
const tick = (t: number, at: number, from: number): Check['state'] => (t < from ? 'idle' : t < at ? 'pending' : 'passing');

export const healthChecks = (t: number): Check[] =>
	['Kustomization ready', 'error-rate', 'latency-p99'].map((name, i) => ({ name, state: tick(t, EV.hc[i], EV.stgCheck) }));

/** the bake: 5 minutes of product time drawn over bakeFrom..bakeTo story seconds */
export const BAKE_S = 300;
export function bake(t: number): { pct: number; text: string; done: boolean } {
	const f = Math.max(0, Math.min(1, (t - EV.bakeFrom) / (EV.bakeTo - EV.bakeFrom)));
	if (t < EV.bakeFrom) return { pct: 0, text: 'Bake 5m: every check must stay healthy', done: false };
	if (f >= 1) return { pct: 100, text: 'Healthy for the whole 5m bake, not for a moment', done: true };
	const left = Math.ceil((1 - f) * BAKE_S / 10) * 10, m = Math.floor(left / 60), s = left % 60;
	return { pct: f * 100, text: `${m ? m + 'm ' : ''}${s ? s + 's' : ''} remaining · every check must stay healthy`.replace(/^ /, ''), done: false };
}

export type GateRow = { key: 'promotion' | 'hours' | 'approval'; state: 'pending' | 'passing' | 'waiting' };
export const gates = (t: number): GateRow[] => [
	{ key: 'promotion', state: t < EV.promo ? 'pending' : 'passing' },
	{ key: 'hours', state: 'passing' },
	{ key: 'approval', state: t < EV.approved ? 'waiting' : 'passing' }
];
export const approveShown = (t: number) => t < EV.approved;
/** the one human act: the pointer arrives, presses Approve, leaves (desktop arrow, phone touch disc) */
export const pointer = (t: number): { on: boolean; press: boolean; atButton: boolean } => ({
	on: t >= EV.ptrIn && t < EV.press + 0.25, /* AD r1: gone within 250 ms of the press, never resting on words */
	press: t >= EV.press && t < EV.press + 0.2,
	atButton: t >= EV.ptrIn + 0.15
});

/** canary traffic share of the new build in wave 1 (product steps 10 / 50 / 100) */
export const traffic = (t: number) => (t < EV.pct10 ? 0 : t < EV.pct50 ? 10 : t < EV.pct100 ? 50 : 100);
export const canaryStep = (t: number) => (t < EV.pct50 ? 1 : t < EV.pct100 ? 2 : 3);
export const canaryTests = (t: number): Check[] =>
	['checkout-smoke', 'payment-e2e', 'saved-cards-e2e'].map((name, i) => ({ name, state: tick(t, EV.tests[i], EV.pct10) }));
