// prints the box of each feature card's visual (.fv-body) at the given viewport widths
import { chromium } from '/home/luka/projects/kuberik/rollout-dashboard/frontend/node_modules/@playwright/test/index.mjs';
const URL_ = process.env.URL ?? 'http://192.168.1.102:1340/';
const b = await chromium.launch();
for (const w of (process.argv[2] ?? '390,1440,1920,2560').split(',').map(Number)) {
	const p = await b.newPage({ viewport: { width: w, height: 1000 } });
	await p.goto(URL_, { waitUntil: 'load' });
	const r = await p.evaluate(() => [...document.querySelectorAll('.fv-card')].map((c) => { const b = c.querySelector('.fv-body')?.getBoundingClientRect(); const k = c.getBoundingClientRect(); return `${c.closest('[id]')?.id ?? '?'} card ${Math.round(k.width)}x${Math.round(k.height)} body ${Math.round(b?.width)}x${Math.round(b?.height)}`; }));
	console.log(w, r.join(' | '));
	await p.close();
}
await b.close();
