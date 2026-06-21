import { NextResponse } from "next/server";
import { userStore } from "@/lib/server/db";
import { hashPassword } from "@/lib/server/password";
import { createSessionCookie } from "@/lib/server/auth";
import { verificationStore } from "@/lib/server/verification";
import {
  getClientIp,
  normalizedRateKey,
  rateLimit,
} from "@/lib/server/rate-limit";
import { isEmail, isPhone } from "@/lib/validation";

export async function POST(req: Request) {
  let body: {
    name?: string;
    method?: "email" | "phone";
    contact?: string;
    code?: string;
    password?: string;
    onboarding?: Record<string, unknown>;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov." }, { status: 400 });
  }

  const { name, method = "email", contact, code, password, onboarding } = body;

  // Validation
  if (!name || name.trim().length < 2) {
    return NextResponse.json(
      { error: "Ismingizni kiriting." },
      { status: 422 }
    );
  }
  if (!contact) {
    return NextResponse.json(
      { error: "Aloqa ma'lumotini kiriting." },
      { status: 422 }
    );
  }
  if (method === "email" && !isEmail(contact)) {
    return NextResponse.json(
      { error: "To'g'ri elektron pochta kiriting." },
      { status: 422 }
    );
  }
  if (method === "phone" && !isPhone(contact)) {
    return NextResponse.json(
      { error: "To'g'ri telefon raqamini kiriting." },
      { status: 422 }
    );
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Parol kamida 8 ta belgidan iborat bo'lsin." },
      { status: 422 }
    );
  }
  if (!code || code.length !== 6) {
    return NextResponse.json(
      { error: "6 xonali tasdiqlash kodini kiriting." },
      { status: 422 }
    );
  }

  const limit = rateLimit(
    `register:${getClientIp(req)}:${method}:${normalizedRateKey(contact)}`,
    10,
    10 * 60 * 1000
  );
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Juda ko'p ro'yxatdan o'tish urinishlari. Birozdan so'ng qayta urinib ko'ring." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  // Uniqueness
  const existing =
    method === "email"
      ? await userStore.findByEmail(contact)
      : await userStore.findByPhone(contact);
  if (existing) {
    return NextResponse.json(
      { error: "Bu hisob allaqachon ro'yxatdan o'tgan. Kirishni sinab ko'ring." },
      { status: 409 }
    );
  }

  const check = await verificationStore.check(method, contact, code);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 422 });
  }

  const user = await userStore.create({
    name: name.trim(),
    email: method === "email" ? contact.trim() : undefined,
    phone: method === "phone" ? contact.trim() : undefined,
    passwordHash: hashPassword(password),
    provider: method,
    emailVerified: method === "email" ? true : undefined,
    phoneVerified: method === "phone" ? true : undefined,
    onboarding,
  });

  await verificationStore.remove(check.record.id);
  await createSessionCookie(user.id, user.name);

  return NextResponse.json({
    user: { id: user.id, name: user.name },
  });
}
