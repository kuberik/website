/** SPIKE: mount one real dashboard page component on the world's scripted fleet (static snapshot at story second T[kind]). */
import { mount, type Component } from 'svelte';
import type { CustomCtx } from '../../registry';
import { setPart } from '../shared/world';
import { surfaceFleet } from './fleet';
import { failWave1, soloCheckout } from './truth';

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
	const q = new URLSearchParams(location.search);
	const s = surfaceFleet(q.get('t') ? Number(q.get('t')) : T[kind]);
	if (q.get('solo') === '1') soloCheckout(s.fleet);
	if (q.get('fail') === '1') failWave1(s.fleet);
	setPart('surface', s.fleet, s.github);
	void Promise.all([load[kind](), PROPS[kind]?.() ?? Promise.resolve({ state: 'incident' })]).then(([m, props]) => mount(m.default, { target: ctx.wrap, props })).catch((e) => { console.error('surface', kind, e); ctx.wrap.textContent = 'ERR ' + e; });
};

/** SPIKE rollout-detail: `surface-rollout-<variant>` mounts the real layout + tab route for checkout-api / prod us-east-1 (see rollout-detail.ts). */
export const mountRollout = (variant: string) => (ctx: CustomCtx) => {
	void (async () => {
		const { detailAnswers, NS, NAME, CLUSTER } = await import('./rollout-detail');
		detailAnswers(variant as never);
		const tab = variant === 'gates' ? 'gates' : variant === 'history' ? 'history' : '';
		const { page } = await import('../../stubs/app-state');
		const base = `/rollouts/${CLUSTER}/${NS}/${NAME}`;
		Object.assign(page, { params: { cluster: CLUSTER, namespace: NS, name: NAME }, route: { id: '/rollouts/[cluster]/[namespace]/[name]' + (tab ? '/' + tab : '') },
			url: new URL(`https://kuberik.com${base}${tab ? '/' + tab : ''}${variant === 'rollback' ? '?action=rollback' : ''}`) });
		const { page: storePage } = await import('../../stubs/app-stores');
		storePage.set({ ...page } as never);
		const T: Record<string, () => Promise<{ default: Component<any> }>> = {
			'': () => import('$lib/../routes/rollouts/[cluster]/[namespace]/[name]/+page.svelte'),
			gates: () => import('$lib/../routes/rollouts/[cluster]/[namespace]/[name]/gates/+page.svelte'),
			history: () => import('$lib/../routes/rollouts/[cluster]/[namespace]/[name]/history/+page.svelte')
		};
		const [Tab, Shell] = await Promise.all([T[tab](), import('./RolloutShell.svelte')]);
		ctx.wrap.style.position = 'relative';
		mount(Shell.default, { target: ctx.wrap, props: { Tab: Tab.default } });
	})().catch((e) => { console.error('rollout', variant, e); ctx.wrap.textContent = 'ERR ' + e; });
};

/** TRUTH SPIKE R3: what the REAL /changes/[...slug] route draws at `?t=`: findChange -> ChangeDetail, else (no such change) its own NotFound with the route's own props.
 *  (FleetGate is not mounted: it hangs the harness page; the route's branch is reproduced 1:1 from routes/changes/[...slug]/+page.svelte.) */
export const mountChangeRoute = () => (ctx: CustomCtx) => {
	void (async () => {
		const q = new URLSearchParams(location.search);
		const s = surfaceFleet(Number(q.get('t') ?? 2.2));
		setPart('surface', s.fleet, s.github);
		const slug = 'github.com/exampleco/checkout-api/pull/112';
		const { findChange } = await import('$lib/components/new/change/detail-model');
		const change = findChange(slug, 'incident');
		if (change) { const m = await import('$lib/components/new/change/ChangeDetail.svelte'); mount(m.default, { target: ctx.wrap, props: { change, scenario: 'incident', checks: null } }); return; }
		const [{ default: NotFound }, { changeSlugTitle }] = await Promise.all([import('$lib/components/NotFound.svelte'), import('$lib/pr-ref')]);
		const segments = slug.split('/');
		const named = changeSlugTitle(segments);
		mount(NotFound, { target: ctx.wrap, props: { eyebrow: 'Change', title: named?.title ?? segments[segments.length - 1], headline: 'This change does not exist', nextStep: 'Check the address, or find the change in the list.', facts: [{ label: 'Address', value: slug }], backHref: '/changes', backLabel: 'Back to all changes' } });
	})().catch((e) => { console.error('change-route', e); ctx.wrap.textContent = 'ERR ' + e; });
};
