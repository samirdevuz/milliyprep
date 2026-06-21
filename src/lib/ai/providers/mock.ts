import type { ChatContext, ChatMessage, ChatProvider } from "../types";

/**
 * Offline fallback provider. Generates a plausible, context-aware Uzbek
 * reply without any external API. Used when no API key is configured so
 * the chat UI is always demonstrable.
 */
export class MockProvider implements ChatProvider {
  readonly name = "mock";

  async *stream(
    messages: ChatMessage[],
    context: ChatContext
  ): AsyncIterable<string> {
    const lastUser =
      [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    const reply = craftReply(lastUser, context);
    const tokens = reply.split(/(\s+)/);
    for (const token of tokens) {
      await delay(18);
      yield token;
    }
  }
}

function craftReply(question: string, ctx: ChatContext): string {
  const q = question.toLowerCase();

  if (/salom|assalom|hello|privet/.test(q)) {
    return "Salom! Men sizning AI tutoringizman. Bugun qaysi mavzu yoki savol ustida ishlaymiz? Masala yuborsangiz, qadam-baqadam yechib beraman.";
  }

  if (/tenglama|x\^?2|kvadrat|ildiz/.test(q)) {
    return [
      "Kvadrat tenglamani yechish uchun Vyeta teoremasi yoki diskriminantdan foydalanamiz.",
      "Masalan, x² − 5x + 6 = 0 bo'lsa:",
      "1) Diskriminant: D = b² − 4ac = 25 − 24 = 1.",
      "2) Ildizlar: x = (5 ± 1) / 2 → x₁ = 3, x₂ = 2.",
      "Tekshiruv: ildizlar yig'indisi 5 (= −b/a), ko'paytmasi 6 (= c/a). To'g'ri.",
      "Shu turdagi yana mashq qilib ko'ramizmi?",
    ].join("\n");
  }

  if (/foiz|protsent|percent/.test(q)) {
    return [
      "Foiz masalalarida asosiy formula: qism = butun × foiz / 100.",
      "Masalan, 200 ning 15% i = 200 × 15 / 100 = 30.",
      "Teskari masalada: agar 30 — bu butunning 15% i bo'lsa, butun = 30 × 100 / 15 = 200.",
      "Qaysi turdagi foiz masalasi sizga qiyin kelyapti?",
    ].join("\n");
  }

  const subjectHint = ctx.subjects?.length
    ? ` Siz ${ctx.subjects[0]} faniga e'tibor qaratayotganingizni hisobga olaman.`
    : "";

  return [
    `Yaxshi savol.${subjectHint} Keling, buni birgalikda ko'rib chiqaylik.`,
    "Avval savolning asosiy shartlarini ajratib olamiz, so'ng qadam-baqadam yechamiz. Iltimos, savol matnini to'liqroq yozing yoki rasmini yuboring — shunda aniq tushuntirib beraman.",
    "Eslatma: bu demo javob. Haqiqiy AI tutor server kalitlari sozlangach to'liq ishlaydi.",
  ].join("\n");
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
