/**
 * A card of the rollout Overview (the real tab route in the real rollout layout, as the film mounts it) for payments-svc in prod us-east-1, baking
 * 3.1.0 (worlds.ts `payments`). Shared by the Health checks and Canary cards: the same page, the same story second, a different card framed.
 */
import { pageAt } from '../shared/scope';
import { CLUSTER } from '../film/detail-store.svelte';
import { resolveTarget } from '../film/targets';
import { payments, paymentsAnswers } from './worlds';
import type { SectionSpec } from './section';

const APP = 'payments-svc', NS = `${APP}-prod-us-east-1`;
/** us-east-1's checks are all healthy (scenario EV.hcLat 15.4) and its bake runs until EV.us1Done 17.9 */
export const T_BAKE = 16.8;
let Tab: unknown;
export const overviewSpec = (id: string, target: 'health-checks' | 'pipeline', loop?: Pick<SectionSpec, 'times' | 'rest' | 'holdMs' | 'fadeMs'>): SectionSpec<ReturnType<typeof payments>> => ({
	id,
	load: async () => {
		const [shell, tab] = await Promise.all([import('../film/RolloutShell.svelte'), import('$lib/../routes/rollouts/[cluster]/[namespace]/[name]/+page.svelte')]);
		Tab = tab.default;
		return shell.default;
	},
	props: () => ({ Tab }),
	page: pageAt(`/rollouts/${CLUSTER}/${NS}/${APP}`, '/rollouts/[cluster]/[namespace]/[name]', { cluster: CLUSTER, namespace: NS, name: APP }),
	world: payments,
	answers: paymentsAnswers,
	times: [T_BAKE],
	...loop,
	/* natural scale: the product lays the page out for the card's own width (below its lg breakpoint the Overview is one column, every card the
	   column's width); the first guess is the page gutters, `fit` corrects it */
	canvas: (hw) => Math.round(hw) + 32,
	fit: 'width',
	frame: (root) => resolveTarget(target, root, false),
	align: { x: 'start', y: 'start' }
});
