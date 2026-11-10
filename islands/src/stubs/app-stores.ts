// $app/stores, inert.
import { readable } from 'svelte/store';
export const page = readable({ url: new URL('https://kuberik.com/'), params: {}, route: { id: '/' }, status: 200, error: null, data: {}, form: null, state: {} });
export const navigating = readable(null);
export const updated = { subscribe: readable(false).subscribe, check: async () => false };
