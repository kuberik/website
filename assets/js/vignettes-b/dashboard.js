/* DASHBOARD v6b (kit v6, v4's style). Composition: a cursor story (Railway Block 4: a person acts, the product answers).
   Claim: "Every cluster in one place." / "Paste a pull request link to see how far it got." The hub is open (its rollouts list
   sits under the search field, quiet). A person dwells, moves to the field (650 ms, eased, a slight curve), presses; the field
   answers in 80 ms (focus ring, caret). The pull request link is pasted (100 ms); the palette offers its ref row, preselected
   ("Open change #112", CommandPalette's own row), Enter takes it: the hub list leaves and the change page's view springs in;
   its places across four clusters light in a burst (150 ms apart): dev and staging done, prod us-east-1 deploying, prod
   eu-west-1 not yet. 1440: four columns (region only under PROD); 390: the four places as a short vertical line.
   Loop 5.4 s, rest 4.0 (resolved hold 1.3 s). v6b: placeholder = the palette's real one, the opening carries the hub list,
   Enter is drawn, no doubled tier/env words, kind-staging, 12 px cluster names, >= 12 px between columns. */
/* v6j (b17): the loop never empties; each cycle pastes the NEXT pull request. The opening is the last cycle's answer (the
   change view of #111 at cycle 0, of #112 at cycle 1, ...) and its link in the field. The search clears as a state change
   (0.05-0.18: the link leaves 130 ms ease-in, the placeholder returns 130 ms), the pointer enters (fade 120 ms at A), dwells,
   travels, presses, pastes; Enter takes the ref row and the previous change view steps out exactly as the hub list did, the
   new one springs in and its environments answer in the burst. PR, title and version advance through S.label (title cycles
   a fixed set: changes have no order). The hub list is gone: the previous answer is the opening. Loop 5.0 s (was 5.4 with a
   0.6 s empty beat), rest 4.0 (resolved hold 3.1 -> 5.0). */
