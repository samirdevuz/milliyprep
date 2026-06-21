import type { ChatContext } from "./types";

const EXAM_LABEL: Record<string, string> = {
  dtm: "DTM (universitetga kirish imtihoni)",
  "milliy-sertifikat": "Milliy sertifikat (til imtihoni)",
  ikkalasi: "DTM va Milliy sertifikat",
};

/**
 * Builds the system prompt for the MilliyPrep tutor, grounded in the
 * learner's onboarding context. Kept in Uzbek so the model replies in
 * the student's language by default.
 */
export function buildSystemPrompt(ctx: ChatContext): string {
  const lines: string[] = [
    "Siz MilliyPrep platformasining AI tutori siz — O'zbekiston o'quvchilariga DTM va Milliy sertifikat imtihonlariga tayyorlanishda yordam berasiz.",
    "Qoidalar:",
    "- Javoblaringiz aniq, qisqa va o'quvchiga tushunarli bo'lsin.",
    "- Imkon qadar o'zbek tilida (lotin) javob bering, agar o'quvchi rus yoki ingliz tilida yozsa, o'sha tilda javob bering.",
    "- Masala yechganda qadam-baqadam tushuntiring, faqat javobni aytib qo'ymang.",
    "- O'quvchini ruhlantiring, lekin haqiqatdan chetga chiqmang.",
    "- Agar savol imtihon mavzularidan tashqarida bo'lsa, hurmat bilan mavzuga qaytaring.",
  ];

  if (ctx.examType && EXAM_LABEL[ctx.examType]) {
    lines.push(`O'quvchining maqsadi: ${EXAM_LABEL[ctx.examType]}.`);
  }
  if (ctx.targetScore) {
    lines.push(`Maqsadli ball: ${ctx.targetScore}.`);
  }
  if (ctx.subjects?.length) {
    lines.push(`Tayyorlanayotgan fanlar: ${ctx.subjects.join(", ")}.`);
  }
  if (ctx.weakAreas?.length) {
    lines.push(
      `Zaif tomonlari: ${ctx.weakAreas.join(", ")}. Shularni hisobga oling.`
    );
  }

  return lines.join("\n");
}
