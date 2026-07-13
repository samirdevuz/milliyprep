"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-ink-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl bg-white p-7 text-center shadow-soft ring-1 ring-ink-100 sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-ink-900">
          Sahifani ochishda muammo bo&apos;ldi
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-600">
          Xatolik qayd etildi. Qayta urinib ko&apos;ring yoki bosh sahifaga
          qayting.
        </p>
        {error.digest && (
          <p className="mt-3 text-xs text-ink-400">
            Murojaat kodi: <span className="font-mono">{error.digest}</span>
          </p>
        )}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
          >
            <RefreshCw className="h-4 w-4" />
            Qayta urinish
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-ink-100 px-5 py-2.5 text-sm font-bold text-ink-700 transition hover:bg-ink-200"
          >
            Bosh sahifa
          </Link>
        </div>
      </div>
    </main>
  );
}
