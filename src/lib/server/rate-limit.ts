import "server-only";
import { createHash } from "node:crypto";
import {
  MemoryRateLimiter,
  type RateLimitResult,
} from "@/lib/rate-limit-memory";
import { formatSupabaseError, getSupabaseAdmin } from "./supabase";
import { logEvent } from "@/lib/observability";

const memoryLimiter = new MemoryRateLimiter();

export function getClientIp(req: Request): string {
  const trusted =
    req.headers.get("x-vercel-forwarded-for") ??
    req.headers.get("cf-connecting-ip");
  if (trusted) return trusted.split(",")[0]?.trim() || "unknown";
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

function bucketHash(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const hashedKey = bucketHash(key);
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase.rpc("consume_rate_limit", {
      p_bucket_key: hashedKey,
      p_limit: limit,
      p_window_ms: windowMs,
    });
    if (!error) {
      const row = Array.isArray(data) ? data[0] : data;
      if (
        row &&
        typeof row.allowed === "boolean" &&
        typeof row.retry_after === "number"
      ) {
        const result = { ok: row.allowed, retryAfter: row.retry_after };
        if (!result.ok) {
          logEvent("warn", "rate_limit.blocked", {
            bucket: hashedKey.slice(0, 16),
            retryAfter: result.retryAfter,
          });
        }
        return result;
      }
      throw new Error("consume_rate_limit returned an invalid response.");
    }

    if (process.env.NODE_ENV === "production") {
      throw formatSupabaseError("consume rate limit", error.message);
    }
  }

  const result = memoryLimiter.consume(hashedKey, limit, windowMs);
  if (!result.ok) {
    logEvent("warn", "rate_limit.blocked", {
      bucket: hashedKey.slice(0, 16),
      retryAfter: result.retryAfter,
      backend: "memory",
    });
  }
  return result;
}

export function normalizedRateKey(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, "");
}
