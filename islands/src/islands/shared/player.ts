/**
 * The hero's clock. Story time `t` (seconds, 0..LOOP) advances only while every gate is open: on screen, tab visible, motion allowed,
 * and the reader has not pressed pause. Leaving the screen closes a gate; coming back restarts at 0 (SPEC section 6) so a reader always
 * sees the story from its start. `seek` jumps and keeps playing; reduced motion never advances, it only jumps.
 * Framework-free and clock-injectable (see player.test.ts). It owns WHEN; model.ts / scenario.ts own WHAT.
 */
export type PlayerOptions = {
	loop: number;
	/** the story second to rest on under reduced motion */
	rest: number;
	/** called with each new story time (already quantised to `quantum`) */
	onTime: (t: number) => void;
	/** quantum of `onTime` in seconds: the story is re-derived at most this often */
	quantum?: number;
	now?: () => number;
	setTimer?: (fn: () => void, ms: number) => unknown;
	clearTimer?: (h: unknown) => void;
};
export class Player {
	private o: Required<Omit<PlayerOptions, 'rest'>> & { rest: number };
	private g = { onscreen: false, visible: true, motion: true, user: true, hover: true };
	private t = 0;
	private last = 0;
	private timer: unknown = null;
	private shown = NaN;
	constructor(opts: PlayerOptions) {
		this.o = { quantum: 0.125, now: () => performance.now(), setTimer: (f, ms) => setTimeout(f, ms), clearTimer: (h) => clearTimeout(h as number), ...opts };
		this.emit();
	}
	get time() { return this.t; }
	get playing() { return this.g.onscreen && this.g.visible && this.g.motion && this.g.user && this.g.hover; }
	get paused() { return !this.g.user; }
	get reduced() { return !this.g.motion; }
	/** open or close one gate; 'onscreen' opening restarts the story, 'motion' closing parks it on the rest frame */
	gate(name: 'onscreen' | 'visible' | 'motion' | 'hover', v: boolean) {
		const was = this.playing;
		const before = this.g[name];
		this.g[name] = v;
		if (name === 'motion') { if (!v) this.jump(this.o.rest); else this.jump(0); }
		if (name === 'onscreen' && v && !before && this.g.motion && this.g.user) this.jump(0); // a reader's pause survives scrolling away and back
		this.sync(was);
	}
	/** a reader's pause, idempotent (QA hook) */
	pause() { if (this.g.user) this.toggle(); }
	toggle() { const was = this.playing; this.g.user = !this.g.user; this.sync(was); }
	/** a chip: jump to second `s`; playing resumes unless motion is reduced */
	seek(s: number) { const was = this.playing; if (this.g.motion) this.g.user = true; this.jump(s); this.sync(was); }
	destroy() { this.stop(); }
	private jump(s: number) { this.t = ((s % this.o.loop) + this.o.loop) % this.o.loop; this.last = this.o.now(); this.emit(); }
	private sync(was: boolean) {
		if (this.playing && !was) { this.last = this.o.now(); this.schedule(); }
		else if (!this.playing) this.stop();
		else if (this.timer == null) this.schedule();
	}
	private stop() { if (this.timer != null) this.o.clearTimer(this.timer); this.timer = null; }
	private schedule() { this.stop(); this.timer = this.o.setTimer(this.step, this.o.quantum * 1000); }
	private step = () => {
		this.timer = null;
		if (!this.playing) return;
		const n = this.o.now();
		this.t = (this.t + (n - this.last) / 1000) % this.o.loop;
		this.last = n;
		this.emit();
		this.schedule();
	};
	private emit() {
		const q = Math.floor(this.t / this.o.quantum + 1e-6) * this.o.quantum;
		if (q === this.shown) return;
		this.shown = q;
		this.o.onTime(+q.toFixed(3));
	}
}