VG.def('dashboard', {
  loop: 5.0, rest: 4.0, vb: (ph) => (ph ? [326, 340] : [430, 330]),
  label: 'A person pastes pull request link #112 into the kuberik hub; the change shows where it is across four clusters',
  build(svg, id, ph) {
    const { el, w } = VG;
    const LOOP = 5.0;
    const [W, H] = ph ? [326, 340] : [430, 330];
    const S = KB.stage(svg, W, H, LOOP);
    KB.defs(svg, id);
    const st = S.base;
    const tt = (fn) => fn;   // v6j: no exit
    // the pull request of cycle k (k = 1 at cycle 0's rest: #112, 4.46.0-46)
    const TITLES = ['Retry payments on timeout', 'Cache tax rates per region', 'Idempotent refund requests', 'Trim cart payload',
      'Validate coupon expiry', 'Log payment provider latency', 'Batch inventory reservations', 'Queue webhook deliveries'];   // v6k: 8, no repeat inside 8 PRs
    const pr = (k) => 111 + k, ttl = (k) => TITLES[(((k - 1) % TITLES.length) + TITLES.length) % TITLES.length], ver = (k) => `checkout-api 4.${45 + k}.0-${45 + k}`;
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
    // v6k (b21, row a): the field is never empty. The opening keeps last cycle's link; the press focuses the field (caret at the
    // end), select-all highlights the old link (1.48, 100 ms), the paste swaps it (1.65: the old link and its highlight leave in
    // 70 ms, the new one arrives 100 ms with a 4 px settle). Old (lkO) and new (lkN) are two labels: lkN at the end of cycle n and
    // lkO at the start of n+1 read the same link (same pixels at the seam).
    const pst = (t) => w(t, 1.65, 1.75, 'out');
    const sel = (t) => w(t, 1.48, 1.58, 'out') * (1 - w(t, 1.65, 1.72, 'out'));
    const LINK = 'github.com/acme/checkout/pull/112', len = LINK.length * 7.23;
    const sl = S.sprite({ x: tx - 3, y: sy - 11, w: len + 8, h: 22, track: tt((t) => ({ o: sel(t) })) });
    el('rect', { x: tx - 2, y: sy - 9, width: len + 5, height: 18, rx: 2, style: 'fill:var(--b-focus);opacity:.24' }, sl.g);
    const lkO = S.sprite({ x: tx - 2, y: sy - 10, w: len + 6, h: 20, track: tt((t) => ({ o: 1 - w(t, 1.65, 1.72, 'out') })) });
    S.label(lkO, KB.text(lkO.g, tx, sy + 4.5, LINK, 'monoInk'), (k) => `github.com/acme/checkout/pull/${pr(k)}`, 3.0);
    const lkN = S.sprite({ x: tx - 2, y: sy - 10, w: len + 6, h: 20, track: tt((t) => ({ o: pst(t), x: -4 * (1 - pst(t)) })) });
    S.label(lkN, KB.text(lkN.g, tx, sy + 4.5, LINK, 'monoInk'), (k) => `github.com/acme/checkout/pull/${pr(k)}`, 0.6);
    // the caret: at the end of the link while focused, hidden while the link is selected
    const c = S.sprite({ x: tx + len + 1, y: sy - 9, w: 3.2, h: 18, track: tt((t) => ({ o: foc(t) > 0.5 && !(t >= 1.48 && t < 1.7) ? 1 : 0 })) });
    el('rect', { x: tx + len + 2, y: sy - 8, width: 1.2, height: 16, class: 'caret' }, c.g);
    const C = ph ? { x: 12, y: 90, w: 302, h: 214 } : { x: 24, y: 92, w: 382, h: 208 };
    const cx0 = C.x + 16, cxr = C.x + C.w - 16;
    const ENTER = 2.12;
    const gone = (t) => w(t, ENTER + 0.06, ENTER + 0.21, 'in');   // the previous change view steps out
    // ---- the change page's view. v6j: drawn twice. PREV = last cycle's answer, resolved (static marks, lit rails), the
    // opening; it steps out on Enter as the hub list did (150 ms ease-in, 6 px down) and is rewritten while hidden (3.0).
    // CUR springs in where it was and its places answer in the burst; at the seam CUR hands over to PREV (same pixels).
    const IN = ENTER + 0.16;
    const inn = (t) => w(t, IN, IN + 0.25, 'spring');
    const s0 = IN + 0.3, ST = [0, 1, 2].map((i) => (t) => w(t, s0 + i * 0.15, s0 + 0.15 + i * 0.15));
    const P = [['DEV', 'dev', '', 'kind-dev'], ['STAGING', 'stg', '', 'kind-staging'], ['PROD', 'prod', 'us-east-1', 'use1-a'], ['PROD', 'prod', 'eu-west-1', 'euw1-a']];
    const pts = !ph ? P.map((_, i) => [cx0 + ((C.w - 32) / 4) * i + (C.w - 32) / 8, C.y + 128]) : P.map((_, i) => [cx0 + 8, C.y + 90 + i * 34]);
    const seg = (a, b) => `M${pts[a][0]} ${pts[a][1]}L${pts[b][0]} ${pts[b][1]}`;
    const rbox = (a, b) => (ph ? { x: pts[a][0] - 2, y: pts[a][1], w: 4, h: pts[b][1] - pts[a][1] } : { x: pts[a][0], y: pts[a][1] - 2, w: pts[b][0] - pts[a][0], h: 4 });
    const view = (track, live, swapAt, plate = null) => {
      // v6k (b21, row c): PREV's plate is its own sprite so it can stay under the incoming view until that one covers it
      if (plate) KB.card(S.sprite({ x: C.x - 24, y: C.y - 16, w: C.w + 48, h: C.h + 48, track: plate }).g, id, { ...C, tone: 'fig' });
      const cs = S.sprite({ ...C, track });
      const cg = cs.g;
      if (!plate) KB.card(cg, id, { ...C, tone: 'fig' });
      S.label(cs, KB.text(cg, cx0, C.y + 28, '#112', 'mono'), (k) => `#${pr(k)}`, swapAt);
      S.label(cs, KB.text(cg, cx0 + 40, C.y + 28, 'Retry payments on timeout', 'label'), ttl, swapAt);
      S.label(cs, KB.text(cg, cx0, C.y + 49, 'checkout-api 4.46.0-46', 'mono'), ver, swapAt);
      KB.text(cg, cxr, C.y + 49, '4 clusters', 'small', 'end');
      KB.divider(cg, C.x, C.x + C.w, C.y + 64);
      if (!ph) {
        // v6c: tier, then the line, then every place's cluster on one line; prod's region is the last line (no hole mid-column)
        P.forEach(([tier, tone, name, cl], i) => {
          KB.chip(cg, pts[i][0], C.y + 84, tier, tone, { caps: true, anchor: 'middle' });
          KB.text(cg, pts[i][0], C.y + 162, cl, 'tag', 'middle').setAttribute('font-size', 12);
          if (name) KB.text(cg, pts[i][0], C.y + 182, name, 'small', 'middle');
        });
      } else {
        // 390: a short vertical line (mark | tier | region | cluster at the right), 34 px apart
        P.forEach(([tier, tone, name, cl], i) => {
          const y = pts[i][1];
          KB.chip(cg, cx0 + 26, y - 10, tier, tone, { caps: true });
          if (name) KB.text(cg, cx0 + 106, y + 4.5, name, 'label').setAttribute('font-size', 12);
          KB.text(cg, cxr, y + 4, cl, 'tag', 'end').setAttribute('font-size', 12);
        });
      }
      el('path', { d: seg(0, 3), class: 't-rail nsl', 'stroke-width': 1 }, cg);
      // the rail lights behind the burst: teal through staging (done), blue into us-east-1 (deploying)
      const r1 = live ? KB.reveal(S, rbox(0, 1), (t) => w(t, s0, s0 + 0.3), { parent: cs, axis: ph ? 'y' : 'x' }).g : cg;
      r1.appendChild(el('path', { d: seg(0, 1), class: 't-teal nsl', 'stroke-width': 1 }, null));
      const r2 = live ? KB.reveal(S, rbox(1, 2), (t) => w(t, s0 + 0.3, s0 + 0.45), { parent: cs, axis: ph ? 'y' : 'x' }).g : cg;
      r2.appendChild(el('path', { d: seg(1, 2), class: 't-act nsl', 'stroke-width': 1 }, null));
      const mk = S.sprite({ ...C, parent: cs });
      for (const [x, y] of pts) el('circle', { cx: x, cy: y, r: 9, class: 'c-fig', style: 'stroke:none' }, mk.g);
      const on = live ? ST : [() => 1, () => 1, () => 1];
      KB.mark(S, pts[0][0], pts[0][1], ['wait', 'rest'], (t) => ({ wait: 1 - on[0](t), rest: on[0](t) }), { parent: cs });
      KB.mark(S, pts[1][0], pts[1][1], ['wait', 'rest'], (t) => ({ wait: 1 - on[1](t), rest: on[1](t) }), { parent: cs });
      KB.mark(S, pts[2][0], pts[2][1], ['wait', 'act'], (t) => ({ wait: 1 - on[2](t), act: on[2](t) }), { parent: cs, loop: LOOP });
      KB.markOne(mk.g, pts[3][0], pts[3][1], 'wait');
      return cs;
    };
    // v6k (b21, row c): the v6j site sheet's blank frame (390 dark, loop t 2.22) was this beat: PREV (plate and values) left
    // 2.18-2.33 while CUR only began at 2.28, so for ~100 ms neither was there. Now PREV's values leave on Enter as before but
    // its plate holds until CUR is opaque over it (2.38), then leaves under it (2.38-2.50).
    view((t) => ({ o: 1 - gone(t), y: 6 * gone(t) }), false, 3.0, (t) => ({ o: 1 - w(t, IN + 0.1, IN + 0.22, 'in') }));
    view((t) => ({ o: w(t, IN, IN + 0.1, 'out'), y: 14 * (1 - inn(t)) }), true, 1.0);
    // ---- the palette's ref row under the field, preselected; Enter presses it. v6j: drawn over the previous change view (the
    // palette is a dropdown over the page; the hub list used to sit lower to leave it room)
    // v6k (b21, row b): inset 8 px inside the change card's sides and 32 px tall from 4 px under the field, so its bottom edge
    // (field + 36) sits clear of the card's title line (cap top at card + 18) at both widths; it closes on Enter (150 ms ease-in)
    const RR = { x: C.x + 8, y: F.y + F.h + 4, w: C.w - 16, h: 32 };
    const ref = (t) => w(t, 1.8, 1.95, 'out') * (1 - w(t, ENTER + 0.06, ENTER + 0.21, 'in'));
    const ent = (t) => w(t, ENTER - 0.06, ENTER, 'out') * (1 - w(t, ENTER, ENTER + 0.06, 'out'));
    const rr = S.sprite({ ...RR, origin: [RR.x + RR.w / 2, RR.y + RR.h / 2], track: tt((t) => ({ o: ref(t), y: -4 * (1 - w(t, 1.8, 1.98, 'out')), s: 1 - 0.015 * ent(t) })) });
    KB.card(rr.g, id, { ...RR, r: 8 });
    el('rect', { x: RR.x + 4.5, y: RR.y + 4.5, width: RR.w - 9, height: RR.h - 9, rx: 5, class: 'c-quiet nsl', 'stroke-width': 1 }, rr.g);
    KB.text(rr.g, RR.x + 16, RR.y + 20.5, 'Open change', 'meta');
    S.label(rr, KB.text(rr.g, RR.x + 98, RR.y + 20.5, '#112', 'monoInk'), (k) => `#${pr(k)}`, 0.6);
    KB.text(rr.g, RR.x + 140, RR.y + 20.5, 'acme/checkout', 'meta').setAttribute('class', 'subtle');
    const kb = { x: RR.x + RR.w - 34, y: RR.y + 7, w: 22, h: 18 };
    el('rect', { x: kb.x + 0.5, y: kb.y + 0.5, width: kb.w - 1, height: kb.h - 1, rx: 4, class: 'c-page nsl', 'stroke-width': 1 }, rr.g);
    KB.text(rr.g, kb.x + kb.w / 2, kb.y + 13, '↵', 'small', 'middle');
    // ---- the pointer: dwell, an eased curved travel, dwell, press, step aside
    const A = ph ? [258, 262] : [366, 262], B = ph ? [168, F.y + 31] : [262, F.y + 31];
    const mv = (t) => w(t, 0.4, 1.05, 'io');
    const leave = (t) => w(t, 1.8, 2.0, 'in');
    const cur = S.sprite({ x: A[0] - 2, y: A[1] - 2, w: 17, h: 23, origin: [A[0], A[1]], track: tt((t) => {
      const m = mv(t), l = leave(t);
      const x = (B[0] - A[0]) * m + Math.sin(m * Math.PI) * 28 + 16 * l, y = (B[1] - A[1]) * m + 12 * l;
      return { x, y, s: 1 - 0.04 * press(t), o: w(t, 0.12, 0.24, 'out') * (1 - l) };   // v6j: the pointer enters at A (120 ms)
    }) });
    KB.cursor(cur.g, A[0], A[1]);
    return S.finish();
  }
});
