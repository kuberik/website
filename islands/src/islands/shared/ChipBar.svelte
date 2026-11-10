<svelte:options runes={true} />
<script lang="ts">
	/** The chip bar: NEW BY DESIGN (SPEC 2.2), Railway's tab bar overlapping the window's bottom edge. It is the story's progress, seek and pause control
	 *  (WCAG 2.2.2). Under reduced motion there is no autoplay and no pause: the chips are a plain segmented control that jumps to a settled frame. */
	let { chips, lit, fill, reduced, playing, narrow, onseek, ontoggle }: {
		chips: readonly { key: string; label: string }[]; lit: number; fill: number; reduced: boolean; playing: boolean; narrow: boolean;
		onseek: (chip: number) => void; ontoggle: () => void;
	} = $props();
</script>
<nav class="hw-chips t-label" class:hw-narrow={narrow} aria-label="Demo timeline">
	{#each chips as c, i (c.key)}
		<button type="button" class="hw-chip" class:hw-chip-on={lit === i} aria-current={lit === i ? 'step' : undefined} aria-label={`Demo: seek to ${c.label}`} onclick={() => onseek(i)}>
			<span class="hw-chip-dot" aria-hidden="true"></span><span class="hw-chip-t">{c.label}</span>
			{#if lit === i && !reduced}<i class="hw-chip-fill" style="transform: scaleX({fill})"></i>{/if}
		</button>
	{/each}
	{#if !reduced}
		<button type="button" class="hw-play" aria-label={playing ? 'Pause demo' : 'Play demo'} aria-pressed={!playing} onclick={ontoggle}>
			{#if playing}<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 2h2.5v10H3.5zM8 2h2.5v10H8z" fill="currentColor" /></svg>{:else}<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 2l8 5-8 5z" fill="currentColor" /></svg>{/if}
		</button>
	{/if}
</nav>
<style>
	.hw-chips { position: absolute; left: 50%; bottom: -22px; z-index: 5; display: flex; align-items: center; gap: 2px; padding: 4px; height: 44px; max-width: calc(100% - 16px); overflow-x: auto; scrollbar-width: none; transform: translateX(-50%); background: var(--k-surface, #fff); border: 1px solid var(--k-line); border-radius: 12px; box-shadow: 0 8px 24px -8px rgba(18, 26, 32, 0.18); }
	.hw-chips.hw-narrow { position: relative; left: 0; bottom: auto; margin: 12px auto 0; transform: none; width: max-content; }
	.hw-chip { position: relative; display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 12px; border-radius: 8px; color: var(--k-fg-muted); font-size: 14px; font-weight: 500; white-space: nowrap; background: transparent; border: 0; cursor: pointer; }
	.hw-chip:hover, .hw-chip:focus-visible { color: var(--k-fg); background: var(--k-ground); outline-offset: -2px; }
	.hw-chip-on { color: var(--k-fg); }
	.hw-chip-dot { display: none; width: 8px; height: 8px; border-radius: 50%; background: currentColor; opacity: 0.45; }
	.hw-chip-fill { position: absolute; left: 10px; right: 10px; bottom: 2px; height: 2px; border-radius: 1px; background: #00c9b5; transform-origin: left; }
	.hw-play { margin-left: 2px; width: 34px; height: 34px; display: inline-grid; place-items: center; color: var(--k-fg-muted); background: transparent; border: 0; border-left: 1px solid var(--k-line); border-radius: 0 8px 8px 0; cursor: pointer; }
	.hw-play:hover { color: var(--k-fg); }
	.hw-narrow .hw-chip { padding: 0 10px; font-size: 13px; }
	.hw-narrow .hw-chip:not(.hw-chip-on) .hw-chip-t { display: none; }
	.hw-narrow .hw-chip:not(.hw-chip-on) .hw-chip-dot { display: inline-block; }
</style>
