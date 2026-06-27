import type { Metadata } from "next";
import { SeoLanding } from "@/components/sections/seo-landing";
import { JsonLd } from "@/components/seo/json-ld";
import { courseJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Milliy Sertifikatga tayyorlash - online reja va mock testlar",
  description:
    "Milliy Sertifikatga tayyorlash uchun MilliyPrep: CEFR B1, B2, C1 maqsadlari, shaxsiy o'quv reja, to'rt ko'nikma mashqlari, mock testlar va AI tutor.",
  path: "/milliy-sertifikatga-tayyorlash",
  keywords: ["milliy sertifikatga tayyorlash", "milliy sertifikat tayyorlov"],
});

export default function MilliySertifikatgaTayyorlashPage() {
  return (
    <>
      <SeoLanding
        eyebrow="Milliy Sertifikat"
        title="Milliy Sertifikatga tayyorlash uchun shaxsiy online platforma"
        description="MilliyPrep sizning hozirgi CEFR darajangiz, maqsadli natijangiz va imtihon sanangizga qarab haftalik reja tuzadi. Listening, reading, writing va speaking bo'yicha mashqlar, mini-testlar va real formatga yaqin mock testlar bir joyda jamlanadi."
        bullets={[
          "CEFR B1, B2 va C1 maqsadlari uchun moslashuvchan tayyorlov rejasi.",
          "Har bir xato skill, mavzu va savol turi bo'yicha tahlil qilinadi.",
          "AI tutor yozish, gapirish, grammatika va lug'at bo'yicha tushuntirish beradi.",
          "Progress dashboard orqali haftalik o'sish va zaif joylar ko'rinadi.",
        ]}
      />
      <JsonLd data={courseJsonLd} />
    </>
  );
}
