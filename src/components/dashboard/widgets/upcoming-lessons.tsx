import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { IconChip } from "@/components/ui/icon-chip";

interface Lesson {
  subject: string;
  title: string;
  minutes: number;
  progress: number;
  tone: "brand" | "accent" | "amber" | "violet";
}

const LESSONS: Lesson[] = [
  {
    subject: "Algebra",
    title: "Tenglamalar va tengsizliklar",
    minutes: 15,
    progress: 0,
    tone: "brand",
  },
  {
    subject: "Geometriya",
    title: "Uchburchaklar",
    minutes: 20,
    progress: 0,
    tone: "accent",
  },
  {
    subject: "Arifmetika",
    title: "Foiz va proporsiyalar",
    minutes: 15,
    progress: 0,
    tone: "amber",
  },
];

export function UpcomingLessons() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          Keyingi mashg&apos;ulotlar
        </p>
        <Link
          href="/dashboard/practice"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
        >
          Barchasi
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {LESSONS.map((l) => (
          <li
            key={l.title}
            className="group rounded-xl border border-ink-100 p-4 transition hover:border-brand-200 hover:shadow-soft"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">
                {l.subject}
              </span>
              <IconChip tone={l.tone} size="sm">
                <Play strokeWidth={2.5} className="fill-current" />
              </IconChip>
            </div>
            <p className="mt-3 text-sm font-semibold text-ink-900">{l.title}</p>
            <p className="mt-1 text-xs text-ink-500">
              {l.minutes} min · {l.progress}%
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
