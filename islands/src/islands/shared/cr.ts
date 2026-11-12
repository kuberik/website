/** Raw custom-resource builders shared by the story scenarios: what the dashboard's own API would answer, in the shape of its pinned fixtures. */
export const release = (tag: string, version: string, revision: string, createdMs: number) => ({ tag, version, revision, created: new Date(createdMs).toISOString() });

/** a Gate on a rollout: the versions it lets through (empty = holds everything) */
export const gate = (name: string, allowed: string[]) => ({ name, allowedVersions: allowed, message: allowed.length ? 'Gate is passing' : 'Gate does not allow any release candidate' });

/** a merged pull request as the changes feed lists it */
export const prChange = (owner: string, repo: string, n: number, title: string, author: string, mergedMs: number, sha: string, files: number) => ({
	owner, repo, kind: 'pr', number: n, title, htmlUrl: `https://github.com/${owner}/${repo}/pull/${n}`, author,
	mergedAt: new Date(mergedMs).toISOString(), mergeCommitSha: sha, headSha: sha, base: 'main', changedFiles: files, containedIn: [sha], containedInAll: false
});

/** the page's one wall clock (see shared/world.ts): every story's timestamps are placed relative to it */
export const CLOCK_MS = Date.parse('2026-11-10T09:00:00Z');

export const SOURCE_CLUSTER = 'rollout-dashboard.kuberik.com/source-cluster';
type Rel = { tag: string; created: string; [k: string]: unknown };
/** a stable content stamp (the API's resourceVersion stand-in): the same catalogue yields the same stamp, so the registry does not re-derive an unchanged slice */
const stamp = (s: string) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return String(h >>> 0); };
/**
 * One place's release catalogue as release-controller writes it and the rollouts list serves it (`releaseSources` / `releaseSlices`):
 * a ReleaseSource named like the app's `spec.releaseSourceRef`, and one open ReleaseSlice (label `kuberik.com/release-source`) holding the
 * releases oldest -> newest with their `sequence`. `releases` oldest first.
 */
export function catalogue(ns: string, cluster: string, source: string, image: string, releases: Rel[]) {
	const annotations = { [SOURCE_CLUSTER]: cluster };
	const rels = releases.map((r, i) => ({ ...r, sequence: i + 1, firstSeen: r.created }));
	const newest = releases[releases.length - 1];
	const slice = {
		metadata: { name: `${source}-0001`, namespace: ns, labels: { 'kuberik.com/release-source': source }, annotations, resourceVersion: stamp(JSON.stringify(rels)), generation: rels.length },
		source, sealed: false, releases: rels
	};
	const src = {
		metadata: { name: source, namespace: ns, annotations, resourceVersion: stamp(JSON.stringify(newest ?? null) + rels.length) },
		spec: { oci: { image } },
		status: { count: rels.length, ...(newest ? { newest: { tag: newest.tag, created: newest.created, revision: newest.revision as string | undefined } } : {}), conditions: [{ type: 'Ready', status: 'True', reason: 'Synced', message: `${rels.length} releases` }] }
	};
	return { source: src, slices: [slice] };
}

/**
 * rollout-controller's slices-mode status for one place: `status.releaseSource` (the catalogue summary) and `status.candidates`
 * (every catalogued release newer than the deployed one, newest first; `gated` when every gate's allow-list / passing lets it through,
 * else `blockedBy` names the gates that do not).
 */
export function slicesStatus(source: string, releases: Rel[], deployedTag: string | undefined, gates: { name: string; allowedVersions?: string[] | null; passing?: boolean | null }[]) {
	const i = deployedTag ? releases.findIndex((r) => r.tag === deployedTag) : -1;
	const newer = releases.slice(i + 1).reverse();
	const candidates = newer.map((r) => {
		const blockedBy = gates.filter((g) => (g.allowedVersions != null ? !g.allowedVersions.includes(r.tag) : g.passing === false)).map((g) => g.name);
		return { tag: r.tag, created: r.created, firstSeen: r.created, gated: blockedBy.length === 0, ...(blockedBy.length ? { blockedBy } : {}) };
	});
	const newest = releases[releases.length - 1];
	return { releaseSource: { name: source, ready: true, count: releases.length, ...(newest ? { newest: newest.tag } : {}) }, ...(candidates.length ? { candidates } : {}) };
}
