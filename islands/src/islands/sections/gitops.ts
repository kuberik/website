/**
 * The GitOps feature card: the product's own Resources card (the rollout Overview's: what Flux applied from the rollout's Kustomization, and whether
 * it is ready) for checkout-api in staging, which runs 4.46.0-46, in the held moment (worlds.ts `held`). The product has no view of the one value
 * Kuberik writes into the Kustomization (its postBuild substitute); this is the closest real one: Flux's side of it.
 */
import type { CustomCtx } from '../../registry';
import { mountSection } from './section';
import { pageAt } from '../shared/scope';
import { APP } from '../film/scenario';
import { answersFrom, CLUSTER } from '../film/detail-store.svelte';
import { held } from './worlds';
import { cardTitled } from './frames';
import { T_HELD } from './releases';

const NS = `${APP}-staging`;
let Tab: unknown;
export const mount = (ctx: CustomCtx) =>
	mountSection(ctx, {
		id: 'section-gitops',
		load: async () => {
			const [shell, tab] = await Promise.all([import('../film/RolloutShell.svelte'), import('$lib/../routes/rollouts/[cluster]/[namespace]/[name]/+page.svelte')]);
			Tab = tab.default;
			return shell.default;
		},
		props: () => ({ Tab }),
		page: pageAt(`/rollouts/${CLUSTER}/${NS}/${APP}`, '/rollouts/[cluster]/[namespace]/[name]', { cluster: CLUSTER, namespace: NS, name: APP }),
		world: (t) => held(t, 'staging'),
		answers: (w) => answersFrom(() => w.detail, () => w.fleet.rollouts as unknown[], () => w.github),
		times: [T_HELD],
		canvas: (hw) => Math.round(hw) + 32,
		fit: 'width',
		frame: (root) => cardTitled(root, /^Resources$/),
		align: { x: 'start', y: 'start' }
	});
