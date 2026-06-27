export type CertificateSubjectId =
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

export type CertificateSubjectKind = "language" | "general";

export interface CertificateSubject {
  id: CertificateSubjectId;
  label: string;
  shortLabel: string;
  kind: CertificateSubjectKind;
  caption: string;
  assessment: string;
}

export interface GradeBand {
  label: string;
  min: number;
  max: number;
  caption: string;
}

export const GRADE_BANDS: GradeBand[] = [
  { label: "A+", min: 86, max: 100, caption: "juda yuqori natija" },
  { label: "A", min: 71, max: 85, caption: "yuqori natija" },
  { label: "B+", min: 56, max: 70, caption: "barqaror natija" },
  { label: "B", min: 46, max: 55, caption: "minimal kuchli zona" },
  { label: "C", min: 31, max: 45, caption: "sertifikat chegarasi" },
  { label: "Tayyor emas", min: 0, max: 30, caption: "asosiy tayyorgarlik kerak" },
];

export const CERTIFICATE_SUBJECTS: CertificateSubject[] = [
  {
    id: "english",
    label: "Ingliz tili",
    shortLabel: "Ingliz",
    kind: "language",
    caption: "Listening, Reading, Writing va Speaking",
    assessment: "CEFR ko'nikmalari va 100 ballik umumiy natija",
  },
  {
    id: "russian",
    label: "Rus tili",
    shortLabel: "Rus",
    kind: "language",
    caption: "Til ko'nikmalari va grammatik aniqlik",
    assessment: "CEFR ko'nikmalari va 100 ballik umumiy natija",
  },
  {
    id: "german",
    label: "Nemis tili",
    shortLabel: "Nemis",
    kind: "language",
    caption: "CEFR formatidagi til ko'nikmalari",
    assessment: "CEFR ko'nikmalari va 100 ballik umumiy natija",
  },
  {
    id: "french",
    label: "Fransuz tili",
    shortLabel: "Fransuz",
    kind: "language",
    caption: "CEFR formatidagi til ko'nikmalari",
    assessment: "CEFR ko'nikmalari va 100 ballik umumiy natija",
  },
  {
    id: "arabic",
    label: "Arab tili",
    shortLabel: "Arab",
    kind: "language",
    caption: "Matn, lug'at va nutq ko'nikmalari",
    assessment: "CEFR ko'nikmalari va 100 ballik umumiy natija",
  },
  {
    id: "turkish",
    label: "Turk tili",
    shortLabel: "Turk",
    kind: "language",
    caption: "CEFR formatidagi til ko'nikmalari",
    assessment: "CEFR ko'nikmalari va 100 ballik umumiy natija",
  },
  {
    id: "uzbek",
    label: "Ona tili",
    shortLabel: "Ona tili",
    kind: "general",
    caption: "Imlo, uslub, matn va til qoidalari",
    assessment: "100 ballik fan natijasi",
  },
  {
    id: "literature",
    label: "Adabiyot",
    shortLabel: "Adabiyot",
    kind: "general",
    caption: "Asar tahlili, nazariya va mualliflar",
    assessment: "100 ballik fan natijasi",
  },
  {
    id: "math",
    label: "Matematika",
    shortLabel: "Matematika",
    kind: "general",
    caption: "Algebra, geometriya va mantiqiy masalalar",
    assessment: "100 ballik fan natijasi",
  },
  {
    id: "physics",
    label: "Fizika",
    shortLabel: "Fizika",
    kind: "general",
    caption: "Nazariya, formulalar va amaliy masalalar",
    assessment: "100 ballik fan natijasi",
  },
  {
    id: "chemistry",
    label: "Kimyo",
    shortLabel: "Kimyo",
    kind: "general",
    caption: "Reaksiyalar, hisoblash va nazariya",
    assessment: "100 ballik fan natijasi",
  },
  {
    id: "biology",
    label: "Biologiya",
    shortLabel: "Biologiya",
    kind: "general",
    caption: "Botanika, zoologiya, odam anatomiyasi",
    assessment: "100 ballik fan natijasi",
  },
  {
    id: "history",
    label: "Tarix",
    shortLabel: "Tarix",
    kind: "general",
    caption: "O'zbekiston va jahon tarixi",
    assessment: "100 ballik fan natijasi",
  },
  {
    id: "geography",
    label: "Geografiya",
    shortLabel: "Geografiya",
    kind: "general",
    caption: "Tabiiy va iqtisodiy geografiya",
    assessment: "100 ballik fan natijasi",
  },
  {
    id: "law",
    label: "Huquq",
    shortLabel: "Huquq",
    kind: "general",
    caption: "Konstitutsiya, huquq tarmoqlari va amaliy holatlar",
    assessment: "100 ballik fan natijasi",
  },
];

export function subjectById(id?: string): CertificateSubject | undefined {
  return CERTIFICATE_SUBJECTS.find((subject) => subject.id === id);
}

export function gradeForScore(score?: number): GradeBand | undefined {
  if (typeof score !== "number" || Number.isNaN(score)) return undefined;
  return GRADE_BANDS.find((band) => score >= band.min && score <= band.max);
}

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function projectedScore(currentScore?: number, targetScore?: number): number {
  const start = typeof currentScore === "number" ? currentScore : 38;
  const target = typeof targetScore === "number" ? targetScore : Math.max(71, start + 18);
  return clampScore(Math.max(start + 12, Math.min(100, target)));
}
