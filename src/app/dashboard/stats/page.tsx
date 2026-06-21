import { CheckCircle2, ClipboardList, LineChart, Target } from "lucide-react";
import { getSession } from "@/lib/server/auth";
import { practiceStore } from "@/lib/server/practice";
import { IconChip } from "@/components/ui/icon-chip";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function StatsPage() {
  const session = await getSession();
  const progress = session
    ? await practiceStore.getProgress(session.userId)
    : await practiceStore.getProgress("");

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <IconChip tone="brand" size="lg">
            <LineChart strokeWidth={2.2} />
          </IconChip>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Real statistika
            </p>
            <h1 className="mt-1 text-2xl font-extrabold text-ink-900">
              O&apos;quv natijalari
            </h1>
            <p className="mt-1 text-sm leading-6 text-ink-600">
              Bu raqamlar practice/test engine orqali saqlangan urinishlardan
              hisoblanadi.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          {
            label: "Urinishlar",
            value: progress.totalAttempts,
            icon: ClipboardList,
            tone: "brand" as const,
          },
          {
            label: "Savollar",
            value: progress.totalQuestions,
            icon: Target,
            tone: "accent" as const,
          },
          {
            label: "O'rtacha",
            value: `${progress.averageScore}%`,
            icon: LineChart,
            tone: "amber" as const,
          },
          {
            label: "Eng yaxshi",
            value: `${progress.bestScore}%`,
            icon: CheckCircle2,
            tone: "violet" as const,
          },
        ].map((item) => {
          const MetricIcon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100"
            >
              <IconChip tone={item.tone} size="sm">
                <MetricIcon strokeWidth={2.2} />
              </IconChip>
              <p className="mt-4 text-2xl font-extrabold text-ink-900">
                {item.value}
              </p>
              <p className="mt-1 text-sm font-medium text-ink-500">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Fanlar kesimida
          </p>
          <div className="mt-5 space-y-4">
            {progress.subjectProgress.map((subject) => (
              <div key={subject.subjectId}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink-800">{subject.name}</span>
                  <span className="font-bold text-ink-900">{subject.value}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-ink-100">
                  <span
                    className={`block h-full rounded-full ${subject.colorClass}`}
                    style={{ width: `${subject.value}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-ink-500">
                  {subject.attempts} ta urinish
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Oxirgi urinishlar
          </p>
          <div className="mt-4 space-y-3">
            {progress.recentAttempts.length ? (
              progress.recentAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="rounded-xl bg-ink-50 p-3 ring-1 ring-ink-100"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-ink-900">
                        {attempt.topicName ?? "Aralash test"}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {attempt.subjectName} · {formatDate(attempt.completedAt)}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-100">
                      {attempt.score}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-xl bg-ink-50 p-4 text-sm text-ink-600">
                Hali urinish yo&apos;q. Birinchi mashg&apos;ulotni yakunlaganingizdan
                keyin bu yerda tarix ko&apos;rinadi.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
