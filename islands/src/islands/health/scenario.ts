/**
 * HEALTH SCENARIO: the 26 s story of SPEC 3.2 as raw custom resources (see hero/scenario.ts for the idea: `fleetAt(t)` is what the dashboard's
 * own API would answer at story time `t`; every derived word on screen is the product's view-model reading these CRs).
 * App `orders-api` (sha builds): new a3f9c21 (PR #118 by noah-carter), last good 7c14e2a (PR #114 by olivia-bennett). dev runs a3f9c21,
 * staging deploys it, prod stays on 7c14e2a. Three checks in every place: error-rate, latency-p99, pod-restarts.
 * Time: story seconds map to simulated wall time at x10, so the 5.5 s rest on the failed frame reads as about a minute on the clock.
 *
 * Honesty (controller truth, rollout_controller.go): a failed build is BLOCKED, never rolled back by itself. The only thing that moves staging
 * back is a person pressing Roll back (beat 6), so the controller deploys the chosen older version as a new history entry (beat 7).
 */
import type { FleetSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { release, gate, prChange, CLOCK_MS } from '../shared/cr';

export const APP = 'orders-api';
export const VIEWER = 'danielreed';
/* one fixed page clock; this story's time is expressed in its timestamps (see hero/scenario.ts, shared/world.ts) */
let BASE = CLOCK_MS;
const SIM = 10;
const rebase = (t: number) => { BASE = CLOCK_MS - t * SIM * 1000; };
export const simMs = (t: number): number => BASE + t * SIM * 1000;
const iso = (t: number) => new Date(simMs(t)).toISOString();
const H = 3600_000;

/* story seconds (SPEC 3.2) */
export const T = { deployed: 0, checking: 2.5, breaks: 6.0, stops: 7.5, press: 13.0, rollback: 13.6, rolledChecking: 15.0, back: 16.5 } as const;
export const LOOP = 26;
const NEW = 'a3f9c21', OLD = '7c14e2a', OLDER = '5d2e8b0';
const SHA = { [NEW]: 'a3f9c21e5b7d09f1c3a5e7092b4d6f8a0c2e4b61', [OLD]: '7c14e2a9d0b3f5c71a2e4d6b8091c3e5f7a92b04', [OLDER]: '5d2e8b04c6a8e1f3b5d7092a4c6e8f1a3b5d7c92' } as const;
const R_NEW = () => release(NEW, NEW, SHA[NEW], simMs(T.deployed) - 8 * 60_000);
const R_OLD_ = () => release(OLD, OLD, SHA[OLD], BASE - 20 * H);
const R_OLDER_ = () => release(OLDER, OLDER, SHA[OLDER], BASE - 50 * H);

type Place = { env: 'dev' | 'staging' | 'prod'; ns: string };
const PLACES: Place[] = [{ env: 'dev', ns: `${APP}-dev` }, { env: 'staging', ns: `${APP}-staging` }, { env: 'prod', ns: `${APP}-prod` }];
const CHECKS = ['error-rate', 'latency-p99', 'pod-restarts'] as const;
export const BREAK_MESSAGE = '4.2% of requests failed, over a 1% budget';

/** what staging is doing at `t` */
export type Phase = 'deploying' | 'checking' | 'failed' | 'rolling-back' | 'rolled-checking' | 'back';
export const phaseAt = (t: number): Phase => (t < T.checking ? 'deploying' : t < T.stops ? 'checking' : t < T.rollback ? 'failed' : t < T.rolledChecking ? 'rolling-back' : t < T.back ? 'rolled-checking' : 'back');

function rollout(p: Place, t: number) {
	const hist: Record<string, unknown>[] = [];
	const user = { kind: 'User', name: VIEWER };
	let cur: string = OLD, prev: string = OLDER;
	const base = (id: number, v: ReturnType<typeof release>, at: number, extra: Record<string, unknown>) => ({ id, version: v, timestamp: iso(at), triggeredBy: { kind: 'System', name: 'System' }, ...extra });
	const old = (id: number, v: ReturnType<typeof release>, atMs: number) => ({ id, version: v, timestamp: new Date(atMs).toISOString(), bakeStatus: 'Succeeded', bakeStartTime: new Date(atMs).toISOString(), bakeEndTime: new Date(atMs + 300_000).toISOString(), triggeredBy: { kind: 'System', name: 'System' } });
	if (p.env === 'dev') {
		cur = NEW; prev = OLD;
		hist.push(old(3, R_NEW(), BASE - 40 * 60_000), old(2, R_OLD_(), BASE - 20 * H));
	} else if (p.env === 'prod') {
		hist.push(old(2, R_OLD_(), BASE - 19 * H), old(1, R_OLDER_(), BASE - 50 * H));
	} else {
		const ph = phaseAt(t);
		const failedEntry = base(2, R_NEW(), T.deployed, { bakeStatus: 'Failed', bakeStartTime: iso(T.checking), bakeEndTime: iso(T.stops), bakeStatusMessage: `Health check error-rate failed: ${BREAK_MESSAGE}`, failedHealthChecks: [{ name: 'error-rate', namespace: p.ns, message: BREAK_MESSAGE }] });
		const old1 = old(1, R_OLD_(), BASE - 19 * H);
		if (ph === 'deploying') { cur = NEW; prev = OLD; hist.push(base(2, R_NEW(), T.deployed, { bakeStatus: 'Deploying', bakeStartTime: iso(T.deployed) }), old1); }
		else if (ph === 'checking') { cur = NEW; prev = OLD; hist.push(base(2, R_NEW(), T.deployed, { bakeStatus: 'InProgress', bakeStartTime: iso(T.checking) }), old1); }
		else if (ph === 'failed') { cur = NEW; prev = OLD; hist.push(failedEntry, old1); }
		else {
			cur = OLD; prev = NEW;
			const rb = base(3, R_OLD_(), T.rollback, { bakeStatus: ph === 'rolling-back' ? 'Deploying' : ph === 'rolled-checking' ? 'InProgress' : 'Succeeded', bakeStartTime: iso(ph === 'rolling-back' ? T.rollback : T.rolledChecking), triggeredBy: user, message: `Roll back to ${OLD}`, ...(ph === 'back' ? { bakeEndTime: iso(T.back) } : {}) });
			hist.push(rb, failedEntry, old1);
		}
	}
	/* prod learns of the build only once it is proven; until then it is simply behind */
	const avail = p.env === 'prod' || (p.env === 'staging') ? [R_OLDER_(), R_OLD_(), R_NEW()] : [R_OLDER_(), R_OLD_(), R_NEW()];
	return {
		apiVersion: 'kuberik.com/v1alpha1', kind: 'Rollout',
		metadata: { name: APP, namespace: p.ns, labels: { environment: p.env }, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env } },
		spec: { releasesImagePolicy: `${p.ns}/${APP}`, versionHistoryLimit: 20, minBakeTime: '2m', bakeTime: '1m', healthCheckSelector: { matchLabels: { app: APP, env: p.env } } },
		status: { source: 'github.com/exampleco/orders-api', wantedVersion: cur, currentVersion: cur, previousVersion: prev, availableReleases: avail, releaseCandidates: [], history: hist, gates: [gate('promotion', [NEW, OLD, OLDER])] }
	};
}

