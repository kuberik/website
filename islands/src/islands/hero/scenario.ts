/**
 * HERO SCENARIO: the 36 s story of SPEC 2.3 as raw custom resources.
 *
 * `fleetAt(t)` returns what the dashboard's own API would answer at story time `t` (seconds): Rollout / Environment /
 * KruiseRollout / Kustomization / HealthCheck CRs plus the merged changes, in the same shape as the dashboard's pinned fixtures
 * (`view-models/home/fixtures/incident-input.json`). It is installed with `installLiveSource()`; every derived word on screen
 * ("Needs your approval", "1 of 5 regions", "Final check") is then the product's own view-model reading these CRs. Nothing in
 * this file is a display string except GitHub's own data (PR titles, people).
 *
 * Time: story seconds map to simulated wall time at x20 (`SIM`), so a 3.5 s rest reads as a minute on the clock.
 * App `checkout-api`: old build 4.45.0-45 (b-45), new build 4.46.0-46 (b-46), PR #112 by olivia-bennett.
 */
import type { FleetSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { release, gate, prChange, CLOCK_MS } from '../shared/cr';

export const APP = 'checkout-api';
export const VIEWER = 'danielreed';
/* ONE clock for the page: the world's `now` never moves (shared/cr.ts CLOCK_MS). This story's own time is expressed by moving ITS timestamps instead:
   BASE is where story second 0 sits relative to that fixed `now`, so an age is right whichever island is installed last. See shared/world.ts. */
let BASE = CLOCK_MS;
const rebase = (t: number) => { BASE = CLOCK_MS - t * SIM * 1000; };
const SIM = 20; // simulated seconds per story second
export const simMs = (t: number): number => BASE + t * SIM * 1000;
const iso = (t: number) => new Date(simMs(t)).toISOString();
const H = 3600_000;

/* story seconds at which each place's NEW build starts deploying, starts its bake, and finishes (SPEC 2.3 beats 1-15) */
export const MERGE = 2;
export const APPROVE_AT = 19.4;
type Step = { start: number; check: number; done: number };
const STEPS: Record<string, Step> = {
	dev: { start: 2, check: 5, done: 8 },
	staging: { start: 8, check: 11, done: 14 },
	'us-east-1': { start: 19.4, check: 22, done: 24.5 },
	'us-east-2': { start: 24.5, check: 27, done: 30 },
	'eu-west-1': { start: 24.5, check: 27, done: 30 },
	'eu-central-1': { start: 24.5, check: 27, done: 30 },
	'ap-southeast-2': { start: 24.5, check: 27, done: 30 }
};
/** the earliest second at which a prod place is ready for a person to approve (staging healthy) */
export const ASKS_AT = 14;

type Release = ReturnType<typeof rel>;
const rel = (n: number, sha: string, createdMs: number) => release(`b-${n}`, `4.${n}.0-${n}`, sha, createdMs);
const SHA = { 44: 'b44d3e19a0c7e5a1f2b8c9d04e6a7b1c2d3e4f50', 45: 'b45a7c2e9d1f03b4a5c6d7e8f9a0b1c2d3e4f561', 46: 'e1c7a04b8d2f19a3c5e7091b3d5f7a9c1e3b5d72' };
const R44 = (): Release => rel(44, SHA[44], BASE - 30 * H), R45 = (): Release => rel(45, SHA[45], BASE - 4 * H), R46 = (): Release => rel(46, SHA[46], simMs(MERGE) + 90_000);

type Place = { ns: string; env: 'dev' | 'staging' | 'prod'; site?: string; wave?: number; step: Step; bake: string; theme: string };
const PLACES: Place[] = [
	{ ns: 'checkout-api-dev', env: 'dev', step: STEPS.dev, bake: '1m', theme: 'dev' },
	{ ns: 'checkout-api-staging', env: 'staging', step: STEPS.staging, bake: '1m', theme: 'staging' },
	{ ns: 'checkout-api-prod-us-east-1', env: 'prod', site: 'us-east-1', wave: 1, step: STEPS['us-east-1'], bake: '50s', theme: 'prod' },
	{ ns: 'checkout-api-prod-us-east-2', env: 'prod', site: 'us-east-2', wave: 2, step: STEPS['us-east-2'], bake: '1m', theme: 'prod' },
	{ ns: 'checkout-api-prod-eu-west-1', env: 'prod', site: 'eu-west-1', wave: 2, step: STEPS['eu-west-1'], bake: '1m', theme: 'prod' },
	{ ns: 'checkout-api-prod-eu-central-1', env: 'prod', site: 'eu-central-1', wave: 2, step: STEPS['eu-central-1'], bake: '1m', theme: 'prod' },
	{ ns: 'checkout-api-prod-ap-southeast-2', env: 'prod', site: 'ap-southeast-2', wave: 2, step: STEPS['ap-southeast-2'], bake: '1m', theme: 'prod' }
];

type Phase = 'old' | 'deploying' | 'checking' | 'done';
export const phaseAt = (p: Place, t: number): Phase => (t < p.step.start ? 'old' : t < p.step.check ? 'deploying' : t < p.step.done ? 'checking' : 'done');


function rollout(p: Place, t: number, failed: boolean) {
	const merged = t >= MERGE;
	const ph = phaseAt(p, t);
	const releases = merged ? [R44(), R45(), R46()] : [R44(), R45()];
	const onNew = ph !== 'old';
	const cur = onNew ? 'b-46' : 'b-45';
	const hist: Record<string, unknown>[] = [];
	if (onNew) {
		const bake = failed ? 'Failed' : ph === 'deploying' ? 'Deploying' : ph === 'checking' ? 'InProgress' : 'Succeeded';
		hist.push({
			id: 2, version: R46(), timestamp: iso(p.step.start), bakeStatus: bake, triggeredBy: { kind: 'System', name: 'System' },
			...(ph === 'deploying' ? { bakeStartTime: iso(p.step.start) } : { bakeStartTime: iso(p.step.check) }),
			...(ph === 'done' ? { bakeEndTime: iso(p.step.done) } : {})
		});
	}
	hist.push({ id: 1, version: R45(), timestamp: new Date(BASE - 3 * H).toISOString(), bakeStatus: 'Succeeded', bakeStartTime: new Date(BASE - 3 * H).toISOString(), bakeEndTime: new Date(BASE - 3 * H + 600_000).toISOString(), triggeredBy: { kind: 'System', name: 'System' } });
	/* GATES, as environment-controller writes RolloutGate.spec.allowedVersions (internal/wave/wave.go Decide; tags newest first, mapped through the
	   rollout's releaseCandidates + the release it runs now). NOT a hand-set "allow the new build at second N":
	   - dev: wave-1 leader without upstream => unrestricted, no promotion gate at all.
	   - wave-1 leader (staging, prod us-east-1): the revisions its UPSTREAM environment fully baked (Succeeded by every member of the upstream's last wave):
	     the old build until upstream has baked the new one, then [new, old].
	   - wave-N leader (prod ap-southeast-2, N=2): the revisions EVERY member of wave N-1 baked: old until us-east-1's bake of the new build ends, then [new, old].
	   - follower (prod us-east-2, eu-west-1, eu-central-1): exactly its wave's current selection = what the wave leader last deployed: old until the leader
	     starts the new build, then [new] ("followers do not wait for the leader's bake"). */
	const gates: unknown[] = [];
	const newTag = merged ? ['b-46'] : [];
	const up = allowedTags(p, t);
	if (p.env === 'staging') gates.push(gate('promotion-staging', up));
	if (p.env === 'prod') {
		const approved = t >= APPROVE_AT;
		gates.push(gate(`promotion-prod-${p.site}`, up));
		/* the approval gate (a person) is raised once staging is healthy: until then prod is simply behind, waiting on its promotion gate */
		if (t >= ASKS_AT) gates.push(gate('release-approval', approved ? ['b-44', 'b-45', ...newTag] : ['b-44', 'b-45']));
	}
	/* prod only learns of the build once staging has proven it (an Environment's promotion gate lists it from then on) */
	const candidates = onNew || !merged || (p.env === 'prod' && t < ASKS_AT) ? [] : [R46()];
	return {
		apiVersion: 'kuberik.com/v1alpha1', kind: 'Rollout',
		metadata: { name: APP, namespace: p.ns, labels: { environment: p.site ? `${p.env}-${p.site}` : p.env }, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env } },
		spec: { releasesImagePolicy: `${p.ns}/${APP}`, versionHistoryLimit: 20, minBakeTime: '2m', bakeTime: p.bake, healthCheckSelector: { matchLabels: { app: APP, env: p.site ? `${p.env}-${p.site}` : p.env } } },
		status: { source: 'github.com/exampleco/checkout-api', wantedVersion: cur, currentVersion: cur, previousVersion: onNew ? 'b-45' : 'b-44', availableReleases: releases, releaseCandidates: candidates, history: hist, gates }
	};
}

