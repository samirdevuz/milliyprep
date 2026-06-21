"use client";

import { Bell, Sparkles } from "lucide-react";
import Link from "next/link";

interface TopBarProps {
  name: string;
  notifications?: number;
}

export function TopBar({ name, notifications = 1 }: TopBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-6 lg:px-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
          Salom, {name}
          <span aria-hidden="true" className="text-2xl">
            👋
          </span>
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          Bugun ajoyib natijalar sari yana bir qadam qo&apos;yamiz.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/tests"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-800 shadow-soft ring-1 ring-ink-100 transition hover:bg-ink-50"
        >
          <Sparkles className="h-4 w-4 text-brand-500" />
          Seriya testini yechish
        </Link>
        <button
          type="button"
          aria-label="Bildirishnomalar"
          className="relative rounded-full bg-white p-2.5 text-ink-700 shadow-soft ring-1 ring-ink-100 hover:bg-ink-50"
        >
          <Bell className="h-4 w-4" />
          {notifications > 0 && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>
      </div>
    </div>
  );
}
