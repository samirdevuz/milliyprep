import {
  MATH_MOCK_BLUEPRINT,
  MATH_MOCK_CONTENT_VERSION,
  MATH_MOCK_QUESTIONS,
} from "./math-mock.ts";
import type { Question } from "@/lib/practice/types";

export type CurriculumSubjectId =
  | "english"
  | "russian"
  | "german"
  | "french"
  | "arabic"
  | "turkish"
  | "uzbek"
  | "literature"
  | "math"
  | "physics"
  | "chemistry"
  | "biology"
  | "history"
  | "geography"
  | "law";

export type CurriculumAvailability = "live" | "planned";
export type CurriculumSubjectKind = "language" | "general";

export interface CurriculumSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  version: string;
  retrievedAt: string;
}

export interface CurriculumSubject {
  id: CurriculumSubjectId;
  label: string;
  shortLabel: string;
  kind: CurriculumSubjectKind;
  caption: string;
  assessment: string;
  availability: CurriculumAvailability;
  position: number;
  sourceIds: string[];
}

export interface CurriculumTopic {
  id: string;
  subjectId: CurriculumSubjectId;
  name: string;
  description: string;
  level: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  examShare: number;
  position: number;
  sourceId: string;
}

export type CurriculumQuestion = Question;

export const CURRICULUM_VERSION = MATH_MOCK_CONTENT_VERSION;

export const CURRICULUM_SOURCES: CurriculumSource[] = [
  {
    id: "uzbmb-math-spec-2024",
    title: "Matematika fanidan Milliy test tizimi spetsifikatsiyasi",
    publisher: "Bilim va malakalarni baholash agentligi",
    url: "https://www.uzbmb.uz/upload/file/pdf/mtt/spetsifikatsiya/Matematika_2024.pdf",
    version: "2024",
    retrievedAt: "2026-07-13",
  },
  {
    id: "uzbmb-math-sample",
    title: "Matematika fanidan namunaviy test topshiriqlari",
    publisher: "Bilim va malakalarni baholash agentligi",
    url: "https://www.uzbmb.uz/upload/file/pdf/milliytest/matem.pdf",
    version: "official-sample",
    retrievedAt: "2026-07-13",
  },
];

const plannedSubjects: Array<
  Omit<CurriculumSubject, "availability" | "sourceIds">
> = [
  { id: "uzbek", label: "Ona tili va adabiyot", shortLabel: "Ona tili", kind: "general", caption: "Imlo, uslub, matn va adabiyot tahlili", assessment: "100 ballik Milliy Sertifikat natijasi", position: 2 },
  { id: "physics", label: "Fizika", shortLabel: "Fizika", kind: "general", caption: "Nazariya, formulalar va amaliy masalalar", assessment: "100 ballik Milliy Sertifikat natijasi", position: 3 },
  { id: "chemistry", label: "Kimyo", shortLabel: "Kimyo", kind: "general", caption: "Reaksiyalar, hisoblash va nazariya", assessment: "100 ballik Milliy Sertifikat natijasi", position: 4 },
  { id: "biology", label: "Biologiya", shortLabel: "Biologiya", kind: "general", caption: "Botanika, zoologiya va odam anatomiyasi", assessment: "100 ballik Milliy Sertifikat natijasi", position: 5 },
  { id: "history", label: "Tarix", shortLabel: "Tarix", kind: "general", caption: "O‘zbekiston va jahon tarixi", assessment: "100 ballik Milliy Sertifikat natijasi", position: 6 },
  { id: "geography", label: "Geografiya", shortLabel: "Geografiya", kind: "general", caption: "Tabiiy va iqtisodiy geografiya", assessment: "100 ballik Milliy Sertifikat natijasi", position: 7 },
  { id: "law", label: "Huquq", shortLabel: "Huquq", kind: "general", caption: "Konstitutsiya, huquq tarmoqlari va amaliy holatlar", assessment: "100 ballik Milliy Sertifikat natijasi", position: 8 },
  { id: "english", label: "Ingliz tili", shortLabel: "Ingliz", kind: "language", caption: "Listening, Reading, Writing va Speaking", assessment: "CEFR ko‘nikmalari bo‘yicha milliy imtihon", position: 9 },
  { id: "russian", label: "Rus tili", shortLabel: "Rus", kind: "language", caption: "Til ko‘nikmalari va grammatik aniqlik", assessment: "CEFR ko‘nikmalari bo‘yicha milliy imtihon", position: 10 },
  { id: "german", label: "Nemis tili", shortLabel: "Nemis", kind: "language", caption: "CEFR formatidagi til ko‘nikmalari", assessment: "CEFR ko‘nikmalari bo‘yicha milliy imtihon", position: 11 },
  { id: "french", label: "Fransuz tili", shortLabel: "Fransuz", kind: "language", caption: "CEFR formatidagi til ko‘nikmalari", assessment: "CEFR ko‘nikmalari bo‘yicha milliy imtihon", position: 12 },
  { id: "arabic", label: "Arab tili", shortLabel: "Arab", kind: "language", caption: "Matn, lug‘at va nutq ko‘nikmalari", assessment: "CEFR ko‘nikmalari bo‘yicha milliy imtihon", position: 13 },
  { id: "turkish", label: "Turk tili", shortLabel: "Turk", kind: "language", caption: "CEFR formatidagi til ko‘nikmalari", assessment: "CEFR ko‘nikmalari bo‘yicha milliy imtihon", position: 14 },
  { id: "literature", label: "Adabiyot", shortLabel: "Adabiyot", kind: "general", caption: "Asar tahlili, nazariya va mualliflar", assessment: "100 ballik Milliy Sertifikat natijasi", position: 15 },
];

