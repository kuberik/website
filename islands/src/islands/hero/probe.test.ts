import { test } from 'vitest';
import { installLiveSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { placeHolds, gatesOf } from '$lib/components/new/data';
import { githubTable } from '../../github-table.svelte';
import { fleetAt, githubAt, APP } from './scenario';
test('probe', () => {
	for (const t of [3, 20]) {
		installLiveSource(fleetAt(t)); githubTable.set(githubAt(t));
		console.log('--- t=' + t);
		for (const p of placeHolds(APP, 'incident') as any[]) console.log('  ', p.label, p.state, 'reason=' + p.holdReason, 'held=' + p.heldBuilds?.length, 'wave=' + JSON.stringify(p.wave));
		console.log('  gates', JSON.stringify((gatesOf(APP, 'incident') as any[]).map((g) => [g.name, g.kind])));
	}
});
