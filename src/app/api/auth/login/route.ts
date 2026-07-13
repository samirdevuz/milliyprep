import { NextResponse } from "next/server";
import { userStore } from "@/lib/server/db";
import { verifyPassword } from "@/lib/server/password";
import { createSessionCookie } from "@/lib/server/auth";
import {
  getClientIp,
  normalizedRateKey,
  rateLimit,
} from "@/lib/server/rate-limit";
import { isEmail, isPhone } from "@/lib/validation";

export async function POST(req: Request) {
  let body: {
    method?: "email" | "phone";
    contact?: string;
    password?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov." }, { status: 400 });
  }

  const { method = "email", contact, password } = body;

  if (!contact || !password) {
    return NextResponse.json(
      { error: "Barcha maydonlarni to'ldiring." },
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

  const limit = await rateLimit(
    `password-login:${getClientIp(req)}:${method}:${normalizedRateKey(contact)}`,
    10,
    10 * 60 * 1000
  );
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Juda ko'p kirish urinishlari. Birozdan so'ng qayta urinib ko'ring." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const user =
    method === "email"
      ? await userStore.findByEmail(contact)
      : await userStore.findByPhone(contact);

  // Generic message to avoid leaking which field was wrong.
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json(
      { error: "Hisob ma'lumotlari noto'g'ri." },
      { status: 401 }
    );
  }

  await createSessionCookie(user.id, user.name);

  return NextResponse.json({
    user: { id: user.id, name: user.name },
  });
}
