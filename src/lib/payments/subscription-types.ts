import type { PaymentBilling } from "./types.ts";

export interface Subscription {
  userId: string;
  planId: "pro";
  billing: PaymentBilling;
  status: "active" | "canceled" | "expired";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  sourceOrderId: string;
}

export function hasActiveSubscription(
  subscription: Subscription | undefined,
  now = Date.now()
): boolean {
  return Boolean(
    subscription?.status === "active" &&
      new Date(subscription.currentPeriodEnd).getTime() > now
  );
}
