// Общий рендер содержимого проекта (страница project.html и модалка на главной) + лайтбокс.
(function () {
  const isVideo = (src) => /\.(mp4|webm)$/i.test(src);

  // Кнопка «Гайд» показывается только если файл гайда реально существует.
  const guideCache = {};
  function guideExists(path) {
    if (!path) return Promise.resolve(false);
    if (!(path in guideCache)) {
      guideCache[path] = fetch(path, { method: "HEAD" }).then(r => r.ok).catch(() => false);
    }
    return guideCache[path];
  }

  function render(root, project, idx) {
    const lang = window.I18N ? window.I18N.getLang() : "ru";
    root.innerHTML = "";

    if (project.banner) {
      const banner = document.createElement("img");
      banner.className = "project-banner";
      banner.src = project.banner;
      banner.alt = project.name;
      root.appendChild(banner);
    }

    const head = document.createElement("div");
    head.className = "project-head";
    const h1 = document.createElement("h1");
    h1.textContent = project.name;
    head.appendChild(h1);
    const badges = document.createElement("div");
    badges.className = "card-tags";
    if (project.lang) {
      const b = document.createElement("span");
      b.className = "card-lang";
      b.textContent = project.lang;
      badges.appendChild(b);
    }
    (project.tags || []).forEach(t => {
      const s = document.createElement("span");
      s.className = "tag";
      s.textContent = t;
      badges.appendChild(s);
    });
    head.appendChild(badges);
    root.appendChild(head);

    const about = document.createElement("div");
    about.className = "project-about";
    about.dataset.idx = idx;
    const text = (lang === "en" ? project.about_en : project.about_ru) || (lang === "en" ? project.desc_en : project.desc_ru) || "";
    text.split(/\n\n+/).forEach(par => {
      if (!par.trim()) return;
      const p = document.createElement("p");
      p.textContent = par.trim();
      about.appendChild(p);
    });
    root.appendChild(about);

    const actions = document.createElement("div");
    actions.className = "card-links project-actions";
    const repoLink = document.createElement("a");
    repoLink.href = project.repo;
    repoLink.target = "_blank";
    repoLink.rel = "noopener";
    repoLink.textContent = (window.I18N ? window.I18N.t("card.repo") : "GitHub") + " ↗";
    actions.appendChild(repoLink);
    if (project.guide) {
      guideExists(project.guide).then(ok => {
        if (!ok) return;
        const guideLink = document.createElement("a");
        guideLink.href = project.guide;
        guideLink.className = "guide-btn";
        guideLink.textContent = "📖 " + (window.I18N ? window.I18N.t("card.guideLink") : "Guide");
        actions.appendChild(guideLink);
      });
    }
    root.appendChild(actions);

    if (project.media && project.media.length) {
      const gTitle = document.createElement("h2");
      gTitle.textContent = window.I18N ? window.I18N.t("project.gallery") : "Gallery";
      root.appendChild(gTitle);
      const gallery = document.createElement("div");
      gallery.className = "project-gallery";
      project.media.forEach((src, i) => {
        const cell = document.createElement("div");
        cell.className = "gallery-cell";
        let el;
        if (isVideo(src)) {
          el = document.createElement("video");
          el.src = src;
          el.muted = true;
          el.loop = true;
          el.playsInline = true;
          cell.addEventListener("mouseenter", () => el.play());
          cell.addEventListener("mouseleave", () => el.pause());
        } else {
          el = document.createElement("img");
          el.src = src;
          el.alt = project.name + " " + (i + 1);
          el.loading = "lazy";
        }
        cell.appendChild(el);
        cell.addEventListener("click", () => openLightbox(project.media, i));
        gallery.appendChild(cell);
      });
      root.appendChild(gallery);
    }
  }

  /* ── Лайтбокс (нужна разметка #lightbox на странице) ── */
  let lbMedia = [], lbIndex = 0, bound = false;

  function lbEl() { return document.getElementById("lightbox"); }

  function showMedia() {
    const lb = lbEl();
    const content = lb.querySelector(".lb-content");
    content.innerHTML = "";
    const src = lbMedia[lbIndex];
    if (isVideo(src)) {
      const v = document.createElement("video");
      v.src = src;
      v.controls = true;
      v.autoplay = true;
      content.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = src;
      content.appendChild(img);
    }
    lb.querySelector(".lb-counter").textContent = (lbIndex + 1) + " / " + lbMedia.length;
    lb.querySelector(".lb-prev").style.display = lbMedia.length > 1 ? "" : "none";
    lb.querySelector(".lb-next").style.display = lbMedia.length > 1 ? "" : "none";
  }

  function openLightbox(media, index) {
    const lb = lbEl();
    if (!lb) return;
    if (!bound) bind(lb);
    lbMedia = media;
    lbIndex = index;
    lb.hidden = false;
    showMedia();
  }

  function closeLightbox() {
    const lb = lbEl();
    lb.hidden = true;
    lb.querySelector(".lb-content").innerHTML = "";
  }

  function bind(lb) {
    bound = true;
    lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
    lb.querySelector(".lb-prev").addEventListener("click", () => { lbIndex = (lbIndex - 1 + lbMedia.length) % lbMedia.length; showMedia(); });
    lb.querySelector(".lb-next").addEventListener("click", () => { lbIndex = (lbIndex + 1) % lbMedia.length; showMedia(); });
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lb.querySelector(".lb-prev").click();
      if (e.key === "ArrowRight") lb.querySelector(".lb-next").click();
    });
  }

  window.ProjectRender = { render, openLightbox, guideExists };
})();
