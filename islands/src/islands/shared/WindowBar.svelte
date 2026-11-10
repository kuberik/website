<svelte:options runes={true} />
<script lang="ts">
	/** The window's own top bar: NEW BY DESIGN (SPEC 2.2). The dashboard's Navbar is route chrome tied to its router and queries, so the bar is drawn from the
	 *  same classes: mark, breadcrumb (the last crumb is the page), the viewer. `crumbs` beyond the last two drop on a phone. */
	import Avatar from '$lib/components/Avatar.svelte';
	import { DEMO_AVATAR_DATA_URI } from '$lib/demo/demo-avatar';
	import { VIEWER } from '$lib/components/new/rollout-view';
	let { crumbs, narrow, keep = 2 }: { crumbs: string[]; narrow: boolean; keep?: number } = $props();
	const shown = $derived(narrow ? crumbs.slice(-keep) : crumbs);
</script>
<div class="hw-bar t-ui-sm text-fg-muted">
	<span class="hw-mark" aria-hidden="true"></span>
	{#each shown as c, i (c)}
		{#if i > 0}<span class="text-fg-disabled" aria-hidden="true">/</span>{/if}
		<span class:text-fg={i === shown.length - 1}>{c}</span>
	{/each}
	<Avatar name={VIEWER} src={DEMO_AVATAR_DATA_URI} size={20} class="ml-auto" />
</div>
<style>
	.hw-bar { display: flex; align-items: center; gap: 8px; height: 44px; padding: 0 16px; border-bottom: 1px solid var(--k-line); background: var(--k-surface, transparent); }
	@media (min-width: 640px) { .hw-bar { padding: 0 24px; } }
	.hw-mark { width: 18px; height: 18px; border-radius: 5px; background: linear-gradient(135deg, #00c9b5, #00b2c2); margin-right: 4px; }
</style>
