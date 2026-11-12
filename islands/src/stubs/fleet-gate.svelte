<script lang="ts">
	/**
	 * NAMED STUB for the dashboard's FleetGate (lib/components/new/FleetGate.svelte). The product's gate assembles a FleetSource from its own queries
	 * (rollouts list, changes, health checks, GitHub status, a real-clock `now`) and installs it. In the islands the world is installed by the island
	 * itself (shared/world.ts setPart), and the list query is answered FROM that installed source (stubs/svelte-query): since 07348479 the rollout
	 * detail mounts the gate `bare` (for approvalAskAt), so each install re-derived the next one (effect_update_depth_exceeded) and would have swapped
	 * the story's world for one with the real clock. Here the gate IS the installed source: children render, told it is ready once one is installed.
	 */
	import type { Snippet } from 'svelte';
	import { liveSource } from '$lib/components/home/sketch/fleet-source.svelte';
	let { children }: { subject?: string; bare?: boolean; children: Snippet<[boolean]> } = $props();
	const ready = $derived(!!liveSource());
</script>

{@render children(ready)}
