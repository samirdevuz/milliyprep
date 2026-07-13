import {
  Bell,
  BookOpen,
  ClipboardList,
  Flame,
  GraduationCap,
  Hand,
  Home,
  LineChart,
  MessageCircle,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { IconChip } from "@/components/ui/icon-chip";

const SIDEBAR_ITEMS = [
  { icon: Home, label: "Bosh sahifa", active: true },
  { icon: GraduationCap, label: "Mening rejam" },
  { icon: BookOpen, label: "Mashg'ulotlar" },
  { icon: ClipboardList, label: "Testlar" },
  { icon: LineChart, label: "Statistika" },
  { icon: MessageCircle, label: "Chat AI", badge: "YANGI" },
];

const SUBJECTS = [
  { name: "Listening", value: 72, color: "bg-brand-500" },
  { name: "Reading", value: 55, color: "bg-accent-500" },
  { name: "Writing", value: 31, color: "bg-amber-400" },
];

const DAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

/**
 * Decorative dashboard preview shown in the hero. Static layout that
 * mirrors the in-app experience without any data wiring.
 */
export function DashboardPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-200/50 via-white to-accent-200/40 blur-2xl"
      />

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink-100">
        <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[150px_1fr]">
          <aside className="border-r border-ink-100 bg-ink-50/40 p-3">
            <div className="flex items-center gap-1.5 px-1 pb-3">
              <Logo size={20} withWordmark={false} />
              <span className="text-[11px] font-bold tracking-tight text-ink-900">
                Milliy<span className="text-brand-600">Prep</span>
              </span>
            </div>
            <ul className="space-y-1">
              {SIDEBAR_ITEMS.map(({ icon: Icon, label, active, badge }) => (
                <li key={label}>
                  <span
                    className={[
                      "flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-medium",
                      active
                        ? "bg-brand-50 text-brand-700"
                        : "text-ink-600 hover:bg-white",
                    ].join(" ")}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="truncate">{label}</span>
                    {badge && (
                      <span className="ml-auto rounded-full bg-accent-100 px-1.5 py-0.5 text-[8px] font-bold text-accent-700">
                        {badge}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="space-y-3 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <p className="text-sm font-bold text-ink-900 sm:text-base">
                  Salom, Jasur
                </p>
                <Hand className="h-4 w-4 text-amber-500" />
              </div>
              <button
                type="button"
                className="rounded-full bg-ink-100 p-1.5 text-ink-600"
                aria-label="Bildirishnomalar"
              >
                <Bell className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 p-3 text-white">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/70">
                Bugungi reja · 28-may
              </p>
              <p className="mt-1 text-sm font-bold text-white sm:text-base">
                25 min · Reading
              </p>
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-white/15 p-2">
                <PlayCircle className="h-5 w-5" />
                <div className="flex-1 text-[10px]">
                  <p className="font-semibold">Davom etish</p>
                  <p className="opacity-80">Dalil va detal</p>
                </div>
                <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-medium">
                  15 min
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-3 rounded-xl border border-ink-100 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-ink-500">
                  Fanlar bo&apos;yicha
                </p>
                <ul className="mt-2 space-y-2">
                  {SUBJECTS.map((s) => (
                    <li key={s.name}>
                      <div className="flex items-center justify-between text-[10px] text-ink-700">
                        <span>{s.name}</span>
                        <span className="font-semibold">{s.value}%</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-100">
                        <span
                          className={`block h-full ${s.color}`}
                          style={{ width: `${s.value}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-2 space-y-3">
                <div className="rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 p-3 text-white">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-white/70">
                    Imtihonga
                  </p>
                  <p className="mt-1 font-bold leading-tight">
                    <span className="text-2xl">42</span>
                    <span className="text-sm"> kun</span>
                  </p>
                  <p className="text-[9px] text-white/70">08 soat 15 daq</p>
                </div>
                <div className="rounded-xl border border-ink-100 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-ink-500">
                      Seriya
                    </p>
                    <IconChip tone="amber" size="sm">
                      <Flame strokeWidth={2.5} />
                    </IconChip>
                  </div>
                  <p className="mt-1 text-base font-bold text-ink-900">7 kun</p>
                  <div className="mt-1 flex gap-0.5">
                    {DAYS.map((d, i) => (
                      <span
                        key={d}
                        className={[
                          "flex h-3.5 w-3.5 items-center justify-center rounded text-[7px] font-semibold",
                          i < 5
                            ? "bg-accent-100 text-accent-700"
                            : i === 5
                              ? "bg-amber-100 text-amber-700"
                              : "bg-ink-100 text-ink-400",
                        ].join(" ")}
                      >
                        {d[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 left-1/2 hidden w-56 -translate-x-1/2 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-ink-100 sm:block sm:left-auto sm:right-4 sm:translate-x-0 lg:-left-10 lg:right-auto">
        <div className="flex items-center gap-2">
          <IconChip tone="brand" size="sm">
            <Sparkles strokeWidth={2.25} />
          </IconChip>
          <div>
            <p className="text-xs font-bold text-ink-900">AI yordamching</p>
            <p className="text-[10px] text-ink-500">Savollaringiz bormi?</p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-ink-600">
          AI tutor 24/7 yordam beradi
        </p>
        <button
          type="button"
          className="mt-2 w-full rounded-lg bg-brand-50 py-1.5 text-[11px] font-semibold text-brand-700 hover:bg-brand-100"
        >
          Chat boshlash →
        </button>
      </div>
    </div>
  );
}
