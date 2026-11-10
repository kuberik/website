// $app/stores, inert by default. SPIKE (rollout-detail): `page` is a writable so an island can hand it its route params (the History tab reads get(page).params).
import { readable, writable } from 'svelte/store';
export const page = writable<Record<string, unknown>>({ url: new URL('https://kuberik.com/'), params: {}, route: { id: '/' }, status: 200, error: null, data: {}, form: null, state: {} });
export const navigating = readable(null);
export const updated = { subscribe: readable(false).subscribe, check: async () => false };
