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
/** a still of the page (Film.svelte takeSnap) is a copy of the product's DOM: never a target (after the 390 rollback sheet closed, its copy's Roll back sat over the nav and the tap dot followed it to "Envs", AD r8 P2-1) */
export function resolveTarget(name: string, root: ParentNode, phone: boolean): HTMLElement | null {
	const e = resolve(name, root, phone);
	return e && typeof (e as any).closest === 'function' && (e as HTMLElement).closest('.film-snap') ? null : e;
}
function resolve(name: string, root: ParentNode, phone: boolean): HTMLElement | null {
	const q = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s);
	switch (name) {
		case 'approve': return q('[data-approve-open]');
		/* the Approve card and, once it is open, its confirm popover under it: one frame */
		case 'approve-pair': { const c = q('[data-approve-open]')?.closest<HTMLElement>('[class*="rounded"]') ?? null, pop = phone ? null : q('[data-approve-confirm]'); return c && pop ? union([c, pop]) : c; }
		/* the finale's frame: the Production card's regions (the four untouched ones) and its Last deploy record ("rolled back"), clipped to the card's left 660 px so the zoom lands on them */
		case 'final-prod': { const c = cardOf(root, /^Production/i); if (!c) return null; return { __r: 8, getBoundingClientRect() { const r = c.getBoundingClientRect(), sc = r.width / (c.offsetWidth || r.width); return new DOMRect(r.left, r.top, Math.min(r.width, 660 * sc), r.height); } } as unknown as HTMLElement; }
		/* lane 33: the Approve beat is ONE frame, set at the cut: the attention card plus the room under its Approve that the confirm opens into (a 320 px panel), so nothing re-frames when it opens */
		case 'approve-stage': {
			const btn = q('[data-approve-open]'), c = btn?.closest<HTMLElement>('[class*="rounded"]') ?? null; if (!btn || !c) return null;
			return { __r: 8, getBoundingClientRect() { const r = c.getBoundingClientRect(), b = btn.getBoundingClientRect(), sc = r.width / (c.offsetWidth || r.width); const bottom = phone ? r.bottom : Math.max(r.bottom, b.bottom + 118 * sc), right = Math.max(r.right, b.left + 330 * sc); return new DOMRect(r.left, r.top, right - r.left, bottom - r.top); } } as unknown as HTMLElement;
		}
		case 'approve-confirm': return q('[data-action="approve-confirm"]');
		case 'attention': return q('[data-approve-open]')?.closest<HTMLElement>('[class*="rounded"]') ?? null;
		case 'banner-rollback': return byText(root, 'button, a', /^Roll back$/);
		/* the whole dialog, title included (AD r4: the title was off-screen 35.8-38 s); it fits the window at about 1.06x */
		case 'modal': return q('.fm-panel');
		/* the typed rollback ceremony is tall: the dialog frames in two halves at every desktop width (AD r6 P2-4): the top (title, the 4.46.0-46 to 4.45.0-45 pair, the warning), then the bottom (reason, confirmation, Roll back) */
		case 'modal-top': case 'modal-fields': {
			const m = q('.fm-panel'); if (!m) return null; const top = name === 'modal-top';
			return { __r: 8, getBoundingClientRect() { const r = m.getBoundingClientRect(); const h = r.height * (top ? 0.5 : 0.55); return new DOMRect(r.left, top ? r.top : r.bottom - h, r.width, h); } } as unknown as HTMLElement;
		}
		case 'warn-continue': { const m = q('.fm-panel'); return m && !m.querySelector('textarea') ? byText(m, 'button', /^Continue$/) : null; } /* the recovery-mode warning's own Continue */
		case 'modal-reason': return q('.fm-panel textarea');
		case 'modal-confirm': return q('.fm-panel #cvm-confirm-version');
		case 'modal-cancel': return byText(root, 'button', /^Cancel$/);
		case 'modal-continue': { const m = q('.fm-panel'); return m ? byText(m, 'button', /^Roll back( Roll back)?$/) : null; } /* the dialog's own confirm (its label is the verb), not the banner's button behind it */
		case 'where-it-runs': return cardOf(root, /^Where it runs/i);
		case 'gate-column': {
			/* the gates column (every gate that feeds it) with the node, as one frame: whole cards only, so the dim hole never cuts a card mid-word; narrow enough for a true 1.5x */
			const gates = [...root.querySelectorAll<HTMLElement>('[data-hood-link="upstream"]')], node = q('[data-hood-focus]');
			return gates.length && node ? union([...gates, node]) : null;
		}
		case 'pipeline': return cardOf(root, /Deployment pipeline/i);
		case 'health-checks': return cardOf(root, /^Health checks/i);
		case 'banner': return q('.ap-cq');
		/* the catch: the WHOLE failure banner (AD r4: lit as a banner with its own radius, not as a text box) */
		case 'figure': return q('.ap-cq');
		/* the Catch's tight rest (AD r8 P2-3): the failure banner from its left border to the end of its words (title, figure, budget line, Details), full height. Its actions sit
		   far right across an empty middle, so the frame's right edge lands in the banner's own blank interior: no word, no button sliced, and the words read at 1.5x */
		case 'figure-tight': {
			const c = q('.ap-cq'); if (!c) return null;
			const w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT), rg = document.createRange(); let right = -Infinity;
			for (let n = w.nextNode(); n; n = w.nextNode()) { if (!n.textContent?.trim() || n.parentElement?.closest('button:not([aria-expanded]), a')) continue; rg.selectNodeContents(n); const b = rg.getBoundingClientRect(); if (b.width) right = Math.max(right, b.right); }
			if (!isFinite(right)) return c;
			return { __r: 8, getBoundingClientRect() { const r = c.getBoundingClientRect(); return new DOMRect(r.left, r.top, Math.min(r.width, right - r.left + 28 * (r.width / (c.offsetWidth || r.width))), r.height); } } as unknown as HTMLElement;
		}
		/* the catch's CAMERA frame: the banner from its left edge to the right of its text block (icon, title, the 3.2 % figure, budget line, Details), full banner height, without the empty middle and the buttons; the HOLE stays the whole banner (Move.hole), so the lit shape is the banner and the zoom reads at hero scale (AD r5) */
		case 'figure-text': {
			const ban = q('.ap-cq'); if (!ban) return null;
			const row = byText(ban, 'div,p,span', /^3\.2\s*%\s*error rate/i); if (!row) return ban;
			let e: HTMLElement | null = row; while (e && e !== ban && !/Deployment failed/i.test(text(e))) e = e.parentElement; if (!e || e === ban) return ban;
			const title = byText(e, 'div,p,span,h1,h2,h3,h4', /^Deployment failed$/i), more = byText(e, 'button,summary,span,div', /^Details$/i);
			let blk: HTMLElement = row; while (blk.parentElement && blk !== e && !/budget/i.test(text(blk))) blk = blk.parentElement; /* the figure and its budget line */
			const parts = [title, contentBox(blk), more].filter(Boolean) as HTMLElement[];
			return { __r: 12, getBoundingClientRect() { const b = ban.getBoundingClientRect(); const right = Math.max(...parts.map((x) => x.getBoundingClientRect().right)); return new DOMRect(b.left, b.top, Math.max(80, right + 14 - b.left), b.height); } } as unknown as HTMLElement;
		}
		/* both recovery-mode banners (Recovery mode, Rolled back) as one frame */
		case 'banners': { const bs = [...root.querySelectorAll<HTMLElement>('.ap-cq')].slice(0, 2); return bs.length ? union(bs.map(contentBox)) : null; } /* their text, not their full-width bars: the zoom can land on the words */
		case 'history': return cardOf(root, /^History$/);
		/* the payoff: the Production card's summary line, its bar and the region chips (production waiting on its pin, N regions healthy); not the whole card */
		case 'region-chips': {
			const tile = byText(root, 'div,span', /^\d+ regions? healthy$/i); const row = tile?.parentElement; if (!tile || !row) return null;
			const card = row.parentElement; const kids = card ? [...card.children] : [], i = kids.indexOf(row);
			const summary = kids[Math.max(0, i - 2)] as HTMLElement;
			return union([...summary.children, ...row.children] as HTMLElement[]); /* their words, not the full-width bar: the zoom lands on the chips */
		}
		/* the finale's opening frame: the top-left of the Environments page (Staging, the Production summary) at width-fit, so "All 8 healthy" reads first and the pull-back reveals the rest */
		case 'envs-lead': { const a = cardOf(root, /^Staging/i), b = cardOf(root, /^Production/i); if (!a || !b) return null; const u = union([a, b]); return { __r: 8, getBoundingClientRect() { const r = u.getBoundingClientRect(); return new DOMRect(r.left, r.top, Math.min(r.width, 640 * (r.width / (b as HTMLElement).offsetWidth || 1)), r.height); } } as unknown as HTMLElement; }
		/* the finale's push-in: the Builds card (the five prod regions and the build they sit on) */
		case 'builds': return cardOf(root, /^Builds/i);
		/* lane 34: the App page's shots frame the page's own header block (title, meta line, environment chips) WITH the Builds card: a frame whose top edge sat
		   under the title cut through the meta line, and the card alone left the bottom third empty. The phone keeps the card alone (the header does not fit above it) */
		case 'app-builds': {
			const card = cardOf(root, /^Builds/i); if (phone || !card) return card;
			const hb = q('h1')?.parentElement?.parentElement ?? null;
			if (!hb || hb.getBoundingClientRect().bottom > card.getBoundingClientRect().top) return card;
			/* the header block runs the page's full width ("All environments" sits far right): the frame takes its rows, over the card's columns */
			return { __r: 8, getBoundingClientRect() { const c = card.getBoundingClientRect(), h = hb.getBoundingClientRect(); return new DOMRect(c.left, h.top, c.width, c.bottom - h.top); } } as unknown as HTMLElement;
		}
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
	const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.textContent?.trim() && !n.parentElement?.closest('button,a') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) }); /* buttons are not part of a figure's frame */
	const first = w.nextNode() as Text | null;
	let last = first;
	for (let n = w.nextNode(); n; n = w.nextNode()) last = n as Text; /* text boxes only: a flex child that grows to fill the row has a wide box but short text */
	if (first && last) { r.setStart(first, 0); r.setEnd(last, last.length); } else r.selectNodeContents(el);
	/* inflated 10 px: the hole never cuts a glyph; its corners are the chip family's 6 */
	return { __r: 6, getBoundingClientRect: () => { const b = r.getBoundingClientRect(); return new DOMRect(b.left - 10, b.top - 10, b.width + 20, b.height + 20); } } as unknown as HTMLElement;
}
function union(els: { getBoundingClientRect(): DOMRect }[]): HTMLElement {
	return { __r: 8, getBoundingClientRect() { const rs = els.map((e) => e.getBoundingClientRect()); const l = Math.min(...rs.map((r) => r.left)), t = Math.min(...rs.map((r) => r.top)), r = Math.max(...rs.map((x) => x.right)), b = Math.max(...rs.map((x) => x.bottom)); return new DOMRect(l, t, r - l, b - t); } } as unknown as HTMLElement;
}
