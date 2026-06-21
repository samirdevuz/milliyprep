import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";

interface Lesson {
  id: string;
  subject: string;
  title: string;
  minutes: number;
  progress: number;
  tone: string;
}

const LESSONS: Lesson[] = [
  {
    id: "1",
    subject: "Algebra",
    title: "Tenglamalar va tengsizliklar",
    minutes: 15,
    progress: 0,
    tone: "from-brand-500 to-brand-700",
  },
  {
    id: "2",
    subject: "Geometriya",
    title: "Uchburchaklar",
    minutes: 20,
    progress: 0,
    tone: "from-accent-500 to-emerald-700",
  },
  {
    id: "3",
    subject: "Arifmetika",
    title: "Foizlar va proporsiyalar",
    minutes: 15,
    progress: 0,
    tone: "from-amber-400 to-orange-600",
  },
];

export function NextLessons() {
  return (
    <article className="card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
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
          <li key={l.id}>
            <Link
              href="/dashboard/practice"
              className="group block rounded-xl border border-ink-100 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex items-start justify-between">
                <p
                  className={`bg-gradient-to-r bg-clip-text text-[10px] font-bold uppercase tracking-widest text-transparent ${l.tone}`}
                >
                  {l.subject}
                </p>
                <PlayCircle className="h-5 w-5 text-brand-500 transition group-hover:scale-110" />
              </div>
              <p className="mt-2 line-clamp-2 text-sm font-semibold text-ink-900">
                {l.title}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-ink-500">
                <span>{l.minutes} min</span>
                <span>{l.progress}%</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
