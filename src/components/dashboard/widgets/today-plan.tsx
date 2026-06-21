import Link from "next/link";
import { CalendarCheck, Play } from "lucide-react";
import { Illustration } from "@/components/ui/illustration";

interface TodayPlanProps {
  date: string;
  subject: string;
  minutes: number;
  topic: string;
  doneTasks: number;
  totalTasks: number;
  href?: string;
}

export function TodayPlan({
  date,
  subject,
  minutes,
  topic,
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
          <h2 className="mt-2 text-2xl font-extrabold text-ink-900">
            {minutes} min · {subject}
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 w-40 max-w-full overflow-hidden rounded-full bg-ink-100">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-medium text-ink-500">
              {doneTasks}/{totalTasks} bajarildi
            </span>
          </div>
        </div>
        <Illustration
          src="/illustrations/notebook.png"
          alt="Daftar"
          width={120}
          height={120}
          className="hidden w-20 shrink-0 sm:block"
        />
      </div>

      <Link
        href={href}
        className="group mt-5 flex w-full items-center gap-3 rounded-xl bg-brand-600 p-3 text-left text-white transition hover:bg-brand-700"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
          <Play className="h-5 w-5 fill-current" />
        </span>
        <span className="flex-1">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/70">
            Davom etish
          </span>
          <span className="block text-sm font-semibold">{topic}</span>
        </span>
        <span className="rounded-md bg-white/15 px-2 py-1 text-xs font-medium">
          {minutes} min
        </span>
      </Link>
    </div>
  );
}
