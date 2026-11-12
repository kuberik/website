// node cls.mjs <w> <h> [top] [theme] : one natural loop from t=0, observer reset after scroll, max 5 s session window; "top" = no scroll (hero at its natural place)
import { chromium } from '@playwright/test';
const [w, h, pos = 'hero', theme = 'light'] = process.argv.slice(2); const mob = +w < 600;
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: +w, height: +h }, colorScheme: theme, ...(mob ? { isMobile: true, hasTouch: true } : {}) });
await ctx.route(/livereload/, (r) => r.abort()); if (process.env.NOSNAP) await ctx.addInitScript((v) => { globalThis.__kfNoSnap = v.split(','); }, process.env.NOSNAP);
const p = await ctx.newPage(); await p.goto(process.env.URL ?? 'http://127.0.0.1:1313/', { waitUntil: 'load' });
if (process.env.CPU) { const c = await ctx.newCDPSession(p); await c.send('Emulation.setCPUThrottlingRate', { rate: +process.env.CPU }); }
await p.waitForFunction(() => document.querySelector('[data-island="hero"]')?.shadowRoot?.querySelector('.film-canvas'), null, { timeout: 20000 });
if (pos === 'hero') await p.evaluate(() => { const r = document.getElementById('hero-window').getBoundingClientRect(); scrollTo(0, scrollY + r.top - 140); }); await p.waitForTimeout(2500);
await p.evaluate(() => { window.__q = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__q.push({ t: e.startTime, v: e.value, in: e.hadRecentInput, st: +document.querySelector('[data-island="hero"]').__story.player.time.toFixed(2), src: e.sources.map((s) => { const n = s.node; return n ? (n.nodeType === 1 ? n.tagName + '.' + String(n.className?.baseVal ?? n.className).slice(0, 40) : '#text') : 'null'; }).slice(0, 2).join('|') }); }).observe({ type: 'layout-shift' }); document.querySelector('[data-island="hero"]').__story.player.seek(0); });
await p.waitForTimeout(Number(process.env.SECS ?? 49) * 1000);
const q = await p.evaluate(() => window.__q); await b.close();
const obs = q.filter((e) => !e.in); let best = 0, cur = 0, ws = 0, last = -1e9;
for (const e of obs) { if (e.t - last > 1000 || e.t - ws > 5000) { cur = 0; ws = e.t; } cur += e.v; last = e.t; if (cur > best) { best = cur; globalThis.bs = ws; globalThis.be = e.st; } }
console.log('bestWindow story', globalThis.be); console.log(`${w} ${pos} ${theme}: n=${obs.length} sum=${obs.reduce((s, e) => s + e.v, 0).toFixed(3)} maxWindow=${best.toFixed(3)}`);
for (const e of [...obs].sort((a, c) => c.v - a.v).slice(0, 40)) console.log('  ', e.st, e.v.toFixed(4), e.src);
