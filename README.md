# Release WebApp (Next.js + Puppeteer PDF)

## Локальний запуск
```bash
npm i
npm run dev
```

## Генерація PDF через API
`POST /api/pdf` (multipart/form-data):
- поле `data`: JSON (див. `lib/pdf/generate.ts` тип `ReleasePayload`)
- файли: `sharedSelfie`, `aSelfie`, `aId`, `aSign`, `bSelfie`, `bId`, `bSign`

PDF містить 3 секції в порядку **UA → RO → EN**.
В групах чекбоксів відображаються **лише обрані** пункти; **порожні групи** ховаються.
Фото нормалізуються до **3:4**.

## Деплой на Vercel
- Створи репозиторій, завантаж всі ці файли.
- У Vercel — Add New Project → під’єднай репо → Deploy.
- У Settings → Functions: Node.js 18+, Memory 1024MB, Timeout 10s.
