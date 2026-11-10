// Stub for `tailwind-merge` (90 KB minified, the largest single module in the first bundle). Its only caller here is
// flowbite-svelte-icons' `cn(base, class)`, where the conflict that matters is the icon's default size (`w-5 h-5`)
// versus the call site's (`h-4 w-4`). We keep "last wins" for the sizing / spacing groups and keep everything else as-is.
const GROUP = /^(?:(.*):)?(w|h|size|m[trblxyse]?|p[trblxyse]?|gap)-/;
export function twMerge(...inputs: (string | undefined | null | false)[]): string {
	const out = new Map<string, string>();
	for (const cls of inputs.filter(Boolean).join(' ').split(/\s+/).filter(Boolean)) {
		const m = GROUP.exec(cls);
		out.set(m ? `${m[1] ?? ''}:${m[2]}` : cls, cls);
	}
	return [...out.values()].join(' ');
}
export const twJoin = (...i: unknown[]) => i.filter(Boolean).join(' ');
