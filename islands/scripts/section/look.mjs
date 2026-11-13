// look.mjs <name> <vw> <theme> <out.png> : scrolls to a section island, waits for its live still, prints its state, screenshots the host (1x)
import { chromium } from '/home/luka/projects/kuberik/rollout-dashboard/frontend/node_modules/@playwright/test/index.mjs';
const [name = 'gates-card', vw = '1440', theme = 'light', out] = process.argv.slice(2);
const URL_ = process.env.URL ?? 'http://192.168.1.102:1340/';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +vw, height: 900 }, deviceScaleFactor: 1, colorScheme: theme, ...(+vw < 500 ? { isMobile: true, hasTouch: true } : {}), reducedMotion: process.env.REDUCED ? 'reduce' : 'no-preference' });
await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} }, theme);
const p = await ctx.newPage();
const errs = []; p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text().slice(0, 200)); }); p.on('pageerror', (e) => errs.push('PAGEERROR ' + String(e).slice(0, 300)));
await p.goto(URL_, { waitUntil: 'load' });
await p.evaluate((n) => document.querySelector(`[data-island="${n}"]`).scrollIntoView({ block: 'center' }), name);
await p.waitForFunction((n) => document.querySelector(`[data-island="${n}"]`)?.__section?.stills > 0 && !document.querySelector(`[data-island="${n}"] .ph-poster`), name, { timeout: 30000 }).catch((e) => console.log('wait failed', String(e).slice(0, 100)));
await p.waitForTimeout(400);
const st = await p.evaluate((n) => { const h = document.querySelector(`[data-island="${n}"]`); const s = h.__section; const r = h.getBoundingClientRect(); return { host: [Math.round(r.width), Math.round(r.height)], canvas: s?.canvas, boxes: s?.boxes?.map((b) => b && [b.x, b.y, b.width, b.height].map(Math.round)) }; }, name);
console.log(JSON.stringify(st)); for (const e of errs.slice(0, 8)) console.log('console:', e);
if (out) await p.locator(`[data-island="${name}"]`).screenshot({ path: out });
if (process.env.FULL) await p.locator(`[data-island="${name}"]`).evaluate((h) => { const c = h.shadowRoot.querySelector('.sec-still'); c.style.transform = 'none'; h.style.contain = 'none'; h.style.height = c.scrollHeight + 'px'; h.shadowRoot.querySelector('.sec-frame').style.overflow = 'visible'; });
if (process.env.FULL) await p.locator(`[data-island="${name}"]`).screenshot({ path: process.env.FULL });
await b.close();
