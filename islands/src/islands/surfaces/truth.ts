/**
 * TRUTH SPIKE (landing-v5, R4): the hero world at story second ~26.5 (us-east-1 checking, wave 2 untouched, staging done) with
 * us-east-1's bake FAILED, as the controllers would write it. Wave 2's gates stay as environment-controller wave.go Decide gives them
 * (the wave-2 leader admits only the build wave 1 baked, b-45: "completedRevs(prev.reg)"; followers follow the leader, who has not started),
 * so nothing here is invented beyond the failed bake itself: hist[0].bakeStatus Failed + failedHealthChecks, the HealthCheck Unhealthy
 * with its observation, and every Environment CR's wave.members entry for us-east-1 reading bakeStatus Failed.
 */
type Any = any;
const OBS = [{ name: 'error rate', kind: 'Threshold', value: '3.2', limit: '1', unit: '%', direction: 'Above', healthy: false }];
export function failWave1(fleet: Any) {
	const US1 = 'checkout-api-prod-us-east-1';
	for (const r of fleet.rollouts as Any[]) {
		if (r.metadata.namespace !== US1) continue;
		const h = r.status.history[0];
		const end = new Date(Date.parse(h.bakeStartTime) + 50_000).toISOString();
		r.status.history[0] = { ...h, bakeStatus: 'Failed', bakeEndTime: end, message: 'Health check error-rate failed',
			failedHealthChecks: [{ name: 'error-rate', message: '3.2% of requests failed, over a 1% budget', observations: OBS }] };
	}
	for (const hc of fleet.healthChecks as Any[]) {
		if (hc.metadata.namespace !== US1) continue;
		hc.healthChecks = hc.healthChecks.map((h: Any) => h.metadata.annotations['kuberik.com/display-name'] === 'error-rate'
			? { ...h, status: { ...h.status, status: 'Unhealthy', message: '3.2% of requests failed, over a 1% budget', observations: OBS } } : h);
	}
	for (const k of fleet.kruiseRollouts as Any[]) {
		if (k.metadata.namespace !== US1) continue;
		k.status.conditions = [{ type: 'KuberikBakeHealthy', status: 'False', reason: 'BakeFailed', message: 'error-rate failed' }];
	}
	for (const e of fleet.environments as Any[]) {
		for (const m of e.status?.wave?.members ?? []) if (m.site === 'us-east-1' && m.environment === 'prod') m.bakeStatus = 'Failed';
	}
}

/** `solo=1`: drop the world's non-rest apps (billing-api approval, search-api deploying, inventory-svc failed, notifications staging) so ONLY checkout-api moves; the six at-rest apps stay as ground. */
export function soloCheckout(fleet: Any) {
	const out = new Set(['billing-api', 'search-api', 'inventory-svc', 'notifications']);
	const keep = (x: Any) => !out.has(x.metadata?.name);
	for (const k of ['rollouts', 'environments', 'healthChecks'] as const) fleet[k] = (fleet[k] as Any[]).filter(keep);
	fleet.changes = (fleet.changes as Any[]).filter((c) => !out.has(c.repo));
}
