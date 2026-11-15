/* HEALTH CHECKS v6j (b16): the loop never empties; the next bake starts on the next region (BRIEF-V6J.md). The chart's
   footer now names the region under bake ("prod us-east-1", right of "bake 30m"). After the rest hold the next region takes
   the bake (5.15: the footer changes us-east-1 -> eu-west-1 -> ap-south-1 -> us-east-1 ..., and the chip baked -> baking);
   its chart starts empty (5.33: the band and the line clear, 200 ms); its monitors re-arm (5.55 / 5.61 / 5.67: rest dot ->
   dashed wait ring). Then the cycle plays as v6h. The release stays payments-svc 3.1.0 (it bakes region after region).
   Loop 5.8, rest 4.3 (as v6h; the 0.8 s exit to an empty canvas is gone).
   Was HEALTH CHECKS v6h (b14 fix 4: dark's resting bake band lifted: fill + a >= 3:1 edge, kb.css .band-edge). Was v6g (climax audit, work/climax-audit.md: the bake CLOSES as a beat: teal band sweeps, baked pops, the
   monitors confirm together, the card edge lights). Was HEALTH CHECKS v6 (kit v6, v4's style). Composition: a live chart (Railway Block 4's observability charts).
   Claim: "A release has to stay healthy for the whole bake." payments-svc 3.1.0 bakes in prod us-east-1: the Datadog error-rate
   line draws in real time under its 1 % threshold across the bake window (the fill is the claim), the value ticks every 300 ms,
   the three monitors (the Flux Kustomization, error-rate, latency-p99) tick from waiting to checking to healthy in bursts and stay
   healthy; the bake closes: the band turns teal, the chip reads baked. Loop 5.8 s, rest 4.3 (resolved hold 1.4 s). */
