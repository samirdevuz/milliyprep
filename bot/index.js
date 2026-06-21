import "dotenv/config";
import { Bot, Keyboard, InlineKeyboard } from "grammy";

/**
 * MilliyPrep Telegram registration bot.
 *
 * Flow:
 *   1. User taps "Telegram orqali ro'yxatdan o'tish" on the website.
 *   2. User opens @MilliyPrepBot and sends /start.
 *   3. Bot asks for the phone number (contact share button).
 *   4. Bot calls the website API to issue a 6-digit code.
 *   5. Bot shows the code; user enters it on the website to finish signup.
 */

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_BASE = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const BOT_API_SECRET = process.env.BOT_API_SECRET;
const WEB_REGISTER_URL = `${API_BASE}/register?from=telegram`;

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN .env faylida ko'rsatilmagan. Botni ishga tushirib bo'lmaydi.");
  process.exit(1);
}

if (!BOT_API_SECRET || BOT_API_SECRET === "dev-bot-secret") {
  console.error("BOT_API_SECRET kuchli qiymatga sozlanmagan. Bot API himoyasi uchun majburiy.");
  process.exit(1);
}

const bot = new Bot(BOT_TOKEN);

bot.command("start", async (ctx) => {
  const contactKeyboard = new Keyboard()
    .requestContact("📱 Telefon raqamni yuborish")
    .resized()
    .oneTime();

  await ctx.reply(
    [
      "Assalomu alaykum! MilliyPrep ro'yxatdan o'tish botiga xush kelibsiz. 👋",
      "",
      "Ro'yxatdan o'tishni yakunlash uchun telefon raqamingizni yuboring.",
      "Pastdagi tugmani bosing — raqamingiz faqat hisobingizni tasdiqlash uchun ishlatiladi.",
    ].join("\n"),
    { reply_markup: contactKeyboard }
  );
});

bot.on("message:contact", async (ctx) => {
  const contact = ctx.message.contact;

  // Make sure the shared contact belongs to the sender.
  if (contact.user_id && contact.user_id !== ctx.from.id) {
    await ctx.reply("Iltimos, o'zingizning telefon raqamingizni yuboring.");
    return;
  }

  const phone = contact.phone_number;

  try {
    const res = await fetch(`${API_BASE}/api/telegram/issue-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BOT_API_SECRET}`,
      },
      body: JSON.stringify({
        phone,
        telegramId: ctx.from.id,
        telegramUsername: ctx.from.username,
      }),
    });

    if (!res.ok) {
      await ctx.reply(
        "Kechirasiz, kod yaratishda xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.",
        { reply_markup: { remove_keyboard: true } }
      );
      return;
    }

    const { code } = await res.json();

    // Telegram rejects localhost/non-HTTPS URLs in inline buttons. Only add
    // the button when APP_URL is a public https URL; otherwise show text.
    const canLinkButton = /^https:\/\//i.test(WEB_REGISTER_URL);
    const replyOptions = { parse_mode: "Markdown" };
    if (canLinkButton) {
      replyOptions.reply_markup = new InlineKeyboard().url(
        "🌐 Saytga o'tish",
        WEB_REGISTER_URL
      );
    } else {
      replyOptions.reply_markup = { remove_keyboard: true };
    }

    await ctx.reply(
      [
        "✅ Telefon raqamingiz qabul qilindi.",
        "",
        "Tasdiqlash kodingiz:",
        `\`${code}\``,
        "",
        "Ushbu 6 xonali kodni saytdagi maydonga kiriting va login hamda parol o'rnating.",
        "Kod 10 daqiqa davomida amal qiladi.",
      ].join("\n"),
      replyOptions
    );
  } catch (err) {
    console.error("issue-code error", err);
    await ctx.reply(
      "Server bilan bog'lanishda muammo. Keyinroq urinib ko'ring.",
      { reply_markup: { remove_keyboard: true } }
    );
  }
});

bot.command("help", async (ctx) => {
  await ctx.reply(
    "MilliyPrepga ro'yxatdan o'tish uchun /start buyrug'ini yuboring va telefon raqamingizni ulashing."
  );
});

bot.catch((err) => {
  console.error("Bot xatosi:", err);
});

bot.start({
  onStart: (info) => console.log(`@${info.username} ishga tushdi.`),
});
