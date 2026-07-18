import type {
  AdminQuestionBank,
  PracticeMode,
  Question,
  SubmittedAnswer,
  Topic,
} from "./types";

const PRACTICE_QUESTION_LIMIT = 5;
const MOCK_QUESTION_LIMIT = 45;

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
  submitted: Map<string, SubmittedAnswer>;
}

function mockQuestions(bank: AdminQuestionBank): Question[] {
  return bank.questions
    .filter((question) => question.reviewStatus === "published")
    .slice()
    .sort((a, b) => a.position - b.position)
    .slice(0, MOCK_QUESTION_LIMIT);
}

function normalizeShortAnswer(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("uz")
    .replaceAll("−", "-")
    .replaceAll("·", "*")
    .replace(/\s+/g, " ");
}

export function isAcceptedShortAnswer(
  submitted: string,
  acceptedAnswers: string[]
): boolean {
  const normalized = normalizeShortAnswer(submitted);
  return acceptedAnswers.some(
    (answer) => normalizeShortAnswer(answer) === normalized
  );
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
    input.answers.map((answer) => [answer.questionId, answer])
  );
  for (const question of questions) {
    const answer = submitted.get(question.id);
    if (!answer) {
      throw new PracticeInputError("Har bir savol uchun javob yuboring.");
    }

    if (question.type === "short_answer") {
      if (
        !Array.isArray(answer.textAnswers) ||
        answer.textAnswers.length !== question.parts?.length ||
        answer.textAnswers.some((value) => typeof value !== "string") ||
        (input.mode === "practice" &&
          answer.textAnswers.some((value) => !value.trim()))
      ) {
        throw new PracticeInputError(
          "Ochiq savolning har bir bandiga javob kiriting."
        );
      }
      continue;
    }

    if (
      typeof answer.selectedIndex !== "number" ||
      !Number.isInteger(answer.selectedIndex) ||
      answer.selectedIndex < (input.mode === "mock_test" ? -1 : 0) ||
      answer.selectedIndex >= question.options.length
    ) {
      throw new PracticeInputError("Javob varianti noto'g'ri yuborildi.");
    }
  }

  return { questions, topic, submitted };
}
