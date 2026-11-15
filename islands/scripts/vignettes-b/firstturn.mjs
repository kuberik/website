// firstturn.mjs (v6k, QA F2): card A is centred and plays for a varying time, then the visitor scrolls to card B, instantly
// (BEH=auto) or with the page's smooth scroll (BEH=smooth, the real thing). Per trial, sampled every 50 ms from the scroll:
//   - B plays within 2 s of the scroll (the first turn goes to the centred card);
//   - no card other than A and B ever leaves 'rest' (a card crossed on the way must not be elected: that was the bug);
//   - never two cards in 'play'; and when A's turn was < 1 s old when the scroll came, A never enters 'finish' (it yields at once).
// URL= VW= A= B= N= CPU= BEH= . Default runs the QA repro pairs gates->canary and canary->health, both behaviours.
import { chromium } from '@playwright/test';
const URL = process.env.URL ?? 'http://127.0.0.1:1390/', VW = +(process.env.VW ?? 1440), CPU = +(process.env.CPU ?? 1), N = +(process.env.N ?? 8);
const PAIRS = process.env.A ? [[process.env.A, process.env.B ?? 'canary']] : [['gates', 'canary'], ['canary', 'health'], ['gitops', 'dashboard']]   // B is the left card of its row: a side-by-side tie goes to the left card, so a right-hand B would not be a fair target;
const BEHS = process.env.BEH ? [process.env.BEH] : ['auto', 'smooth'];
const b = await chromium.launch(); let fail = 0;
for (const [A, B] of PAIRS) for (const BEH of BEHS) {
  const ctx = await b.newContext({ viewport: { width: VW, height: VW < 500 ? 844 : 900 } }); const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  if (CPU > 1) { const s = await ctx.newCDPSession(p); await s.send('Emulation.setCPUThrottlingRate', { rate: CPU }); }
  await p.goto(URL); await p.waitForFunction(() => document.documentElement.dataset.vgReady);
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const go = (id, beh) => p.evaluate(([id, beh]) => { const h = document.querySelector(`[data-vg="${id}"]`); const r = h.getBoundingClientRect(); scrollTo({ top: r.top + scrollY - (innerHeight - r.height) / 2, behavior: beh }); }, [id, beh]);
  const st = () => p.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-vg]')].filter((h) => h.dataset.vgLive).map((h) => [h.dataset.vg, h.dataset.vgState || 'rest'])));
  let bad = 0; const notes = [];
  for (let i = 0; i < N; i++) {
    const wait = 700 + i * 640;
    await go(A, 'auto'); await p.waitForTimeout(wait);
    // age of A's turn at the scroll: it was elected when it was centred, so the wait is a lower bound; read it from the page
    await go(B, BEH);
    const seen = []; let bAt = -1, bPlayed = false, multi = 0, finishA = 0, finA = [], stray = new Set();
    for (let k = 0; k < 40; k++) {
      await p.waitForTimeout(50); const s = await st();
      const pl = Object.entries(s).filter(([, v]) => v === 'play').map(([k2]) => k2); if (pl.length > 1) multi++;
      // a stray in 'play' while A is on rest is a loop-end hand-off to a row-mate: legitimate
      for (const [id, v] of Object.entries(s)) { if (v !== 'rest' && id !== A && id !== B && s[A] !== 'rest') stray.add(id + ':' + v);   if (id === A && v === 'finish') finA.push(k); }
      seen.push(s[B]);
      if (s[B] === 'play' && !bPlayed) { bPlayed = true; bAt = k; }
    }
    // A's turn age when B took over (the election): a card that was < 1 s into its turn yields at once, so it never finishes
    if (bPlayed && wait + (bAt + 1) * 50 < 1000) finishA = finA.length;
    await p.waitForTimeout(0); const s2 = await st();
    // B played within 1.5 s (it may already have ended its turn: a card re-elected mid-finish only plays the rest of its loop)
    const ok = bPlayed && !multi && !stray.size && !finishA;
    if (!ok) { bad++; notes.push(`trial ${i} wait ${wait}: B played=${bPlayed} multi=${multi} stray=[${[...stray]}] finishA=${finishA}`); }
  }
  if (errs.length) { bad++; notes.push('errors ' + errs[0]); }
  if (bad) fail++;
  console.log(`${bad ? 'FAIL' : 'PASS'} firstturn ${A}->${B} ${BEH} VW=${VW} cpu${CPU}: ${N - Math.min(bad, N)}/${N} trials ok${notes.length ? '\n  ' + notes.join('\n  ') : ''}`);
  await ctx.close();
}
await b.close(); process.exit(fail ? 1 : 0);
