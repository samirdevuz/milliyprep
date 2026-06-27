import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  ClipboardList,
  Target,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { JsonLd } from "@/components/seo/json-ld";
import { IconChip } from "@/components/ui/icon-chip";
import { organizationJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "MilliyPrep haqida - Milliy Sertifikat tayyorlov platformasi",
  description:
    "MilliyPrep haqida: Milliy Sertifikatga shaxsiy reja, mock testlar, progress tahlili va AI tutor bilan tayyorlanish platformasi.",
  path: "/about",
});

const PRINCIPLES = [
  {
    title: "Milliy Sertifikatga fokus",
    text: "Platforma yo'nalishi bitta: fan tanlash, 100 ballik maqsad, practice, test va progress orqali Milliy Sertifikatga tayyorlash.",
    icon: Target,
    tone: "brand" as const,
  },
  {
    title: "Real urinishlardan reja",
    text: "Dashboarddagi tavsiyalar saqlangan mashg'ulot va test natijalariga qarab zaif mavzularni yuqoriga chiqaradi.",
    icon: BarChart3,
    tone: "accent" as const,
  },
  {
    title: "AI tutor yordamchi sifatida",
    text: "Tutor o'quvchining fani, hozirgi holati va maqsad ballini hisobga olib tushuntirish beradi.",
    icon: Brain,
    tone: "violet" as const,
  },
];

const FLOW = [
  "Onboardingda ism, fan, hozirgi natija, maqsad ball va o'qish vaqti aniqlanadi.",
  "Dashboard bugungi reja, haftalik progress va keyingi mavzuni ko'rsatadi.",
  "Practice va testlar natijani saqlaydi; statistika shu urinishlardan hisoblanadi.",
  "AI tutor xato savol, yozma javob yoki mavzu bo'yicha qisqa izoh beradi.",
];

const PRODUCT_AREAS = [
  {
    title: "Shaxsiy o'quv reja",
    text: "Maqsad ball va haftalik vaqtga qarab tavsiya qilingan mavzular tartiblanadi.",
    icon: ClipboardList,
  },
  {
    title: "Practice va mock test",
    text: "Mavzu bo'yicha qisqa mashqlar hamda aralash testlar orqali natija tekshiriladi.",
    icon: BookOpenCheck,
  },
  {
    title: "Progress tahlili",
    text: "Urinishlar, savollar, o'rtacha natija va fanlar kesimidagi ko'rsatkichlar jamlanadi.",
    icon: BarChart3,
  },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="bg-white">
        <section className="container-page py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                MilliyPrep haqida
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-ink-900 sm:text-5xl">
                Milliy Sertifikatga tayyorgarlikni aniq reja va real progressga
                bog&apos;laymiz
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-ink-700 sm:text-lg">
                MilliyPrep o&apos;quvchiga qaysi fandan tayyorlanayotganini,
                hozirgi holatini va maqsad ballini markazga qo&apos;yib, har
                kuni nima qilish kerakligini ko&apos;rsatadigan platforma.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/onboarding" className="btn-primary">
                  Shaxsiy reja olish
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/blog" className="btn-ghost">
                  Qo&apos;llanmalarni o&apos;qish
                </Link>
              </div>
            </div>

            <div className="rounded-2xl bg-ink-900 p-5 text-white shadow-soft sm:p-6">
              <div className="flex items-start gap-4">
                <IconChip tone="accent" size="lg">
                  <CheckCircle2 strokeWidth={2.2} />
                </IconChip>
                <div>
                  <p className="text-sm font-semibold text-white/70">
                    Mahsulot tamoyili
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold">
                    Har bir ekran o&apos;quvchini keyingi aniq qadamga olib
                    borishi kerak.
                  </h2>
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                {[
                  ["100 ball", "Maqsad va natijalar yagona shkala bilan beriladi."],
                  ["1 fan", "Tayyorgarlik tanlangan Milliy Sertifikat faniga moslashadi."],
                  ["1 reja", "Bugungi topshiriq, test va tahlil bir oqimda ishlaydi."],
                ].map(([value, label]) => (
                  <div
                    key={value}
                    className="rounded-xl bg-white/8 px-4 py-3 ring-1 ring-white/10"
                  >
                    <p className="text-lg font-extrabold">{value}</p>
                    <p className="mt-0.5 text-sm leading-6 text-white/70">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-ink-100 bg-ink-50/60 py-14">
          <div className="container-page">
            <div className="grid gap-4 md:grid-cols-3">
              {PRINCIPLES.map((item) => {
                const PrincipleIcon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100"
                  >
                    <IconChip tone={item.tone} size="sm">
                      <PrincipleIcon strokeWidth={2.2} />
                    </IconChip>
                    <h2 className="mt-4 text-base font-extrabold text-ink-900">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-ink-600">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container-page py-16">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                Qanday ishlaydi
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-ink-900">
                Tayyorlov bitta oqimga yig&apos;iladi
              </h2>
              <div className="mt-6 space-y-3">
                {FLOW.map((item, index) => (
                  <div key={item} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-extrabold text-brand-700 ring-1 ring-brand-100">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm leading-6 text-ink-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              {PRODUCT_AREAS.map((item) => {
                const AreaIcon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-brand-600 ring-1 ring-ink-100">
                      <AreaIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-ink-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-ink-600">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={organizationJsonLd} />
    </>
  );
}