/** the wave leader of a place's (environment, wave): wave.go "lexicographically lowest registered site of the wave" (sticky only while a selection is in flight, and here it never changes) */
const leaderOf = (p: Place): Place => PLACES.filter((q) => q.env === p.env && (q.wave ?? 1) === (p.wave ?? 1)).sort((a, b) => (a.site ?? 'default').localeCompare(b.site ?? 'default'))[0];
const isMerged = (t: number) => t >= MERGE;
/** the build tag the gate admits, newest first (see the gate comment above) */
function allowedTags(p: Place, t: number): string[] {
	if (p.env === 'dev') return [];
	const lead = leaderOf(p);
	const w = p.wave ?? 1;
	const newer = isMerged(t) ? ['b-46'] : [];
	if (lead !== p) return phaseAt(lead, t) === 'old' ? ['b-45'] : newer; // follower: the wave's current selection
	/* leader: wait for the previous wave of its environment, else for the upstream environment's last wave */
	const prev = w > 1 ? PLACES.filter((q) => q.env === p.env && (q.wave ?? 1) === w - 1) : PLACES.filter((q) => q.env === (p.env === 'prod' ? 'staging' : 'dev'));
	return prev.every((q) => phaseAt(q, t) === 'done') ? [...newer, 'b-45'] : ['b-45'];
}
const short = (sha: string) => sha.slice(0, 7);

