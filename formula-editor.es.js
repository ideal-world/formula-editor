var na = Object.defineProperty;
var ra = (e, t, n) => t in e ? na(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var yn = (e, t, n) => (ra(e, typeof t != "symbol" ? t + "" : t, n), n);
import { shallowRef as bt, watchEffect as aa, readonly as oa, unref as m, getCurrentScope as sa, onScopeDispose as ia, getCurrentInstance as ae, onMounted as ot, nextTick as $e, watch as z, ref as E, warn as la, isVNode as zt, inject as V, computed as $, isRef as et, defineComponent as B, openBlock as A, createElementBlock as H, mergeProps as rn, renderSlot as Z, toRef as Vt, onUnmounted as hr, useSlots as St, Text as da, createBlock as q, resolveDynamicComponent as Se, withCtx as D, Fragment as Ve, normalizeClass as K, createCommentVNode as ce, provide as ve, reactive as tt, toRaw as Nn, createElementVNode as ue, withDirectives as Te, withModifiers as le, vModelCheckbox as mt, createTextVNode as je, toDisplayString as pe, normalizeStyle as st, toRefs as ua, Transition as ca, toHandlers as fa, onUpdated as pr, createVNode as T, vShow as yt, h as wn, resolveComponent as Oe, renderList as Nt, mergeDefaults as ha, defineCustomElement as pa } from "vue";
import { ElInput as kn } from "element-plus";
import { Loading as vr, ArrowLeft as va, ArrowRight as ga, Close as ba, Plus as ma, CaretRight as ya, VideoPlay as Na, EditPen as wa, Search as Cn } from "@element-plus/icons-vue";
import { MatchDecorator as ka, Decoration as _n, ViewPlugin as Ca, EditorView as _a, WidgetType as Sa, highlightSpecialChars as xa, drawSelection as Ea, keymap as $a } from "@codemirror/view";
import { syntaxTree as Ta, indentOnInput as Aa, syntaxHighlighting as Oa, defaultHighlightStyle as Pa, bracketMatching as Ia } from "@codemirror/language";
import { closeBrackets as Ma, autocompletion as Da } from "@codemirror/autocomplete";
import { highlightSelectionMatches as Ba } from "@codemirror/search";
import { history as La, defaultKeymap as Ra, historyKeymap as Ka } from "@codemirror/commands";
import Fa from "vue-codemirror6";
import { linter as ja } from "@codemirror/lint";
import * as za from "eslint-linter-browserify";
import { esLint as Va, javascript as Ha } from "@codemirror/lang-javascript";
var Ga = Object.defineProperty, Ua = Object.defineProperties, qa = Object.getOwnPropertyDescriptors, Sn = Object.getOwnPropertySymbols, Wa = Object.prototype.hasOwnProperty, Ya = Object.prototype.propertyIsEnumerable, xn = (e, t, n) => t in e ? Ga(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Ja = (e, t) => {
  for (var n in t || (t = {}))
    Wa.call(t, n) && xn(e, n, t[n]);
  if (Sn)
    for (var n of Sn(t))
      Ya.call(t, n) && xn(e, n, t[n]);
  return e;
}, Qa = (e, t) => Ua(e, qa(t));
function En(e, t) {
  var n;
  const r = bt();
  return aa(() => {
    r.value = e();
  }, Qa(Ja({}, t), {
    flush: (n = t == null ? void 0 : t.flush) != null ? n : "sync"
  })), oa(r);
}
var $n;
const xt = typeof window < "u", Xa = (e) => typeof e == "string", Za = () => {
};
xt && (($n = window == null ? void 0 : window.navigator) != null && $n.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function gr(e) {
  return typeof e == "function" ? e() : m(e);
}
function eo(e) {
  return e;
}
function br(e) {
  return sa() ? (ia(e), !0) : !1;
}
function to(e, t = !0) {
  ae() ? ot(e) : t ? e() : $e(e);
}
function mr(e) {
  var t;
  const n = gr(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const an = xt ? window : void 0, no = xt ? window.document : void 0;
function wt(...e) {
  let t, n, r, a;
  if (Xa(e[0]) || Array.isArray(e[0]) ? ([n, r, a] = e, t = an) : [t, n, r, a] = e, !t)
    return Za;
  Array.isArray(n) || (n = [n]), Array.isArray(r) || (r = [r]);
  const o = [], s = () => {
    o.forEach((p) => p()), o.length = 0;
  }, i = (p, b, g, c) => (p.addEventListener(b, g, c), () => p.removeEventListener(b, g, c)), h = z(() => [mr(t), gr(a)], ([p, b]) => {
    s(), p && o.push(...n.flatMap((g) => r.map((c) => i(p, g, c, b))));
  }, { immediate: !0, flush: "post" }), d = () => {
    h(), s();
  };
  return br(d), d;
}
function ro(e, t = !1) {
  const n = E(), r = () => n.value = !!e();
  return r(), to(r, t), n;
}
const Tn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, An = "__vueuse_ssr_handlers__";
Tn[An] = Tn[An] || {};
function ao({ document: e = no } = {}) {
  if (!e)
    return E("visible");
  const t = E(e.visibilityState);
  return wt(e, "visibilitychange", () => {
    t.value = e.visibilityState;
  }), t;
}
var On = Object.getOwnPropertySymbols, oo = Object.prototype.hasOwnProperty, so = Object.prototype.propertyIsEnumerable, io = (e, t) => {
  var n = {};
  for (var r in e)
    oo.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && On)
    for (var r of On(e))
      t.indexOf(r) < 0 && so.call(e, r) && (n[r] = e[r]);
  return n;
};
function yr(e, t, n = {}) {
  const r = n, { window: a = an } = r, o = io(r, ["window"]);
  let s;
  const i = ro(() => a && "ResizeObserver" in a), h = () => {
    s && (s.disconnect(), s = void 0);
  }, d = z(() => mr(e), (b) => {
    h(), i.value && a && b && (s = new ResizeObserver(t), s.observe(b, o));
  }, { immediate: !0, flush: "post" }), p = () => {
    h(), d();
  };
  return br(p), {
    isSupported: i,
    stop: p
  };
}
var Pn;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(Pn || (Pn = {}));
var lo = Object.defineProperty, In = Object.getOwnPropertySymbols, uo = Object.prototype.hasOwnProperty, co = Object.prototype.propertyIsEnumerable, Mn = (e, t, n) => t in e ? lo(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, fo = (e, t) => {
  for (var n in t || (t = {}))
    uo.call(t, n) && Mn(e, n, t[n]);
  if (In)
    for (var n of In(t))
      co.call(t, n) && Mn(e, n, t[n]);
  return e;
};
const ho = {
  easeInSine: [0.12, 0, 0.39, 0],
  easeOutSine: [0.61, 1, 0.88, 1],
  easeInOutSine: [0.37, 0, 0.63, 1],
  easeInQuad: [0.11, 0, 0.5, 0],
  easeOutQuad: [0.5, 1, 0.89, 1],
  easeInOutQuad: [0.45, 0, 0.55, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInQuart: [0.5, 0, 0.75, 0],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeInQuint: [0.64, 0, 0.78, 0],
  easeOutQuint: [0.22, 1, 0.36, 1],
  easeInOutQuint: [0.83, 0, 0.17, 1],
  easeInExpo: [0.7, 0, 0.84, 0],
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  easeInCirc: [0.55, 0, 1, 0.45],
  easeOutCirc: [0, 0.55, 0.45, 1],
  easeInOutCirc: [0.85, 0, 0.15, 1],
  easeInBack: [0.36, 0, 0.66, -0.56],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6]
};
fo({
  linear: eo
}, ho);
function po({ window: e = an } = {}) {
  if (!e)
    return E(!1);
  const t = E(e.document.hasFocus());
  return wt(e, "blur", () => {
    t.value = !1;
  }), wt(e, "focus", () => {
    t.value = !0;
  }), t;
}
process.env.NODE_ENV !== "production" && Object.freeze({});
process.env.NODE_ENV !== "production" && Object.freeze([]);
const vo = () => {
}, go = Object.prototype.hasOwnProperty, nt = (e, t) => go.call(e, t), xe = Array.isArray, bo = (e) => typeof e == "function", Le = (e) => typeof e == "string", it = (e) => e !== null && typeof e == "object", mo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, yo = mo(
  (e) => e.charAt(0).toUpperCase() + e.slice(1)
);
var No = typeof global == "object" && global && global.Object === Object && global;
const Nr = No;
var wo = typeof self == "object" && self && self.Object === Object && self, ko = Nr || wo || Function("return this")();
const be = ko;
var Co = be.Symbol;
const fe = Co;
var wr = Object.prototype, _o = wr.hasOwnProperty, So = wr.toString, Xe = fe ? fe.toStringTag : void 0;
function xo(e) {
  var t = _o.call(e, Xe), n = e[Xe];
  try {
    e[Xe] = void 0;
    var r = !0;
  } catch {
  }
  var a = So.call(e);
  return r && (t ? e[Xe] = n : delete e[Xe]), a;
}
var Eo = Object.prototype, $o = Eo.toString;
function To(e) {
  return $o.call(e);
}
var Ao = "[object Null]", Oo = "[object Undefined]", Dn = fe ? fe.toStringTag : void 0;
function qe(e) {
  return e == null ? e === void 0 ? Oo : Ao : Dn && Dn in Object(e) ? xo(e) : To(e);
}
function He(e) {
  return e != null && typeof e == "object";
}
var Po = "[object Symbol]";
function on(e) {
  return typeof e == "symbol" || He(e) && qe(e) == Po;
}
function Io(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length, a = Array(r); ++n < r; )
    a[n] = t(e[n], n, e);
  return a;
}
var Mo = Array.isArray;
const ge = Mo;
var Do = 1 / 0, Bn = fe ? fe.prototype : void 0, Ln = Bn ? Bn.toString : void 0;
function kr(e) {
  if (typeof e == "string")
    return e;
  if (ge(e))
    return Io(e, kr) + "";
  if (on(e))
    return Ln ? Ln.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -Do ? "-0" : t;
}
function kt(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
function Bo(e) {
  return e;
}
var Lo = "[object AsyncFunction]", Ro = "[object Function]", Ko = "[object GeneratorFunction]", Fo = "[object Proxy]";
function Cr(e) {
  if (!kt(e))
    return !1;
  var t = qe(e);
  return t == Ro || t == Ko || t == Lo || t == Fo;
}
var jo = be["__core-js_shared__"];
const It = jo;
var Rn = function() {
  var e = /[^.]+$/.exec(It && It.keys && It.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}();
function zo(e) {
  return !!Rn && Rn in e;
}
var Vo = Function.prototype, Ho = Vo.toString;
function Ke(e) {
  if (e != null) {
    try {
      return Ho.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
var Go = /[\\^$.*+?()[\]{}|]/g, Uo = /^\[object .+?Constructor\]$/, qo = Function.prototype, Wo = Object.prototype, Yo = qo.toString, Jo = Wo.hasOwnProperty, Qo = RegExp(
  "^" + Yo.call(Jo).replace(Go, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function Xo(e) {
  if (!kt(e) || zo(e))
    return !1;
  var t = Cr(e) ? Qo : Uo;
  return t.test(Ke(e));
}
function Zo(e, t) {
  return e == null ? void 0 : e[t];
}
function Fe(e, t) {
  var n = Zo(e, t);
  return Xo(n) ? n : void 0;
}
var es = Fe(be, "WeakMap");
const Ht = es;
function ts(e, t, n) {
  switch (n.length) {
    case 0:
      return e.call(t);
    case 1:
      return e.call(t, n[0]);
    case 2:
      return e.call(t, n[0], n[1]);
    case 3:
      return e.call(t, n[0], n[1], n[2]);
  }
  return e.apply(t, n);
}
var ns = 800, rs = 16, as = Date.now;
function os(e) {
  var t = 0, n = 0;
  return function() {
    var r = as(), a = rs - (r - n);
    if (n = r, a > 0) {
      if (++t >= ns)
        return arguments[0];
    } else
      t = 0;
    return e.apply(void 0, arguments);
  };
}
function ss(e) {
  return function() {
    return e;
  };
}
var is = function() {
  try {
    var e = Fe(Object, "defineProperty");
    return e({}, "", {}), e;
  } catch {
  }
}();
const Ct = is;
var ls = Ct ? function(e, t) {
  return Ct(e, "toString", {
    configurable: !0,
    enumerable: !1,
    value: ss(t),
    writable: !0
  });
} : Bo;
const ds = ls;
var us = os(ds);
const cs = us;
var fs = 9007199254740991, hs = /^(?:0|[1-9]\d*)$/;
function sn(e, t) {
  var n = typeof e;
  return t = t ?? fs, !!t && (n == "number" || n != "symbol" && hs.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
function ps(e, t, n) {
  t == "__proto__" && Ct ? Ct(e, t, {
    configurable: !0,
    enumerable: !0,
    value: n,
    writable: !0
  }) : e[t] = n;
}
function ln(e, t) {
  return e === t || e !== e && t !== t;
}
var vs = Object.prototype, gs = vs.hasOwnProperty;
function bs(e, t, n) {
  var r = e[t];
  (!(gs.call(e, t) && ln(r, n)) || n === void 0 && !(t in e)) && ps(e, t, n);
}
var Kn = Math.max;
function ms(e, t, n) {
  return t = Kn(t === void 0 ? e.length - 1 : t, 0), function() {
    for (var r = arguments, a = -1, o = Kn(r.length - t, 0), s = Array(o); ++a < o; )
      s[a] = r[t + a];
    a = -1;
    for (var i = Array(t + 1); ++a < t; )
      i[a] = r[a];
    return i[t] = n(s), ts(e, this, i);
  };
}
var ys = 9007199254740991;
function dn(e) {
  return typeof e == "number" && e > -1 && e % 1 == 0 && e <= ys;
}
function Ns(e) {
  return e != null && dn(e.length) && !Cr(e);
}
var ws = Object.prototype;
function ks(e) {
  var t = e && e.constructor, n = typeof t == "function" && t.prototype || ws;
  return e === n;
}
function Cs(e, t) {
  for (var n = -1, r = Array(e); ++n < e; )
    r[n] = t(n);
  return r;
}
var _s = "[object Arguments]";
function Fn(e) {
  return He(e) && qe(e) == _s;
}
var _r = Object.prototype, Ss = _r.hasOwnProperty, xs = _r.propertyIsEnumerable, Es = Fn(function() {
  return arguments;
}()) ? Fn : function(e) {
  return He(e) && Ss.call(e, "callee") && !xs.call(e, "callee");
};
const un = Es;
function $s() {
  return !1;
}
var Sr = typeof exports == "object" && exports && !exports.nodeType && exports, jn = Sr && typeof module == "object" && module && !module.nodeType && module, Ts = jn && jn.exports === Sr, zn = Ts ? be.Buffer : void 0, As = zn ? zn.isBuffer : void 0, Os = As || $s;
const Gt = Os;
var Ps = "[object Arguments]", Is = "[object Array]", Ms = "[object Boolean]", Ds = "[object Date]", Bs = "[object Error]", Ls = "[object Function]", Rs = "[object Map]", Ks = "[object Number]", Fs = "[object Object]", js = "[object RegExp]", zs = "[object Set]", Vs = "[object String]", Hs = "[object WeakMap]", Gs = "[object ArrayBuffer]", Us = "[object DataView]", qs = "[object Float32Array]", Ws = "[object Float64Array]", Ys = "[object Int8Array]", Js = "[object Int16Array]", Qs = "[object Int32Array]", Xs = "[object Uint8Array]", Zs = "[object Uint8ClampedArray]", ei = "[object Uint16Array]", ti = "[object Uint32Array]", j = {};
j[qs] = j[Ws] = j[Ys] = j[Js] = j[Qs] = j[Xs] = j[Zs] = j[ei] = j[ti] = !0;
j[Ps] = j[Is] = j[Gs] = j[Ms] = j[Us] = j[Ds] = j[Bs] = j[Ls] = j[Rs] = j[Ks] = j[Fs] = j[js] = j[zs] = j[Vs] = j[Hs] = !1;
function ni(e) {
  return He(e) && dn(e.length) && !!j[qe(e)];
}
function ri(e) {
  return function(t) {
    return e(t);
  };
}
var xr = typeof exports == "object" && exports && !exports.nodeType && exports, Ze = xr && typeof module == "object" && module && !module.nodeType && module, ai = Ze && Ze.exports === xr, Mt = ai && Nr.process, oi = function() {
  try {
    var e = Ze && Ze.require && Ze.require("util").types;
    return e || Mt && Mt.binding && Mt.binding("util");
  } catch {
  }
}();
const Vn = oi;
var Hn = Vn && Vn.isTypedArray, si = Hn ? ri(Hn) : ni;
const Er = si;
var ii = Object.prototype, li = ii.hasOwnProperty;
function di(e, t) {
  var n = ge(e), r = !n && un(e), a = !n && !r && Gt(e), o = !n && !r && !a && Er(e), s = n || r || a || o, i = s ? Cs(e.length, String) : [], h = i.length;
  for (var d in e)
    (t || li.call(e, d)) && !(s && // Safari 9 has enumerable `arguments.length` in strict mode.
    (d == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    a && (d == "offset" || d == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    o && (d == "buffer" || d == "byteLength" || d == "byteOffset") || // Skip index properties.
    sn(d, h))) && i.push(d);
  return i;
}
function ui(e, t) {
  return function(n) {
    return e(t(n));
  };
}
var ci = ui(Object.keys, Object);
const fi = ci;
var hi = Object.prototype, pi = hi.hasOwnProperty;
function vi(e) {
  if (!ks(e))
    return fi(e);
  var t = [];
  for (var n in Object(e))
    pi.call(e, n) && n != "constructor" && t.push(n);
  return t;
}
function gi(e) {
  return Ns(e) ? di(e) : vi(e);
}
var bi = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, mi = /^\w*$/;
function yi(e, t) {
  if (ge(e))
    return !1;
  var n = typeof e;
  return n == "number" || n == "symbol" || n == "boolean" || e == null || on(e) ? !0 : mi.test(e) || !bi.test(e) || t != null && e in Object(t);
}
var Ni = Fe(Object, "create");
const rt = Ni;
function wi() {
  this.__data__ = rt ? rt(null) : {}, this.size = 0;
}
function ki(e) {
  var t = this.has(e) && delete this.__data__[e];
  return this.size -= t ? 1 : 0, t;
}
var Ci = "__lodash_hash_undefined__", _i = Object.prototype, Si = _i.hasOwnProperty;
function xi(e) {
  var t = this.__data__;
  if (rt) {
    var n = t[e];
    return n === Ci ? void 0 : n;
  }
  return Si.call(t, e) ? t[e] : void 0;
}
var Ei = Object.prototype, $i = Ei.hasOwnProperty;
function Ti(e) {
  var t = this.__data__;
  return rt ? t[e] !== void 0 : $i.call(t, e);
}
var Ai = "__lodash_hash_undefined__";
function Oi(e, t) {
  var n = this.__data__;
  return this.size += this.has(e) ? 0 : 1, n[e] = rt && t === void 0 ? Ai : t, this;
}
function Re(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
Re.prototype.clear = wi;
Re.prototype.delete = ki;
Re.prototype.get = xi;
Re.prototype.has = Ti;
Re.prototype.set = Oi;
function Pi() {
  this.__data__ = [], this.size = 0;
}
function Et(e, t) {
  for (var n = e.length; n--; )
    if (ln(e[n][0], t))
      return n;
  return -1;
}
var Ii = Array.prototype, Mi = Ii.splice;
function Di(e) {
  var t = this.__data__, n = Et(t, e);
  if (n < 0)
    return !1;
  var r = t.length - 1;
  return n == r ? t.pop() : Mi.call(t, n, 1), --this.size, !0;
}
function Bi(e) {
  var t = this.__data__, n = Et(t, e);
  return n < 0 ? void 0 : t[n][1];
}
function Li(e) {
  return Et(this.__data__, e) > -1;
}
function Ri(e, t) {
  var n = this.__data__, r = Et(n, e);
  return r < 0 ? (++this.size, n.push([e, t])) : n[r][1] = t, this;
}
function me(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
me.prototype.clear = Pi;
me.prototype.delete = Di;
me.prototype.get = Bi;
me.prototype.has = Li;
me.prototype.set = Ri;
var Ki = Fe(be, "Map");
const at = Ki;
function Fi() {
  this.size = 0, this.__data__ = {
    hash: new Re(),
    map: new (at || me)(),
    string: new Re()
  };
}
function ji(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function $t(e, t) {
  var n = e.__data__;
  return ji(t) ? n[typeof t == "string" ? "string" : "hash"] : n.map;
}
function zi(e) {
  var t = $t(this, e).delete(e);
  return this.size -= t ? 1 : 0, t;
}
function Vi(e) {
  return $t(this, e).get(e);
}
function Hi(e) {
  return $t(this, e).has(e);
}
function Gi(e, t) {
  var n = $t(this, e), r = n.size;
  return n.set(e, t), this.size += n.size == r ? 0 : 1, this;
}
function ye(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
ye.prototype.clear = Fi;
ye.prototype.delete = zi;
ye.prototype.get = Vi;
ye.prototype.has = Hi;
ye.prototype.set = Gi;
var Ui = "Expected a function";
function cn(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function")
    throw new TypeError(Ui);
  var n = function() {
    var r = arguments, a = t ? t.apply(this, r) : r[0], o = n.cache;
    if (o.has(a))
      return o.get(a);
    var s = e.apply(this, r);
    return n.cache = o.set(a, s) || o, s;
  };
  return n.cache = new (cn.Cache || ye)(), n;
}
cn.Cache = ye;
var qi = 500;
function Wi(e) {
  var t = cn(e, function(r) {
    return n.size === qi && n.clear(), r;
  }), n = t.cache;
  return t;
}
var Yi = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Ji = /\\(\\)?/g, Qi = Wi(function(e) {
  var t = [];
  return e.charCodeAt(0) === 46 && t.push(""), e.replace(Yi, function(n, r, a, o) {
    t.push(a ? o.replace(Ji, "$1") : r || n);
  }), t;
});
const Xi = Qi;
function Zi(e) {
  return e == null ? "" : kr(e);
}
function Tt(e, t) {
  return ge(e) ? e : yi(e, t) ? [e] : Xi(Zi(e));
}
var el = 1 / 0;
function fn(e) {
  if (typeof e == "string" || on(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -el ? "-0" : t;
}
function $r(e, t) {
  t = Tt(t, e);
  for (var n = 0, r = t.length; e != null && n < r; )
    e = e[fn(t[n++])];
  return n && n == r ? e : void 0;
}
function tl(e, t, n) {
  var r = e == null ? void 0 : $r(e, t);
  return r === void 0 ? n : r;
}
function Tr(e, t) {
  for (var n = -1, r = t.length, a = e.length; ++n < r; )
    e[a + n] = t[n];
  return e;
}
var Gn = fe ? fe.isConcatSpreadable : void 0;
function nl(e) {
  return ge(e) || un(e) || !!(Gn && e && e[Gn]);
}
function Ar(e, t, n, r, a) {
  var o = -1, s = e.length;
  for (n || (n = nl), a || (a = []); ++o < s; ) {
    var i = e[o];
    t > 0 && n(i) ? t > 1 ? Ar(i, t - 1, n, r, a) : Tr(a, i) : r || (a[a.length] = i);
  }
  return a;
}
function rl(e) {
  var t = e == null ? 0 : e.length;
  return t ? Ar(e, 1) : [];
}
function al(e) {
  return cs(ms(e, void 0, rl), e + "");
}
function ol() {
  this.__data__ = new me(), this.size = 0;
}
function sl(e) {
  var t = this.__data__, n = t.delete(e);
  return this.size = t.size, n;
}
function il(e) {
  return this.__data__.get(e);
}
function ll(e) {
  return this.__data__.has(e);
}
var dl = 200;
function ul(e, t) {
  var n = this.__data__;
  if (n instanceof me) {
    var r = n.__data__;
    if (!at || r.length < dl - 1)
      return r.push([e, t]), this.size = ++n.size, this;
    n = this.__data__ = new ye(r);
  }
  return n.set(e, t), this.size = n.size, this;
}
function Ee(e) {
  var t = this.__data__ = new me(e);
  this.size = t.size;
}
Ee.prototype.clear = ol;
Ee.prototype.delete = sl;
Ee.prototype.get = il;
Ee.prototype.has = ll;
Ee.prototype.set = ul;
function cl(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length, a = 0, o = []; ++n < r; ) {
    var s = e[n];
    t(s, n, e) && (o[a++] = s);
  }
  return o;
}
function fl() {
  return [];
}
var hl = Object.prototype, pl = hl.propertyIsEnumerable, Un = Object.getOwnPropertySymbols, vl = Un ? function(e) {
  return e == null ? [] : (e = Object(e), cl(Un(e), function(t) {
    return pl.call(e, t);
  }));
} : fl;
const gl = vl;
function bl(e, t, n) {
  var r = t(e);
  return ge(e) ? r : Tr(r, n(e));
}
function qn(e) {
  return bl(e, gi, gl);
}
var ml = Fe(be, "DataView");
const Ut = ml;
var yl = Fe(be, "Promise");
const qt = yl;
var Nl = Fe(be, "Set");
const Wt = Nl;
var Wn = "[object Map]", wl = "[object Object]", Yn = "[object Promise]", Jn = "[object Set]", Qn = "[object WeakMap]", Xn = "[object DataView]", kl = Ke(Ut), Cl = Ke(at), _l = Ke(qt), Sl = Ke(Wt), xl = Ke(Ht), Pe = qe;
(Ut && Pe(new Ut(new ArrayBuffer(1))) != Xn || at && Pe(new at()) != Wn || qt && Pe(qt.resolve()) != Yn || Wt && Pe(new Wt()) != Jn || Ht && Pe(new Ht()) != Qn) && (Pe = function(e) {
  var t = qe(e), n = t == wl ? e.constructor : void 0, r = n ? Ke(n) : "";
  if (r)
    switch (r) {
      case kl:
        return Xn;
      case Cl:
        return Wn;
      case _l:
        return Yn;
      case Sl:
        return Jn;
      case xl:
        return Qn;
    }
  return t;
});
const Zn = Pe;
var El = be.Uint8Array;
const er = El;
var $l = "__lodash_hash_undefined__";
function Tl(e) {
  return this.__data__.set(e, $l), this;
}
function Al(e) {
  return this.__data__.has(e);
}
function _t(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.__data__ = new ye(); ++t < n; )
    this.add(e[t]);
}
_t.prototype.add = _t.prototype.push = Tl;
_t.prototype.has = Al;
function Ol(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r; )
    if (t(e[n], n, e))
      return !0;
  return !1;
}
function Pl(e, t) {
  return e.has(t);
}
var Il = 1, Ml = 2;
function Or(e, t, n, r, a, o) {
  var s = n & Il, i = e.length, h = t.length;
  if (i != h && !(s && h > i))
    return !1;
  var d = o.get(e), p = o.get(t);
  if (d && p)
    return d == t && p == e;
  var b = -1, g = !0, c = n & Ml ? new _t() : void 0;
  for (o.set(e, t), o.set(t, e); ++b < i; ) {
    var l = e[b], u = t[b];
    if (r)
      var v = s ? r(u, l, b, t, e, o) : r(l, u, b, e, t, o);
    if (v !== void 0) {
      if (v)
        continue;
      g = !1;
      break;
    }
    if (c) {
      if (!Ol(t, function(f, k) {
        if (!Pl(c, k) && (l === f || a(l, f, n, r, o)))
          return c.push(k);
      })) {
        g = !1;
        break;
      }
    } else if (!(l === u || a(l, u, n, r, o))) {
      g = !1;
      break;
    }
  }
  return o.delete(e), o.delete(t), g;
}
function Dl(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(r, a) {
    n[++t] = [a, r];
  }), n;
}
function Bl(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(r) {
    n[++t] = r;
  }), n;
}
var Ll = 1, Rl = 2, Kl = "[object Boolean]", Fl = "[object Date]", jl = "[object Error]", zl = "[object Map]", Vl = "[object Number]", Hl = "[object RegExp]", Gl = "[object Set]", Ul = "[object String]", ql = "[object Symbol]", Wl = "[object ArrayBuffer]", Yl = "[object DataView]", tr = fe ? fe.prototype : void 0, Dt = tr ? tr.valueOf : void 0;
function Jl(e, t, n, r, a, o, s) {
  switch (n) {
    case Yl:
      if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
        return !1;
      e = e.buffer, t = t.buffer;
    case Wl:
      return !(e.byteLength != t.byteLength || !o(new er(e), new er(t)));
    case Kl:
    case Fl:
    case Vl:
      return ln(+e, +t);
    case jl:
      return e.name == t.name && e.message == t.message;
    case Hl:
    case Ul:
      return e == t + "";
    case zl:
      var i = Dl;
    case Gl:
      var h = r & Ll;
      if (i || (i = Bl), e.size != t.size && !h)
        return !1;
      var d = s.get(e);
      if (d)
        return d == t;
      r |= Rl, s.set(e, t);
      var p = Or(i(e), i(t), r, a, o, s);
      return s.delete(e), p;
    case ql:
      if (Dt)
        return Dt.call(e) == Dt.call(t);
  }
  return !1;
}
var Ql = 1, Xl = Object.prototype, Zl = Xl.hasOwnProperty;
function ed(e, t, n, r, a, o) {
  var s = n & Ql, i = qn(e), h = i.length, d = qn(t), p = d.length;
  if (h != p && !s)
    return !1;
  for (var b = h; b--; ) {
    var g = i[b];
    if (!(s ? g in t : Zl.call(t, g)))
      return !1;
  }
  var c = o.get(e), l = o.get(t);
  if (c && l)
    return c == t && l == e;
  var u = !0;
  o.set(e, t), o.set(t, e);
  for (var v = s; ++b < h; ) {
    g = i[b];
    var f = e[g], k = t[g];
    if (r)
      var y = s ? r(k, f, g, t, e, o) : r(f, k, g, e, t, o);
    if (!(y === void 0 ? f === k || a(f, k, n, r, o) : y)) {
      u = !1;
      break;
    }
    v || (v = g == "constructor");
  }
  if (u && !v) {
    var _ = e.constructor, N = t.constructor;
    _ != N && "constructor" in e && "constructor" in t && !(typeof _ == "function" && _ instanceof _ && typeof N == "function" && N instanceof N) && (u = !1);
  }
  return o.delete(e), o.delete(t), u;
}
var td = 1, nr = "[object Arguments]", rr = "[object Array]", dt = "[object Object]", nd = Object.prototype, ar = nd.hasOwnProperty;
function rd(e, t, n, r, a, o) {
  var s = ge(e), i = ge(t), h = s ? rr : Zn(e), d = i ? rr : Zn(t);
  h = h == nr ? dt : h, d = d == nr ? dt : d;
  var p = h == dt, b = d == dt, g = h == d;
  if (g && Gt(e)) {
    if (!Gt(t))
      return !1;
    s = !0, p = !1;
  }
  if (g && !p)
    return o || (o = new Ee()), s || Er(e) ? Or(e, t, n, r, a, o) : Jl(e, t, h, n, r, a, o);
  if (!(n & td)) {
    var c = p && ar.call(e, "__wrapped__"), l = b && ar.call(t, "__wrapped__");
    if (c || l) {
      var u = c ? e.value() : e, v = l ? t.value() : t;
      return o || (o = new Ee()), a(u, v, n, r, o);
    }
  }
  return g ? (o || (o = new Ee()), ed(e, t, n, r, a, o)) : !1;
}
function Pr(e, t, n, r, a) {
  return e === t ? !0 : e == null || t == null || !He(e) && !He(t) ? e !== e && t !== t : rd(e, t, n, r, Pr, a);
}
function ad(e, t) {
  return e != null && t in Object(e);
}
function od(e, t, n) {
  t = Tt(t, e);
  for (var r = -1, a = t.length, o = !1; ++r < a; ) {
    var s = fn(t[r]);
    if (!(o = e != null && n(e, s)))
      break;
    e = e[s];
  }
  return o || ++r != a ? o : (a = e == null ? 0 : e.length, !!a && dn(a) && sn(s, a) && (ge(e) || un(e)));
}
function sd(e, t) {
  return e != null && od(e, t, ad);
}
function id(e) {
  for (var t = -1, n = e == null ? 0 : e.length, r = {}; ++t < n; ) {
    var a = e[t];
    r[a[0]] = a[1];
  }
  return r;
}
function ld(e, t) {
  return Pr(e, t);
}
function dd(e, t, n, r) {
  if (!kt(e))
    return e;
  t = Tt(t, e);
  for (var a = -1, o = t.length, s = o - 1, i = e; i != null && ++a < o; ) {
    var h = fn(t[a]), d = n;
    if (h === "__proto__" || h === "constructor" || h === "prototype")
      return e;
    if (a != s) {
      var p = i[h];
      d = r ? r(p, h, i) : void 0, d === void 0 && (d = kt(p) ? p : sn(t[a + 1]) ? [] : {});
    }
    bs(i, h, d), i = i[h];
  }
  return e;
}
function ud(e, t, n) {
  for (var r = -1, a = t.length, o = {}; ++r < a; ) {
    var s = t[r], i = $r(e, s);
    n(i, s) && dd(o, Tt(s, e), i);
  }
  return o;
}
function cd(e, t) {
  return ud(e, t, function(n, r) {
    return sd(e, r);
  });
}
var fd = al(function(e, t) {
  return e == null ? {} : cd(e, t);
});
const hd = fd, Ge = (e) => e === void 0, Yt = (e) => typeof e == "boolean", Ue = (e) => typeof e == "number", pd = (e) => Le(e) ? !Number.isNaN(Number(e)) : !1, Ce = (e) => yo(e);
class Ir extends Error {
  constructor(t) {
    super(t), this.name = "ElementPlusError";
  }
}
function hn(e, t) {
  throw new Ir(`[${e}] ${t}`);
}
function We(e, t) {
  if (process.env.NODE_ENV !== "production") {
    const n = Le(e) ? new Ir(`[${e}] ${t}`) : e;
    console.warn(n);
  }
}
const vd = "utils/dom/style", Mr = (e = "") => e.split(" ").filter((t) => !!t.trim()), gd = (e, t) => {
  !e || !t.trim() || e.classList.add(...Mr(t));
}, Bt = (e, t) => {
  !e || !t.trim() || e.classList.remove(...Mr(t));
};
function bd(e, t = "px") {
  if (!e)
    return "";
  if (Ue(e) || pd(e))
    return `${e}${t}`;
  if (Le(e))
    return e;
  We(vd, "binding value must be a string or number");
}
const Dr = "__epPropKey", oe = (e) => e, md = (e) => it(e) && !!e[Dr], Br = (e, t) => {
  if (!it(e) || md(e))
    return e;
  const { values: n, required: r, default: a, type: o, validator: s } = e, h = {
    type: o,
    required: !!r,
    validator: n || s ? (d) => {
      let p = !1, b = [];
      if (n && (b = Array.from(n), nt(e, "default") && b.push(a), p || (p = b.includes(d))), s && (p || (p = s(d))), !p && b.length > 0) {
        const g = [...new Set(b)].map((c) => JSON.stringify(c)).join(", ");
        la(`Invalid prop: validation failed${t ? ` for prop "${t}"` : ""}. Expected one of [${g}], got value ${JSON.stringify(d)}.`);
      }
      return p;
    } : void 0,
    [Dr]: !0
  };
  return nt(e, "default") && (h.default = a), h;
}, Ne = (e) => id(Object.entries(e).map(([t, n]) => [
  t,
  Br(n, t)
])), Jt = oe([
  String,
  Object,
  Function
]), Ye = (e, t) => {
  if (e.install = (n) => {
    for (const r of [e, ...Object.values(t ?? {})])
      n.component(r.name, r);
  }, t)
    for (const [n, r] of Object.entries(t))
      e[n] = r;
  return e;
}, At = (e) => (e.install = vo, e), de = {
  tab: "Tab",
  enter: "Enter",
  space: "Space",
  left: "ArrowLeft",
  up: "ArrowUp",
  right: "ArrowRight",
  down: "ArrowDown",
  esc: "Escape",
  delete: "Delete",
  backspace: "Backspace",
  numpadEnter: "NumpadEnter",
  pageUp: "PageUp",
  pageDown: "PageDown",
  home: "Home",
  end: "End"
}, Je = "update:modelValue", yd = ["", "default", "small", "large"], ht = (e) => {
  const t = xe(e) ? e : [e], n = [];
  return t.forEach((r) => {
    var a;
    xe(r) ? n.push(...ht(r)) : zt(r) && xe(r.children) ? n.push(...ht(r.children)) : (n.push(r), zt(r) && ((a = r.component) != null && a.subTree) && n.push(...ht(r.component.subTree)));
  }), n;
}, Ie = (e) => e, Lr = ({ from: e, replacement: t, scope: n, version: r, ref: a, type: o = "API" }, s) => {
  z(() => m(s), (i) => {
    i && We(n, `[${o}] ${e} is about to be deprecated in version ${r}, please use ${t} instead.
For more detail, please visit: ${a}
`);
  }, {
    immediate: !0
  });
};
var Nd = {
  name: "en",
  el: {
    colorpicker: {
      confirm: "OK",
      clear: "Clear",
      defaultLabel: "color picker",
      description: "current color is {color}. press enter to select a new color."
    },
    datepicker: {
      now: "Now",
      today: "Today",
      cancel: "Cancel",
      clear: "Clear",
      confirm: "OK",
      dateTablePrompt: "Use the arrow keys and enter to select the day of the month",
      monthTablePrompt: "Use the arrow keys and enter to select the month",
      yearTablePrompt: "Use the arrow keys and enter to select the year",
      selectedDate: "Selected date",
      selectDate: "Select date",
      selectTime: "Select time",
      startDate: "Start Date",
      startTime: "Start Time",
      endDate: "End Date",
      endTime: "End Time",
      prevYear: "Previous Year",
      nextYear: "Next Year",
      prevMonth: "Previous Month",
      nextMonth: "Next Month",
      year: "",
      month1: "January",
      month2: "February",
      month3: "March",
      month4: "April",
      month5: "May",
      month6: "June",
      month7: "July",
      month8: "August",
      month9: "September",
      month10: "October",
      month11: "November",
      month12: "December",
      week: "week",
      weeks: {
        sun: "Sun",
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat"
      },
      weeksFull: {
        sun: "Sunday",
        mon: "Monday",
        tue: "Tuesday",
        wed: "Wednesday",
        thu: "Thursday",
        fri: "Friday",
        sat: "Saturday"
      },
      months: {
        jan: "Jan",
        feb: "Feb",
        mar: "Mar",
        apr: "Apr",
        may: "May",
        jun: "Jun",
        jul: "Jul",
        aug: "Aug",
        sep: "Sep",
        oct: "Oct",
        nov: "Nov",
        dec: "Dec"
      }
    },
    inputNumber: {
      decrease: "decrease number",
      increase: "increase number"
    },
    select: {
      loading: "Loading",
      noMatch: "No matching data",
      noData: "No data",
      placeholder: "Select"
    },
    dropdown: {
      toggleDropdown: "Toggle Dropdown"
    },
    cascader: {
      noMatch: "No matching data",
      loading: "Loading",
      placeholder: "Select",
      noData: "No data"
    },
    pagination: {
      goto: "Go to",
      pagesize: "/page",
      total: "Total {total}",
      pageClassifier: "",
      page: "Page",
      prev: "Go to previous page",
      next: "Go to next page",
      currentPage: "page {pager}",
      prevPages: "Previous {pager} pages",
      nextPages: "Next {pager} pages",
      deprecationWarning: "Deprecated usages detected, please refer to the el-pagination documentation for more details"
    },
    dialog: {
      close: "Close this dialog"
    },
    drawer: {
      close: "Close this dialog"
    },
    messagebox: {
      title: "Message",
      confirm: "OK",
      cancel: "Cancel",
      error: "Illegal input",
      close: "Close this dialog"
    },
    upload: {
      deleteTip: "press delete to remove",
      delete: "Delete",
      preview: "Preview",
      continue: "Continue"
    },
    slider: {
      defaultLabel: "slider between {min} and {max}",
      defaultRangeStartLabel: "pick start value",
      defaultRangeEndLabel: "pick end value"
    },
    table: {
      emptyText: "No Data",
      confirmFilter: "Confirm",
      resetFilter: "Reset",
      clearFilter: "All",
      sumText: "Sum"
    },
    tree: {
      emptyText: "No Data"
    },
    transfer: {
      noMatch: "No matching data",
      noData: "No data",
      titles: ["List 1", "List 2"],
      filterPlaceholder: "Enter keyword",
      noCheckedFormat: "{total} items",
      hasCheckedFormat: "{checked}/{total} checked"
    },
    image: {
      error: "FAILED"
    },
    pageHeader: {
      title: "Back"
    },
    popconfirm: {
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    }
  }
};
const wd = (e) => (t, n) => kd(t, n, m(e)), kd = (e, t, n) => tl(n, e, e).replace(/\{(\w+)\}/g, (r, a) => {
  var o;
  return `${(o = t == null ? void 0 : t[a]) != null ? o : `{${a}}`}`;
}), Cd = (e) => {
  const t = $(() => m(e).name), n = et(e) ? e : E(e);
  return {
    lang: t,
    locale: n,
    t: wd(e)
  };
}, _d = Symbol("localeContextKey"), Sd = (e) => {
  const t = e || V(_d, E());
  return Cd($(() => t.value || Nd));
}, Lt = "el", xd = "is-", Ae = (e, t, n, r, a) => {
  let o = `${e}-${t}`;
  return n && (o += `-${n}`), r && (o += `__${r}`), a && (o += `--${a}`), o;
}, Ed = Symbol("namespaceContextKey"), Rr = (e) => {
  const t = e || (ae() ? V(Ed, E(Lt)) : E(Lt));
  return $(() => m(t) || Lt);
}, W = (e, t) => {
  const n = Rr(t);
  return {
    namespace: n,
    b: (u = "") => Ae(n.value, e, u, "", ""),
    e: (u) => u ? Ae(n.value, e, "", u, "") : "",
    m: (u) => u ? Ae(n.value, e, "", "", u) : "",
    be: (u, v) => u && v ? Ae(n.value, e, u, v, "") : "",
    em: (u, v) => u && v ? Ae(n.value, e, "", u, v) : "",
    bm: (u, v) => u && v ? Ae(n.value, e, u, "", v) : "",
    bem: (u, v, f) => u && v && f ? Ae(n.value, e, u, v, f) : "",
    is: (u, ...v) => {
      const f = v.length >= 1 ? v[0] : !0;
      return u && f ? `${xd}${u}` : "";
    },
    cssVar: (u) => {
      const v = {};
      for (const f in u)
        u[f] && (v[`--${n.value}-${f}`] = u[f]);
      return v;
    },
    cssVarName: (u) => `--${n.value}-${u}`,
    cssVarBlock: (u) => {
      const v = {};
      for (const f in u)
        u[f] && (v[`--${n.value}-${e}-${f}`] = u[f]);
      return v;
    },
    cssVarBlockName: (u) => `--${n.value}-${e}-${u}`
  };
}, Kr = (e) => {
  const t = ae();
  return $(() => {
    var n, r;
    return (r = (n = t == null ? void 0 : t.proxy) == null ? void 0 : n.$props) == null ? void 0 : r[e];
  });
}, Qt = {
  prefix: Math.floor(Math.random() * 1e4),
  current: 0
}, $d = Symbol("elIdInjection"), Td = () => ae() ? V($d, Qt) : Qt, Ad = (e) => {
  const t = Td();
  !xt && t === Qt && We("IdInjection", `Looks like you are using server rendering, you must provide a id provider to ensure the hydration process to be succeed
usage: app.provide(ID_INJECTION_KEY, {
  prefix: number,
  current: number,
})`);
  const n = Rr();
  return $(() => m(e) || `${n.value}-id-${t.prefix}-${t.current++}`);
}, Od = (e, t, n) => ht(e.subTree).filter((o) => {
  var s;
  return zt(o) && ((s = o.type) == null ? void 0 : s.name) === t && !!o.component;
}).map((o) => o.component.uid).map((o) => n[o]).filter((o) => !!o), Pd = (e, t) => {
  const n = {}, r = bt([]);
  return {
    children: r,
    addChild: (s) => {
      n[s.uid] = s, r.value = Od(e, t, n);
    },
    removeChild: (s) => {
      delete n[s], r.value = r.value.filter((i) => i.uid !== s);
    }
  };
}, pn = Br({
  type: String,
  values: yd,
  required: !1
}), Id = Symbol("size"), Md = () => {
  const e = V(Id, {});
  return $(() => m(e.size) || "");
}, Dd = Symbol(), or = E();
function Bd(e, t = void 0) {
  const n = ae() ? V(Dd, or) : or;
  return e ? $(() => {
    var r, a;
    return (a = (r = n.value) == null ? void 0 : r[e]) != null ? a : t;
  }) : n;
}
var ee = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [r, a] of t)
    n[r] = a;
  return n;
};
const Ld = Ne({
  size: {
    type: oe([Number, String])
  },
  color: {
    type: String
  }
}), Rd = B({
  name: "ElIcon",
  inheritAttrs: !1
}), Kd = /* @__PURE__ */ B({
  ...Rd,
  props: Ld,
  setup(e) {
    const t = e, n = W("icon"), r = $(() => {
      const { size: a, color: o } = t;
      return !a && !o ? {} : {
        fontSize: Ge(a) ? void 0 : bd(a),
        "--color": o
      };
    });
    return (a, o) => (A(), H("i", rn({
      class: m(n).b(),
      style: m(r)
    }, a.$attrs), [
      Z(a.$slots, "default")
    ], 16));
  }
});
var Fd = /* @__PURE__ */ ee(Kd, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/icon/src/icon.vue"]]);
const De = Ye(Fd), vn = Symbol("formContextKey"), gn = Symbol("formItemContextKey"), Xt = (e, t = {}) => {
  const n = E(void 0), r = t.prop ? n : Kr("size"), a = t.global ? n : Md(), o = t.form ? { size: void 0 } : V(vn, void 0), s = t.formItem ? { size: void 0 } : V(gn, void 0);
  return $(() => r.value || m(e) || (s == null ? void 0 : s.size) || (o == null ? void 0 : o.size) || a.value || "");
}, bn = (e) => {
  const t = Kr("disabled"), n = V(vn, void 0);
  return $(() => t.value || m(e) || (n == null ? void 0 : n.disabled) || !1);
}, Ot = () => {
  const e = V(vn, void 0), t = V(gn, void 0);
  return {
    form: e,
    formItem: t
  };
}, Fr = (e, {
  formItemContext: t,
  disableIdGeneration: n,
  disableIdManagement: r
}) => {
  n || (n = E(!1)), r || (r = E(!1));
  const a = E();
  let o;
  const s = $(() => {
    var i;
    return !!(!e.label && t && t.inputIds && ((i = t.inputIds) == null ? void 0 : i.length) <= 1);
  });
  return ot(() => {
    o = z([Vt(e, "id"), n], ([i, h]) => {
      const d = i ?? (h ? void 0 : Ad().value);
      d !== a.value && (t != null && t.removeInputId && (a.value && t.removeInputId(a.value), !(r != null && r.value) && !h && d && t.addInputId(d)), a.value = d);
    }, { immediate: !0 });
  }), hr(() => {
    o && o(), t != null && t.removeInputId && a.value && t.removeInputId(a.value);
  }), {
    isLabeledByFormItem: s,
    inputId: a
  };
}, jr = Symbol("buttonGroupContextKey"), jd = (e, t) => {
  Lr({
    from: "type.text",
    replacement: "link",
    version: "3.0.0",
    scope: "props",
    ref: "https://element-plus.org/en-US/component/button.html#button-attributes"
  }, $(() => e.type === "text"));
  const n = V(jr, void 0), r = Bd("button"), { form: a } = Ot(), o = Xt($(() => n == null ? void 0 : n.size)), s = bn(), i = E(), h = St(), d = $(() => e.type || (n == null ? void 0 : n.type) || ""), p = $(() => {
    var l, u, v;
    return (v = (u = e.autoInsertSpace) != null ? u : (l = r.value) == null ? void 0 : l.autoInsertSpace) != null ? v : !1;
  }), b = $(() => e.tag === "button" ? {
    ariaDisabled: s.value || e.loading,
    disabled: s.value || e.loading,
    autofocus: e.autofocus,
    type: e.nativeType
  } : {}), g = $(() => {
    var l;
    const u = (l = h.default) == null ? void 0 : l.call(h);
    if (p.value && (u == null ? void 0 : u.length) === 1) {
      const v = u[0];
      if ((v == null ? void 0 : v.type) === da) {
        const f = v.children;
        return /^\p{Unified_Ideograph}{2}$/u.test(f.trim());
      }
    }
    return !1;
  });
  return {
    _disabled: s,
    _size: o,
    _type: d,
    _ref: i,
    _props: b,
    shouldAddSpace: g,
    handleClick: (l) => {
      e.nativeType === "reset" && (a == null || a.resetFields()), t("click", l);
    }
  };
}, zd = [
  "default",
  "primary",
  "success",
  "warning",
  "info",
  "danger",
  "text",
  ""
], Vd = ["button", "submit", "reset"], Zt = Ne({
  size: pn,
  disabled: Boolean,
  type: {
    type: String,
    values: zd,
    default: ""
  },
  icon: {
    type: Jt
  },
  nativeType: {
    type: String,
    values: Vd,
    default: "button"
  },
  loading: Boolean,
  loadingIcon: {
    type: Jt,
    default: () => vr
  },
  plain: Boolean,
  text: Boolean,
  link: Boolean,
  bg: Boolean,
  autofocus: Boolean,
  round: Boolean,
  circle: Boolean,
  color: String,
  dark: Boolean,
  autoInsertSpace: {
    type: Boolean,
    default: void 0
  },
  tag: {
    type: oe([String, Object]),
    default: "button"
  }
}), Hd = {
  click: (e) => e instanceof MouseEvent
};
function Q(e, t) {
  Gd(e) && (e = "100%");
  var n = Ud(e);
  return e = t === 360 ? e : Math.min(t, Math.max(0, parseFloat(e))), n && (e = parseInt(String(e * t), 10) / 100), Math.abs(e - t) < 1e-6 ? 1 : (t === 360 ? e = (e < 0 ? e % t + t : e % t) / parseFloat(String(t)) : e = e % t / parseFloat(String(t)), e);
}
function ut(e) {
  return Math.min(1, Math.max(0, e));
}
function Gd(e) {
  return typeof e == "string" && e.indexOf(".") !== -1 && parseFloat(e) === 1;
}
function Ud(e) {
  return typeof e == "string" && e.indexOf("%") !== -1;
}
function zr(e) {
  return e = parseFloat(e), (isNaN(e) || e < 0 || e > 1) && (e = 1), e;
}
function ct(e) {
  return e <= 1 ? "".concat(Number(e) * 100, "%") : e;
}
function Me(e) {
  return e.length === 1 ? "0" + e : String(e);
}
function qd(e, t, n) {
  return {
    r: Q(e, 255) * 255,
    g: Q(t, 255) * 255,
    b: Q(n, 255) * 255
  };
}
function sr(e, t, n) {
  e = Q(e, 255), t = Q(t, 255), n = Q(n, 255);
  var r = Math.max(e, t, n), a = Math.min(e, t, n), o = 0, s = 0, i = (r + a) / 2;
  if (r === a)
    s = 0, o = 0;
  else {
    var h = r - a;
    switch (s = i > 0.5 ? h / (2 - r - a) : h / (r + a), r) {
      case e:
        o = (t - n) / h + (t < n ? 6 : 0);
        break;
      case t:
        o = (n - e) / h + 2;
        break;
      case n:
        o = (e - t) / h + 4;
        break;
    }
    o /= 6;
  }
  return { h: o, s, l: i };
}
function Rt(e, t, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * (6 * n) : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function Wd(e, t, n) {
  var r, a, o;
  if (e = Q(e, 360), t = Q(t, 100), n = Q(n, 100), t === 0)
    a = n, o = n, r = n;
  else {
    var s = n < 0.5 ? n * (1 + t) : n + t - n * t, i = 2 * n - s;
    r = Rt(i, s, e + 1 / 3), a = Rt(i, s, e), o = Rt(i, s, e - 1 / 3);
  }
  return { r: r * 255, g: a * 255, b: o * 255 };
}
function ir(e, t, n) {
  e = Q(e, 255), t = Q(t, 255), n = Q(n, 255);
  var r = Math.max(e, t, n), a = Math.min(e, t, n), o = 0, s = r, i = r - a, h = r === 0 ? 0 : i / r;
  if (r === a)
    o = 0;
  else {
    switch (r) {
      case e:
        o = (t - n) / i + (t < n ? 6 : 0);
        break;
      case t:
        o = (n - e) / i + 2;
        break;
      case n:
        o = (e - t) / i + 4;
        break;
    }
    o /= 6;
  }
  return { h: o, s: h, v: s };
}
function Yd(e, t, n) {
  e = Q(e, 360) * 6, t = Q(t, 100), n = Q(n, 100);
  var r = Math.floor(e), a = e - r, o = n * (1 - t), s = n * (1 - a * t), i = n * (1 - (1 - a) * t), h = r % 6, d = [n, s, o, o, i, n][h], p = [i, n, n, s, o, o][h], b = [o, o, i, n, n, s][h];
  return { r: d * 255, g: p * 255, b: b * 255 };
}
function lr(e, t, n, r) {
  var a = [
    Me(Math.round(e).toString(16)),
    Me(Math.round(t).toString(16)),
    Me(Math.round(n).toString(16))
  ];
  return r && a[0].startsWith(a[0].charAt(1)) && a[1].startsWith(a[1].charAt(1)) && a[2].startsWith(a[2].charAt(1)) ? a[0].charAt(0) + a[1].charAt(0) + a[2].charAt(0) : a.join("");
}
function Jd(e, t, n, r, a) {
  var o = [
    Me(Math.round(e).toString(16)),
    Me(Math.round(t).toString(16)),
    Me(Math.round(n).toString(16)),
    Me(Qd(r))
  ];
  return a && o[0].startsWith(o[0].charAt(1)) && o[1].startsWith(o[1].charAt(1)) && o[2].startsWith(o[2].charAt(1)) && o[3].startsWith(o[3].charAt(1)) ? o[0].charAt(0) + o[1].charAt(0) + o[2].charAt(0) + o[3].charAt(0) : o.join("");
}
function Qd(e) {
  return Math.round(parseFloat(e) * 255).toString(16);
}
function dr(e) {
  return re(e) / 255;
}
function re(e) {
  return parseInt(e, 16);
}
function Xd(e) {
  return {
    r: e >> 16,
    g: (e & 65280) >> 8,
    b: e & 255
  };
}
var en = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  goldenrod: "#daa520",
  gold: "#ffd700",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavenderblush: "#fff0f5",
  lavender: "#e6e6fa",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};
function Zd(e) {
  var t = { r: 0, g: 0, b: 0 }, n = 1, r = null, a = null, o = null, s = !1, i = !1;
  return typeof e == "string" && (e = nu(e)), typeof e == "object" && (he(e.r) && he(e.g) && he(e.b) ? (t = qd(e.r, e.g, e.b), s = !0, i = String(e.r).substr(-1) === "%" ? "prgb" : "rgb") : he(e.h) && he(e.s) && he(e.v) ? (r = ct(e.s), a = ct(e.v), t = Yd(e.h, r, a), s = !0, i = "hsv") : he(e.h) && he(e.s) && he(e.l) && (r = ct(e.s), o = ct(e.l), t = Wd(e.h, r, o), s = !0, i = "hsl"), Object.prototype.hasOwnProperty.call(e, "a") && (n = e.a)), n = zr(n), {
    ok: s,
    format: e.format || i,
    r: Math.min(255, Math.max(t.r, 0)),
    g: Math.min(255, Math.max(t.g, 0)),
    b: Math.min(255, Math.max(t.b, 0)),
    a: n
  };
}
var eu = "[-\\+]?\\d+%?", tu = "[-\\+]?\\d*\\.\\d+%?", _e = "(?:".concat(tu, ")|(?:").concat(eu, ")"), Kt = "[\\s|\\(]+(".concat(_e, ")[,|\\s]+(").concat(_e, ")[,|\\s]+(").concat(_e, ")\\s*\\)?"), Ft = "[\\s|\\(]+(".concat(_e, ")[,|\\s]+(").concat(_e, ")[,|\\s]+(").concat(_e, ")[,|\\s]+(").concat(_e, ")\\s*\\)?"), ie = {
  CSS_UNIT: new RegExp(_e),
  rgb: new RegExp("rgb" + Kt),
  rgba: new RegExp("rgba" + Ft),
  hsl: new RegExp("hsl" + Kt),
  hsla: new RegExp("hsla" + Ft),
  hsv: new RegExp("hsv" + Kt),
  hsva: new RegExp("hsva" + Ft),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
function nu(e) {
  if (e = e.trim().toLowerCase(), e.length === 0)
    return !1;
  var t = !1;
  if (en[e])
    e = en[e], t = !0;
  else if (e === "transparent")
    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
  var n = ie.rgb.exec(e);
  return n ? { r: n[1], g: n[2], b: n[3] } : (n = ie.rgba.exec(e), n ? { r: n[1], g: n[2], b: n[3], a: n[4] } : (n = ie.hsl.exec(e), n ? { h: n[1], s: n[2], l: n[3] } : (n = ie.hsla.exec(e), n ? { h: n[1], s: n[2], l: n[3], a: n[4] } : (n = ie.hsv.exec(e), n ? { h: n[1], s: n[2], v: n[3] } : (n = ie.hsva.exec(e), n ? { h: n[1], s: n[2], v: n[3], a: n[4] } : (n = ie.hex8.exec(e), n ? {
    r: re(n[1]),
    g: re(n[2]),
    b: re(n[3]),
    a: dr(n[4]),
    format: t ? "name" : "hex8"
  } : (n = ie.hex6.exec(e), n ? {
    r: re(n[1]),
    g: re(n[2]),
    b: re(n[3]),
    format: t ? "name" : "hex"
  } : (n = ie.hex4.exec(e), n ? {
    r: re(n[1] + n[1]),
    g: re(n[2] + n[2]),
    b: re(n[3] + n[3]),
    a: dr(n[4] + n[4]),
    format: t ? "name" : "hex8"
  } : (n = ie.hex3.exec(e), n ? {
    r: re(n[1] + n[1]),
    g: re(n[2] + n[2]),
    b: re(n[3] + n[3]),
    format: t ? "name" : "hex"
  } : !1)))))))));
}
function he(e) {
  return !!ie.CSS_UNIT.exec(String(e));
}
var ru = (
  /** @class */
  function() {
    function e(t, n) {
      t === void 0 && (t = ""), n === void 0 && (n = {});
      var r;
      if (t instanceof e)
        return t;
      typeof t == "number" && (t = Xd(t)), this.originalInput = t;
      var a = Zd(t);
      this.originalInput = t, this.r = a.r, this.g = a.g, this.b = a.b, this.a = a.a, this.roundA = Math.round(100 * this.a) / 100, this.format = (r = n.format) !== null && r !== void 0 ? r : a.format, this.gradientType = n.gradientType, this.r < 1 && (this.r = Math.round(this.r)), this.g < 1 && (this.g = Math.round(this.g)), this.b < 1 && (this.b = Math.round(this.b)), this.isValid = a.ok;
    }
    return e.prototype.isDark = function() {
      return this.getBrightness() < 128;
    }, e.prototype.isLight = function() {
      return !this.isDark();
    }, e.prototype.getBrightness = function() {
      var t = this.toRgb();
      return (t.r * 299 + t.g * 587 + t.b * 114) / 1e3;
    }, e.prototype.getLuminance = function() {
      var t = this.toRgb(), n, r, a, o = t.r / 255, s = t.g / 255, i = t.b / 255;
      return o <= 0.03928 ? n = o / 12.92 : n = Math.pow((o + 0.055) / 1.055, 2.4), s <= 0.03928 ? r = s / 12.92 : r = Math.pow((s + 0.055) / 1.055, 2.4), i <= 0.03928 ? a = i / 12.92 : a = Math.pow((i + 0.055) / 1.055, 2.4), 0.2126 * n + 0.7152 * r + 0.0722 * a;
    }, e.prototype.getAlpha = function() {
      return this.a;
    }, e.prototype.setAlpha = function(t) {
      return this.a = zr(t), this.roundA = Math.round(100 * this.a) / 100, this;
    }, e.prototype.isMonochrome = function() {
      var t = this.toHsl().s;
      return t === 0;
    }, e.prototype.toHsv = function() {
      var t = ir(this.r, this.g, this.b);
      return { h: t.h * 360, s: t.s, v: t.v, a: this.a };
    }, e.prototype.toHsvString = function() {
      var t = ir(this.r, this.g, this.b), n = Math.round(t.h * 360), r = Math.round(t.s * 100), a = Math.round(t.v * 100);
      return this.a === 1 ? "hsv(".concat(n, ", ").concat(r, "%, ").concat(a, "%)") : "hsva(".concat(n, ", ").concat(r, "%, ").concat(a, "%, ").concat(this.roundA, ")");
    }, e.prototype.toHsl = function() {
      var t = sr(this.r, this.g, this.b);
      return { h: t.h * 360, s: t.s, l: t.l, a: this.a };
    }, e.prototype.toHslString = function() {
      var t = sr(this.r, this.g, this.b), n = Math.round(t.h * 360), r = Math.round(t.s * 100), a = Math.round(t.l * 100);
      return this.a === 1 ? "hsl(".concat(n, ", ").concat(r, "%, ").concat(a, "%)") : "hsla(".concat(n, ", ").concat(r, "%, ").concat(a, "%, ").concat(this.roundA, ")");
    }, e.prototype.toHex = function(t) {
      return t === void 0 && (t = !1), lr(this.r, this.g, this.b, t);
    }, e.prototype.toHexString = function(t) {
      return t === void 0 && (t = !1), "#" + this.toHex(t);
    }, e.prototype.toHex8 = function(t) {
      return t === void 0 && (t = !1), Jd(this.r, this.g, this.b, this.a, t);
    }, e.prototype.toHex8String = function(t) {
      return t === void 0 && (t = !1), "#" + this.toHex8(t);
    }, e.prototype.toHexShortString = function(t) {
      return t === void 0 && (t = !1), this.a === 1 ? this.toHexString(t) : this.toHex8String(t);
    }, e.prototype.toRgb = function() {
      return {
        r: Math.round(this.r),
        g: Math.round(this.g),
        b: Math.round(this.b),
        a: this.a
      };
    }, e.prototype.toRgbString = function() {
      var t = Math.round(this.r), n = Math.round(this.g), r = Math.round(this.b);
      return this.a === 1 ? "rgb(".concat(t, ", ").concat(n, ", ").concat(r, ")") : "rgba(".concat(t, ", ").concat(n, ", ").concat(r, ", ").concat(this.roundA, ")");
    }, e.prototype.toPercentageRgb = function() {
      var t = function(n) {
        return "".concat(Math.round(Q(n, 255) * 100), "%");
      };
      return {
        r: t(this.r),
        g: t(this.g),
        b: t(this.b),
        a: this.a
      };
    }, e.prototype.toPercentageRgbString = function() {
      var t = function(n) {
        return Math.round(Q(n, 255) * 100);
      };
      return this.a === 1 ? "rgb(".concat(t(this.r), "%, ").concat(t(this.g), "%, ").concat(t(this.b), "%)") : "rgba(".concat(t(this.r), "%, ").concat(t(this.g), "%, ").concat(t(this.b), "%, ").concat(this.roundA, ")");
    }, e.prototype.toName = function() {
      if (this.a === 0)
        return "transparent";
      if (this.a < 1)
        return !1;
      for (var t = "#" + lr(this.r, this.g, this.b, !1), n = 0, r = Object.entries(en); n < r.length; n++) {
        var a = r[n], o = a[0], s = a[1];
        if (t === s)
          return o;
      }
      return !1;
    }, e.prototype.toString = function(t) {
      var n = !!t;
      t = t ?? this.format;
      var r = !1, a = this.a < 1 && this.a >= 0, o = !n && a && (t.startsWith("hex") || t === "name");
      return o ? t === "name" && this.a === 0 ? this.toName() : this.toRgbString() : (t === "rgb" && (r = this.toRgbString()), t === "prgb" && (r = this.toPercentageRgbString()), (t === "hex" || t === "hex6") && (r = this.toHexString()), t === "hex3" && (r = this.toHexString(!0)), t === "hex4" && (r = this.toHex8String(!0)), t === "hex8" && (r = this.toHex8String()), t === "name" && (r = this.toName()), t === "hsl" && (r = this.toHslString()), t === "hsv" && (r = this.toHsvString()), r || this.toHexString());
    }, e.prototype.toNumber = function() {
      return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    }, e.prototype.clone = function() {
      return new e(this.toString());
    }, e.prototype.lighten = function(t) {
      t === void 0 && (t = 10);
      var n = this.toHsl();
      return n.l += t / 100, n.l = ut(n.l), new e(n);
    }, e.prototype.brighten = function(t) {
      t === void 0 && (t = 10);
      var n = this.toRgb();
      return n.r = Math.max(0, Math.min(255, n.r - Math.round(255 * -(t / 100)))), n.g = Math.max(0, Math.min(255, n.g - Math.round(255 * -(t / 100)))), n.b = Math.max(0, Math.min(255, n.b - Math.round(255 * -(t / 100)))), new e(n);
    }, e.prototype.darken = function(t) {
      t === void 0 && (t = 10);
      var n = this.toHsl();
      return n.l -= t / 100, n.l = ut(n.l), new e(n);
    }, e.prototype.tint = function(t) {
      return t === void 0 && (t = 10), this.mix("white", t);
    }, e.prototype.shade = function(t) {
      return t === void 0 && (t = 10), this.mix("black", t);
    }, e.prototype.desaturate = function(t) {
      t === void 0 && (t = 10);
      var n = this.toHsl();
      return n.s -= t / 100, n.s = ut(n.s), new e(n);
    }, e.prototype.saturate = function(t) {
      t === void 0 && (t = 10);
      var n = this.toHsl();
      return n.s += t / 100, n.s = ut(n.s), new e(n);
    }, e.prototype.greyscale = function() {
      return this.desaturate(100);
    }, e.prototype.spin = function(t) {
      var n = this.toHsl(), r = (n.h + t) % 360;
      return n.h = r < 0 ? 360 + r : r, new e(n);
    }, e.prototype.mix = function(t, n) {
      n === void 0 && (n = 50);
      var r = this.toRgb(), a = new e(t).toRgb(), o = n / 100, s = {
        r: (a.r - r.r) * o + r.r,
        g: (a.g - r.g) * o + r.g,
        b: (a.b - r.b) * o + r.b,
        a: (a.a - r.a) * o + r.a
      };
      return new e(s);
    }, e.prototype.analogous = function(t, n) {
      t === void 0 && (t = 6), n === void 0 && (n = 30);
      var r = this.toHsl(), a = 360 / n, o = [this];
      for (r.h = (r.h - (a * t >> 1) + 720) % 360; --t; )
        r.h = (r.h + a) % 360, o.push(new e(r));
      return o;
    }, e.prototype.complement = function() {
      var t = this.toHsl();
      return t.h = (t.h + 180) % 360, new e(t);
    }, e.prototype.monochromatic = function(t) {
      t === void 0 && (t = 6);
      for (var n = this.toHsv(), r = n.h, a = n.s, o = n.v, s = [], i = 1 / t; t--; )
        s.push(new e({ h: r, s: a, v: o })), o = (o + i) % 1;
      return s;
    }, e.prototype.splitcomplement = function() {
      var t = this.toHsl(), n = t.h;
      return [
        this,
        new e({ h: (n + 72) % 360, s: t.s, l: t.l }),
        new e({ h: (n + 216) % 360, s: t.s, l: t.l })
      ];
    }, e.prototype.onBackground = function(t) {
      var n = this.toRgb(), r = new e(t).toRgb(), a = n.a + r.a * (1 - n.a);
      return new e({
        r: (n.r * n.a + r.r * r.a * (1 - n.a)) / a,
        g: (n.g * n.a + r.g * r.a * (1 - n.a)) / a,
        b: (n.b * n.a + r.b * r.a * (1 - n.a)) / a,
        a
      });
    }, e.prototype.triad = function() {
      return this.polyad(3);
    }, e.prototype.tetrad = function() {
      return this.polyad(4);
    }, e.prototype.polyad = function(t) {
      for (var n = this.toHsl(), r = n.h, a = [this], o = 360 / t, s = 1; s < t; s++)
        a.push(new e({ h: (r + s * o) % 360, s: n.s, l: n.l }));
      return a;
    }, e.prototype.equals = function(t) {
      return this.toRgbString() === new e(t).toRgbString();
    }, e;
  }()
);
function ke(e, t = 20) {
  return e.mix("#141414", t).toString();
}
function au(e) {
  const t = bn(), n = W("button");
  return $(() => {
    let r = {};
    const a = e.color;
    if (a) {
      const o = new ru(a), s = e.dark ? o.tint(20).toString() : ke(o, 20);
      if (e.plain)
        r = n.cssVarBlock({
          "bg-color": e.dark ? ke(o, 90) : o.tint(90).toString(),
          "text-color": a,
          "border-color": e.dark ? ke(o, 50) : o.tint(50).toString(),
          "hover-text-color": `var(${n.cssVarName("color-white")})`,
          "hover-bg-color": a,
          "hover-border-color": a,
          "active-bg-color": s,
          "active-text-color": `var(${n.cssVarName("color-white")})`,
          "active-border-color": s
        }), t.value && (r[n.cssVarBlockName("disabled-bg-color")] = e.dark ? ke(o, 90) : o.tint(90).toString(), r[n.cssVarBlockName("disabled-text-color")] = e.dark ? ke(o, 50) : o.tint(50).toString(), r[n.cssVarBlockName("disabled-border-color")] = e.dark ? ke(o, 80) : o.tint(80).toString());
      else {
        const i = e.dark ? ke(o, 30) : o.tint(30).toString(), h = o.isDark() ? `var(${n.cssVarName("color-white")})` : `var(${n.cssVarName("color-black")})`;
        if (r = n.cssVarBlock({
          "bg-color": a,
          "text-color": h,
          "border-color": a,
          "hover-bg-color": i,
          "hover-text-color": h,
          "hover-border-color": i,
          "active-bg-color": s,
          "active-border-color": s
        }), t.value) {
          const d = e.dark ? ke(o, 50) : o.tint(50).toString();
          r[n.cssVarBlockName("disabled-bg-color")] = d, r[n.cssVarBlockName("disabled-text-color")] = e.dark ? "rgba(255, 255, 255, 0.5)" : `var(${n.cssVarName("color-white")})`, r[n.cssVarBlockName("disabled-border-color")] = d;
        }
      }
    }
    return r;
  });
}
const ou = B({
  name: "ElButton"
}), su = /* @__PURE__ */ B({
  ...ou,
  props: Zt,
  emits: Hd,
  setup(e, { expose: t, emit: n }) {
    const r = e, a = au(r), o = W("button"), { _ref: s, _size: i, _type: h, _disabled: d, _props: p, shouldAddSpace: b, handleClick: g } = jd(r, n);
    return t({
      ref: s,
      size: i,
      type: h,
      disabled: d,
      shouldAddSpace: b
    }), (c, l) => (A(), q(Se(c.tag), rn({
      ref_key: "_ref",
      ref: s
    }, m(p), {
      class: [
        m(o).b(),
        m(o).m(m(h)),
        m(o).m(m(i)),
        m(o).is("disabled", m(d)),
        m(o).is("loading", c.loading),
        m(o).is("plain", c.plain),
        m(o).is("round", c.round),
        m(o).is("circle", c.circle),
        m(o).is("text", c.text),
        m(o).is("link", c.link),
        m(o).is("has-bg", c.bg)
      ],
      style: m(a),
      onClick: m(g)
    }), {
      default: D(() => [
        c.loading ? (A(), H(Ve, { key: 0 }, [
          c.$slots.loading ? Z(c.$slots, "loading", { key: 0 }) : (A(), q(m(De), {
            key: 1,
            class: K(m(o).is("loading"))
          }, {
            default: D(() => [
              (A(), q(Se(c.loadingIcon)))
            ]),
            _: 1
          }, 8, ["class"]))
        ], 64)) : c.icon || c.$slots.icon ? (A(), q(m(De), { key: 1 }, {
          default: D(() => [
            c.icon ? (A(), q(Se(c.icon), { key: 0 })) : Z(c.$slots, "icon", { key: 1 })
          ]),
          _: 3
        })) : ce("v-if", !0),
        c.$slots.default ? (A(), H("span", {
          key: 2,
          class: K({ [m(o).em("text", "expand")]: m(b) })
        }, [
          Z(c.$slots, "default")
        ], 2)) : ce("v-if", !0)
      ]),
      _: 3
    }, 16, ["class", "style", "onClick"]));
  }
});
var iu = /* @__PURE__ */ ee(su, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/button/src/button.vue"]]);
const lu = {
  size: Zt.size,
  type: Zt.type
}, du = B({
  name: "ElButtonGroup"
}), uu = /* @__PURE__ */ B({
  ...du,
  props: lu,
  setup(e) {
    const t = e;
    ve(jr, tt({
      size: Vt(t, "size"),
      type: Vt(t, "type")
    }));
    const n = W("button");
    return (r, a) => (A(), H("div", {
      class: K(`${m(n).b("group")}`)
    }, [
      Z(r.$slots, "default")
    ], 2));
  }
});
var Vr = /* @__PURE__ */ ee(uu, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/button/src/button-group.vue"]]);
const cu = Ye(iu, {
  ButtonGroup: Vr
});
At(Vr);
const Hr = {
  modelValue: {
    type: [Number, String, Boolean],
    default: void 0
  },
  label: {
    type: [String, Boolean, Number, Object]
  },
  indeterminate: Boolean,
  disabled: Boolean,
  checked: Boolean,
  name: {
    type: String,
    default: void 0
  },
  trueLabel: {
    type: [String, Number],
    default: void 0
  },
  falseLabel: {
    type: [String, Number],
    default: void 0
  },
  id: {
    type: String,
    default: void 0
  },
  controls: {
    type: String,
    default: void 0
  },
  border: Boolean,
  size: pn,
  tabindex: [String, Number],
  validateEvent: {
    type: Boolean,
    default: !0
  }
}, Gr = {
  [Je]: (e) => Le(e) || Ue(e) || Yt(e),
  change: (e) => Le(e) || Ue(e) || Yt(e)
}, Qe = Symbol("checkboxGroupContextKey"), fu = ({
  model: e,
  isChecked: t
}) => {
  const n = V(Qe, void 0), r = $(() => {
    var o, s;
    const i = (o = n == null ? void 0 : n.max) == null ? void 0 : o.value, h = (s = n == null ? void 0 : n.min) == null ? void 0 : s.value;
    return !Ge(i) && e.value.length >= i && !t.value || !Ge(h) && e.value.length <= h && t.value;
  });
  return {
    isDisabled: bn($(() => (n == null ? void 0 : n.disabled.value) || r.value)),
    isLimitDisabled: r
  };
}, hu = (e, {
  model: t,
  isLimitExceeded: n,
  hasOwnLabel: r,
  isDisabled: a,
  isLabeledByFormItem: o
}) => {
  const s = V(Qe, void 0), { formItem: i } = Ot(), { emit: h } = ae();
  function d(l) {
    var u, v;
    return l === e.trueLabel || l === !0 ? (u = e.trueLabel) != null ? u : !0 : (v = e.falseLabel) != null ? v : !1;
  }
  function p(l, u) {
    h("change", d(l), u);
  }
  function b(l) {
    if (n.value)
      return;
    const u = l.target;
    h("change", d(u.checked), l);
  }
  async function g(l) {
    n.value || !r.value && !a.value && o.value && (l.composedPath().some((f) => f.tagName === "LABEL") || (t.value = d([!1, e.falseLabel].includes(t.value)), await $e(), p(t.value, l)));
  }
  const c = $(() => (s == null ? void 0 : s.validateEvent) || e.validateEvent);
  return z(() => e.modelValue, () => {
    c.value && (i == null || i.validate("change").catch((l) => We(l)));
  }), {
    handleChange: b,
    onClickRoot: g
  };
}, pu = (e) => {
  const t = E(!1), { emit: n } = ae(), r = V(Qe, void 0), a = $(() => Ge(r) === !1), o = E(!1);
  return {
    model: $({
      get() {
        var i, h;
        return a.value ? (i = r == null ? void 0 : r.modelValue) == null ? void 0 : i.value : (h = e.modelValue) != null ? h : t.value;
      },
      set(i) {
        var h, d;
        a.value && xe(i) ? (o.value = ((h = r == null ? void 0 : r.max) == null ? void 0 : h.value) !== void 0 && i.length > (r == null ? void 0 : r.max.value), o.value === !1 && ((d = r == null ? void 0 : r.changeEvent) == null || d.call(r, i))) : (n(Je, i), t.value = i);
      }
    }),
    isGroup: a,
    isLimitExceeded: o
  };
}, vu = (e, t, { model: n }) => {
  const r = V(Qe, void 0), a = E(!1), o = $(() => {
    const d = n.value;
    return Yt(d) ? d : xe(d) ? it(e.label) ? d.map(Nn).some((p) => ld(p, e.label)) : d.map(Nn).includes(e.label) : d != null ? d === e.trueLabel : !!d;
  }), s = Xt($(() => {
    var d;
    return (d = r == null ? void 0 : r.size) == null ? void 0 : d.value;
  }), {
    prop: !0
  }), i = Xt($(() => {
    var d;
    return (d = r == null ? void 0 : r.size) == null ? void 0 : d.value;
  })), h = $(() => !!(t.default || e.label));
  return {
    checkboxButtonSize: s,
    isChecked: o,
    isFocused: a,
    checkboxSize: i,
    hasOwnLabel: h
  };
}, gu = (e, { model: t }) => {
  function n() {
    xe(t.value) && !t.value.includes(e.label) ? t.value.push(e.label) : t.value = e.trueLabel || !0;
  }
  e.checked && n();
}, Ur = (e, t) => {
  const { formItem: n } = Ot(), { model: r, isGroup: a, isLimitExceeded: o } = pu(e), {
    isFocused: s,
    isChecked: i,
    checkboxButtonSize: h,
    checkboxSize: d,
    hasOwnLabel: p
  } = vu(e, t, { model: r }), { isDisabled: b } = fu({ model: r, isChecked: i }), { inputId: g, isLabeledByFormItem: c } = Fr(e, {
    formItemContext: n,
    disableIdGeneration: p,
    disableIdManagement: a
  }), { handleChange: l, onClickRoot: u } = hu(e, {
    model: r,
    isLimitExceeded: o,
    hasOwnLabel: p,
    isDisabled: b,
    isLabeledByFormItem: c
  });
  return gu(e, { model: r }), {
    inputId: g,
    isLabeledByFormItem: c,
    isChecked: i,
    isDisabled: b,
    isFocused: s,
    checkboxButtonSize: h,
    checkboxSize: d,
    hasOwnLabel: p,
    model: r,
    handleChange: l,
    onClickRoot: u
  };
}, bu = ["tabindex", "role", "aria-checked"], mu = ["id", "aria-hidden", "name", "tabindex", "disabled", "true-value", "false-value"], yu = ["id", "aria-hidden", "disabled", "value", "name", "tabindex"], Nu = B({
  name: "ElCheckbox"
}), wu = /* @__PURE__ */ B({
  ...Nu,
  props: Hr,
  emits: Gr,
  setup(e) {
    const t = e, n = St(), {
      inputId: r,
      isLabeledByFormItem: a,
      isChecked: o,
      isDisabled: s,
      isFocused: i,
      checkboxSize: h,
      hasOwnLabel: d,
      model: p,
      handleChange: b,
      onClickRoot: g
    } = Ur(t, n), c = W("checkbox"), l = $(() => [
      c.b(),
      c.m(h.value),
      c.is("disabled", s.value),
      c.is("bordered", t.border),
      c.is("checked", o.value)
    ]), u = $(() => [
      c.e("input"),
      c.is("disabled", s.value),
      c.is("checked", o.value),
      c.is("indeterminate", t.indeterminate),
      c.is("focus", i.value)
    ]);
    return (v, f) => (A(), q(Se(!m(d) && m(a) ? "span" : "label"), {
      class: K(m(l)),
      "aria-controls": v.indeterminate ? v.controls : null,
      onClick: m(g)
    }, {
      default: D(() => [
        ue("span", {
          class: K(m(u)),
          tabindex: v.indeterminate ? 0 : void 0,
          role: v.indeterminate ? "checkbox" : void 0,
          "aria-checked": v.indeterminate ? "mixed" : void 0
        }, [
          v.trueLabel || v.falseLabel ? Te((A(), H("input", {
            key: 0,
            id: m(r),
            "onUpdate:modelValue": f[0] || (f[0] = (k) => et(p) ? p.value = k : null),
            class: K(m(c).e("original")),
            type: "checkbox",
            "aria-hidden": v.indeterminate ? "true" : "false",
            name: v.name,
            tabindex: v.tabindex,
            disabled: m(s),
            "true-value": v.trueLabel,
            "false-value": v.falseLabel,
            onChange: f[1] || (f[1] = (...k) => m(b) && m(b)(...k)),
            onFocus: f[2] || (f[2] = (k) => i.value = !0),
            onBlur: f[3] || (f[3] = (k) => i.value = !1),
            onClick: f[4] || (f[4] = le(() => {
            }, ["stop"]))
          }, null, 42, mu)), [
            [mt, m(p)]
          ]) : Te((A(), H("input", {
            key: 1,
            id: m(r),
            "onUpdate:modelValue": f[5] || (f[5] = (k) => et(p) ? p.value = k : null),
            class: K(m(c).e("original")),
            type: "checkbox",
            "aria-hidden": v.indeterminate ? "true" : "false",
            disabled: m(s),
            value: v.label,
            name: v.name,
            tabindex: v.tabindex,
            onChange: f[6] || (f[6] = (...k) => m(b) && m(b)(...k)),
            onFocus: f[7] || (f[7] = (k) => i.value = !0),
            onBlur: f[8] || (f[8] = (k) => i.value = !1),
            onClick: f[9] || (f[9] = le(() => {
            }, ["stop"]))
          }, null, 42, yu)), [
            [mt, m(p)]
          ]),
          ue("span", {
            class: K(m(c).e("inner"))
          }, null, 2)
        ], 10, bu),
        m(d) ? (A(), H("span", {
          key: 0,
          class: K(m(c).e("label"))
        }, [
          Z(v.$slots, "default"),
          v.$slots.default ? ce("v-if", !0) : (A(), H(Ve, { key: 0 }, [
            je(pe(v.label), 1)
          ], 64))
        ], 2)) : ce("v-if", !0)
      ]),
      _: 3
    }, 8, ["class", "aria-controls", "onClick"]));
  }
});
var ku = /* @__PURE__ */ ee(wu, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/checkbox/src/checkbox.vue"]]);
const Cu = ["name", "tabindex", "disabled", "true-value", "false-value"], _u = ["name", "tabindex", "disabled", "value"], Su = B({
  name: "ElCheckboxButton"
}), xu = /* @__PURE__ */ B({
  ...Su,
  props: Hr,
  emits: Gr,
  setup(e) {
    const t = e, n = St(), {
      isFocused: r,
      isChecked: a,
      isDisabled: o,
      checkboxButtonSize: s,
      model: i,
      handleChange: h
    } = Ur(t, n), d = V(Qe, void 0), p = W("checkbox"), b = $(() => {
      var c, l, u, v;
      const f = (l = (c = d == null ? void 0 : d.fill) == null ? void 0 : c.value) != null ? l : "";
      return {
        backgroundColor: f,
        borderColor: f,
        color: (v = (u = d == null ? void 0 : d.textColor) == null ? void 0 : u.value) != null ? v : "",
        boxShadow: f ? `-1px 0 0 0 ${f}` : void 0
      };
    }), g = $(() => [
      p.b("button"),
      p.bm("button", s.value),
      p.is("disabled", o.value),
      p.is("checked", a.value),
      p.is("focus", r.value)
    ]);
    return (c, l) => (A(), H("label", {
      class: K(m(g))
    }, [
      c.trueLabel || c.falseLabel ? Te((A(), H("input", {
        key: 0,
        "onUpdate:modelValue": l[0] || (l[0] = (u) => et(i) ? i.value = u : null),
        class: K(m(p).be("button", "original")),
        type: "checkbox",
        name: c.name,
        tabindex: c.tabindex,
        disabled: m(o),
        "true-value": c.trueLabel,
        "false-value": c.falseLabel,
        onChange: l[1] || (l[1] = (...u) => m(h) && m(h)(...u)),
        onFocus: l[2] || (l[2] = (u) => r.value = !0),
        onBlur: l[3] || (l[3] = (u) => r.value = !1),
        onClick: l[4] || (l[4] = le(() => {
        }, ["stop"]))
      }, null, 42, Cu)), [
        [mt, m(i)]
      ]) : Te((A(), H("input", {
        key: 1,
        "onUpdate:modelValue": l[5] || (l[5] = (u) => et(i) ? i.value = u : null),
        class: K(m(p).be("button", "original")),
        type: "checkbox",
        name: c.name,
        tabindex: c.tabindex,
        disabled: m(o),
        value: c.label,
        onChange: l[6] || (l[6] = (...u) => m(h) && m(h)(...u)),
        onFocus: l[7] || (l[7] = (u) => r.value = !0),
        onBlur: l[8] || (l[8] = (u) => r.value = !1),
        onClick: l[9] || (l[9] = le(() => {
        }, ["stop"]))
      }, null, 42, _u)), [
        [mt, m(i)]
      ]),
      c.$slots.default || c.label ? (A(), H("span", {
        key: 2,
        class: K(m(p).be("button", "inner")),
        style: st(m(a) ? m(b) : void 0)
      }, [
        Z(c.$slots, "default", {}, () => [
          je(pe(c.label), 1)
        ])
      ], 6)) : ce("v-if", !0)
    ], 2));
  }
});
var qr = /* @__PURE__ */ ee(xu, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/checkbox/src/checkbox-button.vue"]]);
const Eu = Ne({
  modelValue: {
    type: oe(Array),
    default: () => []
  },
  disabled: Boolean,
  min: Number,
  max: Number,
  size: pn,
  label: String,
  fill: String,
  textColor: String,
  tag: {
    type: String,
    default: "div"
  },
  validateEvent: {
    type: Boolean,
    default: !0
  }
}), $u = {
  [Je]: (e) => xe(e),
  change: (e) => xe(e)
}, Tu = B({
  name: "ElCheckboxGroup"
}), Au = /* @__PURE__ */ B({
  ...Tu,
  props: Eu,
  emits: $u,
  setup(e, { emit: t }) {
    const n = e, r = W("checkbox"), { formItem: a } = Ot(), { inputId: o, isLabeledByFormItem: s } = Fr(n, {
      formItemContext: a
    }), i = async (d) => {
      t(Je, d), await $e(), t("change", d);
    }, h = $({
      get() {
        return n.modelValue;
      },
      set(d) {
        i(d);
      }
    });
    return ve(Qe, {
      ...hd(ua(n), [
        "size",
        "min",
        "max",
        "disabled",
        "validateEvent",
        "fill",
        "textColor"
      ]),
      modelValue: h,
      changeEvent: i
    }), z(() => n.modelValue, () => {
      n.validateEvent && (a == null || a.validate("change").catch((d) => We(d)));
    }), (d, p) => {
      var b;
      return A(), q(Se(d.tag), {
        id: m(o),
        class: K(m(r).b("group")),
        role: "group",
        "aria-label": m(s) ? void 0 : d.label || "checkbox-group",
        "aria-labelledby": m(s) ? (b = m(a)) == null ? void 0 : b.labelId : void 0
      }, {
        default: D(() => [
          Z(d.$slots, "default")
        ]),
        _: 3
      }, 8, ["id", "class", "aria-label", "aria-labelledby"]);
    };
  }
});
var Wr = /* @__PURE__ */ ee(Au, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/checkbox/src/checkbox-group.vue"]]);
const Ou = Ye(ku, {
  CheckboxButton: qr,
  CheckboxGroup: Wr
});
At(qr);
At(Wr);
const Yr = Symbol("rowContextKey"), Pu = [
  "start",
  "center",
  "end",
  "space-around",
  "space-between",
  "space-evenly"
], Iu = ["top", "middle", "bottom"], Mu = Ne({
  tag: {
    type: String,
    default: "div"
  },
  gutter: {
    type: Number,
    default: 0
  },
  justify: {
    type: String,
    values: Pu,
    default: "start"
  },
  align: {
    type: String,
    values: Iu
  }
}), Du = B({
  name: "ElRow"
}), Bu = /* @__PURE__ */ B({
  ...Du,
  props: Mu,
  setup(e) {
    const t = e, n = W("row"), r = $(() => t.gutter);
    ve(Yr, {
      gutter: r
    });
    const a = $(() => {
      const s = {};
      return t.gutter && (s.marginRight = s.marginLeft = `-${t.gutter / 2}px`), s;
    }), o = $(() => [
      n.b(),
      n.is(`justify-${t.justify}`, t.justify !== "start"),
      n.is(`align-${t.align}`, !!t.align)
    ]);
    return (s, i) => (A(), q(Se(s.tag), {
      class: K(m(o)),
      style: st(m(a))
    }, {
      default: D(() => [
        Z(s.$slots, "default")
      ]),
      _: 3
    }, 8, ["class", "style"]));
  }
});
var Lu = /* @__PURE__ */ ee(Bu, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/row/src/row.vue"]]);
const Ru = Ye(Lu), Ku = Ne({
  tag: {
    type: String,
    default: "div"
  },
  span: {
    type: Number,
    default: 24
  },
  offset: {
    type: Number,
    default: 0
  },
  pull: {
    type: Number,
    default: 0
  },
  push: {
    type: Number,
    default: 0
  },
  xs: {
    type: oe([Number, Object]),
    default: () => Ie({})
  },
  sm: {
    type: oe([Number, Object]),
    default: () => Ie({})
  },
  md: {
    type: oe([Number, Object]),
    default: () => Ie({})
  },
  lg: {
    type: oe([Number, Object]),
    default: () => Ie({})
  },
  xl: {
    type: oe([Number, Object]),
    default: () => Ie({})
  }
}), Fu = B({
  name: "ElCol"
}), ju = /* @__PURE__ */ B({
  ...Fu,
  props: Ku,
  setup(e) {
    const t = e, { gutter: n } = V(Yr, { gutter: $(() => 0) }), r = W("col"), a = $(() => {
      const s = {};
      return n.value && (s.paddingLeft = s.paddingRight = `${n.value / 2}px`), s;
    }), o = $(() => {
      const s = [];
      return ["span", "offset", "pull", "push"].forEach((d) => {
        const p = t[d];
        Ue(p) && (d === "span" ? s.push(r.b(`${t[d]}`)) : p > 0 && s.push(r.b(`${d}-${t[d]}`)));
      }), ["xs", "sm", "md", "lg", "xl"].forEach((d) => {
        Ue(t[d]) ? s.push(r.b(`${d}-${t[d]}`)) : it(t[d]) && Object.entries(t[d]).forEach(([p, b]) => {
          s.push(p !== "span" ? r.b(`${d}-${p}-${b}`) : r.b(`${d}-${b}`));
        });
      }), n.value && s.push(r.is("guttered")), [r.b(), s];
    });
    return (s, i) => (A(), q(Se(s.tag), {
      class: K(m(o)),
      style: st(m(a))
    }, {
      default: D(() => [
        Z(s.$slots, "default")
      ]),
      _: 3
    }, 8, ["class", "style"]));
  }
});
var zu = /* @__PURE__ */ ee(ju, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/col/src/col.vue"]]);
const Vu = Ye(zu), Hu = B({
  name: "ElCollapseTransition"
}), Gu = /* @__PURE__ */ B({
  ...Hu,
  setup(e) {
    const t = W("collapse-transition"), n = (a) => {
      a.style.maxHeight = "", a.style.overflow = a.dataset.oldOverflow, a.style.paddingTop = a.dataset.oldPaddingTop, a.style.paddingBottom = a.dataset.oldPaddingBottom;
    }, r = {
      beforeEnter(a) {
        a.dataset || (a.dataset = {}), a.dataset.oldPaddingTop = a.style.paddingTop, a.dataset.oldPaddingBottom = a.style.paddingBottom, a.style.maxHeight = 0, a.style.paddingTop = 0, a.style.paddingBottom = 0;
      },
      enter(a) {
        a.dataset.oldOverflow = a.style.overflow, a.scrollHeight !== 0 ? a.style.maxHeight = `${a.scrollHeight}px` : a.style.maxHeight = 0, a.style.paddingTop = a.dataset.oldPaddingTop, a.style.paddingBottom = a.dataset.oldPaddingBottom, a.style.overflow = "hidden";
      },
      afterEnter(a) {
        a.style.maxHeight = "", a.style.overflow = a.dataset.oldOverflow;
      },
      enterCancelled(a) {
        n(a);
      },
      beforeLeave(a) {
        a.dataset || (a.dataset = {}), a.dataset.oldPaddingTop = a.style.paddingTop, a.dataset.oldPaddingBottom = a.style.paddingBottom, a.dataset.oldOverflow = a.style.overflow, a.style.maxHeight = `${a.scrollHeight}px`, a.style.overflow = "hidden";
      },
      leave(a) {
        a.scrollHeight !== 0 && (a.style.maxHeight = 0, a.style.paddingTop = 0, a.style.paddingBottom = 0);
      },
      afterLeave(a) {
        n(a);
      },
      leaveCancelled(a) {
        n(a);
      }
    };
    return (a, o) => (A(), q(ca, rn({
      name: m(t).b()
    }, fa(r)), {
      default: D(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 16, ["name"]));
  }
});
var pt = /* @__PURE__ */ ee(Gu, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/collapse-transition/src/collapse-transition.vue"]]);
pt.install = (e) => {
  e.component(pt.name, pt);
};
const Uu = pt, Pt = Symbol("tabsRootContextKey"), qu = Ne({
  tabs: {
    type: oe(Array),
    default: () => Ie([])
  }
}), Jr = "ElTabBar", Wu = B({
  name: Jr
}), Yu = /* @__PURE__ */ B({
  ...Wu,
  props: qu,
  setup(e, { expose: t }) {
    const n = e, r = ae(), a = V(Pt);
    a || hn(Jr, "<el-tabs><el-tab-bar /></el-tabs>");
    const o = W("tabs"), s = E(), i = E(), h = () => {
      let p = 0, b = 0;
      const g = ["top", "bottom"].includes(a.props.tabPosition) ? "width" : "height", c = g === "width" ? "x" : "y", l = c === "x" ? "left" : "top";
      return n.tabs.every((u) => {
        var v, f;
        const k = (f = (v = r.parent) == null ? void 0 : v.refs) == null ? void 0 : f[`tab-${u.uid}`];
        if (!k)
          return !1;
        if (!u.active)
          return !0;
        p = k[`offset${Ce(l)}`], b = k[`client${Ce(g)}`];
        const y = window.getComputedStyle(k);
        return g === "width" && (n.tabs.length > 1 && (b -= Number.parseFloat(y.paddingLeft) + Number.parseFloat(y.paddingRight)), p += Number.parseFloat(y.paddingLeft)), !1;
      }), {
        [g]: `${b}px`,
        transform: `translate${Ce(c)}(${p}px)`
      };
    }, d = () => i.value = h();
    return z(() => n.tabs, async () => {
      await $e(), d();
    }, { immediate: !0 }), yr(s, () => d()), t({
      ref: s,
      update: d
    }), (p, b) => (A(), H("div", {
      ref_key: "barRef",
      ref: s,
      class: K([m(o).e("active-bar"), m(o).is(m(a).props.tabPosition)]),
      style: st(i.value)
    }, null, 6));
  }
});
var Ju = /* @__PURE__ */ ee(Yu, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/tabs/src/tab-bar.vue"]]);
const Qu = Ne({
  panes: {
    type: oe(Array),
    default: () => Ie([])
  },
  currentName: {
    type: [String, Number],
    default: ""
  },
  editable: Boolean,
  type: {
    type: String,
    values: ["card", "border-card", ""],
    default: ""
  },
  stretch: Boolean
}), Xu = {
  tabClick: (e, t, n) => n instanceof Event,
  tabRemove: (e, t) => t instanceof Event
}, ur = "ElTabNav", Zu = B({
  name: ur,
  props: Qu,
  emits: Xu,
  setup(e, {
    expose: t,
    emit: n
  }) {
    const r = ae(), a = V(Pt);
    a || hn(ur, "<el-tabs><tab-nav /></el-tabs>");
    const o = W("tabs"), s = ao(), i = po(), h = E(), d = E(), p = E(), b = E(), g = E(!1), c = E(0), l = E(!1), u = E(!0), v = $(() => ["top", "bottom"].includes(a.props.tabPosition) ? "width" : "height"), f = $(() => ({
      transform: `translate${v.value === "width" ? "X" : "Y"}(-${c.value}px)`
    })), k = () => {
      if (!h.value)
        return;
      const w = h.value[`offset${Ce(v.value)}`], x = c.value;
      if (!x)
        return;
      const S = x > w ? x - w : 0;
      c.value = S;
    }, y = () => {
      if (!h.value || !d.value)
        return;
      const w = d.value[`offset${Ce(v.value)}`], x = h.value[`offset${Ce(v.value)}`], S = c.value;
      if (w - S <= x)
        return;
      const R = w - S > x * 2 ? S + x : w - x;
      c.value = R;
    }, _ = async () => {
      const w = d.value;
      if (!g.value || !p.value || !h.value || !w)
        return;
      await $e();
      const x = p.value.querySelector(".is-active");
      if (!x)
        return;
      const S = h.value, R = ["top", "bottom"].includes(a.props.tabPosition), G = x.getBoundingClientRect(), U = S.getBoundingClientRect(), X = R ? w.offsetWidth - U.width : w.offsetHeight - U.height, Y = c.value;
      let C = Y;
      R ? (G.left < U.left && (C = Y - (U.left - G.left)), G.right > U.right && (C = Y + G.right - U.right)) : (G.top < U.top && (C = Y - (U.top - G.top)), G.bottom > U.bottom && (C = Y + (G.bottom - U.bottom))), C = Math.max(C, 0), c.value = Math.min(C, X);
    }, N = () => {
      var w;
      if (!d.value || !h.value)
        return;
      e.stretch && ((w = b.value) == null || w.update());
      const x = d.value[`offset${Ce(v.value)}`], S = h.value[`offset${Ce(v.value)}`], R = c.value;
      S < x ? (g.value = g.value || {}, g.value.prev = R, g.value.next = R + S < x, x - R < S && (c.value = x - S)) : (g.value = !1, R > 0 && (c.value = 0));
    }, M = (w) => {
      const x = w.code, {
        up: S,
        down: R,
        left: G,
        right: U
      } = de;
      if (![S, R, G, U].includes(x))
        return;
      const X = Array.from(w.currentTarget.querySelectorAll("[role=tab]:not(.is-disabled)")), Y = X.indexOf(w.target);
      let C;
      x === G || x === S ? Y === 0 ? C = X.length - 1 : C = Y - 1 : Y < X.length - 1 ? C = Y + 1 : C = 0, X[C].focus({
        preventScroll: !0
      }), X[C].click(), O();
    }, O = () => {
      u.value && (l.value = !0);
    }, F = () => l.value = !1;
    return z(s, (w) => {
      w === "hidden" ? u.value = !1 : w === "visible" && setTimeout(() => u.value = !0, 50);
    }), z(i, (w) => {
      w ? setTimeout(() => u.value = !0, 50) : u.value = !1;
    }), yr(p, N), ot(() => setTimeout(() => _(), 0)), pr(() => N()), t({
      scrollToActiveTab: _,
      removeFocus: F
    }), z(() => e.panes, () => r.update(), {
      flush: "post",
      deep: !0
    }), () => {
      const w = g.value ? [T("span", {
        class: [o.e("nav-prev"), o.is("disabled", !g.value.prev)],
        onClick: k
      }, [T(De, null, {
        default: () => [T(va, null, null)]
      })]), T("span", {
        class: [o.e("nav-next"), o.is("disabled", !g.value.next)],
        onClick: y
      }, [T(De, null, {
        default: () => [T(ga, null, null)]
      })])] : null, x = e.panes.map((S, R) => {
        var G, U, X, Y;
        const C = S.uid, P = S.props.disabled, te = (U = (G = S.props.name) != null ? G : S.index) != null ? U : `${R}`, I = !P && (S.isClosable || e.editable);
        S.index = `${R}`;
        const ne = I ? T(De, {
          class: "is-icon-close",
          onClick: (J) => n("tabRemove", S, J)
        }, {
          default: () => [T(ba, null, null)]
        }) : null, lt = ((Y = (X = S.slots).label) == null ? void 0 : Y.call(X)) || S.props.label, se = !P && S.active ? 0 : -1;
        return T("div", {
          ref: `tab-${C}`,
          class: [o.e("item"), o.is(a.props.tabPosition), o.is("active", S.active), o.is("disabled", P), o.is("closable", I), o.is("focus", l.value)],
          id: `tab-${te}`,
          key: `tab-${C}`,
          "aria-controls": `pane-${te}`,
          role: "tab",
          "aria-selected": S.active,
          tabindex: se,
          onFocus: () => O(),
          onBlur: () => F(),
          onClick: (J) => {
            F(), n("tabClick", S, te, J);
          },
          onKeydown: (J) => {
            I && (J.code === de.delete || J.code === de.backspace) && n("tabRemove", S, J);
          }
        }, [lt, ne]);
      });
      return T("div", {
        ref: p,
        class: [o.e("nav-wrap"), o.is("scrollable", !!g.value), o.is(a.props.tabPosition)]
      }, [w, T("div", {
        class: o.e("nav-scroll"),
        ref: h
      }, [T("div", {
        class: [o.e("nav"), o.is(a.props.tabPosition), o.is("stretch", e.stretch && ["top", "bottom"].includes(a.props.tabPosition))],
        ref: d,
        style: f.value,
        role: "tablist",
        onKeydown: M
      }, [e.type ? null : T(Ju, {
        ref: b,
        tabs: [...e.panes]
      }, null), x])])]);
    };
  }
}), ec = Ne({
  type: {
    type: String,
    values: ["card", "border-card", ""],
    default: ""
  },
  activeName: {
    type: [String, Number]
  },
  closable: Boolean,
  addable: Boolean,
  modelValue: {
    type: [String, Number]
  },
  editable: Boolean,
  tabPosition: {
    type: String,
    values: ["top", "right", "bottom", "left"],
    default: "top"
  },
  beforeLeave: {
    type: oe(Function),
    default: () => !0
  },
  stretch: Boolean
}), jt = (e) => Le(e) || Ue(e), tc = {
  [Je]: (e) => jt(e),
  tabClick: (e, t) => t instanceof Event,
  tabChange: (e) => jt(e),
  edit: (e, t) => ["remove", "add"].includes(t),
  tabRemove: (e) => jt(e),
  tabAdd: () => !0
};
var nc = B({
  name: "ElTabs",
  props: ec,
  emits: tc,
  setup(e, {
    emit: t,
    slots: n,
    expose: r
  }) {
    var a, o;
    const s = W("tabs"), {
      children: i,
      addChild: h,
      removeChild: d
    } = Pd(ae(), "ElTabPane"), p = E(), b = E((o = (a = e.modelValue) != null ? a : e.activeName) != null ? o : "0"), g = (f) => {
      b.value = f, t(Je, f), t("tabChange", f);
    }, c = async (f) => {
      var k, y, _;
      if (!(b.value === f || Ge(f)))
        try {
          await ((k = e.beforeLeave) == null ? void 0 : k.call(e, f, b.value)) !== !1 && (g(f), (_ = (y = p.value) == null ? void 0 : y.removeFocus) == null || _.call(y));
        } catch {
        }
    }, l = (f, k, y) => {
      f.props.disabled || (c(k), t("tabClick", f, y));
    }, u = (f, k) => {
      f.props.disabled || Ge(f.props.name) || (k.stopPropagation(), t("edit", f.props.name, "remove"), t("tabRemove", f.props.name));
    }, v = () => {
      t("edit", void 0, "add"), t("tabAdd");
    };
    return Lr({
      from: '"activeName"',
      replacement: '"model-value" or "v-model"',
      scope: "ElTabs",
      version: "2.3.0",
      ref: "https://element-plus.org/en-US/component/tabs.html#attributes",
      type: "Attribute"
    }, $(() => !!e.activeName)), z(() => e.activeName, (f) => c(f)), z(() => e.modelValue, (f) => c(f)), z(b, async () => {
      var f;
      await $e(), (f = p.value) == null || f.scrollToActiveTab();
    }), ve(Pt, {
      props: e,
      currentName: b,
      registerPane: h,
      unregisterPane: d
    }), r({
      currentName: b
    }), () => {
      const f = e.editable || e.addable ? T("span", {
        class: s.e("new-tab"),
        tabindex: "0",
        onClick: v,
        onKeydown: (_) => {
          _.code === de.enter && v();
        }
      }, [T(De, {
        class: s.is("icon-plus")
      }, {
        default: () => [T(ma, null, null)]
      })]) : null, k = T("div", {
        class: [s.e("header"), s.is(e.tabPosition)]
      }, [f, T(Zu, {
        ref: p,
        currentName: b.value,
        editable: e.editable,
        type: e.type,
        panes: i.value,
        stretch: e.stretch,
        onTabClick: l,
        onTabRemove: u
      }, null)]), y = T("div", {
        class: s.e("content")
      }, [Z(n, "default")]);
      return T("div", {
        class: [s.b(), s.m(e.tabPosition), {
          [s.m("card")]: e.type === "card",
          [s.m("border-card")]: e.type === "border-card"
        }]
      }, [...e.tabPosition !== "bottom" ? [k, y] : [y, k]]);
    };
  }
});
const rc = Ne({
  label: {
    type: String,
    default: ""
  },
  name: {
    type: [String, Number]
  },
  closable: Boolean,
  disabled: Boolean,
  lazy: Boolean
}), ac = ["id", "aria-hidden", "aria-labelledby"], Qr = "ElTabPane", oc = B({
  name: Qr
}), sc = /* @__PURE__ */ B({
  ...oc,
  props: rc,
  setup(e) {
    const t = e, n = ae(), r = St(), a = V(Pt);
    a || hn(Qr, "usage: <el-tabs><el-tab-pane /></el-tabs/>");
    const o = W("tab-pane"), s = E(), i = $(() => t.closable || a.props.closable), h = En(() => {
      var c;
      return a.currentName.value === ((c = t.name) != null ? c : s.value);
    }), d = E(h.value), p = $(() => {
      var c;
      return (c = t.name) != null ? c : s.value;
    }), b = En(() => !t.lazy || d.value || h.value);
    z(h, (c) => {
      c && (d.value = !0);
    });
    const g = tt({
      uid: n.uid,
      slots: r,
      props: t,
      paneName: p,
      active: h,
      index: s,
      isClosable: i
    });
    return ot(() => {
      a.registerPane(g);
    }), hr(() => {
      a.unregisterPane(g.uid);
    }), (c, l) => m(b) ? Te((A(), H("div", {
      key: 0,
      id: `pane-${m(p)}`,
      class: K(m(o).b()),
      role: "tabpanel",
      "aria-hidden": !m(h),
      "aria-labelledby": `tab-${m(p)}`
    }, [
      Z(c.$slots, "default")
    ], 10, ac)), [
      [yt, m(h)]
    ]) : ce("v-if", !0);
  }
});
var Xr = /* @__PURE__ */ ee(sc, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/tabs/src/tab-pane.vue"]]);
const ic = Ye(nc, {
  TabPane: Xr
}), lc = At(Xr), ze = "$treeNodeId", cr = function(e, t) {
  !t || t[ze] || Object.defineProperty(t, ze, {
    value: e.id,
    enumerable: !1,
    configurable: !1,
    writable: !1
  });
}, mn = function(e, t) {
  return e ? t[e] : t[ze];
}, tn = (e, t, n) => {
  const r = e.value.currentNode;
  n();
  const a = e.value.currentNode;
  r !== a && t("current-change", a ? a.data : null, a);
}, nn = (e) => {
  let t = !0, n = !0, r = !0;
  for (let a = 0, o = e.length; a < o; a++) {
    const s = e[a];
    (s.checked !== !0 || s.indeterminate) && (t = !1, s.disabled || (r = !1)), (s.checked !== !1 || s.indeterminate) && (n = !1);
  }
  return { all: t, none: n, allWithoutDisable: r, half: !t && !n };
}, vt = function(e) {
  if (e.childNodes.length === 0 || e.loading)
    return;
  const { all: t, none: n, half: r } = nn(e.childNodes);
  t ? (e.checked = !0, e.indeterminate = !1) : r ? (e.checked = !1, e.indeterminate = !0) : n && (e.checked = !1, e.indeterminate = !1);
  const a = e.parent;
  !a || a.level === 0 || e.store.checkStrictly || vt(a);
}, ft = function(e, t) {
  const n = e.store.props, r = e.data || {}, a = n[t];
  if (typeof a == "function")
    return a(r, e);
  if (typeof a == "string")
    return r[a];
  if (typeof a > "u") {
    const o = r[t];
    return o === void 0 ? "" : o;
  }
};
let dc = 0;
class Be {
  constructor(t) {
    this.id = dc++, this.text = null, this.checked = !1, this.indeterminate = !1, this.data = null, this.expanded = !1, this.parent = null, this.visible = !0, this.isCurrent = !1, this.canFocus = !1;
    for (const n in t)
      nt(t, n) && (this[n] = t[n]);
    this.level = 0, this.loaded = !1, this.childNodes = [], this.loading = !1, this.parent && (this.level = this.parent.level + 1);
  }
  initialize() {
    const t = this.store;
    if (!t)
      throw new Error("[Node]store is required!");
    t.registerNode(this);
    const n = t.props;
    if (n && typeof n.isLeaf < "u") {
      const o = ft(this, "isLeaf");
      typeof o == "boolean" && (this.isLeafByUser = o);
    }
    if (t.lazy !== !0 && this.data ? (this.setData(this.data), t.defaultExpandAll && (this.expanded = !0, this.canFocus = !0)) : this.level > 0 && t.lazy && t.defaultExpandAll && this.expand(), Array.isArray(this.data) || cr(this, this.data), !this.data)
      return;
    const r = t.defaultExpandedKeys, a = t.key;
    a && r && r.includes(this.key) && this.expand(null, t.autoExpandParent), a && t.currentNodeKey !== void 0 && this.key === t.currentNodeKey && (t.currentNode = this, t.currentNode.isCurrent = !0), t.lazy && t._initDefaultCheckedNode(this), this.updateLeafState(), this.parent && (this.level === 1 || this.parent.expanded === !0) && (this.canFocus = !0);
  }
  setData(t) {
    Array.isArray(t) || cr(this, t), this.data = t, this.childNodes = [];
    let n;
    this.level === 0 && Array.isArray(this.data) ? n = this.data : n = ft(this, "children") || [];
    for (let r = 0, a = n.length; r < a; r++)
      this.insertChild({ data: n[r] });
  }
  get label() {
    return ft(this, "label");
  }
  get key() {
    const t = this.store.key;
    return this.data ? this.data[t] : null;
  }
  get disabled() {
    return ft(this, "disabled");
  }
  get nextSibling() {
    const t = this.parent;
    if (t) {
      const n = t.childNodes.indexOf(this);
      if (n > -1)
        return t.childNodes[n + 1];
    }
    return null;
  }
  get previousSibling() {
    const t = this.parent;
    if (t) {
      const n = t.childNodes.indexOf(this);
      if (n > -1)
        return n > 0 ? t.childNodes[n - 1] : null;
    }
    return null;
  }
  contains(t, n = !0) {
    return (this.childNodes || []).some((r) => r === t || n && r.contains(t));
  }
  remove() {
    const t = this.parent;
    t && t.removeChild(this);
  }
  insertChild(t, n, r) {
    if (!t)
      throw new Error("InsertChild error: child is required.");
    if (!(t instanceof Be)) {
      if (!r) {
        const a = this.getChildren(!0);
        a.includes(t.data) || (typeof n > "u" || n < 0 ? a.push(t.data) : a.splice(n, 0, t.data));
      }
      Object.assign(t, {
        parent: this,
        store: this.store
      }), t = tt(new Be(t)), t instanceof Be && t.initialize();
    }
    t.level = this.level + 1, typeof n > "u" || n < 0 ? this.childNodes.push(t) : this.childNodes.splice(n, 0, t), this.updateLeafState();
  }
  insertBefore(t, n) {
    let r;
    n && (r = this.childNodes.indexOf(n)), this.insertChild(t, r);
  }
  insertAfter(t, n) {
    let r;
    n && (r = this.childNodes.indexOf(n), r !== -1 && (r += 1)), this.insertChild(t, r);
  }
  removeChild(t) {
    const n = this.getChildren() || [], r = n.indexOf(t.data);
    r > -1 && n.splice(r, 1);
    const a = this.childNodes.indexOf(t);
    a > -1 && (this.store && this.store.deregisterNode(t), t.parent = null, this.childNodes.splice(a, 1)), this.updateLeafState();
  }
  removeChildByData(t) {
    let n = null;
    for (let r = 0; r < this.childNodes.length; r++)
      if (this.childNodes[r].data === t) {
        n = this.childNodes[r];
        break;
      }
    n && this.removeChild(n);
  }
  expand(t, n) {
    const r = () => {
      if (n) {
        let a = this.parent;
        for (; a.level > 0; )
          a.expanded = !0, a = a.parent;
      }
      this.expanded = !0, t && t(), this.childNodes.forEach((a) => {
        a.canFocus = !0;
      });
    };
    this.shouldLoadData() ? this.loadData((a) => {
      Array.isArray(a) && (this.checked ? this.setChecked(!0, !0) : this.store.checkStrictly || vt(this), r());
    }) : r();
  }
  doCreateChildren(t, n = {}) {
    t.forEach((r) => {
      this.insertChild(Object.assign({ data: r }, n), void 0, !0);
    });
  }
  collapse() {
    this.expanded = !1, this.childNodes.forEach((t) => {
      t.canFocus = !1;
    });
  }
  shouldLoadData() {
    return this.store.lazy === !0 && this.store.load && !this.loaded;
  }
  updateLeafState() {
    if (this.store.lazy === !0 && this.loaded !== !0 && typeof this.isLeafByUser < "u") {
      this.isLeaf = this.isLeafByUser;
      return;
    }
    const t = this.childNodes;
    if (!this.store.lazy || this.store.lazy === !0 && this.loaded === !0) {
      this.isLeaf = !t || t.length === 0;
      return;
    }
    this.isLeaf = !1;
  }
  setChecked(t, n, r, a) {
    if (this.indeterminate = t === "half", this.checked = t === !0, this.store.checkStrictly)
      return;
    if (!(this.shouldLoadData() && !this.store.checkDescendants)) {
      const { all: s, allWithoutDisable: i } = nn(this.childNodes);
      !this.isLeaf && !s && i && (this.checked = !1, t = !1);
      const h = () => {
        if (n) {
          const d = this.childNodes;
          for (let g = 0, c = d.length; g < c; g++) {
            const l = d[g];
            a = a || t !== !1;
            const u = l.disabled ? l.checked : a;
            l.setChecked(u, n, !0, a);
          }
          const { half: p, all: b } = nn(d);
          b || (this.checked = b, this.indeterminate = p);
        }
      };
      if (this.shouldLoadData()) {
        this.loadData(() => {
          h(), vt(this);
        }, {
          checked: t !== !1
        });
        return;
      } else
        h();
    }
    const o = this.parent;
    !o || o.level === 0 || r || vt(o);
  }
  getChildren(t = !1) {
    if (this.level === 0)
      return this.data;
    const n = this.data;
    if (!n)
      return null;
    const r = this.store.props;
    let a = "children";
    return r && (a = r.children || "children"), n[a] === void 0 && (n[a] = null), t && !n[a] && (n[a] = []), n[a];
  }
  updateChildren() {
    const t = this.getChildren() || [], n = this.childNodes.map((o) => o.data), r = {}, a = [];
    t.forEach((o, s) => {
      const i = o[ze];
      !!i && n.findIndex((d) => d[ze] === i) >= 0 ? r[i] = { index: s, data: o } : a.push({ index: s, data: o });
    }), this.store.lazy || n.forEach((o) => {
      r[o[ze]] || this.removeChildByData(o);
    }), a.forEach(({ index: o, data: s }) => {
      this.insertChild({ data: s }, o);
    }), this.updateLeafState();
  }
  loadData(t, n = {}) {
    if (this.store.lazy === !0 && this.store.load && !this.loaded && (!this.loading || Object.keys(n).length)) {
      this.loading = !0;
      const r = (a) => {
        this.childNodes = [], this.doCreateChildren(a, n), this.loaded = !0, this.loading = !1, this.updateLeafState(), t && t.call(this, a);
      };
      this.store.load(this, r);
    } else
      t && t.call(this);
  }
}
class uc {
  constructor(t) {
    this.currentNode = null, this.currentNodeKey = null;
    for (const n in t)
      nt(t, n) && (this[n] = t[n]);
    this.nodesMap = {};
  }
  initialize() {
    if (this.root = new Be({
      data: this.data,
      store: this
    }), this.root.initialize(), this.lazy && this.load) {
      const t = this.load;
      t(this.root, (n) => {
        this.root.doCreateChildren(n), this._initDefaultCheckedNodes();
      });
    } else
      this._initDefaultCheckedNodes();
  }
  filter(t) {
    const n = this.filterNodeMethod, r = this.lazy, a = function(o) {
      const s = o.root ? o.root.childNodes : o.childNodes;
      if (s.forEach((i) => {
        i.visible = n.call(i, t, i.data, i), a(i);
      }), !o.visible && s.length) {
        let i = !0;
        i = !s.some((h) => h.visible), o.root ? o.root.visible = i === !1 : o.visible = i === !1;
      }
      t && o.visible && !o.isLeaf && !r && o.expand();
    };
    a(this);
  }
  setData(t) {
    t !== this.root.data ? (this.root.setData(t), this._initDefaultCheckedNodes()) : this.root.updateChildren();
  }
  getNode(t) {
    if (t instanceof Be)
      return t;
    const n = it(t) ? mn(this.key, t) : t;
    return this.nodesMap[n] || null;
  }
  insertBefore(t, n) {
    const r = this.getNode(n);
    r.parent.insertBefore({ data: t }, r);
  }
  insertAfter(t, n) {
    const r = this.getNode(n);
    r.parent.insertAfter({ data: t }, r);
  }
  remove(t) {
    const n = this.getNode(t);
    n && n.parent && (n === this.currentNode && (this.currentNode = null), n.parent.removeChild(n));
  }
  append(t, n) {
    const r = n ? this.getNode(n) : this.root;
    r && r.insertChild({ data: t });
  }
  _initDefaultCheckedNodes() {
    const t = this.defaultCheckedKeys || [], n = this.nodesMap;
    t.forEach((r) => {
      const a = n[r];
      a && a.setChecked(!0, !this.checkStrictly);
    });
  }
  _initDefaultCheckedNode(t) {
    (this.defaultCheckedKeys || []).includes(t.key) && t.setChecked(!0, !this.checkStrictly);
  }
  setDefaultCheckedKey(t) {
    t !== this.defaultCheckedKeys && (this.defaultCheckedKeys = t, this._initDefaultCheckedNodes());
  }
  registerNode(t) {
    const n = this.key;
    !t || !t.data || (n ? t.key !== void 0 && (this.nodesMap[t.key] = t) : this.nodesMap[t.id] = t);
  }
  deregisterNode(t) {
    !this.key || !t || !t.data || (t.childNodes.forEach((r) => {
      this.deregisterNode(r);
    }), delete this.nodesMap[t.key]);
  }
  getCheckedNodes(t = !1, n = !1) {
    const r = [], a = function(o) {
      (o.root ? o.root.childNodes : o.childNodes).forEach((i) => {
        (i.checked || n && i.indeterminate) && (!t || t && i.isLeaf) && r.push(i.data), a(i);
      });
    };
    return a(this), r;
  }
  getCheckedKeys(t = !1) {
    return this.getCheckedNodes(t).map((n) => (n || {})[this.key]);
  }
  getHalfCheckedNodes() {
    const t = [], n = function(r) {
      (r.root ? r.root.childNodes : r.childNodes).forEach((o) => {
        o.indeterminate && t.push(o.data), n(o);
      });
    };
    return n(this), t;
  }
  getHalfCheckedKeys() {
    return this.getHalfCheckedNodes().map((t) => (t || {})[this.key]);
  }
  _getAllNodes() {
    const t = [], n = this.nodesMap;
    for (const r in n)
      nt(n, r) && t.push(n[r]);
    return t;
  }
  updateChildren(t, n) {
    const r = this.nodesMap[t];
    if (!r)
      return;
    const a = r.childNodes;
    for (let o = a.length - 1; o >= 0; o--) {
      const s = a[o];
      this.remove(s.data);
    }
    for (let o = 0, s = n.length; o < s; o++) {
      const i = n[o];
      this.append(i, r.data);
    }
  }
  _setCheckedKeys(t, n = !1, r) {
    const a = this._getAllNodes().sort((i, h) => h.level - i.level), o = /* @__PURE__ */ Object.create(null), s = Object.keys(r);
    a.forEach((i) => i.setChecked(!1, !1));
    for (let i = 0, h = a.length; i < h; i++) {
      const d = a[i], p = d.data[t].toString();
      if (!s.includes(p)) {
        d.checked && !o[p] && d.setChecked(!1, !1);
        continue;
      }
      let g = d.parent;
      for (; g && g.level > 0; )
        o[g.data[t]] = !0, g = g.parent;
      if (d.isLeaf || this.checkStrictly) {
        d.setChecked(!0, !1);
        continue;
      }
      if (d.setChecked(!0, !0), n) {
        d.setChecked(!1, !1);
        const c = function(l) {
          l.childNodes.forEach((v) => {
            v.isLeaf || v.setChecked(!1, !1), c(v);
          });
        };
        c(d);
      }
    }
  }
  setCheckedNodes(t, n = !1) {
    const r = this.key, a = {};
    t.forEach((o) => {
      a[(o || {})[r]] = !0;
    }), this._setCheckedKeys(r, n, a);
  }
  setCheckedKeys(t, n = !1) {
    this.defaultCheckedKeys = t;
    const r = this.key, a = {};
    t.forEach((o) => {
      a[o] = !0;
    }), this._setCheckedKeys(r, n, a);
  }
  setDefaultExpandedKeys(t) {
    t = t || [], this.defaultExpandedKeys = t, t.forEach((n) => {
      const r = this.getNode(n);
      r && r.expand(null, this.autoExpandParent);
    });
  }
  setChecked(t, n, r) {
    const a = this.getNode(t);
    a && a.setChecked(!!n, r);
  }
  getCurrentNode() {
    return this.currentNode;
  }
  setCurrentNode(t) {
    const n = this.currentNode;
    n && (n.isCurrent = !1), this.currentNode = t, this.currentNode.isCurrent = !0;
  }
  setUserCurrentNode(t, n = !0) {
    const r = t[this.key], a = this.nodesMap[r];
    this.setCurrentNode(a), n && this.currentNode.level > 1 && this.currentNode.parent.expand(null, !0);
  }
  setCurrentNodeKey(t, n = !0) {
    if (t == null) {
      this.currentNode && (this.currentNode.isCurrent = !1), this.currentNode = null;
      return;
    }
    const r = this.getNode(t);
    r && (this.setCurrentNode(r), n && this.currentNode.level > 1 && this.currentNode.parent.expand(null, !0));
  }
}
const cc = B({
  name: "ElTreeNodeContent",
  props: {
    node: {
      type: Object,
      required: !0
    },
    renderContent: Function
  },
  setup(e) {
    const t = W("tree"), n = V("NodeInstance"), r = V("RootTree");
    return () => {
      const a = e.node, { data: o, store: s } = a;
      return e.renderContent ? e.renderContent(wn, { _self: n, node: a, data: o, store: s }) : r.ctx.slots.default ? r.ctx.slots.default({ node: a, data: o }) : wn("span", { class: t.be("node", "label") }, [a.label]);
    };
  }
});
var fc = /* @__PURE__ */ ee(cc, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/tree/src/tree-node-content.vue"]]);
function Zr(e) {
  const t = V("TreeNodeMap", null), n = {
    treeNodeExpand: (r) => {
      e.node !== r && e.node.collapse();
    },
    children: []
  };
  return t && t.children.push(n), ve("TreeNodeMap", n), {
    broadcastExpanded: (r) => {
      if (e.accordion)
        for (const a of n.children)
          a.treeNodeExpand(r);
    }
  };
}
const ea = Symbol("dragEvents");
function hc({ props: e, ctx: t, el$: n, dropIndicator$: r, store: a }) {
  const o = W("tree"), s = E({
    showDropIndicator: !1,
    draggingNode: null,
    dropNode: null,
    allowDrop: !0,
    dropType: null
  });
  return ve(ea, {
    treeNodeDragStart: ({ event: p, treeNode: b }) => {
      if (typeof e.allowDrag == "function" && !e.allowDrag(b.node))
        return p.preventDefault(), !1;
      p.dataTransfer.effectAllowed = "move";
      try {
        p.dataTransfer.setData("text/plain", "");
      } catch {
      }
      s.value.draggingNode = b, t.emit("node-drag-start", b.node, p);
    },
    treeNodeDragOver: ({ event: p, treeNode: b }) => {
      const g = b, c = s.value.dropNode;
      c && c.node.id !== g.node.id && Bt(c.$el, o.is("drop-inner"));
      const l = s.value.draggingNode;
      if (!l || !g)
        return;
      let u = !0, v = !0, f = !0, k = !0;
      typeof e.allowDrop == "function" && (u = e.allowDrop(l.node, g.node, "prev"), k = v = e.allowDrop(l.node, g.node, "inner"), f = e.allowDrop(l.node, g.node, "next")), p.dataTransfer.dropEffect = v || u || f ? "move" : "none", (u || v || f) && (c == null ? void 0 : c.node.id) !== g.node.id && (c && t.emit("node-drag-leave", l.node, c.node, p), t.emit("node-drag-enter", l.node, g.node, p)), (u || v || f) && (s.value.dropNode = g), g.node.nextSibling === l.node && (f = !1), g.node.previousSibling === l.node && (u = !1), g.node.contains(l.node, !1) && (v = !1), (l.node === g.node || l.node.contains(g.node)) && (u = !1, v = !1, f = !1);
      const y = g.$el.querySelector(`.${o.be("node", "content")}`).getBoundingClientRect(), _ = n.value.getBoundingClientRect();
      let N;
      const M = u ? v ? 0.25 : f ? 0.45 : 1 : -1, O = f ? v ? 0.75 : u ? 0.55 : 0 : 1;
      let F = -9999;
      const w = p.clientY - y.top;
      w < y.height * M ? N = "before" : w > y.height * O ? N = "after" : v ? N = "inner" : N = "none";
      const x = g.$el.querySelector(`.${o.be("node", "expand-icon")}`).getBoundingClientRect(), S = r.value;
      N === "before" ? F = x.top - _.top : N === "after" && (F = x.bottom - _.top), S.style.top = `${F}px`, S.style.left = `${x.right - _.left}px`, N === "inner" ? gd(g.$el, o.is("drop-inner")) : Bt(g.$el, o.is("drop-inner")), s.value.showDropIndicator = N === "before" || N === "after", s.value.allowDrop = s.value.showDropIndicator || k, s.value.dropType = N, t.emit("node-drag-over", l.node, g.node, p);
    },
    treeNodeDragEnd: (p) => {
      const { draggingNode: b, dropType: g, dropNode: c } = s.value;
      if (p.preventDefault(), p.dataTransfer.dropEffect = "move", b && c) {
        const l = { data: b.node.data };
        g !== "none" && b.node.remove(), g === "before" ? c.node.parent.insertBefore(l, c.node) : g === "after" ? c.node.parent.insertAfter(l, c.node) : g === "inner" && c.node.insertChild(l), g !== "none" && a.value.registerNode(l), Bt(c.$el, o.is("drop-inner")), t.emit("node-drag-end", b.node, c.node, g, p), g !== "none" && t.emit("node-drop", b.node, c.node, g, p);
      }
      b && !c && t.emit("node-drag-end", b.node, null, g, p), s.value.showDropIndicator = !1, s.value.draggingNode = null, s.value.dropNode = null, s.value.allowDrop = !0;
    }
  }), {
    dragState: s
  };
}
const pc = B({
  name: "ElTreeNode",
  components: {
    ElCollapseTransition: Uu,
    ElCheckbox: Ou,
    NodeContent: fc,
    ElIcon: De,
    Loading: vr
  },
  props: {
    node: {
      type: Be,
      default: () => ({})
    },
    props: {
      type: Object,
      default: () => ({})
    },
    accordion: Boolean,
    renderContent: Function,
    renderAfterExpand: Boolean,
    showCheckbox: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["node-expand"],
  setup(e, t) {
    const n = W("tree"), { broadcastExpanded: r } = Zr(e), a = V("RootTree"), o = E(!1), s = E(!1), i = E(null), h = E(null), d = E(null), p = V(ea), b = ae();
    ve("NodeInstance", b), a || We("Tree", "Can not find node's tree."), e.node.expanded && (o.value = !0, s.value = !0);
    const g = a.props.props.children || "children";
    z(() => {
      const w = e.node.data[g];
      return w && [...w];
    }, () => {
      e.node.updateChildren();
    }), z(() => e.node.indeterminate, (w) => {
      u(e.node.checked, w);
    }), z(() => e.node.checked, (w) => {
      u(w, e.node.indeterminate);
    }), z(() => e.node.expanded, (w) => {
      $e(() => o.value = w), w && (s.value = !0);
    });
    const c = (w) => mn(a.props.nodeKey, w.data), l = (w) => {
      const x = e.props.class;
      if (!x)
        return {};
      let S;
      if (bo(x)) {
        const { data: R } = w;
        S = x(R, w);
      } else
        S = x;
      return Le(S) ? { [S]: !0 } : S;
    }, u = (w, x) => {
      (i.value !== w || h.value !== x) && a.ctx.emit("check-change", e.node.data, w, x), i.value = w, h.value = x;
    }, v = (w) => {
      tn(a.store, a.ctx.emit, () => a.store.value.setCurrentNode(e.node)), a.currentNode.value = e.node, a.props.expandOnClickNode && k(), a.props.checkOnClickNode && !e.node.disabled && y(null, {
        target: { checked: !e.node.checked }
      }), a.ctx.emit("node-click", e.node.data, e.node, b, w);
    }, f = (w) => {
      a.instance.vnode.props.onNodeContextmenu && (w.stopPropagation(), w.preventDefault()), a.ctx.emit("node-contextmenu", w, e.node.data, e.node, b);
    }, k = () => {
      e.node.isLeaf || (o.value ? (a.ctx.emit("node-collapse", e.node.data, e.node, b), e.node.collapse()) : (e.node.expand(), t.emit("node-expand", e.node.data, e.node, b)));
    }, y = (w, x) => {
      e.node.setChecked(x.target.checked, !a.props.checkStrictly), $e(() => {
        const S = a.store.value;
        a.ctx.emit("check", e.node.data, {
          checkedNodes: S.getCheckedNodes(),
          checkedKeys: S.getCheckedKeys(),
          halfCheckedNodes: S.getHalfCheckedNodes(),
          halfCheckedKeys: S.getHalfCheckedKeys()
        });
      });
    };
    return {
      ns: n,
      node$: d,
      tree: a,
      expanded: o,
      childNodeRendered: s,
      oldChecked: i,
      oldIndeterminate: h,
      getNodeKey: c,
      getNodeClass: l,
      handleSelectChange: u,
      handleClick: v,
      handleContextMenu: f,
      handleExpandIconClick: k,
      handleCheckChange: y,
      handleChildNodeExpand: (w, x, S) => {
        r(x), a.ctx.emit("node-expand", w, x, S);
      },
      handleDragStart: (w) => {
        a.props.draggable && p.treeNodeDragStart({ event: w, treeNode: e });
      },
      handleDragOver: (w) => {
        w.preventDefault(), a.props.draggable && p.treeNodeDragOver({
          event: w,
          treeNode: { $el: d.value, node: e.node }
        });
      },
      handleDrop: (w) => {
        w.preventDefault();
      },
      handleDragEnd: (w) => {
        a.props.draggable && p.treeNodeDragEnd(w);
      },
      CaretRight: ya
    };
  }
}), vc = ["aria-expanded", "aria-disabled", "aria-checked", "draggable", "data-key"], gc = ["aria-expanded"];
function bc(e, t, n, r, a, o) {
  const s = Oe("el-icon"), i = Oe("el-checkbox"), h = Oe("loading"), d = Oe("node-content"), p = Oe("el-tree-node"), b = Oe("el-collapse-transition");
  return Te((A(), H("div", {
    ref: "node$",
    class: K([
      e.ns.b("node"),
      e.ns.is("expanded", e.expanded),
      e.ns.is("current", e.node.isCurrent),
      e.ns.is("hidden", !e.node.visible),
      e.ns.is("focusable", !e.node.disabled),
      e.ns.is("checked", !e.node.disabled && e.node.checked),
      e.getNodeClass(e.node)
    ]),
    role: "treeitem",
    tabindex: "-1",
    "aria-expanded": e.expanded,
    "aria-disabled": e.node.disabled,
    "aria-checked": e.node.checked,
    draggable: e.tree.props.draggable,
    "data-key": e.getNodeKey(e.node),
    onClick: t[1] || (t[1] = le((...g) => e.handleClick && e.handleClick(...g), ["stop"])),
    onContextmenu: t[2] || (t[2] = (...g) => e.handleContextMenu && e.handleContextMenu(...g)),
    onDragstart: t[3] || (t[3] = le((...g) => e.handleDragStart && e.handleDragStart(...g), ["stop"])),
    onDragover: t[4] || (t[4] = le((...g) => e.handleDragOver && e.handleDragOver(...g), ["stop"])),
    onDragend: t[5] || (t[5] = le((...g) => e.handleDragEnd && e.handleDragEnd(...g), ["stop"])),
    onDrop: t[6] || (t[6] = le((...g) => e.handleDrop && e.handleDrop(...g), ["stop"]))
  }, [
    ue("div", {
      class: K(e.ns.be("node", "content")),
      style: st({ paddingLeft: (e.node.level - 1) * e.tree.props.indent + "px" })
    }, [
      e.tree.props.icon || e.CaretRight ? (A(), q(s, {
        key: 0,
        class: K([
          e.ns.be("node", "expand-icon"),
          e.ns.is("leaf", e.node.isLeaf),
          {
            expanded: !e.node.isLeaf && e.expanded
          }
        ]),
        onClick: le(e.handleExpandIconClick, ["stop"])
      }, {
        default: D(() => [
          (A(), q(Se(e.tree.props.icon || e.CaretRight)))
        ]),
        _: 1
      }, 8, ["class", "onClick"])) : ce("v-if", !0),
      e.showCheckbox ? (A(), q(i, {
        key: 1,
        "model-value": e.node.checked,
        indeterminate: e.node.indeterminate,
        disabled: !!e.node.disabled,
        onClick: t[0] || (t[0] = le(() => {
        }, ["stop"])),
        onChange: e.handleCheckChange
      }, null, 8, ["model-value", "indeterminate", "disabled", "onChange"])) : ce("v-if", !0),
      e.node.loading ? (A(), q(s, {
        key: 2,
        class: K([e.ns.be("node", "loading-icon"), e.ns.is("loading")])
      }, {
        default: D(() => [
          T(h)
        ]),
        _: 1
      }, 8, ["class"])) : ce("v-if", !0),
      T(d, {
        node: e.node,
        "render-content": e.renderContent
      }, null, 8, ["node", "render-content"])
    ], 6),
    T(b, null, {
      default: D(() => [
        !e.renderAfterExpand || e.childNodeRendered ? Te((A(), H("div", {
          key: 0,
          class: K(e.ns.be("node", "children")),
          role: "group",
          "aria-expanded": e.expanded
        }, [
          (A(!0), H(Ve, null, Nt(e.node.childNodes, (g) => (A(), q(p, {
            key: e.getNodeKey(g),
            "render-content": e.renderContent,
            "render-after-expand": e.renderAfterExpand,
            "show-checkbox": e.showCheckbox,
            node: g,
            accordion: e.accordion,
            props: e.props,
            onNodeExpand: e.handleChildNodeExpand
          }, null, 8, ["render-content", "render-after-expand", "show-checkbox", "node", "accordion", "props", "onNodeExpand"]))), 128))
        ], 10, gc)), [
          [yt, e.expanded]
        ]) : ce("v-if", !0)
      ]),
      _: 1
    })
  ], 42, vc)), [
    [yt, e.node.visible]
  ]);
}
var mc = /* @__PURE__ */ ee(pc, [["render", bc], ["__file", "/home/runner/work/element-plus/element-plus/packages/components/tree/src/tree-node.vue"]]);
function yc({ el$: e }, t) {
  const n = W("tree"), r = bt([]), a = bt([]);
  ot(() => {
    s();
  }), pr(() => {
    r.value = Array.from(e.value.querySelectorAll("[role=treeitem]")), a.value = Array.from(e.value.querySelectorAll("input[type=checkbox]"));
  }), z(a, (i) => {
    i.forEach((h) => {
      h.setAttribute("tabindex", "-1");
    });
  }), wt(e, "keydown", (i) => {
    const h = i.target;
    if (!h.className.includes(n.b("node")))
      return;
    const d = i.code;
    r.value = Array.from(e.value.querySelectorAll(`.${n.is("focusable")}[role=treeitem]`));
    const p = r.value.indexOf(h);
    let b;
    if ([de.up, de.down].includes(d)) {
      if (i.preventDefault(), d === de.up) {
        b = p === -1 ? 0 : p !== 0 ? p - 1 : r.value.length - 1;
        const c = b;
        for (; !t.value.getNode(r.value[b].dataset.key).canFocus; ) {
          if (b--, b === c) {
            b = -1;
            break;
          }
          b < 0 && (b = r.value.length - 1);
        }
      } else {
        b = p === -1 ? 0 : p < r.value.length - 1 ? p + 1 : 0;
        const c = b;
        for (; !t.value.getNode(r.value[b].dataset.key).canFocus; ) {
          if (b++, b === c) {
            b = -1;
            break;
          }
          b >= r.value.length && (b = 0);
        }
      }
      b !== -1 && r.value[b].focus();
    }
    [de.left, de.right].includes(d) && (i.preventDefault(), h.click());
    const g = h.querySelector('[type="checkbox"]');
    [de.enter, de.space].includes(d) && g && (i.preventDefault(), g.click());
  });
  const s = () => {
    var i;
    r.value = Array.from(e.value.querySelectorAll(`.${n.is("focusable")}[role=treeitem]`)), a.value = Array.from(e.value.querySelectorAll("input[type=checkbox]"));
    const h = e.value.querySelectorAll(`.${n.is("checked")}[role=treeitem]`);
    if (h.length) {
      h[0].setAttribute("tabindex", "0");
      return;
    }
    (i = r.value[0]) == null || i.setAttribute("tabindex", "0");
  };
}
const Nc = B({
  name: "ElTree",
  components: { ElTreeNode: mc },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    emptyText: {
      type: String
    },
    renderAfterExpand: {
      type: Boolean,
      default: !0
    },
    nodeKey: String,
    checkStrictly: Boolean,
    defaultExpandAll: Boolean,
    expandOnClickNode: {
      type: Boolean,
      default: !0
    },
    checkOnClickNode: Boolean,
    checkDescendants: {
      type: Boolean,
      default: !1
    },
    autoExpandParent: {
      type: Boolean,
      default: !0
    },
    defaultCheckedKeys: Array,
    defaultExpandedKeys: Array,
    currentNodeKey: [String, Number],
    renderContent: Function,
    showCheckbox: {
      type: Boolean,
      default: !1
    },
    draggable: {
      type: Boolean,
      default: !1
    },
    allowDrag: Function,
    allowDrop: Function,
    props: {
      type: Object,
      default: () => ({
        children: "children",
        label: "label",
        disabled: "disabled"
      })
    },
    lazy: {
      type: Boolean,
      default: !1
    },
    highlightCurrent: Boolean,
    load: Function,
    filterNodeMethod: Function,
    accordion: Boolean,
    indent: {
      type: Number,
      default: 18
    },
    icon: {
      type: Jt
    }
  },
  emits: [
    "check-change",
    "current-change",
    "node-click",
    "node-contextmenu",
    "node-collapse",
    "node-expand",
    "check",
    "node-drag-start",
    "node-drag-end",
    "node-drop",
    "node-drag-leave",
    "node-drag-enter",
    "node-drag-over"
  ],
  setup(e, t) {
    const { t: n } = Sd(), r = W("tree"), a = E(new uc({
      key: e.nodeKey,
      data: e.data,
      lazy: e.lazy,
      props: e.props,
      load: e.load,
      currentNodeKey: e.currentNodeKey,
      checkStrictly: e.checkStrictly,
      checkDescendants: e.checkDescendants,
      defaultCheckedKeys: e.defaultCheckedKeys,
      defaultExpandedKeys: e.defaultExpandedKeys,
      autoExpandParent: e.autoExpandParent,
      defaultExpandAll: e.defaultExpandAll,
      filterNodeMethod: e.filterNodeMethod
    }));
    a.value.initialize();
    const o = E(a.value.root), s = E(null), i = E(null), h = E(null), { broadcastExpanded: d } = Zr(e), { dragState: p } = hc({
      props: e,
      ctx: t,
      el$: i,
      dropIndicator$: h,
      store: a
    });
    yc({ el$: i }, a);
    const b = $(() => {
      const { childNodes: C } = o.value;
      return !C || C.length === 0 || C.every(({ visible: P }) => !P);
    });
    z(() => e.currentNodeKey, (C) => {
      a.value.setCurrentNodeKey(C);
    }), z(() => e.defaultCheckedKeys, (C) => {
      a.value.setDefaultCheckedKey(C);
    }), z(() => e.defaultExpandedKeys, (C) => {
      a.value.setDefaultExpandedKeys(C);
    }), z(() => e.data, (C) => {
      a.value.setData(C);
    }, { deep: !0 }), z(() => e.checkStrictly, (C) => {
      a.value.checkStrictly = C;
    });
    const g = (C) => {
      if (!e.filterNodeMethod)
        throw new Error("[Tree] filterNodeMethod is required when filter");
      a.value.filter(C);
    }, c = (C) => mn(e.nodeKey, C.data), l = (C) => {
      if (!e.nodeKey)
        throw new Error("[Tree] nodeKey is required in getNodePath");
      const P = a.value.getNode(C);
      if (!P)
        return [];
      const te = [P.data];
      let I = P.parent;
      for (; I && I !== o.value; )
        te.push(I.data), I = I.parent;
      return te.reverse();
    }, u = (C, P) => a.value.getCheckedNodes(C, P), v = (C) => a.value.getCheckedKeys(C), f = () => {
      const C = a.value.getCurrentNode();
      return C ? C.data : null;
    }, k = () => {
      if (!e.nodeKey)
        throw new Error("[Tree] nodeKey is required in getCurrentKey");
      const C = f();
      return C ? C[e.nodeKey] : null;
    }, y = (C, P) => {
      if (!e.nodeKey)
        throw new Error("[Tree] nodeKey is required in setCheckedNodes");
      a.value.setCheckedNodes(C, P);
    }, _ = (C, P) => {
      if (!e.nodeKey)
        throw new Error("[Tree] nodeKey is required in setCheckedKeys");
      a.value.setCheckedKeys(C, P);
    }, N = (C, P, te) => {
      a.value.setChecked(C, P, te);
    }, M = () => a.value.getHalfCheckedNodes(), O = () => a.value.getHalfCheckedKeys(), F = (C, P = !0) => {
      if (!e.nodeKey)
        throw new Error("[Tree] nodeKey is required in setCurrentNode");
      tn(a, t.emit, () => a.value.setUserCurrentNode(C, P));
    }, w = (C, P = !0) => {
      if (!e.nodeKey)
        throw new Error("[Tree] nodeKey is required in setCurrentKey");
      tn(a, t.emit, () => a.value.setCurrentNodeKey(C, P));
    }, x = (C) => a.value.getNode(C), S = (C) => {
      a.value.remove(C);
    }, R = (C, P) => {
      a.value.append(C, P);
    }, G = (C, P) => {
      a.value.insertBefore(C, P);
    }, U = (C, P) => {
      a.value.insertAfter(C, P);
    }, X = (C, P, te) => {
      d(P), t.emit("node-expand", C, P, te);
    }, Y = (C, P) => {
      if (!e.nodeKey)
        throw new Error("[Tree] nodeKey is required in updateKeyChild");
      a.value.updateChildren(C, P);
    };
    return ve("RootTree", {
      ctx: t,
      props: e,
      store: a,
      root: o,
      currentNode: s,
      instance: ae()
    }), ve(gn, void 0), {
      ns: r,
      store: a,
      root: o,
      currentNode: s,
      dragState: p,
      el$: i,
      dropIndicator$: h,
      isEmpty: b,
      filter: g,
      getNodeKey: c,
      getNodePath: l,
      getCheckedNodes: u,
      getCheckedKeys: v,
      getCurrentNode: f,
      getCurrentKey: k,
      setCheckedNodes: y,
      setCheckedKeys: _,
      setChecked: N,
      getHalfCheckedNodes: M,
      getHalfCheckedKeys: O,
      setCurrentNode: F,
      setCurrentKey: w,
      t: n,
      getNode: x,
      remove: S,
      append: R,
      insertBefore: G,
      insertAfter: U,
      handleNodeExpand: X,
      updateKeyChildren: Y
    };
  }
});
function wc(e, t, n, r, a, o) {
  const s = Oe("el-tree-node");
  return A(), H("div", {
    ref: "el$",
    class: K([
      e.ns.b(),
      e.ns.is("dragging", !!e.dragState.draggingNode),
      e.ns.is("drop-not-allow", !e.dragState.allowDrop),
      e.ns.is("drop-inner", e.dragState.dropType === "inner"),
      { [e.ns.m("highlight-current")]: e.highlightCurrent }
    ]),
    role: "tree"
  }, [
    (A(!0), H(Ve, null, Nt(e.root.childNodes, (i) => (A(), q(s, {
      key: e.getNodeKey(i),
      node: i,
      props: e.props,
      accordion: e.accordion,
      "render-after-expand": e.renderAfterExpand,
      "show-checkbox": e.showCheckbox,
      "render-content": e.renderContent,
      onNodeExpand: e.handleNodeExpand
    }, null, 8, ["node", "props", "accordion", "render-after-expand", "show-checkbox", "render-content", "onNodeExpand"]))), 128)),
    e.isEmpty ? (A(), H("div", {
      key: 0,
      class: K(e.ns.e("empty-block"))
    }, [
      Z(e.$slots, "empty", {}, () => {
        var i;
        return [
          ue("span", {
            class: K(e.ns.e("empty-text"))
          }, pe((i = e.emptyText) != null ? i : e.t("el.tree.emptyText")), 3)
        ];
      })
    ], 2)) : ce("v-if", !0),
    Te(ue("div", {
      ref: "dropIndicator$",
      class: K(e.ns.e("drop-indicator"))
    }, null, 2), [
      [yt, e.dragState.showDropIndicator]
    ])
  ], 2);
}
var gt = /* @__PURE__ */ ee(Nc, [["render", wc], ["__file", "/home/runner/work/element-plus/element-plus/packages/components/tree/src/tree.vue"]]);
gt.install = (e) => {
  e.component(gt.name, gt);
};
const kc = gt, Cc = kc;
var L = /* @__PURE__ */ ((e) => (e.STRING = "字符串", e.NUMBER = "数值", e.BOOLEAN = "布尔", e.NULL = "空", e.STRINGS = "字符串数组", e.NUMBERS = "数值数组", e.BOOLEANS = "布尔数组", e.ANY = "任意类型", e))(L || {});
const qc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  VarKind: L
}, Symbol.toStringTag, { value: "Module" })), _c = {
  targetVar: () => ({
    name: "formName",
    label: "表单名称",
    kind: L.STRING,
    note: "表单的显示名称",
    minLen: 2,
    maxLen: 20
  }),
  materials: () => [
    {
      name: "field",
      label: "字段",
      isVar: !0,
      showLabel: !0,
      color: "#f8e3c5",
      items: [
        {
          name: "applicant",
          label: "申请人",
          kind: L.STRING,
          note: "表单申请人姓名",
          minLen: 2,
          maxLen: 20,
          cates: ["基础信息"]
        },
        {
          name: "kind",
          label: "申请类型",
          kind: L.STRING,
          note: "申请类型",
          minLen: 2,
          maxLen: 20,
          cates: ["基础信息"]
        },
        {
          name: "age",
          label: "年龄",
          kind: L.NUMBER,
          note: "年龄",
          minLen: 18,
          maxLen: 60,
          cates: ["基础信息"]
        }
      ]
    },
    {
      name: "model",
      label: "模型",
      isVar: !0,
      showLabel: !0,
      color: "#e1f3d8",
      items: [
        {
          name: "accountName",
          label: "账号",
          kind: L.STRING,
          note: "账号名",
          minLen: 2,
          maxLen: 20,
          cates: ["账户"]
        },
        {
          name: "phone",
          label: "手机号",
          kind: L.STRING,
          cates: ["账户"]
        },
        {
          name: "roleName",
          label: "角色名",
          kind: L.STRING,
          cates: ["角色"]
        },
        {
          name: "isAdmin",
          label: "是否是管理员",
          kind: L.BOOLEAN,
          cates: ["角色"]
        }
      ]
    },
    {
      name: "fun",
      label: "函数",
      isVar: !1,
      showLabel: !1,
      color: "#d9ecff",
      items: [
        {
          name: "sum",
          label: "求和",
          note: `获取一组数值的总和。
用法：SUM(数字1,数字2,...)。
示例：SUM(语文成绩,数学成绩, 英语成绩)返回三门课程的总分。`,
          input: [
            {
              kind: L.NUMBER
            }
          ],
          isVarLen: !0,
          isAsync: !1,
          output: {
            kind: L.NUMBER
          },
          cates: ["常用", "计算"]
        },
        {
          name: "now",
          label: "当前时间",
          note: "返回当前时间戳",
          input: [],
          isVarLen: !1,
          isAsync: !1,
          output: {
            kind: L.NUMBER
          },
          cates: ["常用", "日期处理"]
        },
        {
          name: "concat",
          label: "合并文本",
          note: `将多个文本合并成一个文本。
用法：CONCATENATE(文本1,文本2,...)。`,
          input: [
            {
              kind: L.ANY
            }
          ],
          isVarLen: !0,
          isAsync: !1,
          output: {
            kind: L.STRING
          },
          cates: ["常用", "文本处理"]
        },
        {
          name: "lower",
          label: "转成小写",
          note: `将一个文本中的所有大写字母转换为小写字母。
用法：lower(文本)。`,
          input: [
            {
              kind: L.STRING
            }
          ],
          isVarLen: !1,
          isAsync: !1,
          output: {
            kind: L.STRING
          },
          cates: ["文本处理"]
        }
      ]
    },
    {
      name: "api",
      label: "API",
      isVar: !1,
      showLabel: !0,
      color: "#d9ec00",
      items: [
        {
          name: "getUserInfo",
          label: "获取用户信息",
          note: "根据用户Id获取用户信息",
          input: [
            {
              label: "用户Id",
              kind: L.STRING
            }
          ],
          isVarLen: !1,
          isAsync: !0,
          output: {
            kind: L.ANY
          },
          cates: ["用户"]
        }
      ]
    }
  ],
  formulaValue: "$.fun.concat($.fun.sum(1,$.field.age),3, true, ['1','2'], 'string',null,$.param.someVar,await $.api.getUserInfo($.model.accountName))",
  entrance: "$"
}, Sc = /* @__PURE__ */ B({
  __name: "CmWrap",
  props: {
    targetGuard: {},
    materials: {},
    formulaValue: { default: "" },
    entrance: { default: "$" }
  },
  emits: ["update:formulaValue"],
  setup(e, { expose: t, emit: n }) {
    const r = e, a = E(r.formulaValue), o = E(), s = new ka({
      regexp: new RegExp("(await )?\\" + r.entrance + "\\.(\\w+\\.\\w+)", "g"),
      decoration: (l) => _n.replace({
        widget: new h(l[2])
      })
    }), i = Ca.fromClass(
      class {
        constructor(l) {
          yn(this, "placeholders");
          this.placeholders = s.createDeco(l);
        }
        update(l) {
          this.placeholders = s.updateDeco(l, this.placeholders);
        }
      },
      {
        decorations: (l) => l.placeholders,
        provide: (l) => _a.atomicRanges.of((u) => {
          var v;
          return ((v = u.plugin(l)) == null ? void 0 : v.placeholders) || _n.none;
        })
      }
    );
    class h extends Sa {
      constructor(u) {
        super(), this.name = u;
      }
      eq(u) {
        return this.name == u.name;
      }
      toDOM() {
        var N, M;
        let u = this.name.split(".")[0], v = this.name.split(".")[1], f = r.materials.find((O) => O.name === u), k = v;
        f != null && f.showLabel && (k = f != null && f.isVar ? ((N = f.items.find((O) => O.name === v)) == null ? void 0 : N.label) ?? v : ((M = f.items.find((O) => O.name === v)) == null ? void 0 : M.label) ?? v);
        let y = (f == null ? void 0 : f.color) || "#e9e9eb", _ = document.createElement("span");
        return _.style.cssText = `
      border-radius: 4px;
      margin: 0 3px;
      padding: 1px 3px;
      background: ` + y + ";", _.className = "iw-cm-wrap__key-word", _.textContent = k, _;
      }
      ignoreEvent() {
        return !1;
      }
    }
    function d(l) {
      let u = l.matchBefore(new RegExp("\\" + r.entrance + "\\.*")), v = l.matchBefore(new RegExp("\\" + r.entrance + "\\.\\w*\\.")), f = l.matchBefore(/\w*/);
      if ((u == null || u.from == u.to && !l.explicit) && (v == null || v.from == v.to && !l.explicit) && (f == null || f.from == f.to && !l.explicit))
        return null;
      if (u != null)
        return {
          from: u.from,
          options: r.materials.map((k) => ({ label: r.entrance + "." + k.name, type: "namespace", detail: k.label }))
        };
      if (v != null) {
        let k = v.text.split(".")[1], y = r.materials.find((_) => _.name == k);
        return y ? {
          from: v.from,
          options: y.items.map((_) => {
            var M;
            let N = r.entrance + "." + k + "." + _.name;
            if (y != null && y.isVar)
              return { label: N + " ", type: "variable", detail: _.label };
            {
              let O = (M = (y == null ? void 0 : y.items).find((w) => w.name === _.name)) == null ? void 0 : M.isAsync, F = (O ? 6 : 0) + N.length + 1;
              return {
                label: N,
                type: "function",
                detail: _.label,
                apply: (w, x, S, R) => {
                  w.dispatch({
                    changes: { from: S, to: R, insert: (O ? "await " : "") + N + "()" },
                    selection: {
                      anchor: S + F,
                      head: S + F
                    }
                  });
                }
              };
            }
          }) ?? []
        } : null;
      } else if (f != null) {
        let k = f.text, y = r.materials.map((_) => _.isVar ? _.items.filter((N) => {
          var M;
          return (M = N.name) == null ? void 0 : M.startsWith(k);
        }).map((N) => {
          let M = r.entrance + "." + _.name + "." + N.name;
          return {
            label: N.name,
            type: "variable",
            detail: N.label + "(" + _.label + ")",
            apply: M + " "
          };
        }) : _.items.filter((N) => N.name.startsWith(k)).map((N) => {
          var w;
          let M = r.entrance + "." + _.name + "." + N.name, O = (w = (_ == null ? void 0 : _.items).find((x) => x.name === N.name)) == null ? void 0 : w.isAsync, F = (O ? 6 : 0) + M.length + 1;
          return {
            label: N.name,
            type: "function",
            detail: N.label + "(" + _.label + ")",
            apply: (x, S, R, G) => {
              x.dispatch({
                changes: { from: R, to: G, insert: (O ? "await " : "") + M + "()" },
                selection: {
                  anchor: R + F,
                  head: R + F
                }
              });
            }
          };
        })).flat();
        return {
          from: f.from,
          options: y
        };
      } else
        return null;
    }
    function p(l, u, v, f) {
      var F, w, x, S, R, G, U, X, Y, C, P, te;
      console.log(l);
      let k = null, y;
      if (l.name === "CallExpression" && ((F = l.firstChild) == null ? void 0 : F.name) === "MemberExpression" && ((x = (w = l.firstChild) == null ? void 0 : w.firstChild) == null ? void 0 : x.name) === "MemberExpression" && ((R = (S = l.firstChild) == null ? void 0 : S.nextSibling) == null ? void 0 : R.name) === "ArgList")
        k = "expr", y = u.state.sliceDoc((G = l.firstChild) == null ? void 0 : G.from, (U = l.firstChild) == null ? void 0 : U.to);
      else if (l.name === "MemberExpression" && ((X = l.firstChild) == null ? void 0 : X.name) === "MemberExpression")
        k = "var", y = u.state.sliceDoc(l.from, l.to);
      else
        return l.name === "VariableName" ? (f.push({
          from: l.from,
          to: l.to,
          severity: "error",
          message: "变量不存在",
          markClass: "iw-cm-wrap--error"
        }), 1) : 0;
      if (!y.startsWith(r.entrance + "."))
        return 0;
      let _ = y.split("."), N = _[1], M = _[2], O = r.materials.find((I) => I.name === N);
      if (!O)
        return f.push({
          from: l.from,
          to: l.to,
          severity: "error",
          message: (k === "var" ? "变量" : "函数") + "不存在",
          markClass: "iw-cm-wrap--error"
        }), 1;
      if (k === "var") {
        let I = O.items.find((ne) => ne.name === M);
        if (!I)
          return f.push({
            from: l.from,
            to: l.to,
            severity: "error",
            message: "变量不存在",
            markClass: "iw-cm-wrap--error"
          }), 1;
        I.kind !== v && v !== L.ANY && f.push({
          from: l.from,
          to: l.to,
          severity: "error",
          message: "期望返回格式为[" + v + "],实际为[" + I.kind + "]",
          markClass: "iw-cm-wrap--error"
        });
      } else {
        if (!((C = (Y = l.firstChild) == null ? void 0 : Y.nextSibling) != null && C.firstChild))
          return f.push({
            from: l.from,
            to: l.to,
            severity: "error",
            message: "函数格式错误",
            markClass: "iw-cm-wrap--error"
          }), 1;
        let I = O.items.find((J) => J.name === M);
        if (!I)
          return f.push({
            from: l.from,
            to: l.to,
            severity: "error",
            message: "函数不存在",
            markClass: "iw-cm-wrap--error"
          }), 1;
        let ne = (te = (P = l.firstChild) == null ? void 0 : P.nextSibling) == null ? void 0 : te.firstChild, lt = ne.nextSibling.from - 1;
        I.output.kind !== v && v !== L.ANY && f.push({
          // 只标记方法体，如果是异步函数，需要减去 `await `的长度
          from: l.from + (I.isAsync ? -6 : 0),
          to: lt,
          severity: "error",
          message: "期望返回格式为[" + v + "],实际为[" + I.output.kind + "]",
          markClass: "iw-cm-wrap--error"
        });
        let se = 0;
        for (; ne.nextSibling != null; ) {
          ne = ne.nextSibling;
          let J = ne.name;
          if (!(J === "(" || J === ")" || J === ",")) {
            if (I.input.length <= se) {
              f.push({
                // 只标记过长的参数
                from: ne.from,
                to: l.to - 1,
                severity: "error",
                message: "期望参数长度为[" + I.input.length + "],实际为[" + (se + 1) + "]",
                markClass: "iw-cm-wrap--error"
              });
              break;
            }
            if (J === "CallExpression" || J === "MemberExpression" || J === "VariableName")
              p(ne, u, I.input[se].kind, f);
            else {
              let we = null;
              switch (J) {
                case "String": {
                  we = L.STRING;
                  break;
                }
                case "Number": {
                  we = L.NUMBER;
                  break;
                }
                case "BooleanLiteral": {
                  we = L.BOOLEAN;
                  break;
                }
                case "null": {
                  we = L.NULL;
                  break;
                }
                case "ArrayExpression": {
                  we = L.STRINGS;
                  break;
                }
                default:
                  we = L.ANY;
              }
              I.input[se].kind !== we && I.input[se].kind !== L.ANY && f.push({
                // 只标记错误的参数
                from: ne.from,
                to: ne.to,
                severity: "error",
                message: "期望参数格式为[" + I.input[se].kind + "],实际为[" + we + "]",
                markClass: "iw-cm-wrap--error"
              });
            }
            (I.input.length - 1 !== se || !I.isVarLen) && se++;
          }
        }
        se == 0 && I.input.length !== 0 && !I.isVarLen && f.push({
          // 只标记()
          from: lt,
          to: l.to,
          severity: "error",
          message: "期望参数长度为[" + I.input.length + "],实际为[0]",
          markClass: "iw-cm-wrap--error"
        });
      }
      return 1;
    }
    const b = ja((l) => {
      let u = Va(new za.Linter(), {
        // eslint configuration
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: "module"
        },
        env: {
          browser: !0,
          node: !0
        }
      })(l), v = 0;
      return Ta(l.state).topNode.cursor().iterate((f) => {
        v <= f.from && p(f.node, l, r.targetGuard.kind, u) !== 0 && (v = f.to);
      }), document.querySelectorAll(".iw-cm-wrap__key-word").forEach((f) => {
        f.classList.remove("iw-cm-wrap--error");
      }), u.forEach((f) => {
        var k;
        if (f.source === "eslint")
          f.message.includes("Parsing error: Unexpected token") && (f.message = "公式语法错误", delete f.source);
        else {
          let _ = ((k = o.value) == null ? void 0 : k.view).coordsAtPos(f.from);
          if (_) {
            const N = document.elementFromPoint(_.left + 10, _.top + 10);
            N != null && N.className.includes("iw-cm-wrap__key-word") && (N == null || N.classList.add("iw-cm-wrap--error"));
          }
        }
      }), u.length === 0 ? n("update:formulaValue", a.value) : n("update:formulaValue", ""), u;
    }), g = (l, u) => {
      var M, O;
      let v = (M = o.value) == null ? void 0 : M.view;
      const k = v.state.selection.ranges[0];
      let y = r.materials.find((F) => F.name == l), _ = (y == null ? void 0 : y.isVar) ?? !1, N;
      _ ? N = r.entrance + "." + l + "." + u + " " : N = (((O = (y == null ? void 0 : y.items).find((w) => w.name === u)) == null ? void 0 : O.isAsync) ? "await " : "") + r.entrance + "." + l + "." + u + "()", v.dispatch({
        changes: {
          from: k.from,
          to: k.to,
          insert: N
        },
        selection: { anchor: _ ? k.to + N.length : k.to + N.length - 1 }
      });
    }, c = [
      i,
      xa(),
      La(),
      Ea(),
      Aa(),
      Oa(Pa, { fallback: !0 }),
      Ia(),
      Ma(),
      Da({
        override: [d]
      }),
      Ba(),
      Ha(),
      b,
      $a.of([...Ra, ...Ka])
    ];
    return t({
      insertMaterial: g
    }), (l, u) => (A(), q(m(Fa), {
      class: "iw-cm-wrap",
      ref_key: "codeEditor",
      ref: o,
      modelValue: a.value,
      "onUpdate:modelValue": u[0] || (u[0] = (v) => a.value = v),
      wrap: "",
      placeholder: "在此输入公式",
      extensions: c
    }, null, 8, ["modelValue"]));
  }
});
const fr = (e, t) => e.reduce((n, r, a, o) => {
  var s;
  return (n[s = t(r, a, o)] || (n[s] = [])).push(r), n;
}, {}), xc = { class: "iw-editor" }, Ec = ["onClick"], $c = { class: "iw-editor-material__item-tile" }, Tc = { class: "iw-editor-material__item-note" }, Ac = ["onClick", "onMouseenter"], Oc = { class: "iw-editor-material__item-tile" }, Pc = { class: "iw-editor-material__item-note" }, Ic = /* @__PURE__ */ B({
  __name: "Editor",
  props: ha({
    targetVar: {},
    materials: {},
    formulaValue: {},
    entrance: {}
  }, _c),
  emits: ["update:formulaValue"],
  setup(e, { emit: t }) {
    const n = e, r = E(n.formulaValue), a = E(), o = E(""), s = tt(p(!0, "")), i = E(""), h = E(""), d = tt(p(!1, ""));
    z(r, async (c) => {
      t("update:formulaValue", c);
    });
    function p(c, l) {
      return c ? n.materials.filter((u) => u.isVar).map((u) => {
        let v = u.items.filter((y) => {
          var _, N;
          return l === "" || ((_ = y.name) == null ? void 0 : _.includes(l)) || ((N = y.label) == null ? void 0 : N.includes(l));
        }).map((y) => {
          var _;
          return ((_ = y.cates) == null ? void 0 : _.map((N) => ({
            id: y.name,
            name: y.name,
            label: y.label ?? "",
            note: y.note ?? "",
            cate: N
          }))) ?? [
            {
              id: "",
              name: "",
              label: "",
              note: "",
              cate: ""
            }
          ];
        }).flat(), f = fr(v, (y) => y == null ? void 0 : y.cate), k = [];
        for (let y in f)
          k.push({
            id: "",
            name: y,
            label: "",
            note: "",
            children: f[y]
          });
        return {
          nsLabel: u.label,
          nsName: u.name,
          items: k
        };
      }) : n.materials.filter((u) => !u.isVar).map((u) => {
        let v = u.items.filter((y) => l === "" || y.name.includes(l) || y.label.includes(l)).map((y) => {
          var _;
          return ((_ = y.cates) == null ? void 0 : _.map((N) => ({
            id: y.name,
            name: y.name,
            label: y.label ?? "",
            note: y.note ?? "",
            cate: N
          }))) ?? [
            {
              id: "",
              name: "",
              label: "",
              note: "",
              cate: ""
            }
          ];
        }).flat(), f = fr(v, (y) => y == null ? void 0 : y.cate), k = [];
        for (let y in f)
          k.push({
            id: "",
            name: y,
            label: "",
            note: "",
            children: f[y]
          });
        return {
          nsLabel: u.label,
          nsName: u.name,
          items: k
        };
      });
    }
    function b(c, l) {
      console.log("filter" + l), c ? s.splice(0, s.length) : d.splice(0, d.length), p(c, l).forEach((u) => {
        c ? s.push(u) : d.push(u);
      });
    }
    function g(c, l, u) {
      c && a.value.insertMaterial(l, u);
    }
    return (c, l) => {
      const u = Vu, v = cu, f = Ru, k = Cc, y = lc, _ = ic;
      return A(), H("div", xc, [
        T(f, { class: "iw-editor-toolbar" }, {
          default: D(() => [
            T(u, { span: 12 }, {
              default: D(() => [
                je(pe(n.targetVar.label) + " =", 1)
              ]),
              _: 1
            }),
            T(u, {
              span: 12,
              class: "iw-editor-toolbar__opt"
            }, {
              default: D(() => [
                T(v, {
                  icon: m(Na),
                  link: ""
                }, {
                  default: D(() => [
                    je("调试")
                  ]),
                  _: 1
                }, 8, ["icon"]),
                T(v, {
                  icon: m(wa),
                  link: ""
                }, {
                  default: D(() => [
                    je("代码模式")
                  ]),
                  _: 1
                }, 8, ["icon"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        T(f, { class: "iw-editor-formula" }, {
          default: D(() => [
            T(Sc, {
              ref_key: "CmWrapRef",
              ref: a,
              class: "iw-editor-formula--size",
              formulaValue: r.value,
              "onUpdate:formulaValue": l[0] || (l[0] = (N) => r.value = N),
              targetGuard: c.targetVar,
              materials: c.materials,
              entrance: c.entrance
            }, null, 8, ["formulaValue", "targetGuard", "materials", "entrance"])
          ]),
          _: 1
        }),
        T(f, { class: "iw-editor-material" }, {
          default: D(() => [
            T(u, {
              class: "iw-editor-material__var-wrapper",
              span: 6
            }, {
              default: D(() => [
                T(m(kn), {
                  placeholder: "搜索变量",
                  modelValue: i.value,
                  "onUpdate:modelValue": l[1] || (l[1] = (N) => i.value = N),
                  "prefix-icon": m(Cn),
                  onInput: l[2] || (l[2] = (N) => b(!0, i.value))
                }, null, 8, ["modelValue", "prefix-icon"]),
                T(_, { "tab-position": "bottom" }, {
                  default: D(() => [
                    (A(!0), H(Ve, null, Nt(s, (N) => (A(), q(y, {
                      label: N.nsLabel
                    }, {
                      default: D(() => [
                        T(k, {
                          data: N.items,
                          "node-key": "id",
                          accordion: "",
                          "empty-text": "暂无数据"
                        }, {
                          default: D(({ node: M, data: O }) => [
                            ue("div", {
                              class: "iw-editor-material__item",
                              onClick: (F) => g(M.isLeaf, N.nsName, O.name)
                            }, [
                              ue("p", $c, pe(O.name), 1),
                              ue("p", Tc, pe(O.label), 1)
                            ], 8, Ec)
                          ]),
                          _: 2
                        }, 1032, ["data"])
                      ]),
                      _: 2
                    }, 1032, ["label"]))), 256))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            T(u, {
              class: "iw-editor-material__func-wrapper",
              span: 18
            }, {
              default: D(() => [
                T(f, null, {
                  default: D(() => [
                    T(u, {
                      class: "iw-editor-material__func-list",
                      span: 10
                    }, {
                      default: D(() => [
                        T(m(kn), {
                          placeholder: "搜索函数/API",
                          modelValue: h.value,
                          "onUpdate:modelValue": l[3] || (l[3] = (N) => h.value = N),
                          "prefix-icon": m(Cn),
                          onInput: l[4] || (l[4] = (N) => b(!1, h.value))
                        }, null, 8, ["modelValue", "prefix-icon"]),
                        T(_, { "tab-position": "bottom" }, {
                          default: D(() => [
                            (A(!0), H(Ve, null, Nt(d, (N) => (A(), q(y, {
                              label: N.nsLabel
                            }, {
                              default: D(() => [
                                T(k, {
                                  data: N.items,
                                  "node-key": "id",
                                  accordion: "",
                                  "empty-text": "暂无数据"
                                }, {
                                  default: D(({ node: M, data: O }) => [
                                    ue("div", {
                                      class: "iw-editor-material__item",
                                      onClick: (F) => g(M.isLeaf, N.nsName, O.name),
                                      onMouseenter: (F) => o.value = O.note,
                                      onMouseleave: l[5] || (l[5] = (F) => o.value = "")
                                    }, [
                                      ue("p", Oc, pe(O.name), 1),
                                      ue("p", Pc, pe(O.label), 1)
                                    ], 40, Ac)
                                  ]),
                                  _: 2
                                }, 1032, ["data"])
                              ]),
                              _: 2
                            }, 1032, ["label"]))), 256))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    T(u, {
                      class: "iw-editor-material__func-note",
                      span: 14
                    }, {
                      default: D(() => [
                        je(pe(o.value), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]);
    };
  }
});
const Mc = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [r, a] of t)
    n[r] = a;
  return n;
}, ta = /* @__PURE__ */ Mc(Ic, [["__scopeId", "data-v-2fa5158c"]]), Wc = (e) => {
  e.component("IwEditor", ta);
}, Yc = pa(ta);
export {
  Yc as IwEditorComp,
  Wc as default,
  qc as iwInterface
};
