// probe.mjs <name> <vw> : rects (relative to the still) of a few elements in a section island's frozen still
import { chromium } from '@playwright/test';
const [name = 'gates-card', vw = '1440'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +vw, height: 900 } });
await p.goto(process.env.URL ?? 'http://192.168.1.102:1340/', { waitUntil: 'load' });
await p.evaluate((n) => document.querySelector(`[data-island="${n}"]`).scrollIntoView({ block: 'center' }), name);
await p.waitForFunction((n) => document.querySelector(`[data-island="${n}"]`)?.__section?.stills > 0, name, { timeout: 30000 });
const r = await p.evaluate(() => {
	const s = document.querySelector('[data-section]').shadowRoot.querySelector('.sec-still'); const o = s.getBoundingClientRect();
	const q = (sel) => [...s.querySelectorAll(sel)].slice(0, 6).map((e) => { const r = e.getBoundingClientRect(); return `${sel}${e.textContent.trim().slice(0, 18).replace(/\s+/g, ' ')}@${Math.round(r.x - o.x)},${Math.round(r.y - o.y)} ${Math.round(r.width)}x${Math.round(r.height)}`; });
	return [...q('[data-tour="dependency-graph"]'), ...q('.canvas-dots'), ...q('[data-hood-focus]'), ...q('[data-hood-link]'), ...q('h2,h3')].join('\n');
});
console.log(r);
await b.close();
