import { createHmac, timingSafeEqual } from "node:crypto";
import { getSessionSecret } from "./config";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  type SessionPayload,
} from "./session-constants";

export { SESSION_COOKIE, SESSION_MAX_AGE };
export type { SessionPayload };

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

/** Sign a session payload into a compact `data.signature` token. */
export function signSession(
  data: Omit<SessionPayload, "iat" | "exp">
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    ...data,
    iat: now,
    exp: now + SESSION_MAX_AGE,
  };
  const body = base64url(JSON.stringify(payload));
  const sig = createHmac("sha256", getSessionSecret())
    .update(body)
    .digest("base64url");
  return `${body}.${sig}`;
}

/** Verify a session token and return its payload, or null if invalid. */
export function verifySession(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = createHmac("sha256", getSessionSecret())
    .update(body)
    .digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString()
    ) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
