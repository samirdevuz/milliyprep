import { ONBOARDING_STORAGE_KEY } from "@/lib/onboarding/types";

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface OtpResult extends AuthResult {
  /** Present only in development so the UI can prefill the code. */
  devCode?: string;
}

function readOnboarding(): Record<string, unknown> | undefined {
  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : undefined;
  } catch {
    return undefined;
  }
}

async function postJson(url: string, body: unknown): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** Send an OTP for register or login. */
export async function sendOtp(input: {
  channel: "email" | "phone";
  contact: string;
  purpose: "register" | "login";
}): Promise<OtpResult> {
  const res = await postJson("/api/auth/otp/send", input);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: data.error ?? "Xatolik yuz berdi." };
  return { ok: true, devCode: data.devCode };
}

/** Verify an OTP code. */
export async function verifyOtp(input: {
  channel: "email" | "phone";
  contact: string;
  code: string;
}): Promise<AuthResult> {
  const res = await postJson("/api/auth/otp/verify", input);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: data.error ?? "Kod noto'g'ri." };
  return { ok: true };
}

export async function registerUser(input: {
  name: string;
  method: "email" | "phone";
  contact: string;
  code: string;
  password: string;
}): Promise<AuthResult> {
  const res = await postJson("/api/auth/register", {
    ...input,
    onboarding: readOnboarding(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: data.error ?? "Xatolik yuz berdi." };
  return { ok: true };
}

export async function loginUser(input: {
  method: "email" | "phone";
  contact: string;
  password: string;
}): Promise<AuthResult> {
  const res = await postJson("/api/auth/login", input);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: data.error ?? "Xatolik yuz berdi." };
  return { ok: true };
}

/** Complete Telegram registration with the bot-issued code. */
export async function registerTelegram(input: {
  code: string;
  name: string;
  password: string;
}): Promise<AuthResult> {
  const res = await postJson("/api/auth/telegram", {
    ...input,
    onboarding: readOnboarding(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: data.error ?? "Xatolik yuz berdi." };
  return { ok: true };
}

/** Reset a password after OTP verification. Signs the user in on success. */
export async function resetPassword(input: {
  channel: "email" | "phone";
  contact: string;
  code: string;
  password: string;
}): Promise<AuthResult> {
  const res = await postJson("/api/auth/reset-password", input);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: data.error ?? "Xatolik yuz berdi." };
  return { ok: true };
}

export async function logoutUser(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}
