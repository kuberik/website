// usage: node check.mjs <w> <h> <light|dark> <loops=2> [throttle=none|fast3g|slow4g]
// Real-time run of the hero for N loops: samples every 50 ms (DOM: group opacity, painted text, spinner paint) and every 1 s (pixel luminance variance of the window).
// FAILS (exit 1) on: a blank window (group opacity < .5 or < 60 chars of product text) for > 250 ms, a pixel-flat window, any console error, or a spinner/status mark with zero size or no border paint.
import { chromium } from '@playwright/test';
const [w, h, theme, loops = '2', thr = 'none'] = process.argv.slice(2);
const URL = process.env.URL ?? 'http://127.0.0.1:1313/';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, colorScheme: theme === 'reduced' ? 'light' : theme, ...(theme === 'reduced' ? { reducedMotion: 'reduce' } : {}), ...(+w < 500 ? { isMobile: true, hasTouch: true } : {}) });
await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} }, theme);
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
if (thr !== 'none') { const N = { fast3g: [562500, 1.4e5, 562], slow4g: [1.6e6 / 8 * 3, 1.6e6 / 8, 150] }[thr]; await cdp.send('Network.emulateNetworkConditions', { offline: false, downloadThroughput: N[0], uploadThroughput: N[1], latency: N[2] }); }
await ctx.route(/livereload/, (r) => r.abort()); // hugo's live reload would wipe the sampler when static/ changes
const errs = [];
p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text().slice(0, 200)); });
p.on('pageerror', (e) => errs.push('pageerror ' + String(e).slice(0, 200)));
p.on('response', (r) => { if (r.status() >= 400) errs.push(`HTTP ${r.status()} ${r.url()}`); });
const t0 = Date.now();
await p.goto(URL, { waitUntil: 'load' });
await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
await p.evaluate(() => { const r = document.getElementById('hero-window').getBoundingClientRect(); scrollTo(0, scrollY + r.top - 150); });
const y0 = await p.evaluate(() => scrollY);
// sampler runs in the page from the moment the hero host exists
await p.evaluate(() => {
  window.__S = []; window.__spin = []; window.__Y = [];
  const tick = () => {
    const host = document.querySelector('[data-island="hero"]'); const root = host?.shadowRoot;
    const g = root?.querySelector('.film-group'); const poster = !!(host?.querySelector('.ph-poster') || root?.querySelector('.ph-poster, slot'));
    const live = !!root?.querySelector('.film-canvas');
    const win = document.getElementById('hero-window')?.getBoundingClientRect();
    const onscreen = !!win && win.bottom > 0 && win.top < innerHeight;
    let op = null, txt = 0, snap = false;
    if (g) { op = parseFloat(getComputedStyle(g).opacity); txt = (g.innerText || '').length; }
    /* a cut hides the group under a still of the page (.film-snap): the window is not blank while a still is showing */
    const sn = root?.querySelector('.film-snap'); if (sn && parseFloat(getComputedStyle(sn).opacity) > 0.5 && (sn.innerText || sn.textContent || '').length >= 60) snap = true;
    window.__Y.push(scrollY);
    window.__S.push({ at: performance.now(), live, poster, onscreen, op, txt, snap, story: host?.__story?.player?.t ?? null });
    if (g) for (const e of root.querySelectorAll('.animate-spin')) { const r = e.getBoundingClientRect(), c = getComputedStyle(e); if (r.width > 0 && (c.borderTopStyle === 'none' || parseFloat(c.borderTopWidth) === 0 || r.width < 2)) window.__spin.push({ at: performance.now(), w: r.width, bs: c.borderTopStyle, bw: c.borderTopWidth, cls: e.className.toString().slice(0, 80) }); }
    // svg status marks that have collapsed
    if (g) for (const e of root.querySelectorAll('svg')) { const r = e.getBoundingClientRect(), c = getComputedStyle(e); if (c.display !== 'none' && r.width === 0 && r.height === 0 && e.parentElement.getBoundingClientRect().width > 0 && e.closest('[class*="status"],[class*="icon"]')) window.__spin.push({ at: performance.now(), w: 0, bs: 'svg0', bw: '', cls: (e.getAttribute('class') || '').slice(0, 80) }); }
  };
  window.__iv = setInterval(tick, 50);
});
const LOOP = 29.4 /* scene lane 7 */, total = +loops * LOOP * 1000 + 3000;
const pix = [];
const start = Date.now();
while (Date.now() - start < total) {
  await p.waitForTimeout(1000);
  const win = await p.evaluate(() => { const r = document.getElementById('hero-window').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  if (win.y + win.h < 0 || win.y > +h) continue;
  const buf = await p.screenshot({ clip: { x: Math.max(0, win.x), y: Math.max(0, win.y), width: Math.min(+w - Math.max(0, win.x), win.w), height: Math.min(+h - Math.max(0, win.y), win.h) } });
  const st = await p.evaluate(async (b64) => { const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode(); const c = document.createElement('canvas'); c.width = 80; c.height = 50; const x = c.getContext('2d'); x.drawImage(img, 0, 0, 80, 50); const d = x.getImageData(0, 0, 80, 50).data; let s = 0, s2 = 0, n = 0; for (let i = 0; i < d.length; i += 4) { const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; s += l; s2 += l * l; n++; } const m = s / n; return { mean: m, sd: Math.sqrt(Math.max(0, s2 / n - m * m)) }; }, buf.toString('base64'));
  const story = await p.evaluate(() => document.querySelector('[data-island="hero"]')?.__story?.player?.t ?? null);
  pix.push({ at: Date.now() - t0, story, ...st });
}
const S = await p.evaluate(() => { clearInterval(window.__iv); return { S: window.__S, spin: window.__spin, Y: window.__Y }; });
if (process.env.DUMP) (await import('fs')).writeFileSync(process.env.DUMP, S.S.filter((_, i) => i % 10 === 0).map((x) => `${Math.round(x.at)} live=${+x.live} on=${+x.onscreen} op=${x.op} txt=${x.txt} story=${x.story?.toFixed?.(1)}`).join('\n'));
// analysis
let bad = [], run = null, firstLive = null;
for (const s of S.S) {
  if (s.live && firstLive === null) firstLive = s.at;
  const blank = s.live && s.onscreen && !s.snap && (s.op < 0.15 || s.txt < 60);
  if (blank) { run ??= { from: s.at, to: s.at, op: s.op, txt: s.txt }; run.to = s.at; } else if (run) { if (run.to - run.from >= 250) bad.push(run); run = null; }
}
if (run && run.to - run.from >= 250) bad.push(run);
let noLive = 0; for (const s of S.S) if (!s.live && !s.poster && s.onscreen) noLive++;
/* the loop's end is empty ground by design (the page fades at 47.0, empty from 47.4): not counted */
const flatAll = pix.filter((x) => x.sd < 1.2);
const flat = pix.filter((x) => x.sd < 1.2 && x.story !== null); /* no exemption at the loop wrap: the wrap is a cross-fade, never empty ground */
const spinBad = S.spin.length;
/* the film must ADVANCE: story time may not stand still > 2 s while the window is onscreen (reduced motion rest excepted: not this run), and the loop must wrap at least once */
const reduced = theme === 'reduced';
let stalls = [], wraps = 0, prev = null, sinceMove = null;
for (const s of S.S) {
  if (s.story == null || !s.onscreen || !s.live) { prev = null; sinceMove = null; continue; } /* scene lane 6: the story holds at 0 until the film is up (behind the poster) by design */
  if (prev !== null && s.story < prev - 5) wraps++;
  if (prev === null || Math.abs(s.story - prev) > 1e-6) sinceMove = s.at;
  else if (sinceMove !== null && s.at - sinceMove > 2000 && !reduced) { stalls.push({ story: +s.story.toFixed(2), ms: Math.round(s.at - sinceMove) }); sinceMove = s.at + 1e9; }
  prev = s.story;
}
const scrollDrift = Math.max(0, ...S.Y.map((y) => Math.abs(y - y0)));
const noAdvance = stalls.length > 0 || (!reduced && wraps < 1) || scrollDrift > 1; /* reduced motion rests (no autoplay, no wrap) */
const out = { cfg: `${w}x${h} ${theme} ${thr}`, samples: S.S.length, firstLiveMs: firstLive ? Math.round(firstLive) : null, blankRuns: bad.map((r) => ({ ms: Math.round(r.to - r.from), op: r.op, txt: r.txt })), maxBlankMs: Math.round(Math.max(0, ...bad.map((r) => r.to - r.from))), samplesWithNeitherPosterNorFilm: noLive, pixelFlatFrames: flat.length + '/' + pix.length, flatAt: flatAll.map((x) => x.story?.toFixed?.(1)).join(','), minSd: Math.round(Math.min(...pix.map((x) => x.sd))), spinnerPaintFailures: spinBad, stalls: stalls.slice(0, 3), loopWraps: wraps, scrollDriftPx: scrollDrift, spinnerSample: S.spin.slice(0, 2), consoleErrors: errs.length, errs: errs.slice(0, 5) };
console.log(JSON.stringify(out));
await b.close();
process.exit(bad.length || flat.length || spinBad || errs.length || noLive || noAdvance ? 1 : 0);
