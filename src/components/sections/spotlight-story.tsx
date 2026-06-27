import { Reveal } from "@/components/motion/reveal";
import { Quote } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { STUDENT_AVATARS } from "@/lib/avatars";

export function SpotlightStory() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-24">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Sokin tayyorgarlik. <span className="accent-word text-[1.1em]">Yuqori ball.</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mx-auto mt-12 grid max-w-5xl items-center gap-8 rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-8 text-white shadow-soft sm:p-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Quote className="h-7 w-7 text-white/80" />
              <blockquote className="mt-4 text-lg leading-relaxed text-white/90 sm:text-xl">
                Bir yil davomida Telegramdagi materiallar va taxminlar bilan
                tayyorlanaverdim. MilliyPrep speaking va writingda nimani
                tuzatishim kerakligini aniq ko&apos;rsatdi. Uch oydan keyin Milliy
                Sertifikatdan C1 oldim.
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <Avatar src={STUDENT_AVATARS.ayden} alt="Aydina Nursultanova" size={44} />
                <div>
                  <p className="text-sm font-semibold">Aydina Nursultanova</p>
                  <p className="text-xs text-white/60">Toshkent · 3 oylik reja</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/15">
              <div className="flex items-center justify-around text-center">
                <div>
                  <p className="text-xs text-white/70">Boshlang&apos;ich</p>
                  <p className="mt-1 text-3xl font-extrabold">B1</p>
                </div>
                <span className="text-2xl text-white/50">→</span>
                <div>
                  <p className="text-xs text-white/70">Yakuniy</p>
                  <p className="mt-1 text-3xl font-extrabold text-accent-300">
                    C1
                  </p>
                </div>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-accent-500/20 px-3 py-1 text-xs font-semibold text-accent-200 ring-1 ring-inset ring-accent-400/30">
                +2 daraja · 12 hafta
              </div>
              <p className="mt-4 text-xs text-white/70">
                Bizga ishongan o&apos;quvchilardan biri. Ularning ballariga ham,
                fikriga ham ishondik.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
