/* GATES v6i (b15 fix 3): 390 turned over (prod on top, gates below, wires run up); the build rises from under the card
   straight into checkout-api's row through the card's bottom edge, crossing no header, divider or text. 1440 unchanged.
   Was GATES v6h (b14, coordinator fixes 1-3): 4.45.0-45 fades out (150 ms ease-in) and is gone before the build reaches the slot
   (every frame at 10 and 25 fps, all four cells); 1440: the prod card's checkout-api row is the lane: the trunk arrives inside
   that row (above its text, on the middle gate's line as before), so the build crosses no divider and no text, then sets down
   into the version slot; the prod card's edge light is gone (the row's teal wash alone marks the landing).
   Was v6g: */
/* GATES v6g: the climax (work/gates-climax.md, option 1 "Three marks, one beat"). Every gate opens WAITING (the dashboard's
   dashed wait ring), and they resolve in turn: Business hours (0.30), payments-svc reports HELD (0.50), STAGING (0.75);
   payments-svc's dependency bakes in prod and its gate clears LAST (1.58). At 2.05 the three teal marks pulse in unison and
   the build lights on the same beat. Then it departs (80 ms anticipation, one spring travel) and lands with weight: the old
   version is pushed out of the slot, the prod card's edge lights and the row takes a teal wash. Loop 6.0, rest 4.5.
   Was v6e/v6f: */
/* GATES v6e: the ambient packet streams are gone (copy audit); the passing wires light once (0.10, 0.32) and rest; the held
   queue and its run-off stay. Was: GATES v6 (kit v6; v4's composition, materials and timing, polished). A link with packets (Railway Block 2) and a build that moves.
   Claim: "A build moves when every gate passes." Three gate nodes (the #145 Gates graph's nodes, each with the dashboard's
   gate icon: Business hours = calendar, payments-svc = share-nodes, STAGING = chevrons) are wired into one junction where
   checkout-api 4.46.0-46 is parked; prod us-east-1 sits across the trunk. Packets stream on the passing wires; the payments-svc
   gate is held (its node tinted held, its packets stopped in held orange). payments-svc's wave pie ticks full in prod (it is
   baking 3.1.0), the gate clears, the stopped packets run off into the build, the build lights and travels the trunk into prod
   us-east-1 (the one travel, crossing no label), where it deploys. Loop 5.5 s, rest 4.0.
   v6: page card shadow, Business hours, the held state as a fill, the travel lane free of text, compositor stage. */