/**
 * ENVIRONMENT CR, as environment-controller writes it (api/v1alpha1/environment_types.go, internal/controller/waves.go applyWaveStatus):
 *   spec.site / spec.wave          : set on every prod region (us-east-1 wave 1; the other four wave 2); dev and staging name neither (site "default", wave 1).
 *   spec.lockstep                  : not set (false).
 *   status.wave.{site,wave}        : the effective site and wave.
 *   status.wave.role / leader      : Leader for the lexicographically lowest site of (environment, wave) (us-east-1 alone in wave 1, ap-southeast-2 in wave 2),
 *                                    Follower for the rest, whose `leader` is that site (NOT us-east-1: followers follow their own wave's leader).
 *   status.wave.selectedRevision   : the revision the wave's leader selected (its newest deployment of the wave); the new build once the leader started it.
 *   status.wave.members            : "the registered sites of this environment and of its upstream environment" (prod + staging; staging + dev; dev alone), canonical tier
 *                                    names, each with the revision / bakeStatus of its newest deployment, sorted by (environment, wave, site).
 *   status.wave.blocker + WaveReady: only a LEADER that is up to date while its previous wave / upstream still has a newer selection in flight is "WaitingFor <tier>/<site>
 *                                    bake on <short revision>" (wave.go Decide). A follower is never blocked by the leader's bake.
 *   status.conditions              : WaveReady True "site may deploy the allowed versions" (or False with the blocker), LockstepConsistent True.
 */
