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
	import { page } from '../../stubs/app-state';
	import { page as pageStore } from '../../stubs/app-stores';
	import { setDisplayTimeZone } from '$lib/timezone.svelte';
	import { rollbackOpen, REASON, TYPING, typedLen } from './script';
	setDisplayTimeZone('utc'); // the chrome clock is UTC, and so is every absolute time the product prints

	let { t, playing, userPlaying, reduced, onseek, ontoggle, eventIdx }: { t: number; playing: boolean; reduced: boolean; onseek: (chip: number) => void; ontoggle: () => void; eventIdx: number; userPlaying: boolean } = $props();

	let host: HTMLElement | undefined = $state();
	let W = $state(1120), H = $state(640);
	/* the canvas: a real dashboard at a real width. Phone 390 (the bottom nav layout), tablet 800, desktop 1440; scaled into the window */
	const CW = $derived(W >= 1000 ? 1440 : W >= 600 ? 800 : 390);
	const k = $derived(W / CW);
	const CH = $derived(H / k);
	const phone = $derived(CW < 640);

	const surf = $derived<Surf>(surfAt(t));
	const lit = $derived(chapterAt(t));
	const mv = $derived<Move>(moveAt(t));
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
	async function show(next: Surf, instant: boolean) {
		const seq = ++swapSeq;
		swapping = next;
		const c = await loadSurface(next);
		if (seq !== swapSeq) return;
		if (!instant && shown) { swapOpacity = 0.4; /* the outgoing page dims, it never goes to empty ground: a slow incoming chunk must not leave a blank window */ await new Promise((r) => setTimeout(r, 120)); if (seq !== swapSeq) return; }
		Object.assign(page, SURFACE_PATH[next]);
		pageStore.update((p) => ({ ...p, ...SURFACE_PATH[next] })); // the History tab reads get(page) of $app/stores (not $app/state)
		Comp = c; shown = next;
		await tick();
		swapOpacity = 1;
		if (seq === swapSeq) swapping = null;
	}
	let lastT = -1;
	$effect(() => {
		const s = surf, tt = t;
		const wrap = lastT > 40 && tt < 2; /* the loop's end into its start: animated, not a seek */
		const jumped = (Math.abs(tt - lastT) > 0.4 && !wrap) || lastT < 0;
		lastT = tt;
		untrack(() => { if (s !== shown && s !== swapping) void show(s, jumped || reduced); });
	});
	const props = $derived(shown ? surfaceProps(shown, eventIdx) : {});

	/* ---- the camera: transform only, on the content group; the shell stays put and dims ---- */
	let main: HTMLElement | undefined = $state();
	let group: HTMLElement | undefined = $state();
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
	let refineTimer: ReturnType<typeof setTimeout> | undefined;
	function aim(m: Move, jump: boolean, refine = false) {
		if (!group || !main) return;
		/* reduced motion: no camera at all (STORYBOARD section 9): every frame is the unzoomed, unscrolled page */
		if (reduced) { cam = { x: 0, y: 0, s: 1, dur: 0, ease: 'ease', moving: false }; holeOn = false; shadeOn = false; return; }
		const vw = main.clientWidth, vh = main.clientHeight, gw = group.offsetWidth, gh = group.offsetHeight;
		const el = m.to === 'rest' ? null : resolveTarget(m.to, group, phone);
		let x = 0, y = 0, s = m.s;
		if (el) {
			const r = relRect(el);
			if (phone) { s = 1; y = -Math.max(0, r.y - 10); }
			else if (s === 1 && m.dim === 'page') { y = -Math.max(0, Math.min(r.y - 24, gh - vh)); }
			else if (s === 1) { x = m.to === 'health-checks' ? -96 : 0; }
			else { /* fit with a 14 px margin: the product's gap between cards is >= 12 px x scale, so a neighbour never peeks into the frame mid-word */ s = Math.max(1, Math.min(m.s, (vw - 28) / r.w)); /* width-fit only: a target taller than the window may exceed it (centred), the zoom keeps the planned depth */ x = vw / 2 - s * (r.x + r.w / 2); y = vh / 2 - s * (r.y + r.h / 2); }
		}
		x = Math.min(0, Math.max(Math.min(0, vw - s * gw), x));
		y = Math.min(0, Math.max(Math.min(0, vh - s * gh), y));
		/* the ONE dim (L1/L2): the product's ink at 38% over everything but the target, shell included. The hole is the target's own rect and corner radius. */
		const wantDim = !!el && !!m.dim && !reduced;
		shadeOn = wantDim;
		const next = wantDim ? holeOf(el!) : null;
		clearTimeout(holeTimer);
		if (!next) holeOn = false;
		else if (refine || !holeOn || !hole) { hole = next; holeOn = true; }
		else { /* a pan between two targets: the dim lets go while the camera travels (a hole that rides the old target would spotlight the wrong content), then closes on the new one */
			holeOn = false; const dd = jump ? 0 : (phone ? 320 : m.dur); holeTimer = setTimeout(() => { hole = next; holeOn = true; }, dd * 0.7);
		}
		if (refine && Math.abs(x - cam.x) < 6 && Math.abs(y - cam.y) < 6 && Math.abs(s - cam.s) < 0.02) return;
		const dur = jump || reduced ? 0 : refine ? 260 : phone ? (m.dur ? 320 : 0) : m.dur;
		cam = { x, y, s, dur, ease: phone ? 'cubic-bezier(0.2, 0.8, 0.2, 1)' : m.ease, moving: dur > 0 };
		clearTimeout(moveTimer);
		if (dur > 0) moveTimer = setTimeout(() => { cam = { ...cam, moving: false }; }, dur + 40);
		/* the product's own enter animations (banners opening, cards collapsing) keep moving the target for ~0.5 s after a move starts: re-aim once they have settled */
		clearTimeout(refineTimer);
		if (!refine && el && !reduced) refineTimer = setTimeout(() => aim(m, false, true), 650);
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
	const camStyle = $derived(cam.s === 1 && cam.x === 0 && cam.y === 0 && !cam.moving ? 'transform:none' : `transform: translate3d(${cam.x}px, ${cam.y}px, 0) scale(${cam.s}); transition: transform ${cam.dur}ms ${cam.ease}; will-change: ${cam.moving ? 'transform' : 'auto'}`);
	const shellDim = $derived(shadeOn && !reduced);

	/* ---- the cursor: canvas px; the real click is dispatched at `press` ---- */
	let canvas: HTMLElement | undefined = $state();
	let ptr = $state({ x: 0, y: 0, on: false, press: false });
	function canvasPoint(el: Element) {
		const c = canvas!.getBoundingClientRect(), r = el.getBoundingClientRect();
		return { x: (r.left - c.left + r.width * 0.6) / k, y: (r.top - c.top + r.height * 0.6) / k };
	}
	$effect(() => {
		const p = press, tt = t, live = playing;
		void shown; void swapOpacity; void eventIdx; void Comp; /* re-aim once the surface under the cursor has been shown and laid out (a seek lands before it) */
		untrack(() => {
			if (!p || !canvas) { ptr.on = false; ptr.press = false; return; }
			const el = resolveTarget(p.target, canvas, phone);
			if (el) { const pt = canvasPoint(el); ptr.x = pt.x; ptr.y = pt.y; }
			ptr.on = tt < p.off - 0.1;
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
	 *  Neither dialog's own confirm is clicked: the story's CRs carry the outcome (grantApproval would write an optimistic "Deploying" row, TRUTH defect). */
	let rbOpen = false, pressedGo = false, dlgTick = $state(0);
	$effect(() => { if (t < 34) pressedGo = false; });
	$effect(() => {
		const want = confirmOpen(t), wantRb = rollbackOpen(t);
		void shown; void eventIdx;
		untrack(() => {
			if (!canvas) return;
			/* only on the surface that owns the button: a seek lands here before the new surface is shown, and the old page may carry a link with the same words (a real navigation of the host page) */
			if (want && !approvalUi.ask && shown === 'rollouts') {
				const el = resolveTarget('approve', canvas, phone) as HTMLElement | null;
				if (el) { el.click(); const a = approvalUi.ask; if (a) { const c = canvas.getBoundingClientRect(), r = el.getBoundingClientRect(); a.anchor = { top: (r.top - c.top) / k, left: (r.left - c.left) / k, right: (r.right - c.left) / k, bottom: (r.bottom - c.top) / k }; } }
			} else if (!want && approvalUi.ask) approvalUi.ask = null;
			if (wantRb && !rbOpen && shown === 'overview') { const el = resolveTarget('banner-rollback', canvas, phone); if (el) { el.click(); rbOpen = true; void tick().then(() => requestAnimationFrame(() => (dlgTick += 1))); } }
			else if (wantRb && rbOpen && t >= 38.7 && !pressedGo) { const go = resolveTarget('modal-continue', canvas, phone) as HTMLButtonElement | null; if (go && !go.disabled) { pressedGo = true; rbOpen = false; go.click(); } }
			else if (!wantRb && rbOpen) { resolveTarget('modal-cancel', canvas, phone)?.click(); rbOpen = false; }
		});
	});

	/* the prod ceremony's two fields are typed from `t` (a pure function: a seek lands on the right half-typed text): set the value and tell the product's binding */
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
			typeInto(resolveTarget('modal-confirm', canvas, phone) as HTMLInputElement | null, v.slice(0, typedLen(tt, TYPING.confirm, v.length)));
		});
	});

	const crumbs = $derived(surf === 'change' ? ['Changes', 'checkout-api #112'] : surf === 'rollouts' ? ['Rollouts'] : surf === 'envs' ? ['Environments'] : ['Rollouts', 'checkout-api']);
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
						<div class="film-group" bind:this={group} style="{camStyle}; opacity:{swapOpacity}; {swapOpacity ? 'transition: transform ' + cam.dur + 'ms ' + cam.ease + ', opacity .2s ease-out' : 'transition: opacity .12s ease-in'}">
							{#if Comp}<Comp {...props} />{/if}
							{#if hole}<div class="film-hole" class:film-hole-on={holeOn} style="left:{hole.x}px;top:{hole.y}px;width:{hole.w}px;height:{hole.h}px;border-radius:{hole.r}px"></div>{/if}
						</div>
					</main>
				</div>
				{#if phone}<div class="film-tabs">{#if Tabs}<Tabs />{/if}<i class="film-shade" class:film-shade-on={shellDim}></i></div>{/if}
			</div>
			{#if Layer}<Layer />{/if}
			<Cursor x={ptr.x} y={ptr.y} on={ptr.on} press={ptr.press} touch={phone} />
		</div>
	</div>
	<Chrome {t} {lit} {fill} {reduced} playing={userPlaying} narrow={phone} {tally} {onseek} {ontoggle} />
</div>

<style>
	.film { position: relative; width: 100%; height: 100%; }
	.film-frame { position: relative; height: 100%; overflow: hidden; border-radius: inherit; background: var(--k-ground); transition: opacity 0.4s ease-in; }
	.film-fade { opacity: 0; }
	/* the canvas is a real dashboard viewport: its width answers the compiled `sm:`/`lg:` queries (container "kc"), `fixed` children (confirm, sheet, bottom nav) anchor to it */
	.film-canvas { position: relative; container-type: inline-size; container-name: kc; overflow: hidden; background: var(--k-ground); contain: layout paint; }
	.film-app { display: flex; height: 100%; flex-direction: row; background: var(--k-ground); }
	.film-side { display: flex; flex-shrink: 0; width: 14.5rem; }
	.film-col { display: flex; flex-direction: column; min-width: 0; flex: 1 1 0; }
	.film-top { flex: none; }
	.film-main { position: relative; flex: 1 1 0; min-height: 0; overflow: hidden; }
	.film-group { position: relative; transform-origin: 0 0; min-width: 0; }
	/* THE dim (one value in every theme and width): the product's ink at 38%. The hole (.film-hole) is a box whose spread shadow dims everything round it, so its own rect and corner radius are the target's; the shell is dimmed by a plain layer of the same colour. */
	.film-frame { --film-dim: rgb(12 20 26 / 0.38); }
	.film-hole { position: absolute; z-index: 4; pointer-events: none; box-shadow: 0 0 0 4000px var(--film-dim); opacity: 0; transition: opacity 0.2s ease-out; }
	.film-hole-on { opacity: 1; }
	.film-side, .film-top { position: relative; }
	.film-shade { position: absolute; inset: 0; z-index: 6; pointer-events: none; background: var(--film-dim); opacity: 0; transition: opacity 0.2s ease-out; }
	.film-shade-on { opacity: 1; }
	.film-tabs { position: absolute; left: 0; right: 0; bottom: 0; z-index: 5; }
</style>
