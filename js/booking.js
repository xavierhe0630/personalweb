/* =========================================================
   预约系统（前端）
   页面里放 <div data-booking data-default="yijing"></div> 即可出现预约组件。
   数据来自 SITE_CONFIG.bookingApi（Google Apps Script）；未设置时为演示模式。
   ========================================================= */
(function () {
  var C = window.SITE_CONFIG || {};
  var VTZ = (Intl.DateTimeFormat().resolvedOptions().timeZone) || "UTC";
  var OTZ = C.ownerTimezone || "America/New_York";
  var data = null, loadErr = false, loading = null;
  var widgets = [];

  var S = {
    demo: { zh: "演示模式：以下是示例时间和价格，提交不会真的预约。在 js/config.js 填入后台地址后会自动换成真实数据。", en: "Demo mode: sample times and prices. Nothing is actually booked. Add your backend URL in js/config.js to go live." },
    loading: { zh: "正在加载可预约时间…", en: "Loading available times…" },
    loadFail: { zh: "暂时无法加载预约时间，请刷新页面重试。", en: "Couldn’t load available times. Refresh the page to try again." },
    retry: { zh: "重新加载", en: "Reload" },
    s1: { zh: "选择项目", en: "Choose a service" },
    s2: { zh: "选择时长", en: "Choose a length" },
    s3: { zh: "选择日期", en: "Choose a date" },
    s4: { zh: "选择时间", en: "Choose a time" },
    s5: { zh: "填写信息", en: "Your details" },
    perUnit: { zh: "按时长，每 {n} 分钟", en: "By length, per {n} min" },
    mins: { zh: "{n} 分钟", en: "{n} min" },
    left: { zh: "剩 {n} 位", en: "{n} left" },
    tzNote: { zh: "每个时间同时显示美国东部时间（12 小时制）和北京时间（24 小时制）。", en: "Each time is shown in US Eastern time (12-hour) and Beijing time (24-hour)." },
    us: { zh: "美东", en: "US ET" },
    cn: { zh: "北京", en: "Beijing" },
    usLong: { zh: "美国东部时间", en: "US Eastern" },
    cnLong: { zh: "北京时间", en: "Beijing time" },
    none: { zh: "近期暂无可预约时间，请过几天再来看看。", en: "No open times right now. Please check back in a few days." },
    noneForPick: { zh: "这个项目近期没有合适的时间，换个项目或时长试试。", en: "No open times for this choice. Try another service or length." },
    name: { zh: "称呼", en: "Name" },
    contactType: { zh: "联系方式", en: "Contact" },
    wechat: { zh: "微信", en: "WeChat" },
    email: { zh: "邮箱", en: "Email" },
    phone: { zh: "电话", en: "Phone" },
    contact: { zh: "微信号 / 邮箱 / 电话", en: "WeChat ID, email, or phone" },
    question: { zh: "想问的事（选填，简单写几句即可）", en: "What you’d like to ask (optional, a few lines is enough)" },
    pay: { zh: "付款方式", en: "Payment method" },
    alipay: { zh: "支付宝", en: "Alipay" },
    zelle: { zh: "Zelle", en: "Zelle" },
    total: { zh: "费用", en: "Price" },
    submit: { zh: "提交预约", en: "Book this time" },
    submitting: { zh: "提交中…", en: "Booking…" },
    need: { zh: "请填写称呼和联系方式。", en: "Please enter your name and contact." },
    full: { zh: "这个时间刚刚被约满了，请换一个时间。", en: "That time was just taken. Please pick another." },
    gone: { zh: "所选时间已不可用，请重新选择。", en: "That time is no longer available. Please choose again." },
    fail: { zh: "提交没有成功，请稍后再试。", en: "Booking didn’t go through. Please try again shortly." },
    done: { zh: "预约已提交", en: "Booking received" },
    idLabel: { zh: "预约编号", en: "Booking number" },
    when: { zh: "时间", en: "Time" },
    owner: { zh: "波士顿时间 {t}", en: "Boston time {t}" },
    service: { zh: "项目", en: "Service" },
    length: { zh: "时长", en: "Length" },
    payTitle: { zh: "完成付款", en: "Complete payment" },
    memo: { zh: "付款时请在备注里写上预约编号。", en: "Please put your booking number in the payment note." },
    qrTodo: { zh: "收款码待上传", en: "QR code coming soon" },
    zName: { zh: "收款人", en: "Recipient" },
    zId: { zh: "Zelle 账号", en: "Zelle email / phone" },
    todo: { zh: "待补充", en: "To be added" },
    amount: { zh: "金额", en: "Amount" },
    again: { zh: "再约一个时间", en: "Book another time" }
  };

  function t(o, v) {
    var s = window.I18N.t(o);
    if (v) Object.keys(v).forEach(function (k) { s = s.replace("{" + k + "}", v[k]); });
    return s;
  }
  function L() { return window.I18N.get() === "zh" ? "zh-CN" : "en-US"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(n) { n = Number(n) || 0; return n % 1 === 0 ? String(n) : n.toFixed(2); }
  /* 时间显示：美国东部时间用 12 小时制（AM/PM），北京时间用 24 小时制，都带年月日 */
  var CTZ = "Asia/Shanghai";
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var WK = { Sun: "周日", Mon: "周一", Tue: "周二", Wed: "周三", Thu: "周四", Fri: "周五", Sat: "周六" };
  function parts(ms, tz) {
    var p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "numeric", day: "numeric", weekday: "short", hour: "numeric", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date(ms)).forEach(function (x) { p[x.type] = x.value; });
    return { y: +p.year, m: +p.month, d: +p.day, wk: p.weekday, h: +p.hour % 24, mi: p.minute };
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function dateStr(p) { return window.I18N.get() === "zh" ? p.y + "年" + p.m + "月" + p.d + "日 " + WK[p.wk] : p.wk + ", " + MON[p.m - 1] + " " + p.d + ", " + p.y; }
  function usClock(p) { return (p.h % 12 || 12) + ":" + p.mi + " " + (p.h < 12 ? "AM" : "PM"); }
  function cnClock(p) { return pad2(p.h) + ":" + p.mi; }
  function dayKey(ms) { var p = parts(ms, OTZ); return p.y + "-" + pad2(p.m) + "-" + pad2(p.d); }
  function fmtDay(ms) { return dateStr(parts(ms, OTZ)); }
  function bothLines(ms) {
    var u = parts(ms, OTZ), c = parts(ms, CTZ);
    return '<span class="bk-when"><span><em>' + t(S.usLong) + "</em>" + esc(dateStr(u)) + " " + usClock(u) + "</span>" +
      "<span><em>" + t(S.cnLong) + "</em>" + esc(dateStr(c)) + " " + cnClock(c) + "</span></span>";
  }
  function timeChip(ms) {
    var u = parts(ms, OTZ), c = parts(ms, CTZ), other = c.d !== u.d;
    return '<span class="bk-t1">' + usClock(u) + " <i>" + t(S.us) + "</i></span>" +
      '<span class="bk-t2">' + cnClock(c) + " " + t(S.cn) + (other ? " (" + (window.I18N.get() === "zh" ? c.m + "月" + c.d + "日" : MON[c.m - 1] + " " + c.d) + ")" : "") + "</span>";
  }
  function svcName(s) { return window.I18N.get() === "zh" ? (s.name_zh || s.name_en) : (s.name_en || s.name_zh); }
  function svcDesc(s) { return window.I18N.get() === "zh" ? (s.desc_zh || "") : (s.desc_en || ""); }

  function price(s, dur) {
    if (s.mode === "duration") { var k = dur / s.minutes; return { usd: s.price_usd * k, cny: s.price_cny * k, minutes: dur }; }
    return { usd: s.price_usd, cny: s.price_cny, minutes: s.minutes };
  }
  function need(s, dur) { return s.mode === "duration" ? dur : s.minutes; }

  /* ---------- 演示数据 ---------- */
  function zoned(y, m, d, h, mi, tz) {
    var guess = Date.UTC(y, m - 1, d, h, mi);
    var p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
      .formatToParts(new Date(guess)).forEach(function (x) { p[x.type] = +x.value; });
    var asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute);
    return guess - (asUTC - guess);
  }
  function demo() {
    var slots = [], now = new Date();
    for (var i = 1; i <= 16; i++) {
      if (i % 4 === 0) continue;
      var day = new Date(now.getTime() + i * 864e5);
      var y = day.getFullYear(), m = day.getMonth() + 1, d = day.getDate();
      var plan = i % 2 ? [[10, 0, 90, 1, []], [19, 30, 90, 2, []]] : [[14, 0, 60, 1, ["yijing", "tarot"]], [20, 0, 90, 1, []]];
      plan.forEach(function (p, j) {
        slots.push({ id: "demo-" + i + "-" + j, start: zoned(y, m, d, p[0], p[1], OTZ), minutes: p[2], left: p[3], services: p[4] });
      });
    }
    return {
      demo: true, tz: OTZ, slots: slots,
      services: [
        { key: "yijing", name_zh: "易经问卜", name_en: "I Ching reading", mode: "session", minutes: 45, durations: [], price_usd: 40, price_cny: 288, desc_zh: "一事一卦", desc_en: "One question, one hexagram" },
        { key: "tarot", name_zh: "塔罗梳理", name_en: "Tarot planning", mode: "duration", minutes: 30, durations: [30, 60, 90], price_usd: 25, price_cny: 168, desc_zh: "梳理思路与规划", desc_en: "Sort out your thinking and plan" },
        { key: "both", name_zh: "易经 + 塔罗", name_en: "I Ching + Tarot", mode: "session", minutes: 90, durations: [], price_usd: 70, price_cny: 488, desc_zh: "两种方式同时进行", desc_en: "Both in one session" }
      ]
    };
  }

  function load(force) {
    if (loading && !force) return loading;
    loadErr = false;
    if (!C.bookingApi) { data = demo(); loading = Promise.resolve(data); return loading; }
    loading = fetch(C.bookingApi, { method: "GET" })
      .then(function (r) { return r.json(); })
      .then(function (d) { if (!d || d.ok === false) throw new Error("bad"); data = d; return d; })
      .catch(function () { loadErr = true; data = null; });
    return loading;
  }

  /* ---------- 组件 ---------- */
  function Widget(el) {
    this.el = el;
    this.def = el.getAttribute("data-default") || "";
    this.reset();
    var self = this;
    el.addEventListener("click", function (e) { self.onClick(e); });
    el.addEventListener("submit", function (e) { e.preventDefault(); self.submit(); });
  }
  Widget.prototype.reset = function () {
    this.svc = null; this.dur = null; this.day = null; this.slot = null;
    this.step = "pick"; this.msg = ""; this.busy = false; this.result = null; this.pay = "wechat";
    this.form = { name: "", ctype: "wechat", contact: "", q: "" };
  };
  Widget.prototype.services = function () { return (data && data.services) || []; };
  Widget.prototype.svcObj = function () { var k = this.svc; return this.services().filter(function (s) { return s.key === k; })[0]; };
  Widget.prototype.openSlots = function () {
    var s = this.svcObj(); if (!s || !data) return [];
    if (s.mode === "duration" && !this.dur) return [];
    var n = need(s, this.dur), now = Date.now();
    return data.slots.filter(function (x) {
      return x.left > 0 && x.start > now && x.minutes >= n && (!x.services || !x.services.length || x.services.indexOf(s.key) >= 0);
    }).sort(function (a, b) { return a.start - b.start; });
  };
  Widget.prototype.ensureDefaults = function () {
    var svcs = this.services();
    if (!this.svc && svcs.length) {
      var d = this.def; this.svc = (svcs.filter(function (s) { return s.key === d; })[0] || svcs[0]).key;
    }
    var s = this.svcObj();
    if (s && s.mode === "duration") {
      if (!this.dur || (s.durations.length && s.durations.indexOf(this.dur) < 0)) this.dur = s.durations[0] || s.minutes;
    } else this.dur = null;
  };
  Widget.prototype.saveForm = function () {
    var f = this.el.querySelector("form"); if (!f) return;
    this.form.name = f.elements.name.value; this.form.ctype = f.elements.ctype.value;
    this.form.contact = f.elements.contact.value; this.form.q = f.elements.q.value;
    var p = f.querySelector('input[name="pay"]:checked'); if (p) this.pay = p.value;
  };

  Widget.prototype.render = function () {
    var el = this.el, h = "";
    if (!data && !loadErr) { el.innerHTML = '<div class="bk"><p class="bk-muted">' + t(S.loading) + "</p></div>"; return; }
    if (loadErr) { el.innerHTML = '<div class="bk"><p class="bk-muted">' + t(S.loadFail) + '</p><button type="button" class="bk-chip" data-act="retry">' + t(S.retry) + "</button></div>"; return; }
    this.ensureDefaults();
    if (this.step === "done") {
      el.innerHTML = this.renderDone();
      var img = el.querySelector(".bk-qr-img");
      if (img) img.addEventListener("error", function () { var ph = document.createElement("div"); ph.className = "bk-qr-ph"; ph.textContent = t(S.qrTodo); img.replaceWith(ph); });
      return;
    }

    var s = this.svcObj(), self = this;
    h += '<div class="bk">';
    if (data.demo) h += '<p class="bk-demo">' + t(S.demo) + "</p>";

    h += '<div class="bk-step"><h3>' + t(S.s1) + '</h3><div class="bk-svcs">' +
      this.services().map(function (x) {
        var line = x.mode === "duration" ? t(S.perUnit, { n: x.minutes }) : t(S.mins, { n: x.minutes });
        return '<button type="button" class="bk-opt" data-act="svc" data-v="' + esc(x.key) + '" aria-pressed="' + (x.key === self.svc) + '">' +
          "<b>" + esc(svcName(x)) + "</b>" + (svcDesc(x) ? "<small>" + esc(svcDesc(x)) + "</small>" : "") +
          '<span class="bk-price">$' + money(x.price_usd) + " / ¥" + money(x.price_cny) + '</span><small>' + line + "</small></button>";
      }).join("") + "</div></div>";

    if (s && s.mode === "duration") {
      var durs = s.durations.length ? s.durations : [s.minutes];
      h += '<div class="bk-step"><h3>' + t(S.s2) + '</h3><div class="bk-chips">' +
        durs.map(function (n) { return '<button type="button" class="bk-chip" data-act="dur" data-v="' + n + '" aria-pressed="' + (n === self.dur) + '">' + t(S.mins, { n: n }) + "</button>"; }).join("") +
        "</div></div>";
    }

    var open = this.openSlots();
    if (!data.slots.length) {
      h += '<p class="bk-muted">' + t(S.none) + "</p>";
    } else if (!open.length) {
      h += '<p class="bk-muted">' + t(S.noneForPick) + "</p>";
    } else {
      var days = [], seen = {};
      open.forEach(function (x) { var k = dayKey(x.start); if (!seen[k]) { seen[k] = x.start; days.push(k); } });
      if (!this.day || !seen[this.day]) this.day = days[0];
      h += '<div class="bk-step"><h3>' + t(S.s3) + '</h3><div class="bk-chips bk-days">' +
        days.map(function (k) { return '<button type="button" class="bk-chip" data-act="day" data-v="' + k + '" aria-pressed="' + (k === self.day) + '">' + esc(fmtDay(seen[k])) + "</button>"; }).join("") +
        "</div></div>";
      var times = open.filter(function (x) { return dayKey(x.start) === self.day; });
      if (this.slot && !times.some(function (x) { return x.id === self.slot; })) this.slot = null;
      h += '<div class="bk-step"><h3>' + t(S.s4) + '</h3><div class="bk-chips">' +
        times.map(function (x) {
          return '<button type="button" class="bk-chip bk-time" data-act="slot" data-v="' + esc(x.id) + '" aria-pressed="' + (x.id === self.slot) + '">' + timeChip(x.start) +
            (x.left > 1 ? "<small>" + t(S.left, { n: x.left }) + "</small>" : "") + "</button>";
        }).join("") +
        '</div><p class="bk-note">' + t(S.tzNote) + "</p></div>";
    }

    if (this.slot && s) {
      var slot = data.slots.filter(function (x) { return x.id === self.slot; })[0];
      var p = price(s, this.dur), f = this.form;
      h += '<form class="bk-step bk-form" novalidate><h3>' + t(S.s5) + "</h3>" +
        '<div class="bk-sum"><span>' + esc(svcName(s)) + "</span>" + bothLines(slot.start) + "<span>" + t(S.mins, { n: p.minutes }) + '</span><b>$' + money(p.usd) + " / ¥" + money(p.cny) + "</b></div>" +
        '<label class="bk-field"><span>' + t(S.name) + '</span><input name="name" maxlength="60" autocomplete="name" value="' + esc(f.name) + '" required></label>' +
        '<div class="bk-row"><label class="bk-field bk-narrow"><span>' + t(S.contactType) + '</span><select name="ctype">' +
        ["wechat", "email", "phone"].map(function (k) { return '<option value="' + k + '"' + (f.ctype === k ? " selected" : "") + ">" + t(S[k]) + "</option>"; }).join("") +
        '</select></label><label class="bk-field"><span>' + t(S.contact) + '</span><input name="contact" maxlength="120" value="' + esc(f.contact) + '" required></label></div>' +
        '<label class="bk-field"><span>' + t(S.question) + '</span><textarea name="q" rows="3" maxlength="1000">' + esc(f.q) + "</textarea></label>" +
        '<input class="bk-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<fieldset class="bk-field bk-pay"><legend>' + t(S.pay) + "</legend>" +
        ["wechat", "alipay", "zelle"].map(function (k) {
          return '<label><input type="radio" name="pay" value="' + k + '"' + (self.pay === k ? " checked" : "") + "> " + t(S[k]) +
            ' <small>' + (k === "zelle" ? "$" + money(p.usd) : "¥" + money(p.cny)) + "</small></label>";
        }).join("") + "</fieldset>" +
        (this.msg ? '<p class="bk-err" role="alert">' + this.msg + "</p>" : "") +
        '<button type="submit" class="bk-submit"' + (this.busy ? " disabled" : "") + ">" + t(this.busy ? S.submitting : S.submit) + "</button></form>";
    }
    h += "</div>";
    el.innerHTML = h;
  };

  Widget.prototype.renderDone = function () {
    var r = this.result, self = this, P = C.payment || {};
    var rs = this.services().filter(function (x) { return x.key === r.svcKey; })[0];
    var tabs = ["wechat", "alipay", "zelle"].map(function (k) {
      return '<button type="button" class="bk-chip" data-act="pay" data-v="' + k + '" aria-pressed="' + (self.pay === k) + '">' + t(S[k]) + "</button>";
    }).join("");
    var panel;
    if (this.pay === "zelle") {
      var z = P.zelle || {};
      panel = '<dl class="bk-dl"><dt>' + t(S.zName) + "</dt><dd>" + esc(z.name || t(S.todo)) + "</dd><dt>" + t(S.zId) + "</dt><dd>" + esc(z.id || t(S.todo)) +
        "</dd><dt>" + t(S.amount) + "</dt><dd><b>$" + money(r.usd) + "</b></dd></dl>";
    } else {
      var q = (P[this.pay] || {}).qr || "";
      panel = '<div class="bk-qr">' + (q ? '<img class="bk-qr-img" src="' + esc(q) + '" alt="' + esc(t(S[this.pay])) + ' QR">' : '<div class="bk-qr-ph">' + t(S.qrTodo) + "</div>") +
        "<p>" + t(S.amount) + " <b>¥" + money(r.cny) + "</b></p></div>";
    }
    return '<div class="bk bk-done" tabindex="-1">' + (data && data.demo ? '<p class="bk-demo">' + t(S.demo) + "</p>" : "") +
      '<h3 class="bk-title">' + t(S.done) + '</h3><p class="bk-id">' + t(S.idLabel) + " <b>" + esc(r.id) + "</b></p>" +
      '<div class="bk-sum"><span>' + esc(rs ? svcName(rs) : r.svcKey) + "</span>" + bothLines(r.start) + "<span>" + t(S.mins, { n: r.minutes }) + "</span></div>" +
      "<h3>" + t(S.payTitle) + '</h3><div class="bk-chips">' + tabs + "</div>" + panel +
      '<p class="bk-note">' + t(S.memo) + " " + esc(t(C.confirmNote || "")) + "</p>" +
      '<button type="button" class="bk-chip" data-act="again">' + t(S.again) + "</button></div>";
  };

  Widget.prototype.onClick = function (e) {
    var b = e.target.closest("[data-act]"); if (!b) return;
    var a = b.getAttribute("data-act"), v = b.getAttribute("data-v");
    if (this.step === "pick") this.saveForm();
    if (a === "svc") { this.svc = v; this.slot = null; this.msg = ""; }
    else if (a === "dur") { this.dur = +v; this.slot = null; }
    else if (a === "day") { this.day = v; this.slot = null; }
    else if (a === "slot") { this.slot = v; this.msg = ""; }
    else if (a === "pay") { this.pay = v; }
    else if (a === "again") { this.reset(); }
    else if (a === "retry") { var self = this; load(true).then(renderAll); return; }
    else return;
    this.render();
    if (a === "slot") { var f = this.el.querySelector(".bk-form input[name=name]"); if (f) f.focus({ preventScroll: false }); }
  };

  Widget.prototype.submit = function () {
    if (this.busy) return;
    this.saveForm();
    var f = this.form, s = this.svcObj(), self = this;
    var slot = data.slots.filter(function (x) { return x.id === self.slot; })[0];
    if (!f.name.trim() || !f.contact.trim()) { this.msg = t(S.need); this.render(); return; }
    var hp = this.el.querySelector('input[name="website"]');
    var p = price(s, this.dur);
    var payload = {
      action: "book", slotId: slot.id, service: s.key, duration: p.minutes,
      name: f.name.trim(), contactType: f.ctype, contact: f.contact.trim(), question: f.q.trim(),
      payMethod: this.pay, lang: window.I18N.get(), tz: VTZ, website: hp ? hp.value : ""
    };
    var done = function (res) {
      self.busy = false;
      if (res && res.ok) {
        slot.left = Math.max(0, slot.left - 1);
        self.result = { id: res.id, usd: res.price_usd != null ? res.price_usd : p.usd, cny: res.price_cny != null ? res.price_cny : p.cny, minutes: p.minutes, start: slot.start, svcKey: s.key };
        self.step = "done"; self.render();
        var box = self.el.querySelector(".bk-done"); if (box) box.focus();
        renderAll(self);
      } else {
        var err = res && res.error;
        self.msg = err === "full" ? t(S.full) : (err === "slot" || err === "service" || err === "duration") ? t(S.gone) : err === "invalid" ? t(S.need) : t(S.fail);
        if (err === "full" || err === "slot") { self.slot = null; load(true).then(renderAll); }
        else self.render();
      }
    };
    this.busy = true; this.msg = ""; this.render();
    if (data.demo) { setTimeout(function () { done({ ok: true, id: "DEMO-" + Math.random().toString(36).slice(2, 6).toUpperCase() }); }, 500); return; }
    fetch(C.bookingApi, { method: "POST", body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(done)
      .catch(function () { done({ ok: false, error: "network" }); });
  };

  function renderAll(except) { widgets.forEach(function (w) { if (w !== except && w.step === "pick") { w.saveForm(); w.render(); } }); }

  function init() {
    document.querySelectorAll("[data-booking]").forEach(function (el) { widgets.push(new Widget(el)); });
    if (!widgets.length) return;
    widgets.forEach(function (w) { w.render(); });
    load().then(function () { widgets.forEach(function (w) { w.render(); }); });
  }
  document.addEventListener("langchange", function () {
    if (!widgets.length) init(); else widgets.forEach(function (w) { if (w.step === "pick") w.saveForm(); w.render(); });
  });
})();
