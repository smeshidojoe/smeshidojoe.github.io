// Рендер карточек проектов. Клик по карточке открывает страницу проекта
// (в Chrome — с морф-анимацией через cross-document view transition).
(function () {
  const grid = document.getElementById("projects-grid");
  if (!grid || !window.PROJECTS) return;

  const isVideo = (src) => /\.(mp4|webm)$/i.test(src);

  function render() {
    const lang = window.I18N ? window.I18N.getLang() : "ru";
    grid.innerHTML = "";
    window.PROJECTS.forEach((p, idx) => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.title = p.name;

      // media preview
      const mediaDiv = document.createElement("div");
      mediaDiv.className = "card-media";
      const cover = (p.media && p.media[0]) || p.banner;
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
      if (p.guide) {
        const guideLink = document.createElement("a");
        guideLink.href = p.guide;
        guideLink.className = "guide-btn";
        guideLink.textContent = "📖 " + (window.I18N ? window.I18N.t("card.guideLink") : "Guide");
        links.appendChild(guideLink);
      }
      body.appendChild(links);
      card.appendChild(body);

      // клик по карточке (кроме ссылок и правки текста) → страница проекта
      card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        if (e.target.closest(".card-desc") && e.target.closest(".card-desc").isContentEditable) return;
        card.style.viewTransitionName = "project-hero";
        location.href = "project.html?p=" + encodeURIComponent(p.name);
      });

      grid.appendChild(card);
    });
  }

  document.addEventListener("langchange", render);
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  render();
})();
