/**
 * Answers the rollout page's queries from the film's current snapshot (raw CRs, as the dashboard's API serves them). The svelte-query stub reads
 * `answers()` inside the page's own derivations, so replacing `current` re-derives the page in place: nothing is fetched, nothing is drawn here.
 * NAMED STUB (see stubs/svelte-query.svelte.ts): rollout (RolloutResponse), rollout-permissions, managed-resources, health-checks, events,
 * github-status, cluster-info, rollout-schedule-window, rollouts/namespace.
 */
import { setQueryAnswers } from '../../stubs/svelte-query.svelte';
import { APP, VIEWER, type Detail } from './scenario';

export const CLUSTER = 'prod';
let current = $state.raw<Detail | null>(null);
export const setDetail = (d: Detail) => { current = d; };

export function installAnswers(fleetRollouts: () => unknown[]) {
	setQueryAnswers((key) => {
		const d = current;
		if (!d) return undefined;
		const KUST = d.kustomization.metadata.name;
		switch (key[0]) {
			case 'rollout': return key[1] === d.ns && key[2] === APP ? { rollout: d.rollout, kustomizations: { items: [d.kustomization] }, ociRepositories: { items: [] }, rolloutGates: { items: d.gates }, environment: d.environment, kruiseRollout: d.kr, rolloutTests: { items: [d.test] } } : undefined;
			case 'rollout-permissions': return { permissions: { update: true, patch: true }, resource: { apiGroup: 'kuberik.com', kind: 'Rollout', name: APP, namespace: d.ns } };
			/* both resources Current: the Resources card must not say "2 not ready" (probe nit) */
			case 'managed-resources': return { [KUST]: [
				{ groupVersionKind: 'rollouts.kruise.io/v1beta1/Rollout', name: d.kr.metadata.name, namespace: d.ns, status: 'Current', message: '', lastModified: d.kr.status.canaryStatus.lastUpdateTime, object: d.kr },
				{ groupVersionKind: 'rollout.kuberik.com/v1alpha1/RolloutTest', name: 'integration-test', namespace: d.ns, status: 'Current', message: '', lastModified: d.kr.status.canaryStatus.lastUpdateTime, object: d.test },
				{ groupVersionKind: 'apps/v1/Deployment', name: APP, namespace: d.ns, status: 'Current', message: '', lastModified: d.kr.status.canaryStatus.lastUpdateTime, object: { apiVersion: 'apps/v1', kind: 'Deployment', metadata: { name: APP, namespace: d.ns }, spec: { replicas: 4 }, status: { readyReplicas: 4, replicas: 4 } } }] };
			case 'health-checks': return { healthChecks: d.healthChecks };
			case 'events': return { events: [] };
			case 'github-status': return { configured: true, connected: true, login: VIEWER };
			case 'cluster-info': return { url: 'https://hub.example', name: CLUSTER };
			case 'rollout-schedule-window': return d.schedules;
			case 'rollouts': return key[1] === 'namespace' ? { rollouts: { items: fleetRollouts().filter((r: any) => r.metadata.namespace === d.ns) }, environments: { items: [d.environment] }, kustomizations: { items: [d.kustomization] } } : undefined;
			default: return undefined;
		}
	});
}
