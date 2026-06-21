"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { OnboardingState } from "./types";
import {
  clearPersistedOnboarding,
  persistOnboarding,
  useHydrated,
  useStoredOnboarding,
} from "./storage";

interface OnboardingContextValue {
  state: OnboardingState;
  set: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  patch: (delta: Partial<OnboardingState>) => void;
  reset: () => void;
  hydrated: boolean;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

/**
 * Persists onboarding answers to localStorage so users can refresh the
 * page or come back later without losing progress.
 */
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const storedState = useStoredOnboarding();
  const [draftState, setDraftState] = useState<OnboardingState | null>(null);
  const state = draftState ?? storedState;

  const commit = useCallback((next: OnboardingState) => {
    setDraftState(next);
    persistOnboarding(next);
  }, []);

  const set = useCallback(
    <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => {
      commit({ ...state, [key]: value });
    },
    [commit, state]
  );

  const patch = useCallback((delta: Partial<OnboardingState>) => {
    commit({ ...state, ...delta });
  }, [commit, state]);

  const reset = useCallback(() => {
    setDraftState({});
    clearPersistedOnboarding();
  }, []);

  const value = useMemo(
    () => ({ state, set, patch, reset, hydrated }),
    [state, set, patch, reset, hydrated]
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return ctx;
}
