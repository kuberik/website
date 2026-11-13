<script lang="ts">
	// scene lane 5: the App page as the product routes it since #142: the real apps/[name] layout (its Overview | Pipeline tab strip, through the ShellChrome
	// context, as RolloutShell does for the rollout tabs) around the real AppDetail, on its Overview (the release, NEW) or its Pipeline tab (every site).
	import Layout from '$lib/../routes/apps/[name]/+layout.svelte';
	import AppDetail from '$lib/components/new/app/AppDetail.svelte';
	import { provideShellChrome } from '$lib/shell-chrome.svelte';
	let { state, name, tab = 'overview' }: { state: any; name: string; tab?: 'overview' | 'progress' } = $props();
	const chrome = provideShellChrome();
</script>
{#if chrome.tabStrip}{@render chrome.tabStrip()}{/if}
<Layout>
	{#snippet children()}<AppDetail {state} {name} {tab} />{/snippet}
</Layout>
