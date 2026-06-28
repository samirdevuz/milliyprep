const DEV_SESSION_SECRET = "milliyprep-dev-secret-change-in-production";
const DEV_BOT_SECRET = "dev-bot-secret";
const DEV_TELEGRAM_WEBHOOK_SECRET = "dev-telegram-webhook-secret";
const INVALID_PRODUCTION_SECRETS = new Set([
  DEV_SESSION_SECRET,
  DEV_BOT_SECRET,
  DEV_TELEGRAM_WEBHOOK_SECRET,
  "change-me-in-production",
]);

export function getSessionSecret(): string {
  const secret = process.env.AUTH_SECRET?.trim();

  if (process.env.NODE_ENV === "production") {
    if (!secret || secret.length < 32 || INVALID_PRODUCTION_SECRETS.has(secret)) {
      throw new Error(
        "AUTH_SECRET must be set to a unique value with at least 32 characters in production."
      );
    }
    return secret;
  }

  return secret || DEV_SESSION_SECRET;
}

export function canUseLocalDataFallback(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.ALLOW_LOCAL_DATA_FALLBACK === "true"
  );
}

export function requireLocalDataFallback(feature: string): void {
  if (canUseLocalDataFallback()) return;
  throw new Error(
    `${feature} requires Supabase in production. Configure SUPABASE_URL and SUPABASE_SECRET_KEY instead of using local JSON fallback.`
  );
}

export function getBotApiSecret(): string {
  const secret = process.env.BOT_API_SECRET?.trim();

  if (process.env.NODE_ENV === "production") {
    if (!secret || secret.length < 24 || INVALID_PRODUCTION_SECRETS.has(secret)) {
      throw new Error(
        "BOT_API_SECRET must be set to a unique value with at least 24 characters in production."
      );
    }
    return secret;
  }

  return secret || DEV_BOT_SECRET;
}

export function getTelegramBotToken(): string {
  const token = process.env.BOT_TOKEN?.trim();

  if (process.env.NODE_ENV === "production") {
    if (!token) {
      throw new Error("BOT_TOKEN must be set in production.");
    }
    return token;
  }

  return token || "";
}

export function getTelegramWebhookSecret(): string {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();

  if (process.env.NODE_ENV === "production") {
    if (!secret || secret.length < 24 || INVALID_PRODUCTION_SECRETS.has(secret)) {
      throw new Error(
        "TELEGRAM_WEBHOOK_SECRET must be set to a unique value with at least 24 characters in production."
      );
    }
    return secret;
  }

  return secret || DEV_TELEGRAM_WEBHOOK_SECRET;
}
