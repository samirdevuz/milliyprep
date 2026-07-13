import { NextResponse } from "next/server";
import { paymentStore } from "@/lib/server/payments";
import { verifyClickSignature } from "@/lib/payments/providers";

const OK = 0;
const SIGN_ERROR = -1;
const ORDER_NOT_FOUND = -5;
const AMOUNT_ERROR = -2;

function note(error: number) {
  const notes: Record<number, string> = {
    [OK]: "Success",
    [SIGN_ERROR]: "SIGN CHECK FAILED!",
    [ORDER_NOT_FOUND]: "Order not found",
    [AMOUNT_ERROR]: "Incorrect amount",
  };
  return notes[error] ?? "Unknown error";
}

export async function POST(req: Request) {
  const form = await req.formData();
  const payload = {
    clickTransId: String(form.get("click_trans_id") ?? ""),
    serviceId: String(form.get("service_id") ?? ""),
    merchantTransId: String(form.get("merchant_trans_id") ?? ""),
    amount: String(form.get("amount") ?? ""),
    action: String(form.get("action") ?? "0"),
    signTime: String(form.get("sign_time") ?? ""),
    signString: String(form.get("sign_string") ?? ""),
  };

  let error = OK;
  const order = await paymentStore.get(payload.merchantTransId);
  if (
    !verifyClickSignature(payload) ||
    payload.action !== "0"
  ) {
    error = SIGN_ERROR;
  } else if (!order) {
    error = ORDER_NOT_FOUND;
  } else if (Math.round(Number(payload.amount) * 100) !== order.amountTiyin) {
    error = AMOUNT_ERROR;
  }

  if (order && error === OK) {
    await paymentStore.update(order.id, {
      providerTransactionId: payload.clickTransId,
      providerState: 1,
    });
  }

  return NextResponse.json({
    click_trans_id: payload.clickTransId,
    merchant_trans_id: payload.merchantTransId,
    merchant_prepare_id: order?.id ?? payload.merchantTransId,
    error,
    error_note: note(error),
  });
}
