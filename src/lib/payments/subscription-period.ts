import type { PaymentBilling } from "./types.ts";

export function subscriptionPeriodEnd(
  startIso: string,
  billing: PaymentBilling
): string {
  const start = new Date(startIso);
  const months = billing === "yearly" ? 12 : 1;
  const targetMonth = start.getUTCMonth() + months;
  const targetYear = start.getUTCFullYear() + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(targetYear, normalizedMonth + 1, 0)).getUTCDate();
  const end = new Date(start);
  end.setUTCFullYear(targetYear, normalizedMonth, Math.min(start.getUTCDate(), lastDay));
  return end.toISOString();
}
