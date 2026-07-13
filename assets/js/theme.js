// Применяет data/config.js для всех посетителей (до отрисовки, чтобы не мигало).
(function () {
  const c = window.SITE_CONFIG || {};
  if (c.accent && /^#[0-9a-fA-F]{6}$/.test(c.accent)) {
    const n = parseInt(c.accent.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const s = document.documentElement.style;
    s.setProperty("--accent", c.accent);
    s.setProperty("--accent-soft", "rgba(" + r + ", " + g + ", " + b + ", 0.16)");
  }
})();
