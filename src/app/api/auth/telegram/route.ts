import { NextResponse } from "next/server";
import { verificationStore } from "@/lib/server/verification";
import { userStore } from "@/lib/server/db";
import { hashPassword } from "@/lib/server/password";
import { createSessionCookie } from "@/lib/server/auth";
import {
  getClientIp,
  normalizedRateKey,
  rateLimit,
} from "@/lib/server/rate-limit";
import {
  OnboardingInputError,
  sanitizeOnboarding,
} from "@/lib/onboarding/server-validation";

/**
 * Completes Telegram registration. The user entered the 6-digit code the
 * bot gave them, plus a chosen login (name) and password.
 */
export async function POST(req: Request) {
  let body: {
    code?: string;
    name?: string;
    password?: string;
    onboarding?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov." }, { status: 400 });
  }

  const { code, name, password } = body;
  let onboarding: Record<string, unknown> | undefined;
  try {
    onboarding = sanitizeOnboarding(body.onboarding);
  } catch (error) {
    if (error instanceof OnboardingInputError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    throw error;
  }

  if (!code || code.length !== 6) {
    return NextResponse.json({ error: "6 xonali kodni kiriting." }, { status: 422 });
  }
  if (!name || name.trim().length < 2) {
    return NextResponse.json({ error: "Login kiriting." }, { status: 422 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Parol kamida 8 ta belgidan iborat bo'lsin." },
      { status: 422 }
    );
  }

  const [ipLimit, codeLimit] = await Promise.all([
    rateLimit(`telegram-register:${getClientIp(req)}`, 20, 10 * 60 * 1000),
    rateLimit(
      `telegram-register-code:${normalizedRateKey(code)}`,
      5,
      10 * 60 * 1000
    ),
  ]);
  if (!ipLimit.ok || !codeLimit.ok) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.max(ipLimit.retryAfter, codeLimit.retryAfter)),
        },
      }
    );
  }

  const record = await verificationStore.findTelegramByCode(code);
  if (!record) {
    return NextResponse.json(
      { error: "Kod noto'g'ri yoki muddati tugagan." },
      { status: 422 }
    );
  }

  // Already registered with this Telegram id / phone?
  const existing =
    (record.telegramId &&
      (await userStore.findByProvider("telegram", String(record.telegramId)))) ||
    (await userStore.findByPhone(record.contact));
  if (existing) {
    await createSessionCookie(existing.id, existing.name);
    await verificationStore.remove(record.id);
    return NextResponse.json({ user: { id: existing.id, name: existing.name } });
  }

  const user = await userStore.create({
    name: name.trim(),
    phone: record.contact,
    passwordHash: hashPassword(password),
    provider: "telegram",
    externalId: record.telegramId ? String(record.telegramId) : undefined,
    phoneVerified: true,
    onboarding,
  });

  await verificationStore.remove(record.id);
  await createSessionCookie(user.id, user.name);

  return NextResponse.json({ user: { id: user.id, name: user.name } });
}
