/**
 * THE APP PAGE'S VIEW-MODEL for the landing windows that draw /apps/<name> (the hero): what `components/new/app/AppDetail.svelte` derives between the
 * live source and its markup, re-run here over the same product functions (apps, placeHolds, rowsOf, pillOf, approvalOf, approveAct, ledgerOf, ...).
 * AppDetail itself cannot be mounted (it owns route queries, the star, the deploy dialog); every derivation below is its own, line for line, and
 * every printed word is the product's (statement title, wait sentence, the ledger's rows). Only the pieces a window needs are kept:
 * the statement (wait / checking / failed), the ledger and which place opens. The rail (Holding, pulse, activity) is not a window's job.
 */
import { apps, appHolds, approvalTarget, deployedBuild, tabPill, heldHere, urgencyClass, checkClock, placeHolds, rowsOf, stepsOf, type TRow, type PlaceHold } from '$lib/components/new/data';
import { approvalOf } from '$lib/components/new/Footprint.svelte';
import { rowAction, actionHref } from '$lib/components/new/rollout-view';
import { approvalWord } from '$lib/components/new/state-words';
import { approveAct } from '$lib/components/new/approvals.svelte';
import { approvalMessage, pillOf, ledgerOf, pinnedPlaces, tierRank } from '$lib/components/new/app/app-model';
import type { PlaceView } from '$lib/components/new/app/AppBuilds.svelte';

const SCENARIO = 'incident' as const;
type Row = TRow;

/** AppDetail's `rowFor`: the model's row for the place (only the action that targets ITS rollout), else a closed healthy place */
function rowFor(app: string, p: PlaceHold): Row {
	const un = rowsOf(SCENARIO, p.tier, p.label).find((r) => r.app === app);
	if (un) {
		const own = un.action && un.action.href === p.href ? un.action : null;
		return own === un.action ? un : { ...un, action: own, needsYou: un.needsYou && !!own };
	}
	const dep = deployedBuild({ app, href: p.href, version: p.runs });
	return {
		key: `${app}@${p.env}`, app, tier: p.tier, where: p.place, regions: p.tier === 'prod' ? [p.label] : [], state: p.state, group: 'rest', glyph: 'rest', word: '', change: null,
		version: p.runs, since: dep.at, href: p.href, needsYou: false, lead: false, action: null, cause: null, pipeline: null,
		steps: stepsOf({ state: 'healthy', pipeline: null }).map((s) => ({ ...s, state: 'done' as const })), failure: null, place: p.place, deployedAt: dep.at, regionsOf: null, stillChecking: false
	} as unknown as Row;
}

export type Statement =
	| { kind: 'wait'; severity: 'checking' | 'approval' | 'info'; title: string; message?: string; approve: ReturnType<typeof approveAct> | { label: string; href: string; icon: never; key: string } | undefined; openHref: string | null; target: ReturnType<typeof approvalTarget> }
	| { kind: 'fail' };

export type AppPage = {
	places: PlaceHold[];
	stops: ReturnType<typeof ledgerOf>;
	/** the one open place's key (the lead: first non-rest row), null when nothing moves */
	leadKey: string | null;
	statement: Statement | null;
	view: (p: PlaceHold, openKey: string | null, phone: boolean) => PlaceView;
};

