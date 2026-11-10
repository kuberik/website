<svelte:options runes={true} />
<script lang="ts">
	/**
	 * HERO WINDOW (SPEC 2.2). ROLE: the front page's one product frame: the app page's header and its opened place, with the confirm that
	 * asks a person. REFERENCE REGIONS: /apps/checkout-api (`components/new/app/AppDetail.svelte` header: glyph, 24 name, 20 mono build, the
	 * tab's pill, commit line, PromotionLane strip) over `Slipway` (the opened place row), `ApprovalLayer` (the one approve confirm and toast).
	 * Every drawn part is the dashboard's component, fed by `installLiveSource()` with the CRs of scenario.ts; this file only places them.
	 * NEW BY DESIGN: (1) the window top bar (the dashboard's Navbar is a route chrome tied to its router and queries, so the bar is drawn from
	 * the same classes), (2) the pointer, (3) the chip bar: the Railway tab bar, the story's seek and pause control (WCAG 2.2.2).
	 */
	import AppGlyph from '$lib/components/AppGlyph.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Chip from '$lib/components/Chip.svelte';
	import PromotionLane from '$lib/components/PromotionLane.svelte';
	import Slipway from '$lib/components/new/Slipway.svelte';
	import ApprovalLayer from '$lib/components/new/ApprovalLayer.svelte';
	import { approvalUi } from '$lib/components/new/approvals.svelte';
	import { CodeBranchOutline, ClockOutline } from 'flowbite-svelte-icons';
	import { DEMO_AVATAR_DATA_URI } from '$lib/demo/demo-avatar';
	import { avatarSrc, type TRow } from '$lib/components/new/data';
	import { VIEWER } from '$lib/components/new/rollout-view';
	import { tick, untrack } from 'svelte';
	import { APP } from './scenario';
	import { CHIPS, chipAt, focusRow, identityOf, laneFor, actionOf, targetOf, LOOP } from './model';
	import { choreoAt } from './choreo';

	let { t, playing, reduced, onseek, ontoggle }: { t: number; playing: boolean; reduced: boolean; onseek: (chip: number) => void; ontoggle: () => void } = $props();

	let box: HTMLElement | undefined = $state();
	let width = $state(1120);
	const narrow = $derived(width < 640);
	const compactPipe = $derived(width < 560);

	/* what the dashboard's own view-model says at this instant (the source was installed before `t` changed) */
	const row = $derived(t >= 0 ? (focusRow(t) as TRow | null) : null);
	const who = $derived(row ? identityOf(row) : null);
	const lane = $derived(t >= 0 ? laneFor() : null);
	const cur = $derived.by(() => { const h = (row?.href ?? '').split('/').filter(Boolean); return h[0] === 'rollouts' ? { ns: h[2], name: h[3] } : null; });
	const act = $derived(row ? actionOf(row) : null);
	const hrefFor = (n: { card: unknown }) => (n.card as { href?: string }).href ?? '';

	/* the two presses (pure function of t) */
	const ch = $derived(reduced ? { target: null, visible: false, press: false, ask: false, done: false } : choreoAt(t));
	let ptr = $state({ x: 0, y: 0 });
	let ptrShown = $state(false);
	function rel(el: Element | null) {
		const b = box?.getBoundingClientRect(), r = el?.getBoundingClientRect();
		return b && r ? { top: r.top - b.top, left: r.left - b.left, right: r.right - b.left, bottom: r.bottom - b.top, w: r.width, h: r.height } : null;
	}
	/** one step of the choreography per change of target / ask: measure the real buttons, then point at them */
	$effect(() => {
		const { target, ask, visible, done } = ch;
		untrack(() => {
			if (ask && !approvalUi.ask && row) {
				const tg = targetOf(row);
				const a = rel(box?.querySelector('[data-approve-open]') ?? null);
				if (tg && a) approvalUi.ask = { target: tg, anchor: { top: a.top, left: a.left, right: a.right, bottom: a.bottom } };
			}
			if (!ask && approvalUi.ask) approvalUi.ask = null;
			if (done && !approvalUi.done && row) { const tg = targetOf(row) ?? lastTarget; if (tg) approvalUi.done = { target: tg, error: null }; }
			if (!done && approvalUi.done) approvalUi.done = null;
		});
		(async () => {
			await tick();
			const el = target === 'approve' ? box?.querySelector('[data-approve-open]') : target === 'confirm' ? box?.querySelector('[data-action="approve-confirm"]') : null;
			const a = rel(el ?? null);
			if (visible && a) { ptr = { x: a.left + a.w * 0.62, y: a.top + a.h * 0.6 }; ptrShown = true; }
			else if (visible && !ptrShown && box) { ptr = { x: box.clientWidth - 60, y: box.clientHeight - 50 }; ptrShown = true; }
			if (!visible) ptrShown = false;
		})();
	});
	let lastTarget: ReturnType<typeof targetOf> | null = null;
	$effect(() => { if (row?.group === 'approval') lastTarget = targetOf(row); });

	const lit = $derived(chipAt(t));
	const spanFill = $derived(lit < 0 ? 0 : Math.min(1, Math.max(0, (t - CHIPS[lit].from) / (CHIPS[lit].to - CHIPS[lit].from))));
	const fading = $derived(!reduced && t >= LOOP - 0.5);
