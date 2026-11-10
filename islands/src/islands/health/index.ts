/** Health story island entry (SPEC 3): the shared story runner with the health scenario; Health.svelte only draws. */
import type { CustomCtx } from '../../registry';
import { mountStory } from '../shared/story';
import Health from './Health.svelte';
import { fleetAt, githubAt } from './scenario';
import { CHIPS, LOOP, REST_T } from './model';

export function mountHealth(ctx: CustomCtx) {
	return mountStory(ctx, { id: 'health', component: Health, loop: LOOP, rest: REST_T, chips: CHIPS, snapshot: (t) => ({ fleet: fleetAt(t), github: githubAt(t) }) });
}
