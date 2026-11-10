/**
 * Timeline: drives an island by applying scripted view-model state, beat by beat.
 *
 *   beats = [{ at: 0, state }, { at: 1800, state }, ...]   // `at` = ms from the start of a cycle
 *   cycle = last beat's `at` + restMs; at the end it rests, then loops from beat 0.
 *
 * It owns WHEN, never WHAT: `apply(state)` writes into the component's `$state` props and the component's own
 * transitions / animations do the rest. Playing = visible on screen AND tab visible AND motion allowed;
 * any gate closing freezes the clock (resume continues where it stopped, it does not restart the cycle).
 * Reduced motion: never autoplays; shows `representative` beat; `next()` steps through the beats by hand.
 * Framework-free and clock-injectable so it is unit-testable.
 */
export type Beat<S> = { at: number; state: S };

export type TimelineOptions<S> = {
	beats: Beat<S>[];
	apply: (state: S, index: number) => void;
	/** pause after the last beat before looping (ms) */
	restMs?: number;
	/** beat shown when motion is reduced (default: last) */
	representative?: number;
	setTimer?: (fn: () => void, ms: number) => unknown;
	clearTimer?: (h: unknown) => void;
	now?: () => number;
};

export class Timeline<S> {
	private o: Required<Omit<TimelineOptions<S>, 'representative'>> & { representative: number };
	private gates = { onscreen: false, visible: true, motion: true };
	private idx = -1; // last applied beat
	private timer: unknown = null;
	private startedAt = 0; // wall time at which the cycle position `pos` was true
	private pos = 0; // ms into the cycle when paused/at startedAt

	constructor(opts: TimelineOptions<S>) {
		if (!opts.beats.length) throw new Error('Timeline needs at least one beat');
		this.o = {
			restMs: 2400,
			setTimer: (f, ms) => setTimeout(f, ms),
			clearTimer: (h) => clearTimeout(h as number),
			now: () => performance.now(),
			...opts,
			representative: opts.representative ?? opts.beats.length - 1
		};
	}

	get cycleMs() { return this.o.beats[this.o.beats.length - 1].at + this.o.restMs; }
	get playing() { return this.gates.onscreen && this.gates.visible && this.gates.motion; }
	get index() { return this.idx; }

	/** feed one gate: 'onscreen' (IntersectionObserver), 'visible' (document.visibilityState), 'motion' (!prefers-reduced-motion) */
	setGate(g: 'onscreen' | 'visible' | 'motion', v: boolean) {
		const was = this.playing;
		this.gates[g] = v;
		if (g === 'motion' && !v) this.show(this.o.representative);
		if (g === 'motion' && v && this.idx < 0) this.show(0);
		if (was === this.playing) return;
		if (this.playing) this.run(); else this.freeze();
	}

	/** reduced-motion control: step to the next beat (wraps) */
	next() { this.show((this.idx + 1) % this.o.beats.length); }
	/** jump to a beat without touching the clock */
	show(i: number) { this.idx = i; this.o.apply(this.o.beats[i].state, i); }

	destroy() { this.freeze(); }

	private run() {
		this.startedAt = this.o.now();
		this.tick();
	}
	private freeze() {
		if (this.timer != null) { this.o.clearTimer(this.timer); this.timer = null; }
		this.pos = (this.pos + (this.o.now() - this.startedAt)) % this.cycleMs;
	}
	/** apply every beat due at `pos`, then sleep until the next one (or the loop point) */
	private tick = () => {
		this.timer = null;
		const { beats } = this.o;
		const t = (this.pos + (this.o.now() - this.startedAt)) % this.cycleMs;
		let due = -1;
		for (let i = 0; i < beats.length; i++) if (beats[i].at <= t) due = i;
		if (due !== this.idx) this.show(due);
		const nextAt = due + 1 < beats.length ? beats[due + 1].at : this.cycleMs;
		this.timer = this.o.setTimer(this.tick, Math.max(16, nextAt - t));
	};
}
