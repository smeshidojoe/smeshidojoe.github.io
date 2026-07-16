// Рендер карточек проектов. Клик по карточке раскрывает её в модаль
// прямо на главной (FLIP-анимация), фон затемняется и размывается.
(function () {
  const grid = document.getElementById("projects-grid");
  if (!grid || !window.PROJECTS) return;

  const isVideo = (src) => /\.(mp4|webm)$/i.test(src);

  /* ── Модаль-раскрытие карточки ── */
  let modal = null; // { backdrop, panel, card, idx }

  function targetRect() {
    const w = Math.min(860, window.innerWidth * 0.94);
    const h = Math.min(window.innerHeight * 0.88, 900);
    return {
      top: (window.innerHeight - h) / 2,
      left: (window.innerWidth - w) / 2,
      width: w,
      height: h
    };
  }

  function setRect(el, r) {
    el.style.top = r.top + "px";
    el.style.left = r.left + "px";
    el.style.width = r.width + "px";
    el.style.height = r.height + "px";
  }

  function openProject(idx, card, instant) {
    if (modal) return;
    const p = window.PROJECTS[idx];

    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    const panel = document.createElement("div");
    panel.className = "modal-panel";

    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "✕";
    const content = document.createElement("div");
    content.className = "modal-content";
    window.ProjectRender.render(content, p, idx);
    panel.append(closeBtn, content);

    // смена языка при открытой модалке перерисовывает её содержимое
    const rerenderModal = () => {
      window.ProjectRender.render(content, p, idx);
      document.dispatchEvent(new CustomEvent("projectmodal"));
    };
    document.addEventListener("langchange", rerenderModal);

    const from = card ? card.getBoundingClientRect() : null;
    setRect(panel, from && !instant ? from : targetRect());

    document.body.append(backdrop, panel);
    document.body.style.overflow = "hidden";
    modal = { backdrop, panel, card, idx, rerenderModal };
    document.dispatchEvent(new CustomEvent("projectmodal"));

    void panel.offsetWidth; // зафиксировать стартовую геометрию до transition
    backdrop.classList.add("show");
    setRect(panel, targetRect());
    setTimeout(() => panel.classList.add("ready"), instant ? 0 : 420);

    backdrop.addEventListener("click", () => history.back());
    closeBtn.addEventListener("click", () => history.back());

    if (!instant || !location.hash.startsWith("#p=")) {
      history.pushState({ project: p.name }, "", "#p=" + encodeURIComponent(p.name));
    }
  }

  function closeProject() {
    if (!modal) return;
    const { backdrop, panel, card, rerenderModal } = modal;
    if (rerenderModal) document.removeEventListener("langchange", rerenderModal);
    modal = null;
    panel.classList.remove("ready");
    backdrop.classList.remove("show");
    // обратная анимация к текущему положению карточки
    const to = card && card.isConnected ? card.getBoundingClientRect() : null;
    if (to) setRect(panel, to);
    else panel.style.opacity = "0";
    setTimeout(() => {
      backdrop.remove();
      panel.remove();
      document.body.style.overflow = "";
    }, 620);
  }

  // при изменении окна модаль перецентровывается
  window.addEventListener("resize", () => {
    if (modal) setRect(modal.panel, targetRect());
  });

  window.addEventListener("popstate", () => {
    if (modal) closeProject();
    else if (location.hash.startsWith("#p=")) tryOpenFromHash(true);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && document.getElementById("lightbox")?.hidden !== false) history.back();
  });

  function tryOpenFromHash(instant) {
    if (!location.hash.startsWith("#p=")) return;
    const name = decodeURIComponent(location.hash.slice(3));
    const idx = window.PROJECTS.findIndex(p => p.name === name);
    if (idx === -1) return;
    const card = grid.children[idx];
    openProject(idx, card || null, instant);
  }

  function render() {
    const lang = window.I18N ? window.I18N.getLang() : "ru";
    grid.innerHTML = "";
    window.PROJECTS.forEach((p, idx) => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.title = p.name;
      card.dataset.idx = idx;
      card.style.animationDelay = (idx * 0.06) + "s";

      // media preview
      const mediaDiv = document.createElement("div");
      mediaDiv.className = "card-media";
      const cover = p.cover || (p.media && p.media[0]) || p.banner;
      if (cover) {
        if (isVideo(cover)) {
          const v = document.createElement("video");
          v.src = cover;
          v.muted = true;
          v.loop = true;
          v.playsInline = true;
          v.addEventListener("mouseenter", () => v.play());
          v.addEventListener("mouseleave", () => v.pause());
          mediaDiv.appendChild(v);
        } else {
          const img = document.createElement("img");
          img.src = cover;
          img.alt = p.name;
          img.loading = "lazy";
          mediaDiv.appendChild(img);
        }
        if (p.media && p.media.length > 1) {
          const count = document.createElement("span");
          count.className = "media-count";
          count.textContent = "🖼 " + p.media.length;
          mediaDiv.appendChild(count);
        }
      } else {
        const ph = document.createElement("span");
        ph.className = "placeholder";
        ph.textContent = "📦";
        mediaDiv.appendChild(ph);
      }
      card.appendChild(mediaDiv);

      // body
      const body = document.createElement("div");
      body.className = "card-body";

      const titleRow = document.createElement("div");
      titleRow.className = "card-title";
      const h3 = document.createElement("h3");
      h3.textContent = p.name;
      titleRow.appendChild(h3);
      if (p.lang) {
        const langBadge = document.createElement("span");
        langBadge.className = "card-lang";
        langBadge.textContent = p.lang;
        titleRow.appendChild(langBadge);
      }
      body.appendChild(titleRow);

      const desc = document.createElement("p");
      desc.className = "card-desc";
      desc.dataset.idx = idx;
      desc.textContent = lang === "en" ? p.desc_en : p.desc_ru;
      body.appendChild(desc);

      if (p.tags && p.tags.length) {
        const tagsDiv = document.createElement("div");
        tagsDiv.className = "card-tags";
        p.tags.forEach(t => {
          const s = document.createElement("span");
          s.className = "tag";
          s.textContent = t;
          tagsDiv.appendChild(s);
        });
        body.appendChild(tagsDiv);
      }

      const links = document.createElement("div");
      links.className = "card-links";
      const repoLink = document.createElement("a");
      repoLink.href = p.repo;
      repoLink.target = "_blank";
      repoLink.rel = "noopener";
      repoLink.textContent = (window.I18N ? window.I18N.t("card.repo") : "GitHub") + " ↗";
      links.appendChild(repoLink);
      if (p.guide && window.ProjectRender) {
        window.ProjectRender.guideExists(p.guide).then(ok => {
          if (!ok) return;
          const guideLink = document.createElement("a");
          guideLink.href = p.guide;
          guideLink.className = "guide-btn";
          guideLink.textContent = "📖 " + (window.I18N ? window.I18N.t("card.guideLink") : "Guide");
          links.appendChild(guideLink);
        });
      }
      if (p.site) {
        const siteLink = document.createElement("a");
        siteLink.href = p.site;
        siteLink.target = "_blank";
        siteLink.rel = "noopener";
        siteLink.className = "site-btn";
        siteLink.textContent = "🌐 " + (window.I18N ? window.I18N.t("card.siteLink") : "Website");
        links.appendChild(siteLink);
      }
      body.appendChild(links);
      card.appendChild(body);

      // клик по карточке (кроме ссылок и правки текста) → раскрытие в модаль
      card.addEventListener("click", (e) => {
        if (card.draggable) return; // режим перетаскивания
        if (e.target.closest("a")) return;
        if (e.target.closest(".card-desc") && e.target.closest(".card-desc").isContentEditable) return;
        openProject(idx, card, false);
      });

      grid.appendChild(card);
    });
  }

  document.addEventListener("langchange", render);
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  render();
  tryOpenFromHash(true);
})();
