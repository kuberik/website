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
import { APP, APPROVE_AT, ASKS_AT, DEP_OPEN, MERGE, TESTS_OPEN } from './scenario';

/** the step the build is at, by story time (BEATS.md): staging is one beat, every other one is a production step */
export type Where = 'staging' | 'approval' | 'contract' | 'tests' | 'canary' | 'checks' | 'waves' | 'done';
export const whereAt = (t: number): Where => (t < ASKS_AT ? 'staging' : t < APPROVE_AT ? 'approval' : t < DEP_OPEN ? 'contract' : t < TESTS_OPEN ? 'tests' : t < 25 ? 'canary' : t < 28 ? 'checks' : t < 33 ? 'waves' : 'done');

/** the seek chips (short nouns: the production steps) and the beat each one starts at / settles on (reduced motion shows the settled one) */
export const CHIPS = [
	{ key: 'staging', label: 'Staging', from: 2.0, to: 6.3, settled: 4.9 },
	{ key: 'approval', label: 'Approval', from: 6.4, to: 10.9, settled: 8.4 },
	{ key: 'contract', label: 'Contract', from: 11.0, to: 15.9, settled: 14.2 },
	{ key: 'tests', label: 'Tests', from: 16.0, to: 21.4, settled: 19.5 },
	{ key: 'canary', label: 'Canary', from: 21.5, to: 24.9, settled: 23.6 },
	{ key: 'checks', label: 'Checks', from: 25.0, to: 27.9, settled: 26.6 },
	{ key: 'waves', label: 'Waves', from: 28.0, to: 38.4, settled: 36.0 }
] as const;
export const LOOP = 40;
/** which chip is lit at `t`: the one whose span holds it; the first beats before the merge light none */
export const chipAt = (t: number): number => CHIPS.findIndex((c) => t >= c.from && t <= c.to);
/** `t` at which reduced motion rests */
export const REST_T = 8.4;

type Row = TRow;
export const appRows = () => appRowsOf(APP);

/** the row the Slipway opens at `t` */
export function focusRow(t: number): Row | null {
	const { rows, approval } = appRows();
	const w = whereAt(t);
	const pick = (f: (r: Row) => boolean) => rows.find(f) ?? null;
	const lead = () => pick((r) => r.tier === 'prod' && r.where === 'us-east-1') ?? pick((r) => r.tier === 'prod');
	switch (w) {
		case 'staging': return pick((r) => r.tier === 'staging');
		case 'approval': return approval ?? lead();
		case 'contract': case 'tests': return pick((r) => r.tier === 'prod' && r.group === 'held') ?? lead();
		case 'canary': case 'checks': return lead();
		case 'waves': return pick((r) => r.tier === 'prod' && r.regions.length > 1 && r.group !== 'held') ?? pick((r) => r.tier === 'prod' && r.group === 'moving') ?? lead();
		default: return lead();
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
