// Dictify site: language switch, mobile nav, live download links for both platforms.
(function () {
  /* ── language: English by default, ?lang=ru opens in Russian ── */
  const LS = "dictify-lang";
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
  }
  applyLang(getLang());
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".lang-btn");
    if (!b) return;
    const next = getLang() === "en" ? "ru" : "en";
    localStorage.setItem(LS, next);
    applyLang(next);
  });

  /* ── mobile nav ── */
  const burger = document.querySelector(".burger");
  const links = document.getElementById("nav-links");
  if (burger && links) {
    const mq = window.matchMedia("(max-width: 900px)");
    const sync = () => { links.hidden = mq.matches; };
    sync();
    mq.addEventListener("change", sync);
    burger.addEventListener("click", () => { links.hidden = !links.hidden; });
    links.addEventListener("click", (e) => {
      if (e.target.closest("a") && mq.matches) links.hidden = true;
    });
  }

  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  /* ── downloads: two builds, so each button looks for its own asset.
       data-download holds a pattern; without a connection the buttons keep
       their releases-page fallback. ── */
  const dlBtns = document.querySelectorAll("[data-download]");
  if (!dlBtns.length) return;

  fetch("https://api.github.com/repos/smeshidojoe/Dictify/releases/latest")
    .then(r => (r.ok ? r.json() : null))
    .then(d => {
      if (!d) return;
      const assets = d.assets || [];
      dlBtns.forEach(a => {
        const rx = new RegExp(a.dataset.download, "i");
        const found = assets.find(x => rx.test(x.name));
        if (!found) return;
        a.href = found.browser_download_url;
        a.removeAttribute("target");
        const size = a.querySelector("[data-size]");
        if (size) size.textContent = (found.size / 1048576).toFixed(0) + " MB";
      });
      document.querySelectorAll("[data-release-info]").forEach(el => {
        el.textContent = d.tag_name || "";
        el.hidden = !d.tag_name;
      });
    })
    .catch(() => { /* offline or rate-limited */ });
})();
