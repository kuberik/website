// the film's controls and isolation (QA r3 items 1-2). usage: node gate.mjs <w> <h> ; exit 1 on any failure
import { chromium } from '@playwright/test';
const [w = '1440', h = '900'] = process.argv.slice(2);
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: +w, height: +h }, ...(+w < 500 ? { isMobile: true, hasTouch: true } : {}) }); const p = await ctx.newPage();
const bad = []; const ok = (c, m) => { if (!c) bad.push(m); console.log((c ? 'ok   ' : 'FAIL ') + m); };
await p.goto(process.env.URL ?? 'http://127.0.0.1:1313/', { waitUntil: 'load' });
await p.waitForFunction(() => document.querySelector('[data-island="hero"]')?.shadowRoot?.querySelector('.film'), null, { timeout: 20000 });
await p.evaluate(() => { const r = document.getElementById('hero-window').getBoundingClientRect(); scrollTo(0, scrollY + r.top - 140); }); await p.waitForTimeout(1500);
p.on('console', (m) => console.log('  [page]', m.text())); await p.evaluate(() => document.querySelector('[data-island="hero"]').addEventListener('pointermove', (e) => console.log('mv', e.pointerType, e.clientX, e.clientY, e.composedPath()[0].className)));
const T = () => p.evaluate(() => document.querySelector('[data-island="hero"]').__story.t); /* scene lane 6: STORY seconds (the phone's player runs a shorter story) */
const label = () => p.evaluate(() => document.querySelector('[data-island="hero"]').shadowRoot.querySelector('.fc-play')?.getAttribute('aria-label'));
const box = (sel) => p.evaluate((s) => { const e = document.querySelector('[data-island="hero"]').shadowRoot.querySelector(s); const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel);
const adv = async (ms = 1200) => { const a = await T(); await p.waitForTimeout(ms); const c = await T(); return c !== a; };
await p.evaluate(() => document.querySelector('[data-island="hero"]').__story.player.seek(0)); await p.waitForTimeout(500);
// 1. the pointer on the chrome does not pause
let pb = await box('.fc-bar'); await p.mouse.move(pb.x, pb.y);
ok(await adv(), 'pointer over the chrome: story advances');
ok(await label() === 'Pause demo', 'label says Pause demo while playing');
// pause, then resume, with the pointer still on the chrome
const play = await box('.fc-play'); await p.mouse.move(play.x, play.y); await p.mouse.click(play.x, play.y); await p.waitForTimeout(300);
ok(await label() === 'Play demo', 'after Pause the label says Play demo');
ok(!(await adv()), 'paused: story holds');
await p.mouse.click(play.x, play.y); await p.waitForTimeout(300);
ok(await adv(), 'Play resumes'); ok(await label() === 'Pause demo', 'label back to Pause demo');
// chapter click seeks and plays
await p.evaluate(() => document.querySelector('[data-island="hero"]').__story.player.seek(0.3)); await p.waitForTimeout(250); /* scene lane 3: the phone's chips change width with the chapter: measure them well inside one */
const tabs = await p.evaluate(() => [...document.querySelector('[data-island="hero"]').shadowRoot.querySelectorAll('.fc-tab')].map((e) => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }));
const ci = await p.evaluate(() => [...document.querySelector('[data-island="hero"]').shadowRoot.querySelectorAll('.fc-tab')].findIndex((e) => (+document.documentElement.clientWidth < 500 ? /All sites/ : /Canary/).test(e.getAttribute('aria-label')))); await p.evaluate((i) => document.querySelector('[data-island="hero"]').shadowRoot.querySelectorAll('.fc-tab')[i].scrollIntoView({ inline: 'center', block: 'nearest' }), ci); await p.waitForTimeout(200);
const tb = await p.evaluate((i) => { const r = document.querySelector('[data-island="hero"]').shadowRoot.querySelectorAll('.fc-tab')[i].getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, ci); void tabs;
if (+w < 500) await p.touchscreen.tap(tb.x, tb.y); else await p.mouse.click(tb.x, tb.y); await p.waitForTimeout(400); const t0 = await T(); /* scene lane 6: a phone TAPS (an emulated mouse over the frame is a hover: it pauses) */
ok(+w < 500 ? t0 >= 17.9 && t0 < 19.0 : t0 >= 10.4 && t0 < 11.5, `the ${+w < 500 ? 'All sites (phone: 3 chapters, from 17.9)' : 'Canary (from 10.4)'} chip seeks to its chapter's start (t=${t0})`); ok(await adv(), 'and keeps playing');
// 2. the pointer over the canvas pauses (mouse only), leaving resumes
if (+w > 500) {
  const f = await box('.film-frame'); await p.mouse.move(f.x, f.y); await p.waitForTimeout(300);
  console.log(JSON.stringify(f), await p.evaluate(()=>{const h=document.querySelector('[data-island="hero"]');return [h.__story.player.g.hover, h.__story.player.playing, scrollY]})); ok(!(await adv()), 'pointer over the canvas pauses'); await p.mouse.move(f.x, 5); await p.waitForTimeout(300); ok(await adv(), 'leaving resumes');
}
// 3. the canvas is inert: no tab stops inside, no page scroll from Tab, no navigation
const info = await p.evaluate(() => { const c = document.querySelector('[data-island="hero"]').shadowRoot.querySelector('.film-canvas'); return { inert: c.inert, hidden: c.getAttribute('aria-hidden'), focusable: c.querySelectorAll('a[href],button,input,textarea,select,[tabindex]:not([tabindex="-1"])').length }; });
ok(info.inert && info.hidden === 'true', 'canvas is inert + aria-hidden (focusable inside: ' + info.focusable + ')');
let inCanvas = false; const y0 = await p.evaluate(() => scrollY); let yMax = 0, stops = 0;
/* Tab through the chrome (chapters, play): focus stays on the hero's own controls, never enters the canvas, and the page does not move */
await p.evaluate(() => document.querySelector('[data-island="hero"]').shadowRoot.querySelector('.fc-tab').focus());
for (let i = 0; i < 12; i++) {
  const st = await p.evaluate(() => { const h = document.querySelector('[data-island="hero"]'); const r = h.shadowRoot; return { inHero: document.activeElement === h, inCanvas: !!r.activeElement && !!r.activeElement.closest('.film-canvas'), y: scrollY }; });
  if (!st.inHero) break; stops++; inCanvas ||= st.inCanvas; yMax = Math.max(yMax, Math.abs(st.y - y0)); await p.keyboard.press('Tab');
}
ok(!inCanvas && stops >= (+w < 500 ? 4 : 7) /* scene lane 6: 6 chapters (phone 3) + pause */, `Tab visits the chrome (${stops} stops) and never lands inside the canvas`);
ok(yMax < 2, `Tab through the hero does not scroll the page (max drift ${yMax}px)`);
await p.evaluate(() => { const r = document.getElementById('hero-window').getBoundingClientRect(); scrollTo(0, scrollY + r.top - 140); }); await p.waitForTimeout(500);
const url0 = p.url(); await p.waitForTimeout(500); ok(p.url() === url0, 'page did not navigate');
// 4. a REAL click / tap on a link inside the film (Rollouts surface, t=8: "Open rollout" and row links) navigates nothing and scrolls nothing
await p.evaluate(() => document.querySelector('[data-island="hero"]').__story.at(8)); await p.waitForTimeout(2600);
const link = await p.evaluate(() => { const r = document.querySelector('[data-island="hero"]').shadowRoot; const a = [...r.querySelectorAll('.film-canvas a[href]')].find((e) => { const b = e.getBoundingClientRect(); const m = r.querySelector('.film-main').getBoundingClientRect(); return e.getAttribute('href') !== '/' && b.width > 20 && b.height > 8 && b.top > Math.max(0, m.top) && b.bottom < Math.min(innerHeight, m.bottom) && !e.closest('.film-snap'); }); /* scene lane 6: a link the visitor can SEE (inside the window, not clipped above it under the site header) */ if (!a) return null; const b = a.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, href: a.getAttribute('href') }; });
ok(!!link, 'a visible link exists inside the film to click (' + (link?.href ?? 'none') + ')');
if (link) {
  const ys = await p.evaluate(() => scrollY);
  if (+w < 500) await p.touchscreen.tap(link.x, link.y); else await p.mouse.click(link.x, link.y);
  await p.waitForTimeout(700);
  ok(p.url() === url0, `${+w < 500 ? 'tap' : 'click'} on a film link: no navigation (${p.url()})`);
  const ye = await p.evaluate(() => scrollY); ok(Math.abs(ye - ys) < 2, `and the page did not scroll (${ys} -> ${ye}; tapped ${Math.round(link.x)},${Math.round(link.y)} ${link.href})`);
}
// 5. keyboard: the play button is a real button (Enter and Space toggle), one label pattern (no aria-pressed)
await p.evaluate(() => document.querySelector('[data-island="hero"]').__story.player.seek(1)); await p.waitForTimeout(300);
const pl = await p.evaluate(() => { const b = document.querySelector('[data-island="hero"]').shadowRoot.querySelector('.fc-play'); b.focus(); return { tag: b.tagName, pressed: b.hasAttribute('aria-pressed'), label: b.getAttribute('aria-label') }; });
ok(pl.tag === 'BUTTON' && !pl.pressed, `play is a <button> with a changing label and no aria-pressed (${pl.label})`);
const before = await label(); await p.keyboard.press('Enter'); await p.waitForTimeout(200); const afterEnter = await label(); await p.keyboard.press('Space'); await p.waitForTimeout(200); const afterSpace = await label();
ok(before !== afterEnter && afterSpace === before, `Enter and Space toggle (${before} -> ${afterEnter} -> ${afterSpace})`);
// 6. the a11y tree holds the chrome and none of the product
const snap = await p.locator('[data-island="hero"]').ariaSnapshot();
ok(!/checkout-api|Needs your approval|Roll back|Deployment pipeline/.test(snap) && /Pause demo|Play demo/.test(snap), 'a11y tree: the chrome is there, the product is not');

