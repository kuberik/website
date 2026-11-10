// Captures the static first frame (t=0, the chrome above the window included) of the running page for every window size and theme.
// usage: node scripts/capture-posters.mjs [url]   (needs playwright from a dashboard node_modules; converts with ImageMagick `convert` to webp)
import { chromium } from '/home/luka/projects/kuberik/rollout-dashboard/frontend/node_modules/@playwright/test/index.mjs';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
const PAGE = process.argv[2] ?? 'http://192.168.1.102:1330/';
const OUT = new URL('../../static/island-poster/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const SIZES = [[390, 350], [900, 696], [1100, 868], [1440, 1120], [1920, 1200], [2560, 1280]]; // [viewport, window width]
const b = await chromium.launch();
for (const theme of ['light', 'dark']) for (const [vw] of SIZES) for (let attempt = 0; attempt < 3; attempt++) try {
	const ctx = await b.newContext({ viewport: { width: vw, height: 1100 }, deviceScaleFactor: 1, colorScheme: theme, ...(vw < 500 ? { isMobile: true, hasTouch: true } : {}) });
	await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} }, theme);
	const p = await ctx.newPage();
	await p.goto(PAGE + '?capture=1', { waitUntil: 'load' });
	await p.waitForFunction(() => document.querySelector('[data-island="hero"]')?.shadowRoot?.querySelector('.film') && !document.querySelector('.ph-poster'), null, { timeout: 30000 });
	await p.evaluate(() => { const r = document.getElementById('hero-window').getBoundingClientRect(); scrollTo(0, scrollY + r.top - 160); });
	await p.waitForTimeout(300);
	await p.evaluate(() => document.querySelector('[data-island="hero"]').__story.at(0));
	await p.waitForTimeout(2500);
	const r = await p.evaluate(() => { const h = document.querySelector('[data-island="hero"]').getBoundingClientRect(); return { x: h.x, y: h.y, w: h.width, h: h.height, top: innerWidth < 640 ? 70 : 56 }; });
	const png = `${OUT}p-${vw}-${theme}.png`;
	await p.screenshot({ path: png, clip: { x: r.x, y: r.y - r.top, width: r.w, height: r.h + r.top } });
	execFileSync('convert', [png, '-quality', '72', '-define', 'webp:method=6', png.replace('.png', '.webp')]);
	execFileSync('rm', [png]);
	console.log(theme, vw, Math.round(r.w) + 'x' + Math.round(r.h + r.top));
	await ctx.close();
	break;
} catch (e) { console.log('retry', theme, vw, String(e).slice(0, 80)); }
await b.close();
