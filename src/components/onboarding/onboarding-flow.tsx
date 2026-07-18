"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  Check,
  ClipboardCheck,
  Compass,
  GraduationCap,
  HelpCircle,
  Lock,
  MessageCircle,
  ShieldCheck,
  Target,
  TimerReset,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { IconChip } from "@/components/ui/icon-chip";
import { Input } from "@/components/ui/input";
import { StepProgress } from "@/components/ui/step-progress";
import { OnboardingSidePanel } from "@/components/onboarding/side-panel";
import { cn } from "@/lib/cn";
import {
  AVAILABLE_CERTIFICATE_SUBJECTS,
  CERTIFICATE_SUBJECTS,
  clampScore,
  gradeForScore,
  projectedScore,
  subjectById,
} from "@/lib/onboarding/certificate";
import { useOnboarding } from "@/lib/onboarding/store";
import { STEPS, type OnboardingState } from "@/lib/onboarding/types";
import { validateStep } from "@/lib/onboarding/validate";

type Errors = Partial<Record<string, string>>;
type Tone = "brand" | "accent" | "amber" | "rose" | "violet" | "sky" | "emerald";

const PURPOSES: {
  value: NonNullable<OnboardingState["examPurpose"]>;
  title: string;
  caption: string;
  icon: ReactNode;
  tone: Tone;
}[] = [
  {
    value: "university",
    title: "Universitetga kirish",
    caption: "Qabul, grant yoki magistratura uchun aniq reja",
    icon: <GraduationCap />,
    tone: "brand",
  },
  {
    value: "work",
    title: "Ish / malaka oshirish",
    caption: "Lavozim, ustama yoki karyera imkoniyati",
    icon: <Target />,
    tone: "accent",
  },
  {
    value: "teacher",
    title: "O'qituvchilik talabi",
    caption: "Attestatsiya va kasbiy natijani mustahkamlash",
    icon: <BookOpenCheck />,
    tone: "amber",
  },
  {
    value: "self",
    title: "O'zimni sinash",
    caption: "Darajamni bilish va barqaror o'sish",
    icon: <Compass />,
    tone: "sky",
  },
  {
    value: "other",
    title: "Boshqa maqsad",
    caption: "Maqsadingizni qisqacha yozasiz",
    icon: <MessageCircle />,
    tone: "violet",
  },
];

const REFERRALS: {
  value: NonNullable<OnboardingState["referralSource"]>;
  title: string;
}[] = [
  { value: "instagram", title: "Instagram" },
  { value: "telegram", title: "Telegram" },
  { value: "friend", title: "Do'st yoki oila" },
  { value: "teacher", title: "Maktab yoki o'qituvchi" },
  { value: "google", title: "Google" },
  { value: "other", title: "Boshqa" },
];

function firstNameOf(fullName?: string): string {
  const name = fullName?.trim();
  if (!name) return "o'quvchi";
  return name.split(/\s+/)[0] ?? "o'quvchi";
}

function currentScoreLabel(state: OnboardingState): string {
  if (state.resultStatus === "has-score" && typeof state.currentScore === "number") {
    const grade = gradeForScore(state.currentScore)?.label;
    return grade ? `${state.currentScore} ball (${grade})` : `${state.currentScore} ball`;
  }
  if (state.resultStatus === "not-taken") return "Hali topshirmagan";
  return "Aniq bilmaydi";
}

function studyTimeLabel(state: OnboardingState): string {
  const hours = state.weeklyHours ?? 5;
  const days = state.studyDays ?? 5;
  return `Haftada ${hours} soat · ${days} kun`;
}

