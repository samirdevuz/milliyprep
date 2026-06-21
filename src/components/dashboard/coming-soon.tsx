import type { LucideIcon } from "lucide-react";
import { IconChip } from "@/components/ui/icon-chip";

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: "brand" | "accent" | "amber" | "violet";
}

export function ComingSoon({
  icon: Icon,
  title,
  description,
  tone = "brand",
}: ComingSoonProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center rounded-2xl bg-white p-10 text-center shadow-soft ring-1 ring-ink-100">
        <IconChip tone={tone} size="lg">
          <Icon strokeWidth={2} />
        </IconChip>
        <span className="mt-5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          Ko&apos;p o&apos;tmay
        </span>
        <h1 className="mt-3 text-2xl font-bold text-ink-900">{title}</h1>
        <p className="mt-2 max-w-md text-sm text-ink-600">{description}</p>
      </div>
    </div>
  );
}
