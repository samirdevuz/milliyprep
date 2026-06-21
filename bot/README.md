# MilliyPrep Telegram bot

Telegram orqali ro'yxatdan o'tishni boshqaradigan alohida bot (`@MilliyPrepBot`).

## Ishlash tartibi

1. Foydalanuvchi saytdagi **"Telegram orqali ro'yxatdan o'tish"** tugmasini bosadi.
2. Sayt qadamlarni va `@MilliyPrepBot` havolasini ko'rsatadi.
3. Foydalanuvchi botda `/start` yuboradi.
4. Bot telefon raqamini so'raydi (kontakt ulashish tugmasi).
5. Bot saytning `/api/telegram/issue-code` API'siga murojaat qilib, 6 xonali kod oladi va ko'rsatadi.
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
