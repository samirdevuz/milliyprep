import { Reveal } from "@/components/motion/reveal";

const PARTNERS = [
  "TIIM",
  "Westminster IUT",
  "INHA Tashkent",
  "TUIT",
  "Webster",
  "TSUE",
  "Andijon DU",
  "Buxoro DU",
];

export function TrustBar() {
  return (
    <section className="border-y border-ink-100 bg-white py-10">
      <div className="container-page">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">
            O&apos;quvchilarimiz O&apos;zbekistonning yetakchi universitetlariga
            kirishmoqda
          </p>
        </Reveal>
        <div className="pause-on-hover relative mt-6 overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent"
          />
          <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="text-base font-bold tracking-tight text-ink-300 transition hover:text-ink-600"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
