import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getAppUrl } from "@/lib/server/app-url";

function safeNextPath(value: string | null): string {
  if (!value?.startsWith("/")) return "/dashboard";
  if (value.startsWith("//")) return "/dashboard";
  return value;
}

/**
 * Begin Google OAuth. Redirects the user to Google's consent screen.
 * Requires GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and a configured redirect
 * URI: {APP_URL}/api/auth/google/callback
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = getAppUrl(req.url);

  if (!clientId) {
    // Not configured — bounce back with a friendly error flag.
    return NextResponse.redirect(
      `${appUrl}/login?error=google_not_configured`
    );
  }

  const state = randomBytes(16).toString("hex");
  const store = await cookies();
  store.set("g_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  store.set("g_oauth_next", safeNextPath(url.searchParams.get("next")), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${appUrl}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
