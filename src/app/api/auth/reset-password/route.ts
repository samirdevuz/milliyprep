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

/**
 * Reset a password. The caller has requested an OTP (purpose "login", which
 * requires the account to exist) and entered the code. We re-verify the code
 * server-side, set the new password, and sign the user in.
 */
export async function POST(req: Request) {
  let body: {
    channel?: "email" | "phone";
    contact?: string;
    code?: string;
    password?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov." }, { status: 400 });
  }

  const { channel = "email", contact, code, password } = body;

  if (!contact || !code) {
    return NextResponse.json({ error: "Kodni kiriting." }, { status: 422 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Yangi parol kamida 8 ta belgidan iborat bo'lsin." },
      { status: 422 }
    );
  }

  const limit = await rateLimit(
    `reset-password:${getClientIp(req)}:${channel}:${normalizedRateKey(contact)}`,
    10,
    10 * 60 * 1000
  );
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const check = await verificationStore.check(channel, contact, code);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 422 });
  }

  const user =
    channel === "email"
      ? await userStore.findByEmail(contact)
      : await userStore.findByPhone(contact);

  if (!user) {
    return NextResponse.json({ error: "Hisob topilmadi." }, { status: 404 });
  }

  await userStore.update(user.id, { passwordHash: hashPassword(password) });
  await verificationStore.remove(check.record.id);
  await createSessionCookie(user.id, user.name);

  return NextResponse.json({ user: { id: user.id, name: user.name } });
}
