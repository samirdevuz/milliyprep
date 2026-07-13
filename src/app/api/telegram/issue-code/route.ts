import { NextResponse } from "next/server";
import { verificationStore, generateCode } from "@/lib/server/verification";
import {
  getClientIp,
  normalizedRateKey,
  rateLimit,
} from "@/lib/server/rate-limit";
import { getBotApiSecret } from "@/lib/server/config";

/**
 * Internal endpoint called by the Telegram bot after the user shares their
 * phone number. Issues a 6-digit code tied to the phone + telegram id and
 * returns it so the bot can show it to the user.
 *
 * Protected by a shared secret (BOT_API_SECRET) in the Authorization header.
 */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${getBotApiSecret()}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    phone?: string;
    telegramId?: number;
    telegramUsername?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (!body.phone || !body.telegramId) {
    return NextResponse.json(
      { error: "phone and telegramId required" },
      { status: 422 }
    );
  }

  const limit = await rateLimit(
    `telegram-issue:${getClientIp(req)}:${normalizedRateKey(String(body.telegramId))}`,
    10,
    10 * 60 * 1000
  );
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const record = await verificationStore.upsert({
    channel: "telegram",
    contact: body.phone,
    code: generateCode(),
    telegramId: body.telegramId,
    telegramUsername: body.telegramUsername,
  });

  return NextResponse.json({ code: record.code, expiresAt: record.expiresAt });
}
