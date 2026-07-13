import type { LucideIcon } from "lucide-react";
import { Crown } from "lucide-react";

export interface Plan {
  id: "pro";
  name: string;
  icon: LucideIcon;
  tagline: string;
  monthly: number; // UZS
  yearly: number; // UZS per month when billed yearly
  tone: "ink" | "brand" | "accent";
  highlighted?: boolean;
  cta: string;
  features: string[];
}

/** Format a UZS amount with non-breaking thousands separators. */
export function formatUzs(amount: number): string {
  if (amount === 0) return "0";
  return amount.toLocaleString("uz-UZ").replace(/,/g, "\u00a0");
}

export function planPriceTiyin(
  plan: Plan,
  billing: "monthly" | "yearly"
): number {
  const monthly = billing === "yearly" ? plan.yearly : plan.monthly;
  const months = billing === "yearly" && monthly > 0 ? 12 : 1;
  return monthly * months * 100;
}

export const PLANS: Plan[] = [
  {
    id: "pro",
    name: "Pro",
    icon: Crown,
    tagline: "Maksimal natija va shaxsiy yo'naltirish",
    monthly: 149_000,
    yearly: 119_000,
    tone: "accent",
    highlighted: true,
    cta: "Pro ga o'tish",
    features: [
      "Mock testlar va natija tarixi",
      "Profil kontekstidagi AI tutor",
      "Mavzular bo'yicha savol banki",
      "Kuchli va zaif mavzular tahlili",
      "Haftalik mashg'ulot progressi",
    ],
  },
];
