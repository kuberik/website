var mi = Array.isArray, ud = Array.prototype.indexOf, sr = Array.from, wl = Object.defineProperty, ga = Object.getOwnPropertyDescriptor, dd = Object.getOwnPropertyDescriptors, fd = Object.prototype, pd = Array.prototype, kl = Object.getPrototypeOf, eo = Object.isExtensible;
function vd(e) {
  return typeof e == "function";
}
const ft = () => {
};
function hd(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function _l() {
  var e, t, n = new Promise((a, s) => {
    e = a, t = s;
  });
  return { promise: n, resolve: e, reject: t };
}
const at = 2, gi = 4, bi = 8, yl = 1 << 24, Jt = 16, gn = 32, Xn = 64, rr = 128, jt = 512, st = 1024, Ct = 2048, Gt = 4096, xt = 8192, cn = 16384, ir = 32768, Kt = 65536, to = 1 << 17, xl = 1 << 18, Fa = 1 << 19, md = 1 << 20, ln = 1 << 25, Kn = 32768, qr = 1 << 21, wi = 1 << 22, Mn = 1 << 23, zn = Symbol("$state"), gd = Symbol("legacy props"), bd = Symbol(""), fa = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
function Sl(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function wd() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function kd(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function _d() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function yd(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function xd() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Sd(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function Cd() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ad() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Td() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Md() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const Ed = 1, Ld = 2, Cl = 4, Nd = 8, Rd = 16, Od = 1, Dd = 2, Fd = 4, Id = 8, Pd = 16, jd = 1, Wd = 2, Bd = 4, zd = 1, Hd = 2, et = Symbol(), Vd = "http://www.w3.org/1999/xhtml", Ud = "http://www.w3.org/2000/svg", qd = "@attach";
function Gd() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Kd() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
function Al(e) {
  return e === this.v;
}
function Tl(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Ml(e) {
  return !Tl(e, this.v);
}
let Ia = !1;
function Yd() {
  Ia = !0;
}
let We = null;
function Sa(e) {
  We = e;
}
function vt(e) {
  return (
    /** @type {T} */
    $d().get(e)
  );
}
function Se(e, t = !1, n) {
  We = {
    p: We,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    l: Ia && !t ? { s: null, u: null, $: [] } : null
  };
}
function Ce(e) {
  var t = (
    /** @type {ComponentContext} */
    We
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var a of n)
      Ul(a);
  }
  return t.i = !0, We = t.p, /** @type {T} */
  {};
}
function vs() {
  return !Ia || We !== null && We.l === null;
}
function $d(e) {
  return We === null && Sl(), We.c ??= new Map(Qd(We) || void 0);
}
function Qd(e) {
  let t = e.p;
  for (; t !== null; ) {
    const n = t.c;
    if (n !== null)
      return n;
    t = t.p;
  }
  return null;
}
let Pn = [];
function El() {
  var e = Pn;
  Pn = [], hd(e);
}
function On(e) {
  if (Pn.length === 0 && !Qa) {
    var t = Pn;
    queueMicrotask(() => {
      t === Pn && El();
    });
  }
  Pn.push(e);
}
function Zd() {
  for (; Pn.length > 0; )
    El();
}
function Ll(e) {
  var t = xe;
  if (t === null)
    return ye.f |= Mn, e;
  if ((t.f & ir) === 0) {
    if ((t.f & rr) === 0)
      throw e;
    t.b.error(e);
  } else
    Ca(e, t);
}
function Ca(e, t) {
  for (; t !== null; ) {
    if ((t.f & rr) !== 0)
      try {
        t.b.error(e);
        return;
      } catch (n) {
        e = n;
      }
    t = t.parent;
  }
  throw e;
}
const Cs = /* @__PURE__ */ new Set();
let je = null, Ft = null, Dt = [], or = null, Gr = !1, Qa = !1;
class Ht {
  committed = !1;
  /**
   * The current values of any sources that are updated in this batch
   * They keys of this map are identical to `this.#previous`
   * @type {Map<Source, any>}
   */
  current = /* @__PURE__ */ new Map();
  /**
   * The values of any sources that are updated in this batch _before_ those updates took place.
   * They keys of this map are identical to `this.#current`
   * @type {Map<Source, any>}
   */
  previous = /* @__PURE__ */ new Map();
  /**
   * When the batch is committed (and the DOM is updated), we need to remove old branches
   * and append new ones by calling the functions added inside (if/each/key/etc) blocks
   * @type {Set<() => void>}
   */
  #e = /* @__PURE__ */ new Set();
  /**
   * If a fork is discarded, we need to destroy any effects that are no longer needed
   * @type {Set<(batch: Batch) => void>}
   */
  #t = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #n = 0;
  /**
   * The number of async effects that are currently in flight, _not_ inside a pending boundary
   */
  #a = 0;
  /**
   * A deferred that resolves when the batch is committed, used with `settled()`
   * TODO replace with Promise.withResolvers once supported widely enough
   * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
   */
  #r = null;
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Set<Effect>}
   */
  #s = /* @__PURE__ */ new Set();
  /**
   * Deferred effects that are MAYBE_DIRTY
   * @type {Set<Effect>}
   */
  #i = /* @__PURE__ */ new Set();
  /**
   * A set of branches that still exist, but will be destroyed when this batch
   * is committed — we skip over these during `process`
   * @type {Set<Effect>}
   */
  skipped_effects = /* @__PURE__ */ new Set();
  is_fork = !1;
  is_deferred() {
    return this.is_fork || this.#a > 0;
  }
  /**
   *
   * @param {Effect[]} root_effects
   */
  process(t) {
    Dt = [], this.apply();
    var n = {
      parent: null,
      effect: null,
      effects: [],
      render_effects: []
    };
    for (const a of t)
      this.#o(a, n);
    this.is_fork || this.#u(), this.is_deferred() ? (this.#l(n.effects), this.#l(n.render_effects)) : (je = null, no(n.render_effects), no(n.effects), this.#r?.resolve()), Ft = null;
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {EffectTarget} target
   */
  #o(t, n) {
    t.f ^= st;
    for (var a = t.first; a !== null; ) {
      var s = a.f, r = (s & (gn | Xn)) !== 0, i = r && (s & st) !== 0, o = i || (s & xt) !== 0 || this.skipped_effects.has(a);
      if ((a.f & rr) !== 0 && a.b?.is_pending() && (n = {
        parent: n,
        effect: a,
        effects: [],
        render_effects: []
      }), !o && a.fn !== null) {
        r ? a.f ^= st : (s & gi) !== 0 ? n.effects.push(a) : gs(a) && ((a.f & Jt) !== 0 && this.#s.add(a), rs(a));
        var l = a.first;
        if (l !== null) {
          a = l;
          continue;
        }
      }
      var c = a.parent;
      for (a = a.next; a === null && c !== null; )
        c === n.effect && (this.#l(n.effects), this.#l(n.render_effects), n = /** @type {EffectTarget} */
        n.parent), a = c.next, c = c.parent;
    }
  }
  /**
   * @param {Effect[]} effects
   */
  #l(t) {
    for (const n of t)
      (n.f & Ct) !== 0 ? this.#s.add(n) : (n.f & Gt) !== 0 && this.#i.add(n), this.#c(n.deps), it(n, st);
  }
  /**
   * @param {Value[] | null} deps
   */
  #c(t) {
    if (t !== null)
      for (const n of t)
        (n.f & at) === 0 || (n.f & Kn) === 0 || (n.f ^= Kn, this.#c(
          /** @type {Derived} */
          n.deps
        ));
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Source} source
   * @param {any} value
   */
  capture(t, n) {
    this.previous.has(t) || this.previous.set(t, n), (t.f & Mn) === 0 && (this.current.set(t, t.v), Ft?.set(t, t.v));
  }
  activate() {
    je = this, this.apply();
  }
  deactivate() {
    je === this && (je = null, Ft = null);
  }
  flush() {
    if (this.activate(), Dt.length > 0) {
      if (Nl(), je !== null && je !== this)
        return;
    } else this.#n === 0 && this.process([]);
    this.deactivate();
  }
  discard() {
    for (const t of this.#t) t(this);
    this.#t.clear();
  }
  #u() {
    if (this.#a === 0) {
      for (const t of this.#e) t();
      this.#e.clear();
    }
    this.#n === 0 && this.#d();
  }
  #d() {
    if (Cs.size > 1) {
      this.previous.clear();
      var t = Ft, n = !0, a = {
        parent: null,
        effect: null,
        effects: [],
        render_effects: []
      };
      for (const r of Cs) {
        if (r === this) {
          n = !1;
          continue;
        }
        const i = [];
        for (const [l, c] of this.current) {
          if (r.current.has(l))
            if (n && c !== r.current.get(l))
              r.current.set(l, c);
            else
              continue;
          i.push(l);
        }
        if (i.length === 0)
          continue;
        const o = [...r.current.keys()].filter((l) => !this.current.has(l));
        if (o.length > 0) {
          var s = Dt;
          Dt = [];
          const l = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Map();
          for (const u of i)
            Rl(u, o, l, c);
          if (Dt.length > 0) {
            je = r, r.apply();
            for (const u of Dt)
              r.#o(u, a);
            r.deactivate();
          }
          Dt = s;
        }
      }
      je = null, Ft = t;
    }
    this.committed = !0, Cs.delete(this);
  }
  /**
   *
   * @param {boolean} blocking
   */
  increment(t) {
    this.#n += 1, t && (this.#a += 1);
  }
  /**
   *
   * @param {boolean} blocking
   */
  decrement(t) {
    this.#n -= 1, t && (this.#a -= 1), this.revive();
  }
  revive() {
    for (const t of this.#s)
      this.#i.delete(t), it(t, Ct), Yn(t);
    for (const t of this.#i)
      it(t, Gt), Yn(t);
    this.flush();
  }
  /** @param {() => void} fn */
  oncommit(t) {
    this.#e.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    this.#t.add(t);
  }
  settled() {
    return (this.#r ??= _l()).promise;
  }
  static ensure() {
    if (je === null) {
      const t = je = new Ht();
      Cs.add(je), Qa || Ht.enqueue(() => {
        je === t && t.flush();
      });
    }
    return je;
  }
  /** @param {() => void} task */
  static enqueue(t) {
    On(t);
  }
  apply() {
  }
}
function Xd(e) {
  var t = Qa;
  Qa = !0;
  try {
    for (var n; ; ) {
      if (Zd(), Dt.length === 0 && (je?.flush(), Dt.length === 0))
        return or = null, /** @type {T} */
        n;
      Nl();
    }
  } finally {
    Qa = t;
  }
}
function Nl() {
  var e = Vn;
  Gr = !0;
  var t = null;
  try {
    var n = 0;
    for (zs(!0); Dt.length > 0; ) {
      var a = Ht.ensure();
      if (n++ > 1e3) {
        var s, r;
        Jd();
      }
      a.process(Dt), En.clear();
    }
  } finally {
    Gr = !1, zs(e), or = null;
  }
}
function Jd() {
  try {
    xd();
  } catch (e) {
    Ca(e, or);
  }
}
let an = null;
function no(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var a = e[n++];
      if ((a.f & (cn | xt)) === 0 && gs(a) && (an = /* @__PURE__ */ new Set(), rs(a), a.deps === null && a.first === null && a.nodes === null && (a.teardown === null && a.ac === null ? $l(a) : a.fn = null), an?.size > 0)) {
        En.clear();
        for (const s of an) {
          if ((s.f & (cn | xt)) !== 0) continue;
          const r = [s];
          let i = s.parent;
          for (; i !== null; )
            an.has(i) && (an.delete(i), r.push(i)), i = i.parent;
          for (let o = r.length - 1; o >= 0; o--) {
            const l = r[o];
            (l.f & (cn | xt)) === 0 && rs(l);
          }
        }
        an.clear();
      }
    }
    an = null;
  }
}
function Rl(e, t, n, a) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const s of e.reactions) {
      const r = s.f;
      (r & at) !== 0 ? Rl(
        /** @type {Derived} */
        s,
        t,
        n,
        a
      ) : (r & (wi | Jt)) !== 0 && (r & Ct) === 0 && Ol(s, t, a) && (it(s, Ct), Yn(
        /** @type {Effect} */
        s
      ));
    }
}
function Ol(e, t, n) {
  const a = n.get(e);
  if (a !== void 0) return a;
  if (e.deps !== null)
    for (const s of e.deps) {
      if (t.includes(s))
        return !0;
      if ((s.f & at) !== 0 && Ol(
        /** @type {Derived} */
        s,
        t,
        n
      ))
        return n.set(
          /** @type {Derived} */
          s,
          !0
        ), !0;
    }
  return n.set(e, !1), !1;
}
function Yn(e) {
  for (var t = or = e; t.parent !== null; ) {
    t = t.parent;
    var n = t.f;
    if (Gr && t === xe && (n & Jt) !== 0 && (n & xl) === 0)
      return;
    if ((n & (Xn | gn)) !== 0) {
      if ((n & st) === 0) return;
      t.f ^= st;
    }
  }
  Dt.push(t);
}
function ef(e) {
  let t = 0, n = Rn(0), a;
  return () => {
    as() && (d(n), ql(() => (t === 0 && (a = $t(() => e(() => zt(n)))), t += 1, () => {
      On(() => {
        t -= 1, t === 0 && (a?.(), a = void 0, zt(n));
      });
    })));
  };
}
var tf = Kt | Fa | rr;
function nf(e, t, n) {
  new af(e, t, n);
}
class af {
  /** @type {Boundary | null} */
  parent;
  #e = !1;
  /** @type {TemplateNode} */
  #t;
  /** @type {TemplateNode | null} */
  #n = null;
  /** @type {BoundaryProps} */
  #a;
  /** @type {((anchor: Node) => void)} */
  #r;
  /** @type {Effect} */
  #s;
  /** @type {Effect | null} */
  #i = null;
  /** @type {Effect | null} */
  #o = null;
  /** @type {Effect | null} */
  #l = null;
  /** @type {DocumentFragment | null} */
  #c = null;
  /** @type {TemplateNode | null} */
  #u = null;
  #d = 0;
  #f = 0;
  #v = !1;
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #p = null;
  #w = ef(() => (this.#p = Rn(this.#d), () => {
    this.#p = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   */
  constructor(t, n, a) {
    this.#t = t, this.#a = n, this.#r = a, this.parent = /** @type {Effect} */
    xe.b, this.#e = !!this.#a.pending, this.#s = Wa(() => {
      xe.b = this;
      {
        var s = this.#g();
        try {
          this.#i = ut(() => a(s));
        } catch (r) {
          this.error(r);
        }
        this.#f > 0 ? this.#m() : this.#e = !1;
      }
      return () => {
        this.#u?.remove();
      };
    }, tf);
  }
  #k() {
    try {
      this.#i = ut(() => this.#r(this.#t));
    } catch (t) {
      this.error(t);
    }
    this.#e = !1;
  }
  #_() {
    const t = this.#a.pending;
    t && (this.#o = ut(() => t(this.#t)), Ht.enqueue(() => {
      var n = this.#g();
      this.#i = this.#h(() => (Ht.ensure(), ut(() => this.#r(n)))), this.#f > 0 ? this.#m() : (Hn(
        /** @type {Effect} */
        this.#o,
        () => {
          this.#o = null;
        }
      ), this.#e = !1);
    }));
  }
  #g() {
    var t = this.#t;
    return this.#e && (this.#u = un(), this.#t.before(this.#u), t = this.#u), t;
  }
  /**
   * Returns `true` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_pending() {
    return this.#e || !!this.parent && this.parent.is_pending();
  }
  has_pending_snippet() {
    return !!this.#a.pending;
  }
  /**
   * @param {() => Effect | null} fn
   */
  #h(t) {
    var n = xe, a = ye, s = We;
    Yt(this.#s), pt(this.#s), Sa(this.#s.ctx);
    try {
      return t();
    } catch (r) {
      return Ll(r), null;
    } finally {
      Yt(n), pt(a), Sa(s);
    }
  }
  #m() {
    const t = (
      /** @type {(anchor: Node) => void} */
      this.#a.pending
    );
    this.#i !== null && (this.#c = document.createDocumentFragment(), this.#c.append(
      /** @type {TemplateNode} */
      this.#u
    ), Xl(this.#i, this.#c)), this.#o === null && (this.#o = ut(() => t(this.#t)));
  }
  /**
   * Updates the pending count associated with the currently visible pending snippet,
   * if any, such that we can replace the snippet with content once work is done
   * @param {1 | -1} d
   */
  #b(t) {
    if (!this.has_pending_snippet()) {
      this.parent && this.parent.#b(t);
      return;
    }
    this.#f += t, this.#f === 0 && (this.#e = !1, this.#o && Hn(this.#o, () => {
      this.#o = null;
    }), this.#c && (this.#t.before(this.#c), this.#c = null));
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   */
  update_pending_count(t) {
    this.#b(t), this.#d += t, this.#p && Aa(this.#p, this.#d);
  }
  get_effect_pending() {
    return this.#w(), d(
      /** @type {Source<number>} */
      this.#p
    );
  }
  /** @param {unknown} error */
  error(t) {
    var n = this.#a.onerror;
    let a = this.#a.failed;
    if (this.#v || !n && !a)
      throw t;
    this.#i && (nt(this.#i), this.#i = null), this.#o && (nt(this.#o), this.#o = null), this.#l && (nt(this.#l), this.#l = null);
    var s = !1, r = !1;
    const i = () => {
      if (s) {
        Kd();
        return;
      }
      s = !0, r && Md(), Ht.ensure(), this.#d = 0, this.#l !== null && Hn(this.#l, () => {
        this.#l = null;
      }), this.#e = this.has_pending_snippet(), this.#i = this.#h(() => (this.#v = !1, ut(() => this.#r(this.#t)))), this.#f > 0 ? this.#m() : this.#e = !1;
    };
    var o = ye;
    try {
      pt(null), r = !0, n?.(t, i), r = !1;
    } catch (l) {
      Ca(l, this.#s && this.#s.parent);
    } finally {
      pt(o);
    }
    a && On(() => {
      this.#l = this.#h(() => {
        Ht.ensure(), this.#v = !0;
        try {
          return ut(() => {
            a(
              this.#t,
              () => t,
              () => i
            );
          });
        } catch (l) {
          return Ca(
            l,
            /** @type {Effect} */
            this.#s.parent
          ), null;
        } finally {
          this.#v = !1;
        }
      });
    });
  }
}
function Dl(e, t, n, a) {
  const s = vs() ? lr : ki;
  if (n.length === 0 && e.length === 0) {
    a(t.map(s));
    return;
  }
  var r = je, i = (
    /** @type {Effect} */
    xe
  ), o = sf();
  function l() {
    Promise.all(n.map((c) => /* @__PURE__ */ rf(c))).then((c) => {
      o();
      try {
        a([...t.map(s), ...c]);
      } catch (u) {
        (i.f & cn) === 0 && Ca(u, i);
      }
      r?.deactivate(), Bs();
    }).catch((c) => {
      Ca(c, i);
    });
  }
  e.length > 0 ? Promise.all(e).then(() => {
    o();
    try {
      return l();
    } finally {
      r?.deactivate(), Bs();
    }
  }) : l();
}
function sf() {
  var e = xe, t = ye, n = We, a = je;
  return function(r = !0) {
    Yt(e), pt(t), Sa(n), r && a?.activate();
  };
}
function Bs() {
  Yt(null), pt(null), Sa(null);
}
// @__NO_SIDE_EFFECTS__
function lr(e) {
  var t = at | Ct, n = ye !== null && (ye.f & at) !== 0 ? (
    /** @type {Derived} */
    ye
  ) : null;
  return xe !== null && (xe.f |= Fa), {
    ctx: We,
    deps: null,
    effects: null,
    equals: Al,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      et
    ),
    wv: 0,
    parent: n ?? xe,
    ac: null
  };
}
// @__NO_SIDE_EFFECTS__
function rf(e, t) {
  let n = (
    /** @type {Effect | null} */
    xe
  );
  n === null && wd();
  var a = (
    /** @type {Boundary} */
    n.b
  ), s = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), r = Rn(
    /** @type {V} */
    et
  ), i = !ye, o = /* @__PURE__ */ new Map();
  return bf(() => {
    var l = _l();
    s = l.promise;
    try {
      Promise.resolve(e()).then(l.resolve, l.reject).then(() => {
        c === je && c.committed && c.deactivate(), Bs();
      });
    } catch (p) {
      l.reject(p), Bs();
    }
    var c = (
      /** @type {Batch} */
      je
    );
    if (i) {
      var u = !a.is_pending();
      a.update_pending_count(1), c.increment(u), o.get(c)?.reject(fa), o.delete(c), o.set(c, l);
    }
    const f = (p, v = void 0) => {
      if (c.activate(), v)
        v !== fa && (r.f |= Mn, Aa(r, v));
      else {
        (r.f & Mn) !== 0 && (r.f ^= Mn), Aa(r, p);
        for (const [y, b] of o) {
          if (o.delete(y), y === c) break;
          b.reject(fa);
        }
      }
      i && (a.update_pending_count(-1), c.decrement(u));
    };
    l.promise.then(f, (p) => f(null, p || "unknown"));
  }), ja(() => {
    for (const l of o.values())
      l.reject(fa);
  }), new Promise((l) => {
    function c(u) {
      function f() {
        u === s ? l(r) : c(s);
      }
      u.then(f, f);
    }
    c(s);
  });
}
// @__NO_SIDE_EFFECTS__
function V(e) {
  const t = /* @__PURE__ */ lr(e);
  return Jl(t), t;
}
// @__NO_SIDE_EFFECTS__
function ki(e) {
  const t = /* @__PURE__ */ lr(e);
  return t.equals = Ml, t;
}
function Fl(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      nt(
        /** @type {Effect} */
        t[n]
      );
  }
}
function of(e) {
  for (var t = e.parent; t !== null; ) {
    if ((t.f & at) === 0)
      return (t.f & cn) === 0 ? (
        /** @type {Effect} */
        t
      ) : null;
    t = t.parent;
  }
  return null;
}
function _i(e) {
  var t, n = xe;
  Yt(of(e));
  try {
    e.f &= ~Kn, Fl(e), t = ac(e);
  } finally {
    Yt(n);
  }
  return t;
}
function Il(e) {
  var t = _i(e);
  if (e.equals(t) || (je?.is_fork || (e.v = t), e.wv = tc()), !Jn)
    if (Ft !== null)
      (as() || je?.is_fork) && Ft.set(e, t);
    else {
      var n = (e.f & jt) === 0 ? Gt : st;
      it(e, n);
    }
}
let Kr = /* @__PURE__ */ new Set();
const En = /* @__PURE__ */ new Map();
let Pl = !1;
function Rn(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: Al,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function Ee(e, t) {
  const n = Rn(e);
  return Jl(n), n;
}
// @__NO_SIDE_EFFECTS__
function jl(e, t = !1, n = !0) {
  const a = Rn(e);
  return t || (a.equals = Ml), Ia && n && We !== null && We.l !== null && (We.l.s ??= []).push(a), a;
}
function me(e, t, n = !1) {
  ye !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!Vt || (ye.f & to) !== 0) && vs() && (ye.f & (at | Jt | wi | to)) !== 0 && !dn?.includes(e) && Td();
  let a = n ? Pt(t) : t;
  return Aa(e, a);
}
function Aa(e, t) {
  if (!e.equals(t)) {
    var n = e.v;
    Jn ? En.set(e, t) : En.set(e, n), e.v = t;
    var a = Ht.ensure();
    a.capture(e, n), (e.f & at) !== 0 && ((e.f & Ct) !== 0 && _i(
      /** @type {Derived} */
      e
    ), it(e, (e.f & jt) !== 0 ? st : Gt)), e.wv = tc(), Wl(e, Ct), vs() && xe !== null && (xe.f & st) !== 0 && (xe.f & (gn | Xn)) === 0 && (Rt === null ? _f([e]) : Rt.push(e)), !a.is_fork && Kr.size > 0 && !Pl && lf();
  }
  return t;
}
function lf() {
  Pl = !1;
  var e = Vn;
  zs(!0);
  const t = Array.from(Kr);
  try {
    for (const n of t)
      (n.f & st) !== 0 && it(n, Gt), gs(n) && rs(n);
  } finally {
    zs(e);
  }
  Kr.clear();
}
function cf(e, t = 1) {
  var n = d(e), a = t === 1 ? n++ : n--;
  return me(e, n), a;
}
function zt(e) {
  me(e, e.v + 1);
}
function Wl(e, t) {
  var n = e.reactions;
  if (n !== null)
    for (var a = vs(), s = n.length, r = 0; r < s; r++) {
      var i = n[r], o = i.f;
      if (!(!a && i === xe)) {
        var l = (o & Ct) === 0;
        if (l && it(i, t), (o & at) !== 0) {
          var c = (
            /** @type {Derived} */
            i
          );
          Ft?.delete(c), (o & Kn) === 0 && (o & jt && (i.f |= Kn), Wl(c, Gt));
        } else l && ((o & Jt) !== 0 && an !== null && an.add(
          /** @type {Effect} */
          i
        ), Yn(
          /** @type {Effect} */
          i
        ));
      }
    }
}
function Pt(e) {
  if (typeof e != "object" || e === null || zn in e)
    return e;
  const t = kl(e);
  if (t !== fd && t !== pd)
    return e;
  var n = /* @__PURE__ */ new Map(), a = mi(e), s = /* @__PURE__ */ Ee(0), r = fn, i = (o) => {
    if (fn === r)
      return o();
    var l = ye, c = fn;
    pt(null), ro(r);
    var u = o();
    return pt(l), ro(c), u;
  };
  return a && n.set("length", /* @__PURE__ */ Ee(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(o, l, c) {
        (!("value" in c) || c.configurable === !1 || c.enumerable === !1 || c.writable === !1) && Cd();
        var u = n.get(l);
        return u === void 0 ? u = i(() => {
          var f = /* @__PURE__ */ Ee(c.value);
          return n.set(l, f), f;
        }) : me(u, c.value, !0), !0;
      },
      deleteProperty(o, l) {
        var c = n.get(l);
        if (c === void 0) {
          if (l in o) {
            const u = i(() => /* @__PURE__ */ Ee(et));
            n.set(l, u), zt(s);
          }
        } else
          me(c, et), zt(s);
        return !0;
      },
      get(o, l, c) {
        if (l === zn)
          return e;
        var u = n.get(l), f = l in o;
        if (u === void 0 && (!f || ga(o, l)?.writable) && (u = i(() => {
          var v = Pt(f ? o[l] : et), y = /* @__PURE__ */ Ee(v);
          return y;
        }), n.set(l, u)), u !== void 0) {
          var p = d(u);
          return p === et ? void 0 : p;
        }
        return Reflect.get(o, l, c);
      },
      getOwnPropertyDescriptor(o, l) {
        var c = Reflect.getOwnPropertyDescriptor(o, l);
        if (c && "value" in c) {
          var u = n.get(l);
          u && (c.value = d(u));
        } else if (c === void 0) {
          var f = n.get(l), p = f?.v;
          if (f !== void 0 && p !== et)
            return {
              enumerable: !0,
              configurable: !0,
              value: p,
              writable: !0
            };
        }
        return c;
      },
      has(o, l) {
        if (l === zn)
          return !0;
        var c = n.get(l), u = c !== void 0 && c.v !== et || Reflect.has(o, l);
        if (c !== void 0 || xe !== null && (!u || ga(o, l)?.writable)) {
          c === void 0 && (c = i(() => {
            var p = u ? Pt(o[l]) : et, v = /* @__PURE__ */ Ee(p);
            return v;
          }), n.set(l, c));
          var f = d(c);
          if (f === et)
            return !1;
        }
        return u;
      },
      set(o, l, c, u) {
        var f = n.get(l), p = l in o;
        if (a && l === "length")
          for (var v = c; v < /** @type {Source<number>} */
          f.v; v += 1) {
            var y = n.get(v + "");
            y !== void 0 ? me(y, et) : v in o && (y = i(() => /* @__PURE__ */ Ee(et)), n.set(v + "", y));
          }
        if (f === void 0)
          (!p || ga(o, l)?.writable) && (f = i(() => /* @__PURE__ */ Ee(void 0)), me(f, Pt(c)), n.set(l, f));
        else {
          p = f.v !== et;
          var b = i(() => Pt(c));
          me(f, b);
        }
        var g = Reflect.getOwnPropertyDescriptor(o, l);
        if (g?.set && g.set.call(u, c), !p) {
          if (a && typeof l == "string") {
            var h = (
              /** @type {Source<number>} */
              n.get("length")
            ), x = Number(l);
            Number.isInteger(x) && x >= h.v && me(h, x + 1);
          }
          zt(s);
        }
        return !0;
      },
      ownKeys(o) {
        d(s);
        var l = Reflect.ownKeys(o).filter((f) => {
          var p = n.get(f);
          return p === void 0 || p.v !== et;
        });
        for (var [c, u] of n)
          u.v !== et && !(c in o) && l.push(c);
        return l;
      },
      setPrototypeOf() {
        Ad();
      }
    }
  );
}
function ao(e) {
  try {
    if (e !== null && typeof e == "object" && zn in e)
      return e[zn];
  } catch {
  }
  return e;
}
function uf(e, t) {
  return Object.is(ao(e), ao(t));
}
var ns, Bl, zl, Hl;
function df() {
  if (ns === void 0) {
    ns = window, Bl = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, n = Text.prototype;
    zl = ga(t, "firstChild").get, Hl = ga(t, "nextSibling").get, eo(e) && (e.__click = void 0, e.__className = void 0, e.__attributes = null, e.__style = void 0, e.__e = void 0), eo(n) && (n.__t = void 0);
  }
}
function un(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function Ta(e) {
  return (
    /** @type {TemplateNode | null} */
    zl.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function hs(e) {
  return (
    /** @type {TemplateNode | null} */
    Hl.call(e)
  );
}
function N(e, t) {
  return /* @__PURE__ */ Ta(e);
}
function ne(e, t = !1) {
  {
    var n = /* @__PURE__ */ Ta(e);
    return n instanceof Comment && n.data === "" ? /* @__PURE__ */ hs(n) : n;
  }
}
function I(e, t = 1, n = !1) {
  let a = e;
  for (; t--; )
    a = /** @type {TemplateNode} */
    /* @__PURE__ */ hs(a);
  return a;
}
function ff(e) {
  e.textContent = "";
}
function Vl() {
  return !1;
}
function pf(e, t) {
  if (t) {
    const n = document.body;
    e.autofocus = !0, On(() => {
      document.activeElement === n && e.focus();
    });
  }
}
function vf(e, t, n, a = !0) {
  a && n();
  for (var s of t)
    e.addEventListener(s, n);
  ja(() => {
    for (var r of t)
      e.removeEventListener(r, n);
  });
}
function Pa(e) {
  var t = ye, n = xe;
  pt(null), Yt(null);
  try {
    return e();
  } finally {
    pt(t), Yt(n);
  }
}
function hf(e) {
  xe === null && (ye === null && yd(), _d()), Jn && kd();
}
function mf(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function en(e, t, n) {
  var a = xe;
  a !== null && (a.f & xt) !== 0 && (e |= xt);
  var s = {
    ctx: We,
    deps: null,
    nodes: null,
    f: e | Ct | jt,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: a,
    b: a && a.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  if (n)
    try {
      rs(s), s.f |= ir;
    } catch (o) {
      throw nt(s), o;
    }
  else t !== null && Yn(s);
  var r = s;
  if (n && r.deps === null && r.teardown === null && r.nodes === null && r.first === r.last && // either `null`, or a singular child
  (r.f & Fa) === 0 && (r = r.first, (e & Jt) !== 0 && (e & Kt) !== 0 && r !== null && (r.f |= Kt)), r !== null && (r.parent = a, a !== null && mf(r, a), ye !== null && (ye.f & at) !== 0 && (e & Xn) === 0)) {
    var i = (
      /** @type {Derived} */
      ye
    );
    (i.effects ??= []).push(r);
  }
  return s;
}
function as() {
  return ye !== null && !Vt;
}
function ja(e) {
  const t = en(bi, null, !1);
  return it(t, st), t.teardown = e, t;
}
function Ln(e) {
  hf();
  var t = (
    /** @type {Effect} */
    xe.f
  ), n = !ye && (t & gn) !== 0 && (t & ir) === 0;
  if (n) {
    var a = (
      /** @type {ComponentContext} */
      We
    );
    (a.e ??= []).push(e);
  } else
    return Ul(e);
}
function Ul(e) {
  return en(gi | md, e, !1);
}
function gf(e) {
  Ht.ensure();
  const t = en(Xn | Fa, e, !0);
  return (n = {}) => new Promise((a) => {
    n.outro ? Hn(t, () => {
      nt(t), a(void 0);
    }) : (nt(t), a(void 0));
  });
}
function ms(e) {
  return en(gi, e, !1);
}
function bf(e) {
  return en(wi | Fa, e, !0);
}
function ql(e, t = 0) {
  return en(bi | t, e, !0);
}
function P(e, t = [], n = [], a = []) {
  Dl(a, t, n, (s) => {
    en(bi, () => e(...s.map(d)), !0);
  });
}
function Wa(e, t = 0) {
  var n = en(Jt | t, e, !0);
  return n;
}
function Gl(e, t = 0) {
  var n = en(yl | t, e, !0);
  return n;
}
function ut(e) {
  return en(gn | Fa, e, !0);
}
function Kl(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = Jn, a = ye;
    so(!0), pt(null);
    try {
      t.call(null);
    } finally {
      so(n), pt(a);
    }
  }
}
function Yl(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const s = n.ac;
    s !== null && Pa(() => {
      s.abort(fa);
    });
    var a = n.next;
    (n.f & Xn) !== 0 ? n.parent = null : nt(n, t), n = a;
  }
}
function wf(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    (t.f & gn) === 0 && nt(t), t = n;
  }
}
function nt(e, t = !0) {
  var n = !1;
  (t || (e.f & xl) !== 0) && e.nodes !== null && e.nodes.end !== null && (kf(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), n = !0), Yl(e, t && !n), Hs(e, 0), it(e, cn);
  var a = e.nodes && e.nodes.t;
  if (a !== null)
    for (const r of a)
      r.stop();
  Kl(e);
  var s = e.parent;
  s !== null && s.first !== null && $l(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = null;
}
function kf(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : /* @__PURE__ */ hs(e);
    e.remove(), e = n;
  }
}
function $l(e) {
  var t = e.parent, n = e.prev, a = e.next;
  n !== null && (n.next = a), a !== null && (a.prev = n), t !== null && (t.first === e && (t.first = a), t.last === e && (t.last = n));
}
function Hn(e, t, n = !0) {
  var a = [];
  Ql(e, a, !0);
  var s = () => {
    n && nt(e), t && t();
  }, r = a.length;
  if (r > 0) {
    var i = () => --r || s();
    for (var o of a)
      o.out(i);
  } else
    s();
}
function Ql(e, t, n) {
  if ((e.f & xt) === 0) {
    e.f ^= xt;
    var a = e.nodes && e.nodes.t;
    if (a !== null)
      for (const o of a)
        (o.is_global || n) && t.push(o);
    for (var s = e.first; s !== null; ) {
      var r = s.next, i = (s.f & Kt) !== 0 || // If this is a branch effect without a block effect parent,
      // it means the parent block effect was pruned. In that case,
      // transparency information was transferred to the branch effect.
      (s.f & gn) !== 0 && (e.f & Jt) !== 0;
      Ql(s, t, i ? n : !1), s = r;
    }
  }
}
function yi(e) {
  Zl(e, !0);
}
function Zl(e, t) {
  if ((e.f & xt) !== 0) {
    e.f ^= xt, (e.f & st) === 0 && (it(e, Ct), Yn(e));
    for (var n = e.first; n !== null; ) {
      var a = n.next, s = (n.f & Kt) !== 0 || (n.f & gn) !== 0;
      Zl(n, s ? t : !1), n = a;
    }
    var r = e.nodes && e.nodes.t;
    if (r !== null)
      for (const i of r)
        (i.is_global || t) && i.in();
  }
}
function Xl(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, a = e.nodes.end; n !== null; ) {
      var s = n === a ? null : /* @__PURE__ */ hs(n);
      t.append(n), n = s;
    }
}
let Vn = !1;
function zs(e) {
  Vn = e;
}
let Jn = !1;
function so(e) {
  Jn = e;
}
let ye = null, Vt = !1;
function pt(e) {
  ye = e;
}
let xe = null;
function Yt(e) {
  xe = e;
}
let dn = null;
function Jl(e) {
  ye !== null && (dn === null ? dn = [e] : dn.push(e));
}
let lt = null, _t = 0, Rt = null;
function _f(e) {
  Rt = e;
}
let ec = 1, ss = 0, fn = ss;
function ro(e) {
  fn = e;
}
function tc() {
  return ++ec;
}
function gs(e) {
  var t = e.f;
  if ((t & Ct) !== 0)
    return !0;
  if (t & at && (e.f &= ~Kn), (t & Gt) !== 0) {
    var n = e.deps;
    if (n !== null)
      for (var a = n.length, s = 0; s < a; s++) {
        var r = n[s];
        if (gs(
          /** @type {Derived} */
          r
        ) && Il(
          /** @type {Derived} */
          r
        ), r.wv > e.wv)
          return !0;
      }
    (t & jt) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    Ft === null && it(e, st);
  }
  return !1;
}
function nc(e, t, n = !0) {
  var a = e.reactions;
  if (a !== null && !dn?.includes(e))
    for (var s = 0; s < a.length; s++) {
      var r = a[s];
      (r.f & at) !== 0 ? nc(
        /** @type {Derived} */
        r,
        t,
        !1
      ) : t === r && (n ? it(r, Ct) : (r.f & st) !== 0 && it(r, Gt), Yn(
        /** @type {Effect} */
        r
      ));
    }
}
function ac(e) {
  var t = lt, n = _t, a = Rt, s = ye, r = dn, i = We, o = Vt, l = fn, c = e.f;
  lt = /** @type {null | Value[]} */
  null, _t = 0, Rt = null, ye = (c & (gn | Xn)) === 0 ? e : null, dn = null, Sa(e.ctx), Vt = !1, fn = ++ss, e.ac !== null && (Pa(() => {
    e.ac.abort(fa);
  }), e.ac = null);
  try {
    e.f |= qr;
    var u = (
      /** @type {Function} */
      e.fn
    ), f = u(), p = e.deps;
    if (lt !== null) {
      var v;
      if (Hs(e, _t), p !== null && _t > 0)
        for (p.length = _t + lt.length, v = 0; v < lt.length; v++)
          p[_t + v] = lt[v];
      else
        e.deps = p = lt;
      if (as() && (e.f & jt) !== 0)
        for (v = _t; v < p.length; v++)
          (p[v].reactions ??= []).push(e);
    } else p !== null && _t < p.length && (Hs(e, _t), p.length = _t);
    if (vs() && Rt !== null && !Vt && p !== null && (e.f & (at | Gt | Ct)) === 0)
      for (v = 0; v < /** @type {Source[]} */
      Rt.length; v++)
        nc(
          Rt[v],
          /** @type {Effect} */
          e
        );
    return s !== null && s !== e && (ss++, Rt !== null && (a === null ? a = Rt : a.push(.../** @type {Source[]} */
    Rt))), (e.f & Mn) !== 0 && (e.f ^= Mn), f;
  } catch (y) {
    return Ll(y);
  } finally {
    e.f ^= qr, lt = t, _t = n, Rt = a, ye = s, dn = r, Sa(i), Vt = o, fn = l;
  }
}
function yf(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var a = ud.call(n, e);
    if (a !== -1) {
      var s = n.length - 1;
      s === 0 ? n = t.reactions = null : (n[a] = n[s], n.pop());
    }
  }
  n === null && (t.f & at) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (lt === null || !lt.includes(t)) && (it(t, Gt), (t.f & jt) !== 0 && (t.f ^= jt, t.f &= ~Kn), Fl(
    /** @type {Derived} **/
    t
  ), Hs(
    /** @type {Derived} **/
    t,
    0
  ));
}
function Hs(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var a = t; a < n.length; a++)
      yf(e, n[a]);
}
function rs(e) {
  var t = e.f;
  if ((t & cn) === 0) {
    it(e, st);
    var n = xe, a = Vn;
    xe = e, Vn = !0;
    try {
      (t & (Jt | yl)) !== 0 ? wf(e) : Yl(e), Kl(e);
      var s = ac(e);
      e.teardown = typeof s == "function" ? s : null, e.wv = ec;
      var r;
    } finally {
      Vn = a, xe = n;
    }
  }
}
async function sc() {
  await Promise.resolve(), Xd();
}
function d(e) {
  var t = e.f, n = (t & at) !== 0;
  if (ye !== null && !Vt) {
    var a = xe !== null && (xe.f & cn) !== 0;
    if (!a && !dn?.includes(e)) {
      var s = ye.deps;
      if ((ye.f & qr) !== 0)
        e.rv < ss && (e.rv = ss, lt === null && s !== null && s[_t] === e ? _t++ : lt === null ? lt = [e] : lt.includes(e) || lt.push(e));
      else {
        (ye.deps ??= []).push(e);
        var r = e.reactions;
        r === null ? e.reactions = [ye] : r.includes(ye) || r.push(ye);
      }
    }
  }
  if (Jn) {
    if (En.has(e))
      return En.get(e);
    if (n) {
      var i = (
        /** @type {Derived} */
        e
      ), o = i.v;
      return ((i.f & st) === 0 && i.reactions !== null || ic(i)) && (o = _i(i)), En.set(i, o), o;
    }
  } else n && (!Ft?.has(e) || je?.is_fork && !as()) && (i = /** @type {Derived} */
  e, gs(i) && Il(i), Vn && as() && (i.f & jt) === 0 && rc(i));
  if (Ft?.has(e))
    return Ft.get(e);
  if ((e.f & Mn) !== 0)
    throw e.v;
  return e.v;
}
function rc(e) {
  if (e.deps !== null) {
    e.f ^= jt;
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & at) !== 0 && (t.f & jt) === 0 && rc(
        /** @type {Derived} */
        t
      );
  }
}
function ic(e) {
  if (e.v === et) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (En.has(t) || (t.f & at) !== 0 && ic(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function $t(e) {
  var t = Vt;
  try {
    return Vt = !0, e();
  } finally {
    Vt = t;
  }
}
const xf = -7169;
function it(e, t) {
  e.f = e.f & xf | t;
}
function Sf(e) {
  return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
const Cf = [
  "beforeinput",
  "click",
  "change",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart"
];
function Af(e) {
  return Cf.includes(e);
}
const Tf = {
  // no `class: 'className'` because we handle that separately
  formnovalidate: "formNoValidate",
  ismap: "isMap",
  nomodule: "noModule",
  playsinline: "playsInline",
  readonly: "readOnly",
  defaultvalue: "defaultValue",
  defaultchecked: "defaultChecked",
  srcobject: "srcObject",
  novalidate: "noValidate",
  allowfullscreen: "allowFullscreen",
  disablepictureinpicture: "disablePictureInPicture",
  disableremoteplayback: "disableRemotePlayback"
};
function Mf(e) {
  return e = e.toLowerCase(), Tf[e] ?? e;
}
const Ef = ["touchstart", "touchmove"];
function Lf(e) {
  return Ef.includes(e);
}
const oc = /* @__PURE__ */ new Set(), Yr = /* @__PURE__ */ new Set();
function lc(e, t, n, a = {}) {
  function s(r) {
    if (a.capture || Ya.call(t, r), !r.cancelBubble)
      return Pa(() => n?.call(this, r));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? On(() => {
    t.addEventListener(e, s, a);
  }) : t.addEventListener(e, s, a), s;
}
function $r(e, t, n, a, s) {
  var r = { capture: a, passive: s }, i = lc(e, t, n, r);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && ja(() => {
    t.removeEventListener(e, i, r);
  });
}
function Ba(e) {
  for (var t = 0; t < e.length; t++)
    oc.add(e[t]);
  for (var n of Yr)
    n(e);
}
let io = null;
function Ya(e) {
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), a = e.type, s = e.composedPath?.() || [], r = (
    /** @type {null | Element} */
    s[0] || e.target
  );
  io = e;
  var i = 0, o = io === e && e.__root;
  if (o) {
    var l = s.indexOf(o);
    if (l !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e.__root = t;
      return;
    }
    var c = s.indexOf(t);
    if (c === -1)
      return;
    l <= c && (i = l);
  }
  if (r = /** @type {Element} */
  s[i] || e.target, r !== t) {
    wl(e, "currentTarget", {
      configurable: !0,
      get() {
        return r || n;
      }
    });
    var u = ye, f = xe;
    pt(null), Yt(null);
    try {
      for (var p, v = []; r !== null; ) {
        var y = r.assignedSlot || r.parentNode || /** @type {any} */
        r.host || null;
        try {
          var b = r["__" + a];
          b != null && (!/** @type {any} */
          r.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === r) && b.call(r, e);
        } catch (g) {
          p ? v.push(g) : p = g;
        }
        if (e.cancelBubble || y === t || y === null)
          break;
        r = y;
      }
      if (p) {
        for (let g of v)
          queueMicrotask(() => {
            throw g;
          });
        throw p;
      }
    } finally {
      e.__root = t, delete e.currentTarget, pt(u), Yt(f);
    }
  }
}
function cc(e) {
  var t = document.createElement("template");
  return t.innerHTML = e.replaceAll("<!>", "<!---->"), t.content;
}
function is(e, t) {
  var n = (
    /** @type {Effect} */
    xe
  );
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function W(e, t) {
  var n = (t & zd) !== 0, a = (t & Hd) !== 0, s, r = !e.startsWith("<!>");
  return () => {
    s === void 0 && (s = cc(r ? e : "<!>" + e), n || (s = /** @type {TemplateNode} */
    /* @__PURE__ */ Ta(s)));
    var i = (
      /** @type {TemplateNode} */
      a || Bl ? document.importNode(s, !0) : s.cloneNode(!0)
    );
    if (n) {
      var o = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Ta(i)
      ), l = (
        /** @type {TemplateNode} */
        i.lastChild
      );
      is(o, l);
    } else
      is(i, i);
    return i;
  };
}
// @__NO_SIDE_EFFECTS__
function Nf(e, t, n = "svg") {
  var a = !e.startsWith("<!>"), s = `<${n}>${a ? e : "<!>" + e}</${n}>`, r;
  return () => {
    if (!r) {
      var i = (
        /** @type {DocumentFragment} */
        cc(s)
      ), o = (
        /** @type {Element} */
        /* @__PURE__ */ Ta(i)
      );
      r = /** @type {Element} */
      /* @__PURE__ */ Ta(o);
    }
    var l = (
      /** @type {TemplateNode} */
      r.cloneNode(!0)
    );
    return is(l, l), l;
  };
}
// @__NO_SIDE_EFFECTS__
function ue(e, t) {
  return /* @__PURE__ */ Nf(e, t, "svg");
}
function le() {
  var e = document.createDocumentFragment(), t = document.createComment(""), n = un();
  return e.append(t, n), is(t, n), e;
}
function M(e, t) {
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
let Vs = !0;
function As(e) {
  Vs = e;
}
function K(e, t) {
  var n = t == null ? "" : typeof t == "object" ? t + "" : t;
  n !== (e.__t ??= e.nodeValue) && (e.__t = n, e.nodeValue = n + "");
}
function uc(e, t) {
  return Rf(e, t);
}
const na = /* @__PURE__ */ new Map();
function Rf(e, { target: t, anchor: n, props: a = {}, events: s, context: r, intro: i = !0 }) {
  df();
  var o = /* @__PURE__ */ new Set(), l = (f) => {
    for (var p = 0; p < f.length; p++) {
      var v = f[p];
      if (!o.has(v)) {
        o.add(v);
        var y = Lf(v);
        t.addEventListener(v, Ya, { passive: y });
        var b = na.get(v);
        b === void 0 ? (document.addEventListener(v, Ya, { passive: y }), na.set(v, 1)) : na.set(v, b + 1);
      }
    }
  };
  l(sr(oc)), Yr.add(l);
  var c = void 0, u = gf(() => {
    var f = n ?? t.appendChild(un());
    return nf(
      /** @type {TemplateNode} */
      f,
      {
        pending: () => {
        }
      },
      (p) => {
        if (r) {
          Se({});
          var v = (
            /** @type {ComponentContext} */
            We
          );
          v.c = r;
        }
        s && (a.$$events = s), Vs = i, c = e(p, a) || {}, Vs = !0, r && Ce();
      }
    ), () => {
      for (var p of o) {
        t.removeEventListener(p, Ya);
        var v = (
          /** @type {number} */
          na.get(p)
        );
        --v === 0 ? (document.removeEventListener(p, Ya), na.delete(p)) : na.set(p, v);
      }
      Yr.delete(l), f !== n && f.parentNode?.removeChild(f);
    };
  });
  return Of.set(c, u), c;
}
let Of = /* @__PURE__ */ new WeakMap();
class cr {
  /** @type {TemplateNode} */
  anchor;
  /** @type {Map<Batch, Key>} */
  #e = /* @__PURE__ */ new Map();
  /**
   * Map of keys to effects that are currently rendered in the DOM.
   * These effects are visible and actively part of the document tree.
   * Example:
   * ```
   * {#if condition}
   * 	foo
   * {:else}
   * 	bar
   * {/if}
   * ```
   * Can result in the entries `true->Effect` and `false->Effect`
   * @type {Map<Key, Effect>}
   */
  #t = /* @__PURE__ */ new Map();
  /**
   * Similar to #onscreen with respect to the keys, but contains branches that are not yet
   * in the DOM, because their insertion is deferred.
   * @type {Map<Key, Branch>}
   */
  #n = /* @__PURE__ */ new Map();
  /**
   * Keys of effects that are currently outroing
   * @type {Set<Key>}
   */
  #a = /* @__PURE__ */ new Set();
  /**
   * Whether to pause (i.e. outro) on change, or destroy immediately.
   * This is necessary for `<svelte:element>`
   */
  #r = !0;
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(t, n = !0) {
    this.anchor = t, this.#r = n;
  }
  #s = () => {
    var t = (
      /** @type {Batch} */
      je
    );
    if (this.#e.has(t)) {
      var n = (
        /** @type {Key} */
        this.#e.get(t)
      ), a = this.#t.get(n);
      if (a)
        yi(a), this.#a.delete(n);
      else {
        var s = this.#n.get(n);
        s && (this.#t.set(n, s.effect), this.#n.delete(n), s.fragment.lastChild.remove(), this.anchor.before(s.fragment), a = s.effect);
      }
      for (const [r, i] of this.#e) {
        if (this.#e.delete(r), r === t)
          break;
        const o = this.#n.get(i);
        o && (nt(o.effect), this.#n.delete(i));
      }
      for (const [r, i] of this.#t) {
        if (r === n || this.#a.has(r)) continue;
        const o = () => {
          if (Array.from(this.#e.values()).includes(r)) {
            var c = document.createDocumentFragment();
            Xl(i, c), c.append(un()), this.#n.set(r, { effect: i, fragment: c });
          } else
            nt(i);
          this.#a.delete(r), this.#t.delete(r);
        };
        this.#r || !a ? (this.#a.add(r), Hn(i, o, !1)) : o();
      }
    }
  };
  /**
   * @param {Batch} batch
   */
  #i = (t) => {
    this.#e.delete(t);
    const n = Array.from(this.#e.values());
    for (const [a, s] of this.#n)
      n.includes(a) || (nt(s.effect), this.#n.delete(a));
  };
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(t, n) {
    var a = (
      /** @type {Batch} */
      je
    ), s = Vl();
    if (n && !this.#t.has(t) && !this.#n.has(t))
      if (s) {
        var r = document.createDocumentFragment(), i = un();
        r.append(i), this.#n.set(t, {
          effect: ut(() => n(i)),
          fragment: r
        });
      } else
        this.#t.set(
          t,
          ut(() => n(this.anchor))
        );
    if (this.#e.set(a, t), s) {
      for (const [o, l] of this.#t)
        o === t ? a.skipped_effects.delete(l) : a.skipped_effects.add(l);
      for (const [o, l] of this.#n)
        o === t ? a.skipped_effects.delete(l.effect) : a.skipped_effects.add(l.effect);
      a.oncommit(this.#s), a.ondiscard(this.#i);
    } else
      this.#s();
  }
}
function O(e, t, n = !1) {
  var a = new cr(e), s = n ? Kt : 0;
  function r(i, o) {
    a.ensure(i, o);
  }
  Wa(() => {
    var i = !1;
    t((o, l = !0) => {
      i = !0, r(l, o);
    }), i || r(!1, null);
  }, s);
}
function xi(e, t) {
  return t;
}
function Df(e, t, n) {
  for (var a = [], s = t.length, r, i = t.length, o = 0; o < s; o++) {
    let f = t[o];
    Hn(
      f,
      () => {
        if (r) {
          if (r.pending.delete(f), r.done.add(f), r.pending.size === 0) {
            var p = (
              /** @type {Set<EachOutroGroup>} */
              e.outrogroups
            );
            Qr(sr(r.done)), p.delete(r), p.size === 0 && (e.outrogroups = null);
          }
        } else
          i -= 1;
      },
      !1
    );
  }
  if (i === 0) {
    var l = a.length === 0 && n !== null;
    if (l) {
      var c = (
        /** @type {Element} */
        n
      ), u = (
        /** @type {Element} */
        c.parentNode
      );
      ff(u), u.append(c), e.items.clear();
    }
    Qr(t, !l);
  } else
    r = {
      pending: new Set(t),
      done: /* @__PURE__ */ new Set()
    }, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(r);
}
function Qr(e, t = !0) {
  for (var n = 0; n < e.length; n++)
    nt(e[n], t);
}
var oo;
function At(e, t, n, a, s, r = null) {
  var i = e, o = /* @__PURE__ */ new Map(), l = (t & Cl) !== 0;
  if (l) {
    var c = (
      /** @type {Element} */
      e
    );
    i = c.appendChild(un());
  }
  var u = null, f = /* @__PURE__ */ ki(() => {
    var h = n();
    return mi(h) ? h : h == null ? [] : sr(h);
  }), p, v = !0;
  function y() {
    g.fallback = u, Ff(g, p, i, t, a), u !== null && (p.length === 0 ? (u.f & ln) === 0 ? yi(u) : (u.f ^= ln, $a(u, null, i)) : Hn(u, () => {
      u = null;
    }));
  }
  var b = Wa(() => {
    p = /** @type {V[]} */
    d(f);
    for (var h = p.length, x = /* @__PURE__ */ new Set(), m = (
      /** @type {Batch} */
      je
    ), C = Vl(), _ = 0; _ < h; _ += 1) {
      var A = p[_], E = a(A, _), S = v ? null : o.get(E);
      S ? (S.v && Aa(S.v, A), S.i && Aa(S.i, _), C && m.skipped_effects.delete(S.e)) : (S = If(
        o,
        v ? i : oo ??= un(),
        A,
        E,
        _,
        s,
        t,
        n
      ), v || (S.e.f |= ln), o.set(E, S)), x.add(E);
    }
    if (h === 0 && r && !u && (v ? u = ut(() => r(i)) : (u = ut(() => r(oo ??= un())), u.f |= ln)), !v)
      if (C) {
        for (const [w, L] of o)
          x.has(w) || m.skipped_effects.add(L.e);
        m.oncommit(y), m.ondiscard(() => {
        });
      } else
        y();
    d(f);
  }), g = { effect: b, items: o, outrogroups: null, fallback: u };
  v = !1;
}
function Ff(e, t, n, a, s) {
  var r = (a & Nd) !== 0, i = t.length, o = e.items, l = e.effect.first, c, u = null, f, p = [], v = [], y, b, g, h;
  if (r)
    for (h = 0; h < i; h += 1)
      y = t[h], b = s(y, h), g = /** @type {EachItem} */
      o.get(b).e, (g.f & ln) === 0 && (g.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(g));
  for (h = 0; h < i; h += 1) {
    if (y = t[h], b = s(y, h), g = /** @type {EachItem} */
    o.get(b).e, e.outrogroups !== null)
      for (const L of e.outrogroups)
        L.pending.delete(g), L.done.delete(g);
    if ((g.f & ln) !== 0)
      if (g.f ^= ln, g === l)
        $a(g, null, n);
      else {
        var x = u ? u.next : l;
        g === e.effect.last && (e.effect.last = g.prev), g.prev && (g.prev.next = g.next), g.next && (g.next.prev = g.prev), kn(e, u, g), kn(e, g, x), $a(g, x, n), u = g, p = [], v = [], l = u.next;
        continue;
      }
    if ((g.f & xt) !== 0 && (yi(g), r && (g.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(g))), g !== l) {
      if (c !== void 0 && c.has(g)) {
        if (p.length < v.length) {
          var m = v[0], C;
          u = m.prev;
          var _ = p[0], A = p[p.length - 1];
          for (C = 0; C < p.length; C += 1)
            $a(p[C], m, n);
          for (C = 0; C < v.length; C += 1)
            c.delete(v[C]);
          kn(e, _.prev, A.next), kn(e, u, _), kn(e, A, m), l = m, u = A, h -= 1, p = [], v = [];
        } else
          c.delete(g), $a(g, l, n), kn(e, g.prev, g.next), kn(e, g, u === null ? e.effect.first : u.next), kn(e, u, g), u = g;
        continue;
      }
      for (p = [], v = []; l !== null && l !== g; )
        (c ??= /* @__PURE__ */ new Set()).add(l), v.push(l), l = l.next;
      if (l === null)
        continue;
    }
    (g.f & ln) === 0 && p.push(g), u = g, l = g.next;
  }
  if (e.outrogroups !== null) {
    for (const L of e.outrogroups)
      L.pending.size === 0 && (Qr(sr(L.done)), e.outrogroups?.delete(L));
    e.outrogroups.size === 0 && (e.outrogroups = null);
  }
  if (l !== null || c !== void 0) {
    var E = [];
    if (c !== void 0)
      for (g of c)
        (g.f & xt) === 0 && E.push(g);
    for (; l !== null; )
      (l.f & xt) === 0 && l !== e.fallback && E.push(l), l = l.next;
    var S = E.length;
    if (S > 0) {
      var w = (a & Cl) !== 0 && i === 0 ? n : null;
      if (r) {
        for (h = 0; h < S; h += 1)
          E[h].nodes?.a?.measure();
        for (h = 0; h < S; h += 1)
          E[h].nodes?.a?.fix();
      }
      Df(e, E, w);
    }
  }
  r && On(() => {
    if (f !== void 0)
      for (g of f)
        g.nodes?.a?.apply();
  });
}
function If(e, t, n, a, s, r, i, o) {
  var l = (i & Ed) !== 0 ? (i & Rd) === 0 ? /* @__PURE__ */ jl(n, !1, !1) : Rn(n) : null, c = (i & Ld) !== 0 ? Rn(s) : null;
  return {
    v: l,
    i: c,
    e: ut(() => (r(t, l ?? n, c ?? s, o), () => {
      e.delete(a);
    }))
  };
}
function $a(e, t, n) {
  if (e.nodes)
    for (var a = e.nodes.start, s = e.nodes.end, r = t && (t.f & ln) === 0 ? (
      /** @type {EffectNodes} */
      t.nodes.start
    ) : n; a !== null; ) {
      var i = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ hs(a)
      );
      if (r.before(a), a === s)
        return;
      a = i;
    }
}
function kn(e, t, n) {
  t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function Un(e, t, ...n) {
  var a = new cr(e);
  Wa(() => {
    const s = t() ?? null;
    a.ensure(s, s && ((r) => s(r, ...n)));
  }, Kt);
}
function Zr(e, t, n) {
  var a = new cr(e);
  Wa(() => {
    var s = t() ?? null;
    a.ensure(s, s && ((r) => n(r, s)));
  }, Kt);
}
const Pf = () => performance.now(), on = {
  // don't access requestAnimationFrame eagerly outside method
  // this allows basic testing of user code without JSDOM
  // bunder will eval and remove ternary when the user's app is built
  tick: (
    /** @param {any} _ */
    (e) => requestAnimationFrame(e)
  ),
  now: () => Pf(),
  tasks: /* @__PURE__ */ new Set()
};
function dc() {
  const e = on.now();
  on.tasks.forEach((t) => {
    t.c(e) || (on.tasks.delete(t), t.f());
  }), on.tasks.size !== 0 && on.tick(dc);
}
function jf(e) {
  let t;
  return on.tasks.size === 0 && on.tick(dc), {
    promise: new Promise((n) => {
      on.tasks.add(t = { c: e, f: n });
    }),
    abort() {
      on.tasks.delete(t);
    }
  };
}
function Ts(e, t) {
  Pa(() => {
    e.dispatchEvent(new CustomEvent(t));
  });
}
function Wf(e) {
  if (e === "float") return "cssFloat";
  if (e === "offset") return "cssOffset";
  if (e.startsWith("--")) return e;
  const t = e.split("-");
  return t.length === 1 ? t[0] : t[0] + t.slice(1).map(
    /** @param {any} word */
    (n) => n[0].toUpperCase() + n.slice(1)
  ).join("");
}
function lo(e) {
  const t = {}, n = e.split(";");
  for (const a of n) {
    const [s, r] = a.split(":");
    if (!s || r === void 0) break;
    const i = Wf(s.trim());
    t[i] = r.trim();
  }
  return t;
}
const Bf = (e) => e;
function Us(e, t, n, a) {
  var s = (e & jd) !== 0, r = (e & Wd) !== 0, i = s && r, o = (e & Bd) !== 0, l = i ? "both" : s ? "in" : "out", c, u = t.inert, f = t.style.overflow, p, v;
  function y() {
    return Pa(() => c ??= n()(t, a?.() ?? /** @type {P} */
    {}, {
      direction: l
    }));
  }
  var b = {
    is_global: o,
    in() {
      if (t.inert = u, !s) {
        v?.abort(), v?.reset?.();
        return;
      }
      r || p?.abort(), Ts(t, "introstart"), p = Xr(t, y(), v, 1, () => {
        Ts(t, "introend"), p?.abort(), p = c = void 0, t.style.overflow = f;
      });
    },
    out(m) {
      if (!r) {
        m?.(), c = void 0;
        return;
      }
      t.inert = !0, Ts(t, "outrostart"), v = Xr(t, y(), p, 0, () => {
        Ts(t, "outroend"), m?.();
      });
    },
    stop: () => {
      p?.abort(), v?.abort();
    }
  }, g = (
    /** @type {Effect & { nodes: EffectNodes }} */
    xe
  );
  if ((g.nodes.t ??= []).push(b), s && Vs) {
    var h = o;
    if (!h) {
      for (var x = (
        /** @type {Effect | null} */
        g.parent
      ); x && (x.f & Kt) !== 0; )
        for (; (x = x.parent) && (x.f & Jt) === 0; )
          ;
      h = !x || (x.f & ir) !== 0;
    }
    h && ms(() => {
      $t(() => b.in());
    });
  }
}
function Xr(e, t, n, a, s) {
  var r = a === 1;
  if (vd(t)) {
    var i, o = !1;
    return On(() => {
      if (!o) {
        var g = t({ direction: r ? "in" : "out" });
        i = Xr(e, g, n, a, s);
      }
    }), {
      abort: () => {
        o = !0, i?.abort();
      },
      deactivate: () => i.deactivate(),
      reset: () => i.reset(),
      t: () => i.t()
    };
  }
  if (n?.deactivate(), !t?.duration)
    return s(), {
      abort: ft,
      deactivate: ft,
      reset: ft,
      t: () => a
    };
  const { delay: l = 0, css: c, tick: u, easing: f = Bf } = t;
  var p = [];
  if (r && n === void 0 && (u && u(0, 1), c)) {
    var v = lo(c(0, 1));
    p.push(v, v);
  }
  var y = () => 1 - a, b = e.animate(p, { duration: l, fill: "forwards" });
  return b.onfinish = () => {
    b.cancel();
    var g = n?.t() ?? 1 - a;
    n?.abort();
    var h = a - g, x = (
      /** @type {number} */
      t.duration * Math.abs(h)
    ), m = [];
    if (x > 0) {
      var C = !1;
      if (c)
        for (var _ = Math.ceil(x / 16.666666666666668), A = 0; A <= _; A += 1) {
          var E = g + h * f(A / _), S = lo(c(E, 1 - E));
          m.push(S), C ||= S.overflow === "hidden";
        }
      C && (e.style.overflow = "hidden"), y = () => {
        var w = (
          /** @type {number} */
          /** @type {globalThis.Animation} */
          b.currentTime
        );
        return g + h * f(w / x);
      }, u && jf(() => {
        if (b.playState !== "running") return !1;
        var w = y();
        return u(w, 1 - w), !0;
      });
    }
    b = e.animate(m, { duration: x, fill: "forwards" }), b.onfinish = () => {
      y = () => a, u?.(a, 1 - a), s();
    };
  }, {
    abort: () => {
      b && (b.cancel(), b.effect = null, b.onfinish = ft);
    },
    deactivate: () => {
      s = ft;
    },
    reset: () => {
      a === 0 && u?.(1, 0);
    },
    t: () => y()
  };
}
function fc(e, t, n, a, s, r) {
  var i = null, o = (
    /** @type {TemplateNode} */
    e
  ), l = new cr(o, !1);
  Wa(() => {
    const c = t() || null;
    var u = c === "svg" ? Ud : null;
    if (c === null) {
      l.ensure(null, null), As(!0);
      return;
    }
    return l.ensure(c, (f) => {
      if (c) {
        if (i = u ? document.createElementNS(u, c) : document.createElement(c), is(i, i), a) {
          var p = i.appendChild(un());
          a(i, p);
        }
        xe.nodes.end = i, f.before(i);
      }
    }), As(!0), () => {
      c && As(!1);
    };
  }, Kt), ja(() => {
    As(!0);
  });
}
function zf(e, t) {
  var n = void 0, a;
  Gl(() => {
    n !== (n = t()) && (a && (nt(a), a = null), n && (a = ut(() => {
      ms(() => (
        /** @type {(node: Element) => void} */
        n(e)
      ));
    })));
  });
}
function pc(e) {
  var t, n, a = "";
  if (typeof e == "string" || typeof e == "number") a += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var s = e.length;
    for (t = 0; t < s; t++) e[t] && (n = pc(e[t])) && (a && (a += " "), a += n);
  } else for (n in e) e[n] && (a && (a += " "), a += n);
  return a;
}
function vc() {
  for (var e, t, n = 0, a = "", s = arguments.length; n < s; n++) (e = arguments[n]) && (t = pc(e)) && (a && (a += " "), a += t);
  return a;
}
function qs(e) {
  return typeof e == "object" ? vc(e) : e ?? "";
}
const co = [...` 	
\r\f \v\uFEFF`];
function Hf(e, t, n) {
  var a = e == null ? "" : "" + e;
  if (t && (a = a ? a + " " + t : t), n) {
    for (var s in n)
      if (n[s])
        a = a ? a + " " + s : s;
      else if (a.length)
        for (var r = s.length, i = 0; (i = a.indexOf(s, i)) >= 0; ) {
          var o = i + r;
          (i === 0 || co.includes(a[i - 1])) && (o === a.length || co.includes(a[o])) ? a = (i === 0 ? "" : a.substring(0, i)) + a.substring(o + 1) : i = o;
        }
  }
  return a === "" ? null : a;
}
function uo(e, t = !1) {
  var n = t ? " !important;" : ";", a = "";
  for (var s in e) {
    var r = e[s];
    r != null && r !== "" && (a += " " + s + ": " + r + n);
  }
  return a;
}
function xr(e) {
  return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Vf(e, t) {
  if (t) {
    var n = "", a, s;
    if (Array.isArray(t) ? (a = t[0], s = t[1]) : a = t, e) {
      e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var r = !1, i = 0, o = !1, l = [];
      a && l.push(...Object.keys(a).map(xr)), s && l.push(...Object.keys(s).map(xr));
      var c = 0, u = -1;
      const b = e.length;
      for (var f = 0; f < b; f++) {
        var p = e[f];
        if (o ? p === "/" && e[f - 1] === "*" && (o = !1) : r ? r === p && (r = !1) : p === "/" && e[f + 1] === "*" ? o = !0 : p === '"' || p === "'" ? r = p : p === "(" ? i++ : p === ")" && i--, !o && r === !1 && i === 0) {
          if (p === ":" && u === -1)
            u = f;
          else if (p === ";" || f === b - 1) {
            if (u !== -1) {
              var v = xr(e.substring(c, u).trim());
              if (!l.includes(v)) {
                p !== ";" && f++;
                var y = e.substring(c, f).trim();
                n += " " + y + ";";
              }
            }
            c = f + 1, u = -1;
          }
        }
      }
    }
    return a && (n += uo(a)), s && (n += uo(s, !0)), n = n.trim(), n === "" ? null : n;
  }
  return e == null ? null : String(e);
}
function ie(e, t, n, a, s, r) {
  var i = e.__className;
  if (i !== n || i === void 0) {
    var o = Hf(n, a, r);
    o == null ? e.removeAttribute("class") : t ? e.className = o : e.setAttribute("class", o), e.__className = n;
  } else if (r && s !== r)
    for (var l in r) {
      var c = !!r[l];
      (s == null || c !== !!s[l]) && e.classList.toggle(l, c);
    }
  return r;
}
function Sr(e, t = {}, n, a) {
  for (var s in n) {
    var r = n[s];
    t[s] !== r && (n[s] == null ? e.style.removeProperty(s) : e.style.setProperty(s, r, a));
  }
}
function rt(e, t, n, a) {
  var s = e.__style;
  if (s !== t) {
    var r = Vf(t, a);
    r == null ? e.removeAttribute("style") : e.style.cssText = r, e.__style = t;
  } else a && (Array.isArray(a) ? (Sr(e, n?.[0], a[0]), Sr(e, n?.[1], a[1], "important")) : Sr(e, n, a));
  return a;
}
function Jr(e, t, n = !1) {
  if (e.multiple) {
    if (t == null)
      return;
    if (!mi(t))
      return Gd();
    for (var a of e.options)
      a.selected = t.includes(fo(a));
    return;
  }
  for (a of e.options) {
    var s = fo(a);
    if (uf(s, t)) {
      a.selected = !0;
      return;
    }
  }
  (!n || t !== void 0) && (e.selectedIndex = -1);
}
function Uf(e) {
  var t = new MutationObserver(() => {
    Jr(e, e.__value);
  });
  t.observe(e, {
    // Listen to option element changes
    childList: !0,
    subtree: !0,
    // because of <optgroup>
    // Listen to option element value attribute changes
    // (doesn't get notified of select value changes,
    // because that property is not reflected as an attribute)
    attributes: !0,
    attributeFilter: ["value"]
  }), ja(() => {
    t.disconnect();
  });
}
function fo(e) {
  return "__value" in e ? e.__value : e.value;
}
const Cn = Symbol("class"), ua = Symbol("style"), hc = Symbol("is custom element"), mc = Symbol("is html");
function qf(e, t) {
  t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function $(e, t, n, a) {
  var s = gc(e);
  s[t] !== (s[t] = n) && (t === "loading" && (e[bd] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && bc(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function Gf(e, t, n, a, s = !1, r = !1) {
  var i = gc(e), o = i[hc], l = !i[mc], c = t || {}, u = e.tagName === "OPTION";
  for (var f in t)
    f in n || (n[f] = null);
  n.class ? n.class = qs(n.class) : (a || n[Cn]) && (n.class = null), n[ua] && (n.style ??= null);
  var p = bc(e);
  for (const m in n) {
    let C = n[m];
    if (u && m === "value" && C == null) {
      e.value = e.__value = "", c[m] = C;
      continue;
    }
    if (m === "class") {
      var v = e.namespaceURI === "http://www.w3.org/1999/xhtml";
      ie(e, v, C, a, t?.[Cn], n[Cn]), c[m] = C, c[Cn] = n[Cn];
      continue;
    }
    if (m === "style") {
      rt(e, C, t?.[ua], n[ua]), c[m] = C, c[ua] = n[ua];
      continue;
    }
    var y = c[m];
    if (!(C === y && !(C === void 0 && e.hasAttribute(m)))) {
      c[m] = C;
      var b = m[0] + m[1];
      if (b !== "$$")
        if (b === "on") {
          const _ = {}, A = "$$" + m;
          let E = m.slice(2);
          var g = Af(E);
          if (Sf(E) && (E = E.slice(0, -7), _.capture = !0), !g && y) {
            if (C != null) continue;
            e.removeEventListener(E, c[A], _), c[A] = null;
          }
          if (C != null)
            if (g)
              e[`__${E}`] = C, Ba([E]);
            else {
              let S = function(w) {
                c[m].call(this, w);
              };
              c[A] = lc(E, e, S, _);
            }
          else g && (e[`__${E}`] = void 0);
        } else if (m === "style")
          $(e, m, C);
        else if (m === "autofocus")
          pf(
            /** @type {HTMLElement} */
            e,
            !!C
          );
        else if (!o && (m === "__value" || m === "value" && C != null))
          e.value = e.__value = C;
        else if (m === "selected" && u)
          qf(
            /** @type {HTMLOptionElement} */
            e,
            C
          );
        else {
          var h = m;
          l || (h = Mf(h));
          var x = h === "defaultValue" || h === "defaultChecked";
          if (C == null && !o && !x)
            if (i[m] = null, h === "value" || h === "checked") {
              let _ = (
                /** @type {HTMLInputElement} */
                e
              );
              const A = t === void 0;
              if (h === "value") {
                let E = _.defaultValue;
                _.removeAttribute(h), _.defaultValue = E, _.value = _.__value = A ? E : null;
              } else {
                let E = _.defaultChecked;
                _.removeAttribute(h), _.defaultChecked = E, _.checked = A ? E : !1;
              }
            } else
              e.removeAttribute(m);
          else x || p.includes(h) && (o || typeof C != "string") ? (e[h] = C, h in i && (i[h] = et)) : typeof C != "function" && $(e, h, C);
        }
    }
  }
  return c;
}
function Ye(e, t, n = [], a = [], s = [], r, i = !1, o = !1) {
  Dl(s, n, a, (l) => {
    var c = void 0, u = {}, f = e.nodeName === "SELECT", p = !1;
    if (Gl(() => {
      var y = t(...l.map(d)), b = Gf(
        e,
        c,
        y,
        r,
        i,
        o
      );
      p && f && "value" in y && Jr(
        /** @type {HTMLSelectElement} */
        e,
        y.value
      );
      for (let h of Object.getOwnPropertySymbols(u))
        y[h] || nt(u[h]);
      for (let h of Object.getOwnPropertySymbols(y)) {
        var g = y[h];
        h.description === qd && (!c || g !== c[h]) && (u[h] && nt(u[h]), u[h] = ut(() => zf(e, () => g))), b[h] = g;
      }
      c = b;
    }), f) {
      var v = (
        /** @type {HTMLSelectElement} */
        e
      );
      ms(() => {
        Jr(
          v,
          /** @type {Record<string | symbol, any>} */
          c.value,
          !0
        ), Uf(v);
      });
    }
    p = !0;
  });
}
function gc(e) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    // @ts-expect-error
    e.__attributes ??= {
      [hc]: e.nodeName.includes("-"),
      [mc]: e.namespaceURI === Vd
    }
  );
}
var po = /* @__PURE__ */ new Map();
function bc(e) {
  var t = e.getAttribute("is") || e.nodeName, n = po.get(t);
  if (n) return n;
  po.set(t, n = []);
  for (var a, s = e, r = Element.prototype; r !== s; ) {
    a = dd(s);
    for (var i in a)
      a[i].set && n.push(i);
    s = kl(s);
  }
  return n;
}
class Si {
  /** */
  #e = /* @__PURE__ */ new WeakMap();
  /** @type {ResizeObserver | undefined} */
  #t;
  /** @type {ResizeObserverOptions} */
  #n;
  /** @static */
  static entries = /* @__PURE__ */ new WeakMap();
  /** @param {ResizeObserverOptions} options */
  constructor(t) {
    this.#n = t;
  }
  /**
   * @param {Element} element
   * @param {(entry: ResizeObserverEntry) => any} listener
   */
  observe(t, n) {
    var a = this.#e.get(t) || /* @__PURE__ */ new Set();
    return a.add(n), this.#e.set(t, a), this.#a().observe(t, this.#n), () => {
      var s = this.#e.get(t);
      s.delete(n), s.size === 0 && (this.#e.delete(t), this.#t.unobserve(t));
    };
  }
  #a() {
    return this.#t ?? (this.#t = new ResizeObserver(
      /** @param {any} entries */
      (t) => {
        for (var n of t) {
          Si.entries.set(n.target, n);
          for (var a of this.#e.get(n.target) || [])
            a(n);
        }
      }
    ));
  }
}
var Kf = /* @__PURE__ */ new Si({
  box: "border-box"
});
function Yf(e, t, n) {
  var a = Kf.observe(e, () => n(e[t]));
  ms(() => ($t(() => n(e[t])), a));
}
function vo(e, t) {
  return e === t || e?.[zn] === t;
}
function An(e = {}, t, n, a) {
  return ms(() => {
    var s, r;
    return ql(() => {
      s = r, r = [], $t(() => {
        e !== n(...r) && (t(e, ...r), s && vo(n(...s), e) && t(null, ...s));
      });
    }), () => {
      On(() => {
        r && vo(n(...r), e) && t(null, ...r);
      });
    };
  }), e;
}
function ho(e, t) {
  vf(window, ["resize"], () => Pa(() => t(window[e])));
}
function wc(e, t, n) {
  if (e == null)
    return t(void 0), ft;
  const a = $t(
    () => e.subscribe(
      t,
      // @ts-expect-error
      n
    )
  );
  return a.unsubscribe ? () => a.unsubscribe() : a;
}
const aa = [];
function $f(e, t) {
  return {
    subscribe: Qf(e, t).subscribe
  };
}
function Qf(e, t = ft) {
  let n = null;
  const a = /* @__PURE__ */ new Set();
  function s(o) {
    if (Tl(e, o) && (e = o, n)) {
      const l = !aa.length;
      for (const c of a)
        c[1](), aa.push(c, e);
      if (l) {
        for (let c = 0; c < aa.length; c += 2)
          aa[c][0](aa[c + 1]);
        aa.length = 0;
      }
    }
  }
  function r(o) {
    s(o(
      /** @type {T} */
      e
    ));
  }
  function i(o, l = ft) {
    const c = [o, l];
    return a.add(c), a.size === 1 && (n = t(s, r) || ft), o(
      /** @type {T} */
      e
    ), () => {
      a.delete(c), a.size === 0 && n && (n(), n = null);
    };
  }
  return { set: s, update: r, subscribe: i };
}
function Zf(e) {
  let t;
  return wc(e, (n) => t = n)(), t;
}
let Ms = !1, ei = Symbol();
function Xf(e, t, n) {
  const a = n[t] ??= {
    store: null,
    source: /* @__PURE__ */ jl(void 0),
    unsubscribe: ft
  };
  if (a.store !== e && !(ei in n))
    if (a.unsubscribe(), a.store = e ?? null, e == null)
      a.source.v = void 0, a.unsubscribe = ft;
    else {
      var s = !0;
      a.unsubscribe = wc(e, (r) => {
        s ? a.source.v = r : me(a.source, r);
      }), s = !1;
    }
  return e && ei in n ? Zf(e) : d(a.source);
}
function Jf() {
  const e = {};
  function t() {
    ja(() => {
      for (var n in e)
        e[n].unsubscribe();
      wl(e, ei, {
        enumerable: !1,
        value: !0
      });
    });
  }
  return [e, t];
}
function ep(e) {
  var t = Ms;
  try {
    return Ms = !1, [e(), Ms];
  } finally {
    Ms = t;
  }
}
const tp = {
  get(e, t) {
    if (!e.exclude.includes(t))
      return e.props[t];
  },
  set(e, t) {
    return !1;
  },
  getOwnPropertyDescriptor(e, t) {
    if (!e.exclude.includes(t) && t in e.props)
      return {
        enumerable: !0,
        configurable: !0,
        value: e.props[t]
      };
  },
  has(e, t) {
    return e.exclude.includes(t) ? !1 : t in e.props;
  },
  ownKeys(e) {
    return Reflect.ownKeys(e.props).filter((t) => !e.exclude.includes(t));
  }
};
// @__NO_SIDE_EFFECTS__
function ht(e, t, n) {
  return new Proxy(
    { props: e, exclude: t },
    tp
  );
}
function q(e, t, n, a) {
  var s = !Ia || (n & Dd) !== 0, r = (n & Id) !== 0, i = (n & Pd) !== 0, o = (
    /** @type {V} */
    a
  ), l = !0, c = () => (l && (l = !1, o = i ? $t(
    /** @type {() => V} */
    a
  ) : (
    /** @type {V} */
    a
  )), o), u;
  if (r) {
    var f = zn in e || gd in e;
    u = ga(e, t)?.set ?? (f && t in e ? (m) => e[t] = m : void 0);
  }
  var p, v = !1;
  r ? [p, v] = ep(() => (
    /** @type {V} */
    e[t]
  )) : p = /** @type {V} */
  e[t], p === void 0 && a !== void 0 && (p = c(), u && (s && Sd(), u(p)));
  var y;
  if (s ? y = () => {
    var m = (
      /** @type {V} */
      e[t]
    );
    return m === void 0 ? c() : (l = !0, m);
  } : y = () => {
    var m = (
      /** @type {V} */
      e[t]
    );
    return m !== void 0 && (o = /** @type {V} */
    void 0), m === void 0 ? o : m;
  }, s && (n & Fd) === 0)
    return y;
  if (u) {
    var b = e.$$legacy;
    return (
      /** @type {() => V} */
      (function(m, C) {
        return arguments.length > 0 ? ((!s || !C || b || v) && u(C ? y() : m), m) : y();
      })
    );
  }
  var g = !1, h = ((n & Od) !== 0 ? lr : ki)(() => (g = !1, y()));
  r && d(h);
  var x = (
    /** @type {Effect} */
    xe
  );
  return (
    /** @type {() => V} */
    (function(m, C) {
      if (arguments.length > 0) {
        const _ = C ? d(h) : s && r ? Pt(m) : m;
        return me(h, _), g = !0, o !== void 0 && (o = _), m;
      }
      return Jn && g || (x.f & cn) !== 0 ? h.v : d(h);
    })
  );
}
function np(e) {
  We === null && Sl(), Ia && We.l !== null ? ap(We).m.push(e) : Ln(() => {
    const t = $t(e);
    if (typeof t == "function") return (
      /** @type {() => void} */
      t
    );
  });
}
function ap(e) {
  var t = (
    /** @type {ComponentContextLegacy} */
    e.l
  );
  return t.u ??= { a: [], b: [], m: [] };
}
const sp = "5";
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add(sp);
var rp = /* @__PURE__ */ W("<div><!></div>");
function ip(e, t) {
  let n = q(t, "class", 3, "");
  var a = rp(), s = N(a);
  Un(s, () => t.children), P(() => ie(a, 1, `lc ${n() ?? ""}`, "svelte-ilxib0")), M(e, a);
}
var op = /* @__PURE__ */ W('<span><span class="block h-2 w-2 rounded-full border border-dashed border-line-strong"></span></span>');
function lp(e, t) {
  let n = q(t, "class", 3, ""), a = q(t, "title", 3, void 0);
  var s = op();
  P(() => {
    ie(s, 1, `inline-flex shrink-0 items-center justify-center ${n() ?? ""}`), $(s, "role", a() ? "img" : void 0), $(s, "aria-hidden", a() ? void 0 : "true"), $(s, "aria-label", a());
  }), M(e, s);
}
const cp = /^(?:(.*):)?(w|h|size|m[trblxyse]?|p[trblxyse]?|gap)-/;
function up(...e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.filter(Boolean).join(" ").split(/\s+/).filter(Boolean)) {
    const a = cp.exec(n);
    t.set(a ? `${a[1] ?? ""}:${a[2]}` : n, n);
  }
  return [...t.values()].join(" ");
}
function Tt(...e) {
  return up(vc(e));
}
var dp = /* @__PURE__ */ ue("<title> </title>"), fp = /* @__PURE__ */ ue("<desc> </desc>"), pp = /* @__PURE__ */ ue('<svg><!><!><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"></path></svg>');
function ur(e, t) {
  Se(t, !0);
  const n = vt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = q(t, "size", 19, () => n.size || "md"), r = q(t, "color", 19, () => n.color || "currentColor"), i = /* @__PURE__ */ ht(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "size",
    "color",
    "title",
    "desc",
    "class",
    "ariaLabel"
  ]), o = `${t.title?.id || ""} ${t.desc?.id || ""}`.trim();
  const l = !!(t.title?.id || t.desc?.id), c = !!t.ariaLabel || l;
  var u = pp();
  Ye(
    u,
    (b) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: r(),
      ...i,
      class: b,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": l ? o : void 0,
      "aria-hidden": !c
    }),
    [() => Tt("shrink-0", a[s()], t.class)]
  );
  var f = N(u);
  {
    var p = (b) => {
      var g = dp(), h = N(g);
      P(() => {
        $(g, "id", t.title.id), K(h, t.title.title);
      }), M(b, g);
    };
    O(f, (b) => {
      t.title?.id && t.title.title && b(p);
    });
  }
  var v = I(f);
  {
    var y = (b) => {
      var g = fp(), h = N(g);
      P(() => {
        $(g, "id", t.desc.id), K(h, t.desc.desc);
      }), M(b, g);
    };
    O(v, (b) => {
      t.desc?.id && t.desc.desc && b(y);
    });
  }
  M(e, u), Ce();
}
var vp = /* @__PURE__ */ ue("<title> </title>"), hp = /* @__PURE__ */ ue("<desc> </desc>"), mp = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m7 16 4-4-4-4m6 8 4-4-4-4"></path></svg>');
function gp(e, t) {
  Se(t, !0);
  const n = vt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = q(t, "size", 19, () => n.size || "md"), r = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ ht(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "size",
    "color",
    "title",
    "strokeWidth",
    "desc",
    "class",
    "ariaLabel"
  ]), l = `${t.title?.id || ""} ${t.desc?.id || ""}`.trim();
  const c = !!(t.title?.id || t.desc?.id), u = !!t.ariaLabel || c;
  var f = mp();
  Ye(
    f,
    (h) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: r(),
      ...o,
      class: h,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Tt("shrink-0", a[s()], t.class)]
  );
  var p = N(f);
  {
    var v = (h) => {
      var x = vp(), m = N(x);
      P(() => {
        $(x, "id", t.title.id), K(m, t.title.title);
      }), M(h, x);
    };
    O(p, (h) => {
      t.title?.id && t.title.title && h(v);
    });
  }
  var y = I(p);
  {
    var b = (h) => {
      var x = hp(), m = N(x);
      P(() => {
        $(x, "id", t.desc.id), K(m, t.desc.desc);
      }), M(h, x);
    };
    O(y, (h) => {
      t.desc?.id && t.desc.desc && h(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var bp = /* @__PURE__ */ ue("<title> </title>"), wp = /* @__PURE__ */ ue("<desc> </desc>"), kp = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m8 10 4 4 4-4"></path></svg>');
function _p(e, t) {
  Se(t, !0);
  const n = vt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = q(t, "size", 19, () => n.size || "md"), r = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ ht(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "size",
    "color",
    "title",
    "strokeWidth",
    "desc",
    "class",
    "ariaLabel"
  ]), l = `${t.title?.id || ""} ${t.desc?.id || ""}`.trim();
  const c = !!(t.title?.id || t.desc?.id), u = !!t.ariaLabel || c;
  var f = kp();
  Ye(
    f,
    (h) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: r(),
      ...o,
      class: h,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Tt("shrink-0", a[s()], t.class)]
  );
  var p = N(f);
  {
    var v = (h) => {
      var x = bp(), m = N(x);
      P(() => {
        $(x, "id", t.title.id), K(m, t.title.title);
      }), M(h, x);
    };
    O(p, (h) => {
      t.title?.id && t.title.title && h(v);
    });
  }
  var y = I(p);
  {
    var b = (h) => {
      var x = wp(), m = N(x);
      P(() => {
        $(x, "id", t.desc.id), K(m, t.desc.desc);
      }), M(h, x);
    };
    O(y, (h) => {
      t.desc?.id && t.desc.desc && h(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var yp = /* @__PURE__ */ ue("<title> </title>"), xp = /* @__PURE__ */ ue("<desc> </desc>"), Sp = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>');
function Cp(e, t) {
  Se(t, !0);
  const n = vt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = q(t, "size", 19, () => n.size || "md"), r = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ ht(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "size",
    "color",
    "title",
    "strokeWidth",
    "desc",
    "class",
    "ariaLabel"
  ]), l = `${t.title?.id || ""} ${t.desc?.id || ""}`.trim();
  const c = !!(t.title?.id || t.desc?.id), u = !!t.ariaLabel || c;
  var f = Sp();
  Ye(
    f,
    (h) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: r(),
      ...o,
      class: h,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Tt("shrink-0", a[s()], t.class)]
  );
  var p = N(f);
  {
    var v = (h) => {
      var x = yp(), m = N(x);
      P(() => {
        $(x, "id", t.title.id), K(m, t.title.title);
      }), M(h, x);
    };
    O(p, (h) => {
      t.title?.id && t.title.title && h(v);
    });
  }
  var y = I(p);
  {
    var b = (h) => {
      var x = xp(), m = N(x);
      P(() => {
        $(x, "id", t.desc.id), K(m, t.desc.desc);
      }), M(h, x);
    };
    O(y, (h) => {
      t.desc?.id && t.desc.desc && h(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var Ap = /* @__PURE__ */ ue("<title> </title>"), Tp = /* @__PURE__ */ ue("<desc> </desc>"), Mp = /* @__PURE__ */ ue('<svg><!><!><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd"></path></svg>');
function kc(e, t) {
  Se(t, !0);
  const n = vt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = q(t, "size", 19, () => n.size || "md"), r = q(t, "color", 19, () => n.color || "currentColor"), i = /* @__PURE__ */ ht(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "size",
    "color",
    "title",
    "desc",
    "class",
    "ariaLabel"
  ]), o = `${t.title?.id || ""} ${t.desc?.id || ""}`.trim();
  const l = !!(t.title?.id || t.desc?.id), c = !!t.ariaLabel || l;
  var u = Mp();
  Ye(
    u,
    (b) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: r(),
      ...i,
      class: b,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": l ? o : void 0,
      "aria-hidden": !c
    }),
    [() => Tt("shrink-0", a[s()], t.class)]
  );
  var f = N(u);
  {
    var p = (b) => {
      var g = Ap(), h = N(g);
      P(() => {
        $(g, "id", t.title.id), K(h, t.title.title);
      }), M(b, g);
    };
    O(f, (b) => {
      t.title?.id && t.title.title && b(p);
    });
  }
  var v = I(f);
  {
    var y = (b) => {
      var g = Tp(), h = N(g);
      P(() => {
        $(g, "id", t.desc.id), K(h, t.desc.desc);
      }), M(b, g);
    };
    O(v, (b) => {
      t.desc?.id && t.desc.desc && b(y);
    });
  }
  M(e, u), Ce();
}
var Ep = /* @__PURE__ */ ue("<title> </title>"), Lp = /* @__PURE__ */ ue("<desc> </desc>"), Np = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M6 18 17.94 6M18 18 6.06 6"></path></svg>');
function Rp(e, t) {
  Se(t, !0);
  const n = vt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = q(t, "size", 19, () => n.size || "md"), r = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ ht(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "size",
    "color",
    "title",
    "strokeWidth",
    "desc",
    "class",
    "ariaLabel"
  ]), l = `${t.title?.id || ""} ${t.desc?.id || ""}`.trim();
  const c = !!(t.title?.id || t.desc?.id), u = !!t.ariaLabel || c;
  var f = Np();
  Ye(
    f,
    (h) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: r(),
      ...o,
      class: h,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Tt("shrink-0", a[s()], t.class)]
  );
  var p = N(f);
  {
    var v = (h) => {
      var x = Ep(), m = N(x);
      P(() => {
        $(x, "id", t.title.id), K(m, t.title.title);
      }), M(h, x);
    };
    O(p, (h) => {
      t.title?.id && t.title.title && h(v);
    });
  }
  var y = I(p);
  {
    var b = (h) => {
      var x = Lp(), m = N(x);
      P(() => {
        $(x, "id", t.desc.id), K(m, t.desc.desc);
      }), M(h, x);
    };
    O(y, (h) => {
      t.desc?.id && t.desc.desc && h(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var Op = /* @__PURE__ */ ue("<title> </title>"), Dp = /* @__PURE__ */ ue("<desc> </desc>"), Fp = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M8 8v8m0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0a4 4 0 0 1-4 4h-1a3 3 0 0 0-3 3"></path></svg>');
function Ip(e, t) {
  Se(t, !0);
  const n = vt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = q(t, "size", 19, () => n.size || "md"), r = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ ht(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "size",
    "color",
    "title",
    "strokeWidth",
    "desc",
    "class",
    "ariaLabel"
  ]), l = `${t.title?.id || ""} ${t.desc?.id || ""}`.trim();
  const c = !!(t.title?.id || t.desc?.id), u = !!t.ariaLabel || c;
  var f = Fp();
  Ye(
    f,
    (h) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: r(),
      ...o,
      class: h,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Tt("shrink-0", a[s()], t.class)]
  );
  var p = N(f);
  {
    var v = (h) => {
      var x = Op(), m = N(x);
      P(() => {
        $(x, "id", t.title.id), K(m, t.title.title);
      }), M(h, x);
    };
    O(p, (h) => {
      t.title?.id && t.title.title && h(v);
    });
  }
  var y = I(p);
  {
    var b = (h) => {
      var x = Dp(), m = N(x);
      P(() => {
        $(x, "id", t.desc.id), K(m, t.desc.desc);
      }), M(h, x);
    };
    O(y, (h) => {
      t.desc?.id && t.desc.desc && h(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var Pp = /* @__PURE__ */ ue("<title> </title>"), jp = /* @__PURE__ */ ue("<desc> </desc>"), Wp = /* @__PURE__ */ ue('<svg><!><!><path fill-rule="evenodd" d="M3 6a3 3 0 1 1 4 2.83v6.34a3.001 3.001 0 1 1-2 0V8.83A3.001 3.001 0 0 1 3 6Zm11.207-2.707a1 1 0 0 1 0 1.414L13.914 5H15a4 4 0 0 1 4 4v6.17a3.001 3.001 0 1 1-2 0V9a2 2 0 0 0-2-2h-1.086l.293.293a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414l2-2a1 1 0 0 1 1.414 0Z" clip-rule="evenodd"></path></svg>');
function Bp(e, t) {
  Se(t, !0);
  const n = vt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = q(t, "size", 19, () => n.size || "md"), r = q(t, "color", 19, () => n.color || "currentColor"), i = /* @__PURE__ */ ht(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "size",
    "color",
    "title",
    "desc",
    "class",
    "ariaLabel"
  ]), o = `${t.title?.id || ""} ${t.desc?.id || ""}`.trim();
  const l = !!(t.title?.id || t.desc?.id), c = !!t.ariaLabel || l;
  var u = Wp();
  Ye(
    u,
    (b) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: r(),
      ...i,
      class: b,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": l ? o : void 0,
      "aria-hidden": !c
    }),
    [() => Tt("shrink-0", a[s()], t.class)]
  );
  var f = N(u);
  {
    var p = (b) => {
      var g = Pp(), h = N(g);
      P(() => {
        $(g, "id", t.title.id), K(h, t.title.title);
      }), M(b, g);
    };
    O(f, (b) => {
      t.title?.id && t.title.title && b(p);
    });
  }
  var v = I(f);
  {
    var y = (b) => {
      var g = jp(), h = N(g);
      P(() => {
        $(g, "id", t.desc.id), K(h, t.desc.desc);
      }), M(b, g);
    };
    O(v, (b) => {
      t.desc?.id && t.desc.desc && b(y);
    });
  }
  M(e, u), Ce();
}
var zp = /* @__PURE__ */ ue("<title> </title>"), Hp = /* @__PURE__ */ ue("<desc> </desc>"), Vp = /* @__PURE__ */ ue('<svg><!><!><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0V8Zm-1 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z" clip-rule="evenodd"></path></svg>');
function za(e, t) {
  Se(t, !0);
  const n = vt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = q(t, "size", 19, () => n.size || "md"), r = q(t, "color", 19, () => n.color || "currentColor"), i = /* @__PURE__ */ ht(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "size",
    "color",
    "title",
    "desc",
    "class",
    "ariaLabel"
  ]), o = `${t.title?.id || ""} ${t.desc?.id || ""}`.trim();
  const l = !!(t.title?.id || t.desc?.id), c = !!t.ariaLabel || l;
  var u = Vp();
  Ye(
    u,
    (b) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: r(),
      ...i,
      class: b,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": l ? o : void 0,
      "aria-hidden": !c
    }),
    [() => Tt("shrink-0", a[s()], t.class)]
  );
  var f = N(u);
  {
    var p = (b) => {
      var g = zp(), h = N(g);
      P(() => {
        $(g, "id", t.title.id), K(h, t.title.title);
      }), M(b, g);
    };
    O(f, (b) => {
      t.title?.id && t.title.title && b(p);
    });
  }
  var v = I(f);
  {
    var y = (b) => {
      var g = Hp(), h = N(g);
      P(() => {
        $(g, "id", t.desc.id), K(h, t.desc.desc);
      }), M(b, g);
    };
    O(v, (b) => {
      t.desc?.id && t.desc.desc && b(y);
    });
  }
  M(e, u), Ce();
}
var Up = /* @__PURE__ */ ue("<title> </title>"), qp = /* @__PURE__ */ ue("<desc> </desc>"), Gp = /* @__PURE__ */ ue('<svg><!><!><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd"></path></svg>');
function Kp(e, t) {
  Se(t, !0);
  const n = vt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = q(t, "size", 19, () => n.size || "md"), r = q(t, "color", 19, () => n.color || "currentColor"), i = /* @__PURE__ */ ht(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "size",
    "color",
    "title",
    "desc",
    "class",
    "ariaLabel"
  ]), o = `${t.title?.id || ""} ${t.desc?.id || ""}`.trim();
  const l = !!(t.title?.id || t.desc?.id), c = !!t.ariaLabel || l;
  var u = Gp();
  Ye(
    u,
    (b) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: r(),
      ...i,
      class: b,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": l ? o : void 0,
      "aria-hidden": !c
    }),
    [() => Tt("shrink-0", a[s()], t.class)]
  );
  var f = N(u);
  {
    var p = (b) => {
      var g = Up(), h = N(g);
      P(() => {
        $(g, "id", t.title.id), K(h, t.title.title);
      }), M(b, g);
    };
    O(f, (b) => {
      t.title?.id && t.title.title && b(p);
    });
  }
  var v = I(f);
  {
    var y = (b) => {
      var g = qp(), h = N(g);
      P(() => {
        $(g, "id", t.desc.id), K(h, t.desc.desc);
      }), M(b, g);
    };
    O(v, (b) => {
      t.desc?.id && t.desc.desc && b(y);
    });
  }
  M(e, u), Ce();
}
var Yp = /* @__PURE__ */ ue("<title> </title>"), $p = /* @__PURE__ */ ue("<desc> </desc>"), Qp = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z"></path></svg>');
function Zp(e, t) {
  Se(t, !0);
  const n = vt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = q(t, "size", 19, () => n.size || "md"), r = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ ht(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "size",
    "color",
    "title",
    "strokeWidth",
    "desc",
    "class",
    "ariaLabel"
  ]), l = `${t.title?.id || ""} ${t.desc?.id || ""}`.trim();
  const c = !!(t.title?.id || t.desc?.id), u = !!t.ariaLabel || c;
  var f = Qp();
  Ye(
    f,
    (h) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: r(),
      ...o,
      class: h,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Tt("shrink-0", a[s()], t.class)]
  );
  var p = N(f);
  {
    var v = (h) => {
      var x = Yp(), m = N(x);
      P(() => {
        $(x, "id", t.title.id), K(m, t.title.title);
      }), M(h, x);
    };
    O(p, (h) => {
      t.title?.id && t.title.title && h(v);
    });
  }
  var y = I(p);
  {
    var b = (h) => {
      var x = $p(), m = N(x);
      P(() => {
        $(x, "id", t.desc.id), K(m, t.desc.desc);
      }), M(h, x);
    };
    O(y, (h) => {
      t.desc?.id && t.desc.desc && h(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var Xp = /* @__PURE__ */ ue("<title> </title>"), Jp = /* @__PURE__ */ ue("<desc> </desc>"), ev = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"></path></svg>');
function tv(e, t) {
  Se(t, !0);
  const n = vt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = q(t, "size", 19, () => n.size || "md"), r = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ ht(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "size",
    "color",
    "title",
    "strokeWidth",
    "desc",
    "class",
    "ariaLabel"
  ]), l = `${t.title?.id || ""} ${t.desc?.id || ""}`.trim();
  const c = !!(t.title?.id || t.desc?.id), u = !!t.ariaLabel || c;
  var f = ev();
  Ye(
    f,
    (h) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: r(),
      ...o,
      class: h,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Tt("shrink-0", a[s()], t.class)]
  );
  var p = N(f);
  {
    var v = (h) => {
      var x = Xp(), m = N(x);
      P(() => {
        $(x, "id", t.title.id), K(m, t.title.title);
      }), M(h, x);
    };
    O(p, (h) => {
      t.title?.id && t.title.title && h(v);
    });
  }
  var y = I(p);
  {
    var b = (h) => {
      var x = Jp(), m = N(x);
      P(() => {
        $(x, "id", t.desc.id), K(m, t.desc.desc);
      }), M(h, x);
    };
    O(y, (h) => {
      t.desc?.id && t.desc.desc && h(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var nv = /* @__PURE__ */ ue("<title> </title>"), av = /* @__PURE__ */ ue("<desc> </desc>"), sv = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path></svg>');
function _c(e, t) {
  Se(t, !0);
  const n = vt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = q(t, "size", 19, () => n.size || "md"), r = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ ht(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "size",
    "color",
    "title",
    "strokeWidth",
    "desc",
    "class",
    "ariaLabel"
  ]), l = `${t.title?.id || ""} ${t.desc?.id || ""}`.trim();
  const c = !!(t.title?.id || t.desc?.id), u = !!t.ariaLabel || c;
  var f = sv();
  Ye(
    f,
    (h) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: r(),
      ...o,
      class: h,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Tt("shrink-0", a[s()], t.class)]
  );
  var p = N(f);
  {
    var v = (h) => {
      var x = nv(), m = N(x);
      P(() => {
        $(x, "id", t.title.id), K(m, t.title.title);
      }), M(h, x);
    };
    O(p, (h) => {
      t.title?.id && t.title.title && h(v);
    });
  }
  var y = I(p);
  {
    var b = (h) => {
      var x = av(), m = N(x);
      P(() => {
        $(x, "id", t.desc.id), K(m, t.desc.desc);
      }), M(h, x);
    };
    O(y, (h) => {
      t.desc?.id && t.desc.desc && h(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var rv = /* @__PURE__ */ W("<span><!></span>"), iv = /* @__PURE__ */ ue('<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7.5" class="sm-pm-disc svelte-1cj69fi"></circle><path class="sm-pm-pie svelte-1cj69fi"></path></svg>'), ov = /* @__PURE__ */ ue('<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M9 5.5v13M15 5.5v13"></path></svg>'), lv = /* @__PURE__ */ ue('<path d="M12 6v7M12 18h.01"></path>'), cv = /* @__PURE__ */ ue('<path d="M12 4a8 8 0 1 1-8 8"></path>'), uv = /* @__PURE__ */ ue('<path d="M12 7v5l3 2"></path>'), dv = /* @__PURE__ */ ue('<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><!></svg>'), fv = /* @__PURE__ */ W("<span><!></span>"), pv = /* @__PURE__ */ W('<span class="h-2 w-2 rounded-full ring-[1.5px] ring-inset ring-fg-subtle"></span>'), vv = /* @__PURE__ */ W('<span class="h-1.5 w-1.5 rounded-full bg-success-solid"></span>'), hv = /* @__PURE__ */ W('<span class="sr-only"> </span>'), mv = /* @__PURE__ */ W('<span class="relative inline-flex h-4 w-4 shrink-0 items-center justify-center"><!> <!></span>');
function ba(e, t) {
  let n = q(t, "label", 3, void 0), a = q(t, "resolved", 3, !1), s = q(t, "tone", 3, void 0), r = q(t, "progress", 3, null);
  const i = {
    // Failed is the ONE solid disc (palette AD r3): the tint read as a pale
    // pink 10px mark in light, the faintest red on screen for the loudest
    // state. White "!" on danger-solid: 4.33:1 light, 3.40:1 dark (≥3:1 for
    // a graphic); the disc against its ground 4.16 / 4.87.
    failed: "bg-danger-solid ring-danger-solid text-white",
    stuck: "bg-warning-tint ring-warning-line text-warning",
    held: "bg-held-tint ring-held-line text-held",
    deploying: "bg-active-tint ring-active-line text-active",
    // Checking: the line in the solid so the mark doesn't read olive in dark.
    checking: "bg-progress-tint ring-progress-solid text-progress"
  }, o = "bg-subtle ring-line text-fg-subtle", l = /* @__PURE__ */ V(() => r() != null && (t.state === "checking" || t.state === "deploying") ? Math.max(0, Math.min(1, r())) : null), c = /* @__PURE__ */ V(() => {
    if (d(l) == null || d(l) <= 0) return "";
    if (d(l) >= 1) return "M8 3.75a4.25 4.25 0 1 1 0 8.5a4.25 4.25 0 1 1 0-8.5Z";
    const h = d(l) * 2 * Math.PI, x = 4.25, m = 8 + x * Math.sin(h), C = 8 - x * Math.cos(h);
    return `M8 8V3.75A${x} ${x} 0 ${d(l) > 0.5 ? 1 : 0} 1 ${m.toFixed(3)} ${C.toFixed(3)}Z`;
  }), u = /* @__PURE__ */ V(() => t.state === "approval" ? void 0 : a() ? o : i[t.state]);
  var f = mv(), p = N(f);
  {
    var v = (h) => {
      var x = rv(), m = N(x);
      _c(m, { class: "h-3 w-3", "aria-hidden": "true" }), P(() => ie(
        x,
        1,
        `sm-ask inline-flex h-4 w-4 items-center justify-center rounded-full ${s() === "held" ? "sm-ask-held text-held" : s() === "neutral" ? "sm-ask-neutral text-fg-muted" : "text-fg"}`,
        "svelte-1cj69fi"
      )), M(h, x);
    }, y = (h) => {
      var x = le(), m = ne(x);
      {
        var C = (A) => {
          var E = iv(), S = I(N(E));
          P(() => {
            ie(E, 0, `sm-pm ${t.state === "deploying" ? "sm-pm-active" : "sm-pm-progress"}`, "svelte-1cj69fi"), $(S, "d", d(c));
          }), M(A, E);
        }, _ = (A) => {
          var E = le(), S = ne(E);
          {
            var w = (k) => {
              var T = fv(), F = N(T);
              {
                var z = (D) => {
                  var H = ov();
                  M(D, H);
                }, j = (D) => {
                  var H = dv(), te = N(H);
                  {
                    var ae = (G) => {
                      var X = lv();
                      M(G, X);
                    }, se = (G) => {
                      var X = le(), re = ne(X);
                      {
                        var R = (Y) => {
                          var J = cv();
                          M(Y, J);
                        }, U = (Y) => {
                          var J = uv();
                          M(Y, J);
                        };
                        O(
                          re,
                          (Y) => {
                            t.state === "deploying" ? Y(R) : Y(U, !1);
                          },
                          !0
                        );
                      }
                      M(G, X);
                    };
                    O(te, (G) => {
                      t.state === "failed" || t.state === "stuck" ? G(ae) : G(se, !1);
                    });
                  }
                  P(() => ie(H, 0, qs(t.state === "deploying" ? "sm-spin" : ""), "svelte-1cj69fi")), M(D, H);
                };
                O(F, (D) => {
                  t.state === "held" ? D(z) : D(j, !1);
                });
              }
              P(() => ie(T, 1, `inline-flex h-4 w-4 items-center justify-center rounded-full ring-1 ring-inset ${d(u) ?? ""}`, "svelte-1cj69fi")), M(k, T);
            }, L = (k) => {
              var T = le(), F = ne(T);
              {
                var z = (D) => {
                  lp(D, {});
                }, j = (D) => {
                  var H = le(), te = ne(H);
                  {
                    var ae = (G) => {
                      var X = pv();
                      M(G, X);
                    }, se = (G) => {
                      var X = vv();
                      M(G, X);
                    };
                    O(
                      te,
                      (G) => {
                        t.state === "behind" ? G(ae) : G(se, !1);
                      },
                      !0
                    );
                  }
                  M(D, H);
                };
                O(
                  F,
                  (D) => {
                    t.state === "none" ? D(z) : D(j, !1);
                  },
                  !0
                );
              }
              M(k, T);
            };
            O(
              S,
              (k) => {
                d(u) ? k(w) : k(L, !1);
              },
              !0
            );
          }
          M(A, E);
        };
        O(
          m,
          (A) => {
            d(l) != null ? A(C) : A(_, !1);
          },
          !0
        );
      }
      M(h, x);
    };
    O(p, (h) => {
      t.state === "approval" ? h(v) : h(y, !1);
    });
  }
  var b = I(p, 2);
  {
    var g = (h) => {
      var x = hv(), m = N(x);
      P(() => K(m, n())), M(h, x);
    };
    O(b, (h) => {
      n() && h(g);
    });
  }
  P(() => $(f, "title", n())), M(e, f);
}
const gv = [
  { rank: 0, pattern: /^(dev|development|local)$/i },
  { rank: 1, pattern: /(dev|development)/i },
  { rank: 2, pattern: /^(test|qa|qe|integration)$/i },
  { rank: 3, pattern: /(test|qa|qe|integration)/i },
  { rank: 4, pattern: /^(stage|staging|preprod|preview)$/i },
  { rank: 5, pattern: /(stage|staging|preprod|preview)/i },
  { rank: 7, pattern: /^(prod|production|live)$/i },
  { rank: 8, pattern: /(prod|production|live)/i }
], mo = 6, bv = {
  dev: 0,
  development: 0,
  test: 2,
  qa: 2,
  staging: 4,
  stage: 4,
  preprod: 4,
  prod: 7,
  production: 7
};
function Qt(e) {
  if (!e) return mo;
  const t = bv[e.toLowerCase().split(/[-_./\s:]/, 1)[0]];
  if (t !== void 0) return t;
  for (const n of gv)
    if (n.pattern.test(e)) return n.rank;
  return mo;
}
function Ci(e, t) {
  const n = Qt(e), a = Qt(t);
  return n !== a ? n - a : e.localeCompare(t);
}
const os = ["dev", "test", "staging", "prod"], wv = {
  dev: "dev",
  development: "dev",
  test: "test",
  qa: "test",
  staging: "staging",
  stage: "staging",
  preprod: "staging",
  prod: "prod",
  production: "prod"
}, dr = "default";
function Ut(e) {
  if (!e) return null;
  const t = wv[e];
  if (t) return t;
  const n = Qt(e);
  return n <= 1 ? "dev" : n <= 3 ? "test" : n <= 5 ? "staging" : n === 6 ? null : "prod";
}
function qn(e) {
  return e.spec?.site || e.status?.wave?.site || dr;
}
function Ai(e) {
  return e.spec?.wave ?? e.status?.wave?.wave ?? 1;
}
function Ti(e) {
  return e.status?.wave?.role ?? null;
}
function bs(e) {
  const t = e.spec?.name || e.metadata?.name || "";
  return t.startsWith("kuberik-") ? t : `kuberik-${t}`;
}
const Lt = (e) => Ut(e) ?? e, kt = {
  selection: /^([^/\s]+)\/(\S+) selection$/,
  bake: /^([^/\s]+)\/(\S+) bake$/,
  bakeOn: /^([^/\s]+)\/(\S+) bake on (\S+)$/,
  bakeEnded: /^([^/\s]+)\/(\S+) bake (failed|cancelled) on (\S+)$/,
  noSites: /^(\S+) has no registered sites$/,
  gap: /^(\S+) has waves ([\d,-]+) \(missing ([\d,]+)\)$/,
  start: /^(\S+) has waves ([\d,-]+) \(waves start at 1\)$/,
  selfUp: /^(\S+) is its own upstream$/,
  alias: /^(.+) are the same tier \((\S+)\)/,
  unknownTier: /^environment "([^"]+)" is not a known tier/,
  pinned: /^pinned to (.+), wave selected (\S+)$/,
  lockstep: /^([^/\s]+)\/(\S+) bake on (\S+)$/,
  duplicate: /^site (\S+) of (\S+) for (\S+) is owned by cluster (\S*) namespace (\S*) name (\S+)$/
}, Cr = (e) => e.split(",").map((t) => Number(t)).filter((t) => Number.isFinite(t));
function kv(e, t) {
  const n = { kind: "unparsed", reason: e, raw: t };
  try {
    let a;
    switch (e) {
      case "WaitingFor":
        return (a = t.match(kt.bakeEnded)) ? {
          kind: "member",
          tier: Lt(a[1]),
          site: a[2],
          what: "bake",
          outcome: a[3],
          rev: a[4]
        } : (a = t.match(kt.bakeOn)) ? { kind: "member", tier: Lt(a[1]), site: a[2], what: "bake", rev: a[3] } : (a = t.match(kt.bake)) ? { kind: "member", tier: Lt(a[1]), site: a[2], what: "bake" } : (a = t.match(kt.selection)) ? { kind: "member", tier: Lt(a[1]), site: a[2], what: "selection" } : (a = t.match(kt.noSites)) ? { kind: "noSites", tier: Lt(a[1]) } : n;
      case "WaitingForCandidate":
        return t.trim() ? { kind: "candidate", rev: t.trim() } : n;
      case "Pinned":
        return (a = t.match(kt.pinned)) ? { kind: "pinned", pinned: a[1], selected: a[2] } : n;
      case "InvalidTopology":
        return (a = t.match(kt.gap)) ? {
          kind: "gap",
          tier: Lt(a[1]),
          waves: Cr(a[2]),
          missing: Cr(a[3]),
          startsAtOne: !0
        } : (a = t.match(kt.start)) ? {
          kind: "gap",
          tier: Lt(a[1]),
          waves: Cr(a[2]),
          missing: [],
          startsAtOne: !1
        } : (a = t.match(kt.selfUp)) ? { kind: "selfUpstream", tier: Lt(a[1]) } : (a = t.match(kt.alias)) ? {
          kind: "aliasTier",
          names: a[1].split(/, | and /).map((s) => s.trim()).filter(Boolean),
          tier: Lt(a[2])
        } : n;
      case "UnknownTier":
        return (a = t.match(kt.unknownTier)) ? { kind: "unknownTier", name: a[1] } : n;
      case "LockstepWaiting":
        return (a = t.match(kt.lockstep)) ? { kind: "lockstep", tier: Lt(a[1]), site: a[2], rev: a[3] } : n;
      case "DuplicateSite":
        return (a = t.match(kt.duplicate)) ? {
          kind: "duplicate",
          site: a[1],
          tier: Lt(a[2]),
          name: a[3],
          owner: { cluster: a[4], namespace: a[5], name: a[6] }
        } : n;
      default:
        return n;
    }
  } catch {
    return n;
  }
}
function _v(e, t) {
  if (!e) return null;
  const n = e.reason || t, a = e.environment ? Lt(e.environment) : "";
  switch (n) {
    case "WaitingFor":
      return e.site && e.waitingOn === "Selection" ? { kind: "member", tier: a, site: e.site, what: "selection" } : e.waitingOn === "Sites" && a ? { kind: "noSites", tier: a } : e.waitingOn === "Bake" && a ? {
        kind: "member",
        tier: a,
        site: e.site || dr,
        what: "bake",
        ...e.outcome ? { outcome: e.outcome === "Failed" ? "failed" : "cancelled" } : {},
        ...e.revision ? { rev: e.revision } : {}
      } : null;
    case "WaitingForCandidate":
      return e.revision ? { kind: "candidate", rev: e.revision } : null;
    case "Pinned":
      return e.pinnedVersion && e.selectedVersion ? { kind: "pinned", pinned: e.pinnedVersion, selected: e.selectedVersion } : null;
    case "LockstepWaiting":
      return e.site && e.revision ? { kind: "lockstep", tier: a, site: e.site, rev: e.revision } : null;
    case "DuplicateSite":
      return e.site && e.owner?.name ? {
        kind: "duplicate",
        site: e.site,
        tier: a,
        name: e.names?.[0] ?? "",
        owner: { cluster: e.owner.cluster ?? "", namespace: e.owner.namespace ?? "", name: e.owner.name }
      } : null;
    case "UnknownTier":
      return e.names?.[0] ? { kind: "unknownTier", name: e.names[0] } : null;
    case "InvalidTopology":
      return e.names && e.names.length > 1 ? { kind: "aliasTier", names: e.names, tier: a } : e.waves && e.waves.length ? {
        kind: "gap",
        tier: a,
        waves: e.waves,
        missing: e.missingWaves ?? [],
        startsAtOne: (e.missingWaves?.length ?? 0) > 0 || Math.min(...e.waves) === 1
      } : a ? { kind: "selfUpstream", tier: a } : null;
    default:
      return null;
  }
}
function ls(e) {
  try {
    const t = e.status?.conditions?.find((s) => s.type === "WaveReady");
    if (!t) return { ready: null, reason: "", raw: "", blocker: null };
    const n = t.message ?? "", a = t.reason ?? "";
    return t.status === "True" ? { ready: !0, reason: a, raw: n, blocker: null } : {
      ready: t.status === "False" ? !1 : null,
      reason: a,
      raw: n,
      blocker: t.status === "False" ? _v(e.status?.wave?.blocker, a) ?? kv(a, n) : null
    };
  } catch {
    return { ready: null, reason: "", raw: "", blocker: null };
  }
}
function go(e, t) {
  const n = os.indexOf(e.tier) - os.indexOf(t.tier);
  return n || (e.wave !== t.wave ? e.wave - t.wave : e.isLeader !== t.isLeader ? e.isLeader ? -1 : 1 : e.site < t.site ? -1 : e.site > t.site ? 1 : 0);
}
const bo = (e) => e.status?.conditions?.some(
  (t) => t.type === "WaveReady" && t.status === "False" && t.reason === "DuplicateSite"
) ?? !1;
function yv(e, t) {
  const n = [], a = /* @__PURE__ */ new Map(), s = (u, f) => {
    const p = `${u}\0${f}`;
    let v = a.get(p);
    return v || a.set(p, v = { tier: u, site: f, memberOwn: !1, duplicates: [] }), v;
  }, r = [];
  for (const u of t) {
    const f = Ut(u.spec?.environment);
    if (!f) {
      n.push(u);
      continue;
    }
    bo(u) ? r.push({ env: u, tier: f }) : s(f, qn(u)).env ??= u;
  }
  for (const { env: u, tier: f } of r) s(f, qn(u)).duplicates.push(u);
  for (const u of t) {
    const f = Ut(u.spec?.environment), p = qn(u), v = !bo(u);
    for (const y of u.status?.wave?.members ?? []) {
      const b = Ut(y.environment);
      if (!b) continue;
      const g = s(b, y.site), h = v && b === f && y.site === p;
      (!g.member || h && !g.memberOwn) && (g.member = y, g.memberOwn = h);
    }
  }
  const i = (u) => u.env ? Ai(u.env) : u.member?.wave ?? 1, o = /* @__PURE__ */ new Map();
  for (const u of a.values()) {
    const f = `${u.tier}\0${i(u)}`, p = o.get(f);
    p ? p.push(u) : o.set(f, [u]);
  }
  const l = (u) => !!u.member?.deregistered, c = [];
  for (const u of os) {
    const f = /* @__PURE__ */ new Map(), p = [];
    for (const [v, y] of o) {
      if (!v.startsWith(u + "\0")) continue;
      const b = Number(v.slice(u.length + 1)), g = y.filter((A) => !l(A)).map((A) => A.site), h = y.map((A) => A.env?.status?.wave).filter((A) => !!A), m = h.find((A) => A?.leader)?.leader ?? (g.length ? g.reduce((A, E) => E < A ? E : A) : null), C = h.find((A) => A?.site === m && A?.selectedRevision)?.selectedRevision ?? h.find((A) => A?.selectedRevision)?.selectedRevision, _ = y.map((A) => {
        const E = l(A), S = !E && A.site === m;
        return {
          tier: u,
          site: A.site,
          wave: b,
          role: A.env && Ti(A.env) || (S ? "Leader" : "Follower"),
          isLeader: S,
          env: A.env,
          member: A.member,
          revision: A.member?.revision,
          bakeStatus: A.member?.bakeStatus,
          deregistered: E,
          duplicates: A.duplicates,
          ready: A.env ? ls(A.env) : void 0
        };
      });
      _.sort(go), f.set(b, { wave: b, leader: m, selectedRevision: C, sites: _ }), p.push(..._);
    }
    p.length && (p.sort(go), c.push({
      tier: u,
      waves: [...f.values()].sort((v, y) => v.wave - y.wave),
      sites: p,
      liveCount: p.filter((v) => !v.deregistered).length
    }));
  }
  return { deployName: e, tiers: c, unplaced: n };
}
function fr(e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e ?? []) {
    if (!a) continue;
    const s = bs(a), r = t.get(s);
    r ? r.push(a) : t.set(s, [a]);
  }
  const n = /* @__PURE__ */ new Map();
  for (const [a, s] of t) n.set(a, yv(a, s));
  return n;
}
const wo = (e) => !e.deregistered;
function Mi(e, t) {
  const n = e.tiers.find((s) => s.tier === t.tier);
  if (!n) return [];
  const a = n.waves.find((s) => s.wave === t.wave);
  if (!t.isLeader) {
    const s = a?.sites.find((r) => r.isLeader);
    return s && s !== t ? [s] : [];
  }
  for (let s = t.wave - 1; s >= 1; s--) {
    const r = n.waves.find((i) => i.wave === s)?.sites.filter(wo) ?? [];
    if (r.length) return r;
  }
  for (let s = os.indexOf(t.tier) - 1; s >= 0; s--) {
    const r = e.tiers.find((i) => i.tier === os[s]);
    if (r)
      for (let i = r.waves.length - 1; i >= 0; i--) {
        const o = r.waves[i].sites.filter(wo);
        if (o.length) return o;
      }
  }
  return [];
}
function Ei(e, t) {
  if (!e) return;
  const n = Ut(t.spec?.environment);
  if (!n) return;
  const a = qn(t);
  return e.tiers.find((s) => s.tier === n)?.sites.find((s) => s.env === t || s.site === a);
}
function xv(e, t) {
  const n = e?.tiers.find((a) => a.tier === t.tier);
  return n && n.liveCount > 1 ? `${t.tier}-${t.site}` : t.tier;
}
function Sv(e, t) {
  const n = Ut(e.spec?.environment);
  if (!n) return e.spec?.environment ?? "";
  const a = t?.tiers.find((s) => s.tier === n);
  return a && a.liveCount > 1 ? `${n}-${qn(e)}` : n;
}
const ko = /* @__PURE__ */ new WeakMap();
function Nn(e, t) {
  let n = ko.get(t);
  return n || ko.set(t, n = fr(t)), Sv(e, n.get(bs(e)));
}
const Cv = "dashboard.rollout.kuberik.com/theme", Av = "dashboard.rollout.kuberik.com/theme-color", _o = "dashboard.rollout.kuberik.com/theme-label", _n = {
  /** green-700 / green-300 / green-50 · green-950 / green-800 / green-200 */
  // ⭐ DESIGN LANGUAGE (2026-10-08): IDENTITY NEVER WEARS A STATUS HUE.
  // Green is `success`, so DEV moved to TEAL (Tailwind teal ramp, h≈185),
  // which also ends the DEV-ink = `newest`-green = `Succeeded`-glyph collision
  // Chip.svelte spent a page measuring.
  dev: {
    textColor: "#00786f",
    borderColor: "#46ecd5",
    surfaceColor: "#f0fdfa",
    darkSurfaceColor: "#022f2e",
    darkBorderColor: "#005f5a",
    darkTextColor: "#96f7e4"
  },
  staging: {
    textColor: "#5d0ec0",
    borderColor: "#c4b4ff",
    surfaceColor: "#f5f3ff",
    darkSurfaceColor: "#2f0d68",
    darkBorderColor: "#4d179a",
    darkTextColor: "#ddd6ff"
  },
  /** amber-900 / amber-200 / amber-50 · amber-950 / amber-800 / amber-100 */
  // ⭐ DESIGN LANGUAGE (2026-10-08): PROD IS FUCHSIA, NOT AMBER. Amber is
  // `stuck` and nothing else; a healthy production page must not open in the
  // alarm colour.
  //
  // ⛔ "≥60° from red and from violet STAGING" (the line that used to sit
  // here) WAS NEVER MEASURED. (2026-10-11, demo/chain-order — the human
  // found staging's and prod's identity dots reading as one colour at
  // 6-8px.) The identity dot (`PRESET_THEMES.prod.color`, not this ramp)
  // is what actually carries that hue at dot size; measured in OKLCH, the
  // old `#c800de` sat only ~30° from staging's `#7c3aed` (H 322.8 vs
  // 293.0), CIEDE2000 12.4 at the dot's own rendered (chroma-capped)
  // colour — well inside "same colour" at that size. The dot is now
  // `#ed00ab` (OKLCH H 345.7, 52.7° from staging). `.chip-env-dot`
  // (app.css) caps the dot's rendered chroma at 0.14 regardless of the
  // seed's; measured at THAT capped colour (what actually reaches the
  // screen): dE2000 20.65 from staging's capped colour, and ≥20 from
  // every capped state hue (danger closest at 20.1; warning/held/
  // progress/active/success all ≥30). This ramp (borders/fills at card
  // size, where contrast carries legibility instead of hue separation)
  // is unchanged.
  prod: {
    textColor: "#a800b7",
    borderColor: "#f4a8ff",
    surfaceColor: "#fdf4ff",
    darkSurfaceColor: "#4b004f",
    darkBorderColor: "#8a0194",
    darkTextColor: "#f6cfff"
  },
  test: {
    textColor: "#007595",
    borderColor: "#53eafd",
    surfaceColor: "#ecfeff",
    darkSurfaceColor: "#053345",
    darkBorderColor: "#005f78",
    darkTextColor: "#a2f4fd"
  }
}, Tv = {
  dev: { label: "Development", color: "#009689", ramp: _n.dev },
  development: { label: "Development", color: "#009689", ramp: _n.dev },
  prod: { label: "Production", color: "#ed00ab", ramp: _n.prod },
  production: { label: "Production", color: "#ed00ab", ramp: _n.prod },
  stage: { label: "Staging", color: "#7c3aed", ramp: _n.staging },
  staging: { label: "Staging", color: "#7c3aed", ramp: _n.staging },
  test: { label: "Test", color: "#0891b2", ramp: _n.test },
  testing: { label: "Test", color: "#0891b2", ramp: _n.test }
}, Mv = [
  { pattern: /prod|production/i, preset: "prod" },
  { pattern: /dev|development/i, preset: "dev" },
  { pattern: /staging|stage/i, preset: "staging" },
  { pattern: /test|testing/i, preset: "test" }
], Ev = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
function Lv(e) {
  return e.trim().toLowerCase();
}
function Gs(e) {
  const t = e.trim();
  if (!Ev.test(t)) return null;
  if (t.length === 4) {
    const [, n, a, s] = t;
    return `#${n}${n}${a}${a}${s}${s}`.toLowerCase();
  }
  return t.toLowerCase();
}
function yo(e) {
  const t = Gs(e);
  return t ? {
    r: parseInt(t.slice(1, 3), 16),
    g: parseInt(t.slice(3, 5), 16),
    b: parseInt(t.slice(5, 7), 16)
  } : { r: 37, g: 99, b: 235 };
}
function sa(e, t, n) {
  const a = yo(e), s = yo(t), r = (o, l) => Math.round(o * (1 - n) + l * n), i = (o) => o.toString(16).padStart(2, "0");
  return `#${i(r(a.r, s.r))}${i(r(a.g, s.g))}${i(
    r(a.b, s.b)
  )}`;
}
function Nv(e) {
  return {
    textColor: sa(e, "#000000", 0.18),
    borderColor: sa(e, "#ffffff", 0.64),
    surfaceColor: sa(e, "#ffffff", 0.9),
    darkSurfaceColor: sa(e, "#000000", 0.7),
    darkTextColor: sa(e, "#ffffff", 0.42),
    // gray-700 is `.dark .chip-env`'s old border mix target.
    darkBorderColor: sa(e, "#364153", 0.62)
  };
}
function Rv(e) {
  return e.split(/[-_\s]+/).filter(Boolean).map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(" ");
}
function Ov(e) {
  return Mv.find(({ pattern: n }) => n.test(e))?.preset ?? null;
}
function Dv({
  annotationLabel: e,
  environmentName: t,
  inlineThemeColor: n,
  preset: a,
  themeName: s,
  themeValue: r
}) {
  return e || (r && a ? a.label : r && n || s === "custom" ? t || "Custom" : t || a?.label || Rv(s));
}
function Fv(e, t, n, a, s) {
  const r = Gs(a) ?? "#2563eb";
  return {
    name: e,
    label: t,
    environmentName: n,
    color: r,
    ...s ?? Nv(r)
  };
}
function cs(e, t, n) {
  const a = e?.metadata?.annotations, s = typeof t == "string" ? t : t?.spec?.environment, r = (typeof t == "object" && t && s ? n : void 0) || s || (t && typeof t == "object" ? e?.metadata?.labels?.environment?.trim() : void 0) || void 0, i = a?.[Cv]?.trim(), o = a?.[Av]?.trim();
  if (!i && !o && !r) return null;
  const l = Ut(s) ?? r, c = l ? Ov(l) : null, u = i ? Lv(i) : c ?? (o ? "custom" : ""), f = u ? Tv[u] : void 0, p = o ? Gs(o) : null, v = i ? Gs(i) : null, y = p ?? v ?? f?.color;
  if (!y) return null;
  const b = Dv({
    annotationLabel: a?.[_o]?.trim(),
    environmentName: r,
    inlineThemeColor: v,
    preset: f,
    themeName: u,
    themeValue: i
  }), g = r || a?.[_o]?.trim() || "", h = f && !p && !v ? f.ramp : void 0;
  return Fv(u, b, g, y, h);
}
function pa(e) {
  return [
    `--rollout-theme-accent: ${e.color}`,
    `--rollout-theme-text: ${e.textColor}`,
    `--rollout-theme-border: ${e.borderColor}`,
    `--rollout-theme-surface: ${e.surfaceColor}`,
    `--rollout-theme-dark-surface: ${e.darkSurfaceColor}`,
    `--rollout-theme-dark-text: ${e.darkTextColor}`,
    // Added 2026-08-27. The dark border used to be produced in CSS as
    // `color-mix(--rollout-theme-accent 38%, gray-700)`, i.e. computed from the
    // seed and washed toward the blue card ground — which is exactly why prod's
    // dark edge measured a muddy C 0.0612 at hue 67. It is a chosen step now.
    // Consumers: `.dark .chip-env` and `.dark .environment-theme-badge`.
    `--rollout-theme-dark-border: ${e.darkBorderColor}`
  ].join("; ");
}
const Iv = {
  development: "dev",
  production: "prod",
  staging: "staging",
  testing: "test"
};
function pr(e) {
  if (!e) return "";
  const t = (typeof e == "string" ? e : e.environmentName || e.name || e.label || "").toLowerCase();
  return Iv[t] || t;
}
const xo = {
  production: "prod",
  development: "dev",
  testing: "test",
  stage: "staging"
};
function yc(e) {
  const t = (e ?? "").trim(), n = /^(\d+)\s+([a-z]+)\s+(regions?)$/i.exec(t);
  if (n) {
    const i = n[2].toLowerCase();
    return { tier: xo[i] ?? i, place: `${n[1]} ${n[3].toLowerCase()}` };
  }
  const a = t.indexOf("-"), s = (a < 0 ? t : t.slice(0, a)).toLowerCase(), r = a < 0 ? "" : t.slice(a + 1);
  return { tier: xo[s] ?? s, place: r || null };
}
var Pv = /* @__PURE__ */ W('<!> <span class="min-w-0 truncate"> </span>', 1), jv = /* @__PURE__ */ W('<span class="chip-value-wrap hit-32"><a><span class="min-w-0 truncate"> </span></a></span>'), Wv = /* @__PURE__ */ W('<a><span class="min-w-0 truncate"> </span></a>'), Bv = /* @__PURE__ */ W('<span><span class="min-w-0 truncate"> </span></span>'), zv = /* @__PURE__ */ W("<span><span><!></span> <!></span>"), Hv = /* @__PURE__ */ W('<span><span class="min-w-0 truncate"> </span></span>'), Vv = /* @__PURE__ */ W('<span><span class="chip chip-env-name chip-env-tier t-chip"> </span> <span><span class="min-w-0 truncate"> </span></span></span>'), Uv = /* @__PURE__ */ W("<span> </span>"), qv = /* @__PURE__ */ W("<span><!></span>");
function Li(e, t) {
  Se(t, !0);
  const n = (H) => {
    var te = Pv(), ae = ne(te);
    {
      var se = (R) => {
        var U = le(), Y = ne(U);
        Un(Y, () => t.icon), M(R, U);
      }, G = (R) => {
        var U = le(), Y = ne(U);
        {
          var J = (Q) => {
            Zp(Q, { class: "mr-[3px] h-3 w-3 shrink-0", "aria-hidden": "true" });
          };
          O(
            Y,
            (Q) => {
              d(k) && Q(J);
            },
            !0
          );
        }
        M(R, U);
      };
      O(ae, (R) => {
        t.icon ? R(se) : R(G, !1);
      });
    }
    var X = I(ae, 2), re = N(X);
    P(() => K(re, r())), M(H, te);
  }, a = (H, te = ft) => {
    var ae = le(), se = ne(ae);
    {
      var G = (re) => {
        var R = jv(), U = N(R), Y = N(U), J = N(Y);
        P(() => {
          ie(U, 1, `chip-value t-code-sm ${l() ? "chip-value--dim" : ""}`), $(U, "href", o()), $(U, "title", t.valueTitle ?? i()), K(J, i());
        }), M(re, R);
      }, X = (re) => {
        var R = le(), U = ne(R);
        {
          var Y = (Q) => {
            var ee = Wv(), ce = N(ee), de = N(ce);
            P(() => {
              ie(ee, 1, `chip-value t-code-sm ${te() ? `chip-value--solo ${y()}` : ""} ${l() ? "chip-value--dim" : ""}`), $(ee, "href", o()), $(ee, "title", t.valueTitle ?? i()), K(de, i());
            }), M(Q, ee);
          }, J = (Q) => {
            var ee = Bv(), ce = N(ee), de = N(ce);
            P(() => {
              ie(ee, 1, `chip-value t-code-sm ${te() ? `chip-value--solo ${y()}` : ""} ${l() ? "chip-value--dim" : ""}`), $(ee, "title", t.valueTitle ?? i()), K(de, i());
            }), M(Q, ee);
          };
          O(
            U,
            (Q) => {
              o() ? Q(Y) : Q(J, !1);
            },
            !0
          );
        }
        M(re, R);
      };
      O(se, (re) => {
        o() && !te() ? re(G) : re(X, !1);
      });
    }
    M(H, ae);
  };
  let s = q(t, "role", 3, "rank"), r = q(t, "label", 3, ""), i = q(t, "value", 3, null), o = q(t, "valueHref", 3, null), l = q(t, "valueDim", 3, !1), c = q(t, "theme", 3, null);
  q(t, "dot", 3, !0);
  let u = q(t, "wide", 3, !1), f = q(t, "valueIsBuild", 3, !0), p = q(t, "regionOnly", 3, !1), v = q(t, "soft", 3, !1), y = q(t, "class", 3, "");
  Ln(() => {
  });
  const b = /* @__PURE__ */ V(() => i() !== null && i() !== void 0 && i() !== ""), g = /* @__PURE__ */ V(() => s() === "env" && !d(b) ? yc(r()) : null), h = /* @__PURE__ */ V(() => d(b) && r() === "");
  let x = /* @__PURE__ */ Ee(null);
  Ln(() => {
  }), Ln(() => {
  });
  const m = "border-line text-fg-subtle", C = "border-line text-success", _ = "border-line text-held", A = "border-danger-line bg-danger-tint text-danger", w = {
    env: "chip-env",
    // MINT AT A THIRD OF ITS CHROMA (2026-08-26). From the human:
    // *"I changed my mind on newest chip. We probably want to mark it with
    // some color just not to be so prominent"*, which softens — not
    // reverses — the earlier *"NEWEST doesn't need attention and shouldn't
    // be colored"* that made this gray.
    //
    // `HANDOFF.md`'s own word for this chip is MINT, so mint is where this
    // started. FULL-CHROMA MINT FAILS TWO MEASUREMENTS AND IS NOT USED:
    //
    //   1. IT INVERTS THE HIERARCHY IT IS SUPPOSED TO SIT UNDER. Both
    //      halves of the rank vocabulary are text-only in the same face,
    //      size and weight, so their ink is `characters x chroma` and the
    //      glyph-coverage constant cancels. `NEWEST` is 6 characters and
    //      `−4` is 2. At `emerald-600` (OKLCH C 0.1274) mint measures
    //      6 x 0.1274 = 0.764 against `red-700`'s 2 x 0.1905 = 0.381 —
    //      the NORM would print twice the ink of the DEVIATION.
    //   2. IT IS A THIRD GREEN IN ONE ROW. `emerald-600` sits at hue
    //      163.2; DEV's identity ink is 149.5 and the `Succeeded` glyph is
    //      150.1, both at 3.5-3.8x mint's distance from gray. 13 degrees
    //      of hue at comparable chroma on a 10px glyph is one colour
    //      saying three things.
    //
    // SO THE HUE IS HELD AND THE CHROMA COMES BACK UP. 2026-08-27, from
    // the human: *"I think green on newest badge is too faint."*
    //
    // "TOO FAINT" HAS A NUMBER, AND IT IS NOT ONLY CHROMA. `#56766f` was
    // C 0.0384 at L 0.539 — only 1.12x the chroma of the neutral gray in
    // the `.chip-value` half ONE PIXEL to its right, and LIGHTER than it.
    // A word that is barely more chromatic and visibly weaker than the
    // identifier it labels reads as faded, not as coloured.
    //
    // THE FIX IS SOLVED ON THREE AXES AND DRIFTS ON NONE:
    //   HUE  held at the shipped 179.4 / 182.7. Non-negotiable, and it is
    //        the axis the first attempt at this got wrong: raising chroma
    //        along the `gray-500 -> green-700` MIX LINE pulls the hue
    //        greenward, and `#53796a` landed at 168.0 — 4.8 degrees from
    //        the `emerald-600` this same comment rejects above, and 18.5
    //        from DEV's identity ink. On `/rollouts` a `[DEV]` chip and a
    //        `[newest 9a1f4c2]` badge sit on the SAME ROW. Mix amount is
    //        the wrong control; solve the three channels directly.
    //   L    0.539 -> 0.500 light. That is `red-700`'s own lightness
    //        (0.5095), so `newest` and `−N` are PEERS in weight and differ
    //        only in chroma — which is the hierarchy this chip is supposed
    //        to express. Darker than that and the norm would out-weigh the
    //        deviation on an axis chroma cannot answer for.
    //   C    0.0384 -> 0.0503 light, 0.0351 -> 0.0495 dark (+31% / +41%).
    //
    // `#426d64` / `#83b0a8`. ONE budget slot, restated — the same single
    // "quiet mint" entry, still shared character for character with
    // `CoverageBar`'s `live` segment and `ExposureBar`'s newest segment.
    // Measured, before -> after:
    //
    //   · Ink ratio `−N : newest` = characters x chroma, both halves being
    //     text-only in one face, size and weight, so the glyph constant
    //     cancels and `NEWEST` is 6 characters against `−4`'s 2:
    //     1.81x -> 1.38x light, 1.80x -> 1.27x dark. THE DEVIATION IS STILL
    //     DOMINANT, which is the constraint that made this quiet in the
    //     first place — it is louder, not promoted. (DESIGN.md publishes
    //     1.66x / 1.58x for the old value; re-measured on the rendered
    //     sRGB, it was 1.81x / 1.80x. The file understates the headroom.)
    //   · dOKLab from the plain gray it replaces: 0.046 -> 0.075 light,
    //     0.041 -> 0.053 dark. The light value was AT the detection
    //     threshold and is now well past it.
    //   · Hue separation from the green family is UNCHANGED at 29.9 degrees
    //     light / 31.1 dark, against DEV's identity ink and `green-400`.
    //     dOKLab 0.114 / 0.182. A green chip beside a green circle beside
    //     this chip still reads as one green, one green, and a hint.
    //   · 4.98:1 -> 5.83:1 on white; 6.07:1 -> 6.11:1 on `gray-800`.
    //   · Against `alarm` (fill 1140px^2 x 0.1151 + border + glyph ~= 159
    //     ink units) this is ~2.5. The alarm is still ~45x louder and is
    //     still the only chip with a FILL.
    //   · Inside `CoverageBar`, FIELD CEILING §1 still holds: `live` 0.0503
    //     against `notYet` 0.1728 (3.4x) and `failing` 0.2086 (4.1x) light;
    //     0.0495 against 0.1712 (3.5x) and 0.2373 (4.8x) dark. The loudest
    //     PIXEL of a nine-tenths-live bar is still in the adverse segment.
    //
    // ⛔ SUPERSEDED 2026-09-02 (second ruling of the day). Everything above is
    // the record of solving this word's ink INSIDE a white box, and it ended
    // with the human calling the result faint for the fourth time. The value
    // is `green-800` / `green-300` on a `green-50` / `green-950-at-30%` ground
    // now; see `MINT`, including the hour it spent as TEAL, which the human
    // named on sight (*"why is newest this weird tint and not plain green?"*).
    // The argument above that still holds and was carried forward is §1,
    // FULL-CHROMA MINT INVERTS THE PAIR — which is why this is `green-800`
    // and not `green-700`, and why the deviation leads on the GROUND.
    // ⛔ §2 IS THE ONE THAT WENT WRONG: *"it must not become a third green"*
    // was read as *"it must not BE green"*, and dodging the hue is what
    // produced the teal. The real constraint is that it must not be the SAME
    // GREEN — and `green-700` literally is (dE00 **0.0** against both DEV's
    // ink and the `Succeeded` glyph). `green-800` is 9.9 from both, ~4× the
    // JND, separated on lightness. The other thing NO LONGER TRUE is the
    // closing sentence of §1: mint is not a hand-picked hex any more, and the
    // `CoverageBar` co-tenancy it cites ended when that bar's `live` segment
    // moved to the health green.
    newest: C,
    // `−N` IS the deviation, so it is the half that carries the hue.
    //
    // IT IS RED, AND IT USED TO BE AMBER. The move was forced by the env
    // palette being restored to the human's original on 2026-08-25:
    // production is `#d97706` again, whose chip ink is `#b26205` — OKLCH
    // hue 58.3, chroma 0.135. `amber-700` is hue 45.4, chroma 0.158. On an
    // `/apps` row those two render as ADJACENT HALVES OF ONE BOX:
    // `PROD` on a cream fill, then `−4` on white, 1px apart, 12.9 deg of
    // hue between them. At 11px that is one colour saying two things, one
    // of which is an identity and the other a state.
    //
    // The rule moved, not the colour — which is the whole instruction:
    // stop re-solving the palette. `red-700` / `red-400` is 29.8 deg from
    // prod's ink and 1.5x its chroma, and it is a hue the budget already
    // owns, so this costs ZERO new colour values.
    //
    // WHAT IT COSTS. `diverged` prints in the same red, so hue no longer
    // separates "N behind" from "off the release line". That is accepted:
    // the two words share nothing lexically (`−4` is a signed number,
    // `diverged` is a word), and the hue was never what told them apart —
    // it was carrying "adverse" for both. One hue for the whole adverse
    // half of the rank vocabulary is FEWER colours, which is the bar.
    //
    // Deliberately TEXT-ONLY. `alarm` keeps the fill AND the coloured
    // border, so a stuck environment still outranks a merely trailing one
    // when both sit on the same row.
    //
    // ⛔ AND IT IS NOT RED ANY MORE EITHER. (2026-08-30) `−N` IS NEUTRAL GRAY.
    //
    // From a live UX critique of the running product: *"`−N` chips render RED
    // across the product, so normal pipeline drift reads as failure while a
    // pinned prod rollout gets a calm gray-amber chip. Fix the semantics: red
    // must mean adverse."* That is the whole charge and it is correct. On
    // `/apps/hello-world-app` the STATE rail printed `−19 −19 −24` in the same
    // `red-700` as `Failed`, on an app whose three environments had all
    // deployed successfully.
    //
    // `DESIGN-INTENT.md` already said so and had been overridden by two rounds
    // of local colour reasoning: *"Rank chips are mint for `newest` and
    // NEUTRAL GRAY for `−N from newest` — never amber."* It is not amber and it
    // is not red; it is gray.
    //
    // THE PREDICATE THE RED VIOLATED. *"Drift is the normal state of a
    // promotion pipeline. The only adverse state is stuck"* — so `−N` is not a
    // deviation at all, and painting the pipeline's steady state in the failure
    // hue is the loudest possible way to say nothing. The product's own enforced
    // rule is one line above it in DESIGN.md: *"'Drift' is not a valid status."*
    //
    // WHAT ABOUT THE INK HIERARCHY THIS BREAKS? DESIGN.md holds `−N` above
    // `newest` in ink so *"the deviation stays dominant"*. That argument
    // assumed `newest` is the NORM and `−N` the deviation, and on the live
    // cluster the opposite is true: most environments trail and reaching head
    // is the rare, informative event. `COMPOSITION-GRAMMAR.md` scopes the rule
    // to *"repeated marks in a list"* — in a fleet list the repeated mark IS
    // `−N`. So quiet mint on the rarer state and no colour at all on the
    // repeated one is the rule applied correctly, not abandoned.
    //
    // RED STILL MEANS ADVERSE, and it keeps all three genuinely adverse roles:
    // `diverged` (off every release line), `failing` (the deploy failed), and
    // `blocked` (a contract gate refuses it). Those are states that will not
    // clear on their own. Being four builds behind clears itself on the next
    // promotion. ZERO colour values change — `rank` moves onto the gray
    // `count`/`head`/`unranked` already spend.
    //
    // ⛔ AND THE GRAY IS THE LOUD ONE, NOT THE QUIET ONE. (2026-09-01)
    //
    // From the human, on a screenshot of `NEWEST 1.66.0-66` beside
    // `1 BEHIND 2.66.0-66`: *"not sure i like coloring for newest/behind in
    // these badges."* Measured on the running dark page at 1440, canvas-
    // resolved and composited against the card ground (never regexed out of
    // the `oklch()` source, which produced a badly wrong number earlier on
    // this branch):
    //
    //              light #hex   L       C        contrast   dark #hex   L       C        contrast
    //   newest     #426d64      0.5004  0.0503   5.83:1     #83b0a8     0.7225  0.0495   6.11:1
    //   N behind   #6a7282      0.5510  0.0267   4.84:1     #99a1af     0.7071  0.0224   5.64:1
    //
    // So `newest` was 1.88x the chroma of `N behind` in light and 2.21x in
    // dark, AND darker (L 0.500 vs 0.551). On `characters × chroma` — both
    // halves text-only in one face, size and weight, so the glyph constant
    // cancels — `NEWEST` printed 1.61x the ink of `1 BEHIND` in light and
    // 1.89x in dark. THE NORM WAS SHOUTING AND THE DEVIATION WAS WHISPERING,
    // which is the exact inversion the human's first ruling banned:
    // *"NEWEST doesn't need attention and shouldn't be colored. '-4' does
    // need attention and should be colored."*
    //
    // ── THE PREMISE THAT PUT IT THERE IS FALSE, AND IT IS COUNTABLE ──────
    //
    // DESIGN.md defends the pair with: *"On the live cluster ... most
    // environments trail and reaching head is the rare, informative event."*
    // Counted on the running product, chips per viewport at 1440:
    //
    //     /              newest  8   N behind  3
    //     /environments  newest  9   N behind  3
    //     /rollouts      newest 12   N behind  3
    //     TOTAL          newest 29   N behind  9      — 3.2 : 1
    //
    // `newest` IS the repeated mark. `COMPOSITION-GRAMMAR.md` scopes
    // "mark the deviation, never the norm" to *"repeated marks in a list"*,
    // and in every list this product has, the repeated mark is `newest`. The
    // rule was applied to the wrong member.
    //
    // Worse, the mint lands on rows that are ALREADY green: a `Succeeded`
    // status circle at hue ~150, and on DEV rows a green identity chip too.
    // A third green at 31 degrees' separation on a 10px six-letter word is
    // the failure this same file rejects `emerald-600` for, arriving at
    // lower chroma.
    //
    // ── WHAT CHANGES, AND WHY IT IS NOT A COLOUR ────────────────────────
    //
    // `newest` is UNTOUCHED — the human asked for it *"marked with some
    // color just not to be so prominent"* and quiet mint is that, once it is
    // no longer the loudest of the two. Its value is one budget slot shared
    // character for character with `CoverageBar`'s `live` segment and
    // `ExposureBar`'s newest segment; moving it would move those.
    //
    // `rank` takes the LOUD neutral instead. There is no hue available and
    // there must not be one: red means adverse (three roles hold it), amber
    // means `stuck` and nothing else, green/blue/yellow are states, mint is
    // "on the build in question". So the deviation is marked on the axis
    // this file already settles states on — *"`STATUS_DOT_CLASS` now splits
    // the settled states on LIGHTNESS instead of hue"* — using the gray the
    // value half is already printing:
    //
    //   light  #6a7282 → #364153   L 0.551  → 0.373   4.84:1 → 10.3:1
    //   dark   #99a1af → #e5e7eb   L 0.707  → 0.928   5.64:1 → 11.85:1
    //
    // Presence as `characters × ΔL from the ground`, which is what actually
    // carries a 10px uppercase word when chroma is ~0 on one side:
    //
    //   light  newest 3.00  ·  N behind 3.14 → 4.39   (0.96x → 1.46x newest)
    //   dark   newest 2.66  ·  N behind 3.00 → 4.54   (1.13x → 1.71x newest)
    //
    // ZERO NEW COLOUR VALUES: `gray-700` / `gray-200` is `.chip-value`'s own
    // ink, one pixel to the right inside the same box. ZERO ink-ceiling cost:
    // `area × chroma` scores a neutral at ~0, so `alarm`'s fill is still the
    // loudest mark on any row it appears on, and `failing` / `diverged` /
    // `blocked` still own the only red.
    //
    // ⛔ AND THAT LAST SENTENCE IS THE BUG, READ AS A FEATURE. (2026-09-02,
    // second ruling.) *"`area × chroma` scores a neutral at ~0"* was offered
    // as proof that the loud gray was FREE. It is equally proof that it was
    // INVISIBLE as colour: on the product's own instrument the pair scored
    // 24.8 / 26.3 light and 66.8 / 65.6 dark — **1.06× and 0.98×** — i.e. the
    // deviation was not louder than the norm at all, it was only DARKER. The
    // human's answer to seeing it: *"i thought about newest / behind badges to
    // use more prominent colors, not these faint / no colors."*
    //
    // `rank` IS A DEEP DESATURATED ORANGE NOW — see `TRAILING`, which records
    // the four spellings the human rejected in one day (loud gray, `blue-800`,
    // `sky-800`, and a filled slate slab) and closes the hue space by
    // elimination. Everything this comment argues survives: it is NOT red
    // (drift is the pipeline's normal state) and — the part that took the
    // longest to get right — it is NOT the `alarm`'s amber either, at dE00
    // 23.6 light / 70.3 dark from `#ffb900` and one fifth of its chroma.
    // `alarm` is still the loudest mark on any row on the instrument where
    // "loudest" means "most alarming" — `area × chroma`, light: alarm 218.6 >
    // adverse 117.6 > `N behind` 99.7 > `newest` 70.7; dark, card-floor
    // corrected: 130.0 > 108.9 > 91.9 > 54.2. **The ordering this file has
    // been chasing for five spellings holds in both themes for the first
    // time.**
    rank: _,
    // `failing` IS THE WORD THE RED DOT CANNOT SAY. It exists because
    // `/apps` was stating an attention row's fact twice — a lede sentence
    // `STAGING is failing` beside a joined box `[●][STAGING]` — and the two
    // halves were not redundant by accident: the box carried the identity
    // colour and the status hue, and the sentence carried the only copy of
    // the VERB. Cutting either lost something real. Giving the box the verb
    // makes it self-sufficient, so the sentence can go and the fact is
    // stated once. Same ADVERSE tone as `rank` and `diverged` — text-only,
    // ZERO new colour values — so `alarm` (the only FILL) stays the loudest
    // mark on the row, which is right: `stuck` has lasted, a failed deploy
    // has just happened and the row's own status circle is already red.
    failing: A,
    // `diverged` is the third member of the rank vocabulary — `newest`,
    // `−N`, and the case where a rank is not a distance at all. It takes
    // the product's ONE red (red-700 / dark red-400), the hue already
    // owned by `Failed`, because both mean "adverse and it will not clear
    // on its own"; the closed budget has no spare hue and this needs no
    // new one. It is deliberately TEXT-ONLY, the same geometry as `rank`:
    // `alarm` stays the only chip with a FILL, so amber remains the
    // loudest thing on the page and `stuck` is not out-shouted by a state
    // one row above it.
    diverged: A,
    // `blocked` IS THE WORD A CONTRACT GATE CANNOT SAY ANY OTHER WAY, and it
    // is the `failing` precedent applied a second time: a role name exists so
    // a grep tells you what a chip MEANS, and adding one costs nothing when it
    // spends no new value.
    //
    // It marks a release candidate that a `RolloutDependency` is holding back —
    // the consumer declared `com.kuberik.rollout.requires.<contract>` and the
    // provider has not deployed a contract version that satisfies it. On
    // `/rollouts/<cluster>/<ns>/<name>/dependencies` that is the one fact on
    // the page that needs a person, and there was no honest existing role for
    // it: `unranked` is gray and means "no rank is sayable"; `rank` is a signed
    // distance; `failing` is a deploy that failed; `diverged` is off the
    // release line. A blocked build is none of those — it is a build that is
    // fine and may not ship.
    //
    // SAME ADVERSE TONE AS `rank`, `diverged` AND `failing` — `red-700` /
    // `red-400`, TEXT-ONLY. ZERO new colour values, and `alarm` keeps the only
    // FILL, so a `stuck` chip anywhere on the same screen still outranks it.
    // It is deliberately NOT `alarm`: amber means `stuck` and nothing else for
    // state (DESIGN.md, "Colour — closed"), and a gate correctly refusing a
    // candidate is not a stoppage.
    blocked: A,
    // `held` IS NOT ADVERSE. (2026-09-03) A gate correctly refusing a
    // candidate — the exact predicate `blocked`'s own note above states —
    // is what `held` names, so it may not wear the adverse red either. The
    // rollout Overview's `Available Version Upgrades` list printed
    // `Chip role="blocked" label="held"`, 30px under an orange banner
    // stating the same fact, in `red-50`/`red-700` — the ink this file
    // reserves for `failing`/`diverged`/`blocked`, none of which is true
    // here. Every status DISC in the product already resolves `held` to
    // orange (`getStatusCircleClass`, `bake-status.ts`); this is the same
    // call for the chip. ALIAS, not a new tone — `held` is `TRAILING`
    // verbatim, the same deep desaturated orange `N behind` already
    // spends, because both say "present, and normal, but needs a look".
    // Held is a hold on promotion: the orange family, with its own hairline
    // so it out-reads a plain `N behind` beside it.
    held: "border-held-line bg-held-tint text-held",
    count: m,
    // `unranked` FILLS THE RANK SLOT WITH THE REASON THERE IS NO RANK —
    // `held`, `pending`, `unknown`. It exists because on a page where the
    // ABSENCE of a rank half is the encoding for "on head", three different
    // states were rendering as that same absence or borrowing the `rank`
    // role, and DESIGN.md forbids rendering an unresolvable comparison as a
    // definite claim.
    //
    // Deliberately GRAY, and that matters more now than it did an hour ago.
    // `rank` just took amber because `−N` is the deviation; none of these
    // three is one. `held` is a pin someone chose, `pending` has never
    // deployed, `unknown` is the case where the ladder cannot answer.
    // Amber on any of them would be an alarm raised on an absence of
    // evidence — the exact failure "never name a cause you cannot evidence"
    // is written against. Same gray pair as `count`/`head`: no new value.
    unranked: m,
    // ⛔ `head` IS `newest`. ONE FACT, ONE SPELLING. (2026-09-01)
    //
    // From the human: *"i don't like that we have"* — the same complaint that
    // produced the four earlier ink collapses on this branch. This one is the
    // clearest instance of it in the product: the word `newest`, in the same
    // 20px box, joined to the same sha, reached from the same `rank === 0`
    // branch, was printed in TWO DIFFERENT HUES depending on which file drew
    // it. `/` and `/rollouts` went through `rankRole()` → `newest` (mint);
    // `/environments`, `/envs/[name]`, `/apps/[name]` and `PromotionPipeline`
    // hard-coded `role="head"` (gray). All five say `label="newest"`; there
    // is no call site where `head` means anything else. It was never a second
    // fact, only a second spelling.
    //
    // ── MEASURED, ON THE RUNNING PRODUCT ────────────────────────────────
    // Canvas-resolved and composited against each chip's own opaque ground
    // (never regexed out of the `oklch()` source — that produced a badly
    // wrong number earlier on this branch), 1440, both themes:
    //
    //                     light hex   L       C       h       ΔL     ratio
    //   newest (mint)     #426d64   0.5004  0.0503  179.4°  0.4996  5.83:1
    //   newest (gray)     #6a7282   0.5510  0.0267  264.3°  0.4490  4.84:1
    //   N behind (rank)   #364153   0.3731  0.0343  260.2°  0.6269  10.3:1
    //
    //                     dark hex    L       C       h       ΔL     ratio
    //   newest (mint)     #83b0a8   0.7225  0.0495  182.7°  0.4442  6.11:1
    //   newest (gray)     #99a1af   0.7071  0.0224  261.7°  0.4287  5.64:1
    //   N behind (rank)   #e5e7eb   0.9276  0.0058  264.5°  0.6492  11.85:1
    //
    // THE GRAY SPELLING COLLIDES WITH THE THING IT IS SUPPOSED TO CONTRAST
    // WITH. `newest`-as-gray sits **4.1° of hue** from `N behind` in light and
    // **2.8°** in dark. They are the same hue; the only channel separating
    // the two members of the rank vocabulary was lightness, two steps of gray
    // on a 10px uppercase word. The mint spelling separates them by **80.8°**
    // (light) / **81.8°** (dark) AND by lightness. On `/envs/prod` today a
    // reader has to compare two grays to tell "on the newest build" from
    // "one build behind"; on `/rollouts`, 250ms away, the same pair is
    // unmistakable. That is the cost of the second spelling, in degrees.
    //
    // AND MINT NO LONGER OUT-SHOUTS THE DEVIATION, which is the only reason
    // this role was ever gray. `rank` took `.chip-value`'s own loud gray one
    // commit ago (`efcf8ad`), so on `characters × (ΔL + C)` — both halves
    // text-only in one face, size and weight, so the glyph constant cancels;
    // `NEWEST` is 6 characters against `1 BEHIND`'s 7:
    //
    //   light   newest 3.30  ·  N behind 4.63   deviation 1.40× dominant
    //   dark    newest 2.96  ·  N behind 4.59   deviation 1.55× dominant
    //
    // Against the gray spelling the deviation led 1.62× / 1.70×, so unifying
    // on mint spends 14% of that headroom and the deviation still leads on
    // every channel. `alarm` is untouched and still the only chip with a FILL
    // (218.6 / 162.3 presence units against mint's ~2.5).
    //
    // THE HUMAN'S OWN RULINGS, IN ORDER, ALL POINT HERE. *"NEWEST doesn't
    // need attention and shouldn't be colored"* → *"changed my mind on newest
    // chip, mark it with some color just not to be so prominent"* → *"I
    // generally think we're undercoloring now a bit."* The gray spelling is
    // the FIRST ruling, still shipping on three surfaces eight days after it
    // was reversed. Going gray everywhere would re-apply a reversed ruling,
    // remove colour from three pages while the human asks for more, and leave
    // mint's one budget slot held only by `CoverageBar`'s `live` segment and
    // `ExposureBar`'s newest segment with no chip left to anchor what it
    // means. Going mint everywhere costs ZERO new colour values — `#426d64` /
    // `#83b0a8` is already on screen 20 times per viewport — and takes the
    // product from two spellings to one.
    //
    // ⚠️ `head` SURVIVES AS A NAME, NOT AS A TONE. Four of the five call
    // sites are in files this pass does not own, so the role string stays and
    // resolves to the same constant `newest` does. Do not give it a value of
    // its own again: the two roles are ONE spelling by decision, and if they
    // ever differ the product is back where it started. When the remaining
    // call sites are next opened, migrate them to `role="newest"` and delete
    // this entry.
    head: C,
    // THE ALARM: A FILL AND A WORD. NO GLYPH. (2026-08-27, from the human:
    // *"we have stuck which has its own dot which is also useless"*.)
    //
    // It was right. The dot was amber, the word beside it was `STUCK`, and
    // they sat 4px apart inside one 57px box — the same fact encoded twice,
    // in a product whose own rule is that a page which states something
    // twice has one encoding too many. This retires the long-standing
    // *"`alarm` is the only chip with a fill AND a glyph"* rule, which
    // existed to guarantee the alarm was the loudest mark on any row. That
    // guarantee now rests on the FILL alone, and it still holds — measured
    // with DESIGN.md's own formula
    // (`area x fillC + area x 0.28 x inkC + perimeter x borderC + dot`) on
    // `/apps` at 1440:
    //
    //     with glyph, amber-200/950   57.1 x 20   204.2 light / 155.5 dark
    //     no glyph,   amber-200/950   48.1 x 20   169.4 light / 128.4 dark
    //     no glyph,   amber-400/900   48.1 x 20   218.6 light / 162.3 dark
    //
    // The middle row is what the glyph alone cost, and it was NOT
    // survivable: 169.4 against `prod-ap-northeast-1`'s 167.7 on
    // `/rollouts` is 1.01x, and 128.4 against `staging`'s 134.9 in dark is
    // 0.95x — the alarm would have stopped being the loudest mark on the
    // page. So the fill paid for it in the same pass; see the note on the
    // `alarm` value below. The rule is intact and the ratios are BETTER
    // than before the glyph came off.
    //
    // THE FILL PAID FOR THE GLYPH, IN THE SAME PASS. Removing the dot cost
    // 9px of width and its own ink: presence fell 204.2 -> 169.4 light and
    // 155.5 -> 128.4 dark, which put the alarm at 1.01x the loudest identity
    // chip on `/` and `/rollouts` and BELOW it in dark (0.95x). The
    // clipping pass had already spent most of the headroom (DESIGN.md:
    // *"widening a chip multiplies its presence by its width, so `wide` is
    // the fastest way in this product to spend the alarm's headroom"*), so
    // there was nothing left to absorb it. Bought back on the FILL, which
    // is the channel the rule now rests on:
    //
    //     light   bg amber-200 -> amber-400,  border amber-400 -> amber-500
    //     dark    bg amber-950 -> amber-900,  border amber-700 unchanged
    //
    // ZERO NEW COLOUR VALUES — amber-400, amber-500 and amber-900 are all
    // already spent in this file and in `CoverageBar` / `EnvHealthStrip`.
    // Measured after, at 1440: presence 218.6 light / 162.3 dark, i.e.
    // **1.30x / 1.20x** the loudest identity mark on `/` and `/rollouts`
    // (167.7 / 134.9) and 1.62x / 1.22x on `/apps` (135.2 / 132.8). Better
    // than the 1.22x / 1.15x it held before the glyph came off.
    //
    // Contrast holds on both: amber-900 on amber-400 is 5.26:1, amber-200
    // on amber-900 is 7.28:1, both past the 4.5:1 small-text floor. The
    // border stays visible against its own fill — dL 0.057 light, 0.142
    // dark — so the chip is still a bordered box and not a slab.
    //
    // The old note, still true and still the reason the fill is where the
    // presence lives: amber-100 (#fef3c6) measures 1.11:1 against white, so
    // the mechanism the spec names as "what makes it loudest" was
    // contributing essentially zero luminance mass and the chip was really
    // an outline chip with a warm tint.
    // ⭐ DESIGN LANGUAGE: the ONE filled chip, in both themes. Stuck is the
    // alarm; nothing else in the chip family is a solid.
    alarm: "border-warning-solid bg-warning-solid text-[var(--k-on-warning)]",
    // See `DEPLOYING`/`CHECKING`'s own note, above `ADVERSE`.
    deploying: "border-active-line bg-active-tint text-active",
    checking: "border-progress-line bg-progress-tint text-progress",
    // D-11/D-12: zero new colour — see the `ChipRole` note above.
    ready: "border-success-line bg-success-tint text-success",
    issue: A
  }, L = /* @__PURE__ */ new Set(["newest", "head", "rank", "diverged", "unranked"]), k = /* @__PURE__ */ V(() => !t.icon && d(b) && f() && L.has(s())), T = /* @__PURE__ */ V(() => u() ? "chip-wide" : s() === "env" ? "" : d(k) ? "max-w-[calc(14ch+40px)]" : "max-w-[calc(14ch+26px)]");
  var F = le(), z = ne(F);
  {
    var j = (H) => {
      a(H, () => !0);
    }, D = (H) => {
      var te = le(), ae = ne(te);
      {
        var se = (X) => {
          var re = zv(), R = N(re), U = N(R);
          n(U);
          var Y = I(R, 2);
          a(Y, () => !1), An(re, (J) => me(x, J), () => d(x)), P(
            (J) => {
              ie(re, 1, `chip-joined ${y() ?? ""}`), ie(R, 1, `chip ${s() === "env" ? "chip-env-name t-ui-sm" : "t-chip"} ${w[s()] ?? ""} ${d(T) ?? ""}`), rt(R, J), $(R, "title", t.title ?? r());
            },
            [
              () => s() === "env" && c() ? pa(c()) : void 0
            ]
          ), M(X, re);
        }, G = (X) => {
          var re = le(), R = ne(re);
          {
            var U = (J) => {
              var Q = le(), ee = ne(Q);
              {
                var ce = (Z) => {
                  var pe = Hv(), he = N(pe), ve = N(he);
                  An(pe, (Le) => me(x, Le), () => d(x)), P(() => {
                    ie(pe, 1, `chip chip-env-name chip-env-place chip-env-region ${u() ? "chip-wide" : ""} ${y() ?? ""}`), $(pe, "data-env", r()), $(pe, "title", t.title ?? r()), K(ve, d(g).place);
                  }), M(Z, pe);
                }, de = (Z) => {
                  var pe = le(), he = ne(pe);
                  {
                    var ve = (He) => {
                      var _e = Vv(), $e = N(_e), Be = N($e), gt = I($e, 2), Ie = N(gt), B = N(Ie);
                      An(_e, (oe) => me(x, oe), () => d(x)), P(
                        (oe, fe) => {
                          ie(_e, 1, `chip-joined chip-env-badge ${v() ? "chip-env-soft" : ""} ${y() ?? ""}`), $(_e, "data-env", r()), rt(_e, oe), $(_e, "title", t.title ?? r()), K(Be, d(g).tier), ie(gt, 1, `chip chip-env-name chip-env-place t-ui-sm ${u() ? "chip-wide" : ""} ${fe ?? ""}`), K(B, d(g).place);
                        },
                        [
                          () => c() ? pa(c()) : void 0,
                          () => /^\d+ regions?$/.test(d(g).place) ? "chip-env-place--count" : ""
                        ]
                      ), M(He, _e);
                    }, Le = (He) => {
                      var _e = Uv(), $e = N(_e);
                      An(_e, (Be) => me(x, Be), () => d(x)), P(
                        (Be) => {
                          ie(_e, 1, `chip chip-env-name chip-env-tier t-chip ${v() ? "chip-env-soft" : ""} ${y() ?? ""}`), $(_e, "data-env", r()), rt(_e, Be), $(_e, "title", t.title ?? r()), K($e, d(g).tier);
                        },
                        [
                          () => c() ? pa(c()) : void 0
                        ]
                      ), M(He, _e);
                    };
                    O(
                      he,
                      (He) => {
                        d(g).place ? He(ve) : He(Le, !1);
                      },
                      !0
                    );
                  }
                  M(Z, pe);
                };
                O(ee, (Z) => {
                  d(g).place && p() ? Z(ce) : Z(de, !1);
                });
              }
              M(J, Q);
            }, Y = (J) => {
              var Q = qv(), ee = N(Q);
              n(ee), An(Q, (ce) => me(x, ce), () => d(x)), P(
                (ce) => {
                  ie(Q, 1, `chip ${s() === "env" ? "chip-env-name t-ui-sm" : "t-chip"} ${w[s()] ?? ""} ${d(T) ?? ""} ${y() ?? ""}`), rt(Q, ce), $(Q, "title", t.title ?? r());
                },
                [
                  () => s() === "env" && c() ? pa(c()) : void 0
                ]
              ), M(J, Q);
            };
            O(
              R,
              (J) => {
                d(g) ? J(U) : J(Y, !1);
              },
              !0
            );
          }
          M(X, re);
        };
        O(
          ae,
          (X) => {
            d(b) ? X(se) : X(G, !1);
          },
          !0
        );
      }
      M(H, te);
    };
    O(z, (H) => {
      d(h) ? H(j) : H(D, !1);
    });
  }
  M(e, F), Ce();
}
const So = {
  Succeeded: "deploy succeeded",
  Failed: "deploy failed",
  InProgress: "checking",
  Deploying: "deploying",
  Cancelled: "stopped",
  None: "no deploy yet"
};
function Gv(e) {
  return So[e ?? "None"] ?? So.None;
}
const Co = {
  Succeeded: "The deploy finished and passed its checks",
  Failed: "The deploy failed",
  InProgress: "The new version is live and is being watched before the deploy counts as done",
  Deploying: "The new version is still going out",
  Cancelled: "The deploy was stopped before it finished",
  None: "Nothing has been deployed here yet"
};
function Kv(e) {
  return Co[e ?? "None"] ?? Co.None;
}
const Yv = "";
function Ks(e) {
  return e === "/" ? "/" : `${Yv}${e}`;
}
const xc = "rollout-dashboard.kuberik.com/source-cluster", $v = "rollout-dashboard.kuberik.com/source-dashboard";
function Ma(e) {
  return e?.metadata?.annotations?.[xc] ?? "";
}
function wa(e) {
  return e?.metadata?.annotations?.[$v] ?? "";
}
function Ni(e, t) {
  return Ma(e) === Ma(t) && e.metadata?.namespace === t.metadata?.namespace && t.spec?.rolloutRef?.name === e.metadata?.name;
}
function Ri(e, t, n, a) {
  const s = `/rollouts/${encodeURIComponent(e)}/${encodeURIComponent(t)}/${encodeURIComponent(n)}`;
  return Ks(s);
}
function Qv(e) {
  let t = e.trim();
  const n = t.match(/^[\w.-]+@([\w.-]+):(.+)$/);
  return n ? t = `${n[1]}/${n[2]}` : t = t.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, ""), t = t.replace(/\/(tree|blob)\/.*$/, ""), t = t.replace(/\.git\/?$/, "").replace(/\/+$/, ""), t.toLowerCase();
}
function Sc(e, t) {
  return e ? `repo:${Qv(e)}` : `app:${t}`;
}
function Ao(e, t) {
  return Sc(e?.status?.source, t);
}
function Zv(e) {
  return e.startsWith("repo:") ? e.slice(5) : e.startsWith("app:") ? e.slice(4) : e;
}
function ti(e) {
  return e.startsWith("app:") ? `${e.slice(4)} (no linked repository)` : Zv(e);
}
function vr(e, t) {
  if (!t) return "";
  for (const n of e?.status?.availableReleases ?? [])
    if (n.tag === t) return ge(n);
  for (const n of e?.status?.history ?? [])
    if (n.version?.tag === t) return ge(n.version);
  return yt(t);
}
const Xv = [
  { key: "prod", pattern: /prod|production|live/i },
  { key: "dev", pattern: /dev|development/i },
  { key: "staging", pattern: /stag|preprod|preview/i },
  { key: "test", pattern: /test|qa|qe|integration/i }
], Jv = {
  dev: "DEV",
  staging: "STAGING",
  prod: "PROD",
  test: "TEST"
};
function Ha(e) {
  for (const { key: t, pattern: n } of Xv)
    if (n.test(e)) return Jv[t];
  return e.toUpperCase();
}
function Cc(e, t) {
  const n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
  for (const s of t) {
    const r = s.spec?.rolloutRef?.name;
    if (!r) continue;
    const i = e.find((c) => Ni(c, s));
    if (!i) continue;
    a.add(i);
    let o = n.get(r);
    o || (o = { appName: r, hasEnvironmentBinding: !0, cells: [] }, n.set(r, o));
    const l = Ao(i, r);
    o.cells.push({
      envName: s.spec?.environment ? Nn(s, t) : "",
      tier: Ut(s.spec?.environment),
      site: qn(s),
      wave: Ai(s),
      role: Ti(s),
      ready: ls(s).ready,
      environment: s,
      rollout: i,
      theme: cs(
        i,
        s,
        s.spec?.environment ? Nn(s, t) : null
      ),
      sourceURL: wa(s),
      sourceCluster: Ma(s),
      repoKey: l,
      repoLabel: ti(l)
    });
  }
  for (const s of e) {
    const r = s.metadata?.name;
    if (!r || a.has(s)) continue;
    let i = n.get(r);
    i || (i = { appName: r, hasEnvironmentBinding: !1, cells: [] }, n.set(r, i));
    const o = Ao(s, r);
    i.cells.push({
      envName: s.metadata?.namespace || "",
      tier: null,
      site: null,
      wave: null,
      role: null,
      ready: null,
      environment: null,
      rollout: s,
      theme: cs(s),
      sourceURL: wa(s),
      sourceCluster: Ma(s),
      repoKey: o,
      repoLabel: ti(o)
    });
  }
  for (const s of n.values())
    s.cells.sort((r, i) => Ci(r.envName, i.envName));
  return n;
}
function eh(e) {
  if (!e) return 0;
  const t = new Date(e).getTime();
  return Number.isFinite(t) ? t : 0;
}
function Ar(e) {
  return e && ge(e) || null;
}
function th(e) {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), r = (u) => {
    const f = Ar(u);
    if (!f || !u) return;
    const p = eh(u.created), v = t.get(f);
    if (v) {
      !v.revision && u.revision && (v.revision = u.revision), !v.tag && u.tag && (v.tag = u.tag), p > v.createdMs && (v.createdMs = p), i && (v.onReleaseLine = !0);
      return;
    }
    t.set(f, {
      version: f,
      revision: u.revision ?? null,
      tag: u.tag ?? null,
      createdMs: p,
      rank: -1,
      onReleaseLine: i
    });
  };
  let i = !0;
  for (const u of e) {
    const f = u.rollout.status?.availableReleases ?? [];
    f.forEach((p, v) => {
      r(p);
      const y = Ar(p);
      if (!y) return;
      const b = f.length - 1 - v;
      s.set(y, Math.max(s.get(y) ?? -1 / 0, b));
    });
  }
  i = !1;
  for (const u of e)
    (u.rollout.status?.history ?? []).forEach((p, v) => {
      r(p.version);
      const y = Ar(p.version);
      if (!y) return;
      const b = p.timestamp ? new Date(p.timestamp).getTime() : NaN;
      if (Number.isFinite(b) && n.set(y, Math.max(n.get(y) ?? -1 / 0, b)), v === 0) {
        const g = Qt(u.tier ?? u.envName);
        a.set(y, Math.min(a.get(y) ?? 1 / 0, g));
      }
    });
  const o = [...t.values()].sort((u, f) => {
    if (f.createdMs !== u.createdMs) return f.createdMs - u.createdMs;
    const p = s.get(u.version) ?? Number.POSITIVE_INFINITY, v = s.get(f.version) ?? Number.POSITIVE_INFINITY;
    if (p !== v) return p - v;
    const y = a.get(u.version) ?? Number.POSITIVE_INFINITY, b = a.get(f.version) ?? Number.POSITIVE_INFINITY;
    if (y !== b) return y - b;
    const g = n.get(u.version), h = n.get(f.version);
    return g !== void 0 && h !== void 0 && g !== h ? h - g : u.version.localeCompare(f.version);
  });
  o.forEach((u, f) => u.rank = f);
  let l = 0;
  for (const u of o)
    !u.onReleaseLine || u.createdMs <= 0 || (l === 0 || u.createdMs < l) && (l = u.createdMs);
  const c = new Map(o.map((u) => [u.version, u]));
  return {
    builds: o,
    rankOf: (u) => u ? c.get(u)?.rank ?? -1 : -1,
    get: (u) => u ? c.get(u) : void 0,
    releaseLineOldestMs: l
  };
}
function nh(e, t, n) {
  if (!t || e.releaseLineOldestMs === 0) return !1;
  const a = e.get(t);
  if (!a || a.onReleaseLine) return !1;
  const s = a.createdMs > 0 ? a.createdMs : n;
  return !Number.isFinite(s) || s <= 0 ? !1 : s >= e.releaseLineOldestMs;
}
function ah(e) {
  const t = e.rollout?.status?.history?.[0]?.version;
  return t && ge(t) || null;
}
function sh(e) {
  const t = e.rollout?.status?.history?.[0]?.timestamp;
  if (!t) return 0;
  const n = new Date(t).getTime();
  return Number.isFinite(n) ? n : 0;
}
function rh(e) {
  const t = th(e.cells), n = /* @__PURE__ */ new Map();
  for (const a of e.cells) {
    const s = ah(a);
    if (!s) {
      n.set(a, { kind: "unknown" });
      continue;
    }
    if (nh(t, s, sh(a))) {
      n.set(a, { kind: "diverged" });
      continue;
    }
    const r = La(a.rollout);
    if (r !== null) {
      n.set(a, r === 0 ? { kind: "newest" } : { kind: "behind", by: r });
      continue;
    }
    const i = a.rollout?.status;
    if (!(!Array.isArray(i?.availableReleases) && !Array.isArray(i?.releaseCandidates))) {
      n.set(a, { kind: "unknown" });
      continue;
    }
    const l = t.rankOf(s);
    l < 0 ? n.set(a, { kind: "unknown" }) : l === 0 ? n.set(a, { kind: "newest" }) : n.set(a, { kind: "behind", by: l });
  }
  return n;
}
function ih(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of Cc(e, t).values()) {
    const s = rh(a);
    for (const r of a.cells) n.set(r.rollout, s.get(r) ?? { kind: "unknown" });
  }
  return n;
}
function To({ builds: e }) {
  return `${e} build${e === 1 ? "" : "s"} behind`;
}
function hr(e) {
  return e.kind === "behind" ? e.by : 0;
}
function us(e) {
  return e.statusKey === "failed" || e.stuck != null || e.checkFailure != null;
}
function oh(e) {
  return e.statusKey === "succeeded" && e.stuck == null && e.checkFailure == null;
}
function lh(e) {
  return oh(e) && (hr(e.rank) > 0 || e.rank.kind === "diverged");
}
function Oi(e) {
  return lh(e) && (e.held || e.pinnedVersion != null);
}
const ch = {
  held: !1,
  cause: null,
  waitsForEnv: null,
  frontier: null,
  waitingBehind: []
}, uh = "its upstream environment";
function Mo(e) {
  const t = Qt(e);
  return t <= 1 ? 0 : t <= 3 ? 1 : t <= 5 ? 2 : t === 6 ? 3 : 4;
}
function dh(e) {
  return e.kind !== "promotion" || e.subjectKind !== "environment" || !e.subject || e.subject === uh ? null : e.subject;
}
function fh(e, t) {
  const n = Mo(t);
  let a = null, s = null, r = !1, i = !1;
  for (const o of e) {
    const l = dh(o), c = o.upstreamTier ?? l;
    if (!c) {
      i = !0;
      continue;
    }
    const u = Mo(c);
    u < n ? a || (a = l ?? c, s = o) : u === n && (l ?? c) !== t && (o.upstreamTier ? a || (a = l ?? c, s = o) : r = !0);
  }
  return { chainUpstream: a, chainGate: s, order: r, unresolved: i };
}
function ph(e, t) {
  const n = [], a = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (const r of e) {
    const i = Di(r.classifiedGates, t, { hasContract: r.contracts.length > 0 });
    if (!i.held && i.waitsForEnv) {
      a.has(i.waitsForEnv) || (n.push(i.waitsForEnv), s.set(i.waitsForEnv, i.waveWait ?? null)), a.set(i.waitsForEnv, (a.get(i.waitsForEnv) ?? 0) + 1);
      continue;
    }
    return {
      frontier: {
        build: r.build,
        held: i.held,
        cause: i.cause,
        causeLabel: Tc(r.classifiedGates, i.cause)
      },
      waitingBehind: n.map((o) => ({ stage: o, count: a.get(o) ?? 0, ...s.get(o) ? { wave: s.get(o) } : {} }))
    };
  }
  return { frontier: null, waitingBehind: n.map((r) => ({ stage: r, count: a.get(r) ?? 0, ...s.get(r) ? { wave: s.get(r) } : {} })) };
}
function Ac(e, t) {
  if (e.candidates === void 0) {
    if (!e.blocked) return ch;
    const s = Di(e.gates, t);
    return s.held ? {
      held: !0,
      cause: s.cause,
      waitsForEnv: null,
      frontier: { build: "", held: !0, cause: s.cause, causeLabel: Tc(e.gates, s.cause) },
      waitingBehind: s.waitsForEnv ? [{ stage: s.waitsForEnv, count: 1 }] : []
    } : {
      held: !1,
      cause: null,
      waitsForEnv: s.waitsForEnv,
      ...s.waveWait ? { waveWait: s.waveWait } : {},
      frontier: null,
      waitingBehind: s.waitsForEnv ? [{ stage: s.waitsForEnv, count: 1, ...s.waveWait ? { wave: s.waveWait } : {} }] : []
    };
  }
  const { frontier: n, waitingBehind: a } = ph(e.candidates, t);
  return n ? { held: n.held, cause: n.cause, waitsForEnv: null, frontier: n, waitingBehind: a } : { held: !1, cause: null, waitsForEnv: a[0]?.stage ?? null, ...a[0]?.wave ? { waveWait: a[0].wave } : {}, frontier: null, waitingBehind: a };
}
const vh = { held: !1, cause: null, waitsForEnv: null };
function hh(e) {
  return !e || !e.short || / to deploy (it first|this build)$/.test(e.short) ? null : e.short;
}
function Di(e, t, n = {}) {
  const a = e.filter((v) => v.clears === "upstream"), s = a.filter((v) => v.kind === "promotion"), { chainUpstream: r, chainGate: i, order: o, unresolved: l } = fh(s, t);
  if (r) {
    const v = hh(i);
    return { held: !1, cause: null, waitsForEnv: r, ...v ? { waveWait: v } : {} };
  }
  const c = e.filter((v) => v.clears === "person"), u = e.filter((v) => v.clears === "unknown"), f = e.filter((v) => v.clears === "clock"), p = e.filter((v) => v.clears === "check");
  return c.length > 0 ? { held: !0, cause: "person", waitsForEnv: null } : u.length > 0 ? { held: !0, cause: "unknown", waitsForEnv: null } : a.some((v) => v.kind === "dependency") || n.hasContract ? { held: !0, cause: "dependency", waitsForEnv: null } : o ? { held: !0, cause: "order", waitsForEnv: null } : f.length > 0 ? { held: !0, cause: "clock", waitsForEnv: null } : p.length > 0 ? { held: !0, cause: "check", waitsForEnv: null } : l ? { held: !0, cause: "unknown", waitsForEnv: null } : vh;
}
function mh(e, t) {
  return Di(e.classifiedGates, t);
}
function gh(e, t, n) {
  const a = [], s = [], r = [];
  for (const i of e.held) {
    const o = mh(i, t);
    o.held ? a.push(i) : o.waitsForEnv && n?.(i, o.waitsForEnv) ? r.push({ entry: i, stage: o.waitsForEnv }) : s.push({ entry: i, stage: o.waitsForEnv });
  }
  return { held: a, waiting: s, skipped: r };
}
function Tc(e, t) {
  if (!t) return null;
  switch (t) {
    case "person":
      return "an approval";
    case "unknown":
      return "a rule this dashboard cannot attribute";
    case "dependency": {
      const n = [
        ...new Set(
          e.filter((a) => a.clears === "upstream" && a.kind === "dependency" && a.subject).map((a) => a.subject)
        )
      ];
      return n.length > 0 ? Ea(n) : "a dependency";
    }
    case "order":
      return "promotion order";
    case "clock":
      return e.find((n) => n.clears === "clock")?.label ?? "a deploy window";
    case "check":
      return "a check";
  }
}
function bh(e, t) {
  return e ? `/api/clusters/${encodeURIComponent(e)}${t}` : `/api${t}`;
}
function Mc(e, t, n) {
  return `${e ?? ""}|${t}/${n}`;
}
function wh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e ?? []) {
    const a = Mc(Ma(n), n.metadata.namespace, n.metadata.name);
    t.set(a, [...t.get(a) ?? [], ...n.healthChecks ?? []]);
  }
  return t;
}
const kh = "displayTimeZone";
function _h() {
  try {
    return localStorage.getItem(kh) === "utc" ? "utc" : "local";
  } catch {
    return "local";
  }
}
const Ec = Pt({ zone: typeof localStorage > "u" ? "local" : _h() });
function Lc() {
  return Ec.zone === "utc" ? "UTC" : void 0;
}
function yh(e = /* @__PURE__ */ new Date()) {
  const t = (s) => new Intl.DateTimeFormat(s, { timeZone: Lc(), timeZoneName: "short" }).formatToParts(e).find((r) => r.type === "timeZoneName")?.value ?? "", n = t("en-US");
  if (n && !n.startsWith("GMT")) return n;
  const a = t("en-GB");
  return a && !a.startsWith("GMT") ? a : n || a || (Ec.zone === "utc" ? "UTC" : "");
}
const xh = "gate.kuberik.com/pretty-name";
function Nc(e) {
  return e?.annotations?.[xh] || null;
}
function Sh(e) {
  const t = e.replace(/[-_.]+/g, " ").trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : e;
}
const Ch = /-[bcdfghjklmnpqrstvwxz2456789]{5}$/;
function Ah(e) {
  return Ch.test(e);
}
function Fi(e, t) {
  return t || (Ah(e) ? "Gate" : Sh(e));
}
function Th(e, t = /* @__PURE__ */ new Date()) {
  const n = new Date(e).getTime() - t.getTime();
  if (!Number.isFinite(n) || n <= 0) return null;
  const a = Math.floor(n / 6e4), s = Math.floor(a / 60), r = Math.floor(s / 24);
  return r > 0 ? `${r}d ${s % 24}h` : s > 0 ? `${s}h ${a % 60}m` : `${a}m`;
}
function Mh(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : `${t.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !1,
    timeZone: Lc()
  })} ${yh(t)}`;
}
const Eh = {
  failed: "failed",
  failing: "failed",
  stuck: "failed",
  approval: "approval",
  waiting: "approval",
  held: "held",
  hold: "held",
  deploying: "deploying",
  current: "deploying",
  checking: "checking"
}, Lh = (e) => e ? Eh[e] ?? null : null;
function St(e, t = {}) {
  const n = Lh(e);
  if (!n) return null;
  switch (n) {
    case "failed":
      return "Failing";
    case "approval":
      return t.compact ? "Waiting" : t.yours ? "Needs your approval" : "Waiting for approval";
    case "held":
      return "Held";
    case "deploying":
      return "Deploying";
    case "checking":
      return "Checking";
  }
}
const Nh = (e) => St("approval", { yours: e }), Eo = ["failed", "awaiting-approval", "held-by-rule", "checking", "deploying", "rolled-back", "healthy"], Rh = (e) => {
  const t = Eo.indexOf(e ?? "");
  return t < 0 ? Eo.length : t;
};
function Oh(e) {
  return Dh(e).join(" · ");
}
function Dh(e) {
  const t = e.required ? ` ${e.required}` : "", n = [`Needs ${e.provider}${t}`];
  return e.has && n.push(`has ${e.has}`), n;
}
function Rc(e) {
  return {
    id: `contract:${e.provider}`,
    kind: "dependency",
    clears: "upstream",
    label: `depends on ${e.provider}`,
    // The noun-clause form every other `upstream` clause already uses
    // (`classifyGate`'s own dependency branch: "X ships Y") — composed
    // here from `ContractHold`'s own fields rather than `GateContext`'s
    // join, since this hold never had a `RolloutGate` object to join.
    clause: e.required ? `${e.provider} ships ${e.required}` : `${e.provider} ships a newer version`,
    short: Oh(e),
    clearsAt: null,
    timezone: null,
    ...Ot,
    subject: e.provider,
    subjectKind: "service",
    predicate: e.required ? `ships ${e.required}` : "ships a newer version",
    contract: null,
    have: e.has ?? null,
    need: e.required ?? null
  };
}
function Oc(e, t) {
  return e.kind !== "dependency" ? !1 : e.id && t.some((n) => n.gate === e.id) ? !0 : !!e.subject && t.some((n) => n.provider === e.subject);
}
const Ot = {
  subject: null,
  subjectKind: null,
  predicate: null,
  contract: null,
  have: null,
  need: null
}, Va = {
  promotion: /* @__PURE__ */ new Map(),
  dependency: /* @__PURE__ */ new Map(),
  schedule: /* @__PURE__ */ new Map(),
  owners: /* @__PURE__ */ new Map(),
  sources: { environments: !1, dependencies: !1 },
  schedulesLoaded: !1,
  schedulesExpected: !0
}, jn = (e, t) => `${e ?? ""}/${t}`;
function Fh(e) {
  return Nc(e);
}
function Ih(e, t) {
  const n = t.get(bs(e)), a = Ei(n, e), s = ls(e), r = {
    tier: a?.tier ?? null,
    site: a?.site ?? e?.spec?.site ?? dr,
    wave: a?.wave ?? e?.spec?.wave ?? 1,
    role: a?.role ?? "Leader",
    upstream: [],
    upstreamSites: [],
    upstreamTier: null,
    upstreamWave: null,
    via: null,
    selected: null,
    ready: s.ready === null && !s.raw ? null : s
  };
  if (!n || !a) return r;
  const i = Mi(n, a);
  r.upstream = i.map((l) => xv(n, l)), r.upstreamSites = i.map((l) => l.site), i.length && (r.upstreamTier = i[0].tier, r.upstreamWave = i[0].wave, r.via = a.isLeader ? i[0].tier === a.tier ? "wave" : "tier" : "follow");
  const o = n.tiers.find((l) => l.tier === a.tier)?.waves.find((l) => l.wave === a.wave);
  return r.selected = o?.selectedRevision ? o.selectedRevision.slice(0, 7) : null, r;
}
function Ii(e) {
  const t = {
    promotion: /* @__PURE__ */ new Map(),
    dependency: /* @__PURE__ */ new Map(),
    schedule: /* @__PURE__ */ new Map(),
    owners: /* @__PURE__ */ new Map(),
    pretty: /* @__PURE__ */ new Map(),
    // ⛔ `!= null` AND NOT A TRUTHINESS TEST. `{ items: [] }` is a source we
    // consulted and found empty; `null` is a source that was never served.
    // Collapsing the two is exactly how "no join matched" became "a person
    // must approve it".
    sources: {
      environments: e?.environments != null,
      dependencies: e?.rolloutDependencies != null
    },
    // Schedules are never part of THIS payload — they land through
    // `withSchedules`, a separate, later request. See that field's own
    // doc comment on `GateContext`.
    schedulesLoaded: !1,
    schedulesExpected: e.schedulesExpected ?? !0
  };
  for (const s of e?.rolloutGates?.items ?? []) {
    const r = s?.metadata?.name;
    if (!r) continue;
    const i = (s?.metadata?.ownerReferences ?? []).find((l) => l?.controller === !0), o = Nc(s?.metadata);
    o && t.pretty.set(jn(s?.metadata?.namespace, r), o), t.owners.set(jn(s?.metadata?.namespace, r), {
      kind: i?.kind ?? null,
      name: i?.name ?? null
    });
  }
  const n = e?.environments?.items ?? [], a = fr(n);
  for (const s of n) {
    const r = s?.status?.rolloutGateRef?.name;
    r && t.promotion.set(jn(s?.metadata?.namespace, r), Ih(s, a));
  }
  for (const s of e?.rolloutDependencies?.items ?? []) {
    const r = s?.status?.gateName;
    if (!r) continue;
    const i = [
      ...new Set(
        (s?.status?.blockedReleases ?? []).map((o) => o?.requiredVersion).filter(Boolean)
      )
    ];
    t.dependency.set(jn(s?.metadata?.namespace, r), {
      provider: s?.spec?.providerRef?.name ?? "another service",
      contract: s?.spec?.contract ?? "dependency",
      providedVersion: s?.status?.providedVersion ?? null,
      requiredVersion: i.length === 1 ? i[0] : null
    });
  }
  return t;
}
function ni(e, t, n) {
  const a = {
    ...e,
    schedule: new Map(e.schedule),
    schedulesLoaded: !0
  };
  for (const s of n ?? []) {
    const r = s?.status?.active === !0, i = s?.spec?.action;
    if (!(i === "Allow" && !r || i === "Deny" && r)) continue;
    const l = Fh(s?.metadata) || s?.metadata?.name || "a deploy window";
    for (const c of s?.status?.managedGates ?? [])
      a.schedule.set(jn(t, c), {
        label: l,
        nextTransition: s?.status?.nextTransition ?? null,
        // ⭐ P2, operator-walk finding — see `ClassifiedGate.timezone`'s
        // own comment. The schedule's IANA zone, carried through so the
        // gate's clause can be formatted against IT, not the reader's.
        timezone: s?.spec?.timezone ?? null
      });
  }
  return a;
}
const tn = (e) => e ? e.slice(0, 7) : "";
function ai(e, t, n) {
  return e === dr && t !== n ? t : e;
}
function Ph(e, t, n) {
  const a = { clearsAt: null, timezone: null, ...Ot };
  switch (t.kind) {
    case "member": {
      const s = ai(t.site, t.tier, n), r = tn(t.rev);
      if (t.what === "selection")
        return {
          id: e,
          kind: "promotion",
          clears: "upstream",
          label: "after " + s + " picks",
          clause: s + " picks a build",
          short: "Waiting for " + s + " to pick a build",
          ...a,
          subject: s,
          subjectKind: "environment",
          predicate: "picks a build"
        };
      if (t.outcome) {
        const o = t.outcome === "failed" ? "failed" : "was cancelled", l = s + "'s check " + o + (r ? " on " + r : "");
        return {
          id: e,
          kind: "promotion",
          clears: "upstream",
          label: s + " is " + (St("failed") ?? "failing").toLowerCase(),
          clause: l,
          short: l,
          ...a,
          subject: s,
          subjectKind: "environment",
          predicate: "check " + o
        };
      }
      const i = "finish " + (St("checking") ?? "checking").toLowerCase() + " " + (r || "the build");
      return {
        id: e,
        kind: "promotion",
        clears: "upstream",
        label: s + " is " + (St("checking") ?? "checking").toLowerCase(),
        clause: s + " to " + i,
        short: "Waiting for " + s + " to " + i,
        ...a,
        subject: s,
        subjectKind: "environment",
        predicate: "to " + i
      };
    }
    case "noSites":
      return {
        id: e,
        kind: "promotion",
        clears: "person",
        label: t.tier + " has no sites",
        clause: "a site registers in " + t.tier,
        short: "Waiting for a site to register in " + t.tier,
        ...a
      };
    case "candidate":
      return {
        id: e,
        kind: "promotion",
        clears: "upstream",
        label: "waiting for " + tn(t.rev),
        clause: tn(t.rev) + " is available on this cluster",
        short: "Waiting for " + tn(t.rev) + " to become available on this cluster",
        ...a
      };
    case "pinned":
      return {
        id: e,
        kind: "promotion",
        clears: "person",
        label: "pinned to " + tn(t.pinned),
        clause: "the pin on " + tn(t.pinned) + " is cleared",
        short: "Pinned to " + tn(t.pinned) + ", the wave selected " + tn(t.selected),
        ...a
      };
    case "gap": {
      let s;
      if (t.missing.length > 0) {
        const r = t.missing.length;
        s = t.tier + " has no wave" + (r === 1 ? " " : "s ") + t.missing.join(", ");
      } else
        s = t.tier + " waves start at " + (t.waves.length ? Math.min(...t.waves) : "?") + ", not 1";
      return {
        id: e,
        kind: "promotion",
        clears: "person",
        label: s,
        clause: s + " (fix the wave numbers)",
        short: s,
        ...a
      };
    }
    case "lockstep": {
      const s = ai(t.site, t.tier, n), r = tn(t.rev);
      return {
        id: e,
        kind: "promotion",
        clears: "upstream",
        label: "lockstep with " + s,
        clause: "lockstep: " + s + " finishes " + r,
        short: "Lockstep: waiting for " + s + " to finish " + r,
        ...a,
        subject: s,
        subjectKind: "environment",
        predicate: "to finish " + r
      };
    }
    case "duplicate": {
      const s = t.owner, r = (s.cluster ? s.cluster + "/" : "") + (s.namespace ? s.namespace + "/" : "") + s.name, i = "Held: another Environment, " + r + ", owns site " + t.site + " of " + t.tier;
      return {
        id: e,
        kind: "promotion",
        clears: "person",
        label: "duplicate site " + t.site,
        clause: r + " gives up site " + t.site + " of " + t.tier + ", or this Environment is annotated environments.kuberik.com/take-over-site=true to take it over",
        short: i + ". Annotate this Environment with environments.kuberik.com/take-over-site=true to take it over.",
        ...a
      };
    }
    case "selfUpstream":
      return {
        id: e,
        kind: "promotion",
        clears: "person",
        label: t.tier + " is its own upstream",
        clause: t.tier + " stops being its own upstream",
        short: t.tier + " is its own upstream",
        ...a
      };
    case "aliasTier": {
      const s = t.names.join(", ").replace(/, ([^,]*)$/, " and $1") + " are the same tier (" + t.tier + ")";
      return {
        id: e,
        kind: "promotion",
        clears: "person",
        label: s,
        clause: "one name is used per tier (split with sites and waves)",
        short: s + ". Use one name per tier; split with sites and waves.",
        ...a
      };
    }
    case "unknownTier": {
      const s = t.name + " is not a known tier";
      return {
        id: e,
        kind: "promotion",
        clears: "person",
        label: s,
        clause: t.name + " is renamed to dev, test, staging or prod",
        short: s + ". Use dev, test, staging or prod.",
        ...a
      };
    }
    case "unparsed":
    default:
      return {
        id: e,
        kind: "promotion",
        clears: "unknown",
        label: t.raw || t.reason,
        clause: t.raw || t.reason,
        short: t.raw || t.reason,
        ...a
      };
  }
}
function jh(e, t) {
  switch (e.kind) {
    case "duplicate":
      return { headline: "Site " + e.site + " of " + e.tier + " is owned by another Environment", fault: !0 };
    case "gap":
    case "selfUpstream":
      return { headline: t.short, fault: !0 };
    case "aliasTier":
    case "unknownTier":
      return { headline: t.label, fault: !0 };
    case "pinned":
    case "noSites":
      return { headline: t.short };
    default:
      return {};
  }
}
function Wh(e, t) {
  const n = t.ready && t.ready.ready === !1 ? t.ready.blocker : null;
  if (n) {
    const l = n.kind === "member" || n.kind === "lockstep" ? n.tier : n.kind === "candidate" ? t.tier : null, c = Ph(e, n, t.tier);
    return { ...c, ...jh(n, c), upstreamTier: l };
  }
  const a = { id: e, kind: "promotion", clears: "upstream", clearsAt: null, timezone: null }, s = t.upstreamSites.map((l) => ai(l, t.upstreamTier ?? "", t.tier));
  if (t.via === "follow") {
    const l = s[0] ?? t.site, c = t.selected ? " (" + t.selected + ")" : "";
    return {
      ...a,
      upstreamTier: t.tier,
      label: "follows " + l + "'s pick" + c,
      clause: t.selected ? l + "'s pick (" + t.selected + ") reaches it" : l + " picks a build",
      short: t.selected ? "Following " + l + "'s pick (" + t.selected + ")" : "Waiting for " + l + " to pick a build",
      ...Ot,
      subject: l,
      subjectKind: "environment",
      predicate: t.selected ? "pick (" + t.selected + ") reaches it" : "picks a build"
    };
  }
  let r = null;
  t.via === "wave" ? r = "wave " + t.upstreamWave + " (" + s.join(", ") + ")" : t.via === "tier" && (r = t.upstreamTier);
  const i = r ?? "its upstream environment", o = r ? "deploys it first" : "deploys this build";
  return {
    ...a,
    upstreamTier: t.via === "wave" ? t.tier : t.upstreamTier,
    label: r ? "after " + r : "after its upstream environment",
    clause: i + " " + o,
    short: r ? "Waiting for " + r + " to deploy it first" : "Waiting for its upstream environment to deploy this build",
    ...Ot,
    subject: i,
    subjectKind: "environment",
    predicate: o
  };
}
function mr(e, t, n = Va) {
  const a = Bh(e, t, n), s = e?.name ?? "a rule";
  return { ...a, displayName: Fi(s, n.pretty?.get(jn(t, s)) ?? null) };
}
function Bh(e, t, n = Va) {
  const a = e?.name ?? "a rule", s = jn(t, a), r = n.promotion.get(s);
  if (r) return Wh(a, r);
  const i = n.dependency.get(s);
  if (i) {
    const u = i.requiredVersion ? `${i.contract} ${i.requiredVersion}` : null, f = i.providedVersion ? " — it is on " + i.providedVersion : "";
    return {
      id: a,
      kind: "dependency",
      clears: "upstream",
      label: `depends on ${i.provider}`,
      // ⚠️ NOT the "— it is on X" aside in `clause` — it is the terse
      // form `joinClauses` strings several gates' worth of together
      // into one sentence (the consequence line); the aside stays in
      // `short`, the one-gate-at-a-time form, same as before this fix.
      clause: u ? `${i.provider} ships ${u}` : i.providedVersion ? `${i.provider} ships a newer ${i.contract} than ${i.providedVersion}` : `${i.provider} ships a newer ${i.contract}`,
      short: u ? `Waiting for ${i.provider} to ship ${u}${f}` : i.providedVersion ? `Waiting for ${i.provider} to ship a newer ${i.contract} — it is on ${i.providedVersion}` : `Waiting for ${i.provider} to ship a newer ${i.contract}`,
      clearsAt: null,
      timezone: null,
      ...Ot,
      // THE ONE GATE KIND WITH AN OBVIOUS SHAPE: a provider, a contract, the
      // version it serves, and the range the held build asks for. Drawn as a
      // relation; the `predicate` is the fallback for a surface that has no
      // room, and for a dependency whose two versions are not both known.
      subject: i.provider,
      subjectKind: "service",
      predicate: u ? `ships ${u}` : `ships a newer ${i.contract}`,
      contract: i.contract,
      have: i.providedVersion,
      need: i.requiredVersion
    };
  }
  if (!Array.isArray(e?.allowedVersions)) {
    const u = n.schedule.get(s);
    return u ? {
      id: a,
      kind: "schedule",
      clears: "clock",
      label: u.label,
      clause: "the deploy window reopens",
      short: `Outside the ${u.label} deploy window`,
      clearsAt: u.nextTransition,
      timezone: u.timezone,
      ...Ot,
      // The window has a NAME and a REOPENING TIME, and both are already
      // carried on this object (`label`, `clearsAt`). Drawn, the row is
      // those two facts and nothing else: `Business Hours Only reopens in
      // 12h 59m` against the old `Outside the Business Hours Only deploy
      // window — reopens in 12h 59m (9/3/2026, 12:13:22 AM)`, which was
      // three wrapped lines in a 300px card for the same two facts. The
      // absolute instant moves into the record, where a `<dl>` row can
      // hold it without wrapping.
      //
      // ⛔ ONLY WHEN A TRANSITION IS PUBLISHED. `reopens in` with no clock
      // after it is a broken sentence, and the window's NAME on its own is
      // not a state — so with no `nextTransition` the drawing is off and
      // the surface falls back to `short`, which is complete on its own.
      subject: u.nextTransition ? u.label : null,
      subjectKind: u.nextTransition ? "schedule" : null,
      predicate: u.nextTransition ? "reopens in" : null
    } : {
      id: a,
      kind: "check",
      clears: "check",
      label: a,
      clause: "a check starts passing",
      short: "A check is not passing",
      clearsAt: null,
      timezone: null,
      // NOTHING TO DRAW, AND THAT IS THE HONEST ANSWER. A check names no
      // second party; the only concrete thing it carries is the gate's
      // generated id, which belongs in the disclosed tier. The row prints
      // `short`.
      ...Ot,
      pending: n.schedulesExpected && !n.schedulesLoaded
    };
  }
  const l = n.owners.get(s);
  if (l && l.kind) {
    const u = l.name ? `${l.kind} ${l.name}` : l.kind;
    return l.kind === "Environment" ? {
      id: a,
      kind: "promotion",
      clears: "upstream",
      label: "after its upstream environment",
      clause: "its upstream environment deploys this build",
      short: "Waiting for its upstream environment to deploy this build",
      clearsAt: null,
      timezone: null,
      ...Ot,
      subject: "its upstream environment",
      subjectKind: "environment",
      predicate: "deploys this build"
    } : l.kind === "RolloutDependency" ? {
      id: a,
      kind: "dependency",
      clears: "upstream",
      label: "depends on another service",
      clause: "the service it depends on ships a newer version",
      short: "Waiting for the service it depends on to ship a newer version",
      clearsAt: null,
      timezone: null,
      // ⛔ NOTHING TO DRAW. The owner reference proves a `RolloutDependency`
      // wrote this gate and proves nothing about WHICH provider or WHICH
      // contract — that join is exactly what this branch is the fallback
      // for. Drawing a nameless box would be inventing the object.
      ...Ot
    } : {
      id: a,
      kind: "unknown",
      clears: "unknown",
      label: u,
      clause: `${u} allows this build`,
      short: `Held by ${u}`,
      clearsAt: null,
      timezone: null,
      ...Ot
    };
  }
  const c = n.sources.environments && n.sources.dependencies;
  return l && l.kind === null || c ? {
    id: a,
    kind: "approval",
    clears: "person",
    label: a,
    clause: "someone approves it",
    short: "Waiting for someone to approve it",
    clearsAt: null,
    timezone: null,
    ...Ot
  } : {
    id: a,
    kind: "unknown",
    clears: "unknown",
    label: a,
    clause: `the rule ${a} allows this build`,
    short: `Held by ${a} — this dashboard cannot tell what clears it`,
    clearsAt: null,
    timezone: null,
    ...Ot
  };
}
const Lo = {
  blocked: !1,
  candidateCount: 0,
  pinnedTo: null,
  pinnedToDisplay: null,
  gates: [],
  person: [],
  clock: [],
  upstream: [],
  checks: [],
  unknown: [],
  clearsAt: null,
  selfClearing: !0,
  headline: "",
  consequence: "",
  verdict: "",
  resolution: "",
  severity: "info",
  // Never rendered — nothing is blocked, so no banner reads this — but a
  // concrete value beats leaving the one non-optional field on the type
  // without one where `NOT_BLOCKED` is spread as a base.
  iconKind: "check",
  kindPending: !1,
  // frozen: every spread of this constant would otherwise share one array
  candidates: Object.freeze([])
}, zh = ["no", "One", "Two", "Three", "Four", "Five", "Six"];
function Hh(e) {
  return zh[e] ?? String(e);
}
function Ea(e) {
  return e.length === 0 ? "" : e.length === 1 ? e[0] : `${e.slice(0, -1).join(", ")} and ${e[e.length - 1]}`;
}
function Vh(e) {
  const t = e.filter((i) => i.clears === "upstream"), n = t.some((i) => i.kind === "promotion"), a = t.filter((i) => i.kind === "dependency");
  if (a.length === 0)
    return "Nobody has to approve anything — this clears when the deploy in front of it lands.";
  const s = a.map((i) => {
    const o = i.subject ?? "the service it depends on";
    return i.contract ? i.need ? `ship ${i.contract} ${i.need} from ${o}` : `ship a newer ${i.contract} from ${o}` : i.need ? `ship ${i.need} from ${o}` : `ship a newer version from ${o}`;
  }), r = n ? ", then the deploy in front of it has to land" : "";
  return `No approval will unblock this. Someone has to ${Ea(s)}${r}; until then the only way forward is a hand-started deploy, which bypasses the check.`;
}
function Dc(e, t, n) {
  const a = e.find((r) => r.kind === "dependency" && r.subject);
  if (!a) return `${t} ${n} waiting on another deploy`;
  const s = a.contract ? a.need ? `ship ${a.contract} ${a.need}` : `ship a newer ${a.contract}` : a.need ? `ship ${a.need}` : "ship a newer version";
  return `${t} ${n} waiting for ${a.subject} to ${s}`;
}
function Uh(e, t, n, a, s) {
  if (e.length <= 1) return null;
  const r = e[0].clears;
  return e.every((i) => i.clears === r) ? r === "person" ? `${n} ${s} waiting on an approval` : r === "unknown" ? `Something is holding ${a}` : r === "upstream" ? Dc(t, n, s) : null : null;
}
function qh(e) {
  const t = e.filter((a) => a.kind === "dependency"), n = e.filter((a) => a.kind !== "dependency");
  return [...t, ...n];
}
function $n(e, t = Va, n = {}) {
  const a = e?.metadata?.namespace, s = ks(e), r = e?.spec?.wantedVersion ?? null, i = ws(e).length, o = n.place ? n.place : null, l = n.subject, c = typeof l == "object" && l !== null, u = c ? l.lead : l || o || "this service", f = c ? l.object ?? l.lead : u, p = c ? "are" : "is", v = n.now ?? /* @__PURE__ */ new Date();
  if (r) {
    const Z = vr(e, r) || r;
    return {
      ...Lo,
      candidates: [],
      blocked: i > 0,
      candidateCount: i,
      pinnedTo: r,
      pinnedToDisplay: Z,
      selfClearing: !1,
      // `info` (blue) — pinning is a STATE A PERSON CHOSE, not a rule
      // holding the rollout back. See the field's own doc comment (F2).
      severity: "info",
      headline: `${u} ${p} pinned to ${Z}`,
      consequence: i > 0 ? `${i} newer build${i === 1 ? "" : "s"} ${i === 1 ? "is" : "are"} available and none of them will deploy while the pin is set.` : "Automatic updates are off here until the pin is cleared.",
      verdict: "Clearing the pin is the only thing that restarts automatic deploys.",
      resolution: "Clearing the pin is the only thing that restarts automatic deploys.",
      iconKind: "pinned"
    };
  }
  const y = Fc(e, t, { contractHolds: n.contractHolds });
  if (!y.allHeld)
    return { ...Lo, candidateCount: i, candidates: y.perBuild };
  const b = s.blockingGates.length > 0 ? new Set(s.blockingGates) : new Set(y.held.flatMap((Z) => Z.gateNames)), g = (e?.status?.gates ?? []).filter((Z) => Z?.name && b.has(Z.name)).map((Z) => mr(Z, a, t)), h = y.held.flatMap((Z) => Z.contracts), x = g.filter(
    (Z) => !(Z.kind === "dependency" && !Z.subject && Oc(Z, h))
  ), m = new Set(
    x.filter((Z) => Z.kind === "dependency" && Z.subject).map((Z) => Z.subject)
  ), C = /* @__PURE__ */ new Map();
  for (const Z of y.held)
    for (const pe of Z.contracts) C.set(pe.provider, pe);
  const _ = [...C.values()].filter((Z) => !m.has(Z.provider)).map((Z) => Rc(Z)), A = [...x, ..._].sort((Z, pe) => {
    const he = { person: 0, unknown: 1, upstream: 2, check: 3, clock: 4 };
    return he[Z.clears] - he[pe.clears] || Z.id.localeCompare(pe.id);
  }), E = A.filter((Z) => Z.clears === "person"), S = A.filter((Z) => Z.clears === "unknown"), w = A.filter((Z) => Z.clears === "upstream"), L = A.filter((Z) => Z.clears === "clock"), k = A.filter((Z) => Z.clears === "check");
  let T = null;
  for (const Z of L)
    Z.clearsAt && (!T || new Date(Z.clearsAt) < new Date(T)) && (T = Z.clearsAt);
  const F = E.length === 0 && w.length === 0 && S.length === 0;
  let z;
  const j = Uh(A, w, u, f, p);
  j ? z = j : A.length > 1 ? z = `${Hh(A.length)} things are holding ${f}` : A.length === 1 && A[0].headline ? z = A[0].headline : E.length === 1 ? z = `${u} ${p} waiting on an approval` : S.length === 1 ? z = `Something is holding ${f}` : w.length === 1 ? z = Dc(w, u, p) : z = `${u} ${p} held`;
  const D = [];
  for (const Z of E) D.push(Z.clause);
  for (const Z of S) D.push(Z.clause);
  for (const Z of qh(w)) D.push(Z.clause);
  for (const Z of k) D.push(Z.clause);
  for (const Z of L) {
    const pe = Z.clearsAt ? Th(Z.clearsAt, v) : null;
    D.push(
      pe ? `${Z.clause} in ${pe} — ${Mh(Z.clearsAt)}` : Z.clause
    );
  }
  const H = gh(y, n.place, n.skipped), te = H.held.length, ae = H.waiting.find((Z) => Z.stage)?.stage ?? null, se = H.skipped[0]?.stage ?? null, G = (Z) => `build${Z === 1 ? "" : "s"}`, X = H.waiting.length, re = H.skipped.length, U = `${i > 0 ? te > 0 && te < i && (ae || se) ? `${te} newer ${G(te)} ${te === 1 ? "is" : "are"} waiting here` + (X > 0 && ae ? `; ${X} more ${X === 1 ? "hasn't" : "haven't"} reached ${ae} yet` : "") + (re > 0 && se ? `; ${re} ${re === 1 ? "was" : "were"} skipped by ${se}, which runs a newer ${G(1)}` : "") + ". " : `${i} newer build${i === 1 ? "" : "s"} ${i === 1 ? "is" : "are"} waiting. ` : ""}Nothing promotes itself until ${Ea(D)}.`, Y = "A deploy you start by hand still applies immediately.";
  let J, Q = !1;
  E.length > 0 ? J = "This will not clear on its own." : S.length > 0 ? J = "This dashboard cannot tell what clears this — it may or may not need a person." : w.length > 0 ? (J = Vh(w), Q = w.some((Z) => Z.kind === "dependency")) : T ? J = "This clears on its own." : J = "This clears on its own once the check passes.";
  const ee = Q ? J : `${J} ${Y}`;
  let ce = E.length > 0 ? "person" : S.length > 0 ? "unknown" : w.length > 0 ? w[0].kind === "dependency" ? "dependency" : "promotion" : L.length > 0 ? "clock" : "check";
  const de = k.some((Z) => Z.pending);
  return ce === "check" && de && (ce = "pending"), {
    blocked: !0,
    candidateCount: i,
    pinnedTo: null,
    pinnedToDisplay: null,
    gates: A,
    person: E,
    clock: L,
    upstream: w,
    checks: k,
    unknown: S,
    clearsAt: T,
    selfClearing: F,
    headline: z,
    consequence: U,
    verdict: J,
    resolution: ee,
    // ⭐ ALWAYS `warning` HERE. See the field's own doc comment (F2,
    // 2026-09-03): every gate this branch can hold on — person, unknown,
    // upstream, clock, check — is a RULE, not a choice, whether or not it
    // clears on its own. `selfClearing` answers "does this need a
    // person", a different question this field no longer conflates with
    // colour.
    severity: A.some((Z) => Z.fault) ? "error" : "warning",
    iconKind: ce,
    kindPending: de,
    candidates: y.perBuild
  };
}
function Fc(e, t = Va, n = {}) {
  const a = e?.metadata?.namespace, s = ws(e), r = e?.status?.gates ?? [], i = n.contractHolds, o = s.map((f) => {
    const p = f.tag ?? f.version ?? "", v = vr(e, p) || p, y = Yh(e, p || null), b = new Set(y), g = [...i?.get(v) ?? []], h = r.filter((A) => A?.name && b.has(A.name)).map((A) => mr(A, a, t)).filter((A) => !Oc(A, g)), x = [...new Set(h.map((A) => A.clause))], m = new Set(
      h.filter((A) => A.kind === "dependency" && A.subject).map((A) => A.subject)
    ), C = g.filter((A) => !m.has(A.provider)).map((A) => Rc(A)), _ = [...h, ...C];
    return { build: v, tag: p, gateNames: y, clauses: x, contract: g[0], contracts: g, classifiedGates: _ };
  }), l = o.filter((f) => f.gateNames.length > 0 || f.contracts.length > 0), c = o.filter((f) => f.gateNames.length === 0 && f.contracts.length === 0).map((f) => f.build), u = s.length > 0 && c.length === 0 && l.length > 0;
  return l.length === 0 ? { held: [], deployable: c, anyHeld: !1, allHeld: !1, perBuild: o } : { held: l, deployable: c, anyHeld: !0, allHeld: u, perBuild: o };
}
function Gh(e, t = {}) {
  const n = t.place ?? "this service";
  if ("gates" in e) {
    if (!e.blocked) return null;
    if (e.gates.length === 1 && e.gates[0].headline) return e.gates[0].headline;
    if (e.person.length > 0) return `${n} is waiting on an approval`;
    if (e.unknown.length > 0) return `${n} is waiting on a rule this dashboard cannot attribute`;
    const s = e.upstream.filter((r) => r.kind === "dependency" && r.subject);
    if (s.length > 0) {
      const r = s.map((i) => {
        const o = i.need ? ` ${i.need}` : "";
        return `${i.subject}${o}`;
      });
      return `${n} is waiting for ${Ea(r)}`;
    }
    return e.upstream.some((r) => r.kind === "promotion") ? `${n} is waiting on promotion order` : `${n} is held`;
  }
  const a = e.held.find((s) => s.contracts.length > 0) ?? e.held[0];
  if (!a) return null;
  if (a.contracts.length > 0) {
    const s = a.contracts.map((r) => {
      const i = r.required ? ` ${r.required}` : "";
      return `${r.provider}${i}`;
    });
    return `${n} is waiting for ${Ea(s)}`;
  }
  return a.gateNames.length > 0 ? `${n} is waiting on promotion order` : `${n} is held`;
}
const Kh = 1440 * 60 * 1e3;
function La(e) {
  const t = e?.status;
  if (!t) return null;
  const n = t.history?.[0] ? ge(t.history[0].version) : null, a = Array.isArray(t.availableReleases) ? t.availableReleases : null;
  if (a && n !== null) {
    const s = a.findIndex((r) => ge(r) === n);
    return s === -1 ? null : Array.isArray(t.releaseCandidates) ? t.releaseCandidates.length : a.length - 1 - s;
  }
  return Array.isArray(t.releaseCandidates) ? t.releaseCandidates.length : null;
}
function Ic(e) {
  const t = e?.status;
  if (!t) return null;
  if (Array.isArray(t.releaseCandidates))
    return t.releaseCandidates[0] ?? null;
  const n = La(e);
  return n && n > 0 && Array.isArray(t.availableReleases) ? t.availableReleases[t.availableReleases.length - 1] ?? null : null;
}
function ka(e, t) {
  return Array.isArray(e.allowedVersions) ? e.allowedVersions.includes(t) : e.passing !== !1;
}
function Yh(e, t) {
  return t ? (e?.status?.gates ?? []).filter((n) => n?.name && !ka(n, t)).map((n) => n.name) : [];
}
function Ds(e) {
  return e.tag ?? e.version ?? e.revision ?? "";
}
function ws(e) {
  const t = e?.status;
  if (!t) return [];
  if (La(e) === null) return [];
  if (Array.isArray(t.releaseCandidates)) return t.releaseCandidates;
  const n = La(e);
  if (n && n > 0 && Array.isArray(t.availableReleases) && t.history?.[0]) {
    const a = ge(t.history[0].version), s = t.availableReleases.findIndex((r) => ge(r) === a);
    return s >= 0 ? t.availableReleases.slice(s + 1).reverse() : [];
  }
  return [];
}
function $h(e, t) {
  const n = (e?.status?.gates ?? []).find((a) => a?.name === t);
  return n ? ws(e).filter((a) => !ka(n, Ds(a))) : [];
}
function ks(e) {
  const t = e?.status, n = {
    candidateCount: 0,
    deployableCount: 0,
    blocked: !1,
    blockingGates: [],
    awaitingApprovalGates: [],
    notPassingGates: []
  };
  if (!t) return n;
  const a = ws(e);
  if (a.length === 0) return n;
  const s = t.gates ?? [], r = a.filter(
    (p) => s.every((v) => ka(v, Ds(p)))
  ).length, i = a.length > 0 && r === 0, o = s.filter(
    (p) => a.every((v) => !ka(p, Ds(v)))
  );
  let l = o.map((p) => p.name).sort(), c = o;
  if (i && l.length === 0) {
    const p = Ic(e), v = p ? Ds(p) : null;
    v && (c = s.filter((y) => !ka(y, v)), l = c.map((y) => y.name).sort());
  }
  const u = c.filter((p) => Array.isArray(p.allowedVersions)).map((p) => p.name).sort(), f = c.filter((p) => !Array.isArray(p.allowedVersions)).map((p) => p.name).sort();
  return {
    candidateCount: a.length,
    deployableCount: r,
    blocked: i,
    blockingGates: l,
    awaitingApprovalGates: u,
    notPassingGates: f
  };
}
function Pi(e, t, n) {
  if (!t.blocked) return !1;
  const a = e?.metadata?.namespace, s = n ?? Va, r = new Set(t.blockingGates);
  return (e?.status?.gates ?? []).filter((i) => i?.name && r.has(i.name)).map((i) => mr(i, a, s)).some((i) => i.clears === "person" || i.clears === "unknown");
}
function Qh(e, t) {
  if (e?.spec?.wantedVersion) return null;
  const n = ks(e);
  if (n.candidateCount === 0 || n.blocked && !Pi(e, n, t?.gateContext))
    return null;
  const a = t?.now ?? /* @__PURE__ */ new Date(), s = t?.thresholdMs ?? Kh;
  let i = Ic(e)?.created;
  if (i || (i = e?.status?.history?.[0]?.timestamp), !i) return null;
  const o = new Date(i).getTime();
  if (Number.isNaN(o)) return null;
  const l = a.getTime() - o;
  return l <= s ? null : {
    kind: "promotion",
    candidateCount: n.candidateCount,
    waitingMs: l,
    blockingGates: n.blockingGates
  };
}
function Pc(e, t) {
  if (!e || !t) return null;
  const n = e.status?.history ?? [], a = t.status?.history ?? [], s = n[0] ? ge(n[0].version) : null, r = a[0] ? ge(a[0].version) : null;
  if (!s || !r) return null;
  if (s === r) return { kind: "same" };
  const i = Zh(e, t, s, r);
  if (i) return i;
  const o = a.slice(1).some((c) => ge(c.version) === s), l = n.slice(1).some((c) => ge(c.version) === r);
  if (o && !l) {
    const c = [];
    for (const f of a) {
      const p = ge(f.version);
      if (c[c.length - 1] !== p && c.push(p), p === s) break;
    }
    const u = c.indexOf(s);
    return { kind: "behind", otherVersion: r, by: u >= 0 ? u : null };
  }
  if (l && !o) {
    const c = [];
    for (const f of n) {
      const p = ge(f.version);
      if (c[c.length - 1] !== p && c.push(p), p === r) break;
    }
    const u = c.indexOf(r);
    return { kind: "ahead", otherVersion: r, by: u >= 0 ? u : null };
  }
  return { kind: "divergent", otherVersion: r };
}
function Zh(e, t, n, a) {
  for (const s of [e, t]) {
    const r = s.status?.availableReleases;
    if (!Array.isArray(r) || r.length === 0) continue;
    const i = r.findIndex((l) => ge(l) === n), o = r.findIndex((l) => ge(l) === a);
    if (!(i === -1 || o === -1))
      return i === o ? { kind: "same" } : i < o ? { kind: "behind", otherVersion: a, by: o - i } : { kind: "ahead", otherVersion: a, by: i - o };
  }
  return null;
}
function Xh(e, t = {}) {
  if (!e) return null;
  const n = t.now ?? /* @__PURE__ */ new Date(), a = t.bakeThresholdMs ?? 3600 * 1e3, s = e.status?.history?.[0];
  if (!s || !s.timestamp) return null;
  const r = n.getTime() - new Date(s.timestamp).getTime();
  return s.bakeStatus === "InProgress" && r > a ? { kind: "baking", durationMs: r } : s.bakeStatus === "Deploying" && r > a ? { kind: "deploying", durationMs: r } : null;
}
function Jh(e, t, n, a = {}) {
  if (!e || !t || e.spec?.wantedVersion) return null;
  const s = Pc(e, t);
  if (!s || s.kind !== "behind") return null;
  const r = ks(e);
  if (r.blocked && !Pi(e, r, a.gateContext))
    return null;
  const i = a.now ?? /* @__PURE__ */ new Date(), o = a.thresholdMs ?? 1440 * 60 * 1e3, l = t.status?.history?.[0]?.timestamp;
  if (!l) return null;
  const c = i.getTime() - new Date(l).getTime();
  return c < o ? null : { kind: "behind", peerEnv: n, peerAdvancedMs: c, behindBy: s.by };
}
function ji(e) {
  if (!e) return null;
  const t = e.toLowerCase();
  return /health.?check|liveness|readiness|alert|firing|error.?rate/.test(t) ? "healthcheck" : /image.?pull|cannot pull|registry|pullbackoff|errimagepull|imagepullbackoff/.test(t) ? "image" : /gate/.test(t) ? "gate" : /test/.test(t) ? "test" : /timeout|timed out|deadline/.test(t) ? "timeout" : /canary|kruise/.test(t) ? "canary" : /manifest|render|kustom|invalid yaml|invalid spec/.test(t) ? "manifest" : /permission|forbidden|unauthorized|rbac/.test(t) ? "permission" : /crashloop|oom|killed/.test(t) ? "crash" : /network|dial|connection refused|unreachable/.test(t) ? "network" : "failed";
}
function jc(e) {
  return ji(e) === "healthcheck" ? "healthcheck" : "deploy";
}
function _s(e, t = /* @__PURE__ */ new Date()) {
  const n = new Date(e), a = Math.max(0, Math.floor((t.getTime() - n.getTime()) / 1e3));
  if (a < 60) return `${a}s`;
  const s = Math.floor(a / 60);
  if (s < 60) return `${s}m`;
  const r = Math.floor(s / 60);
  if (r < 24) return `${r}h`;
  const i = Math.floor(r / 24);
  if (i < 90) return `${i}d`;
  const o = Math.floor(i / 30);
  return o < 12 ? `${o}mo` : `${Math.floor(o / 12)}y`;
}
const em = {
  ns: 1e-6,
  us: 1e-3,
  µs: 1e-3,
  μs: 1e-3,
  ms: 1,
  s: 1e3,
  m: 6e4,
  h: 36e5
};
function Wi(e) {
  if (!e) return 0;
  const t = /(\d+(?:\.\d+)?)(ns|us|µs|μs|ms|h|m|s)/g;
  let n = 0, a;
  for (; a = t.exec(e); ) n += parseFloat(a[1]) * em[a[2]];
  return n;
}
function ge(e) {
  return e.version || e.revision || e.tag;
}
function yt(e) {
  if (!e) return e ?? "";
  if (/^[0-9a-f]{40}$/i.test(e)) return e.slice(0, 7);
  const t = e.match(/^(.+-)([0-9a-f]{12,})$/i);
  return t ? t[1] + t[2].slice(0, 7) : e;
}
function Bi(e) {
  if (!e) return 0;
  if (Array.isArray(e.releaseCandidates)) return e.releaseCandidates.length;
  const t = e.availableReleases ?? [], n = t.findIndex((a) => a.tag === e.currentVersion || a.version === e.currentVersion);
  return n < 0 ? 0 : t.length - 1 - n;
}
function tm(e, t) {
  const n = e?.status;
  return n && Array.isArray(n.releaseCandidates) ? n.releaseCandidates.length : t ? hr(t) : Bi(n);
}
const nm = /* @__PURE__ */ new Set(["dev", "development", "test", "testing", "qa", "staging", "stage", "preprod", "prod", "production", "default"]), zi = (e) => {
  const t = (e ?? "").trim().toLowerCase();
  return !t || nm.has(t) ? "default" : t;
};
function Ua(e) {
  return new Set(e.map(zi)).size;
}
function Wc(e, t = "") {
  return e > 1 ? `${e} ${t ? t + " " : ""}regions` : null;
}
function am(e, t) {
  const n = Ua(e) > 1 ? "regions" : "prod";
  return t ? `${t.length} of ${e.length} ${n}` : `${e.length} ${n}`;
}
const sm = /^HealthCheck '([^']+)' in namespace '[^']*' is not healthy \([^)]*\)(?::\s*(.*))?$/s;
function rm(e) {
  const t = sm.exec(e ?? "");
  return t ? { check: t[1] || null, detail: (t[2] ?? "").trim() || null } : { check: null, detail: null };
}
function im(e) {
  const t = (e?.status?.conditions ?? []).find((r) => r?.type === "DeploymentBlocked");
  if (!t || t.status !== "True") return null;
  const n = t.message ?? "", { check: a, detail: s } = rm(n);
  return { check: a, detail: s, raw: n, since: t.lastTransitionTime ?? null };
}
function om(e) {
  const t = e?.status?.history?.[0];
  if (!t?.timestamp) return null;
  const n = new Date(t.timestamp).getTime(), a = t.lastRetryTimestamp ? new Date(t.lastRetryTimestamp).getTime() : 0, s = Math.max(n, Number.isFinite(a) ? a : 0);
  return Number.isFinite(s) ? new Date(s) : null;
}
function lm(e, t) {
  const n = e?.status?.status;
  if (n === "Failed" || n === "Unhealthy") return "failing";
  if (n !== "Healthy") return "pending";
  const a = e?.status?.lastErrorTime;
  if (!a || !t) return "passing";
  const s = new Date(a).getTime();
  return Number.isFinite(s) && s >= t.getTime() ? "recovered" : "passing";
}
class Bc extends Map {
  /** @type {Map<K, Source<number>>} */
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ Ee(0);
  #n = /* @__PURE__ */ Ee(0);
  #a = fn || -1;
  /**
   * @param {Iterable<readonly [K, V]> | null | undefined} [value]
   */
  constructor(t) {
    if (super(), t) {
      for (var [n, a] of t)
        super.set(n, a);
      this.#n.v = super.size;
    }
  }
  /**
   * If the source is being created inside the same reaction as the SvelteMap instance,
   * we use `state` so that it will not be a dependency of the reaction. Otherwise we
   * use `source` so it will be.
   *
   * @template T
   * @param {T} value
   * @returns {Source<T>}
   */
  #r(t) {
    return fn === this.#a ? /* @__PURE__ */ Ee(t) : Rn(t);
  }
  /** @param {K} key */
  has(t) {
    var n = this.#e, a = n.get(t);
    if (a === void 0) {
      var s = super.get(t);
      if (s !== void 0)
        a = this.#r(0), n.set(t, a);
      else
        return d(this.#t), !1;
    }
    return d(a), !0;
  }
  /**
   * @param {(value: V, key: K, map: Map<K, V>) => void} callbackfn
   * @param {any} [this_arg]
   */
  forEach(t, n) {
    this.#s(), super.forEach(t, n);
  }
  /** @param {K} key */
  get(t) {
    var n = this.#e, a = n.get(t);
    if (a === void 0) {
      var s = super.get(t);
      if (s !== void 0)
        a = this.#r(0), n.set(t, a);
      else {
        d(this.#t);
        return;
      }
    }
    return d(a), super.get(t);
  }
  /**
   * @param {K} key
   * @param {V} value
   * */
  set(t, n) {
    var a = this.#e, s = a.get(t), r = super.get(t), i = super.set(t, n), o = this.#t;
    if (s === void 0)
      s = this.#r(0), a.set(t, s), me(this.#n, super.size), zt(o);
    else if (r !== n) {
      zt(s);
      var l = o.reactions === null ? null : new Set(o.reactions), c = l === null || !s.reactions?.every(
        (u) => (
          /** @type {NonNullable<typeof v_reactions>} */
          l.has(u)
        )
      );
      c && zt(o);
    }
    return i;
  }
  /** @param {K} key */
  delete(t) {
    var n = this.#e, a = n.get(t), s = super.delete(t);
    return a !== void 0 && (n.delete(t), me(this.#n, super.size), me(a, -1), zt(this.#t)), s;
  }
  clear() {
    if (super.size !== 0) {
      super.clear();
      var t = this.#e;
      me(this.#n, 0);
      for (var n of t.values())
        me(n, -1);
      zt(this.#t), t.clear();
    }
  }
  #s() {
    d(this.#t);
    var t = this.#e;
    if (this.#n.v !== t.size) {
      for (var n of super.keys())
        if (!t.has(n)) {
          var a = this.#r(0);
          t.set(n, a);
        }
    }
    for ([, a] of this.#e)
      d(a);
  }
  keys() {
    return d(this.#t), super.keys();
  }
  values() {
    return this.#s(), super.values();
  }
  entries() {
    return this.#s(), super.entries();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  get size() {
    return d(this.#n), super.size;
  }
}
const cm = new Bc(), um = (e, t, n) => `${e ?? ""}/${t ?? ""}/${n ?? ""}`, dm = (e) => {
  const t = e.split("/").filter(Boolean);
  return t[0] === "rollouts" && t.length >= 4 ? um(t[1], t[2], t[3]) : null;
}, fm = (e) => cm.get(e) ?? null, pm = new Bc(), vm = (e, t, n) => `${e}/${t}/${n}`, hm = (e, t, n) => pm.get(vm(e, t, n)) ?? null;
Pt({ disconnected: !1, pending: 0, settled: !1 });
const mm = 10;
function zc(e) {
  const t = e?.status?.history ?? [], n = e?.spec?.versionHistoryLimit ?? mm;
  return t.length >= n;
}
function Tr(e) {
  return e?.tag || e?.version || null;
}
function Hi(e) {
  const t = e?.status?.history ?? [], a = (e?.status?.availableReleases ?? []).map((s) => Tr(s));
  return t.map((s, r) => {
    const i = t[r + 1];
    if (!i)
      return zc(e) ? {
        kind: "unknown",
        word: "Unknown",
        sentence: `What ${ge(s.version)} replaced is unknown — it is the oldest deploy the retained history (last ${t.length}) still holds.`
      } : null;
    const o = Tr(s.version), l = Tr(i.version);
    if (!o || !l) return null;
    const c = ge(i.version), u = ge(s.version);
    if (o === l)
      return {
        kind: "redeploy",
        word: "Redeployed",
        sentence: `Redeployed the same release, ${u}.`
      };
    const f = a.indexOf(o), p = a.indexOf(l);
    if (f === -1 || p === -1) return null;
    const v = Math.abs(p - f), y = v === 1 ? "" : "s";
    return f < p ? {
      kind: "rollback",
      by: v,
      from: c,
      to: u,
      word: "Rolled back",
      sentence: `Rolled back ${v} release${y}: ${c} → ${u}.`
    } : {
      kind: "forward",
      by: v,
      from: c,
      to: u,
      word: "Moved forward",
      sentence: `Moved forward ${v} release${y}: ${c} → ${u}.`
    };
  });
}
function gm(e, t) {
  if (!(!e || !t?.avatarUrl || !t.login))
    return e.toLowerCase() === t.login.toLowerCase() ? t.avatarUrl : void 0;
}
const bm = () => null;
let No = /* @__PURE__ */ Ee({});
const si = {
  get: (e) => d(No)[e],
  set: (e) => {
    me(No, e);
  }
};
function Hc(e, t = {}) {
  const n = new URLSearchParams(t), a = n.size ? `${e}?${n}` : e;
  return si.get(a) ?? si.get(e) ?? null;
}
const wm = (e, t, n) => `/api/rollouts/${e}/${t}/commits`;
function km(e) {
  const t = e ?? void 0, n = t === "Succeeded" ? "ready" : t === "Failed" ? "failing" : t === "InProgress" ? "checking" : t === "Deploying" ? "deploying" : "unranked", a = t === "Succeeded" ? "deployed" : t === "Failed" ? "failed" : Gv(t);
  return { role: n, label: a, title: Kv(t) };
}
function _m(e) {
  return e.deployed > 0 && e.onHead === e.deployed;
}
function ym(e) {
  return e.deployed === 0;
}
function xm(e) {
  return ym(e) ? "Never deployed" : _m(e) ? "All on the newest" : `${e.onHead} of ${e.deployed} on the newest`;
}
function Vc(e, t, n = {}) {
  const a = Xh(e, { now: n.now, bakeThresholdMs: n.bakeThresholdMs });
  if (a) return a;
  const s = Qh(e, { now: n.now, gateContext: n.gateContext });
  if (s) return s;
  const r = ks(e);
  if (r.blocked && !Pi(e, r, n.gateContext))
    return null;
  for (const i of t) {
    const o = Jh(e, i.rollout, i.envName, {
      now: n.now,
      thresholdMs: n.behindThresholdMs,
      gateContext: n.gateContext
    });
    if (o) return o;
  }
  return null;
}
const ra = {
  failed: 0,
  stuck: 1,
  held: 2,
  deploying: 3,
  queued: 4,
  live: 5
};
function Uc(e) {
  return e.state === "gated" || e.state === "pinned" || e.state === "waiting-upstream" ? e.held ?? !0 : !1;
}
function Sm(e) {
  return e.state === "failed" || e.state === "rolled-back";
}
function Ro(e) {
  return Sm(e) ? ra.failed : e.stuck ? ra.stuck : Uc(e) ? ra.held : e.state === "live" || e.state === "not-built" ? ra.live : e.state === "queued" ? ra.queued : ra.deploying;
}
function qc(e) {
  return e.length === 0 ? null : e.reduce((t, n) => {
    const a = Ro(n.cell), s = Ro(t.cell);
    return a !== s ? a < s ? n : t : n.cell.envRank !== t.cell.envRank ? n.cell.envRank < t.cell.envRank ? n : t : n.cell.cluster.localeCompare(t.cell.cluster) < 0 ? n : t;
  });
}
function Es(e) {
  return e?.tag || e?.version || null;
}
function Cm(e) {
  const t = e?.status?.history ?? [], n = e?.status?.availableReleases ?? [];
  if (t.length < 2 || n.length === 0) return null;
  const a = Es(t[0]?.version), s = Es(t[1]?.version);
  if (!a || !s || a === s) return null;
  const r = n.findIndex((o) => Es(o) === a), i = n.findIndex((o) => Es(o) === s);
  return r === -1 || i === -1 || r >= i ? null : {
    from: ge(t[1].version),
    to: ge(t[0].version),
    by: i - r
  };
}
function Am(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of t) {
    const s = a.spec?.rolloutRef?.name;
    if (!s || !a.spec?.environment) continue;
    const r = Nn(a, t), i = e.find((o) => Ni(o, a));
    i && (n.has(s) || n.set(s, []), n.get(s).push({ envName: r, rollout: i }));
  }
  for (const a of n.values())
    a.sort((s, r) => Ci(s.envName, r.envName));
  return n;
}
function Tm(e, t, n) {
  if (e.spec?.wantedVersion) return null;
  const a = n.get(e.metadata?.name ?? "");
  if (!a || a.length < 2) return null;
  let s = null;
  for (const o of a) {
    if (o.envName === t) continue;
    const l = Pc(e, o.rollout);
    if (!l || l.kind !== "behind") continue;
    const c = { fromEnv: o.envName, version: l.otherVersion, behindBy: l.by };
    (!s || (c.behindBy ?? 0) > (s.behindBy ?? 0)) && (s = c);
  }
  const r = La(e);
  if (r === null || r === 0) return s;
  if (s) return { ...s, behindBy: r };
  let i = null;
  for (const o of a) {
    if (o.envName === t) continue;
    const l = La(o.rollout);
    if (l === null || l >= r) continue;
    const c = o.rollout.status?.history?.[0]?.version ? ge(o.rollout.status.history[0].version) : null;
    c && (!i || l < i.newer) && (i = { envName: o.envName, version: c, newer: l });
  }
  return i ? { fromEnv: i.envName, version: i.version, behindBy: r } : s;
}
function Mm(e, t, n, a, s) {
  const r = Am(e, t), i = ih(e, t);
  return e.map((o) => {
    const l = o.status?.history?.[0], c = t.find((E) => Ni(o, E)), u = cs(
      o,
      c,
      c?.spec?.environment ? Nn(c, t) : null
    ), f = l?.bakeStatus || "None", p = f === "InProgress" || f === "Deploying";
    let v;
    f === "Failed" ? v = "failed" : p ? v = "active" : l ? v = "succeeded" : v = "pending";
    const y = pr(u), b = c?.spec?.environment ? Nn(c, t) : "", g = i.get(o) ?? { kind: "unknown" }, h = b ? Tm(o, b, r) : null, x = h ? { ...h, behindBy: hr(g) } : null, m = (r.get(o.metadata?.name ?? "") ?? []).filter(
      (E) => E.envName !== b
    );
    let C = null;
    if (f === "Failed") {
      const E = l?.version ? ge(l.version) : null;
      for (const S of o.status?.history ?? []) {
        if (S.bakeStatus !== "Succeeded") continue;
        const w = ge(S.version);
        if (w && w !== E) {
          C = w;
          break;
        }
      }
    }
    const _ = s ? $n(o, a, { contractHolds: s(o), now: n }) : $n(o, a, { now: n }), A = Ac(_, b);
    return {
      ns: o.metadata?.namespace || "",
      name: o.metadata?.name || "",
      title: o.status?.title || o.metadata?.name || "",
      envKey: u?.name || "",
      envDisplay: y,
      envName: b,
      tier: c ? Ut(c.spec?.environment) : null,
      site: c ? qn(c) : null,
      wave: c ? Ai(c) : null,
      role: c ? Ti(c) : null,
      ready: c ? ls(c).ready : null,
      duplicateSite: c ? ls(c).blocker?.kind === "duplicate" : !1,
      theme: u,
      version: l?.version ? ge(l.version) : null,
      timestamp: l?.timestamp || null,
      bakeStatus: f,
      statusKey: v,
      isRunning: p,
      bakeStatusMessage: l?.bakeStatusMessage || null,
      failureCategory: f === "Failed" ? ji(l?.bakeStatusMessage) : null,
      previousSucceededVersion: C,
      pinnedVersion: o.spec?.wantedVersion || null,
      rolledBack: Cm(o),
      stuck: Vc(o, m, { now: n, gateContext: a }),
      checkFailure: im(o),
      rank: g,
      behind: x,
      held: A.held,
      heldCause: A.cause,
      // ⭐ qa12 (squad-rollout gates-2 follow-up, 2026-10-11): the
      // FRONTIER candidate's own label, never the whole-story blend
      // — `heldVerdict`'s own `.frontier.causeLabel` is read off ONLY
      // the eligible candidate's `classifiedGates`, which is what
      // keeps a newer chain-refused candidate's gate from naming the
      // cause for an OLDER candidate this environment really refuses.
      heldCauseLabel: A.held ? A.frontier?.causeLabel ?? null : null,
      waitsForEnv: A.waitsForEnv,
      waveWait: A.waveWait ?? null,
      rollout: o,
      sourceURL: wa(o),
      sourceCluster: Ma(o)
    };
  });
}
function Za(e, t, n) {
  const a = ["github.com", e, t].map(encodeURIComponent).join("/");
  return "number" in n ? Ks(`/changes/${a}/pull/${n.number}`) : Ks(`/changes/${a}/${encodeURIComponent(n.sha)}`);
}
const Em = /^rollout\.kuberik\.com\/substitute\.[^/]+\.from$/;
function Lm(e, t, n) {
  const a = e.metadata?.namespace, s = e.metadata?.name;
  if (!a || !s) return [];
  const r = wa(e), i = /* @__PURE__ */ new Set();
  for (const l of t) {
    if (l.metadata?.namespace !== a || wa(l) !== r) continue;
    const c = l.metadata?.annotations || {};
    if (!Object.entries(c).some(
      ([p, v]) => Em.test(p) && v === s
    )) continue;
    const f = l.status?.inventory?.entries ?? [];
    for (const p of f)
      typeof p?.id == "string" && p.id.endsWith("_rollouts.kruise.io_Rollout") && i.add(p.id);
  }
  if (i.size === 0) return [];
  const o = [];
  for (const l of n) {
    const c = l.metadata?.namespace, u = l.metadata?.name;
    !c || !u || wa(l) === r && i.has(`${c}_${u}_rollouts.kruise.io_Rollout`) && o.push(l);
  }
  return o;
}
function Gc(e, t) {
  const n = t?.status?.history?.[0];
  if (!n || n.bakeStatus !== "Deploying" || !n.timestamp) return !1;
  const a = e.status?.canaryStatus?.lastUpdateTime;
  if (!a) return !1;
  const s = Date.parse(a), r = Date.parse(n.timestamp);
  return Number.isFinite(s) && Number.isFinite(r) && s < r;
}
function Nm(e, t) {
  if (t && Gc(e, t))
    return (e.spec?.strategy?.canary?.steps ?? []).map(() => "pending");
  const n = e.spec?.strategy?.canary?.steps ?? [], a = e.status?.canaryStatus?.currentStepIndex, s = e.status?.canaryStatus?.currentStepState, r = e.status?.conditions ?? [], i = r.some((u) => u.type === "Stalled" && u.status === "True"), o = r.some(
    (u) => u.type === "KuberikBakeHealthy" && u.status === "False"
  ), l = s === "Completed", c = [];
  for (let u = 0; u < n.length; u++) {
    const f = u + 1, p = a === f;
    l || a !== void 0 && f < a ? c.push("done") : p && (i || o) ? c.push("fail") : p ? c.push("active") : c.push("pending");
  }
  return c;
}
function Rm(e, t) {
  return t && Gc(e, t) ? !1 : e.status?.canaryStatus?.currentStepState === "Completed";
}
function Om(e, t) {
  const n = e.status?.history?.[0]?.bakeStatus || "None";
  if (t.length === 0) {
    const [i, o] = Dm(e);
    return { tracks: [{ name: "", stages: [i] }], bake: o };
  }
  const a = t.every((i) => Rm(i, e));
  let s = "pending";
  return a && (n === "Succeeded" ? s = "done" : n === "Failed" ? s = "fail" : n === "InProgress" || n === "Deploying" ? s = "active" : n === "Cancelled" && (s = "cancelled")), { tracks: t.map((i) => ({
    name: i.metadata?.name ?? "",
    stages: Nm(i, e)
  })), bake: s };
}
function Dm(e) {
  const t = e.status?.history?.[0], n = t?.bakeStatus || "None";
  if (n === "Succeeded") return ["done", "done"];
  if (n === "InProgress") return ["done", "active"];
  if (n === "Deploying") return ["active", "pending"];
  if (n === "Cancelled") return ["done", "cancelled"];
  if (n === "Failed") {
    const a = ji(t?.bakeStatusMessage);
    return a === "test" || a === "image" ? ["fail", "pending"] : ["done", "fail"];
  }
  return ["pending", "pending"];
}
const Gn = ["dev", "test", "staging", "other", "prod"];
function dt(e) {
  const t = Ut(e);
  if (t) return t;
  const n = Qt(e);
  return n <= 1 ? "dev" : n <= 3 ? "test" : n <= 5 ? "staging" : n === 6 ? "other" : "prod";
}
const tt = [
  "failed",
  "stuck",
  "held",
  "deploying",
  "checking",
  "behind",
  "newest",
  "none"
];
function _a(e) {
  return e.statusKey === "failed" || e.checkFailure != null ? "failed" : e.stuck != null ? "stuck" : e.bakeStatus === "Deploying" ? "deploying" : e.bakeStatus === "InProgress" ? "checking" : e.statusKey === "pending" || e.bakeStatus === "None" ? "none" : Oi(e) ? "held" : hr(e.rank) > 0 || e.rank.kind === "diverged" ? "behind" : "newest";
}
function Fm(e) {
  const t = pr(e.theme) || e.envName || e.envDisplay || "";
  return {
    card: e,
    tier: dt(e.envName || t),
    env: t,
    state: _a(e),
    behind: tm(e.rollout, e.rank)
  };
}
function Im(e) {
  let t = null;
  for (const n of e)
    (!t || tt.indexOf(n.state) < tt.indexOf(t.state)) && (t = n);
  return t;
}
function Ys(e) {
  return !!(e.envName || pr(e.theme));
}
function Kc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e) {
    if (!Ys(a) || a.duplicateSite) continue;
    const s = t.get(a.name) ?? [];
    s.push(a), t.set(a.name, s);
  }
  const n = [];
  for (const [a, s] of t) {
    const r = s.map(Fm), i = {};
    for (const u of r) (i[u.tier] ??= []).push(u);
    for (const u of Gn) i[u]?.sort((f, p) => f.env.localeCompare(p.env));
    const o = Gn.filter((u) => u !== "prod").flatMap((u) => i[u] ?? []), l = i.prod ?? [], c = Im(r);
    n.push({ app: a, byTier: i, stages: o, prod: l, state: c?.state ?? "none", lead: c });
  }
  return n.sort(
    (a, s) => tt.indexOf(a.state) - tt.indexOf(s.state) || a.app.localeCompare(s.app)
  );
}
function Yc(e) {
  if (e.length === 0) return null;
  const t = [...e].sort((a, s) => a - s), n = t.length >> 1;
  return t.length % 2 ? t[n] : Math.round((t[n - 1] + t[n]) / 2);
}
function Oo(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.deploys) {
    if (!n.version || !Number.isFinite(n.ms) || n.inFlight) continue;
    const a = t.get(n.version);
    (a === void 0 || n.ms < a) && t.set(n.version, n.ms);
  }
  return t;
}
function Pm(e) {
  if (e.length < 2) return null;
  const t = [...e].sort((u, f) => u.order - f.order), n = t[0], a = t.filter((u) => u.prod && u !== n), s = a.length > 0 ? a : [t[t.length - 1]];
  if (s.length === 1 && s[0] === n) return null;
  const r = Oo(n), i = /* @__PURE__ */ new Map();
  for (const u of s)
    if (u !== n)
      for (const [f, p] of Oo(u)) {
        const v = i.get(f);
        (v === void 0 || p < v) && i.set(f, p);
      }
  const o = [];
  for (const [u, f] of r) {
    const p = i.get(u);
    if (p === void 0) continue;
    const v = p - f;
    v <= 0 || o.push(v);
  }
  if (o.length === 0) return null;
  o.sort((u, f) => u - f);
  const l = o.length >> 1;
  return {
    medianMs: o.length % 2 === 1 ? o[l] : Math.round((o[l - 1] + o[l]) / 2),
    samples: o.length,
    fromLabel: n.label,
    toLabel: a.length > 0 ? "prod" : s[0].label
  };
}
const jm = 36e5, Mr = 24 * jm, Wm = {
  "24h": { span: Mr, bins: 24, label: "last 24 hours", prev: "the 24 hours before" },
  "7d": { span: 7 * Mr, bins: 28, label: "last 7 days", prev: "the 7 days before" },
  "30d": { span: 30 * Mr, bins: 30, label: "last 30 days", prev: "the 30 days before" }
};
function Xa(e) {
  const t = e.rollout, n = t.status?.history?.[0]?.version, a = n && ge(n) || null, s = t.status?.availableReleases ?? [], r = s.findIndex((l) => !!l && (l.version === a || l.tag === a)), o = (t.status?.releaseCandidates?.length ? t.status.releaseCandidates : s.slice(r + 1)).filter(
    (l) => !!l?.created
  ).reduce((l, c) => Math.min(l, new Date(c.created).getTime()), 1 / 0);
  return Number.isFinite(o) ? o : null;
}
function ia(e) {
  return _a(e);
}
function Fs(e, t) {
  if (!t.gateContext) return "other";
  const n = $n(e.rollout, t.gateContext, {
    contractHolds: t.contractHoldsFor?.(e.rollout)
  });
  return n.blocked ? n.person.length > 0 ? "approval" : n.upstream.some((a) => a.kind === "dependency") ? "dependency" : n.upstream.some((a) => a.kind === "promotion") ? "order" : "other" : "other";
}
function Bm(e, t) {
  const n = [];
  for (const a of e) {
    const s = t.get(a), r = s ? Ys(s) : !1;
    for (const i of a.status?.history ?? []) {
      if (!i.timestamp) continue;
      const o = new Date(i.timestamp).getTime();
      Number.isFinite(o) && n.push({ ms: o, status: i.bakeStatus ?? "", rollout: a, mapped: r });
    }
  }
  return n;
}
function zm(e) {
  const t = e.rollout.status?.history?.[0];
  return !!t && t.bakeStatus === "Failed" && !!t.timestamp && new Date(t.timestamp).getTime() === e.ms;
}
function $c() {
  return { failed: 0, stuck: 0, held: 0, deploying: 0, checking: 0, behind: 0, newest: 0 };
}
function oa() {
  return {
    apps: /* @__PURE__ */ new Set(),
    places: 0,
    regions: 0,
    regionNames: /* @__PURE__ */ new Set(),
    placesByState: $c(),
    worst: /* @__PURE__ */ new Map(),
    causeApps: { order: /* @__PURE__ */ new Set(), approval: /* @__PURE__ */ new Set(), dependency: /* @__PURE__ */ new Set(), other: /* @__PURE__ */ new Set() }
  };
}
function Do(e, t, n, a) {
  const s = n.state;
  e.apps.add(t);
  const r = e.worst.get(t);
  if ((r == null || tt.indexOf(s) < tt.indexOf(r)) && e.worst.set(t, s), e.places++, n.tier === "prod" && (e.regionNames.add(n.env), e.regions = Ua([...e.regionNames])), s in e.placesByState && e.placesByState[s]++, s === "held") {
    const i = Fs(n.card, a);
    e.causeApps[i].add(t);
  }
}
function Fo(e) {
  return {
    apps: e.apps.size,
    places: e.places,
    regions: e.regions,
    appsByState: Hm(e.worst),
    placesByState: e.placesByState,
    appsByCause: {
      order: e.causeApps.order.size,
      approval: e.causeApps.approval.size,
      dependency: e.causeApps.dependency.size,
      other: e.causeApps.other.size
    }
  };
}
function Hm(e) {
  const t = $c();
  for (const n of e.values()) n in t && t[n]++;
  return t;
}
function Vm(e, t, n) {
  const a = [...new Set(e)];
  return a.length === t && a.length > 1 ? [n] : a.length <= 2 ? a.sort(Ci) : [Wc(Ua(a), n) ?? a.join(", ")];
}
function Um(e, t, n, a, s = {}) {
  const r = Wm[a], i = n, o = i - r.span, l = o - r.span, c = new Map(e.map((B) => [B.rollout, B])), u = Bm(t, c), f = u.reduce((B, oe) => Math.min(B, oe.ms), 1 / 0), p = Number.isFinite(f) && f <= l + r.span * 0.05;
  let v = 0, y = 0, b = 0, g = 0, h = 0, x = 0;
  for (const B of u)
    B.ms >= o && B.ms <= i ? (v++, B.mapped || b++, B.status === "Failed" && (g++, zm(B) || x++)) : p && B.ms >= l && B.ms < o && (y++, B.status === "Failed" && h++);
  const m = new Set(e.map((B) => B.name)).size, C = e.filter(Ys), _ = new Set(C.map((B) => B.name)).size, A = e.length, E = C.length, S = e.filter((B) => dt(B.envName) === "prod").length, w = Kc(e), L = e.filter((B) => ia(B) === "held"), k = w.filter((B) => B.state === "held"), T = k.flatMap(
    (B) => [...B.stages, ...B.prod].filter((oe) => oe.state === "held").map((oe) => oe.card)
  ), F = new Set(w.map((B) => B.app)), z = /* @__PURE__ */ new Map();
  for (const B of e) {
    const oe = z.get(B.name) ?? [];
    oe.push(B), z.set(B.name, oe);
  }
  const j = [...z.keys()].filter((B) => !F.has(B)), D = /* @__PURE__ */ new Map();
  for (const B of j) {
    let oe = null;
    for (const fe of z.get(B)) {
      const Qe = ia(fe);
      (!oe || tt.indexOf(Qe) < tt.indexOf(oe.state)) && (oe = { card: fe, state: Qe });
    }
    D.set(B, oe);
  }
  const H = j.filter((B) => D.get(B).state === "held"), te = j.filter((B) => D.get(B).state === "behind");
  let ae = 0;
  for (const B of w) {
    const oe = /* @__PURE__ */ new Map();
    for (const fe of [...B.stages, ...B.prod]) {
      const Qe = oe.get(fe.tier);
      (Qe == null || tt.indexOf(fe.state) < tt.indexOf(Qe)) && oe.set(fe.tier, fe.state);
    }
    for (const fe of oe.values()) fe === "held" && ae++;
  }
  const se = { order: 0, approval: 0, dependency: 0, other: 0 }, G = [], X = { order: /* @__PURE__ */ new Set(), approval: /* @__PURE__ */ new Set(), dependency: /* @__PURE__ */ new Set(), other: /* @__PURE__ */ new Set() };
  for (const B of T) {
    const oe = Fs(B, s);
    se[oe]++, X[oe].add(B.name);
    const fe = Xa(B);
    fe != null && G.push({ ms: Math.max(0, n - fe), app: B.name, env: B.envDisplay || B.envName || "" });
  }
  const re = G.reduce((B, oe) => !B || oe.ms > B.ms ? oe : B, null);
  for (const B of H) {
    const oe = Fs(D.get(B).card, s);
    X[oe].add(B);
  }
  const R = T.filter((B) => B.heldCause !== "person"), U = H.filter((B) => D.get(B).card.heldCause !== "person"), Y = /* @__PURE__ */ new Set([...R.map((B) => B.name), ...U]), J = [];
  for (const B of R) {
    const oe = Xa(B);
    oe != null && J.push(Math.max(0, n - oe));
  }
  for (const B of U) {
    const oe = Xa(D.get(B).card);
    oe != null && J.push(Math.max(0, n - oe));
  }
  const Q = J.length > 0 ? Math.max(...J) : null;
  let ee = null;
  if (Y.size === 1) {
    const B = [...Y][0], oe = e.filter((fe) => fe.name === B && fe.held && fe.heldCause !== "person" && fe.envName);
    if (oe.length > 0) {
      const fe = /* @__PURE__ */ new Map();
      for (const Ze of oe) {
        const Xe = Gn.indexOf(dt(Ze.envName));
        (fe.get(Xe) ?? fe.set(Xe, []).get(Xe)).push(Ze);
      }
      const Qe = [...fe.entries()].sort(([Ze], [Xe]) => Ze - Xe).map(([Ze, Xe]) => {
        const bt = [...new Map(Xe.map((Oe) => [Oe.envName, Oe])).values()], Mt = Gn[Ze], It = new Set(e.filter((Oe) => Oe.name === B && dt(Oe.envName) === Mt).map((Oe) => Oe.envName));
        return Vm(
          bt.map((Oe) => Oe.envDisplay || Oe.envName || dt(Oe.envName)),
          It.size,
          Mt
        );
      }), Wt = Ea(Qe.flat()), Dn = Math.min(...fe.keys()), bn = fe.get(Dn)[0];
      ee = { app: B, env: Wt, causeLabel: bn.heldCauseLabel ?? "a rule" };
    } else {
      const fe = D.get(B).card;
      ee = { app: B, env: "", causeLabel: fe.heldCauseLabel ?? "a rule" };
    }
  }
  const ce = e.filter((B) => ia(B) === "failed"), de = e.filter((B) => ia(B) === "deploying"), Z = e.filter((B) => ia(B) === "checking"), pe = e.filter((B) => ia(B) === "stuck"), he = e.filter(
    (B) => us(B) || T.includes(B) && Fs(B, s) === "approval"
  ), ve = w.filter((B) => [...B.stages, ...B.prod].every((oe) => oe.state === "newest")).length, Le = [.../* @__PURE__ */ new Set([...k.map((B) => B.app), ...H])].sort(), He = [
    .../* @__PURE__ */ new Set([...w.filter((B) => B.state === "behind").map((B) => B.app), ...te])
  ].sort(), _e = {
    dev: oa(),
    test: oa(),
    staging: oa(),
    other: oa(),
    prod: oa()
  }, $e = /* @__PURE__ */ new Map();
  for (const B of w)
    for (const oe of [...B.stages, ...B.prod]) {
      Do(_e[oe.tier], B.app, oe, s);
      const fe = oe.env || oe.tier;
      Do($e.get(fe) ?? $e.set(fe, oa()).get(fe), B.app, oe, s);
    }
  const Be = Object.fromEntries(Gn.map((B) => [B, Fo(_e[B])])), gt = {};
  for (const [B, oe] of $e) gt[B] = Fo(oe);
  const Ie = (B) => B.filter((oe) => !Ys(oe)).length;
  return {
    range: a,
    start: o,
    end: i,
    hasPrev: p,
    apps: m,
    mappedApps: _,
    places: A,
    mappedPlaces: E,
    regions: S,
    deploys: { value: v, prev: p ? y : null, unmapped: b },
    held: {
      apps: Le.length,
      appIds: Le,
      approvalAppIds: [...X.approval].sort(),
      places: L.length,
      plates: ae,
      regions: L.filter((B) => dt(B.envName) === "prod").length,
      unmapped: Ie(L),
      byCause: se,
      byCauseApps: { order: X.order.size, approval: X.approval.size, dependency: X.dependency.size, other: X.other.size },
      medianMs: Yc(G.map((B) => B.ms)),
      longestMs: re?.ms ?? null,
      longestSubject: re ? { app: re.app, env: re.env } : null,
      ruleApps: Y.size,
      ruleSingle: ee,
      ruleLongestMs: Q
    },
    failed: {
      live: {
        apps: new Set(ce.map((B) => B.name)).size,
        places: ce.length,
        regions: ce.filter((B) => dt(B.envName) === "prod").length,
        unmapped: Ie(ce)
      },
      inWindow: { value: g, prev: p ? h : null },
      resolvedInWindow: x
    },
    inMotion: {
      apps: new Set([...de, ...Z].map((B) => B.name)).size,
      places: de.length + Z.length,
      deploying: de.length,
      checking: Z.length,
      unmapped: Ie([...de, ...Z])
    },
    stuck: { apps: new Set(pe.map((B) => B.name)).size, places: pe.length },
    needsYou: {
      apps: new Set(he.map((B) => B.name)).size,
      places: he.length
    },
    newestEverywhere: { apps: ve, of: _ },
    behind: { apps: He.length, appIds: He },
    byTier: Be,
    byEnv: gt
  };
}
function qm(e, t, n) {
  if (!e || !t) return null;
  const a = Wi(t);
  if (!a || a <= 0) return null;
  const s = new Date(e).getTime();
  if (Number.isNaN(s)) return null;
  const r = Math.max(0, n.getTime() - s), i = Math.min(1, r / a);
  return { elapsedMs: r, totalMs: a, fraction: i };
}
const Gm = 5 * 6e4, Io = (e) => e.set ? "prod" : e.label, Po = (e) => e.rollout.status?.history?.[0];
function Km(e) {
  if (e.heldCause === "dependency" && e.heldCauseLabel && e.heldCauseLabel !== "a dependency") return { name: e.heldCauseLabel, app: e.heldCauseLabel };
  const t = (e.rollout.status?.gates ?? []).find((n) => n.passing === !1 && !n.name?.startsWith("promotion-"));
  return t?.name ? { name: t.name, app: null } : null;
}
function Ym(e, t) {
  const n = t.cycleMs ?? Gm;
  for (let a = 0; a < e.plates.length; a++) {
    const s = e.plates[a], r = Io(s), i = s.nodes.filter((f) => f.state === "held");
    if (i.length) {
      if (i.some((v) => t.isApproval(v.card))) return { kind: "approval", place: r };
      const f = i[0].card;
      if (f.heldCause === "clock" && f.heldCauseLabel) return { kind: "window", place: r, name: f.heldCauseLabel };
      const p = Km(f);
      if (p) return { kind: "rule", place: r, ...p };
    }
    const o = s.nodes.find((f) => f.state === "behind");
    if (!o && !i.length) continue;
    const l = a > 0 ? e.plates[a - 1] : null;
    if (l) {
      const f = l.nodes.find((g) => g.state === "checking");
      if (f) {
        const g = Po(f.card), h = qm(g?.bakeStartTime, f.card.rollout.spec?.bakeTime, t.now);
        return { kind: "bake", place: r, upstream: Io(l), id: t.idOf(f.card.version), leftMs: h ? Math.max(0, h.totalMs - h.elapsedMs) : null };
      }
      if (l.nodes.some((g) => g.state === "deploying")) return null;
      const p = l.nodes.find((g) => g.state === "newest") ?? l.nodes[0];
      if (!o || o.card.version && o.card.version === p.card.version) continue;
      const v = Po(p.card), y = v?.bakeEndTime ?? v?.timestamp ?? null, b = y ? t.now.getTime() - Date.parse(y) : null;
      return b == null || b <= n ? { kind: "cycle", place: r, usualMs: n, waitedMs: b } : { kind: "stalled", place: r, id: t.idOf(p.card.version), forMs: b };
    }
    if (!o) continue;
    const c = [...o.card.rollout.status?.availableReleases ?? []].sort((f, p) => Date.parse(p.created ?? "") - Date.parse(f.created ?? ""))[0], u = c?.created ? t.now.getTime() - Date.parse(c.created) : null;
    return u == null || u <= n ? { kind: "cycle", place: r, usualMs: n, waitedMs: u } : { kind: "stalled", place: r, id: t.idOf(c?.version ?? c?.tag ?? null), forMs: u };
  }
  return null;
}
function va(e) {
  return _s((/* @__PURE__ */ new Date(0)).toISOString(), new Date(Math.max(0, e)));
}
Ba(["click"]);
const $m = (e) => !!e.envName && dt(e.envName) === "prod", Qm = (e) => e === "failed" || e === "stuck";
function Zm(e, t) {
  const n = e.filter($m), a = n.filter((s) => Qm(_a(s)));
  return {
    total: n.length,
    failing: a.length,
    failingApps: [...new Set(a.map((s) => s.name))].sort(),
    notDeployed: n.filter((s) => _a(s) === "none").length,
    approvals: n.filter((s) => _a(s) === "held" && t(s)).map((s) => ({ app: s.name, env: s.envName, card: s }))
  };
}
function Xm(e, t, n = null) {
  const a = /* @__PURE__ */ new Map(), s = (o, l) => {
    const c = `${o}|${l ?? ""}`, u = a.get(c) ?? { count: 0, word: o, id: l };
    u.count++, a.set(c, u);
  };
  for (const o of e) {
    const l = o.card.version ? t(o.card.version) : "";
    o.state === "none" || !l ? s("not deployed", null) : o.state === "failed" || o.state === "stuck" ? s("failing on", l) : o.state === "checking" ? s("checking", l) : o.state === "deploying" ? s("deploying", l) : s("on", l);
  }
  const r = ["failing on", "checking", "deploying", "on", "not deployed"], i = [...a.values()].sort((o, l) => r.indexOf(o.word) - r.indexOf(l.word) || l.count - o.count);
  return { total: e.length, buckets: i, heldBefore: n };
}
function Vi(e) {
  return e?.bakeEndTime ?? e?.timestamp ?? null;
}
function ha(e, t) {
  const n = e.rollout?.status?.history?.[0];
  switch (t) {
    case "failed":
      return e.checkFailure?.since ? e.checkFailure.since : Vi(n) ?? e.timestamp ?? null;
    case "deploying":
    case "checking":
    case "stuck":
      return n?.timestamp ?? e.timestamp ?? null;
    case "held":
    case "behind": {
      if (!e.rollout) return null;
      const a = Xa(e);
      return a != null ? new Date(a).toISOString() : null;
    }
    default:
      return null;
  }
}
const Ls = (e) => tt.indexOf(e), jo = ["failed", "stuck", "held", "deploying", "checking"];
function Er(e, t) {
  return e === "held" ? t ? "waits for approval" : "held" : e;
}
function Jm(e, t) {
  const n = e.stages.map((c) => ({
    key: c.env,
    label: c.env,
    set: !1,
    nodes: [c]
  }));
  e.prod.length && n.push({
    key: "prod",
    label: e.prod.length === 1 ? e.prod[0].env : "prod",
    set: e.prod.length > 1,
    nodes: [...e.prod].sort((c, u) => c.env.localeCompare(u.env))
  });
  const a = n.map((c) => {
    const u = c.nodes.reduce((y, b) => Ls(b.state) < Ls(y.state) ? b : y), f = c.nodes.filter((y) => y.state === u.state).length, p = u.state === "held" && t(u.card);
    let v = null;
    if (jo.includes(u.state)) {
      const y = Er(u.state, p), b = c.set && f > 1 ? null : u.state === "held" ? (
        // the build the hold keeps out, never the one running
        ((g) => g ? yt(g) : null)(Fc(u.card.rollout).held[0]?.build ?? null)
      ) : u.card.version ? yt(u.card.version) : null;
      v = { word: c.set && f > 1 ? `${f} ${y}` : y, state: u.state, sha: b };
    }
    return {
      ...c,
      states: c.nodes.map((y) => y.state === "held" && t(y.card) ? "approval" : y.state),
      healthy: c.nodes.filter((y) => y.state !== "failed" && y.state !== "stuck").length,
      worst: u,
      onNewest: c.nodes.filter((y) => y.state === "newest").length,
      tag: v
    };
  }), s = a.reduce((c, u) => !c || Ls(u.worst.state) < Ls(c.worst.state) ? u : c, null), r = s?.worst.state ?? "none", i = s?.worst ?? null, o = !!i && r === "held" && t(i.card);
  let l = null;
  if (i && jo.includes(r)) {
    const c = s.nodes.filter((v) => v.state === r).length, u = s.nodes.filter((v) => v.state === r).map((v) => v.env), f = (s.set && c > 1 ? Wc(Ua(u), "prod") : null) ?? i.env, p = r === "deploying" ? "to" : "in";
    l = { text: `${Er(r, o)} ${p} ${f}`, verb: Er(r, o), rest: ` ${p} ${f}`, state: r };
  } else if (r === "behind") {
    const c = a.find((v) => v.nodes.some((y) => y.state === "behind")), u = c.nodes.find((v) => v.state === "behind"), f = c.set ? "prod" : u.env, p = u.behind > 0 ? `${u.behind} behind` : "behind";
    l = { text: `${p} in ${f} · ${f} next`, verb: p, rest: ` in ${f} · ${f} next`, state: r };
  }
  return {
    app: e.app,
    plates: a,
    state: r,
    phrase: l,
    lead: i,
    approval: o,
    newestEverywhere: a.length > 0 && a.every((c) => c.nodes.every((u) => u.state === "newest")),
    lane: e
  };
}
const eg = "en", Qc = (
  /** @type {const} */
  ["en"]
), Zc = "PARAGLIDE_LOCALE", tg = 3456e4, Xc = [
  "cookie",
  "globalVariable",
  "baseLocale"
];
globalThis.__paraglide = {};
let Is, Wo = !1, we = () => {
  let e;
  for (const t of Xc)
    if (t === "cookie" ? e = sg() : t === "baseLocale" ? e = eg : t === "globalVariable" && Is !== void 0 && (e = Is), e !== void 0) {
      const n = ag(e);
      return Wo || (Is = n, Wo = !0, ng(n, { reload: !1 })), n;
    }
  throw new Error("No locale found. Read the docs https://inlang.com/m/gerre34r/library-inlang-paraglideJs/errors#no-locale-found");
}, ng = (e, t) => {
  const n = {
    reload: !0,
    ...t
  };
  let a;
  try {
    a = we();
  } catch {
  }
  for (const s of Xc)
    if (s === "globalVariable")
      Is = e;
    else if (s === "cookie") {
      if (typeof document > "u" || typeof window > "u")
        continue;
      const r = window.location.hostname;
      document.cookie = `${Zc}=${e}; path=/; max-age=${tg}; domain=${r}`;
    } else if (s === "baseLocale")
      continue;
  n.reload && window.location && e !== a && window.location.reload();
};
function Jc(e) {
  return e ? Qc.includes(e) : !1;
}
function ag(e) {
  if (Jc(e) === !1)
    throw new Error(`Invalid locale: ${e}. Expected one of: ${Qc.join(", ")}`);
  return e;
}
function sg() {
  if (typeof document > "u" || !document.cookie)
    return;
  const t = document.cookie.match(new RegExp(`(^| )${Zc}=([^;]+)`))?.[2];
  if (Jc(t))
    return t;
}
const rg = (
  /** @type {(inputs: { age: NonNullable<unknown> }) => string} */
  (e) => `held ${e.age}`
), ig = (
  /** @type {(inputs: {}) => string} */
  () => "waits on a rule"
), og = (
  /** @type {(inputs: {}) => string} */
  () => "health check failing"
), lg = (
  /** @type {(inputs: { env: NonNullable<unknown> }) => string} */
  (e) => `Roll back ${e.env}`
), cg = (
  /** @type {(inputs: {}) => string} */
  () => "Review approval"
), ug = (
  /** @type {(inputs: {}) => string} */
  () => "failed its health check"
), dg = (
  /** @type {(inputs: { version: NonNullable<unknown> }) => string} */
  (e) => `rolled back to ${e.version}`
), fg = (
  /** @type {(inputs: { name: NonNullable<unknown> }) => string} */
  (e) => `${e.name} failing`
), pg = (
  /** @type {(inputs: {}) => string} */
  () => "failed to deploy"
), vg = (
  /** @type {(inputs: { name: NonNullable<unknown>, n: NonNullable<unknown>, span: NonNullable<unknown> }) => string} */
  (e) => `${e.name} ${e.n}× in ${e.span}, expected 0`
), hg = (
  /** @type {(inputs: { age: NonNullable<unknown> }) => string} */
  (e) => `failed ${e.age} ago, recovered`
), mg = (
  /** @type {(inputs: { span: NonNullable<unknown>, set: NonNullable<unknown> }) => string} */
  (e) => `bake ${e.span}, set to ${e.set}`
), gg = (
  /** @type {(inputs: { span: NonNullable<unknown>, usual: NonNullable<unknown> }) => string} */
  (e) => `waiting ${e.span}, usually ${e.usual}`
), bg = (
  /** @type {(inputs: { age: NonNullable<unknown> }) => string} */
  (e) => `retried ${e.age} ago`
), wg = (
  /** @type {(inputs: { age: NonNullable<unknown> }) => string} */
  (e) => `approval waiting ${e.age}`
), kg = (
  /** @type {(inputs: { age: NonNullable<unknown> }) => string} */
  (e) => `pinned ${e.age}`
), _g = (
  /** @type {(inputs: { version: NonNullable<unknown>, n: NonNullable<unknown> }) => string} */
  (e) => `${e.version} to ${e.n} regions`
), yg = (
  /** @type {(inputs: { version: NonNullable<unknown>, env: NonNullable<unknown> }) => string} */
  (e) => `${e.version} to ${e.env}`
), xg = (
  /** @type {(inputs: { env: NonNullable<unknown>, age: NonNullable<unknown> }) => string} */
  (e) => `${e.env} idle ${e.age}`
), Sg = (
  /** @type {(inputs: { n: NonNullable<unknown>, total: NonNullable<unknown> }) => string} */
  (e) => `${e.n} of ${e.total} regions not deployed`
), Cg = (
  /** @type {(inputs: { total: NonNullable<unknown>, builds: NonNullable<unknown> }) => string} */
  (e) => `${e.total} regions on ${e.builds} builds`
), Ag = (
  /** @type {(inputs: { n: NonNullable<unknown>, span: NonNullable<unknown> }) => string} */
  (e) => `${e.n} apps to prod in ${e.span}`
), Tg = (
  /** @type {(inputs: {}) => string} */
  () => "is stuck"
), Mg = (
  /** @type {(inputs: {}) => string} */
  () => "waits for approval"
), Eg = (
  /** @type {(inputs: {}) => string} */
  () => "waits on a dependency"
), Lg = (
  /** @type {(inputs: {}) => string} */
  () => "waits on promotion order"
), Ng = (
  /** @type {(inputs: {}) => string} */
  () => "waits for a deploy window"
), Rg = (
  /** @type {(inputs: {}) => string} */
  () => "waits on a check"
), Og = (
  /** @type {(inputs: {}) => string} */
  () => "is pinned"
), Dg = (
  /** @type {(inputs: { env: NonNullable<unknown> }) => string} */
  (e) => `Review approval in ${e.env}`
), Fg = (
  /** @type {(inputs: { env: NonNullable<unknown> }) => string} */
  (e) => `failing in ${e.env}`
), Ig = (
  /** @type {(inputs: { env: NonNullable<unknown> }) => string} */
  (e) => `waits for approval in ${e.env}`
), Pg = (
  /** @type {(inputs: { env: NonNullable<unknown> }) => string} */
  (e) => `held in ${e.env}`
), jg = (
  /** @type {(inputs: { env: NonNullable<unknown> }) => string} */
  (e) => `deploying in ${e.env}`
), Wg = (
  /** @type {(inputs: { env: NonNullable<unknown> }) => string} */
  (e) => `checking in ${e.env}`
), Bg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? rg(e) : "home_m_held_for", zg = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? ig() : "home_m_waits_on_rule", Hg = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? og() : "home_m_health_check_failing", Vg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? lg(e) : "home_m_action_roll_back", Ug = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? cg() : "home_m_action_review_approval", eu = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? ug() : "home_m_evidence_failed_check", qg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? dg(e) : "home_m_evidence_rolled_back_to", Gg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? fg(e) : "home_m_sig_check_failing", tu = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? pg() : "home_m_failed_to_deploy", Kg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? vg(e) : "home_m_sig_flapping", Yg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? hg(e) : "home_m_sig_recovered", $g = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? mg(e) : "home_m_sig_slow_bake", Qg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? gg(e) : "home_m_sig_long_wait", Zg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? bg(e) : "home_m_sig_retried", Xg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? wg(e) : "home_m_sig_approval_waiting", Jg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? kg(e) : "home_m_sig_pinned", e0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? _g(e) : "home_m_sig_to_regions", t0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? yg(e) : "home_m_sig_to_env", n0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? xg(e) : "home_m_sig_idle", a0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Sg(e) : "home_m_sig_regions_not_deployed", s0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Cg(e) : "home_m_sig_regions_on_builds", r0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Ag(e) : "home_m_sig_correlated", i0 = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? Tg() : "home_m_hold_stuck", o0 = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? Mg() : "home_m_hold_approval", l0 = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? Eg() : "home_m_hold_dependency", c0 = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? Lg() : "home_m_hold_order", u0 = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? Ng() : "home_m_hold_clock", d0 = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? Rg() : "home_m_hold_check", f0 = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? Og() : "home_m_hold_pinned", p0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Dg(e) : "home_m_action_review_approval_in", v0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Fg(e) : "home_m_lead_failing", h0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Ig(e) : "home_m_lead_approval", m0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Pg(e) : "home_m_lead_held", g0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? jg(e) : "home_m_lead_deploying", b0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Wg(e) : "home_m_lead_checking", w0 = /* @__PURE__ */ new Set([
  "check-failing",
  "check-flapping",
  "check-recovered",
  "slow-bake",
  "long-wait"
]);
function Bo(e) {
  const t = Math.max(0, e);
  return t < 3 * 36e5 ? `${Math.round(t / 6e4)}m` : va(t);
}
function k0(e) {
  switch (e.kind) {
    case "check-failing":
      return (e.check == null ? /* @__PURE__ */ Hg() : /* @__PURE__ */ Gg({ name: e.check })).slice(0, 48);
    case "failed":
      return e.failure === "healthcheck" ? /* @__PURE__ */ eu() : /* @__PURE__ */ tu();
    case "check-flapping":
      return /* @__PURE__ */ Kg({ name: e.check, n: e.failures, span: va(Math.max(0, e.spanMs)) });
    case "check-recovered":
      return /* @__PURE__ */ Yg({ age: va(Math.max(0, e.failedAgoMs)) });
    case "slow-bake":
      return /* @__PURE__ */ $g({ span: Bo(e.spanMs), set: Bo(e.bakeTimeMs) });
    case "long-wait":
      return /* @__PURE__ */ Qg({ span: va(Math.max(0, e.waitedMs)), usual: va(Math.max(0, e.usualMs)) });
  }
}
const Nt = {
  prodRolloutMs: 6 * 36e5,
  retryMs: 24 * 36e5,
  rollbackMs: 24 * 36e5,
  /** how far back an earlier failure of the same check counts toward flapping */
  flapWindowMs: 24 * 36e5,
  agingHoldMs: 2 * 36e5,
  correlatedMs: 10 * 6e4,
  correlatedWindowMs: 2 * 36e5,
  slowBakeFactor: 1.5,
  /**
   * How far past `spec.bakeTime` a bake may run before it reads as slow. The
   * controller requeues for the bake's end instant and marks it Succeeded on
   * that reconcile, so a healthy controller overruns by seconds. Five minutes
   * absorbs a controller restart or leader hand-over (lease 15s, re-list and
   * requeue under a minute on the demo clusters) and clock skew between the
   * controller and the browser, so what remains is a controller that did not
   * get back to the rollout, which is worth a look.
   */
  slowBakeMarginMs: 5 * 6e4,
  /**
   * The shortest wait that can read as long, whatever this place usually
   * waits. A promotion takes up to two environment-controller passes (its
   * requeueInterval defaults to 1m: one pass reads the upstream bake, the
   * next writes the gate's allowedVersions) before the rollout-controller
   * reconciles the gate update and starts the deploy. That is about 2m of
   * ordinary polling jitter that a history of quick deploys (a usual of 0s)
   * cannot show, so 3m keeps a minute of room above it. Waits past
   * `NORMAL_CYCLE_MS` are stalls, not long waits.
   */
  longWaitFloorMs: 3 * 6e4
};
function _0(e, t) {
  return e >= Math.max(Nt.longWaitFloorMs, t * Nt.slowBakeFactor);
}
const Ga = (e) => va(Math.max(0, e)), yn = (e) => new Date(e).toISOString(), zo = (e) => !!e.envName && dt(e.envName) === "prod", Ho = (e) => `${e.ns}/${e.name}`;
function y0(e) {
  const t = [];
  for (const n of e)
    for (const a of n.rollout.status?.history ?? []) {
      const s = a.timestamp ? Date.parse(a.timestamp) : NaN;
      if (!Number.isFinite(s)) continue;
      const r = a.version && ge(a.version) || "", i = a.version?.revision ? yt(a.version.revision).slice(0, 7) : yt(r).slice(0, 7);
      t.push({ at: s, card: n, version: yt(r), rev: i });
    }
  return t.sort((n, a) => a.at - n.at);
}
function x0(e) {
  const t = e.rollout.status?.availableReleases ?? [], n = [];
  for (const a of e.rollout.status?.history ?? []) {
    const s = a.version ? ge(a.version) : null, r = t.find((o) => !!o && (o.tag === s || o.version === s || o.tag === a.version?.tag));
    if (!r?.created || !a.timestamp) continue;
    const i = Date.parse(a.timestamp) - Date.parse(r.created);
    Number.isFinite(i) && i >= 0 && n.push(i);
  }
  return n.length < 2 ? null : (n.sort((a, s) => a - s), n[Math.floor(n.length / 2)]);
}
function S0(e) {
  const { cards: t, lanes: n, healthChecks: a, prFor: s, isApproval: r, now: i, href: o, appHref: l } = e, c = i.getTime(), u = y0(t), f = [];
  function p(m, C, _) {
    const A = (w, L) => {
      const k = w.rev ? s(w.rev) : null;
      return { id: k?.number ?? w.version, title: k?.title ?? null, href: k?.href ?? null, app: w.card.name, env: w.card.envDisplay || w.card.envName, at: yn(w.at), sameApp: L };
    }, E = (C ? u.find((w) => w.at < m && Ho(w.card) === Ho(C)) : null) ?? u.find((w) => w.at < m && w.card.name === _);
    if (E) return A(E, !0);
    const S = u.find((w) => w.at < m && zo(w.card));
    return S ? A(S, !1) : null;
  }
  function v(m, C) {
    const _ = m.evidence ?? (m.facts ? k0(m.facts) : "");
    f.push({ ...m, evidence: _, key: `${m.kind}|${m.app}|${m.env}|${m.since}`, lastChange: p(Date.parse(m.since), C, m.app) });
  }
  const y = (m) => m.envDisplay || m.envName, b = /* @__PURE__ */ new Map();
  for (const m of t) {
    if (!m.envName) continue;
    const C = dt(m.envName), _ = m.rollout.status?.history?.[0], A = _a(m);
    if (m.checkFailure) {
      const T = ha(m, "failed") ?? _?.bakeEndTime ?? _?.timestamp ?? yn(c);
      v({ kind: "check-failing", severity: "failure", app: m.name, env: y(m), tier: C, since: T, facts: { kind: "check-failing", check: m.checkFailure.check ?? null }, href: o(m) }, m);
    } else if (A === "failed") {
      const T = ha(m, "failed") ?? _?.timestamp ?? yn(c);
      v({ kind: "failed", severity: "failure", app: m.name, env: y(m), tier: C, since: T, facts: { kind: "failed", failure: jc(m.failureCategory === "healthcheck" ? "health check" : m.bakeStatusMessage ?? null) }, href: o(m) }, m);
    }
    const E = a?.get(Mc(m.sourceCluster, m.ns, m.name)) ?? [], S = om(m.rollout), w = m.rollout.status?.history ?? [];
    for (const T of E) {
      if (lm(T, S) !== "recovered") continue;
      const F = Date.parse(T.status.lastErrorTime), z = T.metadata?.name, j = T.metadata?.annotations?.["kuberik.com/display-name"] ?? z ?? "check", D = _?.bakeStartTime ? Date.parse(_.bakeStartTime) : NaN, H = w.slice(1).filter((se) => {
        const G = Date.parse(se.bakeEndTime ?? se.timestamp ?? "");
        return Number.isFinite(G) && c - G < Nt.flapWindowMs && (se.failedHealthChecks ?? []).some((X) => X.name === z);
      }), te = H.length > 0 && Number.isFinite(D) && F > D, ae = te ? Math.min(...H.map((se) => Date.parse(se.bakeEndTime ?? se.timestamp ?? ""))) : F;
      v(
        {
          kind: te ? "check-flapping" : "check-recovered",
          severity: "signal",
          app: m.name,
          env: y(m),
          tier: C,
          since: T.status.lastErrorTime,
          facts: te ? { kind: "check-flapping", check: j, failures: H.length + 1, spanMs: c - ae } : { kind: "check-recovered", failedAgoMs: c - F },
          href: o(m)
        },
        m
      );
    }
    const L = m.rollout.spec?.bakeTime ? Wi(m.rollout.spec.bakeTime) : 0;
    if (_?.bakeStartTime && L > 0) {
      const T = Date.parse(_.bakeStartTime), F = _.bakeEndTime ? Date.parse(_.bakeEndTime) : c, z = F - T;
      c - F < Nt.retryMs && z > L + Nt.slowBakeMarginMs && v({ kind: "slow-bake", severity: "signal", app: m.name, env: y(m), tier: C, since: _.bakeStartTime, facts: { kind: "slow-bake", spanMs: z, bakeTimeMs: L }, href: o(m) }, m);
    }
    _?.lastRetryTimestamp && c - Date.parse(_.lastRetryTimestamp) < Nt.retryMs && v({ kind: "retry", severity: "signal", app: m.name, env: y(m), tier: C, since: _.lastRetryTimestamp, evidence: /* @__PURE__ */ Zg({ age: Ga(c - Date.parse(_.lastRetryTimestamp)) }), href: o(m) }, m);
    const k = Hi(m.rollout);
    if ((m.rollout.status?.history ?? []).forEach((T, F) => {
      if (k[F]?.kind !== "rollback" || !T.timestamp || c - Date.parse(T.timestamp) >= Nt.rollbackMs) return;
      const z = k[F];
      v({ kind: "rollback", severity: "signal", app: m.name, env: y(m), tier: C, since: T.timestamp, evidence: /* @__PURE__ */ qg({ version: yt(z.to) }), href: o(m) }, m);
    }), C === "prod" && _?.timestamp && c - Date.parse(_.timestamp) < Nt.prodRolloutMs && A !== "failed") {
      const T = _.version ? yt(ge(_.version) || "") : "", F = `${m.name}|${T}`, z = b.get(F);
      z ? (z.places.push(y(m)), Date.parse(_.timestamp) < Date.parse(z.since) && (z.since = _.timestamp)) : b.set(F, { card: m, v: T, since: _.timestamp, places: [y(m)] });
    }
    if (A === "held") {
      const T = r(m) ? ha(m, "held") : (() => {
        const F = Xa(m);
        return F ? yn(F) : ha(m, "held");
      })();
      T && c - Date.parse(T) >= Nt.agingHoldMs && v({ kind: "aging-hold", severity: "signal", app: m.name, env: y(m), tier: C, since: T, evidence: (r(m) ? Xg : Bg)({ age: Ga(c - Date.parse(T)) }), href: o(m) }, m);
    } else m.pinnedVersion && _?.timestamp && c - Date.parse(_.timestamp) >= Nt.agingHoldMs && v({ kind: "aging-hold", severity: "signal", app: m.name, env: y(m), tier: C, since: _.timestamp, evidence: /* @__PURE__ */ Jg({ age: Ga(c - Date.parse(_.timestamp)) }), href: o(m) }, m);
  }
  for (const m of b.values()) {
    const C = m.places.length > 1 ? "prod" : m.places[0];
    v({ kind: "prod-rollout", severity: "signal", app: m.card.name, env: C, tier: "prod", since: m.since, evidence: m.places.length > 1 ? /* @__PURE__ */ e0({ version: m.v, n: m.places.length }) : /* @__PURE__ */ t0({ version: m.v, env: C }), href: m.places.length > 1 ? l(m.card.name) : o(m.card) }, m.places.length > 1 ? null : m.card);
  }
  for (const m of n) {
    const C = Jm(m, r), _ = Ym(C, { now: i, idOf: (A) => A ? yt(A) : "", isApproval: r });
    if (_?.kind === "cycle" && _.waitedMs != null) {
      const A = _.place, E = [...m.stages, ...m.prod].find((w) => A === "prod" ? w.tier === "prod" : w.env === A) ?? null, S = E ? x0(E.card) : null;
      S != null && _0(_.waitedMs, S) && v({ kind: "long-wait", severity: "signal", app: m.app, env: A, tier: A === "prod" ? "prod" : dt(A), since: yn(c - _.waitedMs), facts: { kind: "long-wait", waitedMs: _.waitedMs, usualMs: S }, href: E ? o(E.card) : l(m.app) }, E?.card ?? null);
    }
    if (_?.kind === "stalled") {
      const A = _.place, E = [...m.stages, ...m.prod].find((S) => A === "prod" ? S.tier === "prod" : S.env === A) ?? null;
      v({ kind: "stall", severity: "signal", app: m.app, env: A, tier: A === "prod" ? "prod" : dt(A), since: yn(c - _.forMs), evidence: /* @__PURE__ */ n0({ env: A, age: Ga(_.forMs) }), href: E ? o(E.card) : l(m.app) }, E?.card ?? null);
    }
    if (m.prod.length > 1) {
      const A = Xm(m.prod, (w) => w ? yt(w) : ""), E = A.buckets.filter((w) => w.id).map((w) => w.id), S = m.prod.filter((w) => w.state === "none" || !w.card.version).length;
      if (new Set(E).size > 1 || S) {
        const w = Math.max(...m.prod.map((L) => L.card.timestamp ? Date.parse(L.card.timestamp) : 0));
        v(
          {
            kind: "prod-drift",
            severity: "signal",
            app: m.app,
            env: "prod",
            tier: "prod",
            since: yn(w || c),
            evidence: S ? /* @__PURE__ */ a0({ n: S, total: A.total }) : /* @__PURE__ */ s0({ total: A.total, builds: new Set(E).size }),
            href: l(m.app)
          },
          null
        );
      }
    }
  }
  const g = /* @__PURE__ */ new Map();
  for (const m of u) {
    if (!zo(m.card) || c - m.at >= Nt.correlatedWindowMs) continue;
    const C = `${m.card.name}|${m.version}`, _ = g.get(C);
    (!_ || m.at < _.at) && g.set(C, m);
  }
  const h = [...g.values()].sort((m, C) => m.at - C.at), x = /* @__PURE__ */ new Set();
  for (let m = 0; m < h.length; m++) {
    if (x.has(m)) continue;
    const C = [m];
    for (let S = m + 1; S < h.length && h[S].at - h[C[C.length - 1]].at <= Nt.correlatedMs; S++) C.push(S);
    const _ = [...new Set(C.map((S) => h[S].card.name))];
    if (_.length < 2) continue;
    C.forEach((S) => x.add(S));
    const A = h[m], E = h[C[C.length - 1]].at - A.at;
    v({ kind: "correlated", severity: "signal", app: _[0], apps: _, env: "prod", tier: "prod", since: yn(A.at), evidence: /* @__PURE__ */ r0({ n: _.length, span: Ga(Math.max(6e4, E)) }), href: l(_[0]) }, null);
  }
  return f.sort((m, C) => m.severity === C.severity ? Date.parse(C.since) - Date.parse(m.since) : m.severity === "failure" ? -1 : 1);
}
function C0(e) {
  return e?.metadataUnresolved === !0;
}
function Vo(e, t, n) {
  return `${e}/${t}/${n}`;
}
function sn(e) {
  return e?.metadata?.annotations?.[xc] ?? "";
}
function A0(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const a = n?.metadata?.namespace;
    if (!a) continue;
    const s = sn(n);
    let r = t.get(s);
    r || (r = /* @__PURE__ */ new Set(), t.set(s, r)), r.add(a);
  }
  return t;
}
function T0(e) {
  const t = e?.status?.history?.[0]?.version;
  return t && (t.version || t.revision || t.tag) || null;
}
const nu = /* @__PURE__ */ new WeakMap();
function M0(e) {
  const t = new Set(e.filter((n) => n != null));
  return t.size === 1 ? [...t][0] : null;
}
function E0(e, t, n) {
  let a = e;
  for (const [s, r] of t) {
    const i = n.get(s);
    if (!i || i.size === 0) continue;
    const o = r?.clusterRolloutSchedules?.items ?? [], l = /* @__PURE__ */ new Map();
    for (const c of i) l.set(c, [...o]);
    for (const c of r?.rolloutSchedules?.items ?? []) {
      const u = c?.metadata?.namespace;
      !u || !l.has(u) || l.get(u).push(c);
    }
    for (const [c, u] of l)
      a = ni(a, c, u);
  }
  return a;
}
function L0(e) {
  const t = fr(e), n = [];
  for (const a of e) {
    const s = a.status?.rolloutGateRef?.name;
    if (!a.metadata?.namespace || !a.spec?.rolloutRef?.name || !a.spec?.environment || !s) continue;
    const r = t.get(bs(a)), i = Ei(r, a);
    if (!r || !i || i.env !== a) continue;
    const o = Mi(r, i), l = i.isLeader ? o[0]?.tier === i.tier ? "wave" : "tier" : "follow";
    for (const c of o) {
      const u = c.env;
      !u || !u.metadata?.namespace || !u.spec?.rolloutRef?.name || n.push({ down: a, up: u, gate: s, edgeKind: l });
    }
  }
  return n;
}
function N0(e, t, n) {
  return (e || n || t) === t;
}
function Ui(e) {
  const { rollouts: t, environments: n, dependencies: a, envOrder: s } = e, r = e.gates ?? Va, i = new Map(s.map((k, T) => [k, T])), o = (k) => i.get(k) ?? 900 + s.length, l = /* @__PURE__ */ new Map();
  for (const k of t) {
    const T = k.metadata?.namespace, F = k.metadata?.name;
    !T || !F || l.set(Vo(sn(k), T, F), k);
  }
  const c = /* @__PURE__ */ new Map();
  for (const k of n) {
    const T = k.metadata?.namespace, F = k.spec?.environment;
    T && F && c.set(`${sn(k)}/${T}`, Nn(k, n));
  }
  const u = (k, T) => c.get(`${k}/${T}`) ?? T, f = /* @__PURE__ */ new Map(), p = (k, T, F, z) => {
    const j = Vo(k, T, F);
    let D = f.get(j);
    if (!D) {
      const H = l.get(j);
      D = {
        id: j,
        cluster: k,
        namespace: T,
        name: F,
        // ⛔ `||`, NOT `??`. A caller passing an EMPTY environment name —
        // an `Environment` whose `spec.environment` is `''` — slipped
        // straight through `??` and became a node labelled with nothing,
        // which `DependencyNode` drew as a bordered box with no text in
        // it. Nullish-coalescing is the wrong operator for a field whose
        // empty value is as meaningless as its absence.
        env: z || u(k, T),
        envRank: 0,
        unresolved: !H,
        build: T0(H),
        candidateCount: 0,
        waiting: !1,
        blocked: !1,
        holds: []
      }, D.envRank = o(D.env), f.set(j, D);
    }
    return D;
  }, v = [], y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Set();
  for (const { down: k, up: T, gate: F, edgeKind: z } of L0(n)) {
    const j = k.metadata.namespace, D = k.spec.rolloutRef.name, H = T.metadata.namespace, te = T.spec.rolloutRef.name, ae = p(sn(k), j, D, Nn(k, n)), se = p(sn(T), H, te, Nn(T, n));
    if (se.id === ae.id) continue;
    const G = `promotion:${ae.id}:${F}`, X = b.has(G) ? `${G}:${se.id}` : G;
    b.add(G), v.push({
      key: X,
      from: se.id,
      to: ae.id,
      writer: "promotion",
      gate: F,
      state: "unknown",
      contract: null,
      requiredVersion: null,
      providedVersion: null,
      edgeKind: z,
      message: "",
      cyclic: !1,
      held: []
    });
  }
  for (const k of a) {
    const T = k.metadata?.namespace, F = k.spec?.rolloutRef?.name, z = k.spec?.providerRef?.name, j = k.status?.gateName;
    if (!T || !F || !z || !j) continue;
    const D = sn(k), H = p(D, T, F), te = p(D, k.spec?.providerRef?.namespace || T, z), ae = k.status?.blockedReleases ?? [], se = (k.status?.conditions ?? []).find((X) => X?.type === "Satisfied"), G = `contract:${H.id}:${j}`;
    y.set(G, k), v.push({
      key: G,
      from: te.id,
      to: H.id,
      writer: "contract",
      gate: j,
      state: "unknown",
      contract: k.spec?.contract || z,
      requiredVersion: M0(ae.map((X) => X.requiredVersion ?? null)),
      providedVersion: k.status?.providedVersion ?? null,
      edgeKind: null,
      message: se?.message ?? "",
      cyclic: !1,
      held: []
    });
  }
  if (e.focus) {
    const k = e.focus;
    for (const T of t)
      if (T.metadata?.namespace === k.namespace && T.metadata?.name === k.name && N0(sn(T), k.cluster, k.localCluster)) {
        p(sn(T), k.namespace, k.name);
        break;
      }
  }
  const g = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
  for (const k of f.values()) {
    const T = l.get(k.id);
    T && (g.set(k.id, ks(T)), h.set(
      k.id,
      new Set((T.status?.gates ?? []).map((F) => F?.name).filter(Boolean))
    ));
  }
  const x = (k) => [
    ...new Set(
      k.map((T) => ge(T))
    )
  ], m = (k, T) => {
    const F = k.writer === "contract" ? y.get(k.key) : void 0;
    if (!F) return;
    const z = new Map(
      (F.status?.blockedReleases ?? []).filter((D) => D?.tag && D.requiredVersion).map((D) => [D.tag, D.requiredVersion])
    ), j = /* @__PURE__ */ new Map();
    for (const D of T) {
      const H = D.tag ? z.get(D.tag) : void 0;
      H && j.set(ge(D), H);
    }
    j.size && nu.set(k, j);
  };
  for (const k of v) {
    const T = g.get(k.to), F = h.get(k.to), z = l.get(k.to);
    if (!T || !F)
      k.state = "unknown";
    else if (T.blockingGates.includes(k.gate)) {
      k.state = "blocked";
      const j = $h(z, k.gate);
      k.held = x(j), m(k, j);
    } else if (F.has(k.gate))
      k.state = "clear";
    else {
      k.state = "unknown";
      const j = k.writer === "contract" ? y.get(k.key) : void 0;
      if (j) {
        const D = new Set(
          (j.status?.blockedReleases ?? []).map((ae) => ae?.tag).filter(Boolean)
        ), H = ws(z).filter((ae) => ae.tag && D.has(ae.tag)), te = (j.status?.conditions ?? []).find((ae) => ae?.type === "Satisfied");
        H.length > 0 ? (k.state = "blocked", k.held = x(H), m(k, H)) : te?.status === "True" && (k.state = "clear");
      }
    }
  }
  const C = /* @__PURE__ */ new Map();
  for (const k of v) {
    let T = C.get(k.to);
    T || C.set(k.to, T = /* @__PURE__ */ new Set()), T.add(k.gate);
  }
  const _ = au({ nodes: [...f.values()], edges: v });
  for (const k of f.values()) {
    const T = l.get(k.id);
    if (!T) continue;
    const F = _.get(k.id), z = $n(T, r, { place: k.env, contractHolds: F });
    k.candidateCount = z.candidateCount, k.waiting = z.blocked, k.blocked = z.blocked && !z.selfClearing;
    const j = C.get(k.id) ?? /* @__PURE__ */ new Set();
    k.holds = z.gates.filter((D) => !j.has(D.id) && !D.id.startsWith("contract:")).map((D) => ({
      gate: D.id,
      clears: D.clears,
      short: D.short,
      clearsAt: D.clearsAt,
      pending: D.pending
    })), z.pinnedTo && (k.holds = [
      {
        gate: z.pinnedTo,
        clears: "person",
        short: `Pinned to ${vr(T, z.pinnedTo)}`,
        clearsAt: null
      }
    ]);
  }
  R0(v), v.sort(
    (k, T) => k.writer.localeCompare(T.writer) || k.from.localeCompare(T.from) || k.to.localeCompare(T.to)
  );
  const A = [...f.values()].sort(
    (k, T) => k.name.localeCompare(T.name) || k.envRank - T.envRank || k.env.localeCompare(T.env)
  ), E = new Set(A.map((k) => k.env)), S = s.filter((k) => E.has(k)).concat([...E].filter((k) => !i.has(k)).sort()), w = new Set(A.map((k) => k.id)), L = [...l.keys()].filter((k) => !w.has(k)).length;
  return {
    nodes: A,
    edges: v,
    envs: S,
    blockedEdges: v.filter((k) => k.state === "blocked"),
    hasCycle: v.some((k) => k.cyclic),
    unlinkedRollouts: L
  };
}
function R0(e) {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  for (const o of [...e].sort((l, c) => l.key.localeCompare(c.key))) {
    n.add(o.from), n.add(o.to);
    const l = t.get(o.from);
    l ? l.push(o) : t.set(o.from, [o]);
  }
  const a = 0, s = 1, r = 2, i = /* @__PURE__ */ new Map();
  for (const o of n) i.set(o, a);
  for (const o of [...n].sort()) {
    if (i.get(o) !== a) continue;
    const l = [[o, 0]];
    for (i.set(o, s); l.length > 0; ) {
      const c = l[l.length - 1], u = t.get(c[0]) ?? [];
      if (c[1] >= u.length) {
        i.set(c[0], r), l.pop();
        continue;
      }
      const f = u[c[1]++], p = i.get(f.to);
      p === s ? f.cyclic = !0 : p === a && (i.set(f.to, s), l.push([f.to, 0]));
    }
  }
}
function au(e) {
  const t = new Map(e.nodes.map((a) => [a.id, a])), n = /* @__PURE__ */ new Map();
  for (const a of e.edges) {
    if (a.writer !== "contract" || a.state !== "blocked") continue;
    let s = n.get(a.to);
    s || n.set(a.to, s = /* @__PURE__ */ new Map());
    const r = t.get(a.from)?.name ?? "another service", i = nu.get(a);
    for (const o of a.held) {
      const l = {
        provider: r,
        required: i?.get(o) ?? a.requiredVersion ?? void 0,
        has: a.providedVersion ?? void 0,
        gate: a.gate || void 0
      }, c = s.get(o);
      c ? c.push(l) : s.set(o, [l]);
    }
  }
  return n;
}
function su(e, t, n = t.metadata?.namespace, a) {
  const s = t.metadata?.name, r = e.nodes.filter((o) => o.namespace === n && o.name === s), i = r.length < 2 ? r[0] ?? null : r.find((o) => o.cluster === (sn(t) || (a ?? ""))) ?? r[0];
  return i ? au(e).get(i.id) ?? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Map();
}
class Qn extends Set {
  has(t) {
    if (super.has(t)) return !0;
    if (!t || t.length < 7) return !1;
    const n = t.toLowerCase();
    for (const a of this) {
      if (a.length < 7) continue;
      const s = a.toLowerCase();
      if (s.startsWith(n) || n.startsWith(s)) return !0;
    }
    return !1;
  }
}
function O0(e) {
  const t = new Qn();
  e.mergeCommitSha && t.add(e.mergeCommitSha);
  for (const n of e.containedIn) t.add(n);
  return t;
}
function D0(e, t, n) {
  if (e.revision && t.has(e.revision)) return "contained";
  if (!n.containedInAll) return "not-contained";
  if (!e.created) return "unverified";
  if (!n.mergedAt) return "not-contained";
  const a = new Date(e.created).getTime(), s = new Date(n.mergedAt).getTime();
  return !Number.isFinite(a) || !Number.isFinite(s) ? "unverified" : a < s ? "not-contained" : "contained";
}
function F0(e, t, n) {
  let a = null;
  for (const s of e) {
    const r = D0(s, t, n);
    if (r === "contained") return { release: s, state: r };
    r === "unverified" && !a && (a = s);
  }
  return a ? { release: a, state: "unverified" } : null;
}
function I0(e, t) {
  for (const n of e.status?.availableReleases ?? [])
    if (n.tag === t) return n.revision ?? null;
  for (const n of e.status?.history ?? [])
    if (n.version?.tag === t) return n.version.revision ?? null;
  return null;
}
function P0(e, t) {
  for (const n of e.status?.availableReleases ?? [])
    if (n.tag === t) return ge(n);
  for (const n of e.status?.history ?? [])
    if (n.version?.tag === t) return ge(n.version);
  return t.length > 12 ? t.slice(0, 7) : t;
}
function Lr(e, t, n) {
  if (!e || !t) return null;
  const a = Wi(t);
  if (!a) return null;
  const s = new Date(e).getTime();
  return Number.isFinite(s) ? a - (n.getTime() - s) : null;
}
function j0(e) {
  const t = [];
  for (const n of e.status?.history ?? []) {
    if (!n.bakeStartTime || !n.bakeEndTime) continue;
    const a = new Date(n.bakeStartTime).getTime(), s = new Date(n.bakeEndTime).getTime();
    !Number.isFinite(a) || !Number.isFinite(s) || s <= a || t.push(s - a);
  }
  return t.length < 2 ? null : Yc(t);
}
const ot = {
  since: null,
  bakeLeftMs: null,
  superseded: !1,
  supersededHeadStatus: null,
  gateHint: null,
  gateLabel: null,
  gateSubject: null,
  gateSubjectKind: null,
  gatePending: !1,
  gateApprovalGuess: !1,
  gateContract: null,
  gateRequiredVersion: null,
  gateProvidedVersion: null,
  providerHasNoBuild: !1
};
function Ps(e) {
  return e !== "Deploying" && e !== "InProgress" && e !== "BakeTimeRetrying" && e !== "Failed" && e !== "Cancelled";
}
function W0(e, t) {
  const n = new Date(t).getTime();
  if (!Number.isFinite(n)) return null;
  let a = null, s = !1;
  for (const i of e.services)
    for (const o of i.cells) {
      if (Ha(o.envName) !== "PROD") continue;
      const l = o.historyMatches ?? [];
      let c;
      for (let p = l.length - 1; p >= 0; p--)
        if (Ps(l[p].bakeStatus)) {
          c = l[p];
          break;
        }
      if (!c) continue;
      const u = new Date(c.timestamp).getTime();
      if (!Number.isFinite(u)) continue;
      const f = !!o.firstLandingProven;
      (a == null || u < a || u === a && f) && (a = u, s = f);
    }
  if (!s || a == null) return null;
  const r = a - n;
  return r <= 0 ? null : { at: new Date(a).toISOString(), ms: r };
}
function B0(e, t, n, a, s, r, i, o, l) {
  const c = e.status ?? {}, u = c.history ?? [], f = u[0], p = f?.version?.revision ?? null, v = e.metadata?.namespace ?? "", y = e.metadata?.name ?? "", b = Qt(t), g = j0(e), h = Hi(e), x = u.reduce((w, L, k) => {
    const T = L.version?.revision;
    return T && s.has(T) && w.push({
      revision: T,
      displayVersion: ge(L.version),
      timestamp: L.timestamp,
      bakeStatus: L.bakeStatus ?? "None",
      triggeredBy: L.triggeredBy ?? null,
      act: h[k] ?? null
    }), w;
  }, []);
  let m = null;
  for (let w = u.length - 1; w >= 0; w--) {
    const L = u[w]?.version?.revision;
    if (L && s.has(L)) {
      m = w;
      break;
    }
  }
  const C = m != null && m < u.length - 1, _ = (w) => ({
    cluster: n,
    envName: t,
    envRank: b,
    usuallyMs: g,
    namespace: v,
    rolloutName: y,
    theme: a,
    containmentKnown: l,
    historyMatches: x,
    historyAtLimit: zc(e),
    versionHistoryLimit: e.spec?.versionHistoryLimit ?? 10,
    firstLandingProven: C,
    ...w
  }), A = () => _({
    ...ot,
    state: "not-built",
    reason: "not built (unverified)",
    releaseLabel: "",
    revision: null
  });
  if (p && s.has(p)) {
    const w = f?.bakeStatus ?? "None", L = ge(f.version), k = x.slice(1).find((D) => Ps(D.bakeStatus));
    if (k && !Ps(w))
      return _({
        ...ot,
        state: "live",
        // The landing is the fact; whatever the later build is doing is
        // the qualifier, in the same voice as the `superseded` clause.
        reason: "live · a newer build carrying it is not the one serving",
        // WHEN IT WENT LIVE, not when the current roll started — the
        // same distinction Rule 1's own `since before recorded history`
        // branch draws below.
        since: k.timestamp,
        superseded: !0,
        // ⭐ So the muted note can name what the later build DID.
        // Without this the cell would print "has since shipped" over a
        // build that failed, trading one false statement for another.
        supersededHeadStatus: w,
        releaseLabel: L,
        revision: p
      });
    if (!Ps(w))
      return _(w === "Deploying" ? {
        ...ot,
        state: "deploying",
        reason: "deploying now",
        since: f?.timestamp ?? null,
        bakeLeftMs: Lr(f?.timestamp, e.spec?.deployTimeout, o),
        releaseLabel: L,
        revision: p
      } : w === "InProgress" ? {
        ...ot,
        state: "baking",
        reason: e.spec?.bakeTime ? "baking" : "baking, no timer",
        since: f?.bakeStartTime ?? f?.timestamp ?? null,
        bakeLeftMs: Lr(f?.bakeStartTime, e.spec?.bakeTime, o),
        releaseLabel: L,
        revision: p
      } : w === "BakeTimeRetrying" ? {
        ...ot,
        state: "retrying",
        reason: f?.bakeStatusMessage || "retrying the bake",
        since: f?.bakeStartTime ?? f?.timestamp ?? null,
        bakeLeftMs: Lr(f?.bakeStartTime, e.spec?.bakeTime, o),
        releaseLabel: L,
        revision: p
      } : w === "Failed" ? {
        ...ot,
        state: "failed",
        reason: f?.bakeStatusMessage || "the bake failed",
        since: Vi(f),
        releaseLabel: L,
        revision: p
      } : {
        ...ot,
        state: "cancelled",
        reason: f?.bakeStatusMessage || "the bake was cancelled",
        since: f?.bakeEndTime ?? f?.timestamp ?? null,
        releaseLabel: L,
        revision: p
      });
    const T = u.length ? u[u.length - 1]?.timestamp : null;
    let F = f?.bakeEndTime ?? f?.timestamp ?? null, z = "live";
    if (r.mergedAt && T) {
      const D = new Date(r.mergedAt).getTime(), H = new Date(T).getTime();
      Number.isFinite(D) && Number.isFinite(H) && D < H && (F = null, z = "live (since before recorded history)");
    }
    const j = r.mergeCommitSha != null && p !== r.mergeCommitSha;
    return _({
      ...ot,
      state: "live",
      reason: z,
      since: F,
      superseded: j,
      releaseLabel: L,
      revision: p
    });
  }
  const E = u.find((w, L) => {
    if (L === 0) return !1;
    const k = w.version?.revision;
    return !!k && s.has(k);
  });
  if (E) {
    const w = f?.version ? ge(f.version) : "";
    if (l)
      return _({
        ...ot,
        state: "rolled-back",
        reason: f?.message?.trim() || `rolled back to ${w}`,
        since: f?.timestamp ?? null,
        releaseLabel: w,
        revision: p
      });
    if (E.bakeStatus === "Succeeded")
      return _({
        ...ot,
        state: "live",
        reason: "live · a later build is serving, and whether it carries this change could not be verified",
        since: E.timestamp ?? null,
        superseded: !0,
        releaseLabel: w,
        revision: p
      });
  }
  const S = F0(c.availableReleases ?? [], s, r);
  if (S && S.state === "contained") {
    const w = S.release, L = w.tag ?? w.version ?? w.revision ?? "", k = ge(w), T = e.spec?.wantedVersion;
    if (T) {
      const j = I0(e, T);
      if (!j || !s.has(j))
        return _({
          ...ot,
          state: "pinned",
          reason: `pinned to ${P0(e, T)}`,
          releaseLabel: k,
          revision: w.revision ?? null
        });
    }
    if (C0(w))
      return _({
        ...ot,
        state: "waiting-upstream",
        reason: "manifest unreadable",
        releaseLabel: k,
        revision: w.revision ?? null
      });
    const z = (c.gates ?? []).filter((j) => !ka(j, L));
    if (z.length > 0) {
      const j = z.map((U) => mr(U, v, i)), D = j.find(
        (U) => U.clears === "upstream" && U.subjectKind === "environment"
      ), H = j.find((U) => U.clears === "upstream" && U !== D), te = j.find((U) => U !== D && U !== H), ae = H, se = H ?? D, G = H ?? te ?? D ?? j[0], X = !ae && (G.kind === "approval" || G.kind === "unknown"), re = !!G.pending || X;
      return !te && (H || D) && !l ? A() : _({
        ...ot,
        state: H ? "waiting-upstream" : te ? "gated" : "queued",
        reason: re ? "" : G.short,
        releaseLabel: k,
        revision: w.revision ?? null,
        gateHint: { cluster: n, namespace: v, rolloutName: y, gateName: G.id },
        gateLabel: se || re ? null : G.label,
        gateSubject: se ? G.subject ?? null : null,
        gateSubjectKind: se ? G.subjectKind ?? null : null,
        gatePending: re,
        gateApprovalGuess: re && G.kind === "approval",
        // ⭐ FIX PASS ITEM 5. Only a `'service'`-subject dependency gate
        // (`waiting-upstream`) ever carries these — `classifyGate`'s
        // promotion branch never sets `contract`/`need` (its own
        // `NOTHING_TO_DRAW` spread leaves them `null`), so this is a
        // no-op for `queued`/`gated` even without the extra check.
        gateContract: ae ? G.contract ?? null : null,
        gateRequiredVersion: ae ? G.need ?? null : null,
        // ⭐ FIX PASS ITEM 7 — see `gateProvidedVersion`'s own doc comment.
        gateProvidedVersion: ae ? G.have ?? null : null
      });
    }
    return l ? _({
      ...ot,
      state: "promoting",
      reason: "waiting for the next reconcile",
      releaseLabel: k,
      revision: w.revision ?? null
    }) : A();
  }
  return _({
    ...ot,
    state: "not-built",
    reason: S?.state === "unverified" ? "not built (unverified)" : "not built here yet",
    releaseLabel: "",
    revision: null
  });
}
function z0(e, t) {
  if (!t.mergeCommitSha) return !1;
  const n = e.status ?? {}, a = n.history ?? [], s = new Qn([t.mergeCommitSha]);
  if (a.some((r) => !!r.version?.revision && s.has(r.version.revision))) return !0;
  for (const r of n.availableReleases ?? [])
    if (r.revision && s.has(r.revision)) return !0;
  return !1;
}
function H0(e) {
  return e.state !== "not-built" || e.reason !== "not built here yet" ? e : { ...e, state: "queued", reason: `not offered to ${e.envName} yet` };
}
function V0(e) {
  return Qt(e) >= 7;
}
function U0(e) {
  const t = [];
  for (const n of e.status?.history ?? []) {
    const a = n.version ? ge(n.version) : "";
    if (!a || !n.timestamp) continue;
    const s = new Date(n.timestamp).getTime();
    Number.isFinite(s) && t.push({
      version: a,
      ms: s,
      inFlight: n.bakeStatus === "InProgress" || n.bakeStatus === "Deploying"
    });
  }
  return t;
}
function q0(e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e) {
    const s = t.get(a.envName) ?? [];
    s.push(a), t.set(a.envName, s);
  }
  const n = [];
  for (const [a, s] of t)
    n.push({
      label: a,
      order: Qt(a),
      prod: V0(a),
      deploys: s.flatMap((r) => U0(r.rollout))
    });
  return n;
}
const G0 = {
  "not-built": "not built",
  gated: "held",
  pinned: "pinned",
  "waiting-upstream": "waiting",
  queued: "queued",
  promoting: "promoting",
  deploying: "deploying",
  baking: "baking",
  retrying: "retrying",
  failed: "failed",
  cancelled: "cancelled",
  "rolled-back": "rolled back",
  live: "live"
};
function K0(e) {
  return e.length === 0 ? "no environments" : [...e].sort((t, n) => t.envRank - n.envRank || t.cluster.localeCompare(n.cluster)).map((t) => `${G0[t.state]} in ${t.envName}`).join(" · ");
}
const Y0 = /* @__PURE__ */ new Set(["gated", "waiting-upstream", "pinned"]), $0 = /* @__PURE__ */ new Set(["deploying", "baking", "retrying"]);
function Q0(e) {
  const t = e.length;
  if (t === 0) return "no environments";
  const n = e.filter((i) => i.state === "live").length;
  if (n > 0) return `${n} of ${t} live`;
  const a = e.filter((i) => Y0.has(i.state));
  if (a.length > 0)
    return `held in ${[...new Set(a.map((o) => Ha(o.envName).toLowerCase()))].join(" · ")}`;
  if (e.filter((i) => i.state === "not-built").length === t) return "no release";
  const r = e.filter((i) => $0.has(i.state)).length;
  return r > 0 ? `${r} of ${t} active` : `${t} in progress`;
}
const Uo = {
  "not-built": "not built",
  gated: "held",
  pinned: "pinned",
  "waiting-upstream": "held",
  // ⭐ FIX PASS ITEM 4/5. `queued` is the NORMAL promotion-order wait — it
  // gets its own neutral word, never `held` (amber's one reserved
  // meaning, per `PrState`'s own doc comment).
  queued: "queued",
  promoting: "promoting",
  deploying: "deploying",
  baking: "baking",
  retrying: "retrying",
  failed: "failed",
  cancelled: "cancelled",
  "rolled-back": "rolled back",
  live: "live"
};
function Z0(e) {
  switch (e) {
    case "failed":
      return "failed";
    case "gated":
    case "pinned":
    case "waiting-upstream":
      return "held";
    default:
      return "active";
  }
}
function X0(e) {
  return e.state === "gated" ? e.gateLabel ? `by ${e.gateLabel}` : null : e.state === "waiting-upstream" ? `on ${e.gateSubject ?? "its upstream"}` : e.state === "queued" ? `waiting for ${e.gateSubject ?? "an earlier environment"} first` : null;
}
function qo(e) {
  return !e || e.split(" ")[0].includes("-") ? e : `${e[0].toUpperCase()}${e.slice(1)}`;
}
function J0(e) {
  const n = e.flatMap((l) => l.cells.map((c) => ({ cell: c, appName: l.appName }))).filter((l) => l.cell.state !== "not-built");
  if (n.length === 0) return { word: "no release for this commit yet", tone: "not-built" };
  if (n.every((l) => l.cell.state === "live"))
    return { word: "live everywhere", tone: "live" };
  const a = n.filter((l) => l.cell.state !== "live"), s = qc(a), r = X0(s.cell), i = r ? `${s.appName} ${Uo[s.cell.state]} in ${s.cell.envName} ${r}` : `${s.appName} ${Uo[s.cell.state]} in ${s.cell.envName}`, o = s.cell.providerHasNoBuild && s.cell.gateContract && s.cell.gateRequiredVersion ? ` · will not move on its own — needs ${s.cell.gateSubject} ${s.cell.gateContract} ${s.cell.gateRequiredVersion}` : "";
  return { word: `${i}${o}`, tone: Z0(s.cell.state) };
}
function e2(e, t) {
  const n = new Map(e.map((a) => [a.appName, a]));
  return e.map((a) => ({
    ...a,
    cells: a.cells.map((s) => {
      if (s.state !== "waiting-upstream" || s.gateSubjectKind !== "service" || !s.gateSubject)
        return s;
      if (t.has(s.gateSubject))
        return { ...s, providerHasNoBuild: !0 };
      const r = n.get(s.gateSubject);
      if (!r) return s;
      if (!r.cells.some((l) => l.state !== "not-built"))
        return { ...s, providerHasNoBuild: !0 };
      const o = r.cells.find(
        (l) => l.envName === s.envName && l.cluster === s.cluster
      );
      return !o || o.state !== "live" ? { ...s, reason: `waiting on ${s.gateSubject} to reach ${s.envName}` } : s;
    })
  }));
}
function t2(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of n.cells)
      a.state === "waiting-upstream" && a.gateSubjectKind === "service" && a.gateSubject && a.gateContract && a.gateRequiredVersion && !t.has(a.gateSubject) && t.set(a.gateSubject, {
        contract: a.gateContract,
        need: a.gateRequiredVersion
      });
  return t.size === 0 ? [...e] : e.map((n) => ({
    ...n,
    cells: n.cells.map((a) => {
      if (a.state !== "waiting-upstream" || a.gateSubjectKind !== "service" || !a.gateSubject || a.gateRequiredVersion)
        return a;
      const s = t.get(a.gateSubject);
      if (!s) return a;
      const r = `a newer ${s.contract}`, i = `${s.contract} ${s.need}`;
      return {
        ...a,
        reason: a.reason.includes(r) ? a.reason.replace(r, i) : a.reason,
        gateContract: s.contract,
        gateRequiredVersion: s.need
      };
    })
  }));
}
function n2(e) {
  return e.map((t, n) => ({
    ...t,
    builtElsewhere: e.some(
      (a, s) => s !== n && a.cells.some((r) => r.state !== "not-built")
    )
  }));
}
function a2(e, t) {
  const n = Gh(e, { place: t });
  if (!n) return null;
  const a = `${t} is `;
  return n.startsWith(a) ? n.slice(a.length) : n;
}
function s2(e, t, n) {
  return Ui({
    rollouts: e,
    environments: t,
    dependencies: n?.items ?? [],
    envOrder: [],
    gates: Ii({ environments: { items: t }, rolloutDependencies: n })
  });
}
function r2(e, t, n, a, s = /* @__PURE__ */ new Date(), r = {}) {
  const i = O0(e), o = Ii({
    environments: { items: n },
    rolloutDependencies: a
  }), l = r.graph ?? Ui({
    rollouts: t,
    environments: n,
    dependencies: a?.items ?? [],
    envOrder: [],
    gates: o
  }), c = !e.containedInUnknown && e.containmentKnown, u = Sc(`github.com/${e.owner}/${e.repo}`, ""), f = Cc(t, n);
  let p = [];
  const v = [];
  for (const E of f.values()) {
    const S = E.cells.filter((k) => k.repoKey === u);
    if (S.length === 0) continue;
    if (!S.some((k) => z0(k.rollout, e))) {
      v.push(E.appName);
      continue;
    }
    const w = S.map((k, T) => {
      const F = B0(
        k.rollout,
        k.envName,
        k.sourceCluster,
        k.theme,
        i,
        e,
        o,
        s,
        c
      ), z = S.filter((re, R) => R !== T).map((re) => ({ envName: re.envName, rollout: re.rollout })), j = !!Vc(k.rollout, z, { now: s, gateContext: o }), D = su(
        l,
        k.rollout,
        k.rollout.metadata?.namespace,
        k.sourceCluster
      ), H = $n(k.rollout, o, { place: F.envName, now: s, contractHolds: D }), te = Ac(H, F.envName), ae = te.held, se = ae ? a2(H, F.envName) : null, G = te.waitsForEnv, X = te.cause === "person" ? !0 : F.state === "gated" && F.gateApprovalGuess === !0;
      return { ...F, stuck: j, held: ae, holdCause: se, waitsForEnv: G, approvalWait: X };
    }).map(H0).sort((k, T) => k.envRank - T.envRank || k.cluster.localeCompare(T.cluster)), L = Pm(q0(S));
    p.push({
      appName: E.appName,
      sourceRepo: ti(S[0].repoKey),
      cells: w,
      furthest: K0(w),
      furthestCompact: Q0(w),
      leadTimeMs: L?.medianMs ?? null,
      builtElsewhere: !1
      // placeholder — `withBuiltElsewhere` fills the real value below
    });
  }
  p = n2(
    t2(e2(p, new Set(v)))
  );
  const y = p.flatMap((E) => E.cells), b = y.length, g = y.filter((E) => E.state !== "not-built").length, h = y.filter((E) => E.state === "live").length, x = p.length > 0 || v.length > 0, m = x && p.length === 0;
  let C, _, A;
  return x ? m ? (C = "no release for this commit", _ = "not-built", A = qo(C)) : ({ word: C, tone: _ } = J0(p), A = qo(C)) : (C = "not built here", _ = "not-built", A = "No service on this cluster deploys this repository"), {
    services: p,
    verdict: A,
    verdictWord: C,
    verdictTone: _,
    containmentKnown: c,
    rolloutsTotal: b,
    rolloutsWithBuild: g,
    rolloutsLive: h,
    unaffectedServices: v,
    noRelease: m
  };
}
function i2(e, t) {
  return `${_s(e, t)} ago`;
}
const o2 = /* @__PURE__ */ new Set([
  "not built here yet",
  // ⭐ ROUND 3 (2026-09-10 ruling A). `cellStateSentence` speaks this reason
  // as "release status unknown" now (see its own doc) — the string no
  // longer matches literally, so it needs its own redundancy entry to stay
  // suppressed rather than printing the raw internal reason underneath.
  "not built (unverified)",
  "deploying now",
  "retrying the bake",
  "the bake failed",
  "the bake was cancelled"
]);
function l2(e, t) {
  const n = "baking";
  if (e.bakeLeftMs == null || !e.since) return n;
  const a = new Date(e.since).getTime();
  if (!Number.isFinite(a)) return n;
  const s = t.getTime() - a, r = s + e.bakeLeftMs;
  if (r <= 0) return n;
  const i = Math.max(0, Math.round(s / 6e4)), o = Math.max(i, Math.round(r / 6e4));
  return `${n} · ${i} of ${o} min`;
}
function ru(e, t = /* @__PURE__ */ new Date(), n) {
  switch (e.state) {
    case "not-built":
      return e.reason === "not built (unverified)" ? "release status unknown" : "no release yet";
    case "gated":
      return e.holdCause ? e.holdCause : e.gateLabel ? `held by ${e.gateLabel}` : e.gateApprovalGuess ? "held for approval" : "held by a rule";
    case "pinned":
      return e.reason;
    case "waiting-upstream":
      return `waiting on ${e.gateSubject ?? "its upstream"}`;
    case "queued":
      return `waiting for ${e.gateSubject ?? "its upstream"} to deploy it first`;
    case "promoting":
      return "promoting shortly";
    case "deploying":
      return "deploying";
    case "baking":
      return l2(e, t);
    case "retrying":
      return "retrying";
    case "failed":
      return "failed";
    case "cancelled":
      return "cancelled";
    case "rolled-back":
      return `rolled back to ${e.releaseLabel}`;
    case "live":
      return e.since ? `live since ${i2(e.since, t)}` : e.reason;
    default:
      return e.reason;
  }
}
function c2(e, t = /* @__PURE__ */ new Date()) {
  if (e.state === "baking") return null;
  if (e.state === "live") {
    if (!e.superseded) return null;
    switch (e.supersededHeadStatus) {
      case "Failed":
        return "a later build that also carries this change failed its bake";
      case "Cancelled":
        return "a later build that also carries this change had its bake cancelled";
      case "Deploying":
      case "InProgress":
      case "BakeTimeRetrying":
        return "a later build that also carries this change is deploying now";
      default:
        return "a later build that also carries this change has since shipped";
    }
  }
  if (!e.reason || o2.has(e.reason)) return null;
  const n = ru(e, t);
  return e.reason.trim().toLowerCase() === n.trim().toLowerCase() ? null : e.reason;
}
function u2(e) {
  return `usually ${Math.max(1, Math.round(e / 6e4))} min once it starts`;
}
const d2 = /* @__PURE__ */ new Set(["queued", "promoting"]);
function f2(e) {
  return !d2.has(e.state) || e.usuallyMs == null ? null : u2(e.usuallyMs);
}
const Go = {
  failed: 0,
  gated: 1,
  pinned: 1,
  "waiting-upstream": 1,
  deploying: 2,
  baking: 2,
  retrying: 2,
  cancelled: 3,
  "rolled-back": 4,
  // `queued` ties `promoting`'s own tier — both are the SAME "nothing is
  // wrong, just not this cell's turn yet" tier, worse than `not-built`
  // (a build exists) but never as loud as a held/failed/in-flight state.
  promoting: 5,
  queued: 5,
  "not-built": 6,
  live: 7
};
function iu(e) {
  return e.reduce((t, n) => Go[n.state] < Go[t.state] ? n : t);
}
function ri(e) {
  switch (e) {
    case "failed":
      return "failed";
    case "gated":
    case "pinned":
    case "waiting-upstream":
      return "held";
    case "not-built":
      return "not-built";
    case "live":
      return "live";
    default:
      return "active";
  }
}
function In(e) {
  if (e === "queued") return "queued";
  switch (ri(e)) {
    case "held":
      return "stuck";
    case "not-built":
      return "none";
    default:
      return ri(e);
  }
}
const Ko = { DEV: 0, TEST: 1, STAGING: 2, PROD: 3 };
function p2(e) {
  return Ko[e] ?? Object.keys(Ko).length;
}
function v2(e, t, n) {
  const a = [], s = /* @__PURE__ */ new Map();
  for (const r of e) {
    const i = Ha(r.envName);
    let o = s.get(i);
    o || (o = [], s.set(i, o), a.push(i)), o.push(r);
  }
  return a.map((r) => {
    const i = s.get(r), o = iu(i), l = i.map((c) => `${c.envName}: ${ru(c, t)}`).join("; ");
    return {
      family: r,
      familyOrder: p2(r),
      count: i.length,
      state: o.state,
      tone: In(o.state),
      sentence: l,
      href: Ri(o.cluster, o.namespace, o.rolloutName),
      theme: o.theme,
      approvalWait: o.state === "gated" && o.approvalWait === !0
    };
  });
}
function Yo(e) {
  return e.map((t) => `${t.family}:${t.state}`).join("|");
}
const $o = {
  failed: 0,
  held: 1,
  active: 2,
  "not-built": 3,
  live: 4
};
function h2(e, t, n) {
  return [...e].sort((a, s) => $o[t(a)] - $o[t(s)] || n(a).localeCompare(n(s)));
}
function m2(e, t = /* @__PURE__ */ new Date()) {
  const n = e.services.map((i) => {
    const o = i.cells.length ? iu(i.cells) : null;
    return {
      appName: i.appName,
      marks: v2(i.cells, t, i.builtElsewhere),
      verdictWord: o ? ri(o.state) : "live",
      landedCount: i.cells.filter((l) => l.state === "live").length,
      total: i.cells.length
    };
  });
  if (n.length === 0)
    return { services: n, allSameLabel: null, visible: [], overflow: null };
  const a = Yo(n[0].marks);
  if (n.every((i) => Yo(i.marks) === a))
    return {
      services: n,
      allSameLabel: `all ${n.length} service${n.length === 1 ? "" : "s"}`,
      visible: n,
      overflow: null
    };
  const r = h2(
    n,
    (i) => i.verdictWord,
    (i) => i.appName
  );
  return { services: n, allSameLabel: null, visible: r, overflow: null };
}
function g2(e) {
  if (!e) return "";
  const t = e.indexOf("@sha1:"), n = t >= 0 ? e.slice(t + 6) : e;
  return /^[0-9a-f]{7,64}$/i.test(n) ? n : "";
}
function b2(e) {
  return e.verdictTone !== "live";
}
function w2(e) {
  const t = e.services.flatMap((a) => a.cells).filter((a) => a.state !== "not-built");
  if (t.length === 0 || t.every((a) => a.state === "live")) return null;
  const n = t.filter((a) => a.state !== "live").map((a) => ({ cell: a }));
  return qc(n)?.cell ?? null;
}
function k2(e, t) {
  if (!e) return null;
  const n = c2(e, t), a = f2(e);
  return n && a ? `${n} · ${a}` : n ?? a ?? null;
}
function _2(e, t) {
  const n = lu({ grid: t }), a = n.findIndex((o) => o.tone !== "live");
  if (a === -1 || n[a].builtCount === 0) return null;
  const s = n[a], r = (o) => s.tone === "stuck" ? ou.has(o) : s.tone === "failed" ? o === "failed" : o !== "not-built";
  let i = null;
  for (const o of e.services)
    for (const l of o.cells) {
      if (Ha(l.envName) !== s.family || !r(l.state) || !l.since) continue;
      const c = new Date(l.since).getTime();
      Number.isFinite(c) && (i == null || c > i) && (i = c);
    }
  return i != null ? new Date(i).toISOString() : null;
}
function y2(e, t) {
  const n = A2({ grid: t, services: e.services });
  if (!n || n.builtCount === 0 || n.anyResolved) return null;
  const a = (i) => i === "rolled-back" ? !1 : n.tone === "stuck" ? ou.has(i) : n.tone === "failed" ? i === "failed" : i !== "not-built";
  let s = null, r = -1 / 0;
  for (const i of e.services)
    for (const o of i.cells) {
      if (Ha(o.envName) !== n.family || !a(o.state)) continue;
      const l = o.since ? new Date(o.since).getTime() : -1 / 0;
      (s === null || l >= r) && (s = o, r = l);
    }
  return s;
}
function x2(e, t) {
  return W0(e, t)?.ms ?? null;
}
function S2(e, t, n, a, s, r) {
  const i = {
    owner: e.owner,
    repo: e.repo,
    number: e.number ?? 0,
    mergedAt: e.mergedAt,
    mergeCommitSha: e.mergeCommitSha,
    containedIn: e.containedIn,
    containedInAll: e.containedInAll,
    // ⭐ FIX PASS ITEM 1 (2026-09-10). `GET /api/github/changes` computes
    // `containedIn`/`containedInAll` for EVERY row (the module doc above)
    // — an empty `containedIn` here is a REAL, server-verified answer
    // ("nothing merged after this yet"), never the bare-sha stub's
    // ambiguity. Leaving this unset let `buildPrPipeline`'s own default
    // (`containedIn.length > 0 || containedInAll`) read the newest change
    // (empty `containedIn`, `containedInAll: false`) as UNKNOWN and print
    // "not built yet" over a HELD release that genuinely exists.
    containmentKnown: !0
  }, o = r2(i, t, n, a, s, { graph: r }), l = { word: o.verdictWord, tone: o.verdictTone }, c = w2(o), u = m2(o, s), f = e.kind === "pr" && e.number != null ? Za(e.owner, e.repo, { number: e.number }) : Za(e.owner, e.repo, { sha: e.mergeCommitSha }), p = y2(o, u), v = (() => {
    const g = g2(p?.revision) || p?.revision || null;
    return !g || new Qn([e.mergeCommitSha]).has(g) || !new Qn(e.containedIn).has(g) ? null : g;
  })(), y = v ? v.slice(0, 7) : null, b = v ? Za(e.owner, e.repo, { sha: v }) : null;
  return {
    owner: e.owner,
    repo: e.repo,
    repoKey: `${e.owner}/${e.repo}`.toLowerCase(),
    kind: e.kind,
    number: e.number,
    title: e.title,
    sha: e.mergeCommitSha,
    shortSha: e.mergeCommitSha.slice(0, 7),
    href: f,
    htmlUrl: e.htmlUrl,
    author: e.author,
    mergedAt: e.mergedAt,
    verdictWord: l.word,
    verdictTone: l.tone,
    grid: u,
    notEverywhere: b2(o),
    prodLeadMs: x2(o, e.mergedAt),
    frontierReason: k2(c, s),
    frontierSince: _2(o, u),
    noRelease: o.noRelease,
    carrierSha: y,
    carrierHref: b,
    services: o.services
  };
}
function C2(e, t, n, a, s = /* @__PURE__ */ new Date()) {
  if (e.length === 0) return [];
  const r = s2(t, n, a);
  return e.map((i) => S2(i, t, n, a, s, r));
}
const ou = /* @__PURE__ */ new Set(["gated", "waiting-upstream", "pinned"]);
function A2(e) {
  const t = lu(e), n = t.find((i) => i.tone === "failed");
  if (n) return n;
  const a = t.find((i) => i.tone === "stuck");
  if (a) return a;
  let s = -1;
  for (let i = 0; i < t.length; i++)
    t[i].liveCount > 0 && (s = i);
  if (s !== -1 && t[s].liveCount < t[s].builtCount)
    return t[s];
  const r = t.findIndex((i) => i.tone !== "live" || i.liveCount < i.builtCount);
  return r === -1 ? null : t[r];
}
function lu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e.grid.services)
    for (const o of i.marks) {
      const l = t.get(o.family);
      l ? l.push(o) : t.set(o.family, [o]);
    }
  const n = e.services ? (() => {
    const i = /* @__PURE__ */ new Map();
    for (const o of e.services)
      for (const l of o.cells) {
        const c = Ha(l.envName);
        (i.get(c) ?? i.set(c, []).get(c)).push(l);
      }
    return i;
  })() : null;
  if (t.size === 0)
    return [
      {
        family: "DEV",
        familyOrder: 0,
        tone: "none",
        state: null,
        builtCount: 0,
        liveCount: 0,
        sentence: "",
        approvalWait: !1,
        resolved: !1,
        anyResolved: !1
      },
      {
        family: "STAGING",
        familyOrder: 2,
        tone: "none",
        state: null,
        builtCount: 0,
        liveCount: 0,
        sentence: "",
        approvalWait: !1,
        resolved: !1,
        anyResolved: !1
      },
      {
        family: "PROD",
        familyOrder: 3,
        tone: "none",
        state: null,
        builtCount: 0,
        liveCount: 0,
        sentence: "",
        approvalWait: !1,
        resolved: !1,
        anyResolved: !1
      }
    ];
  const a = [...t.entries()].sort(
    (i, o) => Gn.indexOf(dt(i[0].toLowerCase())) - Gn.indexOf(dt(o[0].toLowerCase()))
  ), s = [];
  let r = !1;
  for (const [i, o] of a) {
    const l = o[0].familyOrder, c = o.map((x) => x.sentence).join("; "), u = n?.get(i);
    let f, p, v, y, b = !1, g = !1;
    if (u && u.length > 0) {
      const x = u.filter((m) => m.state !== "not-built");
      if (f = x.map((m) => ({ tone: In(m.state), state: m.state })), p = x.filter((m) => m.state === "live").length, g = x.some((m) => m.state === "rolled-back"), x.length === 0)
        v = "none", y = "not-built";
      else if (p === x.length)
        v = "live", y = null;
      else {
        const m = x.find((_) => In(_.state) === "failed"), C = x.find((_) => In(_.state) === "stuck" && Uc(_));
        if (m)
          v = "failed", y = m.state;
        else if (C)
          v = "stuck", y = C.state, b = C.approvalWait ?? !1;
        else if (p > 0)
          v = "live", y = null;
        else {
          const _ = x.find(
            (S) => S.state !== "rolled-back" && In(S.state) === "active"
          ), A = x.find((S) => In(S.state) === "queued"), E = x.find((S) => In(S.state) === "stuck");
          _ ? (v = "active", y = _.state) : A ? (v = "queued", y = A.state) : E ? (v = "queued", y = E.state) : (v = "active", y = "rolled-back");
        }
      }
    } else {
      const x = o.filter((m) => m.tone !== "none");
      if (f = x, p = x.filter((m) => m.tone === "live").length, g = x.some((m) => m.state === "rolled-back"), x.length === 0)
        v = "none", y = "not-built";
      else if (p === x.length)
        v = "live", y = null;
      else {
        const m = x.find((A) => A.tone === "failed"), C = x.find((A) => A.tone === "stuck"), _ = !!C;
        if (m)
          v = "failed", y = m.state;
        else if (C && _)
          v = "stuck", y = C.state, b = C.approvalWait;
        else if (p > 0)
          v = "live", y = null;
        else {
          const A = x.find((S) => S.tone === "active" && S.state !== "rolled-back"), E = x.find((S) => S.tone === "queued");
          if (A)
            v = "active", y = A.state;
          else if (E)
            v = "queued", y = E.state;
          else {
            const S = x.find((w) => w.state === "rolled-back") ?? x[0];
            v = "active", y = S.state;
          }
        }
      }
    }
    const h = y === "rolled-back";
    if (r) {
      s.push({
        family: i,
        familyOrder: l,
        tone: "none",
        state: y,
        builtCount: f.length,
        liveCount: p,
        sentence: c,
        // Frozen (the change cannot have moved further than its own
        // frontier): the family's own `approvalWait` is moot here, same
        // as its `tone` — nothing downstream reads amber or "waits for
        // you" for a family the walk has already passed.
        approvalWait: !1,
        resolved: h,
        anyResolved: g
      });
      continue;
    }
    s.push({
      family: i,
      familyOrder: l,
      tone: v,
      state: y,
      builtCount: f.length,
      liveCount: p,
      sentence: c,
      approvalWait: b,
      resolved: h,
      anyResolved: g
    }), (v === "stuck" || v === "failed") && (r = !0);
  }
  return s;
}
function T2(e) {
  const t = e.environments?.items ?? [];
  let n = Ii({
    environments: e.environments ?? null,
    rolloutDependencies: e.rolloutDependencies ?? null,
    rolloutGates: e.rolloutGates ?? null,
    schedulesExpected: e.schedulesExpected
  });
  if (e.schedulesByCluster)
    n = E0(
      n,
      e.schedulesByCluster,
      A0(e.rollouts)
    );
  else if (e.schedulesForNamespace)
    n = ni(
      n,
      e.schedulesForNamespace.namespace,
      e.schedulesForNamespace.list
    );
  else if (e.scheduleObjectsByNamespace)
    for (const [r, i] of Object.entries(e.scheduleObjectsByNamespace))
      n = ni(n, r, i);
  const a = Ui({
    rollouts: e.rollouts,
    environments: t,
    dependencies: e.rolloutDependencies?.items ?? [],
    envOrder: e.envOrder ?? [],
    gates: n,
    focus: e.focus
  }), s = (r, i, o) => su(a, r, i, o);
  return {
    gateContext: n,
    providerNetwork: a,
    contractHoldsFor: s,
    storyFor: (r, i = {}) => $n(r, n, { ...i, contractHolds: s(r) })
  };
}
const M2 = ["not-built", "cancelled", "queued", "promoting"], ii = ["gated", "pinned", "waiting-upstream"];
function Na(e) {
  return Ri(e.sourceCluster || "local", e.ns, e.name);
}
function cu(e) {
  return Ks(`/apps/${encodeURIComponent(e)}`);
}
function E2(e) {
  return e == null || e <= 0 ? null : Math.max(1, Math.round(e / 6e4));
}
function L2(e) {
  const t = e?.status?.history ?? [], n = Hi(e), a = /* @__PURE__ */ new Set();
  return n.forEach((s, r) => {
    if (s?.kind === "rollback") {
      const i = t[r + 1]?.version?.revision;
      i && a.add(i.toLowerCase());
    }
  }), a;
}
function N2(e) {
  const t = e?.status?.history?.[0];
  return t?.failedHealthChecks && t.failedHealthChecks.length ? t.version?.revision ?? null : null;
}
function R2(e) {
  return e.map((t) => {
    if (t.checkFailure) return t;
    const n = t.rollout?.status?.history?.[0], a = n?.failedHealthChecks ?? [];
    if (!a.length) return t;
    const s = {
      check: a[0]?.name ?? null,
      detail: a[0]?.message ?? null,
      raw: n?.bakeStatusMessage || a[0]?.message || "health check failing",
      // When it began failing: the failed attempt's own end, falling back to
      // the deploy start only when the entry has none (`historyEntrySince`,
      // the rule `eventAge('failed')` and the failed `PrCell.since` read).
      // `head.timestamp` alone dated the failure from the deploy, so Needs
      // you and Your changes printed two ages for one failure.
      since: Vi(n)
    };
    return { ...t, checkFailure: s };
  });
}
function O2(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const s of e) {
    if (!s.envName) continue;
    const r = n.get(s.name) ?? /* @__PURE__ */ new Map();
    r.set(s.envName, {
      rolledBack: L2(s.rollout),
      failingRev: N2(s.rollout)
    }), n.set(s.name, r);
  }
  const a = /* @__PURE__ */ new Map();
  for (const s of t) {
    if (s.noRelease) continue;
    const r = s.number != null ? `#${s.number}` : s.shortSha, i = n.get(s.repo);
    if (i)
      for (const [o, l] of i) {
        let c = null;
        if (l.failingRev && new Qn([l.failingRev]).has(s.sha) ? c = "failed" : [...l.rolledBack].some((p) => new Qn([p]).has(s.sha)) && (c = "rolled-back"), !c) continue;
        const u = a.get(s.repo) ?? /* @__PURE__ */ new Map(), f = u.get(o) ?? /* @__PURE__ */ new Map();
        f.set(r, c), u.set(o, f), a.set(s.repo, u);
      }
  }
  return a;
}
function D2(e, t, n, a, s, r) {
  if (M2.includes(e.state) || ii.includes(e.state) && e.held === !1) return null;
  const i = {
    ref: t,
    title: n.title,
    href: n.href,
    mergedAt: n.mergedAt,
    since: e.since,
    checkingMinutesLeft: null,
    repo: n.repo,
    // Every service this SAME change affects — not just the one `svc`
    // this cell came from (`ledgerForApp`'s own loop already matched
    // `svc` to the current app before calling this). A row is only ever
    // `noRelease` outside this function (handled separately, in
    // `ledgerForApp`'s own `merged` branch), so `row.services` is
    // populated whenever this function runs.
    apps: (n.services ?? []).map((o) => o.appName)
  };
  if (a === "failed" || e.state === "failed") return { ...i, state: "failed" };
  if (a === "rolled-back" || e.state === "rolled-back")
    return e.state === "live" ? { ...i, state: "rolled-back", liveAgain: !0 } : { ...i, state: "rolled-back" };
  if (e.state === "deploying") return { ...i, state: "deploying" };
  if (e.state === "baking")
    return { ...i, state: "checking", checkingMinutesLeft: E2(e.bakeLeftMs) };
  if (e.state === "retrying") return { ...i, state: "checking" };
  if (ii.includes(e.state)) {
    const o = e.approvalWait ?? e.gateApprovalGuess, l = {
      ...i,
      since: e.since ?? r?.since ?? null,
      state: o ? "awaiting-approval" : "held-by-rule"
    }, c = e.state === "waiting-upstream" && e.gateSubjectKind === "service" ? e.gateSubject : null;
    if (!c) return l;
    const u = e.gateHint;
    return u ? {
      ...l,
      waitsOn: c,
      waitsOnHref: `${Ri(u.cluster || "local", u.namespace, u.rolloutName)}/gates`
    } : { ...l, waitsOn: c };
  }
  return e.state === "live" ? { ...i, state: s ? "healthy" : "superseded" } : null;
}
function F2(e, t, n, a) {
  const s = [...t].sort((f, p) => Date.parse(p.mergedAt) - Date.parse(f.mergedAt)), r = /* @__PURE__ */ new Map(), i = [], o = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), c = [];
  for (const f of s) {
    if (f.noRelease) {
      if (f.repo === e) {
        const b = f.number != null ? `#${f.number}` : f.shortSha;
        i.push({
          ref: b,
          title: f.title,
          href: f.href,
          mergedAt: f.mergedAt,
          since: f.mergedAt,
          checkingMinutesLeft: null,
          state: "not-deployed",
          repo: f.repo,
          apps: [e]
        });
      }
      continue;
    }
    const p = (f.services ?? []).find((b) => b.appName === e);
    if (!p) continue;
    const v = f.number != null ? `#${f.number}` : f.shortSha, y = p.cells.map((b) => {
      const g = n?.get(b.envName)?.get(v);
      let h = !1;
      if (b.state === "live") {
        const m = l.get(b.envName) ?? 0;
        h = m === 0, l.set(b.envName, m + 1);
      }
      const x = ii.includes(b.state) && b.held === !0 ? a?.(b, p.cells) : void 0;
      return D2(b, v, f, g, h, x);
    });
    if (p.cells.some((b) => b.state !== "live")) {
      let b = -1;
      y.forEach((g, h) => {
        !g || g.state === "awaiting-approval" || g.state === "held-by-rule" || (b < 0 || p.cells[h].envRank >= p.cells[b].envRank) && (b = h);
      }), b >= 0 && c.push({
        ref: v,
        env: p.cells[b].envName,
        rank: p.cells[b].envRank,
        change: y[b]
      });
    }
    for (const [b, g] of p.cells.entries()) {
      const h = y[b];
      if (!h) continue;
      const x = o.get(g.envName) ?? 0, m = h.state === "awaiting-approval" || h.state === "held-by-rule";
      if (h.state !== "failed" && h.state !== "rolled-back" && !m) {
        if (x >= 2) continue;
        o.set(g.envName, x + 1);
      }
      const C = r.get(g.envName) ?? [];
      C.push(h), r.set(g.envName, C);
    }
  }
  for (const [f, p] of r) {
    const v = p.filter((b) => b.state === "awaiting-approval" || b.state === "held-by-rule");
    if (v.length <= 1) continue;
    const y = v.reduce(
      (b, g) => Date.parse(b.mergedAt) <= Date.parse(g.mergedAt) ? b : g
    );
    r.set(
      f,
      p.filter(
        (b) => b.state !== "awaiting-approval" && b.state !== "held-by-rule" ? !0 : b === y
      )
    );
  }
  const u = /* @__PURE__ */ new Map();
  for (const [f, p] of r)
    for (const v of p)
      u.set(v.ref, Math.max(u.get(v.ref) ?? -1 / 0, Qt(f)));
  for (const f of c) {
    if ((u.get(f.ref) ?? -1 / 0) >= f.rank) continue;
    const p = r.get(f.env) ?? [];
    p.push(f.change), r.set(f.env, p);
  }
  return { byEnv: r, merged: i };
}
function $s(e) {
  return e.statusKey === "failed" || e.checkFailure != null ? "failed" : e.rolledBack && e.bakeStatus !== "Deploying" && e.bakeStatus !== "InProgress" && !e.held ? "rolled-back" : Oi(e) ? e.heldCause === "person" ? "awaiting-approval" : "held-by-rule" : e.bakeStatus === "Deploying" ? "deploying" : e.bakeStatus === "InProgress" || e.stuck != null ? "checking" : !e.version || e.statusKey === "pending" || e.bakeStatus === "None" ? "not-deployed" : "healthy";
}
function I2(e, t) {
  return t && e.replace(/^prod-?/i, "") || e;
}
function P2(e, t, n) {
  const a = e.rollout, s = a ? Lm(
    a,
    t,
    n
  ) : [], r = a ? Om(a, s) : { tracks: [{ name: "", stages: ["pending"] }], bake: "pending" }, i = r.tracks.map((l) => ({
    name: l.name || null,
    stages: l.stages.map((c) => ({ state: c }))
  }));
  let o = null;
  for (const l of r.tracks) {
    const c = l.stages.indexOf("active");
    if (c >= 0) {
      o = { index: c + 1, total: l.stages.length };
      break;
    }
  }
  return { tracks: i, bake: r.bake, activeStep: o, isFallback: s.length === 0 };
}
function j2(e, t, n, a) {
  return [
    ...e.stages.map((r) => ({ node: r, isProdRegion: !1 })),
    ...e.prod.map((r) => ({ node: r, isProdRegion: !0 }))
  ].map(({ node: r, isProdRegion: i }) => ({
    env: r.card.envName,
    label: I2(r.card.envName, i),
    tier: r.tier,
    isProdRegion: i,
    state: $s(r.card),
    version: r.card.version,
    arrivedAt: r.card.timestamp,
    heldSince: du($s(r.card)) === "held" ? ha(r.card, "held") : null,
    myChanges: t.byEnv.get(r.card.envName) ?? [],
    pipeline: P2(r.card, n, a),
    href: Na(r.card)
  }));
}
function W2(e, t, n, a, s) {
  const r = /* @__PURE__ */ new Map();
  for (const l of n) r.set(l.mergeCommitSha.slice(0, 7).toLowerCase(), l);
  const i = S0({
    cards: e,
    lanes: t,
    healthChecks: s ? wh(s) : null,
    prFor: (l) => {
      const c = r.get(l.toLowerCase());
      return c ? {
        number: c.number != null ? String(c.number) : null,
        title: c.title,
        // the change page, addressed as the Changes list addresses it
        href: c.kind === "pr" && c.number != null ? Za(c.owner, c.repo, { number: c.number }) : Za(c.owner, c.repo, { sha: c.mergeCommitSha }),
        author: c.author
      } : null;
    },
    isApproval: (l) => l.heldCause === "person",
    now: a,
    href: Na,
    appHref: cu
  }), o = /* @__PURE__ */ new Set([...w0, "failed"]);
  return i.filter((l) => o.has(l.kind)).map((l) => ({
    key: l.key,
    kind: l.kind,
    app: l.app,
    env: l.env,
    phrase: l.evidence || l.kind,
    facts: l.facts ?? null,
    since: l.since,
    ageMs: Math.max(0, a.getTime() - Date.parse(l.since)),
    href: l.href
  }));
}
function B2(e) {
  return e === "person" ? "approval" : e === "order" ? "order" : e === "dependency" ? "dependency" : "other";
}
function uu(e) {
  if (e.checkFailure) return "failed-healthcheck";
  if (e.statusKey === "failed")
    return e.failureCategory === "healthcheck" || jc(e.bakeStatusMessage) === "healthcheck" ? "failed-healthcheck" : "failed-deploy";
  if (e.stuck != null) return "stuck";
  switch (e.heldCause) {
    case "person":
      return "approval";
    case "dependency":
      return "dependency";
    case "order":
      return "order";
    case "clock":
      return "clock";
    case "check":
      return "check";
    default:
      return e.pinnedVersion != null ? "pinned" : "rule";
  }
}
function z2(e, t) {
  const n = uu(e);
  if (n === "check") {
    const a = t?.(e).checks;
    return a ? { reason: n, checks: a } : { reason: n };
  }
  if (n === "dependency") {
    const a = t?.(e).provider;
    return a ? { reason: n, provider: a } : { reason: n };
  }
  return { reason: n };
}
function H2(e) {
  switch (e) {
    case "failed-healthcheck":
      return /* @__PURE__ */ eu();
    case "failed-deploy":
      return /* @__PURE__ */ tu();
    case "stuck":
      return /* @__PURE__ */ i0();
    case "approval":
      return /* @__PURE__ */ o0();
    case "dependency":
      return /* @__PURE__ */ l0();
    case "order":
      return /* @__PURE__ */ c0();
    case "clock":
      return /* @__PURE__ */ u0();
    case "check":
      return /* @__PURE__ */ d0();
    case "pinned":
      return /* @__PURE__ */ f0();
    case "rule":
      return /* @__PURE__ */ zg();
  }
}
function Ns(e) {
  return us(e) ? 0 : e.heldCause === "person" ? 1 : 2;
}
function V2(e) {
  return us(e) ? "failed" : e.heldCause ?? "other";
}
function U2(e, t, n) {
  return (a) => {
    const s = $n(a.rollout, e, {
      contractHolds: t(a.rollout),
      now: n
    }), r = [...new Set(s.gates.filter((o) => o.clears === "check").map((o) => o.id))], i = [
      ...new Set(
        s.gates.filter((o) => o.kind === "dependency" && o.subjectKind === "service" && o.subject).map((o) => o.subject)
      )
    ];
    return {
      ...r.length ? { checks: r } : {},
      ...i.length === 1 ? { provider: i[0] } : {}
    };
  };
}
function q2(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of e) {
    if (!a.envName || !us(a) && !Oi(a)) continue;
    const s = `${a.name}|${V2(a)}`, r = n.get(s);
    (!r || Ns(a) < Ns(r)) && n.set(s, a);
  }
  return [...n.values()].sort((a, s) => a.name.localeCompare(s.name) || Ns(a) - Ns(s)).map((a) => ({
    app: a.name,
    env: a.envName,
    cause: us(a) ? "other" : B2(a.heldCause),
    phrase: H2(uu(a)),
    facts: z2(a, t),
    href: Na(a)
  }));
}
function G2(e, t, n) {
  const s = Zm(e, (r) => r.heldCause === "person");
  return {
    apps: t.apps,
    mappedApps: t.mappedApps,
    places: t.places,
    prodHealthy: { healthy: s.total - s.failing, total: s.total },
    sinceDelta: t.hasPrev ? { deploys: t.deploys.value, deploysPrev: t.deploys.prev } : null,
    needsYou: q2(e, n)
  };
}
function K2(e, t, n, a) {
  return n.has(e) || t ? "starred" : a ? "active" : "quiet";
}
function du(e) {
  return e === "failed" ? "failed" : e === "deploying" ? "deploying" : e === "checking" ? "checking" : e === "awaiting-approval" || e === "held-by-rule" ? "held" : null;
}
function Y2(e, t) {
  for (const n of [...e.stages, ...e.prod])
    if (n.card.envName !== t && $s(n.card) === "awaiting-approval")
      return {
        label: /* @__PURE__ */ p0({ env: n.card.envName }),
        href: Na(n.card)
      };
  return null;
}
function $2(e, t) {
  const n = {
    figure: null,
    phrase: null,
    facts: { lead: null, since: null },
    primaryAction: null,
    secondaryAction: null
  };
  if (!e?.lead) return n;
  const a = e.lead, s = $s(a.card), r = du(s), i = r ? ha(a.card, r) : null, o = i ? _s(i, t) : null, l = a.card.envName, c = { lead: s, since: i ?? null };
  return s === "failed" ? {
    figure: o,
    phrase: /* @__PURE__ */ v0({ env: l }),
    facts: c,
    primaryAction: { label: /* @__PURE__ */ Vg({ env: l }), href: Na(a.card) },
    secondaryAction: Y2(e, l)
  } : s === "awaiting-approval" ? {
    figure: o,
    phrase: /* @__PURE__ */ h0({ env: l }),
    facts: c,
    primaryAction: { label: /* @__PURE__ */ Ug(), href: Na(a.card) },
    secondaryAction: null
  } : s === "held-by-rule" ? {
    figure: o,
    phrase: /* @__PURE__ */ m0({ env: l }),
    facts: c,
    primaryAction: null,
    secondaryAction: null
  } : s === "deploying" || s === "checking" ? { figure: o, phrase: s === "deploying" ? /* @__PURE__ */ g0({ env: l }) : /* @__PURE__ */ b0({ env: l }), facts: c, primaryAction: null, secondaryAction: null } : n;
}
function Q2(e, t, n) {
  if (!n?.get(e.envName)?.held) return;
  let s = null;
  if (e.revision) {
    const r = new Qn([e.revision]);
    for (const i of t)
      if (!(i.envRank >= e.envRank))
        for (const o of n?.get(i.envName)?.rollout?.status?.history ?? []) {
          const l = o.version?.revision, c = o.timestamp ? Date.parse(o.timestamp) : NaN;
          l && r.has(l) && !Number.isNaN(c) && (s == null || c > s) && (s = c);
        }
  }
  return { since: s != null ? new Date(s).toISOString() : null };
}
function Z2(e) {
  const { changes: t, rollouts: n, environments: a, rolloutDependencies: s, me: r, now: i } = e, o = e.kustomizations ?? [], l = e.kruiseRollouts ?? [], c = e.starredApps ?? /* @__PURE__ */ new Set(), u = e.pulseRange ?? "24h", f = T2({
    rollouts: n,
    environments: { items: a },
    rolloutDependencies: s ?? null,
    schedulesExpected: !1
  }), p = R2(
    Mm(n, a, i, f.gateContext, f.contractHoldsFor)
  ), v = Kc(p), y = new Map(v.map((E) => [E.app, E])), b = Um(p, n, i.getTime(), u), g = C2(
    t,
    n,
    a,
    s ?? null,
    i
  ), h = r.toLowerCase(), x = g.filter((E) => E.author.toLowerCase() === h), m = /* @__PURE__ */ new Map();
  for (const E of x) {
    const S = E.noRelease ? [E.repo] : (E.services ?? []).map((w) => w.appName);
    for (const w of new Set(S)) {
      const L = m.get(w) ?? [];
      L.push(E), m.set(w, L);
    }
  }
  const C = /* @__PURE__ */ new Set([...y.keys(), ...m.keys()]), _ = /* @__PURE__ */ new Map();
  for (const E of p) {
    if (!E.envName) continue;
    const S = _.get(E.name) ?? /* @__PURE__ */ new Map();
    S.set(E.envName, E), _.set(E.name, S);
  }
  const A = [...C].sort().map((E) => {
    const S = y.get(E), w = m.get(E) ?? [], L = O2(p, w).get(E), k = _.get(E), T = F2(
      E,
      w,
      L,
      (te, ae) => Q2(te, ae, k)
    ), { figure: F, phrase: z, facts: j, primaryAction: D, secondaryAction: H } = $2(S, i);
    return {
      app: E,
      tier: K2(E, w.length > 0, c, S),
      figure: F,
      phrase: z,
      facts: j,
      primaryAction: D,
      secondaryAction: H,
      envs: S ? j2(S, T, o, l) : [],
      merged: T.merged,
      href: cu(E)
    };
  });
  return {
    now: i.toISOString(),
    fleet: G2(
      p,
      b,
      U2(f.gateContext, f.contractHoldsFor, i)
    ),
    signals: W2(p, v, t, i, e.healthChecks),
    apps: A
  };
}
const ds = /* @__PURE__ */ new Date("2026-01-01T00:00:00Z"), oi = "", X2 = (e = ds) => ({ changes: [], rollouts: [], environments: [], rolloutDependencies: { items: [] }, kustomizations: [], kruiseRollouts: [], me: "", now: e, healthChecks: [] }), J2 = [], eb = {
  changes: J2
};
let fu = /* @__PURE__ */ Ee(null);
const hn = () => d(fu), tb = (e) => {
  me(fu, e);
}, la = {
  failed: 0,
  "awaiting-approval": 1,
  "held-by-rule": 2,
  deploying: 3,
  checking: 4,
  "rolled-back": 5,
  "not-deployed": 6,
  healthy: 7,
  superseded: 8
}, Qo = (e) => e === "failed" ? "danger" : e === "awaiting-approval" ? "held" : e === "held-by-rule" ? "neutral" : e === "deploying" || e === "checking" ? "active" : e === "healthy" ? "success" : "neutral", Nr = {
  failed: "Failing in",
  "awaiting-approval": "Waits for approval in",
  "held-by-rule": "Held in",
  deploying: "Deploying to",
  checking: "Checking in"
};
function nb(e) {
  if (e.length === 1) return e[0].env;
  const t = e.filter((n) => n.isProdRegion);
  return t.length === e.length ? `${t.length} prod regions` : `${e.length} places`;
}
const Zo = /* @__PURE__ */ new WeakMap();
function pu() {
  const e = hn()?.changes ?? eb.changes;
  let t = Zo.get(e);
  if (t) return t;
  const n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  for (const s of e) {
    n.has(s.repo) || n.set(s.repo, s.author);
    const r = s.htmlUrl.split("/").pop() ?? "";
    a.has(s.repo) || a.set(s.repo, { ref: /^\d+$/.test(r) ? `#${r}` : r.slice(0, 7), title: s.title });
  }
  return Zo.set(e, t = { owners: n, newest: a }), t;
}
function ab(e) {
  for (const [t, n] of pu().newest) if (e === t || e.startsWith(t)) return n;
  return null;
}
function li(e, t) {
  const { owners: n } = pu();
  for (const [a, s] of n) if (e === a || e.startsWith(a)) return s === t ? "you" : s;
  return e.startsWith("telemetry") ? n.get("platform-telemetry") ?? "platform" : "unowned";
}
function Xo(e) {
  return e === "failed" || e === "rolled-back" ? "healthy" : e;
}
function sb(e) {
  const t = e.blocker;
  return !t || t.outcome !== "failed" && t.outcome !== "cancelled" ? e : { ...e, blocker: null, waveReady: !0 };
}
function rb(e) {
  const t = vu(e), n = (a) => a === "awaiting-approval" ? "healthy" : a;
  return {
    ...t,
    signals: t.signals.filter((a) => a.kind !== "check-flapping"),
    apps: t.apps.map((a) => ({ ...a, envs: a.envs.map((s) => ({ ...s, state: n(s.state), myChanges: s.myChanges.map((r) => ({ ...r, state: n(r.state) })) })) }))
  };
}
function vu(e) {
  return {
    ...e,
    signals: e.signals.filter((t) => t.kind !== "check-failing"),
    apps: e.apps.map((t) => ({
      ...t,
      envs: t.envs.map((n) => ({
        ...sb(n),
        state: Xo(n.state),
        myChanges: n.myChanges.map((a) => ({ ...a, state: Xo(a.state) }))
      }))
    }))
  };
}
function ib(e, t, n) {
  if (n === "failed") return "Roll back, or ship a fix";
  if (n === "awaiting-approval") return "Needs an approver";
  if (n === "held-by-rule") return "Waits on its gate";
  const a = e.envs[t + 1];
  return n === "deploying" || n === "checking" ? a ? `Then ${a.isProdRegion ? "prod" : a.env}` : "Last stop" : null;
}
function ob(e, t) {
  const n = [];
  for (const g of e.apps) {
    const h = /* @__PURE__ */ new Map();
    g.envs.forEach((x, m) => {
      for (const C of x.myChanges) {
        const _ = h.get(C.ref) ?? { title: C.title, href: C.href, hits: [] };
        _.hits.push({ e: x, i: m, s: C.state, since: C.since }), h.set(C.ref, _);
      }
    });
    for (const [x, m] of h) {
      const C = m.hits.filter((L) => la[L.s] <= 4);
      if (!C.length) continue;
      const _ = Math.min(...C.map((L) => la[L.s])), A = C.filter((L) => la[L.s] === _), E = A[0].s, S = g.envs.map((L) => {
        const k = L.myChanges.find((T) => T.ref === x);
        return {
          label: L.isProdRegion ? L.label : L.env,
          tier: L.tier,
          state: k ? k.state : "not-deployed",
          prod: L.isProdRegion || L.tier === "prod",
          here: A.some((T) => T.e === L),
          since: k?.since ?? (k && (k.state === "healthy" || k.state === "superseded") ? L.arrivedAt : null),
          prev: L.myChanges.find((T) => T.ref !== x && (T.state === "healthy" || T.state === "superseded"))?.ref ?? (L.version ? L.version.slice(0, 7) : null)
        };
      }), w = A[0].e;
      n.push({
        key: `${g.app}/${x}`,
        ref: x,
        title: m.title,
        href: m.href,
        app: g.app,
        appHref: g.href,
        state: E,
        where: A.map((L) => L.e.env),
        status: `${Nr[E] ?? ""} ${nb(A.map((L) => L.e))}`.trim(),
        next: ib(g, A[0].i, E),
        since: A.map((L) => L.since).filter(Boolean).sort()[0] ?? null,
        tone: Qo(E),
        stops: S,
        mergedAt: w.myChanges.find((L) => L.ref === x)?.mergedAt ?? null,
        rollbackTo: w.myChanges.find((L) => L.ref !== x && (L.state === "healthy" || L.state === "superseded"))?.ref ?? null,
        evidence: e.signals.find((L) => L.app === g.app && L.env === w.env && L.kind === "check-failing")?.phrase ?? null,
        action: E === "failed" ? { label: `Roll back ${w.env}`, href: w.href } : null
      });
    }
  }
  n.sort((g, h) => la[g.state] - la[h.state] || (h.since ?? "").localeCompare(g.since ?? ""));
  const a = n.filter((g) => g.state === "failed" && g.stops.some((h) => h.here && h.prod)), s = n.filter((g) => g.state === "failed");
  let r = null, i = "";
  if (a.length)
    r = a.sort((g, h) => (h.since ?? "").localeCompare(g.since ?? ""))[0], i = "Your change is failing in production";
  else if (s.length)
    r = s[0], i = "Your change is failing";
  else {
    const g = n.find((h) => (h.state === "deploying" || h.state === "checking") && h.stops.some((x) => x.here && x.prod)) ?? n.find((h) => h.state === "deploying" || h.state === "checking") ?? n[0] ?? null;
    r = g, i = g ? "your change in motion" : "";
  }
  const o = [], l = new Set(n.map((g) => g.app));
  for (const g of e.apps) {
    const h = li(g.app, t);
    g.envs.forEach((x) => {
      if (!x.myChanges.some((m) => la[m.state] <= 2) && (x.state === "awaiting-approval" || x.state === "held-by-rule" || x.state === "failed")) {
        const m = x.state === "awaiting-approval" ? "approval" : x.state === "failed" ? "failing" : "held", C = o.find((A) => A.app === g.app && A.kind === m);
        if (C) {
          C.status = `${Nr[x.state]} ${C.status.match(/(\d+) prod/) ? Number(C.status.match(/(\d+) prod/)[1]) + 1 : 2} prod regions`;
          return;
        }
        const _ = e.fleet.needsYou.find((A) => A.app === g.app && A.env === x.env);
        o.push({
          key: `${g.app}@${x.env}`,
          app: g.app,
          href: x.href,
          whose: l.has(g.app) && h === "you" ? "you" : h,
          kind: m,
          status: m === "held" && _ ? `${_.phrase.replace(/^\w/, (A) => A.toUpperCase())} in ${x.env}` : `${Nr[x.state]} ${x.env}`,
          since: x.heldSince ?? x.arrivedAt,
          tone: Qo(x.state),
          canAct: m === "approval",
          action: m === "approval" ? { label: "Review", href: x.href } : null,
          change: ab(g.app)
        });
      }
    });
  }
  for (const g of e.signals.filter((h) => h.kind === "check-flapping"))
    o.push({
      key: g.key,
      app: g.app,
      href: g.href,
      whose: li(g.app, t),
      kind: "flapping",
      status: `Check flapping in ${g.env}: ${g.phrase}`,
      since: g.since,
      tone: "neutral",
      canAct: !1,
      action: null,
      change: null
    });
  const c = { failing: 0, approval: 1, held: 2, dependency: 2, flapping: 3 };
  o.sort((g, h) => c[g.kind] - c[h.kind] || (g.since ?? "").localeCompare(h.since ?? ""));
  const u = [];
  for (const g of e.apps)
    for (const h of g.envs) {
      const x = h.myChanges.find((m) => m.state === "rolled-back");
      (h.state === "rolled-back" || x) && u.push({
        key: `${g.app}@${h.env}`,
        app: g.app,
        env: h.env,
        ref: x?.ref ?? null,
        href: h.href,
        note: x ? x.liveAgain ? "live again in a later build" : "needs a follow-up fix" : "rolled back to the previous build"
      });
    }
  const f = /* @__PURE__ */ new Map(), p = [];
  for (const g of e.apps)
    for (const h of g.envs) {
      const x = f.get(h.tier) ?? { tier: h.tier, total: 0, healthy: 0, failing: 0, held: 0, moving: 0 };
      x.total++, h.state === "failed" ? x.failing++ : h.state === "held-by-rule" || h.state === "awaiting-approval" ? x.held++ : h.state === "deploying" || h.state === "checking" ? x.moving++ : x.healthy++, f.set(h.tier, x), (h.state === "deploying" || h.state === "checking") && p.push({
        key: `${g.app}@${h.env}`,
        app: g.app,
        env: h.env,
        state: h.state,
        since: h.arrivedAt,
        href: h.href,
        step: h.pipeline.activeStep ? `step ${h.pipeline.activeStep.index}/${h.pipeline.activeStep.total}` : null
      });
    }
  const v = ["dev", "test", "staging", "prod"], y = [...f.values()].sort((g, h) => v.indexOf(g.tier) - v.indexOf(h.tier)), b = f.get("prod");
  return {
    me: t,
    lead: r,
    leadReason: i,
    yours: n,
    elsewhere: o,
    rolledBack: u,
    tiers: y,
    motion: p,
    counts: {
      yoursNeedYou: n.filter((g) => g.state === "failed").length,
      approvals: o.filter((g) => g.canAct).length,
      yoursInFlight: n.length,
      elsewhere: o.length
    },
    prod: { healthy: b ? b.total - b.failing : 0, total: b?.total ?? 0 }
  };
}
let hu = /* @__PURE__ */ Ee(0);
const mu = () => d(hu), gu = () => {
  cf(hu);
};
class lb extends Date {
  constructor() {
    super(ds.getTime());
  }
  ms() {
    return (hn()?.now ?? ds).getTime();
  }
  getTime() {
    return this.ms();
  }
  valueOf() {
    return this.ms();
  }
  toISOString() {
    return new Date(this.ms()).toISOString();
  }
}
const Zt = new lb(), Ra = () => hn() ? hn().me : oi, cb = () => hn() !== null, Jo = {
  "hello-dep-dev": "2026-10-24T18:46:26.893Z",
  "hello-dep-staging": "2026-10-24T18:58:26.893Z"
}, ub = "2026-10-24T18:33:49.255Z";
function db() {
  const e = X2(ds), t = e.rollouts.map((s) => {
    const r = Jo[s.metadata.namespace];
    if (!r || s.metadata.name !== "hello-frontend-app" || !s.status.history?.length) return s;
    const [i, ...o] = s.status.history;
    return { ...s, status: { ...s.status, history: [{ ...i, timestamp: r }, ...o] } };
  }), n = e.environments.map((s) => {
    const r = Jo[s.metadata.namespace];
    return r && s.metadata.name === "hello-frontend-app" ? { ...s, status: { ...s.status, lastStatusChangeTime: r } } : s;
  }), a = e.changes.map(
    (s) => s.repo === "hello-frontend-app" && s.number === 13 ? { ...s, mergedAt: ub } : s
  );
  return { ...e, rollouts: t, environments: n, changes: a };
}
let Rr = null;
function fb() {
  if (Rr) return Rr;
  const e = db();
  return Rr = {
    rollouts: e.rollouts,
    environments: e.environments,
    rolloutDependencies: e.rolloutDependencies,
    kustomizations: e.kustomizations,
    kruiseRollouts: e.kruiseRollouts,
    changes: e.changes,
    changesState: "ok",
    healthChecks: e.healthChecks,
    github: { configured: !0, connected: !0, login: oi },
    me: oi,
    now: ds
  };
}
const mt = () => hn() ?? fb(), pb = () => hn() !== null, ci = /* @__PURE__ */ new WeakMap();
function bu() {
  ci.delete(mt());
}
function Zn(e) {
  mu();
  const t = mt();
  let n = ci.get(t);
  return n || (n = Z2({
    changes: t.changes,
    rollouts: t.rollouts,
    environments: t.environments,
    rolloutDependencies: t.rolloutDependencies,
    kustomizations: t.kustomizations,
    kruiseRollouts: t.kruiseRollouts,
    me: t.me,
    now: t.now,
    healthChecks: t.healthChecks
  }), ci.set(t, n)), hn() ? n : e === "quiet" ? rb(n) : e === "calm" ? vu(n) : n;
}
function Xt(e, t) {
  if (!t) return null;
  const n = mt().changes, a = (i) => i.mergeCommitSha.startsWith(t) || t.startsWith(i.mergeCommitSha.slice(0, 7)), s = n.find((i) => e.startsWith(i.repo) && a(i)) ?? (t.length >= 7 ? n.find(a) : null);
  if (!s) return null;
  const r = s.htmlUrl.split("/").pop() ?? "";
  return { ref: /^\d+$/.test(r) ? `#${r}` : r.slice(0, 7), title: s.title, author: s.author, mergedAt: s.mergedAt, href: s.htmlUrl };
}
function ya(e, t) {
  return (mt().rollouts.find((a) => a.metadata.name === e && a.metadata.namespace.endsWith(`-${t}`))?.status.history ?? []).map((a) => ({
    sha: (a.version.revision ?? a.version.tag ?? "").slice(0, 7),
    at: a.timestamp,
    bake: a.bakeStatus ?? null,
    bakeStart: a.bakeStartTime ?? null,
    bakeEnd: a.bakeEndTime ?? null
  }));
}
function vb(e) {
  for (let t = e.length - 1; t > 0; t--) {
    const n = e[t - 1], a = e[t];
    n.state === "done" && a.state === "done" && n.label.startsWith("Passed ") && a.label.startsWith("Passed ") && n.at && a.at && Date.parse(a.at) - Date.parse(n.at) < 8 * 6e4 && e.splice(t - 1, 2, { label: `${n.label} and ${a.label.slice(7)}`, at: a.at, state: "done", note: `${Zs(n.at)} and ${Zs(a.at)}` });
  }
}
function wu(e) {
  const t = [];
  for (const n of e) {
    const a = t.find((s) => s.before === n.before && s.after === n.after && s.beforeTone === n.beforeTone);
    a ? a.place = `${a.place}, ${n.place}` : t.push({ ...n });
  }
  return t;
}
const Ja = (e) => e ? Date.parse(e) : NaN;
function Qs(e) {
  const t = Math.max(0, Math.round(e / 6e4));
  if (t < 60) return `${t}m`;
  const n = Math.floor(t / 60);
  return n < 24 ? t % 60 ? `${n}h ${t % 60}m` : `${n}h` : `${Math.floor(n / 24)}d ${n % 24}h`;
}
function hb(e, t) {
  const n = e.apps.find((c) => c.app === t.app), a = n.envs.filter((c) => !c.isProdRegion && c.tier !== "prod" && c.state === "healthy"), s = a.length ? a[a.length - 1].version : null, r = Xt(t.app, s), i = n.envs.filter((c) => c.state === "awaiting-approval");
  let o = null;
  for (const c of a) {
    const u = ya(t.app, c.env).find((f) => s && f.sha === s.slice(0, 7));
    u && (!o || u.at > o) && (o = u.at);
  }
  const l = [t.since, o].filter(Boolean).sort().pop() ?? null;
  return {
    key: t.key,
    app: t.app,
    ref: r?.ref ?? null,
    title: r?.title ?? (s ? `build ${s.slice(0, 7)}` : t.app),
    author: r?.author ?? t.whose,
    places: i.length,
    placeWord: i.length === 1 ? i[0].env : `${i.length} prod regions`,
    since: l,
    href: t.href,
    build: s ? s.slice(0, 7) : null
  };
}
function mb(e, t) {
  const n = e.apps.find((v) => v.app === t.app), a = n.envs.find((v) => v.env === t.where[0]), s = ya(t.app, a.env), r = t.stops.filter((v) => !v.here && (v.state === "healthy" || v.state === "superseded") && v.since), i = a.pipeline, o = i.isFallback ? "all at once, no canary" : i.activeStep ? `canary step ${i.activeStep.index} of ${i.activeStep.total}` : "after every canary step", l = s[0]?.bakeEnd ?? t.since, c = Xt(t.app, t.rollbackTo), u = (a.isProdRegion, a.env), f = t.evidence ? t.evidence.replace(/ failing$/, "") : null, p = n.envs.filter((v) => v !== a);
  return {
    kind: "failing",
    eyebrow: `Your change is failing in ${u}`,
    ref: t.ref,
    title: t.title,
    href: a.href,
    meta: `${t.app} · merged by you ${Zs(t.mergedAt)}`,
    fact: null,
    check: f ? { name: f, message: s[0]?.bake === "Failed" ? "reported an error during the bake" : "failing" } : null,
    action: { label: `Roll back ${u}${t.rollbackTo ? ` to ${t.rollbackTo}` : ""}`, href: a.href },
    steps: [
      { label: "Merged", at: t.mergedAt, state: "done" },
      ...r.map((v) => ({ label: `Passed ${v.label}`, at: v.since, state: "done" })),
      { label: `Deployed to ${u}`, at: a.arrivedAt, state: "done", note: o },
      { label: "Bake failed", at: l, state: "fail", note: f },
      { label: "Roll back", at: null, state: "pending", note: t.rollbackTo ? `${u} goes back to ${t.rollbackTo}` : null }
    ],
    live: `failing ${Qs(Zt.getTime() - Ja(l))}`,
    next: "if you roll back",
    preview: {
      action: `Roll back ${u}`,
      rows: [
        ...p.map((v) => ({ place: v.env, before: t.ref, beforeTone: "neutral", after: null })),
        { place: a.env, before: t.ref, beforeTone: "danger", after: t.rollbackTo ?? "previous" }
      ],
      rest: null,
      foot: `Changes 1 of ${n.envs.length} places${c ? `; ${t.rollbackTo} is “${c.title}”` : ""}. ${p.map((v) => v.env).join(" and ")} keep ${t.ref}.`
    }
  };
}
function gb(e, t) {
  const n = e.apps.find((f) => f.app === t.app), a = Xt(t.app, t.build), s = n.envs.filter((f) => !f.isProdRegion && f.tier !== "prod"), r = [];
  a && r.push({ label: "Merged", at: a.mergedAt, state: "done" });
  let i = a?.mergedAt ?? null;
  for (const f of s) {
    const p = ya(t.app, f.env).find((v) => t.build && v.sha === t.build);
    p && (r.push({ label: `Passed ${f.env}`, at: p.at, state: "done" }), i = p.at);
  }
  const o = t.since ?? i;
  vb(r), r.push({ label: `Deploys to ${t.placeWord}`, at: null, state: "pending", note: "on its own after that" });
  const l = n.envs.filter((f) => f.isProdRegion || f.tier === "prod"), c = l.filter((f) => f.state === "awaiting-approval"), u = l.filter((f) => f.state !== "awaiting-approval");
  return {
    kind: "approval",
    eyebrow: "Waiting on your approval · nothing of yours is failing",
    ref: t.ref,
    title: t.title,
    href: t.href,
    meta: `${t.app} · ${t.author}'s change · build ${t.build ?? "?"}`,
    check: null,
    fact: null,
    action: { label: "Review", href: t.href },
    steps: r,
    live: `waits for you · ${Qs(Zt.getTime() - Ja(o))}`,
    next: "once you approve",
    preview: {
      action: "approval",
      rows: wu(c.map((f) => ({ place: f.label, before: (f.version ?? "").slice(0, 7), beforeTone: "neutral", after: t.build ?? t.ref ?? "" }))),
      rest: u.length ? `${u.map((f) => f.label).join(", ")} stay${u.length === 1 ? "s" : ""} on ${(u[0].version ?? "").slice(0, 7)}${u.length > 1 ? " and others" : ""}: no approval rule there` : null,
      foot: `Changes ${c.length} of ${l.length} prod regions. Dev, test and staging are not touched.`
    }
  };
}
function bb(e, t) {
  const n = e.apps.find((v) => v.app === t.app), a = n.envs.findIndex((v) => v.env === t.where[0]), s = n.envs[a], r = n.envs.slice(a + 1), i = r.filter((v) => !v.isProdRegion && v.tier !== "prod"), o = r.filter((v) => v.isProdRegion || v.tier === "prod"), l = t.state === "deploying" ? "Deploying to" : "Checking in", u = (Zn("incident").apps.find((v) => v.app === t.app)?.envs ?? []).filter((v) => v.state === "awaiting-approval" && r.some((y) => y.env === v.env)).map((v) => v.label), f = ya(t.app, s.env)[1];
  let p = null;
  if (f) {
    let v = null, y = null;
    for (const b of i) {
      const g = ya(t.app, b.env).find((h) => h.sha === f.sha);
      g && (v = b.env, y = g.at);
    }
    v && y && (p = `Your previous build, ${f.sha}, went from ${s.env} to ${v} in ${Qs(Ja(y) - Ja(f.at))}.`);
  }
  return {
    kind: "moving",
    eyebrow: "Nothing needs you · your change is moving",
    ref: t.ref,
    title: t.title,
    href: s.href,
    meta: `${t.app} · merged by you ${Zs(t.mergedAt)}`,
    check: null,
    fact: p,
    action: null,
    steps: [
      { label: "Merged", at: t.mergedAt, state: "done" },
      { label: `${l} ${s.env}`, at: t.since, state: "active", note: s.pipeline.activeStep ? `canary step ${s.pipeline.activeStep.index} of ${s.pipeline.activeStep.total}` : null },
      ...i.map((v) => ({ label: v.env, at: null, state: "pending" })),
      ...o.length ? [{ label: o.length === 1 ? o[0].env : `${o.length} prod regions`, at: null, state: "pending", note: u.length ? `${u.join(" and ")} need${u.length === 1 ? "s" : ""} an approver` : "promotes on its own" }] : []
    ],
    live: `${Qs(Zt.getTime() - Ja(t.since))} so far`,
    next: "next",
    preview: {
      action: `${t.ref} arrives`,
      rows: wu([
        { place: `${s.env} (deploying)`, before: ya(t.app, s.env)[1]?.sha ?? "", beforeTone: "neutral", after: t.ref },
        ...r.map((v) => ({ place: v.label, before: (v.version ?? "").slice(0, 7), beforeTone: "neutral", after: u.includes(v.label) ? `${t.ref} · approver` : t.ref }))
      ]),
      rest: null,
      foot: `Reaches ${n.envs.length} places; ${u.length ? `${u.join(" and ")} wait for an approver, the rest promote on their own` : "every step promotes on its own"}.`
    }
  };
}
function Zs(e) {
  return e ? new Date(e).toISOString().slice(11, 16) : "";
}
function wb(e, t) {
  const n = ob(e, Ra()), a = n.elsewhere.filter((_) => _.canAct).map((_) => hb(e, _)), s = n.yours.filter((_) => _.state === "failed"), r = s.filter((_) => _.stops.some((A) => A.here && A.prod)).sort((_, A) => (A.since ?? "").localeCompare(_.since ?? ""));
  let i = null, o = null, l = null;
  if (r.length || s.length)
    o = r[0] ?? s[0], i = mb(e, o);
  else if (a.length)
    l = a[0], i = gb(e, l);
  else {
    const _ = n.yours.filter((A) => A.state === "deploying" || A.state === "checking").sort((A, E) => (E.since ?? "").localeCompare(A.since ?? ""));
    _.length && (o = _[0], i = bb(e, o));
  }
  const c = s.filter((_) => _ !== o).map((_) => ({ ..._, place: _.where.length > 1 ? `${_.where.length} places` : _.where[0], action: { label: `Roll back ${_.where[0]}`, href: _.action?.href ?? _.href } })), u = a.filter((_) => _ !== l), f = n.yours.filter((_) => _.state !== "failed" && _ !== o), p = f.filter((_) => _.state === "deploying" || _.state === "checking").map((_) => ({ ..._, reached: _.stops.filter((A) => A.state === "healthy" || A.state === "superseded" || A.state === "checking").length, total: _.stops.length })), v = f.filter((_) => _.state === "awaiting-approval"), y = f.filter((_) => _.state === "held-by-rule"), b = n.elsewhere.filter((_) => _.kind === "flapping").map((_) => ({ key: _.key, app: _.app, whose: _.whose, text: _.status.replace(/^Check flapping in (\S+): /, "Check flapping in $1: "), since: _.since, href: _.href })), g = n.elsewhere.filter((_) => !_.canAct && _.kind !== "flapping").map((_) => {
    const A = _.change?.ref ?? null, E = _.kind === "flapping";
    return {
      key: _.key,
      app: _.app,
      ref: E ? null : A,
      title: E ? null : _.change?.title ?? null,
      whose: E ? _.whose : _b(_.app, A) ?? _.whose,
      status: E ? _.status.replace(/^Check flapping in (\S+): /, "Check flapping in $1 · ") : _.status,
      since: _.since,
      href: _.href,
      flapping: E
    };
  }), h = [];
  let x = 0, m = 0, C = 0;
  for (const _ of e.apps)
    for (const A of _.envs)
      if (A.isProdRegion || A.tier === "prod")
        if (x++, A.state === "failed") {
          const E = n.yours.find((S) => S.app === _.app && S.where.includes(A.env) && S.state === "failed");
          h.push({ app: _.app, env: A.env, whose: E ? "you" : li(_.app, Ra()), ref: E?.ref ?? null, href: A.href });
        } else A.state === "held-by-rule" || A.state === "awaiting-approval" ? m++ : (A.state === "deploying" || A.state === "checking") && C++;
  return {
    lead: i,
    failures: c,
    approvals: u,
    moving: p,
    waiting: v,
    held: y,
    yoursTotal: f.length,
    notYours: g,
    prod: { total: x, failing: h, held: m, moving: C, rolledBack: n.rolledBack, signals: b }
  };
}
const kb = () => mt().changes;
function _b(e, t) {
  if (!t) return null;
  const n = Number(t.replace("#", "")), a = kb().find((s) => e.startsWith(s.repo) && s.number === n);
  return a ? a.author === Ra() ? "you" : a.author : null;
}
const yb = ["dev", "test", "staging", "prod"], el = (e) => e.isProdRegion || e.tier === "prod" ? "prod" : e.tier === "dev" ? "dev" : e.tier === "test" ? "test" : "staging", Or = (e) => e === "deploying" || e === "checking", Dr = (e) => e === "awaiting-approval", Fr = (e) => e === "failed", xb = () => mt().rollouts;
function Sb(e, t, n) {
  return e.find((s) => {
    const r = s.href.split("/").filter(Boolean);
    return r[0] === "rollouts" && r[2] === t && r[3] === n;
  }) ?? e.find((s) => !!s.env && (t === s.env || t.endsWith(`-${s.env}`))) ?? null;
}
function Cb(e) {
  const t = Zn(e), n = wb(t), a = Zt.getTime(), s = yb.map((C) => {
    const _ = [];
    for (const A of t.apps)
      for (const E of A.envs)
        el(E) !== C || E.state === "not-deployed" || _.push({ app: A.app, env: E.env, label: E.label, state: E.state, href: E.href, version: E.version, since: E.arrivedAt, mine: E.myChanges.length > 0 });
    return {
      key: C,
      places: _,
      healthy: _.filter((A) => A.state === "healthy" || A.state === "superseded" || A.state === "rolled-back").length,
      moving: _.filter((A) => Or(A.state)),
      held: _.filter((A) => Dr(A.state)),
      failed: _.filter((A) => Fr(A.state)),
      apps: new Set(_.map((A) => A.app)).size
    };
  }).filter((C) => C.places.length), r = /* @__PURE__ */ new Set();
  for (const C of Zn("incident").apps) for (const _ of C.envs) _.state === "failed" && r.add(`${C.app}|${_.env}`);
  const i = (C, _) => Sb(t.apps.find((A) => A.app === _)?.envs ?? [], C, _), o = 24, l = 15 * 6e4, c = o * 36e5 / l, u = a - c * l, f = Array.from({ length: c }, (C, _) => ({ start: u + _ * l, ok: 0, failed: 0, live: 0 })), p = [];
  let v = 0;
  const y = [];
  for (const C of xb()) {
    const _ = i(C.metadata.namespace, C.metadata.name);
    if (!_) continue;
    (C.status.history ?? []).forEach((E, S) => {
      const w = Date.parse(E.timestamp);
      let L = E.bakeStatus ?? "Succeeded";
      L === "Failed" && e !== "incident" && r.has(`${C.metadata.name}|${_.env}`) && S === 0 && (L = "Succeeded");
      const k = _.isProdRegion || _.tier === "prod";
      if (w >= u && w <= a) {
        y.push({ t: w, tier: el(_), app: C.metadata.name, env: _.label, kind: L === "Failed" ? "failed" : L === "Deploying" || L === "InProgress" ? "live" : "ok", sha: (E.version.revision ?? E.version.tag ?? "").slice(0, 7) });
        const T = f[Math.min(c - 1, Math.floor((w - u) / l))];
        L === "Failed" ? T.failed++ : L === "Deploying" || L === "InProgress" ? T.live++ : T.ok++, k && L !== "Failed" && v++;
      }
      if (a - w < 12 * 36e5 && (k || L === "Failed")) {
        const T = (E.version.revision ?? E.version.tag ?? "").slice(0, 7), F = Xt(C.metadata.name, T);
        p.push({
          key: `${C.metadata.namespace}/${C.metadata.name}/${S}`,
          at: E.timestamp,
          kind: L === "Failed" ? "failed" : "prod",
          app: C.metadata.name,
          env: _.label,
          ref: F?.ref ?? (T || null),
          title: F?.title ?? null,
          author: F?.author ?? null,
          href: _.href
        });
      }
    });
  }
  const b = f.reduce((C, _) => C + _.ok + _.failed + _.live, 0), g = f.reduce((C, _) => C + _.failed, 0), h = Math.max(1, ...f.map((C) => C.ok + C.failed + C.live));
  p.sort((C, _) => _.at.localeCompare(C.at));
  const x = [];
  for (const C of p) {
    const _ = x.find((A) => A.kind === C.kind && A.app === C.app && A.ref === C.ref && Math.abs(Date.parse(A.at) - Date.parse(C.at)) < 18e5);
    if (_) {
      _.env.includes(" regions") ? _.env = `${parseInt(_.env) + 1} regions` : _.env = "2 regions";
      continue;
    }
    x.push({ ...C });
  }
  const m = t.apps.map((C) => {
    const _ = C.envs.filter((L) => L.state !== "not-deployed" && L.version), E = [..._].sort((L, k) => (k.arrivedAt ?? "").localeCompare(L.arrivedAt ?? ""))[0]?.version ?? null, S = _.some((L) => Fr(L.state)) ? "failed" : _.some((L) => Or(L.state)) ? "moving" : _.some((L) => Dr(L.state)) ? "held" : "healthy", w = _.find((L) => S === "failed" ? Fr(L.state) : S === "moving" ? Or(L.state) : S === "held" ? Dr(L.state) : !1);
    return {
      app: C.app,
      href: C.href,
      places: _.length,
      onNewest: _.filter((L) => L.version === E).length,
      newest: E ? E.slice(0, 7) : null,
      state: S,
      where: w?.label ?? null,
      prodRegions: _.filter((L) => L.isProdRegion || L.tier === "prod").length
    };
  }).filter((C) => C.places > 0);
  return { events: y, m: t, v: n, tiers: s, pulse: { bins: f, total: b, failed: g, prodArrivals: v, peak: h, windowH: o }, apps: m, activity: x, places: s.reduce((C, _) => C + _.places.length, 0) };
}
const Ka = (e) => e ? e.includes("-") ? e.split("-").map((t) => t[0].toUpperCase() + t.slice(1)).join(" ") : e === "danielreed" ? "Daniel Reed" : e : null, Rs = (e) => !!e && (e.toLowerCase() === Ra().toLowerCase() || !cb() && e === "danielreed"), Xs = (e) => e.isProdRegion || e.tier === "prod" ? "prod" : e.tier === "dev" ? "dev" : e.tier === "test" ? "test" : "staging", tl = (e) => e === "failed" ? "failed" : e === "awaiting-approval" ? "approval" : e === "held-by-rule" ? "held" : e === "deploying" || e === "checking" ? "moving" : "rest", Ab = (e) => e === "failed" ? "failed" : e === "awaiting-approval" ? "approval" : e === "held-by-rule" ? "held" : e === "deploying" ? "deploying" : e === "checking" ? "checking" : "rest", Tb = ["dev", "test", "staging", "prod"];
function Mb(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e.apps) if (t.includes(a.app)) for (const s of a.envs) n.add(Xs(s));
  return Tb.filter((a) => n.has(a));
}
const Eb = (e) => e ? /^[0-9a-f]{8,40}$/.test(e) ? e.slice(0, 7) : e : null;
function ku(e) {
  const t = Cb(e), { v: n, m: a } = t, s = n.lead, r = s ? s.meta.split(" · ")[0] : null, i = new Map(n.approvals.map((S) => [S.app, S])), o = new Map(a.fleet.needsYou.map((S) => [`${S.app}@${S.env}`, S])), l = (S, w) => a.apps.find((L) => L.app === S)?.envs.find((L) => L.env === w)?.state, c = (S) => {
    const w = a.fleet.needsYou.filter((k) => k.app === S && l(S, k.env) === "held-by-rule"), L = new Set(w.map((k) => k.facts.provider ?? ""));
    return w.length && L.size === 1 && [...L][0] || null;
  }, u = (S, w) => {
    const L = o.get(`${S}@${w}`);
    return L ? L.facts.provider ?? null : c(S);
  }, f = [], p = /* @__PURE__ */ new Map();
  for (const S of a.apps)
    for (const w of S.envs) {
      if (w.state === "not-deployed") continue;
      const L = Xs(w);
      if (tl(w.state) === "rest") {
        const T = p.get(S.app) ?? { app: S.app, places: 0, tiers: [], href: S.href };
        T.places++, T.tiers.includes(L) || T.tiers.push(L), p.set(S.app, T);
        continue;
      }
      const k = w.myChanges.find((T) => T.state === w.state) ?? null;
      f.push({
        prov: w.state === "held-by-rule" ? u(S.app, w.env) : null,
        app: S.app,
        env: w.env,
        label: w.label,
        tier: L,
        state: w.state,
        version: Eb(w.version),
        /* craft r7 (nit): a failing place's age is the failure's (the change's failed entry), not the deploy's */
        since: (w.state === "awaiting-approval" || w.state === "held-by-rule" ? w.heldSince : null) ?? (w.state === "failed" ? w.myChanges.find((T) => T.state === "failed")?.since : null) ?? w.arrivedAt,
        href: w.href,
        mine: k ? { ref: k.ref, title: k.title, who: Ka(Ra()), mine: !0 } : null,
        pipeline: w.pipeline ?? null
      });
    }
  const v = [];
  for (const S of f) {
    const w = tl(S.state), L = v.find((X) => X.app === S.app && X.tier === "prod" && S.tier === "prod" && X.state === S.state && X.glyph === "waiting" == !!S.prov && (S.state === "awaiting-approval" || S.state === "held-by-rule" || X.version === S.version));
    if (L) {
      L.regions.push(S.label), L.where = `${L.regions.length} prod regions`;
      continue;
    }
    const k = S.state === "awaiting-approval" ? i.get(S.app) : void 0, T = n.notYours.find((X) => X.key === `${S.app}@${S.env}`) ?? (S.state === "held-by-rule" ? n.notYours.find((X) => X.app === S.app && X.key.endsWith(S.label)) : void 0), F = S.state === "held-by-rule" || S.state === "awaiting-approval", z = F ? null : Xt(S.app, S.version), j = S.mine ?? (k ? { ref: k.ref ?? k.build, title: k.ref ? k.title : `build ${k.build}`, who: Ka(k.author), mine: Rs(k.author) } : null) ?? (T ? { ref: T.ref, title: T.title ?? `build ${T.ref}`, who: Ka(T.whose), mine: Rs(T.whose) } : null) ?? (z ? { ref: z.ref, title: z.title, who: Ka(z.author), mine: Rs(z.author) } : null) ?? (!F && S.version ? { ref: null, title: `build ${S.version}`, who: null, mine: !1 } : null);
    j && j.ref && j.title === `build ${j.ref}` && (j.ref = null);
    const D = !!s && r === S.app && (s.kind === "failing" && S.state === "failed" || s.kind === "approval" && S.state === "awaiting-approval"), H = o.get(`${S.app}@${S.env}`), ae = S.state === "failed" && (!!j?.mine || D || n.failures.some((X) => X.app === S.app)) || S.state === "awaiting-approval" && !!k, se = S.state === "failed" ? "Failing" : S.state === "awaiting-approval" ? k ? "Waits for your approval" : "Waits for approval" : S.state === "held-by-rule" ? S.prov ? `Waits on ${S.prov}` : T?.status?.startsWith("Waits on a dependency") ? "Waits on a dependency" : "Held by a rule" : S.state === "deploying" ? "Deploying" : "Checking", G = D && s?.check ? `${s.check.name} ${s.check.message}` : H?.phrase ?? null;
    v.push({
      key: `${S.app}@${S.env}`,
      app: S.app,
      tier: S.tier,
      where: S.tier === "prod" && S.label === "prod" ? "production" : S.label,
      regions: [S.label],
      state: S.state,
      group: w,
      glyph: S.prov ? "waiting" : Ab(S.state),
      word: se,
      change: j,
      version: S.version,
      since: S.since,
      href: S.href,
      needsYou: ae,
      lead: D,
      action: D && s?.action ? { label: s.action.label.replace(/ to [0-9a-f]{7}$/, ""), href: s.action.href, kind: "rollback" } : S.state === "failed" && ae ? { label: "Roll back", href: S.href, kind: "rollback" } : S.state === "awaiting-approval" && k ? { label: "Approve", href: S.href, kind: "approve" } : null,
      cause: G,
      pipeline: S.pipeline
    });
  }
  const y = { prod: 0, staging: 1, test: 2, dev: 3 };
  v.sort((S, w) => Number(w.lead) - Number(S.lead) || Number(w.needsYou) - Number(S.needsYou) || y[S.tier] - y[w.tier] || (w.since ?? "").localeCompare(S.since ?? ""));
  const g = ["failed", "approval", "held", "moving"].map((S) => ({ key: S, rows: v.filter((w) => w.group === S), places: v.filter((w) => w.group === S).reduce((w, L) => w + L.regions.length, 0) })).filter((S) => S.rows.length), h = [...p.values()].filter((S) => !v.some((w) => w.app === S.app)).sort((S, w) => S.app.localeCompare(w.app)), x = [...p.values()].reduce((S, w) => S + w.places, 0), m = [...p.values()].sort((S, w) => S.app.localeCompare(w.app)), C = v.filter((S) => S.group === "failed").reduce((S, w) => S + w.regions.length, 0), _ = v.filter((S) => S.group === "failed" && S.tier === "prod").reduce((S, w) => S + w.regions.length, 0), A = v.filter((S) => S.group === "approval" && S.needsYou).length, E = v.filter((S) => S.group === "moving").reduce((S, w) => S + w.regions.length, 0);
  return {
    c: t,
    rows: v,
    groups: g,
    rest: h,
    restAll: m,
    restPlaces: x,
    figures: { failing: C, prodFailing: _, yourApprovals: A, moving: E, places: t.places, apps: t.apps.length },
    activity: t.activity.map((S) => ({ ...S, who: Ka(S.author), mine: Rs(S.author), where: S.env === "prod" ? "production" : S.env })),
    tiers: t.tiers
  };
}
function Lb(e) {
  const t = ku(e), n = t.c, a = { dev: 0, test: 1, staging: 2, prod: 3 }, s = n.apps.map((c) => {
    const u = n.m.apps.find((m) => m.app === c.app), f = t.rows.filter((m) => m.app === c.app), p = f[0] ?? null, v = f.find((m) => m.group === "failed") ?? f.find((m) => m.needsYou) ?? f.find((m) => m.group === "moving") ?? p, y = v ? v.group === "failed" || v.needsYou ? "needs" : v.group === "moving" ? "moving" : "waiting" : "quiet", b = u.envs.filter((m) => m.state !== "not-deployed"), g = b.filter((m) => m.version?.slice(0, 7) === c.newest && !["awaiting-approval", "held-by-rule"].includes(m.state)), h = g.length ? g.map((m) => Xs(m)).reduce((m, C) => a[C] > a[m] ? C : m) : null, x = v ? v.group === "failed" ? `Failing in ${v.where}` : v.state === "awaiting-approval" ? `Waits for approval in ${v.where}` : v.group === "moving" ? `${v.word} ${v.state === "deploying" ? "to" : "in"} ${v.where}` : `${v.word.startsWith("Waits on") ? v.word : "Held"} in ${v.where}` : `${c.places} ${c.places === 1 ? "place" : "places"} at rest`;
    return {
      app: c.app,
      href: c.href,
      group: y,
      glyph: v ? v.group === "failed" ? "failed" : v.needsYou ? "approval" : v.group === "moving" ? v.glyph : "waiting" : "rest",
      fact: x,
      change: v?.change ?? null,
      reach: h,
      at: v ? v.tier : h,
      since: v?.since ?? null,
      places: c.places,
      onNewest: c.onNewest,
      newest: c.newest,
      envs: new Set(b.map((m) => Xs(m))).size,
      tiers: Mb(n.m, [c.app]),
      action: v?.action ?? null,
      lead: !!v?.lead,
      deploys24: n.events.filter((m) => m.app === c.app).length
    };
  }), r = (c) => Math.max(0, ...n.events.filter((u) => u.app === c).map((u) => u.t)), i = ["needs", "moving", "waiting", "quiet"], o = (c) => c.lead ? 0 : c.glyph === "failed" ? 1 : 2, l = i.map((c) => ({ key: c, rows: s.filter((u) => u.group === c).sort((u, f) => o(u) - o(f) || (c === "quiet" ? r(f.app) - r(u.app) : (f.since ?? "").localeCompare(u.since ?? ""))) })).filter((c) => c.rows.length);
  return { R: t, items: s, groups: l };
}
const Nb = (e) => e.replace(/^Waits for (your )?approval/, (t, n) => St("approval", { yours: !!n })), ma = (e) => e ? _s(e, Zt) : "", qi = () => mt().rollouts, pn = (e) => {
  const t = e.split("/").filter(Boolean);
  return t[0] === "rollouts" ? { cluster: t[1], ns: t[2], name: t[3] } : null;
}, ke = (e) => {
  mu();
  const t = pn(e);
  return t ? qi().find((n) => n.metadata.namespace === t.ns && n.metadata.name === t.name) ?? null : null;
}, Ir = (e) => e === "done" ? "done" : e === "fail" ? "fail" : e === "active" ? "active" : "todo";
function _u(e) {
  if (!e) return [{ name: "Started", state: "done" }, { name: "Check", state: "todo" }];
  if (e.isFallback) {
    const n = e.tracks[0]?.stages[0]?.state ?? "pending";
    return [{ name: "Started", state: "done" }, { name: "Check", state: n === "active" ? "todo" : Ir(n === "fail" ? n : e.bake) }];
  }
  const t = [{ name: "Started", state: "done" }];
  for (const n of e.tracks) n.stages.forEach((a, s) => t.push({ name: `Stage ${s + 1}`, state: Ir(a.state) }));
  return t.push({ name: "Check", state: Ir(e.bake) }), t;
}
function Gi(e) {
  const t = _u(e.pipeline);
  if ((e.state === "awaiting-approval" || e.state === "held-by-rule") && !t.some((n) => n.state === "active")) return t.map((n) => ({ name: n.name, state: "done" }));
  if (e.state === "awaiting-approval" || e.state === "held-by-rule") return t;
  if (e.state === "checking") return t.map((n, a) => ({ name: n.name, state: a === t.length - 1 ? "active" : "done" }));
  if (e.state === "deploying" && (!e.pipeline || e.pipeline.isFallback)) return t.map((n, a) => ({ name: n.name, state: a < t.length - 1 ? "done" : "active" }));
  if (e.state === "deploying") {
    let n = t.findIndex((a) => a.state === "active");
    return n < 0 && (n = t.findIndex((a) => a.state === "todo" && a.name !== "Check")), n < 0 && (n = 0), t.map((a, s) => ({ name: a.name, state: s < n ? "done" : s === n ? "active" : "todo" }));
  }
  return t;
}
const Rb = (e) => e.map((t) => `${t.name}:${t.state}`).join("|");
function Ob(e) {
  const t = ke(e.href)?.status.history ?? [], n = e.state === "awaiting-approval" || e.state === "held-by-rule" ? 0 : 1, a = t.slice(n).find((s) => (s.bakeStatus ?? "Succeeded") === "Succeeded");
  return a ? { build: Fe(a.version.version ?? a.version.tag ?? a.version.revision) ?? "", at: a.timestamp } : null;
}
function Db(e, t = "incident") {
  const n = mn(t, e.app), a = n.map((l) => ke(l.href)?.status).find((l) => l?.availableReleases?.length)?.availableReleases, s = a?.[a.length - 1], r = s ? [s.tag, s.version, s.revision?.slice(0, 7)].filter(Boolean).map((l) => Fe(l)) : null, i = r ? n.filter((l) => !!l.version && r.includes(l.version)).length : n.filter((l) => l.onBuild).length;
  return xm({ onHead: i, deployed: n.length, total: n.length }).replace(/^All on the newest$/, `All ${n.length} places on the newest build`).replace(/^(\d+) of (\d+) on the newest$/, "$1 of $2 places on the newest build").replace(/^(\d+) of 1 places/, "$1 of 1 place");
}
function yu(e) {
  if (e.group !== "failed") return null;
  const t = ke(e.href)?.status.history?.[0];
  if (!t) return null;
  const n = t.failedHealthChecks?.[0], a = /^A HealthCheck reported an error/.test(t.bakeStatusMessage ?? ""), s = t.bakeStatusMessage && !a ? t.bakeStatusMessage : null, r = n?.name ?? null, i = n?.message ?? null, o = i?.split(/;\s/)[0] ?? null, l = r && o ? `${r}: ${o}` : r ?? o ?? s ?? "Failing", c = pn(e.href), f = (c ? (mt().healthChecks ?? []).find((p) => p.metadata.namespace === c.ns && p.metadata.name === c.name)?.healthChecks.find((p) => p.metadata?.name === r) : void 0)?.status?.observations ?? n?.observations ?? [];
  return { check: r, message: i, phrase: s, line: l, observations: f };
}
function Oa(e) {
  const t = e.regions ?? (e.label ? [e.label] : []), n = Ua(t), a = t.map((s) => (s ?? "").trim()).find((s) => zi(s) !== "default");
  return e.tier === "prod" ? n > 1 ? `${n} prod regions` : a ?? "production" : t.find((s) => s && s.trim()) ?? e.tier;
}
const Fb = (e) => {
  const t = yu(e), n = e;
  if (n.steps = Gi(e), n.failure = t, n.place = Oa(e), n.deployedAt = ke(e.href)?.status.history?.[0]?.timestamp ?? e.since ?? null, t) {
    n.cause = t.line;
    const a = ke(e.href)?.status.history?.[0]?.bakeEndTime;
    a && (n.since = a);
  }
  return n;
}, fs = (e) => {
  const t = ke(e.href)?.status.history?.[0]?.version;
  return (t ? Fe(t.version ?? t.tag ?? t.revision) : null) ?? e.version ?? "";
}, Ib = (e) => {
  const t = ke(e.href)?.status.history?.[0]?.version.revision?.slice(0, 7) ?? null;
  return t && t !== fs(e) ? t : null;
}, Pb = (e) => {
  const t = ke(e.href)?.status.history?.[0]?.version.revision;
  return t ? t.slice(0, 7) : e.version ?? "";
};
function jb(e) {
  const t = e, n = t.steps ?? Gi(e), a = e.group === "approval" ? ys(e) : null;
  return {
    "data-truth-state": e.state,
    "data-truth-steps": Rb(n),
    "data-truth-age": t.deployedAt ?? ke(e.href)?.status.history?.[0]?.timestamp ?? e.since ?? "",
    "data-truth-since": a?.since ?? e.since ?? "",
    ...a ? { "data-truth-wait-build": a.build } : {},
    "data-truth-cause": (t.failure ?? yu(e))?.line ?? e.cause ?? (e.state === "awaiting-approval" ? St("approval") : e.word),
    "data-truth-build": fs(e),
    "data-truth-place": Oa(e)
  };
}
const ui = (e) => e ? e.group === "failed" ? e.tier === "prod" ? 0 : 1 : e.state === "awaiting-approval" ? 2 : e.state === "held-by-rule" ? 3 : e.state === "deploying" || e.state === "checking" ? 4 : 5 : 9, xu = (e, t) => ui(e) - ui(t) || +!!t?.needsYou - +!!e?.needsYou || (t?.since ?? "").localeCompare(e?.since ?? "");
function Wb(e) {
  const t = qa(e).rows[0];
  return t && ui(t) <= 4 ? t : null;
}
const ps = (e) => {
  const t = ke(e)?.status, n = (t?.releaseCandidates ?? []).map((s) => s.tag ?? s.version ?? "");
  return n.length && (t?.gates ?? []).find((s) => /approval/.test(s.name) && s.allowedVersions != null && n.every((r) => !s.allowedVersions.includes(r))) ? n.length : 0;
};
function Bb(e, t) {
  const n = e.action;
  return n ? e.group === "failed" ? n.kind === "rollback" ? n : null : e.group === "approval" && n.kind === "approve" ? n : null : null;
}
function qa(e) {
  const t = ku(e), n = t.rows.map(Fb), a = new Set(t.c.v.approvals.map((c) => c.app));
  for (const c of n)
    c.word = Nb(c.word), (c.state === "checking" || c.state === "deploying") && ps(c.href) > 0 ? (c.state = "awaiting-approval", c.group = "approval", c.glyph = "approval", c.needsYou = a.has(c.app), c.word = St("approval", { yours: c.needsYou }), c.action = c.needsYou ? { label: "Approve", href: c.href, kind: "approve" } : null, c.stillChecking = !0, c.steps = _u(c.pipeline)) : c.stillChecking = !1;
  n.sort(xu);
  for (const c of n) c.regionsOf = c.tier === "prod" && c.regions.length > 1 ? { n: c.regions.length, of: Hb(t.c.m, [c.app]) } : null;
  const r = ["failed", "approval", "held", "moving"].map((c) => ({ key: c, rows: n.filter((u) => u.group === c), places: n.filter((u) => u.group === c).reduce((u, f) => u + f.regions.length, 0) })).filter((c) => c.rows.length), i = (c) => r.find((u) => u.key === c)?.places ?? 0, o = { unit: "places", failing: i("failed"), approval: i("approval"), held: i("held"), waiting: i("approval") + i("held"), moving: i("moving"), rowCount: n.length }, l = { ...t.figures, yourApprovals: n.filter((c) => c.group === "approval" && c.needsYou).length, moving: i("moving") };
  return { ...t, rows: n, groups: r, figures: l, placeFigures: o };
}
const es = { dev: 0, test: 1, staging: 2, prod: 3 }, zb = () => mt().changes, Js = (e) => e.isProdRegion || e.tier === "prod" ? "prod" : e.tier === "dev" ? "dev" : e.tier === "test" ? "test" : "staging";
function Hb(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e.apps) if (t.includes(a.app))
    for (const s of a.envs) Js(s) === "prod" && s.state !== "not-deployed" && zi(s.label) !== "default" && n.add(s.label);
  return n.size;
}
function Su(e) {
  return gm(e, mt().github);
}
const Fe = (e) => e ? /^[0-9a-f]{8,40}$/.test(e) ? e.slice(0, 7) : e : null, Da = /^(\d+)\.(\d+)\.(\d+)(?:-(\d+))?$/, Cu = (e, t) => {
  const n = Da.exec(e), a = Da.exec(t);
  for (let s = 1; s <= 4; s++) {
    const r = +(n[s] ?? 0) - +(a[s] ?? 0);
    if (r) return r;
  }
  return 0;
};
function mn(e, t) {
  const n = (Zn(e).apps.find((r) => r.app === t)?.envs ?? []).filter((r) => r.state !== "not-deployed" && r.version), a = [...n].sort((r, i) => {
    const o = Fe(r.version), l = Fe(i.version);
    if (Da.test(o) && Da.test(l)) return Cu(l, o);
    const c = Xt(t, o)?.mergedAt, u = Xt(t, l)?.mergedAt;
    return c && u && c !== u ? u.localeCompare(c) : (i.arrivedAt ?? "").localeCompare(r.arrivedAt ?? "");
  })[0], s = a ? Fe(a.version) : null;
  return n.map((r) => ({ env: r.env, label: r.label, tier: Js(r), state: r.state, href: r.href, version: Fe(r.version), onNewest: Fe(r.version) === s && r.state !== "failed", onBuild: Fe(r.version) === s, newest: s }));
}
function Vb(e) {
  const t = (n) => Rh(n.state) * 2 + (n.needsYou ? 0 : 1);
  return [...e].sort((n, a) => t(n) - t(a) || +(a.tier === "prod") - +(n.tier === "prod") || (a.since ?? "").localeCompare(n.since ?? ""))[0] ?? null;
}
const Ub = (e) => e.group === "failed" ? `Failing in ${e.where}` : e.state === "awaiting-approval" ? `${St("approval")} in ${e.where}` : e.group === "moving" ? `${e.word} ${e.state === "deploying" ? "to" : "in"} ${e.where}` : `${e.word.startsWith("Waits on") ? e.word : "Held"} in ${e.where}`, qb = (e, t) => {
  const n = pn(e);
  return n ? hm(n.cluster, n.ns, t) : null;
};
function nl(e, t) {
  const n = ke(e)?.status;
  return (n?.availableReleases ?? []).findIndex((r) => [r.tag, r.version, r.revision?.slice(0, 7)].some((i) => i && Fe(i) === t)) < 0 ? null : Bi(n);
}
function Au(e) {
  const t = Lb(e), n = qa(e), a = Zn(e), s = Fu(e), r = t.items.map((l) => {
    const c = n.rows.filter((w) => w.app === l.app), u = Vb(c), f = (a.apps.find((w) => w.app === l.app)?.envs ?? []).filter((w) => w.state !== "not-deployed" && w.version), p = [...f].sort((w, L) => {
      const k = Fe(w.version), T = Fe(L.version);
      if (Da.test(k) && Da.test(T)) return Cu(T, k);
      const F = Xt(l.app, k)?.mergedAt, z = Xt(l.app, T)?.mergedAt;
      return F && z && F !== z ? z.localeCompare(F) : (L.arrivedAt ?? "").localeCompare(w.arrivedAt ?? "");
    })[0], v = p ? Fe(p.version) : l.newest, y = f.map((w) => ({ env: w.env, label: w.label, tier: Js(w), state: w.state, href: w.href, version: Fe(w.version), onNewest: Fe(w.version) === v && w.state !== "failed", onBuild: Fe(w.version) === v })), b = y.filter((w) => w.onNewest).length, g = y.filter((w) => w.tier === "prod");
    let h = u ? Ub(u) : l.fact, x = null, m = null;
    const C = (w) => nl(w.href, w.version);
    if (!u) {
      const L = ["dev", "test", "staging", "prod"].map((k) => ({ t: k, ps: y.filter((T) => T.tier === k && !T.onNewest && T.state !== "failed") })).find((k) => k.ps.length);
      if (L) {
        const k = Math.max(...L.ps.map((T) => C(T) ?? 1));
        h = `Ready to promote to ${L.t} · ${k} behind`, m = L.ps[0].href;
      }
    }
    if (u && (u.state === "held-by-rule" || u.state === "awaiting-approval") && u.group !== "failed") {
      const w = s.find((L) => L.rows.some((k) => k.href === u.href));
      x = w ? u.state === "awaiting-approval" ? St("approval") : w.cause.replace(/^Waiting/, "Waits") : u.state === "awaiting-approval" ? St("approval") : null, x && (h = `${x} in ${u.place}`);
    }
    const _ = c.find((w) => w.group === "failed"), A = _ ? { build: Fe(_.version) ?? Pb(_), place: _.place, href: _.href, line: _.failure?.line ?? "Failing" } : null, E = [];
    for (const w of s) {
      const L = w.rows.filter((T) => T.app === l.app);
      if (!L.length) continue;
      const k = L.length > 1 ? `${L.length} places` : L[0].place;
      E.push(`${w.cause === St("approval") ? w.cause : w.cause.replace(/^Waiting/, "Waits")} in ${k}`);
    }
    for (const w of a.apps.find((L) => L.app === l.app)?.envs ?? []) {
      const L = ke(w.href)?.spec?.wantedVersion;
      L && w.state !== "not-deployed" && E.push(`Pinned to ${Fe(w.version) ?? L} in ${Oa({ tier: Js(w), regions: [w.label] })}`);
    }
    const S = [h, ...E.filter((w) => !h.includes(w))].join(" · ");
    return Object.assign(l, { approval: !!u && u.state === "awaiting-approval" && u.group !== "failed", behind: (() => {
      let w = null;
      for (const L of y) {
        const k = nl(L.href, L.version) ?? 0;
        k > (w?.n ?? 0) && (w = { n: k, place: Oa({ tier: L.tier, regions: [L.label] }) });
      }
      return w;
    })(), row: u, outcomeHref: u?.href ?? m ?? y[0]?.href ?? l.href, failedCount: y.filter((w) => w.state === "failed").length, holds: E, outcome: S, newest: v, onNewest: b, fact: h, blocker: x, failing: A, placeList: y, prod: { regions: g.length, onNewest: g.filter((w) => w.onNewest).length } });
  }), i = Wb(e);
  for (const l of r) l.lead = !!i && l.row?.href === i.href;
  const o = t.groups;
  for (const l of o) l.key === "needs" && l.rows.sort((c, u) => xu(c.row, u.row) || c.app.localeCompare(u.app));
  return { R: n, items: r, groups: o, lead: r.find((l) => l.lead) ?? null };
}
function ys(e) {
  const t = Ki(e), n = t.some((o) => o.here) ? t.filter((o) => o.here) : t, a = mn("incident", e.app), s = a.find((o) => o.href === e.href), r = (o) => s ? Math.max(-1, ...a.filter((l) => es[l.tier] < es[s.tier] && Fe(l.version) === o).map((l) => es[l.tier])) : -1, i = [...n].sort((o, l) => r(l.build) - r(o.build));
  return i[0] ? { build: i[0].build, title: i[0].title, author: i[0].author, since: i[0].created, count: i.length } : null;
}
function Gb(e, t = "incident") {
  if (!ys(e)) return null;
  const a = Ki(e), s = a.some((l) => l.here) ? a.filter((l) => l.here) : a, r = mn(t, e.app).filter((l) => es[l.tier] < es[e.tier]), i = (l) => {
    if (!r.length) return l.created;
    const c = [];
    for (const f of r) for (const p of ke(f.href)?.status.history ?? []) Fe(p.version.version ?? p.version.tag ?? p.version.revision) === l.build && c.push(p.timestamp);
    if (!c.length) return null;
    const u = c.sort()[0];
    return l.created && l.created > u ? l.created : u;
  };
  return s.map(i).filter((l) => !!l).sort()[0] ?? null;
}
function er(e) {
  const t = Nu(e), n = ke(e.href)?.status.history?.[0]?.version.revision?.slice(0, 7) ?? "";
  return { build: fs(e), meta: Ib(e), title: Mu(e.href, n, null) ?? gr(n, e.href)?.title ?? Xt(e.app, n)?.title ?? (t?.title && !/^Release commit for build /.test(t.title) ? t.title : null), author: t?.author ?? null, at: ke(e.href)?.status.history?.[0]?.timestamp ?? null };
}
function Pr(e) {
  const t = ke(e.href)?.status;
  ke(e.href)?.status.currentVersion;
  const n = t?.availableReleases ?? [], a = Bi(ke(e.href)?.status);
  if (!a) return null;
  const s = e.state === "awaiting-approval" ? "waiting for approval" : e.state === "held-by-rule" ? e.word.replace(/^Waits on /, "waiting on ") : e.state === "failed" ? "waiting for health checks" : null, r = n[n.length - 1], i = s ? Eu(e.href) : null, o = i && i.waiting > 0 ? `${i.count} held: ${s}, ${i.waiting} waiting for ${i.stage ?? "an earlier stage"}` : s ? `held: ${s}` : "";
  return { count: a, sentence: `${a} newer build${a === 1 ? "" : "s"}${o ? ` · ${o}` : ""}`, newest: r ? Fe(r.version ?? r.tag) : null };
}
function Kb(e, t = "incident") {
  const n = new Set(qa(t).rows.filter((a) => a.state === "awaiting-approval" || a.state === "held-by-rule").map((a) => a.href));
  return mn(t, e).filter((a) => a.tier === "prod").map((a) => {
    const s = n.has(a.href) && a.state !== "failed" ? "awaiting-approval" : a.state;
    return { label: a.label, state: s, ink: s === "failed" ? "failed" : s === "awaiting-approval" || s === "held-by-rule" ? "waiting" : s === "deploying" || s === "checking" ? "moving" : "healthy", href: a.href, build: a.version, onNewest: a.onBuild };
  });
}
function Yb(e, t = "incident") {
  if (e.state !== "awaiting-approval" && e.state !== "held-by-rule") return null;
  const n = ke(e.href)?.status, a = n?.releaseCandidates?.[0]?.tag ?? n?.releaseCandidates?.[0]?.version, s = n?.gates ?? [], r = s.filter((l) => l.allowedVersions != null && !!a && !l.allowedVersions.includes(a));
  r.length || r.push(...s.filter((l) => l.passing === !1));
  const i = (e.state === "awaiting-approval" ? r.find((l) => /approval/.test(l.name)) : null) ?? r[0];
  if (!i) return null;
  if (/^dependency-/.test(i.name)) {
    const l = Zn(t).fleet.needsYou, c = l.find((u) => `${u.app}@${u.env}` === e.key)?.facts?.provider ?? l.find((u) => u.app === e.key.split("@")[0] && u.facts?.provider)?.facts?.provider;
    if (c) return { name: c, sentence: `Releases when ${c} ships a newer version` };
  }
  const o = e.state === "awaiting-approval" ? "Releases when someone approves" : /^dependency-/.test(i.name) || /^Waits on [a-z]/.test(e.word) ? "Releases when its dependency ships a newer version" : /schedule|window|freeze/.test(i.name) ? "Releases when the deploy window opens" : /check|health|test/.test(i.name) || Zn(t).fleet.needsYou.find((l) => `${l.app}@${l.env}` === e.key)?.facts?.reason === "check" ? "Releases when the check starts passing" : "Releases when the rule allows this build";
  return { name: Fi(i.name, qb(e.href, i.name)), sentence: o };
}
const al = /* @__PURE__ */ new WeakMap();
function $b() {
  const e = mt(), t = al.get(e);
  if (t) return t;
  const n = /* @__PURE__ */ new Map();
  for (const a of zb()) n.set(a.mergeCommitSha.slice(0, 7), { pr: a.kind === "pr" ? a.number ?? null : null, title: a.title, author: a.author ?? null, href: a.htmlUrl ?? null, repo: a.repo });
  if (!pb())
    try {
      const a = JSON.parse(bm("GET", "/api/github/changes", new URLSearchParams({ days: "365" }))?.body ?? "{}");
      for (const s of a.changes ?? [])
        n.set(s.mergeCommitSha.slice(0, 7), { pr: s.kind === "pr" ? s.number ?? null : null, title: s.title, author: s.author, href: s.htmlUrl, repo: s.repo });
    } catch {
    }
  return al.set(e, n), n;
}
function gr(e, t) {
  if (!e) return null;
  let n = /^[0-9a-f]{7,40}$/.test(e) ? e.slice(0, 7) : null;
  return !n && t && (n = (ke(t)?.status.availableReleases ?? []).find((s) => s.tag === e || s.version === e)?.revision?.slice(0, 7) ?? null), n ? $b().get(n) ?? null : null;
}
function Tu(e, t) {
  const n = pn(e), a = ke(e)?.status.availableReleases ?? [], s = a.findIndex((o) => o.tag === t || o.version === t);
  if (!n || s < 0) return null;
  const r = a[s].revision ?? a[s].tag ?? t, i = s > 0 ? a[s - 1].revision ?? a[s - 1].tag ?? "" : "";
  try {
    const o = Hc(wm(n.ns, n.name, n.cluster), { base: i, head: r });
    if (!o) return null;
    const l = o.commits ?? [], c = l[l.length - 1];
    if (!c) return null;
    const u = /^Release commit for build /.test(String(c.message)) ? gr(c.sha, e) : null;
    return u && (c.message = u.title, c.author = u.author ?? c.author), { title: String(c.message).split(`
`)[0], author: c.author ?? null, additions: o.additions ?? 0, deletions: o.deletions ?? 0, files: o.changedFiles ?? 0, commits: l.map((f) => ({ sha: f.sha.slice(0, 7), title: String(f.message).split(`
`)[0], author: f.author ?? null })) };
  } catch {
    return null;
  }
}
function Qb(e, t) {
  if (!t) return null;
  const n = ke(e)?.status, a = /^github\.com\/([^/]+)\/(.+)$/.exec(n?.source ?? "");
  if (!a) return null;
  const r = (n?.availableReleases ?? []).find((i) => i.tag === t || i.version === t || (i.revision ?? "").startsWith(t))?.revision ?? (/^[0-9a-f]{7,40}$/.test(t) ? t : null);
  if (!r) return null;
  try {
    const i = Hc(`/api/github/repos/${a[1]}/${a[2]}/commits/${r}`);
    return i?.subject ? { title: i.subject, author: i.author ?? null } : null;
  } catch {
    return null;
  }
}
function Mu(e, t, n) {
  const a = Qb(e, t)?.title ?? (n && !/^Release commit for build /.test(n) ? n : null) ?? gr(t, e)?.title ?? n ?? null;
  return a && !/^Release commit for build /.test(a) ? a : null;
}
function Eu(e) {
  const t = ke(e), n = dm(e), a = n ? fm(n) : null;
  return !t || !a ? null : { count: a.count, waiting: a.waiting, stage: a.stage, has: (s) => a.ids.has(vr(t, s.tag ?? s.version ?? "") || (s.tag ?? s.version ?? "")) };
}
function Ki(e) {
  const t = ke(e.href)?.status, n = (t?.gates ?? []).filter((s) => /^promotion-/.test(s.name) && s.allowedVersions != null), a = Eu(e.href);
  return (t?.releaseCandidates ?? []).map((s) => {
    const r = s.tag ?? s.version ?? "", i = Tu(e.href, r), o = Mu(e.href, r, i?.title), l = i?.author ?? null, c = s.version ?? s.tag ?? r;
    return { build: Fe(c) ?? c, title: o, author: l, created: s.created ?? null, here: a ? a.has({ tag: s.tag, version: s.version }) : n.every((u) => u.allowedVersions.includes(r)) };
  });
}
function Lu(e) {
  const t = pn(e.href), n = ke(e.href)?.status.history?.[0];
  if (!t || !n) return [];
  const a = (n.failedHealthChecks ?? []).map((s) => ({ name: s.name, state: "failing", since: n.bakeEndTime ?? n.timestamp, message: s.message ?? null }));
  for (const s of (mt().healthChecks ?? []).flatMap((r) => r.metadata.namespace === t.ns && r.metadata.name === t.name ? r.healthChecks : [])) {
    const r = s.metadata.annotations?.["kuberik.com/display-name"] ?? s.metadata.name;
    if (a.some((o) => o.name === r)) continue;
    const i = s.status?.status;
    a.push({ name: r, state: i === "Healthy" ? "passing" : i === "Pending" ? "pending" : "failing", since: s.status?.lastChangeTime ?? null, message: i === "Healthy" ? null : s.status?.message ?? null });
  }
  return a.some((s) => s.name === "Flux Deployment") || a.push({ name: "Flux Deployment", state: "passing", since: n.timestamp, message: null }), a;
}
function Nu(e) {
  const t = ke(e.href)?.status.history?.[0]?.version;
  if (!t) return null;
  const n = Tu(e.href, t.tag ?? t.version ?? t.revision ?? "");
  return gr(t.revision ?? t.tag, e.href), n;
}
function Zb(e) {
  const t = Nu(e);
  return t ? { title: t.title, author: t.author } : null;
}
function Yi(e) {
  const t = ke(e.href)?.status.history?.[0]?.bakeStatus;
  return e.group === "failed" || t === "Failed" ? "failed" : t === "Deploying" ? "deploying" : t === "InProgress" ? "checking" : t ? "done" : e.state === "deploying" ? "deploying" : e.state === "checking" ? "checking" : "done";
}
function da(e) {
  if (Yi(e) !== "checking") return null;
  const t = ke(e.href), n = t?.status.history?.[0], a = /^(\d+)(s|m|h)$/.exec(t?.spec?.bakeTime ?? "");
  if (!n?.bakeStartTime || !a) return null;
  const s = Date.parse(n.bakeStartTime) + +a[1] * { s: 1e3, m: 6e4, h: 36e5 }[a[2]] - Zt.getTime();
  if (!(s > 0)) return null;
  const r = Math.ceil(s / 6e4);
  return r < 60 ? `${r} min left` : `${Math.floor(r / 60)} h ${r % 60} min left`;
}
function sl(e) {
  const t = Yi(e), n = Lu(e).map((s) => s.name === "Flux Deployment" && (t === "deploying" || t === "checking") ? "pending" : s.state), a = (s) => n.filter((r) => r === s).length;
  return a("failing") ? `${a("failing")} failing · ${a("passing")} passing` : a("pending") ? `${a("pending")} pending · ${a("passing")} passing` : `${a("passing")} passing`;
}
function Xb(e) {
  const t = ke(e.href)?.status.history?.[0], n = Yi(e);
  return {
    step: "Final check",
    age: ma(e.since ?? t?.timestamp ?? Zt.toISOString()),
    message: t?.bakeStatusMessage ?? null,
    healthChecks: n === "failed" ? "Failed" : n === "deploying" ? "Waiting" : n === "checking" ? "Pending" : "Healthy",
    checkTimer: n === "checking" ? "Checking" : n === "done" ? "Done" : "Pending"
  };
}
function Jb(e) {
  const t = ke(e.href)?.status, n = km(t?.history?.[0]?.bakeStatus ?? null), a = t?.releaseCandidates?.[0]?.tag ?? t?.releaseCandidates?.[0]?.version, s = t?.gates ?? [], r = s.filter((i) => i.allowedVersions != null && !!a && !i.allowedVersions.includes(a)).length;
  return { word: n.label.toUpperCase(), role: n.role, holding: r ? r === s.length ? `${r} gate${r === 1 ? "" : "s"} holding` : `${r} of ${s.length} gates holding` : null };
}
function e1(e, t) {
  if (!t) return null;
  for (const n of qi()) if (n.metadata.name === e) {
    for (const a of n.status.availableReleases ?? []) if ([a.tag, a.version, a.revision, a.revision?.slice(0, 7)].includes(t) || a.revision?.startsWith(t)) return Fe(a.version ?? a.tag) ?? t;
  }
  return Fe(t);
}
const jr = /* @__PURE__ */ new WeakMap();
function t1(e) {
  const t = pn(e);
  if (!t) return null;
  const n = mt(), a = n.environments, s = a.find((c) => c.metadata?.namespace === t.ns && c.spec?.rolloutRef?.name === t.name);
  if (!s) return null;
  const r = (jr.get(n) ?? (jr.set(n, fr(a)), jr.get(n))).get(bs(s)), i = Ei(r, s), o = r?.tiers.find((c) => c.tier === i?.tier);
  if (!r || !i || !o) return null;
  const l = i.isLeader ? null : Mi(r, i)[0]?.site ?? null;
  return { site: i.site, wave: i.wave, leader: i.isLeader, follows: l, multi: o.waves.length > 1 };
}
function n1(e, t = "incident") {
  return mn(t, e).map((n) => {
    const a = ps(n.href) > 0, s = Ki({ href: n.href }), r = ke(n.href)?.status.gates ?? [], i = ke(n.href)?.status.releaseCandidates?.[0]?.tag, o = !a && !!i && r.some((u) => u.allowedVersions != null && !u.allowedVersions.includes(i)), l = n.state === "failed" ? "failed" : a ? "approval" : o ? "rule" : s.length && n.state !== "healthy" ? "health" : null, c = a || o ? Yb({ state: a ? "awaiting-approval" : "held-by-rule", href: n.href, word: "", key: `${e}@${n.env}` }, t) : null;
    return { wave: t1(n.href), env: n.env, label: n.label, place: Oa({ tier: n.tier, regions: [n.label] }), tier: n.tier, state: n.state, href: n.href, deployedBuild: e1(e, n.version), holdReason: l, gate: c, heldBuilds: s, runs: n.version };
  });
}
function Ru(e, t = "incident") {
  const n = Math.max(1, e.regions.length), a = e.regions[0] ?? e.where, s = e.tier === "prod" && a !== "prod" ? `prod-${a}` : a === "prod" ? "production" : a, r = e.regions.slice(1), i = r.length > 0 && r.every((f) => {
    const p = mn(t, e.app).find((v) => v.label === f && v.tier === "prod");
    return !!p && ps(p.href) > 0;
  }), o = r.length ? i ? `${r.length} other regions wait on their own approvals` : `${r.length} other region${r.length === 1 ? "" : "s"} hold this build` : null, l = e.tier === "prod" ? Kb(e.app, t) : [], c = l.filter((f) => f.ink === "waiting").length, u = l.length > 1 && c ? c === l.length ? `${c} regions` : `${c} of ${l.length} regions` : null;
  return { sentence: `${St("approval", { yours: e.needsYou })} · ${u ?? s}`, acts: s, n: 1, of: n, others: o };
}
function Ou(e, t = "incident") {
  const n = mn(t, e.app).filter((o) => o.tier === e.tier && ps(o.href) > 0 && (o.href === e.href || !e.regions.length || e.regions.includes(o.label))), a = n.length ? n : ps(e.href) > 0 ? mn(t, e.app).filter((o) => o.href === e.href) : [];
  if (!a.length) return null;
  const s = ys({ app: e.app, href: a[0].href }), r = a.map((o) => {
    const l = ke(o.href)?.status.releaseCandidates ?? [], c = l.find((u) => Fe(u.version ?? u.tag ?? "") === s?.build) ?? l[0];
    return { href: o.href, label: o.label, tag: c?.tag ?? c?.version ?? "" };
  }).filter((o) => o.tag);
  if (!r.length) return null;
  const i = Oa({ tier: e.tier, regions: r.map((o) => o.label) });
  return { key: `${e.app}|${e.tier}|${r.map((o) => o.href).sort().join(",")}`, app: e.app, build: s?.build ?? r[0].tag, where: i, count: r.length, places: r, href: e.href };
}
const di = /* @__PURE__ */ new Map();
function a1(e) {
  const t = [];
  for (const n of e.places) {
    const a = pn(n.href) ? qi().find((i) => i.metadata.namespace === pn(n.href).ns && i.metadata.name === pn(n.href).name) : null;
    if (!a) continue;
    t.push({ r: a, status: structuredClone(a.status) });
    const s = a.status, r = (s.releaseCandidates ?? []).map((i) => i.tag ?? i.version ?? "");
    for (const i of s.gates ?? []) /approval/.test(i.name) && i.allowedVersions != null && (i.allowedVersions = [.../* @__PURE__ */ new Set([...i.allowedVersions, ...r])]);
    s.releaseCandidates = (s.releaseCandidates ?? []).filter((i) => (i.tag ?? i.version) !== n.tag), s.history = [{ version: { tag: n.tag, version: n.tag, revision: n.tag }, timestamp: Zt.toISOString(), bakeStatus: "Deploying", bakeStartTime: Zt.toISOString(), triggeredBy: { kind: "User", name: Ra() } }, ...s.history ?? []];
  }
  di.set(e.key, t), bu(), gu();
}
function Du(e) {
  for (const t of di.get(e.key) ?? []) t.r.status = t.status;
  di.delete(e.key), bu(), gu();
}
function s1(e, t, n) {
  const a = [], s = t === "prod" && n === "production" ? "prod" : n;
  for (const r of qa(e).rows) {
    if (r.tier !== t || !(r.regions.includes(n) || r.regions.includes(s))) continue;
    const i = mn(e, r.app).find((o) => o.tier === t && (o.label === n || o.label === s));
    a.push(r.regions.length === 1 ? r : { ...r, key: `${r.app}@${n}`, regions: [n], where: n, place: n, href: i?.href ?? r.href, regionsOf: null });
  }
  return a;
}
function Fu(e, t) {
  const n = qa(e), a = new Map(n.c.m.fleet.needsYou.map((r) => [`${r.app}@${r.env}`, r])), s = /* @__PURE__ */ new Map();
  for (const r of n.rows) {
    if (r.group !== "approval" && r.group !== "held") continue;
    const o = a.get(r.key)?.facts, l = r.state === "awaiting-approval" ? "Waiting for approval" : o?.reason === "dependency" ? o.provider ? `Waiting on ${o.provider}` : "Waiting on a dependency" : o?.reason === "check" ? o.checks?.length ? `Waiting on ${o.checks.map((u) => Fi(u)).join(", ")}` : "Waiting on a check" : o?.reason === "pinned" ? "Pinned" : o?.reason === "clock" ? "Waiting for the deploy window" : r.word.startsWith("Waits on") ? r.word.replace("Waits on", "Waiting on") : "Held by a rule", c = s.get(l) ?? { key: l, cause: l, places: [], rows: [] };
    c.places.push(`${r.app} · ${r.place}`), c.rows.push(r), s.set(l, c);
  }
  return [...s.values()].sort((r, i) => i.rows.length - r.rows.length || r.cause.localeCompare(i.cause));
}
function r1(e) {
  const t = ke(e.href)?.status.history?.[0];
  if (!t?.bakeStartTime || !t.bakeEndTime) return null;
  const n = Math.max(0, Math.round((Date.parse(t.bakeEndTime) - Date.parse(t.bakeStartTime)) / 1e3));
  return `${Math.floor(n / 60)}m ${n % 60}s`;
}
const i1 = { dev: "dev", test: "test", staging: "staging", prod: "production" }, Iu = (e) => cs(null, i1[e] ?? e), o1 = (e) => e.kind === "approve" ? "Approve" : e.kind === "rollback" ? "Roll back" : e.label;
function rl(e) {
  return e.kind === "approve" ? /\/gates$/.test(e.href) ? e.href : e.href.replace(/\/$/, "") + "/gates" : e.kind !== "rollback" || e.href.includes("action=") ? e.href : `${e.href}${e.href.includes("?") ? "&" : "?"}action=rollback`;
}
const l1 = (e) => Bb(e);
function c1(e, t) {
  if (e.group !== "held") return null;
  const n = Fu(t).find((a) => a.rows.some((s) => s.key === e.key));
  return !n || n.cause === "Held by a rule" ? null : n.cause.replace(/^Waiting/, "Waits");
}
const Pu = "danielreed";
function u1(e, t) {
  return e.group === "failed" ? "Deployment failed" : t && c1(e, t) || e.word;
}
function d1(e, t) {
  return e.group !== "approval" ? null : Ru(e, t).sentence.replace(/^Needs your approval/, "Your approval");
}
function ju(e, t) {
  return e.state === "fail" ? "failed" : e.state === "hold" ? "held" : e.state === "done" ? "done" : e.state === "todo" ? "todo" : e.name === "Check" && t !== "deploying" ? "checking" : "deploying";
}
const f1 = { xs: { d: 10, pitch: 22, line: 1 }, sm: { d: 24, pitch: 56, line: 2 } };
function $i(e, t, n = !1) {
  return e.map((a) => ({
    state: a.state === "done" ? "done" : a.state === "fail" ? "failed" : a.state === "hold" ? "held" : a.state === "todo" ? "pending" : ju(a, t) === "checking" ? "checking" : "current",
    label: n ? a.name : void 0,
    step: a.name,
    stepState: a.state
  }));
}
var p1 = /* @__PURE__ */ W('<span aria-hidden="true"></span>'), v1 = /* @__PURE__ */ W('<li class="mp-slot svelte-12vk4m5" data-fold="" data-node="fold"><span class="mp-fold t-meta tabular-nums svelte-12vk4m5" aria-hidden="true"> </span></li>'), h1 = /* @__PURE__ */ W('<span aria-hidden="true"></span>'), m1 = /* @__PURE__ */ W("<span></span>"), g1 = /* @__PURE__ */ ue('<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M9 5.5v13M15 5.5v13"></path></svg>'), b1 = /* @__PURE__ */ W('<span class="h-1.5 w-1.5 rounded-full bg-success-solid"></span>'), w1 = /* @__PURE__ */ W("<span> </span>"), k1 = /* @__PURE__ */ W('<span aria-hidden="true"><!></span> <!>', 1), _1 = /* @__PURE__ */ W('<li class="mp-slot svelte-12vk4m5"><!></li>'), y1 = /* @__PURE__ */ W("<!> <!>", 1), x1 = /* @__PURE__ */ W('<ol data-strand=""></ol>');
function Wu(e, t) {
  Se(t, !0);
  let n = q(t, "size", 3, "xs"), a = q(t, "lit", 3, !0), s = q(t, "dim", 3, !1), r = q(t, "neutral", 3, !1), i = q(t, "max", 3, void 0), o = q(t, "decorative", 3, !1), l = q(t, "label", 3, void 0), c = q(t, "kind", 3, "strand"), u = q(t, "class", 3, "");
  const f = /* @__PURE__ */ V(() => f1[n()]), p = /* @__PURE__ */ V(() => Math.max(3, i() ?? (n() === "sm" ? 5 : 6))), v = /* @__PURE__ */ new Set(["current", "checking", "held", "approval", "failed"]), y = /* @__PURE__ */ V(() => {
    const k = t.nodes.map((j) => ({ fold: !1, n: j }));
    if (t.nodes.length <= d(p)) return k;
    const T = t.nodes.length - d(
      p
      // the fold node takes one slot itself
    ) + 1, F = (j) => j > 0 && j < t.nodes.length - 1 && !v.has(t.nodes[j].state);
    let z = null;
    for (let j = 1; j < t.nodes.length - 1; ) {
      if (!F(j)) {
        j++;
        continue;
      }
      let D = j;
      for (; D < t.nodes.length - 1 && F(D); ) D++;
      if (D - j >= T) {
        z = [j, j + T];
        break;
      }
      (!z || D - j > z[1] - z[0]) && (z = [j, D]), j = D;
    }
    return !z || z[1] - z[0] < 2 ? k : [
      ...k.slice(0, z[0]),
      { fold: !0, hidden: t.nodes.slice(z[0], z[1]) },
      ...k.slice(z[1])
    ];
  }), b = /* @__PURE__ */ V(() => d(y).reduce(
    (k, T, F) => (T.fold ? T.hidden.some((z) => z.state !== "pending") : T.n.state !== "pending") ? F : k,
    -1
  )), g = /* @__PURE__ */ V(() => n() === "sm" && t.nodes.some((k) => k.label)), h = /* @__PURE__ */ V(() => d(g) ? (d(f).pitch - 4 - d(f).d) / 2 : 0), x = /* @__PURE__ */ V(() => (d(y).length - 1) * d(f).pitch + d(f).d + 2 * d(h)), m = {
    done: "done",
    current: "running",
    pending: "not started",
    failed: "failed",
    held: "waiting",
    approval: "waiting for approval",
    checking: "checking",
    rest: "healthy"
  }, C = /* @__PURE__ */ V(() => l() ?? "Steps: " + t.nodes.map((k) => `${k.label ?? k.step ?? ""} ${m[k.state]}`.trim()).join(", ")), _ = (k) => k === "done" ? "mp-done" : k === "failed" ? "st-fail" : k === "held" ? "st-hold" : k === "approval" ? "mp-ask" : k === "checking" ? "st-check" : k === "current" ? "st-active " + (a() ? "st-live" : "") : k === "rest" ? "mp-rest" : "mp-ring mp-ring-off", A = (k) => k === "done" ? "bg-success-tint text-success" : k === "failed" ? "bg-danger-tint text-danger" : k === "checking" ? "bg-progress-tint text-progress" : k === "current" ? "bg-active-tint text-active" : k === "held" ? "bg-held-tint text-held" : k === "approval" ? "mp-ask text-fg" : k === "rest" ? "bg-subtle" : "bg-subtle text-fg-disabled", E = (k) => k === "checking" ? "border-progress-solid/40 border-t-progress-solid" : "border-active-solid/40 border-t-active-solid", S = (k) => k.title ?? `${k.label ?? k.step ?? ""}${k.label || k.step ? " · " : ""}${m[k.state]}`;
  var w = x1();
  let L;
  At(w, 21, () => d(y), xi, (k, T, F) => {
    var z = y1(), j = ne(z);
    {
      var D = (se) => {
        var G = p1();
        let X, re;
        P(() => {
          X = ie(G, 1, "mp-seg svelte-12vk4m5", null, X, { "mp-solid": F <= d(b) }), re = rt(G, "", re, {
            left: `${(F - 1) * d(f).pitch + d(f).d + d(h)}px`
          });
        }), M(se, G);
      };
      O(j, (se) => {
        F > 0 && se(D);
      });
    }
    var H = I(j, 2);
    {
      var te = (se) => {
        var G = v1();
        let X;
        var re = N(G), R = N(re);
        P(
          (U) => {
            $(G, "title", `${d(T).hidden.length ?? ""} more: ${U ?? ""}`), X = rt(G, "", X, { left: `${F * d(f).pitch + d(h)}px` }), K(R, `+${d(T).hidden.length ?? ""}`);
          },
          [
            () => d(T).hidden.map((U) => U.label ?? U.step ?? m[U.state]).join(", ")
          ]
        ), M(se, G);
      }, ae = (se) => {
        const G = /* @__PURE__ */ V(() => d(T).n);
        var X = _1();
        let re;
        var R = N(X);
        {
          var U = (J) => {
            var Q = h1();
            P((ee) => ie(Q, 1, `st-node mp-dot ${ee ?? ""}`, "svelte-12vk4m5"), [() => _(d(G).state)]), M(J, Q);
          }, Y = (J) => {
            var Q = k1(), ee = ne(Q), ce = N(ee);
            {
              var de = (ve) => {
                ur(ve, { class: "h-4 w-4" });
              }, Z = (ve) => {
                var Le = le(), He = ne(Le);
                {
                  var _e = (Be) => {
                    za(Be, { class: "h-4 w-4" });
                  }, $e = (Be) => {
                    var gt = le(), Ie = ne(gt);
                    {
                      var B = (fe) => {
                        var Qe = m1();
                        P((Wt) => ie(Qe, 1, `h-4 w-4 animate-spin rounded-full border-2 ${Wt ?? ""}`, "svelte-12vk4m5"), [() => E(d(G).state)]), M(fe, Qe);
                      }, oe = (fe) => {
                        var Qe = le(), Wt = ne(Qe);
                        {
                          var Dn = (Ze) => {
                            var Xe = g1();
                            M(Ze, Xe);
                          }, bn = (Ze) => {
                            var Xe = le(), bt = ne(Xe);
                            {
                              var Mt = (Oe) => {
                                _c(Oe, { class: "h-3.5 w-3.5" });
                              }, It = (Oe) => {
                                var ea = le(), ta = ne(ea);
                                {
                                  var xs = (wn) => {
                                    var kr = b1();
                                    M(wn, kr);
                                  }, wr = (wn) => {
                                    kc(wn, { class: "h-4 w-4" });
                                  };
                                  O(
                                    ta,
                                    (wn) => {
                                      d(G).state === "rest" ? wn(xs) : wn(wr, !1);
                                    },
                                    !0
                                  );
                                }
                                M(Oe, ea);
                              };
                              O(
                                bt,
                                (Oe) => {
                                  d(G).state === "approval" ? Oe(Mt) : Oe(It, !1);
                                },
                                !0
                              );
                            }
                            M(Ze, Xe);
                          };
                          O(
                            Wt,
                            (Ze) => {
                              d(G).state === "held" ? Ze(Dn) : Ze(bn, !1);
                            },
                            !0
                          );
                        }
                        M(fe, Qe);
                      };
                      O(
                        Ie,
                        (fe) => {
                          d(G).state === "current" || d(G).state === "checking" ? fe(B) : fe(oe, !1);
                        },
                        !0
                      );
                    }
                    M(Be, gt);
                  };
                  O(
                    He,
                    (Be) => {
                      d(G).state === "failed" ? Be(_e) : Be($e, !1);
                    },
                    !0
                  );
                }
                M(ve, Le);
              };
              O(ce, (ve) => {
                d(G).state === "done" ? ve(de) : ve(Z, !1);
              });
            }
            var pe = I(ee, 2);
            {
              var he = (ve) => {
                var Le = w1(), He = N(Le);
                P(
                  (_e) => {
                    ie(Le, 1, `mp-name ${_e ?? ""} ${d(G).state === "failed" && a() ? "text-danger" : ""}`, "svelte-12vk4m5"), $(Le, "title", d(G).label), K(He, d(G).label);
                  },
                  [
                    () => a() && v.has(d(G).state) ? "t-ui-sm text-fg" : "t-meta text-fg-subtle"
                  ]
                ), M(ve, Le);
              };
              O(pe, (ve) => {
                d(G).label && ve(he);
              });
            }
            P((ve) => ie(ee, 1, `mp-disc ${ve ?? ""}`, "svelte-12vk4m5"), [() => A(d(G).state)]), M(J, Q);
          };
          O(R, (J) => {
            n() === "xs" ? J(U) : J(Y, !1);
          });
        }
        P(
          (J) => {
            $(X, "data-node", d(G).state), $(X, "data-step", o() ? void 0 : d(G).step ?? d(G).label), $(X, "data-state", o() ? void 0 : d(G).stepState ?? d(G).state), $(X, "title", J), re = rt(X, "", re, { left: `${F * d(f).pitch + d(h)}px` });
          },
          [
            () => o() ? void 0 : n() === "xs" ? S(d(G)) : d(G).title
          ]
        ), M(se, X);
      };
      O(H, (se) => {
        d(T).fold ? se(te) : se(ae, !1);
      });
    }
    M(k, z);
  }), P(() => {
    ie(w, 1, `mp mp-${n() ?? ""} ${s() ? "mp-dim" : ""} ${r() ? "mp-nu" : ""} ${u() ?? ""}`, "svelte-12vk4m5"), $(w, "role", o() ? void 0 : "img"), $(w, "aria-label", o() ? void 0 : d(C)), $(w, "aria-hidden", o() ? "true" : void 0), $(w, "data-pipeline", c()), $(w, "data-size", n()), $(w, "data-pitch", d(f).pitch), $(w, "data-d", d(f).d), $(w, "data-n", d(y).length), $(w, "data-lead", d(h)), L = rt(w, "", L, {
      width: `${d(x) ?? ""}px`,
      height: `${(d(g) ? d(f).d + 28 : d(f).d) ?? ""}px`,
      "--d": `${d(f).d ?? ""}px`,
      "--pitch": `${d(f).pitch ?? ""}px`,
      "--line": `${d(f).line ?? ""}px`,
      "--lead": `${d(h) ?? ""}px`
    });
  }), M(e, w), Ce();
}
const S1 = () => mt().rollouts, C1 = (e) => {
  const t = /^(\d+)(s|m|h)$/.exec(e ?? "");
  return t ? +t[1] * { s: 1e3, m: 6e4, h: 36e5 }[t[2]] : 0;
}, il = (e) => {
  const t = e.split("/").filter(Boolean);
  return t[0] === "rollouts" && t.length >= 4 ? `${t[2]}/${t[3]}` : e;
};
function A1(e = "incident") {
  const t = /* @__PURE__ */ new Map(), n = qa(e).rows;
  for (const a of S1()) {
    const s = a.status?.history?.[0], r = C1(a.spec?.bakeTime);
    if (!s?.bakeStartTime || !r || s.bakeStatus !== "InProgress") continue;
    const i = `${a.metadata.namespace}/${a.metadata.name}`, o = n.find((c) => il(c.href) === i), l = (Zt.getTime() - Date.parse(s.bakeStartTime)) / r;
    l >= 1 || t.set(i, { fraction: Math.max(0.04, l), words: o ? da({ ...o, state: "checking" }) : null });
  }
  for (const a of n) {
    const s = il(a.href);
    if (a.state === "deploying" && a.steps.length > 1 && !t.has(s)) {
      const r = a.steps.filter((i) => i.state === "done").length;
      t.set(s, { fraction: Math.max(0.04, r / a.steps.length), words: null });
    }
  }
  return t;
}
const T1 = /* @__PURE__ */ V(() => A1("incident")), M1 = () => d(T1), E1 = Symbol.for("kuberik-r42-atoms"), Bu = () => vt(E1) ?? { regions: !0, lead: !0, get progress() {
  return M1();
} };
var L1 = /* @__PURE__ */ ue('<line y1="4" y2="4" class="lb-wait svelte-hnsc61"><title> </title></line>'), N1 = /* @__PURE__ */ ue('<rect y="1" height="6" rx="1.5"><title> </title></rect>'), R1 = /* @__PURE__ */ ue('<line y1="4" y2="4" class="lb-rest svelte-hnsc61"></line>'), O1 = /* @__PURE__ */ ue('<svg height="8" role="img" data-lead-bar=""><!><!><!></svg>');
function D1(e, t) {
  Se(t, !0);
  let n = q(t, "origin", 3, void 0), a = q(t, "width", 3, 160), s = q(t, "class", 3, "");
  const r = /* @__PURE__ */ V(() => n() ?? t.hops[0]?.start ?? 0), i = (g) => Math.max(0, Math.min(a(), (g - d(r)) / Math.max(1, t.scaleMs) * a())), o = (g) => {
    const h = Math.round(g / 6e4);
    return h < 60 ? `${Math.max(1, h)}m` : `${Math.floor(h / 60)}h${h % 60 ? ` ${h % 60}m` : ""}`;
  }, l = /* @__PURE__ */ V(() => t.hops.map((g, h) => {
    const x = i(g.start), m = Math.max(i(g.end), x + 3);
    return {
      ...g,
      a: x,
      w: m - x,
      last: h === t.hops.length - 1,
      title: `${g.tier}: ${o(g.end - g.start)}`
    };
  })), c = /* @__PURE__ */ V(() => [
    ...n() != null && d(l)[0] ? [
      {
        a: 0,
        b: d(l)[0].a,
        title: `merged; first deploy ${o(t.hops[0].start - n())} later`
      }
    ] : [],
    ...t.hops.slice(1).map((g, h) => ({
      a: d(l)[h].a + d(l)[h].w,
      b: d(l)[h + 1].a,
      title: `waited ${o(g.start - t.hops[h].end)} before ${g.tier}`
    }))
  ].filter((g) => g.b - g.a > 1)), u = /* @__PURE__ */ V(() => d(l).length ? d(l)[d(l).length - 1].a + d(l)[d(l).length - 1].w : 0);
  var f = O1(), p = N(f);
  At(p, 17, () => d(c), xi, (g, h) => {
    var x = L1(), m = N(x), C = N(m);
    P(() => {
      $(x, "x1", d(h).a), $(x, "x2", d(h).b), K(C, d(h).title);
    }), M(g, x);
  });
  var v = I(p);
  At(v, 17, () => d(l), (g) => g.tier + g.start, (g, h) => {
    var x = N1();
    let m;
    var C = N(x), _ = N(C);
    P(() => {
      $(x, "x", d(h).a), $(x, "width", d(h).w), m = ie(x, 0, "lb-run svelte-hnsc61", null, m, { last: d(h).last }), K(_, d(h).title);
    }), M(g, x);
  });
  var y = I(v);
  {
    var b = (g) => {
      var h = R1();
      P(() => {
        $(h, "x1", d(u)), $(h, "x2", a());
      }), M(g, h);
    };
    O(y, (g) => {
      d(u) < a() && g(b);
    });
  }
  P(
    (g) => {
      ie(f, 0, `lb ${s() ?? ""}`, "svelte-hnsc61"), $(f, "width", a()), $(f, "viewBox", `0 0 ${a() ?? ""} 8`), $(f, "aria-label", `reached prod in ${g ?? ""}`);
    },
    [
      () => o((t.hops.at(-1)?.end ?? d(r)) - d(r))
    ]
  ), M(e, f), Ce();
}
var F1 = /* @__PURE__ */ W('<span class="lr-pl t-meta svelte-9kjh2y"> </span>'), I1 = /* @__PURE__ */ W(' <span class="lr-left t-meta tabular-nums svelte-9kjh2y"> </span> ', 1), P1 = /* @__PURE__ */ W('<span class="lr-ld svelte-9kjh2y" data-state-word=""> </span><!> ', 1), j1 = /* @__PURE__ */ W('<span class="lr-code first t-code-sm svelte-9kjh2y"> </span>'), W1 = /* @__PURE__ */ W('<span class="lr-code t-code-sm svelte-9kjh2y"> </span>'), B1 = /* @__PURE__ */ W("<!> <!>", 1), z1 = /* @__PURE__ */ W('<!><span class="lr-lead-t tabular-nums svelte-9kjh2y"> <span class="lr-tp svelte-9kjh2y">to prod</span></span>', 1), H1 = /* @__PURE__ */ W('<span class="lr-ldw t-meta svelte-9kjh2y"><!></span>'), V1 = /* @__PURE__ */ W('<li><div class="lr-in svelte-9kjh2y"><span class="lr-mk svelte-9kjh2y"><!></span> <div class="lr-id svelte-9kjh2y"><a> </a> <!></div> <span class="lr-dr svelte-9kjh2y"><!></span> <p class="lr-sn svelte-9kjh2y"><!></p> <!> <span class="lr-age t-meta svelte-9kjh2y"> </span></div></li>');
function ol(e, t) {
  Se(t, !0);
  let n = q(
    t,
    "row",
    3,
    null
    /** the quiet flow (Changes' At rest): no mark / drawing tracks, the age auto-wide */
  ), a = q(t, "rest", 3, null), s = q(t, "dense", 3, !1);
  const r = /* @__PURE__ */ V(() => n()?.href ?? a()?.href ?? "#"), i = Bu(), o = /* @__PURE__ */ V(() => n() && n().mark === "checking" && i.progress ? i.progress.get(d(r).split("/").filter(Boolean).slice(2, 4).join("/")) ?? null : null), l = /* @__PURE__ */ V(() => n()?.app ?? a()?.app ?? ""), c = /* @__PURE__ */ V(() => n() ? n().place ? /^\d+ regions?$/.test(n().place) ? n().place.replace(/ (regions?)$/, ` ${n().tier} $1`) : `${n().tier}-${n().place}` : n().tier : "");
  var u = V1();
  Ye(
    u,
    (H) => ({
      class: "lr tap-zone",
      "data-key": n()?.key ?? a()?.key,
      ...H,
      [Cn]: {
        q: !!a(),
        dn: s(),
        hl: !!a() && a().lead !== void 0
      }
    }),
    [
      () => s() ? {} : {
        "data-truth-kind": n() ? "rollout" : "rest",
        "data-truth-app": d(l),
        "data-truth-href": d(r),
        "data-truth-group": n()?.row.group ?? "rest",
        ...n() ? jb(n().row) : { "data-truth-state": "healthy" }
      }
    ],
    void 0,
    void 0,
    "svelte-9kjh2y"
  );
  var f = N(u), p = N(f), v = N(p);
  {
    var y = (H) => {
      {
        let te = /* @__PURE__ */ V(() => d(o)?.fraction ?? null);
        ba(H, {
          get state() {
            return n().mark;
          },
          get progress() {
            return d(te);
          }
        });
      }
    };
    O(v, (H) => {
      n() && H(y);
    });
  }
  var b = I(p, 2), g = N(b);
  let h;
  var x = N(g), m = I(g, 2);
  {
    var C = (H) => {
      {
        let te = /* @__PURE__ */ V(() => Iu(n().tier));
        Li(H, {
          role: "env",
          get theme() {
            return d(te);
          },
          get label() {
            return d(c);
          },
          wide: !0
        });
      }
    }, _ = (H) => {
      var te = le(), ae = ne(te);
      {
        var se = (G) => {
          var X = F1(), re = N(X);
          P(() => K(re, a().place)), M(G, X);
        };
        O(
          ae,
          (G) => {
            a()?.place && G(se);
          },
          !0
        );
      }
      M(H, te);
    };
    O(m, (H) => {
      n() ? H(C) : H(_, !1);
    });
  }
  var A = I(b, 2), E = N(A);
  {
    var S = (H) => {
      Wu(H, {
        get nodes() {
          return n().nodes;
        },
        neutral: !0,
        get label() {
          return `${d(l) ?? ""} steps`;
        }
      });
    };
    O(E, (H) => {
      n() && H(S);
    });
  }
  var w = I(A, 2), L = N(w);
  {
    var k = (H) => {
      var te = P1(), ae = ne(te), se = N(ae), G = I(ae);
      {
        var X = (R) => {
          var U = I1(), Y = ne(U, !0);
          Y.nodeValue = " ";
          var J = I(Y), Q = N(J), ee = I(J, 1, !0);
          ee.nodeValue = " ", P(() => K(Q, d(o).words)), M(R, U);
        };
        O(G, (R) => {
          d(o)?.words && !n().row.stillChecking && R(X);
        });
      }
      var re = I(G, 1, !0);
      P(() => {
        K(se, n().lead), K(re, n().rest);
      }), M(H, te);
    }, T = (H) => {
      var te = le(), ae = ne(te);
      {
        var se = (G) => {
          var X = B1(), re = ne(X);
          {
            var R = (Q) => {
              var ee = j1(), ce = N(ee);
              P(() => K(ce, a().code)), M(Q, ee);
            };
            O(re, (Q) => {
              a().codeFirst && a().code && Q(R);
            });
          }
          var U = I(re, 1, !0), Y = I(U);
          {
            var J = (Q) => {
              var ee = W1(), ce = N(ee);
              P(() => K(ce, a().code)), M(Q, ee);
            };
            O(Y, (Q) => {
              !a().codeFirst && a().code && Q(J);
            });
          }
          P(() => K(U, a().sentence)), M(G, X);
        };
        O(
          ae,
          (G) => {
            a() && G(se);
          },
          !0
        );
      }
      M(H, te);
    };
    O(L, (H) => {
      n() ? H(k) : H(T, !1);
    });
  }
  var F = I(w, 2);
  {
    var z = (H) => {
      var te = H1(), ae = N(te);
      {
        var se = (G) => {
          var X = z1(), re = ne(X);
          D1(re, {
            get hops() {
              return a().lead.hops;
            },
            get origin() {
              return a().lead.origin;
            },
            get scaleMs() {
              return a().lead.scale;
            },
            width: 72
          });
          var R = I(re), U = N(R);
          P(() => K(U, a().lead.total)), M(G, X);
        };
        O(ae, (G) => {
          a().lead && G(se);
        });
      }
      P(() => $(te, "title", a().lead ? `${a().lead.total} to prod` : void 0)), M(H, te);
    };
    O(F, (H) => {
      a() && a().lead !== void 0 && H(z);
    });
  }
  var j = I(F, 2), D = N(j);
  P(() => {
    $(g, "href", d(r)), h = ie(g, 1, "tap-link lr-nm svelte-9kjh2y", null, h, { rep: a()?.rep }), $(g, "aria-label", n() ? `${d(l)} in ${n().place ?? n().tier}` : `${d(l)} ${a()?.place}`), K(x, d(l)), K(D, n()?.age ?? a()?.age ?? "");
  }), M(e, u), Ce();
}
var U1 = /* @__PURE__ */ W('<section class="lc-g" data-group="In flight"><div class="lc-gh"><span class="lc-gt">In flight</span><span class="lc-gn"> </span></div> <ul class="lc-rows"></ul></section> <section class="lc-g" data-group="At rest"><div class="lc-gh"><span class="lc-gt">At rest</span><span class="lc-gn"> </span></div> <ul class="lc-rows"></ul></section>', 1);
function q1(e, t) {
  Se(t, !0), ip(e, {
    children: (n, a) => {
      var s = U1(), r = ne(s), i = N(r), o = I(N(i)), l = N(o), c = I(i, 2);
      At(c, 21, () => t.moving, (b) => b.key, (b, g) => {
        ol(b, {
          get row() {
            return d(g);
          }
        });
      });
      var u = I(r, 2), f = N(u), p = I(N(f)), v = N(p), y = I(f, 2);
      At(y, 21, () => t.rest, (b) => b.key, (b, g) => {
        ol(b, {
          get rest() {
            return d(g);
          }
        });
      }), P(() => {
        K(l, t.moving.length), K(v, t.rest.length);
      }), M(n, s);
    },
    $$slots: { default: !0 }
  }), Ce();
}
const nn = (e, t, n, a) => [
  { name: "Started", state: e },
  { name: "Stage 1", state: t },
  { name: "Stage 2", state: n },
  { name: "Check", state: a }
], ll = { tier: "dev", place: null, href: "/rollouts/hub/payments/payments-api-dev" }, cl = { tier: "staging", place: null, href: "/rollouts/hub/payments/payments-api-staging" }, Os = { tier: "prod", place: "eu-west", href: "/rollouts/hub/payments/payments-api-prod-eu-west" };
function xn(e, t, n, a, s, r) {
  return {
    key: "payments-api",
    app: "payments-api",
    href: e.href,
    tier: e.tier,
    place: e.place,
    mark: n,
    nodes: $i(t, n === "deploying" ? "deploying" : "checking"),
    lead: a,
    rest: s,
    age: r,
    yours: !1,
    row: { group: n === "failed" ? "failed" : "moving" }
  };
}
const zu = {
  key: "checkout-web",
  app: "checkout-web",
  href: "/rollouts/hub/shop/checkout-web-test",
  tier: "test",
  place: null,
  mark: "deploying",
  nodes: $i(nn("done", "done", "active", "todo"), "deploying"),
  lead: "Deploying",
  rest: "v3.8.2 · step 3 of 4",
  age: "3m",
  yours: !1,
  row: { group: "moving" }
}, js = (e, t, n, a, s = !1) => ({ key: e + t, app: e, href: "#", place: t, rep: s, sentence: "On the newest", code: n, age: a, tier: t }), Hu = [js("billing-worker", "prod · eu-west", "v1.19.0", "2d"), js("billing-worker", "prod · us-east", "v1.19.0", "2d", !0), js("search-api", "prod", "v7.4.1", "5d")], ca = "v2.14.0", Sn = (e, t = []) => ({ moving: [e, zu], rest: [...t, ...Hu] }), Vu = [
  { at: 0, state: Sn(xn(ll, nn("active", "todo", "todo", "todo"), "deploying", "Deploying", `${ca} · dev`, "12s")) },
  { at: 1400, state: Sn(xn(ll, nn("done", "done", "done", "active"), "checking", "Checking", `${ca} · 1 min left`, "1m")) },
  { at: 3e3, state: Sn(xn(cl, nn("active", "todo", "todo", "todo"), "deploying", "Deploying", `${ca} · staging`, "4m")) },
  { at: 4400, state: Sn(xn(cl, nn("done", "done", "done", "active"), "checking", "Checking", `${ca} · 2 min left`, "9m")) },
  { at: 6e3, state: Sn(xn(Os, nn("done", "active", "todo", "todo"), "deploying", "Deploying", `${ca} · step 2 of 4`, "14m")) },
  { at: 7600, state: Sn(xn(Os, nn("done", "done", "fail", "todo"), "failed", "Failing", `${ca} · latency over limit`, "2m")) },
  { at: 9400, state: Sn(xn(Os, nn("done", "done", "active", "todo"), "deploying", "Deploying", "v2.14.1 · fix, step 3 of 4", "40s")) },
  { at: 11e3, state: Sn(xn(Os, nn("done", "done", "done", "active"), "checking", "Checking", "v2.14.1 · 1 min left", "3m")) },
  { at: 12600, state: { moving: [zu], rest: [{ ...js("payments-api", "prod · eu-west", "v2.14.1", "now"), key: "payments-api-rest" }, ...Hu] } }
], G1 = Vu[0].state, K1 = 5;
function Y1(e) {
  const t = e.split("?")[0].split("/").filter(Boolean);
  return t[0] === "rollouts" && t.length >= 4 ? { cluster: t[1], namespace: t[2], name: t[3] } : null;
}
async function Uu(e, t, n = !1, a = fetch) {
  const s = Y1(e);
  if (!s) throw new Error(`not a rollout: ${e}`);
  const r = await a(bh(s.cluster, `/rollouts/${s.namespace}/${s.name}/approve`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(n ? { version: t, revoke: !0 } : { version: t })
  });
  if (!r.ok) throw new Error((await r.json().catch(() => null))?.error ?? `${n ? "Undo" : "Approve"} failed (${r.status})`);
}
const $1 = 8e3, ze = Pt({ ask: null, done: null });
let Ws = null, qu = Promise.resolve();
const Qi = () => {
  Ws && clearTimeout(Ws), Ws = null;
}, ul = (e) => `Approve ${e.build} ${e.count > 1 ? "for" : "in"} ${e.where}?`, Q1 = (e) => ({
  title: `Approved ${e.build}`,
  detail: `${e.app} is deploying to ${e.where}`
});
function Z1(e, t) {
  if (!e) return;
  const a = (t?.currentTarget ?? null)?.getBoundingClientRect?.();
  ze.ask = {
    target: e,
    anchor: a ? { top: a.top, left: a.left, right: a.right, bottom: a.bottom } : null
  };
}
const Wr = () => {
  ze.ask = null;
};
function X1(e) {
  const t = ze.ask;
  if (!t) return;
  const n = t.target;
  ze.ask = null, Qi(), a1(n), ze.done = { target: n, error: null }, qu = Promise.all(n.places.map((a) => Uu(a.href, a.tag, !1, e))).catch((a) => {
    Du(n), ze.done = { target: n, error: a.message || "Approval failed" };
  }), Ws = setTimeout(fi, $1);
}
function J1(e) {
  const t = ze.done;
  if (!t || t.error) return;
  const n = t.target;
  Qi(), Du(n), ze.done = null, qu.then(() => Promise.all(n.places.map((a) => Uu(a.href, a.tag, !0, e)))).catch(() => {
  });
}
function fi() {
  Qi(), ze.done = null;
}
function ew(e, t = {}) {
  return e ? {
    label: "Approve",
    key: "approve",
    onclick: (n) => Z1(e, n),
    ...t,
    data: {
      "data-approve-open": "",
      "data-href": `${e.href.replace(/\/$/, "")}/gates`,
      ...t.data ?? {}
    }
  } : void 0;
}
function Gu(e) {
  return Pt(e);
}
const pi = [203, 345, 308, 130, 245, 175, 110, 280];
function Ku(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n++)
    t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
  return t >>> 0;
}
function br(e) {
  const t = e.split(/[\s._/-]+/).map((n) => n.replace(/[^\p{L}\p{N}]/gu, "")).filter(Boolean);
  return t.length === 0 ? "?" : t.length === 1 ? t[0].slice(0, 2).toUpperCase() : (t[0][0] + t[1][0]).toUpperCase();
}
const tw = (e) => e.split(/[\s._/-]+/).map((t) => t.replace(/[^\p{L}\p{N}]/gu, "")).filter(Boolean);
function nw(e) {
  const t = [...new Set(e)].sort(), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  for (const r of t) {
    const i = br(r);
    n.set(r, i), (a.get(i) ?? a.set(i, []).get(i)).push(r);
  }
  const s = new Set([...a.keys()].filter((r) => a.get(r).length === 1));
  for (const [, r] of [...a].sort(([i], [o]) => i < o ? -1 : 1)) {
    if (r.length < 2) continue;
    const i = r.map(tw);
    let o = 0;
    for (; i.every((u) => u[o] !== void 0 && u[o] === i[0][o]); ) o++;
    const l = (u) => {
      const f = u[o] ?? "", p = o > 0 ? u[o - 1] : "";
      return [
        p && f ? p[0] + f[0] : "",
        u[0] && f ? u[0][0] + f[0] : "",
        f.slice(0, 2),
        (u[0] ?? "").slice(0, 2)
      ].map((v) => v.toUpperCase()).filter((v) => v.length === 2);
    }, c = i.map(l);
    for (let u = 0; u < 4; u++) {
      const f = c.map((p) => p[u]);
      if (f.every((p) => p && !s.has(p)) && new Set(f).size === f.length) {
        r.forEach((p, v) => {
          n.set(p, f[v]), s.add(f[v]);
        });
        break;
      }
    }
  }
  return n;
}
function aw(e) {
  return { monogram: br(e), hue: pi[Ku(e) % pi.length] };
}
function sw(e) {
  return Ku(e) % pi.length;
}
let rw = /* @__PURE__ */ Ee([]), iw = /* @__PURE__ */ Ee(!1);
function ow(e) {
  const t = hn();
  if (d(iw) && !t) return null;
  const n = new Set(d(rw));
  for (const a of t?.rollouts ?? []) a.metadata?.name && n.add(a.metadata.name);
  return n.add(e), nw([...n]).get(e) ?? br(e);
}
var lw = /* @__PURE__ */ W('<span aria-hidden="true"> </span>');
function cw(e, t) {
  Se(t, !0);
  let n = q(t, "size", 3, 20), a = q(t, "class", 3, "");
  const s = /* @__PURE__ */ V(() => aw(t.name)), r = /* @__PURE__ */ V(() => ow(t.name)), i = /* @__PURE__ */ V(() => sw(t.name)), o = { 16: 9, 20: 10, 24: 12, 32: 12 }, l = { 16: "-0.04em", 20: "-0.04em", 24: "0", 32: "0" }, c = { 16: 4, 20: 6, 24: 6, 32: 8 };
  var u = lw(), f = N(u);
  P(() => {
    ie(u, 1, `app-glyph id${d(i) ?? ""} inline-flex shrink-0 items-center justify-center select-none ${a() ?? ""}`, "svelte-1mesrou"), rt(u, `width: ${n() ?? ""}px; height: ${n() ?? ""}px; border-radius: ${c[n()] ?? ""}px; font-size: ${o[n()] ?? ""}px; letter-spacing: ${l[n()] ?? ""}`), $(u, "data-app-hue", d(s).hue), $(u, "data-pending", d(r) === null ? "" : void 0), K(f, d(r) ?? "");
  }), M(e, u), Ce();
}
const uw = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20style='isolation:isolate'%20viewBox='0%200%20800%20980'%20width='800pt'%20height='980pt'%3e%3cdefs%3e%3clinearGradient%20id='lgradhat'%20x1='95%25'%20y1='0%25'%20x2='5%25'%20y2='100%25'%20%3e%3cstop%20offset='30%25'%20style='stop-color:rgb(0,%20201,%20181);stop-opacity:1'%20/%3e%3cstop%20offset='100%25'%20style='stop-color:rgb(0,%20178,%20194);stop-opacity:1'%20/%3e%3c/linearGradient%3e%3clinearGradient%20id='lgradface'%20x1='95%25'%20y1='0%25'%20x2='5%25'%20y2='100%25'%20%3e%3cstop%20offset='0%25'%20style='stop-color:rgb(0,%20201,%20181);stop-opacity:1'%20/%3e%3cstop%20offset='100%25'%20style='stop-color:rgb(0,%20178,%20194);stop-opacity:1'%20/%3e%3c!--%20%3cstop%20offset='100%25'%20style='stop-color:rgb(69,140,153);stop-opacity:1'%20/%3e%20--%3e%3c/linearGradient%3e%3cclipPath%20id='_clipPath_mFFOFRoZDPwZeoLGBAaPqqdgYpIvRWDO'%3e%3crect%20width='800'%20height='980'/%3e%3c/clipPath%3e%3c/defs%3e%3cg%20clip-path='url(%23_clipPath_mFFOFRoZDPwZeoLGBAaPqqdgYpIvRW80)'%3e%3cg%20style='isolation:isolate'%3e%3cpath%20d='%20M%20132.662%20368.503%20Q%2050.228%20344.358%2029.785%20358.215%20C%209.341%20372.072%209.296%20386.23%2012.638%20399.366%20C%2015.981%20412.502%2094.029%20498.64%20396.713%20495.385%20C%20699.398%20492.13%20785.47%20418.128%20787.646%20399.366%20C%20789.822%20380.604%20781.975%20367.728%20763.642%20358.215%20Q%20745.308%20348.702%20664.194%20368.503%20L%20664.194%20169.607%20Q%20641.217%2014.789%20396.713%2015.291%20Q%20152.21%2015.794%20132.662%20169.607%20L%20132.662%20368.503%20Z%20'%20fill='url(%23lgradhat)'/%3e%3cpath%20d='%20M%20677.911%20738.861%20C%20676.561%20798.182%20610.792%20968.417%20396.713%20965.19%20C%20182.634%20961.964%20122.726%20804.633%20122.374%20738.861%20Q%20122.022%20673.088%20122.395%20487.914%20C%20181.19%20506.207%20268.935%20520.763%20396.713%20519.389%20C%20527.329%20517.985%20617.608%20503.406%20677.924%20485.749%20Q%20679.261%20679.54%20677.911%20738.861%20Z%20'%20fill='url(%23lgradface)'/%3e%3ccircle%20vector-effect='non-scaling-stroke'%20cx='288.69210989427233'%20cy='678.8489030784123'%20r='36.006998616085795'%20fill='%231D2939'/%3e%3cpath%20d='%20M%20215.315%20603.094%20L%20215.474%20603.311%20L%20225.391%20616.899%20L%20219.059%20624.508%20Q%20214.186%20630.632%20203.191%20651.11%20L%20187.782%20648.778%20L%20187.605%20648.751%20C%20184.875%20657.939%20183.405%20667.52%20183.232%20677.103%20L%20183.232%20677.103%20L%20183.408%20677.13%20L%20198.806%20679.539%20Q%20203.025%20702.406%20205.913%20709.662%20L%20205.913%20709.662%20L%20209.654%20718.848%20L%20196.251%20728.738%20C%20194.871%20729.749%20210.421%20751.658%20213.148%20752.079%20L%20213.148%20752.079%20L%20226.727%20742.149%20L%20234.347%20748.483%20Q%20240.473%20753.358%20260.947%20764.362%20L%20258.606%20779.758%20L%20258.579%20779.935%20C%20267.725%20782.705%20277.386%20784.196%20286.942%20784.31%20L%20286.942%20784.31%20L%20286.969%20784.134%20L%20289.376%20768.747%20Q%20312.244%20764.517%20319.501%20761.63%20L%20319.501%20761.63%20L%20328.687%20757.888%20L%20338.574%20771.302%20C%20340.751%20771.638%20347.004%20766.615%20348.276%20765.756%20C%20348.276%20765.756%20361.905%20754.404%20361.905%20754.404%20L%20361.905%20754.404%20L%20351.988%20740.815%20L%20358.321%20733.195%20Q%20363.194%20727.073%20374.2%20706.595%20L%20389.597%20708.936%20L%20389.774%20708.964%20C%20392.542%20699.825%20394.041%20690.16%20394.147%20680.611%20L%20394.147%20680.611%20L%20393.971%20680.584%20L%20378.586%20678.166%20Q%20374.357%20655.302%20371.468%20648.041%20L%20371.468%20648.041%20L%20367.725%20638.866%20L%20381.13%20628.966%20L%20364.243%20605.637%20L%20364.243%20605.637%20L%20350.654%20615.555%20L%20343.032%20609.232%20Q%20337.021%20604.235%20316.432%20593.353%20L%20318.775%20577.945%20L%20318.801%20577.779%20C%20309.636%20575.004%20300.005%20573.554%20290.439%20573.393%20L%20290.439%20573.393%20L%20290.412%20573.57%20L%20288.003%20588.967%20Q%20265.139%20593.186%20257.88%20596.074%20L%20257.88%20596.074%20L%20248.703%20599.828%20L%20238.805%20586.412%20C%20237.231%20584.264%20217.224%20601.292%20215.315%20603.094%20L%20215.315%20603.094%20Z%20M%20304.876%20615.687%20C%20336.458%20623.61%20357.431%20654.983%20353.381%20687.157%20C%20348.861%20723.078%20314.458%20748.782%20278.758%20743.275%20C%20276.617%20742.944%20274.469%20742.561%20272.366%20742.034%20C%20248.097%20735.957%20229.126%20715.277%20224.553%20690.793%20C%20215.992%20644.963%20259.443%20604.183%20304.876%20615.687%20L%20304.876%20615.687%20Z%20'%20fill-rule='evenodd'%20fill='%231D2939'%3e%3canimateTransform%20attributeName='transform'%20attributeType='XML'%20type='rotate'%20from='0%20289%20679'%20to='360%20289%20679'%20dur='15s'%20repeatCount='indefinite'/%3e%3c/path%3e%3ccircle%20vector-effect='non-scaling-stroke'%20cx='525.3095293714078'%20cy='678.8489030784123'%20r='36.00699861608578'%20fill='%231D2939'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e", dw = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20style='isolation:isolate'%20viewBox='0%200%20800%20980'%20width='800pt'%20height='980pt'%3e%3cdefs%3e%3clinearGradient%20id='lgradhat'%20x1='95%25'%20y1='0%25'%20x2='5%25'%20y2='100%25'%20%3e%3cstop%20offset='30%25'%20style='stop-color:rgb(0,%20201,%20181);stop-opacity:1'%20/%3e%3cstop%20offset='100%25'%20style='stop-color:rgb(0,%20178,%20194);stop-opacity:1'%20/%3e%3c/linearGradient%3e%3clinearGradient%20id='lgradface'%20x1='95%25'%20y1='0%25'%20x2='5%25'%20y2='100%25'%20%3e%3cstop%20offset='0%25'%20style='stop-color:rgb(0,%20201,%20181);stop-opacity:1'%20/%3e%3cstop%20offset='100%25'%20style='stop-color:rgb(0,%20178,%20194);stop-opacity:1'%20/%3e%3c!--%20%3cstop%20offset='100%25'%20style='stop-color:rgb(69,140,153);stop-opacity:1'%20/%3e%20--%3e%3c/linearGradient%3e%3cclipPath%20id='_clipPath_mFFOFRoZDPwZeoLGBAaPqqdgYpIvRWDO'%3e%3crect%20width='800'%20height='980'/%3e%3c/clipPath%3e%3c/defs%3e%3cg%20clip-path='url(%23_clipPath_mFFOFRoZDPwZeoLGBAaPqqdgYpIvRW80)'%3e%3cg%20style='isolation:isolate'%3e%3cpath%20d='%20M%20132.662%20368.503%20Q%2050.228%20344.358%2029.785%20358.215%20C%209.341%20372.072%209.296%20386.23%2012.638%20399.366%20C%2015.981%20412.502%2094.029%20498.64%20396.713%20495.385%20C%20699.398%20492.13%20785.47%20418.128%20787.646%20399.366%20C%20789.822%20380.604%20781.975%20367.728%20763.642%20358.215%20Q%20745.308%20348.702%20664.194%20368.503%20L%20664.194%20169.607%20Q%20641.217%2014.789%20396.713%2015.291%20Q%20152.21%2015.794%20132.662%20169.607%20L%20132.662%20368.503%20Z%20'%20fill='url(%23lgradhat)'/%3e%3cpath%20d='%20M%20677.911%20738.861%20C%20676.561%20798.182%20610.792%20968.417%20396.713%20965.19%20C%20182.634%20961.964%20122.726%20804.633%20122.374%20738.861%20Q%20122.022%20673.088%20122.395%20487.914%20C%20181.19%20506.207%20268.935%20520.763%20396.713%20519.389%20C%20527.329%20517.985%20617.608%20503.406%20677.924%20485.749%20Q%20679.261%20679.54%20677.911%20738.861%20Z%20'%20fill='url(%23lgradface)'/%3e%3ccircle%20vector-effect='non-scaling-stroke'%20cx='288.69210989427233'%20cy='678.8489030784123'%20r='36.006998616085795'%20fill='%23ffffff'/%3e%3cpath%20d='%20M%20215.315%20603.094%20L%20215.474%20603.311%20L%20225.391%20616.899%20L%20219.059%20624.508%20Q%20214.186%20630.632%20203.191%20651.11%20L%20187.782%20648.778%20L%20187.605%20648.751%20C%20184.875%20657.939%20183.405%20667.52%20183.232%20677.103%20L%20183.232%20677.103%20L%20183.408%20677.13%20L%20198.806%20679.539%20Q%20203.025%20702.406%20205.913%20709.662%20L%20205.913%20709.662%20L%20209.654%20718.848%20L%20196.251%20728.738%20C%20194.871%20729.749%20210.421%20751.658%20213.148%20752.079%20L%20213.148%20752.079%20L%20226.727%20742.149%20L%20234.347%20748.483%20Q%20240.473%20753.358%20260.947%20764.362%20L%20258.606%20779.758%20L%20258.579%20779.935%20C%20267.725%20782.705%20277.386%20784.196%20286.942%20784.31%20L%20286.942%20784.31%20L%20286.969%20784.134%20L%20289.376%20768.747%20Q%20312.244%20764.517%20319.501%20761.63%20L%20319.501%20761.63%20L%20328.687%20757.888%20L%20338.574%20771.302%20C%20340.751%20771.638%20347.004%20766.615%20348.276%20765.756%20C%20348.276%20765.756%20361.905%20754.404%20361.905%20754.404%20L%20361.905%20754.404%20L%20351.988%20740.815%20L%20358.321%20733.195%20Q%20363.194%20727.073%20374.2%20706.595%20L%20389.597%20708.936%20L%20389.774%20708.964%20C%20392.542%20699.825%20394.041%20690.16%20394.147%20680.611%20L%20394.147%20680.611%20L%20393.971%20680.584%20L%20378.586%20678.166%20Q%20374.357%20655.302%20371.468%20648.041%20L%20371.468%20648.041%20L%20367.725%20638.866%20L%20381.13%20628.966%20L%20364.243%20605.637%20L%20364.243%20605.637%20L%20350.654%20615.555%20L%20343.032%20609.232%20Q%20337.021%20604.235%20316.432%20593.353%20L%20318.775%20577.945%20L%20318.801%20577.779%20C%20309.636%20575.004%20300.005%20573.554%20290.439%20573.393%20L%20290.439%20573.393%20L%20290.412%20573.57%20L%20288.003%20588.967%20Q%20265.139%20593.186%20257.88%20596.074%20L%20257.88%20596.074%20L%20248.703%20599.828%20L%20238.805%20586.412%20C%20237.231%20584.264%20217.224%20601.292%20215.315%20603.094%20L%20215.315%20603.094%20Z%20M%20304.876%20615.687%20C%20336.458%20623.61%20357.431%20654.983%20353.381%20687.157%20C%20348.861%20723.078%20314.458%20748.782%20278.758%20743.275%20C%20276.617%20742.944%20274.469%20742.561%20272.366%20742.034%20C%20248.097%20735.957%20229.126%20715.277%20224.553%20690.793%20C%20215.992%20644.963%20259.443%20604.183%20304.876%20615.687%20L%20304.876%20615.687%20Z%20'%20fill-rule='evenodd'%20fill='%23ffffff'%3e%3canimateTransform%20attributeName='transform'%20attributeType='XML'%20type='rotate'%20from='0%20289%20679'%20to='360%20289%20679'%20dur='15s'%20repeatCount='indefinite'/%3e%3c/path%3e%3ccircle%20vector-effect='non-scaling-stroke'%20cx='525.3095293714078'%20cy='678.8489030784123'%20r='36.00699861608578'%20fill='%23ffffff'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
var fw = /* @__PURE__ */ W('<img alt="" class="h-[70%] w-[70%] dark:hidden"/> <img alt="" class="hidden h-[70%] w-[70%] dark:block"/>', 1), pw = /* @__PURE__ */ ue('<svg viewBox="0 0 16 16" class="h-[62%] w-[62%] text-fg-muted" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="4" cy="4" r="1.75"></circle><circle cx="4" cy="12" r="1.75"></circle><circle cx="12" cy="8" r="1.75"></circle><path d="M4 5.75v4.5M5.6 4.6 10.4 7.3M5.6 11.4l4.8-2.7"></path></svg>'), vw = /* @__PURE__ */ W('<img alt="" class="h-full w-full object-cover" loading="lazy"/>'), hw = /* @__PURE__ */ W('<span class="avatar-initial svelte-xyfbs4" aria-hidden="true"> </span>'), mw = /* @__PURE__ */ W('<span role="img"><!></span>');
function vi(e, t) {
  Se(t, !0);
  let n = q(t, "src", 3, null), a = q(t, "kind", 3, "person"), s = q(t, "size", 3, 16), r = q(t, "class", 3, "");
  const i = /* @__PURE__ */ V(() => a() === "person" && !n()), o = /* @__PURE__ */ V(() => s() <= 16 ? (t.name.trim()[0] ?? "?").toUpperCase() : br(t.name)), l = /* @__PURE__ */ V(() => a() === "controller" ? "kuberik (automatic)" : a() === "ci" ? `${t.name} (CI)` : t.name), c = /* @__PURE__ */ V(() => s() <= 16 ? 10 : 11);
  var u = mw(), f = N(u);
  {
    var p = (y) => {
      var b = fw(), g = ne(b), h = I(g, 2);
      P(() => {
        $(g, "src", dw), $(h, "src", uw);
      }), M(y, b);
    }, v = (y) => {
      var b = le(), g = ne(b);
      {
        var h = (m) => {
          var C = pw();
          M(m, C);
        }, x = (m) => {
          var C = le(), _ = ne(C);
          {
            var A = (S) => {
              var w = vw();
              P(() => $(w, "src", n())), M(S, w);
            }, E = (S) => {
              var w = hw(), L = N(w);
              P(() => {
                rt(w, `font-size:${d(c) ?? ""}px`), K(L, d(o));
              }), M(S, w);
            };
            O(
              _,
              (S) => {
                n() ? S(A) : S(E, !1);
              },
              !0
            );
          }
          M(m, C);
        };
        O(
          g,
          (m) => {
            a() === "ci" ? m(h) : m(x, !1);
          },
          !0
        );
      }
      M(y, b);
    };
    O(f, (y) => {
      a() === "controller" ? y(p) : y(v, !1);
    });
  }
  P(() => {
    ie(u, 1, `avatar inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${d(i) ? "avatar-fallback" : "bg-subtle"} ${r() ?? ""}`, "svelte-xyfbs4"), rt(u, `width:${s() ?? ""}px;height:${s() ?? ""}px`), $(u, "aria-label", d(l)), $(u, "title", d(l));
  }), M(e, u), Ce();
}
const gw = $f(/* @__PURE__ */ new Date(), (e) => {
  const t = setInterval(() => e(/* @__PURE__ */ new Date()), 100);
  return () => clearInterval(t);
});
var bw = /* @__PURE__ */ W('<span class="cd-x svelte-1g0hr3c"> </span>'), ww = /* @__PURE__ */ W("<span> </span>"), kw = /* @__PURE__ */ W('<span class="cd-x svelte-1g0hr3c"> </span>'), _w = /* @__PURE__ */ W("<!><!>", 1), yw = /* @__PURE__ */ W("<!> <!>", 1), xw = /* @__PURE__ */ W('<span class="cl-dot cl-dot--dashed svelte-1g0hr3c" aria-hidden="true"></span>'), Sw = /* @__PURE__ */ W('<span class="cl-dot cl-dot--live-ring svelte-1g0hr3c" aria-hidden="true"></span>'), Cw = /* @__PURE__ */ W('<span class="cl-dot bg-success-solid svelte-1g0hr3c" aria-hidden="true"></span>'), Aw = /* @__PURE__ */ W('<span class="cl-dot cl-dot--ring svelte-1g0hr3c" aria-hidden="true"></span>'), Tw = /* @__PURE__ */ W('<span class="cl-dot cl-dot--dashed svelte-1g0hr3c" aria-hidden="true"></span>'), Mw = /* @__PURE__ */ W('<span class="cl-dot bg-danger-solid svelte-1g0hr3c" aria-hidden="true"></span>'), Ew = /* @__PURE__ */ W('<span class="cl-dot bg-held-solid svelte-1g0hr3c" aria-hidden="true"></span>'), Lw = /* @__PURE__ */ W('<span aria-hidden="true"></span>');
function Nw(e, t) {
  Se(t, !0);
  const n = {
    failed: "failed",
    held: "held",
    deploying: "deploying",
    checking: "checking"
  };
  var a = le(), s = ne(a);
  {
    var r = (o) => {
      var l = le(), c = ne(l);
      fc(c, () => t.bead.href ? "a" : "span", !1, (u, f) => {
        Ye(
          u,
          () => ({
            class: `cd-bead cd-bead--${t.bead.emphasis || "plain"}`,
            href: t.bead.href,
            title: t.bead.title,
            "data-bead": t.bead.state,
            [Cn]: { "cd-bead--nomark": t.bead.state === "landed" }
          }),
          void 0,
          void 0,
          void 0,
          "svelte-1g0hr3c"
        );
        var p = yw(), v = ne(p);
        {
          var y = (m) => {
            ba(m, { state: "approval", tone: "held" });
          }, b = (m) => {
            var C = le(), _ = ne(C);
            {
              var A = (S) => {
                ba(S, { state: "approval", tone: "neutral" });
              }, E = (S) => {
                var w = le(), L = ne(w);
                {
                  var k = (T) => {
                    ba(T, {
                      get state() {
                        return n[t.bead.state];
                      }
                    });
                  };
                  O(
                    L,
                    (T) => {
                      t.bead.state !== "landed" && T(k);
                    },
                    !0
                  );
                }
                M(S, w);
              };
              O(
                _,
                (S) => {
                  t.bead.state === "approval" ? S(A) : S(E, !1);
                },
                !0
              );
            }
            M(m, C);
          };
          O(v, (m) => {
            t.bead.state === "approval-yours" ? m(y) : m(b, !1);
          });
        }
        var g = I(v, 2);
        {
          var h = (m) => {
            var C = bw(), _ = N(C);
            P(() => K(_, t.bead.count)), M(m, C);
          }, x = (m) => {
            var C = _w(), _ = ne(C);
            At(_, 16, () => t.bead.refs, (S) => S, (S, w) => {
              var L = ww(), k = N(L);
              P(() => K(k, w)), M(S, L);
            });
            var A = I(_);
            {
              var E = (S) => {
                var w = kw(), L = N(w);
                P(() => K(L, `+${t.bead.more ?? ""}`)), M(S, w);
              };
              O(A, (S) => {
                t.bead.more && S(E);
              });
            }
            M(m, C);
          };
          O(g, (m) => {
            t.bead.count !== null ? m(h) : m(x, !1);
          });
        }
        M(f, p);
      }), M(o, l);
    }, i = (o) => {
      var l = le(), c = ne(l);
      {
        var u = (p) => {
        }, f = (p) => {
          var v = le(), y = ne(v);
          {
            var b = (h) => {
              var x = xw();
              M(h, x);
            }, g = (h) => {
              var x = le(), m = ne(x);
              {
                var C = (A) => {
                  var E = le(), S = ne(E);
                  {
                    var w = (k) => {
                      var T = Sw();
                      M(k, T);
                    }, L = (k) => {
                      var T = Cw();
                      M(k, T);
                    };
                    O(S, (k) => {
                      t.step.liveCount < t.step.builtCount ? k(w) : k(L, !1);
                    });
                  }
                  M(A, E);
                }, _ = (A) => {
                  var E = le(), S = ne(E);
                  {
                    var w = (k) => {
                      var T = Aw();
                      M(k, T);
                    }, L = (k) => {
                      var T = le(), F = ne(T);
                      {
                        var z = (D) => {
                          var H = Tw();
                          M(D, H);
                        }, j = (D) => {
                          var H = le(), te = ne(H);
                          {
                            var ae = (G) => {
                              var X = Mw();
                              M(G, X);
                            }, se = (G) => {
                              var X = le(), re = ne(X);
                              {
                                var R = (Y) => {
                                  var J = Ew();
                                  M(Y, J);
                                }, U = (Y) => {
                                  const J = /* @__PURE__ */ V(() => t.step.state !== "baking" && t.step.state !== "retrying");
                                  var Q = Lw();
                                  P(() => ie(Q, 1, `cl-dot ${d(J) ? "bg-active-solid animate-pulse" : "bg-progress-solid"}`, "svelte-1g0hr3c")), M(Y, Q);
                                };
                                O(
                                  re,
                                  (Y) => {
                                    t.step.tone === "stuck" ? Y(R) : Y(U, !1);
                                  },
                                  !0
                                );
                              }
                              M(G, X);
                            };
                            O(
                              te,
                              (G) => {
                                t.step.tone === "failed" ? G(ae) : G(se, !1);
                              },
                              !0
                            );
                          }
                          M(D, H);
                        };
                        O(
                          F,
                          (D) => {
                            t.step.tone === "none" ? D(z) : D(j, !1);
                          },
                          !0
                        );
                      }
                      M(k, T);
                    };
                    O(
                      S,
                      (k) => {
                        t.step.tone === "queued" ? k(w) : k(L, !1);
                      },
                      !0
                    );
                  }
                  M(A, E);
                };
                O(
                  m,
                  (A) => {
                    t.step.tone === "live" ? A(C) : A(_, !1);
                  },
                  !0
                );
              }
              M(h, x);
            };
            O(
              y,
              (h) => {
                t.step.resolved ? h(b) : h(g, !1);
              },
              !0
            );
          }
          M(p, v);
        };
        O(
          c,
          (p) => {
            t.step ? p(f, !1) : p(u);
          },
          !0
        );
      }
      M(o, l);
    };
    O(s, (o) => {
      t.bead ? o(r) : o(i, !1);
    });
  }
  M(e, a), Ce();
}
var Rw = /* @__PURE__ */ W('<span class="env-mk svelte-15vz3qs"><!></span>'), Ow = /* @__PURE__ */ W("<span> </span>"), Dw = /* @__PURE__ */ W('<span class="env-region t-meta text-fg-subtle svelte-15vz3qs"> </span>'), Fw = /* @__PURE__ */ W('<span class="pointer-events-auto flex min-w-0 items-center gap-1 pl-1"></span>'), Iw = /* @__PURE__ */ W("<span> </span>"), Pw = /* @__PURE__ */ W("<!> <span> </span> <!> <!> <!>", 1), jw = /* @__PURE__ */ W('<b class="font-medium text-fg-muted"> </b>'), Ww = /* @__PURE__ */ W('<span class="env-hang t-meta text-fg-subtle svelte-15vz3qs"><!> </span>'), Bw = /* @__PURE__ */ W("<div><!> <!></div>"), zw = /* @__PURE__ */ W('<div data-env-row=""><div></div></div>');
function dl(e, t) {
  Se(t, !0);
  let n = q(t, "size", 3, "L"), a = q(t, "class", 3, "");
  var s = zw(), r = N(s);
  At(r, 21, () => t.cells, (i) => i.key, (i, o) => {
    var l = Bw();
    let c;
    var u = N(l);
    fc(u, () => d(o).href ? "a" : "div", !1, (v, y) => {
      Ye(
        v,
        () => ({
          href: d(o).href,
          class: "env-box environment-theme-scope",
          style: d(o).style,
          title: d(o).title,
          "data-env-box": !0,
          "data-current": d(o).current ? "" : void 0,
          [Cn]: {
            "env-box--current": d(o).current,
            "env-box--link": !!d(o).href
          }
        }),
        void 0,
        void 0,
        void 0,
        "svelte-15vz3qs"
      );
      var b = Pw(), g = ne(b);
      {
        var h = (k) => {
          var T = Rw(), F = N(T);
          {
            let z = /* @__PURE__ */ V(() => d(o).mark.progress ?? null);
            ba(F, {
              get state() {
                return d(o).mark.state;
              },
              get tone() {
                return d(o).mark.tone;
              },
              get progress() {
                return d(z);
              }
            });
          }
          M(k, T);
        };
        O(g, (k) => {
          d(o).mark && k(h);
        });
      }
      var x = I(g, 2), m = N(x), C = I(x, 2);
      {
        var _ = (k) => {
          var T = Ow(), F = N(T);
          P(() => {
            ie(T, 1, `env-word t-ui-sm ${d(o).wordInk ?? "text-fg-muted" ?? ""}`, "svelte-15vz3qs"), K(F, d(o).word);
          }), M(k, T);
        };
        O(C, (k) => {
          d(o).word && k(_);
        });
      }
      var A = I(C, 2);
      {
        var E = (k) => {
          var T = Dw(), F = N(T);
          P(() => K(F, d(o).region)), M(k, T);
        };
        O(A, (k) => {
          d(o).region && k(E);
        });
      }
      var S = I(A, 2);
      {
        var w = (k) => {
          var T = Fw();
          At(T, 21, () => d(o).beads, (F) => F.state + F.refs.join() + F.count, (F, z) => {
            Nw(F, {
              get bead() {
                return d(z);
              }
            });
          }), M(k, T);
        }, L = (k) => {
          var T = le(), F = ne(T);
          {
            var z = (j) => {
              var D = Iw(), H = N(D);
              P(() => {
                ie(D, 1, `env-fact ${d(o).factKind === "detail" ? "env-detail" : "env-lag"} t-meta tabular-nums text-fg-subtle`, "svelte-15vz3qs"), K(H, d(o).fact);
              }), M(j, D);
            };
            O(
              F,
              (j) => {
                d(o).fact && j(z);
              },
              !0
            );
          }
          M(k, T);
        };
        O(S, (k) => {
          d(o).beads?.length ? k(w) : k(L, !1);
        });
      }
      P(() => {
        ie(x, 1, `env-name t-ui-sm ${d(o).hot ? "text-fg" : "text-fg-muted"}`, "svelte-15vz3qs"), K(m, d(o).label);
      }), M(y, b);
    });
    var f = I(u, 2);
    {
      var p = (v) => {
        var y = Ww(), b = N(y);
        {
          var g = (x) => {
            var m = jw(), C = N(m);
            P(() => K(C, d(o).hang.lead)), M(x, m);
          };
          O(b, (x) => {
            d(o).hang.lead && x(g);
          });
        }
        var h = I(b, 1, !0);
        P(() => K(h, d(o).hang.text)), M(v, y);
      };
      O(f, (v) => {
        d(o).hang && v(p);
      });
    }
    P(() => {
      c = ie(l, 1, "env-cell svelte-15vz3qs", null, c, { "env-cell--hang": !!d(o).hang }), $(l, "data-tier", d(o).key);
    }), M(i, l);
  }), P(
    (i) => {
      ie(s, 1, `env-cq min-w-0 ${a() ?? ""}`, "svelte-15vz3qs"), $(s, "data-size", n()), ie(r, 1, `env-row env-row--${i ?? ""}`, "svelte-15vz3qs");
    },
    [() => n().toLowerCase()]
  ), M(e, s), Ce();
}
var Hw = /* @__PURE__ */ W('<a class="tap-link t-card-title block truncate text-fg hover:underline"> </a>'), Vw = /* @__PURE__ */ W('<span class="t-card-title block truncate text-fg"> </span>'), Uw = /* @__PURE__ */ W("<p> </p>"), qw = /* @__PURE__ */ W('<div class="lane-cq svelte-1t67zmg"><div class="lane svelte-1t67zmg"><div class="lane-head min-w-0"><!> <!></div> <!></div></div>');
function Gw(e, t) {
  Se(t, !0);
  const n = () => Xf(gw, "$now", a), [a, s] = Jf();
  let r = q(t, "appHref", 3, null), i = q(t, "current", 3, null), o = q(t, "youAreHere", 3, !1), l = q(t, "showApp", 3, !0), c = q(t, "quietLead", 3, !1), u = q(t, "fill", 3, void 0), f = q(t, "beads", 3, void 0), p = q(t, "words", 3, !1), v = q(t, "yours", 3, !1);
  const y = /* @__PURE__ */ V(() => u() ?? "L"), b = Bu(), g = /* @__PURE__ */ V(() => !u()), h = /* @__PURE__ */ V(() => t.tiers?.filter((R) => t.lane.byTier[R]?.length) ?? ["dev", "test", "staging", "other", "prod"].filter((R) => t.lane.byTier[R]?.length)), x = {
    failed: "text-danger",
    stuck: "text-warning",
    deploying: "text-active",
    checking: "text-progress",
    held: "text-held",
    behind: "text-fg-muted",
    newest: "text-fg-muted",
    none: "text-fg-subtle"
  }, m = (R) => !!i() && R.card.ns === i().ns && R.card.name === i().name;
  function C(R) {
    const U = R.env, Y = R.card.version ? yt(R.card.version) : "", J = R.card.timestamp ? _s(R.card.timestamp, n()) : "";
    switch (R.state) {
      case "failed":
        return R.card.checkFailure ? `Health check failing in ${U}` : `Deploy failed in ${U}`;
      case "stuck":
        return `Stuck in ${U}`;
      case "deploying":
        return `Deploying ${Y} to ${U}${J ? ` · ${J}` : ""}`;
      case "checking":
        return `Checking ${Y} in ${U}${J ? ` · ${J}` : ""}`;
      case "held":
        return R.card.heldCause === "person" ? `Waits for you in ${U}` : `Held in ${U}${R.card.heldCauseLabel ? ` · waits on ${R.card.heldCauseLabel}` : ""}`;
      case "behind": {
        const Q = [...t.lane.stages, ...t.lane.prod], ee = Q.filter((he) => he.state === "newest"), ce = Q.find((he) => he.state === "behind");
        if (ee.length === 0) return "Newest build not deployed yet";
        const de = ee[ee.length - 1], Z = de.card.version ? yt(de.card.version) : "Newest", pe = ce ? ce.tier === "prod" && t.lane.prod.length > 1 ? "prod" : ce.env : "";
        return `${Z} in ${de.env}${pe ? ` · ${pe} next` : ""}`;
      }
      case "newest":
        return "On the newest everywhere";
      default:
        return "Nothing deployed yet";
    }
  }
  const _ = {
    failed: "Failing",
    stuck: "Stuck",
    deploying: "Deploying",
    checking: "Checking",
    held: "Held",
    behind: "",
    newest: "",
    none: ""
  }, A = (R) => R.state === "held" && R.card.heldCause === "person" ? p() ? Nh(v()) : "Waiting" : _[R.state], E = /* @__PURE__ */ new Set(["failed", "stuck", "held", "deploying", "checking"]), S = (R) => E.has(R.state) ? { state: R.state } : void 0, w = /* @__PURE__ */ V(() => t.lane.prod.reduce((R, U) => !R || tt.indexOf(U.state) < tt.indexOf(R.state) ? U : R, null)), L = {
    failed: "failing",
    stuck: "stuck",
    deploying: "deploying",
    checking: "checking",
    held: "held",
    behind: "",
    newest: "",
    none: ""
  }, k = (R) => {
    const U = [...new Set(R.map((J) => J.card.wave ?? 1))], Y = (J) => `${J.env}${J.card.role === "Leader" && R.filter((Q) => (Q.card.wave ?? 1) === (J.card.wave ?? 1)).length > 1 ? " (leader)" : ""}: ${A(J) || "Healthy"}${J.card.version ? ` · ${yt(J.card.version)}` : ""}`;
    return U.length < 2 ? R.map(Y).join(`
`) : U.map((J) => `wave ${J}
` + R.filter((Q) => (Q.card.wave ?? 1) === J).map((Q) => "  " + Y(Q)).join(`
`)).join(`
`);
  }, T = (R, U) => new Set(R.map((Y) => Y.card.wave ?? 1)).size > 1 ? ` · wave ${U.card.wave ?? 1}` : "";
  function F(R, U) {
    return am(R.map((Y) => Y.env), L[U.state] ? R.filter((Y) => Y.state === U.state) : null);
  }
  function z(R, U) {
    return L[U.state] && R.filter((Y) => Y.state === U.state).length === 1 ? U.env : "";
  }
  const j = /* @__PURE__ */ V(() => !t.lane.lead || c() || t.lane.lead.state === "behind" || t.lane.lead.state === "newest" ? "text-fg-subtle" : x[t.lane.lead.state]);
  function D(R, U) {
    const Y = R && b.progress ? b.progress.get(`${U.card.ns}/${U.card.name}`) : null;
    return R && Y ? { ...R, progress: Y.fraction } : R;
  }
  function H(R) {
    return {
      key: R.tier === "prod" ? "prod" : R.env,
      label: R.env,
      href: d(g) ? t.hrefFor(R) : void 0,
      current: o() && m(R),
      title: `${R.card.envDisplay || R.env}: ${R.card.version ?? "no build"}${R.behind > 0 ? ` · ${To({ builds: R.behind })} the newest` : ""}`,
      style: R.card.theme ? pa(R.card.theme) : void 0,
      mark: D(S(R), R),
      word: A(R) || void 0,
      wordInk: x[R.state],
      hot: E.has(R.state),
      fact: R.behind > 0 ? d(y) === "M" ? `${R.behind} behind` : To({ builds: R.behind }) : void 0,
      factKind: "lag",
      beads: f()?.(R)
    };
  }
  function te(R, U) {
    const Y = R.find(m), J = Y ?? U, Q = Y ? `${yc(Y.env).place ?? Y.env}${T(R, Y)}` : z(R, U) ? `${z(R, U)}${T(R, U)}` : void 0;
    return {
      ...H(J),
      key: "prod",
      label: "prod",
      current: o() && !!Y,
      title: k(R),
      style: R[0].card.theme ? pa(R[0].card.theme) : void 0,
      region: Q,
      fact: F(R, J),
      factKind: "detail"
    };
  }
  const ae = /* @__PURE__ */ V(() => d(h).map((R) => {
    const U = t.lane.byTier[R] ?? [];
    return R === "prod" && U.length > 1 && d(w) && Ua(U.map((Y) => Y.env)) > 1 ? te(U, d(w)) : H(R === "prod" ? U.reduce((Y, J) => tt.indexOf(J.state) < tt.indexOf(Y.state) ? J : Y, U[0]) : U[0]);
  }));
  var se = le(), G = ne(se);
  {
    var X = (R) => {
      var U = qw(), Y = N(U), J = N(Y), Q = N(J);
      {
        var ee = (he) => {
          var ve = Hw(), Le = N(ve);
          P(() => {
            $(ve, "href", r()), K(Le, t.lane.app);
          }), M(he, ve);
        }, ce = (he) => {
          var ve = Vw(), Le = N(ve);
          P(() => K(Le, t.lane.app)), M(he, ve);
        };
        O(Q, (he) => {
          r() ? he(ee) : he(ce, !1);
        });
      }
      var de = I(Q, 2);
      {
        var Z = (he) => {
          var ve = Uw(), Le = N(ve);
          P(
            (He) => {
              ie(ve, 1, `t-meta truncate ${d(j) ?? ""}`, "svelte-1t67zmg"), K(Le, He);
            },
            [() => C(t.lane.lead)]
          ), M(he, ve);
        };
        O(de, (he) => {
          t.lane.lead && he(Z);
        });
      }
      var pe = I(J, 2);
      dl(pe, {
        get cells() {
          return d(ae);
        },
        get size() {
          return d(y);
        }
      }), M(R, U);
    }, re = (R) => {
      dl(R, {
        get cells() {
          return d(ae);
        },
        get size() {
          return d(y);
        }
      });
    };
    O(G, (R) => {
      l() ? R(X) : R(re, !1);
    });
  }
  M(e, se), Ce(), s();
}
var Kw = /* @__PURE__ */ W('<span class="text-fg-muted"> </span>'), Yw = /* @__PURE__ */ W("<div><!> <span><span> </span> <!></span></div>");
function $w(e, t) {
  Se(t, !0);
  let n = q(t, "compact", 3, !1), a = q(t, "ink", 3, !1);
  var s = Yw(), r = N(s);
  za(r, {
    class: "check-glyph h-3 w-3 shrink-0 translate-y-0.5",
    "aria-hidden": "true"
  });
  var i = I(r, 2), o = N(i), l = N(o), c = I(o, 2);
  {
    var u = (f) => {
      var p = Kw(), v = N(p);
      P(() => K(v, t.check.message)), M(f, p);
    };
    O(c, (f) => {
      t.check.message && f(u);
    });
  }
  P(() => {
    ie(s, 1, `t-meta flex items-start gap-1.5 ${n() ? "" : "check-line"} ${t.danger ? "text-danger" : "text-fg-muted"}`, "svelte-q4u0pa"), ie(i, 1, qs(n() ? "line-clamp-2" : "")), ie(o, 1, qs(a() ? "text-fg" : t.danger ? "text-danger" : "text-fg-muted")), K(l, `${t.check.name ?? ""}${t.check.message ? ":" : ""}`);
  }), M(e, s), Ce();
}
var Qw = /* @__PURE__ */ W('<span aria-hidden="true" class="absolute left-[27px] top-0 h-[10px] w-0.5 bg-line-strong"></span>'), Zw = /* @__PURE__ */ W('<span aria-hidden="true" class="absolute bottom-0 left-[27px] top-[34px] w-0.5 bg-line-strong"></span>'), Xw = /* @__PURE__ */ W('<span aria-hidden="true"></span>'), Jw = /* @__PURE__ */ W('<span aria-hidden="true"></span>'), ek = /* @__PURE__ */ W("<span> </span>"), tk = /* @__PURE__ */ W('<li class="relative"><!> <!> <div><!> <span data-node=""><!></span> <span> </span> <!> <span class="sr-only"> </span></div></li>'), nk = /* @__PURE__ */ W('<ol data-pipeline="list" aria-label="Pipeline steps"></ol>');
function fl(e, t) {
  Se(t, !0);
  let n = q(t, "selected", 3, null), a = q(t, "layout", 3, "list");
  q(t, "node", 3, "md");
  let s = q(t, "checkWord", 3, "Checking"), r = q(t, "noActiveChip", 3, !1), i = q(t, "noHoldChip", 3, !1), o = q(t, "dup", 3, !1), l = q(t, "class", 3, "");
  const c = {
    done: "done",
    active: "running",
    fail: "failed",
    todo: "not started",
    hold: "waiting"
  }, u = (C) => ju(C, s() === "Deploying" ? "deploying" : "checking") === "checking", f = (C) => C.state === "active" && r() ? "" : C.state === "active" ? C.name === "Check" ? s() : "In progress" : C.state === "todo" ? "Pending" : C.state === "hold" ? i() ? "" : "Waiting" : "", p = (C) => C.state === "fail" ? "bg-danger-solid" : C.state === "done" ? "bg-success-solid" : u(C) ? "bg-progress-solid" : "bg-active-solid", v = (C) => u(C) ? "border-progress-solid/40 border-t-progress-solid" : "border-active-solid/40 border-t-active-solid", y = (C) => C.state === "done" ? "bg-success-tint text-success" : C.state === "fail" ? "bg-danger-tint text-danger" : u(C) ? "bg-progress-tint text-progress" : C.state === "active" ? "bg-active-tint text-active" : "bg-subtle text-fg-disabled", b = (C) => u(C) ? "border-progress-line text-progress" : C.state === "active" ? "border-active-line text-active" : "border-line text-fg-subtle";
  var g = le(), h = ne(g);
  {
    var x = (C) => {
      {
        let _ = /* @__PURE__ */ V(() => $i(t.steps, s() === "Deploying" ? "deploying" : "checking", !0)), A = /* @__PURE__ */ V(() => o() ? "strand-dup" : "strand");
        Wu(C, {
          get nodes() {
            return d(_);
          },
          size: "sm",
          get decorative() {
            return o();
          },
          get kind() {
            return d(A);
          },
          label: "Pipeline steps",
          get class() {
            return l();
          }
        });
      }
    }, m = (C) => {
      var _ = nk();
      At(_, 21, () => t.steps, xi, (A, E, S) => {
        const w = /* @__PURE__ */ V(() => n() === d(E).name);
        var L = tk(), k = N(L);
        {
          var T = (Q) => {
            var ee = Qw();
            M(Q, ee);
          };
          O(k, (Q) => {
            S > 0 && Q(T);
          });
        }
        var F = I(k, 2);
        {
          var z = (Q) => {
            var ee = Zw();
            M(Q, ee);
          };
          O(F, (Q) => {
            S < t.steps.length - 1 && Q(z);
          });
        }
        var j = I(F, 2), D = N(j);
        {
          var H = (Q) => {
            var ee = Xw();
            P((ce) => ie(ee, 1, `absolute inset-y-0 left-0 w-0.5 ${ce ?? ""}`), [() => p(d(E))]), M(Q, ee);
          };
          O(D, (Q) => {
            d(w) && Q(H);
          });
        }
        var te = I(D, 2), ae = N(te);
        {
          var se = (Q) => {
            ur(Q, { class: "h-4 w-4", "aria-hidden": "true" });
          }, G = (Q) => {
            var ee = le(), ce = ne(ee);
            {
              var de = (pe) => {
                za(pe, { class: "h-4 w-4", "aria-hidden": "true" });
              }, Z = (pe) => {
                var he = le(), ve = ne(he);
                {
                  var Le = (_e) => {
                    var $e = Jw();
                    P((Be) => ie($e, 1, `h-4 w-4 animate-spin rounded-full border-2 ${Be ?? ""}`), [() => v(d(E))]), M(_e, $e);
                  }, He = (_e) => {
                    kc(_e, { class: "h-4 w-4", "aria-hidden": "true" });
                  };
                  O(
                    ve,
                    (_e) => {
                      d(E).state === "active" ? _e(Le) : _e(He, !1);
                    },
                    !0
                  );
                }
                M(pe, he);
              };
              O(
                ce,
                (pe) => {
                  d(E).state === "fail" ? pe(de) : pe(Z, !1);
                },
                !0
              );
            }
            M(Q, ee);
          };
          O(ae, (Q) => {
            d(E).state === "done" ? Q(se) : Q(G, !1);
          });
        }
        var X = I(te, 2), re = N(X), R = I(X, 2);
        {
          var U = (Q) => {
            var ee = ek(), ce = N(ee);
            P(
              (de, Z) => {
                ie(ee, 1, `chip t-label chip-wide shrink-0 ${de ?? ""}`), K(ce, Z);
              },
              [() => b(d(E)), () => f(d(E))]
            ), M(Q, ee);
          };
          O(R, (Q) => {
            f(d(E)) && Q(U);
          });
        }
        var Y = I(R, 2), J = N(Y);
        P(
          (Q) => {
            $(L, "data-step", d(E).name), $(L, "data-state", d(E).state), $(L, "aria-current", d(w) ? "step" : void 0), ie(j, 1, `relative flex h-11 items-center gap-3 pl-4 pr-3 ${d(w) ? "bg-selected" : ""}`), ie(te, 1, `relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${Q ?? ""}`), ie(X, 1, `min-w-0 flex-1 truncate ${d(E).state === "fail" ? "t-card-title text-danger" : d(w) ? "t-card-title text-fg" : "t-body text-fg-muted"}`), K(re, d(E).name), K(J, c[d(E).state]);
          },
          [() => y(d(E))]
        ), M(A, L);
      }), P(() => ie(_, 1, `min-w-0 py-2 ${l() ?? ""}`)), M(C, _);
    };
    O(h, (C) => {
      a() === "strand" ? C(x) : C(m, !1);
    });
  }
  M(e, g), Ce();
}
var ak = /* @__PURE__ */ W('<span aria-hidden="true"></span>'), sk = /* @__PURE__ */ W('<span data-pc-rollup=""> </span>'), rk = /* @__PURE__ */ W('<nav class="pc-rail svelte-tixt72"><!></nav>'), ik = /* @__PURE__ */ W('<div class="pc-foot min-w-0"><!></div>'), ok = /* @__PURE__ */ W('<section><header class="pc-head flex min-h-[47px] items-center gap-2 border-b border-line px-4 py-3 svelte-tixt72"><!> <h3 class="t-card-title min-w-0 flex-1 text-fg"> </h3> <!></header> <div><!> <div class="pc-pane min-w-0 svelte-tixt72"><!></div> <!></div></section>');
function lk(e, t) {
  let n = q(t, "state", 3, "idle"), a = q(t, "title", 3, "Deployment pipeline"), s = q(t, "rollup", 3, null), r = q(t, "rollupAdverse", 3, !1), i = q(t, "shell", 3, "card"), o = q(t, "at", 3, 560), l = q(t, "railWidth", 3, "300px"), c = q(t, "class", 3, ""), u = q(t, "bodyClass", 3, ""), f = q(t, "railLabel", 3, "Pipeline steps"), p = q(t, "mute", 3, !1), v = /* @__PURE__ */ ht(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "state",
    "title",
    "rollup",
    "rollupAdverse",
    "shell",
    "at",
    "railWidth",
    "label",
    "rail",
    "foot",
    "children",
    "class",
    "bodyClass",
    "railLabel",
    "mute"
  ]);
  var y = ok();
  Ye(
    y,
    () => ({
      class: `pc pc-${i() ?? ""} pc-at${o() ?? ""} ${t.children && t.rail ? "" : "pc-solo"} ${p() ? "pc-mute" : ""} ${c() ?? ""}`,
      "aria-label": t.label ?? a(),
      "data-pipeline-card": !0,
      "data-pc-state": n(),
      ...v,
      [ua]: { "--pc-rail": l() }
    }),
    void 0,
    void 0,
    void 0,
    "svelte-tixt72"
  );
  var b = N(y), g = N(b);
  {
    var h = (j) => {
      gp(j, {
        class: "h-4 w-4 shrink-0 text-fg-subtle",
        "aria-hidden": "true"
      });
    }, x = (j) => {
      var D = le(), H = ne(D);
      {
        var te = (se) => {
          za(se, { class: "h-4 w-4 shrink-0 text-danger", "aria-hidden": "true" });
        }, ae = (se) => {
          var G = le(), X = ne(G);
          {
            var re = (U) => {
              var Y = ak();
              P(() => ie(Y, 1, `h-4 w-4 shrink-0 animate-spin rounded-full border-2 ${n() === "checking" ? "border-progress-solid/40 border-t-progress-solid" : "border-active-solid/40 border-t-active-solid"}`)), M(U, Y);
            }, R = (U) => {
              var Y = le(), J = ne(Y);
              {
                var Q = (ce) => {
                  ur(ce, {
                    class: "h-4 w-4 shrink-0 text-success",
                    "aria-hidden": "true"
                  });
                }, ee = (ce) => {
                  var de = le(), Z = ne(de);
                  {
                    var pe = (ve) => {
                      ba(ve, { state: "held" });
                    }, he = (ve) => {
                      Bp(ve, {
                        class: "h-4 w-4 shrink-0 text-fg-subtle",
                        "aria-hidden": "true"
                      });
                    };
                    O(
                      Z,
                      (ve) => {
                        n() === "held" ? ve(pe) : ve(he, !1);
                      },
                      !0
                    );
                  }
                  M(ce, de);
                };
                O(
                  J,
                  (ce) => {
                    n() === "done" ? ce(Q) : ce(ee, !1);
                  },
                  !0
                );
              }
              M(U, Y);
            };
            O(
              X,
              (U) => {
                n() === "deploying" || n() === "checking" ? U(re) : U(R, !1);
              },
              !0
            );
          }
          M(se, G);
        };
        O(
          H,
          (se) => {
            n() === "failed" ? se(te) : se(ae, !1);
          },
          !0
        );
      }
      M(j, D);
    };
    O(g, (j) => {
      p() ? j(h) : j(x, !1);
    });
  }
  var m = I(g, 2), C = N(m), _ = I(m, 2);
  {
    var A = (j) => {
      var D = sk(), H = N(D);
      P(() => {
        ie(D, 1, `t-ui-sm shrink-0 whitespace-nowrap tabular-nums ${r() ? "text-fg" : "text-fg-subtle"}`), K(H, s());
      }), M(j, D);
    };
    O(_, (j) => {
      s() && j(A);
    });
  }
  var E = I(b, 2), S = N(E);
  {
    var w = (j) => {
      var D = rk(), H = N(D);
      Un(H, () => t.rail), P(() => $(D, "aria-label", f())), M(j, D);
    };
    O(S, (j) => {
      t.rail && j(w);
    });
  }
  var L = I(S, 2), k = N(L);
  {
    var T = (j) => {
      var D = le(), H = ne(D);
      Un(H, () => t.children), M(j, D);
    };
    O(k, (j) => {
      t.children && j(T);
    });
  }
  var F = I(L, 2);
  {
    var z = (j) => {
      var D = ik(), H = N(D);
      Un(H, () => t.foot), M(j, D);
    };
    O(F, (j) => {
      t.foot && j(z);
    });
  }
  P(() => {
    K(C, a()), ie(E, 1, `pc-body ${u() ?? ""}`, "svelte-tixt72");
  }), M(e, y);
}
const pl = (e, t = ft, n = ft) => {
  var a = uk(), s = ne(a);
  {
    var r = (p) => {
      const v = /* @__PURE__ */ V(() => t().icon);
      var y = le(), b = ne(y);
      {
        let g = /* @__PURE__ */ V(() => t().iconClass ?? "h-4 w-4");
        Zr(b, () => d(v), (h, x) => {
          x(h, {
            get class() {
              return d(g);
            },
            "aria-hidden": "true"
          });
        });
      }
      M(p, y);
    };
    O(s, (p) => {
      t().icon && !t().iconAfter && p(r);
    });
  }
  var i = I(s), o = N(i), l = I(i);
  {
    var c = (p) => {
      const v = /* @__PURE__ */ V(() => t().icon);
      var y = le(), b = ne(y);
      {
        let g = /* @__PURE__ */ V(() => t().iconClass ?? "h-4 w-4"), h = /* @__PURE__ */ V(() => t().iconTurn ? "rotate-180" : "");
        Zr(b, () => d(v), (x, m) => {
          m(x, {
            get class() {
              return `${d(g) ?? ""} transition-transform ${d(h) ?? ""}`;
            },
            "aria-hidden": "true"
          });
        });
      }
      M(p, y);
    };
    O(l, (p) => {
      t().icon && t().iconAfter && p(c);
    });
  }
  var u = I(l);
  {
    var f = (p) => {
      var v = ck(), y = N(v);
      P(() => K(y, t().external ? "↗" : "›")), M(p, v);
    };
    O(u, (p) => {
      t().href && !t().icon && p(f);
    });
  }
  P(() => K(o, t().label)), M(e, a);
};
var ck = /* @__PURE__ */ W('<span aria-hidden="true" class="shrink-0"> </span>'), uk = /* @__PURE__ */ W("<!><span> </span><!><!>", 1), dk = /* @__PURE__ */ W("<a><!></a>"), fk = /* @__PURE__ */ W("<button><!></button>"), pk = /* @__PURE__ */ W('<a role="menuitem" class="t-ui flex min-h-11 items-center gap-2 rounded px-3 hover:bg-hover"> <span aria-hidden="true"> </span></a>'), vk = /* @__PURE__ */ W('<button role="menuitem" type="button" class="t-ui flex min-h-11 items-center gap-2 rounded px-3 text-left hover:bg-hover disabled:opacity-50"> </button>'), hk = /* @__PURE__ */ W('<div role="menu" class="absolute right-0 top-full z-30 mt-1 flex min-w-40 flex-col rounded-md border border-line bg-surface p-1 text-fg shadow-lg"></div>'), mk = /* @__PURE__ */ W('<div class="ar-more relative shrink-0 svelte-1avu033"><button type="button" class="btn btn-secondary btn-sm relative z-[1] min-h-11 min-w-11 !px-0" aria-label="More actions" aria-haspopup="menu" data-action="more"><svg viewBox="0 0 16 16" class="h-4 w-4" fill="currentColor" aria-hidden="true"><circle cx="3" cy="8" r="1.4"></circle><circle cx="8" cy="8" r="1.4"></circle><circle cx="13" cy="8" r="1.4"></circle></svg></button> <!></div>'), gk = /* @__PURE__ */ W('<div data-act-row=""><!> <!></div>');
function bk(e, t) {
  Se(t, !0);
  let n = q(t, "secondary", 19, () => []), a = q(t, "fill", 3, !0), s = q(t, "phoneMax", 3, 2), r = q(t, "align", 3, "start");
  const i = /* @__PURE__ */ V(() => {
    const h = n().filter((w) => !w.after && !w.quiet), x = n().filter((w) => w.after || w.quiet), m = [
      ...h.map((w) => ({ act: w, variant: "secondary" })),
      ...t.primary ? [{ act: t.primary, variant: "primary" }] : [],
      ...x.map((w) => ({ act: w, variant: w.quiet ? "quiet" : "secondary" }))
    ], C = (w) => !w.act.desktopOnly, _ = m.findIndex((w) => w.act.lead), A = m.findIndex(C), E = t.primary ? m.findIndex((w) => w.act === t.primary) : _ >= 0 ? _ : A, S = s() >= 2 ? m.findIndex((w, L) => L !== E && C(w)) : -1;
    return m.map((w, L) => ({
      ...w,
      phone: C(w) ? L === E ? "lead" : L === S ? "side" : "menu" : "none"
    }));
  }), o = /* @__PURE__ */ V(() => d(i).filter((h) => h.phone === "menu"));
  let l = /* @__PURE__ */ Ee(!1), c = /* @__PURE__ */ Ee(void 0);
  function u(h) {
    d(l) && d(c) && !d(c).contains(h.target) && me(l, !1);
  }
  function f(h) {
    me(l, !1), h.onclick?.();
  }
  var p = gk();
  $r("click", ns, u), $r("keydown", ns, (h) => h.key === "Escape" && me(l, !1));
  let v;
  var y = N(p);
  At(y, 17, () => d(i), ({ act: h, variant: x, phone: m }) => h.key ?? h.label, (h, x) => {
    let m = () => d(x).act, C = () => d(x).variant, _ = () => d(x).phone;
    const A = /* @__PURE__ */ V(() => `ar-item ar-${_()} ${m().phoneOnly ? "ar-phoneonly" : ""} ${m().desktopOnly ? "ar-desktoponly" : ""} relative z-[1] shrink-0 gap-1.5 ${C() === "quiet" ? "nav-link inline-flex h-8 min-h-0 items-center" : C() === "primary" ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}`);
    var E = le(), S = ne(E);
    {
      var w = (k) => {
        var T = dk();
        Ye(
          T,
          () => ({
            href: m().href,
            class: d(A),
            id: m().id,
            "data-action": m().key,
            ...m().data,
            title: m().title,
            "aria-label": m().ariaLabel,
            target: m().external ? "_blank" : void 0,
            rel: m().external ? "noopener noreferrer" : void 0
          }),
          void 0,
          void 0,
          void 0,
          "svelte-1avu033"
        );
        var F = N(T);
        pl(F, m, C), M(k, T);
      }, L = (k) => {
        var T = fk();
        Ye(
          T,
          () => ({
            type: "button",
            class: d(A),
            id: m().id,
            "data-action": m().key,
            ...m().data,
            title: m().title,
            "aria-label": m().ariaLabel,
            disabled: m().busy || m().disabled,
            onclick: m().onclick
          }),
          void 0,
          void 0,
          void 0,
          "svelte-1avu033"
        );
        var F = N(T);
        pl(F, m, C), M(k, T);
      };
      O(S, (k) => {
        m().href ? k(w) : k(L, !1);
      });
    }
    M(h, E);
  });
  var b = I(y, 2);
  {
    var g = (h) => {
      var x = mk(), m = N(x);
      m.__click = () => me(l, !d(l));
      var C = I(m, 2);
      {
        var _ = (A) => {
          var E = hk();
          At(E, 21, () => d(o), ({ act: S }) => S.key ?? S.label, (S, w) => {
            let L = () => d(w).act;
            var k = le(), T = ne(k);
            {
              var F = (j) => {
                var D = pk();
                D.__click = () => me(l, !1);
                var H = N(D), te = I(H), ae = N(te);
                P(() => {
                  $(D, "href", L().href), K(H, L().label), K(ae, L().external ? "↗" : "›");
                }), M(j, D);
              }, z = (j) => {
                var D = vk();
                D.__click = () => f(L());
                var H = N(D);
                P(() => {
                  D.disabled = L().busy || L().disabled, K(H, L().label);
                }), M(j, D);
              };
              O(T, (j) => {
                L().href ? j(F) : j(z, !1);
              });
            }
            M(S, k);
          }), M(A, E);
        };
        O(C, (A) => {
          d(l) && A(_);
        });
      }
      P(() => $(m, "aria-expanded", d(l))), M(h, x);
    };
    O(b, (h) => {
      d(o).length && h(g);
    });
  }
  An(p, (h) => me(c, h), () => d(c)), P(() => v = ie(p, 1, "ar svelte-1avu033", null, v, { "ar-fill": a(), "ar-end": r() === "end" })), M(e, p), Ce();
}
Ba(["click"]);
var wk = /* @__PURE__ */ W('<p class="t-meta text-fg-muted" data-slipway-sentence=""> </p>'), kk = /* @__PURE__ */ W('<p class="t-meta mt-0.5 text-fg-muted"> </p>'), _k = /* @__PURE__ */ W('<p class="t-meta mt-1 text-fg-muted"> </p>'), yk = /* @__PURE__ */ W('<div class="sw-check-m rounded bg-subtle px-3 py-2 sm:hidden svelte-lmha6v" data-slipway-check-m=""><p class="t-ui flex min-w-0 items-center gap-2 text-fg"><!><span class="min-w-0 truncate"> </span></p> <!></div> <div class="rounded bg-subtle px-3 py-2 max-sm:hidden svelte-lmha6v" data-slipway-check=""><!> <!></div>', 1), xk = /* @__PURE__ */ W('<span class="chip t-label chip-wide shrink-0 border-line text-fg-subtle"> </span>'), Sk = /* @__PURE__ */ W('<span class="t-meta shrink-0 text-fg-subtle"> </span>'), Ck = /* @__PURE__ */ W('<li class="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3"><span aria-hidden="true"></span> <span class="t-card-title min-w-0 flex-1 text-fg"> </span> <!></li>'), Ak = /* @__PURE__ */ W('<ul class="divide-y divide-line overflow-hidden rounded-md border border-line" data-slipway-inset=""></ul>'), Tk = /* @__PURE__ */ W('<div class="sw-strand sm:hidden svelte-lmha6v" aria-hidden="true"><!></div>'), Mk = /* @__PURE__ */ W('<div class="sw-r svelte-lmha6v"><dt class="t-meta text-fg-muted">Scope</dt><dd class="t-ui text-fg"> </dd></div>'), Ek = /* @__PURE__ */ W('<div class="sw-r svelte-lmha6v" data-slipway-approval=""><dt class="t-meta text-fg-muted">Approval</dt><dd class="t-ui text-fg"> </dd></div> <div class="sw-r svelte-lmha6v"><dt class="t-meta text-fg-muted">Place</dt><dd class="flex min-w-0 items-center"><!></dd></div> <!>', 1), Lk = /* @__PURE__ */ W('<div class="sw-r svelte-lmha6v" data-slipway-approval=""><dt class="t-meta text-fg-muted">Approval</dt><dd class="t-ui text-fg"> </dd></div>'), Nk = /* @__PURE__ */ W('<div class="sw-r svelte-lmha6v"><dt class="t-meta text-fg-muted"> </dt><dd class="flex min-w-0 flex-wrap items-baseline gap-x-2"><span class="t-code tabular-nums text-fg-muted"> </span><span class="t-meta tabular-nums text-fg-subtle"> </span></dd></div>'), Rk = /* @__PURE__ */ W('<!> <div class="sw-r svelte-lmha6v"><dt class="t-meta text-fg-muted"> </dt><dd><span class="t-code tabular-nums text-fg svelte-lmha6v" data-slipway-build=""> </span></dd></div> <!>', 1), Ok = /* @__PURE__ */ W('<span class="t-ui text-fg"> </span>'), Dk = /* @__PURE__ */ W('<div class="sw-r svelte-lmha6v"><dt class="t-meta text-fg-muted"> </dt><dd class="flex min-w-0 flex-wrap items-baseline gap-x-2"><span class="t-code tabular-nums text-fg-muted"> </span><span class="t-meta tabular-nums text-fg-subtle"> </span></dd></div>'), Fk = /* @__PURE__ */ W('<div class="sw-r svelte-lmha6v"><dt class="t-meta text-fg-muted">Next build</dt><dd class="min-w-0"><span class="t-code tabular-nums text-fg svelte-lmha6v" data-slipway-build=""> </span><!></dd></div> <!>', 1), Ik = /* @__PURE__ */ W('<p class="t-ui text-fg"> </p>'), Pk = /* @__PURE__ */ W('<p class="t-meta mt-1 flex min-w-0 items-center gap-1.5 text-fg-subtle"><!><span class="min-w-0 break-words"> </span></p>'), jk = /* @__PURE__ */ W('<p class="t-meta mt-1 text-fg-subtle">Your change</p>'), Wk = /* @__PURE__ */ W('<div class="sw-r svelte-lmha6v"><dt class="t-meta text-fg-muted">Change</dt> <dd class="min-w-0" data-slipway-commit=""><!> <!></dd></div>'), Bk = /* @__PURE__ */ W('<span class="t-code tabular-nums"> </span> ', 1), zk = /* @__PURE__ */ W('<div class="sw-r svelte-lmha6v" data-slipway-facts=""><dt class="t-meta text-fg-muted"> </dt><dd class="t-ui text-fg"><!> </dd></div>'), Hk = /* @__PURE__ */ W('<div class="sw-pane min-w-0 p-4 sm:p-6 svelte-lmha6v"><div class="sw-info min-w-0 space-y-3 svelte-lmha6v"><div class="sw-title flex flex-wrap items-baseline gap-x-3 gap-y-1 svelte-lmha6v"><h4 data-slipway-title=""> </h4> <span class="t-meta tabular-nums text-fg-subtle"> </span></div> <!> <!> <!></div> <!>  <div class="sw-facts svelte-lmha6v"><dl class="sw-b1 sw-dl min-w-0 svelte-lmha6v" data-slipway-dl=""><!></dl> <dl class="sw-b2 sw-dl min-w-0 svelte-lmha6v" data-slipway-dl2=""><!> <!> <!></dl></div> <div class="sw-actions svelte-lmha6v" data-slipway-actions=""><!></div></div>');
function Vk(e, t) {
  Se(t, !0);
  let n = q(
    t,
    "hs",
    3,
    "incident"
    /** r5 R20: drawn as a bounded nested card (border, radius 8, the card's surface) that closes before the next row; the caller owns the margin around it */
    /** r34 v2 r4 (Y8): embedded in another page's list (/apps/<name>, /envs/<name>): the build is 14px mono, the rail is as tall as its steps (the pane owns the divider), and the check line is not drawn (the page's own statement carries it) */
  ), a = q(t, "action", 3, null), s = q(t, "compact", 3, !1), r = q(t, "nested", 3, !1), i = q(t, "class", 3, "");
  const o = /* @__PURE__ */ V(() => t.row.group === "failed"), l = /* @__PURE__ */ V(() => t.row.failure), c = /* @__PURE__ */ V(() => d(l) ? {
    name: d(l).check ?? d(l).line,
    message: d(l).check ? d(l).message ?? void 0 : void 0
  } : null), u = /* @__PURE__ */ V(() => (t.row.steps.find((de) => de.state === "fail") ?? t.row.steps.find((de) => de.state === "active" || de.state === "hold") ?? t.row.steps[t.row.steps.length - 1])?.name ?? null), f = /* @__PURE__ */ V(() => t.row.state === "awaiting-approval" || t.row.state === "held-by-rule"), p = /* @__PURE__ */ V(() => d(f) ? ys(t.row) : null), v = /* @__PURE__ */ V(() => ma(d(f) ? t.row.group === "held" ? Gb(t.row, n()) : d(p)?.since ?? t.row.since : t.row.since)), y = /* @__PURE__ */ V(() => t.row.group === "approval" && t.row.stillChecking && da(t.row) ? `Checking · ${da(t.row)}` : d(v)), b = /* @__PURE__ */ V(() => d(p) ? d(p).build : fs(t.row)), g = /* @__PURE__ */ V(() => Ob(d(f) ? { state: "healthy", href: t.row.href } : t.row)), h = /* @__PURE__ */ V(() => d(p) ? { title: d(p).title ?? "", author: d(p).author } : Zb(t.row)), x = /* @__PURE__ */ V(() => d(h)?.author === Pu), m = /* @__PURE__ */ V(() => Db(t.row, n())), C = /* @__PURE__ */ V(() => s() && !d(o) ? Pr(t.row)?.sentence ?? null : null), _ = /* @__PURE__ */ V(() => s() ? d(C) : d(m)), A = /* @__PURE__ */ V(() => t.row.steps.some((de) => de.state === "active")), E = /* @__PURE__ */ V(() => d(A) ? da(t.row) ? "Final check · Checking" : "Final check" : d(o) ? "Final check" : "Checked"), S = /* @__PURE__ */ V(() => d(A) ? da(t.row) ?? d(y) : d(o) ? d(y) : [ma(t.row.deployedAt), r1(t.row)].filter(Boolean).join(" · ")), w = /* @__PURE__ */ V(() => Xb(t.row)), L = /* @__PURE__ */ V(() => Lu(t.row).filter((de) => de.state === "failing").length), k = /* @__PURE__ */ V(() => da(t.row)), T = /* @__PURE__ */ V(() => t.row.group === "approval" && t.row.stillChecking && !!d(k)), F = /* @__PURE__ */ V(() => [
    {
      title: "Health checks",
      label: d(L) || d(w).healthChecks === "Failed" ? "Failed" : d(w).healthChecks === "Healthy" ? "Healthy" : d(w).healthChecks === "Pending" ? sl(t.row) : `${d(w).healthChecks} · ${sl(t.row)}`,
      tone: d(L) || d(w).healthChecks === "Failed" ? "bad" : d(w).healthChecks === "Healthy" ? "ok" : "wait"
    },
    {
      title: "Check timer",
      label: d(w).checkTimer === "Checking" && d(k) ? d(T) ? d(k) : `Checking · ${d(k)}` : d(w).checkTimer,
      tone: d(w).checkTimer === "Done" ? "ok" : d(w).checkTimer === "Checking" ? "wait" : "pending"
    }
  ]), z = {
    ok: "bg-success-solid",
    bad: "bg-danger-solid",
    wait: "bg-progress-solid animate-pulse",
    pending: "bg-line-strong"
  }, j = /* @__PURE__ */ V(() => d(p) ? {
    label: "Replaces",
    build: fs(t.row),
    age: `${ma(t.row.deployedAt)} ago`
  } : d(g) ? {
    label: d(o) ? "Last healthy" : "Replaces",
    build: d(g).build,
    age: `${d(o) ? "deployed " : ""}${ma(d(g).at)} ago`
  } : null), D = /* @__PURE__ */ V(() => {
    if (s()) {
      const he = Pr(t.row);
      return !he || d(
        o
        /* lead r9: the tab's own sentence, count first ('2 · held: waiting for approval'), never 'N, held:' */
      ) ? null : {
        label: "Newer builds",
        build: null,
        value: he.sentence.replace(/^(\d+) newer builds?/, "$1")
      };
    }
    if (!d(_)) return null;
    const de = /^(\d+) of (\d+) places? on the newest build$/.exec(d(_)), Z = /^All (\d+) places? on the newest build$/.exec(d(_));
    return {
      label: "Newest build",
      build: Pr(t.row)?.newest ?? null,
      value: de ? `reached ${de[1]} of ${de[2]} place${de[2] === "1" ? "" : "s"}` : Z ? `reached all ${Z[1]} places` : d(_)
    };
  }), H = /* @__PURE__ */ V(() => t.row.steps.find((de) => de.state === "active") ?? null), te = /* @__PURE__ */ V(() => d(H) ? d(H).name === "Check" ? "Final check" : d(H).name : null), ae = /* @__PURE__ */ V(() => !d(T) && d(p) && (t.row.group === "approval" || t.row.group === "held") ? d(p).build : null), se = /* @__PURE__ */ V(() => d(ae) ?? (d(T) ? "Final check" : t.row.group === "moving" ? d(te) : null) ?? u1(t.row, n())), G = /* @__PURE__ */ V(() => d(T) ? d(v) : d(y)), X = /* @__PURE__ */ V(() => s() ? null : d1(t.row, n())), re = /* @__PURE__ */ V(() => !s() && t.row.group === "approval" ? Ru(t.row, n()) : null), R = /* @__PURE__ */ V(() => t.row.needsYou ? "Your approval" : St("approval")), U = /* @__PURE__ */ V(() => !!d(p) && !!d(D) && d(D).build === d(b));
  let Y = /* @__PURE__ */ Ee(!1);
  const J = /* @__PURE__ */ V(() => t.row.steps.filter((de) => de.state === "done").length), Q = /* @__PURE__ */ V(() => a() ? a().kind === "approve" ? ew(Ou(t.row, n()), { key: "slipway-action" }) ?? {
    label: "Approve",
    href: rl(a()),
    key: "slipway-action"
  } : {
    label: o1(a()),
    href: rl(a()),
    icon: tv,
    key: "slipway-action"
  } : null), ee = /* @__PURE__ */ V(() => ({
    label: d(Y) ? "Hide details" : "Details",
    onclick: () => me(Y, !d(Y)),
    icon: _p,
    iconAfter: !0,
    iconTurn: d(Y),
    phoneOnly: !0,
    key: "slipway-details",
    data: { "aria-expanded": String(d(Y)) }
  })), ce = /* @__PURE__ */ V(() => ({
    label: "Open rollout",
    href: t.row.href,
    desktopOnly: !0,
    key: "slipway-open"
  }));
  {
    const de = (Be) => {
      {
        let gt = /* @__PURE__ */ V(() => t.row.state === "deploying" ? "Deploying" : "Checking");
        fl(Be, {
          get steps() {
            return t.row.steps;
          },
          get selected() {
            return d(u);
          },
          get noActiveChip() {
            return d(T);
          },
          get checkWord() {
            return d(gt);
          }
        });
      }
    };
    let Z = /* @__PURE__ */ V(() => r() ? "card" : "hung"), pe = /* @__PURE__ */ V(() => s() ? 640 : 560), he = /* @__PURE__ */ V(() => r() ? "sw-nested" : ""), ve = /* @__PURE__ */ V(() => s() ? "sw-compact" : ""), Le = /* @__PURE__ */ V(i), He = /* @__PURE__ */ V(() => d(o) ? "failed" : d(A) ? t.row.state === "checking" ? "checking" : "deploying" : "done"), _e = /* @__PURE__ */ V(() => d(Y) ? "open" : "closed"), $e = /* @__PURE__ */ V(() => d(o) ? "failed" : "moving");
    lk(e, {
      get shell() {
        return d(Z);
      },
      get at() {
        return d(pe);
      },
      railWidth: "min(300px, 40%)",
      get class() {
        return `sw ${d(he) ?? ""} ${d(ve) ?? ""} ${d(Le) ?? ""}`;
      },
      get state() {
        return d(He);
      },
      get rollup() {
        return `${d(J) ?? ""}/${t.row.steps.length ?? ""} steps`;
      },
      get label() {
        return `Deployment pipeline of ${t.row.app ?? ""}`;
      },
      get "data-more"() {
        return d(_e);
      },
      "data-slipway": "",
      get "data-state"() {
        return d($e);
      },
      rail: de,
      children: (Be, gt) => {
        var Ie = Hk(), B = N(Ie), oe = N(B), fe = N(oe), Qe = N(fe), Wt = I(fe, 2), Dn = N(Wt), bn = I(oe, 2);
        {
          var Ze = (be) => {
            var Me = wk(), Re = N(Me);
            P(() => K(Re, d(w).message)), M(be, Me);
          };
          O(bn, (be) => {
            s() && d(o) && d(w).message && be(Ze);
          });
        }
        var Xe = I(bn, 2);
        {
          var bt = (be) => {
            var Me = yk(), Re = ne(Me), Ve = N(Re), Ke = N(Ve);
            za(Ke, { class: "h-4 w-4 shrink-0 text-danger", "aria-hidden": "true" });
            var Je = I(Ke), ct = N(Je), wt = I(Ve, 2);
            {
              var Pe = (De) => {
                var Et = kk(), Bt = N(Et);
                P(() => K(Bt, d(c).message)), M(De, Et);
              };
              O(wt, (De) => {
                d(c).message && De(Pe);
              });
            }
            var Ue = I(Re, 2), Ae = N(Ue);
            $w(Ae, {
              get check() {
                return d(c);
              },
              danger: !0
            });
            var Ne = I(Ae, 2);
            {
              var Te = (De) => {
                var Et = _k(), Bt = N(Et);
                P(() => K(Bt, d(l).phrase)), M(De, Et);
              };
              O(Ne, (De) => {
                d(l)?.phrase && De(Te);
              });
            }
            P(() => K(ct, d(c).name)), M(be, Me);
          };
          O(Xe, (be) => {
            d(o) && d(c) && !s() && be(bt);
          });
        }
        var Mt = I(Xe, 2);
        {
          var It = (be) => {
            var Me = Ak();
            At(Me, 21, () => d(F), (Re) => Re.title, (Re, Ve) => {
              var Ke = Ck(), Je = N(Ke), ct = I(Je, 2), wt = N(ct), Pe = I(ct, 2);
              {
                var Ue = (Ne) => {
                  var Te = xk(), De = N(Te);
                  P(() => K(De, d(Ve).label)), M(Ne, Te);
                }, Ae = (Ne) => {
                  var Te = Sk(), De = N(Te);
                  P(() => K(De, d(Ve).label)), M(Ne, Te);
                };
                O(Pe, (Ne) => {
                  d(Ve).tone === "pending" ? Ne(Ue) : Ne(Ae, !1);
                });
              }
              P(() => {
                ie(Je, 1, `h-3 w-3 shrink-0 rounded-full ${z[d(Ve).tone] ?? ""}`, "svelte-lmha6v"), K(wt, d(Ve).title);
              }), M(Re, Ke);
            }), M(be, Me);
          };
          O(Mt, (be) => {
            d(o) || be(It);
          });
        }
        var Oe = I(B, 2);
        {
          var ea = (be) => {
            var Me = Tk();
            let Re;
            var Ve = N(Me);
            fl(Ve, {
              get steps() {
                return t.row.steps;
              },
              layout: "strand",
              dup: !0
            }), P((Ke) => Re = rt(Me, "", Re, Ke), [
              () => ({
                "max-width": `${Math.max(2, t.row.steps.length) * 96}px`
              })
            ]), M(be, Me);
          };
          O(Oe, (be) => {
            s() || be(ea);
          });
        }
        var ta = I(Oe, 2), xs = N(ta), wr = N(xs);
        {
          var wn = (be) => {
            var Me = Ek(), Re = ne(Me), Ve = I(N(Re)), Ke = N(Ve), Je = I(Re, 2), ct = I(N(Je)), wt = N(ct);
            {
              let Ae = /* @__PURE__ */ V(() => Iu(t.row.tier));
              Li(wt, {
                role: "env",
                get theme() {
                  return d(Ae);
                },
                get label() {
                  return d(re).acts;
                },
                wide: !0
              });
            }
            var Pe = I(Je, 2);
            {
              var Ue = (Ae) => {
                var Ne = Mk(), Te = I(N(Ne)), De = N(Te);
                P(() => K(De, `1 of ${d(re).of ?? ""} regions`)), M(Ae, Ne);
              };
              O(Pe, (Ae) => {
                d(re).of > 1 && Ae(Ue);
              });
            }
            P(() => K(Ke, d(R))), M(be, Me);
          }, kr = (be) => {
            var Me = Rk(), Re = ne(Me);
            {
              var Ve = (Te) => {
                var De = Lk(), Et = I(N(De)), Bt = N(Et);
                P(() => K(Bt, d(X))), M(Te, De);
              };
              O(Re, (Te) => {
                d(X) && Te(Ve);
              });
            }
            var Ke = I(Re, 2), Je = N(Ke), ct = N(Je), wt = I(Je), Pe = N(wt), Ue = N(Pe), Ae = I(Ke, 2);
            {
              var Ne = (Te) => {
                var De = Nk(), Et = N(De), Bt = N(Et), _r = I(Et), Ss = N(_r), yr = N(Ss), ld = I(Ss), cd = N(ld);
                P(() => {
                  K(Bt, d(j).label), K(yr, d(j).build), K(cd, d(j).age);
                }), M(Te, De);
              };
              O(Ae, (Te) => {
                d(j) && Te(Ne);
              });
            }
            P(() => {
              K(ct, d(p) ? "Next build" : "Build"), K(Ue, d(b));
            }), M(be, Me);
          };
          O(wr, (be) => {
            d(re) ? be(wn) : be(kr, !1);
          });
        }
        var td = I(xs, 2), Xi = N(td);
        {
          var nd = (be) => {
            var Me = Fk(), Re = ne(Me), Ve = I(N(Re)), Ke = N(Ve), Je = N(Ke), ct = I(Ke);
            {
              var wt = (Ae) => {
                var Ne = Ok(), Te = N(Ne);
                P(() => K(Te, ` · ${d(D).value ?? ""}`)), M(Ae, Ne);
              };
              O(ct, (Ae) => {
                d(U) && d(D) && Ae(wt);
              });
            }
            var Pe = I(Re, 2);
            {
              var Ue = (Ae) => {
                var Ne = Dk(), Te = N(Ne), De = N(Te), Et = I(Te), Bt = N(Et), _r = N(Bt), Ss = I(Bt), yr = N(Ss);
                P(() => {
                  K(De, d(j).label), K(_r, d(j).build), K(yr, d(j).age);
                }), M(Ae, Ne);
              };
              O(Pe, (Ae) => {
                d(j) && Ae(Ue);
              });
            }
            P(() => {
              $(Re, "data-slipway-facts", d(U) ? "" : void 0), K(Je, d(b));
            }), M(be, Me);
          };
          O(Xi, (be) => {
            d(re) && be(nd);
          });
        }
        var Ji = I(Xi, 2);
        {
          var ad = (be) => {
            var Me = Wk(), Re = I(N(Me), 2), Ve = N(Re);
            {
              var Ke = (Pe) => {
                var Ue = Ik(), Ae = N(Ue);
                P((Ne) => K(Ae, Ne), [
                  () => d(p) ? d(p).title : er(t.row)?.title ?? d(h).title
                ]), M(Pe, Ue);
              };
              O(Ve, (Pe) => {
                (d(p) ? d(p).title : er(t.row)?.title ?? d(h).title) && Pe(Ke);
              });
            }
            var Je = I(Ve, 2);
            {
              var ct = (Pe) => {
                var Ue = Pk(), Ae = N(Ue);
                {
                  let De = /* @__PURE__ */ V(() => Su(d(h).author));
                  vi(Ae, {
                    get name() {
                      return d(h).author;
                    },
                    get src() {
                      return d(De);
                    },
                    size: 20
                  });
                }
                var Ne = I(Ae), Te = N(Ne);
                P(() => K(Te, d(h).author)), M(Pe, Ue);
              }, wt = (Pe) => {
                var Ue = le(), Ae = ne(Ue);
                {
                  var Ne = (Te) => {
                    var De = jk();
                    M(Te, De);
                  };
                  O(
                    Ae,
                    (Te) => {
                      d(x) && Te(Ne);
                    },
                    !0
                  );
                }
                M(Pe, Ue);
              };
              O(Je, (Pe) => {
                d(h).author && !d(x) ? Pe(ct) : Pe(wt, !1);
              });
            }
            M(be, Me);
          };
          O(Ji, (be) => {
            d(h) && be(ad);
          });
        }
        var sd = I(Ji, 2);
        {
          var rd = (be) => {
            var Me = zk(), Re = N(Me), Ve = N(Re), Ke = I(Re), Je = N(Ke);
            {
              var ct = (Pe) => {
                var Ue = Bk(), Ae = ne(Ue), Ne = N(Ae), Te = I(Ae, 1, !0);
                Te.nodeValue = " ", P(() => K(Ne, d(D).build)), M(Pe, Ue);
              };
              O(Je, (Pe) => {
                d(D).build && Pe(ct);
              });
            }
            var wt = I(Je, 1, !0);
            P(() => {
              K(Ve, d(D).label), K(wt, d(D).value);
            }), M(be, Me);
          };
          O(sd, (be) => {
            d(D) && !(d(re) && d(U)) && be(rd);
          });
        }
        var id = I(ta, 2), od = N(id);
        {
          let be = /* @__PURE__ */ V(() => d(o) ? d(Q) ?? void 0 : void 0), Me = /* @__PURE__ */ V(() => [
            ...s() ? [] : [d(ee), d(ce)],
            ...!d(o) && d(Q) ? [{ ...d(Q), lead: !0 }] : []
          ]);
          bk(od, {
            align: "end",
            get primary() {
              return d(be);
            },
            get secondary() {
              return d(Me);
            }
          });
        }
        P(() => {
          ie(fe, 1, `${d(ae) && !s() && !d(o) ? "t-code-lg tabular-nums" : "t-heading"} text-fg`), K(Qe, s() || d(o) ? d(E) : d(se)), K(Dn, s() || d(o) ? d(S) : d(G));
        }), M(Be, Ie);
      },
      $$slots: { rail: !0, default: !0 }
    });
  }
  Ce();
}
const Uk = (e) => e;
function qk(e) {
  const t = e - 1;
  return t * t * t + 1;
}
function vl(e) {
  const t = typeof e == "string" && e.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
  return t ? [parseFloat(t[1]), t[2] || "px"] : [
    /** @type {number} */
    e,
    "px"
  ];
}
function Yu(e, { delay: t = 0, duration: n = 400, easing: a = Uk } = {}) {
  const s = +getComputedStyle(e).opacity;
  return {
    delay: t,
    duration: n,
    easing: a,
    css: (r) => `opacity: ${r * s}`
  };
}
function $u(e, { delay: t = 0, duration: n = 400, easing: a = qk, x: s = 0, y: r = 0, opacity: i = 0 } = {}) {
  const o = getComputedStyle(e), l = +o.opacity, c = o.transform === "none" ? "" : o.transform, u = l * (1 - i), [f, p] = vl(s), [v, y] = vl(r);
  return {
    delay: t,
    duration: n,
    easing: a,
    css: (b, g) => `
			transform: ${c} translate(${(1 - b) * f}${p}, ${(1 - b) * v}${y});
			opacity: ${l - u * g}`
  };
}
function Gk(e) {
  const t = e - 1;
  return t * t * t + 1;
}
var Kk = /* @__PURE__ */ W('<div aria-hidden="true"></div>');
function Yk(e, t) {
  Se(t, !0);
  let n = q(t, "size", 3, "4"), a = q(t, "color", 3, "blue"), s = q(t, "class", 3, "");
  const r = /* @__PURE__ */ V(() => ({
    3: "h-3 w-3 border-2",
    4: "h-4 w-4 border-2",
    5: "h-5 w-5 border-2",
    6: "h-6 w-6 border-[3px]",
    8: "h-8 w-8 border-[3px]"
  })[n()]), i = /* @__PURE__ */ V(() => ({
    yellow: "border-progress-line border-t-progress",
    blue: "border-active-line border-t-active",
    orange: "border-held-line border-t-held",
    red: "border-danger-line border-t-danger",
    green: "border-success-line border-t-success",
    gray: "border-line-strong border-t-fg-subtle",
    white: "border-white/40 border-t-white"
  })[a()]);
  var o = Kk();
  P(() => ie(o, 1, `inline-block shrink-0 animate-spin rounded-full ${d(r) ?? ""} ${d(i) ?? ""} ${s() ?? ""}`)), M(e, o), Ce();
}
let tr = /* @__PURE__ */ Ee(0);
function $k() {
  me(tr, d(tr) + 1);
}
function Qk() {
  me(tr, Math.max(0, d(tr) - 1), !0);
}
var Zk = /* @__PURE__ */ W('<span class="text-fg-muted"> </span>'), Xk = /* @__PURE__ */ W(" <!>", 1), Jk = /* @__PURE__ */ W('<div class="shrink-0"><!></div>'), e_ = /* @__PURE__ */ W('<button type="button" class="btn btn-ghost btn-icon btn-xs -my-1 -mr-2" aria-label="Dismiss"><!></button>'), t_ = /* @__PURE__ */ W('<div style="box-shadow: var(--k-shadow-overlay)"><span><!></span> <div><!></div> <!> <!></div>');
function n_(e, t) {
  Se(t, !0);
  let n = q(t, "open", 15, !1), a = q(t, "tone", 3, "info"), s = q(t, "message", 3, ""), r = q(t, "dismissable", 3, !0), i = q(t, "floating", 3, !0), o = q(t, "description", 3, "");
  const l = {
    success: ur,
    danger: za,
    info: Kp
  }, c = {
    success: "text-success",
    danger: "text-danger",
    info: "text-fg-subtle",
    loading: "text-active"
  }, u = /* @__PURE__ */ V(() => a() === "loading" ? null : l[a()]);
  Ln(() => {
    if (n() && i())
      return $t($k), () => $t(Qk);
  });
  var f = le(), p = ne(f);
  {
    var v = (y) => {
      var b = t_(), g = N(b), h = N(g);
      {
        var x = (T) => {
          var F = le(), z = ne(F);
          Zr(z, () => d(u), (j, D) => {
            D(j, { class: "h-4 w-4" });
          }), M(T, F);
        }, m = (T) => {
          Yk(T, { size: "4", color: "blue" });
        };
        O(h, (T) => {
          d(u) ? T(x) : T(m, !1);
        });
      }
      var C = I(g, 2), _ = N(C);
      {
        var A = (T) => {
          var F = le(), z = ne(F);
          Un(z, () => t.children), M(T, F);
        }, E = (T) => {
          var F = Xk(), z = ne(F, !0), j = I(z);
          {
            var D = (H) => {
              var te = Zk(), ae = N(te);
              P(() => K(ae, `· ${o() ?? ""}`)), M(H, te);
            };
            O(j, (H) => {
              o() && H(D);
            });
          }
          P(() => K(z, s())), M(T, F);
        };
        O(_, (T) => {
          t.children ? T(A) : T(E, !1);
        });
      }
      var S = I(C, 2);
      {
        var w = (T) => {
          var F = Jk(), z = N(F);
          Un(z, () => t.action), M(T, F);
        };
        O(S, (T) => {
          t.action && T(w);
        });
      }
      var L = I(S, 2);
      {
        var k = (T) => {
          var F = e_();
          F.__click = () => n(!1);
          var z = N(F);
          Rp(z, { class: "h-3 w-3" }), M(T, F);
        };
        O(L, (T) => {
          r() && T(k);
        });
      }
      P(() => {
        $(b, "role", a() === "danger" ? "alert" : "status"), ie(b, 1, `${i() ? "fixed right-2 left-2 z-[60] top-[calc(env(safe-area-inset-top,0px)+4px)] sm:top-auto sm:right-4 sm:bottom-4 sm:left-auto sm:w-[380px]" : "relative w-full max-w-[380px]"} flex items-start gap-3 rounded-md bg-overlay px-4 py-3`), ie(g, 1, `mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center ${c[a()] ?? ""}`), ie(C, 1, `t-body min-w-0 flex-1 text-fg ${i() && a() !== "danger" ? "max-sm:truncate" : ""}`), $(C, "title", i() && a() !== "danger" && s() ? o() ? `${s()} · ${o()}` : s() : void 0);
      }), Us(1, b, () => $u, () => ({ y: 8, duration: 160, easing: Gk })), Us(2, b, () => Yu, () => ({ duration: 120 })), M(y, b);
    };
    O(p, (y) => {
      n() && y(v);
    });
  }
  M(e, f), Ce();
}
Ba(["click"]);
var a_ = /* @__PURE__ */ W('<div class="fixed inset-0 z-[69] bg-black/40" aria-hidden="true"></div>'), s_ = /* @__PURE__ */ W('<!> <div role="dialog" data-approve-confirm=""><div class="min-w-0"><div class="t-ui font-medium text-fg"> </div> <div class="t-meta mt-0.5 text-fg-muted"> </div></div> <div class="flex items-center justify-end gap-2"><button type="button" data-action="approve-cancel">Cancel</button> <button type="button" data-action="approve-confirm">Approve</button></div></div>', 1), r_ = /* @__PURE__ */ W('<button type="button" class="nav-link" data-action="approve-dismiss">Dismiss</button>'), i_ = /* @__PURE__ */ W('<button type="button" class="nav-link" data-action="approve-undo">Undo</button>'), o_ = /* @__PURE__ */ W("<!> <!>", 1);
function l_(e, t) {
  Se(t, !0);
  const n = /* @__PURE__ */ V(() => ze.ask), a = /* @__PURE__ */ V(() => ze.done);
  let s = /* @__PURE__ */ Ee(void 0), r = /* @__PURE__ */ Ee(1024), i = /* @__PURE__ */ Ee(800);
  const o = /* @__PURE__ */ V(() => d(r) < 640), l = /* @__PURE__ */ V(() => {
    const b = d(n)?.anchor;
    if (d(o) || !b) return "";
    const g = 320, h = Math.max(8, Math.min(b.right - g, d(r) - g - 8)), x = b.bottom + 8 + 150 < d(i);
    return `left:${h}px;width:${g}px;${x ? `top:${b.bottom + 8}px` : `bottom:${d(i) - b.top + 8}px`}`;
  });
  Ln(() => {
    d(n) && sc().then(() => d(s)?.querySelector('[data-action="approve-confirm"]')?.focus());
  }), np(() => {
    const b = (g) => {
      ze.ask && d(s) && !d(s).contains(g.target) && !g.target.closest?.("[data-approve-open]") && Wr();
    };
    return document.addEventListener("pointerdown", b, !0), () => document.removeEventListener("pointerdown", b, !0);
  });
  function c(b) {
    b.key === "Escape" && ze.ask && (b.stopPropagation(), Wr());
  }
  var u = o_();
  $r("keydown", ns, c);
  var f = ne(u);
  {
    var p = (b) => {
      const g = /* @__PURE__ */ V(() => d(n).target);
      var h = s_(), x = ne(h);
      {
        var m = (F) => {
          var z = a_();
          Us(3, z, () => Yu, () => ({ duration: 120 })), M(F, z);
        };
        O(x, (F) => {
          d(o) && F(m);
        });
      }
      var C = I(x, 2), _ = N(C), A = N(_), E = N(A), S = I(A, 2), w = N(S), L = I(_, 2), k = N(L);
      k.__click = function(...F) {
        Wr?.apply(this, F);
      };
      var T = I(k, 2);
      T.__click = () => X1(), An(C, (F) => me(s, F), () => d(s)), P(
        (F, z, j) => {
          $(C, "aria-modal", d(o) ? "true" : void 0), $(C, "aria-label", F), ie(C, 1, `fixed z-[70] flex flex-col gap-3 bg-overlay p-4 ${d(o) ? "inset-x-2 bottom-2 rounded-lg pb-[calc(env(safe-area-inset-bottom,0px)+16px)]" : "rounded-md"}`), rt(C, `box-shadow: var(--k-shadow-overlay); ${d(l) ?? ""}`), K(E, z), K(w, `${d(g).app ?? ""} · ${j ?? ""}`), ie(k, 1, `btn btn-secondary btn-sm ${d(o) ? "min-h-11 flex-1" : ""}`), ie(T, 1, `btn btn-primary btn-sm ${d(o) ? "min-h-11 flex-1" : ""}`);
        },
        [
          () => ul(d(g)),
          () => ul(d(g)),
          () => d(g).places.map((F) => F.label === "prod" ? "production" : F.label).join(", ")
        ]
      ), Us(3, C, () => $u, () => ({ y: d(o) ? 24 : 6, duration: 140 })), M(b, h);
    };
    O(f, (b) => {
      d(n) && b(p);
    });
  }
  var v = I(f, 2);
  {
    var y = (b) => {
      const g = /* @__PURE__ */ V(() => Q1(d(a).target));
      var h = () => !0, x = (m) => {
        m || fi();
      };
      {
        const m = (E) => {
          var S = le(), w = ne(S);
          {
            var L = (T) => {
              var F = r_();
              F.__click = function(...z) {
                fi?.apply(this, z);
              }, M(T, F);
            }, k = (T) => {
              var F = i_();
              F.__click = () => J1(), M(T, F);
            };
            O(w, (T) => {
              d(a).error ? T(L) : T(k, !1);
            });
          }
          M(E, S);
        };
        let C = /* @__PURE__ */ V(() => d(a).error ? "danger" : "success"), _ = /* @__PURE__ */ V(() => d(a).error ? `Could not approve ${d(a).target.build}` : `${d(g).title} · ${d(g).detail}`), A = /* @__PURE__ */ V(() => d(a).error ?? "");
        n_(b, {
          get open() {
            return h();
          },
          set open(E) {
            x(E);
          },
          get tone() {
            return d(C);
          },
          get message() {
            return d(_);
          },
          get description() {
            return d(A);
          },
          action: m,
          $$slots: { action: !0 }
        });
      }
    };
    O(v, (b) => {
      d(a) && b(y);
    });
  }
  ho("innerWidth", (b) => me(r, b, !0)), ho("innerHeight", (b) => me(i, b, !0)), M(e, u), Ce();
}
Ba(["click"]);
const c_ = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD//gARTGF2YzU4LjEzNC4xMDAA/9sAQwAICAgJCAkLCwsLCwsNDA0NDQ0NDQ0NDQ0NDg4OERERDg4ODQ0ODhAQERESExIRERERExMUFBQYGBcXHBwdIiIp/8QAlQAAAQUBAQEAAAAAAAAAAAAAAwcFBAYCAQgAAQACAwEBAAAAAAAAAAAAAAADBAUBAgAGEAACAQMCAwYDBgUFAQEBAAACAQMABBEhBTFBEiJxYRMGUaGBkcHRQhQyUrEjM+HwFWKSgnLxc7IRAAICAQIFAwMFAQAAAAAAAAABAhEDQSExUTIEEnETgbGRYdHB4SKh8P/AABEIAIAAgAMBIgACEQADEQD/2gAMAwEAAhEDEQA/ADAqJWBoqVOCB8lRUq4KoqVcWdrKMU8dSz7ZqDf7hDaDgz6W+S1J9yWvzpOt29UG35Vv1RpPtFoj8UuOM97rMpqJpQbFKutxtbP+oeCxnoWpP5LWmc/UgZxFbkfeaH4JOkwtbue5uUJSEAm3l56nj3bL+Lp6RxSZGOUybz0iiJ8P3PXPj04S4a0F5ZaUg0cUddy2H6qKL+pbQj4fmRTx8xrtv6022SRBKihzjtdQyB82Dz8KT+82yWIOszk111LH3aVWTHpf+OqWWfOzTxx9D0lFLHOKOMxMXzF5VbxSFbFv9zs8iIGziylNCRaEP7gz+klyfD3pbLG9t9xto7iAuoJFle6fMSXJrg1R4T8vUBODiSGqxijVlqiAwTVYao+KG1XHERKipVhURVks2qgbnfBt1qUr1fAB9y+5cXTgqTr1be9dyMSLQOyllLtYyTbemOXyrM34o1BeToFauW/kkMybkJavj0p+3L/OFNQ7NNc3mATNCWF8+Orom23TN+RH+J4bHTvf2ZpYPT23BGItis1H5MlEphwqfoUsvRM02rixlJZRfd786iTeiL62/pEYf+eOa9DwQxtcFpRDhifJUNSlzCuGJbUzyoe33ttceXfySlHwySbD/sK5fOmbdLSK3J9Ajj/a213rOvxr1Fu2zW10LbAc0jm/+lV0kw0xnD+ytRzaMxPttrixIuDq9ejN6/JXH5WV4huCSFvhHLyz7I+HfiqXc2520hAaw18azDI4zz9fro+9PWmYyqmhOUbtM9LVyoW23Q3llbziXUpIxefHGvzTynU104J0crDrVYdWURlW0qyqKqo46tKQ31DcuXcrh5062u7V6fGlyazSDeoIjtt2vAaxmUiX/k9Vx8HQcvBBsXEevS4gVys6taJfR0uljKo+jHBqkD9JiR3yQ8EmyftS8beIqNFISEVzelRefqVEz2nS7LNHdmOmtGd0eMtU2Duu2xD2p4dP9w/fW3exXI5jNEn7Os00g/8AVvY5NOR5eXVb3A+sSXTprT+zCMdX3003l1a9LWR+FdVluhGN/wBr87JAu0stf541QnlPHBqlq3KNSCRhhrD4eypItxi8q5P2LtUziehG54q7QpHoHcCkhnsyekbUgeCL9S+RLPzpRG6Sb0BCbvLiVfpGNC/btP8AtSrupDH0ojsnUzLdYbrWawTogMGNFxQ1RVVHG0qTv11szkCPcIhyw/lz4X4fwm+7g3SjKoG8qb/TbjycdaFNZWU0msprmmqxPpf3CY+pLhbSE09Dw5luT/ahVPG4XUpkwO4LGSwPUgAR988vi+Spw9GW4ebdCQiDORNivw5HqwvrpVo3H09GXbGEZCyiwWgvHLg0n31EymvcfwTOPG3iXz9RJp7YwcZKQjEjJCpMpMgwyWP1jj3MBT5Ve/S1zPPcDA0xb5VIdkUk7a20RkLRyPDeOGExN5/41cth2mOzuISIBAsvCXLPL7lyq5SuqN48bjv87FT9Y7lNtKQfuyqSplf3iklcpRRius2RFoLeOrpFE0OWkm8LNK/63s1fbiMbw/LXXjvelU+eytIIlHLYnMxySk1Z5fFvDWfDTC5VcGomMqlN/YpgXVxbL+XcMtNNeoSXPH2p6027mTkKKR8SHX2zVmLa1dTEYQnAGiw9GT98a408c0071bK3GEVxTx9aNFpsVnGSQoHofb5LTbTlkFgVxJ1JPR+WkkLx46tVc3QbdMIIRby1GCb4ZaFZeFW26kEqSRHSds43Q26+boTdaMhE6Kqjp0YXVHIOq5OKOExfBi891fDWLqH8xbSxdTDrFiyXFJ8cVT4M0uKZVtqJ2W7TL8BqMxfJ9nD1+WKVu0kCYE21qqSM4/IkgXlSitRUpprrQYS+eNeCqz2m5sB6cvI1DZIuMt1wPQYJxkuOz3X4vQvkrtLdM30rHPFQbVlcSDKl0B1dlvi/GmW167uTrmPRcA+15qub7um+bZdtQAEtqh7KWhpfwePlmqSctA7cYLiOvqoJBuilhHzDNiP26ULbigu4AcgpFjVNaqkrv/V25XEoBGLRiWWsNa58eVXK3uzVtGyaCTpy3wyT1ee91qUWldAo5IOT32SXEf8AcwtoImw6Vo+VJBOS3Dd7KLiJXAZ/5Kn7ed6Nj0ap8PDvVN3pnbrq43O3ufKNwxsyKVrsZSeiLmWcaKjdvDexTvMieyFZdBJ0QnQG6kyHMt0Nuut0JuuKCqii6CqInXHEkXRRdR06Kqo0Q96a/J9eMsTFp+3v8KaLOYJCEsrXTudWK4AZLeVEsj0E38lxpNUctrM4849s81SPdwtr0+hIdpPxT5WXAJt4spikdtLPAvxREHX39JNVKuN6U0T8zadwLxYEX/8AANfGjbPuhnb+Wa6qb9xut4sCZWbMhf4CTa+q5d9KxejJSHhVu2n80VqU3KZSw7Jct6vMiYL4oahDHum5TZUIWYRLtAzZovknp9aLdbt6kv8AMTBRLg2Kf20Mpbjbrfpefcm3lkb93RPQDm9p9N1rtX8jRvIxwyjEnrGCZ657T1x8qUn05bFa7PbIlhmnK1/+j6l8MUjrnRXAnP2+uQWQ51JdWvyxpS7xTxXEEcsOPLMUwxphY4Y5Y4Ypzt40myL7mVnCdRiKim6jE6ZEzLKhsq43Q2644mp0ROo6da60PF1RaJadbcggsk0lTf57egp9/KgygRRM22+0l7/5mstmkh+hau7G+Yp9mLTPNdQ9T+lUrddv6+2v1KlM9LxQzWaB47ZSQy90g4/jjFVa+gK3klgkXbiJgXjjg/8AssOle7TTxy/H7j/Z04zjrxKVtu7SbbL/ADFkef8Aara/WdmIYftr2cumSeyjl0wtaqG5WNxZtsNR9nrSy8ZDPlOHB7FyuPVsHS/LjbJ80NUXeN5K5eOCXAftL7qaHdTSaar3qL5RGXi6KopbgpZJSBB1SSdT1xrmlV2beY7G0tYbhMY5Q645OQt8Ra9ueVSfq18uNpLVqrfvtn+Tt7C1f9SK3i6vAiTz/CmcDtZHyS+opnVKPNtl4U8cw9cZCYvmLyqARUntlNcWvajNrPFcvpVkg3gJMKVdL/cv0/2ovkLOI8MqE3WetEsppr3VYbrRmiW5n+FffQl1G9fjXRSLOM9//wB1raLo9l3usMIkSE448Dkc9/PwozYeUQiuPay8cV7Lj403xfzT6tdPbTHj31M0a06c8teb99Ptqix89LXArzwwupLqF810tP44+FTPWlswkg3IUvLmQxyY11x2Demj1Y/SqfZXjs9xGQdEbcZLv/vUvffWJXU1j6fC1GQLryxkuCTIh8x4DyRTSyHZIiefZKryQWXFWq2/T/TeKbx5L/78jJclntD8Kbry+jlg6T6eodNeLrcZyCiCRYMGQGuaIXhp/Omu5UEha9l1GxRJOWvMY3Anl441uK26XlqnDpHgOtaPAKiNgkOvpvaf9V3WEGsxwtTSPiuy+yPzf203+ob389vt3jPSBoEnpjpFLGOTzV+2u7tvR+0W9zeRSObc5vLEQS8wEQdkmm12QTXUuOXSUBJ59/czP8c8j45z2nj5U7Be3iS1k7l9tkJ5Zec70WyHoY/06csvSuMPCpGgR4Li9Wv719GOU8fSqYM5EcsOoFhc1y+jpzjuxPQ+y/hUUY21ngl8a55fVxTruBTVn//Z", Ge = "checkout-api", hl = "danielreed", qt = Date.parse("2026-11-10T09:00:00Z"), u_ = 20, nr = (e) => qt + e * u_ * 1e3, Wn = (e) => new Date(nr(e)).toISOString(), vn = 36e5, ar = 2, Qu = 19.4, rn = {
  dev: { start: 2, check: 5, done: 8 },
  staging: { start: 8, check: 11, done: 14 },
  "us-east-1": { start: 19.4, check: 22, done: 24.5 },
  "us-east-2": { start: 24.5, check: 27, done: 30 },
  "eu-west-1": { start: 24.5, check: 27, done: 30 },
  "eu-central-1": { start: 24.5, check: 27, done: 30 },
  "ap-southeast-2": { start: 24.5, check: 27, done: 30 }
}, Zu = 14, Zi = (e, t, n) => ({ tag: `b-${e}`, version: `4.${e}.0-${e}`, revision: t, created: new Date(n).toISOString() }), qe = { 44: "b44d3e19a0c7e5a1f2b8c9d04e6a7b1c2d3e4f50", 45: "b45a7c2e9d1f03b4a5c6d7e8f9a0b1c2d3e4f561", 46: "e1c7a04b8d2f19a3c5e7091b3d5f7a9c1e3b5d72" }, ml = Zi(44, qe[44], qt - 30 * vn), Br = Zi(45, qe[45], qt - 4 * vn), zr = () => Zi(46, qe[46], nr(ar) + 9e4), xa = [
  { ns: "checkout-api-dev", env: "dev", step: rn.dev, bake: "10m", theme: "dev" },
  { ns: "checkout-api-staging", env: "staging", step: rn.staging, bake: "10m", theme: "staging" },
  { ns: "checkout-api-prod-us-east-1", env: "prod", site: "us-east-1", wave: 1, step: rn["us-east-1"], bake: "15m", theme: "prod" },
  { ns: "checkout-api-prod-us-east-2", env: "prod", site: "us-east-2", wave: 2, step: rn["us-east-2"], bake: "15m", theme: "prod" },
  { ns: "checkout-api-prod-eu-west-1", env: "prod", site: "eu-west-1", wave: 2, step: rn["eu-west-1"], bake: "15m", theme: "prod" },
  { ns: "checkout-api-prod-eu-central-1", env: "prod", site: "eu-central-1", wave: 2, step: rn["eu-central-1"], bake: "15m", theme: "prod" },
  { ns: "checkout-api-prod-ap-southeast-2", env: "prod", site: "ap-southeast-2", wave: 2, step: rn["ap-southeast-2"], bake: "15m", theme: "prod" }
], Tn = (e, t) => t < e.step.start ? "old" : t < e.step.check ? "deploying" : t < e.step.done ? "checking" : "done", Hr = (e, t) => ({ name: e, allowedVersions: t, message: t.length ? "Gate is passing" : "Gate does not allow any release candidate" });
function d_(e, t, n) {
  const a = t >= ar, s = Tn(e, t), r = a ? [ml, Br, zr()] : [ml, Br], i = s !== "old", o = i ? "b-46" : "b-45", l = [];
  if (i) {
    const p = s === "deploying" ? "Deploying" : s === "checking" ? "InProgress" : "Succeeded";
    l.push({
      id: 2,
      version: zr(),
      timestamp: Wn(e.step.start),
      bakeStatus: p,
      triggeredBy: { kind: "System", name: "System" },
      ...s === "deploying" ? { bakeStartTime: Wn(e.step.start) } : { bakeStartTime: Wn(e.step.check) },
      ...s === "done" ? { bakeEndTime: Wn(e.step.done) } : {}
    });
  }
  l.push({ id: 1, version: Br, timestamp: new Date(qt - 3 * vn).toISOString(), bakeStatus: "Succeeded", bakeStartTime: new Date(qt - 3 * vn).toISOString(), bakeEndTime: new Date(qt - 3 * vn + 6e5).toISOString(), triggeredBy: { kind: "System", name: "System" } });
  const c = [], u = a ? ["b-46"] : [];
  if (e.env === "staging" && c.push(Hr("promotion-staging", t >= rn.dev.done ? u : [])), e.env === "prod") {
    const p = t >= Qu - 0.4, v = t >= Zu, y = e.wave === 1 || t >= rn["us-east-1"].done;
    c.push(Hr(`promotion-prod-${e.site}`, v && y ? u : [])), v && c.push(Hr("release-approval", p ? ["b-44", "b-45", ...u] : ["b-44", "b-45"]));
  }
  const f = i || !a ? [] : [zr()];
  return {
    apiVersion: "kuberik.com/v1alpha1",
    kind: "Rollout",
    metadata: { name: Ge, namespace: e.ns, labels: { environment: e.site ? `${e.env}-${e.site}` : e.env }, annotations: { "rollout-dashboard.kuberik.com/source-cluster": e.env } },
    spec: { releasesImagePolicy: `${e.ns}/${Ge}`, versionHistoryLimit: 20, minBakeTime: "2m", bakeTime: e.bake, healthCheckSelector: { matchLabels: { app: Ge, env: e.site ? `${e.env}-${e.site}` : e.env } } },
    status: { source: "github.com/exampleco/checkout-api", wantedVersion: o, currentVersion: o, previousVersion: i ? "b-45" : "b-44", availableReleases: r, releaseCandidates: f, history: l, gates: c }
  };
}
function f_(e, t) {
  const n = Tn(e, t), a = n === "old" ? qe[45] : qe[46], s = xa.map((i) => ({ environment: i.env, site: i.site ?? "default", wave: i.wave ?? 1, revision: Tn(i, t) === "old" ? qe[45] : qe[46], bakeStatus: Tn(i, t) === "done" || Tn(i, t) === "old" ? "Succeeded" : Tn(i, t) === "checking" ? "InProgress" : "Deploying" })), r = (i, o, l) => ({ type: i, status: "True", reason: o, message: l, lastTransitionTime: Wn(0) });
  return {
    apiVersion: "environments.kuberik.com/v1alpha1",
    kind: "Environment",
    metadata: { name: Ge, namespace: e.ns, annotations: { "rollout-dashboard.kuberik.com/source-cluster": e.env } },
    spec: { environment: e.env, name: "checkout-api-service", rolloutRef: { name: Ge }, ...e.site ? { site: e.site, wave: e.wave } : {} },
    status: {
      ...e.env === "dev" ? {} : { rolloutGateRef: { name: e.env === "staging" ? "promotion-staging" : `promotion-prod-${e.site}` } },
      currentVersion: n === "old" ? "b-45" : "b-46",
      lastStatusChangeTime: n === "old" ? new Date(qt - 3 * vn).toISOString() : Wn(e.step.start),
      wave: { site: e.site ?? "default", environment: e.env, name: "kuberik-checkout-api-service", wave: e.wave ?? 1, role: e.wave === 1 || !e.site ? "Leader" : "Follower", leader: e.site ? "us-east-1" : "default", selectedRevision: a, members: s },
      conditions: [r("WaveReady", "Ready", "site may deploy the allowed versions"), r("LockstepConsistent", "Consistent", "all members agree on lockstep")]
    }
  };
}
function p_(e, t) {
  const n = Tn(e, t), a = n === "deploying" ? Math.min(2, Math.floor((t - e.step.start) / (e.step.check - e.step.start) * 2) + 1) : 2;
  return {
    apiVersion: "rollouts.kruise.io/v1alpha1",
    kind: "Rollout",
    metadata: { name: `checkout-api-canary-${e.site}`, namespace: e.ns, annotations: { "rollout-dashboard.kuberik.com/source-cluster": "prod" } },
    spec: { strategy: { canary: { steps: [{ replicas: "50%" }, { replicas: "100%" }] } } },
    status: { canaryStatus: { currentStepIndex: n === "old" || n === "done" ? 2 : a, currentStepState: n === "old" || n === "done" ? "Completed" : "StepInProgress" }, conditions: [] }
  };
}
const v_ = (e) => ({
  apiVersion: "kustomize.toolkit.fluxcd.io/v1",
  kind: "Kustomization",
  metadata: { name: `checkout-api-${e.site}`, namespace: e.ns, annotations: { "rollout.kuberik.com/substitute.CHECKOUT_API_VERSION.from": Ge, "rollout-dashboard.kuberik.com/source-cluster": "prod" } },
  spec: {},
  status: { conditions: [], inventory: { entries: [{ id: `${e.ns}_checkout-api-canary-${e.site}_rollouts.kruise.io_Rollout` }] } }
});
function h_(e, t) {
  return xa.map((n) => {
    const a = Tn(n, e), s = (r) => {
      const i = t === r && a !== "old", o = i ? "Unhealthy" : a === "deploying" ? "Pending" : "Healthy";
      return {
        apiVersion: "kuberik.com/v1alpha1",
        kind: "HealthCheck",
        metadata: { name: `${Ge}-${r}`, namespace: n.ns, labels: { app: Ge }, annotations: { "kuberik.com/display-name": r } },
        spec: { class: "prometheus-alert" },
        status: { status: o, message: i ? "4.2% of requests failed, over a 1% budget" : "No alerts firing", lastChangeTime: Wn(a === "old" ? -60 : n.step.start) }
      };
    };
    return { metadata: { namespace: n.ns, name: Ge, annotations: { "rollout-dashboard.kuberik.com/source-cluster": n.env } }, healthChecks: [s("error-rate"), s("latency-p99")] };
  });
}
const ts = "checkout-api", Vr = (e, t, n, a, s, r) => ({
  owner: "exampleco",
  repo: ts,
  kind: "pr",
  number: e,
  title: t,
  htmlUrl: `https://github.com/exampleco/${ts}/pull/${e}`,
  author: n,
  mergedAt: new Date(a).toISOString(),
  mergeCommitSha: s,
  headSha: s,
  base: "main",
  changedFiles: r,
  containedIn: [s],
  containedInAll: !1
});
function m_(e) {
  const t = {}, n = (i, o, l) => ({ sha: i, message: o, author: l, commitDate: new Date(qt - vn).toISOString() }), a = n(qe[45], "#108 Show saved cards first", "liam-foster"), s = n(qe[46], "#112 Add Apple Pay to checkout", "olivia-bennett"), r = n(qe[44], "#101 Fix tax rounding on refunds", "noah-carter");
  for (const i of xa) {
    const o = `/api/rollouts/${i.ns}/${Ge}/commits`;
    t[`${o}?base=${qe[44]}&head=${qe[45]}`] = { commits: [a], additions: 38, deletions: 11, changedFiles: 4 }, t[`${o}?base=&head=${qe[44]}`] = { commits: [r], additions: 21, deletions: 6, changedFiles: 2 }, t[`${o}?base=${qe[45]}&head=${qe[46]}`] = { commits: [s], additions: 142, deletions: 9, changedFiles: 6 };
  }
  return t[`/api/github/repos/exampleco/${ts}/commits/${qe[46]}`] = { subject: "#112 Add Apple Pay to checkout", author: "olivia-bennett" }, t[`/api/github/repos/exampleco/${ts}/commits/${qe[45]}`] = { subject: "#108 Show saved cards first", author: "liam-foster" }, t[`/api/github/repos/exampleco/${ts}/commits/${qe[44]}`] = { subject: "#101 Fix tax rounding on refunds", author: "noah-carter" }, t;
}
function g_(e) {
  const t = e >= ar, n = [
    Vr(101, "Fix tax rounding on refunds", "noah-carter", qt - 30 * vn, qe[44], 2),
    Vr(108, "Show saved cards first", "liam-foster", qt - 4 * vn, qe[45], 4),
    ...t ? [Vr(112, "Add Apple Pay to checkout", "olivia-bennett", nr(ar), qe[46], 6)] : []
  ], a = xa.filter((s) => s.env === "prod");
  return {
    rollouts: xa.map((s) => d_(s, e)),
    environments: xa.map((s) => f_(s, e)),
    rolloutDependencies: { items: [] },
    kustomizations: a.map(v_),
    kruiseRollouts: a.map((s) => p_(s, e)),
    changes: n,
    changesState: "ok",
    healthChecks: h_(e, null),
    github: { configured: !0, connected: !0, login: hl },
    me: hl,
    now: new Date(nr(e))
  };
}
Yd();
const b_ = {
  failed: "failed",
  "awaiting-approval": "held",
  "held-by-rule": "held",
  deploying: "deploying",
  checking: "checking"
}, gl = ["dev", "test", "staging", "other", "prod"];
function w_(e, t, n) {
  const a = e.app, s = e.newest, r = /* @__PURE__ */ new Map();
  for (const b of n) b.app === a && r.set(b.sha, Math.min(r.get(b.sha) ?? 1 / 0, b.t));
  const i = [...r.entries()].sort((b, g) => b[1] - g[1]).map(([b]) => b);
  s && !i.includes(s) && i.push(s);
  const o = s ? i.indexOf(s) : -1, l = (b) => {
    const g = b ? i.indexOf(b) : -1;
    return g < 0 || o < 0 ? 0 : Math.max(0, o - g);
  }, c = e.placeList.map((b) => {
    const g = b.tier === "prod" ? "prod" : b.tier === "dev" ? "dev" : b.tier === "test" ? "test" : "staging", h = b_[b.state] ?? (b.onNewest ? "newest" : l(b.version) > 0 ? "behind" : "newest"), x = cs(null, g);
    return {
      card: {
        ns: b.label,
        name: a,
        version: b.version,
        theme: x,
        envDisplay: b.label || g,
        href: b.href,
        heldCause: b.state === "awaiting-approval" ? "person" : void 0
      },
      tier: g,
      env: (g === "prod" ? b.label : pr(x) || b.label) || g,
      /* QA #11: an env-less place has a blank label; the tier names it, a box is never empty */
      state: h,
      behind: h === "behind" ? l(b.version) : 0
    };
  }), u = {};
  for (const b of c) (u[b.tier] ??= []).push(b);
  for (const b of gl) u[b]?.sort((g, h) => g.env.localeCompare(h.env));
  const f = u.prod ?? [], p = gl.filter((b) => b !== "prod").flatMap((b) => u[b] ?? []), v = c.reduce((b, g) => !b || tt.indexOf(g.state) < tt.indexOf(b.state) ? g : b, null), y = (t.apps.find((b) => b.app === a)?.envs ?? []).map((b) => b.arrivedAt).filter((b) => !!b).sort().at(-1) ?? null;
  return {
    lane: {
      app: a,
      byTier: u,
      stages: p,
      prod: f,
      state: v?.state ?? "none",
      lead: v
    },
    last: y
  };
}
const k_ = (e) => e < 8 ? "dev" : e < Zu ? "staging" : e < Qu ? "ask" : e < 24.5 ? "wave1" : e < 30 ? "wave2" : "done", Bn = [
  { key: "merged", label: "Merged", from: 2, to: 4.9, settled: 2.2 },
  { key: "dev", label: "Dev", from: 5, to: 7.9, settled: 7.7 },
  { key: "staging", label: "Staging", from: 8, to: 13.9, settled: 13.7 },
  { key: "approval", label: "Approval", from: 14, to: 19.3, settled: 16 },
  { key: "production", label: "Production", from: 19.4, to: 34.4, settled: 33 }
], Xu = 36, __ = (e) => Bn.findIndex((t) => e >= t.from && e <= t.to), y_ = 16;
function x_(e) {
  const t = s1("incident", e.tier, e.label).find((a) => a.app === Ge);
  if (t) return t;
  const n = er({ app: Ge, href: e.href, version: e.runs });
  return {
    key: `${Ge}@${e.env}`,
    app: Ge,
    tier: e.tier,
    where: e.place,
    regions: e.tier === "prod" ? [e.label] : [],
    state: e.state,
    group: "rest",
    glyph: "rest",
    word: "",
    change: null,
    version: e.runs,
    since: n.at,
    href: e.href,
    needsYou: !1,
    lead: !1,
    action: null,
    cause: null,
    pipeline: null,
    steps: Gi({ state: "healthy", pipeline: null }).map((a) => ({ ...a, state: "done" })),
    failure: null,
    place: e.place,
    deployedAt: n.at,
    regionsOf: null,
    stillChecking: !1
  };
}
function S_() {
  const t = Au("incident").R.groups.flatMap((a) => a.rows).filter((a) => a.app === Ge), n = n1(Ge, "incident").filter((a) => !t.some((s) => s.href === a.href || s.regions.includes(a.label) && s.tier === a.tier)).map(x_);
  return { rows: [...t, ...n], approval: t.find((a) => a.group === "approval") ?? null };
}
function C_(e) {
  const { rows: t, approval: n } = S_(), a = k_(e), s = (r) => t.find(r) ?? null;
  switch (a) {
    case "dev":
      return s((r) => r.tier === "dev");
    case "staging":
      return s((r) => r.tier === "staging");
    case "ask":
      return n ?? s((r) => r.tier === "prod");
    case "wave1":
      return s((r) => r.tier === "prod" && r.where === "us-east-1") ?? s((r) => r.tier === "prod");
    case "wave2":
      return s((r) => r.tier === "prod" && r.regions.length > 1 && r.group !== "held") ?? s((r) => r.tier === "prod" && r.group === "moving") ?? s((r) => r.tier === "prod");
    default:
      return s((r) => r.tier === "prod" && r.where === "us-east-1") ?? s((r) => r.tier === "prod");
  }
}
function A_(e) {
  const t = e.state === "awaiting-approval" || e.state === "held-by-rule", n = t ? ys(e) : null, a = er(e), s = t ? null : Jb(e), r = n ? { title: n.title ?? "", who: n.author } : a.title ? { title: a.title, who: a.author } : null;
  return { build: n?.build ?? a.build, pill: s ? { word: s.word, role: s.role } : null, commit: r, age: ma(n ? n.since : a.at) };
}
function T_() {
  const e = Au("incident"), t = e.items.find((n) => n.app === Ge);
  return t ? w_(t, e.R.c.m, e.R.c.events).lane : null;
}
const M_ = (e) => e.group === "approval" ? l1(e) : null, Ur = (e) => Ou(e, "incident"), bl = 0.15;
function E_(e) {
  const t = e < 17.5 || e >= 19.45 ? null : e < 18.3 ? "approve" : "confirm", n = e >= 18.1 && e < 18.1 + bl || e >= 19 && e < 19 + bl;
  return { target: t, visible: e >= 17.5 && e < 19.2, press: n, ask: e >= 18.2 && e < 19, done: e >= 19.05 && e < 25 };
}
var L_ = /* @__PURE__ */ W('<span class="svelte-19jcivb">Apps</span><span class="text-fg-disabled svelte-19jcivb" aria-hidden="true">/</span>', 1), N_ = /* @__PURE__ */ W('<!><span class="shrink-0 whitespace-nowrap svelte-19jcivb"> </span>', 1), R_ = /* @__PURE__ */ W('<span class="inline-flex shrink-0 items-center gap-2 whitespace-nowrap tabular-nums text-fg-subtle svelte-19jcivb"><!> </span>'), O_ = /* @__PURE__ */ W('<div class="t-meta flex min-w-0 items-center gap-x-3 text-fg-muted svelte-19jcivb" data-hero-commit=""><span class="flex min-w-0 items-center gap-2 svelte-19jcivb"><!> <!><span class="min-w-0 truncate text-fg-subtle max-sm:hidden svelte-19jcivb"> </span></span> <!></div>'), D_ = /* @__PURE__ */ W('<div class="min-w-0 svelte-19jcivb" data-hero-strip=""><!></div>'), F_ = /* @__PURE__ */ W('<header class="flex min-w-0 flex-col gap-3 px-4 pt-4 sm:px-6 sm:pt-5 svelte-19jcivb"><div class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 svelte-19jcivb"><!> <h1 class="t-title min-w-0 break-words text-fg svelte-19jcivb"> </h1> <span class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 max-sm:basis-full svelte-19jcivb"><span class="t-meta text-fg-disabled max-sm:hidden svelte-19jcivb" aria-hidden="true">/</span> <span class="t-code-lg shrink-0 text-fg svelte-19jcivb" data-hero-build=""> </span> <!></span></div> <!> <!></header> <div class="px-4 pb-4 pt-4 sm:px-6 sm:pb-6 svelte-19jcivb"><!></div>', 1), I_ = /* @__PURE__ */ W('<i class="hw-chip-fill svelte-19jcivb"></i>'), P_ = /* @__PURE__ */ W('<button type="button"><span class="hw-chip-dot svelte-19jcivb" aria-hidden="true"></span><span class="hw-chip-t svelte-19jcivb"> </span> <!></button>'), j_ = /* @__PURE__ */ ue('<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" class="svelte-19jcivb"><path d="M3.5 2h2.5v10H3.5zM8 2h2.5v10H8z" fill="currentColor" class="svelte-19jcivb"></path></svg>'), W_ = /* @__PURE__ */ ue('<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" class="svelte-19jcivb"><path d="M3.5 2l8 5-8 5z" fill="currentColor" class="svelte-19jcivb"></path></svg>'), B_ = /* @__PURE__ */ W('<button type="button" class="hw-play svelte-19jcivb"><!></button>'), z_ = /* @__PURE__ */ W('<div><div><div class="hw-bar t-ui-sm text-fg-muted svelte-19jcivb"><span class="hw-mark svelte-19jcivb" aria-hidden="true"></span> <!> <span class="text-fg svelte-19jcivb"> </span> <!></div> <div class="hw-body svelte-19jcivb" inert><!></div> <!> <span aria-hidden="true"><svg width="22" height="26" viewBox="0 0 22 26" class="svelte-19jcivb"><path d="M3 2l15 11.4-6.4 1.1 3.6 7.2-3.1 1.5-3.6-7.2L3 20z" fill="#121a20" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" class="svelte-19jcivb"></path></svg> <i class="hw-ring svelte-19jcivb"></i></span></div> <nav class="hw-chips t-label svelte-19jcivb" aria-label="Demo timeline"><!> <!></nav></div>');
function H_(e, t) {
  Se(t, !0);
  let n = /* @__PURE__ */ Ee(void 0), a = /* @__PURE__ */ Ee(1120);
  const s = /* @__PURE__ */ V(() => d(a) < 640), r = /* @__PURE__ */ V(() => d(a) < 560), i = /* @__PURE__ */ V(() => t.t >= 0 ? C_(t.t) : null), o = /* @__PURE__ */ V(() => d(i) ? A_(d(i)) : null), l = /* @__PURE__ */ V(() => t.t >= 0 ? T_() : null), c = /* @__PURE__ */ V(() => {
    const R = (d(i)?.href ?? "").split("/").filter(Boolean);
    return R[0] === "rollouts" ? { ns: R[2], name: R[3] } : null;
  }), u = /* @__PURE__ */ V(() => d(i) ? M_(d(i)) : null), f = (R) => R.card.href ?? "", p = /* @__PURE__ */ V(() => t.reduced ? {
    target: null,
    visible: !1,
    press: !1,
    ask: !1,
    done: !1
  } : E_(t.t));
  let v = /* @__PURE__ */ Ee(Pt({ x: 0, y: 0 })), y = /* @__PURE__ */ Ee(!1);
  function b(R) {
    const U = d(n)?.getBoundingClientRect(), Y = R?.getBoundingClientRect();
    return U && Y ? {
      top: Y.top - U.top,
      left: Y.left - U.left,
      right: Y.right - U.left,
      bottom: Y.bottom - U.top,
      w: Y.width,
      h: Y.height
    } : null;
  }
  Ln(() => {
    const { target: R, ask: U, visible: Y, done: J } = d(p);
    $t(() => {
      if (U && !ze.ask && d(i)) {
        const Q = Ur(d(i)), ee = b(d(n)?.querySelector("[data-approve-open]") ?? null);
        Q && ee && (ze.ask = {
          target: Q,
          anchor: { top: ee.top, left: ee.left, right: ee.right, bottom: ee.bottom }
        });
      }
      if (!U && ze.ask && (ze.ask = null), J && !ze.done && d(i)) {
        const Q = Ur(d(i)) ?? g;
        Q && (ze.done = { target: Q, error: null });
      }
      !J && ze.done && (ze.done = null);
    }), (async () => {
      await sc();
      const Q = R === "approve" ? d(n)?.querySelector("[data-approve-open]") : R === "confirm" ? d(n)?.querySelector('[data-action="approve-confirm"]') : null, ee = b(Q ?? null);
      Y && ee ? (me(v, { x: ee.left + ee.w * 0.62, y: ee.top + ee.h * 0.6 }, !0), me(y, !0)) : Y && !d(y) && d(n) && (me(
        v,
        {
          x: d(n).clientWidth - 60,
          y: d(n).clientHeight - 50
        },
        !0
      ), me(y, !0)), Y || me(y, !1);
    })();
  });
  let g = null;
  Ln(() => {
    d(i)?.group === "approval" && (g = Ur(d(i)));
  });
  const h = /* @__PURE__ */ V(() => __(t.t)), x = /* @__PURE__ */ V(() => d(h) < 0 ? 0 : Math.min(1, Math.max(0, (t.t - Bn[d(h)].from) / (Bn[d(h)].to - Bn[d(h)].from)))), m = /* @__PURE__ */ V(() => !t.reduced && t.t >= Xu - 0.5);
  var C = z_();
  let _;
  var A = N(C);
  let E;
  var S = N(A), w = I(N(S), 2);
  {
    var L = (R) => {
      var U = L_();
      M(R, U);
    };
    O(w, (R) => {
      d(s) || R(L);
    });
  }
  var k = I(w, 2), T = N(k), F = I(k, 2);
  vi(F, {
    get name() {
      return Pu;
    },
    get src() {
      return c_;
    },
    size: 20,
    class: "ml-auto"
  });
  var z = I(S, 2), j = N(z);
  {
    var D = (R) => {
      var U = F_(), Y = ne(U), J = N(Y), Q = N(J);
      {
        let Ie = /* @__PURE__ */ V(() => (d(s), 24));
        cw(Q, {
          get name() {
            return Ge;
          },
          get size() {
            return d(Ie);
          }
        });
      }
      var ee = I(Q, 2), ce = N(ee), de = I(ee, 2), Z = I(N(de), 2), pe = N(Z), he = I(Z, 2);
      {
        var ve = (Ie) => {
          {
            let B = /* @__PURE__ */ V(() => d(o).pill.word.toLowerCase());
            Li(Ie, {
              get role() {
                return d(o).pill.role;
              },
              get label() {
                return d(B);
              },
              class: "shrink-0"
            });
          }
        };
        O(he, (Ie) => {
          d(o).pill && Ie(ve);
        });
      }
      var Le = I(J, 2);
      {
        var He = (Ie) => {
          var B = O_(), oe = N(B), fe = N(oe);
          {
            var Qe = (bt) => {
              var Mt = N_(), It = ne(Mt);
              {
                let ta = /* @__PURE__ */ V(() => Su(d(o).commit.who));
                vi(It, {
                  get name() {
                    return d(o).commit.who;
                  },
                  get src() {
                    return d(ta);
                  },
                  size: 16,
                  class: "shrink-0"
                });
              }
              var Oe = I(It), ea = N(Oe);
              P(() => K(ea, d(o).commit.who)), M(bt, Mt);
            };
            O(fe, (bt) => {
              d(o).commit.who && bt(Qe);
            });
          }
          var Wt = I(fe, 2);
          Ip(Wt, {
            class: "h-3.5 w-3.5 shrink-0 text-fg-disabled max-sm:hidden",
            "aria-hidden": "true"
          });
          var Dn = I(Wt), bn = N(Dn), Ze = I(oe, 2);
          {
            var Xe = (bt) => {
              var Mt = R_(), It = N(Mt);
              Cp(It, { class: "h-3.5 w-3.5 shrink-0", "aria-hidden": "true" });
              var Oe = I(It);
              P(() => K(Oe, `${d(o).age ?? ""} ago`)), M(bt, Mt);
            };
            O(Ze, (bt) => {
              d(o).age && bt(Xe);
            });
          }
          P(() => K(bn, d(o).commit.title)), M(Ie, B);
        };
        O(Le, (Ie) => {
          d(o).commit && Ie(He);
        });
      }
      var _e = I(Le, 2);
      {
        var $e = (Ie) => {
          var B = D_(), oe = N(B);
          {
            let fe = /* @__PURE__ */ V(() => !!d(i).needsYou);
            Gw(oe, {
              get lane() {
                return d(l);
              },
              showApp: !1,
              words: !0,
              get yours() {
                return d(fe);
              },
              mutedRest: !0,
              hrefFor: f,
              get current() {
                return d(c);
              },
              youAreHere: !0
            });
          }
          M(Ie, B);
        };
        O(_e, (Ie) => {
          d(l) && Ie($e);
        });
      }
      var Be = I(Y, 2), gt = N(Be);
      Vk(gt, {
        get row() {
          return d(i);
        },
        nested: !0,
        get compact() {
          return d(r);
        },
        get action() {
          return d(u);
        }
      }), P(() => {
        K(ce, Ge), K(pe, d(o).build);
      }), M(R, U);
    };
    O(j, (R) => {
      d(i) && d(o) && R(D);
    });
  }
  var H = I(z, 2);
  l_(H, {});
  var te = I(H, 2);
  let ae;
  var se = I(A, 2), G = N(se);
  At(G, 19, () => Bn, (R) => R.key, (R, U, Y) => {
    var J = P_();
    let Q;
    J.__click = () => t.onseek(d(Y));
    var ee = I(N(J)), ce = N(ee), de = I(ee, 2);
    {
      var Z = (pe) => {
        var he = I_();
        P(() => rt(he, `transform: scaleX(${d(x) ?? ""})`)), M(pe, he);
      };
      O(de, (pe) => {
        d(h) === d(Y) && !t.reduced && pe(Z);
      });
    }
    P(() => {
      Q = ie(J, 1, "hw-chip svelte-19jcivb", null, Q, { "hw-chip-on": d(h) === d(Y) }), $(J, "aria-current", d(h) === d(Y) ? "step" : void 0), $(J, "aria-label", `Demo: seek to ${d(U).label}`), K(ce, d(U).label);
    }), M(R, J);
  });
  var X = I(G, 2);
  {
    var re = (R) => {
      var U = B_();
      U.__click = function(...ee) {
        t.ontoggle?.apply(this, ee);
      };
      var Y = N(U);
      {
        var J = (ee) => {
          var ce = j_();
          M(ee, ce);
        }, Q = (ee) => {
          var ce = W_();
          M(ee, ce);
        };
        O(Y, (ee) => {
          t.playing ? ee(J) : ee(Q, !1);
        });
      }
      P(() => {
        $(U, "aria-label", t.playing ? "Pause demo" : "Play demo"), $(U, "aria-pressed", !t.playing);
      }), M(R, U);
    };
    O(X, (R) => {
      t.reduced || R(re);
    });
  }
  An(C, (R) => me(n, R), () => d(n)), P(() => {
    _ = ie(C, 1, "hw svelte-19jcivb", null, _, { "hw-narrow": d(s) }), E = ie(A, 1, "hw-frame svelte-19jcivb", null, E, { "hw-fade": d(m) }), K(T, Ge), ae = ie(te, 1, "hw-ptr svelte-19jcivb", null, ae, {
      "hw-ptr-on": d(y) && d(p).visible,
      "hw-ptr-press": d(p).press
    }), rt(te, `transform: translate(${d(v).x ?? ""}px, ${d(v).y ?? ""}px)`);
  }), Yf(C, "clientWidth", (R) => me(a, R)), M(e, C), Ce();
}
Ba(["click"]);
class V_ {
  constructor(t) {
    this.g = { onscreen: !1, visible: !0, motion: !0, user: !0 }, this.t = 0, this.last = 0, this.timer = null, this.shown = NaN, this.step = () => {
      if (this.timer = null, !this.playing) return;
      const n = this.o.now();
      this.t = (this.t + (n - this.last) / 1e3) % this.o.loop, this.last = n, this.emit(), this.schedule();
    }, this.o = { quantum: 0.125, now: () => performance.now(), setTimer: (n, a) => setTimeout(n, a), clearTimer: (n) => clearTimeout(n), ...t }, this.emit();
  }
  get time() {
    return this.t;
  }
  get playing() {
    return this.g.onscreen && this.g.visible && this.g.motion && this.g.user;
  }
  get paused() {
    return !this.g.user;
  }
  get reduced() {
    return !this.g.motion;
  }
  /** open or close one gate; 'onscreen' opening restarts the story, 'motion' closing parks it on the rest frame */
  gate(t, n) {
    const a = this.playing, s = this.g[t];
    this.g[t] = n, t === "motion" && (n ? this.jump(0) : this.jump(this.o.rest)), t === "onscreen" && n && !s && this.g.motion && this.jump(0), this.sync(a);
  }
  toggle() {
    const t = this.playing;
    this.g.user = !this.g.user, this.sync(t);
  }
  /** a chip: jump to second `s`; playing resumes unless motion is reduced */
  seek(t) {
    const n = this.playing;
    this.g.motion && (this.g.user = !0), this.jump(t), this.sync(n);
  }
  destroy() {
    this.stop();
  }
  jump(t) {
    this.t = (t % this.o.loop + this.o.loop) % this.o.loop, this.last = this.o.now(), this.emit();
  }
  sync(t) {
    this.playing && !t ? (this.last = this.o.now(), this.schedule()) : this.playing ? this.timer == null && this.schedule() : this.stop();
  }
  stop() {
    this.timer != null && this.o.clearTimer(this.timer), this.timer = null;
  }
  schedule() {
    this.stop(), this.timer = this.o.setTimer(this.step, this.o.quantum * 1e3);
  }
  emit() {
    const t = Math.floor(this.t / this.o.quantum + 1e-6) * this.o.quantum;
    t !== this.shown && (this.shown = t, this.o.onTime(+t.toFixed(3)));
  }
}
function U_({ wrap: e, onGate: t }) {
  const n = Gu({ t: 0, playing: !1, reduced: !1, onseek: (i) => {
  }, ontoggle: () => {
  } });
  let a = NaN;
  const s = (i) => {
    i !== a && (tb(g_(i)), si.set(m_()), a = i, n.t = i, r && (n.playing = r.playing, n.reduced = r.reduced));
  };
  let r;
  return r = new V_({ loop: Xu, rest: y_, onTime: s }), s(0), n.onseek = (i) => {
    r.seek(r.reduced ? Bn[i].settled : Bn[i].from), n.playing = r.playing;
  }, n.ontoggle = () => {
    r.toggle(), n.playing = r.playing;
  }, uc(H_, { target: e, props: n }), t((i, o) => {
    r.gate(i, o), n.playing = r.playing, n.reduced = r.reduced, i === "motion" && !o && (ze.ask = null);
  }), () => r.destroy();
}
const Ju = {
  hero: { custom: U_ },
  "rollouts-list": { component: q1, initial: G1, beats: Vu, representative: K1, restMs: 3200 }
};
class q_ {
  // ms into the cycle when paused/at startedAt
  constructor(t) {
    if (this.gates = { onscreen: !1, visible: !0, motion: !0 }, this.idx = -1, this.timer = null, this.startedAt = 0, this.pos = 0, this.tick = () => {
      this.timer = null;
      const { beats: n } = this.o, a = (this.pos + (this.o.now() - this.startedAt)) % this.cycleMs;
      let s = -1;
      for (let i = 0; i < n.length; i++) n[i].at <= a && (s = i);
      s !== this.idx && this.show(s);
      const r = s + 1 < n.length ? n[s + 1].at : this.cycleMs;
      this.timer = this.o.setTimer(this.tick, Math.max(16, r - a));
    }, !t.beats.length) throw new Error("Timeline needs at least one beat");
    this.o = {
      restMs: 2400,
      setTimer: (n, a) => setTimeout(n, a),
      clearTimer: (n) => clearTimeout(n),
      now: () => performance.now(),
      ...t,
      representative: t.representative ?? t.beats.length - 1
    };
  }
  get cycleMs() {
    return this.o.beats[this.o.beats.length - 1].at + this.o.restMs;
  }
  get playing() {
    return this.gates.onscreen && this.gates.visible && this.gates.motion;
  }
  get index() {
    return this.idx;
  }
  /** feed one gate: 'onscreen' (IntersectionObserver), 'visible' (document.visibilityState), 'motion' (!prefers-reduced-motion) */
  setGate(t, n) {
    const a = this.playing;
    this.gates[t] = n, t === "motion" && !n && this.show(this.o.representative), t === "motion" && n && this.idx < 0 && this.show(0), a !== this.playing && (this.playing ? this.run() : this.freeze());
  }
  /** reduced-motion control: step to the next beat (wraps) */
  next() {
    this.show((this.idx + 1) % this.o.beats.length);
  }
  /** jump to a beat without touching the clock */
  show(t) {
    this.idx = t, this.o.apply(this.o.beats[t].state, t);
  }
  destroy() {
    this.freeze();
  }
  run() {
    this.startedAt = this.o.now(), this.tick();
  }
  freeze() {
    this.timer != null && (this.o.clearTimer(this.timer), this.timer = null), this.pos = (this.pos + (this.o.now() - this.startedAt)) % this.cycleMs;
  }
}
const ed = new URL(".", import.meta.url);
function G_() {
  if (document.getElementById("kuberik-islands-fonts")) return;
  const e = (n) => new URL(`fonts/${n}`, ed).href, t = document.createElement("style");
  t.id = "kuberik-islands-fonts", t.textContent = `
@font-face{font-family:'Kuberik Inter';font-style:normal;font-display:swap;font-weight:100 900;src:url('${e("inter-latin-opsz.woff2")}') format('woff2-variations');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'Kuberik Inter';font-style:normal;font-display:swap;font-weight:100 900;src:url('${e("inter-latin-ext-opsz.woff2")}') format('woff2-variations');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:'Kuberik JetBrains Mono';font-style:normal;font-display:swap;font-weight:100 800;src:url('${e("jetbrains-mono-latin.woff2")}') format('woff2-variations')}`, document.head.appendChild(t);
}
let K_ = null;
const Y_ = () => K_ ??= fetch(new URL("islands.css", ed), { cache: "no-cache" }).then((e) => e.text()).then((e) => {
  const t = new CSSStyleSheet();
  return t.replaceSync(e), t;
}), $_ = () => document.documentElement.classList.contains("dark"), Fn = matchMedia("(prefers-reduced-motion: reduce)");
async function Q_(e) {
  const t = e.dataset.island, n = Ju[t];
  if (!n) {
    console.warn(`island "${t}" is not registered`);
    return;
  }
  const a = e.shadowRoot ?? e.attachShadow({ mode: "open" });
  a.adoptedStyleSheets = [await Y_()];
  const s = document.createElement("div");
  if (s.className = "k-island", a.appendChild(s), e.hasAttribute("data-theme-sync")) {
    const c = () => s.classList.toggle("dark", $_());
    c(), new MutationObserver(c).observe(document.documentElement, { attributes: !0, attributeFilter: ["class"] });
  }
  if ("custom" in n) {
    const c = [], u = (f, p) => c.forEach((v) => v(f, p));
    n.custom({ wrap: s, host: e, onGate: (f) => c.push(f) }), u("motion", !Fn.matches), u("visible", document.visibilityState === "visible"), Fn.addEventListener("change", () => u("motion", !Fn.matches)), document.addEventListener("visibilitychange", () => u("visible", document.visibilityState === "visible")), new IntersectionObserver((f) => u("onscreen", f[f.length - 1].isIntersecting), { threshold: 0.25 }).observe(e);
    return;
  }
  const r = Gu(n.initial);
  uc(n.component, { target: s, props: r });
  const i = new q_({ beats: n.beats, restMs: n.restMs, representative: n.representative, apply: (c) => Object.assign(r, c) });
  i.setGate("motion", !Fn.matches), Fn.addEventListener("change", () => {
    i.setGate("motion", !Fn.matches), l();
  }), new IntersectionObserver((c) => i.setGate("onscreen", c[c.length - 1].isIntersecting), { rootMargin: "80px" }).observe(e), document.addEventListener("visibilitychange", () => i.setGate("visible", document.visibilityState === "visible"));
  let o = null;
  function l() {
    o?.remove(), o = null, Fn.matches && (o = document.createElement("div"), o.className = "k-island-ctl", o.innerHTML = '<button class="btn btn-secondary" type="button">Next step</button>', o.querySelector("button").addEventListener("click", () => i.next()), a.appendChild(o));
  }
  l(), e.__timeline = i;
}
function hi(e = document) {
  G_(), e.querySelectorAll("[data-island]:not([data-island-mounted])").forEach((t) => {
    t.setAttribute("data-island-mounted", ""), Q_(t);
  });
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => hi()) : hi();
window.kuberikIslands = { mountAll: hi, registry: Ju };
export {
  hi as mountAll
};
