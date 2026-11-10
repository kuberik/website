/**
 * Scripted story for the "rollouts-list" island: one build of payments-api walks dev -> staging -> production, a
 * health check goes red in production, the next build lands and settles. A second app (checkout-web) is mid-flight the
 * whole time so the group never empties (no layout shift). All shaped as the dashboard's own view-model types
 * (StrandRow / RestRow from components/new/rollouts-page.ts, MiniNode via nodesOfSteps from mini-pipeline.ts).
 */
import type { Step } from '$lib/components/new/data';
import { nodesOfSteps } from '$lib/components/new/mini-pipeline';
import type { StrandRow, RestRow } from '$lib/components/new/rollouts-page';
import type { Beat } from '../../timeline';

type S = Step['state'];
const steps = (a: S, b: S, c: S, d: S): Step[] => [
	{ name: 'Started', state: a }, { name: 'Stage 1', state: b }, { name: 'Stage 2', state: c }, { name: 'Check', state: d }
];

type Place = { tier: string; place: string | null; href: string };
const DEV: Place = { tier: 'dev', place: null, href: '/rollouts/hub/payments/payments-api-dev' };
const STG: Place = { tier: 'staging', place: null, href: '/rollouts/hub/payments/payments-api-staging' };
const PRD: Place = { tier: 'prod', place: 'eu-west', href: '/rollouts/hub/payments/payments-api-prod-eu-west' };

function pay(p: Place, st: Step[], mark: StrandRow['mark'], lead: string, rest: string, age: string): StrandRow {
	return {
		key: 'payments-api', app: 'payments-api', href: p.href, tier: p.tier, place: p.place, mark,
		nodes: nodesOfSteps(st, mark === 'deploying' ? 'deploying' : 'checking'),
		lead, rest, age, yours: false, row: { group: mark === 'failed' ? 'failed' : 'moving' } as StrandRow['row']
	};
}
const checkout: StrandRow = {
	key: 'checkout-web', app: 'checkout-web', href: '/rollouts/hub/shop/checkout-web-test', tier: 'test', place: null, mark: 'deploying',
	nodes: nodesOfSteps(steps('done', 'done', 'active', 'todo'), 'deploying'), lead: 'Deploying', rest: 'v3.8.2 · step 3 of 4', age: '3m',
	yours: false, row: { group: 'moving' } as StrandRow['row']
};
const rest = (app: string, place: string, code: string, age: string, rep = false): RestRow => ({ key: app + place, app, href: '#', place, rep, sentence: 'On the newest', code, age, tier: place });
const quiet: RestRow[] = [rest('billing-worker', 'prod · eu-west', 'v1.19.0', '2d'), rest('billing-worker', 'prod · us-east', 'v1.19.0', '2d', true), rest('search-api', 'prod', 'v7.4.1', '5d')];

export type State = { moving: StrandRow[]; rest: RestRow[] };
const v = 'v2.14.0';
const S = (r: StrandRow, extra: RestRow[] = []): State => ({ moving: [r, checkout], rest: [...extra, ...quiet] });

export const beats: Beat<State>[] = [
	{ at: 0, state: S(pay(DEV, steps('active', 'todo', 'todo', 'todo'), 'deploying', 'Deploying', `${v} · dev`, '12s')) },
	{ at: 1400, state: S(pay(DEV, steps('done', 'done', 'done', 'active'), 'checking', 'Checking', `${v} · 1 min left`, '1m')) },
	{ at: 3000, state: S(pay(STG, steps('active', 'todo', 'todo', 'todo'), 'deploying', 'Deploying', `${v} · staging`, '4m')) },
	{ at: 4400, state: S(pay(STG, steps('done', 'done', 'done', 'active'), 'checking', 'Checking', `${v} · 2 min left`, '9m')) },
	{ at: 6000, state: S(pay(PRD, steps('done', 'active', 'todo', 'todo'), 'deploying', 'Deploying', `${v} · step 2 of 4`, '14m')) },
	{ at: 7600, state: S(pay(PRD, steps('done', 'done', 'fail', 'todo'), 'failed', 'Failing', `${v} · latency over limit`, '2m')) },
	{ at: 9400, state: S(pay(PRD, steps('done', 'done', 'active', 'todo'), 'deploying', 'Deploying', 'v2.14.1 · fix, step 3 of 4', '40s')) },
	{ at: 11000, state: S(pay(PRD, steps('done', 'done', 'done', 'active'), 'checking', 'Checking', 'v2.14.1 · 1 min left', '3m')) },
	{ at: 12600, state: { moving: [checkout], rest: [{ ...rest('payments-api', 'prod · eu-west', 'v2.14.1', 'now'), key: 'payments-api-rest' }, ...quiet] } }
];
export const initial = beats[0].state;
/** reduced motion: the telling moment, a production step failing */
export const representative = 5;
