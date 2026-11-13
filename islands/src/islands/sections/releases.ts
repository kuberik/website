/**
 * The Releases feature card: the product's own Builds card (the App page's Overview, apps/[name]) for checkout-api in the held moment (worlds.ts
 * `held`): 4.46.0-46 newest, running in dev and staging, production on 4.45.0-45. The App page draws from the whole fleet, so the island reads its
 * own world (`source`), never the film's.
 */
import type { CustomCtx } from '../../registry';
import { mountSection } from './section';
import { pageAt } from '../shared/scope';
import { APP } from '../film/scenario';
import { answersFrom } from '../film/detail-store.svelte';
import { resolveTarget } from '../film/targets';
import { held } from './worlds';

export const T_HELD = 7;
export const mount = (ctx: CustomCtx) =>
	mountSection(ctx, {
		id: 'section-releases',
		load: () => import('../film/AppShell.svelte').then((m) => m.default),
		props: () => ({ state: 'incident', name: APP, tab: 'overview' }),
		page: pageAt(`/apps/${APP}`, '/apps/[name]', { name: APP }),
		world: (t) => held(t),
		source: true,
		answers: (w) => answersFrom(() => w.detail, () => w.fleet.rollouts as unknown[], () => w.github),
		times: [T_HELD],
		canvas: (hw) => Math.round(hw) + 32,
		fit: 'width',
		frame: (root) => resolveTarget('builds', root, false),
		align: { x: 'start', y: 'start' }
	});
