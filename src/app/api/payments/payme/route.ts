import { NextResponse } from "next/server";
import { paymentStore } from "@/lib/server/payments";
import { verifyPaymeAuth } from "@/lib/payments/providers";
import type { PaymentOrder } from "@/lib/payments/types";
import { logEvent } from "@/lib/observability";

const STATE_CREATED = 1;
const STATE_COMPLETED = 2;
const STATE_CANCELED = -1;

function nowMs() {
  return Date.now();
}

function timeMs(value?: string) {
  return value ? new Date(value).getTime() : 0;
}

function rpcResult(id: unknown, result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id, result });
}

function rpcError(id: unknown, code: number, message: string) {
  return NextResponse.json({
    jsonrpc: "2.0",
    id,
    error: { code, message: { ru: message, uz: message, en: message } },
  });
}

function transaction(order: PaymentOrder) {
  const state =
    order.status === "paid"
      ? STATE_COMPLETED
      : order.status === "canceled"
        ? STATE_CANCELED
        : STATE_CREATED;
  return {
    transaction: order.id,
    state,
    create_time: timeMs(order.createdAt),
    perform_time: timeMs(order.paidAt),
    cancel_time: timeMs(order.canceledAt),
    reason: order.status === "canceled" ? 4 : null,
  };
}

export async function POST(req: Request) {
  let body: {
    id?: unknown;
    method?: string;
    params?: {
      id?: string;
      time?: number;
      amount?: number;
      account?: { order_id?: string };
      reason?: number;
    };
  };
  try {
    body = await req.json();
  } catch {
    return rpcError(null, -32700, "Parse error");
  }

  if (!verifyPaymeAuth(req.headers.get("authorization"))) {
    logEvent("warn", "payment.callback_rejected", {
      provider: "payme",
      reason: "invalid_auth",
      method: body.method ?? "unknown",
    });
    return rpcError(body.id, -32504, "Insufficient privileges");
  }

  const params = body.params ?? {};
  const orderId = params.account?.order_id;

  if (body.method === "CheckPerformTransaction") {
    if (!orderId) return rpcError(body.id, -31050, "Order id is required");
    const order = await paymentStore.get(orderId);
    if (!order || order.provider !== "payme") {
      return rpcError(body.id, -31050, "Order not found");
    }
    if (params.amount !== order.amountTiyin) {
      return rpcError(body.id, -31001, "Incorrect amount");
    }
    if (order.status !== "pending") {
      return rpcError(body.id, -31008, "Operation cannot be performed");
    }
    return rpcResult(body.id, { allow: true });
  }

  if (body.method === "CreateTransaction") {
    if (!orderId) return rpcError(body.id, -31050, "Order id is required");
    const order = await paymentStore.get(orderId);
    if (!order || order.provider !== "payme") {
      return rpcError(body.id, -31050, "Order not found");
    }
    if (params.amount !== order.amountTiyin) {
      return rpcError(body.id, -31001, "Incorrect amount");
    }
    if (order.status !== "pending") {
      return rpcError(body.id, -31008, "Operation cannot be performed");
    }
    if (!params.id) return rpcError(body.id, -31050, "Transaction id is required");
    if (order.providerTransactionId) {
      if (order.providerTransactionId !== params.id) {
        return rpcError(body.id, -31008, "Operation cannot be performed");
      }
      return rpcResult(body.id, transaction(order));
    }
    await paymentStore.update(order.id, {
      providerTransactionId: params.id,
      providerState: STATE_CREATED,
    });
    return rpcResult(body.id, transaction({ ...order, providerTransactionId: params.id }));
  }

  if (body.method === "PerformTransaction") {
    const order = params.id
      ? await paymentStore.findByProviderTransaction("payme", params.id)
      : undefined;
    if (!order) return rpcError(body.id, -31003, "Transaction not found");
    const paidAt = order.paidAt ?? new Date(nowMs()).toISOString();
    const completed = await paymentStore.complete(
      order.id,
      order.providerTransactionId,
      STATE_COMPLETED
    );
    if (!completed) return rpcError(body.id, -31008, "Operation cannot be performed");
    logEvent("info", "payment.callback", {
      provider: "payme",
      orderId: order.id,
      providerTransactionId: order.providerTransactionId,
      outcome: "paid",
    });
    return rpcResult(body.id, transaction({ ...order, status: "paid", paidAt }));
  }

  if (body.method === "CancelTransaction") {
    const order = params.id
      ? await paymentStore.findByProviderTransaction("payme", params.id)
      : undefined;
    if (!order) return rpcError(body.id, -31003, "Transaction not found");
    const canceledAt = order.canceledAt ?? new Date(nowMs()).toISOString();
    const canceled = await paymentStore.cancel(
      order.id,
      order.providerTransactionId,
      STATE_CANCELED
    );
    if (!canceled) return rpcError(body.id, -31008, "Operation cannot be performed");
    logEvent("warn", "payment.callback", {
      provider: "payme",
      orderId: order.id,
      providerTransactionId: order.providerTransactionId,
      outcome: "canceled",
    });
    return rpcResult(
      body.id,
      transaction({ ...order, status: "canceled", canceledAt })
    );
  }

  if (body.method === "CheckTransaction") {
    const order = params.id
      ? await paymentStore.findByProviderTransaction("payme", params.id)
      : undefined;
    if (!order) return rpcError(body.id, -31003, "Transaction not found");
    return rpcResult(body.id, transaction(order));
  }

  if (body.method === "GetStatement") {
    return rpcResult(body.id, { transactions: [] });
  }

  return rpcError(body.id, -32601, "Method not found");
}
