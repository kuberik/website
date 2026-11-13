// probe-title.mjs <vw>: the Canary card's release line at that viewport: each part's text, width and whether it is cut
import { chromium } from '@playwright/test';
const vw = +(process.argv[2] ?? 390);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: vw, height: 900 }, ...(vw < 500 ? { isMobile: true, hasTouch: true } : {}) });
await p.goto(process.env.URL ?? 'http://192.168.1.102:1340/', { waitUntil: 'load' });
await p.waitForFunction(() => document.querySelector('[data-island="hero"]')?.hasAttribute('data-island-ready'), null, { timeout: 30000 }).catch(() => {});
const h = p.locator('[data-island="canary-card"]');
await h.scrollIntoViewIfNeeded();
await p.waitForFunction(() => document.querySelector('[data-island="canary-card"]')?.__section?.stills > 0, null, { timeout: 30000 }).catch(() => console.log('not live'));
await p.waitForTimeout(800);
console.log(await h.evaluate((e) => { const roots = [e, e.shadowRoot].filter(Boolean); const out = []; for (const r of roots) for (const t of r.querySelectorAll('[data-release-title],[data-release-build]')) { const line = t.parentElement; out.push(`${t.dataset.releaseTitle !== undefined ? 'title' : 'build'} "${t.textContent}" w ${t.getBoundingClientRect().width.toFixed(1)} scroll ${t.scrollWidth}`); if (t.dataset.releaseBuild !== undefined) out.push('line w ' + line.getBoundingClientRect().width.toFixed(1) + ' children ' + [...line.children].map((c) => `${c.textContent.trim().slice(0, 20)}:${c.getBoundingClientRect().width.toFixed(0)}`).join(' | ')); } return out.join('\n'); }));
await b.close();
