import "server-only";

import type { UserRecord } from "./db";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isLocalAppUrl(): boolean {
  const appUrl = process.env.APP_URL ?? "";
  return appUrl.includes("localhost") || appUrl.includes("127.0.0.1");
}

export function canManageAdmin(user: UserRecord | undefined): boolean {
  if (!user?.email) return false;
  const configured = adminEmails();
  if (configured.length) return configured.includes(user.email.toLowerCase());

  if (process.env.NODE_ENV === "production") return false;
  return isLocalAppUrl();
}
