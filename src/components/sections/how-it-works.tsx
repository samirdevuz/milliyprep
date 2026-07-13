import { ClipboardList, MessageSquare, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { IconChip } from "@/components/ui/icon-chip";

const STEPS = [
  {
    n: "01",
    icon: MessageSquare,
    tone: "brand" as const,
    title: "Profil yarating",
    description:
      "Fan, hozirgi natija, maqsad ball va haftalik vaqtingizni 2 daqiqada kiriting.",
  },
  {
    n: "02",
    icon: ClipboardList,
    tone: "accent" as const,
    title: "Reja oling",
    description:
      "Sizning darajangiz va vaqtingizga moslashtirilgan haftalik o'quv reja shakllanadi.",
  },
  {
    n: "03",
    icon: Sparkles,
    tone: "violet" as const,
    title: "Natijani ko'ring",
    description:
      "Mashq qiling, mock testlardan o'ting va har hafta ballingiz qanday o'sayotganini kuzatib boring.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-ink-50/40 py-20 lg:py-24">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="pill">Qanday ishlaydi</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Maqsad sari atigi <span className="accent-word text-[1.1em]">3 qadam</span>.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {STEPS.map(({ n, icon: Icon, tone, title, description }, i) => (
            <Reveal
              key={n}
              delay={i * 100}
              from={i === 1 ? "up" : i === 0 ? "left" : "right"}
            >
              <div className="relative h-full overflow-hidden rounded-2xl bg-white p-7 shadow-soft ring-1 ring-ink-100">
                <span className="absolute right-5 top-5 text-5xl font-black text-ink-100">
                  {n}
                </span>
                <IconChip tone={tone} size="md">
                  <Icon strokeWidth={2.25} />
                </IconChip>
                <h3 className="mt-5 text-lg font-semibold text-ink-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
