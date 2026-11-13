/**
 * The Dashboard feature card: what a pasted pull request link opens, the product's own Change page (the real changes/[...slug] route) for #112 in
 * the held moment (worlds.ts `held`): its History card, how far it got (merged, released, dev, staging, held in prod us-east-1, waiting on
 * payments-svc). The page draws from the whole fleet, so the island reads its own world (`source`).
 */
import type { CustomCtx } from '../../registry';
import { mountSection } from './section';
import { pageAt } from '../shared/scope';
import { answersFrom } from '../film/detail-store.svelte';
import { cardTitled } from './frames';
import { held } from './worlds';
import { T_HELD } from './releases';

const SLUG = 'github.com/exampleco/checkout-api/pull/112';
export const mount = (ctx: CustomCtx) =>
	mountSection(ctx, {
		id: 'section-dashboard',
		load: () => import('$lib/../routes/changes/[...slug]/+page.svelte').then((m) => m.default),
		page: pageAt(`/changes/${SLUG}`, '/changes/[...slug]', { slug: SLUG }),
		world: (t) => held(t),
		source: true,
		answers: (w) => answersFrom(() => w.detail, () => w.fleet.rollouts as unknown[], () => w.github),
		times: [T_HELD],
		canvas: (hw) => Math.round(hw) + 32,
		fit: 'width',
		frame: (root) => cardTitled(root, /^History$/),
		/* History's rows are in: down to the merge */
		ready: (root) => /Merged/.test(cardTitled(root, /^History$/)?.textContent ?? ''),
		align: { x: 'start', y: 'start' }
	});
