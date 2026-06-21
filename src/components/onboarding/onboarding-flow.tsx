"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
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
      // scroll the form column to top on step change
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
    <div className="grid min-h-screen lg:grid-cols-[420px_1fr]">
      <OnboardingSidePanel />

      <div
        id="onboarding-form"
        className="relative flex max-h-screen flex-col overflow-y-auto bg-ink-50/40"
      >
        {/* Mobile header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <Link href="/" aria-label="Bosh sahifa">
            <Logo size={24} />
          </Link>
          <Link href="/login" className="text-sm font-semibold text-brand-600">
            Kirish
          </Link>
        </header>

        <div className="flex flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8 sm:px-8">
            {/* Step indicator */}
            <div className="mb-8">
              <StepProgress steps={STEPS} current={step} />
              <p className="mt-3 text-xs text-ink-500 sm:hidden">
                Qadam {step + 1} / {STEPS.length} ·{" "}
                <span className="font-semibold text-brand-700">
                  {STEPS[step].label}
                </span>
              </p>
            </div>

            {/* Step body */}
            <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-ink-100 sm:p-8">
              {hydrated ? (
                <StepComponent errors={errors} />
              ) : (
                <div className="h-72 animate-pulse rounded-xl bg-ink-100" />
              )}
            </div>

            {/* Footer actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                leadingIcon={<ArrowLeft className="h-4 w-4" />}
              >
                {isFirst ? "Bosh sahifa" : "Orqaga"}
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleNext}
                  trailingIcon={<ArrowRight className="h-4 w-4" />}
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

          {/* Help bar */}
          <div className="border-t border-ink-100 bg-white px-4 py-3">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 text-xs text-ink-600 sm:px-4">
              <p>Yordam kerakmi? Biz har doim siz bilan.</p>
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
