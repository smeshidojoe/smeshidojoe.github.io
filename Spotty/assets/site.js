/* Spotty site: language switch, mobile nav, live download link,
   and the search bar you can actually type into.

   The demo is the product, so it follows the same rules the app does:
   it answers on key-down, the selection keeps its identity while it
   moves (one pill on a spring, never a row lighting up), and every
   animation can be interrupted mid-flight. */
(function () {
  "use strict";

  /* ═══ Language ═══ */
  const LS = "spotty-lang";
  function getLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "ru" || q === "en") { localStorage.setItem(LS, q); return q; }
    return localStorage.getItem(LS) || "en";
  }
  function applyLang(l) {
    document.documentElement.lang = l;
    document.querySelectorAll(".lang-btn").forEach(b => { b.textContent = l === "en" ? "RU" : "EN"; });
    const t = document.querySelector("title[data-" + l + "]");
    if (t) document.title = t.getAttribute("data-" + l);
    document.querySelectorAll("[data-ph-" + l + "]").forEach(el => {
      el.placeholder = el.getAttribute("data-ph-" + l);
    });
    document.dispatchEvent(new CustomEvent("langchange", { detail: l }));
  }
  applyLang(getLang());
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".lang-btn");
    if (!b) return;
    const next = getLang() === "en" ? "ru" : "en";
    localStorage.setItem(LS, next);
    applyLang(next);
  });

  /* ═══ Mobile nav ═══ */
  const burger = document.querySelector(".burger");
  const navLinks = document.getElementById("nav-links");
  if (burger && navLinks) {
    const mq = window.matchMedia("(max-width: 900px)");
    const sync = () => { navLinks.hidden = mq.matches; };
    sync();
    mq.addEventListener("change", sync);
    burger.addEventListener("click", () => { navLinks.hidden = !navLinks.hidden; });
    navLinks.addEventListener("click", (e) => {
      if (e.target.closest("a") && mq.matches) navLinks.hidden = true;
    });
  }

  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  /* ═══ Download: resolve the installer from the latest release.
       Until there is one, the button keeps its releases-page link. ═══ */
  const dlBtns = document.querySelectorAll("[data-download]");
  if (dlBtns.length) {
    fetch("https://api.github.com/repos/smeshidojoe/Spotty/releases/latest")
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!d) return;
        const exe = (d.assets || []).find(a => /\.exe$/i.test(a.name));
        if (!exe) return;
        dlBtns.forEach(a => { a.href = exe.browser_download_url; a.removeAttribute("target"); });
        const mb = (exe.size / 1048576).toFixed(0);
        document.querySelectorAll("[data-release-info]").forEach(el => {
          el.textContent = (d.tag_name || "") + " \u00b7 " + mb + " MB";
          el.hidden = false;
        });
      })
      .catch(() => { /* offline or rate-limited: the fallback link stands */ });
  }

  /* ═══════════════════════════════════════════════════
     The demo
     ═══════════════════════════════════════════════════ */
  const bar = document.getElementById("bar");
  if (!bar) return;

  const input = bar.querySelector("input");
  const body = document.getElementById("bar-body");
  const pill = document.getElementById("sel-pill");
  const toastEl = document.getElementById("toast");

  /* A small index that covers everything the launcher can find.
     `hits` stands in for how often you have opened the thing — what you
     use a lot floats up, exactly like the real ranking does. */
  const INDEX = [
    { k: "app", n: "Telegram", ic: "\u2708", meta: "AppData\\Roaming\\Telegram Desktop", hits: 34 },
    { k: "app", n: "Visual Studio Code", ic: "\u2328", meta: "Program Files\\Microsoft VS Code", hits: 28 },
    { k: "app", n: "Microsoft Edge", ic: "\u25d0", meta: "Program Files (x86)\\Microsoft\\Edge", hits: 21 },
    { k: "app", n: "Calculator", ru: "Калькулятор", ic: "\u00f7", meta: "store", hits: 12 },
    { k: "app", n: "Notepad", ru: "Блокнот", ic: "\u270e", meta: "Windows\\System32", hits: 9 },
    { k: "app", n: "Settings", ru: "Параметры", ic: "\u2699", meta: "store", hits: 7 },
    { k: "app", n: "Steam", ic: "\u25c9", meta: "D:\\Games\\Steam", hits: 15 },
    { k: "app", n: "Photoshop", ic: "\u25e7", meta: "D:\\Adobe\\Photoshop", hits: 6 },
    { k: "app", n: "Terminal", ru: "Терминал", ic: "\u232b", meta: "store", hits: 5 },
    { k: "app", n: "Blender", ic: "\u25d3", meta: "D:\\Portable\\blender", hits: 3 },
    { k: "file", n: "report-q3.docx", ic: "\u25a4", meta: "Documents", hits: 4 },
    { k: "file", n: "budget.xlsx", ic: "\u25a6", meta: "Documents\\2026", hits: 2 },
    { k: "file", n: "screenshot.png", ic: "\u25a3", meta: "Desktop", hits: 2 },
    { k: "file", n: "Spotty-Setup.exe", ic: "\u25a7", meta: "Downloads", hits: 1 },
    { k: "folder", n: "Projects", ru: "Проекты", ic: "\u25b1", meta: "D:\\", hits: 8 }
  ];

  /* Typed in the wrong layout? The keys are in the same places, so the
     query is translated back before matching. */
  const RU = "йцукенгшщзхъфывапролджэячсмитьбю.";
  const EN = "qwertyuiop[]asdfghjkl;'zxcvbnm,./";
  function fixLayout(s) {
    let out = "", changed = false;
    for (const ch of s) {
      const i = RU.indexOf(ch.toLowerCase());
      if (i >= 0) { out += EN[i]; changed = true; } else { out += ch; }
    }
    return changed ? out : null;
  }

  /* ── scoring ──
     A prefix beats a word start, a word start beats initials, initials
     beat a loose subsequence. Frequency only breaks ties. */
  function score(item, q, lang) {
    const a = scoreName(item.n, item.hits, q);
    if (a) a.field = "n";
    if (!item.ru) return a;
    const b = scoreName(item.ru, item.hits, q);
    if (b) b.field = "ru";
    if (!a) return b;
    if (!b) return a;
    return b.s > a.s ? b : a;
  }

  function scoreName(source, hits, q) {
    const name = source.toLowerCase();
    const q1 = q.toLowerCase();
    if (!q1) return { s: hits, hl: null };

    if (name.startsWith(q1)) return { s: 1000 + hits, hl: [0, q1.length] };

    const words = name.split(/[\s\-_.]+/);
    let at = 0;
    for (const w of words) {
      const idx = name.indexOf(w, at);
      if (w.startsWith(q1)) return { s: 820 + hits, hl: [idx, idx + q1.length] };
      at = idx + w.length;
    }

    // initials: vsc -> Visual Studio Code
    const initials = words.map(w => w[0] || "").join("").toLowerCase();
    if (initials.startsWith(q1) && q1.length > 1) return { s: 700 + hits, hl: null };

    // loose subsequence, penalised by how spread out the letters are
    let i = 0, first = -1, last = -1;
    for (let c = 0; c < name.length && i < q1.length; c++) {
      if (name[c] === q1[i]) { if (first < 0) first = c; last = c; i++; }
    }
    if (i === q1.length) return { s: 400 - (last - first) + hits, hl: null };
    return null;
  }

  function labelOf(item, lang) {
    return (lang === "ru" && item.ru) ? item.ru : item.n;
  }

  function markup(item, r, lang) {
    const label = labelOf(item, lang);
    const shown = (lang === "ru" && item.ru) ? "ru" : "n";
    if (!r || !r.hl || r.field !== shown) return esc(label);
    return esc(label.slice(0, r.hl[0])) + "<mark>" + esc(label.slice(r.hl[0], r.hl[1])) + "</mark>" + esc(label.slice(r.hl[1]));
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  /* ── calculator: a tiny recursive-descent parser, no eval ── */
  function calc(src) {
    const s = src.replace(/,(?=\d)/g, ".").replace(/[×х]/g, "*").replace(/÷/g, "/");
    if (!/\d/.test(s) || !/^[\d\s.+\-*/%^()]+$/.test(s)) return null;
    if (!/[+\-*/%^]/.test(s)) return null;
    let i = 0;
    const ws = () => { while (s[i] === " ") i++; };
    function expr() {
      let v = term();
      for (;;) {
        ws();
        if (s[i] === "+") { i++; v += term(); }
        else if (s[i] === "-") { i++; v -= term(); }
        else return v;
      }
    }
    function term() {
      let v = power();
      for (;;) {
        ws();
        if (s[i] === "*") { i++; v *= power(); }
        else if (s[i] === "/") { i++; v /= power(); }
        else if (s[i] === "%") { i++; v %= power(); }
        else return v;
      }
    }
    function power() {
      const base = unary();
      ws();
      if (s[i] === "^") { i++; return Math.pow(base, power()); }
      if (s[i] === "*" && s[i + 1] === "*") { i += 2; return Math.pow(base, power()); }
      return base;
    }
    function unary() {
      ws();
      if (s[i] === "-") { i++; return -unary(); }
      if (s[i] === "+") { i++; return unary(); }
      return atom();
    }
    function atom() {
      ws();
      if (s[i] === "(") {
        i++;
        const v = expr();
        ws();
        if (s[i] === ")") i++; else throw 0;
        return v;
      }
      const start = i;
      while (i < s.length && /[\d.]/.test(s[i])) i++;
      if (i === start) throw 0;
      const n = parseFloat(s.slice(start, i));
      if (!isFinite(n)) throw 0;
      return n;
    }
    try {
      const v = expr();
      ws();
      if (i !== s.length || !isFinite(v)) return null;
      return Math.round(v * 1e10) / 1e10;
    } catch (e) { return null; }
  }

  const T = {
    en: {
      suggestions: "Suggestions", apps: "Applications", files: "Files and folders",
      result: "Result", web: "Web",
      app: "Application", file: "File", folder: "Folder",
      calc: "Calculator \u00b7 Enter copies", command: "Command Prompt",
      search: "Search Google for", open: "Open", site: "Website",
      empty: "Nothing found. Every search still ends with a web search.",
      opened: "Opened", copied: "Copied", ran: "Would run", admin: "Run as administrator",
      searched: "Searched the web for", actions: "Actions: Open \u00b7 Run as administrator \u00b7 Show in folder \u00b7 Copy path \u00b7 Hide"
    },
    ru: {
      suggestions: "Подсказки", apps: "Программы", files: "Файлы и папки",
      result: "Результат", web: "Интернет",
      app: "Программа", file: "Файл", folder: "Папка",
      calc: "Калькулятор \u00b7 Enter копирует", command: "Командная строка",
      search: "Искать в Google", open: "Открыть", site: "Сайт",
      empty: "Ничего не нашлось. В конце выдачи всегда есть поиск в интернете.",
      opened: "Открыли", copied: "Скопировали", ran: "Выполнили бы", admin: "Запуск от администратора",
      searched: "Искали в интернете", actions: "Действия: открыть \u00b7 от администратора \u00b7 показать в папке \u00b7 скопировать путь \u00b7 скрыть"
    }
  };
  const t = () => T[getLang()] || T.en;

  /* ── building the result list ── */
  function build(q) {
    const lang = getLang();
    const L = t();
    const groups = [];
    const raw = q.trim();

    if (raw.startsWith(">")) {
      const cmd = raw.slice(1).trim();
      if (cmd) groups.push([L.result, [{ ic: "\u25b8", cls: "cmd", title: esc(cmd), right: L.command, act: "cmd", label: cmd }]]);
      return groups;
    }

    if (raw.startsWith("?")) {
      const w = raw.slice(1).trim();
      if (w) groups.push([L.web, [{ ic: "\u2315", cls: "web", title: esc(L.search + " \u201c" + w + "\u201d"), right: "Google", act: "web", label: w }]]);
      return groups;
    }

    if (!raw) {
      const top = INDEX.slice().sort((a, b) => b.hits - a.hits);
      groups.push([L.suggestions, top.slice(0, 3).map(it => rowOf(it, null, lang, L))]);
      groups.push([L.apps, top.filter(i => i.k === "app").slice(3, 9).map(it => rowOf(it, null, lang, L))]);
      return groups;
    }

    const answer = calc(raw);
    if (answer !== null) {
      groups.push([L.result, [{
        ic: "=", cls: "calc", title: esc(raw), right: "", big: String(answer),
        sub: L.calc, act: "calc", label: String(answer)
      }]]);
    }

    // an address goes into the web group next to the search, not above it
    const web = [];
    if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(raw) && !answer) {
      web.push({ ic: "\u2b21", cls: "web", title: esc(L.open + " " + raw), right: L.site, act: "site", label: raw });
    }

    const alt = fixLayout(raw);
    const hits = [];
    INDEX.forEach(it => {
      let r = score(it, raw, lang);
      if (!r && alt) r = score(it, alt, lang);
      if (r) hits.push({ it, r });
    });
    hits.sort((a, b) => b.r.s - a.r.s);

    const apps = hits.filter(h => h.it.k === "app").slice(0, 6);
    const files = hits.filter(h => h.it.k !== "app").slice(0, 4);
    if (apps.length) groups.push([L.apps, apps.map(h => rowOf(h.it, h.r, lang, L))]);
    if (files.length) groups.push([L.files, files.map(h => rowOf(h.it, h.r, lang, L))]);

    web.push({
      ic: "\u2315", cls: "web", title: esc(L.search + " \u201c" + raw + "\u201d"), right: "Google", act: "web", label: raw
    });
    groups.push([L.web, web]);
    return groups;
  }

  function rowOf(it, r, lang, L) {
    return {
      ic: it.ic, cls: "",
      title: markup(it, r, lang),
      right: it.meta === "store" ? L[it.k] : it.meta,
      act: "open",
      label: labelOf(it, lang)
    };
  }

  /* ── rendering ── */
  let rows = [];
  let sel = 0;

  function render(q, keepSelection) {
    const groups = build(q);
    const frag = document.createDocumentFragment();
    rows = [];
    let n = 0;

    groups.forEach(([name, items]) => {
      if (!items.length) return;
      const h = document.createElement("div");
      h.className = "bar-group";
      h.textContent = name;
      frag.appendChild(h);
      items.forEach(item => {
        const el = document.createElement("div");
        el.className = "row";
        el.style.animationDelay = Math.min(n, 7) * 26 + "ms";
        el.innerHTML =
          '<span class="ic ' + item.cls + '">' + item.ic + "</span>" +
          '<span class="tx"><span class="tt">' + item.title + "</span>" +
          (item.sub ? '<span class="sub">' + esc(item.sub) + "</span>" : "") +
          "</span>" +
          (item.big ? '<span class="big">' + esc(item.big) + "</span>" : "") +
          (item.right ? '<span class="kind">' + esc(item.right) + "</span>" : "");
        const idx = n++;
        el.addEventListener("pointerenter", () => select(idx));
        el.addEventListener("click", () => { select(idx); commit(false); });
        rows.push({ el, item });
        frag.appendChild(el);
      });
    });

    body.innerHTML = "";
    body.appendChild(pill);
    if (!rows.length) {
      const e = document.createElement("div");
      e.className = "bar-empty";
      e.textContent = t().empty;
      body.appendChild(e);
      pill.classList.remove("on");
      return;
    }
    body.appendChild(frag);
    sel = keepSelection ? Math.min(sel, rows.length - 1) : 0;
    pill.classList.add("on");
    // new content, no spatial continuity to preserve: land, do not glide
    movePill(true);
  }

  /* ── the selection pill, on a critically damped spring ──
     It retargets from wherever it currently is, so holding the arrow key
     never produces a queue of animations, only one continuous move. */
  const spring = makeSpring(v => { pill.style.transform = "translateY(" + v + "px)"; });

  function makeSpring(onFrame) {
    const RESPONSE = 0.24;     // seconds to reach the target, not a duration
    const DAMPING = 1;         // critically damped: no overshoot
    const w = (2 * Math.PI) / RESPONSE;
    let value = 0, target = 0, vel = 0, raf = 0, last = 0;

    function step(now) {
      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const a = -w * w * (value - target) - 2 * DAMPING * w * vel;
      vel += a * dt;
      value += vel * dt;
      if (Math.abs(value - target) < 0.2 && Math.abs(vel) < 0.6) {
        value = target; vel = 0; raf = 0; last = 0;
        onFrame(value);
        return;
      }
      onFrame(value);
      raf = requestAnimationFrame(step);
    }
    return {
      to(next, snap) {
        target = next;
        if (snap || reduced.matches) {
          value = next; vel = 0;
          if (raf) { cancelAnimationFrame(raf); raf = 0; last = 0; }
          onFrame(value);
          return;
        }
        if (!raf) { last = 0; raf = requestAnimationFrame(step); }
      }
    };
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  function movePill(snap) {
    const r = rows[sel];
    if (!r) return;
    pill.style.height = r.el.offsetHeight + "px";
    spring.to(r.el.offsetTop, snap);
  }

  function select(i) {
    if (i === sel || !rows[i]) return;
    sel = i;
    movePill(false);
    const el = rows[sel].el;
    const top = el.offsetTop, bottom = top + el.offsetHeight;
    if (top < body.scrollTop) body.scrollTop = top - 8;
    else if (bottom > body.scrollTop + body.clientHeight) body.scrollTop = bottom - body.clientHeight + 8;
  }

  /* ── the toast ── */
  let toastTimer = 0;
  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("on"), 1900);
  }

  function commit(admin) {
    const r = rows[sel];
    if (!r) return;
    const L = t();
    const it = r.item;
    if (it.act === "calc") toast(L.copied + ": " + it.label);
    else if (it.act === "cmd") toast(L.ran + ": " + it.label);
    else if (it.act === "web") toast(L.searched + ": " + it.label);
    else if (it.act === "site") toast(L.open + ": " + it.label);
    else toast((admin ? L.admin + ": " : L.opened + ": ") + it.label);
  }

  /* ── input ── */
  let scripted = null;

  function stopScript() {
    if (scripted) { clearTimeout(scripted); scripted = null; }
  }

  input.addEventListener("input", () => { stopScript(); render(input.value, false); });
  input.addEventListener("focus", () => bar.classList.add("focused"));
  input.addEventListener("blur", () => bar.classList.remove("focused"));

  input.addEventListener("keydown", (e) => {
    stopScript();
    if (e.key === "ArrowDown") { e.preventDefault(); select(Math.min(sel + 1, rows.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); select(Math.max(sel - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); commit(e.ctrlKey || e.metaKey); }
    else if (e.key === "Escape") {
      e.preventDefault();
      if (input.value) { input.value = ""; render("", false); } else { input.blur(); }
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault(); toast(t().actions);
    }
  });

  bar.addEventListener("pointerdown", (e) => {
    if (e.target === input) return;
    stopScript();
    // keep the caret where a launcher keeps it: in the query
    setTimeout(() => input.focus(), 0);
  });

  document.querySelectorAll(".try").forEach(chip => {
    chip.addEventListener("click", () => {
      stopScript();
      input.value = chip.dataset.q;
      input.focus();
      render(input.value, false);
    });
  });

  document.addEventListener("langchange", () => render(input.value, true));

  /* ── one scripted pass, the first time the bar comes into view ──
     It stops the moment you touch anything; after that the bar is yours. */
  function type(text, done) {
    let i = 0;
    (function next() {
      input.value = text.slice(0, ++i);
      render(input.value, false);
      if (i < text.length) scripted = setTimeout(next, 55 + Math.random() * 45);
      else scripted = setTimeout(done, 1500);
    })();
  }

  render("", false);

  if (!reduced.matches && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      scripted = setTimeout(() => {
        type("vsc", () => {
          input.value = "";
          render("", false);
          scripted = setTimeout(() => {
            type("12*(3+4)^2", () => {
              input.value = "";
              render("", false);
              scripted = null;
            });
          }, 400);
        });
      }, 700);
    }, { threshold: 0.5 });
    io.observe(bar);
  }
})();
