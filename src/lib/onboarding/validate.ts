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
        errors.fullName = "Ism va familiyangizni kiriting.";
      }
      if (!state.age || state.age < 10 || state.age > 60) {
        errors.age = "Yoshingizni 10 dan 60 gacha kiriting.";
      }
      if (!state.region) {
        errors.region = "Hududingizni tanlang.";
      }
      if (!state.hasTakenCertificate) {
        errors.hasTakenCertificate = "Holatingizni tanlang.";
      }
      break;
    }
    case 1: {
      if (!state.currentLevel) {
        errors.currentLevel = "Hozirgi darajangizni tanlang.";
      }
      if (!state.targetLevel) {
        errors.targetLevel = "Maqsadli darajani tanlang.";
      }
      if (!state.certificateLanguage) {
        errors.certificateLanguage = "Imtihon tilini tanlang.";
      }
      break;
    }
    case 2: {
      const skills = state.skillLevels ?? {};
      const required = ["listening", "reading", "writing", "speaking"] as const;
      if (required.some((skill) => !skills[skill])) {
        errors.skillLevels = "Har bir ko'nikma uchun daraja tanlang.";
      }
      if (!state.focusSkills || state.focusSkills.length === 0) {
        errors.focusSkills = "Kamida bitta asosiy ko'nikmani tanlang.";
      }
      break;
    }
    case 3: {
      if (!state.worries) {
        errors.worries = "Asosiy xavotiringizni tanlang.";
      }
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
    case 4: {
      if (!state.weeklyHours || state.weeklyHours < 1) {
        errors.weeklyHours = "Haftalik soatlar sonini kiriting.";
      }
      if (!state.studyFrequency) {
        errors.studyFrequency = "O'qish tezligini tanlang.";
      }
      if (!state.preferredTime) {
        errors.preferredTime = "Mashq qilish vaqtini tanlang.";
      }
      break;
    }
    case 5: {
      if (!state.motivation) {
        errors.motivation = "Asosiy motivatsiyani tanlang.";
      }
      if (!state.studyStyle) {
        errors.studyStyle = "O'qish uslubini tanlang.";
      }
      break;
    }
  }

  return errors;
}
