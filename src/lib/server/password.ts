import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Hash a password using scrypt with a random salt.
 * Format: `${salt}:${hash}` (both hex).
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/** Constant-time verification of a password against a stored hash. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, "hex");
  const testBuf = scryptSync(password, salt, 64);
  return (
    hashBuf.length === testBuf.length && timingSafeEqual(hashBuf, testBuf)
  );
}