function stepCopy(step: number, state: OnboardingState) {
  const name = firstNameOf(state.fullName);
  const subject = subjectById(state.subjectId);

  switch (step) {
    case 0:
      return {
        eyebrow: "Boshlaymiz",
        title: "Ismingiz nima?",
        description: "Keyingi savollarni shaxsiyroq qilish uchun faqat ismingiz kerak.",
      };
    case 1:
      return {
        eyebrow: `Salom, ${name}`,
        title: "Qaysi fan bo'yicha Milliy Sertifikatga tayyorlanyapsiz?",
        description: "Reja fan formatiga, baholash mezoniga va savol turiga moslashadi.",
      };
    case 2:
      return {
        eyebrow: subject?.label ?? "Hozirgi nuqta",
        title: `${name}, hozirgi natijangiz qanday?`,
        description: "Topshirgan bo'lsangiz ballni kiriting, hali topshirmagan bo'lsangiz shuni belgilang.",
      };
    case 3:
      return {
        eyebrow: "Maqsad",
        title: `${name}, qaysi ballga chiqmoqchisiz?`,
        description: "Milliy Sertifikat 100 ballik tizimda baholanadi. Maqsad hozirgi natijadan yuqori bo'lishi kerak.",
      };
    case 4:
      return {
        eyebrow: "O'qish ritmi",
        title: "Haftasiga qancha vaqt ajrata olasiz?",
        description: "Reja siz tanlagan real vaqtga qarab vazifalarni taqsimlaydi.",
      };
    case 5:
      return {
        eyebrow: "Motivatsiya",
        title: `${name}, Milliy Sertifikat sizga nima uchun kerak?`,
        description: "Maqsadni bilsak, vazifalar va eslatmalarni to'g'ri ohangda beramiz.",
      };
    case 6:
      return {
        eyebrow: "Baholash tizimi",
        title: "Reja Milliy Sertifikat baholash mantiqiga tayangan.",
        description: "Til fanlarida CEFR ko'nikmalari, boshqa fanlarda 100 ballik natija va daraja oralig'i hisobga olinadi.",
      };
    case 7:
      return {
        eyebrow: "Profil tayyor",
        title: `${name}, mana sizning tayyorgarlik profilingiz.`,
        description: "Shu ma'lumotlar asosida shaxsiy reja va dashboard yaratiladi.",
      };
    case 8:
      return {
        eyebrow: "Oxirgi savol",
        title: "Bizni qayerdan eshitdingiz?",
        description: "Bu savol majburiy emas, lekin mahsulotni yaxshilashga yordam beradi.",
      };
    case 9:
      return {
        eyebrow: `${name}, rejangiz hisoblandi`,
        title: `Taxminiy natijangiz: ${projectedScore(state.currentScore, state.targetScore)} ball`,
        description: `${currentScoreLabel(state)} dan ${state.targetScore ?? projectedScore(state.currentScore, state.targetScore)} ballgacha chiqish uchun yo'l xaritasi tayyor.`,
      };
    default:
      return {
        eyebrow: "Yo'l xaritasi",
        title: "Nimani kutish mumkin?",
        description: "Reja diagnostika, format, zaif joylar va imtihon tayyorgarligini bosqichma-bosqich yopadi.",
      };
  }
}

function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-2 text-sm font-semibold text-rose-600">{children}</p>;
}

function ChoiceCard({
  selected,
  onSelect,
  title,
  caption,
  icon,
  tone = "brand",
  disabled = false,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  caption?: string;
  icon?: ReactNode;
  tone?: Tone;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "group flex min-h-[92px] w-full items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        disabled && "cursor-not-allowed border-ink-100 bg-ink-50/70 opacity-70",
        selected
          ? "border-brand-400 bg-brand-50/70 shadow-soft ring-2 ring-brand-200"
          : !disabled &&
              "border-ink-100 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
      )}
    >
      {icon && (
        <IconChip tone={tone} size="sm">
          {icon}
        </IconChip>
      )}
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm font-extrabold", selected ? "text-brand-800" : "text-ink-900")}>
          {title}
        </span>
        {caption && (
          <span className="mt-1 block text-xs leading-5 text-ink-600">{caption}</span>
        )}
      </span>
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition",
          selected ? "border-brand-500 bg-brand-500 text-white" : "border-ink-200 text-transparent"
        )}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    </button>
  );
}

function PillButton({
  value,
  selected,
  onSelect,
  suffix = "",
}: {
  value: number;
  selected: boolean;
  onSelect: () => void;
  suffix?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "h-11 rounded-full border px-5 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        selected
          ? "border-brand-500 bg-brand-500 text-white shadow-soft"
          : "border-ink-200 bg-white text-ink-700 hover:border-brand-200 hover:bg-brand-50"
      )}
    >
      {value}
      {suffix}
    </button>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink-100 px-5 py-4 last:border-b-0">
      <span className="text-sm text-ink-600">{label}</span>
      <span className="text-right text-sm font-extrabold text-ink-900">{value}</span>
    </div>
  );
}

function TimelineItem({
  dot,
  title,
  children,
  active,
}: {
  dot: string;
  title: string;
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <div className="relative grid grid-cols-[46px_1fr] gap-4">
      <div className="flex justify-center">
        <span
          className={cn(
            "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white text-xs font-black",
            active ? "border-brand-500 bg-brand-500 text-white" : "border-brand-200 text-brand-700"
          )}
        >
          {dot}
        </span>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-100">
        <p className="font-extrabold text-ink-900">{title}</p>
        <p className="mt-1 text-sm leading-6 text-ink-600">{children}</p>
      </div>
    </div>
  );
}

