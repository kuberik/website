// Stub for api/pulls.ts, the PR page's one network call (`GET /api/github/pulls/:owner/:repo/:n`, via stores/pr-meta's `fetchPull`). On the landing
// there is no API: the answer comes from the island's own world, never from `fetch`. In order: the section scope's query answers (shared/scope.ts) for
// the product's own `pullQueryKey`, then the merged pull request the fleet's changes feed lists (`liveSource()` reads the island scope's fleet first,
// vite.config.ts islandSource), with no checks (the product prints nothing for a PR without them). Anything else is the backend's 404, thrown as the
// product's own typed error, so the page says what it would say with no such PR. Exports the real module's runtime surface.
import { liveSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { ApiError } from '$lib/api/errors';
import { currentScope } from '../islands/shared/scope';

export type PrGithubState = 'open' | 'merged' | 'closed';
export type PrCheckState = 'success' | 'failure' | 'pending' | 'none';
export type PrChecks = { state: PrCheckState; total: number; failed: number; url: string | null };
export type PullRequestInfo = {
	number: number; title: string; htmlUrl: string; author: string; state: PrGithubState; mergedAt: string | null; mergeCommitSha: string | null; base: string;
	containedIn: string[]; containedInAll: boolean; containedInUnknown: boolean; openedAt: string | null; headSha: string | null; changedFiles: number | null; checks?: PrChecks;
};
export type PullFetchErrorReason = 'not_connected' | 'not_found' | 'error';
export type PullNotFoundScope = 'repo' | 'pr';

export class FetchPullError extends ApiError {
	reason: PullFetchErrorReason;
	scope: PullNotFoundScope | null;
	constructor(reason: PullFetchErrorReason, message: string, status = 0, detail = '', url = '', scope: PullNotFoundScope | null = null) {
		super(status, message, detail || message, url);
		this.name = 'FetchPullError';
		this.reason = reason;
		this.scope = scope;
	}
}

export const containmentKnownFor = (pull: Pick<PullRequestInfo, 'containedIn' | 'containedInAll' | 'containedInUnknown'>): boolean => !pull.containedInUnknown;
export const pullQueryKey = (owner: string, repo: string, number: number, cluster?: string) => ['github-pull', owner, repo, number, cluster] as const;

/** the PR as the changes feed lists it (shared/cr.ts `prChange`), in the endpoint's shape */
function fromFeed(owner: string, repo: string, number: number): PullRequestInfo | null {
	const c = ((liveSource() as any)?.changes ?? []).find((x: any) => x?.kind === 'pr' && x.owner === owner && x.repo === repo && Number(x.number) === number);
	if (!c) return null;
	return {
		number, title: c.title, htmlUrl: c.htmlUrl, author: c.author, state: c.mergedAt ? 'merged' : 'open', mergedAt: c.mergedAt ?? null, mergeCommitSha: c.mergeCommitSha ?? null,
		base: c.base ?? 'main', containedIn: c.containedIn ?? [], containedInAll: !!c.containedInAll, containedInUnknown: false, openedAt: c.openedAt ?? null,
		headSha: c.headSha ?? null, changedFiles: c.changedFiles ?? null
	};
}

export function fetchPull(owner: string, repo: string, number: number, cluster?: string): Promise<PullRequestInfo> {
	/* read synchronously: the scope is only readable while the caller (the page's derived) runs under its component */
	const own = currentScope()?.answers?.(pullQueryKey(owner, repo, number, cluster)) as PullRequestInfo | undefined;
	const hit = own ?? fromFeed(owner, repo, number);
	if (hit) return Promise.resolve(hit);
	const url = `/api/github/pulls/${owner}/${repo}/${number}`;
	return Promise.reject(new FetchPullError('not_found', `PR #${number} not found in ${owner}/${repo} (or you cannot see it)`, 404, '', url, 'pr'));
}

export function pullQueryOptions(args: { owner: string; repo: string; number: number; cluster?: string; enabled?: boolean }) {
	const { owner, repo, number, cluster, enabled = true } = args;
	return {
		queryKey: pullQueryKey(owner, repo, number, cluster),
		queryFn: () => fetchPull(owner, repo, number, cluster),
		enabled: enabled && !!owner && !!repo && Number.isFinite(number),
		staleTime: 5 * 60_000, gcTime: 60 * 60_000, refetchInterval: false as const, refetchOnWindowFocus: false as const, refetchOnReconnect: false as const,
		retry: () => false
	};
}
