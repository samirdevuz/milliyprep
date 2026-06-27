import type { ChatContext } from "./types";

/**
 * Builds the system prompt for the MilliyPrep tutor, grounded in the
 * learner's onboarding context. Kept in Uzbek so the model replies in
 * the student's language by default.
 */
export function buildSystemPrompt(ctx: ChatContext): string {
  const lines: string[] = [
    "Siz MilliyPrep platformasining AI tutori siz — O'zbekiston o'quvchilariga Milliy Sertifikat imtihoniga tayyorlanishda yordam berasiz.",
    "Qoidalar:",
    "- Javoblaringiz aniq, qisqa va o'quvchiga tushunarli bo'lsin.",
    "- Imkon qadar o'zbek tilida (lotin) javob bering, agar o'quvchi rus yoki ingliz tilida yozsa, o'sha tilda javob bering.",
    "- Masala yechganda qadam-baqadam tushuntiring, faqat javobni aytib qo'ymang.",
    "- O'quvchini ruhlantiring, lekin haqiqatdan chetga chiqmang.",
    "- Agar savol imtihon mavzularidan tashqarida bo'lsa, hurmat bilan mavzuga qaytaring.",
  ];

  if (ctx.subjectLabel) {
    lines.push(`O'quvchi tayyorlanayotgan fan: ${ctx.subjectLabel}.`);
  }
  if (ctx.resultStatus) {
    lines.push(`Hozirgi natija holati: ${ctx.resultStatus}.`);
  }
  if (ctx.currentScore) {
    lines.push(`Hozirgi ball: ${ctx.currentScore}/100.`);
  }
  if (ctx.targetScore) {
    lines.push(`Maqsadli ball: ${ctx.targetScore}/100.`);
  }
  if (ctx.focusSkills?.length) {
    lines.push(
      `Asosiy e'tibor beriladigan ko'nikmalar: ${ctx.focusSkills.join(", ")}.`
    );
  }
  if (ctx.worries) {
    lines.push(`O'quvchining asosiy xavotiri: ${ctx.worries}.`);
  }

  return lines.join("\n");
}
