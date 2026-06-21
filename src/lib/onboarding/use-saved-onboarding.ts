"use client";

import type { OnboardingState } from "./types";
import { useHydrated, useStoredOnboarding } from "./storage";

/**
 * Reads onboarding answers saved to localStorage. Returns `null` until
 * hydration completes to avoid SSR mismatches.
 */
export function useSavedOnboarding(): {
  data: OnboardingState | null;
  hydrated: boolean;
} {
  const hydrated = useHydrated();
  const data = useStoredOnboarding();

  return { data: hydrated ? data : null, hydrated };
}

/** Returns the first name from a full name, or a friendly default. */
export function firstNameOf(fullName?: string): string {
  if (!fullName) return "o'quvchi";
  return fullName.trim().split(/\s+/)[0] || "o'quvchi";
}
