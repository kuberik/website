// $app/state, inert by default but REACTIVE: the film moves `page.url` / `page.params` between surfaces, and the real shell (Sidebar's active item,
// the rollout tab strip's underline) reads them exactly as it reads SvelteKit's.
import { reactive } from '../reactive.svelte';
export const page = reactive<{ url: URL; params: Record<string, string>; route: { id: string }; status: number; error: null; data: Record<string, unknown>; form: null; state: Record<string, unknown> }>({ url: new URL('https://kuberik.com/'), params: {}, route: { id: '/' }, status: 200, error: null, data: {}, form: null, state: {} });
export const navigating = { from: null, to: null, type: null, willUnload: null, delta: null, complete: null };
export const updated = { current: false, check: async () => false };
