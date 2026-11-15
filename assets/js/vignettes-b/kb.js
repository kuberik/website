/* take B kit v6 (LANGUAGE-B.md v4 look + the v6 polish list). The page's own materials: objects are the page's card (flat fill,
   1 px line, radius 12 / 8, the page's --card-shadow), the subject takes the thesis figs' mint tile, the build takes the fig
   cube's teal. Marks at their true size (StatusMark 16, rest dot 6, WaveMark 10, Chip 20 tall). Wires are the figs' hairline;
   lit = teal, no glow. viewBox = the canvas's CSS size (1 unit ~ 1 px).
   v6 perf model (the compositor stage proven in v5/k5.js, look unchanged): a scene paints its still parts ONCE into SVG
   layers and draws everything that changes into small sprites (a div + an svg in scene units) whose track(t) -> {o, x, y, s,
   sx, sy, r} is sampled at 100 Hz over the loop into WAAPI keyframes on transform / opacity. Those run on the compositor: no
   main-thread work while a scene plays, holds included. set(t) seeks every animation (?t=, frame-stepped capture, reduced
   motion); snap(t) serialises every track (loop and timing checks). */
(() => {
  const { el } = VG;
  const f2 = (v) => +(+v).toFixed(2);

  function defs(svg, id) {
    const d = svg.querySelector('defs') || el('defs', {}, svg);
    for (const [n, sd] of [['sa', 17], ['sc', 1], ['b2', 2]]) {
      const f = el('filter', { id: `${id}-${n}`, filterUnits: 'userSpaceOnUse', x: -400, y: -400, width: 2400, height: 2000 }, d);
      el('feGaussianBlur', { stdDeviation: sd }, f);
    }
    return d;
  }
  let uid = 0;
  const clip = (svg, x, y, w, h, r = 0) => {
    const d = svg.querySelector('defs') || el('defs', {}, svg); const cid = `kbc${uid++}`;
    const c = el('clipPath', { id: cid }, d); el('rect', { x, y, width: w, height: h, rx: r }, c);
    return `url(#${cid})`;
  };

  /** the page's card. shadow = the page's --card-shadow (light 0 1px 2px .05 + 0 12px 32px -12px .14; dark 0 16px 40px -16px
      black .55 + a 1 px inner top light) as two blurred rects, painted once. tone: page | fig (the thesis tile) | quiet */
  function card(p, id, { x, y, w, h, r = 12, tone = 'page', shadow = true }) {
    const g = el('g', {}, p);
    if (shadow) {
      el('rect', { x: x + 13, y: y + 13, width: w - 26, height: Math.max(4, h - 24), rx: r, class: 'c-sa', filter: `url(#${id}-sa)` }, g);
      el('rect', { x, y: y + 1, width: w, height: h, rx: r, class: 'c-sc', filter: `url(#${id}-sc)` }, g);
    }
    const body = el('rect', { x: x + 0.5, y: y + 0.5, width: w - 1, height: h - 1, rx: r - 0.5, class: `c-${tone} nsl`, 'stroke-width': 1 }, g);
    if (shadow) el('path', { d: `M${x + r} ${y + 1.5}H${x + w - r}`, class: 'c-hi nsl', 'stroke-width': 1 }, g);
    return { g, body, x, y, w, h, r };
  }
  const divider = (p, x1, x2, y) => el('path', { d: `M${x1} ${y + 0.5}H${x2}`, class: 'c-div nsl', 'stroke-width': 1 }, p);

  /** the page's type roles */
  const KIND = {
    label: [13, 500, 'ink'], meta: [12, 400, 'muted'], small: [11, 500, 'muted'], mono: [12, 500, 'mono muted'],
    monoInk: [12, 500, 'mono ink'], title: [14, 600, 'ink'], num: [28, 600, 'ink num'], tag: [11, 500, 'mono subtle']
  };
  function text(p, x, y, s, kind = 'label', anchor = 'start') {
    const [fs, fw, cls] = KIND[kind];
    const n = el('text', { x, y, 'font-size': fs, 'font-weight': fw, class: cls, 'text-anchor': anchor }, p);
    n.textContent = s;
    return n;
  }

  /** the dashboard's gate icons (flowbite outline, 24 box; GateRecord.gateMark): calendar-week = a time window, share-nodes =
      a dependency, chevron-double-right = promotion order */
  const ICON = {
    calendar: 'M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z',
    share: 'M7.926 10.898 15 7.727m-7.074 5.39L15 16.29M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm12 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0-11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z',
    chevrons: 'm7 16 4-4-4-4m6 8 4-4-4-4',
    search: 'm21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
    tag: 'M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z'
  };
  /** v6e: kuberik's glyph (static/logo.svg, the hat and the face), filled in neutral ink at `size` px tall, centred on cx, cy */
  const KG = ['M 132.6 368.5 Q 50.2 344.3 29.7 358.2 C 9.3 372.0 9.2 386.2 12.6 399.3 C 15.9 412.5 94.0 498.6 396.7 495.3 C 699.3 492.1 785.4 418.1 787.6 399.3 C 789.8 380.6 781.9 367.7 763.6 358.2 Q 745.3 348.7 664.1 368.5 L 664.1 169.6 Q 641.2 14.7 396.7 15.2 Q 152.2 15.7 132.6 169.6 L 132.6 368.5 Z', 'M 252.6 678.8 C 252.6 658.9 268.8 642.8 288.6 642.8 C 308.5 642.8 324.6 658.9 324.6 678.8 C 324.6 698.7 308.5 714.8 288.6 714.8 C 268.8 714.8 252.6 698.7 252.6 678.8 L 252.6 678.8 L 252.6 678.8 Z M 304.8 615.6 C 336.4 623.6 357.4 654.9 353.3 687.1 C 348.8 723.0 314.4 748.7 278.7 743.2 C 276.6 742.9 274.4 742.5 272.3 742.0 C 248.0 735.9 229.1 715.2 224.5 690.7 C 215.9 644.9 259.4 604.1 304.8 615.6 L 304.8 615.6 L 304.8 615.6 L 304.8 615.6 Z M 215.4 603.3 L 215.4 603.3 L 225.3 616.8 L 219.0 624.5 Q 214.1 630.6 203.1 651.1 L 187.7 648.7 L 187.6 648.7 C 184.8 657.9 183.4 667.5 183.2 677.1 L 183.2 677.1 L 183.4 677.1 L 198.8 679.5 Q 203.0 702.4 205.9 709.6 L 205.9 709.6 L 209.6 718.8 L 196.2 728.7 C 194.8 729.7 210.4 751.6 213.1 752.0 L 213.1 752.0 L 226.7 742.1 L 234.3 748.4 Q 240.4 753.3 260.9 764.3 L 258.6 779.7 L 258.5 779.9 C 267.7 782.7 277.3 784.1 286.9 784.3 L 286.9 784.3 L 286.9 784.1 L 289.3 768.7 Q 312.2 764.5 319.5 761.6 L 319.5 761.6 L 328.6 757.8 L 338.5 771.3 C 340.7 771.6 347.0 766.6 348.2 765.7 C 348.2 765.7 361.9 754.4 361.9 754.4 L 361.9 754.4 L 351.9 740.8 L 358.3 733.1 Q 363.1 727.0 374.2 706.5 L 389.5 708.9 L 389.7 708.9 C 392.5 699.8 394.0 690.1 394.1 680.6 L 394.1 680.6 L 393.9 680.5 L 378.5 678.1 Q 374.3 655.3 371.4 648.0 L 371.4 648.0 L 367.7 638.8 L 381.1 628.9 L 364.2 605.6 L 364.2 605.6 L 350.6 615.5 L 343.0 609.2 Q 337.0 604.2 316.4 593.3 L 318.7 577.9 L 318.8 577.7 C 309.6 575.0 300.0 573.5 290.4 573.3 L 290.4 573.3 L 290.4 573.5 L 288.0 588.9 Q 265.1 593.1 257.8 596.0 L 257.8 596.0 L 248.7 599.8 L 238.8 586.4 C 237.2 584.2 217.2 601.2 215.3 603.0 L 215.3 603.0 Z M 677.9 738.8 C 676.5 798.1 610.7 968.4 396.7 965.1 C 182.6 961.9 122.7 804.6 122.3 738.8 Q 122.0 673.0 122.3 487.9 C 181.1 506.2 268.9 520.7 396.7 519.3 C 527.3 517.9 617.6 503.4 677.9 485.7 Q 679.2 679.5 677.9 738.8 L 677.9 738.8 L 677.9 738.8 Z M 489.3 678.8 C 489.3 658.9 505.4 642.8 525.3 642.8 C 545.1 642.8 561.3 658.9 561.3 678.8 C 561.3 698.7 545.1 714.8 525.3 714.8 C 505.4 714.8 489.3 698.7 489.3 678.8 Z'];
  function kglyph(p, cx, cy, size = 14) {
    const k = size / 980;
    const g = el('g', { class: 'kg', transform: `translate(${f2(cx - 400 * k)} ${f2(cy - 490 * k)}) scale(${(k).toFixed(5)})` }, p);
    el('path', { d: KG[0] }, g); el('path', { d: KG[1], 'fill-rule': 'evenodd' }, g);
    return g;
  }
  function icon(p, name, cx, cy, size = 16, cls = 'ic') {
    const k = size / 24;
    return el('path', { d: ICON[name], class: `${cls} nsl`, 'stroke-width': 1.5, transform: `translate(${f2(cx - size / 2)} ${f2(cy - size / 2)}) scale(${f2(k)})` }, p);
  }

  /** StatusMark at 16, ONE state drawn at full strength (states crossfade as stacked sprites): rest = the 6 px teal dot,
      wait = dashed ring, held / act / prog = tint disc + 1 px state line + glyph; prog may carry a pie fraction */
  const GL = { held: 'M9 5.5v13M15 5.5v13', act: 'M12 4a8 8 0 1 1-8 8', prog: 'M12 7v5l3 2' };
  function markOne(p, cx, cy, s, pie = null) {
    const g = el('g', { class: `m-${s}` }, p);
    if (s === 'rest') { el('circle', { cx, cy, r: 3, class: 'md-rest' }, g); return g; }
    if (s === 'wait') { el('circle', { cx, cy, r: 5.5, class: 'md-wait nsl', 'stroke-width': 1 }, g); return g; }
    el('circle', { cx, cy, r: 7.5, class: 'md nsl', 'stroke-width': 1 }, g);
    if (pie != null) { el('path', { d: VG.slice(cx, cy, 4.25, 0, pie), class: 'mp' }, g); return g; }
    const sz = s === 'held' ? 12 : 10, k = sz / 24;
    el('path', { d: GL[s], class: 'mg', 'stroke-width': 3, transform: `translate(${f2(cx - sz / 2)} ${f2(cy - sz / 2)}) scale(${f2(k)})` }, g);
    return g;
  }

  /** WaveMark (one state): slices = [[kind, from, to], ...]; kinds: done check deploy */
  function waveOne(p, cx, cy, slices, r = 5) {
    const g = el('g', {}, p);
    el('circle', { cx, cy, r, class: 'w-track' }, g);
    for (const [kind, a, b] of slices) el('path', { d: VG.slice(cx, cy, r, a, b), class: `w-${kind}` }, g);
    return g;
  }

  /** Chip: 20 tall, rx 4, tint + 1 px line + ink. tone: n prod stg dev held teal act prog build. caps = the tier word */
  function chip(p, x, y, s, tone = 'n', { mono = false, caps = false, anchor = 'start', h = 20 } = {}) {
    const g = el('g', { class: `c-${tone}` }, p);
    const cw = mono ? 7.23 : caps ? 7.1 : 6.6;
    const w = Math.round(s.length * cw + (caps ? 12 : 14));
    const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
    const rect = el('rect', { x: x0 + 0.5, y: y + 0.5, width: w - 1, height: h - 1, rx: 4, 'stroke-width': 1, class: 'nsl' }, g);
    const t = el('text', { x: x0 + w / 2, y: y + h / 2 + 4, 'text-anchor': 'middle', 'font-size': caps ? 10 : 12, 'font-weight': caps ? 600 : 500, 'letter-spacing': caps ? '.06em' : null, class: mono ? 'mono' : null }, g);
    t.textContent = s;
    return { g, w, h, x: x0, y, t, rect };
  }

  /** a hairline wire path: draws it (cls) and returns a 1 px lookup table for packets (pt(s)) */
  function path(p, d, cls = 'w-q', chev = null) {
    const g = el('g', {}, p);
    const q = el('path', { d, class: `${cls} nsl` }, g);
    if (chev) el('path', { d: chev, class: `${cls} nsl` }, g);
    return { g, q };
  }
  function lut(svg, d) {
    const q = el('path', { d }, svg.querySelector('defs') || el('defs', {}, svg));
    const L = q.getTotalLength(), T = [];
    for (let i = 0; i <= Math.ceil(L); i++) { const P = q.getPointAtLength(Math.min(L, i)); T.push([P.x, P.y]); }
    const pt = (s) => { const v = Math.max(0, Math.min(L, s)), i = Math.floor(v), f = v - i, a = T[i], b = T[Math.min(T.length - 1, i + 1)]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; };
    q.remove();
    return { L, pt };
  }

  /** the pointer (a person acts): the system arrow, 12 x 18, white with an ink outline */
  function cursor(p, x = 0, y = 0) {
    return el('path', { d: 'M0 0L0 16.5L4.1 12.6L6.9 18.6L9.4 17.4L6.7 11.6L12.2 11.4Z', class: 'cur', 'stroke-width': 1.2, 'stroke-linejoin': 'round', transform: `translate(${x} ${y})` }, p);
  }

  /** a rate that repeats exactly over the loop (whole periods) */
  const per = (t, loop, rate, period = 360) => ((((t / loop) * Math.max(1, Math.round((loop * rate) / period))) % 1) * period);

  /* ---- the compositor stage ----
     stage(svg, W, H, loop) wraps the host's svg in a root; S.base is that svg's group (painted once), S.stat() adds another
     painted-once layer at the current z; S.sprite({x, y, w, h, parent, clip, origin, track}) adds a small element whose content
     is drawn in scene units into sp.g; z order = creation order. A track that jumps (a packet wrapping) gets a step, never a
     sweep. finish(rootTrack) builds the animations and returns the timeline vg.js drives. */
  function stage(svg, W, H, loop) {
    const host = svg.parentNode;
    const root = document.createElement('div'); root.className = 'kb-root'; host.appendChild(root); root.appendChild(svg);
    svg.setAttribute('class', 'kb kb-layer');
    svg.style.willChange = 'auto';
    const sprites = [];
    const mk = (box) => el('svg', { viewBox: `${box.x} ${box.y} ${box.w} ${box.h}`, class: 'kb', 'aria-hidden': 'true' }, null);
    function stat() { const s = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'kb kb-layer', 'aria-hidden': 'true' }, null); root.appendChild(s); return el('g', {}, s); }
    function sprite({ x, y, w, h, parent = null, clip = false, origin = null, track = null }) {
      const P = parent ? parent.box : { x: 0, y: 0, w: W, h: H };
      const d = document.createElement('div'); d.className = 'kb-sp';
      const pc = (v) => `${+(v * 100).toFixed(4)}%`;
      Object.assign(d.style, { left: pc((x - P.x) / P.w), top: pc((y - P.y) / P.h), width: pc(w / P.w), height: pc(h / P.h) });
      if (clip) d.style.overflow = 'hidden';
      const o = origin || [x + w / 2, y + h / 2];
      d.style.transformOrigin = `${pc((o[0] - x) / w)} ${pc((o[1] - y) / h)}`;
      if (track) d.style.willChange = 'transform, opacity';
      (parent ? parent.div : root).appendChild(d);
      const s = mk({ x, y, w, h }); d.appendChild(s);
      const sp = { div: d, g: el('g', {}, s), svg: s, box: { x, y, w, h }, track, parent };
      if (track) sprites.push(sp);
      return sp;
    }
    const rootSp = { div: root, box: { x: 0, y: 0, w: W, h: H }, track: null };
    let anims = [];
    const N = Math.round(loop * 100);
    const val = (sp, t) => { const v = sp.track(t) || {}; return [v.o ?? 1, v.x || 0, v.y || 0, (v.s ?? 1) * (v.sx ?? 1), (v.s ?? 1) * (v.sy ?? 1), v.r || 0]; };
    const tfs = (sp, v) => {
      const { w, h } = sp.box;
      return `translate(${+((v[1] / w) * 100).toFixed(3)}%, ${+((v[2] / h) * 100).toFixed(3)}%) rotate(${+v[5].toFixed(2)}deg) scale(${+v[3].toFixed(4)}, ${+v[4].toFixed(4)})`;
    };
    const R = (v) => [+v[0].toFixed(3), +v[1].toFixed(2), +v[2].toFixed(2), +v[3].toFixed(4), +v[4].toFixed(4), +v[5].toFixed(2)];
    /* v6j CYCLES: the loop never empties; each cycle's identity (a version, a PR, a tag, a region) advances instead.
       S.label(sp, node, fn, swapAt): node is a <text> (or any element whose textContent we own) drawn inside sprite sp;
       fn(k) -> string for cycle k; swapAt = a loop time (0 <= swapAt < loop) at which sp (and every parent sprite) is fully
       transparent from swapAt - 0.10 to swapAt + 0.15 (asserted at build; a late timer must never show the swap).
       k(T) = floor((T - swapAt) / loop) + 1 for the ABSOLUTE scene time T (k = 0 before the first swap). The timeline keeps an
       absolute clock: set(T) accepts T >= loop (cycle n = floor(T / loop)), abs() returns it, and labels are rewritten by one
       main-thread timer per swap while playing (a text write while invisible; the compositor tracks are untouched). */
    const labels = [];
    function opaqueAt(sp, t) { for (let q = sp; q; q = q.parent) if (q.track && ((q.track(t) || {}).o ?? 1) > 0.001) return true; return false; }
    function label(sp, node, fn, swapAt) {
      for (let d = -0.10; d <= 0.1501; d += 0.01) {
        const t = (((swapAt + d) % loop) + loop) % loop;
        if (opaqueAt(sp, t)) { console.warn(`KB.label: sprite visible at ${t.toFixed(2)} (swapAt ${swapAt})`, node.textContent); break; }
      }
      const L = { sp, node, fn, swapAt, k: null };
      labels.push(L);
      return L;
    }
    const kOf = (L, T) => Math.floor((T - L.swapAt) / loop) + 1;
    const relabel = (T) => { for (const L of labels) { const k = kOf(L, T); if (k !== L.k) { L.k = k; L.node.textContent = L.fn(k); } } };
    function finish(rootTrack) {
      if (rootTrack) { rootSp.track = rootTrack; sprites.unshift(rootSp); root.style.willChange = 'transform, opacity'; }
      anims = [];
      for (const sp of sprites) {
        const S = []; for (let i = 0; i <= N; i++) S.push(R(val(sp, (i / N) * loop)));
        const same = (a, b) => a.every((v, j) => v === b[j]);
        const hasO = S.some((v) => v[0] !== S[0][0]), hasT = S.some((v) => v.slice(1).some((x, j) => x !== S[0][j + 1]));
        if (!hasO) sp.div.style.opacity = S[0][0];
        if (!hasT) sp.div.style.transform = tfs(sp, S[0]);
        if (!hasO && !hasT) continue;
        const kf = [];
        const key = (i, v) => { const k = { offset: i / N }; if (hasO) k.opacity = v[0]; if (hasT) k.transform = tfs(sp, v); return k; };
        for (let i = 0; i <= N; i++) {
          if (i > 0 && i < N && same(S[i], S[i - 1]) && same(S[i], S[i + 1])) continue; // inside a flat run
          // a jump (a packet wrapping to the start of its wire, a rotation wrapping) is a step, never a sweep
          if (i > 0 && (Math.hypot(S[i][1] - S[i - 1][1], S[i][2] - S[i - 1][2]) > 12 || Math.abs(S[i][5] - S[i - 1][5]) > 90)) kf.push(key(i, S[i - 1]));
          kf.push(key(i, S[i]));
        }
        const a = sp.div.animate(kf, { duration: loop * 1000, iterations: Infinity, easing: 'linear', fill: 'both' });
        a.pause(); anims.push(a);
      }
      let clock = 0, timer = null;   // clock = absolute seconds when there are no anims (a scene with labels only)
      const abs = () => (anims.length ? anims[0].currentTime / 1000 : clock);
      const arm = () => {
        clearTimeout(timer); timer = null;
        if (!labels.length || !anims.length || anims[0].playState !== 'running') return;
        const T = abs(); relabel(T);
        let next = Infinity;
        for (const L of labels) next = Math.min(next, L.swapAt + kOf(L, T) * loop);
        timer = setTimeout(arm, Math.max(0, (next - T) * 1000 + 4));
      };
      return {
        // T is absolute (T >= loop picks a later cycle's labels); negative T wraps into cycle 0
        set(T) { if (T < 0) T = ((T % loop) + loop) % loop; clearTimeout(timer); timer = null; clock = T; for (const a of anims) { a.pause(); a.currentTime = T * 1000; } relabel(T); },
        play() { const ct = anims.length ? anims[0].currentTime : 0; for (const a of anims) { a.currentTime = ct; a.play(); } arm(); },
        pause() { clearTimeout(timer); timer = null; for (const a of anims) a.pause(); },
        time() { return (abs() % loop + loop) % loop; },
        abs,
        cycles: labels.length > 0,
        // the rest frame of the CURRENT cycle (vg.js parks a card here at the end of its turn without rewinding its labels)
        restAbs(rest) { const T = abs(); const n = Math.floor((T - rest + 0.05) / loop); return n * loop + rest; },
        // snap(T): every track at T mod loop (seam checks compare these); snap(T, true) appends the labels at absolute T
        snap(T, withLabels) {
          const t = ((T % loop) + loop) % loop;
          let s = sprites.map((sp, i) => `<sp${i} ${R(val(sp, t)).join(' ')}`).join('');
          if (withLabels) s += labels.map((L, i) => `<lb${i} ${L.fn(kOf(L, T))}`).join('');
          return s;
        }
      };
    }
    return { root, base: el('g', {}, svg), stat, sprite, finish, label, W, H };
  }
  /** content in/out as the root track: fade in 150 ms out, exit 300 ms ease-in with a 2 % push (Railway Block 1) */
  const inoutTrack = (exit, exitEnd) => (T) => ({ o: VG.w(T, 0, 0.15, 'out') * (1 - VG.w(T, exit, exitEnd, 'in')), s: T >= exitEnd ? 1 : 1 + 0.02 * VG.w(T, exit, exitEnd, 'in') });

  /* ---- sprite helpers (each draws once; motion = the track) ---- */
  /** a stack of states over one box, crossfaded by wts(t) -> {state: weight}; draw(state, g); spin = the act arc's turn */
  function states(S, box, list, draw, wts, { parent = null, spin = null } = {}) {
    const out = {};
    for (const s of list) {
      const sp = S.sprite({ ...box, parent, track: (t) => ({ o: wts(t)[s] || 0, r: spin && s === spin.state ? spin.deg(t) : 0 }) });
      draw(s, sp.g); out[s] = sp;
    }
    return out;
  }
  /** a StatusMark that changes state: one sprite per state, the act arc turns */
  function mark(S, cx, cy, list, wts, { parent = null, loop = null } = {}) {
    return states(S, { x: cx - 9, y: cy - 9, w: 18, h: 18 }, list, (s, g) => markOne(g, cx, cy, s), wts,
      { parent, spin: loop ? { state: 'act', deg: (t) => per(t, loop, 360) } : null });
  }
  /** a reveal: content in box shown from its start edge up to f(t) (x: left -> right, y: top -> bottom). Two nested sprites:
      a clipping window that slides and the content counter-sliding inside it (compositor only, no repaint) */
  function reveal(S, box, f, { axis = 'x', parent = null, from = 'start' } = {}) {
    const k = axis === 'x' ? box.w : box.h, sg = from === 'start' ? -1 : 1;
    const win = S.sprite({ ...box, parent, clip: true, track: (t) => { const d = sg * (1 - f(t)) * k; return axis === 'x' ? { x: d } : { y: d }; } });
    const inner = S.sprite({ ...box, parent: win, track: (t) => { const d = -sg * (1 - f(t)) * k; return axis === 'x' ? { x: d } : { y: d }; } });
    return inner;
  }
  /** a rolling value: values stacked in a clipped slot; idx(t) fractional rolls upwards */
  function roller(S, x, y, vals, idx, { kind = 'num', anchor = 'start', w = 90, h = 0, parent = null } = {}) {
    // v6b: the window is exactly the value's line (cap top to just under the baseline) and a step rolls exactly one line,
    // so the leaving value is fully clipped before it could reach the label above it
    const [fs] = KIND[kind];
    const lh = h || Math.round(fs * 0.84);
    const x0 = anchor === 'end' ? x - w : anchor === 'middle' ? x - w / 2 : x;
    const box = { x: x0 - 4, y: y - Math.round(fs * 0.76), w: w + 8, h: lh };
    const win = S.sprite({ ...box, parent, clip: true });
    vals.forEach((v, j) => {
      const sp = S.sprite({ ...box, parent: win, track: (t) => { const d = j - idx(t); if (Math.abs(d) >= 1) return { o: 0 }; return { o: 1 - 0.5 * Math.abs(d), y: d * lh }; } });
      text(sp.g, x, y, v, kind, anchor);
    });
    return win;
  }

  window.KB = { per, defs, clip, card, divider, text, icon, kglyph, ICON, markOne, waveOne, chip, path, lut, cursor, stage, inoutTrack, states, mark, reveal, roller, f2 };
})();
