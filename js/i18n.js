/* 中英切换
   静态文字：中文写在元素里，英文写在 data-en 属性里。
   动态内容：用 I18N.t({ en: "...", zh: "..." })，并监听 "langchange" 事件重新渲染。 */
(function () {
  var KEY = "yx-lang", lang = null;
  try { lang = localStorage.getItem(KEY); } catch (e) {}
  if (lang !== "zh" && lang !== "en") {
    lang = (navigator.language || "").toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
  }

  function apply() {
    var root = document.documentElement;
    root.lang = lang === "zh" ? "zh-CN" : "en";
    root.setAttribute("data-lang", lang);
    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (el._zh === undefined) el._zh = el.innerHTML;
      el.innerHTML = lang === "en" ? el.getAttribute("data-en") : el._zh;
    });
    document.querySelectorAll("[data-en-label]").forEach(function (el) {
      if (el._zhl === undefined) el._zhl = el.getAttribute("aria-label") || "";
      el.setAttribute("aria-label", lang === "en" ? el.getAttribute("data-en-label") : el._zhl);
    });
    document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
      b.textContent = lang === "zh" ? "EN" : "中文";
      b.setAttribute("aria-label", lang === "zh" ? "Switch to English" : "切换到中文");
    });
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  window.I18N = {
    get: function () { return lang; },
    set: function (l) { lang = l; try { localStorage.setItem(KEY, l); } catch (e) {} apply(); },
    t: function (o) {
      if (o == null) return "";
      if (typeof o === "string" || typeof o === "number") return String(o);
      return o[lang] || o.zh || o.en || "";
    }
  };

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-lang-toggle]");
    if (b) window.I18N.set(lang === "zh" ? "en" : "zh");
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else setTimeout(apply, 0);
})();
