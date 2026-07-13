import { NextResponse } from "next/server";
import { PLANS, planPriceTiyin } from "@/lib/pricing";
import { paymentStore } from "@/lib/server/payments";
import { getSession } from "@/lib/server/auth";
import type { PaymentBilling, PaymentProvider } from "@/lib/payments/types";
import { clickCheckoutUrl, paymeCheckoutUrl } from "@/lib/payments/providers";

function isProvider(value: unknown): value is PaymentProvider {
  return value === "click" || value === "payme";
}

function isBilling(value: unknown): value is PaymentBilling {
  return value === "monthly" || value === "yearly";
}

export async function POST(req: Request) {
  let body: { plan?: string; billing?: string; provider?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov." }, { status: 400 });
  }

  const plan = PLANS.find((item) => item.id === body.plan);
  const billing = isBilling(body.billing) ? body.billing : "monthly";
  const provider = isProvider(body.provider) ? body.provider : undefined;

  if (!plan) {
    return NextResponse.json(
      { error: "To'lov faqat pullik tarif uchun yaratiladi." },
      { status: 422 }
    );
  }
  if (!provider) {
    return NextResponse.json(
      { error: "To'lov provayderini tanlang." },
      { status: 422 }
    );
  }

  const amountTiyin = planPriceTiyin(plan, billing);
  const session = await getSession();
  const order = await paymentStore.create({
    userId: session?.userId,
    planId: plan.id,
    billing,
    provider,
    amountTiyin,
  });

  try {
    const redirectUrl =
      provider === "click"
        ? clickCheckoutUrl(order, req.url)
        : paymeCheckoutUrl(order, req.url);
    return NextResponse.json({ ok: true, orderId: order.id, redirectUrl });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "To'lov sozlamalari to'liq emas.",
      },
      { status: 503 }
    );
  }
}
