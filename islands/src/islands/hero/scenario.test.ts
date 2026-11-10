import { test } from 'vitest';
import { installLiveSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { apps, rowsOf, placeHolds, tabPill, deployedBuild, approvalTarget, healthChecks, stepsOf } from '$lib/components/new/data';
import { githubTable } from '../../github-table.svelte';
import { fleetAt, githubAt, APP } from './scenario';

test('dump', () => {
	for (const t of [0, 3, 6, 9, 15, 20, 23, 26, 28, 31]) {
		installLiveSource(fleetAt(t)); githubTable.set(githubAt(t));
		const A = apps('incident');
		const it = A.items.find((a) => a.app === APP);
		const grp = (A as any).R.groups.map((g: any) => g.key + ':' + g.rows.filter((r: any) => r.app === APP).map((r: any) => r.tier + '/' + r.where + '/' + r.state + '/' + r.regions.length).join('|')).join('  ');
		console.log('   groups ' + grp);
		const rows = ['dev', 'staging', 'prod'].flatMap((tier) => rowsOf('incident', tier as never, tier).filter((r) => r.app === APP));
		console.log(`--- t=${t} item=${it ? JSON.stringify({ group: it.group, fact: it.fact, places: it.placeList.map((p: any) => `${p.label}:${p.state}:${p.version}`) }) : 'NONE'}`);
		for (const r of rows as any[]) console.log(`   ${r.tier}/${r.where} state=${r.state} group=${r.group} word="${r.word}" regions=${r.regions?.length} steps=${stepsOf(r).map((s: any) => s.name + ':' + s.state).join(',')} action=${r.action?.kind ?? '-'} needsYou=${r.needsYou}`);
	}
});
