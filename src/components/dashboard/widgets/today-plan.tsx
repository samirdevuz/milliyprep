import Link from "next/link";
import { CalendarCheck, Play, ShieldCheck } from "lucide-react";

interface TodayPlanProps {
  date: string;
  subject: string;
  minutes: number;
  topic: string;
  questionCount?: number;
  sourceLabel?: string;
  doneTasks: number;
  totalTasks: number;
  href?: string;
}

export function TodayPlan({
  date,
  subject,
  minutes,
  topic,
  questionCount = 5,
  sourceLabel = "UZBMB spetsifikatsiyasiga mos",
  doneTasks,
  totalTasks,
  href = "/dashboard/practice",
}: TodayPlanProps) {
  const pct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-500">
            <CalendarCheck className="h-3.5 w-3.5" />
            Bugungi reja · {date}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900">
            Bugungi asosiy mashq
          </h2>
          <p className="mt-1 text-sm font-semibold text-brand-700">{subject}</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 w-40 max-w-full overflow-hidden rounded-full bg-ink-100">
              <span
                className="block h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-medium text-ink-500">
              {doneTasks}/{totalTasks} bajarildi
            </span>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 rounded-lg border border-ink-100 bg-ink-50 px-2.5 py-1.5 text-xs font-semibold text-ink-600 sm:inline-flex">
          <ShieldCheck className="h-3.5 w-3.5 text-accent-600" />
          {sourceLabel}
        </span>
      </div>

      <Link
        href={href}
        className="group mt-5 flex w-full items-center gap-3 rounded-xl bg-brand-600 p-3 text-left text-white transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
          <Play className="h-5 w-5 fill-current" />
        </span>
        <span className="flex-1">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/75">
            {questionCount} ta savol · {minutes} daqiqa
          </span>
          <span className="block text-sm font-semibold">{topic}</span>
        </span>
        <span className="rounded-md bg-white/15 px-2 py-1 text-xs font-semibold">
          Boshlash
        </span>
      </Link>
    </div>
  );
}
