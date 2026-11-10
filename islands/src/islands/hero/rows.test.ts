import { test, expect } from 'vitest';
import { installLiveSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { githubTable } from '../../github-table.svelte';
import { fleetAt, githubAt, APP } from './scenario';
import { appPageOf } from '../shared/app-page';
const at = (t: number) => { installLiveSource(fleetAt(t)); githubTable.set(githubAt(t)); return appPageOf(APP, null)!; };
test('at the ask the app page offers ONE Approve in the statement, and the wave-1 leader is the open place', () => {
	const p = at(16);
	expect(p.statement).toMatchObject({ kind: 'wait', severity: 'approval', title: 'Needs your approval' });
	expect((p.statement as { target: { build: string } }).target).toMatchObject({ build: '4.46.0-46' });
	expect(p.leadKey).toBe('checkout-api@prod-us-east-1');
});
test('wave 2 moves as one folded place led by the lexicographically lowest site (wave.go leader rule)', () => {
	const p = at(26);
	expect(p.leadKey).toBe('checkout-api@ap-southeast-2');
	expect(p.statement).toBeNull();
});
test('nothing moves at rest: no statement, nothing open', () => { const p = at(33); expect(p.leadKey).toBeNull(); expect(p.statement).toBeNull(); });
