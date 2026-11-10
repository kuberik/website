/**
 * SPIKE (landing-v5 rollout-detail surfaces): the rollout page (Overview / Gates / History) for checkout-api in prod us-east-1, mounted
 * from the SAME world as the other surfaces (surfaceFleet = hero fleetAt + 10 apps). Nothing is rendered from this file: it only answers
 * what the dashboard's API would have answered, as raw CRs, and the product's own route components draw it.
 *
 * STUBS (every one named; none edits the dashboard):
 *   1. `@tanstack/svelte-query`  stubs/svelte-query.svelte.ts  -> `setQueryAnswers(detailAnswers(v))` below answers the route's query keys:
 *        rollout (RolloutResponse), rollout-permissions, managed-resources, health-checks, events, github-status, cluster-info,
 *        rollout-schedule-window, rollouts/namespace. No fetch, no cache.
 *   2. flowbite Modal            stubs/flowbite-modal.svelte -> an in-window dialog (the real ChangeVersionModal body renders inside it).
 *   3. `$app/state` `page`       stubs/app-state.ts -> params/url assigned in `mountRollout` before mount (the route reads page.params and ?action=).
 *   4. `$app/navigation`, `$app/paths` (existing inert stubs), flowbite Popover/Toggle/Spinner (existing inert).
 *   5. The tab strip is the REAL `+layout.svelte`, wrapped by RolloutShell.svelte with the active route as its children snippet
 *      (no SvelteKit router). `RolloutTabHeader.svelte` is not used by any route at this commit (it only has a test), so it is not mounted.
 * NEW SEAM: RolloutTest has no field on FleetSource; the narrowest seam is the `managed-resources` answer (the page joins Kruise Rollout +
 * RolloutTest from the Kustomization's managed resources: pipelineValidRollouts / pipelineValidTests), i.e. the same shape the API serves.
 */
import { surfaceFleet } from './fleet';
import { CLOCK_MS, gate } from '../shared/cr';
import { setPart } from '../shared/world';
import { setQueryAnswers } from '../../stubs/svelte-query.svelte';

export const NS = 'checkout-api-prod-us-east-1';
export const NAME = 'checkout-api';
export const CLUSTER = 'prod';
const KR = 'checkout-api-canary-us-east-1';
const KUST = 'checkout-api-us-east-1';
const iso = (msAgo: number) => new Date(CLOCK_MS - msAgo).toISOString();
const MIN = 60_000;

export type Variant = 'overview-pending' | 'overview-running' | 'overview-passed' | 'rollback' | 'gates' | 'history';
type Any = any;

