var ls = Array.isArray, Vo = Array.prototype.indexOf, Sr = Array.from, Uo = Object.defineProperty, fn = Object.getOwnPropertyDescriptor, Wo = Object.getOwnPropertyDescriptors, zo = Object.prototype, Go = Array.prototype, Ba = Object.getPrototypeOf, Bs = Object.isExtensible;
const qo = () => {
};
function Ko(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function ja() {
  var e, t, n = new Promise((r, s) => {
    e = r, t = s;
  });
  return { promise: n, resolve: e, reject: t };
}
const Ce = 2, cs = 4, us = 8, Pa = 1 << 24, St = 16, Ct = 32, Zt = 64, Cr = 128, Je = 512, Me = 1024, Ue = 2048, lt = 4096, Ve = 8192, bt = 16384, ds = 32768, zt = 65536, js = 1 << 17, Ha = 1 << 18, Cn = 1 << 19, Yo = 1 << 20, gt = 1 << 25, Gt = 32768, Zr = 1 << 21, fs = 1 << 22, Rt = 1 << 23, Pt = Symbol("$state"), Zo = Symbol("legacy props"), Xo = Symbol(""), ln = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
function Jo(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Qo() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function el(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function tl() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function nl(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function rl() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function sl(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function al() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function il() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function ol() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function ll() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const cl = 1, ul = 2, Va = 4, dl = 8, fl = 16, pl = 1, hl = 4, vl = 8, ml = 16, gl = 1, wl = 2, ye = Symbol(), _l = "http://www.w3.org/1999/xhtml", bl = "@attach";
function kl() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function yl() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
function Ua(e) {
  return e === this.v;
}
function Sl(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Wa(e) {
  return !Sl(e, this.v);
}
let Re = null;
function mn(e) {
  Re = e;
}
function Mn(e) {
  return (
    /** @type {T} */
    Cl().get(e)
  );
}
function Qe(e, t = !1, n) {
  Re = {
    p: Re,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    l: null
  };
}
function et(e) {
  var t = (
    /** @type {ComponentContext} */
    Re
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n)
      ii(r);
  }
  return t.i = !0, Re = t.p, /** @type {T} */
  {};
}
function za() {
  return !0;
}
function Cl(e) {
  return Re === null && Jo(), Re.c ??= new Map(Ml(Re) || void 0);
}
function Ml(e) {
  let t = e.p;
  for (; t !== null; ) {
    const n = t.c;
    if (n !== null)
      return n;
    t = t.p;
  }
  return null;
}
let cn = [];
function El() {
  var e = cn;
  cn = [], Ko(e);
}
function Xt(e) {
  if (cn.length === 0) {
    var t = cn;
    queueMicrotask(() => {
      t === cn && El();
    });
  }
  cn.push(e);
}
function Ga(e) {
  var t = ue;
  if (t === null)
    return oe.f |= Rt, e;
  if ((t.f & ds) === 0) {
    if ((t.f & Cr) === 0)
      throw e;
    t.b.error(e);
  } else
    gn(e, t);
}
function gn(e, t) {
  for (; t !== null; ) {
    if ((t.f & Cr) !== 0)
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
const Qn = /* @__PURE__ */ new Set();
let me = null, Ye = null, nt = [], ps = null, Xr = !1;
class st {
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
  #r = 0;
  /**
   * A deferred that resolves when the batch is committed, used with `settled()`
   * TODO replace with Promise.withResolvers once supported widely enough
   * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
   */
  #a = null;
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
    return this.is_fork || this.#r > 0;
  }
  /**
   *
   * @param {Effect[]} root_effects
   */
  process(t) {
    nt = [], this.apply();
    var n = {
      parent: null,
      effect: null,
      effects: [],
      render_effects: []
    };
    for (const r of t)
      this.#o(r, n);
    this.is_fork || this.#u(), this.is_deferred() ? (this.#l(n.effects), this.#l(n.render_effects)) : (me = null, Ps(n.render_effects), Ps(n.effects), this.#a?.resolve()), Ye = null;
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {EffectTarget} target
   */
  #o(t, n) {
    t.f ^= Me;
    for (var r = t.first; r !== null; ) {
      var s = r.f, a = (s & (Ct | Zt)) !== 0, i = a && (s & Me) !== 0, o = i || (s & Ve) !== 0 || this.skipped_effects.has(r);
      if ((r.f & Cr) !== 0 && r.b?.is_pending() && (n = {
        parent: n,
        effect: r,
        effects: [],
        render_effects: []
      }), !o && r.fn !== null) {
        a ? r.f ^= Me : (s & cs) !== 0 ? n.effects.push(r) : qn(r) && ((r.f & St) !== 0 && this.#s.add(r), Pn(r));
        var l = r.first;
        if (l !== null) {
          r = l;
          continue;
        }
      }
      var c = r.parent;
      for (r = r.next; r === null && c !== null; )
        c === n.effect && (this.#l(n.effects), this.#l(n.render_effects), n = /** @type {EffectTarget} */
        n.parent), r = c.next, c = c.parent;
    }
  }
  /**
   * @param {Effect[]} effects
   */
  #l(t) {
    for (const n of t)
      (n.f & Ue) !== 0 ? this.#s.add(n) : (n.f & lt) !== 0 && this.#i.add(n), this.#c(n.deps), Ee(n, Me);
  }
  /**
   * @param {Value[] | null} deps
   */
  #c(t) {
    if (t !== null)
      for (const n of t)
        (n.f & Ce) === 0 || (n.f & Gt) === 0 || (n.f ^= Gt, this.#c(
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
    this.previous.has(t) || this.previous.set(t, n), (t.f & Rt) === 0 && (this.current.set(t, t.v), Ye?.set(t, t.v));
  }
  activate() {
    me = this, this.apply();
  }
  deactivate() {
    me === this && (me = null, Ye = null);
  }
  flush() {
    if (this.activate(), nt.length > 0) {
      if (Tl(), me !== null && me !== this)
        return;
    } else this.#n === 0 && this.process([]);
    this.deactivate();
  }
  discard() {
    for (const t of this.#t) t(this);
    this.#t.clear();
  }
  #u() {
    if (this.#r === 0) {
      for (const t of this.#e) t();
      this.#e.clear();
    }
    this.#n === 0 && this.#d();
  }
  #d() {
    if (Qn.size > 1) {
      this.previous.clear();
      var t = Ye, n = !0, r = {
        parent: null,
        effect: null,
        effects: [],
        render_effects: []
      };
      for (const a of Qn) {
        if (a === this) {
          n = !1;
          continue;
        }
        const i = [];
        for (const [l, c] of this.current) {
          if (a.current.has(l))
            if (n && c !== a.current.get(l))
              a.current.set(l, c);
            else
              continue;
          i.push(l);
        }
        if (i.length === 0)
          continue;
        const o = [...a.current.keys()].filter((l) => !this.current.has(l));
        if (o.length > 0) {
          var s = nt;
          nt = [];
          const l = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Map();
          for (const u of i)
            qa(u, o, l, c);
          if (nt.length > 0) {
            me = a, a.apply();
            for (const u of nt)
              a.#o(u, r);
            a.deactivate();
          }
          nt = s;
        }
      }
      me = null, Ye = t;
    }
    this.committed = !0, Qn.delete(this);
  }
  /**
   *
   * @param {boolean} blocking
   */
  increment(t) {
    this.#n += 1, t && (this.#r += 1);
  }
  /**
   *
   * @param {boolean} blocking
   */
  decrement(t) {
    this.#n -= 1, t && (this.#r -= 1), this.revive();
  }
  revive() {
    for (const t of this.#s)
      this.#i.delete(t), Ee(t, Ue), qt(t);
    for (const t of this.#i)
      Ee(t, lt), qt(t);
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
    return (this.#a ??= ja()).promise;
  }
  static ensure() {
    if (me === null) {
      const t = me = new st();
      Qn.add(me), st.enqueue(() => {
        me === t && t.flush();
      });
    }
    return me;
  }
  /** @param {() => void} task */
  static enqueue(t) {
    Xt(t);
  }
  apply() {
  }
}
function Tl() {
  var e = Vt;
  Xr = !0;
  var t = null;
  try {
    var n = 0;
    for (hr(!0); nt.length > 0; ) {
      var r = st.ensure();
      if (n++ > 1e3) {
        var s, a;
        Nl();
      }
      r.process(nt), Lt.clear();
    }
  } finally {
    Xr = !1, hr(e), ps = null;
  }
}
function Nl() {
  try {
    rl();
  } catch (e) {
    gn(e, ps);
  }
}
let ht = null;
function Ps(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var r = e[n++];
      if ((r.f & (bt | Ve)) === 0 && qn(r) && (ht = /* @__PURE__ */ new Set(), Pn(r), r.deps === null && r.first === null && r.nodes === null && (r.teardown === null && r.ac === null ? di(r) : r.fn = null), ht?.size > 0)) {
        Lt.clear();
        for (const s of ht) {
          if ((s.f & (bt | Ve)) !== 0) continue;
          const a = [s];
          let i = s.parent;
          for (; i !== null; )
            ht.has(i) && (ht.delete(i), a.push(i)), i = i.parent;
          for (let o = a.length - 1; o >= 0; o--) {
            const l = a[o];
            (l.f & (bt | Ve)) === 0 && Pn(l);
          }
        }
        ht.clear();
      }
    }
    ht = null;
  }
}
function qa(e, t, n, r) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const s of e.reactions) {
      const a = s.f;
      (a & Ce) !== 0 ? qa(
        /** @type {Derived} */
        s,
        t,
        n,
        r
      ) : (a & (fs | St)) !== 0 && (a & Ue) === 0 && Ka(s, t, r) && (Ee(s, Ue), qt(
        /** @type {Effect} */
        s
      ));
    }
}
function Ka(e, t, n) {
  const r = n.get(e);
  if (r !== void 0) return r;
  if (e.deps !== null)
    for (const s of e.deps) {
      if (t.includes(s))
        return !0;
      if ((s.f & Ce) !== 0 && Ka(
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
function qt(e) {
  for (var t = ps = e; t.parent !== null; ) {
    t = t.parent;
    var n = t.f;
    if (Xr && t === ue && (n & St) !== 0 && (n & Ha) === 0)
      return;
    if ((n & (Zt | Ct)) !== 0) {
      if ((n & Me) === 0) return;
      t.f ^= Me;
    }
  }
  nt.push(t);
}
function Al(e) {
  let t = 0, n = Ft(0), r;
  return () => {
    Bn() && (k(n), oi(() => (t === 0 && (r = ws(() => e(() => rt(n)))), t += 1, () => {
      Xt(() => {
        t -= 1, t === 0 && (r?.(), r = void 0, rt(n));
      });
    })));
  };
}
var xl = zt | Cn | Cr;
function Rl(e, t, n) {
  new Ll(e, t, n);
}
class Ll {
  /** @type {Boundary | null} */
  parent;
  #e = !1;
  /** @type {TemplateNode} */
  #t;
  /** @type {TemplateNode | null} */
  #n = null;
  /** @type {BoundaryProps} */
  #r;
  /** @type {((anchor: Node) => void)} */
  #a;
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
  #h = !1;
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #p = null;
  #_ = Al(() => (this.#p = Ft(this.#d), () => {
    this.#p = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   */
  constructor(t, n, r) {
    this.#t = t, this.#r = n, this.#a = r, this.parent = /** @type {Effect} */
    ue.b, this.#e = !!this.#r.pending, this.#s = Er(() => {
      ue.b = this;
      {
        var s = this.#g();
        try {
          this.#i = De(() => r(s));
        } catch (a) {
          this.error(a);
        }
        this.#f > 0 ? this.#m() : this.#e = !1;
      }
      return () => {
        this.#u?.remove();
      };
    }, xl);
  }
  #b() {
    try {
      this.#i = De(() => this.#a(this.#t));
    } catch (t) {
      this.error(t);
    }
    this.#e = !1;
  }
  #k() {
    const t = this.#r.pending;
    t && (this.#o = De(() => t(this.#t)), st.enqueue(() => {
      var n = this.#g();
      this.#i = this.#v(() => (st.ensure(), De(() => this.#a(n)))), this.#f > 0 ? this.#m() : (Ht(
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
    return this.#e && (this.#u = Ot(), this.#t.before(this.#u), t = this.#u), t;
  }
  /**
   * Returns `true` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_pending() {
    return this.#e || !!this.parent && this.parent.is_pending();
  }
  has_pending_snippet() {
    return !!this.#r.pending;
  }
  /**
   * @param {() => Effect | null} fn
   */
  #v(t) {
    var n = ue, r = oe, s = Re;
    ct(this.#s), Ie(this.#s), mn(this.#s.ctx);
    try {
      return t();
    } catch (a) {
      return Ga(a), null;
    } finally {
      ct(n), Ie(r), mn(s);
    }
  }
  #m() {
    const t = (
      /** @type {(anchor: Node) => void} */
      this.#r.pending
    );
    this.#i !== null && (this.#c = document.createDocumentFragment(), this.#c.append(
      /** @type {TemplateNode} */
      this.#u
    ), hi(this.#i, this.#c)), this.#o === null && (this.#o = De(() => t(this.#t)));
  }
  /**
   * Updates the pending count associated with the currently visible pending snippet,
   * if any, such that we can replace the snippet with content once work is done
   * @param {1 | -1} d
   */
  #w(t) {
    if (!this.has_pending_snippet()) {
      this.parent && this.parent.#w(t);
      return;
    }
    this.#f += t, this.#f === 0 && (this.#e = !1, this.#o && Ht(this.#o, () => {
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
    this.#w(t), this.#d += t, this.#p && wn(this.#p, this.#d);
  }
  get_effect_pending() {
    return this.#_(), k(
      /** @type {Source<number>} */
      this.#p
    );
  }
  /** @param {unknown} error */
  error(t) {
    var n = this.#r.onerror;
    let r = this.#r.failed;
    if (this.#h || !n && !r)
      throw t;
    this.#i && (Se(this.#i), this.#i = null), this.#o && (Se(this.#o), this.#o = null), this.#l && (Se(this.#l), this.#l = null);
    var s = !1, a = !1;
    const i = () => {
      if (s) {
        yl();
        return;
      }
      s = !0, a && ll(), st.ensure(), this.#d = 0, this.#l !== null && Ht(this.#l, () => {
        this.#l = null;
      }), this.#e = this.has_pending_snippet(), this.#i = this.#v(() => (this.#h = !1, De(() => this.#a(this.#t)))), this.#f > 0 ? this.#m() : this.#e = !1;
    };
    var o = oe;
    try {
      Ie(null), a = !0, n?.(t, i), a = !1;
    } catch (l) {
      gn(l, this.#s && this.#s.parent);
    } finally {
      Ie(o);
    }
    r && Xt(() => {
      this.#l = this.#v(() => {
        st.ensure(), this.#h = !0;
        try {
          return De(() => {
            r(
              this.#t,
              () => t,
              () => i
            );
          });
        } catch (l) {
          return gn(
            l,
            /** @type {Effect} */
            this.#s.parent
          ), null;
        } finally {
          this.#h = !1;
        }
      });
    });
  }
}
function Ya(e, t, n, r) {
  const s = Mr;
  if (n.length === 0 && e.length === 0) {
    r(t.map(s));
    return;
  }
  var a = me, i = (
    /** @type {Effect} */
    ue
  ), o = Ol();
  function l() {
    Promise.all(n.map((c) => /* @__PURE__ */ Dl(c))).then((c) => {
      o();
      try {
        r([...t.map(s), ...c]);
      } catch (u) {
        (i.f & bt) === 0 && gn(u, i);
      }
      a?.deactivate(), pr();
    }).catch((c) => {
      gn(c, i);
    });
  }
  e.length > 0 ? Promise.all(e).then(() => {
    o();
    try {
      return l();
    } finally {
      a?.deactivate(), pr();
    }
  }) : l();
}
function Ol() {
  var e = ue, t = oe, n = Re, r = me;
  return function(a = !0) {
    ct(e), Ie(t), mn(n), a && r?.activate();
  };
}
function pr() {
  ct(null), Ie(null), mn(null);
}
// @__NO_SIDE_EFFECTS__
function Mr(e) {
  var t = Ce | Ue, n = oe !== null && (oe.f & Ce) !== 0 ? (
    /** @type {Derived} */
    oe
  ) : null;
  return ue !== null && (ue.f |= Cn), {
    ctx: Re,
    deps: null,
    effects: null,
    equals: Ua,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      ye
    ),
    wv: 0,
    parent: n ?? ue,
    ac: null
  };
}
// @__NO_SIDE_EFFECTS__
function Dl(e, t) {
  let n = (
    /** @type {Effect | null} */
    ue
  );
  n === null && Qo();
  var r = (
    /** @type {Boundary} */
    n.b
  ), s = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), a = Ft(
    /** @type {V} */
    ye
  ), i = !oe, o = /* @__PURE__ */ new Map();
  return zl(() => {
    var l = ja();
    s = l.promise;
    try {
      Promise.resolve(e()).then(l.resolve, l.reject).then(() => {
        c === me && c.committed && c.deactivate(), pr();
      });
    } catch (f) {
      l.reject(f), pr();
    }
    var c = (
      /** @type {Batch} */
      me
    );
    if (i) {
      var u = !r.is_pending();
      r.update_pending_count(1), c.increment(u), o.get(c)?.reject(ln), o.delete(c), o.set(c, l);
    }
    const d = (f, p = void 0) => {
      if (c.activate(), p)
        p !== ln && (a.f |= Rt, wn(a, p));
      else {
        (a.f & Rt) !== 0 && (a.f ^= Rt), wn(a, f);
        for (const [w, _] of o) {
          if (o.delete(w), w === c) break;
          _.reject(ln);
        }
      }
      i && (r.update_pending_count(-1), c.decrement(u));
    };
    l.promise.then(d, (f) => d(null, f || "unknown"));
  }), ai(() => {
    for (const l of o.values())
      l.reject(ln);
  }), new Promise((l) => {
    function c(u) {
      function d() {
        u === s ? l(a) : c(s);
      }
      u.then(d, d);
    }
    c(s);
  });
}
// @__NO_SIDE_EFFECTS__
function de(e) {
  const t = /* @__PURE__ */ Mr(e);
  return vi(t), t;
}
// @__NO_SIDE_EFFECTS__
function Za(e) {
  const t = /* @__PURE__ */ Mr(e);
  return t.equals = Wa, t;
}
function Xa(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      Se(
        /** @type {Effect} */
        t[n]
      );
  }
}
function Fl(e) {
  for (var t = e.parent; t !== null; ) {
    if ((t.f & Ce) === 0)
      return (t.f & bt) === 0 ? (
        /** @type {Effect} */
        t
      ) : null;
    t = t.parent;
  }
  return null;
}
function hs(e) {
  var t, n = ue;
  ct(Fl(e));
  try {
    e.f &= ~Gt, Xa(e), t = _i(e);
  } finally {
    ct(n);
  }
  return t;
}
function Ja(e) {
  var t = hs(e);
  if (e.equals(t) || (me?.is_fork || (e.v = t), e.wv = gi()), !Jt)
    if (Ye !== null)
      (Bn() || me?.is_fork) && Ye.set(e, t);
    else {
      var n = (e.f & Je) === 0 ? lt : Me;
      Ee(e, n);
    }
}
let Jr = /* @__PURE__ */ new Set();
const Lt = /* @__PURE__ */ new Map();
let Qa = !1;
function Ft(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: Ua,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function Ae(e, t) {
  const n = Ft(e);
  return vi(n), n;
}
// @__NO_SIDE_EFFECTS__
function Il(e, t = !1, n = !0) {
  const r = Ft(e);
  return t || (r.equals = Wa), r;
}
function _e(e, t, n = !1) {
  oe !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!at || (oe.f & js) !== 0) && za() && (oe.f & (Ce | St | fs | js)) !== 0 && !kt?.includes(e) && ol();
  let r = n ? wt(t) : t;
  return wn(e, r);
}
function wn(e, t) {
  if (!e.equals(t)) {
    var n = e.v;
    Jt ? Lt.set(e, t) : Lt.set(e, n), e.v = t;
    var r = st.ensure();
    r.capture(e, n), (e.f & Ce) !== 0 && ((e.f & Ue) !== 0 && hs(
      /** @type {Derived} */
      e
    ), Ee(e, (e.f & Je) !== 0 ? Me : lt)), e.wv = gi(), ei(e, Ue), ue !== null && (ue.f & Me) !== 0 && (ue.f & (Ct | Zt)) === 0 && (qe === null ? Kl([e]) : qe.push(e)), !r.is_fork && Jr.size > 0 && !Qa && $l();
  }
  return t;
}
function $l() {
  Qa = !1;
  var e = Vt;
  hr(!0);
  const t = Array.from(Jr);
  try {
    for (const n of t)
      (n.f & Me) !== 0 && Ee(n, lt), qn(n) && Pn(n);
  } finally {
    hr(e);
  }
  Jr.clear();
}
function rt(e) {
  _e(e, e.v + 1);
}
function ei(e, t) {
  var n = e.reactions;
  if (n !== null)
    for (var r = n.length, s = 0; s < r; s++) {
      var a = n[s], i = a.f, o = (i & Ue) === 0;
      if (o && Ee(a, t), (i & Ce) !== 0) {
        var l = (
          /** @type {Derived} */
          a
        );
        Ye?.delete(l), (i & Gt) === 0 && (i & Je && (a.f |= Gt), ei(l, lt));
      } else o && ((i & St) !== 0 && ht !== null && ht.add(
        /** @type {Effect} */
        a
      ), qt(
        /** @type {Effect} */
        a
      ));
    }
}
function wt(e) {
  if (typeof e != "object" || e === null || Pt in e)
    return e;
  const t = Ba(e);
  if (t !== zo && t !== Go)
    return e;
  var n = /* @__PURE__ */ new Map(), r = ls(e), s = /* @__PURE__ */ Ae(0), a = yt, i = (o) => {
    if (yt === a)
      return o();
    var l = oe, c = yt;
    Ie(null), Ws(a);
    var u = o();
    return Ie(l), Ws(c), u;
  };
  return r && n.set("length", /* @__PURE__ */ Ae(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(o, l, c) {
        (!("value" in c) || c.configurable === !1 || c.enumerable === !1 || c.writable === !1) && al();
        var u = n.get(l);
        return u === void 0 ? u = i(() => {
          var d = /* @__PURE__ */ Ae(c.value);
          return n.set(l, d), d;
        }) : _e(u, c.value, !0), !0;
      },
      deleteProperty(o, l) {
        var c = n.get(l);
        if (c === void 0) {
          if (l in o) {
            const u = i(() => /* @__PURE__ */ Ae(ye));
            n.set(l, u), rt(s);
          }
        } else
          _e(c, ye), rt(s);
        return !0;
      },
      get(o, l, c) {
        if (l === Pt)
          return e;
        var u = n.get(l), d = l in o;
        if (u === void 0 && (!d || fn(o, l)?.writable) && (u = i(() => {
          var p = wt(d ? o[l] : ye), w = /* @__PURE__ */ Ae(p);
          return w;
        }), n.set(l, u)), u !== void 0) {
          var f = k(u);
          return f === ye ? void 0 : f;
        }
        return Reflect.get(o, l, c);
      },
      getOwnPropertyDescriptor(o, l) {
        var c = Reflect.getOwnPropertyDescriptor(o, l);
        if (c && "value" in c) {
          var u = n.get(l);
          u && (c.value = k(u));
        } else if (c === void 0) {
          var d = n.get(l), f = d?.v;
          if (d !== void 0 && f !== ye)
            return {
              enumerable: !0,
              configurable: !0,
              value: f,
              writable: !0
            };
        }
        return c;
      },
      has(o, l) {
        if (l === Pt)
          return !0;
        var c = n.get(l), u = c !== void 0 && c.v !== ye || Reflect.has(o, l);
        if (c !== void 0 || ue !== null && (!u || fn(o, l)?.writable)) {
          c === void 0 && (c = i(() => {
            var f = u ? wt(o[l]) : ye, p = /* @__PURE__ */ Ae(f);
            return p;
          }), n.set(l, c));
          var d = k(c);
          if (d === ye)
            return !1;
        }
        return u;
      },
      set(o, l, c, u) {
        var d = n.get(l), f = l in o;
        if (r && l === "length")
          for (var p = c; p < /** @type {Source<number>} */
          d.v; p += 1) {
            var w = n.get(p + "");
            w !== void 0 ? _e(w, ye) : p in o && (w = i(() => /* @__PURE__ */ Ae(ye)), n.set(p + "", w));
          }
        if (d === void 0)
          (!f || fn(o, l)?.writable) && (d = i(() => /* @__PURE__ */ Ae(void 0)), _e(d, wt(c)), n.set(l, d));
        else {
          f = d.v !== ye;
          var _ = i(() => wt(c));
          _e(d, _);
        }
        var v = Reflect.getOwnPropertyDescriptor(o, l);
        if (v?.set && v.set.call(u, c), !f) {
          if (r && typeof l == "string") {
            var g = (
              /** @type {Source<number>} */
              n.get("length")
            ), y = Number(l);
            Number.isInteger(y) && y >= g.v && _e(g, y + 1);
          }
          rt(s);
        }
        return !0;
      },
      ownKeys(o) {
        k(s);
        var l = Reflect.ownKeys(o).filter((d) => {
          var f = n.get(d);
          return f === void 0 || f.v !== ye;
        });
        for (var [c, u] of n)
          u.v !== ye && !(c in o) && l.push(c);
        return l;
      },
      setPrototypeOf() {
        il();
      }
    }
  );
}
function Hs(e) {
  try {
    if (e !== null && typeof e == "object" && Pt in e)
      return e[Pt];
  } catch {
  }
  return e;
}
function Bl(e, t) {
  return Object.is(Hs(e), Hs(t));
}
var Vs, ti, ni, ri;
function jl() {
  if (Vs === void 0) {
    Vs = window, ti = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, n = Text.prototype;
    ni = fn(t, "firstChild").get, ri = fn(t, "nextSibling").get, Bs(e) && (e.__click = void 0, e.__className = void 0, e.__attributes = null, e.__style = void 0, e.__e = void 0), Bs(n) && (n.__t = void 0);
  }
}
function Ot(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function _n(e) {
  return (
    /** @type {TemplateNode | null} */
    ni.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function Gn(e) {
  return (
    /** @type {TemplateNode | null} */
    ri.call(e)
  );
}
function B(e, t) {
  return /* @__PURE__ */ _n(e);
}
function ce(e, t = !1) {
  {
    var n = /* @__PURE__ */ _n(e);
    return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Gn(n) : n;
  }
}
function ie(e, t = 1, n = !1) {
  let r = e;
  for (; t--; )
    r = /** @type {TemplateNode} */
    /* @__PURE__ */ Gn(r);
  return r;
}
function Pl(e) {
  e.textContent = "";
}
function si() {
  return !1;
}
function Hl(e, t) {
  if (t) {
    const n = document.body;
    e.autofocus = !0, Xt(() => {
      document.activeElement === n && e.focus();
    });
  }
}
function vs(e) {
  var t = oe, n = ue;
  Ie(null), ct(null);
  try {
    return e();
  } finally {
    Ie(t), ct(n);
  }
}
function Vl(e) {
  ue === null && (oe === null && nl(), tl()), Jt && el();
}
function Ul(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function dt(e, t, n) {
  var r = ue;
  r !== null && (r.f & Ve) !== 0 && (e |= Ve);
  var s = {
    ctx: Re,
    deps: null,
    nodes: null,
    f: e | Ue | Je,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: r,
    b: r && r.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  if (n)
    try {
      Pn(s), s.f |= ds;
    } catch (o) {
      throw Se(s), o;
    }
  else t !== null && qt(s);
  var a = s;
  if (n && a.deps === null && a.teardown === null && a.nodes === null && a.first === a.last && // either `null`, or a singular child
  (a.f & Cn) === 0 && (a = a.first, (e & St) !== 0 && (e & zt) !== 0 && a !== null && (a.f |= zt)), a !== null && (a.parent = r, r !== null && Ul(a, r), oe !== null && (oe.f & Ce) !== 0 && (e & Zt) === 0)) {
    var i = (
      /** @type {Derived} */
      oe
    );
    (i.effects ??= []).push(a);
  }
  return s;
}
function Bn() {
  return oe !== null && !at;
}
function ai(e) {
  const t = dt(us, null, !1);
  return Ee(t, Me), t.teardown = e, t;
}
function Br(e) {
  Vl();
  var t = (
    /** @type {Effect} */
    ue.f
  ), n = !oe && (t & Ct) !== 0 && (t & ds) === 0;
  if (n) {
    var r = (
      /** @type {ComponentContext} */
      Re
    );
    (r.e ??= []).push(e);
  } else
    return ii(e);
}
function ii(e) {
  return dt(cs | Yo, e, !1);
}
function Wl(e) {
  st.ensure();
  const t = dt(Zt | Cn, e, !0);
  return (n = {}) => new Promise((r) => {
    n.outro ? Ht(t, () => {
      Se(t), r(void 0);
    }) : (Se(t), r(void 0));
  });
}
function ms(e) {
  return dt(cs, e, !1);
}
function zl(e) {
  return dt(fs | Cn, e, !0);
}
function oi(e, t = 0) {
  return dt(us | t, e, !0);
}
function q(e, t = [], n = [], r = []) {
  Ya(r, t, n, (s) => {
    dt(us, () => e(...s.map(k)), !0);
  });
}
function Er(e, t = 0) {
  var n = dt(St | t, e, !0);
  return n;
}
function li(e, t = 0) {
  var n = dt(Pa | t, e, !0);
  return n;
}
function De(e) {
  return dt(Ct | Cn, e, !0);
}
function ci(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = Jt, r = oe;
    Us(!0), Ie(null);
    try {
      t.call(null);
    } finally {
      Us(n), Ie(r);
    }
  }
}
function ui(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const s = n.ac;
    s !== null && vs(() => {
      s.abort(ln);
    });
    var r = n.next;
    (n.f & Zt) !== 0 ? n.parent = null : Se(n, t), n = r;
  }
}
function Gl(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    (t.f & Ct) === 0 && Se(t), t = n;
  }
}
function Se(e, t = !0) {
  var n = !1;
  (t || (e.f & Ha) !== 0) && e.nodes !== null && e.nodes.end !== null && (ql(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), n = !0), ui(e, t && !n), vr(e, 0), Ee(e, bt);
  var r = e.nodes && e.nodes.t;
  if (r !== null)
    for (const a of r)
      a.stop();
  ci(e);
  var s = e.parent;
  s !== null && s.first !== null && di(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = null;
}
function ql(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : /* @__PURE__ */ Gn(e);
    e.remove(), e = n;
  }
}
function di(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Ht(e, t, n = !0) {
  var r = [];
  fi(e, r, !0);
  var s = () => {
    n && Se(e), t && t();
  }, a = r.length;
  if (a > 0) {
    var i = () => --a || s();
    for (var o of r)
      o.out(i);
  } else
    s();
}
function fi(e, t, n) {
  if ((e.f & Ve) === 0) {
    e.f ^= Ve;
    var r = e.nodes && e.nodes.t;
    if (r !== null)
      for (const o of r)
        (o.is_global || n) && t.push(o);
    for (var s = e.first; s !== null; ) {
      var a = s.next, i = (s.f & zt) !== 0 || // If this is a branch effect without a block effect parent,
      // it means the parent block effect was pruned. In that case,
      // transparency information was transferred to the branch effect.
      (s.f & Ct) !== 0 && (e.f & St) !== 0;
      fi(s, t, i ? n : !1), s = a;
    }
  }
}
function gs(e) {
  pi(e, !0);
}
function pi(e, t) {
  if ((e.f & Ve) !== 0) {
    e.f ^= Ve, (e.f & Me) === 0 && (Ee(e, Ue), qt(e));
    for (var n = e.first; n !== null; ) {
      var r = n.next, s = (n.f & zt) !== 0 || (n.f & Ct) !== 0;
      pi(n, s ? t : !1), n = r;
    }
    var a = e.nodes && e.nodes.t;
    if (a !== null)
      for (const i of a)
        (i.is_global || t) && i.in();
  }
}
function hi(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, r = e.nodes.end; n !== null; ) {
      var s = n === r ? null : /* @__PURE__ */ Gn(n);
      t.append(n), n = s;
    }
}
let Vt = !1;
function hr(e) {
  Vt = e;
}
let Jt = !1;
function Us(e) {
  Jt = e;
}
let oe = null, at = !1;
function Ie(e) {
  oe = e;
}
let ue = null;
function ct(e) {
  ue = e;
}
let kt = null;
function vi(e) {
  oe !== null && (kt === null ? kt = [e] : kt.push(e));
}
let xe = null, He = 0, qe = null;
function Kl(e) {
  qe = e;
}
let mi = 1, jn = 0, yt = jn;
function Ws(e) {
  yt = e;
}
function gi() {
  return ++mi;
}
function qn(e) {
  var t = e.f;
  if ((t & Ue) !== 0)
    return !0;
  if (t & Ce && (e.f &= ~Gt), (t & lt) !== 0) {
    var n = e.deps;
    if (n !== null)
      for (var r = n.length, s = 0; s < r; s++) {
        var a = n[s];
        if (qn(
          /** @type {Derived} */
          a
        ) && Ja(
          /** @type {Derived} */
          a
        ), a.wv > e.wv)
          return !0;
      }
    (t & Je) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    Ye === null && Ee(e, Me);
  }
  return !1;
}
function wi(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !kt?.includes(e))
    for (var s = 0; s < r.length; s++) {
      var a = r[s];
      (a.f & Ce) !== 0 ? wi(
        /** @type {Derived} */
        a,
        t,
        !1
      ) : t === a && (n ? Ee(a, Ue) : (a.f & Me) !== 0 && Ee(a, lt), qt(
        /** @type {Effect} */
        a
      ));
    }
}
function _i(e) {
  var t = xe, n = He, r = qe, s = oe, a = kt, i = Re, o = at, l = yt, c = e.f;
  xe = /** @type {null | Value[]} */
  null, He = 0, qe = null, oe = (c & (Ct | Zt)) === 0 ? e : null, kt = null, mn(e.ctx), at = !1, yt = ++jn, e.ac !== null && (vs(() => {
    e.ac.abort(ln);
  }), e.ac = null);
  try {
    e.f |= Zr;
    var u = (
      /** @type {Function} */
      e.fn
    ), d = u(), f = e.deps;
    if (xe !== null) {
      var p;
      if (vr(e, He), f !== null && He > 0)
        for (f.length = He + xe.length, p = 0; p < xe.length; p++)
          f[He + p] = xe[p];
      else
        e.deps = f = xe;
      if (Bn() && (e.f & Je) !== 0)
        for (p = He; p < f.length; p++)
          (f[p].reactions ??= []).push(e);
    } else f !== null && He < f.length && (vr(e, He), f.length = He);
    if (za() && qe !== null && !at && f !== null && (e.f & (Ce | lt | Ue)) === 0)
      for (p = 0; p < /** @type {Source[]} */
      qe.length; p++)
        wi(
          qe[p],
          /** @type {Effect} */
          e
        );
    return s !== null && s !== e && (jn++, qe !== null && (r === null ? r = qe : r.push(.../** @type {Source[]} */
    qe))), (e.f & Rt) !== 0 && (e.f ^= Rt), d;
  } catch (w) {
    return Ga(w);
  } finally {
    e.f ^= Zr, xe = t, He = n, qe = r, oe = s, kt = a, mn(i), at = o, yt = l;
  }
}
function Yl(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var r = Vo.call(n, e);
    if (r !== -1) {
      var s = n.length - 1;
      s === 0 ? n = t.reactions = null : (n[r] = n[s], n.pop());
    }
  }
  n === null && (t.f & Ce) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (xe === null || !xe.includes(t)) && (Ee(t, lt), (t.f & Je) !== 0 && (t.f ^= Je, t.f &= ~Gt), Xa(
    /** @type {Derived} **/
    t
  ), vr(
    /** @type {Derived} **/
    t,
    0
  ));
}
function vr(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t; r < n.length; r++)
      Yl(e, n[r]);
}
function Pn(e) {
  var t = e.f;
  if ((t & bt) === 0) {
    Ee(e, Me);
    var n = ue, r = Vt;
    ue = e, Vt = !0;
    try {
      (t & (St | Pa)) !== 0 ? Gl(e) : ui(e), ci(e);
      var s = _i(e);
      e.teardown = typeof s == "function" ? s : null, e.wv = mi;
      var a;
    } finally {
      Vt = r, ue = n;
    }
  }
}
function k(e) {
  var t = e.f, n = (t & Ce) !== 0;
  if (oe !== null && !at) {
    var r = ue !== null && (ue.f & bt) !== 0;
    if (!r && !kt?.includes(e)) {
      var s = oe.deps;
      if ((oe.f & Zr) !== 0)
        e.rv < jn && (e.rv = jn, xe === null && s !== null && s[He] === e ? He++ : xe === null ? xe = [e] : xe.includes(e) || xe.push(e));
      else {
        (oe.deps ??= []).push(e);
        var a = e.reactions;
        a === null ? e.reactions = [oe] : a.includes(oe) || a.push(oe);
      }
    }
  }
  if (Jt) {
    if (Lt.has(e))
      return Lt.get(e);
    if (n) {
      var i = (
        /** @type {Derived} */
        e
      ), o = i.v;
      return ((i.f & Me) === 0 && i.reactions !== null || ki(i)) && (o = hs(i)), Lt.set(i, o), o;
    }
  } else n && (!Ye?.has(e) || me?.is_fork && !Bn()) && (i = /** @type {Derived} */
  e, qn(i) && Ja(i), Vt && Bn() && (i.f & Je) === 0 && bi(i));
  if (Ye?.has(e))
    return Ye.get(e);
  if ((e.f & Rt) !== 0)
    throw e.v;
  return e.v;
}
function bi(e) {
  if (e.deps !== null) {
    e.f ^= Je;
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & Ce) !== 0 && (t.f & Je) === 0 && bi(
        /** @type {Derived} */
        t
      );
  }
}
function ki(e) {
  if (e.v === ye) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (Lt.has(t) || (t.f & Ce) !== 0 && ki(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function ws(e) {
  var t = at;
  try {
    return at = !0, e();
  } finally {
    at = t;
  }
}
const Zl = -7169;
function Ee(e, t) {
  e.f = e.f & Zl | t;
}
function Xl(e) {
  return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
const Jl = [
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
function Ql(e) {
  return Jl.includes(e);
}
const ec = {
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
function tc(e) {
  return e = e.toLowerCase(), ec[e] ?? e;
}
const nc = ["touchstart", "touchmove"];
function rc(e) {
  return nc.includes(e);
}
const yi = /* @__PURE__ */ new Set(), Qr = /* @__PURE__ */ new Set();
function sc(e, t, n, r = {}) {
  function s(a) {
    if (r.capture || Dn.call(t, a), !a.cancelBubble)
      return vs(() => n?.call(this, a));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Xt(() => {
    t.addEventListener(e, s, r);
  }) : t.addEventListener(e, s, r), s;
}
function Si(e) {
  for (var t = 0; t < e.length; t++)
    yi.add(e[t]);
  for (var n of Qr)
    n(e);
}
let zs = null;
function Dn(e) {
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, s = e.composedPath?.() || [], a = (
    /** @type {null | Element} */
    s[0] || e.target
  );
  zs = e;
  var i = 0, o = zs === e && e.__root;
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
  if (a = /** @type {Element} */
  s[i] || e.target, a !== t) {
    Uo(e, "currentTarget", {
      configurable: !0,
      get() {
        return a || n;
      }
    });
    var u = oe, d = ue;
    Ie(null), ct(null);
    try {
      for (var f, p = []; a !== null; ) {
        var w = a.assignedSlot || a.parentNode || /** @type {any} */
        a.host || null;
        try {
          var _ = a["__" + r];
          _ != null && (!/** @type {any} */
          a.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === a) && _.call(a, e);
        } catch (v) {
          f ? p.push(v) : f = v;
        }
        if (e.cancelBubble || w === t || w === null)
          break;
        a = w;
      }
      if (f) {
        for (let v of p)
          queueMicrotask(() => {
            throw v;
          });
        throw f;
      }
    } finally {
      e.__root = t, delete e.currentTarget, Ie(u), ct(d);
    }
  }
}
function Ci(e) {
  var t = document.createElement("template");
  return t.innerHTML = e.replaceAll("<!>", "<!---->"), t.content;
}
function mr(e, t) {
  var n = (
    /** @type {Effect} */
    ue
  );
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function ne(e, t) {
  var n = (t & gl) !== 0, r = (t & wl) !== 0, s, a = !e.startsWith("<!>");
  return () => {
    s === void 0 && (s = Ci(a ? e : "<!>" + e), n || (s = /** @type {TemplateNode} */
    /* @__PURE__ */ _n(s)));
    var i = (
      /** @type {TemplateNode} */
      r || ti ? document.importNode(s, !0) : s.cloneNode(!0)
    );
    if (n) {
      var o = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ _n(i)
      ), l = (
        /** @type {TemplateNode} */
        i.lastChild
      );
      mr(o, l);
    } else
      mr(i, i);
    return i;
  };
}
// @__NO_SIDE_EFFECTS__
function ac(e, t, n = "svg") {
  var r = !e.startsWith("<!>"), s = `<${n}>${r ? e : "<!>" + e}</${n}>`, a;
  return () => {
    if (!a) {
      var i = (
        /** @type {DocumentFragment} */
        Ci(s)
      ), o = (
        /** @type {Element} */
        /* @__PURE__ */ _n(i)
      );
      a = /** @type {Element} */
      /* @__PURE__ */ _n(o);
    }
    var l = (
      /** @type {TemplateNode} */
      a.cloneNode(!0)
    );
    return mr(l, l), l;
  };
}
// @__NO_SIDE_EFFECTS__
function pe(e, t) {
  return /* @__PURE__ */ ac(e, t, "svg");
}
function we() {
  var e = document.createDocumentFragment(), t = document.createComment(""), n = Ot();
  return e.append(t, n), mr(t, n), e;
}
function D(e, t) {
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function se(e, t) {
  var n = t == null ? "" : typeof t == "object" ? t + "" : t;
  n !== (e.__t ??= e.nodeValue) && (e.__t = n, e.nodeValue = n + "");
}
function ic(e, t) {
  return oc(e, t);
}
const en = /* @__PURE__ */ new Map();
function oc(e, { target: t, anchor: n, props: r = {}, events: s, context: a, intro: i = !0 }) {
  jl();
  var o = /* @__PURE__ */ new Set(), l = (d) => {
    for (var f = 0; f < d.length; f++) {
      var p = d[f];
      if (!o.has(p)) {
        o.add(p);
        var w = rc(p);
        t.addEventListener(p, Dn, { passive: w });
        var _ = en.get(p);
        _ === void 0 ? (document.addEventListener(p, Dn, { passive: w }), en.set(p, 1)) : en.set(p, _ + 1);
      }
    }
  };
  l(Sr(yi)), Qr.add(l);
  var c = void 0, u = Wl(() => {
    var d = n ?? t.appendChild(Ot());
    return Rl(
      /** @type {TemplateNode} */
      d,
      {
        pending: () => {
        }
      },
      (f) => {
        if (a) {
          Qe({});
          var p = (
            /** @type {ComponentContext} */
            Re
          );
          p.c = a;
        }
        s && (r.$$events = s), c = e(f, r) || {}, a && et();
      }
    ), () => {
      for (var f of o) {
        t.removeEventListener(f, Dn);
        var p = (
          /** @type {number} */
          en.get(f)
        );
        --p === 0 ? (document.removeEventListener(f, Dn), en.delete(f)) : en.set(f, p);
      }
      Qr.delete(l), d !== n && d.parentNode?.removeChild(d);
    };
  });
  return lc.set(c, u), c;
}
let lc = /* @__PURE__ */ new WeakMap();
class Mi {
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
  #r = /* @__PURE__ */ new Set();
  /**
   * Whether to pause (i.e. outro) on change, or destroy immediately.
   * This is necessary for `<svelte:element>`
   */
  #a = !0;
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(t, n = !0) {
    this.anchor = t, this.#a = n;
  }
  #s = () => {
    var t = (
      /** @type {Batch} */
      me
    );
    if (this.#e.has(t)) {
      var n = (
        /** @type {Key} */
        this.#e.get(t)
      ), r = this.#t.get(n);
      if (r)
        gs(r), this.#r.delete(n);
      else {
        var s = this.#n.get(n);
        s && (this.#t.set(n, s.effect), this.#n.delete(n), s.fragment.lastChild.remove(), this.anchor.before(s.fragment), r = s.effect);
      }
      for (const [a, i] of this.#e) {
        if (this.#e.delete(a), a === t)
          break;
        const o = this.#n.get(i);
        o && (Se(o.effect), this.#n.delete(i));
      }
      for (const [a, i] of this.#t) {
        if (a === n || this.#r.has(a)) continue;
        const o = () => {
          if (Array.from(this.#e.values()).includes(a)) {
            var c = document.createDocumentFragment();
            hi(i, c), c.append(Ot()), this.#n.set(a, { effect: i, fragment: c });
          } else
            Se(i);
          this.#r.delete(a), this.#t.delete(a);
        };
        this.#a || !r ? (this.#r.add(a), Ht(i, o, !1)) : o();
      }
    }
  };
  /**
   * @param {Batch} batch
   */
  #i = (t) => {
    this.#e.delete(t);
    const n = Array.from(this.#e.values());
    for (const [r, s] of this.#n)
      n.includes(r) || (Se(s.effect), this.#n.delete(r));
  };
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(t, n) {
    var r = (
      /** @type {Batch} */
      me
    ), s = si();
    if (n && !this.#t.has(t) && !this.#n.has(t))
      if (s) {
        var a = document.createDocumentFragment(), i = Ot();
        a.append(i), this.#n.set(t, {
          effect: De(() => n(i)),
          fragment: a
        });
      } else
        this.#t.set(
          t,
          De(() => n(this.anchor))
        );
    if (this.#e.set(r, t), s) {
      for (const [o, l] of this.#t)
        o === t ? r.skipped_effects.delete(l) : r.skipped_effects.add(l);
      for (const [o, l] of this.#n)
        o === t ? r.skipped_effects.delete(l.effect) : r.skipped_effects.add(l.effect);
      r.oncommit(this.#s), r.ondiscard(this.#i);
    } else
      this.#s();
  }
}
function Y(e, t, n = !1) {
  var r = new Mi(e), s = n ? zt : 0;
  function a(i, o) {
    r.ensure(i, o);
  }
  Er(() => {
    var i = !1;
    t((o, l = !0) => {
      i = !0, a(l, o);
    }), i || a(!1, null);
  }, s);
}
function Ei(e, t) {
  return t;
}
function cc(e, t, n) {
  for (var r = [], s = t.length, a, i = t.length, o = 0; o < s; o++) {
    let d = t[o];
    Ht(
      d,
      () => {
        if (a) {
          if (a.pending.delete(d), a.done.add(d), a.pending.size === 0) {
            var f = (
              /** @type {Set<EachOutroGroup>} */
              e.outrogroups
            );
            es(Sr(a.done)), f.delete(a), f.size === 0 && (e.outrogroups = null);
          }
        } else
          i -= 1;
      },
      !1
    );
  }
  if (i === 0) {
    var l = r.length === 0 && n !== null;
    if (l) {
      var c = (
        /** @type {Element} */
        n
      ), u = (
        /** @type {Element} */
        c.parentNode
      );
      Pl(u), u.append(c), e.items.clear();
    }
    es(t, !l);
  } else
    a = {
      pending: new Set(t),
      done: /* @__PURE__ */ new Set()
    }, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function es(e, t = !0) {
  for (var n = 0; n < e.length; n++)
    Se(e[n], t);
}
var Gs;
function Hn(e, t, n, r, s, a = null) {
  var i = e, o = /* @__PURE__ */ new Map(), l = (t & Va) !== 0;
  if (l) {
    var c = (
      /** @type {Element} */
      e
    );
    i = c.appendChild(Ot());
  }
  var u = null, d = /* @__PURE__ */ Za(() => {
    var g = n();
    return ls(g) ? g : g == null ? [] : Sr(g);
  }), f, p = !0;
  function w() {
    v.fallback = u, uc(v, f, i, t, r), u !== null && (f.length === 0 ? (u.f & gt) === 0 ? gs(u) : (u.f ^= gt, Fn(u, null, i)) : Ht(u, () => {
      u = null;
    }));
  }
  var _ = Er(() => {
    f = /** @type {V[]} */
    k(d);
    for (var g = f.length, y = /* @__PURE__ */ new Set(), h = (
      /** @type {Batch} */
      me
    ), E = si(), C = 0; C < g; C += 1) {
      var b = f[C], T = r(b, C), A = p ? null : o.get(T);
      A ? (A.v && wn(A.v, b), A.i && wn(A.i, C), E && h.skipped_effects.delete(A.e)) : (A = dc(
        o,
        p ? i : Gs ??= Ot(),
        b,
        T,
        C,
        s,
        t,
        n
      ), p || (A.e.f |= gt), o.set(T, A)), y.add(T);
    }
    if (g === 0 && a && !u && (p ? u = De(() => a(i)) : (u = De(() => a(Gs ??= Ot())), u.f |= gt)), !p)
      if (E) {
        for (const [S, P] of o)
          y.has(S) || h.skipped_effects.add(P.e);
        h.oncommit(w), h.ondiscard(() => {
        });
      } else
        w();
    k(d);
  }), v = { effect: _, items: o, outrogroups: null, fallback: u };
  p = !1;
}
function uc(e, t, n, r, s) {
  var a = (r & dl) !== 0, i = t.length, o = e.items, l = e.effect.first, c, u = null, d, f = [], p = [], w, _, v, g;
  if (a)
    for (g = 0; g < i; g += 1)
      w = t[g], _ = s(w, g), v = /** @type {EachItem} */
      o.get(_).e, (v.f & gt) === 0 && (v.nodes?.a?.measure(), (d ??= /* @__PURE__ */ new Set()).add(v));
  for (g = 0; g < i; g += 1) {
    if (w = t[g], _ = s(w, g), v = /** @type {EachItem} */
    o.get(_).e, e.outrogroups !== null)
      for (const P of e.outrogroups)
        P.pending.delete(v), P.done.delete(v);
    if ((v.f & gt) !== 0)
      if (v.f ^= gt, v === l)
        Fn(v, null, n);
      else {
        var y = u ? u.next : l;
        v === e.effect.last && (e.effect.last = v.prev), v.prev && (v.prev.next = v.next), v.next && (v.next.prev = v.prev), Et(e, u, v), Et(e, v, y), Fn(v, y, n), u = v, f = [], p = [], l = u.next;
        continue;
      }
    if ((v.f & Ve) !== 0 && (gs(v), a && (v.nodes?.a?.unfix(), (d ??= /* @__PURE__ */ new Set()).delete(v))), v !== l) {
      if (c !== void 0 && c.has(v)) {
        if (f.length < p.length) {
          var h = p[0], E;
          u = h.prev;
          var C = f[0], b = f[f.length - 1];
          for (E = 0; E < f.length; E += 1)
            Fn(f[E], h, n);
          for (E = 0; E < p.length; E += 1)
            c.delete(p[E]);
          Et(e, C.prev, b.next), Et(e, u, C), Et(e, b, h), l = h, u = b, g -= 1, f = [], p = [];
        } else
          c.delete(v), Fn(v, l, n), Et(e, v.prev, v.next), Et(e, v, u === null ? e.effect.first : u.next), Et(e, u, v), u = v;
        continue;
      }
      for (f = [], p = []; l !== null && l !== v; )
        (c ??= /* @__PURE__ */ new Set()).add(l), p.push(l), l = l.next;
      if (l === null)
        continue;
    }
    (v.f & gt) === 0 && f.push(v), u = v, l = v.next;
  }
  if (e.outrogroups !== null) {
    for (const P of e.outrogroups)
      P.pending.size === 0 && (es(Sr(P.done)), e.outrogroups?.delete(P));
    e.outrogroups.size === 0 && (e.outrogroups = null);
  }
  if (l !== null || c !== void 0) {
    var T = [];
    if (c !== void 0)
      for (v of c)
        (v.f & Ve) === 0 && T.push(v);
    for (; l !== null; )
      (l.f & Ve) === 0 && l !== e.fallback && T.push(l), l = l.next;
    var A = T.length;
    if (A > 0) {
      var S = (r & Va) !== 0 && i === 0 ? n : null;
      if (a) {
        for (g = 0; g < A; g += 1)
          T[g].nodes?.a?.measure();
        for (g = 0; g < A; g += 1)
          T[g].nodes?.a?.fix();
      }
      cc(e, T, S);
    }
  }
  a && Xt(() => {
    if (d !== void 0)
      for (v of d)
        v.nodes?.a?.apply();
  });
}
function dc(e, t, n, r, s, a, i, o) {
  var l = (i & cl) !== 0 ? (i & fl) === 0 ? /* @__PURE__ */ Il(n, !1, !1) : Ft(n) : null, c = (i & ul) !== 0 ? Ft(s) : null;
  return {
    v: l,
    i: c,
    e: De(() => (a(t, l ?? n, c ?? s, o), () => {
      e.delete(r);
    }))
  };
}
function Fn(e, t, n) {
  if (e.nodes)
    for (var r = e.nodes.start, s = e.nodes.end, a = t && (t.f & gt) === 0 ? (
      /** @type {EffectNodes} */
      t.nodes.start
    ) : n; r !== null; ) {
      var i = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Gn(r)
      );
      if (a.before(r), r === s)
        return;
      r = i;
    }
}
function Et(e, t, n) {
  t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function Ti(e, t, ...n) {
  var r = new Mi(e);
  Er(() => {
    const s = t() ?? null;
    r.ensure(s, s && ((a) => s(a, ...n)));
  }, zt);
}
function fc(e, t) {
  var n = void 0, r;
  li(() => {
    n !== (n = t()) && (r && (Se(r), r = null), n && (r = De(() => {
      ms(() => (
        /** @type {(node: Element) => void} */
        n(e)
      ));
    })));
  });
}
function Ni(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var s = e.length;
    for (t = 0; t < s; t++) e[t] && (n = Ni(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function Ai() {
  for (var e, t, n = 0, r = "", s = arguments.length; n < s; n++) (e = arguments[n]) && (t = Ni(e)) && (r && (r += " "), r += t);
  return r;
}
function xi(e) {
  return typeof e == "object" ? Ai(e) : e ?? "";
}
const qs = [...` 	
\r\f \v\uFEFF`];
function pc(e, t, n) {
  var r = e == null ? "" : "" + e;
  if (t && (r = r ? r + " " + t : t), n) {
    for (var s in n)
      if (n[s])
        r = r ? r + " " + s : s;
      else if (r.length)
        for (var a = s.length, i = 0; (i = r.indexOf(s, i)) >= 0; ) {
          var o = i + a;
          (i === 0 || qs.includes(r[i - 1])) && (o === r.length || qs.includes(r[o])) ? r = (i === 0 ? "" : r.substring(0, i)) + r.substring(o + 1) : i = o;
        }
  }
  return r === "" ? null : r;
}
function Ks(e, t = !1) {
  var n = t ? " !important;" : ";", r = "";
  for (var s in e) {
    var a = e[s];
    a != null && a !== "" && (r += " " + s + ": " + a + n);
  }
  return r;
}
function jr(e) {
  return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function hc(e, t) {
  if (t) {
    var n = "", r, s;
    if (Array.isArray(t) ? (r = t[0], s = t[1]) : r = t, e) {
      e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var a = !1, i = 0, o = !1, l = [];
      r && l.push(...Object.keys(r).map(jr)), s && l.push(...Object.keys(s).map(jr));
      var c = 0, u = -1;
      const _ = e.length;
      for (var d = 0; d < _; d++) {
        var f = e[d];
        if (o ? f === "/" && e[d - 1] === "*" && (o = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? o = !0 : f === '"' || f === "'" ? a = f : f === "(" ? i++ : f === ")" && i--, !o && a === !1 && i === 0) {
          if (f === ":" && u === -1)
            u = d;
          else if (f === ";" || d === _ - 1) {
            if (u !== -1) {
              var p = jr(e.substring(c, u).trim());
              if (!l.includes(p)) {
                f !== ";" && d++;
                var w = e.substring(c, d).trim();
                n += " " + w + ";";
              }
            }
            c = d + 1, u = -1;
          }
        }
      }
    }
    return r && (n += Ks(r)), s && (n += Ks(s, !0)), n = n.trim(), n === "" ? null : n;
  }
  return e == null ? null : String(e);
}
function fe(e, t, n, r, s, a) {
  var i = e.__className;
  if (i !== n || i === void 0) {
    var o = pc(n, r, a);
    o == null ? e.removeAttribute("class") : t ? e.className = o : e.setAttribute("class", o), e.__className = n;
  } else if (a && s !== a)
    for (var l in a) {
      var c = !!a[l];
      (s == null || c !== !!s[l]) && e.classList.toggle(l, c);
    }
  return a;
}
function Pr(e, t = {}, n, r) {
  for (var s in n) {
    var a = n[s];
    t[s] !== a && (n[s] == null ? e.style.removeProperty(s) : e.style.setProperty(s, a, r));
  }
}
function _t(e, t, n, r) {
  var s = e.__style;
  if (s !== t) {
    var a = hc(t, r);
    a == null ? e.removeAttribute("style") : e.style.cssText = a, e.__style = t;
  } else r && (Array.isArray(r) ? (Pr(e, n?.[0], r[0]), Pr(e, n?.[1], r[1], "important")) : Pr(e, n, r));
  return r;
}
function ts(e, t, n = !1) {
  if (e.multiple) {
    if (t == null)
      return;
    if (!ls(t))
      return kl();
    for (var r of e.options)
      r.selected = t.includes(Ys(r));
    return;
  }
  for (r of e.options) {
    var s = Ys(r);
    if (Bl(s, t)) {
      r.selected = !0;
      return;
    }
  }
  (!n || t !== void 0) && (e.selectedIndex = -1);
}
function vc(e) {
  var t = new MutationObserver(() => {
    ts(e, e.__value);
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
  }), ai(() => {
    t.disconnect();
  });
}
function Ys(e) {
  return "__value" in e ? e.__value : e.value;
}
const on = Symbol("class"), Rn = Symbol("style"), Ri = Symbol("is custom element"), Li = Symbol("is html");
function mc(e, t) {
  t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function V(e, t, n, r) {
  var s = Oi(e);
  s[t] !== (s[t] = n) && (t === "loading" && (e[Xo] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Di(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function gc(e, t, n, r, s = !1, a = !1) {
  var i = Oi(e), o = i[Ri], l = !i[Li], c = t || {}, u = e.tagName === "OPTION";
  for (var d in t)
    d in n || (n[d] = null);
  n.class ? n.class = xi(n.class) : (r || n[on]) && (n.class = null), n[Rn] && (n.style ??= null);
  var f = Di(e);
  for (const h in n) {
    let E = n[h];
    if (u && h === "value" && E == null) {
      e.value = e.__value = "", c[h] = E;
      continue;
    }
    if (h === "class") {
      var p = e.namespaceURI === "http://www.w3.org/1999/xhtml";
      fe(e, p, E, r, t?.[on], n[on]), c[h] = E, c[on] = n[on];
      continue;
    }
    if (h === "style") {
      _t(e, E, t?.[Rn], n[Rn]), c[h] = E, c[Rn] = n[Rn];
      continue;
    }
    var w = c[h];
    if (!(E === w && !(E === void 0 && e.hasAttribute(h)))) {
      c[h] = E;
      var _ = h[0] + h[1];
      if (_ !== "$$")
        if (_ === "on") {
          const C = {}, b = "$$" + h;
          let T = h.slice(2);
          var v = Ql(T);
          if (Xl(T) && (T = T.slice(0, -7), C.capture = !0), !v && w) {
            if (E != null) continue;
            e.removeEventListener(T, c[b], C), c[b] = null;
          }
          if (E != null)
            if (v)
              e[`__${T}`] = E, Si([T]);
            else {
              let A = function(S) {
                c[h].call(this, S);
              };
              c[b] = sc(T, e, A, C);
            }
          else v && (e[`__${T}`] = void 0);
        } else if (h === "style")
          V(e, h, E);
        else if (h === "autofocus")
          Hl(
            /** @type {HTMLElement} */
            e,
            !!E
          );
        else if (!o && (h === "__value" || h === "value" && E != null))
          e.value = e.__value = E;
        else if (h === "selected" && u)
          mc(
            /** @type {HTMLOptionElement} */
            e,
            E
          );
        else {
          var g = h;
          l || (g = tc(g));
          var y = g === "defaultValue" || g === "defaultChecked";
          if (E == null && !o && !y)
            if (i[h] = null, g === "value" || g === "checked") {
              let C = (
                /** @type {HTMLInputElement} */
                e
              );
              const b = t === void 0;
              if (g === "value") {
                let T = C.defaultValue;
                C.removeAttribute(g), C.defaultValue = T, C.value = C.__value = b ? T : null;
              } else {
                let T = C.defaultChecked;
                C.removeAttribute(g), C.defaultChecked = T, C.checked = b ? T : !1;
              }
            } else
              e.removeAttribute(h);
          else y || f.includes(g) && (o || typeof E != "string") ? (e[g] = E, g in i && (i[g] = ye)) : typeof E != "function" && V(e, g, E);
        }
    }
  }
  return c;
}
function En(e, t, n = [], r = [], s = [], a, i = !1, o = !1) {
  Ya(s, n, r, (l) => {
    var c = void 0, u = {}, d = e.nodeName === "SELECT", f = !1;
    if (li(() => {
      var w = t(...l.map(k)), _ = gc(
        e,
        c,
        w,
        a,
        i,
        o
      );
      f && d && "value" in w && ts(
        /** @type {HTMLSelectElement} */
        e,
        w.value
      );
      for (let g of Object.getOwnPropertySymbols(u))
        w[g] || Se(u[g]);
      for (let g of Object.getOwnPropertySymbols(w)) {
        var v = w[g];
        g.description === bl && (!c || v !== c[g]) && (u[g] && Se(u[g]), u[g] = De(() => fc(e, () => v))), _[g] = v;
      }
      c = _;
    }), d) {
      var p = (
        /** @type {HTMLSelectElement} */
        e
      );
      ms(() => {
        ts(
          p,
          /** @type {Record<string | symbol, any>} */
          c.value,
          !0
        ), vc(p);
      });
    }
    f = !0;
  });
}
function Oi(e) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    // @ts-expect-error
    e.__attributes ??= {
      [Ri]: e.nodeName.includes("-"),
      [Li]: e.namespaceURI === _l
    }
  );
}
var Zs = /* @__PURE__ */ new Map();
function Di(e) {
  var t = e.getAttribute("is") || e.nodeName, n = Zs.get(t);
  if (n) return n;
  Zs.set(t, n = []);
  for (var r, s = e, a = Element.prototype; a !== s; ) {
    r = Wo(s);
    for (var i in r)
      r[i].set && n.push(i);
    s = Ba(s);
  }
  return n;
}
function Xs(e, t) {
  return e === t || e?.[Pt] === t;
}
function Ln(e = {}, t, n, r) {
  return ms(() => {
    var s, a;
    return oi(() => {
      s = a, a = [], ws(() => {
        e !== n(...a) && (t(e, ...a), s && Xs(n(...s), e) && t(null, ...s));
      });
    }), () => {
      Xt(() => {
        a && Xs(n(...a), e) && t(null, ...a);
      });
    };
  }), e;
}
let er = !1;
function wc(e) {
  var t = er;
  try {
    return er = !1, [e(), er];
  } finally {
    er = t;
  }
}
const _c = {
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
function Kn(e, t, n) {
  return new Proxy(
    { props: e, exclude: t },
    _c
  );
}
function X(e, t, n, r) {
  var s = (n & vl) !== 0, a = (n & ml) !== 0, i = (
    /** @type {V} */
    r
  ), o = !0, l = () => (o && (o = !1, i = a ? ws(
    /** @type {() => V} */
    r
  ) : (
    /** @type {V} */
    r
  )), i), c;
  if (s) {
    var u = Pt in e || Zo in e;
    c = fn(e, t)?.set ?? (u && t in e ? (y) => e[t] = y : void 0);
  }
  var d, f = !1;
  s ? [d, f] = wc(() => (
    /** @type {V} */
    e[t]
  )) : d = /** @type {V} */
  e[t], d === void 0 && r !== void 0 && (d = l(), c && (sl(), c(d)));
  var p;
  if (p = () => {
    var y = (
      /** @type {V} */
      e[t]
    );
    return y === void 0 ? l() : (o = !0, y);
  }, (n & hl) === 0)
    return p;
  if (c) {
    var w = e.$$legacy;
    return (
      /** @type {() => V} */
      (function(y, h) {
        return arguments.length > 0 ? ((!h || w || f) && c(h ? p() : y), y) : p();
      })
    );
  }
  var _ = !1, v = ((n & pl) !== 0 ? Mr : Za)(() => (_ = !1, p()));
  s && k(v);
  var g = (
    /** @type {Effect} */
    ue
  );
  return (
    /** @type {() => V} */
    (function(y, h) {
      if (arguments.length > 0) {
        const E = h ? k(v) : s ? wt(y) : y;
        return _e(v, E), _ = !0, i !== void 0 && (i = E), y;
      }
      return Jt && _ || (g.f & bt) !== 0 ? v.v : k(v);
    })
  );
}
const bc = "5";
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add(bc);
var kc = /* @__PURE__ */ ne("<div><!></div>");
function yc(e, t) {
  let n = X(t, "class", 3, "");
  var r = kc(), s = B(r);
  Ti(s, () => t.children), q(() => fe(r, 1, `lc ${n() ?? ""}`, "svelte-ilxib0")), D(e, r);
}
var Sc = /* @__PURE__ */ ne('<span><span class="block h-2 w-2 rounded-full border border-dashed border-line-strong"></span></span>');
function Cc(e, t) {
  let n = X(t, "class", 3, ""), r = X(t, "title", 3, void 0);
  var s = Sc();
  q(() => {
    fe(s, 1, `inline-flex shrink-0 items-center justify-center ${n() ?? ""}`), V(s, "role", r() ? "img" : void 0), V(s, "aria-hidden", r() ? void 0 : "true"), V(s, "aria-label", r());
  }), D(e, s);
}
const Mc = /^(?:(.*):)?(w|h|size|m[trblxyse]?|p[trblxyse]?|gap)-/;
function Ec(...e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.filter(Boolean).join(" ").split(/\s+/).filter(Boolean)) {
    const r = Mc.exec(n);
    t.set(r ? `${r[1] ?? ""}:${r[2]}` : n, n);
  }
  return [...t.values()].join(" ");
}
function Yn(...e) {
  return Ec(Ai(e));
}
var Tc = /* @__PURE__ */ pe("<title> </title>"), Nc = /* @__PURE__ */ pe("<desc> </desc>"), Ac = /* @__PURE__ */ pe('<svg><!><!><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"></path></svg>');
function xc(e, t) {
  Qe(t, !0);
  const n = Mn("iconCtx") ?? {}, r = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = X(t, "size", 19, () => n.size || "md"), a = X(t, "color", 19, () => n.color || "currentColor"), i = /* @__PURE__ */ Kn(t, [
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
  var u = Ac();
  En(
    u,
    (_) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: a(),
      ...i,
      class: _,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": l ? o : void 0,
      "aria-hidden": !c
    }),
    [() => Yn("shrink-0", r[s()], t.class)]
  );
  var d = B(u);
  {
    var f = (_) => {
      var v = Tc(), g = B(v);
      q(() => {
        V(v, "id", t.title.id), se(g, t.title.title);
      }), D(_, v);
    };
    Y(d, (_) => {
      t.title?.id && t.title.title && _(f);
    });
  }
  var p = ie(d);
  {
    var w = (_) => {
      var v = Nc(), g = B(v);
      q(() => {
        V(v, "id", t.desc.id), se(g, t.desc.desc);
      }), D(_, v);
    };
    Y(p, (_) => {
      t.desc?.id && t.desc.desc && _(w);
    });
  }
  D(e, u), et();
}
var Rc = /* @__PURE__ */ pe("<title> </title>"), Lc = /* @__PURE__ */ pe("<desc> </desc>"), Oc = /* @__PURE__ */ pe('<svg><!><!><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd"></path></svg>');
function Dc(e, t) {
  Qe(t, !0);
  const n = Mn("iconCtx") ?? {}, r = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = X(t, "size", 19, () => n.size || "md"), a = X(t, "color", 19, () => n.color || "currentColor"), i = /* @__PURE__ */ Kn(t, [
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
  var u = Oc();
  En(
    u,
    (_) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: a(),
      ...i,
      class: _,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": l ? o : void 0,
      "aria-hidden": !c
    }),
    [() => Yn("shrink-0", r[s()], t.class)]
  );
  var d = B(u);
  {
    var f = (_) => {
      var v = Rc(), g = B(v);
      q(() => {
        V(v, "id", t.title.id), se(g, t.title.title);
      }), D(_, v);
    };
    Y(d, (_) => {
      t.title?.id && t.title.title && _(f);
    });
  }
  var p = ie(d);
  {
    var w = (_) => {
      var v = Lc(), g = B(v);
      q(() => {
        V(v, "id", t.desc.id), se(g, t.desc.desc);
      }), D(_, v);
    };
    Y(p, (_) => {
      t.desc?.id && t.desc.desc && _(w);
    });
  }
  D(e, u), et();
}
var Fc = /* @__PURE__ */ pe("<title> </title>"), Ic = /* @__PURE__ */ pe("<desc> </desc>"), $c = /* @__PURE__ */ pe('<svg><!><!><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0V8Zm-1 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z" clip-rule="evenodd"></path></svg>');
function Bc(e, t) {
  Qe(t, !0);
  const n = Mn("iconCtx") ?? {}, r = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = X(t, "size", 19, () => n.size || "md"), a = X(t, "color", 19, () => n.color || "currentColor"), i = /* @__PURE__ */ Kn(t, [
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
  var u = $c();
  En(
    u,
    (_) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: a(),
      ...i,
      class: _,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": l ? o : void 0,
      "aria-hidden": !c
    }),
    [() => Yn("shrink-0", r[s()], t.class)]
  );
  var d = B(u);
  {
    var f = (_) => {
      var v = Fc(), g = B(v);
      q(() => {
        V(v, "id", t.title.id), se(g, t.title.title);
      }), D(_, v);
    };
    Y(d, (_) => {
      t.title?.id && t.title.title && _(f);
    });
  }
  var p = ie(d);
  {
    var w = (_) => {
      var v = Ic(), g = B(v);
      q(() => {
        V(v, "id", t.desc.id), se(g, t.desc.desc);
      }), D(_, v);
    };
    Y(p, (_) => {
      t.desc?.id && t.desc.desc && _(w);
    });
  }
  D(e, u), et();
}
var jc = /* @__PURE__ */ pe("<title> </title>"), Pc = /* @__PURE__ */ pe("<desc> </desc>"), Hc = /* @__PURE__ */ pe('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z"></path></svg>');
function Vc(e, t) {
  Qe(t, !0);
  const n = Mn("iconCtx") ?? {}, r = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = X(t, "size", 19, () => n.size || "md"), a = X(t, "color", 19, () => n.color || "currentColor"), i = X(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ Kn(t, [
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
  var d = Hc();
  En(
    d,
    (g) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: a(),
      ...o,
      class: g,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Yn("shrink-0", r[s()], t.class)]
  );
  var f = B(d);
  {
    var p = (g) => {
      var y = jc(), h = B(y);
      q(() => {
        V(y, "id", t.title.id), se(h, t.title.title);
      }), D(g, y);
    };
    Y(f, (g) => {
      t.title?.id && t.title.title && g(p);
    });
  }
  var w = ie(f);
  {
    var _ = (g) => {
      var y = Pc(), h = B(y);
      q(() => {
        V(y, "id", t.desc.id), se(h, t.desc.desc);
      }), D(g, y);
    };
    Y(w, (g) => {
      t.desc?.id && t.desc.desc && g(_);
    });
  }
  var v = ie(w);
  q(() => V(v, "stroke-width", i())), D(e, d), et();
}
var Uc = /* @__PURE__ */ pe("<title> </title>"), Wc = /* @__PURE__ */ pe("<desc> </desc>"), zc = /* @__PURE__ */ pe('<svg><!><!><path stroke="currentColor" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path></svg>');
function Fi(e, t) {
  Qe(t, !0);
  const n = Mn("iconCtx") ?? {}, r = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let s = X(t, "size", 19, () => n.size || "md"), a = X(t, "color", 19, () => n.color || "currentColor"), i = X(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ Kn(t, [
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
  var d = zc();
  En(
    d,
    (g) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: a(),
      ...o,
      class: g,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": c ? l : void 0,
      "aria-hidden": !u
    }),
    [() => Yn("shrink-0", r[s()], t.class)]
  );
  var f = B(d);
  {
    var p = (g) => {
      var y = Uc(), h = B(y);
      q(() => {
        V(y, "id", t.title.id), se(h, t.title.title);
      }), D(g, y);
    };
    Y(f, (g) => {
      t.title?.id && t.title.title && g(p);
    });
  }
  var w = ie(f);
  {
    var _ = (g) => {
      var y = Wc(), h = B(y);
      q(() => {
        V(y, "id", t.desc.id), se(h, t.desc.desc);
      }), D(g, y);
    };
    Y(w, (g) => {
      t.desc?.id && t.desc.desc && g(_);
    });
  }
  var v = ie(w);
  q(() => V(v, "stroke-width", i())), D(e, d), et();
}
var Gc = /* @__PURE__ */ ne("<span><!></span>"), qc = /* @__PURE__ */ pe('<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7.5" class="sm-pm-disc svelte-1cj69fi"></circle><path class="sm-pm-pie svelte-1cj69fi"></path></svg>'), Kc = /* @__PURE__ */ pe('<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M9 5.5v13M15 5.5v13"></path></svg>'), Yc = /* @__PURE__ */ pe('<path d="M12 6v7M12 18h.01"></path>'), Zc = /* @__PURE__ */ pe('<path d="M12 4a8 8 0 1 1-8 8"></path>'), Xc = /* @__PURE__ */ pe('<path d="M12 7v5l3 2"></path>'), Jc = /* @__PURE__ */ pe('<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><!></svg>'), Qc = /* @__PURE__ */ ne("<span><!></span>"), eu = /* @__PURE__ */ ne('<span class="h-2 w-2 rounded-full ring-[1.5px] ring-inset ring-fg-subtle"></span>'), tu = /* @__PURE__ */ ne('<span class="h-1.5 w-1.5 rounded-full bg-success-solid"></span>'), nu = /* @__PURE__ */ ne('<span class="sr-only"> </span>'), ru = /* @__PURE__ */ ne('<span class="relative inline-flex h-4 w-4 shrink-0 items-center justify-center"><!> <!></span>');
function su(e, t) {
  let n = X(t, "label", 3, void 0), r = X(t, "resolved", 3, !1), s = X(t, "tone", 3, void 0), a = X(t, "progress", 3, null);
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
  }, o = "bg-subtle ring-line text-fg-subtle", l = /* @__PURE__ */ de(() => a() != null && (t.state === "checking" || t.state === "deploying") ? Math.max(0, Math.min(1, a())) : null), c = /* @__PURE__ */ de(() => {
    if (k(l) == null || k(l) <= 0) return "";
    if (k(l) >= 1) return "M8 3.75a4.25 4.25 0 1 1 0 8.5a4.25 4.25 0 1 1 0-8.5Z";
    const g = k(l) * 2 * Math.PI, y = 4.25, h = 8 + y * Math.sin(g), E = 8 - y * Math.cos(g);
    return `M8 8V3.75A${y} ${y} 0 ${k(l) > 0.5 ? 1 : 0} 1 ${h.toFixed(3)} ${E.toFixed(3)}Z`;
  }), u = /* @__PURE__ */ de(() => t.state === "approval" ? void 0 : r() ? o : i[t.state]);
  var d = ru(), f = B(d);
  {
    var p = (g) => {
      var y = Gc(), h = B(y);
      Fi(h, { class: "h-3 w-3", "aria-hidden": "true" }), q(() => fe(
        y,
        1,
        `sm-ask inline-flex h-4 w-4 items-center justify-center rounded-full ${s() === "held" ? "sm-ask-held text-held" : s() === "neutral" ? "sm-ask-neutral text-fg-muted" : "text-fg"}`,
        "svelte-1cj69fi"
      )), D(g, y);
    }, w = (g) => {
      var y = we(), h = ce(y);
      {
        var E = (b) => {
          var T = qc(), A = ie(B(T));
          q(() => {
            fe(T, 0, `sm-pm ${t.state === "deploying" ? "sm-pm-active" : "sm-pm-progress"}`, "svelte-1cj69fi"), V(A, "d", k(c));
          }), D(b, T);
        }, C = (b) => {
          var T = we(), A = ce(T);
          {
            var S = (m) => {
              var M = Qc(), I = B(M);
              {
                var O = (R) => {
                  var L = Kc();
                  D(R, L);
                }, $ = (R) => {
                  var L = Jc(), H = B(L);
                  {
                    var U = (x) => {
                      var j = Yc();
                      D(x, j);
                    }, W = (x) => {
                      var j = we(), z = ce(j);
                      {
                        var J = (le) => {
                          var Z = Zc();
                          D(le, Z);
                        }, K = (le) => {
                          var Z = Xc();
                          D(le, Z);
                        };
                        Y(
                          z,
                          (le) => {
                            t.state === "deploying" ? le(J) : le(K, !1);
                          },
                          !0
                        );
                      }
                      D(x, j);
                    };
                    Y(H, (x) => {
                      t.state === "failed" || t.state === "stuck" ? x(U) : x(W, !1);
                    });
                  }
                  q(() => fe(L, 0, xi(t.state === "deploying" ? "sm-spin" : ""), "svelte-1cj69fi")), D(R, L);
                };
                Y(I, (R) => {
                  t.state === "held" ? R(O) : R($, !1);
                });
              }
              q(() => fe(M, 1, `inline-flex h-4 w-4 items-center justify-center rounded-full ring-1 ring-inset ${k(u) ?? ""}`, "svelte-1cj69fi")), D(m, M);
            }, P = (m) => {
              var M = we(), I = ce(M);
              {
                var O = (R) => {
                  Cc(R, {});
                }, $ = (R) => {
                  var L = we(), H = ce(L);
                  {
                    var U = (x) => {
                      var j = eu();
                      D(x, j);
                    }, W = (x) => {
                      var j = tu();
                      D(x, j);
                    };
                    Y(
                      H,
                      (x) => {
                        t.state === "behind" ? x(U) : x(W, !1);
                      },
                      !0
                    );
                  }
                  D(R, L);
                };
                Y(
                  I,
                  (R) => {
                    t.state === "none" ? R(O) : R($, !1);
                  },
                  !0
                );
              }
              D(m, M);
            };
            Y(
              A,
              (m) => {
                k(u) ? m(S) : m(P, !1);
              },
              !0
            );
          }
          D(b, T);
        };
        Y(
          h,
          (b) => {
            k(l) != null ? b(E) : b(C, !1);
          },
          !0
        );
      }
      D(g, y);
    };
    Y(f, (g) => {
      t.state === "approval" ? g(p) : g(w, !1);
    });
  }
  var _ = ie(f, 2);
  {
    var v = (g) => {
      var y = nu(), h = B(y);
      q(() => se(h, n())), D(g, y);
    };
    Y(_, (g) => {
      n() && g(v);
    });
  }
  q(() => V(d, "title", n())), D(e, d);
}
const au = [
  { rank: 0, pattern: /^(dev|development|local)$/i },
  { rank: 1, pattern: /(dev|development)/i },
  { rank: 2, pattern: /^(test|qa|qe|integration)$/i },
  { rank: 3, pattern: /(test|qa|qe|integration)/i },
  { rank: 4, pattern: /^(stage|staging|preprod|preview)$/i },
  { rank: 5, pattern: /(stage|staging|preprod|preview)/i },
  { rank: 7, pattern: /^(prod|production|live)$/i },
  { rank: 8, pattern: /(prod|production|live)/i }
], Js = 6, iu = {
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
function ut(e) {
  if (!e) return Js;
  const t = iu[e.toLowerCase().split(/[-_./\s:]/, 1)[0]];
  if (t !== void 0) return t;
  for (const n of au)
    if (n.pattern.test(e)) return n.rank;
  return Js;
}
function _s(e, t) {
  const n = ut(e), r = ut(t);
  return n !== r ? n - r : e.localeCompare(t);
}
const Vn = ["dev", "test", "staging", "prod"], ou = {
  dev: "dev",
  development: "dev",
  test: "test",
  qa: "test",
  staging: "staging",
  stage: "staging",
  preprod: "staging",
  prod: "prod",
  production: "prod"
}, Tr = "default";
function ot(e) {
  if (!e) return null;
  const t = ou[e];
  if (t) return t;
  const n = ut(e);
  return n <= 1 ? "dev" : n <= 3 ? "test" : n <= 5 ? "staging" : n === 6 ? null : "prod";
}
function Ut(e) {
  return e.spec?.site || e.status?.wave?.site || Tr;
}
function bs(e) {
  return e.spec?.wave ?? e.status?.wave?.wave ?? 1;
}
function ks(e) {
  return e.status?.wave?.role ?? null;
}
function Nr(e) {
  const t = e.spec?.name || e.metadata?.name || "";
  return t.startsWith("kuberik-") ? t : `kuberik-${t}`;
}
const ze = (e) => ot(e) ?? e, Pe = {
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
}, Hr = (e) => e.split(",").map((t) => Number(t)).filter((t) => Number.isFinite(t));
function lu(e, t) {
  const n = { kind: "unparsed", reason: e, raw: t };
  try {
    let r;
    switch (e) {
      case "WaitingFor":
        return (r = t.match(Pe.bakeEnded)) ? {
          kind: "member",
          tier: ze(r[1]),
          site: r[2],
          what: "bake",
          outcome: r[3],
          rev: r[4]
        } : (r = t.match(Pe.bakeOn)) ? { kind: "member", tier: ze(r[1]), site: r[2], what: "bake", rev: r[3] } : (r = t.match(Pe.bake)) ? { kind: "member", tier: ze(r[1]), site: r[2], what: "bake" } : (r = t.match(Pe.selection)) ? { kind: "member", tier: ze(r[1]), site: r[2], what: "selection" } : (r = t.match(Pe.noSites)) ? { kind: "noSites", tier: ze(r[1]) } : n;
      case "WaitingForCandidate":
        return t.trim() ? { kind: "candidate", rev: t.trim() } : n;
      case "Pinned":
        return (r = t.match(Pe.pinned)) ? { kind: "pinned", pinned: r[1], selected: r[2] } : n;
      case "InvalidTopology":
        return (r = t.match(Pe.gap)) ? {
          kind: "gap",
          tier: ze(r[1]),
          waves: Hr(r[2]),
          missing: Hr(r[3]),
          startsAtOne: !0
        } : (r = t.match(Pe.start)) ? {
          kind: "gap",
          tier: ze(r[1]),
          waves: Hr(r[2]),
          missing: [],
          startsAtOne: !1
        } : (r = t.match(Pe.selfUp)) ? { kind: "selfUpstream", tier: ze(r[1]) } : (r = t.match(Pe.alias)) ? {
          kind: "aliasTier",
          names: r[1].split(/, | and /).map((s) => s.trim()).filter(Boolean),
          tier: ze(r[2])
        } : n;
      case "UnknownTier":
        return (r = t.match(Pe.unknownTier)) ? { kind: "unknownTier", name: r[1] } : n;
      case "LockstepWaiting":
        return (r = t.match(Pe.lockstep)) ? { kind: "lockstep", tier: ze(r[1]), site: r[2], rev: r[3] } : n;
      case "DuplicateSite":
        return (r = t.match(Pe.duplicate)) ? {
          kind: "duplicate",
          site: r[1],
          tier: ze(r[2]),
          name: r[3],
          owner: { cluster: r[4], namespace: r[5], name: r[6] }
        } : n;
      default:
        return n;
    }
  } catch {
    return n;
  }
}
function cu(e, t) {
  if (!e) return null;
  const n = e.reason || t, r = e.environment ? ze(e.environment) : "";
  switch (n) {
    case "WaitingFor":
      return e.site && e.waitingOn === "Selection" ? { kind: "member", tier: r, site: e.site, what: "selection" } : e.waitingOn === "Sites" && r ? { kind: "noSites", tier: r } : e.waitingOn === "Bake" && r ? {
        kind: "member",
        tier: r,
        site: e.site || Tr,
        what: "bake",
        ...e.outcome ? { outcome: e.outcome === "Failed" ? "failed" : "cancelled" } : {},
        ...e.revision ? { rev: e.revision } : {}
      } : null;
    case "WaitingForCandidate":
      return e.revision ? { kind: "candidate", rev: e.revision } : null;
    case "Pinned":
      return e.pinnedVersion && e.selectedVersion ? { kind: "pinned", pinned: e.pinnedVersion, selected: e.selectedVersion } : null;
    case "LockstepWaiting":
      return e.site && e.revision ? { kind: "lockstep", tier: r, site: e.site, rev: e.revision } : null;
    case "DuplicateSite":
      return e.site && e.owner?.name ? {
        kind: "duplicate",
        site: e.site,
        tier: r,
        name: e.names?.[0] ?? "",
        owner: { cluster: e.owner.cluster ?? "", namespace: e.owner.namespace ?? "", name: e.owner.name }
      } : null;
    case "UnknownTier":
      return e.names?.[0] ? { kind: "unknownTier", name: e.names[0] } : null;
    case "InvalidTopology":
      return e.names && e.names.length > 1 ? { kind: "aliasTier", names: e.names, tier: r } : e.waves && e.waves.length ? {
        kind: "gap",
        tier: r,
        waves: e.waves,
        missing: e.missingWaves ?? [],
        startsAtOne: (e.missingWaves?.length ?? 0) > 0 || Math.min(...e.waves) === 1
      } : r ? { kind: "selfUpstream", tier: r } : null;
    default:
      return null;
  }
}
function Un(e) {
  try {
    const t = e.status?.conditions?.find((s) => s.type === "WaveReady");
    if (!t) return { ready: null, reason: "", raw: "", blocker: null };
    const n = t.message ?? "", r = t.reason ?? "";
    return t.status === "True" ? { ready: !0, reason: r, raw: n, blocker: null } : {
      ready: t.status === "False" ? !1 : null,
      reason: r,
      raw: n,
      blocker: t.status === "False" ? cu(e.status?.wave?.blocker, r) ?? lu(r, n) : null
    };
  } catch {
    return { ready: null, reason: "", raw: "", blocker: null };
  }
}
function Qs(e, t) {
  const n = Vn.indexOf(e.tier) - Vn.indexOf(t.tier);
  return n || (e.wave !== t.wave ? e.wave - t.wave : e.isLeader !== t.isLeader ? e.isLeader ? -1 : 1 : e.site < t.site ? -1 : e.site > t.site ? 1 : 0);
}
const ea = (e) => e.status?.conditions?.some(
  (t) => t.type === "WaveReady" && t.status === "False" && t.reason === "DuplicateSite"
) ?? !1;
function uu(e, t) {
  const n = [], r = /* @__PURE__ */ new Map(), s = (u, d) => {
    const f = `${u}\0${d}`;
    let p = r.get(f);
    return p || r.set(f, p = { tier: u, site: d, memberOwn: !1, duplicates: [] }), p;
  }, a = [];
  for (const u of t) {
    const d = ot(u.spec?.environment);
    if (!d) {
      n.push(u);
      continue;
    }
    ea(u) ? a.push({ env: u, tier: d }) : s(d, Ut(u)).env ??= u;
  }
  for (const { env: u, tier: d } of a) s(d, Ut(u)).duplicates.push(u);
  for (const u of t) {
    const d = ot(u.spec?.environment), f = Ut(u), p = !ea(u);
    for (const w of u.status?.wave?.members ?? []) {
      const _ = ot(w.environment);
      if (!_) continue;
      const v = s(_, w.site), g = p && _ === d && w.site === f;
      (!v.member || g && !v.memberOwn) && (v.member = w, v.memberOwn = g);
    }
  }
  const i = (u) => u.env ? bs(u.env) : u.member?.wave ?? 1, o = /* @__PURE__ */ new Map();
  for (const u of r.values()) {
    const d = `${u.tier}\0${i(u)}`, f = o.get(d);
    f ? f.push(u) : o.set(d, [u]);
  }
  const l = (u) => !!u.member?.deregistered, c = [];
  for (const u of Vn) {
    const d = /* @__PURE__ */ new Map(), f = [];
    for (const [p, w] of o) {
      if (!p.startsWith(u + "\0")) continue;
      const _ = Number(p.slice(u.length + 1)), v = w.filter((b) => !l(b)).map((b) => b.site), g = w.map((b) => b.env?.status?.wave).filter((b) => !!b), h = g.find((b) => b?.leader)?.leader ?? (v.length ? v.reduce((b, T) => T < b ? T : b) : null), E = g.find((b) => b?.site === h && b?.selectedRevision)?.selectedRevision ?? g.find((b) => b?.selectedRevision)?.selectedRevision, C = w.map((b) => {
        const T = l(b), A = !T && b.site === h;
        return {
          tier: u,
          site: b.site,
          wave: _,
          role: b.env && ks(b.env) || (A ? "Leader" : "Follower"),
          isLeader: A,
          env: b.env,
          member: b.member,
          revision: b.member?.revision,
          bakeStatus: b.member?.bakeStatus,
          deregistered: T,
          duplicates: b.duplicates,
          ready: b.env ? Un(b.env) : void 0
        };
      });
      C.sort(Qs), d.set(_, { wave: _, leader: h, selectedRevision: E, sites: C }), f.push(...C);
    }
    f.length && (f.sort(Qs), c.push({
      tier: u,
      waves: [...d.values()].sort((p, w) => p.wave - w.wave),
      sites: f,
      liveCount: f.filter((p) => !p.deregistered).length
    }));
  }
  return { deployName: e, tiers: c, unplaced: n };
}
function ys(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e ?? []) {
    if (!r) continue;
    const s = Nr(r), a = t.get(s);
    a ? a.push(r) : t.set(s, [r]);
  }
  const n = /* @__PURE__ */ new Map();
  for (const [r, s] of t) n.set(r, uu(r, s));
  return n;
}
const ta = (e) => !e.deregistered;
function Ii(e, t) {
  const n = e.tiers.find((s) => s.tier === t.tier);
  if (!n) return [];
  const r = n.waves.find((s) => s.wave === t.wave);
  if (!t.isLeader) {
    const s = r?.sites.find((a) => a.isLeader);
    return s && s !== t ? [s] : [];
  }
  for (let s = t.wave - 1; s >= 1; s--) {
    const a = n.waves.find((i) => i.wave === s)?.sites.filter(ta) ?? [];
    if (a.length) return a;
  }
  for (let s = Vn.indexOf(t.tier) - 1; s >= 0; s--) {
    const a = e.tiers.find((i) => i.tier === Vn[s]);
    if (a)
      for (let i = a.waves.length - 1; i >= 0; i--) {
        const o = a.waves[i].sites.filter(ta);
        if (o.length) return o;
      }
  }
  return [];
}
function $i(e, t) {
  if (!e) return;
  const n = ot(t.spec?.environment);
  if (!n) return;
  const r = Ut(t);
  return e.tiers.find((s) => s.tier === n)?.sites.find((s) => s.env === t || s.site === r);
}
function du(e, t) {
  const n = e?.tiers.find((r) => r.tier === t.tier);
  return n && n.liveCount > 1 ? `${t.tier}-${t.site}` : t.tier;
}
function fu(e, t) {
  const n = ot(e.spec?.environment);
  if (!n) return e.spec?.environment ?? "";
  const r = t?.tiers.find((s) => s.tier === n);
  return r && r.liveCount > 1 ? `${n}-${Ut(e)}` : n;
}
const na = /* @__PURE__ */ new WeakMap();
function Dt(e, t) {
  let n = na.get(t);
  return n || na.set(t, n = ys(t)), fu(e, n.get(Nr(e)));
}
const pu = "dashboard.rollout.kuberik.com/theme", hu = "dashboard.rollout.kuberik.com/theme-color", ra = "dashboard.rollout.kuberik.com/theme-label", Tt = {
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
}, vu = {
  dev: { label: "Development", color: "#009689", ramp: Tt.dev },
  development: { label: "Development", color: "#009689", ramp: Tt.dev },
  prod: { label: "Production", color: "#ed00ab", ramp: Tt.prod },
  production: { label: "Production", color: "#ed00ab", ramp: Tt.prod },
  stage: { label: "Staging", color: "#7c3aed", ramp: Tt.staging },
  staging: { label: "Staging", color: "#7c3aed", ramp: Tt.staging },
  test: { label: "Test", color: "#0891b2", ramp: Tt.test },
  testing: { label: "Test", color: "#0891b2", ramp: Tt.test }
}, mu = [
  { pattern: /prod|production/i, preset: "prod" },
  { pattern: /dev|development/i, preset: "dev" },
  { pattern: /staging|stage/i, preset: "staging" },
  { pattern: /test|testing/i, preset: "test" }
], gu = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
function wu(e) {
  return e.trim().toLowerCase();
}
function gr(e) {
  const t = e.trim();
  if (!gu.test(t)) return null;
  if (t.length === 4) {
    const [, n, r, s] = t;
    return `#${n}${n}${r}${r}${s}${s}`.toLowerCase();
  }
  return t.toLowerCase();
}
function sa(e) {
  const t = gr(e);
  return t ? {
    r: parseInt(t.slice(1, 3), 16),
    g: parseInt(t.slice(3, 5), 16),
    b: parseInt(t.slice(5, 7), 16)
  } : { r: 37, g: 99, b: 235 };
}
function tn(e, t, n) {
  const r = sa(e), s = sa(t), a = (o, l) => Math.round(o * (1 - n) + l * n), i = (o) => o.toString(16).padStart(2, "0");
  return `#${i(a(r.r, s.r))}${i(a(r.g, s.g))}${i(
    a(r.b, s.b)
  )}`;
}
function _u(e) {
  return {
    textColor: tn(e, "#000000", 0.18),
    borderColor: tn(e, "#ffffff", 0.64),
    surfaceColor: tn(e, "#ffffff", 0.9),
    darkSurfaceColor: tn(e, "#000000", 0.7),
    darkTextColor: tn(e, "#ffffff", 0.42),
    // gray-700 is `.dark .chip-env`'s old border mix target.
    darkBorderColor: tn(e, "#364153", 0.62)
  };
}
function bu(e) {
  return e.split(/[-_\s]+/).filter(Boolean).map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(" ");
}
function ku(e) {
  return mu.find(({ pattern: n }) => n.test(e))?.preset ?? null;
}
function yu({
  annotationLabel: e,
  environmentName: t,
  inlineThemeColor: n,
  preset: r,
  themeName: s,
  themeValue: a
}) {
  return e || (a && r ? r.label : a && n || s === "custom" ? t || "Custom" : t || r?.label || bu(s));
}
function Su(e, t, n, r, s) {
  const a = gr(r) ?? "#2563eb";
  return {
    name: e,
    label: t,
    environmentName: n,
    color: a,
    ...s ?? _u(a)
  };
}
function wr(e, t, n) {
  const r = e?.metadata?.annotations, s = typeof t == "string" ? t : t?.spec?.environment, a = (typeof t == "object" && t && s ? n : void 0) || s || (t && typeof t == "object" ? e?.metadata?.labels?.environment?.trim() : void 0) || void 0, i = r?.[pu]?.trim(), o = r?.[hu]?.trim();
  if (!i && !o && !a) return null;
  const l = ot(s) ?? a, c = l ? ku(l) : null, u = i ? wu(i) : c ?? (o ? "custom" : ""), d = u ? vu[u] : void 0, f = o ? gr(o) : null, p = i ? gr(i) : null, w = f ?? p ?? d?.color;
  if (!w) return null;
  const _ = yu({
    annotationLabel: r?.[ra]?.trim(),
    environmentName: a,
    inlineThemeColor: p,
    preset: d,
    themeName: u,
    themeValue: i
  }), v = a || r?.[ra]?.trim() || "", g = d && !f && !p ? d.ramp : void 0;
  return Su(u, _, v, w, g);
}
function tr(e) {
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
const Cu = {
  development: "dev",
  production: "prod",
  staging: "staging",
  testing: "test"
};
function Ss(e) {
  if (!e) return "";
  const t = (typeof e == "string" ? e : e.environmentName || e.name || e.label || "").toLowerCase();
  return Cu[t] || t;
}
const aa = {
  production: "prod",
  development: "dev",
  testing: "test",
  stage: "staging"
};
function Mu(e) {
  const t = (e ?? "").trim(), n = /^(\d+)\s+([a-z]+)\s+(regions?)$/i.exec(t);
  if (n) {
    const i = n[2].toLowerCase();
    return { tier: aa[i] ?? i, place: `${n[1]} ${n[3].toLowerCase()}` };
  }
  const r = t.indexOf("-"), s = (r < 0 ? t : t.slice(0, r)).toLowerCase(), a = r < 0 ? "" : t.slice(r + 1);
  return { tier: aa[s] ?? s, place: a || null };
}
var Eu = /* @__PURE__ */ ne('<!> <span class="min-w-0 truncate"> </span>', 1), Tu = /* @__PURE__ */ ne('<span class="chip-value-wrap hit-32"><a><span class="min-w-0 truncate"> </span></a></span>'), Nu = /* @__PURE__ */ ne('<a><span class="min-w-0 truncate"> </span></a>'), Au = /* @__PURE__ */ ne('<span><span class="min-w-0 truncate"> </span></span>'), xu = /* @__PURE__ */ ne("<span><span><!></span> <!></span>"), Ru = /* @__PURE__ */ ne('<span><span class="min-w-0 truncate"> </span></span>'), Lu = /* @__PURE__ */ ne('<span><span class="chip chip-env-name chip-env-tier t-chip"> </span> <span><span class="min-w-0 truncate"> </span></span></span>'), Ou = /* @__PURE__ */ ne("<span> </span>"), Du = /* @__PURE__ */ ne("<span><!></span>");
function Fu(e, t) {
  Qe(t, !0);
  const n = (L) => {
    var H = Eu(), U = ce(H);
    {
      var W = (J) => {
        var K = we(), le = ce(K);
        Ti(le, () => t.icon), D(J, K);
      }, x = (J) => {
        var K = we(), le = ce(K);
        {
          var Z = (Q) => {
            Vc(Q, { class: "mr-[3px] h-3 w-3 shrink-0", "aria-hidden": "true" });
          };
          Y(
            le,
            (Q) => {
              k(m) && Q(Z);
            },
            !0
          );
        }
        D(J, K);
      };
      Y(U, (J) => {
        t.icon ? J(W) : J(x, !1);
      });
    }
    var j = ie(U, 2), z = B(j);
    q(() => se(z, a())), D(L, H);
  }, r = (L, H = qo) => {
    var U = we(), W = ce(U);
    {
      var x = (z) => {
        var J = Tu(), K = B(J), le = B(K), Z = B(le);
        q(() => {
          fe(K, 1, `chip-value t-code-sm ${l() ? "chip-value--dim" : ""}`), V(K, "href", o()), V(K, "title", t.valueTitle ?? i()), se(Z, i());
        }), D(z, J);
      }, j = (z) => {
        var J = we(), K = ce(J);
        {
          var le = (Q) => {
            var ae = Nu(), he = B(ae), Te = B(he);
            q(() => {
              fe(ae, 1, `chip-value t-code-sm ${H() ? `chip-value--solo ${w()}` : ""} ${l() ? "chip-value--dim" : ""}`), V(ae, "href", o()), V(ae, "title", t.valueTitle ?? i()), se(Te, i());
            }), D(Q, ae);
          }, Z = (Q) => {
            var ae = Au(), he = B(ae), Te = B(he);
            q(() => {
              fe(ae, 1, `chip-value t-code-sm ${H() ? `chip-value--solo ${w()}` : ""} ${l() ? "chip-value--dim" : ""}`), V(ae, "title", t.valueTitle ?? i()), se(Te, i());
            }), D(Q, ae);
          };
          Y(
            K,
            (Q) => {
              o() ? Q(le) : Q(Z, !1);
            },
            !0
          );
        }
        D(z, J);
      };
      Y(W, (z) => {
        o() && !H() ? z(x) : z(j, !1);
      });
    }
    D(L, U);
  };
  let s = X(t, "role", 3, "rank"), a = X(t, "label", 3, ""), i = X(t, "value", 3, null), o = X(t, "valueHref", 3, null), l = X(t, "valueDim", 3, !1), c = X(t, "theme", 3, null);
  X(t, "dot", 3, !0);
  let u = X(t, "wide", 3, !1), d = X(t, "valueIsBuild", 3, !0), f = X(t, "regionOnly", 3, !1), p = X(t, "soft", 3, !1), w = X(t, "class", 3, "");
  Br(() => {
  });
  const _ = /* @__PURE__ */ de(() => i() !== null && i() !== void 0 && i() !== ""), v = /* @__PURE__ */ de(() => s() === "env" && !k(_) ? Mu(a()) : null), g = /* @__PURE__ */ de(() => k(_) && a() === "");
  let y = /* @__PURE__ */ Ae(null);
  Br(() => {
  }), Br(() => {
  });
  const h = "border-line text-fg-subtle", E = "border-line text-success", C = "border-line text-held", b = "border-danger-line bg-danger-tint text-danger", S = {
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
    newest: E,
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
    rank: C,
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
    failing: b,
    // `diverged` is the third member of the rank vocabulary — `newest`,
    // `−N`, and the case where a rank is not a distance at all. It takes
    // the product's ONE red (red-700 / dark red-400), the hue already
    // owned by `Failed`, because both mean "adverse and it will not clear
    // on its own"; the closed budget has no spare hue and this needs no
    // new one. It is deliberately TEXT-ONLY, the same geometry as `rank`:
    // `alarm` stays the only chip with a FILL, so amber remains the
    // loudest thing on the page and `stuck` is not out-shouted by a state
    // one row above it.
    diverged: b,
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
    blocked: b,
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
    head: E,
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
    issue: b
  }, P = /* @__PURE__ */ new Set(["newest", "head", "rank", "diverged", "unranked"]), m = /* @__PURE__ */ de(() => !t.icon && k(_) && d() && P.has(s())), M = /* @__PURE__ */ de(() => u() ? "chip-wide" : s() === "env" ? "" : k(m) ? "max-w-[calc(14ch+40px)]" : "max-w-[calc(14ch+26px)]");
  var I = we(), O = ce(I);
  {
    var $ = (L) => {
      r(L, () => !0);
    }, R = (L) => {
      var H = we(), U = ce(H);
      {
        var W = (j) => {
          var z = xu(), J = B(z), K = B(J);
          n(K);
          var le = ie(J, 2);
          r(le, () => !1), Ln(z, (Z) => _e(y, Z), () => k(y)), q(
            (Z) => {
              fe(z, 1, `chip-joined ${w() ?? ""}`), fe(J, 1, `chip ${s() === "env" ? "chip-env-name t-ui-sm" : "t-chip"} ${S[s()] ?? ""} ${k(M) ?? ""}`), _t(J, Z), V(J, "title", t.title ?? a());
            },
            [
              () => s() === "env" && c() ? tr(c()) : void 0
            ]
          ), D(j, z);
        }, x = (j) => {
          var z = we(), J = ce(z);
          {
            var K = (Z) => {
              var Q = we(), ae = ce(Q);
              {
                var he = (F) => {
                  var ve = Ru(), Ze = B(ve), be = B(Ze);
                  Ln(ve, (Le) => _e(y, Le), () => k(y)), q(() => {
                    fe(ve, 1, `chip chip-env-name chip-env-place chip-env-region ${u() ? "chip-wide" : ""} ${w() ?? ""}`), V(ve, "data-env", a()), V(ve, "title", t.title ?? a()), se(be, k(v).place);
                  }), D(F, ve);
                }, Te = (F) => {
                  var ve = we(), Ze = ce(ve);
                  {
                    var be = ($e) => {
                      var ge = Lu(), tt = B(ge), Oe = B(tt), Mt = ie(tt, 2), $t = B(Mt), N = B($t);
                      Ln(ge, (G) => _e(y, G), () => k(y)), q(
                        (G, ee) => {
                          fe(ge, 1, `chip-joined chip-env-badge ${p() ? "chip-env-soft" : ""} ${w() ?? ""}`), V(ge, "data-env", a()), _t(ge, G), V(ge, "title", t.title ?? a()), se(Oe, k(v).tier), fe(Mt, 1, `chip chip-env-name chip-env-place t-ui-sm ${u() ? "chip-wide" : ""} ${ee ?? ""}`), se(N, k(v).place);
                        },
                        [
                          () => c() ? tr(c()) : void 0,
                          () => /^\d+ regions?$/.test(k(v).place) ? "chip-env-place--count" : ""
                        ]
                      ), D($e, ge);
                    }, Le = ($e) => {
                      var ge = Ou(), tt = B(ge);
                      Ln(ge, (Oe) => _e(y, Oe), () => k(y)), q(
                        (Oe) => {
                          fe(ge, 1, `chip chip-env-name chip-env-tier t-chip ${p() ? "chip-env-soft" : ""} ${w() ?? ""}`), V(ge, "data-env", a()), _t(ge, Oe), V(ge, "title", t.title ?? a()), se(tt, k(v).tier);
                        },
                        [
                          () => c() ? tr(c()) : void 0
                        ]
                      ), D($e, ge);
                    };
                    Y(
                      Ze,
                      ($e) => {
                        k(v).place ? $e(be) : $e(Le, !1);
                      },
                      !0
                    );
                  }
                  D(F, ve);
                };
                Y(ae, (F) => {
                  k(v).place && f() ? F(he) : F(Te, !1);
                });
              }
              D(Z, Q);
            }, le = (Z) => {
              var Q = Du(), ae = B(Q);
              n(ae), Ln(Q, (he) => _e(y, he), () => k(y)), q(
                (he) => {
                  fe(Q, 1, `chip ${s() === "env" ? "chip-env-name t-ui-sm" : "t-chip"} ${S[s()] ?? ""} ${k(M) ?? ""} ${w() ?? ""}`), _t(Q, he), V(Q, "title", t.title ?? a());
                },
                [
                  () => s() === "env" && c() ? tr(c()) : void 0
                ]
              ), D(Z, Q);
            };
            Y(
              J,
              (Z) => {
                k(v) ? Z(K) : Z(le, !1);
              },
              !0
            );
          }
          D(j, z);
        };
        Y(
          U,
          (j) => {
            k(_) ? j(W) : j(x, !1);
          },
          !0
        );
      }
      D(L, H);
    };
    Y(O, (L) => {
      k(g) ? L($) : L(R, !1);
    });
  }
  D(e, I), et();
}
const Iu = "";
function _r(e) {
  return e === "/" ? "/" : `${Iu}${e}`;
}
const Bi = "rollout-dashboard.kuberik.com/source-cluster", $u = "rollout-dashboard.kuberik.com/source-dashboard";
function bn(e) {
  return e?.metadata?.annotations?.[Bi] ?? "";
}
function pn(e) {
  return e?.metadata?.annotations?.[$u] ?? "";
}
function Cs(e, t) {
  return bn(e) === bn(t) && e.metadata?.namespace === t.metadata?.namespace && t.spec?.rolloutRef?.name === e.metadata?.name;
}
function Ms(e, t, n, r) {
  const s = `/rollouts/${encodeURIComponent(e)}/${encodeURIComponent(t)}/${encodeURIComponent(n)}`;
  return _r(s);
}
function Bu(e) {
  let t = e.trim();
  const n = t.match(/^[\w.-]+@([\w.-]+):(.+)$/);
  return n ? t = `${n[1]}/${n[2]}` : t = t.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, ""), t = t.replace(/\/(tree|blob)\/.*$/, ""), t = t.replace(/\.git\/?$/, "").replace(/\/+$/, ""), t.toLowerCase();
}
function ji(e, t) {
  return e ? `repo:${Bu(e)}` : `app:${t}`;
}
function ia(e, t) {
  return ji(e?.status?.source, t);
}
function ju(e) {
  return e.startsWith("repo:") ? e.slice(5) : e.startsWith("app:") ? e.slice(4) : e;
}
function ns(e) {
  return e.startsWith("app:") ? `${e.slice(4)} (no linked repository)` : ju(e);
}
function Ar(e, t) {
  if (!t) return "";
  for (const n of e?.status?.availableReleases ?? [])
    if (n.tag === t) return te(n);
  for (const n of e?.status?.history ?? [])
    if (n.version?.tag === t) return te(n.version);
  return it(t);
}
const Pu = [
  { key: "prod", pattern: /prod|production|live/i },
  { key: "dev", pattern: /dev|development/i },
  { key: "staging", pattern: /stag|preprod|preview/i },
  { key: "test", pattern: /test|qa|qe|integration/i }
], Hu = {
  dev: "DEV",
  staging: "STAGING",
  prod: "PROD",
  test: "TEST"
};
function Tn(e) {
  for (const { key: t, pattern: n } of Pu)
    if (n.test(e)) return Hu[t];
  return e.toUpperCase();
}
function Pi(e, t) {
  const n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  for (const s of t) {
    const a = s.spec?.rolloutRef?.name;
    if (!a) continue;
    const i = e.find((c) => Cs(c, s));
    if (!i) continue;
    r.add(i);
    let o = n.get(a);
    o || (o = { appName: a, hasEnvironmentBinding: !0, cells: [] }, n.set(a, o));
    const l = ia(i, a);
    o.cells.push({
      envName: s.spec?.environment ? Dt(s, t) : "",
      tier: ot(s.spec?.environment),
      site: Ut(s),
      wave: bs(s),
      role: ks(s),
      ready: Un(s).ready,
      environment: s,
      rollout: i,
      theme: wr(
        i,
        s,
        s.spec?.environment ? Dt(s, t) : null
      ),
      sourceURL: pn(s),
      sourceCluster: bn(s),
      repoKey: l,
      repoLabel: ns(l)
    });
  }
  for (const s of e) {
    const a = s.metadata?.name;
    if (!a || r.has(s)) continue;
    let i = n.get(a);
    i || (i = { appName: a, hasEnvironmentBinding: !1, cells: [] }, n.set(a, i));
    const o = ia(s, a);
    i.cells.push({
      envName: s.metadata?.namespace || "",
      tier: null,
      site: null,
      wave: null,
      role: null,
      ready: null,
      environment: null,
      rollout: s,
      theme: wr(s),
      sourceURL: pn(s),
      sourceCluster: bn(s),
      repoKey: o,
      repoLabel: ns(o)
    });
  }
  for (const s of n.values())
    s.cells.sort((a, i) => _s(a.envName, i.envName));
  return n;
}
function Vu(e) {
  if (!e) return 0;
  const t = new Date(e).getTime();
  return Number.isFinite(t) ? t : 0;
}
function Vr(e) {
  return e && te(e) || null;
}
function Uu(e) {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), a = (u) => {
    const d = Vr(u);
    if (!d || !u) return;
    const f = Vu(u.created), p = t.get(d);
    if (p) {
      !p.revision && u.revision && (p.revision = u.revision), !p.tag && u.tag && (p.tag = u.tag), f > p.createdMs && (p.createdMs = f), i && (p.onReleaseLine = !0);
      return;
    }
    t.set(d, {
      version: d,
      revision: u.revision ?? null,
      tag: u.tag ?? null,
      createdMs: f,
      rank: -1,
      onReleaseLine: i
    });
  };
  let i = !0;
  for (const u of e) {
    const d = u.rollout.status?.availableReleases ?? [];
    d.forEach((f, p) => {
      a(f);
      const w = Vr(f);
      if (!w) return;
      const _ = d.length - 1 - p;
      s.set(w, Math.max(s.get(w) ?? -1 / 0, _));
    });
  }
  i = !1;
  for (const u of e)
    (u.rollout.status?.history ?? []).forEach((f, p) => {
      a(f.version);
      const w = Vr(f.version);
      if (!w) return;
      const _ = f.timestamp ? new Date(f.timestamp).getTime() : NaN;
      if (Number.isFinite(_) && n.set(w, Math.max(n.get(w) ?? -1 / 0, _)), p === 0) {
        const v = ut(u.tier ?? u.envName);
        r.set(w, Math.min(r.get(w) ?? 1 / 0, v));
      }
    });
  const o = [...t.values()].sort((u, d) => {
    if (d.createdMs !== u.createdMs) return d.createdMs - u.createdMs;
    const f = s.get(u.version) ?? Number.POSITIVE_INFINITY, p = s.get(d.version) ?? Number.POSITIVE_INFINITY;
    if (f !== p) return f - p;
    const w = r.get(u.version) ?? Number.POSITIVE_INFINITY, _ = r.get(d.version) ?? Number.POSITIVE_INFINITY;
    if (w !== _) return w - _;
    const v = n.get(u.version), g = n.get(d.version);
    return v !== void 0 && g !== void 0 && v !== g ? g - v : u.version.localeCompare(d.version);
  });
  o.forEach((u, d) => u.rank = d);
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
function Wu(e, t, n) {
  if (!t || e.releaseLineOldestMs === 0) return !1;
  const r = e.get(t);
  if (!r || r.onReleaseLine) return !1;
  const s = r.createdMs > 0 ? r.createdMs : n;
  return !Number.isFinite(s) || s <= 0 ? !1 : s >= e.releaseLineOldestMs;
}
function zu(e) {
  const t = e.rollout?.status?.history?.[0]?.version;
  return t && te(t) || null;
}
function Gu(e) {
  const t = e.rollout?.status?.history?.[0]?.timestamp;
  if (!t) return 0;
  const n = new Date(t).getTime();
  return Number.isFinite(n) ? n : 0;
}
function qu(e) {
  const t = Uu(e.cells), n = /* @__PURE__ */ new Map();
  for (const r of e.cells) {
    const s = zu(r);
    if (!s) {
      n.set(r, { kind: "unknown" });
      continue;
    }
    if (Wu(t, s, Gu(r))) {
      n.set(r, { kind: "diverged" });
      continue;
    }
    const a = yn(r.rollout);
    if (a !== null) {
      n.set(r, a === 0 ? { kind: "newest" } : { kind: "behind", by: a });
      continue;
    }
    const i = r.rollout?.status;
    if (!(!Array.isArray(i?.availableReleases) && !Array.isArray(i?.releaseCandidates))) {
      n.set(r, { kind: "unknown" });
      continue;
    }
    const l = t.rankOf(s);
    l < 0 ? n.set(r, { kind: "unknown" }) : l === 0 ? n.set(r, { kind: "newest" }) : n.set(r, { kind: "behind", by: l });
  }
  return n;
}
function Ku(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of Pi(e, t).values()) {
    const s = qu(r);
    for (const a of r.cells) n.set(a.rollout, s.get(a) ?? { kind: "unknown" });
  }
  return n;
}
function xr(e) {
  return e.kind === "behind" ? e.by : 0;
}
function Wn(e) {
  return e.statusKey === "failed" || e.stuck != null || e.checkFailure != null;
}
function Yu(e) {
  return e.statusKey === "succeeded" && e.stuck == null && e.checkFailure == null;
}
function Zu(e) {
  return Yu(e) && (xr(e.rank) > 0 || e.rank.kind === "diverged");
}
function Es(e) {
  return Zu(e) && (e.held || e.pinnedVersion != null);
}
const Xu = {
  held: !1,
  cause: null,
  waitsForEnv: null,
  frontier: null,
  waitingBehind: []
}, Ju = "its upstream environment";
function oa(e) {
  const t = ut(e);
  return t <= 1 ? 0 : t <= 3 ? 1 : t <= 5 ? 2 : t === 6 ? 3 : 4;
}
function Qu(e) {
  return e.kind !== "promotion" || e.subjectKind !== "environment" || !e.subject || e.subject === Ju ? null : e.subject;
}
function ed(e, t) {
  const n = oa(t);
  let r = null, s = null, a = !1, i = !1;
  for (const o of e) {
    const l = Qu(o), c = o.upstreamTier ?? l;
    if (!c) {
      i = !0;
      continue;
    }
    const u = oa(c);
    u < n ? r || (r = l ?? c, s = o) : u === n && (l ?? c) !== t && (o.upstreamTier ? r || (r = l ?? c, s = o) : a = !0);
  }
  return { chainUpstream: r, chainGate: s, order: a, unresolved: i };
}
function td(e, t) {
  const n = [], r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (const a of e) {
    const i = Ts(a.classifiedGates, t, { hasContract: a.contracts.length > 0 });
    if (!i.held && i.waitsForEnv) {
      r.has(i.waitsForEnv) || (n.push(i.waitsForEnv), s.set(i.waitsForEnv, i.waveWait ?? null)), r.set(i.waitsForEnv, (r.get(i.waitsForEnv) ?? 0) + 1);
      continue;
    }
    return {
      frontier: {
        build: a.build,
        held: i.held,
        cause: i.cause,
        causeLabel: Vi(a.classifiedGates, i.cause)
      },
      waitingBehind: n.map((o) => ({ stage: o, count: r.get(o) ?? 0, ...s.get(o) ? { wave: s.get(o) } : {} }))
    };
  }
  return { frontier: null, waitingBehind: n.map((a) => ({ stage: a, count: r.get(a) ?? 0, ...s.get(a) ? { wave: s.get(a) } : {} })) };
}
function Hi(e, t) {
  if (e.candidates === void 0) {
    if (!e.blocked) return Xu;
    const s = Ts(e.gates, t);
    return s.held ? {
      held: !0,
      cause: s.cause,
      waitsForEnv: null,
      frontier: { build: "", held: !0, cause: s.cause, causeLabel: Vi(e.gates, s.cause) },
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
  const { frontier: n, waitingBehind: r } = td(e.candidates, t);
  return n ? { held: n.held, cause: n.cause, waitsForEnv: null, frontier: n, waitingBehind: r } : { held: !1, cause: null, waitsForEnv: r[0]?.stage ?? null, ...r[0]?.wave ? { waveWait: r[0].wave } : {}, frontier: null, waitingBehind: r };
}
const nd = { held: !1, cause: null, waitsForEnv: null };
function rd(e) {
  return !e || !e.short || / to deploy (it first|this build)$/.test(e.short) ? null : e.short;
}
function Ts(e, t, n = {}) {
  const r = e.filter((p) => p.clears === "upstream"), s = r.filter((p) => p.kind === "promotion"), { chainUpstream: a, chainGate: i, order: o, unresolved: l } = ed(s, t);
  if (a) {
    const p = rd(i);
    return { held: !1, cause: null, waitsForEnv: a, ...p ? { waveWait: p } : {} };
  }
  const c = e.filter((p) => p.clears === "person"), u = e.filter((p) => p.clears === "unknown"), d = e.filter((p) => p.clears === "clock"), f = e.filter((p) => p.clears === "check");
  return c.length > 0 ? { held: !0, cause: "person", waitsForEnv: null } : u.length > 0 ? { held: !0, cause: "unknown", waitsForEnv: null } : r.some((p) => p.kind === "dependency") || n.hasContract ? { held: !0, cause: "dependency", waitsForEnv: null } : o ? { held: !0, cause: "order", waitsForEnv: null } : d.length > 0 ? { held: !0, cause: "clock", waitsForEnv: null } : f.length > 0 ? { held: !0, cause: "check", waitsForEnv: null } : l ? { held: !0, cause: "unknown", waitsForEnv: null } : nd;
}
function sd(e, t) {
  return Ts(e.classifiedGates, t);
}
function ad(e, t, n) {
  const r = [], s = [], a = [];
  for (const i of e.held) {
    const o = sd(i, t);
    o.held ? r.push(i) : o.waitsForEnv && n?.(i, o.waitsForEnv) ? a.push({ entry: i, stage: o.waitsForEnv }) : s.push({ entry: i, stage: o.waitsForEnv });
  }
  return { held: r, waiting: s, skipped: a };
}
function Vi(e, t) {
  if (!t) return null;
  switch (t) {
    case "person":
      return "an approval";
    case "unknown":
      return "a rule this dashboard cannot attribute";
    case "dependency": {
      const n = [
        ...new Set(
          e.filter((r) => r.clears === "upstream" && r.kind === "dependency" && r.subject).map((r) => r.subject)
        )
      ];
      return n.length > 0 ? kn(n) : "a dependency";
    }
    case "order":
      return "promotion order";
    case "clock":
      return e.find((n) => n.clears === "clock")?.label ?? "a deploy window";
    case "check":
      return "a check";
  }
}
function Ui(e, t, n) {
  return `${e ?? ""}|${t}/${n}`;
}
function id(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e ?? []) {
    const r = Ui(bn(n), n.metadata.namespace, n.metadata.name);
    t.set(r, [...t.get(r) ?? [], ...n.healthChecks ?? []]);
  }
  return t;
}
const od = "displayTimeZone";
function ld() {
  try {
    return localStorage.getItem(od) === "utc" ? "utc" : "local";
  } catch {
    return "local";
  }
}
const Wi = wt({ zone: typeof localStorage > "u" ? "local" : ld() });
function zi() {
  return Wi.zone === "utc" ? "UTC" : void 0;
}
function cd(e = /* @__PURE__ */ new Date()) {
  const t = (s) => new Intl.DateTimeFormat(s, { timeZone: zi(), timeZoneName: "short" }).formatToParts(e).find((a) => a.type === "timeZoneName")?.value ?? "", n = t("en-US");
  if (n && !n.startsWith("GMT")) return n;
  const r = t("en-GB");
  return r && !r.startsWith("GMT") ? r : n || r || (Wi.zone === "utc" ? "UTC" : "");
}
const ud = "gate.kuberik.com/pretty-name";
function Gi(e) {
  return e?.annotations?.[ud] || null;
}
function dd(e) {
  const t = e.replace(/[-_.]+/g, " ").trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : e;
}
const fd = /-[bcdfghjklmnpqrstvwxz2456789]{5}$/;
function pd(e) {
  return fd.test(e);
}
function hd(e, t) {
  return t || (pd(e) ? "Gate" : dd(e));
}
function vd(e, t = /* @__PURE__ */ new Date()) {
  const n = new Date(e).getTime() - t.getTime();
  if (!Number.isFinite(n) || n <= 0) return null;
  const r = Math.floor(n / 6e4), s = Math.floor(r / 60), a = Math.floor(s / 24);
  return a > 0 ? `${a}d ${s % 24}h` : s > 0 ? `${s}h ${r % 60}m` : `${r}m`;
}
function md(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : `${t.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !1,
    timeZone: zi()
  })} ${cd(t)}`;
}
const gd = {
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
}, wd = (e) => e ? gd[e] ?? null : null;
function or(e, t = {}) {
  const n = wd(e);
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
function _d(e) {
  return bd(e).join(" · ");
}
function bd(e) {
  const t = e.required ? ` ${e.required}` : "", n = [`Needs ${e.provider}${t}`];
  return e.has && n.push(`has ${e.has}`), n;
}
function qi(e) {
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
    short: _d(e),
    clearsAt: null,
    timezone: null,
    ...Ke,
    subject: e.provider,
    subjectKind: "service",
    predicate: e.required ? `ships ${e.required}` : "ships a newer version",
    contract: null,
    have: e.has ?? null,
    need: e.required ?? null
  };
}
function Ki(e, t) {
  return e.kind !== "dependency" ? !1 : e.id && t.some((n) => n.gate === e.id) ? !0 : !!e.subject && t.some((n) => n.provider === e.subject);
}
const Ke = {
  subject: null,
  subjectKind: null,
  predicate: null,
  contract: null,
  have: null,
  need: null
}, Nn = {
  promotion: /* @__PURE__ */ new Map(),
  dependency: /* @__PURE__ */ new Map(),
  schedule: /* @__PURE__ */ new Map(),
  owners: /* @__PURE__ */ new Map(),
  sources: { environments: !1, dependencies: !1 },
  schedulesLoaded: !1,
  schedulesExpected: !0
}, jt = (e, t) => `${e ?? ""}/${t}`;
function kd(e) {
  return Gi(e);
}
function yd(e, t) {
  const n = t.get(Nr(e)), r = $i(n, e), s = Un(e), a = {
    tier: r?.tier ?? null,
    site: r?.site ?? e?.spec?.site ?? Tr,
    wave: r?.wave ?? e?.spec?.wave ?? 1,
    role: r?.role ?? "Leader",
    upstream: [],
    upstreamSites: [],
    upstreamTier: null,
    upstreamWave: null,
    via: null,
    selected: null,
    ready: s.ready === null && !s.raw ? null : s
  };
  if (!n || !r) return a;
  const i = Ii(n, r);
  a.upstream = i.map((l) => du(n, l)), a.upstreamSites = i.map((l) => l.site), i.length && (a.upstreamTier = i[0].tier, a.upstreamWave = i[0].wave, a.via = r.isLeader ? i[0].tier === r.tier ? "wave" : "tier" : "follow");
  const o = n.tiers.find((l) => l.tier === r.tier)?.waves.find((l) => l.wave === r.wave);
  return a.selected = o?.selectedRevision ? o.selectedRevision.slice(0, 7) : null, a;
}
function Ns(e) {
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
    const a = s?.metadata?.name;
    if (!a) continue;
    const i = (s?.metadata?.ownerReferences ?? []).find((l) => l?.controller === !0), o = Gi(s?.metadata);
    o && t.pretty.set(jt(s?.metadata?.namespace, a), o), t.owners.set(jt(s?.metadata?.namespace, a), {
      kind: i?.kind ?? null,
      name: i?.name ?? null
    });
  }
  const n = e?.environments?.items ?? [], r = ys(n);
  for (const s of n) {
    const a = s?.status?.rolloutGateRef?.name;
    a && t.promotion.set(jt(s?.metadata?.namespace, a), yd(s, r));
  }
  for (const s of e?.rolloutDependencies?.items ?? []) {
    const a = s?.status?.gateName;
    if (!a) continue;
    const i = [
      ...new Set(
        (s?.status?.blockedReleases ?? []).map((o) => o?.requiredVersion).filter(Boolean)
      )
    ];
    t.dependency.set(jt(s?.metadata?.namespace, a), {
      provider: s?.spec?.providerRef?.name ?? "another service",
      contract: s?.spec?.contract ?? "dependency",
      providedVersion: s?.status?.providedVersion ?? null,
      requiredVersion: i.length === 1 ? i[0] : null
    });
  }
  return t;
}
function rs(e, t, n) {
  const r = {
    ...e,
    schedule: new Map(e.schedule),
    schedulesLoaded: !0
  };
  for (const s of n ?? []) {
    const a = s?.status?.active === !0, i = s?.spec?.action;
    if (!(i === "Allow" && !a || i === "Deny" && a)) continue;
    const l = kd(s?.metadata) || s?.metadata?.name || "a deploy window";
    for (const c of s?.status?.managedGates ?? [])
      r.schedule.set(jt(t, c), {
        label: l,
        nextTransition: s?.status?.nextTransition ?? null,
        // ⭐ P2, operator-walk finding — see `ClassifiedGate.timezone`'s
        // own comment. The schedule's IANA zone, carried through so the
        // gate's clause can be formatted against IT, not the reader's.
        timezone: s?.spec?.timezone ?? null
      });
  }
  return r;
}
const ft = (e) => e ? e.slice(0, 7) : "";
function ss(e, t, n) {
  return e === Tr && t !== n ? t : e;
}
function Sd(e, t, n) {
  const r = { clearsAt: null, timezone: null, ...Ke };
  switch (t.kind) {
    case "member": {
      const s = ss(t.site, t.tier, n), a = ft(t.rev);
      if (t.what === "selection")
        return {
          id: e,
          kind: "promotion",
          clears: "upstream",
          label: "after " + s + " picks",
          clause: s + " picks a build",
          short: "Waiting for " + s + " to pick a build",
          ...r,
          subject: s,
          subjectKind: "environment",
          predicate: "picks a build"
        };
      if (t.outcome) {
        const o = t.outcome === "failed" ? "failed" : "was cancelled", l = s + "'s check " + o + (a ? " on " + a : "");
        return {
          id: e,
          kind: "promotion",
          clears: "upstream",
          label: s + " is " + (or("failed") ?? "failing").toLowerCase(),
          clause: l,
          short: l,
          ...r,
          subject: s,
          subjectKind: "environment",
          predicate: "check " + o
        };
      }
      const i = "finish " + (or("checking") ?? "checking").toLowerCase() + " " + (a || "the build");
      return {
        id: e,
        kind: "promotion",
        clears: "upstream",
        label: s + " is " + (or("checking") ?? "checking").toLowerCase(),
        clause: s + " to " + i,
        short: "Waiting for " + s + " to " + i,
        ...r,
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
        ...r
      };
    case "candidate":
      return {
        id: e,
        kind: "promotion",
        clears: "upstream",
        label: "waiting for " + ft(t.rev),
        clause: ft(t.rev) + " is available on this cluster",
        short: "Waiting for " + ft(t.rev) + " to become available on this cluster",
        ...r
      };
    case "pinned":
      return {
        id: e,
        kind: "promotion",
        clears: "person",
        label: "pinned to " + ft(t.pinned),
        clause: "the pin on " + ft(t.pinned) + " is cleared",
        short: "Pinned to " + ft(t.pinned) + ", the wave selected " + ft(t.selected),
        ...r
      };
    case "gap": {
      let s;
      if (t.missing.length > 0) {
        const a = t.missing.length;
        s = t.tier + " has no wave" + (a === 1 ? " " : "s ") + t.missing.join(", ");
      } else
        s = t.tier + " waves start at " + (t.waves.length ? Math.min(...t.waves) : "?") + ", not 1";
      return {
        id: e,
        kind: "promotion",
        clears: "person",
        label: s,
        clause: s + " (fix the wave numbers)",
        short: s,
        ...r
      };
    }
    case "lockstep": {
      const s = ss(t.site, t.tier, n), a = ft(t.rev);
      return {
        id: e,
        kind: "promotion",
        clears: "upstream",
        label: "lockstep with " + s,
        clause: "lockstep: " + s + " finishes " + a,
        short: "Lockstep: waiting for " + s + " to finish " + a,
        ...r,
        subject: s,
        subjectKind: "environment",
        predicate: "to finish " + a
      };
    }
    case "duplicate": {
      const s = t.owner, a = (s.cluster ? s.cluster + "/" : "") + (s.namespace ? s.namespace + "/" : "") + s.name, i = "Held: another Environment, " + a + ", owns site " + t.site + " of " + t.tier;
      return {
        id: e,
        kind: "promotion",
        clears: "person",
        label: "duplicate site " + t.site,
        clause: a + " gives up site " + t.site + " of " + t.tier + ", or this Environment is annotated environments.kuberik.com/take-over-site=true to take it over",
        short: i + ". Annotate this Environment with environments.kuberik.com/take-over-site=true to take it over.",
        ...r
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
        ...r
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
        ...r
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
        ...r
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
        ...r
      };
  }
}
function Cd(e, t) {
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
function Md(e, t) {
  const n = t.ready && t.ready.ready === !1 ? t.ready.blocker : null;
  if (n) {
    const l = n.kind === "member" || n.kind === "lockstep" ? n.tier : n.kind === "candidate" ? t.tier : null, c = Sd(e, n, t.tier);
    return { ...c, ...Cd(n, c), upstreamTier: l };
  }
  const r = { id: e, kind: "promotion", clears: "upstream", clearsAt: null, timezone: null }, s = t.upstreamSites.map((l) => ss(l, t.upstreamTier ?? "", t.tier));
  if (t.via === "follow") {
    const l = s[0] ?? t.site, c = t.selected ? " (" + t.selected + ")" : "";
    return {
      ...r,
      upstreamTier: t.tier,
      label: "follows " + l + "'s pick" + c,
      clause: t.selected ? l + "'s pick (" + t.selected + ") reaches it" : l + " picks a build",
      short: t.selected ? "Following " + l + "'s pick (" + t.selected + ")" : "Waiting for " + l + " to pick a build",
      ...Ke,
      subject: l,
      subjectKind: "environment",
      predicate: t.selected ? "pick (" + t.selected + ") reaches it" : "picks a build"
    };
  }
  let a = null;
  t.via === "wave" ? a = "wave " + t.upstreamWave + " (" + s.join(", ") + ")" : t.via === "tier" && (a = t.upstreamTier);
  const i = a ?? "its upstream environment", o = a ? "deploys it first" : "deploys this build";
  return {
    ...r,
    upstreamTier: t.via === "wave" ? t.tier : t.upstreamTier,
    label: a ? "after " + a : "after its upstream environment",
    clause: i + " " + o,
    short: a ? "Waiting for " + a + " to deploy it first" : "Waiting for its upstream environment to deploy this build",
    ...Ke,
    subject: i,
    subjectKind: "environment",
    predicate: o
  };
}
function Rr(e, t, n = Nn) {
  const r = Ed(e, t, n), s = e?.name ?? "a rule";
  return { ...r, displayName: hd(s, n.pretty?.get(jt(t, s)) ?? null) };
}
function Ed(e, t, n = Nn) {
  const r = e?.name ?? "a rule", s = jt(t, r), a = n.promotion.get(s);
  if (a) return Md(r, a);
  const i = n.dependency.get(s);
  if (i) {
    const u = i.requiredVersion ? `${i.contract} ${i.requiredVersion}` : null, d = i.providedVersion ? " — it is on " + i.providedVersion : "";
    return {
      id: r,
      kind: "dependency",
      clears: "upstream",
      label: `depends on ${i.provider}`,
      // ⚠️ NOT the "— it is on X" aside in `clause` — it is the terse
      // form `joinClauses` strings several gates' worth of together
      // into one sentence (the consequence line); the aside stays in
      // `short`, the one-gate-at-a-time form, same as before this fix.
      clause: u ? `${i.provider} ships ${u}` : i.providedVersion ? `${i.provider} ships a newer ${i.contract} than ${i.providedVersion}` : `${i.provider} ships a newer ${i.contract}`,
      short: u ? `Waiting for ${i.provider} to ship ${u}${d}` : i.providedVersion ? `Waiting for ${i.provider} to ship a newer ${i.contract} — it is on ${i.providedVersion}` : `Waiting for ${i.provider} to ship a newer ${i.contract}`,
      clearsAt: null,
      timezone: null,
      ...Ke,
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
      id: r,
      kind: "schedule",
      clears: "clock",
      label: u.label,
      clause: "the deploy window reopens",
      short: `Outside the ${u.label} deploy window`,
      clearsAt: u.nextTransition,
      timezone: u.timezone,
      ...Ke,
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
      id: r,
      kind: "check",
      clears: "check",
      label: r,
      clause: "a check starts passing",
      short: "A check is not passing",
      clearsAt: null,
      timezone: null,
      // NOTHING TO DRAW, AND THAT IS THE HONEST ANSWER. A check names no
      // second party; the only concrete thing it carries is the gate's
      // generated id, which belongs in the disclosed tier. The row prints
      // `short`.
      ...Ke,
      pending: n.schedulesExpected && !n.schedulesLoaded
    };
  }
  const l = n.owners.get(s);
  if (l && l.kind) {
    const u = l.name ? `${l.kind} ${l.name}` : l.kind;
    return l.kind === "Environment" ? {
      id: r,
      kind: "promotion",
      clears: "upstream",
      label: "after its upstream environment",
      clause: "its upstream environment deploys this build",
      short: "Waiting for its upstream environment to deploy this build",
      clearsAt: null,
      timezone: null,
      ...Ke,
      subject: "its upstream environment",
      subjectKind: "environment",
      predicate: "deploys this build"
    } : l.kind === "RolloutDependency" ? {
      id: r,
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
      ...Ke
    } : {
      id: r,
      kind: "unknown",
      clears: "unknown",
      label: u,
      clause: `${u} allows this build`,
      short: `Held by ${u}`,
      clearsAt: null,
      timezone: null,
      ...Ke
    };
  }
  const c = n.sources.environments && n.sources.dependencies;
  return l && l.kind === null || c ? {
    id: r,
    kind: "approval",
    clears: "person",
    label: r,
    clause: "someone approves it",
    short: "Waiting for someone to approve it",
    clearsAt: null,
    timezone: null,
    ...Ke
  } : {
    id: r,
    kind: "unknown",
    clears: "unknown",
    label: r,
    clause: `the rule ${r} allows this build`,
    short: `Held by ${r} — this dashboard cannot tell what clears it`,
    clearsAt: null,
    timezone: null,
    ...Ke
  };
}
const la = {
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
}, Td = ["no", "One", "Two", "Three", "Four", "Five", "Six"];
function Nd(e) {
  return Td[e] ?? String(e);
}
function kn(e) {
  return e.length === 0 ? "" : e.length === 1 ? e[0] : `${e.slice(0, -1).join(", ")} and ${e[e.length - 1]}`;
}
function Ad(e) {
  const t = e.filter((i) => i.clears === "upstream"), n = t.some((i) => i.kind === "promotion"), r = t.filter((i) => i.kind === "dependency");
  if (r.length === 0)
    return "Nobody has to approve anything — this clears when the deploy in front of it lands.";
  const s = r.map((i) => {
    const o = i.subject ?? "the service it depends on";
    return i.contract ? i.need ? `ship ${i.contract} ${i.need} from ${o}` : `ship a newer ${i.contract} from ${o}` : i.need ? `ship ${i.need} from ${o}` : `ship a newer version from ${o}`;
  }), a = n ? ", then the deploy in front of it has to land" : "";
  return `No approval will unblock this. Someone has to ${kn(s)}${a}; until then the only way forward is a hand-started deploy, which bypasses the check.`;
}
function Yi(e, t, n) {
  const r = e.find((a) => a.kind === "dependency" && a.subject);
  if (!r) return `${t} ${n} waiting on another deploy`;
  const s = r.contract ? r.need ? `ship ${r.contract} ${r.need}` : `ship a newer ${r.contract}` : r.need ? `ship ${r.need}` : "ship a newer version";
  return `${t} ${n} waiting for ${r.subject} to ${s}`;
}
function xd(e, t, n, r, s) {
  if (e.length <= 1) return null;
  const a = e[0].clears;
  return e.every((i) => i.clears === a) ? a === "person" ? `${n} ${s} waiting on an approval` : a === "unknown" ? `Something is holding ${r}` : a === "upstream" ? Yi(t, n, s) : null : null;
}
function Rd(e) {
  const t = e.filter((r) => r.kind === "dependency"), n = e.filter((r) => r.kind !== "dependency");
  return [...t, ...n];
}
function Kt(e, t = Nn, n = {}) {
  const r = e?.metadata?.namespace, s = Xn(e), a = e?.spec?.wantedVersion ?? null, i = Zn(e).length, o = n.place ? n.place : null, l = n.subject, c = typeof l == "object" && l !== null, u = c ? l.lead : l || o || "this service", d = c ? l.object ?? l.lead : u, f = c ? "are" : "is", p = n.now ?? /* @__PURE__ */ new Date();
  if (a) {
    const F = Ar(e, a) || a;
    return {
      ...la,
      candidates: [],
      blocked: i > 0,
      candidateCount: i,
      pinnedTo: a,
      pinnedToDisplay: F,
      selfClearing: !1,
      // `info` (blue) — pinning is a STATE A PERSON CHOSE, not a rule
      // holding the rollout back. See the field's own doc comment (F2).
      severity: "info",
      headline: `${u} ${f} pinned to ${F}`,
      consequence: i > 0 ? `${i} newer build${i === 1 ? "" : "s"} ${i === 1 ? "is" : "are"} available and none of them will deploy while the pin is set.` : "Automatic updates are off here until the pin is cleared.",
      verdict: "Clearing the pin is the only thing that restarts automatic deploys.",
      resolution: "Clearing the pin is the only thing that restarts automatic deploys.",
      iconKind: "pinned"
    };
  }
  const w = Zi(e, t, { contractHolds: n.contractHolds });
  if (!w.allHeld)
    return { ...la, candidateCount: i, candidates: w.perBuild };
  const _ = s.blockingGates.length > 0 ? new Set(s.blockingGates) : new Set(w.held.flatMap((F) => F.gateNames)), v = (e?.status?.gates ?? []).filter((F) => F?.name && _.has(F.name)).map((F) => Rr(F, r, t)), g = w.held.flatMap((F) => F.contracts), y = v.filter(
    (F) => !(F.kind === "dependency" && !F.subject && Ki(F, g))
  ), h = new Set(
    y.filter((F) => F.kind === "dependency" && F.subject).map((F) => F.subject)
  ), E = /* @__PURE__ */ new Map();
  for (const F of w.held)
    for (const ve of F.contracts) E.set(ve.provider, ve);
  const C = [...E.values()].filter((F) => !h.has(F.provider)).map((F) => qi(F)), b = [...y, ...C].sort((F, ve) => {
    const Ze = { person: 0, unknown: 1, upstream: 2, check: 3, clock: 4 };
    return Ze[F.clears] - Ze[ve.clears] || F.id.localeCompare(ve.id);
  }), T = b.filter((F) => F.clears === "person"), A = b.filter((F) => F.clears === "unknown"), S = b.filter((F) => F.clears === "upstream"), P = b.filter((F) => F.clears === "clock"), m = b.filter((F) => F.clears === "check");
  let M = null;
  for (const F of P)
    F.clearsAt && (!M || new Date(F.clearsAt) < new Date(M)) && (M = F.clearsAt);
  const I = T.length === 0 && S.length === 0 && A.length === 0;
  let O;
  const $ = xd(b, S, u, d, f);
  $ ? O = $ : b.length > 1 ? O = `${Nd(b.length)} things are holding ${d}` : b.length === 1 && b[0].headline ? O = b[0].headline : T.length === 1 ? O = `${u} ${f} waiting on an approval` : A.length === 1 ? O = `Something is holding ${d}` : S.length === 1 ? O = Yi(S, u, f) : O = `${u} ${f} held`;
  const R = [];
  for (const F of T) R.push(F.clause);
  for (const F of A) R.push(F.clause);
  for (const F of Rd(S)) R.push(F.clause);
  for (const F of m) R.push(F.clause);
  for (const F of P) {
    const ve = F.clearsAt ? vd(F.clearsAt, p) : null;
    R.push(
      ve ? `${F.clause} in ${ve} — ${md(F.clearsAt)}` : F.clause
    );
  }
  const L = ad(w, n.place, n.skipped), H = L.held.length, U = L.waiting.find((F) => F.stage)?.stage ?? null, W = L.skipped[0]?.stage ?? null, x = (F) => `build${F === 1 ? "" : "s"}`, j = L.waiting.length, z = L.skipped.length, K = `${i > 0 ? H > 0 && H < i && (U || W) ? `${H} newer ${x(H)} ${H === 1 ? "is" : "are"} waiting here` + (j > 0 && U ? `; ${j} more ${j === 1 ? "hasn't" : "haven't"} reached ${U} yet` : "") + (z > 0 && W ? `; ${z} ${z === 1 ? "was" : "were"} skipped by ${W}, which runs a newer ${x(1)}` : "") + ". " : `${i} newer build${i === 1 ? "" : "s"} ${i === 1 ? "is" : "are"} waiting. ` : ""}Nothing promotes itself until ${kn(R)}.`, le = "A deploy you start by hand still applies immediately.";
  let Z, Q = !1;
  T.length > 0 ? Z = "This will not clear on its own." : A.length > 0 ? Z = "This dashboard cannot tell what clears this — it may or may not need a person." : S.length > 0 ? (Z = Ad(S), Q = S.some((F) => F.kind === "dependency")) : M ? Z = "This clears on its own." : Z = "This clears on its own once the check passes.";
  const ae = Q ? Z : `${Z} ${le}`;
  let he = T.length > 0 ? "person" : A.length > 0 ? "unknown" : S.length > 0 ? S[0].kind === "dependency" ? "dependency" : "promotion" : P.length > 0 ? "clock" : "check";
  const Te = m.some((F) => F.pending);
  return he === "check" && Te && (he = "pending"), {
    blocked: !0,
    candidateCount: i,
    pinnedTo: null,
    pinnedToDisplay: null,
    gates: b,
    person: T,
    clock: P,
    upstream: S,
    checks: m,
    unknown: A,
    clearsAt: M,
    selfClearing: I,
    headline: O,
    consequence: K,
    verdict: Z,
    resolution: ae,
    // ⭐ ALWAYS `warning` HERE. See the field's own doc comment (F2,
    // 2026-09-03): every gate this branch can hold on — person, unknown,
    // upstream, clock, check — is a RULE, not a choice, whether or not it
    // clears on its own. `selfClearing` answers "does this need a
    // person", a different question this field no longer conflates with
    // colour.
    severity: b.some((F) => F.fault) ? "error" : "warning",
    iconKind: he,
    kindPending: Te,
    candidates: w.perBuild
  };
}
function Zi(e, t = Nn, n = {}) {
  const r = e?.metadata?.namespace, s = Zn(e), a = e?.status?.gates ?? [], i = n.contractHolds, o = s.map((d) => {
    const f = d.tag ?? d.version ?? "", p = Ar(e, f) || f, w = Dd(e, f || null), _ = new Set(w), v = [...i?.get(p) ?? []], g = a.filter((b) => b?.name && _.has(b.name)).map((b) => Rr(b, r, t)).filter((b) => !Ki(b, v)), y = [...new Set(g.map((b) => b.clause))], h = new Set(
      g.filter((b) => b.kind === "dependency" && b.subject).map((b) => b.subject)
    ), E = v.filter((b) => !h.has(b.provider)).map((b) => qi(b)), C = [...g, ...E];
    return { build: p, tag: f, gateNames: w, clauses: y, contract: v[0], contracts: v, classifiedGates: C };
  }), l = o.filter((d) => d.gateNames.length > 0 || d.contracts.length > 0), c = o.filter((d) => d.gateNames.length === 0 && d.contracts.length === 0).map((d) => d.build), u = s.length > 0 && c.length === 0 && l.length > 0;
  return l.length === 0 ? { held: [], deployable: c, anyHeld: !1, allHeld: !1, perBuild: o } : { held: l, deployable: c, anyHeld: !0, allHeld: u, perBuild: o };
}
function Ld(e, t = {}) {
  const n = t.place ?? "this service";
  if ("gates" in e) {
    if (!e.blocked) return null;
    if (e.gates.length === 1 && e.gates[0].headline) return e.gates[0].headline;
    if (e.person.length > 0) return `${n} is waiting on an approval`;
    if (e.unknown.length > 0) return `${n} is waiting on a rule this dashboard cannot attribute`;
    const s = e.upstream.filter((a) => a.kind === "dependency" && a.subject);
    if (s.length > 0) {
      const a = s.map((i) => {
        const o = i.need ? ` ${i.need}` : "";
        return `${i.subject}${o}`;
      });
      return `${n} is waiting for ${kn(a)}`;
    }
    return e.upstream.some((a) => a.kind === "promotion") ? `${n} is waiting on promotion order` : `${n} is held`;
  }
  const r = e.held.find((s) => s.contracts.length > 0) ?? e.held[0];
  if (!r) return null;
  if (r.contracts.length > 0) {
    const s = r.contracts.map((a) => {
      const i = a.required ? ` ${a.required}` : "";
      return `${a.provider}${i}`;
    });
    return `${n} is waiting for ${kn(s)}`;
  }
  return r.gateNames.length > 0 ? `${n} is waiting on promotion order` : `${n} is held`;
}
const Od = 1440 * 60 * 1e3;
function yn(e) {
  const t = e?.status;
  if (!t) return null;
  const n = t.history?.[0] ? te(t.history[0].version) : null, r = Array.isArray(t.availableReleases) ? t.availableReleases : null;
  if (r && n !== null) {
    const s = r.findIndex((a) => te(a) === n);
    return s === -1 ? null : Array.isArray(t.releaseCandidates) ? t.releaseCandidates.length : r.length - 1 - s;
  }
  return Array.isArray(t.releaseCandidates) ? t.releaseCandidates.length : null;
}
function Xi(e) {
  const t = e?.status;
  if (!t) return null;
  if (Array.isArray(t.releaseCandidates))
    return t.releaseCandidates[0] ?? null;
  const n = yn(e);
  return n && n > 0 && Array.isArray(t.availableReleases) ? t.availableReleases[t.availableReleases.length - 1] ?? null : null;
}
function hn(e, t) {
  return Array.isArray(e.allowedVersions) ? e.allowedVersions.includes(t) : e.passing !== !1;
}
function Dd(e, t) {
  return t ? (e?.status?.gates ?? []).filter((n) => n?.name && !hn(n, t)).map((n) => n.name) : [];
}
function lr(e) {
  return e.tag ?? e.version ?? e.revision ?? "";
}
function Zn(e) {
  const t = e?.status;
  if (!t) return [];
  if (yn(e) === null) return [];
  if (Array.isArray(t.releaseCandidates)) return t.releaseCandidates;
  const n = yn(e);
  if (n && n > 0 && Array.isArray(t.availableReleases) && t.history?.[0]) {
    const r = te(t.history[0].version), s = t.availableReleases.findIndex((a) => te(a) === r);
    return s >= 0 ? t.availableReleases.slice(s + 1).reverse() : [];
  }
  return [];
}
function Fd(e, t) {
  const n = (e?.status?.gates ?? []).find((r) => r?.name === t);
  return n ? Zn(e).filter((r) => !hn(n, lr(r))) : [];
}
function Xn(e) {
  const t = e?.status, n = {
    candidateCount: 0,
    deployableCount: 0,
    blocked: !1,
    blockingGates: [],
    awaitingApprovalGates: [],
    notPassingGates: []
  };
  if (!t) return n;
  const r = Zn(e);
  if (r.length === 0) return n;
  const s = t.gates ?? [], a = r.filter(
    (f) => s.every((p) => hn(p, lr(f)))
  ).length, i = r.length > 0 && a === 0, o = s.filter(
    (f) => r.every((p) => !hn(f, lr(p)))
  );
  let l = o.map((f) => f.name).sort(), c = o;
  if (i && l.length === 0) {
    const f = Xi(e), p = f ? lr(f) : null;
    p && (c = s.filter((w) => !hn(w, p)), l = c.map((w) => w.name).sort());
  }
  const u = c.filter((f) => Array.isArray(f.allowedVersions)).map((f) => f.name).sort(), d = c.filter((f) => !Array.isArray(f.allowedVersions)).map((f) => f.name).sort();
  return {
    candidateCount: r.length,
    deployableCount: a,
    blocked: i,
    blockingGates: l,
    awaitingApprovalGates: u,
    notPassingGates: d
  };
}
function As(e, t, n) {
  if (!t.blocked) return !1;
  const r = e?.metadata?.namespace, s = n ?? Nn, a = new Set(t.blockingGates);
  return (e?.status?.gates ?? []).filter((i) => i?.name && a.has(i.name)).map((i) => Rr(i, r, s)).some((i) => i.clears === "person" || i.clears === "unknown");
}
function Id(e, t) {
  if (e?.spec?.wantedVersion) return null;
  const n = Xn(e);
  if (n.candidateCount === 0 || n.blocked && !As(e, n, t?.gateContext))
    return null;
  const r = t?.now ?? /* @__PURE__ */ new Date(), s = t?.thresholdMs ?? Od;
  let i = Xi(e)?.created;
  if (i || (i = e?.status?.history?.[0]?.timestamp), !i) return null;
  const o = new Date(i).getTime();
  if (Number.isNaN(o)) return null;
  const l = r.getTime() - o;
  return l <= s ? null : {
    kind: "promotion",
    candidateCount: n.candidateCount,
    waitingMs: l,
    blockingGates: n.blockingGates
  };
}
function Ji(e, t) {
  if (!e || !t) return null;
  const n = e.status?.history ?? [], r = t.status?.history ?? [], s = n[0] ? te(n[0].version) : null, a = r[0] ? te(r[0].version) : null;
  if (!s || !a) return null;
  if (s === a) return { kind: "same" };
  const i = $d(e, t, s, a);
  if (i) return i;
  const o = r.slice(1).some((c) => te(c.version) === s), l = n.slice(1).some((c) => te(c.version) === a);
  if (o && !l) {
    const c = [];
    for (const d of r) {
      const f = te(d.version);
      if (c[c.length - 1] !== f && c.push(f), f === s) break;
    }
    const u = c.indexOf(s);
    return { kind: "behind", otherVersion: a, by: u >= 0 ? u : null };
  }
  if (l && !o) {
    const c = [];
    for (const d of n) {
      const f = te(d.version);
      if (c[c.length - 1] !== f && c.push(f), f === a) break;
    }
    const u = c.indexOf(a);
    return { kind: "ahead", otherVersion: a, by: u >= 0 ? u : null };
  }
  return { kind: "divergent", otherVersion: a };
}
function $d(e, t, n, r) {
  for (const s of [e, t]) {
    const a = s.status?.availableReleases;
    if (!Array.isArray(a) || a.length === 0) continue;
    const i = a.findIndex((l) => te(l) === n), o = a.findIndex((l) => te(l) === r);
    if (!(i === -1 || o === -1))
      return i === o ? { kind: "same" } : i < o ? { kind: "behind", otherVersion: r, by: o - i } : { kind: "ahead", otherVersion: r, by: i - o };
  }
  return null;
}
function Bd(e, t = {}) {
  if (!e) return null;
  const n = t.now ?? /* @__PURE__ */ new Date(), r = t.bakeThresholdMs ?? 3600 * 1e3, s = e.status?.history?.[0];
  if (!s || !s.timestamp) return null;
  const a = n.getTime() - new Date(s.timestamp).getTime();
  return s.bakeStatus === "InProgress" && a > r ? { kind: "baking", durationMs: a } : s.bakeStatus === "Deploying" && a > r ? { kind: "deploying", durationMs: a } : null;
}
function jd(e, t, n, r = {}) {
  if (!e || !t || e.spec?.wantedVersion) return null;
  const s = Ji(e, t);
  if (!s || s.kind !== "behind") return null;
  const a = Xn(e);
  if (a.blocked && !As(e, a, r.gateContext))
    return null;
  const i = r.now ?? /* @__PURE__ */ new Date(), o = r.thresholdMs ?? 1440 * 60 * 1e3, l = t.status?.history?.[0]?.timestamp;
  if (!l) return null;
  const c = i.getTime() - new Date(l).getTime();
  return c < o ? null : { kind: "behind", peerEnv: n, peerAdvancedMs: c, behindBy: s.by };
}
function xs(e) {
  if (!e) return null;
  const t = e.toLowerCase();
  return /health.?check|liveness|readiness|alert|firing|error.?rate/.test(t) ? "healthcheck" : /image.?pull|cannot pull|registry|pullbackoff|errimagepull|imagepullbackoff/.test(t) ? "image" : /gate/.test(t) ? "gate" : /test/.test(t) ? "test" : /timeout|timed out|deadline/.test(t) ? "timeout" : /canary|kruise/.test(t) ? "canary" : /manifest|render|kustom|invalid yaml|invalid spec/.test(t) ? "manifest" : /permission|forbidden|unauthorized|rbac/.test(t) ? "permission" : /crashloop|oom|killed/.test(t) ? "crash" : /network|dial|connection refused|unreachable/.test(t) ? "network" : "failed";
}
function Qi(e) {
  return xs(e) === "healthcheck" ? "healthcheck" : "deploy";
}
function Rs(e, t = /* @__PURE__ */ new Date()) {
  const n = new Date(e), r = Math.max(0, Math.floor((t.getTime() - n.getTime()) / 1e3));
  if (r < 60) return `${r}s`;
  const s = Math.floor(r / 60);
  if (s < 60) return `${s}m`;
  const a = Math.floor(s / 60);
  if (a < 24) return `${a}h`;
  const i = Math.floor(a / 24);
  if (i < 90) return `${i}d`;
  const o = Math.floor(i / 30);
  return o < 12 ? `${o}mo` : `${Math.floor(o / 12)}y`;
}
const Pd = {
  ns: 1e-6,
  us: 1e-3,
  µs: 1e-3,
  μs: 1e-3,
  ms: 1,
  s: 1e3,
  m: 6e4,
  h: 36e5
};
function Ls(e) {
  if (!e) return 0;
  const t = /(\d+(?:\.\d+)?)(ns|us|µs|μs|ms|h|m|s)/g;
  let n = 0, r;
  for (; r = t.exec(e); ) n += parseFloat(r[1]) * Pd[r[2]];
  return n;
}
function te(e) {
  return e.version || e.revision || e.tag;
}
function it(e) {
  if (!e) return e ?? "";
  if (/^[0-9a-f]{40}$/i.test(e)) return e.slice(0, 7);
  const t = e.match(/^(.+-)([0-9a-f]{12,})$/i);
  return t ? t[1] + t[2].slice(0, 7) : e;
}
function Hd(e) {
  if (!e) return 0;
  if (Array.isArray(e.releaseCandidates)) return e.releaseCandidates.length;
  const t = e.availableReleases ?? [], n = t.findIndex((r) => r.tag === e.currentVersion || r.version === e.currentVersion);
  return n < 0 ? 0 : t.length - 1 - n;
}
function Vd(e, t) {
  const n = e?.status;
  return n && Array.isArray(n.releaseCandidates) ? n.releaseCandidates.length : t ? xr(t) : Hd(n);
}
const Ud = /* @__PURE__ */ new Set(["dev", "development", "test", "testing", "qa", "staging", "stage", "preprod", "prod", "production", "default"]), eo = (e) => {
  const t = (e ?? "").trim().toLowerCase();
  return !t || Ud.has(t) ? "default" : t;
};
function Lr(e) {
  return new Set(e.map(eo)).size;
}
function to(e, t = "") {
  return e > 1 ? `${e} ${t ? t + " " : ""}regions` : null;
}
const Wd = /^HealthCheck '([^']+)' in namespace '[^']*' is not healthy \([^)]*\)(?::\s*(.*))?$/s;
function zd(e) {
  const t = Wd.exec(e ?? "");
  return t ? { check: t[1] || null, detail: (t[2] ?? "").trim() || null } : { check: null, detail: null };
}
function Gd(e) {
  const t = (e?.status?.conditions ?? []).find((a) => a?.type === "DeploymentBlocked");
  if (!t || t.status !== "True") return null;
  const n = t.message ?? "", { check: r, detail: s } = zd(n);
  return { check: r, detail: s, raw: n, since: t.lastTransitionTime ?? null };
}
function qd(e) {
  const t = e?.status?.history?.[0];
  if (!t?.timestamp) return null;
  const n = new Date(t.timestamp).getTime(), r = t.lastRetryTimestamp ? new Date(t.lastRetryTimestamp).getTime() : 0, s = Math.max(n, Number.isFinite(r) ? r : 0);
  return Number.isFinite(s) ? new Date(s) : null;
}
function Kd(e, t) {
  const n = e?.status?.status;
  if (n === "Failed" || n === "Unhealthy") return "failing";
  if (n !== "Healthy") return "pending";
  const r = e?.status?.lastErrorTime;
  if (!r || !t) return "passing";
  const s = new Date(r).getTime();
  return Number.isFinite(s) && s >= t.getTime() ? "recovered" : "passing";
}
class no extends Map {
  /** @type {Map<K, Source<number>>} */
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ Ae(0);
  #n = /* @__PURE__ */ Ae(0);
  #r = yt || -1;
  /**
   * @param {Iterable<readonly [K, V]> | null | undefined} [value]
   */
  constructor(t) {
    if (super(), t) {
      for (var [n, r] of t)
        super.set(n, r);
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
  #a(t) {
    return yt === this.#r ? /* @__PURE__ */ Ae(t) : Ft(t);
  }
  /** @param {K} key */
  has(t) {
    var n = this.#e, r = n.get(t);
    if (r === void 0) {
      var s = super.get(t);
      if (s !== void 0)
        r = this.#a(0), n.set(t, r);
      else
        return k(this.#t), !1;
    }
    return k(r), !0;
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
    var n = this.#e, r = n.get(t);
    if (r === void 0) {
      var s = super.get(t);
      if (s !== void 0)
        r = this.#a(0), n.set(t, r);
      else {
        k(this.#t);
        return;
      }
    }
    return k(r), super.get(t);
  }
  /**
   * @param {K} key
   * @param {V} value
   * */
  set(t, n) {
    var r = this.#e, s = r.get(t), a = super.get(t), i = super.set(t, n), o = this.#t;
    if (s === void 0)
      s = this.#a(0), r.set(t, s), _e(this.#n, super.size), rt(o);
    else if (a !== n) {
      rt(s);
      var l = o.reactions === null ? null : new Set(o.reactions), c = l === null || !s.reactions?.every(
        (u) => (
          /** @type {NonNullable<typeof v_reactions>} */
          l.has(u)
        )
      );
      c && rt(o);
    }
    return i;
  }
  /** @param {K} key */
  delete(t) {
    var n = this.#e, r = n.get(t), s = super.delete(t);
    return r !== void 0 && (n.delete(t), _e(this.#n, super.size), _e(r, -1), rt(this.#t)), s;
  }
  clear() {
    if (super.size !== 0) {
      super.clear();
      var t = this.#e;
      _e(this.#n, 0);
      for (var n of t.values())
        _e(n, -1);
      rt(this.#t), t.clear();
    }
  }
  #s() {
    k(this.#t);
    var t = this.#e;
    if (this.#n.v !== t.size) {
      for (var n of super.keys())
        if (!t.has(n)) {
          var r = this.#a(0);
          t.set(n, r);
        }
    }
    for ([, r] of this.#e)
      k(r);
  }
  keys() {
    return k(this.#t), super.keys();
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
    return k(this.#n), super.size;
  }
}
const Yd = new no(), Zd = (e, t, n) => `${e ?? ""}/${t ?? ""}/${n ?? ""}`, Xd = (e) => {
  const t = e.split("/").filter(Boolean);
  return t[0] === "rollouts" && t.length >= 4 ? Zd(t[1], t[2], t[3]) : null;
}, Jd = (e) => Yd.get(e) ?? null;
new no();
wt({ disconnected: !1, pending: 0, settled: !1 });
const Qd = 10;
function ro(e) {
  const t = e?.status?.history ?? [], n = e?.spec?.versionHistoryLimit ?? Qd;
  return t.length >= n;
}
function Ur(e) {
  return e?.tag || e?.version || null;
}
function Os(e) {
  const t = e?.status?.history ?? [], r = (e?.status?.availableReleases ?? []).map((s) => Ur(s));
  return t.map((s, a) => {
    const i = t[a + 1];
    if (!i)
      return ro(e) ? {
        kind: "unknown",
        word: "Unknown",
        sentence: `What ${te(s.version)} replaced is unknown — it is the oldest deploy the retained history (last ${t.length}) still holds.`
      } : null;
    const o = Ur(s.version), l = Ur(i.version);
    if (!o || !l) return null;
    const c = te(i.version), u = te(s.version);
    if (o === l)
      return {
        kind: "redeploy",
        word: "Redeployed",
        sentence: `Redeployed the same release, ${u}.`
      };
    const d = r.indexOf(o), f = r.indexOf(l);
    if (d === -1 || f === -1) return null;
    const p = Math.abs(f - d), w = p === 1 ? "" : "s";
    return d < f ? {
      kind: "rollback",
      by: p,
      from: c,
      to: u,
      word: "Rolled back",
      sentence: `Rolled back ${p} release${w}: ${c} → ${u}.`
    } : {
      kind: "forward",
      by: p,
      from: c,
      to: u,
      word: "Moved forward",
      sentence: `Moved forward ${p} release${w}: ${c} → ${u}.`
    };
  });
}
const ef = () => null;
let ca = /* @__PURE__ */ Ae({});
const ua = {
  get: (e) => k(ca)[e],
  set: (e) => {
    _e(ca, e);
  }
};
function so(e, t = {}) {
  const n = new URLSearchParams(t), r = n.size ? `${e}?${n}` : e;
  return ua.get(r) ?? ua.get(e) ?? null;
}
const tf = (e, t, n) => `/api/rollouts/${e}/${t}/commits`;
function ao(e, t, n = {}) {
  const r = Bd(e, { now: n.now, bakeThresholdMs: n.bakeThresholdMs });
  if (r) return r;
  const s = Id(e, { now: n.now, gateContext: n.gateContext });
  if (s) return s;
  const a = Xn(e);
  if (a.blocked && !As(e, a, n.gateContext))
    return null;
  for (const i of t) {
    const o = jd(e, i.rollout, i.envName, {
      now: n.now,
      thresholdMs: n.behindThresholdMs,
      gateContext: n.gateContext
    });
    if (o) return o;
  }
  return null;
}
const nn = {
  failed: 0,
  stuck: 1,
  held: 2,
  deploying: 3,
  queued: 4,
  live: 5
};
function io(e) {
  return e.state === "gated" || e.state === "pinned" || e.state === "waiting-upstream" ? e.held ?? !0 : !1;
}
function nf(e) {
  return e.state === "failed" || e.state === "rolled-back";
}
function da(e) {
  return nf(e) ? nn.failed : e.stuck ? nn.stuck : io(e) ? nn.held : e.state === "live" || e.state === "not-built" ? nn.live : e.state === "queued" ? nn.queued : nn.deploying;
}
function oo(e) {
  return e.length === 0 ? null : e.reduce((t, n) => {
    const r = da(n.cell), s = da(t.cell);
    return r !== s ? r < s ? n : t : n.cell.envRank !== t.cell.envRank ? n.cell.envRank < t.cell.envRank ? n : t : n.cell.cluster.localeCompare(t.cell.cluster) < 0 ? n : t;
  });
}
function nr(e) {
  return e?.tag || e?.version || null;
}
function rf(e) {
  const t = e?.status?.history ?? [], n = e?.status?.availableReleases ?? [];
  if (t.length < 2 || n.length === 0) return null;
  const r = nr(t[0]?.version), s = nr(t[1]?.version);
  if (!r || !s || r === s) return null;
  const a = n.findIndex((o) => nr(o) === r), i = n.findIndex((o) => nr(o) === s);
  return a === -1 || i === -1 || a >= i ? null : {
    from: te(t[1].version),
    to: te(t[0].version),
    by: i - a
  };
}
function sf(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of t) {
    const s = r.spec?.rolloutRef?.name;
    if (!s || !r.spec?.environment) continue;
    const a = Dt(r, t), i = e.find((o) => Cs(o, r));
    i && (n.has(s) || n.set(s, []), n.get(s).push({ envName: a, rollout: i }));
  }
  for (const r of n.values())
    r.sort((s, a) => _s(s.envName, a.envName));
  return n;
}
function af(e, t, n) {
  if (e.spec?.wantedVersion) return null;
  const r = n.get(e.metadata?.name ?? "");
  if (!r || r.length < 2) return null;
  let s = null;
  for (const o of r) {
    if (o.envName === t) continue;
    const l = Ji(e, o.rollout);
    if (!l || l.kind !== "behind") continue;
    const c = { fromEnv: o.envName, version: l.otherVersion, behindBy: l.by };
    (!s || (c.behindBy ?? 0) > (s.behindBy ?? 0)) && (s = c);
  }
  const a = yn(e);
  if (a === null || a === 0) return s;
  if (s) return { ...s, behindBy: a };
  let i = null;
  for (const o of r) {
    if (o.envName === t) continue;
    const l = yn(o.rollout);
    if (l === null || l >= a) continue;
    const c = o.rollout.status?.history?.[0]?.version ? te(o.rollout.status.history[0].version) : null;
    c && (!i || l < i.newer) && (i = { envName: o.envName, version: c, newer: l });
  }
  return i ? { fromEnv: i.envName, version: i.version, behindBy: a } : s;
}
function of(e, t, n, r, s) {
  const a = sf(e, t), i = Ku(e, t);
  return e.map((o) => {
    const l = o.status?.history?.[0], c = t.find((T) => Cs(o, T)), u = wr(
      o,
      c,
      c?.spec?.environment ? Dt(c, t) : null
    ), d = l?.bakeStatus || "None", f = d === "InProgress" || d === "Deploying";
    let p;
    d === "Failed" ? p = "failed" : f ? p = "active" : l ? p = "succeeded" : p = "pending";
    const w = Ss(u), _ = c?.spec?.environment ? Dt(c, t) : "", v = i.get(o) ?? { kind: "unknown" }, g = _ ? af(o, _, a) : null, y = g ? { ...g, behindBy: xr(v) } : null, h = (a.get(o.metadata?.name ?? "") ?? []).filter(
      (T) => T.envName !== _
    );
    let E = null;
    if (d === "Failed") {
      const T = l?.version ? te(l.version) : null;
      for (const A of o.status?.history ?? []) {
        if (A.bakeStatus !== "Succeeded") continue;
        const S = te(A.version);
        if (S && S !== T) {
          E = S;
          break;
        }
      }
    }
    const C = s ? Kt(o, r, { contractHolds: s(o), now: n }) : Kt(o, r, { now: n }), b = Hi(C, _);
    return {
      ns: o.metadata?.namespace || "",
      name: o.metadata?.name || "",
      title: o.status?.title || o.metadata?.name || "",
      envKey: u?.name || "",
      envDisplay: w,
      envName: _,
      tier: c ? ot(c.spec?.environment) : null,
      site: c ? Ut(c) : null,
      wave: c ? bs(c) : null,
      role: c ? ks(c) : null,
      ready: c ? Un(c).ready : null,
      duplicateSite: c ? Un(c).blocker?.kind === "duplicate" : !1,
      theme: u,
      version: l?.version ? te(l.version) : null,
      timestamp: l?.timestamp || null,
      bakeStatus: d,
      statusKey: p,
      isRunning: f,
      bakeStatusMessage: l?.bakeStatusMessage || null,
      failureCategory: d === "Failed" ? xs(l?.bakeStatusMessage) : null,
      previousSucceededVersion: E,
      pinnedVersion: o.spec?.wantedVersion || null,
      rolledBack: rf(o),
      stuck: ao(o, h, { now: n, gateContext: r }),
      checkFailure: Gd(o),
      rank: v,
      behind: y,
      held: b.held,
      heldCause: b.cause,
      // ⭐ qa12 (squad-rollout gates-2 follow-up, 2026-10-11): the
      // FRONTIER candidate's own label, never the whole-story blend
      // — `heldVerdict`'s own `.frontier.causeLabel` is read off ONLY
      // the eligible candidate's `classifiedGates`, which is what
      // keeps a newer chain-refused candidate's gate from naming the
      // cause for an OLDER candidate this environment really refuses.
      heldCauseLabel: b.held ? b.frontier?.causeLabel ?? null : null,
      waitsForEnv: b.waitsForEnv,
      waveWait: b.waveWait ?? null,
      rollout: o,
      sourceURL: pn(o),
      sourceCluster: bn(o)
    };
  });
}
function In(e, t, n) {
  const r = ["github.com", e, t].map(encodeURIComponent).join("/");
  return "number" in n ? _r(`/changes/${r}/pull/${n.number}`) : _r(`/changes/${r}/${encodeURIComponent(n.sha)}`);
}
const lf = /^rollout\.kuberik\.com\/substitute\.[^/]+\.from$/;
function cf(e, t, n) {
  const r = e.metadata?.namespace, s = e.metadata?.name;
  if (!r || !s) return [];
  const a = pn(e), i = /* @__PURE__ */ new Set();
  for (const l of t) {
    if (l.metadata?.namespace !== r || pn(l) !== a) continue;
    const c = l.metadata?.annotations || {};
    if (!Object.entries(c).some(
      ([f, p]) => lf.test(f) && p === s
    )) continue;
    const d = l.status?.inventory?.entries ?? [];
    for (const f of d)
      typeof f?.id == "string" && f.id.endsWith("_rollouts.kruise.io_Rollout") && i.add(f.id);
  }
  if (i.size === 0) return [];
  const o = [];
  for (const l of n) {
    const c = l.metadata?.namespace, u = l.metadata?.name;
    !c || !u || pn(l) === a && i.has(`${c}_${u}_rollouts.kruise.io_Rollout`) && o.push(l);
  }
  return o;
}
function lo(e, t) {
  const n = t?.status?.history?.[0];
  if (!n || n.bakeStatus !== "Deploying" || !n.timestamp) return !1;
  const r = e.status?.canaryStatus?.lastUpdateTime;
  if (!r) return !1;
  const s = Date.parse(r), a = Date.parse(n.timestamp);
  return Number.isFinite(s) && Number.isFinite(a) && s < a;
}
function uf(e, t) {
  if (t && lo(e, t))
    return (e.spec?.strategy?.canary?.steps ?? []).map(() => "pending");
  const n = e.spec?.strategy?.canary?.steps ?? [], r = e.status?.canaryStatus?.currentStepIndex, s = e.status?.canaryStatus?.currentStepState, a = e.status?.conditions ?? [], i = a.some((u) => u.type === "Stalled" && u.status === "True"), o = a.some(
    (u) => u.type === "KuberikBakeHealthy" && u.status === "False"
  ), l = s === "Completed", c = [];
  for (let u = 0; u < n.length; u++) {
    const d = u + 1, f = r === d;
    l || r !== void 0 && d < r ? c.push("done") : f && (i || o) ? c.push("fail") : f ? c.push("active") : c.push("pending");
  }
  return c;
}
function df(e, t) {
  return t && lo(e, t) ? !1 : e.status?.canaryStatus?.currentStepState === "Completed";
}
function ff(e, t) {
  const n = e.status?.history?.[0]?.bakeStatus || "None";
  if (t.length === 0) {
    const [i, o] = pf(e);
    return { tracks: [{ name: "", stages: [i] }], bake: o };
  }
  const r = t.every((i) => df(i, e));
  let s = "pending";
  return r && (n === "Succeeded" ? s = "done" : n === "Failed" ? s = "fail" : n === "InProgress" || n === "Deploying" ? s = "active" : n === "Cancelled" && (s = "cancelled")), { tracks: t.map((i) => ({
    name: i.metadata?.name ?? "",
    stages: uf(i, e)
  })), bake: s };
}
function pf(e) {
  const t = e.status?.history?.[0], n = t?.bakeStatus || "None";
  if (n === "Succeeded") return ["done", "done"];
  if (n === "InProgress") return ["done", "active"];
  if (n === "Deploying") return ["active", "pending"];
  if (n === "Cancelled") return ["done", "cancelled"];
  if (n === "Failed") {
    const r = xs(t?.bakeStatusMessage);
    return r === "test" || r === "image" ? ["fail", "pending"] : ["done", "fail"];
  }
  return ["pending", "pending"];
}
const Wt = ["dev", "test", "staging", "other", "prod"];
function Fe(e) {
  const t = ot(e);
  if (t) return t;
  const n = ut(e);
  return n <= 1 ? "dev" : n <= 3 ? "test" : n <= 5 ? "staging" : n === 6 ? "other" : "prod";
}
const Xe = [
  "failed",
  "stuck",
  "held",
  "deploying",
  "checking",
  "behind",
  "newest",
  "none"
];
function vn(e) {
  return e.statusKey === "failed" || e.checkFailure != null ? "failed" : e.stuck != null ? "stuck" : e.bakeStatus === "Deploying" ? "deploying" : e.bakeStatus === "InProgress" ? "checking" : e.statusKey === "pending" || e.bakeStatus === "None" ? "none" : Es(e) ? "held" : xr(e.rank) > 0 || e.rank.kind === "diverged" ? "behind" : "newest";
}
function hf(e) {
  const t = Ss(e.theme) || e.envName || e.envDisplay || "";
  return {
    card: e,
    tier: Fe(e.envName || t),
    env: t,
    state: vn(e),
    behind: Vd(e.rollout, e.rank)
  };
}
function vf(e) {
  let t = null;
  for (const n of e)
    (!t || Xe.indexOf(n.state) < Xe.indexOf(t.state)) && (t = n);
  return t;
}
function br(e) {
  return !!(e.envName || Ss(e.theme));
}
function co(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e) {
    if (!br(r) || r.duplicateSite) continue;
    const s = t.get(r.name) ?? [];
    s.push(r), t.set(r.name, s);
  }
  const n = [];
  for (const [r, s] of t) {
    const a = s.map(hf), i = {};
    for (const u of a) (i[u.tier] ??= []).push(u);
    for (const u of Wt) i[u]?.sort((d, f) => d.env.localeCompare(f.env));
    const o = Wt.filter((u) => u !== "prod").flatMap((u) => i[u] ?? []), l = i.prod ?? [], c = vf(a);
    n.push({ app: r, byTier: i, stages: o, prod: l, state: c?.state ?? "none", lead: c });
  }
  return n.sort(
    (r, s) => Xe.indexOf(r.state) - Xe.indexOf(s.state) || r.app.localeCompare(s.app)
  );
}
function uo(e) {
  if (e.length === 0) return null;
  const t = [...e].sort((r, s) => r - s), n = t.length >> 1;
  return t.length % 2 ? t[n] : Math.round((t[n - 1] + t[n]) / 2);
}
function fa(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.deploys) {
    if (!n.version || !Number.isFinite(n.ms) || n.inFlight) continue;
    const r = t.get(n.version);
    (r === void 0 || n.ms < r) && t.set(n.version, n.ms);
  }
  return t;
}
function mf(e) {
  if (e.length < 2) return null;
  const t = [...e].sort((u, d) => u.order - d.order), n = t[0], r = t.filter((u) => u.prod && u !== n), s = r.length > 0 ? r : [t[t.length - 1]];
  if (s.length === 1 && s[0] === n) return null;
  const a = fa(n), i = /* @__PURE__ */ new Map();
  for (const u of s)
    if (u !== n)
      for (const [d, f] of fa(u)) {
        const p = i.get(d);
        (p === void 0 || f < p) && i.set(d, f);
      }
  const o = [];
  for (const [u, d] of a) {
    const f = i.get(u);
    if (f === void 0) continue;
    const p = f - d;
    p <= 0 || o.push(p);
  }
  if (o.length === 0) return null;
  o.sort((u, d) => u - d);
  const l = o.length >> 1;
  return {
    medianMs: o.length % 2 === 1 ? o[l] : Math.round((o[l - 1] + o[l]) / 2),
    samples: o.length,
    fromLabel: n.label,
    toLabel: r.length > 0 ? "prod" : s[0].label
  };
}
const gf = 36e5, Wr = 24 * gf, wf = {
  "24h": { span: Wr, bins: 24, label: "last 24 hours", prev: "the 24 hours before" },
  "7d": { span: 7 * Wr, bins: 28, label: "last 7 days", prev: "the 7 days before" },
  "30d": { span: 30 * Wr, bins: 30, label: "last 30 days", prev: "the 30 days before" }
};
function $n(e) {
  const t = e.rollout, n = t.status?.history?.[0]?.version, r = n && te(n) || null, s = t.status?.availableReleases ?? [], a = s.findIndex((l) => !!l && (l.version === r || l.tag === r)), o = (t.status?.releaseCandidates?.length ? t.status.releaseCandidates : s.slice(a + 1)).filter(
    (l) => !!l?.created
  ).reduce((l, c) => Math.min(l, new Date(c.created).getTime()), 1 / 0);
  return Number.isFinite(o) ? o : null;
}
function rn(e) {
  return vn(e);
}
function cr(e, t) {
  if (!t.gateContext) return "other";
  const n = Kt(e.rollout, t.gateContext, {
    contractHolds: t.contractHoldsFor?.(e.rollout)
  });
  return n.blocked ? n.person.length > 0 ? "approval" : n.upstream.some((r) => r.kind === "dependency") ? "dependency" : n.upstream.some((r) => r.kind === "promotion") ? "order" : "other" : "other";
}
function _f(e, t) {
  const n = [];
  for (const r of e) {
    const s = t.get(r), a = s ? br(s) : !1;
    for (const i of r.status?.history ?? []) {
      if (!i.timestamp) continue;
      const o = new Date(i.timestamp).getTime();
      Number.isFinite(o) && n.push({ ms: o, status: i.bakeStatus ?? "", rollout: r, mapped: a });
    }
  }
  return n;
}
function bf(e) {
  const t = e.rollout.status?.history?.[0];
  return !!t && t.bakeStatus === "Failed" && !!t.timestamp && new Date(t.timestamp).getTime() === e.ms;
}
function fo() {
  return { failed: 0, stuck: 0, held: 0, deploying: 0, checking: 0, behind: 0, newest: 0 };
}
function sn() {
  return {
    apps: /* @__PURE__ */ new Set(),
    places: 0,
    regions: 0,
    regionNames: /* @__PURE__ */ new Set(),
    placesByState: fo(),
    worst: /* @__PURE__ */ new Map(),
    causeApps: { order: /* @__PURE__ */ new Set(), approval: /* @__PURE__ */ new Set(), dependency: /* @__PURE__ */ new Set(), other: /* @__PURE__ */ new Set() }
  };
}
function pa(e, t, n, r) {
  const s = n.state;
  e.apps.add(t);
  const a = e.worst.get(t);
  if ((a == null || Xe.indexOf(s) < Xe.indexOf(a)) && e.worst.set(t, s), e.places++, n.tier === "prod" && (e.regionNames.add(n.env), e.regions = Lr([...e.regionNames])), s in e.placesByState && e.placesByState[s]++, s === "held") {
    const i = cr(n.card, r);
    e.causeApps[i].add(t);
  }
}
function ha(e) {
  return {
    apps: e.apps.size,
    places: e.places,
    regions: e.regions,
    appsByState: kf(e.worst),
    placesByState: e.placesByState,
    appsByCause: {
      order: e.causeApps.order.size,
      approval: e.causeApps.approval.size,
      dependency: e.causeApps.dependency.size,
      other: e.causeApps.other.size
    }
  };
}
function kf(e) {
  const t = fo();
  for (const n of e.values()) n in t && t[n]++;
  return t;
}
function yf(e, t, n) {
  const r = [...new Set(e)];
  return r.length === t && r.length > 1 ? [n] : r.length <= 2 ? r.sort(_s) : [to(Lr(r), n) ?? r.join(", ")];
}
function Sf(e, t, n, r, s = {}) {
  const a = wf[r], i = n, o = i - a.span, l = o - a.span, c = new Map(e.map((N) => [N.rollout, N])), u = _f(t, c), d = u.reduce((N, G) => Math.min(N, G.ms), 1 / 0), f = Number.isFinite(d) && d <= l + a.span * 0.05;
  let p = 0, w = 0, _ = 0, v = 0, g = 0, y = 0;
  for (const N of u)
    N.ms >= o && N.ms <= i ? (p++, N.mapped || _++, N.status === "Failed" && (v++, bf(N) || y++)) : f && N.ms >= l && N.ms < o && (w++, N.status === "Failed" && g++);
  const h = new Set(e.map((N) => N.name)).size, E = e.filter(br), C = new Set(E.map((N) => N.name)).size, b = e.length, T = E.length, A = e.filter((N) => Fe(N.envName) === "prod").length, S = co(e), P = e.filter((N) => rn(N) === "held"), m = S.filter((N) => N.state === "held"), M = m.flatMap(
    (N) => [...N.stages, ...N.prod].filter((G) => G.state === "held").map((G) => G.card)
  ), I = new Set(S.map((N) => N.app)), O = /* @__PURE__ */ new Map();
  for (const N of e) {
    const G = O.get(N.name) ?? [];
    G.push(N), O.set(N.name, G);
  }
  const $ = [...O.keys()].filter((N) => !I.has(N)), R = /* @__PURE__ */ new Map();
  for (const N of $) {
    let G = null;
    for (const ee of O.get(N)) {
      const Be = rn(ee);
      (!G || Xe.indexOf(Be) < Xe.indexOf(G.state)) && (G = { card: ee, state: Be });
    }
    R.set(N, G);
  }
  const L = $.filter((N) => R.get(N).state === "held"), H = $.filter((N) => R.get(N).state === "behind");
  let U = 0;
  for (const N of S) {
    const G = /* @__PURE__ */ new Map();
    for (const ee of [...N.stages, ...N.prod]) {
      const Be = G.get(ee.tier);
      (Be == null || Xe.indexOf(ee.state) < Xe.indexOf(Be)) && G.set(ee.tier, ee.state);
    }
    for (const ee of G.values()) ee === "held" && U++;
  }
  const W = { order: 0, approval: 0, dependency: 0, other: 0 }, x = [], j = { order: /* @__PURE__ */ new Set(), approval: /* @__PURE__ */ new Set(), dependency: /* @__PURE__ */ new Set(), other: /* @__PURE__ */ new Set() };
  for (const N of M) {
    const G = cr(N, s);
    W[G]++, j[G].add(N.name);
    const ee = $n(N);
    ee != null && x.push({ ms: Math.max(0, n - ee), app: N.name, env: N.envDisplay || N.envName || "" });
  }
  const z = x.reduce((N, G) => !N || G.ms > N.ms ? G : N, null);
  for (const N of L) {
    const G = cr(R.get(N).card, s);
    j[G].add(N);
  }
  const J = M.filter((N) => N.heldCause !== "person"), K = L.filter((N) => R.get(N).card.heldCause !== "person"), le = /* @__PURE__ */ new Set([...J.map((N) => N.name), ...K]), Z = [];
  for (const N of J) {
    const G = $n(N);
    G != null && Z.push(Math.max(0, n - G));
  }
  for (const N of K) {
    const G = $n(R.get(N).card);
    G != null && Z.push(Math.max(0, n - G));
  }
  const Q = Z.length > 0 ? Math.max(...Z) : null;
  let ae = null;
  if (le.size === 1) {
    const N = [...le][0], G = e.filter((ee) => ee.name === N && ee.held && ee.heldCause !== "person" && ee.envName);
    if (G.length > 0) {
      const ee = /* @__PURE__ */ new Map();
      for (const je of G) {
        const We = Wt.indexOf(Fe(je.envName));
        (ee.get(We) ?? ee.set(We, []).get(We)).push(je);
      }
      const Be = [...ee.entries()].sort(([je], [We]) => je - We).map(([je, We]) => {
        const Ir = [...new Map(We.map((ke) => [ke.envName, ke])).values()], Jn = Wt[je], $r = new Set(e.filter((ke) => ke.name === N && Fe(ke.envName) === Jn).map((ke) => ke.envName));
        return yf(
          Ir.map((ke) => ke.envDisplay || ke.envName || Fe(ke.envName)),
          $r.size,
          Jn
        );
      }), xn = kn(Be.flat()), Dr = Math.min(...ee.keys()), Fr = ee.get(Dr)[0];
      ae = { app: N, env: xn, causeLabel: Fr.heldCauseLabel ?? "a rule" };
    } else {
      const ee = R.get(N).card;
      ae = { app: N, env: "", causeLabel: ee.heldCauseLabel ?? "a rule" };
    }
  }
  const he = e.filter((N) => rn(N) === "failed"), Te = e.filter((N) => rn(N) === "deploying"), F = e.filter((N) => rn(N) === "checking"), ve = e.filter((N) => rn(N) === "stuck"), Ze = e.filter(
    (N) => Wn(N) || M.includes(N) && cr(N, s) === "approval"
  ), be = S.filter((N) => [...N.stages, ...N.prod].every((G) => G.state === "newest")).length, Le = [.../* @__PURE__ */ new Set([...m.map((N) => N.app), ...L])].sort(), $e = [
    .../* @__PURE__ */ new Set([...S.filter((N) => N.state === "behind").map((N) => N.app), ...H])
  ].sort(), ge = {
    dev: sn(),
    test: sn(),
    staging: sn(),
    other: sn(),
    prod: sn()
  }, tt = /* @__PURE__ */ new Map();
  for (const N of S)
    for (const G of [...N.stages, ...N.prod]) {
      pa(ge[G.tier], N.app, G, s);
      const ee = G.env || G.tier;
      pa(tt.get(ee) ?? tt.set(ee, sn()).get(ee), N.app, G, s);
    }
  const Oe = Object.fromEntries(Wt.map((N) => [N, ha(ge[N])])), Mt = {};
  for (const [N, G] of tt) Mt[N] = ha(G);
  const $t = (N) => N.filter((G) => !br(G)).length;
  return {
    range: r,
    start: o,
    end: i,
    hasPrev: f,
    apps: h,
    mappedApps: C,
    places: b,
    mappedPlaces: T,
    regions: A,
    deploys: { value: p, prev: f ? w : null, unmapped: _ },
    held: {
      apps: Le.length,
      appIds: Le,
      approvalAppIds: [...j.approval].sort(),
      places: P.length,
      plates: U,
      regions: P.filter((N) => Fe(N.envName) === "prod").length,
      unmapped: $t(P),
      byCause: W,
      byCauseApps: { order: j.order.size, approval: j.approval.size, dependency: j.dependency.size, other: j.other.size },
      medianMs: uo(x.map((N) => N.ms)),
      longestMs: z?.ms ?? null,
      longestSubject: z ? { app: z.app, env: z.env } : null,
      ruleApps: le.size,
      ruleSingle: ae,
      ruleLongestMs: Q
    },
    failed: {
      live: {
        apps: new Set(he.map((N) => N.name)).size,
        places: he.length,
        regions: he.filter((N) => Fe(N.envName) === "prod").length,
        unmapped: $t(he)
      },
      inWindow: { value: v, prev: f ? g : null },
      resolvedInWindow: y
    },
    inMotion: {
      apps: new Set([...Te, ...F].map((N) => N.name)).size,
      places: Te.length + F.length,
      deploying: Te.length,
      checking: F.length,
      unmapped: $t([...Te, ...F])
    },
    stuck: { apps: new Set(ve.map((N) => N.name)).size, places: ve.length },
    needsYou: {
      apps: new Set(Ze.map((N) => N.name)).size,
      places: Ze.length
    },
    newestEverywhere: { apps: be, of: C },
    behind: { apps: $e.length, appIds: $e },
    byTier: Oe,
    byEnv: Mt
  };
}
function Cf(e, t, n) {
  if (!e || !t) return null;
  const r = Ls(t);
  if (!r || r <= 0) return null;
  const s = new Date(e).getTime();
  if (Number.isNaN(s)) return null;
  const a = Math.max(0, n.getTime() - s), i = Math.min(1, a / r);
  return { elapsedMs: a, totalMs: r, fraction: i };
}
const Mf = 5 * 6e4, va = (e) => e.set ? "prod" : e.label, ma = (e) => e.rollout.status?.history?.[0];
function Ef(e) {
  if (e.heldCause === "dependency" && e.heldCauseLabel && e.heldCauseLabel !== "a dependency") return { name: e.heldCauseLabel, app: e.heldCauseLabel };
  const t = (e.rollout.status?.gates ?? []).find((n) => n.passing === !1 && !n.name?.startsWith("promotion-"));
  return t?.name ? { name: t.name, app: null } : null;
}
function Tf(e, t) {
  const n = t.cycleMs ?? Mf;
  for (let r = 0; r < e.plates.length; r++) {
    const s = e.plates[r], a = va(s), i = s.nodes.filter((d) => d.state === "held");
    if (i.length) {
      if (i.some((p) => t.isApproval(p.card))) return { kind: "approval", place: a };
      const d = i[0].card;
      if (d.heldCause === "clock" && d.heldCauseLabel) return { kind: "window", place: a, name: d.heldCauseLabel };
      const f = Ef(d);
      if (f) return { kind: "rule", place: a, ...f };
    }
    const o = s.nodes.find((d) => d.state === "behind");
    if (!o && !i.length) continue;
    const l = r > 0 ? e.plates[r - 1] : null;
    if (l) {
      const d = l.nodes.find((v) => v.state === "checking");
      if (d) {
        const v = ma(d.card), g = Cf(v?.bakeStartTime, d.card.rollout.spec?.bakeTime, t.now);
        return { kind: "bake", place: a, upstream: va(l), id: t.idOf(d.card.version), leftMs: g ? Math.max(0, g.totalMs - g.elapsedMs) : null };
      }
      if (l.nodes.some((v) => v.state === "deploying")) return null;
      const f = l.nodes.find((v) => v.state === "newest") ?? l.nodes[0];
      if (!o || o.card.version && o.card.version === f.card.version) continue;
      const p = ma(f.card), w = p?.bakeEndTime ?? p?.timestamp ?? null, _ = w ? t.now.getTime() - Date.parse(w) : null;
      return _ == null || _ <= n ? { kind: "cycle", place: a, usualMs: n, waitedMs: _ } : { kind: "stalled", place: a, id: t.idOf(f.card.version), forMs: _ };
    }
    if (!o) continue;
    const c = [...o.card.rollout.status?.availableReleases ?? []].sort((d, f) => Date.parse(f.created ?? "") - Date.parse(d.created ?? ""))[0], u = c?.created ? t.now.getTime() - Date.parse(c.created) : null;
    return u == null || u <= n ? { kind: "cycle", place: a, usualMs: n, waitedMs: u } : { kind: "stalled", place: a, id: t.idOf(c?.version ?? c?.tag ?? null), forMs: u };
  }
  return null;
}
function un(e) {
  return Rs((/* @__PURE__ */ new Date(0)).toISOString(), new Date(Math.max(0, e)));
}
Si(["click"]);
const Nf = (e) => !!e.envName && Fe(e.envName) === "prod", Af = (e) => e === "failed" || e === "stuck";
function xf(e, t) {
  const n = e.filter(Nf), r = n.filter((s) => Af(vn(s)));
  return {
    total: n.length,
    failing: r.length,
    failingApps: [...new Set(r.map((s) => s.name))].sort(),
    notDeployed: n.filter((s) => vn(s) === "none").length,
    approvals: n.filter((s) => vn(s) === "held" && t(s)).map((s) => ({ app: s.name, env: s.envName, card: s }))
  };
}
function Rf(e, t, n = null) {
  const r = /* @__PURE__ */ new Map(), s = (o, l) => {
    const c = `${o}|${l ?? ""}`, u = r.get(c) ?? { count: 0, word: o, id: l };
    u.count++, r.set(c, u);
  };
  for (const o of e) {
    const l = o.card.version ? t(o.card.version) : "";
    o.state === "none" || !l ? s("not deployed", null) : o.state === "failed" || o.state === "stuck" ? s("failing on", l) : o.state === "checking" ? s("checking", l) : o.state === "deploying" ? s("deploying", l) : s("on", l);
  }
  const a = ["failing on", "checking", "deploying", "on", "not deployed"], i = [...r.values()].sort((o, l) => a.indexOf(o.word) - a.indexOf(l.word) || l.count - o.count);
  return { total: e.length, buckets: i, heldBefore: n };
}
function Ds(e) {
  return e?.bakeEndTime ?? e?.timestamp ?? null;
}
function dn(e, t) {
  const n = e.rollout?.status?.history?.[0];
  switch (t) {
    case "failed":
      return e.checkFailure?.since ? e.checkFailure.since : Ds(n) ?? e.timestamp ?? null;
    case "deploying":
    case "checking":
    case "stuck":
      return n?.timestamp ?? e.timestamp ?? null;
    case "held":
    case "behind": {
      if (!e.rollout) return null;
      const r = $n(e);
      return r != null ? new Date(r).toISOString() : null;
    }
    default:
      return null;
  }
}
const rr = (e) => Xe.indexOf(e), ga = ["failed", "stuck", "held", "deploying", "checking"];
function zr(e, t) {
  return e === "held" ? t ? "waits for approval" : "held" : e;
}
function Lf(e, t) {
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
  const r = n.map((c) => {
    const u = c.nodes.reduce((w, _) => rr(_.state) < rr(w.state) ? _ : w), d = c.nodes.filter((w) => w.state === u.state).length, f = u.state === "held" && t(u.card);
    let p = null;
    if (ga.includes(u.state)) {
      const w = zr(u.state, f), _ = c.set && d > 1 ? null : u.state === "held" ? (
        // the build the hold keeps out, never the one running
        ((v) => v ? it(v) : null)(Zi(u.card.rollout).held[0]?.build ?? null)
      ) : u.card.version ? it(u.card.version) : null;
      p = { word: c.set && d > 1 ? `${d} ${w}` : w, state: u.state, sha: _ };
    }
    return {
      ...c,
      states: c.nodes.map((w) => w.state === "held" && t(w.card) ? "approval" : w.state),
      healthy: c.nodes.filter((w) => w.state !== "failed" && w.state !== "stuck").length,
      worst: u,
      onNewest: c.nodes.filter((w) => w.state === "newest").length,
      tag: p
    };
  }), s = r.reduce((c, u) => !c || rr(u.worst.state) < rr(c.worst.state) ? u : c, null), a = s?.worst.state ?? "none", i = s?.worst ?? null, o = !!i && a === "held" && t(i.card);
  let l = null;
  if (i && ga.includes(a)) {
    const c = s.nodes.filter((p) => p.state === a).length, u = s.nodes.filter((p) => p.state === a).map((p) => p.env), d = (s.set && c > 1 ? to(Lr(u), "prod") : null) ?? i.env, f = a === "deploying" ? "to" : "in";
    l = { text: `${zr(a, o)} ${f} ${d}`, verb: zr(a, o), rest: ` ${f} ${d}`, state: a };
  } else if (a === "behind") {
    const c = r.find((p) => p.nodes.some((w) => w.state === "behind")), u = c.nodes.find((p) => p.state === "behind"), d = c.set ? "prod" : u.env, f = u.behind > 0 ? `${u.behind} behind` : "behind";
    l = { text: `${f} in ${d} · ${d} next`, verb: f, rest: ` in ${d} · ${d} next`, state: a };
  }
  return {
    app: e.app,
    plates: r,
    state: a,
    phrase: l,
    lead: i,
    approval: o,
    newestEverywhere: r.length > 0 && r.every((c) => c.nodes.every((u) => u.state === "newest")),
    lane: e
  };
}
const Of = "en", po = (
  /** @type {const} */
  ["en"]
), ho = "PARAGLIDE_LOCALE", Df = 3456e4, vo = [
  "cookie",
  "globalVariable",
  "baseLocale"
];
globalThis.__paraglide = {};
let ur, wa = !1, re = () => {
  let e;
  for (const t of vo)
    if (t === "cookie" ? e = $f() : t === "baseLocale" ? e = Of : t === "globalVariable" && ur !== void 0 && (e = ur), e !== void 0) {
      const n = If(e);
      return wa || (ur = n, wa = !0, Ff(n, { reload: !1 })), n;
    }
  throw new Error("No locale found. Read the docs https://inlang.com/m/gerre34r/library-inlang-paraglideJs/errors#no-locale-found");
}, Ff = (e, t) => {
  const n = {
    reload: !0,
    ...t
  };
  let r;
  try {
    r = re();
  } catch {
  }
  for (const s of vo)
    if (s === "globalVariable")
      ur = e;
    else if (s === "cookie") {
      if (typeof document > "u" || typeof window > "u")
        continue;
      const a = window.location.hostname;
      document.cookie = `${ho}=${e}; path=/; max-age=${Df}; domain=${a}`;
    } else if (s === "baseLocale")
      continue;
  n.reload && window.location && e !== r && window.location.reload();
};
function mo(e) {
  return e ? po.includes(e) : !1;
}
function If(e) {
  if (mo(e) === !1)
    throw new Error(`Invalid locale: ${e}. Expected one of: ${po.join(", ")}`);
  return e;
}
function $f() {
  if (typeof document > "u" || !document.cookie)
    return;
  const t = document.cookie.match(new RegExp(`(^| )${ho}=([^;]+)`))?.[2];
  if (mo(t))
    return t;
}
const Bf = (
  /** @type {(inputs: { age: NonNullable<unknown> }) => string} */
  (e) => `held ${e.age}`
), jf = (
  /** @type {(inputs: {}) => string} */
  () => "waits on a rule"
), Pf = (
  /** @type {(inputs: {}) => string} */
  () => "health check failing"
), Hf = (
  /** @type {(inputs: { env: NonNullable<unknown> }) => string} */
  (e) => `Roll back ${e.env}`
), Vf = (
  /** @type {(inputs: {}) => string} */
  () => "Review approval"
), Uf = (
  /** @type {(inputs: {}) => string} */
  () => "failed its health check"
), Wf = (
  /** @type {(inputs: { version: NonNullable<unknown> }) => string} */
  (e) => `rolled back to ${e.version}`
), zf = (
  /** @type {(inputs: { name: NonNullable<unknown> }) => string} */
  (e) => `${e.name} failing`
), Gf = (
  /** @type {(inputs: {}) => string} */
  () => "failed to deploy"
), qf = (
  /** @type {(inputs: { name: NonNullable<unknown>, n: NonNullable<unknown>, span: NonNullable<unknown> }) => string} */
  (e) => `${e.name} ${e.n}× in ${e.span}, expected 0`
), Kf = (
  /** @type {(inputs: { age: NonNullable<unknown> }) => string} */
  (e) => `failed ${e.age} ago, recovered`
), Yf = (
  /** @type {(inputs: { span: NonNullable<unknown>, set: NonNullable<unknown> }) => string} */
  (e) => `bake ${e.span}, set to ${e.set}`
), Zf = (
  /** @type {(inputs: { span: NonNullable<unknown>, usual: NonNullable<unknown> }) => string} */
  (e) => `waiting ${e.span}, usually ${e.usual}`
), Xf = (
  /** @type {(inputs: { age: NonNullable<unknown> }) => string} */
  (e) => `retried ${e.age} ago`
), Jf = (
  /** @type {(inputs: { age: NonNullable<unknown> }) => string} */
  (e) => `approval waiting ${e.age}`
), Qf = (
  /** @type {(inputs: { age: NonNullable<unknown> }) => string} */
  (e) => `pinned ${e.age}`
), ep = (
  /** @type {(inputs: { version: NonNullable<unknown>, n: NonNullable<unknown> }) => string} */
  (e) => `${e.version} to ${e.n} regions`
), tp = (
  /** @type {(inputs: { version: NonNullable<unknown>, env: NonNullable<unknown> }) => string} */
  (e) => `${e.version} to ${e.env}`
), np = (
  /** @type {(inputs: { env: NonNullable<unknown>, age: NonNullable<unknown> }) => string} */
  (e) => `${e.env} idle ${e.age}`
), rp = (
  /** @type {(inputs: { n: NonNullable<unknown>, total: NonNullable<unknown> }) => string} */
  (e) => `${e.n} of ${e.total} regions not deployed`
), sp = (
  /** @type {(inputs: { total: NonNullable<unknown>, builds: NonNullable<unknown> }) => string} */
  (e) => `${e.total} regions on ${e.builds} builds`
), ap = (
  /** @type {(inputs: { n: NonNullable<unknown>, span: NonNullable<unknown> }) => string} */
  (e) => `${e.n} apps to prod in ${e.span}`
), ip = (
  /** @type {(inputs: {}) => string} */
  () => "is stuck"
), op = (
  /** @type {(inputs: {}) => string} */
  () => "waits for approval"
), lp = (
  /** @type {(inputs: {}) => string} */
  () => "waits on a dependency"
), cp = (
  /** @type {(inputs: {}) => string} */
  () => "waits on promotion order"
), up = (
  /** @type {(inputs: {}) => string} */
  () => "waits for a deploy window"
), dp = (
  /** @type {(inputs: {}) => string} */
  () => "waits on a check"
), fp = (
  /** @type {(inputs: {}) => string} */
  () => "is pinned"
), pp = (
  /** @type {(inputs: { env: NonNullable<unknown> }) => string} */
  (e) => `Review approval in ${e.env}`
), hp = (
  /** @type {(inputs: { env: NonNullable<unknown> }) => string} */
  (e) => `failing in ${e.env}`
), vp = (
  /** @type {(inputs: { env: NonNullable<unknown> }) => string} */
  (e) => `waits for approval in ${e.env}`
), mp = (
  /** @type {(inputs: { env: NonNullable<unknown> }) => string} */
  (e) => `held in ${e.env}`
), gp = (
  /** @type {(inputs: { env: NonNullable<unknown> }) => string} */
  (e) => `deploying in ${e.env}`
), wp = (
  /** @type {(inputs: { env: NonNullable<unknown> }) => string} */
  (e) => `checking in ${e.env}`
), _p = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? Bf(e) : "home_m_held_for", bp = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? re()) === "en" ? jf() : "home_m_waits_on_rule", kp = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? re()) === "en" ? Pf() : "home_m_health_check_failing", yp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? Hf(e) : "home_m_action_roll_back", Sp = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? re()) === "en" ? Vf() : "home_m_action_review_approval", go = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? re()) === "en" ? Uf() : "home_m_evidence_failed_check", Cp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? Wf(e) : "home_m_evidence_rolled_back_to", Mp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? zf(e) : "home_m_sig_check_failing", wo = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? re()) === "en" ? Gf() : "home_m_failed_to_deploy", Ep = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? qf(e) : "home_m_sig_flapping", Tp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? Kf(e) : "home_m_sig_recovered", Np = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? Yf(e) : "home_m_sig_slow_bake", Ap = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? Zf(e) : "home_m_sig_long_wait", xp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? Xf(e) : "home_m_sig_retried", Rp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? Jf(e) : "home_m_sig_approval_waiting", Lp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? Qf(e) : "home_m_sig_pinned", Op = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? ep(e) : "home_m_sig_to_regions", Dp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? tp(e) : "home_m_sig_to_env", Fp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? np(e) : "home_m_sig_idle", Ip = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? rp(e) : "home_m_sig_regions_not_deployed", $p = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? sp(e) : "home_m_sig_regions_on_builds", Bp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? ap(e) : "home_m_sig_correlated", jp = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? re()) === "en" ? ip() : "home_m_hold_stuck", Pp = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? re()) === "en" ? op() : "home_m_hold_approval", Hp = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? re()) === "en" ? lp() : "home_m_hold_dependency", Vp = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? re()) === "en" ? cp() : "home_m_hold_order", Up = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? re()) === "en" ? up() : "home_m_hold_clock", Wp = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? re()) === "en" ? dp() : "home_m_hold_check", zp = /* @__NO_SIDE_EFFECTS__ */ (e = {}, t = {}) => (t.locale ?? re()) === "en" ? fp() : "home_m_hold_pinned", Gp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? pp(e) : "home_m_action_review_approval_in", qp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? hp(e) : "home_m_lead_failing", Kp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? vp(e) : "home_m_lead_approval", Yp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? mp(e) : "home_m_lead_held", Zp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? gp(e) : "home_m_lead_deploying", Xp = /* @__NO_SIDE_EFFECTS__ */ (e, t = {}) => (t.locale ?? re()) === "en" ? wp(e) : "home_m_lead_checking", Jp = /* @__PURE__ */ new Set([
  "check-failing",
  "check-flapping",
  "check-recovered",
  "slow-bake",
  "long-wait"
]);
function _a(e) {
  const t = Math.max(0, e);
  return t < 3 * 36e5 ? `${Math.round(t / 6e4)}m` : un(t);
}
function Qp(e) {
  switch (e.kind) {
    case "check-failing":
      return (e.check == null ? /* @__PURE__ */ kp() : /* @__PURE__ */ Mp({ name: e.check })).slice(0, 48);
    case "failed":
      return e.failure === "healthcheck" ? /* @__PURE__ */ go() : /* @__PURE__ */ wo();
    case "check-flapping":
      return /* @__PURE__ */ Ep({ name: e.check, n: e.failures, span: un(Math.max(0, e.spanMs)) });
    case "check-recovered":
      return /* @__PURE__ */ Tp({ age: un(Math.max(0, e.failedAgoMs)) });
    case "slow-bake":
      return /* @__PURE__ */ Np({ span: _a(e.spanMs), set: _a(e.bakeTimeMs) });
    case "long-wait":
      return /* @__PURE__ */ Ap({ span: un(Math.max(0, e.waitedMs)), usual: un(Math.max(0, e.usualMs)) });
  }
}
const Ge = {
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
function eh(e, t) {
  return e >= Math.max(Ge.longWaitFloorMs, t * Ge.slowBakeFactor);
}
const On = (e) => un(Math.max(0, e)), Nt = (e) => new Date(e).toISOString(), ba = (e) => !!e.envName && Fe(e.envName) === "prod", ka = (e) => `${e.ns}/${e.name}`;
function th(e) {
  const t = [];
  for (const n of e)
    for (const r of n.rollout.status?.history ?? []) {
      const s = r.timestamp ? Date.parse(r.timestamp) : NaN;
      if (!Number.isFinite(s)) continue;
      const a = r.version && te(r.version) || "", i = r.version?.revision ? it(r.version.revision).slice(0, 7) : it(a).slice(0, 7);
      t.push({ at: s, card: n, version: it(a), rev: i });
    }
  return t.sort((n, r) => r.at - n.at);
}
function nh(e) {
  const t = e.rollout.status?.availableReleases ?? [], n = [];
  for (const r of e.rollout.status?.history ?? []) {
    const s = r.version ? te(r.version) : null, a = t.find((o) => !!o && (o.tag === s || o.version === s || o.tag === r.version?.tag));
    if (!a?.created || !r.timestamp) continue;
    const i = Date.parse(r.timestamp) - Date.parse(a.created);
    Number.isFinite(i) && i >= 0 && n.push(i);
  }
  return n.length < 2 ? null : (n.sort((r, s) => r - s), n[Math.floor(n.length / 2)]);
}
function rh(e) {
  const { cards: t, lanes: n, healthChecks: r, prFor: s, isApproval: a, now: i, href: o, appHref: l } = e, c = i.getTime(), u = th(t), d = [];
  function f(h, E, C) {
    const b = (S, P) => {
      const m = S.rev ? s(S.rev) : null;
      return { id: m?.number ?? S.version, title: m?.title ?? null, href: m?.href ?? null, app: S.card.name, env: S.card.envDisplay || S.card.envName, at: Nt(S.at), sameApp: P };
    }, T = (E ? u.find((S) => S.at < h && ka(S.card) === ka(E)) : null) ?? u.find((S) => S.at < h && S.card.name === C);
    if (T) return b(T, !0);
    const A = u.find((S) => S.at < h && ba(S.card));
    return A ? b(A, !1) : null;
  }
  function p(h, E) {
    const C = h.evidence ?? (h.facts ? Qp(h.facts) : "");
    d.push({ ...h, evidence: C, key: `${h.kind}|${h.app}|${h.env}|${h.since}`, lastChange: f(Date.parse(h.since), E, h.app) });
  }
  const w = (h) => h.envDisplay || h.envName, _ = /* @__PURE__ */ new Map();
  for (const h of t) {
    if (!h.envName) continue;
    const E = Fe(h.envName), C = h.rollout.status?.history?.[0], b = vn(h);
    if (h.checkFailure) {
      const M = dn(h, "failed") ?? C?.bakeEndTime ?? C?.timestamp ?? Nt(c);
      p({ kind: "check-failing", severity: "failure", app: h.name, env: w(h), tier: E, since: M, facts: { kind: "check-failing", check: h.checkFailure.check ?? null }, href: o(h) }, h);
    } else if (b === "failed") {
      const M = dn(h, "failed") ?? C?.timestamp ?? Nt(c);
      p({ kind: "failed", severity: "failure", app: h.name, env: w(h), tier: E, since: M, facts: { kind: "failed", failure: Qi(h.failureCategory === "healthcheck" ? "health check" : h.bakeStatusMessage ?? null) }, href: o(h) }, h);
    }
    const T = r?.get(Ui(h.sourceCluster, h.ns, h.name)) ?? [], A = qd(h.rollout), S = h.rollout.status?.history ?? [];
    for (const M of T) {
      if (Kd(M, A) !== "recovered") continue;
      const I = Date.parse(M.status.lastErrorTime), O = M.metadata?.name, $ = M.metadata?.annotations?.["kuberik.com/display-name"] ?? O ?? "check", R = C?.bakeStartTime ? Date.parse(C.bakeStartTime) : NaN, L = S.slice(1).filter((W) => {
        const x = Date.parse(W.bakeEndTime ?? W.timestamp ?? "");
        return Number.isFinite(x) && c - x < Ge.flapWindowMs && (W.failedHealthChecks ?? []).some((j) => j.name === O);
      }), H = L.length > 0 && Number.isFinite(R) && I > R, U = H ? Math.min(...L.map((W) => Date.parse(W.bakeEndTime ?? W.timestamp ?? ""))) : I;
      p(
        {
          kind: H ? "check-flapping" : "check-recovered",
          severity: "signal",
          app: h.name,
          env: w(h),
          tier: E,
          since: M.status.lastErrorTime,
          facts: H ? { kind: "check-flapping", check: $, failures: L.length + 1, spanMs: c - U } : { kind: "check-recovered", failedAgoMs: c - I },
          href: o(h)
        },
        h
      );
    }
    const P = h.rollout.spec?.bakeTime ? Ls(h.rollout.spec.bakeTime) : 0;
    if (C?.bakeStartTime && P > 0) {
      const M = Date.parse(C.bakeStartTime), I = C.bakeEndTime ? Date.parse(C.bakeEndTime) : c, O = I - M;
      c - I < Ge.retryMs && O > P + Ge.slowBakeMarginMs && p({ kind: "slow-bake", severity: "signal", app: h.name, env: w(h), tier: E, since: C.bakeStartTime, facts: { kind: "slow-bake", spanMs: O, bakeTimeMs: P }, href: o(h) }, h);
    }
    C?.lastRetryTimestamp && c - Date.parse(C.lastRetryTimestamp) < Ge.retryMs && p({ kind: "retry", severity: "signal", app: h.name, env: w(h), tier: E, since: C.lastRetryTimestamp, evidence: /* @__PURE__ */ xp({ age: On(c - Date.parse(C.lastRetryTimestamp)) }), href: o(h) }, h);
    const m = Os(h.rollout);
    if ((h.rollout.status?.history ?? []).forEach((M, I) => {
      if (m[I]?.kind !== "rollback" || !M.timestamp || c - Date.parse(M.timestamp) >= Ge.rollbackMs) return;
      const O = m[I];
      p({ kind: "rollback", severity: "signal", app: h.name, env: w(h), tier: E, since: M.timestamp, evidence: /* @__PURE__ */ Cp({ version: it(O.to) }), href: o(h) }, h);
    }), E === "prod" && C?.timestamp && c - Date.parse(C.timestamp) < Ge.prodRolloutMs && b !== "failed") {
      const M = C.version ? it(te(C.version) || "") : "", I = `${h.name}|${M}`, O = _.get(I);
      O ? (O.places.push(w(h)), Date.parse(C.timestamp) < Date.parse(O.since) && (O.since = C.timestamp)) : _.set(I, { card: h, v: M, since: C.timestamp, places: [w(h)] });
    }
    if (b === "held") {
      const M = a(h) ? dn(h, "held") : (() => {
        const I = $n(h);
        return I ? Nt(I) : dn(h, "held");
      })();
      M && c - Date.parse(M) >= Ge.agingHoldMs && p({ kind: "aging-hold", severity: "signal", app: h.name, env: w(h), tier: E, since: M, evidence: (a(h) ? Rp : _p)({ age: On(c - Date.parse(M)) }), href: o(h) }, h);
    } else h.pinnedVersion && C?.timestamp && c - Date.parse(C.timestamp) >= Ge.agingHoldMs && p({ kind: "aging-hold", severity: "signal", app: h.name, env: w(h), tier: E, since: C.timestamp, evidence: /* @__PURE__ */ Lp({ age: On(c - Date.parse(C.timestamp)) }), href: o(h) }, h);
  }
  for (const h of _.values()) {
    const E = h.places.length > 1 ? "prod" : h.places[0];
    p({ kind: "prod-rollout", severity: "signal", app: h.card.name, env: E, tier: "prod", since: h.since, evidence: h.places.length > 1 ? /* @__PURE__ */ Op({ version: h.v, n: h.places.length }) : /* @__PURE__ */ Dp({ version: h.v, env: E }), href: h.places.length > 1 ? l(h.card.name) : o(h.card) }, h.places.length > 1 ? null : h.card);
  }
  for (const h of n) {
    const E = Lf(h, a), C = Tf(E, { now: i, idOf: (b) => b ? it(b) : "", isApproval: a });
    if (C?.kind === "cycle" && C.waitedMs != null) {
      const b = C.place, T = [...h.stages, ...h.prod].find((S) => b === "prod" ? S.tier === "prod" : S.env === b) ?? null, A = T ? nh(T.card) : null;
      A != null && eh(C.waitedMs, A) && p({ kind: "long-wait", severity: "signal", app: h.app, env: b, tier: b === "prod" ? "prod" : Fe(b), since: Nt(c - C.waitedMs), facts: { kind: "long-wait", waitedMs: C.waitedMs, usualMs: A }, href: T ? o(T.card) : l(h.app) }, T?.card ?? null);
    }
    if (C?.kind === "stalled") {
      const b = C.place, T = [...h.stages, ...h.prod].find((A) => b === "prod" ? A.tier === "prod" : A.env === b) ?? null;
      p({ kind: "stall", severity: "signal", app: h.app, env: b, tier: b === "prod" ? "prod" : Fe(b), since: Nt(c - C.forMs), evidence: /* @__PURE__ */ Fp({ env: b, age: On(C.forMs) }), href: T ? o(T.card) : l(h.app) }, T?.card ?? null);
    }
    if (h.prod.length > 1) {
      const b = Rf(h.prod, (S) => S ? it(S) : ""), T = b.buckets.filter((S) => S.id).map((S) => S.id), A = h.prod.filter((S) => S.state === "none" || !S.card.version).length;
      if (new Set(T).size > 1 || A) {
        const S = Math.max(...h.prod.map((P) => P.card.timestamp ? Date.parse(P.card.timestamp) : 0));
        p(
          {
            kind: "prod-drift",
            severity: "signal",
            app: h.app,
            env: "prod",
            tier: "prod",
            since: Nt(S || c),
            evidence: A ? /* @__PURE__ */ Ip({ n: A, total: b.total }) : /* @__PURE__ */ $p({ total: b.total, builds: new Set(T).size }),
            href: l(h.app)
          },
          null
        );
      }
    }
  }
  const v = /* @__PURE__ */ new Map();
  for (const h of u) {
    if (!ba(h.card) || c - h.at >= Ge.correlatedWindowMs) continue;
    const E = `${h.card.name}|${h.version}`, C = v.get(E);
    (!C || h.at < C.at) && v.set(E, h);
  }
  const g = [...v.values()].sort((h, E) => h.at - E.at), y = /* @__PURE__ */ new Set();
  for (let h = 0; h < g.length; h++) {
    if (y.has(h)) continue;
    const E = [h];
    for (let A = h + 1; A < g.length && g[A].at - g[E[E.length - 1]].at <= Ge.correlatedMs; A++) E.push(A);
    const C = [...new Set(E.map((A) => g[A].card.name))];
    if (C.length < 2) continue;
    E.forEach((A) => y.add(A));
    const b = g[h], T = g[E[E.length - 1]].at - b.at;
    p({ kind: "correlated", severity: "signal", app: C[0], apps: C, env: "prod", tier: "prod", since: Nt(b.at), evidence: /* @__PURE__ */ Bp({ n: C.length, span: On(Math.max(6e4, T)) }), href: l(C[0]) }, null);
  }
  return d.sort((h, E) => h.severity === E.severity ? Date.parse(E.since) - Date.parse(h.since) : h.severity === "failure" ? -1 : 1);
}
function sh(e) {
  return e?.metadataUnresolved === !0;
}
function ya(e, t, n) {
  return `${e}/${t}/${n}`;
}
function vt(e) {
  return e?.metadata?.annotations?.[Bi] ?? "";
}
function ah(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n?.metadata?.namespace;
    if (!r) continue;
    const s = vt(n);
    let a = t.get(s);
    a || (a = /* @__PURE__ */ new Set(), t.set(s, a)), a.add(r);
  }
  return t;
}
function ih(e) {
  const t = e?.status?.history?.[0]?.version;
  return t && (t.version || t.revision || t.tag) || null;
}
const _o = /* @__PURE__ */ new WeakMap();
function oh(e) {
  const t = new Set(e.filter((n) => n != null));
  return t.size === 1 ? [...t][0] : null;
}
function lh(e, t, n) {
  let r = e;
  for (const [s, a] of t) {
    const i = n.get(s);
    if (!i || i.size === 0) continue;
    const o = a?.clusterRolloutSchedules?.items ?? [], l = /* @__PURE__ */ new Map();
    for (const c of i) l.set(c, [...o]);
    for (const c of a?.rolloutSchedules?.items ?? []) {
      const u = c?.metadata?.namespace;
      !u || !l.has(u) || l.get(u).push(c);
    }
    for (const [c, u] of l)
      r = rs(r, c, u);
  }
  return r;
}
function ch(e) {
  const t = ys(e), n = [];
  for (const r of e) {
    const s = r.status?.rolloutGateRef?.name;
    if (!r.metadata?.namespace || !r.spec?.rolloutRef?.name || !r.spec?.environment || !s) continue;
    const a = t.get(Nr(r)), i = $i(a, r);
    if (!a || !i || i.env !== r) continue;
    const o = Ii(a, i), l = i.isLeader ? o[0]?.tier === i.tier ? "wave" : "tier" : "follow";
    for (const c of o) {
      const u = c.env;
      !u || !u.metadata?.namespace || !u.spec?.rolloutRef?.name || n.push({ down: r, up: u, gate: s, edgeKind: l });
    }
  }
  return n;
}
function uh(e, t, n) {
  return (e || n || t) === t;
}
function Fs(e) {
  const { rollouts: t, environments: n, dependencies: r, envOrder: s } = e, a = e.gates ?? Nn, i = new Map(s.map((m, M) => [m, M])), o = (m) => i.get(m) ?? 900 + s.length, l = /* @__PURE__ */ new Map();
  for (const m of t) {
    const M = m.metadata?.namespace, I = m.metadata?.name;
    !M || !I || l.set(ya(vt(m), M, I), m);
  }
  const c = /* @__PURE__ */ new Map();
  for (const m of n) {
    const M = m.metadata?.namespace, I = m.spec?.environment;
    M && I && c.set(`${vt(m)}/${M}`, Dt(m, n));
  }
  const u = (m, M) => c.get(`${m}/${M}`) ?? M, d = /* @__PURE__ */ new Map(), f = (m, M, I, O) => {
    const $ = ya(m, M, I);
    let R = d.get($);
    if (!R) {
      const L = l.get($);
      R = {
        id: $,
        cluster: m,
        namespace: M,
        name: I,
        // ⛔ `||`, NOT `??`. A caller passing an EMPTY environment name —
        // an `Environment` whose `spec.environment` is `''` — slipped
        // straight through `??` and became a node labelled with nothing,
        // which `DependencyNode` drew as a bordered box with no text in
        // it. Nullish-coalescing is the wrong operator for a field whose
        // empty value is as meaningless as its absence.
        env: O || u(m, M),
        envRank: 0,
        unresolved: !L,
        build: ih(L),
        candidateCount: 0,
        waiting: !1,
        blocked: !1,
        holds: []
      }, R.envRank = o(R.env), d.set($, R);
    }
    return R;
  }, p = [], w = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Set();
  for (const { down: m, up: M, gate: I, edgeKind: O } of ch(n)) {
    const $ = m.metadata.namespace, R = m.spec.rolloutRef.name, L = M.metadata.namespace, H = M.spec.rolloutRef.name, U = f(vt(m), $, R, Dt(m, n)), W = f(vt(M), L, H, Dt(M, n));
    if (W.id === U.id) continue;
    const x = `promotion:${U.id}:${I}`, j = _.has(x) ? `${x}:${W.id}` : x;
    _.add(x), p.push({
      key: j,
      from: W.id,
      to: U.id,
      writer: "promotion",
      gate: I,
      state: "unknown",
      contract: null,
      requiredVersion: null,
      providedVersion: null,
      edgeKind: O,
      message: "",
      cyclic: !1,
      held: []
    });
  }
  for (const m of r) {
    const M = m.metadata?.namespace, I = m.spec?.rolloutRef?.name, O = m.spec?.providerRef?.name, $ = m.status?.gateName;
    if (!M || !I || !O || !$) continue;
    const R = vt(m), L = f(R, M, I), H = f(R, m.spec?.providerRef?.namespace || M, O), U = m.status?.blockedReleases ?? [], W = (m.status?.conditions ?? []).find((j) => j?.type === "Satisfied"), x = `contract:${L.id}:${$}`;
    w.set(x, m), p.push({
      key: x,
      from: H.id,
      to: L.id,
      writer: "contract",
      gate: $,
      state: "unknown",
      contract: m.spec?.contract || O,
      requiredVersion: oh(U.map((j) => j.requiredVersion ?? null)),
      providedVersion: m.status?.providedVersion ?? null,
      edgeKind: null,
      message: W?.message ?? "",
      cyclic: !1,
      held: []
    });
  }
  if (e.focus) {
    const m = e.focus;
    for (const M of t)
      if (M.metadata?.namespace === m.namespace && M.metadata?.name === m.name && uh(vt(M), m.cluster, m.localCluster)) {
        f(vt(M), m.namespace, m.name);
        break;
      }
  }
  const v = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map();
  for (const m of d.values()) {
    const M = l.get(m.id);
    M && (v.set(m.id, Xn(M)), g.set(
      m.id,
      new Set((M.status?.gates ?? []).map((I) => I?.name).filter(Boolean))
    ));
  }
  const y = (m) => [
    ...new Set(
      m.map((M) => te(M))
    )
  ], h = (m, M) => {
    const I = m.writer === "contract" ? w.get(m.key) : void 0;
    if (!I) return;
    const O = new Map(
      (I.status?.blockedReleases ?? []).filter((R) => R?.tag && R.requiredVersion).map((R) => [R.tag, R.requiredVersion])
    ), $ = /* @__PURE__ */ new Map();
    for (const R of M) {
      const L = R.tag ? O.get(R.tag) : void 0;
      L && $.set(te(R), L);
    }
    $.size && _o.set(m, $);
  };
  for (const m of p) {
    const M = v.get(m.to), I = g.get(m.to), O = l.get(m.to);
    if (!M || !I)
      m.state = "unknown";
    else if (M.blockingGates.includes(m.gate)) {
      m.state = "blocked";
      const $ = Fd(O, m.gate);
      m.held = y($), h(m, $);
    } else if (I.has(m.gate))
      m.state = "clear";
    else {
      m.state = "unknown";
      const $ = m.writer === "contract" ? w.get(m.key) : void 0;
      if ($) {
        const R = new Set(
          ($.status?.blockedReleases ?? []).map((U) => U?.tag).filter(Boolean)
        ), L = Zn(O).filter((U) => U.tag && R.has(U.tag)), H = ($.status?.conditions ?? []).find((U) => U?.type === "Satisfied");
        L.length > 0 ? (m.state = "blocked", m.held = y(L), h(m, L)) : H?.status === "True" && (m.state = "clear");
      }
    }
  }
  const E = /* @__PURE__ */ new Map();
  for (const m of p) {
    let M = E.get(m.to);
    M || E.set(m.to, M = /* @__PURE__ */ new Set()), M.add(m.gate);
  }
  const C = bo({ nodes: [...d.values()], edges: p });
  for (const m of d.values()) {
    const M = l.get(m.id);
    if (!M) continue;
    const I = C.get(m.id), O = Kt(M, a, { place: m.env, contractHolds: I });
    m.candidateCount = O.candidateCount, m.waiting = O.blocked, m.blocked = O.blocked && !O.selfClearing;
    const $ = E.get(m.id) ?? /* @__PURE__ */ new Set();
    m.holds = O.gates.filter((R) => !$.has(R.id) && !R.id.startsWith("contract:")).map((R) => ({
      gate: R.id,
      clears: R.clears,
      short: R.short,
      clearsAt: R.clearsAt,
      pending: R.pending
    })), O.pinnedTo && (m.holds = [
      {
        gate: O.pinnedTo,
        clears: "person",
        short: `Pinned to ${Ar(M, O.pinnedTo)}`,
        clearsAt: null
      }
    ]);
  }
  dh(p), p.sort(
    (m, M) => m.writer.localeCompare(M.writer) || m.from.localeCompare(M.from) || m.to.localeCompare(M.to)
  );
  const b = [...d.values()].sort(
    (m, M) => m.name.localeCompare(M.name) || m.envRank - M.envRank || m.env.localeCompare(M.env)
  ), T = new Set(b.map((m) => m.env)), A = s.filter((m) => T.has(m)).concat([...T].filter((m) => !i.has(m)).sort()), S = new Set(b.map((m) => m.id)), P = [...l.keys()].filter((m) => !S.has(m)).length;
  return {
    nodes: b,
    edges: p,
    envs: A,
    blockedEdges: p.filter((m) => m.state === "blocked"),
    hasCycle: p.some((m) => m.cyclic),
    unlinkedRollouts: P
  };
}
function dh(e) {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  for (const o of [...e].sort((l, c) => l.key.localeCompare(c.key))) {
    n.add(o.from), n.add(o.to);
    const l = t.get(o.from);
    l ? l.push(o) : t.set(o.from, [o]);
  }
  const r = 0, s = 1, a = 2, i = /* @__PURE__ */ new Map();
  for (const o of n) i.set(o, r);
  for (const o of [...n].sort()) {
    if (i.get(o) !== r) continue;
    const l = [[o, 0]];
    for (i.set(o, s); l.length > 0; ) {
      const c = l[l.length - 1], u = t.get(c[0]) ?? [];
      if (c[1] >= u.length) {
        i.set(c[0], a), l.pop();
        continue;
      }
      const d = u[c[1]++], f = i.get(d.to);
      f === s ? d.cyclic = !0 : f === r && (i.set(d.to, s), l.push([d.to, 0]));
    }
  }
}
function bo(e) {
  const t = new Map(e.nodes.map((r) => [r.id, r])), n = /* @__PURE__ */ new Map();
  for (const r of e.edges) {
    if (r.writer !== "contract" || r.state !== "blocked") continue;
    let s = n.get(r.to);
    s || n.set(r.to, s = /* @__PURE__ */ new Map());
    const a = t.get(r.from)?.name ?? "another service", i = _o.get(r);
    for (const o of r.held) {
      const l = {
        provider: a,
        required: i?.get(o) ?? r.requiredVersion ?? void 0,
        has: r.providedVersion ?? void 0,
        gate: r.gate || void 0
      }, c = s.get(o);
      c ? c.push(l) : s.set(o, [l]);
    }
  }
  return n;
}
function ko(e, t, n = t.metadata?.namespace, r) {
  const s = t.metadata?.name, a = e.nodes.filter((o) => o.namespace === n && o.name === s), i = a.length < 2 ? a[0] ?? null : a.find((o) => o.cluster === (vt(t) || (r ?? ""))) ?? a[0];
  return i ? bo(e).get(i.id) ?? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Map();
}
class Yt extends Set {
  has(t) {
    if (super.has(t)) return !0;
    if (!t || t.length < 7) return !1;
    const n = t.toLowerCase();
    for (const r of this) {
      if (r.length < 7) continue;
      const s = r.toLowerCase();
      if (s.startsWith(n) || n.startsWith(s)) return !0;
    }
    return !1;
  }
}
function fh(e) {
  const t = new Yt();
  e.mergeCommitSha && t.add(e.mergeCommitSha);
  for (const n of e.containedIn) t.add(n);
  return t;
}
function ph(e, t, n) {
  if (e.revision && t.has(e.revision)) return "contained";
  if (!n.containedInAll) return "not-contained";
  if (!e.created) return "unverified";
  if (!n.mergedAt) return "not-contained";
  const r = new Date(e.created).getTime(), s = new Date(n.mergedAt).getTime();
  return !Number.isFinite(r) || !Number.isFinite(s) ? "unverified" : r < s ? "not-contained" : "contained";
}
function hh(e, t, n) {
  let r = null;
  for (const s of e) {
    const a = ph(s, t, n);
    if (a === "contained") return { release: s, state: a };
    a === "unverified" && !r && (r = s);
  }
  return r ? { release: r, state: "unverified" } : null;
}
function vh(e, t) {
  for (const n of e.status?.availableReleases ?? [])
    if (n.tag === t) return n.revision ?? null;
  for (const n of e.status?.history ?? [])
    if (n.version?.tag === t) return n.version.revision ?? null;
  return null;
}
function mh(e, t) {
  for (const n of e.status?.availableReleases ?? [])
    if (n.tag === t) return te(n);
  for (const n of e.status?.history ?? [])
    if (n.version?.tag === t) return te(n.version);
  return t.length > 12 ? t.slice(0, 7) : t;
}
function Gr(e, t, n) {
  if (!e || !t) return null;
  const r = Ls(t);
  if (!r) return null;
  const s = new Date(e).getTime();
  return Number.isFinite(s) ? r - (n.getTime() - s) : null;
}
function gh(e) {
  const t = [];
  for (const n of e.status?.history ?? []) {
    if (!n.bakeStartTime || !n.bakeEndTime) continue;
    const r = new Date(n.bakeStartTime).getTime(), s = new Date(n.bakeEndTime).getTime();
    !Number.isFinite(r) || !Number.isFinite(s) || s <= r || t.push(s - r);
  }
  return t.length < 2 ? null : uo(t);
}
const Ne = {
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
function dr(e) {
  return e !== "Deploying" && e !== "InProgress" && e !== "BakeTimeRetrying" && e !== "Failed" && e !== "Cancelled";
}
function wh(e, t) {
  const n = new Date(t).getTime();
  if (!Number.isFinite(n)) return null;
  let r = null, s = !1;
  for (const i of e.services)
    for (const o of i.cells) {
      if (Tn(o.envName) !== "PROD") continue;
      const l = o.historyMatches ?? [];
      let c;
      for (let f = l.length - 1; f >= 0; f--)
        if (dr(l[f].bakeStatus)) {
          c = l[f];
          break;
        }
      if (!c) continue;
      const u = new Date(c.timestamp).getTime();
      if (!Number.isFinite(u)) continue;
      const d = !!o.firstLandingProven;
      (r == null || u < r || u === r && d) && (r = u, s = d);
    }
  if (!s || r == null) return null;
  const a = r - n;
  return a <= 0 ? null : { at: new Date(r).toISOString(), ms: a };
}
function _h(e, t, n, r, s, a, i, o, l) {
  const c = e.status ?? {}, u = c.history ?? [], d = u[0], f = d?.version?.revision ?? null, p = e.metadata?.namespace ?? "", w = e.metadata?.name ?? "", _ = ut(t), v = gh(e), g = Os(e), y = u.reduce((S, P, m) => {
    const M = P.version?.revision;
    return M && s.has(M) && S.push({
      revision: M,
      displayVersion: te(P.version),
      timestamp: P.timestamp,
      bakeStatus: P.bakeStatus ?? "None",
      triggeredBy: P.triggeredBy ?? null,
      act: g[m] ?? null
    }), S;
  }, []);
  let h = null;
  for (let S = u.length - 1; S >= 0; S--) {
    const P = u[S]?.version?.revision;
    if (P && s.has(P)) {
      h = S;
      break;
    }
  }
  const E = h != null && h < u.length - 1, C = (S) => ({
    cluster: n,
    envName: t,
    envRank: _,
    usuallyMs: v,
    namespace: p,
    rolloutName: w,
    theme: r,
    containmentKnown: l,
    historyMatches: y,
    historyAtLimit: ro(e),
    versionHistoryLimit: e.spec?.versionHistoryLimit ?? 10,
    firstLandingProven: E,
    ...S
  }), b = () => C({
    ...Ne,
    state: "not-built",
    reason: "not built (unverified)",
    releaseLabel: "",
    revision: null
  });
  if (f && s.has(f)) {
    const S = d?.bakeStatus ?? "None", P = te(d.version), m = y.slice(1).find((R) => dr(R.bakeStatus));
    if (m && !dr(S))
      return C({
        ...Ne,
        state: "live",
        // The landing is the fact; whatever the later build is doing is
        // the qualifier, in the same voice as the `superseded` clause.
        reason: "live · a newer build carrying it is not the one serving",
        // WHEN IT WENT LIVE, not when the current roll started — the
        // same distinction Rule 1's own `since before recorded history`
        // branch draws below.
        since: m.timestamp,
        superseded: !0,
        // ⭐ So the muted note can name what the later build DID.
        // Without this the cell would print "has since shipped" over a
        // build that failed, trading one false statement for another.
        supersededHeadStatus: S,
        releaseLabel: P,
        revision: f
      });
    if (!dr(S))
      return C(S === "Deploying" ? {
        ...Ne,
        state: "deploying",
        reason: "deploying now",
        since: d?.timestamp ?? null,
        bakeLeftMs: Gr(d?.timestamp, e.spec?.deployTimeout, o),
        releaseLabel: P,
        revision: f
      } : S === "InProgress" ? {
        ...Ne,
        state: "baking",
        reason: e.spec?.bakeTime ? "baking" : "baking, no timer",
        since: d?.bakeStartTime ?? d?.timestamp ?? null,
        bakeLeftMs: Gr(d?.bakeStartTime, e.spec?.bakeTime, o),
        releaseLabel: P,
        revision: f
      } : S === "BakeTimeRetrying" ? {
        ...Ne,
        state: "retrying",
        reason: d?.bakeStatusMessage || "retrying the bake",
        since: d?.bakeStartTime ?? d?.timestamp ?? null,
        bakeLeftMs: Gr(d?.bakeStartTime, e.spec?.bakeTime, o),
        releaseLabel: P,
        revision: f
      } : S === "Failed" ? {
        ...Ne,
        state: "failed",
        reason: d?.bakeStatusMessage || "the bake failed",
        since: Ds(d),
        releaseLabel: P,
        revision: f
      } : {
        ...Ne,
        state: "cancelled",
        reason: d?.bakeStatusMessage || "the bake was cancelled",
        since: d?.bakeEndTime ?? d?.timestamp ?? null,
        releaseLabel: P,
        revision: f
      });
    const M = u.length ? u[u.length - 1]?.timestamp : null;
    let I = d?.bakeEndTime ?? d?.timestamp ?? null, O = "live";
    if (a.mergedAt && M) {
      const R = new Date(a.mergedAt).getTime(), L = new Date(M).getTime();
      Number.isFinite(R) && Number.isFinite(L) && R < L && (I = null, O = "live (since before recorded history)");
    }
    const $ = a.mergeCommitSha != null && f !== a.mergeCommitSha;
    return C({
      ...Ne,
      state: "live",
      reason: O,
      since: I,
      superseded: $,
      releaseLabel: P,
      revision: f
    });
  }
  const T = u.find((S, P) => {
    if (P === 0) return !1;
    const m = S.version?.revision;
    return !!m && s.has(m);
  });
  if (T) {
    const S = d?.version ? te(d.version) : "";
    if (l)
      return C({
        ...Ne,
        state: "rolled-back",
        reason: d?.message?.trim() || `rolled back to ${S}`,
        since: d?.timestamp ?? null,
        releaseLabel: S,
        revision: f
      });
    if (T.bakeStatus === "Succeeded")
      return C({
        ...Ne,
        state: "live",
        reason: "live · a later build is serving, and whether it carries this change could not be verified",
        since: T.timestamp ?? null,
        superseded: !0,
        releaseLabel: S,
        revision: f
      });
  }
  const A = hh(c.availableReleases ?? [], s, a);
  if (A && A.state === "contained") {
    const S = A.release, P = S.tag ?? S.version ?? S.revision ?? "", m = te(S), M = e.spec?.wantedVersion;
    if (M) {
      const $ = vh(e, M);
      if (!$ || !s.has($))
        return C({
          ...Ne,
          state: "pinned",
          reason: `pinned to ${mh(e, M)}`,
          releaseLabel: m,
          revision: S.revision ?? null
        });
    }
    if (sh(S))
      return C({
        ...Ne,
        state: "waiting-upstream",
        reason: "manifest unreadable",
        releaseLabel: m,
        revision: S.revision ?? null
      });
    const O = (c.gates ?? []).filter(($) => !hn($, P));
    if (O.length > 0) {
      const $ = O.map((K) => Rr(K, p, i)), R = $.find(
        (K) => K.clears === "upstream" && K.subjectKind === "environment"
      ), L = $.find((K) => K.clears === "upstream" && K !== R), H = $.find((K) => K !== R && K !== L), U = L, W = L ?? R, x = L ?? H ?? R ?? $[0], j = !U && (x.kind === "approval" || x.kind === "unknown"), z = !!x.pending || j;
      return !H && (L || R) && !l ? b() : C({
        ...Ne,
        state: L ? "waiting-upstream" : H ? "gated" : "queued",
        reason: z ? "" : x.short,
        releaseLabel: m,
        revision: S.revision ?? null,
        gateHint: { cluster: n, namespace: p, rolloutName: w, gateName: x.id },
        gateLabel: W || z ? null : x.label,
        gateSubject: W ? x.subject ?? null : null,
        gateSubjectKind: W ? x.subjectKind ?? null : null,
        gatePending: z,
        gateApprovalGuess: z && x.kind === "approval",
        // ⭐ FIX PASS ITEM 5. Only a `'service'`-subject dependency gate
        // (`waiting-upstream`) ever carries these — `classifyGate`'s
        // promotion branch never sets `contract`/`need` (its own
        // `NOTHING_TO_DRAW` spread leaves them `null`), so this is a
        // no-op for `queued`/`gated` even without the extra check.
        gateContract: U ? x.contract ?? null : null,
        gateRequiredVersion: U ? x.need ?? null : null,
        // ⭐ FIX PASS ITEM 7 — see `gateProvidedVersion`'s own doc comment.
        gateProvidedVersion: U ? x.have ?? null : null
      });
    }
    return l ? C({
      ...Ne,
      state: "promoting",
      reason: "waiting for the next reconcile",
      releaseLabel: m,
      revision: S.revision ?? null
    }) : b();
  }
  return C({
    ...Ne,
    state: "not-built",
    reason: A?.state === "unverified" ? "not built (unverified)" : "not built here yet",
    releaseLabel: "",
    revision: null
  });
}
function bh(e, t) {
  if (!t.mergeCommitSha) return !1;
  const n = e.status ?? {}, r = n.history ?? [], s = new Yt([t.mergeCommitSha]);
  if (r.some((a) => !!a.version?.revision && s.has(a.version.revision))) return !0;
  for (const a of n.availableReleases ?? [])
    if (a.revision && s.has(a.revision)) return !0;
  return !1;
}
function kh(e) {
  return e.state !== "not-built" || e.reason !== "not built here yet" ? e : { ...e, state: "queued", reason: `not offered to ${e.envName} yet` };
}
function yh(e) {
  return ut(e) >= 7;
}
function Sh(e) {
  const t = [];
  for (const n of e.status?.history ?? []) {
    const r = n.version ? te(n.version) : "";
    if (!r || !n.timestamp) continue;
    const s = new Date(n.timestamp).getTime();
    Number.isFinite(s) && t.push({
      version: r,
      ms: s,
      inFlight: n.bakeStatus === "InProgress" || n.bakeStatus === "Deploying"
    });
  }
  return t;
}
function Ch(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e) {
    const s = t.get(r.envName) ?? [];
    s.push(r), t.set(r.envName, s);
  }
  const n = [];
  for (const [r, s] of t)
    n.push({
      label: r,
      order: ut(r),
      prod: yh(r),
      deploys: s.flatMap((a) => Sh(a.rollout))
    });
  return n;
}
const Mh = {
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
function Eh(e) {
  return e.length === 0 ? "no environments" : [...e].sort((t, n) => t.envRank - n.envRank || t.cluster.localeCompare(n.cluster)).map((t) => `${Mh[t.state]} in ${t.envName}`).join(" · ");
}
const Th = /* @__PURE__ */ new Set(["gated", "waiting-upstream", "pinned"]), Nh = /* @__PURE__ */ new Set(["deploying", "baking", "retrying"]);
function Ah(e) {
  const t = e.length;
  if (t === 0) return "no environments";
  const n = e.filter((i) => i.state === "live").length;
  if (n > 0) return `${n} of ${t} live`;
  const r = e.filter((i) => Th.has(i.state));
  if (r.length > 0)
    return `held in ${[...new Set(r.map((o) => Tn(o.envName).toLowerCase()))].join(" · ")}`;
  if (e.filter((i) => i.state === "not-built").length === t) return "no release";
  const a = e.filter((i) => Nh.has(i.state)).length;
  return a > 0 ? `${a} of ${t} active` : `${t} in progress`;
}
const Sa = {
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
function xh(e) {
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
function Rh(e) {
  return e.state === "gated" ? e.gateLabel ? `by ${e.gateLabel}` : null : e.state === "waiting-upstream" ? `on ${e.gateSubject ?? "its upstream"}` : e.state === "queued" ? `waiting for ${e.gateSubject ?? "an earlier environment"} first` : null;
}
function Ca(e) {
  return !e || e.split(" ")[0].includes("-") ? e : `${e[0].toUpperCase()}${e.slice(1)}`;
}
function Lh(e) {
  const n = e.flatMap((l) => l.cells.map((c) => ({ cell: c, appName: l.appName }))).filter((l) => l.cell.state !== "not-built");
  if (n.length === 0) return { word: "no release for this commit yet", tone: "not-built" };
  if (n.every((l) => l.cell.state === "live"))
    return { word: "live everywhere", tone: "live" };
  const r = n.filter((l) => l.cell.state !== "live"), s = oo(r), a = Rh(s.cell), i = a ? `${s.appName} ${Sa[s.cell.state]} in ${s.cell.envName} ${a}` : `${s.appName} ${Sa[s.cell.state]} in ${s.cell.envName}`, o = s.cell.providerHasNoBuild && s.cell.gateContract && s.cell.gateRequiredVersion ? ` · will not move on its own — needs ${s.cell.gateSubject} ${s.cell.gateContract} ${s.cell.gateRequiredVersion}` : "";
  return { word: `${i}${o}`, tone: xh(s.cell.state) };
}
function Oh(e, t) {
  const n = new Map(e.map((r) => [r.appName, r]));
  return e.map((r) => ({
    ...r,
    cells: r.cells.map((s) => {
      if (s.state !== "waiting-upstream" || s.gateSubjectKind !== "service" || !s.gateSubject)
        return s;
      if (t.has(s.gateSubject))
        return { ...s, providerHasNoBuild: !0 };
      const a = n.get(s.gateSubject);
      if (!a) return s;
      if (!a.cells.some((l) => l.state !== "not-built"))
        return { ...s, providerHasNoBuild: !0 };
      const o = a.cells.find(
        (l) => l.envName === s.envName && l.cluster === s.cluster
      );
      return !o || o.state !== "live" ? { ...s, reason: `waiting on ${s.gateSubject} to reach ${s.envName}` } : s;
    })
  }));
}
function Dh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of n.cells)
      r.state === "waiting-upstream" && r.gateSubjectKind === "service" && r.gateSubject && r.gateContract && r.gateRequiredVersion && !t.has(r.gateSubject) && t.set(r.gateSubject, {
        contract: r.gateContract,
        need: r.gateRequiredVersion
      });
  return t.size === 0 ? [...e] : e.map((n) => ({
    ...n,
    cells: n.cells.map((r) => {
      if (r.state !== "waiting-upstream" || r.gateSubjectKind !== "service" || !r.gateSubject || r.gateRequiredVersion)
        return r;
      const s = t.get(r.gateSubject);
      if (!s) return r;
      const a = `a newer ${s.contract}`, i = `${s.contract} ${s.need}`;
      return {
        ...r,
        reason: r.reason.includes(a) ? r.reason.replace(a, i) : r.reason,
        gateContract: s.contract,
        gateRequiredVersion: s.need
      };
    })
  }));
}
function Fh(e) {
  return e.map((t, n) => ({
    ...t,
    builtElsewhere: e.some(
      (r, s) => s !== n && r.cells.some((a) => a.state !== "not-built")
    )
  }));
}
function Ih(e, t) {
  const n = Ld(e, { place: t });
  if (!n) return null;
  const r = `${t} is `;
  return n.startsWith(r) ? n.slice(r.length) : n;
}
function $h(e, t, n) {
  return Fs({
    rollouts: e,
    environments: t,
    dependencies: n?.items ?? [],
    envOrder: [],
    gates: Ns({ environments: { items: t }, rolloutDependencies: n })
  });
}
function Bh(e, t, n, r, s = /* @__PURE__ */ new Date(), a = {}) {
  const i = fh(e), o = Ns({
    environments: { items: n },
    rolloutDependencies: r
  }), l = a.graph ?? Fs({
    rollouts: t,
    environments: n,
    dependencies: r?.items ?? [],
    envOrder: [],
    gates: o
  }), c = !e.containedInUnknown && e.containmentKnown, u = ji(`github.com/${e.owner}/${e.repo}`, ""), d = Pi(t, n);
  let f = [];
  const p = [];
  for (const T of d.values()) {
    const A = T.cells.filter((m) => m.repoKey === u);
    if (A.length === 0) continue;
    if (!A.some((m) => bh(m.rollout, e))) {
      p.push(T.appName);
      continue;
    }
    const S = A.map((m, M) => {
      const I = _h(
        m.rollout,
        m.envName,
        m.sourceCluster,
        m.theme,
        i,
        e,
        o,
        s,
        c
      ), O = A.filter((z, J) => J !== M).map((z) => ({ envName: z.envName, rollout: z.rollout })), $ = !!ao(m.rollout, O, { now: s, gateContext: o }), R = ko(
        l,
        m.rollout,
        m.rollout.metadata?.namespace,
        m.sourceCluster
      ), L = Kt(m.rollout, o, { place: I.envName, now: s, contractHolds: R }), H = Hi(L, I.envName), U = H.held, W = U ? Ih(L, I.envName) : null, x = H.waitsForEnv, j = H.cause === "person" ? !0 : I.state === "gated" && I.gateApprovalGuess === !0;
      return { ...I, stuck: $, held: U, holdCause: W, waitsForEnv: x, approvalWait: j };
    }).map(kh).sort((m, M) => m.envRank - M.envRank || m.cluster.localeCompare(M.cluster)), P = mf(Ch(A));
    f.push({
      appName: T.appName,
      sourceRepo: ns(A[0].repoKey),
      cells: S,
      furthest: Eh(S),
      furthestCompact: Ah(S),
      leadTimeMs: P?.medianMs ?? null,
      builtElsewhere: !1
      // placeholder — `withBuiltElsewhere` fills the real value below
    });
  }
  f = Fh(
    Dh(Oh(f, new Set(p)))
  );
  const w = f.flatMap((T) => T.cells), _ = w.length, v = w.filter((T) => T.state !== "not-built").length, g = w.filter((T) => T.state === "live").length, y = f.length > 0 || p.length > 0, h = y && f.length === 0;
  let E, C, b;
  return y ? h ? (E = "no release for this commit", C = "not-built", b = Ca(E)) : ({ word: E, tone: C } = Lh(f), b = Ca(E)) : (E = "not built here", C = "not-built", b = "No service on this cluster deploys this repository"), {
    services: f,
    verdict: b,
    verdictWord: E,
    verdictTone: C,
    containmentKnown: c,
    rolloutsTotal: _,
    rolloutsWithBuild: v,
    rolloutsLive: g,
    unaffectedServices: p,
    noRelease: h
  };
}
function jh(e, t) {
  return `${Rs(e, t)} ago`;
}
const Ph = /* @__PURE__ */ new Set([
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
function Hh(e, t) {
  const n = "baking";
  if (e.bakeLeftMs == null || !e.since) return n;
  const r = new Date(e.since).getTime();
  if (!Number.isFinite(r)) return n;
  const s = t.getTime() - r, a = s + e.bakeLeftMs;
  if (a <= 0) return n;
  const i = Math.max(0, Math.round(s / 6e4)), o = Math.max(i, Math.round(a / 6e4));
  return `${n} · ${i} of ${o} min`;
}
function yo(e, t = /* @__PURE__ */ new Date(), n) {
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
      return Hh(e, t);
    case "retrying":
      return "retrying";
    case "failed":
      return "failed";
    case "cancelled":
      return "cancelled";
    case "rolled-back":
      return `rolled back to ${e.releaseLabel}`;
    case "live":
      return e.since ? `live since ${jh(e.since, t)}` : e.reason;
    default:
      return e.reason;
  }
}
function Vh(e, t = /* @__PURE__ */ new Date()) {
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
  if (!e.reason || Ph.has(e.reason)) return null;
  const n = yo(e, t);
  return e.reason.trim().toLowerCase() === n.trim().toLowerCase() ? null : e.reason;
}
function Uh(e) {
  return `usually ${Math.max(1, Math.round(e / 6e4))} min once it starts`;
}
const Wh = /* @__PURE__ */ new Set(["queued", "promoting"]);
function zh(e) {
  return !Wh.has(e.state) || e.usuallyMs == null ? null : Uh(e.usuallyMs);
}
const Ma = {
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
function So(e) {
  return e.reduce((t, n) => Ma[n.state] < Ma[t.state] ? n : t);
}
function as(e) {
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
function Bt(e) {
  if (e === "queued") return "queued";
  switch (as(e)) {
    case "held":
      return "stuck";
    case "not-built":
      return "none";
    default:
      return as(e);
  }
}
const Ea = { DEV: 0, TEST: 1, STAGING: 2, PROD: 3 };
function Gh(e) {
  return Ea[e] ?? Object.keys(Ea).length;
}
function qh(e, t, n) {
  const r = [], s = /* @__PURE__ */ new Map();
  for (const a of e) {
    const i = Tn(a.envName);
    let o = s.get(i);
    o || (o = [], s.set(i, o), r.push(i)), o.push(a);
  }
  return r.map((a) => {
    const i = s.get(a), o = So(i), l = i.map((c) => `${c.envName}: ${yo(c, t)}`).join("; ");
    return {
      family: a,
      familyOrder: Gh(a),
      count: i.length,
      state: o.state,
      tone: Bt(o.state),
      sentence: l,
      href: Ms(o.cluster, o.namespace, o.rolloutName),
      theme: o.theme,
      approvalWait: o.state === "gated" && o.approvalWait === !0
    };
  });
}
function Ta(e) {
  return e.map((t) => `${t.family}:${t.state}`).join("|");
}
const Na = {
  failed: 0,
  held: 1,
  active: 2,
  "not-built": 3,
  live: 4
};
function Kh(e, t, n) {
  return [...e].sort((r, s) => Na[t(r)] - Na[t(s)] || n(r).localeCompare(n(s)));
}
function Yh(e, t = /* @__PURE__ */ new Date()) {
  const n = e.services.map((i) => {
    const o = i.cells.length ? So(i.cells) : null;
    return {
      appName: i.appName,
      marks: qh(i.cells, t, i.builtElsewhere),
      verdictWord: o ? as(o.state) : "live",
      landedCount: i.cells.filter((l) => l.state === "live").length,
      total: i.cells.length
    };
  });
  if (n.length === 0)
    return { services: n, allSameLabel: null, visible: [], overflow: null };
  const r = Ta(n[0].marks);
  if (n.every((i) => Ta(i.marks) === r))
    return {
      services: n,
      allSameLabel: `all ${n.length} service${n.length === 1 ? "" : "s"}`,
      visible: n,
      overflow: null
    };
  const a = Kh(
    n,
    (i) => i.verdictWord,
    (i) => i.appName
  );
  return { services: n, allSameLabel: null, visible: a, overflow: null };
}
function Zh(e) {
  if (!e) return "";
  const t = e.indexOf("@sha1:"), n = t >= 0 ? e.slice(t + 6) : e;
  return /^[0-9a-f]{7,64}$/i.test(n) ? n : "";
}
function Xh(e) {
  return e.verdictTone !== "live";
}
function Jh(e) {
  const t = e.services.flatMap((r) => r.cells).filter((r) => r.state !== "not-built");
  if (t.length === 0 || t.every((r) => r.state === "live")) return null;
  const n = t.filter((r) => r.state !== "live").map((r) => ({ cell: r }));
  return oo(n)?.cell ?? null;
}
function Qh(e, t) {
  if (!e) return null;
  const n = Vh(e, t), r = zh(e);
  return n && r ? `${n} · ${r}` : n ?? r ?? null;
}
function ev(e, t) {
  const n = Mo({ grid: t }), r = n.findIndex((o) => o.tone !== "live");
  if (r === -1 || n[r].builtCount === 0) return null;
  const s = n[r], a = (o) => s.tone === "stuck" ? Co.has(o) : s.tone === "failed" ? o === "failed" : o !== "not-built";
  let i = null;
  for (const o of e.services)
    for (const l of o.cells) {
      if (Tn(l.envName) !== s.family || !a(l.state) || !l.since) continue;
      const c = new Date(l.since).getTime();
      Number.isFinite(c) && (i == null || c > i) && (i = c);
    }
  return i != null ? new Date(i).toISOString() : null;
}
function tv(e, t) {
  const n = av({ grid: t, services: e.services });
  if (!n || n.builtCount === 0 || n.anyResolved) return null;
  const r = (i) => i === "rolled-back" ? !1 : n.tone === "stuck" ? Co.has(i) : n.tone === "failed" ? i === "failed" : i !== "not-built";
  let s = null, a = -1 / 0;
  for (const i of e.services)
    for (const o of i.cells) {
      if (Tn(o.envName) !== n.family || !r(o.state)) continue;
      const l = o.since ? new Date(o.since).getTime() : -1 / 0;
      (s === null || l >= a) && (s = o, a = l);
    }
  return s;
}
function nv(e, t) {
  return wh(e, t)?.ms ?? null;
}
function rv(e, t, n, r, s, a) {
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
  }, o = Bh(i, t, n, r, s, { graph: a }), l = { word: o.verdictWord, tone: o.verdictTone }, c = Jh(o), u = Yh(o, s), d = e.kind === "pr" && e.number != null ? In(e.owner, e.repo, { number: e.number }) : In(e.owner, e.repo, { sha: e.mergeCommitSha }), f = tv(o, u), p = (() => {
    const v = Zh(f?.revision) || f?.revision || null;
    return !v || new Yt([e.mergeCommitSha]).has(v) || !new Yt(e.containedIn).has(v) ? null : v;
  })(), w = p ? p.slice(0, 7) : null, _ = p ? In(e.owner, e.repo, { sha: p }) : null;
  return {
    owner: e.owner,
    repo: e.repo,
    repoKey: `${e.owner}/${e.repo}`.toLowerCase(),
    kind: e.kind,
    number: e.number,
    title: e.title,
    sha: e.mergeCommitSha,
    shortSha: e.mergeCommitSha.slice(0, 7),
    href: d,
    htmlUrl: e.htmlUrl,
    author: e.author,
    mergedAt: e.mergedAt,
    verdictWord: l.word,
    verdictTone: l.tone,
    grid: u,
    notEverywhere: Xh(o),
    prodLeadMs: nv(o, e.mergedAt),
    frontierReason: Qh(c, s),
    frontierSince: ev(o, u),
    noRelease: o.noRelease,
    carrierSha: w,
    carrierHref: _,
    services: o.services
  };
}
function sv(e, t, n, r, s = /* @__PURE__ */ new Date()) {
  if (e.length === 0) return [];
  const a = $h(t, n, r);
  return e.map((i) => rv(i, t, n, r, s, a));
}
const Co = /* @__PURE__ */ new Set(["gated", "waiting-upstream", "pinned"]);
function av(e) {
  const t = Mo(e), n = t.find((i) => i.tone === "failed");
  if (n) return n;
  const r = t.find((i) => i.tone === "stuck");
  if (r) return r;
  let s = -1;
  for (let i = 0; i < t.length; i++)
    t[i].liveCount > 0 && (s = i);
  if (s !== -1 && t[s].liveCount < t[s].builtCount)
    return t[s];
  const a = t.findIndex((i) => i.tone !== "live" || i.liveCount < i.builtCount);
  return a === -1 ? null : t[a];
}
function Mo(e) {
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
        const c = Tn(l.envName);
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
  const r = [...t.entries()].sort(
    (i, o) => Wt.indexOf(Fe(i[0].toLowerCase())) - Wt.indexOf(Fe(o[0].toLowerCase()))
  ), s = [];
  let a = !1;
  for (const [i, o] of r) {
    const l = o[0].familyOrder, c = o.map((y) => y.sentence).join("; "), u = n?.get(i);
    let d, f, p, w, _ = !1, v = !1;
    if (u && u.length > 0) {
      const y = u.filter((h) => h.state !== "not-built");
      if (d = y.map((h) => ({ tone: Bt(h.state), state: h.state })), f = y.filter((h) => h.state === "live").length, v = y.some((h) => h.state === "rolled-back"), y.length === 0)
        p = "none", w = "not-built";
      else if (f === y.length)
        p = "live", w = null;
      else {
        const h = y.find((C) => Bt(C.state) === "failed"), E = y.find((C) => Bt(C.state) === "stuck" && io(C));
        if (h)
          p = "failed", w = h.state;
        else if (E)
          p = "stuck", w = E.state, _ = E.approvalWait ?? !1;
        else if (f > 0)
          p = "live", w = null;
        else {
          const C = y.find(
            (A) => A.state !== "rolled-back" && Bt(A.state) === "active"
          ), b = y.find((A) => Bt(A.state) === "queued"), T = y.find((A) => Bt(A.state) === "stuck");
          C ? (p = "active", w = C.state) : b ? (p = "queued", w = b.state) : T ? (p = "queued", w = T.state) : (p = "active", w = "rolled-back");
        }
      }
    } else {
      const y = o.filter((h) => h.tone !== "none");
      if (d = y, f = y.filter((h) => h.tone === "live").length, v = y.some((h) => h.state === "rolled-back"), y.length === 0)
        p = "none", w = "not-built";
      else if (f === y.length)
        p = "live", w = null;
      else {
        const h = y.find((b) => b.tone === "failed"), E = y.find((b) => b.tone === "stuck"), C = !!E;
        if (h)
          p = "failed", w = h.state;
        else if (E && C)
          p = "stuck", w = E.state, _ = E.approvalWait;
        else if (f > 0)
          p = "live", w = null;
        else {
          const b = y.find((A) => A.tone === "active" && A.state !== "rolled-back"), T = y.find((A) => A.tone === "queued");
          if (b)
            p = "active", w = b.state;
          else if (T)
            p = "queued", w = T.state;
          else {
            const A = y.find((S) => S.state === "rolled-back") ?? y[0];
            p = "active", w = A.state;
          }
        }
      }
    }
    const g = w === "rolled-back";
    if (a) {
      s.push({
        family: i,
        familyOrder: l,
        tone: "none",
        state: w,
        builtCount: d.length,
        liveCount: f,
        sentence: c,
        // Frozen (the change cannot have moved further than its own
        // frontier): the family's own `approvalWait` is moot here, same
        // as its `tone` — nothing downstream reads amber or "waits for
        // you" for a family the walk has already passed.
        approvalWait: !1,
        resolved: g,
        anyResolved: v
      });
      continue;
    }
    s.push({
      family: i,
      familyOrder: l,
      tone: p,
      state: w,
      builtCount: d.length,
      liveCount: f,
      sentence: c,
      approvalWait: _,
      resolved: g,
      anyResolved: v
    }), (p === "stuck" || p === "failed") && (a = !0);
  }
  return s;
}
function iv(e) {
  const t = e.environments?.items ?? [];
  let n = Ns({
    environments: e.environments ?? null,
    rolloutDependencies: e.rolloutDependencies ?? null,
    rolloutGates: e.rolloutGates ?? null,
    schedulesExpected: e.schedulesExpected
  });
  if (e.schedulesByCluster)
    n = lh(
      n,
      e.schedulesByCluster,
      ah(e.rollouts)
    );
  else if (e.schedulesForNamespace)
    n = rs(
      n,
      e.schedulesForNamespace.namespace,
      e.schedulesForNamespace.list
    );
  else if (e.scheduleObjectsByNamespace)
    for (const [a, i] of Object.entries(e.scheduleObjectsByNamespace))
      n = rs(n, a, i);
  const r = Fs({
    rollouts: e.rollouts,
    environments: t,
    dependencies: e.rolloutDependencies?.items ?? [],
    envOrder: e.envOrder ?? [],
    gates: n,
    focus: e.focus
  }), s = (a, i, o) => ko(r, a, i, o);
  return {
    gateContext: n,
    providerNetwork: r,
    contractHoldsFor: s,
    storyFor: (a, i = {}) => Kt(a, n, { ...i, contractHolds: s(a) })
  };
}
const ov = ["not-built", "cancelled", "queued", "promoting"], is = ["gated", "pinned", "waiting-upstream"];
function Sn(e) {
  return Ms(e.sourceCluster || "local", e.ns, e.name);
}
function Eo(e) {
  return _r(`/apps/${encodeURIComponent(e)}`);
}
function lv(e) {
  return e == null || e <= 0 ? null : Math.max(1, Math.round(e / 6e4));
}
function cv(e) {
  const t = e?.status?.history ?? [], n = Os(e), r = /* @__PURE__ */ new Set();
  return n.forEach((s, a) => {
    if (s?.kind === "rollback") {
      const i = t[a + 1]?.version?.revision;
      i && r.add(i.toLowerCase());
    }
  }), r;
}
function uv(e) {
  const t = e?.status?.history?.[0];
  return t?.failedHealthChecks && t.failedHealthChecks.length ? t.version?.revision ?? null : null;
}
function dv(e) {
  return e.map((t) => {
    if (t.checkFailure) return t;
    const n = t.rollout?.status?.history?.[0], r = n?.failedHealthChecks ?? [];
    if (!r.length) return t;
    const s = {
      check: r[0]?.name ?? null,
      detail: r[0]?.message ?? null,
      raw: n?.bakeStatusMessage || r[0]?.message || "health check failing",
      // When it began failing: the failed attempt's own end, falling back to
      // the deploy start only when the entry has none (`historyEntrySince`,
      // the rule `eventAge('failed')` and the failed `PrCell.since` read).
      // `head.timestamp` alone dated the failure from the deploy, so Needs
      // you and Your changes printed two ages for one failure.
      since: Ds(n)
    };
    return { ...t, checkFailure: s };
  });
}
function fv(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const s of e) {
    if (!s.envName) continue;
    const a = n.get(s.name) ?? /* @__PURE__ */ new Map();
    a.set(s.envName, {
      rolledBack: cv(s.rollout),
      failingRev: uv(s.rollout)
    }), n.set(s.name, a);
  }
  const r = /* @__PURE__ */ new Map();
  for (const s of t) {
    if (s.noRelease) continue;
    const a = s.number != null ? `#${s.number}` : s.shortSha, i = n.get(s.repo);
    if (i)
      for (const [o, l] of i) {
        let c = null;
        if (l.failingRev && new Yt([l.failingRev]).has(s.sha) ? c = "failed" : [...l.rolledBack].some((f) => new Yt([f]).has(s.sha)) && (c = "rolled-back"), !c) continue;
        const u = r.get(s.repo) ?? /* @__PURE__ */ new Map(), d = u.get(o) ?? /* @__PURE__ */ new Map();
        d.set(a, c), u.set(o, d), r.set(s.repo, u);
      }
  }
  return r;
}
function pv(e, t, n, r, s, a) {
  if (ov.includes(e.state) || is.includes(e.state) && e.held === !1) return null;
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
  if (r === "failed" || e.state === "failed") return { ...i, state: "failed" };
  if (r === "rolled-back" || e.state === "rolled-back")
    return e.state === "live" ? { ...i, state: "rolled-back", liveAgain: !0 } : { ...i, state: "rolled-back" };
  if (e.state === "deploying") return { ...i, state: "deploying" };
  if (e.state === "baking")
    return { ...i, state: "checking", checkingMinutesLeft: lv(e.bakeLeftMs) };
  if (e.state === "retrying") return { ...i, state: "checking" };
  if (is.includes(e.state)) {
    const o = e.approvalWait ?? e.gateApprovalGuess, l = {
      ...i,
      since: e.since ?? a?.since ?? null,
      state: o ? "awaiting-approval" : "held-by-rule"
    }, c = e.state === "waiting-upstream" && e.gateSubjectKind === "service" ? e.gateSubject : null;
    if (!c) return l;
    const u = e.gateHint;
    return u ? {
      ...l,
      waitsOn: c,
      waitsOnHref: `${Ms(u.cluster || "local", u.namespace, u.rolloutName)}/gates`
    } : { ...l, waitsOn: c };
  }
  return e.state === "live" ? { ...i, state: s ? "healthy" : "superseded" } : null;
}
function hv(e, t, n, r) {
  const s = [...t].sort((d, f) => Date.parse(f.mergedAt) - Date.parse(d.mergedAt)), a = /* @__PURE__ */ new Map(), i = [], o = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), c = [];
  for (const d of s) {
    if (d.noRelease) {
      if (d.repo === e) {
        const _ = d.number != null ? `#${d.number}` : d.shortSha;
        i.push({
          ref: _,
          title: d.title,
          href: d.href,
          mergedAt: d.mergedAt,
          since: d.mergedAt,
          checkingMinutesLeft: null,
          state: "not-deployed",
          repo: d.repo,
          apps: [e]
        });
      }
      continue;
    }
    const f = (d.services ?? []).find((_) => _.appName === e);
    if (!f) continue;
    const p = d.number != null ? `#${d.number}` : d.shortSha, w = f.cells.map((_) => {
      const v = n?.get(_.envName)?.get(p);
      let g = !1;
      if (_.state === "live") {
        const h = l.get(_.envName) ?? 0;
        g = h === 0, l.set(_.envName, h + 1);
      }
      const y = is.includes(_.state) && _.held === !0 ? r?.(_, f.cells) : void 0;
      return pv(_, p, d, v, g, y);
    });
    if (f.cells.some((_) => _.state !== "live")) {
      let _ = -1;
      w.forEach((v, g) => {
        !v || v.state === "awaiting-approval" || v.state === "held-by-rule" || (_ < 0 || f.cells[g].envRank >= f.cells[_].envRank) && (_ = g);
      }), _ >= 0 && c.push({
        ref: p,
        env: f.cells[_].envName,
        rank: f.cells[_].envRank,
        change: w[_]
      });
    }
    for (const [_, v] of f.cells.entries()) {
      const g = w[_];
      if (!g) continue;
      const y = o.get(v.envName) ?? 0, h = g.state === "awaiting-approval" || g.state === "held-by-rule";
      if (g.state !== "failed" && g.state !== "rolled-back" && !h) {
        if (y >= 2) continue;
        o.set(v.envName, y + 1);
      }
      const E = a.get(v.envName) ?? [];
      E.push(g), a.set(v.envName, E);
    }
  }
  for (const [d, f] of a) {
    const p = f.filter((_) => _.state === "awaiting-approval" || _.state === "held-by-rule");
    if (p.length <= 1) continue;
    const w = p.reduce(
      (_, v) => Date.parse(_.mergedAt) <= Date.parse(v.mergedAt) ? _ : v
    );
    a.set(
      d,
      f.filter(
        (_) => _.state !== "awaiting-approval" && _.state !== "held-by-rule" ? !0 : _ === w
      )
    );
  }
  const u = /* @__PURE__ */ new Map();
  for (const [d, f] of a)
    for (const p of f)
      u.set(p.ref, Math.max(u.get(p.ref) ?? -1 / 0, ut(d)));
  for (const d of c) {
    if ((u.get(d.ref) ?? -1 / 0) >= d.rank) continue;
    const f = a.get(d.env) ?? [];
    f.push(d.change), a.set(d.env, f);
  }
  return { byEnv: a, merged: i };
}
function kr(e) {
  return e.statusKey === "failed" || e.checkFailure != null ? "failed" : e.rolledBack && e.bakeStatus !== "Deploying" && e.bakeStatus !== "InProgress" && !e.held ? "rolled-back" : Es(e) ? e.heldCause === "person" ? "awaiting-approval" : "held-by-rule" : e.bakeStatus === "Deploying" ? "deploying" : e.bakeStatus === "InProgress" || e.stuck != null ? "checking" : !e.version || e.statusKey === "pending" || e.bakeStatus === "None" ? "not-deployed" : "healthy";
}
function vv(e, t) {
  return t && e.replace(/^prod-?/i, "") || e;
}
function mv(e, t, n) {
  const r = e.rollout, s = r ? cf(
    r,
    t,
    n
  ) : [], a = r ? ff(r, s) : { tracks: [{ name: "", stages: ["pending"] }], bake: "pending" }, i = a.tracks.map((l) => ({
    name: l.name || null,
    stages: l.stages.map((c) => ({ state: c }))
  }));
  let o = null;
  for (const l of a.tracks) {
    const c = l.stages.indexOf("active");
    if (c >= 0) {
      o = { index: c + 1, total: l.stages.length };
      break;
    }
  }
  return { tracks: i, bake: a.bake, activeStep: o, isFallback: s.length === 0 };
}
function gv(e, t, n, r) {
  return [
    ...e.stages.map((a) => ({ node: a, isProdRegion: !1 })),
    ...e.prod.map((a) => ({ node: a, isProdRegion: !0 }))
  ].map(({ node: a, isProdRegion: i }) => ({
    env: a.card.envName,
    label: vv(a.card.envName, i),
    tier: a.tier,
    isProdRegion: i,
    state: kr(a.card),
    version: a.card.version,
    arrivedAt: a.card.timestamp,
    heldSince: No(kr(a.card)) === "held" ? dn(a.card, "held") : null,
    myChanges: t.byEnv.get(a.card.envName) ?? [],
    pipeline: mv(a.card, n, r),
    href: Sn(a.card)
  }));
}
function wv(e, t, n, r, s) {
  const a = /* @__PURE__ */ new Map();
  for (const l of n) a.set(l.mergeCommitSha.slice(0, 7).toLowerCase(), l);
  const i = rh({
    cards: e,
    lanes: t,
    healthChecks: s ? id(s) : null,
    prFor: (l) => {
      const c = a.get(l.toLowerCase());
      return c ? {
        number: c.number != null ? String(c.number) : null,
        title: c.title,
        // the change page, addressed as the Changes list addresses it
        href: c.kind === "pr" && c.number != null ? In(c.owner, c.repo, { number: c.number }) : In(c.owner, c.repo, { sha: c.mergeCommitSha }),
        author: c.author
      } : null;
    },
    isApproval: (l) => l.heldCause === "person",
    now: r,
    href: Sn,
    appHref: Eo
  }), o = /* @__PURE__ */ new Set([...Jp, "failed"]);
  return i.filter((l) => o.has(l.kind)).map((l) => ({
    key: l.key,
    kind: l.kind,
    app: l.app,
    env: l.env,
    phrase: l.evidence || l.kind,
    facts: l.facts ?? null,
    since: l.since,
    ageMs: Math.max(0, r.getTime() - Date.parse(l.since)),
    href: l.href
  }));
}
function _v(e) {
  return e === "person" ? "approval" : e === "order" ? "order" : e === "dependency" ? "dependency" : "other";
}
function To(e) {
  if (e.checkFailure) return "failed-healthcheck";
  if (e.statusKey === "failed")
    return e.failureCategory === "healthcheck" || Qi(e.bakeStatusMessage) === "healthcheck" ? "failed-healthcheck" : "failed-deploy";
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
function bv(e, t) {
  const n = To(e);
  if (n === "check") {
    const r = t?.(e).checks;
    return r ? { reason: n, checks: r } : { reason: n };
  }
  if (n === "dependency") {
    const r = t?.(e).provider;
    return r ? { reason: n, provider: r } : { reason: n };
  }
  return { reason: n };
}
function kv(e) {
  switch (e) {
    case "failed-healthcheck":
      return /* @__PURE__ */ go();
    case "failed-deploy":
      return /* @__PURE__ */ wo();
    case "stuck":
      return /* @__PURE__ */ jp();
    case "approval":
      return /* @__PURE__ */ Pp();
    case "dependency":
      return /* @__PURE__ */ Hp();
    case "order":
      return /* @__PURE__ */ Vp();
    case "clock":
      return /* @__PURE__ */ Up();
    case "check":
      return /* @__PURE__ */ Wp();
    case "pinned":
      return /* @__PURE__ */ zp();
    case "rule":
      return /* @__PURE__ */ bp();
  }
}
function sr(e) {
  return Wn(e) ? 0 : e.heldCause === "person" ? 1 : 2;
}
function yv(e) {
  return Wn(e) ? "failed" : e.heldCause ?? "other";
}
function Sv(e, t, n) {
  return (r) => {
    const s = Kt(r.rollout, e, {
      contractHolds: t(r.rollout),
      now: n
    }), a = [...new Set(s.gates.filter((o) => o.clears === "check").map((o) => o.id))], i = [
      ...new Set(
        s.gates.filter((o) => o.kind === "dependency" && o.subjectKind === "service" && o.subject).map((o) => o.subject)
      )
    ];
    return {
      ...a.length ? { checks: a } : {},
      ...i.length === 1 ? { provider: i[0] } : {}
    };
  };
}
function Cv(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e) {
    if (!r.envName || !Wn(r) && !Es(r)) continue;
    const s = `${r.name}|${yv(r)}`, a = n.get(s);
    (!a || sr(r) < sr(a)) && n.set(s, r);
  }
  return [...n.values()].sort((r, s) => r.name.localeCompare(s.name) || sr(r) - sr(s)).map((r) => ({
    app: r.name,
    env: r.envName,
    cause: Wn(r) ? "other" : _v(r.heldCause),
    phrase: kv(To(r)),
    facts: bv(r, t),
    href: Sn(r)
  }));
}
function Mv(e, t, n) {
  const s = xf(e, (a) => a.heldCause === "person");
  return {
    apps: t.apps,
    mappedApps: t.mappedApps,
    places: t.places,
    prodHealthy: { healthy: s.total - s.failing, total: s.total },
    sinceDelta: t.hasPrev ? { deploys: t.deploys.value, deploysPrev: t.deploys.prev } : null,
    needsYou: Cv(e, n)
  };
}
function Ev(e, t, n, r) {
  return n.has(e) || t ? "starred" : r ? "active" : "quiet";
}
function No(e) {
  return e === "failed" ? "failed" : e === "deploying" ? "deploying" : e === "checking" ? "checking" : e === "awaiting-approval" || e === "held-by-rule" ? "held" : null;
}
function Tv(e, t) {
  for (const n of [...e.stages, ...e.prod])
    if (n.card.envName !== t && kr(n.card) === "awaiting-approval")
      return {
        label: /* @__PURE__ */ Gp({ env: n.card.envName }),
        href: Sn(n.card)
      };
  return null;
}
function Nv(e, t) {
  const n = {
    figure: null,
    phrase: null,
    facts: { lead: null, since: null },
    primaryAction: null,
    secondaryAction: null
  };
  if (!e?.lead) return n;
  const r = e.lead, s = kr(r.card), a = No(s), i = a ? dn(r.card, a) : null, o = i ? Rs(i, t) : null, l = r.card.envName, c = { lead: s, since: i ?? null };
  return s === "failed" ? {
    figure: o,
    phrase: /* @__PURE__ */ qp({ env: l }),
    facts: c,
    primaryAction: { label: /* @__PURE__ */ yp({ env: l }), href: Sn(r.card) },
    secondaryAction: Tv(e, l)
  } : s === "awaiting-approval" ? {
    figure: o,
    phrase: /* @__PURE__ */ Kp({ env: l }),
    facts: c,
    primaryAction: { label: /* @__PURE__ */ Sp(), href: Sn(r.card) },
    secondaryAction: null
  } : s === "held-by-rule" ? {
    figure: o,
    phrase: /* @__PURE__ */ Yp({ env: l }),
    facts: c,
    primaryAction: null,
    secondaryAction: null
  } : s === "deploying" || s === "checking" ? { figure: o, phrase: s === "deploying" ? /* @__PURE__ */ Zp({ env: l }) : /* @__PURE__ */ Xp({ env: l }), facts: c, primaryAction: null, secondaryAction: null } : n;
}
function Av(e, t, n) {
  if (!n?.get(e.envName)?.held) return;
  let s = null;
  if (e.revision) {
    const a = new Yt([e.revision]);
    for (const i of t)
      if (!(i.envRank >= e.envRank))
        for (const o of n?.get(i.envName)?.rollout?.status?.history ?? []) {
          const l = o.version?.revision, c = o.timestamp ? Date.parse(o.timestamp) : NaN;
          l && a.has(l) && !Number.isNaN(c) && (s == null || c > s) && (s = c);
        }
  }
  return { since: s != null ? new Date(s).toISOString() : null };
}
function xv(e) {
  const { changes: t, rollouts: n, environments: r, rolloutDependencies: s, me: a, now: i } = e, o = e.kustomizations ?? [], l = e.kruiseRollouts ?? [], c = e.starredApps ?? /* @__PURE__ */ new Set(), u = e.pulseRange ?? "24h", d = iv({
    rollouts: n,
    environments: { items: r },
    rolloutDependencies: s ?? null,
    schedulesExpected: !1
  }), f = dv(
    of(n, r, i, d.gateContext, d.contractHoldsFor)
  ), p = co(f), w = new Map(p.map((T) => [T.app, T])), _ = Sf(f, n, i.getTime(), u), v = sv(
    t,
    n,
    r,
    s ?? null,
    i
  ), g = a.toLowerCase(), y = v.filter((T) => T.author.toLowerCase() === g), h = /* @__PURE__ */ new Map();
  for (const T of y) {
    const A = T.noRelease ? [T.repo] : (T.services ?? []).map((S) => S.appName);
    for (const S of new Set(A)) {
      const P = h.get(S) ?? [];
      P.push(T), h.set(S, P);
    }
  }
  const E = /* @__PURE__ */ new Set([...w.keys(), ...h.keys()]), C = /* @__PURE__ */ new Map();
  for (const T of f) {
    if (!T.envName) continue;
    const A = C.get(T.name) ?? /* @__PURE__ */ new Map();
    A.set(T.envName, T), C.set(T.name, A);
  }
  const b = [...E].sort().map((T) => {
    const A = w.get(T), S = h.get(T) ?? [], P = fv(f, S).get(T), m = C.get(T), M = hv(
      T,
      S,
      P,
      (H, U) => Av(H, U, m)
    ), { figure: I, phrase: O, facts: $, primaryAction: R, secondaryAction: L } = Nv(A, i);
    return {
      app: T,
      tier: Ev(T, S.length > 0, c, A),
      figure: I,
      phrase: O,
      facts: $,
      primaryAction: R,
      secondaryAction: L,
      envs: A ? gv(A, M, o, l) : [],
      merged: M.merged,
      href: Eo(T)
    };
  });
  return {
    now: i.toISOString(),
    fleet: Mv(
      f,
      _,
      Sv(d.gateContext, d.contractHoldsFor, i)
    ),
    signals: wv(f, p, t, i, e.healthChecks),
    apps: b
  };
}
const zn = /* @__PURE__ */ new Date("2026-01-01T00:00:00Z"), Aa = "", Rv = (e = zn) => ({ changes: [], rollouts: [], environments: [], rolloutDependencies: { items: [] }, kustomizations: [], kruiseRollouts: [], me: "", now: e, healthChecks: [] });
let Lv = /* @__PURE__ */ Ae(null);
const Or = () => k(Lv);
function xa(e) {
  return e === "failed" || e === "rolled-back" ? "healthy" : e;
}
function Ov(e) {
  const t = e.blocker;
  return !t || t.outcome !== "failed" && t.outcome !== "cancelled" ? e : { ...e, blocker: null, waveReady: !0 };
}
function Dv(e) {
  const t = Ao(e), n = (r) => r === "awaiting-approval" ? "healthy" : r;
  return {
    ...t,
    signals: t.signals.filter((r) => r.kind !== "check-flapping"),
    apps: t.apps.map((r) => ({ ...r, envs: r.envs.map((s) => ({ ...s, state: n(s.state), myChanges: s.myChanges.map((a) => ({ ...a, state: n(a.state) })) })) }))
  };
}
function Ao(e) {
  return {
    ...e,
    signals: e.signals.filter((t) => t.kind !== "check-failing"),
    apps: e.apps.map((t) => ({
      ...t,
      envs: t.envs.map((n) => ({
        ...Ov(n),
        state: xa(n.state),
        myChanges: n.myChanges.map((r) => ({ ...r, state: xa(r.state) }))
      }))
    }))
  };
}
let Fv = /* @__PURE__ */ Ae(0);
const xo = () => k(Fv);
class Iv extends Date {
  constructor() {
    super(zn.getTime());
  }
  ms() {
    return (Or()?.now ?? zn).getTime();
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
new Iv();
const Ra = {
  "hello-dep-dev": "2026-10-24T18:46:26.893Z",
  "hello-dep-staging": "2026-10-24T18:58:26.893Z"
}, $v = "2026-10-24T18:33:49.255Z";
function Bv() {
  const e = Rv(zn), t = e.rollouts.map((s) => {
    const a = Ra[s.metadata.namespace];
    if (!a || s.metadata.name !== "hello-frontend-app" || !s.status.history?.length) return s;
    const [i, ...o] = s.status.history;
    return { ...s, status: { ...s.status, history: [{ ...i, timestamp: a }, ...o] } };
  }), n = e.environments.map((s) => {
    const a = Ra[s.metadata.namespace];
    return a && s.metadata.name === "hello-frontend-app" ? { ...s, status: { ...s.status, lastStatusChangeTime: a } } : s;
  }), r = e.changes.map(
    (s) => s.repo === "hello-frontend-app" && s.number === 13 ? { ...s, mergedAt: $v } : s
  );
  return { ...e, rollouts: t, environments: n, changes: r };
}
let qr = null;
function jv() {
  if (qr) return qr;
  const e = Bv();
  return qr = {
    rollouts: e.rollouts,
    environments: e.environments,
    rolloutDependencies: e.rolloutDependencies,
    kustomizations: e.kustomizations,
    kruiseRollouts: e.kruiseRollouts,
    changes: e.changes,
    changesState: "ok",
    healthChecks: e.healthChecks,
    github: { configured: !0, connected: !0, login: Aa },
    me: Aa,
    now: zn
  };
}
const An = () => Or() ?? jv(), Pv = () => Or() !== null, La = /* @__PURE__ */ new WeakMap();
function Hv(e) {
  xo();
  const t = An();
  let n = La.get(t);
  return n || (n = xv({
    changes: t.changes,
    rollouts: t.rollouts,
    environments: t.environments,
    rolloutDependencies: t.rolloutDependencies,
    kustomizations: t.kustomizations,
    kruiseRollouts: t.kruiseRollouts,
    me: t.me,
    now: t.now,
    healthChecks: t.healthChecks
  }), La.set(t, n)), Or() ? n : e === "quiet" ? Dv(n) : e === "calm" ? Ao(n) : n;
}
function Oa(e, t) {
  if (!t) return null;
  const n = An().changes, r = (i) => i.mergeCommitSha.startsWith(t) || t.startsWith(i.mergeCommitSha.slice(0, 7)), s = n.find((i) => e.startsWith(i.repo) && r(i)) ?? (t.length >= 7 ? n.find(r) : null);
  if (!s) return null;
  const a = s.htmlUrl.split("/").pop() ?? "";
  return { ref: /^\d+$/.test(a) ? `#${a}` : a.slice(0, 7), title: s.title, author: s.author, mergedAt: s.mergedAt, href: s.htmlUrl };
}
const Vv = () => An().rollouts, Is = (e) => {
  const t = e.split("/").filter(Boolean);
  return t[0] === "rollouts" ? { cluster: t[1], ns: t[2], name: t[3] } : null;
}, It = (e) => {
  xo();
  const t = Is(e);
  return t ? Vv().find((n) => n.metadata.namespace === t.ns && n.metadata.name === t.name) ?? null : null;
}, Kr = (e) => e === "done" ? "done" : e === "fail" ? "fail" : e === "active" ? "active" : "todo";
function Uv(e) {
  if (!e) return [{ name: "Started", state: "done" }, { name: "Check", state: "todo" }];
  if (e.isFallback) {
    const n = e.tracks[0]?.stages[0]?.state ?? "pending";
    return [{ name: "Started", state: "done" }, { name: "Check", state: n === "active" ? "todo" : Kr(n === "fail" ? n : e.bake) }];
  }
  const t = [{ name: "Started", state: "done" }];
  for (const n of e.tracks) n.stages.forEach((r, s) => t.push({ name: `Stage ${s + 1}`, state: Kr(r.state) }));
  return t.push({ name: "Check", state: Kr(e.bake) }), t;
}
function Wv(e) {
  const t = Uv(e.pipeline);
  if ((e.state === "awaiting-approval" || e.state === "held-by-rule") && !t.some((n) => n.state === "active")) return t.map((n) => ({ name: n.name, state: "done" }));
  if (e.state === "awaiting-approval" || e.state === "held-by-rule") return t;
  if (e.state === "checking") return t.map((n, r) => ({ name: n.name, state: r === t.length - 1 ? "active" : "done" }));
  if (e.state === "deploying" && (!e.pipeline || e.pipeline.isFallback)) return t.map((n, r) => ({ name: n.name, state: r < t.length - 1 ? "done" : "active" }));
  if (e.state === "deploying") {
    let n = t.findIndex((r) => r.state === "active");
    return n < 0 && (n = t.findIndex((r) => r.state === "todo" && r.name !== "Check")), n < 0 && (n = 0), t.map((r, s) => ({ name: r.name, state: s < n ? "done" : s === n ? "active" : "todo" }));
  }
  return t;
}
const zv = (e) => e.map((t) => `${t.name}:${t.state}`).join("|");
function Gv(e) {
  if (e.group !== "failed") return null;
  const t = It(e.href)?.status.history?.[0];
  if (!t) return null;
  const n = t.failedHealthChecks?.[0], r = /^A HealthCheck reported an error/.test(t.bakeStatusMessage ?? ""), s = t.bakeStatusMessage && !r ? t.bakeStatusMessage : null, a = n?.name ?? null, i = n?.message ?? null, o = i?.split(/;\s/)[0] ?? null, l = a && o ? `${a}: ${o}` : a ?? o ?? s ?? "Failing", c = Is(e.href), d = (c ? (An().healthChecks ?? []).find((f) => f.metadata.namespace === c.ns && f.metadata.name === c.name)?.healthChecks.find((f) => f.metadata?.name === a) : void 0)?.status?.observations ?? n?.observations ?? [];
  return { check: a, message: i, phrase: s, line: l, observations: d };
}
function qv(e) {
  const t = e.regions ?? (e.label ? [e.label] : []), n = Lr(t), r = t.map((s) => (s ?? "").trim()).find((s) => eo(s) !== "default");
  return e.tier === "prod" ? n > 1 ? `${n} prod regions` : r ?? "production" : t.find((s) => s && s.trim()) ?? e.tier;
}
const Kv = (e) => {
  const t = It(e.href)?.status.history?.[0]?.version;
  return (t ? mt(t.version ?? t.tag ?? t.revision) : null) ?? e.version ?? "";
};
function Yv(e) {
  const t = e, n = t.steps ?? Wv(e), r = e.group === "approval" ? em(e) : null;
  return {
    "data-truth-state": e.state,
    "data-truth-steps": zv(n),
    "data-truth-age": t.deployedAt ?? It(e.href)?.status.history?.[0]?.timestamp ?? e.since ?? "",
    "data-truth-since": r?.since ?? e.since ?? "",
    ...r ? { "data-truth-wait-build": r.build } : {},
    "data-truth-cause": (t.failure ?? Gv(e))?.line ?? e.cause ?? (e.state === "awaiting-approval" ? or("approval") : e.word),
    "data-truth-build": Kv(e),
    "data-truth-place": qv(e)
  };
}
const Yr = { dev: 0, test: 1, staging: 2, prod: 3 }, Zv = () => An().changes, Xv = (e) => e.isProdRegion || e.tier === "prod" ? "prod" : e.tier === "dev" ? "dev" : e.tier === "test" ? "test" : "staging", mt = (e) => e ? /^[0-9a-f]{8,40}$/.test(e) ? e.slice(0, 7) : e : null, yr = /^(\d+)\.(\d+)\.(\d+)(?:-(\d+))?$/, Jv = (e, t) => {
  const n = yr.exec(e), r = yr.exec(t);
  for (let s = 1; s <= 4; s++) {
    const a = +(n[s] ?? 0) - +(r[s] ?? 0);
    if (a) return a;
  }
  return 0;
};
function Qv(e, t) {
  const n = (Hv(e).apps.find((a) => a.app === t)?.envs ?? []).filter((a) => a.state !== "not-deployed" && a.version), r = [...n].sort((a, i) => {
    const o = mt(a.version), l = mt(i.version);
    if (yr.test(o) && yr.test(l)) return Jv(l, o);
    const c = Oa(t, o)?.mergedAt, u = Oa(t, l)?.mergedAt;
    return c && u && c !== u ? u.localeCompare(c) : (i.arrivedAt ?? "").localeCompare(a.arrivedAt ?? "");
  })[0], s = r ? mt(r.version) : null;
  return n.map((a) => ({ env: a.env, label: a.label, tier: Xv(a), state: a.state, href: a.href, version: mt(a.version), onNewest: mt(a.version) === s && a.state !== "failed", onBuild: mt(a.version) === s, newest: s }));
}
function em(e) {
  const t = im(e), n = t.some((o) => o.here) ? t.filter((o) => o.here) : t, r = Qv("incident", e.app), s = r.find((o) => o.href === e.href), a = (o) => s ? Math.max(-1, ...r.filter((l) => Yr[l.tier] < Yr[s.tier] && mt(l.version) === o).map((l) => Yr[l.tier])) : -1, i = [...n].sort((o, l) => a(l.build) - a(o.build));
  return i[0] ? { build: i[0].build, title: i[0].title, author: i[0].author, since: i[0].created, count: i.length } : null;
}
const Da = /* @__PURE__ */ new WeakMap();
function tm() {
  const e = An(), t = Da.get(e);
  if (t) return t;
  const n = /* @__PURE__ */ new Map();
  for (const r of Zv()) n.set(r.mergeCommitSha.slice(0, 7), { pr: r.kind === "pr" ? r.number ?? null : null, title: r.title, author: r.author ?? null, href: r.htmlUrl ?? null, repo: r.repo });
  if (!Pv())
    try {
      const r = JSON.parse(ef("GET", "/api/github/changes", new URLSearchParams({ days: "365" }))?.body ?? "{}");
      for (const s of r.changes ?? [])
        n.set(s.mergeCommitSha.slice(0, 7), { pr: s.kind === "pr" ? s.number ?? null : null, title: s.title, author: s.author, href: s.htmlUrl, repo: s.repo });
    } catch {
    }
  return Da.set(e, n), n;
}
function Ro(e, t) {
  if (!e) return null;
  let n = /^[0-9a-f]{7,40}$/.test(e) ? e.slice(0, 7) : null;
  return !n && t && (n = (It(t)?.status.availableReleases ?? []).find((s) => s.tag === e || s.version === e)?.revision?.slice(0, 7) ?? null), n ? tm().get(n) ?? null : null;
}
function nm(e, t) {
  const n = Is(e), r = It(e)?.status.availableReleases ?? [], s = r.findIndex((o) => o.tag === t || o.version === t);
  if (!n || s < 0) return null;
  const a = r[s].revision ?? r[s].tag ?? t, i = s > 0 ? r[s - 1].revision ?? r[s - 1].tag ?? "" : "";
  try {
    const o = so(tf(n.ns, n.name, n.cluster), { base: i, head: a });
    if (!o) return null;
    const l = o.commits ?? [], c = l[l.length - 1];
    if (!c) return null;
    const u = /^Release commit for build /.test(String(c.message)) ? Ro(c.sha, e) : null;
    return u && (c.message = u.title, c.author = u.author ?? c.author), { title: String(c.message).split(`
`)[0], author: c.author ?? null, additions: o.additions ?? 0, deletions: o.deletions ?? 0, files: o.changedFiles ?? 0, commits: l.map((d) => ({ sha: d.sha.slice(0, 7), title: String(d.message).split(`
`)[0], author: d.author ?? null })) };
  } catch {
    return null;
  }
}
function rm(e, t) {
  if (!t) return null;
  const n = It(e)?.status, r = /^github\.com\/([^/]+)\/(.+)$/.exec(n?.source ?? "");
  if (!r) return null;
  const a = (n?.availableReleases ?? []).find((i) => i.tag === t || i.version === t || (i.revision ?? "").startsWith(t))?.revision ?? (/^[0-9a-f]{7,40}$/.test(t) ? t : null);
  if (!a) return null;
  try {
    const i = so(`/api/github/repos/${r[1]}/${r[2]}/commits/${a}`);
    return i?.subject ? { title: i.subject, author: i.author ?? null } : null;
  } catch {
    return null;
  }
}
function sm(e, t, n) {
  const r = rm(e, t)?.title ?? (n && !/^Release commit for build /.test(n) ? n : null) ?? Ro(t, e)?.title ?? n ?? null;
  return r && !/^Release commit for build /.test(r) ? r : null;
}
function am(e) {
  const t = It(e), n = Xd(e), r = n ? Jd(n) : null;
  return !t || !r ? null : { count: r.count, waiting: r.waiting, stage: r.stage, has: (s) => r.ids.has(Ar(t, s.tag ?? s.version ?? "") || (s.tag ?? s.version ?? "")) };
}
function im(e) {
  const t = It(e.href)?.status, n = (t?.gates ?? []).filter((s) => /^promotion-/.test(s.name) && s.allowedVersions != null), r = am(e.href);
  return (t?.releaseCandidates ?? []).map((s) => {
    const a = s.tag ?? s.version ?? "", i = nm(e.href, a), o = sm(e.href, a, i?.title), l = i?.author ?? null, c = s.version ?? s.tag ?? a;
    return { build: mt(c) ?? c, title: o, author: l, created: s.created ?? null, here: r ? r.has({ tag: s.tag, version: s.version }) : n.every((u) => u.allowedVersions.includes(a)) };
  });
}
const om = { dev: "dev", test: "test", staging: "staging", prod: "production" }, lm = (e) => wr(null, om[e] ?? e);
function cm(e, t) {
  return e.state === "fail" ? "failed" : e.state === "hold" ? "held" : e.state === "done" ? "done" : e.state === "todo" ? "todo" : e.name === "Check" && t !== "deploying" ? "checking" : "deploying";
}
const um = { xs: { d: 10, pitch: 22, line: 1 }, sm: { d: 24, pitch: 56, line: 2 } };
function Lo(e, t, n = !1) {
  return e.map((r) => ({
    state: r.state === "done" ? "done" : r.state === "fail" ? "failed" : r.state === "hold" ? "held" : r.state === "todo" ? "pending" : cm(r, t) === "checking" ? "checking" : "current",
    label: n ? r.name : void 0,
    step: r.name,
    stepState: r.state
  }));
}
var dm = /* @__PURE__ */ ne('<span aria-hidden="true"></span>'), fm = /* @__PURE__ */ ne('<li class="mp-slot svelte-12vk4m5" data-fold="" data-node="fold"><span class="mp-fold t-meta tabular-nums svelte-12vk4m5" aria-hidden="true"> </span></li>'), pm = /* @__PURE__ */ ne('<span aria-hidden="true"></span>'), hm = /* @__PURE__ */ ne("<span></span>"), vm = /* @__PURE__ */ pe('<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M9 5.5v13M15 5.5v13"></path></svg>'), mm = /* @__PURE__ */ ne('<span class="h-1.5 w-1.5 rounded-full bg-success-solid"></span>'), gm = /* @__PURE__ */ ne("<span> </span>"), wm = /* @__PURE__ */ ne('<span aria-hidden="true"><!></span> <!>', 1), _m = /* @__PURE__ */ ne('<li class="mp-slot svelte-12vk4m5"><!></li>'), bm = /* @__PURE__ */ ne("<!> <!>", 1), km = /* @__PURE__ */ ne('<ol data-strand=""></ol>');
function ym(e, t) {
  Qe(t, !0);
  let n = X(t, "size", 3, "xs"), r = X(t, "lit", 3, !0), s = X(t, "dim", 3, !1), a = X(t, "neutral", 3, !1), i = X(t, "max", 3, void 0), o = X(t, "decorative", 3, !1), l = X(t, "label", 3, void 0), c = X(t, "kind", 3, "strand"), u = X(t, "class", 3, "");
  const d = /* @__PURE__ */ de(() => um[n()]), f = /* @__PURE__ */ de(() => Math.max(3, i() ?? (n() === "sm" ? 5 : 6))), p = /* @__PURE__ */ new Set(["current", "checking", "held", "approval", "failed"]), w = /* @__PURE__ */ de(() => {
    const m = t.nodes.map(($) => ({ fold: !1, n: $ }));
    if (t.nodes.length <= k(f)) return m;
    const M = t.nodes.length - k(
      f
      // the fold node takes one slot itself
    ) + 1, I = ($) => $ > 0 && $ < t.nodes.length - 1 && !p.has(t.nodes[$].state);
    let O = null;
    for (let $ = 1; $ < t.nodes.length - 1; ) {
      if (!I($)) {
        $++;
        continue;
      }
      let R = $;
      for (; R < t.nodes.length - 1 && I(R); ) R++;
      if (R - $ >= M) {
        O = [$, $ + M];
        break;
      }
      (!O || R - $ > O[1] - O[0]) && (O = [$, R]), $ = R;
    }
    return !O || O[1] - O[0] < 2 ? m : [
      ...m.slice(0, O[0]),
      { fold: !0, hidden: t.nodes.slice(O[0], O[1]) },
      ...m.slice(O[1])
    ];
  }), _ = /* @__PURE__ */ de(() => k(w).reduce(
    (m, M, I) => (M.fold ? M.hidden.some((O) => O.state !== "pending") : M.n.state !== "pending") ? I : m,
    -1
  )), v = /* @__PURE__ */ de(() => n() === "sm" && t.nodes.some((m) => m.label)), g = /* @__PURE__ */ de(() => k(v) ? (k(d).pitch - 4 - k(d).d) / 2 : 0), y = /* @__PURE__ */ de(() => (k(w).length - 1) * k(d).pitch + k(d).d + 2 * k(g)), h = {
    done: "done",
    current: "running",
    pending: "not started",
    failed: "failed",
    held: "waiting",
    approval: "waiting for approval",
    checking: "checking",
    rest: "healthy"
  }, E = /* @__PURE__ */ de(() => l() ?? "Steps: " + t.nodes.map((m) => `${m.label ?? m.step ?? ""} ${h[m.state]}`.trim()).join(", ")), C = (m) => m === "done" ? "mp-done" : m === "failed" ? "st-fail" : m === "held" ? "st-hold" : m === "approval" ? "mp-ask" : m === "checking" ? "st-check" : m === "current" ? "st-active " + (r() ? "st-live" : "") : m === "rest" ? "mp-rest" : "mp-ring mp-ring-off", b = (m) => m === "done" ? "bg-success-tint text-success" : m === "failed" ? "bg-danger-tint text-danger" : m === "checking" ? "bg-progress-tint text-progress" : m === "current" ? "bg-active-tint text-active" : m === "held" ? "bg-held-tint text-held" : m === "approval" ? "mp-ask text-fg" : m === "rest" ? "bg-subtle" : "bg-subtle text-fg-disabled", T = (m) => m === "checking" ? "border-progress-solid/40 border-t-progress-solid" : "border-active-solid/40 border-t-active-solid", A = (m) => m.title ?? `${m.label ?? m.step ?? ""}${m.label || m.step ? " · " : ""}${h[m.state]}`;
  var S = km();
  let P;
  Hn(S, 21, () => k(w), Ei, (m, M, I) => {
    var O = bm(), $ = ce(O);
    {
      var R = (W) => {
        var x = dm();
        let j, z;
        q(() => {
          j = fe(x, 1, "mp-seg svelte-12vk4m5", null, j, { "mp-solid": I <= k(_) }), z = _t(x, "", z, {
            left: `${(I - 1) * k(d).pitch + k(d).d + k(g)}px`
          });
        }), D(W, x);
      };
      Y($, (W) => {
        I > 0 && W(R);
      });
    }
    var L = ie($, 2);
    {
      var H = (W) => {
        var x = fm();
        let j;
        var z = B(x), J = B(z);
        q(
          (K) => {
            V(x, "title", `${k(M).hidden.length ?? ""} more: ${K ?? ""}`), j = _t(x, "", j, { left: `${I * k(d).pitch + k(g)}px` }), se(J, `+${k(M).hidden.length ?? ""}`);
          },
          [
            () => k(M).hidden.map((K) => K.label ?? K.step ?? h[K.state]).join(", ")
          ]
        ), D(W, x);
      }, U = (W) => {
        const x = /* @__PURE__ */ de(() => k(M).n);
        var j = _m();
        let z;
        var J = B(j);
        {
          var K = (Z) => {
            var Q = pm();
            q((ae) => fe(Q, 1, `st-node mp-dot ${ae ?? ""}`, "svelte-12vk4m5"), [() => C(k(x).state)]), D(Z, Q);
          }, le = (Z) => {
            var Q = wm(), ae = ce(Q), he = B(ae);
            {
              var Te = (be) => {
                xc(be, { class: "h-4 w-4" });
              }, F = (be) => {
                var Le = we(), $e = ce(Le);
                {
                  var ge = (Oe) => {
                    Bc(Oe, { class: "h-4 w-4" });
                  }, tt = (Oe) => {
                    var Mt = we(), $t = ce(Mt);
                    {
                      var N = (ee) => {
                        var Be = hm();
                        q((xn) => fe(Be, 1, `h-4 w-4 animate-spin rounded-full border-2 ${xn ?? ""}`, "svelte-12vk4m5"), [() => T(k(x).state)]), D(ee, Be);
                      }, G = (ee) => {
                        var Be = we(), xn = ce(Be);
                        {
                          var Dr = (je) => {
                            var We = vm();
                            D(je, We);
                          }, Fr = (je) => {
                            var We = we(), Ir = ce(We);
                            {
                              var Jn = (ke) => {
                                Fi(ke, { class: "h-3.5 w-3.5" });
                              }, $r = (ke) => {
                                var $s = we(), Bo = ce($s);
                                {
                                  var jo = (Qt) => {
                                    var Ho = mm();
                                    D(Qt, Ho);
                                  }, Po = (Qt) => {
                                    Dc(Qt, { class: "h-4 w-4" });
                                  };
                                  Y(
                                    Bo,
                                    (Qt) => {
                                      k(x).state === "rest" ? Qt(jo) : Qt(Po, !1);
                                    },
                                    !0
                                  );
                                }
                                D(ke, $s);
                              };
                              Y(
                                Ir,
                                (ke) => {
                                  k(x).state === "approval" ? ke(Jn) : ke($r, !1);
                                },
                                !0
                              );
                            }
                            D(je, We);
                          };
                          Y(
                            xn,
                            (je) => {
                              k(x).state === "held" ? je(Dr) : je(Fr, !1);
                            },
                            !0
                          );
                        }
                        D(ee, Be);
                      };
                      Y(
                        $t,
                        (ee) => {
                          k(x).state === "current" || k(x).state === "checking" ? ee(N) : ee(G, !1);
                        },
                        !0
                      );
                    }
                    D(Oe, Mt);
                  };
                  Y(
                    $e,
                    (Oe) => {
                      k(x).state === "failed" ? Oe(ge) : Oe(tt, !1);
                    },
                    !0
                  );
                }
                D(be, Le);
              };
              Y(he, (be) => {
                k(x).state === "done" ? be(Te) : be(F, !1);
              });
            }
            var ve = ie(ae, 2);
            {
              var Ze = (be) => {
                var Le = gm(), $e = B(Le);
                q(
                  (ge) => {
                    fe(Le, 1, `mp-name ${ge ?? ""} ${k(x).state === "failed" && r() ? "text-danger" : ""}`, "svelte-12vk4m5"), V(Le, "title", k(x).label), se($e, k(x).label);
                  },
                  [
                    () => r() && p.has(k(x).state) ? "t-ui-sm text-fg" : "t-meta text-fg-subtle"
                  ]
                ), D(be, Le);
              };
              Y(ve, (be) => {
                k(x).label && be(Ze);
              });
            }
            q((be) => fe(ae, 1, `mp-disc ${be ?? ""}`, "svelte-12vk4m5"), [() => b(k(x).state)]), D(Z, Q);
          };
          Y(J, (Z) => {
            n() === "xs" ? Z(K) : Z(le, !1);
          });
        }
        q(
          (Z) => {
            V(j, "data-node", k(x).state), V(j, "data-step", o() ? void 0 : k(x).step ?? k(x).label), V(j, "data-state", o() ? void 0 : k(x).stepState ?? k(x).state), V(j, "title", Z), z = _t(j, "", z, { left: `${I * k(d).pitch + k(g)}px` });
          },
          [
            () => o() ? void 0 : n() === "xs" ? A(k(x)) : k(x).title
          ]
        ), D(W, j);
      };
      Y(L, (W) => {
        k(M).fold ? W(H) : W(U, !1);
      });
    }
    D(m, O);
  }), q(() => {
    fe(S, 1, `mp mp-${n() ?? ""} ${s() ? "mp-dim" : ""} ${a() ? "mp-nu" : ""} ${u() ?? ""}`, "svelte-12vk4m5"), V(S, "role", o() ? void 0 : "img"), V(S, "aria-label", o() ? void 0 : k(E)), V(S, "aria-hidden", o() ? "true" : void 0), V(S, "data-pipeline", c()), V(S, "data-size", n()), V(S, "data-pitch", k(d).pitch), V(S, "data-d", k(d).d), V(S, "data-n", k(w).length), V(S, "data-lead", k(g)), P = _t(S, "", P, {
      width: `${k(y) ?? ""}px`,
      height: `${(k(v) ? k(d).d + 28 : k(d).d) ?? ""}px`,
      "--d": `${k(d).d ?? ""}px`,
      "--pitch": `${k(d).pitch ?? ""}px`,
      "--line": `${k(d).line ?? ""}px`,
      "--lead": `${k(g) ?? ""}px`
    });
  }), D(e, S), et();
}
const Sm = () => {
}, Cm = Symbol.for("kuberik-r42-atoms"), Mm = () => Mn(Cm) ?? { regions: !0, lead: !0, get progress() {
  return Sm();
} };
var Em = /* @__PURE__ */ pe('<line y1="4" y2="4" class="lb-wait svelte-hnsc61"><title> </title></line>'), Tm = /* @__PURE__ */ pe('<rect y="1" height="6" rx="1.5"><title> </title></rect>'), Nm = /* @__PURE__ */ pe('<line y1="4" y2="4" class="lb-rest svelte-hnsc61"></line>'), Am = /* @__PURE__ */ pe('<svg height="8" role="img" data-lead-bar=""><!><!><!></svg>');
function xm(e, t) {
  Qe(t, !0);
  let n = X(t, "origin", 3, void 0), r = X(t, "width", 3, 160), s = X(t, "class", 3, "");
  const a = /* @__PURE__ */ de(() => n() ?? t.hops[0]?.start ?? 0), i = (v) => Math.max(0, Math.min(r(), (v - k(a)) / Math.max(1, t.scaleMs) * r())), o = (v) => {
    const g = Math.round(v / 6e4);
    return g < 60 ? `${Math.max(1, g)}m` : `${Math.floor(g / 60)}h${g % 60 ? ` ${g % 60}m` : ""}`;
  }, l = /* @__PURE__ */ de(() => t.hops.map((v, g) => {
    const y = i(v.start), h = Math.max(i(v.end), y + 3);
    return {
      ...v,
      a: y,
      w: h - y,
      last: g === t.hops.length - 1,
      title: `${v.tier}: ${o(v.end - v.start)}`
    };
  })), c = /* @__PURE__ */ de(() => [
    ...n() != null && k(l)[0] ? [
      {
        a: 0,
        b: k(l)[0].a,
        title: `merged; first deploy ${o(t.hops[0].start - n())} later`
      }
    ] : [],
    ...t.hops.slice(1).map((v, g) => ({
      a: k(l)[g].a + k(l)[g].w,
      b: k(l)[g + 1].a,
      title: `waited ${o(v.start - t.hops[g].end)} before ${v.tier}`
    }))
  ].filter((v) => v.b - v.a > 1)), u = /* @__PURE__ */ de(() => k(l).length ? k(l)[k(l).length - 1].a + k(l)[k(l).length - 1].w : 0);
  var d = Am(), f = B(d);
  Hn(f, 17, () => k(c), Ei, (v, g) => {
    var y = Em(), h = B(y), E = B(h);
    q(() => {
      V(y, "x1", k(g).a), V(y, "x2", k(g).b), se(E, k(g).title);
    }), D(v, y);
  });
  var p = ie(f);
  Hn(p, 17, () => k(l), (v) => v.tier + v.start, (v, g) => {
    var y = Tm();
    let h;
    var E = B(y), C = B(E);
    q(() => {
      V(y, "x", k(g).a), V(y, "width", k(g).w), h = fe(y, 0, "lb-run svelte-hnsc61", null, h, { last: k(g).last }), se(C, k(g).title);
    }), D(v, y);
  });
  var w = ie(p);
  {
    var _ = (v) => {
      var g = Nm();
      q(() => {
        V(g, "x1", k(u)), V(g, "x2", r());
      }), D(v, g);
    };
    Y(w, (v) => {
      k(u) < r() && v(_);
    });
  }
  q(
    (v) => {
      fe(d, 0, `lb ${s() ?? ""}`, "svelte-hnsc61"), V(d, "width", r()), V(d, "viewBox", `0 0 ${r() ?? ""} 8`), V(d, "aria-label", `reached prod in ${v ?? ""}`);
    },
    [
      () => o((t.hops.at(-1)?.end ?? k(a)) - k(a))
    ]
  ), D(e, d), et();
}
var Rm = /* @__PURE__ */ ne('<span class="lr-pl t-meta svelte-9kjh2y"> </span>'), Lm = /* @__PURE__ */ ne(' <span class="lr-left t-meta tabular-nums svelte-9kjh2y"> </span> ', 1), Om = /* @__PURE__ */ ne('<span class="lr-ld svelte-9kjh2y" data-state-word=""> </span><!> ', 1), Dm = /* @__PURE__ */ ne('<span class="lr-code first t-code-sm svelte-9kjh2y"> </span>'), Fm = /* @__PURE__ */ ne('<span class="lr-code t-code-sm svelte-9kjh2y"> </span>'), Im = /* @__PURE__ */ ne("<!> <!>", 1), $m = /* @__PURE__ */ ne('<!><span class="lr-lead-t tabular-nums svelte-9kjh2y"> <span class="lr-tp svelte-9kjh2y">to prod</span></span>', 1), Bm = /* @__PURE__ */ ne('<span class="lr-ldw t-meta svelte-9kjh2y"><!></span>'), jm = /* @__PURE__ */ ne('<li><div class="lr-in svelte-9kjh2y"><span class="lr-mk svelte-9kjh2y"><!></span> <div class="lr-id svelte-9kjh2y"><a> </a> <!></div> <span class="lr-dr svelte-9kjh2y"><!></span> <p class="lr-sn svelte-9kjh2y"><!></p> <!> <span class="lr-age t-meta svelte-9kjh2y"> </span></div></li>');
function Fa(e, t) {
  Qe(t, !0);
  let n = X(
    t,
    "row",
    3,
    null
    /** the quiet flow (Changes' At rest): no mark / drawing tracks, the age auto-wide */
  ), r = X(t, "rest", 3, null), s = X(t, "dense", 3, !1);
  const a = /* @__PURE__ */ de(() => n()?.href ?? r()?.href ?? "#"), i = Mm(), o = /* @__PURE__ */ de(() => n() && n().mark === "checking" && i.progress ? i.progress.get(k(a).split("/").filter(Boolean).slice(2, 4).join("/")) ?? null : null), l = /* @__PURE__ */ de(() => n()?.app ?? r()?.app ?? ""), c = /* @__PURE__ */ de(() => n() ? n().place ? /^\d+ regions?$/.test(n().place) ? n().place.replace(/ (regions?)$/, ` ${n().tier} $1`) : `${n().tier}-${n().place}` : n().tier : "");
  var u = jm();
  En(
    u,
    (L) => ({
      class: "lr tap-zone",
      "data-key": n()?.key ?? r()?.key,
      ...L,
      [on]: {
        q: !!r(),
        dn: s(),
        hl: !!r() && r().lead !== void 0
      }
    }),
    [
      () => s() ? {} : {
        "data-truth-kind": n() ? "rollout" : "rest",
        "data-truth-app": k(l),
        "data-truth-href": k(a),
        "data-truth-group": n()?.row.group ?? "rest",
        ...n() ? Yv(n().row) : { "data-truth-state": "healthy" }
      }
    ],
    void 0,
    void 0,
    "svelte-9kjh2y"
  );
  var d = B(u), f = B(d), p = B(f);
  {
    var w = (L) => {
      {
        let H = /* @__PURE__ */ de(() => k(o)?.fraction ?? null);
        su(L, {
          get state() {
            return n().mark;
          },
          get progress() {
            return k(H);
          }
        });
      }
    };
    Y(p, (L) => {
      n() && L(w);
    });
  }
  var _ = ie(f, 2), v = B(_);
  let g;
  var y = B(v), h = ie(v, 2);
  {
    var E = (L) => {
      {
        let H = /* @__PURE__ */ de(() => lm(n().tier));
        Fu(L, {
          role: "env",
          get theme() {
            return k(H);
          },
          get label() {
            return k(c);
          },
          wide: !0
        });
      }
    }, C = (L) => {
      var H = we(), U = ce(H);
      {
        var W = (x) => {
          var j = Rm(), z = B(j);
          q(() => se(z, r().place)), D(x, j);
        };
        Y(
          U,
          (x) => {
            r()?.place && x(W);
          },
          !0
        );
      }
      D(L, H);
    };
    Y(h, (L) => {
      n() ? L(E) : L(C, !1);
    });
  }
  var b = ie(_, 2), T = B(b);
  {
    var A = (L) => {
      ym(L, {
        get nodes() {
          return n().nodes;
        },
        neutral: !0,
        get label() {
          return `${k(l) ?? ""} steps`;
        }
      });
    };
    Y(T, (L) => {
      n() && L(A);
    });
  }
  var S = ie(b, 2), P = B(S);
  {
    var m = (L) => {
      var H = Om(), U = ce(H), W = B(U), x = ie(U);
      {
        var j = (J) => {
          var K = Lm(), le = ce(K, !0);
          le.nodeValue = " ";
          var Z = ie(le), Q = B(Z), ae = ie(Z, 1, !0);
          ae.nodeValue = " ", q(() => se(Q, k(o).words)), D(J, K);
        };
        Y(x, (J) => {
          k(o)?.words && !n().row.stillChecking && J(j);
        });
      }
      var z = ie(x, 1, !0);
      q(() => {
        se(W, n().lead), se(z, n().rest);
      }), D(L, H);
    }, M = (L) => {
      var H = we(), U = ce(H);
      {
        var W = (x) => {
          var j = Im(), z = ce(j);
          {
            var J = (Q) => {
              var ae = Dm(), he = B(ae);
              q(() => se(he, r().code)), D(Q, ae);
            };
            Y(z, (Q) => {
              r().codeFirst && r().code && Q(J);
            });
          }
          var K = ie(z, 1, !0), le = ie(K);
          {
            var Z = (Q) => {
              var ae = Fm(), he = B(ae);
              q(() => se(he, r().code)), D(Q, ae);
            };
            Y(le, (Q) => {
              !r().codeFirst && r().code && Q(Z);
            });
          }
          q(() => se(K, r().sentence)), D(x, j);
        };
        Y(
          U,
          (x) => {
            r() && x(W);
          },
          !0
        );
      }
      D(L, H);
    };
    Y(P, (L) => {
      n() ? L(m) : L(M, !1);
    });
  }
  var I = ie(S, 2);
  {
    var O = (L) => {
      var H = Bm(), U = B(H);
      {
        var W = (x) => {
          var j = $m(), z = ce(j);
          xm(z, {
            get hops() {
              return r().lead.hops;
            },
            get origin() {
              return r().lead.origin;
            },
            get scaleMs() {
              return r().lead.scale;
            },
            width: 72
          });
          var J = ie(z), K = B(J);
          q(() => se(K, r().lead.total)), D(x, j);
        };
        Y(U, (x) => {
          r().lead && x(W);
        });
      }
      q(() => V(H, "title", r().lead ? `${r().lead.total} to prod` : void 0)), D(L, H);
    };
    Y(I, (L) => {
      r() && r().lead !== void 0 && L(O);
    });
  }
  var $ = ie(I, 2), R = B($);
  q(() => {
    V(v, "href", k(a)), g = fe(v, 1, "tap-link lr-nm svelte-9kjh2y", null, g, { rep: r()?.rep }), V(v, "aria-label", n() ? `${k(l)} in ${n().place ?? n().tier}` : `${k(l)} ${r()?.place}`), se(y, k(l)), se(R, n()?.age ?? r()?.age ?? "");
  }), D(e, u), et();
}
var Pm = /* @__PURE__ */ ne('<section class="lc-g" data-group="In flight"><div class="lc-gh"><span class="lc-gt">In flight</span><span class="lc-gn"> </span></div> <ul class="lc-rows"></ul></section> <section class="lc-g" data-group="At rest"><div class="lc-gh"><span class="lc-gt">At rest</span><span class="lc-gn"> </span></div> <ul class="lc-rows"></ul></section>', 1);
function Hm(e, t) {
  Qe(t, !0), yc(e, {
    children: (n, r) => {
      var s = Pm(), a = ce(s), i = B(a), o = ie(B(i)), l = B(o), c = ie(i, 2);
      Hn(c, 21, () => t.moving, (_) => _.key, (_, v) => {
        Fa(_, {
          get row() {
            return k(v);
          }
        });
      });
      var u = ie(a, 2), d = B(u), f = ie(B(d)), p = B(f), w = ie(d, 2);
      Hn(w, 21, () => t.rest, (_) => _.key, (_, v) => {
        Fa(_, {
          get rest() {
            return k(v);
          }
        });
      }), q(() => {
        se(l, t.moving.length), se(p, t.rest.length);
      }), D(n, s);
    },
    $$slots: { default: !0 }
  }), et();
}
const pt = (e, t, n, r) => [
  { name: "Started", state: e },
  { name: "Stage 1", state: t },
  { name: "Stage 2", state: n },
  { name: "Check", state: r }
], Ia = { tier: "dev", place: null, href: "/rollouts/hub/payments/payments-api-dev" }, $a = { tier: "staging", place: null, href: "/rollouts/hub/payments/payments-api-staging" }, ar = { tier: "prod", place: "eu-west", href: "/rollouts/hub/payments/payments-api-prod-eu-west" };
function At(e, t, n, r, s, a) {
  return {
    key: "payments-api",
    app: "payments-api",
    href: e.href,
    tier: e.tier,
    place: e.place,
    mark: n,
    nodes: Lo(t, n === "deploying" ? "deploying" : "checking"),
    lead: r,
    rest: s,
    age: a,
    yours: !1,
    row: { group: n === "failed" ? "failed" : "moving" }
  };
}
const Oo = {
  key: "checkout-web",
  app: "checkout-web",
  href: "/rollouts/hub/shop/checkout-web-test",
  tier: "test",
  place: null,
  mark: "deploying",
  nodes: Lo(pt("done", "done", "active", "todo"), "deploying"),
  lead: "Deploying",
  rest: "v3.8.2 · step 3 of 4",
  age: "3m",
  yours: !1,
  row: { group: "moving" }
}, fr = (e, t, n, r, s = !1) => ({ key: e + t, app: e, href: "#", place: t, rep: s, sentence: "On the newest", code: n, age: r, tier: t }), Do = [fr("billing-worker", "prod · eu-west", "v1.19.0", "2d"), fr("billing-worker", "prod · us-east", "v1.19.0", "2d", !0), fr("search-api", "prod", "v7.4.1", "5d")], an = "v2.14.0", xt = (e, t = []) => ({ moving: [e, Oo], rest: [...t, ...Do] }), Fo = [
  { at: 0, state: xt(At(Ia, pt("active", "todo", "todo", "todo"), "deploying", "Deploying", `${an} · dev`, "12s")) },
  { at: 1400, state: xt(At(Ia, pt("done", "done", "done", "active"), "checking", "Checking", `${an} · 1 min left`, "1m")) },
  { at: 3e3, state: xt(At($a, pt("active", "todo", "todo", "todo"), "deploying", "Deploying", `${an} · staging`, "4m")) },
  { at: 4400, state: xt(At($a, pt("done", "done", "done", "active"), "checking", "Checking", `${an} · 2 min left`, "9m")) },
  { at: 6e3, state: xt(At(ar, pt("done", "active", "todo", "todo"), "deploying", "Deploying", `${an} · step 2 of 4`, "14m")) },
  { at: 7600, state: xt(At(ar, pt("done", "done", "fail", "todo"), "failed", "Failing", `${an} · latency over limit`, "2m")) },
  { at: 9400, state: xt(At(ar, pt("done", "done", "active", "todo"), "deploying", "Deploying", "v2.14.1 · fix, step 3 of 4", "40s")) },
  { at: 11e3, state: xt(At(ar, pt("done", "done", "done", "active"), "checking", "Checking", "v2.14.1 · 1 min left", "3m")) },
  { at: 12600, state: { moving: [Oo], rest: [{ ...fr("payments-api", "prod · eu-west", "v2.14.1", "now"), key: "payments-api-rest" }, ...Do] } }
], Vm = Fo[0].state, Um = 5, Io = {
  "rollouts-list": { component: Hm, initial: Vm, beats: Fo, representative: Um, restMs: 3200 }
};
class Wm {
  // ms into the cycle when paused/at startedAt
  constructor(t) {
    if (this.gates = { onscreen: !1, visible: !0, motion: !0 }, this.idx = -1, this.timer = null, this.startedAt = 0, this.pos = 0, this.tick = () => {
      this.timer = null;
      const { beats: n } = this.o, r = (this.pos + (this.o.now() - this.startedAt)) % this.cycleMs;
      let s = -1;
      for (let i = 0; i < n.length; i++) n[i].at <= r && (s = i);
      s !== this.idx && this.show(s);
      const a = s + 1 < n.length ? n[s + 1].at : this.cycleMs;
      this.timer = this.o.setTimer(this.tick, Math.max(16, a - r));
    }, !t.beats.length) throw new Error("Timeline needs at least one beat");
    this.o = {
      restMs: 2400,
      setTimer: (n, r) => setTimeout(n, r),
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
    const r = this.playing;
    this.gates[t] = n, t === "motion" && !n && this.show(this.o.representative), t === "motion" && n && this.idx < 0 && this.show(0), r !== this.playing && (this.playing ? this.run() : this.freeze());
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
function zm(e) {
  return wt(e);
}
const $o = new URL(".", import.meta.url);
function Gm() {
  if (document.getElementById("kuberik-islands-fonts")) return;
  const e = (n) => new URL(`fonts/${n}`, $o).href, t = document.createElement("style");
  t.id = "kuberik-islands-fonts", t.textContent = `
@font-face{font-family:'Kuberik Inter';font-style:normal;font-display:swap;font-weight:100 900;src:url('${e("inter-latin-opsz.woff2")}') format('woff2-variations');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'Kuberik Inter';font-style:normal;font-display:swap;font-weight:100 900;src:url('${e("inter-latin-ext-opsz.woff2")}') format('woff2-variations');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:'Kuberik JetBrains Mono';font-style:normal;font-display:swap;font-weight:100 800;src:url('${e("jetbrains-mono-latin.woff2")}') format('woff2-variations')}`, document.head.appendChild(t);
}
let qm = null;
const Km = () => qm ??= fetch(new URL("islands.css", $o)).then((e) => e.text()).then((e) => {
  const t = new CSSStyleSheet();
  return t.replaceSync(e), t;
}), Ym = () => document.documentElement.classList.contains("dark"), ir = matchMedia("(prefers-reduced-motion: reduce)");
async function Zm(e) {
  const t = e.dataset.island, n = Io[t];
  if (!n) {
    console.warn(`island "${t}" is not registered`);
    return;
  }
  const r = e.shadowRoot ?? e.attachShadow({ mode: "open" });
  r.adoptedStyleSheets = [await Km()];
  const s = document.createElement("div");
  if (s.className = "k-island", r.appendChild(s), e.hasAttribute("data-theme-sync")) {
    const c = () => s.classList.toggle("dark", Ym());
    c(), new MutationObserver(c).observe(document.documentElement, { attributes: !0, attributeFilter: ["class"] });
  }
  const a = zm(n.initial);
  ic(n.component, { target: s, props: a });
  const i = new Wm({ beats: n.beats, restMs: n.restMs, representative: n.representative, apply: (c) => Object.assign(a, c) });
  i.setGate("motion", !ir.matches), ir.addEventListener("change", () => {
    i.setGate("motion", !ir.matches), l();
  }), new IntersectionObserver((c) => i.setGate("onscreen", c[c.length - 1].isIntersecting), { rootMargin: "80px" }).observe(e), document.addEventListener("visibilitychange", () => i.setGate("visible", document.visibilityState === "visible"));
  let o = null;
  function l() {
    o?.remove(), o = null, ir.matches && (o = document.createElement("div"), o.className = "k-island-ctl", o.innerHTML = '<button class="btn btn-secondary" type="button">Next step</button>', o.querySelector("button").addEventListener("click", () => i.next()), r.appendChild(o));
  }
  l(), e.__timeline = i;
}
function os(e = document) {
  Gm(), e.querySelectorAll("[data-island]:not([data-island-mounted])").forEach((t) => {
    t.setAttribute("data-island-mounted", ""), Zm(t);
  });
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => os()) : os();
window.kuberikIslands = { mountAll: os, registry: Io };
export {
  os as mountAll
};
