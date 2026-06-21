import type { LucideIcon } from "lucide-react";
import { Rocket, Sparkles, Crown } from "lucide-react";

export interface Plan {
  id: "bepul" | "premium" | "pro";
  name: string;
  icon: LucideIcon;
  tagline: string;
  monthly: number; // UZS
  yearly: number; // UZS per month when billed yearly
  tone: "ink" | "brand" | "accent";
  highlighted?: boolean;
  cta: string;
  features: string[];
  notIncluded?: string[];
}

/** Format a UZS amount with non-breaking thousands separators. */
export function formatUzs(amount: number): string {
  if (amount === 0) return "0";
  return amount.toLocaleString("uz-UZ").replace(/,/g, "\u00a0");
}

export const PLANS: Plan[] = [
  {
    id: "bepul",
    name: "Bepul",
    icon: Sparkles,
    tagline: "Platforma bilan tanishish uchun",
    monthly: 0,
    yearly: 0,
    tone: "ink",
    cta: "Bepul boshlash",
    features: [
      "Kuniga 5 ta mashq savoli",
      "Cheklangan AI tutor (kuniga 3 ta savol)",
      "Asosiy o'quv reja",
    ],
    notIncluded: [
      "Mock testlar",
      "Yozma ish avto-baholash",
      "Savol banki to'liq",
      "Batafsil statistika",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    icon: Rocket,
    tagline: "Jiddiy tayyorgarlik ko'rayotganlar uchun",
    monthly: 79_000,
    yearly: 59_000,
    tone: "brand",
    highlighted: true,
    cta: "Premiumni tanlash",
    features: [
      "Cheksiz mock testlar",
      "Cheksiz AI tutor savollari",
      "Yozma ish avto-baholash",
      "Batafsil statistika va tahlil",
      "Savol banki to'liq ochiq",
      "Aralash takror lug'at",
      "Reklamasiz tajriba",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    icon: Crown,
    tagline: "Maksimal natija va shaxsiy yo'naltirish",
    monthly: 149_000,
    yearly: 119_000,
    tone: "accent",
    cta: "Pro ga o'tish",
    features: [
      "Premium'dagi barcha imkoniyatlar",
      "Haftalik shaxsiy tahlil hisoboti",
      "Og'zaki nutq avto-baholash",
      "Prioritet AI tutor (tezroq javob)",
      "Imtihon strategiyasi bo'yicha darslar",
      "Telegram'da ustoz qo'llab-quvvatlashi",
    ],
  },
];
