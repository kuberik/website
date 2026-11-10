<svelte:options runes={true} />
<script lang="ts">
	/**
	 * HEALTH WINDOW (SPEC 3). ROLE: the story section "a failing check stops the build where it is": the rollout tab in miniature, one failing check, one press.
	 * REFERENCE REGIONS (the pages the owner calls best): /apps/orders-api header (AppHeader: glyph, name, build, pill, commit, env strip), the statement banner
	 * (`StatementBanner` as the app page draws it for a failed place), main + rail: `Slipway` (the Deployment pipeline card) beside `HealthChecksCard` (the Overview's rail).
	 * Every drawn part is the dashboard's component, fed by the world (scenario.ts CRs); this file only places them.
	 * NEW BY DESIGN: the window top bar, the pointer and the chip bar, the same three as the hero's (shared/).
	 * At phone width the Slipway is left out: the banner carries the check and the Roll back, the card carries the rows, and the window stays one screen (SPEC 3.3).
	 */
	import Slipway from '$lib/components/new/Slipway.svelte';
	import StatementBanner from '$lib/components/StatementBanner.svelte';
	import HealthChecksCard from '$lib/components/HealthChecksCard.svelte';
	import { UndoOutline } from 'flowbite-svelte-icons';
	import { ago, type TRow } from '$lib/components/new/data';
	import { envTheme } from '$lib/components/new/rollout-view';
	import { tick, untrack } from 'svelte';
	import WindowBar from '../shared/WindowBar.svelte';
	import AppHeader from '../shared/AppHeader.svelte';
	import Pointer from '../shared/Pointer.svelte';
	import ChipBar from '../shared/ChipBar.svelte';
	import { identityOf, laneOfApp } from '../shared/app-model';
	import { APP, LOOP, stagingChecks, windowStartAt, phaseAt } from './scenario';
	import { CHIPS, chipAt, stagingRow, rollbackOf, choreoAt } from './model';

	let { t, playing, reduced, onseek, ontoggle }: { t: number; playing: boolean; reduced: boolean; onseek: (chip: number) => void; ontoggle: () => void } = $props();

	let box: HTMLElement | undefined = $state();
	let width = $state(1120);
	const narrow = $derived(width < 640);
	const wide = $derived(width >= 880);

	/* what the dashboard's own view-model says at this instant (the world installed the source before `t` changed) */
	const row = $derived(t >= 0 ? (stagingRow() as TRow | null) : null);
	const who = $derived(row ? identityOf(row) : null);
	const lane = $derived(t >= 0 ? laneOfApp(APP) : null);
	const cur = $derived.by(() => { const h = (row?.href ?? '').split('/').filter(Boolean); return h[0] === 'rollouts' ? { ns: h[2], name: h[3] } : null; });
	const hrefFor = (n: { card: unknown }) => (n.card as { href?: string }).href ?? '';
	const checks = $derived(stagingChecks(t));
	const windowStart = $derived(windowStartAt(t));

	/* the statement: opens when the place fails and stays closed otherwise; its content is held while it collapses so the words do not vanish before the box does */
	const failed = $derived(row?.group === 'failed');
	const stmt = $state<{ check?: { name: string; message?: string }; since: string; build: string; undo: string }>({ since: '', build: '', undo: 'Roll back' });
	$effect(() => {
		if (failed && row) {
			const f = row.failure, a = rollbackOf(row);
			untrack(() => { stmt.check = f ? { name: f.check ?? f.line, message: f.check ? (f.message ?? undefined) : undefined } : undefined; stmt.since = ago(row.since); stmt.build = identityOf(row).build; stmt.undo = a?.label ?? 'Roll back'; });
		}
	});
	const noop = () => {};

	/* the one press (pure function of t) */
	const ch = $derived(reduced ? { target: null, visible: false, press: false } : choreoAt(t));
	let ptr = $state({ x: 0, y: 0 });
	let ptrShown = $state(false);
	$effect(() => {
		const { target, visible } = ch;
		(async () => {
			await tick();
			const el = target === 'rollback' ? box?.querySelector('[data-action="rollback"]') : null;
			const b = box?.getBoundingClientRect(), r = el?.getBoundingClientRect();
			if (visible && b && r) { ptr = { x: r.left - b.left + r.width * 0.62, y: r.top - b.top + r.height * 0.6 }; ptrShown = true; }
			else if (visible && !ptrShown && box) { ptr = { x: box.clientWidth - 60, y: box.clientHeight - 50 }; ptrShown = true; }
			if (!visible) ptrShown = false;
		})();
	});

	const lit = $derived(chipAt(t));
	const spanFill = $derived(lit < 0 ? 0 : Math.min(1, Math.max(0, (t - CHIPS[lit].from) / (CHIPS[lit].to - CHIPS[lit].from))));
	const fading = $derived(!reduced && t >= LOOP - 0.5);
	void phaseAt;
</script>

<div class="hw" bind:this={box} bind:clientWidth={width}>
	<div class="hw-frame" class:hw-fade={fading}>
		<WindowBar crumbs={['Rollouts', APP, 'staging']} {narrow} keep={2} />
		<div class="hw-body" inert>
			{#if row && who}
				<AppHeader app={APP} {who} {lane} {cur} {hrefFor} />
				<div class="flex flex-col gap-4 px-4 pb-4 pt-4 sm:px-6 sm:pb-6">
					<StatementBanner open={failed} severity="failed" title="Deployment failed" check={stmt.check} place={{ label: 'staging', theme: envTheme('staging') }} since={stmt.since} build={stmt.build}
						primary={{ label: stmt.undo, icon: UndoOutline, key: 'rollback', onclick: noop }} />
					<div class="grid min-w-0 gap-4" class:hw-two={wide}>
						{#if !narrow}<div class="min-w-0"><Slipway {row} nested compact action={null} /></div>{/if}
						<div class="min-w-0"><HealthChecksCard healthChecks={checks as never} {windowStart} /></div>
					</div>
				</div>
			{/if}
		</div>
		<Pointer x={ptr.x} y={ptr.y} on={ptrShown && ch.visible} press={ch.press} />
	</div>
	<ChipBar chips={CHIPS} {lit} fill={spanFill} {reduced} {playing} {narrow} {onseek} {ontoggle} />
</div>

<style>
	.hw { position: relative; width: 100%; height: 100%; }
	.hw-frame { position: relative; height: 100%; overflow: hidden; border-radius: inherit; background: var(--k-ground); transition: opacity 0.4s ease; }
	.hw-fade { opacity: 0.0; }
	.hw-body { height: calc(100% - 44px); overflow: hidden; }
	.hw-two { grid-template-columns: minmax(0, 1fr) 340px; align-items: start; }
</style>
