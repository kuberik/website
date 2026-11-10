/**
 * Camera and cursor targets: names from script.ts resolved against the product's real DOM (data attributes first, then the product's own headings).
 * Nothing is injected into the product: this only READS the page to know where to point. A target that is not on the page resolves to null and the
 * camera rests, so a product change never breaks the loop, it only loosens a zoom.
 */
const text = (e: Element | null) => (e?.textContent ?? '').replace(/\s+/g, ' ').trim();
/** the smallest element matching `sel` whose own text matches `re` */
function byText(root: ParentNode, sel: string, re: RegExp): HTMLElement | null {
	let best: HTMLElement | null = null;
	for (const e of root.querySelectorAll<HTMLElement>(sel)) if (re.test(text(e)) && (!best || best.contains(e))) best = e;
	return best;
}
/** the card (rounded bordered box) that contains the heading matching `re` */
function cardOf(root: ParentNode, re: RegExp): HTMLElement | null {
	const h = byText(root, 'h1,h2,h3,h4,[class*="t-heading"],[class*="t-title"],[class*="t-label"],[class*="t-meta"]', re);
	return h ? (h.closest('section, [data-card], .card, [class*="rounded"]') as HTMLElement | null) ?? h : null;
}
export function resolveTarget(name: string, root: ParentNode, phone: boolean): HTMLElement | null {
	const q = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s);
	switch (name) {
		case 'approve': return q('[data-approve-open]');
		case 'approve-confirm': return q('[data-action="approve-confirm"]');
		case 'attention': return q('[data-approve-open]')?.closest<HTMLElement>('[class*="rounded"]') ?? null;
		case 'banner-rollback': return byText(root, 'button, a', /^Roll back$/);
		case 'modal-cancel': return byText(root, 'button', /^Cancel$/);
		case 'modal-continue': { const m = q('.fm-panel'); return m ? byText(m, 'button', /^Roll back$/) : null; } /* the dialog's own confirm (its label is the verb), not the banner's button behind it */
		case 'where-it-runs': return cardOf(root, /^Where it runs/i);
		case 'gate-column': {
			/* the gates column and the node they feed, as one frame (a synthetic box: only its rect is read) */
			const col = byText(root, 'div,section', /^GATED BY/i), node = byText(root, 'div,section', /^THIS ROLLOUT/i);
			return col && node ? union([col.parentElement ?? col, node.parentElement ?? node]) : null;
		}
		case 'pipeline': return cardOf(root, /Deployment pipeline/i);
		case 'health-checks': return cardOf(root, /^Health checks/i);
		case 'banner': case 'figure': case 'banners': return q('.ap-cq');
		case 'prod-card': return cardOf(root, /Production/i);
		case 'timeline': return cardOf(root, /Timeline|History|deploys/i);
		default: void phone; return null;
	}
}

/** a stand-in element whose rect is the union of `els` (the camera only reads rects) */
function union(els: Element[]): HTMLElement {
	return { getBoundingClientRect() { const rs = els.map((e) => e.getBoundingClientRect()); const l = Math.min(...rs.map((r) => r.left)), t = Math.min(...rs.map((r) => r.top)), r = Math.max(...rs.map((x) => x.right)), b = Math.max(...rs.map((x) => x.bottom)); return new DOMRect(l, t, r - l, b - t); } } as unknown as HTMLElement;
}
