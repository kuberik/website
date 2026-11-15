/* PRODUCTION PATCHES against take B v6h (/.work/landing-v6/vignettes/take-b/v6h/vg.js). Everything else is verbatim.
   1. The global `SVGElement.prototype.setAttribute` memo is deleted. It was page-wide and would reach the hero film's Svelte
      islands; compositor scenes only set attributes while they build, so it saved nothing.
   2. Start at rest: a host's first t is its scene's `rest` (v6h: 0), so the live mount paints the poster's pixels and the
      first change continues the hold.
   3. Lazy build: a host is built when it comes within one viewport of the screen (IntersectionObserver, rootMargin 100%),
      so page load pays for no scene. Its poster (layouts/_partials/landing-vignettes) is replaced by identical pixels.
   4. Debug hooks under the site's names: ?vg-t=<s> freezes every scene, ?vg-reduced=1 (or prefers-reduced-motion) keeps the
      posters (rest), ?vg-fps=<n>. window.__vgSet / __vgSnap / __vgRest / __vgLoops / __vgStills stay (they build every host
      first); __vgBuilt() lists the built hosts; VG.spec(name) gives a scene's spec (the poster generator reads its boxes).
   5. Remount on a breakpoint flip re-observes the host (unobserve, then observe) so the observer delivers a fresh entry for the
      new scene; without it a card that was playing froze after the viewport crossed 640 px.
   6. One card plays at a time (start(): elect/go/settle/rotate). Among the built hosts at >= 35 % in view the one with the largest
      visible area takes the first turn; a partly visible holder loses it to a challenger with 15 % more area, a (90 %+) fully
      visible one keeps it. A turn is one loop: then the turn passes to the next card in view in page order (rotate), so on a wide
      bento where several cards are on screen every card plays in turn (area alone starved Health, GitOps and Dashboard at 1440).
      The hand-off happens at the rest frame (the loop's end), so the outgoing card simply stops on rest. Every other card shows its REST frame: a card that
      leaves the screen or loses the turn is paused and dissolved to rest (160 ms out, 220 ms in; a plain seek when it is off
      screen), so no card is left on the blank reset beat of the loop (that beat exists only inside a playing loop); an elected card
      plays from rest. A hidden tab pauses in place and resumes in place. The observer uses 21 thresholds so the area is current.
      Why: main-thread cost scales with the number of scenes playing (each compositor scene still costs style work per frame).
      The page tells the nav when anything plays: a `vg-play` event on window, detail true/false (home.html holds the logo's SMIL
      spin while true; an animated SVG <img>/inline mark otherwise requests a main-thread frame per vsync under the sticky nav).
   8. v6j (tl-landing-v6j): scenes never empty (KB cycles: the loop continues through the product, versions advance by label).
      The clock is absolute (?vg-t= and __vgSet take absolute scene time; the remount keeps abs()); a turn ends on the rest frame
      of the card's current cycle (restAbs), so versions never rewind; a card that loses the turn mid-loop finishes its cycle on
      screen and stops on rest (patch 6's dissolve through opacity 0 is gone: it was an empty frame).
   7. Kept: the phone composition (viewport <= 640 px) and the remount that keeps the playing card's clock (the others stand at rest); reduced motion; lazy build; hooks. */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  function bez(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const fx = (t) => ((ax * t + bx) * t + cx) * t, fy = (t) => ((ay * t + by) * t + cy) * t;
    const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (x) => {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) { const e = fx(t) - x; const d = dx(t); if (Math.abs(e) < 1e-5 || !d) break; t -= e / d; }
      return fy(Math.min(1, Math.max(0, t)));
    };
  }
  // spring with ~3 % overshoot (3.1 % at p ~ .37), settled by p = 1 (LANGUAGE-B.md v4 section 3)
  const spring = (p) => (p >= 1 ? 1 : 1 - Math.exp(-8 * p) * Math.cos(6 * p));
  const E = { out: bez(.2, .8, .2, 1), in: bez(.4, 0, 1, 1), io: bez(.4, 0, .2, 1), lin: (p) => p, spring, soft: bez(.45, 0, .55, 1) };

  /** keyframes [[t, v], [t, v, ease], ...] -> value at t (numbers or arrays of numbers) */
  function k(t, keys) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) {
        const [t0, v0] = keys[i - 1], [t1, v1, e] = keys[i];
        const p = t1 === t0 ? 1 : (E[e || 'io'])((t - t0) / (t1 - t0));
        return Array.isArray(v0) ? v0.map((a, j) => a + (v1[j] - a) * p) : v0 + (v1 - v0) * p;
      }
    }
    return keys[keys.length - 1][1];
  }
  /** 0..1 progress of a window [a, b] with an ease */
  const w = (t, a, b, e = 'io') => (t <= a ? 0 : t >= b ? 1 : E[e]((t - a) / (b - a)));

  function el(tag, attrs = {}, parent) {
    const n = document.createElementNS(NS, tag);
    for (const a in attrs) if (attrs[a] != null) n.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(n);
    return n;
  }
  const set = (n, a) => { for (const k in a) n.setAttribute(k, typeof a[k] === 'number' ? +a[k].toFixed(3) : a[k]); };
  const op = (n, v) => { const s = v <= 0.001 ? '0' : v >= 0.999 ? '1' : v.toFixed(3); if (n.__op === s) return; n.__op = s; n.style.opacity = s; };
  const tf = (n, x = 0, y = 0, s = 1, cx = 0, cy = 0) => n.setAttribute('transform', s === 1 ? `translate(${x.toFixed(2)} ${y.toFixed(2)})` : `translate(${(x + cx - cx * s).toFixed(2)} ${(y + cy - cy * s).toFixed(2)}) scale(${s.toFixed(4)})`);

  /* ---- the product's own geometry ---- */
  // graph-wire.ts (#145): 1px hairline, 8px corners, soft S under two corners, open chevron 4 x 3.5
  const CORNER = 8, SOFT = 12, SNAP = 4;
  function elbow(x1, y1, x2, y2, tx) {
    const dy = y2 - y1;
    if (Math.abs(dy) < SNAP) return `M${x1} ${y2}H${x2}`;
    const room = Math.min(tx - x1, x2 - tx);
    if (Math.abs(dy) < 2 * CORNER) { const l = Math.min(SOFT, room); return `M${x1} ${y1}H${tx - l}C${tx} ${y1} ${tx} ${y2} ${tx + l} ${y2}H${x2}`; }
    const down = dy > 0, s = down ? 1 : -1, r = Math.min(CORNER, room);
    return `M${x1} ${y1}H${tx - r}A${r} ${r} 0 0 ${down ? 1 : 0} ${tx} ${y1 + s * r}V${y2 - s * r}A${r} ${r} 0 0 ${down ? 0 : 1} ${tx + r} ${y2}H${x2}`;
  }
  // the same wire turned 90 degrees (a top-to-bottom canvas, the phone compositions): runs leave and enter vertically
  function elbowV(x1, y1, x2, y2, ty) {
    const dx = x2 - x1;
    if (Math.abs(dx) < SNAP) return `M${x2} ${y1}V${y2}`;
    const room = Math.min(ty - y1, y2 - ty);
    if (Math.abs(dx) < 2 * CORNER) { const l = Math.min(SOFT, room); return `M${x1} ${y1}V${ty - l}C${x1} ${ty} ${x2} ${ty} ${x2} ${ty + l}V${y2}`; }
    const right = dx > 0, s = right ? 1 : -1, r = Math.min(CORNER, room);
    return `M${x1} ${y1}V${ty - r}A${r} ${r} 0 0 ${right ? 0 : 1} ${x1 + s * r} ${ty}H${x2 - s * r}A${r} ${r} 0 0 ${right ? 1 : 0} ${x2} ${ty + r}V${y2}`;
  }
  const chevronDown = (x, y, d = 4, h = 3.5) => `M${x - h} ${y - d}L${x} ${y}L${x + h} ${y - d}`;
  const chevron = (x, y, d = 4, h = 3.5) => `M${x - d} ${y - h}L${x} ${y}L${x - d} ${y + h}`;
  // WaveMark slicePath: a pie slice from fraction a to b, clockwise from 12 o'clock
  function slice(cx, cy, R, a, b) {
    if (b - a <= 0.0005) return '';
    if (b - a >= 0.9995) return `M${cx} ${cy - R}a${R} ${R} 0 1 1 0 ${2 * R}a${R} ${R} 0 1 1 0 ${-2 * R}Z`;
    const p = (f) => [cx + R * Math.sin(f * 2 * Math.PI), cy - R * Math.cos(f * 2 * Math.PI)];
    const [x0, y0] = p(a), [x1, y1] = p(b);
    return `M${cx} ${cy}L${x0.toFixed(3)} ${y0.toFixed(3)}A${R} ${R} 0 ${b - a > 0.5 ? 1 : 0} 1 ${x1.toFixed(3)} ${y1.toFixed(3)}Z`;
  }
  // an open arc (a ring's progress), clockwise from 12 o'clock
  function arcPath(cx, cy, R, a, b) {
    if (b - a <= 0.0005) return '';
    if (b - a >= 0.9995) return `M${cx} ${cy - R}a${R} ${R} 0 1 1 0 ${2 * R}a${R} ${R} 0 1 1 0 ${-2 * R}`;
    const p = (f) => [cx + R * Math.sin(f * 2 * Math.PI), cy - R * Math.cos(f * 2 * Math.PI)];
    const [x0, y0] = p(a), [x1, y1] = p(b);
    return `M${x0.toFixed(3)} ${y0.toFixed(3)}A${R} ${R} 0 ${b - a > 0.5 ? 1 : 0} 1 ${x1.toFixed(3)} ${y1.toFixed(3)}`;
  }
  // StatusMark glyphs, 24-unit box (stroke 3 at 10px -> we draw them at mark scale)
  const GLYPH = {
    check: 'M6.5 12.5l3.8 3.8L17.5 8.8',
    pause: 'M9 5.5v13M15 5.5v13',
    clock: 'M12 7v5l3 2',
    bang: 'M12 6v7M12 18h.01',
    arc: 'M12 4a8 8 0 1 1-8 8'
  };

  const defs = [];
  const VG = { E, k, w, el, set, op, tf, elbow, elbowV, chevronDown, chevron, slice, arcPath, GLYPH, def: (name, spec) => defs.push([name, spec]) };
  window.VG = VG;

  /* ---- mount + clock ---- */
  const q = new URLSearchParams(location.search);
  const freeze = q.has('vg-t') ? parseFloat(q.get('vg-t')) : null;
  const reduced = q.get('vg-reduced') === '1' || matchMedia('(prefers-reduced-motion: reduce)').matches;
  let uid = 0;
  const live = [];
  let io = null, lazy = null, kick = () => {};
  const PHONE = matchMedia('(max-width: 640px)');
  const hosts = () => [...document.querySelectorAll('[data-vg]')];
  const specOf = (host) => { const d = defs.find((x) => x[0] === host.dataset.vg); return d && d[1]; };
  VG.spec = (name) => { const d = defs.find((x) => x[0] === name); return d && d[1]; };
  // build one host's scene (replacing its poster); keep = [t] to continue a clock
  function build(host, keep) {
    const s = specOf(host);
    if (!s || live.some((v) => v.host === host)) return null;
    host.textContent = '';
    const phone = PHONE.matches;
    const vb = typeof s.vb === 'function' ? s.vb(phone) : s.vb;
    const svg = el('svg', { viewBox: `0 0 ${vb[0]} ${vb[1]}`, class: 'vg-svg', role: 'img', 'aria-label': s.label || '' }, null);
    host.appendChild(svg);
    const id = `vg${uid++}`;
    const built = s.build(svg, id, phone);
    // a v5 scene returns a compositor timeline { set(t), play(), pause(), time(), snap(t) }: it runs itself (WAAPI on
    // composited sprites), so the rAF clock never touches it; a v3/v4 scene returns render(t)
    const anim = typeof built === 'object' ? built : null;
    const render = anim ? anim.set : built;
    const v = { host, s, render, anim, t: freeze != null ? (anim ? freeze : freeze % s.loop) : keep != null ? keep : s.rest, on: false, atRest: keep == null };
    v.render(v.t);
    live.push(v);
    host.dataset.vgLive = '1';
    return v;
  }
  const buildAll = () => { for (const h of hosts()) build(h); };
  // the phone has its own composition (one object kept big): re-mount the built hosts when the breakpoint flips, keeping each clock
  PHONE.addEventListener('change', () => {
    const keep = live.map((v) => [v.host, v.on ? (v.anim ? v.anim.abs() : v.t) : null]);   // only the playing card keeps its clock; the rest stand at rest
    live.length = 0;
    for (const [host, t] of keep) { delete host.dataset.vgLive; const v = build(host, t); if (v && io) { io.unobserve(host); io.observe(host); } }
    kick();
  });
  function start() {
    if (freeze != null) { buildAll(); document.documentElement.dataset.vgReady = '1'; return; }
    if (reduced) { document.documentElement.dataset.vgReady = '1'; return; }   // the posters are the rest frames
    // ONE CARD PLAYS AT A TIME. The observer reports each built host's visible ratio and area; among those >= MIN the one with the
    // largest visible area plays (a playing card keeps the turn until a challenger shows 15 % more area: no flapping). Every other
    // card shows its rest frame: a card that loses the turn (or leaves the screen) finishes its cycle on screen and stops on rest
    // (v6j; off screen it seeks), and a card that is elected again plays on from where it is. host.dataset.vgState says which
    // (play | finish | rest) for the measurement scripts.
    const MIN = 0.35;
    let cur = null, announced = null;
    const announce = () => { const on = !!cur && !document.hidden; if (on !== announced) { announced = on; dispatchEvent(new CustomEvent('vg-play', { detail: on })); } };
    // v6j: the rest frame of the card's CURRENT cycle (its versions stay where the story got to; nothing rewinds a cycle)
    const toRest = (v) => { clearTimeout(v.finish); v.finish = null; if (v.anim) { v.anim.pause(); v.anim.set(v.anim.restAbs(v.s.rest)); } else { v.t = v.s.rest; v.render(v.t); } v.settling = false; v.atRest = true; v.host.dataset.vgState = 'rest'; };
    // v6j: a card that loses its turn mid-loop FINISHES its cycle on screen and stops on its rest frame (no dissolve through an
    // empty card, no jump). For that remainder two scenes run (both compositor-only). Off screen it seeks to rest at once.
    const settle = (v, atEnd) => {
      v.tok = (v.tok || 0) + 1;
      if (atEnd) { toRest(v); return; }                             // a turn ends at the loop's end = the rest frame
      if (!v.anim) { if (v.t !== v.s.rest) toRest(v); return; }
      if (!(v.ratio > 0.02) || document.hidden) { toRest(v); return; }   // not on screen: nobody sees the seek
      const L = v.s.loop, now = v.anim.time();
      const rem = (((v.s.rest - now) % L) + L) % L;
      if (rem < 0.02 || rem > L - 0.02) { toRest(v); return; }
      v.settling = true; clearTimeout(v.finish);
      v.host.dataset.vgState = 'finish';
      v.finish = setTimeout(() => { v.finish = null; if (!v.on) toRest(v); }, rem * 1000);
    };
    const go = (v) => {
      v.tok = (v.tok || 0) + 1; v.atRest = false;
      clearTimeout(v.finish); v.finish = null; v.settling = false;  // re-elected while finishing its cycle: it simply keeps playing
      v.host.dataset.vgState = 'play';
      if (v.anim && !document.hidden) v.anim.play();
    };
    // turns: a card that wins plays one loop (from rest back to rest), then rotate() passes the turn to the next card in view
    let turn = null, next = null;
    const order = (v) => hosts().indexOf(v.host);
    const rotate = () => {
      turn = null;
      if (!cur) return;
      if (document.hidden) { schedule(cur); return; }
      const el = live.filter((v) => v.ratio >= MIN).sort((a, b) => order(a) - order(b));
      if (el.length < 2 || !el.includes(cur)) { schedule(cur); return; }
      next = el[(el.indexOf(cur) + 1) % el.length]; elect();
    };
    // the turn ends when the card's clock is next back at rest (measured from its clock, so a hidden-tab pause cannot skew it)
    const schedule = (v) => {
      clearTimeout(turn);
      const L = v.s.loop, now = v.anim ? v.anim.time() : v.t;
      let rem = (((v.s.rest - now) % L) + L) % L; if (rem < 0.05) rem = L;
      turn = setTimeout(rotate, rem * 1000);
    };
    // v6k (review r7 S5): the card the visitor scrolled to wins the first turn over its row-mate. "Scrolled to" = the eligible
    // card whose vertical centre is nearest the viewport's centre (a side-by-side pair ties within 8 px: the first in reading order wins, the left card; rotate() then hands the turn on).
    const off = (v) => { const r = v.host.getBoundingClientRect(); return Math.abs((r.top + r.bottom) / 2 - innerHeight / 2); };
    const centred = () => {
      let best = null, bd = 0;
      for (const v of live) { if (!(v.ratio >= MIN)) continue; const d = off(v); if (!best || d < bd - 8 || (Math.abs(d - bd) <= 8 && order(v) < order(best))) { best = v; bd = d; } }
      return best;
    };
    let gesture = 0, gestureTimer = null, wonAt = -1, wonBy = 'elect', preempt = false, yRest = scrollY;   // scrollY when the last scroll settled
    const elect = () => {
      const best = centred();
      // v6j (tl-landing-ship-2 QA note): the holder keeps its turn while it stays >= MIN in view; the turn passes only at its loop's
      // end (rotate) or when it leaves, so a scroll cannot take a turn back from a card it was just handed to
      const keep = cur && live.includes(cur) && cur.ratio >= MIN;
      const handoff = next && live.includes(next) && next.ratio >= MIN ? next : null;
      next = null;
      const win = handoff || (keep ? cur : best);
      for (const v of live) { const want = v === win; if (want === v.on && (want || v.atRest)) continue; v.on = want; want ? go(v) : settle(v, v === cur && handoff && !preempt); }
      if (win !== cur || handoff) { clearTimeout(turn); turn = null; if (win) schedule(win); wonAt = gesture; wonBy = handoff ? 'handoff' : 'elect'; }
      cur = win; announce();
    };
    // a smooth scroll crosses earlier cards first, and the holder keeps its turn while in view, so the card passed on the way
    // could keep the first turn. When the scroll settles (150 ms quiet), a turn that was WON BY ELECTION during this scroll
    // gesture goes to the most centred card (handed over like a loop's end: the outgoing card finishes its cycle). A turn
    // handed over by rotate() or won before the gesture is taken back only by a deliberate scroll (>= 120 px), so small
    // scrolls do not flip turns.
    addEventListener('scroll', () => {
      if (!gestureTimer) gesture++;
      clearTimeout(gestureTimer);
      gestureTimer = setTimeout(() => {
        gestureTimer = null;
        const moved = Math.abs(scrollY - yRest) >= 120; yRest = scrollY;   // a deliberate scroll to another card (Canary -> Health is ~150 px)
        if (!cur || document.hidden || !(moved || (wonBy === 'elect' && wonAt === gesture))) return;
        const c = centred();
        if (c && c !== cur) { next = c; preempt = true; elect(); preempt = false; }   // mid-loop: the outgoing card finishes
      }, 150);
    }, { passive: true });
    io = new IntersectionObserver((es) => {
      for (const e of es) { const v = live.find((x) => x.host === e.target); if (!v) continue; v.ratio = e.intersectionRatio; v.area = e.intersectionRect.width * e.intersectionRect.height; }
      elect(); kick();
    }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
    lazy = new IntersectionObserver((es) => { for (const e of es) { if (!e.isIntersecting) continue; lazy.unobserve(e.target); const v = build(e.target); if (v) io.observe(e.target); } }, { rootMargin: '100% 0px 100% 0px' });
    document.addEventListener('visibilitychange', () => { for (const v of live) if (v.anim && v.on) document.hidden ? v.anim.pause() : v.anim.play(); clearTimeout(turn); turn = null; if (!document.hidden && cur) schedule(cur); announce(); kick(); });
    for (const h of hosts()) lazy.observe(h);
    let last = null, running = false;
    const FPS = +(q.get('vg-fps') || 0), minDt = FPS ? 1000 / FPS - 2 : 0;
    // the rAF clock serves only render(t) scenes that are on screen; it stops when none is (an idle rAF still costs a main
    // frame per vsync, and every main frame also re-styles the compositor's animations). v5 scenes never need it.
    const want = () => !document.hidden && live.some((v) => v.on && !v.anim);
    const tick = (now) => {
      if (!want()) { running = false; last = null; return; }
      if (minDt && last != null && now - last < minDt) { requestAnimationFrame(tick); return; }
      const dt = last == null ? 0 : Math.min(0.1, (now - last) / 1000);
      last = now;
      for (const v of live) if (v.on && !v.anim) {
        const p = v.t; v.t = (v.t + dt) % v.s.loop;
        // still intervals: the frame is identical across [a, b], so write nothing while inside one (holds cost 0)
        const st = v.s.still && v.s.still.find((r) => v.t >= r[0] && v.t <= r[1]);
        if (st && p >= st[0] && p <= st[1] && p <= v.t) continue;
        v.render(v.t);
      }
      requestAnimationFrame(tick);
    };
    kick = () => { if (!running && want()) { running = true; requestAnimationFrame(tick); } };
    document.documentElement.dataset.vgReady = '1';
  }
  // test hooks: drive every vignette to second t; they build every host first (a debugging aid, not a page path)
  window.__vgBuilt = () => live.map((v) => v.host.dataset.vg);
  window.__vgSet = (t) => { buildAll(); for (const v of live) { v.t = v.anim ? t : t % v.s.loop; v.render(v.t); } };   // absolute for compositor scenes (KB cycles)
  // loop check: serialise every vignette's DOM at t=a and t=b (render called directly, no modulo)
  window.__vgSnap = (t, withLabels) => { buildAll(); return live.map((v) => { if (v.anim) return [v.host.dataset.vg, v.anim.snap(t, withLabels)]; v.render(t); return [v.host.dataset.vg, v.host.innerHTML]; }); };
  window.__vgStills = () => Object.fromEntries(hosts().map((h) => [h.dataset.vg, (specOf(h) || {}).still || []]));
  window.__vgLoops = () => Object.fromEntries(hosts().map((h) => [h.dataset.vg, (specOf(h) || {}).loop]));
  window.__vgRest = (vg) => { const s = VG.spec(vg); return s ? s.rest : 0; };
  // the scenes register after this engine in the same script (a deferred bundle runs while readyState is 'interactive'),
  // so start on a microtask, after the whole bundle has run
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else Promise.resolve().then(start);
})();
