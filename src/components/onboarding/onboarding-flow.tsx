"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  KeyRound,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  UserRound,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { OtpInput } from "@/components/auth/otp-input";
import { Button } from "@/components/ui/button";
import { IconChip } from "@/components/ui/icon-chip";
import { Input } from "@/components/ui/input";
import { OptionCard } from "@/components/ui/option-card";
import { registerUser, sendOtp } from "@/lib/auth-client";
import { cn } from "@/lib/cn";
import {
  CERTIFICATE_SUBJECTS,
  clampScore,
  gradeForScore,
  projectedScore,
  subjectById,
} from "@/lib/onboarding/certificate";
import { useOnboarding } from "@/lib/onboarding/store";
import { STEPS, type OnboardingState } from "@/lib/onboarding/types";
import { validateStep } from "@/lib/onboarding/validate";
import { isEmail } from "@/lib/validation";

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
    caption: "Qabul, grant yoki magistratura uchun aniq ball reja",
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
        description: "Til fanlarida CEFR ko'nikmalari, boshqa fanlarda esa 100 ballik natija va daraja oralig'i hisobga olinadi.",
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
    case 10:
      return {
        eyebrow: "Yo'l xaritasi",
        title: "Nimani kutish mumkin?",
        description: "Reja bosqichma-bosqich diagnostika, format, zaif joylar va imtihon tayyorgarligini yopadi.",
      };
    case 11:
      return {
        eyebrow: "Hisob yaratish",
        title: "Rejangizni saqlab qo'yamiz.",
        description: "Email va parol kiriting. Keyingi bosqichda emailga kelgan 6 xonali kodni tasdiqlaysiz.",
      };
    default:
      return {
        eyebrow: "Tasdiqlash",
        title: "Pochtangizni tekshiring",
        description: "Emailga yuborilgan kodni kiriting, keyin shaxsiy rejangiz dashboardda ochiladi.",
      };
  }
}

function ScoreButton({
  value,
  selected,
  onSelect,
}: {
  value: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "h-11 rounded-2xl border px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        selected
          ? "border-brand-500 bg-brand-500 text-white shadow-soft"
          : "border-ink-200 bg-white text-ink-700 hover:border-brand-200 hover:bg-brand-50"
      )}
    >
      {value}
    </button>
  );
}

function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-2 text-sm font-medium text-rose-600">{children}</p>;
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink-100 px-5 py-4 last:border-b-0">
      <span className="text-sm text-ink-600">{label}</span>
      <span className="text-right text-sm font-bold text-ink-950">{value}</span>
    </div>
  );
}

function TimelineItem({
  dot,
  title,
  text,
  active,
}: {
  dot: string;
  title: string;
  text: string;
  active?: boolean;
}) {
  return (
    <div className="relative grid grid-cols-[44px_1fr] gap-4">
      <div className="flex justify-center">
        <span
          className={cn(
            "relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white text-xs font-extrabold",
            active
              ? "border-brand-500 bg-brand-500 text-white"
              : "border-brand-200 text-brand-700"
          )}
        >
          {dot}
        </span>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-100">
        <p className="font-bold text-ink-950">{title}</p>
        <p className="mt-1 text-sm leading-6 text-ink-600">{text}</p>
      </div>
    </div>
  );
}

