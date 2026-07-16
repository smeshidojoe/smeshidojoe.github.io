// Переключатель RU/EN. Тексты интерфейса — тут; тексты проектов — в data/projects.js (desc_ru/desc_en);
// длинные тексты гайдов — блоками <div class="only-ru"> / <div class="only-en"> прямо в HTML.
(function () {
  const DICT = {
    ru: {
      "nav.projects": "Проекты",
      "nav.guides": "Гайды",
      "hero.title": "Привет, я делаю инструменты и ботов",
      "hero.sub": "Python-библиотеки, Telegram-боты и утилиты для работы с медиа. Всё с открытым кодом.",
      "guides.title": "Гайды",
      "guides.sub": "Инструкции по установке и использованию моих программ.",
      "card.repo": "Код на GitHub",
      "card.media": "Скриншоты",
      "card.guideLink": "Гайд",
      "card.siteLink": "Сайт",
      "project.gallery": "Скриншоты и видео",
      "back.projects": "← Все проекты",
      "back": "← Назад к гайдам"
    },
    en: {
      "nav.projects": "Projects",
      "nav.guides": "Guides",
      "hero.title": "Hi, I build tools and bots",
      "hero.sub": "Python libraries, Telegram bots and media utilities. All open source.",
      "guides.title": "Guides",
      "guides.sub": "Installation and usage instructions for my programs.",
      "card.repo": "Code on GitHub",
      "card.media": "Screenshots",
      "card.guideLink": "Guide",
      "card.siteLink": "Website",
      "project.gallery": "Screenshots & video",
      "back.projects": "← All projects",
      "back": "← Back to guides"
    }
  };

  function getLang() {
    return localStorage.getItem("site-lang") || "ru";
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (DICT[lang][key]) el.textContent = DICT[lang][key];
    });
    const btn = document.getElementById("lang-toggle");
    if (btn) btn.textContent = lang === "ru" ? "EN" : "RU";
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  window.I18N = { getLang, applyLang, t: (key) => (DICT[getLang()][key] || key) };

  document.addEventListener("DOMContentLoaded", () => {
    applyLang(getLang());
    const btn = document.getElementById("lang-toggle");
    if (btn) btn.addEventListener("click", () => {
      const next = getLang() === "ru" ? "en" : "ru";
      localStorage.setItem("site-lang", next);
      applyLang(next);
    });
  });
})();
