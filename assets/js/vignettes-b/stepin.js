/* STEP IN v6j (ic-designer-vignettes-b18; NEW-SECTION-SPEC.md, BRIEF-V6J.md). Composition: a cursor story on ONE object,
   the rollout card of checkout-api in PROD us-east-1 (the section placeholder's card: header with the PROD chip and the
   Pinned chip, a three-row release history, a footer with the note and one button). The cursor is the only other actor.
   Claim: "Step in when a release needs you." A person acts twice: clears a pin, later rolls back. The product does the rest.

   The loop never empties (BRIEF-V6J). One cycle, 8.0 s, from the resolved hold:
     pinned on 4.45.0-45 (4.46.0-46 failed)  ->  the person clears the pin  ->  4.47.0-47 arrives at the top of the history
     (the rows slide down one), deploys, bakes, Baked  ->  4.48.0-48 likewise  ->  4.49.0-49 arrives, deploys, bakes, and
     FAILS (error-rate over 1%)  ->  the person rolls back to 4.48.0-48 from its row ("Roll back to this")  ->  Pinned,
     4.48.0-48 deploys and runs, rolled back  ->  the resolved hold (rest) = the placeholder's frame, three versions on.
   Why three builds a cycle, not two (the brief proposed: fix deploys, then the next one fails): the rest frame must equal the
   placeholder in every cycle (Failed / Running, rolled back / Baked). With +2 a cycle, last cycle's failed build sits in row
   three at rest and that row would read Failed, two failures on screen. +3 keeps every row truthful, and it answers the
   "a product that always fails" worry on its own: two builds deploy and bake untouched for every one that needs a person.
   Labels: versions advance by 3 a cycle through S.label (44/45/46 at cycle 0's rest, 47/48/49 at cycle 1's ...).

   Mechanics. The history is a clipped window; each history row is ONE row object per role (role 1 = the first healthy build
   of the cycle, 2 = the second, the one later rolled back to, 3 = the failing one). A row object lives exactly one loop: it
   enters at the top at its shift, slides down at the next two shifts, and leaves at the bottom at its own shift one loop
   later. Since the entering and the leaving row of a shift are the same role, the leaving one is a twin ("exit") sprite that
   takes over from the row 0.25 s before the shift (identical pixels: same mark state, same text, same label), slides out and
   fades; the row itself, hidden, rewrites its version label and enters at the top. No frame element ever moves or fades:
   the card, header, dividers and footer are painted once.

   New in the kit (kb-stepin.js / .css, a pure addition): the `fail` StatusMark state in the dashboard's danger hue
   (--k-danger-*, light and dark), the thumbtack glyph, KB.pinChip, KB.button.
   Deviations from NEW-SECTION-SPEC: the failure shows no "Retry" footer button (the row action is the one action drawn, one
   change at a time); at 390 the row action sits at the row's right end as at 1440 (the state word beside it is "Baked",
   short, so it fits and no row height changes); 390 keeps the reason text, as the placeholder does.
   Loop 8.0 s (brief range 6-8), rest 7.0 (resolved hold 7.0 -> 8.45, 1.45 s, the longest). */
