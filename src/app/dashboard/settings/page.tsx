import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Goal,
  Mail,
  Phone,
  Save,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { IconChip } from "@/components/ui/icon-chip";
import {
  CERTIFICATE_SUBJECTS,
  gradeForScore,
  subjectById,
} from "@/lib/onboarding/certificate";
import { createSessionCookie, getSession } from "@/lib/server/auth";
import { userStore, type UserRecord } from "@/lib/server/db";

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function parseNumber(formData: FormData, key: string): number | undefined {
  const raw = formData.get(key);
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  const value = Number(raw);
  if (!Number.isFinite(value)) return undefined;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function parseSmallNumber(formData: FormData, key: string, max: number) {
  const raw = formData.get(key);
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  const value = Number(raw);
  if (!Number.isFinite(value)) return undefined;
  return Math.max(1, Math.min(max, Math.round(value)));
}

function onboardingLabel(user: UserRecord) {
  const onboarding = user.onboarding;
  const subject = subjectById(stringValue(onboarding?.subjectId));
  const targetScore = numberValue(onboarding?.targetScore);
  const grade = gradeForScore(targetScore);

  return {
    subject: subject?.label ?? "Tanlanmagan",
    target: targetScore
      ? `${targetScore} ball${grade ? ` (${grade.label})` : ""}`
      : "Belgilanmagan",
    weeklyHours: numberValue(onboarding?.weeklyHours),
    studyDays: numberValue(onboarding?.studyDays),
  };
}

async function updateSettings(formData: FormData) {
  "use server";

  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard/settings");

  const user = await userStore.getById(session.userId);
  if (!user) redirect("/login?next=/dashboard/settings");

  const name = String(formData.get("name") ?? "").trim();
  const subjectId = String(formData.get("subjectId") ?? "");
  const resultStatus = String(formData.get("resultStatus") ?? "");
  const examDate = String(formData.get("examDate") ?? "").trim();
  const targetScore = parseNumber(formData, "targetScore");
  const currentScore = parseNumber(formData, "currentScore");
  const weeklyHours = parseSmallNumber(formData, "weeklyHours", 60);
  const studyDays = parseSmallNumber(formData, "studyDays", 7);

  const safeSubject = CERTIFICATE_SUBJECTS.some(
    (subject) => subject.id === subjectId
  )
    ? subjectId
    : undefined;
  const safeStatus = ["has-score", "not-taken", "unknown"].includes(resultStatus)
    ? resultStatus
    : undefined;

  const onboarding = {
    ...(user.onboarding ?? {}),
    ...(safeSubject ? { subjectId: safeSubject } : {}),
    ...(safeStatus ? { resultStatus: safeStatus } : {}),
    ...(typeof currentScore === "number" && safeStatus === "has-score"
      ? { currentScore }
      : { currentScore: undefined }),
    ...(typeof targetScore === "number" ? { targetScore } : {}),
    ...(typeof weeklyHours === "number" ? { weeklyHours } : {}),
    ...(typeof studyDays === "number" ? { studyDays } : {}),
    ...(examDate ? { examDate } : { examDate: undefined }),
  };

  await userStore.update(user.id, {
    name: name || user.name,
    onboarding,
  });

  if (name && name !== user.name) {
    await createSessionCookie(user.id, name);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?saved=1");
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard/settings");

  const user = await userStore.getById(session.userId);
  if (!user) redirect("/login?next=/dashboard/settings");

  const params = await searchParams;
  const saved = params?.saved === "1";
  const onboarding = user.onboarding;
  const summary = onboardingLabel(user);
  const resultStatus = stringValue(onboarding?.resultStatus) ?? "unknown";
  const subjectId = stringValue(onboarding?.subjectId) ?? "";

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
        <div className="flex items-start gap-4">
          <IconChip tone="brand" size="lg">
            <Settings strokeWidth={2.2} />
          </IconChip>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Hisob sozlamalari
            </p>
            <h1 className="mt-1 text-2xl font-extrabold text-ink-900">
              Profil va tayyorgarlik rejasi
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-600">
              Bu ma&apos;lumotlar dashboard rejasi, progress kartalari va AI tutor
              kontekstida ishlatiladi.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <form
          action={updateSettings}
          className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6"
        >
          {saved && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-100">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>Sozlamalar saqlandi va reja qayta yangilandi.</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <IconChip tone="accent" size="sm">
              <UserRound strokeWidth={2.2} />
            </IconChip>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Asosiy profil
              </p>
              <h2 className="text-lg font-extrabold text-ink-900">
                Shaxsiy reja uchun ma&apos;lumotlar
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-semibold text-ink-800">Ism</span>
              <input
                name="name"
                defaultValue={user.name}
                className="block h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                placeholder="Ismingiz"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-semibold text-ink-800">
                Tayyorlanayotgan fan
              </span>
              <select
                name="subjectId"
                defaultValue={subjectId}
                className="block h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-sm text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Fanni tanlang</option>
                {CERTIFICATE_SUBJECTS.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-semibold text-ink-800">
                Hozirgi holat
              </span>
              <select
                name="resultStatus"
                defaultValue={resultStatus}
                className="block h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-sm text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="has-score">Ballim bor</option>
                <option value="not-taken">Hali topshirmaganman</option>
                <option value="unknown">Aniq bilmayman</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-semibold text-ink-800">
                Hozirgi ball
              </span>
              <input
                name="currentScore"
                type="number"
                min={0}
                max={100}
                defaultValue={numberValue(onboarding?.currentScore) ?? ""}
                className="block h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                placeholder="Masalan, 55"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-semibold text-ink-800">
                Maqsad ball
              </span>
              <input
                name="targetScore"
                type="number"
                min={31}
                max={100}
                defaultValue={numberValue(onboarding?.targetScore) ?? ""}
                className="block h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                placeholder="Masalan, 71"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-semibold text-ink-800">
                Imtihon sanasi
              </span>
              <input
                name="examDate"
                type="date"
                defaultValue={stringValue(onboarding?.examDate) ?? ""}
                className="block h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-sm text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-semibold text-ink-800">
                Haftalik o&apos;qish soati
              </span>
              <input
                name="weeklyHours"
                type="number"
                min={1}
                max={60}
                defaultValue={numberValue(onboarding?.weeklyHours) ?? ""}
                className="block h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                placeholder="Masalan, 10"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-semibold text-ink-800">
                Haftalik o&apos;qish kunlari
              </span>
              <input
                name="studyDays"
                type="number"
                min={1}
                max={7}
                defaultValue={numberValue(onboarding?.studyDays) ?? ""}
                className="block h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                placeholder="Masalan, 5"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-ink-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-ink-600">
              Saqlangandan keyin dashboard va AI tutor yangi profilingizdan
              foydalanadi.
            </p>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600"
            >
              <Save className="h-4 w-4" />
              Saqlash
            </button>
          </div>
        </form>

        <div className="space-y-5">
          <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
            <div className="flex items-start gap-3">
              <IconChip tone="sky" size="sm">
                <Goal strokeWidth={2.2} />
              </IconChip>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Joriy reja
                </p>
                <h2 className="text-lg font-extrabold text-ink-900">
                  Profil xulosasi
                </h2>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {[
                ["Fan", summary.subject],
                ["Maqsad", summary.target],
                [
                  "O\u0027qish vaqti",
                  summary.weeklyHours && summary.studyDays
                    ? `${summary.weeklyHours} soat / ${summary.studyDays} kun`
                    : "Belgilanmagan",
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-xl bg-ink-50 px-4 py-3 ring-1 ring-ink-100"
                >
                  <span className="text-sm text-ink-500">{label}</span>
                  <span className="text-right text-sm font-bold text-ink-900">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
            <div className="flex items-start gap-3">
              <IconChip tone="emerald" size="sm">
                <ShieldCheck strokeWidth={2.2} />
              </IconChip>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Hisob xavfsizligi
                </p>
                <h2 className="text-lg font-extrabold text-ink-900">
                  Kirish ma&apos;lumotlari
                </h2>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-ink-50 px-4 py-3 ring-1 ring-ink-100">
                <Mail className="h-4 w-4 text-ink-500" />
                <span className="min-w-0 flex-1 truncate text-sm text-ink-700">
                  {user.email ?? "Email ulanmagan"}
                </span>
                {user.emailVerified && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                )}
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-ink-50 px-4 py-3 ring-1 ring-ink-100">
                <Phone className="h-4 w-4 text-ink-500" />
                <span className="min-w-0 flex-1 truncate text-sm text-ink-700">
                  {user.phone ?? "Telefon ulanmagan"}
                </span>
                {user.phoneVerified && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 p-5 ring-1 ring-brand-100">
            <div className="flex items-start gap-3">
              <IconChip tone="amber" size="sm">
                <Bell strokeWidth={2.2} />
              </IconChip>
              <div>
                <h2 className="text-sm font-bold text-ink-900">
                  Eslatma sozlamalari
                </h2>
                <p className="mt-1 text-sm leading-6 text-ink-600">
                  Hozircha eslatmalar o&apos;quv rejangizdagi haftalik maqsadga qarab
                  dashboard ichida ko&apos;rsatiladi.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-xs font-semibold text-ink-700 ring-1 ring-white">
              <CalendarDays className="h-4 w-4 text-brand-600" />
              Imtihon sanasi kiritilsa, countdown kartasi avtomatik ishlaydi.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
