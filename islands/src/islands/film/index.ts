/**
 * Hero island entry: the film. It owns WHEN (the shared Player: gates, a reader's pause surviving scroll away and back, seek) and WHAT DATA (one world snapshot per
 * CR event, installed into the dashboard's single source and the rollout page's query answers); Film.svelte draws.
 */
import { mount } from 'svelte';
import { reactive } from '../../reactive.svelte';
import type { CustomCtx } from '../../registry';
import { Player } from '../shared/player';
import { setPart } from '../shared/world';
import { LOOP, CHAPTERS, REST_T, upcoming } from './script';
import { eventIndexAt, worldAt } from './scenario';
import { installAnswers, installFetch, setDetail } from './detail-store.svelte';
import { loadSurface } from './surfaces';
import Film from './Film.svelte';
import { containScroll } from './contain-scroll';

export function mountFilm(ctx: CustomCtx) {
	const props = reactive({ t: 0, playing: false, reduced: false, eventIdx: -1, onseek: (_: number) => {}, ontoggle: () => {} });
	let world: ReturnType<typeof worldAt> | null = null;
	installAnswers(() => (world?.fleet.rollouts as unknown[]) ?? []);
	containScroll();
	installFetch(() => (world?.fleet as any) ?? null);
	let last = NaN;
	let player: Player | undefined;
	const apply = (t: number) => {
		if (t === last) return;
		const ei = eventIndexAt(t);
		if (ei !== props.eventIdx) {
			/* the data snapshot is re-derived only when a CR changes: the world is installed (FleetSource + rollout page answers) BEFORE the film hears the new index */
			world = worldAt(t);
			setPart('film', world.fleet, world.github);
			setDetail(world.detail);
			props.eventIdx = ei;
		}
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
	/* QA hook: freeze the story on second `t` (screenshot harness; harmless in the page) */
	(ctx.host as any).__story = { at: (t: number) => { player!.seek(t); player!.pause(); props.playing = player!.playing; }, player };
	return () => player!.destroy();
}
