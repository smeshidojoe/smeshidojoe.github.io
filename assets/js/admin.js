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
  const isProject = !!document.getElementById("project-content");
  const isGuide = !isProject && !!document.querySelector(".guide-article");
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
      width: min(300px, calc(100vw - 36px)); max-height: 74vh; overflow-y: auto;
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

  const contentSection = (isIndex || isGuide || isProject) ? `
    <div class="adm-section">
      <label>Тексты на этой странице</label>
      <div class="adm-row">
        <button class="adm-btn" id="adm-edit">✏️ Редактировать</button>
        <button class="adm-btn primary" id="adm-save-text" disabled>💾 Сохранить</button>
      </div>
      <p class="adm-hint">${isGuide
        ? "Кликай в текст гайда и правь. Сохранение коммитит этот HTML-файл."
        : "Кликай в текст и правь. Правится активный язык (RU/EN). Сохранение коммитит data/projects.js."}</p>
    </div>` : "";

  const managerSection = isIndex ? `
    <div class="adm-section">
      <label>Карточки проектов</label>
      <div class="adm-row">
        <button class="adm-btn" id="adm-manage">📦 Проекты</button>
      </div>
      <p class="adm-hint">Добавить/удалить карточку, поля, баннер, гайд, медиа.</p>
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
    ${managerSection}
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
        "Update site configuration");
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
    if (isIndex) return [...document.querySelectorAll(".card-desc")];
    if (isProject) return [...document.querySelectorAll(".project-about")];
    return [...document.querySelectorAll(".guide-article .only-ru, .guide-article .only-en")];
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
  if (isProject) {
    document.getElementById("project-content").addEventListener("input", (e) => {
      const el = e.target.closest(".project-about");
      if (!el || el.dataset.idx === undefined) return;
      const key = (window.I18N && window.I18N.getLang() === "en") ? "about_en" : "about_ru";
      const parts = [...el.children].map(c => c.textContent.trim()).filter(Boolean);
      window.PROJECTS[+el.dataset.idx][key] = parts.length ? parts.join("\n\n") : el.textContent.trim();
    });
    document.addEventListener("langchange", () => { if (editMode) setEditMode(true); });
  }
  if ($("adm-edit")) {
    $("adm-edit").addEventListener("click", () => setEditMode(!editMode));
    $("adm-save-text").addEventListener("click", async () => {
      status("Сохраняю тексты…");
      try {
        if (isIndex || isProject) {
          await commitProjects();
        } else {
          await saveFile(repoPath(), (src) => {
            const doc = new DOMParser().parseFromString(src, "text/html");
            ["only-ru", "only-en"].forEach(cls => {
              const live = document.querySelector(".guide-article ." + cls);
              const target = doc.querySelector(".guide-article ." + cls);
              if (live && target) target.innerHTML = live.innerHTML;
            });
            return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML + "\n";
          }, "Update page content");
        }
        setEditMode(false);
        status("Тексты сохранены ✓ (Pages обновится ~через минуту)", "ok");
      } catch (e) { status(e.message, "err"); }
    });
  }

  function commitProjects() {
    return saveFile("data/projects.js", () =>
      "// Проекты портфолио. Правится через панель (⚙ → 📦 Проекты) или руками.\n" +
      "// media: пути относительно корня сайта или полные URL; картинки (.png .jpg .webp .gif) и видео (.mp4 .webm)\n" +
      "// banner: картинка-шапка страницы проекта; guide: путь к гайду (\"\" = нет);\n" +
      "// about_ru/about_en: описание для страницы проекта, абзацы разделяются пустой строкой.\n" +
      "window.PROJECTS = " + JSON.stringify(window.PROJECTS, null, 2) + ";\n",
      "Update project data");
  }

  /* ── Менеджер проектов (только на главной) ── */
  if (isIndex && $("adm-manage")) {
    const overlay = document.createElement("div");
    overlay.className = "adm-overlay";
    overlay.hidden = true;
    document.body.appendChild(overlay);

    const mstyle = document.createElement("style");
    mstyle.textContent = `
      .adm-overlay {
        position: fixed; inset: 0; z-index: 300;
        background: rgba(0,0,0,.6); backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center; padding: 20px;
      }
      .adm-overlay[hidden] { display: none; }
      .adm-modal {
        width: 520px; max-width: 100%; max-height: 88vh; overflow-y: auto;
        background: rgba(13,17,23,.95); border: 1px solid var(--glass-border);
        border-radius: 18px; padding: 20px; color: var(--text); font-size: .9rem;
      }
      .adm-modal h4 { margin: 0 0 12px; }
      .adm-field { margin-bottom: 10px; }
      .adm-field label { display: block; color: var(--text-dim); font-size: .78rem; margin-bottom: 4px; }
      .adm-field input, .adm-field textarea, .adm-field select {
        width: 100%; background: rgba(255,255,255,.06); color: var(--text);
        border: 1px solid var(--glass-border); border-radius: 8px; padding: 6px 10px;
        font-size: .85rem; font-family: inherit;
      }
      .adm-field textarea { min-height: 90px; resize: vertical; }
      .adm-media-row { display: flex; gap: 6px; align-items: center; margin-bottom: 6px; }
      .adm-media-row input { flex: 1; }
      .adm-modal .adm-row { margin-top: 14px; flex-wrap: wrap; }
    `;
    document.head.appendChild(mstyle);

    function projectForm(p, idx) {
      const isNew = idx === -1;
      overlay.innerHTML = `<div class="adm-modal">
        <h4>${isNew ? "➕ Новый проект" : "✏️ " + p.name}</h4>
        <div class="adm-field"><label>Выбрать проект</label>
          <select id="pm-select">
            <option value="-1"${isNew ? " selected" : ""}>— новый —</option>
            ${window.PROJECTS.map((x, i) => `<option value="${i}"${i === idx ? " selected" : ""}>${x.name}</option>`).join("")}
          </select></div>
        <div class="adm-field"><label>Название</label><input id="pm-name" value="${p.name || ""}"></div>
        <div class="adm-field"><label>Ссылка на репозиторий</label><input id="pm-repo" value="${p.repo || ""}"></div>
        <div class="adm-field"><label>Язык (бейдж, пусто = нет)</label><input id="pm-lang" value="${p.lang || ""}"></div>
        <div class="adm-field"><label>Теги через запятую</label><input id="pm-tags" value="${(p.tags || []).join(", ")}"></div>
        <div class="adm-field"><label>Баннер (путь или URL, пусто = нет)</label><input id="pm-banner" value="${p.banner || ""}"></div>
        <div class="adm-field"><label>Обложка карточки (пусто = первое медиа/баннер)</label><input id="pm-cover" value="${p.cover || ""}"></div>
        <div class="adm-field"><label>Гайд (например guides/snatchr.html, пусто = нет)</label><input id="pm-guide" value="${p.guide || ""}"></div>
        <div class="adm-field"><label>Короткое описание RU</label><textarea id="pm-desc-ru">${p.desc_ru || ""}</textarea></div>
        <div class="adm-field"><label>Короткое описание EN</label><textarea id="pm-desc-en">${p.desc_en || ""}</textarea></div>
        <div class="adm-field"><label>Полное описание RU (абзацы через пустую строку)</label><textarea id="pm-about-ru">${p.about_ru || ""}</textarea></div>
        <div class="adm-field"><label>Полное описание EN</label><textarea id="pm-about-en">${p.about_en || ""}</textarea></div>
        <div class="adm-field"><label>Медиа (скриншоты/видео)</label><div id="pm-media"></div>
          <div class="adm-row" style="margin-top:6px">
            <button class="adm-btn" id="pm-media-add">➕ URL</button>
            <label class="adm-btn" style="cursor:pointer">⬆ Загрузить файл<input type="file" id="pm-upload" hidden accept="image/*,video/mp4,video/webm"></label>
          </div></div>
        <div class="adm-row">
          <button class="adm-btn primary" id="pm-save">💾 Сохранить в репо</button>
          ${isNew ? "" : '<button class="adm-btn" id="pm-delete">🗑 Удалить проект</button>'}
          <button class="adm-btn" id="pm-close">Закрыть</button>
        </div>
        <div class="adm-status" id="pm-status"></div>
      </div>`;

      const q = (id) => overlay.querySelector("#" + id);
      const pstatus = (msg, cls) => { const el = q("pm-status"); el.textContent = msg; el.className = "adm-status" + (cls ? " " + cls : ""); };
      const media = [...(p.media || [])];

      function renderMedia() {
        const box = q("pm-media");
        box.innerHTML = "";
        media.forEach((src, i) => {
          const row = document.createElement("div");
          row.className = "adm-media-row";
          const inp = document.createElement("input");
          inp.value = src;
          inp.addEventListener("input", () => { media[i] = inp.value.trim(); });
          const del = document.createElement("button");
          del.className = "adm-btn";
          del.textContent = "✕";
          del.addEventListener("click", () => { media.splice(i, 1); renderMedia(); });
          row.append(inp, del);
          box.appendChild(row);
        });
      }
      renderMedia();

      q("pm-select").addEventListener("change", (e) => {
        const i = +e.target.value;
        projectForm(i === -1 ? {} : window.PROJECTS[i], i);
      });
      q("pm-media-add").addEventListener("click", () => { media.push(""); renderMedia(); });

      q("pm-upload").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const slug = (q("pm-name").value.trim() || "misc").toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
        const path = "assets/media/" + slug + "/" + file.name.replace(/[^\w.\-]+/g, "_");
        pstatus("Загружаю " + file.name + "…");
        try {
          const b64 = await new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result.split(",")[1]);
            r.onerror = rej;
            r.readAsDataURL(file);
          });
          let sha;
          try { sha = (await ghGet(path)).sha; } catch (_) { /* новый файл */ }
          const r = await fetch(API + path, {
            method: "PUT",
            headers: headers(),
            body: JSON.stringify({ message: "Add media file", content: b64, sha, branch: BRANCH })
          });
          if (!r.ok) throw new Error("Upload → " + r.status);
          media.push(path);
          renderMedia();
          pstatus("Файл в репо ✓ (" + path + "). Не забудь 💾 Сохранить.", "ok");
        } catch (err) { pstatus(err.message, "err"); }
        e.target.value = "";
      });

      q("pm-save").addEventListener("click", async () => {
        const data = {
          name: q("pm-name").value.trim(),
          repo: q("pm-repo").value.trim(),
          lang: q("pm-lang").value.trim() || null,
          desc_ru: q("pm-desc-ru").value,
          desc_en: q("pm-desc-en").value,
          tags: q("pm-tags").value.split(",").map(s => s.trim()).filter(Boolean),
          banner: q("pm-banner").value.trim(),
          cover: q("pm-cover").value.trim(),
          guide: q("pm-guide").value.trim(),
          about_ru: q("pm-about-ru").value,
          about_en: q("pm-about-en").value,
          media: media.map(s => s.trim()).filter(Boolean)
        };
        if (!data.name) return pstatus("Название пустое", "err");
        if (idx === -1) window.PROJECTS.push(data);
        else window.PROJECTS[idx] = data;
        pstatus("Сохраняю…");
        try {
          await commitProjects();
          document.dispatchEvent(new CustomEvent("langchange", { detail: window.I18N ? window.I18N.getLang() : "ru" }));
          pstatus("Сохранено ✓ (Pages обновится ~через минуту)", "ok");
        } catch (err) { pstatus(err.message, "err"); }
      });

      if (!isNew) q("pm-delete").addEventListener("click", async () => {
        if (!confirm("Удалить карточку «" + p.name + "» с сайта? (файлы медиа в репо останутся)")) return;
        window.PROJECTS.splice(idx, 1);
        pstatus("Удаляю…");
        try {
          await commitProjects();
          document.dispatchEvent(new CustomEvent("langchange", { detail: window.I18N ? window.I18N.getLang() : "ru" }));
          overlay.hidden = true;
        } catch (err) { pstatus(err.message, "err"); }
      });

      q("pm-close").addEventListener("click", () => { overlay.hidden = true; });
    }

    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.hidden = true; });
    $("adm-manage").addEventListener("click", () => {
      overlay.hidden = false;
      projectForm(window.PROJECTS[0] || {}, window.PROJECTS.length ? 0 : -1);
    });
  }
})();
