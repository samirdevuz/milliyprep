import { Reveal } from "@/components/motion/reveal";
import { Bot, Camera, Globe2, Sparkles } from "lucide-react";
import { IconChip } from "@/components/ui/icon-chip";

const MESSAGES = [
  {
    side: "user" as const,
    text: "Bu masalada nega B variant noto'g'ri?",
  },
  {
    side: "ai" as const,
    text:
      "Yaxshi savol. Tenglama x² − 5x + 6 = 0 ko'rinishida. Vyeta teoremasiga ko'ra ildizlar yig'indisi −b/a = 5. Demak, to'g'ri javob C.",
  },
  {
    side: "user" as const,
    text: "Endi shu turdagi yana 3 ta savol bera olasanmi?",
  },
];

export function AiTutor() {
  return (
    <section
      id="ai-tutor"
      className="relative overflow-hidden py-20 lg:py-28"
    >
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <Reveal>
          <div>
            <span className="pill">
              <Sparkles className="h-3.5 w-3.5" />
              24/7 AI tutor
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Sizning shaxsiy o&apos;qituvchingiz — har doim yoningizda
            </h2>
            <p className="mt-4 max-w-lg text-ink-600">
              Har qanday savol, har qanday xato, har qanday mavzu. AI tutor
              sizning rejangiz, oxirgi natijalaringiz va zaif tomonlaringizni
              biladi va o&apos;zbek, rus yoki ingliz tilida tushuntirib beradi.
              Savol rasmini yuboring — bir zumda yechimni oling.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                {
                  icon: Globe2,
                  tone: "brand" as const,
                  title: "Uch tilda javob beradi",
                  text: "O'zbek (lotin va kirill), rus va ingliz tillarida.",
                },
                {
                  icon: Camera,
                  tone: "violet" as const,
                  title: "Rasmdan tushunadi",
                  text:
                    "Daftaringizdagi savolni rasmga oling — bir zumda yechimni qaytaradi.",
                },
                {
                  icon: Bot,
                  tone: "accent" as const,
                  title: "Sizning rejangizni biladi",
                  text:
                    "Maqsadli ballingiz va zaif mavzularingizga moslab javob beradi.",
                },
              ].map(({ icon: Icon, tone, title, text }) => (
                <li key={title} className="flex items-start gap-3">
                  <IconChip tone={tone} size="sm">
                    <Icon strokeWidth={2.25} />
                  </IconChip>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{title}</p>
                    <p className="text-sm text-ink-600">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={140} from="right">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-200/50 via-white to-accent-200/40 blur-2xl"
            />
            <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink-100">
              <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/60 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[0_8px_20px_-8px_rgba(91,108,245,0.55)]">
                    <Bot className="h-4 w-4" />
                    <span className="pulse-ring absolute inset-0 rounded-xl" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink-900">AI tutor</p>
                    <p className="flex items-center gap-1 text-xs text-accent-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                      Onlayn
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-ink-600 ring-1 ring-ink-200">
                  O&apos;zbekcha
                </span>
              </div>

              <div className="space-y-3 bg-white p-5">
                {MESSAGES.map((m, i) => (
                  <div
                    key={i}
                    className={[
                      "flex",
                      m.side === "user" ? "justify-end" : "justify-start",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                        m.side === "user"
                          ? "rounded-br-md bg-brand-500 text-white"
                          : "rounded-bl-md bg-ink-100 text-ink-800",
                      ].join(" ")}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}

                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-ink-100 px-3 py-2.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-500 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-500 [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-500 [animation-delay:240ms]" />
                  </div>
                </div>
              </div>

              <div className="border-t border-ink-100 bg-ink-50/60 p-3">
                <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 ring-1 ring-ink-200">
                  <Camera className="h-4 w-4 text-ink-400" />
                  <span className="flex-1 truncate text-xs text-ink-400">
                    Savolingizni yozing yoki rasm yuboring…
                  </span>
                  <button
                    type="button"
                    className="rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Yuborish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
