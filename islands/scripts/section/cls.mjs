// cls.mjs <vw> <vh> <theme> [name]: layout shift over a reader's visit: load, the hero's first frame, a slow scroll down past the section island
// (it goes live on the way), then back up. Prints total CLS, every shift with its sources, and the host's document box before JS ran vs after it is live.
import { chromium } from '@playwright/test';
const [vw = '1440', vh = '900', theme = 'light', name = 'gates-card'] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +vw, height: +vh }, deviceScaleFactor: 1, colorScheme: theme, ...(+vw < 500 ? { isMobile: true, hasTouch: true } : {}), reducedMotion: process.env.REDUCED ? 'reduce' : 'no-preference' });
await ctx.addInitScript(([t, name]) => {
	try { localStorage.setItem('color-theme', t); } catch {}
	window.__shifts = [];
	new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__shifts.push({ v: e.value, t: Math.round(e.startTime), src: (e.sources ?? []).map((s) => (s.node?.nodeName ?? '?') + '.' + (s.node?.className?.toString?.().slice(0, 40) ?? '') + ` ${Math.round(s.previousRect.y)}->${Math.round(s.currentRect.y)} h${Math.round(s.previousRect.height)}->${Math.round(s.currentRect.height)}`) }); }).observe({ type: 'layout-shift', buffered: true });
	document.addEventListener('DOMContentLoaded', () => { const h = document.querySelector(`[data-island="${name}"]`); if (h) { const r = h.getBoundingClientRect(); window.__box0 = [r.x, r.y + scrollY, r.width, r.height].map(Math.round); } });
}, [theme, name]);
const p = await ctx.newPage();
await p.goto(process.env.URL ?? 'http://192.168.1.102:1340/', { waitUntil: 'load' });
await p.waitForFunction(() => document.querySelector('[data-island="hero"]')?.hasAttribute('data-island-ready'), null, { timeout: 30000 }).catch(() => console.log('hero not ready in 30 s'));
const target = await p.evaluate((n) => { const r = document.querySelector(`[data-island="${n}"]`).getBoundingClientRect(); return r.y + scrollY; }, name);
for (let y = 0; y < target + 600; y += 240) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(160); }
await p.waitForFunction((n) => document.querySelector(`[data-island="${n}"]`)?.__section?.stills > 0, name, { timeout: 30000 }).catch(() => console.log('section not live'));
await p.waitForTimeout(1200);
for (let y = target + 600; y >= 0; y -= 480) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(120); }
const r = await p.evaluate((n) => { const h = document.querySelector(`[data-island="${n}"]`); const b = h.getBoundingClientRect(); return { shifts: window.__shifts, box0: window.__box0, box1: [b.x, b.y + scrollY, b.width, b.height].map(Math.round), live: h.__section?.stills }; }, name);
const cls = r.shifts.reduce((a, s) => a + s.v, 0);
console.log(`cls ${vw} ${theme}${process.env.REDUCED ? ' reduced' : ''}: ${cls.toFixed(4)} (${r.shifts.length} shifts) host before JS ${JSON.stringify(r.box0)} live ${JSON.stringify(r.box1)} stills=${r.live}`);
for (const s of r.shifts) console.log(`  ${s.v.toFixed(4)} @${s.t}ms ${s.src.join(' | ')}`);
await b.close();
