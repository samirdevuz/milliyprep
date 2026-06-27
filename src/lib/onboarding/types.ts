import type { CertificateSubjectId } from "./certificate";

/**
 * Shape of the onboarding answers collected across all steps.
 * Persisted to localStorage and replayed at registration time.
 */
export interface OnboardingState {
  // Step 1 — Ism
  fullName?: string;

  // Step 2 — Fan
  subjectId?: CertificateSubjectId;

  // Step 3 — Hozirgi natija
  resultStatus?: "has-score" | "not-taken" | "unknown";
  currentScore?: number;

  // Step 4 — Maqsadli ball
  targetScore?: number;

  // Step 5 — Vaqt
  weeklyHours?: number;
  studyDays?: number;

  // Step 6 — Sabab
  examPurpose?: "university" | "work" | "teacher" | "self" | "other";
  purposeOther?: string;

  // Step 7 — Referral
  referralSource?: "instagram" | "telegram" | "friend" | "teacher" | "google" | "other";

  // Legacy-compatible optional fields kept for saved old drafts.
  age?: number;
  region?: string;
  hasTakenCertificate?: "yes" | "studying" | "no";

  // Step 2 — Daraja va maqsad
  currentLevel?: "a1" | "a2" | "b1" | "b2" | "c1";
  targetLevel?: "b1" | "b2" | "c1";
  examDate?: string; // ISO yyyy-mm-dd

  // Step 3 — Ko'nikmalar
  certificateLanguage?: "english" | "russian" | "uzbek";
  skillLevels?: Partial<
    Record<"listening" | "reading" | "writing" | "speaking", "a1" | "a2" | "b1" | "b2" | "c1">
  >;
  focusSkills?: string[];

  // Legacy-compatible optional fields kept for saved old drafts.
  worries?: "fail_exam" | "time" | "money" | "confidence";
  studyFrequency?: "1-2" | "3-4" | "5+";
  preferredTime?: "morning" | "day" | "evening" | "night";

  // Legacy-compatible optional fields kept for saved old drafts.
  motivation?: string;
  studyStyle?: "yolgiz" | "guruh" | "aralash";
}

export const ONBOARDING_STORAGE_KEY = "milliyprep:onboarding:v1";

export const REGIONS = [
  { value: "toshkent-shahar", label: "Toshkent shahri" },
  { value: "toshkent-viloyati", label: "Toshkent viloyati" },
  { value: "andijon", label: "Andijon" },
  { value: "buxoro", label: "Buxoro" },
  { value: "fargona", label: "Farg'ona" },
  { value: "jizzax", label: "Jizzax" },
  { value: "xorazm", label: "Xorazm" },
  { value: "namangan", label: "Namangan" },
  { value: "navoiy", label: "Navoiy" },
  { value: "qashqadaryo", label: "Qashqadaryo" },
  { value: "qoraqalpogiston", label: "Qoraqalpog'iston" },
  { value: "samarqand", label: "Samarqand" },
  { value: "sirdaryo", label: "Sirdaryo" },
  { value: "surxondaryo", label: "Surxondaryo" },
];

export const STEPS = [
  { id: "ism", label: "Ism" },
  { id: "fan", label: "Fan" },
  { id: "hozirgi", label: "Hozirgi ball" },
  { id: "maqsad", label: "Maqsad" },
  { id: "vaqt", label: "Vaqt" },
  { id: "sabab", label: "Sabab" },
  { id: "ishonch", label: "Ishonch" },
  { id: "xulosa", label: "Profil" },
  { id: "manba", label: "Manba" },
  { id: "reja", label: "Reja" },
  { id: "timeline", label: "Yo'l xaritasi" },
  { id: "hisob", label: "Hisob" },
  { id: "tasdiq", label: "Tasdiq" },
];
