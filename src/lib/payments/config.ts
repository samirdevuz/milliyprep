import "server-only";

import { getAppUrl } from "@/lib/server/app-url";

function value(name: string): string | undefined {
  const raw = process.env[name]?.trim();
  return raw || undefined;
}

export function paymentMode() {
  return value("PAYMENT_MODE") === "production" ? "production" : "sandbox";
}

export function clickConfig() {
  return {
    merchantId: value("CLICK_MERCHANT_ID"),
    serviceId: value("CLICK_SERVICE_ID"),
    secretKey: value("CLICK_SECRET_KEY"),
    checkoutUrl:
      value("CLICK_CHECKOUT_URL") ?? "https://my.click.uz/services/pay",
  };
}

export function paymeConfig() {
  const mode = paymentMode();
  return {
    merchantId: value("PAYME_MERCHANT_ID"),
    key: value("PAYME_KEY"),
    checkoutUrl:
      value("PAYME_CHECKOUT_URL") ??
      (mode === "production"
        ? "https://checkout.paycom.uz"
        : "https://test.paycom.uz"),
  };
}

export function paymentReturnUrl(requestUrl: string, orderId: string) {
  return `${getAppUrl(requestUrl)}/register?from=payment&paid_order=${encodeURIComponent(orderId)}`;
}
