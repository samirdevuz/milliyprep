"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { IconChip } from "@/components/ui/icon-chip";
import { PLANS, formatUzs, type Plan } from "@/lib/pricing";
import { cn } from "@/lib/cn";

export function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section
      id="narxlar"
      className="relative overflow-hidden border-t border-ink-100 py-20 lg:py-28"
    >
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="pill">Narxlar</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Maqsadingizga mos tarifni tanlang
            </h2>
            <p className="mt-3 text-ink-600">
              Bepul boshlang, xohlagan vaqtda yangilang yoki bekor qiling. Hech
              qanday yashirin to&apos;lov yo&apos;q.
            </p>
          </div>
        </Reveal>

        {/* Billing toggle */}
        <Reveal delay={80}>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span
              className={cn(
                "text-sm font-medium",
                !yearly ? "text-ink-900" : "text-ink-500"
              )}
            >
              Oylik
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={yearly}
              onClick={() => setYearly((v) => !v)}
              className={cn(
                "relative h-6 w-11 rounded-full transition",
                yearly ? "bg-brand-500" : "bg-ink-300"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                  yearly ? "left-[22px]" : "left-0.5"
                )}
              />
            </button>
            <span
              className={cn(
                "text-sm font-medium",
                yearly ? "text-ink-900" : "text-ink-500"
              )}
            >
              Yillik
            </span>
            <span className="rounded-full bg-accent-100 px-2 py-0.5 text-xs font-semibold text-accent-700">
              −25%
            </span>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl items-stretch gap-5 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 80} className="h-full">
              <PlanCard plan={plan} yearly={yearly} />
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-ink-500">
          Narxlar O&apos;zbekiston so&apos;mida. To&apos;lov Click, Payme va
          Uzcard orqali qabul qilinadi.
        </p>
      </div>
    </section>
  );
}

function PlanCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const price = yearly ? plan.yearly : plan.monthly;
  const Icon = plan.icon;
  const onboardingHref = `/onboarding?plan=${encodeURIComponent(plan.id)}&billing=${
    yearly ? "yearly" : "monthly"
  }`;

  const toneChip =
    plan.tone === "brand" ? "brand" : plan.tone === "accent" ? "accent" : "violet";

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-3xl p-6 ring-1 transition",
        plan.highlighted
          ? "bg-ink-900 text-white shadow-soft ring-ink-900"
          : "bg-white text-ink-900 shadow-soft ring-ink-100"
      )}
    >
      <div className="flex items-center justify-between">
        <IconChip tone={toneChip} size="md">
          <Icon strokeWidth={2.25} />
        </IconChip>
        {plan.highlighted && (
          <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
            Eng mashhur
          </span>
        )}
      </div>

      <h3
        className={cn(
          "mt-4 text-lg font-bold",
          plan.highlighted ? "text-white" : "text-ink-900"
        )}
      >
        {plan.name}
      </h3>
      <p
        className={cn(
          "mt-1 text-sm",
          plan.highlighted ? "text-white/70" : "text-ink-500"
        )}
      >
        {plan.tagline}
      </p>

      <div className="mt-5">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-extrabold tracking-tight">
            {formatUzs(price)}
          </span>
          <span
            className={cn(
              "pb-1 text-sm",
              plan.highlighted ? "text-white/60" : "text-ink-500"
            )}
          >
            {price === 0 ? "so'm" : "so'm / oy"}
          </span>
        </div>
        {yearly && price > 0 && (
          <p
            className={cn(
              "mt-1 text-xs",
              plan.highlighted ? "text-white/60" : "text-ink-500"
            )}
          >
            Yillik to&apos;lovda, oyiga hisoblaganda
          </p>
        )}
      </div>

      <Link
        href={onboardingHref}
        className={cn(
          "mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition",
          plan.highlighted
            ? "bg-white text-ink-900 hover:bg-ink-100"
            : plan.tone === "accent"
              ? "bg-accent-500 text-white hover:bg-accent-600"
              : "bg-brand-500 text-white hover:bg-brand-600"
        )}
      >
        {plan.cta}
      </Link>

      <ul className="mt-6 space-y-2.5 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                plan.highlighted ? "text-accent-300" : "text-accent-600"
              )}
            />
            <span className={plan.highlighted ? "text-white/90" : "text-ink-700"}>
              {f}
            </span>
          </li>
        ))}
        {plan.notIncluded?.map((f) => (
          <li key={f} className="flex items-start gap-2 opacity-60">
            <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
            <span className="text-ink-500 line-through">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
