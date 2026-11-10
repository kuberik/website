import { describe, expect, it } from 'vitest';
import { EV, EVENT_TIMES, eventIndexAt, phaseOf, PLACES, worldAt } from './scenario';
const us1 = PLACES[1];
const rolloutOf = (t: number, ns = us1.ns) => (worldAt(t).fleet.rollouts as any[]).find((r) => r.metadata.namespace === ns);
describe('film scenario', () => {
	it('opens with staging already deploying (TRUTH R3) and nothing in prod yet', () => {
		expect(phaseOf(PLACES[0], 0)).toBe('deploying');
		expect(rolloutOf(0, PLACES[0].ns).status.history[0].bakeStatus).toBe('Deploying');
		expect(rolloutOf(0).status.history).toHaveLength(1);
	});
	it('the release-approval gate flips at the press and the deploy window at 10:00', () => {
		const g = (t: number, n: string) => rolloutOf(t).status.gates.find((x: any) => x.name === n);
		expect(g(10.2, 'release-approval').allowedVersions).not.toContain('b-46');
		expect(g(10.4, 'release-approval').allowedVersions).toContain('b-46');
		expect(g(16.5, 'deploy-window').passing).toBe(false);
		expect(g(16.7, 'deploy-window').passing).toBe(true);
	});
	it('tests: Pending -> Running -> Succeeded while the canary pauses on stage 1', () => {
		const ph = (t: number) => worldAt(t).detail.test.status.phase;
		expect([ph(19.3), ph(19.5), ph(20.0), ph(21)]).toEqual(['WaitingForStep', 'Pending', 'Running', 'Succeeded']);
	});
	it('the catch: us-east-1 fails at 27 s, wave 2 stays on b-45', () => {
		const h = rolloutOf(27.5).status.history[0];
		expect(h.bakeStatus).toBe('Failed');
		expect(h.failedHealthChecks[0].message).toContain('3.2%');
		for (const p of PLACES.slice(2)) expect(rolloutOf(40, p.ns).status.currentVersion).toBe('b-45');
	});
	it('the rollback: a person adds b-45 to the history; recovery mode is on', () => {
		const r = rolloutOf(45);
		expect(r.status.history[0].triggeredBy.name).toBe('olivia-bennett');
		expect(r.status.currentVersion).toBe('b-45');
		expect(r.status.conditions[0].type).toBe('BakeFailureDisabled');
	});
	it('event indices only move at event times', () => {
		expect(eventIndexAt(EV.caught - 0.01) + 1).toBe(eventIndexAt(EV.caught));
		expect(EVENT_TIMES[0]).toBe(0);
	});
});
