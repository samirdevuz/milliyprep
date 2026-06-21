"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

interface ExamCountdownProps {
  /** ISO date string of the exam. */
  examDate?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diff(target: number): TimeLeft {
  const now = Date.now();
  const delta = Math.max(0, target - now);
  const days = Math.floor(delta / 86_400_000);
  const hours = Math.floor((delta % 86_400_000) / 3_600_000);
  const minutes = Math.floor((delta % 3_600_000) / 60_000);
  const seconds = Math.floor((delta % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

export function ExamCountdown({ examDate }: ExamCountdownProps) {
  const [fallbackBase] = useState(() => Date.now());

  // Default to 42 days out if no date is provided (matches mockup).
  const target =
    examDate && !Number.isNaN(new Date(examDate).getTime())
      ? new Date(examDate).getTime()
      : fallbackBase + 42 * 86_400_000 + 8 * 3_600_000 + 15 * 60_000;

  const [time, setTime] = useState<TimeLeft>(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells = [
    { value: time.days, label: "kun" },
    { value: time.hours, label: "soat" },
    { value: time.minutes, label: "daqiqa" },
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-5 text-white shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
          Imtihongacha qoldi
        </p>
        <CalendarDays className="h-4 w-4 text-white/70" />
      </div>
      <div className="mt-3 flex items-end gap-2">
        {cells.map((c, i) => (
          <div key={c.label} className="flex items-end gap-2">
            <div className="text-center">
              <p className="text-3xl font-extrabold tabular-nums leading-none">
                {String(c.value).padStart(2, "0")}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-white/60">
                {c.label}
              </p>
            </div>
            {i < cells.length - 1 && (
              <span className="pb-4 text-2xl font-bold text-white/50">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