function environment(p: Place, t: number) {
	const ph = phaseAt(p, t);
	const lead = leaderOf(p);
	const w = p.wave ?? 1;
	const rev = (q: Place) => (phaseAt(q, t) === 'old' ? SHA[45] : SHA[46]);
	const bake = (q: Place) => (phaseAt(q, t) === 'done' || phaseAt(q, t) === 'old' ? 'Succeeded' : phaseAt(q, t) === 'checking' ? 'InProgress' : 'Deploying');
	const upEnv = p.env === 'prod' ? 'staging' : p.env === 'staging' ? 'dev' : null;
	const members = PLACES.filter((q) => q.env === p.env || q.env === upEnv)
		.map((q) => ({ environment: q.env, site: q.site ?? 'default', wave: q.wave ?? 1, revision: rev(q), bakeStatus: bake(q) }))
		.sort((a, b) => a.environment.localeCompare(b.environment) || a.wave - b.wave || a.site.localeCompare(b.site));
	/* the leader's blocker: up to date (still on the old build) while the wave before it (or the upstream environment) has a NEWER selection in flight */
	let blocker: { reason: string; environment: string; site: string; waitingOn: string; revision: string } | null = null;
	if (lead === p && ph === 'old' && isMerged(t)) {
		const prevWave = w > 1 ? PLACES.filter((q) => q.env === p.env && (q.wave ?? 1) === w - 1) : upEnv ? PLACES.filter((q) => q.env === upEnv) : [];
		const inFlight = prevWave.filter((q) => phaseAt(leaderOf(q), t) !== 'old' && phaseAt(q, t) !== 'done').sort((a, b) => (a.site ?? '').localeCompare(b.site ?? ''))[0];
		if (inFlight) blocker = { reason: 'WaitingFor', environment: inFlight.env, site: inFlight.site ?? 'default', waitingOn: 'Bake', revision: SHA[46] };
	}
	const cond = (type: string, status: string, reason: string, message: string) => ({ type, status, reason, message, lastTransitionTime: iso(0) });
	const ready = blocker ? cond('WaveReady', 'False', blocker.reason, `${blocker.environment}/${blocker.site} bake on ${short(blocker.revision)}`) : cond('WaveReady', 'True', 'Ready', 'site may deploy the allowed versions');
	return {
		apiVersion: 'environments.kuberik.com/v1alpha1', kind: 'Environment',
		metadata: { name: APP, namespace: p.ns, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env } },
		spec: { environment: p.env, name: 'checkout-api-service', rolloutRef: { name: APP }, ...(p.site ? { site: p.site, wave: p.wave } : {}) },
		status: {
			...(p.env === 'dev' ? {} : { rolloutGateRef: { name: p.env === 'staging' ? 'promotion-staging' : `promotion-prod-${p.site}` } }),
			currentVersion: ph === 'old' ? 'b-45' : 'b-46', lastStatusChangeTime: ph === 'old' ? new Date(BASE - 3 * H).toISOString() : iso(p.step.start),
			wave: {
				site: p.site ?? 'default', environment: p.env, name: 'kuberik-checkout-api-service', wave: w, role: lead === p ? 'Leader' : 'Follower', leader: lead.site ?? 'default',
				selectedRevision: rev(lead), members,
				...(blocker ? { blocker: { reason: blocker.reason, environment: blocker.environment, site: blocker.site, waitingOn: blocker.waitingOn, revision: blocker.revision } } : {})
			},
			conditions: [ready, cond('LockstepConsistent', 'True', 'Consistent', 'all members agree on lockstep')]
		}
	};
}

