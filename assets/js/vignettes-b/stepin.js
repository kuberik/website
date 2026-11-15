/* STEP IN v6k (b19 on b18's v6j: B1 full-width canvas, S6 Pinned status chip, Baked hold 620 ms, dark bake bar; v6j by ic-designer-vignettes-b18; NEW-SECTION-SPEC.md, BRIEF-V6J.md). Composition: a cursor story on ONE object,
   the rollout card of checkout-api in PROD us-east-1 (the section placeholder's card: header with the PROD chip and the
   Pinned chip, a three-row release history, a footer with the note and one button). The cursor is the only other actor.
   Claim: "Step in when a release needs you." A person acts twice: clears a pin, later rolls back. The product does the rest.

   The loop never empties (BRIEF-V6J). One cycle, 8.5 s (v6k; v6j 8.0), from the resolved hold:
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
   Loop 8.5 s (v6k, brief <= 8.5), rest 8.2 (the resolved state holds 7.92 -> 9.42 when the pin clears, 1.5 s, the longest;
   Baked holds 0.62 s, Failed 0.7 s before the row action shows). */
VG.def('stepin', {
  loop: 8.5, rest: 8.2, vb: (ph) => (ph ? [326, 254] : [840, 316]),
  label: 'The rollout card of checkout-api in prod us-east-1: when a release fails its health check, a person rolls it back from the rollout history to the build before it, and Kuberik keeps that build pinned until the person clears the pin; then new builds deploy again',
  build(svg, id, ph) {
    const { el, w, E } = VG;
    const L = 8.5;
    const [VW, VH] = ph ? [326, 254] : [840, 316];
    const S = KB.stage(svg, VW, VH, L);
    KB.defs(svg, id);
    const st = S.base;
    const md = (t) => ((t % L) + L) % L;
    // ---- geometry. r8 (b22, S1): the box is 840 wide and the card 800 x 284, drawn at the features' common unit (1.0 at
    // 1440, 1.15 at >= 1920), so its 14 px rows are 14 px beside the feature cards and the card is ~52 % of the 1200 x 364
    // canvas at 1440 (B1 kept). Before r8:
    // v6k (b19, row B1; the owner removed the actions list, so Step in is ONE full-width canvas). Desktop: the
    // card is 760 x 284 in an 800 x 316 box (20 / 16 margins: the cursor's entry room); the site draws the box at
    // min(100 %, 600px + 22vw) (1440: 917 px, s 1.15, row text 16 px) in a canvas padded 36 / 24, so the card fills ~54 % of
    // the 1200 x 434 canvas (v6j 33 %; Health 58.8 %, GitOps 56.4 % on the site preview). 390: 302 wide at x 12 of the 326
    // phone composition, so with the features' 12 px canvas padding the card sits 24 px from the canvas edge, centred.
    const C = ph ? { x: 12, y: 12, w: 302, h: 230 } : { x: 20, y: 16, w: 800, h: 284 };
    const pad = ph ? 12 : 20, X = C.x, Y = C.y, XR = C.x + C.w - pad;
    const HH = ph ? 45 : 56, LP = ph ? 7 : 8;         // header height, history list padding
    const RH = ph ? 36 : 48, ROW0 = Y + HH + LP + RH / 2;   // row centres ROW0 + RH i
    const FS = ph ? 13 : 14;                          // row text
    const dotX = X + pad + 4, verX = X + pad + (ph ? 20 : 22), whatX = X + (ph ? 112 : 160);
    const FD = Y + HH + 2 * LP + 3 * RH;              // footer divider
    const T = (p, x, y, s, fs, fw, cls, anchor = 'start') => { const n = el('text', { x, y, 'font-size': fs, 'font-weight': fw, class: cls, 'text-anchor': anchor }, p); n.textContent = s; return n; };
    // ---- the frame, painted once
    KB.card(st, id, { ...C, r: 8 });
    const hc = Y + HH / 2;                            // header centre line
    T(st, X + pad, hc + 5, 'checkout-api', ph ? 13 : 15, 600, 'ink');
    // r8 (b22, nit): the header's gaps are 10.5 / 11.5 px at 390 and 1440 (v6k phone 5 / 6), the Pinned chip compact on the phone
    KB.chip(st, X + pad + (ph ? 96 : 110), hc - (ph ? 9 : 10), 'PROD', 'prod', { caps: true, h: ph ? 18 : 20 });
    T(st, X + pad + (ph ? 147 : 161), hc + 4.5, 'us-east-1', ph ? 12 : 14, 500, 'muted');
    KB.divider(st, C.x, C.x + C.w, Y + HH);
    KB.divider(st, C.x, C.x + C.w, FD);

    // ---- the beats (loop seconds)
    // v6k (b19, nit): builds arrive 1.62 s apart (v6j 1.05), so "Baked" is fully in at 1.00 and holds 620 ms before the
    // next build arrives and the rows slide (v6j: 50-80 ms). The loop stretches 8.0 -> 8.5 s for it; the resolved hold
    // (Pinned, Running, rolled back: 7.92 -> 9.95, until the pin clears) stays the longest.
    const SH = [1.70, 3.32, 4.94];                    // a build arrives at the top (rows slide 250 ms io)
    const PROG = 0.40, BAKED = 0.85, FAIL = 0.95;     // since a build's arrival: Deploying -> Baking -> Baked | Failed
    const P1 = 1.34, A1 = 1.42;                       // press Clear pin; the pin clears
    const HOV = 6.75, P2 = 7.09, A2 = 7.17;           // the row action shows; press; the rollback is set (Pinned)
    const HALF = 4.5;                                 // splits the two acts (pin cleared early, rollback late)
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
    const LW = S.sprite({ x: X + 1, y: Y + HH + 1, w: C.w - 2, h: FD - Y - HH - 1, clip: true });
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
        const hov = S.sprite({ ...rowBox, parent: row, track: (t) => ({ o: t > HALF ? w(t, HOV, HOV + 0.12, 'out') * (1 - w(t, RUN + 0.06, RUN + 0.19, 'in')) : 0 }) });
        el('rect', { x: rowBox.x, y: rowBox.y, width: rowBox.w, height: rowBox.h, class: 'row-hover' }, hov.g);
      }
      const bandEnd = r === 2 ? FAIL - 0.05 : BAKED;
      const fill = (q) => (r === 2 ? w(Math.min(q, bandEnd), PROG, PROG + 0.7, 'lin') : w(q, PROG, BAKED, 'lin'));
      const bandP = KB.reveal(S, rowBox, (t) => { const q = tau(t); return q < PROG || q > 2 ? 0 : fill(q); }, { parent: row });
      const bp = S.sprite({ ...rowBox, parent: bandP, track: (t) => { const q = tau(t); return { o: q < 2 ? 1 - w(q, r === 2 ? FAIL : BAKED, (r === 2 ? FAIL : BAKED) + 0.15, r === 2 ? 'io' : 'in') : 0 }; } });
      // v6k (b19, nit): the bake wash is Step in's own (light: the pale prog tint; dark: the card's neutral lift, no yellow,
      // which over the teal card always lands on olive) and the bake is carried by a 2 px bar in the dashboard's baking
      // solid along the row's foot (--b-prog-fill: light oklch(.76 .16 92), dark oklch(.84 .15 98)), filling with the bake
      el('rect', { x: rowBox.x, y: rowBox.y, width: rowBox.w, height: rowBox.h, class: 'si-bake' }, bp.g);
      el('rect', { x: rowBox.x, y: rowBox.y + rowBox.h - 2, width: rowBox.w, height: 2, class: 'si-bake-bar' }, bp.g);
      // r8 (b22, nit): the fail wash is the row's own child, not the bake reveal's: under the reveal it stopped where the bake
      // had reached (~70 % of the row) with a hard right edge, and read clipped. It flashes over the whole row.
      if (r === 2) {
        const bf = S.sprite({ ...rowBox, parent: row, track: (t) => { const q = tau(t); return { o: q < 2 ? w(q, FAIL, FAIL + 0.15, 'io') * (1 - w(q, FAIL + 0.45, FAIL + 0.7, 'in')) : 0 }; } });
        el('rect', { x: rowBox.x, y: rowBox.y, width: rowBox.w, height: rowBox.h, class: 'band-fail' }, bf.g);
        el('rect', { x: rowBox.x, y: rowBox.y + rowBox.h - 2, width: rowBox.w, height: 2, class: 'si-fail-bar' }, bf.g);
      }
      // the mark, the version, the state word
      const marks = [...new Set(sc.map((c) => c[1]))];
      const mw = xf(sc.map((c) => [c[0], c[1]]));
      KB.markX(S, dotX, ROW0, marks, (t) => mw(tau(t)), { parent: row, loop: L });
      // the version sits in its own (static) child so it paints above the row's tint, hover wash and band
      const vt = S.sprite({ x: verX - 2, y: ROW0 - 10, w: whatX - verX, h: 20, parent: row });
      S.label(vt, T(vt.g, verX, ROW0 + 4.5, ver(44 + r), FS, 500, 'mono ink'), vOf(r), md(SH[r] - 0.12));
      const words = [...new Set(sc.map((c) => c[2]))];
      const ww = seq(sc.map((c) => [c[0], c[2]]));
      for (const s of words) {
        const sp = S.sprite({ x: whatX - 2, y: ROW0 - 10, w: XR - whatX + 4, h: 20, parent: row, track: (t) => ({ o: ww(tau(t))[s] || 0 }) });
        T(sp.g, whatX, ROW0 + 4.5, WORD[s], FS, 400, wordCls(s));
      }
      // role 2: the row's hover action, "Roll back to this" (shows when the pointer reaches the row, pressed, then leaves)
      if (r === 1) {
        const bh = ph ? 24 : 28, afs = ph ? 12 : 13, bw = Math.round(ACT_LABEL.length * afs * 0.54 + 24);
        const act = S.sprite({ x: ACT_X - bw - 2, y: ROW0 - bh / 2 - 2, w: bw + 4, h: bh + 4, parent: row, origin: [ACT_X - bw / 2, ROW0],
          track: (t) => ({ o: t > HALF ? w(t, HOV, HOV + 0.12, 'out') * (1 - w(t, A2, A2 + 0.13, 'in')) : 0, s: 1 - 0.04 * press2(t) }) });
        KB.button(act.g, ACT_X, ROW0, ACT_LABEL, { h: bh, fs: afs });
      }
      // the exit twin: the row's last state at slot 2; opaque from HAND - 30 ms (it overlaps the row by 3 samples, identical
      // pixels, so no compositor frame ever interpolates both at half opacity), takes over at HAND, slides out under the footer and fades (150 ms in)
      const last = sc[sc.length - 1];
      const ex = S.sprite({ ...rowBox, parent: LW, track: (t) => { const q = tau(t); return q >= HAND - 0.03 ? { o: 1, y: 2 * RH } : q <= 0.3 ? { o: 1 - w(q, 0, 0.15, 'in'), y: RH * (2 + w(q, 0, 0.25, 'io')) } : { o: 0, y: q < 1.5 ? 3 * RH : 2 * RH }; } });
      KB.markOneX(ex.g, dotX, ROW0, last[1]);
      S.label(ex, T(ex.g, verX, ROW0 + 4.5, ver(41 + r), FS, 500, 'mono ink'), vOf(r), md(SH[r] + 1.0));
      T(ex.g, whatX, ROW0 + 4.5, WORD[last[2]], FS, 400, wordCls(last[2]));
    }

    // ---- the header's Pinned chip: leaves when the pin clears (150 ms in), springs in (3 %) when the rollback pins
    const pinned = (t) => (t < HALF ? 1 - w(t, A1, A1 + 0.15, 'in') : w(t, A2, A2 + 0.12, 'out'));
    const pc = S.sprite({ x: XR - 84, y: hc - 13, w: 86, h: 26, origin: [XR - 38, hc], track: (t) => ({ o: pinned(t), s: t < HALF ? 1 - 0.04 * w(t, A1, A1 + 0.15, 'in') : 0.94 + 0.06 * w(t, A2, A2 + 0.25, 'spring') }) });
    KB.pinChip(pc.g, XR, hc, 'Pinned', { compact: ph });

    // ---- the footer: the pinned note + Clear pin, or the unpinned note
    const press1 = (t) => w(t, P1, P1 + 0.04, 'out') * (1 - w(t, P1 + 0.04, P1 + 0.12, 'out'));
    const pinIn = (t) => (t < HALF ? 1 - w(t, A1, A1 + 0.13, 'in') : w(t, A2 + 0.13, A2 + 0.26, 'out'));
    const freeIn = (t) => (t < HALF ? w(t, A1 + 0.13, A1 + 0.26, 'out') : 1 - w(t, A2, A2 + 0.13, 'in'));
    const fy = FD + (C.y + C.h - FD) / 2;            // footer centre line
    const nPin = S.sprite({ x: X + pad - 2, y: FD + 4, w: C.w - 2 * pad - 80, h: C.y + C.h - FD - 8, track: (t) => ({ o: pinIn(t) }) });
    if (ph) { T(nPin.g, X + pad, fy - 4.5, 'Nothing newer deploys', 12, 400, 'subtle'); T(nPin.g, X + pad, fy + 12.5, 'until the pin is cleared.', 12, 400, 'subtle'); }
    else T(nPin.g, X + pad, fy + 4.5, 'Nothing newer deploys until the pin is cleared.', 13, 400, 'subtle');
    const nFree = S.sprite({ x: X + pad - 2, y: FD + 4, w: C.w - 2 * pad, h: C.y + C.h - FD - 8, track: (t) => ({ o: freeIn(t) }) });
    T(nFree.g, X + pad, fy + (ph ? 4 : 4.5), 'Each build deploys once its gates pass.', ph ? 12 : 13, 400, 'subtle');
    const btnBox = { x: XR - 96, y: fy - 19, w: 98, h: 38 };
    const btn = S.sprite({ ...btnBox, origin: [XR - 40, fy], track: (t) => ({ o: t < HALF ? 1 - w(t, A1 + 0.04, A1 + 0.17, 'in') : w(t, A2 + 0.13, A2 + 0.26, 'out'), s: t < HALF ? 1 - 0.04 * press1(t) : 0.97 + 0.03 * w(t, A2 + 0.13, A2 + 0.35, 'spring') }) });
    KB.button(btn.g, XR, fy, 'Clear pin', ph ? {} : { h: 34, fs: 14 });

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
    pointer(ph ? [304, 248] : [812, 306], bc, 0.45, 0.57, 1.12, P1, 1.52, ph ? 10 : 18);
    const rc = [ACT_X - 52, ROW0 + RH + 2];
    pointer(ph ? [308, 244] : [818, 290], rc, 6.16, 6.28, 6.84, P2, RUN + 0.06, ph ? 14 : 22);
    return S.finish(null);   // no root track: the frame never fades
  }
});
