/**
 * HEALTH MODEL (SPEC 3): which of the dashboard's own rows and facts the health window shows at story time `t`. Reference page: the rollout tab
 * (`/rollouts/<cluster>/<ns>/<name>`): header, the failing statement, the Deployment pipeline (Slipway) beside the Health checks card. The window follows STAGING all
 * story long (the place the build is checked in). Everything printed is read from the product's own view-models over the installed source.
 */
import { rowAction } from '$lib/components/new/rollout-view';
import type { TRow } from '$lib/components/new/data';
import { appRowsOf } from '../shared/app-model';
import { APP, LOOP, T } from './scenario';
export { LOOP };

export const CHIPS = [
	{ key: 'checking', label: 'Checking', from: T.checking, to: T.breaks - 0.1, settled: 4.5 },
	{ key: 'fails', label: 'Check fails', from: T.breaks, to: T.press - 0.1, settled: 10 },
	{ key: 'rolled', label: 'Rolled back', from: T.press, to: LOOP - 0.6, settled: 20 }
] as const;
/** which chip is lit at `t` (none before the first check and not at the loop's seam) */
export const chipAt = (t: number): number => CHIPS.findIndex((c) => t >= c.from && t <= c.to);
/** reduced motion rests on beat 5: the failed frame (SPEC 3.4) */
export const REST_T = 10;

/** the staging row: the place the story is about */
export const stagingRow = (): TRow | null => appRowsOf(APP).rows.find((r) => r.tier === 'staging') ?? null;
/** the Roll back the product offers on the failed place (the banner owns it once; the pipeline does not repeat it) */
export const rollbackOf = (row: TRow) => (row.group === 'failed' ? rowAction(row) : null);

/** the pointer's one press (SPEC 3.2 beats 6-7): where it points and when it clicks */
export type Choreo = { target: 'rollback' | null; visible: boolean; press: boolean };
const PRESS = 0.15;
export const choreoAt = (t: number): Choreo => ({ target: t >= T.press && t < T.rollback + 0.3 ? 'rollback' : null, visible: t >= T.press && t < T.rollback + 0.3, press: t >= T.rollback - 0.15 && t < T.rollback - 0.15 + PRESS });
