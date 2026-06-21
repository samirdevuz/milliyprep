"use client";

import { Calendar, GraduationCap, Languages, Layers } from "lucide-react";
import { useOnboarding } from "@/lib/onboarding/store";
import { OptionCard } from "@/components/ui/option-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface Props {
  errors: Partial<Record<string, string>>;
}

const EXAM_OPTIONS = [
  {
    value: "dtm" as const,
    icon: <GraduationCap strokeWidth={2.25} />,
    tone: "brand" as const,
    title: "DTM",
    description: "Universitetga kirish imtihoni (189 ballik tizim).",
  },
  {
    value: "milliy-sertifikat" as const,
    icon: <Languages strokeWidth={2.25} />,
    tone: "accent" as const,
    title: "Milliy sertifikat",
    description: "Til imtihoni (CEFR: B1, B2, C1 darajalari).",
  },
  {
    value: "ikkalasi" as const,
    icon: <Layers strokeWidth={2.25} />,
    tone: "violet" as const,
    title: "DTM va Milliy sertifikat",
    description: "Ikki yo'nalishda tayyorgarlik.",
  },
];

const CEFR_LEVELS = [
  { value: "3", label: "B1" },
  { value: "4", label: "B2" },
  { value: "5", label: "C1" },
];

export function StepGoal({ errors }: Props) {
  const { state, set } = useOnboarding();
  const isMilliy = state.examType === "milliy-sertifikat";

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-ink-900">Maqsadingiz</h2>
        <p className="mt-1 text-sm text-ink-600">
          Qaysi imtihonga tayyorgarlik ko&apos;rasiz?
        </p>
      </header>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-800">Imtihon turi</p>
        <div className="grid gap-3">
          {EXAM_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              selected={state.examType === opt.value}
              onSelect={() => set("examType", opt.value)}
              icon={opt.icon}
              tone={opt.tone}
              title={opt.title}
              description={opt.description}
            />
          ))}
        </div>
        {errors.examType && (
          <p className="mt-2 text-xs text-rose-600">{errors.examType}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {isMilliy ? (
          <Select
            label="Maqsadli daraja"
            name="targetScore"
            placeholder="Darajani tanlang"
            options={CEFR_LEVELS}
            value={state.targetScore ? String(state.targetScore) : ""}
            onChange={(e) => set("targetScore", Number(e.target.value))}
            error={errors.targetScore}
          />
        ) : (
          <Input
            label="Maqsadli ball"
            name="targetScore"
            type="number"
            min={50}
            max={189}
            placeholder="Masalan, 175"
            hint="DTM 189 ballik tizimda baholanadi."
            value={state.targetScore ?? ""}
            onChange={(e) =>
              set(
                "targetScore",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            error={errors.targetScore}
          />
        )}
        <Input
          label="Imtihon sanasi"
          name="examDate"
          type="date"
          leadingIcon={<Calendar className="h-4 w-4" />}
          value={state.examDate ?? ""}
          onChange={(e) => set("examDate", e.target.value)}
          error={errors.examDate}
        />
      </div>
    </div>
  );
}
