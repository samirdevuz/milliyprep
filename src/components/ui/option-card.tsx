import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { IconChip } from "@/components/ui/icon-chip";

type Tone = "brand" | "accent" | "amber" | "rose" | "violet" | "sky" | "emerald";

interface OptionCardProps {
  selected: boolean;
  onSelect: () => void;
  /** Lucide icon (preferred) or any ReactNode for the leading visual. */
  icon?: ReactNode;
  /** Tone applied to the leading IconChip. */
  tone?: Tone;
  title: string;
  description?: string;
  /** Show a check mark on the right when selected. */
  showCheck?: boolean;
  /** Allow multiple-select styling. */
  multi?: boolean;
}

/**
 * Tappable card used for radio/checkbox groups in onboarding.
 * The leading visual uses a soft 3D-style IconChip rather than a flat emoji.
 */
export function OptionCard({
  selected,
  onSelect,
  icon,
  tone = "brand",
  title,
  description,
  showCheck = true,
  multi = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-2xl border bg-white p-4 text-left transition-all",
        "hover:-translate-y-0.5 hover:shadow-soft",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        selected
          ? "border-brand-400 bg-brand-50/40 shadow-soft ring-2 ring-brand-200"
          : "border-ink-200"
      )}
    >
      {icon && (
        <IconChip tone={tone} size="sm">
          {icon}
        </IconChip>
      )}
      <div className="flex-1">
        <p
          className={cn(
            "text-sm font-semibold",
            selected ? "text-brand-800" : "text-ink-900"
          )}
        >
          {title}
        </p>
        {description && (
          <p className="mt-0.5 text-xs leading-relaxed text-ink-600">
            {description}
          </p>
        )}
      </div>
      {showCheck && (
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
            selected
              ? "border-brand-500 bg-brand-500 text-white"
              : "border-ink-200 bg-white"
          )}
        >
          {selected && <Check className="h-3 w-3" strokeWidth={3} />}
        </span>
      )}
    </button>
  );
}
