import { Check, Flame } from "lucide-react";
import { IconChip } from "@/components/ui/icon-chip";

const DAYS = [
  { id: "Du", done: true },
  { id: "Se", done: true },
  { id: "Ch", done: true },
  { id: "Pa", done: true },
  { id: "Ju", done: true },
  { id: "Sh", done: false, today: true },
  { id: "Ya", done: false },
];

export function StreakCard({ streak = 7 }: { streak?: number }) {
  return (
    <article className="card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
          Seriya
        </p>
        <IconChip tone="amber" size="sm">
          <Flame strokeWidth={2.5} />
        </IconChip>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-ink-900">
        {streak} <span className="text-base font-semibold text-ink-500">kun</span>
      </p>
      <ul className="mt-4 grid grid-cols-7 gap-1.5">
        {DAYS.map((d) => (
          <li
            key={d.id}
            className={[
              "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-semibold",
              d.done
                ? "bg-accent-100 text-accent-700"
                : d.today
                  ? "bg-amber-100 text-amber-700"
                  : "bg-ink-100 text-ink-400",
            ].join(" ")}
          >
            <span className="text-[11px]">{d.id}</span>
            {d.done ? (
              <Check className="h-3 w-3" strokeWidth={3} />
            ) : d.today ? (
              <Flame className="h-3 w-3" />
            ) : (
              <span className="block h-1 w-1 rounded-full bg-ink-300" />
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}
