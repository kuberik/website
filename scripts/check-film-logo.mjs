// Plays the landing film in a browser and checks the logo it draws matches the page theme: the light theme's
// logo has white eyes, the dark theme's keeps #181a22. Catches the film drawing the wrong variant, which no
// file check can see (both variants are in the bundle either way).
//
//   node scripts/check-film-logo.mjs public
//
// Needs playwright and a Chromium: its own, or an installed Chrome with FILM_CHECK_CHANNEL=chrome (CI uses the runner's).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve, extname, normalize } from 'node:path';
import { chromium } from 'playwright';
import { eyeFills } from './logo-eyes.mjs';

const pub = resolve(process.argv[2] || 'public');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.json': 'application/json', '.woff2': 'font/woff2', '.xml': 'application/xml' };

const server = createServer(async (req, res) => {
  let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  let f = join(pub, p);
  if (!f.startsWith(pub)) { res.writeHead(403).end(); return; }
  try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html'); res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }).end(await readFile(f)); }
  catch { res.writeHead(404).end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;

const errors = [];
// the sidebar logo the film draws: an <img> whose src is the logo SVG, inside the island's shadow root
const drawn = () => {
  const host = document.querySelector('[data-island="hero"]');
  const imgs = [...(host.shadowRoot || host).querySelectorAll('img')]
    .filter((i) => i.src.startsWith('data:image/svg+xml') && /lgradface/.test(decodeURIComponent(i.src)))
    .filter((i) => i.getBoundingClientRect().width > 0);
  return imgs.map((i) => decodeURIComponent(i.src.replace(/^data:image\/svg\+xml(;utf8)?,/, '')));
};
// the eye circles and the gear, read as check-logo.mjs reads them
const eyesOf = (svg) => { const f = eyeFills(svg); return f.length === 3 && f.every((x) => /^#(fff|ffffff)$/i.test(x)) ? 'white' : f.length === 3 && f.every((x) => /^#181a22$/i.test(x)) ? 'dark' : `mixed (${f.join(', ') || 'none'})`; };
const want = { light: 'white', dark: 'dark' };

const browser = await chromium.launch(process.env.FILM_CHECK_CHANNEL ? { channel: process.env.FILM_CHECK_CHANNEL } : {});
try {
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(`${scheme}: page error ${e}`));
    await page.goto(base, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('[data-island="hero"]')?.__story, null, { timeout: 30000 });
    // the page theme as the reader sees it, then flipped with the site's own class, as the theme toggle does
    for (const theme of [scheme, scheme === 'light' ? 'dark' : 'light']) {
      await page.evaluate((t) => { document.documentElement.classList.toggle('dark', t === 'dark'); document.documentElement.classList.toggle('light', t === 'light'); }, theme);
      for (const t of [2, 12, 22]) {
        await page.evaluate((t) => document.querySelector('[data-island="hero"]').__story.at(t), t);
        await page.waitForTimeout(300);
        const eyes = (await page.evaluate(drawn)).map(eyesOf);
        const tag = `system ${scheme}, page ${theme}, film ${t}s`;
        if (!eyes.length) errors.push(`${tag}: the film draws no logo`);
        else if (!eyes.every((e) => e === want[theme])) errors.push(`${tag}: the film's logo has ${eyes.join(', ')} eyes, want ${want[theme]}`);
        else console.log(`ok  ${tag}: ${eyes.join(', ')} eyes`);
      }
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  server.close();
}
if (errors.length) { console.error(`film logo check failed (${errors.length}):`); for (const e of errors) console.error(`  ${e}`); process.exit(1); }
console.log('film logo check ok: the film draws the logo of the page theme');