VG.def('stepin', {
  loop: 8.0, rest: 7.0, vb: (ph) => (ph ? [326, 270] : [640, 320]),
  label: 'checkout-api in prod us-east-1: a person clears the pin, two builds deploy and bake, 4.49.0-49 fails its health check, the person rolls back to 4.48.0-48, which deploys, runs and stays pinned',
  build(svg, id, ph) {
    const { el, w, E } = VG;
    const L = 8.0;
    const [VW, VH] = ph ? [326, 270] : [640, 320];
    const S = KB.stage(svg, VW, VH, L);
    KB.defs(svg, id);
    const st = S.base;
    const md = (t) => ((t % L) + L) % L;
    // ---- geometry (the placeholder's card: 460 x 224 at 1440, 324 x 230 at 390)
    const C = ph ? { x: 1, y: 8, w: 324, h: 230 } : { x: 90, y: 48, w: 460, h: 224 };
    const pad = ph ? 12 : 16, X = C.x, Y = C.y, XR = C.x + C.w - pad;
    const RH = 36, ROW0 = Y + 70;                     // row centres ROW0 + 36 i
    const dotX = X + pad + 4, verX = X + pad + 20, whatX = X + (ph ? 120 : 140);
    const FD = Y + 167;                               // footer divider
    const T = (p, x, y, s, fs, fw, cls, anchor = 'start') => { const n = el('text', { x, y, 'font-size': fs, 'font-weight': fw, class: cls, 'text-anchor': anchor }, p); n.textContent = s; return n; };
    // ---- the frame, painted once
    KB.card(st, id, { ...C, r: 8 });
    T(st, X + pad, Y + 28, 'checkout-api', 14, 600, 'ink');
    KB.chip(st, X + pad + 101, Y + 14, 'PROD', 'prod', { caps: true, h: 18 });
    T(st, X + pad + 150, Y + 27.5, 'us-east-1', 13, 500, 'muted');
    KB.divider(st, C.x, C.x + C.w, Y + 45);
    KB.divider(st, C.x, C.x + C.w, FD);

    // ---- the beats (loop seconds)
    const SH = [1.80, 2.85, 3.90];                    // a build arrives at the top (rows slide 250 ms io)
    const PROG = 0.40, BAKED = 0.85, FAIL = 0.95;     // since a build's arrival: Deploying -> Baking -> Baked | Failed
    const P1 = 1.34, A1 = 1.42;                       // press Clear pin; the pin clears
    const HOV = 5.71, P2 = 6.05, A2 = 6.13;           // the row action shows; press; the rollback is set (Pinned)
    const RB = A2 + 0.10, RUN = A2 + 0.60;            // 4.48 deploys; runs, rolled back
    const DEM = SH[0] + 0.55;                         // the next cycle: once 4.47' deploys, the old rolled-back row is just Baked
    const ver = (n) => `4.${n}.0-${n}`;
    const vOf = (r) => (k) => ver(41 + 3 * k + r);    // r = 0, 1, 2; k = 1 at cycle 0's rest -> 44, 45, 46

    // state machines over a role's own clock tau (seconds since it arrived). seq = words (old out 70 ms in, new in 80 ms out);
    // xf = marks (150 ms io crossfade)
    const seq = (ch) => (tau) => {
      let cur = ch[0][1];
      for (let i = 1; i < ch.length; i++) {
        const [a, s] = ch[i];
        if (tau < a) break;
        if (tau < a + 0.15) { const o = {}; o[cur] = 1 - w(tau, a, a + 0.07, 'in'); o[s] = (o[s] || 0) + w(tau, a + 0.07, a + 0.15, 'out'); return o; }
        cur = s;
      }
      return { [cur]: 1 };
    };
    const xf = (ch) => (tau) => {
      let cur = ch[0][1];
      for (let i = 1; i < ch.length; i++) {
        const [a, s] = ch[i];
        if (tau < a) break;
        if (tau < a + 0.15) { const p = w(tau, a, a + 0.15, 'io'); const o = {}; o[cur] = 1 - p; o[s] = (o[s] || 0) + p; return o; }
        cur = s;
      }
      return { [cur]: 1 };
    };
    const tauOf = (r) => (t) => md(t - SH[r]);
    const D = [0, 1, 2].map((r) => [0, md(SH[(r + 1) % 3] - SH[r]), md(SH[(r + 2) % 3] - SH[r])]);
    const HAND = L - 0.25;                            // the exit twin takes over 250 ms before the role's next arrival

    // ---- the history window (clips rows entering above slot 0 and leaving below slot 2)
    const LW = S.sprite({ x: X + 1, y: Y + 46, w: C.w - 2, h: FD - Y - 46, clip: true });
    const rowBox = { x: X + 1, y: ROW0 - RH / 2, w: C.w - 2, h: RH };
    const WORD = { dep: 'Deploying', bake: 'Baking', baked: 'Baked', fail: 'Failed: error-rate over 1%', run: 'Running, rolled back' };
    const wordCls = (s) => (s === 'fail' ? 'fail-ink' : s === 'run' ? 'ink' : 'muted');
    // role scripts: [tau, mark, word]
    const tR2 = (t) => md(t - SH[1]);
    const SCRIPT = [
      [[0, 'act', 'dep'], [PROG, 'prog', 'bake'], [BAKED, 'rest', 'baked']],
      [[0, 'act', 'dep'], [PROG, 'prog', 'bake'], [BAKED, 'rest', 'baked'], [tR2(RB), 'act', 'dep'], [tR2(RUN), 'rest', 'run'], [tR2(DEM), 'rest', 'baked']],
      [[0, 'act', 'dep'], [PROG, 'prog', 'bake'], [FAIL, 'fail', 'fail']]
    ];
    const ACT_X = XR, ACT_LABEL = 'Roll back to this';
    const press2 = (t) => w(t, P2, P2 + 0.04, 'out') * (1 - w(t, P2 + 0.04, P2 + 0.12, 'out'));
    for (let r = 0; r < 3; r++) {
      const tau = tauOf(r), sc = SCRIPT[r];
      const slot = (q) => -1 + D[r].reduce((a, d) => a + w(q, d, d + 0.25, 'io'), 0);
      const row = S.sprite({ ...rowBox, parent: LW, track: (t) => { const q = tau(t); return { o: q >= HAND ? 0 : w(q, 0.04, 0.19, 'out'), y: RH * slot(q) }; } });
      // under the text: the rolled-back tint, the hover wash, the bake band (Health's band, row-high)
      if (r === 1) {
        const tint = S.sprite({ ...rowBox, parent: row, track: (t) => { const q = tau(t); return { o: w(q, tR2(RUN), tR2(RUN) + 0.15, 'out') * (1 - w(q, tR2(DEM), tR2(DEM) + 0.15, 'in')) }; } });
        el('rect', { x: rowBox.x, y: rowBox.y, width: rowBox.w, height: rowBox.h, class: 'row-run' }, tint.g);
        const hov = S.sprite({ ...rowBox, parent: row, track: (t) => ({ o: t > 4 ? w(t, HOV, HOV + 0.12, 'out') * (1 - w(t, RUN + 0.06, RUN + 0.19, 'in')) : 0 }) });
        el('rect', { x: rowBox.x, y: rowBox.y, width: rowBox.w, height: rowBox.h, class: 'row-hover' }, hov.g);
      }
      const bandEnd = r === 2 ? FAIL - 0.05 : BAKED;
      const fill = (q) => (r === 2 ? w(Math.min(q, bandEnd), PROG, PROG + 0.7, 'lin') : w(q, PROG, BAKED, 'lin'));
      const bandP = KB.reveal(S, rowBox, (t) => { const q = tau(t); return q < PROG || q > 2 ? 0 : fill(q); }, { parent: row });
      const bp = S.sprite({ ...rowBox, parent: bandP, track: (t) => { const q = tau(t); return { o: q < 2 ? 1 - w(q, r === 2 ? FAIL : BAKED, (r === 2 ? FAIL : BAKED) + 0.15, r === 2 ? 'io' : 'in') : 0 }; } });
      el('rect', { x: rowBox.x, y: rowBox.y, width: rowBox.w, height: rowBox.h, class: 'band-prog' }, bp.g);
      if (r === 2) {
        const bf = S.sprite({ ...rowBox, parent: bandP, track: (t) => { const q = tau(t); return { o: q < 2 ? w(q, FAIL, FAIL + 0.15, 'io') * (1 - w(q, FAIL + 0.45, FAIL + 0.7, 'in')) : 0 }; } });
        el('rect', { x: rowBox.x, y: rowBox.y, width: rowBox.w, height: rowBox.h, class: 'band-fail' }, bf.g);
      }
      // the mark, the version, the state word
      const marks = [...new Set(sc.map((c) => c[1]))];
      const mw = xf(sc.map((c) => [c[0], c[1]]));
      KB.markX(S, dotX, ROW0, marks, (t) => mw(tau(t)), { parent: row, loop: L });
      // the version sits in its own (static) child so it paints above the row's tint, hover wash and band
      const vt = S.sprite({ x: verX - 2, y: ROW0 - 10, w: whatX - verX, h: 20, parent: row });
      S.label(vt, T(vt.g, verX, ROW0 + 4.5, ver(44 + r), 13, 500, 'mono ink'), vOf(r), md(SH[r] - 0.12));
      const words = [...new Set(sc.map((c) => c[2]))];
      const ww = seq(sc.map((c) => [c[0], c[2]]));
      for (const s of words) {
        const sp = S.sprite({ x: whatX - 2, y: ROW0 - 10, w: XR - whatX + 4, h: 20, parent: row, track: (t) => ({ o: ww(tau(t))[s] || 0 }) });
        T(sp.g, whatX, ROW0 + 4.5, WORD[s], 13, 400, wordCls(s));
      }
      // role 2: the row's hover action, "Roll back to this" (shows when the pointer reaches the row, pressed, then leaves)
      if (r === 1) {
        const bh = 24, bw = Math.round(ACT_LABEL.length * 12 * 0.54 + 20);
        const act = S.sprite({ x: ACT_X - bw - 2, y: ROW0 - bh / 2 - 2, w: bw + 4, h: bh + 4, parent: row, origin: [ACT_X - bw / 2, ROW0],
          track: (t) => ({ o: t > 4 ? w(t, HOV, HOV + 0.12, 'out') * (1 - w(t, A2, A2 + 0.13, 'in')) : 0, s: 1 - 0.04 * press2(t) }) });
        KB.button(act.g, ACT_X, ROW0, ACT_LABEL, { h: bh, fs: 12 });
      }
      // the exit twin: the row's last state at slot 2; takes over at HAND, slides out under the footer and fades (150 ms in)
      const last = sc[sc.length - 1];
      const ex = S.sprite({ ...rowBox, parent: LW, track: (t) => { const q = tau(t); return q >= HAND ? { o: 1, y: 2 * RH } : q <= 0.3 ? { o: 1 - w(q, 0, 0.15, 'in'), y: RH * (2 + w(q, 0, 0.25, 'io')) } : { o: 0, y: 3 * RH }; } });
      KB.markOneX(ex.g, dotX, ROW0, last[1]);
      S.label(ex, T(ex.g, verX, ROW0 + 4.5, ver(41 + r), 13, 500, 'mono ink'), vOf(r), md(SH[r] + 1.0));
      T(ex.g, whatX, ROW0 + 4.5, WORD[last[2]], 13, 400, wordCls(last[2]));
    }

    // ---- the header's Pinned chip: leaves when the pin clears (150 ms in), springs in (3 %) when the rollback pins
    const pinned = (t) => (t < 4 ? 1 - w(t, A1, A1 + 0.15, 'in') : w(t, A2, A2 + 0.12, 'out'));
    const pc = S.sprite({ x: XR - 80, y: Y + 10, w: 82, h: 26, origin: [XR - 36, Y + 23], track: (t) => ({ o: pinned(t), s: t < 4 ? 1 - 0.04 * w(t, A1, A1 + 0.15, 'in') : 0.94 + 0.06 * w(t, A2, A2 + 0.25, 'spring') }) });
    KB.pinChip(pc.g, XR, Y + 23);

    // ---- the footer: the pinned note + Clear pin, or the unpinned note
    const press1 = (t) => w(t, P1, P1 + 0.04, 'out') * (1 - w(t, P1 + 0.04, P1 + 0.12, 'out'));
    const pinIn = (t) => (t < 4 ? 1 - w(t, A1, A1 + 0.13, 'in') : w(t, A2 + 0.13, A2 + 0.26, 'out'));
    const freeIn = (t) => (t < 4 ? w(t, A1 + 0.13, A1 + 0.26, 'out') : 1 - w(t, A2, A2 + 0.13, 'in'));
    const fy = FD + (ph ? 32 : 29);
    const nPin = S.sprite({ x: X + pad - 2, y: FD + 4, w: C.w - 2 * pad - 80, h: C.y + C.h - FD - 8, track: (t) => ({ o: pinIn(t) }) });
    if (ph) { T(nPin.g, X + pad, fy - 5, 'Nothing newer deploys until the pin', 12, 400, 'subtle'); T(nPin.g, X + pad, fy + 13, 'is cleared.', 12, 400, 'subtle'); }
    else T(nPin.g, X + pad, fy + 4, 'Nothing newer deploys until the pin is cleared.', 12, 400, 'subtle');
    const nFree = S.sprite({ x: X + pad - 2, y: FD + 4, w: C.w - 2 * pad, h: C.y + C.h - FD - 8, track: (t) => ({ o: freeIn(t) }) });
    T(nFree.g, X + pad, fy + 4, 'Each build deploys once its gates pass.', 12, 400, 'subtle');
    const btnBox = { x: XR - 84, y: fy - 17, w: 86, h: 34 };
    const btn = S.sprite({ ...btnBox, origin: [XR - 40, fy], track: (t) => ({ o: t < 4 ? 1 - w(t, A1 + 0.04, A1 + 0.17, 'in') : w(t, A2 + 0.13, A2 + 0.26, 'out'), s: t < 4 ? 1 - 0.04 * press1(t) : 0.97 + 0.03 * w(t, A2 + 0.13, A2 + 0.35, 'spring') }) });
    KB.button(btn.g, XR, fy, 'Clear pin');

    // ---- the pointer (a person acts): enters, an eased slightly curved travel, dwells, presses, steps aside
    const pointer = (A, B, tin, t0, t1, tp, tl, bend) => {
      const s = S.sprite({ x: A[0] - 2, y: A[1] - 2, w: 17, h: 23, origin: [A[0], A[1]], track: (t) => {
        if (t < tin - 0.01 || t > tl + 0.25) return { o: 0, x: 0, y: 0 };
        const m = w(t, t0, t1, 'io'), l = w(t, tl, tl + 0.2, 'in');
        const pr = w(t, tp, tp + 0.04, 'out') * (1 - w(t, tp + 0.04, tp + 0.12, 'out'));
        return { x: (B[0] - A[0]) * m + Math.sin(m * Math.PI) * bend + 14 * l, y: (B[1] - A[1]) * m + 10 * l, s: 1 - 0.06 * pr, o: w(t, tin, tin + 0.12, 'out') * (1 - l) };
      } });
      KB.cursor(s.g, A[0], A[1]);
    };
    const bc = [XR - 38, fy + 2];
    pointer(ph ? [300, 258] : [612, 300], bc, 0.45, 0.57, 1.12, P1, 1.52, ph ? 10 : 18);
    const rc = [ACT_X - 52, ROW0 + RH + 2];
    pointer(ph ? [306, 252] : [618, 252], rc, 5.12, 5.24, 5.80, P2, RUN + 0.06, ph ? 14 : 22);
    return S.finish(null);   // no root track: the frame never fades
  }
});
