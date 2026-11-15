// onecard.mjs: at every scroll step, at most ONE card PLAYS, and every other BUILT card either stands on its rest frame or is
// the one outgoing card FINISHING its cycle (vg.js state 'finish': a card that lost its turn mid-loop runs on to its rest frame
// instead of jumping or dissolving; turns.mjs checks the same rule). Was (537a8fa1, before v6j): every running animation counted
// as "playing" and the clock was compared absolutely, so a finishing card read as a second player and every card parked at
// restAbs (rest + n loops, the absolute clock since v6j) read as off rest.
// Each step logs every live card's state; a step with two moving cards is captured to $OUT (when set) as evidence.
import { chromium } from '@playwright/test';
import fs from 'fs';
const URL = process.env.URL ?? 'http://127.0.0.1:1376/';
const OUT = process.env.OUT; if (OUT) fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(); let fail = 0;
for (const [vw, vh] of [[1440, 900], [390, 844], [1440, 1500]]) {
  const p = await (await b.newContext({ viewport: { width: vw, height: vh } })).newPage();
  await p.goto(URL + '?x=1', { waitUntil: 'load' }); await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  let maxPlay = 0, maxMove = 0, maxFin = 0, bad = [], seq = [], two = 0; const prevSt = {};
  for (let y = 0; y < H; y += Math.round(vh / 3)) {
    await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(900);
    const s = await p.evaluate(() => [...document.querySelectorAll('[data-vg]')].filter((h) => h.dataset.vgLive).map((h) => {
      const an = h.getAnimations({ subtree: true }).filter((a) => a.effect && a.effect.target !== h.firstElementChild);
      const L = window.__vgLoops()[h.dataset.vg], rest = window.__vgRest(h.dataset.vg);
      const ct = an.length ? an[0].currentTime / 1000 : 0;
      return { id: h.dataset.vg, st: h.dataset.vgState || 'rest', run: an.some((a) => a.playState === 'running'), lt: ((ct - rest) % L + L) % L, L }; }));
    const play = s.filter((x) => x.run && x.st === 'play'), fin = s.filter((x) => x.st === 'finish'), move = s.filter((x) => x.run);
    maxPlay = Math.max(maxPlay, play.length); maxFin = Math.max(maxFin, fin.length); maxMove = Math.max(maxMove, move.length);
    if (play.length) seq.push(play[0].id);
    for (const x of s) {
      if (x.st === 'finish' && prevSt[x.id] === 'rest') bad.push(`${x.id}@${y} rest->finish`);
      if (x.run && x.st === 'rest') bad.push(`${x.id}@${y} runs while at rest`);
      if (!x.run && x.st !== 'finish' && Math.min(x.lt, x.L - x.lt) > 0.01) bad.push(`${x.id}@${y} paused ${x.lt.toFixed(2)} s off rest`);
      prevSt[x.id] = x.st;
    }
    if (move.length > 1) {
      two++;
      const desc = s.map((x) => `${x.id}:${x.st}${x.run ? '*' : ''}`).join(' ');
      console.log(`  ${vw}x${vh} y=${y}: ${move.length} moving: ${desc}`);
      if (OUT) await p.screenshot({ path: `${OUT}/onecard-${vw}x${vh}-y${y}.png` });
      // The second mover must be the finishing card, and it must stand on its rest frame within one loop.
      for (const f of fin) {
        // QA3-1: record that the finishing card actually STANDS on rest: a MutationObserver on its data-vg-state samples
        // every state change in the page (state, running, offset from the rest frame), so a short rest between 'finish' and
        // winning the turn back ('play') is seen even when it lasts one frame. 'play' alone no longer counts as on rest.
        await p.evaluate((id) => { const h = document.querySelector(`[data-vg="${id}"]`); const log = (window.__ocLog = []);
          const snap = (recs = []) => { const sts = [...recs.slice(1).map((m) => m.oldValue), h.dataset.vgState || 'rest']; const an = h.getAnimations({ subtree: true }).filter((a) => a.effect && a.effect.target !== h.firstElementChild);
            const L = window.__vgLoops()[id], rest = window.__vgRest(id), ct = an.length ? an[0].currentTime / 1000 : 0;
            log.push({ st: h.dataset.vgState || 'rest', sts, run: an.some((a) => a.playState === 'running' && a.playbackRate !== 0), lt: ((ct - rest) % L + L) % L, L }); };
          window.__ocObs?.disconnect(); window.__ocObs = new MutationObserver(snap); window.__ocObs.observe(h, { attributes: true, attributeOldValue: true, attributeFilter: ['data-vg-state'] }); snap(); }, f.id);
        await p.waitForTimeout(Math.ceil((f.L - f.lt + 0.6) * 1000));
        const seen = await p.evaluate(() => { window.__ocObs.disconnect(); return window.__ocLog; });
        const r = seen[seen.length - 1];
        const onRest = seen.some((x) => x.sts.includes('rest') && Math.min(x.lt, x.L - x.lt) <= 0.02);   // a rest set and left in one task is seen through oldValue
        console.log(`    ${f.id} within ${(f.L - f.lt + 0.6).toFixed(1)} s: now ${r.st}${r.run ? '*' : ''} lt ${r.lt.toFixed(2)} -> ${onRest ? 'stood on rest' : 'NEVER ON REST'}`);
        if (!onRest) bad.push(`${f.id}@${y} finish did not reach rest`);
        if (OUT) await p.screenshot({ path: `${OUT}/onecard-${vw}x${vh}-y${y}-after.png` });
      }
    }
  }
  const ok = maxPlay <= 1 && maxFin <= 1 && !bad.length; if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} onecard ${vw}x${vh}: max playing ${maxPlay}; max finishing ${maxFin}; steps with two moving ${two}; hand-offs ${[...new Set(seq)].join('>')}; off-rest: ${bad.length ? bad.slice(0, 6).join('; ') : 'none'}`);
}
await b.close(); process.exit(fail ? 1 : 0);
