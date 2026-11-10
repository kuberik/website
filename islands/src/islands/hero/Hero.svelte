<svelte:options runes={true} />
<script lang="ts">
	/**
	 * HERO WINDOW (SPEC 2.2). ROLE: the front page's one product frame: /apps/checkout-api as the product draws it while a build walks the places.
	 * REFERENCE REGION: `components/new/app/AppDetail.svelte`, composed from what it draws for these states (shared/app-page.ts re-runs its derivations):
	 * the header (glyph, 24 name, 20 mono build, the tab's pill, commit line, PromotionLane strip: PRODUCTION's, by pillOf), the StatementBanner when a place waits
	 * on a person or is checking (AA4: Approve lives there, `approveAct` opens ApprovalLayer's confirm), and the Builds ledger (`AppBuilds`) with the lead place opened
	 * as its Slipway. A place at rest opens nothing. NO standalone "Deployment pipeline" card: the product draws the pipeline only inside a place row.
	 * Left out: the rail (Holding / pulse / activity), the star, the deploy dialog: a window is not the page.
	 * NEW BY DESIGN: (1) the window top bar (the dashboard's Navbar is a route chrome tied to its router and queries, so the bar is drawn from
	 * the same classes), (2) the pointer, (3) the chip bar: the Railway tab bar, the story's seek and pause control (WCAG 2.2.2).
	 */
	import StatementBanner from '$lib/components/StatementBanner.svelte';
	import { CheckOutline } from 'flowbite-svelte-icons';
	import { appPageOf } from '../shared/app-page';
	import AppBuilds from '$lib/components/new/app/AppBuilds.svelte';
	import ApprovalLayer from '$lib/components/new/ApprovalLayer.svelte';
	import { approvalUi } from '$lib/components/new/approvals.svelte';
		import { tick, untrack } from 'svelte';
	import { APP } from './scenario';
	import { CHIPS, chipAt, appIdentityOf, laneFor, LOOP } from './model';
	import { choreoAt } from './choreo';
	import WindowBar from '../shared/WindowBar.svelte';
	import AppHeader from '../shared/AppHeader.svelte';
	import Pointer from '../shared/Pointer.svelte';
	import ChipBar from '../shared/ChipBar.svelte';

	let { t, playing, reduced, onseek, ontoggle }: { t: number; playing: boolean; reduced: boolean; onseek: (chip: number) => void; ontoggle: () => void } = $props();

	let box: HTMLElement | undefined = $state();
	let width = $state(1120);
	const narrow = $derived(width < 640);
	const compactPipe = $derived(width < 560);

	/* what the dashboard's own view-model says at this instant (the source was installed before `t` changed) */
	const page = $derived(t >= 0 ? appPageOf(APP, CheckOutline) : null);
	const who = $derived(page ? appIdentityOf(APP) : null);
	const lane = $derived(t >= 0 ? laneFor() : null);
	const cur = $derived.by(() => { const h = (who?.href ?? '').split('/').filter(Boolean); return h[0] === 'rollouts' ? { ns: h[2], name: h[3] } : null; });
	const hrefFor = (n: { card: unknown }) => (n.card as { href?: string }).href ?? '';
	const stmt = $derived(page?.statement?.kind === 'wait' ? page.statement : null);
	const target = $derived(stmt?.target ?? null);

	/* the two presses (pure function of t) */
	const ch = $derived(reduced ? { target: null, visible: false, press: false, ask: false, done: false } : choreoAt(t));
	let ptr = $state({ x: 0, y: 0 });
	let ptrShown = $state(false);
	function rel(el: Element | null) {
		const b = box?.getBoundingClientRect(), r = el?.getBoundingClientRect();
		return b && r ? { top: r.top - b.top, left: r.left - b.left, right: r.right - b.left, bottom: r.bottom - b.top, w: r.width, h: r.height } : null;
	}
	/** one step of the choreography per change of target / ask: measure the real buttons, then point at them */
	$effect(() => {
		const { target, ask, visible, done } = ch;
		untrack(() => {
			if (ask && !approvalUi.ask && target) {
				const tg = target;
				const a = rel(box?.querySelector('[data-approve-open]') ?? null);
				if (tg && a) {
					/* ApprovalLayer measures the viewport, not this frame: with no room below the button inside the frame, hand it an anchor
					   that makes it open ABOVE the button (it positions from the frame's bottom edge) */
					const room = (box?.clientHeight ?? 0) - a.bottom;
					const vh = window.innerHeight;
					approvalUi.ask = { target: tg, anchor: room > 170 ? { top: a.top, left: a.left, right: a.right, bottom: a.bottom } : { top: vh - (box?.clientHeight ?? 0) + a.top, left: a.left, right: a.right, bottom: vh } };
				}
			}
			if (!ask && approvalUi.ask) approvalUi.ask = null;
			if (done && !approvalUi.done) { const tg = target ?? lastTarget; if (tg) approvalUi.done = { target: tg, error: null }; }
			if (!done && approvalUi.done) approvalUi.done = null;
		});
		(async () => {
			await tick();
			const el = target === 'approve' ? box?.querySelector('[data-approve-open]') : target === 'confirm' ? box?.querySelector('[data-action="approve-confirm"]') : null;
			const a = rel(el ?? null);
			if (visible && a) { ptr = { x: a.left + a.w * 0.62, y: a.top + a.h * 0.6 }; ptrShown = true; }
			else if (visible && !ptrShown && box) { ptr = { x: box.clientWidth - 60, y: box.clientHeight - 50 }; ptrShown = true; }
			if (!visible) ptrShown = false;
		})();
	});
	let lastTarget: NonNullable<typeof target> | null = null;
	$effect(() => { if (target) lastTarget = target; });

	const lit = $derived(chipAt(t));
	const spanFill = $derived(lit < 0 ? 0 : Math.min(1, Math.max(0, (t - CHIPS[lit].from) / (CHIPS[lit].to - CHIPS[lit].from))));
	const fading = $derived(!reduced && t >= LOOP - 0.5);
