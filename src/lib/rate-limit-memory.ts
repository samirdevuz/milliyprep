export interface RateLimitResult {
  ok: boolean;
  retryAfter: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export class MemoryRateLimiter {
  private readonly buckets = new Map<string, Bucket>();
  private readonly maxBuckets: number;

  constructor(maxBuckets = 5000) {
    this.maxBuckets = maxBuckets;
  }

  consume(
    key: string,
    limit: number,
    windowMs: number,
    now = Date.now()
  ): RateLimitResult {
    this.cleanup(now);
    const existing = this.buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { ok: true, retryAfter: 0 };
    }

    if (existing.count >= limit) {
      return {
        ok: false,
        retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
      };
    }

    existing.count += 1;
    return { ok: true, retryAfter: 0 };
  }

  private cleanup(now: number): void {
    if (this.buckets.size < this.maxBuckets) return;
    for (const [key, bucket] of this.buckets.entries()) {
      if (bucket.resetAt <= now) this.buckets.delete(key);
    }
  }
}
