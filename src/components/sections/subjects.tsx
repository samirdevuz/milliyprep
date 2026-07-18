import {
  Atom,
  BookText,
  Calculator,
  FlaskConical,
  Globe2,
  Languages,
  Leaf,
  Scroll,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { IconChip } from "@/components/ui/icon-chip";
import { cn } from "@/lib/cn";
import {
  CURRICULUM_SUBJECTS,
  type CurriculumSubjectId,
} from "@/content/curriculum";

interface Subject {
  id: CurriculumSubjectId;
  name: string;
  icon: LucideIcon;
  tone: "brand" | "accent" | "amber" | "rose" | "violet" | "sky" | "emerald";
  available: boolean;
}

const SUBJECT_VISUALS: Partial<
  Record<
    CurriculumSubjectId,
    Pick<Subject, "icon" | "tone">
  >
> = {
  math: { icon: Calculator, tone: "brand" },
  physics: { icon: Atom, tone: "violet" },
  chemistry: { icon: FlaskConical, tone: "rose" },
  biology: { icon: Leaf, tone: "accent" },
  uzbek: { icon: BookText, tone: "sky" },
  history: { icon: Scroll, tone: "amber" },
  geography: { icon: Globe2, tone: "emerald" },
  english: { icon: Languages, tone: "brand" },
};

const SUBJECTS: Subject[] = CURRICULUM_SUBJECTS.flatMap((subject) => {
  const visual = SUBJECT_VISUALS[subject.id];
  return visual
    ? [
        {
          id: subject.id,
          name: subject.label,
          icon: visual.icon,
          tone: visual.tone,
          available: subject.availability === "live",
        },
      ]
    : [];
});

export function Subjects() {
  return (
    <section id="fanlar" className="py-20 lg:py-24">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="pill">Fanlar</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Bizda o&apos;rgansa bo&apos;ladigan <span className="accent-word text-[1.1em]">fanlar</span>
            </h2>
            <p className="mt-3 text-ink-600">
              Hozircha matematikadan to&apos;liq tayyorgarlik mavjud. Qolgan
              fanlarni bosqichma-bosqich qo&apos;shib boramiz.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SUBJECTS.map((s, i) => (
            <Reveal key={s.name} delay={(i % 4) * 60}>
              <div
                className={cn(
                  "group relative flex h-full flex-col items-center rounded-2xl border p-6 text-center transition-all",
                  s.available
                    ? "border-brand-200 bg-white shadow-soft hover:-translate-y-1 hover:shadow-ring"
                    : "border-ink-100 bg-ink-50/50"
                )}
              >
                <IconChip tone={s.tone} size="md" className={cn(!s.available && "opacity-60")}>
                  <s.icon strokeWidth={2.25} />
                </IconChip>
                <p
                  className={cn(
                    "mt-4 text-sm font-semibold",
                    s.available ? "text-ink-900" : "text-ink-500"
                  )}
                >
                  {s.name}
                </p>
                <span
                  className={cn(
                    "mt-2 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                    s.available
                      ? "bg-accent-100 text-accent-700"
                      : "bg-ink-100 text-ink-500"
                  )}
                >
                  {s.available ? "Mavjud" : "Tez orada"}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
