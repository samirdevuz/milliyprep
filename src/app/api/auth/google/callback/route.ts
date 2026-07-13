import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";
import { cookies } from "next/headers";
import { userStore } from "@/lib/server/db";
import { createSessionCookie } from "@/lib/server/auth";
import { getAppUrl } from "@/lib/server/app-url";
import { GOOGLE_ONBOARDING_COOKIE } from "@/lib/server/google-oauth";
import { sanitizeOnboarding } from "@/lib/onboarding/server-validation";

interface GoogleTokenResponse {
  access_token?: string;
  id_token?: string;
  error?: string;
}

interface GoogleUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

function readOnboardingCookie(value?: string): Record<string, unknown> | undefined {
  if (!value) return undefined;
  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    return sanitizeOnboarding(JSON.parse(decoded));
  } catch {
    return undefined;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const appUrl = getAppUrl(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const store = await cookies();
  const savedState = store.get("g_oauth_state")?.value;
  const nextPath = store.get("g_oauth_next")?.value ?? "/dashboard";
  const onboarding = readOnboardingCookie(
    store.get(GOOGLE_ONBOARDING_COOKIE)?.value
  );

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(`${appUrl}/login?error=google_state`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${appUrl}/login?error=google_not_configured`);
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${appUrl}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });

  const tokens = (await tokenRes.json()) as GoogleTokenResponse;
  if (!tokenRes.ok || !tokens.access_token) {
    return NextResponse.redirect(`${appUrl}/login?error=google_token`);
  }

  // Fetch profile
  const infoRes = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    { headers: { Authorization: `Bearer ${tokens.access_token}` } }
  );
  const info = (await infoRes.json()) as GoogleUserInfo;
  if (!infoRes.ok || !info.sub) {
    return NextResponse.redirect(`${appUrl}/login?error=google_profile`);
  }

  // Find or create the user
  let user = await userStore.findByProvider("google", info.sub);
  if (!user && info.email) {
    const emailVerified = info.email_verified === true;
    user = emailVerified ? await userStore.findByEmail(info.email) : undefined;
    if (user) {
      // Link existing email account to Google.
      user = (await userStore.update(user.id, {
        provider: "google",
        externalId: info.sub,
        emailVerified: true,
        onboarding: user.onboarding ?? onboarding,
      })) ?? user;
    } else if (!emailVerified) {
      return NextResponse.redirect(`${appUrl}/login?error=google_unverified_email`);
    }
  }
  if (!user) {
    user = await userStore.create({
      name:
        (typeof onboarding?.fullName === "string" ? onboarding.fullName : undefined) ??
        info.name ??
        info.email?.split("@")[0] ??
        "Foydalanuvchi",
      email: info.email,
      passwordHash: "",
      provider: "google",
      externalId: info.sub,
      emailVerified: Boolean(info.email_verified),
      onboarding,
    });
  }

  store.delete("g_oauth_state");
  store.delete("g_oauth_next");
  store.delete(GOOGLE_ONBOARDING_COOKIE);
  await createSessionCookie(user.id, user.name);

  return NextResponse.redirect(`${appUrl}${nextPath}`);
}
