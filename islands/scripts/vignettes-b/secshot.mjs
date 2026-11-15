// secshot.mjs: full-section screenshots (#features, #step-in) at a width and theme, reduced motion (posters) or live.
// usage: URL=... OUT=dir node secshot.mjs <vw> <light|dark> [live]
import { chromium } from '@playwright/test';
import fs from 'fs';
const [vw, th, live] = process.argv.slice(2);
const URL = process.env.URL ?? 'http://127.0.0.1:1391/', OUT = process.env.OUT; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +vw, height: +vw < 640 ? 844 : 1440 }, colorScheme: th, reducedMotion: live ? 'no-preference' : 'reduce' });
await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} }, th);
const p = await ctx.newPage(); await p.goto(URL, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 500) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(40); } await p.waitForTimeout(800);
for (const id of ['features', 'step-in', 'spec']) { const s = p.locator('#' + id); if (await s.count()) await s.screenshot({ path: `${OUT}/${id}-${vw}-${th}.png` }); }
await b.close();