/** every place runs a two-stage canary (Kruise Rollout), so a Slipway reads Started · Stage 1 · Stage 2 · Check as the tab does and the deploy is a visible step */
const key = (p: Place) => p.site ?? p.env;
function kruise(p: Place, t: number) {
	const ph = phaseAt(p, t);
	const idx = ph === 'deploying' ? Math.min(2, Math.floor(((t - p.step.start) / (p.step.check - p.step.start)) * 2) + 1) : 2;
	return {
		apiVersion: 'rollouts.kruise.io/v1alpha1', kind: 'Rollout',
		metadata: { name: `checkout-api-canary-${key(p)}`, namespace: p.ns, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env } },
		spec: { strategy: { canary: { steps: [{ replicas: '50%' }, { replicas: '100%' }] } } },
		status: { canaryStatus: { currentStepIndex: ph === 'old' || ph === 'done' ? 2 : idx, currentStepState: ph === 'old' || ph === 'done' ? 'Completed' : 'StepInProgress' }, conditions: [] }
	};
}
const kustomization = (p: Place) => ({
	apiVersion: 'kustomize.toolkit.fluxcd.io/v1', kind: 'Kustomization',
	metadata: { name: `checkout-api-${key(p)}`, namespace: p.ns, annotations: { 'rollout.kuberik.com/substitute.CHECKOUT_API_VERSION.from': APP, 'rollout-dashboard.kuberik.com/source-cluster': p.env } },
	spec: {}, status: { conditions: [], inventory: { entries: [{ id: `${p.ns}_checkout-api-canary-${key(p)}_rollouts.kruise.io_Rollout` }] } }
});

/** two health checks per place (SPEC 2.3): healthy once the build has settled, pending while it deploys */
function healthChecks(t: number, failedCheck: string | null) {
	return PLACES.map((p) => {
		const ph = phaseAt(p, t);
		const mk = (name: string) => {
			const failing = failedCheck === name && ph !== 'old';
			const status = failing ? 'Unhealthy' : ph === 'deploying' ? 'Pending' : 'Healthy';
			return {
				apiVersion: 'kuberik.com/v1alpha1', kind: 'HealthCheck',
				metadata: { name: `${APP}-${name}`, namespace: p.ns, labels: { app: APP }, annotations: { 'kuberik.com/display-name': name } },
				spec: { class: 'prometheus-alert' },
				status: { status, message: failing ? '4.2% of requests failed, over a 1% budget' : 'No alerts firing', lastChangeTime: iso(ph === 'old' ? -60 : p.step.start) }
			};
		};
		return { metadata: { namespace: p.ns, name: APP, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env } }, healthChecks: [mk('error-rate'), mk('latency-p99')] };
	});
}

const repo = 'checkout-api';
const change = (n: number, title: string, author: string, mergedMs: number, sha: string, files: number) => prChange('exampleco', repo, n, title, author, mergedMs, sha, files);

/** the answers the dashboard's GitHub routes would give (range and commit lookups), keyed by route: see stubs/github-read.svelte.ts */
export function githubAt(t: number): Record<string, unknown> {
	rebase(t);
	const out: Record<string, unknown> = {};
	const commit = (sha: string, message: string, author: string) => ({ sha, message, author, commitDate: new Date(BASE - H).toISOString() });
	const c45 = commit(SHA[45], '#108 Show saved cards first', 'liam-foster'), c46 = commit(SHA[46], '#112 Add Apple Pay to checkout', 'olivia-bennett'), c44 = commit(SHA[44], '#101 Fix tax rounding on refunds', 'noah-carter');
	for (const p of PLACES) {
		const path = `/api/rollouts/${p.ns}/${APP}/commits`;
		out[`${path}?base=${SHA[44]}&head=${SHA[45]}`] = { commits: [c45], additions: 38, deletions: 11, changedFiles: 4 };
		out[`${path}?base=&head=${SHA[44]}`] = { commits: [c44], additions: 21, deletions: 6, changedFiles: 2 };
		out[`${path}?base=${SHA[45]}&head=${SHA[46]}`] = { commits: [c46], additions: 142, deletions: 9, changedFiles: 6 };
	}
	out[`/api/github/repos/exampleco/${repo}/commits/${SHA[46]}`] = { subject: '#112 Add Apple Pay to checkout', author: 'olivia-bennett' };
	out[`/api/github/repos/exampleco/${repo}/commits/${SHA[45]}`] = { subject: '#108 Show saved cards first', author: 'liam-foster' };
	out[`/api/github/repos/exampleco/${repo}/commits/${SHA[44]}`] = { subject: '#101 Fix tax rounding on refunds', author: 'noah-carter' };
	void t;
	return out;
}

