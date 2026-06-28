# MilliyPrep Telegram bot

Telegram orqali ro'yxatdan o'tishni boshqaradigan bot (`@MilliyPrepBot`).
Productionda bot Vercel webhook orqali ishlaydi:
`/api/telegram/webhook`.

`bot/index.js` faqat local development yoki alohida long-running Node process
kerak bo'lganda ishlatiladi.

## Ishlash tartibi

1. Foydalanuvchi saytdagi **"Telegram orqali ro'yxatdan o'tish"** tugmasini bosadi.
2. Sayt qadamlarni va `@MilliyPrepBot` havolasini ko'rsatadi.
3. Foydalanuvchi botda `/start` yuboradi.
4. Bot telefon raqamini so'raydi (kontakt ulashish tugmasi).
5. Production webhook Supabasega 6 xonali kod yozadi va bot orqali ko'rsatadi.
6. Foydalanuvchi kodni saytga kiritadi, login va kamida 8 belgili parol o'rnatadi.
7. Hisob yaratiladi va dashboardga yo'naltiriladi.

## Sozlash

```bash
cd bot
copy .env.example .env   # va qiymatlarni to'ldiring
npm install
npm run dev
```

`.env`:
- `BOT_TOKEN` — @BotFather'dan olingan token
- `APP_URL` — Next.js ilovasi manzili (masalan, http://localhost:3000)
- `BOT_API_SECRET` — Next.js `.env` dagi `BOT_API_SECRET` bilan bir xil bo'lishi shart

> Bot kodni har doim sayt API orqali yaratadi. Sayt Supabase env sozlangan bo'lsa Supabasega, aks holda local `data/` fallbackga yozadi.

## Production webhook

Vercel Production env:

```env
BOT_TOKEN=
BOT_API_SECRET=
TELEGRAM_WEBHOOK_SECRET=
APP_URL=https://milliyprep.xyz
```

Webhook:

```bash
curl "https://api.telegram.org/bot$BOT_TOKEN/setWebhook" \
  -d "url=https://milliyprep.xyz/api/telegram/webhook" \
  -d "secret_token=$TELEGRAM_WEBHOOK_SECRET"
```
