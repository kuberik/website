/**
 * HERO MODEL: which of the dashboard's own rows and facts the hero window shows at story time `t`. Pure functions over the
 * dashboard's view-model layer (data.ts) reading whatever `installLiveSource()` last installed; no display strings made here.
 * The reference page is /apps/checkout-api (`components/new/app/AppDetail.svelte`): header (name, build, pill, commit line, env strip)
 * over one opened place row (the Slipway). The only departure is WHICH place the header and Slipway follow: the app page follows
 * production (AP5); the landing follows the place the build is in, because the story is the build walking through them (SPEC 2.2).
 */
import { approvalTarget, type TRow } from '$lib/components/new/data';
import { rowAction } from '$lib/components/new/rollout-view';
import { appRowsOf, appIdentityOf, identityOf, laneOfApp, ledgerOfApp } from '../shared/app-model';
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
export const appRows = () => appRowsOf(APP);

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

export { identityOf, appIdentityOf };
/** the app page's env strip (PromotionLane) for the live source */
export const laneFor = () => laneOfApp(APP);

/** the Approve the Slipway offers on an approval row, and what pressing it would release (the confirm's target) */
export const actionOf = (row: Row) => (row.group === 'approval' ? rowAction(row) : null);
export const targetOf = (row: Row) => approvalTarget(row, 'incident');
export { MERGE };

/** the app page's Builds ledger (drawn when the focus place is at rest: the product opens no pipeline for a settled place) */
export const ledgerFor = () => ledgerOfApp(APP);
