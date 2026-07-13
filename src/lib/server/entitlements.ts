import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import type { PaymentOrder } from "@/lib/payments/types";
import {
  hasActiveSubscription,
  type Subscription,
} from "@/lib/payments/subscription-types";
import { subscriptionPeriodEnd } from "@/lib/payments/subscription-period";
import {
  formatSupabaseError,
  getSupabaseAdmin,
  isSupabaseConnectionError,
} from "./supabase";
import { requireLocalDataFallback } from "./config";

interface SubscriptionRow {
  user_id: string;
  plan_id: "pro";
  billing: Subscription["billing"];
  status: Subscription["status"];
  current_period_start: string;
  current_period_end: string;
  source_order_id: string;
}

interface LocalEntitlements {
  subscriptions: Subscription[];
  activatedOrderIds: string[];
}

const FILE = path.join(process.cwd(), "data", "subscriptions.json");

function toSubscription(row: SubscriptionRow): Subscription {
  return {
    userId: row.user_id,
    planId: row.plan_id,
    billing: row.billing,
    status: row.status,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end,
    sourceOrderId: row.source_order_id,
  };
}

function missingSchema(message: string): boolean {
  const value = message.toLowerCase();
  return value.includes("subscriptions") &&
    (value.includes("does not exist") || value.includes("schema cache"));
}

async function readLocal(): Promise<LocalEntitlements> {
  requireLocalDataFallback("Local subscription store");
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, "utf8")) as LocalEntitlements;
    return {
      subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : [],
      activatedOrderIds: Array.isArray(parsed.activatedOrderIds)
        ? parsed.activatedOrderIds
        : [],
    };
  } catch {
    return { subscriptions: [], activatedOrderIds: [] };
  }
}

async function writeLocal(value: LocalEntitlements): Promise<void> {
  await fs.writeFile(FILE, JSON.stringify(value, null, 2), "utf8");
}

export async function activateLocalSubscription(order: PaymentOrder): Promise<void> {
  if (!order.userId) return;
  const state = await readLocal();
  if (state.activatedOrderIds.includes(order.id)) return;

  const index = state.subscriptions.findIndex((item) => item.userId === order.userId);
  const existing = index >= 0 ? state.subscriptions[index] : undefined;
  const now = new Date().toISOString();
  const start =
    existing && new Date(existing.currentPeriodEnd).getTime() > Date.now()
      ? existing.currentPeriodEnd
      : now;
  const subscription: Subscription = {
    userId: order.userId,
    planId: order.planId,
    billing: order.billing,
    status: "active",
    currentPeriodStart: start,
    currentPeriodEnd: subscriptionPeriodEnd(start, order.billing),
    sourceOrderId: order.id,
  };

  if (index >= 0) state.subscriptions[index] = subscription;
  else state.subscriptions.push(subscription);
  state.activatedOrderIds.push(order.id);
  await writeLocal(state);
}

export async function cancelLocalSubscription(order: PaymentOrder): Promise<void> {
  if (!order.userId) return;
  const state = await readLocal();
  const index = state.subscriptions.findIndex(
    (item) => item.userId === order.userId && item.sourceOrderId === order.id
  );
  if (index < 0) return;
  state.subscriptions[index] = {
    ...state.subscriptions[index],
    status: "canceled",
    currentPeriodEnd: new Date().toISOString(),
  };
  await writeLocal(state);
}

export const entitlementStore = {
  async getByUser(userId: string): Promise<Subscription | undefined> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) {
        if (!missingSchema(error.message) && !isSupabaseConnectionError(error.message)) {
          throw formatSupabaseError("get subscription", error.message);
        }
      } else {
        return data ? toSubscription(data as SubscriptionRow) : undefined;
      }
    }

    const state = await readLocal();
    return state.subscriptions.find((item) => item.userId === userId);
  },

  async hasPro(userId: string): Promise<boolean> {
    return hasActiveSubscription(await entitlementStore.getByUser(userId));
  },
};

export function entitlementEnforced(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.ENFORCE_SUBSCRIPTIONS !== "false"
  );
}
