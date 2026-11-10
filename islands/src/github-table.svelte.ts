/** The island universe's "GitHub": route -> JSON answer. Replaced per beat together with the fleet snapshot. */
let table = $state.raw<Record<string, unknown>>({});
export const githubTable = { get: (k: string) => table[k], set: (t: Record<string, unknown>) => { table = t; } };
