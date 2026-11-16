// Renders the site's brand images from the logo and the landing:
//   static/apple-touch-icon.png         180x180, opaque (iOS fills transparency with black)
//   static/android-chrome-192x192.png   192x192, transparent ("any" purpose in site.webmanifest)
//   static/android-chrome-512x512.png   512x512, transparent
//   static/android-chrome-maskable-512x512.png  512x512, opaque, logo inside the maskable safe zone
//   static/images/og/kuberik.png        1200x630, the default link-preview card (og-card.html)
// The icons come from static/logo-dark.svg (its gear rotation removed). The card shows the landing hero's product
// window, captured from a running copy of the site.
//
// Usage (Playwright is not a site dependency; point PLAYWRIGHT at any install of it):
//   serve a build of the site, then
//   PLAYWRIGHT=/path/to/node_modules/playwright node scripts/brand/render.mjs <site url>
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const site = process.argv[2];
if (!site) { console.error('usage: node scripts/brand/render.mjs <site url>'); process.exit(2); }
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');

const GROUND = '#0e1619'; // dark --page (assets/css/tokens.css), the dashboard's dark ground
const logo = readFileSync(join(root, 'static/logo-dark.svg'), 'utf8')
  .replace(/<\?xml[^>]*\?>/, '')
  .replace(/<animateTransform[^>]*\/>/g, '');

const browser = await chromium.launch();

// one icon: the logo, `scale` of the canvas height, centred, on `bg` (or transparent)
async function icon(out, size, scale, bg) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  const h = Math.round(size * scale);
  await page.setContent(`<html><body style="margin:0;background:${bg || 'transparent'}">
    <div style="width:${size}px;height:${size}px;display:grid;place-items:center">
    ${logo.replace('<svg ', `<svg style="height:${h}px;width:auto;display:block" `)}</div></body></html>`);
  await page.screenshot({ path: join(root, out), omitBackground: !bg });
  await page.close();
  console.log('wrote', out);
}
await icon('static/apple-touch-icon.png', 180, 0.68, GROUND);
await icon('static/android-chrome-192x192.png', 192, 0.86);
await icon('static/android-chrome-512x512.png', 512, 0.86);
await icon('static/android-chrome-maskable-512x512.png', 512, 0.68, GROUND); // farthest logo pixel ~0.33 of the width, inside the 0.40 safe-zone radius

// site.webmanifest: each icon URL carries the file's hash (as favicons.html does for the <link> tags), so a phone
// that cached an older icon fetches the new one; check-previews.mjs fails when a hash is stale
{
  const mf = join(root, 'static/site.webmanifest');
  const m = JSON.parse(readFileSync(mf, 'utf8'));
  for (const i of m.icons) {
    const path = i.src.split('?')[0];
    i.src = `${path}?v=${createHash('md5').update(readFileSync(join(root, 'static', path))).digest('hex').slice(0, 8)}`;
  }
  writeFileSync(mf, JSON.stringify(m, null, 2) + '\n');
  console.log('wrote static/site.webmanifest');
}

// the card: capture the hero's product window at 2x, then lay out og-card.html around it
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2, colorScheme: 'light', reducedMotion: 'reduce' });
await ctx.addInitScript(() => { try { localStorage.setItem('color-theme', 'light'); } catch (e) {} });
const hero = await ctx.newPage();
await hero.goto(site, { waitUntil: 'load' });
await hero.waitForTimeout(3000);
const win = await hero.locator('.hero-window').screenshot();
await ctx.close();

const card = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const font = pathToFileURL(join(root, 'static/islands/fonts/inter-latin-opsz.woff2')).href;
const html = readFileSync(join(here, 'og-card.html'), 'utf8')
  .replace('__FONT__', font)
  .replace('__LOGO__', logo)
  .replace('__WINDOW__', 'data:image/png;base64,' + win.toString('base64'));
await card.goto(pathToFileURL(join(here, 'og-card.html')).href); // file: origin, so the font URL may load
await card.setContent(html, { waitUntil: 'load' });
await card.evaluate(() => document.fonts.ready);
mkdirSync(join(root, 'static/images/og'), { recursive: true });
await card.screenshot({ path: join(root, 'static/images/og/kuberik.png') });
console.log('wrote static/images/og/kuberik.png');
await browser.close();
