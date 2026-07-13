import type { Instrumentation } from "next";
import { logEvent } from "@/lib/observability";

export function register(): void {
  if (process.env.NODE_ENV === "production") {
    logEvent("info", "server.started", {
      runtime: process.env.NEXT_RUNTIME ?? "unknown",
      release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local",
    });
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  let pathname = request.path;
  try {
    pathname = new URL(request.path, "https://milliyprep.invalid").pathname;
  } catch {
    pathname = request.path.split("?")[0] ?? "unknown";
  }

  logEvent("error", "request.failed", {
    error,
    method: request.method,
    pathname,
    routePath: context.routePath,
    routeType: context.routeType,
    routerKind: context.routerKind,
    runtime: process.env.NEXT_RUNTIME ?? "unknown",
  });
};

