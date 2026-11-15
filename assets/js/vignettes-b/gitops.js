/* GITOPS v6h (b14 fix 5): the climax is the hand-off. No edge light on the Kustomization. Kuberik's wire stays lit from its
   write until Flux reports; on ONE frame (RD 2.40) Flux's three wires light, the Deployment, Service and HPA and the
   Kustomization go Ready, and Kuberik's wire goes quiet (its light leaves, 150 ms ease-in): Flux is in charge from then on.
   Flux's packets now run on its quiet wires (1.25-1.6); the wires light on the Ready beat, not behind the packets.
   Was GITOPS v6g (climax audit: the Kustomization's Ready lands as a beat, its edge lights as the last resource is Ready).
   Was GITOPS v6e (b-r4 fixes 1-4: old chip gone by 0.71 before the new springs at 0.72; kuberik glyph on the node; caption
   postBuild.substitute.version / substitute.version with no trailing label; 390 node 92 wide, card at x 132: 28 px of wire
   outside the card). Was GITOPS v6d (kit v6, v4's style). Composition: ONE WIRE, ONE SLOT (work/gitops-concepts.md, concept 1). Replaces v6c's
   split-flap board (owner ruling 2026-11-14: no flipping counters, no device lifted from Railway).
   Claim: "Flux stays in charge of your cluster." / "It sets one version in your Flux objects, and Flux does the rest."
   Truth: Kuberik writes exactly one value, the version substituted into an annotated Flux Kustomization (postBuild
   substitute), and never applies anything. Flux reconciles, applies, and the workloads go Ready.
   The drawing states it: Kuberik is a small node OUTSIDE the Kustomization; its only wire pierces the card's edge and ends at
   the version slot. That wire lights (300 ms), the old version chip leaves whole (150 ms ease-in, 5 px down) and the new one
   sets into the slot (spring 250 ms, from 6 px above), the wire goes dark: Kuberik's act is over. Everything after it is
   Flux's: the Kustomization's mark turns (reconciling, blue), Flux's wires light (350 ms) and the Deployment, Service and
   HPA reconcile and go Ready (bursts 120 ms apart). Loop 4.8 s, rest 3.4 (resolved hold 1.2 s, empty beat 0.5 s).
   Borrowed proportions: the card / chip / StatusMark / wire kit of Gates and Health; the Flux fan-out is v6c's, unchanged. */
/* v6j (b17): the loop never empties; each cycle writes the NEXT version. The chip that set into the slot at the end of cycle n
   IS the chip that leaves at the start of cycle n+1 (both 'build' tone, both read the same label), so the seam is a hand-over
   of identical pixels. Flux's lit wires go quiet (150 ms ease-in) on the beat Kuberik's wire starts lighting (0.35): the
   source changed, Flux is out of sync until the hand-off (RD) lights them again. Kuberik's lit layer re-arms while invisible.
   Versions advance through S.label: 4.45 -> 4.46 at rest of cycle 0, 4.46 -> 4.47 in cycle 1, ... Loop 4.2 s (was 4.8 with
   a 0.5 s empty beat), rest 3.4 (resolved hold 2.6 -> 4.55). */
