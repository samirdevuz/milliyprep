import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  LifeBuoy,
  MessageCircle,
  Route,
  Settings,
} from "lucide-react";
import { IconChip } from "@/components/ui/icon-chip";

const QUICK_ACTIONS = [
  {
    title: "Bugungi mashg'ulotni boshlash",
    description: "Zaif mavzular bo'yicha qisqa practice sessiyasini oching.",
    href: "/dashboard/practice",
    icon: BookOpen,
    tone: "brand" as const,
  },
  {
    title: "AI tutor bilan savol yechish",
    description: "Tushunmagan izoh, grammatika yoki yechimni so'rang.",
    href: "/dashboard/chat",
    icon: MessageCircle,
    tone: "accent" as const,
  },
  {
    title: "Rejani tekshirish",
    description: "Haftalik maqsad va tavsiya qilingan mavzularni ko'ring.",
    href: "/dashboard/plan",
    icon: Route,
    tone: "sky" as const,
  },
  {
    title: "Profil sozlamalari",
    description: "Fan, maqsad ball va o'quv vaqtingizni yangilang.",
    href: "/dashboard/settings",
    icon: Settings,
    tone: "violet" as const,
  },
];

const FAQS = [
  {
    question: "Progress qachon yangilanadi?",
    answer:
      "Practice yoki test yakunlanganda natija darhol saqlanadi. Dashboard, statistika va reja shu urinishlar asosida yangilanadi.",
  },
  {
    question: "Maqsad ballni o'zgartirsam bo'ladimi?",
    answer:
      "Ha. Sozlamalar sahifasida 0-100 oralig'idagi maqsad ball, hozirgi holat va haftalik o'quv vaqtingizni yangilashingiz mumkin.",
  },
  {
    question: "AI tutor javoblari nimaga asoslanadi?",
    answer:
      "Tutor profilingizdagi fan, hozirgi natija, maqsad ball va oxirgi progress kontekstidan foydalanib javob beradi.",
  },
  {
    question: "Testlar va mashg'ulotlar farqi nima?",
    answer:
      "Mashg'ulotlar bitta mavzuni mustahkamlash uchun, testlar esa aralash savollar orqali umumiy tayyorgarlikni tekshirish uchun ishlatiladi.",
  },
];

const STEPS = [
  "Sozlamalarda fan va maqsad ballingiz to'g'ri turganini tekshiring.",
  "Mening rejam sahifasidagi birinchi tavsiya qilingan mavzudan boshlang.",
  "Har sessiyadan keyin izohlarni o'qing va xatolarni AI tutorga yuboring.",
  "Hafta oxirida Statistika sahifasida o'rtacha natijani solishtiring.",
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <IconChip tone="accent" size="lg">
              <HelpCircle strokeWidth={2.2} />
            </IconChip>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Yordam markazi
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-ink-900">
                Qayerdan boshlashni tez toping
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-600">
                Milliy Sertifikat tayyorgarligida profil, reja, mashg&apos;ulot,
                test va AI tutor bir-biriga bog&apos;langan holda ishlaydi.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/chat"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600"
          >
            AI tutordan so&apos;rash
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {QUICK_ACTIONS.map((item) => {
          const ActionIcon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 transition hover:-translate-y-0.5 hover:ring-brand-200"
            >
              <IconChip tone={item.tone} size="sm">
                <ActionIcon strokeWidth={2.2} />
              </IconChip>
              <h2 className="mt-4 text-sm font-bold text-ink-900">
                {item.title}
              </h2>
              <p className="mt-1 text-sm leading-5 text-ink-600">
                {item.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700">
                Ochish
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
          <div className="flex items-start gap-3">
            <IconChip tone="brand" size="sm">
              <CheckCircle2 strokeWidth={2.2} />
            </IconChip>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Tavsiya qilingan tartib
              </p>
              <h2 className="mt-1 text-lg font-extrabold text-ink-900">
                Haftalik ish jarayoni
              </h2>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {STEPS.map((step, index) => (
              <div key={step} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-extrabold text-brand-700 ring-1 ring-brand-100">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-6 text-ink-700">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Ko&apos;p so&apos;raladigan savollar
          </p>
          <div className="mt-4 divide-y divide-ink-100">
            {FAQS.map((item) => (
              <div key={item.question} className="py-4 first:pt-0 last:pb-0">
                <h2 className="text-sm font-bold text-ink-900">
                  {item.question}
                </h2>
                <p className="mt-1 text-sm leading-6 text-ink-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 p-5 text-white shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <LifeBuoy className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-extrabold">Muammo davom etyaptimi?</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-white/70">
              Savolingizni AI tutorga yozing yoki onboarding profilingizni
              yangilab, reja qayta hisoblanishini tekshiring.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/settings"
          className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-ink-900 transition hover:bg-ink-100"
        >
          Profilni tekshirish
        </Link>
      </div>
    </div>
  );
}
