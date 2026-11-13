/**
 * The Gates feature card: the product's own Gates tab (the real tab route in the real rollout layout, as the film mounts it) for checkout-api in prod
 * us-east-1, at a story second where staging's promotion has passed, Business hours is open and payments-svc, still baking the 3.1.0 that release
 * 4.46.0-46 requires, holds it (scenario worldAt with `depHold`, no approval gate). The frame is the tab's Gates card, at natural scale.
 */
import type { CustomCtx } from '../../registry';
import { mountSection, rectOf } from './section';
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
		/* natural scale: the product lays the graph out for the card's own width (its dotted box is the host's width + 2, so its 1 px border sits
		   under the clip; the first guess is the page gutters and card padding at phone widths, `fit` corrects it); the frame is the graph from the top of its
		   dotted canvas to 10 px under this rollout's tile (the gutter above Downstream, which the frame leaves out) */
		canvas: (hw) => Math.round(hw) + 68,
		fit: 'width',
		frame: (root) => {
			const dots = root.querySelector('[data-tour="dependency-graph"] .canvas-dots'), focus = dots?.querySelector('[data-hood-focus]'), up = dots?.querySelector('[data-hood-link="upstream"]');
			if (!dots || !focus) return null;
			/* the compact graph (gates left, this rollout right, from a 560 px graph): the whole dotted box, its border under the clip. The stacked list (narrower): down
			   to 10 px under this rollout's tile, the gutter above Downstream, which the frame leaves out (its spine runs on below the foot) */
			const compact = !!up && focus.getBoundingClientRect().left > up.getBoundingClientRect().right;
			return compact ? rectOf(dots, [], { l: -1, t: -1, r: -1, b: -1 }) : rectOf(dots, [focus], { l: -1, t: -1, r: -1, b: 10 });
		},
		align: { x: 'start', y: 'start' }
	});
