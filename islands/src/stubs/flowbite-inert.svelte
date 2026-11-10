<script lang="ts">
	// SPIKE stub: flowbite's overlay widgets (Modal, Popover, Toggle, Spinner...) render nothing in an island: no dialogs open on the landing.
	let { children, open = false }: { children?: import('svelte').Snippet; open?: boolean } = $props();
</script>
{#if open && children}{@render children()}{/if}
