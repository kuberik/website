/* DASHBOARD v6b (kit v6, v4's style). Composition: a cursor story (Railway Block 4: a person acts, the product answers).
   Claim: "Every cluster in one place." / "Paste a pull request link to see how far it got." The hub is open (its rollouts list
   sits under the search field, quiet). A person dwells, moves to the field (650 ms, eased, a slight curve), presses; the field
   answers in 80 ms (focus ring, caret). The pull request link is pasted (100 ms); the palette offers its ref row, preselected
   ("Open change #112", CommandPalette's own row), Enter takes it: the hub list leaves and the change page's view springs in;
   its places across four clusters light in a burst (150 ms apart): dev and staging done, prod us-east-1 deploying, prod
   eu-west-1 not yet. 1440: four columns (region only under PROD); 390: the four places as a short vertical line.
   Loop 5.4 s, rest 4.0 (resolved hold 1.3 s). v6b: placeholder = the palette's real one, the opening carries the hub list,
   Enter is drawn, no doubled tier/env words, kind-staging, 12 px cluster names, >= 12 px between columns. */
VG.def('dashboard', {
  loop: 5.4, rest: 4.0, vb: (ph) => (ph ? [326, 340] : [430, 330]),
  label: 'A person pastes pull request link #112 into the kuberik hub; the change shows where it is across four clusters',
  build(svg, id, ph) {
    const { el, w } = VG;
    const LOOP = 5.4, EXIT = 4.5, EXIT_END = 4.8;
    const [W, H] = ph ? [326, 340] : [430, 330];
    const S = KB.stage(svg, W, H, LOOP);
    KB.defs(svg, id);
    const st = S.base;
    const tt = (fn) => (T) => fn(T >= EXIT_END ? 0 : T);
    // ---- the hub's search field
    const F = ph ? { x: 12, y: 28, w: 302, h: 40 } : { x: 24, y: 30, w: 382, h: 40 };
    const press = (t) => w(t, 1.35, 1.4, 'out') * (1 - w(t, 1.4, 1.46, 'out'));
    const foc = (t) => w(t, 1.36, 1.44, 'out') * (1 - w(t, 2.0, 2.15));
    const fr = S.sprite({ x: F.x - 3, y: F.y - 3, w: F.w + 6, h: F.h + 6, track: tt((t) => ({ o: foc(t) })) });
    el('rect', { x: F.x - 1.5, y: F.y - 1.5, width: F.w + 3, height: F.h + 3, rx: 9.5, class: 'in-focus nsl' }, fr.g);
    const fs = S.stat();
    KB.card(fs, id, { ...F, r: 8 });
    const sx = F.x + 20, sy = F.y + F.h / 2, tx = F.x + 36;
    KB.icon(fs, 'search', sx, sy, 16, 'ic');
    const pst = (t) => w(t, 1.65, 1.75, 'out');
    const phd = S.sprite({ x: tx - 2, y: sy - 10, w: 240, h: 20, track: tt((t) => ({ o: 1 - w(t, 1.65, 1.72, 'out') })) });
    KB.text(phd.g, tx, sy + 4.5, 'Search, or paste a PR link or sha', 'meta').setAttribute('class', 'subtle');
    const LINK = 'github.com/acme/checkout/pull/112', len = LINK.length * 7.23;
    const lk = S.sprite({ x: tx - 2, y: sy - 10, w: len + 6, h: 20, track: tt((t) => ({ o: pst(t), x: -4 * (1 - pst(t)) })) });
    KB.text(lk.g, tx, sy + 4.5, LINK, 'monoInk');
    // the caret: at the start once focused, at the end of the link once pasted
    for (const [cx, o] of [[tx - 1, (t) => (foc(t) > 0.5 && pst(t) < 0.5 ? 1 : 0)], [tx + len + 2, (t) => (foc(t) > 0.5 && pst(t) >= 0.5 ? 1 : 0)]]) {
      const c = S.sprite({ x: cx - 1, y: sy - 9, w: 3.2, h: 18, track: tt((t) => ({ o: o(t) })) });
      el('rect', { x: cx, y: sy - 8, width: 1.2, height: 16, class: 'caret' }, c.g);
    }
    // ---- the hub under the field (quiet): its rollouts list; it leaves when Enter opens the change
    const C = ph ? { x: 12, y: 90, w: 302, h: 214 } : { x: 24, y: 92, w: 382, h: 208 };
    const cx0 = C.x + 16, cxr = C.x + C.w - 16;
    const ENTER = 2.12;
    const gone = (t) => w(t, ENTER + 0.06, ENTER + 0.21, 'in');
    // v6c: the hub list sits a palette row lower than the change view (8 px under the ref row when it appears), so the ref row
    // never lands on the list's edge; its rows are centred in what is left
    const HY = F.y + F.h + 6 + 36 + 8, HC = { x: C.x, y: HY, w: C.w, h: C.y + C.h - HY };
    const hub = S.sprite({ ...HC, track: tt((t) => ({ o: 0.8 * (1 - gone(t)), y: 6 * gone(t) })) });
    KB.card(hub.g, id, { ...HC, tone: 'quiet' });
    const HR = [['checkout-api', 'prod us-east-1', '4.45.0-45', 'rest'], ['payments-svc', 'prod us-east-1', '3.1.0', 'prog'],
      ['orders-svc', 'staging', '2.8.1', 'rest'], ['ledger', 'dev', '1.12.0', 'rest']];
    const hp = 38;
    HR.forEach(([n, e, v, m], i) => {
      const y = HY + (HC.h - 4 * hp) / 2 + hp / 2 + i * hp;
      if (i) KB.divider(hub.g, cx0, C.x + C.w, y - hp / 2);
      KB.markOne(hub.g, cx0 + 6, y, m, 0.8);
      KB.text(hub.g, cx0 + 20, y + 4.5, n, 'label').setAttribute('class', 'muted');
      if (!ph) KB.text(hub.g, cx0 + 140, y + 4, e, 'meta').setAttribute('class', 'subtle');
      KB.text(hub.g, cxr, y + 4, v, 'tag', 'end');
    });
    // ---- the palette's ref row under the field, preselected; Enter presses it
    const RR = { x: F.x, y: F.y + F.h + 6, w: F.w, h: 36 };
    const ref = (t) => w(t, 1.8, 1.95, 'out') * (1 - gone(t));
    const ent = (t) => w(t, ENTER - 0.06, ENTER, 'out') * (1 - w(t, ENTER, ENTER + 0.06, 'out'));
    const rr = S.sprite({ ...RR, origin: [RR.x + RR.w / 2, RR.y + RR.h / 2], track: tt((t) => ({ o: ref(t), y: -4 * (1 - w(t, 1.8, 1.98, 'out')), s: 1 - 0.015 * ent(t) })) });
    KB.card(rr.g, id, { ...RR, r: 8 });
    el('rect', { x: RR.x + 4.5, y: RR.y + 4.5, width: RR.w - 9, height: RR.h - 9, rx: 5, class: 'c-quiet nsl', 'stroke-width': 1 }, rr.g);
    KB.text(rr.g, RR.x + 16, RR.y + 22.5, 'Open change', 'meta');
    KB.text(rr.g, RR.x + 98, RR.y + 22.5, '#112', 'monoInk');
    KB.text(rr.g, RR.x + 140, RR.y + 22.5, 'acme/checkout', 'meta').setAttribute('class', 'subtle');
    const kb = { x: RR.x + RR.w - 34, y: RR.y + 9, w: 22, h: 18 };
    el('rect', { x: kb.x + 0.5, y: kb.y + 0.5, width: kb.w - 1, height: kb.h - 1, rx: 4, class: 'c-page nsl', 'stroke-width': 1 }, rr.g);
    KB.text(rr.g, kb.x + kb.w / 2, kb.y + 13, '↵', 'small', 'middle');
    // ---- the change page's view (springs in where the hub list was)
    const IN = ENTER + 0.16;
    const inn = (t) => w(t, IN, IN + 0.25, 'spring');
    const cs = S.sprite({ ...C, track: tt((t) => ({ o: w(t, IN, IN + 0.1, 'out'), y: 14 * (1 - inn(t)) })) });
    const cg = cs.g;
    KB.card(cg, id, { ...C, tone: 'fig' });
    KB.text(cg, cx0, C.y + 28, '#112', 'mono');
    KB.text(cg, cx0 + 40, C.y + 28, 'Retry payments on timeout', 'label');
    KB.text(cg, cx0, C.y + 49, 'checkout-api 4.46.0-46', 'mono');
    KB.text(cg, cxr, C.y + 49, '4 clusters', 'small', 'end');
    KB.divider(cg, C.x, C.x + C.w, C.y + 64);
    const P = [['DEV', 'dev', '', 'kind-dev'], ['STAGING', 'stg', '', 'kind-staging'], ['PROD', 'prod', 'us-east-1', 'use1-a'], ['PROD', 'prod', 'eu-west-1', 'euw1-a']];
    let pts;
    if (!ph) {
      // v6c: tier, then the line, then every place's cluster on one line; prod's region is the last line (no hole mid-column)
      const colW = (C.w - 32) / 4, my = C.y + 128;
      pts = P.map((_, i) => [cx0 + colW * i + colW / 2, my]);
      P.forEach(([tier, tone, name, cl], i) => {
        KB.chip(cg, pts[i][0], C.y + 84, tier, tone, { caps: true, anchor: 'middle' });
        KB.text(cg, pts[i][0], C.y + 162, cl, 'tag', 'middle').setAttribute('font-size', 12);
        if (name) KB.text(cg, pts[i][0], C.y + 182, name, 'small', 'middle');
      });
    } else {
      // 390: a short vertical line (mark | tier | region | cluster at the right), 34 px apart
      pts = P.map((_, i) => [cx0 + 8, C.y + 90 + i * 34]);
      P.forEach(([tier, tone, name, cl], i) => {
        const y = pts[i][1];
        KB.chip(cg, cx0 + 26, y - 10, tier, tone, { caps: true });
        if (name) KB.text(cg, cx0 + 106, y + 4.5, name, 'label').setAttribute('font-size', 12);
        KB.text(cg, cxr, y + 4, cl, 'tag', 'end').setAttribute('font-size', 12);
      });
    }
    const seg = (a, b) => `M${pts[a][0]} ${pts[a][1]}L${pts[b][0]} ${pts[b][1]}`;
    el('path', { d: seg(0, 3), class: 't-rail nsl', 'stroke-width': 1 }, cg);
    const s0 = IN + 0.3, ST = [0, 1, 2].map((i) => (t) => w(t, s0 + i * 0.15, s0 + 0.15 + i * 0.15));
    // the rail lights behind the burst: teal through staging (done), blue into us-east-1 (deploying)
    const rbox = (a, b) => (ph ? { x: pts[a][0] - 2, y: pts[a][1], w: 4, h: pts[b][1] - pts[a][1] } : { x: pts[a][0], y: pts[a][1] - 2, w: pts[b][0] - pts[a][0], h: 4 });
    KB.reveal(S, rbox(0, 1), tt((t) => w(t, s0, s0 + 0.3)), { parent: cs, axis: ph ? 'y' : 'x' }).g
      .appendChild(el('path', { d: seg(0, 1), class: 't-teal nsl', 'stroke-width': 1 }, null));
    KB.reveal(S, rbox(1, 2), tt((t) => w(t, s0 + 0.3, s0 + 0.45)), { parent: cs, axis: ph ? 'y' : 'x' }).g
      .appendChild(el('path', { d: seg(1, 2), class: 't-act nsl', 'stroke-width': 1 }, null));
    const mk = S.sprite({ ...C, parent: cs });
    for (const [x, y] of pts) el('circle', { cx: x, cy: y, r: 9, class: 'c-fig', style: 'stroke:none' }, mk.g);
    KB.mark(S, pts[0][0], pts[0][1], ['wait', 'rest'], tt((t) => ({ wait: 1 - ST[0](t), rest: ST[0](t) })), { parent: cs });
    KB.mark(S, pts[1][0], pts[1][1], ['wait', 'rest'], tt((t) => ({ wait: 1 - ST[1](t), rest: ST[1](t) })), { parent: cs });
    KB.mark(S, pts[2][0], pts[2][1], ['wait', 'act'], tt((t) => ({ wait: 1 - ST[2](t), act: ST[2](t) })), { parent: cs, loop: LOOP });
    KB.markOne(mk.g, pts[3][0], pts[3][1], 'wait');
    // ---- the pointer: dwell, an eased curved travel, dwell, press, step aside
    const A = ph ? [258, 262] : [366, 262], B = ph ? [168, F.y + 31] : [262, F.y + 31];
    const mv = (t) => w(t, 0.4, 1.05, 'io');
    const leave = (t) => w(t, 1.8, 2.0, 'in');
    const cur = S.sprite({ x: A[0] - 2, y: A[1] - 2, w: 17, h: 23, origin: [A[0], A[1]], track: tt((t) => {
      const m = mv(t), l = leave(t);
      const x = (B[0] - A[0]) * m + Math.sin(m * Math.PI) * 28 + 16 * l, y = (B[1] - A[1]) * m + 12 * l;
      return { x, y, s: 1 - 0.04 * press(t), o: 1 - l };
    }) });
    KB.cursor(cur.g, A[0], A[1]);
    return S.finish(KB.inoutTrack(EXIT, EXIT_END));
  }
});
