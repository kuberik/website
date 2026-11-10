<svelte:options runes={true} />
<script lang="ts">
	/**
	 * The film's chrome: NEW BY DESIGN (STORYBOARD section 2). Role: the story's progress, seek and pause control, a real wall clock and a tally. No product
	 * component plays this role (the dashboard has no timeline). It borrows Railway's chapter bar (measured: 5 tabs, a sweeping fill, overlapping the frame edge by ~19 px)
	 * and the dashboard's own type roles (t-label, t-meta, t-code) and chip family. It sits above the window's top edge, so it is above the fold at 1440 x 900. ONE panel: clock left, the chapter tabs in the middle (the lit tab FILLS with its progress, as Railway's does), tally right; the side cells are equal fixed shares so the tabs never shift as the tally grows. Under reduced motion there is no autoplay and no pause: the tabs are a plain segmented control.
	 */
	import { CHAPTERS } from './script';
	import { clockFace } from './clock';
	let { t, lit, fill, reduced, playing, narrow, tally, onseek, ontoggle }: {
		t: number; lit: number; fill: number; reduced: boolean; playing: boolean; narrow: boolean;
		tally: { passed: number; failed: number; people: number }; onseek: (i: number) => void; ontoggle: () => void;
	} = $props();
	const face = $derived(clockFace(t));
	/* the digit rolls (200 ms ease-out): a keyed span re-enters on every change */
	const bits = $derived([
		{ k: 'p', n: tally.passed, word: 'checks passed', show: true },
		{ k: 'f', n: tally.failed, word: 'failed', show: tally.failed > 0 },
		{ k: 'h', n: tally.people, word: narrow ? '' : 'by a person', show: tally.people > 0 && !narrow }
	].filter((b) => b.show));
	let scroller: HTMLElement | undefined = $state();
	$effect(() => {
		if (!narrow || !scroller) return;
		const el = scroller.children[lit] as HTMLElement | undefined;
		if (el) scroller.scrollTo({ left: el.offsetLeft - 8, behavior: reduced ? 'auto' : 'smooth' });
	});
