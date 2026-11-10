// Stub for components/atoms/atoms-live.svelte.ts. The real one reads the mock fixture's progress map and ticks a clock;
// islands carry their own scripted data, so "no live progress" is the honest answer.
export const liveProgress = (): Map<string, { fraction: number; words: string | null }> | undefined => undefined;
