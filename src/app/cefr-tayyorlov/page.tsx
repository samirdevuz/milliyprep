import type { Metadata } from "next";
import { SeoLanding } from "@/components/sections/seo-landing";
import { JsonLd } from "@/components/seo/json-ld";
import { courseJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "CEFR tayyorlov - B1, B2, C1 uchun MilliyPrep",
  description:
    "CEFR B1, B2 va C1 darajalariga tayyorlov: shaxsiy reja, skill mashqlari, mock testlar, progress tahlili va AI tutor.",
  path: "/cefr-tayyorlov",
  keywords: ["CEFR tayyorlov", "CEFR B2 tayyorlash", "CEFR C1 tayyorlash"],
});

export default function CefrTayyorlovPage() {
  return (
    <>
      <SeoLanding
        eyebrow="CEFR"
        title="CEFR B1, B2 va C1 darajalari uchun tizimli tayyorlov"
        description="MilliyPrep CEFR maqsadingizga qarab mashqlarni ustuvorlashtiradi: avval zaif ko'nikmalar, keyin mock test, so'ng natijaga qarab yangi reja."
        bullets={[
          "Boshlang'ich daraja va maqsadli CEFR daraja onboardingda aniqlanadi.",
          "Reja imtihon sanasi, haftalik vaqt va o'rganish uslubiga moslashadi.",
          "Natijalar dashboardda ko'nikma va mavzu kesimida ko'rsatiladi.",
          "AI tutor tushunmagan savollaringizni o'zbek, ingliz yoki rus tilida izohlaydi.",
        ]}
      />
      <JsonLd data={courseJsonLd} />
    </>
  );
}
