/**
 * SECTION ISLANDS: one real dashboard component (or a real page region) in a page section, at a fixed story time (a still) or a few story times (a calm loop
 * of stills that dissolve), fed by a world snapshot from the same scenario machinery as the film.
 *
 * How a frame is made: the component is mounted LIVE under `Scoped.svelte` (its own `page` and query answers, shared/scope.ts) on a canvas of the
 * product's own width (container `kc`: the product's breakpoints answer the canvas, as in the film), offstage in the shadow root; once it has settled
 * (fonts in, no DOM change for SETTLE_MS: the gate graph measures its ports and draws its wires in a ResizeObserver) its DOM is CLONED into the frame
 * and the live component is unmounted. The frame is therefore the product's own markup and CSS (both themes follow `.dark` on the wrapper), inert by
 * construction, and nothing the film does later (its clock, its page, its world) can move it.
 *
 * Time: the product prints ages against the shared story clock. When the film drives that clock, the section's world is REBASED onto it (every ISO
 * timestamp shifted by now - world.now), so "baked 4m ago" is the section's own story, whatever second the film is at; with no film on the page the
 * section drives the clock itself.
 *
 * Add one: sections/<name>.ts exports `mount = (ctx) => mountSection(ctx, spec)`; registry.ts maps the island name to it; Hugo hosts it with
 * layouts/_partials/section-island.html. See islands/README.md "Section islands".
 */
