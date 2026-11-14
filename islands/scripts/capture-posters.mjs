// Captures the hero film's static first frame (t=0) as LAYERS that the shortcode (layouts/_shortcodes/island.html) lays out exactly as the film does,
// at any window width (AD r3: one fixed bitmap per media band, background-size:cover, was up to 22 % too large and lost up to 127 px on the right).
//
// The film is a canvas of a fixed width (1000 px from a 600 px window, 390 px below) zoomed to the window width, k = W / CW, and as tall as the window
// allows (CH = H / k); its chapter bar above the window is NOT zoomed (a panel 12 px in from each side, its pieces anchored left, centre and right).
// So the poster is three layers inside .ph-poster (a size container: the window width W):
//   .ph-win    the window: the canvas at t=0 shot at the band's widest W, `background-size: 100% auto`, so it is drawn at exactly the film's scale
//              (k = W / CW) and position (top-left). It is shot from a TALLER window, so at the band's narrowest W (more canvas rows visible) it still
//              reaches the bottom. Its corners are the frame's (11 px). On the phone the bottom nav is its own layer, anchored to the bottom as the film's.
//   .ph-panel  the chapter bar's panel, drawn in CSS from its computed style (background, border, radius, shadow): exact at every width.
//   .ph-center the chapter bar, centred in the box the bar's grid centres it in (cl/cr insets) + its offset; .ph-chrome the tally / play at the right;
//   .ph-left   the left piece (clock, env strip; on the phone the tabs too, clipped where their scroller ends, an edge anchored to the panel's right).
// Bands (BANDS, window widths): a band is shot at its widest W and serves every W above the previous band's, so a poster is never upscaled (scale <= 1)
// and never below ~0.93. The phone (CW 390) and desktop (CW 1000) films and the chapter bar's own layouts (narrow < 600, tight < 1000) never share a band.
//
// usage: node scripts/capture-posters.mjs [url]   (playwright from the dashboard's node_modules; ImageMagick `convert` for the crops and webp)
// writes ../static/island-poster/p-<W>-<layer>-<theme>.webp and ../data/island_poster.yaml (v: the posters' content hash, the panel style, the bands).
// Check: node scripts/film/poster-match.mjs <url>  (JS-off poster vs the live first frame at every width, and the scale table).
import { chromium } from '/home/luka/projects/kuberik/rollout-dashboard/frontend/node_modules/@playwright/test/index.mjs';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
const PAGE = process.argv[2] ?? 'http://127.0.0.1:1313/';
const OUT = new URL('../../static/island-poster/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
/* [W shot, viewport giving it, window height H there, narrowest W the band serves]: the page's window widths are W = vw - 42 (phone, H 498),
   vw - 74 (641-767, H 638), 694 (768-1023), vw - 146 (1024-1263), 1118 (1264-1919), 1438 (1920-2399, H 821), 1598 (2400+, H 912) */
const BANDS = [
	[298, 340, 498, 278], [318, 360, 498, 299], [339, 381, 498, 319], [348, 390, 498, 340], /* the phone tabs scroll (clipped) below a 339.3 px window */
	[599, 673, 638, 567],
	[663, 737, 638, 600], [694, 768, 638, 664], /* the tight bar's tabs scroll (clipped) below a 664 px window */
	[940, 1086, 638, 878], [999, 1145, 638, 941],
	[1060, 1206, 638, 1000], [1118, 1264, 638, 1061],
	[1438, 1920, 821, 1438], [1598, 2400, 912, 1598],
];
/* the film's first-frame camera y (canvas px) at every window width of a band: the desktop frame lifts its page up to ~11 px so the frame's foot lands in a
   gap between rows, a lift that changes with the window's height in canvas px (H / k), so with W. One page per band, resized W by W; runs of equal y. */
async function sweep(W, vw, Wmin) {
	const ctx = await b.newContext({ viewport: { width: vw, height: 1400 }, deviceScaleFactor: 1, ...(vw < 500 ? { isMobile: true, hasTouch: true } : {}) });
	await ctx.route(/livereload/, (r) => r.abort());
	const p = await ctx.newPage(); await p.goto(PAGE + '?capture=1', { waitUntil: 'load' });
	await p.waitForFunction(() => document.querySelector('[data-island="hero"]')?.shadowRoot?.querySelector('.film-canvas') && !document.querySelector('[data-island="hero"] .ph-poster'), null, { timeout: 30000 });
	const runs = [];
	for (let w = W; w >= Wmin; w--) {
		await p.setViewportSize({ width: vw - (W - w), height: 1400 }); await p.waitForTimeout(200);
		await p.evaluate(() => document.querySelector('[data-island="hero"]').__story.at(0)); await p.waitForTimeout(700);
		await p.evaluate(() => document.querySelector('[data-island="hero"]').__story.player.seek(0)); await p.waitForTimeout(80);
		const r = await p.evaluate(() => { const h = document.querySelector('[data-island="hero"]'); const t = h.shadowRoot.querySelector('.film-cam').style.transform; const m = t.match(/translate(?:3d)?\(([-\d.]+)px, ([-\d.]+)px/); return { w: h.getBoundingClientRect().width, y: m ? +m[2] : 0, x: m ? +m[1] : 0 }; });
		if (Math.abs(r.w - w) > 0.01 || r.x) throw new Error(`sweep: window ${r.w} at ${w}, camera x ${r.x}`);
		if (!runs.length || runs[0][1] !== r.y) runs.unshift([w, r.y]); else runs[0][0] = w;
	}
	await ctx.close(); return runs;
}
const ONLY = process.env.ONLY ? process.env.ONLY.split(',').map(Number) : null;
const webp = (png, out) => execFileSync('convert', [png, '-quality', '72', '-define', 'webp:method=6', '-define', 'webp:alpha-quality=100', out]);
const b = await chromium.launch();
const bands = [], panel = {};
for (const [W, vw, H, Wmin] of BANDS) {
	if (ONLY && !ONLY.includes(W)) continue;
	const CW = W < 600 ? 390 : 1000;
	/* the window the layers are shot from: at Wmin, 100% auto still reaches the bottom, with the camera's first-frame lift (<= 12 canvas px) below that */
	const Hc = Math.ceil((H * W) / Wmin + (14 * W) / CW) + 2;
	const cy = await sweep(W, vw, Wmin);
	for (const theme of ['light', 'dark']) for (let attempt = 0; ; attempt++) try {
		const ctx = await b.newContext({ viewport: { width: vw, height: Hc + 500 }, deviceScaleFactor: 1, colorScheme: theme, ...(vw < 500 ? { isMobile: true, hasTouch: true } : {}) });
		await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} }, theme);
		await ctx.route(/livereload/, (r) => r.abort());
		const p = await ctx.newPage();
		await p.goto(PAGE + '?capture=1', { waitUntil: 'load' });
		await p.waitForFunction(() => document.querySelector('[data-island="hero"]')?.shadowRoot?.querySelector('.film-canvas') && !document.querySelector('[data-island="hero"] .ph-poster'), null, { timeout: 30000 });
		await p.evaluate(() => { const r = document.getElementById('hero-window').getBoundingClientRect(); scrollTo(0, scrollY + r.top - 120); });
		await p.waitForTimeout(300);
		await p.evaluate(() => document.querySelector('[data-island="hero"]').__story.at(0));
		await p.waitForTimeout(2500);
		/* playing again (the bar shows Pause, as the live first frame does); nothing changes before t=0.25 */
		await p.evaluate(() => document.querySelector('[data-island="hero"]').__story.player.seek(0));
		const m = await p.evaluate(() => {
			const host = document.querySelector('[data-island="hero"]'), R = host.shadowRoot, hr = host.getBoundingClientRect();
			const q = (s) => { const e = R.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? { x: r.x - hr.x, y: r.y - hr.y, w: r.width, h: r.height, r: r.right - hr.x, b: r.bottom - hr.y } : null; };
			const pe = R.querySelector('.fc-panel'), cs = getComputedStyle(pe), sc = R.querySelector('.fc-scroll');
			const tabs = [...R.querySelectorAll('.fc-tab')].map((t) => t.getBoundingClientRect().right - hr.x);
			return { cam: R.querySelector('.film-cam').style.transform, main: q('.film-main'), side: q('.film-side'), host: { x: hr.x, y: hr.y, w: hr.width, h: hr.height }, panel: q('.fc-panel'), left: q('.fc-left'), bar: q('.fc-bar'), tally: q('.fc-tally'), play: q('.fc-play'), scroll: q('.fc-scroll'),
				tabsEnd: Math.max(...tabs), overflow: sc ? sc.scrollWidth > sc.clientWidth + 0.5 : false, slack: sc ? sc.clientWidth - (Math.max(...[...sc.children].map((c) => c.getBoundingClientRect().right)) - sc.getBoundingClientRect().left + sc.scrollLeft) : 0, /* scrollWidth is never below clientWidth */ barSlack: (() => { const t = R.querySelector('.fc-tight .fc-bar'); if (!t) return null; const g = getComputedStyle(pe).gridTemplateColumns.split(' ').map(parseFloat); return g[1] - t.getBoundingClientRect().width; })(), tabbar: (() => { const rs = [...R.querySelectorAll('.film-tabs *')].map((e) => e.getBoundingClientRect()).filter((r) => r.height > 0); return rs.length ? { y: Math.min(...rs.map((r) => r.y)) - hr.y } : null; })(), /* the product's bar is `fixed` (to the canvas): .film-tabs itself is 0 px tall */ narrow: !!R.querySelector('.fc-narrow'), tight: !!R.querySelector('.fc-tight'), cols: cs.gridTemplateColumns.split(' ').map(parseFloat), padL: parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth), padR: parseFloat(cs.paddingRight) + parseFloat(cs.borderRightWidth), gap: parseFloat(cs.columnGap),
				style: { bg: cs.backgroundColor, bd: cs.borderTopColor, sh: cs.boxShadow, rad: cs.borderTopLeftRadius } };
		});
		if (m.narrow && m.slack < -0.01) m.overflow = true; /* a scroller 0.3 px short clips its last tab too */
		if (Math.abs(m.host.w - W) > 0.01 || Math.abs(m.host.h - H) > 0.01) throw new Error(`window ${m.host.w}x${m.host.h}, wanted ${W}x${H}`);
		panel[theme] = m.style;
		const P = m.panel, abs = (r) => ({ x: Math.round(m.host.x + r.x), y: Math.round(m.host.y + r.y), width: r.w, height: r.h }); /* the page paints a box at a fractional y on the rounded row: a floored clip took one row above (the canvas sat 1 px low) */
		const shadow = (css) => p.evaluate((css) => { const R = document.querySelector('[data-island="hero"]').shadowRoot; let s = R.getElementById('cap-style'); if (!s) { s = document.createElement('style'); s.id = 'cap-style'; R.appendChild(s); } s.textContent = css; }, css);
		const page = await p.addStyleTag({ content: '/* cap */' });
		/* the chapter bar's contents alone, on alpha: the page, the window and the panel's own paint hidden */
		await page.evaluate((e) => (e.textContent = 'html,body{background:transparent!important}body *{visibility:hidden!important}[data-island="hero"]{visibility:visible!important}'));
		await shadow('.film-frame{visibility:hidden!important}.fc-panel{background:transparent!important;border-color:transparent!important;box-shadow:none!important}');
		await p.waitForTimeout(150);
		const tmp = `${OUT}.cap-${W}-${theme}`;
		await p.evaluate(() => document.querySelector('[data-island="hero"]').__story.player.seek(0)); /* playing from 0 again, shot at once: the lit tab's fill is still empty */
		await p.screenshot({ path: `${tmp}-chrome.png`, clip: abs({ ...P, w: Math.round(P.w), h: Math.round(P.h) }), omitBackground: true });
		/* then the window grows to Hc AFTER the first frame is aimed: the camera keeps its aim (a window that is tall from the start frames differently) */
		await page.evaluate((e) => (e.textContent = ''));
		const tops = () => p.evaluate(() => { const host = document.querySelector('[data-island="hero"]'), hr = host.getBoundingClientRect(); return [...host.shadowRoot.querySelectorAll('.film-side *, .film-tabs *')].map((e) => { const r = e.getBoundingClientRect(); return r.height > 0 ? r.top - hr.y : null; }); });
		/* the canvas layers are shot over ~2 s: the film is held at t=0 for them (the story's at() pauses; the toast is due at 0.25 s, the NEW tag's shine
		   later). Only the chapter bar shows the play state, and it was shot playing, as the live first frame is */
		await p.evaluate(() => document.querySelector('[data-island="hero"]').__story.at(0));
		await p.waitForTimeout(300);
		const before = await tops();
		await p.addStyleTag({ content: `#hero-window{height:${Hc + 2}px!important}` /* the window has a 1 px border: the host is 2 px shorter */ });
		await p.waitForTimeout(400);
		const g = await p.evaluate(() => { const host = document.querySelector('[data-island="hero"]'), R = host.shadowRoot, hr = host.getBoundingClientRect();
			return { h: hr.height, cam: R.querySelector('.film-cam').style.transform }; });
		/* the foot = the shell's boxes that moved down with the window's bottom (bottom-anchored), from 8 px above the highest of them */
		const after = await tops(), moved = after.filter((t, i) => t !== null && before[i] !== null && Math.abs(t - before[i] - (Hc - H)) < 0.6);
		g.footTop = moved.length ? Math.min(...moved) - (m.narrow ? 0 : 8) : null;
		if (Math.abs(g.h - Hc) > 0.01) throw new Error(`grown window ${g.h} (wanted ${Hc})`); /* the camera's aim does not matter here: .ph-main is shot at 0 and lifted by the swept cy */
		/* the window's shell: the canvas without the chapter bar (its shadow is the CSS panel's), square corners (the poster rounds them), no bottom nav */
		await shadow('.fc{visibility:hidden!important}.film-frame{border-radius:0!important}.film-tabs{visibility:hidden!important}');
		await p.waitForTimeout(150);
		await p.screenshot({ path: `${tmp}-w.png`, clip: abs({ x: 0, y: 0, w: W, h: Hc }) });
		/* the foot: what the canvas anchors to its bottom (the phone's bottom nav, the sidebar's foot), its own layer drawn at the window's bottom */
		await shadow('.fc{visibility:hidden!important}.film-frame{border-radius:0!important}');
		await p.waitForTimeout(150);
		const footH = Math.round(Hc - g.footTop), footW = m.narrow ? W : Math.round(m.side.r);
		if (!(footH >= 20 && footH < Hc / 2)) throw new Error(`foot ${footH} px in a ${Hc} window`);
		await p.screenshot({ path: `${tmp}-t.png`, clip: abs({ x: 0, y: Hc - footH, w: footW, h: footH }) });
		/* the main column with the camera at 0: the poster lifts it by the film's own first-frame camera at each W (cy, swept per W) */
		await shadow('.fc{visibility:hidden!important}.film-frame{border-radius:0!important}.film-tabs{visibility:hidden!important}.film-cam{transform:none!important;transition:none!important}');
		await p.waitForTimeout(250);
		const mx = Math.round(m.main.x), my = Math.round(m.main.y);
		await p.screenshot({ path: `${tmp}-m.png`, clip: abs({ x: mx, y: my, w: W - mx, h: Hc - my }) });
		await ctx.close();
		/* the pieces, in panel px: left (to the clock/envs and, on the phone, the tabs), centre (the chapter bar; the phone has none), right (tally, play) */
		const pw = Math.round(P.w), ph = Math.round(P.h), X = (v) => v - Math.round(P.x);
		const piece = (name, x0, x1) => { x0 = Math.max(0, Math.floor(x0)); x1 = Math.min(pw, Math.ceil(x1)); execFileSync('convert', [`${tmp}-chrome.png`, '-crop', `${x1 - x0}x${ph}+${x0}+0`, '+repage', `${tmp}-${name}.png`]); return { x0, x1 }; };
		let L, C = null, Rt = null;
		/* a band is one layout: whether the tabs scroll (clipped) must not change between its narrowest and widest window */
		const fitSlack = m.narrow ? m.slack : m.tight ? m.barSlack : Infinity;
		if (!m.overflow && fitSlack < W - Wmin - 0.5) throw new Error(`the tabs fit at W ${W} but scroll at ${Wmin}: they fit down to ${(W - fitSlack).toFixed(1)}, split the band there`);
		const clipL = m.narrow || m.overflow; /* the bar's tabs are clipped by their scroller: the left piece runs to its edge (anchored right), play and tally anchored right */
		if (clipL) {
			L = piece('l', 0, X(m.scroll.r)); /* to the tabs' scroller's edge: it clips them where it ends (narrow phones), and that edge is anchored right */
			Rt = piece('r', X(m.play.x) - 2, pw);
		} else {
			L = piece('l', 0, X(m.left.r) + 2);
			C = piece('c', X(m.bar.x) - 2, X(m.bar.r) + 2);
			if (m.tally) Rt = piece('r', X(m.tally.x) - 2, pw);
		}
		/* the box the chapter bar is centred in, as insets from the panel's edges that hold at every W of the band: the panel's content box (1fr auto 1fr),
		   or, tight (< 1000), the grid's middle column (auto 1fr auto: the clock/envs and the tally keep their widths, the bar centres between them) */
		const cbox = () => m.tight ? { cl: +(m.padL + m.cols[0] + m.gap).toFixed(2), cr: +(m.padR + m.cols[2] + m.gap).toFixed(2) } : { cl: m.padL, cr: m.padR };
		const ov = [[L, C], [C, Rt], ...(clipL ? [] : [[L, Rt]])].filter(([a, c]) => a && c && a.x1 > c.x0);
		if (ov.length) throw new Error(`chrome pieces overlap at W ${W}: ${JSON.stringify(ov)}`);
		for (const n of ['w', 'm', 'l', 'c', 'r', 't']) if (existsSync(`${tmp}-${n}.png`)) webp(`${tmp}-${n}.png`, `${OUT}p-${W}-${n}-${theme}.webp`);
		for (const f of readdirSync(OUT).filter((f) => f.startsWith(`.cap-${W}-${theme}`))) rmSync(OUT + f);
		if (theme === 'light') bands.push({ w: W, from: Wmin, hb: Hc, phone: W < 600, px: Math.round(P.x), py: Math.round(P.y), pw_in: Math.round(m.host.w - P.r), ph,
			l: L.x1, ...cbox(), lclip: clipL ? +(m.panel.r - m.scroll.r).toFixed(2) : null, c: C ? { w: C.x1 - C.x0, dx: +((C.x0 + C.x1) / 2 - (cbox().cl + (pw - cbox().cr)) / 2).toFixed(2) } : null, r: Rt ? pw - Rt.x0 : 0, cw: CW, mx: +((mx / W) * 100).toFixed(4), my: +((my / W) * 100).toFixed(4), fw: +((footW / W) * 100).toFixed(4), cy });
		console.log(theme, `W ${W} (vw ${vw}) window shot ${W}x${Hc}`, `panel ${pw}x${ph}`, `l ${L.x1}`, C ? `c ${C.x0}-${C.x1}` : '', Rt ? `r ${Rt.x0}-${pw}` : '', `foot ${footW}x${footH}`, `main at ${mx},${my}`, `cy ${JSON.stringify(cy)}`);
		break;
	} catch (e) { console.log('retry', theme, W, String(e).slice(0, 160)); if (attempt >= 2) throw e; }
}
await b.close();
if (ONLY) { console.log('ONLY set: data/island_poster.yaml not written'); process.exit(0); }
/* stale posters of the old one-bitmap-per-media-band scheme go */
const keep = new Set(bands.flatMap((x) => ['w', 'm', 'l', 'c', 'r', 't'].flatMap((n) => ['light', 'dark'].map((t) => `p-${x.w}-${n}-${t}.webp`))));
for (const f of readdirSync(OUT).filter((f) => /^p-.*\.webp$/.test(f) && !keep.has(f))) rmSync(OUT + f);
/* the posters' ?v is their content hash, in the data file (a data change re-renders the page on the Hugo server too) */
const h = createHash('sha256'); for (const f of readdirSync(OUT).filter((f) => /^p-.*\.webp$/.test(f)).sort()) h.update(readFileSync(OUT + f));
const top = Math.max(...bands.map((x) => -x.py));
writeFileSync(new URL('../../data/island_poster.yaml', import.meta.url).pathname,
	`# written by islands/scripts/capture-posters.mjs: the hero poster's layers (layouts/_shortcodes/island.html). v = the posters' content hash (their ?v);\n` +
	`# top = how far the chapter bar starts above the window; panel = the bar's computed paint per theme; bands ascending by w (the window width shot), each\n` +
	`# serving windows wider than the previous band's w: hb = the shot window's height, p* = the panel box, l/c/r = the pieces, cw = the canvas width,\n# mx/my = the main column's left/top in % of W, fw = the foot's width in % of W, cy = [from W, the first frame's camera y in canvas px] runs\n` +
	JSON.stringify({ v: h.digest('hex').slice(0, 12), top, panel, bands }, null, 1) + '\n');
console.log('wrote', bands.length, 'bands');