VG.def('health', {
  loop: 5.8, rest: 4.3, vb: (ph) => (ph ? [326, 350] : [430, 300]),
  label: 'payments-svc 3.1.0 bakes in prod us-east-1: error rate stays under its threshold and every monitor stays healthy for the whole bake',
  build(svg, id, ph) {
    const { el, w } = VG;
    const LOOP = 5.8;
    // v6j: the next region (see the header)
    // v6k r11 (R11-DES-1): the seam clears first, then swaps. At 5.0 the baked chart steps down to the region's trace (200 ms);
    // at 5.2, on an already quiet chart, the header's region and the chip (baked -> baking) change in one beat (was REG 5.15
    // before CLR 5.33: the header named the next region while the last region's baked chart was still drawn)
    const REG = 5.2, CLR = 5.0, MON = [5.55, 5.61, 5.67];
    const REGIONS = ['us-east-1', 'eu-west-1', 'ap-south-1'], RG = (n) => `${REGIONS[((n % 3) + 3) % 3]}`;
    const nextBake = (t) => w(t, REG, REG + 0.15);
    const [W, H] = ph ? [326, 350] : [430, 300];
    const S = KB.stage(svg, W, H, LOOP);
    KB.defs(svg, id);
    const st = S.base;
    const tt = (fn) => fn; // v6j: no exit; every track hands its end state to t 0 itself
    // v6k (S3): the card header names where it bakes, as Gates and Step in do: the PROD chip and the region (left), the release
    // (right); the region is the value that changes at the hand-over. The value row: the live stat, its metric, the bake state.
    const C = ph ? { x: 12, y: 16, w: 302, h: 318 } : { x: 22, y: 16, w: 386, h: 268 };
    KB.card(st, id, C);
    const px = C.x + (ph ? 16 : 20), rx = C.x + C.w - (ph ? 16 : 20);
    KB.chip(st, px, C.y + 14, 'PROD', 'prod', { caps: true });
    KB.text(st, rx, C.y + 28.5, 'payments-svc 3.1.0', 'meta', 'end');
    KB.divider(st, C.x, C.x + C.w, C.y + 47);
    // the region (13 px label after the chip, as Gates). A shows it from the hand-over HR (an instant swap of identical text while
    // nothing moves) to REG, B from REG through the seam to HR (out 70 ms lifting 3 px, in 70 ms settling); relabelled hidden
    const HR = 2.0, gb = { x: px + 46, y: C.y + 12, w: 100, h: 24 };
    const rgA = S.sprite({ ...gb, track: (t) => (t >= HR - 0.02 && t < REG + 0.07 ? { o: 1 - w(t, REG, REG + 0.07, 'in'), y: -3 * w(t, REG, REG + 0.07, 'in') } : { o: 0 }) });
    const rgB = S.sprite({ ...gb, track: (t) => (t >= REG + 0.07 || t < HR ? { o: t < HR ? 1 : w(t, REG + 0.07, REG + 0.14, 'out'), y: t < HR ? 0 : 3 * (1 - w(t, REG + 0.07, REG + 0.14, 'out')) } : { o: 0 }) });
    S.label(rgA, KB.text(rgA.g, px + 50, C.y + 28.5, RG(0), 'label'), (k) => RG(k - 1), 1.0);
    S.label(rgB, KB.text(rgB.g, px + 50, C.y + 28.5, RG(0), 'label'), RG, 3.0);
    // ---- the value row: the live value, its metric, the bake state at the right
    const VY = C.y + 86;
    // v6e (review b-r4 fix 5): four value changes across the bake, ~0.5 s apart, clear of the monitor bursts (not a ticker)
    const vals = ['0.20%', '0.22%', '0.19%', '0.21%', '0.20%'], TK = [1.6, 2.1, 2.6, 3.05];
    const tick = (t) => TK.reduce((k, a) => k + w(t, a, a + 0.13), 0);
    // v6d: a plain whole-value change in kit timing (owner ruling 2026-11-14: no rolling counters). The step's first half
    // fades the old value out (lifting 3 px), the second half fades the new one in (settling from 3 px below); no clip, no roll.
    const swap = (x, y, vals, idx, { parent = null, w: bw = 100 } = {}) => vals.forEach((v, j) => {
      const sp = S.sprite({ x: x - 4, y: y - 26, w: bw + 8, h: 34, parent, track: (t) => { const d = j - idx(t); if (Math.abs(d) >= 0.5) return { o: 0 }; return { o: 1 - 2 * Math.abs(d), y: 6 * d }; } });
      KB.text(sp.g, x, y, v, 'num');
    });
    swap(px, VY, vals, tt(tick), { w: 96 });
    KB.text(st, px + 97, VY, 'error-rate', 'meta');
    const bake = (t) => w(t, 0.7, 3.3, 'lin'), baked = (t) => w(t, 3.3, 3.5);
    // v6g: 'baked' arrives with a 3 % spring pop on the close beat
    const popB = (t) => (t < 3.3 ? 0.94 : 0.94 + 0.06 * w(t, 3.3, 3.54, 'spring'));
    for (const [s, tone, o] of [['baking', 'prog', (t) => 1 - baked(t)], ['baked', 'teal', baked]]) {
      const sp = S.sprite({ x: rx - 70, y: VY - 22, w: 70, h: 22, origin: [rx - 30, VY - 11], track: (t) => ({ o: t >= REG ? (tone === 'teal' ? 1 - nextBake(t) : nextBake(t)) : o(t), s: tone === 'teal' ? popB(t) : 1 }) });
      KB.chip(sp.g, rx, VY - 21, s, tone, { anchor: 'end' });
    }
    // ---- the chart: the 1 % threshold, the bake band, the line
    const X0 = px, X1 = rx, Y0 = C.y + 100, Y1 = C.y + (ph ? 168 : 172);
    const thrY = Y0 + 18; // v6k: the threshold tag clears the band's top edge (was Y0 + 14: its caps touched the dark edge)
    const box = { x: X0 - 4, y: Y0 - 4, w: X1 - X0 + 8, h: Y1 - Y0 + 8 };
    // v6j: nothing shows before the bake starts (v6h left a 4 px sliver of the line's start, which now sat 1 s on the empty chart)
    const fx = (t) => (bake(t) > 0 ? (bake(t) * (X1 - X0) + 4) / box.w : 0); // the reveal edge = the line's head
    // v6k (S2): the chart is never empty under the live stat. When the next region takes the bake the finished series dims to
    // the previous region's trace (35 %) and stays; the new series draws over it from the left and the trace gives way under
    // the head (it is what remains right of the head), gone when the bake closes.
    const ghostF = (t) => (t >= CLR || t < 0.7 ? 1 : t >= 3.3 ? 0 : Math.max(0, Math.min(1, (box.x + box.w - (X0 + bake(t) * (X1 - X0)) + 2) / box.w)));
    // v6j: the next region's chart starts empty: band and line clear (200 ms) and the reveals empty once they are out
    const cq = S.sprite({ x: 0, y: 0, w: W, h: H, track: (t) => ({ o: 1 - w(t, CLR, CLR + 0.2, 'in') }) });
    const cf = (f) => (t) => (t >= CLR + 0.2 ? 0 : f(t));
    const bandP = KB.reveal(S, box, cf(fx), { parent: cq });
    const bp = S.sprite({ ...box, parent: bandP, track: tt((t) => ({ o: 1 - w(t, 3.48, 3.62) })) });
    el('rect', { x: X0, y: Y0, width: X1 - X0, height: Y1 - Y0, rx: 2, class: 'band-prog' }, bp.g);
    // v6g (climax audit): the bake CLOSES: the teal band sweeps across the window left to right (250 ms) over the yellow
    const bt = KB.reveal(S, box, cf((t) => w(t, 3.3, 3.55, 'io')), { parent: cq });
    el('rect', { x: X0, y: Y0, width: X1 - X0, height: Y1 - Y0, rx: 2, class: 'band-teal band-bake' }, bt.g);
    // v6h (b14 fix 4): dark only, the resting (baked) band gets its edge (kb.css .band-edge, >= 3:1 on the card) and a lifted
    // fill; it sweeps in with the band. Light keeps v6g's band (the edge rect is not drawn there)
    el('rect', { x: X0 + 0.5, y: Y0 + 0.5, width: X1 - X0 - 1, height: Y1 - Y0 - 1, rx: 1.5, class: 'band-edge nsl', 'stroke-width': 1 }, bt.g);
    const ov = S.stat();
    el('path', { d: `M${X0} ${thrY}H${X1}`, class: 'ln-thr nsl' }, ov);
    KB.text(ov, X1 - 4, thrY - 5, '1% threshold', 'tag', 'end');
    el('path', { d: `M${X0} ${Y1 + 0.5}H${X1}`, class: 't-rail nsl', 'stroke-width': 1 }, ov);
    KB.text(ov, X0, Y1 + 16, 'bake 30m', 'tag');
    // v6k (dark band nit, with b19 / Step in): the bake's progress is carried by the axis itself, a 3 px bar hung under the axis (on the axis the rail and the area wash sat over it: #a8a95a, mustard) in the product's
    // baking solid (--b-prog-fill) that fills with the head and turns teal when the bake closes (as Canary's bake bar); the band
    // behind the window stays quiet (dark: the card's neutral lift, no yellow wash, kb.css)
    const ab = { x: X0 - 2, y: Y1 - 1, w: X1 - X0 + 4, h: 7 };
    const axq = S.sprite({ x: 0, y: 0, w: W, h: H, parent: cq });
    const axb = KB.reveal(S, ab, cf((t) => (bake(t) > 0 ? (bake(t) * (X1 - X0) + 2) / ab.w : 0)), { parent: axq });
    for (const [cls, o] of [['t-prog', (t) => 1 - baked(t)], ['t-teal', baked]]) {
      const sp = S.sprite({ ...ab, parent: axb, track: tt((t) => ({ o: o(t) })) });
      el('path', { d: `M${X0} ${Y1 + 2.5}H${X1}`, class: `${cls} nsl`, 'stroke-width': 3 }, sp.g);
    }
    // samples: low and calm, well under the threshold (deterministic)
    const n = 48, pts = [];
    for (let i = 0; i <= n; i++) {
      const v = 0.2 + 0.03 * Math.sin(i * 1.7) + 0.02 * Math.sin(i * 0.53 + 1) + 0.012 * Math.cos(i * 3.1);
      pts.push([X0 + ((X1 - X0) * i) / n, Y1 - (v / 1.15) * (Y1 - thrY) - 6]);
    }
    const d = 'M' + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L');
    const gh = el('g', { opacity: 0.35 }, KB.reveal(S, box, ghostF, { from: 'end' }).g);
    el('path', { d: `${d}L${X1} ${Y1}L${X0} ${Y1}Z`, class: 'ar-teal' }, gh);
    el('path', { d, class: 'ln-teal nsl' }, gh);
    const lg = KB.reveal(S, box, cf(fx), { parent: cq }).g;
    el('path', { d: `${d}L${X1} ${Y1}L${X0} ${Y1}Z`, class: 'ar-teal' }, lg);
    el('path', { d, class: 'ln-teal nsl' }, lg);
    const yAt = (x) => { const f = ((x - X0) / (X1 - X0)) * n, i = Math.min(n - 1, Math.floor(f)), r = f - i; return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r; };
    const hx0 = X0, hy0 = pts[0][1];
    const head = S.sprite({ x: hx0 - 5, y: hy0 - 5, w: 10, h: 10, track: tt((t) => { const x = X0 + bake(t) * (X1 - X0); return { o: t < 0.7 ? 0 : 1 - baked(t), x: x - hx0, y: yAt(x) - hy0 }; }) });
    el('circle', { cx: hx0, cy: hy0, r: 3, class: 'md-rest' }, head.g);
    // ---- the monitors: the Flux Kustomization and two Datadog monitors
    const mons = ['kustomization', 'error-rate', 'latency-p99'];
    // v6c: the kit chip's padding (7 px each side, rx 4; the mark counts as the leading glyph, 6 px to the text). 11 px mono
    // measures 7.09 px a glyph in the page font (v6b assumed 6.63, so kustomization touched its right edge)
    const mw = mons.map((s) => Math.round(s.length * 7.09 + 31));
    // 1440: one row of chips under their sources (Flux | Datadog, a caption + hairline over each group);
    // 390: the three stacked as full-width rows (no 2 + 1 wrap), each with its source at the right
    const src = ['Flux', 'Datadog', 'Datadog'];
    const xs = mons.map((_, i) => (ph ? px : px + mons.slice(0, i).reduce((a, _, j) => a + mw[j] + 6, 0)));
    if (!ph) {
      const cy0 = C.y + 212;
      for (const [s0, a, b] of [['Flux', 0, 0], ['Datadog', 1, 2]]) {
        const tx = KB.text(st, xs[a], cy0, s0, 'tag');
        const tw = s0.length * 7.09;
        el('path', { d: `M${xs[a] + tw + 6} ${cy0 - 3.5}H${xs[b] + mw[b]}`, class: 'c-div nsl', 'stroke-width': 1 }, st);
      }
    }
    mons.forEach((s, i) => {
      const x = xs[i];
      const ch = ph ? 28 : 24;
      const y = C.y + (ph ? 200 : 220) + (ph ? i * 34 : 0), bw = ph ? rx - px : mw[i];
      el('rect', { x: x + 0.5, y: y + 0.5, width: bw - 1, height: ch - 1, rx: 4, class: 'c-quiet nsl', 'stroke-width': 1 }, st);
      const a = (t) => w(t, 0.25 + i * 0.15, 0.4 + i * 0.15), b = (t) => w(t, 0.95 + i * 0.15, 1.15 + i * 0.15);
      const ml = ph ? 14 : 12.5;
      // v6j: re-armed for the next region (rest dot -> dashed wait ring, 150 ms, 60 ms stagger)
      const re = (t) => w(t, MON[i], MON[i] + 0.15);
      KB.mark(S, x + ml, y + ch / 2, ['wait', 'prog', 'rest'], (t) => (t >= MON[i] ? { wait: re(t), prog: 0, rest: 1 - re(t) } : { wait: 1 - a(t), prog: a(t) * (1 - b(t)), rest: b(t) }));
      KB.text(st, x + ml + 11.5, y + ch / 2 + 4, s, 'monoInk').setAttribute('font-size', 11);
      if (ph) KB.text(st, x + bw - 12, y + 18, src[i], 'tag', 'end');
    });
    // v6g (climax audit): on the close beat every monitor confirms at once (the three dots pulse together, 260 ms) and the
    // card's edge lights teal (130 ms in, 300 ms out): healthy for the whole bake, to the last sample
    const pulse = (t) => { const p = w(t, 3.36, 3.62, 'lin'); return p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0; };
    mons.forEach((s, i) => {
      const ch = ph ? 28 : 24, y = C.y + (ph ? 200 : 220) + (ph ? i * 34 : 0), mx = xs[i] + (ph ? 14 : 12.5), my = y + ch / 2;
      const sp = S.sprite({ x: mx - 9, y: my - 9, w: 18, h: 18, track: tt((t) => { const p = pulse(t); return { o: p > 0 ? 1 : 0, s: 1 + 0.6 * p }; }) });
      KB.markOne(sp.g, mx, my, 'rest');
    });
    const edge = S.sprite({ x: C.x - 2, y: C.y - 2, w: C.w + 4, h: C.h + 4, track: tt((t) => ({ o: w(t, 3.3, 3.43, 'out') * (1 - w(t, 3.55, 3.85, 'in')) })) });
    el('rect', { x: C.x + 0.5, y: C.y + 0.5, width: C.w - 1, height: C.h - 1, rx: 7.5, class: 'ln-teal nsl', 'stroke-width': 1.5 }, edge.g);
    return S.finish(null); // v6j: no root track: the frame never fades
  }
});
