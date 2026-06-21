# Production Checklist

## Done In This Sprint

- Next/React dependencies patched.
- ESLint 9 flat config working.
- `npm audit` clean.
- Supabase production schema created in `supabase/migrations/001_initial_auth.sql`.
- Server-side Supabase adapter added with JSON fallback.
- Register endpoint requires OTP server-side.
- Auth routes have basic rate limiting.
- Google OAuth callback uses normalized `APP_URL`.
- AI tutor streaming API and dashboard chat UI added.
- Setup guide written in `docs/production-setup.md`.

## You Need To Provide

- Supabase project URL and secret key.
- Google OAuth client ID and client secret.
- Resend API key and verified sending domain.
- Eskiz SMS token / sender setup, if phone OTP must work in production.
- Telegram bot token from BotFather.
- Production domain and hosting env values.
- OpenAI API key if AI tutor will be enabled.

## Next Build Sprint

- Replace dashboard demo data with Supabase-backed study plan/progress tables.
- Build practice/test question bank schema.
- Add admin tools for questions and content.
- Add payment/subscription gating.
