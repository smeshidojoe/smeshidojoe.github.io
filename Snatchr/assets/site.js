// Snatchr site: language switch, mobile nav.
(function () {
  /* ── language: English by default, ?lang=ru opens in Russian ── */
  const LS = "snatchr-lang";
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
      if (e.target.tagName === "A" && mq.matches) links.hidden = true;
    });
  }

  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  /* ── download button: point straight at the latest .exe ──
     The asset name carries the version, so it is resolved at runtime.
     If GitHub cannot be reached, the button keeps its fallback link
     to the releases page. */
  const dlBtns = document.querySelectorAll("[data-download]");
  if (dlBtns.length) {
    fetch("https://api.github.com/repos/smeshidojoe/Snatchr/releases/latest")
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!d) return;
        const exe = (d.assets || []).find(a => /\.exe$/i.test(a.name));
        if (!exe) return;
        dlBtns.forEach(a => {
          a.href = exe.browser_download_url;
          a.removeAttribute("target");
        });
        const mb = (exe.size / 1048576).toFixed(0);
        document.querySelectorAll("[data-release-info]").forEach(el => {
          el.textContent = (d.tag_name || "") + " · " + mb + " MB";
          el.hidden = false;
        });
      })
      .catch(() => { /* offline or rate-limited: keep the fallback link */ });
  }
})();