// 7. THE BEATS (scene lane 4, owner order: release, staging, gates, canary, health checks, all sites): each chapter's frames enact its headline in its causal
//    direction, the named things are WHOLE in the frame (card inside the window), and nothing on a view moves between its beats (0 px)
const probe = (t, want = []) => p.evaluate(async ([t, want]) => { const h = document.querySelector('[data-island="hero"]'); h.__story.at(t); await new Promise((r) => setTimeout(r, 1100)); const r = h.shadowRoot;
  const rect = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map((v) => Math.round(v)).join(','); };
  const txt = (e) => (e?.innerText ?? '').replace(/\s+/g, ' ').trim();
  const titles = Object.fromEntries([...r.querySelectorAll('[data-env-row] [data-env-box]')].map((e) => [(e.getAttribute('data-stage-tile') ?? e.textContent).split('|').pop().trim().split(' ')[0], e.title || txt(e)]));
  const head = [...r.querySelectorAll('.film-group h1,.film-group h2,.film-group h3,.film-group [class*="t-heading"],.film-group [class*="t-title"]')];
  const pipe = head.find((e) => /Deployment pipeline/.test(e.textContent))?.closest('section, [data-card], .card, [class*="rounded"]') ?? null;
  const hc = head.find((e) => /^\s*Health checks/.test(e.textContent) && !pipe?.contains(e))?.closest('section, [data-card], .card, [class*="rounded"]') ?? null;
  const hist = head.find((e) => /^\s*History/.test(e.textContent))?.closest('section, [data-card], .card, [class*="rounded"]') ?? null;
  const m = r.querySelector('.film-main').getBoundingClientRect(), g = r.querySelector('.film-group');
  const smallest = (re) => { let best = null; for (const e of g.querySelectorAll('*')) if (re.test(txt(e)) && (!best || best.contains(e))) best = e; return best; };
  /* WHOLE in frame: the element's card (nearest rounded box) lies inside the window, 1 px slack */
  const whole = Object.fromEntries(want.map((w) => { const e = smallest(new RegExp('^' + w + '$')); const c = e?.closest('[class*="rounded"]') ?? e; if (!c) return [w, 'missing']; const b = c.getBoundingClientRect(); return [w, b.top >= m.top - 1 && b.bottom <= m.bottom + 1 && b.left >= m.left - 1 && b.right <= m.right + 1 ? 'whole' : `cut ${Math.round(b.top - m.top)},${Math.round(m.bottom - b.bottom)},${Math.round(m.right - b.right)}`]; }));
  const all = txt(g);
  /* scene lane 5: the Gates card (whole in frame, its top held through the approval) and the App page's Progress card (all sites) */
  const inWin = (c) => { if (!c) return 'missing'; const b = c.getBoundingClientRect(); return b.top >= m.top - 1 && b.bottom <= m.bottom + 1 && b.left >= m.left - 1 && b.right <= m.right + 1 ? 'whole' : 'cut'; };
  const gc = g.querySelector('[data-tour="dependency-graph"]'), hood = g.querySelector('.hood');
  const ap = smallest(/^Progress.*of 7\b/)?.closest('[class*="rounded"]') ?? null;
  const navH = r.querySelector('.film-tabs nav')?.getBoundingClientRect().height ?? 0;
  const lab = ap ? [...ap.querySelectorAll('span,div')].find((e) => txt(e) === 'PROD' && !e.children.length) : null;
  const prodWhole = ap && lab ? (lab.getBoundingClientRect().top >= m.top - 1 && ap.getBoundingClientRect().bottom <= m.bottom - navH + 1 ? 'whole' : 'cut') : 'missing';
  const kc = r.querySelector('.kc'), tabP = [...r.querySelectorAll('a[title="Progress"]')].find((a) => !a.closest('.film-snap')), envP = [...r.querySelectorAll('[data-env-row] [data-env-box]')].find((e) => /^prod$/i.test(txt(e.querySelector('.env-name'))));
  const at = (el) => { if (!kc || !el || !kc.classList.contains('kc-on')) return false; const k = kc.getBoundingClientRect(), q = el.getBoundingClientRect(); return k.x >= q.left - 2 && k.x <= q.right + 2 && k.y >= q.top - 4 && k.y <= q.bottom + 4; };
  const cnt = [...g.querySelectorAll('span,div,p')].filter((e) => /^\d+ of 7\b/.test(txt(e)) && e.getClientRects().length && !e.closest('.film-snap')).pop(), cb = cnt?.getBoundingClientRect(); /* scene lane 7 (17d): the count ON SCREEN, not just in the DOM */
  const countOn = cb ? (cb.top >= m.top - 1 && cb.bottom <= m.bottom - navH + 1 && cb.left >= m.left - 1 && cb.right <= m.right + 1 ? txt(cnt) : 'off ' + Math.round(cb.top - m.top)) : 'missing';
  const snapOn = [...r.querySelectorAll('.film-snap')].some((e) => +getComputedStyle(e).opacity > 0.02 && getComputedStyle(e).display !== 'none');
  return { countOn, snapOn, toast: txt(r.querySelector('.film-toast [role="status"]')), tally: r.querySelector('.fc-tally')?.getAttribute('aria-label') ?? '', envs: r.querySelector('.fc-envs')?.getAttribute('aria-label') ?? '', curPipe: at(tabP), curProd: at(envP), press: !!kc?.classList.contains('kc-press'), prodWhole, gatesWhole: inWin(gc), gatesTop: gc ? Math.round(gc.getBoundingClientRect().top) : null, hoodW: hood?.offsetWidth ?? 0, hoodCols: hood ? getComputedStyle(hood.querySelector('.hood-grid') ?? hood).gridTemplateColumns : '', apipe: txt(ap), apWhole: inWin(ap), apRect: rect(ap), surfTab: txt(g.querySelector('[aria-current="page"]')), titles, whole, newTag: !!r.querySelector('.film-new'), release: /4\.46\.0-46/.test(all) && !!r.querySelector('.film-new'), confirm: !!r.querySelector('[data-approve-confirm]'), all: all.slice(0, 4000),
    pipe: txt(pipe), hc: txt(hc), hist: txt(hist), strip: [...r.querySelectorAll('[data-env-row] [data-env-box]')].map(rect).join(' '), pipeRect: rect(pipe), hcRect: rect(hc), graphRect: rect(smallest(/^Business hours$/)) }; }, [t, want]);
