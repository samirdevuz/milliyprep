import test from "node:test";
import assert from "node:assert/strict";
import {
  OnboardingInputError,
  sanitizeOnboarding,
} from "../src/lib/onboarding/server-validation.ts";

test("valid onboarding is normalized and unknown keys are removed", () => {
  assert.deepEqual(
    sanitizeOnboarding({
      fullName: "  Ali Valiyev  ",
      subjectId: "english",
      resultStatus: "has-score",
      currentScore: 55,
      targetScore: 71,
      weeklyHours: 6,
      studyDays: 4,
      examPurpose: "university",
      referralSource: "telegram",
      admin: true,
    }),
    {
      fullName: "Ali Valiyev",
      subjectId: "english",
      resultStatus: "has-score",
      currentScore: 55,
      targetScore: 71,
      weeklyHours: 6,
      studyDays: 4,
      examPurpose: "university",
      referralSource: "telegram",
    }
  );
});

test("invalid subject is rejected", () => {
  assert.throws(
    () => sanitizeOnboarding({ subjectId: "dtm" }),
    OnboardingInputError
  );
});

test("current score is rejected when result status has no score", () => {
  assert.throws(
    () => sanitizeOnboarding({ resultStatus: "not-taken", currentScore: 50 }),
    OnboardingInputError
  );
});

test("target score must be above a known current score", () => {
  assert.throws(
    () =>
      sanitizeOnboarding({
        resultStatus: "has-score",
        currentScore: 71,
        targetScore: 71,
      }),
    OnboardingInputError
  );
});

test("non-object onboarding is rejected", () => {
  assert.throws(() => sanitizeOnboarding("invalid"), OnboardingInputError);
});
