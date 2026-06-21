"use client";

import {
  AlarmClock,
  Award,
  Battery,
  Briefcase,
  CircleSlash2,
  Compass,
  GraduationCap,
  HeartPulse,
  Home,
  Plane,
  Sparkles,
  Trophy,
  User,
  Users,
  Users2,
  type LucideIcon,
} from "lucide-react";
import { useOnboarding } from "@/lib/onboarding/store";
import { OptionCard } from "@/components/ui/option-card";

interface Props {
  errors: Partial<Record<string, string>>;
}

const MOTIVATION_OPTIONS: {
  value: string;
  icon: LucideIcon;
  tone: "brand" | "accent" | "amber" | "rose" | "violet" | "sky" | "emerald";
  title: string;
}[] = [
  {
    value: "universitet",
    icon: GraduationCap,
    tone: "brand",
    title: "Yaxshi universitetga kirish",
  },
  { value: "kasb", icon: Briefcase, tone: "violet", title: "Kelajakdagi kasbim uchun" },
  {
    value: "stipendiya",
    icon: Trophy,
    tone: "amber",
    title: "Grant yoki stipendiya olish",
  },
  { value: "oila", icon: Home, tone: "rose", title: "Oilam kutishini oqlash" },
  {
    value: "shaxsiy",
    icon: Sparkles,
    tone: "accent",
    title: "O'zim uchun, shaxsiy o'sish",
  },
  { value: "chet-el", icon: Plane, tone: "sky", title: "Chet elga o'qishga kirish" },
];

const STYLE_OPTIONS: {
  value: "yolgiz" | "guruh" | "aralash";
  icon: LucideIcon;
  tone: "brand" | "accent" | "violet";
  title: string;
  description: string;
}[] = [
  {
    value: "yolgiz",
    icon: User,
    tone: "brand",
    title: "Yolg'iz",
    description: "Mustaqil rejada ishlaganim ma'qul",
  },
  {
    value: "guruh",
    icon: Users,
    tone: "accent",
    title: "Guruhda",
    description: "Boshqalar bilan birga, suhbatda yaxshi o'rganaman",
  },
  {
    value: "aralash",
    icon: Users2,
    tone: "violet",
    title: "Aralash",
    description: "Qulayligiga qarab — ba'zan yolg'iz, ba'zan guruh",
  },
];

const OBSTACLES: {
  value: string;
  icon: LucideIcon;
  tone: "brand" | "accent" | "amber" | "rose" | "violet" | "sky";
  title: string;
}[] = [
  {
    value: "vaqt-yetishmasligi",
    icon: AlarmClock,
    tone: "rose",
    title: "Vaqt yetishmaydi",
  },
  {
    value: "konsentratsiya",
    icon: Compass,
    tone: "violet",
    title: "Konsentratsiya qiyin",
  },
  { value: "motivatsiya", icon: Battery, tone: "amber", title: "Motivatsiyam tushadi" },
  { value: "tushunmaslik", icon: Award, tone: "sky", title: "Mavzular qiyin keladi" },
  { value: "stress", icon: HeartPulse, tone: "rose", title: "Imtihon stressi" },
  {
    value: "yoq",
    icon: CircleSlash2,
    tone: "accent",
    title: "Hech qanday muammo yo'q",
  },
];

export function StepProfile({ errors }: Props) {
  const { state, set } = useOnboarding();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-ink-900">Sizni tanib olaylik</h2>
        <p className="mt-1 text-sm text-ink-600">
          Bu javoblar rejani sizga moslashtirishga yordam beradi.
        </p>
      </header>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-800">
          Asosiy motivatsiyangiz nima?
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {MOTIVATION_OPTIONS.map((m) => (
            <OptionCard
              key={m.value}
              selected={state.motivation === m.value}
              onSelect={() => set("motivation", m.value)}
              icon={<m.icon strokeWidth={2.25} />}
              tone={m.tone}
              title={m.title}
              showCheck={false}
            />
          ))}
        </div>
        {errors.motivation && (
          <p className="mt-2 text-xs text-rose-600">{errors.motivation}</p>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-800">
          Qaysi uslubda yaxshi o&apos;rganasiz?
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {STYLE_OPTIONS.map((s) => (
            <OptionCard
              key={s.value}
              selected={state.studyStyle === s.value}
              onSelect={() => set("studyStyle", s.value)}
              icon={<s.icon strokeWidth={2.25} />}
              tone={s.tone}
              title={s.title}
              description={s.description}
              showCheck={false}
            />
          ))}
        </div>
        {errors.studyStyle && (
          <p className="mt-2 text-xs text-rose-600">{errors.studyStyle}</p>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-800">
          Sizga ko&apos;p xalaqit beradigan narsa nima?
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {OBSTACLES.map((o) => (
            <OptionCard
              key={o.value}
              selected={state.obstacle === o.value}
              onSelect={() => set("obstacle", o.value)}
              icon={<o.icon strokeWidth={2.25} />}
              tone={o.tone}
              title={o.title}
              showCheck={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