/**
 * SCENERY (documented, not decoration): the dashboard's roster treats the single oldest approval in the fleet as "the lead" and
 * hands it no Approve of its own (home-view.ts `approvals = approvalsAll.filter(x => x !== leadApproval)`): the lead gets the Home
 * page's big card instead. The hero window shows the app page, where checkout-api's approval must carry its Approve, so another
 * app has been waiting on a person for longer. Nothing of it is drawn: the hero only ever looks at checkout-api.
 */
function scenery() {
	const ns = 'billing-api-prod';
	const r7 = rel(7, 'a7a7a7a1c3e5092b4d6f8a0c2e4b6d8f0a2c4e61', BASE - 9 * H), r8 = rel(8, 'a8b8c8d1e3f5092b4d6f8a0c2e4b6d8f0a2c4e71', BASE - 5 * H);
	return {
		rollout: {
			apiVersion: 'kuberik.com/v1alpha1', kind: 'Rollout',
			metadata: { name: 'billing-api', namespace: ns, labels: { environment: 'prod' }, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': 'prod' } },
			spec: { releasesImagePolicy: `${ns}/billing-api`, versionHistoryLimit: 20, minBakeTime: '2m', bakeTime: '1m' },
			status: { source: 'github.com/exampleco/billing-api', wantedVersion: 'b-7', currentVersion: 'b-7', previousVersion: 'b-6', availableReleases: [r7, r8], releaseCandidates: [r8],
				history: [{ id: 1, version: r7, timestamp: new Date(BASE - 8 * H).toISOString(), bakeStatus: 'Succeeded', bakeStartTime: new Date(BASE - 8 * H).toISOString(), bakeEndTime: new Date(BASE - 8 * H + 60_000).toISOString(), triggeredBy: { kind: 'System', name: 'System' } }],
				gates: [gate('release-approval', ['b-7'])] }
		},
		env: { apiVersion: 'environments.kuberik.com/v1alpha1', kind: 'Environment', metadata: { name: 'billing-api', namespace: ns, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': 'prod' } }, spec: { environment: 'prod', name: 'billing-api-service', rolloutRef: { name: 'billing-api' } }, status: { currentVersion: 'b-7', lastStatusChangeTime: new Date(BASE - 8 * H).toISOString(), conditions: [] } }
	};
}

export type Fleet = FleetSource;
export function fleetAt(t: number): FleetSource {
	rebase(t);
	const merged = t >= MERGE;
	const changes = [
		change(101, 'Fix tax rounding on refunds', 'noah-carter', BASE - 30 * H, SHA[44], 2),
		change(108, 'Show saved cards first', 'liam-foster', BASE - 4 * H, SHA[45], 4),
		...(merged ? [change(112, 'Add Apple Pay to checkout', 'olivia-bennett', simMs(MERGE), SHA[46], 6)] : [])
	];
	const sc = scenery();
	return {
		rollouts: [...PLACES.map((p) => rollout(p, t, false)), sc.rollout] as never,
		environments: [...PLACES.map((p) => environment(p, t)), sc.env] as never,
		rolloutDependencies: { items: [] },
		kustomizations: PLACES.map(kustomization) as never,
		kruiseRollouts: PLACES.map((p) => kruise(p, t)) as never,
		changes: changes as never,
		changesState: 'ok',
		healthChecks: healthChecks(t, null) as never,
		github: { configured: true, connected: true, login: VIEWER },
		me: VIEWER,
		now: new Date(CLOCK_MS)
	};
}
