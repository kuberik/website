<svelte:options runes={true} />
<script lang="ts">
	/* a section island's root: its scope (page + query answers, shared/scope.ts) for every dashboard component below, then the component itself */
	import type { Component } from 'svelte';
	import { provideScope, type Scope } from './scope';
	let { scope, C, props = {} }: { scope: Scope; C: Component<any>; props?: Record<string, unknown> } = $props();
	// svelte-ignore state_referenced_locally
	provideScope(scope);
</script>
<C {...props} />
