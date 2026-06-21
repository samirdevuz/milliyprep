/**
 * Shape of the onboarding answers collected across all steps.
 * Persisted to localStorage and replayed at registration time.
 */
export interface OnboardingState {
  // Step 1 — Asosiy ma'lumotlar
  fullName?: string;
  age?: number;
  region?: string;

  // Step 2 — Maqsad
  examType?: "dtm" | "milliy-sertifikat" | "ikkalasi";
  targetScore?: number; // DTM: 0-189, Milliy: A1..C2 (encoded 1..6)
  examDate?: string; // ISO yyyy-mm-dd

  // Step 3 — Daraja
  currentLevel?: "boshlovchi" | "orta" | "yuqori";
  diagnosticScore?: number;
  subjects?: string[]; // selected subject ids

  // Step 4 — Qiyinchiliklar
  weakAreas?: string[];

  // Step 5 — Vaqt
  weeklyHours?: number;
  preferredTime?: "ertalab" | "kunduzi" | "kechqurun" | "tunda";
  studyDays?: number; // 1..7

  // Step 6 — Psixologik profil
  motivation?: string;
  studyStyle?: "yolgiz" | "guruh" | "aralash";
  obstacle?: string;
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
  { id: "asosiy", label: "Asosiy ma'lumotlar" },
  { id: "maqsad", label: "Maqsad" },
  { id: "daraja", label: "Daraja" },
  { id: "qiyinchiliklar", label: "Qiyinchiliklar" },
  { id: "vaqt", label: "Vaqt" },
  { id: "profil", label: "Psixologik profil" },
];
