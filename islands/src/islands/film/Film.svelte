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
	import { setDisplayTimeZone } from '$lib/timezone.svelte';
	import { rollbackOpen } from './script';
	setDisplayTimeZone('utc'); // the chrome clock is UTC, and so is every absolute time the product prints

	let { t, playing, reduced, onseek, ontoggle, eventIdx }: { t: number; playing: boolean; reduced: boolean; onseek: (chip: number) => void; ontoggle: () => void; eventIdx: number } = $props();

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
	const fading = $derived(!reduced && t >= FADE_AT);
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
	async function show(next: Surf, instant: boolean) {
		const seq = ++swapSeq;
		const c = await loadSurface(next);
		if (seq !== swapSeq) return;
		if (!instant && shown) { swapOpacity = 0; await new Promise((r) => setTimeout(r, 120)); if (seq !== swapSeq) return; }
		Object.assign(page, SURFACE_PATH[next]);
		Comp = c; shown = next;
		await tick();
		swapOpacity = 1;
	}
	let lastT = -1;
	$effect(() => {
		const s = surf, tt = t;
		const jumped = Math.abs(tt - lastT) > 0.4 || lastT < 0;
		lastT = tt;
		untrack(() => { if (s !== shown) void show(s, jumped || reduced); });
	});
	const props = $derived(shown ? surfaceProps(shown, eventIdx) : {});

	/* ---- the camera: transform only, on the content group; the shell stays put and dims ---- */
	let main: HTMLElement | undefined = $state();
	let group: HTMLElement | undefined = $state();
	let cam = $state({ x: 0, y: 0, s: 1, dur: 0, ease: 'ease', moving: false });
	let dimHole = $state<{ x: number; y: number; w: number; h: number } | null>(null);
	let moveKey = '';
	let moveTimer: ReturnType<typeof setTimeout> | undefined;
	const unit = () => (group && group.offsetWidth ? group.getBoundingClientRect().width / group.offsetWidth : 1);
	function relRect(el: Element) {
		const g = group!.getBoundingClientRect(), r = el.getBoundingClientRect(), u = unit();
		return { x: (r.left - g.left) / u, y: (r.top - g.top) / u, w: r.width / u, h: r.height / u };
	}
	function aim(m: Move, jump: boolean) {
		if (!group || !main) return;
		const vw = main.clientWidth, vh = main.clientHeight, gw = group.offsetWidth, gh = group.offsetHeight;
		const el = m.to === 'rest' ? null : resolveTarget(m.to, group, phone);
		let x = 0, y = 0, s = m.s;
		if (el) {
			const r = relRect(el);
			if (phone) { s = 1; y = -Math.max(0, r.y - 10); }
			else if (s === 1 && m.dim === 'page') { y = -Math.max(0, Math.min(r.y - 24, gh - vh)); }
			else if (s === 1) { x = m.to === 'health-checks' ? -96 : 0; }
			else { s = Math.min(m.s, (vw * 0.94) / r.w, (vh * 0.94) / r.h); x = vw / 2 - s * (r.x + r.w / 2); y = vh / 2 - s * (r.y + r.h / 2); }
		}
		x = Math.min(0, Math.max(Math.min(0, vw - s * gw), x));
		y = Math.min(0, Math.max(Math.min(0, vh - s * gh), y));
		const dur = jump || reduced ? 0 : phone ? (m.dur ? 320 : 0) : m.dur;
		cam = { x, y, s, dur, ease: phone ? 'cubic-bezier(0.2, 0.8, 0.2, 1)' : m.ease, moving: dur > 0 };
		clearTimeout(moveTimer);
		if (dur > 0) moveTimer = setTimeout(() => { cam = { ...cam, moving: false }; }, dur + 40);
		/* the dim hole: everything but the target at 35% (an opacity layer, never a filter) */
		dimHole = el && m.dim === 'page' ? relRect(el) : null;
	}
	/* a move starts when the story reaches its keyframe, or the surface under it changed (re-aim once its layout has settled) */
	$effect(() => {
		const m = mv, s = shown, ei = eventIdx, tt = t;
		void s; void ei;
		untrack(() => {
			const kk = `${CAMERA_INDEX(m)}|${s}|${ei}|${phone}`;
			if (kk === moveKey) return;
			const first = !moveKey.startsWith(`${CAMERA_INDEX(m)}|`);
			moveKey = kk;
			const jump = Math.abs(tt - lastAim) > 0.4;
			lastAim = tt;
			void tick().then(() => requestAnimationFrame(() => requestAnimationFrame(() => aim(m, jump || (!first && true && false)))));
		});
	});
	let lastAim = -1;
	function CAMERA_INDEX(m: Move) { return m.at; }
	const camStyle = $derived(cam.s === 1 && cam.x === 0 && cam.y === 0 && !cam.moving ? 'transform:none' : `transform: translate3d(${cam.x}px, ${cam.y}px, 0) scale(${cam.s}); transition: transform ${cam.dur}ms ${cam.ease}; will-change: ${cam.moving ? 'transform' : 'auto'}`);
	const shellDim = $derived(!reduced && mv.dim === 'shell');

	/* ---- the cursor: canvas px; the real click is dispatched at `press` ---- */
	let canvas: HTMLElement | undefined = $state();
	let ptr = $state({ x: 0, y: 0, on: false, press: false });
	function canvasPoint(el: Element) {
		const c = canvas!.getBoundingClientRect(), r = el.getBoundingClientRect();
		return { x: (r.left - c.left + r.width * 0.6) / k, y: (r.top - c.top + r.height * 0.6) / k };
	}
	$effect(() => {
		const p = press, tt = t;
		void shown; void swapOpacity; void eventIdx; void Comp; /* re-aim once the surface under the cursor has been shown and laid out (a seek lands before it) */
		untrack(() => {
			if (!p || !canvas) { ptr.on = false; ptr.press = false; return; }
			const el = resolveTarget(p.target, canvas, phone);
			if (el) { const pt = canvasPoint(el); ptr.x = pt.x; ptr.y = pt.y; }
			ptr.on = tt < p.off - 0.1;
			ptr.press = tt >= p.press;
		});
	});
	/** The two confirms are the product's REAL dialogs, opened by pressing the real buttons, and their open state is a pure function of `t` (so a seek lands on them too):
	 *  the approval confirm between the two Approve presses (anchored in canvas px), the rollback dialog between the banner's Roll back and Continue.
	 *  Neither dialog's own confirm is clicked: the story's CRs carry the outcome (grantApproval would write an optimistic "Deploying" row, TRUTH defect). */
	let rbOpen = false;
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
			if (wantRb && !rbOpen && shown === 'overview') { const el = resolveTarget('banner-rollback', canvas, phone); if (el) { el.click(); rbOpen = true; } }
			else if (!wantRb && rbOpen) { resolveTarget('modal-cancel', canvas, phone)?.click(); rbOpen = false; }
		});
	});

	const crumbs = $derived(surf === 'change' ? ['Changes', 'checkout-api #112'] : surf === 'rollouts' ? ['Rollouts'] : surf === 'envs' ? ['Environments'] : ['Rollouts', 'checkout-api']);
	const tally = $derived(tallyShown(t));
	const fill = $derived(chapterFill(t));
	void CHAPTERS;
