<svelte:options runes={true} />
<script lang="ts">
	/**
	 * Island "rollouts-list": the dashboard's own list card (ListCard) of its own strand rows (StrandRow ->
	 * MiniPipeline, StatusMark, Chip), the way /rollouts draws them. This file only does what Rollouts.svelte does
	 * around them (the group head `.lc-gh`, the keyed rows); every pixel inside a row is the product's component.
	 * Data comes from the timeline (props), never from an API.
	 */
	import ListCard from '$lib/components/new/ListCard.svelte';
	import StrandRow from '$lib/components/new/StrandRow.svelte';
	import type { StrandRow as Strand, RestRow } from '$lib/components/new/rollouts-page';

	let { moving, rest }: { moving: Strand[]; rest: RestRow[] } = $props();
</script>

<ListCard>
	<section class="lc-g" data-group="In flight">
		<div class="lc-gh"><span class="lc-gt">In flight</span><span class="lc-gn">{moving.length}</span></div>
		<ul class="lc-rows">{#each moving as r (r.key)}<StrandRow row={r} />{/each}</ul>
	</section>
	<section class="lc-g" data-group="At rest">
		<div class="lc-gh"><span class="lc-gt">At rest</span><span class="lc-gn">{rest.length}</span></div>
		<ul class="lc-rows">{#each rest as r (r.key)}<StrandRow rest={r} />{/each}</ul>
	</section>
</ListCard>