function environment(p: Place, t: number) {
	const ph = p.env === 'staging' ? phaseAt(t) : 'back';
	const onNew = p.env === 'dev' || (p.env === 'staging' && (ph === 'deploying' || ph === 'checking' || ph === 'failed'));
	return {
		apiVersion: 'environments.kuberik.com/v1alpha1', kind: 'Environment',
		metadata: { name: APP, namespace: p.ns, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env } },
		spec: { environment: p.env, name: 'orders-api-service', rolloutRef: { name: APP } },
		status: { currentVersion: onNew ? NEW : OLD, lastStatusChangeTime: iso(p.env === 'staging' ? T.deployed : -300), conditions: [] }
	};
}

/** the three HealthCheck CRs of a place at story time `t` (staging is the one the story is about) */
export function checksOf(p: Place, t: number) {
	return CHECKS.map((name) => {
		const staging = p.env === 'staging';
		const ph = staging ? phaseAt(t) : 'back';
		const broke = staging && name === 'error-rate' && t >= T.breaks && t < T.rollback;
		const witness = staging && name === 'error-rate' && t >= T.breaks;
		const status = broke ? 'Unhealthy' : ph === 'deploying' || ph === 'rolling-back' ? 'Pending' : 'Healthy';
		return {
			apiVersion: 'kuberik.com/v1alpha1', kind: 'HealthCheck',
			metadata: { name: `${APP}-${name}`, namespace: p.ns, labels: { app: APP }, annotations: { 'kuberik.com/display-name': name } },
			spec: { class: 'prometheus-alert' },
			status: {
				status, message: broke ? BREAK_MESSAGE : status === 'Pending' ? 'Waiting for the first probe' : 'No alerts firing',
				lastChangeTime: iso(staging ? (broke ? T.breaks : status === 'Healthy' && t >= T.back ? T.back : status === 'Healthy' ? T.checking : T.deployed) : -300),
				/* the witness: LastErrorTime survives recovery (health-witness.ts) */
				...(witness ? { lastErrorTime: iso(T.breaks) } : {})
			}
		};
	});
}
const STAGING = PLACES[1];
/** the staging card's own inputs: its checks, and the controller's `errorCutoff` (history[0].timestamp) the product passes as `windowStart` */
export const stagingChecks = (t: number) => checksOf(STAGING, t);
export const windowStartAt = (t: number): Date => new Date(simMs(phaseAt(t) === 'back' || phaseAt(t) === 'rolling-back' || phaseAt(t) === 'rolled-checking' ? T.rollback : T.deployed));