</script>

<div class="hw" bind:this={box} bind:clientWidth={width} class:hw-narrow={narrow}>
	<div class="hw-frame" class:hw-fade={fading}>
		<!-- the window's own top bar: the product's header row (mark, breadcrumb, the viewer) -->
		<div class="hw-bar t-ui-sm text-fg-muted">
			<span class="hw-mark" aria-hidden="true"></span>
			{#if !narrow}<span>Apps</span><span class="text-fg-disabled" aria-hidden="true">/</span>{/if}
			<span class="text-fg">{APP}</span>
			<Avatar name={VIEWER} src={DEMO_AVATAR_DATA_URI} size={20} class="ml-auto" />
		</div>

		<div class="hw-body" inert>
			{#if row && who}
				<header class="flex min-w-0 flex-col gap-3 px-4 pt-4 sm:px-6 sm:pt-5">
					<div class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
						<AppGlyph name={APP} size={narrow ? 24 : 24} />
						<h1 class="t-title min-w-0 break-words text-fg">{APP}</h1>
						<span class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 max-sm:basis-full">
							<span class="t-meta text-fg-disabled max-sm:hidden" aria-hidden="true">/</span>
							<span class="t-code-lg shrink-0 text-fg" data-hero-build>{who.build}</span>
							{#if who.pill}<Chip role={who.pill.role as never} label={who.pill.word.toLowerCase()} class="shrink-0" />{/if}
						</span>
					</div>
					{#if who.commit}
						<div class="t-meta flex min-w-0 items-center gap-x-3 text-fg-muted" data-hero-commit>
							<span class="flex min-w-0 items-center gap-2">
								{#if who.commit.who}<Avatar name={who.commit.who} src={avatarSrc(who.commit.who)} size={16} class="shrink-0" /><span class="shrink-0 whitespace-nowrap">{who.commit.who}</span>{/if}
								<CodeBranchOutline class="h-3.5 w-3.5 shrink-0 text-fg-disabled max-sm:hidden" aria-hidden="true" /><span class="min-w-0 truncate text-fg-subtle max-sm:hidden">{who.commit.title}</span>
							</span>
							{#if who.age}<span class="inline-flex shrink-0 items-center gap-2 whitespace-nowrap tabular-nums text-fg-subtle"><ClockOutline class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{who.age} ago</span>{/if}
						</div>
					{/if}
					{#if lane}
						<div class="min-w-0" data-hero-strip><PromotionLane {lane} showApp={false} words yours={!!row.needsYou} mutedRest {hrefFor} current={cur} youAreHere /></div>
					{/if}
				</header>
				<div class="px-4 pb-4 pt-4 sm:px-6 sm:pb-6">
					<Slipway {row} nested compact={compactPipe} action={act} />
				</div>
			{/if}
		</div>

		<ApprovalLayer />
		<span class="hw-ptr" class:hw-ptr-on={ptrShown && ch.visible} class:hw-ptr-press={ch.press} style="transform: translate({ptr.x}px, {ptr.y}px)" aria-hidden="true">
			<svg width="22" height="26" viewBox="0 0 22 26"><path d="M3 2l15 11.4-6.4 1.1 3.6 7.2-3.1 1.5-3.6-7.2L3 20z" fill="#121a20" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" /></svg>
			<i class="hw-ring"></i>
		</span>
	</div>

	<nav class="hw-chips t-label" aria-label="Demo timeline">
		{#each CHIPS as c, i (c.key)}
			<button type="button" class="hw-chip" class:hw-chip-on={lit === i} aria-current={lit === i ? 'step' : undefined} aria-label={`Demo: seek to ${c.label}`} onclick={() => onseek(i)}>
				<span class="hw-chip-dot" aria-hidden="true"></span><span class="hw-chip-t">{c.label}</span>
				{#if lit === i && !reduced}<i class="hw-chip-fill" style="transform: scaleX({spanFill})"></i>{/if}
			</button>
		{/each}
		{#if !reduced}
			<button type="button" class="hw-play" aria-label={playing ? 'Pause demo' : 'Play demo'} aria-pressed={!playing} onclick={ontoggle}>
				{#if playing}<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 2h2.5v10H3.5zM8 2h2.5v10H8z" fill="currentColor" /></svg>{:else}<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 2l8 5-8 5z" fill="currentColor" /></svg>{/if}
			</button>
		{/if}
	</nav>
</div>

<style>
	.hw { position: relative; width: 100%; height: 100%; }
	.hw-frame { position: relative; height: 100%; overflow: hidden; border-radius: inherit; background: var(--k-ground); transition: opacity 0.4s ease; }
	.hw-fade { opacity: 0.0; }
	.hw-bar { display: flex; align-items: center; gap: 8px; height: 44px; padding: 0 16px; border-bottom: 1px solid var(--k-line); background: var(--k-surface, transparent); }
	@media (min-width: 640px) { .hw-bar { padding: 0 24px; } }
	.hw-mark { width: 18px; height: 18px; border-radius: 5px; background: linear-gradient(135deg, #00c9b5, #00b2c2); margin-right: 4px; }
	.hw-body { height: calc(100% - 44px); overflow: hidden; }
	.hw-ptr { position: absolute; left: 0; top: 0; z-index: 90; width: 22px; height: 26px; margin: -3px 0 0 -4px; opacity: 0; pointer-events: none; transition: transform 0.6s cubic-bezier(0.22, 0.8, 0.3, 1), opacity 0.3s ease; filter: drop-shadow(0 2px 3px rgba(18, 26, 32, 0.3)); }
	.hw-ptr-on { opacity: 1; }
	.hw-ring { position: absolute; left: 1px; top: 1px; width: 26px; height: 26px; margin: -13px 0 0 -13px; border-radius: 50%; border: 2px solid var(--k-blue-solid, #2563eb); opacity: 0; transform: scale(0.4); }
	.hw-ptr-press .hw-ring { animation: hw-press 0.28s ease-out; }
	@keyframes hw-press { 0% { opacity: 0.9; transform: scale(0.4); } 100% { opacity: 0; transform: scale(1.5); } }

	.hw-chips { position: absolute; left: 50%; bottom: -22px; z-index: 5; display: flex; align-items: center; gap: 2px; padding: 4px; height: 44px; max-width: calc(100% - 16px); overflow-x: auto; scrollbar-width: none; transform: translateX(-50%); background: var(--k-surface, #fff); border: 1px solid var(--k-line); border-radius: 12px; box-shadow: 0 8px 24px -8px rgba(18, 26, 32, 0.18); }
	.hw-narrow .hw-chips { position: relative; left: 0; bottom: auto; margin: 12px auto 0; transform: none; width: max-content; }
	.hw-chip { position: relative; display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 12px; border-radius: 8px; color: var(--k-fg-muted); font-size: 14px; font-weight: 500; white-space: nowrap; background: transparent; border: 0; cursor: pointer; }
	.hw-chip:hover, .hw-chip:focus-visible { color: var(--k-fg); background: var(--k-ground); outline-offset: -2px; }
	.hw-chip-on { color: var(--k-fg); }
	.hw-chip-dot { display: none; width: 8px; height: 8px; border-radius: 50%; background: currentColor; opacity: 0.45; }
	.hw-chip-fill { position: absolute; left: 10px; right: 10px; bottom: 2px; height: 2px; border-radius: 1px; background: #00c9b5; transform-origin: left; }
	.hw-play { margin-left: 2px; width: 34px; height: 34px; display: inline-grid; place-items: center; border-radius: 8px; color: var(--k-fg-muted); background: transparent; border: 0; border-left: 1px solid var(--k-line); border-radius: 0 8px 8px 0; cursor: pointer; }
	.hw-play:hover { color: var(--k-fg); }
	.hw-narrow .hw-chip { padding: 0 10px; font-size: 13px; }
	.hw-narrow .hw-chip:not(.hw-chip-on) .hw-chip-t { display: none; }
	.hw-narrow .hw-chip:not(.hw-chip-on) .hw-chip-dot { display: inline-block; }
</style>
