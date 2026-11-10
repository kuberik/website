/**
 * mountStory: the ONE way a story island (hero, health, ...) runs. It owns the clock (Player), hands each second's snapshot to the world
 * (world.ts: the dashboard reads one source for the whole page) and gives the component `t`, the play state and the chip handlers.
 * The component only draws; the scenario owns WHAT, the Player owns WHEN.
 */
import { mount, type Component } from 'svelte';
import { reactive } from '../../reactive.svelte';
import type { CustomCtx } from '../../registry';
import type { FleetSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { Player } from './player';
import { setPart } from './world';

export type StoryProps = { t: number; playing: boolean; reduced: boolean; onseek: (chip: number) => void; ontoggle: () => void };
export type StoryOpts = {
	id: string;
	component: Component<any>;
	loop: number;
	/** the story second reduced motion rests on */
	rest: number;
	chips: readonly { from: number; settled: number }[];
	snapshot: (t: number) => { fleet: FleetSource; github: Record<string, unknown> };
	/** the motion gate closed: park anything the story left open (a confirm, a toast) */
	onReduced?: () => void;
};

export function mountStory(ctx: CustomCtx, o: StoryOpts) {
	const props = reactive<StoryProps>({ t: 0, playing: false, reduced: false, onseek: () => {}, ontoggle: () => {} });
	let last = NaN;
	let player: Player | undefined;
	const apply = (t: number) => {
		if (t === last) return;
		/* the dashboard reads ONE source: hand the world this second's part, then tell the component the time moved */
		const s = o.snapshot(t);
		setPart(o.id, s.fleet, s.github);
		last = t;
		props.t = t;
		if (player) { props.playing = player.playing; props.reduced = player.reduced; }
	};
	player = new Player({ loop: o.loop, rest: o.rest, onTime: apply });
	apply(0); // the first frame is story second 0 before any gate opens
	props.onseek = (i) => { player!.seek(player!.reduced ? o.chips[i].settled : o.chips[i].from); props.playing = player!.playing; };
	props.ontoggle = () => { player!.toggle(); props.playing = player!.playing; };
	mount(o.component, { target: ctx.wrap, props });
	ctx.onGate((g, v) => { player!.gate(g, v); props.playing = player!.playing; props.reduced = player!.reduced; if (g === 'motion' && !v) o.onReduced?.(); });
	/* QA hook: freeze the story on second `t` (used by the screenshot harness, harmless in the page) */
	(ctx.host as any).__story = { at: (t: number) => { player!.seek(t); if (player!.playing) player!.toggle(); }, player };
	(ctx.host as any).__hero = (ctx.host as any).__story;
	return () => player!.destroy();
}
