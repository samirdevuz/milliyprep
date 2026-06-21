import { Reveal } from "@/components/motion/reveal";
import { Illustration } from "@/components/ui/illustration";

export function Mission() {
  return (
    <section id="mission" className="relative overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-soft-mesh"
      />
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
              Bizning missiyamiz
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
              Har bir o&apos;quvchining maqsadidagi balliga erishishini{" "}
              <span className="accent-word text-[1.1em]">aniq reja</span> va
              samarali tayyorgarlik orqali ta&apos;minlaymiz.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 text-base text-ink-600 sm:text-lg">
              MilliyPrep har kuni o&apos;quvchining mashq qilish jarayonini
              kuzatib, eng zaif mavzularni topib beradi va aynan o&apos;sha joyda
              mehnat qilish imkoniyatini taqdim etadi.
            </p>
          </Reveal>
        </div>
        <Reveal delay={120} from="right">
          <Illustration
            src="/illustrations/checklist.png"
            alt="Reja va checklist illustratsiyasi"
            width={680}
            height={680}
            className="mx-auto max-w-md drop-shadow-[0_30px_40px_rgba(91,108,245,0.25)]"
          />
        </Reveal>
      </div>
    </section>
  );
}
