import { test, expect } from 'vitest';
import { installLiveSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { rowsOf, apps } from '$lib/components/new/data';
test('data layer loads with an empty source', () => {
	installLiveSource({ rollouts: [], environments: [], rolloutDependencies: { items: [] }, kustomizations: [], kruiseRollouts: [], changes: [], changesState: 'ok', healthChecks: [], github: { configured: true, connected: true }, me: 'you', now: new Date('2026-11-10T10:00:00Z') });
	expect(apps('incident').items.length).toBe(0);
});
