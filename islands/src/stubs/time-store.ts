// Stub for $lib/stores/time (a wall-clock store that ticks every 100 ms). Components that print "3s ago" read it; on the landing the story has its
// own simulated clock, so the world (islands/shared/world.ts) drives it. Until a story has driven it, it follows the real clock.
import { writable } from 'svelte/store';
let driven = false;
const w = writable<Date>(new Date());
export const driveNow = (d: Date) => { driven = true; w.set(d); };
export const now = { subscribe: w.subscribe };
setInterval(() => { if (!driven) w.set(new Date()); }, 1000);

/** the story's now (the real clock until a story has driven it): the product's age formatters default to this */
let curNow: Date | null = null;
w.subscribe((d) => { curNow = d; });
export const storyDate = () => (driven && curNow ? new Date(curNow.getTime()) : new Date());
