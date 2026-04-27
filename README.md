# DnD Nexus

Цифровая DnD-платформа на React + Vite + Tailwind CSS.

## Что внутри

- Переключение ролей `Player / DM`
- Sidebar + topbar + основной контент
- Игровой дашборд, персонажи, детали персонажа, заметки мира
- DM-дашборд, кампании, вертикальный timeline, экран сессии, приватные заметки
- Tailwind CSS, mock data, без backend

## Структура проекта

```text
.
|-- index.html
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
|-- vite.config.js
`-- src
    |-- App.jsx
    |-- main.jsx
    |-- styles.css
    |-- components
    |   |-- Layout.jsx
    |   `-- Shared.jsx
    `-- data
        `-- mockData.js
```

## Запуск

```bash
npm install
npm run dev
```

## Стек

- React + Vite
- Tailwind CSS
- `useState` + hardcoded mock data
- `lucide-react` для иконок