VG.def('gitops', {
  loop: 4.2, rest: 3.4, vb: (ph) => (ph ? [326, 300] : [430, 280]),
  label: 'Kuberik sets one value, version 4.46.0-46, in the checkout-api Flux Kustomization; Flux reconciles Deployment, Service and HPA, which go Ready',
  build(svg, id, ph) {
    const { el, w } = VG;
    const LOOP = 4.2;
    const [W, H] = ph ? [326, 300] : [430, 280];
    const S = KB.stage(svg, W, H, LOOP);
    KB.defs(svg, id);
    const st = S.base;
    const tt = (fn) => fn;   // v6j: no exit; every track is continuous across the seam or hands over identical pixels
    const ver = (k) => `4.${45 + k}.0-${45 + k}`;
    // ---- geometry: Kuberik's node left of the Kustomization, on the slot's line
    const C = ph ? { x: 132, y: 16, w: 182, h: 128 } : { x: 150, y: 18, w: 264, h: 136 };
    const px = C.x + (ph ? 16 : 18);
    const from = '4.45.0-45', to = '4.46.0-46';
    const chW = Math.round(from.length * 7.23 + 14);
    const SL = { x: px, y: C.y + (ph ? 80 : 88), w: chW + 10, h: 30 };
    const Fy = SL.y + SL.h / 2;
    const N = ph ? { x: 12, y: Fy - 17, w: 92, h: 34 } : { x: 16, y: Fy - 17, w: 104, h: 34 };
    // ---- Kuberik (outside the Kustomization; it only ever reaches the one slot)
    KB.card(st, id, { ...N, r: 8 });
    // v6e (b-r4 fix 2): kuberik's glyph before the word, neutral ink, 14 px (Gates' node icons)
    KB.kglyph(st, N.x + (ph ? 17 : 19), Fy, 14);
    KB.text(st, N.x + (ph ? 30 : 32), Fy + 4.5, 'Kuberik', 'label');
    // ---- the Kustomization (the subject: the thesis tile)
    KB.card(st, id, { ...C, tone: 'fig' });
    if (ph) {
      KB.text(st, px, C.y + 25, 'Kustomization', 'tag');
      KB.text(st, px, C.y + 45, 'checkout-api', 'label');
    } else {
      KB.text(st, px, C.y + 28, 'Kustomization', 'tag');
      KB.text(st, px + 102, C.y + 28, 'checkout-api', 'label');
      KB.text(st, px, C.y + 48, 'flux-system / prod us-east-1', 'tag');
    }
    // v6e (b-r4 fix 3): the key reads as a path above the value; no trailing 'version' label
    KB.text(st, px, SL.y - 10, ph ? 'substitute.version' : 'postBuild.substitute.version', 'tag');
    // the slot: a quiet 1 px well; it lines teal while Kuberik writes
    el('rect', { x: SL.x + 0.5, y: SL.y + 0.5, width: SL.w - 1, height: SL.h - 1, rx: 8, class: 'c-div nsl', 'stroke-width': 1 }, st);
    const slotHi = S.sprite({ x: SL.x - 1, y: SL.y - 1, w: SL.w + 2, h: SL.h + 2, track: tt((t) => ({ o: w(t, 0.55, 0.7, 'out') * (1 - w(t, 1.35, 1.6)) })) });
    el('rect', { x: SL.x + 0.5, y: SL.y + 0.5, width: SL.w - 1, height: SL.h - 1, rx: 8, class: 'fl-hl nsl', 'stroke-width': 1 }, slotHi.g);
    // ---- Kuberik's one wire: node edge -> slot edge, piercing the card's edge (drawn over the card)
    const wx1 = N.x + N.w, wx2 = SL.x - 1;
    const dK = `M${wx1} ${Fy}H${wx2}`, chK = VG.chevron(wx2, Fy);
    KB.path(st, dK, 'w-q', chK);
    // v6h: the hand-off beat. Kuberik's wire stays lit until Flux's side goes Ready, and goes quiet on that frame
    const RD = 2.40;
    // v6j: after the hand-off the lit layer re-arms while invisible (its reveal rewinds at 3.0, the layer returns at 3.1)
    const wireOn = S.sprite({ x: wx1 - 6, y: Fy - 8, w: wx2 - wx1 + 12, h: 16, track: tt((t) => ({ o: t >= 3.1 ? 1 : 1 - w(t, RD, RD + 0.15, 'in') })) });
    KB.path(KB.reveal(S, { x: wx1 - 1, y: Fy - 6, w: wx2 - wx1 + 2, h: 12 }, tt((t) => (t >= 3.0 ? 0 : w(t, 0.35, 0.65, 'io'))), { axis: 'x', parent: wireOn }).g, dK, 'w-lit', chK);
    // ---- the one value: the old chip leaves whole, the new one sets into the slot
    const cx = SL.x + 5, cy = SL.y + 5;
    const oldC = S.sprite({ x: cx - 2, y: cy - 2, w: chW + 4, h: 30, track: tt((t) => { const p = w(t, 0.56, 0.71, 'in'); return { o: 1 - p, y: 5 * p }; }) });
    // v6j: the outgoing chip is the one that set in last cycle (same tone, same label); its text is rewritten at 2.0 (hidden)
    S.label(oldC, KB.chip(oldC.g, cx, cy, from, 'build', { mono: true }).t, ver, 2.0);
    const newC = S.sprite({ x: cx - 2, y: cy - 2, w: chW + 4, h: 24, track: tt((t) => { const p = w(t, 0.72, 0.97, 'spring'); return { o: w(t, 0.72, 0.84, 'out'), y: -6 * (1 - p), s: 0.94 + 0.06 * p }; }) });
    S.label(newC, KB.chip(newC.g, cx, cy, to, 'build', { mono: true }).t, ver, 0.3);
    // ---- Flux reconciles the Kustomization: its mark turns, then settles Ready
    const ka = (t) => w(t, 1.1, 1.25), kb = (t) => w(t, RD, RD + 0.2);
    KB.mark(S, C.x + C.w - 20, C.y + (ph ? 21 : 24), ['rest', 'act'], tt((t) => ({ rest: 1 - ka(t) + ka(t) * kb(t), act: ka(t) * (1 - kb(t)) })), { loop: LOOP });
    // ---- Flux applies: wires from the Kustomization to its resources
    const RY = ph ? 222 : 214;
    const rw = (s) => Math.round(s.length * 6.9 + 46);
    const res = ph ? [['Deployment', 12], ['Service', 137], ['HPA', 241]] : [['Deployment', 106], ['Service', 235], ['HPA', 343]];
    const wx = ph ? 137 + rw('Service') / 2 : C.x + C.w / 2, y0 = C.y + C.h, ty = RY - 26;
    const ov = S.stat();
    KB.text(ov, wx + 8, y0 + 17, 'Flux', 'tag');
    const run = (t) => w(t, 1.25, 1.6, 'io');
    res.forEach(([s, x]) => {
      const x2 = x + rw(s) / 2;
      const d = VG.elbowV(wx, y0, x2, RY - 8, ty), chev = VG.chevronDown(x2, RY - 8);
      KB.path(st, d, 'w-q', chev);
      // v6h: the packet runs on the quiet wire (Flux applying); the wire lights on the Ready beat (130 ms), the frame Kuberik's
      // wire goes quiet
      // v6j: lit from the last cycle's hand-off; the light leaves (150 ms ease-in) as Kuberik's wire starts lighting (0.35)
      KB.path(S.sprite({ x: 0, y: 0, w: W, h: H, track: tt((t) => ({ o: 1 - w(t, 0.35, 0.5, 'in') + w(t, RD, RD + 0.13, 'out') })) }).g, d, 'w-lit', chev);
      const lu = KB.lut(svg, d), [qx, qy] = lu.pt(0);
      const pk = S.sprite({ x: qx - 3, y: qy - 3, w: 6, h: 6, track: tt((t) => { const r = run(t); if (r <= 0 || r >= 1) return { o: 0 }; const [x, y] = lu.pt(r * lu.L); return { o: 1, x: x - qx, y: y - qy }; }) });
      el('circle', { cx: qx, cy: qy, r: 2, class: 'pk' }, pk.g);
    });
    // ---- the resources: Flux reconciles (blue, a burst), then Ready (teal, a burst)
    res.forEach(([s, x], i) => {
      KB.card(st, id, { x, y: RY, w: rw(s), h: 34, r: 8 });
      KB.text(st, x + 32, RY + 21.5, s, 'label');
      // v6h: they reconcile in a burst (1.60 / 1.72 / 1.84) and go Ready together on the hand-off beat (RD)
      const a = (t) => w(t, 1.6 + i * 0.12, 1.75 + i * 0.12), b = (t) => w(t, RD, RD + 0.2);
      KB.mark(S, x + 18, RY + 17, ['rest', 'act'], tt((t) => ({ rest: 1 - a(t) + a(t) * b(t), act: a(t) * (1 - b(t)) })), { loop: LOOP });
    });
    // v6h: no edge light on the Kustomization; the hand-off (RD) is the climax
    return S.finish();
  }
});
