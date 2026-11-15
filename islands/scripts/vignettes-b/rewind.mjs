// rewind.mjs (v6k, after QA v6j BLOCKING): a card plays part of a cycle, is scrolled off screen, then back. Its labels must
// never go backwards (vg.js parks a card that leaves at kb.js restAbs, the next rest, never the previous one).
// Per card and play length: read the identities on screen (versions a.b.c-n, PR #n, tags vX.Y.Z) before leaving and after
// returning; FAIL if any family's highest number dropped. URL= (default :1390), VW= (1440,390), CPU= (throttle, default 1,4).
import { chromium } from '@playwright/test';
const URL = process.env.URL ?? 'http://127.0.0.1:1390/';
const IDS = (process.env.IDS ?? 'gates,canary,health,gitops,dashboard,releases,stepin').split(',');
const VWS = (process.env.VW ?? '1440,390').split(',').map(Number), CPUS = (process.env.CPU ?? '1,4').split(',').map(Number);
const PLAYS = [1300, 2600, 3900];
const fam = (txt) => { const o = {};
  for (const m of txt.matchAll(/\b(\d+)\.(\d+)\.0-(\d+)\b/g)) o.ver = Math.max(o.ver ?? 0, +m[2]);
  for (const m of txt.matchAll(/#(\d{2,4})\b/g)) o.pr = Math.max(o.pr ?? 0, +m[1]);
  for (const m of txt.matchAll(/\bv(\d+)\.(\d+)\.(\d+)\b/g)) o.tag = Math.max(o.tag ?? 0, +m[1] * 1e6 + +m[2] * 1e3 + +m[3]);
  for (const m of txt.matchAll(/\b(\d+)\.(\d+)\.0\b(?!-)/g)) o.dep = Math.max(o.dep ?? 0, +m[1] * 1e3 + +m[2]);
  return o; };
const b = await chromium.launch(); let fail = 0;
for (const VW of VWS) for (const CPU of CPUS) {
  const ctx = await b.newContext({ viewport: { width: VW, height: VW < 500 ? 844 : 900 } });
  const p = await ctx.newPage(); const errs = []; p.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && errs.push(m.text()));
  if (CPU > 1) { const c = await ctx.newCDPSession(p); await c.send('Emulation.setCPUThrottlingRate', { rate: CPU }); }
  await p.goto(URL); await p.waitForFunction(() => document.documentElement.dataset.vgReady);
  for (const ID of IDS) for (const PLAY of PLAYS) {
    const read = () => p.evaluate((id) => { const h = document.querySelector(`[data-vg="${id}"]`);
      return [...h.querySelectorAll('text')].filter((t) => { let e = t; while (e && e !== h) { if (getComputedStyle(e).opacity === '0') return false; e = e.parentElement; } return true; }).map((t) => t.textContent).join(' '); }, ID);
    const center = () => p.evaluate((id) => { const h = document.querySelector(`[data-vg="${id}"]`); const r = h.getBoundingClientRect(); scrollTo(0, r.top + scrollY - (innerHeight - r.height) / 2); }, ID);
    await center(); await p.waitForTimeout(PLAY);
    const a = fam(await read());
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500); await center(); await p.waitForTimeout(120);
    const z = fam(await read());
    const back = Object.keys(a).filter((k) => z[k] != null && z[k] < a[k]);
    if (back.length) fail++;
    console.log(`${back.length ? 'FAIL' : 'PASS'} ${ID} ${VW} cpu${CPU} play ${PLAY}: ${JSON.stringify(a)} -> ${JSON.stringify(z)}${back.length ? ' BACKWARDS ' + back : ''}`);
  }
  if (errs.length) { fail++; console.log('FAIL console', errs.slice(0, 3).join(' | ')); }
  await ctx.close();
}
await b.close(); process.exit(fail ? 1 : 0);
