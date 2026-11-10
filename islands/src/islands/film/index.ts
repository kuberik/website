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
import { LOOP, CHAPTERS, REST_T, upcoming } from './script';
import { eventIndexAt, worldAt } from './scenario';
import { installAnswers, installFetch, setDetail } from './detail-store.svelte';
import { loadSurface } from './surfaces';
import Film from './Film.svelte';
import { containScroll } from './contain-scroll';

export function mountFilm(ctx: CustomCtx) {
	const props = reactive({ t: 0, playing: false, reduced: false, eventIdx: -1, onseek: (_: number) => {}, ontoggle: () => {} });
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
		if (player) { props.playing = player.playing; props.reduced = player.reduced; }
	};
	player = new Player({ loop: LOOP, rest: REST_T, quantum: 0.05, onTime: apply });
	apply(0);
	props.onseek = (i) => { player!.seek(player!.reduced ? CHAPTERS[i].settled : CHAPTERS[i].from); props.playing = player!.playing; };
	props.ontoggle = () => { player!.toggle(); props.playing = player!.playing; };
	/* the first frame is real once the surface, the shell and the fonts are in and painted: only then does the static poster leave (no blank gap, no shift) */
	const shell = ctx.host.clientWidth < 600 ? import('$lib/MobileTabBar.svelte') : import('$lib/Sidebar.svelte'); // fetched in parallel with the first surface, same chunk Film asks for
	void Promise.all([loadSurface('change'), shell]).then(async () => {
		mount(Film, { target: ctx.wrap, props });
		await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);
		await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
		ctx.ready();
	});
	ctx.onGate((g, v) => { player!.gate(g, v); props.playing = player!.playing; props.reduced = player!.reduced; });
	/* STORYBOARD section 9: hovering the window, or focusing inside it, pauses the story (a reader is looking); leaving resumes. Mouse only: a tap on a phone is not a hover. */
	const inside = () => ctx.host.matches(':hover') || !!ctx.host.shadowRoot?.activeElement;
	const hover = () => { player!.gate('hover', !inside()); props.playing = player!.playing; };
	ctx.host.addEventListener('pointerenter', (e) => { if ((e as PointerEvent).pointerType === 'mouse') hover(); });
	ctx.host.addEventListener('pointerleave', hover);
	ctx.host.addEventListener('focusin', hover);
	ctx.host.addEventListener('focusout', () => setTimeout(hover));
	/* QA hook: freeze the story on second `t` (screenshot harness; harmless in the page) */
	(ctx.host as any).__story = { at: (t: number) => { player!.seek(t); player!.pause(); props.playing = player!.playing; }, player };
	return () => player!.destroy();
}
