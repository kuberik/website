// history-check.mjs <outdir> <vw> <theme> <runs>: fresh loads; the Dashboard card (Change page History) cropped once live and again ~10 s later,
// with its event count and whether "Released" and "Held" rows are present (the catalogue race fixed in 9d9d2cf left 3 events and an empty panel).
import { chromium } from '@playwright/test';
const [out, vw = '1440', theme = 'light', runs = '3'] = process.argv.slice(2);
const b = await chromium.launch();
for (let i = 1; i <= +runs; i++) {
	const ctx = await b.newContext({ viewport: { width: +vw, height: 900 }, deviceScaleFactor: 1, colorScheme: theme, ...(+vw < 500 ? { isMobile: true, hasTouch: true } : {}) });
	await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} }, theme);
	const p = await ctx.newPage();
	await p.goto(process.env.URL ?? 'http://192.168.1.102:1340/', { waitUntil: 'load' });
	await p.waitForFunction(() => document.querySelector('[data-island="hero"]')?.hasAttribute('data-island-ready'), null, { timeout: 30000 }).catch(() => console.log('hero not ready'));
	const h = p.locator('[data-island="dashboard-card"]');
	await h.scrollIntoViewIfNeeded();
	await p.waitForFunction(() => document.querySelector('[data-island="dashboard-card"]')?.__section?.stills > 0, null, { timeout: 30000 }).catch(() => console.log('not live'));
	const state = () => h.evaluate((e) => { const t = e.shadowRoot ? e.shadowRoot.textContent : e.textContent; const all = (e.shadowRoot?.textContent ?? '') + e.textContent; return { events: (all.match(/(\d+) events?/) ?? [])[1], released: /Released/.test(all), held: /Held in/.test(all), poster: !!e.querySelector('.ph-poster') }; });
	await p.waitForTimeout(600);
	await h.screenshot({ path: `${out}/history-${vw}-${theme}-run${i}-live.png` });
	const a = await state();
	await p.waitForTimeout(10000);
	await h.screenshot({ path: `${out}/history-${vw}-${theme}-run${i}-10s.png` });
	const c = await state();
	console.log(`run ${i} ${vw} ${theme}: live ${JSON.stringify(a)}  +10s ${JSON.stringify(c)}`);
	await ctx.close();
}
await b.close();
