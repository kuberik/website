/**
 * Hero island entry: the SCENE (landing scene lane 1). The shared Player owns WHEN (gates, a reader's pause, seek, reduced motion resting on REST_T);
 * script.ts owns WHAT (everything is a pure function of story time); Scene.svelte draws it from the dashboard's own components.
 * No data world, no routes, no fetch answers: the scene passes props straight to the components.
 */
import { mount } from 'svelte';
import { reactive } from '../../reactive.svelte';
import type { CustomCtx } from '../../registry';
import { Player } from '../shared/player';
import { LOOP, CHAPTERS, REST_T } from './script';
import Scene from './Scene.svelte';

export function mountScene(ctx: CustomCtx) {
	const props = reactive({ t: 0, playing: false, userPlaying: true, reduced: false, wrapped: false, onseek: (_: number) => {}, ontoggle: () => {}, onshown: () => {} });
	let player: Player | undefined;
	let last = 0, seeking = false;
	const apply = (t: number) => {
		/* the story wrapped by playing on (not by a seek): the opening fades in */
		if (t < last - 1 && !seeking) props.wrapped = true;
		if (seeking) props.wrapped = false;
		last = t;
		props.t = t;
		if (player) { props.playing = player.playing; props.userPlaying = !player.paused; props.reduced = player.reduced; }
	};
	player = new Player({ loop: LOOP, rest: REST_T, quantum: 0.05, onTime: apply });
	apply(0);
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) apply(REST_T);
	const sync = () => { props.playing = player!.playing; props.userPlaying = !player!.paused; props.reduced = player!.reduced; };
	props.onseek = (i) => { seeking = true; player!.gate('hover', true); player!.seek(player!.reduced ? CHAPTERS[i].settled : CHAPTERS[i].from); seeking = false; sync(); };
	props.ontoggle = () => { player!.gate('hover', true); player!.toggle(); sync(); };
	const shownP = new Promise<void>((r) => { props.onshown = r; });
	mount(Scene, { target: ctx.wrap, props });
	void (async () => {
		await Promise.race([shownP, new Promise((r) => setTimeout(r, 4000))]);
		await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);
		await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
		ctx.ready();
	})();
	ctx.onGate((g, v) => { player!.gate(g, v); sync(); });
	/* hovering the scene pauses it (a reader is looking); the chapter bar sits outside that gate. Mouse only. */
	let inFrame = false;
	const setHover = (v: boolean) => { if (v === inFrame) return; inFrame = v; player!.gate('hover', !v); sync(); };
	ctx.host.addEventListener('pointermove', (e) => { if ((e as PointerEvent).pointerType === 'mouse') setHover((e.composedPath() as Element[]).some((n) => n.classList?.contains('sc-frame'))); });
	ctx.host.addEventListener('pointerleave', () => setHover(false));
	/* QA hook: freeze the story on second `t` (screenshot harness) */
	(ctx.host as any).__story = { at: (t: number) => { seeking = true; player!.seek(t); player!.pause(); seeking = false; sync(); }, player };
	return () => player!.destroy();
}
