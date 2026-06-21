"use client";

import { useState } from "react";
import { ChevronRight, PlayCircle } from "lucide-react";
import { Illustration } from "@/components/ui/illustration";

interface PlanProps {
  date: string;
  totalMinutes: number;
  topic: string;
  goal: { current: number; total: number };
  current: { title: string; subtitle: string; minutes: number };
}

const DEFAULT: PlanProps = {
  date: "28-may, Yakshanba",
  totalMinutes: 25,
  topic: "Algebra",
  goal: { current: 0, total: 2 },
  current: {
    title: "Davom etish",
    subtitle: "Algebra · Darajalar va ildizlar",
    minutes: 15,
  },
};

export function TodaysPlan({ data = DEFAULT }: { data?: PlanProps }) {
  const [hover, setHover] = useState(false);
  const pct = Math.round((data.goal.current / data.goal.total) * 100);

  return (
    <article className="card relative overflow-hidden p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            Bugungi reja · {data.date}
          </p>
          <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            {data.totalMinutes} min · {data.topic}
          </h3>
          <div className="mt-3 flex items-center gap-3 text-xs text-ink-600">
            <span>
              Kunlik maqsad: {data.goal.total} ta mashg&apos;ulot
            </span>
            <span className="font-mono text-ink-500">
              {data.goal.current}/{data.goal.total}
            </span>
          </div>
          <div className="mt-2 h-1.5 max-w-xs overflow-hidden rounded-full bg-ink-100">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <Illustration
          src="/illustrations/notebook.png"
          alt="Bugungi rejada daftar va ruchka"
          width={220}
          height={220}
          className="hidden max-w-[160px] sm:block"
          fallbackClassName="hidden max-w-[160px] sm:block"
        />
      </div>

      <button
        type="button"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="mt-5 flex w-full items-center gap-3 rounded-xl bg-brand-500 p-3 text-left text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-ring"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
          <PlayCircle className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
            {data.current.title}
          </p>
          <p className="text-sm font-semibold">{data.current.subtitle}</p>
        </div>
        <span className="rounded-md bg-white/15 px-2 py-1 text-xs font-semibold">
          {data.current.minutes} min
        </span>
        <ChevronRight
          className={[
            "h-5 w-5 shrink-0 transition-transform",
            hover ? "translate-x-1" : "",
          ].join(" ")}
        />
      </button>
    </article>
  );
}