function StepBody({
  step,
  state,
  set,
  patch,
  errors,
}: {
  step: number;
  state: OnboardingState;
  set: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  patch: (delta: Partial<OnboardingState>) => void;
  errors: Errors;
}) {
  const subject = subjectById(state.subjectId);
  const projection = projectedScore(state.currentScore, state.targetScore);

  if (step === 0) {
    return (
      <div className="mx-auto max-w-xl">
        <label className="text-sm font-semibold text-ink-700" htmlFor="fullName">
          Ism
        </label>
        <Input
          id="fullName"
          value={state.fullName ?? ""}
          onChange={(e) => set("fullName", e.target.value)}
          placeholder="Masalan, Samir"
          className="mt-2 h-12 rounded-2xl text-base"
          autoFocus
        />
        <FieldError>{errors.fullName}</FieldError>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div>
        <div className="grid max-w-xl gap-3 sm:grid-cols-2">
          {AVAILABLE_CERTIFICATE_SUBJECTS.map((item) => (
            <ChoiceCard
              key={item.id}
              selected={state.subjectId === item.id}
              onSelect={() => set("subjectId", item.id)}
              icon={item.kind === "language" ? <MessageCircle /> : <BookOpenCheck />}
              tone={item.kind === "language" ? "brand" : "accent"}
              title={item.label}
              caption={`${item.caption}. ${item.assessment}.`}
            />
          ))}
        </div>
        <div className="mt-4 max-w-xl rounded-2xl border border-ink-100 bg-ink-50 p-4">
          <p className="text-sm font-semibold text-ink-800">
            Hozircha matematika ochiq
          </p>
          <p className="mt-1 text-xs leading-5 text-ink-600">
            {CERTIFICATE_SUBJECTS.filter(
              (item) => item.availability === "planned"
            )
              .slice(0, 6)
              .map((item) => item.shortLabel)
              .join(", ")}{" "}
            va boshqa fanlar ekspert tekshiruvidan keyin qo&apos;shiladi.
          </p>
        </div>
        <FieldError>{errors.subjectId}</FieldError>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-3">
          <ChoiceCard
            selected={state.resultStatus === "has-score"}
            onSelect={() =>
              patch({
                resultStatus: "has-score",
                currentScore:
                  typeof state.currentScore === "number" ? state.currentScore : 55,
              })
            }
            icon={<BarChart3 />}
            title="Ballim bor"
            caption="Oxirgi test yoki imtihon natijasini kiritaman"
          />
          <ChoiceCard
            selected={state.resultStatus === "not-taken"}
            onSelect={() => patch({ resultStatus: "not-taken", currentScore: undefined })}
            icon={<CalendarDays />}
            tone="accent"
            title="Hali topshirmaganman"
            caption="Reja diagnostikadan boshlanadi"
          />
          <ChoiceCard
            selected={state.resultStatus === "unknown"}
            onSelect={() => patch({ resultStatus: "unknown", currentScore: undefined })}
            icon={<Compass />}
            tone="sky"
            title="Aniq bilmayman"
            caption="Taxminiy boshlang'ich nuqta olinadi"
          />
        </div>
        {state.resultStatus === "has-score" && (
          <div className="rounded-2xl border border-ink-100 bg-ink-50/70 p-4">
            <div className="mb-4 flex flex-wrap gap-2">
              {[31, 45, 56, 65, 71, 86].map((score) => (
                <PillButton
                  key={score}
                  value={score}
                  selected={state.currentScore === score}
                  onSelect={() => set("currentScore", score)}
                />
              ))}
            </div>
            <Input
              type="number"
              min={0}
              max={100}
              value={state.currentScore ?? ""}
              onChange={(e) => set("currentScore", clampScore(Number(e.target.value || 0)))}
              placeholder="Aniq ball"
              className="max-w-44 rounded-2xl"
            />
            <FieldError>{errors.currentScore}</FieldError>
          </div>
        )}
        <FieldError>{errors.resultStatus}</FieldError>
      </div>
    );
  }

  if (step === 3) {
    const grade = gradeForScore(state.targetScore);
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {[46, 56, 71, 86, 95].map((score) => (
            <PillButton
              key={score}
              value={score}
              selected={state.targetScore === score}
              onSelect={() => set("targetScore", score)}
            />
          ))}
        </div>
        <div className="max-w-sm rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
          <Input
            type="number"
            min={31}
            max={100}
            value={state.targetScore ?? ""}
            onChange={(e) => set("targetScore", clampScore(Number(e.target.value || 0)))}
            placeholder="Maqsadli ball"
            className="rounded-2xl"
          />
          <p className="mt-3 text-sm text-ink-600">
            {grade ? `${grade.label}: ${grade.caption}.` : "31 dan 100 gacha ball tanlang."}
          </p>
          <FieldError>{errors.targetScore}</FieldError>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
          <p className="mb-4 font-extrabold text-ink-900">Haftalik soat</p>
          <div className="flex flex-wrap gap-2">
            {[3, 5, 8, 10, 14, 20].map((hours) => (
              <PillButton
                key={hours}
                value={hours}
                suffix=" soat"
                selected={state.weeklyHours === hours}
                onSelect={() => set("weeklyHours", hours)}
              />
            ))}
          </div>
          <FieldError>{errors.weeklyHours}</FieldError>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
          <p className="mb-4 font-extrabold text-ink-900">Haftalik kun</p>
          <div className="flex flex-wrap gap-2">
            {[2, 3, 4, 5, 6, 7].map((days) => (
              <PillButton
                key={days}
                value={days}
                suffix=" kun"
                selected={state.studyDays === days}
                onSelect={() => set("studyDays", days)}
              />
            ))}
          </div>
          <FieldError>{errors.studyDays}</FieldError>
        </div>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {PURPOSES.map((item) => (
            <ChoiceCard
              key={item.value}
              selected={state.examPurpose === item.value}
              onSelect={() => set("examPurpose", item.value)}
              icon={item.icon}
              tone={item.tone}
              title={item.title}
              caption={item.caption}
            />
          ))}
        </div>
        {state.examPurpose === "other" && (
          <Input
            value={state.purposeOther ?? ""}
            onChange={(e) => set("purposeOther", e.target.value)}
            placeholder="Ko'proq aytib bering..."
            className="h-12 rounded-2xl"
          />
        )}
        <FieldError>{errors.examPurpose ?? errors.purposeOther}</FieldError>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div className="grid gap-4">
        {[
          {
            icon: <ShieldCheck />,
            title: "Fan formatiga mos tashxis",
            text: `${subject?.label ?? "Tanlangan fan"} uchun boshlang'ich nuqta va zaif joylar alohida belgilanadi.`,
            tone: "brand" as Tone,
          },
          {
            icon: <ClipboardCheck />,
            title: "100 ballik maqsad xaritasi",
            text: "A+, A, B+, B va C oralig'i bo'yicha qaysi zonaga chiqish kerakligi ko'rinadi.",
            tone: "accent" as Tone,
          },
          {
            icon: <TimerReset />,
            title: "Real vaqtingizga mos yuklama",
            text: `${studyTimeLabel(state)} ritmida mavzu, mashq va takrorlashlar taqsimlanadi.`,
            tone: "amber" as Tone,
          },
        ].map((item) => (
          <div key={item.title} className="flex gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-100">
            <IconChip tone={item.tone} size="sm">
              {item.icon}
            </IconChip>
            <div>
              <p className="font-extrabold text-ink-900">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-ink-600">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (step === 7) {
    return (
      <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink-100">
        <StatRow label="Fan" value={subject?.label ?? "Tanlanmagan"} />
        <StatRow label="Hozirgi holat" value={currentScoreLabel(state)} />
        <StatRow label="Maqsad ball" value={`${state.targetScore ?? projection} ball`} />
        <StatRow label="O'qish vaqti" value={studyTimeLabel(state)} />
      </div>
    );
  }

  if (step === 8) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {REFERRALS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => set("referralSource", item.value)}
            aria-pressed={state.referralSource === item.value}
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
              state.referralSource === item.value
                ? "border-brand-500 bg-brand-500 text-white shadow-soft"
                : "border-ink-200 bg-white text-ink-800 hover:border-brand-200 hover:bg-brand-50"
            )}
          >
            {item.title}
          </button>
        ))}
      </div>
    );
  }

  if (step === 9) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-brand-500 via-violet-500 to-accent-500 p-1 shadow-soft">
        <div className="rounded-[22px] bg-white/95 p-6 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-600">
            Shaxsiy prognoz
          </p>
          <p className="mt-4 text-7xl font-black tracking-tight text-ink-900">
            {projection}
          </p>
          <p className="mt-2 text-sm text-ink-600">
            {currentScoreLabel(state)} → {state.targetScore ?? projection} ball
          </p>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
              style={{ width: `${Math.min(100, projection)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-4 before:absolute before:left-[22px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-brand-100">
      <TimelineItem dot="1" active title="1-kun">
        Boshlang&apos;ich nuqtangiz va zaif tomonlaringiz aniqlanadi.
      </TimelineItem>
      <TimelineItem dot="7" title="7 kun">
        Fan formati, savol turlari va vaqt boshqaruvi o&apos;rganiladi.
      </TimelineItem>
      <TimelineItem dot="3h" title="3 hafta">
        Zaif mavzular mustahkamlanadi va yechish usullari charxlanadi.
      </TimelineItem>
      <TimelineItem dot="✓" title="Imtihon kuni">
        Rejangizga tayanib, ishonch bilan kirishga tayyor bo&apos;lasiz.
      </TimelineItem>
    </div>
  );
}

export function OnboardingFlow() {
  const router = useRouter();
  const { state, set, patch, hydrated } = useOnboarding();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});

  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;
  const copy = stepCopy(step, state);

  const handleNext = () => {
    const stepErrors = validateStep(step, state);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (isLast) {
      router.push("/plans?from=onboarding");
    } else {
      setStep((s) => Math.min(STEPS.length - 1, s + 1));
      requestAnimationFrame(() => {
        document
          .getElementById("onboarding-form")
          ?.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  };

  const handleBack = () => {
    setErrors({});
    if (isFirst) {
      router.push("/");
    } else {
      setStep((s) => Math.max(0, s - 1));
    }
  };

  return (
    <div className="grid min-h-dvh overflow-hidden bg-ink-50 md:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">
      <OnboardingSidePanel />

      <div
        id="onboarding-form"
        className="relative flex max-h-dvh min-w-0 flex-col overflow-y-auto bg-ink-50"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-soft-mesh opacity-70" />

        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/85 px-4 py-3 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <Link href="/" aria-label="Bosh sahifa">
              <Logo size={24} />
            </Link>
            <Link href="/login" className="btn-ghost px-4 py-2 text-sm">
              Kirish
            </Link>
          </div>
        </header>

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-5 sm:px-6 sm:py-8 xl:px-10">
            <div className="mb-5 rounded-[1.75rem] border border-white/70 bg-white/80 p-4 shadow-soft backdrop-blur sm:p-5">
              <StepProgress steps={STEPS} current={step} />
            </div>

            <div className="min-h-[560px] rounded-[2rem] border border-white/80 bg-white/95 p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.55)] ring-1 ring-ink-100/60 backdrop-blur sm:p-7 xl:p-8">
              <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
                  {copy.eyebrow}
                </p>
                <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
                  {copy.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600 sm:text-base">
                  {copy.description}
                </p>
              </div>

              {hydrated ? (
                <StepBody
                  step={step}
                  state={state}
                  set={set}
                  patch={patch}
                  errors={errors}
                />
              ) : (
                <div className="h-72 animate-pulse rounded-3xl bg-ink-100" />
              )}
            </div>

            <div className="sticky bottom-0 z-10 -mx-4 mt-6 border-t border-white/70 bg-ink-50/85 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 xl:-mx-10 xl:px-10">
              <div className="mx-auto flex max-w-4xl flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  leadingIcon={<ArrowLeft className="h-4 w-4" />}
                  className="w-full sm:w-auto"
                >
                  {isFirst ? "Bosh sahifa" : "Orqaga"}
                </Button>

                <Button
                  type="button"
                  size="lg"
                  onClick={handleNext}
                  trailingIcon={<ArrowRight className="h-4 w-4" />}
                  className="w-full bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 sm:w-auto"
                >
                  {isLast ? "Tarifni tanlash" : "Keyingi"}
                </Button>
              </div>
            </div>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-ink-500">
              <Lock className="h-3 w-3" />
              Ma&apos;lumotlaringiz xavfsizligini ta&apos;minlaymiz.
            </p>
          </div>

          <div className="relative z-10 border-t border-white/70 bg-white/85 px-4 py-3 backdrop-blur-xl">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 text-xs text-ink-600 sm:px-4">
              <p className="inline-flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-brand-500" />
                Yordam kerakmi? Biz har doim siz bilan.
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href="https://t.me/milliyprep"
                  className="rounded-full bg-ink-100 px-3 py-1.5 font-semibold text-ink-700 hover:bg-ink-200"
                >
                  Chat
                </Link>
                <Link
                  href="/#faq"
                  className="rounded-full bg-ink-100 px-3 py-1.5 font-semibold text-ink-700 hover:bg-ink-200"
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
