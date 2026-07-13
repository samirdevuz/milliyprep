import type {
  AdminQuestionBank,
  PracticeMode,
  Question,
  SubmittedAnswer,
  Topic,
} from "./types";

const PRACTICE_QUESTION_LIMIT = 5;
const MOCK_QUESTION_LIMIT = 10;

export class PracticeInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PracticeInputError";
  }
}

export interface AttemptSubmissionInput {
  mode: PracticeMode;
  topicId?: string;
  questionIds: string[];
  answers: SubmittedAnswer[];
}

export interface ValidatedAttemptSubmission {
  questions: Question[];
  topic?: Topic;
  submitted: Map<string, number>;
}

function mockQuestions(bank: AdminQuestionBank): Question[] {
  return bank.questions
    .slice()
    .sort((a, b) => {
      if (a.subjectId === b.subjectId) return a.id.localeCompare(b.id);
      return a.subjectId.localeCompare(b.subjectId);
    })
    .slice(0, MOCK_QUESTION_LIMIT);
}

export function validateAttemptSubmission(
  bank: AdminQuestionBank,
  input: AttemptSubmissionInput
): ValidatedAttemptSubmission {
  const topic = input.topicId
    ? bank.topics.find((item) => item.id === input.topicId)
    : undefined;
  if (input.mode === "practice" && !topic) {
    throw new PracticeInputError("Mashg'ulot mavzusi topilmadi.");
  }

  const questions =
    input.mode === "practice"
      ? bank.questions
          .filter((question) => question.topicId === topic?.id)
          .slice(0, PRACTICE_QUESTION_LIMIT)
      : mockQuestions(bank);

  if (!questions.length) {
    throw new PracticeInputError("Test uchun savollar topilmadi.");
  }

  if (
    input.questionIds.length !== questions.length ||
    input.questionIds.some(
      (questionId, index) => questionId !== questions[index]?.id
    )
  ) {
    throw new PracticeInputError(
      "Savollar to'plami serverdagi joriy testga mos emas. Sahifani yangilang."
    );
  }

  const answerIds = input.answers.map((answer) => answer.questionId);
  if (
    answerIds.length !== questions.length ||
    new Set(answerIds).size !== answerIds.length ||
    answerIds.some((questionId) => !input.questionIds.includes(questionId))
  ) {
    throw new PracticeInputError("Har bir savol uchun bittadan javob yuboring.");
  }

  const submitted = new Map(
    input.answers.map((answer) => [answer.questionId, answer.selectedIndex])
  );
  for (const question of questions) {
    const selectedIndex = submitted.get(question.id);
    if (
      typeof selectedIndex !== "number" ||
      !Number.isInteger(selectedIndex) ||
      selectedIndex < 0 ||
      selectedIndex >= question.options.length
    ) {
      throw new PracticeInputError("Javob varianti noto'g'ri yuborildi.");
    }
  }

  return { questions, topic, submitted };
}