</script>

<div class="hw" bind:this={box} bind:clientWidth={width} class:hw-narrow={narrow}>
	<div class="hw-frame" class:hw-fade={fading}>
		<!-- the window's own top bar: the product's header row (mark, breadcrumb, the viewer) -->
		<WindowBar crumbs={['Apps', APP]} {narrow} keep={1} />

		<div class="hw-body" inert>
			{#if page && who}
				<AppHeader app={APP} {who} {lane} {cur} yours={!!stmt?.approve} {hrefFor} />
				<div class="flex flex-col gap-4 px-4 pb-4 pt-6 sm:px-6 sm:pb-6">
					{#if stmt}
						<!-- AppDetail AA4: the wait is a statement in the tab's own box: the gate sentence, the one Approve, Open rollout -->
						<div data-ad-statement data-ad-wait><StatementBanner severity={stmt.severity} title={stmt.title} message={stmt.message} primary={stmt.approve as never} secondary={stmt.openHref ? [{ label: 'Open rollout', href: stmt.openHref, key: 'open-rollout' }] : []} /></div>
					{/if}
					<div class="ad-places"><AppBuilds stops={page.stops} places={page.places} view={(p) => page.view(p, page.leadKey, narrow)} phone={narrow} nested hs="incident" onDeploy={() => {}} /></div>
				</div>
			{/if}
		</div>

		<ApprovalLayer />
		<Pointer x={ptr.x} y={ptr.y} on={ptrShown && ch.visible} press={ch.press} />
	</div>

	<ChipBar chips={CHIPS} lit={lit} fill={spanFill} {reduced} {playing} {narrow} {onseek} {ontoggle} />
</div>

<style>
	.hw { position: relative; width: 100%; height: 100%; }
	.hw-frame { position: relative; height: 100%; overflow: hidden; border-radius: inherit; background: var(--k-ground); transition: opacity 0.4s ease; }
	.hw-fade { opacity: 0.0; }
	.hw-body { height: calc(100% - 44px); overflow: hidden; }
	/* AppDetail's own rule: a wide pane lays the opened place's two fact lists side by side (container >= 1000px) */
	@container (min-width: 1000px) {
		.ad-places :global(.sw-compact .sw-pane) { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-template-areas: 'info info' 'b1 b2' 'act act'; column-gap: 32px; align-content: start; }
	}
</style>
