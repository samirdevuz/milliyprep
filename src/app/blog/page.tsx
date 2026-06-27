import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Milliy Sertifikat tayyorlov blogi - CEFR maslahatlar",
  description:
    "Milliy Sertifikat, CEFR B1/B2/C1, listening, reading, writing va speaking tayyorlov bo'yicha foydali maqolalar va yo'l xaritalari.",
  path: "/blog",
});

const GUIDES = [
  {
    href: "/milliy-sertifikatga-tayyorlash",
    title: "Milliy Sertifikatga tayyorlash",
    text: "Online reja, mock testlar va AI tutor bilan tayyorlanish yo'li.",
  },
  {
    href: "/milliy-sertifikat-ingliz-tili",
    title: "Ingliz tili Milliy Sertifikat",
    text: "B1, B2 va C1 uchun listening, reading, writing, speaking mashqlari.",
  },
  {
    href: "/cefr-tayyorlov",
    title: "CEFR tayyorlov",
    text: "CEFR darajangizga qarab haftalik tayyorlov rejasi.",
  },
];

export default function BlogPage() {
  return (
    <main className="container-page py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Blog
        </p>
        <h1 className="text-3xl font-extrabold text-ink-900">
          Milliy Sertifikat va CEFR tayyorlov maqolalari
        </h1>
        <p className="text-sm leading-7 text-ink-700">
          Milliy Sertifikat imtihoniga tayyorlanish, CEFR darajani oshirish va
          to&apos;rt ko&apos;nikma bo&apos;yicha mashq qilish uchun asosiy
          yo&apos;nalishlar.
        </p>
        <div className="grid gap-3">
          {GUIDES.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="rounded-lg bg-white p-5 shadow-soft ring-1 ring-ink-100 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h2 className="text-base font-bold text-ink-900">
                {guide.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                {guide.text}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
