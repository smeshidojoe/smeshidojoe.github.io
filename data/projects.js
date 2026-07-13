// Проекты портфолио. Добавляй медиа в assets/media/<имя-проекта>/
// media: массив путей относительно корня сайта. Поддерживаются картинки (.png .jpg .webp .gif) и видео (.mp4 .webm)
window.PROJECTS = [
  {
    name: "Snatchr",
    repo: "https://github.com/smeshidojoe/Snatchr",
    lang: "Python",
    desc_ru: "Просто скачай что угодно. Загрузчик видео и аудио для Windows: живёт в трее, качает с 1000+ сайтов.",
    desc_en: "Just Download Anything. Video & audio downloader for Windows: lives in the tray, grabs from 1,000+ sites.",
    tags: ["Windows", "tray", "downloader"],
    media: []
  },
  {
    name: "Ember",
    repo: "https://github.com/smeshidojoe/Ember",
    lang: "Python",
    desc_ru: "Python-библиотека и CLI для извлечения и скачивания медиа из соцсетей.",
    desc_en: "A Python library and CLI for extracting and downloading media from social platforms.",
    tags: ["library", "CLI", "media"],
    media: []
  },
  {
    name: "EmberBot",
    repo: "https://github.com/smeshidojoe/EmberBot",
    lang: "Python",
    desc_ru: "Telegram-бот для скачивания медиа на базе библиотеки Ember.",
    desc_en: "Telegram media downloader bot based on the Ember library.",
    tags: ["Telegram", "bot"],
    media: []
  },
  {
    name: "CopyPasta",
    repo: "https://github.com/smeshidojoe/CopyPasta",
    lang: null,
    desc_ru: "Быстрая обрезка и склейка видео без перекодирования и потери качества.",
    desc_en: "Fast, lossless video trimming and merging. No re-encoding, no quality loss.",
    tags: ["video", "tool"],
    media: []
  },
  {
    name: "Gremlin",
    repo: "https://github.com/smeshidojoe/Gremlin",
    lang: null,
    desc_ru: "Telegram-бот для модерации чатов.",
    desc_en: "Telegram moderation bot.",
    tags: ["Telegram", "bot"],
    media: []
  },
  {
    name: "NovaBot",
    repo: "https://github.com/smeshidojoe/NovaBot",
    lang: "Python",
    desc_ru: "Простой Telegram-бот для генерации QR-кодов.",
    desc_en: "Simple Telegram bot which generates QR codes.",
    tags: ["Telegram", "bot"],
    media: []
  },
  {
    name: "VideoToCircle",
    repo: "https://github.com/smeshidojoe/VideoToCircle-TelegramBot",
    lang: "Python",
    desc_ru: "Telegram-бот, который превращает видео в кружочки.",
    desc_en: "A Telegram bot which converts videos to circles.",
    tags: ["Telegram", "bot", "video"],
    media: []
  }
];
