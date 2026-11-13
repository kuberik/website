/**
 * The Gates feature card: the product's own Gates tab (the real tab route in the real rollout layout, as the film mounts it) for checkout-api in prod
 * us-east-1, at a story second where staging's promotion has passed, Business hours is open and payments-svc, still baking the 3.1.0 that release
 * 4.46.0-46 requires, holds it (scenario worldAt with `depHold`, no approval gate). The frame is the tab's Gates card, whole (header included), at natural scale.
 */
import type { CustomCtx } from '../../registry';
import { mountSection } from './section';
import { pageAt } from '../shared/scope';
import { worldAt, APP } from '../film/scenario';
import { answersFrom, CLUSTER } from '../film/detail-store.svelte';

const NS = 'checkout-api-prod-us-east-1';
/** after staging's bake (4.4) and the promotion's sync (5.5): every gate but the dependency passes */
const T = 7;
let Tab: unknown;
const world = (t: number) => worldAt(t, { depHold: true, approval: false });

export const mount = (ctx: CustomCtx) =>
	mountSection(ctx, {
		id: 'section-gates',
		load: async () => {
			const [shell, tab] = await Promise.all([import('../film/RolloutShell.svelte'), import('$lib/../routes/rollouts/[cluster]/[namespace]/[name]/gates/+page.svelte')]);
			Tab = tab.default;
			return shell.default;
		},
		props: () => ({ Tab }),
		page: pageAt(`/rollouts/${CLUSTER}/${NS}/${APP}/gates`, '/rollouts/[cluster]/[namespace]/[name]/gates', { cluster: CLUSTER, namespace: NS, name: APP }),
		world,
		answers: (w) => answersFrom(() => w.detail, () => w.fleet.rollouts as unknown[], () => w.github),
		times: [T],
		/* the whole product Card, its header included (DIRECTION.md §3: the island is the product Card, the landing draws no header of its own): the
		   Gates card as the tab lays it out for the card's own width, at natural scale. Below the product's 608 px graph width it stacks the gates as
		   a list, from 608 it is the compact two-column graph with #145's wires. The first canvas guess is the page gutters; `fit` corrects it */
		canvas: (hw) => Math.round(hw) + 32,
		fit: 'width',
		frame: (root) => root.querySelector('[data-tour="dependency-graph"]')?.closest('section') ?? null,
		align: { x: 'start', y: 'start' }
	});