import { mount, unmount, type Component } from 'svelte';
import type { CustomCtx } from '../../registry';
import type { FleetSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { liveSource } from '$lib/components/home/sketch/fleet-source.svelte';
import { setPart, dropPart } from '../shared/world';
import { driveNow, isDriven, storyDate } from '../../stubs/time-store';
import type { IslandPage } from '../shared/scope';
import Scoped from '../shared/Scoped.svelte';

export type SectionWorld = { fleet: FleetSource; github: Record<string, unknown> };
export type SectionSpec<W extends SectionWorld = SectionWorld> = {
	/** the world part id (unique per section) */
	id: string;
	/** the real dashboard component the frame shows (a route page, a card); fetched once */
	load: () => Promise<Component<any>>;
	/** its props, from the world at the frame's story time */
	props?: (w: W) => Record<string, unknown>;
	/** what `$app/state`'s page says to it (route id + params, as the route would) */
	page: IslandPage;
	/** the world at story second t (raw CRs, as the API serves them) */
	world: (t: number) => W;
	/** the query answers the component reads, from that world (the fleet list is answered for it: rollouts/all) */
	answers?: (w: W) => (key: readonly unknown[]) => unknown;
	/** the page reads the WHOLE fleet (the App page, the Change page: the dashboard's model, `liveSource()`): answer it with this world, not the film's */
	source?: boolean;
	/** story seconds: one = a still; several = a calm loop of stills */
	times: number[];
	/** the frame shown under reduced motion, and first (index into `times`, default 0) */
	rest?: number;
	/** loop only: how long each still holds (ms, default 3200) and the dissolve (ms, default 600) */
	holdMs?: number;
	fadeMs?: number;
	/** the dashboard width the product lays out at, for a host this wide (its container queries answer it); natural scale (1:1) */
	canvas: (hostWidth: number) => number;
	/** 'width': the canvas is corrected (once, then remembered) until the framed rect is exactly as wide as the host: the product's gutters differ by breakpoint */
	fit?: 'width';
	/** what is framed in the host box, found in the rendered product: an element, or a rect (`rectOf`: a span of elements, an edge cropped on a gutter) */
	frame: (root: HTMLElement) => { getBoundingClientRect(): DOMRect } | null;
	/** where the framed element sits in the host box: 'start' = its left/top edge at `pad`, 'center' = centred (default start, start, 0) */
	align?: { x?: 'start' | 'center'; y?: 'start' | 'center'; pad?: number };
};

const SETTLE_MS = 250, SETTLE_MAX_MS = 4000;
const ISO = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
/** every ISO timestamp (and Date) in a CR tree, shifted by `ms` */
function shift<T>(x: T, ms: number): T {
	if (!ms) return x;
	if (typeof x === 'string') return (ISO.test(x) ? new Date(Date.parse(x) + ms).toISOString() : x) as T;
	if (x instanceof Date) return new Date(x.getTime() + ms) as T;
	if (Array.isArray(x)) return x.map((v) => shift(v, ms)) as T;
	if (x && typeof x === 'object') { const o: Record<string, unknown> = {}; for (const [k, v] of Object.entries(x)) o[k] = shift(v, ms); return o as T; }
	return x;
}
/* the dashboard keys a catalogue by cluster / namespace / source: a world under its own cluster names brings its own (sections/worlds.ts `held`) */
const sliceKey = (s: any) => `${s?.metadata?.annotations?.['rollout-dashboard.kuberik.com/source-cluster']}/${s?.metadata?.namespace}/${s?.metadata?.name}/${s?.metadata?.resourceVersion}`;
/** the release catalogue this world needs is already installed (the film's world holds the same slices): the section adds nothing to the shared source */
function catalogueInstalled(f: FleetSource): boolean {
	const have = new Set(((liveSource() as any)?.releaseSlices?.items ?? []).map(sliceKey));
	return ((f as any).releaseSlices?.items ?? []).every((s: any) => have.has(sliceKey(s)));
}
const listAnswer = (f: FleetSource) => ({ rollouts: { items: f.rollouts }, environments: { items: f.environments }, rolloutDependencies: f.rolloutDependencies, kustomizations: { items: f.kustomizations }, kruiseRollouts: { items: f.kruiseRollouts }, releaseSources: (f as any).releaseSources, releaseSlices: (f as any).releaseSlices });
/** a rect with the left/right/top edges of `edges`, down to the lowest foot of `bottoms`, grown by `grow` px on each side (negative = inward): a frame cropped on a gutter */
export function rectOf(edges: Element, bottoms: (Element | null)[] = [], grow: { l?: number; t?: number; r?: number; b?: number } = {}) {
	return { getBoundingClientRect() { const e = edges.getBoundingClientRect(), feet = bottoms.filter((b): b is Element => !!b); const foot = feet.length ? Math.max(...feet.map((b) => b.getBoundingClientRect().bottom)) : e.bottom; const l = e.left - (grow.l ?? 0), t = e.top - (grow.t ?? 0); return new DOMRect(l, t, e.right + (grow.r ?? 0) - l, foot + (grow.b ?? 0) - t); } };
}
const frames2 = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

/** renders the product at story second `t` on a canvas `cw` px wide inside `stage`; resolves to a static, inert copy of it (and where the framed element sits) */
async function still<W extends SectionWorld>(spec: SectionSpec<W>, C: Component<any>, stage: HTMLElement, t: number, cw: number): Promise<{ el: HTMLElement; box: DOMRect }> {
	let w = spec.world(t);
	let ownsClock = false;
	if (isDriven()) w = shift(w, storyDate().getTime() - (w.fleet as any).now.getTime());
	else { driveNow((w.fleet as any).now); ownsClock = true; }
	const added = !catalogueInstalled(w.fleet);
	/* base: the section owns the shared source only when nothing else (the film) has installed one */
	if (added) setPart(spec.id, { ...w.fleet, rollouts: [], environments: [], kustomizations: [], kruiseRollouts: [], healthChecks: [], changes: [], rolloutDependencies: { items: [] } } as unknown as FleetSource, w.github, { base: ownsClock });
	const own = spec.answers?.(w);
	const answers = (key: readonly unknown[]) => (key[0] === 'rollouts' && key[1] === 'all' ? listAnswer(w.fleet) : own?.(key));
	const canvas = document.createElement('div');
	canvas.className = 'sec-canvas';
	canvas.style.width = cw + 'px';
	stage.appendChild(canvas);
	const app = mount(Scoped, { target: canvas, props: { scope: { page: spec.page, answers, ...(spec.source ? { source: w.fleet } : {}) }, C, props: spec.props?.(w) ?? {} } });
	await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);
	/* settled: no DOM change for SETTLE_MS (the graph's wires are drawn a frame after its tiles are measured) */
	await new Promise<void>((res) => {
		let last = performance.now();
		const t0 = last;
		const mo = new MutationObserver(() => { last = performance.now(); });
		mo.observe(canvas, { subtree: true, childList: true, attributes: true, characterData: true });
		const tick = () => { const n = performance.now(); if (n - last >= SETTLE_MS || n - t0 > SETTLE_MAX_MS) { mo.disconnect(); res(); } else requestAnimationFrame(tick); };
		requestAnimationFrame(tick);
	});
	const target = spec.frame(canvas);
	const cr = canvas.getBoundingClientRect(), tr = target?.getBoundingClientRect();
	const box = tr ? new DOMRect(tr.left - cr.left, tr.top - cr.top, tr.width, tr.height) : new DOMRect(0, 0, cr.width, cr.height);
	const el = canvas.cloneNode(true) as HTMLElement;
	el.setAttribute('inert', '');
	unmount(app);
	canvas.remove();
	if (added) dropPart(spec.id);
	return { el, box };
}

