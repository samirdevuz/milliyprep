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
      if (!state.age || state.age < 10 || state.age > 80) {
        errors.age = "10 dan 80 gacha haqiqiy yoshni kiriting.";
      }
      if (!state.region) {
        errors.region = "Hududingizni tanlang.";
      }
      break;
    }
    case 1: {
      if (!state.examType) {
        errors.examType = "Imtihon turini tanlang.";
      }
      if (!state.targetScore) {
        errors.targetScore = "Maqsadli ballni kiriting.";
      } else {
        const isMilliy = state.examType === "milliy-sertifikat";
        const min = isMilliy ? 1 : 50;
        const max = isMilliy ? 6 : 189;
        if (state.targetScore < min || state.targetScore > max) {
          errors.targetScore = `Ball ${min} dan ${max} gacha bo'lishi kerak.`;
        }
      }
      if (!state.examDate) {
        errors.examDate = "Imtihon sanasini kiriting.";
      } else {
        const d = new Date(state.examDate);
        if (Number.isNaN(d.getTime()) || d.getTime() < Date.now() - 86400000) {
          errors.examDate = "Sana bugun yoki kelajakda bo'lishi kerak.";
        }
      }
      break;
    }
    case 2: {
      if (!state.currentLevel) {
        errors.currentLevel = "Joriy darajangizni tanlang.";
      }
      if (!state.subjects || state.subjects.length === 0) {
        errors.subjects = "Kamida bitta fan tanlang.";
      }
      break;
    }
    case 3: {
      if (!state.weakAreas || state.weakAreas.length === 0) {
        errors.weakAreas = "Kamida bitta variantni tanlang.";
      }
      break;
    }
    case 4: {
      if (!state.weeklyHours || state.weeklyHours < 1) {
        errors.weeklyHours = "Haftalik soatlar sonini kiriting.";
      }
      if (!state.studyDays || state.studyDays < 1 || state.studyDays > 7) {
        errors.studyDays = "1 dan 7 gacha kunlar sonini kiriting.";
      }
      if (!state.preferredTime) {
        errors.preferredTime = "Qulay vaqtni tanlang.";
      }
      break;
    }
    case 5: {
      if (!state.motivation) {
        errors.motivation = "Motivatsiyangizni tanlang.";
      }
      if (!state.studyStyle) {
        errors.studyStyle = "Uslubingizni tanlang.";
      }
      break;
    }
  }

  return errors;
}
