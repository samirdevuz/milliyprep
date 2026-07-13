import { Reveal } from "@/components/motion/reveal";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Cta() {
  return (
    <section className="py-20">
      <div className="container-page">
        <Reveal>
          <div className="overflow-hidden rounded-3xl bg-brand-gradient p-10 text-white shadow-soft sm:p-14">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Imtihon kuni kutib turmaydi.
                  <br />
                  Tayyorgarlikni bugundan boshla.
                </h2>
                <p className="mt-3 max-w-xl text-white/85">
                  2 daqiqa onboardingdan keyin Pro reja va to&apos;lov oqimi
                  tayyor bo&apos;ladi.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link
                  href="/onboarding"
                  className="btn bg-white text-brand-700 hover:bg-ink-50"
                >
                  Boshlash
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#imkoniyatlar"
                  className="btn bg-white/10 text-white ring-1 ring-inset ring-white/30 hover:bg-white/20"
                >
                  Imkoniyatlar
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
