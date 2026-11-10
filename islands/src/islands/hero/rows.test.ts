import { test, expect } from 'vitest';
import { installLiveSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { githubTable } from '../../github-table.svelte';
import { fleetAt, githubAt, APP } from './scenario';
import { appPageOf } from '../shared/app-page';
const at = (t: number) => { installLiveSource(fleetAt(t)); githubTable.set(githubAt(t)); return appPageOf(APP, null)!; };
const st = (t: number) => at(t).statement as { severity: string; title: string; message?: string; target?: { build: string } } | null;
test('approval: the product says what follows it, one Approve, wave-1 leader open', () => {
	const p = at(8);
	expect(p.statement).toMatchObject({ kind: 'wait', severity: 'approval', title: 'Needs your approval', message: 'Newer builds are waiting here. Then 4 more regions follow.' });
	expect(st(8)!.target).toMatchObject({ build: '4.46.0-46' });
	expect(p.leadKey).toBe('checkout-api@prod-us-east-1');
});
test('after the approval the contract, then the CI gate, hold (the product names each)', () => {
	expect(st(13)).toMatchObject({ severity: 'info', title: 'Waits on payments-svc in us-east-1' });
	expect(st(18)).toMatchObject({ severity: 'info', title: 'Waits on Integration tests in us-east-1' });
	expect(st(23)).toBeNull();
});
test('wave 2 moves as one folded place led by the lexicographically lowest site', () => { expect(at(30).leadKey).toBe('checkout-api@ap-southeast-2'); });
test('nothing moves at rest', () => { const p = at(36); expect(p.leadKey).toBeNull(); expect(p.statement).toBeNull(); });
