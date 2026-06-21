import Link from "next/link";
import { ArrowRight, Route, Target } from "lucide-react";
import { getSession } from "@/lib/server/auth";
import { practiceStore } from "@/lib/server/practice";
import { IconChip } from "@/components/ui/icon-chip";

export default async function PlanPage() {
  const session = await getSession();
  const catalog = session
    ? await practiceStore.getCatalog(session.userId)
    : await practiceStore.getCatalog("");
  const weeklyPercent = Math.min(
    100,
    Math.round(
      (catalog.progress.weeklyCompleted / catalog.progress.weeklyTarget) * 100
    )
  );
  const recommended = catalog.topics
    .slice()
    .sort((a, b) => a.accuracy - b.accuracy || a.attempts - b.attempts)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <IconChip tone="brand" size="lg">
              <Route strokeWidth={2.2} />
            </IconChip>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Real study plan
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-ink-900">
                Mening rejam
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-600">
                Reja urinishlar tarixiga qarab zaifroq mavzularni yuqoriga
                chiqaradi.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/practice"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600"
          >
            Mashg&apos;ulot boshlash
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
          <IconChip tone="accent" size="sm">
            <Target strokeWidth={2.2} />
          </IconChip>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-500">
            Haftalik reja
          </p>
          <p className="mt-2 text-3xl font-extrabold text-ink-900">
            {catalog.progress.weeklyCompleted}/{catalog.progress.weeklyTarget}
          </p>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-ink-100">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
              style={{ width: `${weeklyPercent}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-ink-600">
            Bu hafta yana{" "}
            <span className="font-bold text-ink-900">
              {Math.max(
                0,
                catalog.progress.weeklyTarget - catalog.progress.weeklyCompleted
              )}
            </span>{" "}
            ta mashg&apos;ulot yakunlang.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Tavsiya qilingan navbat
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {recommended.map((topic, index) => (
              <Link
                key={topic.id}
                href={`/dashboard/practice?topic=${encodeURIComponent(topic.id)}`}
                className="group rounded-xl border border-ink-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-brand-600">
                      {index + 1}-navbat
                    </p>
                    <h2 className="mt-1 text-sm font-bold text-ink-900">
                      {topic.name}
                    </h2>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {topic.subjectName} · {topic.estimatedMinutes} min
                    </p>
                  </div>
                  <span className="rounded-full bg-ink-50 px-2 py-1 text-xs font-bold text-ink-700 ring-1 ring-ink-100">
                    {topic.attempts ? `${topic.accuracy}%` : "Yangi"}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-5 text-ink-600">
                  {topic.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
