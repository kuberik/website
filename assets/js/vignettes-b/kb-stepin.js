/* take B kit extension for STEP IN (ic-designer-vignettes-b18, v6j). A pure addition: load after kb.js. Nothing in kb.js
   changes behaviour; this file only ADDS to window.KB.
   - A `fail` StatusMark state: the dashboard's failed StatusMark (StatusMark.svelte: tint disc, 1 px state line, the "!"
     glyph M12 6v7M12 18h.01), in the dashboard's danger hue (styles/language.css --k-danger-*; kb-stepin.css --b-fail-*).
     KB.markOneX / KB.markX draw it and delegate every other state to KB.markOne, so they are drop-in for markOne / mark.
   - KB.ICON.thumbtack: the pin glyph (the section placeholder's own path, scaled to the kit's 24 box) for the Pinned chip.
   - KB.pinChip, KB.button: the two small controls the rollout card needs (neutral chip with a glyph; a secondary button),
     radius 6 as the section placeholder draws them. */
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
  /** neutral chip with the thumbtack, right-aligned at xr, centred on cy (22 tall, rx 6) */
  function pinChip(p, xr, cy, s = 'Pinned') {
    const g = el('g', { class: 'c-n' }, p);
    const w = Math.round(s.length * 6.9 + 34), x = xr - w, y = cy - 11;
    el('rect', { x: x + 0.5, y: y + 0.5, width: w - 1, height: 21, rx: 5.5, 'stroke-width': 1, class: 'nsl' }, g);
    KB.icon(g, 'thumbtack', x + 15, cy, 12, 'ic');
    const t = el('text', { x: x + 25, y: cy + 4, 'font-size': 12, 'font-weight': 500, class: 'muted' }, g);
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