export function appPageOf(name: string, CheckOutline: unknown): AppPage | null {
	const A = apps(SCENARIO);
	const item = A.items.find((a) => a.app === name) ?? null;
	if (!item) return null;
	const approvals = (A.R.groups.find((g) => g.key === 'approval')?.rows ?? []) as TRow[];
	const places = placeHolds(name, SCENARIO);
	const all = places.map((p) => ({ p, r: rowFor(name, p) }));
	const quiet = all.every((x) => urgencyClass(x.r) >= 4);
	const placeRows = all
		.sort((a, b) => quiet
			? tierRank(a.p.tier) - tierRank(b.p.tier) || a.p.label.localeCompare(b.p.label)
			: Number(b.p.tier === 'prod') - Number(a.p.tier === 'prod') || urgencyClass(a.r) - urgencyClass(b.r) || (urgencyClass(a.r) < 5 ? (b.r.since ?? '').localeCompare(a.r.since ?? '') : 0) || tierRank(a.p.tier) - tierRank(b.p.tier) || a.p.label.localeCompare(b.p.label))
		.map((x) => x.r);
	const failing = placeRows.filter((r) => r.group === 'failed');
	const failRow = failing.find((r) => r.lead) ?? failing[0] ?? null;
	const rows = placeRows.filter((r) => r.group !== 'rest');
	const leadKey = rows[0]?.key ?? null;
	const ownedByStatement = (r: Row): Row => ((r.group === 'approval' && !failRow) || (failRow && r.key === failRow.key) ? { ...r, action: null } : r);
	const pins = pinnedPlaces(item.holds ?? []);

	/* the wait line: AppDetail's `attention` / `appr` / `stateRow` / `parts` / `waitMessage` chain, unchanged */
	const attention = item.group === 'needs' || !!approvalOf(item, approvals);
	const appr = attention && item.group !== 'needs' ? approvalOf(item, approvals) : null;
	const stateRow = appr?.row ?? item.row ?? null;
	const holds = appHolds(item, SCENARIO);
	const factLine = item.approval && holds.some((h) => h.approval) ? [] : [item.fact];
	const outcomeText = [...factLine, ...holds.map((h) => h.text).filter((h) => !item.fact.includes(h))].join(' · ');
	const apprText = appr?.text ?? holds.find((h) => h.approval)?.text ?? '';
	const parts = appr ? [apprText, ...(item.approval ? [] : [item.fact])] : item.group === 'quiet' ? [item.fact] : outcomeText.split(' · ');
	const cause = parts.slice(1).join(' · ') || null;
	const waitsOnApproval = !!stateRow && stateRow.group === 'approval';
	const waitAct = waitsOnApproval && stateRow ? rowAction(stateRow) : null;
	const checkingNow = waitsOnApproval && !!stateRow && tabPill({ href: stateRow.href }).word === 'CHECKING';
	const checkLeft = checkingNow && stateRow ? checkClock({ href: stateRow.href, state: 'checking', group: 'rest' } as never) : null;
	const heldN = stateRow ? (heldHere(stateRow.href)?.count ?? null) : null;
	const waitMessage = checkingNow ? (checkLeft ?? 'The health checks are running.') : waitsOnApproval ? approvalMessage(heldN, places.find((p) => p.href === stateRow?.href) ?? null, places) : cause;
	let statement: Statement | null = null;
	if (failRow) statement = { kind: 'fail' };
	else if (item.group !== 'quiet' && parts[0] && (waitsOnApproval || /^(Waits|Pinned|Held)/.test(parts[0]))) {
		statement = {
			kind: 'wait', severity: checkingNow ? 'checking' : waitsOnApproval ? 'approval' : 'info',
			title: checkingNow ? 'Checking' : waitsOnApproval ? approvalWord(!!stateRow?.needsYou) : parts[0], message: waitMessage ?? undefined,
			approve: waitAct ? (approveAct(stateRow ? approvalTarget(stateRow, SCENARIO) : null, { icon: CheckOutline as never }) ?? { label: 'Approve', href: actionHref(waitAct), icon: CheckOutline as never, key: 'approve' }) : undefined,
			openHref: stateRow?.href ?? null, target: stateRow ? approvalTarget(stateRow, SCENARIO) : null
		};
	}
	return {
		places,
		stops: ledgerOf(places),
		leadKey,
		statement,
		view: (p, openKey, phone) => {
			const r = ownedByStatement(placeRows.find((x) => x.href === p.href) ?? rowFor(name, p));
			const approve = !phone && r.action?.kind === 'approve' ? r.action : null;
			const act = rowAction(r);
			return { row: r, pinned: pins.has(p.place), approve, slipAction: r.group === 'failed' || act?.kind === 'approve' ? null : act, toggle: r.group === 'rest' ? null : () => {}, open: r.key === openKey };
		}
	};
}
