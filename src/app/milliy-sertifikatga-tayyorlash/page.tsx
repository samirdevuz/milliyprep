import type { Metadata } from "next";
import { SeoLanding } from "@/components/sections/seo-landing";
import { JsonLd } from "@/components/seo/json-ld";
import { courseJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Matematika Milliy Sertifikatiga tayyorlash",
  description:
    "Matematika Milliy Sertifikatiga tayyorlash: rasmiy spetsifikatsiyaga mos original savollar, shaxsiy reja, pilot sinovlar va AI ustoz.",
  path: "/milliy-sertifikatga-tayyorlash",
  keywords: ["milliy sertifikatga tayyorlash", "milliy sertifikat tayyorlov"],
});

export default function MilliySertifikatgaTayyorlashPage() {
  return (
    <>
      <SeoLanding
        eyebrow="Milliy Sertifikat"
        title="Matematika Milliy Sertifikatiga tayyorlash uchun shaxsiy platforma"
        description="MilliyPrep hozirgi ballingiz, maqsadli natijangiz va haftalik vaqtingizga qarab matematika mashqlarini ustuvorlashtiradi. Savollar UZBMB spetsifikatsiyasidagi ko'nikmalarga mos original pilot bankdan olinadi."
        bullets={[
          "Algebra, tenglamalar, funksiyalar, geometriya va ehtimollik bo'yicha reja.",
          "Har bir xato mavzu va savol turi bo'yicha tahlil qilinadi.",
          "AI ustoz matematik yechimni qadam-baqadam tushuntiradi.",
          "Dashboard haftalik progress va zaif ko'nikmalarni ko'rsatadi.",
        ]}
      />
      <JsonLd data={courseJsonLd} />
    </>
  );
}
