import { describe, expect, it } from 'vitest';
import { EV, EVENT_TIMES, eventIndexAt, phaseOf, PLACES, worldAt } from './scenario';
const us1 = PLACES[1];
const rolloutOf = (t: number, ns = us1.ns) => (worldAt(t).fleet.rollouts as any[]).find((r) => r.metadata.namespace === ns);
const tags = (t: number, ns: string) => rolloutOf(t, ns).status.availableReleases.map((r: any) => r.tag);
describe('film scenario (lane 33: release, staging, approve, canary, waves)', () => {
	it('opens before the release: 4.46.0-46 does not exist yet, every place runs 4.45.0-45', () => {
		expect(tags(0, PLACES[0].ns)).not.toContain('b-46');
		expect(tags(EV.release, PLACES[0].ns)).toContain('b-46');
		for (const p of PLACES) expect(phaseOf(p, 0.5)).toBe('old');
	});
	it('staging takes the release at once and finishes before the approval', () => {
		expect(phaseOf(PLACES[0], EV.stagingGo)).toBe('deploying');
		expect(rolloutOf(EV.stagingDone, PLACES[0].ns).status.history[0].bakeStatus).toBe('Succeeded');
		expect(EV.stagingDone).toBeLessThan(EV.approved);
	});
	it('the release-approval gate flips at the press; the deploy window is open throughout', () => {
		const g = (t: number, n: string) => rolloutOf(t).status.gates.find((x: any) => x.name === n);
		expect(g(EV.approved - 0.05, 'release-approval').allowedVersions).not.toContain('b-46');
		expect(g(EV.approved, 'release-approval').allowedVersions).toContain('b-46');
		expect(g(0, 'deploy-window').passing).toBe(true);
	});
	it('tests: Pending -> Running -> Succeeded while the canary pauses on stage 1', () => {
		const ph = (t: number) => worldAt(t).detail.test.status.phase;
		expect([ph(EV.testPending - 0.1), ph(EV.testPending + 0.1), ph(EV.testRunning + 0.1), ph(EV.testPassed + 0.1)]).toEqual(['WaitingForStep', 'Pending', 'Running', 'Succeeded']);
	});
	it('wave 2 waits on wave 1, then takes the build by itself; nothing fails', () => {
		for (const p of PLACES.slice(2)) {
			expect(rolloutOf(EV.us1Done - 0.1, p.ns).status.history[0].version.tag).toBe('b-45');
			expect(rolloutOf(EV.w2Deploy + 0.1, p.ns).status.history[0].version.tag).toBe('b-46');
			expect(rolloutOf(40, p.ns).status.history[0].bakeStatus).toBe('Succeeded');
		}
		const leader = (worldAt(EV.us1Done - 0.1).fleet.environments as any[]).find((e) => e.metadata.namespace === 'checkout-api-prod-ap-southeast-2');
		expect(leader.status.wave.blocker?.site).toBe('us-east-1');
		for (let t = 0; t < 40; t += 0.5) for (const p of PLACES) expect(rolloutOf(t, p.ns).status.history[0].bakeStatus).not.toBe('Failed');
	});
	it('event indices only move at event times', () => {
		expect(eventIndexAt(EV.w2Deploy - 0.01) + 1).toBe(eventIndexAt(EV.w2Deploy));
		expect(EVENT_TIMES[0]).toBe(0);
	});
});
