// Captures each SECTION island's static frame (its own frozen rest still, after the live render) at every host width the page's grid gives it
// (DIRECTION.md §3: the 7- and 5-span islands at 1440 / 1920 / 2560, the 6+6 range, the one-column range, the phone), light and dark, at 1x, and
// measures the island's natural height there (the tallest of its stills: a calm loop holds every still in the same box).
// The host is laid out on its own bay at exactly that width, whatever the page's grid gives it today.
// Writes ../static/island-poster/s-<name>-<w>-<theme>.webp and ../data/section_poster.yaml ({name: {v: content hash, w: [widths], h: [heights]}}):
// section-island.html picks, by container query on the host's own slot, the widest poster not wider than the host and reserves that width's height
// (natural height only falls as the host widens, so the reserve is never short).
// usage: node scripts/section/capture-section-posters.mjs [url] [name ...]     (ImageMagick `convert` makes the webp)
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
const PAGE = process.argv[2] ?? 'http://192.168.1.102:1340/';
/* the island widths of DIRECTION.md §3 (card - 66): phone 326, 6+6 366-454, 5-span 425 / 525 / 724, 7-span 627 / 767 / 1047, a full row 1134 / 1374;
   one column (641-1023) takes the widest below its width. Plus the product's own breakpoints in island terms (canvas = island + 32: sm 608, md 736,
   lg 992) and the Gates card's compact graph (644), so no range between two widths straddles a change of layout */
const BASE = [326, 366, 425, 454, 525, 608, 627, 644, 724, 736, 767];
const WIDE = [...BASE, 992, 1047, 1134, 1374];
const ISLANDS = { 'gates-card': WIDE, 'health-card': BASE, 'releases-card': BASE, 'canary-card': WIDE, 'dashboard-card': WIDE, 'gitops-card': BASE };
const only = process.argv.slice(3);
const OUT = new URL('../../../static/island-poster/', import.meta.url).pathname;
const DATA = new URL('../../../data/section_poster.yaml', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const data = {};
if (existsSync(DATA)) for (const m of readFileSync(DATA, 'utf8').matchAll(/^([\w-]+): \{ v: "?(\w+)"?, w: \[([\d, ]*)\](?:, h: \[([\d, ]*)\])? \}$/gm)) data[m[1]] = { v: m[2], w: m[3].split(',').map(Number), ...(m[4] ? { h: m[4].split(',').map(Number) } : {}) };
for (const [name, widths] of Object.entries(ISLANDS)) {
	if (only.length && !only.includes(name)) continue;
	for (const f of readdirSync(OUT).filter((f) => f.startsWith(`s-${name}-`))) execFileSync('rm', [OUT + f]); /* a width no longer taken leaves no stale poster */
	const H = {};
	for (const theme of ['light', 'dark']) for (const w of widths) for (let attempt = 0; attempt < 3; attempt++) try {
		const vw = w < 400 ? 390 : w > 1300 ? 2560 : 1920;
		const ctx = await b.newContext({ viewport: { width: vw, height: 1400 }, deviceScaleFactor: 1, colorScheme: theme, reducedMotion: 'reduce' /* the rest still, no loop mid-dissolve */, ...(vw < 500 ? { isMobile: true, hasTouch: true } : {}) });
		await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} }, theme);
		const p = await ctx.newPage();
		await p.goto(PAGE + '?capture=1', { waitUntil: 'load' });
		await p.evaluate(([n, w]) => {
			const h = document.querySelector(`[data-island="${n}"]`);
			const bay = document.createElement('div');
			bay.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483000;padding:0;background:var(--page,#fff)';
			document.body.appendChild(bay); bay.appendChild(h);
			Object.assign(h.style, { width: w + 'px', maxWidth: 'none', flex: 'none', height: '200px' });
		}, [name, w]);
		await p.waitForFunction((n) => { const h = document.querySelector(`[data-island="${n}"]`); const s = h?.__section; return s?.done && !h.querySelector('.ph-poster'); }, name, { timeout: 45000 });
		const nat = await p.evaluate((n) => { const h = document.querySelector(`[data-island="${n}"]`); const s = h.__section; const t = Math.ceil(Math.max(...s.boxes.map((b) => b.height))); h.style.height = t + 'px'; s.show(s.rest); return t; }, name);
		await p.waitForTimeout(900); /* the poster's 200 ms fade, a dissolve back to the rest still, fonts */
		const png = `${OUT}s-${name}-${w}-${theme}.png`;
		await p.locator(`[data-island="${name}"]`).screenshot({ path: png });
		execFileSync('convert', [png, '-quality', '80', '-define', 'webp:method=6', png.replace('.png', '.webp')]);
		execFileSync('rm', [png]);
		if (H[w] != null && H[w] !== nat) console.log(`! ${name} ${w}: ${theme} height ${nat} differs from ${H[w]}`);
		H[w] = Math.max(H[w] ?? 0, nat);
		console.log(name, theme, w, '-> h', nat);
		await ctx.close();
		break;
	} catch (e) { console.log('retry', name, theme, w, String(e).slice(0, 160)); }
	const hash = createHash('sha256');
	for (const f of readdirSync(OUT).filter((f) => f.startsWith(`s-${name}-`) && f.endsWith('.webp')).sort()) hash.update(readFileSync(OUT + f));
	if (widths.some((w) => H[w] == null)) { console.log('! incomplete, data kept for', name); continue; }
	data[name] = { v: hash.digest('hex').slice(0, 12), w: widths, h: widths.map((w) => H[w]) };
}
await b.close();
writeFileSync(DATA, `# written by islands/scripts/section/capture-section-posters.mjs: per section island, its posters' content hash (their ?v), host widths and natural heights\n` + Object.entries(data).map(([n, d]) => `${n}: { v: "${d.v}", w: [${d.w.join(', ')}]${d.h ? `, h: [${d.h.join(', ')}]` : ''} }`).join('\n') + '\n');