export const CURRICULUM_SUBJECTS: CurriculumSubject[] = [
  {
    id: "math",
    label: "Matematika",
    shortLabel: "Matematika",
    kind: "general",
    caption: "45 topshiriq, 150 daqiqa va 7 rasmiy bo‘lim",
    assessment: "100 xom ballik to‘liq sinov; sertifikat natijasi Rash modeli bilan hisoblanadi",
    availability: "live",
    position: 1,
    sourceIds: ["uzbmb-math-spec-2024", "uzbmb-math-sample"],
  },
  ...plannedSubjects.map((subject) => ({
    ...subject,
    availability: "planned" as const,
    sourceIds: [],
  })),
];

const topicDescriptions: Record<string, string> = {
  "math-numbers": "Natural, butun, ratsional va haqiqiy sonlar hamda ular ustida amallar.",
  "math-algebra-transformations": "Daraja, ildiz, trigonometriya, logarifm, progressiya va ifodalarni almashtirish.",
  "math-equations-inequalities": "Tenglama, sistema va turli ko‘rinishdagi tengsizliklarni yechish.",
  "math-functions": "Funksiya xossalari, grafiklar, kompozitsiya va ekstremumlar.",
  "math-analysis": "Hosila, boshlang‘ich funksiya, integral va ularning tatbiqlari.",
  "math-geometry": "Planimetriya, stereometriya, koordinatalar va vektorlar.",
  "math-probability-data": "To‘plam, statistika, kombinatorika, ehtimollik va modellashtirish.",
};

const examShares: Record<string, number> = {
  "math-numbers": 4,
  "math-algebra-transformations": 20,
  "math-equations-inequalities": 18,
  "math-functions": 7,
  "math-analysis": 11,
  "math-geometry": 33,
  "math-probability-data": 7,
};

export const CURRICULUM_TOPICS: CurriculumTopic[] = MATH_MOCK_BLUEPRINT.map(
  (section, index) => ({
    id: section.topicId,
    subjectId: "math",
    name: section.name,
    description: topicDescriptions[section.topicId],
    level: "medium",
    estimatedMinutes: Math.max(10, Math.round(section.rawPoints * 1.5)),
    examShare: examShares[section.topicId],
    position: index + 1,
    sourceId: "uzbmb-math-spec-2024",
  })
);

export const CURRICULUM_QUESTIONS: CurriculumQuestion[] = MATH_MOCK_QUESTIONS;

export const LIVE_CURRICULUM_SUBJECTS = CURRICULUM_SUBJECTS.filter(
  (subject) => subject.availability === "live"
);

export function curriculumSubjectById(id?: string) {
  return CURRICULUM_SUBJECTS.find((subject) => subject.id === id);
}

export function curriculumSourceById(id?: string) {
  return CURRICULUM_SOURCES.find((source) => source.id === id);
}
