// onecard.mjs: at every scroll step, at most ONE card runs, and every other BUILT card stands on its rest frame (anim time == rest).
import { chromium } from '@playwright/test';
const URL = process.env.URL ?? 'http://127.0.0.1:1376/';
const b = await chromium.launch(); let fail = 0;
for (const [vw, vh] of [[1440, 900], [390, 844], [1440, 1500]]) {
  const p = await (await b.newContext({ viewport: { width: vw, height: vh } })).newPage();
  await p.goto(URL + '?x=1', { waitUntil: 'load' }); await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const H = await p.evaluate(() => document.documentElement.scrollHeight); let maxRun = 0, bad = [], seq = [];
  for (let y = 0; y < H; y += Math.round(vh / 3)) {
    await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(900);
    const s = await p.evaluate(() => [...document.querySelectorAll('[data-vg]')].filter((h) => h.dataset.vgLive).map((h) => {
      const an = h.getAnimations({ subtree: true }); return { id: h.dataset.vg, run: an.some((a) => a.playState === 'running'), ct: an.length ? an[0].currentTime / 1000 : 0, rest: window.__vgRest(h.dataset.vg) }; }));
    const running = s.filter((x) => x.run); maxRun = Math.max(maxRun, running.length); if (running.length) seq.push(running[0].id);
    for (const x of s) if (!x.run && Math.abs(x.ct - x.rest) > 0.01) bad.push(`${x.id}@${y} ct ${x.ct.toFixed(2)} rest ${x.rest}`);
  }
  const ok = maxRun <= 1 && !bad.length; if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} onecard ${vw}x${vh}: max running ${maxRun}; hand-offs ${[...new Set(seq)].join('>')}; off-rest while paused: ${bad.length ? bad.slice(0, 6).join('; ') : 'none'}`);
}
await b.close(); process.exit(fail ? 1 : 0);
