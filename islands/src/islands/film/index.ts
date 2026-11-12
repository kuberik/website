/**
 * Hero island entry: the film. It owns WHEN (the shared Player: gates, a reader's pause surviving scroll away and back, seek) and WHAT DATA (one world snapshot per
 * CR event, installed into the dashboard's single source and the rollout page's query answers); Film.svelte draws.
 */
import { mount } from 'svelte';
import { reactive } from '../../reactive.svelte';
import type { CustomCtx } from '../../registry';
import { Player } from '../shared/player';
import { setPart } from '../shared/world';
import { driveNow } from '../../stubs/time-store';
import { LOOP, CHAPTERS, REST_T, upcoming, surfAt } from './script';
import { eventIndexAt, worldAt } from './scenario';
import { installAnswers, installFetch, setDetail } from './detail-store.svelte';
import { loadSurface } from './surfaces';
import Film from './Film.svelte';
import { containScroll } from './contain-scroll';

export function mountFilm(ctx: CustomCtx) {
	/* the product's tab routes name themselves (<svelte:head><title>): mounted in the film, the Overview renamed the LANDING page's tab to "checkout-api (...) · Kuberik"
	   (owner 2026-11-12, a glitch). The landing keeps its own name: writes to document.title are dropped while the film is on the page. */
	const titleOf = Object.getOwnPropertyDescriptor(Document.prototype, 'title');
	if (titleOf?.get) Object.defineProperty(document, 'title', { configurable: true, get: () => titleOf.get!.call(document), set: () => {} });
	const props = reactive({ t: 0, playing: false, userPlaying: true, reduced: false, eventIdx: -1, onseek: (_: number) => {}, ontoggle: () => {}, onshown: () => {} });
	let world: ReturnType<typeof worldAt> | null = null;
	installAnswers(() => (world?.fleet.rollouts as unknown[]) ?? [], () => world?.github ?? null);
	containScroll();
	installFetch(() => (world?.fleet as any) ?? null);
	let last = NaN;
	let evT = 0, tickAt = -9;
	let player: Player | undefined;
	const apply = (t: number) => {
		if (t === last) return;
		const ei = eventIndexAt(t);
		if (ei !== props.eventIdx) {
			/* the data snapshot is re-derived only when a CR changes: the world is installed (FleetSource + rollout page answers) BEFORE the film hears the new index */
			world = worldAt(t);
			setPart('film', world.fleet, world.github);
			setDetail(world.detail);
			props.eventIdx = ei; evT = t; tickAt = t;
		}
		/* the product's `now` is the snapshot's instant plus the REAL seconds since the last CR change (the story clock is a time-lapse, a bake countdown is not): "12s remaining" ticks 11, 10 ... between CR events, once per story second */
		else if (world && t - tickAt >= 1) { tickAt = t; driveNow(new Date(world.fleet.now.getTime() + (t - evT) * 1000)); }
		last = t;
		props.t = t;
		for (const s of upcoming(t)) void loadSurface(s);
		if (player) { props.playing = player.playing; props.userPlaying = !player.paused; props.reduced = player.reduced; }
	};
	player = new Player({ loop: LOOP, rest: REST_T, quantum: 0.05, onTime: apply });
	apply(0);
	/* reduced motion rests on REST_T (the motion gate arrives after mount and jumps there): start on that frame, or the first surface mounted is the Change page and the jump to the Overview leaves the window blank while its chunk loads (the blank start) */
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) apply(REST_T);
	props.onseek = (i) => { player!.gate('hover', true); player!.seek(player!.reduced ? CHAPTERS[i].settled : CHAPTERS[i].from); props.playing = player!.playing; props.userPlaying = !player!.paused; };
	props.ontoggle = () => { player!.gate('hover', true); player!.toggle(); props.playing = player!.playing; props.userPlaying = !player!.paused; };
	/* the first frame is real once the surface, the shell and the fonts are in and painted: only then does the static poster leave (no blank gap, no shift) */
	const shell = ctx.host.clientWidth < 600 ? import('$lib/MobileTabBar.svelte') : import('$lib/Sidebar.svelte'); // fetched in parallel with the first surface, same chunk Film asks for
	void Promise.all([loadSurface(surfAt(props.t)), shell]) /* the surface the story STARTS on (reduced motion rests on the Overview): the poster only leaves once it is in */.then(async () => {
		const shownP = new Promise<void>((r) => { props.onshown = r; });
		mount(Film, { target: ctx.wrap, props });
		await Promise.race([shownP, new Promise((r) => setTimeout(r, 4000))]); /* the poster stays until the first surface is actually SHOWN (opacity 1): QA r5 saw a 2 s blank under load when it left on mount alone */
		await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);
		await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
		ctx.ready();
	});
	ctx.onGate((g, v) => { player!.gate(g, v); props.playing = player!.playing; props.reduced = player!.reduced; });
	/* STORYBOARD section 9: hovering the film pauses the story (a reader is looking); leaving resumes. The CANVAS only: the chrome (chapters, play) sits outside the gate, or pressing it would close the gate it opens. Mouse only: a tap on a phone is not a hover. The canvas is inert (no focus, no tab stops), so there is no focus gate. */
	let inFrame = false;
	const setHover = (v: boolean) => { if (v === inFrame) return; inFrame = v; player!.gate('hover', !v); props.playing = player!.playing; };
	ctx.host.addEventListener('pointermove', (e) => { if ((e as PointerEvent).pointerType === 'mouse') setHover((e.composedPath() as Element[]).some((n) => n.classList?.contains('film-frame'))); });
	ctx.host.addEventListener('pointerleave', () => setHover(false));
	/* QA hook: freeze the story on second `t` (screenshot harness; harmless in the page) */
	(ctx.host as any).__story = { at: (t: number) => { player!.seek(t); player!.pause(); props.playing = player!.playing; }, player };
	return () => player!.destroy();
}
