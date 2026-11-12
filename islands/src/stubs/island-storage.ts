/** IN-MEMORY STORAGE for every dashboard module bundled into an island. The product remembers preferences in localStorage / sessionStorage
 *  (sidebar-collapsed, display time zone, theme, stars, scroll memory, skeleton shapes); on kuberik.com those writes would land in the
 *  VISITOR's storage for the site. The islandStorage vite plugin rewrites the identifiers to these two objects, so an island reads and
 *  writes only this page view's memory and leaves no trace. The film's shell starts with the sidebar collapsed (owner 2026-11-12). */
class MemoryStorage implements Storage {
	#m = new Map<string, string>();
	constructor(seed: Record<string, string> = {}) { for (const [k, v] of Object.entries(seed)) this.#m.set(k, v); }
	get length() { return this.#m.size; }
	clear() { this.#m.clear(); }
	getItem(k: string) { return this.#m.has(String(k)) ? this.#m.get(String(k))! : null; }
	key(i: number) { return [...this.#m.keys()][i] ?? null; }
	removeItem(k: string) { this.#m.delete(String(k)); }
	setItem(k: string, v: string) { this.#m.set(String(k), String(v)); }
}

export const islandLocal: Storage = new MemoryStorage({ 'sidebar-collapsed': '1' });
export const islandSession: Storage = new MemoryStorage();
