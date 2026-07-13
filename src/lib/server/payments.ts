import "server-only";

import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  formatSupabaseError,
  getSupabaseAdmin,
  isSupabaseConnectionError,
} from "./supabase";
import { requireLocalDataFallback } from "./config";
import type {
  PaymentBilling,
  PaymentOrder,
  PaymentProvider,
  PaymentStatus,
} from "@/lib/payments/types";
import {
  activateLocalSubscription,
  cancelLocalSubscription,
} from "./entitlements";

interface PaymentRow {
  id: string;
  user_id: string | null;
  plan_id: PaymentOrder["planId"];
  billing: PaymentBilling;
  provider: PaymentProvider;
  amount_tiyin: number;
  status: PaymentStatus;
  provider_transaction_id: string | null;
  provider_state: number | null;
  created_at: string;
  paid_at: string | null;
  canceled_at: string | null;
}

const DATA_DIR = path.join(process.cwd(), "data");
const PAYMENTS_FILE = path.join(DATA_DIR, "payments.json");

function isMissingPaymentSchema(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("payment_orders") &&
    (normalized.includes("does not exist") ||
      normalized.includes("schema cache") ||
      normalized.includes("could not find"))
  );
}

async function ensureFile(): Promise<void> {
  requireLocalDataFallback("Local payment store");
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(PAYMENTS_FILE);
  } catch {
    await fs.writeFile(PAYMENTS_FILE, "[]", "utf8");
  }
}

async function readLocal(): Promise<PaymentOrder[]> {
  await ensureFile();
  try {
    return JSON.parse(await fs.readFile(PAYMENTS_FILE, "utf8")) as PaymentOrder[];
  } catch {
    return [];
  }
}

