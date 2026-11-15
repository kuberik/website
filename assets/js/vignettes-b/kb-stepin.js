/* take B kit extension for STEP IN (ic-designer-vignettes-b18, v6j). A pure addition: load after kb.js. Nothing in kb.js
   changes behaviour; this file only ADDS to window.KB.
   - A `fail` StatusMark state: the dashboard's failed StatusMark (StatusMark.svelte: tint disc, 1 px state line, the "!"
     glyph M12 6v7M12 18h.01), in the dashboard's danger hue (styles/language.css --k-danger-*; kb-stepin.css --b-fail-*).
     KB.markOneX / KB.markX draw it and delegate every other state to KB.markOne, so they are drop-in for markOne / mark.
   - KB.ICON.thumbtack: the pin glyph (the section placeholder's own path, scaled to the kit's 24 box) for the Pinned chip.
   - KB.pinChip (v6k: a held-tone status chip, radius 4, the chip family), KB.button (a secondary button, radius 6). */
(() => {
  const { el } = VG;
  const f2 = KB.f2;
  KB.ICON.thumbtack = 'M9 3h6l-.75 6 3.75 3.75H6L9.75 9Z M12 12.75V21';

  function markOneX(p, cx, cy, s, pie = null) {
    if (s !== 'fail') return KB.markOne(p, cx, cy, s, pie);
    const g = el('g', { class: 'm-fail' }, p);
    el('circle', { cx, cy, r: 7.5, class: 'md nsl', 'stroke-width': 1 }, g);
    const sz = 10, k = sz / 24;
    el('path', { d: VG.GLYPH.bang, class: 'mg', 'stroke-width': 3, transform: `translate(${f2(cx - sz / 2)} ${f2(cy - sz / 2)}) scale(${f2(k)})` }, g);
    return g;
  }
  /** KB.mark with the fail state available */
  function markX(S, cx, cy, list, wts, { parent = null, loop = null } = {}) {
    return KB.states(S, { x: cx - 9, y: cy - 9, w: 18, h: 18 }, list, (s, g) => markOneX(g, cx, cy, s), wts,
      { parent, spin: loop ? { state: 'act', deg: (t) => KB.per(t, loop, 360) } : null });
  }
  /** v6k (b19, row S6): Pinned is a STATUS chip of the chip family (KB.chip's shape: 20 tall, radius 4, tinted fill, a
      1 px line in its own hue, no card fill, no shadow), in the dashboard's held tone (a pin holds automation: the rollout
      page's pin banner is bg-held-tint / border-held-line / text-held), with the thumbtack glyph. Right-aligned at xr,
      centred on cy. v6j drew it as a neutral bordered pill on the card fill, the button's shape beside "Clear pin". */
  /* r8 (b22): compact = the phone header's chip (11 px word, 8 px narrower), so the header keeps 10 / 11 px gaps */
  function pinChip(p, xr, cy, s = 'Pinned', { compact = false } = {}) {
    const g = el('g', { class: 'c-held si-pin' }, p);
    const fs = compact ? 11 : 12, h = 20, w = Math.round(s.length * (compact ? 6 : 6.6) + (compact ? 26 : 30)), x = xr - w, y = cy - h / 2;
    el('rect', { x: x + 0.5, y: y + 0.5, width: w - 1, height: h - 1, rx: 4, 'stroke-width': 1, class: 'nsl' }, g);
    KB.icon(g, 'thumbtack', x + (compact ? 11 : 13), cy, compact ? 11 : 12, 'ic si-pin-ic');
    const t = el('text', { x: x + (compact ? 19 : 22), y: cy + (compact ? 3.8 : 4), 'font-size': fs, 'font-weight': 500 }, g);
    t.textContent = s;
    return { g, w, x, y };
  }
  /** a secondary button (the page's .btn-secondary shape): h tall, rx 6, card fill, 1 px line, ink label centred */
  function button(p, xr, cy, s, { h = 30, fs = 13 } = {}) {
    const g = el('g', { class: 'btn2' }, p);
    const w = Math.round(s.length * fs * 0.54 + 24), x = xr - w, y = cy - h / 2;
    el('rect', { x: x + 0.5, y: y + 0.5, width: w - 1, height: h - 1, rx: 5.5, 'stroke-width': 1, class: 'nsl' }, g);
    const t = el('text', { x: x + w / 2, y: cy + fs * 0.36, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 500, class: 'ink' }, g);
    t.textContent = s;
    return { g, w, x, y, h };
  }
  Object.assign(window.KB, { markOneX, markX, pinChip, button });
})();
