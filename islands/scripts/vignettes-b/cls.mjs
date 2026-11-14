// cls.mjs [vw=1440] [theme=light]: cumulative layout shift over (a) a full slow scroll of the page with the vignettes live and
// (b) a reload while scrolled to #features. Budget 0.01 each. Islands blocked (the hero film is not under test): ISLANDS=1 keeps them.
import { chromium } from '@playwright/test';
const [vw = '1440', theme = 'light'] = process.argv.slice(2), URL = process.env.URL ?? 'http://127.0.0.1:1381/';
const b = await chromium.launch(); let fail = 0;
const mk = async () => { const ctx = await b.newContext({ viewport: { width: +vw, height: +vw < 500 ? 844 : 900 }, colorScheme: theme, ...(+vw < 500 ? { isMobile: true, hasTouch: true } : {}) });
	await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} window.__s = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__s.push({ v: e.value, t: Math.round(e.startTime), src: (e.sources ?? []).map((s) => `${s.node?.nodeName}.${(s.node?.className?.baseVal ?? s.node?.className ?? '').toString().slice(0, 30)} y${Math.round(s.previousRect.y)}->${Math.round(s.currentRect.y)}`) }); }).observe({ type: 'layout-shift', buffered: true }); document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.scrollBehavior = 'auto'; }); }, theme);
	if (!process.env.ISLANDS) await ctx.route(/\/islands\/.*\.js(\?.*)?$/, (r) => r.abort());
	return ctx; };
const report = async (p, name) => { const s = await p.evaluate(() => window.__s), cls = s.reduce((a, x) => a + x.v, 0), ok = cls <= 0.01; if (!ok) fail++; console.log(`${ok ? 'PASS' : 'FAIL'} cls ${vw} ${theme} ${name}: ${cls.toFixed(4)} (${s.length} shifts)`); for (const x of s) console.log(`   ${x.v.toFixed(4)} @${x.t}ms ${x.src.join(' | ')}`); };
{ const ctx = await mk(), p = await ctx.newPage(); await p.goto(URL, { waitUntil: 'load' }); const H = await p.evaluate(() => document.documentElement.scrollHeight);
	for (let y = 0; y < H; y += 120) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(90); }
	await p.waitForTimeout(1500); await report(p, 'full slow scroll'); await ctx.close(); }
{ const ctx = await mk(), p = await ctx.newPage(); await p.goto(URL + '#features', { waitUntil: 'load' }); await p.evaluate(() => { const f = document.getElementById('features'); scrollTo(0, f.getBoundingClientRect().top + scrollY + 200); }); await p.waitForTimeout(800);
	await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(2500); await report(p, 'reload at #features'); await ctx.close(); }
await b.close(); process.exit(fail ? 1 : 0);
