// product-shot.mjs <url> <vw> <theme> <selector> <out.png>: the running dashboard (hub or mock), one element at 1x (evidence beside a section island)
import { chromium } from '@playwright/test';
const [url, vw, theme, sel, out] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +vw, height: 1000 }, deviceScaleFactor: 1, colorScheme: theme, ignoreHTTPSErrors: true, ...(+vw < 500 ? { isMobile: true, hasTouch: true } : {}) });
await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); localStorage.setItem('theme', t); } catch {} }, theme);
const p = await ctx.newPage();
await p.goto(url, { waitUntil: 'domcontentloaded' });
await p.evaluate((t) => document.documentElement.classList.toggle('dark', t === 'dark'), theme);
const el = p.locator(sel).first();
await el.waitFor({ timeout: 30000 });
await p.waitForTimeout(2500);
await p.evaluate((t) => document.documentElement.classList.toggle('dark', t === 'dark'), theme);
await el.scrollIntoViewIfNeeded();
await p.waitForTimeout(500);
await el.screenshot({ path: out });
await b.close();
