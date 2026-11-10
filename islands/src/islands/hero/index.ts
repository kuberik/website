/** Hero island entry: owns the clock and the dashboard's installed source; Hero.svelte only draws. */
import { mount } from 'svelte';
import { installLiveSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { approvalUi } from '$lib/components/new/approvals.svelte';
import { reactive } from '../../reactive.svelte';
import { githubTable } from '../../github-table.svelte';
import type { CustomCtx } from '../../registry';
import Hero from './Hero.svelte';
import { fleetAt, githubAt } from './scenario';
import { CHIPS, LOOP, REST_T } from './model';
import { Player } from './player';

export function mountHero({ wrap, onGate }: CustomCtx) {
	const props = reactive({ t: 0, playing: false, reduced: false, onseek: (_: number) => {}, ontoggle: () => {} });
	let last = NaN;
	const apply = (t: number) => {
		if (t === last) return;
		/* the dashboard reads ONE source: install this second's snapshot, then tell the component the time moved */
		installLiveSource(fleetAt(t));
		githubTable.set(githubAt(t));
		last = t;
		props.t = t;
		if (player) { props.playing = player.playing; props.reduced = player.reduced; }
	};
	let player: Player | undefined;
	player = new Player({ loop: LOOP, rest: REST_T, onTime: apply });
	apply(0); // the first frame is beat 0 (rest) before any gate opens
	props.onseek = (i) => { player!.seek(player!.reduced ? CHIPS[i].settled : CHIPS[i].from); props.playing = player!.playing; };
	props.ontoggle = () => { player!.toggle(); props.playing = player!.playing; };
	mount(Hero, { target: wrap, props });
	onGate((g, v) => { player!.gate(g, v); props.playing = player!.playing; props.reduced = player!.reduced; if (g === 'motion' && !v) approvalUi.ask = null; });
	return () => player!.destroy();
}