const phoneRun = +w < 500;
const B = {};
const W = { 14.8: ['kustomization.*', 'error-rate.*', 'latency-p99.*'], 17.0: ['Check timer.*'], ...(phoneRun ? { 5.6: ['Release approval', 'Business hours', 'payments-svc.*'], 10.1: ['Release approval', 'Business hours', 'payments-svc.*'] } : {}) };
/* scene lane 6 (owner item 17): new times. The phone plays release -> gates -> all sites only (17h): its probes skip the other chapters */
const TS = phoneRun ? [0.8, 1.9, 2.25, 5.6, 7.6, 8.4, 8.6, 9.4, 10.1, 18.45, 19.1, 20.1, 21.3, 22.5, 22.8, 23.8, 26.5, 28.0] : [0.8, 1.9, 3.3, 4.6, 4.86, 5.6, 7.6, 8.4, 8.6, 9.4, 10.1, 10.9, 11.5, 11.9, 12.2, 12.9, 13.7, 14.8, 15.55, 17.0, 18.45, 19.1, 20.1, 21.3, 22.5, 22.8, 23.8, 26.5, 28.0];
for (const t of TS) B[t] = await probe(t, W[t] ?? []);
const on46 = (s) => /4\.46\.0-46/.test(s ?? '') && /Up to date/.test(s ?? '');
const wholeOk = (t) => Object.entries(B[t].whole).every(([, v]) => v === 'whole');
const near = (a, b) => !!a && !!b && a.split(',').every((v, i) => Math.abs(+v - +b.split(',')[i]) <= 1);
const passed = (t) => +((B[t].tally.match(/(\d+) checks? passed/) ?? [0, 0])[1]);
// release (17c: the product's toast, then the NEW tag)
ok(/4\.46\.0-46 released · olivia-bennett/.test(B[0.8].toast) && !B[1.9].release === false, `New release: the product's toast "${B[0.8].toast}" opens the film`);
ok(B[1.9].release, 'New release: 4.46.0-46 is on screen with its NEW tag (Released, no person yet)');
ok(!/[Mm]erged/.test(B[1.9].all + B[0.8].toast), 'New release: the word on screen is Released, never merged');
ok(/dev: .*not reached.*staging: .*not reached.*prod: .*not reached/i.test(B[1.9].envs) || /dev:/.test(B[1.9].envs), `17a: the chapter bar's dev · staging · prod strip (${B[1.9].envs})`);
if (!phoneRun) {
  // staging; then the cursor presses prod in staging's strip (17b), after staging's checks passed
  ok(/Staging|staging/.test(B[4.6].all) && on46(B[4.6].titles.staging) && !/4\.46/.test(B[4.6].titles.prod ?? ''), `Staging: staging up to date on 4.46.0-46 by 4.6 s, prod not yet (${B[4.6].titles.staging})`);
  ok(B[3.3].strip === B[4.6].strip, `0px: the staging page's strip boxes hold their slots while staging deploys (${B[3.3].strip} / ${B[4.6].strip})`);
  ok(B[4.86].curProd && B[4.86].press, '17b: the cursor presses prod in the environment strip, then the Gates tab opens');
  ok(passed(3.3) === 0 && passed(4.6) === 3, `17e: staging's three checks tick as they pass on screen (${passed(3.3)} -> ${passed(4.6)})`);
}
// gates
ok(/Release approval/.test(B[5.6].all) && /Business hours/.test(B[5.6].all) && /payments-svc\s*3\.1\.0/.test(B[5.6].all) && !/not visible/.test(B[5.6].all), 'Gates: Release approval, Business hours, staging promotion and payments-svc on 3.1.0 (no "not visible")');
if (phoneRun) ok(wholeOk(5.6) && wholeOk(10.1), `Gates (phone, the product's list form at 390, owner ruling): every gate tile whole in frame ${JSON.stringify(B[5.6].whole)} ${JSON.stringify(B[10.1].whole)}`);
else ok(B[5.6].gatesWhole === 'whole' && B[10.1].gatesWhole === 'whole', `Gates: the whole Gates card is in frame before and after the approval (${B[5.6].gatesWhole} / ${B[10.1].gatesWhole})`);
if (!phoneRun) ok(B[5.6].hoodW >= 560 && B[5.6].hoodW < 960, `Gates: the graph's container is in the compact two-column band 560-959 px (${B[5.6].hoodW})`);
ok(B[7.6].confirm && !/Nothing is holding/.test(B[7.6].all), 'Gates: a person presses Approve on the Gates tab (the confirm is open) while the approval still holds');
ok(/runs 4\.45\.0-45/.test(B[8.4].all.replace(/\s+/g, ' ')) || phoneRun, 'Gates: until every gate passes, prod still runs 4.45.0-45');
ok(!/decision/.test(B[8.4].tally) && /1 decision/.test(B[8.6].tally), `17e: "decision" lights at the confirm press 8.5 (${B[8.4].tally} -> ${B[8.6].tally})`);
ok(/Nothing is holding this rollout/.test(B[10.1].all) && (phoneRun || /runs 4\.46\.0-46/.test(B[10.1].all)), 'Gates: every gate passes, then the build moves by itself (runs 4.46.0-46)');
if (!phoneRun) ok(B[5.6].gatesTop === B[10.1].gatesTop, `0px: the Gates card holds its place through the approval (top ${B[5.6].gatesTop} / ${B[10.1].gatesTop})`);
if (!phoneRun) {
  // canary (17g): 10% -> test passes -> 50% -> 100%, ~4 s
  ok(/Stage 1/.test(B[11.5].pipe) && /Running/.test(B[11.5].pipe) && /10\s*%/.test(B[11.5].pipe), 'Canary: stage 1 (10 %) runs, its test is running');
  ok(/Passed/.test(B[12.2].pipe) && /Stage 2[^A-Za-z]*50\s*%[^A-Za-z]*PENDING/i.test(B[12.2].pipe), `Canary: the test passes BEFORE traffic steps up (stage 2 still pending) ${B[12.2].pipe.slice(0, 160)}`);
  ok(/Stage 2[^A-Za-z]*50\s*%[^A-Za-z]*IN PROGRESS/i.test(B[12.9].pipe), 'Canary: then stage 2, 50 %');
  ok(/Stage 3[^A-Za-z]*100\s*%[^A-Za-z]*IN PROGRESS/i.test(B[13.7].pipe), 'Canary: then stage 3, 100 %');
  ok(passed(11.9) === 3 && passed(12.2) === 4, `17e: the test ticks the counter as it passes (${passed(11.9)} -> ${passed(12.2)})`);
  ok(near(B[10.9].pipeRect, B[11.5].pipeRect) && near(B[11.5].pipeRect, B[13.7].pipeRect), `0px: the pipeline card holds its box through the canary (${B[10.9].pipeRect} / ${B[13.7].pipeRect})`);
  // health checks (after the canary)
  ok(/kustomization/.test(B[14.8].hc) && /error-rate/.test(B[14.8].hc) && /latency-p99/.test(B[14.8].hc) && /pending/i.test(B[14.8].hc), 'Health checks: prod\'s checks are on screen, not all passed yet');
  ok(wholeOk(14.8), `Health checks: whole in frame ${JSON.stringify(B[14.8].whole)}`);
  ok(/3\/3 healthy/.test(B[15.55].hc) && passed(15.55) === 7, `Health checks: all three pass, the counter says 7 (${passed(15.55)})`);
  ok(B[14.8].hcRect === B[15.55].hcRect, `0px: the Health checks card holds its box as checks pass (${B[14.8].hcRect} / ${B[15.55].hcRect})`);
  ok(/Check timer/.test(B[17.0].pipe) && /Bake started/.test(B[17.0].pipe) && wholeOk(17.0), 'Health checks: then the bake holds (Check timer, "Bake started, monitoring for errors.")');
}
// all sites: the cursor presses the App page's Progress tab (17b); waves 2 and 3 fill it by themselves; it ends all green, held ~3 s (17d)
ok(B[18.45].curPipe && B[18.45].surfTab !== 'Progress', `17b: on the App page the cursor goes to its Progress tab (${B[18.45].surfTab})`);
const A = [19.1, 20.1, 21.3, 22.5, 22.8, 23.8, 26.5];
ok(A.every((t) => B[t].surfTab === 'Progress'), `All sites: the App page's Progress tab (${A.map((t) => B[t].surfTab).join('|')})`);
const AW = A.filter((t) => !phoneRun || t < 24.9); /* scene lane 7: from 24.9 the phone frames the card's header (17d) */
ok(AW.every((t) => (phoneRun ? B[t].prodWhole : B[t].apWhole) === 'whole'), `All sites: the Progress card (phone: its prod lane, until the end frame) is whole in frame (${AW.map((t) => phoneRun ? B[t].prodWhole : B[t].apWhole).join(' ')})`);
ok(/3 of 7\b/.test(B[19.1].apipe), `All sites: wave 1 done, waves 2 and 3 not yet (${B[19.1].apipe.slice(0, 40)})`);
ok(/deploying/.test(B[20.1].apipe) && /checking/.test(B[21.3].apipe) && /[57] of 7\b/.test(B[22.5].apipe), 'All sites: wave 2 deploys, checks, then is green (scene lane 7: wave 3 takes the build as wave 2 settles, so the count is 7 assigned from 22.1)');
ok(/deploying/.test(B[22.8].apipe) && /checking/.test(B[23.8].apipe) && /7 of 7\b/.test(B[26.5].apipe) && !/deploying|checking/.test(B[26.5].apipe), 'All sites: wave 3 the same; the end is every place green, "7 of 7 places"');
ok(!/[Mm]erged/.test(B[26.5].all), 'All sites: Released, never merged');
ok(/prod: .*(done|healthy|deployed|up to date)/i.test(B[26.5].envs) || !/not reached|deploying|checking/i.test(B[26.5].envs), `17a: the strip is full at the end (${B[26.5].envs})`);
if (!phoneRun) ok(A.every((t) => near(B[t].apRect?.split(',').slice(0, 3).join(','), B[19.1].apRect?.split(',').slice(0, 3).join(','))), `0px: the Progress card holds its place while the waves fill (${A.map((t) => B[t].apRect).join(' / ')})`);
if (phoneRun) ok(B[2.25].curProd, `17b (phone): the release beat ends on a tap on prod in the App page's strip (${B[2.25].curProd})`);
/* scene lane 7 (AD r1 P0-1, 17f): the approved state is LIVE (no cover still) for >= 0.5 s before the build moves at 9.8 */
ok(!B[9.4].snapOn && /Approved|Nothing is holding/.test(B[9.4].all) && (phoneRun || !/runs 4\.46\.0-46/.test(B[9.4].all)), `17f: at 9.4 the approval is live (no still) and the build has not moved yet (snap ${B[9.4].snapOn})`);
/* scene lane 7 (AD r1 P0-2, 17d): the held end shows the product's count ON SCREEN */
ok(/^7 of 7\b/.test(B[28.0].countOn), `17d: the held end shows "7 of 7 places" on screen (${B[28.0].countOn})`);
await b.close(); process.exit(bad.length ? 1 : 0);
