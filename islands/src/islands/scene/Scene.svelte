<svelte:options runes={true} />

<script lang="ts">
	/**
	 * THE HERO SCENE (landing scene lane 1, owner 2026-11-12): "promotes across environments" as ONE object changing state, like Railway's landing.
	 * No page, no navigation, no camera, no app chrome: the dashboard's own environment strip (EnvRow, the one row every page draws), the build's chip travelling
	 * along it, and ONE fixed panel under it (the product's Card) that explains the hop in flight. Every component here is the dashboard's; the only new
	 * drawing is the canary traffic split (the product has no traffic meter: two product-token segments labelled with the two builds) and the pointer.
	 * 0px rule: the strip's shape is topology, the panel is a fixed slot, rows keep their slots; only marks, words, the bar widths and the chip's x change.
	 */
	import { untrack } from 'svelte';
	import EnvRow, { type EnvCell, type EnvSite } from '$lib/components/EnvRow.svelte';
	import Card from '$lib/components/Card.svelte';
	import Chip from '$lib/components/Chip.svelte';
	import StatusMark from '$lib/components/StatusMark.svelte';
	import StatusSpinner from '$lib/components/StatusSpinner.svelte';
	import SiteMark from '$lib/components/SiteMark.svelte';
	import GateLabel from '$lib/components/GateLabel.svelte';
	import AppGlyph from '$lib/components/AppGlyph.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import { getEnvironmentThemeStyle, getRolloutEnvironmentTheme } from '$lib/environment-theme';
	import { CheckCircleSolid, ChevronDoubleRightOutline, CalendarWeekOutline, UserCircleOutline, HeartOutline, LockOutline, TagOutline, ArrowsRepeatOutline, GlobeOutline, CheckOutline } from 'flowbite-svelte-icons';
	import Cursor from '../film/Cursor.svelte';
	import SceneChrome from './SceneChrome.svelte';
	import {
		CHAPTERS, LOOP, DISSOLVE, EV, BUILD, PREV, TITLE, AUTHOR, APPROVER, TIERS, PROD_SITES, WORD,
		chapterAt, chapterFill, phaseAt, siteState, chipAt, healthChecks, bake, gates, approveShown, pointer, traffic, canaryStep, canaryTests, type Tier, type Phase
	} from './script';

	let { t, playing, userPlaying, reduced, wrapped, onseek, ontoggle, onshown }: {
		t: number; playing: boolean; userPlaying: boolean; reduced: boolean; wrapped: boolean;
		onseek: (i: number) => void; ontoggle: () => void; onshown: () => void;
	} = $props();

	let W = $state(0), H = $state(0);
	const phone = $derived(W > 0 && W < 600);
	/* the design box: the scene is laid out at 1x on a fixed width and zoomed to fit; the panel stops at 1.3x so the strip (always 1.5x, the cap) reads as the hero */
	const DW = $derived(phone ? Math.max(300, W - 24) : 560);
	const DH = $derived(phone ? 520 : 420);
	const k = $derived(phone ? 1 : Math.max(0.6, Math.min(1.3, (W - 80) / DW, (H - 24) / DH)));

	/* ---- the strip: dev -> staging -> prod, each tier's sites in topology order ---- */
	const style = (tier: Tier) => getEnvironmentThemeStyle(getRolloutEnvironmentTheme(null, tier));
	const site = (tier: Tier, name: string, wave: number | null): EnvSite => {
		const st = siteState(t, tier, name);
		return { key: name, name, wave, state: st, word: WORD[st] };
	};
	const here = $derived(chipAt(t));
	const cells = $derived<EnvCell[]>(
		TIERS.map((tier) => {
			const sites = tier === 'prod' ? PROD_SITES.map((s) => site('prod', s.name, s.wave)) : [site(tier, tier, null)];
			const reached = sites.some((s) => s.state !== 'notreached');
			return { key: tier, label: tier, sites, hot: reached, current: here === tier, style: style(tier) };
		})
	);

	/* strip geometry: measured once per size (the shape never changes with state); the strip is centred and zoomed to 1.5x of product pixels */
	let scene: HTMLElement | undefined = $state();
	let stripEl: HTMLElement | undefined = $state();
	let boxes = $state<Record<string, { x: number; w: number }>>({});
	let stripW = $state(0);
	const SW = $derived(phone ? DW : 560); /* the row's own container width: >= 560 draws the connectors between boxes */
	const zs = $derived(phone ? Math.min(1, stripW ? DW / stripW : 1) : Math.min(1.5 / k, stripW ? (DW - 8) / stripW : 1));
	const measure = () => {
		if (!stripEl || !scene) return;
		const els = [...stripEl.querySelectorAll<HTMLElement>('[data-env-box]')];
		if (!els.length) return;
		/* rects of the UNZOOMED row (offset* are layout px inside the zoomed wrapper) */
		const row = stripEl.querySelector<HTMLElement>('[data-env-row]');
		const base = row?.getBoundingClientRect();
		const z = (stripEl.getBoundingClientRect().width / Math.max(1, stripEl.offsetWidth)) || 1;
		const out: Record<string, { x: number; w: number }> = {};
		let right = 0;
		for (const el of els) {
			const r = el.getBoundingClientRect();
			const x = (r.left - (base?.left ?? 0)) / z, w = r.width / z;
			const key = el.getAttribute('data-stage-tile')?.split('|').pop() ?? '';
			out[key] = { x, w };
			right = Math.max(right, x + w);
		}
		if (Math.abs(right - stripW) > 0.5) stripW = right;
		if (JSON.stringify(out) !== JSON.stringify(boxes)) boxes = out;
	};
	$effect(() => {
		void W; void H; void SW;
		const ro = new ResizeObserver(() => measure());
		if (stripEl) ro.observe(stripEl);
		requestAnimationFrame(() => measure());
		return () => ro.disconnect();
	});
	let shown = false;
	$effect(() => { if (!shown && stripW > 0 && W > 0) { shown = true; requestAnimationFrame(() => onshown()); } });

	/* the chip: the build itself, centred over the box it runs in (design px of the scene) */
	const off = $derived(stripW ? (DW - stripW * zs) / 2 : 0);
	const chipX = $derived.by(() => { const b = boxes[here]; return b ? off + (b.x + b.w / 2) * zs : DW / 2; });
	let chipW = $state(0);
	/* the chip stays inside the canvas (a phone's dev box sits at the edge); its stem still points at the box's centre */
	const chipL = $derived(Math.max(2, Math.min(DW - chipW - 2, chipX - chipW / 2)));
	const newTag = $derived(t < EV.hop1);
	const shine = $derived(!reduced && t >= 0.25 && t < 1.55);

	/* ---- the panel ---- */
	const phase = $derived<Phase>(phaseAt(t));
	const hcs = $derived(healthChecks(t));
	const bk = $derived(bake(t));
	const gs = $derived(gates(t));
	const tests = $derived(canaryTests(t));
	const pct = $derived(traffic(t));
	const devSt = $derived(siteState(t, 'dev'));
	const stgSt = $derived(siteState(t, 'staging'));
	const stgDone = $derived(t >= EV.stgDone);
	const passingN = $derived(hcs.filter((c) => c.state === 'passing').length);
	const gatesN = $derived(gs.filter((g) => g.state === 'passing').length);
	const waves = $derived([1, 2, 3].map((w) => PROD_SITES.filter((s) => s.wave === w).map((s) => ({ name: s.name, state: siteState(t, 'prod', s.name) }))));
	const prodDone = $derived(waves.flat().filter((s) => s.state === 'done').length);
	const PANEL_PHONE: Record<Phase, string> = { release: 'Released', health: 'Health checks', gates: 'Gates to prod', canary: 'Canary', sites: 'Prod sites' };
	const PANEL: Record<Phase, { title: string; icon: any }> = {
		release: { title: 'Released', icon: TagOutline },
		health: { title: 'Health checks in staging', icon: HeartOutline },
		gates: { title: 'Gates before prod', icon: LockOutline },
		canary: { title: 'Canary in us-east-1', icon: ArrowsRepeatOutline },
		sites: { title: 'Prod sites', icon: GlobeOutline }
	};
	/* the content swap: the slot stays, the content fades through (160 ms out, 200 ms in) */
	let shownPhase = $state<Phase>('release');
	let fade = $state(1);
	$effect(() => {
		const p = phase;
		untrack(() => {
			if (p === shownPhase) return;
			if (reduced || !playing) { shownPhase = p; fade = 1; return; }
			fade = 0;
			setTimeout(() => { shownPhase = p; fade = 1; }, 160);
		});
	});

	/* ---- the one human act: the pointer presses Approve ---- */
	let approveEl: HTMLElement | undefined = $state();
	let ptrXY = $state({ x: 0, y: 0 });
	const ptr = $derived(pointer(t));
	$effect(() => {
		void t; void W; void shownPhase; void approveEl;
		untrack(() => {
			if (!approveEl || !scene) return;
			const s = scene.getBoundingClientRect(), r = approveEl.getBoundingClientRect(), z = s.width / Math.max(1, scene.offsetWidth) || 1;
			const bx = (r.left - s.left + r.width * 0.55) / z, by = (r.top - s.top + r.height * 0.6) / z;
			const x = ptr.atButton ? bx : bx + 70, y = ptr.atButton ? by : by + 46;
			if (Math.abs(x - ptrXY.x) > 0.5 || Math.abs(y - ptrXY.y) > 0.5) ptrXY = { x, y };
		});
	});

	/* the wrap: a soft dissolve out over the loop's last DISSOLVE s, and in after t=0 when the story wrapped (never on the first frame: the poster is that frame) */
	const dip = (f: number) => 0.2 + 0.8 * Math.max(0, Math.min(1, f)); /* a soft dip, never empty ground */
	const opacity = $derived(reduced ? 1 : t > LOOP - DISSOLVE ? dip((LOOP - t) / DISSOLVE) : wrapped && t < DISSOLVE ? dip(t / DISSOLVE) : 1);
	const lit = $derived(chapterAt(t));
	const fill = $derived(chapterFill(t));
