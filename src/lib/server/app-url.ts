import "server-only";

export function getAppUrl(requestUrl?: string): string {
  const fallback = requestUrl ? new URL(requestUrl).origin : "http://localhost:3000";
  return (process.env.APP_URL ?? fallback).replace(/\/+$/, "");
}
