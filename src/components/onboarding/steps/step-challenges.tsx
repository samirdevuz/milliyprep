"use client";

import {
  AlarmClock,
  Briefcase,
  CircleHelp,
  GraduationCap,
  HeartPulse,
  Landmark,
  ShieldAlert,
  Sparkles,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { useOnboarding } from "@/lib/onboarding/store";
import { OptionCard } from "@/components/ui/option-card";
import { Input } from "@/components/ui/input";

interface Props {
  errors: Partial<Record<string, string>>;
}

const WORRIES: {
  value: "fail_exam" | "time" | "money" | "confidence";
  icon: LucideIcon;
  tone: "brand" | "amber" | "rose" | "violet";
  title: string;
  description: string;
}[] = [
  {
    value: "fail_exam",
    icon: ShieldAlert,
    tone: "rose",
    title: "Imtihondan o'ta olmaslik",
    description: "Topshirib, maqsad darajaga yetolmaslikdan xavotirdaman.",
  },
  {
    value: "time",
    icon: AlarmClock,
    tone: "amber",
    title: "Vaqt yetishmasligi",
    description: "Imtihon yaqin, o'rganadigan narsalar ko'p.",
  },
  {
    value: "money",
    icon: WalletCards,
    tone: "brand",
    title: "Pulni behuda sarflash",
    description: "Natija bermaydigan tayyorgarlikka vaqt va mablag' ketmasin.",
  },
  {
    value: "confidence",
    icon: HeartPulse,
    tone: "violet",
    title: "O'zimga ishonmaslik",
    description: "Ayniqsa gapirish yoki yozishda ishonchim past.",
  },
];

const PURPOSES: {
  value: "university" | "work" | "teacher" | "self" | "other";
  icon: LucideIcon;
  tone: "brand" | "accent" | "amber" | "rose" | "violet";
  title: string;
  description: string;
}[] = [
  {
    value: "university",
    icon: GraduationCap,
    tone: "brand",
    title: "Universitet yoki magistratura",
    description: "Qabul, grant yoki akademik talab uchun.",
  },
  {
    value: "work",
    icon: Briefcase,
    tone: "violet",
    title: "Ish va karyera",
    description: "Lavozim, ishga kirish yoki xalqaro imkoniyatlar uchun.",
  },
  {
    value: "teacher",
    icon: Landmark,
    tone: "amber",
    title: "O'qituvchilik yoki ustama",
    description: "Kasbiy talab va malaka tasdig'i uchun.",
  },
  {
    value: "self",
    icon: Sparkles,
    tone: "accent",
    title: "Shaxsiy rivojlanish",
    description: "Til darajamni aniq isbotlamoqchiman.",
  },
  {
    value: "other",
    icon: CircleHelp,
    tone: "rose",
    title: "Boshqa maqsad",
    description: "Maqsadingizni qisqacha yozib berasiz.",
  },
];

export function StepChallenges({ errors }: Props) {
  const { state, set } = useOnboarding();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-ink-900">
          Maqsad va xavotirlar
        </h2>
        <p className="mt-1 text-sm text-ink-600">
          Javoblaringiz reja qanchalik tezkor, ko&apos;p takrorli yoki imtihon
          formatiga yo&apos;naltirilgan bo&apos;lishini belgilaydi.
        </p>
      </header>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-800">
          Sizni eng ko&apos;p nima tashvishlantiradi?
        </p>
        <div className="grid gap-2">
          {WORRIES.map((item) => (
            <OptionCard
              key={item.value}
              selected={state.worries === item.value}
              onSelect={() => set("worries", item.value)}
              icon={<item.icon strokeWidth={2.25} />}
              tone={item.tone}
              title={item.title}
              description={item.description}
              showCheck={false}
            />
          ))}
        </div>
        {errors.worries && (
          <p className="mt-2 text-xs text-rose-600">{errors.worries}</p>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-800">
          Nima uchun Milliy Sertifikat olmoqchisiz?
        </p>
        <div className="grid gap-2">
          {PURPOSES.map((item) => (
            <OptionCard
              key={item.value}
              selected={state.examPurpose === item.value}
              onSelect={() => set("examPurpose", item.value)}
              icon={<item.icon strokeWidth={2.25} />}
              tone={item.tone}
              title={item.title}
              description={item.description}
              showCheck={false}
            />
          ))}
        </div>
        {state.examPurpose === "other" && (
          <div className="mt-3">
            <Input
              label="Maqsadingiz"
              name="purposeOther"
              placeholder="Masalan, xalqaro dasturga topshirish"
              value={state.purposeOther ?? ""}
              onChange={(e) => set("purposeOther", e.target.value)}
              error={errors.purposeOther}
            />
          </div>
        )}
        {errors.examPurpose && (
          <p className="mt-2 text-xs text-rose-600">{errors.examPurpose}</p>
        )}
      </div>
    </div>
  );
}
