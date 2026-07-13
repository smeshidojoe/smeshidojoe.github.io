# MySite — портфолио

Статичный сайт для GitHub Pages: [smeshidojoe.github.io/MySite](https://smeshidojoe.github.io/MySite/)

## Структура

```
index.html              главная (карточки проектов)
guides/index.html       список гайдов
guides/snatchr.html     гайд (шаблон для новых)
data/projects.js        данные проектов (описания RU/EN, ссылки, медиа)
assets/css/style.css    стили
assets/js/i18n.js       переключатель RU/EN
assets/js/main.js       рендер карточек + лайтбокс
assets/media/           скриншоты и видео
```

## Как добавить скриншоты/видео к проекту

1. Положи файлы в `assets/media/<имя-проекта>/` (png/jpg/webp/gif/mp4/webm).
2. В `data/projects.js` пропиши пути в массив `media`:

```js
media: [
  "assets/media/snatchr/screen1.png",
  "assets/media/snatchr/demo.mp4"
]
```

Первый файл — обложка карточки. Клик открывает галерею.

## Как добавить новый гайд

1. Скопируй `guides/snatchr.html`, переименуй.
2. Замени текст в блоках `only-ru` / `only-en`.
3. Добавь карточку-ссылку в `guides/index.html`.

## Админ-панель (только для владельца)

Открытие: зайди на сайт с `#admin` в адресе (`…/MySite/#admin`) или нажми `Ctrl+Shift+A`.

Что умеет:
- **Акцентный цвет** — пипетка + hex, применяется сразу, «💾» коммитит `data/config.js`.
- **Тексты проектов** — на главной жми «✏️ Редактировать», правь описания карточек прямо на странице, «💾 Сохранить» коммитит `data/projects.js`.
- **Тексты гайдов** — на странице гайда тот же режим, сохранение коммитит HTML-файл гайда.

Нужен fine-grained personal access token: [создать](https://github.com/settings/personal-access-tokens/new),
Repository access → Only select repositories → `MySite`, Permissions → Contents: **Read and write**.
Токен хранится в localStorage твоего браузера и уходит только на `api.github.com`.
После сохранения GitHub Pages пересобирает сайт ~за минуту. Локальную копию репо после правок с сайта обнови через `git pull`.

## Локальный просмотр

Просто открой `index.html` в браузере — сборка не нужна.
