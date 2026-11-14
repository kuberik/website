/* RELEASES v6i (b15): fix 1 the Release's revision ring resolves to the teal dot as its trace sets off (2.02); fix 2 at 390 the
   ReleaseSource wire runs at the chip lane's right side (x 98) and its caption sits 14 px off it, as 1440's sits 14 px over its wire.
   Was RELEASES v6h (b14 fix 6): no edge light on the Release. The climax is the trace arriving at the commit: as the revision's
   wire fills to the commit (2.26) the commit mark pops (spring, 3.1 % overshoot, 240 ms: the hollow ring hands over to a teal
   dot) and settles, on the beat its value turns teal.
   Was RELEASES v6g (climax audit: the completed trace lands as a beat, the Release's edge lights as its mark rests).
   Was RELEASES v6e (kit v6, B's frontal language). Composition: TRACED BACK (work/releases-concepts.md, concept 1). Replaces
   v6d's deck (copy audit: Railway Block 5's deck swap); not A's mouth or conveyor.
   Claim: "Every version, and where it came from." Truth: checkout-api's ReleaseSource watches its OCI repository; a new tag
   becomes a Release that records the tag's digest and the git revision the image was built from.
   Three objects, frontal: the OCI repository (its tags, newest first), the git repository (the commit), and the Release (the
   subject: the thesis tile), which starts as a dashed slot. 4.46.0-46 is pushed: the tag rows step down one and the tag
   springs into the top row; the ReleaseSource wire lights behind it as it travels into the slot (the one travel); the slot
   becomes the Release card and the chip hands over to its title. Then the provenance, one fact at a time: the digest row
   lands and a wire lights BACK from it to the tag's row (whose digest turns teal), the revision row lands and a wire lights
   back to the commit (which turns teal); the Release's mark rests. Wires light once and rest lit.
   Borrowed proportions: Gates' node card / prod tile and wire kit, Canary's dashed slot, v6d's provenance rows.
   Loop 4.8 s, rest 3.0 (resolved hold 1.2 s). */
