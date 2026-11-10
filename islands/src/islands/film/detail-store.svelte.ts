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
/** the kustomization's managed resources (both Current: the Resources card must not say "2 not ready"), as the API serves them */
const managedList = (d: Detail) => [
				{ groupVersionKind: 'rollouts.kruise.io/v1beta1/Rollout', name: d.kr.metadata.name, namespace: d.ns, status: 'Current', message: '', lastModified: d.kr.status.canaryStatus.lastUpdateTime, object: d.kr },
				{ groupVersionKind: 'rollout.kuberik.com/v1alpha1/RolloutTest', name: 'integration-test', namespace: d.ns, status: 'Current', message: '', lastModified: d.kr.status.canaryStatus.lastUpdateTime, object: d.test },
				{ groupVersionKind: 'apps/v1/Deployment', name: APP, namespace: d.ns, status: 'Current', message: '', lastModified: d.kr.status.canaryStatus.lastUpdateTime, object: { apiVersion: 'apps/v1', kind: 'Deployment', metadata: { name: APP, namespace: d.ns }, spec: { replicas: 4 }, status: { readyReplicas: 4, replicas: 4 } } }];
export const setDetail = (d: Detail) => { current = d; };

/** the commit range GitHub would answer (through the dashboard API), from the scenario's own GitHub map: a rollback range is the forward range swapped */
function commitsAnswer(gh: Record<string, unknown>, ns: string, name: string, b: string, h: string) {
	const key = (x: string, y: string) => `/api/rollouts/${ns}/${name}/commits?base=${x}&head=${y}`;
	const fwd = gh[key(b, h)] as any, hit = fwd ?? (gh[key(h, b)] as any);
	if (!hit) return undefined;
	return { direction: fwd ? 'forward' : 'rollback', ahead: fwd ? hit.commits.length : 0, behind: fwd ? 0 : hit.commits.length, commits: hit.commits.map((c: any) => ({ url: '', authorUrl: '', avatarUrl: '', ...c })), additions: hit.additions ?? 0, deletions: hit.deletions ?? 0, changedFiles: hit.changedFiles ?? 0 };
}
export function installAnswers(fleetRollouts: () => unknown[], github: () => Record<string, unknown> | null = () => null) {
	setQueryAnswers((key) => {
		const d = current;
		if (!d) return undefined;
		const KUST = d.kustomization.metadata.name;
		switch (key[0]) {
			case 'rollout': return key[1] === d.ns && key[2] === APP ? { rollout: d.rollout, kustomizations: { items: [d.kustomization] }, ociRepositories: { items: [] }, rolloutGates: { items: d.gates }, environment: d.environment, kruiseRollout: d.kr, rolloutTests: { items: [d.test] } } : undefined;
			case 'rollout-permissions': return { permissions: { update: true, patch: true }, resource: { apiGroup: 'kuberik.com', kind: 'Rollout', name: APP, namespace: d.ns } };
			/* both resources Current: the Resources card must not say "2 not ready" (probe nit) */
			case 'managed-resources': return { [KUST]: managedList(d) };
			case 'health-checks': return { healthChecks: d.healthChecks };
			case 'events': return { events: [] };
			case 'rollout-commits': { const gh = github(); return gh ? commitsAnswer(gh, String(key[1]), String(key[2]), String(key[3]), String(key[4])) : undefined; }
			case 'github-status': return { configured: true, connected: true, login: VIEWER };
			case 'cluster-info': return { url: 'https://hub.example', name: CLUSTER };
			case 'rollout-schedule-window': return d.schedules;
			case 'rollouts': return key[1] === 'namespace' ? { rollouts: { items: fleetRollouts().filter((r: any) => r.metadata.namespace === d.ns) }, environments: { items: [d.environment] }, kustomizations: { items: [d.kustomization] } } : undefined;
			default: return undefined;
		}
	});
}

/**
 * NETWORK SEAM (named stub): the real ChangeVersionModal fetches the fleet list straight through `fetch` (`/api/rollouts`, `/api/clusters/<c>/rollouts?namespace=`),
 * not through a query, so the query stub cannot answer it. This wraps `window.fetch` for exactly those two routes and answers from the film's snapshot (the
 * payload the API would serve); every other request passes through untouched. Installed once, when the film starts.
 */
export function installFetch(list: () => { rollouts: unknown[]; environments: unknown[]; kustomizations: unknown[]; kruiseRollouts: unknown[]; rolloutDependencies: unknown } | null) {
	const real = window.fetch.bind(window);
	if ((window.fetch as any).__film) return;
	const wrapped = (input: RequestInfo | URL, init?: RequestInit) => {
		let u: URL;
		try { u = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url, location.href); } catch { return real(input, init); }
		if (u.origin !== location.origin) return real(input, init); // only the product's own same-origin API is answered; third-party requests pass untouched
		const mr = /^\/api\/(?:clusters\/[^/]+\/)?kustomizations\/[^/]+\/[^/]+\/managed-resources$/.exec(u.pathname);
		if (mr && current) return Promise.resolve(new Response(JSON.stringify({ managedResources: managedList(current) }), { status: 200, headers: { 'content-type': 'application/json' } }));
		/* the dialog's confirm POSTs the change of version: accepted (the story's own CRs carry the outcome; nothing is written here) */
		if (init?.method === 'POST' && /^\/api\/(?:clusters\/[^/]+\/)?rollouts\/[^/]+\/[^/]+\/change-version$/.test(u.pathname)) return Promise.resolve(new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } }));
		const m = /^\/api\/(?:clusters\/[^/]+\/)?rollouts$/.exec(u.pathname);
		const s = m ? list() : null;
		if (!m || !s) return real(input, init);
		const ns = u.searchParams.get('namespace');
		const rollouts = ns ? s.rollouts.filter((r: any) => r.metadata.namespace === ns) : s.rollouts;
		return Promise.resolve(new Response(JSON.stringify({ rollouts: { items: rollouts }, environments: { items: s.environments }, rolloutDependencies: s.rolloutDependencies, kustomizations: { items: s.kustomizations }, kruiseRollouts: { items: s.kruiseRollouts } }), { status: 200, headers: { 'content-type': 'application/json' } }));
	};
	(wrapped as any).__film = true;
	window.fetch = wrapped as typeof fetch;
}
