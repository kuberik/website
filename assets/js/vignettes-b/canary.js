/* CANARY r8 (b22, review r8 S1): every card now draws at one unit (1.0 at 1440, 1.15 at >= 1920), so Canary no longer
   scales up to fill its canvas (v6k drew it at 1.08); the canvas beside Health over GitOps is ~878 tall inside at 1440. vb
   630x730 -> 630x820: the fork 88 -> 118, the wave 2 -> 3 wires 80 -> 110, margins 60 -> 75. Text, cards and pods unchanged.
   820 at 1.15 = 943 + 48 fits the 1920 (965) and 2560 (947) rows without growing them. 390 unchanged.
/* CANARY AND WAVES v6k (b20, S4): at 1440 the scene fills its tall canvas. vb 630x560 -> 630x730 (the canvas beside Health +
   GitOps is ~0.75-0.82 wide:tall; 630x560 letterboxed into it left ~195 px above and below the object). 730 is the tallest vb
   that fits every layout without growing the row: site 1920 draws the vg capped at 724 wide -> 839 tall in an 842 inner canvas.
   The object grows in scene units, not by scale (text stays the size of the other cards'): wave 1 card 440x248 -> 540x290,
   pods 46x26 -> 58x34, wave slots 200 -> 250 wide, the fork 56 -> 88, the wave 2 -> 3 wires 48 -> 80. 390 (ph) unchanged.
   Was CANARY AND WAVES v6j (b16): the loop never empties; the next release starts turning the pods over (BRIEF-V6J.md).
   After the rest hold the header's release changes to the next one (5.10: 3.1.0 -> 3.2.0, a plain value change in the chip);
   wave 1 starts it (5.36: baked -> deploying, the test back to waiting, the bake bar clears; 5.50: 100 % -> 0 % and the ten
   pods, now the current release, turn back to the resting pod in a 25 ms stagger); wave 2 goes back to waiting for it (5.80:
   the fork goes quiet, eu-west-1 / us-east-2 return to their dashed slots). Then the cycle plays as v6i. The release advances
   by S.label every cycle. Loop 6.2, rest 4.6 (as v6i; the 0.8 s exit to an empty canvas is gone).
   Was CANARY AND WAVES v6i (b15 fix 4: wave 1's deploying mark lifted in dark, as wave 2's). Was v6g (climax audit: the baked beat lights the card edge and releases wave 2 on the same beat; work/climax-audit.md). Was v6f (b-r5 fixes 6, 8: the wave 2 spinner reads in dark; the first pod turns at 0.3). Was v6e: no fan-open (copy audit). The card and its ten pods are there from the first frame; the pods turn over
   in batches with the traffic steps (1 at 10 %, 4 at 50 %, 5 at 100 %) and the % is a plain value change; wave 2 and 3 sit
   below the card, wave 2's regions still spring in sideways once wave 1 is baked. Was: CANARY AND WAVES v6 (kit v6; v4's composition, materials and timing, polished). One card fans out (Railway Block 3 "Grow big").
   Claim: "Each region waits for the one before it to bake." The payments-svc 3.1.0 card for prod us-east-1 (wave 1) fans open
   into its pods; traffic steps 10 -> 50 -> 100 % (the pods turn over in batches as solid fills, the counter rolls), the canary
   test runs and passes between the first two steps, the pods turn teal, a short bake fills, the region is baked. The card
   collapses (150 ms) and only then does wave 2 fan out sideways: eu-west-1 and us-east-2 spring in and start deploying.
   v6: the card spans wave 2's two slots, so fanned out it covers them whole (no ghost peeking, no text under text); the
   wave 2 slots leave before their regions spring in; page shadow; one dark surface system; resolved hold 1.4 s.
   Loop 6.2 s, rest 4.6. */
