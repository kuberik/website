/** A product Card (Card.svelte: a <section> whose header holds an <h2>) by its title: the whole card, header included (DIRECTION.md §3). */
export const cardTitled = (root: ParentNode, re: RegExp): HTMLElement | null =>
	([...root.querySelectorAll<HTMLElement>('section h2')].find((h) => re.test(h.textContent?.trim() ?? ''))?.closest('section') as HTMLElement | null) ?? null;
