"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

interface CountdownProps {
  /** ISO date string for the exam. Defaults to ~42 days from now. */
  date?: string;
}

function CountdownCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-extrabold tabular-nums text-ink-900 sm:text-3xl">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-ink-500">
        {label}
      </span>
    </div>
  );
}

/**
 * Live exam countdown card that ticks every second.
 */
export function Countdown({ date }: CountdownProps) {
  const [fallbackBase] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const parsedTarget = new Date(date ?? "").getTime();
  const target =
    parsedTarget ||
    fallbackBase + 42 * 24 * 3600_000 + 8 * 3600_000 + 15 * 60_000;

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (24 * 3600_000));
  const hours = Math.floor((diff / 3600_000) % 24);
  const minutes = Math.floor((diff / 60_000) % 60);

  return (
    <article className="card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
          Imtihongacha qoldi
        </p>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <CalendarDays className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <CountdownCell value={days} label="Kun" />
        <span className="pb-6 text-2xl font-bold text-ink-300">:</span>
        <CountdownCell value={hours} label="Soat" />
        <span className="pb-6 text-2xl font-bold text-ink-300">:</span>
        <CountdownCell value={minutes} label="Daqiqa" />
      </div>
    </article>
  );
}
