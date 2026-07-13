import {
  BookOpen,
  ChartLine,
  GraduationCap,
  ShieldCheck,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { IconChip } from "@/components/ui/icon-chip";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: "brand" | "accent" | "amber" | "rose" | "violet" | "sky";
}

const FEATURES: Feature[] = [
  {
    icon: Target,
    title: "Shaxsiy o'quv reja",
    description:
      "Profilingiz, maqsad ballingiz va natijalaringiz asosida mashg'ulot navbati shakllanadi.",
    tone: "brand",
  },
  {
    icon: BookOpen,
    title: "Mavzuli mashq savollari",
    description:
      "Har bir mavzu bo'yicha tuzilgan savollar bilan mustahkam bilim oling.",
    tone: "accent",
  },
  {
    icon: ChartLine,
    title: "Aniq statistika",
    description:
      "Yutuqlaringizni kuzatib boring, kuchli va zaif tomonlaringizni biling.",
    tone: "amber",
  },
  {
    icon: Zap,
    title: "Tushuntirilgan javoblar",
    description:
      "Mashq yakunida to'g'ri javob va qisqa izohni ko'ring.",
    tone: "rose",
  },
  {
    icon: GraduationCap,
    title: "Milliy Sertifikat formatiga mos",
    description:
      "Platforma fan, mavzu, mock test va 100 ballik natija tahliliga moslashtirilgan.",
    tone: "violet",
  },
  {
    icon: ShieldCheck,
    title: "Himoyalangan hisob",
    description:
      "OTP, Google yoki Telegram orqali hisobingizga xavfsiz kiring.",
    tone: "sky",
  },
];

const STATS = [
  { value: 15, suffix: "", label: "Fan yo'nalishi" },
  { value: 100, suffix: " ball", label: "Maqsad shkalasi" },
  { value: 2, suffix: "", label: "Mashq rejimi" },
  { value: 1, suffix: "", label: "AI tutor" },
];

export function Features() {
  return (
    <section id="imkoniyatlar" className="py-20 lg:py-24">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Nega <span className="gradient-text">MilliyPrep</span>?
            </h2>
            <p className="mt-3 text-ink-600">
              Tayyorlanish uchun asosiy vositalar: reja, mashqlar, progress va
              AI tutor.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description, tone }, i) => (
            <Reveal key={title} delay={i * 60}>
              <article className="card group h-full p-6 transition-all hover:-translate-y-0.5 hover:shadow-ring">
                <IconChip tone={tone}>
                  <Icon strokeWidth={2.25} />
                </IconChip>
                <h3 className="mt-4 text-base font-semibold text-ink-900">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  {description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-12 grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-100 sm:grid-cols-4 sm:p-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center sm:text-left">
                <p className="text-2xl font-extrabold text-ink-900 sm:text-3xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs text-ink-500 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
