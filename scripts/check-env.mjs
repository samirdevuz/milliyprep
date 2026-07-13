import { existsSync, readFileSync } from "node:fs";

const ENV_FILE = ".env";

function parseEnv(raw) {
  const values = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    values[key] = value;
  }
  return values;
}

function has(values, key) {
  return Boolean(values[key] && !/^change-me|your-|123456:ABC/.test(values[key]));
}

function line(ok, label, hint) {
  const status = ok ? "OK " : "MISS";
  console.log(`${status} ${label}${ok ? "" : ` - ${hint}`}`);
  return ok;
}

if (!existsSync(ENV_FILE)) {
  console.error("MISS .env - .env.example dan .env yarating va qiymatlarni to'ldiring.");
  process.exit(1);
}

const env = parseEnv(readFileSync(ENV_FILE, "utf8"));
let ok = true;

console.log("MilliyPrep env check\n");

ok = line(
  has(env, "AUTH_SECRET") && env.AUTH_SECRET !== "change-me-in-production",
  "AUTH_SECRET",
  "32+ byte random secret qo'ying"
) && ok;

ok = line(
  has(env, "BOT_TOKEN") &&
    has(env, "TELEGRAM_WEBHOOK_SECRET") &&
    env.TELEGRAM_WEBHOOK_SECRET.length >= 24,
  "Telegram webhook",
  "BOT_TOKEN va 24+ belgili TELEGRAM_WEBHOOK_SECRET kerak"
) && ok;

const paymentConfigured =
  has(env, "CLICK_MERCHANT_ID") &&
  has(env, "CLICK_SERVICE_ID") &&
  has(env, "CLICK_SECRET_KEY") &&
  has(env, "PAYME_MERCHANT_ID") &&
  has(env, "PAYME_KEY");
const subscriptionsEnforced = env.ENFORCE_SUBSCRIPTIONS !== "false";

ok = line(
  !subscriptionsEnforced || paymentConfigured,
  "Payment providers",
  "entitlement yoqilganida Click va Payme merchant kalitlari to'liq bo'lishi kerak"
) && ok;

ok = line(has(env, "APP_URL"), "APP_URL", "masalan http://localhost:3000 yoki https://milliyprep.uz") && ok;

const hasSupabase = has(env, "SUPABASE_URL") && (has(env, "SUPABASE_SECRET_KEY") || has(env, "SUPABASE_SERVICE_ROLE_KEY"));
ok = line(
  hasSupabase,
  "Supabase",
  "SUPABASE_URL va SUPABASE_SECRET_KEY yoki SUPABASE_SERVICE_ROLE_KEY kerak"
) && ok;

line(
  has(env, "GOOGLE_CLIENT_ID") && has(env, "GOOGLE_CLIENT_SECRET"),
  "Google OAuth",
  "Google client ID/secret qo'yilsa Google login ishlaydi"
);

const hasEmailOtp = has(env, "RESEND_API_KEY") && has(env, "MAIL_FROM");
const hasSmsOtp = has(env, "ESKIZ_TOKEN");
const emailAuthEnabled = env.NEXT_PUBLIC_ENABLE_EMAIL_AUTH !== "false";
const phoneAuthEnabled = env.NEXT_PUBLIC_ENABLE_PHONE_AUTH !== "false";

line(
  hasEmailOtp,
  "Email OTP",
  "RESEND_API_KEY va verified domain MAIL_FROM kerak"
);

line(
  hasSmsOtp,
  "SMS OTP",
  "phone OTP production uchun ESKIZ_TOKEN kerak"
);

ok = line(
  (!emailAuthEnabled || hasEmailOtp) && (!phoneAuthEnabled || hasSmsOtp),
  "Enabled OTP providers",
  "yoqilgan email/phone auth uchun mos Resend/Eskiz qiymatlari kerak"
) && ok;

ok = line(
  has(env, "BOT_API_SECRET") && env.BOT_API_SECRET !== "dev-bot-secret",
  "Telegram shared secret",
  "BOT_API_SECRET kuchli random qiymat bo'lsin va bot/.env bilan bir xil bo'lsin"
) && ok;

ok = line(
  !subscriptionsEnforced || has(env, "OPENAI_API_KEY"),
  "AI tutor",
  "pullik AI tutor uchun OPENAI_API_KEY kerak"
) && ok;

console.log("");
if (!ok) {
  console.error("Production uchun majburiy qiymatlar yetishmayapti.");
  process.exit(1);
}

console.log("Production uchun asosiy env tayyor.");
