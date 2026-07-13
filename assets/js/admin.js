// ═══ Админ-панель владельца ═══
// Открытие: зайди на сайт с #admin в адресе (например site/#admin) или нажми Ctrl+Shift+A.
// Токен (fine-grained PAT с правом Contents: Read/Write только на этот репозиторий)
// хранится в localStorage ЭТОГО браузера и никуда кроме api.github.com не уходит.
// Правки коммитятся прямо в main; GitHub Pages пересобирает сайт ~за минуту.
(function () {
  const OWNER = "smeshidojoe", REPO = "MySite", BRANCH = "main";
  const API = "https://api.github.com/repos/" + OWNER + "/" + REPO + "/contents/";
  const LS_TOKEN = "gh-admin-token";

  const token = () => localStorage.getItem(LS_TOKEN) || "";
  const isIndex = !!document.getElementById("projects-grid");
  const isGuide = !!document.querySelector(".guide-article");
  let editMode = false;

  /* ── GitHub API ── */
  function b64encode(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function b64decode(b64) {
    const bin = atob(b64.replace(/\s/g, ""));
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  const headers = () => ({
    "Authorization": "Bearer " + token(),
    "Accept": "application/vnd.github+json"
  });
  async function ghGet(path) {
    const r = await fetch(API + path + "?ref=" + BRANCH, { headers: headers() });
    if (!r.ok) throw new Error("GET " + path + " → " + r.status);
    return r.json();
  }
  async function ghPut(path, content, sha, message) {
    const r = await fetch(API + path, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ message, content: b64encode(content), sha, branch: BRANCH })
    });
    if (!r.ok) throw new Error("PUT " + path + " → " + r.status);
    return r.json();
  }
  async function saveFile(path, mutate, message) {
    const cur = await ghGet(path);
    return ghPut(path, mutate(b64decode(cur.content)), cur.sha, message);
  }

  // Путь текущей страницы внутри репозитория (учитывает /MySite/ на Pages)
  function repoPath() {
    let p = decodeURIComponent(location.pathname);
    const marker = "/" + REPO + "/";
    if (p.startsWith(marker)) p = p.slice(marker.length);
    else p = p.replace(/^\//, "");
    if (p === "" || p.endsWith("/")) p += "index.html";
    return p;
  }

  /* ── Стили панели ── */
  const style = document.createElement("style");
  style.textContent = `
    .adm-gear {
      position: fixed; right: 18px; bottom: 18px; z-index: 200;
      width: 48px; height: 48px; border-radius: 50%;
      background: var(--glass-strong); color: var(--text);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      font-size: 1.3rem; cursor: pointer;
      box-shadow: 0 8px 24px rgba(0,0,0,.4);
      transition: transform .3s var(--spring);
    }
    .adm-gear:hover { transform: rotate(30deg) scale(1.1); }
    .adm-panel {
      position: fixed; right: 18px; bottom: 78px; z-index: 200;
      width: 300px; max-height: 74vh; overflow-y: auto;
      background: rgba(13, 17, 23, .88);
      border: 1px solid var(--glass-border); border-radius: 18px;
      backdrop-filter: blur(24px) saturate(160%);
      -webkit-backdrop-filter: blur(24px) saturate(160%);
      padding: 18px; color: var(--text); font-size: .9rem;
      box-shadow: 0 20px 50px rgba(0,0,0,.5);
    }
    .adm-panel[hidden] { display: none; }
    .adm-panel h4 { margin: 0 0 10px; font-size: 1.05rem; }
    .adm-section { border-top: 1px solid rgba(255,255,255,.1); padding: 12px 0; }
    .adm-section label { display: block; color: var(--text-dim); font-size: .8rem; margin-bottom: 6px; }
    .adm-row { display: flex; gap: 8px; align-items: center; }
    .adm-panel input[type=password], .adm-panel input[type=text] {
      flex: 1; min-width: 0; background: rgba(255,255,255,.06); color: var(--text);
      border: 1px solid var(--glass-border); border-radius: 8px; padding: 6px 10px;
      font-size: .85rem;
    }
    .adm-panel input[type=color] {
      width: 42px; height: 32px; border: none; border-radius: 8px;
      background: none; cursor: pointer; padding: 0;
    }
    .adm-btn {
      background: rgba(255,255,255,.08); color: var(--text);
      border: 1px solid var(--glass-border); border-radius: 8px;
      padding: 6px 12px; font-size: .82rem; font-weight: 600; cursor: pointer;
      transition: background .15s, border-color .15s;
    }
    .adm-btn:hover { background: rgba(255,255,255,.16); border-color: var(--accent); }
    .adm-btn.primary { background: var(--accent); color: #14100c; border-color: transparent; }
    .adm-btn.primary:hover { filter: brightness(1.1); }
    .adm-btn.on { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
    .adm-status { min-height: 1.2em; font-size: .78rem; color: var(--text-dim); margin-top: 8px; word-break: break-word; }
    .adm-status.err { color: #ff6b6b; }
    .adm-status.ok { color: #51cf66; }
    .adm-hint { font-size: .75rem; color: var(--text-dim); margin-top: 6px; line-height: 1.4; }
    .adm-editable { outline: 2px dashed var(--accent); outline-offset: 4px; border-radius: 4px; }
  `;
  document.head.appendChild(style);

  /* ── Разметка панели ── */
  const gear = document.createElement("button");
  gear.className = "adm-gear";
  gear.textContent = "⚙";
  gear.title = "Панель владельца (Ctrl+Shift+A)";
  gear.hidden = true;

  const panel = document.createElement("div");
  panel.className = "adm-panel";
  panel.hidden = true;

  const contentSection = (isIndex || isGuide) ? `
    <div class="adm-section">
      <label>Тексты на этой странице</label>
      <div class="adm-row">
        <button class="adm-btn" id="adm-edit">✏️ Редактировать</button>
        <button class="adm-btn primary" id="adm-save-text" disabled>💾 Сохранить</button>
      </div>
      <p class="adm-hint">${isIndex
        ? "Кликай в описания карточек и правь. Сохранение коммитит data/projects.js."
        : "Кликай в текст гайда и правь. Сохранение коммитит этот HTML-файл."}</p>
    </div>` : "";

  panel.innerHTML = `
    <h4>⚙ Панель владельца</h4>
    <div class="adm-section">
      <label>GitHub токен (fine-grained, Contents R/W на ${OWNER}/${REPO})</label>
      <div class="adm-row">
        <input type="password" id="adm-token" placeholder="github_pat_...">
        <button class="adm-btn" id="adm-token-save">OK</button>
      </div>
      <p class="adm-hint">Хранится только в этом браузере. <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">Создать токен</a></p>
    </div>
    <div class="adm-section">
      <label>Акцентный цвет</label>
      <div class="adm-row">
        <input type="color" id="adm-color" value="#ff8a50">
        <input type="text" id="adm-color-hex" value="#ff8a50" maxlength="7">
        <button class="adm-btn primary" id="adm-save-color">💾</button>
      </div>
      <div class="adm-row" style="margin-top:8px">
        <button class="adm-btn" id="adm-color-reset">Сбросить к дефолту</button>
      </div>
    </div>
    ${contentSection}
    <div class="adm-section">
      <div class="adm-row">
        <button class="adm-btn" id="adm-logout">Выйти (удалить токен)</button>
      </div>
      <div class="adm-status" id="adm-status"></div>
    </div>
  `;

  document.body.appendChild(gear);
  document.body.appendChild(panel);

  const $ = (id) => panel.querySelector("#" + id);
  const status = (msg, cls) => {
    const el = $("adm-status");
    el.textContent = msg;
    el.className = "adm-status" + (cls ? " " + cls : "");
  };

  /* ── Показ/скрытие ── */
  function refreshGear() { gear.hidden = !token(); }
  refreshGear();
  gear.addEventListener("click", () => { panel.hidden = !panel.hidden; });
  if (location.hash === "#admin") panel.hidden = false, gear.hidden = false;
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyA") {
      e.preventDefault();
      panel.hidden = !panel.hidden;
      gear.hidden = false;
    }
  });

  /* ── Токен ── */
  if (token()) $("adm-token").value = token();
  $("adm-token-save").addEventListener("click", async () => {
    const t = $("adm-token").value.trim();
    if (!t) return status("Пустой токен", "err");
    localStorage.setItem(LS_TOKEN, t);
    try {
      await ghGet("data/config.js");
      status("Токен работает ✓", "ok");
      refreshGear();
    } catch (e) {
      status("Токен не подошёл: " + e.message, "err");
    }
  });
  $("adm-logout").addEventListener("click", () => {
    localStorage.removeItem(LS_TOKEN);
    refreshGear();
    panel.hidden = true;
  });

  /* ── Акцентный цвет ── */
  const curAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(curAccent)) {
    $("adm-color").value = curAccent;
    $("adm-color-hex").value = curAccent;
  }
  function applyAccent(hex) {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    const n = parseInt(hex.slice(1), 16);
    const s = document.documentElement.style;
    s.setProperty("--accent", hex);
    s.setProperty("--accent-soft", `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, 0.16)`);
  }
  $("adm-color").addEventListener("input", (e) => {
    $("adm-color-hex").value = e.target.value;
    applyAccent(e.target.value);
  });
  $("adm-color-hex").addEventListener("input", (e) => {
    const v = e.target.value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(v)) { $("adm-color").value = v; applyAccent(v); }
  });
  async function saveConfig(accent) {
    status("Сохраняю цвет…");
    try {
      await saveFile("data/config.js", () =>
        "// Настройки сайта. Меняются через админ-панель (⚙) или руками.\n" +
        "// accent: hex-цвет акцента, пустая строка = дефолт из CSS.\n" +
        "window.SITE_CONFIG = " + JSON.stringify({ accent }, null, 2) + ";\n",
        "Set accent color via admin panel");
      status("Цвет сохранён ✓ (Pages обновится ~через минуту)", "ok");
    } catch (e) { status(e.message, "err"); }
  }
  $("adm-save-color").addEventListener("click", () => saveConfig($("adm-color-hex").value.trim()));
  $("adm-color-reset").addEventListener("click", () => {
    document.documentElement.style.removeProperty("--accent");
    document.documentElement.style.removeProperty("--accent-soft");
    saveConfig("");
  });

  /* ── Редактирование текстов ── */
  function editableEls() {
    return isIndex
      ? [...document.querySelectorAll(".card-desc")]
      : [...document.querySelectorAll(".guide-article .only-ru, .guide-article .only-en")];
  }
  function setEditMode(on) {
    editMode = on;
    editableEls().forEach(el => {
      el.contentEditable = on ? "true" : "false";
      el.classList.toggle("adm-editable", on);
    });
    if ($("adm-edit")) {
      $("adm-edit").classList.toggle("on", on);
      $("adm-save-text").disabled = !on;
    }
  }
  if (isIndex) {
    // правки описаний уходят в window.PROJECTS сразу при вводе
    document.getElementById("projects-grid").addEventListener("input", (e) => {
      const el = e.target.closest(".card-desc");
      if (!el || el.dataset.idx === undefined) return;
      const key = (window.I18N && window.I18N.getLang() === "en") ? "desc_en" : "desc_ru";
      window.PROJECTS[+el.dataset.idx][key] = el.textContent;
    });
    // после смены языка карточки перерисовываются — вернуть режим правки
    document.addEventListener("langchange", () => { if (editMode) setEditMode(true); });
  }
  if ($("adm-edit")) {
    $("adm-edit").addEventListener("click", () => setEditMode(!editMode));
    $("adm-save-text").addEventListener("click", async () => {
      status("Сохраняю тексты…");
      try {
        if (isIndex) {
          await saveFile("data/projects.js", () =>
            "// Проекты портфолио. Добавляй медиа в assets/media/<имя-проекта>/\n" +
            "// media: массив путей относительно корня сайта; картинки (.png .jpg .webp .gif) и видео (.mp4 .webm)\n" +
            "window.PROJECTS = " + JSON.stringify(window.PROJECTS, null, 2) + ";\n",
            "Edit project descriptions via admin panel");
        } else {
          await saveFile(repoPath(), (src) => {
            const doc = new DOMParser().parseFromString(src, "text/html");
            ["only-ru", "only-en"].forEach(cls => {
              const live = document.querySelector(".guide-article ." + cls);
              const target = doc.querySelector(".guide-article ." + cls);
              if (live && target) target.innerHTML = live.innerHTML;
            });
            return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML + "\n";
          }, "Edit guide text via admin panel");
        }
        setEditMode(false);
        status("Тексты сохранены ✓ (Pages обновится ~через минуту)", "ok");
      } catch (e) { status(e.message, "err"); }
    });
  }
})();
