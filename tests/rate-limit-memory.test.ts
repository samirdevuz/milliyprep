import test from "node:test";
import assert from "node:assert/strict";
import { MemoryRateLimiter } from "../src/lib/rate-limit-memory.ts";

test("rate limiter allows requests up to the configured limit", () => {
  const limiter = new MemoryRateLimiter();
  assert.deepEqual(limiter.consume("login:user", 2, 60_000, 1_000), {
    ok: true,
    retryAfter: 0,
  });
  assert.deepEqual(limiter.consume("login:user", 2, 60_000, 2_000), {
    ok: true,
    retryAfter: 0,
  });
  assert.deepEqual(limiter.consume("login:user", 2, 60_000, 3_000), {
    ok: false,
    retryAfter: 58,
  });
});

test("rate limiter starts a fresh bucket after the window expires", () => {
  const limiter = new MemoryRateLimiter();
  limiter.consume("otp:user", 1, 10_000, 5_000);
  assert.equal(limiter.consume("otp:user", 1, 10_000, 14_999).ok, false);
  assert.deepEqual(limiter.consume("otp:user", 1, 10_000, 15_000), {
    ok: true,
    retryAfter: 0,
  });
});

test("separate keys do not share counters", () => {
  const limiter = new MemoryRateLimiter();
  limiter.consume("a", 1, 10_000, 0);
  assert.equal(limiter.consume("a", 1, 10_000, 1).ok, false);
  assert.equal(limiter.consume("b", 1, 10_000, 1).ok, true);
});
