"use client";

import { BookOpen, Headphones, Mic, PenLine, type LucideIcon } from "lucide-react";
import { useOnboarding } from "@/lib/onboarding/store";
import { OptionCard } from "@/components/ui/option-card";

interface Props {
  errors: Partial<Record<string, string>>;
}

type SkillId = "listening" | "reading" | "writing" | "speaking";
type Level = "a1" | "a2" | "b1" | "b2" | "c1";

const LEVELS: Level[] = ["a1", "a2", "b1", "b2", "c1"];

const SKILLS: {
  id: SkillId;
  icon: LucideIcon;
  label: string;
  tone: "brand" | "accent" | "amber" | "rose";
}[] = [
  { id: "listening", icon: Headphones, label: "Tinglab tushunish", tone: "brand" },
  { id: "reading", icon: BookOpen, label: "O'qib tushunish", tone: "accent" },
  { id: "writing", icon: PenLine, label: "Yozish", tone: "amber" },
  { id: "speaking", icon: Mic, label: "Gapirish", tone: "rose" },
];

export function StepLevel({ errors }: Props) {
  const { state, patch } = useOnboarding();

  const updateSkill = (skill: SkillId, level: Level) => {
    patch({
      skillLevels: {
        ...(state.skillLevels ?? {}),
        [skill]: level,
      },
    });
  };

  const toggleFocus = (skill: SkillId) => {
    const cur = state.focusSkills ?? [];
    patch({
      focusSkills: cur.includes(skill)
        ? cur.filter((item) => item !== skill)
        : [...cur, skill],
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-ink-900">
          Ko&apos;nikmalaringizni baholang
        </h2>
        <p className="mt-1 text-sm text-ink-600">
          Har bir bo&apos;lim uchun taxminiy CEFR darajani tanlang. Bilmasangiz,
          hozirgi umumiy darajangizga yaqin variantni belgilang.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl border border-ink-100 bg-ink-50/60 p-4">
        {SKILLS.map(({ id, icon: Icon, label }) => (
          <div key={id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-brand-600" />
              <p className="text-sm font-semibold text-ink-900">{label}</p>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {LEVELS.map((level) => {
                const selected = state.skillLevels?.[id] === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateSkill(id, level)}
                    aria-pressed={selected}
                    className={`rounded-xl border px-2 py-2 text-sm font-bold uppercase transition ${
                      selected
                        ? "border-brand-500 bg-brand-500 text-white shadow-soft"
                        : "border-ink-200 bg-white text-ink-600 hover:border-brand-300"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {errors.skillLevels && (
        <p className="text-xs text-rose-600">{errors.skillLevels}</p>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-ink-800">
          Qaysi ko&apos;nikmaga ko&apos;proq e&apos;tibor bermoqchisiz?
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {SKILLS.map(({ id, icon: Icon, tone, label }) => (
            <OptionCard
              key={id}
              selected={(state.focusSkills ?? []).includes(id)}
              onSelect={() => toggleFocus(id)}
              icon={<Icon strokeWidth={2.25} />}
              tone={tone}
              title={label}
              showCheck
              multi
            />
          ))}
        </div>
        {errors.focusSkills && (
          <p className="mt-2 text-xs text-rose-600">{errors.focusSkills}</p>
        )}
      </div>
    </div>
  );
}
