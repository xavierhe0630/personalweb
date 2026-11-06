/* 渲染简历：读取 js/resume-data.js，输出到 #resume-root */
(function () {
  var R = window.RESUME;
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var LAB = {
    about: { en: "About", zh: "个人简介" },
    aboutHint: { en: "Placeholder: 3–5 sentences on who you are, what you do, and what you’re looking for.", zh: "预留区域：写 3–5 句话介绍你是谁、在做什么、想找什么样的机会。" },
    experience: { en: "Work Experience", zh: "工作经历" },
    education: { en: "Education", zh: "教育经历" },
    project: { en: "Project", zh: "项目经历" },
    leadership: { en: "Leadership", zh: "领导力" },
    community: { en: "Healthcare & Community", zh: "医疗与社区服务" },
    skills: { en: "Skills", zh: "技能与语言" },
    certs: { en: "Certifications", zh: "证书" },
    gallery: { en: "Gallery", zh: "工作与活动照片" },
    schoolsAlt: { en: "Map locations of the schools I attended", zh: "我就读过的学校定位" },
    photoAlt: { en: "Portrait of Yixuan He", zh: "Yixuan He 个人照片" },
    linkedinTodo: { en: "LinkedIn (to add)", zh: "LinkedIn（待补充）" },
    galleryTodo: { en: "Photo slot", zh: "照片位" }
  };
  var JUMP = ["experience", "education", "project", "leadership", "community", "skills", "gallery"];
  var JUMP_LAB = {
    experience: { en: "Experience", zh: "工作" }, education: { en: "Education", zh: "教育" },
    project: { en: "Project", zh: "项目" }, leadership: { en: "Leadership", zh: "领导力" },
    community: { en: "Community", zh: "社区服务" }, skills: { en: "Skills", zh: "技能" },
    gallery: { en: "Gallery", zh: "照片" }
  };

  function t(o) { return window.I18N.t(o); }
  function zh() { return window.I18N.get() === "zh"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function d(s) {
    if (s === "now") return zh() ? "至今" : "Present";
    var m = /^(\d{4})-(\d{2})$/.exec(s);
    if (!m) return s;
    return zh() ? m[1] + "." + m[2] : MONTHS[+m[2] - 1] + " " + m[1];
  }
  // 页面在子文件夹（如 /resume/）时，图片路径要加上前缀
  function src(p) {
    var base = window.SITE_BASE || "";
    if (!p || /^(data:|https?:|\/)/.test(p)) return p;
    return base + p;
  }
  function range(w) { return w ? d(w[0]) + " – " + d(w[1]) : ""; }
  var IMG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/></svg>';

  function head(key) {
    return '<div class="sec-head"><h2>' + esc(t(LAB[key])) + "</h2></div>";
  }
  function rows(list) {
    return list.map(function (x) {
      return '<article class="row"><div class="when"><b>' + esc(t(x.org)) + "</b>" +
        (x.when ? '<span class="dates">' + range(x.when) + "</span>" : "") +
        (x.where ? "<span>" + esc(t(x.where)) + "</span>" : "") +
        '</div><div class="what"><h3>' + esc(t(x.role)) + "</h3><ul>" +
        x.points.map(function (p) { return "<li>" + esc(t(p)) + "</li>"; }).join("") +
        "</ul></div></article>";
    }).join("");
  }

  function render() {
    var root = document.getElementById("resume-root");
    if (!root || !R) return;
    var about = t(R.about);
    var h = "";

    h += '<header class="p1-band"><div class="wrap p1-hero-grid"><div>' +
      '<h1 class="p1-name">' + R.name.split(" ").map(esc).join(" <br>") + "</h1>" +
      '<p class="p1-meta">' + esc(t(R.tagline)) + "<br>" + esc(t(R.location)) +
      ' <span class="sep">/</span> <a href="mailto:' + esc(R.email) + '">' + esc(R.email) + "</a>" +
      ' <span class="sep">/</span> ' +
      (R.linkedin ? '<a href="' + esc(R.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>' : '<span class="todo">' + esc(t(LAB.linkedinTodo)) + "</span>") +
      "</p></div>" +
      (about
        ? '<section class="about filled"><h2>' + esc(t(LAB.about)) + "</h2><p>" + esc(about) + "</p></section>"
        : '<section class="about ph"><h2>' + esc(t(LAB.about)) + "</h2><p>" + esc(t(LAB.aboutHint)) + '</p><div class="lines" aria-hidden="true"><span></span><span></span><span></span></div></section>') +
      "</div></header>";

    h += '<div class="wrap"><div class="p1-jump-bar"><nav class="p1-jump" aria-label="' + (zh() ? "本页目录" : "On this page") + '">' +
      JUMP.map(function (k, i) { return '<button type="button" class="c' + (i % 3 + 1) + '" data-jump="' + k + '">' + esc(t(JUMP_LAB[k])) + "</button>"; }).join("") +
      "</nav></div>";

    h += '<section class="sec c1" id="experience">' + head("experience") + rows(R.experience) + "</section>";

    var E = R.education;
    h += '<section class="sec c2" id="education">' + head("education") +
      '<div class="edu-grid"><figure class="schools-shot"><img src="' + esc(src(E.schoolsImage)) + '" alt="' + esc(t(LAB.schoolsAlt)) + '" loading="lazy"></figure>' +
      '<div class="edu-side"><figure class="portrait"><img src="' + esc(src(E.photo)) + '" alt="' + esc(t(LAB.photoAlt)) + '" loading="lazy"></figure>' +
      '<div class="degrees">' + E.degrees.map(function (g) {
        return '<div class="degree"><h3>' + esc(t(g.school)) + "</h3><p>" + esc(t(g.degree)) + '</p><span class="dates">' + range(g.when) + "</span></div>";
      }).join("") + "</div></div></div></section>";

    h += '<section class="sec c3" id="project">' + head("project") + rows(R.project) + "</section>";
    h += '<section class="sec c1" id="leadership">' + head("leadership") + rows(R.leadership) + "</section>";
    h += '<section class="sec c2" id="community">' + head("community") + rows(R.community) + "</section>";

    h += '<section class="sec c3" id="skills"><div class="two"><div>' + head("skills") +
      R.skills.map(function (s, i) {
        return '<div class="skill-row"><b>' + esc(t(s.label)) + '</b><div class="tags">' +
          s.items.map(function (it) { return '<span class="tag c' + (i % 3 + 1) + '">' + esc(t(it)) + "</span>"; }).join("") + "</div></div>";
      }).join("") +
      "</div><div>" + head("certs") +
      R.certs.map(function (c) { return '<div class="cert">' + esc(t(c.name)) + "<span>" + d(c.when) + "</span></div>"; }).join("") +
      "</div></div></section>";

    h += '<section class="sec c1 no-print" id="gallery">' + head("gallery") + '<div class="gallery">' +
      R.gallery.map(function (g) {
        var cls = g.big ? " big" : "";
        return g.src
          ? '<figure class="shot' + cls + '"><img src="' + esc(src(g.src)) + '" alt="' + esc(t(g.caption)) + '" loading="lazy"><figcaption>' + esc(t(g.caption)) + "</figcaption></figure>"
          : '<div class="ph-img' + cls + '">' + IMG + "<span>" + esc(t(LAB.galleryTodo)) + "</span><span>" + esc(t(g.caption)) + "</span></div>";
      }).join("") + "</div></section>";

    h += '<footer class="p1-foot"><span>' + esc(R.name) + ", " + esc(t(R.location)) + '</span><a href="mailto:' + esc(R.email) + '">' + esc(R.email) + "</a></footer></div>";

    root.innerHTML = h;
    root.querySelectorAll("[data-jump]").forEach(function (b) {
      b.addEventListener("click", function () {
        var el = document.getElementById(b.getAttribute("data-jump"));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
    });
    spy(root);
  }

  // 下滑时高亮当前所在的板块
  var observer = null;
  function spy(root) {
    if (observer) observer.disconnect();
    if (!("IntersectionObserver" in window)) return;
    var bar = root.querySelector(".p1-jump");
    var buttons = {};
    root.querySelectorAll("[data-jump]").forEach(function (b) { buttons[b.getAttribute("data-jump")] = b; });
    function mark(id) {
      Object.keys(buttons).forEach(function (k) {
        if (k === id) buttons[k].setAttribute("aria-current", "true"); else buttons[k].removeAttribute("aria-current");
      });
      var b = buttons[id];
      if (b && bar.scrollWidth > bar.clientWidth) {
        bar.scrollTo({ left: b.offsetLeft - (bar.clientWidth - b.offsetWidth) / 2, behavior: "smooth" });
      }
    }
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting && buttons[e.target.id]) mark(e.target.id); });
    }, { rootMargin: "-140px 0px -55% 0px" });
    JUMP.forEach(function (id) { var s = document.getElementById(id); if (s) observer.observe(s); });
  }

  document.addEventListener("langchange", render);
})();
