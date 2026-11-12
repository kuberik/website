/**
 * Camera and cursor targets: names from script.ts resolved against the product's real DOM (data attributes first, then the product's own headings).
 * Nothing is injected into the product: this only READS the page to know where to point. A target that is not on the page resolves to null and the
 * camera rests, so a product change never breaks the loop, it only loosens a zoom.
 */
const text = (e: Element | null) => (e?.textContent ?? '').replace(/\s+/g, ' ').trim();
/** the smallest element matching `sel` whose own text matches `re` */
function byText(root: ParentNode, sel: string, re: RegExp): HTMLElement | null {
	let best: HTMLElement | null = null;
	for (const e of root.querySelectorAll<HTMLElement>(sel)) if (re.test(text(e)) && (!best || best.contains(e)) && !e.closest('.film-snap')) best = e; /* scene lane 5: never the cover's still (a still first in the DOM hid the live subject: the phone's bake frame stayed at the top) */
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
		/* scene lane 6 (item 17b): the prod box of the page header's environment strip (staging's rollout page), and the App page's Pipeline tab */
		case 'env-prod': return [...root.querySelectorAll<HTMLElement>('[data-env-row] [data-env-box]')].find((b) => !b.closest('.film-snap') && /^prod$/i.test(text(b.querySelector('.env-name')))) ?? null;
		case 'tab-pipeline': return [...root.querySelectorAll<HTMLElement>('a[title="Pipeline"]')].find((a) => !a.closest('.film-snap')) ?? null;
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
		/* scene lane 3: the page header's environment strip, lit as its BOXES (dev, staging, prod), 6 px round them: not the row's full-width band */
		case 'env-strip': { const bs = [...root.querySelectorAll<HTMLElement>('[data-env-row] [data-env-box]')]; return bs.length ? pad(union(bs), 6, 10) : null; }
		/* the Change page's story: its title, the strip's boxes and the History card under them (the main column), one lit shape */
		case 'change-story': { const hd = q<HTMLElement>('[data-change-detail] header.page-header'), bs = [...root.querySelectorAll<HTMLElement>('[data-env-row] [data-env-box]')], h = cardOf(root, /^History$/); return bs.length && h ? pad(union([...(hd ? [contentBox(hd)] : []), ...bs, h]), 6, 10) : null; }
		/* scene lane 4: the standalone Health checks card (the pipeline's Check panel has its own "Health checks" row, which is not this) */
		case 'health-checks': { const pc = cardOf(root, /Deployment pipeline/i); const hs = [...root.querySelectorAll<HTMLElement>('h2,h3')].filter((h) => /^Health checks/i.test(text(h)) && !pc?.contains(h)); return (hs[0]?.closest('section, [data-card], .card, [class*="rounded"]') as HTMLElement | null) ?? null; }
		/* scene lane 4 (phone): the Check step's bake, its sentence ("Bake started, monitoring for errors.") and the card under it (Health checks, Check timer and its bar) */
		case 'bake': return byText(root, 'div,span,p,h3,h4', /^Check timer$/)?.closest<HTMLElement>('[class*="rounded"]') ?? null; /* the card under the bake sentence: Health checks, Check timer and its bar (the frame's top nudges up onto the sentence) */
		/* scene lane 4 (phone): the Release approval gate card, the subject from the Approve press to every gate passing (it stays when its button leaves) */
		case 'gate-release': return byText(root, 'div,span,p,h3,h4', /^Release approval$/)?.closest<HTMLElement>('[class*="rounded"]') ?? null;
		/* scene lane 4: the Gates tab's graph: every gate card (staging's promotion, Release approval, Business hours) and this rollout, as one rect (the frame's foot is the lowest gate) */
		case 'pipe-prod': { /* scene lane 5: the App Pipeline card's prod lane, from its PROD label to the card's foot (the phone stacks the stages: dev and staging above, scrolled past) */
			const card = [...root.querySelectorAll<HTMLElement>('div,span,h2,h3')].filter((e) => text(e) === 'Pipeline' && !e.closest('a, .film-snap')).pop()?.closest<HTMLElement>('[class*="rounded"]'); /* scene lane 6: not the App page's Pipeline TAB (its label is the same word) */ const lab = card?.querySelector<HTMLElement>('[data-stage-col="prod"]') ?? null; /* scene lane 6: the stage column's own key (its chip's text is lower case, drawn upper case by CSS) */
			if (!card || !lab) return null;
			return { getBoundingClientRect() { const c = card.getBoundingClientRect(), l = lab.getBoundingClientRect(); return new DOMRect(c.left, l.top, c.width, c.bottom - l.top); } } as unknown as HTMLElement; }
		case 'gates-card': return root.querySelector<HTMLElement>('[data-tour="dependency-graph"]'); /* scene lane 5: the phone's Gates beat frames the whole Gates card from its title */
		case 'gates-graph': { const cards = ['Release approval', 'Business hours'].map((t) => byText(root, 'div,span,p,h3,h4', new RegExp('^' + t + '$'))?.closest<HTMLElement>('[class*="rounded"]') ?? null); const node = byText(root, 'div,span,p', /^This rollout$/i); return cards.every(Boolean) ? union([...(cards as HTMLElement[]), ...(node ? [node] : [])]) : null; }
		case 'gates-card': return cardOf(root, /^Gates$/); /* scene lane 3: the Gates tab's gate graph card */
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
		/* lane 35 (dashboard #135): the Change page's header (title, meta line) with the environment strip under it; the strip's boxes keep their slots as
		   state changes, so this frame holds while only the marks turn */
		/* desktop: the frame is the page's MAIN column (the header's left side, the strip, History under it) from the page top, so the rail's cards are not
		   cut and the strip's marks read; the rect is the header's height so the frame never depends on how long History has grown */
		case 'change-strip': {
			const hd = q<HTMLElement>('[data-change-detail] header.page-header') ?? q<HTMLElement>('[data-change-strip]'); if (!hd || phone) return hd;
			const col = q<HTMLElement>('[data-change-detail] .cd-main'); if (!col) return hd;
			return { __r: 8, getBoundingClientRect() { const h = hd.getBoundingClientRect(), c = col.getBoundingClientRect(); return new DOMRect(c.left, h.top, c.width, h.height); } } as unknown as HTMLElement;
		}
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
/** `el` grown by `m` canvas px on every side (the hole never touches a box's border), corner radius `r` */
function pad(el: { getBoundingClientRect(): DOMRect }, m: number, r: number): HTMLElement {
	return { __r: r, __pad: m, getBoundingClientRect() { const b = el.getBoundingClientRect(); return new DOMRect(b.left, b.top, b.width, b.height); } } as unknown as HTMLElement;
}
function union(els: { getBoundingClientRect(): DOMRect }[]): HTMLElement {
	return { __r: 8, getBoundingClientRect() { const rs = els.map((e) => e.getBoundingClientRect()); const l = Math.min(...rs.map((r) => r.left)), t = Math.min(...rs.map((r) => r.top)), r = Math.max(...rs.map((x) => x.right)), b = Math.max(...rs.map((x) => x.bottom)); return new DOMRect(l, t, r - l, b - t); } } as unknown as HTMLElement;
}
