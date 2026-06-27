import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "MilliyPrep haqida - Milliy Sertifikat tayyorlov platformasi",
  description:
    "MilliyPrep haqida: Milliy Sertifikat va CEFR imtihonlariga shaxsiy reja, mock testlar va AI tutor bilan tayyorlanish platformasi.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="container-page py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          MilliyPrep
        </p>
        <h1 className="text-3xl font-extrabold text-ink-900">Biz haqimizda</h1>
        <div className="space-y-4 text-sm leading-7 text-ink-700">
          <p>
            MilliyPrep o&apos;quvchilarga Milliy Sertifikat imtihoniga tizimli
            tayyorlanish uchun shaxsiy reja, to&apos;rt ko&apos;nikma bo&apos;yicha
            mashqlar, mini-testlar va AI tutor yordamida ishlaydigan platforma.
          </p>
          <p>
            Maqsadimiz o&apos;quvchining zaif mavzularini tezroq aniqlash,
            kundalik mashg&apos;ulotlarni aniqroq rejalash va progressni real
            natijalar bilan ko&apos;rsatish.
          </p>
        </div>
      </div>
    </main>
  );
}
