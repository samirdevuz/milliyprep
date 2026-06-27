"use client";

import { Coffee, Moon, Sun, Sunset, type LucideIcon } from "lucide-react";
import { useOnboarding } from "@/lib/onboarding/store";
import { OptionCard } from "@/components/ui/option-card";
import { Input } from "@/components/ui/input";

interface Props {
  errors: Partial<Record<string, string>>;
}

const TIME_OF_DAY: {
  value: "morning" | "day" | "evening" | "night";
  icon: LucideIcon;
  tone: "amber" | "brand" | "violet" | "sky";
  title: string;
  description: string;
}[] = [
  {
    value: "morning",
    icon: Coffee,
    tone: "amber",
    title: "Ertalab",
    description: "06:00 — 11:00",
  },
  {
    value: "day",
    icon: Sun,
    tone: "brand",
    title: "Kunduzi",
    description: "11:00 — 17:00",
  },
  {
    value: "evening",
    icon: Sunset,
    tone: "violet",
    title: "Kechqurun",
    description: "17:00 — 22:00",
  },
  {
    value: "night",
    icon: Moon,
    tone: "sky",
    title: "Tunda",
    description: "22:00 — 02:00",
  },
];

const FREQUENCY: {
  value: "1-2" | "3-4" | "5+";
  title: string;
  description: string;
  tone: "brand" | "accent" | "violet";
}[] = [
  {
    value: "1-2",
    title: "Haftada 1-2 marta",
    description: "Sekinroq, lekin barqaror reja.",
    tone: "accent",
  },
  {
    value: "3-4",
    title: "Haftada 3-4 marta",
    description: "Eng muvozanatli tayyorgarlik ritmi.",
    tone: "brand",
  },
  {
    value: "5+",
    title: "Haftada 5+ marta",
    description: "Tez natija uchun intensiv rejim.",
    tone: "violet",
  },
];

export function StepTime({ errors }: Props) {
  const { state, set } = useOnboarding();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-ink-900">Vaqtingiz</h2>
        <p className="mt-1 text-sm text-ink-600">
          Reja real bo&apos;lishi uchun qancha vaqt ajrata olishingizni belgilang.
        </p>
      </header>

      <div>
        <Input
          label="Haftada necha soat?"
          name="weeklyHours"
          type="number"
          min={1}
          max={60}
          placeholder="Masalan, 10"
          hint="Yaxshi natija uchun haftasiga kamida 5–7 soat tavsiya etiladi."
          value={state.weeklyHours ?? ""}
          onChange={(e) =>
            set(
              "weeklyHours",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          error={errors.weeklyHours}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-ink-800">
          Qancha tez-tez o&apos;qishni xohlaysiz?
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {FREQUENCY.map(({ value, title, description, tone }) => (
            <OptionCard
              key={value}
              selected={state.studyFrequency === value}
              onSelect={() => set("studyFrequency", value)}
              icon={<Coffee strokeWidth={2.25} />}
              tone={tone}
              title={title}
              description={description}
              showCheck={false}
            />
          ))}
        </div>
        {errors.studyFrequency && (
          <p className="mt-2 text-xs text-rose-600">{errors.studyFrequency}</p>
        )}
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-ink-800">
          Qaysi vaqtda mashq qilish qulayroq?
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {TIME_OF_DAY.map(({ value, icon: Icon, tone, title, description }) => (
            <OptionCard
              key={value}
              selected={state.preferredTime === value}
              onSelect={() => set("preferredTime", value)}
              icon={<Icon strokeWidth={2.25} />}
              tone={tone}
              title={title}
              description={description}
              showCheck={false}
            />
          ))}
        </div>
        {errors.preferredTime && (
          <p className="mt-2 text-xs text-rose-600">{errors.preferredTime}</p>
        )}
      </div>
    </div>
  );
}
