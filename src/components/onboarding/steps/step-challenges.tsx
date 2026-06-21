"use client";

import {
  AlarmClock,
  Brain,
  Compass,
  HeartPulse,
  Library,
  Mic,
  PenLine,
  Type,
  type LucideIcon,
} from "lucide-react";
import { useOnboarding } from "@/lib/onboarding/store";
import { OptionCard } from "@/components/ui/option-card";

interface Props {
  errors: Partial<Record<string, string>>;
}

const WEAK_AREAS: {
  id: string;
  icon: LucideIcon;
  tone: "brand" | "accent" | "amber" | "rose" | "violet" | "sky" | "emerald";
  label: string;
}[] = [
  {
    id: "format-bilmaslik",
    icon: Compass,
    tone: "brand",
    label: "Imtihon formatini yaxshi bilmayman",
  },
  { id: "vaqt", icon: AlarmClock, tone: "rose", label: "Vaqtni boshqarish qiyin" },
  { id: "konsentratsiya", icon: Brain, tone: "violet", label: "Diqqatim tarqaladi" },
  {
    id: "stress",
    icon: HeartPulse,
    tone: "rose",
    label: "Imtihon kuni asabim buziladi",
  },
  {
    id: "mavzular",
    icon: Library,
    tone: "amber",
    label: "Ko'p mavzu o'rganmaganman",
  },
  {
    id: "yozish",
    icon: PenLine,
    tone: "sky",
    label: "Yozma topshiriq qiyin keladi",
  },
  { id: "ogzaki", icon: Mic, tone: "accent", label: "Og'zaki suhbat qiyin keladi" },
  { id: "lugat", icon: Type, tone: "emerald", label: "Lug'at boyligim kam" },
];

export function StepChallenges({ errors }: Props) {
  const { state, set } = useOnboarding();

  const toggle = (id: string) => {
    const cur = state.weakAreas ?? [];
    set(
      "weakAreas",
      cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id]
    );
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-ink-900">
          Qiyinchiliklaringiz
        </h2>
        <p className="mt-1 text-sm text-ink-600">
          Bir nechtasini tanlashingiz mumkin.
        </p>
      </header>

      <div className="grid gap-2 sm:grid-cols-2">
        {WEAK_AREAS.map(({ id, icon: Icon, tone, label }) => {
          const selected = (state.weakAreas ?? []).includes(id);
          return (
            <OptionCard
              key={id}
              selected={selected}
              onSelect={() => toggle(id)}
              icon={<Icon strokeWidth={2.25} />}
              tone={tone}
              title={label}
              showCheck
              multi
            />
          );
        })}
      </div>
      {errors.weakAreas && (
        <p className="text-xs text-rose-600">{errors.weakAreas}</p>
      )}

      <div className="rounded-xl bg-accent-50 p-4 text-xs text-accent-800">
        <p className="font-semibold">Eslatma</p>
        <p className="mt-1 text-accent-700">
          Tanlovingiz reja tuzilishida hisobga olinadi. Masalan, agar
          &quot;Vaqtni boshqarish qiyin&quot;ni tanlasangiz, mocklarda timer
          bilan trening ko&apos;proq qo&apos;shiladi.
        </p>
      </div>
    </div>
  );
}
