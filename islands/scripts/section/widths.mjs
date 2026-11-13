// widths.mjs [vw ...]: every section island host's box with JavaScript OFF (what a reader without JS sees: the poster alone) and ON (after it is live),
// plus the poster the container query picked with JS off and that poster's own width. Prints one row per card x viewport; MISMATCH when the JS-off host,
// the poster or the live host disagree. URL env overrides the page.
import { chromium } from '@playwright/test';
const URL_ = process.env.URL ?? 'http://192.168.1.102:1340/';
const VWS = (process.argv.slice(2).length ? process.argv.slice(2) : ['390', '1024', '1440', '1920', '2560']).map(Number);
const NAMES = ['gates-card', 'health-card', 'canary-card', 'gitops-card', 'dashboard-card', 'releases-card'];
const b = await chromium.launch();
const rows = [];
const boxes = async (p) => {
	const out = {};
	for (const n of NAMES) {
		const l = p.locator(`[data-island="${n}"]`);
		const bb = await l.boundingBox();
		const bg = await p.locator(`[data-island="${n}"] .ph-poster`).evaluate((e) => getComputedStyle(e).backgroundImage).catch(() => '?');
		out[n] = { w: bb ? +bb.width.toFixed(1) : null, h: bb ? Math.round(bb.height) : null, poster: (bg.match(/s-[\w-]+?-(\d+)-(?:light|dark)/) ?? [])[1] ?? (bg === 'none' ? 'none' : bg.slice(0, 30)) };
	}
	return out;
};
for (const vw of VWS) {
	const mob = vw < 500 ? { isMobile: true, hasTouch: true } : {};
	const c0 = await b.newContext({ viewport: { width: vw, height: 900 }, deviceScaleFactor: 1, javaScriptEnabled: false, ...mob });
	const p0 = await c0.newPage();
	await p0.goto(URL_, { waitUntil: 'load' });
	const off = await boxes(p0);
	await c0.close();
	if (process.env.OFF_ONLY) { for (const n of NAMES) rows.push(`${String(vw).padStart(4)} ${n.padEnd(15)} off ${off[n].w}x${off[n].h} poster ${off[n].poster}`); continue; }
	const c1 = await b.newContext({ viewport: { width: vw, height: 900 }, deviceScaleFactor: 1, ...mob });
	const p1 = await c1.newPage();
	await p1.goto(URL_, { waitUntil: 'load' });
	await p1.waitForFunction(() => document.querySelector('[data-island="hero"]')?.hasAttribute('data-island-ready'), null, { timeout: 30000 }).catch(() => {});
	const on = {};
	for (const n of NAMES) {
		await p1.locator(`[data-island="${n}"]`).scrollIntoViewIfNeeded();
		await p1.waitForFunction((n) => document.querySelector(`[data-island="${n}"]`)?.__section?.stills > 0, n, { timeout: 30000 }).catch(() => {});
	}
	await p1.waitForTimeout(800);
	Object.assign(on, await boxes(p1));
	await c1.close();
	for (const n of NAMES) {
		const ok = off[n].w === on[n].w && off[n].h === on[n].h && String(Math.round(off[n].w)) === off[n].poster;
		rows.push(`${String(vw).padStart(4)} ${n.padEnd(15)} off ${off[n].w}x${off[n].h} poster ${off[n].poster}  live ${on[n].w}x${on[n].h}${ok ? '' : '  MISMATCH'}`);
	}
}
console.log(rows.join('\n'));
await b.close();
