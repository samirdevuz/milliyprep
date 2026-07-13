# Production Checklist

## Kodda tayyor

- Next.js production build, strict TypeScript, ESLint va unit testlar.
- Supabase auth, practice, payment va subscription migratsiyalari.
- Server-authoritative practice scoring va idempotent Pro activation.
- Email/phone/Google/Telegram auth hamda server-validatsiyadan o'tgan onboarding.
- Production security headerlari va majburiy env tekshiruvi.

## Launchdan oldin berilishi shart

- Supabase production project URL va secret key.
- Google OAuth production client va redirect URI.
- Resend API key hamda verified sending domain.
- Telegram bot token, webhook secret va ro'yxatdan o'tkazilgan webhook.
- Click merchant/service/secret hamda tasdiqlangan callbacklar.
- Payme merchant/production key hamda tasdiqlangan callback.
- OpenAI API key, model limiti va billing alerti.
- Production domain, hosting va support email/Telegram kanali.

## Stagingda dalil bilan tekshiriladi

- `001` dan `006` gacha migratsiyalar yangi Supabase projectda ketma-ket o'tadi.
- Email, Google va Telegram orqali yangi hisob ochilib, onboarding saqlanadi.
- Practice natijasini brauzerdan soxtalashtirish 422 javob oladi.
- Click va Payme: success, duplicate callback, wrong amount va cancel ssenariylari.
- Paymentdan keyin `/api/payments/status` faol Pro obunani qaytaradi.
- `npm test`, `npm run build` va mobil/desktop smoke test yashil.
- Deploy qilingan URLga `SMOKE_BASE_URL=https://... npm run test:smoke` yashil.
- GitHub Actions `CI` workflow pull requestda yashil.

## Hali launch gate

- Real Milliy Sertifikat savollarini ekspert reviewdan o'tkazish.
- Distributed rate limit va error/payment observability ulash.
- Auth/payment browser E2E testlarini CI'da ishlatish.
- Backup restore drill, incident runbook va refund jarayonini sinash.
- Provider tasdig'idan so'ng `PAYMENT_MODE=production` va
  `ENFORCE_SUBSCRIPTIONS=true` ni yoqish.
