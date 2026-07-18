import { AVAILABLE_CERTIFICATE_SUBJECTS } from "./certificate.ts";

const SUBJECT_IDS = new Set(
  AVAILABLE_CERTIFICATE_SUBJECTS.map((subject) => subject.id)
);
const RESULT_STATUSES = new Set(["has-score", "not-taken", "unknown"]);
const EXAM_PURPOSES = new Set(["university", "work", "teacher", "self", "other"]);
const REFERRAL_SOURCES = new Set([
  "instagram",
  "telegram",
  "friend",
  "teacher",
  "google",
  "other",
]);

export class OnboardingInputError extends Error {}

function objectValue(input: unknown): Record<string, unknown> | undefined {
  if (input === undefined || input === null) return undefined;
  if (typeof input !== "object" || Array.isArray(input)) {
    throw new OnboardingInputError("Onboarding ma'lumotlari noto'g'ri.");
  }
  return input as Record<string, unknown>;
}

function optionalString(
  value: unknown,
  label: string,
  maxLength: number
): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") {
    throw new OnboardingInputError(`${label} noto'g'ri.`);
  }
  const clean = value.trim();
  if (!clean || clean.length > maxLength) {
    throw new OnboardingInputError(`${label} noto'g'ri.`);
  }
  return clean;
}

function optionalInteger(
  value: unknown,
  label: string,
  min: number,
  max: number
): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (!Number.isInteger(value) || (value as number) < min || (value as number) > max) {
    throw new OnboardingInputError(`${label} noto'g'ri.`);
  }
  return value as number;
}

function enumValue(
  value: unknown,
  label: string,
  allowed: Set<string>
): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string" || !allowed.has(value)) {
    throw new OnboardingInputError(`${label} noto'g'ri.`);
  }
  return value;
}

/**
 * Converts browser-provided onboarding data to the small, documented profile
 * shape we persist. Unknown/legacy keys are intentionally discarded.
 */
export function sanitizeOnboarding(
  input: unknown
): Record<string, unknown> | undefined {
  const source = objectValue(input);
  if (!source) return undefined;

  const resultStatus = enumValue(
    source.resultStatus,
    "Hozirgi natija holati",
    RESULT_STATUSES
  );
  const examPurpose = enumValue(source.examPurpose, "Sertifikat maqsadi", EXAM_PURPOSES);
  const clean: Record<string, unknown> = {};

  const fullName = optionalString(source.fullName, "Ism", 80);
  const subjectId = enumValue(source.subjectId, "Fan", SUBJECT_IDS);
  const currentScore = optionalInteger(source.currentScore, "Hozirgi ball", 0, 100);
  const targetScore = optionalInteger(source.targetScore, "Maqsadli ball", 31, 100);
  const weeklyHours = optionalInteger(source.weeklyHours, "Haftalik vaqt", 1, 168);
  const studyDays = optionalInteger(source.studyDays, "O'qish kunlari", 1, 7);
  const purposeOther = optionalString(source.purposeOther, "Boshqa maqsad", 160);
  const referralSource = enumValue(
    source.referralSource,
    "Tavsiya manbasi",
    REFERRAL_SOURCES
  );

  if (resultStatus !== "has-score" && currentScore !== undefined) {
    throw new OnboardingInputError("Hozirgi ball faqat natija mavjud bo'lsa yuboriladi.");
  }
  if (examPurpose !== "other" && purposeOther !== undefined) {
    throw new OnboardingInputError("Boshqa maqsad izohi tanlangan maqsadga mos emas.");
  }
  if (
    resultStatus === "has-score" &&
    currentScore !== undefined &&
    targetScore !== undefined &&
    targetScore <= currentScore
  ) {
    throw new OnboardingInputError("Maqsadli ball hozirgi balldan yuqori bo'lishi kerak.");
  }

  const entries = {
    fullName,
    subjectId,
    resultStatus,
    currentScore,
    targetScore,
    weeklyHours,
    studyDays,
    examPurpose,
    purposeOther,
    referralSource,
  };
  for (const [key, value] of Object.entries(entries)) {
    if (value !== undefined) clean[key] = value;
  }

  return Object.keys(clean).length > 0 ? clean : undefined;
}
