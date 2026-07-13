"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import type { Plan } from "@/lib/pricing";
import type { PaymentBilling, PaymentProvider } from "@/lib/payments/types";
import { cn } from "@/lib/cn";

export function PaymentButtons({
  plan,
  billing,
  className,
}: {
  plan: Plan;
  billing: PaymentBilling;
  className?: string;
}) {
  const [loading, setLoading] = useState<PaymentProvider | null>(null);
  const [error, setError] = useState("");

  const pay = async (provider: PaymentProvider) => {
    setError("");
    setLoading(provider);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, plan: plan.id, billing }),
      });
      const data = (await res.json()) as {
        redirectUrl?: string;
        error?: string;
      };
      if (!res.ok || !data.redirectUrl) {
        setError(data.error ?? "To'lovni boshlashda xatolik yuz berdi.");
        return;
      }
      window.location.assign(data.redirectUrl);
    } catch {
      setError("To'lov serveriga ulanishda xatolik yuz berdi.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="grid gap-2 sm:grid-cols-2">
        {(["click", "payme"] as const).map((provider) => (
          <button
            key={provider}
            type="button"
            onClick={() => void pay(provider)}
            disabled={Boolean(loading)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-extrabold text-ink-900 transition hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === provider ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            {provider === "click" ? "Click" : "Payme"}
          </button>
        ))}
      </div>
      {error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 ring-1 ring-rose-100">
          {error}
        </p>
      )}
    </div>
  );
}
