"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Globe, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "#bosh-sahifa", label: "Bosh sahifa" },
  { href: "#imkoniyatlar", label: "Imkoniyatlar" },
  { href: "#kurslar", label: "Mahsulot" },
  { href: "#natijalar", label: "Natijalar" },
  { href: "#narxlar", label: "Narxlar" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  // Close mobile menu on route hash change
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center"
          aria-label="MilliyPrep bosh sahifa"
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50 hover:text-ink-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="hidden items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50 lg:inline-flex"
          >
            <Globe className="h-4 w-4" />
            O&apos;zbekcha
          </button>
          <Link
            href="/login"
            className="btn-ghost hidden text-sm sm:inline-flex"
          >
            Kirish
          </Link>
          <Link href="/onboarding" className="btn-primary text-sm">
            Boshlash
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
            aria-expanded={open}
            className="ml-1 rounded-lg p-2 text-ink-700 hover:bg-ink-100 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "border-t border-ink-100 bg-white md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <ul className="container-page flex flex-col gap-1 py-3">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 flex gap-2 px-1">
            <Link
              href="/login"
              className="btn-ghost flex-1 text-sm"
              onClick={() => setOpen(false)}
            >
              Kirish
            </Link>
            <Link
              href="/onboarding"
              className="btn-primary flex-1 text-sm"
              onClick={() => setOpen(false)}
            >
              Boshlash
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
