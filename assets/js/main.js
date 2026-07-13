// Рендер карточек проектов + лайтбокс для скриншотов/видео.
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

      // media preview
      const mediaDiv = document.createElement("div");
      mediaDiv.className = "card-media";
      if (p.media && p.media.length) {
        const first = p.media[0];
        if (isVideo(first)) {
          const v = document.createElement("video");
          v.src = first;
          v.muted = true;
          v.loop = true;
          v.playsInline = true;
          v.addEventListener("mouseenter", () => v.play());
          v.addEventListener("mouseleave", () => v.pause());
          mediaDiv.appendChild(v);
        } else {
          const img = document.createElement("img");
          img.src = first;
          img.alt = p.name;
          img.loading = "lazy";
          mediaDiv.appendChild(img);
        }
        if (p.media.length > 1) {
          const count = document.createElement("span");
          count.className = "media-count";
          count.textContent = "🖼 " + p.media.length;
          mediaDiv.appendChild(count);
        }
        mediaDiv.addEventListener("click", () => openLightbox(p.media, 0));
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
      body.appendChild(links);

      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  // Lightbox
  const lb = document.getElementById("lightbox");
  const lbContent = lb.querySelector(".lb-content");
  const lbCounter = lb.querySelector(".lb-counter");
  let lbMedia = [];
  let lbIndex = 0;

  function showMedia() {
    lbContent.innerHTML = "";
    const src = lbMedia[lbIndex];
    if (isVideo(src)) {
      const v = document.createElement("video");
      v.src = src;
      v.controls = true;
      v.autoplay = true;
      lbContent.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = src;
      lbContent.appendChild(img);
    }
    lbCounter.textContent = (lbIndex + 1) + " / " + lbMedia.length;
    lb.querySelector(".lb-prev").style.display = lbMedia.length > 1 ? "" : "none";
    lb.querySelector(".lb-next").style.display = lbMedia.length > 1 ? "" : "none";
  }

  function openLightbox(media, index) {
    lbMedia = media;
    lbIndex = index;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    showMedia();
  }

  function closeLightbox() {
    lb.hidden = true;
    lbContent.innerHTML = "";
    document.body.style.overflow = "";
  }

  lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lb.querySelector(".lb-prev").addEventListener("click", () => {
    lbIndex = (lbIndex - 1 + lbMedia.length) % lbMedia.length;
    showMedia();
  });
  lb.querySelector(".lb-next").addEventListener("click", () => {
    lbIndex = (lbIndex + 1) % lbMedia.length;
    showMedia();
  });
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lb.querySelector(".lb-prev").click();
    if (e.key === "ArrowRight") lb.querySelector(".lb-next").click();
  });

  document.addEventListener("langchange", render);
  document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());
  render();
})();
