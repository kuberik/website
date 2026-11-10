<script lang="ts">
	// STUB for flowbite-svelte's Modal: the dialog drawn in-window (the canvas is the viewport; `fixed` anchors to it). No focus trap, no portal, no Escape.
	// The product's own panel classes ride along (`cls`). On a phone canvas the product's dialog is a full-screen sheet (`max-sm:h-dvh max-sm:w-screen`, ChangeVersionModal):
	// those units answer the HOST page's viewport, so the sheet is sized here to the canvas instead (same result the product has on a phone: edge to edge, no radius).
	let { children, open = false, class: cls = '' }: { children?: import('svelte').Snippet; open?: boolean; class?: string } = $props();
</script>
{#if open && children}
	<div class="fm-scrim">
		<div class="fm-panel bg-surface border border-line rounded-md {cls}">{@render children()}</div>
	</div>
{/if}
<style>
	.fm-scrim { position: fixed; inset: 0; z-index: 50; display: flex; justify-content: center; align-items: center; padding: 24px 16px; background: var(--k-scrim, rgba(18, 26, 32, 0.45)); }
	.fm-panel { position: relative; width: 100%; max-width: 640px; margin: 0; overflow: hidden; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25); }
	@container kc (max-width: 639px) {
		.fm-scrim { padding: 0; align-items: stretch; }
		.fm-panel { max-width: none; width: 100%; height: 100%; max-height: none; border-radius: 0; border-width: 0; box-shadow: none; }
	}
</style>
