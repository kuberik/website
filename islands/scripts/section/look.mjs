// look.mjs <name> <vw> <theme> <out.png> (W=<host px> NATURAL=1 CARD=1 FULL=<png> REDUCED=1): scrolls to a section island, waits for its live still, prints its state, screenshots the host (1x)
import { chromium } from '@playwright/test';
const [name = 'gates-card', vw = '1440', theme = 'light', out] = process.argv.slice(2);
const URL_ = process.env.URL ?? 'http://192.168.1.102:1340/';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +vw, height: 900 }, deviceScaleFactor: 1, colorScheme: theme, ...(+vw < 500 ? { isMobile: true, hasTouch: true } : {}), reducedMotion: process.env.REDUCED ? 'reduce' : 'no-preference' });
await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} }, theme);
const p = await ctx.newPage();
const errs = []; p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text().slice(0, 200)); }); p.on('pageerror', (e) => errs.push('PAGEERROR ' + String(e).slice(0, 300)));
await p.goto(URL_, { waitUntil: 'load' });
/* W=<px>: the host laid out at this width (a product layout width from the page's grid table), whatever the page's grid gives it today */
if (process.env.W) await p.evaluate(([n, w]) => { const h = document.querySelector(`[data-island="${n}"]`); const bay = document.createElement('div'); bay.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483000;padding:24px;background:var(--page,#fff)'; document.body.appendChild(bay); bay.appendChild(h); h.style.width = w + 'px'; h.style.maxWidth = 'none'; h.style.flex = 'none'; }, [name, +process.env.W]); /* on its own bay over the page: a host wider than today's grid column would paint under the next card */
await p.evaluate((n) => document.querySelector(`[data-island="${n}"]`).scrollIntoView({ block: 'center' }), name);
await p.waitForFunction((n) => document.querySelector(`[data-island="${n}"]`)?.__section?.stills > 0 && !document.querySelector(`[data-island="${n}"] .ph-poster`), name, { timeout: 30000 }).catch((e) => console.log('wait failed', String(e).slice(0, 100)));
await p.waitForTimeout(400);
const st = await p.evaluate((n) => { const h = document.querySelector(`[data-island="${n}"]`); const s = h.__section; const r = h.getBoundingClientRect(); return { host: [Math.round(r.width), Math.round(r.height)], canvas: s?.canvas, boxes: s?.boxes?.map((b) => b && [b.x, b.y, b.width, b.height].map(Math.round)) }; }, name);
console.log(JSON.stringify(st)); for (const e of errs.slice(0, 8)) console.log('console:', e);
/* NATURAL=1: the host takes the frame's own height first (the product's natural height at this width: what the page's CSS would reserve) */
if (process.env.NATURAL) { await p.evaluate((n) => { const h = document.querySelector(`[data-island="${n}"]`); const b = h.__section.boxes[Math.max(0, h.__section.shown)]; h.style.height = Math.round(b.height) + 'px'; }, name); await p.waitForTimeout(300); }
/* ALL=1: every still of a calm loop, <out>-<i>.png, each in the tallest still's box */
if (process.env.ALL && out) { await p.waitForFunction((n) => document.querySelector(`[data-island="${n}"]`).__section.done, name); const k = await p.evaluate((n) => { const h = document.querySelector(`[data-island="${n}"]`); h.style.height = Math.ceil(Math.max(...h.__section.boxes.map((b) => b.height))) + 'px'; return h.__section.count; }, name);
	for (let i = 0; i < k; i++) { await p.evaluate(([n, i]) => document.querySelector(`[data-island="${n}"]`).__section.show(i), [name, i]); await p.waitForTimeout(900); await p.locator(`[data-island="${name}"]`).screenshot({ path: out.replace(/\.png$/, `-${i}.png`) }); } }
if (out) await (process.env.CARD ? p.locator(`[data-island="${name}"]`).locator('xpath=ancestor::*[contains(@class,"fv-card")][1]') : p.locator(`[data-island="${name}"]`)).screenshot({ path: out }); /* CARD=1: the whole feature card */
if (process.env.FULL) await p.locator(`[data-island="${name}"]`).evaluate((h) => { const c = h.shadowRoot.querySelector('.sec-still'); c.style.transform = 'none'; h.style.contain = 'none'; h.style.height = c.scrollHeight + 'px'; h.shadowRoot.querySelector('.sec-frame').style.overflow = 'visible'; });
if (process.env.FULL) await p.locator(`[data-island="${name}"]`).screenshot({ path: process.env.FULL });
await b.close();
