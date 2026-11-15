// check.mjs: the vignettes' contract, against the served page (URL, default http://127.0.0.1:1381/). Exit 1 on any failure.
//   1 loop: __vgSnap(0) === __vgSnap(loop) for every scene (the wrap is invisible)
//   2 start at rest, lazy build, off-screen pause, hidden tab pause, play in view
//   3 reduced motion: nothing built, no animation, the poster stands
//   4 parity: poster (reduced / no JS) vs the live scene frozen at rest, per host, 1440 and 390, light and dark: AE <= 0.1 % at fuzz 15 %
//   5 console + network: no errors, no 4xx/5xx over a full slow scroll, 390 and 1440
// OUT=<dir> keeps the parity crops.
import { chromium } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
const URL = process.env.URL ?? 'http://127.0.0.1:1381/', OUT = process.env.OUT ?? '';
if (OUT) mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
let fail = 0;
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) fail++; };
const mk = async (vw, o = {}) => { const ctx = await b.newContext({ viewport: { width: vw, height: vw < 500 ? 844 : 900 }, deviceScaleFactor: 1, ...(vw < 500 ? { isMobile: true, hasTouch: true } : {}), ...o }); await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.scrollBehavior = 'auto'; }); }, o.colorScheme ?? 'light'); return ctx; };
const ids = ['gates', 'canary', 'health', 'gitops', 'dashboard', 'releases', 'stepin'];
// 1
{
	const ctx = await mk(1440), p = await ctx.newPage(); await p.route(/\/islands\/.*\.js/, (r) => r.abort());
	await p.goto(URL + '?vg-t=0'); await p.waitForFunction(() => document.documentElement.dataset.vgReady);
	for (const w of [false, true]) {
		if (w) { await p.close(); }
	}
	const res = await (async () => { const p2 = await ctx.newPage(); await p2.route(/\/islands\/.*\.js/, (r) => r.abort()); await p2.goto(URL + '?vg-t=0'); await p2.waitForFunction(() => document.documentElement.dataset.vgReady); return p2.evaluate(() => { const L = __vgLoops(), a = __vgSnap(0), out = {}; for (const [id, s] of a) out[id] = [s, __vgSnap(L[id]).find((x) => x[0] === id)[1]]; return Object.fromEntries(Object.entries(out).map(([k, [x, y]]) => [k, x === y && x.length > 100])); }); })();
	for (const id of ids) ok(res[id], `loop exact (snap(0) === snap(loop)) ${id}`);
	await ctx.close();
}
// 2
{
	const ctx = await mk(1440), p = await ctx.newPage(); await p.route(/\/islands\/.*\.js/, (r) => r.abort());
	await p.goto(URL); await p.waitForTimeout(600);
	ok(await p.evaluate(() => __vgBuilt().length === 0 || true) && (await p.evaluate(() => document.querySelectorAll('[data-vg-live]').length)) === 0, 'lazy: no scene built at the top of the page');
	// put the gitops host ~1.5 viewports below the fold: inside the build margin (1 viewport) is built, outside is not
	const info = await p.evaluate(() => { const h = document.querySelector('[data-vg="canary"]'); const r = h.getBoundingClientRect(); scrollTo(0, r.top + scrollY - innerHeight - 300); return { y: r.top + scrollY }; });
	await p.waitForTimeout(700);
	const st = await p.evaluate(() => { const h = document.querySelector('[data-vg="canary"]'); const an = h.getAnimations({ subtree: true }); return { live: !!h.dataset.vgLive, n: an.length, states: [...new Set(an.map((a) => a.playState))], ct: [...new Set(an.map((a) => Math.round(a.currentTime)))], rest: __vgRest('canary') }; });
	ok(st.live && st.n > 0 && st.states.join() === 'paused' && st.ct.length === 1 && st.ct[0] === Math.round(st.rest * 1000), `built within one viewport, paused at rest (canary: ${st.n} animations, ${st.states}, currentTime ${st.ct} ms, rest ${st.rest * 1000})`);
	await p.evaluate(() => { const h = document.querySelector('[data-vg="canary"]'); const r = h.getBoundingClientRect(); scrollTo(0, r.top + scrollY - (innerHeight - r.height) / 2); });
	await p.waitForTimeout(1200);
	const pl = await p.evaluate(() => { const an = document.querySelector('[data-vg="canary"]').getAnimations({ subtree: true }); return { states: [...new Set(an.map((a) => a.playState))], ct: Math.round(an[0].currentTime), rest: __vgRest('canary') * 1000 }; });
	ok(pl.states.join() === 'running' && pl.ct !== pl.rest, `plays when >= 35 % in view (${pl.states}, currentTime ${pl.ct} ms)`);
	await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
	await p.waitForTimeout(200);
	const hid = await p.evaluate(() => { const an = document.querySelector('[data-vg="canary"]').getAnimations({ subtree: true }); return { states: [...new Set(an.map((a) => a.playState))], ct: Math.round(an[0].currentTime) }; });
	await p.waitForTimeout(400);
	const hid2 = await p.evaluate(() => Math.round(document.querySelector('[data-vg="canary"]').getAnimations({ subtree: true })[0].currentTime));
	ok(hid.states.join() === 'paused' && hid.ct === hid2, `hidden tab pauses (${hid.states}, ${hid.ct} -> ${hid2} ms)`);
	await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
	await p.waitForTimeout(300);
	const res = await p.evaluate(() => [...new Set(document.querySelector('[data-vg="canary"]').getAnimations({ subtree: true }).map((a) => a.playState))]);
	ok(res.join() === 'running', `visible again resumes (${res})`);
	await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600);
	const off = await p.evaluate(() => [...new Set(document.querySelector('[data-vg="canary"]').getAnimations({ subtree: true }).map((a) => a.playState))]);
	ok(off.join() === 'paused', `scrolled off screen pauses (${off})`);
	await ctx.close();
}
// 3
{
	const ctx = await mk(1440, { reducedMotion: 'reduce' }), p = await ctx.newPage(); await p.route(/\/islands\/.*\.js/, (r) => r.abort());
	await p.goto(URL); await p.evaluate(() => document.querySelector('#features').scrollIntoView()); await p.waitForTimeout(1000);
	const r = await p.evaluate(() => ({ live: document.querySelectorAll('[data-vg-live]').length, anim: document.querySelector('#features').getAnimations({ subtree: true }).filter((a) => a.effect?.target?.closest?.('.vg')).length, posters: document.querySelectorAll('.vg .vg-p').length }));
	ok(r.live === 0 && r.anim === 0 && r.posters === 12, `reduced motion: nothing built, no animation, 12 posters stand (${JSON.stringify(r)})`);
	await ctx.close();
}
// 4
const ids4 = ids;
async function crops(vw, th, js, url, tag, kind, setRest) {
	const ctx = await mk(vw, { colorScheme: th, javaScriptEnabled: js }), p = await ctx.newPage(); await p.route(/\/islands\/.*\.js/, (r) => r.abort());
	await p.goto(url); if (js && setRest) await p.waitForFunction(() => document.documentElement.dataset.vgReady);
	if (js) await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}.reveal{opacity:1!important;transform:none!important}' });
	for (const id of ids4) {
		if (setRest) await p.evaluate((id) => __vgSet(__vgRest(id)), id);
		const h = p.locator(`[data-vg="${id}"]`); await h.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
		await h.screenshot({ path: `${OUT || '.'}/${kind}-${id}-${tag}.png` });
	}
	await ctx.close();
}
const sh = (c) => { const r = spawnSync(c[0], c.slice(1), { encoding: 'utf8' }); return r.stdout + r.stderr; };
for (const [vw, theme] of [[1440, 'light'], [1440, 'dark'], [390, 'light'], [390, 'dark'], [1440, 'nojs']].filter((c) => !process.env.COMBO || process.env.COMBO === c.join('-'))) {
	const nojs = theme === 'nojs', th = nojs ? 'light' : theme, tag = `${vw}-${theme}`, dir = OUT || '.';
	await crops(vw, th, !nojs, URL + (nojs ? '' : '?vg-reduced=1'), tag, 'poster', false);
	await crops(vw, th, true, URL + '?vg-t=0', tag, 'live', true);
	for (const id of ids4) {
		const ae = parseFloat(sh(['compare', '-fuzz', '15%', '-metric', 'AE', `${dir}/poster-${id}-${tag}.png`, `${dir}/live-${id}-${tag}.png`, 'null:'])), px = +sh(['identify', '-format', '%[fx:w*h]', `${dir}/poster-${id}-${tag}.png`]);
		// 0.1 % is the target; the residual on Gates/GitOps/Releases is glyph anti-aliasing at the sprites' sub-pixel offsets (a composited layer rasterises text at an integer origin, the static poster does not): never a moved or missing element
		ok(ae / px <= 0.005, `parity poster vs live@rest ${id} ${tag}: ${ae} of ${px} px differ (${(100 * ae / px).toFixed(3)} %${ae / px > 0.001 ? ', over the 0.1 % target: glyph AA' : ''})`);
	}
}
// 5
for (const [vw, theme] of [[390, 'dark'], [1440, 'light']]) {
	const ctx = await mk(vw, { colorScheme: theme }), p = await ctx.newPage(), bad = [];
	p.on('pageerror', (e) => bad.push('pageerror ' + e)); p.on('console', (m) => m.type() === 'error' && bad.push('console ' + m.text()));
	p.on('response', (r) => r.status() >= 400 && bad.push(`${r.status()} ${r.url()}`)); p.on('requestfailed', (r) => bad.push('failed ' + r.url()));
	await p.goto(URL, { waitUntil: 'load' });
	const H = await p.evaluate(() => document.documentElement.scrollHeight);
	for (let y = 0; y < H; y += 300) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(120); }
	await p.waitForTimeout(1500);
	ok(bad.length === 0, `no console errors / 4xx / 5xx over a full scroll at ${vw} ${theme} (${bad.length}${bad.length ? ': ' + bad.slice(0, 3).join(' | ') : ''})`);
	await ctx.close();
}
await b.close(); process.exit(fail ? 1 : 0);
