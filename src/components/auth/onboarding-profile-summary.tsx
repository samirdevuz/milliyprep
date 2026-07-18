"use client";

import { BookOpenCheck, CalendarDays, CreditCard, Target } from "lucide-react";
import { IconChip } from "@/components/ui/icon-chip";
import { gradeForScore, subjectById } from "@/lib/onboarding/certificate";
import { useSavedOnboarding } from "@/lib/onboarding/use-saved-onboarding";
import { PLANS } from "@/lib/pricing";

function scoreLabel(score?: number): string {
  if (typeof score !== "number") return "Belgilanmagan";
  const grade = gradeForScore(score);
  return grade ? `${score} ball (${grade.label})` : `${score} ball`;
}

function currentLabel(status?: string, score?: number): string {
  if (status === "has-score") return scoreLabel(score);
  if (status === "not-taken") return "Hali topshirmagan";
  if (status === "unknown") return "Aniq bilmaydi";
  return "Belgilanmagan";
}

export function OnboardingProfileSummary({
  planId,
}: {
  planId?: string | null;
}) {
  const { data, hydrated } = useSavedOnboarding();
  const subject = subjectById(data?.subjectId);
  const plan = PLANS.find((item) => item.id === planId);

  if (
    !hydrated ||
    !data ||
    Object.keys(data).length === 0 ||
    subject?.availability !== "live"
  ) {
    return null;
  }

  const rows = [
    {
      icon: <BookOpenCheck className="h-4 w-4" />,
      label: "Fan",
      value: subject?.label ?? "Tanlanmagan",
    },
    {
      icon: <Target className="h-4 w-4" />,
      label: "Maqsad",
      value: scoreLabel(data.targetScore),
    },
    {
      icon: <CalendarDays className="h-4 w-4" />,
      label: "Ritm",
      value:
        data.weeklyHours && data.studyDays
          ? `${data.weeklyHours} soat · ${data.studyDays} kun`
          : "Belgilanmagan",
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      label: "Tarif",
      value: plan?.name ?? "Keyin tanlanadi",
    },
  ];

  return (
    <div className="mb-5 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
      <div className="flex items-start gap-3">
        <IconChip tone="brand" size="sm">
          <Target className="h-4 w-4" />
        </IconChip>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-ink-900">
            Onboarding profilingiz
          </p>
          <p className="mt-1 text-xs leading-5 text-ink-600">
            {currentLabel(data.resultStatus, data.currentScore)} holatdan shaxsiy
            reja boshlanadi.
          </p>
        </div>
      </div>

      <dl className="mt-4 grid gap-2 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-brand-100/70"
          >
            <span className="text-brand-600">{row.icon}</span>
            <div className="min-w-0">
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-400">
                {row.label}
              </dt>
              <dd className="truncate text-sm font-bold text-ink-900">
                {row.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
