import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { entitlementStore } from "@/lib/server/entitlements";
import { hasActiveSubscription } from "@/lib/payments/subscription-types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Avval hisobga kiring." }, { status: 401 });
  }

  const subscription = await entitlementStore.getByUser(session.userId);
  return NextResponse.json({
    active: hasActiveSubscription(subscription),
    subscription: subscription ?? null,
  });
}
