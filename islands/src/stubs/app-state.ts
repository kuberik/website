// $app/state, inert: a fixed, never-changing page. Components that branch on the route see "/".
export const page = { url: new URL('https://kuberik.com/'), params: {}, route: { id: '/' }, status: 200, error: null, data: {}, form: null, state: {} };
export const navigating = { from: null, to: null, type: null, willUnload: null, delta: null, complete: null };
export const updated = { current: false, check: async () => false };
