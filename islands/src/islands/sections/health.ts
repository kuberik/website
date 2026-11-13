/**
 * The Health checks feature card: the product's own Health checks card (the rollout Overview's, the one the film frames) for payments-svc in prod
 * us-east-1 while it bakes 3.1.0, the build checkout-api 4.46.0-46 waits on (the Gates card's held wire): the Kustomization and both monitors passing.
 * The world is worlds.ts `payments`; the frame is the card, whole, at natural scale.
 */
import type { CustomCtx } from '../../registry';
import { mountSection } from './section';
import { overviewSpec, T_BAKE } from './overview';

export const mount = (ctx: CustomCtx) => mountSection(ctx, overviewSpec('section-health', 'health-checks', {
	/* a calm loop (DIRECTION.md §3): the Kustomization ready while both monitors are still pending, then all three passing through the bake; reduced motion
	   and the poster rest on the bake */
	times: [14.9, T_BAKE], rest: 1, holdMs: 4000, fadeMs: 400 }));