VG.def('canary', {
  loop: 6.2, rest: 4.6, vb: (ph) => (ph ? [326, 440] : [630, 820]),
  label: 'payments-svc 3.1.0 canary in prod us-east-1: traffic 10, 50, 100 percent, test passed, baked; then wave 2 regions start deploying',
  build(svg, id, ph) {
    const { el, w } = VG;
    const LOOP = 6.2;
    // v6j: the next release (see the header)
    // r9 S1 (b24): the seam in the headline's order. Wave 2 goes back to waiting FIRST (W2 5.10, done by 5.30); then ONE beat
    // (T0 5.36) turns wave 1 over to the next release: everything of the old release leaves in 70 ms (the chip, baked, 100 %,
    // passed, the bake bar) and the new state arrives in the next 80 ms (the next version, deploying, 0 %, the test waiting).
    // v6k bumped the version at 5.10, so 3.2.0 read 'baked, 100 %, passed' for 260 ms while wave 2 still deployed till 5.80.
    const T0 = 5.36, NX = T0, WR = T0, PP = T0 + 0.07, W2 = 5.10;
    const out = (t) => w(t, T0, T0 + 0.07, 'in'), inn = (t) => w(t, T0 + 0.07, T0 + 0.15, 'out');
    const RV = (n) => `3.${1 + n}.0`;
    const back = (t) => w(t, WR, WR + 0.15); // wave 1 back to deploying
    const [W, H] = ph ? [326, 440] : [630, 820];
    const S = KB.stage(svg, W, H, LOOP);
    KB.defs(svg, id);
    const base = S.base;
    const tt = (fn) => fn; // v6j: no exit; every track hands its end state to t 0 itself
    // v6e: the card is whole from the first frame (no fan-open, no collapse: copy audit, Railway Block 3); wave 2 and 3 sit below it
    const C = ph ? { x: 12, y: 12, w: 302 } : { x: 45, y: 75, w: 540 };
    const HC = 88, HE = ph ? 228 : 290;
    const y2 = C.y + HE + (ph ? 40 : 118), y3 = y2 + 76 + (ph ? 36 : 110), h3 = ph ? 40 : 76;
    const slot = (y, h) => (ph ? [{ x: 12, y, w: 145, h }, { x: 169, y, w: 145, h }] : [{ x: 45, y, w: 250, h }, { x: 335, y, w: 250, h }]);
    const E2 = slot(y2, 76).map((e, i) => ({ ...e, n: ['eu-west-1', 'us-east-2'][i] }));
    const E3 = slot(y3, h3).map((e, i) => ({ ...e, n: ['eu-central-1', 'ap-south-1'][i] }));
    // ---- the places not reached yet: dashed slots; wave 2's leave just before their regions spring in
    const ghost = (p, e, wave) => {
      el('rect', { x: e.x + 0.5, y: e.y + 0.5, width: e.w - 1, height: e.h - 1, rx: 7.5, class: 'c-slot nsl', 'stroke-width': 1 }, p);
      const ny = e.h < 60 ? e.y + e.h / 2 + 4.5 : e.y + 27;
      KB.text(p, e.x + 12, ny, e.n, 'label').setAttribute('class', 'subtle');
      KB.markOne(p, e.x + e.w - 20, ny - 4.5, 'wait');
      if (e.h >= 60) KB.text(p, e.x + 12, e.y + 58.5, wave, 'meta').setAttribute('class', 'subtle');
    };
    E3.forEach((e) => ghost(base, e, 'wave 3'));
    // wave 2 -> wave 3 wires (quiet)
    E2.forEach((e, i) => KB.path(base, `M${e.x + e.w / 2} ${e.y + e.h}V${E3[i].y - 8}`, 'w-q', VG.chevronDown(e.x + e.w / 2, E3[i].y - 8)));
    E2.forEach((e) => ghost(S.sprite({ x: e.x, y: e.y, w: e.w, h: e.h, track: (t) => ({ o: t >= W2 ? w(t, W2 + 0.05, W2 + 0.2, 'out') : 1 - w(t, 3.40, 3.53, 'in') }) }).g, e, 'wave 2'));
    // ---- the fork (drawn when wave 2 moves)
    const fx = C.x + C.w / 2, fy = C.y + HE;
    const fk = (t) => w(t, 3.27, 3.52);
    // v6j: the fork goes quiet (200 ms) as wave 2 goes back to waiting; its reveal empties once it is out
    const fq = S.sprite({ x: 0, y: 0, w: W, h: H, track: (t) => ({ o: 1 - w(t, W2 - 0.05, W2 + 0.15, 'io') }) });
    const fork = KB.reveal(S, { x: C.x, y: fy, w: C.w, h: y2 - fy }, (t) => (t >= W2 + 0.15 ? 0 : fk(t)), { axis: 'y', parent: fq });
    E2.forEach((e) => KB.path(fork.g, VG.elbowV(fx, fy, e.x + e.w / 2, e.y - 8, e.y - (ph ? 22 : 30)), 'w-lit', VG.chevronDown(e.x + e.w / 2, e.y - 8)));
    // ---- wave 2 regions (spring out sideways from the fork, the outer one 80 ms later)
    E2.forEach((e, i) => {
      const a = 3.48 + i * 0.08, s = (t) => w(t, a, a + 0.27, 'spring');
      // v6j: back to its waiting slot in place (150 ms ease-in over the slot's fade-in); hidden, it returns to the fork
      const sprung = (t) => ({ x: (fx - (e.x + e.w / 2)) * (1 - s(t)), y: -40 * (1 - s(t)), s: 0.9 + 0.1 * s(t) });
      const g = S.sprite({ x: e.x, y: e.y, w: e.w, h: e.h, origin: [e.x + e.w / 2, e.y], track: (t) => (t >= W2 + 0.15 ? { o: 0, ...sprung(0) } : { o: w(t, a, a + 0.1, 'out') * (1 - w(t, W2, W2 + 0.15, 'in')), ...sprung(t) }) });
      KB.card(g.g, id, { ...e, r: 8 });
      KB.text(g.g, e.x + 12, e.y + 27, e.n, 'label');
      KB.chip(g.g, e.x + 12, e.y + 44, 'PROD', 'prod', { caps: true });
      KB.text(g.g, e.x + 64, e.y + 58.5, 'deploying', 'meta');
      // v6f (b-r5 fix 6): dark lifts this mark (kb.css .w2): the act tint disc on the page card was 1.07:1
      g.div.classList.add('w2');
      KB.mark(S, e.x + e.w - 20, e.y + 22, ['act'], () => ({ act: 1 }), { parent: g, loop: LOOP });
    });
    // ---- the wave 1 card (the thesis tile), whole from the first frame
    KB.card(base, id, { ...C, h: HE, tone: 'fig' });
    const body = { g: S.stat() };
    const B = C.y + HC;
    KB.divider(body.g, C.x, C.x + C.w, B - 1);
    // the fanned-out content (inside the body's window)
    const cx0 = C.x + (ph ? 16 : 20);
    // v6d: a plain whole-value change in kit timing (owner ruling 2026-11-14: no rolling counters). The step's first half
    // fades the old value out (lifting 3 px), the second half fades the new one in (settling from 3 px below); no clip, no roll.
    const swap = (x, y, vals, idx, { parent = null, w: bw = 100 } = {}) => vals.forEach((v, j) => {
      const sp = S.sprite({ x: x - 4, y: y - 26, w: bw + 8, h: 34, parent, track: (t) => { const d = j - idx(t); if (Math.abs(d) >= 0.5) return { o: 0 }; return { o: 1 - 2 * Math.abs(d), y: 6 * d }; } });
      KB.text(sp.g, x, y, v, 'num');
    });
    // v6j: the next release starts at 0 % (a fifth value, so 100 % -> 0 % is one change, never a count down)
    swap(cx0, B + (ph ? 46 : 62), ['0%', '10%', '50%', '100%', '0%'], tt((t) => w(t, 0.3, 0.5) + w(t, 1.55, 1.75) + w(t, 1.95, 2.15) + w(t, T0, T0 + 0.14, 'lin')), { w: 100 });
    KB.text(body.g, cx0, B + (ph ? 68 : 84), 'traffic', 'meta');
    const PW = ph ? 30 : 58, PH = ph ? 22 : 34, PG = ph ? 6 : 8, px0 = C.x + C.w - (ph ? 16 : 20) - (5 * PW + 4 * PG), py0 = B + (ph ? 18 : 22);
    // v6f (b-r5 fix 8): the first step (pod 1, 0 -> 10 %) starts at 0.3, 150 ms after the card's fade-in ends (was 0.65):
    // the loop seam no longer holds ~1.1 s of nothing (exit ends 5.7, the card is back at 0.15 and moves at 0.3)
    // the order pods turn over: 1 (10 %), then 4 (50 %), then 5 (100 %): column-major from the left
    const order = [0, 5, 1, 6, 2, 7, 3, 8, 4, 9];
    const stepAt = (k) => (k < 1 ? 0.3 : k < 5 ? 1.55 + (k - 1) * 0.04 : 1.95 + (k - 5) * 0.04);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) {
      const x = px0 + c * (PW + PG), y = py0 + r * (PH + PG), k = order.indexOf(r * 5 + c);
      const turn = (t) => w(t, stepAt(k), stepAt(k) + 0.13), fresh = (t) => w(t, 2.35 + k * 0.025, 2.5 + k * 0.025);
      // v6j: when the next release starts these pods ARE the current release: back to the resting pod (150 ms, 25 ms stagger)
      const cur = (t) => w(t, PP + k * 0.025, PP + 0.15 + k * 0.025);
      const wts = { old: (t) => (t >= PP ? cur(t) : 1 - turn(t)), act: (t) => turn(t) * (1 - fresh(t)), new: (t) => (t >= PP ? 1 - cur(t) : fresh(t)) };
      for (const sname of ['old', 'act', 'new']) {
        const sp = S.sprite({ x: x - 1, y: y - 1, w: PW + 2, h: PH + 2, track: tt((t) => ({ o: wts[sname](t) })) });
        el('rect', { x: x + 0.5, y: y + 0.5, width: PW - 1, height: PH - 1, rx: 3, class: `pod-${sname} nsl`, 'stroke-width': 1 }, sp.g);
      }
    }
    // the canary test, between 10 % and 50 %
    const TY = B + (ph ? 100 : 138);
    const run = (t) => w(t, 0.9, 1.05), pass = (t) => w(t, 1.3, 1.5);
    KB.mark(S, cx0 + 6, TY, ['wait', 'prog', 'rest'], (t) => (t >= WR ? { wait: back(t), prog: 0, rest: 1 - back(t) } : { wait: 1 - run(t), prog: run(t) * (1 - pass(t)), rest: pass(t) }), {});
    KB.text(body.g, cx0 + 22, TY + 4.5, 'Canary test', 'label');
    const rx = C.x + C.w - (ph ? 16 : 20);
    KB.text(S.sprite({ x: rx - 80, y: TY - 10, w: 80, h: 20, track: tt((t) => ({ o: run(t) * (1 - pass(t)) })) }).g, rx, TY + 4.5, 'running', 'meta', 'end');
    KB.text(S.sprite({ x: rx - 80, y: TY - 10, w: 80, h: 20, track: (t) => ({ o: pass(t) * (1 - out(t)) }) }).g, rx, TY + 4.5, 'passed', 'meta', 'end');
    // deployed -> bake (the fill is the claim, 700 ms) -> baked
    const KY = B + (ph ? 124 : 170);
    const dep = (t) => w(t, 2.35, 2.55), bake = (t) => w(t, 2.45, 3.15, 'lin'), baked = (t) => w(t, 3.15, 3.35);
    el('path', { d: `M${cx0} ${KY}H${rx}`, class: 't-rail nsl', 'stroke-width': 1 }, body.g);
    const kb = { x: cx0 - 2, y: KY - 3, w: rx - cx0 + 4, h: 6 };
    // v6j: the bar clears (200 ms) as wave 1 starts the next release; its reveal empties once it is out
    const bq = S.sprite({ x: 0, y: 0, w: W, h: H, track: (t) => ({ o: 1 - out(t) }) });
    const fill = KB.reveal(S, kb, (t) => (t >= T0 + 0.07 ? 0 : bake(t)), { parent: bq });
    for (const [cls, o] of [['t-prog', (t) => 1 - baked(t)], ['t-teal', baked]]) {
      const sp = S.sprite({ ...kb, parent: fill, track: tt((t) => ({ o: o(t) })) });
      el('path', { d: `M${cx0} ${KY}H${rx}`, class: cls, 'stroke-width': 2, 'stroke-linecap': 'round' }, sp.g);
    }
    // ---- the header (over the cap): payments-svc 3.1.0, wave 1, PROD us-east-1 and its state
    const hd = S.stat();
    KB.text(hd, C.x + 16, C.y + 29, 'payments-svc', 'title');
    // v6j: the chip stays; its release changes in it (out 70 ms lifting 3 px, in 70 ms settling). A shows it from the hand-over
    // HV (an instant swap of identical text while nothing moves) to NX, B from NX through the seam to HV; relabelled hidden
    const hc = KB.chip(hd, C.x + 124, C.y + 14, RV(0), 'n', { mono: true }); hc.t.textContent = '';
    const HV = 2.0;
    const rvText = (sp) => { const g = el('g', { class: 'c-n' }, sp.g); const n = el('text', { x: hc.x + hc.w / 2, y: C.y + 28, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 500, class: 'mono' }, g); n.textContent = RV(0); return n; };
    const rbox = { x: hc.x, y: C.y + 14, w: hc.w, h: 20 };
    const rvA = S.sprite({ ...rbox, track: (t) => (t >= HV - 0.02 && t < NX + 0.07 ? { o: 1 - w(t, NX, NX + 0.07, 'in'), y: -3 * w(t, NX, NX + 0.07, 'in') } : { o: 0 }) });
    const rvB = S.sprite({ ...rbox, track: (t) => (t >= NX + 0.07 || t < HV ? { o: t < HV ? 1 : w(t, NX + 0.07, NX + 0.14, 'out'), y: t < HV ? 0 : 3 * (1 - w(t, NX + 0.07, NX + 0.14, 'out')) } : { o: 0 }) });
    S.label(rvA, rvText(rvA), (k) => RV(k - 1), 1.0);
    S.label(rvB, rvText(rvB), RV, 3.0);
    KB.text(hd, C.x + C.w - 16, C.y + 28.5, 'wave 1', 'meta', 'end');
    KB.divider(hd, C.x, C.x + C.w, C.y + 47);
    KB.chip(hd, C.x + 16, C.y + 58, 'PROD', 'prod', { caps: true });
    KB.text(hd, C.x + 66, C.y + 72.5, 'us-east-1', 'label');
    const wv = { deploy: (t) => 1 - dep(t), check: (t) => dep(t) * (1 - baked(t)), done: baked };
    KB.states(S, { x: C.x + C.w - 80, y: C.y + 16, w: 16, h: 16 }, ['deploy', 'check', 'done'], (k, g) => KB.waveOne(g, C.x + C.w - 72, C.y + 24, [[k, 0, 1]]), (t) => (t >= WR ? { deploy: back(t), check: 0, done: 1 - back(t) } : { deploy: wv.deploy(t), check: wv.check(t), done: wv.done(t) }));
    // v6i (b15 fix 4): dark lifts wave 1's deploying mark like wave 2's (kb.css .w1): its act-tint disc sat darker than the mint
    // card (1.46:1, ring 1.29:1) and read as a pale hole; dark now fills it with the act hue and turns the arc white
    const w1 = S.sprite({ x: C.x + C.w - 34, y: C.y + 58, w: 20, h: 20 }); w1.div.classList.add('w1');
    KB.mark(S, C.x + C.w - 24, C.y + 68, ['act', 'prog', 'rest'], (t) => (t >= WR ? { act: back(t), prog: 0, rest: 1 - back(t) } : { act: 1 - dep(t), prog: dep(t) * (1 - baked(t)), rest: baked(t) }), { loop: LOOP, parent: w1 });
    const sx = C.x + C.w - 40;
    [['deploying', 'meta', (t) => 1 - dep(t)], ['baking', 'meta', (t) => dep(t) * (1 - baked(t))], ['baked', 'teal', baked]].forEach(([s, k, o]) => {
      // v6j: baked -> deploying as wave 1 starts the next release
      const sp = S.sprite({ x: sx - 80, y: C.y + 58, w: 80, h: 20, track: (t) => ({ o: t >= WR ? (s === 'deploying' ? inn(t) : s === 'baked' ? 1 - out(t) : 0) : o(t) }) });
      const n = KB.text(sp.g, sx, C.y + 72.5, s, 'meta', 'end'); if (k === 'teal') n.setAttribute('class', 'teal-ink');
    });
    // v6g (climax audit): the baked beat. The bar closes teal and, on the same beat, the wave 1 card's edge lights teal
    // (130 ms in, 300 ms out); the fork lights down out of the card (250 ms) and wave 2 springs in at its ends: the next
    // region starts BECAUSE this one baked, with no dead air between them (v6f: 0.27 s of nothing)
    const edge = S.sprite({ x: C.x - 2, y: C.y - 2, w: C.w + 4, h: HE + 4, track: tt((t) => ({ o: w(t, 3.15, 3.28, 'out') * (1 - w(t, 3.4, 3.7, 'in')) })) });
    el('rect', { x: C.x + 0.5, y: C.y + 0.5, width: C.w - 1, height: HE - 1, rx: 7.5, class: 'ln-teal nsl', 'stroke-width': 1.5 }, edge.g);
    return S.finish(null); // v6j: no root track: the frame never fades
  }
});
