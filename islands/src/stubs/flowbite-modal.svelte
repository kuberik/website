<script lang="ts">
	// SPIKE stub (landing-v5 rollout-detail): flowbite Modal as an in-window dialog. `open` renders children in a panel over a scrim that is
	// absolutely positioned in the island wrapper (the page is a window on the landing, not the viewport). No focus trap, no portal, no Escape.
	let { children, open = false, class: cls = '' }: { children?: import('svelte').Snippet; open?: boolean; class?: string } = $props();
</script>
{#if open && children}
	<div style="position:fixed;inset:0;z-index:50;display:flex;justify-content:center;align-items:center;padding:24px 16px;background:var(--k-scrim, rgba(18,26,32,.45))">
		<div class="bg-surface border border-line rounded-md {cls}" style="position:relative;width:100%;max-width:640px;margin:0;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.25)">{@render children()}</div>
	</div>
{/if}
