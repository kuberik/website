import type { Component } from 'svelte';
import type { Beat } from './timeline';
import RolloutsList from './islands/rollouts-list/RolloutsList.svelte';
import * as rollouts from './islands/rollouts-list/story';

/** An island = a real dashboard component + the scripted states that drive its props. */
export type IslandDef<P extends Record<string, any>> = {
	component: Component<P>;
	initial: P;
	beats: Beat<P>[];
	/** beat shown when motion is reduced */
	representative: number;
	restMs?: number;
};

export const registry: Record<string, IslandDef<any>> = {
	'rollouts-list': { component: RolloutsList, initial: rollouts.initial, beats: rollouts.beats, representative: rollouts.representative, restMs: 3200 } satisfies IslandDef<rollouts.State>
};
