/**
 * The app page's view-model reads, parameterised by app (the hero and every story that draws an app's rows share them): all rows an app has
 * in the live source, the header's identity facts, the env strip. Pure functions over the dashboard's own data.ts reading whatever the world
 * last installed; no display strings made here. Reference page: /apps/<name> (`components/new/app/AppDetail.svelte`).
 */
import { apps, placeHolds, rowsOf, stepsOf, deployedBuild, waitingBuild, tabPill, ago, type TRow, type PlaceHold } from '$lib/components/new/data';
import { laneOf } from '$lib/components/new/Footprint.svelte';
import { ledgerOf } from '$lib/components/new/app/app-model';

type Row = TRow;
/** AppDetail's `rowFor`, for one place: the model's row where the place has one, else a closed healthy place */
function rowFor(app: string, p: PlaceHold): Row {
	const un = rowsOf('incident', p.tier, p.label).find((r) => r.app === app);
	if (un) return un;
	const dep = deployedBuild({ app, href: p.href, version: p.runs });
	return {
		key: `${app}@${p.env}`, app, tier: p.tier, where: p.place, regions: p.tier === 'prod' ? [p.label] : [], state: p.state, group: 'rest', glyph: 'rest', word: '', change: null,
		version: p.runs, since: dep.at, href: p.href, needsYou: false, lead: false, action: null, cause: null, pipeline: null,
		steps: stepsOf({ state: 'healthy', pipeline: null }).map((s) => ({ ...s, state: 'done' as const })), failure: null, place: p.place, deployedAt: dep.at, regionsOf: null, stillChecking: false
	} as unknown as Row;
}

/** every row `app` has in the live source: the roster's rows (folded per region where it folds them) first, then closed healthy places */
export function appRowsOf(app: string): { rows: Row[]; approval: Row | null } {
	const A = apps('incident');
	const fromGroups = (A.R.groups.flatMap((g) => g.rows) as Row[]).filter((r) => r.app === app);
	const closed = (placeHolds(app, 'incident') as PlaceHold[]).filter((p) => !fromGroups.some((r) => r.href === p.href || r.regions.includes(p.label) && r.tier === p.tier)).map((p) => rowFor(app, p));
	return { rows: [...fromGroups, ...closed], approval: fromGroups.find((r) => r.group === 'approval') ?? null };
}

/** the app page's header facts for `row`: the build in focus (a gated place names the build that WAITS), its tab pill, its commit */
export function identityOf(row: Row): { build: string; pill: { word: string; role: string } | null; commit: { title: string; who: string | null } | null; age: string } {
	const gated = row.state === 'awaiting-approval' || row.state === 'held-by-rule';
	const wb = gated ? waitingBuild(row) : null;
	const dep = deployedBuild(row);
	const pill = gated ? null : tabPill(row);
	const c = wb ? { title: wb.title ?? '', who: wb.author } : dep.title ? { title: dep.title, who: dep.author } : null;
	return { build: wb?.build ?? dep.build, pill: pill ? { word: pill.word, role: pill.role } : null, commit: c, age: ago(wb ? wb.since : dep.at) };
}

/** the app page's env strip (PromotionLane) for the live source */
export function laneOfApp(app: string) {
	const A = apps('incident');
	const item = A.items.find((a) => a.app === app);
	return item ? laneOf(item, A.R.c.m as never, A.R.c.events as never).lane : null;
}

/**
 * The app page's Builds ledger for the live source, as AppDetail feeds AppBuilds: every place once under the build it runs. A place at rest has
 * no pipeline to open (the page gives it no toggle), so this is what the product draws when nothing is moving: the ledger of collapsed place rows.
 */
export function ledgerOfApp(app: string) {
	const places = placeHolds(app, 'incident') as PlaceHold[];
	const view = (p: PlaceHold) => ({ row: rowFor(app, p), pinned: false, approve: null, slipAction: null, toggle: null, open: false });
	return { places, stops: ledgerOf(places), view };
}
