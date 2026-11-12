// scene lane 6 (owner item 16): frame pacing of every transition in REAL PLAY (no seeks inside the run).
// usage: node jitter.mjs <w> <h> <theme> <outdir> [from=story second to start at] [secs]
// Records, per animation frame (rAF, the page's own 60 Hz clock): frame time, story t, the camera transform, the group's opacity, the cover stills on screen
// and their opacity, the group's height. CDP screencast (every frame the compositor swaps) is kept for the transition windows; consecutive frames are
// diffed (mean abs difference on a 160 px downsample) so a pop (a still that does not match the live frame, a reflow, a snap) shows as a spike.
import { chromium } from '@playwright/test';
setTimeout(() => { console.log("TIMEOUT (host too slow)"); process.exit(3); }, 420000).unref();
import fs from 'fs';
const [w = '1440', h = '900', theme = 'light', out = 'jit', from = '', secs = ''] = process.argv.slice(2);
const phone = +w < 600;
fs.mkdirSync(out + '/frames', { recursive: true });
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, colorScheme: theme, ...(phone ? { isMobile: true, hasTouch: true } : {}) });
await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} }, theme);
const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
await p.goto((process.env.URL ?? 'http://127.0.0.1:1313/') + '?v=' + Date.now(), { waitUntil: 'load' });
await p.waitForFunction(() => document.querySelector('[data-island="hero"]')?.shadowRoot?.querySelector('.film-canvas'), null, { timeout: 20000 });
await p.evaluate(() => { const r = document.getElementById('hero-window').getBoundingClientRect(); scrollTo(0, scrollY + r.top - 150); });
await p.waitForTimeout(2500);
const LOOP = await p.evaluate(() => document.querySelector('[data-island="hero"]').__story.player.o.loop);
const start = from === '' ? LOOP - 1.6 : +from; /* player seconds: from just before the wrap, one whole loop */
const dur = secs === '' ? LOOP + 2.2 : +secs;
/* frame logger */
await p.evaluate(() => {
  const h = document.querySelector('[data-island="hero"]'), r = h.shadowRoot; window.__F = [];
  const loaf = []; window.__LOAF = loaf;
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) loaf.push({ at: performance.timeOrigin + e.startTime, dur: e.duration, block: e.blockingDuration, src: (e.scripts ?? []).map((s) => (s.sourceFunctionName || '') + '@' + (s.sourceURL || '').split('/').pop() + ':' + Math.round(s.duration)).slice(0, 3).join(' ') }); }).observe({ type: 'long-animation-frame', buffered: false }); } catch {}
  const cam = r.querySelector('.film-cam'), g = r.querySelector('.film-group');
  const tick = (ts) => {
    const snaps = [...r.querySelectorAll('.film-snap')];
    window.__F.push({ at: performance.timeOrigin + ts, t: h.__story.t, pt: h.__story.player.t, cam: getComputedStyle(cam).transform, gop: +getComputedStyle(g).opacity, gh: g.offsetHeight, sn: snaps.length, sop: snaps.map((s) => +getComputedStyle(s).opacity).join(','), st: snaps.map((s) => s.style.transform).join(',') });
    if (window.__F.length < 20000) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
/* screencast */
const cdp = await ctx.newCDPSession(p); const frames = [];
cdp.on('Page.screencastFrame', async (f) => { frames.push({ at: f.metadata.timestamp * 1000, data: f.data }); try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch {} });
const clip = await p.evaluate(() => { const r = document.getElementById('hero-window').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
if (!process.env.NOSC) await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 70, maxWidth: +w, maxHeight: +h, everyNthFrame: 1 }); /* NOSC=1: rAF pacing only (the screencast's own cost out of the frame times) */
await p.evaluate((s) => document.querySelector('[data-island="hero"]').__story.player.seek(s), start); /* the Player seeks; the film sees a played clock from here on */
await p.waitForTimeout(dur * 1000);
if (!process.env.NOSC) await cdp.send('Page.stopScreencast');
const F = await p.evaluate(() => window.__F), LOAF = await p.evaluate(() => window.__LOAF);
await p.evaluate(() => { window.__F.length = 20000; });
/* events: story seconds at which something switches (cuts, covers, camera keyframes, presses, waves); read from the page's own module is not exposed, so the
   list is the script's table (kept in step with script.ts / scenario.ts) */
const EVS = JSON.parse(process.env.EVS ?? 'null') ?? (phone
  ? { wrap: 0, toast: 0.25, 'cut gates': 5.0, approveOpen: 7.25, approved: 8.7, deploy: 9.8, 'cut app': 17.9, 'cut pipe': 18.8, w2Deploy: 19.6, w2Check: 20.8, w2Done: 21.9, w3Deploy: 22.9, w3Check: 24.1, w3Done: 25.2, 'wrap-out': 29.4 }
  : { wrap: 0, toast: 0.25, 'cut stg': 2.4, 'cam stagingGo': 3.18, 'cut gates': 5.0, approveOpen: 7.25, approved: 8.7, deploy: 9.8, 'cut overview': 10.4, step2Go: 12.5, 'cam health': 14.1, hcLat: 15.4, 'cam bake': 15.7, 'cut app': 17.9, 'cut pipe': 18.8, w2Deploy: 19.6, w2Check: 20.8, w2Done: 21.9, w3Deploy: 22.9, w3Check: 24.1, w3Done: 25.2, 'wrap-out': 29.4 });
/* each event's real time = the first logged frame whose story t passed it (the wrap: t falls back) */
const evAt = {};
for (const [k, e] of Object.entries(EVS)) {
  let i;
  if (k === 'wrap') i = F.findIndex((f, j) => j && F[j - 1].t > f.t + 5);
  else if (k === 'wrap-out') i = F.findIndex((f, j) => j && F[j - 1].t > f.t + 5);
  else { const w0 = F.findIndex((f, j) => j && F[j - 1].t > f.t + 5); i = F.findIndex((f, j) => j > Math.max(0, w0) && f.t >= e && F[j - 1].t < e); }
  if (i > 0) evAt[k] = F[i].at;
}
/* frame diffs in a blank page (decode the jpegs, 160 px wide, mean abs diff 0-255) */
const keep = frames.filter((f) => Object.values(evAt).some((a) => f.at >= a - 400 && f.at <= a + 900));
const dp = await ctx.newPage();
const diffs = [];
for (let i = 0; i < keep.length; i += 40) {
  const chunk = keep.slice(Math.max(0, i - 1), i + 40).map((f) => f.data);
  const d = await dp.evaluate(async ([chunk, clip]) => {
    const c = document.createElement('canvas'); c.width = 160; c.height = Math.round(160 * clip.h / clip.w); const x = c.getContext('2d', { willReadFrequently: true }); let prev = null; const out = [];
    for (const b64 of chunk) { const im = new Image(); im.src = 'data:image/jpeg;base64,' + b64; await im.decode(); x.drawImage(im, clip.x, clip.y, clip.w, clip.h, 0, 0, c.width, c.height); const px = x.getImageData(0, 0, c.width, c.height).data; if (prev) { let s = 0; for (let k = 0; k < px.length; k += 4) s += Math.abs(px[k] - prev[k]) + Math.abs(px[k + 1] - prev[k + 1]) + Math.abs(px[k + 2] - prev[k + 2]); out.push(s / (px.length / 4) / 3); } else out.push(null); prev = px; }
    return out; }, [chunk, clip]);
  for (let j = i === 0 ? 0 : 1; j < d.length; j++) diffs.push(d[j]);
}
keep.forEach((f, i) => (f.diff = diffs[i] ?? null));
/* save the transition frames (for strips) */
const idx = keep.map((f, i) => { const name = `frames/${String(i).padStart(4, '0')}.jpg`; fs.writeFileSync(`${out}/${name}`, Buffer.from(f.data, 'base64')); return { i, at: f.at, name, diff: f.diff }; });
fs.writeFileSync(`${out}/frames.json`, JSON.stringify(idx));
fs.writeFileSync(`${out}/raf.json`, JSON.stringify({ F, LOAF, evAt, clip }));
/* per-transition table */
const rows = [];
for (const [k, a] of Object.entries(evAt)) {
  const win = F.filter((f) => f.at >= a - 300 && f.at <= a + 800);
  const dts = win.slice(1).map((f, j) => f.at - win[j].at);
  const maxDt = Math.max(0, ...dts), over20 = dts.filter((d) => d > 20).length, over33 = dts.filter((d) => d > 33.4).length;
  /* a camera change or a height change on a frame with NO cover still over it = seen by the reader (a snap or a reflow jump) */
  let snaps = 0, reflows = 0;
  for (let j = 1; j < win.length; j++) { const A = win[j - 1], B = win[j]; const covered = B.sn > 0 && B.sop.split(',').some((o) => +o > 0.98); const ty = (m) => +(m.match(/matrix\([^)]*,\s*([-\d.]+)\)$/)?.[1] ?? 0), tx = (m) => +(m.match(/matrix\([^,]*,[^,]*,[^,]*,[^,]*,\s*([-\d.]+),/)?.[1] ?? 0); if ((Math.abs(ty(A.cam) - ty(B.cam)) > 0.5 || Math.abs(tx(A.cam) - tx(B.cam)) > 0.5) && !covered && B.gop > 0.02) snaps++; /* > 0.5 px: a sub-pixel tail is not a snap */ if (Math.abs(A.gh - B.gh) > 2 && !covered && B.gop > 0.02) reflows++; }
  const fr = keep.filter((f) => f.at >= a - 300 && f.at <= a + 800 && f.diff !== null);
  const fd = fr.map((f) => f.diff), maxDiff = Math.max(0, ...fd);
  const lf = LOAF.filter((l) => l.at >= a - 300 && l.at <= a + 800);
  rows.push({ ev: k, t: EVS[k], frames: win.length, maxDt: +maxDt.toFixed(1), over20, over33, snaps, reflows, scFrames: fr.length, maxDiff: +maxDiff.toFixed(1), worstDiffAt: fr.length ? +((fr[fd.indexOf(maxDiff)].at - a) / 1000).toFixed(3) : null, loaf: lf.length ? lf.map((l) => Math.round(l.dur) + 'ms ' + l.src).slice(0, 2).join(' | ') : '' });
}
const all = F.slice(1).map((f, j) => f.at - F[j].at);
console.log(JSON.stringify({ w, theme, loop: LOOP, frames: F.length, sc: frames.length, p50: +all.sort((a, b) => a - b)[Math.floor(all.length / 2)].toFixed(1), p99: +all[Math.floor(all.length * 0.99)].toFixed(1), errs: errs.slice(0, 3) }));
for (const r of rows) console.log(JSON.stringify(r));
fs.writeFileSync(`${out}/table.json`, JSON.stringify(rows, null, 1));
await b.close();
