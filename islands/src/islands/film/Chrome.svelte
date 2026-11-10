<svelte:options runes={true} />
<script lang="ts">
	/**
	 * The film's chrome: NEW BY DESIGN (STORYBOARD section 2). Role: the story's progress, seek and pause control, a real wall clock and a tally. No product
	 * component plays this role (the dashboard has no timeline). It borrows Railway's chapter bar (measured: 5 tabs, a sweeping fill, overlapping the frame edge by ~19 px)
	 * and the dashboard's own type roles (t-label, t-meta, t-code) and chip family. It sits on the window's TOP edge (36 px, overlapping 18 px), so it is above the fold
	 * at 1440 x 900. Clock left, tally right, the bar between them. Under reduced motion there is no autoplay and no pause: the tabs are a plain segmented control.
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
	<span class="fc-clock t-code" aria-label="Story time" title="Story time (a time-lapse)">{face}</span>
	<nav class="fc-bar t-label" aria-label="Demo chapters">
		<div class="fc-scroll" bind:this={scroller}>
			{#each CHAPTERS as c, i (c.key)}
				<button type="button" class="fc-tab" class:fc-on={lit === i} aria-current={lit === i ? 'step' : undefined} aria-label={`Demo: ${c.label}`} onclick={() => onseek(i)}>
					<span class="fc-dot" aria-hidden="true"></span><span class="fc-lab">{c.label}</span>
					{#if lit === i && !reduced}<i class="fc-fill" style="transform: scaleX({fill})"></i>{/if}
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
		{#each bits as b, i (b.k)}{#if i > 0}<span class="fc-sep" aria-hidden="true"> · </span>{/if}<span class="fc-bit" class:fc-bad={b.k === 'f'}>{#key b.n}<b class="fc-n">{b.n}</b>{/key} {b.word}</span>{/each}
	</span>
</div>
<style>
	.fc { position: absolute; left: 0; right: 0; top: -56px; z-index: 6; height: 44px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 16px; pointer-events: none; }
	.fc > * { pointer-events: auto; }
	.fc-clock { justify-self: start; margin-left: 20px; padding: 0 10px; height: 28px; display: inline-flex; align-items: center; border-radius: 8px; color: var(--ink-muted, var(--k-fg-muted)); background: color-mix(in srgb, var(--k-surface, #fff) 78%, transparent); font-variant-numeric: tabular-nums; font-size: 14px; }
	.fc-tally { justify-self: end; margin-right: 20px; padding: 0 12px; height: 28px; display: inline-flex; align-items: center; border-radius: 8px; color: var(--k-fg-muted); background: color-mix(in srgb, var(--k-surface, #fff) 78%, transparent); font-size: 13px; white-space: nowrap; }
	.fc-n { color: var(--k-fg); font-weight: 600; font-variant-numeric: tabular-nums; display: inline-block; animation: fc-roll 0.2s ease-out; }
	.fc-bad .fc-n, .fc-bad { color: var(--k-red-fg, #c2362b); }
	@keyframes fc-roll { from { transform: translateY(8px); opacity: 0; } to { transform: none; opacity: 1; } }
	.fc-bar { display: flex; align-items: center; gap: 2px; padding: 4px; height: 44px; max-width: 100%; background: var(--k-surface, #fff); border: 1px solid var(--k-line); border-radius: 12px; box-shadow: 0 6px 20px rgba(14, 20, 24, 0.08); }
	.fc-scroll { display: flex; align-items: center; gap: 2px; min-width: 0; overflow-x: auto; scrollbar-width: none; }
	.fc-scroll::-webkit-scrollbar { display: none; }
	.fc-tab { position: relative; display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 12px; border-radius: 8px; color: var(--k-fg-muted); font-size: 14px; font-weight: 500; white-space: nowrap; background: transparent; border: 0; cursor: pointer; }
	.fc-tab:hover, .fc-tab:focus-visible { color: var(--k-fg); background: var(--k-ground); outline-offset: -2px; }
	.fc-on { color: var(--k-fg); }
	.fc-dot { display: none; width: 8px; height: 8px; border-radius: 50%; background: currentColor; opacity: 0.45; }
	.fc-fill { position: absolute; left: 10px; right: 10px; bottom: 2px; height: 2px; border-radius: 1px; background: #00c9b5; transform-origin: left; }
	.fc-play { margin-left: 2px; width: 34px; height: 34px; flex: none; display: inline-grid; place-items: center; color: var(--k-fg-muted); background: transparent; border: 0; border-left: 1px solid var(--k-line); border-radius: 0 8px 8px 0; cursor: pointer; }
	.fc-play:hover { color: var(--k-fg); }
	/* phone (STORYBOARD section 6): clock and tally share one line above the bar; the bar scrolls, the lit chapter keeps its label, the others are dots */
	.fc-narrow { top: -70px; height: 92px; grid-template-columns: 1fr auto; grid-template-rows: 28px 44px; gap: 6px 8px; align-items: start; }
	.fc-narrow .fc-clock { margin-left: 8px; grid-row: 1; }
	.fc-narrow .fc-tally { margin-right: 8px; grid-row: 1; grid-column: 2; }
	.fc-narrow .fc-bar { grid-row: 2; grid-column: 1 / span 2; margin: 0 4px; }
	.fc-narrow .fc-scroll { flex: 1 1 auto; }
	.fc-narrow .fc-tab { height: 36px; padding: 0 10px; }
	.fc-narrow .fc-tab:not(.fc-on) .fc-lab { display: none; }
	.fc-narrow .fc-tab:not(.fc-on) .fc-dot { display: inline-block; }
	.fc-narrow .fc-play { width: 44px; height: 36px; }
</style>
