// Stub for components/new/github-read.svelte.ts, the dashboard's synchronous GitHub reads. In the product they `fetch('/api/...')`
// (cached, reactive). In an island there is no network: the page's scripted universe answers the same routes from a table
// (`serveGithub`), synchronously, so every derivation that asks is filled on first read and re-runs when the table is replaced.
// Narrowest seam: the dashboard's own view-model code (commit headline, PR identity, ranges) runs untouched on top of this.
import { githubTable } from '../github-table.svelte';

export function githubJson<T = unknown>(path: string, params: Record<string, string> = {}): T | null {
	const q = new URLSearchParams(params);
	const key = q.size ? `${path}?${q}` : path;
	return (githubTable.get(key) ?? githubTable.get(path) ?? null) as T | null;
}
export function forgetGithubReads(): void {}
export const rangeUrl = (ns: string, name: string, _cluster?: string | null): string => `/api/rollouts/${ns}/${name}/commits`;
type Range = { commits?: { sha: string; message: string; author?: string; commitDate?: string; url?: string }[]; additions?: number; deletions?: number; changedFiles?: number };
export function rangeJson(ns: string, name: string, base: string, head: string, cluster?: string | null): Range | null {
	return githubJson<Range>(rangeUrl(ns, name, cluster), { base, head });
}
export const pullJson = <T = { additions?: number; deletions?: number; changedFiles?: number; containedIn?: string[] }>(owner: string, repo: string, n: number | string): T | null =>
	githubJson<T>(`/api/github/pulls/${owner}/${repo}/${n}`);
