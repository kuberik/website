import type { Component } from 'svelte';
import type { Beat } from './timeline';

/** An island = a real dashboard component + the scripted states that drive its props (timeline-driven, simple). */
export type IslandDef<P extends Record<string, any>> = {
	component: Component<P>;
	initial: P;
	beats: Beat<P>[];
	/** beat shown when motion is reduced */
	representative: number;
	restMs?: number;
};

/** An island that runs its own clock and mounts itself (hero, story sections): the runtime hands it the shadow wrapper and the three gates. */
export type Gate = 'onscreen' | 'visible' | 'motion';
export type CustomCtx = { wrap: HTMLElement; host: HTMLElement; onGate: (cb: (gate: Gate, open: boolean) => void) => void };
export type CustomIsland = { custom: (ctx: CustomCtx) => void | (() => void) };
export type IslandModule = IslandDef<any> | CustomIsland;

/** Every island is a dynamic import: its component graph is its own chunk, fetched only when the loader (loader.ts) decides it is near. */
export const registry: Record<string, () => Promise<IslandModule>> = {
	hero: () => import('./islands/film').then((m) => ({ custom: m.mountFilm })),
	...Object.fromEntries(['home', 'rollouts', 'apps', 'environments', 'changes', 'app-detail', 'env-detail', 'change-detail', 'activity', 'dependencies'].map((k) => [`surface-${k}`, () => import('./islands/surfaces/mount').then((m) => ({ custom: m.mountSurface(k) }))])),
	'surface-change-route': () => import('./islands/surfaces/mount').then((m) => ({ custom: m.mountChangeRoute() })),
	...Object.fromEntries(['overview-pending', 'overview-running', 'overview-passed', 'rollback', 'gates', 'history', 'bake', 'stage2', 'recovered-baking', 'recovered', 'replay'].map((k) => [`surface-rollout-${k}`, () => import('./islands/surfaces/mount').then((m) => ({ custom: m.mountRollout(k) }))])),
	'rollouts-list': async () => {
		const [c, s] = await Promise.all([import('./islands/rollouts-list/RolloutsList.svelte'), import('./islands/rollouts-list/story')]);
		return { component: c.default, initial: s.initial, beats: s.beats, representative: s.representative, restMs: 3200 };
	}
};
