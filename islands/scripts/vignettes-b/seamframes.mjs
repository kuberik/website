// seamframes.mjs: element screenshots of one card frozen at absolute scene times (?vg-t=), for reviewing a seam frame by frame.
// usage: URL=... OUT=dir node seamframes.mjs <card> <t0> <t1> <step> [vw] [theme]
import { chromium } from '@playwright/test';
import fs from 'fs';
const [card, t0, t1, st, vw = '1440', theme = 'light'] = process.argv.slice(2);
const URL = process.env.URL ?? 'http://127.0.0.1:1391/', OUT = process.env.OUT; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: +vw, height: 900 }, colorScheme: theme })).newPage();
for (let i = 0, t = +t0; t <= +t1 + 1e-6; i++, t = +t0 + i * +st) {
  await p.goto(`${URL}?vg-t=${t.toFixed(3)}`, { waitUntil: 'load' });
  if (theme === 'dark') await p.evaluate(() => document.documentElement.classList.add('dark'));
  const h = p.locator(`[data-vg="${card}"]`).first();
  await h.scrollIntoViewIfNeeded(); await p.waitForTimeout(900);
  await h.screenshot({ path: `${OUT}/${card}-${vw}-${theme}-t${t.toFixed(2)}.png` });
}
await b.close();
