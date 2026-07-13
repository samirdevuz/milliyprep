import { NextResponse } from "next/server";
import { verificationStore } from "@/lib/server/verification";
import { userStore } from "@/lib/server/db";
import { createSessionCookie } from "@/lib/server/auth";
import {
  getClientIp,
  normalizedRateKey,
  rateLimit,
} from "@/lib/server/rate-limit";

/**
 * Passwordless login: the caller has already verified the OTP via
 * /api/auth/otp/verify. We re-check the code here (server-side trust) and
 * issue a session for the matching user.
 */
export async function POST(req: Request) {
  let body: { channel?: "email" | "phone"; contact?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov." }, { status: 400 });
  }

  const { channel = "email", contact, code } = body;
  if (!contact || !code) {
    return NextResponse.json({ error: "Kodni kiriting." }, { status: 422 });
  }

  const limit = await rateLimit(
    `otp-login:${getClientIp(req)}:${channel}:${normalizedRateKey(contact)}`,
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

  await verificationStore.remove(check.record.id);
  await createSessionCookie(user.id, user.name);

  return NextResponse.json({ user: { id: user.id, name: user.name } });
}