function StepContent({
  step,
  state,
  set,
  patch,
  errors,
  account,
  setAccount,
  code,
  setCode,
  devCode,
  authError,
  resend,
  loading,
}: {
  step: number;
  state: OnboardingState;
  set: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  patch: (delta: Partial<OnboardingState>) => void;
  errors: Errors;
  account: { email: string; password: string; confirm: string; agreed: boolean };
  setAccount: (delta: Partial<{ email: string; password: string; confirm: string; agreed: boolean }>) => void;
  code: string;
  setCode: (value: string) => void;
  devCode?: string;
  authError?: string;
  resend: () => void;
  loading: boolean;
}) {
  const selectedSubject = subjectById(state.subjectId);
  const targetGrade = gradeForScore(state.targetScore);
  const projection = projectedScore(state.currentScore, state.targetScore);

  if (step === 0) {
    return (
      <div>
        <label className="text-sm font-semibold text-ink-700" htmlFor="full-name">
          Ism
        </label>
        <Input
          id="full-name"
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
        <div className="grid gap-3 sm:grid-cols-2">
          {CERTIFICATE_SUBJECTS.map((subject) => (
            <OptionCard
              key={subject.id}
              selected={state.subjectId === subject.id}
              onSelect={() => set("subjectId", subject.id)}
              icon={subject.kind === "language" ? <MessageCircle /> : <BookOpenCheck />}
              tone={subject.kind === "language" ? "brand" : "accent"}
              title={subject.label}
              description={`${subject.caption}. ${subject.assessment}.`}
            />
          ))}
        </div>
        <FieldError>{errors.subjectId}</FieldError>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <OptionCard
            selected={state.resultStatus === "has-score"}
            onSelect={() =>
              patch({
                resultStatus: "has-score",
                currentScore:
                  typeof state.currentScore === "number" ? state.currentScore : 55,
              })
            }
            icon={<BarChart3 />}
            tone="brand"
            title="Ballim bor"
            description="Oxirgi test yoki imtihon natijasini kiritaman"
          />
          <OptionCard
            selected={state.resultStatus === "not-taken"}
            onSelect={() => patch({ resultStatus: "not-taken", currentScore: undefined })}
            icon={<CalendarDays />}
            tone="accent"
            title="Hali topshirmaganman"
            description="Reja diagnostikadan boshlanadi"
          />
          <OptionCard
            selected={state.resultStatus === "unknown"}
            onSelect={() => patch({ resultStatus: "unknown", currentScore: undefined })}
            icon={<Compass />}
            tone="sky"
            title="Aniq bilmayman"
            description="Taxminiy boshlang'ich nuqta olinadi"
          />
        </div>
        {state.resultStatus === "has-score" && (
          <div className="rounded-2xl border border-ink-100 bg-ink-50/70 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {[31, 45, 56, 65, 71, 86].map((score) => (
                <ScoreButton
                  key={score}
                  value={score}
                  selected={state.currentScore === score}
                  onSelect={() => set("currentScore", score)}
                />
              ))}
            </div>
            <label className="text-sm font-semibold text-ink-700" htmlFor="current-score">
              Aniq ball
            </label>
            <Input
              id="current-score"
              type="number"
              min={0}
              max={100}
              value={state.currentScore ?? ""}
              onChange={(e) => set("currentScore", clampScore(Number(e.target.value || 0)))}
              className="mt-2 max-w-40 rounded-2xl"
            />
            <FieldError>{errors.currentScore}</FieldError>
          </div>
        )}
        <FieldError>{errors.resultStatus}</FieldError>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {[46, 56, 71, 86, 95].map((score) => (
            <ScoreButton
              key={score}
              value={score}
              selected={state.targetScore === score}
              onSelect={() => set("targetScore", score)}
            />
          ))}
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
          <label className="text-sm font-semibold text-ink-700" htmlFor="target-score">
            Maqsadli ball
          </label>
          <Input
            id="target-score"
            type="number"
            min={31}
            max={100}
            value={state.targetScore ?? ""}
            onChange={(e) => set("targetScore", clampScore(Number(e.target.value || 0)))}
            className="mt-2 max-w-40 rounded-2xl"
          />
          <p className="mt-3 text-sm text-ink-600">
            {targetGrade
              ? `${targetGrade.label}: ${targetGrade.caption}.`
              : "31 va 100 oralig'ida maqsad tanlang."}
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
          <p className="font-bold text-ink-950">Haftalik soat</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[3, 5, 8, 10, 14, 20].map((hours) => (
              <ScoreButton
                key={hours}
                value={hours}
                selected={state.weeklyHours === hours}
                onSelect={() => set("weeklyHours", hours)}
              />
            ))}
          </div>
          <FieldError>{errors.weeklyHours}</FieldError>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
          <p className="font-bold text-ink-950">Haftalik kun</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[2, 3, 4, 5, 6, 7].map((days) => (
              <ScoreButton
                key={days}
                value={days}
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
          {PURPOSES.map((purpose) => (
            <OptionCard
              key={purpose.value}
              selected={state.examPurpose === purpose.value}
              onSelect={() => set("examPurpose", purpose.value)}
              icon={purpose.icon}
              tone={purpose.tone}
              title={purpose.title}
              description={purpose.caption}
            />
          ))}
        </div>
        {state.examPurpose === "other" && (
          <Input
            value={state.purposeOther ?? ""}
            onChange={(e) => set("purposeOther", e.target.value)}
            placeholder="Maqsadingizni yozing..."
            className="rounded-2xl"
          />
        )}
        <FieldError>{errors.examPurpose ?? errors.purposeOther}</FieldError>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div className="grid gap-3">
        {[
          {
            icon: <ShieldCheck />,
            title: "Fan formatiga mos tashxis",
            text: `${selectedSubject?.label ?? "Tanlangan fan"} uchun boshlang'ich nuqta va zaif joylar alohida belgilanadi.`,
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
          <div
            key={item.title}
            className="flex gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-100"
          >
            <IconChip tone={item.tone} size="sm">
              {item.icon}
            </IconChip>
            <div>
              <p className="font-bold text-ink-950">{item.title}</p>
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
        <StatRow label="Fan" value={selectedSubject?.label ?? "Tanlanmagan"} />
        <StatRow label="Hozirgi holat" value={currentScoreLabel(state)} />
        <StatRow
          label="Maqsad"
          value={`${state.targetScore ?? projection} ball${
            gradeForScore(state.targetScore)?.label
              ? ` (${gradeForScore(state.targetScore)?.label})`
              : ""
          }`}
        />
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
              "rounded-2xl border px-4 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
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
          <p className="mt-4 text-7xl font-black tracking-tight text-ink-950">
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

  if (step === 10) {
    return (
      <div className="relative space-y-4 before:absolute before:left-[21px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-brand-100">
        <TimelineItem
          dot="1"
          active
          title="1-kun: boshlang'ich nuqta"
          text="Diagnostika orqali hozirgi holat va zaif bo'limlar aniqlanadi."
        />
        <TimelineItem
          dot="7"
          title="7-kun: formatni o'rganish"
          text="Savol turlari, vaqt boshqaruvi va xatolar xaritasi shakllanadi."
        />
        <TimelineItem
          dot="3h"
          title="3 hafta: darajani ko'tarish"
          text="Zaif mavzular bo'yicha mashqlar va takrorlashlar kuchaytiriladi."
        />
        <TimelineItem
          dot="✓"
          title="Imtihon kuni: tayyor kirish"
          text="Maqsad ball uchun zarur strategiya va yakuniy takrorlashlar yopiladi."
        />
      </div>
    );
  }

  if (step === 11) {
    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-ink-700" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={account.email}
            onChange={(e) => setAccount({ email: e.target.value })}
            placeholder="hello@milliyprep.uz"
            className="mt-2 rounded-2xl"
          />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-ink-700" htmlFor="password">
              Parol
            </label>
            <Input
              id="password"
              type="password"
              value={account.password}
              onChange={(e) => setAccount({ password: e.target.value })}
              placeholder="Kamida 6 belgi"
              className="mt-2 rounded-2xl"
            />
            <FieldError>{errors.password}</FieldError>
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-700" htmlFor="confirm">
              Parolni takrorlang
            </label>
            <Input
              id="confirm"
              type="password"
              value={account.confirm}
              onChange={(e) => setAccount({ confirm: e.target.value })}
              placeholder="Parolni qayta kiriting"
              className="mt-2 rounded-2xl"
            />
            <FieldError>{errors.confirm}</FieldError>
          </div>
        </div>
        <label className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-ink-50/70 p-4 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={account.agreed}
            onChange={(e) => setAccount({ agreed: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
          />
          <span>
            Shaxsiy rejamni saqlash va MilliyPrep hisobini yaratishga roziman.
          </span>
        </label>
        <FieldError>{errors.agreed}</FieldError>
        <FieldError>{authError}</FieldError>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-ink-100 bg-ink-50/70 p-4 text-sm text-ink-700">
        <span className="font-semibold">{account.email}</span> manziliga 6 xonali kod
        yuborildi. Quyida kiriting.
      </div>
      <OtpInput
        value={code}
        onChange={setCode}
        disabled={loading}
        invalid={Boolean(errors.code || authError)}
      />
      {devCode && (
        <button
          type="button"
          onClick={() => setCode(devCode)}
          className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
        >
          Test kodi: {devCode}
        </button>
      )}
      <div className="flex items-center justify-between gap-3 text-sm">
        <button
          type="button"
          onClick={resend}
          disabled={loading}
          className="font-semibold text-brand-600 hover:underline disabled:opacity-50"
        >
          Kodni qayta yuborish
        </button>
        <Link href="/login" className="text-ink-500 hover:text-brand-600">
          Hisobim bor
        </Link>
      </div>
      <FieldError>{errors.code ?? authError}</FieldError>
    </div>
  );
}

export function OnboardingFlow() {
  const router = useRouter();
  const { state, set, patch, hydrated } = useOnboarding();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [account, setAccountState] = useState({
    email: "",
    password: "",
    confirm: "",
    agreed: false,
  });
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>();
  const [authError, setAuthError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const copy = stepCopy(step, state);
  const progress = useMemo(
    () => Math.round(((step + 1) / STEPS.length) * 100),
    [step]
  );

  const setAccount = (delta: Partial<typeof account>) => {
    setAccountState((current) => ({ ...current, ...delta }));
  };

  const validateAccount = (): Errors => {
    const next: Errors = {};
    if (!isEmail(account.email)) next.email = "To'g'ri email kiriting.";
    if (account.password.length < 6) next.password = "Parol kamida 6 belgi bo'lsin.";
    if (account.confirm !== account.password) next.confirm = "Parollar bir xil emas.";
    if (!account.agreed) next.agreed = "Davom etish uchun rozilik belgilang.";
    return next;
  };

  const requestCode = async () => {
    const nextErrors = validateAccount();
    setErrors(nextErrors);
    setAuthError(undefined);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    const res = await sendOtp({
      channel: "email",
      contact: account.email.trim(),
      purpose: "register",
    });
    setLoading(false);

    if (!res.ok) {
      setAuthError(res.error ?? "Kod yuborib bo'lmadi.");
      return;
    }
    setDevCode(res.devCode);
    setCode(res.devCode ?? "");
    setStep(12);
  };

  const completeRegistration = async () => {
    const nextErrors: Errors = {};
    if (code.trim().length !== 6) nextErrors.code = "6 xonali kodni kiriting.";
    setErrors(nextErrors);
    setAuthError(undefined);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    const res = await registerUser({
      name: state.fullName?.trim() || account.email.trim(),
      method: "email",
      contact: account.email.trim(),
      code: code.trim(),
      password: account.password,
    });
    setLoading(false);

    if (!res.ok) {
      setAuthError(res.error ?? "Ro'yxatdan o'tishda xatolik yuz berdi.");
      return;
    }
    router.push("/dashboard");
  };

  const handleNext = () => {
    if (step === 11) {
      void requestCode();
      return;
    }
    if (step === 12) {
      void completeRegistration();
      return;
    }

    const nextErrors = validateStep(step, state);
    setErrors(nextErrors);
    setAuthError(undefined);
    if (Object.keys(nextErrors).length > 0) return;
    setStep((current) => Math.min(STEPS.length - 1, current + 1));
  };

  const handleBack = () => {
    setErrors({});
    setAuthError(undefined);
    setStep((current) => Math.max(0, current - 1));
  };

  const canGoBack = step > 0 && !loading;
  const ctaLabel =
    step === 11 ? "Kod yuborish" : step === 12 ? "Tasdiqlash va davom etish" : "Davom etish";

  if (!hydrated) {
    return (
      <main className="min-h-dvh bg-ink-50/60">
        <div className="mx-auto flex min-h-dvh max-w-4xl items-center justify-center px-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-ink-50/60">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-soft-mesh" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-brand-200/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-accent-200/50 blur-3xl"
      />

      <header className="relative z-10 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" aria-label="Bosh sahifa">
            <Logo size={28} />
          </Link>
          <Link href="/login" className="btn-ghost px-4 py-2 text-sm">
            Kirish
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-10 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <section className="rounded-[2rem] bg-white/90 p-5 shadow-soft ring-1 ring-white/80 backdrop-blur sm:p-7 lg:p-8">
          <div className="mb-7">
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
              {copy.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-ink-950 sm:text-4xl">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600 sm:text-base">
              {copy.description}
            </p>
          </div>

          <StepContent
            step={step}
            state={state}
            set={set}
            patch={patch}
            errors={errors}
            account={account}
            setAccount={setAccount}
            code={code}
            setCode={setCode}
            devCode={devCode}
            authError={authError}
            resend={requestCode}
            loading={loading}
          />

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={!canGoBack}
              leadingIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Orqaga
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={handleNext}
              loading={loading}
              trailingIcon={
                step === 12 ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />
              }
              className="bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600"
            >
              {ctaLabel}
            </Button>
          </div>
        </section>

        <aside className="rounded-[2rem] bg-white/80 p-5 shadow-soft ring-1 ring-white/80 backdrop-blur lg:sticky lg:top-6">
          <div className="flex items-center gap-3">
            <IconChip tone="brand">
              <Sparkles />
            </IconChip>
            <div>
              <p className="text-sm font-bold text-ink-950">Milliy Sertifikat rejasi</p>
              <p className="text-xs text-ink-500">Javoblar asosida moslashadi</p>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm">
            <div className="rounded-2xl bg-ink-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
                Fan
              </p>
              <p className="mt-1 font-bold text-ink-950">
                {subjectById(state.subjectId)?.label ?? "Tanlanmagan"}
              </p>
            </div>
            <div className="rounded-2xl bg-ink-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
                Hozirgi holat
              </p>
              <p className="mt-1 font-bold text-ink-950">{currentScoreLabel(state)}</p>
            </div>
            <div className="rounded-2xl bg-ink-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
                Maqsad
              </p>
              <p className="mt-1 font-bold text-ink-950">
                {state.targetScore ? `${state.targetScore} ball` : "Belgilanmagan"}
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 p-4 text-sm text-ink-600 ring-1 ring-brand-100">
            <div className="mb-2 flex items-center gap-2 font-bold text-ink-950">
              <Mail className="h-4 w-4 text-brand-600" />
              Register onboarding ichida
            </div>
            Email tasdiqlangandan keyin rejangiz dashboardga saqlanadi.
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-ink-500">
            <KeyRound className="h-4 w-4" />
            <span>OTP kod bilan himoyalangan</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-ink-500">
            <UserRound className="h-4 w-4" />
            <span>{firstNameOf(state.fullName)} uchun shaxsiy oqim</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
