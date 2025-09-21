# Release WebApp (Next.js + Puppeteer PDF, Vercel-ready)

## Старт локально
```bash
npm i
npm run dev
```

## Деплой на Vercel
- Завантажити цей код у GitHub.
- Vercel → Add New Project → обрати репозиторій → Deploy.
- Налаштування функцій: Node.js 18+, Memory 1024MB (за бажанням).

## Тест
- GET `/api/pdf/ping` → `{"ok":true,...}`
- GET `/api/pdf/test` → простий PDF
- POST `/api/pdf` (через форму на головній) → тримовний PDF (UA→RO→EN).

## Примітка щодо фото
Щоб уникнути проблем нативних бінарників на Vercel, бекенд **не обрізає** фото, але у PDF вони виглядають як 3×4 завдяки CSS (`aspect-ratio:3/4`). Якщо потрібно — надалі можна додати фронтовий кропер.
