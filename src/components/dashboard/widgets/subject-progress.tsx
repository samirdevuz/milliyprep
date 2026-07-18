import { ProgressRing } from "@/components/dashboard/widgets/progress-ring";

interface SkillProgress {
  name: string;
  value: number;
  color: string;
}

interface SubjectProgressProps {
  subjects: SkillProgress[];
  overall: number;
  weeklyDelta: number;
}

export function SubjectProgress({
  subjects,
  overall,
  weeklyDelta,
}: SubjectProgressProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
      <div className="grid gap-6 sm:grid-cols-[1.4fr_1fr] sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Matematika ko&apos;nikmalari
          </p>
          <ul className="mt-4 space-y-3">
            {subjects.map((s) => (
              <li key={s.name}>
                <div className="flex items-center justify-between text-sm text-ink-700">
                  <span className="font-medium">{s.name}</span>
                  <span className="font-semibold">{s.value}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-100">
                  <span
                    className={`block h-full rounded-full ${s.color}`}
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center border-t border-ink-100 pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <ProgressRing
            value={overall}
            label={`${overall}%`}
            sublabel="Aniqlik"
          />
          <p className="mt-3 text-xs text-ink-500">
            Haftalik urinish:{" "}
            <span className="font-semibold text-accent-600">
              {weeklyDelta} ta
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
