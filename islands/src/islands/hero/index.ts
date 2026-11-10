/** Hero island entry: the shared story runner with the hero's scenario; Hero.svelte only draws. */
import { approvalUi } from '$lib/components/new/approvals.svelte';
import type { CustomCtx } from '../../registry';
import { mountStory } from '../shared/story';
import Hero from './Hero.svelte';
import { fleetAt, githubAt } from './scenario';
import { CHIPS, LOOP, REST_T } from './model';

export function mountHero(ctx: CustomCtx) {
	return mountStory(ctx, { id: 'hero', component: Hero, loop: LOOP, rest: REST_T, chips: CHIPS, snapshot: (t) => ({ fleet: fleetAt(t), github: githubAt(t) }), onReduced: () => { approvalUi.ask = null; } });
}
