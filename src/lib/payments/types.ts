import type { Plan } from "@/lib/pricing";

export type PaymentProvider = "click" | "payme";
export type PaymentBilling = "monthly" | "yearly";
export type PaymentStatus = "pending" | "paid" | "canceled";

export interface PaymentOrder {
  id: string;
  userId?: string;
  planId: Plan["id"];
  billing: PaymentBilling;
  provider: PaymentProvider;
  amountTiyin: number;
  status: PaymentStatus;
  providerTransactionId?: string;
  providerState?: number;
  createdAt: string;
  paidAt?: string;
  canceledAt?: string;
}
