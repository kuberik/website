/**
 * HERO SCENARIO (35.5 s, lanes 33-36): release 4.46.0-46 of checkout-api ("Add Apple Pay to checkout") appears, staging takes it at once, a person approves
 * production, the canary in prod us-east-1 (wave 1) passes its test and health checks, and waves 2 and 3 (two regions each) then take the build by themselves.
 * No failure: the owner's rule is at most one, and late; the calm cut has none.
 *
 * `worldAt(t)` returns what the dashboard's own API would answer at story second `t`: raw Rollout / Environment / Kruise Rollout / RolloutTest /
 * Kustomization / HealthCheck / RolloutGate / RolloutDependency / RolloutSchedule CRs, and release-controller's catalogue (ReleaseSource + ReleaseSlice per place;
 * a Rollout carries only `spec.releaseSourceRef`, `status.releaseSource` and `status.candidates`, dashboard 07348479 #69/#120). Nothing in this file is a display string except GitHub's
 * own data (PR titles, people). The product's own view-models draw every word.
 * `EV` is the event table: the story seconds at which a CR changes (also what the film's data snapshots key on, see eventIndexAt()).
 */
import type { FleetSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { release, gate, prChange, catalogue, slicesStatus } from '../shared/cr';
import { extras } from '../surfaces/fleet';
import { clockSeconds } from './clock';

export const APP = 'checkout-api';
/** the viewer: an approver on the platform team. The product offers Approve on OTHER people's changes (home-view `elsewhere`), so the author (olivia-bennett) is not who presses it. */
export const VIEWER = 'noah-carter';
/** 2026-11-10 00:00 UTC, a Tuesday (the deploy window is weekdays) */
const DAY_MS = Date.parse('2026-11-10T00:00:00Z');
export const AUTHOR = 'olivia-bennett';
type Any = any;

/** story seconds at which a CR changes (script.ts shots: App 0-2.2, Change 2.2-7, Rollouts 7-10.7, Overview 10.7-19.9, Change 19.9-35.5) */
export const EV = {
	/* scene lane 2 (owner 2026-11-12, "calm, like Railway"): two views, the App page and the prod us-east-1 Overview. One state change at a time, then a hold */
	release: 0, devGo: 2.6, devCheck: 3.1, hcDevErr: 3.5, hcDevLat: 3.7, devDone: 4.1, /* dev takes the release at once (RAILWAY.md: a state change every 0.6-1.0 s, then a hold) */
	stagingGo: 4.5, check: 5.0, hcStagingErr: 5.5, hcStagingLat: 5.8, stagingDone: 6.3,
	promo: 7.0, /* the promotion gate opens a sync after staging's bake: prod us-east-1 asks for the release approval (the App page's own banner) */
	approved: 11.0, deploy: 11.0, /* the confirm is pressed at 10.7; the cut to the Overview lands on 11.0 with the approval: the banner never leaves on screen, the build moves by itself */
	paused1: 12.3, testPending: 12.6, testRunning: 13.0, testPassed: 15.0, step2Go: 16.2, step2Done: 17.1, hcLat: 17.8, hcErr: 18.2, us1Done: 19.1,
	w2Deploy: 21.0, w2Check0: 22.0, w2Check1: 22.3, w2Done0: 23.0, w2Done1: 23.4, /* scene lane 3: after the prod box is pressed (20.1) and its site list is open */
	w3Deploy: 24.2, w3Check0: 25.2, w3Check1: 25.5, w3Done0: 26.2, w3Done1: 26.6
} as const;
/** every story second a CR changes at: the film re-derives its (heavy) data snapshot only when one of these is passed */
export const EVENT_TIMES = [0, ...Object.values(EV)].sort((a, b) => a - b);
export const eventIndexAt = (t: number) => EVENT_TIMES.filter((e) => t >= e).length;

const H = 3600_000;
const SHA = { 44: 'b44d3e19a0c7e5a1f2b8c9d04e6a7b1c2d3e4f50', 45: 'b45a7c2e9d1f03b4a5c6d7e8f9a0b1c2d3e4f561', 46: 'e1c7a04b8d2f19a3c5e7091b3d5f7a9c1e3b5d72' };
const short = (sha: string) => sha.slice(0, 7);

type Place = { ns: string; env: 'dev' | 'staging' | 'prod'; site?: string; wave?: number };
export const PLACES: Place[] = [
	{ ns: 'checkout-api-dev', env: 'dev' },
	{ ns: 'checkout-api-staging', env: 'staging' },
	{ ns: 'checkout-api-prod-us-east-1', env: 'prod', site: 'us-east-1', wave: 1 },
	{ ns: 'checkout-api-prod-us-east-2', env: 'prod', site: 'us-east-2', wave: 2 },
	{ ns: 'checkout-api-prod-eu-west-1', env: 'prod', site: 'eu-west-1', wave: 2 },
	{ ns: 'checkout-api-prod-eu-central-1', env: 'prod', site: 'eu-central-1', wave: 3 },
	{ ns: 'checkout-api-prod-ap-southeast-2', env: 'prod', site: 'ap-southeast-2', wave: 3 }
];
const key = (p: Place) => p.site ?? p.env;
const isUS1 = (p: Place) => p.site === 'us-east-1';
const DEP_NAME = 'checkout-api-needs-payments';
/** the ApprovalPolicy that owns prod's approval gate, the RolloutApproval the viewer's press creates (dashboard approve endpoint: `<rollout>-<version>`), and its approver (the Kubernetes username) */
const APPROVAL_POLICY = 'prod-needs-approval', APPROVAL_NAME = `${APP}-b-46`, APPROVER = `oidc:${VIEWER}`;

/** where a place is, at `t`: which build it runs and what its newest history entry says */
export type Phase = 'old' | 'deploying' | 'checking' | 'done';
/** waves 2 and 3 (two regions each) take the build together (one selection per wave, the leader first) and each region's bake ends on its own */
const LATE: Record<string, { go: number; check: number; done: number }> = {
	'eu-west-1': { go: EV.w2Deploy, check: EV.w2Check0, done: EV.w2Done0 }, 'us-east-2': { go: EV.w2Deploy, check: EV.w2Check1, done: EV.w2Done1 },
	'ap-southeast-2': { go: EV.w3Deploy, check: EV.w3Check0, done: EV.w3Done0 }, 'eu-central-1': { go: EV.w3Deploy, check: EV.w3Check1, done: EV.w3Done1 }
};
export const lateOf = (site: string) => LATE[site];
/** scene lane 2: the two environments before production (dev, then staging), each one deploy + two health checks */
const PRE: Record<'dev' | 'staging', { go: number; check: number; hcErr: number; hcLat: number; done: number }> = {
	dev: { go: EV.devGo, check: EV.devCheck, hcErr: EV.hcDevErr, hcLat: EV.hcDevLat, done: EV.devDone },
	staging: { go: EV.stagingGo, check: EV.check, hcErr: EV.hcStagingErr, hcLat: EV.hcStagingLat, done: EV.stagingDone }
};
const preOf = (p: Place) => (p.env === 'prod' ? null : PRE[p.env]);
export function phaseOf(p: Place, t: number): Phase {
	const e = preOf(p); if (e) return t < e.go ? 'old' : t < e.check ? 'deploying' : t < e.done ? 'checking' : 'done';
	if (isUS1(p)) return t < EV.deploy ? 'old' : t < EV.step2Done ? 'deploying' : t < EV.us1Done ? 'checking' : 'done';
	const L = LATE[p.site!];
	return t < L.go ? 'old' : t < L.check ? 'deploying' : t < L.done ? 'checking' : 'done';
}
const onNewBuild = (ph: Phase) => ph !== 'old';

export type Detail = { approvals: Any; catalogue: { source: Any; slices: Any[] }; ns: string; rollout: Any; kustomization: Any; environment: Any; kr: Any; test: Any; gates: Any[]; healthChecks: Any[]; schedules: Any[] };

export function worldAt(t: number): { fleet: FleetSource; github: Record<string, unknown>; detail: Detail } {
	/* THE CLOCK: `now` is the story clock (a Tuesday, UTC), so every absolute time the product prints ("reopens 10:00 UTC", "closes 14:00 UTC") agrees with the chrome clock;
	   each CR timestamp is placed on the same piecewise-linear map (clock.ts), and pre-story ages count back from the first frame. */
	const atMs = (tt: number) => DAY_MS + clockSeconds(tt) * 1000;
	const at = (tt: number) => new Date(atMs(tt)).toISOString();
	const STORY0 = atMs(0);
	const ago = (ms: number) => STORY0 - ms;
	const rel = (n: number, sha: string, createdMs: number) => release(`b-${n}`, `4.${n}.0-${n}`, sha, createdMs);
	const R44 = rel(44, SHA[44], ago(30 * H)), R45 = rel(45, SHA[45], ago(4 * H));
	const R46 = { ...rel(46, SHA[46], atMs(EV.release)), requires: { payments: '^3.1.0' } };
	const out46 = t >= EV.release; /* lane 35: the release exists from the first frame (an inserted row pushed the 4.45 group down) */
	const deployed = (p: Place) => onNewBuild(phaseOf(p, t));

	/* ---- history: the API's own entry shape (rollout-controller api/v1alpha1 DeploymentHistoryEntry + rollout_controller.go): `message` = generateDeploymentMessage ("Automatic deployment", or the person's explanation), `bakeStatusMessage` = the bake's own sentence, `bakeStartTime` is nil until the health checks first turn healthy, `triggeredBy` System is named "rollout-controller", a failed bake carries failedHealthChecks {name, namespace, message, observations} ---- */
	const DONE_MSG = 'Bake time completed successfully (no errors within bake time).', WAIT_MSG = 'Waiting for health checks to become healthy before starting bake.', START_MSG = 'Bake started, monitoring for errors.';
	const sys = { kind: 'System', name: 'rollout-controller' };
	const auto = 'Automatic deployment';
	const base = { id: 1, version: R45, timestamp: new Date(ago(3 * H)).toISOString(), message: auto, bakeStatus: 'Succeeded', bakeStatusMessage: DONE_MSG, bakeStartTime: new Date(ago(3 * H)).toISOString(), bakeEndTime: new Date(ago(3 * H) + 600_000).toISOString(), triggeredBy: sys };
	/* the controller starts a bake (bakeStartTime, InProgress, "Bake started...") only once EVERY health check is Healthy with a fresh lastChangeTime (rollout_controller.go ~1950-1984); until then the entry is Deploying and "Waiting for health checks to become healthy before starting bake." */
	const startOf = (p: Place) => (preOf(p) ? preOf(p)!.go : isUS1(p) ? EV.deploy : LATE[p.site!].go);
	const bakeAt = (p: Place) => (preOf(p) ? preOf(p)!.hcLat : isUS1(p) ? EV.hcErr : LATE[p.site!].check);
	const doneAt = (p: Place) => (preOf(p) ? preOf(p)!.done : isUS1(p) ? EV.us1Done : LATE[p.site!].done);
	const baking = (p: Place) => t >= bakeAt(p);
	function history(p: Place): Any[] {
		const ph = phaseOf(p, t);
		if (ph === 'old') return [base];
		const bk = baking(p), done = ph === 'done';
		/* a prod place took b-46 through its approval gate: the entry names the RolloutApproval that let it through (rollout-controller history[].approval, `by` = the approval.kuberik.com/by annotation the dashboard's approve endpoint writes) */
		const approval = p.env === 'prod' ? { approval: { name: APPROVAL_NAME, by: APPROVER } } : {};
		return [{ id: 2, version: R46, timestamp: at(startOf(p)), message: auto, ...approval, bakeStatus: done ? 'Succeeded' : bk ? 'InProgress' : 'Deploying', bakeStatusMessage: done ? DONE_MSG : bk ? START_MSG : WAIT_MSG, ...(bk ? { bakeStartTime: at(bakeAt(p)) } : {}), ...(done ? { bakeEndTime: at(doneAt(p)) } : {}), triggeredBy: sys }, base];
	}

	/* ---- gates (environment-controller wave.go / the dependency + schedule controllers) ---- */
	const old = ['b-44', 'b-45'], withNew = out46 ? ['b-44', 'b-45', 'b-46'] : old;
	function gates(p: Place): Any[] {
		if (p.env !== 'prod') return [];
		/* wave 1 (us-east-1) may take what staging finished; each later wave what the wave before finished baking (environment-controller wave.go) */
		const promoOpen = out46 && (isUS1(p) ? t >= EV.promo : p.wave === 2 ? t >= EV.us1Done : t >= EV.w2Done1);
		/* `kind` and `displayName` are the dashboard API's own additions to each gate summary (pkg/kubernetes/gatekind.go: by the gate object's owner / labels; the pretty-name annotation) */
		return [
			{ ...gate(`dependency-${DEP_NAME}`, withNew), kind: 'dependency' },
			{ name: 'deploy-window', passing: true, allowedVersions: null, message: 'Gate is passing', kind: 'schedule', displayName: 'Business hours' },
			{ ...gate(`promotion-prod-${p.site}`, promoOpen ? ['b-46', 'b-45'] : ['b-45']), kind: 'promotion' },
			/* the ApprovalPolicy's gate: its allow-list is the versions a RolloutApproval names (the approval controller), b-46 from the viewer's approval on */
			{ ...gate('release-approval', t >= EV.approved ? withNew : old), kind: 'approval', displayName: 'Release approval' }
		];
	}

	function rollout(p: Place): Any {
		const rels = out46 ? [R44, R45, R46] : [R44, R45];
		const gs = gates(p);
		return {
			apiVersion: 'kuberik.com/v1alpha1', kind: 'Rollout',
			metadata: { name: APP, namespace: p.ns, labels: { environment: p.site ? `${p.env}-${p.site}` : p.env }, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env } },
			spec: { releaseSourceRef: { name: APP }, versionHistoryLimit: 20, bakeTime: isUS1(p) ? '50s' : '1m', healthCheckSelector: { matchLabels: { app: APP, env: p.site ? `${p.env}-${p.site}` : p.env } } },
			status: {
				source: 'github.com/exampleco/checkout-api',
				...slicesStatus(APP, rels, history(p)[0].version.tag, gs), history: history(p), gates: gs
			}
		};
	}

	/* ---- environment-controller's view (wave.go): members, selected revision, the wave-2 leader's blocker while wave 1 is in flight ---- */
	const leaderOf = (p: Place) => PLACES.filter((q) => q.env === p.env && (q.wave ?? 1) === (p.wave ?? 1)).sort((a, b) => (a.site ?? 'default').localeCompare(b.site ?? 'default'))[0];
	const revOf = (q: Place) => (deployed(q) ? SHA[46] : SHA[45]);
	const bakeOf = (q: Place) => { const ph = phaseOf(q, t); return ph === 'deploying' ? 'Deploying' : ph === 'checking' ? (baking(q) ? 'InProgress' : 'Deploying') : 'Succeeded'; };
	function environment(p: Place): Any {
		const lead = leaderOf(p), w = p.wave ?? 1, upEnv = p.env === 'prod' ? 'staging' : p.env === 'staging' ? 'dev' : null;
		const members = PLACES.filter((q) => q.env === p.env || q.env === upEnv).map((q) => ({ environment: q.env, site: q.site ?? 'default', wave: q.wave ?? 1, revision: revOf(q), bakeStatus: bakeOf(q) }))
			.sort((a, b) => a.environment.localeCompare(b.environment) || a.wave - b.wave || a.site.localeCompare(b.site));
		let blocker: Any = null;
		if (lead === p && !deployed(p)) {
			const prev = w > 1 ? PLACES.filter((q) => q.env === p.env && (q.wave ?? 1) === w - 1) : upEnv ? PLACES.filter((q) => q.env === upEnv) : [];
			const inFlight = prev.find((q) => { const ph = phaseOf(q, t); return ph === 'deploying' || ph === 'checking'; });
			if (inFlight) blocker = { reason: 'WaitingFor', environment: inFlight.env, site: inFlight.site ?? 'default', waitingOn: 'Bake', revision: SHA[46] };
		}
		/* a FOLLOWER carries NO blocker here (wave.go decideFollower): the wave's selection is the leader's newest deployment once the previous wave completed it, and that is the build every site already runs (SHA45), so the follower is Ready with allowed = [that tag]. WaitingFor/Selection only exists while a wave has no selection at all, which this story never has. Only the wave-2 LEADER waits (above): {WaitingFor, waitingOn: Bake, site: <wave-1 site>, revision} and NO outcome (fleet.go blocker()). */
		const cond = (type: string, status: string, reason: string, message: string) => ({ type, status, reason, message, lastTransitionTime: at(0) });
		return {
			apiVersion: 'environments.kuberik.com/v1alpha1', kind: 'Environment',
			metadata: { name: APP, namespace: p.ns, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env } },
			spec: { environment: p.env, name: 'checkout-api-service', rolloutRef: { name: APP }, backend: { type: 'github', project: 'exampleco/checkout-api', secret: 'github-token' }, ...(p.site ? { site: p.site, wave: p.wave } : {}) },
			status: {
				...(p.env !== 'prod' ? {} : { rolloutGateRef: { name: `promotion-prod-${p.site}` } }),
				currentVersion: deployed(p) ? 'b-46' : 'b-45', lastStatusChangeTime: deployed(p) ? at(startOf(p)) : new Date(ago(3 * H)).toISOString(),
				wave: { site: p.site ?? 'default', environment: p.env, name: 'kuberik-checkout-api-service', wave: w, role: lead === p ? 'Leader' : 'Follower', leader: lead.site ?? 'default', selectedRevision: revOf(lead), members, ...(blocker ? { blocker } : {}) },
				conditions: [blocker ? cond('WaveReady', 'False', 'WaitingFor', `${blocker.environment}/${blocker.site} bake on ${short(blocker.revision)}`) : cond('WaveReady', 'True', 'Ready', 'site may deploy the allowed versions'), cond('LockstepConsistent', 'True', 'Consistent', 'all members agree on lockstep')]
			}
		};
	}

	/* ---- the canary (Kruise Rollout) and its RolloutTest, per place ---- */
	function kruise(p: Place): { kr: Any; test: Any | null } {
		const ph = phaseOf(p, t);
		let idx = 2, st = 'Completed', upd = at(-1);
		if (ph !== 'old' && !isUS1(p)) {
			/* staging and wave 2: 25 % then 100 %, no test; the check (bake) follows the last step */
			const go = startOf(p), mid = go + (preOf(p) ? 0.25 : 0.8), end = preOf(p) ? preOf(p)!.check : LATE[p.site!].check;
			idx = t < mid ? 1 : 2; st = t < end ? 'StepInProgress' : 'Completed'; upd = at(t < mid ? go : t < end ? mid : end);
		}
		const KR = `checkout-api-canary-${key(p)}`;
		let testPhase = 'WaitingForStep';
		if (isUS1(p)) {
			if (t >= EV.deploy) {
				idx = t < EV.step2Go ? 1 : 2;
				st = t < EV.paused1 ? 'StepInProgress' : t < EV.step2Go ? 'StepPaused' : t < EV.step2Done ? 'StepInProgress' : 'Completed';
				upd = at(t < EV.paused1 ? EV.deploy : t < EV.step2Go ? EV.paused1 : t < EV.step2Done ? EV.step2Go : EV.step2Done);
			}
			testPhase = t < EV.testPending ? 'WaitingForStep' : t < EV.testRunning ? 'Pending' : t < EV.testPassed ? 'Running' : 'Succeeded';
		}
		/* TRUTH R11: no pause duration; the step-1 bake time (20 s) runs from the moment the tests passed (stepgate writes step-1-ready-at) */
		const bake = isUS1(p) ? { 'rollout.kuberik.io/step-1-bake-time': '20s', ...(t >= EV.testPassed && t < EV.step2Go ? { 'internal.rollout.kuberik.io/step-1-ready-at': new Date(atMs(t) - 8_000).toISOString() } : {}) } : {};
		const kr = { apiVersion: 'rollouts.kruise.io/v1beta1', kind: 'Rollout', metadata: { name: KR, namespace: p.ns, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env, ...bake } },
			spec: { strategy: { canary: { steps: [{ replicas: '25%' }, { replicas: '100%' }] } } },
			status: { canaryStatus: { currentStepIndex: idx, currentStepState: st, lastUpdateTime: upd }, conditions: [] } };
		const test = isUS1(p) ? { apiVersion: 'rollout.kuberik.com/v1alpha1', kind: 'RolloutTest', metadata: { name: 'integration-test', namespace: p.ns },
			spec: { rolloutName: KR, stepIndex: 1, jobTemplate: { template: { spec: { containers: [{ name: 'run', image: 'ghcr.io/exampleco/checkout-api-it:b-46' }], restartPolicy: 'Never' } } } }, status: { phase: testPhase } } : null;
		return { kr, test };
	}
	const kustomization = (p: Place) => ({
		apiVersion: 'kustomize.toolkit.fluxcd.io/v1', kind: 'Kustomization',
		metadata: { name: `checkout-api-${key(p)}`, namespace: p.ns, annotations: { 'rollout.kuberik.com/substitute.CHECKOUT_API_VERSION.from': APP, 'rollout-dashboard.kuberik.com/source-cluster': p.env } },
		spec: {}, status: { conditions: [], inventory: { entries: [{ id: `${p.ns}_checkout-api-canary-${key(p)}_rollouts.kruise.io_Rollout` }] } }
	});

	/* ---- health checks: pending while a build deploys, then healthy (staging: error-rate first, then latency; us-east-1 the same; wave 2 both at its check) ---- */
	function healthChecks(p: Place) {
		const ph = phaseOf(p, t);
		const mk = (name: 'error-rate' | 'latency-p99') => {
			let status = 'Healthy', since = -1; /* story second of the latest status transition (the check's lastChangeTime) */
			const message = `No alerts firing for labels map[alertname:${name === 'error-rate' ? 'HighErrorRate' : 'HighLatencyP99'} app:${APP}]`;
			if (ph !== 'old') {
				const turn = preOf(p) ? (name === 'error-rate' ? preOf(p)!.hcErr : preOf(p)!.hcLat) : isUS1(p) ? (name === 'error-rate' ? EV.hcErr : EV.hcLat) : LATE[p.site!].check;
				if (t < turn) { status = 'Pending'; since = startOf(p); } else since = turn;
			}
			return { apiVersion: 'kuberik.com/v1alpha1', kind: 'HealthCheck', metadata: { name: `${APP}-${name}`, namespace: p.ns, labels: { app: APP }, annotations: { 'kuberik.com/display-name': name } }, spec: { class: 'prometheus-alert' },
				status: { status, message, lastChangeTime: at(since), observations: [] } };
		};
		return { metadata: { namespace: p.ns, name: APP, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env } }, healthChecks: [mk('error-rate'), mk('latency-p99')] };
	}

	function dependencies() {
		const open = true; /* payments already serves 3.1.0: the contract never holds this release */
		return PLACES.filter((p) => p.env === 'prod').map((p) => ({
			apiVersion: 'kuberik.com/v1alpha1', kind: 'RolloutDependency', metadata: { name: DEP_NAME, namespace: p.ns, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': p.env } },
			spec: { contract: 'payments', providerRef: { name: 'payments-svc', namespace: 'platform-prod' }, rolloutRef: { name: APP } },
			status: {
				providedVersion: open ? '3.1.0' : '3.0.2', providedTag: open ? 'pay-310' : 'pay-302', admittedVersions: open ? withNew : old,
				blockedReleases: open ? [] : [{ tag: 'b-46', requiredVersion: '^3.1.0', reason: 'ConstraintNotSatisfied' }], gateName: `dependency-${DEP_NAME}`,
				conditions: [{ type: 'Ready', status: 'True', lastTransitionTime: at(0), reason: 'GateSynced', message: `Gate dependency-${DEP_NAME} allows ${open ? 3 : 2} release(s)` },
					open ? { type: 'Satisfied', status: 'True', lastTransitionTime: at(-1), reason: 'DependencySatisfied', message: 'No release is waiting on contract "payments"' }
						: { type: 'Satisfied', status: 'False', lastTransitionTime: at(0), reason: 'WaitingForProvider', message: 'Waiting for platform-prod/payments-svc to serve contract "payments" at a version satisfying release(s) [b-46] (deployed: 3.0.2)' }]
			}
		}));
	}

	const cats = PLACES.map((p) => catalogue(p.ns, p.env, APP, 'ghcr.io/exampleco/checkout-api', out46 ? [R44, R45, R46] : [R44, R45]));
	const rolloutsAll = PLACES.map(rollout), envsAll = PLACES.map(environment), krs = PLACES.map(kruise), hcs = PLACES.map(healthChecks);
	const ex = extras({ failing: false, only: (a) => a.state === 'rest' || a.name === 'billing-api' });
	const change = (n: number, title: string, author: string, mergedMs: number, sha: string, files: number) => prChange('exampleco', APP, n, title, author, mergedMs, sha, files);
	const fleet = {
		rollouts: [...rolloutsAll, ...ex.rollouts] as never,
		/* the rollouts list's catalogue siblings (dashboard api/rollouts.ts: `releaseSources` / `releaseSlices`, stamped with the source cluster) */
		releaseSources: { items: [...cats.map((c) => c.source), ...ex.sources] },
		releaseSlices: { items: [...cats.flatMap((c) => c.slices), ...ex.slices] },
		environments: [...envsAll, ...ex.environments] as never,
		rolloutDependencies: { items: dependencies() as never },
		kustomizations: PLACES.map(kustomization) as never,
		kruiseRollouts: krs.map((k) => ({ ...k.kr, apiVersion: 'rollouts.kruise.io/v1alpha1' })) as never,
		changes: [change(101, 'Fix tax rounding on refunds', 'sophia-reed', ago(30 * H), SHA[44], 2), change(108, 'Show saved cards first', 'liam-foster', ago(4 * H), SHA[45], 4), change(112, 'Add Apple Pay to checkout', AUTHOR, atMs(EV.release) - 4 * 60_000, SHA[46], 6), ...ex.changes] as never,
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
			...(g.name.startsWith('promotion-') ? { ownerReferences: [{ apiVersion: 'environments.kuberik.com/v1alpha1', kind: 'Environment', name: APP, uid: 'env-uid', controller: true }] } : {}),
			/* the approval controller's gate (design/APPROVALS-API.md §5.1): owned by an ApprovalPolicy, labelled with it */
			...(g.name === 'release-approval' ? { labels: { 'gate.kuberik.com/approval-policy-name': APPROVAL_POLICY, 'gate.kuberik.com/approval-policy-namespace': NS, 'gate.kuberik.com/approval-policy-kind': 'ApprovalPolicy', 'gate.kuberik.com/rollout-name': APP }, annotations: { 'gate.kuberik.com/pretty-name': 'Release approval' }, ownerReferences: [{ apiVersion: 'kuberik.com/v1alpha1', kind: 'ApprovalPolicy', name: APPROVAL_POLICY, uid: 'policy-uid', controller: true, blockOwnerDeletion: true }] } : {}) },
		spec: { rolloutRef: { name: APP }, ...(g.passing !== undefined ? { passing: g.passing } : {}), ...(g.allowedVersions ? { allowedVersions: g.allowedVersions } : {}) }, status: { message: g.message }
	}));
	/* GET .../approvals: the place's RolloutApprovals (the viewer's, from the press on), `by` verified on this cluster */
	const approvals = { byVerified: true, approvals: t >= EV.approved ? [{ name: APPROVAL_NAME, version: 'b-46', by: APPROVER, createdAt: at(EV.approved) }] : [] };
	const detail: Detail = {
		ns: NS, approvals, catalogue: cats[i1], rollout: rolloutsAll[i1], kustomization: kustomization(PLACES[i1]), environment: envsAll[i1], kr: krs[i1].kr, test: krs[i1].test!, gates: rGates, healthChecks: hcs[i1].healthChecks,
		schedules: [{ metadata: { name: 'business-hours', namespace: NS, annotations: { 'gate.kuberik.com/pretty-name': 'Business hours' } },
			spec: { action: 'Allow', timezone: 'UTC', rolloutSelector: { matchLabels: { environment: 'prod' } }, rules: [{ name: 'weekdays', timeRange: { start: '10:00', end: '14:00' }, daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }] },
			status: { active: true, nextTransition: new Date(DAY_MS + 14 * 3600_000).toISOString(), managedGates: ['deploy-window'] } }]
	};
	return { fleet, github, detail };
}
