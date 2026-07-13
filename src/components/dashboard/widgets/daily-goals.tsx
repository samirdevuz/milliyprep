"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface Goal {
  id: string;
  label: string;
  done: boolean;
}

const INITIAL: Goal[] = [
  { id: "1", label: "Reading mashg'ulotini yakunlash", done: false },
  { id: "2", label: "15 ta test savol yechish", done: true },
  { id: "3", label: "Yangi so'zlarni o'rganish (10 ta)", done: true },
  { id: "4", label: "AI chatda 1 ta savol berish", done: false },
];

export function DailyGoals({ initialGoals = INITIAL }: { initialGoals?: Goal[] }) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const doneCount = goals.filter((g) => g.done).length;

  const toggle = (id: string) =>
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );

  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          Bugungi maqsadlar
        </p>
        <span className="text-xs font-semibold text-brand-600">
          {doneCount}/{goals.length}
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {goals.map((g) => (
          <li key={g.id}>
            <button
              type="button"
              onClick={() => toggle(g.id)}
              className="flex w-full items-center gap-3 rounded-lg px-1 py-1.5 text-left transition hover:bg-ink-50"
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition",
                  g.done
                    ? "border-accent-500 bg-accent-500 text-white"
                    : "border-ink-300 bg-white"
                )}
              >
                {g.done && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span
                className={cn(
                  "text-sm",
                  g.done ? "text-ink-400 line-through" : "text-ink-700"
                )}
              >
                {g.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
