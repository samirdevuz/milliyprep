import assert from "node:assert/strict";
import test from "node:test";
import {
  PracticeInputError,
  validateAttemptSubmission,
} from "../src/lib/practice/attempt-validation.ts";
import type { AdminQuestionBank } from "../src/lib/practice/types";

const bank: AdminQuestionBank = {
  subjects: [
    {
      id: "english",
      name: "Ingliz tili",
      description: "Til ko'nikmalari",
      color: "brand",
      examWeight: 100,
      position: 1,
    },
  ],
  topics: [
    {
      id: "reading",
      subjectId: "english",
      name: "Reading",
      description: "Matn tahlili",
      level: "medium",
      estimatedMinutes: 15,
      position: 1,
    },
  ],
  questions: [
    {
      id: "q-1",
      subjectId: "english",
      topicId: "reading",
      prompt: "Birinchi savol",
      options: ["A", "B"],
      type: "single_choice",
      position: 1,
      points: 1.3,
      correctIndex: 0,
      explanation: "A to'g'ri",
      difficulty: "easy",
      reviewStatus: "published",
    },
    {
      id: "q-2",
      subjectId: "english",
      topicId: "reading",
      prompt: "Ikkinchi savol",
      options: ["A", "B", "C"],
      type: "single_choice",
      position: 2,
      points: 2.2,
      correctIndex: 2,
      explanation: "C to'g'ri",
      difficulty: "medium",
      reviewStatus: "published",
    },
  ],
};

test("valid practice submission is accepted", () => {
  const result = validateAttemptSubmission(bank, {
    mode: "practice",
    topicId: "reading",
    questionIds: ["q-1", "q-2"],
    answers: [
      { questionId: "q-1", selectedIndex: 0 },
      { questionId: "q-2", selectedIndex: 2 },
    ],
  });

  assert.equal(result.topic?.id, "reading");
  assert.deepEqual(
    result.questions.map((question) => question.id),
    ["q-1", "q-2"]
  );
});

test("a subset or reordered question set is rejected", () => {
  assert.throws(
    () =>
      validateAttemptSubmission(bank, {
        mode: "practice",
        topicId: "reading",
        questionIds: ["q-2", "q-1"],
        answers: [
          { questionId: "q-2", selectedIndex: 2 },
          { questionId: "q-1", selectedIndex: 0 },
        ],
      }),
    PracticeInputError
  );
});

test("duplicate answers are rejected", () => {
  assert.throws(
    () =>
      validateAttemptSubmission(bank, {
        mode: "practice",
        topicId: "reading",
        questionIds: ["q-1", "q-2"],
        answers: [
          { questionId: "q-1", selectedIndex: 0 },
          { questionId: "q-1", selectedIndex: 0 },
        ],
      }),
    PracticeInputError
  );
});

test("an option index outside the question options is rejected", () => {
  assert.throws(
    () =>
      validateAttemptSubmission(bank, {
        mode: "practice",
        topicId: "reading",
        questionIds: ["q-1", "q-2"],
        answers: [
          { questionId: "q-1", selectedIndex: 9 },
          { questionId: "q-2", selectedIndex: 2 },
        ],
      }),
    PracticeInputError
  );
});

test("practice mode requires a real topic", () => {
  assert.throws(
    () =>
      validateAttemptSubmission(bank, {
        mode: "practice",
        topicId: "missing",
        questionIds: ["q-1", "q-2"],
        answers: [
          { questionId: "q-1", selectedIndex: 0 },
          { questionId: "q-2", selectedIndex: 2 },
        ],
      }),
    PracticeInputError
  );
});
