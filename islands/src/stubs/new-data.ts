// Stub for components/new/data.ts, the dashboard's data layer: it wraps the mock fixtures, the GitHub reader and the
// whole view-model tree (>1 MB of graph). Components import a handful of PURE-ish helpers from it; an island supplies
// its data itself, so only the names rollout-view.ts / StrandRow need exist. Anything that would read fixtures throws,
// so an island that accidentally depends on the data layer fails loudly in the spike, not silently on the page.
const unavailable = (name: string) => (): never => { throw new Error(`islands: ${name} needs the dashboard data layer (stubbed)`); };
export const truthAttrs = (): Record<string, string> => ({}); // data-truth-* attributes are for the dashboard's own QA tool
export const placeLabel = unavailable('placeLabel');
export const heldCauses = unavailable('heldCauses');
export const checkClock = unavailable('checkClock');
export const approvalScope = unavailable('approvalScope');
export const actionFor = unavailable('actionFor');
export const stepsOf = unavailable('stepsOf');
export const failureReason = unavailable('failureReason');
export const inbox = unavailable('inbox');
export const arrivals = unavailable('arrivals');
export const lastHealthy = unavailable('lastHealthy');
export const pathPosition = unavailable('pathPosition');
