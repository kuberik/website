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
import { ingestListResponse } from '$lib/releases/feed';

type Part = { fleet: FleetSource; github: Record<string, unknown> };
const parts = new Map<string, Part>();
/** the part whose scalar fields (now, me, github status, changesState) the source carries: the last one set with `base` (the film). A section
 *  island adds only its release catalogue (`base: false`, sections/section.ts): it never moves the film's clock or viewer. */
let baseFleet: FleetSource | null = null;

export function setPart(id: string, fleet: FleetSource, github: Record<string, unknown>, opt: { base?: boolean } = {}) {
	parts.set(id, { fleet, github });
	if (opt.base !== false || !baseFleet) baseFleet = fleet;
	const all = [...parts.values()];
	const cat = <K extends keyof FleetSource>(k: K): FleetSource[K] => all.flatMap((p) => (p.fleet[k] as unknown[]) ?? []) as FleetSource[K];
	const base = baseFleet;
	installLiveSource({
		...base,
		rollouts: cat('rollouts'), environments: cat('environments'), kustomizations: cat('kustomizations'), kruiseRollouts: cat('kruiseRollouts'),
		healthChecks: cat('healthChecks'), changes: dedupe(cat('changes') as { owner: string; repo: string; number: number }[]) as never,
		rolloutDependencies: { items: all.flatMap((p) => p.fleet.rolloutDependencies?.items ?? []) },
		now: base.now,
		...({ releaseSources: { items: catOf(all, 'releaseSources') }, releaseSlices: { items: catOf(all, 'releaseSlices') } } as object)
	});
	/* THE RELEASE CATALOGUE (dashboard #69): a Rollout's releases are read from release-controller's ReleaseSlices, which the app's root layout feeds
	   into the registry from every rollouts-list response (releases/feed.ts installReleaseCatalogueFeed). The islands have no query cache, so the
	   union list is handed to the same ingest, as one complete fleet-wide list. */
	ingestListResponse({ releaseSources: { items: catOf(all, 'releaseSources') }, releaseSlices: { items: catOf(all, 'releaseSlices') } }, { fleetWide: true });
	githubTable.set(Object.assign({}, ...all.map((p) => p.github)));
	if (opt.base !== false) driveNow(fleet.now);
}
/** a part leaves the world (a section island froze its frame and no longer reads the source): the union is re-installed without it */
export function dropPart(id: string) {
	if (!parts.delete(id) || !baseFleet) return;
	const rest = [...parts.entries()];
	if (!rest.length) return;
	const [lastId, last] = rest[rest.length - 1];
	parts.delete(lastId);
	setPart(lastId, last.fleet, last.github, { base: last.fleet === baseFleet });
}
/* several section islands may hand the same catalogue (two cards of one world render at once): the union names each object once */
const catKey = (o: any) => `${o?.metadata?.annotations?.['rollout-dashboard.kuberik.com/source-cluster']}/${o?.metadata?.namespace}/${o?.metadata?.name}/${o?.metadata?.resourceVersion}`;
const catOf = (all: Part[], k: 'releaseSources' | 'releaseSlices'): never[] => { const seen = new Set<string>(); return all.flatMap((p) => ((p.fleet as unknown as Record<string, { items?: never[] } | undefined>)[k]?.items ?? [])).filter((o) => { const c = catKey(o); if (seen.has(c)) return false; seen.add(c); return true; }); };
/** the film's part (the base), for a section island deciding whether its catalogue is already the film's */
export const baseFleetOf = (): FleetSource | null => baseFleet;
const dedupe = <T extends { owner: string; repo: string; number: number }>(xs: T[]): T[] => { const seen = new Set<string>(); return xs.filter((c) => { const k = `${c.owner}/${c.repo}#${c.number}`; if (seen.has(k)) return false; seen.add(k); return true; }); };
