import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Headphones,
  LineChart,
  PenLine,
  Sparkles,
  Target,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { IconChip } from "@/components/ui/icon-chip";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Milliy Sertifikat tayyorlov blogi - CEFR maslahatlar",
  description:
    "Milliy Sertifikat, CEFR B1/B2/C1, listening, reading, writing va speaking tayyorlov bo'yicha foydali maqolalar va yo'l xaritalari.",
  path: "/blog",
});

const FEATURED = [
  {
    href: "/milliy-sertifikatga-tayyorlash",
    title: "Milliy Sertifikatga tayyorlanishni nimadan boshlash kerak?",
    excerpt:
      "Fan tanlash, hozirgi ballni baholash, maqsad qo'yish va haftalik rejani real vaqtga moslash bo'yicha amaliy yo'l xaritasi.",
    category: "Start",
    readTime: "6 daqiqa",
    icon: Target,
    tone: "brand" as const,
  },
  {
    href: "/milliy-sertifikat-ingliz-tili",
    title: "Ingliz tili Milliy Sertifikat: B1, B2 va C1 farqi",
    excerpt:
      "Listening, reading, writing va speaking bo'yicha har bir darajada nimalarga e'tibor berish kerakligini tartiblaymiz.",
    category: "Ingliz tili",
    readTime: "8 daqiqa",
    icon: Headphones,
    tone: "accent" as const,
  },
  {
    href: "/cefr-tayyorlov",
    title: "CEFR maqsadiga qarab haftalik reja tuzish",
    excerpt:
      "Haftasiga 5, 8 yoki 12 soat o'qiy oladigan o'quvchilar uchun practice, test va takrorlash balansini ko'rsatamiz.",
    category: "Reja",
    readTime: "7 daqiqa",
    icon: CalendarDays,
    tone: "sky" as const,
  },
];

const GUIDES = [
  {
    title: "Mock testdan keyin xatolarni qanday tahlil qilish kerak?",
    text: "Natijani faqat foiz sifatida emas, mavzu, savol turi va takrorlanayotgan xato sababi bo'yicha ajrating.",
    icon: LineChart,
  },
  {
    title: "Writing javobini tekshirishda 4 ta asosiy mezon",
    text: "Tuzilma, fikr aniqligi, grammatika va lug'atni alohida tekshirish javob sifatini tezroq ko'taradi.",
    icon: PenLine,
  },
  {
    title: "AI tutordan foydali javob olish uchun prompt namunasi",
    text: "Savol, o'z javobingiz, shubhangiz va maqsad darajani birga yozsangiz, tutor aniqroq izoh beradi.",
    icon: Sparkles,
  },
  {
    title: "Reading va listening uchun qayta ishlash usuli",
    text: "Bir marta test qilish yetarli emas: xato joyni qayta tinglash, kalit so'zlarni ajratish va izoh yozish kerak.",
    icon: BookOpen,
  },
];

const TOPICS = [
  "Milliy Sertifikat",
  "CEFR B1",
  "CEFR B2",
  "CEFR C1",
  "Listening",
  "Reading",
  "Writing",
  "Speaking",
  "Mock test",
  "AI tutor",
];

export default function BlogPage() {
  return (
    <>
      <Nav />
      <main className="bg-white">
        <section className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              Blog
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-ink-900 sm:text-5xl">
              Milliy Sertifikat va CEFR tayyorlov bo&apos;yicha qo&apos;llanmalar
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink-700 sm:text-lg">
              Maqsad ball, haftalik reja, skill mashqlari, mock test va AI tutor
              bilan ishlash bo&apos;yicha qisqa, amaliy materiallar.
            </p>
          </div>
        </section>

        <section className="container-page pb-16">
          <div className="grid gap-5 lg:grid-cols-3">
            {FEATURED.map((guide) => {
              const GuideIcon = guide.icon;
              return (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="group rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 transition hover:-translate-y-0.5 hover:ring-brand-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <IconChip tone={guide.tone} size="sm">
                      <GuideIcon strokeWidth={2.2} />
                    </IconChip>
                    <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-bold text-ink-600 ring-1 ring-ink-100">
                      {guide.readTime}
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand-600">
                    {guide.category}
                  </p>
                  <h2 className="mt-2 text-lg font-extrabold leading-snug text-ink-900">
                    {guide.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-ink-600">
                    {guide.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand-700">
                    O&apos;qish
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="border-y border-ink-100 bg-ink-50/60 py-14">
          <div className="container-page">
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  Mavzular
                </p>
                <h2 className="mt-3 text-3xl font-extrabold text-ink-900">
                  Tez kerak bo&apos;ladigan yo&apos;nalishlar
                </h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {TOPICS.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink-700 ring-1 ring-ink-100"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {GUIDES.map((guide) => {
                  const GuideIcon = guide.icon;
                  return (
                    <article
                      key={guide.title}
                      className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                        <GuideIcon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 text-base font-extrabold text-ink-900">
                        {guide.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-ink-600">
                        {guide.text}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="container-page py-16">
          <div className="rounded-2xl bg-ink-900 p-6 text-white shadow-soft sm:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-white/65">
                  Shaxsiy yo&apos;l xaritasi
                </p>
                <h2 className="mt-2 text-2xl font-extrabold">
                  Qaysi maqoladan boshlashni bilmasangiz, avval profilingizni
                  tuzing.
                </h2>
              </div>
              <Link
                href="/onboarding"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink-900 transition hover:bg-ink-100"
              >
                Bepul reja olish
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
