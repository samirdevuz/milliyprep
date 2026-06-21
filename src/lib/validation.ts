export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^\+?\d[\d\s-]{6,}$/;

export function isEmail(v: string): boolean {
  return EMAIL_RE.test(v.trim());
}

export function isPhone(v: string): boolean {
  return PHONE_RE.test(v.trim());
}

/** Normalize a phone to digits only (keeps leading + as 998 etc.). */
export function normalizePhone(v: string): string {
  return v.replace(/[^\d]/g, "");
}
