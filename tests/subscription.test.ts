import test from "node:test";
import assert from "node:assert/strict";
import { subscriptionPeriodEnd } from "../src/lib/payments/subscription-period.ts";
import { hasActiveSubscription } from "../src/lib/payments/subscription-types.ts";

test("monthly subscription clamps to the last calendar day", () => {
  assert.equal(
    subscriptionPeriodEnd("2026-01-31T10:00:00.000Z", "monthly"),
    "2026-02-28T10:00:00.000Z"
  );
});

test("yearly subscription handles leap day", () => {
  assert.equal(
    subscriptionPeriodEnd("2024-02-29T10:00:00.000Z", "yearly"),
    "2025-02-28T10:00:00.000Z"
  );
});

test("only a non-expired active subscription grants access", () => {
  const base = {
    userId: "u1",
    planId: "pro" as const,
    billing: "monthly" as const,
    currentPeriodStart: "2026-07-01T00:00:00.000Z",
    currentPeriodEnd: "2026-08-01T00:00:00.000Z",
    sourceOrderId: "o1",
  };
  assert.equal(
    hasActiveSubscription(
      { ...base, status: "active" },
      Date.parse("2026-07-15T00:00:00.000Z")
    ),
    true
  );
  assert.equal(
    hasActiveSubscription(
      { ...base, status: "canceled" },
      Date.parse("2026-07-15T00:00:00.000Z")
    ),
    false
  );
  assert.equal(
    hasActiveSubscription(
      { ...base, status: "active" },
      Date.parse("2026-08-01T00:00:00.000Z")
    ),
    false
  );
});
