// Stub for @tanstack/svelte-query (SPIKE landing-v5-surfaces). The dashboard's pages that read the fleet list through a query
// (Apps' lane strip, FleetGate) get the SAME payload from the installed FleetSource: `createQuery` answers the rollouts-list key from
// liveSource(), every other key is an idle, data-less query. No client, no cache, no fetch (query-core is ~12 KB gz saved).
import { liveSource } from '$lib/components/home/sketch/fleet-source.svelte';
type Opts = { queryKey?: readonly unknown[] };
const listPayload = () => {
	const s = liveSource();
	return s ? { rollouts: { items: s.rollouts }, environments: { items: s.environments }, rolloutDependencies: s.rolloutDependencies, kustomizations: { items: s.kustomizations }, kruiseRollouts: { items: s.kruiseRollouts } } : undefined;
};
const idle = (data: unknown) => ({ get data() { return data; }, isLoading: false, isFetching: false, isError: false, error: null, failureCount: 0, refetch: async () => ({}) });
export function createQuery(fn: () => Opts) {
	const o = fn();
	const k = String(o?.queryKey?.[0] ?? '');
	return { get data() { return k === 'rollouts' && o.queryKey?.[1] === 'all' ? listPayload() : undefined; }, isLoading: false, isFetching: false, isError: false, error: null, failureCount: 0, refetch: async () => ({}) };
}
export const createQueries = (_fn: () => unknown) => [] as ReturnType<typeof idle>[];
export const createMutation = () => ({ mutate() {}, mutateAsync: async () => ({}), isPending: false });
export const useQueryClient = () => ({ invalidateQueries: async () => {}, setQueryData() {}, getQueryData: () => undefined });
export const keepPreviousData = <T>(x: T) => x;
