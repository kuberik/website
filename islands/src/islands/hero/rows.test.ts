import { test, expect } from 'vitest';
import { installLiveSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { githubTable } from '../../github-table.svelte';
import { fleetAt, githubAt } from './scenario';
import { focusRow, identityOf, actionOf, targetOf } from './model';
test('at the ask the Slipway row carries the Approve and names the 5 regions', () => {
	installLiveSource(fleetAt(16)); githubTable.set(githubAt(16));
	const r = focusRow(16)!;
	expect(r.group).toBe('approval'); expect(r.regions.length).toBe(5);
	expect(actionOf(r)?.kind).toBe('approve');
	expect(targetOf(r)).toMatchObject({ build: '4.46.0-46', count: 5, where: '5 prod regions' });
	expect(identityOf(r).build).toBe('4.46.0-46'); expect(identityOf(r).pill).toBeNull();
});
