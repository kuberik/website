// cost.mjs: main-thread cost of the vignettes, against the budget (exit 1 over it). Served page: URL (default http://127.0.0.1:1381/).
//   The section islands and the hero film are blocked (posters stay) so only the vignettes' work is measured; ISLANDS=1 keeps them.
//   cost.mjs bento [vw=1440] [cpu=4] [secs=8] [theme=light] [budget=60]  (+ the whole section in view: cost.mjs section ...)
//       THE BUDGET CASE, as a visitor sees the page: viewport vw x 900 (844 under 500 px), each vignette in turn scrolled to the
//       centre of the viewport; the player plays only it (the rest show rest). Its main-thread work per second, CPU throttled cpu x,
//       minus the same scroll position with every vignette frozen (?vg-t). FAIL if any position is over `budget` ms/s.
import { chromium } from '@playwright/test';
import { loadavg } from 'node:os';
const load = () => `load ${loadavg()[0].toFixed(1)}`; // the host's 1-min load average, printed beside every number
const [mode = 'all', ...a] = process.argv.slice(2);
const URL = process.env.URL ?? 'http://127.0.0.1:1381/';
const b = await chromium.launch();
let fail = 0;
async function page(theme, frozen, vh = 900, q = '', vw = 1440) {
	const ctx = await b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1, colorScheme: theme, ...(vw < 500 ? { isMobile: true, hasTouch: true } : {}) });
	await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} }, theme);
	// checks scroll instantly: the page's smooth scrolling would make every scrollTo a glide of unknown length on a loaded host
	await ctx.addInitScript(() => document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.scrollBehavior = 'auto'; }));
	// isolate the vignettes: the section islands and the hero film never load (their posters stay), so the trace holds only the
	// vignettes' work and the page's static cost (ISLANDS=1 keeps them)
	if (!process.env.ISLANDS) await ctx.route(/\/islands\/.*\.js(\?.*)?$/, (r) => r.abort());
	const p = await ctx.newPage(), s = await ctx.newCDPSession(p);
	await p.goto(URL + (frozen ? '?vg-t=0' : '?x=1') + q + (process.env.VGQ ?? ''), { waitUntil: 'load' }); // VGQ: extra player params, e.g. &vg-fps=30
	if (process.env.CSS) await p.addStyleTag({ content: process.env.CSS }); // experiments: extra page CSS
	return { ctx, p, s };
}
async function trace(s, ms) {
	const ev = []; const on = (d) => ev.push(...d.value); s.on('Tracing.dataCollected', on);
	await s.send('Tracing.start', { categories: 'toplevel,devtools.timeline,disabled-by-default-devtools.timeline.frame', transferMode: 'ReportEvents' });
	await new Promise((r) => setTimeout(r, ms));
	const done = new Promise((r) => s.once('Tracing.tracingComplete', r)); await s.send('Tracing.end'); await done; s.off('Tracing.dataCollected', on);
	const main = ev.find((e) => e.name === 'thread_name' && e.args?.name === 'CrRendererMain');
	const m = ev.filter((e) => e.ph === 'X' && e.pid === main?.pid && e.tid === main?.tid), per = (re) => m.filter((e) => re.test(e.name)).reduce((x, e) => x + (e.dur || 0), 0) / 1000 / (ms / 1000);
	if (process.env.DETAIL) { const by = {}; for (const e of m) by[e.name] = (by[e.name] || 0) + (e.dur || 0) / 1000 / (ms / 1000); console.log('  detail ' + Object.entries(by).sort((x, y) => y[1] - x[1]).slice(0, 14).map(([k, v]) => `${k} ${v.toFixed(1)}`).join(' · ')); }
	return { task: per(/RunTask$/), script: per(/^(FireAnimationFrame|FunctionCall|TimerFire)$/), style: per(/^UpdateLayoutTree$/), layout: per(/^Layout$/), paint: per(/^(Paint|PrePaint|Layerize)$/) };
}
const fmt = (r) => `all tasks ${r.task.toFixed(1)} ms/s (script ${r.script.toFixed(1)} · style ${r.style.toFixed(1)} · layout ${r.layout.toFixed(1)} · paint ${r.paint.toFixed(1)})`;

const [vw = '1440', cpu = '4', secs = '8', theme = 'light', budget = '60'] = a, vh = +vw < 500 ? 844 : 900;
const ids = ['gates', 'canary', 'health', 'gitops', 'dashboard', 'releases'].filter((i) => !process.env.IDS || process.env.IDS.split(',').includes(i));
const targets = mode === 'section' ? ['#features'] : ids;
let worst = 0;
for (const id of targets) {
	const res = {};
	for (const frozen of [false, true]) {
		const { ctx, p, s } = await page(theme, frozen, mode === 'section' ? 2600 : vh, '', +vw);
		await p.evaluate((id) => { const e = document.querySelector(id[0] === '#' ? id : `[data-vg="${id}"]`), r = e.getBoundingClientRect(); scrollTo(0, r.top + scrollY - Math.max(0, (innerHeight - r.height) / 2)); }, id);
		await p.waitForTimeout(frozen ? 1500 : 2500); // the live page builds the scenes within a viewport and plays those >= 35 % in view
		await s.send('Emulation.setCPUThrottlingRate', { rate: +cpu }); await p.waitForTimeout(500);
		res[frozen ? 'rest' : 'live'] = await trace(s, +secs * 1000);
		if (!frozen) res.playing = await p.evaluate(() => [...document.querySelectorAll('[data-vg]')].filter((h) => h.getAnimations({ subtree: true }).some((a) => a.playState === 'running')).map((h) => h.dataset.vg).join(' ') || 'none');
		await ctx.close();
	}
	const d = res.live.task - res.rest.task, ok = d <= +budget; worst = Math.max(worst, d);
	console.log(`${ok ? 'PASS' : 'FAIL'} cost ${mode} ${vw} ${theme} cpu x${cpu} ${secs}s, ${id}: +${d.toFixed(1)} ms/s main thread (budget ${budget}; ${load()}); playing: ${res.playing}`);
	console.log(`  live:   ${fmt(res.live)}`);
	console.log(`  frozen: ${fmt(res.rest)}`);
	if (!ok) fail++;
}
console.log(`${fail ? 'FAIL' : 'PASS'} cost ${mode} ${vw} ${theme}: worst +${worst.toFixed(1)} ms/s (budget ${budget}; ${load()})`);
await b.close(); process.exit(fail ? 1 : 0);
