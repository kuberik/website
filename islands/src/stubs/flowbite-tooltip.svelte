<svelte:options runes={true} />
<script lang="ts">
	/* Inert stand-in for flowbite-svelte's Tooltip (the real one drags tailwind-variants and the whole component kit into the bundle). A landing window is
	   never hovered into a tooltip: StatementBanner only draws it when it is handed `tooltips`, and the landing hands none. */
	let _: Record<string, unknown> = $props();
	void _;
</script>
