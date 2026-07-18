import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { IconChip } from "@/components/ui/icon-chip";

interface Lesson {
  id: string;
  title: string;
  minutes: number;
  accuracy: number;
  questionCount?: number;
}

interface UpcomingLessonsProps {
  lessons: Lesson[];
}

const TONES = ["brand", "accent", "amber"] as const;

export function UpcomingLessons({ lessons }: UpcomingLessonsProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Keyingi mavzular
          </p>
          <p className="mt-1 text-sm text-ink-600">
            Rasmiy spetsifikatsiya bo&apos;yicha tavsiya etilgan ketma-ketlik.
          </p>
        </div>
        <Link
          href="/dashboard/practice"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
        >
          Barchasi
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <ul className="mt-4 divide-y divide-ink-100 border-y border-ink-100">
        {lessons.map((lesson, index) => (
          <li key={lesson.id}>
            <Link
              href={`/dashboard/practice?topic=${encodeURIComponent(lesson.id)}`}
              className="group flex items-center gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <IconChip tone={TONES[index % TONES.length]} size="sm">
                <Play strokeWidth={2.4} className="fill-current" />
              </IconChip>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink-900 group-hover:text-brand-700">
                  {lesson.title}
                </span>
                <span className="mt-0.5 block text-xs text-ink-500">
                  {lesson.questionCount ?? 0} ta savol · {lesson.minutes} daqiqa
                </span>
              </span>
              <span className="text-xs font-semibold text-ink-500">
                {lesson.accuracy ? `${lesson.accuracy}%` : "Yangi"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
