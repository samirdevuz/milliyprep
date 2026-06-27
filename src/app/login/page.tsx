"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { AuthSideIllustration } from "@/components/auth/side-illustration";
import { SocialAuthButtons } from "@/components/auth/social-buttons";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { LoginForm } from "@/components/auth/login-form";
import { AUTH_FLAGS } from "@/lib/auth-flags";

const GOOGLE_ERRORS: Record<string, string> = {
  google_not_configured: "Google orqali kirish hozircha sozlanmagan.",
  google_state: "Xavfsizlik tekshiruvi muvaffaqiyatsiz. Qayta urinib ko'ring.",
  google_token: "Google bilan bog'lanishda xatolik yuz berdi.",
  google_profile: "Google profilini olishda xatolik yuz berdi.",
  google_unverified_email:
    "Google emailingiz tasdiqlanmagan. Avval Google hisobingizda emailni tasdiqlang.",
};

function safeNextPath(value: string | null): string {
  if (!value?.startsWith("/")) return "/dashboard";
  if (value.startsWith("//")) return "/dashboard";
  return value;
}

function GoogleErrorBanner() {
  const params = useSearchParams();
  const err = params.get("error");
  if (!err || !GOOGLE_ERRORS[err]) return null;
  return (
    <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-100">
      {GOOGLE_ERRORS[err]}
    </p>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const params = useSearchParams();
  const nextPath = safeNextPath(params.get("next"));
  const loginTabs = [
    AUTH_FLAGS.email
      ? {
          id: "email",
          label: "Elektron pochta",
          content: <LoginForm method="email" nextPath={nextPath} />,
        }
      : null,
    AUTH_FLAGS.phone
      ? {
          id: "phone",
          label: "Telefon raqami",
          content: <LoginForm method="phone" nextPath={nextPath} />,
        }
      : null,
  ].filter((tab): tab is NonNullable<typeof tab> => Boolean(tab));

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
          <Link href="/onboarding" className="btn-ghost px-4 py-2 text-sm">
            Ro&apos;yxatdan o&apos;tish
          </Link>
        </header>

        <div className="relative z-10 flex flex-1 items-start justify-center px-3 py-6 sm:px-6 sm:py-10 lg:items-center lg:px-8">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:rounded-3xl sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ink-900">Kirish</h2>
              <p className="mt-1 text-sm text-ink-600">
                Hisobingizga kirib, o&apos;qishni davom eting.
              </p>
            </div>

            <Suspense fallback={null}>
              <GoogleErrorBanner />
            </Suspense>

            <Suspense fallback={null}>
              {loginTabs.length > 0 && <AuthTabs tabs={loginTabs} />}
            </Suspense>

            <div className={loginTabs.length > 0 ? "my-5 flex items-center gap-3 text-xs text-ink-400" : "mb-5 flex items-center gap-3 text-xs text-ink-400"}>
              <span className="h-px flex-1 bg-ink-200" />
              {loginTabs.length > 0 ? "yoki" : "orqali"}
              <span className="h-px flex-1 bg-ink-200" />
            </div>

            <SocialLogin nextPath={nextPath} />

            <p className="mt-6 text-center text-sm text-ink-600">
              Hisobingiz yo&apos;qmi?{" "}
              <Link href="/onboarding" className="font-semibold text-brand-600 hover:underline">
                Ro&apos;yxatdan o&apos;ting
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function SocialLogin({ nextPath }: { nextPath: string }) {
  // On the login page, Telegram simply points users to register (the bot
  // creates the account); Google works for both.
  return (
    <SocialAuthButtons
      nextPath={nextPath}
      onTelegram={() => (window.location.href = "/onboarding")}
    />
  );
}
