/**
 * HERO SCENARIO (48 s, STORYBOARD + TRUTH): PR #112 "Add Apple Pay to checkout" merges and walks staging, waits on a person, a contract and
 * the deploy window, canaries in prod us-east-1 (wave 1) where the final check catches a 3.2 % error rate, and is rolled back by a person.
 * Wave 2 never starts: us-east-1 failing keeps its four regions off the build (environment-controller wave.go).
 *
 * `worldAt(t)` returns what the dashboard's own API would answer at story second `t`: raw Rollout / Environment / Kruise Rollout / RolloutTest /
 * Kustomization / HealthCheck / RolloutGate / RolloutDependency / RolloutSchedule CRs. Nothing in this file is a display string except GitHub's
 * own data (PR titles, people). The product's own view-models draw every word.
 * `EV` is the event table: the story seconds at which a CR changes (also what the film's data snapshots key on, see eventIndexAt()).
 */
import type { FleetSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { release, gate, prChange } from '../shared/cr';
import { extras } from '../surfaces/fleet';
import { clockSeconds } from './clock';

export const APP = 'checkout-api';
/** the viewer: an approver on the platform team. The product offers Approve on OTHER people's changes (home-view `elsewhere`), so the author (olivia-bennett) is not who presses it. */
export const VIEWER = 'noah-carter';
/** 2026-11-10 00:00 UTC, a Tuesday (the deploy window is weekdays) */
const DAY_MS = Date.parse('2026-11-10T00:00:00Z');
export const AUTHOR = 'olivia-bennett';
type Any = any;

/** story seconds at which a CR changes (STORYBOARD beat table; TRUTH R3/R5/R11) */
export const EV = {
	step2: 2.6, check: 3.4, hcStagingErr: 3.8, hcStagingLat: 4.2, stagingDone: 4.4,
	promo: 6.5, approved: 10.3, depSat: 14.4, window: 16.6,
	deploy: 16.9, paused1: 19.0, testPending: 19.4, testRunning: 19.6, testPassed: 20.9, step2Go: 22.9, step2Done: 23.9, hcLat: 24.8,
	caught: 27.0,
	rolled: 38.7, stage1Again: 39.6, testPending2: 39.8, testRunning2: 40.0, testPassed2: 40.4, step2Again: 40.9, step2Done2: 41.5, hcLat2: 41.8, hcErr2: 42.2, recovered: 42.4
} as const;
/** every story second a CR changes at: the film re-derives its (heavy) data snapshot only when one of these is passed */
export const EVENT_TIMES = [0, ...Object.values(EV)].sort((a, b) => a - b);
export const eventIndexAt = (t: number) => EVENT_TIMES.filter((e) => t >= e).length;

const H = 3600_000;
const SHA = { 44: 'b44d3e19a0c7e5a1f2b8c9d04e6a7b1c2d3e4f50', 45: 'b45a7c2e9d1f03b4a5c6d7e8f9a0b1c2d3e4f561', 46: 'e1c7a04b8d2f19a3c5e7091b3d5f7a9c1e3b5d72' };
const short = (sha: string) => sha.slice(0, 7);
const FAIL_MSG = '3.2% of requests failed, over a 1% budget';
const OBS = [{ name: 'error rate', kind: 'Threshold', value: '3.2', limit: '1', unit: '%', direction: 'Above', healthy: false }];

type Place = { ns: string; env: 'staging' | 'prod'; site?: string; wave?: number };
export const PLACES: Place[] = [
	{ ns: 'checkout-api-staging', env: 'staging' },
	{ ns: 'checkout-api-prod-us-east-1', env: 'prod', site: 'us-east-1', wave: 1 },
	{ ns: 'checkout-api-prod-us-east-2', env: 'prod', site: 'us-east-2', wave: 2 },
	{ ns: 'checkout-api-prod-eu-west-1', env: 'prod', site: 'eu-west-1', wave: 2 },
	{ ns: 'checkout-api-prod-eu-central-1', env: 'prod', site: 'eu-central-1', wave: 2 },
	{ ns: 'checkout-api-prod-ap-southeast-2', env: 'prod', site: 'ap-southeast-2', wave: 2 }
];
const key = (p: Place) => p.site ?? p.env;
const isUS1 = (p: Place) => p.site === 'us-east-1';
const DEP_NAME = 'checkout-api-needs-payments';

/** where a place is, at `t`: which build it runs and what its newest history entry says */
export type Phase = 'old' | 'deploying' | 'checking' | 'done' | 'failed' | 'rolling' | 'recovered';
export function phaseOf(p: Place, t: number): Phase {
	if (p.env === 'staging') return t < EV.check ? 'deploying' : t < EV.stagingDone ? 'checking' : 'done';
	if (!isUS1(p)) return 'old';
	if (t < EV.deploy) return 'old';
	if (t < EV.step2Done) return 'deploying';
	if (t < EV.caught) return 'checking';
	if (t < EV.rolled) return 'failed';
	return t < EV.recovered ? 'rolling' : 'recovered';
}
const onNewBuild = (ph: Phase) => ph === 'deploying' || ph === 'checking' || ph === 'done' || ph === 'failed';

export type Detail = { ns: string; rollout: Any; kustomization: Any; environment: Any; kr: Any; test: Any; gates: Any[]; healthChecks: Any[]; schedules: Any[] };

export function worldAt(t: number): { fleet: FleetSource; github: Record<string, unknown>; detail: Detail } {
	/* THE CLOCK: `now` is the story clock (a Tuesday, UTC), so every absolute time the product prints ("reopens 10:00 UTC", "closes 14:00 UTC") agrees with the chrome clock;
	   each CR timestamp is placed on the same piecewise-linear map (clock.ts), and pre-story ages count back from the first frame. */
	const atMs = (tt: number) => DAY_MS + clockSeconds(tt) * 1000;
	const at = (tt: number) => new Date(atMs(tt)).toISOString();
	const STORY0 = atMs(0);
	const ago = (ms: number) => STORY0 - ms;
	const rel = (n: number, sha: string, createdMs: number) => release(`b-${n}`, `4.${n}.0-${n}`, sha, createdMs);
	const R44 = rel(44, SHA[44], ago(30 * H)), R45 = rel(45, SHA[45], ago(4 * H));
	const R46 = { ...rel(46, SHA[46], atMs(-0.01)), requires: { payments: '^3.1.0' } };
	const deployed = (p: Place) => onNewBuild(phaseOf(p, t));

	/* ---- history ---- */
	const base = { id: 1, version: R45, timestamp: new Date(ago(3 * H)).toISOString(), bakeStatus: 'Succeeded', bakeStartTime: new Date(ago(3 * H)).toISOString(), bakeEndTime: new Date(ago(3 * H) + 600_000).toISOString(), triggeredBy: { kind: 'System', name: 'System' } };
	const sys = { kind: 'System', name: 'System' };
	const failedInfo = { message: 'Health check error-rate failed', failedHealthChecks: [{ name: 'error-rate', message: FAIL_MSG, observations: OBS }] };
	function history(p: Place): Any[] {
		const ph = phaseOf(p, t);
		if (ph === 'old') return [base];
		if (p.env === 'staging') return [{ id: 2, version: R46, timestamp: at(0), bakeStatus: ph === 'deploying' ? 'Deploying' : ph === 'checking' ? 'InProgress' : 'Succeeded', bakeStartTime: at(ph === 'deploying' ? 0 : EV.check), ...(ph === 'done' ? { bakeEndTime: at(EV.stagingDone) } : {}), triggeredBy: sys }, base];
		const first = { id: 2, version: R46, timestamp: at(EV.deploy), bakeStatus: ph === 'deploying' ? 'Deploying' : ph === 'checking' ? 'InProgress' : 'Failed', bakeStartTime: at(ph === 'deploying' ? EV.deploy : EV.step2Done), ...(ph === 'failed' || ph === 'rolling' || ph === 'recovered' ? { bakeEndTime: at(EV.caught), ...failedInfo } : {}), triggeredBy: sys };
		if (ph === 'rolling' || ph === 'recovered') {
			const rolled = { id: 3, version: R45, timestamp: at(EV.rolled), bakeStatus: ph === 'rolling' ? 'Deploying' : 'Succeeded', bakeStartTime: at(ph === 'rolling' ? EV.rolled : EV.step2Done2), ...(ph === 'recovered' ? { bakeEndTime: at(EV.recovered) } : {}), triggeredBy: { kind: 'User', name: VIEWER } };
			return [rolled, first, base];
		}
		return [first, base];
	}

	/* ---- gates (environment-controller wave.go / the dependency + schedule controllers) ---- */
	const withNew = ['b-44', 'b-45', 'b-46'], old = ['b-44', 'b-45'];
	function gates(p: Place): Any[] {
		if (p.env === 'staging') return [];
		const promo = isUS1(p) ? (t >= EV.promo ? ['b-46', 'b-45'] : ['b-45']) : ['b-45'];
		return [
			gate(`dependency-${DEP_NAME}`, t >= EV.depSat ? withNew : old),
			{ name: 'deploy-window', passing: t >= EV.window, allowedVersions: null, message: t >= EV.window ? 'Gate is passing' : 'Gate is not passing' },
			gate(`promotion-prod-${p.site}`, promo),
			gate('release-approval', t >= EV.approved ? withNew : old)
		];
	}

	function rollout(p: Place): Any {
		const ph = phaseOf(p, t);
		const nw = deployed(p);
		const cur = nw ? 'b-46' : 'b-45';
		const recovering = ph === 'rolling' || ph === 'recovered';
		const heldCandidate = !nw && p.env !== 'staging';
		return {
			apiVersion: 'kuberik.com/v1alpha1', kind: 'Rollout',
			metadata: { name: APP, namespace: p.ns, labels: { environment: p.site ? `${p.env}-${p.site}` : p.env }, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env } },
			spec: { releaseSourceRef: { name: APP }, versionHistoryLimit: 20, minBakeTime: '2m', bakeTime: isUS1(p) ? '50s' : '1m', healthCheckSelector: { matchLabels: { app: APP, env: p.site ? `${p.env}-${p.site}` : p.env } }, ...(recovering ? { wantedVersion: 'b-45' } : {}) },
			status: {
				source: 'github.com/exampleco/checkout-api', wantedVersion: recovering ? 'b-45' : cur, currentVersion: recovering ? 'b-45' : cur, previousVersion: recovering ? 'b-46' : nw ? 'b-45' : 'b-44',
				availableReleases: [R44, R45, R46], releaseCandidates: heldCandidate || recovering ? [R46] : [], history: history(p), gates: gates(p),
				...(recovering ? { conditions: [{ type: 'BakeFailureDisabled', status: 'True', reason: 'PreviousBakeFailed', message: 'Previous deployment failed. Health check failures will not fail this deployment.', lastTransitionTime: at(EV.rolled) }] } : {})
			}
		};
	}

	/* ---- environment-controller's view (wave.go): members, selected revision, the wave-2 leader's blocker while wave 1 is in flight ---- */
	const leaderOf = (p: Place) => PLACES.filter((q) => q.env === p.env && (q.wave ?? 1) === (p.wave ?? 1)).sort((a, b) => (a.site ?? 'default').localeCompare(b.site ?? 'default'))[0];
	const revOf = (q: Place) => (deployed(q) ? SHA[46] : SHA[45]);
	const bakeOf = (q: Place) => { const ph = phaseOf(q, t); return ph === 'deploying' ? 'Deploying' : ph === 'checking' ? 'InProgress' : ph === 'failed' ? 'Failed' : ph === 'rolling' ? 'Deploying' : 'Succeeded'; };
	function environment(p: Place): Any {
		const lead = leaderOf(p), w = p.wave ?? 1, upEnv = p.env === 'prod' ? 'staging' : null;
		const members = PLACES.filter((q) => q.env === p.env || q.env === upEnv).map((q) => ({ environment: q.env, site: q.site ?? 'default', wave: q.wave ?? 1, revision: revOf(q), bakeStatus: bakeOf(q) }))
			.sort((a, b) => a.environment.localeCompare(b.environment) || a.wave - b.wave || a.site.localeCompare(b.site));
		let blocker: Any = null;
		if (lead === p && !deployed(p)) {
			const prev = w > 1 ? PLACES.filter((q) => q.env === p.env && (q.wave ?? 1) === w - 1) : upEnv ? PLACES.filter((q) => q.env === upEnv) : [];
			const inFlight = prev.find((q) => { const ph = phaseOf(q, t); return ph === 'deploying' || ph === 'checking' || ph === 'failed' || ph === 'rolling'; });
			if (inFlight) blocker = { reason: 'WaitingFor', environment: inFlight.env, site: inFlight.site ?? 'default', waitingOn: 'Bake', revision: SHA[46] };
		}
		/* a FOLLOWER that has not deployed waits on its wave leader's selection record (environment-controller internal/wave/wave.go decideFollower, ~358-362: {reason: WaitingFor, waitingOn: Selection, site: <leader>}). A wave-2 LEADER's blocker above is {WaitingFor, waitingOn: Bake, site: <wave-1 site>} with NO outcome (fleet.go 368-377, wave.go 381-385): only followers of a failed leader would carry outcome Failed, and no such follower exists in this story. */
		if (lead !== p && !deployed(p)) blocker = { reason: 'WaitingFor', environment: p.env, site: lead.site ?? 'default', waitingOn: 'Selection', revision: SHA[46] };
		const cond = (type: string, status: string, reason: string, message: string) => ({ type, status, reason, message, lastTransitionTime: at(0) });
		return {
			apiVersion: 'environments.kuberik.com/v1alpha1', kind: 'Environment',
			metadata: { name: APP, namespace: p.ns, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env } },
			spec: { environment: p.env, name: 'checkout-api-service', rolloutRef: { name: APP }, ...(p.site ? { site: p.site, wave: p.wave } : {}) },
			status: {
				...(p.env === 'staging' ? {} : { rolloutGateRef: { name: `promotion-prod-${p.site}` } }),
				currentVersion: deployed(p) ? 'b-46' : 'b-45', lastStatusChangeTime: deployed(p) ? at(p.env === 'staging' ? 0 : EV.deploy) : new Date(ago(3 * H)).toISOString(),
				wave: { site: p.site ?? 'default', environment: p.env, name: 'kuberik-checkout-api-service', wave: w, role: lead === p ? 'Leader' : 'Follower', leader: lead.site ?? 'default', selectedRevision: revOf(lead), members, ...(blocker ? { blocker } : {}) },
				conditions: [blocker ? cond('WaveReady', 'False', 'WaitingFor', `${blocker.environment}/${blocker.site} bake on ${short(blocker.revision)}`) : cond('WaveReady', 'True', 'Ready', 'site may deploy the allowed versions'), cond('LockstepConsistent', 'True', 'Consistent', 'all members agree on lockstep')]
			}
		};
	}

	/* ---- the canary (Kruise Rollout) and its RolloutTest, per place ---- */
	function kruise(p: Place): { kr: Any; test: Any | null } {
		const ph = phaseOf(p, t);
		let idx = 2, st = 'Completed', upd = at(-1);
		if (p.env === 'staging') { idx = t < EV.step2 ? 1 : 2; st = ph === 'deploying' ? 'StepInProgress' : 'Completed'; upd = at(0); }
		const KR = `checkout-api-canary-${key(p)}`;
		let testPhase = 'WaitingForStep';
		if (isUS1(p)) {
			if (t >= EV.deploy && t < EV.rolled) {
				idx = t < EV.step2Go ? 1 : 2;
				st = t < EV.paused1 ? 'StepInProgress' : t < EV.step2Go ? 'StepPaused' : t < EV.step2Done ? 'StepInProgress' : 'Completed';
				upd = at(t < EV.paused1 ? EV.deploy : t < EV.step2Go ? EV.paused1 : t < EV.step2Done ? EV.step2Go : EV.step2Done);
			}
			if (t >= EV.rolled) {
				if (t < EV.stage1Again) { idx = 2; st = 'Completed'; upd = at(EV.step2Done); }
				else if (t < EV.step2Again) { idx = 1; st = 'StepPaused'; upd = at(EV.stage1Again); }
				else if (t < EV.step2Done2) { idx = 2; st = 'StepInProgress'; upd = at(EV.step2Again); }
				else { idx = 2; st = 'Completed'; upd = at(EV.step2Done2); }
			}
			const first = t < EV.testPending ? 'WaitingForStep' : t < EV.testRunning ? 'Pending' : t < EV.testPassed ? 'Running' : 'Succeeded';
			testPhase = t < EV.rolled ? first : t < EV.testPending2 ? 'WaitingForStep' : t < EV.testRunning2 ? 'Pending' : t < EV.testPassed2 ? 'Running' : 'Succeeded';
		}
		/* TRUTH R11: no pause duration; the step-1 bake time (20 s) runs from the moment the tests passed (stepgate writes step-1-ready-at) */
		const bake = isUS1(p) ? { 'rollout.kuberik.io/step-1-bake-time': '20s', ...(t >= EV.testPassed && t < EV.step2Go ? { 'internal.rollout.kuberik.io/step-1-ready-at': new Date(atMs(t) - 8_000).toISOString() } : {}) } : {};
		const kr = { apiVersion: 'rollouts.kruise.io/v1beta1', kind: 'Rollout', metadata: { name: KR, namespace: p.ns, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env, ...bake } },
			spec: { strategy: { canary: { steps: [{ replicas: '25%' }, { replicas: '100%' }] } } },
			status: { canaryStatus: { currentStepIndex: idx, currentStepState: st, lastUpdateTime: upd }, conditions: isUS1(p) && t >= EV.caught && t < EV.rolled ? [{ type: 'KuberikBakeHealthy', status: 'False', reason: 'BakeFailed', message: 'error-rate failed' }] : [] } };
		const test = isUS1(p) ? { apiVersion: 'rollout.kuberik.com/v1alpha1', kind: 'RolloutTest', metadata: { name: 'integration-test', namespace: p.ns },
			spec: { rolloutName: KR, stepIndex: 1, jobTemplate: { template: { spec: { containers: [{ name: 'run', image: 'ghcr.io/exampleco/checkout-api-it:b-46' }], restartPolicy: 'Never' } } } }, status: { phase: testPhase } } : null;
		return { kr, test };
	}
	const kustomization = (p: Place) => ({
		apiVersion: 'kustomize.toolkit.fluxcd.io/v1', kind: 'Kustomization',
		metadata: { name: `checkout-api-${key(p)}`, namespace: p.ns, annotations: { 'rollout.kuberik.com/substitute.CHECKOUT_API_VERSION.from': APP, 'rollout-dashboard.kuberik.com/source-cluster': p.env } },
		spec: {}, status: { conditions: [], inventory: { entries: [{ id: `${p.ns}_checkout-api-canary-${key(p)}_rollouts.kruise.io_Rollout` }] } }
	});

	/* ---- health checks: pending while a build deploys, then healthy; error-rate is the one that fails in us-east-1 ---- */
	function healthChecks(p: Place) {
		const ph = phaseOf(p, t);
		const mk = (name: 'error-rate' | 'latency-p99') => {
			let status = 'Healthy', message = `No alerts firing for labels map[alertname:${name === 'error-rate' ? 'HighErrorRate' : 'HighLatencyP99'} app:${APP}]`, obs: Any[] = [];
			if (p.env === 'staging' && t < (name === 'error-rate' ? EV.hcStagingErr : EV.hcStagingLat)) status = 'Pending';
			if (isUS1(p) && t >= EV.deploy) {
				if (name === 'latency-p99' && (t < EV.hcLat || (t >= EV.rolled && t < EV.hcLat2))) status = 'Pending';
				if (name === 'error-rate') {
					if (t < EV.caught || (t >= EV.rolled && t < EV.hcErr2)) status = 'Pending';
					else if (t < EV.rolled) { status = 'Unhealthy'; message = FAIL_MSG; obs = OBS; }
				}
			}
			return { apiVersion: 'kuberik.com/v1alpha1', kind: 'HealthCheck', metadata: { name: `${APP}-${name}`, namespace: p.ns, labels: { app: APP }, annotations: { 'kuberik.com/display-name': name } }, spec: { class: 'prometheus-alert' },
				status: { status, message, lastChangeTime: at(ph === 'old' ? -1 : EV.deploy), observations: obs } };
		};
		return { metadata: { namespace: p.ns, name: APP, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env } }, healthChecks: [mk('error-rate'), mk('latency-p99')] };
	}

	function dependencies() {
		const open = t >= EV.depSat;
		return PLACES.filter((p) => p.env === 'prod').map((p) => ({
			apiVersion: 'kuberik.com/v1alpha1', kind: 'RolloutDependency', metadata: { name: DEP_NAME, namespace: p.ns, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env } },
			spec: { contract: 'payments', providerRef: { name: 'payments-svc', namespace: 'platform-prod' }, rolloutRef: { name: APP } },
			status: {
				providedVersion: open ? '3.1.0' : '3.0.2', providedTag: open ? 'pay-310' : 'pay-302', admittedVersions: open ? withNew : old,
				blockedReleases: open ? [] : [{ tag: 'b-46', requiredVersion: '^3.1.0', reason: 'ConstraintNotSatisfied' }], gateName: `dependency-${DEP_NAME}`,
				conditions: [{ type: 'Ready', status: 'True', lastTransitionTime: at(0), reason: 'GateSynced', message: `Gate dependency-${DEP_NAME} allows ${open ? 3 : 2} release(s)` },
					open ? { type: 'Satisfied', status: 'True', lastTransitionTime: at(EV.depSat), reason: 'DependencySatisfied', message: 'No release is waiting on contract "payments"' }
						: { type: 'Satisfied', status: 'False', lastTransitionTime: at(0), reason: 'WaitingForProvider', message: 'Waiting for platform-prod/payments-svc to serve contract "payments" at a version satisfying release(s) [b-46] (deployed: 3.0.2)' }]
			}
		}));
	}

	const rolloutsAll = PLACES.map(rollout), envsAll = PLACES.map(environment), krs = PLACES.map(kruise), hcs = PLACES.map(healthChecks);
	const ex = extras({ failing: false, only: (a) => a.state === 'rest' || a.name === 'billing-api' });
	const change = (n: number, title: string, author: string, mergedMs: number, sha: string, files: number) => prChange('exampleco', APP, n, title, author, mergedMs, sha, files);
	const fleet = {
		rollouts: [...rolloutsAll, ...ex.rollouts] as never,
		environments: [...envsAll, ...ex.environments] as never,
		rolloutDependencies: { items: dependencies() as never },
		kustomizations: PLACES.map(kustomization) as never,
		kruiseRollouts: krs.map((k) => ({ ...k.kr, apiVersion: 'rollouts.kruise.io/v1alpha1' })) as never,
		changes: [change(101, 'Fix tax rounding on refunds', 'sophia-reed', ago(30 * H), SHA[44], 2), change(108, 'Show saved cards first', 'liam-foster', ago(4 * H), SHA[45], 4), change(112, 'Add Apple Pay to checkout', AUTHOR, atMs(-0.01), SHA[46], 6), ...ex.changes] as never,
		changesState: 'ok',
		healthChecks: [...hcs, ...ex.hcs] as never,
		github: { configured: true, connected: true, login: VIEWER }, me: VIEWER, now: new Date(atMs(t))
	} as unknown as FleetSource;

	/* ---- GitHub's own answers (commit ranges and lookups) ---- */
	const github: Record<string, unknown> = { ...ex.gh };
	const commit = (sha: string, message: string, author: string) => ({ sha, message, author, commitDate: new Date(ago(H)).toISOString() });
	for (const p of PLACES) {
		const path = `/api/rollouts/${p.ns}/${APP}/commits`;
		github[`${path}?base=${SHA[44]}&head=${SHA[45]}`] = { commits: [commit(SHA[45], '#108 Show saved cards first', 'liam-foster')], additions: 38, deletions: 11, changedFiles: 4 };
		github[`${path}?base=&head=${SHA[44]}`] = { commits: [commit(SHA[44], '#101 Fix tax rounding on refunds', 'sophia-reed')], additions: 21, deletions: 6, changedFiles: 2 };
		github[`${path}?base=${SHA[45]}&head=${SHA[46]}`] = { commits: [commit(SHA[46], '#112 Add Apple Pay to checkout', AUTHOR)], additions: 142, deletions: 9, changedFiles: 6 };
	}
	github[`/api/github/repos/exampleco/${APP}/commits/${SHA[46]}`] = { subject: '#112 Add Apple Pay to checkout', author: AUTHOR };
	github[`/api/github/repos/exampleco/${APP}/commits/${SHA[45]}`] = { subject: '#108 Show saved cards first', author: 'liam-foster' };
	github[`/api/github/repos/exampleco/${APP}/commits/${SHA[44]}`] = { subject: '#101 Fix tax rounding on refunds', author: 'sophia-reed' };

	/* ---- what the rollout page's queries are answered with: the prod us-east-1 place ---- */
	const i1 = PLACES.findIndex(isUS1);
	const NS = PLACES[i1].ns;
	const rGates = (rolloutsAll[i1].status.gates as Any[]).map((g) => ({
		apiVersion: 'kuberik.com/v1alpha1', kind: 'RolloutGate',
		metadata: { name: g.name, namespace: NS,
			...(g.name.startsWith('dependency-') ? { ownerReferences: [{ apiVersion: 'kuberik.com/v1alpha1', kind: 'RolloutDependency', name: DEP_NAME, uid: 'dep-uid' }] } : {}),
			...(g.name === 'deploy-window' ? { labels: { 'gate.kuberik.com/schedule-name': 'business-hours', 'gate.kuberik.com/schedule-kind': 'RolloutSchedule', 'gate.kuberik.com/rollout-name': APP }, annotations: { 'gate.kuberik.com/pretty-name': 'Business hours' }, ownerReferences: [{ apiVersion: 'kuberik.com/v1alpha1', kind: 'RolloutSchedule', name: 'business-hours', uid: 'sched-uid' }] } : {}),
			...(g.name === 'release-approval' ? { annotations: { 'gate.kuberik.com/pretty-name': 'Release approval' } } : {}) },
		spec: { rolloutRef: { name: APP }, ...(g.passing !== undefined ? { passing: g.passing } : {}), ...(g.allowedVersions ? { allowedVersions: g.allowedVersions } : {}) }, status: { message: g.message }
	}));
	const detail: Detail = {
		ns: NS, rollout: rolloutsAll[i1], kustomization: kustomization(PLACES[i1]), environment: envsAll[i1], kr: krs[i1].kr, test: krs[i1].test!, gates: rGates, healthChecks: hcs[i1].healthChecks,
		schedules: [{ metadata: { name: 'business-hours', namespace: NS, annotations: { 'gate.kuberik.com/pretty-name': 'Business hours' } },
			spec: { action: 'Allow', timezone: 'UTC', rolloutSelector: { matchLabels: { environment: 'prod' } }, rules: [{ name: 'weekdays', timeRange: { start: '10:00', end: '14:00' }, daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }] },
			status: { active: t >= EV.window, nextTransition: new Date(DAY_MS + (t >= EV.window ? 14 : 10) * 3600_000).toISOString(), managedGates: ['deploy-window'] } }]
	};
	return { fleet, github, detail };
}