const repo = 'orders-api';
const change = (n: number, title: string, author: string, mergedMs: number, sha: string, files: number) => prChange('exampleco', repo, n, title, author, mergedMs, sha, files);

export function githubAt(t: number): Record<string, unknown> {
	rebase(t);
	const out: Record<string, unknown> = {};
	const commit = (sha: string, message: string, author: string) => ({ sha, message, author, commitDate: new Date(BASE - H).toISOString() });
	const cNew = commit(SHA[NEW], '#118 Cache cart totals per session', 'noah-carter'), cOld = commit(SHA[OLD], '#114 Retry idempotent order writes', 'olivia-bennett'), cOlder = commit(SHA[OLDER], '#109 Paginate the order history query', 'liam-foster');
	for (const p of PLACES) {
		const path = `/api/rollouts/${p.ns}/${APP}/commits`;
		out[`${path}?base=${SHA[OLD]}&head=${SHA[NEW]}`] = { commits: [cNew], additions: 64, deletions: 18, changedFiles: 5 };
		out[`${path}?base=${SHA[OLDER]}&head=${SHA[OLD]}`] = { commits: [cOld], additions: 31, deletions: 7, changedFiles: 3 };
		out[`${path}?base=&head=${SHA[OLDER]}`] = { commits: [cOlder], additions: 22, deletions: 4, changedFiles: 2 };
		out[`${path}?base=${SHA[NEW]}&head=${SHA[OLD]}`] = { commits: [cOld], additions: 31, deletions: 7, changedFiles: 3 };
	}
	for (const [sha, c] of [[SHA[NEW], cNew], [SHA[OLD], cOld], [SHA[OLDER], cOlder]] as const) out[`/api/github/repos/exampleco/${repo}/commits/${sha}`] = { subject: c.message, author: c.author };
	return out;
}

export function fleetAt(t: number): FleetSource {
	rebase(t);
	return {
		rollouts: PLACES.map((p) => rollout(p, t)) as never,
		environments: PLACES.map((p) => environment(p, t)) as never,
		rolloutDependencies: { items: [] },
		kustomizations: [],
		kruiseRollouts: [],
		changes: [
			change(109, 'Paginate the order history query', 'liam-foster', BASE - 50 * H, SHA[OLDER], 2),
			change(114, 'Retry idempotent order writes', 'olivia-bennett', BASE - 20 * H, SHA[OLD], 3),
			change(118, 'Cache cart totals per session', 'noah-carter', simMs(T.deployed) - 8 * 60_000, SHA[NEW], 5)
		] as never,
		changesState: 'ok',
		healthChecks: PLACES.map((p) => ({ metadata: { namespace: p.ns, name: APP, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env } }, healthChecks: checksOf(p, t) })) as never,
		github: { configured: true, connected: true, login: VIEWER },
		me: VIEWER,
		now: new Date(CLOCK_MS)
	};
}
