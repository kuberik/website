/** SPIKE: mount one real dashboard page component on the world's scripted fleet (static snapshot at story second T[kind]). */
import { mount, type Component } from 'svelte';
import type { CustomCtx } from '../../registry';
import { setPart } from '../shared/world';
import { surfaceFleet } from './fleet';

const T: Record<string, number> = { home: 30, rollouts: 30, apps: 30, environments: 30, changes: 30, 'app-detail': 30, 'env-detail': 30, 'change-detail': 30, activity: 30, dependencies: 30 };
const PROPS: Record<string, () => Promise<Record<string, unknown>>> = {
	'app-detail': async () => ({ state: 'incident', name: 'checkout-api' }),
	'env-detail': async () => { const { envPage } = await import('$lib/components/new/env/env-page'); return { state: 'incident', P: envPage('incident', 'prod') }; },
	'change-detail': async () => { const { findChange } = await import('$lib/components/new/change/detail-model'); return { change: findChange('github.com/exampleco/checkout-api/pull/112', 'incident'), scenario: 'incident' }; }
};
const load: Record<string, () => Promise<{ default: Component<any> }>> = {
	home: () => import('$lib/components/new/Home.svelte'),
	rollouts: () => import('$lib/components/new/Rollouts.svelte'),
	apps: () => import('$lib/components/new/Apps.svelte'),
	environments: () => import('$lib/components/new/Environments.svelte'),
	changes: () => import('$lib/components/new/Changes.svelte'),
	'app-detail': () => import('$lib/components/new/app/AppDetail.svelte'),
	'env-detail': () => import('$lib/components/new/env/EnvPage.svelte'),
	'change-detail': () => import('$lib/components/new/change/ChangeDetail.svelte'),
	activity: () => import('$lib/../routes/activity/+page.svelte'),
	dependencies: () => import('$lib/../routes/dependencies/+page.svelte')
};

export const mountSurface = (kind: string) => (ctx: CustomCtx) => {
	const s = surfaceFleet(T[kind]);
	setPart('surface', s.fleet, s.github);
	void Promise.all([load[kind](), PROPS[kind]?.() ?? Promise.resolve({ state: 'incident' })]).then(([m, props]) => mount(m.default, { target: ctx.wrap, props })).catch((e) => { console.error('surface', kind, e); ctx.wrap.textContent = 'ERR ' + e; });
};
