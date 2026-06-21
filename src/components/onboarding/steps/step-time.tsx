"use client";

import { Coffee, Moon, Sun, Sunset, type LucideIcon } from "lucide-react";
import { useOnboarding } from "@/lib/onboarding/store";
import { OptionCard } from "@/components/ui/option-card";
import { Input } from "@/components/ui/input";

interface Props {
  errors: Partial<Record<string, string>>;
}

const TIME_OF_DAY: {
  value: "ertalab" | "kunduzi" | "kechqurun" | "tunda";
  icon: LucideIcon;
  tone: "amber" | "brand" | "violet" | "sky";
  title: string;
  description: string;
}[] = [
  {
    value: "ertalab",
    icon: Coffee,
    tone: "amber",
    title: "Ertalab",
    description: "06:00 — 11:00",
  },
  {
    value: "kunduzi",
    icon: Sun,
    tone: "brand",
    title: "Kunduzi",
    description: "11:00 — 17:00",
  },
  {
    value: "kechqurun",
    icon: Sunset,
    tone: "violet",
    title: "Kechqurun",
    description: "17:00 — 22:00",
  },
  {
    value: "tunda",
    icon: Moon,
    tone: "sky",
    title: "Tunda",
    description: "22:00 — 02:00",
  },
];

export function StepTime({ errors }: Props) {
  const { state, set } = useOnboarding();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-ink-900">Vaqtingiz</h2>
        <p className="mt-1 text-sm text-ink-600">
          Haftada qancha vaqt ajrata olasiz?
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
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
        <Input
          label="Haftada necha kun?"
          name="studyDays"
          type="number"
          min={1}
          max={7}
          placeholder="1–7"
          hint="Eng kamida 4 kun tavsiya etiladi."
          value={state.studyDays ?? ""}
          onChange={(e) =>
            set(
              "studyDays",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          error={errors.studyDays}
        />
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
