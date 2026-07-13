import { Buffer } from "node:buffer";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  OnboardingInputError,
  sanitizeOnboarding,
} from "@/lib/onboarding/server-validation";
import { GOOGLE_ONBOARDING_COOKIE } from "@/lib/server/google-oauth";

export async function POST(req: Request) {
  let body: { onboarding?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov." }, { status: 400 });
  }

  try {
    const onboarding = sanitizeOnboarding(body.onboarding);
    const store = await cookies();

    if (!onboarding) {
      store.delete(GOOGLE_ONBOARDING_COOKIE);
      return NextResponse.json({ ok: true });
    }

    const value = Buffer.from(JSON.stringify(onboarding), "utf8").toString("base64url");
    if (value.length > 3000) {
      return NextResponse.json(
        { error: "Onboarding ma'lumotlari juda katta." },
        { status: 422 }
      );
    }

    store.set(GOOGLE_ONBOARDING_COOKIE, value, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 600,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof OnboardingInputError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    throw error;
  }
}
