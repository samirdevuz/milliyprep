"use client";

import { Send } from "lucide-react";

interface SocialAuthButtonsProps {
  /** Called when the user chooses Telegram (register page handles the step UI). */
  onTelegram?: () => void;
  nextPath?: string;
}

export function SocialAuthButtons({ onTelegram, nextPath }: SocialAuthButtonsProps) {
  const googleHref = nextPath
    ? `/api/auth/google?next=${encodeURIComponent(nextPath)}`
    : "/api/auth/google";

  return (
    <div className="space-y-2">
      <a
        href={googleHref}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 transition hover:bg-ink-50"
      >
        <GoogleMark />
        Google orqali davom etish
      </a>
      <button
        type="button"
        onClick={onTelegram}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 transition hover:bg-ink-50"
      >
        <Send className="h-4 w-4 text-sky-500" />
        Telegram orqali davom etish
      </button>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5.04c1.6 0 3.04.55 4.18 1.62l3.13-3.13C17.45 1.7 14.97.8 12 .8 7.4.8 3.4 3.42 1.45 7.27l3.65 2.83C6.04 7.2 8.78 5.04 12 5.04z"
      />
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.78-.07-1.55-.2-2.27H12v4.3h6.47c-.28 1.5-1.13 2.78-2.42 3.64l3.55 2.74c2.08-1.92 3.28-4.74 3.28-8.41z"
      />
      <path
        fill="#FBBC05"
        d="M5.1 14.1A7.05 7.05 0 014.7 12c0-.73.13-1.43.36-2.08L1.45 7.27A11.95 11.95 0 00.5 12c0 1.94.46 3.78 1.27 5.4l3.34-3.3z"
      />
      <path
        fill="#34A853"
        d="M12 23.2c3.24 0 5.96-1.07 7.95-2.91l-3.55-2.74c-1 .67-2.27 1.07-4.4 1.07-3.22 0-5.96-2.16-6.9-5.06L1.45 16.4C3.4 20.27 7.4 23.2 12 23.2z"
      />
    </svg>
  );
}