export function mountSection<W extends SectionWorld>(ctx: CustomCtx, spec: SectionSpec<W>) {
	const { wrap, host } = ctx;
	host.setAttribute('aria-hidden', 'true');
	wrap.setAttribute('inert', '');
	const frame = document.createElement('div');
	frame.className = 'sec-frame';
	/* offstage: the live render lays out at its real width but is never seen (the poster, then the previous still, cover the box) */
	const stage = document.createElement('div');
	stage.className = 'sec-stage';
	wrap.append(frame, stage);
	const restI = spec.rest ?? 0;
	let stills: { el: HTMLElement; box: DOMRect }[] = [];
	let shown = -1, cw = 0, adj = 0, gen = 0, done = false, timer: ReturnType<typeof setInterval> | undefined;
	const gates = { motion: true, onscreen: false, visible: true };
	const place = (s: { el: HTMLElement; box: DOMRect }) => {
		/* the host may re-place the frame (the page's design, not the island's): data-align-x / data-align-y = start | center, data-pad = px */
		const d = host.dataset, a = { ...spec.align, ...(d.alignX ? { x: d.alignX as 'start' } : {}), ...(d.alignY ? { y: d.alignY as 'start' } : {}), ...(d.pad ? { pad: Number(d.pad) } : {}) };
		const pad = a.pad ?? 0, W = host.clientWidth, H = host.clientHeight;
		const x = a.x === 'center' ? (W - s.box.width) / 2 : pad, y = a.y === 'center' ? (H - s.box.height) / 2 : pad;
		s.el.style.transform = `translate(${Math.round(x - s.box.x)}px, ${Math.round(y - s.box.y)}px)`;
	};
	const show = (i: number) => {
		if (i === shown || !stills[i]) return;
		const prev = stills[shown];
		shown = i;
		const s = stills[i];
		place(s);
		s.el.style.opacity = '1';
		if (prev) prev.el.style.opacity = '0';
	};
	const loop = () => {
		clearInterval(timer); timer = undefined;
		const run = stills.length > 1 && gates.motion && gates.onscreen && gates.visible;
		if (!run) { if (!gates.motion) show(restI); return; }
		timer = setInterval(() => show((shown + 1) % stills.length), spec.holdMs ?? 3200);
	};
	let C: Component<any> | undefined;
	async function render() {
		const my = ++gen;
		done = false;
		const want = spec.canvas(host.clientWidth);
		C ??= await spec.load();
		const order = [restI, ...spec.times.map((_, i) => i).filter((i) => i !== restI)];
		const next: { el: HTMLElement; box: DOMRect }[] = [];
		for (const i of order) {
			let s = await still(spec, C, stage, spec.times[i], want + adj);
			for (let k = 0; spec.fit === 'width' && k < 2 && Math.abs(s.box.width - host.clientWidth) >= 1; k++) {
				adj += Math.round(host.clientWidth - s.box.width);
				s = await still(spec, C, stage, spec.times[i], want + adj);
			}
			if (my !== gen) return;
			s.el.classList.add('sec-still');
			s.el.style.opacity = '0';
			s.el.style.transition = `opacity ${spec.fadeMs ?? 600}ms ease-in-out`;
			next[i] = s;
			if (i === restI) {
				/* the first still replaces the old set (a re-render after a width change) without a blank frame: in, then the old ones out */
				frame.appendChild(s.el);
				place(s);
				const old = stills;
				stills = next; shown = -1;
				s.el.style.transition = 'none';
				show(restI);
				await frames2();
				s.el.style.transition = `opacity ${spec.fadeMs ?? 600}ms ease-in-out`;
				for (const o of old) o?.el.remove();
				ctx.ready();
			} else frame.appendChild(s.el);
		}
		cw = want;
		done = true;
		loop();
	}
	void render();
	ctx.onGate((g, v) => { gates[g] = v; loop(); });
	/* a width change that moves the product's layout re-renders; any other only re-places the frame */
	let rt: ReturnType<typeof setTimeout> | undefined;
	new ResizeObserver(() => {
		if (!stills.length) return;
		if (spec.canvas(host.clientWidth) !== cw) { clearTimeout(rt); rt = setTimeout(() => void render(), 150); }
		else for (const s of stills) if (s) place(s);
	}).observe(host);
	(host as any).__section = { get stills() { return stills.length; }, get shown() { return shown; }, show, get canvas() { return cw; }, get boxes() { return stills.map((s) => s?.box); }, /** every still of the current width rendered */ get done() { return done; }, rest: restI, count: spec.times.length };
	return () => { gen++; clearInterval(timer); };
}
