// nojs.mjs <name> <vw> <theme> <out.png>: the section island's slot with JavaScript off (the poster alone)
import { chromium } from '@playwright/test';
const [name, vw, theme, out] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +vw, height: 900 }, javaScriptEnabled: false, colorScheme: theme });
await p.goto(process.env.URL ?? 'http://192.168.1.102:1340/', { waitUntil: 'load' });
/* the theme class is set by the site's script, which is off: set it as the script would */
await p.evaluate((t) => document.documentElement.classList.toggle('dark', t === 'dark'), theme).catch(() => {});
await p.locator(`[data-island="${name}"]`).scrollIntoViewIfNeeded();
await p.waitForTimeout(500);
await p.locator(`[data-island="${name}"]`).screenshot({ path: out });
await b.close();
