import {
  BarChart3,
  CheckCircle2,
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
    <aside className="relative hidden h-dvh overflow-hidden bg-[#06111f] text-white md:flex md:flex-col">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(91,108,245,0.30),transparent_32%),radial-gradient(circle_at_90%_18%,rgba(16,185,129,0.22),transparent_30%),linear-gradient(180deg,#071426_0%,#050b14_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400 via-accent-400 to-violet-400"
      />

      <div className="relative z-10 flex h-full flex-col justify-between overflow-y-auto p-4 lg:p-6 xl:p-10">
        <div className="space-y-4 xl:space-y-8">
          <div className="inline-flex rounded-2xl bg-white px-3 py-2 shadow-soft">
            <Logo size={30} />
          </div>

          <div className="space-y-3 xl:space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent-300">
              Shaxsiy reja
            </p>
            <h1 className="max-w-sm text-3xl font-black leading-[1.05] tracking-tight xl:text-4xl">
              Milliy Sertifikat uchun aniq yo&apos;l xarita.
            </h1>
            <p className="max-w-sm text-sm leading-6 text-white/68 [@media(max-height:700px)]:hidden">
              Bir nechta savol orqali darajangiz, vaqtingiz va maqsadingizni
              aniqlaymiz. Keyin reja dashboardda saqlanadi.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.75)] backdrop-blur [@media(max-height:700px)]:hidden">
            <div className="flex items-center gap-3">
              <IconChip tone="accent" size="sm">
                <CheckCircle2 strokeWidth={2.25} />
              </IconChip>
              <div>
                <p className="text-sm font-bold">2 daqiqalik onboarding</p>
                <p className="text-xs text-white/55">
                  Javoblar avtomatik saqlanadi
                </p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-brand-400 to-accent-400" />
            </div>
          </div>

          <ul className="space-y-2 xl:space-y-3">
            {PERKS.map(({ icon: Icon, tone, title, text }) => (
              <li
                key={title}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-2.5 backdrop-blur xl:p-3"
              >
                <IconChip tone={tone} size="sm">
                  <Icon strokeWidth={2.25} />
                </IconChip>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-white/55 [@media(max-height:760px)]:hidden">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 pt-5 xl:space-y-5 [@media(max-height:820px)]:hidden">
          <Illustration
            src="/illustrations/checklist.png"
            alt="Reja va checklist"
            width={320}
            height={320}
            className="mx-auto max-w-[170px] opacity-95 xl:max-w-[220px]"
          />

          <blockquote className="rounded-3xl border border-white/10 bg-white/[0.055] p-4 text-sm leading-6 text-white/72 backdrop-blur">
            <span className="text-2xl leading-none text-accent-300">“</span>
            Bugungi javoblaringiz ertangi rejangizni aniq qiladi.
            <footer className="mt-2 text-xs font-semibold text-white/45">
              MilliyPrep
            </footer>
          </blockquote>
        </div>
      </div>
    </aside>
  );
}