VG.def('gates', {
  loop: 6.0, rest: 4.5, vb: (ph) => (ph ? [326, 420] : [780, 380]),
  label: 'checkout-api 4.46.0-46 waits at three gates; Business hours and staging pass, payments-svc finishes baking and passes last; with every gate passed the build moves into prod us-east-1',
  build(svg, id, ph) {
    const { el, w } = VG;
    const LOOP = 6.0, EXIT = 5.2, EXIT_END = 5.5;
    const [W, H] = ph ? [326, 420] : [780, 380];
    const S = KB.stage(svg, W, H, LOOP);
    KB.defs(svg, id);
    const base = S.base;
    const tt = (fn) => (T) => fn(T >= EXIT_END ? 0 : T);
    // ---- layout
    const N = ph ? { x: 12, w: 228, h: 44, ys: [252, 306, 360] } : { x: 20, w: 232, h: 52, ys: [36, 164, 292] };
    const cy = N.ys.map((y) => y + N.h / 2);
    const CW = 80; // the build chip "4.46.0-46"
    // v6h: 1440's card moves up 16 and grows 6 so the checkout-api row's band holds the build's lane above its text; the trunk
    // stays on the middle gate's line (jy 190), which is now inside that row
    const R = ph ? { x: 12, y: 12, w: 302, h: 132 } : { x: 540, y: 68, w: 232, h: 186 };
    // row A = checkout-api (where the build lands), row B = payments-svc (baking 3.1.0)
    // v6c: payments-svc first at both widths (v4's order) and v4's row at both widths: mark | name | version at the right, so
    // the card is used edge to edge. 390: the three wires fill the right of the gates, merge into one bus and the trunk comes
    // down the middle; the build drops through the free middle of the payments-svc row to the row divider (rows 46 apart:
    // >= 8 px clear of both rows' text), slides right along it and drops into its row past the name, crossing no label
    const RA = ph ? R.y + 112 : R.y + 146, RB = ph ? R.y + 66 : R.y + 80;
    const D = ph ? (RA + RB) / 2 : R.y + 106; // the divider between the two rows
    const SLOT = { x: R.x + R.w - 16 - CW, y: RA - 10 };
    const B0 = ph ? { x: R.x + R.w - 16 - CW, y: 176 } : { x: 420, y: D + 6 }; // parked at the junction, on the trunk
    const LANE = (RA + RB) / 2 - 10;
    // ---- wires: gate -> junction (the #145 elbow), then the trunk into prod
    let wd, trunkD, trunkBox, jx, jy;
    if (!ph) {
      const x1 = N.x + N.w; jx = B0.x - 8; jy = B0.y + 10;
      wd = cy.map((y) => [VG.elbow(x1, y, jx, jy, 370), VG.chevron(jx, jy)]);
      trunkD = [`M${jx + 2} ${jy}H${R.x - 8}`, VG.chevron(R.x - 8, jy)];
      trunkBox = { x: jx, y: jy - 6, w: R.x - jx - 4, h: 12 };
    } else {
      // v6i (b15 fix 3): 390 is turned over: prod on top, the gates below, the wires run UP. The build parks under the card on
      // the version slot's column and rises straight through the card's bottom edge into checkout-api's row (the bottom row):
      // no header, divider or text is on its way. Was v6h: prod at the bottom, the build fell through its header.
      const x1 = N.x + N.w; jx = B0.x + CW / 2; jy = B0.y + 26;
      const JB = 228; // the bus the three wires merge into, over the gates
      const up = (x, y, d = 4, h = 3.5) => `M${x - h} ${y + d}L${x} ${y}L${x + h} ${y + d}`;
      wd = cy.map((y, i) => {
        const lx = 282 + i * 14;
        const d = `M${x1} ${y}H${lx - 8}A8 8 0 0 0 ${lx} ${y - 8}V${JB + 8}A8 8 0 0 0 ${lx - 8} ${JB}H${jx + 8}A8 8 0 0 1 ${jx} ${JB - 8}V${jy}`;
        return [d, i === 1 ? up(jx, jy) : null];
      });
      trunkD = [`M${jx} ${jy - 2}V${R.y + R.h + 8}`, up(jx, R.y + R.h + 8)];
      trunkBox = { x: jx - 6, y: R.y + R.h + 4, w: 12, h: jy - R.y - R.h - 4 };
    }
    // ---- the timeline (s). ph shifts nothing before the travel; 390 (v6i) rises in one leg
    const BH = 0.30, HELD = 0.50, STG = 0.75, CLEAR = 1.58, ALL = 2.05, GO = 2.53;
    const LAND = ph ? 2.85 : 2.88; // v6i: 390's rise is one leg (2.53-2.85)
    // v6g: every gate wire starts quiet and lights (250 ms) when ITS gate passes: gate -> junction at 1440, a light-up at 390
    wd.forEach(([d, c]) => KB.path(base, d, 'w-q', c));
    [[0, BH + 0.06], [2, STG + 0.06]].forEach(([i, a]) => {
      const f = tt((t) => w(t, a, a + 0.25, 'io'));
      if (!ph) KB.path(KB.reveal(S, { x: N.x + N.w - 2, y: Math.min(cy[i], B0.y + 10) - 6, w: B0.x - 8 - N.x - N.w + 4, h: Math.abs(cy[i] - B0.y - 10) + 12 }, f).g, wd[i][0], 'w-lit', wd[i][1]);
      else KB.path(S.sprite({ x: 0, y: 0, w: W, h: H, track: (T) => ({ o: f(T) }) }).g, wd[i][0], 'w-lit', wd[i][1]);
    });
    KB.path(base, trunkD[0], 'w-q', trunkD[1]);
    const L = wd.map(([d]) => KB.lut(svg, d));
    // ---- the gate nodes: kind icon, the dashboard's name, the value, the status mark at the right
    const icx = N.x + (ph ? 20 : 22), lx = N.x + (ph ? 36 : 40), mx = N.x + N.w - (ph ? 18 : 20), vx = mx - (ph ? 14 : 16);
    for (const y of N.ys) KB.card(base, id, { x: N.x, y, w: N.w, h: N.h, r: 8 });
    // the held node: tinted held while it holds (a fill, not a 1 px line), back to the page card when it passes
    const hold = (t) => w(t, HELD, HELD + 0.2) * (1 - w(t, CLEAR, CLEAR + 0.2));
    const hn = S.sprite({ x: N.x, y: N.ys[1], w: N.w, h: N.h, track: tt((t) => ({ o: hold(t) })) });
    el('rect', { x: N.x + 0.5, y: N.ys[1] + 0.5, width: N.w - 1, height: N.h - 1, rx: 7.5, class: 'c-heldn nsl', 'stroke-width': 1 }, hn.g);
    const st = S.stat();
    KB.icon(st, 'calendar', icx, cy[0]); KB.text(st, lx, cy[0] + 4.5, 'Business hours', 'label');
    KB.icon(st, 'share', icx, cy[1]); KB.text(st, lx, cy[1] + 4.5, 'payments-svc', 'label');
    KB.text(st, vx, cy[1] + 4.5, '^3.1.0', 'mono', 'end');
    KB.icon(st, 'chevrons', icx, cy[2]); KB.chip(st, lx, cy[2] - 10, 'STAGING', 'stg', { caps: true });
    KB.text(st, vx, cy[2] + 4.5, 'baked', 'meta', 'end');
    // each gate's mark: wait ring -> (held) -> the teal dot, which springs in (220 ms) and pulses on the all-green beat
    const pulse = (t) => { const p = w(t, ALL, ALL + 0.26, 'lin'); return p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0; };
    const gateMark = (i, pass, held) => {
      const c = cy[i];
      KB.markOne(S.sprite({ x: mx - 9, y: c - 9, w: 18, h: 18, track: tt((t) => ({ o: 1 - w(t, held ?? pass, (held ?? pass) + 0.13) })) }).g, mx, c, 'wait');
      if (held != null) KB.markOne(S.sprite({ x: mx - 9, y: c - 9, w: 18, h: 18, track: tt((t) => ({ o: w(t, held, held + 0.13) * (1 - w(t, pass, pass + 0.13)) })) }).g, mx, c, 'held');
      // the all-green beat: every gate node's edge lights teal together (130 ms in, 300 ms out)
      const eg = S.sprite({ x: N.x - 2, y: N.ys[i] - 2, w: N.w + 4, h: N.h + 4, track: tt((t) => ({ o: w(t, ALL, ALL + 0.13, 'out') * (1 - w(t, ALL + 0.2, ALL + 0.5, 'in')) })) });
      el('rect', { x: N.x + 0.5, y: N.ys[i] + 0.5, width: N.w - 1, height: N.h - 1, rx: 7.5, class: 'ln-teal nsl', 'stroke-width': 2 }, eg.g);
      const dot = S.sprite({ x: mx - 9, y: c - 9, w: 18, h: 18, track: tt((t) => ({ o: w(t, pass, pass + 0.08, 'out'), s: (0.4 + 0.6 * w(t, pass, pass + 0.22, 'spring')) * (1 + 0.8 * pulse(t)) })) });
      KB.markOne(dot.g, mx, c, 'rest');
    };
    gateMark(0, BH); gateMark(2, STG); gateMark(1, CLEAR, HELD);
    // ---- prod us-east-1 (the destination: the thesis tile). The card is painted below, the landing wash over it, the rows on top
    KB.card(st, id, { ...R, tone: 'fig' });
    const RW = { x: R.x + 1, y: D + 1, w: R.w - 2, h: R.y + R.h - D - 2 };
    const wash = S.sprite({ ...RW, track: tt((t) => ({ o: w(t, LAND, LAND + 0.13, 'out') * (1 - w(t, LAND + 0.45, LAND + 0.75, 'in')) })) });
    // v6h: the wash's bottom corners follow the card's (r 12, 11 inside the 1 px edge), so no square corner shows in dark
    const wr = 11, wb = RW.y + RW.h;
    el('path', { d: `M${RW.x} ${RW.y}H${RW.x + RW.w}V${wb - wr}A${wr} ${wr} 0 0 1 ${RW.x + RW.w - wr} ${wb}H${RW.x + wr}A${wr} ${wr} 0 0 1 ${RW.x} ${wb - wr}Z`, class: 'band-teal wash-land' }, wash.g);
    const st2 = S.stat();
    KB.chip(st2, R.x + 16, R.y + 14, 'PROD', 'prod', { caps: true });
    KB.text(st2, R.x + 66, R.y + 28.5, 'us-east-1', 'label');
    KB.divider(st2, R.x, R.x + R.w, R.y + 48);
    KB.divider(st2, R.x + 16, R.x + R.w, D);
    const pmx = R.x + 22;
    KB.text(st2, R.x + 38, RA + 4.5, 'checkout-api', 'label');
    KB.text(st2, R.x + 38, RB + 4.5, 'payments-svc', 'label');
    KB.text(st2, R.x + R.w - 16, RB + 4.5, '3.1.0', 'mono', 'end');
    // v6h: no edge light on the prod card at the landing; the row's teal wash alone marks it
    // payments-svc bakes 3.1.0 in prod while its gate holds: its pie ticks full in a burst (130 ms each), then it is done
    const PIE = [0.7, 0.8, 0.9, 1];
    const pieAt = (t) => [1.05, 1.19, 1.33].reduce((a, s) => a + w(t, s, s + 0.13), 0);
    const done = (t) => w(t, 1.48, 1.68);
    PIE.forEach((fr, i) => {
      const sp = S.sprite({ x: pmx - 9, y: RB - 9, w: 18, h: 18, track: tt((t) => { const k = pieAt(t); return { o: Math.max(0, 1 - Math.abs(k - i)) * (1 - done(t)) }; }) });
      KB.markOne(sp.g, pmx, RB, 'prog', fr);
    });
    KB.mark(S, pmx, RB, ['rest'], tt((t) => ({ rest: done(t) })));
    // checkout-api's running version is pushed down out of the slot (150 ms ease-in). v6h: it is fully gone before the build
    // reaches the slot: 1440 ends as the build arrives over the slot (2.64), before it sets down (2.68); 390 ends before the drop
    const OF = ph ? LAND - 0.40 : LAND - 0.39;
    const oldV = S.sprite({ x: SLOT.x - 4, y: RA - 12, w: CW + 8, h: 24, track: tt((t) => { const o = w(t, OF, OF + 0.15, 'in'); return { o: 1 - o, y: (ph ? -7 : 7) * o }; }) });
    KB.text(oldV.g, R.x + R.w - 16, RA + 4.5, '4.45.0-45', 'mono', 'end');
    // its mark: running -> deploying -> done
    const dep = (t) => w(t, LAND + 0.08, LAND + 0.28), ok = (t) => w(t, LAND + 0.78, LAND + 0.98);
    KB.mark(S, pmx, RA, ['rest', 'act'], tt((t) => ({ rest: (1 - dep(t)) + ok(t) * dep(t), act: dep(t) * (1 - ok(t)) })), { loop: LOOP });
    // ---- the payments-svc wire: quiet, held orange while it holds, then lit teal from its start (250 ms)
    const hw = S.sprite({ x: 0, y: 0, w: W, h: H, track: tt((t) => ({ o: w(t, HELD, HELD + 0.15) * (1 - w(t, CLEAR + 0.12, CLEAR + 0.27)) })) });
    KB.path(hw.g, wd[1][0], 'w-h', wd[1][1]);
    const lit = (t) => w(t, CLEAR + 0.05, CLEAR + 0.3);
    if (!ph) KB.path(KB.reveal(S, { x: N.x + N.w - 2, y: cy[1] - 6, w: jx - N.x - N.w + 4, h: 12 }, tt(lit)).g, wd[1][0], 'w-lit', wd[1][1]);
    else KB.path(S.sprite({ x: 0, y: 0, w: W, h: H, track: tt((t) => ({ o: lit(t) })) }).g, wd[1][0], 'w-lit', wd[1][1]);
    // ---- packets: only the held queue. They stop at the build in held orange while it holds; when it clears they run in
    const dot = (wi, cls, track) => {
      const [x0, y0] = L[wi].pt(0);
      const sp = S.sprite({ x: x0 - 3, y: y0 - 3, w: 6, h: 6, track });
      el('circle', { cx: x0, cy: y0, r: 2, class: cls }, sp.g);
    };
    const run = (t) => w(t, CLEAR + 0.08, CLEAR + 0.42, 'in');
    [64, 73, 82, 91].forEach((d, i) => {
      const { L: Lw, pt } = L[1], [x0, y0] = pt(0);
      const at = (t) => { const s = Lw - d + run(t) * (d + 4 + i * 6); const [x, y] = pt(s); return { s, x: x - x0, y: y - y0 }; };
      const appear = (t) => w(t, HELD + 0.05 + i * 0.04, HELD + 0.18 + i * 0.04, 'out');
      dot(1, 'pk-held', tt((t) => { const P = at(t); return { o: run(t) > 0 ? 0 : appear(t), x: P.x, y: P.y }; }));
      dot(1, 'pk', tt((t) => { const P = at(t); return { o: run(t) > 0 && P.s <= Lw ? Math.min(1, (Lw - P.s) / 14) : 0, x: P.x, y: P.y }; }));
    });
    // ---- the trunk lights behind the build
    KB.path(KB.reveal(S, trunkBox, tt((t) => w(t, GO, GO + 0.3)), ph ? { axis: 'y', from: 'end' } : { axis: 'x' }).g, trunkD[0], 'w-lit', trunkD[1]);
    // the neutral chip stays opaque under the teal one while it fades in (no see-through frame), then hides
    // ---- the build: parked neutral, lit teal on the all-green beat (3 % spring pop), then it moves (the one travel)
    const on = (t) => w(t, ALL + 0.05, ALL + 0.2);
    const pop = (t) => (t < ALL + 0.05 ? 1 : 0.94 + 0.06 * w(t, ALL + 0.05, ALL + 0.29, 'spring'));
    // anticipation: 3 px back against the travel (80 ms out), released into the travel
    const back = (t) => 3 * w(t, GO - 0.08, GO, 'out') * (1 - w(t, GO, GO + 0.12, 'io'));
    const mv = (t) => w(t, GO, ph ? GO + 0.32 : GO + 0.5, 'spring');
    const bb = { x: B0.x - 2, y: B0.y - 2, w: CW + 4, h: 24 };
    // v6h: 390 drops from 2.94 (after the old version has gone, 2.93); 1440 sets down 2.68-2.88, after the travel has crossed
    // the checkout-api text (x at 102 % by 2.68)
    const drop = (t) => (ph ? w(t, LAND - 0.14, LAND, 'io') : w(t, LAND - 0.2, LAND, 'io'));
    const slide = (t) => w(t, GO + 0.22, GO + 0.44, 'io');
    const bg = S.sprite({ ...bb, track: tt((t) => (ph
      ? { y: back(t) + (SLOT.y - B0.y) * mv(t) }
      : { x: -back(t) + (SLOT.x - B0.x) * mv(t), y: (SLOT.y - B0.y) * drop(t) })) });
    KB.chip(S.sprite({ ...bb, parent: bg, track: tt((t) => ({ o: t < ALL + 0.2 ? 1 : 0, s: pop(t) })) }).g, B0.x, B0.y, '4.46.0-46', 'n', { mono: true });
    KB.chip(S.sprite({ ...bb, parent: bg, track: tt((t) => ({ o: on(t), s: pop(t) })) }).g, B0.x, B0.y, '4.46.0-46', 'build', { mono: true });
    // its caption leaves just before it sets off
    const lab = ph ? [B0.x - 8, B0.y + 14, 'end'] : [B0.x + CW / 2, B0.y - 10, 'middle'];
    const cap = S.sprite({ x: lab[0] - 60, y: lab[1] - 12, w: 120, h: 16, track: tt((t) => ({ o: 1 - w(t, GO - 0.2, GO - 0.07, 'in') })) });
    KB.text(cap.g, lab[0], lab[1], 'checkout-api', 'small', lab[2]);
    return S.finish(KB.inoutTrack(EXIT, EXIT_END));
  }
});
