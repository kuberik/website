<svelte:options runes={true} />
<script lang="ts">
	/**
	 * HERO FILM (STORYBOARD): the product itself, animated: a real 1440 x 823 dashboard (shell included, scaled into the window; a real phone layout at 390),
	 * every surface the dashboard's own page component fed by the one scripted FleetSource, switched like a person using the app.
	 * REFERENCE REGION: the dashboard's root layout (+layout.svelte): Sidebar | (top bar, <main>) and MobileTabBar below `sm`. The real Sidebar and MobileTabBar
	 * are mounted, so the active item steps by the shell's own class. NEW BY DESIGN: the window top bar (drawn from the same classes, shared/WindowBar),
	 * the camera group (transform only), the dim hole, the cursor, the chrome (Chrome.svelte). Layout queries: the compiled CSS answers `sm:`/`lg:` against
	 * the CANVAS width (vite.config.ts), so a 1440 canvas is the 1440 layout at any viewport.
	 */
	import { untrack, tick } from 'svelte';
	import type { Component } from 'svelte';
	import { approvalUi } from '$lib/components/new/approvals.svelte';
	import WindowBar from '../shared/WindowBar.svelte';
	import Chrome from './Chrome.svelte';
	import Cursor from './Cursor.svelte';
	import { CHAPTERS, LOOP, chapterAt, chapterFill, surfAt, moveAt, pressAt, confirmOpen, CONFIRM_SURF, tallyShown, NEW_AT, NEW_SHINE, type Surf, type Move } from './script';
	import Chip from '$lib/components/Chip.svelte';
	import { loadSurface, surfaceProps, SURFACE_PATH } from './surfaces';
	import { resolveTarget } from './targets';
