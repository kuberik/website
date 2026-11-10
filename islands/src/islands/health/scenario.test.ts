import { test, expect } from 'vitest';
import { installLiveSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { githubTable } from '../../github-table.svelte';
import { appRowsOf, identityOf, laneOfApp } from '../shared/app-model';
import { healthChecks as dashChecks } from '$lib/components/new/data';
import { fleetAt, githubAt, APP } from './scenario';
const at = (t: number) => { installLiveSource(fleetAt(t)); githubTable.set(githubAt(t)); const { rows } = appRowsOf(APP); return rows; };
test('staging reads as the product reads it at every beat', () => {
	const dump = (t: number) => { const r = at(t).find((x) => x.tier === 'staging')!; return { t, group: r.group, state: r.state, word: r.word, failure: r.failure, action: r.action?.kind ?? null, id: identityOf(r) }; };
	for (const t of [1, 4, 6.5, 10, 14, 16, 20]) console.log(JSON.stringify(dump(t)));
	expect(at(10).find((x) => x.tier === 'staging')!.group).toBe('failed');
});
test('dev and prod rows and the strip', () => {
	const rows = at(10);
	console.log(rows.map((r) => `${r.tier}:${r.group}:${r.word}:${r.version}`).join(' | '));
	console.log(JSON.stringify(laneOfApp(APP)?.stages.map((s: any) => [s.label ?? s.tier, s.state, s.behind])));
	console.log(JSON.stringify(dashChecks({ href: at(10).find((x) => x.tier === 'staging')!.href })));
});
