import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "brand" | "accent" | "amber" | "rose" | "violet" | "sky" | "emerald";
type Size = "sm" | "md" | "lg";

interface IconChipProps {
  children: ReactNode;
  tone?: Tone;
  size?: Size;
  className?: string;
}

const TONE: Record<Tone, string> = {
  brand:
    "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-[0_8px_20px_-8px_rgba(91,108,245,0.55)] ring-1 ring-inset ring-white/20",
  accent:
    "bg-gradient-to-br from-accent-400 to-accent-600 text-white shadow-[0_8px_20px_-8px_rgba(16,185,129,0.55)] ring-1 ring-inset ring-white/20",
  amber:
    "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-[0_8px_20px_-8px_rgba(217,119,6,0.55)] ring-1 ring-inset ring-white/20",
  rose:
    "bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-[0_8px_20px_-8px_rgba(225,29,72,0.45)] ring-1 ring-inset ring-white/20",
  violet:
    "bg-gradient-to-br from-violet-400 to-violet-600 text-white shadow-[0_8px_20px_-8px_rgba(124,58,237,0.45)] ring-1 ring-inset ring-white/20",
  sky:
    "bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-[0_8px_20px_-8px_rgba(14,165,233,0.45)] ring-1 ring-inset ring-white/20",
  emerald:
    "bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-[0_8px_20px_-8px_rgba(5,150,105,0.45)] ring-1 ring-inset ring-white/20",
};

const SIZE: Record<Size, string> = {
  sm: "h-9 w-9 [&_svg]:h-4 [&_svg]:w-4",
  md: "h-12 w-12 [&_svg]:h-5 [&_svg]:w-5",
  lg: "h-16 w-16 [&_svg]:h-7 [&_svg]:w-7",
};

/**
 * Soft 3D-style icon chip — a colored gradient tile with a subtle
 * highlight and shadow. Used in place of flat emojis or icons.
 * The icon is sized via a descendant `svg` selector so it always sits
 * centered and square regardless of the icon's intrinsic size.
 */
export function IconChip({
  children,
  tone = "brand",
  size = "md",
  className,
}: IconChipProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-2xl",
        TONE[tone],
        SIZE[size],
        className
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-1 top-1 h-1/3 rounded-xl bg-white/25 blur-sm"
      />
      <span className="relative flex items-center justify-center">
        {children}
      </span>
    </span>
  );
}
