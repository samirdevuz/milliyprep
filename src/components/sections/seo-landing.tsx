import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";

type SeoLandingProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
};

export function SeoLanding({
  eyebrow,
  title,
  description,
  bullets,
}: SeoLandingProps) {
  return (
    <>
      <Nav />
      <main className="bg-white">
        <section className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-ink-900 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink-700 sm:text-lg">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/onboarding" className="btn-primary">
                Reja olish
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/#imkoniyatlar" className="btn-ghost">
                Platformani ko&apos;rish
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-ink-100 bg-ink-50/60 py-14">
          <div className="container-page">
            <div className="grid gap-4 md:grid-cols-2">
              {bullets.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg bg-white p-5 shadow-soft ring-1 ring-ink-100"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <p className="text-sm leading-6 text-ink-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
