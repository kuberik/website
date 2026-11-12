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
	app: () => import('./AppShell.svelte').then((m) => m.default), /* scene lane 5: the apps/[name] layout (Overview | Pipeline tabs, #142) around AppDetail */
	pipe: () => import('./AppShell.svelte').then((m) => m.default), /* scene lane 5 (owner item 8): the App page's Pipeline tab, every site wave by wave */
	gates: () => import('./RolloutShell.svelte').then((m) => m.default),
	overview: () => import('./RolloutShell.svelte').then((m) => m.default),
	stg: () => import('./RolloutShell.svelte').then((m) => m.default), /* scene lane 3: staging's rollout page (its Overview: pipeline + health checks) */
	history: () => import('./RolloutShell.svelte').then((m) => m.default)
};
const tabs: Record<string, () => Promise<Component<any>>> = {
	gates: () => import('$lib/../routes/rollouts/[cluster]/[namespace]/[name]/gates/+page.svelte').then((m) => m.default),
	overview: () => import('$lib/../routes/rollouts/[cluster]/[namespace]/[name]/+page.svelte').then((m) => m.default),
	stg: () => import('$lib/../routes/rollouts/[cluster]/[namespace]/[name]/+page.svelte').then((m) => m.default),
	history: () => import('$lib/../routes/rollouts/[cluster]/[namespace]/[name]/history/+page.svelte').then((m) => m.default)
};
const cache = new Map<Surf, Promise<Component<any>>>();
const tabComp: Partial<Record<Surf, Component<any>>> = {};
export const isRollout = (s: Surf) => s === 'gates' || s === 'overview' || s === 'history' || s === 'stg';
/** fetches (once) the surface's chunks; resolves to the component the film renders */
export function loadSurface(s: Surf): Promise<Component<any>> {
	let p = cache.get(s);
	if (!p) { p = Promise.all([loaders[s](), tabs[s]?.().then((c) => { tabComp[s] = c; })]).then(([c]) => c); cache.set(s, p); }
	return p;
}
/** what the surface's route would pass it. `ei` (the data snapshot index) re-reads the change from the live source. */
let lastChange: unknown = null;
export function surfaceProps(s: Surf, ei: number): Record<string, unknown> {
	void ei;
	/* lane 35: the outgoing Change page re-derives once with the incoming surface's props before it is torn down, so every surface's props carry the
	   change too (it crashed on 'repo' of undefined); the other pages ignore it */
	const found = cache.has('change') ? findChange(SLUG, 'incident') : null; if (found) lastChange = found;
	const keep = lastChange ? { change: lastChange, checks: null } : {};
	if (s === 'change') return { ...keep, scenario: 'incident', checks: null };
	if (isRollout(s)) return { ...keep, Tab: tabComp[s] };
	if (s === 'app' || s === 'pipe') return { ...keep, state: 'incident', name: APP, tab: s === 'pipe' ? 'pipeline' : 'overview' };
	return { ...keep, state: 'incident' };
}
const base = `/rollouts/${CLUSTER}/${NS}/${APP}`;
const at = (path: string, id: string, params: Record<string, string> = {}) => ({ url: new URL('https://kuberik.com' + path), route: { id }, params });
const R = { cluster: CLUSTER, namespace: NS, name: APP };
export const SURFACE_PATH: Record<Surf, { url: URL; route: { id: string }; params: Record<string, string> }> = {
	change: at(`/changes/${SLUG}`, '/changes/[...slug]', { slug: SLUG }),
	rollouts: at('/rollouts', '/rollouts'),
	envs: at('/environments', '/environments'),
	app: at(`/apps/${APP}`, '/apps/[name]', { name: APP }),
	pipe: at(`/apps/${APP}/pipeline`, '/apps/[name]/pipeline', { name: APP }),
	overview: at(base, '/rollouts/[cluster]/[namespace]/[name]', R),
	stg: at(`/rollouts/${CLUSTER}/checkout-api-staging/${APP}`, '/rollouts/[cluster]/[namespace]/[name]', { ...R, namespace: 'checkout-api-staging' }),
	gates: at(`${base}/gates`, '/rollouts/[cluster]/[namespace]/[name]/gates', R),
	history: at(`${base}/history`, '/rollouts/[cluster]/[namespace]/[name]/history', R)
};
