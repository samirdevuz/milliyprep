"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { AuthSideIllustration } from "@/components/auth/side-illustration";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-dvh w-full max-w-full overflow-x-hidden lg:grid-cols-[minmax(0,460px)_1fr]">
      <AuthSideIllustration
        title={
          <>
            Parolni <span className="script-accent text-accent-300">tikla</span>,
            <br />
            o&apos;qishni davom ettir.
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
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ink-900">Parolni tiklash</h2>
              <p className="mt-1 text-sm text-ink-600">
                Tasdiqlash kodi orqali yangi parol o&apos;rnating.
              </p>
            </div>

            <Suspense fallback={null}>
              <ForgotPasswordForm />
            </Suspense>

            <p className="mt-6 text-center text-sm text-ink-600">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Kirishga qaytish
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
