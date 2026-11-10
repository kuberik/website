var Tn = Array.isArray, wi = Array.prototype.indexOf, cn = Array.from, yi = Object.defineProperty, Tt = Object.getOwnPropertyDescriptor, ki = Object.getOwnPropertyDescriptors, xi = Object.prototype, Ei = Array.prototype, lr = Object.getPrototypeOf, Bn = Object.isExtensible;
const Ci = () => {
};
function Si(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function or() {
  var e, t, n = new Promise((r, i) => {
    e = r, t = i;
  });
  return { promise: n, resolve: e, reject: t };
}
const ve = 2, Mn = 4, Nn = 8, fr = 1 << 24, Ye = 16, Ze = 32, _t = 64, dn = 128, Le = 512, _e = 1024, Ce = 2048, je = 4096, Ee = 8192, Ke = 16384, Ln = 32768, ct = 65536, zn = 1 << 17, ur = 1 << 18, Rt = 1 << 19, Ai = 1 << 20, Ge = 1 << 25, dt = 32768, yn = 1 << 21, On = 1 << 22, nt = 1 << 23, lt = Symbol("$state"), Ti = Symbol("legacy props"), Mi = Symbol(""), St = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
function Ni(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Li() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function Oi(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function Ri() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ii(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function Di() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Pi(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function Fi() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function ji() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ui() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Bi() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const zi = 1, Vi = 2, cr = 4, qi = 8, Gi = 16, Hi = 1, Ki = 4, Wi = 8, Yi = 16, Zi = 1, Xi = 2, ce = Symbol(), Ji = "http://www.w3.org/1999/xhtml", Qi = "@attach";
function $i() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function ea() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
function dr(e) {
  return e === this.v;
}
function ta(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function vr(e) {
  return !ta(e, this.v);
}
let be = null;
function Mt(e) {
  be = e;
}
function It(e) {
  return (
    /** @type {T} */
    na().get(e)
  );
}
function Oe(e, t = !1, n) {
  be = {
    p: be,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    l: null
  };
}
function Re(e) {
  var t = (
    /** @type {ComponentContext} */
    be
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n)
      Mr(r);
  }
  return t.i = !0, be = t.p, /** @type {T} */
  {};
}
function hr() {
  return !0;
}
function na(e) {
  return be === null && Ni(), be.c ??= new Map(ra(be) || void 0);
}
function ra(e) {
  let t = e.p;
  for (; t !== null; ) {
    const n = t.c;
    if (n !== null)
      return n;
    t = t.p;
  }
  return null;
}
let At = [];
function ia() {
  var e = At;
  At = [], Si(e);
}
function pt(e) {
  if (At.length === 0) {
    var t = At;
    queueMicrotask(() => {
      t === At && ia();
    });
  }
  At.push(e);
}
function _r(e) {
  var t = K;
  if (t === null)
    return V.f |= nt, e;
  if ((t.f & Ln) === 0) {
    if ((t.f & dn) === 0)
      throw e;
    t.b.error(e);
  } else
    Nt(e, t);
}
function Nt(e, t) {
  for (; t !== null; ) {
    if ((t.f & dn) !== 0)
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
const en = /* @__PURE__ */ new Set();
let ae = null, Te = null, De = [], Rn = null, kn = !1;
class Pe {
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
  #r = 0;
  /**
   * The number of async effects that are currently in flight, _not_ inside a pending boundary
   */
  #n = 0;
  /**
   * A deferred that resolves when the batch is committed, used with `settled()`
   * TODO replace with Promise.withResolvers once supported widely enough
   * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
   */
  #o = null;
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Set<Effect>}
   */
  #a = /* @__PURE__ */ new Set();
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
    return this.is_fork || this.#n > 0;
  }
  /**
   *
   * @param {Effect[]} root_effects
   */
  process(t) {
    De = [], this.apply();
    var n = {
      parent: null,
      effect: null,
      effects: [],
      render_effects: []
    };
    for (const r of t)
      this.#s(r, n);
    this.is_fork || this.#u(), this.is_deferred() ? (this.#l(n.effects), this.#l(n.render_effects)) : (ae = null, Vn(n.render_effects), Vn(n.effects), this.#o?.resolve()), Te = null;
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {EffectTarget} target
   */
  #s(t, n) {
    t.f ^= _e;
    for (var r = t.first; r !== null; ) {
      var i = r.f, a = (i & (Ze | _t)) !== 0, l = a && (i & _e) !== 0, o = l || (i & Ee) !== 0 || this.skipped_effects.has(r);
      if ((r.f & dn) !== 0 && r.b?.is_pending() && (n = {
        parent: n,
        effect: r,
        effects: [],
        render_effects: []
      }), !o && r.fn !== null) {
        a ? r.f ^= _e : (i & Mn) !== 0 ? n.effects.push(r) : Xt(r) && ((r.f & Ye) !== 0 && this.#a.add(r), Wt(r));
        var s = r.first;
        if (s !== null) {
          r = s;
          continue;
        }
      }
      var f = r.parent;
      for (r = r.next; r === null && f !== null; )
        f === n.effect && (this.#l(n.effects), this.#l(n.render_effects), n = /** @type {EffectTarget} */
        n.parent), r = f.next, f = f.parent;
    }
  }
  /**
   * @param {Effect[]} effects
   */
  #l(t) {
    for (const n of t)
      (n.f & Ce) !== 0 ? this.#a.add(n) : (n.f & je) !== 0 && this.#i.add(n), this.#f(n.deps), pe(n, _e);
  }
  /**
   * @param {Value[] | null} deps
   */
  #f(t) {
    if (t !== null)
      for (const n of t)
        (n.f & ve) === 0 || (n.f & dt) === 0 || (n.f ^= dt, this.#f(
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
    this.previous.has(t) || this.previous.set(t, n), (t.f & nt) === 0 && (this.current.set(t, t.v), Te?.set(t, t.v));
  }
  activate() {
    ae = this, this.apply();
  }
  deactivate() {
    ae === this && (ae = null, Te = null);
  }
  flush() {
    if (this.activate(), De.length > 0) {
      if (aa(), ae !== null && ae !== this)
        return;
    } else this.#r === 0 && this.process([]);
    this.deactivate();
  }
  discard() {
    for (const t of this.#t) t(this);
    this.#t.clear();
  }
  #u() {
    if (this.#n === 0) {
      for (const t of this.#e) t();
      this.#e.clear();
    }
    this.#r === 0 && this.#c();
  }
  #c() {
    if (en.size > 1) {
      this.previous.clear();
      var t = Te, n = !0, r = {
        parent: null,
        effect: null,
        effects: [],
        render_effects: []
      };
      for (const a of en) {
        if (a === this) {
          n = !1;
          continue;
        }
        const l = [];
        for (const [s, f] of this.current) {
          if (a.current.has(s))
            if (n && f !== a.current.get(s))
              a.current.set(s, f);
            else
              continue;
          l.push(s);
        }
        if (l.length === 0)
          continue;
        const o = [...a.current.keys()].filter((s) => !this.current.has(s));
        if (o.length > 0) {
          var i = De;
          De = [];
          const s = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Map();
          for (const v of l)
            pr(v, o, s, f);
          if (De.length > 0) {
            ae = a, a.apply();
            for (const v of De)
              a.#s(v, r);
            a.deactivate();
          }
          De = i;
        }
      }
      ae = null, Te = t;
    }
    this.committed = !0, en.delete(this);
  }
  /**
   *
   * @param {boolean} blocking
   */
  increment(t) {
    this.#r += 1, t && (this.#n += 1);
  }
  /**
   *
   * @param {boolean} blocking
   */
  decrement(t) {
    this.#r -= 1, t && (this.#n -= 1), this.revive();
  }
  revive() {
    for (const t of this.#a)
      this.#i.delete(t), pe(t, Ce), vt(t);
    for (const t of this.#i)
      pe(t, je), vt(t);
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
    return (this.#o ??= or()).promise;
  }
  static ensure() {
    if (ae === null) {
      const t = ae = new Pe();
      en.add(ae), Pe.enqueue(() => {
        ae === t && t.flush();
      });
    }
    return ae;
  }
  /** @param {() => void} task */
  static enqueue(t) {
    pt(t);
  }
  apply() {
  }
}
function aa() {
  var e = ft;
  kn = !0;
  var t = null;
  try {
    var n = 0;
    for (on(!0); De.length > 0; ) {
      var r = Pe.ensure();
      if (n++ > 1e3) {
        var i, a;
        sa();
      }
      r.process(De), rt.clear();
    }
  } finally {
    kn = !1, on(e), Rn = null;
  }
}
function sa() {
  try {
    Di();
  } catch (e) {
    Nt(e, Rn);
  }
}
let qe = null;
function Vn(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var r = e[n++];
      if ((r.f & (Ke | Ee)) === 0 && Xt(r) && (qe = /* @__PURE__ */ new Set(), Wt(r), r.deps === null && r.first === null && r.nodes === null && (r.teardown === null && r.ac === null ? Ir(r) : r.fn = null), qe?.size > 0)) {
        rt.clear();
        for (const i of qe) {
          if ((i.f & (Ke | Ee)) !== 0) continue;
          const a = [i];
          let l = i.parent;
          for (; l !== null; )
            qe.has(l) && (qe.delete(l), a.push(l)), l = l.parent;
          for (let o = a.length - 1; o >= 0; o--) {
            const s = a[o];
            (s.f & (Ke | Ee)) === 0 && Wt(s);
          }
        }
        qe.clear();
      }
    }
    qe = null;
  }
}
function pr(e, t, n, r) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const i of e.reactions) {
      const a = i.f;
      (a & ve) !== 0 ? pr(
        /** @type {Derived} */
        i,
        t,
        n,
        r
      ) : (a & (On | Ye)) !== 0 && (a & Ce) === 0 && gr(i, t, r) && (pe(i, Ce), vt(
        /** @type {Effect} */
        i
      ));
    }
}
function gr(e, t, n) {
  const r = n.get(e);
  if (r !== void 0) return r;
  if (e.deps !== null)
    for (const i of e.deps) {
      if (t.includes(i))
        return !0;
      if ((i.f & ve) !== 0 && gr(
        /** @type {Derived} */
        i,
        t,
        n
      ))
        return n.set(
          /** @type {Derived} */
          i,
          !0
        ), !0;
    }
  return n.set(e, !1), !1;
}
function vt(e) {
  for (var t = Rn = e; t.parent !== null; ) {
    t = t.parent;
    var n = t.f;
    if (kn && t === K && (n & Ye) !== 0 && (n & ur) === 0)
      return;
    if ((n & (_t | Ze)) !== 0) {
      if ((n & _e) === 0) return;
      t.f ^= _e;
    }
  }
  De.push(t);
}
function la(e) {
  let t = 0, n = ht(0), r;
  return () => {
    Ht() && (c(n), Nr(() => (t === 0 && (r = jn(() => e(() => Gt(n)))), t += 1, () => {
      pt(() => {
        t -= 1, t === 0 && (r?.(), r = void 0, Gt(n));
      });
    })));
  };
}
var oa = ct | Rt | dn;
function fa(e, t, n) {
  new ua(e, t, n);
}
class ua {
  /** @type {Boundary | null} */
  parent;
  #e = !1;
  /** @type {TemplateNode} */
  #t;
  /** @type {TemplateNode | null} */
  #r = null;
  /** @type {BoundaryProps} */
  #n;
  /** @type {((anchor: Node) => void)} */
  #o;
  /** @type {Effect} */
  #a;
  /** @type {Effect | null} */
  #i = null;
  /** @type {Effect | null} */
  #s = null;
  /** @type {Effect | null} */
  #l = null;
  /** @type {DocumentFragment | null} */
  #f = null;
  /** @type {TemplateNode | null} */
  #u = null;
  #c = 0;
  #d = 0;
  #h = !1;
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #v = null;
  #b = la(() => (this.#v = ht(this.#c), () => {
    this.#v = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   */
  constructor(t, n, r) {
    this.#t = t, this.#n = n, this.#o = r, this.parent = /** @type {Effect} */
    K.b, this.#e = !!this.#n.pending, this.#a = hn(() => {
      K.b = this;
      {
        var i = this.#g();
        try {
          this.#i = we(() => r(i));
        } catch (a) {
          this.error(a);
        }
        this.#d > 0 ? this.#p() : this.#e = !1;
      }
      return () => {
        this.#u?.remove();
      };
    }, oa);
  }
  #w() {
    try {
      this.#i = we(() => this.#o(this.#t));
    } catch (t) {
      this.error(t);
    }
    this.#e = !1;
  }
  #y() {
    const t = this.#n.pending;
    t && (this.#s = we(() => t(this.#t)), Pe.enqueue(() => {
      var n = this.#g();
      this.#i = this.#_(() => (Pe.ensure(), we(() => this.#o(n)))), this.#d > 0 ? this.#p() : (ot(
        /** @type {Effect} */
        this.#s,
        () => {
          this.#s = null;
        }
      ), this.#e = !1);
    }));
  }
  #g() {
    var t = this.#t;
    return this.#e && (this.#u = it(), this.#t.before(this.#u), t = this.#u), t;
  }
  /**
   * Returns `true` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_pending() {
    return this.#e || !!this.parent && this.parent.is_pending();
  }
  has_pending_snippet() {
    return !!this.#n.pending;
  }
  /**
   * @param {() => Effect | null} fn
   */
  #_(t) {
    var n = K, r = V, i = be;
    Ue(this.#a), ye(this.#a), Mt(this.#a.ctx);
    try {
      return t();
    } catch (a) {
      return _r(a), null;
    } finally {
      Ue(n), ye(r), Mt(i);
    }
  }
  #p() {
    const t = (
      /** @type {(anchor: Node) => void} */
      this.#n.pending
    );
    this.#i !== null && (this.#f = document.createDocumentFragment(), this.#f.append(
      /** @type {TemplateNode} */
      this.#u
    ), Fr(this.#i, this.#f)), this.#s === null && (this.#s = we(() => t(this.#t)));
  }
  /**
   * Updates the pending count associated with the currently visible pending snippet,
   * if any, such that we can replace the snippet with content once work is done
   * @param {1 | -1} d
   */
  #m(t) {
    if (!this.has_pending_snippet()) {
      this.parent && this.parent.#m(t);
      return;
    }
    this.#d += t, this.#d === 0 && (this.#e = !1, this.#s && ot(this.#s, () => {
      this.#s = null;
    }), this.#f && (this.#t.before(this.#f), this.#f = null));
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   */
  update_pending_count(t) {
    this.#m(t), this.#c += t, this.#v && Lt(this.#v, this.#c);
  }
  get_effect_pending() {
    return this.#b(), c(
      /** @type {Source<number>} */
      this.#v
    );
  }
  /** @param {unknown} error */
  error(t) {
    var n = this.#n.onerror;
    let r = this.#n.failed;
    if (this.#h || !n && !r)
      throw t;
    this.#i && (de(this.#i), this.#i = null), this.#s && (de(this.#s), this.#s = null), this.#l && (de(this.#l), this.#l = null);
    var i = !1, a = !1;
    const l = () => {
      if (i) {
        ea();
        return;
      }
      i = !0, a && Bi(), Pe.ensure(), this.#c = 0, this.#l !== null && ot(this.#l, () => {
        this.#l = null;
      }), this.#e = this.has_pending_snippet(), this.#i = this.#_(() => (this.#h = !1, we(() => this.#o(this.#t)))), this.#d > 0 ? this.#p() : this.#e = !1;
    };
    var o = V;
    try {
      ye(null), a = !0, n?.(t, l), a = !1;
    } catch (s) {
      Nt(s, this.#a && this.#a.parent);
    } finally {
      ye(o);
    }
    r && pt(() => {
      this.#l = this.#_(() => {
        Pe.ensure(), this.#h = !0;
        try {
          return we(() => {
            r(
              this.#t,
              () => t,
              () => l
            );
          });
        } catch (s) {
          return Nt(
            s,
            /** @type {Effect} */
            this.#a.parent
          ), null;
        } finally {
          this.#h = !1;
        }
      });
    });
  }
}
function mr(e, t, n, r) {
  const i = vn;
  if (n.length === 0 && e.length === 0) {
    r(t.map(i));
    return;
  }
  var a = ae, l = (
    /** @type {Effect} */
    K
  ), o = ca();
  function s() {
    Promise.all(n.map((f) => /* @__PURE__ */ da(f))).then((f) => {
      o();
      try {
        r([...t.map(i), ...f]);
      } catch (v) {
        (l.f & Ke) === 0 && Nt(v, l);
      }
      a?.deactivate(), ln();
    }).catch((f) => {
      Nt(f, l);
    });
  }
  e.length > 0 ? Promise.all(e).then(() => {
    o();
    try {
      return s();
    } finally {
      a?.deactivate(), ln();
    }
  }) : s();
}
function ca() {
  var e = K, t = V, n = be, r = ae;
  return function(a = !0) {
    Ue(e), ye(t), Mt(n), a && r?.activate();
  };
}
function ln() {
  Ue(null), ye(null), Mt(null);
}
// @__NO_SIDE_EFFECTS__
function vn(e) {
  var t = ve | Ce, n = V !== null && (V.f & ve) !== 0 ? (
    /** @type {Derived} */
    V
  ) : null;
  return K !== null && (K.f |= Rt), {
    ctx: be,
    deps: null,
    effects: null,
    equals: dr,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      ce
    ),
    wv: 0,
    parent: n ?? K,
    ac: null
  };
}
// @__NO_SIDE_EFFECTS__
function da(e, t) {
  let n = (
    /** @type {Effect | null} */
    K
  );
  n === null && Li();
  var r = (
    /** @type {Boundary} */
    n.b
  ), i = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), a = ht(
    /** @type {V} */
    ce
  ), l = !V, o = /* @__PURE__ */ new Map();
  return xa(() => {
    var s = or();
    i = s.promise;
    try {
      Promise.resolve(e()).then(s.resolve, s.reject).then(() => {
        f === ae && f.committed && f.deactivate(), ln();
      });
    } catch (_) {
      s.reject(_), ln();
    }
    var f = (
      /** @type {Batch} */
      ae
    );
    if (l) {
      var v = !r.is_pending();
      r.update_pending_count(1), f.increment(v), o.get(f)?.reject(St), o.delete(f), o.set(f, s);
    }
    const h = (_, p = void 0) => {
      if (f.activate(), p)
        p !== St && (a.f |= nt, Lt(a, p));
      else {
        (a.f & nt) !== 0 && (a.f ^= nt), Lt(a, _);
        for (const [w, g] of o) {
          if (o.delete(w), w === f) break;
          g.reject(St);
        }
      }
      l && (r.update_pending_count(-1), f.decrement(v));
    };
    s.promise.then(h, (_) => h(null, _ || "unknown"));
  }), Tr(() => {
    for (const s of o.values())
      s.reject(St);
  }), new Promise((s) => {
    function f(v) {
      function h() {
        v === i ? s(a) : f(i);
      }
      v.then(h, h);
    }
    f(i);
  });
}
// @__NO_SIDE_EFFECTS__
function Q(e) {
  const t = /* @__PURE__ */ vn(e);
  return jr(t), t;
}
// @__NO_SIDE_EFFECTS__
function br(e) {
  const t = /* @__PURE__ */ vn(e);
  return t.equals = vr, t;
}
function wr(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      de(
        /** @type {Effect} */
        t[n]
      );
  }
}
function va(e) {
  for (var t = e.parent; t !== null; ) {
    if ((t.f & ve) === 0)
      return (t.f & Ke) === 0 ? (
        /** @type {Effect} */
        t
      ) : null;
    t = t.parent;
  }
  return null;
}
function In(e) {
  var t, n = K;
  Ue(va(e));
  try {
    e.f &= ~dt, wr(e), t = Vr(e);
  } finally {
    Ue(n);
  }
  return t;
}
function yr(e) {
  var t = In(e);
  if (e.equals(t) || (ae?.is_fork || (e.v = t), e.wv = Br()), !gt)
    if (Te !== null)
      (Ht() || ae?.is_fork) && Te.set(e, t);
    else {
      var n = (e.f & Le) === 0 ? je : _e;
      pe(e, n);
    }
}
let xn = /* @__PURE__ */ new Set();
const rt = /* @__PURE__ */ new Map();
let kr = !1;
function ht(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: dr,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function ze(e, t) {
  const n = ht(e);
  return jr(n), n;
}
// @__NO_SIDE_EFFECTS__
function ha(e, t = !1, n = !0) {
  const r = ht(e);
  return t || (r.equals = vr), r;
}
function xe(e, t, n = !1) {
  V !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!Fe || (V.f & zn) !== 0) && hr() && (V.f & (ve | Ye | On | zn)) !== 0 && !We?.includes(e) && Ui();
  let r = n ? st(t) : t;
  return Lt(e, r);
}
function Lt(e, t) {
  if (!e.equals(t)) {
    var n = e.v;
    gt ? rt.set(e, t) : rt.set(e, n), e.v = t;
    var r = Pe.ensure();
    r.capture(e, n), (e.f & ve) !== 0 && ((e.f & Ce) !== 0 && In(
      /** @type {Derived} */
      e
    ), pe(e, (e.f & Le) !== 0 ? _e : je)), e.wv = Br(), xr(e, Ce), K !== null && (K.f & _e) !== 0 && (K.f & (Ze | _t)) === 0 && (Ae === null ? Sa([e]) : Ae.push(e)), !r.is_fork && xn.size > 0 && !kr && _a();
  }
  return t;
}
function _a() {
  kr = !1;
  var e = ft;
  on(!0);
  const t = Array.from(xn);
  try {
    for (const n of t)
      (n.f & _e) !== 0 && pe(n, je), Xt(n) && Wt(n);
  } finally {
    on(e);
  }
  xn.clear();
}
function Gt(e) {
  xe(e, e.v + 1);
}
function xr(e, t) {
  var n = e.reactions;
  if (n !== null)
    for (var r = n.length, i = 0; i < r; i++) {
      var a = n[i], l = a.f, o = (l & Ce) === 0;
      if (o && pe(a, t), (l & ve) !== 0) {
        var s = (
          /** @type {Derived} */
          a
        );
        Te?.delete(s), (l & dt) === 0 && (l & Le && (a.f |= dt), xr(s, je));
      } else o && ((l & Ye) !== 0 && qe !== null && qe.add(
        /** @type {Effect} */
        a
      ), vt(
        /** @type {Effect} */
        a
      ));
    }
}
function st(e) {
  if (typeof e != "object" || e === null || lt in e)
    return e;
  const t = lr(e);
  if (t !== xi && t !== Ei)
    return e;
  var n = /* @__PURE__ */ new Map(), r = Tn(e), i = /* @__PURE__ */ ze(0), a = ut, l = (o) => {
    if (ut === a)
      return o();
    var s = V, f = ut;
    ye(null), Kn(a);
    var v = o();
    return ye(s), Kn(f), v;
  };
  return r && n.set("length", /* @__PURE__ */ ze(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(o, s, f) {
        (!("value" in f) || f.configurable === !1 || f.enumerable === !1 || f.writable === !1) && Fi();
        var v = n.get(s);
        return v === void 0 ? v = l(() => {
          var h = /* @__PURE__ */ ze(f.value);
          return n.set(s, h), h;
        }) : xe(v, f.value, !0), !0;
      },
      deleteProperty(o, s) {
        var f = n.get(s);
        if (f === void 0) {
          if (s in o) {
            const v = l(() => /* @__PURE__ */ ze(ce));
            n.set(s, v), Gt(i);
          }
        } else
          xe(f, ce), Gt(i);
        return !0;
      },
      get(o, s, f) {
        if (s === lt)
          return e;
        var v = n.get(s), h = s in o;
        if (v === void 0 && (!h || Tt(o, s)?.writable) && (v = l(() => {
          var p = st(h ? o[s] : ce), w = /* @__PURE__ */ ze(p);
          return w;
        }), n.set(s, v)), v !== void 0) {
          var _ = c(v);
          return _ === ce ? void 0 : _;
        }
        return Reflect.get(o, s, f);
      },
      getOwnPropertyDescriptor(o, s) {
        var f = Reflect.getOwnPropertyDescriptor(o, s);
        if (f && "value" in f) {
          var v = n.get(s);
          v && (f.value = c(v));
        } else if (f === void 0) {
          var h = n.get(s), _ = h?.v;
          if (h !== void 0 && _ !== ce)
            return {
              enumerable: !0,
              configurable: !0,
              value: _,
              writable: !0
            };
        }
        return f;
      },
      has(o, s) {
        if (s === lt)
          return !0;
        var f = n.get(s), v = f !== void 0 && f.v !== ce || Reflect.has(o, s);
        if (f !== void 0 || K !== null && (!v || Tt(o, s)?.writable)) {
          f === void 0 && (f = l(() => {
            var _ = v ? st(o[s]) : ce, p = /* @__PURE__ */ ze(_);
            return p;
          }), n.set(s, f));
          var h = c(f);
          if (h === ce)
            return !1;
        }
        return v;
      },
      set(o, s, f, v) {
        var h = n.get(s), _ = s in o;
        if (r && s === "length")
          for (var p = f; p < /** @type {Source<number>} */
          h.v; p += 1) {
            var w = n.get(p + "");
            w !== void 0 ? xe(w, ce) : p in o && (w = l(() => /* @__PURE__ */ ze(ce)), n.set(p + "", w));
          }
        if (h === void 0)
          (!_ || Tt(o, s)?.writable) && (h = l(() => /* @__PURE__ */ ze(void 0)), xe(h, st(f)), n.set(s, h));
        else {
          _ = h.v !== ce;
          var g = l(() => st(f));
          xe(h, g);
        }
        var u = Reflect.getOwnPropertyDescriptor(o, s);
        if (u?.set && u.set.call(v, f), !_) {
          if (r && typeof s == "string") {
            var d = (
              /** @type {Source<number>} */
              n.get("length")
            ), m = Number(s);
            Number.isInteger(m) && m >= d.v && xe(d, m + 1);
          }
          Gt(i);
        }
        return !0;
      },
      ownKeys(o) {
        c(i);
        var s = Reflect.ownKeys(o).filter((h) => {
          var _ = n.get(h);
          return _ === void 0 || _.v !== ce;
        });
        for (var [f, v] of n)
          v.v !== ce && !(f in o) && s.push(f);
        return s;
      },
      setPrototypeOf() {
        ji();
      }
    }
  );
}
function qn(e) {
  try {
    if (e !== null && typeof e == "object" && lt in e)
      return e[lt];
  } catch {
  }
  return e;
}
function pa(e, t) {
  return Object.is(qn(e), qn(t));
}
var Gn, Er, Cr, Sr;
function ga() {
  if (Gn === void 0) {
    Gn = window, Er = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, n = Text.prototype;
    Cr = Tt(t, "firstChild").get, Sr = Tt(t, "nextSibling").get, Bn(e) && (e.__click = void 0, e.__className = void 0, e.__attributes = null, e.__style = void 0, e.__e = void 0), Bn(n) && (n.__t = void 0);
  }
}
function it(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function Ot(e) {
  return (
    /** @type {TemplateNode | null} */
    Cr.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function Zt(e) {
  return (
    /** @type {TemplateNode | null} */
    Sr.call(e)
  );
}
function k(e, t) {
  return /* @__PURE__ */ Ot(e);
}
function H(e, t = !1) {
  {
    var n = /* @__PURE__ */ Ot(e);
    return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Zt(n) : n;
  }
}
function B(e, t = 1, n = !1) {
  let r = e;
  for (; t--; )
    r = /** @type {TemplateNode} */
    /* @__PURE__ */ Zt(r);
  return r;
}
function ma(e) {
  e.textContent = "";
}
function Ar() {
  return !1;
}
function ba(e, t) {
  if (t) {
    const n = document.body;
    e.autofocus = !0, pt(() => {
      document.activeElement === n && e.focus();
    });
  }
}
function Dn(e) {
  var t = V, n = K;
  ye(null), Ue(null);
  try {
    return e();
  } finally {
    ye(t), Ue(n);
  }
}
function wa(e) {
  K === null && (V === null && Ii(), Ri()), gt && Oi();
}
function ya(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Be(e, t, n) {
  var r = K;
  r !== null && (r.f & Ee) !== 0 && (e |= Ee);
  var i = {
    ctx: be,
    deps: null,
    nodes: null,
    f: e | Ce | Le,
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
      Wt(i), i.f |= Ln;
    } catch (o) {
      throw de(i), o;
    }
  else t !== null && vt(i);
  var a = i;
  if (n && a.deps === null && a.teardown === null && a.nodes === null && a.first === a.last && // either `null`, or a singular child
  (a.f & Rt) === 0 && (a = a.first, (e & Ye) !== 0 && (e & ct) !== 0 && a !== null && (a.f |= ct)), a !== null && (a.parent = r, r !== null && ya(a, r), V !== null && (V.f & ve) !== 0 && (e & _t) === 0)) {
    var l = (
      /** @type {Derived} */
      V
    );
    (l.effects ??= []).push(a);
  }
  return i;
}
function Ht() {
  return V !== null && !Fe;
}
function Tr(e) {
  const t = Be(Nn, null, !1);
  return pe(t, _e), t.teardown = e, t;
}
function mn(e) {
  wa();
  var t = (
    /** @type {Effect} */
    K.f
  ), n = !V && (t & Ze) !== 0 && (t & Ln) === 0;
  if (n) {
    var r = (
      /** @type {ComponentContext} */
      be
    );
    (r.e ??= []).push(e);
  } else
    return Mr(e);
}
function Mr(e) {
  return Be(Mn | Ai, e, !1);
}
function ka(e) {
  Pe.ensure();
  const t = Be(_t | Rt, e, !0);
  return (n = {}) => new Promise((r) => {
    n.outro ? ot(t, () => {
      de(t), r(void 0);
    }) : (de(t), r(void 0));
  });
}
function Pn(e) {
  return Be(Mn, e, !1);
}
function xa(e) {
  return Be(On | Rt, e, !0);
}
function Nr(e, t = 0) {
  return Be(Nn | t, e, !0);
}
function A(e, t = [], n = [], r = []) {
  mr(r, t, n, (i) => {
    Be(Nn, () => e(...i.map(c)), !0);
  });
}
function hn(e, t = 0) {
  var n = Be(Ye | t, e, !0);
  return n;
}
function Lr(e, t = 0) {
  var n = Be(fr | t, e, !0);
  return n;
}
function we(e) {
  return Be(Ze | Rt, e, !0);
}
function Or(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = gt, r = V;
    Hn(!0), ye(null);
    try {
      t.call(null);
    } finally {
      Hn(n), ye(r);
    }
  }
}
function Rr(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const i = n.ac;
    i !== null && Dn(() => {
      i.abort(St);
    });
    var r = n.next;
    (n.f & _t) !== 0 ? n.parent = null : de(n, t), n = r;
  }
}
function Ea(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    (t.f & Ze) === 0 && de(t), t = n;
  }
}
function de(e, t = !0) {
  var n = !1;
  (t || (e.f & ur) !== 0) && e.nodes !== null && e.nodes.end !== null && (Ca(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), n = !0), Rr(e, t && !n), fn(e, 0), pe(e, Ke);
  var r = e.nodes && e.nodes.t;
  if (r !== null)
    for (const a of r)
      a.stop();
  Or(e);
  var i = e.parent;
  i !== null && i.first !== null && Ir(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = null;
}
function Ca(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : /* @__PURE__ */ Zt(e);
    e.remove(), e = n;
  }
}
function Ir(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function ot(e, t, n = !0) {
  var r = [];
  Dr(e, r, !0);
  var i = () => {
    n && de(e), t && t();
  }, a = r.length;
  if (a > 0) {
    var l = () => --a || i();
    for (var o of r)
      o.out(l);
  } else
    i();
}
function Dr(e, t, n) {
  if ((e.f & Ee) === 0) {
    e.f ^= Ee;
    var r = e.nodes && e.nodes.t;
    if (r !== null)
      for (const o of r)
        (o.is_global || n) && t.push(o);
    for (var i = e.first; i !== null; ) {
      var a = i.next, l = (i.f & ct) !== 0 || // If this is a branch effect without a block effect parent,
      // it means the parent block effect was pruned. In that case,
      // transparency information was transferred to the branch effect.
      (i.f & Ze) !== 0 && (e.f & Ye) !== 0;
      Dr(i, t, l ? n : !1), i = a;
    }
  }
}
function Fn(e) {
  Pr(e, !0);
}
function Pr(e, t) {
  if ((e.f & Ee) !== 0) {
    e.f ^= Ee, (e.f & _e) === 0 && (pe(e, Ce), vt(e));
    for (var n = e.first; n !== null; ) {
      var r = n.next, i = (n.f & ct) !== 0 || (n.f & Ze) !== 0;
      Pr(n, i ? t : !1), n = r;
    }
    var a = e.nodes && e.nodes.t;
    if (a !== null)
      for (const l of a)
        (l.is_global || t) && l.in();
  }
}
function Fr(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, r = e.nodes.end; n !== null; ) {
      var i = n === r ? null : /* @__PURE__ */ Zt(n);
      t.append(n), n = i;
    }
}
let ft = !1;
function on(e) {
  ft = e;
}
let gt = !1;
function Hn(e) {
  gt = e;
}
let V = null, Fe = !1;
function ye(e) {
  V = e;
}
let K = null;
function Ue(e) {
  K = e;
}
let We = null;
function jr(e) {
  V !== null && (We === null ? We = [e] : We.push(e));
}
let me = null, ke = 0, Ae = null;
function Sa(e) {
  Ae = e;
}
let Ur = 1, Kt = 0, ut = Kt;
function Kn(e) {
  ut = e;
}
function Br() {
  return ++Ur;
}
function Xt(e) {
  var t = e.f;
  if ((t & Ce) !== 0)
    return !0;
  if (t & ve && (e.f &= ~dt), (t & je) !== 0) {
    var n = e.deps;
    if (n !== null)
      for (var r = n.length, i = 0; i < r; i++) {
        var a = n[i];
        if (Xt(
          /** @type {Derived} */
          a
        ) && yr(
          /** @type {Derived} */
          a
        ), a.wv > e.wv)
          return !0;
      }
    (t & Le) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    Te === null && pe(e, _e);
  }
  return !1;
}
function zr(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !We?.includes(e))
    for (var i = 0; i < r.length; i++) {
      var a = r[i];
      (a.f & ve) !== 0 ? zr(
        /** @type {Derived} */
        a,
        t,
        !1
      ) : t === a && (n ? pe(a, Ce) : (a.f & _e) !== 0 && pe(a, je), vt(
        /** @type {Effect} */
        a
      ));
    }
}
function Vr(e) {
  var t = me, n = ke, r = Ae, i = V, a = We, l = be, o = Fe, s = ut, f = e.f;
  me = /** @type {null | Value[]} */
  null, ke = 0, Ae = null, V = (f & (Ze | _t)) === 0 ? e : null, We = null, Mt(e.ctx), Fe = !1, ut = ++Kt, e.ac !== null && (Dn(() => {
    e.ac.abort(St);
  }), e.ac = null);
  try {
    e.f |= yn;
    var v = (
      /** @type {Function} */
      e.fn
    ), h = v(), _ = e.deps;
    if (me !== null) {
      var p;
      if (fn(e, ke), _ !== null && ke > 0)
        for (_.length = ke + me.length, p = 0; p < me.length; p++)
          _[ke + p] = me[p];
      else
        e.deps = _ = me;
      if (Ht() && (e.f & Le) !== 0)
        for (p = ke; p < _.length; p++)
          (_[p].reactions ??= []).push(e);
    } else _ !== null && ke < _.length && (fn(e, ke), _.length = ke);
    if (hr() && Ae !== null && !Fe && _ !== null && (e.f & (ve | je | Ce)) === 0)
      for (p = 0; p < /** @type {Source[]} */
      Ae.length; p++)
        zr(
          Ae[p],
          /** @type {Effect} */
          e
        );
    return i !== null && i !== e && (Kt++, Ae !== null && (r === null ? r = Ae : r.push(.../** @type {Source[]} */
    Ae))), (e.f & nt) !== 0 && (e.f ^= nt), h;
  } catch (w) {
    return _r(w);
  } finally {
    e.f ^= yn, me = t, ke = n, Ae = r, V = i, We = a, Mt(l), Fe = o, ut = s;
  }
}
function Aa(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var r = wi.call(n, e);
    if (r !== -1) {
      var i = n.length - 1;
      i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
    }
  }
  n === null && (t.f & ve) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (me === null || !me.includes(t)) && (pe(t, je), (t.f & Le) !== 0 && (t.f ^= Le, t.f &= ~dt), wr(
    /** @type {Derived} **/
    t
  ), fn(
    /** @type {Derived} **/
    t,
    0
  ));
}
function fn(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t; r < n.length; r++)
      Aa(e, n[r]);
}
function Wt(e) {
  var t = e.f;
  if ((t & Ke) === 0) {
    pe(e, _e);
    var n = K, r = ft;
    K = e, ft = !0;
    try {
      (t & (Ye | fr)) !== 0 ? Ea(e) : Rr(e), Or(e);
      var i = Vr(e);
      e.teardown = typeof i == "function" ? i : null, e.wv = Ur;
      var a;
    } finally {
      ft = r, K = n;
    }
  }
}
function c(e) {
  var t = e.f, n = (t & ve) !== 0;
  if (V !== null && !Fe) {
    var r = K !== null && (K.f & Ke) !== 0;
    if (!r && !We?.includes(e)) {
      var i = V.deps;
      if ((V.f & yn) !== 0)
        e.rv < Kt && (e.rv = Kt, me === null && i !== null && i[ke] === e ? ke++ : me === null ? me = [e] : me.includes(e) || me.push(e));
      else {
        (V.deps ??= []).push(e);
        var a = e.reactions;
        a === null ? e.reactions = [V] : a.includes(V) || a.push(V);
      }
    }
  }
  if (gt) {
    if (rt.has(e))
      return rt.get(e);
    if (n) {
      var l = (
        /** @type {Derived} */
        e
      ), o = l.v;
      return ((l.f & _e) === 0 && l.reactions !== null || Gr(l)) && (o = In(l)), rt.set(l, o), o;
    }
  } else n && (!Te?.has(e) || ae?.is_fork && !Ht()) && (l = /** @type {Derived} */
  e, Xt(l) && yr(l), ft && Ht() && (l.f & Le) === 0 && qr(l));
  if (Te?.has(e))
    return Te.get(e);
  if ((e.f & nt) !== 0)
    throw e.v;
  return e.v;
}
function qr(e) {
  if (e.deps !== null) {
    e.f ^= Le;
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & ve) !== 0 && (t.f & Le) === 0 && qr(
        /** @type {Derived} */
        t
      );
  }
}
function Gr(e) {
  if (e.v === ce) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (rt.has(t) || (t.f & ve) !== 0 && Gr(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function jn(e) {
  var t = Fe;
  try {
    return Fe = !0, e();
  } finally {
    Fe = t;
  }
}
const Ta = -7169;
function pe(e, t) {
  e.f = e.f & Ta | t;
}
function Ma(e) {
  return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
const Na = [
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
function La(e) {
  return Na.includes(e);
}
const Oa = {
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
function Ra(e) {
  return e = e.toLowerCase(), Oa[e] ?? e;
}
const Ia = ["touchstart", "touchmove"];
function Da(e) {
  return Ia.includes(e);
}
const Hr = /* @__PURE__ */ new Set(), En = /* @__PURE__ */ new Set();
function Pa(e, t, n, r = {}) {
  function i(a) {
    if (r.capture || Vt.call(t, a), !a.cancelBubble)
      return Dn(() => n?.call(this, a));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? pt(() => {
    t.addEventListener(e, i, r);
  }) : t.addEventListener(e, i, r), i;
}
function Fa(e) {
  for (var t = 0; t < e.length; t++)
    Hr.add(e[t]);
  for (var n of En)
    n(e);
}
let Wn = null;
function Vt(e) {
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, i = e.composedPath?.() || [], a = (
    /** @type {null | Element} */
    i[0] || e.target
  );
  Wn = e;
  var l = 0, o = Wn === e && e.__root;
  if (o) {
    var s = i.indexOf(o);
    if (s !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e.__root = t;
      return;
    }
    var f = i.indexOf(t);
    if (f === -1)
      return;
    s <= f && (l = s);
  }
  if (a = /** @type {Element} */
  i[l] || e.target, a !== t) {
    yi(e, "currentTarget", {
      configurable: !0,
      get() {
        return a || n;
      }
    });
    var v = V, h = K;
    ye(null), Ue(null);
    try {
      for (var _, p = []; a !== null; ) {
        var w = a.assignedSlot || a.parentNode || /** @type {any} */
        a.host || null;
        try {
          var g = a["__" + r];
          g != null && (!/** @type {any} */
          a.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === a) && g.call(a, e);
        } catch (u) {
          _ ? p.push(u) : _ = u;
        }
        if (e.cancelBubble || w === t || w === null)
          break;
        a = w;
      }
      if (_) {
        for (let u of p)
          queueMicrotask(() => {
            throw u;
          });
        throw _;
      }
    } finally {
      e.__root = t, delete e.currentTarget, ye(v), Ue(h);
    }
  }
}
function Kr(e) {
  var t = document.createElement("template");
  return t.innerHTML = e.replaceAll("<!>", "<!---->"), t.content;
}
function un(e, t) {
  var n = (
    /** @type {Effect} */
    K
  );
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function R(e, t) {
  var n = (t & Zi) !== 0, r = (t & Xi) !== 0, i, a = !e.startsWith("<!>");
  return () => {
    i === void 0 && (i = Kr(a ? e : "<!>" + e), n || (i = /** @type {TemplateNode} */
    /* @__PURE__ */ Ot(i)));
    var l = (
      /** @type {TemplateNode} */
      r || Er ? document.importNode(i, !0) : i.cloneNode(!0)
    );
    if (n) {
      var o = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Ot(l)
      ), s = (
        /** @type {TemplateNode} */
        l.lastChild
      );
      un(o, s);
    } else
      un(l, l);
    return l;
  };
}
// @__NO_SIDE_EFFECTS__
function ja(e, t, n = "svg") {
  var r = !e.startsWith("<!>"), i = `<${n}>${r ? e : "<!>" + e}</${n}>`, a;
  return () => {
    if (!a) {
      var l = (
        /** @type {DocumentFragment} */
        Kr(i)
      ), o = (
        /** @type {Element} */
        /* @__PURE__ */ Ot(l)
      );
      a = /** @type {Element} */
      /* @__PURE__ */ Ot(o);
    }
    var s = (
      /** @type {TemplateNode} */
      a.cloneNode(!0)
    );
    return un(s, s), s;
  };
}
// @__NO_SIDE_EFFECTS__
function ee(e, t) {
  return /* @__PURE__ */ ja(e, t, "svg");
}
function le() {
  var e = document.createDocumentFragment(), t = document.createComment(""), n = it();
  return e.append(t, n), un(t, n), e;
}
function b(e, t) {
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function P(e, t) {
  var n = t == null ? "" : typeof t == "object" ? t + "" : t;
  n !== (e.__t ??= e.nodeValue) && (e.__t = n, e.nodeValue = n + "");
}
function Ua(e, t) {
  return Ba(e, t);
}
const kt = /* @__PURE__ */ new Map();
function Ba(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: l = !0 }) {
  ga();
  var o = /* @__PURE__ */ new Set(), s = (h) => {
    for (var _ = 0; _ < h.length; _++) {
      var p = h[_];
      if (!o.has(p)) {
        o.add(p);
        var w = Da(p);
        t.addEventListener(p, Vt, { passive: w });
        var g = kt.get(p);
        g === void 0 ? (document.addEventListener(p, Vt, { passive: w }), kt.set(p, 1)) : kt.set(p, g + 1);
      }
    }
  };
  s(cn(Hr)), En.add(s);
  var f = void 0, v = ka(() => {
    var h = n ?? t.appendChild(it());
    return fa(
      /** @type {TemplateNode} */
      h,
      {
        pending: () => {
        }
      },
      (_) => {
        if (a) {
          Oe({});
          var p = (
            /** @type {ComponentContext} */
            be
          );
          p.c = a;
        }
        i && (r.$$events = i), f = e(_, r) || {}, a && Re();
      }
    ), () => {
      for (var _ of o) {
        t.removeEventListener(_, Vt);
        var p = (
          /** @type {number} */
          kt.get(_)
        );
        --p === 0 ? (document.removeEventListener(_, Vt), kt.delete(_)) : kt.set(_, p);
      }
      En.delete(s), h !== n && h.parentNode?.removeChild(h);
    };
  });
  return za.set(f, v), f;
}
let za = /* @__PURE__ */ new WeakMap();
class Wr {
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
  #r = /* @__PURE__ */ new Map();
  /**
   * Keys of effects that are currently outroing
   * @type {Set<Key>}
   */
  #n = /* @__PURE__ */ new Set();
  /**
   * Whether to pause (i.e. outro) on change, or destroy immediately.
   * This is necessary for `<svelte:element>`
   */
  #o = !0;
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(t, n = !0) {
    this.anchor = t, this.#o = n;
  }
  #a = () => {
    var t = (
      /** @type {Batch} */
      ae
    );
    if (this.#e.has(t)) {
      var n = (
        /** @type {Key} */
        this.#e.get(t)
      ), r = this.#t.get(n);
      if (r)
        Fn(r), this.#n.delete(n);
      else {
        var i = this.#r.get(n);
        i && (this.#t.set(n, i.effect), this.#r.delete(n), i.fragment.lastChild.remove(), this.anchor.before(i.fragment), r = i.effect);
      }
      for (const [a, l] of this.#e) {
        if (this.#e.delete(a), a === t)
          break;
        const o = this.#r.get(l);
        o && (de(o.effect), this.#r.delete(l));
      }
      for (const [a, l] of this.#t) {
        if (a === n || this.#n.has(a)) continue;
        const o = () => {
          if (Array.from(this.#e.values()).includes(a)) {
            var f = document.createDocumentFragment();
            Fr(l, f), f.append(it()), this.#r.set(a, { effect: l, fragment: f });
          } else
            de(l);
          this.#n.delete(a), this.#t.delete(a);
        };
        this.#o || !r ? (this.#n.add(a), ot(l, o, !1)) : o();
      }
    }
  };
  /**
   * @param {Batch} batch
   */
  #i = (t) => {
    this.#e.delete(t);
    const n = Array.from(this.#e.values());
    for (const [r, i] of this.#r)
      n.includes(r) || (de(i.effect), this.#r.delete(r));
  };
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(t, n) {
    var r = (
      /** @type {Batch} */
      ae
    ), i = Ar();
    if (n && !this.#t.has(t) && !this.#r.has(t))
      if (i) {
        var a = document.createDocumentFragment(), l = it();
        a.append(l), this.#r.set(t, {
          effect: we(() => n(l)),
          fragment: a
        });
      } else
        this.#t.set(
          t,
          we(() => n(this.anchor))
        );
    if (this.#e.set(r, t), i) {
      for (const [o, s] of this.#t)
        o === t ? r.skipped_effects.delete(s) : r.skipped_effects.add(s);
      for (const [o, s] of this.#r)
        o === t ? r.skipped_effects.delete(s.effect) : r.skipped_effects.add(s.effect);
      r.oncommit(this.#a), r.ondiscard(this.#i);
    } else
      this.#a();
  }
}
function T(e, t, n = !1) {
  var r = new Wr(e), i = n ? ct : 0;
  function a(l, o) {
    r.ensure(l, o);
  }
  hn(() => {
    var l = !1;
    t((o, s = !0) => {
      l = !0, a(s, o);
    }), l || a(!1, null);
  }, i);
}
function Yr(e, t) {
  return t;
}
function Va(e, t, n) {
  for (var r = [], i = t.length, a, l = t.length, o = 0; o < i; o++) {
    let h = t[o];
    ot(
      h,
      () => {
        if (a) {
          if (a.pending.delete(h), a.done.add(h), a.pending.size === 0) {
            var _ = (
              /** @type {Set<EachOutroGroup>} */
              e.outrogroups
            );
            Cn(cn(a.done)), _.delete(a), _.size === 0 && (e.outrogroups = null);
          }
        } else
          l -= 1;
      },
      !1
    );
  }
  if (l === 0) {
    var s = r.length === 0 && n !== null;
    if (s) {
      var f = (
        /** @type {Element} */
        n
      ), v = (
        /** @type {Element} */
        f.parentNode
      );
      ma(v), v.append(f), e.items.clear();
    }
    Cn(t, !s);
  } else
    a = {
      pending: new Set(t),
      done: /* @__PURE__ */ new Set()
    }, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Cn(e, t = !0) {
  for (var n = 0; n < e.length; n++)
    de(e[n], t);
}
var Yn;
function Yt(e, t, n, r, i, a = null) {
  var l = e, o = /* @__PURE__ */ new Map(), s = (t & cr) !== 0;
  if (s) {
    var f = (
      /** @type {Element} */
      e
    );
    l = f.appendChild(it());
  }
  var v = null, h = /* @__PURE__ */ br(() => {
    var d = n();
    return Tn(d) ? d : d == null ? [] : cn(d);
  }), _, p = !0;
  function w() {
    u.fallback = v, qa(u, _, l, t, r), v !== null && (_.length === 0 ? (v.f & Ge) === 0 ? Fn(v) : (v.f ^= Ge, qt(v, null, l)) : ot(v, () => {
      v = null;
    }));
  }
  var g = hn(() => {
    _ = /** @type {V[]} */
    c(h);
    for (var d = _.length, m = /* @__PURE__ */ new Set(), y = (
      /** @type {Batch} */
      ae
    ), C = Ar(), z = 0; z < d; z += 1) {
      var G = _[z], O = r(G, z), re = p ? null : o.get(O);
      re ? (re.v && Lt(re.v, G), re.i && Lt(re.i, z), C && y.skipped_effects.delete(re.e)) : (re = Ga(
        o,
        p ? l : Yn ??= it(),
        G,
        O,
        z,
        i,
        t,
        n
      ), p || (re.e.f |= Ge), o.set(O, re)), m.add(O);
    }
    if (d === 0 && a && !v && (p ? v = we(() => a(l)) : (v = we(() => a(Yn ??= it())), v.f |= Ge)), !p)
      if (C) {
        for (const [Z, ue] of o)
          m.has(Z) || y.skipped_effects.add(ue.e);
        y.oncommit(w), y.ondiscard(() => {
        });
      } else
        w();
    c(h);
  }), u = { effect: g, items: o, outrogroups: null, fallback: v };
  p = !1;
}
function qa(e, t, n, r, i) {
  var a = (r & qi) !== 0, l = t.length, o = e.items, s = e.effect.first, f, v = null, h, _ = [], p = [], w, g, u, d;
  if (a)
    for (d = 0; d < l; d += 1)
      w = t[d], g = i(w, d), u = /** @type {EachItem} */
      o.get(g).e, (u.f & Ge) === 0 && (u.nodes?.a?.measure(), (h ??= /* @__PURE__ */ new Set()).add(u));
  for (d = 0; d < l; d += 1) {
    if (w = t[d], g = i(w, d), u = /** @type {EachItem} */
    o.get(g).e, e.outrogroups !== null)
      for (const ue of e.outrogroups)
        ue.pending.delete(u), ue.done.delete(u);
    if ((u.f & Ge) !== 0)
      if (u.f ^= Ge, u === s)
        qt(u, null, n);
      else {
        var m = v ? v.next : s;
        u === e.effect.last && (e.effect.last = u.prev), u.prev && (u.prev.next = u.next), u.next && (u.next.prev = u.prev), Qe(e, v, u), Qe(e, u, m), qt(u, m, n), v = u, _ = [], p = [], s = v.next;
        continue;
      }
    if ((u.f & Ee) !== 0 && (Fn(u), a && (u.nodes?.a?.unfix(), (h ??= /* @__PURE__ */ new Set()).delete(u))), u !== s) {
      if (f !== void 0 && f.has(u)) {
        if (_.length < p.length) {
          var y = p[0], C;
          v = y.prev;
          var z = _[0], G = _[_.length - 1];
          for (C = 0; C < _.length; C += 1)
            qt(_[C], y, n);
          for (C = 0; C < p.length; C += 1)
            f.delete(p[C]);
          Qe(e, z.prev, G.next), Qe(e, v, z), Qe(e, G, y), s = y, v = G, d -= 1, _ = [], p = [];
        } else
          f.delete(u), qt(u, s, n), Qe(e, u.prev, u.next), Qe(e, u, v === null ? e.effect.first : v.next), Qe(e, v, u), v = u;
        continue;
      }
      for (_ = [], p = []; s !== null && s !== u; )
        (f ??= /* @__PURE__ */ new Set()).add(s), p.push(s), s = s.next;
      if (s === null)
        continue;
    }
    (u.f & Ge) === 0 && _.push(u), v = u, s = u.next;
  }
  if (e.outrogroups !== null) {
    for (const ue of e.outrogroups)
      ue.pending.size === 0 && (Cn(cn(ue.done)), e.outrogroups?.delete(ue));
    e.outrogroups.size === 0 && (e.outrogroups = null);
  }
  if (s !== null || f !== void 0) {
    var O = [];
    if (f !== void 0)
      for (u of f)
        (u.f & Ee) === 0 && O.push(u);
    for (; s !== null; )
      (s.f & Ee) === 0 && s !== e.fallback && O.push(s), s = s.next;
    var re = O.length;
    if (re > 0) {
      var Z = (r & cr) !== 0 && l === 0 ? n : null;
      if (a) {
        for (d = 0; d < re; d += 1)
          O[d].nodes?.a?.measure();
        for (d = 0; d < re; d += 1)
          O[d].nodes?.a?.fix();
      }
      Va(e, O, Z);
    }
  }
  a && pt(() => {
    if (h !== void 0)
      for (u of h)
        u.nodes?.a?.apply();
  });
}
function Ga(e, t, n, r, i, a, l, o) {
  var s = (l & zi) !== 0 ? (l & Gi) === 0 ? /* @__PURE__ */ ha(n, !1, !1) : ht(n) : null, f = (l & Vi) !== 0 ? ht(i) : null;
  return {
    v: s,
    i: f,
    e: we(() => (a(t, s ?? n, f ?? i, o), () => {
      e.delete(r);
    }))
  };
}
function qt(e, t, n) {
  if (e.nodes)
    for (var r = e.nodes.start, i = e.nodes.end, a = t && (t.f & Ge) === 0 ? (
      /** @type {EffectNodes} */
      t.nodes.start
    ) : n; r !== null; ) {
      var l = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Zt(r)
      );
      if (a.before(r), r === i)
        return;
      r = l;
    }
}
function Qe(e, t, n) {
  t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function Zr(e, t, ...n) {
  var r = new Wr(e);
  hn(() => {
    const i = t() ?? null;
    r.ensure(i, i && ((a) => i(a, ...n)));
  }, ct);
}
function Ha(e, t) {
  var n = void 0, r;
  Lr(() => {
    n !== (n = t()) && (r && (de(r), r = null), n && (r = we(() => {
      Pn(() => (
        /** @type {(node: Element) => void} */
        n(e)
      ));
    })));
  });
}
function Xr(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var i = e.length;
    for (t = 0; t < i; t++) e[t] && (n = Xr(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function Jr() {
  for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Xr(e)) && (r && (r += " "), r += t);
  return r;
}
function Qr(e) {
  return typeof e == "object" ? Jr(e) : e ?? "";
}
const Zn = [...` 	
\r\f \v\uFEFF`];
function Ka(e, t, n) {
  var r = e == null ? "" : "" + e;
  if (t && (r = r ? r + " " + t : t), n) {
    for (var i in n)
      if (n[i])
        r = r ? r + " " + i : i;
      else if (r.length)
        for (var a = i.length, l = 0; (l = r.indexOf(i, l)) >= 0; ) {
          var o = l + a;
          (l === 0 || Zn.includes(r[l - 1])) && (o === r.length || Zn.includes(r[o])) ? r = (l === 0 ? "" : r.substring(0, l)) + r.substring(o + 1) : l = o;
        }
  }
  return r === "" ? null : r;
}
function Xn(e, t = !1) {
  var n = t ? " !important;" : ";", r = "";
  for (var i in e) {
    var a = e[i];
    a != null && a !== "" && (r += " " + i + ": " + a + n);
  }
  return r;
}
function bn(e) {
  return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Wa(e, t) {
  if (t) {
    var n = "", r, i;
    if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
      e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var a = !1, l = 0, o = !1, s = [];
      r && s.push(...Object.keys(r).map(bn)), i && s.push(...Object.keys(i).map(bn));
      var f = 0, v = -1;
      const g = e.length;
      for (var h = 0; h < g; h++) {
        var _ = e[h];
        if (o ? _ === "/" && e[h - 1] === "*" && (o = !1) : a ? a === _ && (a = !1) : _ === "/" && e[h + 1] === "*" ? o = !0 : _ === '"' || _ === "'" ? a = _ : _ === "(" ? l++ : _ === ")" && l--, !o && a === !1 && l === 0) {
          if (_ === ":" && v === -1)
            v = h;
          else if (_ === ";" || h === g - 1) {
            if (v !== -1) {
              var p = bn(e.substring(f, v).trim());
              if (!s.includes(p)) {
                _ !== ";" && h++;
                var w = e.substring(f, h).trim();
                n += " " + w + ";";
              }
            }
            f = h + 1, v = -1;
          }
        }
      }
    }
    return r && (n += Xn(r)), i && (n += Xn(i, !0)), n = n.trim(), n === "" ? null : n;
  }
  return e == null ? null : String(e);
}
function $(e, t, n, r, i, a) {
  var l = e.__className;
  if (l !== n || l === void 0) {
    var o = Ka(n, r, a);
    o == null ? e.removeAttribute("class") : t ? e.className = o : e.setAttribute("class", o), e.__className = n;
  } else if (a && i !== a)
    for (var s in a) {
      var f = !!a[s];
      (i == null || f !== !!i[s]) && e.classList.toggle(s, f);
    }
  return a;
}
function wn(e, t = {}, n, r) {
  for (var i in n) {
    var a = n[i];
    t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
  }
}
function He(e, t, n, r) {
  var i = e.__style;
  if (i !== t) {
    var a = Wa(t, r);
    a == null ? e.removeAttribute("style") : e.style.cssText = a, e.__style = t;
  } else r && (Array.isArray(r) ? (wn(e, n?.[0], r[0]), wn(e, n?.[1], r[1], "important")) : wn(e, n, r));
  return r;
}
function Sn(e, t, n = !1) {
  if (e.multiple) {
    if (t == null)
      return;
    if (!Tn(t))
      return $i();
    for (var r of e.options)
      r.selected = t.includes(Jn(r));
    return;
  }
  for (r of e.options) {
    var i = Jn(r);
    if (pa(i, t)) {
      r.selected = !0;
      return;
    }
  }
  (!n || t !== void 0) && (e.selectedIndex = -1);
}
function Ya(e) {
  var t = new MutationObserver(() => {
    Sn(e, e.__value);
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
  }), Tr(() => {
    t.disconnect();
  });
}
function Jn(e) {
  return "__value" in e ? e.__value : e.value;
}
const Ct = Symbol("class"), Bt = Symbol("style"), $r = Symbol("is custom element"), ei = Symbol("is html");
function Za(e, t) {
  t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function E(e, t, n, r) {
  var i = ti(e);
  i[t] !== (i[t] = n) && (t === "loading" && (e[Mi] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && ni(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function Xa(e, t, n, r, i = !1, a = !1) {
  var l = ti(e), o = l[$r], s = !l[ei], f = t || {}, v = e.tagName === "OPTION";
  for (var h in t)
    h in n || (n[h] = null);
  n.class ? n.class = Qr(n.class) : (r || n[Ct]) && (n.class = null), n[Bt] && (n.style ??= null);
  var _ = ni(e);
  for (const y in n) {
    let C = n[y];
    if (v && y === "value" && C == null) {
      e.value = e.__value = "", f[y] = C;
      continue;
    }
    if (y === "class") {
      var p = e.namespaceURI === "http://www.w3.org/1999/xhtml";
      $(e, p, C, r, t?.[Ct], n[Ct]), f[y] = C, f[Ct] = n[Ct];
      continue;
    }
    if (y === "style") {
      He(e, C, t?.[Bt], n[Bt]), f[y] = C, f[Bt] = n[Bt];
      continue;
    }
    var w = f[y];
    if (!(C === w && !(C === void 0 && e.hasAttribute(y)))) {
      f[y] = C;
      var g = y[0] + y[1];
      if (g !== "$$")
        if (g === "on") {
          const z = {}, G = "$$" + y;
          let O = y.slice(2);
          var u = La(O);
          if (Ma(O) && (O = O.slice(0, -7), z.capture = !0), !u && w) {
            if (C != null) continue;
            e.removeEventListener(O, f[G], z), f[G] = null;
          }
          if (C != null)
            if (u)
              e[`__${O}`] = C, Fa([O]);
            else {
              let re = function(Z) {
                f[y].call(this, Z);
              };
              f[G] = Pa(O, e, re, z);
            }
          else u && (e[`__${O}`] = void 0);
        } else if (y === "style")
          E(e, y, C);
        else if (y === "autofocus")
          ba(
            /** @type {HTMLElement} */
            e,
            !!C
          );
        else if (!o && (y === "__value" || y === "value" && C != null))
          e.value = e.__value = C;
        else if (y === "selected" && v)
          Za(
            /** @type {HTMLOptionElement} */
            e,
            C
          );
        else {
          var d = y;
          s || (d = Ra(d));
          var m = d === "defaultValue" || d === "defaultChecked";
          if (C == null && !o && !m)
            if (l[y] = null, d === "value" || d === "checked") {
              let z = (
                /** @type {HTMLInputElement} */
                e
              );
              const G = t === void 0;
              if (d === "value") {
                let O = z.defaultValue;
                z.removeAttribute(d), z.defaultValue = O, z.value = z.__value = G ? O : null;
              } else {
                let O = z.defaultChecked;
                z.removeAttribute(d), z.defaultChecked = O, z.checked = G ? O : !1;
              }
            } else
              e.removeAttribute(y);
          else m || _.includes(d) && (o || typeof C != "string") ? (e[d] = C, d in l && (l[d] = ce)) : typeof C != "function" && E(e, d, C);
        }
    }
  }
  return f;
}
function Dt(e, t, n = [], r = [], i = [], a, l = !1, o = !1) {
  mr(i, n, r, (s) => {
    var f = void 0, v = {}, h = e.nodeName === "SELECT", _ = !1;
    if (Lr(() => {
      var w = t(...s.map(c)), g = Xa(
        e,
        f,
        w,
        a,
        l,
        o
      );
      _ && h && "value" in w && Sn(
        /** @type {HTMLSelectElement} */
        e,
        w.value
      );
      for (let d of Object.getOwnPropertySymbols(v))
        w[d] || de(v[d]);
      for (let d of Object.getOwnPropertySymbols(w)) {
        var u = w[d];
        d.description === Qi && (!f || u !== f[d]) && (v[d] && de(v[d]), v[d] = we(() => Ha(e, () => u))), g[d] = u;
      }
      f = g;
    }), h) {
      var p = (
        /** @type {HTMLSelectElement} */
        e
      );
      Pn(() => {
        Sn(
          p,
          /** @type {Record<string | symbol, any>} */
          f.value,
          !0
        ), Ya(p);
      });
    }
    _ = !0;
  });
}
function ti(e) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    // @ts-expect-error
    e.__attributes ??= {
      [$r]: e.nodeName.includes("-"),
      [ei]: e.namespaceURI === Ji
    }
  );
}
var Qn = /* @__PURE__ */ new Map();
function ni(e) {
  var t = e.getAttribute("is") || e.nodeName, n = Qn.get(t);
  if (n) return n;
  Qn.set(t, n = []);
  for (var r, i = e, a = Element.prototype; a !== i; ) {
    r = ki(i);
    for (var l in r)
      r[l].set && n.push(l);
    i = lr(i);
  }
  return n;
}
function $n(e, t) {
  return e === t || e?.[lt] === t;
}
function zt(e = {}, t, n, r) {
  return Pn(() => {
    var i, a;
    return Nr(() => {
      i = a, a = [], jn(() => {
        e !== n(...a) && (t(e, ...a), i && $n(n(...i), e) && t(null, ...i));
      });
    }), () => {
      pt(() => {
        a && $n(n(...a), e) && t(null, ...a);
      });
    };
  }), e;
}
let tn = !1;
function Ja(e) {
  var t = tn;
  try {
    return tn = !1, [e(), tn];
  } finally {
    tn = t;
  }
}
const Qa = {
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
function Jt(e, t, n) {
  return new Proxy(
    { props: e, exclude: t },
    Qa
  );
}
function N(e, t, n, r) {
  var i = (n & Wi) !== 0, a = (n & Yi) !== 0, l = (
    /** @type {V} */
    r
  ), o = !0, s = () => (o && (o = !1, l = a ? jn(
    /** @type {() => V} */
    r
  ) : (
    /** @type {V} */
    r
  )), l), f;
  if (i) {
    var v = lt in e || Ti in e;
    f = Tt(e, t)?.set ?? (v && t in e ? (m) => e[t] = m : void 0);
  }
  var h, _ = !1;
  i ? [h, _] = Ja(() => (
    /** @type {V} */
    e[t]
  )) : h = /** @type {V} */
  e[t], h === void 0 && r !== void 0 && (h = s(), f && (Pi(), f(h)));
  var p;
  if (p = () => {
    var m = (
      /** @type {V} */
      e[t]
    );
    return m === void 0 ? s() : (o = !0, m);
  }, (n & Ki) === 0)
    return p;
  if (f) {
    var w = e.$$legacy;
    return (
      /** @type {() => V} */
      (function(m, y) {
        return arguments.length > 0 ? ((!y || w || _) && f(y ? p() : m), m) : p();
      })
    );
  }
  var g = !1, u = ((n & Hi) !== 0 ? vn : br)(() => (g = !1, p()));
  i && c(u);
  var d = (
    /** @type {Effect} */
    K
  );
  return (
    /** @type {() => V} */
    (function(m, y) {
      if (arguments.length > 0) {
        const C = y ? c(u) : i ? st(m) : m;
        return xe(u, C), g = !0, l !== void 0 && (l = C), m;
      }
      return gt && g || (d.f & Ke) !== 0 ? u.v : c(u);
    })
  );
}
const $a = "5";
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add($a);
var es = /* @__PURE__ */ R("<div><!></div>");
function ts(e, t) {
  let n = N(t, "class", 3, "");
  var r = es(), i = k(r);
  Zr(i, () => t.children), A(() => $(r, 1, `lc ${n() ?? ""}`, "svelte-ilxib0")), b(e, r);
}
var ns = /* @__PURE__ */ R('<span><span class="block h-2 w-2 rounded-full border border-dashed border-line-strong"></span></span>');
function rs(e, t) {
  let n = N(t, "class", 3, ""), r = N(t, "title", 3, void 0);
  var i = ns();
  A(() => {
    $(i, 1, `inline-flex shrink-0 items-center justify-center ${n() ?? ""}`), E(i, "role", r() ? "img" : void 0), E(i, "aria-hidden", r() ? void 0 : "true"), E(i, "aria-label", r());
  }), b(e, i);
}
const is = /^(?:(.*):)?(w|h|size|m[trblxyse]?|p[trblxyse]?|gap)-/;
function as(...e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.filter(Boolean).join(" ").split(/\s+/).filter(Boolean)) {
    const r = is.exec(n);
    t.set(r ? `${r[1] ?? ""}:${r[2]}` : n, n);
  }
  return [...t.values()].join(" ");
}
function Qt(...e) {
  return as(Jr(e));
}
var ss = /* @__PURE__ */ ee("<title> </title>"), ls = /* @__PURE__ */ ee("<desc> </desc>"), os = /* @__PURE__ */ ee('<svg><!><!><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"></path></svg>');
function fs(e, t) {
  Oe(t, !0);
  const n = It("iconCtx") ?? {}, r = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let i = N(t, "size", 19, () => n.size || "md"), a = N(t, "color", 19, () => n.color || "currentColor"), l = /* @__PURE__ */ Jt(t, [
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
  const s = !!(t.title?.id || t.desc?.id), f = !!t.ariaLabel || s;
  var v = os();
  Dt(
    v,
    (g) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: a(),
      ...l,
      class: g,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": s ? o : void 0,
      "aria-hidden": !f
    }),
    [() => Qt("shrink-0", r[i()], t.class)]
  );
  var h = k(v);
  {
    var _ = (g) => {
      var u = ss(), d = k(u);
      A(() => {
        E(u, "id", t.title.id), P(d, t.title.title);
      }), b(g, u);
    };
    T(h, (g) => {
      t.title?.id && t.title.title && g(_);
    });
  }
  var p = B(h);
  {
    var w = (g) => {
      var u = ls(), d = k(u);
      A(() => {
        E(u, "id", t.desc.id), P(d, t.desc.desc);
      }), b(g, u);
    };
    T(p, (g) => {
      t.desc?.id && t.desc.desc && g(w);
    });
  }
  b(e, v), Re();
}
var us = /* @__PURE__ */ ee("<title> </title>"), cs = /* @__PURE__ */ ee("<desc> </desc>"), ds = /* @__PURE__ */ ee('<svg><!><!><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd"></path></svg>');
function vs(e, t) {
  Oe(t, !0);
  const n = It("iconCtx") ?? {}, r = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let i = N(t, "size", 19, () => n.size || "md"), a = N(t, "color", 19, () => n.color || "currentColor"), l = /* @__PURE__ */ Jt(t, [
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
  const s = !!(t.title?.id || t.desc?.id), f = !!t.ariaLabel || s;
  var v = ds();
  Dt(
    v,
    (g) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: a(),
      ...l,
      class: g,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": s ? o : void 0,
      "aria-hidden": !f
    }),
    [() => Qt("shrink-0", r[i()], t.class)]
  );
  var h = k(v);
  {
    var _ = (g) => {
      var u = us(), d = k(u);
      A(() => {
        E(u, "id", t.title.id), P(d, t.title.title);
      }), b(g, u);
    };
    T(h, (g) => {
      t.title?.id && t.title.title && g(_);
    });
  }
  var p = B(h);
  {
    var w = (g) => {
      var u = cs(), d = k(u);
      A(() => {
        E(u, "id", t.desc.id), P(d, t.desc.desc);
      }), b(g, u);
    };
    T(p, (g) => {
      t.desc?.id && t.desc.desc && g(w);
    });
  }
  b(e, v), Re();
}
var hs = /* @__PURE__ */ ee("<title> </title>"), _s = /* @__PURE__ */ ee("<desc> </desc>"), ps = /* @__PURE__ */ ee('<svg><!><!><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0V8Zm-1 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z" clip-rule="evenodd"></path></svg>');
function gs(e, t) {
  Oe(t, !0);
  const n = It("iconCtx") ?? {}, r = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let i = N(t, "size", 19, () => n.size || "md"), a = N(t, "color", 19, () => n.color || "currentColor"), l = /* @__PURE__ */ Jt(t, [
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
  const s = !!(t.title?.id || t.desc?.id), f = !!t.ariaLabel || s;
  var v = ps();
  Dt(
    v,
    (g) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: a(),
      ...l,
      class: g,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": s ? o : void 0,
      "aria-hidden": !f
    }),
    [() => Qt("shrink-0", r[i()], t.class)]
  );
  var h = k(v);
  {
    var _ = (g) => {
      var u = hs(), d = k(u);
      A(() => {
        E(u, "id", t.title.id), P(d, t.title.title);
      }), b(g, u);
    };
    T(h, (g) => {
      t.title?.id && t.title.title && g(_);
    });
  }
  var p = B(h);
  {
    var w = (g) => {
      var u = _s(), d = k(u);
      A(() => {
        E(u, "id", t.desc.id), P(d, t.desc.desc);
      }), b(g, u);
    };
    T(p, (g) => {
      t.desc?.id && t.desc.desc && g(w);
    });
  }
  b(e, v), Re();
}
var ms = /* @__PURE__ */ ee("<title> </title>"), bs = /* @__PURE__ */ ee("<desc> </desc>"), ws = /* @__PURE__ */ ee('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z"></path></svg>');
function ys(e, t) {
  Oe(t, !0);
  const n = It("iconCtx") ?? {}, r = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let i = N(t, "size", 19, () => n.size || "md"), a = N(t, "color", 19, () => n.color || "currentColor"), l = N(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ Jt(t, [
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
  ]), s = `${t.title?.id || ""} ${t.desc?.id || ""}`.trim();
  const f = !!(t.title?.id || t.desc?.id), v = !!t.ariaLabel || f;
  var h = ws();
  Dt(
    h,
    (d) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: a(),
      ...o,
      class: d,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": f ? s : void 0,
      "aria-hidden": !v
    }),
    [() => Qt("shrink-0", r[i()], t.class)]
  );
  var _ = k(h);
  {
    var p = (d) => {
      var m = ms(), y = k(m);
      A(() => {
        E(m, "id", t.title.id), P(y, t.title.title);
      }), b(d, m);
    };
    T(_, (d) => {
      t.title?.id && t.title.title && d(p);
    });
  }
  var w = B(_);
  {
    var g = (d) => {
      var m = bs(), y = k(m);
      A(() => {
        E(m, "id", t.desc.id), P(y, t.desc.desc);
      }), b(d, m);
    };
    T(w, (d) => {
      t.desc?.id && t.desc.desc && d(g);
    });
  }
  var u = B(w);
  A(() => E(u, "stroke-width", l())), b(e, h), Re();
}
var ks = /* @__PURE__ */ ee("<title> </title>"), xs = /* @__PURE__ */ ee("<desc> </desc>"), Es = /* @__PURE__ */ ee('<svg><!><!><path stroke="currentColor" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path></svg>');
function ri(e, t) {
  Oe(t, !0);
  const n = It("iconCtx") ?? {}, r = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let i = N(t, "size", 19, () => n.size || "md"), a = N(t, "color", 19, () => n.color || "currentColor"), l = N(t, "strokeWidth", 19, () => n.strokeWidth || 2), o = /* @__PURE__ */ Jt(t, [
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
  ]), s = `${t.title?.id || ""} ${t.desc?.id || ""}`.trim();
  const f = !!(t.title?.id || t.desc?.id), v = !!t.ariaLabel || f;
  var h = Es();
  Dt(
    h,
    (d) => ({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color: a(),
      ...o,
      class: d,
      viewBox: "0 0 24 24",
      "aria-label": t.ariaLabel,
      "aria-describedby": f ? s : void 0,
      "aria-hidden": !v
    }),
    [() => Qt("shrink-0", r[i()], t.class)]
  );
  var _ = k(h);
  {
    var p = (d) => {
      var m = ks(), y = k(m);
      A(() => {
        E(m, "id", t.title.id), P(y, t.title.title);
      }), b(d, m);
    };
    T(_, (d) => {
      t.title?.id && t.title.title && d(p);
    });
  }
  var w = B(_);
  {
    var g = (d) => {
      var m = xs(), y = k(m);
      A(() => {
        E(m, "id", t.desc.id), P(y, t.desc.desc);
      }), b(d, m);
    };
    T(w, (d) => {
      t.desc?.id && t.desc.desc && d(g);
    });
  }
  var u = B(w);
  A(() => E(u, "stroke-width", l())), b(e, h), Re();
}
var Cs = /* @__PURE__ */ R("<span><!></span>"), Ss = /* @__PURE__ */ ee('<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7.5" class="sm-pm-disc svelte-1cj69fi"></circle><path class="sm-pm-pie svelte-1cj69fi"></path></svg>'), As = /* @__PURE__ */ ee('<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M9 5.5v13M15 5.5v13"></path></svg>'), Ts = /* @__PURE__ */ ee('<path d="M12 6v7M12 18h.01"></path>'), Ms = /* @__PURE__ */ ee('<path d="M12 4a8 8 0 1 1-8 8"></path>'), Ns = /* @__PURE__ */ ee('<path d="M12 7v5l3 2"></path>'), Ls = /* @__PURE__ */ ee('<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><!></svg>'), Os = /* @__PURE__ */ R("<span><!></span>"), Rs = /* @__PURE__ */ R('<span class="h-2 w-2 rounded-full ring-[1.5px] ring-inset ring-fg-subtle"></span>'), Is = /* @__PURE__ */ R('<span class="h-1.5 w-1.5 rounded-full bg-success-solid"></span>'), Ds = /* @__PURE__ */ R('<span class="sr-only"> </span>'), Ps = /* @__PURE__ */ R('<span class="relative inline-flex h-4 w-4 shrink-0 items-center justify-center"><!> <!></span>');
function Fs(e, t) {
  let n = N(t, "label", 3, void 0), r = N(t, "resolved", 3, !1), i = N(t, "tone", 3, void 0), a = N(t, "progress", 3, null);
  const l = {
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
  }, o = "bg-subtle ring-line text-fg-subtle", s = /* @__PURE__ */ Q(() => a() != null && (t.state === "checking" || t.state === "deploying") ? Math.max(0, Math.min(1, a())) : null), f = /* @__PURE__ */ Q(() => {
    if (c(s) == null || c(s) <= 0) return "";
    if (c(s) >= 1) return "M8 3.75a4.25 4.25 0 1 1 0 8.5a4.25 4.25 0 1 1 0-8.5Z";
    const d = c(s) * 2 * Math.PI, m = 4.25, y = 8 + m * Math.sin(d), C = 8 - m * Math.cos(d);
    return `M8 8V3.75A${m} ${m} 0 ${c(s) > 0.5 ? 1 : 0} 1 ${y.toFixed(3)} ${C.toFixed(3)}Z`;
  }), v = /* @__PURE__ */ Q(() => t.state === "approval" ? void 0 : r() ? o : l[t.state]);
  var h = Ps(), _ = k(h);
  {
    var p = (d) => {
      var m = Cs(), y = k(m);
      ri(y, { class: "h-3 w-3", "aria-hidden": "true" }), A(() => $(
        m,
        1,
        `sm-ask inline-flex h-4 w-4 items-center justify-center rounded-full ${i() === "held" ? "sm-ask-held text-held" : i() === "neutral" ? "sm-ask-neutral text-fg-muted" : "text-fg"}`,
        "svelte-1cj69fi"
      )), b(d, m);
    }, w = (d) => {
      var m = le(), y = H(m);
      {
        var C = (G) => {
          var O = Ss(), re = B(k(O));
          A(() => {
            $(O, 0, `sm-pm ${t.state === "deploying" ? "sm-pm-active" : "sm-pm-progress"}`, "svelte-1cj69fi"), E(re, "d", c(f));
          }), b(G, O);
        }, z = (G) => {
          var O = le(), re = H(O);
          {
            var Z = (S) => {
              var ie = Os(), oe = k(ie);
              {
                var te = (J) => {
                  var M = As();
                  b(J, M);
                }, X = (J) => {
                  var M = Ls(), q = k(M);
                  {
                    var se = (x) => {
                      var L = Ts();
                      b(x, L);
                    }, W = (x) => {
                      var L = le(), I = H(L);
                      {
                        var F = (ne) => {
                          var U = Ms();
                          b(ne, U);
                        }, j = (ne) => {
                          var U = Ns();
                          b(ne, U);
                        };
                        T(
                          I,
                          (ne) => {
                            t.state === "deploying" ? ne(F) : ne(j, !1);
                          },
                          !0
                        );
                      }
                      b(x, L);
                    };
                    T(q, (x) => {
                      t.state === "failed" || t.state === "stuck" ? x(se) : x(W, !1);
                    });
                  }
                  A(() => $(M, 0, Qr(t.state === "deploying" ? "sm-spin" : ""), "svelte-1cj69fi")), b(J, M);
                };
                T(oe, (J) => {
                  t.state === "held" ? J(te) : J(X, !1);
                });
              }
              A(() => $(ie, 1, `inline-flex h-4 w-4 items-center justify-center rounded-full ring-1 ring-inset ${c(v) ?? ""}`, "svelte-1cj69fi")), b(S, ie);
            }, ue = (S) => {
              var ie = le(), oe = H(ie);
              {
                var te = (J) => {
                  rs(J, {});
                }, X = (J) => {
                  var M = le(), q = H(M);
                  {
                    var se = (x) => {
                      var L = Rs();
                      b(x, L);
                    }, W = (x) => {
                      var L = Is();
                      b(x, L);
                    };
                    T(
                      q,
                      (x) => {
                        t.state === "behind" ? x(se) : x(W, !1);
                      },
                      !0
                    );
                  }
                  b(J, M);
                };
                T(
                  oe,
                  (J) => {
                    t.state === "none" ? J(te) : J(X, !1);
                  },
                  !0
                );
              }
              b(S, ie);
            };
            T(
              re,
              (S) => {
                c(v) ? S(Z) : S(ue, !1);
              },
              !0
            );
          }
          b(G, O);
        };
        T(
          y,
          (G) => {
            c(s) != null ? G(C) : G(z, !1);
          },
          !0
        );
      }
      b(d, m);
    };
    T(_, (d) => {
      t.state === "approval" ? d(p) : d(w, !1);
    });
  }
  var g = B(_, 2);
  {
    var u = (d) => {
      var m = Ds(), y = k(m);
      A(() => P(y, n())), b(d, m);
    };
    T(g, (d) => {
      n() && d(u);
    });
  }
  A(() => E(h, "title", n())), b(e, h);
}
const js = [
  { rank: 0, pattern: /^(dev|development|local)$/i },
  { rank: 1, pattern: /(dev|development)/i },
  { rank: 2, pattern: /^(test|qa|qe|integration)$/i },
  { rank: 3, pattern: /(test|qa|qe|integration)/i },
  { rank: 4, pattern: /^(stage|staging|preprod|preview)$/i },
  { rank: 5, pattern: /(stage|staging|preprod|preview)/i },
  { rank: 7, pattern: /^(prod|production|live)$/i },
  { rank: 8, pattern: /(prod|production|live)/i }
], er = 6, Us = {
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
function Bs(e) {
  if (!e) return er;
  const t = Us[e.toLowerCase().split(/[-_./\s:]/, 1)[0]];
  if (t !== void 0) return t;
  for (const n of js)
    if (n.pattern.test(e)) return n.rank;
  return er;
}
const zs = {
  dev: "dev",
  development: "dev",
  test: "test",
  qa: "test",
  staging: "staging",
  stage: "staging",
  preprod: "staging",
  prod: "prod",
  production: "prod"
};
function Vs(e) {
  if (!e) return null;
  const t = zs[e];
  if (t) return t;
  const n = Bs(e);
  return n <= 1 ? "dev" : n <= 3 ? "test" : n <= 5 ? "staging" : n === 6 ? null : "prod";
}
const qs = "dashboard.rollout.kuberik.com/theme", tr = "dashboard.rollout.kuberik.com/theme-label", $e = {
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
}, Gs = {
  dev: { label: "Development", color: "#009689", ramp: $e.dev },
  development: { label: "Development", color: "#009689", ramp: $e.dev },
  prod: { label: "Production", color: "#ed00ab", ramp: $e.prod },
  production: { label: "Production", color: "#ed00ab", ramp: $e.prod },
  stage: { label: "Staging", color: "#7c3aed", ramp: $e.staging },
  staging: { label: "Staging", color: "#7c3aed", ramp: $e.staging },
  test: { label: "Test", color: "#0891b2", ramp: $e.test },
  testing: { label: "Test", color: "#0891b2", ramp: $e.test }
}, Hs = [
  { pattern: /prod|production/i, preset: "prod" },
  { pattern: /dev|development/i, preset: "dev" },
  { pattern: /staging|stage/i, preset: "staging" },
  { pattern: /test|testing/i, preset: "test" }
], Ks = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
function ii(e) {
  const t = e.trim();
  if (!Ks.test(t)) return null;
  if (t.length === 4) {
    const [, n, r, i] = t;
    return `#${n}${n}${r}${r}${i}${i}`.toLowerCase();
  }
  return t.toLowerCase();
}
function nr(e) {
  const t = ii(e);
  return t ? {
    r: parseInt(t.slice(1, 3), 16),
    g: parseInt(t.slice(3, 5), 16),
    b: parseInt(t.slice(5, 7), 16)
  } : { r: 37, g: 99, b: 235 };
}
function xt(e, t, n) {
  const r = nr(e), i = nr(t), a = (o, s) => Math.round(o * (1 - n) + s * n), l = (o) => o.toString(16).padStart(2, "0");
  return `#${l(a(r.r, i.r))}${l(a(r.g, i.g))}${l(
    a(r.b, i.b)
  )}`;
}
function Ws(e) {
  return {
    textColor: xt(e, "#000000", 0.18),
    borderColor: xt(e, "#ffffff", 0.64),
    surfaceColor: xt(e, "#ffffff", 0.9),
    darkSurfaceColor: xt(e, "#000000", 0.7),
    darkTextColor: xt(e, "#ffffff", 0.42),
    // gray-700 is `.dark .chip-env`'s old border mix target.
    darkBorderColor: xt(e, "#364153", 0.62)
  };
}
function Ys(e) {
  return e.split(/[-_\s]+/).filter(Boolean).map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(" ");
}
function Zs(e) {
  return Hs.find(({ pattern: n }) => n.test(e))?.preset ?? null;
}
function Xs({
  annotationLabel: e,
  environmentName: t,
  inlineThemeColor: n,
  preset: r,
  themeName: i,
  themeValue: a
}) {
  return i === "custom" ? t || "Custom" : t || r?.label || Ys(i);
}
function Js(e, t, n, r, i) {
  const a = ii(r) ?? "#2563eb";
  return {
    name: e,
    label: t,
    environmentName: n,
    color: a,
    ...i ?? Ws(a)
  };
}
function Qs(e, t, n) {
  const r = e?.metadata?.annotations, i = typeof t == "string" ? t : t?.spec?.environment, a = i || (t && typeof t == "object" ? e?.metadata?.labels?.environment?.trim() : void 0) || void 0, l = r?.[qs]?.trim();
  if (!a) return null;
  const o = Vs(i) ?? a, f = (o ? Zs(o) : null) ?? "", v = f ? Gs[f] : void 0, h = null, _ = v?.color;
  if (!_) return null;
  const p = Xs({
    annotationLabel: r?.[tr]?.trim(),
    environmentName: a,
    inlineThemeColor: h,
    preset: v,
    themeName: f,
    themeValue: l
  }), w = a || r?.[tr]?.trim() || "", g = v && !h ? v.ramp : void 0;
  return Js(f, p, w, _, g);
}
function nn(e) {
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
const rr = {
  production: "prod",
  development: "dev",
  testing: "test",
  stage: "staging"
};
function $s(e) {
  const t = (e ?? "").trim(), n = /^(\d+)\s+([a-z]+)\s+(regions?)$/i.exec(t);
  if (n) {
    const l = n[2].toLowerCase();
    return { tier: rr[l] ?? l, place: `${n[1]} ${n[3].toLowerCase()}` };
  }
  const r = t.indexOf("-"), i = (r < 0 ? t : t.slice(0, r)).toLowerCase(), a = r < 0 ? "" : t.slice(r + 1);
  return { tier: rr[i] ?? i, place: a || null };
}
var el = /* @__PURE__ */ R('<!> <span class="min-w-0 truncate"> </span>', 1), tl = /* @__PURE__ */ R('<span class="chip-value-wrap hit-32"><a><span class="min-w-0 truncate"> </span></a></span>'), nl = /* @__PURE__ */ R('<a><span class="min-w-0 truncate"> </span></a>'), rl = /* @__PURE__ */ R('<span><span class="min-w-0 truncate"> </span></span>'), il = /* @__PURE__ */ R("<span><span><!></span> <!></span>"), al = /* @__PURE__ */ R('<span><span class="min-w-0 truncate"> </span></span>'), sl = /* @__PURE__ */ R('<span><span class="chip chip-env-name chip-env-tier t-chip"> </span> <span><span class="min-w-0 truncate"> </span></span></span>'), ll = /* @__PURE__ */ R("<span> </span>"), ol = /* @__PURE__ */ R("<span><!></span>");
function fl(e, t) {
  Oe(t, !0);
  const n = (M) => {
    var q = el(), se = H(q);
    {
      var W = (F) => {
        var j = le(), ne = H(j);
        Zr(ne, () => t.icon), b(F, j);
      }, x = (F) => {
        var j = le(), ne = H(j);
        {
          var U = (D) => {
            ys(D, { class: "mr-[3px] h-3 w-3 shrink-0", "aria-hidden": "true" });
          };
          T(
            ne,
            (D) => {
              c(S) && D(U);
            },
            !0
          );
        }
        b(F, j);
      };
      T(se, (F) => {
        t.icon ? F(W) : F(x, !1);
      });
    }
    var L = B(se, 2), I = k(L);
    A(() => P(I, a())), b(M, q);
  }, r = (M, q = Ci) => {
    var se = le(), W = H(se);
    {
      var x = (I) => {
        var F = tl(), j = k(F), ne = k(j), U = k(ne);
        A(() => {
          $(j, 1, `chip-value t-code-sm ${s() ? "chip-value--dim" : ""}`), E(j, "href", o()), E(j, "title", t.valueTitle ?? l()), P(U, l());
        }), b(I, F);
      }, L = (I) => {
        var F = le(), j = H(F);
        {
          var ne = (D) => {
            var Y = nl(), ge = k(Y), at = k(ge);
            A(() => {
              $(Y, 1, `chip-value t-code-sm ${q() ? `chip-value--solo ${w()}` : ""} ${s() ? "chip-value--dim" : ""}`), E(Y, "href", o()), E(Y, "title", t.valueTitle ?? l()), P(at, l());
            }), b(D, Y);
          }, U = (D) => {
            var Y = rl(), ge = k(Y), at = k(ge);
            A(() => {
              $(Y, 1, `chip-value t-code-sm ${q() ? `chip-value--solo ${w()}` : ""} ${s() ? "chip-value--dim" : ""}`), E(Y, "title", t.valueTitle ?? l()), P(at, l());
            }), b(D, Y);
          };
          T(
            j,
            (D) => {
              o() ? D(ne) : D(U, !1);
            },
            !0
          );
        }
        b(I, F);
      };
      T(W, (I) => {
        o() && !q() ? I(x) : I(L, !1);
      });
    }
    b(M, se);
  };
  let i = N(t, "role", 3, "rank"), a = N(t, "label", 3, ""), l = N(t, "value", 3, null), o = N(t, "valueHref", 3, null), s = N(t, "valueDim", 3, !1), f = N(t, "theme", 3, null);
  N(t, "dot", 3, !0);
  let v = N(t, "wide", 3, !1), h = N(t, "valueIsBuild", 3, !0), _ = N(t, "regionOnly", 3, !1), p = N(t, "soft", 3, !1), w = N(t, "class", 3, "");
  mn(() => {
  });
  const g = /* @__PURE__ */ Q(() => l() !== null && l() !== void 0 && l() !== ""), u = /* @__PURE__ */ Q(() => i() === "env" && !c(g) ? $s(a()) : null), d = /* @__PURE__ */ Q(() => c(g) && a() === "");
  let m = /* @__PURE__ */ ze(null);
  mn(() => {
  }), mn(() => {
  });
  const y = "border-line text-fg-subtle", C = "border-line text-success", z = "border-line text-held", G = "border-danger-line bg-danger-tint text-danger", Z = {
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
    rank: z,
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
    failing: G,
    // `diverged` is the third member of the rank vocabulary — `newest`,
    // `−N`, and the case where a rank is not a distance at all. It takes
    // the product's ONE red (red-700 / dark red-400), the hue already
    // owned by `Failed`, because both mean "adverse and it will not clear
    // on its own"; the closed budget has no spare hue and this needs no
    // new one. It is deliberately TEXT-ONLY, the same geometry as `rank`:
    // `alarm` stays the only chip with a FILL, so amber remains the
    // loudest thing on the page and `stuck` is not out-shouted by a state
    // one row above it.
    diverged: G,
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
    blocked: G,
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
    count: y,
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
    unranked: y,
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
    issue: G
  }, ue = /* @__PURE__ */ new Set(["newest", "head", "rank", "diverged", "unranked"]), S = /* @__PURE__ */ Q(() => !t.icon && c(g) && h() && ue.has(i())), ie = /* @__PURE__ */ Q(() => v() ? "chip-wide" : i() === "env" ? "" : c(S) ? "max-w-[calc(14ch+40px)]" : "max-w-[calc(14ch+26px)]");
  var oe = le(), te = H(oe);
  {
    var X = (M) => {
      r(M, () => !0);
    }, J = (M) => {
      var q = le(), se = H(q);
      {
        var W = (L) => {
          var I = il(), F = k(I), j = k(F);
          n(j);
          var ne = B(F, 2);
          r(ne, () => !1), zt(I, (U) => xe(m, U), () => c(m)), A(
            (U) => {
              $(I, 1, `chip-joined ${w() ?? ""}`), $(F, 1, `chip ${i() === "env" ? "chip-env-name t-ui-sm" : "t-chip"} ${Z[i()] ?? ""} ${c(ie) ?? ""}`), He(F, U), E(F, "title", t.title ?? a());
            },
            [
              () => i() === "env" && f() ? nn(f()) : void 0
            ]
          ), b(L, I);
        }, x = (L) => {
          var I = le(), F = H(I);
          {
            var j = (U) => {
              var D = le(), Y = H(D);
              {
                var ge = (Xe) => {
                  var Me = al(), Pt = k(Me), he = k(Pt);
                  zt(Me, (Ne) => xe(m, Ne), () => c(m)), A(() => {
                    $(Me, 1, `chip chip-env-name chip-env-place chip-env-region ${v() ? "chip-wide" : ""} ${w() ?? ""}`), E(Me, "data-env", a()), E(Me, "title", t.title ?? a()), P(he, c(u).place);
                  }), b(Xe, Me);
                }, at = (Xe) => {
                  var Me = le(), Pt = H(Me);
                  {
                    var he = (Ie) => {
                      var fe = sl(), mt = k(fe), Se = k(mt), Ft = B(mt, 2), _n = k(Ft), pn = k(_n);
                      zt(fe, (jt) => xe(m, jt), () => c(m)), A(
                        (jt, Je) => {
                          $(fe, 1, `chip-joined chip-env-badge ${p() ? "chip-env-soft" : ""} ${w() ?? ""}`), E(fe, "data-env", a()), He(fe, jt), E(fe, "title", t.title ?? a()), P(Se, c(u).tier), $(Ft, 1, `chip chip-env-name chip-env-place t-ui-sm ${v() ? "chip-wide" : ""} ${Je ?? ""}`), P(pn, c(u).place);
                        },
                        [
                          () => f() ? nn(f()) : void 0,
                          () => /^\d+ regions?$/.test(c(u).place) ? "chip-env-place--count" : ""
                        ]
                      ), b(Ie, fe);
                    }, Ne = (Ie) => {
                      var fe = ll(), mt = k(fe);
                      zt(fe, (Se) => xe(m, Se), () => c(m)), A(
                        (Se) => {
                          $(fe, 1, `chip chip-env-name chip-env-tier t-chip ${p() ? "chip-env-soft" : ""} ${w() ?? ""}`), E(fe, "data-env", a()), He(fe, Se), E(fe, "title", t.title ?? a()), P(mt, c(u).tier);
                        },
                        [
                          () => f() ? nn(f()) : void 0
                        ]
                      ), b(Ie, fe);
                    };
                    T(
                      Pt,
                      (Ie) => {
                        c(u).place ? Ie(he) : Ie(Ne, !1);
                      },
                      !0
                    );
                  }
                  b(Xe, Me);
                };
                T(Y, (Xe) => {
                  c(u).place && _() ? Xe(ge) : Xe(at, !1);
                });
              }
              b(U, D);
            }, ne = (U) => {
              var D = ol(), Y = k(D);
              n(Y), zt(D, (ge) => xe(m, ge), () => c(m)), A(
                (ge) => {
                  $(D, 1, `chip ${i() === "env" ? "chip-env-name t-ui-sm" : "t-chip"} ${Z[i()] ?? ""} ${c(ie) ?? ""} ${w() ?? ""}`), He(D, ge), E(D, "title", t.title ?? a());
                },
                [
                  () => i() === "env" && f() ? nn(f()) : void 0
                ]
              ), b(U, D);
            };
            T(
              F,
              (U) => {
                c(u) ? U(j) : U(ne, !1);
              },
              !0
            );
          }
          b(L, I);
        };
        T(
          se,
          (L) => {
            c(g) ? L(W) : L(x, !1);
          },
          !0
        );
      }
      b(M, q);
    };
    T(te, (M) => {
      c(d) ? M(X) : M(J, !1);
    });
  }
  b(e, oe), Re();
}
const ul = () => ({}), cl = { dev: "dev", test: "test", staging: "staging", prod: "production" }, dl = (e) => Qs(null, cl[e] ?? e);
function vl(e, t) {
  return e.state === "fail" ? "failed" : e.state === "hold" ? "held" : e.state === "done" ? "done" : e.state === "todo" ? "todo" : e.name === "Check" && t !== "deploying" ? "checking" : "deploying";
}
const hl = { xs: { d: 10, pitch: 22, line: 1 }, sm: { d: 24, pitch: 56, line: 2 } };
function ai(e, t, n = !1) {
  return e.map((r) => ({
    state: r.state === "done" ? "done" : r.state === "fail" ? "failed" : r.state === "hold" ? "held" : r.state === "todo" ? "pending" : vl(r, t) === "checking" ? "checking" : "current",
    label: n ? r.name : void 0,
    step: r.name,
    stepState: r.state
  }));
}
var _l = /* @__PURE__ */ R('<span aria-hidden="true"></span>'), pl = /* @__PURE__ */ R('<li class="mp-slot svelte-12vk4m5" data-fold="" data-node="fold"><span class="mp-fold t-meta tabular-nums svelte-12vk4m5" aria-hidden="true"> </span></li>'), gl = /* @__PURE__ */ R('<span aria-hidden="true"></span>'), ml = /* @__PURE__ */ R("<span></span>"), bl = /* @__PURE__ */ ee('<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M9 5.5v13M15 5.5v13"></path></svg>'), wl = /* @__PURE__ */ R('<span class="h-1.5 w-1.5 rounded-full bg-success-solid"></span>'), yl = /* @__PURE__ */ R("<span> </span>"), kl = /* @__PURE__ */ R('<span aria-hidden="true"><!></span> <!>', 1), xl = /* @__PURE__ */ R('<li class="mp-slot svelte-12vk4m5"><!></li>'), El = /* @__PURE__ */ R("<!> <!>", 1), Cl = /* @__PURE__ */ R('<ol data-strand=""></ol>');
function Sl(e, t) {
  Oe(t, !0);
  let n = N(t, "size", 3, "xs"), r = N(t, "lit", 3, !0), i = N(t, "dim", 3, !1), a = N(t, "neutral", 3, !1), l = N(t, "max", 3, void 0), o = N(t, "decorative", 3, !1), s = N(t, "label", 3, void 0), f = N(t, "kind", 3, "strand"), v = N(t, "class", 3, "");
  const h = /* @__PURE__ */ Q(() => hl[n()]), _ = /* @__PURE__ */ Q(() => Math.max(3, l() ?? (n() === "sm" ? 5 : 6))), p = /* @__PURE__ */ new Set(["current", "checking", "held", "approval", "failed"]), w = /* @__PURE__ */ Q(() => {
    const S = t.nodes.map((X) => ({ fold: !1, n: X }));
    if (t.nodes.length <= c(_)) return S;
    const ie = t.nodes.length - c(
      _
      // the fold node takes one slot itself
    ) + 1, oe = (X) => X > 0 && X < t.nodes.length - 1 && !p.has(t.nodes[X].state);
    let te = null;
    for (let X = 1; X < t.nodes.length - 1; ) {
      if (!oe(X)) {
        X++;
        continue;
      }
      let J = X;
      for (; J < t.nodes.length - 1 && oe(J); ) J++;
      if (J - X >= ie) {
        te = [X, X + ie];
        break;
      }
      (!te || J - X > te[1] - te[0]) && (te = [X, J]), X = J;
    }
    return !te || te[1] - te[0] < 2 ? S : [
      ...S.slice(0, te[0]),
      { fold: !0, hidden: t.nodes.slice(te[0], te[1]) },
      ...S.slice(te[1])
    ];
  }), g = /* @__PURE__ */ Q(() => c(w).reduce(
    (S, ie, oe) => (ie.fold ? ie.hidden.some((te) => te.state !== "pending") : ie.n.state !== "pending") ? oe : S,
    -1
  )), u = /* @__PURE__ */ Q(() => n() === "sm" && t.nodes.some((S) => S.label)), d = /* @__PURE__ */ Q(() => c(u) ? (c(h).pitch - 4 - c(h).d) / 2 : 0), m = /* @__PURE__ */ Q(() => (c(w).length - 1) * c(h).pitch + c(h).d + 2 * c(d)), y = {
    done: "done",
    current: "running",
    pending: "not started",
    failed: "failed",
    held: "waiting",
    approval: "waiting for approval",
    checking: "checking",
    rest: "healthy"
  }, C = /* @__PURE__ */ Q(() => s() ?? "Steps: " + t.nodes.map((S) => `${S.label ?? S.step ?? ""} ${y[S.state]}`.trim()).join(", ")), z = (S) => S === "done" ? "mp-done" : S === "failed" ? "st-fail" : S === "held" ? "st-hold" : S === "approval" ? "mp-ask" : S === "checking" ? "st-check" : S === "current" ? "st-active " + (r() ? "st-live" : "") : S === "rest" ? "mp-rest" : "mp-ring mp-ring-off", G = (S) => S === "done" ? "bg-success-tint text-success" : S === "failed" ? "bg-danger-tint text-danger" : S === "checking" ? "bg-progress-tint text-progress" : S === "current" ? "bg-active-tint text-active" : S === "held" ? "bg-held-tint text-held" : S === "approval" ? "mp-ask text-fg" : S === "rest" ? "bg-subtle" : "bg-subtle text-fg-disabled", O = (S) => S === "checking" ? "border-progress-solid/40 border-t-progress-solid" : "border-active-solid/40 border-t-active-solid", re = (S) => S.title ?? `${S.label ?? S.step ?? ""}${S.label || S.step ? " · " : ""}${y[S.state]}`;
  var Z = Cl();
  let ue;
  Yt(Z, 21, () => c(w), Yr, (S, ie, oe) => {
    var te = El(), X = H(te);
    {
      var J = (W) => {
        var x = _l();
        let L, I;
        A(() => {
          L = $(x, 1, "mp-seg svelte-12vk4m5", null, L, { "mp-solid": oe <= c(g) }), I = He(x, "", I, {
            left: `${(oe - 1) * c(h).pitch + c(h).d + c(d)}px`
          });
        }), b(W, x);
      };
      T(X, (W) => {
        oe > 0 && W(J);
      });
    }
    var M = B(X, 2);
    {
      var q = (W) => {
        var x = pl();
        let L;
        var I = k(x), F = k(I);
        A(
          (j) => {
            E(x, "title", `${c(ie).hidden.length ?? ""} more: ${j ?? ""}`), L = He(x, "", L, { left: `${oe * c(h).pitch + c(d)}px` }), P(F, `+${c(ie).hidden.length ?? ""}`);
          },
          [
            () => c(ie).hidden.map((j) => j.label ?? j.step ?? y[j.state]).join(", ")
          ]
        ), b(W, x);
      }, se = (W) => {
        const x = /* @__PURE__ */ Q(() => c(ie).n);
        var L = xl();
        let I;
        var F = k(L);
        {
          var j = (U) => {
            var D = gl();
            A((Y) => $(D, 1, `st-node mp-dot ${Y ?? ""}`, "svelte-12vk4m5"), [() => z(c(x).state)]), b(U, D);
          }, ne = (U) => {
            var D = kl(), Y = H(D), ge = k(Y);
            {
              var at = (he) => {
                fs(he, { class: "h-4 w-4" });
              }, Xe = (he) => {
                var Ne = le(), Ie = H(Ne);
                {
                  var fe = (Se) => {
                    gs(Se, { class: "h-4 w-4" });
                  }, mt = (Se) => {
                    var Ft = le(), _n = H(Ft);
                    {
                      var pn = (Je) => {
                        var Ut = ml();
                        A((gn) => $(Ut, 1, `h-4 w-4 animate-spin rounded-full border-2 ${gn ?? ""}`, "svelte-12vk4m5"), [() => O(c(x).state)]), b(Je, Ut);
                      }, jt = (Je) => {
                        var Ut = le(), gn = H(Ut);
                        {
                          var ci = (bt) => {
                            var $t = bl();
                            b(bt, $t);
                          }, di = (bt) => {
                            var $t = le(), vi = H($t);
                            {
                              var hi = (wt) => {
                                ri(wt, { class: "h-3.5 w-3.5" });
                              }, _i = (wt) => {
                                var Un = le(), pi = H(Un);
                                {
                                  var gi = (yt) => {
                                    var bi = wl();
                                    b(yt, bi);
                                  }, mi = (yt) => {
                                    vs(yt, { class: "h-4 w-4" });
                                  };
                                  T(
                                    pi,
                                    (yt) => {
                                      c(x).state === "rest" ? yt(gi) : yt(mi, !1);
                                    },
                                    !0
                                  );
                                }
                                b(wt, Un);
                              };
                              T(
                                vi,
                                (wt) => {
                                  c(x).state === "approval" ? wt(hi) : wt(_i, !1);
                                },
                                !0
                              );
                            }
                            b(bt, $t);
                          };
                          T(
                            gn,
                            (bt) => {
                              c(x).state === "held" ? bt(ci) : bt(di, !1);
                            },
                            !0
                          );
                        }
                        b(Je, Ut);
                      };
                      T(
                        _n,
                        (Je) => {
                          c(x).state === "current" || c(x).state === "checking" ? Je(pn) : Je(jt, !1);
                        },
                        !0
                      );
                    }
                    b(Se, Ft);
                  };
                  T(
                    Ie,
                    (Se) => {
                      c(x).state === "failed" ? Se(fe) : Se(mt, !1);
                    },
                    !0
                  );
                }
                b(he, Ne);
              };
              T(ge, (he) => {
                c(x).state === "done" ? he(at) : he(Xe, !1);
              });
            }
            var Me = B(Y, 2);
            {
              var Pt = (he) => {
                var Ne = yl(), Ie = k(Ne);
                A(
                  (fe) => {
                    $(Ne, 1, `mp-name ${fe ?? ""} ${c(x).state === "failed" && r() ? "text-danger" : ""}`, "svelte-12vk4m5"), E(Ne, "title", c(x).label), P(Ie, c(x).label);
                  },
                  [
                    () => r() && p.has(c(x).state) ? "t-ui-sm text-fg" : "t-meta text-fg-subtle"
                  ]
                ), b(he, Ne);
              };
              T(Me, (he) => {
                c(x).label && he(Pt);
              });
            }
            A((he) => $(Y, 1, `mp-disc ${he ?? ""}`, "svelte-12vk4m5"), [() => G(c(x).state)]), b(U, D);
          };
          T(F, (U) => {
            n() === "xs" ? U(j) : U(ne, !1);
          });
        }
        A(
          (U) => {
            E(L, "data-node", c(x).state), E(L, "data-step", o() ? void 0 : c(x).step ?? c(x).label), E(L, "data-state", o() ? void 0 : c(x).stepState ?? c(x).state), E(L, "title", U), I = He(L, "", I, { left: `${oe * c(h).pitch + c(d)}px` });
          },
          [
            () => o() ? void 0 : n() === "xs" ? re(c(x)) : c(x).title
          ]
        ), b(W, L);
      };
      T(M, (W) => {
        c(ie).fold ? W(q) : W(se, !1);
      });
    }
    b(S, te);
  }), A(() => {
    $(Z, 1, `mp mp-${n() ?? ""} ${i() ? "mp-dim" : ""} ${a() ? "mp-nu" : ""} ${v() ?? ""}`, "svelte-12vk4m5"), E(Z, "role", o() ? void 0 : "img"), E(Z, "aria-label", o() ? void 0 : c(C)), E(Z, "aria-hidden", o() ? "true" : void 0), E(Z, "data-pipeline", f()), E(Z, "data-size", n()), E(Z, "data-pitch", c(h).pitch), E(Z, "data-d", c(h).d), E(Z, "data-n", c(w).length), E(Z, "data-lead", c(d)), ue = He(Z, "", ue, {
      width: `${c(m) ?? ""}px`,
      height: `${(c(u) ? c(h).d + 28 : c(h).d) ?? ""}px`,
      "--d": `${c(h).d ?? ""}px`,
      "--pitch": `${c(h).pitch ?? ""}px`,
      "--line": `${c(h).line ?? ""}px`,
      "--lead": `${c(d) ?? ""}px`
    });
  }), b(e, Z), Re();
}
const Al = () => {
}, Tl = Symbol.for("kuberik-r42-atoms"), Ml = () => It(Tl) ?? { regions: !0, lead: !0, get progress() {
  return Al();
} };
var Nl = /* @__PURE__ */ ee('<line y1="4" y2="4" class="lb-wait svelte-hnsc61"><title> </title></line>'), Ll = /* @__PURE__ */ ee('<rect y="1" height="6" rx="1.5"><title> </title></rect>'), Ol = /* @__PURE__ */ ee('<line y1="4" y2="4" class="lb-rest svelte-hnsc61"></line>'), Rl = /* @__PURE__ */ ee('<svg height="8" role="img" data-lead-bar=""><!><!><!></svg>');
function Il(e, t) {
  Oe(t, !0);
  let n = N(t, "origin", 3, void 0), r = N(t, "width", 3, 160), i = N(t, "class", 3, "");
  const a = /* @__PURE__ */ Q(() => n() ?? t.hops[0]?.start ?? 0), l = (u) => Math.max(0, Math.min(r(), (u - c(a)) / Math.max(1, t.scaleMs) * r())), o = (u) => {
    const d = Math.round(u / 6e4);
    return d < 60 ? `${Math.max(1, d)}m` : `${Math.floor(d / 60)}h${d % 60 ? ` ${d % 60}m` : ""}`;
  }, s = /* @__PURE__ */ Q(() => t.hops.map((u, d) => {
    const m = l(u.start), y = Math.max(l(u.end), m + 3);
    return {
      ...u,
      a: m,
      w: y - m,
      last: d === t.hops.length - 1,
      title: `${u.tier}: ${o(u.end - u.start)}`
    };
  })), f = /* @__PURE__ */ Q(() => [
    ...n() != null && c(s)[0] ? [
      {
        a: 0,
        b: c(s)[0].a,
        title: `merged; first deploy ${o(t.hops[0].start - n())} later`
      }
    ] : [],
    ...t.hops.slice(1).map((u, d) => ({
      a: c(s)[d].a + c(s)[d].w,
      b: c(s)[d + 1].a,
      title: `waited ${o(u.start - t.hops[d].end)} before ${u.tier}`
    }))
  ].filter((u) => u.b - u.a > 1)), v = /* @__PURE__ */ Q(() => c(s).length ? c(s)[c(s).length - 1].a + c(s)[c(s).length - 1].w : 0);
  var h = Rl(), _ = k(h);
  Yt(_, 17, () => c(f), Yr, (u, d) => {
    var m = Nl(), y = k(m), C = k(y);
    A(() => {
      E(m, "x1", c(d).a), E(m, "x2", c(d).b), P(C, c(d).title);
    }), b(u, m);
  });
  var p = B(_);
  Yt(p, 17, () => c(s), (u) => u.tier + u.start, (u, d) => {
    var m = Ll();
    let y;
    var C = k(m), z = k(C);
    A(() => {
      E(m, "x", c(d).a), E(m, "width", c(d).w), y = $(m, 0, "lb-run svelte-hnsc61", null, y, { last: c(d).last }), P(z, c(d).title);
    }), b(u, m);
  });
  var w = B(p);
  {
    var g = (u) => {
      var d = Ol();
      A(() => {
        E(d, "x1", c(v)), E(d, "x2", r());
      }), b(u, d);
    };
    T(w, (u) => {
      c(v) < r() && u(g);
    });
  }
  A(
    (u) => {
      $(h, 0, `lb ${i() ?? ""}`, "svelte-hnsc61"), E(h, "width", r()), E(h, "viewBox", `0 0 ${r() ?? ""} 8`), E(h, "aria-label", `reached prod in ${u ?? ""}`);
    },
    [
      () => o((t.hops.at(-1)?.end ?? c(a)) - c(a))
    ]
  ), b(e, h), Re();
}
var Dl = /* @__PURE__ */ R('<span class="lr-pl t-meta svelte-9kjh2y"> </span>'), Pl = /* @__PURE__ */ R(' <span class="lr-left t-meta tabular-nums svelte-9kjh2y"> </span> ', 1), Fl = /* @__PURE__ */ R('<span class="lr-ld svelte-9kjh2y" data-state-word=""> </span><!> ', 1), jl = /* @__PURE__ */ R('<span class="lr-code first t-code-sm svelte-9kjh2y"> </span>'), Ul = /* @__PURE__ */ R('<span class="lr-code t-code-sm svelte-9kjh2y"> </span>'), Bl = /* @__PURE__ */ R("<!> <!>", 1), zl = /* @__PURE__ */ R('<!><span class="lr-lead-t tabular-nums svelte-9kjh2y"> <span class="lr-tp svelte-9kjh2y">to prod</span></span>', 1), Vl = /* @__PURE__ */ R('<span class="lr-ldw t-meta svelte-9kjh2y"><!></span>'), ql = /* @__PURE__ */ R('<li><div class="lr-in svelte-9kjh2y"><span class="lr-mk svelte-9kjh2y"><!></span> <div class="lr-id svelte-9kjh2y"><a> </a> <!></div> <span class="lr-dr svelte-9kjh2y"><!></span> <p class="lr-sn svelte-9kjh2y"><!></p> <!> <span class="lr-age t-meta svelte-9kjh2y"> </span></div></li>');
function ir(e, t) {
  Oe(t, !0);
  let n = N(
    t,
    "row",
    3,
    null
    /** the quiet flow (Changes' At rest): no mark / drawing tracks, the age auto-wide */
  ), r = N(t, "rest", 3, null), i = N(t, "dense", 3, !1);
  const a = /* @__PURE__ */ Q(() => n()?.href ?? r()?.href ?? "#"), l = Ml(), o = /* @__PURE__ */ Q(() => n() && n().mark === "checking" && l.progress ? l.progress.get(c(a).split("/").filter(Boolean).slice(2, 4).join("/")) ?? null : null), s = /* @__PURE__ */ Q(() => n()?.app ?? r()?.app ?? ""), f = /* @__PURE__ */ Q(() => n() ? n().place ? /^\d+ regions?$/.test(n().place) ? n().place.replace(/ (regions?)$/, ` ${n().tier} $1`) : `${n().tier}-${n().place}` : n().tier : "");
  var v = ql();
  Dt(
    v,
    (M) => ({
      class: "lr tap-zone",
      "data-key": n()?.key ?? r()?.key,
      ...M,
      [Ct]: {
        q: !!r(),
        dn: i(),
        hl: !!r() && r().lead !== void 0
      }
    }),
    [
      () => i() ? {} : {
        "data-truth-kind": n() ? "rollout" : "rest",
        "data-truth-app": c(s),
        "data-truth-href": c(a),
        "data-truth-group": n()?.row.group ?? "rest",
        ...n() ? ul(n().row) : { "data-truth-state": "healthy" }
      }
    ],
    void 0,
    void 0,
    "svelte-9kjh2y"
  );
  var h = k(v), _ = k(h), p = k(_);
  {
    var w = (M) => {
      {
        let q = /* @__PURE__ */ Q(() => c(o)?.fraction ?? null);
        Fs(M, {
          get state() {
            return n().mark;
          },
          get progress() {
            return c(q);
          }
        });
      }
    };
    T(p, (M) => {
      n() && M(w);
    });
  }
  var g = B(_, 2), u = k(g);
  let d;
  var m = k(u), y = B(u, 2);
  {
    var C = (M) => {
      {
        let q = /* @__PURE__ */ Q(() => dl(n().tier));
        fl(M, {
          role: "env",
          get theme() {
            return c(q);
          },
          get label() {
            return c(f);
          },
          wide: !0
        });
      }
    }, z = (M) => {
      var q = le(), se = H(q);
      {
        var W = (x) => {
          var L = Dl(), I = k(L);
          A(() => P(I, r().place)), b(x, L);
        };
        T(
          se,
          (x) => {
            r()?.place && x(W);
          },
          !0
        );
      }
      b(M, q);
    };
    T(y, (M) => {
      n() ? M(C) : M(z, !1);
    });
  }
  var G = B(g, 2), O = k(G);
  {
    var re = (M) => {
      Sl(M, {
        get nodes() {
          return n().nodes;
        },
        neutral: !0,
        get label() {
          return `${c(s) ?? ""} steps`;
        }
      });
    };
    T(O, (M) => {
      n() && M(re);
    });
  }
  var Z = B(G, 2), ue = k(Z);
  {
    var S = (M) => {
      var q = Fl(), se = H(q), W = k(se), x = B(se);
      {
        var L = (F) => {
          var j = Pl(), ne = H(j, !0);
          ne.nodeValue = " ";
          var U = B(ne), D = k(U), Y = B(U, 1, !0);
          Y.nodeValue = " ", A(() => P(D, c(o).words)), b(F, j);
        };
        T(x, (F) => {
          c(o)?.words && !n().row.stillChecking && F(L);
        });
      }
      var I = B(x, 1, !0);
      A(() => {
        P(W, n().lead), P(I, n().rest);
      }), b(M, q);
    }, ie = (M) => {
      var q = le(), se = H(q);
      {
        var W = (x) => {
          var L = Bl(), I = H(L);
          {
            var F = (D) => {
              var Y = jl(), ge = k(Y);
              A(() => P(ge, r().code)), b(D, Y);
            };
            T(I, (D) => {
              r().codeFirst && r().code && D(F);
            });
          }
          var j = B(I, 1, !0), ne = B(j);
          {
            var U = (D) => {
              var Y = Ul(), ge = k(Y);
              A(() => P(ge, r().code)), b(D, Y);
            };
            T(ne, (D) => {
              !r().codeFirst && r().code && D(U);
            });
          }
          A(() => P(j, r().sentence)), b(x, L);
        };
        T(
          se,
          (x) => {
            r() && x(W);
          },
          !0
        );
      }
      b(M, q);
    };
    T(ue, (M) => {
      n() ? M(S) : M(ie, !1);
    });
  }
  var oe = B(Z, 2);
  {
    var te = (M) => {
      var q = Vl(), se = k(q);
      {
        var W = (x) => {
          var L = zl(), I = H(L);
          Il(I, {
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
          var F = B(I), j = k(F);
          A(() => P(j, r().lead.total)), b(x, L);
        };
        T(se, (x) => {
          r().lead && x(W);
        });
      }
      A(() => E(q, "title", r().lead ? `${r().lead.total} to prod` : void 0)), b(M, q);
    };
    T(oe, (M) => {
      r() && r().lead !== void 0 && M(te);
    });
  }
  var X = B(oe, 2), J = k(X);
  A(() => {
    E(u, "href", c(a)), d = $(u, 1, "tap-link lr-nm svelte-9kjh2y", null, d, { rep: r()?.rep }), E(u, "aria-label", n() ? `${c(s)} in ${n().place ?? n().tier}` : `${c(s)} ${r()?.place}`), P(m, c(s)), P(J, n()?.age ?? r()?.age ?? "");
  }), b(e, v), Re();
}
var Gl = /* @__PURE__ */ R('<section class="lc-g" data-group="In flight"><div class="lc-gh"><span class="lc-gt">In flight</span><span class="lc-gn"> </span></div> <ul class="lc-rows"></ul></section> <section class="lc-g" data-group="At rest"><div class="lc-gh"><span class="lc-gt">At rest</span><span class="lc-gn"> </span></div> <ul class="lc-rows"></ul></section>', 1);
function Hl(e, t) {
  Oe(t, !0), ts(e, {
    children: (n, r) => {
      var i = Gl(), a = H(i), l = k(a), o = B(k(l)), s = k(o), f = B(l, 2);
      Yt(f, 21, () => t.moving, (g) => g.key, (g, u) => {
        ir(g, {
          get row() {
            return c(u);
          }
        });
      });
      var v = B(a, 2), h = k(v), _ = B(k(h)), p = k(_), w = B(h, 2);
      Yt(w, 21, () => t.rest, (g) => g.key, (g, u) => {
        ir(g, {
          get rest() {
            return c(u);
          }
        });
      }), A(() => {
        P(s, t.moving.length), P(p, t.rest.length);
      }), b(n, i);
    },
    $$slots: { default: !0 }
  }), Re();
}
const Ve = (e, t, n, r) => [
  { name: "Started", state: e },
  { name: "Stage 1", state: t },
  { name: "Stage 2", state: n },
  { name: "Check", state: r }
], ar = { tier: "dev", place: null, href: "/rollouts/hub/payments/payments-api-dev" }, sr = { tier: "staging", place: null, href: "/rollouts/hub/payments/payments-api-staging" }, rn = { tier: "prod", place: "eu-west", href: "/rollouts/hub/payments/payments-api-prod-eu-west" };
function et(e, t, n, r, i, a) {
  return {
    key: "payments-api",
    app: "payments-api",
    href: e.href,
    tier: e.tier,
    place: e.place,
    mark: n,
    nodes: ai(t, n === "deploying" ? "deploying" : "checking"),
    lead: r,
    rest: i,
    age: a,
    yours: !1,
    row: { group: n === "failed" ? "failed" : "moving" }
  };
}
const si = {
  key: "checkout-web",
  app: "checkout-web",
  href: "/rollouts/hub/shop/checkout-web-test",
  tier: "test",
  place: null,
  mark: "deploying",
  nodes: ai(Ve("done", "done", "active", "todo"), "deploying"),
  lead: "Deploying",
  rest: "v3.8.2 · step 3 of 4",
  age: "3m",
  yours: !1,
  row: { group: "moving" }
}, sn = (e, t, n, r, i = !1) => ({ key: e + t, app: e, href: "#", place: t, rep: i, sentence: "On the newest", code: n, age: r, tier: t }), li = [sn("billing-worker", "prod · eu-west", "v1.19.0", "2d"), sn("billing-worker", "prod · us-east", "v1.19.0", "2d", !0), sn("search-api", "prod", "v7.4.1", "5d")], Et = "v2.14.0", tt = (e, t = []) => ({ moving: [e, si], rest: [...t, ...li] }), oi = [
  { at: 0, state: tt(et(ar, Ve("active", "todo", "todo", "todo"), "deploying", "Deploying", `${Et} · dev`, "12s")) },
  { at: 1400, state: tt(et(ar, Ve("done", "done", "done", "active"), "checking", "Checking", `${Et} · health checks, 1 min left`, "1m")) },
  { at: 3e3, state: tt(et(sr, Ve("active", "todo", "todo", "todo"), "deploying", "Deploying", `${Et} · staging`, "4m")) },
  { at: 4400, state: tt(et(sr, Ve("done", "done", "done", "active"), "checking", "Checking", `${Et} · health checks, 2 min left`, "9m")) },
  { at: 6e3, state: tt(et(rn, Ve("done", "active", "todo", "todo"), "deploying", "Deploying", `${Et} · 1 of 3 prod steps`, "14m")) },
  { at: 7600, state: tt(et(rn, Ve("done", "done", "fail", "todo"), "failed", "Failing", `${Et} · p95 latency over limit`, "2m")) },
  { at: 9400, state: tt(et(rn, Ve("done", "done", "active", "todo"), "deploying", "Deploying", "v2.14.1 · fix, 2 of 3 prod steps", "40s")) },
  { at: 11e3, state: tt(et(rn, Ve("done", "done", "done", "active"), "checking", "Checking", "v2.14.1 · health checks, 1 min left", "3m")) },
  { at: 12600, state: { moving: [si], rest: [{ ...sn("payments-api", "prod · eu-west", "v2.14.1", "now"), key: "payments-api-rest" }, ...li] } }
], Kl = oi[0].state, Wl = 5, fi = {
  "rollouts-list": { component: Hl, initial: Kl, beats: oi, representative: Wl, restMs: 3200 }
};
class Yl {
  // ms into the cycle when paused/at startedAt
  constructor(t) {
    if (this.gates = { onscreen: !1, visible: !0, motion: !0 }, this.idx = -1, this.timer = null, this.startedAt = 0, this.pos = 0, this.tick = () => {
      this.timer = null;
      const { beats: n } = this.o, r = (this.pos + (this.o.now() - this.startedAt)) % this.cycleMs;
      let i = -1;
      for (let l = 0; l < n.length; l++) n[l].at <= r && (i = l);
      i !== this.idx && this.show(i);
      const a = i + 1 < n.length ? n[i + 1].at : this.cycleMs;
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
function Zl(e) {
  return st(e);
}
const ui = new URL(".", import.meta.url);
function Xl() {
  if (document.getElementById("kuberik-islands-fonts")) return;
  const e = (n) => new URL(`fonts/${n}`, ui).href, t = document.createElement("style");
  t.id = "kuberik-islands-fonts", t.textContent = `
@font-face{font-family:'Kuberik Inter';font-style:normal;font-display:swap;font-weight:100 900;src:url('${e("inter-latin-opsz.woff2")}') format('woff2-variations');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'Kuberik Inter';font-style:normal;font-display:swap;font-weight:100 900;src:url('${e("inter-latin-ext-opsz.woff2")}') format('woff2-variations');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:'Kuberik JetBrains Mono';font-style:normal;font-display:swap;font-weight:100 800;src:url('${e("jetbrains-mono-latin.woff2")}') format('woff2-variations')}`, document.head.appendChild(t);
}
let Jl = null;
const Ql = () => Jl ??= fetch(new URL("islands.css", ui)).then((e) => e.text()).then((e) => {
  const t = new CSSStyleSheet();
  return t.replaceSync(e), t;
}), $l = () => document.documentElement.classList.contains("dark"), an = matchMedia("(prefers-reduced-motion: reduce)");
async function eo(e) {
  const t = e.dataset.island, n = fi[t];
  if (!n) {
    console.warn(`island "${t}" is not registered`);
    return;
  }
  const r = e.shadowRoot ?? e.attachShadow({ mode: "open" });
  r.adoptedStyleSheets = [await Ql()];
  const i = document.createElement("div");
  if (i.className = "k-island", r.appendChild(i), e.hasAttribute("data-theme-sync")) {
    const f = () => i.classList.toggle("dark", $l());
    f(), new MutationObserver(f).observe(document.documentElement, { attributes: !0, attributeFilter: ["class"] });
  }
  const a = Zl(n.initial);
  Ua(n.component, { target: i, props: a });
  const l = new Yl({ beats: n.beats, restMs: n.restMs, representative: n.representative, apply: (f) => Object.assign(a, f) });
  l.setGate("motion", !an.matches), an.addEventListener("change", () => {
    l.setGate("motion", !an.matches), s();
  }), new IntersectionObserver((f) => l.setGate("onscreen", f[f.length - 1].isIntersecting), { rootMargin: "80px" }).observe(e), document.addEventListener("visibilitychange", () => l.setGate("visible", document.visibilityState === "visible"));
  let o = null;
  function s() {
    o?.remove(), o = null, an.matches && (o = document.createElement("div"), o.className = "k-island-ctl", o.innerHTML = '<button class="btn btn-secondary" type="button">Next step</button>', o.querySelector("button").addEventListener("click", () => l.next()), r.appendChild(o));
  }
  s(), e.__timeline = l;
}
function An(e = document) {
  Xl(), e.querySelectorAll("[data-island]:not([data-island-mounted])").forEach((t) => {
    t.setAttribute("data-island-mounted", ""), eo(t);
  });
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => An()) : An();
window.kuberikIslands = { mountAll: An, registry: fi };
export {
  An as mountAll
};
