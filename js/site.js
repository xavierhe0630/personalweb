/* 主站：页面切换、八卦图、塔罗翻牌、呼吸练习 */
(function () {
  var pages = ["resume", "yijing", "tarot", "listen"];
  var TITLES = {
    resume: { zh: "Yixuan He", en: "Yixuan He" },
    yijing: { zh: "易经问卜 | Yixuan He", en: "I Ching Readings | Yixuan He" },
    tarot: { zh: "塔罗梳理 | Yixuan He", en: "Tarot Planning | Yixuan He" },
    listen: { zh: "倾诉倾听 | Yixuan He", en: "Talk & Listen | Yixuan He" }
  };
  var current = null;

  function show() {
    var h = (location.hash || "").replace("#", "");
    if (h === "counseling") h = "listen";
    if (pages.indexOf(h) < 0) h = "resume";
    document.body.setAttribute("data-page", h);
    pages.forEach(function (p) {
      document.getElementById("page-" + p).classList.toggle("active", p === h);
      var a = document.querySelector('[data-tab="' + p + '"]');
      if (p === h) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (current !== h) window.scrollTo(0, 0);
    current = h;
    document.title = window.I18N.t(TITLES[h]);
  }
  window.addEventListener("hashchange", show);
  show();

  document.querySelectorAll("[data-todo]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      if (el._busy) return; el._busy = true;
      var old = el.innerHTML;
      el.textContent = window.I18N.get() === "zh" ? "联系方式待补充" : "Contact details coming soon";
      setTimeout(function () { el.innerHTML = old; el._busy = false; }, 1400);
    });
  });

  // 八卦环（先天八卦，自上方顺时针：乾 巽 坎 艮 坤 震 离 兑；每卦三爻由外向内）
  var tri = [[1, 1, 1], [1, 1, 0], [0, 1, 0], [1, 0, 0], [0, 0, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1]];
  var g = document.getElementById("trigs");
  if (g) {
    var html = "";
    tri.forEach(function (lines, i) {
      html += '<g transform="rotate(' + i * 45 + ' 200 200)">';
      lines.forEach(function (yang, j) {
        var y = 26 + j * 14;
        html += yang ? '<rect x="168" y="' + y + '" width="64" height="8" rx="1"/>'
          : '<rect x="168" y="' + y + '" width="27" height="8" rx="1"/><rect x="205" y="' + y + '" width="27" height="8" rx="1"/>';
      });
      html += "</g>";
    });
    g.innerHTML = html;
  }

  // 塔罗翻牌
  document.querySelectorAll(".card").forEach(function (c) {
    c.addEventListener("click", function () { c.classList.toggle("flipped"); });
  });

  // 呼吸练习：吸气 4 秒，呼气 6 秒，共 3 轮
  var B = {
    ready: { zh: "准备好了吗", en: "Ready?" }, inh: { zh: "吸气", en: "Breathe in" }, exh: { zh: "慢慢呼气", en: "Breathe out slowly" },
    done: { zh: "做得很好", en: "Well done" }, start: { zh: "开始一次呼吸练习", en: "Start a breathing exercise" },
    stop: { zh: "停止", en: "Stop" }, again: { zh: "再来一次", en: "Again" }
  };
  var orb = document.getElementById("orb"), txt = document.getElementById("orbText"), btn = document.getElementById("breathBtn");
  var timer = null, state = { text: "ready", btn: "start" };
  function paint() { txt.textContent = window.I18N.t(B[state.text]); btn.textContent = window.I18N.t(B[state.btn]); }
  function set(text, b) { if (text) state.text = text; if (b) state.btn = b; paint(); }
  function stop() { clearTimeout(timer); timer = null; orb.className = "orb"; set("ready", "start"); }
  if (btn) {
    btn.addEventListener("click", function () {
      if (timer) { stop(); return; }
      var round = 0; set(null, "stop");
      (function cycle() {
        if (round >= 3) { orb.className = "orb"; timer = null; set("done", "again"); return; }
        orb.className = "orb in"; set("inh");
        timer = setTimeout(function () {
          orb.className = "orb out"; set("exh");
          timer = setTimeout(function () { round++; cycle(); }, 6000);
        }, 4000);
      })();
    });
  }

  document.addEventListener("langchange", function () {
    if (current) document.title = window.I18N.t(TITLES[current]);
    if (btn) paint();
  });
})();
