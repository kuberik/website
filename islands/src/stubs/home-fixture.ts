// Stub for view-models/home/fixture.ts, the pinned 420 KB incident capture the dashboard falls back to when NO live source is
// installed (unit tests). Islands always install a source (installLiveSource), so the fallback is never read; an empty one keeps the
// 420 KB capture out of the bundle.
export const FIXTURE_NOW = new Date('2026-01-01T00:00:00Z');
export const FIXTURE_ME = '';
export const homeInput = (now = FIXTURE_NOW) => ({ changes: [], rollouts: [], environments: [], rolloutDependencies: { items: [] }, kustomizations: [], kruiseRollouts: [], me: '', now, healthChecks: [] });
