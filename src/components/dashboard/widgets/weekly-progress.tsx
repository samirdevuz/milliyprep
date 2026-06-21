import { Target } from "lucide-react";
import { IconChip } from "@/components/ui/icon-chip";

export function WeeklyProgress({ value = 65 }: { value?: number }) {
  return (
    <article className="card p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <IconChip tone="brand" size="sm">
          <Target strokeWidth={2.5} />
        </IconChip>
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink-900">
            Haftalik maqsadingizga erishish uchun yana 5 ta mashg&apos;ulot
            yakunlang.
          </p>
        </div>
        <span className="hidden text-2xl font-extrabold text-ink-900 sm:inline">
          {value}%
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
          <span
            className="block h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-sm font-bold text-ink-900 sm:hidden">
          {value}%
        </span>
      </div>
    </article>
  );
}