async function writeLocal(orders: PaymentOrder[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(PAYMENTS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

function toOrder(row: PaymentRow): PaymentOrder {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    planId: row.plan_id,
    billing: row.billing,
    provider: row.provider,
    amountTiyin: row.amount_tiyin,
    status: row.status,
    providerTransactionId: row.provider_transaction_id ?? undefined,
    providerState: row.provider_state ?? undefined,
    createdAt: row.created_at,
    paidAt: row.paid_at ?? undefined,
    canceledAt: row.canceled_at ?? undefined,
  };
}

function toRow(order: PaymentOrder) {
  return {
    id: order.id,
    user_id: order.userId ?? null,
    plan_id: order.planId,
    billing: order.billing,
    provider: order.provider,
    amount_tiyin: order.amountTiyin,
    status: order.status,
    provider_transaction_id: order.providerTransactionId ?? null,
    provider_state: order.providerState ?? null,
    created_at: order.createdAt,
    paid_at: order.paidAt ?? null,
    canceled_at: order.canceledAt ?? null,
  };
}

export const paymentStore = {
  async create(input: {
    userId?: string;
    planId: PaymentOrder["planId"];
    billing: PaymentBilling;
    provider: PaymentProvider;
    amountTiyin: number;
  }): Promise<PaymentOrder> {
    const order: PaymentOrder = {
      id: randomUUID(),
      userId: input.userId,
      planId: input.planId,
      billing: input.billing,
      provider: input.provider,
      amountTiyin: input.amountTiyin,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("payment_orders")
        .insert(toRow(order))
        .select("*")
        .single();
      if (error) {
        if (
          !isMissingPaymentSchema(error.message) &&
          !isSupabaseConnectionError(error.message)
        ) {
          throw formatSupabaseError("create payment order", error.message);
        }
      } else {
        return toOrder(data as PaymentRow);
      }
    }

    const orders = await readLocal();
    orders.push(order);
    await writeLocal(orders);
    return order;
  },

  async get(id: string): Promise<PaymentOrder | undefined> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("payment_orders")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) {
        if (
          !isMissingPaymentSchema(error.message) &&
          !isSupabaseConnectionError(error.message)
        ) {
          throw formatSupabaseError("get payment order", error.message);
        }
      } else {
        return data ? toOrder(data as PaymentRow) : undefined;
      }
    }

    const orders = await readLocal();
    return orders.find((order) => order.id === id);
  },

  async findByProviderTransaction(
    provider: PaymentProvider,
    providerTransactionId: string
  ): Promise<PaymentOrder | undefined> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("payment_orders")
        .select("*")
        .eq("provider", provider)
        .eq("provider_transaction_id", providerTransactionId)
        .maybeSingle();
      if (error) {
        if (
          !isMissingPaymentSchema(error.message) &&
          !isSupabaseConnectionError(error.message)
        ) {
          throw formatSupabaseError("find payment transaction", error.message);
        }
      } else {
        return data ? toOrder(data as PaymentRow) : undefined;
      }
    }

    const orders = await readLocal();
    return orders.find(
      (order) =>
        order.provider === provider &&
        order.providerTransactionId === providerTransactionId
    );
  },

  async update(
    id: string,
    patch: Partial<
      Pick<
        PaymentOrder,
        | "status"
        | "providerTransactionId"
        | "providerState"
        | "paidAt"
        | "canceledAt"
      >
    >
  ): Promise<PaymentOrder | undefined> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const rowPatch: Partial<PaymentRow> = {};
      if ("status" in patch) rowPatch.status = patch.status;
      if ("providerTransactionId" in patch) {
        rowPatch.provider_transaction_id = patch.providerTransactionId ?? null;
      }
      if ("providerState" in patch) {
        rowPatch.provider_state = patch.providerState ?? null;
      }
      if ("paidAt" in patch) rowPatch.paid_at = patch.paidAt ?? null;
      if ("canceledAt" in patch) rowPatch.canceled_at = patch.canceledAt ?? null;

      const { data, error } = await supabase
        .from("payment_orders")
        .update(rowPatch)
        .eq("id", id)
        .select("*")
        .maybeSingle();
      if (error) {
        if (
          !isMissingPaymentSchema(error.message) &&
          !isSupabaseConnectionError(error.message)
        ) {
          throw formatSupabaseError("update payment order", error.message);
        }
      } else {
        return data ? toOrder(data as PaymentRow) : undefined;
      }
    }

    const orders = await readLocal();
    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) return undefined;
    orders[index] = { ...orders[index], ...patch };
    await writeLocal(orders);
    return orders[index];
  },

  async complete(
    id: string,
    providerTransactionId: string | undefined,
    providerState: number
  ): Promise<boolean> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.rpc("complete_payment_order", {
        p_order_id: id,
        p_provider_transaction_id: providerTransactionId ?? null,
        p_provider_state: providerState,
      });
      if (error) {
        if (!isSupabaseConnectionError(error.message)) {
          throw formatSupabaseError("complete payment order", error.message);
        }
      } else {
        return data === true;
      }
    }

    const orders = await readLocal();
    const index = orders.findIndex((order) => order.id === id);
    if (index < 0 || !orders[index].userId || orders[index].status === "canceled") {
      return false;
    }
    const paidAt = orders[index].paidAt ?? new Date().toISOString();
    orders[index] = {
      ...orders[index],
      status: "paid",
      providerTransactionId: providerTransactionId ?? orders[index].providerTransactionId,
      providerState,
      paidAt,
      canceledAt: undefined,
    };
    await writeLocal(orders);
    await activateLocalSubscription(orders[index]);
    return true;
  },

  async cancel(
    id: string,
    providerTransactionId: string | undefined,
    providerState: number
  ): Promise<boolean> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.rpc("cancel_payment_order", {
        p_order_id: id,
        p_provider_transaction_id: providerTransactionId ?? null,
        p_provider_state: providerState,
      });
      if (error) {
        if (!isSupabaseConnectionError(error.message)) {
          throw formatSupabaseError("cancel payment order", error.message);
        }
      } else {
        return data === true;
      }
    }

    const orders = await readLocal();
    const index = orders.findIndex((order) => order.id === id);
    if (index < 0) return false;
    orders[index] = {
      ...orders[index],
      status: "canceled",
      providerTransactionId: providerTransactionId ?? orders[index].providerTransactionId,
      providerState,
      canceledAt: orders[index].canceledAt ?? new Date().toISOString(),
    };
    await writeLocal(orders);
    await cancelLocalSubscription(orders[index]);
    return true;
  },
};
