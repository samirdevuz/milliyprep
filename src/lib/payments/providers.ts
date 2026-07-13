import "server-only";

import { createHash } from "node:crypto";
import { clickConfig, paymeConfig, paymentReturnUrl } from "./config";
import type { PaymentOrder } from "./types";

function md5(value: string) {
  return createHash("md5").update(value).digest("hex");
}

export function verifyClickSignature(input: {
  clickTransId: string;
  serviceId: string;
  merchantTransId: string;
  amount: string;
  action: string;
  signTime: string;
  signString: string;
}) {
  const { secretKey } = clickConfig();
  if (!secretKey) return false;
  const expected = md5(
    `${input.clickTransId}${input.serviceId}${secretKey}${input.merchantTransId}${input.amount}${input.action}${input.signTime}`
  );
  return expected === input.signString;
}

export function clickCheckoutUrl(order: PaymentOrder, requestUrl: string) {
  const { merchantId, serviceId, checkoutUrl } = clickConfig();
  if (!merchantId || !serviceId) {
    throw new Error("Click sandbox sozlamalari to'liq emas.");
  }

  const params = new URLSearchParams({
    service_id: serviceId,
    merchant_id: merchantId,
    amount: (order.amountTiyin / 100).toFixed(2),
    transaction_param: order.id,
    return_url: paymentReturnUrl(requestUrl, order.id),
  });
  return `${checkoutUrl}?${params.toString()}`;
}

export function paymeCheckoutUrl(order: PaymentOrder, requestUrl: string) {
  const { merchantId, checkoutUrl } = paymeConfig();
  if (!merchantId) {
    throw new Error("Payme sandbox sozlamalari to'liq emas.");
  }

  const payload = [
    `m=${merchantId}`,
    `ac.order_id=${order.id}`,
    `a=${order.amountTiyin}`,
    `c=${paymentReturnUrl(requestUrl, order.id)}`,
  ].join(";");
  const encoded = Buffer.from(payload).toString("base64");
  return `${checkoutUrl}/${encoded}`;
}

export function verifyPaymeAuth(authHeader: string | null) {
  const { key } = paymeConfig();
  if (!key || !authHeader?.startsWith("Basic ")) return false;
  const decoded = Buffer.from(authHeader.slice("Basic ".length), "base64").toString(
    "utf8"
  );
  return decoded === `Paycom:${key}`;
}
