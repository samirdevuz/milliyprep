"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface LogoProps {
  size?: number;
  className?: string;
  withWordmark?: boolean;
  /** Stacked wordmark color: dark on light backgrounds, light on dark. */
  wordmarkTone?: "dark" | "light";
}

/**
 * MilliyPrep logo. Uses /public/illustrations/logo.png when available and
 * falls back to a tasteful inline SVG so the brand still reads if the
 * asset hasn't been placed yet.
 */
export function Logo({
  size = 32,
  className,
  withWordmark = true,
  wordmarkTone = "dark",
}: LogoProps) {
  const [errored, setErrored] = useState(false);

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="relative inline-block"
        style={{ width: size, height: size }}
      >
        {!errored ? (
          <Image
            src="/illustrations/logo.png"
            alt="MilliyPrep logo"
            width={size}
            height={size}
            className="h-full w-full object-contain"
            onError={() => setErrored(true)}
            draggable={false}
            unoptimized
            priority
          />
        ) : (
          <FallbackMark size={size} />
        )}
      </span>
      {withWordmark && (
        <span
          className={cn(
            "text-base font-bold tracking-tight",
            wordmarkTone === "dark" ? "text-ink-900" : "text-white"
          )}
        >
          Milliy
          <span
            className={cn(
              wordmarkTone === "dark" ? "text-brand-600" : "text-accent-300"
            )}
          >
            Prep
          </span>
        </span>
      )}
    </span>
  );
}

function FallbackMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="mp-mark"
          x1="0"
          y1="0"
          x2="64"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <path
        d="M8 12c0-2.2 1.8-4 4-4h8.5c1.4 0 2.7.7 3.4 1.9L32 24l8.1-14.1A4 4 0 0 1 43.5 8H52c2.2 0 4 1.8 4 4v40c0 2.2-1.8 4-4 4h-6c-2.2 0-4-1.8-4-4V30.6l-7 12c-1.5 2.6-5.3 2.6-6.9 0l-7-12V52c0 2.2-1.8 4-4 4h-5C9.8 56 8 54.2 8 52V12z"
        fill="url(#mp-mark)"
      />
    </svg>
  );
}
