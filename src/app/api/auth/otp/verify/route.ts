import { NextResponse } from "next/server";
import { verificationStore } from "@/lib/server/verification";
import {
  getClientIp,
  normalizedRateKey,
  rateLimit,
} from "@/lib/server/rate-limit";

/**
 * Verify an email/phone OTP. Returns ok:true if the code matches.
 * The caller then proceeds with register or login.
 */
export async function POST(req: Request) {
  let body: {
    channel?: "email" | "phone";
    contact?: string;
    code?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov." }, { status: 400 });
  }

  const { channel = "email", contact, code } = body;
  if (!contact || !code) {
    return NextResponse.json(
      { error: "Kodni kiriting." },
      { status: 422 }
    );
  }

  const limit = await rateLimit(
    `otp-verify:${getClientIp(req)}:${channel}:${normalizedRateKey(contact)}`,
    10,
    10 * 60 * 1000
  );
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const result = await verificationStore.check(channel, contact, code);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({ ok: true });
}
