// Проекты портфолио. Правится через панель (⚙ → 📦 Проекты) или руками.
// media: пути относительно корня сайта или полные URL; картинки (.png .jpg .webp .gif) и видео (.mp4 .webm)
// banner: картинка-шапка страницы проекта; guide: путь к гайду ("" = нет);
// about_ru/about_en: описание для страницы проекта, абзацы разделяются пустой строкой.
window.PROJECTS = [
  {
    "name": "Snatchr",
    "repo": "https://github.com/smeshidojoe/Snatchr",
    "lang": "Python",
    "desc_ru": "Просто скачай что угодно. Загрузчик видео и аудио для Windows: живёт в трее, качает с 1000+ сайтов.",
    "desc_en": "Just Download Anything. Video & audio downloader for Windows: lives in the tray, grabs from 1,000+ sites.",
    "tags": [
      "Windows",
      "tray",
      "downloader"
    ],
    "banner": "https://github.com/user-attachments/assets/b135759d-c19c-4347-94dc-73a7d54f593b",
    "cover": "https://github.com/user-attachments/assets/40a747fe-5d3c-4da7-96ce-7239072220e2",
    "guide": "guides/snatchr.html",
    "about_ru": "Snatchr — быстрый и лёгкий загрузчик видео и аудио для Windows, который живёт в системном трее. Качает медиа с 1000+ сайтов — YouTube, Instagram, TikTok, Twitch, Vimeo, Reddit, VK, RuTube и всё остальное — без браузера, рекламы и командной строки.\n\nГлавная фишка — Spotlight-лаунчер по Ctrl+E: вставил ссылку — и она уже качается в фоне в лучшем качестве. Несколько загрузок параллельно, общая история со всеми файлами, обрезка прямо на месте с покадровым слайдером и копирование готового файла в один клик — сразу в чат или проводник.\n\nУмеет следить за буфером обмена: скопировал ссылку — выскочил тост с предложением скачать. Есть выбор качества и формата (вплоть до «только звук» в MP3), пакетная загрузка и плейлисты, скачивание фрагмента по таймкодам, перегон в чистый MP4 для монтажа и несколько тем оформления, включая стеклянные.\n\nНикакой настройки: программа сама скачивает и обновляет всё, что ей нужно для работы.",
    "about_en": "Snatchr is a fast, lightweight video & audio downloader for Windows that lives in your system tray. It grabs media from 1,000+ sites — YouTube, Instagram, TikTok, Twitch, Vimeo, Reddit, VK, RuTube and everything else — without a browser, ads, or the command line.\n\nThe centerpiece is a Spotlight-style launcher on Ctrl+E: paste a link and it's already downloading in the background at best quality. Several parallel downloads, a unified history of everything you've grabbed, on-the-spot trimming with a frame-by-frame slider, and one-click copy of any finished file — straight into a chat or Explorer.\n\nIt can watch your clipboard too: copy a link and a toast pops up offering to grab it. There's quality and format selection (down to audio-only MP3), batch downloads and playlists, downloading just a section by timecode, editor-friendly MP4 conversion, and several themes including glass ones.\n\nZero setup: the app downloads and updates everything it needs by itself.",
    "media": []
  },
  {
    "name": "Ember",
    "repo": "https://github.com/smeshidojoe/Ember",
    "lang": "Python",
    "desc_ru": "Python-библиотека и CLI для извлечения и скачивания медиа из соцсетей.",
    "desc_en": "A Python library and CLI for extracting and downloading media from social platforms.",
    "tags": [
      "library",
      "CLI",
      "media"
    ],
    "banner": "",
    "cover": "assets/media/ember/Ember_Site_Card.png",
    "guide": "guides/ember.html",
    "about_ru": "Ember — встраиваемая Python-библиотека и консольная утилита для извлечения и скачивания медиа из соцсетей, компактная альтернатива cobalt. Даёшь ссылку на пост — получаешь прямые ссылки на медиа с метаданными, а скачать Ember может и сам, включая HLS-потоки, без yt-dlp.\n\nПоддерживает 15 сервисов: TikTok, Twitter/X, Instagram, Reddit, Vimeo, SoundCloud, Pinterest, Tumblr, Bluesky, Newgrounds, Rutube, OK.ru, VK, Facebook и клипы Twitch.\n\nЕдинственная обязательная зависимость — requests. Работает и как Python API (import ember), и как команда ember в терминале. Умеет подхватывать cookies из браузера для приватного контента.",
    "about_en": "Ember is an embeddable Python library and CLI for extracting and downloading media from social platforms — a compact alternative to cobalt. Give it a post URL and it returns direct media URLs with metadata, and it can download by itself too, including HLS streams, without yt-dlp.\n\nSupports 15 services: TikTok, Twitter/X, Instagram, Reddit, Vimeo, SoundCloud, Pinterest, Tumblr, Bluesky, Newgrounds, Rutube, OK.ru, VK, Facebook and Twitch clips.\n\nThe only required dependency is requests. Works both as a Python API (import ember) and as the ember terminal command. Can pick up browser cookies for private content.",
    "media": []
  },
  {
    "name": "EmberBot",
    "repo": "https://github.com/smeshidojoe/EmberBot",
    "lang": "Python",
    "desc_ru": "Telegram-бот для скачивания медиа на базе библиотеки Ember.",
    "desc_en": "Telegram media downloader bot based on the Ember library.",
    "tags": [
      "Telegram",
      "bot"
    ],
    "cover": "",
    "banner": "",
    "guide": "",
    "about_ru": "EmberBot — Telegram-бот для скачивания медиа, построенный на библиотеке Ember. Кидаешь боту ссылку на пост из соцсети — получаешь медиа прямо в чат.\n\nПоддерживает те же 15 сервисов, что и Ember: TikTok, Twitter/X, Instagram, Reddit, VK, SoundCloud и другие.",
    "about_en": "EmberBot is a Telegram media downloader bot built on the Ember library. Send it a social media post link — get the media right in the chat.\n\nSupports the same 15 services as Ember: TikTok, Twitter/X, Instagram, Reddit, VK, SoundCloud and more.",
    "media": []
  },
  {
    "name": "CopyPasta",
    "repo": "https://github.com/smeshidojoe/CopyPasta",
    "lang": null,
    "desc_ru": "Быстрая обрезка и склейка видео без перекодирования и потери качества.",
    "desc_en": "Fast, lossless video trimming and merging. No re-encoding, no quality loss.",
    "tags": [
      "video",
      "tool"
    ],
    "cover": "",
    "banner": "",
    "guide": "",
    "about_ru": "CopyPasta — инструмент для быстрой обрезки и склейки видео без перекодирования. Файл не пережимается, поэтому операции занимают секунды, а качество остаётся исходным до последнего бита.",
    "about_en": "CopyPasta is a tool for fast video trimming and merging without re-encoding. The file is never recompressed, so operations take seconds and quality stays bit-perfect.",
    "media": []
  },
  {
    "name": "Gremlin",
    "repo": "https://github.com/smeshidojoe/Gremlin",
    "lang": null,
    "desc_ru": "Telegram-бот для модерации чатов.",
    "desc_en": "Telegram moderation bot.",
    "tags": [
      "Telegram",
      "bot"
    ],
    "cover": "",
    "banner": "",
    "guide": "",
    "about_ru": "Gremlin — Telegram-бот для модерации чатов: следит за порядком, чтобы админам не приходилось.",
    "about_en": "Gremlin is a Telegram moderation bot: it keeps chats in order so admins don't have to.",
    "media": []
  },
  {
    "name": "NovaBot",
    "repo": "https://github.com/smeshidojoe/NovaBot",
    "lang": "Python",
    "desc_ru": "Telegram-конструктор QR-кодов с живым превью, пакетным режимом и чтением QR.",
    "desc_en": "Telegram QR constructor with live preview, batch mode and QR reading.",
    "tags": [
      "Telegram",
      "bot",
      "QR"
    ],
    "banner": "",
    "cover": "assets/media/novabot/Nova_Site_Card.png",
    "guide": "",
    "about_ru": "NovaBot — Telegram-бот-конструктор QR-кодов на aiogram 3. Отправь ссылку — получи QR-код картинкой. Для одиночной ссылки бот предлагает стандартный QR или конструктор с живым превью прямо в сообщении: цвет (пресеты или свой #RRGGBB), фон, размер до 3000×3000, уровень коррекции ошибок.\n\nУмеет пакетный режим (до 10 ссылок одним сообщением), инлайн-режим @botname в любом чате, чтение QR с присланной картинки и личные настройки по умолчанию через /settings.",
    "about_en": "NovaBot is a Telegram QR-code constructor bot built on aiogram 3. Send a link — get a QR code back as an image. For a single link it offers a standard QR or a constructor with live preview right in the message: color (presets or custom #RRGGBB), background, size up to 3000×3000, error correction level.\n\nIt also does batch mode (up to 10 links per message), inline mode @botname in any chat, reverse QR reading from an image, and per-user defaults via /settings.",
    "media": []
  },
  {
    "name": "VideoToCircle",
    "repo": "https://github.com/smeshidojoe/VideoToCircle-TelegramBot",
    "lang": "Python",
    "desc_ru": "Telegram-бот, который превращает видео в кружочки.",
    "desc_en": "A Telegram bot which converts videos to circles.",
    "tags": [
      "Telegram",
      "bot",
      "video"
    ],
    "cover": "",
    "banner": "",
    "guide": "",
    "about_ru": "Бот, который превращает обычные видео в телеграмовские кружочки (video notes). Кидаешь видео — бот сам его обрезает, масштабирует и возвращает готовый кружок.\n\nБыстрая обработка с оптимизированными настройками, ничего настраивать не нужно.",
    "about_en": "A bot that converts regular videos into Telegram round video messages (video notes). Send a video — the bot crops, resizes and returns a ready circle automatically.\n\nFast processing with optimized settings, nothing to configure.",
    "media": []
  }
];
