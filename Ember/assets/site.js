// Ember site: mobile nav, copy buttons, quickstart tabs, docs scrollspy.
(function () {
  /* ── mobile nav ── */
  const burger = document.querySelector(".burger");
  const links = document.getElementById("nav-links");
  if (burger && links) {
    const mq = window.matchMedia("(max-width: 860px)");
    const sync = () => { links.hidden = mq.matches; };
    sync();
    mq.addEventListener("change", sync);
    burger.addEventListener("click", () => { links.hidden = !links.hidden; });
    links.addEventListener("click", (e) => {
      if (e.target.tagName === "A" && mq.matches) links.hidden = true;
    });
  }

  /* ── copy code ── */
  document.querySelectorAll(".copy").forEach(btn => {
    btn.addEventListener("click", async () => {
      const pre = btn.closest(".code").querySelector("pre");
      try {
        await navigator.clipboard.writeText(pre.innerText.trim());
        const old = btn.textContent;
        btn.textContent = "copied";
        btn.classList.add("done");
        setTimeout(() => { btn.textContent = old; btn.classList.remove("done"); }, 1600);
      } catch (_) { /* clipboard denied */ }
    });
  });

  /* ── quickstart tabs ── */
  document.querySelectorAll("[data-tabs]").forEach(group => {
    const tabs = group.querySelectorAll(".tab");
    const panels = group.querySelectorAll(".tab-panel");
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        panels.forEach(p => p.hidden = true);
        tab.classList.add("active");
        panels[i].hidden = false;
      });
    });
  });

  /* ── docs scrollspy ── */
  const side = document.querySelector(".side");
  if (side) {
    const map = new Map();
    side.querySelectorAll("a[href^='#']").forEach(a => {
      const el = document.getElementById(a.getAttribute("href").slice(1));
      if (el) map.set(el, a);
    });
    if (map.size) {
      let current = null;
      // подсветка сразу по клику — не ждём observer
      side.addEventListener("click", (e) => {
        const a = e.target.closest("a[href^='#']");
        if (!a) return;
        if (current) current.classList.remove("active");
        current = a;
        a.classList.add("active");
      });
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          if (current) current.classList.remove("active");
          current = map.get(en.target);
          if (current) {
            current.classList.add("active");
            const r = current.getBoundingClientRect(), s = side.getBoundingClientRect();
            if (r.top < s.top || r.bottom > s.bottom) current.scrollIntoView({ block: "nearest" });
          }
        });
      }, { rootMargin: "-80px 0px -70% 0px", threshold: 0 });
      map.forEach((_, el) => io.observe(el));
    }
  }
})();