</script>

<div class="sc" class:sc-phone={phone} bind:clientWidth={W} bind:clientHeight={H}>
	<div class="sc-frame">
		<div class="sc-canvas" inert aria-hidden="true" bind:this={scene} style="width:{DW}px;zoom:{k};opacity:{opacity}">
			<!-- the app this is: one line, quiet -->
			<div class="sc-app">
				<AppGlyph name="checkout-api" size={20} />
				<span class="t-ui text-fg">checkout-api</span>
			</div>

			<!-- the build travels: its chip glides over the box it runs in -->
			<div class="sc-track">
				<span class="sc-chip" class:sc-chip-glide={!reduced} bind:offsetWidth={chipW} style="transform:translate3d({chipL}px,0,0)">
					<span class="sc-build t-code-sm">{BUILD}</span>
					{#if newTag}<span class="sc-new" class:sc-new-shine={shine}><Chip role="newest" label="New" dot={false} /></span>{/if}
					<i class="sc-stem" style="left:{chipX - chipL}px"></i>
				</span>
			</div>

			<!-- the spine: dev -> staging -> prod -->
			<div class="sc-strip" style="zoom:{zs};margin-left:{off / zs}px">
				<div class="sc-strip-row" bind:this={stripEl} style="width:{SW}px">
					<EnvRow {cells} lane="scene" size="L" />
				</div>
			</div>

			<!-- the panel: one fixed slot, its content says what this hop needs -->
			<div class="sc-panel" style="--sc-fade:{fade}">
				<Card icon={PANEL[shownPhase].icon} title={phone ? PANEL_PHONE[shownPhase] : PANEL[shownPhase].title} padded={false} class="h-full" bodyClass="sc-body">
					{#snippet rollup()}
						<span class="sc-roll t-ui-sm tabular-nums" style="opacity:{fade}">
							{#if shownPhase === 'release'}<span class={devSt === 'done' ? 'text-success' : 'text-progress'}>{devSt === 'done' ? 'Healthy in dev' : devSt === 'notreached' ? 'Just now' : devSt === 'deploying' ? 'Deploying to dev' : 'Checking dev'}</span>
							{:else if shownPhase === 'health'}{#if stgDone}<span class="text-success">3/3 healthy</span>{:else if passingN < 3}<span class="text-progress">{3 - passingN} pending · {passingN} passing</span>{:else}<span class="text-progress">Baking · 3/3 passing</span>{/if}
							{:else if shownPhase === 'gates'}{#if gatesN === 3}<span class="text-success">All 3 gates passed</span>{:else}<span class="text-held">{3 - gatesN} of 3 holding</span>{/if}
							{:else if shownPhase === 'canary'}{#if t >= EV.w1Done}<span class="text-success">Healthy at 100%</span>{:else}<span class="text-progress">Step {canaryStep(t)} of 3 · {pct}%</span>{/if}
							{:else}<span class={prodDone === 5 ? 'text-success' : 'text-progress'}>{prodDone} of 5 healthy</span>{/if}
						</span>
					{/snippet}
					<div class="sc-content" style="opacity:{fade}">
						{#if shownPhase === 'release'}
							<div class="sc-row sc-row-lead">
								<span class="sc-mk"><span class="sc-dot"></span></span>
								<span class="sc-main">
									<span class="sc-line"><span class="t-code text-fg">{BUILD}</span><Chip role="newest" label="New" dot={false} /></span>
									<span class="t-body text-fg-muted sc-ell">{TITLE}</span>
								</span>
							</div>
							<div class="sc-row">
								<span class="sc-mk"></span>
								<span class="sc-main sc-who t-meta text-fg-muted"><Avatar name={AUTHOR} size={16} />{AUTHOR}<span class="t-code-sm text-fg-subtle">#112</span><span class="text-fg-subtle">· Released just now</span></span>
							</div>
							<div class="sc-row sc-row-rule">
								<span class="sc-mk"><SiteMark state={devSt} /></span>
								<span class="sc-main t-body text-fg">dev</span>
								<span class="sc-side t-meta {devSt === 'done' ? 'text-success' : devSt === 'notreached' ? 'text-fg-subtle' : 'text-progress'}">{devSt === 'notreached' ? 'Next' : WORD[devSt]}</span>
							</div>
							<div class="sc-foot t-meta text-fg-subtle">Every build starts in dev, then moves on by itself</div>
						{:else if shownPhase === 'health'}
							{#each hcs as c (c.name)}
								<div class="sc-row">
									<span class="sc-mk">{#if c.state === 'passing'}<CheckCircleSolid class="h-4 w-4 text-success" />{:else if c.state === 'pending'}<StatusSpinner size="4" color="yellow" />{:else}<span class="sc-ring"></span>{/if}</span>
									<span class="sc-main t-body text-fg-muted sc-ell">{c.name}</span>
									<span class="sc-side t-meta {c.state === 'passing' ? 'text-fg-subtle' : c.state === 'pending' ? 'text-progress' : 'text-fg-subtle'}">{c.state === 'passing' ? 'passing' : c.state === 'pending' ? 'checking' : 'waiting'}</span>
								</div>
							{/each}
							<div class="sc-bake">
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-line">
									<div class="h-full rounded-full {bk.done ? 'bg-success-solid' : 'bg-progress-solid bar-progress-active'}" style="width:{bk.pct}%"></div>
								</div>
								<p class="t-meta mt-1.5 {bk.done ? 'text-success' : 'text-fg-subtle'}">{bk.text}</p>
							</div>
						{:else if shownPhase === 'gates'}
							{#each gs as g (g.key)}
								<div class="sc-row">
									<span class="sc-mk">{#if g.key === 'promotion'}<ChevronDoubleRightOutline class="h-4 w-4 text-fg-subtle" />{:else if g.key === 'hours'}<CalendarWeekOutline class="h-4 w-4 text-fg-subtle" />{:else}<UserCircleOutline class="h-4 w-4 text-fg-subtle" />{/if}</span>
									<span class="sc-main t-body text-fg sc-ell">{#if g.key === 'promotion'}<GateLabel label={{ kind: 'promotion', source: 'staging' } as any} glyph={false} />{:else if g.key === 'hours'}Business hours{:else}Approval{/if}</span>
									<span class="sc-side sc-gate t-meta">
										{#if g.key === 'approval' && approveShown(t)}
											<span class="text-held">Waiting</span><span class="btn btn-secondary btn-xs" bind:this={approveEl}><CheckOutline class="h-4 w-4 shrink-0" />Approve</span>
										{:else if g.state === 'passing'}
											<span class="text-fg-subtle">{g.key === 'promotion' ? 'staging is healthy' : g.key === 'hours' ? 'open until 18:00' : 'by ' + APPROVER}</span><CheckCircleSolid class="h-4 w-4 text-success" />
										{:else}
											<span class="text-progress">staging checking</span><StatusSpinner size="4" color="yellow" />
										{/if}
									</span>
								</div>
							{/each}
							<div class="sc-foot t-meta {gatesN === 3 ? 'text-success' : 'text-fg-subtle'}">{gatesN === 3 ? 'Every gate passed: prod deploys on its own' : 'prod deploys when every gate passes'}</div>
						{:else if shownPhase === 'canary'}
							<div class="sc-split">
								<div class="sc-bar"><i class="sc-new-seg" class:sc-seg-glide={!reduced} style="width:{pct}%"></i></div>
								<div class="sc-legend t-meta tabular-nums">
									<span class="sc-lg text-fg"><i class="sc-key sc-key-new"></i><span class="t-code-sm">{BUILD}</span><b>{pct}%</b></span>
									<span class="sc-lg text-fg-muted"><b>{100 - pct}%</b><span class="t-code-sm">{PREV}</span><i class="sc-key sc-key-old"></i></span>
								</div>
							</div>
							<div class="sc-sub t-label text-fg-subtle">Canary tests at 10%</div>
							{#each tests as c (c.name)}
								<div class="sc-row sc-row-tight">
									<span class="sc-mk">{#if c.state === 'passing'}<CheckCircleSolid class="h-4 w-4 text-success" />{:else if c.state === 'pending'}<StatusSpinner size="4" color="yellow" />{:else}<span class="sc-ring"></span>{/if}</span>
									<span class="sc-main t-body text-fg-muted sc-ell">{c.name}</span>
									<span class="sc-side t-meta {c.state === 'pending' ? 'text-progress' : 'text-fg-subtle'}">{c.state === 'passing' ? 'passed' : c.state === 'pending' ? 'running' : 'waiting'}</span>
								</div>
							{/each}
						{:else}
							{#each waves as w, i (i)}
								<div class="sc-row">
									<span class="sc-mk sc-marks">{#each w as s (s.name)}<SiteMark state={s.state} />{/each}</span>
									<span class="sc-main t-body text-fg sc-ell"><span class="text-fg-subtle">Wave {i + 1}</span>&nbsp; {phone ? (w.length === 1 ? w[0].name : w.length + ' sites') : w.map((s) => s.name).join(', ')}</span>
									<span class="sc-side t-meta {w.every((s) => s.state === 'done') ? 'text-success' : w.some((s) => s.state === 'checking' || s.state === 'deploying') ? 'text-progress' : 'text-fg-subtle'}">{w.every((s) => s.state === 'done') ? 'Healthy' : w.some((s) => s.state === 'deploying') ? 'Deploying' : w.some((s) => s.state === 'checking') ? 'Checking' : 'Next'}</span>
								</div>
							{/each}
							<div class="sc-foot t-meta {prodDone === 5 ? 'text-success' : 'text-fg-subtle'}">{prodDone === 5 ? `${BUILD} runs everywhere` : 'each wave starts when the one before is healthy'}</div>
						{/if}
					</div>
				</Card>
			</div>
			<Cursor x={ptrXY.x} y={ptrXY.y} on={ptr.on && !reduced && shownPhase === 'gates'} press={ptr.press} touch={phone} />
		</div>
	</div>
	<SceneChrome chapters={CHAPTERS} {lit} {fill} {reduced} playing={userPlaying} narrow={phone} {onseek} {ontoggle} />
</div>

<style>
	.sc { position: relative; width: 100%; height: 100%; }
	.sc-frame { position: absolute; inset: 0; overflow: hidden; border-radius: inherit; display: flex; align-items: center; justify-content: center; background: var(--k-ground); }
	.sc-canvas { position: relative; display: flex; flex-direction: column; align-items: stretch; transition: opacity 0.12s linear; }
	.sc-app { display: flex; align-items: center; gap: 8px; height: 28px; }
	.sc-app :global(.t-meta) { margin-left: 4px; }
	.sc-track { position: relative; height: 40px; margin-top: 24px; }
	.sc-chip { position: absolute; left: 0; bottom: 8px; display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 6px 0 9px; margin-left: 0; border: 1px solid var(--k-line-strong); border-radius: 6px; background: var(--k-surface); box-shadow: 0 1px 2px rgb(0 0 0 / 0.06); white-space: nowrap; }
	.sc-chip-glide { transition: transform 0.62s cubic-bezier(0.22, 0.8, 0.24, 1); }
	.sc-build { color: var(--k-fg); }
	.sc-stem { position: absolute; bottom: -9px; width: 1px; height: 8px; background: var(--k-line-strong); }
	/* the NEW tag rides the chip until the first hop (the chip is centred on its box: it narrows in place, nothing else moves) */
	.sc-new { display: inline-flex; position: relative; overflow: hidden; border-radius: 4px; }
	.sc-new-shine { animation: sc-glow 1.3s ease-out both; }
	.sc-new-shine::after { content: ''; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 15%, color-mix(in srgb, var(--k-success-fg) 45%, transparent) 45%, transparent 75%); transform: translateX(-120%); animation: sc-shine 1.1s ease-in-out both; }
	@keyframes sc-shine { to { transform: translateX(120%); } }
	@keyframes sc-glow { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--k-success-fg) 0%, transparent); } 35% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--k-success-fg) 30%, transparent); } 100% { box-shadow: 0 0 0 7px color-mix(in srgb, var(--k-success-fg) 0%, transparent); } }
	.sc-strip { width: max-content; }
	.sc-strip-row { width: 560px; }
	.sc-panel { margin-top: 28px; height: 244px; }
	.sc-panel :global(.sc-body) { flex: 1 1 auto; min-height: 0; }
	/* the title swaps with the content (the slot stays) */
	.sc-panel :global(.card-header > svg), .sc-panel :global(.card-header h2) { opacity: var(--sc-fade); transition: opacity 0.16s ease; }
	.sc-content { padding: 6px 0; transition: opacity 0.16s ease; }
	.sc-roll { transition: opacity 0.16s ease; white-space: nowrap; }
	.sc-row { display: grid; grid-template-columns: 16px minmax(0, 1fr) auto; column-gap: 12px; align-items: center; min-height: 40px; padding: 0 16px; }
	.sc-row-tight { min-height: 34px; }
	.sc-row-lead { min-height: 48px; }
	.sc-row-rule { border-top: 1px solid var(--k-line-subtle); margin-top: 6px; }
	.sc-mk { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; }
	.sc-marks { width: auto; justify-content: flex-start; gap: 0; }
	.sc-row:has(.sc-marks) { grid-template-columns: 52px minmax(0, 1fr) auto; }
	.sc-dot { width: 8px; height: 8px; border-radius: 999px; background: var(--k-fg); }
	.sc-ring { width: 12px; height: 12px; border-radius: 999px; border: 1.5px dashed var(--k-fg-subtle); }
	.sc-main { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
	.sc-line { display: inline-flex; align-items: center; gap: 8px; }
	.sc-who { flex-direction: row; align-items: center; gap: 6px; }
	.sc-ell { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
	.sc-side { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; justify-self: end; }
	.sc-gate { min-width: 170px; justify-content: flex-end; min-height: 28px; }
	.sc-bake { padding: 10px 16px 0 44px; }
	.sc-foot { padding: 10px 16px 0 44px; }
	.sc-sub { padding: 10px 16px 2px 16px; text-transform: uppercase; letter-spacing: 0.04em; }
	.sc-split { padding: 12px 16px 4px; }
	.sc-bar { position: relative; height: 10px; border-radius: 999px; overflow: hidden; background: var(--k-line-strong); }
	.sc-new-seg { position: absolute; left: 0; top: 0; bottom: 0; background: var(--k-success-solid, #16a34a); border-radius: 999px; }
	.sc-seg-glide { transition: width 0.7s cubic-bezier(0.22, 0.8, 0.24, 1); }
	.sc-legend { display: flex; justify-content: space-between; margin-top: 8px; }
	.sc-legend b { font-weight: 600; }
	.sc-lg { display: inline-flex; align-items: center; gap: 6px; }
	.sc-key { display: inline-block; width: 8px; height: 8px; border-radius: 2px; vertical-align: 0; }
	.sc-key-new { background: var(--k-success-solid, #16a34a); }
	.sc-key-old { background: var(--k-line-strong); }
	.sc-phone .sc-panel { height: 272px; }
	.sc-phone .sc-gate { min-width: 0; }
	.sc-phone .sc-gate > span:first-child:not(.btn) { display: none; }
</style>
