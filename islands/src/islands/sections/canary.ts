/**
 * The Canary and waves feature card: the product's own Progress card (the App page's Progress tab, apps/[name]/progress) for payments-svc's 3.1.0 in the
 * same moment as the Health checks card: prod us-east-1 (wave 1) through its canary steps and into its bake, the later waves waiting on it. The App
 * page draws from the whole fleet, so the island reads its own world (`source`). The world is worlds.ts `payments`.
 */
import type { CustomCtx } from '../../registry';
import { mountSection } from './section';
import { pageAt } from '../shared/scope';
import { resolveTarget } from '../film/targets';
import { payments, paymentsAnswers } from './worlds';
import { T_BAKE } from './overview';

const APP = 'payments-svc';
export const mount = (ctx: CustomCtx) =>
	mountSection(ctx, {
		id: 'section-canary',
		load: () => import('../film/AppShell.svelte').then((m) => m.default),
		props: () => ({ state: 'incident', name: APP, tab: 'progress' }),
		page: pageAt(`/apps/${APP}/progress`, '/apps/[name]/progress', { name: APP }),
		world: payments,
		source: true,
		answers: paymentsAnswers,
		/* a calm loop (DIRECTION.md §3): the integration test at 10 %, 50 %, then the bake; reduced motion and the poster rest on the bake */
		times: [11.4, 12.9, T_BAKE], rest: 2, holdMs: 4000, fadeMs: 400,
		canvas: (hw) => Math.round(hw) + 32,
		fit: 'width',
		frame: (root) => resolveTarget('pipe-head', root, false),
		/* every place is in, the last wave included */
		ready: (root) => /eu-central-1/.test(resolveTarget('pipe-head', root, false)?.textContent ?? ''),
		align: { x: 'start', y: 'start' }
	});
