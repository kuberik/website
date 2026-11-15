// fliprest.mjs (from QA3-2's probe; flip.mjs checks labels and one player): after a breakpoint flip, every live card is 'play' (at most one), 'finish' (lands on rest within one loop), or paused on rest.
import { chromium } from '@playwright/test';
const URL = process.env.URL ?? 'http://127.0.0.1:1390/';
const IDS = ['gates','canary','health','gitops','dashboard','releases','stepin'];
const b = await chromium.launch(); let fail = 0;
const state = (p) => p.evaluate(() => [...document.querySelectorAll('[data-vg]')].filter((h) => h.dataset.vgLive).map((h) => {
  const an = h.getAnimations({ subtree: true }).filter((a) => a.effect && a.effect.target !== h.firstElementChild);
  const L = window.__vgLoops()[h.dataset.vg], rest = window.__vgRest(h.dataset.vg); const ct = an.length ? an[0].currentTime / 1000 : 0;
  return { id: h.dataset.vg, st: h.dataset.vgState || 'rest', run: an.some((a) => a.playState === 'running'), lt: ((ct - rest) % L + L) % L, L }; }));
for (const [from, to, at] of [[390,844,'releases'],[844,390,'gitops'],[1000,1100,'canary'],[1100,1000,'dashboard'],[1440,600,'health'],[600,1440,'gates']]) {
  const ctx = await b.newContext({ viewport: { width: from, height: from < 500 ? 844 : 900 } }); const p = await ctx.newPage(); const errs = [];
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', (e) => errs.push(String(e)));
  p.on('response', (r) => r.status() >= 400 && errs.push(r.status() + ' ' + r.url()));
  await p.goto(URL); await p.waitForFunction(() => document.documentElement.dataset.vgReady);
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  for (const id of IDS) { await p.evaluate((id) => { const h = document.querySelector(`[data-vg="${id}"]`); const r = h.getBoundingClientRect(); scrollTo(0, r.top + scrollY - (innerHeight - r.height) / 2); }, id); await p.waitForTimeout(3000); }
  await p.evaluate((id) => { const h = document.querySelector(`[data-vg="${id}"]`); const r = h.getBoundingClientRect(); scrollTo(0, r.top + scrollY - (innerHeight - r.height) / 2); }, at); await p.waitForTimeout(4000);
  const pre = await state(p);
  await p.setViewportSize({ width: to, height: to < 500 ? 844 : 900 }); await p.waitForTimeout(1500);
  const s1 = await state(p); const bad = [];
  const play = s1.filter((x) => x.st === 'play'); if (play.length > 1) bad.push('two play');
  for (const x of s1) if (x.st === 'rest' && (x.run || Math.min(x.lt, x.L - x.lt) > 0.01)) bad.push(`${x.id} rest but lt ${x.lt.toFixed(2)}${x.run?' running':''}`);
  const fin = s1.filter((x) => x.st === 'finish');
  if (fin.length) { await p.waitForTimeout(Math.ceil((Math.max(...fin.map((f) => f.L - f.lt)) + 0.6) * 1000));
    const s2 = await state(p); for (const f of fin) { const r = s2.find((x) => x.id === f.id); if (r && r.st === 'finish') bad.push(`${f.id} still finishing after a loop`); else if (r && r.st === 'rest' && Math.min(r.lt, r.L - r.lt) > 0.01) bad.push(`${f.id} landed off rest ${r.lt.toFixed(2)}`); } }
  if (errs.length) bad.push('errors: ' + errs.slice(0, 3).join(' | '));
  if (bad.length) fail++;
  console.log(`${bad.length ? 'FAIL' : 'PASS'} fliprest ${from}->${to} @${at}: pre ${pre.map((x)=>x.id+':'+x.st).join(' ')} | post ${s1.map((x)=>x.id+':'+x.st+(x.run?'*':'')).join(' ')}${bad.length ? ' | ' + bad.join('; ') : ''}`);
  await ctx.close();
}
await b.close(); process.exit(fail ? 1 : 0);
