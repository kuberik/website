<svelte:options runes={true} />
<script lang="ts">
	/**
	 * The scene's chapter bar (lineage: the film's Chrome, Railway's chapter tabs): the lit tab fills with its chapter's progress, a tab is a SEEK
	 * (pressing the lit one never seeks), and play/pause. No clock and no tally: the scene is one object, the panel under the strip says what happens.
	 * Sits above the window's top edge (top -56 px), where the film's bar and the static poster's bar sit.
	 */
	let { chapters, lit, fill, reduced, playing, narrow, onseek, ontoggle }: {
		chapters: { key: string; label: string }[]; lit: number; fill: number; reduced: boolean; playing: boolean; narrow: boolean;
		onseek: (i: number) => void; ontoggle: () => void;
	} = $props();
	let scroller: HTMLElement | undefined = $state();
	$effect(() => {
		if (!narrow || !scroller) return;
		const el = scroller.children[lit] as HTMLElement | undefined;
		if (!el) return;
		const sr = scroller.getBoundingClientRect(), er = el.getBoundingClientRect();
		const ideal = scroller.scrollLeft + er.left - sr.left - (sr.width - er.width) / 2;
		scroller.scrollTo({ left: Math.max(0, ideal), behavior: reduced ? 'auto' : 'smooth' });
	});
</script>
<div class="fc" class:fc-narrow={narrow}>
	<nav class="fc-panel t-label" aria-label="Demo chapters">
		<div class="fc-scroll" bind:this={scroller}>
			{#each chapters as c, i (c.key)}
				<button type="button" class="fc-tab" class:fc-on={lit === i} aria-current={lit === i ? 'step' : undefined} aria-label={`Demo: ${c.label}`} onclick={() => { if (lit !== i) onseek(i); }}>
					{#if lit === i && !reduced}<i class="fc-fill" style="transform: scaleX({fill})"></i>{/if}
					<span class="fc-dot" aria-hidden="true"></span><span class="fc-lab">{c.label}</span>
				</button>
			{/each}
		</div>
		{#if !reduced}
			<button type="button" class="fc-play" aria-label={playing ? 'Pause demo' : 'Play demo'} onclick={ontoggle}>
				{#if playing}<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 2h2.5v10H3.5zM8 2h2.5v10H8z" fill="currentColor" /></svg>{:else}<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 2l8 5-8 5z" fill="currentColor" /></svg>{/if}
			</button>
		{/if}
	</nav>
</div>
<style>
	.fc { position: absolute; left: 0; right: 0; top: -56px; z-index: 6; height: 44px; display: flex; justify-content: center; pointer-events: none; }
	.fc-panel { pointer-events: auto; max-width: calc(100% - 24px); height: 44px; display: flex; align-items: center; gap: 2px; padding: 4px; box-sizing: border-box; background: var(--k-surface, #fff); border: 1px solid var(--k-line); border-radius: 12px; box-shadow: 0 6px 20px rgba(14, 20, 24, 0.08); }
	.fc-scroll { display: flex; align-items: center; gap: 2px; min-width: 0; overflow-x: auto; scrollbar-width: none; }
	.fc-scroll::-webkit-scrollbar { display: none; }
	.fc-tab { flex: none; position: relative; overflow: hidden; display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 10px; border-radius: 8px; color: var(--k-fg-muted); font-size: 14px; font-weight: 500; white-space: nowrap; background: transparent; border: 0; cursor: pointer; }
	.fc-tab > :not(.fc-fill) { position: relative; }
	.fc-tab:hover, .fc-tab:focus-visible { color: var(--k-fg); background: var(--k-ground); outline-offset: -2px; }
	.fc-on { color: var(--k-fg); background: color-mix(in srgb, var(--k-ground) 70%, transparent); }
	.fc-dot { display: none; width: 8px; height: 8px; border-radius: 50%; background: currentColor; opacity: 0.45; }
	.fc-fill { position: absolute; inset: 0; border-radius: 8px; background: color-mix(in srgb, #00c9b5 22%, transparent); transform-origin: left; }
	.fc-play { margin-left: 2px; width: 34px; height: 34px; flex: none; display: inline-grid; place-items: center; color: var(--k-fg-muted); background: transparent; border: 0; border-left: 1px solid var(--k-line); border-radius: 0 8px 8px 0; cursor: pointer; }
	.fc-play:hover { color: var(--k-fg); }
	.fc-narrow { top: -60px; height: 48px; }
	.fc-narrow .fc-panel { height: 48px; padding: 0 0 0 4px; width: calc(100% - 24px); }
	.fc-narrow .fc-scroll { flex: 1 1 auto; }
	.fc-narrow .fc-tab { height: 44px; min-width: 44px; justify-content: center; padding: 0 6px; gap: 6px; border-radius: 10px; font-size: 13px; }
	.fc-narrow .fc-tab.fc-on { padding: 0 9px; }
	.fc-narrow .fc-tab:not(.fc-on) .fc-lab { display: none; }
	.fc-narrow .fc-tab:not(.fc-on) .fc-dot { display: inline-block; }
	.fc-narrow .fc-play { width: 44px; height: 44px; }
</style>
