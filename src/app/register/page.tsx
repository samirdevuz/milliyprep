"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { AuthSideIllustration } from "@/components/auth/side-illustration";
import { SocialAuthButtons } from "@/components/auth/social-buttons";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { RegisterForm } from "@/components/auth/register-form";
import { TelegramRegister } from "@/components/auth/telegram-register";
import { OnboardingProfileSummary } from "@/components/auth/onboarding-profile-summary";
import { AUTH_FLAGS } from "@/lib/auth-flags";

export default function RegisterPage() {
  const [mode, setMode] = useState<"default" | "telegram">("default");

  return (
    <div className="grid min-h-dvh w-full max-w-full overflow-x-hidden lg:grid-cols-[minmax(0,460px)_1fr]">
      <AuthSideIllustration
        title={
          <>
            Qadamni <span className="script-accent text-accent-300">bugun</span>{" "}
            qo&apos;y,
            <br />
            natijani ertaga ko&apos;r.
          </>
        }
      />

      <main className="relative flex min-h-dvh min-w-0 flex-col overflow-hidden bg-ink-50/60">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-soft-mesh" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl"
        />

        <header className="relative z-10 flex items-center justify-between px-4 py-3 lg:hidden">
          <Link href="/" aria-label="Bosh sahifa">
            <Logo size={24} />
          </Link>
          <Link href="/login" className="btn-ghost px-4 py-2 text-sm">
            Kirish
          </Link>
        </header>

        <div className="relative z-10 flex flex-1 items-start justify-center px-3 py-6 sm:px-6 sm:py-10 lg:items-center lg:px-8">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:rounded-3xl sm:p-8">
            <Suspense fallback={null}>
              {mode === "telegram" ? (
                <TelegramRegisterPanel onBack={() => setMode("default")} />
              ) : (
                <RegisterPanel onTelegram={() => setMode("telegram")} />
              )}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

function RegisterPanel({ onTelegram }: { onTelegram: () => void }) {
  const params = useSearchParams();
  const planId = params.get("plan");
  const nextPath = safeNextPath(params.get("next"));
  const registerTabs = [
    AUTH_FLAGS.email
      ? {
          id: "email",
          label: "Elektron pochta",
          content: <RegisterForm method="email" nextPath={nextPath} />,
        }
      : null,
    AUTH_FLAGS.phone
      ? {
          id: "phone",
          label: "Telefon raqami",
          content: <RegisterForm method="phone" nextPath={nextPath} />,
        }
      : null,
  ].filter((tab): tab is NonNullable<typeof tab> => Boolean(tab));

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ink-900">
          Ro&apos;yxatdan o&apos;tish
        </h2>
        <p className="mt-1 text-sm text-ink-600">
          Hisob yaratib o&apos;qishni boshlang.
        </p>
      </div>

      <OnboardingProfileSummary planId={planId} />

      {registerTabs.length > 0 && <AuthTabs tabs={registerTabs} />}

      <div
        className={
          registerTabs.length > 0
            ? "my-5 flex items-center gap-3 text-xs text-ink-400"
            : "mb-5 flex items-center gap-3 text-xs text-ink-400"
        }
      >
        <span className="h-px flex-1 bg-ink-200" />
        {registerTabs.length > 0 ? "yoki" : "orqali"}
        <span className="h-px flex-1 bg-ink-200" />
      </div>

      <SocialAuthButtons
        onTelegram={onTelegram}
        nextPath={nextPath}
        preserveOnboarding
      />

      <p className="mt-6 text-center text-sm text-ink-600">
        Hisobingiz bormi?{" "}
        <Link href="/login" className="font-semibold text-brand-600 hover:underline">
          Kirish
        </Link>
      </p>
    </>
  );
}

function TelegramRegisterPanel({ onBack }: { onBack: () => void }) {
  const params = useSearchParams();
  return (
    <TelegramRegister
      onBack={onBack}
      nextPath={safeNextPath(params.get("next"))}
    />
  );
}

function safeNextPath(value: string | null): string {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}