</script>
<div class="fc" class:fc-narrow={narrow}>
	<div class="fc-panel">
		<span class="fc-clock t-code" aria-label="Story time" title="Story time (a time-lapse)">{face}</span>
		<nav class="fc-bar t-label" aria-label="Demo chapters">
			<div class="fc-scroll" bind:this={scroller}>
				{#each CHAPTERS as c, i (c.key)}
					<button type="button" class="fc-tab" class:fc-on={lit === i} aria-current={lit === i ? 'step' : undefined} aria-label={`Demo: ${c.label}`} onclick={() => onseek(i)}>
						{#if lit === i && !reduced}<i class="fc-fill" style="transform: scaleX({fill})"></i>{/if}
						<span class="fc-dot" aria-hidden="true"></span><span class="fc-lab">{c.label}</span>
					</button>
				{/each}
			</div>
			{#if !reduced}
				<button type="button" class="fc-play" aria-label={playing ? 'Pause demo' : 'Play demo'} aria-pressed={!playing} onclick={ontoggle}>
					{#if playing}<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 2h2.5v10H3.5zM8 2h2.5v10H8z" fill="currentColor" /></svg>{:else}<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 2l8 5-8 5z" fill="currentColor" /></svg>{/if}
				</button>
			{/if}
		</nav>
		<span class="fc-tally t-meta" aria-live="off">
			{#each bits as b (b.k)}<span class="fc-bit" class:fc-bad={b.k === 'f'}>{#key b.n}<b class="fc-n">{b.n}</b>{/key} {b.word}</span>{/each}
		</span>
	</div>
</div>
<style>
	.fc { position: absolute; left: 0; right: 0; top: -56px; z-index: 6; height: 44px; display: flex; justify-content: center; pointer-events: none; }
	.fc-panel { pointer-events: auto; width: min(calc(100% - 40px), 1040px); height: 44px; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 12px; padding: 4px 4px 4px 14px; box-sizing: border-box; background: var(--k-surface, #fff); border: 1px solid var(--k-line); border-radius: 12px; box-shadow: 0 6px 20px rgba(14, 20, 24, 0.08); }
	.fc-clock { justify-self: start; display: inline-flex; align-items: center; color: var(--ink-muted, var(--k-fg-muted)); font-variant-numeric: tabular-nums; font-size: 14px; }
	.fc-tally { justify-self: end; display: inline-flex; align-items: center; gap: 0; padding-right: 10px; color: var(--k-fg-muted); font-size: 13px; white-space: nowrap; }
	.fc-bit + .fc-bit::before { content: '\00b7'; margin: 0 8px; color: var(--k-fg-muted); }
	.fc-n { color: var(--k-fg); font-weight: 600; font-variant-numeric: tabular-nums; display: inline-block; animation: fc-roll 0.2s ease-out; }
	.fc-bad .fc-n, .fc-bad { color: var(--k-red-fg, #c2362b); }
	@keyframes fc-roll { from { transform: translateY(8px); opacity: 0; } to { transform: none; opacity: 1; } }
	.fc-bar { display: flex; align-items: center; gap: 2px; min-width: 0; max-width: 100%; }
	.fc-scroll { display: flex; align-items: center; gap: 2px; min-width: 0; overflow-x: auto; scrollbar-width: none; }
	.fc-scroll::-webkit-scrollbar { display: none; }
	.fc-tab { position: relative; overflow: hidden; display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 12px; border-radius: 8px; color: var(--k-fg-muted); font-size: 14px; font-weight: 500; white-space: nowrap; background: transparent; border: 0; cursor: pointer; }
	.fc-tab > :not(.fc-fill) { position: relative; }
	.fc-tab:hover, .fc-tab:focus-visible { color: var(--k-fg); background: var(--k-ground); outline-offset: -2px; }
	.fc-on { color: var(--k-fg); background: color-mix(in srgb, var(--k-ground) 70%, transparent); }
	.fc-dot { display: none; width: 8px; height: 8px; border-radius: 50%; background: currentColor; opacity: 0.45; }
	/* the lit tab fills with the chapter's progress (Railway's bar), not a 2 px underline */
	.fc-fill { position: absolute; inset: 0; border-radius: 8px; background: color-mix(in srgb, #00c9b5 22%, transparent); transform-origin: left; }
	.fc-play { margin-left: 2px; width: 34px; height: 34px; flex: none; display: inline-grid; place-items: center; color: var(--k-fg-muted); background: transparent; border: 0; border-left: 1px solid var(--k-line); border-radius: 0 8px 8px 0; cursor: pointer; }
	.fc-play:hover { color: var(--k-fg); }
	/* phone (STORYBOARD section 6): the same panel on two rows: clock and tally on one line, the tabs below; the lit chapter keeps its label, the others are dots */
	.fc-narrow { top: -70px; height: 92px; }
	.fc-narrow .fc-panel { height: 92px; width: calc(100% - 8px); grid-template-columns: minmax(0, 1fr) auto; grid-template-rows: 28px 44px; gap: 4px 8px; padding: 6px 4px 4px 10px; align-content: start; }
	.fc-narrow .fc-tally { padding-right: 6px; }
	.fc-narrow .fc-bar { grid-row: 2; grid-column: 1 / span 2; }
	.fc-narrow .fc-scroll { flex: 1 1 auto; }
	.fc-narrow .fc-tab { height: 36px; padding: 0 10px; }
	.fc-narrow .fc-tab:not(.fc-on) .fc-lab { display: none; }
	.fc-narrow .fc-tab:not(.fc-on) .fc-dot { display: inline-block; }
	.fc-narrow .fc-play { width: 44px; height: 36px; }
	/* tablet widths: no room for three cells in a row */
	@media (max-width: 1100px) { .fc:not(.fc-narrow) .fc-panel { grid-template-columns: auto minmax(0, 1fr) auto; } .fc:not(.fc-narrow) .fc-bar { justify-self: center; } }
</style>