import { snapFrame, freeStart, spansIn } from './snap';
import { flipRecord, flipPlay, type Pos } from './flip';
	import { page } from '../../stubs/app-state';
	import { page as pageStore } from '../../stubs/app-stores';
	import { setDisplayTimeZone } from '$lib/timezone.svelte';
	import { coverEvent, flipEvent } from './script';
	setDisplayTimeZone('utc'); // the chrome clock is UTC, and so is every absolute time the product prints

	let { t, playing, userPlaying, reduced, onseek, ontoggle, onshown, eventIdx }: { t: number; playing: boolean; reduced: boolean; onseek: (chip: number) => void; ontoggle: () => void; onshown?: () => void; eventIdx: number; userPlaying: boolean } = $props();

	let host: HTMLElement | undefined = $state();
	let W = $state(1120), H = $state(640);
	/* the canvas: a real dashboard at a real width. Phone 390 (the bottom nav layout), tablet 800, desktop 1440; scaled into the window */
	const CW = $derived(W >= 600 ? 1000 : 390); /* scene lane 3 (owner item 12): every view is the dashboard just below its lg (1024) breakpoint, in its single-column layout, scaled up to fill the window: one fixed scale for the whole film */
	const k = $derived(W / CW);
	const CH = $derived(H / k);
	const phone = $derived(CW < 640);

	const surf = $derived<Surf>(surfAt(t));
	const lit = $derived(chapterAt(t));
	const mv = $derived<Move>(moveAt(t, phone));
	/* the loop wrap is a cross-fade from the last frame into b1 (the outgoing page dims, the incoming one fades in): no empty-ground beat, which in dark was a black window */
	const press = $derived(reduced ? null : pressAt(t));
	void tallyShown;

	/* ---- the shell and the approval layer are their own chunks, fetched right after the first surface (the first frame needs only the page): the real Sidebar
	   / MobileTabBar fill the space reserved for them (.film-side is the product's w-58), the real ApprovalLayer arrives 3 s before the first Approve ---- */
	let Side = $state<Component<any> | null>(null), Tabs = $state<Component<any> | null>(null), Layer = $state<Component<any> | null>(null);
	/* the shell's sidebar is COLLAPSED (owner 2026-11-12, as Railway's): the product's own 56 px icon rail. Its 'sidebar-collapsed' key is seeded in the
	   island's in-memory storage (stubs/island-storage.ts), never the visitor's localStorage */
	$effect(() => { void (phone ? import('$lib/MobileTabBar.svelte').then((m) => (Tabs = m.default)) : import('$lib/Sidebar.svelte').then((m) => (Side = m.default))); });
	$effect(() => { if (t >= 4 && !Layer) void import('$lib/components/new/ApprovalLayer.svelte').then((m) => (Layer = m.default)); });

	/* ---- the surface: lazy chunk per surface, cut with a 120 ms out / 200 ms in cross-fade ---- */
	let shown = $state<Surf | null>(null);
	let Comp = $state<Component<any> | null>(null);
	let swapOpacity = $state(0);
	let swapSeq = 0;
	/* the surface a swap is already under way for: the effect below re-runs on every story tick, and a re-entered show() used to bump swapSeq and abort the swap in flight, forever (window stuck at opacity 0: the black screen) */
	let swapping: Surf | null = null;
	async function show(next: Surf, instant: boolean, wrap = false) {
		const seq = ++swapSeq;
		swapping = next;
		const c = await loadSurface(next);
		if (seq !== swapSeq) return;
		/* the cut: a still of the outgoing page covers the window while the incoming one lays itself out UNSEEN (opacity 0), then the still fades over the settled page: nothing visible reflows (CLS), and the window is never empty ground */
		/* the loop wrap: the still of the finale was taken before the story's data went back to 09:02 (wrapCover, below); without it the copy here is of the
		   outgoing page already re-rendered with the opening's data (a flash of the Apps page "Deploying") */
		const pre = !instant && wrapCover && wrapCover === snapEl ? wrapCover : null; wrapCover = null;
		const copy = pre ? null : !instant && shown ? takeSnap() : null;
		if (copy) coverWith(copy, true);
		Object.assign(page, SURFACE_PATH[next]);
		pageStore.update((p) => ({ ...p, ...SURFACE_PATH[next] })); // the History tab reads get(page) of $app/stores (not $app/state)
		Comp = c; shown = next;
		await tick();
		if (!swapOpacity) setTimeout(() => (fadeIn = false), 300);
		swapOpacity = 1;
		onshown?.();
		if (pre || copy) void settleThenReveal((pre ?? copy)!, null, wrap ? 400 : 260); /* a calm dissolve (lane 33, Railway's pacing): long enough to read as a cut, short enough not to ghost */
		if (seq === swapSeq) swapping = null;
	}
	let main: HTMLElement | undefined = $state();
	let group: HTMLElement | undefined = $state();
	let camEl: HTMLElement | undefined = $state();
	/* ---- reflow without a visible shift (CLS): the product re-lays itself out at a few moments (the Approve card collapsing, a banner opening, a dialog closing, a page arriving). A still of the page BEFORE the change covers the window, the real page lays out hidden, and the still fades once the layout has stopped moving. ---- */
	/* The cover hides the group with OPACITY, never with `visibility`. visibility is inherited: on a Fast 3G phone run (about 1 in 3) Chrome kept the stale inherited
	   `hidden` on the Rollouts list sections whose slide (flip.ts) started in the frame the group was un-hidden, so the list stayed invisible (computed hidden,
	   group visible) until the next cut replaced the DOM: the 2 s blank at 10.5-12.5. Opacity is not inherited, so no descendant can keep a stale copy of it. */
	let hid = $state(false);
	let fadeIn = $state(true); /* the first page fades in once; a cover hides and reveals in one frame */
	let snapEl: HTMLElement | null = null;
	function takeSnap(kind: 'cut' | 'event' = 'cut'): HTMLElement | null {
		if (!group || reduced || (globalThis as any).__kfNoSnap?.includes(kind)) return null;
		const c = group.cloneNode(true) as HTMLElement;
		c.style.cssText = `position:absolute;left:0;top:0;width:${group.offsetWidth}px;height:${group.offsetHeight}px;overflow:hidden;pointer-events:none;z-index:3;opacity:1;visibility:visible`;
		c.setAttribute('aria-hidden', 'true'); c.removeAttribute('inert'); c.classList.add('film-snap');
		c.querySelectorAll('[id]').forEach((e) => e.removeAttribute('id'));
		/* a clone does not carry scroll positions: the 390 rollback sheet (scrolled to its fields) came back at its top under the still (AD r8 P2-1). Copied once the still is in the document */
		const src = group.querySelectorAll('*'), dst = c.querySelectorAll('*'), sc: [Element, number, number][] = [];
		for (let i = 0; i < src.length; i++) if (src[i].scrollTop || src[i].scrollLeft) sc.push([dst[i], src[i].scrollTop, src[i].scrollLeft]);
		(c as any).__scroll = sc;
		/* lane 36 (AD r1 P1-1): the approval confirm (the product's ApprovalLayer: a popover in the camera on desktop, a sheet + scrim over the canvas on the phone)
		   lives OUTSIDE the group, so a still of the group alone dropped it: for the length of the cut's dissolve the card sat there again asking for approval.
		   A cut's still carries a copy of it, so the cut lands on the pressed confirm and dissolves from it. */
		if (kind === 'cut' && canvas) {
			const ex: HTMLElement[] = [];
			for (const d of canvas.querySelectorAll<HTMLElement>('[data-approve-confirm]')) {
				const sc0 = d.previousElementSibling as HTMLElement | null;
				for (const e of [sc0 && sc0.classList.contains('inset-0') ? sc0 : null, d]) if (e) { const k2 = e.cloneNode(true) as HTMLElement; k2.removeAttribute('data-approve-confirm'); k2.setAttribute('aria-hidden', 'true'); k2.style.pointerEvents = 'none'; ex.push(k2); }
			}
			(c as any).__extra = ex;
		}
		return c;
	}
	/** a still and the overlay copies it carries (on the phone they sit over the canvas, beside the real layer) */
	function dropSnap(c: HTMLElement) { c.remove(); for (const e of (c as any).__extra ?? []) e.remove(); }
	/* `frozen`: a CUT's still sits OUTSIDE the camera, carrying the outgoing shot's transform, so the incoming shot's framing is set under it (lane 33: a shot
	   arrives framed; the camera never zooms in front of the viewer) */
	function coverWith(c: HTMLElement, frozen = false) {
		if (snapEl) dropSnap(snapEl); snapEl = c; hid = true;
		if (frozen && camEl) { c.style.transformOrigin = '0 0'; c.style.transform = getComputedStyle(camEl).transform.replace('none', ''); camEl.parentElement!.appendChild(c); }
		else camEl!.insertBefore(c, group!.nextSibling);
		for (const e of (c as any).__extra ?? []) (phone ? canvas! : c).appendChild(e); /* desktop: the popover is camera space, so it rides in the still (same transform); phone: the sheet is canvas space */
		for (const [e, y, x] of (c as any).__scroll ?? []) { e.scrollTop = y; e.scrollLeft = x; }
	}
	async function settleThenReveal(c: HTMLElement, rec: Pos | null = null, fade = 80) {
		const t0 = performance.now(); let last = group!.offsetHeight, since = t0;
		while (performance.now() - t0 < 700) {
			await new Promise((r) => requestAnimationFrame(r));
			if (c !== snapEl || !group) return;
			const h = group.offsetHeight; if (h !== last) { last = h; since = performance.now(); }
			if (performance.now() - since > 110 && performance.now() - t0 > 180) break;
		}
		if (c !== snapEl) return;
		/* lane 34: the phone frame keeps its subject where it stood: a reflow ABOVE it (the header's chips wrapping to a second row as staging deploys, +20 px) used to slide the
		   Builds card up under the bar, and a seek to the same second showed it where it should be. The camera re-anchors under the still, and the slide is measured on screen */
		const d = phoneAnchor();
		if (rec && d) for (const v of rec.values()) v.y -= d;
		hid = false; snapEl = null;
		/* a covered reflow on the phone: the still is dropped in one frame (no two layouts superimposed: the ghost) and what moved SLIDES from where it was to where it is (flip.ts, transform only: no layout shift) */
		if (rec) { dropSnap(c); void tick().then(() => { if (group && !swapping && !hid) flipPlay(group, rec, unit(), 300); }); return; }
		const done = () => dropSnap(c);
		for (const e of phone ? (c as any).__extra ?? [] : []) e.animate([{ opacity: 1 }, { opacity: 0 }], { duration: fade, easing: "ease-out", fill: "forwards" });
		c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: fade, easing: "ease-out", fill: "forwards" }).finished.then(done, done);
	}
	let preEi = -2, preSnap: { el: HTMLElement | null; h: number; flip: Pos | null; rec: Pos | null } | null = null;
	/* the loop wrap (AD r8 P3-1): a still of the finale AS IT IS, taken before the DOM re-renders with the opening's data, keeps the finale's framing on itself
	   while the camera goes home at once; the opening page then lays out at rest under it and the still fades (show() reveals it). Easing the camera home over
	   the incoming page showed it mid-move (the chip row's foot under the top bar at 47.5) */
	let wrapCover: HTMLElement | null = null, preT = -1;
	$effect.pre(() => {
		const ei = eventIdx, tt = t;
		untrack(() => {
			const wrapping = preT > LOOP - 3 && tt < 2;
			/* lane 33: every PLAYED cut takes its still here too, before the DOM re-renders: a CR that changes on the cut's own tick (the approval asked at 7.0)
			   would otherwise be drawn on the outgoing page for a frame (the App page grew an approval banner under the still) */
			const cutting = !wrapping && preT >= 0 && Math.abs(tt - preT) < 0.4 && surfAt(tt) !== shown && surfAt(tt) !== swapping;
			preT = tt;
			if ((!wrapping && !cutting) || !group || !camEl || !shown || reduced || hid) return;
			const c = takeSnap(); if (!c) return;
			coverWith(c, true);
			if (wrapping) { cam = { x: 0, y: 0, s: 1, dur: 0, ease: 'ease', moving: false }; holeOn = false; shadeOn = false; }
			else { holeOn = false; shadeOn = false; }
			preEi = ei; preSnap = null;
			if (cutting) { wrapCover = c; return; }
			/* the film opens and ends on the App page: no cut runs, so the still of the finale dissolves here over the opening laid out under it */
			if (surfAt(tt) === shown) void settleThenReveal(c, null, 400); else wrapCover = c;
		});
	});
	$effect.pre(() => {
		const ei = eventIdx;
		untrack(() => { if (ei === preEi) return; preEi = ei; preSnap = !group || swapping || hid || reduced || !shown ? null : { el: coverEvent(t, CW < 1000) ? takeSnap('event') : null, h: group.offsetHeight, flip: flipEvent(t, CW < 1000) && !(globalThis as any).__kfNoSnap?.includes('flip') ? flipRecord(group, unit()) : null, rec: CW < 640 && coverEvent(t, true) && !(globalThis as any).__kfNoSnap?.includes('slide') ? flipRecord(group, unit()) : null }; });
	});
	$effect(() => {
		void eventIdx;
		untrack(() => {
			const p = preSnap; preSnap = null; if (!p || !group) return;
			if (p.flip) { const rec = p.flip; void tick().then(() => { if (group && !swapping && !hid) flipPlay(group, rec, unit()); }); return; } /* the product's one-step reflow plays as a slide by transform (flip.ts): no layout shift */
			if (!p.el) return;
			void tick().then(() => tick()).then(async () => {
				if (!group || swapping || hid) return;
				/* the phone covers only a reflow that happened; the one desktop cover (the dialog closing at 38.7) WAITS for it, up to 0.9 s: on a cold or loaded run the close lands after two ticks (39.26 s) and 'nothing moved yet' used to drop the cover (the flake). Frozen still only from the frame the reflow is seen: the rAF read runs before that frame paints */
				const t0 = performance.now();
				while (Math.abs(group.offsetHeight - p.h) < 3) {
					if (CW < 1000 || performance.now() - t0 > 900) return;
					await new Promise((r) => requestAnimationFrame(r));
					if (!group || swapping || hid) return;
				}
				coverWith(p.el!); void settleThenReveal(p.el!, p.rec);
			});
		});
	});
	let lastT = -1;
	$effect(() => {
		const s = surf, tt = t;
		const wrap = lastT > LOOP - 3 && tt < 2; /* the loop's end into its start: animated, not a seek */
		const jumped = (Math.abs(tt - lastT) > 0.4 && !wrap) || lastT < 0;
		lastT = tt;
		untrack(() => { if (s !== shown && s !== swapping) void show(s, jumped || reduced, wrap && !reduced); });
	});
	const props = $derived(shown ? surfaceProps(shown, eventIdx) : {});

	/* ---- the camera: transform only, on the content group; the shell stays put and dims ---- */
	let cam = $state({ x: 0, y: 0, s: 1, dur: 0, ease: 'ease', moving: false });
	let hole = $state<{ x: number; y: number; w: number; h: number; r: number } | null>(null);
	let holeOn = $state(false), shadeOn = $state(false);
	let holeTimer: ReturnType<typeof setTimeout> | undefined;
	/* the hole = the target's own box and corner radius (targets.ts: a synthetic target says its own) */
	function holeOf(el: Element) { const r0 = relRect(el), m = (el as any).__pad ?? 0, r = { x: r0.x - m, y: r0.y - m, w: r0.w + 2 * m, h: r0.h + 2 * m }; const rad = (el as any).__r ?? (parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0); return { ...r, r: rad }; }
	let moveKey = '';
	let moveTimer: ReturnType<typeof setTimeout> | undefined;
	const unit = () => (group && group.offsetWidth ? group.getBoundingClientRect().width / group.offsetWidth : 1);
	function relRect(el: Element) {
		const g = group!.getBoundingClientRect(), r = el.getBoundingClientRect(), u = unit();
		return { x: (r.left - g.left) / u, y: (r.top - g.top) / u, w: r.width / u, h: r.height / u };
	}
	/** the smallest font (canvas px) of the text whose box centre lies inside `r` (group space): what a zoom has to lift to a readable size */
	function minFont(r: { x: number; y: number; w: number; h: number }) {
		let min = 99;
		const w = document.createTreeWalker(camEl!, NodeFilter.SHOW_TEXT);
		for (let n = w.nextNode(); n; n = w.nextNode()) {
			if (!n.textContent?.trim()) continue;
			const p = n.parentElement!; if (p.closest('svg,style,script')) continue;
			const b = relRect(p), cx = b.x + b.w / 2, cy = b.y + b.h / 2;
			if (b.w < 2 || cx < r.x || cx > r.x + r.w || cy < r.y || cy > r.y + r.h) continue;
			const fs = parseFloat(getComputedStyle(p).fontSize); if (fs && fs < min) min = fs;
		}
		return min === 99 ? 13 : min;
	}
	/** every line of the product's text, in group space (what the camera must not slice); `dialog` = only the dialog's own text (the page behind its scrim is not what the frame is about) */
	function textRects(dialog: boolean) {
		const out: { x: number; y: number; w: number; h: number }[] = [];
		const w = document.createTreeWalker(dialog ? camEl!.querySelector('.fm-panel') ?? camEl! : camEl!, NodeFilter.SHOW_TEXT);
		const rg = document.createRange(), g = group!.getBoundingClientRect(), u = unit();
		for (let n = w.nextNode(); n; n = w.nextNode()) {
			if (!n.textContent?.trim()) continue;
			const p = n.parentElement!; if (p.closest('svg,style,script') || getComputedStyle(p).visibility === 'hidden') continue;
			rg.selectNodeContents(n);
			for (const q of rg.getClientRects()) { if (q.width < 3) continue; out.push({ x: (q.left - g.left) / u, y: (q.top - g.top) / u, w: q.width / u, h: q.height / u }); }
		}
		return out;
	}
	/** the product's bordered or filled boxes (cards, chips, banners, buttons) in group space, except those that CONTAIN the subject: a frame edge should not slice a neighbour card either (AD r6 P2-3) */
	function boxRects(T: { x: number; y: number; w: number; h: number }) {
		const out: { x: number; y: number; w: number; h: number }[] = [];
		const g = group!.getBoundingClientRect(), u = unit();
		for (const e of camEl!.querySelectorAll<HTMLElement>('[class*="rounded"], .btn, button')) { /* buttons too: the product's .btn carries its radius in CSS, not a class (the History push-in's top edge sliced "Open PR", lane 32) */
			const q = e.getBoundingClientRect(); if (q.width < 40 || q.height < 20) continue;
			const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
			if (!(parseFloat(cs.borderTopWidth) > 0 || (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent'))) continue;
			const b = { x: (q.left - g.left) / u, y: (q.top - g.top) / u, w: q.width / u, h: q.height / u };
			if (b.x <= T.x + 1 && b.y <= T.y + 1 && b.x + b.w >= T.x + T.w - 1 && b.y + b.h >= T.y + T.h - 1) continue; /* contains the subject */
			out.push(b);
		}
		return out;
	}
	/** the phone's frame is the page scrolled to its subject (no zoom): put the subject back 10 px under the top after a reflow; returns how far the camera moved (canvas px) */
	function phoneAnchor(): number {
		if (reduced || !group || !main || !camEl) return 0;
		const m = mv; if (m.to === 'rest' || shown !== surfAt(m.at)) return 0;
		if (!phone) { /* scene lane 4: a desktop top-framed hold (s = 1) keeps its subject where the cut put it: a reflow ABOVE it (the pipeline growing as the bake starts) is taken up by the camera, off screen */
			if (m.s !== 1 || m.foot || m.stay || cam.s !== 1) return 0;
			const el = resolveTarget(m.to, camEl, false); if (!el) return 0;
			const r = relRect(el), y = -Math.max(0, Math.min(r.y - (m.pad ?? 24), group.offsetHeight - main.clientHeight)), d = y - cam.y;
			if (Math.abs(d) < 1) return 0; cam = { ...cam, y, dur: 0, moving: false }; return d;
		}
		const el = resolveTarget(m.to, camEl, true); if (!el) return 0; /* the subject left (the approved card): the frame stays */
		const r = relRect(el), vh = main.clientHeight, gh = group.offsetHeight;
		const y = Math.min(0, Math.max(Math.min(0, vh - gh), -(phoneOff !== null ? Math.max(0, r.y + phoneOff) : phoneTop(r)))), d = y - cam.y; /* the subject stays where the move's aim put it (a re-snapped foot would slide the whole page) */
		if (Math.abs(d) < 3 || cam.s !== 1) return 0;
		cam = { ...cam, y, dur: 0, moving: false };
		return d;
	}
	/** lane 36 (AD r1 P2-4): the phone frame's top, in group px: the subject 10 px under the bar, moved down by up to 100 px when that leaves a row sliced by
	 *  the tab bar (the frame's real foot: a sliver of the Health checks row, History cut mid-row). Both edges in a gap between the product's text and small boxes. */
	const PHONE_OFF = new Map<string, number>();
	let phoneOff: number | null = null; /* the frame top minus the subject's top, set by aim() for the length of a move */
	function phoneTop(r: { x: number; y: number; w: number; h: number }): number {
		const pref = Math.max(0, r.y - 10);
		if (!main || !group || !canvas) return pref;
		const nav = canvas.querySelector<HTMLElement>('.film-tabs nav')?.offsetHeight ?? 0, /* the product's MobileTabBar is fixed inside the canvas: its wrapper has no height */ len = main.clientHeight - nav, gh = group.offsetHeight, vw = main.clientWidth;
		const rects = [...textRects(false), ...boxRects({ x: -1, y: -1, w: 0, h: 0 }).filter((b) => b.h < 56)].map((q) => ({ x: q.x, y: q.y - 3, w: q.w, h: q.h + 6 }));
		const p = freeStart(Math.max(0, pref - 100), Math.min(pref, Math.max(0, gh - main.clientHeight)), len, spansIn(rects, 'y', 0, vw), pref);
		return p ?? pref;
	}
	let refineTimer: ReturnType<typeof setTimeout> | undefined, refine2Timer: ReturnType<typeof setTimeout> | undefined, refine3Timer: ReturnType<typeof setTimeout> | undefined;
	/* lane 35: a desktop HOLD is framed once per window size and then reused: natural play (aimed at the cut, refined while the page settles) and a seek that
	   lands inside the hold (which used to aim at that second's layout: the pipeline grows step by step) show the same frame. Keyed by the move and the canvas. */
	const AIM_MEMO = new Map<string, { x: number; y: number; s: number }>();
	function aim(m: Move, jump: boolean, refine = false, final = false) {
		if (!group || !main) return;
		if (phone) jump = true; /* scene lane 3: the phone's frame is a scroll; inside a chapter the camera cuts, it never glides */
		/* reduced motion: no camera at all (STORYBOARD section 9): every frame is the unzoomed, unscrolled page */
		if (reduced) { cam = { x: 0, y: 0, s: 1, dur: 0, ease: 'ease', moving: false }; holeOn = false; shadeOn = false; return; }
		const vw = main.clientWidth, vh = main.clientHeight, gw = group.offsetWidth, gh = group.offsetHeight;
		const el = m.to === 'rest' || (phone && (m.to === 'modal-fields' || m.to === 'modal-top')) ? null : resolveTarget(m.to, camEl!, phone); /* phone: the rollback dialog is a full-screen sheet, there is nothing to zoom */
		let x = 0, y = 0, s = el ? m.s : 1; /* a target that is not on the page rests (never a blind zoom at the origin) */
		const mk = el && !phone && m.dur === 0 && s !== 1 ? `${m.at}|${CW}|${CH}` : null, memo = mk ? AIM_MEMO.get(mk) : undefined;
		if (memo) { ({ x, y, s } = memo); }
		else if (el) {
			const r0 = relRect(el), r = m.h ? { ...r0, h: m.h } : r0; /* Move.h: the frame is worked out as if the target were this tall, so it does not depend on the step the story is at */
			if (phone && m.stay && r.y < vh * 0.4) { s = 1; phoneOff = -1e6; y = 0; } /* scene lane 3: a subject near the page top (the header strip) keeps the page unscrolled: the title stays in frame */
			else if (phone) { s = 1; const pk = `${m.at}|${CW}`; if (!refine && !PHONE_OFF.has(pk)) PHONE_OFF.set(pk, phoneTop(r) - Math.max(0, r.y - 10)); phoneOff = PHONE_OFF.get(pk)! - 10; y = -Math.max(0, r.y + phoneOff); } /* the foot's nudge is worked out once per move (a seek frames the way play does) */
			else if (s === 1 && m.foot) {
				/* scene lane 4: a FOOT framing: the frame ends just under the target (its whole card and everything above it that fits), and both edges sit in a gap between the
				   product's text and small boxes (buttons, chips): the window is shorter than the single-column page, so the subject is the frame's foot, not its top */
				const rects = [...textRects(false), ...boxRects({ x: -1, y: -1, w: 0, h: 0 }).filter((b) => b.h < 56)].map((q) => ({ x: q.x, y: q.y - 2, w: q.w, h: q.h + 4 }));
				const end = r.y + r.h, lo = Math.max(0, end + 2 - vh), hi = Math.max(lo, end + 14 - vh), sp = spansIn(rects, 'y', 0, vw);
				const top = freeStart(lo, hi, vh, sp, end + 8 - vh) ?? freeStart(lo, hi, vh, sp, end + 8 - vh, true) ?? end + 8 - vh;
				y = -Math.max(0, Math.min(top, gh - vh));
			}
			else if (s === 1) { y = m.stay ? 0 : -Math.max(0, Math.min(r.y - (m.pad ?? 24), gh - vh)); }
			else {
				/* fit with a 14 px margin: the product's gap between cards is >= 12 px x scale, so a neighbour never peeks into the frame mid-word. The PERSON beats (m.min) zoom until their smallest text renders at m.min px, bounded by the window (both axes) and 2.4x. */
				const need = m.min ? m.min / (minFont(r) * k) : 0;
				/* lane 35: the 1.5x cap (product pixels) bounds the scale BEFORE the frame is snapped: capping after the snap kept the frame's top and shrank it round it
				   (the canary's frame started on the page header's commit line with a loose foot) */
				const cap = 1.5 / k;
				s = Math.max(1, Math.min(Math.max(m.s, need), (vw - 28) / r.w, m.min ? (vh - 28) / r.h : Infinity, Math.max(2.4, m.s), Math.max(1, cap))); /* 2.4x, or a move's own wanted scale above it (the History card: 2.5x) */
				/* AD r4: a frame edge never slices a word. The origin slides (and the scale gives a little) until both edges sit in a gutter between the product's own text (snap.ts). Dialog beats snap against the dialog's text only. */
				const dlg = m.to.startsWith('modal');
					if (dlg && CW < 1000 && s < 1.12) { cam = { x: 0, y: 0, s: 1, dur: jump ? 0 : m.dur, ease: m.ease, moving: !jump }; holeOn = false; shadeOn = true; return; } /* a tablet canvas: the dialog fits the frame whole, nothing to zoom (the pan cut its title) */
					const tr = textRects(dlg), args = [vw, vh, gw, gh, s, Math.max(1, s * (m.min ? 0.93 : 0.86)), Math.max(s, Math.min((vw - 28) / r.w, m.min ? (vh - 28) / r.h : Infinity, Math.max(2.4, m.s), cap))] as const;
				let sn = dlg ? snapFrame(r, tr, ...args) : snapFrame(r, [...tr, ...boxRects(r)], vw, vh, gw, gh, s, Math.max(1, s * 0.9), Math.max(s, Math.min(args[6], s * 1.25))); /* cards too, within a hair of the wanted zoom (a frame that only clears every card at 2.4x is a different shot) */
				if (!sn.ok && !dlg) sn = snapFrame(r, tr, ...args); /* no frame clears every card: words at least */
				s = sn.s; x = sn.x; y = sn.y;
				if (s * k > 1.5) { const c = 1.5 / k / s; s *= c; x *= c; y *= c; } /* owner: product footage never above 1.5x of its own pixels (the canvas is already scaled by k) */
				/* lane 35: Move.rows names a list of fixed-pitch rows under the target (History on the Change page): the frame's FOOT lands on a row boundary, extrapolated by
				   the pitch, so it never slices a row however long the list grows (the frame is set once and the list grows into it) */
				if (m.rows) {
					const li = [...camEl!.querySelectorAll<HTMLElement>(m.rows)].map(relRect);
					if (li.length >= 2) {
						const pitch = li[1].y - li[0].y, top = -y / s, left = -x / s, sMax = Math.min(cap, (vw - 28) / r.w) + 1e-6;
						/* and its right edge stays in the gutter before the neighbour column (the rail's cards were sliced at 1920) */
						const nb = m.beside ? camEl!.querySelector<HTMLElement>(m.beside) : null, nbx = nb && nb.offsetWidth ? relRect(nb).x : Infinity;
						const sMin = Math.max(s * 0.8, isFinite(nbx) ? vw / (nbx - 6 - left) : 0);
						let best: number | null = null;
						const pad = Math.max(0, (parseFloat(getComputedStyle((camEl!.querySelector<HTMLElement>(m.rows)!.firstElementChild as HTMLElement | null) ?? camEl!.querySelector<HTMLElement>(m.rows)!).paddingTop) || 0) - 3) /* the row's padding sits on its inner .cdh-row */; /* lane 36 (AD r1 P2-4): the foot sits just above the next row's ink, not on the boundary (the last row's ink sat flush on the window's foot) */
						for (let n = 1; n < 40; n++) { const b = li[0].y + n * pitch + pad, sn = vh / (b - top); if (sn <= sMax && sn >= sMin) { best = sn; break; } }
						if (!best && sMin <= sMax) best = sMin;
						if (best) { x = (x / s) * best; y = -top * best; s = best; }
						else if (sMin > sMax) { s = 1; x = 0; y = 0; } /* a wide canvas whose main column cannot fill the frame under the zoom cap: the whole page, rail included, at 1x (no card sliced) */
					}
				}
				 (globalThis as any).__kfAim = { to: m.to, r, sn, vw, vh, gw, gh, refine }; /* even when no x position clears every word (ok = false) the y found for a clean top edge stands */
			}
		}
		if (mk && !memo && final) AIM_MEMO.set(mk, { x, y, s });
		x = Math.min(0, Math.max(Math.min(0, vw - s * gw), x));
		y = Math.min(0, Math.max(Math.min(0, vh - s * gh), y));
		/* the ONE dim (L1/L2): the product's ink at 38% over everything but the target, shell included. The hole is the target's own rect and corner radius. */
		const wantDim = !!el && !!m.dim && !reduced;
		shadeOn = wantDim; /* 'shade' = the shell only (the dialog's own scrim dims the page) */
		const hEl = m.hole ? resolveTarget(m.hole, camEl!, phone) : el; /* the lit shape can differ from the framed one (the catch: frame the text, light the whole banner) */
		const next = wantDim && m.dim !== 'shade' && hEl ? holeOf(hEl) : null;
		clearTimeout(holeTimer);
		if (!next) holeOn = false;
		else if (refine || !holeOn || !hole) { hole = next; holeOn = true; }
		else { /* a pan between two targets: the dim lets go while the camera travels (a hole that rides the old target would spotlight the wrong content), then closes on the new one */
			holeOn = false; const dd = jump ? 0 : (phone ? 320 : m.dur); holeTimer = setTimeout(() => { hole = next; holeOn = true; }, dd * 0.7);
		}
		if (refine && Math.abs(x - cam.x) < 3 && Math.abs(y - cam.y) < 3 && Math.abs(s - cam.s) < 0.01) return; /* QA r7: 0.75 px let every re-layout move the canary hold (y -398 <-> -279); 3 px keeps it still */
		const dur = jump || reduced ? 0 : refine ? 260 : phone ? (m.dur ? 320 : 0) : m.dur;
		cam = { x, y, s, dur, ease: phone ? 'cubic-bezier(0.2, 0.8, 0.2, 1)' : m.ease, moving: dur > 0 };
		clearTimeout(moveTimer);
		if (dur > 0) moveTimer = setTimeout(() => { cam = { ...cam, moving: false }; }, dur + 40);
		/* the product's own enter animations (banners opening, cards collapsing) keep moving the target for ~0.5 s after a move starts: re-aim once they have settled */
		if (!refine) { clearTimeout(refineTimer); clearTimeout(refine2Timer); clearTimeout(refine3Timer); }
		if (!refine && el && !reduced && !memo) { refineTimer = setTimeout(() => aim(m, false, true), 650); refine2Timer = setTimeout(() => aim(m, false, true, true), 1500); } /* twice: the page keeps settling a little after the product's enter animations */
	}
	/* a move starts when the story reaches its keyframe, or the surface under it changed (re-aim once its layout has settled) */
	$effect(() => {
		const m = mv, s = shown, ei = eventIdx, tt = t;
		void s; void ei;
		const seek = Math.abs(tt - prevT) > 0.4 && !(prevT > LOOP - 3 && tt < 2); prevT = tt; /* a jump is a seek, never a move the story plays itself (it was a hard cut every time: no transition ran) */
		untrack(() => {
			if (s !== surfAt(m.at)) return; /* the cut has not landed yet: the framing waits for its own page (aiming it at the outgoing page moved that page) */
			const kk = `${CAMERA_INDEX(m)}|${s}|${phone}`; /* the camera is LOCKED for the length of a move: a CR change inside a hold re-lays the page but never re-aims (it drifted 5x on the pipeline) */
			if (kk === moveKey && !seek) return; /* a seek re-aims (phone: re-anchors; desktop: the hold's memoised frame), so the second a seek lands on is framed the way natural play reaches it (lanes 34, 35) */
			const first = !moveKey.startsWith(`${CAMERA_INDEX(m)}|`);
			moveKey = kk;
			void first;
			void tick().then(() => requestAnimationFrame(() => requestAnimationFrame(() => aim(m, seek))));
		});
	});
	let prevT = -1;
	function CAMERA_INDEX(m: Move) { return m.at; }
	/* the transform sits on the CAMERA wrapper (group + overlays): a fixed child (the approve popover, the rollback dialog) anchors to the wrapper and zooms with the page. On desktop the wrapper always carries a transform so the dialog's containing block never changes mid-move. */
	const camStyle = $derived(phone && cam.s === 1 && cam.x === 0 && cam.y === 0 && !cam.moving ? 'transform:none' : cam.s === 1 && cam.x === 0 && cam.y === 0 && !cam.moving ? 'transform: translate(0, 0)' : `transform: translate3d(${cam.x}px, ${cam.y}px, 0) scale(${cam.s}); transition: transform ${cam.dur}ms ${cam.ease}; will-change: ${cam.moving ? 'transform' : 'auto'}`);
	/* the sidebar is outside the camera: while the frame is zoomed it would stay at 1x beside a 1.6x main pane (two type scales in one shot), so it recedes */
	const lifted = $derived((mv.dimOff !== undefined && t >= mv.dimOff) || (phone && confirmOpen(t))); /* lane 36 (AD r1 P2-2): on the phone the product's own sheet brings its scrim; the film's dim on top of it darkened the asking card twice */
	const shellDim = $derived(((shadeOn && !lifted) || (!phone && cam.s > 1.05)) && !reduced);

	/* scene lane 3: the camera never moves (s = 1), so a lit box that grows or shrinks (History logging a step, the site list) is followed by the HOLE alone, for half a second after each change */
	$effect(() => {
		void eventIdx; void shown; const m = mv;
		untrack(() => {
			if (!m.dim || m.dim === 'shade' || !camEl || reduced) return;
			let n = 0, raf = 0;
			const go = () => { if (holeOn && hole && camEl) { const hEl = resolveTarget(m.hole ?? m.to, camEl, phone); if (hEl) { const nx = holeOf(hEl); if (Math.abs(nx.x - hole.x) + Math.abs(nx.y - hole.y) + Math.abs(nx.w - hole.w) + Math.abs(nx.h - hole.h) > 1) hole = nx; } } if (++n < 30) raf = requestAnimationFrame(go); };
			raf = requestAnimationFrame(go);
		});
	});

	/* ---- the cursor: canvas px; the real click is dispatched at `press` ---- */
	let canvas: HTMLElement | undefined = $state();
	let ptr = $state({ x: 0, y: 0, on: false, press: false });
	function canvasPoint(el: Element) {
		const c = canvas!.getBoundingClientRect(), r = el.getBoundingClientRect();
		return { x: (r.left - c.left + r.width * 0.6) / k, y: (r.top - c.top + r.height * 0.6) / k };
	}
	$effect(() => {
		const p = press, tt = t, live = playing;
		void shown; void swapOpacity; void eventIdx; void Comp; void hid; /* re-aim once the surface under the cursor has been shown and laid out (a seek lands before it) */
		untrack(() => {
			if (!p || !canvas) { ptr.on = false; ptr.press = false; return; }
			const el = resolveTarget(p.target, canvas, phone);
			if (el) { const pt = canvasPoint(el); ptr.x = pt.x; ptr.y = pt.y; }
			ptr.on = tt < p.off - 0.1 && (!!el || tt < p.press) && !(phone && hid && tt >= p.press); /* the dot leaves with what it pressed (a closed sheet): it never rests on what is under it (AD r8 P2-1) */
			ptr.press = tt >= p.press;
		});
		/* the target can still move while the cursor is up (rows entering, the camera, async data): follow it frame by frame until the press ends */
		if (!p || !canvas || !live) return; /* frame-by-frame only while the story plays (a paused or offscreen film does no per-frame work) */
		let raf = 0;
		const follow = () => { const el = resolveTarget(p.target, canvas!, phone); if (el) { const pt = canvasPoint(el); if (Math.abs(pt.x - ptr.x) > 0.5 || Math.abs(pt.y - ptr.y) > 0.5) { ptr.x = pt.x; ptr.y = pt.y; } } raf = requestAnimationFrame(follow); };
		raf = requestAnimationFrame(follow);
		return () => cancelAnimationFrame(raf);
	});
	/** The approval confirm is the product's REAL popover, opened by pressing the real Approve, and its open state is a pure function of `t` (so a seek lands on it too).
	 *  It is never confirmed by a click (grantApproval would write an optimistic "Deploying" row, TRUTH defect; the story's CRs carry the outcome): it is closed at the press. */
	$effect(() => {
		const want = confirmOpen(t);
		void shown; void eventIdx;
		untrack(() => {
			if (!canvas) return;
			/* only on the surface that owns the button: a seek lands here before the new surface is shown */
			if (want && !approvalUi.ask && shown === CONFIRM_SURF) {
				const el = resolveTarget('approve', canvas, phone) as HTMLElement | null;
				if (el) { el.click(); const a = approvalUi.ask; if (a) { if (phone) { const c = canvas.getBoundingClientRect(), r = el.getBoundingClientRect(); a.anchor = { top: (r.top - c.top) / k, left: (r.left - c.left) / k, right: (r.right - c.left) / k, bottom: (r.bottom - c.top) / k }; } else { const r = relRect(el), gw = group?.offsetWidth ?? 1440, l = Math.min(r.x, r.x + r.w - 320, gw - 16 - 320); /* the layer lives in the camera wrapper: group space, so it sits under ITS button at any zoom; the 320 px panel ends at the button's right edge (scene lane 3: left-aligned, the button at the page's right edge pushed it out of the window) */ a.anchor = { top: r.y, left: l, right: l + 320, bottom: r.y + r.h }; } } }
			} else if (!want && approvalUi.ask) approvalUi.ask = null;
		});
	});

	/* ---- the NEW tag (owner 2026-11-12): the product's own chip (role "newest", the mint the product prints a current build in) on the release's line in the
	   Builds card, from the release to the loop's end. Landing chrome placed against the product's DOM (nothing injected into it); it shines once as it lands. ---- */
	const NEW_BUILD = '4.46.0-46';
	let tag = $state<{ x: number; y: number } | null>(null);
	let newRow = $state<{ x: number; y: number; w: number; h: number } | null>(null); /* lane 36 (AD r1 P2-3): the release's row carries a soft mint wash (landing chrome, like the tag): the protagonist was the quietest row on the card */
	$effect(() => {
		const tt = t; void shown; void eventIdx; void hid;
		untrack(() => {
			if (tt < NEW_AT || shown !== 'app' || !group) { tag = null; newRow = null; return; }
			/* on the release's own line, after its title (the id's 96 px column has no room for a chip: beside the id it covered the title) */
			const li = group.querySelector<HTMLElement>(`li[data-truth-build="${NEW_BUILD}"]`), el = li?.querySelector<HTMLElement>('.s-ttl') ?? li?.querySelector<HTMLElement>('.s-id');
			if (!el) { tag = null; newRow = null; return; }
			{ const lr = relRect(li!), head = li!.firstElementChild ? relRect(li!.firstElementChild) : lr; const nr = { x: lr.x - 6, y: lr.y - 2, w: lr.w + 12, h: Math.min(lr.h, head.h) + 4 }; if (!newRow || Math.abs(newRow.y - nr.y) > 0.5 || Math.abs(newRow.w - nr.w) > 0.5 || Math.abs(newRow.h - nr.h) > 0.5) newRow = nr; }
			const rg = document.createRange(); rg.selectNodeContents(el); const q = [...rg.getClientRects()].filter((b) => b.width > 2).pop();
			if (!q) { tag = null; return; }
			const g = group.getBoundingClientRect(), u = unit(), x = (q.right - g.left) / u + 8, y = (q.top - g.top) / u + q.height / u / 2 - 10;
			if (!tag || Math.abs(tag.x - x) > 0.5 || Math.abs(tag.y - y) > 0.5) tag = { x, y };
		});
	});
	const tagFresh = $derived(t >= NEW_SHINE && t < NEW_SHINE + 1.3); /* lane 35: the tag is there from the first frame; it shines once after the wrap dissolve */

	const crumbs = $derived(surf === 'change' ? ['Changes', 'checkout-api #112'] : surf === 'rollouts' ? ['Rollouts'] : surf === 'envs' ? ['Environments'] : surf === 'app' ? ['Apps', 'checkout-api'] : ['Rollouts', 'checkout-api']);
	const tally = $derived(tallyShown(t));
	const fill = $derived(chapterFill(t));
	void CHAPTERS;
</script>

<div class="film" class:film-noconfirm={surf !== CONFIRM_SURF} bind:this={host} bind:clientWidth={W} bind:clientHeight={H}>
	<div class="film-frame">
		<div class="film-canvas" inert aria-hidden="true" bind:this={canvas} style="width:{CW}px;height:{CH}px;zoom:{k}">
			<div class="film-app">
				{#if !phone}<div class="film-side">{#if Side}<Side />{/if}<i class="film-shade" class:film-shade-on={shellDim}></i></div>{/if}
				<div class="film-col">
					<div class="film-top"><WindowBar crumbs={crumbs} narrow={phone} keep={2} /><i class="film-shade" class:film-shade-on={shellDim}></i></div>
					<main class="film-main" bind:this={main}>
						<div class="film-cam" bind:this={camEl} style={camStyle}>
							<div class="film-group" bind:this={group} data-hid={hid ? '1' : null} style="opacity:{hid ? 0 : swapOpacity}; transition:{fadeIn && !hid ? 'opacity .2s ease-out' : 'none'}">
								{#if Comp}<Comp {...props} />{/if}
								{#if tag && newRow}<i class="film-new-row" style="left:{newRow.x}px;top:{newRow.y}px;width:{newRow.w}px;height:{newRow.h}px"></i>{/if}
								{#if tag}<span class="film-new" class:film-new-fresh={tagFresh && !reduced} style="left:{tag.x}px;top:{tag.y}px"><Chip role="newest" label="New" dot={false} /></span>{/if}
								{#if hole}<div class="film-hole" class:film-hole-on={holeOn && !lifted} style="left:{hole.x}px;top:{hole.y}px;width:{hole.w}px;height:{hole.h}px;border-radius:{hole.r}px"></div>{/if}
							</div>
							{#if Layer && !phone}<Layer />{/if}
						</div>
					</main>
				</div>
				{#if phone}<div class="film-tabs">{#if Tabs}<Tabs />{/if}<i class="film-shade" class:film-shade-on={shellDim}></i></div>{/if}
			</div>
			{#if Layer && phone}<Layer />{/if}
			<Cursor x={ptr.x} y={ptr.y} on={ptr.on} press={ptr.press} touch={phone} />
		</div>
	</div>
	<Chrome {t} {lit} {fill} {reduced} playing={userPlaying} narrow={phone} tight={!phone && W < 1000} {tally} {onseek} {ontoggle} />
</div>

<style>
	.film { position: relative; width: 100%; height: 100%; }
	.film-frame { position: relative; height: 100%; overflow: hidden; border-radius: 11px; background: var(--k-ground); transition: opacity 0.4s ease-in; }
	.film-fade { opacity: 0; }
	/* the canvas is a real dashboard viewport: its width answers the compiled `sm:`/`lg:` queries (container "kc"), `fixed` children (confirm, sheet, bottom nav) anchor to it */
	.film-canvas { position: relative; container-type: inline-size; container-name: kc; overflow: hidden; background: var(--k-ground); contain: layout paint; }
	.film-app { display: flex; height: 100%; flex-direction: row; background: var(--k-ground); }
	.film-side { display: flex; flex-shrink: 0; width: 3.5rem; } /* the product's collapsed rail (56 px) */
	.film-col { display: flex; flex-direction: column; min-width: 0; flex: 1 1 0; }
	.film-top { flex: none; }
	.film-main { position: relative; flex: 1 1 0; min-height: 0; overflow: hidden; }
	.film-cam { position: absolute; left: 0; top: 0; width: 100%; height: 100%; transform-origin: 0 0; }
	.film-group { position: relative; min-width: 0; }
	/* THE dim (one value in every theme and width): the product's ink at 38%. The hole (.film-hole) is a box whose spread shadow dims everything round it, so its own rect and corner radius are the target's; the shell is dimmed by a plain layer of the same colour. */
	/* scene lane 3 (RAILWAY.md 2: the rest of the canvas drops to 30-40%): the dim is a VEIL of the window's own ground at 62%, so a light page fades toward white
	   (an ink dim read as a grey page) and a dark one toward its near-black; the lit box keeps a hairline so a white card on a white veil still has an edge */
	.film-frame { --film-dim: color-mix(in srgb, var(--k-ground) 62%, transparent); --film-ring: rgb(12 20 26 / 0.10); }
	:global(.dark) .film-frame { --film-dim: color-mix(in srgb, var(--k-ground) 62%, transparent); --film-ring: rgb(255 255 255 / 0.10); }
	.film-hole { position: absolute; z-index: 4; pointer-events: none; box-shadow: 0 0 0 1px var(--film-ring), 0 0 0 4000px var(--film-dim); opacity: 0; transition: opacity 0.2s ease-out; }
	.film-hole-on { opacity: 1; }
	.film-side, .film-top { position: relative; }
	.film-frame { --film-shade: var(--film-dim); } /* scene lane 3: the shell takes the same veil as the page (a ground veil never reads as a grey slab) */
	:global(.dark) .film-frame { --film-shade: var(--film-dim); }
	.film-shade { position: absolute; inset: 0; z-index: 6; pointer-events: none; background: var(--film-shade); opacity: 0; transition: opacity 0.2s ease-out; }
	.film-shade-on { opacity: 1; }
	:global(.fm-panel header) { position: sticky; top: 0; z-index: 5; background-color: var(--k-surface); } /* the sheet's title stays while its body scrolls */
	/* the product's own toast ("Successfully pinned and deployed version", fixed bottom-right / top on a phone) rides the camera over the page the story is about to show: the dialog's close is the confirmation here */
	.film-canvas :global([role="status"][class*="z-[60]"]) { display: none !important; }
	/* the NEW tag: lands with a short rise and one light sweep across it (the shine), then sits still */
	.film-new { position: absolute; z-index: 2; pointer-events: none; display: inline-flex; overflow: hidden; border-radius: 4px; }
	/* lane 36 (AD r1 P2-3): the chip is an outline (no fill), so a white sweep was invisible; the sweep is the chip's own success ink, slower, and the tag glows once (readable at 390 and at 10 fps) */
	.film-new-fresh { animation: film-new-glow 1.3s ease-out both; }
	.film-new-fresh::after { content: ''; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 15%, color-mix(in srgb, var(--k-success-fg) 45%, transparent) 45%, transparent 75%); transform: translateX(-120%); animation: film-new-shine 1.1s ease-in-out both; }
	@keyframes film-new-shine { to { transform: translateX(120%); } }
	@keyframes film-new-glow { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--k-success-fg) 0%, transparent); } 35% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--k-success-fg) 30%, transparent); } 100% { box-shadow: 0 0 0 7px color-mix(in srgb, var(--k-success-fg) 0%, transparent); } }
	.film-new-row { position: absolute; z-index: 1; pointer-events: none; border-radius: 6px; background: color-mix(in srgb, var(--k-success-fg) 7%, transparent); }
	/* lane 36 (AD r1 P3-2): the Holding card's held-HERE count waits on a per-place detail the film's App surface never asks for; its pending bar read as a stuck skeleton under Builds */
	.film-canvas :global([data-held-pending]) { visibility: hidden; }
	/* lane 36: once the cut to the Overview has started, the real confirm (and its phone scrim) is gone at once: the still carries its copy, and its own fly-out ran over the incoming page */
	.film-noconfirm :global([data-approve-confirm]), .film-noconfirm :global(:has(+ [data-approve-confirm])) { display: none !important; }
	.film-tabs { position: absolute; left: 0; right: 0; bottom: 0; z-index: 5; }
</style>
