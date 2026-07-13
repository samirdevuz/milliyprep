import { NextResponse } from "next/server";
import { verificationStore } from "@/lib/server/verification";
import { sendEmailCode, sendSmsCode } from "@/lib/server/notifier";
import { userStore } from "@/lib/server/db";
import {
  getClientIp,
  normalizedRateKey,
  rateLimit,
} from "@/lib/server/rate-limit";
import { isEmail, isPhone } from "@/lib/validation";

/**
 * Send an OTP to an email or phone.
 * `purpose` controls the uniqueness check:
 *  - "register": contact must NOT already exist
 *  - "login":    contact MUST exist
 */
export async function POST(req: Request) {
  let body: {
    channel?: "email" | "phone";
    contact?: string;
    purpose?: "register" | "login";
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov." }, { status: 400 });
  }

  const { channel = "email", contact, purpose = "register" } = body;
  if (!contact) {
    return NextResponse.json(
      { error: "Aloqa ma'lumotini kiriting." },
      { status: 422 }
    );
  }
  if (channel === "email" && !isEmail(contact)) {
    return NextResponse.json(
      { error: "To'g'ri elektron pochta kiriting." },
      { status: 422 }
    );
  }
  if (channel === "phone" && !isPhone(contact)) {
    return NextResponse.json(
      { error: "To'g'ri telefon raqamini kiriting." },
      { status: 422 }
    );
  }

  const limit = await rateLimit(
    `otp-send:${getClientIp(req)}:${channel}:${normalizedRateKey(contact)}`,
    5,
    10 * 60 * 1000
  );
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Juda ko'p kod so'rovi. Birozdan so'ng qayta urinib ko'ring." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const existing =
    channel === "email"
      ? await userStore.findByEmail(contact)
      : await userStore.findByPhone(contact);

  if (purpose === "register" && existing) {
    return NextResponse.json(
      { error: "Bu hisob allaqachon mavjud. Kirishni sinab ko'ring." },
      { status: 409 }
    );
  }
  if (purpose === "login" && !existing) {
    return NextResponse.json(
      { error: "Bunday hisob topilmadi. Ro'yxatdan o'ting." },
      { status: 404 }
    );
  }

  const record = await verificationStore.upsert({ channel, contact });
  const result =
    channel === "email"
      ? await sendEmailCode(contact, record.code)
      : await sendSmsCode(contact, record.code);

  if (!result.delivered) {
    const provider =
      channel === "email" ? "Email OTP provayderi" : "SMS OTP provayderi";
    return NextResponse.json(
      { error: `${provider} sozlanmagan yoki kod yuborib bo'lmadi.` },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    // devCode is only present in development for testing.
    devCode: result.devCode,
  });
}
