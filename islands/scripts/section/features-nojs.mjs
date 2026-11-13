// features-nojs.mjs <outdir> [vw ...]: the features section with JavaScript OFF (every island its poster alone), light and dark, one PNG per viewport x theme.
// Also prints each island host's width and the poster it shows, so a strip (host wider than its poster) is a number, not a guess.
import { chromium } from '@playwright/test';
const [out, ...vws] = process.argv.slice(2);
const b = await chromium.launch();
for (const vw of (vws.length ? vws : ['390', '1440', '1920', '2560']).map(Number)) for (const theme of ['light', 'dark']) {
	const ctx = await b.newContext({ viewport: { width: vw, height: 900 }, deviceScaleFactor: 1, javaScriptEnabled: false, colorScheme: theme, ...(vw < 500 ? { isMobile: true, hasTouch: true } : {}) });
	const p = await ctx.newPage();
	await p.goto(process.env.URL ?? 'http://192.168.1.102:1340/', { waitUntil: 'load' });
	/* the theme class is the site's script's job, which is off: set it through the DOM the way it would (CDP, not page script) */
	if (theme === 'dark') await p.locator('html').evaluate((h) => h.classList.add('dark'));
	await p.waitForTimeout(600);
	await p.locator('#features').screenshot({ path: `${out}/nojs-features-${vw}-${theme}.png` });
	const rows = await p.locator('[data-island$="-card"]').evaluateAll((hs) => hs.map((h) => { const bg = getComputedStyle(h.querySelector('.ph-poster')).backgroundImage; return `${h.dataset.island} host ${h.getBoundingClientRect().width.toFixed(1)}x${h.getBoundingClientRect().height} poster ${(bg.match(/-(\d+)-(?:light|dark)\.webp/) ?? [])[1]} ${bg.includes('-dark.') ? 'dark' : 'light'}`; }));
	console.log(vw, theme, '\n  ' + rows.join('\n  '));
	await ctx.close();
}
await b.close();
