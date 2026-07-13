"use client";

import Link from "next/link";
import { Check, Crown, Target } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { IconChip } from "@/components/ui/icon-chip";
import { PaymentButtons } from "@/components/payments/payment-buttons";
import { cn } from "@/lib/cn";
import { gradeForScore, subjectById } from "@/lib/onboarding/certificate";
import { firstNameOf, useSavedOnboarding } from "@/lib/onboarding/use-saved-onboarding";
import { formatUzs, PLANS, type Plan } from "@/lib/pricing";

function scoreLine(score?: number): string {
  if (typeof score !== "number") return "Maqsad ball belgilanmagan";
  const grade = gradeForScore(score);
  return grade ? `${score} ball · ${grade.label}` : `${score} ball`;
}

function planHref(plan: Plan, billing: "monthly" | "yearly") {
  const params = new URLSearchParams({
    from: "onboarding",
    plan: plan.id,
    billing,
  });
  return `/register?${params.toString()}`;
}

export default function PlansPage() {
  const { data } = useSavedOnboarding();
  const subject = subjectById(data?.subjectId);
  const name = firstNameOf(data?.fullName);
  const proPlan = PLANS[0];

  return (
    <main className="min-h-dvh overflow-hidden bg-ink-50">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-soft-mesh opacity-80" />

      <header className="relative z-10 border-b border-white/70 bg-white/85 backdrop-blur-xl">
        <div className="container-page flex items-center justify-between py-4">
          <Link href="/" aria-label="Bosh sahifa">
            <Logo size={28} />
          </Link>
          <Link href="/login" className="btn-ghost px-4 py-2 text-sm">
            Kirish
          </Link>
        </div>
      </header>

      <section className="relative z-10">
        <div className="container-page grid gap-8 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:py-12">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-ink-100">
              <IconChip tone="brand" size="md">
                <Target className="h-5 w-5" />
              </IconChip>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
                Reja tayyor
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
                {name}, Pro rejangizni ishga tushiramizmi?
              </h1>
              <p className="mt-4 text-sm leading-6 text-ink-600">
                Onboarding javoblaringiz dashboard, mashqlar va AI tutor uchun
                saqlanadi. Hisob yaratgandan keyin tanlangan tarif profilingizga
                bog&apos;lanadi.
              </p>

              <dl className="mt-6 space-y-3">
                {[
                  ["Fan", subject?.label ?? "Tanlanmagan"],
                  ["Maqsad", scoreLine(data?.targetScore)],
                  [
                    "O'qish ritmi",
                    data?.weeklyHours && data?.studyDays
                      ? `${data.weeklyHours} soat · ${data.studyDays} kun`
                      : "Keyin sozlanadi",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 border-b border-ink-100 pb-3 last:border-b-0 last:pb-0"
                  >
                    <dt className="text-sm text-ink-500">{label}</dt>
                    <dd className="text-right text-sm font-extrabold text-ink-900">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-ink-900">
                  Yillik to&apos;lovda oyiga arzonroq
                </p>
                <p className="text-sm text-ink-600">
                  Click yoki Payme orqali sandbox to&apos;lovni boshlang, yoki
                  avval hisob yaratib keyin to&apos;lov qiling.
                </p>
              </div>
            </div>

            <div className="max-w-xl">
              <PlanChoice plan={proPlan} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function PlanChoice({ plan }: { plan: Plan }) {
  const Icon = plan.icon;
  const yearlyHref = planHref(plan, "yearly");

  return (
    <article
      className={cn(
        "flex min-h-[520px] flex-col rounded-[1.75rem] p-5 shadow-soft ring-1",
        plan.highlighted
          ? "bg-ink-900 text-white ring-ink-900"
          : "bg-white text-ink-900 ring-ink-100"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <IconChip tone={plan.tone === "accent" ? "accent" : "brand"} size="md">
          <Icon className="h-5 w-5" />
        </IconChip>
        {plan.highlighted && (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white">
            <Crown className="h-3.5 w-3.5" />
            Tavsiya
          </span>
        )}
      </div>

      <h2 className="mt-5 text-xl font-black">{plan.name}</h2>
      <p className={cn("mt-2 text-sm", plan.highlighted ? "text-white/70" : "text-ink-600")}>
        {plan.tagline}
      </p>

      <div className="mt-5 space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-60">
            Oylik
          </p>
          <p className="mt-1 text-3xl font-black">
            {formatUzs(plan.monthly)}
            <span className="text-sm font-bold opacity-60"> so&apos;m</span>
          </p>
        </div>
        {plan.yearly > 0 && (
          <div className="rounded-2xl bg-accent-500/10 p-3 ring-1 ring-accent-500/20">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-600">
              Yillik
            </p>
            <p className="mt-1 text-lg font-black">
              {formatUzs(plan.yearly)}
              <span className="text-sm font-bold opacity-60"> so&apos;m / oy</span>
            </p>
          </div>
        )}
      </div>

      <ul className="mt-5 flex-1 space-y-2.5 text-sm">
        {plan.features.slice(0, 5).map((feature) => (
          <li key={feature} className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
            <span className={plan.highlighted ? "text-white/90" : "text-ink-700"}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-2">
        <PaymentButtons plan={plan} billing="yearly" />
        {plan.yearly > 0 && (
          <Link
            href={yearlyHref}
            className={cn(
              "inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-bold transition",
              plan.highlighted
                ? "bg-white/10 text-white hover:bg-white/15"
                : "bg-ink-100 text-ink-700 hover:bg-ink-200"
            )}
          >
            Hozircha hisob yaratish
          </Link>
        )}
      </div>
    </article>
  );
}
