import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/server/app-url";
import {
  getTelegramBotToken,
  getTelegramWebhookSecret,
} from "@/lib/server/config";
import { generateCode, verificationStore } from "@/lib/server/verification";

export const runtime = "nodejs";

interface TelegramUser {
  id: number;
  username?: string;
}

interface TelegramContact {
  phone_number: string;
  user_id?: number;
}

interface TelegramMessage {
  chat: { id: number };
  text?: string;
  contact?: TelegramContact;
  from?: TelegramUser;
}

interface TelegramUpdate {
  message?: TelegramMessage;
}

async function telegram(method: string, body: Record<string, unknown>) {
  const token = getTelegramBotToken();
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Telegram ${method} failed: ${res.status} ${text}`);
  }
}

async function sendMessage(
  chatId: number,
  text: string,
  replyMarkup?: Record<string, unknown>
) {
  await telegram("sendMessage", {
    chat_id: chatId,
    text,
    ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
  });
}

function contactKeyboard() {
  return {
    keyboard: [
      [
        {
          text: "Telefon raqamni yuborish",
          request_contact: true,
        },
      ],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  };
}

function removeKeyboard() {
  return { remove_keyboard: true };
}

function openSiteKeyboard(requestUrl: string) {
  return {
    inline_keyboard: [
      [
        {
          text: "Saytga o'tish",
          url: `${getAppUrl(requestUrl)}/onboarding`,
        },
      ],
    ],
  };
}

async function handleStart(message: TelegramMessage) {
  await sendMessage(
    message.chat.id,
    [
      "Assalomu alaykum! MilliyPrep ro'yxatdan o'tish botiga xush kelibsiz.",
      "",
      "Ro'yxatdan o'tishni yakunlash uchun telefon raqamingizni yuboring.",
      "Pastdagi tugmani bosing. Raqamingiz faqat hisobingizni tasdiqlash uchun ishlatiladi.",
    ].join("\n"),
    contactKeyboard()
  );
}

async function handleContact(message: TelegramMessage, requestUrl: string) {
  const contact = message.contact;
  const from = message.from;

  if (!contact || !from) return;

  if (contact.user_id && contact.user_id !== from.id) {
    await sendMessage(
      message.chat.id,
      "Iltimos, o'zingizning telefon raqamingizni yuboring."
    );
    return;
  }

  const record = await verificationStore.upsert({
    channel: "telegram",
    contact: contact.phone_number,
    code: generateCode(),
    telegramId: from.id,
    telegramUsername: from.username,
  });

  await sendMessage(
    message.chat.id,
    [
      "Telefon raqamingiz qabul qilindi.",
      "",
      "Tasdiqlash kodingiz:",
      record.code,
      "",
      "Ushbu 6 xonali kodni saytdagi maydonga kiriting va login hamda parol o'rnating.",
      "Kod 10 daqiqa davomida amal qiladi.",
    ].join("\n"),
    openSiteKeyboard(requestUrl)
  );
}

async function handleHelp(message: TelegramMessage) {
  await sendMessage(
    message.chat.id,
    "MilliyPrepga ro'yxatdan o'tish uchun /start buyrug'ini yuboring va telefon raqamingizni ulashing.",
    removeKeyboard()
  );
}

export async function POST(req: Request) {
  const expectedSecret = getTelegramWebhookSecret();
  const actualSecret = req.headers.get("x-telegram-bot-api-secret-token");
  if (actualSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = (await req.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const message = update.message;
  if (!message) {
    return NextResponse.json({ ok: true });
  }

  try {
    if (message.contact) {
      await handleContact(message, req.url);
    } else if (message.text === "/start") {
      await handleStart(message);
    } else if (message.text === "/help") {
      await handleHelp(message);
    } else {
      await sendMessage(
        message.chat.id,
        "Boshlash uchun /start buyrug'ini yuboring."
      );
    }
  } catch (error) {
    console.error("Telegram webhook error", error);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "telegram-webhook" });
}
