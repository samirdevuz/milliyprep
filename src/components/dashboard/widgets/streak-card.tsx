import { Flame } from "lucide-react";
import { IconChip } from "@/components/ui/icon-chip";
import { cn } from "@/lib/cn";

const DAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

interface StreakCardProps {
  streak?: number;
  /** Index 0..6 representing today; days before are considered done. */
  todayIndex?: number;
}

export function StreakCard({ streak = 7, todayIndex = 5 }: StreakCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          Seriya
        </p>
        <IconChip tone="amber" size="sm">
          <Flame strokeWidth={2.5} />
        </IconChip>
      </div>
      <p className="mt-2 text-2xl font-extrabold text-ink-900">
        {streak} kun
      </p>
      <div className="mt-3 flex justify-between gap-1">
        {DAYS.map((d, i) => {
          const done = i < todayIndex;
          const today = i === todayIndex;
          return (
            <div key={d} className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold transition",
                  done && "bg-accent-100 text-accent-700",
                  today && "bg-amber-100 text-amber-700 ring-2 ring-amber-300",
                  !done && !today && "bg-ink-100 text-ink-400"
                )}
              >
                {done ? "✓" : today ? <Flame className="h-3.5 w-3.5" /> : ""}
              </span>
              <span className="text-[10px] text-ink-400">{d}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
