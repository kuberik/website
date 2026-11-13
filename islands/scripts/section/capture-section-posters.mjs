// Captures each SECTION island's static frame (its own frozen still, after the live render) at the viewports that give each of its layouts,
// in light and dark, at 1x. Writes ../static/island-poster/s-<name>-<hostWidth>-<theme>.webp and ../data/section_poster.yaml
// ({name: {v: content hash, w: [host widths]}}): section-island.html picks, by container query on the host's width, the widest poster not wider than the host.
// usage: node scripts/section/capture-section-posters.mjs [url] [name ...]     (ImageMagick `convert` makes the webp)
import { chromium } from '/home/luka/projects/kuberik/rollout-dashboard/frontend/node_modules/@playwright/test/index.mjs';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
const PAGE = process.argv[2] ?? 'http://192.168.1.102:1340/';
/* per island: the viewports whose host widths cover every layout the product takes in that slot (gates: the list at phone padding, at sm padding, the compact graph) */
const ISLANDS = { 'gates-card': [390, 646, 682, 1440, 1920, 2560] };
const only = process.argv.slice(3);
const OUT = new URL('../../../static/island-poster/', import.meta.url).pathname;
const DATA = new URL('../../../data/section_poster.yaml', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const data = {};
if (existsSync(DATA)) for (const m of readFileSync(DATA, 'utf8').matchAll(/^([\w-]+): \{ v: "?(\w+)"?, w: \[([\d, ]*)\] \}$/gm)) data[m[1]] = { v: m[2], w: m[3].split(',').map(Number) };
for (const [name, vws] of Object.entries(ISLANDS)) {
	if (only.length && !only.includes(name)) continue;
	for (const f of readdirSync(OUT).filter((f) => f.startsWith(`s-${name}-`))) execFileSync('rm', [OUT + f]); /* a width the layout no longer takes leaves no stale poster */
	const widths = new Set();
	for (const theme of ['light', 'dark']) for (const vw of vws) for (let attempt = 0; attempt < 3; attempt++) try {
		const ctx = await b.newContext({ viewport: { width: vw, height: 1000 }, deviceScaleFactor: 1, colorScheme: theme, ...(vw < 500 ? { isMobile: true, hasTouch: true } : {}) });
		await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} }, theme);
		const p = await ctx.newPage();
		await p.goto(PAGE + '?capture=1', { waitUntil: 'load' });
		await p.evaluate((n) => document.querySelector(`[data-island="${n}"]`).scrollIntoView({ block: 'center' }), name);
		await p.waitForFunction((n) => { const h = document.querySelector(`[data-island="${n}"]`); return h?.__section?.stills > 0 && !h.querySelector('.ph-poster'); }, name, { timeout: 30000 });
		await p.waitForTimeout(700); /* the poster's 200 ms fade, the first still's fonts */
		const w = await p.evaluate((n) => Math.round(document.querySelector(`[data-island="${n}"]`).getBoundingClientRect().width), name);
		const png = `${OUT}s-${name}-${w}-${theme}.png`;
		await p.locator(`[data-island="${name}"]`).screenshot({ path: png });
		execFileSync('convert', [png, '-quality', '80', '-define', 'webp:method=6', png.replace('.png', '.webp')]);
		execFileSync('rm', [png]);
		widths.add(w);
		console.log(name, theme, vw, '->', w);
		await ctx.close();
		break;
	} catch (e) { console.log('retry', name, theme, vw, String(e).slice(0, 100)); }
	const h = createHash('sha256');
	for (const f of readdirSync(OUT).filter((f) => f.startsWith(`s-${name}-`) && f.endsWith('.webp')).sort()) h.update(readFileSync(OUT + f));
	data[name] = { v: h.digest('hex').slice(0, 12), w: [...widths].sort((a, b) => a - b) };
}
await b.close();
writeFileSync(DATA, `# written by islands/scripts/section/capture-section-posters.mjs: per section island, its posters' content hash (their ?v) and host widths\n` + Object.entries(data).map(([n, d]) => `${n}: { v: "${d.v}", w: [${d.w.join(', ')}] }`).join('\n') + '\n');
