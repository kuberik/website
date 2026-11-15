// flip.mjs (v6k, QA F1): every card advances some cycles, then the viewport crosses the 640 px breakpoint (a phone rotating,
// or a window resized). No card's labels (versions a.b.c-n, PR #n, tags vX.Y.Z, deps) may go backwards, in either direction,
// and at most one card is 'play' afterwards. VW= is the starting width: 390 -> 844 (rotate) and 1440 -> 600 and back.
import { chromium } from '@playwright/test';
const URL = process.env.URL ?? 'http://127.0.0.1:1390/';
const IDS = (process.env.IDS ?? 'gates,canary,health,gitops,dashboard,releases,stepin').split(',');
const fam = (txt) => { const o = {};
  for (const m of txt.matchAll(/\b(\d+)\.(\d+)\.0-(\d+)\b/g)) o.ver = Math.max(o.ver ?? 0, +m[2]);
  for (const m of txt.matchAll(/#(\d{2,4})\b/g)) o.pr = Math.max(o.pr ?? 0, +m[1]);
  for (const m of txt.matchAll(/\bv(\d+)\.(\d+)\.(\d+)\b/g)) o.tag = Math.max(o.tag ?? 0, +m[1] * 1e6 + +m[2] * 1e3 + +m[3]);
  for (const m of txt.matchAll(/\b(\d+)\.(\d+)\.0\b(?!-)/g)) o.dep = Math.max(o.dep ?? 0, +m[1] * 1e3 + +m[2]);
  return o; };
const b = await chromium.launch(); let fail = 0;
for (const [from, to] of [[390, 844], [1440, 600], [844, 390]]) {
  const ctx = await b.newContext({ viewport: { width: from, height: from < 500 ? 844 : 900 } }); const p = await ctx.newPage(); const errs = [];
  p.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && errs.push(m.text())); p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto(URL); await p.waitForFunction(() => document.documentElement.dataset.vgReady);
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  for (const id of IDS) { await p.evaluate((id) => { const h = document.querySelector(`[data-vg="${id}"]`); const r = h.getBoundingClientRect(); scrollTo(0, r.top + scrollY - (innerHeight - r.height) / 2); }, id); await p.waitForTimeout(+(process.env.DWELL ?? 9000)); }
  const read = () => p.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-vg]')].map((h) => [h.dataset.vg, [...h.querySelectorAll('text')].filter((t) => { let e = t; while (e && e !== h) { if (getComputedStyle(e).opacity === '0') return false; e = e.parentElement; } return true; }).map((t) => t.textContent).join(' ')])));
  const before = Object.fromEntries(Object.entries(await read()).map(([k, v]) => [k, fam(v)]));
  await p.setViewportSize({ width: to, height: to < 500 ? 844 : 900 }); await p.waitForTimeout(1500);
  const after = Object.fromEntries(Object.entries(await read()).map(([k, v]) => [k, fam(v)]));
  const playing = await p.evaluate(() => [...document.querySelectorAll('[data-vg]')].filter((h) => h.dataset.vgState === 'play').length);
  const back = []; for (const id of IDS) for (const k of Object.keys(before[id] ?? {})) if (after[id]?.[k] != null && after[id][k] < before[id][k]) back.push(`${id}.${k} ${before[id][k]} -> ${after[id][k]}`);
  const bad = back.length || playing > 1 || errs.length; if (bad) fail++;
  console.log(`${bad ? 'FAIL' : 'PASS'} flip ${from} -> ${to}: ${back.length ? 'BACKWARDS ' + back.join('; ') : 'no label went back'}; playing after ${playing}${errs.length ? '; console ' + errs[0] : ''}`);
  await ctx.close();
}
await b.close(); process.exit(fail ? 1 : 0);
