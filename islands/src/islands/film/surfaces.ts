/**
 * The film's surfaces: each is the dashboard's OWN page component, loaded lazily (one chunk graph per surface; the loader fetches it 3 s before its first beat).
 * Props are what the route would pass; nothing is drawn here. The rollout page is the real tab-strip layout around the real tab route (RolloutShell), so
 * Gates -> Overview -> History is the product's own tab switch.
 */
import type { Component } from 'svelte';
import type { Surf } from './script';
import { findChange } from '$lib/components/new/change/detail-model';
import { APP } from './scenario';
import { CLUSTER } from './detail-store.svelte';

const SLUG = 'github.com/exampleco/checkout-api/pull/112';
const NS = 'checkout-api-prod-us-east-1';
const loaders: Record<Surf, () => Promise<Component<any>>> = {
	change: () => import('$lib/components/new/change/ChangeDetail.svelte').then((m) => m.default),
	rollouts: () => import('$lib/components/new/Rollouts.svelte').then((m) => m.default),
	envs: () => import('$lib/components/new/Environments.svelte').then((m) => m.default),
	app: () => import('$lib/components/new/app/AppDetail.svelte').then((m) => m.default),
	gates: () => import('./RolloutShell.svelte').then((m) => m.default),
	overview: () => import('./RolloutShell.svelte').then((m) => m.default),
	history: () => import('./RolloutShell.svelte').then((m) => m.default)
};
const tabs: Record<string, () => Promise<Component<any>>> = {
	gates: () => import('$lib/../routes/rollouts/[cluster]/[namespace]/[name]/gates/+page.svelte').then((m) => m.default),
	overview: () => import('$lib/../routes/rollouts/[cluster]/[namespace]/[name]/+page.svelte').then((m) => m.default),
	history: () => import('$lib/../routes/rollouts/[cluster]/[namespace]/[name]/history/+page.svelte').then((m) => m.default)
};
const cache = new Map<Surf, Promise<Component<any>>>();
const tabComp: Partial<Record<Surf, Component<any>>> = {};
export const isRollout = (s: Surf) => s === 'gates' || s === 'overview' || s === 'history';
/** fetches (once) the surface's chunks; resolves to the component the film renders */
export function loadSurface(s: Surf): Promise<Component<any>> {
	let p = cache.get(s);
	if (!p) { p = Promise.all([loaders[s](), tabs[s]?.().then((c) => { tabComp[s] = c; })]).then(([c]) => c); cache.set(s, p); }
	return p;
}
/** what the surface's route would pass it. `ei` (the data snapshot index) re-reads the change from the live source. */
export function surfaceProps(s: Surf, ei: number): Record<string, unknown> {
	void ei;
	if (s === 'change') return { change: findChange(SLUG, 'incident'), scenario: 'incident', checks: null };
	if (isRollout(s)) return { Tab: tabComp[s] };
	if (s === 'app') return { state: 'incident', name: APP };
	return { state: 'incident' };
}
const base = `/rollouts/${CLUSTER}/${NS}/${APP}`;
const at = (path: string, id: string, params: Record<string, string> = {}) => ({ url: new URL('https://kuberik.com' + path), route: { id }, params });
const R = { cluster: CLUSTER, namespace: NS, name: APP };
export const SURFACE_PATH: Record<Surf, { url: URL; route: { id: string }; params: Record<string, string> }> = {
	change: at(`/changes/${SLUG}`, '/changes/[...slug]', { slug: SLUG }),
	rollouts: at('/rollouts', '/rollouts'),
	envs: at('/environments', '/environments'),
	app: at(`/apps/${APP}`, '/apps/[name]', { name: APP }),
	overview: at(base, '/rollouts/[cluster]/[namespace]/[name]', R),
	gates: at(`${base}/gates`, '/rollouts/[cluster]/[namespace]/[name]/gates', R),
	history: at(`${base}/history`, '/rollouts/[cluster]/[namespace]/[name]/history', R)
};
