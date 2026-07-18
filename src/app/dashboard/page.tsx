import { Hand, Target } from "lucide-react";
import { TodayPlan } from "@/components/dashboard/widgets/today-plan";
import { ExamCountdown } from "@/components/dashboard/widgets/exam-countdown";
import { StreakCard } from "@/components/dashboard/widgets/streak-card";
import { SubjectProgress } from "@/components/dashboard/widgets/subject-progress";
import { DailyGoals } from "@/components/dashboard/widgets/daily-goals";
import { UpcomingLessons } from "@/components/dashboard/widgets/upcoming-lessons";
import { IconChip } from "@/components/ui/icon-chip";
import { getSession } from "@/lib/server/auth";
import { userStore } from "@/lib/server/db";
import { practiceStore } from "@/lib/server/practice";

const SKILL_COLORS = [
  "bg-brand-500",
  "bg-accent-500",
  "bg-amber-400",
  "bg-sky-500",
];

function firstNameOf(value?: string): string {
  const name = value?.trim();
  if (!name) return "o'quvchi";
  return name.split(/\s+/)[0] ?? name;
}

function stringFromOnboarding(
  onboarding: Record<string, unknown> | undefined,
  key: string
) {
  const value = onboarding?.[key];
  return typeof value === "string" ? value : undefined;
}

function numberFromOnboarding(
  onboarding: Record<string, unknown> | undefined,
  key: string
) {
  const value = onboarding?.[key];
  return typeof value === "number" ? value : undefined;
}

export default async function DashboardHome() {
  const session = await getSession();
  const [user, catalog] = await Promise.all([
    session ? userStore.getById(session.userId) : undefined,
    session ? practiceStore.getCatalog(session.userId) : undefined,
  ]);

  const progress = catalog?.progress;
  const nextTopic =
    progress?.topicProgress
      .slice()
      .sort((a, b) => a.accuracy - b.accuracy || a.attempts - b.attempts)[0] ??
    catalog?.topics[0];
  const name = firstNameOf(user?.name);
  const examDate = stringFromOnboarding(user?.onboarding, "examDate");
  const targetScore = numberFromOnboarding(user?.onboarding, "targetScore");
  const weeklyPercent = Math.min(
    100,
    Math.round(
      ((progress?.weeklyCompleted ?? 0) / (progress?.weeklyTarget ?? 5)) * 100
    )
  );

  const today = new Date().toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Greeting */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-extrabold text-ink-900 sm:text-2xl">
            Salom, {name}
            <Hand className="h-5 w-5 text-amber-500" />
          </h1>
          <p className="mt-0.5 text-sm text-ink-500">
            {progress?.totalAttempts
              ? `Hozirgacha ${progress.totalQuestions} ta savol yechildi.`
              : "Birinchi mashg'ulotni boshlang va progress real yurishni boshlaydi."}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">
          <TodayPlan
            date={today}
            subject={nextTopic?.subjectName ?? "Matematika"}
            minutes={nextTopic?.estimatedMinutes ?? 15}
            topic={nextTopic?.name ?? "Sonlar va algebraik ifodalar"}
            questionCount={nextTopic?.questionCount ?? 5}
            doneTasks={progress?.completedToday ?? 0}
            totalTasks={2}
            href="/dashboard/practice"
          />
          <SubjectProgress
            subjects={
              progress?.topicProgress.map((topic, index) => ({
                name: topic.name,
                value: topic.accuracy,
                color: SKILL_COLORS[index % SKILL_COLORS.length],
              })) ?? []
            }
            overall={progress?.averageScore ?? 0}
            weeklyDelta={progress?.weeklyCompleted ?? 0}
          />
          <UpcomingLessons
            lessons={
              catalog?.topics
                .filter((topic) => topic.id !== nextTopic?.id)
                .slice(0, 3)
                .map((topic) => ({
                  id: topic.id,
                  title: topic.name,
                  minutes: topic.estimatedMinutes,
                  accuracy: topic.accuracy,
                  questionCount: topic.questionCount,
                })) ?? []
            }
          />
        </div>

        {/* Side column */}
        <div className="space-y-5">
          <ExamCountdown examDate={examDate} />
          <StreakCard
            streak={progress?.streakDays ?? 0}
            todayIndex={(new Date().getDay() + 6) % 7}
          />
          <DailyGoals
            initialGoals={[
              {
                id: "practice",
                label: "Bugun 1 ta mashg'ulot yakunlash",
                done: Boolean(progress && progress.completedToday >= 1),
              },
              {
                id: "questions",
                label: "Kamida 10 ta savol yechish",
                done: Boolean(progress && progress.questionsToday >= 10),
              },
              {
                id: "weekly",
                label: `Haftalik ${progress?.weeklyTarget ?? 5} ta urinish rejasiga yaqinlashish`,
                done: Boolean(
                  progress && progress.weeklyCompleted >= progress.weeklyTarget
                ),
              },
              {
                id: "target",
                label: targetScore
                  ? `${targetScore}+ ball maqsadiga xizmat qiladigan mashq ishlash`
                  : "Maqsad ballingizni onboardingda belgilang",
                done: Boolean(
                  progress &&
                    targetScore &&
                    progress.averageScore >= targetScore
                ),
              },
            ]}
          />

          <div className="flex items-start gap-3 rounded-2xl bg-brand-50 p-5 ring-1 ring-brand-100">
            <IconChip tone="brand" size="sm">
              <Target strokeWidth={2.25} />
            </IconChip>
            <div>
              <p className="text-sm font-semibold text-ink-900">
                Har kuni o&apos;zingni o&apos;tgandan yaxshiroq qil.
              </p>
              <p className="mt-1 text-xs text-ink-600">
                Har bir saqlangan test dashboarddagi progressni yangilaydi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly goal bar */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <IconChip tone="accent" size="sm">
            <Target strokeWidth={2.25} />
          </IconChip>
          <p className="text-sm text-ink-700">
            Haftalik maqsadingizga erishish uchun yana{" "}
            <span className="font-semibold text-ink-900">
              {Math.max(
                0,
                (progress?.weeklyTarget ?? 5) - (progress?.weeklyCompleted ?? 0)
              )}{" "}
              ta
            </span>{" "}
            mashg&apos;ulot
            yakunlang.
          </p>
        </div>
        <div className="flex flex-1 items-center gap-3 sm:justify-end">
          <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-ink-100">
            <span
              className="block h-full rounded-full bg-brand-500"
              style={{ width: `${weeklyPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-ink-700">
            {weeklyPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
