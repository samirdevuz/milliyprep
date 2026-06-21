"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Bell, Menu, Search, Sparkles } from "lucide-react";

interface TopbarProps {
  onMenu: () => void;
}

export function Topbar({ onMenu }: TopbarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (value) {
      router.push(`/dashboard/practice?search=${encodeURIComponent(value)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-100 bg-white/80 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenu}
        className="rounded-lg p-2 text-ink-700 hover:bg-ink-100 lg:hidden"
        aria-label="Menyuni ochish"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden flex-1 sm:block">
        <form className="relative max-w-sm" onSubmit={submitSearch}>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Mavzu, test yoki savol qidiring…"
            className="w-full rounded-full border border-ink-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </form>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/dashboard/tests"
          className="hidden items-center gap-1.5 rounded-full bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100 sm:inline-flex"
        >
          <Sparkles className="h-4 w-4" />
          Seriya testini yechish
        </Link>
        <button
          type="button"
          className="relative rounded-full p-2 text-ink-600 hover:bg-ink-100"
          aria-label="Bildirishnomalar"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
