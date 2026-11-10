/**
 * HERO MODEL: which of the dashboard's own rows and facts the hero window shows at story time `t`. Pure functions over the
 * dashboard's view-model layer (data.ts) reading whatever `installLiveSource()` last installed; no display strings made here.
 * The reference page is /apps/checkout-api (`components/new/app/AppDetail.svelte`): header (name, build, pill, commit line, env strip)
 * over one opened place row (the Slipway). The only departure is WHICH place the header and Slipway follow: the app page follows
 * production (AP5); the landing follows the place the build is in, because the story is the build walking through them (SPEC 2.2).
 */
import { apps, placeHolds, rowsOf, stepsOf, deployedBuild, waitingBuild, tabPill, approvalTarget, ago, type TRow, type PlaceHold } from '$lib/components/new/data';
import { rowAction } from '$lib/components/new/rollout-view';
import { laneOf } from '$lib/components/new/Footprint.svelte';
import { APP, APPROVE_AT, ASKS_AT, MERGE } from './scenario';

/** the place the build is "in", by story time (SPEC 2.3 `current`) */
export type Where = 'dev' | 'staging' | 'ask' | 'wave1' | 'wave2' | 'done';
export const whereAt = (t: number): Where => (t < 8 ? 'dev' : t < ASKS_AT ? 'staging' : t < APPROVE_AT ? 'ask' : t < 24.5 ? 'wave1' : t < 30 ? 'wave2' : 'done');

/** the seek chips of SPEC 2.3 and the beat each one starts at / settles on (reduced motion shows the settled one) */
export const CHIPS = [
	{ key: 'merged', label: 'Merged', from: 2.0, to: 4.9, settled: 2.2 },
	{ key: 'dev', label: 'Dev', from: 5.0, to: 7.9, settled: 7.7 },
	{ key: 'staging', label: 'Staging', from: 8.0, to: 13.9, settled: 13.7 },
	{ key: 'approval', label: 'Approval', from: 14.0, to: 19.3, settled: 16.0 },
	{ key: 'production', label: 'Production', from: 19.4, to: 34.4, settled: 33.0 }
] as const;
export const LOOP = 36;
/** which chip is lit at `t`: the one whose span holds it; the first beats before the merge light none (SPEC beat 0 and 17) */
export const chipAt = (t: number): number => CHIPS.findIndex((c) => t >= c.from && t <= c.to);
/** `t` at which reduced motion rests (beat 8) */
export const REST_T = 16.0;

type Row = TRow;
/** AppDetail's `rowFor`, for one place: the model's row where the place has one, else a closed healthy place */
function rowFor(p: PlaceHold): Row {
	const un = rowsOf('incident', p.tier, p.label).find((r) => r.app === APP);
	if (un) return un;
	const dep = deployedBuild({ app: APP, href: p.href, version: p.runs });
	return {
		key: `${APP}@${p.env}`, app: APP, tier: p.tier, where: p.place, regions: p.tier === 'prod' ? [p.label] : [], state: p.state, group: 'rest', glyph: 'rest', word: '', change: null,
		version: p.runs, since: dep.at, href: p.href, needsYou: false, lead: false, action: null, cause: null, pipeline: null,
		steps: stepsOf({ state: 'healthy', pipeline: null }).map((s) => ({ ...s, state: 'done' as const })), failure: null, place: p.place, deployedAt: dep.at, regionsOf: null, stillChecking: false
	} as unknown as Row;
}

/** every row the app has in the live source: the roster's rows (folded per region where it folds them) first, then closed healthy places */
export function appRows(): { rows: Row[]; approval: Row | null } {
	const A = apps('incident');
	const fromGroups = (A.R.groups.flatMap((g) => g.rows) as Row[]).filter((r) => r.app === APP);
	const closed = (placeHolds(APP, 'incident') as PlaceHold[]).filter((p) => !fromGroups.some((r) => r.href === p.href || r.regions.includes(p.label) && r.tier === p.tier)).map(rowFor);
	return { rows: [...fromGroups, ...closed], approval: fromGroups.find((r) => r.group === 'approval') ?? null };
}

/** the row the Slipway opens at `t` */
export function focusRow(t: number): Row | null {
	const { rows, approval } = appRows();
	const w = whereAt(t);
	const pick = (f: (r: Row) => boolean) => rows.find(f) ?? null;
	switch (w) {
		case 'dev': return pick((r) => r.tier === 'dev');
		case 'staging': return pick((r) => r.tier === 'staging');
		case 'ask': return approval ?? pick((r) => r.tier === 'prod');
		case 'wave1': return pick((r) => r.tier === 'prod' && r.where === 'us-east-1') ?? pick((r) => r.tier === 'prod');
		case 'wave2': return pick((r) => r.tier === 'prod' && r.regions.length > 1 && r.group !== 'held') ?? pick((r) => r.tier === 'prod' && r.group === 'moving') ?? pick((r) => r.tier === 'prod');
		default: return pick((r) => r.tier === 'prod' && r.where === 'us-east-1') ?? pick((r) => r.tier === 'prod');
	}
}

/** the app page's header facts for `row`: the build in focus (a gated place names the build that WAITS), its tab pill, its commit */
export function identityOf(row: Row): { build: string; pill: { word: string; role: string } | null; commit: { title: string; who: string | null } | null; age: string } {
	const gated = row.state === 'awaiting-approval' || row.state === 'held-by-rule';
	const wb = gated ? waitingBuild(row) : null;
	const dep = deployedBuild(row);
	const pill = gated ? null : tabPill(row);
	const c = wb ? { title: wb.title ?? '', who: wb.author } : dep.title ? { title: dep.title, who: dep.author } : null;
	return { build: wb?.build ?? dep.build, pill: pill ? { word: pill.word, role: pill.role } : null, commit: c, age: ago(wb ? wb.since : dep.at) };
}

/** the app page's env strip (PromotionLane) for the live source */
export function laneFor() {
	const A = apps('incident');
	const item = A.items.find((a) => a.app === APP);
	return item ? laneOf(item, A.R.c.m as never, A.R.c.events as never).lane : null;
}

/** the Approve the Slipway offers on an approval row, and what pressing it would release (the confirm's target) */
export const actionOf = (row: Row) => (row.group === 'approval' ? rowAction(row) : null);
export const targetOf = (row: Row) => approvalTarget(row, 'incident');
export { MERGE };