/** the two-stage canary (25% -> 100%) with an integration-test RolloutTest after the first step (spec.stepIndex is 1-based: the card compares it with stage number) */
function kruiseAndTest(v: Variant) {
	const phase = v === 'overview-pending' ? 'Pending' : v === 'overview-running' ? 'Running' : 'Succeeded';
	const stalled = v === 'rollback';
	const kr = {
		apiVersion: 'rollouts.kruise.io/v1beta1', kind: 'Rollout',
		metadata: { name: KR, namespace: NS, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': CLUSTER } },
		spec: { strategy: { canary: { steps: [{ replicas: '25%' }, { replicas: '100%' }] } } },
		status: {
			canaryStatus: { currentStepIndex: v === 'gates' || v === 'history' ? 2 : v === 'rollback' ? 2 : 1, currentStepState: v === 'gates' || v === 'history' ? 'Completed' : 'StepPaused', lastUpdateTime: iso(1 * MIN) },
			conditions: stalled ? [{ type: 'KuberikBakeHealthy', status: 'False', reason: 'BakeFailed', message: 'error-rate failed' }] : []
		}
	};
	const test = {
		apiVersion: 'rollout.kuberik.com/v1alpha1', kind: 'RolloutTest',
		metadata: { name: 'integration-test', namespace: NS },
		spec: { rolloutName: KR, stepIndex: 1, jobTemplate: { template: { spec: { containers: [{ name: 'run', image: 'ghcr.io/exampleco/checkout-api-it:b-46' }], restartPolicy: 'Never' } } } },
		status: { phase }
	};
	return { kr, test };
}

const FAIL_MSG = '3.2% of requests failed, over a 1% budget';
const OBS = [{ name: 'error rate', kind: 'Threshold', value: '3.2', limit: '1', unit: '%', direction: 'Above', healthy: false }];

/** the one us-east-1 rollout, patched for the variant (everything else in the world is the surfaces fleet at the matching story second) */
export function detailWorld(v: Variant) {
	const t = v === 'gates' ? 8 : v === 'rollback' || v === 'history' ? 33 : 23;
	const s = surfaceFleet(t);
	const fleet = s.fleet as Any;
	const idx = (fleet.rollouts as Any[]).findIndex((r) => r.metadata.namespace === NS && r.metadata.name === NAME);
	const r = structuredClone(fleet.rollouts[idx]) as Any;
	const { kr, test } = kruiseAndTest(v);
	const hist: Any[] = r.status.history;
	r.status.gates = [...r.status.gates, { name: 'deploy-window', passing: true, allowedVersions: null, message: 'Gate is passing' }]; // the schedule's gate (RolloutSchedule business-hours), alphabetical like the controller's summary
	r.status.gates.sort((a: Any, b: Any) => a.name.localeCompare(b.name));
	if (v.startsWith('overview')) {
		hist[0] = { ...hist[0], bakeStatus: 'Deploying', timestamp: iso(4 * MIN), bakeStartTime: iso(4 * MIN), bakeEndTime: undefined };
	}
	if (v === 'rollback') {
		hist[0] = { ...hist[0], bakeStatus: 'Failed', timestamp: iso(9 * MIN), bakeStartTime: iso(9 * MIN), bakeEndTime: iso(3 * MIN), message: 'Health check error-rate failed',
			failedHealthChecks: [{ name: 'error-rate', message: FAIL_MSG, observations: OBS }] };
	}
	if (v === 'history') {
		const failed = { ...hist[0], id: 2, bakeStatus: 'Failed', timestamp: iso(40 * MIN), bakeStartTime: iso(40 * MIN), bakeEndTime: iso(31 * MIN), message: 'Health check error-rate failed',
			failedHealthChecks: [{ name: 'error-rate', message: FAIL_MSG, observations: OBS }] };
		const rolled = { id: 3, version: hist[1].version, timestamp: iso(28 * MIN), bakeStatus: 'Succeeded', bakeStartTime: iso(28 * MIN), bakeEndTime: iso(18 * MIN), triggeredBy: { kind: 'User', name: 'olivia-bennett' }, message: 'Rolled back: error rate 3.2% over budget' };
		r.status.history = [rolled, failed, ...hist.slice(1)];
		r.status.wantedVersion = rolled.version.tag; r.status.currentVersion = rolled.version.tag; r.status.previousVersion = 'b-46';
	}
	fleet.rollouts[idx] = r;
	// the world's Kruise Rollout for this place becomes the two-stage canary (the list copy is merged by `freshestKruise`, so they must agree)
	const ki = (fleet.kruiseRollouts as Any[]).findIndex((k) => k.metadata.namespace === NS);
	fleet.kruiseRollouts[ki] = { ...kr, apiVersion: 'rollouts.kruise.io/v1alpha1' };
	// health checks of the place: the failing error-rate carries its observation figure
	const hcs = fleet.healthChecks as Any[];
	const hi = hcs.findIndex((h) => h.metadata.namespace === NS);
	if (v === 'rollback') {
		hcs[hi] = { ...hcs[hi], healthChecks: hcs[hi].healthChecks.map((h: Any) => h.metadata.annotations['kuberik.com/display-name'] === 'error-rate'
			? { ...h, status: { ...h.status, status: 'Unhealthy', message: FAIL_MSG, lastChangeTime: iso(5 * MIN), observations: OBS } } : h) };
	}
	setPart('surface', fleet, s.github);
	const env = (fleet.environments as Any[]).find((e) => e.metadata.namespace === NS);
	const kust = (fleet.kustomizations as Any[]).find((k) => k.metadata.namespace === NS);
	const gates = gateObjects(r);
	const depItems = (fleet.rolloutDependencies?.items ?? []).filter((d: Any) => d.metadata.namespace === NS);
	return { fleet, r, env, kust, kr, test, gates, hc: hcs[hi].healthChecks, depItems, t };
}

/** RolloutGate CRs behind rollout.status.gates, as the detail route serves them (`rolloutGates.items`), plus the deploy-window schedule's gate */
function gateObjects(r: Any): Any[] {
	const own = (r.status.gates as Any[]).map((g) => ({
		apiVersion: 'kuberik.com/v1alpha1', kind: 'RolloutGate',
		metadata: {
			name: g.name, namespace: NS,
			...(g.name.startsWith('dependency-') ? { ownerReferences: [{ apiVersion: 'kuberik.com/v1alpha1', kind: 'RolloutDependency', name: 'checkout-api-needs-payments', uid: 'dep-uid' }] } : {}),
			...(g.name === 'integration-tests' ? { annotations: { 'gate.kuberik.com/pretty-name': 'Integration tests' } } : {}),
			...(g.name === 'release-approval' ? { annotations: { 'gate.kuberik.com/pretty-name': 'Release approval' } } : {})
		},
		spec: { rolloutRef: { name: NAME }, ...(g.passing !== undefined ? { passing: g.passing } : {}), ...(g.allowedVersions ? { allowedVersions: g.allowedVersions } : {}) },
		status: { message: g.message }
	}));
	return [...own, {
		apiVersion: 'kuberik.com/v1alpha1', kind: 'RolloutGate',
		metadata: { name: 'deploy-window', namespace: NS, labels: { 'gate.kuberik.com/schedule-name': 'business-hours', 'gate.kuberik.com/schedule-kind': 'RolloutSchedule', 'gate.kuberik.com/rollout-name': NAME },
			annotations: { 'gate.kuberik.com/pretty-name': 'Business hours' }, ownerReferences: [{ apiVersion: 'kuberik.com/v1alpha1', kind: 'RolloutSchedule', name: 'business-hours', uid: 'sched-uid' }] },
		spec: { rolloutRef: { name: NAME }, passing: true }
	}];
}

const schedules = () => [{
	metadata: { name: 'business-hours', namespace: NS, annotations: { 'gate.kuberik.com/pretty-name': 'Business hours' } },
	spec: { action: 'Allow', timezone: 'Europe/Zagreb', rolloutSelector: { matchLabels: { environment: 'prod' } }, rules: [{ name: 'weekdays', timeRange: { start: '09:00', end: '18:00' }, daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }] },
	status: { active: true, nextTransition: new Date(CLOCK_MS + 5 * 3600_000).toISOString(), managedGates: ['deploy-window'] }
}];

/** what each query key of the three routes would have been answered with */
export function detailAnswers(v: Variant) {
	const w = detailWorld(v);
	const managed: Any[] = [
		{ groupVersionKind: 'rollouts.kruise.io/v1beta1/Rollout', name: KR, namespace: NS, status: 'InProgress', message: '', lastModified: iso(MIN), object: w.kr },
		{ groupVersionKind: 'rollout.kuberik.com/v1alpha1/RolloutTest', name: 'integration-test', namespace: NS, status: w.test.status.phase, message: '', lastModified: iso(MIN), object: w.test },
		{ groupVersionKind: 'apps/v1/Deployment', name: NAME, namespace: NS, status: 'Current', message: '', lastModified: iso(MIN), object: { apiVersion: 'apps/v1', kind: 'Deployment', metadata: { name: NAME, namespace: NS }, spec: { replicas: 4 }, status: { readyReplicas: 4, replicas: 4 } } }
	];
	const detail = {
		rollout: w.r, kustomizations: { items: [w.kust] }, ociRepositories: { items: [] }, rolloutGates: { items: w.gates }, environment: w.env,
		kruiseRollout: w.kr, rolloutTests: { items: [w.test] }
	};
	const nsList = { rollouts: { items: (w.fleet.rollouts as Any[]).filter((r) => r.metadata.namespace === NS) }, environments: { items: [w.env] }, kustomizations: { items: [w.kust] } };
	setQueryAnswers((key) => {
		switch (key[0]) {
			case 'rollout': return key[1] === NS && key[2] === NAME ? detail : undefined;
			case 'rollout-permissions': return { permissions: { update: true, patch: true }, resource: { apiGroup: 'kuberik.com', kind: 'Rollout', name: NAME, namespace: NS } };
			case 'managed-resources': return { [KUST]: managed };
			case 'health-checks': return { healthChecks: w.hc };
			case 'events': return { events: [] };
			case 'github-status': return { configured: true, connected: true, login: 'olivia-bennett' };
			case 'cluster-info': return { url: 'https://hub.example', name: CLUSTER };
			case 'rollout-schedule-window': return schedules();
			case 'rollouts': return key[1] === 'namespace' ? nsList : undefined;
			default: return undefined;
		}
	});
	return w;
}
void gate;
