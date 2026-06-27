import Link from "next/link";
import { ArrowRight, PlayCircle, Sparkles, Star } from "lucide-react";
import { DashboardPreview } from "@/components/sections/dashboard-preview";
import { Reveal } from "@/components/motion/reveal";
import { Avatar } from "@/components/ui/avatar";
import { STUDENT_AVATARS } from "@/lib/avatars";

const PROOF = [
  { src: STUDENT_AVATARS.proof1, alt: "Talaba 1" },
  { src: STUDENT_AVATARS.proof2, alt: "Talaba 2" },
  { src: STUDENT_AVATARS.proof3, alt: "Talaba 3" },
  { src: STUDENT_AVATARS.proof4, alt: "Talaba 4" },
];

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
              Milliy Sertifikat uchun aqlli tayyorgarlik
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              Imtihonga tayyorgarlik endi{" "}
              <span className="accent-word text-[1.15em]">tez</span> va oson
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="max-w-xl text-base text-ink-600 sm:text-lg">
              Sun&apos;iy intellektga asoslangan shaxsiy o&apos;quv reja, minglab
              mashq savollari, mini-testlar va real imtihon formatidagi mock
              testlar — barchasi bitta joyda.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/onboarding" className="btn-primary">
                Bepul boshlash
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#imkoniyatlar" className="btn-ghost">
                <PlayCircle className="h-4 w-4" />
                Platforma haqida
              </Link>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {PROOF.map((p) => (
                  <Avatar
                    key={p.src}
                    src={p.src}
                    alt={p.alt}
                    size={36}
                    ring
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm font-medium text-ink-700">
                  10 000+ o&apos;quvchi bizga ishongan
                </p>
              </div>
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
