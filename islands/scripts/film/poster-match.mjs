// The hero poster against the film's live first frame, per viewport width: the window box, the poster layer drawn there (its image, natural size,
// scale, px lost past the box), and a pixel diff of the chapter bar + window with the poster alone vs the live film at t=0.
// usage: node poster-match.mjs [url] [theme] [vw ...]   env OUT=<dir> keeps the crops (poster-<vw>-<theme>.png, live-..., diff-...); NOJS=1: the poster
// with JavaScript off (light, as a no-JS reader sees it) instead of the islands bundle blocked (the poster before the first frame, either theme).
// Pass: scale <= 1 and 0 px lost at every width; the window sits where the film does (sub-pixel offset from 1 px shifts of a 1 px blur, |x|, |y| <= 1.2 px: between a band's widths each text line of the film snaps to a whole px on its own, the downscaled raster cannot; ~0 at a band's own width)
// and, blurred, differs in < 4 % of its pixels (fuzz 10 %: a band's downscale and webp noise; ~0 % at a band's own width); the chapter bar < 3 % (fuzz 6 %:
// the centred bar's text sits at a fractional x in the film, on a whole px in the poster). The raw fuzz-6 % window diff is printed too.
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
const [URL = 'http://127.0.0.1:1313/', theme = 'light', ...ws] = process.argv.slice(2);
const VWS = ws.length ? ws.map(Number) : [320, 360, 375, 390, 641, 673, 674, 768, 1024, 1100, 1145, 1146, 1180, 1263, 1280, 1440, 1920, 2560, 3840];
const OUT = process.env.OUT ?? `${process.env.TMPDIR ?? '/tmp'}/poster-match`; mkdirSync(OUT, { recursive: true });
const NOJS = !!process.env.NOJS;
const b = await chromium.launch(); let fail = 0;
const shot = async (vw, live) => {
	const ctx = await b.newContext({ viewport: { width: vw, height: 1200 }, deviceScaleFactor: 1, colorScheme: theme, javaScriptEnabled: live || !NOJS, ...(vw < 500 ? { isMobile: true, hasTouch: true } : {}) });
	await ctx.addInitScript((t) => { try { localStorage.setItem('color-theme', t); } catch {} }, theme);
	await ctx.route(/livereload/, (r) => r.abort());
	if (!live) await ctx.route(/\/islands\/.*\.js/, (r) => r.abort()); /* the poster as it stands before the first live frame */
	const p = await ctx.newPage(); await p.goto(URL, { waitUntil: 'load' });
	if (live) {
		await p.waitForFunction(() => document.querySelector('[data-island="hero"]')?.shadowRoot?.querySelector('.film-canvas') && !document.querySelector('[data-island="hero"] .ph-poster'), null, { timeout: 30000 });
		await p.evaluate(() => document.querySelector('[data-island="hero"]').__story.at(0)); await p.waitForTimeout(2500);
	} else await p.waitForTimeout(800);
	await p.evaluate(() => { const h = document.querySelector('[data-island="hero"]'); h.scrollIntoView(); scrollBy(0, -100); });
	await p.waitForTimeout(live ? 50 : 300);
	const r = await p.evaluate(() => { const r = document.querySelector('[data-island="hero"]').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
	let info = null;
	if (!live) info = await p.evaluate(async () => {
		const w = document.querySelector('[data-island="hero"] .ph-win'); const cs = getComputedStyle(w); const urls = [...cs.backgroundImage.matchAll(/url\("([^"]+)"/g)].map((m) => m[1]);
		const body = urls[urls.length - 1]; const i = new Image(); i.src = body; await i.decode().catch(() => {});
		return { img: decodeURIComponent(body).split('/').pop().split('?')[0], nw: i.naturalWidth, nh: i.naturalHeight, layers: urls.length, size: cs.backgroundSize };
	});
	const f = `${OUT}/${live ? 'live' : 'poster'}-${vw}-${theme}.png`;
	if (live) await p.evaluate(() => document.querySelector('[data-island="hero"]').__story.player.seek(0)); /* playing from 0, shot at once (the toast is due at 0.25 s) */
	await p.screenshot({ path: f, clip: { x: r.x, y: r.y - 60, width: r.w, height: r.h + 60 } });
	await ctx.close(); return { r, info, f };
};
/* alignment: the window compared after a 1 px blur (resampling and webp noise fall under the fuzz, a 1 px offset does not) at the poster's own place and
   one px off in each direction; the poster's place must be the best match */
const blurAE = (a, c, w, h, dx, dy) => { const g = `${w - 2}x${h - 2}`; const A = `${OUT}/.a.png`, B = `${OUT}/.b.png`;
	execFileSync('convert', [a, '-crop', `${g}+1+61`, '+repage', '-blur', '0x1', A]); execFileSync('convert', [c, '-crop', `${g}+${1 + dx}+${61 + dy}`, '+repage', '-blur', '0x1', B]);
	try { return +execFileSync('compare', ['-metric', 'AE', '-fuzz', '10%', A, B, 'null:'], { stdio: ['ignore', 'pipe', 'pipe'] }).toString(); } catch (e) { return +String(e.stderr).trim().split(' ')[0]; } };
const ae = (a, c, geo) => { try { return +execFileSync('compare', ['-metric', 'AE', '-fuzz', '6%', '-extract', geo, a, c, 'null:'], { stdio: ['ignore', 'pipe', 'pipe'] }).toString(); } catch (e) { return +String(e.stderr).trim().split(' ')[0]; } };
console.log('vw   | window box | poster image (layers) | natural | scale | drawn | lost right | below box | diff window (fuzz 6 %) | window blurred (fuzz 10 %) | offset x, y | diff bar');
for (const vw of VWS) {
	const P = await shot(vw, false), L = await shot(vw, true);
	const { r, info } = P, W = r.w, H = r.h, sc = W / info.nw, dh = info.nh * sc;
	const geoWin = `${Math.round(W)}x${Math.round(H)}+0+60`, geoBar = `${Math.round(W)}x56+0+0`;
	const dw = ae(P.f, L.f, geoWin), db = ae(P.f, L.f, geoBar);
	const pw = (dw / (W * H)) * 100, pb = (db / (W * 56)) * 100;
	try { execFileSync('compare', ['-fuzz', '6%', P.f, L.f, `${OUT}/diff-${vw}-${theme}.png`], { stdio: 'ignore' }); } catch {} /* exit 1 = images differ */
	const sh = [[0, 0], [0, -1], [0, 1], [-1, 0], [1, 0]].map(([dx, dy]) => blurAE(P.f, L.f, Math.round(W), Math.round(H), dx, dy));
	/* the sub-pixel offset between poster and film from the three diffs along each axis (a parabola through them): |off| <= 0.6 px = the same place up to that per-line snapping */
	const off = (m, z, p) => { const d = m - 2 * z + p; return d > 0 ? (m - p) / (2 * d) : 0; };
	const oy = off(sh[1], sh[0], sh[2]), ox = off(sh[3], sh[0], sh[4]), pa = (sh[0] / (W * H)) * 100;
	const ok = Math.abs(ox) <= 1.2 && Math.abs(oy) <= 1.2 && pa < 4 && sc <= 1.0001 && Math.abs(W - info.nw * sc) < 0.01 && dh >= H - 0.5 && pb < 3 && Math.abs(L.r.w - W) < 0.01;
	if (!ok) fail++;
	console.log(`${ok ? 'ok  ' : 'FAIL'} ${vw} | ${W}x${H} | ${info.img} (${info.layers}) | ${info.nw}x${info.nh} | ${sc.toFixed(3)} | ${W.toFixed(0)}x${dh.toFixed(0)} | ${(info.nw * sc - W).toFixed(1)} px | ${(dh - H).toFixed(0)} px hidden | ${pw.toFixed(2)} % | ${pa.toFixed(2)} % | ${ox.toFixed(2)}, ${oy.toFixed(2)} px | ${pb.toFixed(2)} %`);
}
await b.close(); console.log(`poster-match ${theme}${NOJS ? ' nojs' : ''}: ${fail ? fail + ' FAIL' : 'all ok'}`); process.exit(fail ? 1 : 0);
