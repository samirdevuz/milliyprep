# MilliyPrep Production Setup

This app is now ready to run with Supabase Postgres as the production database.
Without Supabase env values it still falls back to local `data/*.json` for dev.

## 1. Local Runtime

Install Node.js `20.19.0` or newer. The current project declares this in
`package.json`.

Then run:

```bash
npm install
npm run lint
npm run typecheck
npm run build
npm run check:env
```

## 2. Generate Auth Secret

Set `AUTH_SECRET` to a unique random value.

PowerShell:

```powershell
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)
```

Put the output in `.env`:

```env
AUTH_SECRET=the-generated-value
```

## 3. Supabase

1. Create a Supabase project.
2. Open `SQL Editor` -> `New Query`.
3. Paste and run `supabase/migrations/001_initial_auth.sql`.
4. Go to `Settings` -> `API Keys`.
5. Copy:
   - Project URL -> `SUPABASE_URL`
   - Secret key (`sb_secret_...`) -> `SUPABASE_SECRET_KEY`
   - If your project only has legacy keys, copy `service_role` -> `SUPABASE_SERVICE_ROLE_KEY`

`.env`:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your_key
```

Keep `SUPABASE_SECRET_KEY` server-only. Never use `NEXT_PUBLIC_` for it and do
not paste it into browser code.

## 4. Google OAuth

This project uses its own Google OAuth route, not Supabase Auth.

In Google Cloud:

1. Open Google Auth Platform / Clients.
2. Create a client.
3. Select `Web application`.
4. Add Authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://milliyprep.uz` when your domain is live
5. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
   - `https://milliyprep.uz/api/auth/google/callback`
6. Copy the Client ID and Client Secret.

`.env`:

```env
APP_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

For production:

```env
APP_URL=https://milliyprep.uz
```

Google only shows the client secret at creation time in some console flows, so
save it immediately in your password manager.

## 5. Email OTP

Email OTP uses Resend when `RESEND_API_KEY` is present. This is the recommended first OTP provider because it is faster to launch than SMS.

1. Create a Resend account.
2. Add and verify your sending domain.
3. Create an API key.
4. Set `MAIL_FROM` to an address on the verified domain.

`.env`:

```env
NEXT_PUBLIC_ENABLE_EMAIL_AUTH=true
RESEND_API_KEY=re_xxx
MAIL_FROM=MilliyPrep <no-reply@milliyprep.uz>
```

Without `RESEND_API_KEY`, email OTP is dev-only: the code is logged and returned
to the UI when `NODE_ENV !== "production"`. In production, missing Resend config makes email OTP return an explicit error.

If you have not configured email OTP yet, hide email auth from the public UI:

```env
NEXT_PUBLIC_ENABLE_EMAIL_AUTH=false
```

## 6. SMS OTP

Phone OTP currently supports Eskiz by bearer token.

`.env`:

```env
NEXT_PUBLIC_ENABLE_PHONE_AUTH=false
ESKIZ_TOKEN=your-active-eskiz-token
ESKIZ_FROM=4546
```

For a real launch, confirm the sender name / alpha name, balance, and OTP
message template with Eskiz. If Eskiz gives short-lived tokens only, add token
refresh before opening paid traffic.

If you have not configured SMS yet, keep phone OTP out of your first public
launch and use Google, Telegram, and email registration first.

```env
NEXT_PUBLIC_ENABLE_PHONE_AUTH=false
```

## 7. Telegram Bot

1. Create a bot through `@BotFather`.
2. Copy the token into `bot/.env`.
3. Generate a strong `BOT_API_SECRET`; it must match both env files.

Root `.env`:

```env
BOT_API_SECRET=long-random-shared-secret
```

`bot/.env`:

```env
BOT_TOKEN=123456:your-bot-token
APP_URL=http://localhost:3000
BOT_API_SECRET=long-random-shared-secret
```

Run:

```bash
cd bot
npm install
npm run dev
```

## 8. AI Tutor

AI tutor works in demo/mock mode without an API key. For real AI responses,
set an OpenAI-compatible API key:

```env
OPENAI_API_KEY=sk_...
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

`OPENAI_BASE_URL` can point to any OpenAI-compatible gateway if you later route
models through another provider.

## 9. Deployment Env

When deploying, set these environment variables in the hosting platform:

```env
AUTH_SECRET=
APP_URL=https://milliyprep.uz
SUPABASE_URL=
SUPABASE_SECRET_KEY=
BOT_API_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=
MAIL_FROM=MilliyPrep <no-reply@milliyprep.uz>
ESKIZ_TOKEN=
ESKIZ_FROM=4546
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

Local `.env`ni tekshirish:

```bash
npm run check:env
```

## 10. What Is Already Done In Code

- Supabase/Postgres adapter for users and OTP verification records.
- Local JSON fallback for dev.
- Server-side OTP enforcement on registration.
- Rate limits for OTP, login, reset password, register, and Telegram issue-code.
- Google OAuth server callback.
- Telegram registration bot integration.
- Email OTP via Resend and SMS OTP via Eskiz token.
- AI tutor streaming API and dashboard chat UI.
