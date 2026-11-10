/** Raw custom-resource builders shared by the story scenarios: what the dashboard's own API would answer, in the shape of its pinned fixtures. */
export const release = (tag: string, version: string, revision: string, createdMs: number) => ({ tag, version, revision, created: new Date(createdMs).toISOString() });

/** a Gate on a rollout: the versions it lets through (empty = holds everything) */
export const gate = (name: string, allowed: string[]) => ({ name, allowedVersions: allowed, message: allowed.length ? 'Gate is passing' : 'Gate does not allow any release candidate' });

/** a merged pull request as the changes feed lists it */
export const prChange = (owner: string, repo: string, n: number, title: string, author: string, mergedMs: number, sha: string, files: number) => ({
	owner, repo, kind: 'pr', number: n, title, htmlUrl: `https://github.com/${owner}/${repo}/pull/${n}`, author,
	mergedAt: new Date(mergedMs).toISOString(), mergeCommitSha: sha, headSha: sha, base: 'main', changedFiles: files, containedIn: [sha], containedInAll: false
});
