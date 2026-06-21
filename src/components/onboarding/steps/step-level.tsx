"use client";

import {
  Atom,
  BookText,
  Calculator,
  FlaskConical,
  Gavel,
  Globe2,
  Languages,
  Leaf,
  Scroll,
  Sprout,
  TreePine,
  TreeDeciduous,
  type LucideIcon,
} from "lucide-react";
import { useOnboarding } from "@/lib/onboarding/store";
import { OptionCard } from "@/components/ui/option-card";
import { Input } from "@/components/ui/input";

interface Props {
  errors: Partial<Record<string, string>>;
}

const LEVEL_OPTIONS: {
  value: "boshlovchi" | "orta" | "yuqori";
  icon: LucideIcon;
  tone: "brand" | "accent" | "violet";
  title: string;
  description: string;
}[] = [
  {
    value: "boshlovchi",
    icon: Sprout,
    tone: "accent",
    title: "Boshlovchi",
    description: "Asosiy mavzularni endi o'rganyapman.",
  },
  {
    value: "orta",
    icon: TreeDeciduous,
    tone: "brand",
    title: "O'rtacha",
    description: "Asoslarni bilaman, lekin amaliyot kerak.",
  },
  {
    value: "yuqori",
    icon: TreePine,
    tone: "violet",
    title: "Yuqori",
    description: "Mavzularni bilaman, ballimni oshirmoqchiman.",
  },
];

const SUBJECTS: {
  id: string;
  icon: LucideIcon;
  tone: "brand" | "accent" | "amber" | "rose" | "violet" | "sky" | "emerald";
  label: string;
}[] = [
  { id: "matematika", icon: Calculator, tone: "brand", label: "Matematika" },
  { id: "fizika", icon: Atom, tone: "violet", label: "Fizika" },
  { id: "kimyo", icon: FlaskConical, tone: "rose", label: "Kimyo" },
  { id: "biologiya", icon: Leaf, tone: "accent", label: "Biologiya" },
  { id: "tarix", icon: Scroll, tone: "amber", label: "Tarix" },
  { id: "geografiya", icon: Globe2, tone: "emerald", label: "Geografiya" },
  { id: "ona-tili", icon: BookText, tone: "sky", label: "Ona tili va adabiyot" },
  { id: "ingliz", icon: Languages, tone: "brand", label: "Ingliz tili" },
  { id: "rus", icon: Languages, tone: "rose", label: "Rus tili" },
  { id: "huquq", icon: Gavel, tone: "violet", label: "Huquq" },
];

export function StepLevel({ errors }: Props) {
  const { state, set } = useOnboarding();

  const toggleSubject = (id: string) => {
    const cur = state.subjects ?? [];
    set(
      "subjects",
      cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id]
    );
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-ink-900">
          Hozirgi darajangiz
        </h2>
        <p className="mt-1 text-sm text-ink-600">
          Aniq bilmasangiz, &quot;O&apos;rtacha&quot;ni tanlang.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {LEVEL_OPTIONS.map(({ value, icon: Icon, tone, title, description }) => (
          <OptionCard
            key={value}
            selected={state.currentLevel === value}
            onSelect={() => set("currentLevel", value)}
            icon={<Icon strokeWidth={2.25} />}
            tone={tone}
            title={title}
            description={description}
            showCheck={false}
          />
        ))}
      </div>
      {errors.currentLevel && (
        <p className="text-xs text-rose-600">{errors.currentLevel}</p>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-ink-800">
          Qaysi fanlarga tayyorgarlik ko&apos;ryapsiz?
        </p>
        <p className="mb-3 text-xs text-ink-500">
          Bir nechtasini tanlashingiz mumkin.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {SUBJECTS.map(({ id, icon: Icon, tone, label }) => {
            const selected = (state.subjects ?? []).includes(id);
            return (
              <OptionCard
                key={id}
                selected={selected}
                onSelect={() => toggleSubject(id)}
                icon={<Icon strokeWidth={2.25} />}
                tone={tone}
                title={label}
                showCheck
                multi
              />
            );
          })}
        </div>
        {errors.subjects && (
          <p className="mt-2 text-xs text-rose-600">{errors.subjects}</p>
        )}
      </div>

      <Input
        label="So'nggi diagnostika balli (ixtiyoriy)"
        name="diagnosticScore"
        type="number"
        min={0}
        max={189}
        placeholder="Bilmasangiz, bo'sh qoldiring"
        hint="Agar oldin biror test topshirgan bo'lsangiz, ballingizni kiriting."
        value={state.diagnosticScore ?? ""}
        onChange={(e) =>
          set(
            "diagnosticScore",
            e.target.value ? Number(e.target.value) : undefined
          )
        }
      />
    </div>
  );
}
