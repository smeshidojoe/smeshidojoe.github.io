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
    "cover": "assets/media/snatchr/Snatchr_Site_Card.png",
    "guide": "/Snatchr/guide/",
    "site": "/Snatchr/",
    "about_ru": "Snatchr — быстрый и лёгкий загрузчик видео и аудио для Windows, который живёт в системном трее. Качает медиа с 1000+ сайтов — YouTube, Instagram, TikTok, Twitch, Vimeo, Reddit, VK, RuTube и всё остальное — без браузера, рекламы и командной строки.\n\nГлавная фишка — Spotlight-лаунчер по Ctrl+E: вставил ссылку — и она уже качается в фоне в лучшем качестве. Несколько загрузок параллельно, общая история со всеми файлами, обрезка прямо на месте с покадровым слайдером и копирование готового файла в один клик — сразу в чат или проводник.\n\nУмеет следить за буфером обмена: скопировал ссылку — выскочил тост с предложением скачать. Есть выбор качества и формата (вплоть до «только звук» в MP3), пакетная загрузка и плейлисты, скачивание фрагмента по таймкодам, перегон в чистый MP4 для монтажа и несколько тем оформления, включая стеклянные.\n\nНикакой настройки: программа сама скачивает и обновляет всё, что ей нужно для работы.",
    "about_en": "Snatchr is a fast, lightweight video & audio downloader for Windows that lives in your system tray. It grabs media from 1,000+ sites — YouTube, Instagram, TikTok, Twitch, Vimeo, Reddit, VK, RuTube and everything else — without a browser, ads, or the command line.\n\nThe centerpiece is a Spotlight-style launcher on Ctrl+E: paste a link and it's already downloading in the background at best quality. Several parallel downloads, a unified history of everything you've grabbed, on-the-spot trimming with a frame-by-frame slider, and one-click copy of any finished file — straight into a chat or Explorer.\n\nIt can watch your clipboard too: copy a link and a toast pops up offering to grab it. There's quality and format selection (down to audio-only MP3), batch downloads and playlists, downloading just a section by timecode, editor-friendly MP4 conversion, and several themes including glass ones.\n\nZero setup: the app downloads and updates everything it needs by itself.",
    "media": []
  },
  {
    "name": "Knack",
    "repo": "https://github.com/smeshidojoe/Knack",
    "lang": "Python",
    "desc_ru": "Панель у края экрана: музыка, полка, буфер, заготовки, заметки, дела и переводчик.",
    "desc_en": "A panel at the edge of the screen: music, shelf, clipboard, snippets, notes, todo and a translator.",
    "tags": [
      "Windows",
      "tray",
      "organizer",
      "media"
    ],
    "banner": "",
    "cover": "assets/media/knack/cover.png",
    "guide": "/Knack/guide/",
    "site": "/Knack/",
    "about_ru": "Knack — выезжающая панель для Windows. Подводишь курсор к свободному краю экрана, и оттуда выезжает полоса: музыка, полка со скриншотами, история буфера обмена, заготовки, заметки, список дел и переводчик. Отвёл курсор — уехала обратно.\n\nПанель появляется с края, противоположного панели задач, на том мониторе, где сейчас курсор, и никогда не забирает фокус у окна, в котором ты печатаешь. Пока она закрыта, не работает ни один таймер.\n\nМузыка берётся из самой Windows, поэтому работает со всем, что играет: браузеры, Spotify, плееры. На полку скриншоты попадают сами, файлы можно бросить мышкой и вытащить обратно в чат. Переводчик работает офлайн на встроенных моделях или через DeepL по ключу.\n\nКроме панели есть два глобальных сочетания: исправить раскладку в выделенном тексте и закрепить активное окно поверх остальных.",
    "about_en": "Knack is a sliding panel for Windows. Move the pointer to a free screen edge and a strip slides out: music, a shelf of screenshots, clipboard history, snippets, notes, a todo list and a translator. Move away and it slides back.\n\nThe panel appears on the edge opposite the taskbar, on the monitor your pointer is on, and never takes focus from the window you are typing in. While it is closed, not a single timer is running.\n\nMusic comes from Windows itself, so it works with anything that plays sound: browsers, Spotify, media players. Screenshots land on the shelf by themselves, files can be dropped in with the mouse and dragged back out into a chat. The translator runs offline on bundled models, or through DeepL with a key.\n\nBeyond the panel there are two global shortcuts: fix the keyboard layout of selected text, and keep the active window above all others.",
    "media": []
  },
  {
    "name": "Shotly",
    "repo": "https://github.com/smeshidojoe/Shotly",
    "lang": "Python",
    "desc_ru": "Скриншоты как в Lightshot - выделить область, порисовать поверх, скопировать или сохранить. Без выгрузки на сервер: всё остаётся на вашем компьютере.",
    "desc_en": "Screenshots like in Lightshot - highlight the area, draw over, copy or save. No upload to the server: everything stays on your computer.",
    "tags": [
      "Windows",
      "tray",
      "screenshot"
    ],
    "banner": "",
    "cover": "assets/media/shotly/cover.png",
    "guide": "/Shotly/guide/",
    "site": "/Shotly/",
    "about_ru": "Shotly — скриншотилка для Windows в духе Lightshot: выделить область, порисовать поверх, скопировать или сохранить. Ничего не выгружается на сервер, каждый снимок остаётся на твоём компьютере.\n\nОверлей затемняет сразу все мониторы, рамку можно двигать и тянуть за восемь ручек, а размер виден в подписи. Поверх снимка рисуют карандашом, линией, стрелкой, прямоугольником, маркером и текстом — любым цветом и любой из четырёх толщин.\n\nГотовое уходит в буфер или в файл (PNG, JPG, BMP) по кнопке, горячей клавише или двойному клику. Есть съёмка всего экрана отдельным сочетанием и печать через системный диалог.\n\nИмена файлов идут по порядку и занимают первый свободный номер в папке, поэтому удалённые снимки не оставляют дыр в нумерации. Программа живёт в трее и сама по себе оверлей не открывает.",
    "about_en": "Shotly is a screenshot tool for Windows in the Lightshot spirit: select an area, draw on top, copy or save. Nothing is uploaded to a server — every shot stays on your computer.\n\nThe overlay dims all your monitors at once; the frame can be moved and pulled by eight handles, with its size shown in a label. On top of the shot you draw with a pencil, line, arrow, rectangle, marker or text, in any colour and any of four thicknesses.\n\nThe result goes to the clipboard or into a file (PNG, JPG, BMP) by a button, a hotkey or a double click. A separate shortcut grabs the whole screen, and printing goes through the system dialog.\n\nFile names run in order and take the first free number in the folder, so deleted shots leave no gaps in the numbering. The app lives in the tray and never opens the overlay by itself.",
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
    "cover": "assets/media/ember/ember-cover.svg",
    "guide": "/Ember/docs/",
    "site": "/Ember/",
    "about_ru": "Ember — встраиваемая Python-библиотека и консольная утилита для извлечения и скачивания медиа из соцсетей, компактная альтернатива cobalt. Даёшь ссылку на пост — получаешь прямые ссылки на медиа с метаданными, а скачать Ember может и сам, включая HLS-потоки, без yt-dlp.\n\nПоддерживает 19 сервисов: TikTok, Twitter/X, Instagram, Reddit, Vimeo, SoundCloud, Pinterest, Tumblr, Bluesky, Newgrounds, Rutube, OK.ru, VK, Facebook, клипы Twitch и другие.\n\nЕдинственная обязательная зависимость — requests. Работает и как Python API (import ember), и как команда ember в терминале. Умеет подхватывать cookies из браузера для приватного контента.",
    "about_en": "Ember is an embeddable Python library and CLI for extracting and downloading media from social platforms — a compact alternative to cobalt. Give it a post URL and it returns direct media URLs with metadata, and it can download by itself too, including HLS streams, without yt-dlp.\n\nSupports 19 services: TikTok, Twitter/X, Instagram, Reddit, Vimeo, SoundCloud, Pinterest, Tumblr, Bluesky, Newgrounds, Rutube, OK.ru, VK, Facebook, Twitch clips and more.\n\nThe only required dependency is requests. Works both as a Python API (import ember) and as the ember terminal command. Can pick up browser cookies for private content.",
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
  }
];
