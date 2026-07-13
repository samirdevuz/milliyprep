import Link from "next/link";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { DashboardPreview } from "@/components/sections/dashboard-preview";
import { Reveal } from "@/components/motion/reveal";

export function Hero() {
  return (
    <section
      id="bosh-sahifa"
      className="relative overflow-hidden pt-10 sm:pt-14"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-soft-mesh" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-grid opacity-60" />

      <div className="container-page grid items-center gap-10 pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pb-28">
        <div className="space-y-7">
          <Reveal>
            <span className="pill">
              <Sparkles className="h-3.5 w-3.5" />
              Milliy Sertifikat uchun yagona profil
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              Milliy Sertifikatga tayyorlanish platformasi
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="max-w-xl text-base text-ink-600 sm:text-lg">
              MilliyPrep maqsad ball, mavzuli mashqlar, mock testlar va natija
              tahlili orqali tayyorgarlikni tizimli qiladi.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <p className="max-w-2xl text-sm leading-6 text-ink-500">
              Faningizni onboardingda tanlang. Dastlabki mashq katalogi
              bosqichma-bosqich ekspert tekshiruvi bilan kengaytiriladi;
              progress va AI tutor bitta profilda ishlaydi.
            </p>
          </Reveal>

          <Reveal delay={280}>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/onboarding" className="btn-primary">
                Boshlash
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#imkoniyatlar" className="btn-ghost">
                <PlayCircle className="h-4 w-4" />
                Platforma haqida
              </Link>
            </div>
          </Reveal>

        </div>

        <Reveal delay={120} from="right">
          <DashboardPreview />
        </Reveal>
      </div>
    </section>
  );
}
