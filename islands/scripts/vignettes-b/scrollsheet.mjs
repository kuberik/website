// scrollsheet.mjs: what a visitor sees when a card scrolls into view (v6j "no empty frame, start from a populated frame").
// For each card, cells 1440 light + 390 dark (CELLS=all adds the other two): load the page, scroll the card to the centre, then
//   A. shoot the card every ~100 ms for 2.0 s from the scroll (whatever it is doing: resting while it waits, or playing);
//   B. wait for its turn (vgState = play, up to 30 s), then shoot ~100 ms for (loop - rest) + 1.0 s from the turn's start,
//      i.e. across its loop seam.
// Each frame is captioned with ms since the phase began, the card's state and its loop time; a frame whose ink (pixels that
// differ from the card's corner by > 24) is < 60 % of the first frame's is flagged BLANK? and fails the run.
// Writes <OUT>/scroll-<card>-<w>-<theme>.png (a contact sheet). usage: URL=http://127.0.0.1:1380/ OUT=dir node scrollsheet.mjs [cards]
import { chromium } from '@playwright/test';
import fs from 'fs';
const URL = process.env.URL ?? 'http://127.0.0.1:1380/', OUT = process.env.OUT ?? '.';
const cards = (process.argv[2] ?? 'gates,canary,health,gitops,dashboard,releases').split(',');
const cells = process.env.CELLS === 'all' ? [[1440, 'light'], [1440, 'dark'], [390, 'light'], [390, 'dark']] : [[1440, 'light'], [390, 'dark']];
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(); let fail = 0;
const inkOf = (p, b64) => p.evaluate(async (b64) => {
  const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
  const cv = new OffscreenCanvas(im.width, im.height), x = cv.getContext('2d'); x.drawImage(im, 0, 0);
  const d = x.getImageData(0, 0, im.width, im.height).data; let n = 0;
  for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 24 || Math.abs(d[i + 1] - d[1]) > 24 || Math.abs(d[i + 2] - d[2]) > 24) n++;
  return n;
}, b64);
for (const [W, th] of cells) for (const card of cards) {
  const ctx = await b.newContext({ viewport: { width: W, height: W > 640 ? 900 : 844 }, colorScheme: th, deviceScaleFactor: 1, ...(W < 500 ? { isMobile: true, hasTouch: true } : {}) });
  await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.scrollBehavior = 'auto'; }); }, th);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto(URL, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  const host = p.locator(`[data-vg="${card}"]`).first();
  const info = () => p.evaluate((c) => { const h = document.querySelector(`[data-vg="${c}"]`); const L = window.__vgLoops()[c];
    const an = h.getAnimations({ subtree: true }); const t = an.length ? ((an[0].currentTime / 1000) % L) : null;
    return { st: h.dataset.vgState || (h.dataset.vgLive ? 'rest' : 'poster'), t, L, rest: window.__vgRest(c) }; }, card);
  await p.evaluate((c) => document.querySelector(`[data-vg="${c}"]`).scrollIntoView({ block: 'center' }), card);
  const frames = []; let ref = null;
  const shoot = async (phase, dur) => {
    const t0 = Date.now();
    while (Date.now() - t0 <= dur) {
      const tk = Date.now(); const i = await info(); const b64 = (await host.screenshot()).toString('base64');
      const ink = await inkOf(p, b64); if (ref == null) ref = ink;
      const blank = ink < 0.6 * ref; if (blank) fail++;
      frames.push({ phase, ms: tk - t0, st: i.st, t: i.t, b64, blank });
      const spent = Date.now() - tk; if (spent < 100) await p.waitForTimeout(100 - spent);
    }
  };
  await shoot('A scroll', 2000);
  let i = await info(); const tw = Date.now();
  while (i.st !== 'play' && Date.now() - tw < 30000) { await p.waitForTimeout(50); i = await info(); }
  if (i.st === 'play') await shoot('B turn', ((i.L - i.rest) + 1.0) * 1000); else frames.push({ phase: 'B turn', ms: 0, st: 'NEVER PLAYED', t: null, b64: '', blank: true }) && fail++;
  const cols = W > 640 ? 6 : 8, tw2 = W > 640 ? 230 : 150;
  const html = `<body style="margin:0;background:#888;font:11px monospace"><div style="padding:6px;color:#fff">${card} ${W} ${th}  A = 2 s after scroll, B = from its turn across the seam; red = BLANK?</div><div style="display:grid;grid-template-columns:repeat(${cols},${tw2}px);gap:4px;padding:4px">${frames.map((f) => `<figure style="margin:0;background:${f.blank ? '#c00' : '#222'};color:#fff;padding:2px"><img style="width:100%;display:block" src="data:image/png;base64,${f.b64}"><figcaption>${f.phase[0]} ${f.ms}ms ${f.st} t${f.t == null ? '-' : f.t.toFixed(2)}</figcaption></figure>`).join('')}</div></body>`;
  const sp = await ctx.newPage(); await sp.setViewportSize({ width: cols * (tw2 + 4) + 8, height: 400 }); await sp.setContent(html); await sp.waitForTimeout(200);
  const file = `${OUT}/scroll-${card}-${W}-${th}.png`; await sp.screenshot({ path: file, fullPage: true });
  console.log(`${frames.some((f) => f.blank) ? 'FAIL' : 'PASS'} ${card} ${W} ${th}: ${frames.length} frames, blank ${frames.filter((f) => f.blank).length}, first-play-after ${frames.find((f) => f.st === 'play')?.phase ?? '-'}${errs.length ? ' ERR ' + errs[0] : ''} -> ${file}`);
  await ctx.close();
}
await b.close(); process.exit(fail ? 1 : 0);
