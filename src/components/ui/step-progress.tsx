import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface StepProgressProps {
  steps: { id: string; label: string }[];
  current: number;
}

/**
 * Horizontal step indicator used at the top of multi-step flows.
 * On mobile only the current step is shown; on >= sm all labels are visible.
 */
export function StepProgress({ steps, current }: StepProgressProps) {
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
            Qadam {current + 1} / {steps.length}
          </p>
          <p className="mt-1 text-sm font-bold text-ink-950">
            {steps[current]?.label}
          </p>
        </div>
        <p className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
          {Math.round(((current + 1) / steps.length) * 100)}%
        </p>
      </div>

      <ol className="flex w-full items-center">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          const isLast = i === steps.length - 1;
          return (
            <li
              key={s.id}
              className={cn("flex min-w-0 items-center", !isLast && "flex-1")}
            >
              <span
                aria-label={s.label}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-black transition",
                  done && "border-brand-500 bg-brand-500 text-white",
                  active && "border-brand-500 bg-white text-brand-700 shadow-ring",
                  !done && !active && "border-ink-200 bg-white text-ink-400"
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
              </span>
              {!isLast && (
                <span className="mx-2 h-1 flex-1 overflow-hidden rounded-full bg-ink-100">
                  <span
                    className={cn(
                      "block h-full rounded-full transition-all duration-300",
                      done ? "w-full bg-brand-500" : "w-0 bg-brand-500"
                    )}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
