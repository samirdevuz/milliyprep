"use client";

import { useMemo, useSyncExternalStore } from "react";
import { ONBOARDING_STORAGE_KEY, type OnboardingState } from "./types";

function getSnapshot(): string | null {
  try {
    return window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): null {
  return null;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function parseSnapshot(raw: string | null): OnboardingState {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as OnboardingState;
  } catch {
    return {};
  }
}

export function persistOnboarding(state: OnboardingState): void {
  try {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota/storage errors; the in-memory state still works.
  }
}

export function clearPersistedOnboarding(): void {
  try {
    window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
}

export function useStoredOnboarding(): OnboardingState {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => parseSnapshot(raw), [raw]);
}
