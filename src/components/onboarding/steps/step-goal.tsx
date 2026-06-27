"use client";

import { Calendar, Languages, Target } from "lucide-react";
import { useOnboarding } from "@/lib/onboarding/store";
import { OptionCard } from "@/components/ui/option-card";
import { Select } from "@/components/ui/select";

interface Props {
  errors: Partial<Record<string, string>>;
}

const CEFR_LEVELS = [
  { value: "a1", label: "A1" },
  { value: "a2", label: "A2" },
  { value: "b1", label: "B1" },
  { value: "b2", label: "B2" },
  { value: "c1", label: "C1" },
];

const TARGET_LEVELS = [
  { value: "b1", label: "B1" },
  { value: "b2", label: "B2" },
  { value: "c1", label: "C1" },
];

export function StepGoal({ errors }: Props) {
  const { state, set } = useOnboarding();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-ink-900">
          Daraja va maqsadingiz
        </h2>
        <p className="mt-1 text-sm text-ink-600">
          Hozirgi darajangizni taxmin qiling va qaysi CEFR natijaga
          erishmoqchi ekaningizni belgilang.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Hozirgi darajangiz"
          name="currentLevel"
          placeholder="Taxminiy darajani tanlang"
          leadingIcon={<Languages className="h-4 w-4" />}
          options={CEFR_LEVELS}
          value={state.currentLevel ?? ""}
          onChange={(e) =>
            set("currentLevel", e.target.value as typeof state.currentLevel)
          }
          error={errors.currentLevel}
        />
        <Select
          label="Maqsadli daraja"
          name="targetLevel"
          placeholder="Maqsadni tanlang"
          leadingIcon={<Target className="h-4 w-4" />}
          options={TARGET_LEVELS}
          value={state.targetLevel ?? ""}
          onChange={(e) =>
            set("targetLevel", e.target.value as typeof state.targetLevel)
          }
          error={errors.targetLevel}
        />
        <Select
          label="Imtihon tili"
          name="certificateLanguage"
          placeholder="Tilni tanlang"
          options={[
            { value: "english", label: "Ingliz tili" },
            { value: "russian", label: "Rus tili" },
            { value: "uzbek", label: "Ona tili" },
          ]}
          value={state.certificateLanguage ?? ""}
          onChange={(e) =>
            set(
              "certificateLanguage",
              e.target.value as typeof state.certificateLanguage
            )
          }
          error={errors.certificateLanguage}
        />
        <div className="sm:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-ink-800">
            Imtihon sanasi
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              name="examDate"
              type="date"
              className="w-full rounded-xl border border-ink-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              value={state.examDate ?? ""}
              onChange={(e) => set("examDate", e.target.value || undefined)}
            />
          </div>
          <button
            type="button"
            onClick={() => set("examDate", undefined)}
            className="mt-2 text-xs font-semibold text-brand-600 hover:underline"
          >
            Hali aniq emas
          </button>
          {errors.examDate && (
            <p className="mt-1.5 text-xs text-rose-600">{errors.examDate}</p>
          )}
        </div>
      </div>

      <OptionCard
        selected
        onSelect={() => undefined}
        icon={<Languages strokeWidth={2.25} />}
        tone="accent"
        title="Milliy Sertifikat"
        description="Rejangiz CEFR B1, B2 yoki C1 natijasiga moslashtiriladi."
        showCheck={false}
      />
    </div>
  );
}
