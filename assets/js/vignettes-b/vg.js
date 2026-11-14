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
   5. Kept: the phone composition (viewport <= 640 px) and the remount that keeps each clock; play at >= 35 % in view, pause
      off screen and in a hidden tab. */
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
    const v = { host, s, render, anim, t: freeze != null ? freeze % s.loop : keep != null ? keep : s.rest, on: false };
    v.render(v.t);
    live.push(v);
    host.dataset.vgLive = '1';
    return v;
  }
  const buildAll = () => { for (const h of hosts()) build(h); };
  // the phone has its own composition (one object kept big): re-mount the built hosts when the breakpoint flips, keeping each clock
  PHONE.addEventListener('change', () => {
    const keep = live.map((v) => [v.host, v.anim ? v.anim.time() : v.t]);
    live.length = 0;
    for (const [host, t] of keep) { delete host.dataset.vgLive; const v = build(host, t); if (v && io) io.observe(host); }
    kick();
  });
  function start() {
    if (freeze != null) { buildAll(); document.documentElement.dataset.vgReady = '1'; return; }
    if (reduced) { document.documentElement.dataset.vgReady = '1'; return; }   // the posters are the rest frames
    io = new IntersectionObserver((es) => { for (const e of es) { const v = live.find((x) => x.host === e.target); if (!v) continue; const on = e.intersectionRatio >= 0.35; if (v.anim && on !== v.on) on ? v.anim.play() : v.anim.pause(); v.on = on; } kick(); }, { threshold: [0, 0.35, 0.6, 1] });
    lazy = new IntersectionObserver((es) => { for (const e of es) { if (!e.isIntersecting) continue; lazy.unobserve(e.target); const v = build(e.target); if (v) io.observe(e.target); } }, { rootMargin: '100% 0px 100% 0px' });
    document.addEventListener('visibilitychange', () => { for (const v of live) if (v.anim && v.on) document.hidden ? v.anim.pause() : v.anim.play(); kick(); });
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
  window.__vgSet = (t) => { buildAll(); for (const v of live) { v.t = t % v.s.loop; v.render(v.t); } };
  // loop check: serialise every vignette's DOM at t=a and t=b (render called directly, no modulo)
  window.__vgSnap = (t) => { buildAll(); return live.map((v) => { if (v.anim) return [v.host.dataset.vg, v.anim.snap(t)]; v.render(t); return [v.host.dataset.vg, v.host.innerHTML]; }); };
  window.__vgStills = () => Object.fromEntries(hosts().map((h) => [h.dataset.vg, (specOf(h) || {}).still || []]));
  window.__vgLoops = () => Object.fromEntries(hosts().map((h) => [h.dataset.vg, (specOf(h) || {}).loop]));
  window.__vgRest = (vg) => { const s = VG.spec(vg); return s ? s.rest : 0; };
  // the scenes register on load (one script, defs first); start once the DOM is parsed
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
