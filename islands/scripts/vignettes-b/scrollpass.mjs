// scrollpass.mjs [vw=1440] [theme=light] [cpu=4] [secs=16]: whole-page scroll pass. The page is scrolled top to bottom at an even pace
// over `secs` while the main thread is traced (CPU throttled cpu x); prints main-thread ms per second, with the load average.
import { chromium } from '@playwright/test';
import { loadavg } from 'node:os';
const [vw = '1440', theme = 'light', cpu = '4', secs = '16'] = process.argv.slice(2), URL = process.env.URL ?? 'http://127.0.0.1:1376/';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +vw, height: +vw < 500 ? 844 : 900 }, colorScheme: theme, deviceScaleFactor: 1, ...(+vw < 500 ? { isMobile: true, hasTouch: true } : {}) });
await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} }, theme);
await ctx.route(/\/islands\/.*\.js(\?.*)?$/, (r) => r.abort());
const p = await ctx.newPage(), s = await ctx.newCDPSession(p);
await p.goto(URL + '?x=1', { waitUntil: 'load' }); await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; }); await p.waitForTimeout(1000);
await s.send('Emulation.setCPUThrottlingRate', { rate: +cpu });
const ev = []; s.on('Tracing.dataCollected', (d) => ev.push(...d.value));
await s.send('Tracing.start', { categories: 'toplevel,devtools.timeline', transferMode: 'ReportEvents' });
const t0 = Date.now(), H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
while (Date.now() - t0 < +secs * 1000) { const f = (Date.now() - t0) / (+secs * 1000); await p.evaluate((y) => scrollTo(0, y), H * f); await p.waitForTimeout(50); }
const ms = Date.now() - t0, done = new Promise((r) => s.once('Tracing.tracingComplete', r)); await s.send('Tracing.end'); await done;
const main = ev.find((e) => e.name === 'thread_name' && e.args?.name === 'CrRendererMain'), m = ev.filter((e) => e.ph === 'X' && e.pid === main?.pid && e.tid === main?.tid);
const per = (re) => (m.filter((e) => re.test(e.name)).reduce((x, e) => x + (e.dur || 0), 0) / 1000 / (ms / 1000)).toFixed(1);
console.log(`scrollpass ${vw} ${theme} cpu x${cpu} ${secs}s ${URL}: all tasks ${per(/RunTask$/)} ms/s (style ${per(/^UpdateLayoutTree$/)} · layout ${per(/^Layout$/)} · paint ${per(/^(Paint|PrePaint|Layerize)$/)}); load ${loadavg()[0].toFixed(1)}`);
await b.close();
