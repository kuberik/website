/**
 * The one set of facts every feature card tells (with the Gates card, gates.ts, and the page's copy, data/landing.yaml): release 4.46.0-46 of
 * checkout-api runs in dev and staging; production holds it, because payments-svc, which it needs at ^3.1.0, is still baking 3.1.0 in prod us-east-1.
 *
 * - `held(t, place)`: the film's scenario as a sibling world (`depHold`: the contract holds 4.46.0-46 in every prod place; no approval gate), the
 *   rollout page's queries answering for `place` (its site, or dev / staging).
 * - `payments(t)`: payments-svc's own rollout in that same moment: 3.1.0 going out wave by wave, prod us-east-1 (wave 1) through its canary
 *   (10 %, the integration test, 50 %, 100 %) and into its bake, wave 2 waiting on it. It is the film's own CR machinery (scenario.ts at a second
 *   where us-east-1 bakes) with the app and its builds renamed, the dependency removed (payments-svc is the provider, it needs nothing) and the
 *   fleet's at-rest payments-svc left out (this one replaces it). Data only: every word on screen is still the product's.
 */
import { worldAt, APP, type WorldOpt } from '../film/scenario';
import { answersFrom } from '../film/detail-store.svelte';

/* the held world's own clusters: its places are the film's (same namespaces, same release source), so in the film's clusters its release catalogue
   would BE the film's (the dashboard keys a catalogue by cluster / namespace / source), and a build's age ("built 19m ago") would follow whatever
   second the film is at. Under their own cluster names (never printed: a place is drawn by environment and site) the island brings its own. */
const SC = 'rollout-dashboard.kuberik.com/source-cluster';
function ownClusters<T>(x: T): T {
	if (x instanceof Date || x == null || typeof x !== 'object') return x;
	if (Array.isArray(x)) return x.map(ownClusters) as T;
	const o: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(x)) o[k] = k === SC && typeof v === 'string' ? `${v}-held` : ownClusters(v);
	return o as T;
}
export const held = (t: number, place?: string) => {
	const w = worldAt(t, { depHold: true, approval: false, ...(place ? { place } : {}) } satisfies WorldOpt);
	return { ...w, fleet: ownClusters(w.fleet), detail: ownClusters(w.detail) };
};

const PAY = 'payments-svc';
/* longest first: a build's version before its tag */
const REN: [string, string][] = [[APP, PAY], ['4.46.0-46', '3.1.0'], ['4.45.0-45', '3.0.2'], ['4.44.0-44', '3.0.1'], ['b-46', 'pay-310'], ['b-45', 'pay-302'], ['b-44', 'pay-301'], ['Add Apple Pay to checkout', 'Serve contract payments 3.1.0'], ['#112 ', '#38 '], ['olivia-bennett', 'ava-mitchell']];
const ren = (s: string) => REN.reduce((a, [f, r]) => a.split(f).join(r), s);
const back = (s: string) => (s === PAY ? APP : s.startsWith(PAY + '-') ? APP + s.slice(PAY.length) : s);
function deep<T>(x: T): T {
	if (typeof x === 'string') return ren(x) as T;
	if (x instanceof Date || x == null || typeof x !== 'object') return x;
	if (Array.isArray(x)) return x.map(deep) as T;
	const o: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(x)) if (k !== 'requires') o[ren(k)] = deep(v); /* `requires`: checkout-api's release needs payments ^3.1.0; payments-svc's needs nothing */
	return o as T;
}
const nsOf = (o: any): string => o?.metadata?.namespace ?? '';
const notDep = (g: any) => !String(g?.name ?? g?.metadata?.name ?? '').startsWith('dependency-');

export function payments(t: number) {
	const w = worldAt(t, { approval: false });
	const f: any = w.fleet;
	/* the fleet's own payments-svc (at rest) leaves: this story's payments-svc takes its place */
	const mine = (o: any) => !nsOf(o).startsWith(PAY + '-');
	const items = (k: string) => ({ ...f[k], items: (f[k]?.items ?? []).filter(mine) });
	const rollouts = f.rollouts.filter(mine).map((r: any) => (r.metadata.name === APP ? { ...r, status: { ...r.status, gates: (r.status.gates ?? []).filter(notDep) } } : r));
	/* the change that made 3.1.0 is payments-svc's own (surfaces/fleet.ts: #38 by ava-mitchell), not checkout-api's #112 */
	const own = (c: any) => (c.repo === APP && c.number === 112 ? { ...c, number: 38, author: 'ava-mitchell', htmlUrl: c.htmlUrl.replace('/pull/112', '/pull/38') } : c);
	const fleet = {
		...f, rollouts, environments: f.environments.filter(mine), healthChecks: f.healthChecks.filter(mine), releaseSources: items('releaseSources'), releaseSlices: items('releaseSlices'),
		changes: f.changes.filter((c: any) => c.repo !== PAY).map(own), rolloutDependencies: { items: [] }
	};
	const detail = { ...w.detail, rollout: rollouts.find((r: any) => nsOf(r) === w.detail.ns && r.metadata.name === APP), gates: w.detail.gates.filter(notDep) };
	/* `raw`: the same snapshot in checkout-api's names, which the film's own query answers read (section.ts rebases it with the rest) */
	return { fleet: deep(fleet), github: deep(w.github), detail: deep(detail), raw: { detail, rollouts, github: w.github } };
}
/** the rollout page's queries for payments-svc: asked in its names, answered by the film's own answers (detail-store) in checkout-api's, renamed on the way out */
export function paymentsAnswers(w: ReturnType<typeof payments>) {
	const base = answersFrom(() => w.raw.detail as never, () => w.raw.rollouts, () => w.raw.github);
	const memo = new Map<string, unknown>();
	return (key: readonly unknown[]) => {
		const k = JSON.stringify(key);
		if (!memo.has(k)) memo.set(k, deep(base(key.map((x) => (typeof x === 'string' ? back(x) : x)))));
		return memo.get(k);
	};
}
