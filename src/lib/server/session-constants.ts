/**
 * Session constants with no runtime dependencies, safe to import from
 * the Edge runtime (middleware/proxy).
 */
export const SESSION_COOKIE = "mp_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days (seconds)

export interface SessionPayload {
  userId: string;
  name: string;
  iat: number;
  exp: number;
}
