/** `$state` only works in .svelte / .svelte.ts modules; this is the one place islands make a reactive props object. */
export function reactive<T extends object>(initial: T): T {
	const s = $state(initial);
	return s;
}
