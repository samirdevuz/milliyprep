"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, HelpCircle, Lock } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { StepProgress } from "@/components/ui/step-progress";
import { OnboardingSidePanel } from "@/components/onboarding/side-panel";
import { StepBasics } from "@/components/onboarding/steps/step-basics";
import { StepGoal } from "@/components/onboarding/steps/step-goal";
import { StepLevel } from "@/components/onboarding/steps/step-level";
import { StepChallenges } from "@/components/onboarding/steps/step-challenges";
import { StepTime } from "@/components/onboarding/steps/step-time";
import { StepProfile } from "@/components/onboarding/steps/step-profile";
import { useOnboarding } from "@/lib/onboarding/store";
import { validateStep } from "@/lib/onboarding/validate";
import { STEPS } from "@/lib/onboarding/types";

export function OnboardingFlow() {
  const router = useRouter();
  const { state, hydrated } = useOnboarding();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  const StepComponent = useMemo(() => {
    switch (step) {
      case 0:
        return StepBasics;
      case 1:
        return StepGoal;
      case 2:
        return StepLevel;
      case 3:
        return StepChallenges;
      case 4:
        return StepTime;
      case 5:
        return StepProfile;
      default:
        return StepBasics;
    }
  }, [step]);

  const handleNext = () => {
    const stepErrors = validateStep(step, state);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (isLast) {
      router.push("/register?from=onboarding");
    } else {
      setStep((s) => s + 1);
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
      setStep((s) => s - 1);
    }
  };

  return (
    <div className="grid min-h-dvh overflow-hidden bg-ink-50 lg:grid-cols-[440px_minmax(0,1fr)]">
      <OnboardingSidePanel />

      <div
        id="onboarding-form"
        className="relative flex max-h-dvh min-w-0 flex-col overflow-y-auto bg-ink-50"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-soft-mesh opacity-70" />

        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/85 px-4 py-3 backdrop-blur-xl lg:hidden">
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

            <div className="min-h-[520px] rounded-[2rem] border border-white/80 bg-white/95 p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.55)] ring-1 ring-ink-100/60 backdrop-blur sm:p-7 lg:p-8">
              {hydrated ? (
                <StepComponent errors={errors} />
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
                {isLast ? "Tugatish" : "Keyingi"}
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
