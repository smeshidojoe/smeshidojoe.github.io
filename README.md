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

## Локальный просмотр

Просто открой `index.html` в браузере — сборка не нужна.
