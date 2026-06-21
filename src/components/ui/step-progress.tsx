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
    <ol className="flex w-full items-center">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const isLast = i === steps.length - 1;
        return (
          <li
            key={s.id}
            className={cn("flex items-center", !isLast && "flex-1")}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition",
                  done && "bg-brand-500 text-white",
                  active && "bg-brand-500 text-white shadow-ring",
                  !done && !active && "bg-ink-100 text-ink-500"
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:inline",
                  active ? "text-brand-700" : done ? "text-ink-700" : "text-ink-400"
                )}
              >
                {s.label}
              </span>
            </div>
            {!isLast && (
              <span
                className={cn(
                  "mx-2 h-0.5 flex-1 rounded-full transition",
                  done ? "bg-brand-500" : "bg-ink-200"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
