import { describe, expect, it } from 'vitest';
import { CHAPTERS, EV, LOOP, PROD_SITES, REST_T, chipAt, gates, siteState, traffic, canaryTests, healthChecks, bake, phaseAt } from './script';

const ts = Array.from({ length: LOOP * 20 }, (_, i) => i / 20);
describe('scene script', () => {
	it('chapters start in order and settle inside themselves', () => {
		CHAPTERS.forEach((c, i) => { expect(c.settled).toBeGreaterThanOrEqual(c.from); if (i) expect(c.from).toBeGreaterThan(CHAPTERS[i - 1].from); });
	});
	it('causal order: staging green before the promotion gate passes, the click before prod moves, tests before 50%', () => {
		expect(EV.stgDone).toBeLessThan(EV.promo);
		expect(EV.press).toBeLessThan(EV.approved);
		expect(EV.approved).toBeLessThan(EV.hop2);
		expect(Math.max(...EV.tests)).toBeLessThan(EV.pct50);
		expect(EV.w1Done).toBeLessThan(EV.w2.deploy);
		for (const t of ts) if (chipAt(t) === 'prod') expect(gates(t).every((g) => g.state === 'passing')).toBe(true);
	});
	it('a place never goes backwards', () => {
		const rank = { notreached: 0, approval: 0, deploying: 1, checking: 2, done: 3 } as Record<string, number>;
		for (const [tier, s] of [['dev', ''], ['staging', ''], ...PROD_SITES.map((x) => ['prod', x.name])] as const) {
			let prev = -1;
			for (const t of ts) { const r = rank[siteState(t, tier as any, s)]; expect(r).toBeGreaterThanOrEqual(prev); prev = r; }
		}
	});
	it('traffic only climbs, health checks and tests never un-pass, the bake only fills', () => {
		let p = 0, b = 0;
		for (const t of ts) { expect(traffic(t)).toBeGreaterThanOrEqual(p); p = traffic(t); expect(bake(t).pct).toBeGreaterThanOrEqual(b); b = bake(t).pct; }
		for (const t of ts) if (t > EV.hc[2]) expect(healthChecks(t).every((c) => c.state === 'passing')).toBe(true);
		for (const t of ts) if (t > EV.pct50) expect(canaryTests(t).every((c) => c.state === 'passing')).toBe(true);
	});
	it('rests on everything green', () => {
		expect(phaseAt(REST_T)).toBe('sites');
		expect(PROD_SITES.every((s) => siteState(REST_T, 'prod', s.name) === 'done')).toBe(true);
	});
});
