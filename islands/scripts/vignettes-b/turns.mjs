// turns.mjs: with several cards in view, every one gets a turn (one loop each), at most one runs at a time, and the
// outgoing card stops on its rest frame. Sits on each bento row for 22 s, sampling every 250 ms (off-rest is not counted in
// the first 500 ms after a scroll: a card that lost its turn is mid-dissolve, 380 ms, by design).
import { chromium } from '@playwright/test';
const URL = process.env.URL ?? 'http://127.0.0.1:1376/';
const b = await chromium.launch(); let fail = 0;
for (const [vw, vh] of [[1440, 900], [1920, 1080], [2560, 1440]]) {
  const p = await (await b.newContext({ viewport: { width: vw, height: vh } })).newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(URL + '?x=1', { waitUntil: 'load' }); await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  for (const anchor of ['gates', 'canary', 'dashboard']) {
    await p.evaluate((a) => document.querySelector(`[data-vg="${a}"]`).scrollIntoView({ block: 'center' }), anchor);
    const inView = await p.evaluate(() => [...document.querySelectorAll('[data-vg]')].filter((h) => { const r = h.getBoundingClientRect(); const vis = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / r.height; return vis >= 0.5; }).map((h) => h.dataset.vg));
    const ran = new Set(); let maxRun = 0; const bad = [];
    for (let i = 0; i < 88; i++) {
      await p.waitForTimeout(250);
      const s = await p.evaluate(() => [...document.querySelectorAll('[data-vg]')].filter((h) => h.dataset.vgLive).map((h) => {
        const an = h.getAnimations({ subtree: true }).filter((a) => a.effect && a.effect.target !== h.firstElementChild); const L = window.__vgLoops()[h.dataset.vg]; return { id: h.dataset.vg, st: h.dataset.vgState || 'rest', run: an.some((a) => a.playState === 'running'), ct: an.length ? (an[0].currentTime / 1000) % L : 0, rest: window.__vgRest(h.dataset.vg) }; }));
      // v6j: the clock is absolute (cycles), so compare loop time; a card that lost its turn mid-loop may still be FINISHING its
      // cycle (state 'finish'); at most one card is 'play', and a stopped card ('rest') sits on its rest frame
      const r = s.filter((x) => x.run && x.st === 'play'); maxRun = Math.max(maxRun, r.length); s.filter((x) => x.run).forEach((x) => ran.add(x.id));
      for (const x of s) if (!x.run && x.st !== 'finish' && Math.abs(x.ct - x.rest) > 0.01) bad.push(`${x.id}@${i} ct ${x.ct.toFixed(2)}`);
      for (const x of s) if (x.run && x.st === 'rest') bad.push(`${x.id}@${i} runs while at rest`);
    }
    const missed = inView.filter((x) => !ran.has(x));
    const ok = maxRun <= 1 && !missed.length && !bad.length; if (!ok) fail++;
    console.log(`${ok ? 'PASS' : 'FAIL'} turns ${vw}x${vh} @${anchor}: in view ${inView.join(',')}; ran ${[...ran].join(',')}; max running ${maxRun}; off-rest ${bad.length ? bad.slice(0, 4).join('; ') : 'none'}`);
  }
  if (errs.length) { fail++; console.log('FAIL errors', errs.slice(0, 3).join(' | ')); }
}
await b.close(); process.exit(fail ? 1 : 0);
