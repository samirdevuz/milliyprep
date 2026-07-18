import {
  CURRICULUM_SUBJECTS,
  curriculumSubjectById,
  type CurriculumSubjectId,
  type CurriculumSubjectKind,
} from "../../content/curriculum.ts";

export type CertificateSubjectId = CurriculumSubjectId;
export type CertificateSubjectKind = CurriculumSubjectKind;

export interface CertificateSubject {
  id: CertificateSubjectId;
  label: string;
  shortLabel: string;
  kind: CertificateSubjectKind;
  caption: string;
  assessment: string;
  availability: "live" | "planned";
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

export const CERTIFICATE_SUBJECTS: CertificateSubject[] =
  CURRICULUM_SUBJECTS.map((subject) => ({
    id: subject.id,
    label: subject.label,
    shortLabel: subject.shortLabel,
    kind: subject.kind,
    caption: subject.caption,
    assessment: subject.assessment,
    availability: subject.availability,
  }));

export const AVAILABLE_CERTIFICATE_SUBJECTS = CERTIFICATE_SUBJECTS.filter(
  (subject) => subject.availability === "live"
);

export function subjectById(id?: string): CertificateSubject | undefined {
  const subject = curriculumSubjectById(id);
  if (!subject) return undefined;
  return {
    id: subject.id,
    label: subject.label,
    shortLabel: subject.shortLabel,
    kind: subject.kind,
    caption: subject.caption,
    assessment: subject.assessment,
    availability: subject.availability,
  };
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
  const target =
    typeof targetScore === "number" ? targetScore : Math.max(71, start + 18);
  return clampScore(Math.max(start + 12, Math.min(100, target)));
}
