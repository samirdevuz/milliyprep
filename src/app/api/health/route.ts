import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/server/supabase";
import { logEvent } from "@/lib/observability";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    const development = process.env.NODE_ENV !== "production";
    return NextResponse.json(
      {
        status: development ? "ok" : "degraded",
        database: development ? "local" : "missing",
        timestamp: new Date().toISOString(),
      },
      {
        status: development ? 200 : 503,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  const { error } = await supabase
    .from("rate_limit_buckets")
    .select("bucket_key", { head: true, count: "exact" })
    .limit(1);
  if (error) {
    logEvent("error", "health.database_failed", { error: error.message });
    return NextResponse.json(
      {
        status: "degraded",
        database: "unavailable",
        timestamp: new Date().toISOString(),
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    {
      status: "ok",
      database: "ok",
      latencyMs: Date.now() - startedAt,
      release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local",
      timestamp: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
