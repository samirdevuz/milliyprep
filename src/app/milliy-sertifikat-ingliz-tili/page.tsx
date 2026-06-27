import type { Metadata } from "next";
import { SeoLanding } from "@/components/sections/seo-landing";
import { JsonLd } from "@/components/seo/json-ld";
import { courseJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Ingliz tili Milliy Sertifikat tayyorlov - B1, B2, C1",
  description:
    "Ingliz tili Milliy Sertifikat imtihoniga tayyorlaning: listening, reading, writing, speaking mashqlari, CEFR daraja rejalari va AI tutor.",
  path: "/milliy-sertifikat-ingliz-tili",
  keywords: ["ingliz tili milliy sertifikat", "cefr ingliz tili tayyorlov"],
});

export default function MilliySertifikatInglizTiliPage() {
  return (
    <>
      <SeoLanding
        eyebrow="Ingliz tili"
        title="Ingliz tili Milliy Sertifikat imtihoniga B1, B2 va C1 tayyorlov"
        description="Ingliz tili bo'yicha Milliy Sertifikatga tayyorlanayotgan o'quvchilar uchun MilliyPrep skill-based mashqlar, mock testlar va AI tutor yordamida aniq yo'l xaritasi beradi."
        bullets={[
          "Listening va reading mashqlari imtihon formatiga yaqin tuziladi.",
          "Writing javoblari tuzilma, grammatika va lug'at bo'yicha tekshiriladi.",
          "Speaking tayyorlovida javob g'oyasi, ifoda va CEFR mezonlari hisobga olinadi.",
          "Har bir daraja uchun real haftalik o'quv yuklamasi belgilanadi.",
        ]}
      />
      <JsonLd data={courseJsonLd} />
    </>
  );
}
