var bi = Array.isArray, ud = Array.prototype.indexOf, is = Array.from, kl = Object.defineProperty, ma = Object.getOwnPropertyDescriptor, dd = Object.getOwnPropertyDescriptors, fd = Object.prototype, pd = Array.prototype, _l = Object.getPrototypeOf, to = Object.isExtensible;
function vd(e) {
  return typeof e == "function";
}
const ht = () => {
};
function hd(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function yl() {
  var e, t, n = new Promise((a, r) => {
    e = a, t = r;
  });
  return { promise: n, resolve: e, reject: t };
}
const rt = 2, wi = 4, ki = 8, xl = 1 << 24, Xt = 16, gn = 32, Xn = 64, os = 128, Wt = 512, it = 1024, At = 2048, qt = 4096, St = 8192, un = 16384, ls = 32768, Gt = 65536, no = 1 << 17, Sl = 1 << 18, Da = 1 << 19, md = 1 << 20, cn = 1 << 25, Kn = 32768, Gs = 1 << 21, _i = 1 << 22, Mn = 1 << 23, zn = Symbol("$state"), gd = Symbol("legacy props"), bd = Symbol(""), da = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
function Cl(e) {
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
const Ed = 1, Ld = 2, Al = 4, Nd = 8, Rd = 16, Od = 1, Dd = 2, Fd = 4, Id = 8, Pd = 16, jd = 1, Wd = 2, Bd = 4, zd = 1, Hd = 2, tt = Symbol(), Vd = "http://www.w3.org/1999/xhtml", Ud = "http://www.w3.org/2000/svg", qd = "@attach";
function Gd() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Kd() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
function Tl(e) {
  return e === this.v;
}
function Ml(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function El(e) {
  return !Ml(e, this.v);
}
let Fa = !1;
function Yd() {
  Fa = !0;
}
let Be = null;
function xa(e) {
  Be = e;
}
function gt(e) {
  return (
    /** @type {T} */
    $d().get(e)
  );
}
function Se(e, t = !1, n) {
  Be = {
    p: Be,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    l: Fa && !t ? { s: null, u: null, $: [] } : null
  };
}
function Ce(e) {
  var t = (
    /** @type {ComponentContext} */
    Be
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var a of n)
      ql(a);
  }
  return t.i = !0, Be = t.p, /** @type {T} */
  {};
}
function vr() {
  return !Fa || Be !== null && Be.l === null;
}
function $d(e) {
  return Be === null && Cl(), Be.c ??= new Map(Qd(Be) || void 0);
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
function Ll() {
  var e = Pn;
  Pn = [], hd(e);
}
function On(e) {
  if (Pn.length === 0 && !$a) {
    var t = Pn;
    queueMicrotask(() => {
      t === Pn && Ll();
    });
  }
  Pn.push(e);
}
function Zd() {
  for (; Pn.length > 0; )
    Ll();
}
function Nl(e) {
  var t = xe;
  if (t === null)
    return ye.f |= Mn, e;
  if ((t.f & ls) === 0) {
    if ((t.f & os) === 0)
      throw e;
    t.b.error(e);
  } else
    Sa(e, t);
}
function Sa(e, t) {
  for (; t !== null; ) {
    if ((t.f & os) !== 0)
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
const Ar = /* @__PURE__ */ new Set();
let Pe = null, It = null, Ft = [], cs = null, Ks = !1, $a = !1;
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
  #s = null;
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Set<Effect>}
   */
  #r = /* @__PURE__ */ new Set();
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
    Ft = [], this.apply();
    var n = {
      parent: null,
      effect: null,
      effects: [],
      render_effects: []
    };
    for (const a of t)
      this.#o(a, n);
    this.is_fork || this.#u(), this.is_deferred() ? (this.#l(n.effects), this.#l(n.render_effects)) : (Pe = null, ao(n.render_effects), ao(n.effects), this.#s?.resolve()), It = null;
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {EffectTarget} target
   */
  #o(t, n) {
    t.f ^= it;
    for (var a = t.first; a !== null; ) {
      var r = a.f, s = (r & (gn | Xn)) !== 0, i = s && (r & it) !== 0, o = i || (r & St) !== 0 || this.skipped_effects.has(a);
      if ((a.f & os) !== 0 && a.b?.is_pending() && (n = {
        parent: n,
        effect: a,
        effects: [],
        render_effects: []
      }), !o && a.fn !== null) {
        s ? a.f ^= it : (r & wi) !== 0 ? n.effects.push(a) : gr(a) && ((a.f & Xt) !== 0 && this.#r.add(a), rr(a));
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
      (n.f & At) !== 0 ? this.#r.add(n) : (n.f & qt) !== 0 && this.#i.add(n), this.#c(n.deps), lt(n, it);
  }
  /**
   * @param {Value[] | null} deps
   */
  #c(t) {
    if (t !== null)
      for (const n of t)
        (n.f & rt) === 0 || (n.f & Kn) === 0 || (n.f ^= Kn, this.#c(
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
    this.previous.has(t) || this.previous.set(t, n), (t.f & Mn) === 0 && (this.current.set(t, t.v), It?.set(t, t.v));
  }
  activate() {
    Pe = this, this.apply();
  }
  deactivate() {
    Pe === this && (Pe = null, It = null);
  }
  flush() {
    if (this.activate(), Ft.length > 0) {
      if (Rl(), Pe !== null && Pe !== this)
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
    if (Ar.size > 1) {
      this.previous.clear();
      var t = It, n = !0, a = {
        parent: null,
        effect: null,
        effects: [],
        render_effects: []
      };
      for (const s of Ar) {
        if (s === this) {
          n = !1;
          continue;
        }
        const i = [];
        for (const [l, c] of this.current) {
          if (s.current.has(l))
            if (n && c !== s.current.get(l))
              s.current.set(l, c);
            else
              continue;
          i.push(l);
        }
        if (i.length === 0)
          continue;
        const o = [...s.current.keys()].filter((l) => !this.current.has(l));
        if (o.length > 0) {
          var r = Ft;
          Ft = [];
          const l = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Map();
          for (const u of i)
            Ol(u, o, l, c);
          if (Ft.length > 0) {
            Pe = s, s.apply();
            for (const u of Ft)
              s.#o(u, a);
            s.deactivate();
          }
          Ft = r;
        }
      }
      Pe = null, It = t;
    }
    this.committed = !0, Ar.delete(this);
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
    for (const t of this.#r)
      this.#i.delete(t), lt(t, At), Yn(t);
    for (const t of this.#i)
      lt(t, qt), Yn(t);
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
    return (this.#s ??= yl()).promise;
  }
  static ensure() {
    if (Pe === null) {
      const t = Pe = new Ht();
      Ar.add(Pe), $a || Ht.enqueue(() => {
        Pe === t && t.flush();
      });
    }
    return Pe;
  }
  /** @param {() => void} task */
  static enqueue(t) {
    On(t);
  }
  apply() {
  }
}
function Xd(e) {
  var t = $a;
  $a = !0;
  try {
    for (var n; ; ) {
      if (Zd(), Ft.length === 0 && (Pe?.flush(), Ft.length === 0))
        return cs = null, /** @type {T} */
        n;
      Rl();
    }
  } finally {
    $a = t;
  }
}
function Rl() {
  var e = Vn;
  Ks = !0;
  var t = null;
  try {
    var n = 0;
    for (Vr(!0); Ft.length > 0; ) {
      var a = Ht.ensure();
      if (n++ > 1e3) {
        var r, s;
        Jd();
      }
      a.process(Ft), En.clear();
    }
  } finally {
    Ks = !1, Vr(e), cs = null;
  }
}
function Jd() {
  try {
    xd();
  } catch (e) {
    Sa(e, cs);
  }
}
let rn = null;
function ao(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var a = e[n++];
      if ((a.f & (un | St)) === 0 && gr(a) && (rn = /* @__PURE__ */ new Set(), rr(a), a.deps === null && a.first === null && a.nodes === null && (a.teardown === null && a.ac === null ? Ql(a) : a.fn = null), rn?.size > 0)) {
        En.clear();
        for (const r of rn) {
          if ((r.f & (un | St)) !== 0) continue;
          const s = [r];
          let i = r.parent;
          for (; i !== null; )
            rn.has(i) && (rn.delete(i), s.push(i)), i = i.parent;
          for (let o = s.length - 1; o >= 0; o--) {
            const l = s[o];
            (l.f & (un | St)) === 0 && rr(l);
          }
        }
        rn.clear();
      }
    }
    rn = null;
  }
}
function Ol(e, t, n, a) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const r of e.reactions) {
      const s = r.f;
      (s & rt) !== 0 ? Ol(
        /** @type {Derived} */
        r,
        t,
        n,
        a
      ) : (s & (_i | Xt)) !== 0 && (s & At) === 0 && Dl(r, t, a) && (lt(r, At), Yn(
        /** @type {Effect} */
        r
      ));
    }
}
function Dl(e, t, n) {
  const a = n.get(e);
  if (a !== void 0) return a;
  if (e.deps !== null)
    for (const r of e.deps) {
      if (t.includes(r))
        return !0;
      if ((r.f & rt) !== 0 && Dl(
        /** @type {Derived} */
        r,
        t,
        n
      ))
        return n.set(
          /** @type {Derived} */
          r,
          !0
        ), !0;
    }
  return n.set(e, !1), !1;
}
function Yn(e) {
  for (var t = cs = e; t.parent !== null; ) {
    t = t.parent;
    var n = t.f;
    if (Ks && t === xe && (n & Xt) !== 0 && (n & Sl) === 0)
      return;
    if ((n & (Xn | gn)) !== 0) {
      if ((n & it) === 0) return;
      t.f ^= it;
    }
  }
  Ft.push(t);
}
function ef(e) {
  let t = 0, n = Rn(0), a;
  return () => {
    nr() && (d(n), Gl(() => (t === 0 && (a = Yt(() => e(() => zt(n)))), t += 1, () => {
      On(() => {
        t -= 1, t === 0 && (a?.(), a = void 0, zt(n));
      });
    })));
  };
}
var tf = Gt | Da | os;
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
  #s;
  /** @type {Effect} */
  #r;
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
    this.#t = t, this.#a = n, this.#s = a, this.parent = /** @type {Effect} */
    xe.b, this.#e = !!this.#a.pending, this.#r = ja(() => {
      xe.b = this;
      {
        var r = this.#g();
        try {
          this.#i = pt(() => a(r));
        } catch (s) {
          this.error(s);
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
      this.#i = pt(() => this.#s(this.#t));
    } catch (t) {
      this.error(t);
    }
    this.#e = !1;
  }
  #_() {
    const t = this.#a.pending;
    t && (this.#o = pt(() => t(this.#t)), Ht.enqueue(() => {
      var n = this.#g();
      this.#i = this.#h(() => (Ht.ensure(), pt(() => this.#s(n)))), this.#f > 0 ? this.#m() : (Hn(
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
    return this.#e && (this.#u = dn(), this.#t.before(this.#u), t = this.#u), t;
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
    var n = xe, a = ye, r = Be;
    Kt(this.#r), mt(this.#r), xa(this.#r.ctx);
    try {
      return t();
    } catch (s) {
      return Nl(s), null;
    } finally {
      Kt(n), mt(a), xa(r);
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
    ), Jl(this.#i, this.#c)), this.#o === null && (this.#o = pt(() => t(this.#t)));
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
    this.#b(t), this.#d += t, this.#p && Ca(this.#p, this.#d);
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
    this.#i && (at(this.#i), this.#i = null), this.#o && (at(this.#o), this.#o = null), this.#l && (at(this.#l), this.#l = null);
    var r = !1, s = !1;
    const i = () => {
      if (r) {
        Kd();
        return;
      }
      r = !0, s && Md(), Ht.ensure(), this.#d = 0, this.#l !== null && Hn(this.#l, () => {
        this.#l = null;
      }), this.#e = this.has_pending_snippet(), this.#i = this.#h(() => (this.#v = !1, pt(() => this.#s(this.#t)))), this.#f > 0 ? this.#m() : this.#e = !1;
    };
    var o = ye;
    try {
      mt(null), s = !0, n?.(t, i), s = !1;
    } catch (l) {
      Sa(l, this.#r && this.#r.parent);
    } finally {
      mt(o);
    }
    a && On(() => {
      this.#l = this.#h(() => {
        Ht.ensure(), this.#v = !0;
        try {
          return pt(() => {
            a(
              this.#t,
              () => t,
              () => i
            );
          });
        } catch (l) {
          return Sa(
            l,
            /** @type {Effect} */
            this.#r.parent
          ), null;
        } finally {
          this.#v = !1;
        }
      });
    });
  }
}
function Fl(e, t, n, a) {
  const r = vr() ? us : yi;
  if (n.length === 0 && e.length === 0) {
    a(t.map(r));
    return;
  }
  var s = Pe, i = (
    /** @type {Effect} */
    xe
  ), o = rf();
  function l() {
    Promise.all(n.map((c) => /* @__PURE__ */ sf(c))).then((c) => {
      o();
      try {
        a([...t.map(r), ...c]);
      } catch (u) {
        (i.f & un) === 0 && Sa(u, i);
      }
      s?.deactivate(), Hr();
    }).catch((c) => {
      Sa(c, i);
    });
  }
  e.length > 0 ? Promise.all(e).then(() => {
    o();
    try {
      return l();
    } finally {
      s?.deactivate(), Hr();
    }
  }) : l();
}
function rf() {
  var e = xe, t = ye, n = Be, a = Pe;
  return function(s = !0) {
    Kt(e), mt(t), xa(n), s && a?.activate();
  };
}
function Hr() {
  Kt(null), mt(null), xa(null);
}
// @__NO_SIDE_EFFECTS__
function us(e) {
  var t = rt | At, n = ye !== null && (ye.f & rt) !== 0 ? (
    /** @type {Derived} */
    ye
  ) : null;
  return xe !== null && (xe.f |= Da), {
    ctx: Be,
    deps: null,
    effects: null,
    equals: Tl,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      tt
    ),
    wv: 0,
    parent: n ?? xe,
    ac: null
  };
}
// @__NO_SIDE_EFFECTS__
function sf(e, t) {
  let n = (
    /** @type {Effect | null} */
    xe
  );
  n === null && wd();
  var a = (
    /** @type {Boundary} */
    n.b
  ), r = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), s = Rn(
    /** @type {V} */
    tt
  ), i = !ye, o = /* @__PURE__ */ new Map();
  return bf(() => {
    var l = yl();
    r = l.promise;
    try {
      Promise.resolve(e()).then(l.resolve, l.reject).then(() => {
        c === Pe && c.committed && c.deactivate(), Hr();
      });
    } catch (p) {
      l.reject(p), Hr();
    }
    var c = (
      /** @type {Batch} */
      Pe
    );
    if (i) {
      var u = !a.is_pending();
      a.update_pending_count(1), c.increment(u), o.get(c)?.reject(da), o.delete(c), o.set(c, l);
    }
    const f = (p, v = void 0) => {
      if (c.activate(), v)
        v !== da && (s.f |= Mn, Ca(s, v));
      else {
        (s.f & Mn) !== 0 && (s.f ^= Mn), Ca(s, p);
        for (const [y, b] of o) {
          if (o.delete(y), y === c) break;
          b.reject(da);
        }
      }
      i && (a.update_pending_count(-1), c.decrement(u));
    };
    l.promise.then(f, (p) => f(null, p || "unknown"));
  }), Pa(() => {
    for (const l of o.values())
      l.reject(da);
  }), new Promise((l) => {
    function c(u) {
      function f() {
        u === r ? l(s) : c(r);
      }
      u.then(f, f);
    }
    c(r);
  });
}
// @__NO_SIDE_EFFECTS__
function V(e) {
  const t = /* @__PURE__ */ us(e);
  return ec(t), t;
}
// @__NO_SIDE_EFFECTS__
function yi(e) {
  const t = /* @__PURE__ */ us(e);
  return t.equals = El, t;
}
function Il(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      at(
        /** @type {Effect} */
        t[n]
      );
  }
}
function of(e) {
  for (var t = e.parent; t !== null; ) {
    if ((t.f & rt) === 0)
      return (t.f & un) === 0 ? (
        /** @type {Effect} */
        t
      ) : null;
    t = t.parent;
  }
  return null;
}
function xi(e) {
  var t, n = xe;
  Kt(of(e));
  try {
    e.f &= ~Kn, Il(e), t = rc(e);
  } finally {
    Kt(n);
  }
  return t;
}
function Pl(e) {
  var t = xi(e);
  if (e.equals(t) || (Pe?.is_fork || (e.v = t), e.wv = nc()), !Jn)
    if (It !== null)
      (nr() || Pe?.is_fork) && It.set(e, t);
    else {
      var n = (e.f & Wt) === 0 ? qt : it;
      lt(e, n);
    }
}
let Ys = /* @__PURE__ */ new Set();
const En = /* @__PURE__ */ new Map();
let jl = !1;
function Rn(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: Tl,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function Ee(e, t) {
  const n = Rn(e);
  return ec(n), n;
}
// @__NO_SIDE_EFFECTS__
function Wl(e, t = !1, n = !0) {
  const a = Rn(e);
  return t || (a.equals = El), Fa && n && Be !== null && Be.l !== null && (Be.l.s ??= []).push(a), a;
}
function he(e, t, n = !1) {
  ye !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!Vt || (ye.f & no) !== 0) && vr() && (ye.f & (rt | Xt | _i | no)) !== 0 && !fn?.includes(e) && Td();
  let a = n ? jt(t) : t;
  return Ca(e, a);
}
function Ca(e, t) {
  if (!e.equals(t)) {
    var n = e.v;
    Jn ? En.set(e, t) : En.set(e, n), e.v = t;
    var a = Ht.ensure();
    a.capture(e, n), (e.f & rt) !== 0 && ((e.f & At) !== 0 && xi(
      /** @type {Derived} */
      e
    ), lt(e, (e.f & Wt) !== 0 ? it : qt)), e.wv = nc(), Bl(e, At), vr() && xe !== null && (xe.f & it) !== 0 && (xe.f & (gn | Xn)) === 0 && (Ot === null ? _f([e]) : Ot.push(e)), !a.is_fork && Ys.size > 0 && !jl && lf();
  }
  return t;
}
function lf() {
  jl = !1;
  var e = Vn;
  Vr(!0);
  const t = Array.from(Ys);
  try {
    for (const n of t)
      (n.f & it) !== 0 && lt(n, qt), gr(n) && rr(n);
  } finally {
    Vr(e);
  }
  Ys.clear();
}
function cf(e, t = 1) {
  var n = d(e), a = t === 1 ? n++ : n--;
  return he(e, n), a;
}
function zt(e) {
  he(e, e.v + 1);
}
function Bl(e, t) {
  var n = e.reactions;
  if (n !== null)
    for (var a = vr(), r = n.length, s = 0; s < r; s++) {
      var i = n[s], o = i.f;
      if (!(!a && i === xe)) {
        var l = (o & At) === 0;
        if (l && lt(i, t), (o & rt) !== 0) {
          var c = (
            /** @type {Derived} */
            i
          );
          It?.delete(c), (o & Kn) === 0 && (o & Wt && (i.f |= Kn), Bl(c, qt));
        } else l && ((o & Xt) !== 0 && rn !== null && rn.add(
          /** @type {Effect} */
          i
        ), Yn(
          /** @type {Effect} */
          i
        ));
      }
    }
}
function jt(e) {
  if (typeof e != "object" || e === null || zn in e)
    return e;
  const t = _l(e);
  if (t !== fd && t !== pd)
    return e;
  var n = /* @__PURE__ */ new Map(), a = bi(e), r = /* @__PURE__ */ Ee(0), s = pn, i = (o) => {
    if (pn === s)
      return o();
    var l = ye, c = pn;
    mt(null), io(s);
    var u = o();
    return mt(l), io(c), u;
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
        }) : he(u, c.value, !0), !0;
      },
      deleteProperty(o, l) {
        var c = n.get(l);
        if (c === void 0) {
          if (l in o) {
            const u = i(() => /* @__PURE__ */ Ee(tt));
            n.set(l, u), zt(r);
          }
        } else
          he(c, tt), zt(r);
        return !0;
      },
      get(o, l, c) {
        if (l === zn)
          return e;
        var u = n.get(l), f = l in o;
        if (u === void 0 && (!f || ma(o, l)?.writable) && (u = i(() => {
          var v = jt(f ? o[l] : tt), y = /* @__PURE__ */ Ee(v);
          return y;
        }), n.set(l, u)), u !== void 0) {
          var p = d(u);
          return p === tt ? void 0 : p;
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
          if (f !== void 0 && p !== tt)
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
        var c = n.get(l), u = c !== void 0 && c.v !== tt || Reflect.has(o, l);
        if (c !== void 0 || xe !== null && (!u || ma(o, l)?.writable)) {
          c === void 0 && (c = i(() => {
            var p = u ? jt(o[l]) : tt, v = /* @__PURE__ */ Ee(p);
            return v;
          }), n.set(l, c));
          var f = d(c);
          if (f === tt)
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
            y !== void 0 ? he(y, tt) : v in o && (y = i(() => /* @__PURE__ */ Ee(tt)), n.set(v + "", y));
          }
        if (f === void 0)
          (!p || ma(o, l)?.writable) && (f = i(() => /* @__PURE__ */ Ee(void 0)), he(f, jt(c)), n.set(l, f));
        else {
          p = f.v !== tt;
          var b = i(() => jt(c));
          he(f, b);
        }
        var g = Reflect.getOwnPropertyDescriptor(o, l);
        if (g?.set && g.set.call(u, c), !p) {
          if (a && typeof l == "string") {
            var m = (
              /** @type {Source<number>} */
              n.get("length")
            ), x = Number(l);
            Number.isInteger(x) && x >= m.v && he(m, x + 1);
          }
          zt(r);
        }
        return !0;
      },
      ownKeys(o) {
        d(r);
        var l = Reflect.ownKeys(o).filter((f) => {
          var p = n.get(f);
          return p === void 0 || p.v !== tt;
        });
        for (var [c, u] of n)
          u.v !== tt && !(c in o) && l.push(c);
        return l;
      },
      setPrototypeOf() {
        Ad();
      }
    }
  );
}
function ro(e) {
  try {
    if (e !== null && typeof e == "object" && zn in e)
      return e[zn];
  } catch {
  }
  return e;
}
function uf(e, t) {
  return Object.is(ro(e), ro(t));
}
var tr, zl, Hl, Vl;
function df() {
  if (tr === void 0) {
    tr = window, zl = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, n = Text.prototype;
    Hl = ma(t, "firstChild").get, Vl = ma(t, "nextSibling").get, to(e) && (e.__click = void 0, e.__className = void 0, e.__attributes = null, e.__style = void 0, e.__e = void 0), to(n) && (n.__t = void 0);
  }
}
function dn(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function Aa(e) {
  return (
    /** @type {TemplateNode | null} */
    Hl.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function hr(e) {
  return (
    /** @type {TemplateNode | null} */
    Vl.call(e)
  );
}
function N(e, t) {
  return /* @__PURE__ */ Aa(e);
}
function ne(e, t = !1) {
  {
    var n = /* @__PURE__ */ Aa(e);
    return n instanceof Comment && n.data === "" ? /* @__PURE__ */ hr(n) : n;
  }
}
function I(e, t = 1, n = !1) {
  let a = e;
  for (; t--; )
    a = /** @type {TemplateNode} */
    /* @__PURE__ */ hr(a);
  return a;
}
function ff(e) {
  e.textContent = "";
}
function Ul() {
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
  for (var r of t)
    e.addEventListener(r, n);
  Pa(() => {
    for (var s of t)
      e.removeEventListener(s, n);
  });
}
function Ia(e) {
  var t = ye, n = xe;
  mt(null), Kt(null);
  try {
    return e();
  } finally {
    mt(t), Kt(n);
  }
}
function hf(e) {
  xe === null && (ye === null && yd(), _d()), Jn && kd();
}
function mf(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Jt(e, t, n) {
  var a = xe;
  a !== null && (a.f & St) !== 0 && (e |= St);
  var r = {
    ctx: Be,
    deps: null,
    nodes: null,
    f: e | At | Wt,
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
      rr(r), r.f |= ls;
    } catch (o) {
      throw at(r), o;
    }
  else t !== null && Yn(r);
  var s = r;
  if (n && s.deps === null && s.teardown === null && s.nodes === null && s.first === s.last && // either `null`, or a singular child
  (s.f & Da) === 0 && (s = s.first, (e & Xt) !== 0 && (e & Gt) !== 0 && s !== null && (s.f |= Gt)), s !== null && (s.parent = a, a !== null && mf(s, a), ye !== null && (ye.f & rt) !== 0 && (e & Xn) === 0)) {
    var i = (
      /** @type {Derived} */
      ye
    );
    (i.effects ??= []).push(s);
  }
  return r;
}
function nr() {
  return ye !== null && !Vt;
}
function Pa(e) {
  const t = Jt(ki, null, !1);
  return lt(t, it), t.teardown = e, t;
}
function Ln(e) {
  hf();
  var t = (
    /** @type {Effect} */
    xe.f
  ), n = !ye && (t & gn) !== 0 && (t & ls) === 0;
  if (n) {
    var a = (
      /** @type {ComponentContext} */
      Be
    );
    (a.e ??= []).push(e);
  } else
    return ql(e);
}
function ql(e) {
  return Jt(wi | md, e, !1);
}
function gf(e) {
  Ht.ensure();
  const t = Jt(Xn | Da, e, !0);
  return (n = {}) => new Promise((a) => {
    n.outro ? Hn(t, () => {
      at(t), a(void 0);
    }) : (at(t), a(void 0));
  });
}
function mr(e) {
  return Jt(wi, e, !1);
}
function bf(e) {
  return Jt(_i | Da, e, !0);
}
function Gl(e, t = 0) {
  return Jt(ki | t, e, !0);
}
function P(e, t = [], n = [], a = []) {
  Fl(a, t, n, (r) => {
    Jt(ki, () => e(...r.map(d)), !0);
  });
}
function ja(e, t = 0) {
  var n = Jt(Xt | t, e, !0);
  return n;
}
function Kl(e, t = 0) {
  var n = Jt(xl | t, e, !0);
  return n;
}
function pt(e) {
  return Jt(gn | Da, e, !0);
}
function Yl(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = Jn, a = ye;
    so(!0), mt(null);
    try {
      t.call(null);
    } finally {
      so(n), mt(a);
    }
  }
}
function $l(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const r = n.ac;
    r !== null && Ia(() => {
      r.abort(da);
    });
    var a = n.next;
    (n.f & Xn) !== 0 ? n.parent = null : at(n, t), n = a;
  }
}
function wf(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    (t.f & gn) === 0 && at(t), t = n;
  }
}
function at(e, t = !0) {
  var n = !1;
  (t || (e.f & Sl) !== 0) && e.nodes !== null && e.nodes.end !== null && (kf(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), n = !0), $l(e, t && !n), Ur(e, 0), lt(e, un);
  var a = e.nodes && e.nodes.t;
  if (a !== null)
    for (const s of a)
      s.stop();
  Yl(e);
  var r = e.parent;
  r !== null && r.first !== null && Ql(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = null;
}
function kf(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : /* @__PURE__ */ hr(e);
    e.remove(), e = n;
  }
}
function Ql(e) {
  var t = e.parent, n = e.prev, a = e.next;
  n !== null && (n.next = a), a !== null && (a.prev = n), t !== null && (t.first === e && (t.first = a), t.last === e && (t.last = n));
}
function Hn(e, t, n = !0) {
  var a = [];
  Zl(e, a, !0);
  var r = () => {
    n && at(e), t && t();
  }, s = a.length;
  if (s > 0) {
    var i = () => --s || r();
    for (var o of a)
      o.out(i);
  } else
    r();
}
function Zl(e, t, n) {
  if ((e.f & St) === 0) {
    e.f ^= St;
    var a = e.nodes && e.nodes.t;
    if (a !== null)
      for (const o of a)
        (o.is_global || n) && t.push(o);
    for (var r = e.first; r !== null; ) {
      var s = r.next, i = (r.f & Gt) !== 0 || // If this is a branch effect without a block effect parent,
      // it means the parent block effect was pruned. In that case,
      // transparency information was transferred to the branch effect.
      (r.f & gn) !== 0 && (e.f & Xt) !== 0;
      Zl(r, t, i ? n : !1), r = s;
    }
  }
}
function Si(e) {
  Xl(e, !0);
}
function Xl(e, t) {
  if ((e.f & St) !== 0) {
    e.f ^= St, (e.f & it) === 0 && (lt(e, At), Yn(e));
    for (var n = e.first; n !== null; ) {
      var a = n.next, r = (n.f & Gt) !== 0 || (n.f & gn) !== 0;
      Xl(n, r ? t : !1), n = a;
    }
    var s = e.nodes && e.nodes.t;
    if (s !== null)
      for (const i of s)
        (i.is_global || t) && i.in();
  }
}
function Jl(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, a = e.nodes.end; n !== null; ) {
      var r = n === a ? null : /* @__PURE__ */ hr(n);
      t.append(n), n = r;
    }
}
let Vn = !1;
function Vr(e) {
  Vn = e;
}
let Jn = !1;
function so(e) {
  Jn = e;
}
let ye = null, Vt = !1;
function mt(e) {
  ye = e;
}
let xe = null;
function Kt(e) {
  xe = e;
}
let fn = null;
function ec(e) {
  ye !== null && (fn === null ? fn = [e] : fn.push(e));
}
let ut = null, yt = 0, Ot = null;
function _f(e) {
  Ot = e;
}
let tc = 1, ar = 0, pn = ar;
function io(e) {
  pn = e;
}
function nc() {
  return ++tc;
}
function gr(e) {
  var t = e.f;
  if ((t & At) !== 0)
    return !0;
  if (t & rt && (e.f &= ~Kn), (t & qt) !== 0) {
    var n = e.deps;
    if (n !== null)
      for (var a = n.length, r = 0; r < a; r++) {
        var s = n[r];
        if (gr(
          /** @type {Derived} */
          s
        ) && Pl(
          /** @type {Derived} */
          s
        ), s.wv > e.wv)
          return !0;
      }
    (t & Wt) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    It === null && lt(e, it);
  }
  return !1;
}
function ac(e, t, n = !0) {
  var a = e.reactions;
  if (a !== null && !fn?.includes(e))
    for (var r = 0; r < a.length; r++) {
      var s = a[r];
      (s.f & rt) !== 0 ? ac(
        /** @type {Derived} */
        s,
        t,
        !1
      ) : t === s && (n ? lt(s, At) : (s.f & it) !== 0 && lt(s, qt), Yn(
        /** @type {Effect} */
        s
      ));
    }
}
function rc(e) {
  var t = ut, n = yt, a = Ot, r = ye, s = fn, i = Be, o = Vt, l = pn, c = e.f;
  ut = /** @type {null | Value[]} */
  null, yt = 0, Ot = null, ye = (c & (gn | Xn)) === 0 ? e : null, fn = null, xa(e.ctx), Vt = !1, pn = ++ar, e.ac !== null && (Ia(() => {
    e.ac.abort(da);
  }), e.ac = null);
  try {
    e.f |= Gs;
    var u = (
      /** @type {Function} */
      e.fn
    ), f = u(), p = e.deps;
    if (ut !== null) {
      var v;
      if (Ur(e, yt), p !== null && yt > 0)
        for (p.length = yt + ut.length, v = 0; v < ut.length; v++)
          p[yt + v] = ut[v];
      else
        e.deps = p = ut;
      if (nr() && (e.f & Wt) !== 0)
        for (v = yt; v < p.length; v++)
          (p[v].reactions ??= []).push(e);
    } else p !== null && yt < p.length && (Ur(e, yt), p.length = yt);
    if (vr() && Ot !== null && !Vt && p !== null && (e.f & (rt | qt | At)) === 0)
      for (v = 0; v < /** @type {Source[]} */
      Ot.length; v++)
        ac(
          Ot[v],
          /** @type {Effect} */
          e
        );
    return r !== null && r !== e && (ar++, Ot !== null && (a === null ? a = Ot : a.push(.../** @type {Source[]} */
    Ot))), (e.f & Mn) !== 0 && (e.f ^= Mn), f;
  } catch (y) {
    return Nl(y);
  } finally {
    e.f ^= Gs, ut = t, yt = n, Ot = a, ye = r, fn = s, xa(i), Vt = o, pn = l;
  }
}
function yf(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var a = ud.call(n, e);
    if (a !== -1) {
      var r = n.length - 1;
      r === 0 ? n = t.reactions = null : (n[a] = n[r], n.pop());
    }
  }
  n === null && (t.f & rt) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (ut === null || !ut.includes(t)) && (lt(t, qt), (t.f & Wt) !== 0 && (t.f ^= Wt, t.f &= ~Kn), Il(
    /** @type {Derived} **/
    t
  ), Ur(
    /** @type {Derived} **/
    t,
    0
  ));
}
function Ur(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var a = t; a < n.length; a++)
      yf(e, n[a]);
}
function rr(e) {
  var t = e.f;
  if ((t & un) === 0) {
    lt(e, it);
    var n = xe, a = Vn;
    xe = e, Vn = !0;
    try {
      (t & (Xt | xl)) !== 0 ? wf(e) : $l(e), Yl(e);
      var r = rc(e);
      e.teardown = typeof r == "function" ? r : null, e.wv = tc;
      var s;
    } finally {
      Vn = a, xe = n;
    }
  }
}
async function sc() {
  await Promise.resolve(), Xd();
}
function d(e) {
  var t = e.f, n = (t & rt) !== 0;
  if (ye !== null && !Vt) {
    var a = xe !== null && (xe.f & un) !== 0;
    if (!a && !fn?.includes(e)) {
      var r = ye.deps;
      if ((ye.f & Gs) !== 0)
        e.rv < ar && (e.rv = ar, ut === null && r !== null && r[yt] === e ? yt++ : ut === null ? ut = [e] : ut.includes(e) || ut.push(e));
      else {
        (ye.deps ??= []).push(e);
        var s = e.reactions;
        s === null ? e.reactions = [ye] : s.includes(ye) || s.push(ye);
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
      return ((i.f & it) === 0 && i.reactions !== null || oc(i)) && (o = xi(i)), En.set(i, o), o;
    }
  } else n && (!It?.has(e) || Pe?.is_fork && !nr()) && (i = /** @type {Derived} */
  e, gr(i) && Pl(i), Vn && nr() && (i.f & Wt) === 0 && ic(i));
  if (It?.has(e))
    return It.get(e);
  if ((e.f & Mn) !== 0)
    throw e.v;
  return e.v;
}
function ic(e) {
  if (e.deps !== null) {
    e.f ^= Wt;
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & rt) !== 0 && (t.f & Wt) === 0 && ic(
        /** @type {Derived} */
        t
      );
  }
}
function oc(e) {
  if (e.v === tt) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (En.has(t) || (t.f & rt) !== 0 && oc(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function Yt(e) {
  var t = Vt;
  try {
    return Vt = !0, e();
  } finally {
    Vt = t;
  }
}
const xf = -7169;
function lt(e, t) {
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
const lc = /* @__PURE__ */ new Set(), $s = /* @__PURE__ */ new Set();
function cc(e, t, n, a = {}) {
  function r(s) {
    if (a.capture || Ka.call(t, s), !s.cancelBubble)
      return Ia(() => n?.call(this, s));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? On(() => {
    t.addEventListener(e, r, a);
  }) : t.addEventListener(e, r, a), r;
}
function Qs(e, t, n, a, r) {
  var s = { capture: a, passive: r }, i = cc(e, t, n, s);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && Pa(() => {
    t.removeEventListener(e, i, s);
  });
}
function Wa(e) {
  for (var t = 0; t < e.length; t++)
    lc.add(e[t]);
  for (var n of $s)
    n(e);
}
let oo = null;
function Ka(e) {
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), a = e.type, r = e.composedPath?.() || [], s = (
    /** @type {null | Element} */
    r[0] || e.target
  );
  oo = e;
  var i = 0, o = oo === e && e.__root;
  if (o) {
    var l = r.indexOf(o);
    if (l !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e.__root = t;
      return;
    }
    var c = r.indexOf(t);
    if (c === -1)
      return;
    l <= c && (i = l);
  }
  if (s = /** @type {Element} */
  r[i] || e.target, s !== t) {
    kl(e, "currentTarget", {
      configurable: !0,
      get() {
        return s || n;
      }
    });
    var u = ye, f = xe;
    mt(null), Kt(null);
    try {
      for (var p, v = []; s !== null; ) {
        var y = s.assignedSlot || s.parentNode || /** @type {any} */
        s.host || null;
        try {
          var b = s["__" + a];
          b != null && (!/** @type {any} */
          s.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === s) && b.call(s, e);
        } catch (g) {
          p ? v.push(g) : p = g;
        }
        if (e.cancelBubble || y === t || y === null)
          break;
        s = y;
      }
      if (p) {
        for (let g of v)
          queueMicrotask(() => {
            throw g;
          });
        throw p;
      }
    } finally {
      e.__root = t, delete e.currentTarget, mt(u), Kt(f);
    }
  }
}
function uc(e) {
  var t = document.createElement("template");
  return t.innerHTML = e.replaceAll("<!>", "<!---->"), t.content;
}
function sr(e, t) {
  var n = (
    /** @type {Effect} */
    xe
  );
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function W(e, t) {
  var n = (t & zd) !== 0, a = (t & Hd) !== 0, r, s = !e.startsWith("<!>");
  return () => {
    r === void 0 && (r = uc(s ? e : "<!>" + e), n || (r = /** @type {TemplateNode} */
    /* @__PURE__ */ Aa(r)));
    var i = (
      /** @type {TemplateNode} */
      a || zl ? document.importNode(r, !0) : r.cloneNode(!0)
    );
    if (n) {
      var o = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Aa(i)
      ), l = (
        /** @type {TemplateNode} */
        i.lastChild
      );
      sr(o, l);
    } else
      sr(i, i);
    return i;
  };
}
// @__NO_SIDE_EFFECTS__
function Nf(e, t, n = "svg") {
  var a = !e.startsWith("<!>"), r = `<${n}>${a ? e : "<!>" + e}</${n}>`, s;
  return () => {
    if (!s) {
      var i = (
        /** @type {DocumentFragment} */
        uc(r)
      ), o = (
        /** @type {Element} */
        /* @__PURE__ */ Aa(i)
      );
      s = /** @type {Element} */
      /* @__PURE__ */ Aa(o);
    }
    var l = (
      /** @type {TemplateNode} */
      s.cloneNode(!0)
    );
    return sr(l, l), l;
  };
}
// @__NO_SIDE_EFFECTS__
function ue(e, t) {
  return /* @__PURE__ */ Nf(e, t, "svg");
}
function le() {
  var e = document.createDocumentFragment(), t = document.createComment(""), n = dn();
  return e.append(t, n), sr(t, n), e;
}
function M(e, t) {
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
let qr = !0;
function Tr(e) {
  qr = e;
}
function Y(e, t) {
  var n = t == null ? "" : typeof t == "object" ? t + "" : t;
  n !== (e.__t ??= e.nodeValue) && (e.__t = n, e.nodeValue = n + "");
}
function dc(e, t) {
  return Rf(e, t);
}
const ta = /* @__PURE__ */ new Map();
function Rf(e, { target: t, anchor: n, props: a = {}, events: r, context: s, intro: i = !0 }) {
  df();
  var o = /* @__PURE__ */ new Set(), l = (f) => {
    for (var p = 0; p < f.length; p++) {
      var v = f[p];
      if (!o.has(v)) {
        o.add(v);
        var y = Lf(v);
        t.addEventListener(v, Ka, { passive: y });
        var b = ta.get(v);
        b === void 0 ? (document.addEventListener(v, Ka, { passive: y }), ta.set(v, 1)) : ta.set(v, b + 1);
      }
    }
  };
  l(is(lc)), $s.add(l);
  var c = void 0, u = gf(() => {
    var f = n ?? t.appendChild(dn());
    return nf(
      /** @type {TemplateNode} */
      f,
      {
        pending: () => {
        }
      },
      (p) => {
        if (s) {
          Se({});
          var v = (
            /** @type {ComponentContext} */
            Be
          );
          v.c = s;
        }
        r && (a.$$events = r), qr = i, c = e(p, a) || {}, qr = !0, s && Ce();
      }
    ), () => {
      for (var p of o) {
        t.removeEventListener(p, Ka);
        var v = (
          /** @type {number} */
          ta.get(p)
        );
        --v === 0 ? (document.removeEventListener(p, Ka), ta.delete(p)) : ta.set(p, v);
      }
      $s.delete(l), f !== n && f.parentNode?.removeChild(f);
    };
  });
  return Of.set(c, u), c;
}
let Of = /* @__PURE__ */ new WeakMap();
class ds {
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
  #s = !0;
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(t, n = !0) {
    this.anchor = t, this.#s = n;
  }
  #r = () => {
    var t = (
      /** @type {Batch} */
      Pe
    );
    if (this.#e.has(t)) {
      var n = (
        /** @type {Key} */
        this.#e.get(t)
      ), a = this.#t.get(n);
      if (a)
        Si(a), this.#a.delete(n);
      else {
        var r = this.#n.get(n);
        r && (this.#t.set(n, r.effect), this.#n.delete(n), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), a = r.effect);
      }
      for (const [s, i] of this.#e) {
        if (this.#e.delete(s), s === t)
          break;
        const o = this.#n.get(i);
        o && (at(o.effect), this.#n.delete(i));
      }
      for (const [s, i] of this.#t) {
        if (s === n || this.#a.has(s)) continue;
        const o = () => {
          if (Array.from(this.#e.values()).includes(s)) {
            var c = document.createDocumentFragment();
            Jl(i, c), c.append(dn()), this.#n.set(s, { effect: i, fragment: c });
          } else
            at(i);
          this.#a.delete(s), this.#t.delete(s);
        };
        this.#s || !a ? (this.#a.add(s), Hn(i, o, !1)) : o();
      }
    }
  };
  /**
   * @param {Batch} batch
   */
  #i = (t) => {
    this.#e.delete(t);
    const n = Array.from(this.#e.values());
    for (const [a, r] of this.#n)
      n.includes(a) || (at(r.effect), this.#n.delete(a));
  };
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(t, n) {
    var a = (
      /** @type {Batch} */
      Pe
    ), r = Ul();
    if (n && !this.#t.has(t) && !this.#n.has(t))
      if (r) {
        var s = document.createDocumentFragment(), i = dn();
        s.append(i), this.#n.set(t, {
          effect: pt(() => n(i)),
          fragment: s
        });
      } else
        this.#t.set(
          t,
          pt(() => n(this.anchor))
        );
    if (this.#e.set(a, t), r) {
      for (const [o, l] of this.#t)
        o === t ? a.skipped_effects.delete(l) : a.skipped_effects.add(l);
      for (const [o, l] of this.#n)
        o === t ? a.skipped_effects.delete(l.effect) : a.skipped_effects.add(l.effect);
      a.oncommit(this.#r), a.ondiscard(this.#i);
    } else
      this.#r();
  }
}
function D(e, t, n = !1) {
  var a = new ds(e), r = n ? Gt : 0;
  function s(i, o) {
    a.ensure(i, o);
  }
  ja(() => {
    var i = !1;
    t((o, l = !0) => {
      i = !0, s(l, o);
    }), i || s(!1, null);
  }, r);
}
function Ci(e, t) {
  return t;
}
function Df(e, t, n) {
  for (var a = [], r = t.length, s, i = t.length, o = 0; o < r; o++) {
    let f = t[o];
    Hn(
      f,
      () => {
        if (s) {
          if (s.pending.delete(f), s.done.add(f), s.pending.size === 0) {
            var p = (
              /** @type {Set<EachOutroGroup>} */
              e.outrogroups
            );
            Zs(is(s.done)), p.delete(s), p.size === 0 && (e.outrogroups = null);
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
    Zs(t, !l);
  } else
    s = {
      pending: new Set(t),
      done: /* @__PURE__ */ new Set()
    }, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(s);
}
function Zs(e, t = !0) {
  for (var n = 0; n < e.length; n++)
    at(e[n], t);
}
var lo;
function Tt(e, t, n, a, r, s = null) {
  var i = e, o = /* @__PURE__ */ new Map(), l = (t & Al) !== 0;
  if (l) {
    var c = (
      /** @type {Element} */
      e
    );
    i = c.appendChild(dn());
  }
  var u = null, f = /* @__PURE__ */ yi(() => {
    var m = n();
    return bi(m) ? m : m == null ? [] : is(m);
  }), p, v = !0;
  function y() {
    g.fallback = u, Ff(g, p, i, t, a), u !== null && (p.length === 0 ? (u.f & cn) === 0 ? Si(u) : (u.f ^= cn, Ya(u, null, i)) : Hn(u, () => {
      u = null;
    }));
  }
  var b = ja(() => {
    p = /** @type {V[]} */
    d(f);
    for (var m = p.length, x = /* @__PURE__ */ new Set(), h = (
      /** @type {Batch} */
      Pe
    ), C = Ul(), _ = 0; _ < m; _ += 1) {
      var A = p[_], E = a(A, _), S = v ? null : o.get(E);
      S ? (S.v && Ca(S.v, A), S.i && Ca(S.i, _), C && h.skipped_effects.delete(S.e)) : (S = If(
        o,
        v ? i : lo ??= dn(),
        A,
        E,
        _,
        r,
        t,
        n
      ), v || (S.e.f |= cn), o.set(E, S)), x.add(E);
    }
    if (m === 0 && s && !u && (v ? u = pt(() => s(i)) : (u = pt(() => s(lo ??= dn())), u.f |= cn)), !v)
      if (C) {
        for (const [w, L] of o)
          x.has(w) || h.skipped_effects.add(L.e);
        h.oncommit(y), h.ondiscard(() => {
        });
      } else
        y();
    d(f);
  }), g = { effect: b, items: o, outrogroups: null, fallback: u };
  v = !1;
}
function Ff(e, t, n, a, r) {
  var s = (a & Nd) !== 0, i = t.length, o = e.items, l = e.effect.first, c, u = null, f, p = [], v = [], y, b, g, m;
  if (s)
    for (m = 0; m < i; m += 1)
      y = t[m], b = r(y, m), g = /** @type {EachItem} */
      o.get(b).e, (g.f & cn) === 0 && (g.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(g));
  for (m = 0; m < i; m += 1) {
    if (y = t[m], b = r(y, m), g = /** @type {EachItem} */
    o.get(b).e, e.outrogroups !== null)
      for (const L of e.outrogroups)
        L.pending.delete(g), L.done.delete(g);
    if ((g.f & cn) !== 0)
      if (g.f ^= cn, g === l)
        Ya(g, null, n);
      else {
        var x = u ? u.next : l;
        g === e.effect.last && (e.effect.last = g.prev), g.prev && (g.prev.next = g.next), g.next && (g.next.prev = g.prev), kn(e, u, g), kn(e, g, x), Ya(g, x, n), u = g, p = [], v = [], l = u.next;
        continue;
      }
    if ((g.f & St) !== 0 && (Si(g), s && (g.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(g))), g !== l) {
      if (c !== void 0 && c.has(g)) {
        if (p.length < v.length) {
          var h = v[0], C;
          u = h.prev;
          var _ = p[0], A = p[p.length - 1];
          for (C = 0; C < p.length; C += 1)
            Ya(p[C], h, n);
          for (C = 0; C < v.length; C += 1)
            c.delete(v[C]);
          kn(e, _.prev, A.next), kn(e, u, _), kn(e, A, h), l = h, u = A, m -= 1, p = [], v = [];
        } else
          c.delete(g), Ya(g, l, n), kn(e, g.prev, g.next), kn(e, g, u === null ? e.effect.first : u.next), kn(e, u, g), u = g;
        continue;
      }
      for (p = [], v = []; l !== null && l !== g; )
        (c ??= /* @__PURE__ */ new Set()).add(l), v.push(l), l = l.next;
      if (l === null)
        continue;
    }
    (g.f & cn) === 0 && p.push(g), u = g, l = g.next;
  }
  if (e.outrogroups !== null) {
    for (const L of e.outrogroups)
      L.pending.size === 0 && (Zs(is(L.done)), e.outrogroups?.delete(L));
    e.outrogroups.size === 0 && (e.outrogroups = null);
  }
  if (l !== null || c !== void 0) {
    var E = [];
    if (c !== void 0)
      for (g of c)
        (g.f & St) === 0 && E.push(g);
    for (; l !== null; )
      (l.f & St) === 0 && l !== e.fallback && E.push(l), l = l.next;
    var S = E.length;
    if (S > 0) {
      var w = (a & Al) !== 0 && i === 0 ? n : null;
      if (s) {
        for (m = 0; m < S; m += 1)
          E[m].nodes?.a?.measure();
        for (m = 0; m < S; m += 1)
          E[m].nodes?.a?.fix();
      }
      Df(e, E, w);
    }
  }
  s && On(() => {
    if (f !== void 0)
      for (g of f)
        g.nodes?.a?.apply();
  });
}
function If(e, t, n, a, r, s, i, o) {
  var l = (i & Ed) !== 0 ? (i & Rd) === 0 ? /* @__PURE__ */ Wl(n, !1, !1) : Rn(n) : null, c = (i & Ld) !== 0 ? Rn(r) : null;
  return {
    v: l,
    i: c,
    e: pt(() => (s(t, l ?? n, c ?? r, o), () => {
      e.delete(a);
    }))
  };
}
function Ya(e, t, n) {
  if (e.nodes)
    for (var a = e.nodes.start, r = e.nodes.end, s = t && (t.f & cn) === 0 ? (
      /** @type {EffectNodes} */
      t.nodes.start
    ) : n; a !== null; ) {
      var i = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ hr(a)
      );
      if (s.before(a), a === r)
        return;
      a = i;
    }
}
function kn(e, t, n) {
  t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function Un(e, t, ...n) {
  var a = new ds(e);
  ja(() => {
    const r = t() ?? null;
    a.ensure(r, r && ((s) => r(s, ...n)));
  }, Gt);
}
function Xs(e, t, n) {
  var a = new ds(e);
  ja(() => {
    var r = t() ?? null;
    a.ensure(r, r && ((s) => n(s, r)));
  }, Gt);
}
const Pf = () => performance.now(), ln = {
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
function fc() {
  const e = ln.now();
  ln.tasks.forEach((t) => {
    t.c(e) || (ln.tasks.delete(t), t.f());
  }), ln.tasks.size !== 0 && ln.tick(fc);
}
function jf(e) {
  let t;
  return ln.tasks.size === 0 && ln.tick(fc), {
    promise: new Promise((n) => {
      ln.tasks.add(t = { c: e, f: n });
    }),
    abort() {
      ln.tasks.delete(t);
    }
  };
}
function Mr(e, t) {
  Ia(() => {
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
function co(e) {
  const t = {}, n = e.split(";");
  for (const a of n) {
    const [r, s] = a.split(":");
    if (!r || s === void 0) break;
    const i = Wf(r.trim());
    t[i] = s.trim();
  }
  return t;
}
const Bf = (e) => e;
function Gr(e, t, n, a) {
  var r = (e & jd) !== 0, s = (e & Wd) !== 0, i = r && s, o = (e & Bd) !== 0, l = i ? "both" : r ? "in" : "out", c, u = t.inert, f = t.style.overflow, p, v;
  function y() {
    return Ia(() => c ??= n()(t, a?.() ?? /** @type {P} */
    {}, {
      direction: l
    }));
  }
  var b = {
    is_global: o,
    in() {
      if (t.inert = u, !r) {
        v?.abort(), v?.reset?.();
        return;
      }
      s || p?.abort(), Mr(t, "introstart"), p = Js(t, y(), v, 1, () => {
        Mr(t, "introend"), p?.abort(), p = c = void 0, t.style.overflow = f;
      });
    },
    out(h) {
      if (!s) {
        h?.(), c = void 0;
        return;
      }
      t.inert = !0, Mr(t, "outrostart"), v = Js(t, y(), p, 0, () => {
        Mr(t, "outroend"), h?.();
      });
    },
    stop: () => {
      p?.abort(), v?.abort();
    }
  }, g = (
    /** @type {Effect & { nodes: EffectNodes }} */
    xe
  );
  if ((g.nodes.t ??= []).push(b), r && qr) {
    var m = o;
    if (!m) {
      for (var x = (
        /** @type {Effect | null} */
        g.parent
      ); x && (x.f & Gt) !== 0; )
        for (; (x = x.parent) && (x.f & Xt) === 0; )
          ;
      m = !x || (x.f & ls) !== 0;
    }
    m && mr(() => {
      Yt(() => b.in());
    });
  }
}
function Js(e, t, n, a, r) {
  var s = a === 1;
  if (vd(t)) {
    var i, o = !1;
    return On(() => {
      if (!o) {
        var g = t({ direction: s ? "in" : "out" });
        i = Js(e, g, n, a, r);
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
    return r(), {
      abort: ht,
      deactivate: ht,
      reset: ht,
      t: () => a
    };
  const { delay: l = 0, css: c, tick: u, easing: f = Bf } = t;
  var p = [];
  if (s && n === void 0 && (u && u(0, 1), c)) {
    var v = co(c(0, 1));
    p.push(v, v);
  }
  var y = () => 1 - a, b = e.animate(p, { duration: l, fill: "forwards" });
  return b.onfinish = () => {
    b.cancel();
    var g = n?.t() ?? 1 - a;
    n?.abort();
    var m = a - g, x = (
      /** @type {number} */
      t.duration * Math.abs(m)
    ), h = [];
    if (x > 0) {
      var C = !1;
      if (c)
        for (var _ = Math.ceil(x / 16.666666666666668), A = 0; A <= _; A += 1) {
          var E = g + m * f(A / _), S = co(c(E, 1 - E));
          h.push(S), C ||= S.overflow === "hidden";
        }
      C && (e.style.overflow = "hidden"), y = () => {
        var w = (
          /** @type {number} */
          /** @type {globalThis.Animation} */
          b.currentTime
        );
        return g + m * f(w / x);
      }, u && jf(() => {
        if (b.playState !== "running") return !1;
        var w = y();
        return u(w, 1 - w), !0;
      });
    }
    b = e.animate(h, { duration: x, fill: "forwards" }), b.onfinish = () => {
      y = () => a, u?.(a, 1 - a), r();
    };
  }, {
    abort: () => {
      b && (b.cancel(), b.effect = null, b.onfinish = ht);
    },
    deactivate: () => {
      r = ht;
    },
    reset: () => {
      a === 0 && u?.(1, 0);
    },
    t: () => y()
  };
}
function pc(e, t, n, a, r, s) {
  var i = null, o = (
    /** @type {TemplateNode} */
    e
  ), l = new ds(o, !1);
  ja(() => {
    const c = t() || null;
    var u = c === "svg" ? Ud : null;
    if (c === null) {
      l.ensure(null, null), Tr(!0);
      return;
    }
    return l.ensure(c, (f) => {
      if (c) {
        if (i = u ? document.createElementNS(u, c) : document.createElement(c), sr(i, i), a) {
          var p = i.appendChild(dn());
          a(i, p);
        }
        xe.nodes.end = i, f.before(i);
      }
    }), Tr(!0), () => {
      c && Tr(!1);
    };
  }, Gt), Pa(() => {
    Tr(!0);
  });
}
function zf(e, t) {
  var n = void 0, a;
  Kl(() => {
    n !== (n = t()) && (a && (at(a), a = null), n && (a = pt(() => {
      mr(() => (
        /** @type {(node: Element) => void} */
        n(e)
      ));
    })));
  });
}
function vc(e) {
  var t, n, a = "";
  if (typeof e == "string" || typeof e == "number") a += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var r = e.length;
    for (t = 0; t < r; t++) e[t] && (n = vc(e[t])) && (a && (a += " "), a += n);
  } else for (n in e) e[n] && (a && (a += " "), a += n);
  return a;
}
function hc() {
  for (var e, t, n = 0, a = "", r = arguments.length; n < r; n++) (e = arguments[n]) && (t = vc(e)) && (a && (a += " "), a += t);
  return a;
}
function Kr(e) {
  return typeof e == "object" ? hc(e) : e ?? "";
}
const uo = [...` 	
\r\f \v\uFEFF`];
function Hf(e, t, n) {
  var a = e == null ? "" : "" + e;
  if (t && (a = a ? a + " " + t : t), n) {
    for (var r in n)
      if (n[r])
        a = a ? a + " " + r : r;
      else if (a.length)
        for (var s = r.length, i = 0; (i = a.indexOf(r, i)) >= 0; ) {
          var o = i + s;
          (i === 0 || uo.includes(a[i - 1])) && (o === a.length || uo.includes(a[o])) ? a = (i === 0 ? "" : a.substring(0, i)) + a.substring(o + 1) : i = o;
        }
  }
  return a === "" ? null : a;
}
function fo(e, t = !1) {
  var n = t ? " !important;" : ";", a = "";
  for (var r in e) {
    var s = e[r];
    s != null && s !== "" && (a += " " + r + ": " + s + n);
  }
  return a;
}
function Cs(e) {
  return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Vf(e, t) {
  if (t) {
    var n = "", a, r;
    if (Array.isArray(t) ? (a = t[0], r = t[1]) : a = t, e) {
      e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var s = !1, i = 0, o = !1, l = [];
      a && l.push(...Object.keys(a).map(Cs)), r && l.push(...Object.keys(r).map(Cs));
      var c = 0, u = -1;
      const b = e.length;
      for (var f = 0; f < b; f++) {
        var p = e[f];
        if (o ? p === "/" && e[f - 1] === "*" && (o = !1) : s ? s === p && (s = !1) : p === "/" && e[f + 1] === "*" ? o = !0 : p === '"' || p === "'" ? s = p : p === "(" ? i++ : p === ")" && i--, !o && s === !1 && i === 0) {
          if (p === ":" && u === -1)
            u = f;
          else if (p === ";" || f === b - 1) {
            if (u !== -1) {
              var v = Cs(e.substring(c, u).trim());
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
    return a && (n += fo(a)), r && (n += fo(r, !0)), n = n.trim(), n === "" ? null : n;
  }
  return e == null ? null : String(e);
}
function ie(e, t, n, a, r, s) {
  var i = e.__className;
  if (i !== n || i === void 0) {
    var o = Hf(n, a, s);
    o == null ? e.removeAttribute("class") : t ? e.className = o : e.setAttribute("class", o), e.__className = n;
  } else if (s && r !== s)
    for (var l in s) {
      var c = !!s[l];
      (r == null || c !== !!r[l]) && e.classList.toggle(l, c);
    }
  return s;
}
function As(e, t = {}, n, a) {
  for (var r in n) {
    var s = n[r];
    t[r] !== s && (n[r] == null ? e.style.removeProperty(r) : e.style.setProperty(r, s, a));
  }
}
function ot(e, t, n, a) {
  var r = e.__style;
  if (r !== t) {
    var s = Vf(t, a);
    s == null ? e.removeAttribute("style") : e.style.cssText = s, e.__style = t;
  } else a && (Array.isArray(a) ? (As(e, n?.[0], a[0]), As(e, n?.[1], a[1], "important")) : As(e, n, a));
  return a;
}
function ei(e, t, n = !1) {
  if (e.multiple) {
    if (t == null)
      return;
    if (!bi(t))
      return Gd();
    for (var a of e.options)
      a.selected = t.includes(po(a));
    return;
  }
  for (a of e.options) {
    var r = po(a);
    if (uf(r, t)) {
      a.selected = !0;
      return;
    }
  }
  (!n || t !== void 0) && (e.selectedIndex = -1);
}
function Uf(e) {
  var t = new MutationObserver(() => {
    ei(e, e.__value);
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
  }), Pa(() => {
    t.disconnect();
  });
}
function po(e) {
  return "__value" in e ? e.__value : e.value;
}
const Cn = Symbol("class"), ca = Symbol("style"), mc = Symbol("is custom element"), gc = Symbol("is html");
function qf(e, t) {
  t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function $(e, t, n, a) {
  var r = bc(e);
  r[t] !== (r[t] = n) && (t === "loading" && (e[bd] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && wc(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function Gf(e, t, n, a, r = !1, s = !1) {
  var i = bc(e), o = i[mc], l = !i[gc], c = t || {}, u = e.tagName === "OPTION";
  for (var f in t)
    f in n || (n[f] = null);
  n.class ? n.class = Kr(n.class) : (a || n[Cn]) && (n.class = null), n[ca] && (n.style ??= null);
  var p = wc(e);
  for (const h in n) {
    let C = n[h];
    if (u && h === "value" && C == null) {
      e.value = e.__value = "", c[h] = C;
      continue;
    }
    if (h === "class") {
      var v = e.namespaceURI === "http://www.w3.org/1999/xhtml";
      ie(e, v, C, a, t?.[Cn], n[Cn]), c[h] = C, c[Cn] = n[Cn];
      continue;
    }
    if (h === "style") {
      ot(e, C, t?.[ca], n[ca]), c[h] = C, c[ca] = n[ca];
      continue;
    }
    var y = c[h];
    if (!(C === y && !(C === void 0 && e.hasAttribute(h)))) {
      c[h] = C;
      var b = h[0] + h[1];
      if (b !== "$$")
        if (b === "on") {
          const _ = {}, A = "$$" + h;
          let E = h.slice(2);
          var g = Af(E);
          if (Sf(E) && (E = E.slice(0, -7), _.capture = !0), !g && y) {
            if (C != null) continue;
            e.removeEventListener(E, c[A], _), c[A] = null;
          }
          if (C != null)
            if (g)
              e[`__${E}`] = C, Wa([E]);
            else {
              let S = function(w) {
                c[h].call(this, w);
              };
              c[A] = cc(E, e, S, _);
            }
          else g && (e[`__${E}`] = void 0);
        } else if (h === "style")
          $(e, h, C);
        else if (h === "autofocus")
          pf(
            /** @type {HTMLElement} */
            e,
            !!C
          );
        else if (!o && (h === "__value" || h === "value" && C != null))
          e.value = e.__value = C;
        else if (h === "selected" && u)
          qf(
            /** @type {HTMLOptionElement} */
            e,
            C
          );
        else {
          var m = h;
          l || (m = Mf(m));
          var x = m === "defaultValue" || m === "defaultChecked";
          if (C == null && !o && !x)
            if (i[h] = null, m === "value" || m === "checked") {
              let _ = (
                /** @type {HTMLInputElement} */
                e
              );
              const A = t === void 0;
              if (m === "value") {
                let E = _.defaultValue;
                _.removeAttribute(m), _.defaultValue = E, _.value = _.__value = A ? E : null;
              } else {
                let E = _.defaultChecked;
                _.removeAttribute(m), _.defaultChecked = E, _.checked = A ? E : !1;
              }
            } else
              e.removeAttribute(h);
          else x || p.includes(m) && (o || typeof C != "string") ? (e[m] = C, m in i && (i[m] = tt)) : typeof C != "function" && $(e, m, C);
        }
    }
  }
  return c;
}
function $e(e, t, n = [], a = [], r = [], s, i = !1, o = !1) {
  Fl(r, n, a, (l) => {
    var c = void 0, u = {}, f = e.nodeName === "SELECT", p = !1;
    if (Kl(() => {
      var y = t(...l.map(d)), b = Gf(
        e,
        c,
        y,
        s,
        i,
        o
      );
      p && f && "value" in y && ei(
        /** @type {HTMLSelectElement} */
        e,
        y.value
      );
      for (let m of Object.getOwnPropertySymbols(u))
        y[m] || at(u[m]);
      for (let m of Object.getOwnPropertySymbols(y)) {
        var g = y[m];
        m.description === qd && (!c || g !== c[m]) && (u[m] && at(u[m]), u[m] = pt(() => zf(e, () => g))), b[m] = g;
      }
      c = b;
    }), f) {
      var v = (
        /** @type {HTMLSelectElement} */
        e
      );
      mr(() => {
        ei(
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
function bc(e) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    // @ts-expect-error
    e.__attributes ??= {
      [mc]: e.nodeName.includes("-"),
      [gc]: e.namespaceURI === Vd
    }
  );
}
var vo = /* @__PURE__ */ new Map();
function wc(e) {
  var t = e.getAttribute("is") || e.nodeName, n = vo.get(t);
  if (n) return n;
  vo.set(t, n = []);
  for (var a, r = e, s = Element.prototype; s !== r; ) {
    a = dd(r);
    for (var i in a)
      a[i].set && n.push(i);
    r = _l(r);
  }
  return n;
}
class Ai {
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
      var r = this.#e.get(t);
      r.delete(n), r.size === 0 && (this.#e.delete(t), this.#t.unobserve(t));
    };
  }
  #a() {
    return this.#t ?? (this.#t = new ResizeObserver(
      /** @param {any} entries */
      (t) => {
        for (var n of t) {
          Ai.entries.set(n.target, n);
          for (var a of this.#e.get(n.target) || [])
            a(n);
        }
      }
    ));
  }
}
var Kf = /* @__PURE__ */ new Ai({
  box: "border-box"
});
function Yf(e, t, n) {
  var a = Kf.observe(e, () => n(e[t]));
  mr(() => (Yt(() => n(e[t])), a));
}
function ho(e, t) {
  return e === t || e?.[zn] === t;
}
function An(e = {}, t, n, a) {
  return mr(() => {
    var r, s;
    return Gl(() => {
      r = s, s = [], Yt(() => {
        e !== n(...s) && (t(e, ...s), r && ho(n(...r), e) && t(null, ...r));
      });
    }), () => {
      On(() => {
        s && ho(n(...s), e) && t(null, ...s);
      });
    };
  }), e;
}
function mo(e, t) {
  vf(window, ["resize"], () => Ia(() => t(window[e])));
}
function kc(e, t, n) {
  if (e == null)
    return t(void 0), ht;
  const a = Yt(
    () => e.subscribe(
      t,
      // @ts-expect-error
      n
    )
  );
  return a.unsubscribe ? () => a.unsubscribe() : a;
}
const na = [];
function $f(e, t) {
  return {
    subscribe: Qf(e, t).subscribe
  };
}
function Qf(e, t = ht) {
  let n = null;
  const a = /* @__PURE__ */ new Set();
  function r(o) {
    if (Ml(e, o) && (e = o, n)) {
      const l = !na.length;
      for (const c of a)
        c[1](), na.push(c, e);
      if (l) {
        for (let c = 0; c < na.length; c += 2)
          na[c][0](na[c + 1]);
        na.length = 0;
      }
    }
  }
  function s(o) {
    r(o(
      /** @type {T} */
      e
    ));
  }
  function i(o, l = ht) {
    const c = [o, l];
    return a.add(c), a.size === 1 && (n = t(r, s) || ht), o(
      /** @type {T} */
      e
    ), () => {
      a.delete(c), a.size === 0 && n && (n(), n = null);
    };
  }
  return { set: r, update: s, subscribe: i };
}
function Zf(e) {
  let t;
  return kc(e, (n) => t = n)(), t;
}
let Er = !1, ti = Symbol();
function Xf(e, t, n) {
  const a = n[t] ??= {
    store: null,
    source: /* @__PURE__ */ Wl(void 0),
    unsubscribe: ht
  };
  if (a.store !== e && !(ti in n))
    if (a.unsubscribe(), a.store = e ?? null, e == null)
      a.source.v = void 0, a.unsubscribe = ht;
    else {
      var r = !0;
      a.unsubscribe = kc(e, (s) => {
        r ? a.source.v = s : he(a.source, s);
      }), r = !1;
    }
  return e && ti in n ? Zf(e) : d(a.source);
}
function Jf() {
  const e = {};
  function t() {
    Pa(() => {
      for (var n in e)
        e[n].unsubscribe();
      kl(e, ti, {
        enumerable: !1,
        value: !0
      });
    });
  }
  return [e, t];
}
function ep(e) {
  var t = Er;
  try {
    return Er = !1, [e(), Er];
  } finally {
    Er = t;
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
function bt(e, t, n) {
  return new Proxy(
    { props: e, exclude: t },
    tp
  );
}
function q(e, t, n, a) {
  var r = !Fa || (n & Dd) !== 0, s = (n & Id) !== 0, i = (n & Pd) !== 0, o = (
    /** @type {V} */
    a
  ), l = !0, c = () => (l && (l = !1, o = i ? Yt(
    /** @type {() => V} */
    a
  ) : (
    /** @type {V} */
    a
  )), o), u;
  if (s) {
    var f = zn in e || gd in e;
    u = ma(e, t)?.set ?? (f && t in e ? (h) => e[t] = h : void 0);
  }
  var p, v = !1;
  s ? [p, v] = ep(() => (
    /** @type {V} */
    e[t]
  )) : p = /** @type {V} */
  e[t], p === void 0 && a !== void 0 && (p = c(), u && (r && Sd(), u(p)));
  var y;
  if (r ? y = () => {
    var h = (
      /** @type {V} */
      e[t]
    );
    return h === void 0 ? c() : (l = !0, h);
  } : y = () => {
    var h = (
      /** @type {V} */
      e[t]
    );
    return h !== void 0 && (o = /** @type {V} */
    void 0), h === void 0 ? o : h;
  }, r && (n & Fd) === 0)
    return y;
  if (u) {
    var b = e.$$legacy;
    return (
      /** @type {() => V} */
      (function(h, C) {
        return arguments.length > 0 ? ((!r || !C || b || v) && u(C ? y() : h), h) : y();
      })
    );
  }
  var g = !1, m = ((n & Od) !== 0 ? us : yi)(() => (g = !1, y()));
  s && d(m);
  var x = (
    /** @type {Effect} */
    xe
  );
  return (
    /** @type {() => V} */
    (function(h, C) {
      if (arguments.length > 0) {
        const _ = C ? d(m) : r && s ? jt(h) : h;
        return he(m, _), g = !0, o !== void 0 && (o = _), h;
      }
      return Jn && g || (x.f & un) !== 0 ? m.v : d(m);
    })
  );
}
function np(e) {
  Be === null && Cl(), Fa && Be.l !== null ? ap(Be).m.push(e) : Ln(() => {
    const t = Yt(e);
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
const rp = "5";
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add(rp);
var sp = /* @__PURE__ */ W("<div><!></div>");
function ip(e, t) {
  let n = q(t, "class", 3, "");
  var a = sp(), r = N(a);
  Un(r, () => t.children), P(() => ie(a, 1, `lc ${n() ?? ""}`, "svelte-ilxib0")), M(e, a);
}
var op = /* @__PURE__ */ W('<span><span class="block h-2 w-2 rounded-full border border-dashed border-line-strong"></span></span>');
function lp(e, t) {
  let n = q(t, "class", 3, ""), a = q(t, "title", 3, void 0);
  var r = op();
  P(() => {
    ie(r, 1, `inline-flex shrink-0 items-center justify-center ${n() ?? ""}`), $(r, "role", a() ? "img" : void 0), $(r, "aria-hidden", a() ? void 0 : "true"), $(r, "aria-label", a());
  }), M(e, r);
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
function Mt(...e) {
  return up(hc(e));
}
var dp = /* @__PURE__ */ ue("<title> </title>"), fp = /* @__PURE__ */ ue("<desc> </desc>"), pp = /* @__PURE__ */ ue('<svg><!><!><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"></path></svg>');
function fs(e, t) {
  Se(t, !0);
  const n = gt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let r = q(t, "size", 19, () => n.size || "md"), s = q(t, "color", 19, () => n.color || "currentColor"), i = /* @__PURE__ */ bt(t, [
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
  $e(
    u,
    (b) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: s(),
      ...i,
      class: b,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": l ? o : void 0,
      "aria-hidden": !c
    }),
    [() => Mt("shrink-0", a[r()], t.class)]
  );
  var f = N(u);
  {
    var p = (b) => {
      var g = dp(), m = N(g);
      P(() => {
        $(g, "id", t.title.id), Y(m, t.title.title);
      }), M(b, g);
    };
    D(f, (b) => {
      t.title?.id && t.title.title && b(p);
    });
  }
  var v = I(f);
  {
    var y = (b) => {
      var g = fp(), m = N(g);
      P(() => {
        $(g, "id", t.desc.id), Y(m, t.desc.desc);
      }), M(b, g);
    };
    D(v, (b) => {
      t.desc?.id && t.desc.desc && b(y);
    });
  }
  M(e, u), Ce();
}
var vp = /* @__PURE__ */ ue("<title> </title>"), hp = /* @__PURE__ */ ue("<desc> </desc>"), mp = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m7 16 4-4-4-4m6 8 4-4-4-4"></path></svg>');
function gp(e, t) {
  Se(t, !0);
  const n = gt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let r = q(t, "size", 19, () => n.size || "md"), s = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ bt(t, [
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
  $e(
    f,
    (m) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: s(),
      ...o,
      class: m,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Mt("shrink-0", a[r()], t.class)]
  );
  var p = N(f);
  {
    var v = (m) => {
      var x = vp(), h = N(x);
      P(() => {
        $(x, "id", t.title.id), Y(h, t.title.title);
      }), M(m, x);
    };
    D(p, (m) => {
      t.title?.id && t.title.title && m(v);
    });
  }
  var y = I(p);
  {
    var b = (m) => {
      var x = hp(), h = N(x);
      P(() => {
        $(x, "id", t.desc.id), Y(h, t.desc.desc);
      }), M(m, x);
    };
    D(y, (m) => {
      t.desc?.id && t.desc.desc && m(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var bp = /* @__PURE__ */ ue("<title> </title>"), wp = /* @__PURE__ */ ue("<desc> </desc>"), kp = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m8 10 4 4 4-4"></path></svg>');
function _p(e, t) {
  Se(t, !0);
  const n = gt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let r = q(t, "size", 19, () => n.size || "md"), s = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ bt(t, [
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
  $e(
    f,
    (m) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: s(),
      ...o,
      class: m,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Mt("shrink-0", a[r()], t.class)]
  );
  var p = N(f);
  {
    var v = (m) => {
      var x = bp(), h = N(x);
      P(() => {
        $(x, "id", t.title.id), Y(h, t.title.title);
      }), M(m, x);
    };
    D(p, (m) => {
      t.title?.id && t.title.title && m(v);
    });
  }
  var y = I(p);
  {
    var b = (m) => {
      var x = wp(), h = N(x);
      P(() => {
        $(x, "id", t.desc.id), Y(h, t.desc.desc);
      }), M(m, x);
    };
    D(y, (m) => {
      t.desc?.id && t.desc.desc && m(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var yp = /* @__PURE__ */ ue("<title> </title>"), xp = /* @__PURE__ */ ue("<desc> </desc>"), Sp = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>');
function Cp(e, t) {
  Se(t, !0);
  const n = gt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let r = q(t, "size", 19, () => n.size || "md"), s = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ bt(t, [
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
  $e(
    f,
    (m) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: s(),
      ...o,
      class: m,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Mt("shrink-0", a[r()], t.class)]
  );
  var p = N(f);
  {
    var v = (m) => {
      var x = yp(), h = N(x);
      P(() => {
        $(x, "id", t.title.id), Y(h, t.title.title);
      }), M(m, x);
    };
    D(p, (m) => {
      t.title?.id && t.title.title && m(v);
    });
  }
  var y = I(p);
  {
    var b = (m) => {
      var x = xp(), h = N(x);
      P(() => {
        $(x, "id", t.desc.id), Y(h, t.desc.desc);
      }), M(m, x);
    };
    D(y, (m) => {
      t.desc?.id && t.desc.desc && m(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var Ap = /* @__PURE__ */ ue("<title> </title>"), Tp = /* @__PURE__ */ ue("<desc> </desc>"), Mp = /* @__PURE__ */ ue('<svg><!><!><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd"></path></svg>');
function _c(e, t) {
  Se(t, !0);
  const n = gt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let r = q(t, "size", 19, () => n.size || "md"), s = q(t, "color", 19, () => n.color || "currentColor"), i = /* @__PURE__ */ bt(t, [
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
  $e(
    u,
    (b) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: s(),
      ...i,
      class: b,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": l ? o : void 0,
      "aria-hidden": !c
    }),
    [() => Mt("shrink-0", a[r()], t.class)]
  );
  var f = N(u);
  {
    var p = (b) => {
      var g = Ap(), m = N(g);
      P(() => {
        $(g, "id", t.title.id), Y(m, t.title.title);
      }), M(b, g);
    };
    D(f, (b) => {
      t.title?.id && t.title.title && b(p);
    });
  }
  var v = I(f);
  {
    var y = (b) => {
      var g = Tp(), m = N(g);
      P(() => {
        $(g, "id", t.desc.id), Y(m, t.desc.desc);
      }), M(b, g);
    };
    D(v, (b) => {
      t.desc?.id && t.desc.desc && b(y);
    });
  }
  M(e, u), Ce();
}
var Ep = /* @__PURE__ */ ue("<title> </title>"), Lp = /* @__PURE__ */ ue("<desc> </desc>"), Np = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M6 18 17.94 6M18 18 6.06 6"></path></svg>');
function Rp(e, t) {
  Se(t, !0);
  const n = gt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let r = q(t, "size", 19, () => n.size || "md"), s = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ bt(t, [
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
  $e(
    f,
    (m) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: s(),
      ...o,
      class: m,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Mt("shrink-0", a[r()], t.class)]
  );
  var p = N(f);
  {
    var v = (m) => {
      var x = Ep(), h = N(x);
      P(() => {
        $(x, "id", t.title.id), Y(h, t.title.title);
      }), M(m, x);
    };
    D(p, (m) => {
      t.title?.id && t.title.title && m(v);
    });
  }
  var y = I(p);
  {
    var b = (m) => {
      var x = Lp(), h = N(x);
      P(() => {
        $(x, "id", t.desc.id), Y(h, t.desc.desc);
      }), M(m, x);
    };
    D(y, (m) => {
      t.desc?.id && t.desc.desc && m(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var Op = /* @__PURE__ */ ue("<title> </title>"), Dp = /* @__PURE__ */ ue("<desc> </desc>"), Fp = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M8 8v8m0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0a4 4 0 0 1-4 4h-1a3 3 0 0 0-3 3"></path></svg>');
function Ip(e, t) {
  Se(t, !0);
  const n = gt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let r = q(t, "size", 19, () => n.size || "md"), s = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ bt(t, [
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
  $e(
    f,
    (m) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: s(),
      ...o,
      class: m,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Mt("shrink-0", a[r()], t.class)]
  );
  var p = N(f);
  {
    var v = (m) => {
      var x = Op(), h = N(x);
      P(() => {
        $(x, "id", t.title.id), Y(h, t.title.title);
      }), M(m, x);
    };
    D(p, (m) => {
      t.title?.id && t.title.title && m(v);
    });
  }
  var y = I(p);
  {
    var b = (m) => {
      var x = Dp(), h = N(x);
      P(() => {
        $(x, "id", t.desc.id), Y(h, t.desc.desc);
      }), M(m, x);
    };
    D(y, (m) => {
      t.desc?.id && t.desc.desc && m(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var Pp = /* @__PURE__ */ ue("<title> </title>"), jp = /* @__PURE__ */ ue("<desc> </desc>"), Wp = /* @__PURE__ */ ue('<svg><!><!><path fill-rule="evenodd" d="M3 6a3 3 0 1 1 4 2.83v6.34a3.001 3.001 0 1 1-2 0V8.83A3.001 3.001 0 0 1 3 6Zm11.207-2.707a1 1 0 0 1 0 1.414L13.914 5H15a4 4 0 0 1 4 4v6.17a3.001 3.001 0 1 1-2 0V9a2 2 0 0 0-2-2h-1.086l.293.293a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414l2-2a1 1 0 0 1 1.414 0Z" clip-rule="evenodd"></path></svg>');
function Bp(e, t) {
  Se(t, !0);
  const n = gt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let r = q(t, "size", 19, () => n.size || "md"), s = q(t, "color", 19, () => n.color || "currentColor"), i = /* @__PURE__ */ bt(t, [
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
  $e(
    u,
    (b) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: s(),
      ...i,
      class: b,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": l ? o : void 0,
      "aria-hidden": !c
    }),
    [() => Mt("shrink-0", a[r()], t.class)]
  );
  var f = N(u);
  {
    var p = (b) => {
      var g = Pp(), m = N(g);
      P(() => {
        $(g, "id", t.title.id), Y(m, t.title.title);
      }), M(b, g);
    };
    D(f, (b) => {
      t.title?.id && t.title.title && b(p);
    });
  }
  var v = I(f);
  {
    var y = (b) => {
      var g = jp(), m = N(g);
      P(() => {
        $(g, "id", t.desc.id), Y(m, t.desc.desc);
      }), M(b, g);
    };
    D(v, (b) => {
      t.desc?.id && t.desc.desc && b(y);
    });
  }
  M(e, u), Ce();
}
var zp = /* @__PURE__ */ ue("<title> </title>"), Hp = /* @__PURE__ */ ue("<desc> </desc>"), Vp = /* @__PURE__ */ ue('<svg><!><!><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0V8Zm-1 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z" clip-rule="evenodd"></path></svg>');
function Ba(e, t) {
  Se(t, !0);
  const n = gt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let r = q(t, "size", 19, () => n.size || "md"), s = q(t, "color", 19, () => n.color || "currentColor"), i = /* @__PURE__ */ bt(t, [
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
  $e(
    u,
    (b) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: s(),
      ...i,
      class: b,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": l ? o : void 0,
      "aria-hidden": !c
    }),
    [() => Mt("shrink-0", a[r()], t.class)]
  );
  var f = N(u);
  {
    var p = (b) => {
      var g = zp(), m = N(g);
      P(() => {
        $(g, "id", t.title.id), Y(m, t.title.title);
      }), M(b, g);
    };
    D(f, (b) => {
      t.title?.id && t.title.title && b(p);
    });
  }
  var v = I(f);
  {
    var y = (b) => {
      var g = Hp(), m = N(g);
      P(() => {
        $(g, "id", t.desc.id), Y(m, t.desc.desc);
      }), M(b, g);
    };
    D(v, (b) => {
      t.desc?.id && t.desc.desc && b(y);
    });
  }
  M(e, u), Ce();
}
var Up = /* @__PURE__ */ ue("<title> </title>"), qp = /* @__PURE__ */ ue("<desc> </desc>"), Gp = /* @__PURE__ */ ue('<svg><!><!><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd"></path></svg>');
function Kp(e, t) {
  Se(t, !0);
  const n = gt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let r = q(t, "size", 19, () => n.size || "md"), s = q(t, "color", 19, () => n.color || "currentColor"), i = /* @__PURE__ */ bt(t, [
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
  $e(
    u,
    (b) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: s(),
      ...i,
      class: b,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": l ? o : void 0,
      "aria-hidden": !c
    }),
    [() => Mt("shrink-0", a[r()], t.class)]
  );
  var f = N(u);
  {
    var p = (b) => {
      var g = Up(), m = N(g);
      P(() => {
        $(g, "id", t.title.id), Y(m, t.title.title);
      }), M(b, g);
    };
    D(f, (b) => {
      t.title?.id && t.title.title && b(p);
    });
  }
  var v = I(f);
  {
    var y = (b) => {
      var g = qp(), m = N(g);
      P(() => {
        $(g, "id", t.desc.id), Y(m, t.desc.desc);
      }), M(b, g);
    };
    D(v, (b) => {
      t.desc?.id && t.desc.desc && b(y);
    });
  }
  M(e, u), Ce();
}
var Yp = /* @__PURE__ */ ue("<title> </title>"), $p = /* @__PURE__ */ ue("<desc> </desc>"), Qp = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z"></path></svg>');
function Zp(e, t) {
  Se(t, !0);
  const n = gt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let r = q(t, "size", 19, () => n.size || "md"), s = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ bt(t, [
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
  $e(
    f,
    (m) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: s(),
      ...o,
      class: m,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Mt("shrink-0", a[r()], t.class)]
  );
  var p = N(f);
  {
    var v = (m) => {
      var x = Yp(), h = N(x);
      P(() => {
        $(x, "id", t.title.id), Y(h, t.title.title);
      }), M(m, x);
    };
    D(p, (m) => {
      t.title?.id && t.title.title && m(v);
    });
  }
  var y = I(p);
  {
    var b = (m) => {
      var x = $p(), h = N(x);
      P(() => {
        $(x, "id", t.desc.id), Y(h, t.desc.desc);
      }), M(m, x);
    };
    D(y, (m) => {
      t.desc?.id && t.desc.desc && m(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var Xp = /* @__PURE__ */ ue("<title> </title>"), Jp = /* @__PURE__ */ ue("<desc> </desc>"), ev = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"></path></svg>');
function tv(e, t) {
  Se(t, !0);
  const n = gt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let r = q(t, "size", 19, () => n.size || "md"), s = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ bt(t, [
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
  $e(
    f,
    (m) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: s(),
      ...o,
      class: m,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Mt("shrink-0", a[r()], t.class)]
  );
  var p = N(f);
  {
    var v = (m) => {
      var x = Xp(), h = N(x);
      P(() => {
        $(x, "id", t.title.id), Y(h, t.title.title);
      }), M(m, x);
    };
    D(p, (m) => {
      t.title?.id && t.title.title && m(v);
    });
  }
  var y = I(p);
  {
    var b = (m) => {
      var x = Jp(), h = N(x);
      P(() => {
        $(x, "id", t.desc.id), Y(h, t.desc.desc);
      }), M(m, x);
    };
    D(y, (m) => {
      t.desc?.id && t.desc.desc && m(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var nv = /* @__PURE__ */ ue("<title> </title>"), av = /* @__PURE__ */ ue("<desc> </desc>"), rv = /* @__PURE__ */ ue('<svg><!><!><path stroke="currentColor" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path></svg>');
function yc(e, t) {
  Se(t, !0);
  const n = gt("iconCtx") ?? {}, a = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let r = q(t, "size", 19, () => n.size || "md"), s = q(t, "color", 19, () => n.color || "currentColor"), i = q(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ bt(t, [
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
  var f = rv();
  $e(
    f,
    (m) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: s(),
      ...o,
      class: m,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Mt("shrink-0", a[r()], t.class)]
  );
  var p = N(f);
  {
    var v = (m) => {
      var x = nv(), h = N(x);
      P(() => {
        $(x, "id", t.title.id), Y(h, t.title.title);
      }), M(m, x);
    };
    D(p, (m) => {
      t.title?.id && t.title.title && m(v);
    });
  }
  var y = I(p);
  {
    var b = (m) => {
      var x = av(), h = N(x);
      P(() => {
        $(x, "id", t.desc.id), Y(h, t.desc.desc);
      }), M(m, x);
    };
    D(y, (m) => {
      t.desc?.id && t.desc.desc && m(b);
    });
  }
  var g = I(y);
  P(() => $(g, "stroke-width", i())), M(e, f), Ce();
}
var sv = /* @__PURE__ */ W("<span><!></span>"), iv = /* @__PURE__ */ ue('<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7.5" class="sm-pm-disc svelte-1cj69fi"></circle><path class="sm-pm-pie svelte-1cj69fi"></path></svg>'), ov = /* @__PURE__ */ ue('<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M9 5.5v13M15 5.5v13"></path></svg>'), lv = /* @__PURE__ */ ue('<path d="M12 6v7M12 18h.01"></path>'), cv = /* @__PURE__ */ ue('<path d="M12 4a8 8 0 1 1-8 8"></path>'), uv = /* @__PURE__ */ ue('<path d="M12 7v5l3 2"></path>'), dv = /* @__PURE__ */ ue('<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><!></svg>'), fv = /* @__PURE__ */ W("<span><!></span>"), pv = /* @__PURE__ */ W('<span class="h-2 w-2 rounded-full ring-[1.5px] ring-inset ring-fg-subtle"></span>'), vv = /* @__PURE__ */ W('<span class="h-1.5 w-1.5 rounded-full bg-success-solid"></span>'), hv = /* @__PURE__ */ W('<span class="sr-only"> </span>'), mv = /* @__PURE__ */ W('<span class="relative inline-flex h-4 w-4 shrink-0 items-center justify-center"><!> <!></span>');
function ga(e, t) {
  let n = q(t, "label", 3, void 0), a = q(t, "resolved", 3, !1), r = q(t, "tone", 3, void 0), s = q(t, "progress", 3, null);
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
  }, o = "bg-subtle ring-line text-fg-subtle", l = /* @__PURE__ */ V(() => s() != null && (t.state === "checking" || t.state === "deploying") ? Math.max(0, Math.min(1, s())) : null), c = /* @__PURE__ */ V(() => {
    if (d(l) == null || d(l) <= 0) return "";
    if (d(l) >= 1) return "M8 3.75a4.25 4.25 0 1 1 0 8.5a4.25 4.25 0 1 1 0-8.5Z";
    const m = d(l) * 2 * Math.PI, x = 4.25, h = 8 + x * Math.sin(m), C = 8 - x * Math.cos(m);
    return `M8 8V3.75A${x} ${x} 0 ${d(l) > 0.5 ? 1 : 0} 1 ${h.toFixed(3)} ${C.toFixed(3)}Z`;
  }), u = /* @__PURE__ */ V(() => t.state === "approval" ? void 0 : a() ? o : i[t.state]);
  var f = mv(), p = N(f);
  {
    var v = (m) => {
      var x = sv(), h = N(x);
      yc(h, { class: "h-3 w-3", "aria-hidden": "true" }), P(() => ie(
        x,
        1,
        `sm-ask inline-flex h-4 w-4 items-center justify-center rounded-full ${r() === "held" ? "sm-ask-held text-held" : r() === "neutral" ? "sm-ask-neutral text-fg-muted" : "text-fg"}`,
        "svelte-1cj69fi"
      )), M(m, x);
    }, y = (m) => {
      var x = le(), h = ne(x);
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
                var B = (O) => {
                  var z = ov();
                  M(O, z);
                }, j = (O) => {
                  var z = dv(), te = N(z);
                  {
                    var ae = (K) => {
                      var J = lv();
                      M(K, J);
                    }, re = (K) => {
                      var J = le(), Z = ne(J);
                      {
                        var R = (ee) => {
                          var X = cv();
                          M(ee, X);
                        }, U = (ee) => {
                          var X = uv();
                          M(ee, X);
                        };
                        D(
                          Z,
                          (ee) => {
                            t.state === "deploying" ? ee(R) : ee(U, !1);
                          },
                          !0
                        );
                      }
                      M(K, J);
                    };
                    D(te, (K) => {
                      t.state === "failed" || t.state === "stuck" ? K(ae) : K(re, !1);
                    });
                  }
                  P(() => ie(z, 0, Kr(t.state === "deploying" ? "sm-spin" : ""), "svelte-1cj69fi")), M(O, z);
                };
                D(F, (O) => {
                  t.state === "held" ? O(B) : O(j, !1);
                });
              }
              P(() => ie(T, 1, `inline-flex h-4 w-4 items-center justify-center rounded-full ring-1 ring-inset ${d(u) ?? ""}`, "svelte-1cj69fi")), M(k, T);
            }, L = (k) => {
              var T = le(), F = ne(T);
              {
                var B = (O) => {
                  lp(O, {});
                }, j = (O) => {
                  var z = le(), te = ne(z);
                  {
                    var ae = (K) => {
                      var J = pv();
                      M(K, J);
                    }, re = (K) => {
                      var J = vv();
                      M(K, J);
                    };
                    D(
                      te,
                      (K) => {
                        t.state === "behind" ? K(ae) : K(re, !1);
                      },
                      !0
                    );
                  }
                  M(O, z);
                };
                D(
                  F,
                  (O) => {
                    t.state === "none" ? O(B) : O(j, !1);
                  },
                  !0
                );
              }
              M(k, T);
            };
            D(
              S,
              (k) => {
                d(u) ? k(w) : k(L, !1);
              },
              !0
            );
          }
          M(A, E);
        };
        D(
          h,
          (A) => {
            d(l) != null ? A(C) : A(_, !1);
          },
          !0
        );
      }
      M(m, x);
    };
    D(p, (m) => {
      t.state === "approval" ? m(v) : m(y, !1);
    });
  }
  var b = I(p, 2);
  {
    var g = (m) => {
      var x = hv(), h = N(x);
      P(() => Y(h, n())), M(m, x);
    };
    D(b, (m) => {
      n() && m(g);
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
], go = 6, bv = {
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
function $t(e) {
  if (!e) return go;
  const t = bv[e.toLowerCase().split(/[-_./\s:]/, 1)[0]];
  if (t !== void 0) return t;
  for (const n of gv)
    if (n.pattern.test(e)) return n.rank;
  return go;
}
function Ti(e, t) {
  const n = $t(e), a = $t(t);
  return n !== a ? n - a : e.localeCompare(t);
}
const ir = ["dev", "test", "staging", "prod"], wv = {
  dev: "dev",
  development: "dev",
  test: "test",
  qa: "test",
  staging: "staging",
  stage: "staging",
  preprod: "staging",
  prod: "prod",
  production: "prod"
}, ps = "default";
function Ut(e) {
  if (!e) return null;
  const t = wv[e];
  if (t) return t;
  const n = $t(e);
  return n <= 1 ? "dev" : n <= 3 ? "test" : n <= 5 ? "staging" : n === 6 ? null : "prod";
}
function qn(e) {
  return e.spec?.site || e.status?.wave?.site || ps;
}
function Mi(e) {
  return e.spec?.wave ?? e.status?.wave?.wave ?? 1;
}
function Ei(e) {
  return e.status?.wave?.role ?? null;
}
function br(e) {
  const t = e.spec?.name || e.metadata?.name || "";
  return t.startsWith("kuberik-") ? t : `kuberik-${t}`;
}
const Nt = (e) => Ut(e) ?? e, _t = {
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
}, Ts = (e) => e.split(",").map((t) => Number(t)).filter((t) => Number.isFinite(t));
function kv(e, t) {
  const n = { kind: "unparsed", reason: e, raw: t };
  try {
    let a;
    switch (e) {
      case "WaitingFor":
        return (a = t.match(_t.bakeEnded)) ? {
          kind: "member",
          tier: Nt(a[1]),
          site: a[2],
          what: "bake",
          outcome: a[3],
          rev: a[4]
        } : (a = t.match(_t.bakeOn)) ? { kind: "member", tier: Nt(a[1]), site: a[2], what: "bake", rev: a[3] } : (a = t.match(_t.bake)) ? { kind: "member", tier: Nt(a[1]), site: a[2], what: "bake" } : (a = t.match(_t.selection)) ? { kind: "member", tier: Nt(a[1]), site: a[2], what: "selection" } : (a = t.match(_t.noSites)) ? { kind: "noSites", tier: Nt(a[1]) } : n;
      case "WaitingForCandidate":
        return t.trim() ? { kind: "candidate", rev: t.trim() } : n;
      case "Pinned":
        return (a = t.match(_t.pinned)) ? { kind: "pinned", pinned: a[1], selected: a[2] } : n;
      case "InvalidTopology":
        return (a = t.match(_t.gap)) ? {
          kind: "gap",
          tier: Nt(a[1]),
          waves: Ts(a[2]),
          missing: Ts(a[3]),
          startsAtOne: !0
        } : (a = t.match(_t.start)) ? {
          kind: "gap",
          tier: Nt(a[1]),
          waves: Ts(a[2]),
          missing: [],
          startsAtOne: !1
        } : (a = t.match(_t.selfUp)) ? { kind: "selfUpstream", tier: Nt(a[1]) } : (a = t.match(_t.alias)) ? {
          kind: "aliasTier",
          names: a[1].split(/, | and /).map((r) => r.trim()).filter(Boolean),
          tier: Nt(a[2])
        } : n;
      case "UnknownTier":
        return (a = t.match(_t.unknownTier)) ? { kind: "unknownTier", name: a[1] } : n;
      case "LockstepWaiting":
        return (a = t.match(_t.lockstep)) ? { kind: "lockstep", tier: Nt(a[1]), site: a[2], rev: a[3] } : n;
      case "DuplicateSite":
        return (a = t.match(_t.duplicate)) ? {
          kind: "duplicate",
          site: a[1],
          tier: Nt(a[2]),
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
  const n = e.reason || t, a = e.environment ? Nt(e.environment) : "";
  switch (n) {
    case "WaitingFor":
      return e.site && e.waitingOn === "Selection" ? { kind: "member", tier: a, site: e.site, what: "selection" } : e.waitingOn === "Sites" && a ? { kind: "noSites", tier: a } : e.waitingOn === "Bake" && a ? {
        kind: "member",
        tier: a,
        site: e.site || ps,
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
function or(e) {
  try {
    const t = e.status?.conditions?.find((r) => r.type === "WaveReady");
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
function bo(e, t) {
  const n = ir.indexOf(e.tier) - ir.indexOf(t.tier);
  return n || (e.wave !== t.wave ? e.wave - t.wave : e.isLeader !== t.isLeader ? e.isLeader ? -1 : 1 : e.site < t.site ? -1 : e.site > t.site ? 1 : 0);
}
const wo = (e) => e.status?.conditions?.some(
  (t) => t.type === "WaveReady" && t.status === "False" && t.reason === "DuplicateSite"
) ?? !1;
function yv(e, t) {
  const n = [], a = /* @__PURE__ */ new Map(), r = (u, f) => {
    const p = `${u}\0${f}`;
    let v = a.get(p);
    return v || a.set(p, v = { tier: u, site: f, memberOwn: !1, duplicates: [] }), v;
  }, s = [];
  for (const u of t) {
    const f = Ut(u.spec?.environment);
    if (!f) {
      n.push(u);
      continue;
    }
    wo(u) ? s.push({ env: u, tier: f }) : r(f, qn(u)).env ??= u;
  }
  for (const { env: u, tier: f } of s) r(f, qn(u)).duplicates.push(u);
  for (const u of t) {
    const f = Ut(u.spec?.environment), p = qn(u), v = !wo(u);
    for (const y of u.status?.wave?.members ?? []) {
      const b = Ut(y.environment);
      if (!b) continue;
      const g = r(b, y.site), m = v && b === f && y.site === p;
      (!g.member || m && !g.memberOwn) && (g.member = y, g.memberOwn = m);
    }
  }
  const i = (u) => u.env ? Mi(u.env) : u.member?.wave ?? 1, o = /* @__PURE__ */ new Map();
  for (const u of a.values()) {
    const f = `${u.tier}\0${i(u)}`, p = o.get(f);
    p ? p.push(u) : o.set(f, [u]);
  }
  const l = (u) => !!u.member?.deregistered, c = [];
  for (const u of ir) {
    const f = /* @__PURE__ */ new Map(), p = [];
    for (const [v, y] of o) {
      if (!v.startsWith(u + "\0")) continue;
      const b = Number(v.slice(u.length + 1)), g = y.filter((A) => !l(A)).map((A) => A.site), m = y.map((A) => A.env?.status?.wave).filter((A) => !!A), h = m.find((A) => A?.leader)?.leader ?? (g.length ? g.reduce((A, E) => E < A ? E : A) : null), C = m.find((A) => A?.site === h && A?.selectedRevision)?.selectedRevision ?? m.find((A) => A?.selectedRevision)?.selectedRevision, _ = y.map((A) => {
        const E = l(A), S = !E && A.site === h;
        return {
          tier: u,
          site: A.site,
          wave: b,
          role: A.env && Ei(A.env) || (S ? "Leader" : "Follower"),
          isLeader: S,
          env: A.env,
          member: A.member,
          revision: A.member?.revision,
          bakeStatus: A.member?.bakeStatus,
          deregistered: E,
          duplicates: A.duplicates,
          ready: A.env ? or(A.env) : void 0
        };
      });
      _.sort(bo), f.set(b, { wave: b, leader: h, selectedRevision: C, sites: _ }), p.push(..._);
    }
    p.length && (p.sort(bo), c.push({
      tier: u,
      waves: [...f.values()].sort((v, y) => v.wave - y.wave),
      sites: p,
      liveCount: p.filter((v) => !v.deregistered).length
    }));
  }
  return { deployName: e, tiers: c, unplaced: n };
}
function vs(e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e ?? []) {
    if (!a) continue;
    const r = br(a), s = t.get(r);
    s ? s.push(a) : t.set(r, [a]);
  }
  const n = /* @__PURE__ */ new Map();
  for (const [a, r] of t) n.set(a, yv(a, r));
  return n;
}
const ko = (e) => !e.deregistered;
function Li(e, t) {
  const n = e.tiers.find((r) => r.tier === t.tier);
  if (!n) return [];
  const a = n.waves.find((r) => r.wave === t.wave);
  if (!t.isLeader) {
    const r = a?.sites.find((s) => s.isLeader);
    return r && r !== t ? [r] : [];
  }
  for (let r = t.wave - 1; r >= 1; r--) {
    const s = n.waves.find((i) => i.wave === r)?.sites.filter(ko) ?? [];
    if (s.length) return s;
  }
  for (let r = ir.indexOf(t.tier) - 1; r >= 0; r--) {
    const s = e.tiers.find((i) => i.tier === ir[r]);
    if (s)
      for (let i = s.waves.length - 1; i >= 0; i--) {
        const o = s.waves[i].sites.filter(ko);
        if (o.length) return o;
      }
  }
  return [];
}
function Ni(e, t) {
  if (!e) return;
  const n = Ut(t.spec?.environment);
  if (!n) return;
  const a = qn(t);
  return e.tiers.find((r) => r.tier === n)?.sites.find((r) => r.env === t || r.site === a);
}
function xv(e, t) {
  const n = e?.tiers.find((a) => a.tier === t.tier);
  return n && n.liveCount > 1 ? `${t.tier}-${t.site}` : t.tier;
}
function Sv(e, t) {
  const n = Ut(e.spec?.environment);
  if (!n) return e.spec?.environment ?? "";
  const a = t?.tiers.find((r) => r.tier === n);
  return a && a.liveCount > 1 ? `${n}-${qn(e)}` : n;
}
const _o = /* @__PURE__ */ new WeakMap();
function Nn(e, t) {
  let n = _o.get(t);
  return n || _o.set(t, n = vs(t)), Sv(e, n.get(br(e)));
}
const Cv = "dashboard.rollout.kuberik.com/theme", Av = "dashboard.rollout.kuberik.com/theme-color", yo = "dashboard.rollout.kuberik.com/theme-label", _n = {
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
function Yr(e) {
  const t = e.trim();
  if (!Ev.test(t)) return null;
  if (t.length === 4) {
    const [, n, a, r] = t;
    return `#${n}${n}${a}${a}${r}${r}`.toLowerCase();
  }
  return t.toLowerCase();
}
function xo(e) {
  const t = Yr(e);
  return t ? {
    r: parseInt(t.slice(1, 3), 16),
    g: parseInt(t.slice(3, 5), 16),
    b: parseInt(t.slice(5, 7), 16)
  } : { r: 37, g: 99, b: 235 };
}
function aa(e, t, n) {
  const a = xo(e), r = xo(t), s = (o, l) => Math.round(o * (1 - n) + l * n), i = (o) => o.toString(16).padStart(2, "0");
  return `#${i(s(a.r, r.r))}${i(s(a.g, r.g))}${i(
    s(a.b, r.b)
  )}`;
}
function Nv(e) {
  return {
    textColor: aa(e, "#000000", 0.18),
    borderColor: aa(e, "#ffffff", 0.64),
    surfaceColor: aa(e, "#ffffff", 0.9),
    darkSurfaceColor: aa(e, "#000000", 0.7),
    darkTextColor: aa(e, "#ffffff", 0.42),
    // gray-700 is `.dark .chip-env`'s old border mix target.
    darkBorderColor: aa(e, "#364153", 0.62)
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
  themeName: r,
  themeValue: s
}) {
  return e || (s && a ? a.label : s && n || r === "custom" ? t || "Custom" : t || a?.label || Rv(r));
}
function Fv(e, t, n, a, r) {
  const s = Yr(a) ?? "#2563eb";
  return {
    name: e,
    label: t,
    environmentName: n,
    color: s,
    ...r ?? Nv(s)
  };
}
function lr(e, t, n) {
  const a = e?.metadata?.annotations, r = typeof t == "string" ? t : t?.spec?.environment, s = (typeof t == "object" && t && r ? n : void 0) || r || (t && typeof t == "object" ? e?.metadata?.labels?.environment?.trim() : void 0) || void 0, i = a?.[Cv]?.trim(), o = a?.[Av]?.trim();
  if (!i && !o && !s) return null;
  const l = Ut(r) ?? s, c = l ? Ov(l) : null, u = i ? Lv(i) : c ?? (o ? "custom" : ""), f = u ? Tv[u] : void 0, p = o ? Yr(o) : null, v = i ? Yr(i) : null, y = p ?? v ?? f?.color;
  if (!y) return null;
  const b = Dv({
    annotationLabel: a?.[yo]?.trim(),
    environmentName: s,
    inlineThemeColor: v,
    preset: f,
    themeName: u,
    themeValue: i
  }), g = s || a?.[yo]?.trim() || "", m = f && !p && !v ? f.ramp : void 0;
  return Fv(u, b, g, y, m);
}
function fa(e) {
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
function hs(e) {
  if (!e) return "";
  const t = (typeof e == "string" ? e : e.environmentName || e.name || e.label || "").toLowerCase();
  return Iv[t] || t;
}
const So = {
  production: "prod",
  development: "dev",
  testing: "test",
  stage: "staging"
};
function xc(e) {
  const t = (e ?? "").trim(), n = /^(\d+)\s+([a-z]+)\s+(regions?)$/i.exec(t);
  if (n) {
    const i = n[2].toLowerCase();
    return { tier: So[i] ?? i, place: `${n[1]} ${n[3].toLowerCase()}` };
  }
  const a = t.indexOf("-"), r = (a < 0 ? t : t.slice(0, a)).toLowerCase(), s = a < 0 ? "" : t.slice(a + 1);
  return { tier: So[r] ?? r, place: s || null };
}
var Pv = /* @__PURE__ */ W('<!> <span class="min-w-0 truncate"> </span>', 1), jv = /* @__PURE__ */ W('<span class="chip-value-wrap hit-32"><a><span class="min-w-0 truncate"> </span></a></span>'), Wv = /* @__PURE__ */ W('<a><span class="min-w-0 truncate"> </span></a>'), Bv = /* @__PURE__ */ W('<span><span class="min-w-0 truncate"> </span></span>'), zv = /* @__PURE__ */ W("<span><span><!></span> <!></span>"), Hv = /* @__PURE__ */ W('<span><span class="min-w-0 truncate"> </span></span>'), Vv = /* @__PURE__ */ W('<span><span class="chip chip-env-name chip-env-tier t-chip"> </span> <span><span class="min-w-0 truncate"> </span></span></span>'), Uv = /* @__PURE__ */ W("<span> </span>"), qv = /* @__PURE__ */ W("<span><!></span>");
function Ri(e, t) {
  Se(t, !0);
  const n = (z) => {
    var te = Pv(), ae = ne(te);
    {
      var re = (R) => {
        var U = le(), ee = ne(U);
        Un(ee, () => t.icon), M(R, U);
      }, K = (R) => {
        var U = le(), ee = ne(U);
        {
          var X = (G) => {
            Zp(G, { class: "mr-[3px] h-3 w-3 shrink-0", "aria-hidden": "true" });
          };
          D(
            ee,
            (G) => {
              d(k) && G(X);
            },
            !0
          );
        }
        M(R, U);
      };
      D(ae, (R) => {
        t.icon ? R(re) : R(K, !1);
      });
    }
    var J = I(ae, 2), Z = N(J);
    P(() => Y(Z, s())), M(z, te);
  }, a = (z, te = ht) => {
    var ae = le(), re = ne(ae);
    {
      var K = (Z) => {
        var R = jv(), U = N(R), ee = N(U), X = N(ee);
        P(() => {
          ie(U, 1, `chip-value t-code-sm ${l() ? "chip-value--dim" : ""}`), $(U, "href", o()), $(U, "title", t.valueTitle ?? i()), Y(X, i());
        }), M(Z, R);
      }, J = (Z) => {
        var R = le(), U = ne(R);
        {
          var ee = (G) => {
            var se = Wv(), de = N(se), ce = N(de);
            P(() => {
              ie(se, 1, `chip-value t-code-sm ${te() ? `chip-value--solo ${y()}` : ""} ${l() ? "chip-value--dim" : ""}`), $(se, "href", o()), $(se, "title", t.valueTitle ?? i()), Y(ce, i());
            }), M(G, se);
          }, X = (G) => {
            var se = Bv(), de = N(se), ce = N(de);
            P(() => {
              ie(se, 1, `chip-value t-code-sm ${te() ? `chip-value--solo ${y()}` : ""} ${l() ? "chip-value--dim" : ""}`), $(se, "title", t.valueTitle ?? i()), Y(ce, i());
            }), M(G, se);
          };
          D(
            U,
            (G) => {
              o() ? G(ee) : G(X, !1);
            },
            !0
          );
        }
        M(Z, R);
      };
      D(re, (Z) => {
        o() && !te() ? Z(K) : Z(J, !1);
      });
    }
    M(z, ae);
  };
  let r = q(t, "role", 3, "rank"), s = q(t, "label", 3, ""), i = q(t, "value", 3, null), o = q(t, "valueHref", 3, null), l = q(t, "valueDim", 3, !1), c = q(t, "theme", 3, null);
  q(t, "dot", 3, !0);
  let u = q(t, "wide", 3, !1), f = q(t, "valueIsBuild", 3, !0), p = q(t, "regionOnly", 3, !1), v = q(t, "soft", 3, !1), y = q(t, "class", 3, "");
  Ln(() => {
  });
  const b = /* @__PURE__ */ V(() => i() !== null && i() !== void 0 && i() !== ""), g = /* @__PURE__ */ V(() => r() === "env" && !d(b) ? xc(s()) : null), m = /* @__PURE__ */ V(() => d(b) && s() === "");
  let x = /* @__PURE__ */ Ee(null);
  Ln(() => {
  }), Ln(() => {
  });
  const h = "border-line text-fg-subtle", C = "border-line text-success", _ = "border-line text-held", A = "border-danger-line bg-danger-tint text-danger", w = {
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
    count: h,
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
    unranked: h,
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
  }, L = /* @__PURE__ */ new Set(["newest", "head", "rank", "diverged", "unranked"]), k = /* @__PURE__ */ V(() => !t.icon && d(b) && f() && L.has(r())), T = /* @__PURE__ */ V(() => u() ? "chip-wide" : r() === "env" ? "" : d(k) ? "max-w-[calc(14ch+40px)]" : "max-w-[calc(14ch+26px)]");
  var F = le(), B = ne(F);
  {
    var j = (z) => {
      a(z, () => !0);
    }, O = (z) => {
      var te = le(), ae = ne(te);
      {
        var re = (J) => {
          var Z = zv(), R = N(Z), U = N(R);
          n(U);
          var ee = I(R, 2);
          a(ee, () => !1), An(Z, (X) => he(x, X), () => d(x)), P(
            (X) => {
              ie(Z, 1, `chip-joined ${y() ?? ""}`), ie(R, 1, `chip ${r() === "env" ? "chip-env-name t-ui-sm" : "t-chip"} ${w[r()] ?? ""} ${d(T) ?? ""}`), ot(R, X), $(R, "title", t.title ?? s());
            },
            [
              () => r() === "env" && c() ? fa(c()) : void 0
            ]
          ), M(J, Z);
        }, K = (J) => {
          var Z = le(), R = ne(Z);
          {
            var U = (X) => {
              var G = le(), se = ne(G);
              {
                var de = (Q) => {
                  var fe = Hv(), me = N(fe), ve = N(me);
                  An(fe, (Ne) => he(x, Ne), () => d(x)), P(() => {
                    ie(fe, 1, `chip chip-env-name chip-env-place chip-env-region ${u() ? "chip-wide" : ""} ${y() ?? ""}`), $(fe, "data-env", s()), $(fe, "title", t.title ?? s()), Y(ve, d(g).place);
                  }), M(Q, fe);
                }, ce = (Q) => {
                  var fe = le(), me = ne(fe);
                  {
                    var ve = (Ve) => {
                      var _e = Vv(), Xe = N(_e), ze = N(Xe), Oe = I(Xe, 2), Qe = N(Oe), H = N(Qe);
                      An(_e, (oe) => he(x, oe), () => d(x)), P(
                        (oe, pe) => {
                          ie(_e, 1, `chip-joined chip-env-badge ${v() ? "chip-env-soft" : ""} ${y() ?? ""}`), $(_e, "data-env", s()), ot(_e, oe), $(_e, "title", t.title ?? s()), Y(ze, d(g).tier), ie(Oe, 1, `chip chip-env-name chip-env-place t-ui-sm ${u() ? "chip-wide" : ""} ${pe ?? ""}`), Y(H, d(g).place);
                        },
                        [
                          () => c() ? fa(c()) : void 0,
                          () => /^\d+ regions?$/.test(d(g).place) ? "chip-env-place--count" : ""
                        ]
                      ), M(Ve, _e);
                    }, Ne = (Ve) => {
                      var _e = Uv(), Xe = N(_e);
                      An(_e, (ze) => he(x, ze), () => d(x)), P(
                        (ze) => {
                          ie(_e, 1, `chip chip-env-name chip-env-tier t-chip ${v() ? "chip-env-soft" : ""} ${y() ?? ""}`), $(_e, "data-env", s()), ot(_e, ze), $(_e, "title", t.title ?? s()), Y(Xe, d(g).tier);
                        },
                        [
                          () => c() ? fa(c()) : void 0
                        ]
                      ), M(Ve, _e);
                    };
                    D(
                      me,
                      (Ve) => {
                        d(g).place ? Ve(ve) : Ve(Ne, !1);
                      },
                      !0
                    );
                  }
                  M(Q, fe);
                };
                D(se, (Q) => {
                  d(g).place && p() ? Q(de) : Q(ce, !1);
                });
              }
              M(X, G);
            }, ee = (X) => {
              var G = qv(), se = N(G);
              n(se), An(G, (de) => he(x, de), () => d(x)), P(
                (de) => {
                  ie(G, 1, `chip ${r() === "env" ? "chip-env-name t-ui-sm" : "t-chip"} ${w[r()] ?? ""} ${d(T) ?? ""} ${y() ?? ""}`), ot(G, de), $(G, "title", t.title ?? s());
                },
                [
                  () => r() === "env" && c() ? fa(c()) : void 0
                ]
              ), M(X, G);
            };
            D(
              R,
              (X) => {
                d(g) ? X(U) : X(ee, !1);
              },
              !0
            );
          }
          M(J, Z);
        };
        D(
          ae,
          (J) => {
            d(b) ? J(re) : J(K, !1);
          },
          !0
        );
      }
      M(z, te);
    };
    D(B, (z) => {
      d(m) ? z(j) : z(O, !1);
    });
  }
  M(e, F), Ce();
}
const Co = {
  Succeeded: "deploy succeeded",
  Failed: "deploy failed",
  InProgress: "checking",
  Deploying: "deploying",
  Cancelled: "stopped",
  None: "no deploy yet"
};
function Gv(e) {
  return Co[e ?? "None"] ?? Co.None;
}
const Ao = {
  Succeeded: "The deploy finished and passed its checks",
  Failed: "The deploy failed",
  InProgress: "The new version is live and is being watched before the deploy counts as done",
  Deploying: "The new version is still going out",
  Cancelled: "The deploy was stopped before it finished",
  None: "Nothing has been deployed here yet"
};
function Kv(e) {
  return Ao[e ?? "None"] ?? Ao.None;
}
const Yv = "";
function $r(e) {
  return e === "/" ? "/" : `${Yv}${e}`;
}
const Sc = "rollout-dashboard.kuberik.com/source-cluster", $v = "rollout-dashboard.kuberik.com/source-dashboard";
function Ta(e) {
  return e?.metadata?.annotations?.[Sc] ?? "";
}
function ba(e) {
  return e?.metadata?.annotations?.[$v] ?? "";
}
function Oi(e, t) {
  return Ta(e) === Ta(t) && e.metadata?.namespace === t.metadata?.namespace && t.spec?.rolloutRef?.name === e.metadata?.name;
}
function Di(e, t, n, a) {
  const r = `/rollouts/${encodeURIComponent(e)}/${encodeURIComponent(t)}/${encodeURIComponent(n)}`;
  return $r(r);
}
function Qv(e) {
  let t = e.trim();
  const n = t.match(/^[\w.-]+@([\w.-]+):(.+)$/);
  return n ? t = `${n[1]}/${n[2]}` : t = t.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, ""), t = t.replace(/\/(tree|blob)\/.*$/, ""), t = t.replace(/\.git\/?$/, "").replace(/\/+$/, ""), t.toLowerCase();
}
function Cc(e, t) {
  return e ? `repo:${Qv(e)}` : `app:${t}`;
}
function To(e, t) {
  return Cc(e?.status?.source, t);
}
function Zv(e) {
  return e.startsWith("repo:") ? e.slice(5) : e.startsWith("app:") ? e.slice(4) : e;
}
function ni(e) {
  return e.startsWith("app:") ? `${e.slice(4)} (no linked repository)` : Zv(e);
}
function ms(e, t) {
  if (!t) return "";
  for (const n of e?.status?.availableReleases ?? [])
    if (n.tag === t) return ge(n);
  for (const n of e?.status?.history ?? [])
    if (n.version?.tag === t) return ge(n.version);
  return xt(t);
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
function za(e) {
  for (const { key: t, pattern: n } of Xv)
    if (n.test(e)) return Jv[t];
  return e.toUpperCase();
}
function Ac(e, t) {
  const n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
  for (const r of t) {
    const s = r.spec?.rolloutRef?.name;
    if (!s) continue;
    const i = e.find((c) => Oi(c, r));
    if (!i) continue;
    a.add(i);
    let o = n.get(s);
    o || (o = { appName: s, hasEnvironmentBinding: !0, cells: [] }, n.set(s, o));
    const l = To(i, s);
    o.cells.push({
      envName: r.spec?.environment ? Nn(r, t) : "",
      tier: Ut(r.spec?.environment),
      site: qn(r),
      wave: Mi(r),
      role: Ei(r),
      ready: or(r).ready,
      environment: r,
      rollout: i,
      theme: lr(
        i,
        r,
        r.spec?.environment ? Nn(r, t) : null
      ),
      sourceURL: ba(r),
      sourceCluster: Ta(r),
      repoKey: l,
      repoLabel: ni(l)
    });
  }
  for (const r of e) {
    const s = r.metadata?.name;
    if (!s || a.has(r)) continue;
    let i = n.get(s);
    i || (i = { appName: s, hasEnvironmentBinding: !1, cells: [] }, n.set(s, i));
    const o = To(r, s);
    i.cells.push({
      envName: r.metadata?.namespace || "",
      tier: null,
      site: null,
      wave: null,
      role: null,
      ready: null,
      environment: null,
      rollout: r,
      theme: lr(r),
      sourceURL: ba(r),
      sourceCluster: Ta(r),
      repoKey: o,
      repoLabel: ni(o)
    });
  }
  for (const r of n.values())
    r.cells.sort((s, i) => Ti(s.envName, i.envName));
  return n;
}
function eh(e) {
  if (!e) return 0;
  const t = new Date(e).getTime();
  return Number.isFinite(t) ? t : 0;
}
function Ms(e) {
  return e && ge(e) || null;
}
function th(e) {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), s = (u) => {
    const f = Ms(u);
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
      s(p);
      const y = Ms(p);
      if (!y) return;
      const b = f.length - 1 - v;
      r.set(y, Math.max(r.get(y) ?? -1 / 0, b));
    });
  }
  i = !1;
  for (const u of e)
    (u.rollout.status?.history ?? []).forEach((p, v) => {
      s(p.version);
      const y = Ms(p.version);
      if (!y) return;
      const b = p.timestamp ? new Date(p.timestamp).getTime() : NaN;
      if (Number.isFinite(b) && n.set(y, Math.max(n.get(y) ?? -1 / 0, b)), v === 0) {
        const g = $t(u.tier ?? u.envName);
        a.set(y, Math.min(a.get(y) ?? 1 / 0, g));
      }
    });
  const o = [...t.values()].sort((u, f) => {
    if (f.createdMs !== u.createdMs) return f.createdMs - u.createdMs;
    const p = r.get(u.version) ?? Number.POSITIVE_INFINITY, v = r.get(f.version) ?? Number.POSITIVE_INFINITY;
    if (p !== v) return p - v;
    const y = a.get(u.version) ?? Number.POSITIVE_INFINITY, b = a.get(f.version) ?? Number.POSITIVE_INFINITY;
    if (y !== b) return y - b;
    const g = n.get(u.version), m = n.get(f.version);
    return g !== void 0 && m !== void 0 && g !== m ? m - g : u.version.localeCompare(f.version);
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
  const r = a.createdMs > 0 ? a.createdMs : n;
  return !Number.isFinite(r) || r <= 0 ? !1 : r >= e.releaseLineOldestMs;
}
function ah(e) {
  const t = e.rollout?.status?.history?.[0]?.version;
  return t && ge(t) || null;
}
function rh(e) {
  const t = e.rollout?.status?.history?.[0]?.timestamp;
  if (!t) return 0;
  const n = new Date(t).getTime();
  return Number.isFinite(n) ? n : 0;
}
function sh(e) {
  const t = th(e.cells), n = /* @__PURE__ */ new Map();
  for (const a of e.cells) {
    const r = ah(a);
    if (!r) {
      n.set(a, { kind: "unknown" });
      continue;
    }
    if (nh(t, r, rh(a))) {
      n.set(a, { kind: "diverged" });
      continue;
    }
    const s = Ea(a.rollout);
    if (s !== null) {
      n.set(a, s === 0 ? { kind: "newest" } : { kind: "behind", by: s });
      continue;
    }
    const i = a.rollout?.status;
    if (!(!Array.isArray(i?.availableReleases) && !Array.isArray(i?.releaseCandidates))) {
      n.set(a, { kind: "unknown" });
      continue;
    }
    const l = t.rankOf(r);
    l < 0 ? n.set(a, { kind: "unknown" }) : l === 0 ? n.set(a, { kind: "newest" }) : n.set(a, { kind: "behind", by: l });
  }
  return n;
}
function ih(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of Ac(e, t).values()) {
    const r = sh(a);
    for (const s of a.cells) n.set(s.rollout, r.get(s) ?? { kind: "unknown" });
  }
  return n;
}
function Mo({ builds: e }) {
  return `${e} build${e === 1 ? "" : "s"} behind`;
}
function gs(e) {
  return e.kind === "behind" ? e.by : 0;
}
function cr(e) {
  return e.statusKey === "failed" || e.stuck != null || e.checkFailure != null;
}
function oh(e) {
  return e.statusKey === "succeeded" && e.stuck == null && e.checkFailure == null;
}
function lh(e) {
  return oh(e) && (gs(e.rank) > 0 || e.rank.kind === "diverged");
}
function Fi(e) {
  return lh(e) && (e.held || e.pinnedVersion != null);
}
const ch = {
  held: !1,
  cause: null,
  waitsForEnv: null,
  frontier: null,
  waitingBehind: []
}, uh = "its upstream environment";
function Eo(e) {
  const t = $t(e);
  return t <= 1 ? 0 : t <= 3 ? 1 : t <= 5 ? 2 : t === 6 ? 3 : 4;
}
function dh(e) {
  return e.kind !== "promotion" || e.subjectKind !== "environment" || !e.subject || e.subject === uh ? null : e.subject;
}
function fh(e, t) {
  const n = Eo(t);
  let a = null, r = null, s = !1, i = !1;
  for (const o of e) {
    const l = dh(o), c = o.upstreamTier ?? l;
    if (!c) {
      i = !0;
      continue;
    }
    const u = Eo(c);
    u < n ? a || (a = l ?? c, r = o) : u === n && (l ?? c) !== t && (o.upstreamTier ? a || (a = l ?? c, r = o) : s = !0);
  }
  return { chainUpstream: a, chainGate: r, order: s, unresolved: i };
}
function ph(e, t) {
  const n = [], a = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  for (const s of e) {
    const i = Ii(s.classifiedGates, t, { hasContract: s.contracts.length > 0 });
    if (!i.held && i.waitsForEnv) {
      a.has(i.waitsForEnv) || (n.push(i.waitsForEnv), r.set(i.waitsForEnv, i.waveWait ?? null)), a.set(i.waitsForEnv, (a.get(i.waitsForEnv) ?? 0) + 1);
      continue;
    }
    return {
      frontier: {
        build: s.build,
        held: i.held,
        cause: i.cause,
        causeLabel: Mc(s.classifiedGates, i.cause)
      },
      waitingBehind: n.map((o) => ({ stage: o, count: a.get(o) ?? 0, ...r.get(o) ? { wave: r.get(o) } : {} }))
    };
  }
  return { frontier: null, waitingBehind: n.map((s) => ({ stage: s, count: a.get(s) ?? 0, ...r.get(s) ? { wave: r.get(s) } : {} })) };
}
function Tc(e, t) {
  if (e.candidates === void 0) {
    if (!e.blocked) return ch;
    const r = Ii(e.gates, t);
    return r.held ? {
      held: !0,
      cause: r.cause,
      waitsForEnv: null,
      frontier: { build: "", held: !0, cause: r.cause, causeLabel: Mc(e.gates, r.cause) },
      waitingBehind: r.waitsForEnv ? [{ stage: r.waitsForEnv, count: 1 }] : []
    } : {
      held: !1,
      cause: null,
      waitsForEnv: r.waitsForEnv,
      ...r.waveWait ? { waveWait: r.waveWait } : {},
      frontier: null,
      waitingBehind: r.waitsForEnv ? [{ stage: r.waitsForEnv, count: 1, ...r.waveWait ? { wave: r.waveWait } : {} }] : []
    };
  }
  const { frontier: n, waitingBehind: a } = ph(e.candidates, t);
  return n ? { held: n.held, cause: n.cause, waitsForEnv: null, frontier: n, waitingBehind: a } : { held: !1, cause: null, waitsForEnv: a[0]?.stage ?? null, ...a[0]?.wave ? { waveWait: a[0].wave } : {}, frontier: null, waitingBehind: a };
}
const vh = { held: !1, cause: null, waitsForEnv: null };
function hh(e) {
  return !e || !e.short || / to deploy (it first|this build)$/.test(e.short) ? null : e.short;
}
function Ii(e, t, n = {}) {
  const a = e.filter((v) => v.clears === "upstream"), r = a.filter((v) => v.kind === "promotion"), { chainUpstream: s, chainGate: i, order: o, unresolved: l } = fh(r, t);
  if (s) {
    const v = hh(i);
    return { held: !1, cause: null, waitsForEnv: s, ...v ? { waveWait: v } : {} };
  }
  const c = e.filter((v) => v.clears === "person"), u = e.filter((v) => v.clears === "unknown"), f = e.filter((v) => v.clears === "clock"), p = e.filter((v) => v.clears === "check");
  return c.length > 0 ? { held: !0, cause: "person", waitsForEnv: null } : u.length > 0 ? { held: !0, cause: "unknown", waitsForEnv: null } : a.some((v) => v.kind === "dependency") || n.hasContract ? { held: !0, cause: "dependency", waitsForEnv: null } : o ? { held: !0, cause: "order", waitsForEnv: null } : f.length > 0 ? { held: !0, cause: "clock", waitsForEnv: null } : p.length > 0 ? { held: !0, cause: "check", waitsForEnv: null } : l ? { held: !0, cause: "unknown", waitsForEnv: null } : vh;
}
function mh(e, t) {
  return Ii(e.classifiedGates, t);
}
function gh(e, t, n) {
  const a = [], r = [], s = [];
  for (const i of e.held) {
    const o = mh(i, t);
    o.held ? a.push(i) : o.waitsForEnv && n?.(i, o.waitsForEnv) ? s.push({ entry: i, stage: o.waitsForEnv }) : r.push({ entry: i, stage: o.waitsForEnv });
  }
  return { held: a, waiting: r, skipped: s };
}
function Mc(e, t) {
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
      return n.length > 0 ? Ma(n) : "a dependency";
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
function Ec(e, t, n) {
  return `${e ?? ""}|${t}/${n}`;
}
function wh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e ?? []) {
    const a = Ec(Ta(n), n.metadata.namespace, n.metadata.name);
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
const Lc = jt({ zone: typeof localStorage > "u" ? "local" : _h() });
function Nc() {
  return Lc.zone === "utc" ? "UTC" : void 0;
}
function yh(e = /* @__PURE__ */ new Date()) {
  const t = (r) => new Intl.DateTimeFormat(r, { timeZone: Nc(), timeZoneName: "short" }).formatToParts(e).find((s) => s.type === "timeZoneName")?.value ?? "", n = t("en-US");
  if (n && !n.startsWith("GMT")) return n;
  const a = t("en-GB");
  return a && !a.startsWith("GMT") ? a : n || a || (Lc.zone === "utc" ? "UTC" : "");
}
const xh = "gate.kuberik.com/pretty-name";
function Rc(e) {
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
function Pi(e, t) {
  return t || (Ah(e) ? "Gate" : Sh(e));
}
function Th(e, t = /* @__PURE__ */ new Date()) {
  const n = new Date(e).getTime() - t.getTime();
  if (!Number.isFinite(n) || n <= 0) return null;
  const a = Math.floor(n / 6e4), r = Math.floor(a / 60), s = Math.floor(r / 24);
  return s > 0 ? `${s}d ${r % 24}h` : r > 0 ? `${r}h ${a % 60}m` : `${a}m`;
}
function Mh(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : `${t.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !1,
    timeZone: Nc()
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
function Ct(e, t = {}) {
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
const Nh = (e) => Ct("approval", { yours: e }), Lo = ["failed", "awaiting-approval", "held-by-rule", "checking", "deploying", "rolled-back", "healthy"], Rh = (e) => {
  const t = Lo.indexOf(e ?? "");
  return t < 0 ? Lo.length : t;
};
function Oh(e) {
  return Dh(e).join(" · ");
}
function Dh(e) {
  const t = e.required ? ` ${e.required}` : "", n = [`Needs ${e.provider}${t}`];
  return e.has && n.push(`has ${e.has}`), n;
}
function Oc(e) {
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
    ...Dt,
    subject: e.provider,
    subjectKind: "service",
    predicate: e.required ? `ships ${e.required}` : "ships a newer version",
    contract: null,
    have: e.has ?? null,
    need: e.required ?? null
  };
}
function Dc(e, t) {
  return e.kind !== "dependency" ? !1 : e.id && t.some((n) => n.gate === e.id) ? !0 : !!e.subject && t.some((n) => n.provider === e.subject);
}
const Dt = {
  subject: null,
  subjectKind: null,
  predicate: null,
  contract: null,
  have: null,
  need: null
}, Ha = {
  promotion: /* @__PURE__ */ new Map(),
  dependency: /* @__PURE__ */ new Map(),
  schedule: /* @__PURE__ */ new Map(),
  owners: /* @__PURE__ */ new Map(),
  sources: { environments: !1, dependencies: !1 },
  schedulesLoaded: !1,
  schedulesExpected: !0
}, jn = (e, t) => `${e ?? ""}/${t}`;
function Fh(e) {
  return Rc(e);
}
function Ih(e, t) {
  const n = t.get(br(e)), a = Ni(n, e), r = or(e), s = {
    tier: a?.tier ?? null,
    site: a?.site ?? e?.spec?.site ?? ps,
    wave: a?.wave ?? e?.spec?.wave ?? 1,
    role: a?.role ?? "Leader",
    upstream: [],
    upstreamSites: [],
    upstreamTier: null,
    upstreamWave: null,
    via: null,
    selected: null,
    ready: r.ready === null && !r.raw ? null : r
  };
  if (!n || !a) return s;
  const i = Li(n, a);
  s.upstream = i.map((l) => xv(n, l)), s.upstreamSites = i.map((l) => l.site), i.length && (s.upstreamTier = i[0].tier, s.upstreamWave = i[0].wave, s.via = a.isLeader ? i[0].tier === a.tier ? "wave" : "tier" : "follow");
  const o = n.tiers.find((l) => l.tier === a.tier)?.waves.find((l) => l.wave === a.wave);
  return s.selected = o?.selectedRevision ? o.selectedRevision.slice(0, 7) : null, s;
}
function ji(e) {
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
  for (const r of e?.rolloutGates?.items ?? []) {
    const s = r?.metadata?.name;
    if (!s) continue;
    const i = (r?.metadata?.ownerReferences ?? []).find((l) => l?.controller === !0), o = Rc(r?.metadata);
    o && t.pretty.set(jn(r?.metadata?.namespace, s), o), t.owners.set(jn(r?.metadata?.namespace, s), {
      kind: i?.kind ?? null,
      name: i?.name ?? null
    });
  }
  const n = e?.environments?.items ?? [], a = vs(n);
  for (const r of n) {
    const s = r?.status?.rolloutGateRef?.name;
    s && t.promotion.set(jn(r?.metadata?.namespace, s), Ih(r, a));
  }
  for (const r of e?.rolloutDependencies?.items ?? []) {
    const s = r?.status?.gateName;
    if (!s) continue;
    const i = [
      ...new Set(
        (r?.status?.blockedReleases ?? []).map((o) => o?.requiredVersion).filter(Boolean)
      )
    ];
    t.dependency.set(jn(r?.metadata?.namespace, s), {
      provider: r?.spec?.providerRef?.name ?? "another service",
      contract: r?.spec?.contract ?? "dependency",
      providedVersion: r?.status?.providedVersion ?? null,
      requiredVersion: i.length === 1 ? i[0] : null
    });
  }
  return t;
}
function ai(e, t, n) {
  const a = {
    ...e,
    schedule: new Map(e.schedule),
    schedulesLoaded: !0
  };
  for (const r of n ?? []) {
    const s = r?.status?.active === !0, i = r?.spec?.action;
    if (!(i === "Allow" && !s || i === "Deny" && s)) continue;
    const l = Fh(r?.metadata) || r?.metadata?.name || "a deploy window";
    for (const c of r?.status?.managedGates ?? [])
      a.schedule.set(jn(t, c), {
        label: l,
        nextTransition: r?.status?.nextTransition ?? null,
        // ⭐ P2, operator-walk finding — see `ClassifiedGate.timezone`'s
        // own comment. The schedule's IANA zone, carried through so the
        // gate's clause can be formatted against IT, not the reader's.
        timezone: r?.spec?.timezone ?? null
      });
  }
  return a;
}
const nn = (e) => e ? e.slice(0, 7) : "";
function ri(e, t, n) {
  return e === ps && t !== n ? t : e;
}
function Ph(e, t, n) {
  const a = { clearsAt: null, timezone: null, ...Dt };
  switch (t.kind) {
    case "member": {
      const r = ri(t.site, t.tier, n), s = nn(t.rev);
      if (t.what === "selection")
        return {
          id: e,
          kind: "promotion",
          clears: "upstream",
          label: "after " + r + " picks",
          clause: r + " picks a build",
          short: "Waiting for " + r + " to pick a build",
          ...a,
          subject: r,
          subjectKind: "environment",
          predicate: "picks a build"
        };
      if (t.outcome) {
        const o = t.outcome === "failed" ? "failed" : "was cancelled", l = r + "'s check " + o + (s ? " on " + s : "");
        return {
          id: e,
          kind: "promotion",
          clears: "upstream",
          label: r + " is " + (Ct("failed") ?? "failing").toLowerCase(),
          clause: l,
          short: l,
          ...a,
          subject: r,
          subjectKind: "environment",
          predicate: "check " + o
        };
      }
      const i = "finish " + (Ct("checking") ?? "checking").toLowerCase() + " " + (s || "the build");
      return {
        id: e,
        kind: "promotion",
        clears: "upstream",
        label: r + " is " + (Ct("checking") ?? "checking").toLowerCase(),
        clause: r + " to " + i,
        short: "Waiting for " + r + " to " + i,
        ...a,
        subject: r,
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
        label: "waiting for " + nn(t.rev),
        clause: nn(t.rev) + " is available on this cluster",
        short: "Waiting for " + nn(t.rev) + " to become available on this cluster",
        ...a
      };
    case "pinned":
      return {
        id: e,
        kind: "promotion",
        clears: "person",
        label: "pinned to " + nn(t.pinned),
        clause: "the pin on " + nn(t.pinned) + " is cleared",
        short: "Pinned to " + nn(t.pinned) + ", the wave selected " + nn(t.selected),
        ...a
      };
    case "gap": {
      let r;
      if (t.missing.length > 0) {
        const s = t.missing.length;
        r = t.tier + " has no wave" + (s === 1 ? " " : "s ") + t.missing.join(", ");
      } else
        r = t.tier + " waves start at " + (t.waves.length ? Math.min(...t.waves) : "?") + ", not 1";
      return {
        id: e,
        kind: "promotion",
        clears: "person",
        label: r,
        clause: r + " (fix the wave numbers)",
        short: r,
        ...a
      };
    }
    case "lockstep": {
      const r = ri(t.site, t.tier, n), s = nn(t.rev);
      return {
        id: e,
        kind: "promotion",
        clears: "upstream",
        label: "lockstep with " + r,
        clause: "lockstep: " + r + " finishes " + s,
        short: "Lockstep: waiting for " + r + " to finish " + s,
        ...a,
        subject: r,
        subjectKind: "environment",
        predicate: "to finish " + s
      };
    }
    case "duplicate": {
      const r = t.owner, s = (r.cluster ? r.cluster + "/" : "") + (r.namespace ? r.namespace + "/" : "") + r.name, i = "Held: another Environment, " + s + ", owns site " + t.site + " of " + t.tier;
      return {
        id: e,
        kind: "promotion",
        clears: "person",
        label: "duplicate site " + t.site,
        clause: s + " gives up site " + t.site + " of " + t.tier + ", or this Environment is annotated environments.kuberik.com/take-over-site=true to take it over",
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
      const r = t.names.join(", ").replace(/, ([^,]*)$/, " and $1") + " are the same tier (" + t.tier + ")";
      return {
        id: e,
        kind: "promotion",
        clears: "person",
        label: r,
        clause: "one name is used per tier (split with sites and waves)",
        short: r + ". Use one name per tier; split with sites and waves.",
        ...a
      };
    }
    case "unknownTier": {
      const r = t.name + " is not a known tier";
      return {
        id: e,
        kind: "promotion",
        clears: "person",
        label: r,
        clause: t.name + " is renamed to dev, test, staging or prod",
        short: r + ". Use dev, test, staging or prod.",
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
  const a = { id: e, kind: "promotion", clears: "upstream", clearsAt: null, timezone: null }, r = t.upstreamSites.map((l) => ri(l, t.upstreamTier ?? "", t.tier));
  if (t.via === "follow") {
    const l = r[0] ?? t.site, c = t.selected ? " (" + t.selected + ")" : "";
    return {
      ...a,
      upstreamTier: t.tier,
      label: "follows " + l + "'s pick" + c,
      clause: t.selected ? l + "'s pick (" + t.selected + ") reaches it" : l + " picks a build",
      short: t.selected ? "Following " + l + "'s pick (" + t.selected + ")" : "Waiting for " + l + " to pick a build",
      ...Dt,
      subject: l,
      subjectKind: "environment",
      predicate: t.selected ? "pick (" + t.selected + ") reaches it" : "picks a build"
    };
  }
  let s = null;
  t.via === "wave" ? s = "wave " + t.upstreamWave + " (" + r.join(", ") + ")" : t.via === "tier" && (s = t.upstreamTier);
  const i = s ?? "its upstream environment", o = s ? "deploys it first" : "deploys this build";
  return {
    ...a,
    upstreamTier: t.via === "wave" ? t.tier : t.upstreamTier,
    label: s ? "after " + s : "after its upstream environment",
    clause: i + " " + o,
    short: s ? "Waiting for " + s + " to deploy it first" : "Waiting for its upstream environment to deploy this build",
    ...Dt,
    subject: i,
    subjectKind: "environment",
    predicate: o
  };
}
function bs(e, t, n = Ha) {
  const a = Bh(e, t, n), r = e?.name ?? "a rule";
  return { ...a, displayName: Pi(r, n.pretty?.get(jn(t, r)) ?? null) };
}
function Bh(e, t, n = Ha) {
  const a = e?.name ?? "a rule", r = jn(t, a), s = n.promotion.get(r);
  if (s) return Wh(a, s);
  const i = n.dependency.get(r);
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
      ...Dt,
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
    const u = n.schedule.get(r);
    return u ? {
      id: a,
      kind: "schedule",
      clears: "clock",
      label: u.label,
      clause: "the deploy window reopens",
      short: `Outside the ${u.label} deploy window`,
      clearsAt: u.nextTransition,
      timezone: u.timezone,
      ...Dt,
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
      ...Dt,
      pending: n.schedulesExpected && !n.schedulesLoaded
    };
  }
  const l = n.owners.get(r);
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
      ...Dt,
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
      ...Dt
    } : {
      id: a,
      kind: "unknown",
      clears: "unknown",
      label: u,
      clause: `${u} allows this build`,
      short: `Held by ${u}`,
      clearsAt: null,
      timezone: null,
      ...Dt
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
    ...Dt
  } : {
    id: a,
    kind: "unknown",
    clears: "unknown",
    label: a,
    clause: `the rule ${a} allows this build`,
    short: `Held by ${a} — this dashboard cannot tell what clears it`,
    clearsAt: null,
    timezone: null,
    ...Dt
  };
}
const No = {
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
function Ma(e) {
  return e.length === 0 ? "" : e.length === 1 ? e[0] : `${e.slice(0, -1).join(", ")} and ${e[e.length - 1]}`;
}
function Vh(e) {
  const t = e.filter((i) => i.clears === "upstream"), n = t.some((i) => i.kind === "promotion"), a = t.filter((i) => i.kind === "dependency");
  if (a.length === 0)
    return "Nobody has to approve anything — this clears when the deploy in front of it lands.";
  const r = a.map((i) => {
    const o = i.subject ?? "the service it depends on";
    return i.contract ? i.need ? `ship ${i.contract} ${i.need} from ${o}` : `ship a newer ${i.contract} from ${o}` : i.need ? `ship ${i.need} from ${o}` : `ship a newer version from ${o}`;
  }), s = n ? ", then the deploy in front of it has to land" : "";
  return `No approval will unblock this. Someone has to ${Ma(r)}${s}; until then the only way forward is a hand-started deploy, which bypasses the check.`;
}
function Fc(e, t, n) {
  const a = e.find((s) => s.kind === "dependency" && s.subject);
  if (!a) return `${t} ${n} waiting on another deploy`;
  const r = a.contract ? a.need ? `ship ${a.contract} ${a.need}` : `ship a newer ${a.contract}` : a.need ? `ship ${a.need}` : "ship a newer version";
  return `${t} ${n} waiting for ${a.subject} to ${r}`;
}
function Uh(e, t, n, a, r) {
  if (e.length <= 1) return null;
  const s = e[0].clears;
  return e.every((i) => i.clears === s) ? s === "person" ? `${n} ${r} waiting on an approval` : s === "unknown" ? `Something is holding ${a}` : s === "upstream" ? Fc(t, n, r) : null : null;
}
function qh(e) {
  const t = e.filter((a) => a.kind === "dependency"), n = e.filter((a) => a.kind !== "dependency");
  return [...t, ...n];
}
function $n(e, t = Ha, n = {}) {
  const a = e?.metadata?.namespace, r = kr(e), s = e?.spec?.wantedVersion ?? null, i = wr(e).length, o = n.place ? n.place : null, l = n.subject, c = typeof l == "object" && l !== null, u = c ? l.lead : l || o || "this service", f = c ? l.object ?? l.lead : u, p = c ? "are" : "is", v = n.now ?? /* @__PURE__ */ new Date();
  if (s) {
    const Q = ms(e, s) || s;
    return {
      ...No,
      candidates: [],
      blocked: i > 0,
      candidateCount: i,
      pinnedTo: s,
      pinnedToDisplay: Q,
      selfClearing: !1,
      // `info` (blue) — pinning is a STATE A PERSON CHOSE, not a rule
      // holding the rollout back. See the field's own doc comment (F2).
      severity: "info",
      headline: `${u} ${p} pinned to ${Q}`,
      consequence: i > 0 ? `${i} newer build${i === 1 ? "" : "s"} ${i === 1 ? "is" : "are"} available and none of them will deploy while the pin is set.` : "Automatic updates are off here until the pin is cleared.",
      verdict: "Clearing the pin is the only thing that restarts automatic deploys.",
      resolution: "Clearing the pin is the only thing that restarts automatic deploys.",
      iconKind: "pinned"
    };
  }
  const y = Ic(e, t, { contractHolds: n.contractHolds });
  if (!y.allHeld)
    return { ...No, candidateCount: i, candidates: y.perBuild };
  const b = r.blockingGates.length > 0 ? new Set(r.blockingGates) : new Set(y.held.flatMap((Q) => Q.gateNames)), g = (e?.status?.gates ?? []).filter((Q) => Q?.name && b.has(Q.name)).map((Q) => bs(Q, a, t)), m = y.held.flatMap((Q) => Q.contracts), x = g.filter(
    (Q) => !(Q.kind === "dependency" && !Q.subject && Dc(Q, m))
  ), h = new Set(
    x.filter((Q) => Q.kind === "dependency" && Q.subject).map((Q) => Q.subject)
  ), C = /* @__PURE__ */ new Map();
  for (const Q of y.held)
    for (const fe of Q.contracts) C.set(fe.provider, fe);
  const _ = [...C.values()].filter((Q) => !h.has(Q.provider)).map((Q) => Oc(Q)), A = [...x, ..._].sort((Q, fe) => {
    const me = { person: 0, unknown: 1, upstream: 2, check: 3, clock: 4 };
    return me[Q.clears] - me[fe.clears] || Q.id.localeCompare(fe.id);
  }), E = A.filter((Q) => Q.clears === "person"), S = A.filter((Q) => Q.clears === "unknown"), w = A.filter((Q) => Q.clears === "upstream"), L = A.filter((Q) => Q.clears === "clock"), k = A.filter((Q) => Q.clears === "check");
  let T = null;
  for (const Q of L)
    Q.clearsAt && (!T || new Date(Q.clearsAt) < new Date(T)) && (T = Q.clearsAt);
  const F = E.length === 0 && w.length === 0 && S.length === 0;
  let B;
  const j = Uh(A, w, u, f, p);
  j ? B = j : A.length > 1 ? B = `${Hh(A.length)} things are holding ${f}` : A.length === 1 && A[0].headline ? B = A[0].headline : E.length === 1 ? B = `${u} ${p} waiting on an approval` : S.length === 1 ? B = `Something is holding ${f}` : w.length === 1 ? B = Fc(w, u, p) : B = `${u} ${p} held`;
  const O = [];
  for (const Q of E) O.push(Q.clause);
  for (const Q of S) O.push(Q.clause);
  for (const Q of qh(w)) O.push(Q.clause);
  for (const Q of k) O.push(Q.clause);
  for (const Q of L) {
    const fe = Q.clearsAt ? Th(Q.clearsAt, v) : null;
    O.push(
      fe ? `${Q.clause} in ${fe} — ${Mh(Q.clearsAt)}` : Q.clause
    );
  }
  const z = gh(y, n.place, n.skipped), te = z.held.length, ae = z.waiting.find((Q) => Q.stage)?.stage ?? null, re = z.skipped[0]?.stage ?? null, K = (Q) => `build${Q === 1 ? "" : "s"}`, J = z.waiting.length, Z = z.skipped.length, U = `${i > 0 ? te > 0 && te < i && (ae || re) ? `${te} newer ${K(te)} ${te === 1 ? "is" : "are"} waiting here` + (J > 0 && ae ? `; ${J} more ${J === 1 ? "hasn't" : "haven't"} reached ${ae} yet` : "") + (Z > 0 && re ? `; ${Z} ${Z === 1 ? "was" : "were"} skipped by ${re}, which runs a newer ${K(1)}` : "") + ". " : `${i} newer build${i === 1 ? "" : "s"} ${i === 1 ? "is" : "are"} waiting. ` : ""}Nothing promotes itself until ${Ma(O)}.`, ee = "A deploy you start by hand still applies immediately.";
  let X, G = !1;
  E.length > 0 ? X = "This will not clear on its own." : S.length > 0 ? X = "This dashboard cannot tell what clears this — it may or may not need a person." : w.length > 0 ? (X = Vh(w), G = w.some((Q) => Q.kind === "dependency")) : T ? X = "This clears on its own." : X = "This clears on its own once the check passes.";
  const se = G ? X : `${X} ${ee}`;
  let de = E.length > 0 ? "person" : S.length > 0 ? "unknown" : w.length > 0 ? w[0].kind === "dependency" ? "dependency" : "promotion" : L.length > 0 ? "clock" : "check";
  const ce = k.some((Q) => Q.pending);
  return de === "check" && ce && (de = "pending"), {
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
    headline: B,
    consequence: U,
    verdict: X,
    resolution: se,
    // ⭐ ALWAYS `warning` HERE. See the field's own doc comment (F2,
    // 2026-09-03): every gate this branch can hold on — person, unknown,
    // upstream, clock, check — is a RULE, not a choice, whether or not it
    // clears on its own. `selfClearing` answers "does this need a
    // person", a different question this field no longer conflates with
    // colour.
    severity: A.some((Q) => Q.fault) ? "error" : "warning",
    iconKind: de,
    kindPending: ce,
    candidates: y.perBuild
  };
}
function Ic(e, t = Ha, n = {}) {
  const a = e?.metadata?.namespace, r = wr(e), s = e?.status?.gates ?? [], i = n.contractHolds, o = r.map((f) => {
    const p = f.tag ?? f.version ?? "", v = ms(e, p) || p, y = Yh(e, p || null), b = new Set(y), g = [...i?.get(v) ?? []], m = s.filter((A) => A?.name && b.has(A.name)).map((A) => bs(A, a, t)).filter((A) => !Dc(A, g)), x = [...new Set(m.map((A) => A.clause))], h = new Set(
      m.filter((A) => A.kind === "dependency" && A.subject).map((A) => A.subject)
    ), C = g.filter((A) => !h.has(A.provider)).map((A) => Oc(A)), _ = [...m, ...C];
    return { build: v, tag: p, gateNames: y, clauses: x, contract: g[0], contracts: g, classifiedGates: _ };
  }), l = o.filter((f) => f.gateNames.length > 0 || f.contracts.length > 0), c = o.filter((f) => f.gateNames.length === 0 && f.contracts.length === 0).map((f) => f.build), u = r.length > 0 && c.length === 0 && l.length > 0;
  return l.length === 0 ? { held: [], deployable: c, anyHeld: !1, allHeld: !1, perBuild: o } : { held: l, deployable: c, anyHeld: !0, allHeld: u, perBuild: o };
}
function Gh(e, t = {}) {
  const n = t.place ?? "this service";
  if ("gates" in e) {
    if (!e.blocked) return null;
    if (e.gates.length === 1 && e.gates[0].headline) return e.gates[0].headline;
    if (e.person.length > 0) return `${n} is waiting on an approval`;
    if (e.unknown.length > 0) return `${n} is waiting on a rule this dashboard cannot attribute`;
    const r = e.upstream.filter((s) => s.kind === "dependency" && s.subject);
    if (r.length > 0) {
      const s = r.map((i) => {
        const o = i.need ? ` ${i.need}` : "";
        return `${i.subject}${o}`;
      });
      return `${n} is waiting for ${Ma(s)}`;
    }
    return e.upstream.some((s) => s.kind === "promotion") ? `${n} is waiting on promotion order` : `${n} is held`;
  }
  const a = e.held.find((r) => r.contracts.length > 0) ?? e.held[0];
  if (!a) return null;
  if (a.contracts.length > 0) {
    const r = a.contracts.map((s) => {
      const i = s.required ? ` ${s.required}` : "";
      return `${s.provider}${i}`;
    });
    return `${n} is waiting for ${Ma(r)}`;
  }
  return a.gateNames.length > 0 ? `${n} is waiting on promotion order` : `${n} is held`;
}
const Kh = 1440 * 60 * 1e3;
function Ea(e) {
  const t = e?.status;
  if (!t) return null;
  const n = t.history?.[0] ? ge(t.history[0].version) : null, a = Array.isArray(t.availableReleases) ? t.availableReleases : null;
  if (a && n !== null) {
    const r = a.findIndex((s) => ge(s) === n);
    return r === -1 ? null : Array.isArray(t.releaseCandidates) ? t.releaseCandidates.length : a.length - 1 - r;
  }
  return Array.isArray(t.releaseCandidates) ? t.releaseCandidates.length : null;
}
function Pc(e) {
  const t = e?.status;
  if (!t) return null;
  if (Array.isArray(t.releaseCandidates))
    return t.releaseCandidates[0] ?? null;
  const n = Ea(e);
  return n && n > 0 && Array.isArray(t.availableReleases) ? t.availableReleases[t.availableReleases.length - 1] ?? null : null;
}
function wa(e, t) {
  return Array.isArray(e.allowedVersions) ? e.allowedVersions.includes(t) : e.passing !== !1;
}
function Yh(e, t) {
  return t ? (e?.status?.gates ?? []).filter((n) => n?.name && !wa(n, t)).map((n) => n.name) : [];
}
function Fr(e) {
  return e.tag ?? e.version ?? e.revision ?? "";
}
function wr(e) {
  const t = e?.status;
  if (!t) return [];
  if (Ea(e) === null) return [];
  if (Array.isArray(t.releaseCandidates)) return t.releaseCandidates;
  const n = Ea(e);
  if (n && n > 0 && Array.isArray(t.availableReleases) && t.history?.[0]) {
    const a = ge(t.history[0].version), r = t.availableReleases.findIndex((s) => ge(s) === a);
    return r >= 0 ? t.availableReleases.slice(r + 1).reverse() : [];
  }
  return [];
}
function $h(e, t) {
  const n = (e?.status?.gates ?? []).find((a) => a?.name === t);
  return n ? wr(e).filter((a) => !wa(n, Fr(a))) : [];
}
function kr(e) {
  const t = e?.status, n = {
    candidateCount: 0,
    deployableCount: 0,
    blocked: !1,
    blockingGates: [],
    awaitingApprovalGates: [],
    notPassingGates: []
  };
  if (!t) return n;
  const a = wr(e);
  if (a.length === 0) return n;
  const r = t.gates ?? [], s = a.filter(
    (p) => r.every((v) => wa(v, Fr(p)))
  ).length, i = a.length > 0 && s === 0, o = r.filter(
    (p) => a.every((v) => !wa(p, Fr(v)))
  );
  let l = o.map((p) => p.name).sort(), c = o;
  if (i && l.length === 0) {
    const p = Pc(e), v = p ? Fr(p) : null;
    v && (c = r.filter((y) => !wa(y, v)), l = c.map((y) => y.name).sort());
  }
  const u = c.filter((p) => Array.isArray(p.allowedVersions)).map((p) => p.name).sort(), f = c.filter((p) => !Array.isArray(p.allowedVersions)).map((p) => p.name).sort();
  return {
    candidateCount: a.length,
    deployableCount: s,
    blocked: i,
    blockingGates: l,
    awaitingApprovalGates: u,
    notPassingGates: f
  };
}
function Wi(e, t, n) {
  if (!t.blocked) return !1;
  const a = e?.metadata?.namespace, r = n ?? Ha, s = new Set(t.blockingGates);
  return (e?.status?.gates ?? []).filter((i) => i?.name && s.has(i.name)).map((i) => bs(i, a, r)).some((i) => i.clears === "person" || i.clears === "unknown");
}
function Qh(e, t) {
  if (e?.spec?.wantedVersion) return null;
  const n = kr(e);
  if (n.candidateCount === 0 || n.blocked && !Wi(e, n, t?.gateContext))
    return null;
  const a = t?.now ?? /* @__PURE__ */ new Date(), r = t?.thresholdMs ?? Kh;
  let i = Pc(e)?.created;
  if (i || (i = e?.status?.history?.[0]?.timestamp), !i) return null;
  const o = new Date(i).getTime();
  if (Number.isNaN(o)) return null;
  const l = a.getTime() - o;
  return l <= r ? null : {
    kind: "promotion",
    candidateCount: n.candidateCount,
    waitingMs: l,
    blockingGates: n.blockingGates
  };
}
function jc(e, t) {
  if (!e || !t) return null;
  const n = e.status?.history ?? [], a = t.status?.history ?? [], r = n[0] ? ge(n[0].version) : null, s = a[0] ? ge(a[0].version) : null;
  if (!r || !s) return null;
  if (r === s) return { kind: "same" };
  const i = Zh(e, t, r, s);
  if (i) return i;
  const o = a.slice(1).some((c) => ge(c.version) === r), l = n.slice(1).some((c) => ge(c.version) === s);
  if (o && !l) {
    const c = [];
    for (const f of a) {
      const p = ge(f.version);
      if (c[c.length - 1] !== p && c.push(p), p === r) break;
    }
    const u = c.indexOf(r);
    return { kind: "behind", otherVersion: s, by: u >= 0 ? u : null };
  }
  if (l && !o) {
    const c = [];
    for (const f of n) {
      const p = ge(f.version);
      if (c[c.length - 1] !== p && c.push(p), p === s) break;
    }
    const u = c.indexOf(s);
    return { kind: "ahead", otherVersion: s, by: u >= 0 ? u : null };
  }
  return { kind: "divergent", otherVersion: s };
}
function Zh(e, t, n, a) {
  for (const r of [e, t]) {
    const s = r.status?.availableReleases;
    if (!Array.isArray(s) || s.length === 0) continue;
    const i = s.findIndex((l) => ge(l) === n), o = s.findIndex((l) => ge(l) === a);
    if (!(i === -1 || o === -1))
      return i === o ? { kind: "same" } : i < o ? { kind: "behind", otherVersion: a, by: o - i } : { kind: "ahead", otherVersion: a, by: i - o };
  }
  return null;
}
function Xh(e, t = {}) {
  if (!e) return null;
  const n = t.now ?? /* @__PURE__ */ new Date(), a = t.bakeThresholdMs ?? 3600 * 1e3, r = e.status?.history?.[0];
  if (!r || !r.timestamp) return null;
  const s = n.getTime() - new Date(r.timestamp).getTime();
  return r.bakeStatus === "InProgress" && s > a ? { kind: "baking", durationMs: s } : r.bakeStatus === "Deploying" && s > a ? { kind: "deploying", durationMs: s } : null;
}
function Jh(e, t, n, a = {}) {
  if (!e || !t || e.spec?.wantedVersion) return null;
  const r = jc(e, t);
  if (!r || r.kind !== "behind") return null;
  const s = kr(e);
  if (s.blocked && !Wi(e, s, a.gateContext))
    return null;
  const i = a.now ?? /* @__PURE__ */ new Date(), o = a.thresholdMs ?? 1440 * 60 * 1e3, l = t.status?.history?.[0]?.timestamp;
  if (!l) return null;
  const c = i.getTime() - new Date(l).getTime();
  return c < o ? null : { kind: "behind", peerEnv: n, peerAdvancedMs: c, behindBy: r.by };
}
function Bi(e) {
  if (!e) return null;
  const t = e.toLowerCase();
  return /health.?check|liveness|readiness|alert|firing|error.?rate/.test(t) ? "healthcheck" : /image.?pull|cannot pull|registry|pullbackoff|errimagepull|imagepullbackoff/.test(t) ? "image" : /gate/.test(t) ? "gate" : /test/.test(t) ? "test" : /timeout|timed out|deadline/.test(t) ? "timeout" : /canary|kruise/.test(t) ? "canary" : /manifest|render|kustom|invalid yaml|invalid spec/.test(t) ? "manifest" : /permission|forbidden|unauthorized|rbac/.test(t) ? "permission" : /crashloop|oom|killed/.test(t) ? "crash" : /network|dial|connection refused|unreachable/.test(t) ? "network" : "failed";
}
function Wc(e) {
  return Bi(e) === "healthcheck" ? "healthcheck" : "deploy";
}
function _r(e, t = /* @__PURE__ */ new Date()) {
  const n = new Date(e), a = Math.max(0, Math.floor((t.getTime() - n.getTime()) / 1e3));
  if (a < 60) return `${a}s`;
  const r = Math.floor(a / 60);
  if (r < 60) return `${r}m`;
  const s = Math.floor(r / 60);
  if (s < 24) return `${s}h`;
  const i = Math.floor(s / 24);
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
function zi(e) {
  if (!e) return 0;
  const t = /(\d+(?:\.\d+)?)(ns|us|µs|μs|ms|h|m|s)/g;
  let n = 0, a;
  for (; a = t.exec(e); ) n += parseFloat(a[1]) * em[a[2]];
  return n;
}
function ge(e) {
  return e.version || e.revision || e.tag;
}
function xt(e) {
  if (!e) return e ?? "";
  if (/^[0-9a-f]{40}$/i.test(e)) return e.slice(0, 7);
  const t = e.match(/^(.+-)([0-9a-f]{12,})$/i);
  return t ? t[1] + t[2].slice(0, 7) : e;
}
function Hi(e) {
  if (!e) return 0;
  if (Array.isArray(e.releaseCandidates)) return e.releaseCandidates.length;
  const t = e.availableReleases ?? [], n = t.findIndex((a) => a.tag === e.currentVersion || a.version === e.currentVersion);
  return n < 0 ? 0 : t.length - 1 - n;
}
function tm(e, t) {
  const n = e?.status;
  return n && Array.isArray(n.releaseCandidates) ? n.releaseCandidates.length : t ? gs(t) : Hi(n);
}
const nm = /* @__PURE__ */ new Set(["dev", "development", "test", "testing", "qa", "staging", "stage", "preprod", "prod", "production", "default"]), Vi = (e) => {
  const t = (e ?? "").trim().toLowerCase();
  return !t || nm.has(t) ? "default" : t;
};
function Va(e) {
  return new Set(e.map(Vi)).size;
}
function Bc(e, t = "") {
  return e > 1 ? `${e} ${t ? t + " " : ""}regions` : null;
}
function am(e, t) {
  const n = Va(e) > 1 ? "regions" : "prod";
  return t ? `${t.length} of ${e.length} ${n}` : `${e.length} ${n}`;
}
const rm = /^HealthCheck '([^']+)' in namespace '[^']*' is not healthy \([^)]*\)(?::\s*(.*))?$/s;
function sm(e) {
  const t = rm.exec(e ?? "");
  return t ? { check: t[1] || null, detail: (t[2] ?? "").trim() || null } : { check: null, detail: null };
}
function im(e) {
  const t = (e?.status?.conditions ?? []).find((s) => s?.type === "DeploymentBlocked");
  if (!t || t.status !== "True") return null;
  const n = t.message ?? "", { check: a, detail: r } = sm(n);
  return { check: a, detail: r, raw: n, since: t.lastTransitionTime ?? null };
}
function om(e) {
  const t = e?.status?.history?.[0];
  if (!t?.timestamp) return null;
  const n = new Date(t.timestamp).getTime(), a = t.lastRetryTimestamp ? new Date(t.lastRetryTimestamp).getTime() : 0, r = Math.max(n, Number.isFinite(a) ? a : 0);
  return Number.isFinite(r) ? new Date(r) : null;
}
function lm(e, t) {
  const n = e?.status?.status;
  if (n === "Failed" || n === "Unhealthy") return "failing";
  if (n !== "Healthy") return "pending";
  const a = e?.status?.lastErrorTime;
  if (!a || !t) return "passing";
  const r = new Date(a).getTime();
  return Number.isFinite(r) && r >= t.getTime() ? "recovered" : "passing";
}
class zc extends Map {
  /** @type {Map<K, Source<number>>} */
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ Ee(0);
  #n = /* @__PURE__ */ Ee(0);
  #a = pn || -1;
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
  #s(t) {
    return pn === this.#a ? /* @__PURE__ */ Ee(t) : Rn(t);
  }
  /** @param {K} key */
  has(t) {
    var n = this.#e, a = n.get(t);
    if (a === void 0) {
      var r = super.get(t);
      if (r !== void 0)
        a = this.#s(0), n.set(t, a);
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
    this.#r(), super.forEach(t, n);
  }
  /** @param {K} key */
  get(t) {
    var n = this.#e, a = n.get(t);
    if (a === void 0) {
      var r = super.get(t);
      if (r !== void 0)
        a = this.#s(0), n.set(t, a);
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
    var a = this.#e, r = a.get(t), s = super.get(t), i = super.set(t, n), o = this.#t;
    if (r === void 0)
      r = this.#s(0), a.set(t, r), he(this.#n, super.size), zt(o);
    else if (s !== n) {
      zt(r);
      var l = o.reactions === null ? null : new Set(o.reactions), c = l === null || !r.reactions?.every(
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
    var n = this.#e, a = n.get(t), r = super.delete(t);
    return a !== void 0 && (n.delete(t), he(this.#n, super.size), he(a, -1), zt(this.#t)), r;
  }
  clear() {
    if (super.size !== 0) {
      super.clear();
      var t = this.#e;
      he(this.#n, 0);
      for (var n of t.values())
        he(n, -1);
      zt(this.#t), t.clear();
    }
  }
  #r() {
    d(this.#t);
    var t = this.#e;
    if (this.#n.v !== t.size) {
      for (var n of super.keys())
        if (!t.has(n)) {
          var a = this.#s(0);
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
    return this.#r(), super.values();
  }
  entries() {
    return this.#r(), super.entries();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  get size() {
    return d(this.#n), super.size;
  }
}
const cm = new zc(), um = (e, t, n) => `${e ?? ""}/${t ?? ""}/${n ?? ""}`, dm = (e) => {
  const t = e.split("/").filter(Boolean);
  return t[0] === "rollouts" && t.length >= 4 ? um(t[1], t[2], t[3]) : null;
}, fm = (e) => cm.get(e) ?? null, pm = new zc(), vm = (e, t, n) => `${e}/${t}/${n}`, hm = (e, t, n) => pm.get(vm(e, t, n)) ?? null;
jt({ disconnected: !1, pending: 0, settled: !1 });
const mm = 10;
function Hc(e) {
  const t = e?.status?.history ?? [], n = e?.spec?.versionHistoryLimit ?? mm;
  return t.length >= n;
}
function Es(e) {
  return e?.tag || e?.version || null;
}
function Ui(e) {
  const t = e?.status?.history ?? [], a = (e?.status?.availableReleases ?? []).map((r) => Es(r));
  return t.map((r, s) => {
    const i = t[s + 1];
    if (!i)
      return Hc(e) ? {
        kind: "unknown",
        word: "Unknown",
        sentence: `What ${ge(r.version)} replaced is unknown — it is the oldest deploy the retained history (last ${t.length}) still holds.`
      } : null;
    const o = Es(r.version), l = Es(i.version);
    if (!o || !l) return null;
    const c = ge(i.version), u = ge(r.version);
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
let Ro = /* @__PURE__ */ Ee({});
const si = {
  get: (e) => d(Ro)[e],
  set: (e) => {
    he(Ro, e);
  }
};
function Vc(e, t = {}) {
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
function Uc(e, t, n = {}) {
  const a = Xh(e, { now: n.now, bakeThresholdMs: n.bakeThresholdMs });
  if (a) return a;
  const r = Qh(e, { now: n.now, gateContext: n.gateContext });
  if (r) return r;
  const s = kr(e);
  if (s.blocked && !Wi(e, s, n.gateContext))
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
function qc(e) {
  return e.state === "gated" || e.state === "pinned" || e.state === "waiting-upstream" ? e.held ?? !0 : !1;
}
function Sm(e) {
  return e.state === "failed" || e.state === "rolled-back";
}
function Oo(e) {
  return Sm(e) ? ra.failed : e.stuck ? ra.stuck : qc(e) ? ra.held : e.state === "live" || e.state === "not-built" ? ra.live : e.state === "queued" ? ra.queued : ra.deploying;
}
function Gc(e) {
  return e.length === 0 ? null : e.reduce((t, n) => {
    const a = Oo(n.cell), r = Oo(t.cell);
    return a !== r ? a < r ? n : t : n.cell.envRank !== t.cell.envRank ? n.cell.envRank < t.cell.envRank ? n : t : n.cell.cluster.localeCompare(t.cell.cluster) < 0 ? n : t;
  });
}
function Lr(e) {
  return e?.tag || e?.version || null;
}
function Cm(e) {
  const t = e?.status?.history ?? [], n = e?.status?.availableReleases ?? [];
  if (t.length < 2 || n.length === 0) return null;
  const a = Lr(t[0]?.version), r = Lr(t[1]?.version);
  if (!a || !r || a === r) return null;
  const s = n.findIndex((o) => Lr(o) === a), i = n.findIndex((o) => Lr(o) === r);
  return s === -1 || i === -1 || s >= i ? null : {
    from: ge(t[1].version),
    to: ge(t[0].version),
    by: i - s
  };
}
function Am(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of t) {
    const r = a.spec?.rolloutRef?.name;
    if (!r || !a.spec?.environment) continue;
    const s = Nn(a, t), i = e.find((o) => Oi(o, a));
    i && (n.has(r) || n.set(r, []), n.get(r).push({ envName: s, rollout: i }));
  }
  for (const a of n.values())
    a.sort((r, s) => Ti(r.envName, s.envName));
  return n;
}
function Tm(e, t, n) {
  if (e.spec?.wantedVersion) return null;
  const a = n.get(e.metadata?.name ?? "");
  if (!a || a.length < 2) return null;
  let r = null;
  for (const o of a) {
    if (o.envName === t) continue;
    const l = jc(e, o.rollout);
    if (!l || l.kind !== "behind") continue;
    const c = { fromEnv: o.envName, version: l.otherVersion, behindBy: l.by };
    (!r || (c.behindBy ?? 0) > (r.behindBy ?? 0)) && (r = c);
  }
  const s = Ea(e);
  if (s === null || s === 0) return r;
  if (r) return { ...r, behindBy: s };
  let i = null;
  for (const o of a) {
    if (o.envName === t) continue;
    const l = Ea(o.rollout);
    if (l === null || l >= s) continue;
    const c = o.rollout.status?.history?.[0]?.version ? ge(o.rollout.status.history[0].version) : null;
    c && (!i || l < i.newer) && (i = { envName: o.envName, version: c, newer: l });
  }
  return i ? { fromEnv: i.envName, version: i.version, behindBy: s } : r;
}
function Mm(e, t, n, a, r) {
  const s = Am(e, t), i = ih(e, t);
  return e.map((o) => {
    const l = o.status?.history?.[0], c = t.find((E) => Oi(o, E)), u = lr(
      o,
      c,
      c?.spec?.environment ? Nn(c, t) : null
    ), f = l?.bakeStatus || "None", p = f === "InProgress" || f === "Deploying";
    let v;
    f === "Failed" ? v = "failed" : p ? v = "active" : l ? v = "succeeded" : v = "pending";
    const y = hs(u), b = c?.spec?.environment ? Nn(c, t) : "", g = i.get(o) ?? { kind: "unknown" }, m = b ? Tm(o, b, s) : null, x = m ? { ...m, behindBy: gs(g) } : null, h = (s.get(o.metadata?.name ?? "") ?? []).filter(
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
    const _ = r ? $n(o, a, { contractHolds: r(o), now: n }) : $n(o, a, { now: n }), A = Tc(_, b);
    return {
      ns: o.metadata?.namespace || "",
      name: o.metadata?.name || "",
      title: o.status?.title || o.metadata?.name || "",
      envKey: u?.name || "",
      envDisplay: y,
      envName: b,
      tier: c ? Ut(c.spec?.environment) : null,
      site: c ? qn(c) : null,
      wave: c ? Mi(c) : null,
      role: c ? Ei(c) : null,
      ready: c ? or(c).ready : null,
      duplicateSite: c ? or(c).blocker?.kind === "duplicate" : !1,
      theme: u,
      version: l?.version ? ge(l.version) : null,
      timestamp: l?.timestamp || null,
      bakeStatus: f,
      statusKey: v,
      isRunning: p,
      bakeStatusMessage: l?.bakeStatusMessage || null,
      failureCategory: f === "Failed" ? Bi(l?.bakeStatusMessage) : null,
      previousSucceededVersion: C,
      pinnedVersion: o.spec?.wantedVersion || null,
      rolledBack: Cm(o),
      stuck: Uc(o, h, { now: n, gateContext: a }),
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
      sourceURL: ba(o),
      sourceCluster: Ta(o)
    };
  });
}
function Qa(e, t, n) {
  const a = ["github.com", e, t].map(encodeURIComponent).join("/");
  return "number" in n ? $r(`/changes/${a}/pull/${n.number}`) : $r(`/changes/${a}/${encodeURIComponent(n.sha)}`);
}
const Em = /^rollout\.kuberik\.com\/substitute\.[^/]+\.from$/;
function Lm(e, t, n) {
  const a = e.metadata?.namespace, r = e.metadata?.name;
  if (!a || !r) return [];
  const s = ba(e), i = /* @__PURE__ */ new Set();
  for (const l of t) {
    if (l.metadata?.namespace !== a || ba(l) !== s) continue;
    const c = l.metadata?.annotations || {};
    if (!Object.entries(c).some(
      ([p, v]) => Em.test(p) && v === r
    )) continue;
    const f = l.status?.inventory?.entries ?? [];
    for (const p of f)
      typeof p?.id == "string" && p.id.endsWith("_rollouts.kruise.io_Rollout") && i.add(p.id);
  }
  if (i.size === 0) return [];
  const o = [];
  for (const l of n) {
    const c = l.metadata?.namespace, u = l.metadata?.name;
    !c || !u || ba(l) === s && i.has(`${c}_${u}_rollouts.kruise.io_Rollout`) && o.push(l);
  }
  return o;
}
function Kc(e, t) {
  const n = t?.status?.history?.[0];
  if (!n || n.bakeStatus !== "Deploying" || !n.timestamp) return !1;
  const a = e.status?.canaryStatus?.lastUpdateTime;
  if (!a) return !1;
  const r = Date.parse(a), s = Date.parse(n.timestamp);
  return Number.isFinite(r) && Number.isFinite(s) && r < s;
}
function Nm(e, t) {
  if (t && Kc(e, t))
    return (e.spec?.strategy?.canary?.steps ?? []).map(() => "pending");
  const n = e.spec?.strategy?.canary?.steps ?? [], a = e.status?.canaryStatus?.currentStepIndex, r = e.status?.canaryStatus?.currentStepState, s = e.status?.conditions ?? [], i = s.some((u) => u.type === "Stalled" && u.status === "True"), o = s.some(
    (u) => u.type === "KuberikBakeHealthy" && u.status === "False"
  ), l = r === "Completed", c = [];
  for (let u = 0; u < n.length; u++) {
    const f = u + 1, p = a === f;
    l || a !== void 0 && f < a ? c.push("done") : p && (i || o) ? c.push("fail") : p ? c.push("active") : c.push("pending");
  }
  return c;
}
function Rm(e, t) {
  return t && Kc(e, t) ? !1 : e.status?.canaryStatus?.currentStepState === "Completed";
}
function Om(e, t) {
  const n = e.status?.history?.[0]?.bakeStatus || "None";
  if (t.length === 0) {
    const [i, o] = Dm(e);
    return { tracks: [{ name: "", stages: [i] }], bake: o };
  }
  const a = t.every((i) => Rm(i, e));
  let r = "pending";
  return a && (n === "Succeeded" ? r = "done" : n === "Failed" ? r = "fail" : n === "InProgress" || n === "Deploying" ? r = "active" : n === "Cancelled" && (r = "cancelled")), { tracks: t.map((i) => ({
    name: i.metadata?.name ?? "",
    stages: Nm(i, e)
  })), bake: r };
}
function Dm(e) {
  const t = e.status?.history?.[0], n = t?.bakeStatus || "None";
  if (n === "Succeeded") return ["done", "done"];
  if (n === "InProgress") return ["done", "active"];
  if (n === "Deploying") return ["active", "pending"];
  if (n === "Cancelled") return ["done", "cancelled"];
  if (n === "Failed") {
    const a = Bi(t?.bakeStatusMessage);
    return a === "test" || a === "image" ? ["fail", "pending"] : ["done", "fail"];
  }
  return ["pending", "pending"];
}
const Gn = ["dev", "test", "staging", "other", "prod"];
function vt(e) {
  const t = Ut(e);
  if (t) return t;
  const n = $t(e);
  return n <= 1 ? "dev" : n <= 3 ? "test" : n <= 5 ? "staging" : n === 6 ? "other" : "prod";
}
const nt = [
  "failed",
  "stuck",
  "held",
  "deploying",
  "checking",
  "behind",
  "newest",
  "none"
];
function ka(e) {
  return e.statusKey === "failed" || e.checkFailure != null ? "failed" : e.stuck != null ? "stuck" : e.bakeStatus === "Deploying" ? "deploying" : e.bakeStatus === "InProgress" ? "checking" : e.statusKey === "pending" || e.bakeStatus === "None" ? "none" : Fi(e) ? "held" : gs(e.rank) > 0 || e.rank.kind === "diverged" ? "behind" : "newest";
}
function Fm(e) {
  const t = hs(e.theme) || e.envName || e.envDisplay || "";
  return {
    card: e,
    tier: vt(e.envName || t),
    env: t,
    state: ka(e),
    behind: tm(e.rollout, e.rank)
  };
}
function Im(e) {
  let t = null;
  for (const n of e)
    (!t || nt.indexOf(n.state) < nt.indexOf(t.state)) && (t = n);
  return t;
}
function Qr(e) {
  return !!(e.envName || hs(e.theme));
}
function Yc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e) {
    if (!Qr(a) || a.duplicateSite) continue;
    const r = t.get(a.name) ?? [];
    r.push(a), t.set(a.name, r);
  }
  const n = [];
  for (const [a, r] of t) {
    const s = r.map(Fm), i = {};
    for (const u of s) (i[u.tier] ??= []).push(u);
    for (const u of Gn) i[u]?.sort((f, p) => f.env.localeCompare(p.env));
    const o = Gn.filter((u) => u !== "prod").flatMap((u) => i[u] ?? []), l = i.prod ?? [], c = Im(s);
    n.push({ app: a, byTier: i, stages: o, prod: l, state: c?.state ?? "none", lead: c });
  }
  return n.sort(
    (a, r) => nt.indexOf(a.state) - nt.indexOf(r.state) || a.app.localeCompare(r.app)
  );
}
function $c(e) {
  if (e.length === 0) return null;
  const t = [...e].sort((a, r) => a - r), n = t.length >> 1;
  return t.length % 2 ? t[n] : Math.round((t[n - 1] + t[n]) / 2);
}
function Do(e) {
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
  const t = [...e].sort((u, f) => u.order - f.order), n = t[0], a = t.filter((u) => u.prod && u !== n), r = a.length > 0 ? a : [t[t.length - 1]];
  if (r.length === 1 && r[0] === n) return null;
  const s = Do(n), i = /* @__PURE__ */ new Map();
  for (const u of r)
    if (u !== n)
      for (const [f, p] of Do(u)) {
        const v = i.get(f);
        (v === void 0 || p < v) && i.set(f, p);
      }
  const o = [];
  for (const [u, f] of s) {
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
    toLabel: a.length > 0 ? "prod" : r[0].label
  };
}
const jm = 36e5, Ls = 24 * jm, Wm = {
  "24h": { span: Ls, bins: 24, label: "last 24 hours", prev: "the 24 hours before" },
  "7d": { span: 7 * Ls, bins: 28, label: "last 7 days", prev: "the 7 days before" },
  "30d": { span: 30 * Ls, bins: 30, label: "last 30 days", prev: "the 30 days before" }
};
function Za(e) {
  const t = e.rollout, n = t.status?.history?.[0]?.version, a = n && ge(n) || null, r = t.status?.availableReleases ?? [], s = r.findIndex((l) => !!l && (l.version === a || l.tag === a)), o = (t.status?.releaseCandidates?.length ? t.status.releaseCandidates : r.slice(s + 1)).filter(
    (l) => !!l?.created
  ).reduce((l, c) => Math.min(l, new Date(c.created).getTime()), 1 / 0);
  return Number.isFinite(o) ? o : null;
}
function sa(e) {
  return ka(e);
}
function Ir(e, t) {
  if (!t.gateContext) return "other";
  const n = $n(e.rollout, t.gateContext, {
    contractHolds: t.contractHoldsFor?.(e.rollout)
  });
  return n.blocked ? n.person.length > 0 ? "approval" : n.upstream.some((a) => a.kind === "dependency") ? "dependency" : n.upstream.some((a) => a.kind === "promotion") ? "order" : "other" : "other";
}
function Bm(e, t) {
  const n = [];
  for (const a of e) {
    const r = t.get(a), s = r ? Qr(r) : !1;
    for (const i of a.status?.history ?? []) {
      if (!i.timestamp) continue;
      const o = new Date(i.timestamp).getTime();
      Number.isFinite(o) && n.push({ ms: o, status: i.bakeStatus ?? "", rollout: a, mapped: s });
    }
  }
  return n;
}
function zm(e) {
  const t = e.rollout.status?.history?.[0];
  return !!t && t.bakeStatus === "Failed" && !!t.timestamp && new Date(t.timestamp).getTime() === e.ms;
}
function Qc() {
  return { failed: 0, stuck: 0, held: 0, deploying: 0, checking: 0, behind: 0, newest: 0 };
}
function ia() {
  return {
    apps: /* @__PURE__ */ new Set(),
    places: 0,
    regions: 0,
    regionNames: /* @__PURE__ */ new Set(),
    placesByState: Qc(),
    worst: /* @__PURE__ */ new Map(),
    causeApps: { order: /* @__PURE__ */ new Set(), approval: /* @__PURE__ */ new Set(), dependency: /* @__PURE__ */ new Set(), other: /* @__PURE__ */ new Set() }
  };
}
function Fo(e, t, n, a) {
  const r = n.state;
  e.apps.add(t);
  const s = e.worst.get(t);
  if ((s == null || nt.indexOf(r) < nt.indexOf(s)) && e.worst.set(t, r), e.places++, n.tier === "prod" && (e.regionNames.add(n.env), e.regions = Va([...e.regionNames])), r in e.placesByState && e.placesByState[r]++, r === "held") {
    const i = Ir(n.card, a);
    e.causeApps[i].add(t);
  }
}
function Io(e) {
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
  const t = Qc();
  for (const n of e.values()) n in t && t[n]++;
  return t;
}
function Vm(e, t, n) {
  const a = [...new Set(e)];
  return a.length === t && a.length > 1 ? [n] : a.length <= 2 ? a.sort(Ti) : [Bc(Va(a), n) ?? a.join(", ")];
}
function Um(e, t, n, a, r = {}) {
  const s = Wm[a], i = n, o = i - s.span, l = o - s.span, c = new Map(e.map((H) => [H.rollout, H])), u = Bm(t, c), f = u.reduce((H, oe) => Math.min(H, oe.ms), 1 / 0), p = Number.isFinite(f) && f <= l + s.span * 0.05;
  let v = 0, y = 0, b = 0, g = 0, m = 0, x = 0;
  for (const H of u)
    H.ms >= o && H.ms <= i ? (v++, H.mapped || b++, H.status === "Failed" && (g++, zm(H) || x++)) : p && H.ms >= l && H.ms < o && (y++, H.status === "Failed" && m++);
  const h = new Set(e.map((H) => H.name)).size, C = e.filter(Qr), _ = new Set(C.map((H) => H.name)).size, A = e.length, E = C.length, S = e.filter((H) => vt(H.envName) === "prod").length, w = Yc(e), L = e.filter((H) => sa(H) === "held"), k = w.filter((H) => H.state === "held"), T = k.flatMap(
    (H) => [...H.stages, ...H.prod].filter((oe) => oe.state === "held").map((oe) => oe.card)
  ), F = new Set(w.map((H) => H.app)), B = /* @__PURE__ */ new Map();
  for (const H of e) {
    const oe = B.get(H.name) ?? [];
    oe.push(H), B.set(H.name, oe);
  }
  const j = [...B.keys()].filter((H) => !F.has(H)), O = /* @__PURE__ */ new Map();
  for (const H of j) {
    let oe = null;
    for (const pe of B.get(H)) {
      const Ze = sa(pe);
      (!oe || nt.indexOf(Ze) < nt.indexOf(oe.state)) && (oe = { card: pe, state: Ze });
    }
    O.set(H, oe);
  }
  const z = j.filter((H) => O.get(H).state === "held"), te = j.filter((H) => O.get(H).state === "behind");
  let ae = 0;
  for (const H of w) {
    const oe = /* @__PURE__ */ new Map();
    for (const pe of [...H.stages, ...H.prod]) {
      const Ze = oe.get(pe.tier);
      (Ze == null || nt.indexOf(pe.state) < nt.indexOf(Ze)) && oe.set(pe.tier, pe.state);
    }
    for (const pe of oe.values()) pe === "held" && ae++;
  }
  const re = { order: 0, approval: 0, dependency: 0, other: 0 }, K = [], J = { order: /* @__PURE__ */ new Set(), approval: /* @__PURE__ */ new Set(), dependency: /* @__PURE__ */ new Set(), other: /* @__PURE__ */ new Set() };
  for (const H of T) {
    const oe = Ir(H, r);
    re[oe]++, J[oe].add(H.name);
    const pe = Za(H);
    pe != null && K.push({ ms: Math.max(0, n - pe), app: H.name, env: H.envDisplay || H.envName || "" });
  }
  const Z = K.reduce((H, oe) => !H || oe.ms > H.ms ? oe : H, null);
  for (const H of z) {
    const oe = Ir(O.get(H).card, r);
    J[oe].add(H);
  }
  const R = T.filter((H) => H.heldCause !== "person"), U = z.filter((H) => O.get(H).card.heldCause !== "person"), ee = /* @__PURE__ */ new Set([...R.map((H) => H.name), ...U]), X = [];
  for (const H of R) {
    const oe = Za(H);
    oe != null && X.push(Math.max(0, n - oe));
  }
  for (const H of U) {
    const oe = Za(O.get(H).card);
    oe != null && X.push(Math.max(0, n - oe));
  }
  const G = X.length > 0 ? Math.max(...X) : null;
  let se = null;
  if (ee.size === 1) {
    const H = [...ee][0], oe = e.filter((pe) => pe.name === H && pe.held && pe.heldCause !== "person" && pe.envName);
    if (oe.length > 0) {
      const pe = /* @__PURE__ */ new Map();
      for (const Je of oe) {
        const je = Gn.indexOf(vt(Je.envName));
        (pe.get(je) ?? pe.set(je, []).get(je)).push(Je);
      }
      const Ze = [...pe.entries()].sort(([Je], [je]) => Je - je).map(([Je, je]) => {
        const Pt = [...new Map(je.map((We) => [We.envName, We])).values()], Et = Gn[Je], tn = new Set(e.filter((We) => We.name === H && vt(We.envName) === Et).map((We) => We.envName));
        return Vm(
          Pt.map((We) => We.envDisplay || We.envName || vt(We.envName)),
          tn.size,
          Et
        );
      }), en = Ma(Ze.flat()), Dn = Math.min(...pe.keys()), bn = pe.get(Dn)[0];
      se = { app: H, env: en, causeLabel: bn.heldCauseLabel ?? "a rule" };
    } else {
      const pe = O.get(H).card;
      se = { app: H, env: "", causeLabel: pe.heldCauseLabel ?? "a rule" };
    }
  }
  const de = e.filter((H) => sa(H) === "failed"), ce = e.filter((H) => sa(H) === "deploying"), Q = e.filter((H) => sa(H) === "checking"), fe = e.filter((H) => sa(H) === "stuck"), me = e.filter(
    (H) => cr(H) || T.includes(H) && Ir(H, r) === "approval"
  ), ve = w.filter((H) => [...H.stages, ...H.prod].every((oe) => oe.state === "newest")).length, Ne = [.../* @__PURE__ */ new Set([...k.map((H) => H.app), ...z])].sort(), Ve = [
    .../* @__PURE__ */ new Set([...w.filter((H) => H.state === "behind").map((H) => H.app), ...te])
  ].sort(), _e = {
    dev: ia(),
    test: ia(),
    staging: ia(),
    other: ia(),
    prod: ia()
  }, Xe = /* @__PURE__ */ new Map();
  for (const H of w)
    for (const oe of [...H.stages, ...H.prod]) {
      Fo(_e[oe.tier], H.app, oe, r);
      const pe = oe.env || oe.tier;
      Fo(Xe.get(pe) ?? Xe.set(pe, ia()).get(pe), H.app, oe, r);
    }
  const ze = Object.fromEntries(Gn.map((H) => [H, Io(_e[H])])), Oe = {};
  for (const [H, oe] of Xe) Oe[H] = Io(oe);
  const Qe = (H) => H.filter((oe) => !Qr(oe)).length;
  return {
    range: a,
    start: o,
    end: i,
    hasPrev: p,
    apps: h,
    mappedApps: _,
    places: A,
    mappedPlaces: E,
    regions: S,
    deploys: { value: v, prev: p ? y : null, unmapped: b },
    held: {
      apps: Ne.length,
      appIds: Ne,
      approvalAppIds: [...J.approval].sort(),
      places: L.length,
      plates: ae,
      regions: L.filter((H) => vt(H.envName) === "prod").length,
      unmapped: Qe(L),
      byCause: re,
      byCauseApps: { order: J.order.size, approval: J.approval.size, dependency: J.dependency.size, other: J.other.size },
      medianMs: $c(K.map((H) => H.ms)),
      longestMs: Z?.ms ?? null,
      longestSubject: Z ? { app: Z.app, env: Z.env } : null,
      ruleApps: ee.size,
      ruleSingle: se,
      ruleLongestMs: G
    },
    failed: {
      live: {
        apps: new Set(de.map((H) => H.name)).size,
        places: de.length,
        regions: de.filter((H) => vt(H.envName) === "prod").length,
        unmapped: Qe(de)
      },
      inWindow: { value: g, prev: p ? m : null },
      resolvedInWindow: x
    },
    inMotion: {
      apps: new Set([...ce, ...Q].map((H) => H.name)).size,
      places: ce.length + Q.length,
      deploying: ce.length,
      checking: Q.length,
      unmapped: Qe([...ce, ...Q])
    },
    stuck: { apps: new Set(fe.map((H) => H.name)).size, places: fe.length },
    needsYou: {
      apps: new Set(me.map((H) => H.name)).size,
      places: me.length
    },
    newestEverywhere: { apps: ve, of: _ },
    behind: { apps: Ve.length, appIds: Ve },
    byTier: ze,
    byEnv: Oe
  };
}
function qm(e, t, n) {
  if (!e || !t) return null;
  const a = zi(t);
  if (!a || a <= 0) return null;
  const r = new Date(e).getTime();
  if (Number.isNaN(r)) return null;
  const s = Math.max(0, n.getTime() - r), i = Math.min(1, s / a);
  return { elapsedMs: s, totalMs: a, fraction: i };
}
const Gm = 5 * 6e4, Po = (e) => e.set ? "prod" : e.label, jo = (e) => e.rollout.status?.history?.[0];
function Km(e) {
  if (e.heldCause === "dependency" && e.heldCauseLabel && e.heldCauseLabel !== "a dependency") return { name: e.heldCauseLabel, app: e.heldCauseLabel };
  const t = (e.rollout.status?.gates ?? []).find((n) => n.passing === !1 && !n.name?.startsWith("promotion-"));
  return t?.name ? { name: t.name, app: null } : null;
}
function Ym(e, t) {
  const n = t.cycleMs ?? Gm;
  for (let a = 0; a < e.plates.length; a++) {
    const r = e.plates[a], s = Po(r), i = r.nodes.filter((f) => f.state === "held");
    if (i.length) {
      if (i.some((v) => t.isApproval(v.card))) return { kind: "approval", place: s };
      const f = i[0].card;
      if (f.heldCause === "clock" && f.heldCauseLabel) return { kind: "window", place: s, name: f.heldCauseLabel };
      const p = Km(f);
      if (p) return { kind: "rule", place: s, ...p };
    }
    const o = r.nodes.find((f) => f.state === "behind");
    if (!o && !i.length) continue;
    const l = a > 0 ? e.plates[a - 1] : null;
    if (l) {
      const f = l.nodes.find((g) => g.state === "checking");
      if (f) {
        const g = jo(f.card), m = qm(g?.bakeStartTime, f.card.rollout.spec?.bakeTime, t.now);
        return { kind: "bake", place: s, upstream: Po(l), id: t.idOf(f.card.version), leftMs: m ? Math.max(0, m.totalMs - m.elapsedMs) : null };
      }
      if (l.nodes.some((g) => g.state === "deploying")) return null;
      const p = l.nodes.find((g) => g.state === "newest") ?? l.nodes[0];
      if (!o || o.card.version && o.card.version === p.card.version) continue;
      const v = jo(p.card), y = v?.bakeEndTime ?? v?.timestamp ?? null, b = y ? t.now.getTime() - Date.parse(y) : null;
      return b == null || b <= n ? { kind: "cycle", place: s, usualMs: n, waitedMs: b } : { kind: "stalled", place: s, id: t.idOf(p.card.version), forMs: b };
    }
    if (!o) continue;
    const c = [...o.card.rollout.status?.availableReleases ?? []].sort((f, p) => Date.parse(p.created ?? "") - Date.parse(f.created ?? ""))[0], u = c?.created ? t.now.getTime() - Date.parse(c.created) : null;
    return u == null || u <= n ? { kind: "cycle", place: s, usualMs: n, waitedMs: u } : { kind: "stalled", place: s, id: t.idOf(c?.version ?? c?.tag ?? null), forMs: u };
  }
  return null;
}
function pa(e) {
  return _r((/* @__PURE__ */ new Date(0)).toISOString(), new Date(Math.max(0, e)));
}
Wa(["click"]);
const $m = (e) => !!e.envName && vt(e.envName) === "prod", Qm = (e) => e === "failed" || e === "stuck";
function Zm(e, t) {
  const n = e.filter($m), a = n.filter((r) => Qm(ka(r)));
  return {
    total: n.length,
    failing: a.length,
    failingApps: [...new Set(a.map((r) => r.name))].sort(),
    notDeployed: n.filter((r) => ka(r) === "none").length,
    approvals: n.filter((r) => ka(r) === "held" && t(r)).map((r) => ({ app: r.name, env: r.envName, card: r }))
  };
}
function Xm(e, t, n = null) {
  const a = /* @__PURE__ */ new Map(), r = (o, l) => {
    const c = `${o}|${l ?? ""}`, u = a.get(c) ?? { count: 0, word: o, id: l };
    u.count++, a.set(c, u);
  };
  for (const o of e) {
    const l = o.card.version ? t(o.card.version) : "";
    o.state === "none" || !l ? r("not deployed", null) : o.state === "failed" || o.state === "stuck" ? r("failing on", l) : o.state === "checking" ? r("checking", l) : o.state === "deploying" ? r("deploying", l) : r("on", l);
  }
  const s = ["failing on", "checking", "deploying", "on", "not deployed"], i = [...a.values()].sort((o, l) => s.indexOf(o.word) - s.indexOf(l.word) || l.count - o.count);
  return { total: e.length, buckets: i, heldBefore: n };
}
function qi(e) {
  return e?.bakeEndTime ?? e?.timestamp ?? null;
}
function va(e, t) {
  const n = e.rollout?.status?.history?.[0];
  switch (t) {
    case "failed":
      return e.checkFailure?.since ? e.checkFailure.since : qi(n) ?? e.timestamp ?? null;
    case "deploying":
    case "checking":
    case "stuck":
      return n?.timestamp ?? e.timestamp ?? null;
    case "held":
    case "behind": {
      if (!e.rollout) return null;
      const a = Za(e);
      return a != null ? new Date(a).toISOString() : null;
    }
    default:
      return null;
  }
}
const Nr = (e) => nt.indexOf(e), Wo = ["failed", "stuck", "held", "deploying", "checking"];
function Ns(e, t) {
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
    const u = c.nodes.reduce((y, b) => Nr(b.state) < Nr(y.state) ? b : y), f = c.nodes.filter((y) => y.state === u.state).length, p = u.state === "held" && t(u.card);
    let v = null;
    if (Wo.includes(u.state)) {
      const y = Ns(u.state, p), b = c.set && f > 1 ? null : u.state === "held" ? (
        // the build the hold keeps out, never the one running
        ((g) => g ? xt(g) : null)(Ic(u.card.rollout).held[0]?.build ?? null)
      ) : u.card.version ? xt(u.card.version) : null;
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
  }), r = a.reduce((c, u) => !c || Nr(u.worst.state) < Nr(c.worst.state) ? u : c, null), s = r?.worst.state ?? "none", i = r?.worst ?? null, o = !!i && s === "held" && t(i.card);
  let l = null;
  if (i && Wo.includes(s)) {
    const c = r.nodes.filter((v) => v.state === s).length, u = r.nodes.filter((v) => v.state === s).map((v) => v.env), f = (r.set && c > 1 ? Bc(Va(u), "prod") : null) ?? i.env, p = s === "deploying" ? "to" : "in";
    l = { text: `${Ns(s, o)} ${p} ${f}`, verb: Ns(s, o), rest: ` ${p} ${f}`, state: s };
  } else if (s === "behind") {
    const c = a.find((v) => v.nodes.some((y) => y.state === "behind")), u = c.nodes.find((v) => v.state === "behind"), f = c.set ? "prod" : u.env, p = u.behind > 0 ? `${u.behind} behind` : "behind";
    l = { text: `${p} in ${f} · ${f} next`, verb: p, rest: ` in ${f} · ${f} next`, state: s };
  }
  return {
    app: e.app,
    plates: a,
    state: s,
    phrase: l,
    lead: i,
    approval: o,
    newestEverywhere: a.length > 0 && a.every((c) => c.nodes.every((u) => u.state === "newest")),
    lane: e
  };
}
const eg = "en", Zc = (
  /** @type {const} */
  ["en"]
), Xc = "PARAGLIDE_LOCALE", tg = 3456e4, Jc = [
  "cookie",
  "globalVariable",
  "baseLocale"
];
globalThis.__paraglide = {};
let Pr, Bo = !1, we = () => {
  let e;
  for (const t of Jc)
    if (t === "cookie" ? e = rg() : t === "baseLocale" ? e = eg : t === "globalVariable" && Pr !== void 0 && (e = Pr), e !== void 0) {
      const n = ag(e);
      return Bo || (Pr = n, Bo = !0, ng(n, { reload: !1 })), n;
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
  for (const r of Jc)
    if (r === "globalVariable")
      Pr = e;
    else if (r === "cookie") {
      if (typeof document > "u" || typeof window > "u")
        continue;
      const s = window.location.hostname;
      document.cookie = `${Xc}=${e}; path=/; max-age=${tg}; domain=${s}`;
    } else if (r === "baseLocale")
      continue;
  n.reload && window.location && e !== a && window.location.reload();
};
function eu(e) {
  return e ? Zc.includes(e) : !1;
}
function ag(e) {
  if (eu(e) === !1)
    throw new Error(`Invalid locale: ${e}. Expected one of: ${Zc.join(", ")}`);
  return e;
}
function rg() {
  if (typeof document > "u" || !document.cookie)
    return;
  const t = document.cookie.match(new RegExp(`(^| )${Xc}=([^;]+)`))?.[2];
  if (eu(t))
    return t;
}
const sg = (
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
), Bg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? sg(e) : "home_m_held_for", zg = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? ig() : "home_m_waits_on_rule", Hg = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? og() : "home_m_health_check_failing", Vg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? lg(e) : "home_m_action_roll_back", Ug = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? cg() : "home_m_action_review_approval", tu = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? ug() : "home_m_evidence_failed_check", qg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? dg(e) : "home_m_evidence_rolled_back_to", Gg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? fg(e) : "home_m_sig_check_failing", nu = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? pg() : "home_m_failed_to_deploy", Kg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? vg(e) : "home_m_sig_flapping", Yg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? hg(e) : "home_m_sig_recovered", $g = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? mg(e) : "home_m_sig_slow_bake", Qg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? gg(e) : "home_m_sig_long_wait", Zg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? bg(e) : "home_m_sig_retried", Xg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? wg(e) : "home_m_sig_approval_waiting", Jg = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? kg(e) : "home_m_sig_pinned", e0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? _g(e) : "home_m_sig_to_regions", t0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? yg(e) : "home_m_sig_to_env", n0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? xg(e) : "home_m_sig_idle", a0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Sg(e) : "home_m_sig_regions_not_deployed", r0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Cg(e) : "home_m_sig_regions_on_builds", s0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Ag(e) : "home_m_sig_correlated", i0 = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? Tg() : "home_m_hold_stuck", o0 = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? Mg() : "home_m_hold_approval", l0 = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? Eg() : "home_m_hold_dependency", c0 = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? Lg() : "home_m_hold_order", u0 = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? Ng() : "home_m_hold_clock", d0 = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? Rg() : "home_m_hold_check", f0 = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? we()) === "en" ? Og() : "home_m_hold_pinned", p0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Dg(e) : "home_m_action_review_approval_in", v0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Fg(e) : "home_m_lead_failing", h0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Ig(e) : "home_m_lead_approval", m0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Pg(e) : "home_m_lead_held", g0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? jg(e) : "home_m_lead_deploying", b0 = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? we()) === "en" ? Wg(e) : "home_m_lead_checking", w0 = /* @__PURE__ */ new Set([
  "check-failing",
  "check-flapping",
  "check-recovered",
  "slow-bake",
  "long-wait"
]);
function zo(e) {
  const t = Math.max(0, e);
  return t < 3 * 36e5 ? `${Math.round(t / 6e4)}m` : pa(t);
}
function k0(e) {
  switch (e.kind) {
    case "check-failing":
      return (e.check == null ? /* @__PURE__ */ Hg() : /* @__PURE__ */ Gg({ name: e.check })).slice(0, 48);
    case "failed":
      return e.failure === "healthcheck" ? /* @__PURE__ */ tu() : /* @__PURE__ */ nu();
    case "check-flapping":
      return /* @__PURE__ */ Kg({ name: e.check, n: e.failures, span: pa(Math.max(0, e.spanMs)) });
    case "check-recovered":
      return /* @__PURE__ */ Yg({ age: pa(Math.max(0, e.failedAgoMs)) });
    case "slow-bake":
      return /* @__PURE__ */ $g({ span: zo(e.spanMs), set: zo(e.bakeTimeMs) });
    case "long-wait":
      return /* @__PURE__ */ Qg({ span: pa(Math.max(0, e.waitedMs)), usual: pa(Math.max(0, e.usualMs)) });
  }
}
const Rt = {
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
  return e >= Math.max(Rt.longWaitFloorMs, t * Rt.slowBakeFactor);
}
const qa = (e) => pa(Math.max(0, e)), yn = (e) => new Date(e).toISOString(), Ho = (e) => !!e.envName && vt(e.envName) === "prod", Vo = (e) => `${e.ns}/${e.name}`;
function y0(e) {
  const t = [];
  for (const n of e)
    for (const a of n.rollout.status?.history ?? []) {
      const r = a.timestamp ? Date.parse(a.timestamp) : NaN;
      if (!Number.isFinite(r)) continue;
      const s = a.version && ge(a.version) || "", i = a.version?.revision ? xt(a.version.revision).slice(0, 7) : xt(s).slice(0, 7);
      t.push({ at: r, card: n, version: xt(s), rev: i });
    }
  return t.sort((n, a) => a.at - n.at);
}
function x0(e) {
  const t = e.rollout.status?.availableReleases ?? [], n = [];
  for (const a of e.rollout.status?.history ?? []) {
    const r = a.version ? ge(a.version) : null, s = t.find((o) => !!o && (o.tag === r || o.version === r || o.tag === a.version?.tag));
    if (!s?.created || !a.timestamp) continue;
    const i = Date.parse(a.timestamp) - Date.parse(s.created);
    Number.isFinite(i) && i >= 0 && n.push(i);
  }
  return n.length < 2 ? null : (n.sort((a, r) => a - r), n[Math.floor(n.length / 2)]);
}
function S0(e) {
  const { cards: t, lanes: n, healthChecks: a, prFor: r, isApproval: s, now: i, href: o, appHref: l } = e, c = i.getTime(), u = y0(t), f = [];
  function p(h, C, _) {
    const A = (w, L) => {
      const k = w.rev ? r(w.rev) : null;
      return { id: k?.number ?? w.version, title: k?.title ?? null, href: k?.href ?? null, app: w.card.name, env: w.card.envDisplay || w.card.envName, at: yn(w.at), sameApp: L };
    }, E = (C ? u.find((w) => w.at < h && Vo(w.card) === Vo(C)) : null) ?? u.find((w) => w.at < h && w.card.name === _);
    if (E) return A(E, !0);
    const S = u.find((w) => w.at < h && Ho(w.card));
    return S ? A(S, !1) : null;
  }
  function v(h, C) {
    const _ = h.evidence ?? (h.facts ? k0(h.facts) : "");
    f.push({ ...h, evidence: _, key: `${h.kind}|${h.app}|${h.env}|${h.since}`, lastChange: p(Date.parse(h.since), C, h.app) });
  }
  const y = (h) => h.envDisplay || h.envName, b = /* @__PURE__ */ new Map();
  for (const h of t) {
    if (!h.envName) continue;
    const C = vt(h.envName), _ = h.rollout.status?.history?.[0], A = ka(h);
    if (h.checkFailure) {
      const T = va(h, "failed") ?? _?.bakeEndTime ?? _?.timestamp ?? yn(c);
      v({ kind: "check-failing", severity: "failure", app: h.name, env: y(h), tier: C, since: T, facts: { kind: "check-failing", check: h.checkFailure.check ?? null }, href: o(h) }, h);
    } else if (A === "failed") {
      const T = va(h, "failed") ?? _?.timestamp ?? yn(c);
      v({ kind: "failed", severity: "failure", app: h.name, env: y(h), tier: C, since: T, facts: { kind: "failed", failure: Wc(h.failureCategory === "healthcheck" ? "health check" : h.bakeStatusMessage ?? null) }, href: o(h) }, h);
    }
    const E = a?.get(Ec(h.sourceCluster, h.ns, h.name)) ?? [], S = om(h.rollout), w = h.rollout.status?.history ?? [];
    for (const T of E) {
      if (lm(T, S) !== "recovered") continue;
      const F = Date.parse(T.status.lastErrorTime), B = T.metadata?.name, j = T.metadata?.annotations?.["kuberik.com/display-name"] ?? B ?? "check", O = _?.bakeStartTime ? Date.parse(_.bakeStartTime) : NaN, z = w.slice(1).filter((re) => {
        const K = Date.parse(re.bakeEndTime ?? re.timestamp ?? "");
        return Number.isFinite(K) && c - K < Rt.flapWindowMs && (re.failedHealthChecks ?? []).some((J) => J.name === B);
      }), te = z.length > 0 && Number.isFinite(O) && F > O, ae = te ? Math.min(...z.map((re) => Date.parse(re.bakeEndTime ?? re.timestamp ?? ""))) : F;
      v(
        {
          kind: te ? "check-flapping" : "check-recovered",
          severity: "signal",
          app: h.name,
          env: y(h),
          tier: C,
          since: T.status.lastErrorTime,
          facts: te ? { kind: "check-flapping", check: j, failures: z.length + 1, spanMs: c - ae } : { kind: "check-recovered", failedAgoMs: c - F },
          href: o(h)
        },
        h
      );
    }
    const L = h.rollout.spec?.bakeTime ? zi(h.rollout.spec.bakeTime) : 0;
    if (_?.bakeStartTime && L > 0) {
      const T = Date.parse(_.bakeStartTime), F = _.bakeEndTime ? Date.parse(_.bakeEndTime) : c, B = F - T;
      c - F < Rt.retryMs && B > L + Rt.slowBakeMarginMs && v({ kind: "slow-bake", severity: "signal", app: h.name, env: y(h), tier: C, since: _.bakeStartTime, facts: { kind: "slow-bake", spanMs: B, bakeTimeMs: L }, href: o(h) }, h);
    }
    _?.lastRetryTimestamp && c - Date.parse(_.lastRetryTimestamp) < Rt.retryMs && v({ kind: "retry", severity: "signal", app: h.name, env: y(h), tier: C, since: _.lastRetryTimestamp, evidence: /* @__PURE__ */ Zg({ age: qa(c - Date.parse(_.lastRetryTimestamp)) }), href: o(h) }, h);
    const k = Ui(h.rollout);
    if ((h.rollout.status?.history ?? []).forEach((T, F) => {
      if (k[F]?.kind !== "rollback" || !T.timestamp || c - Date.parse(T.timestamp) >= Rt.rollbackMs) return;
      const B = k[F];
      v({ kind: "rollback", severity: "signal", app: h.name, env: y(h), tier: C, since: T.timestamp, evidence: /* @__PURE__ */ qg({ version: xt(B.to) }), href: o(h) }, h);
    }), C === "prod" && _?.timestamp && c - Date.parse(_.timestamp) < Rt.prodRolloutMs && A !== "failed") {
      const T = _.version ? xt(ge(_.version) || "") : "", F = `${h.name}|${T}`, B = b.get(F);
      B ? (B.places.push(y(h)), Date.parse(_.timestamp) < Date.parse(B.since) && (B.since = _.timestamp)) : b.set(F, { card: h, v: T, since: _.timestamp, places: [y(h)] });
    }
    if (A === "held") {
      const T = s(h) ? va(h, "held") : (() => {
        const F = Za(h);
        return F ? yn(F) : va(h, "held");
      })();
      T && c - Date.parse(T) >= Rt.agingHoldMs && v({ kind: "aging-hold", severity: "signal", app: h.name, env: y(h), tier: C, since: T, evidence: (s(h) ? Xg : Bg)({ age: qa(c - Date.parse(T)) }), href: o(h) }, h);
    } else h.pinnedVersion && _?.timestamp && c - Date.parse(_.timestamp) >= Rt.agingHoldMs && v({ kind: "aging-hold", severity: "signal", app: h.name, env: y(h), tier: C, since: _.timestamp, evidence: /* @__PURE__ */ Jg({ age: qa(c - Date.parse(_.timestamp)) }), href: o(h) }, h);
  }
  for (const h of b.values()) {
    const C = h.places.length > 1 ? "prod" : h.places[0];
    v({ kind: "prod-rollout", severity: "signal", app: h.card.name, env: C, tier: "prod", since: h.since, evidence: h.places.length > 1 ? /* @__PURE__ */ e0({ version: h.v, n: h.places.length }) : /* @__PURE__ */ t0({ version: h.v, env: C }), href: h.places.length > 1 ? l(h.card.name) : o(h.card) }, h.places.length > 1 ? null : h.card);
  }
  for (const h of n) {
    const C = Jm(h, s), _ = Ym(C, { now: i, idOf: (A) => A ? xt(A) : "", isApproval: s });
    if (_?.kind === "cycle" && _.waitedMs != null) {
      const A = _.place, E = [...h.stages, ...h.prod].find((w) => A === "prod" ? w.tier === "prod" : w.env === A) ?? null, S = E ? x0(E.card) : null;
      S != null && _0(_.waitedMs, S) && v({ kind: "long-wait", severity: "signal", app: h.app, env: A, tier: A === "prod" ? "prod" : vt(A), since: yn(c - _.waitedMs), facts: { kind: "long-wait", waitedMs: _.waitedMs, usualMs: S }, href: E ? o(E.card) : l(h.app) }, E?.card ?? null);
    }
    if (_?.kind === "stalled") {
      const A = _.place, E = [...h.stages, ...h.prod].find((S) => A === "prod" ? S.tier === "prod" : S.env === A) ?? null;
      v({ kind: "stall", severity: "signal", app: h.app, env: A, tier: A === "prod" ? "prod" : vt(A), since: yn(c - _.forMs), evidence: /* @__PURE__ */ n0({ env: A, age: qa(_.forMs) }), href: E ? o(E.card) : l(h.app) }, E?.card ?? null);
    }
    if (h.prod.length > 1) {
      const A = Xm(h.prod, (w) => w ? xt(w) : ""), E = A.buckets.filter((w) => w.id).map((w) => w.id), S = h.prod.filter((w) => w.state === "none" || !w.card.version).length;
      if (new Set(E).size > 1 || S) {
        const w = Math.max(...h.prod.map((L) => L.card.timestamp ? Date.parse(L.card.timestamp) : 0));
        v(
          {
            kind: "prod-drift",
            severity: "signal",
            app: h.app,
            env: "prod",
            tier: "prod",
            since: yn(w || c),
            evidence: S ? /* @__PURE__ */ a0({ n: S, total: A.total }) : /* @__PURE__ */ r0({ total: A.total, builds: new Set(E).size }),
            href: l(h.app)
          },
          null
        );
      }
    }
  }
  const g = /* @__PURE__ */ new Map();
  for (const h of u) {
    if (!Ho(h.card) || c - h.at >= Rt.correlatedWindowMs) continue;
    const C = `${h.card.name}|${h.version}`, _ = g.get(C);
    (!_ || h.at < _.at) && g.set(C, h);
  }
  const m = [...g.values()].sort((h, C) => h.at - C.at), x = /* @__PURE__ */ new Set();
  for (let h = 0; h < m.length; h++) {
    if (x.has(h)) continue;
    const C = [h];
    for (let S = h + 1; S < m.length && m[S].at - m[C[C.length - 1]].at <= Rt.correlatedMs; S++) C.push(S);
    const _ = [...new Set(C.map((S) => m[S].card.name))];
    if (_.length < 2) continue;
    C.forEach((S) => x.add(S));
    const A = m[h], E = m[C[C.length - 1]].at - A.at;
    v({ kind: "correlated", severity: "signal", app: _[0], apps: _, env: "prod", tier: "prod", since: yn(A.at), evidence: /* @__PURE__ */ s0({ n: _.length, span: qa(Math.max(6e4, E)) }), href: l(_[0]) }, null);
  }
  return f.sort((h, C) => h.severity === C.severity ? Date.parse(C.since) - Date.parse(h.since) : h.severity === "failure" ? -1 : 1);
}
function C0(e) {
  return e?.metadataUnresolved === !0;
}
function Uo(e, t, n) {
  return `${e}/${t}/${n}`;
}
function sn(e) {
  return e?.metadata?.annotations?.[Sc] ?? "";
}
function A0(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const a = n?.metadata?.namespace;
    if (!a) continue;
    const r = sn(n);
    let s = t.get(r);
    s || (s = /* @__PURE__ */ new Set(), t.set(r, s)), s.add(a);
  }
  return t;
}
function T0(e) {
  const t = e?.status?.history?.[0]?.version;
  return t && (t.version || t.revision || t.tag) || null;
}
const au = /* @__PURE__ */ new WeakMap();
function M0(e) {
  const t = new Set(e.filter((n) => n != null));
  return t.size === 1 ? [...t][0] : null;
}
function E0(e, t, n) {
  let a = e;
  for (const [r, s] of t) {
    const i = n.get(r);
    if (!i || i.size === 0) continue;
    const o = s?.clusterRolloutSchedules?.items ?? [], l = /* @__PURE__ */ new Map();
    for (const c of i) l.set(c, [...o]);
    for (const c of s?.rolloutSchedules?.items ?? []) {
      const u = c?.metadata?.namespace;
      !u || !l.has(u) || l.get(u).push(c);
    }
    for (const [c, u] of l)
      a = ai(a, c, u);
  }
  return a;
}
function L0(e) {
  const t = vs(e), n = [];
  for (const a of e) {
    const r = a.status?.rolloutGateRef?.name;
    if (!a.metadata?.namespace || !a.spec?.rolloutRef?.name || !a.spec?.environment || !r) continue;
    const s = t.get(br(a)), i = Ni(s, a);
    if (!s || !i || i.env !== a) continue;
    const o = Li(s, i), l = i.isLeader ? o[0]?.tier === i.tier ? "wave" : "tier" : "follow";
    for (const c of o) {
      const u = c.env;
      !u || !u.metadata?.namespace || !u.spec?.rolloutRef?.name || n.push({ down: a, up: u, gate: r, edgeKind: l });
    }
  }
  return n;
}
function N0(e, t, n) {
  return (e || n || t) === t;
}
function Gi(e) {
  const { rollouts: t, environments: n, dependencies: a, envOrder: r } = e, s = e.gates ?? Ha, i = new Map(r.map((k, T) => [k, T])), o = (k) => i.get(k) ?? 900 + r.length, l = /* @__PURE__ */ new Map();
  for (const k of t) {
    const T = k.metadata?.namespace, F = k.metadata?.name;
    !T || !F || l.set(Uo(sn(k), T, F), k);
  }
  const c = /* @__PURE__ */ new Map();
  for (const k of n) {
    const T = k.metadata?.namespace, F = k.spec?.environment;
    T && F && c.set(`${sn(k)}/${T}`, Nn(k, n));
  }
  const u = (k, T) => c.get(`${k}/${T}`) ?? T, f = /* @__PURE__ */ new Map(), p = (k, T, F, B) => {
    const j = Uo(k, T, F);
    let O = f.get(j);
    if (!O) {
      const z = l.get(j);
      O = {
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
        env: B || u(k, T),
        envRank: 0,
        unresolved: !z,
        build: T0(z),
        candidateCount: 0,
        waiting: !1,
        blocked: !1,
        holds: []
      }, O.envRank = o(O.env), f.set(j, O);
    }
    return O;
  }, v = [], y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Set();
  for (const { down: k, up: T, gate: F, edgeKind: B } of L0(n)) {
    const j = k.metadata.namespace, O = k.spec.rolloutRef.name, z = T.metadata.namespace, te = T.spec.rolloutRef.name, ae = p(sn(k), j, O, Nn(k, n)), re = p(sn(T), z, te, Nn(T, n));
    if (re.id === ae.id) continue;
    const K = `promotion:${ae.id}:${F}`, J = b.has(K) ? `${K}:${re.id}` : K;
    b.add(K), v.push({
      key: J,
      from: re.id,
      to: ae.id,
      writer: "promotion",
      gate: F,
      state: "unknown",
      contract: null,
      requiredVersion: null,
      providedVersion: null,
      edgeKind: B,
      message: "",
      cyclic: !1,
      held: []
    });
  }
  for (const k of a) {
    const T = k.metadata?.namespace, F = k.spec?.rolloutRef?.name, B = k.spec?.providerRef?.name, j = k.status?.gateName;
    if (!T || !F || !B || !j) continue;
    const O = sn(k), z = p(O, T, F), te = p(O, k.spec?.providerRef?.namespace || T, B), ae = k.status?.blockedReleases ?? [], re = (k.status?.conditions ?? []).find((J) => J?.type === "Satisfied"), K = `contract:${z.id}:${j}`;
    y.set(K, k), v.push({
      key: K,
      from: te.id,
      to: z.id,
      writer: "contract",
      gate: j,
      state: "unknown",
      contract: k.spec?.contract || B,
      requiredVersion: M0(ae.map((J) => J.requiredVersion ?? null)),
      providedVersion: k.status?.providedVersion ?? null,
      edgeKind: null,
      message: re?.message ?? "",
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
  const g = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
  for (const k of f.values()) {
    const T = l.get(k.id);
    T && (g.set(k.id, kr(T)), m.set(
      k.id,
      new Set((T.status?.gates ?? []).map((F) => F?.name).filter(Boolean))
    ));
  }
  const x = (k) => [
    ...new Set(
      k.map((T) => ge(T))
    )
  ], h = (k, T) => {
    const F = k.writer === "contract" ? y.get(k.key) : void 0;
    if (!F) return;
    const B = new Map(
      (F.status?.blockedReleases ?? []).filter((O) => O?.tag && O.requiredVersion).map((O) => [O.tag, O.requiredVersion])
    ), j = /* @__PURE__ */ new Map();
    for (const O of T) {
      const z = O.tag ? B.get(O.tag) : void 0;
      z && j.set(ge(O), z);
    }
    j.size && au.set(k, j);
  };
  for (const k of v) {
    const T = g.get(k.to), F = m.get(k.to), B = l.get(k.to);
    if (!T || !F)
      k.state = "unknown";
    else if (T.blockingGates.includes(k.gate)) {
      k.state = "blocked";
      const j = $h(B, k.gate);
      k.held = x(j), h(k, j);
    } else if (F.has(k.gate))
      k.state = "clear";
    else {
      k.state = "unknown";
      const j = k.writer === "contract" ? y.get(k.key) : void 0;
      if (j) {
        const O = new Set(
          (j.status?.blockedReleases ?? []).map((ae) => ae?.tag).filter(Boolean)
        ), z = wr(B).filter((ae) => ae.tag && O.has(ae.tag)), te = (j.status?.conditions ?? []).find((ae) => ae?.type === "Satisfied");
        z.length > 0 ? (k.state = "blocked", k.held = x(z), h(k, z)) : te?.status === "True" && (k.state = "clear");
      }
    }
  }
  const C = /* @__PURE__ */ new Map();
  for (const k of v) {
    let T = C.get(k.to);
    T || C.set(k.to, T = /* @__PURE__ */ new Set()), T.add(k.gate);
  }
  const _ = ru({ nodes: [...f.values()], edges: v });
  for (const k of f.values()) {
    const T = l.get(k.id);
    if (!T) continue;
    const F = _.get(k.id), B = $n(T, s, { place: k.env, contractHolds: F });
    k.candidateCount = B.candidateCount, k.waiting = B.blocked, k.blocked = B.blocked && !B.selfClearing;
    const j = C.get(k.id) ?? /* @__PURE__ */ new Set();
    k.holds = B.gates.filter((O) => !j.has(O.id) && !O.id.startsWith("contract:")).map((O) => ({
      gate: O.id,
      clears: O.clears,
      short: O.short,
      clearsAt: O.clearsAt,
      pending: O.pending
    })), B.pinnedTo && (k.holds = [
      {
        gate: B.pinnedTo,
        clears: "person",
        short: `Pinned to ${ms(T, B.pinnedTo)}`,
        clearsAt: null
      }
    ]);
  }
  R0(v), v.sort(
    (k, T) => k.writer.localeCompare(T.writer) || k.from.localeCompare(T.from) || k.to.localeCompare(T.to)
  );
  const A = [...f.values()].sort(
    (k, T) => k.name.localeCompare(T.name) || k.envRank - T.envRank || k.env.localeCompare(T.env)
  ), E = new Set(A.map((k) => k.env)), S = r.filter((k) => E.has(k)).concat([...E].filter((k) => !i.has(k)).sort()), w = new Set(A.map((k) => k.id)), L = [...l.keys()].filter((k) => !w.has(k)).length;
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
  const a = 0, r = 1, s = 2, i = /* @__PURE__ */ new Map();
  for (const o of n) i.set(o, a);
  for (const o of [...n].sort()) {
    if (i.get(o) !== a) continue;
    const l = [[o, 0]];
    for (i.set(o, r); l.length > 0; ) {
      const c = l[l.length - 1], u = t.get(c[0]) ?? [];
      if (c[1] >= u.length) {
        i.set(c[0], s), l.pop();
        continue;
      }
      const f = u[c[1]++], p = i.get(f.to);
      p === r ? f.cyclic = !0 : p === a && (i.set(f.to, r), l.push([f.to, 0]));
    }
  }
}
function ru(e) {
  const t = new Map(e.nodes.map((a) => [a.id, a])), n = /* @__PURE__ */ new Map();
  for (const a of e.edges) {
    if (a.writer !== "contract" || a.state !== "blocked") continue;
    let r = n.get(a.to);
    r || n.set(a.to, r = /* @__PURE__ */ new Map());
    const s = t.get(a.from)?.name ?? "another service", i = au.get(a);
    for (const o of a.held) {
      const l = {
        provider: s,
        required: i?.get(o) ?? a.requiredVersion ?? void 0,
        has: a.providedVersion ?? void 0,
        gate: a.gate || void 0
      }, c = r.get(o);
      c ? c.push(l) : r.set(o, [l]);
    }
  }
  return n;
}
function su(e, t, n = t.metadata?.namespace, a) {
  const r = t.metadata?.name, s = e.nodes.filter((o) => o.namespace === n && o.name === r), i = s.length < 2 ? s[0] ?? null : s.find((o) => o.cluster === (sn(t) || (a ?? ""))) ?? s[0];
  return i ? ru(e).get(i.id) ?? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Map();
}
class Qn extends Set {
  has(t) {
    if (super.has(t)) return !0;
    if (!t || t.length < 7) return !1;
    const n = t.toLowerCase();
    for (const a of this) {
      if (a.length < 7) continue;
      const r = a.toLowerCase();
      if (r.startsWith(n) || n.startsWith(r)) return !0;
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
  const a = new Date(e.created).getTime(), r = new Date(n.mergedAt).getTime();
  return !Number.isFinite(a) || !Number.isFinite(r) ? "unverified" : a < r ? "not-contained" : "contained";
}
function F0(e, t, n) {
  let a = null;
  for (const r of e) {
    const s = D0(r, t, n);
    if (s === "contained") return { release: r, state: s };
    s === "unverified" && !a && (a = r);
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
function Rs(e, t, n) {
  if (!e || !t) return null;
  const a = zi(t);
  if (!a) return null;
  const r = new Date(e).getTime();
  return Number.isFinite(r) ? a - (n.getTime() - r) : null;
}
function j0(e) {
  const t = [];
  for (const n of e.status?.history ?? []) {
    if (!n.bakeStartTime || !n.bakeEndTime) continue;
    const a = new Date(n.bakeStartTime).getTime(), r = new Date(n.bakeEndTime).getTime();
    !Number.isFinite(a) || !Number.isFinite(r) || r <= a || t.push(r - a);
  }
  return t.length < 2 ? null : $c(t);
}
const ct = {
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
function jr(e) {
  return e !== "Deploying" && e !== "InProgress" && e !== "BakeTimeRetrying" && e !== "Failed" && e !== "Cancelled";
}
function W0(e, t) {
  const n = new Date(t).getTime();
  if (!Number.isFinite(n)) return null;
  let a = null, r = !1;
  for (const i of e.services)
    for (const o of i.cells) {
      if (za(o.envName) !== "PROD") continue;
      const l = o.historyMatches ?? [];
      let c;
      for (let p = l.length - 1; p >= 0; p--)
        if (jr(l[p].bakeStatus)) {
          c = l[p];
          break;
        }
      if (!c) continue;
      const u = new Date(c.timestamp).getTime();
      if (!Number.isFinite(u)) continue;
      const f = !!o.firstLandingProven;
      (a == null || u < a || u === a && f) && (a = u, r = f);
    }
  if (!r || a == null) return null;
  const s = a - n;
  return s <= 0 ? null : { at: new Date(a).toISOString(), ms: s };
}
function B0(e, t, n, a, r, s, i, o, l) {
  const c = e.status ?? {}, u = c.history ?? [], f = u[0], p = f?.version?.revision ?? null, v = e.metadata?.namespace ?? "", y = e.metadata?.name ?? "", b = $t(t), g = j0(e), m = Ui(e), x = u.reduce((w, L, k) => {
    const T = L.version?.revision;
    return T && r.has(T) && w.push({
      revision: T,
      displayVersion: ge(L.version),
      timestamp: L.timestamp,
      bakeStatus: L.bakeStatus ?? "None",
      triggeredBy: L.triggeredBy ?? null,
      act: m[k] ?? null
    }), w;
  }, []);
  let h = null;
  for (let w = u.length - 1; w >= 0; w--) {
    const L = u[w]?.version?.revision;
    if (L && r.has(L)) {
      h = w;
      break;
    }
  }
  const C = h != null && h < u.length - 1, _ = (w) => ({
    cluster: n,
    envName: t,
    envRank: b,
    usuallyMs: g,
    namespace: v,
    rolloutName: y,
    theme: a,
    containmentKnown: l,
    historyMatches: x,
    historyAtLimit: Hc(e),
    versionHistoryLimit: e.spec?.versionHistoryLimit ?? 10,
    firstLandingProven: C,
    ...w
  }), A = () => _({
    ...ct,
    state: "not-built",
    reason: "not built (unverified)",
    releaseLabel: "",
    revision: null
  });
  if (p && r.has(p)) {
    const w = f?.bakeStatus ?? "None", L = ge(f.version), k = x.slice(1).find((O) => jr(O.bakeStatus));
    if (k && !jr(w))
      return _({
        ...ct,
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
    if (!jr(w))
      return _(w === "Deploying" ? {
        ...ct,
        state: "deploying",
        reason: "deploying now",
        since: f?.timestamp ?? null,
        bakeLeftMs: Rs(f?.timestamp, e.spec?.deployTimeout, o),
        releaseLabel: L,
        revision: p
      } : w === "InProgress" ? {
        ...ct,
        state: "baking",
        reason: e.spec?.bakeTime ? "baking" : "baking, no timer",
        since: f?.bakeStartTime ?? f?.timestamp ?? null,
        bakeLeftMs: Rs(f?.bakeStartTime, e.spec?.bakeTime, o),
        releaseLabel: L,
        revision: p
      } : w === "BakeTimeRetrying" ? {
        ...ct,
        state: "retrying",
        reason: f?.bakeStatusMessage || "retrying the bake",
        since: f?.bakeStartTime ?? f?.timestamp ?? null,
        bakeLeftMs: Rs(f?.bakeStartTime, e.spec?.bakeTime, o),
        releaseLabel: L,
        revision: p
      } : w === "Failed" ? {
        ...ct,
        state: "failed",
        reason: f?.bakeStatusMessage || "the bake failed",
        since: qi(f),
        releaseLabel: L,
        revision: p
      } : {
        ...ct,
        state: "cancelled",
        reason: f?.bakeStatusMessage || "the bake was cancelled",
        since: f?.bakeEndTime ?? f?.timestamp ?? null,
        releaseLabel: L,
        revision: p
      });
    const T = u.length ? u[u.length - 1]?.timestamp : null;
    let F = f?.bakeEndTime ?? f?.timestamp ?? null, B = "live";
    if (s.mergedAt && T) {
      const O = new Date(s.mergedAt).getTime(), z = new Date(T).getTime();
      Number.isFinite(O) && Number.isFinite(z) && O < z && (F = null, B = "live (since before recorded history)");
    }
    const j = s.mergeCommitSha != null && p !== s.mergeCommitSha;
    return _({
      ...ct,
      state: "live",
      reason: B,
      since: F,
      superseded: j,
      releaseLabel: L,
      revision: p
    });
  }
  const E = u.find((w, L) => {
    if (L === 0) return !1;
    const k = w.version?.revision;
    return !!k && r.has(k);
  });
  if (E) {
    const w = f?.version ? ge(f.version) : "";
    if (l)
      return _({
        ...ct,
        state: "rolled-back",
        reason: f?.message?.trim() || `rolled back to ${w}`,
        since: f?.timestamp ?? null,
        releaseLabel: w,
        revision: p
      });
    if (E.bakeStatus === "Succeeded")
      return _({
        ...ct,
        state: "live",
        reason: "live · a later build is serving, and whether it carries this change could not be verified",
        since: E.timestamp ?? null,
        superseded: !0,
        releaseLabel: w,
        revision: p
      });
  }
  const S = F0(c.availableReleases ?? [], r, s);
  if (S && S.state === "contained") {
    const w = S.release, L = w.tag ?? w.version ?? w.revision ?? "", k = ge(w), T = e.spec?.wantedVersion;
    if (T) {
      const j = I0(e, T);
      if (!j || !r.has(j))
        return _({
          ...ct,
          state: "pinned",
          reason: `pinned to ${P0(e, T)}`,
          releaseLabel: k,
          revision: w.revision ?? null
        });
    }
    if (C0(w))
      return _({
        ...ct,
        state: "waiting-upstream",
        reason: "manifest unreadable",
        releaseLabel: k,
        revision: w.revision ?? null
      });
    const B = (c.gates ?? []).filter((j) => !wa(j, L));
    if (B.length > 0) {
      const j = B.map((U) => bs(U, v, i)), O = j.find(
        (U) => U.clears === "upstream" && U.subjectKind === "environment"
      ), z = j.find((U) => U.clears === "upstream" && U !== O), te = j.find((U) => U !== O && U !== z), ae = z, re = z ?? O, K = z ?? te ?? O ?? j[0], J = !ae && (K.kind === "approval" || K.kind === "unknown"), Z = !!K.pending || J;
      return !te && (z || O) && !l ? A() : _({
        ...ct,
        state: z ? "waiting-upstream" : te ? "gated" : "queued",
        reason: Z ? "" : K.short,
        releaseLabel: k,
        revision: w.revision ?? null,
        gateHint: { cluster: n, namespace: v, rolloutName: y, gateName: K.id },
        gateLabel: re || Z ? null : K.label,
        gateSubject: re ? K.subject ?? null : null,
        gateSubjectKind: re ? K.subjectKind ?? null : null,
        gatePending: Z,
        gateApprovalGuess: Z && K.kind === "approval",
        // ⭐ FIX PASS ITEM 5. Only a `'service'`-subject dependency gate
        // (`waiting-upstream`) ever carries these — `classifyGate`'s
        // promotion branch never sets `contract`/`need` (its own
        // `NOTHING_TO_DRAW` spread leaves them `null`), so this is a
        // no-op for `queued`/`gated` even without the extra check.
        gateContract: ae ? K.contract ?? null : null,
        gateRequiredVersion: ae ? K.need ?? null : null,
        // ⭐ FIX PASS ITEM 7 — see `gateProvidedVersion`'s own doc comment.
        gateProvidedVersion: ae ? K.have ?? null : null
      });
    }
    return l ? _({
      ...ct,
      state: "promoting",
      reason: "waiting for the next reconcile",
      releaseLabel: k,
      revision: w.revision ?? null
    }) : A();
  }
  return _({
    ...ct,
    state: "not-built",
    reason: S?.state === "unverified" ? "not built (unverified)" : "not built here yet",
    releaseLabel: "",
    revision: null
  });
}
function z0(e, t) {
  if (!t.mergeCommitSha) return !1;
  const n = e.status ?? {}, a = n.history ?? [], r = new Qn([t.mergeCommitSha]);
  if (a.some((s) => !!s.version?.revision && r.has(s.version.revision))) return !0;
  for (const s of n.availableReleases ?? [])
    if (s.revision && r.has(s.revision)) return !0;
  return !1;
}
function H0(e) {
  return e.state !== "not-built" || e.reason !== "not built here yet" ? e : { ...e, state: "queued", reason: `not offered to ${e.envName} yet` };
}
function V0(e) {
  return $t(e) >= 7;
}
function U0(e) {
  const t = [];
  for (const n of e.status?.history ?? []) {
    const a = n.version ? ge(n.version) : "";
    if (!a || !n.timestamp) continue;
    const r = new Date(n.timestamp).getTime();
    Number.isFinite(r) && t.push({
      version: a,
      ms: r,
      inFlight: n.bakeStatus === "InProgress" || n.bakeStatus === "Deploying"
    });
  }
  return t;
}
function q0(e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e) {
    const r = t.get(a.envName) ?? [];
    r.push(a), t.set(a.envName, r);
  }
  const n = [];
  for (const [a, r] of t)
    n.push({
      label: a,
      order: $t(a),
      prod: V0(a),
      deploys: r.flatMap((s) => U0(s.rollout))
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
    return `held in ${[...new Set(a.map((o) => za(o.envName).toLowerCase()))].join(" · ")}`;
  if (e.filter((i) => i.state === "not-built").length === t) return "no release";
  const s = e.filter((i) => $0.has(i.state)).length;
  return s > 0 ? `${s} of ${t} active` : `${t} in progress`;
}
const qo = {
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
function Go(e) {
  return !e || e.split(" ")[0].includes("-") ? e : `${e[0].toUpperCase()}${e.slice(1)}`;
}
function J0(e) {
  const n = e.flatMap((l) => l.cells.map((c) => ({ cell: c, appName: l.appName }))).filter((l) => l.cell.state !== "not-built");
  if (n.length === 0) return { word: "no release for this commit yet", tone: "not-built" };
  if (n.every((l) => l.cell.state === "live"))
    return { word: "live everywhere", tone: "live" };
  const a = n.filter((l) => l.cell.state !== "live"), r = Gc(a), s = X0(r.cell), i = s ? `${r.appName} ${qo[r.cell.state]} in ${r.cell.envName} ${s}` : `${r.appName} ${qo[r.cell.state]} in ${r.cell.envName}`, o = r.cell.providerHasNoBuild && r.cell.gateContract && r.cell.gateRequiredVersion ? ` · will not move on its own — needs ${r.cell.gateSubject} ${r.cell.gateContract} ${r.cell.gateRequiredVersion}` : "";
  return { word: `${i}${o}`, tone: Z0(r.cell.state) };
}
function e2(e, t) {
  const n = new Map(e.map((a) => [a.appName, a]));
  return e.map((a) => ({
    ...a,
    cells: a.cells.map((r) => {
      if (r.state !== "waiting-upstream" || r.gateSubjectKind !== "service" || !r.gateSubject)
        return r;
      if (t.has(r.gateSubject))
        return { ...r, providerHasNoBuild: !0 };
      const s = n.get(r.gateSubject);
      if (!s) return r;
      if (!s.cells.some((l) => l.state !== "not-built"))
        return { ...r, providerHasNoBuild: !0 };
      const o = s.cells.find(
        (l) => l.envName === r.envName && l.cluster === r.cluster
      );
      return !o || o.state !== "live" ? { ...r, reason: `waiting on ${r.gateSubject} to reach ${r.envName}` } : r;
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
      const r = t.get(a.gateSubject);
      if (!r) return a;
      const s = `a newer ${r.contract}`, i = `${r.contract} ${r.need}`;
      return {
        ...a,
        reason: a.reason.includes(s) ? a.reason.replace(s, i) : a.reason,
        gateContract: r.contract,
        gateRequiredVersion: r.need
      };
    })
  }));
}
function n2(e) {
  return e.map((t, n) => ({
    ...t,
    builtElsewhere: e.some(
      (a, r) => r !== n && a.cells.some((s) => s.state !== "not-built")
    )
  }));
}
function a2(e, t) {
  const n = Gh(e, { place: t });
  if (!n) return null;
  const a = `${t} is `;
  return n.startsWith(a) ? n.slice(a.length) : n;
}
function r2(e, t, n) {
  return Gi({
    rollouts: e,
    environments: t,
    dependencies: n?.items ?? [],
    envOrder: [],
    gates: ji({ environments: { items: t }, rolloutDependencies: n })
  });
}
function s2(e, t, n, a, r = /* @__PURE__ */ new Date(), s = {}) {
  const i = O0(e), o = ji({
    environments: { items: n },
    rolloutDependencies: a
  }), l = s.graph ?? Gi({
    rollouts: t,
    environments: n,
    dependencies: a?.items ?? [],
    envOrder: [],
    gates: o
  }), c = !e.containedInUnknown && e.containmentKnown, u = Cc(`github.com/${e.owner}/${e.repo}`, ""), f = Ac(t, n);
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
        r,
        c
      ), B = S.filter((Z, R) => R !== T).map((Z) => ({ envName: Z.envName, rollout: Z.rollout })), j = !!Uc(k.rollout, B, { now: r, gateContext: o }), O = su(
        l,
        k.rollout,
        k.rollout.metadata?.namespace,
        k.sourceCluster
      ), z = $n(k.rollout, o, { place: F.envName, now: r, contractHolds: O }), te = Tc(z, F.envName), ae = te.held, re = ae ? a2(z, F.envName) : null, K = te.waitsForEnv, J = te.cause === "person" ? !0 : F.state === "gated" && F.gateApprovalGuess === !0;
      return { ...F, stuck: j, held: ae, holdCause: re, waitsForEnv: K, approvalWait: J };
    }).map(H0).sort((k, T) => k.envRank - T.envRank || k.cluster.localeCompare(T.cluster)), L = Pm(q0(S));
    p.push({
      appName: E.appName,
      sourceRepo: ni(S[0].repoKey),
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
  const y = p.flatMap((E) => E.cells), b = y.length, g = y.filter((E) => E.state !== "not-built").length, m = y.filter((E) => E.state === "live").length, x = p.length > 0 || v.length > 0, h = x && p.length === 0;
  let C, _, A;
  return x ? h ? (C = "no release for this commit", _ = "not-built", A = Go(C)) : ({ word: C, tone: _ } = J0(p), A = Go(C)) : (C = "not built here", _ = "not-built", A = "No service on this cluster deploys this repository"), {
    services: p,
    verdict: A,
    verdictWord: C,
    verdictTone: _,
    containmentKnown: c,
    rolloutsTotal: b,
    rolloutsWithBuild: g,
    rolloutsLive: m,
    unaffectedServices: v,
    noRelease: h
  };
}
function i2(e, t) {
  return `${_r(e, t)} ago`;
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
  const r = t.getTime() - a, s = r + e.bakeLeftMs;
  if (s <= 0) return n;
  const i = Math.max(0, Math.round(r / 6e4)), o = Math.max(i, Math.round(s / 6e4));
  return `${n} · ${i} of ${o} min`;
}
function iu(e, t = /* @__PURE__ */ new Date(), n) {
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
  const n = iu(e, t);
  return e.reason.trim().toLowerCase() === n.trim().toLowerCase() ? null : e.reason;
}
function u2(e) {
  return `usually ${Math.max(1, Math.round(e / 6e4))} min once it starts`;
}
const d2 = /* @__PURE__ */ new Set(["queued", "promoting"]);
function f2(e) {
  return !d2.has(e.state) || e.usuallyMs == null ? null : u2(e.usuallyMs);
}
const Ko = {
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
function ou(e) {
  return e.reduce((t, n) => Ko[n.state] < Ko[t.state] ? n : t);
}
function ii(e) {
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
  switch (ii(e)) {
    case "held":
      return "stuck";
    case "not-built":
      return "none";
    default:
      return ii(e);
  }
}
const Yo = { DEV: 0, TEST: 1, STAGING: 2, PROD: 3 };
function p2(e) {
  return Yo[e] ?? Object.keys(Yo).length;
}
function v2(e, t, n) {
  const a = [], r = /* @__PURE__ */ new Map();
  for (const s of e) {
    const i = za(s.envName);
    let o = r.get(i);
    o || (o = [], r.set(i, o), a.push(i)), o.push(s);
  }
  return a.map((s) => {
    const i = r.get(s), o = ou(i), l = i.map((c) => `${c.envName}: ${iu(c, t)}`).join("; ");
    return {
      family: s,
      familyOrder: p2(s),
      count: i.length,
      state: o.state,
      tone: In(o.state),
      sentence: l,
      href: Di(o.cluster, o.namespace, o.rolloutName),
      theme: o.theme,
      approvalWait: o.state === "gated" && o.approvalWait === !0
    };
  });
}
function $o(e) {
  return e.map((t) => `${t.family}:${t.state}`).join("|");
}
const Qo = {
  failed: 0,
  held: 1,
  active: 2,
  "not-built": 3,
  live: 4
};
function h2(e, t, n) {
  return [...e].sort((a, r) => Qo[t(a)] - Qo[t(r)] || n(a).localeCompare(n(r)));
}
function m2(e, t = /* @__PURE__ */ new Date()) {
  const n = e.services.map((i) => {
    const o = i.cells.length ? ou(i.cells) : null;
    return {
      appName: i.appName,
      marks: v2(i.cells, t, i.builtElsewhere),
      verdictWord: o ? ii(o.state) : "live",
      landedCount: i.cells.filter((l) => l.state === "live").length,
      total: i.cells.length
    };
  });
  if (n.length === 0)
    return { services: n, allSameLabel: null, visible: [], overflow: null };
  const a = $o(n[0].marks);
  if (n.every((i) => $o(i.marks) === a))
    return {
      services: n,
      allSameLabel: `all ${n.length} service${n.length === 1 ? "" : "s"}`,
      visible: n,
      overflow: null
    };
  const s = h2(
    n,
    (i) => i.verdictWord,
    (i) => i.appName
  );
  return { services: n, allSameLabel: null, visible: s, overflow: null };
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
  return Gc(n)?.cell ?? null;
}
function k2(e, t) {
  if (!e) return null;
  const n = c2(e, t), a = f2(e);
  return n && a ? `${n} · ${a}` : n ?? a ?? null;
}
function _2(e, t) {
  const n = cu({ grid: t }), a = n.findIndex((o) => o.tone !== "live");
  if (a === -1 || n[a].builtCount === 0) return null;
  const r = n[a], s = (o) => r.tone === "stuck" ? lu.has(o) : r.tone === "failed" ? o === "failed" : o !== "not-built";
  let i = null;
  for (const o of e.services)
    for (const l of o.cells) {
      if (za(l.envName) !== r.family || !s(l.state) || !l.since) continue;
      const c = new Date(l.since).getTime();
      Number.isFinite(c) && (i == null || c > i) && (i = c);
    }
  return i != null ? new Date(i).toISOString() : null;
}
function y2(e, t) {
  const n = A2({ grid: t, services: e.services });
  if (!n || n.builtCount === 0 || n.anyResolved) return null;
  const a = (i) => i === "rolled-back" ? !1 : n.tone === "stuck" ? lu.has(i) : n.tone === "failed" ? i === "failed" : i !== "not-built";
  let r = null, s = -1 / 0;
  for (const i of e.services)
    for (const o of i.cells) {
      if (za(o.envName) !== n.family || !a(o.state)) continue;
      const l = o.since ? new Date(o.since).getTime() : -1 / 0;
      (r === null || l >= s) && (r = o, s = l);
    }
  return r;
}
function x2(e, t) {
  return W0(e, t)?.ms ?? null;
}
function S2(e, t, n, a, r, s) {
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
  }, o = s2(i, t, n, a, r, { graph: s }), l = { word: o.verdictWord, tone: o.verdictTone }, c = w2(o), u = m2(o, r), f = e.kind === "pr" && e.number != null ? Qa(e.owner, e.repo, { number: e.number }) : Qa(e.owner, e.repo, { sha: e.mergeCommitSha }), p = y2(o, u), v = (() => {
    const g = g2(p?.revision) || p?.revision || null;
    return !g || new Qn([e.mergeCommitSha]).has(g) || !new Qn(e.containedIn).has(g) ? null : g;
  })(), y = v ? v.slice(0, 7) : null, b = v ? Qa(e.owner, e.repo, { sha: v }) : null;
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
    frontierReason: k2(c, r),
    frontierSince: _2(o, u),
    noRelease: o.noRelease,
    carrierSha: y,
    carrierHref: b,
    services: o.services
  };
}
function C2(e, t, n, a, r = /* @__PURE__ */ new Date()) {
  if (e.length === 0) return [];
  const s = r2(t, n, a);
  return e.map((i) => S2(i, t, n, a, r, s));
}
const lu = /* @__PURE__ */ new Set(["gated", "waiting-upstream", "pinned"]);
function A2(e) {
  const t = cu(e), n = t.find((i) => i.tone === "failed");
  if (n) return n;
  const a = t.find((i) => i.tone === "stuck");
  if (a) return a;
  let r = -1;
  for (let i = 0; i < t.length; i++)
    t[i].liveCount > 0 && (r = i);
  if (r !== -1 && t[r].liveCount < t[r].builtCount)
    return t[r];
  const s = t.findIndex((i) => i.tone !== "live" || i.liveCount < i.builtCount);
  return s === -1 ? null : t[s];
}
function cu(e) {
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
        const c = za(l.envName);
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
    (i, o) => Gn.indexOf(vt(i[0].toLowerCase())) - Gn.indexOf(vt(o[0].toLowerCase()))
  ), r = [];
  let s = !1;
  for (const [i, o] of a) {
    const l = o[0].familyOrder, c = o.map((x) => x.sentence).join("; "), u = n?.get(i);
    let f, p, v, y, b = !1, g = !1;
    if (u && u.length > 0) {
      const x = u.filter((h) => h.state !== "not-built");
      if (f = x.map((h) => ({ tone: In(h.state), state: h.state })), p = x.filter((h) => h.state === "live").length, g = x.some((h) => h.state === "rolled-back"), x.length === 0)
        v = "none", y = "not-built";
      else if (p === x.length)
        v = "live", y = null;
      else {
        const h = x.find((_) => In(_.state) === "failed"), C = x.find((_) => In(_.state) === "stuck" && qc(_));
        if (h)
          v = "failed", y = h.state;
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
      const x = o.filter((h) => h.tone !== "none");
      if (f = x, p = x.filter((h) => h.tone === "live").length, g = x.some((h) => h.state === "rolled-back"), x.length === 0)
        v = "none", y = "not-built";
      else if (p === x.length)
        v = "live", y = null;
      else {
        const h = x.find((A) => A.tone === "failed"), C = x.find((A) => A.tone === "stuck"), _ = !!C;
        if (h)
          v = "failed", y = h.state;
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
    const m = y === "rolled-back";
    if (s) {
      r.push({
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
        resolved: m,
        anyResolved: g
      });
      continue;
    }
    r.push({
      family: i,
      familyOrder: l,
      tone: v,
      state: y,
      builtCount: f.length,
      liveCount: p,
      sentence: c,
      approvalWait: b,
      resolved: m,
      anyResolved: g
    }), (v === "stuck" || v === "failed") && (s = !0);
  }
  return r;
}
function T2(e) {
  const t = e.environments?.items ?? [];
  let n = ji({
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
    n = ai(
      n,
      e.schedulesForNamespace.namespace,
      e.schedulesForNamespace.list
    );
  else if (e.scheduleObjectsByNamespace)
    for (const [s, i] of Object.entries(e.scheduleObjectsByNamespace))
      n = ai(n, s, i);
  const a = Gi({
    rollouts: e.rollouts,
    environments: t,
    dependencies: e.rolloutDependencies?.items ?? [],
    envOrder: e.envOrder ?? [],
    gates: n,
    focus: e.focus
  }), r = (s, i, o) => su(a, s, i, o);
  return {
    gateContext: n,
    providerNetwork: a,
    contractHoldsFor: r,
    storyFor: (s, i = {}) => $n(s, n, { ...i, contractHolds: r(s) })
  };
}
const M2 = ["not-built", "cancelled", "queued", "promoting"], oi = ["gated", "pinned", "waiting-upstream"];
function La(e) {
  return Di(e.sourceCluster || "local", e.ns, e.name);
}
function uu(e) {
  return $r(`/apps/${encodeURIComponent(e)}`);
}
function E2(e) {
  return e == null || e <= 0 ? null : Math.max(1, Math.round(e / 6e4));
}
function L2(e) {
  const t = e?.status?.history ?? [], n = Ui(e), a = /* @__PURE__ */ new Set();
  return n.forEach((r, s) => {
    if (r?.kind === "rollback") {
      const i = t[s + 1]?.version?.revision;
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
    const r = {
      check: a[0]?.name ?? null,
      detail: a[0]?.message ?? null,
      raw: n?.bakeStatusMessage || a[0]?.message || "health check failing",
      // When it began failing: the failed attempt's own end, falling back to
      // the deploy start only when the entry has none (`historyEntrySince`,
      // the rule `eventAge('failed')` and the failed `PrCell.since` read).
      // `head.timestamp` alone dated the failure from the deploy, so Needs
      // you and Your changes printed two ages for one failure.
      since: qi(n)
    };
    return { ...t, checkFailure: r };
  });
}
function O2(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e) {
    if (!r.envName) continue;
    const s = n.get(r.name) ?? /* @__PURE__ */ new Map();
    s.set(r.envName, {
      rolledBack: L2(r.rollout),
      failingRev: N2(r.rollout)
    }), n.set(r.name, s);
  }
  const a = /* @__PURE__ */ new Map();
  for (const r of t) {
    if (r.noRelease) continue;
    const s = r.number != null ? `#${r.number}` : r.shortSha, i = n.get(r.repo);
    if (i)
      for (const [o, l] of i) {
        let c = null;
        if (l.failingRev && new Qn([l.failingRev]).has(r.sha) ? c = "failed" : [...l.rolledBack].some((p) => new Qn([p]).has(r.sha)) && (c = "rolled-back"), !c) continue;
        const u = a.get(r.repo) ?? /* @__PURE__ */ new Map(), f = u.get(o) ?? /* @__PURE__ */ new Map();
        f.set(s, c), u.set(o, f), a.set(r.repo, u);
      }
  }
  return a;
}
function D2(e, t, n, a, r, s) {
  if (M2.includes(e.state) || oi.includes(e.state) && e.held === !1) return null;
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
  if (oi.includes(e.state)) {
    const o = e.approvalWait ?? e.gateApprovalGuess, l = {
      ...i,
      since: e.since ?? s?.since ?? null,
      state: o ? "awaiting-approval" : "held-by-rule"
    }, c = e.state === "waiting-upstream" && e.gateSubjectKind === "service" ? e.gateSubject : null;
    if (!c) return l;
    const u = e.gateHint;
    return u ? {
      ...l,
      waitsOn: c,
      waitsOnHref: `${Di(u.cluster || "local", u.namespace, u.rolloutName)}/gates`
    } : { ...l, waitsOn: c };
  }
  return e.state === "live" ? { ...i, state: r ? "healthy" : "superseded" } : null;
}
function F2(e, t, n, a) {
  const r = [...t].sort((f, p) => Date.parse(p.mergedAt) - Date.parse(f.mergedAt)), s = /* @__PURE__ */ new Map(), i = [], o = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), c = [];
  for (const f of r) {
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
      let m = !1;
      if (b.state === "live") {
        const h = l.get(b.envName) ?? 0;
        m = h === 0, l.set(b.envName, h + 1);
      }
      const x = oi.includes(b.state) && b.held === !0 ? a?.(b, p.cells) : void 0;
      return D2(b, v, f, g, m, x);
    });
    if (p.cells.some((b) => b.state !== "live")) {
      let b = -1;
      y.forEach((g, m) => {
        !g || g.state === "awaiting-approval" || g.state === "held-by-rule" || (b < 0 || p.cells[m].envRank >= p.cells[b].envRank) && (b = m);
      }), b >= 0 && c.push({
        ref: v,
        env: p.cells[b].envName,
        rank: p.cells[b].envRank,
        change: y[b]
      });
    }
    for (const [b, g] of p.cells.entries()) {
      const m = y[b];
      if (!m) continue;
      const x = o.get(g.envName) ?? 0, h = m.state === "awaiting-approval" || m.state === "held-by-rule";
      if (m.state !== "failed" && m.state !== "rolled-back" && !h) {
        if (x >= 2) continue;
        o.set(g.envName, x + 1);
      }
      const C = s.get(g.envName) ?? [];
      C.push(m), s.set(g.envName, C);
    }
  }
  for (const [f, p] of s) {
    const v = p.filter((b) => b.state === "awaiting-approval" || b.state === "held-by-rule");
    if (v.length <= 1) continue;
    const y = v.reduce(
      (b, g) => Date.parse(b.mergedAt) <= Date.parse(g.mergedAt) ? b : g
    );
    s.set(
      f,
      p.filter(
        (b) => b.state !== "awaiting-approval" && b.state !== "held-by-rule" ? !0 : b === y
      )
    );
  }
  const u = /* @__PURE__ */ new Map();
  for (const [f, p] of s)
    for (const v of p)
      u.set(v.ref, Math.max(u.get(v.ref) ?? -1 / 0, $t(f)));
  for (const f of c) {
    if ((u.get(f.ref) ?? -1 / 0) >= f.rank) continue;
    const p = s.get(f.env) ?? [];
    p.push(f.change), s.set(f.env, p);
  }
  return { byEnv: s, merged: i };
}
function Zr(e) {
  return e.statusKey === "failed" || e.checkFailure != null ? "failed" : e.rolledBack && e.bakeStatus !== "Deploying" && e.bakeStatus !== "InProgress" && !e.held ? "rolled-back" : Fi(e) ? e.heldCause === "person" ? "awaiting-approval" : "held-by-rule" : e.bakeStatus === "Deploying" ? "deploying" : e.bakeStatus === "InProgress" || e.stuck != null ? "checking" : !e.version || e.statusKey === "pending" || e.bakeStatus === "None" ? "not-deployed" : "healthy";
}
function I2(e, t) {
  return t && e.replace(/^prod-?/i, "") || e;
}
function P2(e, t, n) {
  const a = e.rollout, r = a ? Lm(
    a,
    t,
    n
  ) : [], s = a ? Om(a, r) : { tracks: [{ name: "", stages: ["pending"] }], bake: "pending" }, i = s.tracks.map((l) => ({
    name: l.name || null,
    stages: l.stages.map((c) => ({ state: c }))
  }));
  let o = null;
  for (const l of s.tracks) {
    const c = l.stages.indexOf("active");
    if (c >= 0) {
      o = { index: c + 1, total: l.stages.length };
      break;
    }
  }
  return { tracks: i, bake: s.bake, activeStep: o, isFallback: r.length === 0 };
}
function j2(e, t, n, a) {
  return [
    ...e.stages.map((s) => ({ node: s, isProdRegion: !1 })),
    ...e.prod.map((s) => ({ node: s, isProdRegion: !0 }))
  ].map(({ node: s, isProdRegion: i }) => ({
    env: s.card.envName,
    label: I2(s.card.envName, i),
    tier: s.tier,
    isProdRegion: i,
    state: Zr(s.card),
    version: s.card.version,
    arrivedAt: s.card.timestamp,
    heldSince: fu(Zr(s.card)) === "held" ? va(s.card, "held") : null,
    myChanges: t.byEnv.get(s.card.envName) ?? [],
    pipeline: P2(s.card, n, a),
    href: La(s.card)
  }));
}
function W2(e, t, n, a, r) {
  const s = /* @__PURE__ */ new Map();
  for (const l of n) s.set(l.mergeCommitSha.slice(0, 7).toLowerCase(), l);
  const i = S0({
    cards: e,
    lanes: t,
    healthChecks: r ? wh(r) : null,
    prFor: (l) => {
      const c = s.get(l.toLowerCase());
      return c ? {
        number: c.number != null ? String(c.number) : null,
        title: c.title,
        // the change page, addressed as the Changes list addresses it
        href: c.kind === "pr" && c.number != null ? Qa(c.owner, c.repo, { number: c.number }) : Qa(c.owner, c.repo, { sha: c.mergeCommitSha }),
        author: c.author
      } : null;
    },
    isApproval: (l) => l.heldCause === "person",
    now: a,
    href: La,
    appHref: uu
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
function du(e) {
  if (e.checkFailure) return "failed-healthcheck";
  if (e.statusKey === "failed")
    return e.failureCategory === "healthcheck" || Wc(e.bakeStatusMessage) === "healthcheck" ? "failed-healthcheck" : "failed-deploy";
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
  const n = du(e);
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
      return /* @__PURE__ */ tu();
    case "failed-deploy":
      return /* @__PURE__ */ nu();
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
function Rr(e) {
  return cr(e) ? 0 : e.heldCause === "person" ? 1 : 2;
}
function V2(e) {
  return cr(e) ? "failed" : e.heldCause ?? "other";
}
function U2(e, t, n) {
  return (a) => {
    const r = $n(a.rollout, e, {
      contractHolds: t(a.rollout),
      now: n
    }), s = [...new Set(r.gates.filter((o) => o.clears === "check").map((o) => o.id))], i = [
      ...new Set(
        r.gates.filter((o) => o.kind === "dependency" && o.subjectKind === "service" && o.subject).map((o) => o.subject)
      )
    ];
    return {
      ...s.length ? { checks: s } : {},
      ...i.length === 1 ? { provider: i[0] } : {}
    };
  };
}
function q2(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of e) {
    if (!a.envName || !cr(a) && !Fi(a)) continue;
    const r = `${a.name}|${V2(a)}`, s = n.get(r);
    (!s || Rr(a) < Rr(s)) && n.set(r, a);
  }
  return [...n.values()].sort((a, r) => a.name.localeCompare(r.name) || Rr(a) - Rr(r)).map((a) => ({
    app: a.name,
    env: a.envName,
    cause: cr(a) ? "other" : B2(a.heldCause),
    phrase: H2(du(a)),
    facts: z2(a, t),
    href: La(a)
  }));
}
function G2(e, t, n) {
  const r = Zm(e, (s) => s.heldCause === "person");
  return {
    apps: t.apps,
    mappedApps: t.mappedApps,
    places: t.places,
    prodHealthy: { healthy: r.total - r.failing, total: r.total },
    sinceDelta: t.hasPrev ? { deploys: t.deploys.value, deploysPrev: t.deploys.prev } : null,
    needsYou: q2(e, n)
  };
}
function K2(e, t, n, a) {
  return n.has(e) || t ? "starred" : a ? "active" : "quiet";
}
function fu(e) {
  return e === "failed" ? "failed" : e === "deploying" ? "deploying" : e === "checking" ? "checking" : e === "awaiting-approval" || e === "held-by-rule" ? "held" : null;
}
function Y2(e, t) {
  for (const n of [...e.stages, ...e.prod])
    if (n.card.envName !== t && Zr(n.card) === "awaiting-approval")
      return {
        label: /* @__PURE__ */ p0({ env: n.card.envName }),
        href: La(n.card)
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
  const a = e.lead, r = Zr(a.card), s = fu(r), i = s ? va(a.card, s) : null, o = i ? _r(i, t) : null, l = a.card.envName, c = { lead: r, since: i ?? null };
  return r === "failed" ? {
    figure: o,
    phrase: /* @__PURE__ */ v0({ env: l }),
    facts: c,
    primaryAction: { label: /* @__PURE__ */ Vg({ env: l }), href: La(a.card) },
    secondaryAction: Y2(e, l)
  } : r === "awaiting-approval" ? {
    figure: o,
    phrase: /* @__PURE__ */ h0({ env: l }),
    facts: c,
    primaryAction: { label: /* @__PURE__ */ Ug(), href: La(a.card) },
    secondaryAction: null
  } : r === "held-by-rule" ? {
    figure: o,
    phrase: /* @__PURE__ */ m0({ env: l }),
    facts: c,
    primaryAction: null,
    secondaryAction: null
  } : r === "deploying" || r === "checking" ? { figure: o, phrase: r === "deploying" ? /* @__PURE__ */ g0({ env: l }) : /* @__PURE__ */ b0({ env: l }), facts: c, primaryAction: null, secondaryAction: null } : n;
}
function Q2(e, t, n) {
  if (!n?.get(e.envName)?.held) return;
  let r = null;
  if (e.revision) {
    const s = new Qn([e.revision]);
    for (const i of t)
      if (!(i.envRank >= e.envRank))
        for (const o of n?.get(i.envName)?.rollout?.status?.history ?? []) {
          const l = o.version?.revision, c = o.timestamp ? Date.parse(o.timestamp) : NaN;
          l && s.has(l) && !Number.isNaN(c) && (r == null || c > r) && (r = c);
        }
  }
  return { since: r != null ? new Date(r).toISOString() : null };
}
function Z2(e) {
  const { changes: t, rollouts: n, environments: a, rolloutDependencies: r, me: s, now: i } = e, o = e.kustomizations ?? [], l = e.kruiseRollouts ?? [], c = e.starredApps ?? /* @__PURE__ */ new Set(), u = e.pulseRange ?? "24h", f = T2({
    rollouts: n,
    environments: { items: a },
    rolloutDependencies: r ?? null,
    schedulesExpected: !1
  }), p = R2(
    Mm(n, a, i, f.gateContext, f.contractHoldsFor)
  ), v = Yc(p), y = new Map(v.map((E) => [E.app, E])), b = Um(p, n, i.getTime(), u), g = C2(
    t,
    n,
    a,
    r ?? null,
    i
  ), m = s.toLowerCase(), x = g.filter((E) => E.author.toLowerCase() === m), h = /* @__PURE__ */ new Map();
  for (const E of x) {
    const S = E.noRelease ? [E.repo] : (E.services ?? []).map((w) => w.appName);
    for (const w of new Set(S)) {
      const L = h.get(w) ?? [];
      L.push(E), h.set(w, L);
    }
  }
  const C = /* @__PURE__ */ new Set([...y.keys(), ...h.keys()]), _ = /* @__PURE__ */ new Map();
  for (const E of p) {
    if (!E.envName) continue;
    const S = _.get(E.name) ?? /* @__PURE__ */ new Map();
    S.set(E.envName, E), _.set(E.name, S);
  }
  const A = [...C].sort().map((E) => {
    const S = y.get(E), w = h.get(E) ?? [], L = O2(p, w).get(E), k = _.get(E), T = F2(
      E,
      w,
      L,
      (te, ae) => Q2(te, ae, k)
    ), { figure: F, phrase: B, facts: j, primaryAction: O, secondaryAction: z } = $2(S, i);
    return {
      app: E,
      tier: K2(E, w.length > 0, c, S),
      figure: F,
      phrase: B,
      facts: j,
      primaryAction: O,
      secondaryAction: z,
      envs: S ? j2(S, T, o, l) : [],
      merged: T.merged,
      href: uu(E)
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
const ur = /* @__PURE__ */ new Date("2026-01-01T00:00:00Z"), li = "", X2 = (e = ur) => ({ changes: [], rollouts: [], environments: [], rolloutDependencies: { items: [] }, kustomizations: [], kruiseRollouts: [], me: "", now: e, healthChecks: [] }), J2 = [], eb = {
  changes: J2
};
let pu = /* @__PURE__ */ Ee(null);
const hn = () => d(pu), tb = (e) => {
  he(pu, e);
}, oa = {
  failed: 0,
  "awaiting-approval": 1,
  "held-by-rule": 2,
  deploying: 3,
  checking: 4,
  "rolled-back": 5,
  "not-deployed": 6,
  healthy: 7,
  superseded: 8
}, Zo = (e) => e === "failed" ? "danger" : e === "awaiting-approval" ? "held" : e === "held-by-rule" ? "neutral" : e === "deploying" || e === "checking" ? "active" : e === "healthy" ? "success" : "neutral", Os = {
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
const Xo = /* @__PURE__ */ new WeakMap();
function vu() {
  const e = hn()?.changes ?? eb.changes;
  let t = Xo.get(e);
  if (t) return t;
  const n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  for (const r of e) {
    n.has(r.repo) || n.set(r.repo, r.author);
    const s = r.htmlUrl.split("/").pop() ?? "";
    a.has(r.repo) || a.set(r.repo, { ref: /^\d+$/.test(s) ? `#${s}` : s.slice(0, 7), title: r.title });
  }
  return Xo.set(e, t = { owners: n, newest: a }), t;
}
function ab(e) {
  for (const [t, n] of vu().newest) if (e === t || e.startsWith(t)) return n;
  return null;
}
function ci(e, t) {
  const { owners: n } = vu();
  for (const [a, r] of n) if (e === a || e.startsWith(a)) return r === t ? "you" : r;
  return e.startsWith("telemetry") ? n.get("platform-telemetry") ?? "platform" : "unowned";
}
function Jo(e) {
  return e === "failed" || e === "rolled-back" ? "healthy" : e;
}
function rb(e) {
  const t = e.blocker;
  return !t || t.outcome !== "failed" && t.outcome !== "cancelled" ? e : { ...e, blocker: null, waveReady: !0 };
}
function sb(e) {
  const t = hu(e), n = (a) => a === "awaiting-approval" ? "healthy" : a;
  return {
    ...t,
    signals: t.signals.filter((a) => a.kind !== "check-flapping"),
    apps: t.apps.map((a) => ({ ...a, envs: a.envs.map((r) => ({ ...r, state: n(r.state), myChanges: r.myChanges.map((s) => ({ ...s, state: n(s.state) })) })) }))
  };
}
function hu(e) {
  return {
    ...e,
    signals: e.signals.filter((t) => t.kind !== "check-failing"),
    apps: e.apps.map((t) => ({
      ...t,
      envs: t.envs.map((n) => ({
        ...rb(n),
        state: Jo(n.state),
        myChanges: n.myChanges.map((a) => ({ ...a, state: Jo(a.state) }))
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
    const m = /* @__PURE__ */ new Map();
    g.envs.forEach((x, h) => {
      for (const C of x.myChanges) {
        const _ = m.get(C.ref) ?? { title: C.title, href: C.href, hits: [] };
        _.hits.push({ e: x, i: h, s: C.state, since: C.since }), m.set(C.ref, _);
      }
    });
    for (const [x, h] of m) {
      const C = h.hits.filter((L) => oa[L.s] <= 4);
      if (!C.length) continue;
      const _ = Math.min(...C.map((L) => oa[L.s])), A = C.filter((L) => oa[L.s] === _), E = A[0].s, S = g.envs.map((L) => {
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
        title: h.title,
        href: h.href,
        app: g.app,
        appHref: g.href,
        state: E,
        where: A.map((L) => L.e.env),
        status: `${Os[E] ?? ""} ${nb(A.map((L) => L.e))}`.trim(),
        next: ib(g, A[0].i, E),
        since: A.map((L) => L.since).filter(Boolean).sort()[0] ?? null,
        tone: Zo(E),
        stops: S,
        mergedAt: w.myChanges.find((L) => L.ref === x)?.mergedAt ?? null,
        rollbackTo: w.myChanges.find((L) => L.ref !== x && (L.state === "healthy" || L.state === "superseded"))?.ref ?? null,
        evidence: e.signals.find((L) => L.app === g.app && L.env === w.env && L.kind === "check-failing")?.phrase ?? null,
        action: E === "failed" ? { label: `Roll back ${w.env}`, href: w.href } : null
      });
    }
  }
  n.sort((g, m) => oa[g.state] - oa[m.state] || (m.since ?? "").localeCompare(g.since ?? ""));
  const a = n.filter((g) => g.state === "failed" && g.stops.some((m) => m.here && m.prod)), r = n.filter((g) => g.state === "failed");
  let s = null, i = "";
  if (a.length)
    s = a.sort((g, m) => (m.since ?? "").localeCompare(g.since ?? ""))[0], i = "Your change is failing in production";
  else if (r.length)
    s = r[0], i = "Your change is failing";
  else {
    const g = n.find((m) => (m.state === "deploying" || m.state === "checking") && m.stops.some((x) => x.here && x.prod)) ?? n.find((m) => m.state === "deploying" || m.state === "checking") ?? n[0] ?? null;
    s = g, i = g ? "your change in motion" : "";
  }
  const o = [], l = new Set(n.map((g) => g.app));
  for (const g of e.apps) {
    const m = ci(g.app, t);
    g.envs.forEach((x) => {
      if (!x.myChanges.some((h) => oa[h.state] <= 2) && (x.state === "awaiting-approval" || x.state === "held-by-rule" || x.state === "failed")) {
        const h = x.state === "awaiting-approval" ? "approval" : x.state === "failed" ? "failing" : "held", C = o.find((A) => A.app === g.app && A.kind === h);
        if (C) {
          C.status = `${Os[x.state]} ${C.status.match(/(\d+) prod/) ? Number(C.status.match(/(\d+) prod/)[1]) + 1 : 2} prod regions`;
          return;
        }
        const _ = e.fleet.needsYou.find((A) => A.app === g.app && A.env === x.env);
        o.push({
          key: `${g.app}@${x.env}`,
          app: g.app,
          href: x.href,
          whose: l.has(g.app) && m === "you" ? "you" : m,
          kind: h,
          status: h === "held" && _ ? `${_.phrase.replace(/^\w/, (A) => A.toUpperCase())} in ${x.env}` : `${Os[x.state]} ${x.env}`,
          since: x.heldSince ?? x.arrivedAt,
          tone: Zo(x.state),
          canAct: h === "approval",
          action: h === "approval" ? { label: "Review", href: x.href } : null,
          change: ab(g.app)
        });
      }
    });
  }
  for (const g of e.signals.filter((m) => m.kind === "check-flapping"))
    o.push({
      key: g.key,
      app: g.app,
      href: g.href,
      whose: ci(g.app, t),
      kind: "flapping",
      status: `Check flapping in ${g.env}: ${g.phrase}`,
      since: g.since,
      tone: "neutral",
      canAct: !1,
      action: null,
      change: null
    });
  const c = { failing: 0, approval: 1, held: 2, dependency: 2, flapping: 3 };
  o.sort((g, m) => c[g.kind] - c[m.kind] || (g.since ?? "").localeCompare(m.since ?? ""));
  const u = [];
  for (const g of e.apps)
    for (const m of g.envs) {
      const x = m.myChanges.find((h) => h.state === "rolled-back");
      (m.state === "rolled-back" || x) && u.push({
        key: `${g.app}@${m.env}`,
        app: g.app,
        env: m.env,
        ref: x?.ref ?? null,
        href: m.href,
        note: x ? x.liveAgain ? "live again in a later build" : "needs a follow-up fix" : "rolled back to the previous build"
      });
    }
  const f = /* @__PURE__ */ new Map(), p = [];
  for (const g of e.apps)
    for (const m of g.envs) {
      const x = f.get(m.tier) ?? { tier: m.tier, total: 0, healthy: 0, failing: 0, held: 0, moving: 0 };
      x.total++, m.state === "failed" ? x.failing++ : m.state === "held-by-rule" || m.state === "awaiting-approval" ? x.held++ : m.state === "deploying" || m.state === "checking" ? x.moving++ : x.healthy++, f.set(m.tier, x), (m.state === "deploying" || m.state === "checking") && p.push({
        key: `${g.app}@${m.env}`,
        app: g.app,
        env: m.env,
        state: m.state,
        since: m.arrivedAt,
        href: m.href,
        step: m.pipeline.activeStep ? `step ${m.pipeline.activeStep.index}/${m.pipeline.activeStep.total}` : null
      });
    }
  const v = ["dev", "test", "staging", "prod"], y = [...f.values()].sort((g, m) => v.indexOf(g.tier) - v.indexOf(m.tier)), b = f.get("prod");
  return {
    me: t,
    lead: s,
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
let mu = /* @__PURE__ */ Ee(0);
const gu = () => d(mu), bu = () => {
  cf(mu);
};
class lb extends Date {
  constructor() {
    super(ur.getTime());
  }
  ms() {
    return (hn()?.now ?? ur).getTime();
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
const Qt = new lb(), Na = () => hn() ? hn().me : li, cb = () => hn() !== null, el = {
  "hello-dep-dev": "2026-10-24T18:46:26.893Z",
  "hello-dep-staging": "2026-10-24T18:58:26.893Z"
}, ub = "2026-10-24T18:33:49.255Z";
function db() {
  const e = X2(ur), t = e.rollouts.map((r) => {
    const s = el[r.metadata.namespace];
    if (!s || r.metadata.name !== "hello-frontend-app" || !r.status.history?.length) return r;
    const [i, ...o] = r.status.history;
    return { ...r, status: { ...r.status, history: [{ ...i, timestamp: s }, ...o] } };
  }), n = e.environments.map((r) => {
    const s = el[r.metadata.namespace];
    return s && r.metadata.name === "hello-frontend-app" ? { ...r, status: { ...r.status, lastStatusChangeTime: s } } : r;
  }), a = e.changes.map(
    (r) => r.repo === "hello-frontend-app" && r.number === 13 ? { ...r, mergedAt: ub } : r
  );
  return { ...e, rollouts: t, environments: n, changes: a };
}
let Ds = null;
function fb() {
  if (Ds) return Ds;
  const e = db();
  return Ds = {
    rollouts: e.rollouts,
    environments: e.environments,
    rolloutDependencies: e.rolloutDependencies,
    kustomizations: e.kustomizations,
    kruiseRollouts: e.kruiseRollouts,
    changes: e.changes,
    changesState: "ok",
    healthChecks: e.healthChecks,
    github: { configured: !0, connected: !0, login: li },
    me: li,
    now: ur
  };
}
const wt = () => hn() ?? fb(), pb = () => hn() !== null, ui = /* @__PURE__ */ new WeakMap();
function wu() {
  ui.delete(wt());
}
function Zn(e) {
  gu();
  const t = wt();
  let n = ui.get(t);
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
  }), ui.set(t, n)), hn() ? n : e === "quiet" ? sb(n) : e === "calm" ? hu(n) : n;
}
function Zt(e, t) {
  if (!t) return null;
  const n = wt().changes, a = (i) => i.mergeCommitSha.startsWith(t) || t.startsWith(i.mergeCommitSha.slice(0, 7)), r = n.find((i) => e.startsWith(i.repo) && a(i)) ?? (t.length >= 7 ? n.find(a) : null);
  if (!r) return null;
  const s = r.htmlUrl.split("/").pop() ?? "";
  return { ref: /^\d+$/.test(s) ? `#${s}` : s.slice(0, 7), title: r.title, author: r.author, mergedAt: r.mergedAt, href: r.htmlUrl };
}
function _a(e, t) {
  return (wt().rollouts.find((a) => a.metadata.name === e && a.metadata.namespace.endsWith(`-${t}`))?.status.history ?? []).map((a) => ({
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
    n.state === "done" && a.state === "done" && n.label.startsWith("Passed ") && a.label.startsWith("Passed ") && n.at && a.at && Date.parse(a.at) - Date.parse(n.at) < 8 * 6e4 && e.splice(t - 1, 2, { label: `${n.label} and ${a.label.slice(7)}`, at: a.at, state: "done", note: `${Jr(n.at)} and ${Jr(a.at)}` });
  }
}
function ku(e) {
  const t = [];
  for (const n of e) {
    const a = t.find((r) => r.before === n.before && r.after === n.after && r.beforeTone === n.beforeTone);
    a ? a.place = `${a.place}, ${n.place}` : t.push({ ...n });
  }
  return t;
}
const Xa = (e) => e ? Date.parse(e) : NaN;
function Xr(e) {
  const t = Math.max(0, Math.round(e / 6e4));
  if (t < 60) return `${t}m`;
  const n = Math.floor(t / 60);
  return n < 24 ? t % 60 ? `${n}h ${t % 60}m` : `${n}h` : `${Math.floor(n / 24)}d ${n % 24}h`;
}
function hb(e, t) {
  const n = e.apps.find((c) => c.app === t.app), a = n.envs.filter((c) => !c.isProdRegion && c.tier !== "prod" && c.state === "healthy"), r = a.length ? a[a.length - 1].version : null, s = Zt(t.app, r), i = n.envs.filter((c) => c.state === "awaiting-approval");
  let o = null;
  for (const c of a) {
    const u = _a(t.app, c.env).find((f) => r && f.sha === r.slice(0, 7));
    u && (!o || u.at > o) && (o = u.at);
  }
  const l = [t.since, o].filter(Boolean).sort().pop() ?? null;
  return {
    key: t.key,
    app: t.app,
    ref: s?.ref ?? null,
    title: s?.title ?? (r ? `build ${r.slice(0, 7)}` : t.app),
    author: s?.author ?? t.whose,
    places: i.length,
    placeWord: i.length === 1 ? i[0].env : `${i.length} prod regions`,
    since: l,
    href: t.href,
    build: r ? r.slice(0, 7) : null
  };
}
function mb(e, t) {
  const n = e.apps.find((v) => v.app === t.app), a = n.envs.find((v) => v.env === t.where[0]), r = _a(t.app, a.env), s = t.stops.filter((v) => !v.here && (v.state === "healthy" || v.state === "superseded") && v.since), i = a.pipeline, o = i.isFallback ? "all at once, no canary" : i.activeStep ? `canary step ${i.activeStep.index} of ${i.activeStep.total}` : "after every canary step", l = r[0]?.bakeEnd ?? t.since, c = Zt(t.app, t.rollbackTo), u = (a.isProdRegion, a.env), f = t.evidence ? t.evidence.replace(/ failing$/, "") : null, p = n.envs.filter((v) => v !== a);
  return {
    kind: "failing",
    eyebrow: `Your change is failing in ${u}`,
    ref: t.ref,
    title: t.title,
    href: a.href,
    meta: `${t.app} · merged by you ${Jr(t.mergedAt)}`,
    fact: null,
    check: f ? { name: f, message: r[0]?.bake === "Failed" ? "reported an error during the bake" : "failing" } : null,
    action: { label: `Roll back ${u}${t.rollbackTo ? ` to ${t.rollbackTo}` : ""}`, href: a.href },
    steps: [
      { label: "Merged", at: t.mergedAt, state: "done" },
      ...s.map((v) => ({ label: `Passed ${v.label}`, at: v.since, state: "done" })),
      { label: `Deployed to ${u}`, at: a.arrivedAt, state: "done", note: o },
      { label: "Bake failed", at: l, state: "fail", note: f },
      { label: "Roll back", at: null, state: "pending", note: t.rollbackTo ? `${u} goes back to ${t.rollbackTo}` : null }
    ],
    live: `failing ${Xr(Qt.getTime() - Xa(l))}`,
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
  const n = e.apps.find((f) => f.app === t.app), a = Zt(t.app, t.build), r = n.envs.filter((f) => !f.isProdRegion && f.tier !== "prod"), s = [];
  a && s.push({ label: "Merged", at: a.mergedAt, state: "done" });
  let i = a?.mergedAt ?? null;
  for (const f of r) {
    const p = _a(t.app, f.env).find((v) => t.build && v.sha === t.build);
    p && (s.push({ label: `Passed ${f.env}`, at: p.at, state: "done" }), i = p.at);
  }
  const o = t.since ?? i;
  vb(s), s.push({ label: `Deploys to ${t.placeWord}`, at: null, state: "pending", note: "on its own after that" });
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
    steps: s,
    live: `waits for you · ${Xr(Qt.getTime() - Xa(o))}`,
    next: "once you approve",
    preview: {
      action: "approval",
      rows: ku(c.map((f) => ({ place: f.label, before: (f.version ?? "").slice(0, 7), beforeTone: "neutral", after: t.build ?? t.ref ?? "" }))),
      rest: u.length ? `${u.map((f) => f.label).join(", ")} stay${u.length === 1 ? "s" : ""} on ${(u[0].version ?? "").slice(0, 7)}${u.length > 1 ? " and others" : ""}: no approval rule there` : null,
      foot: `Changes ${c.length} of ${l.length} prod regions. Dev, test and staging are not touched.`
    }
  };
}
function bb(e, t) {
  const n = e.apps.find((v) => v.app === t.app), a = n.envs.findIndex((v) => v.env === t.where[0]), r = n.envs[a], s = n.envs.slice(a + 1), i = s.filter((v) => !v.isProdRegion && v.tier !== "prod"), o = s.filter((v) => v.isProdRegion || v.tier === "prod"), l = t.state === "deploying" ? "Deploying to" : "Checking in", u = (Zn("incident").apps.find((v) => v.app === t.app)?.envs ?? []).filter((v) => v.state === "awaiting-approval" && s.some((y) => y.env === v.env)).map((v) => v.label), f = _a(t.app, r.env)[1];
  let p = null;
  if (f) {
    let v = null, y = null;
    for (const b of i) {
      const g = _a(t.app, b.env).find((m) => m.sha === f.sha);
      g && (v = b.env, y = g.at);
    }
    v && y && (p = `Your previous build, ${f.sha}, went from ${r.env} to ${v} in ${Xr(Xa(y) - Xa(f.at))}.`);
  }
  return {
    kind: "moving",
    eyebrow: "Nothing needs you · your change is moving",
    ref: t.ref,
    title: t.title,
    href: r.href,
    meta: `${t.app} · merged by you ${Jr(t.mergedAt)}`,
    check: null,
    fact: p,
    action: null,
    steps: [
      { label: "Merged", at: t.mergedAt, state: "done" },
      { label: `${l} ${r.env}`, at: t.since, state: "active", note: r.pipeline.activeStep ? `canary step ${r.pipeline.activeStep.index} of ${r.pipeline.activeStep.total}` : null },
      ...i.map((v) => ({ label: v.env, at: null, state: "pending" })),
      ...o.length ? [{ label: o.length === 1 ? o[0].env : `${o.length} prod regions`, at: null, state: "pending", note: u.length ? `${u.join(" and ")} need${u.length === 1 ? "s" : ""} an approver` : "promotes on its own" }] : []
    ],
    live: `${Xr(Qt.getTime() - Xa(t.since))} so far`,
    next: "next",
    preview: {
      action: `${t.ref} arrives`,
      rows: ku([
        { place: `${r.env} (deploying)`, before: _a(t.app, r.env)[1]?.sha ?? "", beforeTone: "neutral", after: t.ref },
        ...s.map((v) => ({ place: v.label, before: (v.version ?? "").slice(0, 7), beforeTone: "neutral", after: u.includes(v.label) ? `${t.ref} · approver` : t.ref }))
      ]),
      rest: null,
      foot: `Reaches ${n.envs.length} places; ${u.length ? `${u.join(" and ")} wait for an approver, the rest promote on their own` : "every step promotes on its own"}.`
    }
  };
}
function Jr(e) {
  return e ? new Date(e).toISOString().slice(11, 16) : "";
}
function wb(e, t) {
  const n = ob(e, Na()), a = n.elsewhere.filter((_) => _.canAct).map((_) => hb(e, _)), r = n.yours.filter((_) => _.state === "failed"), s = r.filter((_) => _.stops.some((A) => A.here && A.prod)).sort((_, A) => (A.since ?? "").localeCompare(_.since ?? ""));
  let i = null, o = null, l = null;
  if (s.length || r.length)
    o = s[0] ?? r[0], i = mb(e, o);
  else if (a.length)
    l = a[0], i = gb(e, l);
  else {
    const _ = n.yours.filter((A) => A.state === "deploying" || A.state === "checking").sort((A, E) => (E.since ?? "").localeCompare(A.since ?? ""));
    _.length && (o = _[0], i = bb(e, o));
  }
  const c = r.filter((_) => _ !== o).map((_) => ({ ..._, place: _.where.length > 1 ? `${_.where.length} places` : _.where[0], action: { label: `Roll back ${_.where[0]}`, href: _.action?.href ?? _.href } })), u = a.filter((_) => _ !== l), f = n.yours.filter((_) => _.state !== "failed" && _ !== o), p = f.filter((_) => _.state === "deploying" || _.state === "checking").map((_) => ({ ..._, reached: _.stops.filter((A) => A.state === "healthy" || A.state === "superseded" || A.state === "checking").length, total: _.stops.length })), v = f.filter((_) => _.state === "awaiting-approval"), y = f.filter((_) => _.state === "held-by-rule"), b = n.elsewhere.filter((_) => _.kind === "flapping").map((_) => ({ key: _.key, app: _.app, whose: _.whose, text: _.status.replace(/^Check flapping in (\S+): /, "Check flapping in $1: "), since: _.since, href: _.href })), g = n.elsewhere.filter((_) => !_.canAct && _.kind !== "flapping").map((_) => {
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
  }), m = [];
  let x = 0, h = 0, C = 0;
  for (const _ of e.apps)
    for (const A of _.envs)
      if (A.isProdRegion || A.tier === "prod")
        if (x++, A.state === "failed") {
          const E = n.yours.find((S) => S.app === _.app && S.where.includes(A.env) && S.state === "failed");
          m.push({ app: _.app, env: A.env, whose: E ? "you" : ci(_.app, Na()), ref: E?.ref ?? null, href: A.href });
        } else A.state === "held-by-rule" || A.state === "awaiting-approval" ? h++ : (A.state === "deploying" || A.state === "checking") && C++;
  return {
    lead: i,
    failures: c,
    approvals: u,
    moving: p,
    waiting: v,
    held: y,
    yoursTotal: f.length,
    notYours: g,
    prod: { total: x, failing: m, held: h, moving: C, rolledBack: n.rolledBack, signals: b }
  };
}
const kb = () => wt().changes;
function _b(e, t) {
  if (!t) return null;
  const n = Number(t.replace("#", "")), a = kb().find((r) => e.startsWith(r.repo) && r.number === n);
  return a ? a.author === Na() ? "you" : a.author : null;
}
const yb = ["dev", "test", "staging", "prod"], tl = (e) => e.isProdRegion || e.tier === "prod" ? "prod" : e.tier === "dev" ? "dev" : e.tier === "test" ? "test" : "staging", Fs = (e) => e === "deploying" || e === "checking", Is = (e) => e === "awaiting-approval", Ps = (e) => e === "failed", xb = () => wt().rollouts;
function Sb(e, t, n) {
  return e.find((r) => {
    const s = r.href.split("/").filter(Boolean);
    return s[0] === "rollouts" && s[2] === t && s[3] === n;
  }) ?? e.find((r) => !!r.env && (t === r.env || t.endsWith(`-${r.env}`))) ?? null;
}
function Cb(e) {
  const t = Zn(e), n = wb(t), a = Qt.getTime(), r = yb.map((C) => {
    const _ = [];
    for (const A of t.apps)
      for (const E of A.envs)
        tl(E) !== C || E.state === "not-deployed" || _.push({ app: A.app, env: E.env, label: E.label, state: E.state, href: E.href, version: E.version, since: E.arrivedAt, mine: E.myChanges.length > 0 });
    return {
      key: C,
      places: _,
      healthy: _.filter((A) => A.state === "healthy" || A.state === "superseded" || A.state === "rolled-back").length,
      moving: _.filter((A) => Fs(A.state)),
      held: _.filter((A) => Is(A.state)),
      failed: _.filter((A) => Ps(A.state)),
      apps: new Set(_.map((A) => A.app)).size
    };
  }).filter((C) => C.places.length), s = /* @__PURE__ */ new Set();
  for (const C of Zn("incident").apps) for (const _ of C.envs) _.state === "failed" && s.add(`${C.app}|${_.env}`);
  const i = (C, _) => Sb(t.apps.find((A) => A.app === _)?.envs ?? [], C, _), o = 24, l = 15 * 6e4, c = o * 36e5 / l, u = a - c * l, f = Array.from({ length: c }, (C, _) => ({ start: u + _ * l, ok: 0, failed: 0, live: 0 })), p = [];
  let v = 0;
  const y = [];
  for (const C of xb()) {
    const _ = i(C.metadata.namespace, C.metadata.name);
    if (!_) continue;
    (C.status.history ?? []).forEach((E, S) => {
      const w = Date.parse(E.timestamp);
      let L = E.bakeStatus ?? "Succeeded";
      L === "Failed" && e !== "incident" && s.has(`${C.metadata.name}|${_.env}`) && S === 0 && (L = "Succeeded");
      const k = _.isProdRegion || _.tier === "prod";
      if (w >= u && w <= a) {
        y.push({ t: w, tier: tl(_), app: C.metadata.name, env: _.label, kind: L === "Failed" ? "failed" : L === "Deploying" || L === "InProgress" ? "live" : "ok", sha: (E.version.revision ?? E.version.tag ?? "").slice(0, 7) });
        const T = f[Math.min(c - 1, Math.floor((w - u) / l))];
        L === "Failed" ? T.failed++ : L === "Deploying" || L === "InProgress" ? T.live++ : T.ok++, k && L !== "Failed" && v++;
      }
      if (a - w < 12 * 36e5 && (k || L === "Failed")) {
        const T = (E.version.revision ?? E.version.tag ?? "").slice(0, 7), F = Zt(C.metadata.name, T);
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
  const b = f.reduce((C, _) => C + _.ok + _.failed + _.live, 0), g = f.reduce((C, _) => C + _.failed, 0), m = Math.max(1, ...f.map((C) => C.ok + C.failed + C.live));
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
  const h = t.apps.map((C) => {
    const _ = C.envs.filter((L) => L.state !== "not-deployed" && L.version), E = [..._].sort((L, k) => (k.arrivedAt ?? "").localeCompare(L.arrivedAt ?? ""))[0]?.version ?? null, S = _.some((L) => Ps(L.state)) ? "failed" : _.some((L) => Fs(L.state)) ? "moving" : _.some((L) => Is(L.state)) ? "held" : "healthy", w = _.find((L) => S === "failed" ? Ps(L.state) : S === "moving" ? Fs(L.state) : S === "held" ? Is(L.state) : !1);
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
  return { events: y, m: t, v: n, tiers: r, pulse: { bins: f, total: b, failed: g, prodArrivals: v, peak: m, windowH: o }, apps: h, activity: x, places: r.reduce((C, _) => C + _.places.length, 0) };
}
const Ga = (e) => e ? e.includes("-") ? e.split("-").map((t) => t[0].toUpperCase() + t.slice(1)).join(" ") : e === "danielreed" ? "Daniel Reed" : e : null, Or = (e) => !!e && (e.toLowerCase() === Na().toLowerCase() || !cb() && e === "danielreed"), es = (e) => e.isProdRegion || e.tier === "prod" ? "prod" : e.tier === "dev" ? "dev" : e.tier === "test" ? "test" : "staging", nl = (e) => e === "failed" ? "failed" : e === "awaiting-approval" ? "approval" : e === "held-by-rule" ? "held" : e === "deploying" || e === "checking" ? "moving" : "rest", Ab = (e) => e === "failed" ? "failed" : e === "awaiting-approval" ? "approval" : e === "held-by-rule" ? "held" : e === "deploying" ? "deploying" : e === "checking" ? "checking" : "rest", Tb = ["dev", "test", "staging", "prod"];
function Mb(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e.apps) if (t.includes(a.app)) for (const r of a.envs) n.add(es(r));
  return Tb.filter((a) => n.has(a));
}
const Eb = (e) => e ? /^[0-9a-f]{8,40}$/.test(e) ? e.slice(0, 7) : e : null;
function _u(e) {
  const t = Cb(e), { v: n, m: a } = t, r = n.lead, s = r ? r.meta.split(" · ")[0] : null, i = new Map(n.approvals.map((S) => [S.app, S])), o = new Map(a.fleet.needsYou.map((S) => [`${S.app}@${S.env}`, S])), l = (S, w) => a.apps.find((L) => L.app === S)?.envs.find((L) => L.env === w)?.state, c = (S) => {
    const w = a.fleet.needsYou.filter((k) => k.app === S && l(S, k.env) === "held-by-rule"), L = new Set(w.map((k) => k.facts.provider ?? ""));
    return w.length && L.size === 1 && [...L][0] || null;
  }, u = (S, w) => {
    const L = o.get(`${S}@${w}`);
    return L ? L.facts.provider ?? null : c(S);
  }, f = [], p = /* @__PURE__ */ new Map();
  for (const S of a.apps)
    for (const w of S.envs) {
      if (w.state === "not-deployed") continue;
      const L = es(w);
      if (nl(w.state) === "rest") {
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
        mine: k ? { ref: k.ref, title: k.title, who: Ga(Na()), mine: !0 } : null,
        pipeline: w.pipeline ?? null
      });
    }
  const v = [];
  for (const S of f) {
    const w = nl(S.state), L = v.find((J) => J.app === S.app && J.tier === "prod" && S.tier === "prod" && J.state === S.state && J.glyph === "waiting" == !!S.prov && (S.state === "awaiting-approval" || S.state === "held-by-rule" || J.version === S.version));
    if (L) {
      L.regions.push(S.label), L.where = `${L.regions.length} prod regions`;
      continue;
    }
    const k = S.state === "awaiting-approval" ? i.get(S.app) : void 0, T = n.notYours.find((J) => J.key === `${S.app}@${S.env}`) ?? (S.state === "held-by-rule" ? n.notYours.find((J) => J.app === S.app && J.key.endsWith(S.label)) : void 0), F = S.state === "held-by-rule" || S.state === "awaiting-approval", B = F ? null : Zt(S.app, S.version), j = S.mine ?? (k ? { ref: k.ref ?? k.build, title: k.ref ? k.title : `build ${k.build}`, who: Ga(k.author), mine: Or(k.author) } : null) ?? (T ? { ref: T.ref, title: T.title ?? `build ${T.ref}`, who: Ga(T.whose), mine: Or(T.whose) } : null) ?? (B ? { ref: B.ref, title: B.title, who: Ga(B.author), mine: Or(B.author) } : null) ?? (!F && S.version ? { ref: null, title: `build ${S.version}`, who: null, mine: !1 } : null);
    j && j.ref && j.title === `build ${j.ref}` && (j.ref = null);
    const O = !!r && s === S.app && (r.kind === "failing" && S.state === "failed" || r.kind === "approval" && S.state === "awaiting-approval"), z = o.get(`${S.app}@${S.env}`), ae = S.state === "failed" && (!!j?.mine || O || n.failures.some((J) => J.app === S.app)) || S.state === "awaiting-approval" && !!k, re = S.state === "failed" ? "Failing" : S.state === "awaiting-approval" ? k ? "Waits for your approval" : "Waits for approval" : S.state === "held-by-rule" ? S.prov ? `Waits on ${S.prov}` : T?.status?.startsWith("Waits on a dependency") ? "Waits on a dependency" : "Held by a rule" : S.state === "deploying" ? "Deploying" : "Checking", K = O && r?.check ? `${r.check.name} ${r.check.message}` : z?.phrase ?? null;
    v.push({
      key: `${S.app}@${S.env}`,
      app: S.app,
      tier: S.tier,
      where: S.tier === "prod" && S.label === "prod" ? "production" : S.label,
      regions: [S.label],
      state: S.state,
      group: w,
      glyph: S.prov ? "waiting" : Ab(S.state),
      word: re,
      change: j,
      version: S.version,
      since: S.since,
      href: S.href,
      needsYou: ae,
      lead: O,
      action: O && r?.action ? { label: r.action.label.replace(/ to [0-9a-f]{7}$/, ""), href: r.action.href, kind: "rollback" } : S.state === "failed" && ae ? { label: "Roll back", href: S.href, kind: "rollback" } : S.state === "awaiting-approval" && k ? { label: "Approve", href: S.href, kind: "approve" } : null,
      cause: K,
      pipeline: S.pipeline
    });
  }
  const y = { prod: 0, staging: 1, test: 2, dev: 3 };
  v.sort((S, w) => Number(w.lead) - Number(S.lead) || Number(w.needsYou) - Number(S.needsYou) || y[S.tier] - y[w.tier] || (w.since ?? "").localeCompare(S.since ?? ""));
  const g = ["failed", "approval", "held", "moving"].map((S) => ({ key: S, rows: v.filter((w) => w.group === S), places: v.filter((w) => w.group === S).reduce((w, L) => w + L.regions.length, 0) })).filter((S) => S.rows.length), m = [...p.values()].filter((S) => !v.some((w) => w.app === S.app)).sort((S, w) => S.app.localeCompare(w.app)), x = [...p.values()].reduce((S, w) => S + w.places, 0), h = [...p.values()].sort((S, w) => S.app.localeCompare(w.app)), C = v.filter((S) => S.group === "failed").reduce((S, w) => S + w.regions.length, 0), _ = v.filter((S) => S.group === "failed" && S.tier === "prod").reduce((S, w) => S + w.regions.length, 0), A = v.filter((S) => S.group === "approval" && S.needsYou).length, E = v.filter((S) => S.group === "moving").reduce((S, w) => S + w.regions.length, 0);
  return {
    c: t,
    rows: v,
    groups: g,
    rest: m,
    restAll: h,
    restPlaces: x,
    figures: { failing: C, prodFailing: _, yourApprovals: A, moving: E, places: t.places, apps: t.apps.length },
    activity: t.activity.map((S) => ({ ...S, who: Ga(S.author), mine: Or(S.author), where: S.env === "prod" ? "production" : S.env })),
    tiers: t.tiers
  };
}
function Lb(e) {
  const t = _u(e), n = t.c, a = { dev: 0, test: 1, staging: 2, prod: 3 }, r = n.apps.map((c) => {
    const u = n.m.apps.find((h) => h.app === c.app), f = t.rows.filter((h) => h.app === c.app), p = f[0] ?? null, v = f.find((h) => h.group === "failed") ?? f.find((h) => h.needsYou) ?? f.find((h) => h.group === "moving") ?? p, y = v ? v.group === "failed" || v.needsYou ? "needs" : v.group === "moving" ? "moving" : "waiting" : "quiet", b = u.envs.filter((h) => h.state !== "not-deployed"), g = b.filter((h) => h.version?.slice(0, 7) === c.newest && !["awaiting-approval", "held-by-rule"].includes(h.state)), m = g.length ? g.map((h) => es(h)).reduce((h, C) => a[C] > a[h] ? C : h) : null, x = v ? v.group === "failed" ? `Failing in ${v.where}` : v.state === "awaiting-approval" ? `Waits for approval in ${v.where}` : v.group === "moving" ? `${v.word} ${v.state === "deploying" ? "to" : "in"} ${v.where}` : `${v.word.startsWith("Waits on") ? v.word : "Held"} in ${v.where}` : `${c.places} ${c.places === 1 ? "place" : "places"} at rest`;
    return {
      app: c.app,
      href: c.href,
      group: y,
      glyph: v ? v.group === "failed" ? "failed" : v.needsYou ? "approval" : v.group === "moving" ? v.glyph : "waiting" : "rest",
      fact: x,
      change: v?.change ?? null,
      reach: m,
      at: v ? v.tier : m,
      since: v?.since ?? null,
      places: c.places,
      onNewest: c.onNewest,
      newest: c.newest,
      envs: new Set(b.map((h) => es(h))).size,
      tiers: Mb(n.m, [c.app]),
      action: v?.action ?? null,
      lead: !!v?.lead,
      deploys24: n.events.filter((h) => h.app === c.app).length
    };
  }), s = (c) => Math.max(0, ...n.events.filter((u) => u.app === c).map((u) => u.t)), i = ["needs", "moving", "waiting", "quiet"], o = (c) => c.lead ? 0 : c.glyph === "failed" ? 1 : 2, l = i.map((c) => ({ key: c, rows: r.filter((u) => u.group === c).sort((u, f) => o(u) - o(f) || (c === "quiet" ? s(f.app) - s(u.app) : (f.since ?? "").localeCompare(u.since ?? ""))) })).filter((c) => c.rows.length);
  return { R: t, items: r, groups: l };
}
const Nb = (e) => e.replace(/^Waits for (your )?approval/, (t, n) => Ct("approval", { yours: !!n })), ha = (e) => e ? _r(e, Qt) : "", Ki = () => wt().rollouts, vn = (e) => {
  const t = e.split("/").filter(Boolean);
  return t[0] === "rollouts" ? { cluster: t[1], ns: t[2], name: t[3] } : null;
}, ke = (e) => {
  gu();
  const t = vn(e);
  return t ? Ki().find((n) => n.metadata.namespace === t.ns && n.metadata.name === t.name) ?? null : null;
}, js = (e) => e === "done" ? "done" : e === "fail" ? "fail" : e === "active" ? "active" : "todo";
function yu(e) {
  if (!e) return [{ name: "Started", state: "done" }, { name: "Check", state: "todo" }];
  if (e.isFallback) {
    const n = e.tracks[0]?.stages[0]?.state ?? "pending";
    return [{ name: "Started", state: "done" }, { name: "Check", state: n === "active" ? "todo" : js(n === "fail" ? n : e.bake) }];
  }
  const t = [{ name: "Started", state: "done" }];
  for (const n of e.tracks) n.stages.forEach((a, r) => t.push({ name: `Stage ${r + 1}`, state: js(a.state) }));
  return t.push({ name: "Check", state: js(e.bake) }), t;
}
function Yi(e) {
  const t = yu(e.pipeline);
  if ((e.state === "awaiting-approval" || e.state === "held-by-rule") && !t.some((n) => n.state === "active")) return t.map((n) => ({ name: n.name, state: "done" }));
  if (e.state === "awaiting-approval" || e.state === "held-by-rule") return t;
  if (e.state === "checking") return t.map((n, a) => ({ name: n.name, state: a === t.length - 1 ? "active" : "done" }));
  if (e.state === "deploying" && (!e.pipeline || e.pipeline.isFallback)) return t.map((n, a) => ({ name: n.name, state: a < t.length - 1 ? "done" : "active" }));
  if (e.state === "deploying") {
    let n = t.findIndex((a) => a.state === "active");
    return n < 0 && (n = t.findIndex((a) => a.state === "todo" && a.name !== "Check")), n < 0 && (n = 0), t.map((a, r) => ({ name: a.name, state: r < n ? "done" : r === n ? "active" : "todo" }));
  }
  return t;
}
const Rb = (e) => e.map((t) => `${t.name}:${t.state}`).join("|");
function Ob(e) {
  const t = ke(e.href)?.status.history ?? [], n = e.state === "awaiting-approval" || e.state === "held-by-rule" ? 0 : 1, a = t.slice(n).find((r) => (r.bakeStatus ?? "Succeeded") === "Succeeded");
  return a ? { build: Fe(a.version.version ?? a.version.tag ?? a.version.revision) ?? "", at: a.timestamp } : null;
}
function Db(e, t = "incident") {
  const n = mn(t, e.app), a = n.map((l) => ke(l.href)?.status).find((l) => l?.availableReleases?.length)?.availableReleases, r = a?.[a.length - 1], s = r ? [r.tag, r.version, r.revision?.slice(0, 7)].filter(Boolean).map((l) => Fe(l)) : null, i = s ? n.filter((l) => !!l.version && s.includes(l.version)).length : n.filter((l) => l.onBuild).length;
  return xm({ onHead: i, deployed: n.length, total: n.length }).replace(/^All on the newest$/, `All ${n.length} places on the newest build`).replace(/^(\d+) of (\d+) on the newest$/, "$1 of $2 places on the newest build").replace(/^(\d+) of 1 places/, "$1 of 1 place");
}
function xu(e) {
  if (e.group !== "failed") return null;
  const t = ke(e.href)?.status.history?.[0];
  if (!t) return null;
  const n = t.failedHealthChecks?.[0], a = /^A HealthCheck reported an error/.test(t.bakeStatusMessage ?? ""), r = t.bakeStatusMessage && !a ? t.bakeStatusMessage : null, s = n?.name ?? null, i = n?.message ?? null, o = i?.split(/;\s/)[0] ?? null, l = s && o ? `${s}: ${o}` : s ?? o ?? r ?? "Failing", c = vn(e.href), f = (c ? (wt().healthChecks ?? []).find((p) => p.metadata.namespace === c.ns && p.metadata.name === c.name)?.healthChecks.find((p) => p.metadata?.name === s) : void 0)?.status?.observations ?? n?.observations ?? [];
  return { check: s, message: i, phrase: r, line: l, observations: f };
}
function Ra(e) {
  const t = e.regions ?? (e.label ? [e.label] : []), n = Va(t), a = t.map((r) => (r ?? "").trim()).find((r) => Vi(r) !== "default");
  return e.tier === "prod" ? n > 1 ? `${n} prod regions` : a ?? "production" : t.find((r) => r && r.trim()) ?? e.tier;
}
const Fb = (e) => {
  const t = xu(e), n = e;
  if (n.steps = Yi(e), n.failure = t, n.place = Ra(e), n.deployedAt = ke(e.href)?.status.history?.[0]?.timestamp ?? e.since ?? null, t) {
    n.cause = t.line;
    const a = ke(e.href)?.status.history?.[0]?.bakeEndTime;
    a && (n.since = a);
  }
  return n;
}, dr = (e) => {
  const t = ke(e.href)?.status.history?.[0]?.version;
  return (t ? Fe(t.version ?? t.tag ?? t.revision) : null) ?? e.version ?? "";
}, Ib = (e) => {
  const t = ke(e.href)?.status.history?.[0]?.version.revision?.slice(0, 7) ?? null;
  return t && t !== dr(e) ? t : null;
}, Pb = (e) => {
  const t = ke(e.href)?.status.history?.[0]?.version.revision;
  return t ? t.slice(0, 7) : e.version ?? "";
};
function jb(e) {
  const t = e, n = t.steps ?? Yi(e), a = e.group === "approval" ? yr(e) : null;
  return {
    "data-truth-state": e.state,
    "data-truth-steps": Rb(n),
    "data-truth-age": t.deployedAt ?? ke(e.href)?.status.history?.[0]?.timestamp ?? e.since ?? "",
    "data-truth-since": a?.since ?? e.since ?? "",
    ...a ? { "data-truth-wait-build": a.build } : {},
    "data-truth-cause": (t.failure ?? xu(e))?.line ?? e.cause ?? (e.state === "awaiting-approval" ? Ct("approval") : e.word),
    "data-truth-build": dr(e),
    "data-truth-place": Ra(e)
  };
}
const di = (e) => e ? e.group === "failed" ? e.tier === "prod" ? 0 : 1 : e.state === "awaiting-approval" ? 2 : e.state === "held-by-rule" ? 3 : e.state === "deploying" || e.state === "checking" ? 4 : 5 : 9, Su = (e, t) => di(e) - di(t) || +!!t?.needsYou - +!!e?.needsYou || (t?.since ?? "").localeCompare(e?.since ?? "");
function Wb(e) {
  const t = Ua(e).rows[0];
  return t && di(t) <= 4 ? t : null;
}
const fr = (e) => {
  const t = ke(e)?.status, n = (t?.releaseCandidates ?? []).map((r) => r.tag ?? r.version ?? "");
  return n.length && (t?.gates ?? []).find((r) => /approval/.test(r.name) && r.allowedVersions != null && n.every((s) => !r.allowedVersions.includes(s))) ? n.length : 0;
};
function Bb(e, t) {
  const n = e.action;
  return n ? e.group === "failed" ? n.kind === "rollback" ? n : null : e.group === "approval" && n.kind === "approve" ? n : null : null;
}
function Ua(e) {
  const t = _u(e), n = t.rows.map(Fb), a = new Set(t.c.v.approvals.map((c) => c.app));
  for (const c of n)
    c.word = Nb(c.word), (c.state === "checking" || c.state === "deploying") && fr(c.href) > 0 ? (c.state = "awaiting-approval", c.group = "approval", c.glyph = "approval", c.needsYou = a.has(c.app), c.word = Ct("approval", { yours: c.needsYou }), c.action = c.needsYou ? { label: "Approve", href: c.href, kind: "approve" } : null, c.stillChecking = !0, c.steps = yu(c.pipeline)) : c.stillChecking = !1;
  n.sort(Su);
  for (const c of n) c.regionsOf = c.tier === "prod" && c.regions.length > 1 ? { n: c.regions.length, of: Hb(t.c.m, [c.app]) } : null;
  const s = ["failed", "approval", "held", "moving"].map((c) => ({ key: c, rows: n.filter((u) => u.group === c), places: n.filter((u) => u.group === c).reduce((u, f) => u + f.regions.length, 0) })).filter((c) => c.rows.length), i = (c) => s.find((u) => u.key === c)?.places ?? 0, o = { unit: "places", failing: i("failed"), approval: i("approval"), held: i("held"), waiting: i("approval") + i("held"), moving: i("moving"), rowCount: n.length }, l = { ...t.figures, yourApprovals: n.filter((c) => c.group === "approval" && c.needsYou).length, moving: i("moving") };
  return { ...t, rows: n, groups: s, figures: l, placeFigures: o };
}
const Ja = { dev: 0, test: 1, staging: 2, prod: 3 }, zb = () => wt().changes, ts = (e) => e.isProdRegion || e.tier === "prod" ? "prod" : e.tier === "dev" ? "dev" : e.tier === "test" ? "test" : "staging";
function Hb(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e.apps) if (t.includes(a.app))
    for (const r of a.envs) ts(r) === "prod" && r.state !== "not-deployed" && Vi(r.label) !== "default" && n.add(r.label);
  return n.size;
}
function Cu(e) {
  return gm(e, wt().github);
}
const Fe = (e) => e ? /^[0-9a-f]{8,40}$/.test(e) ? e.slice(0, 7) : e : null, Oa = /^(\d+)\.(\d+)\.(\d+)(?:-(\d+))?$/, Au = (e, t) => {
  const n = Oa.exec(e), a = Oa.exec(t);
  for (let r = 1; r <= 4; r++) {
    const s = +(n[r] ?? 0) - +(a[r] ?? 0);
    if (s) return s;
  }
  return 0;
};
function mn(e, t) {
  const n = (Zn(e).apps.find((s) => s.app === t)?.envs ?? []).filter((s) => s.state !== "not-deployed" && s.version), a = [...n].sort((s, i) => {
    const o = Fe(s.version), l = Fe(i.version);
    if (Oa.test(o) && Oa.test(l)) return Au(l, o);
    const c = Zt(t, o)?.mergedAt, u = Zt(t, l)?.mergedAt;
    return c && u && c !== u ? u.localeCompare(c) : (i.arrivedAt ?? "").localeCompare(s.arrivedAt ?? "");
  })[0], r = a ? Fe(a.version) : null;
  return n.map((s) => ({ env: s.env, label: s.label, tier: ts(s), state: s.state, href: s.href, version: Fe(s.version), onNewest: Fe(s.version) === r && s.state !== "failed", onBuild: Fe(s.version) === r, newest: r }));
}
function Vb(e) {
  const t = (n) => Rh(n.state) * 2 + (n.needsYou ? 0 : 1);
  return [...e].sort((n, a) => t(n) - t(a) || +(a.tier === "prod") - +(n.tier === "prod") || (a.since ?? "").localeCompare(n.since ?? ""))[0] ?? null;
}
const Ub = (e) => e.group === "failed" ? `Failing in ${e.where}` : e.state === "awaiting-approval" ? `${Ct("approval")} in ${e.where}` : e.group === "moving" ? `${e.word} ${e.state === "deploying" ? "to" : "in"} ${e.where}` : `${e.word.startsWith("Waits on") ? e.word : "Held"} in ${e.where}`, qb = (e, t) => {
  const n = vn(e);
  return n ? hm(n.cluster, n.ns, t) : null;
};
function al(e, t) {
  const n = ke(e)?.status;
  return (n?.availableReleases ?? []).findIndex((s) => [s.tag, s.version, s.revision?.slice(0, 7)].some((i) => i && Fe(i) === t)) < 0 ? null : Hi(n);
}
function Tu(e) {
  const t = Lb(e), n = Ua(e), a = Zn(e), r = Iu(e), s = t.items.map((l) => {
    const c = n.rows.filter((w) => w.app === l.app), u = Vb(c), f = (a.apps.find((w) => w.app === l.app)?.envs ?? []).filter((w) => w.state !== "not-deployed" && w.version), p = [...f].sort((w, L) => {
      const k = Fe(w.version), T = Fe(L.version);
      if (Oa.test(k) && Oa.test(T)) return Au(T, k);
      const F = Zt(l.app, k)?.mergedAt, B = Zt(l.app, T)?.mergedAt;
      return F && B && F !== B ? B.localeCompare(F) : (L.arrivedAt ?? "").localeCompare(w.arrivedAt ?? "");
    })[0], v = p ? Fe(p.version) : l.newest, y = f.map((w) => ({ env: w.env, label: w.label, tier: ts(w), state: w.state, href: w.href, version: Fe(w.version), onNewest: Fe(w.version) === v && w.state !== "failed", onBuild: Fe(w.version) === v })), b = y.filter((w) => w.onNewest).length, g = y.filter((w) => w.tier === "prod");
    let m = u ? Ub(u) : l.fact, x = null, h = null;
    const C = (w) => al(w.href, w.version);
    if (!u) {
      const L = ["dev", "test", "staging", "prod"].map((k) => ({ t: k, ps: y.filter((T) => T.tier === k && !T.onNewest && T.state !== "failed") })).find((k) => k.ps.length);
      if (L) {
        const k = Math.max(...L.ps.map((T) => C(T) ?? 1));
        m = `Ready to promote to ${L.t} · ${k} behind`, h = L.ps[0].href;
      }
    }
    if (u && (u.state === "held-by-rule" || u.state === "awaiting-approval") && u.group !== "failed") {
      const w = r.find((L) => L.rows.some((k) => k.href === u.href));
      x = w ? u.state === "awaiting-approval" ? Ct("approval") : w.cause.replace(/^Waiting/, "Waits") : u.state === "awaiting-approval" ? Ct("approval") : null, x && (m = `${x} in ${u.place}`);
    }
    const _ = c.find((w) => w.group === "failed"), A = _ ? { build: Fe(_.version) ?? Pb(_), place: _.place, href: _.href, line: _.failure?.line ?? "Failing" } : null, E = [];
    for (const w of r) {
      const L = w.rows.filter((T) => T.app === l.app);
      if (!L.length) continue;
      const k = L.length > 1 ? `${L.length} places` : L[0].place;
      E.push(`${w.cause === Ct("approval") ? w.cause : w.cause.replace(/^Waiting/, "Waits")} in ${k}`);
    }
    for (const w of a.apps.find((L) => L.app === l.app)?.envs ?? []) {
      const L = ke(w.href)?.spec?.wantedVersion;
      L && w.state !== "not-deployed" && E.push(`Pinned to ${Fe(w.version) ?? L} in ${Ra({ tier: ts(w), regions: [w.label] })}`);
    }
    const S = [m, ...E.filter((w) => !m.includes(w))].join(" · ");
    return Object.assign(l, { approval: !!u && u.state === "awaiting-approval" && u.group !== "failed", behind: (() => {
      let w = null;
      for (const L of y) {
        const k = al(L.href, L.version) ?? 0;
        k > (w?.n ?? 0) && (w = { n: k, place: Ra({ tier: L.tier, regions: [L.label] }) });
      }
      return w;
    })(), row: u, outcomeHref: u?.href ?? h ?? y[0]?.href ?? l.href, failedCount: y.filter((w) => w.state === "failed").length, holds: E, outcome: S, newest: v, onNewest: b, fact: m, blocker: x, failing: A, placeList: y, prod: { regions: g.length, onNewest: g.filter((w) => w.onNewest).length } });
  }), i = Wb(e);
  for (const l of s) l.lead = !!i && l.row?.href === i.href;
  const o = t.groups;
  for (const l of o) l.key === "needs" && l.rows.sort((c, u) => Su(c.row, u.row) || c.app.localeCompare(u.app));
  return { R: n, items: s, groups: o, lead: s.find((l) => l.lead) ?? null };
}
function yr(e) {
  const t = $i(e), n = t.some((o) => o.here) ? t.filter((o) => o.here) : t, a = mn("incident", e.app), r = a.find((o) => o.href === e.href), s = (o) => r ? Math.max(-1, ...a.filter((l) => Ja[l.tier] < Ja[r.tier] && Fe(l.version) === o).map((l) => Ja[l.tier])) : -1, i = [...n].sort((o, l) => s(l.build) - s(o.build));
  return i[0] ? { build: i[0].build, title: i[0].title, author: i[0].author, since: i[0].created, count: i.length } : null;
}
function Gb(e, t = "incident") {
  if (!yr(e)) return null;
  const a = $i(e), r = a.some((l) => l.here) ? a.filter((l) => l.here) : a, s = mn(t, e.app).filter((l) => Ja[l.tier] < Ja[e.tier]), i = (l) => {
    if (!s.length) return l.created;
    const c = [];
    for (const f of s) for (const p of ke(f.href)?.status.history ?? []) Fe(p.version.version ?? p.version.tag ?? p.version.revision) === l.build && c.push(p.timestamp);
    if (!c.length) return null;
    const u = c.sort()[0];
    return l.created && l.created > u ? l.created : u;
  };
  return r.map(i).filter((l) => !!l).sort()[0] ?? null;
}
function ns(e) {
  const t = Ru(e), n = ke(e.href)?.status.history?.[0]?.version.revision?.slice(0, 7) ?? "";
  return { build: dr(e), meta: Ib(e), title: Eu(e.href, n, null) ?? ws(n, e.href)?.title ?? Zt(e.app, n)?.title ?? (t?.title && !/^Release commit for build /.test(t.title) ? t.title : null), author: t?.author ?? null, at: ke(e.href)?.status.history?.[0]?.timestamp ?? null };
}
function Ws(e) {
  const t = ke(e.href)?.status;
  ke(e.href)?.status.currentVersion;
  const n = t?.availableReleases ?? [], a = Hi(ke(e.href)?.status);
  if (!a) return null;
  const r = e.state === "awaiting-approval" ? "waiting for approval" : e.state === "held-by-rule" ? e.word.replace(/^Waits on /, "waiting on ") : e.state === "failed" ? "waiting for health checks" : null, s = n[n.length - 1], i = r ? Lu(e.href) : null, o = i && i.waiting > 0 ? `${i.count} held: ${r}, ${i.waiting} waiting for ${i.stage ?? "an earlier stage"}` : r ? `held: ${r}` : "";
  return { count: a, sentence: `${a} newer build${a === 1 ? "" : "s"}${o ? ` · ${o}` : ""}`, newest: s ? Fe(s.version ?? s.tag) : null };
}
function Kb(e, t = "incident") {
  const n = new Set(Ua(t).rows.filter((a) => a.state === "awaiting-approval" || a.state === "held-by-rule").map((a) => a.href));
  return mn(t, e).filter((a) => a.tier === "prod").map((a) => {
    const r = n.has(a.href) && a.state !== "failed" ? "awaiting-approval" : a.state;
    return { label: a.label, state: r, ink: r === "failed" ? "failed" : r === "awaiting-approval" || r === "held-by-rule" ? "waiting" : r === "deploying" || r === "checking" ? "moving" : "healthy", href: a.href, build: a.version, onNewest: a.onBuild };
  });
}
function Yb(e, t = "incident") {
  if (e.state !== "awaiting-approval" && e.state !== "held-by-rule") return null;
  const n = ke(e.href)?.status, a = n?.releaseCandidates?.[0]?.tag ?? n?.releaseCandidates?.[0]?.version, r = n?.gates ?? [], s = r.filter((l) => l.allowedVersions != null && !!a && !l.allowedVersions.includes(a));
  s.length || s.push(...r.filter((l) => l.passing === !1));
  const i = (e.state === "awaiting-approval" ? s.find((l) => /approval/.test(l.name)) : null) ?? s[0];
  if (!i) return null;
  if (/^dependency-/.test(i.name)) {
    const l = Zn(t).fleet.needsYou, c = l.find((u) => `${u.app}@${u.env}` === e.key)?.facts?.provider ?? l.find((u) => u.app === e.key.split("@")[0] && u.facts?.provider)?.facts?.provider;
    if (c) return { name: c, sentence: `Releases when ${c} ships a newer version` };
  }
  const o = e.state === "awaiting-approval" ? "Releases when someone approves" : /^dependency-/.test(i.name) || /^Waits on [a-z]/.test(e.word) ? "Releases when its dependency ships a newer version" : /schedule|window|freeze/.test(i.name) ? "Releases when the deploy window opens" : /check|health|test/.test(i.name) || Zn(t).fleet.needsYou.find((l) => `${l.app}@${l.env}` === e.key)?.facts?.reason === "check" ? "Releases when the check starts passing" : "Releases when the rule allows this build";
  return { name: Pi(i.name, qb(e.href, i.name)), sentence: o };
}
const rl = /* @__PURE__ */ new WeakMap();
function $b() {
  const e = wt(), t = rl.get(e);
  if (t) return t;
  const n = /* @__PURE__ */ new Map();
  for (const a of zb()) n.set(a.mergeCommitSha.slice(0, 7), { pr: a.kind === "pr" ? a.number ?? null : null, title: a.title, author: a.author ?? null, href: a.htmlUrl ?? null, repo: a.repo });
  if (!pb())
    try {
      const a = JSON.parse(bm("GET", "/api/github/changes", new URLSearchParams({ days: "365" }))?.body ?? "{}");
      for (const r of a.changes ?? [])
        n.set(r.mergeCommitSha.slice(0, 7), { pr: r.kind === "pr" ? r.number ?? null : null, title: r.title, author: r.author, href: r.htmlUrl, repo: r.repo });
    } catch {
    }
  return rl.set(e, n), n;
}
function ws(e, t) {
  if (!e) return null;
  let n = /^[0-9a-f]{7,40}$/.test(e) ? e.slice(0, 7) : null;
  return !n && t && (n = (ke(t)?.status.availableReleases ?? []).find((r) => r.tag === e || r.version === e)?.revision?.slice(0, 7) ?? null), n ? $b().get(n) ?? null : null;
}
function Mu(e, t) {
  const n = vn(e), a = ke(e)?.status.availableReleases ?? [], r = a.findIndex((o) => o.tag === t || o.version === t);
  if (!n || r < 0) return null;
  const s = a[r].revision ?? a[r].tag ?? t, i = r > 0 ? a[r - 1].revision ?? a[r - 1].tag ?? "" : "";
  try {
    const o = Vc(wm(n.ns, n.name, n.cluster), { base: i, head: s });
    if (!o) return null;
    const l = o.commits ?? [], c = l[l.length - 1];
    if (!c) return null;
    const u = /^Release commit for build /.test(String(c.message)) ? ws(c.sha, e) : null;
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
  const s = (n?.availableReleases ?? []).find((i) => i.tag === t || i.version === t || (i.revision ?? "").startsWith(t))?.revision ?? (/^[0-9a-f]{7,40}$/.test(t) ? t : null);
  if (!s) return null;
  try {
    const i = Vc(`/api/github/repos/${a[1]}/${a[2]}/commits/${s}`);
    return i?.subject ? { title: i.subject, author: i.author ?? null } : null;
  } catch {
    return null;
  }
}
function Eu(e, t, n) {
  const a = Qb(e, t)?.title ?? (n && !/^Release commit for build /.test(n) ? n : null) ?? ws(t, e)?.title ?? n ?? null;
  return a && !/^Release commit for build /.test(a) ? a : null;
}
function Lu(e) {
  const t = ke(e), n = dm(e), a = n ? fm(n) : null;
  return !t || !a ? null : { count: a.count, waiting: a.waiting, stage: a.stage, has: (r) => a.ids.has(ms(t, r.tag ?? r.version ?? "") || (r.tag ?? r.version ?? "")) };
}
function $i(e) {
  const t = ke(e.href)?.status, n = (t?.gates ?? []).filter((r) => /^promotion-/.test(r.name) && r.allowedVersions != null), a = Lu(e.href);
  return (t?.releaseCandidates ?? []).map((r) => {
    const s = r.tag ?? r.version ?? "", i = Mu(e.href, s), o = Eu(e.href, s, i?.title), l = i?.author ?? null, c = r.version ?? r.tag ?? s;
    return { build: Fe(c) ?? c, title: o, author: l, created: r.created ?? null, here: a ? a.has({ tag: r.tag, version: r.version }) : n.every((u) => u.allowedVersions.includes(s)) };
  });
}
function Nu(e) {
  const t = vn(e.href), n = ke(e.href)?.status.history?.[0];
  if (!t || !n) return [];
  const a = (n.failedHealthChecks ?? []).map((r) => ({ name: r.name, state: "failing", since: n.bakeEndTime ?? n.timestamp, message: r.message ?? null }));
  for (const r of (wt().healthChecks ?? []).flatMap((s) => s.metadata.namespace === t.ns && s.metadata.name === t.name ? s.healthChecks : [])) {
    const s = r.metadata.annotations?.["kuberik.com/display-name"] ?? r.metadata.name;
    if (a.some((o) => o.name === s)) continue;
    const i = r.status?.status;
    a.push({ name: s, state: i === "Healthy" ? "passing" : i === "Pending" ? "pending" : "failing", since: r.status?.lastChangeTime ?? null, message: i === "Healthy" ? null : r.status?.message ?? null });
  }
  return a.some((r) => r.name === "Flux Deployment") || a.push({ name: "Flux Deployment", state: "passing", since: n.timestamp, message: null }), a;
}
function Ru(e) {
  const t = ke(e.href)?.status.history?.[0]?.version;
  if (!t) return null;
  const n = Mu(e.href, t.tag ?? t.version ?? t.revision ?? "");
  return ws(t.revision ?? t.tag, e.href), n;
}
function Zb(e) {
  const t = Ru(e);
  return t ? { title: t.title, author: t.author } : null;
}
function Qi(e) {
  const t = ke(e.href)?.status.history?.[0]?.bakeStatus;
  return e.group === "failed" || t === "Failed" ? "failed" : t === "Deploying" ? "deploying" : t === "InProgress" ? "checking" : t ? "done" : e.state === "deploying" ? "deploying" : e.state === "checking" ? "checking" : "done";
}
function ua(e) {
  if (Qi(e) !== "checking") return null;
  const t = ke(e.href), n = t?.status.history?.[0], a = /^(\d+)(s|m|h)$/.exec(t?.spec?.bakeTime ?? "");
  if (!n?.bakeStartTime || !a) return null;
  const r = Date.parse(n.bakeStartTime) + +a[1] * { s: 1e3, m: 6e4, h: 36e5 }[a[2]] - Qt.getTime();
  if (!(r > 0)) return null;
  const s = Math.ceil(r / 6e4);
  return s < 60 ? `${s} min left` : `${Math.floor(s / 60)} h ${s % 60} min left`;
}
function sl(e) {
  const t = Qi(e), n = Nu(e).map((r) => r.name === "Flux Deployment" && (t === "deploying" || t === "checking") ? "pending" : r.state), a = (r) => n.filter((s) => s === r).length;
  return a("failing") ? `${a("failing")} failing · ${a("passing")} passing` : a("pending") ? `${a("pending")} pending · ${a("passing")} passing` : `${a("passing")} passing`;
}
function Xb(e) {
  const t = ke(e.href)?.status.history?.[0], n = Qi(e);
  return {
    step: "Final check",
    age: ha(e.since ?? t?.timestamp ?? Qt.toISOString()),
    message: t?.bakeStatusMessage ?? null,
    healthChecks: n === "failed" ? "Failed" : n === "deploying" ? "Waiting" : n === "checking" ? "Pending" : "Healthy",
    checkTimer: n === "checking" ? "Checking" : n === "done" ? "Done" : "Pending"
  };
}
function Jb(e) {
  const t = ke(e.href)?.status, n = km(t?.history?.[0]?.bakeStatus ?? null), a = t?.releaseCandidates?.[0]?.tag ?? t?.releaseCandidates?.[0]?.version, r = t?.gates ?? [], s = r.filter((i) => i.allowedVersions != null && !!a && !i.allowedVersions.includes(a)).length;
  return { word: n.label.toUpperCase(), role: n.role, holding: s ? s === r.length ? `${s} gate${s === 1 ? "" : "s"} holding` : `${s} of ${r.length} gates holding` : null };
}
function e1(e, t) {
  if (!t) return null;
  for (const n of Ki()) if (n.metadata.name === e) {
    for (const a of n.status.availableReleases ?? []) if ([a.tag, a.version, a.revision, a.revision?.slice(0, 7)].includes(t) || a.revision?.startsWith(t)) return Fe(a.version ?? a.tag) ?? t;
  }
  return Fe(t);
}
const Bs = /* @__PURE__ */ new WeakMap();
function t1(e) {
  const t = vn(e);
  if (!t) return null;
  const n = wt(), a = n.environments, r = a.find((c) => c.metadata?.namespace === t.ns && c.spec?.rolloutRef?.name === t.name);
  if (!r) return null;
  const s = (Bs.get(n) ?? (Bs.set(n, vs(a)), Bs.get(n))).get(br(r)), i = Ni(s, r), o = s?.tiers.find((c) => c.tier === i?.tier);
  if (!s || !i || !o) return null;
  const l = i.isLeader ? null : Li(s, i)[0]?.site ?? null;
  return { site: i.site, wave: i.wave, leader: i.isLeader, follows: l, multi: o.waves.length > 1 };
}
function n1(e, t = "incident") {
  return mn(t, e).map((n) => {
    const a = fr(n.href) > 0, r = $i({ href: n.href }), s = ke(n.href)?.status.gates ?? [], i = ke(n.href)?.status.releaseCandidates?.[0]?.tag, o = !a && !!i && s.some((u) => u.allowedVersions != null && !u.allowedVersions.includes(i)), l = n.state === "failed" ? "failed" : a ? "approval" : o ? "rule" : r.length && n.state !== "healthy" ? "health" : null, c = a || o ? Yb({ state: a ? "awaiting-approval" : "held-by-rule", href: n.href, word: "", key: `${e}@${n.env}` }, t) : null;
    return { wave: t1(n.href), env: n.env, label: n.label, place: Ra({ tier: n.tier, regions: [n.label] }), tier: n.tier, state: n.state, href: n.href, deployedBuild: e1(e, n.version), holdReason: l, gate: c, heldBuilds: r, runs: n.version };
  });
}
function Ou(e, t = "incident") {
  const n = Math.max(1, e.regions.length), a = e.regions[0] ?? e.where, r = e.tier === "prod" && a !== "prod" ? `prod-${a}` : a === "prod" ? "production" : a, s = e.regions.slice(1), i = s.length > 0 && s.every((f) => {
    const p = mn(t, e.app).find((v) => v.label === f && v.tier === "prod");
    return !!p && fr(p.href) > 0;
  }), o = s.length ? i ? `${s.length} other regions wait on their own approvals` : `${s.length} other region${s.length === 1 ? "" : "s"} hold this build` : null, l = e.tier === "prod" ? Kb(e.app, t) : [], c = l.filter((f) => f.ink === "waiting").length, u = l.length > 1 && c ? c === l.length ? `${c} regions` : `${c} of ${l.length} regions` : null;
  return { sentence: `${Ct("approval", { yours: e.needsYou })} · ${u ?? r}`, acts: r, n: 1, of: n, others: o };
}
function Du(e, t = "incident") {
  const n = mn(t, e.app).filter((o) => o.tier === e.tier && fr(o.href) > 0 && (o.href === e.href || !e.regions.length || e.regions.includes(o.label))), a = n.length ? n : fr(e.href) > 0 ? mn(t, e.app).filter((o) => o.href === e.href) : [];
  if (!a.length) return null;
  const r = yr({ app: e.app, href: a[0].href }), s = a.map((o) => {
    const l = ke(o.href)?.status.releaseCandidates ?? [], c = l.find((u) => Fe(u.version ?? u.tag ?? "") === r?.build) ?? l[0];
    return { href: o.href, label: o.label, tag: c?.tag ?? c?.version ?? "" };
  }).filter((o) => o.tag);
  if (!s.length) return null;
  const i = Ra({ tier: e.tier, regions: s.map((o) => o.label) });
  return { key: `${e.app}|${e.tier}|${s.map((o) => o.href).sort().join(",")}`, app: e.app, build: r?.build ?? s[0].tag, where: i, count: s.length, places: s, href: e.href };
}
const fi = /* @__PURE__ */ new Map();
function a1(e) {
  const t = [];
  for (const n of e.places) {
    const a = vn(n.href) ? Ki().find((i) => i.metadata.namespace === vn(n.href).ns && i.metadata.name === vn(n.href).name) : null;
    if (!a) continue;
    t.push({ r: a, status: structuredClone(a.status) });
    const r = a.status, s = (r.releaseCandidates ?? []).map((i) => i.tag ?? i.version ?? "");
    for (const i of r.gates ?? []) /approval/.test(i.name) && i.allowedVersions != null && (i.allowedVersions = [.../* @__PURE__ */ new Set([...i.allowedVersions, ...s])]);
    r.releaseCandidates = (r.releaseCandidates ?? []).filter((i) => (i.tag ?? i.version) !== n.tag), r.history = [{ version: { tag: n.tag, version: n.tag, revision: n.tag }, timestamp: Qt.toISOString(), bakeStatus: "Deploying", bakeStartTime: Qt.toISOString(), triggeredBy: { kind: "User", name: Na() } }, ...r.history ?? []];
  }
  fi.set(e.key, t), wu(), bu();
}
function Fu(e) {
  for (const t of fi.get(e.key) ?? []) t.r.status = t.status;
  fi.delete(e.key), wu(), bu();
}
function r1(e, t, n) {
  const a = [], r = t === "prod" && n === "production" ? "prod" : n;
  for (const s of Ua(e).rows) {
    if (s.tier !== t || !(s.regions.includes(n) || s.regions.includes(r))) continue;
    const i = mn(e, s.app).find((o) => o.tier === t && (o.label === n || o.label === r));
    a.push(s.regions.length === 1 ? s : { ...s, key: `${s.app}@${n}`, regions: [n], where: n, place: n, href: i?.href ?? s.href, regionsOf: null });
  }
  return a;
}
function Iu(e, t) {
  const n = Ua(e), a = new Map(n.c.m.fleet.needsYou.map((s) => [`${s.app}@${s.env}`, s])), r = /* @__PURE__ */ new Map();
  for (const s of n.rows) {
    if (s.group !== "approval" && s.group !== "held") continue;
    const o = a.get(s.key)?.facts, l = s.state === "awaiting-approval" ? "Waiting for approval" : o?.reason === "dependency" ? o.provider ? `Waiting on ${o.provider}` : "Waiting on a dependency" : o?.reason === "check" ? o.checks?.length ? `Waiting on ${o.checks.map((u) => Pi(u)).join(", ")}` : "Waiting on a check" : o?.reason === "pinned" ? "Pinned" : o?.reason === "clock" ? "Waiting for the deploy window" : s.word.startsWith("Waits on") ? s.word.replace("Waits on", "Waiting on") : "Held by a rule", c = r.get(l) ?? { key: l, cause: l, places: [], rows: [] };
    c.places.push(`${s.app} · ${s.place}`), c.rows.push(s), r.set(l, c);
  }
  return [...r.values()].sort((s, i) => i.rows.length - s.rows.length || s.cause.localeCompare(i.cause));
}
function s1(e) {
  const t = ke(e.href)?.status.history?.[0];
  if (!t?.bakeStartTime || !t.bakeEndTime) return null;
  const n = Math.max(0, Math.round((Date.parse(t.bakeEndTime) - Date.parse(t.bakeStartTime)) / 1e3));
  return `${Math.floor(n / 60)}m ${n % 60}s`;
}
const i1 = { dev: "dev", test: "test", staging: "staging", prod: "production" }, Pu = (e) => lr(null, i1[e] ?? e), o1 = (e) => e.kind === "approve" ? "Approve" : e.kind === "rollback" ? "Roll back" : e.label;
function il(e) {
  return e.kind === "approve" ? /\/gates$/.test(e.href) ? e.href : e.href.replace(/\/$/, "") + "/gates" : e.kind !== "rollback" || e.href.includes("action=") ? e.href : `${e.href}${e.href.includes("?") ? "&" : "?"}action=rollback`;
}
const l1 = (e) => Bb(e);
function c1(e, t) {
  if (e.group !== "held") return null;
  const n = Iu(t).find((a) => a.rows.some((r) => r.key === e.key));
  return !n || n.cause === "Held by a rule" ? null : n.cause.replace(/^Waiting/, "Waits");
}
const ju = "danielreed";
function u1(e, t) {
  return e.group === "failed" ? "Deployment failed" : t && c1(e, t) || e.word;
}
function d1(e, t) {
  return e.group !== "approval" ? null : Ou(e, t).sentence.replace(/^Needs your approval/, "Your approval");
}
function Wu(e, t) {
  return e.state === "fail" ? "failed" : e.state === "hold" ? "held" : e.state === "done" ? "done" : e.state === "todo" ? "todo" : e.name === "Check" && t !== "deploying" ? "checking" : "deploying";
}
const f1 = { xs: { d: 10, pitch: 22, line: 1 }, sm: { d: 24, pitch: 56, line: 2 } };
function Zi(e, t, n = !1) {
  return e.map((a) => ({
    state: a.state === "done" ? "done" : a.state === "fail" ? "failed" : a.state === "hold" ? "held" : a.state === "todo" ? "pending" : Wu(a, t) === "checking" ? "checking" : "current",
    label: n ? a.name : void 0,
    step: a.name,
    stepState: a.state
  }));
}
var p1 = /* @__PURE__ */ W('<span aria-hidden="true"></span>'), v1 = /* @__PURE__ */ W('<li class="mp-slot svelte-12vk4m5" data-fold="" data-node="fold"><span class="mp-fold t-meta tabular-nums svelte-12vk4m5" aria-hidden="true"> </span></li>'), h1 = /* @__PURE__ */ W('<span aria-hidden="true"></span>'), m1 = /* @__PURE__ */ W("<span></span>"), g1 = /* @__PURE__ */ ue('<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M9 5.5v13M15 5.5v13"></path></svg>'), b1 = /* @__PURE__ */ W('<span class="h-1.5 w-1.5 rounded-full bg-success-solid"></span>'), w1 = /* @__PURE__ */ W("<span> </span>"), k1 = /* @__PURE__ */ W('<span aria-hidden="true"><!></span> <!>', 1), _1 = /* @__PURE__ */ W('<li class="mp-slot svelte-12vk4m5"><!></li>'), y1 = /* @__PURE__ */ W("<!> <!>", 1), x1 = /* @__PURE__ */ W('<ol data-strand=""></ol>');
function Bu(e, t) {
  Se(t, !0);
  let n = q(t, "size", 3, "xs"), a = q(t, "lit", 3, !0), r = q(t, "dim", 3, !1), s = q(t, "neutral", 3, !1), i = q(t, "max", 3, void 0), o = q(t, "decorative", 3, !1), l = q(t, "label", 3, void 0), c = q(t, "kind", 3, "strand"), u = q(t, "class", 3, "");
  const f = /* @__PURE__ */ V(() => f1[n()]), p = /* @__PURE__ */ V(() => Math.max(3, i() ?? (n() === "sm" ? 5 : 6))), v = /* @__PURE__ */ new Set(["current", "checking", "held", "approval", "failed"]), y = /* @__PURE__ */ V(() => {
    const k = t.nodes.map((j) => ({ fold: !1, n: j }));
    if (t.nodes.length <= d(p)) return k;
    const T = t.nodes.length - d(
      p
      // the fold node takes one slot itself
    ) + 1, F = (j) => j > 0 && j < t.nodes.length - 1 && !v.has(t.nodes[j].state);
    let B = null;
    for (let j = 1; j < t.nodes.length - 1; ) {
      if (!F(j)) {
        j++;
        continue;
      }
      let O = j;
      for (; O < t.nodes.length - 1 && F(O); ) O++;
      if (O - j >= T) {
        B = [j, j + T];
        break;
      }
      (!B || O - j > B[1] - B[0]) && (B = [j, O]), j = O;
    }
    return !B || B[1] - B[0] < 2 ? k : [
      ...k.slice(0, B[0]),
      { fold: !0, hidden: t.nodes.slice(B[0], B[1]) },
      ...k.slice(B[1])
    ];
  }), b = /* @__PURE__ */ V(() => d(y).reduce(
    (k, T, F) => (T.fold ? T.hidden.some((B) => B.state !== "pending") : T.n.state !== "pending") ? F : k,
    -1
  )), g = /* @__PURE__ */ V(() => n() === "sm" && t.nodes.some((k) => k.label)), m = /* @__PURE__ */ V(() => d(g) ? (d(f).pitch - 4 - d(f).d) / 2 : 0), x = /* @__PURE__ */ V(() => (d(y).length - 1) * d(f).pitch + d(f).d + 2 * d(m)), h = {
    done: "done",
    current: "running",
    pending: "not started",
    failed: "failed",
    held: "waiting",
    approval: "waiting for approval",
    checking: "checking",
    rest: "healthy"
  }, C = /* @__PURE__ */ V(() => l() ?? "Steps: " + t.nodes.map((k) => `${k.label ?? k.step ?? ""} ${h[k.state]}`.trim()).join(", ")), _ = (k) => k === "done" ? "mp-done" : k === "failed" ? "st-fail" : k === "held" ? "st-hold" : k === "approval" ? "mp-ask" : k === "checking" ? "st-check" : k === "current" ? "st-active " + (a() ? "st-live" : "") : k === "rest" ? "mp-rest" : "mp-ring mp-ring-off", A = (k) => k === "done" ? "bg-success-tint text-success" : k === "failed" ? "bg-danger-tint text-danger" : k === "checking" ? "bg-progress-tint text-progress" : k === "current" ? "bg-active-tint text-active" : k === "held" ? "bg-held-tint text-held" : k === "approval" ? "mp-ask text-fg" : k === "rest" ? "bg-subtle" : "bg-subtle text-fg-disabled", E = (k) => k === "checking" ? "border-progress-solid/40 border-t-progress-solid" : "border-active-solid/40 border-t-active-solid", S = (k) => k.title ?? `${k.label ?? k.step ?? ""}${k.label || k.step ? " · " : ""}${h[k.state]}`;
  var w = x1();
  let L;
  Tt(w, 21, () => d(y), Ci, (k, T, F) => {
    var B = y1(), j = ne(B);
    {
      var O = (re) => {
        var K = p1();
        let J, Z;
        P(() => {
          J = ie(K, 1, "mp-seg svelte-12vk4m5", null, J, { "mp-solid": F <= d(b) }), Z = ot(K, "", Z, {
            left: `${(F - 1) * d(f).pitch + d(f).d + d(m)}px`
          });
        }), M(re, K);
      };
      D(j, (re) => {
        F > 0 && re(O);
      });
    }
    var z = I(j, 2);
    {
      var te = (re) => {
        var K = v1();
        let J;
        var Z = N(K), R = N(Z);
        P(
          (U) => {
            $(K, "title", `${d(T).hidden.length ?? ""} more: ${U ?? ""}`), J = ot(K, "", J, { left: `${F * d(f).pitch + d(m)}px` }), Y(R, `+${d(T).hidden.length ?? ""}`);
          },
          [
            () => d(T).hidden.map((U) => U.label ?? U.step ?? h[U.state]).join(", ")
          ]
        ), M(re, K);
      }, ae = (re) => {
        const K = /* @__PURE__ */ V(() => d(T).n);
        var J = _1();
        let Z;
        var R = N(J);
        {
          var U = (X) => {
            var G = h1();
            P((se) => ie(G, 1, `st-node mp-dot ${se ?? ""}`, "svelte-12vk4m5"), [() => _(d(K).state)]), M(X, G);
          }, ee = (X) => {
            var G = k1(), se = ne(G), de = N(se);
            {
              var ce = (ve) => {
                fs(ve, { class: "h-4 w-4" });
              }, Q = (ve) => {
                var Ne = le(), Ve = ne(Ne);
                {
                  var _e = (ze) => {
                    Ba(ze, { class: "h-4 w-4" });
                  }, Xe = (ze) => {
                    var Oe = le(), Qe = ne(Oe);
                    {
                      var H = (pe) => {
                        var Ze = m1();
                        P((en) => ie(Ze, 1, `h-4 w-4 animate-spin rounded-full border-2 ${en ?? ""}`, "svelte-12vk4m5"), [() => E(d(K).state)]), M(pe, Ze);
                      }, oe = (pe) => {
                        var Ze = le(), en = ne(Ze);
                        {
                          var Dn = (Je) => {
                            var je = g1();
                            M(Je, je);
                          }, bn = (Je) => {
                            var je = le(), Pt = ne(je);
                            {
                              var Et = (We) => {
                                yc(We, { class: "h-3.5 w-3.5" });
                              }, tn = (We) => {
                                var ea = le(), xr = ne(ea);
                                {
                                  var Sr = (wn) => {
                                    var ys = b1();
                                    M(wn, ys);
                                  }, _s = (wn) => {
                                    _c(wn, { class: "h-4 w-4" });
                                  };
                                  D(
                                    xr,
                                    (wn) => {
                                      d(K).state === "rest" ? wn(Sr) : wn(_s, !1);
                                    },
                                    !0
                                  );
                                }
                                M(We, ea);
                              };
                              D(
                                Pt,
                                (We) => {
                                  d(K).state === "approval" ? We(Et) : We(tn, !1);
                                },
                                !0
                              );
                            }
                            M(Je, je);
                          };
                          D(
                            en,
                            (Je) => {
                              d(K).state === "held" ? Je(Dn) : Je(bn, !1);
                            },
                            !0
                          );
                        }
                        M(pe, Ze);
                      };
                      D(
                        Qe,
                        (pe) => {
                          d(K).state === "current" || d(K).state === "checking" ? pe(H) : pe(oe, !1);
                        },
                        !0
                      );
                    }
                    M(ze, Oe);
                  };
                  D(
                    Ve,
                    (ze) => {
                      d(K).state === "failed" ? ze(_e) : ze(Xe, !1);
                    },
                    !0
                  );
                }
                M(ve, Ne);
              };
              D(de, (ve) => {
                d(K).state === "done" ? ve(ce) : ve(Q, !1);
              });
            }
            var fe = I(se, 2);
            {
              var me = (ve) => {
                var Ne = w1(), Ve = N(Ne);
                P(
                  (_e) => {
                    ie(Ne, 1, `mp-name ${_e ?? ""} ${d(K).state === "failed" && a() ? "text-danger" : ""}`, "svelte-12vk4m5"), $(Ne, "title", d(K).label), Y(Ve, d(K).label);
                  },
                  [
                    () => a() && v.has(d(K).state) ? "t-ui-sm text-fg" : "t-meta text-fg-subtle"
                  ]
                ), M(ve, Ne);
              };
              D(fe, (ve) => {
                d(K).label && ve(me);
              });
            }
            P((ve) => ie(se, 1, `mp-disc ${ve ?? ""}`, "svelte-12vk4m5"), [() => A(d(K).state)]), M(X, G);
          };
          D(R, (X) => {
            n() === "xs" ? X(U) : X(ee, !1);
          });
        }
        P(
          (X) => {
            $(J, "data-node", d(K).state), $(J, "data-step", o() ? void 0 : d(K).step ?? d(K).label), $(J, "data-state", o() ? void 0 : d(K).stepState ?? d(K).state), $(J, "title", X), Z = ot(J, "", Z, { left: `${F * d(f).pitch + d(m)}px` });
          },
          [
            () => o() ? void 0 : n() === "xs" ? S(d(K)) : d(K).title
          ]
        ), M(re, J);
      };
      D(z, (re) => {
        d(T).fold ? re(te) : re(ae, !1);
      });
    }
    M(k, B);
  }), P(() => {
    ie(w, 1, `mp mp-${n() ?? ""} ${r() ? "mp-dim" : ""} ${s() ? "mp-nu" : ""} ${u() ?? ""}`, "svelte-12vk4m5"), $(w, "role", o() ? void 0 : "img"), $(w, "aria-label", o() ? void 0 : d(C)), $(w, "aria-hidden", o() ? "true" : void 0), $(w, "data-pipeline", c()), $(w, "data-size", n()), $(w, "data-pitch", d(f).pitch), $(w, "data-d", d(f).d), $(w, "data-n", d(y).length), $(w, "data-lead", d(m)), L = ot(w, "", L, {
      width: `${d(x) ?? ""}px`,
      height: `${(d(g) ? d(f).d + 28 : d(f).d) ?? ""}px`,
      "--d": `${d(f).d ?? ""}px`,
      "--pitch": `${d(f).pitch ?? ""}px`,
      "--line": `${d(f).line ?? ""}px`,
      "--lead": `${d(m) ?? ""}px`
    });
  }), M(e, w), Ce();
}
const S1 = () => wt().rollouts, C1 = (e) => {
  const t = /^(\d+)(s|m|h)$/.exec(e ?? "");
  return t ? +t[1] * { s: 1e3, m: 6e4, h: 36e5 }[t[2]] : 0;
}, ol = (e) => {
  const t = e.split("/").filter(Boolean);
  return t[0] === "rollouts" && t.length >= 4 ? `${t[2]}/${t[3]}` : e;
};
function A1(e = "incident") {
  const t = /* @__PURE__ */ new Map(), n = Ua(e).rows;
  for (const a of S1()) {
    const r = a.status?.history?.[0], s = C1(a.spec?.bakeTime);
    if (!r?.bakeStartTime || !s || r.bakeStatus !== "InProgress") continue;
    const i = `${a.metadata.namespace}/${a.metadata.name}`, o = n.find((c) => ol(c.href) === i), l = (Qt.getTime() - Date.parse(r.bakeStartTime)) / s;
    l >= 1 || t.set(i, { fraction: Math.max(0.04, l), words: o ? ua({ ...o, state: "checking" }) : null });
  }
  for (const a of n) {
    const r = ol(a.href);
    if (a.state === "deploying" && a.steps.length > 1 && !t.has(r)) {
      const s = a.steps.filter((i) => i.state === "done").length;
      t.set(r, { fraction: Math.max(0.04, s / a.steps.length), words: null });
    }
  }
  return t;
}
const T1 = /* @__PURE__ */ V(() => A1("incident")), M1 = () => d(T1), E1 = Symbol.for("kuberik-r42-atoms"), zu = () => gt(E1) ?? { regions: !0, lead: !0, get progress() {
  return M1();
} };
var L1 = /* @__PURE__ */ ue('<line y1="4" y2="4" class="lb-wait svelte-hnsc61"><title> </title></line>'), N1 = /* @__PURE__ */ ue('<rect y="1" height="6" rx="1.5"><title> </title></rect>'), R1 = /* @__PURE__ */ ue('<line y1="4" y2="4" class="lb-rest svelte-hnsc61"></line>'), O1 = /* @__PURE__ */ ue('<svg height="8" role="img" data-lead-bar=""><!><!><!></svg>');
function D1(e, t) {
  Se(t, !0);
  let n = q(t, "origin", 3, void 0), a = q(t, "width", 3, 160), r = q(t, "class", 3, "");
  const s = /* @__PURE__ */ V(() => n() ?? t.hops[0]?.start ?? 0), i = (g) => Math.max(0, Math.min(a(), (g - d(s)) / Math.max(1, t.scaleMs) * a())), o = (g) => {
    const m = Math.round(g / 6e4);
    return m < 60 ? `${Math.max(1, m)}m` : `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ""}`;
  }, l = /* @__PURE__ */ V(() => t.hops.map((g, m) => {
    const x = i(g.start), h = Math.max(i(g.end), x + 3);
    return {
      ...g,
      a: x,
      w: h - x,
      last: m === t.hops.length - 1,
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
    ...t.hops.slice(1).map((g, m) => ({
      a: d(l)[m].a + d(l)[m].w,
      b: d(l)[m + 1].a,
      title: `waited ${o(g.start - t.hops[m].end)} before ${g.tier}`
    }))
  ].filter((g) => g.b - g.a > 1)), u = /* @__PURE__ */ V(() => d(l).length ? d(l)[d(l).length - 1].a + d(l)[d(l).length - 1].w : 0);
  var f = O1(), p = N(f);
  Tt(p, 17, () => d(c), Ci, (g, m) => {
    var x = L1(), h = N(x), C = N(h);
    P(() => {
      $(x, "x1", d(m).a), $(x, "x2", d(m).b), Y(C, d(m).title);
    }), M(g, x);
  });
  var v = I(p);
  Tt(v, 17, () => d(l), (g) => g.tier + g.start, (g, m) => {
    var x = N1();
    let h;
    var C = N(x), _ = N(C);
    P(() => {
      $(x, "x", d(m).a), $(x, "width", d(m).w), h = ie(x, 0, "lb-run svelte-hnsc61", null, h, { last: d(m).last }), Y(_, d(m).title);
    }), M(g, x);
  });
  var y = I(v);
  {
    var b = (g) => {
      var m = R1();
      P(() => {
        $(m, "x1", d(u)), $(m, "x2", a());
      }), M(g, m);
    };
    D(y, (g) => {
      d(u) < a() && g(b);
    });
  }
  P(
    (g) => {
      ie(f, 0, `lb ${r() ?? ""}`, "svelte-hnsc61"), $(f, "width", a()), $(f, "viewBox", `0 0 ${a() ?? ""} 8`), $(f, "aria-label", `reached prod in ${g ?? ""}`);
    },
    [
      () => o((t.hops.at(-1)?.end ?? d(s)) - d(s))
    ]
  ), M(e, f), Ce();
}
var F1 = /* @__PURE__ */ W('<span class="lr-pl t-meta svelte-9kjh2y"> </span>'), I1 = /* @__PURE__ */ W(' <span class="lr-left t-meta tabular-nums svelte-9kjh2y"> </span> ', 1), P1 = /* @__PURE__ */ W('<span class="lr-ld svelte-9kjh2y" data-state-word=""> </span><!> ', 1), j1 = /* @__PURE__ */ W('<span class="lr-code first t-code-sm svelte-9kjh2y"> </span>'), W1 = /* @__PURE__ */ W('<span class="lr-code t-code-sm svelte-9kjh2y"> </span>'), B1 = /* @__PURE__ */ W("<!> <!>", 1), z1 = /* @__PURE__ */ W('<!><span class="lr-lead-t tabular-nums svelte-9kjh2y"> <span class="lr-tp svelte-9kjh2y">to prod</span></span>', 1), H1 = /* @__PURE__ */ W('<span class="lr-ldw t-meta svelte-9kjh2y"><!></span>'), V1 = /* @__PURE__ */ W('<li><div class="lr-in svelte-9kjh2y"><span class="lr-mk svelte-9kjh2y"><!></span> <div class="lr-id svelte-9kjh2y"><a> </a> <!></div> <span class="lr-dr svelte-9kjh2y"><!></span> <p class="lr-sn svelte-9kjh2y"><!></p> <!> <span class="lr-age t-meta svelte-9kjh2y"> </span></div></li>');
function ll(e, t) {
  Se(t, !0);
  let n = q(
    t,
    "row",
    3,
    null
    /** the quiet flow (Changes' At rest): no mark / drawing tracks, the age auto-wide */
  ), a = q(t, "rest", 3, null), r = q(t, "dense", 3, !1);
  const s = /* @__PURE__ */ V(() => n()?.href ?? a()?.href ?? "#"), i = zu(), o = /* @__PURE__ */ V(() => n() && n().mark === "checking" && i.progress ? i.progress.get(d(s).split("/").filter(Boolean).slice(2, 4).join("/")) ?? null : null), l = /* @__PURE__ */ V(() => n()?.app ?? a()?.app ?? ""), c = /* @__PURE__ */ V(() => n() ? n().place ? /^\d+ regions?$/.test(n().place) ? n().place.replace(/ (regions?)$/, ` ${n().tier} $1`) : `${n().tier}-${n().place}` : n().tier : "");
  var u = V1();
  $e(
    u,
    (z) => ({
      class: "lr tap-zone",
      "data-key": n()?.key ?? a()?.key,
      ...z,
      [Cn]: {
        q: !!a(),
        dn: r(),
        hl: !!a() && a().lead !== void 0
      }
    }),
    [
      () => r() ? {} : {
        "data-truth-kind": n() ? "rollout" : "rest",
        "data-truth-app": d(l),
        "data-truth-href": d(s),
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
    var y = (z) => {
      {
        let te = /* @__PURE__ */ V(() => d(o)?.fraction ?? null);
        ga(z, {
          get state() {
            return n().mark;
          },
          get progress() {
            return d(te);
          }
        });
      }
    };
    D(v, (z) => {
      n() && z(y);
    });
  }
  var b = I(p, 2), g = N(b);
  let m;
  var x = N(g), h = I(g, 2);
  {
    var C = (z) => {
      {
        let te = /* @__PURE__ */ V(() => Pu(n().tier));
        Ri(z, {
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
    }, _ = (z) => {
      var te = le(), ae = ne(te);
      {
        var re = (K) => {
          var J = F1(), Z = N(J);
          P(() => Y(Z, a().place)), M(K, J);
        };
        D(
          ae,
          (K) => {
            a()?.place && K(re);
          },
          !0
        );
      }
      M(z, te);
    };
    D(h, (z) => {
      n() ? z(C) : z(_, !1);
    });
  }
  var A = I(b, 2), E = N(A);
  {
    var S = (z) => {
      Bu(z, {
        get nodes() {
          return n().nodes;
        },
        neutral: !0,
        get label() {
          return `${d(l) ?? ""} steps`;
        }
      });
    };
    D(E, (z) => {
      n() && z(S);
    });
  }
  var w = I(A, 2), L = N(w);
  {
    var k = (z) => {
      var te = P1(), ae = ne(te), re = N(ae), K = I(ae);
      {
        var J = (R) => {
          var U = I1(), ee = ne(U, !0);
          ee.nodeValue = " ";
          var X = I(ee), G = N(X), se = I(X, 1, !0);
          se.nodeValue = " ", P(() => Y(G, d(o).words)), M(R, U);
        };
        D(K, (R) => {
          d(o)?.words && !n().row.stillChecking && R(J);
        });
      }
      var Z = I(K, 1, !0);
      P(() => {
        Y(re, n().lead), Y(Z, n().rest);
      }), M(z, te);
    }, T = (z) => {
      var te = le(), ae = ne(te);
      {
        var re = (K) => {
          var J = B1(), Z = ne(J);
          {
            var R = (G) => {
              var se = j1(), de = N(se);
              P(() => Y(de, a().code)), M(G, se);
            };
            D(Z, (G) => {
              a().codeFirst && a().code && G(R);
            });
          }
          var U = I(Z, 1, !0), ee = I(U);
          {
            var X = (G) => {
              var se = W1(), de = N(se);
              P(() => Y(de, a().code)), M(G, se);
            };
            D(ee, (G) => {
              !a().codeFirst && a().code && G(X);
            });
          }
          P(() => Y(U, a().sentence)), M(K, J);
        };
        D(
          ae,
          (K) => {
            a() && K(re);
          },
          !0
        );
      }
      M(z, te);
    };
    D(L, (z) => {
      n() ? z(k) : z(T, !1);
    });
  }
  var F = I(w, 2);
  {
    var B = (z) => {
      var te = H1(), ae = N(te);
      {
        var re = (K) => {
          var J = z1(), Z = ne(J);
          D1(Z, {
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
          var R = I(Z), U = N(R);
          P(() => Y(U, a().lead.total)), M(K, J);
        };
        D(ae, (K) => {
          a().lead && K(re);
        });
      }
      P(() => $(te, "title", a().lead ? `${a().lead.total} to prod` : void 0)), M(z, te);
    };
    D(F, (z) => {
      a() && a().lead !== void 0 && z(B);
    });
  }
  var j = I(F, 2), O = N(j);
  P(() => {
    $(g, "href", d(s)), m = ie(g, 1, "tap-link lr-nm svelte-9kjh2y", null, m, { rep: a()?.rep }), $(g, "aria-label", n() ? `${d(l)} in ${n().place ?? n().tier}` : `${d(l)} ${a()?.place}`), Y(x, d(l)), Y(O, n()?.age ?? a()?.age ?? "");
  }), M(e, u), Ce();
}
var U1 = /* @__PURE__ */ W('<section class="lc-g" data-group="In flight"><div class="lc-gh"><span class="lc-gt">In flight</span><span class="lc-gn"> </span></div> <ul class="lc-rows"></ul></section> <section class="lc-g" data-group="At rest"><div class="lc-gh"><span class="lc-gt">At rest</span><span class="lc-gn"> </span></div> <ul class="lc-rows"></ul></section>', 1);
function q1(e, t) {
  Se(t, !0), ip(e, {
    children: (n, a) => {
      var r = U1(), s = ne(r), i = N(s), o = I(N(i)), l = N(o), c = I(i, 2);
      Tt(c, 21, () => t.moving, (b) => b.key, (b, g) => {
        ll(b, {
          get row() {
            return d(g);
          }
        });
      });
      var u = I(s, 2), f = N(u), p = I(N(f)), v = N(p), y = I(f, 2);
      Tt(y, 21, () => t.rest, (b) => b.key, (b, g) => {
        ll(b, {
          get rest() {
            return d(g);
          }
        });
      }), P(() => {
        Y(l, t.moving.length), Y(v, t.rest.length);
      }), M(n, r);
    },
    $$slots: { default: !0 }
  }), Ce();
}
const an = (e, t, n, a) => [
  { name: "Started", state: e },
  { name: "Stage 1", state: t },
  { name: "Stage 2", state: n },
  { name: "Check", state: a }
], cl = { tier: "dev", place: null, href: "/rollouts/hub/payments/payments-api-dev" }, ul = { tier: "staging", place: null, href: "/rollouts/hub/payments/payments-api-staging" }, Dr = { tier: "prod", place: "eu-west", href: "/rollouts/hub/payments/payments-api-prod-eu-west" };
function xn(e, t, n, a, r, s) {
  return {
    key: "payments-api",
    app: "payments-api",
    href: e.href,
    tier: e.tier,
    place: e.place,
    mark: n,
    nodes: Zi(t, n === "deploying" ? "deploying" : "checking"),
    lead: a,
    rest: r,
    age: s,
    yours: !1,
    row: { group: n === "failed" ? "failed" : "moving" }
  };
}
const Hu = {
  key: "checkout-web",
  app: "checkout-web",
  href: "/rollouts/hub/shop/checkout-web-test",
  tier: "test",
  place: null,
  mark: "deploying",
  nodes: Zi(an("done", "done", "active", "todo"), "deploying"),
  lead: "Deploying",
  rest: "v3.8.2 · step 3 of 4",
  age: "3m",
  yours: !1,
  row: { group: "moving" }
}, Wr = (e, t, n, a, r = !1) => ({ key: e + t, app: e, href: "#", place: t, rep: r, sentence: "On the newest", code: n, age: a, tier: t }), Vu = [Wr("billing-worker", "prod · eu-west", "v1.19.0", "2d"), Wr("billing-worker", "prod · us-east", "v1.19.0", "2d", !0), Wr("search-api", "prod", "v7.4.1", "5d")], la = "v2.14.0", Sn = (e, t = []) => ({ moving: [e, Hu], rest: [...t, ...Vu] }), Uu = [
  { at: 0, state: Sn(xn(cl, an("active", "todo", "todo", "todo"), "deploying", "Deploying", `${la} · dev`, "12s")) },
  { at: 1400, state: Sn(xn(cl, an("done", "done", "done", "active"), "checking", "Checking", `${la} · 1 min left`, "1m")) },
  { at: 3e3, state: Sn(xn(ul, an("active", "todo", "todo", "todo"), "deploying", "Deploying", `${la} · staging`, "4m")) },
  { at: 4400, state: Sn(xn(ul, an("done", "done", "done", "active"), "checking", "Checking", `${la} · 2 min left`, "9m")) },
  { at: 6e3, state: Sn(xn(Dr, an("done", "active", "todo", "todo"), "deploying", "Deploying", `${la} · step 2 of 4`, "14m")) },
  { at: 7600, state: Sn(xn(Dr, an("done", "done", "fail", "todo"), "failed", "Failing", `${la} · latency over limit`, "2m")) },
  { at: 9400, state: Sn(xn(Dr, an("done", "done", "active", "todo"), "deploying", "Deploying", "v2.14.1 · fix, step 3 of 4", "40s")) },
  { at: 11e3, state: Sn(xn(Dr, an("done", "done", "done", "active"), "checking", "Checking", "v2.14.1 · 1 min left", "3m")) },
  { at: 12600, state: { moving: [Hu], rest: [{ ...Wr("payments-api", "prod · eu-west", "v2.14.1", "now"), key: "payments-api-rest" }, ...Vu] } }
], G1 = Uu[0].state, K1 = 5;
function Y1(e) {
  const t = e.split("?")[0].split("/").filter(Boolean);
  return t[0] === "rollouts" && t.length >= 4 ? { cluster: t[1], namespace: t[2], name: t[3] } : null;
}
async function qu(e, t, n = !1, a = fetch) {
  const r = Y1(e);
  if (!r) throw new Error(`not a rollout: ${e}`);
  const s = await a(bh(r.cluster, `/rollouts/${r.namespace}/${r.name}/approve`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(n ? { version: t, revoke: !0 } : { version: t })
  });
  if (!s.ok) throw new Error((await s.json().catch(() => null))?.error ?? `${n ? "Undo" : "Approve"} failed (${s.status})`);
}
const $1 = 8e3, He = jt({ ask: null, done: null });
let Br = null, Gu = Promise.resolve();
const Xi = () => {
  Br && clearTimeout(Br), Br = null;
}, dl = (e) => `Approve ${e.build} ${e.count > 1 ? "for" : "in"} ${e.where}?`, Q1 = (e) => ({
  title: `Approved ${e.build}`,
  detail: `${e.app} is deploying to ${e.where}`
});
function Z1(e, t) {
  if (!e) return;
  const a = (t?.currentTarget ?? null)?.getBoundingClientRect?.();
  He.ask = {
    target: e,
    anchor: a ? { top: a.top, left: a.left, right: a.right, bottom: a.bottom } : null
  };
}
const zs = () => {
  He.ask = null;
};
function X1(e) {
  const t = He.ask;
  if (!t) return;
  const n = t.target;
  He.ask = null, Xi(), a1(n), He.done = { target: n, error: null }, Gu = Promise.all(n.places.map((a) => qu(a.href, a.tag, !1, e))).catch((a) => {
    Fu(n), He.done = { target: n, error: a.message || "Approval failed" };
  }), Br = setTimeout(pi, $1);
}
function J1(e) {
  const t = He.done;
  if (!t || t.error) return;
  const n = t.target;
  Xi(), Fu(n), He.done = null, Gu.then(() => Promise.all(n.places.map((a) => qu(a.href, a.tag, !0, e)))).catch(() => {
  });
}
function pi() {
  Xi(), He.done = null;
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
function Ku(e) {
  return jt(e);
}
const vi = [203, 345, 308, 130, 245, 175, 110, 280];
function Yu(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n++)
    t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
  return t >>> 0;
}
function ks(e) {
  const t = e.split(/[\s._/-]+/).map((n) => n.replace(/[^\p{L}\p{N}]/gu, "")).filter(Boolean);
  return t.length === 0 ? "?" : t.length === 1 ? t[0].slice(0, 2).toUpperCase() : (t[0][0] + t[1][0]).toUpperCase();
}
const tw = (e) => e.split(/[\s._/-]+/).map((t) => t.replace(/[^\p{L}\p{N}]/gu, "")).filter(Boolean);
function nw(e) {
  const t = [...new Set(e)].sort(), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  for (const s of t) {
    const i = ks(s);
    n.set(s, i), (a.get(i) ?? a.set(i, []).get(i)).push(s);
  }
  const r = new Set([...a.keys()].filter((s) => a.get(s).length === 1));
  for (const [, s] of [...a].sort(([i], [o]) => i < o ? -1 : 1)) {
    if (s.length < 2) continue;
    const i = s.map(tw);
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
      if (f.every((p) => p && !r.has(p)) && new Set(f).size === f.length) {
        s.forEach((p, v) => {
          n.set(p, f[v]), r.add(f[v]);
        });
        break;
      }
    }
  }
  return n;
}
function aw(e) {
  return { monogram: ks(e), hue: vi[Yu(e) % vi.length] };
}
function rw(e) {
  return Yu(e) % vi.length;
}
let sw = /* @__PURE__ */ Ee([]), iw = /* @__PURE__ */ Ee(!1);
function ow(e) {
  const t = hn();
  if (d(iw) && !t) return null;
  const n = new Set(d(sw));
  for (const a of t?.rollouts ?? []) a.metadata?.name && n.add(a.metadata.name);
  return n.add(e), nw([...n]).get(e) ?? ks(e);
}
var lw = /* @__PURE__ */ W('<span aria-hidden="true"> </span>');
function cw(e, t) {
  Se(t, !0);
  let n = q(t, "size", 3, 20), a = q(t, "class", 3, "");
  const r = /* @__PURE__ */ V(() => aw(t.name)), s = /* @__PURE__ */ V(() => ow(t.name)), i = /* @__PURE__ */ V(() => rw(t.name)), o = { 16: 9, 20: 10, 24: 12, 32: 12 }, l = { 16: "-0.04em", 20: "-0.04em", 24: "0", 32: "0" }, c = { 16: 4, 20: 6, 24: 6, 32: 8 };
  var u = lw(), f = N(u);
  P(() => {
    ie(u, 1, `app-glyph id${d(i) ?? ""} inline-flex shrink-0 items-center justify-center select-none ${a() ?? ""}`, "svelte-1mesrou"), ot(u, `width: ${n() ?? ""}px; height: ${n() ?? ""}px; border-radius: ${c[n()] ?? ""}px; font-size: ${o[n()] ?? ""}px; letter-spacing: ${l[n()] ?? ""}`), $(u, "data-app-hue", d(r).hue), $(u, "data-pending", d(s) === null ? "" : void 0), Y(f, d(s) ?? "");
  }), M(e, u), Ce();
}
const uw = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20style='isolation:isolate'%20viewBox='0%200%20800%20980'%20width='800pt'%20height='980pt'%3e%3cdefs%3e%3clinearGradient%20id='lgradhat'%20x1='95%25'%20y1='0%25'%20x2='5%25'%20y2='100%25'%20%3e%3cstop%20offset='30%25'%20style='stop-color:rgb(0,%20201,%20181);stop-opacity:1'%20/%3e%3cstop%20offset='100%25'%20style='stop-color:rgb(0,%20178,%20194);stop-opacity:1'%20/%3e%3c/linearGradient%3e%3clinearGradient%20id='lgradface'%20x1='95%25'%20y1='0%25'%20x2='5%25'%20y2='100%25'%20%3e%3cstop%20offset='0%25'%20style='stop-color:rgb(0,%20201,%20181);stop-opacity:1'%20/%3e%3cstop%20offset='100%25'%20style='stop-color:rgb(0,%20178,%20194);stop-opacity:1'%20/%3e%3c!--%20%3cstop%20offset='100%25'%20style='stop-color:rgb(69,140,153);stop-opacity:1'%20/%3e%20--%3e%3c/linearGradient%3e%3cclipPath%20id='_clipPath_mFFOFRoZDPwZeoLGBAaPqqdgYpIvRWDO'%3e%3crect%20width='800'%20height='980'/%3e%3c/clipPath%3e%3c/defs%3e%3cg%20clip-path='url(%23_clipPath_mFFOFRoZDPwZeoLGBAaPqqdgYpIvRW80)'%3e%3cg%20style='isolation:isolate'%3e%3cpath%20d='%20M%20132.662%20368.503%20Q%2050.228%20344.358%2029.785%20358.215%20C%209.341%20372.072%209.296%20386.23%2012.638%20399.366%20C%2015.981%20412.502%2094.029%20498.64%20396.713%20495.385%20C%20699.398%20492.13%20785.47%20418.128%20787.646%20399.366%20C%20789.822%20380.604%20781.975%20367.728%20763.642%20358.215%20Q%20745.308%20348.702%20664.194%20368.503%20L%20664.194%20169.607%20Q%20641.217%2014.789%20396.713%2015.291%20Q%20152.21%2015.794%20132.662%20169.607%20L%20132.662%20368.503%20Z%20'%20fill='url(%23lgradhat)'/%3e%3cpath%20d='%20M%20677.911%20738.861%20C%20676.561%20798.182%20610.792%20968.417%20396.713%20965.19%20C%20182.634%20961.964%20122.726%20804.633%20122.374%20738.861%20Q%20122.022%20673.088%20122.395%20487.914%20C%20181.19%20506.207%20268.935%20520.763%20396.713%20519.389%20C%20527.329%20517.985%20617.608%20503.406%20677.924%20485.749%20Q%20679.261%20679.54%20677.911%20738.861%20Z%20'%20fill='url(%23lgradface)'/%3e%3ccircle%20vector-effect='non-scaling-stroke'%20cx='288.69210989427233'%20cy='678.8489030784123'%20r='36.006998616085795'%20fill='%231D2939'/%3e%3cpath%20d='%20M%20215.315%20603.094%20L%20215.474%20603.311%20L%20225.391%20616.899%20L%20219.059%20624.508%20Q%20214.186%20630.632%20203.191%20651.11%20L%20187.782%20648.778%20L%20187.605%20648.751%20C%20184.875%20657.939%20183.405%20667.52%20183.232%20677.103%20L%20183.232%20677.103%20L%20183.408%20677.13%20L%20198.806%20679.539%20Q%20203.025%20702.406%20205.913%20709.662%20L%20205.913%20709.662%20L%20209.654%20718.848%20L%20196.251%20728.738%20C%20194.871%20729.749%20210.421%20751.658%20213.148%20752.079%20L%20213.148%20752.079%20L%20226.727%20742.149%20L%20234.347%20748.483%20Q%20240.473%20753.358%20260.947%20764.362%20L%20258.606%20779.758%20L%20258.579%20779.935%20C%20267.725%20782.705%20277.386%20784.196%20286.942%20784.31%20L%20286.942%20784.31%20L%20286.969%20784.134%20L%20289.376%20768.747%20Q%20312.244%20764.517%20319.501%20761.63%20L%20319.501%20761.63%20L%20328.687%20757.888%20L%20338.574%20771.302%20C%20340.751%20771.638%20347.004%20766.615%20348.276%20765.756%20C%20348.276%20765.756%20361.905%20754.404%20361.905%20754.404%20L%20361.905%20754.404%20L%20351.988%20740.815%20L%20358.321%20733.195%20Q%20363.194%20727.073%20374.2%20706.595%20L%20389.597%20708.936%20L%20389.774%20708.964%20C%20392.542%20699.825%20394.041%20690.16%20394.147%20680.611%20L%20394.147%20680.611%20L%20393.971%20680.584%20L%20378.586%20678.166%20Q%20374.357%20655.302%20371.468%20648.041%20L%20371.468%20648.041%20L%20367.725%20638.866%20L%20381.13%20628.966%20L%20364.243%20605.637%20L%20364.243%20605.637%20L%20350.654%20615.555%20L%20343.032%20609.232%20Q%20337.021%20604.235%20316.432%20593.353%20L%20318.775%20577.945%20L%20318.801%20577.779%20C%20309.636%20575.004%20300.005%20573.554%20290.439%20573.393%20L%20290.439%20573.393%20L%20290.412%20573.57%20L%20288.003%20588.967%20Q%20265.139%20593.186%20257.88%20596.074%20L%20257.88%20596.074%20L%20248.703%20599.828%20L%20238.805%20586.412%20C%20237.231%20584.264%20217.224%20601.292%20215.315%20603.094%20L%20215.315%20603.094%20Z%20M%20304.876%20615.687%20C%20336.458%20623.61%20357.431%20654.983%20353.381%20687.157%20C%20348.861%20723.078%20314.458%20748.782%20278.758%20743.275%20C%20276.617%20742.944%20274.469%20742.561%20272.366%20742.034%20C%20248.097%20735.957%20229.126%20715.277%20224.553%20690.793%20C%20215.992%20644.963%20259.443%20604.183%20304.876%20615.687%20L%20304.876%20615.687%20Z%20'%20fill-rule='evenodd'%20fill='%231D2939'%3e%3canimateTransform%20attributeName='transform'%20attributeType='XML'%20type='rotate'%20from='0%20289%20679'%20to='360%20289%20679'%20dur='15s'%20repeatCount='indefinite'/%3e%3c/path%3e%3ccircle%20vector-effect='non-scaling-stroke'%20cx='525.3095293714078'%20cy='678.8489030784123'%20r='36.00699861608578'%20fill='%231D2939'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e", dw = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20style='isolation:isolate'%20viewBox='0%200%20800%20980'%20width='800pt'%20height='980pt'%3e%3cdefs%3e%3clinearGradient%20id='lgradhat'%20x1='95%25'%20y1='0%25'%20x2='5%25'%20y2='100%25'%20%3e%3cstop%20offset='30%25'%20style='stop-color:rgb(0,%20201,%20181);stop-opacity:1'%20/%3e%3cstop%20offset='100%25'%20style='stop-color:rgb(0,%20178,%20194);stop-opacity:1'%20/%3e%3c/linearGradient%3e%3clinearGradient%20id='lgradface'%20x1='95%25'%20y1='0%25'%20x2='5%25'%20y2='100%25'%20%3e%3cstop%20offset='0%25'%20style='stop-color:rgb(0,%20201,%20181);stop-opacity:1'%20/%3e%3cstop%20offset='100%25'%20style='stop-color:rgb(0,%20178,%20194);stop-opacity:1'%20/%3e%3c!--%20%3cstop%20offset='100%25'%20style='stop-color:rgb(69,140,153);stop-opacity:1'%20/%3e%20--%3e%3c/linearGradient%3e%3cclipPath%20id='_clipPath_mFFOFRoZDPwZeoLGBAaPqqdgYpIvRWDO'%3e%3crect%20width='800'%20height='980'/%3e%3c/clipPath%3e%3c/defs%3e%3cg%20clip-path='url(%23_clipPath_mFFOFRoZDPwZeoLGBAaPqqdgYpIvRW80)'%3e%3cg%20style='isolation:isolate'%3e%3cpath%20d='%20M%20132.662%20368.503%20Q%2050.228%20344.358%2029.785%20358.215%20C%209.341%20372.072%209.296%20386.23%2012.638%20399.366%20C%2015.981%20412.502%2094.029%20498.64%20396.713%20495.385%20C%20699.398%20492.13%20785.47%20418.128%20787.646%20399.366%20C%20789.822%20380.604%20781.975%20367.728%20763.642%20358.215%20Q%20745.308%20348.702%20664.194%20368.503%20L%20664.194%20169.607%20Q%20641.217%2014.789%20396.713%2015.291%20Q%20152.21%2015.794%20132.662%20169.607%20L%20132.662%20368.503%20Z%20'%20fill='url(%23lgradhat)'/%3e%3cpath%20d='%20M%20677.911%20738.861%20C%20676.561%20798.182%20610.792%20968.417%20396.713%20965.19%20C%20182.634%20961.964%20122.726%20804.633%20122.374%20738.861%20Q%20122.022%20673.088%20122.395%20487.914%20C%20181.19%20506.207%20268.935%20520.763%20396.713%20519.389%20C%20527.329%20517.985%20617.608%20503.406%20677.924%20485.749%20Q%20679.261%20679.54%20677.911%20738.861%20Z%20'%20fill='url(%23lgradface)'/%3e%3ccircle%20vector-effect='non-scaling-stroke'%20cx='288.69210989427233'%20cy='678.8489030784123'%20r='36.006998616085795'%20fill='%23ffffff'/%3e%3cpath%20d='%20M%20215.315%20603.094%20L%20215.474%20603.311%20L%20225.391%20616.899%20L%20219.059%20624.508%20Q%20214.186%20630.632%20203.191%20651.11%20L%20187.782%20648.778%20L%20187.605%20648.751%20C%20184.875%20657.939%20183.405%20667.52%20183.232%20677.103%20L%20183.232%20677.103%20L%20183.408%20677.13%20L%20198.806%20679.539%20Q%20203.025%20702.406%20205.913%20709.662%20L%20205.913%20709.662%20L%20209.654%20718.848%20L%20196.251%20728.738%20C%20194.871%20729.749%20210.421%20751.658%20213.148%20752.079%20L%20213.148%20752.079%20L%20226.727%20742.149%20L%20234.347%20748.483%20Q%20240.473%20753.358%20260.947%20764.362%20L%20258.606%20779.758%20L%20258.579%20779.935%20C%20267.725%20782.705%20277.386%20784.196%20286.942%20784.31%20L%20286.942%20784.31%20L%20286.969%20784.134%20L%20289.376%20768.747%20Q%20312.244%20764.517%20319.501%20761.63%20L%20319.501%20761.63%20L%20328.687%20757.888%20L%20338.574%20771.302%20C%20340.751%20771.638%20347.004%20766.615%20348.276%20765.756%20C%20348.276%20765.756%20361.905%20754.404%20361.905%20754.404%20L%20361.905%20754.404%20L%20351.988%20740.815%20L%20358.321%20733.195%20Q%20363.194%20727.073%20374.2%20706.595%20L%20389.597%20708.936%20L%20389.774%20708.964%20C%20392.542%20699.825%20394.041%20690.16%20394.147%20680.611%20L%20394.147%20680.611%20L%20393.971%20680.584%20L%20378.586%20678.166%20Q%20374.357%20655.302%20371.468%20648.041%20L%20371.468%20648.041%20L%20367.725%20638.866%20L%20381.13%20628.966%20L%20364.243%20605.637%20L%20364.243%20605.637%20L%20350.654%20615.555%20L%20343.032%20609.232%20Q%20337.021%20604.235%20316.432%20593.353%20L%20318.775%20577.945%20L%20318.801%20577.779%20C%20309.636%20575.004%20300.005%20573.554%20290.439%20573.393%20L%20290.439%20573.393%20L%20290.412%20573.57%20L%20288.003%20588.967%20Q%20265.139%20593.186%20257.88%20596.074%20L%20257.88%20596.074%20L%20248.703%20599.828%20L%20238.805%20586.412%20C%20237.231%20584.264%20217.224%20601.292%20215.315%20603.094%20L%20215.315%20603.094%20Z%20M%20304.876%20615.687%20C%20336.458%20623.61%20357.431%20654.983%20353.381%20687.157%20C%20348.861%20723.078%20314.458%20748.782%20278.758%20743.275%20C%20276.617%20742.944%20274.469%20742.561%20272.366%20742.034%20C%20248.097%20735.957%20229.126%20715.277%20224.553%20690.793%20C%20215.992%20644.963%20259.443%20604.183%20304.876%20615.687%20L%20304.876%20615.687%20Z%20'%20fill-rule='evenodd'%20fill='%23ffffff'%3e%3canimateTransform%20attributeName='transform'%20attributeType='XML'%20type='rotate'%20from='0%20289%20679'%20to='360%20289%20679'%20dur='15s'%20repeatCount='indefinite'/%3e%3c/path%3e%3ccircle%20vector-effect='non-scaling-stroke'%20cx='525.3095293714078'%20cy='678.8489030784123'%20r='36.00699861608578'%20fill='%23ffffff'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
var fw = /* @__PURE__ */ W('<img alt="" class="h-[70%] w-[70%] dark:hidden"/> <img alt="" class="hidden h-[70%] w-[70%] dark:block"/>', 1), pw = /* @__PURE__ */ ue('<svg viewBox="0 0 16 16" class="h-[62%] w-[62%] text-fg-muted" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="4" cy="4" r="1.75"></circle><circle cx="4" cy="12" r="1.75"></circle><circle cx="12" cy="8" r="1.75"></circle><path d="M4 5.75v4.5M5.6 4.6 10.4 7.3M5.6 11.4l4.8-2.7"></path></svg>'), vw = /* @__PURE__ */ W('<img alt="" class="h-full w-full object-cover" loading="lazy"/>'), hw = /* @__PURE__ */ W('<span class="avatar-initial svelte-xyfbs4" aria-hidden="true"> </span>'), mw = /* @__PURE__ */ W('<span role="img"><!></span>');
function hi(e, t) {
  Se(t, !0);
  let n = q(t, "src", 3, null), a = q(t, "kind", 3, "person"), r = q(t, "size", 3, 16), s = q(t, "class", 3, "");
  const i = /* @__PURE__ */ V(() => a() === "person" && !n()), o = /* @__PURE__ */ V(() => r() <= 16 ? (t.name.trim()[0] ?? "?").toUpperCase() : ks(t.name)), l = /* @__PURE__ */ V(() => a() === "controller" ? "kuberik (automatic)" : a() === "ci" ? `${t.name} (CI)` : t.name), c = /* @__PURE__ */ V(() => r() <= 16 ? 10 : 11);
  var u = mw(), f = N(u);
  {
    var p = (y) => {
      var b = fw(), g = ne(b), m = I(g, 2);
      P(() => {
        $(g, "src", dw), $(m, "src", uw);
      }), M(y, b);
    }, v = (y) => {
      var b = le(), g = ne(b);
      {
        var m = (h) => {
          var C = pw();
          M(h, C);
        }, x = (h) => {
          var C = le(), _ = ne(C);
          {
            var A = (S) => {
              var w = vw();
              P(() => $(w, "src", n())), M(S, w);
            }, E = (S) => {
              var w = hw(), L = N(w);
              P(() => {
                ot(w, `font-size:${d(c) ?? ""}px`), Y(L, d(o));
              }), M(S, w);
            };
            D(
              _,
              (S) => {
                n() ? S(A) : S(E, !1);
              },
              !0
            );
          }
          M(h, C);
        };
        D(
          g,
          (h) => {
            a() === "ci" ? h(m) : h(x, !1);
          },
          !0
        );
      }
      M(y, b);
    };
    D(f, (y) => {
      a() === "controller" ? y(p) : y(v, !1);
    });
  }
  P(() => {
    ie(u, 1, `avatar inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${d(i) ? "avatar-fallback" : "bg-subtle"} ${s() ?? ""}`, "svelte-xyfbs4"), ot(u, `width:${r() ?? ""}px;height:${r() ?? ""}px`), $(u, "aria-label", d(l)), $(u, "title", d(l));
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
  var a = le(), r = ne(a);
  {
    var s = (o) => {
      var l = le(), c = ne(l);
      pc(c, () => t.bead.href ? "a" : "span", !1, (u, f) => {
        $e(
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
          var y = (h) => {
            ga(h, { state: "approval", tone: "held" });
          }, b = (h) => {
            var C = le(), _ = ne(C);
            {
              var A = (S) => {
                ga(S, { state: "approval", tone: "neutral" });
              }, E = (S) => {
                var w = le(), L = ne(w);
                {
                  var k = (T) => {
                    ga(T, {
                      get state() {
                        return n[t.bead.state];
                      }
                    });
                  };
                  D(
                    L,
                    (T) => {
                      t.bead.state !== "landed" && T(k);
                    },
                    !0
                  );
                }
                M(S, w);
              };
              D(
                _,
                (S) => {
                  t.bead.state === "approval" ? S(A) : S(E, !1);
                },
                !0
              );
            }
            M(h, C);
          };
          D(v, (h) => {
            t.bead.state === "approval-yours" ? h(y) : h(b, !1);
          });
        }
        var g = I(v, 2);
        {
          var m = (h) => {
            var C = bw(), _ = N(C);
            P(() => Y(_, t.bead.count)), M(h, C);
          }, x = (h) => {
            var C = _w(), _ = ne(C);
            Tt(_, 16, () => t.bead.refs, (S) => S, (S, w) => {
              var L = ww(), k = N(L);
              P(() => Y(k, w)), M(S, L);
            });
            var A = I(_);
            {
              var E = (S) => {
                var w = kw(), L = N(w);
                P(() => Y(L, `+${t.bead.more ?? ""}`)), M(S, w);
              };
              D(A, (S) => {
                t.bead.more && S(E);
              });
            }
            M(h, C);
          };
          D(g, (h) => {
            t.bead.count !== null ? h(m) : h(x, !1);
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
            var b = (m) => {
              var x = xw();
              M(m, x);
            }, g = (m) => {
              var x = le(), h = ne(x);
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
                    D(S, (k) => {
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
                        var B = (O) => {
                          var z = Tw();
                          M(O, z);
                        }, j = (O) => {
                          var z = le(), te = ne(z);
                          {
                            var ae = (K) => {
                              var J = Mw();
                              M(K, J);
                            }, re = (K) => {
                              var J = le(), Z = ne(J);
                              {
                                var R = (ee) => {
                                  var X = Ew();
                                  M(ee, X);
                                }, U = (ee) => {
                                  const X = /* @__PURE__ */ V(() => t.step.state !== "baking" && t.step.state !== "retrying");
                                  var G = Lw();
                                  P(() => ie(G, 1, `cl-dot ${d(X) ? "bg-active-solid animate-pulse" : "bg-progress-solid"}`, "svelte-1g0hr3c")), M(ee, G);
                                };
                                D(
                                  Z,
                                  (ee) => {
                                    t.step.tone === "stuck" ? ee(R) : ee(U, !1);
                                  },
                                  !0
                                );
                              }
                              M(K, J);
                            };
                            D(
                              te,
                              (K) => {
                                t.step.tone === "failed" ? K(ae) : K(re, !1);
                              },
                              !0
                            );
                          }
                          M(O, z);
                        };
                        D(
                          F,
                          (O) => {
                            t.step.tone === "none" ? O(B) : O(j, !1);
                          },
                          !0
                        );
                      }
                      M(k, T);
                    };
                    D(
                      S,
                      (k) => {
                        t.step.tone === "queued" ? k(w) : k(L, !1);
                      },
                      !0
                    );
                  }
                  M(A, E);
                };
                D(
                  h,
                  (A) => {
                    t.step.tone === "live" ? A(C) : A(_, !1);
                  },
                  !0
                );
              }
              M(m, x);
            };
            D(
              y,
              (m) => {
                t.step.resolved ? m(b) : m(g, !1);
              },
              !0
            );
          }
          M(p, v);
        };
        D(
          c,
          (p) => {
            t.step ? p(f, !1) : p(u);
          },
          !0
        );
      }
      M(o, l);
    };
    D(r, (o) => {
      t.bead ? o(s) : o(i, !1);
    });
  }
  M(e, a), Ce();
}
var Rw = /* @__PURE__ */ W('<span class="env-mk svelte-15vz3qs"><!></span>'), Ow = /* @__PURE__ */ W("<span> </span>"), Dw = /* @__PURE__ */ W('<span class="env-region t-meta text-fg-subtle svelte-15vz3qs"> </span>'), Fw = /* @__PURE__ */ W('<span class="pointer-events-auto flex min-w-0 items-center gap-1 pl-1"></span>'), Iw = /* @__PURE__ */ W("<span> </span>"), Pw = /* @__PURE__ */ W("<!> <span> </span> <!> <!> <!>", 1), jw = /* @__PURE__ */ W('<b class="font-medium text-fg-muted"> </b>'), Ww = /* @__PURE__ */ W('<span class="env-hang t-meta text-fg-subtle svelte-15vz3qs"><!> </span>'), Bw = /* @__PURE__ */ W("<div><!> <!></div>"), zw = /* @__PURE__ */ W('<div data-env-row=""><div></div></div>');
function fl(e, t) {
  Se(t, !0);
  let n = q(t, "size", 3, "L"), a = q(t, "class", 3, "");
  var r = zw(), s = N(r);
  Tt(s, 21, () => t.cells, (i) => i.key, (i, o) => {
    var l = Bw();
    let c;
    var u = N(l);
    pc(u, () => d(o).href ? "a" : "div", !1, (v, y) => {
      $e(
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
        var m = (k) => {
          var T = Rw(), F = N(T);
          {
            let B = /* @__PURE__ */ V(() => d(o).mark.progress ?? null);
            ga(F, {
              get state() {
                return d(o).mark.state;
              },
              get tone() {
                return d(o).mark.tone;
              },
              get progress() {
                return d(B);
              }
            });
          }
          M(k, T);
        };
        D(g, (k) => {
          d(o).mark && k(m);
        });
      }
      var x = I(g, 2), h = N(x), C = I(x, 2);
      {
        var _ = (k) => {
          var T = Ow(), F = N(T);
          P(() => {
            ie(T, 1, `env-word t-ui-sm ${d(o).wordInk ?? "text-fg-muted" ?? ""}`, "svelte-15vz3qs"), Y(F, d(o).word);
          }), M(k, T);
        };
        D(C, (k) => {
          d(o).word && k(_);
        });
      }
      var A = I(C, 2);
      {
        var E = (k) => {
          var T = Dw(), F = N(T);
          P(() => Y(F, d(o).region)), M(k, T);
        };
        D(A, (k) => {
          d(o).region && k(E);
        });
      }
      var S = I(A, 2);
      {
        var w = (k) => {
          var T = Fw();
          Tt(T, 21, () => d(o).beads, (F) => F.state + F.refs.join() + F.count, (F, B) => {
            Nw(F, {
              get bead() {
                return d(B);
              }
            });
          }), M(k, T);
        }, L = (k) => {
          var T = le(), F = ne(T);
          {
            var B = (j) => {
              var O = Iw(), z = N(O);
              P(() => {
                ie(O, 1, `env-fact ${d(o).factKind === "detail" ? "env-detail" : "env-lag"} t-meta tabular-nums text-fg-subtle`, "svelte-15vz3qs"), Y(z, d(o).fact);
              }), M(j, O);
            };
            D(
              F,
              (j) => {
                d(o).fact && j(B);
              },
              !0
            );
          }
          M(k, T);
        };
        D(S, (k) => {
          d(o).beads?.length ? k(w) : k(L, !1);
        });
      }
      P(() => {
        ie(x, 1, `env-name t-ui-sm ${d(o).hot ? "text-fg" : "text-fg-muted"}`, "svelte-15vz3qs"), Y(h, d(o).label);
      }), M(y, b);
    });
    var f = I(u, 2);
    {
      var p = (v) => {
        var y = Ww(), b = N(y);
        {
          var g = (x) => {
            var h = jw(), C = N(h);
            P(() => Y(C, d(o).hang.lead)), M(x, h);
          };
          D(b, (x) => {
            d(o).hang.lead && x(g);
          });
        }
        var m = I(b, 1, !0);
        P(() => Y(m, d(o).hang.text)), M(v, y);
      };
      D(f, (v) => {
        d(o).hang && v(p);
      });
    }
    P(() => {
      c = ie(l, 1, "env-cell svelte-15vz3qs", null, c, { "env-cell--hang": !!d(o).hang }), $(l, "data-tier", d(o).key);
    }), M(i, l);
  }), P(
    (i) => {
      ie(r, 1, `env-cq min-w-0 ${a() ?? ""}`, "svelte-15vz3qs"), $(r, "data-size", n()), ie(s, 1, `env-row env-row--${i ?? ""}`, "svelte-15vz3qs");
    },
    [() => n().toLowerCase()]
  ), M(e, r), Ce();
}
var Hw = /* @__PURE__ */ W('<a class="tap-link t-card-title block truncate text-fg hover:underline"> </a>'), Vw = /* @__PURE__ */ W('<span class="t-card-title block truncate text-fg"> </span>'), Uw = /* @__PURE__ */ W("<p> </p>"), qw = /* @__PURE__ */ W('<div class="lane-cq svelte-1t67zmg"><div class="lane svelte-1t67zmg"><div class="lane-head min-w-0"><!> <!></div> <!></div></div>');
function Gw(e, t) {
  Se(t, !0);
  const n = () => Xf(gw, "$now", a), [a, r] = Jf();
  let s = q(t, "appHref", 3, null), i = q(t, "current", 3, null), o = q(t, "youAreHere", 3, !1), l = q(t, "showApp", 3, !0), c = q(t, "quietLead", 3, !1), u = q(t, "fill", 3, void 0), f = q(t, "beads", 3, void 0), p = q(t, "words", 3, !1), v = q(t, "yours", 3, !1);
  const y = /* @__PURE__ */ V(() => u() ?? "L"), b = zu(), g = /* @__PURE__ */ V(() => !u()), m = /* @__PURE__ */ V(() => t.tiers?.filter((R) => t.lane.byTier[R]?.length) ?? ["dev", "test", "staging", "other", "prod"].filter((R) => t.lane.byTier[R]?.length)), x = {
    failed: "text-danger",
    stuck: "text-warning",
    deploying: "text-active",
    checking: "text-progress",
    held: "text-held",
    behind: "text-fg-muted",
    newest: "text-fg-muted",
    none: "text-fg-subtle"
  }, h = (R) => !!i() && R.card.ns === i().ns && R.card.name === i().name;
  function C(R) {
    const U = R.env, ee = R.card.version ? xt(R.card.version) : "", X = R.card.timestamp ? _r(R.card.timestamp, n()) : "";
    switch (R.state) {
      case "failed":
        return R.card.checkFailure ? `Health check failing in ${U}` : `Deploy failed in ${U}`;
      case "stuck":
        return `Stuck in ${U}`;
      case "deploying":
        return `Deploying ${ee} to ${U}${X ? ` · ${X}` : ""}`;
      case "checking":
        return `Checking ${ee} in ${U}${X ? ` · ${X}` : ""}`;
      case "held":
        return R.card.heldCause === "person" ? `Waits for you in ${U}` : `Held in ${U}${R.card.heldCauseLabel ? ` · waits on ${R.card.heldCauseLabel}` : ""}`;
      case "behind": {
        const G = [...t.lane.stages, ...t.lane.prod], se = G.filter((me) => me.state === "newest"), de = G.find((me) => me.state === "behind");
        if (se.length === 0) return "Newest build not deployed yet";
        const ce = se[se.length - 1], Q = ce.card.version ? xt(ce.card.version) : "Newest", fe = de ? de.tier === "prod" && t.lane.prod.length > 1 ? "prod" : de.env : "";
        return `${Q} in ${ce.env}${fe ? ` · ${fe} next` : ""}`;
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
  }, A = (R) => R.state === "held" && R.card.heldCause === "person" ? p() ? Nh(v()) : "Waiting" : _[R.state], E = /* @__PURE__ */ new Set(["failed", "stuck", "held", "deploying", "checking"]), S = (R) => E.has(R.state) ? { state: R.state } : void 0, w = /* @__PURE__ */ V(() => t.lane.prod.reduce((R, U) => !R || nt.indexOf(U.state) < nt.indexOf(R.state) ? U : R, null)), L = {
    failed: "failing",
    stuck: "stuck",
    deploying: "deploying",
    checking: "checking",
    held: "held",
    behind: "",
    newest: "",
    none: ""
  }, k = (R) => {
    const U = [...new Set(R.map((X) => X.card.wave ?? 1))], ee = (X) => `${X.env}${X.card.role === "Leader" && R.filter((G) => (G.card.wave ?? 1) === (X.card.wave ?? 1)).length > 1 ? " (leader)" : ""}: ${A(X) || "Healthy"}${X.card.version ? ` · ${xt(X.card.version)}` : ""}`;
    return U.length < 2 ? R.map(ee).join(`
`) : U.map((X) => `wave ${X}
` + R.filter((G) => (G.card.wave ?? 1) === X).map((G) => "  " + ee(G)).join(`
`)).join(`
`);
  }, T = (R, U) => new Set(R.map((ee) => ee.card.wave ?? 1)).size > 1 ? ` · wave ${U.card.wave ?? 1}` : "";
  function F(R, U) {
    return am(R.map((ee) => ee.env), L[U.state] ? R.filter((ee) => ee.state === U.state) : null);
  }
  function B(R, U) {
    return L[U.state] && R.filter((ee) => ee.state === U.state).length === 1 ? U.env : "";
  }
  const j = /* @__PURE__ */ V(() => !t.lane.lead || c() || t.lane.lead.state === "behind" || t.lane.lead.state === "newest" ? "text-fg-subtle" : x[t.lane.lead.state]);
  function O(R, U) {
    const ee = R && b.progress ? b.progress.get(`${U.card.ns}/${U.card.name}`) : null;
    return R && ee ? { ...R, progress: ee.fraction } : R;
  }
  function z(R) {
    return {
      key: R.tier === "prod" ? "prod" : R.env,
      label: R.env,
      href: d(g) ? t.hrefFor(R) : void 0,
      current: o() && h(R),
      title: `${R.card.envDisplay || R.env}: ${R.card.version ?? "no build"}${R.behind > 0 ? ` · ${Mo({ builds: R.behind })} the newest` : ""}`,
      style: R.card.theme ? fa(R.card.theme) : void 0,
      mark: O(S(R), R),
      word: A(R) || void 0,
      wordInk: x[R.state],
      hot: E.has(R.state),
      fact: R.behind > 0 ? d(y) === "M" ? `${R.behind} behind` : Mo({ builds: R.behind }) : void 0,
      factKind: "lag",
      beads: f()?.(R)
    };
  }
  function te(R, U) {
    const ee = R.find(h), X = ee ?? U, G = ee ? `${xc(ee.env).place ?? ee.env}${T(R, ee)}` : B(R, U) ? `${B(R, U)}${T(R, U)}` : void 0;
    return {
      ...z(X),
      key: "prod",
      label: "prod",
      current: o() && !!ee,
      title: k(R),
      style: R[0].card.theme ? fa(R[0].card.theme) : void 0,
      region: G,
      fact: F(R, X),
      factKind: "detail"
    };
  }
  const ae = /* @__PURE__ */ V(() => d(m).map((R) => {
    const U = t.lane.byTier[R] ?? [];
    return R === "prod" && U.length > 1 && d(w) && Va(U.map((ee) => ee.env)) > 1 ? te(U, d(w)) : z(R === "prod" ? U.reduce((ee, X) => nt.indexOf(X.state) < nt.indexOf(ee.state) ? X : ee, U[0]) : U[0]);
  }));
  var re = le(), K = ne(re);
  {
    var J = (R) => {
      var U = qw(), ee = N(U), X = N(ee), G = N(X);
      {
        var se = (me) => {
          var ve = Hw(), Ne = N(ve);
          P(() => {
            $(ve, "href", s()), Y(Ne, t.lane.app);
          }), M(me, ve);
        }, de = (me) => {
          var ve = Vw(), Ne = N(ve);
          P(() => Y(Ne, t.lane.app)), M(me, ve);
        };
        D(G, (me) => {
          s() ? me(se) : me(de, !1);
        });
      }
      var ce = I(G, 2);
      {
        var Q = (me) => {
          var ve = Uw(), Ne = N(ve);
          P(
            (Ve) => {
              ie(ve, 1, `t-meta truncate ${d(j) ?? ""}`, "svelte-1t67zmg"), Y(Ne, Ve);
            },
            [() => C(t.lane.lead)]
          ), M(me, ve);
        };
        D(ce, (me) => {
          t.lane.lead && me(Q);
        });
      }
      var fe = I(X, 2);
      fl(fe, {
        get cells() {
          return d(ae);
        },
        get size() {
          return d(y);
        }
      }), M(R, U);
    }, Z = (R) => {
      fl(R, {
        get cells() {
          return d(ae);
        },
        get size() {
          return d(y);
        }
      });
    };
    D(K, (R) => {
      l() ? R(J) : R(Z, !1);
    });
  }
  M(e, re), Ce(), r();
}
var Kw = /* @__PURE__ */ W('<span class="text-fg-muted"> </span>'), Yw = /* @__PURE__ */ W("<div><!> <span><span> </span> <!></span></div>");
function $w(e, t) {
  Se(t, !0);
  let n = q(t, "compact", 3, !1), a = q(t, "ink", 3, !1);
  var r = Yw(), s = N(r);
  Ba(s, {
    class: "check-glyph h-3 w-3 shrink-0 translate-y-0.5",
    "aria-hidden": "true"
  });
  var i = I(s, 2), o = N(i), l = N(o), c = I(o, 2);
  {
    var u = (f) => {
      var p = Kw(), v = N(p);
      P(() => Y(v, t.check.message)), M(f, p);
    };
    D(c, (f) => {
      t.check.message && f(u);
    });
  }
  P(() => {
    ie(r, 1, `t-meta flex items-start gap-1.5 ${n() ? "" : "check-line"} ${t.danger ? "text-danger" : "text-fg-muted"}`, "svelte-q4u0pa"), ie(i, 1, Kr(n() ? "line-clamp-2" : "")), ie(o, 1, Kr(a() ? "text-fg" : t.danger ? "text-danger" : "text-fg-muted")), Y(l, `${t.check.name ?? ""}${t.check.message ? ":" : ""}`);
  }), M(e, r), Ce();
}
var Qw = /* @__PURE__ */ W('<span aria-hidden="true" class="absolute left-[27px] top-0 h-[10px] w-0.5 bg-line-strong"></span>'), Zw = /* @__PURE__ */ W('<span aria-hidden="true" class="absolute bottom-0 left-[27px] top-[34px] w-0.5 bg-line-strong"></span>'), Xw = /* @__PURE__ */ W('<span aria-hidden="true"></span>'), Jw = /* @__PURE__ */ W('<span aria-hidden="true"></span>'), ek = /* @__PURE__ */ W("<span> </span>"), tk = /* @__PURE__ */ W('<li class="relative"><!> <!> <div><!> <span data-node=""><!></span> <span> </span> <!> <span class="sr-only"> </span></div></li>'), nk = /* @__PURE__ */ W('<ol data-pipeline="list" aria-label="Pipeline steps"></ol>');
function pl(e, t) {
  Se(t, !0);
  let n = q(t, "selected", 3, null), a = q(t, "layout", 3, "list");
  q(t, "node", 3, "md");
  let r = q(t, "checkWord", 3, "Checking"), s = q(t, "noActiveChip", 3, !1), i = q(t, "noHoldChip", 3, !1), o = q(t, "dup", 3, !1), l = q(t, "class", 3, "");
  const c = {
    done: "done",
    active: "running",
    fail: "failed",
    todo: "not started",
    hold: "waiting"
  }, u = (C) => Wu(C, r() === "Deploying" ? "deploying" : "checking") === "checking", f = (C) => C.state === "active" && s() ? "" : C.state === "active" ? C.name === "Check" ? r() : "In progress" : C.state === "todo" ? "Pending" : C.state === "hold" ? i() ? "" : "Waiting" : "", p = (C) => C.state === "fail" ? "bg-danger-solid" : C.state === "done" ? "bg-success-solid" : u(C) ? "bg-progress-solid" : "bg-active-solid", v = (C) => u(C) ? "border-progress-solid/40 border-t-progress-solid" : "border-active-solid/40 border-t-active-solid", y = (C) => C.state === "done" ? "bg-success-tint text-success" : C.state === "fail" ? "bg-danger-tint text-danger" : u(C) ? "bg-progress-tint text-progress" : C.state === "active" ? "bg-active-tint text-active" : "bg-subtle text-fg-disabled", b = (C) => u(C) ? "border-progress-line text-progress" : C.state === "active" ? "border-active-line text-active" : "border-line text-fg-subtle";
  var g = le(), m = ne(g);
  {
    var x = (C) => {
      {
        let _ = /* @__PURE__ */ V(() => Zi(t.steps, r() === "Deploying" ? "deploying" : "checking", !0)), A = /* @__PURE__ */ V(() => o() ? "strand-dup" : "strand");
        Bu(C, {
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
    }, h = (C) => {
      var _ = nk();
      Tt(_, 21, () => t.steps, Ci, (A, E, S) => {
        const w = /* @__PURE__ */ V(() => n() === d(E).name);
        var L = tk(), k = N(L);
        {
          var T = (G) => {
            var se = Qw();
            M(G, se);
          };
          D(k, (G) => {
            S > 0 && G(T);
          });
        }
        var F = I(k, 2);
        {
          var B = (G) => {
            var se = Zw();
            M(G, se);
          };
          D(F, (G) => {
            S < t.steps.length - 1 && G(B);
          });
        }
        var j = I(F, 2), O = N(j);
        {
          var z = (G) => {
            var se = Xw();
            P((de) => ie(se, 1, `absolute inset-y-0 left-0 w-0.5 ${de ?? ""}`), [() => p(d(E))]), M(G, se);
          };
          D(O, (G) => {
            d(w) && G(z);
          });
        }
        var te = I(O, 2), ae = N(te);
        {
          var re = (G) => {
            fs(G, { class: "h-4 w-4", "aria-hidden": "true" });
          }, K = (G) => {
            var se = le(), de = ne(se);
            {
              var ce = (fe) => {
                Ba(fe, { class: "h-4 w-4", "aria-hidden": "true" });
              }, Q = (fe) => {
                var me = le(), ve = ne(me);
                {
                  var Ne = (_e) => {
                    var Xe = Jw();
                    P((ze) => ie(Xe, 1, `h-4 w-4 animate-spin rounded-full border-2 ${ze ?? ""}`), [() => v(d(E))]), M(_e, Xe);
                  }, Ve = (_e) => {
                    _c(_e, { class: "h-4 w-4", "aria-hidden": "true" });
                  };
                  D(
                    ve,
                    (_e) => {
                      d(E).state === "active" ? _e(Ne) : _e(Ve, !1);
                    },
                    !0
                  );
                }
                M(fe, me);
              };
              D(
                de,
                (fe) => {
                  d(E).state === "fail" ? fe(ce) : fe(Q, !1);
                },
                !0
              );
            }
            M(G, se);
          };
          D(ae, (G) => {
            d(E).state === "done" ? G(re) : G(K, !1);
          });
        }
        var J = I(te, 2), Z = N(J), R = I(J, 2);
        {
          var U = (G) => {
            var se = ek(), de = N(se);
            P(
              (ce, Q) => {
                ie(se, 1, `chip t-label chip-wide shrink-0 ${ce ?? ""}`), Y(de, Q);
              },
              [() => b(d(E)), () => f(d(E))]
            ), M(G, se);
          };
          D(R, (G) => {
            f(d(E)) && G(U);
          });
        }
        var ee = I(R, 2), X = N(ee);
        P(
          (G) => {
            $(L, "data-step", d(E).name), $(L, "data-state", d(E).state), $(L, "aria-current", d(w) ? "step" : void 0), ie(j, 1, `relative flex h-11 items-center gap-3 pl-4 pr-3 ${d(w) ? "bg-selected" : ""}`), ie(te, 1, `relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${G ?? ""}`), ie(J, 1, `min-w-0 flex-1 truncate ${d(E).state === "fail" ? "t-card-title text-danger" : d(w) ? "t-card-title text-fg" : "t-body text-fg-muted"}`), Y(Z, d(E).name), Y(X, c[d(E).state]);
          },
          [() => y(d(E))]
        ), M(A, L);
      }), P(() => ie(_, 1, `min-w-0 py-2 ${l() ?? ""}`)), M(C, _);
    };
    D(m, (C) => {
      a() === "strand" ? C(x) : C(h, !1);
    });
  }
  M(e, g), Ce();
}
var ak = /* @__PURE__ */ W('<span aria-hidden="true"></span>'), rk = /* @__PURE__ */ W('<span data-pc-rollup=""> </span>'), sk = /* @__PURE__ */ W('<nav class="pc-rail svelte-tixt72"><!></nav>'), ik = /* @__PURE__ */ W('<div class="pc-foot min-w-0"><!></div>'), ok = /* @__PURE__ */ W('<section><header class="pc-head flex min-h-[47px] items-center gap-2 border-b border-line px-4 py-3 svelte-tixt72"><!> <h3 class="t-card-title min-w-0 flex-1 text-fg"> </h3> <!></header> <div><!> <div class="pc-pane min-w-0 svelte-tixt72"><!></div> <!></div></section>');
function lk(e, t) {
  let n = q(t, "state", 3, "idle"), a = q(t, "title", 3, "Deployment pipeline"), r = q(t, "rollup", 3, null), s = q(t, "rollupAdverse", 3, !1), i = q(t, "shell", 3, "card"), o = q(t, "at", 3, 560), l = q(t, "railWidth", 3, "300px"), c = q(t, "class", 3, ""), u = q(t, "bodyClass", 3, ""), f = q(t, "railLabel", 3, "Pipeline steps"), p = q(t, "mute", 3, !1), v = /* @__PURE__ */ bt(t, [
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
  $e(
    y,
    () => ({
      class: `pc pc-${i() ?? ""} pc-at${o() ?? ""} ${t.children && t.rail ? "" : "pc-solo"} ${p() ? "pc-mute" : ""} ${c() ?? ""}`,
      "aria-label": t.label ?? a(),
      "data-pipeline-card": !0,
      "data-pc-state": n(),
      ...v,
      [ca]: { "--pc-rail": l() }
    }),
    void 0,
    void 0,
    void 0,
    "svelte-tixt72"
  );
  var b = N(y), g = N(b);
  {
    var m = (j) => {
      gp(j, {
        class: "h-4 w-4 shrink-0 text-fg-subtle",
        "aria-hidden": "true"
      });
    }, x = (j) => {
      var O = le(), z = ne(O);
      {
        var te = (re) => {
          Ba(re, { class: "h-4 w-4 shrink-0 text-danger", "aria-hidden": "true" });
        }, ae = (re) => {
          var K = le(), J = ne(K);
          {
            var Z = (U) => {
              var ee = ak();
              P(() => ie(ee, 1, `h-4 w-4 shrink-0 animate-spin rounded-full border-2 ${n() === "checking" ? "border-progress-solid/40 border-t-progress-solid" : "border-active-solid/40 border-t-active-solid"}`)), M(U, ee);
            }, R = (U) => {
              var ee = le(), X = ne(ee);
              {
                var G = (de) => {
                  fs(de, {
                    class: "h-4 w-4 shrink-0 text-success",
                    "aria-hidden": "true"
                  });
                }, se = (de) => {
                  var ce = le(), Q = ne(ce);
                  {
                    var fe = (ve) => {
                      ga(ve, { state: "held" });
                    }, me = (ve) => {
                      Bp(ve, {
                        class: "h-4 w-4 shrink-0 text-fg-subtle",
                        "aria-hidden": "true"
                      });
                    };
                    D(
                      Q,
                      (ve) => {
                        n() === "held" ? ve(fe) : ve(me, !1);
                      },
                      !0
                    );
                  }
                  M(de, ce);
                };
                D(
                  X,
                  (de) => {
                    n() === "done" ? de(G) : de(se, !1);
                  },
                  !0
                );
              }
              M(U, ee);
            };
            D(
              J,
              (U) => {
                n() === "deploying" || n() === "checking" ? U(Z) : U(R, !1);
              },
              !0
            );
          }
          M(re, K);
        };
        D(
          z,
          (re) => {
            n() === "failed" ? re(te) : re(ae, !1);
          },
          !0
        );
      }
      M(j, O);
    };
    D(g, (j) => {
      p() ? j(m) : j(x, !1);
    });
  }
  var h = I(g, 2), C = N(h), _ = I(h, 2);
  {
    var A = (j) => {
      var O = rk(), z = N(O);
      P(() => {
        ie(O, 1, `t-ui-sm shrink-0 whitespace-nowrap tabular-nums ${s() ? "text-fg" : "text-fg-subtle"}`), Y(z, r());
      }), M(j, O);
    };
    D(_, (j) => {
      r() && j(A);
    });
  }
  var E = I(b, 2), S = N(E);
  {
    var w = (j) => {
      var O = sk(), z = N(O);
      Un(z, () => t.rail), P(() => $(O, "aria-label", f())), M(j, O);
    };
    D(S, (j) => {
      t.rail && j(w);
    });
  }
  var L = I(S, 2), k = N(L);
  {
    var T = (j) => {
      var O = le(), z = ne(O);
      Un(z, () => t.children), M(j, O);
    };
    D(k, (j) => {
      t.children && j(T);
    });
  }
  var F = I(L, 2);
  {
    var B = (j) => {
      var O = ik(), z = N(O);
      Un(z, () => t.foot), M(j, O);
    };
    D(F, (j) => {
      t.foot && j(B);
    });
  }
  P(() => {
    Y(C, a()), ie(E, 1, `pc-body ${u() ?? ""}`, "svelte-tixt72");
  }), M(e, y);
}
const vl = (e, t = ht, n = ht) => {
  var a = uk(), r = ne(a);
  {
    var s = (p) => {
      const v = /* @__PURE__ */ V(() => t().icon);
      var y = le(), b = ne(y);
      {
        let g = /* @__PURE__ */ V(() => t().iconClass ?? "h-4 w-4");
        Xs(b, () => d(v), (m, x) => {
          x(m, {
            get class() {
              return d(g);
            },
            "aria-hidden": "true"
          });
        });
      }
      M(p, y);
    };
    D(r, (p) => {
      t().icon && !t().iconAfter && p(s);
    });
  }
  var i = I(r), o = N(i), l = I(i);
  {
    var c = (p) => {
      const v = /* @__PURE__ */ V(() => t().icon);
      var y = le(), b = ne(y);
      {
        let g = /* @__PURE__ */ V(() => t().iconClass ?? "h-4 w-4"), m = /* @__PURE__ */ V(() => t().iconTurn ? "rotate-180" : "");
        Xs(b, () => d(v), (x, h) => {
          h(x, {
            get class() {
              return `${d(g) ?? ""} transition-transform ${d(m) ?? ""}`;
            },
            "aria-hidden": "true"
          });
        });
      }
      M(p, y);
    };
    D(l, (p) => {
      t().icon && t().iconAfter && p(c);
    });
  }
  var u = I(l);
  {
    var f = (p) => {
      var v = ck(), y = N(v);
      P(() => Y(y, t().external ? "↗" : "›")), M(p, v);
    };
    D(u, (p) => {
      t().href && !t().icon && p(f);
    });
  }
  P(() => Y(o, t().label)), M(e, a);
};
var ck = /* @__PURE__ */ W('<span aria-hidden="true" class="shrink-0"> </span>'), uk = /* @__PURE__ */ W("<!><span> </span><!><!>", 1), dk = /* @__PURE__ */ W("<a><!></a>"), fk = /* @__PURE__ */ W("<button><!></button>"), pk = /* @__PURE__ */ W('<a role="menuitem" class="t-ui flex min-h-11 items-center gap-2 rounded px-3 hover:bg-hover"> <span aria-hidden="true"> </span></a>'), vk = /* @__PURE__ */ W('<button role="menuitem" type="button" class="t-ui flex min-h-11 items-center gap-2 rounded px-3 text-left hover:bg-hover disabled:opacity-50"> </button>'), hk = /* @__PURE__ */ W('<div role="menu" class="absolute right-0 top-full z-30 mt-1 flex min-w-40 flex-col rounded-md border border-line bg-surface p-1 text-fg shadow-lg"></div>'), mk = /* @__PURE__ */ W('<div class="ar-more relative shrink-0 svelte-1avu033"><button type="button" class="btn btn-secondary btn-sm relative z-[1] min-h-11 min-w-11 !px-0" aria-label="More actions" aria-haspopup="menu" data-action="more"><svg viewBox="0 0 16 16" class="h-4 w-4" fill="currentColor" aria-hidden="true"><circle cx="3" cy="8" r="1.4"></circle><circle cx="8" cy="8" r="1.4"></circle><circle cx="13" cy="8" r="1.4"></circle></svg></button> <!></div>'), gk = /* @__PURE__ */ W('<div data-act-row=""><!> <!></div>');
function bk(e, t) {
  Se(t, !0);
  let n = q(t, "secondary", 19, () => []), a = q(t, "fill", 3, !0), r = q(t, "phoneMax", 3, 2), s = q(t, "align", 3, "start");
  const i = /* @__PURE__ */ V(() => {
    const m = n().filter((w) => !w.after && !w.quiet), x = n().filter((w) => w.after || w.quiet), h = [
      ...m.map((w) => ({ act: w, variant: "secondary" })),
      ...t.primary ? [{ act: t.primary, variant: "primary" }] : [],
      ...x.map((w) => ({ act: w, variant: w.quiet ? "quiet" : "secondary" }))
    ], C = (w) => !w.act.desktopOnly, _ = h.findIndex((w) => w.act.lead), A = h.findIndex(C), E = t.primary ? h.findIndex((w) => w.act === t.primary) : _ >= 0 ? _ : A, S = r() >= 2 ? h.findIndex((w, L) => L !== E && C(w)) : -1;
    return h.map((w, L) => ({
      ...w,
      phone: C(w) ? L === E ? "lead" : L === S ? "side" : "menu" : "none"
    }));
  }), o = /* @__PURE__ */ V(() => d(i).filter((m) => m.phone === "menu"));
  let l = /* @__PURE__ */ Ee(!1), c = /* @__PURE__ */ Ee(void 0);
  function u(m) {
    d(l) && d(c) && !d(c).contains(m.target) && he(l, !1);
  }
  function f(m) {
    he(l, !1), m.onclick?.();
  }
  var p = gk();
  Qs("click", tr, u), Qs("keydown", tr, (m) => m.key === "Escape" && he(l, !1));
  let v;
  var y = N(p);
  Tt(y, 17, () => d(i), ({ act: m, variant: x, phone: h }) => m.key ?? m.label, (m, x) => {
    let h = () => d(x).act, C = () => d(x).variant, _ = () => d(x).phone;
    const A = /* @__PURE__ */ V(() => `ar-item ar-${_()} ${h().phoneOnly ? "ar-phoneonly" : ""} ${h().desktopOnly ? "ar-desktoponly" : ""} relative z-[1] shrink-0 gap-1.5 ${C() === "quiet" ? "nav-link inline-flex h-8 min-h-0 items-center" : C() === "primary" ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}`);
    var E = le(), S = ne(E);
    {
      var w = (k) => {
        var T = dk();
        $e(
          T,
          () => ({
            href: h().href,
            class: d(A),
            id: h().id,
            "data-action": h().key,
            ...h().data,
            title: h().title,
            "aria-label": h().ariaLabel,
            target: h().external ? "_blank" : void 0,
            rel: h().external ? "noopener noreferrer" : void 0
          }),
          void 0,
          void 0,
          void 0,
          "svelte-1avu033"
        );
        var F = N(T);
        vl(F, h, C), M(k, T);
      }, L = (k) => {
        var T = fk();
        $e(
          T,
          () => ({
            type: "button",
            class: d(A),
            id: h().id,
            "data-action": h().key,
            ...h().data,
            title: h().title,
            "aria-label": h().ariaLabel,
            disabled: h().busy || h().disabled,
            onclick: h().onclick
          }),
          void 0,
          void 0,
          void 0,
          "svelte-1avu033"
        );
        var F = N(T);
        vl(F, h, C), M(k, T);
      };
      D(S, (k) => {
        h().href ? k(w) : k(L, !1);
      });
    }
    M(m, E);
  });
  var b = I(y, 2);
  {
    var g = (m) => {
      var x = mk(), h = N(x);
      h.__click = () => he(l, !d(l));
      var C = I(h, 2);
      {
        var _ = (A) => {
          var E = hk();
          Tt(E, 21, () => d(o), ({ act: S }) => S.key ?? S.label, (S, w) => {
            let L = () => d(w).act;
            var k = le(), T = ne(k);
            {
              var F = (j) => {
                var O = pk();
                O.__click = () => he(l, !1);
                var z = N(O), te = I(z), ae = N(te);
                P(() => {
                  $(O, "href", L().href), Y(z, L().label), Y(ae, L().external ? "↗" : "›");
                }), M(j, O);
              }, B = (j) => {
                var O = vk();
                O.__click = () => f(L());
                var z = N(O);
                P(() => {
                  O.disabled = L().busy || L().disabled, Y(z, L().label);
                }), M(j, O);
              };
              D(T, (j) => {
                L().href ? j(F) : j(B, !1);
              });
            }
            M(S, k);
          }), M(A, E);
        };
        D(C, (A) => {
          d(l) && A(_);
        });
      }
      P(() => $(h, "aria-expanded", d(l))), M(m, x);
    };
    D(b, (m) => {
      d(o).length && m(g);
    });
  }
  An(p, (m) => he(c, m), () => d(c)), P(() => v = ie(p, 1, "ar svelte-1avu033", null, v, { "ar-fill": a(), "ar-end": s() === "end" })), M(e, p), Ce();
}
Wa(["click"]);
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
  ), a = q(t, "action", 3, null), r = q(t, "compact", 3, !1), s = q(t, "nested", 3, !1), i = q(t, "class", 3, "");
  const o = /* @__PURE__ */ V(() => t.row.group === "failed"), l = /* @__PURE__ */ V(() => t.row.failure), c = /* @__PURE__ */ V(() => d(l) ? {
    name: d(l).check ?? d(l).line,
    message: d(l).check ? d(l).message ?? void 0 : void 0
  } : null), u = /* @__PURE__ */ V(() => (t.row.steps.find((ce) => ce.state === "fail") ?? t.row.steps.find((ce) => ce.state === "active" || ce.state === "hold") ?? t.row.steps[t.row.steps.length - 1])?.name ?? null), f = /* @__PURE__ */ V(() => t.row.state === "awaiting-approval" || t.row.state === "held-by-rule"), p = /* @__PURE__ */ V(() => d(f) ? yr(t.row) : null), v = /* @__PURE__ */ V(() => ha(d(f) ? t.row.group === "held" ? Gb(t.row, n()) : d(p)?.since ?? t.row.since : t.row.since)), y = /* @__PURE__ */ V(() => t.row.group === "approval" && t.row.stillChecking && ua(t.row) ? `Checking · ${ua(t.row)}` : d(v)), b = /* @__PURE__ */ V(() => d(p) ? d(p).build : dr(t.row)), g = /* @__PURE__ */ V(() => Ob(d(f) ? { state: "healthy", href: t.row.href } : t.row)), m = /* @__PURE__ */ V(() => d(p) ? { title: d(p).title ?? "", author: d(p).author } : Zb(t.row)), x = /* @__PURE__ */ V(() => d(m)?.author === ju), h = /* @__PURE__ */ V(() => Db(t.row, n())), C = /* @__PURE__ */ V(() => r() && !d(o) ? Ws(t.row)?.sentence ?? null : null), _ = /* @__PURE__ */ V(() => r() ? d(C) : d(h)), A = /* @__PURE__ */ V(() => t.row.steps.some((ce) => ce.state === "active")), E = /* @__PURE__ */ V(() => d(A) ? ua(t.row) ? "Final check · Checking" : "Final check" : d(o) ? "Final check" : "Checked"), S = /* @__PURE__ */ V(() => d(A) ? ua(t.row) ?? d(y) : d(o) ? d(y) : [ha(t.row.deployedAt), s1(t.row)].filter(Boolean).join(" · ")), w = /* @__PURE__ */ V(() => Xb(t.row)), L = /* @__PURE__ */ V(() => Nu(t.row).filter((ce) => ce.state === "failing").length), k = /* @__PURE__ */ V(() => ua(t.row)), T = /* @__PURE__ */ V(() => t.row.group === "approval" && t.row.stillChecking && !!d(k)), F = /* @__PURE__ */ V(() => [
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
  ]), B = {
    ok: "bg-success-solid",
    bad: "bg-danger-solid",
    wait: "bg-progress-solid animate-pulse",
    pending: "bg-line-strong"
  }, j = /* @__PURE__ */ V(() => d(p) ? {
    label: "Replaces",
    build: dr(t.row),
    age: `${ha(t.row.deployedAt)} ago`
  } : d(g) ? {
    label: d(o) ? "Last healthy" : "Replaces",
    build: d(g).build,
    age: `${d(o) ? "deployed " : ""}${ha(d(g).at)} ago`
  } : null), O = /* @__PURE__ */ V(() => {
    if (r()) {
      const me = Ws(t.row);
      return !me || d(
        o
        /* lead r9: the tab's own sentence, count first ('2 · held: waiting for approval'), never 'N, held:' */
      ) ? null : {
        label: "Newer builds",
        build: null,
        value: me.sentence.replace(/^(\d+) newer builds?/, "$1")
      };
    }
    if (!d(_)) return null;
    const ce = /^(\d+) of (\d+) places? on the newest build$/.exec(d(_)), Q = /^All (\d+) places? on the newest build$/.exec(d(_));
    return {
      label: "Newest build",
      build: Ws(t.row)?.newest ?? null,
      value: ce ? `reached ${ce[1]} of ${ce[2]} place${ce[2] === "1" ? "" : "s"}` : Q ? `reached all ${Q[1]} places` : d(_)
    };
  }), z = /* @__PURE__ */ V(() => t.row.steps.find((ce) => ce.state === "active") ?? null), te = /* @__PURE__ */ V(() => d(z) ? d(z).name === "Check" ? "Final check" : d(z).name : null), ae = /* @__PURE__ */ V(() => !d(T) && d(p) && (t.row.group === "approval" || t.row.group === "held") ? d(p).build : null), re = /* @__PURE__ */ V(() => d(ae) ?? (d(T) ? "Final check" : t.row.group === "moving" ? d(te) : null) ?? u1(t.row, n())), K = /* @__PURE__ */ V(() => d(T) ? d(v) : d(y)), J = /* @__PURE__ */ V(() => r() ? null : d1(t.row, n())), Z = /* @__PURE__ */ V(() => !r() && t.row.group === "approval" ? Ou(t.row, n()) : null), R = /* @__PURE__ */ V(() => t.row.needsYou ? "Your approval" : Ct("approval")), U = /* @__PURE__ */ V(() => !!d(p) && !!d(O) && d(O).build === d(b));
  let ee = /* @__PURE__ */ Ee(!1);
  const X = /* @__PURE__ */ V(() => t.row.steps.filter((ce) => ce.state === "done").length), G = /* @__PURE__ */ V(() => a() ? a().kind === "approve" ? ew(Du(t.row, n()), { key: "slipway-action" }) ?? {
    label: "Approve",
    href: il(a()),
    key: "slipway-action"
  } : {
    label: o1(a()),
    href: il(a()),
    icon: tv,
    key: "slipway-action"
  } : null), se = /* @__PURE__ */ V(() => ({
    label: d(ee) ? "Hide details" : "Details",
    onclick: () => he(ee, !d(ee)),
    icon: _p,
    iconAfter: !0,
    iconTurn: d(ee),
    phoneOnly: !0,
    key: "slipway-details",
    data: { "aria-expanded": String(d(ee)) }
  })), de = /* @__PURE__ */ V(() => ({
    label: "Open rollout",
    href: t.row.href,
    desktopOnly: !0,
    key: "slipway-open"
  }));
  {
    const ce = (ze) => {
      {
        let Oe = /* @__PURE__ */ V(() => t.row.state === "deploying" ? "Deploying" : "Checking");
        pl(ze, {
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
            return d(Oe);
          }
        });
      }
    };
    let Q = /* @__PURE__ */ V(() => s() ? "card" : "hung"), fe = /* @__PURE__ */ V(() => r() ? 640 : 560), me = /* @__PURE__ */ V(() => s() ? "sw-nested" : ""), ve = /* @__PURE__ */ V(() => r() ? "sw-compact" : ""), Ne = /* @__PURE__ */ V(i), Ve = /* @__PURE__ */ V(() => d(o) ? "failed" : d(A) ? t.row.state === "checking" ? "checking" : "deploying" : "done"), _e = /* @__PURE__ */ V(() => d(ee) ? "open" : "closed"), Xe = /* @__PURE__ */ V(() => d(o) ? "failed" : "moving");
    lk(e, {
      get shell() {
        return d(Q);
      },
      get at() {
        return d(fe);
      },
      railWidth: "min(300px, 40%)",
      get class() {
        return `sw ${d(me) ?? ""} ${d(ve) ?? ""} ${d(Ne) ?? ""}`;
      },
      get state() {
        return d(Ve);
      },
      get rollup() {
        return `${d(X) ?? ""}/${t.row.steps.length ?? ""} steps`;
      },
      get label() {
        return `Deployment pipeline of ${t.row.app ?? ""}`;
      },
      get "data-more"() {
        return d(_e);
      },
      "data-slipway": "",
      get "data-state"() {
        return d(Xe);
      },
      rail: ce,
      children: (ze, Oe) => {
        var Qe = Hk(), H = N(Qe), oe = N(H), pe = N(oe), Ze = N(pe), en = I(pe, 2), Dn = N(en), bn = I(oe, 2);
        {
          var Je = (be) => {
            var Me = wk(), Re = N(Me);
            P(() => Y(Re, d(w).message)), M(be, Me);
          };
          D(bn, (be) => {
            r() && d(o) && d(w).message && be(Je);
          });
        }
        var je = I(bn, 2);
        {
          var Pt = (be) => {
            var Me = yk(), Re = ne(Me), Ue = N(Re), Ye = N(Ue);
            Ba(Ye, { class: "h-4 w-4 shrink-0 text-danger", "aria-hidden": "true" });
            var et = I(Ye), ft = N(et), kt = I(Ue, 2);
            {
              var Ie = (De) => {
                var Lt = kk(), Bt = N(Lt);
                P(() => Y(Bt, d(c).message)), M(De, Lt);
              };
              D(kt, (De) => {
                d(c).message && De(Ie);
              });
            }
            var qe = I(Re, 2), Ae = N(qe);
            $w(Ae, {
              get check() {
                return d(c);
              },
              danger: !0
            });
            var Le = I(Ae, 2);
            {
              var Te = (De) => {
                var Lt = _k(), Bt = N(Lt);
                P(() => Y(Bt, d(l).phrase)), M(De, Lt);
              };
              D(Le, (De) => {
                d(l)?.phrase && De(Te);
              });
            }
            P(() => Y(ft, d(c).name)), M(be, Me);
          };
          D(je, (be) => {
            d(o) && d(c) && !r() && be(Pt);
          });
        }
        var Et = I(je, 2);
        {
          var tn = (be) => {
            var Me = Ak();
            Tt(Me, 21, () => d(F), (Re) => Re.title, (Re, Ue) => {
              var Ye = Ck(), et = N(Ye), ft = I(et, 2), kt = N(ft), Ie = I(ft, 2);
              {
                var qe = (Le) => {
                  var Te = xk(), De = N(Te);
                  P(() => Y(De, d(Ue).label)), M(Le, Te);
                }, Ae = (Le) => {
                  var Te = Sk(), De = N(Te);
                  P(() => Y(De, d(Ue).label)), M(Le, Te);
                };
                D(Ie, (Le) => {
                  d(Ue).tone === "pending" ? Le(qe) : Le(Ae, !1);
                });
              }
              P(() => {
                ie(et, 1, `h-3 w-3 shrink-0 rounded-full ${B[d(Ue).tone] ?? ""}`, "svelte-lmha6v"), Y(kt, d(Ue).title);
              }), M(Re, Ye);
            }), M(be, Me);
          };
          D(Et, (be) => {
            d(o) || be(tn);
          });
        }
        var We = I(H, 2);
        {
          var ea = (be) => {
            var Me = Tk();
            let Re;
            var Ue = N(Me);
            pl(Ue, {
              get steps() {
                return t.row.steps;
              },
              layout: "strand",
              dup: !0
            }), P((Ye) => Re = ot(Me, "", Re, Ye), [
              () => ({
                "max-width": `${Math.max(2, t.row.steps.length) * 96}px`
              })
            ]), M(be, Me);
          };
          D(We, (be) => {
            r() || be(ea);
          });
        }
        var xr = I(We, 2), Sr = N(xr), _s = N(Sr);
        {
          var wn = (be) => {
            var Me = Ek(), Re = ne(Me), Ue = I(N(Re)), Ye = N(Ue), et = I(Re, 2), ft = I(N(et)), kt = N(ft);
            {
              let Ae = /* @__PURE__ */ V(() => Pu(t.row.tier));
              Ri(kt, {
                role: "env",
                get theme() {
                  return d(Ae);
                },
                get label() {
                  return d(Z).acts;
                },
                wide: !0
              });
            }
            var Ie = I(et, 2);
            {
              var qe = (Ae) => {
                var Le = Mk(), Te = I(N(Le)), De = N(Te);
                P(() => Y(De, `1 of ${d(Z).of ?? ""} regions`)), M(Ae, Le);
              };
              D(Ie, (Ae) => {
                d(Z).of > 1 && Ae(qe);
              });
            }
            P(() => Y(Ye, d(R))), M(be, Me);
          }, ys = (be) => {
            var Me = Rk(), Re = ne(Me);
            {
              var Ue = (Te) => {
                var De = Lk(), Lt = I(N(De)), Bt = N(Lt);
                P(() => Y(Bt, d(J))), M(Te, De);
              };
              D(Re, (Te) => {
                d(J) && Te(Ue);
              });
            }
            var Ye = I(Re, 2), et = N(Ye), ft = N(et), kt = I(et), Ie = N(kt), qe = N(Ie), Ae = I(Ye, 2);
            {
              var Le = (Te) => {
                var De = Nk(), Lt = N(De), Bt = N(Lt), xs = I(Lt), Cr = N(xs), Ss = N(Cr), ld = I(Cr), cd = N(ld);
                P(() => {
                  Y(Bt, d(j).label), Y(Ss, d(j).build), Y(cd, d(j).age);
                }), M(Te, De);
              };
              D(Ae, (Te) => {
                d(j) && Te(Le);
              });
            }
            P(() => {
              Y(ft, d(p) ? "Next build" : "Build"), Y(qe, d(b));
            }), M(be, Me);
          };
          D(_s, (be) => {
            d(Z) ? be(wn) : be(ys, !1);
          });
        }
        var td = I(Sr, 2), Ji = N(td);
        {
          var nd = (be) => {
            var Me = Fk(), Re = ne(Me), Ue = I(N(Re)), Ye = N(Ue), et = N(Ye), ft = I(Ye);
            {
              var kt = (Ae) => {
                var Le = Ok(), Te = N(Le);
                P(() => Y(Te, ` · ${d(O).value ?? ""}`)), M(Ae, Le);
              };
              D(ft, (Ae) => {
                d(U) && d(O) && Ae(kt);
              });
            }
            var Ie = I(Re, 2);
            {
              var qe = (Ae) => {
                var Le = Dk(), Te = N(Le), De = N(Te), Lt = I(Te), Bt = N(Lt), xs = N(Bt), Cr = I(Bt), Ss = N(Cr);
                P(() => {
                  Y(De, d(j).label), Y(xs, d(j).build), Y(Ss, d(j).age);
                }), M(Ae, Le);
              };
              D(Ie, (Ae) => {
                d(j) && Ae(qe);
              });
            }
            P(() => {
              $(Re, "data-slipway-facts", d(U) ? "" : void 0), Y(et, d(b));
            }), M(be, Me);
          };
          D(Ji, (be) => {
            d(Z) && be(nd);
          });
        }
        var eo = I(Ji, 2);
        {
          var ad = (be) => {
            var Me = Wk(), Re = I(N(Me), 2), Ue = N(Re);
            {
              var Ye = (Ie) => {
                var qe = Ik(), Ae = N(qe);
                P((Le) => Y(Ae, Le), [
                  () => d(p) ? d(p).title : ns(t.row)?.title ?? d(m).title
                ]), M(Ie, qe);
              };
              D(Ue, (Ie) => {
                (d(p) ? d(p).title : ns(t.row)?.title ?? d(m).title) && Ie(Ye);
              });
            }
            var et = I(Ue, 2);
            {
              var ft = (Ie) => {
                var qe = Pk(), Ae = N(qe);
                {
                  let De = /* @__PURE__ */ V(() => Cu(d(m).author));
                  hi(Ae, {
                    get name() {
                      return d(m).author;
                    },
                    get src() {
                      return d(De);
                    },
                    size: 20
                  });
                }
                var Le = I(Ae), Te = N(Le);
                P(() => Y(Te, d(m).author)), M(Ie, qe);
              }, kt = (Ie) => {
                var qe = le(), Ae = ne(qe);
                {
                  var Le = (Te) => {
                    var De = jk();
                    M(Te, De);
                  };
                  D(
                    Ae,
                    (Te) => {
                      d(x) && Te(Le);
                    },
                    !0
                  );
                }
                M(Ie, qe);
              };
              D(et, (Ie) => {
                d(m).author && !d(x) ? Ie(ft) : Ie(kt, !1);
              });
            }
            M(be, Me);
          };
          D(eo, (be) => {
            d(m) && be(ad);
          });
        }
        var rd = I(eo, 2);
        {
          var sd = (be) => {
            var Me = zk(), Re = N(Me), Ue = N(Re), Ye = I(Re), et = N(Ye);
            {
              var ft = (Ie) => {
                var qe = Bk(), Ae = ne(qe), Le = N(Ae), Te = I(Ae, 1, !0);
                Te.nodeValue = " ", P(() => Y(Le, d(O).build)), M(Ie, qe);
              };
              D(et, (Ie) => {
                d(O).build && Ie(ft);
              });
            }
            var kt = I(et, 1, !0);
            P(() => {
              Y(Ue, d(O).label), Y(kt, d(O).value);
            }), M(be, Me);
          };
          D(rd, (be) => {
            d(O) && !(d(Z) && d(U)) && be(sd);
          });
        }
        var id = I(xr, 2), od = N(id);
        {
          let be = /* @__PURE__ */ V(() => d(o) ? d(G) ?? void 0 : void 0), Me = /* @__PURE__ */ V(() => [
            ...r() ? [] : [d(se), d(de)],
            ...!d(o) && d(G) ? [{ ...d(G), lead: !0 }] : []
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
          ie(pe, 1, `${d(ae) && !r() && !d(o) ? "t-code-lg tabular-nums" : "t-heading"} text-fg`), Y(Ze, r() || d(o) ? d(E) : d(re)), Y(Dn, r() || d(o) ? d(S) : d(K));
        }), M(ze, Qe);
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
function hl(e) {
  const t = typeof e == "string" && e.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
  return t ? [parseFloat(t[1]), t[2] || "px"] : [
    /** @type {number} */
    e,
    "px"
  ];
}
function $u(e, { delay: t = 0, duration: n = 400, easing: a = Uk } = {}) {
  const r = +getComputedStyle(e).opacity;
  return {
    delay: t,
    duration: n,
    easing: a,
    css: (s) => `opacity: ${s * r}`
  };
}
function Qu(e, { delay: t = 0, duration: n = 400, easing: a = qk, x: r = 0, y: s = 0, opacity: i = 0 } = {}) {
  const o = getComputedStyle(e), l = +o.opacity, c = o.transform === "none" ? "" : o.transform, u = l * (1 - i), [f, p] = hl(r), [v, y] = hl(s);
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
  let n = q(t, "size", 3, "4"), a = q(t, "color", 3, "blue"), r = q(t, "class", 3, "");
  const s = /* @__PURE__ */ V(() => ({
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
  P(() => ie(o, 1, `inline-block shrink-0 animate-spin rounded-full ${d(s) ?? ""} ${d(i) ?? ""} ${r() ?? ""}`)), M(e, o), Ce();
}
let as = /* @__PURE__ */ Ee(0);
function $k() {
  he(as, d(as) + 1);
}
function Qk() {
  he(as, Math.max(0, d(as) - 1), !0);
}
var Zk = /* @__PURE__ */ W('<span class="text-fg-muted"> </span>'), Xk = /* @__PURE__ */ W(" <!>", 1), Jk = /* @__PURE__ */ W('<div class="shrink-0"><!></div>'), e_ = /* @__PURE__ */ W('<button type="button" class="btn btn-ghost btn-icon btn-xs -my-1 -mr-2" aria-label="Dismiss"><!></button>'), t_ = /* @__PURE__ */ W('<div style="box-shadow: var(--k-shadow-overlay)"><span><!></span> <div><!></div> <!> <!></div>');
function n_(e, t) {
  Se(t, !0);
  let n = q(t, "open", 15, !1), a = q(t, "tone", 3, "info"), r = q(t, "message", 3, ""), s = q(t, "dismissable", 3, !0), i = q(t, "floating", 3, !0), o = q(t, "description", 3, "");
  const l = {
    success: fs,
    danger: Ba,
    info: Kp
  }, c = {
    success: "text-success",
    danger: "text-danger",
    info: "text-fg-subtle",
    loading: "text-active"
  }, u = /* @__PURE__ */ V(() => a() === "loading" ? null : l[a()]);
  Ln(() => {
    if (n() && i())
      return Yt($k), () => Yt(Qk);
  });
  var f = le(), p = ne(f);
  {
    var v = (y) => {
      var b = t_(), g = N(b), m = N(g);
      {
        var x = (T) => {
          var F = le(), B = ne(F);
          Xs(B, () => d(u), (j, O) => {
            O(j, { class: "h-4 w-4" });
          }), M(T, F);
        }, h = (T) => {
          Yk(T, { size: "4", color: "blue" });
        };
        D(m, (T) => {
          d(u) ? T(x) : T(h, !1);
        });
      }
      var C = I(g, 2), _ = N(C);
      {
        var A = (T) => {
          var F = le(), B = ne(F);
          Un(B, () => t.children), M(T, F);
        }, E = (T) => {
          var F = Xk(), B = ne(F, !0), j = I(B);
          {
            var O = (z) => {
              var te = Zk(), ae = N(te);
              P(() => Y(ae, `· ${o() ?? ""}`)), M(z, te);
            };
            D(j, (z) => {
              o() && z(O);
            });
          }
          P(() => Y(B, r())), M(T, F);
        };
        D(_, (T) => {
          t.children ? T(A) : T(E, !1);
        });
      }
      var S = I(C, 2);
      {
        var w = (T) => {
          var F = Jk(), B = N(F);
          Un(B, () => t.action), M(T, F);
        };
        D(S, (T) => {
          t.action && T(w);
        });
      }
      var L = I(S, 2);
      {
        var k = (T) => {
          var F = e_();
          F.__click = () => n(!1);
          var B = N(F);
          Rp(B, { class: "h-3 w-3" }), M(T, F);
        };
        D(L, (T) => {
          s() && T(k);
        });
      }
      P(() => {
        $(b, "role", a() === "danger" ? "alert" : "status"), ie(b, 1, `${i() ? "fixed right-2 left-2 z-[60] top-[calc(env(safe-area-inset-top,0px)+4px)] sm:top-auto sm:right-4 sm:bottom-4 sm:left-auto sm:w-[380px]" : "relative w-full max-w-[380px]"} flex items-start gap-3 rounded-md bg-overlay px-4 py-3`), ie(g, 1, `mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center ${c[a()] ?? ""}`), ie(C, 1, `t-body min-w-0 flex-1 text-fg ${i() && a() !== "danger" ? "max-sm:truncate" : ""}`), $(C, "title", i() && a() !== "danger" && r() ? o() ? `${r()} · ${o()}` : r() : void 0);
      }), Gr(1, b, () => Qu, () => ({ y: 8, duration: 160, easing: Gk })), Gr(2, b, () => $u, () => ({ duration: 120 })), M(y, b);
    };
    D(p, (y) => {
      n() && y(v);
    });
  }
  M(e, f), Ce();
}
Wa(["click"]);
var a_ = /* @__PURE__ */ W('<div class="fixed inset-0 z-[69] bg-black/40" aria-hidden="true"></div>'), r_ = /* @__PURE__ */ W('<!> <div role="dialog" data-approve-confirm=""><div class="min-w-0"><div class="t-ui font-medium text-fg"> </div> <div class="t-meta mt-0.5 text-fg-muted"> </div></div> <div class="flex items-center justify-end gap-2"><button type="button" data-action="approve-cancel">Cancel</button> <button type="button" data-action="approve-confirm">Approve</button></div></div>', 1), s_ = /* @__PURE__ */ W('<button type="button" class="nav-link" data-action="approve-dismiss">Dismiss</button>'), i_ = /* @__PURE__ */ W('<button type="button" class="nav-link" data-action="approve-undo">Undo</button>'), o_ = /* @__PURE__ */ W("<!> <!>", 1);
function l_(e, t) {
  Se(t, !0);
  const n = /* @__PURE__ */ V(() => He.ask), a = /* @__PURE__ */ V(() => He.done);
  let r = /* @__PURE__ */ Ee(void 0), s = /* @__PURE__ */ Ee(1024), i = /* @__PURE__ */ Ee(800);
  const o = /* @__PURE__ */ V(() => d(s) < 640), l = /* @__PURE__ */ V(() => {
    const b = d(n)?.anchor;
    if (d(o) || !b) return "";
    const g = 320, m = Math.max(8, Math.min(b.right - g, d(s) - g - 8)), x = b.bottom + 8 + 150 < d(i);
    return `left:${m}px;width:${g}px;${x ? `top:${b.bottom + 8}px` : `bottom:${d(i) - b.top + 8}px`}`;
  });
  Ln(() => {
    d(n) && sc().then(() => d(r)?.querySelector('[data-action="approve-confirm"]')?.focus());
  }), np(() => {
    const b = (g) => {
      He.ask && d(r) && !d(r).contains(g.target) && !g.target.closest?.("[data-approve-open]") && zs();
    };
    return document.addEventListener("pointerdown", b, !0), () => document.removeEventListener("pointerdown", b, !0);
  });
  function c(b) {
    b.key === "Escape" && He.ask && (b.stopPropagation(), zs());
  }
  var u = o_();
  Qs("keydown", tr, c);
  var f = ne(u);
  {
    var p = (b) => {
      const g = /* @__PURE__ */ V(() => d(n).target);
      var m = r_(), x = ne(m);
      {
        var h = (F) => {
          var B = a_();
          Gr(3, B, () => $u, () => ({ duration: 120 })), M(F, B);
        };
        D(x, (F) => {
          d(o) && F(h);
        });
      }
      var C = I(x, 2), _ = N(C), A = N(_), E = N(A), S = I(A, 2), w = N(S), L = I(_, 2), k = N(L);
      k.__click = function(...F) {
        zs?.apply(this, F);
      };
      var T = I(k, 2);
      T.__click = () => X1(), An(C, (F) => he(r, F), () => d(r)), P(
        (F, B, j) => {
          $(C, "aria-modal", d(o) ? "true" : void 0), $(C, "aria-label", F), ie(C, 1, `fixed z-[70] flex flex-col gap-3 bg-overlay p-4 ${d(o) ? "inset-x-2 bottom-2 rounded-lg pb-[calc(env(safe-area-inset-bottom,0px)+16px)]" : "rounded-md"}`), ot(C, `box-shadow: var(--k-shadow-overlay); ${d(l) ?? ""}`), Y(E, B), Y(w, `${d(g).app ?? ""} · ${j ?? ""}`), ie(k, 1, `btn btn-secondary btn-sm ${d(o) ? "min-h-11 flex-1" : ""}`), ie(T, 1, `btn btn-primary btn-sm ${d(o) ? "min-h-11 flex-1" : ""}`);
        },
        [
          () => dl(d(g)),
          () => dl(d(g)),
          () => d(g).places.map((F) => F.label === "prod" ? "production" : F.label).join(", ")
        ]
      ), Gr(3, C, () => Qu, () => ({ y: d(o) ? 24 : 6, duration: 140 })), M(b, m);
    };
    D(f, (b) => {
      d(n) && b(p);
    });
  }
  var v = I(f, 2);
  {
    var y = (b) => {
      const g = /* @__PURE__ */ V(() => Q1(d(a).target));
      var m = () => !0, x = (h) => {
        h || pi();
      };
      {
        const h = (E) => {
          var S = le(), w = ne(S);
          {
            var L = (T) => {
              var F = s_();
              F.__click = function(...B) {
                pi?.apply(this, B);
              }, M(T, F);
            }, k = (T) => {
              var F = i_();
              F.__click = () => J1(), M(T, F);
            };
            D(w, (T) => {
              d(a).error ? T(L) : T(k, !1);
            });
          }
          M(E, S);
        };
        let C = /* @__PURE__ */ V(() => d(a).error ? "danger" : "success"), _ = /* @__PURE__ */ V(() => d(a).error ? `Could not approve ${d(a).target.build}` : `${d(g).title} · ${d(g).detail}`), A = /* @__PURE__ */ V(() => d(a).error ?? "");
        n_(b, {
          get open() {
            return m();
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
          action: h,
          $$slots: { action: !0 }
        });
      }
    };
    D(v, (b) => {
      d(a) && b(y);
    });
  }
  mo("innerWidth", (b) => he(s, b, !0)), mo("innerHeight", (b) => he(i, b, !0)), M(e, u), Ce();
}
Wa(["click"]);
const c_ = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD//gARTGF2YzU4LjEzNC4xMDAA/9sAQwAICAgJCAkLCwsLCwsNDA0NDQ0NDQ0NDQ0NDg4OERERDg4ODQ0ODhAQERESExIRERERExMUFBQYGBcXHBwdIiIp/8QAlQAAAQUBAQEAAAAAAAAAAAAAAwcFBAYCAQgAAQACAwEBAAAAAAAAAAAAAAADBAUBAgAGEAACAQMCAwYDBgUFAQEBAAACAQMABBEhBTFBEiJxYRMGUaGBkcHRQhQyUrEjM+HwFWKSgnLxc7IRAAICAQIFAwMFAQAAAAAAAAABAhEDQSExUTIEEnETgbGRYdHB4SKh8P/AABEIAIAAgAMBIgACEQADEQD/2gAMAwEAAhEDEQA/ADAqJWBoqVOCB8lRUq4KoqVcWdrKMU8dSz7ZqDf7hDaDgz6W+S1J9yWvzpOt29UG35Vv1RpPtFoj8UuOM97rMpqJpQbFKutxtbP+oeCxnoWpP5LWmc/UgZxFbkfeaH4JOkwtbue5uUJSEAm3l56nj3bL+Lp6RxSZGOUybz0iiJ8P3PXPj04S4a0F5ZaUg0cUddy2H6qKL+pbQj4fmRTx8xrtv6022SRBKihzjtdQyB82Dz8KT+82yWIOszk111LH3aVWTHpf+OqWWfOzTxx9D0lFLHOKOMxMXzF5VbxSFbFv9zs8iIGziylNCRaEP7gz+klyfD3pbLG9t9xto7iAuoJFle6fMSXJrg1R4T8vUBODiSGqxijVlqiAwTVYao+KG1XHERKipVhURVks2qgbnfBt1qUr1fAB9y+5cXTgqTr1be9dyMSLQOyllLtYyTbemOXyrM34o1BeToFauW/kkMybkJavj0p+3L/OFNQ7NNc3mATNCWF8+Orom23TN+RH+J4bHTvf2ZpYPT23BGItis1H5MlEphwqfoUsvRM02rixlJZRfd786iTeiL62/pEYf+eOa9DwQxtcFpRDhifJUNSlzCuGJbUzyoe33ttceXfySlHwySbD/sK5fOmbdLSK3J9Ajj/a213rOvxr1Fu2zW10LbAc0jm/+lV0kw0xnD+ytRzaMxPttrixIuDq9ejN6/JXH5WV4huCSFvhHLyz7I+HfiqXc2520hAaw18azDI4zz9fro+9PWmYyqmhOUbtM9LVyoW23Q3llbziXUpIxefHGvzTynU104J0crDrVYdWURlW0qyqKqo46tKQ31DcuXcrh5062u7V6fGlyazSDeoIjtt2vAaxmUiX/k9Vx8HQcvBBsXEevS4gVys6taJfR0uljKo+jHBqkD9JiR3yQ8EmyftS8beIqNFISEVzelRefqVEz2nS7LNHdmOmtGd0eMtU2Duu2xD2p4dP9w/fW3exXI5jNEn7Os00g/8AVvY5NOR5eXVb3A+sSXTprT+zCMdX3003l1a9LWR+FdVluhGN/wBr87JAu0stf541QnlPHBqlq3KNSCRhhrD4eypItxi8q5P2LtUziehG54q7QpHoHcCkhnsyekbUgeCL9S+RLPzpRG6Sb0BCbvLiVfpGNC/btP8AtSrupDH0ojsnUzLdYbrWawTogMGNFxQ1RVVHG0qTv11szkCPcIhyw/lz4X4fwm+7g3SjKoG8qb/TbjycdaFNZWU0msprmmqxPpf3CY+pLhbSE09Dw5luT/ahVPG4XUpkwO4LGSwPUgAR988vi+Spw9GW4ebdCQiDORNivw5HqwvrpVo3H09GXbGEZCyiwWgvHLg0n31EymvcfwTOPG3iXz9RJp7YwcZKQjEjJCpMpMgwyWP1jj3MBT5Ve/S1zPPcDA0xb5VIdkUk7a20RkLRyPDeOGExN5/41cth2mOzuISIBAsvCXLPL7lyq5SuqN48bjv87FT9Y7lNtKQfuyqSplf3iklcpRRius2RFoLeOrpFE0OWkm8LNK/63s1fbiMbw/LXXjvelU+eytIIlHLYnMxySk1Z5fFvDWfDTC5VcGomMqlN/YpgXVxbL+XcMtNNeoSXPH2p6027mTkKKR8SHX2zVmLa1dTEYQnAGiw9GT98a408c0071bK3GEVxTx9aNFpsVnGSQoHofb5LTbTlkFgVxJ1JPR+WkkLx46tVc3QbdMIIRby1GCb4ZaFZeFW26kEqSRHSds43Q26+boTdaMhE6Kqjp0YXVHIOq5OKOExfBi891fDWLqH8xbSxdTDrFiyXFJ8cVT4M0uKZVtqJ2W7TL8BqMxfJ9nD1+WKVu0kCYE21qqSM4/IkgXlSitRUpprrQYS+eNeCqz2m5sB6cvI1DZIuMt1wPQYJxkuOz3X4vQvkrtLdM30rHPFQbVlcSDKl0B1dlvi/GmW167uTrmPRcA+15qub7um+bZdtQAEtqh7KWhpfwePlmqSctA7cYLiOvqoJBuilhHzDNiP26ULbigu4AcgpFjVNaqkrv/V25XEoBGLRiWWsNa58eVXK3uzVtGyaCTpy3wyT1ee91qUWldAo5IOT32SXEf8AcwtoImw6Vo+VJBOS3Dd7KLiJXAZ/5Kn7ed6Nj0ap8PDvVN3pnbrq43O3ufKNwxsyKVrsZSeiLmWcaKjdvDexTvMieyFZdBJ0QnQG6kyHMt0Nuut0JuuKCqii6CqInXHEkXRRdR06Kqo0Q96a/J9eMsTFp+3v8KaLOYJCEsrXTudWK4AZLeVEsj0E38lxpNUctrM4849s81SPdwtr0+hIdpPxT5WXAJt4spikdtLPAvxREHX39JNVKuN6U0T8zadwLxYEX/8AANfGjbPuhnb+Wa6qb9xut4sCZWbMhf4CTa+q5d9KxejJSHhVu2n80VqU3KZSw7Jct6vMiYL4oahDHum5TZUIWYRLtAzZovknp9aLdbt6kv8AMTBRLg2Kf20Mpbjbrfpefcm3lkb93RPQDm9p9N1rtX8jRvIxwyjEnrGCZ657T1x8qUn05bFa7PbIlhmnK1/+j6l8MUjrnRXAnP2+uQWQ51JdWvyxpS7xTxXEEcsOPLMUwxphY4Y5Y4Ypzt40myL7mVnCdRiKim6jE6ZEzLKhsq43Q2644mp0ROo6da60PF1RaJadbcggsk0lTf57egp9/KgygRRM22+0l7/5mstmkh+hau7G+Yp9mLTPNdQ9T+lUrddv6+2v1KlM9LxQzWaB47ZSQy90g4/jjFVa+gK3klgkXbiJgXjjg/8AssOle7TTxy/H7j/Z04zjrxKVtu7SbbL/ADFkef8Aara/WdmIYftr2cumSeyjl0wtaqG5WNxZtsNR9nrSy8ZDPlOHB7FyuPVsHS/LjbJ80NUXeN5K5eOCXAftL7qaHdTSaar3qL5RGXi6KopbgpZJSBB1SSdT1xrmlV2beY7G0tYbhMY5Q645OQt8Ra9ueVSfq18uNpLVqrfvtn+Tt7C1f9SK3i6vAiTz/CmcDtZHyS+opnVKPNtl4U8cw9cZCYvmLyqARUntlNcWvajNrPFcvpVkg3gJMKVdL/cv0/2ovkLOI8MqE3WetEsppr3VYbrRmiW5n+FffQl1G9fjXRSLOM9//wB1raLo9l3usMIkSE448Dkc9/PwozYeUQiuPay8cV7Lj403xfzT6tdPbTHj31M0a06c8teb99Ptqix89LXArzwwupLqF810tP44+FTPWlswkg3IUvLmQxyY11x2Demj1Y/SqfZXjs9xGQdEbcZLv/vUvffWJXU1j6fC1GQLryxkuCTIh8x4DyRTSyHZIiefZKryQWXFWq2/T/TeKbx5L/78jJclntD8Kbry+jlg6T6eodNeLrcZyCiCRYMGQGuaIXhp/Omu5UEha9l1GxRJOWvMY3Anl441uK26XlqnDpHgOtaPAKiNgkOvpvaf9V3WEGsxwtTSPiuy+yPzf203+ob389vt3jPSBoEnpjpFLGOTzV+2u7tvR+0W9zeRSObc5vLEQS8wEQdkmm12QTXUuOXSUBJ59/czP8c8j45z2nj5U7Be3iS1k7l9tkJ5Zec70WyHoY/06csvSuMPCpGgR4Li9Wv719GOU8fSqYM5EcsOoFhc1y+jpzjuxPQ+y/hUUY21ngl8a55fVxTruBTVn//Z", Ke = "checkout-api", ml = "danielreed", st = Date.parse("2026-11-10T09:00:00Z"), u_ = 20, rs = (e) => st + e * u_ * 1e3, Wn = (e) => new Date(rs(e)).toISOString(), dt = 36e5, ss = 2, Zu = 19.4, on = {
  dev: { start: 2, check: 5, done: 8 },
  staging: { start: 8, check: 11, done: 14 },
  "us-east-1": { start: 19.4, check: 22, done: 24.5 },
  "us-east-2": { start: 24.5, check: 27, done: 30 },
  "eu-west-1": { start: 24.5, check: 27, done: 30 },
  "eu-central-1": { start: 24.5, check: 27, done: 30 },
  "ap-southeast-2": { start: 24.5, check: 27, done: 30 }
}, mi = 14, pr = (e, t, n) => ({ tag: `b-${e}`, version: `4.${e}.0-${e}`, revision: t, created: new Date(n).toISOString() }), Ge = { 44: "b44d3e19a0c7e5a1f2b8c9d04e6a7b1c2d3e4f50", 45: "b45a7c2e9d1f03b4a5c6d7e8f9a0b1c2d3e4f561", 46: "e1c7a04b8d2f19a3c5e7091b3d5f7a9c1e3b5d72" }, gl = pr(44, Ge[44], st - 30 * dt), Hs = pr(45, Ge[45], st - 4 * dt), Vs = () => pr(46, Ge[46], rs(ss) + 9e4), ya = [
  { ns: "checkout-api-dev", env: "dev", step: on.dev, bake: "1m", theme: "dev" },
  { ns: "checkout-api-staging", env: "staging", step: on.staging, bake: "1m", theme: "staging" },
  { ns: "checkout-api-prod-us-east-1", env: "prod", site: "us-east-1", wave: 1, step: on["us-east-1"], bake: "50s", theme: "prod" },
  { ns: "checkout-api-prod-us-east-2", env: "prod", site: "us-east-2", wave: 2, step: on["us-east-2"], bake: "1m", theme: "prod" },
  { ns: "checkout-api-prod-eu-west-1", env: "prod", site: "eu-west-1", wave: 2, step: on["eu-west-1"], bake: "1m", theme: "prod" },
  { ns: "checkout-api-prod-eu-central-1", env: "prod", site: "eu-central-1", wave: 2, step: on["eu-central-1"], bake: "1m", theme: "prod" },
  { ns: "checkout-api-prod-ap-southeast-2", env: "prod", site: "ap-southeast-2", wave: 2, step: on["ap-southeast-2"], bake: "1m", theme: "prod" }
], Tn = (e, t) => t < e.step.start ? "old" : t < e.step.check ? "deploying" : t < e.step.done ? "checking" : "done", zr = (e, t) => ({ name: e, allowedVersions: t, message: t.length ? "Gate is passing" : "Gate does not allow any release candidate" });
function d_(e, t, n) {
  const a = t >= ss, r = Tn(e, t), s = a ? [gl, Hs, Vs()] : [gl, Hs], i = r !== "old", o = i ? "b-46" : "b-45", l = [];
  if (i) {
    const p = r === "deploying" ? "Deploying" : r === "checking" ? "InProgress" : "Succeeded";
    l.push({
      id: 2,
      version: Vs(),
      timestamp: Wn(e.step.start),
      bakeStatus: p,
      triggeredBy: { kind: "System", name: "System" },
      ...r === "deploying" ? { bakeStartTime: Wn(e.step.start) } : { bakeStartTime: Wn(e.step.check) },
      ...r === "done" ? { bakeEndTime: Wn(e.step.done) } : {}
    });
  }
  l.push({ id: 1, version: Hs, timestamp: new Date(st - 3 * dt).toISOString(), bakeStatus: "Succeeded", bakeStartTime: new Date(st - 3 * dt).toISOString(), bakeEndTime: new Date(st - 3 * dt + 6e5).toISOString(), triggeredBy: { kind: "System", name: "System" } });
  const c = [], u = a ? ["b-46"] : [];
  if (e.env === "staging" && c.push(zr("promotion-staging", t >= on.dev.done ? u : [])), e.env === "prod") {
    const p = t >= Zu - 0.4, v = t >= mi, y = e.wave === 1 || t >= on["us-east-1"].done;
    c.push(zr(`promotion-prod-${e.site}`, v && y ? u : [])), v && c.push(zr("release-approval", p ? ["b-44", "b-45", ...u] : ["b-44", "b-45"]));
  }
  const f = i || !a || e.env === "prod" && t < mi ? [] : [Vs()];
  return {
    apiVersion: "kuberik.com/v1alpha1",
    kind: "Rollout",
    metadata: { name: Ke, namespace: e.ns, labels: { environment: e.site ? `${e.env}-${e.site}` : e.env }, annotations: { "rollout-dashboard.kuberik.com/source-cluster": e.env } },
    spec: { releasesImagePolicy: `${e.ns}/${Ke}`, versionHistoryLimit: 20, minBakeTime: "2m", bakeTime: e.bake, healthCheckSelector: { matchLabels: { app: Ke, env: e.site ? `${e.env}-${e.site}` : e.env } } },
    status: { source: "github.com/exampleco/checkout-api", wantedVersion: o, currentVersion: o, previousVersion: i ? "b-45" : "b-44", availableReleases: s, releaseCandidates: f, history: l, gates: c }
  };
}
function f_(e, t) {
  const n = Tn(e, t), a = n === "old" ? Ge[45] : Ge[46], r = ya.map((i) => ({ environment: i.env, site: i.site ?? "default", wave: i.wave ?? 1, revision: Tn(i, t) === "old" ? Ge[45] : Ge[46], bakeStatus: Tn(i, t) === "done" || Tn(i, t) === "old" ? "Succeeded" : Tn(i, t) === "checking" ? "InProgress" : "Deploying" })), s = (i, o, l) => ({ type: i, status: "True", reason: o, message: l, lastTransitionTime: Wn(0) });
  return {
    apiVersion: "environments.kuberik.com/v1alpha1",
    kind: "Environment",
    metadata: { name: Ke, namespace: e.ns, annotations: { "rollout-dashboard.kuberik.com/source-cluster": e.env } },
    spec: { environment: e.env, name: "checkout-api-service", rolloutRef: { name: Ke }, ...e.site ? { site: e.site, wave: e.wave } : {} },
    status: {
      ...e.env === "dev" ? {} : { rolloutGateRef: { name: e.env === "staging" ? "promotion-staging" : `promotion-prod-${e.site}` } },
      currentVersion: n === "old" ? "b-45" : "b-46",
      lastStatusChangeTime: n === "old" ? new Date(st - 3 * dt).toISOString() : Wn(e.step.start),
      wave: { site: e.site ?? "default", environment: e.env, name: "kuberik-checkout-api-service", wave: e.wave ?? 1, role: e.wave === 1 || !e.site ? "Leader" : "Follower", leader: e.site ? "us-east-1" : "default", selectedRevision: a, members: r },
      conditions: [s("WaveReady", "Ready", "site may deploy the allowed versions"), s("LockstepConsistent", "Consistent", "all members agree on lockstep")]
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
  metadata: { name: `checkout-api-${e.site}`, namespace: e.ns, annotations: { "rollout.kuberik.com/substitute.CHECKOUT_API_VERSION.from": Ke, "rollout-dashboard.kuberik.com/source-cluster": "prod" } },
  spec: {},
  status: { conditions: [], inventory: { entries: [{ id: `${e.ns}_checkout-api-canary-${e.site}_rollouts.kruise.io_Rollout` }] } }
});
function h_(e, t) {
  return ya.map((n) => {
    const a = Tn(n, e), r = (s) => {
      const i = t === s && a !== "old", o = i ? "Unhealthy" : a === "deploying" ? "Pending" : "Healthy";
      return {
        apiVersion: "kuberik.com/v1alpha1",
        kind: "HealthCheck",
        metadata: { name: `${Ke}-${s}`, namespace: n.ns, labels: { app: Ke }, annotations: { "kuberik.com/display-name": s } },
        spec: { class: "prometheus-alert" },
        status: { status: o, message: i ? "4.2% of requests failed, over a 1% budget" : "No alerts firing", lastChangeTime: Wn(a === "old" ? -60 : n.step.start) }
      };
    };
    return { metadata: { namespace: n.ns, name: Ke, annotations: { "rollout-dashboard.kuberik.com/source-cluster": n.env } }, healthChecks: [r("error-rate"), r("latency-p99")] };
  });
}
const er = "checkout-api", Us = (e, t, n, a, r, s) => ({
  owner: "exampleco",
  repo: er,
  kind: "pr",
  number: e,
  title: t,
  htmlUrl: `https://github.com/exampleco/${er}/pull/${e}`,
  author: n,
  mergedAt: new Date(a).toISOString(),
  mergeCommitSha: r,
  headSha: r,
  base: "main",
  changedFiles: s,
  containedIn: [r],
  containedInAll: !1
});
function m_(e) {
  const t = {}, n = (i, o, l) => ({ sha: i, message: o, author: l, commitDate: new Date(st - dt).toISOString() }), a = n(Ge[45], "#108 Show saved cards first", "liam-foster"), r = n(Ge[46], "#112 Add Apple Pay to checkout", "olivia-bennett"), s = n(Ge[44], "#101 Fix tax rounding on refunds", "noah-carter");
  for (const i of ya) {
    const o = `/api/rollouts/${i.ns}/${Ke}/commits`;
    t[`${o}?base=${Ge[44]}&head=${Ge[45]}`] = { commits: [a], additions: 38, deletions: 11, changedFiles: 4 }, t[`${o}?base=&head=${Ge[44]}`] = { commits: [s], additions: 21, deletions: 6, changedFiles: 2 }, t[`${o}?base=${Ge[45]}&head=${Ge[46]}`] = { commits: [r], additions: 142, deletions: 9, changedFiles: 6 };
  }
  return t[`/api/github/repos/exampleco/${er}/commits/${Ge[46]}`] = { subject: "#112 Add Apple Pay to checkout", author: "olivia-bennett" }, t[`/api/github/repos/exampleco/${er}/commits/${Ge[45]}`] = { subject: "#108 Show saved cards first", author: "liam-foster" }, t[`/api/github/repos/exampleco/${er}/commits/${Ge[44]}`] = { subject: "#101 Fix tax rounding on refunds", author: "noah-carter" }, t;
}
function g_() {
  const e = "billing-api-prod", t = pr(7, "a7a7a7a1c3e5092b4d6f8a0c2e4b6d8f0a2c4e61", st - 9 * dt), n = pr(8, "a8b8c8d1e3f5092b4d6f8a0c2e4b6d8f0a2c4e71", st - 5 * dt);
  return {
    rollout: {
      apiVersion: "kuberik.com/v1alpha1",
      kind: "Rollout",
      metadata: { name: "billing-api", namespace: e, labels: { environment: "prod" }, annotations: { "rollout-dashboard.kuberik.com/source-cluster": "prod" } },
      spec: { releasesImagePolicy: `${e}/billing-api`, versionHistoryLimit: 20, minBakeTime: "2m", bakeTime: "1m" },
      status: {
        source: "github.com/exampleco/billing-api",
        wantedVersion: "b-7",
        currentVersion: "b-7",
        previousVersion: "b-6",
        availableReleases: [t, n],
        releaseCandidates: [n],
        history: [{ id: 1, version: t, timestamp: new Date(st - 8 * dt).toISOString(), bakeStatus: "Succeeded", bakeStartTime: new Date(st - 8 * dt).toISOString(), bakeEndTime: new Date(st - 8 * dt + 6e4).toISOString(), triggeredBy: { kind: "System", name: "System" } }],
        gates: [zr("release-approval", ["b-7"])]
      }
    },
    env: { apiVersion: "environments.kuberik.com/v1alpha1", kind: "Environment", metadata: { name: "billing-api", namespace: e, annotations: { "rollout-dashboard.kuberik.com/source-cluster": "prod" } }, spec: { environment: "prod", name: "billing-api-service", rolloutRef: { name: "billing-api" } }, status: { currentVersion: "b-7", lastStatusChangeTime: new Date(st - 8 * dt).toISOString(), conditions: [] } }
  };
}
function b_(e) {
  const t = e >= ss, n = [
    Us(101, "Fix tax rounding on refunds", "noah-carter", st - 30 * dt, Ge[44], 2),
    Us(108, "Show saved cards first", "liam-foster", st - 4 * dt, Ge[45], 4),
    ...t ? [Us(112, "Add Apple Pay to checkout", "olivia-bennett", rs(ss), Ge[46], 6)] : []
  ], a = ya.filter((s) => s.env === "prod"), r = g_();
  return {
    rollouts: [...ya.map((s) => d_(s, e)), r.rollout],
    environments: [...ya.map((s) => f_(s, e)), r.env],
    rolloutDependencies: { items: [] },
    kustomizations: a.map(v_),
    kruiseRollouts: a.map((s) => p_(s, e)),
    changes: n,
    changesState: "ok",
    healthChecks: h_(e, null),
    github: { configured: !0, connected: !0, login: ml },
    me: ml,
    now: new Date(rs(e))
  };
}
Yd();
const w_ = {
  failed: "failed",
  "awaiting-approval": "held",
  "held-by-rule": "held",
  deploying: "deploying",
  checking: "checking"
}, bl = ["dev", "test", "staging", "other", "prod"];
function k_(e, t, n) {
  const a = e.app, r = e.newest, s = /* @__PURE__ */ new Map();
  for (const b of n) b.app === a && s.set(b.sha, Math.min(s.get(b.sha) ?? 1 / 0, b.t));
  const i = [...s.entries()].sort((b, g) => b[1] - g[1]).map(([b]) => b);
  r && !i.includes(r) && i.push(r);
  const o = r ? i.indexOf(r) : -1, l = (b) => {
    const g = b ? i.indexOf(b) : -1;
    return g < 0 || o < 0 ? 0 : Math.max(0, o - g);
  }, c = e.placeList.map((b) => {
    const g = b.tier === "prod" ? "prod" : b.tier === "dev" ? "dev" : b.tier === "test" ? "test" : "staging", m = w_[b.state] ?? (b.onNewest ? "newest" : l(b.version) > 0 ? "behind" : "newest"), x = lr(null, g);
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
      env: (g === "prod" ? b.label : hs(x) || b.label) || g,
      /* QA #11: an env-less place has a blank label; the tier names it, a box is never empty */
      state: m,
      behind: m === "behind" ? l(b.version) : 0
    };
  }), u = {};
  for (const b of c) (u[b.tier] ??= []).push(b);
  for (const b of bl) u[b]?.sort((g, m) => g.env.localeCompare(m.env));
  const f = u.prod ?? [], p = bl.filter((b) => b !== "prod").flatMap((b) => u[b] ?? []), v = c.reduce((b, g) => !b || nt.indexOf(g.state) < nt.indexOf(b.state) ? g : b, null), y = (t.apps.find((b) => b.app === a)?.envs ?? []).map((b) => b.arrivedAt).filter((b) => !!b).sort().at(-1) ?? null;
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
const __ = (e) => e < 8 ? "dev" : e < mi ? "staging" : e < Zu ? "ask" : e < 24.5 ? "wave1" : e < 30 ? "wave2" : "done", Bn = [
  { key: "merged", label: "Merged", from: 2, to: 4.9, settled: 2.2 },
  { key: "dev", label: "Dev", from: 5, to: 7.9, settled: 7.7 },
  { key: "staging", label: "Staging", from: 8, to: 13.9, settled: 13.7 },
  { key: "approval", label: "Approval", from: 14, to: 19.3, settled: 16 },
  { key: "production", label: "Production", from: 19.4, to: 34.4, settled: 33 }
], Xu = 36, y_ = (e) => Bn.findIndex((t) => e >= t.from && e <= t.to), x_ = 16;
function S_(e) {
  const t = r1("incident", e.tier, e.label).find((a) => a.app === Ke);
  if (t) return t;
  const n = ns({ app: Ke, href: e.href, version: e.runs });
  return {
    key: `${Ke}@${e.env}`,
    app: Ke,
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
    steps: Yi({ state: "healthy", pipeline: null }).map((a) => ({ ...a, state: "done" })),
    failure: null,
    place: e.place,
    deployedAt: n.at,
    regionsOf: null,
    stillChecking: !1
  };
}
function C_() {
  const t = Tu("incident").R.groups.flatMap((a) => a.rows).filter((a) => a.app === Ke), n = n1(Ke, "incident").filter((a) => !t.some((r) => r.href === a.href || r.regions.includes(a.label) && r.tier === a.tier)).map(S_);
  return { rows: [...t, ...n], approval: t.find((a) => a.group === "approval") ?? null };
}
function A_(e) {
  const { rows: t, approval: n } = C_(), a = __(e), r = (s) => t.find(s) ?? null;
  switch (a) {
    case "dev":
      return r((s) => s.tier === "dev");
    case "staging":
      return r((s) => s.tier === "staging");
    case "ask":
      return n ?? r((s) => s.tier === "prod");
    case "wave1":
      return r((s) => s.tier === "prod" && s.where === "us-east-1") ?? r((s) => s.tier === "prod");
    case "wave2":
      return r((s) => s.tier === "prod" && s.regions.length > 1 && s.group !== "held") ?? r((s) => s.tier === "prod" && s.group === "moving") ?? r((s) => s.tier === "prod");
    default:
      return r((s) => s.tier === "prod" && s.where === "us-east-1") ?? r((s) => s.tier === "prod");
  }
}
function T_(e) {
  const t = e.state === "awaiting-approval" || e.state === "held-by-rule", n = t ? yr(e) : null, a = ns(e), r = t ? null : Jb(e), s = n ? { title: n.title ?? "", who: n.author } : a.title ? { title: a.title, who: a.author } : null;
  return { build: n?.build ?? a.build, pill: r ? { word: r.word, role: r.role } : null, commit: s, age: ha(n ? n.since : a.at) };
}
function M_() {
  const e = Tu("incident"), t = e.items.find((n) => n.app === Ke);
  return t ? k_(t, e.R.c.m, e.R.c.events).lane : null;
}
const E_ = (e) => e.group === "approval" ? l1(e) : null, qs = (e) => Du(e, "incident"), wl = 0.15;
function L_(e) {
  const t = e < 17.5 || e >= 19.45 ? null : e < 18.3 ? "approve" : "confirm", n = e >= 18.1 && e < 18.1 + wl || e >= 19 && e < 19 + wl;
  return { target: t, visible: e >= 17.5 && e < 19.2, press: n, ask: e >= 18.2 && e < 19, done: e >= 19.05 && e < 25 };
}
var N_ = /* @__PURE__ */ W('<span class="svelte-19jcivb">Apps</span><span class="text-fg-disabled svelte-19jcivb" aria-hidden="true">/</span>', 1), R_ = /* @__PURE__ */ W('<!><span class="shrink-0 whitespace-nowrap svelte-19jcivb"> </span>', 1), O_ = /* @__PURE__ */ W('<span class="inline-flex shrink-0 items-center gap-2 whitespace-nowrap tabular-nums text-fg-subtle svelte-19jcivb"><!> </span>'), D_ = /* @__PURE__ */ W('<div class="t-meta flex min-w-0 items-center gap-x-3 text-fg-muted svelte-19jcivb" data-hero-commit=""><span class="flex min-w-0 items-center gap-2 svelte-19jcivb"><!> <!><span class="min-w-0 truncate text-fg-subtle max-sm:hidden svelte-19jcivb"> </span></span> <!></div>'), F_ = /* @__PURE__ */ W('<div class="min-w-0 svelte-19jcivb" data-hero-strip=""><!></div>'), I_ = /* @__PURE__ */ W('<header class="flex min-w-0 flex-col gap-3 px-4 pt-4 sm:px-6 sm:pt-5 svelte-19jcivb"><div class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 svelte-19jcivb"><!> <h1 class="t-title min-w-0 break-words text-fg svelte-19jcivb"> </h1> <span class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 max-sm:basis-full svelte-19jcivb"><span class="t-meta text-fg-disabled max-sm:hidden svelte-19jcivb" aria-hidden="true">/</span> <span class="t-code-lg shrink-0 text-fg svelte-19jcivb" data-hero-build=""> </span> <!></span></div> <!> <!></header> <div class="px-4 pb-4 pt-4 sm:px-6 sm:pb-6 svelte-19jcivb"><!></div>', 1), P_ = /* @__PURE__ */ W('<i class="hw-chip-fill svelte-19jcivb"></i>'), j_ = /* @__PURE__ */ W('<button type="button"><span class="hw-chip-dot svelte-19jcivb" aria-hidden="true"></span><span class="hw-chip-t svelte-19jcivb"> </span> <!></button>'), W_ = /* @__PURE__ */ ue('<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" class="svelte-19jcivb"><path d="M3.5 2h2.5v10H3.5zM8 2h2.5v10H8z" fill="currentColor" class="svelte-19jcivb"></path></svg>'), B_ = /* @__PURE__ */ ue('<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" class="svelte-19jcivb"><path d="M3.5 2l8 5-8 5z" fill="currentColor" class="svelte-19jcivb"></path></svg>'), z_ = /* @__PURE__ */ W('<button type="button" class="hw-play svelte-19jcivb"><!></button>'), H_ = /* @__PURE__ */ W('<div><div><div class="hw-bar t-ui-sm text-fg-muted svelte-19jcivb"><span class="hw-mark svelte-19jcivb" aria-hidden="true"></span> <!> <span class="text-fg svelte-19jcivb"> </span> <!></div> <div class="hw-body svelte-19jcivb" inert><!></div> <!> <span aria-hidden="true"><svg width="22" height="26" viewBox="0 0 22 26" class="svelte-19jcivb"><path d="M3 2l15 11.4-6.4 1.1 3.6 7.2-3.1 1.5-3.6-7.2L3 20z" fill="#121a20" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" class="svelte-19jcivb"></path></svg> <i class="hw-ring svelte-19jcivb"></i></span></div> <nav class="hw-chips t-label svelte-19jcivb" aria-label="Demo timeline"><!> <!></nav></div>');
function V_(e, t) {
  Se(t, !0);
  let n = /* @__PURE__ */ Ee(void 0), a = /* @__PURE__ */ Ee(1120);
  const r = /* @__PURE__ */ V(() => d(a) < 640), s = /* @__PURE__ */ V(() => t.t >= 0 ? A_(t.t) : null), i = /* @__PURE__ */ V(() => d(s) ? T_(d(s)) : null), o = /* @__PURE__ */ V(() => t.t >= 0 ? M_() : null), l = /* @__PURE__ */ V(() => {
    const Z = (d(s)?.href ?? "").split("/").filter(Boolean);
    return Z[0] === "rollouts" ? { ns: Z[2], name: Z[3] } : null;
  }), c = /* @__PURE__ */ V(() => d(s) ? E_(d(s)) : null), u = (Z) => Z.card.href ?? "", f = /* @__PURE__ */ V(() => t.reduced ? {
    target: null,
    visible: !1,
    press: !1,
    ask: !1,
    done: !1
  } : L_(t.t));
  let p = /* @__PURE__ */ Ee(jt({ x: 0, y: 0 })), v = /* @__PURE__ */ Ee(!1);
  function y(Z) {
    const R = d(n)?.getBoundingClientRect(), U = Z?.getBoundingClientRect();
    return R && U ? {
      top: U.top - R.top,
      left: U.left - R.left,
      right: U.right - R.left,
      bottom: U.bottom - R.top,
      w: U.width,
      h: U.height
    } : null;
  }
  Ln(() => {
    const { target: Z, ask: R, visible: U, done: ee } = d(f);
    Yt(() => {
      if (R && !He.ask && d(s)) {
        const X = qs(d(s)), G = y(d(n)?.querySelector("[data-approve-open]") ?? null);
        if (X && G) {
          const se = (d(n)?.clientHeight ?? 0) - G.bottom, de = window.innerHeight;
          He.ask = {
            target: X,
            anchor: se > 170 ? { top: G.top, left: G.left, right: G.right, bottom: G.bottom } : {
              top: de - (d(n)?.clientHeight ?? 0) + G.top,
              left: G.left,
              right: G.right,
              bottom: de
            }
          };
        }
      }
      if (!R && He.ask && (He.ask = null), ee && !He.done && d(s)) {
        const X = qs(d(s)) ?? b;
        X && (He.done = { target: X, error: null });
      }
      !ee && He.done && (He.done = null);
    }), (async () => {
      await sc();
      const X = Z === "approve" ? d(n)?.querySelector("[data-approve-open]") : Z === "confirm" ? d(n)?.querySelector('[data-action="approve-confirm"]') : null, G = y(X ?? null);
      U && G ? (he(p, { x: G.left + G.w * 0.62, y: G.top + G.h * 0.6 }, !0), he(v, !0)) : U && !d(v) && d(n) && (he(
        p,
        {
          x: d(n).clientWidth - 60,
          y: d(n).clientHeight - 50
        },
        !0
      ), he(v, !0)), U || he(v, !1);
    })();
  });
  let b = null;
  Ln(() => {
    d(s)?.group === "approval" && (b = qs(d(s)));
  });
  const g = /* @__PURE__ */ V(() => y_(t.t)), m = /* @__PURE__ */ V(() => d(g) < 0 ? 0 : Math.min(1, Math.max(0, (t.t - Bn[d(g)].from) / (Bn[d(g)].to - Bn[d(g)].from)))), x = /* @__PURE__ */ V(() => !t.reduced && t.t >= Xu - 0.5);
  var h = H_();
  let C;
  var _ = N(h);
  let A;
  var E = N(_), S = I(N(E), 2);
  {
    var w = (Z) => {
      var R = N_();
      M(Z, R);
    };
    D(S, (Z) => {
      d(r) || Z(w);
    });
  }
  var L = I(S, 2), k = N(L), T = I(L, 2);
  hi(T, {
    get name() {
      return ju;
    },
    get src() {
      return c_;
    },
    size: 20,
    class: "ml-auto"
  });
  var F = I(E, 2), B = N(F);
  {
    var j = (Z) => {
      var R = I_(), U = ne(R), ee = N(U), X = N(ee);
      {
        let Oe = /* @__PURE__ */ V(() => (d(r), 24));
        cw(X, {
          get name() {
            return Ke;
          },
          get size() {
            return d(Oe);
          }
        });
      }
      var G = I(X, 2), se = N(G), de = I(G, 2), ce = I(N(de), 2), Q = N(ce), fe = I(ce, 2);
      {
        var me = (Oe) => {
          {
            let Qe = /* @__PURE__ */ V(() => d(i).pill.word.toLowerCase());
            Ri(Oe, {
              get role() {
                return d(i).pill.role;
              },
              get label() {
                return d(Qe);
              },
              class: "shrink-0"
            });
          }
        };
        D(fe, (Oe) => {
          d(i).pill && Oe(me);
        });
      }
      var ve = I(ee, 2);
      {
        var Ne = (Oe) => {
          var Qe = D_(), H = N(Qe), oe = N(H);
          {
            var pe = (je) => {
              var Pt = R_(), Et = ne(Pt);
              {
                let ea = /* @__PURE__ */ V(() => Cu(d(i).commit.who));
                hi(Et, {
                  get name() {
                    return d(i).commit.who;
                  },
                  get src() {
                    return d(ea);
                  },
                  size: 16,
                  class: "shrink-0"
                });
              }
              var tn = I(Et), We = N(tn);
              P(() => Y(We, d(i).commit.who)), M(je, Pt);
            };
            D(oe, (je) => {
              d(i).commit.who && je(pe);
            });
          }
          var Ze = I(oe, 2);
          Ip(Ze, {
            class: "h-3.5 w-3.5 shrink-0 text-fg-disabled max-sm:hidden",
            "aria-hidden": "true"
          });
          var en = I(Ze), Dn = N(en), bn = I(H, 2);
          {
            var Je = (je) => {
              var Pt = O_(), Et = N(Pt);
              Cp(Et, { class: "h-3.5 w-3.5 shrink-0", "aria-hidden": "true" });
              var tn = I(Et);
              P(() => Y(tn, `${d(i).age ?? ""} ago`)), M(je, Pt);
            };
            D(bn, (je) => {
              d(i).age && je(Je);
            });
          }
          P(() => Y(Dn, d(i).commit.title)), M(Oe, Qe);
        };
        D(ve, (Oe) => {
          d(i).commit && Oe(Ne);
        });
      }
      var Ve = I(ve, 2);
      {
        var _e = (Oe) => {
          var Qe = F_(), H = N(Qe);
          {
            let oe = /* @__PURE__ */ V(() => !!d(s).needsYou);
            Gw(H, {
              get lane() {
                return d(o);
              },
              showApp: !1,
              words: !0,
              get yours() {
                return d(oe);
              },
              mutedRest: !0,
              hrefFor: u,
              get current() {
                return d(l);
              },
              youAreHere: !0
            });
          }
          M(Oe, Qe);
        };
        D(Ve, (Oe) => {
          d(o) && Oe(_e);
        });
      }
      var Xe = I(U, 2), ze = N(Xe);
      Vk(ze, {
        get row() {
          return d(s);
        },
        nested: !0,
        compact: !1,
        get action() {
          return d(c);
        }
      }), P(() => {
        Y(se, Ke), Y(Q, d(i).build);
      }), M(Z, R);
    };
    D(B, (Z) => {
      d(s) && d(i) && Z(j);
    });
  }
  var O = I(F, 2);
  l_(O, {});
  var z = I(O, 2);
  let te;
  var ae = I(_, 2), re = N(ae);
  Tt(re, 19, () => Bn, (Z) => Z.key, (Z, R, U) => {
    var ee = j_();
    let X;
    ee.__click = () => t.onseek(d(U));
    var G = I(N(ee)), se = N(G), de = I(G, 2);
    {
      var ce = (Q) => {
        var fe = P_();
        P(() => ot(fe, `transform: scaleX(${d(m) ?? ""})`)), M(Q, fe);
      };
      D(de, (Q) => {
        d(g) === d(U) && !t.reduced && Q(ce);
      });
    }
    P(() => {
      X = ie(ee, 1, "hw-chip svelte-19jcivb", null, X, { "hw-chip-on": d(g) === d(U) }), $(ee, "aria-current", d(g) === d(U) ? "step" : void 0), $(ee, "aria-label", `Demo: seek to ${d(R).label}`), Y(se, d(R).label);
    }), M(Z, ee);
  });
  var K = I(re, 2);
  {
    var J = (Z) => {
      var R = z_();
      R.__click = function(...G) {
        t.ontoggle?.apply(this, G);
      };
      var U = N(R);
      {
        var ee = (G) => {
          var se = W_();
          M(G, se);
        }, X = (G) => {
          var se = B_();
          M(G, se);
        };
        D(U, (G) => {
          t.playing ? G(ee) : G(X, !1);
        });
      }
      P(() => {
        $(R, "aria-label", t.playing ? "Pause demo" : "Play demo"), $(R, "aria-pressed", !t.playing);
      }), M(Z, R);
    };
    D(K, (Z) => {
      t.reduced || Z(J);
    });
  }
  An(h, (Z) => he(n, Z), () => d(n)), P(() => {
    C = ie(h, 1, "hw svelte-19jcivb", null, C, { "hw-narrow": d(r) }), A = ie(_, 1, "hw-frame svelte-19jcivb", null, A, { "hw-fade": d(x) }), Y(k, Ke), te = ie(z, 1, "hw-ptr svelte-19jcivb", null, te, {
      "hw-ptr-on": d(v) && d(f).visible,
      "hw-ptr-press": d(f).press
    }), ot(z, `transform: translate(${d(p).x ?? ""}px, ${d(p).y ?? ""}px)`);
  }), Yf(h, "clientWidth", (Z) => he(a, Z)), M(e, h), Ce();
}
Wa(["click"]);
class U_ {
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
    const a = this.playing, r = this.g[t];
    this.g[t] = n, t === "motion" && (n ? this.jump(0) : this.jump(this.o.rest)), t === "onscreen" && n && !r && this.g.motion && this.jump(0), this.sync(a);
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
function q_({ wrap: e, host: t, onGate: n }) {
  const a = Ku({ t: 0, playing: !1, reduced: !1, onseek: (o) => {
  }, ontoggle: () => {
  } });
  let r = NaN;
  const s = (o) => {
    o !== r && (tb(b_(o)), si.set(m_()), r = o, a.t = o, i && (a.playing = i.playing, a.reduced = i.reduced));
  };
  let i;
  return i = new U_({ loop: Xu, rest: x_, onTime: s }), s(0), a.onseek = (o) => {
    i.seek(i.reduced ? Bn[o].settled : Bn[o].from), a.playing = i.playing;
  }, a.ontoggle = () => {
    i.toggle(), a.playing = i.playing;
  }, dc(V_, { target: e, props: a }), n((o, l) => {
    i.gate(o, l), a.playing = i.playing, a.reduced = i.reduced, o === "motion" && !l && (He.ask = null);
  }), t.__hero = { at: (o) => {
    i.seek(o), i.playing && i.toggle();
  }, player: i }, () => i.destroy();
}
const Ju = {
  hero: { custom: q_ },
  "rollouts-list": { component: q1, initial: G1, beats: Uu, representative: K1, restMs: 3200 }
};
class G_ {
  // ms into the cycle when paused/at startedAt
  constructor(t) {
    if (this.gates = { onscreen: !1, visible: !0, motion: !0 }, this.idx = -1, this.timer = null, this.startedAt = 0, this.pos = 0, this.tick = () => {
      this.timer = null;
      const { beats: n } = this.o, a = (this.pos + (this.o.now() - this.startedAt)) % this.cycleMs;
      let r = -1;
      for (let i = 0; i < n.length; i++) n[i].at <= a && (r = i);
      r !== this.idx && this.show(r);
      const s = r + 1 < n.length ? n[r + 1].at : this.cycleMs;
      this.timer = this.o.setTimer(this.tick, Math.max(16, s - a));
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
function K_() {
  if (document.getElementById("kuberik-islands-fonts")) return;
  const e = (n) => new URL(`fonts/${n}`, ed).href, t = document.createElement("style");
  t.id = "kuberik-islands-fonts", t.textContent = `
@font-face{font-family:'Kuberik Inter';font-style:normal;font-display:swap;font-weight:100 900;src:url('${e("inter-latin-opsz.woff2")}') format('woff2-variations');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'Kuberik Inter';font-style:normal;font-display:swap;font-weight:100 900;src:url('${e("inter-latin-ext-opsz.woff2")}') format('woff2-variations');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:'Kuberik JetBrains Mono';font-style:normal;font-display:swap;font-weight:100 800;src:url('${e("jetbrains-mono-latin.woff2")}') format('woff2-variations')}`, document.head.appendChild(t);
}
let Y_ = null;
const $_ = () => Y_ ??= fetch(new URL("islands.css", ed), { cache: "no-cache" }).then((e) => e.text()).then((e) => {
  const t = new CSSStyleSheet();
  return t.replaceSync(e), t;
}), Q_ = () => document.documentElement.classList.contains("dark"), Fn = matchMedia("(prefers-reduced-motion: reduce)");
async function Z_(e) {
  const t = e.dataset.island, n = Ju[t];
  if (!n) {
    console.warn(`island "${t}" is not registered`);
    return;
  }
  const a = e.shadowRoot ?? e.attachShadow({ mode: "open" });
  a.adoptedStyleSheets = [await $_()];
  const r = document.createElement("div");
  if (r.className = "k-island", a.appendChild(r), e.hasAttribute("data-theme-sync")) {
    const c = () => r.classList.toggle("dark", Q_());
    c(), new MutationObserver(c).observe(document.documentElement, { attributes: !0, attributeFilter: ["class"] });
  }
  if ("custom" in n) {
    const c = [], u = (f, p) => c.forEach((v) => v(f, p));
    n.custom({ wrap: r, host: e, onGate: (f) => c.push(f) }), u("motion", !Fn.matches), u("visible", document.visibilityState === "visible"), Fn.addEventListener("change", () => u("motion", !Fn.matches)), document.addEventListener("visibilitychange", () => u("visible", document.visibilityState === "visible")), new IntersectionObserver((f) => u("onscreen", f[f.length - 1].isIntersecting), { threshold: 0.25 }).observe(e);
    return;
  }
  const s = Ku(n.initial);
  dc(n.component, { target: r, props: s });
  const i = new G_({ beats: n.beats, restMs: n.restMs, representative: n.representative, apply: (c) => Object.assign(s, c) });
  i.setGate("motion", !Fn.matches), Fn.addEventListener("change", () => {
    i.setGate("motion", !Fn.matches), l();
  }), new IntersectionObserver((c) => i.setGate("onscreen", c[c.length - 1].isIntersecting), { rootMargin: "80px" }).observe(e), document.addEventListener("visibilitychange", () => i.setGate("visible", document.visibilityState === "visible"));
  let o = null;
  function l() {
    o?.remove(), o = null, Fn.matches && (o = document.createElement("div"), o.className = "k-island-ctl", o.innerHTML = '<button class="btn btn-secondary" type="button">Next step</button>', o.querySelector("button").addEventListener("click", () => i.next()), a.appendChild(o));
  }
  l(), e.__timeline = i;
}
function gi(e = document) {
  K_(), e.querySelectorAll("[data-island]:not([data-island-mounted])").forEach((t) => {
    t.setAttribute("data-island-mounted", ""), Z_(t);
  });
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => gi()) : gi();
window.kuberikIslands = { mountAll: gi, registry: Ju };
export {
  gi as mountAll
};
