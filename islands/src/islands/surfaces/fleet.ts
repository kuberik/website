/**
 * The other apps of the film's fleet (film/scenario.ts picks the ones that sit at rest, plus billing-api, which waits). Raw CRs only; every word on screen is the product's.
 * `failing` flips one prod region (eu-central-1) to a failed bake with an Unhealthy check carrying observation figures.
 */
import type { FleetSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { release, gate, prChange, CLOCK_MS } from '../shared/cr';

const H = 3600_000;
type State = 'rest' | 'approval' | 'deploying' | 'failed' | 'stagingDeploying';
const APPS: { name: string; owner: string; state: State; n: number; title: string; author: string }[] = [
	{ name: 'billing-api', owner: 'exampleco', state: 'approval', n: 8, title: 'Retry failed invoice webhooks', author: 'mason-hayes' },
	{ name: 'search-api', owner: 'exampleco', state: 'deploying', n: 31, title: 'Rank by recent clicks', author: 'emma-walker' },
	{ name: 'inventory-svc', owner: 'exampleco', state: 'failed', n: 22, title: 'Batch stock reservations', author: 'olivia-bennett' },
	{ name: 'notifications', owner: 'exampleco', state: 'stagingDeploying', n: 15, title: 'Add SMS quiet hours', author: 'sophia-reed' },
	{ name: 'cart-svc', owner: 'exampleco', state: 'rest', n: 54, title: 'Cache cart totals', author: 'liam-foster' },
	{ name: 'catalog-api', owner: 'exampleco', state: 'rest', n: 40, title: 'Paginate category listings', author: 'olivia-bennett' },
	{ name: 'auth-gateway', owner: 'exampleco', state: 'rest', n: 63, title: 'Rotate signing keys weekly', author: 'noah-carter' },
	{ name: 'payments-svc', owner: 'exampleco', state: 'rest', n: 19, title: 'Serve contract payments 3.1.0', author: 'ava-mitchell' },
	{ name: 'email-worker', owner: 'exampleco', state: 'rest', n: 27, title: 'Template preview endpoint', author: 'ethan-brooks' },
	{ name: 'web-storefront', owner: 'exampleco', state: 'rest', n: 88, title: 'Faster product images', author: 'isabella-ross' }
];
const sha = (i: number, k: number) => `${(i + 10).toString(16)}${k}c4e91a07b3d5f2860c1e3a5b7d9f10234${k}${i.toString(16)}`.padEnd(40, '0').slice(0, 40);
const iso = (ms: number) => new Date(ms).toISOString();

export function extras(opt: { failing: boolean; only?: (a: (typeof APPS)[number]) => boolean; settled?: string[] }) {
	const rollouts: unknown[] = [], environments: unknown[] = [], changes: unknown[] = [], hcs: unknown[] = [], gh: Record<string, unknown> = {};
	APPS.forEach((a0, i) => {
		if (opt.only && !opt.only(a0)) return;
		/* `settled`: an app the story has let through (its approval was granted off-screen): it sits at rest on the new build */
		const a = opt.settled?.includes(a0.name) ? { ...a0, state: 'rest' as State } : a0;
		const oldR = release(`b-${a.n - 1}`, `${a.n - 1}.0.0`, sha(i, 1), CLOCK_MS - 20 * H);
		const newR = release(`b-${a.n}`, `${a.n}.0.0`, sha(i, 2), CLOCK_MS - (3 + i) * H);
		const place = (env: 'staging' | 'prod') => {
			const ns = `${a.name}-${env}`;
			const onNew =
				a.state === 'rest' ? true
				: a.state === 'stagingDeploying' ? false
				: env === 'staging' ? true
				: a.state === 'approval' ? false : true;
			const bake = env === 'prod' && a.state === 'failed' ? 'Failed' : env === 'prod' && a.state === 'deploying' ? 'InProgress' : env === 'staging' && a.state === 'stagingDeploying' ? 'Deploying' : 'Succeeded';
			const inFlightNew = env === 'staging' && a.state === 'stagingDeploying';
			const cur = onNew || inFlightNew ? newR : oldR;
			const t0 = CLOCK_MS - (2 + i) * H + (env === 'prod' ? 40 * 60_000 : 0);
			const hist: Record<string, unknown>[] = [];
			if (onNew || inFlightNew) hist.push({
				id: 2, version: newR, timestamp: iso(bake === 'Deploying' ? CLOCK_MS - 3 * 60_000 : bake === 'InProgress' ? CLOCK_MS - 40_000 : t0), bakeStatus: bake,
				bakeStartTime: iso(t0), ...(bake === 'Succeeded' || bake === 'Failed' ? { bakeEndTime: iso(t0 + 600_000) } : {}),
				triggeredBy: { kind: 'System', name: 'System' },
				...(bake === 'Failed' ? { message: 'Health check error-rate failed', failedHealthChecks: [{ name: 'error-rate', message: '4.2% of requests failed, over a 1% budget', observations: [{ name: 'error rate', kind: 'Threshold', value: '4.2', limit: '1', unit: '%', direction: 'Above', healthy: false }] }] } : {})
			});
			hist.push({ id: 1, version: oldR, timestamp: iso(CLOCK_MS - 19 * H), bakeStatus: 'Succeeded', bakeStartTime: iso(CLOCK_MS - 19 * H), bakeEndTime: iso(CLOCK_MS - 19 * H + 600_000), triggeredBy: { kind: 'System', name: 'System' } });
			const awaiting = env === 'prod' && a.state === 'approval';
			rollouts.push({
				apiVersion: 'kuberik.com/v1alpha1', kind: 'Rollout',
				metadata: { name: a.name, namespace: ns, labels: { environment: env }, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': env } },
				spec: { releaseSourceRef: { name: a.name }, versionHistoryLimit: 20, minBakeTime: '2m', bakeTime: '1m', healthCheckSelector: { matchLabels: { app: a.name, env } } },
				status: {
					source: `github.com/${a.owner}/${a.name}`, wantedVersion: cur.tag, currentVersion: cur.tag, previousVersion: oldR.tag, availableReleases: [oldR, newR],
					releaseCandidates: awaiting || (env === 'staging' && !onNew && !inFlightNew) ? [newR] : [], history: hist,
					gates: env === 'prod' ? [gate('promotion-prod', [newR.tag, oldR.tag]), gate('release-approval', awaiting ? [oldR.tag] : [newR.tag, oldR.tag])] : []
				}
			});
			environments.push({ apiVersion: 'environments.kuberik.com/v1alpha1', kind: 'Environment', metadata: { name: a.name, namespace: ns, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': env } }, spec: { environment: env, name: `${a.name}-service`, rolloutRef: { name: a.name } }, status: { currentVersion: cur.tag, lastStatusChangeTime: iso(t0), conditions: [] } });
			const bad = env === 'prod' && a.state === 'failed';
			hcs.push({ metadata: { namespace: ns, name: a.name, annotations: { 'rollout-dashboard.kuberik.com/source-cluster': env } }, healthChecks: [{ apiVersion: 'kuberik.com/v1alpha1', kind: 'HealthCheck', metadata: { name: `${a.name}-error-rate`, namespace: ns, labels: { app: a.name }, annotations: { 'kuberik.com/display-name': 'error-rate' } }, spec: { class: 'prometheus-alert' }, status: { status: bad ? 'Unhealthy' : 'Healthy', message: bad ? '4.2% of requests failed, over a 1% budget' : 'No alerts firing', lastChangeTime: iso(t0), observations: bad ? [{ name: 'error rate', kind: 'Threshold', value: '4.2', limit: '1', unit: '%', direction: 'Above', healthy: false }] : [] } }] });
		};
		place('staging'); place('prod');
		changes.push(prChange(a.owner, a.name, a.n * 2, a.title, a.author, CLOCK_MS - (3 + i) * H, sha(i, 2), 3 + (i % 5)));
		gh[`/api/github/repos/${a.owner}/${a.name}/commits/${sha(i, 2)}`] = { subject: `#${a.n * 2} ${a.title}`, author: a.author };
	});
	void opt;
	return { rollouts, environments, changes, hcs, gh };
}