</script>

<div class="film" bind:this={host} bind:clientWidth={W} bind:clientHeight={H}>
	<div class="film-frame" class:film-fade={fading}>
		<div class="film-canvas" bind:this={canvas} style="width:{CW}px;height:{CH}px;transform:scale({k})">
			<div class="film-app">
				{#if !phone}<div class="film-side" class:film-dim={shellDim}>{#if Side}<Side />{/if}</div>{/if}
				<div class="film-col">
					<div class="film-top" class:film-dim={shellDim}><WindowBar crumbs={crumbs} narrow={phone} keep={2} /></div>
					<main class="film-main" bind:this={main}>
						<div class="film-group" bind:this={group} style="{camStyle}; opacity:{swapOpacity}; {swapOpacity ? 'transition: transform ' + cam.dur + 'ms ' + cam.ease + ', opacity .2s ease-out' : 'transition: opacity .12s ease-in'}">
							{#if Comp}<Comp {...props} />{/if}
							<div class="film-dimmer" class:film-dimmer-on={!reduced && mv.dim === 'page' && !!dimHole} style={dimHole ? `clip-path: polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${dimHole.x}px ${dimHole.y}px, ${dimHole.x}px ${dimHole.y + dimHole.h}px, ${dimHole.x + dimHole.w}px ${dimHole.y + dimHole.h}px, ${dimHole.x + dimHole.w}px ${dimHole.y}px, ${dimHole.x}px ${dimHole.y}px)` : ''}></div>
						</div>
					</main>
				</div>
				{#if phone}<div class="film-tabs" class:film-tabs-dim={shellDim}>{#if Tabs}<Tabs />{/if}</div>{/if}
			</div>
			{#if Layer}<Layer />{/if}
			<Cursor x={ptr.x} y={ptr.y} on={ptr.on} press={ptr.press} touch={phone} />
		</div>
	</div>
	<Chrome {t} {lit} {fill} {reduced} {playing} narrow={phone} {tally} {onseek} {ontoggle} />
</div>

<style>
	.film { position: relative; width: 100%; height: 100%; }
	.film-frame { position: relative; height: 100%; overflow: hidden; border-radius: inherit; background: var(--k-ground); transition: opacity 0.4s ease-in; }
	.film-fade { opacity: 0; }
	/* the canvas is a real dashboard viewport: its width answers the compiled `sm:`/`lg:` queries (container "kc"), `fixed` children (confirm, sheet, bottom nav) anchor to it */
	.film-canvas { position: relative; transform-origin: 0 0; container-type: inline-size; container-name: kc; overflow: hidden; background: var(--k-ground); contain: layout paint; }
	.film-app { display: flex; height: 100%; flex-direction: row; background: var(--k-ground); }
	.film-side { display: flex; flex-shrink: 0; width: 14.5rem; transition: opacity 0.434s ease; }
	.film-col { display: flex; flex-direction: column; min-width: 0; flex: 1 1 0; }
	.film-top { flex: none; transition: opacity 0.434s ease; }
	.film-main { position: relative; flex: 1 1 0; min-height: 0; overflow: hidden; }
	.film-group { position: relative; transform-origin: 0 0; min-width: 0; }
	.film-dim { opacity: 0.25; }
	/* the phone's bottom nav is opaque and sits over the page: dim its contents, never the bar (a 25% bar lets the page show through) */
	.film-tabs-dim :global(nav > *) { opacity: 0.25; }
	.film-tabs :global(nav > *) { transition: opacity 0.434s ease; }
	.film-dimmer { position: absolute; inset: 0; background: var(--k-ground); opacity: 0; pointer-events: none; transition: opacity 0.2s ease-out; z-index: 4; }
	.film-dimmer-on { opacity: 0.65; }
	.film-tabs { position: absolute; left: 0; right: 0; bottom: 0; z-index: 5; }
</style>
