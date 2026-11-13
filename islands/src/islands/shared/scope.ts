/**
 * ISLAND SCOPE. The dashboard reads two things from module singletons the film owns: SvelteKit's `page` ($app/state stub) and the query layer's
 * answers (svelte-query stub). A section island that shows a rollout page beside the film (another place, another story time) must not read the
 * film's, nor write over them. Both stubs ask this context FIRST, at component init (when Svelte context is readable): a component mounted under
 * `Scoped.svelte` gets its island's page and answers, everything else (the film) the global ones, exactly as before.
 * `$app/state`'s `page` is rewritten per .svelte file to `scopedPage()` at init (vite.config.ts islandScope); createQuery captures the scope when it is created.
 */
import { getContext, setContext } from 'svelte';

export type IslandPage = { url: URL; params: Record<string, string>; route: { id: string }; status: number; error: null; data: Record<string, unknown>; form: null; state: Record<string, unknown> };
/** `source`: the fleet the dashboard's model reads (`liveSource()`, rewritten per build by vite.config.ts islandSource): a section island that shows a
 *  page drawn from the whole fleet (the App page, the Change page) reads its own world, never the film's */
export type Scope = { page: IslandPage; answers: (key: readonly unknown[]) => unknown; source?: unknown };
const KEY = Symbol.for('kuberik.island.scope');
export const provideScope = (s: Scope) => setContext(KEY, s);
/** the scope of the component being initialised, or undefined outside a component's init (and outside any island scope) */
export function currentScope(): Scope | undefined {
	try { return getContext<Scope | undefined>(KEY); } catch { return undefined; }
}
export const pageAt = (path: string, id: string, params: Record<string, string> = {}): IslandPage => ({ url: new URL('https://kuberik.com' + path), route: { id }, params, status: 200, error: null, data: {}, form: null, state: {} });
