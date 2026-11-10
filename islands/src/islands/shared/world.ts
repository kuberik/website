/**
 * THE WORLD. The dashboard's data layer reads ONE installed source (`installLiveSource`), and so does its clock. Several islands live on
 * one page, each with its own story time, so none of them may install its own snapshot (the last writer would blank the others).
 * Each island hands its part to `setPart`; the world installs the union (different apps, different namespaces) and answers
 * the dashboard's GitHub routes from the union table.
 *
 * CLOCK: the dashboard's source and its `now` are module singletons (installLiveSource, one $state.raw), so per-island isolation is not possible.
 * Instead `now` NEVER moves (cr.ts CLOCK_MS), and each story expresses its own time by placing its timestamps relative to that fixed instant
 * (scenario `rebase(t)`). An age is `now - timestamp`, so it is right for whichever island installed last, even with both on screen ticking at once:
 * no island can corrupt the other's ages, and nothing has to freeze.
 */
import { installLiveSource, type FleetSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { githubTable } from '../../github-table.svelte';
import { driveNow } from '../../stubs/time-store';

type Part = { fleet: FleetSource; github: Record<string, unknown> };
const parts = new Map<string, Part>();

export function setPart(id: string, fleet: FleetSource, github: Record<string, unknown>) {
	parts.set(id, { fleet, github });
	const all = [...parts.values()];
	const cat = <K extends keyof FleetSource>(k: K): FleetSource[K] => all.flatMap((p) => (p.fleet[k] as unknown[]) ?? []) as FleetSource[K];
	const base = fleet;
	installLiveSource({
		...base,
		rollouts: cat('rollouts'), environments: cat('environments'), kustomizations: cat('kustomizations'), kruiseRollouts: cat('kruiseRollouts'),
		healthChecks: cat('healthChecks'), changes: dedupe(cat('changes') as { owner: string; repo: string; number: number }[]) as never,
		rolloutDependencies: { items: all.flatMap((p) => p.fleet.rolloutDependencies?.items ?? []) },
		now: fleet.now
	});
	githubTable.set(Object.assign({}, ...all.map((p) => p.github)));
	driveNow(fleet.now);
}
const dedupe = <T extends { owner: string; repo: string; number: number }>(xs: T[]): T[] => { const seen = new Set<string>(); return xs.filter((c) => { const k = `${c.owner}/${c.repo}#${c.number}`; if (seen.has(k)) return false; seen.add(k); return true; }); };
