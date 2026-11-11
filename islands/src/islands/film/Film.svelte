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
	import { CHAPTERS, chapterAt, chapterFill, surfAt, moveAt, pressAt, confirmOpen, tallyShown, FADE_AT, type Surf, type Move } from './script';
	import { loadSurface, surfaceProps, SURFACE_PATH } from './surfaces';
	import { resolveTarget } from './targets';
import { snapFrame } from './snap';
import { flipRecord, flipPlay, type Pos } from './flip';
	import { page } from '../../stubs/app-state';
	import { page as pageStore } from '../../stubs/app-stores';
	import { setDisplayTimeZone } from '$lib/timezone.svelte';
	import { coverEvent, flipEvent, sheetClosing, rollbackOpen, REASON, TYPING, typedLen } from './script';
	setDisplayTimeZone('utc'); // the chrome clock is UTC, and so is every absolute time the product prints

	let { t, playing, userPlaying, reduced, onseek, ontoggle, onshown, eventIdx }: { t: number; playing: boolean; reduced: boolean; onseek: (chip: number) => void; ontoggle: () => void; onshown?: () => void; eventIdx: number; userPlaying: boolean } = $props();

	let host: HTMLElement | undefined = $state();
	let W = $state(1120), H = $state(640);
	/* the canvas: a real dashboard at a real width. Phone 390 (the bottom nav layout), tablet 800, desktop 1440; scaled into the window */
	const CW = $derived(W >= 1000 ? 1440 : W >= 600 ? 800 : 390);
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
		const pre = wrap && wrapCover && wrapCover === snapEl ? wrapCover : null; wrapCover = null;
		const copy = pre ? null : !instant && shown ? takeSnap() : null;
		if (copy) coverWith(copy);
		Object.assign(page, SURFACE_PATH[next]);
		pageStore.update((p) => ({ ...p, ...SURFACE_PATH[next] })); // the History tab reads get(page) of $app/stores (not $app/state)
		Comp = c; shown = next;
		await tick();
		if (!swapOpacity) setTimeout(() => (fadeIn = false), 300);
		swapOpacity = 1;
		onshown?.();
		if (pre) void settleThenReveal(pre, null, 300); /* the wrap is a real cross-fade, short: two pages superimposed read as a ghost */
		else if (copy) void settleThenReveal(copy);
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
		if (kind === 'event' && phone && sheetClosing(t)) c.querySelectorAll('.fm-scrim').forEach((e) => e.remove()); /* the press sends the sheet away: the still is the page (script.ts sheetClosing) */
		/* a clone does not carry scroll positions: the 390 rollback sheet (scrolled to its fields) came back at its top under the still (AD r8 P2-1). Copied once the still is in the document */
		const src = group.querySelectorAll('*'), dst = c.querySelectorAll('*'), sc: [Element, number, number][] = [];
		for (let i = 0; i < src.length; i++) if (src[i].scrollTop || src[i].scrollLeft) sc.push([dst[i], src[i].scrollTop, src[i].scrollLeft]);
		(c as any).__scroll = sc;
		return c;
	}
	function coverWith(c: HTMLElement) {
		snapEl?.remove(); snapEl = c; camEl!.insertBefore(c, group!.nextSibling); hid = true;
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
		hid = false; snapEl = null;
		/* a covered reflow on the phone: the still is dropped in one frame (no two layouts superimposed: the ghost) and what moved SLIDES from where it was to where it is (flip.ts, transform only: no layout shift) */
		if (rec) { c.remove(); void tick().then(() => { if (group && !swapping && !hid) flipPlay(group, rec, unit(), 300); }); return; }
		const done = () => c.remove();
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
			const wrapping = preT > 40 && tt < 2; preT = tt;
			if (!wrapping || !group || !camEl || !shown || reduced || surfAt(tt) === shown) return;
			const c = takeSnap(); if (!c) return;
			c.style.transformOrigin = '0 0'; c.style.transform = getComputedStyle(camEl).transform.replace('none', '');
			cam = { x: 0, y: 0, s: 1, dur: 0, ease: 'ease', moving: false }; holeOn = false; shadeOn = false;
			coverWith(c); wrapCover = c; preEi = ei; preSnap = null;
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
		const wrap = lastT > 40 && tt < 2; /* the loop's end into its start: animated, not a seek */
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
	function holeOf(el: Element) { const r = relRect(el); const rad = (el as any).__r ?? (parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0); return { ...r, r: rad }; }
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
	let refineTimer: ReturnType<typeof setTimeout> | undefined, refine2Timer: ReturnType<typeof setTimeout> | undefined, refine3Timer: ReturnType<typeof setTimeout> | undefined;
	function aim(m: Move, jump: boolean, refine = false) {
		if (!group || !main) return;
		/* reduced motion: no camera at all (STORYBOARD section 9): every frame is the unzoomed, unscrolled page */
		if (reduced) { cam = { x: 0, y: 0, s: 1, dur: 0, ease: 'ease', moving: false }; holeOn = false; shadeOn = false; return; }
		const vw = main.clientWidth, vh = main.clientHeight, gw = group.offsetWidth, gh = group.offsetHeight;
		const el = m.to === 'rest' || (phone && (m.to === 'modal-fields' || m.to === 'modal-top')) ? null : resolveTarget(m.to, camEl!, phone); /* phone: the rollback dialog is a full-screen sheet, there is nothing to zoom */
		let x = 0, y = 0, s = el ? m.s : 1; /* a target that is not on the page rests (never a blind zoom at the origin) */
		if (el) {
			const r = relRect(el);
			if (phone) { s = 1; y = -Math.max(0, r.y - 10); }
			else if (s === 1) { y = -Math.max(0, Math.min(r.y - 24, gh - vh)); }
			else {
				/* fit with a 14 px margin: the product's gap between cards is >= 12 px x scale, so a neighbour never peeks into the frame mid-word. The PERSON beats (m.min) zoom until their smallest text renders at m.min px, bounded by the window (both axes) and 2.4x. */
				const need = m.min ? m.min / (minFont(r) * k) : 0;
				s = Math.max(1, Math.min(Math.max(m.s, need), (vw - 28) / r.w, m.min ? (vh - 28) / r.h : Infinity, Math.max(2.4, m.s))); /* 2.4x, or a move's own wanted scale above it (the History card: 2.5x) */
				/* AD r4: a frame edge never slices a word. The origin slides (and the scale gives a little) until both edges sit in a gutter between the product's own text (snap.ts). Dialog beats snap against the dialog's text only. */
				const dlg = m.to.startsWith('modal');
					if (dlg && CW < 1000 && s < 1.12) { cam = { x: 0, y: 0, s: 1, dur: jump ? 0 : m.dur, ease: m.ease, moving: !jump }; holeOn = false; shadeOn = true; return; } /* a tablet canvas: the dialog fits the frame whole, nothing to zoom (the pan cut its title) */
					const tr = textRects(dlg), args = [vw, vh, gw, gh, s, Math.max(1, s * (m.min ? 0.93 : 0.86)), Math.min((vw - 28) / r.w, m.min ? (vh - 28) / r.h : Infinity, Math.max(2.4, m.s))] as const;
				let sn = dlg ? snapFrame(r, tr, ...args) : snapFrame(r, [...tr, ...boxRects(r)], vw, vh, gw, gh, s, Math.max(1, s * 0.9), Math.min(args[6], s * 1.25)); /* cards too, within a hair of the wanted zoom (a frame that only clears every card at 2.4x is a different shot) */
				if (!sn.ok && !dlg) sn = snapFrame(r, tr, ...args); /* no frame clears every card: words at least */
				s = sn.s; x = sn.x; y = sn.y;
				 (globalThis as any).__kfAim = { to: m.to, r, sn, vw, vh, gw, gh, refine }; /* even when no x position clears every word (ok = false) the y found for a clean top edge stands */
			}
		}
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
		if (!refine && el && !reduced) { refineTimer = setTimeout(() => aim(m, false, true), 650); refine2Timer = setTimeout(() => aim(m, false, true), 1500); } /* twice: the page keeps settling a little after the product's enter animations */
	}
	/* a move starts when the story reaches its keyframe, or the surface under it changed (re-aim once its layout has settled) */
	$effect(() => {
		const m = mv, s = shown, ei = eventIdx, tt = t;
		void s; void ei;
		const seek = Math.abs(tt - prevT) > 0.4 && !(prevT > 40 && tt < 2); prevT = tt; /* a jump is a seek, never a move the story plays itself (it was a hard cut every time: no transition ran) */
		untrack(() => {
			const kk = `${CAMERA_INDEX(m)}|${s}|${phone}`; /* the camera is LOCKED for the length of a move: a CR change inside a hold re-lays the page but never re-aims (it drifted 5x on the pipeline) */
			if (kk === moveKey) return;
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
	const shellDim = $derived((shadeOn || (!phone && cam.s > 1.05)) && !reduced);

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
	/** The two confirms are the product's REAL dialogs, opened by pressing the real buttons, and their open state is a pure function of `t` (so a seek lands on them too):
	 *  the approval confirm between the two Approve presses (anchored in canvas px), the rollback dialog between the banner's Roll back and Continue.
	 *  The approval confirm is never clicked (grantApproval would write an optimistic "Deploying" row, TRUTH defect; the story's CRs carry the outcome); the rollback dialog's own Roll back IS clicked at 38.7, which closes it the product's way. */
	let lastGoal: HTMLElement | null = null, scrollAt = 0;
	let rbOpen = false, pressedGo = false, pressedWarn = false, dlgTick = $state(0);
	$effect(() => { if (t < 34.4 || t >= 38.75) { pressedGo = false; pressedWarn = false; } }); /* re-armed whenever the dialog window is out of reach, so a paused seek back into it walks the whole way again */
	$effect(() => {
		const want = confirmOpen(t), wantRb = rollbackOpen(t);
		void shown; void eventIdx; void dlgTick; /* the dialogs open a frame after their button is pressed: a paused seek must still walk banner -> warning -> fields */
		untrack(() => {
			if (!canvas) return;
			/* only on the surface that owns the button: a seek lands here before the new surface is shown, and the old page may carry a link with the same words (a real navigation of the host page) */
			if (want && !approvalUi.ask && shown === 'rollouts') {
				const el = resolveTarget('approve', canvas, phone) as HTMLElement | null;
				if (el) { el.click(); const a = approvalUi.ask; if (a) { if (phone) { const c = canvas.getBoundingClientRect(), r = el.getBoundingClientRect(); a.anchor = { top: (r.top - c.top) / k, left: (r.left - c.left) / k, right: (r.right - c.left) / k, bottom: (r.bottom - c.top) / k }; } else { const r = relRect(el); /* the layer lives in the camera wrapper: group space, so it sits under ITS button at any zoom; the 320 px panel is left-aligned to the button (right = left + 320) */ a.anchor = { top: r.y, left: r.x, right: r.x + 320, bottom: r.y + r.h }; } } }
			} else if (!want && approvalUi.ask) approvalUi.ask = null;
			if (wantRb && !rbOpen && shown === 'overview') { const el = resolveTarget('banner-rollback', canvas, phone); if (el) { el.click(); rbOpen = true; void tick().then(() => requestAnimationFrame(() => (dlgTick += 1))); } }
			else if (wantRb && rbOpen && t >= 35.5 && !pressedWarn) { const w = resolveTarget('warn-continue', canvas, phone) as HTMLButtonElement | null; if (w && !w.disabled) { pressedWarn = true; w.click(); void tick().then(() => requestAnimationFrame(() => (dlgTick += 1))); } else if (!w && canvas.querySelector('.fm-panel textarea')) pressedWarn = true; }
			else if (wantRb && rbOpen && t >= 38.7 && !pressedGo) { const go = resolveTarget('modal-continue', canvas, phone) as HTMLButtonElement | null; if (go && !go.disabled) { pressedGo = true; rbOpen = false; go.click(); } }
			else if (!wantRb && rbOpen) { lastGoal = null; resolveTarget('modal-cancel', canvas, phone)?.click(); rbOpen = false; }
		});
	});

	/* the prod ceremony's two fields are typed from `t` (a pure function: a seek lands on the right half-typed text): set the value and tell the product's binding */
	const byTextEl = (root: ParentNode, re: RegExp) => [...root.querySelectorAll<HTMLElement>('.fm-panel button')].find((e) => re.test((e.textContent ?? '').trim())) ?? null;
	function typeInto(el: HTMLInputElement | HTMLTextAreaElement | null, text: string) {
		if (!el || el.value === text) return;
		el.value = text; el.dispatchEvent(new Event('input', { bubbles: true }));
	}
	$effect(() => {
		const tt = t, open = rollbackOpen(t);
		void shown; void eventIdx; void dlgTick;
		untrack(() => {
			if (!canvas || !open || shown !== 'overview') return;
			typeInto(resolveTarget('modal-reason', canvas, phone) as HTMLTextAreaElement | null, REASON.slice(0, typedLen(tt, TYPING.reason, REASON.length)));
			const v = canvas.querySelector('.fm-panel')?.textContent?.match(/Type\s+(\S+)\s+to confirm/)?.[1] ?? '4.45.0-45';
			/* phone: the sheet's body is taller than the sheet; a person scrolls to the fields before typing (the reason first, then down to the confirmation). Pure function of t, so a seek lands scrolled. */
			{
				const rEl = resolveTarget('modal-reason', canvas, phone), cEl = resolveTarget('modal-confirm', canvas, phone);
				let sc: HTMLElement | null = rEl?.parentElement ?? null; while (sc && !(sc.scrollHeight > sc.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement;
				const goal = tt >= 37.2 ? cEl : tt >= 35.9 ? rEl : null;
				if (sc && goal) {
					const a = sc.getBoundingClientRect(), g = goal.getBoundingClientRect(), u = a.height / sc.clientHeight || 1;
					/* the sheet's footer (Cancel / Roll back, under the scroller) grows by a "does not match yet" line once typing starts: the field is centred in the scroller as it will be THEN, so the footer never covers it and nothing jumps */
					const hd = sc.contains(canvas.querySelector('.fm-panel header')) ? 64 : 0 /* 64 =  the sticky dialog title (AD r6: it scrolled away while the reason was typed); a tablet's title sits above the scroller: nothing to clear */, avail = sc.clientHeight - hd - (/does not match/.test(canvas.querySelector('.fm-panel')?.textContent ?? '') ? 0 : 28);
					const want = Math.min(Math.max(0, sc.scrollTop + (g.top - a.top) / u - (hd + (avail - g.height / u) * 0.5)), Math.max(0, sc.scrollHeight - sc.clientHeight));
					if (goal !== lastGoal) { lastGoal = goal; scrollAt = tt; sc.scrollTo({ top: want, behavior: 'smooth' }); } else if (tt > scrollAt + 0.7 && Math.abs(want - sc.scrollTop) > 1) sc.scrollTop = want; /* held there while the footer's line comes and goes */
				}
			}
			typeInto(resolveTarget('modal-confirm', canvas, phone) as HTMLInputElement | null, v.slice(0, typedLen(tt, TYPING.confirm, v.length)));
		});
	});

	const crumbs = $derived(surf === 'change' ? ['Changes', 'checkout-api #112'] : surf === 'rollouts' ? ['Rollouts'] : surf === 'envs' ? ['Environments'] : surf === 'app' ? ['Apps', 'checkout-api'] : ['Rollouts', 'checkout-api']);
	const tally = $derived(tallyShown(t));
	const fill = $derived(chapterFill(t));
	void CHAPTERS;
</script>

<div class="film" bind:this={host} bind:clientWidth={W} bind:clientHeight={H}>
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
								{#if hole}<div class="film-hole" class:film-hole-on={holeOn} style="left:{hole.x}px;top:{hole.y}px;width:{hole.w}px;height:{hole.h}px;border-radius:{hole.r}px"></div>{/if}
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
	.film-side { display: flex; flex-shrink: 0; width: 14.5rem; }
	.film-col { display: flex; flex-direction: column; min-width: 0; flex: 1 1 0; }
	.film-top { flex: none; }
	.film-main { position: relative; flex: 1 1 0; min-height: 0; overflow: hidden; }
	.film-cam { position: absolute; left: 0; top: 0; width: 100%; height: 100%; transform-origin: 0 0; }
	.film-group { position: relative; min-width: 0; }
	/* THE dim (one value in every theme and width): the product's ink at 38%. The hole (.film-hole) is a box whose spread shadow dims everything round it, so its own rect and corner radius are the target's; the shell is dimmed by a plain layer of the same colour. */
	.film-frame { --film-dim: rgb(12 20 26 / 0.34); }
	:global(.dark) .film-frame { --film-dim: rgb(0 0 0 / 0.58); } /* ink on a dark page is invisible at 38%: the same perceived drop needs black, stronger */
	.film-hole { position: absolute; z-index: 4; pointer-events: none; box-shadow: 0 0 0 4000px var(--film-dim); opacity: 0; transition: opacity 0.2s ease-out; }
	.film-hole-on { opacity: 1; }
	.film-side, .film-top { position: relative; }
	.film-frame { --film-shade: rgb(12 20 26 / 0.15); } /* the shell recedes under the zoom: on a light page the full dim read as a heavy grey slab (AD r7) */
	:global(.dark) .film-frame { --film-shade: var(--film-dim); }
	.film-shade { position: absolute; inset: 0; z-index: 6; pointer-events: none; background: var(--film-shade); opacity: 0; transition: opacity 0.2s ease-out; }
	.film-shade-on { opacity: 1; }
	:global(.fm-panel header) { position: sticky; top: 0; z-index: 5; background-color: var(--k-surface); } /* the sheet's title stays while its body scrolls */
	/* the product's own toast ("Successfully pinned and deployed version", fixed bottom-right / top on a phone) rides the camera over the page the story is about to show: the dialog's close is the confirmation here */
	.film-canvas :global([role="status"][class*="z-[60]"]) { display: none !important; }
	.film-tabs { position: absolute; left: 0; right: 0; bottom: 0; z-index: 5; }
</style>
