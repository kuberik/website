<script lang="ts">
	// The real tab strip (+layout.svelte) around the real tab route, with no SvelteKit router: the active route is the `children` snippet and `Tab` is reactive,
	// so the product's own underline and body switch when the film moves between Overview / Gates / History.
	// The root layout normally provides the ShellChrome context and draws `chrome.tabStrip` above <main>; this shell does the same two things.
	import Layout from '$lib/../routes/rollouts/[cluster]/[namespace]/[name]/+layout.svelte';
	import { provideShellChrome } from '$lib/shell-chrome.svelte';
	import type { Component } from 'svelte';
	let { Tab }: { Tab: Component<any> } = $props();
	const chrome = provideShellChrome();
</script>
{#if chrome.tabStrip}{@render chrome.tabStrip()}{/if}
<Layout>
	{#snippet children()}{#if Tab}<Tab />{/if}{/snippet}
</Layout>
