import {
  BarChart3,
  Clock4,
  ShieldCheck,
  Target,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { IconChip } from "@/components/ui/icon-chip";
import { Illustration } from "@/components/ui/illustration";

const PERKS: {
  icon: LucideIcon;
  tone: "brand" | "accent" | "violet" | "amber";
  title: string;
  text: string;
}[] = [
  {
    icon: Target,
    tone: "brand",
    title: "Shaxsiy yondashuv",
    text: "Sizga mos o'quv reja va mashg'ulotlar.",
  },
  {
    icon: BarChart3,
    tone: "accent",
    title: "Aqlli tahlil",
    text: "Kuchli va zaif tomonlaringizni aniqlaymiz.",
  },
  {
    icon: Clock4,
    tone: "violet",
    title: "Vaqtga moslashgan",
    text: "Sizning bo'sh vaqtingizga moslashgan reja.",
  },
  {
    icon: ShieldCheck,
    tone: "amber",
    title: "Natijaga yo'naltirilgan",
    text: "Maqsadingizga eng samarali yo'l.",
  },
];

export function OnboardingSidePanel() {
  return (
    <aside className="relative hidden h-full flex-col justify-between bg-white p-10 lg:flex">
      <div className="space-y-10">
        <Logo />
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink-900">
            Xush kelibsiz!
            <br />
            <span className="gradient-text">MilliyPrep</span>ga.
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-ink-600">
            Sizni yaxshiroq tanishimiz uchun bir nechta savolga javob bering.
            Shundan so&apos;ng sizga shaxsiy o&apos;quv rejani tayyorlaymiz.
          </p>
        </div>

        <ul className="space-y-3">
          {PERKS.map(({ icon: Icon, tone, title, text }) => (
            <li key={title} className="flex items-start gap-3">
              <IconChip tone={tone} size="sm">
                <Icon strokeWidth={2.25} />
              </IconChip>
              <div>
                <p className="text-sm font-semibold text-ink-900">{title}</p>
                <p className="text-xs text-ink-600">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Illustration
        src="/illustrations/checklist.png"
        alt="Reja va checklist"
        width={320}
        height={320}
        className="mx-auto -mt-6 max-w-[240px]"
      />

      <blockquote className="rounded-2xl border border-ink-100 bg-ink-50/60 p-4 text-sm text-ink-700">
        <span className="text-2xl leading-none text-brand-500">“</span>
        Bugun qilgan mehnatingiz, ertangi natijalaringizni belgilaydi.
        <footer className="mt-2 text-xs text-ink-500">— MilliyPrep</footer>
      </blockquote>
    </aside>
  );
}
