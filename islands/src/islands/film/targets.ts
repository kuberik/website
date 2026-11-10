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
		case 'banner': return q('.ap-cq');
		/* the observed figure ("3.2 % error rate") inside the failure banner: the zoom lands on the number, not the whole-width banner */
		case 'figure': { const row = byText(root, 'div,p,span', /^3\.2\s*%\s*error rate/i); return row ? contentBox(row) : q('.ap-cq'); }
		/* both recovery-mode banners (Recovery mode, Rolled back) as one frame */
		case 'banners': { const bs = [...root.querySelectorAll<HTMLElement>('.ap-cq')].slice(0, 2); return bs.length ? union(bs) : null; }
		case 'prod-card': return cardOf(root, /Production/i);
		/* the History cadence strip (bar, hour ticks, the "shown wider" note): the nearest ancestor of the note that also holds the ticks */
		case 'timeline': { let e: HTMLElement | null = byText(root, 'span,div,p', /shown wider than its real time/i); for (let i = 0; e && i < 5; i++, e = e.parentElement) if (/07:00|08:00/.test(text(e)) && /\d\.\d+\.\d+-\d+/.test(text(e))) return e; return null; }
		default: void phone; return null;
	}
}

/** a stand-in element whose rect is the union of `els` (the camera only reads rects) */
/** the box of an element's CONTENT (what its children occupy), not its block: a full-width row holding a short figure frames the figure (a synthetic target: only the rect is read) */
function contentBox(el: HTMLElement): HTMLElement {
	const r = document.createRange();
	const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) });
	const first = w.nextNode() as Text | null;
	let last = first;
	for (let n = w.nextNode(); n; n = w.nextNode()) last = n as Text; /* text boxes only: a flex child that grows to fill the row has a wide box but short text */
	if (first && last) { r.setStart(first, 0); r.setEnd(last, last.length); } else r.selectNodeContents(el);
	return { getBoundingClientRect: () => r.getBoundingClientRect() } as unknown as HTMLElement;
}
function union(els: Element[]): HTMLElement {
	return { getBoundingClientRect() { const rs = els.map((e) => e.getBoundingClientRect()); const l = Math.min(...rs.map((r) => r.left)), t = Math.min(...rs.map((r) => r.top)), r = Math.max(...rs.map((x) => x.right)), b = Math.max(...rs.map((x) => x.bottom)); return new DOMRect(l, t, r - l, b - t); } } as unknown as HTMLElement;
}
