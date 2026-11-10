import { test } from 'vitest';
import { installLiveSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { rollouts } from '$lib/components/new/data';
import { stateWordOf } from '$lib/components/new/rollout-view';
import { buildRolloutCards } from '$lib/rollout-cards';
import { blockingStory } from '$lib/view-models/blocking-story';
import { fleetAt } from './islands/hero/scenario';
test('probe', () => {
	for (const t of [17, 18.6, 19.6, 21, 26, 31]) {
		installLiveSource(fleetAt(t) as never);
		const R = rollouts('incident');
		const f: any = fleetAt(t);
		const cs: any[] = buildRolloutCards(f.rollouts, f.environments, f.now);
		console.log('c' + t, cs.map((c) => `${c.namespace}:held=${c.held}:${c.heldCause}:${c.heldCauseLabel}:waits=${c.waitsForEnv}:${c.waveWait}`).join(' | '));
		for (const c of cs.filter((x: any) => x.held).slice(0, 1).concat(cs.filter((x:any)=>!x.held).slice(-1))) console.log('story' + t, JSON.stringify({ke: Object.keys(c).join(','), cand: c.blockingStory?.candidates ?? null}).slice(0, 3000));
		console.log('t=' + t, R.rows.map((r: any) => `${r.app}/${r.tier}/${r.regions?.join('+')}:${r.group}:${stateWordOf(r, 'incident')}:${r.fact ?? ''}`).join(' | '));
	}
});
