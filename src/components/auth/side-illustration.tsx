import { BarChart3, GraduationCap, Target, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { IconChip } from "@/components/ui/icon-chip";
import { Illustration } from "@/components/ui/illustration";

const PERKS: {
  icon: LucideIcon;
  tone: "brand" | "accent" | "violet";
  title: string;
  text: string;
}[] = [
  {
    icon: Target,
    tone: "brand",
    title: "Shaxsiy o'quv reja",
    text: "Sun'iy intellekt siz uchun moslashtirilgan reja tuzadi.",
  },
  {
    icon: GraduationCap,
    tone: "violet",
    title: "Minglab mashq va testlar",
    text: "Imtihon formatidagi savollar bilan mashq qiling.",
  },
  {
    icon: BarChart3,
    tone: "accent",
    title: "Natijangizni kuzating",
    text: "Statistika va tahlillar orqali o'sishingizni ko'ring.",
  },
];

export function AuthSideIllustration({ title }: { title: React.ReactNode }) {
  return (
    <aside className="relative hidden h-full overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 lg:flex">
      {/* Decorative blurred blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-accent-400/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-brand-400/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:28px_28px]"
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
        <Logo wordmarkTone="light" />

        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
              {title}
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-white/75">
              Minglab o&apos;quvchilar singari siz ham maqsadingizga biz bilan
              erishing.
            </p>
          </div>

          {/* Centered illustration in a soft glass card */}
          <div className="relative mx-auto w-full max-w-xs rounded-3xl bg-white/10 p-6 ring-1 ring-inset ring-white/15 backdrop-blur-sm">
            <Illustration
              src="/illustrations/phone-study.png"
              alt="O'quv ilovasi va sertifikat"
              width={360}
              height={360}
              className="mx-auto w-full max-w-[240px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.25)]"
              fallbackClassName="bg-white/20"
              priority
            />
          </div>

          <ul className="space-y-3">
            {PERKS.map(({ icon: Icon, tone, title, text }) => (
              <li key={title} className="flex items-start gap-3">
                <IconChip tone={tone} size="sm">
                  <Icon strokeWidth={2.25} />
                </IconChip>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-white/70">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} MilliyPrep
        </p>
      </div>
    </aside>
  );
}
