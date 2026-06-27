import type { OnboardingState } from "./types";

type Errors = Partial<Record<string, string>>;

/**
 * Step-by-step validation. Returns an empty object when the step is valid.
 */
export function validateStep(step: number, state: OnboardingState): Errors {
  const errors: Errors = {};

  switch (step) {
    case 0: {
      if (!state.fullName || state.fullName.trim().length < 2) {
        errors.fullName = "Ismingizni kiriting (kamida 2 belgi).";
      }
      break;
    }
    case 1: {
      if (!state.subjectId) {
        errors.subjectId = "Tayyorlanayotgan faningizni tanlang.";
      }
      break;
    }
    case 2: {
      if (!state.resultStatus) {
        errors.resultStatus = "Hozirgi natijangiz holatini tanlang.";
      }
      if (
        state.resultStatus === "has-score" &&
        (typeof state.currentScore !== "number" ||
          state.currentScore < 0 ||
          state.currentScore > 100)
      ) {
        errors.currentScore = "0 dan 100 gacha ball kiriting.";
      }
      break;
    }
    case 3: {
      if (
        typeof state.targetScore !== "number" ||
        state.targetScore < 31 ||
        state.targetScore > 100
      ) {
        errors.targetScore = "Maqsadli ball 31 dan 100 gacha bo'lishi kerak.";
      }
      if (
        state.resultStatus === "has-score" &&
        typeof state.currentScore === "number" &&
        typeof state.targetScore === "number" &&
        state.targetScore <= state.currentScore
      ) {
        errors.targetScore = "Maqsadli ball hozirgi natijadan yuqori bo'lsin.";
      }
      break;
    }
    case 4: {
      if (!state.weeklyHours || state.weeklyHours < 1) {
        errors.weeklyHours = "Haftalik soatlar sonini kiriting.";
      }
      if (!state.studyDays || state.studyDays < 1 || state.studyDays > 7) {
        errors.studyDays = "Haftada 1 dan 7 gacha kun tanlang.";
      }
      break;
    }
    case 5: {
      if (!state.examPurpose) {
        errors.examPurpose = "Milliy Sertifikat maqsadingizni tanlang.";
      }
      if (
        state.examPurpose === "other" &&
        (!state.purposeOther || state.purposeOther.trim().length < 2)
      ) {
        errors.purposeOther = "Maqsadingizni qisqacha yozing.";
      }
      break;
    }
  }

  return errors;
}
