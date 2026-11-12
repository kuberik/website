// Stub for @tanstack/svelte-query (SPIKE landing-v5-surfaces). The dashboard's pages that read the fleet list through a query
// (Apps' lane strip, FleetGate) get the SAME payload from the installed FleetSource: `createQuery` answers the rollouts-list key from
// liveSource(), every other key is an idle, data-less query. No client, no cache, no fetch (query-core is ~12 KB gz saved).
import { liveSource } from '$lib/components/home/sketch/fleet-source.svelte';
type Opts = { queryKey?: readonly unknown[] };
const listPayload = () => {
	const s = liveSource();
	return s ? { rollouts: { items: s.rollouts }, environments: { items: s.environments }, rolloutDependencies: s.rolloutDependencies, kustomizations: { items: s.kustomizations }, kruiseRollouts: { items: s.kruiseRollouts }, releaseSources: (s as any).releaseSources, releaseSlices: (s as any).releaseSlices } : undefined; /* the catalogue siblings (dashboard #69) */
};
const idle = (data: unknown) => ({ get data() { return data; }, isLoading: false, isFetching: false, isError: false, error: null, failureCount: 0, refetch: async () => ({}) });
/** SPIKE seam for the rollout-detail surfaces: an island hands the stub a function answering a query key with the payload the API would
 *  have served (undefined = no answer, the idle behaviour below). The stub still never fetches. */
let answers: ((key: readonly unknown[]) => unknown) | null = null;
export const setQueryAnswers = (fn: ((key: readonly unknown[]) => unknown) | null) => { answers = fn; };
export function createQuery(fn: () => Opts & { enabled?: boolean }) {
	/* decided on EVERY read, not once at creation: a query created with an empty key (the Roll back dialog's commit range, before a version is picked) answers once its key fills in */
	const ans = () => { if (!answers) return undefined; const o = fn(); return o.enabled === false ? undefined : answers(o?.queryKey ?? []); };
	const wired = () => !!answers && answers(fn()?.queryKey ?? []) !== undefined;
	const idle = () => { const o = fn(); const k = String(o?.queryKey?.[0] ?? ''); return k === 'rollouts' && o.queryKey?.[1] === 'all' ? listPayload() : undefined; };
	return {
		get data() { return ans() ?? idle(); },
		get isPending() { return wired() ? ans() === undefined : idle() !== undefined ? false : undefined; },
		get isSuccess() { return wired() ? ans() !== undefined : idle() !== undefined ? true : undefined; }, /* the fleet list answers from the FleetSource: settled (the product's fleetSettled() holds the Gates body on a skeleton until it is) */
		isLoading: false, isFetching: false, isError: false, error: null, failureCount: 0, refetch: async () => ({})
	};
}
export const createQueries = (_fn: () => unknown) => Object.assign([] as ReturnType<typeof idle>[], { items: [] as ReturnType<typeof idle>[] }); // `items`: the combine-style result the History tab reads
export const queryOptions = <T>(x: T) => x;
export const createMutation = () => ({ mutate() {}, mutateAsync: async () => ({}), isPending: false });
export const useQueryClient = () => ({ invalidateQueries: async () => {}, setQueryData() {}, getQueryData: () => undefined });
export const keepPreviousData = <T>(x: T) => x;
