import { describe, expect, it } from 'vitest';
import { EV, EVENT_TIMES, eventIndexAt, phaseOf, PLACES, worldAt } from './scenario';
const us1 = PLACES[1];
const rolloutOf = (t: number, ns = us1.ns) => (worldAt(t).fleet.rollouts as any[]).find((r) => r.metadata.namespace === ns);
/* the catalogue the place reads (release-controller ReleaseSlices, dashboard #69): the Rollout carries no release list of its own */
const tags = (t: number, ns: string) => ((worldAt(t).fleet as any).releaseSlices.items as any[]).filter((s) => s.metadata.namespace === ns).flatMap((s) => s.releases.map((r: any) => r.tag));
describe('film scenario (lane 33: release, staging, approve, canary, waves)', () => {
	it('opens on the release: 4.46.0-46 is catalogued from the first frame, every place still runs 4.45.0-45', () => {
		expect(tags(EV.release, PLACES[0].ns)).toEqual(['b-44', 'b-45', 'b-46']);
		expect(rolloutOf(0).status.candidates.map((c: any) => c.tag)).toEqual(['b-46']);
		expect(rolloutOf(0).status.availableReleases).toBeUndefined();
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
		expect(g(0, 'release-approval').kind).toBe('approval');
		expect(rolloutOf(EV.promo).status.candidates[0].blockedBy).toEqual(['release-approval']);
		expect(rolloutOf(EV.approved).status.history[0].approval).toEqual({ name: 'checkout-api-b-46', by: 'oidc:noah-carter' });
		expect(worldAt(EV.approved).detail.approvals.approvals[0].version).toBe('b-46');
	});
	it('tests: Pending -> Running -> Succeeded while the canary pauses on stage 1', () => {
		const ph = (t: number) => worldAt(t).detail.test.status.phase;
		expect([ph(EV.testPending - 0.1), ph(EV.testPending + 0.1), ph(EV.testRunning + 0.1), ph(EV.testPassed + 0.1)]).toEqual(['WaitingForStep', 'Pending', 'Running', 'Succeeded']);
	});
	it('waves 2 and 3 wait on the wave before, then take the build by themselves; nothing fails', () => {
		for (const p of PLACES.slice(2)) {
			expect(rolloutOf(EV.us1Done - 0.1, p.ns).status.history[0].version.tag).toBe('b-45');
			expect(rolloutOf((p.wave === 2 ? EV.w2Deploy : EV.w3Deploy) + 0.1, p.ns).status.history[0].version.tag).toBe('b-46');
			if (p.wave === 3) expect(rolloutOf(EV.w2Deploy + 0.1, p.ns).status.history[0].version.tag).toBe('b-45');
			expect(rolloutOf(40, p.ns).status.history[0].bakeStatus).toBe('Succeeded');
		}
		const leader = (worldAt(EV.us1Done - 0.1).fleet.environments as any[]).find((e) => e.metadata.namespace === 'checkout-api-prod-eu-west-1');
		expect(leader.status.wave.blocker?.site).toBe('us-east-1');
		for (let t = 0; t < 40; t += 0.5) for (const p of PLACES) expect(rolloutOf(t, p.ns).status.history[0].bakeStatus).not.toBe('Failed');
	});
	it('event indices only move at event times', () => {
		expect(eventIndexAt(EV.w2Deploy - 0.01) + 1).toBe(eventIndexAt(EV.w2Deploy));
		expect(EVENT_TIMES[0]).toBe(0);
	});
});
