import { Rocket } from "lucide-react";

const QUOTES = [
  "Har kuni o'zingni o'tgandan yaxshiroq qil.",
  "Kichik qadamlar — katta natijaning birinchi belgisi.",
  "Maqsad — bu reja bilan birlashgan orzu.",
];

export function MotivationBanner() {
  // Server-side: deterministic by date so it doesn't flicker.
  const quote = QUOTES[new Date().getDate() % QUOTES.length];
  return (
    <article className="card relative overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 p-5 text-white sm:p-6">
      <div
        aria-hidden="true"
        className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl"
      />
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <Rocket className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold">{quote}</p>
          <p className="mt-1 text-xs text-white/70">— MilliyPrep</p>
        </div>
      </div>
    </article>
  );
}