VG.def('releases', {
  loop: 4.8, rest: 3.0, vb: (ph) => (ph ? [326, 400] : [630, 330]),
  label: 'A ReleaseSource reads the new OCI tag 4.46.0-46 and records it as a release, tracing its digest back to the registry and its git revision back to the commit',
  build(svg, id, ph) {
    const { el, w } = VG;
    const LOOP = 4.8, EXIT = 3.9, EXIT_END = 4.2;
    const [W, H] = ph ? [326, 400] : [630, 330];
    const S = KB.stage(svg, W, H, LOOP);
    KB.defs(svg, id);
    const st = S.base;
    const tt = (fn) => (T) => fn(T >= EXIT_END ? 0 : T);
    const CW = 80;
    // ---- geometry
    const R = ph ? { x: 12, y: 12, w: 302, h: 112 } : { x: 16, y: 56, w: 224, h: 140 };   // the OCI repository
    const D = ph ? { x: 12, y: 164, w: 302, h: 124 } : { x: 376, y: 100, w: 238, h: 140 }; // the Release
    const G = ph ? { x: 12, y: 324, w: 302, h: 56 } : { x: 16, y: 224, w: 224, h: 64 };   // the git repository
    const RP = ph ? 22 : 24, R0 = R.y + (ph ? 76 : 76);                                     // tag rows: pitch, first baseline
    const Y = ph ? { v: 30, div: 44, dg: 72, rv: 100 } : { v: 34, div: 52, dg: 80, rv: 110 };
    const gy = G.y + (ph ? 42 : 44);                                                        // the commit's baseline
    // ---- timing (one change at a time)
    const ins = (t) => w(t, 0.25, 0.5, 'io');                // the rows step down one
    const pop = (t) => w(t, 0.45, 0.67, 'spring');           // the pushed tag springs into the top row
    const mv = (t) => w(t, 0.75, 1.25, 'spring');            // the one travel
    const fill = (t) => w(t, 1.2, 1.35, 'out');              // the slot becomes the Release
    const hand = (t) => w(t, 1.28, 1.41);                     // chip -> title
    const a1 = (t) => w(t, 1.48, 1.61, 'out'), t1 = (t) => w(t, 1.52, 1.82, 'io'), h1 = (t) => w(t, 1.78, 1.91);
    const a2 = (t) => w(t, 1.98, 2.11, 'out'), t2 = (t) => w(t, 2.02, 2.32, 'io'), h2 = (t) => w(t, 2.28, 2.41);
    const ok = (t) => w(t, 2.48, 2.68);
    // ---- the OCI repository: header, then its tags newest first (a clipped window so a row stepping out leaves cleanly)
    KB.card(st, id, { ...R, r: 8 });
    KB.text(st, R.x + 16, R.y + 22, 'oci://ghcr.io/acme', 'tag');
    KB.text(st, R.x + 16, R.y + 40, 'checkout-api', 'label');
    KB.divider(st, R.x, R.x + R.w, R.y + 52);
    const rows = [['4.45.0-45', '3f9a…c214'], ['4.44.0-44', '0ad4…19fe'], ['4.43.0-43', '51b0…e93c']];
    const nVis = ph ? 2 : 3;
    const win = S.sprite({ x: R.x + 1, y: R.y + 53, w: R.w - 2, h: R.h - 54, clip: true, track: () => ({}) });
    rows.slice(0, nVis).forEach(([v, dg], i) => {
      const last = i === nVis - 1;
      const sp = S.sprite({ x: R.x, y: R0 + i * RP - 16, w: R.w, h: 22, parent: win, track: tt((t) => ({ y: RP * ins(t), o: last ? 1 - w(t, 0.25, 0.45, 'in') : 1 })) });
      KB.text(sp.g, R.x + 16, R0 + i * RP, v, 'mono');
      KB.text(sp.g, R.x + R.w - 16, R0 + i * RP, dg, 'mono', 'end');
    });
    // the new top row: left behind by the chip as it sets off; its digest turns teal when the Release's digest traces back to it
    const nr = S.sprite({ x: R.x, y: R0 - 16, w: R.w, h: 22, parent: win, track: tt((t) => ({ o: w(t, 0.8, 0.93, 'out') })) });
    KB.text(nr.g, R.x + 16, R0, '4.46.0-46', 'monoInk');
    const ndg = S.sprite({ x: R.x + R.w - 90, y: R0 - 16, w: 90, h: 22, parent: nr, track: tt((t) => ({ o: 1 - h1(t) })) });
    KB.text(ndg.g, R.x + R.w - 16, R0, '9c1e…7a40', 'mono', 'end');
    const ndgT = S.sprite({ x: R.x + R.w - 90, y: R0 - 16, w: 90, h: 22, parent: nr, track: tt((t) => ({ o: h1(t) })) });
    KB.text(ndgT.g, R.x + R.w - 16, R0, '9c1e…7a40', 'mono', 'end').setAttribute('class', 'mono teal-ink');
    // ---- the git repository: the commit the image was built from
    KB.card(st, id, { ...G, r: 8 });
    KB.text(st, G.x + 16, G.y + 22, 'github.com/acme', 'tag');
    KB.text(st, G.x + 16, gy, 'checkout-api', 'label');
    const ce = G.x + G.w - 16, cdx = ce - 58;
    // v6h (b14 fix 6): the commit mark. The hollow ring hands over to a teal dot that pops (vg spring: 0 -> 1.031 -> 1, 240 ms)
    // as the revision's trace reaches the commit (t2 ends 2.32); the value's teal change (h2, 2.28) lands on the same beat
    const POP = 2.26, cpop = (t) => w(t, POP, POP + 0.24, 'spring');
    const cr0 = S.sprite({ x: cdx - 6, y: gy - 10, w: 12, h: 12, track: tt((t) => ({ o: 1 - w(t, POP, POP + 0.08) })) });
    el('circle', { cx: cdx, cy: gy - 4, r: 3, class: 'md-wait nsl', style: 'stroke-dasharray:none;stroke:var(--b-muted)', 'stroke-width': 1.2 }, cr0.g);
    const cr1 = S.sprite({ x: cdx - 6, y: gy - 10, w: 12, h: 12, track: tt((t) => ({ o: t < POP ? 0 : 1, s: Math.max(0.001, cpop(t)) })) });
    el('circle', { cx: cdx, cy: gy - 4, r: 3.5, class: 'md-rest' }, cr1.g);
    const cm0 = S.sprite({ x: ce - 54, y: gy - 14, w: 56, h: 20, track: tt((t) => ({ o: 1 - h2(t) })) });
    KB.text(cm0.g, ce, gy, 'e2b4f81', 'mono', 'end');
    const cm1 = S.sprite({ x: ce - 54, y: gy - 14, w: 56, h: 20, track: tt((t) => ({ o: h2(t) })) });
    KB.text(cm1.g, ce, gy, 'e2b4f81', 'mono', 'end').setAttribute('class', 'mono teal-ink');
    // ---- wires (quiet, then each lights once and rests lit)
    // A: ReleaseSource, the repository -> the Release (the tag travels it). D1: the digest's line back to the tag's row.
    // D2: the revision's line back to the commit. 390 stacks the three objects; the wires run vertically between them.
    const chevUp = (x, y, d = 4, h = 3.5) => `M${x - h} ${y + d}L${x} ${y}L${x + h} ${y + d}`;
    const chevLeft = (x, y, d = 4, h = 3.5) => `M${x + d} ${y - h}L${x} ${y}L${x + d} ${y + h}`;
    // v6f (b-r5 fix 2): the provenance wires are traces FROM the Release BACK to the source. The light already ran card ->
    // source; the arrowheads now agree: they sit at the source end (the tag's row, the commit), 8 px off its edge like A's.
    // Only A (the ReleaseSource wire the tag travels) points into the Release.
    let A, D1, D2, boxA, box1, box2, axA, ax1, ax2, from1, from2, capA;
    if (!ph) {
      // v6f (b-r5 fix 5): the digest wire no longer forks off A. It has its own end on the tag's row, 9 px under A, at the
      // digest column's edge (the row's right column is the digest), so the caption above A labels one wire only.
      const ya = R0 - 4, yds = R0 + 5, yd = D.y + Y.dg - 4, yr = D.y + Y.rv - 4, xs = R.x + R.w + 8, xb = 260, xe = D.x - 8;
      A = [`M${R.x + R.w} ${ya}H${xe}`, VG.chevron(xe, ya)];
      D1 = [`M${xs} ${yds}H${xb - 8}A8 8 0 0 1 ${xb} ${yds + 8}V${yd - 8}A8 8 0 0 0 ${xb + 8} ${yd}H${xe}`, chevLeft(xs, yds)];
      D2 = [VG.elbow(xs, gy - 4, xe, yr, 300), chevLeft(xs, gy - 4)];
      boxA = { x: R.x + R.w - 1, y: ya - 6, w: xe - R.x - R.w + 4, h: 12 }; axA = 'x';
      box1 = { x: xs - 2, y: yds - 6, w: xe - xs + 4, h: yd - yds + 12 }; ax1 = 'x'; from1 = 'end';
      box2 = { x: xs - 2, y: yr - 6, w: xe - xs + 4, h: gy - yr + 8 }; ax2 = 'x'; from2 = 'end';
      capA = [xs + 4, ya - 14, 'ReleaseSource', 'start'];
    } else {
      const xa = R.x + 86, xd = R.x + R.w - 36, y1 = R.y + R.h, y2 = D.y - 8, y3 = D.y + D.h + 8, y4 = G.y;
      A = [`M${xa} ${y1}V${y2}`, VG.chevronDown(xa, y2)];
      D1 = [`M${xd} ${y1 + 8}V${y2 + 8}`, chevUp(xd, y1 + 8)];
      D2 = [`M${xd} ${y3 - 8}V${y4 - 8}`, VG.chevronDown(xd, y4 - 8)];
      boxA = { x: xa - 6, y: y1 - 1, w: 12, h: y2 - y1 + 3 }; axA = 'y';
      box1 = { x: xd - 6, y: y1 - 1, w: 12, h: y2 - y1 + 10 }; ax1 = 'y'; from1 = 'end';
      box2 = { x: xd - 6, y: y3 - 9, w: 12, h: y4 - y3 + 4 }; ax2 = 'y'; from2 = 'start';
      // v6i (b15 fix 2): the wire runs at the chip lane's right side (x 98, under the chip's last 8 px) so the caption sits 14 px
      // off the wire and stays clear of the chip (lane x 24-106) for the whole travel. Was v6f: wire x 56, caption x 116 (60 px off).
      capA = [xa + 14, (y1 + y2) / 2 + 4, 'ReleaseSource', 'start'];
    }
    for (const [d, c] of [A, D1, D2]) KB.path(st, d, 'w-q', c);
    KB.text(st, capA[0], capA[1], capA[2], 'tag', capA[3]);
    KB.path(KB.reveal(S, boxA, tt((t) => Math.min(1, mv(t))), { axis: axA }).g, A[0], 'w-lit', A[1]);
    KB.path(KB.reveal(S, box1, tt(t1), { axis: ax1, from: from1 }).g, D1[0], 'w-lit', D1[1]);
    KB.path(KB.reveal(S, box2, tt(t2), { axis: ax2, from: from2 }).g, D2[0], 'w-lit', D2[1]);
    // ---- the Release: a dashed slot (not reached yet), then the card
    el('rect', { x: D.x + 0.5, y: D.y + 0.5, width: D.w - 1, height: D.h - 1, rx: 11.5, class: 'c-slot nsl', 'stroke-width': 1 }, st);
    // v6f (b-r5 fix 1): the slot's caption leaves (130 ms ease-in, 0.62-0.75) before the tag sets off, so the chip never lands on it
    const sl = S.sprite({ x: D.x, y: D.y + Y.v - 16, w: 120, h: 22, track: tt((t) => ({ o: 1 - w(t, 0.62, 0.75, 'in') })) });
    KB.text(sl.g, D.x + 18, D.y + Y.v - 4, 'Release', 'tag');
    const card = S.sprite({ x: D.x - 24, y: D.y - 16, w: D.w + 48, h: D.h + 48, track: tt((t) => ({ o: fill(t) })) });
    KB.card(card.g, id, { ...D, tone: 'fig' });
    KB.divider(card.g, D.x, D.x + D.w, D.y + Y.div);
    const ttl = S.sprite({ x: D.x, y: D.y + Y.v - 20, w: 160, h: 26, track: tt((t) => ({ o: hand(t) })) });
    KB.text(ttl.g, D.x + 18, D.y + Y.v, '4.46.0-46', 'monoInk').setAttribute('font-size', 18);
    // v6f (b-r5 fix 4, 390 only): the wires meet the Release at its top and bottom edges, away from the rows, so each value
    // turns teal as its trace starts (the same 130 ms change and teal-ink as the source values): the wire's two ends read.
    const row = (sp, y, k, val, dot, on) => {
      const p = sp.g;
      KB.text(p, D.x + 18, y, k, 'tag');
      // v6i (b15 fix 1): the Release's revision mark resolves too. It was a hollow ring for good; now, as the revision's trace
      // sets off from it (2.02, the beat its value turns teal at 390), the ring hands over to the teal dot with the commit's own
      // pop (vg spring 0 -> 1.031 -> 1, 240 ms). The trace then runs to the commit, which pops at 2.26: Release end, then source end.
      if (dot) {
        const RP0 = 2.02, rpop = (t) => w(t, RP0, RP0 + 0.24, 'spring');
        const d0 = S.sprite({ x: D.x + 83, y: y - 10, w: 12, h: 12, parent: sp, track: tt((t) => ({ o: 1 - w(t, RP0, RP0 + 0.08) })) });
        el('circle', { cx: D.x + 89, cy: y - 4, r: 3, class: 'md-wait nsl', style: 'stroke-dasharray:none;stroke:var(--b-muted)', 'stroke-width': 1.2 }, d0.g);
        const d1 = S.sprite({ x: D.x + 83, y: y - 10, w: 12, h: 12, parent: sp, track: tt((t) => ({ o: t < RP0 ? 0 : 1, s: Math.max(0.001, rpop(t)) })) });
        el('circle', { cx: D.x + 89, cy: y - 4, r: 3.5, class: 'md-rest' }, d1.g);
      }
      const vx = D.x + (dot ? 98 : 84);
      if (!ph) { KB.text(p, vx, y, val, 'mono'); return; }
      const v0 = S.sprite({ x: vx - 2, y: y - 16, w: D.w - (vx - D.x), h: 22, parent: sp, track: tt((t) => ({ o: 1 - on(t) })) });
      KB.text(v0.g, vx, y, val, 'mono');
      const v1 = S.sprite({ x: vx - 2, y: y - 16, w: D.w - (vx - D.x), h: 22, parent: sp, track: tt((t) => ({ o: on(t) })) });
      KB.text(v1.g, vx, y, val, 'mono').setAttribute('class', 'mono teal-ink');
    };
    const r1 = S.sprite({ x: D.x, y: D.y + Y.dg - 16, w: D.w, h: 22, track: tt((t) => ({ o: a1(t), x: -6 * (1 - a1(t)) })) });
    row(r1, D.y + Y.dg, 'digest', 'sha256:9c1e…7a40', false, (t) => w(t, 1.52, 1.65));
    const r2 = S.sprite({ x: D.x, y: D.y + Y.rv - 16, w: D.w, h: 22, track: tt((t) => ({ o: a2(t), x: -6 * (1 - a2(t)) })) });
    row(r2, D.y + Y.rv, 'revision', 'e2b4f81', true, (t) => w(t, 2.02, 2.15));
    const mk = S.sprite({ x: D.x + D.w - 34, y: D.y + Y.v - 16, w: 20, h: 20, track: tt((t) => ({ o: fill(t) })) });
    KB.mark(S, D.x + D.w - 24, D.y + Y.v - 6, ['wait', 'rest'], tt((t) => ({ wait: 1 - ok(t), rest: ok(t) })), { parent: mk });
    // v6h: no edge light on the Release; the commit mark's pop (above) is the climax
    // ---- the pushed tag (the build chip): springs into the top row, travels the ReleaseSource wire, hands over to the title
    const T0 = [R.x + 12, R0 - 14], T1 = [D.x + 14, D.y + Y.v - 16];
    const tg = S.sprite({ x: T0[0] - 2, y: T0[1] - 2, w: CW + 4, h: 24, origin: [T0[0] + CW / 2, T0[1] + 10], track: tt((t) => ({ o: w(t, 0.45, 0.55, 'out') * (1 - hand(t)), x: (T1[0] - T0[0]) * mv(t), y: (T1[1] - T0[1]) * mv(t), s: 0.9 + 0.1 * pop(t) })) });
    KB.chip(tg.g, T0[0], T0[1], '4.46.0-46', 'build', { mono: true });
    return S.finish(KB.inoutTrack(EXIT, EXIT_END));
  }
});
