import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  formatSupabaseError,
  getSupabaseAdmin,
  isSupabaseConnectionError,
} from "./supabase";
import { requireLocalDataFallback } from "./config";
import {
  QUESTIONS,
  SUBJECTS,
  TOPICS,
  publicQuestion,
} from "@/lib/practice/question-bank";
import {
  PracticeInputError,
  validateAttemptSubmission,
} from "@/lib/practice/attempt-validation";
import type {
  AttemptResult,
  AdminQuestionBank,
  PracticeCatalog,
  PracticeMode,
  PracticeProgress,
  QuestionDraft,
  Question,
  RecentAttempt,
  SubmittedAnswer,
  Subject,
  SubjectProgressItem,
  Topic,
} from "@/lib/practice/types";

interface AttemptRecord {
  id: string;
  userId: string;
  mode: PracticeMode;
  subjectId?: string;
  topicId?: string;
  score: number;
  total: number;
  correctCount: number;
  startedAt: string;
  completedAt: string;
  answers: {
    questionId: string;
    selectedIndex: number;
    correctIndex: number;
    isCorrect: boolean;
  }[];
}

interface PracticeAttemptRow {
  id: string;
  user_id: string;
  mode: PracticeMode;
  subject_id: string | null;
  topic_id: string | null;
  score: number;
  total: number;
  correct_count: number;
  started_at: string;
  completed_at: string;
}

interface PracticeAnswerRow {
  question_id: string;
  selected_index: number;
  correct_index: number;
  is_correct: boolean;
}

const DATA_DIR = path.join(process.cwd(), "data");
const ATTEMPTS_FILE = path.join(DATA_DIR, "practice-attempts.json");
const QUESTION_BANK_FILE = path.join(DATA_DIR, "question-bank.json");
const WEEKLY_TARGET = 5;

export { PracticeInputError };

function colorClass(color: Subject["color"]): string {
  const map: Record<Subject["color"], string> = {
    brand: "bg-brand-500",
    accent: "bg-accent-500",
    amber: "bg-amber-400",
    violet: "bg-violet-500",
    sky: "bg-sky-500",
  };
  return map[color];
}

function isMissingPracticeSchema(message: string): boolean {
  return (
    message.includes("practice_") ||
    message.includes("subjects") ||
    message.includes("topics") ||
    message.includes("questions")
  ) && message.toLowerCase().includes("does not exist");
}

async function ensureAttemptsFile(): Promise<void> {
  requireLocalDataFallback("Local practice attempts store");
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(ATTEMPTS_FILE);
  } catch {
    await fs.writeFile(ATTEMPTS_FILE, "[]", "utf8");
  }
}

async function readLocalAttempts(): Promise<AttemptRecord[]> {
  await ensureAttemptsFile();
  const raw = await fs.readFile(ATTEMPTS_FILE, "utf8");
  try {
    return JSON.parse(raw) as AttemptRecord[];
  } catch {
    return [];
  }
}

async function writeLocalAttempts(attempts: AttemptRecord[]): Promise<void> {
  await ensureAttemptsFile();
  await fs.writeFile(ATTEMPTS_FILE, JSON.stringify(attempts, null, 2), "utf8");
}

async function readLocalQuestions(): Promise<Question[]> {
  requireLocalDataFallback("Local question bank");
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(QUESTION_BANK_FILE, "utf8");
    const parsed = JSON.parse(raw) as Question[];
    return Array.isArray(parsed) && parsed.length ? parsed : QUESTIONS;
  } catch {
    return QUESTIONS;
  }
}

async function writeLocalQuestions(questions: Question[]): Promise<void> {
  requireLocalDataFallback("Local question bank");
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    QUESTION_BANK_FILE,
    JSON.stringify(questions, null, 2),
    "utf8"
  );
}

function topicName(topics: Topic[], topicId?: string): string | undefined {
  if (!topicId) return undefined;
  return topics.find((topic) => topic.id === topicId)?.name;
}

function subjectName(subjects: Subject[], subjectId?: string): string {
  if (!subjectId) return "Aralash test";
  return subjects.find((subject) => subject.id === subjectId)?.name ?? "Fan";
}

function dateKey(value: string): string {
  return new Date(value).toISOString().slice(0, 10);
}

function isSameWeek(value: string, now = new Date()): boolean {
  const date = new Date(value);
  const start = new Date(now);
  const day = start.getDay() || 7;
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - day + 1);
  return date >= start;
}

function calculateStreak(attempts: AttemptRecord[]): number {
  const days = new Set(attempts.map((attempt) => dateKey(attempt.completedAt)));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  let streak = 0;

  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function buildProgress(
  attempts: AttemptRecord[],
  subjects: Subject[],
  topics: Topic[]
): PracticeProgress {
  const today = new Date().toISOString().slice(0, 10);
  const totalQuestions = attempts.reduce((sum, attempt) => sum + attempt.total, 0);
  const correctQuestions = attempts.reduce(
    (sum, attempt) => sum + attempt.correctCount,
    0
  );
  const completedToday = attempts.filter(
    (attempt) => dateKey(attempt.completedAt) === today
  );
  const weeklyCompleted = attempts.filter((attempt) =>
    isSameWeek(attempt.completedAt)
  ).length;

  const subjectProgress: SubjectProgressItem[] = subjects.map((subject) => {
    const subjectAttempts = attempts.filter(
      (attempt) => attempt.subjectId === subject.id
    );
    const subjectTotal = subjectAttempts.reduce(
      (sum, attempt) => sum + attempt.total,
      0
    );
    const subjectCorrect = subjectAttempts.reduce(
      (sum, attempt) => sum + attempt.correctCount,
      0
    );
    return {
      subjectId: subject.id,
      name: subject.name,
      value: subjectTotal ? Math.round((subjectCorrect / subjectTotal) * 100) : 0,
      colorClass: colorClass(subject.color),
      attempts: subjectAttempts.length,
    };
  });

  const topicProgress = topics.map((topic) => {
    const topicAttempts = attempts.filter((attempt) => attempt.topicId === topic.id);
    const topicTotal = topicAttempts.reduce((sum, attempt) => sum + attempt.total, 0);
    const topicCorrect = topicAttempts.reduce(
      (sum, attempt) => sum + attempt.correctCount,
      0
    );
    const lastAttempt = topicAttempts
      .slice()
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )[0];
    return {
      ...topic,
      subjectName: subjectName(subjects, topic.subjectId),
      attempts: topicAttempts.length,
      accuracy: topicTotal ? Math.round((topicCorrect / topicTotal) * 100) : 0,
      lastScore: lastAttempt?.score,
    };
  });

  const recentAttempts: RecentAttempt[] = attempts
    .slice()
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .slice(0, 5)
    .map((attempt) => ({
      id: attempt.id,
      mode: attempt.mode,
      subjectName: subjectName(subjects, attempt.subjectId),
      topicName: topicName(topics, attempt.topicId),
      score: attempt.score,
      total: attempt.total,
      correctCount: attempt.correctCount,
      completedAt: attempt.completedAt,
    }));

  return {
    totalAttempts: attempts.length,
    totalQuestions,
    correctQuestions,
    averageScore: totalQuestions
      ? Math.round((correctQuestions / totalQuestions) * 100)
      : 0,
    bestScore: attempts.length
      ? Math.max(...attempts.map((attempt) => attempt.score))
      : 0,
    completedToday: completedToday.length,
    questionsToday: completedToday.reduce((sum, attempt) => sum + attempt.total, 0),
    streakDays: calculateStreak(attempts),
    weeklyCompleted,
    weeklyTarget: WEEKLY_TARGET,
    subjectProgress,
    topicProgress,
    recentAttempts,
  };
}

function normalizeAttempt(row: PracticeAttemptRow, answers: PracticeAnswerRow[]) {
  return {
    id: row.id,
    userId: row.user_id,
    mode: row.mode,
    subjectId: row.subject_id ?? undefined,
    topicId: row.topic_id ?? undefined,
    score: row.score,
    total: row.total,
    correctCount: row.correct_count,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    answers: answers.map((answer) => ({
      questionId: answer.question_id,
      selectedIndex: answer.selected_index,
      correctIndex: answer.correct_index,
      isCorrect: answer.is_correct,
    })),
  } satisfies AttemptRecord;
}

async function getSupabaseBank(): Promise<AdminQuestionBank | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const [subjectsResult, topicsResult, questionsResult] = await Promise.all([
    supabase.from("subjects").select("*").order("position"),
    supabase.from("topics").select("*").order("position"),
    supabase.from("questions").select("*").order("position"),
  ]);

  const error =
    subjectsResult.error ?? topicsResult.error ?? questionsResult.error ?? null;
  if (error) {
    if (
      isMissingPracticeSchema(error.message) ||
      isSupabaseConnectionError(error.message)
    ) {
      return null;
    }
    throw formatSupabaseError("practice bank", error.message);
  }

  const subjects = (subjectsResult.data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    color: row.color,
    examWeight: row.exam_weight,
    position: row.position,
  })) as Subject[];

  const topics = (topicsResult.data ?? []).map((row) => ({
    id: row.id,
    subjectId: row.subject_id,
    name: row.name,
    description: row.description,
    level: row.level,
    estimatedMinutes: row.estimated_minutes,
    position: row.position,
  })) as Topic[];

  const questions = (questionsResult.data ?? []).map((row) => ({
    id: row.id,
    subjectId: row.subject_id,
    topicId: row.topic_id,
    prompt: row.prompt,
    options: row.options,
    correctIndex: row.correct_index,
    explanation: row.explanation,
    difficulty: row.difficulty,
  })) as Question[];

  return subjects.length && topics.length && questions.length
    ? { subjects, topics, questions }
    : null;
}

async function getBank() {
  return (
    (await getSupabaseBank()) ?? {
      subjects: SUBJECTS,
      topics: TOPICS,
      questions: await readLocalQuestions(),
    }
  );
}

function cleanQuestionDraft(
  input: QuestionDraft,
  bank: AdminQuestionBank
): Question {
  const topic = bank.topics.find((item) => item.id === input.topicId);
  const subject = bank.subjects.find((item) => item.id === input.subjectId);
  if (!topic || !subject || topic.subjectId !== subject.id) {
    throw new Error("Fan yoki mavzu noto'g'ri tanlangan.");
  }

  const options = input.options.map((option) => option.trim()).filter(Boolean);
  if (!input.prompt.trim()) {
    throw new Error("Savol matnini kiriting.");
  }
  if (options.length < 2) {
    throw new Error("Kamida 2 ta javob varianti kerak.");
  }
  if (input.correctIndex < 0 || input.correctIndex >= options.length) {
    throw new Error("To'g'ri javob varianti noto'g'ri.");
  }

  return {
    id: input.id?.trim() || `q-${input.topicId}-${randomUUID().slice(0, 8)}`,
    subjectId: subject.id,
    topicId: topic.id,
    prompt: input.prompt.trim(),
    options,
    correctIndex: input.correctIndex,
    explanation: input.explanation.trim(),
    difficulty: input.difficulty,
  };
}

async function upsertLocalQuestion(question: Question): Promise<Question> {
  const questions = await readLocalQuestions();
  const index = questions.findIndex((item) => item.id === question.id);
  if (index === -1) {
    questions.push(question);
  } else {
    questions[index] = question;
  }
  await writeLocalQuestions(questions);
  return question;
}

async function deleteLocalQuestion(questionId: string): Promise<void> {
  const questions = await readLocalQuestions();
  await writeLocalQuestions(questions.filter((question) => question.id !== questionId));
}

async function getAttempts(userId: string): Promise<AttemptRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const attempts = await readLocalAttempts();
    return attempts.filter((attempt) => attempt.userId === userId);
  }

  const attemptsResult = await supabase
    .from("practice_attempts")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (attemptsResult.error) {
    if (
      isMissingPracticeSchema(attemptsResult.error.message) ||
      isSupabaseConnectionError(attemptsResult.error.message)
    ) {
      const attempts = await readLocalAttempts();
      return attempts.filter((attempt) => attempt.userId === userId);
    }
    throw formatSupabaseError("practice attempts", attemptsResult.error.message);
  }

  const attempts = (attemptsResult.data ?? []) as PracticeAttemptRow[];
  if (!attempts.length) return [];

  const ids = attempts.map((attempt) => attempt.id);
  const answersResult = await supabase
    .from("practice_attempt_answers")
    .select("attempt_id, question_id, selected_index, correct_index, is_correct")
    .in("attempt_id", ids);

  if (answersResult.error) {
    if (
      isMissingPracticeSchema(answersResult.error.message) ||
      isSupabaseConnectionError(answersResult.error.message)
    ) {
      return [];
    }
    throw formatSupabaseError("practice answers", answersResult.error.message);
  }

  const answersByAttempt = new Map<string, PracticeAnswerRow[]>();
  for (const answer of answersResult.data ?? []) {
    const attemptId = answer.attempt_id as string;
    const list = answersByAttempt.get(attemptId) ?? [];
    list.push(answer as PracticeAnswerRow);
    answersByAttempt.set(attemptId, list);
  }

  return attempts.map((attempt) =>
    normalizeAttempt(attempt, answersByAttempt.get(attempt.id) ?? [])
  );
}

async function saveAttempt(attempt: AttemptRecord): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const attempts = await readLocalAttempts();
    attempts.push(attempt);
    await writeLocalAttempts(attempts);
    return;
  }

  const { error: attemptError } = await supabase.from("practice_attempts").insert({
    id: attempt.id,
    user_id: attempt.userId,
    mode: attempt.mode,
    subject_id: attempt.subjectId ?? null,
    topic_id: attempt.topicId ?? null,
    score: attempt.score,
    total: attempt.total,
    correct_count: attempt.correctCount,
    started_at: attempt.startedAt,
    completed_at: attempt.completedAt,
  });

  if (attemptError) {
    if (
      isMissingPracticeSchema(attemptError.message) ||
      isSupabaseConnectionError(attemptError.message)
    ) {
      const attempts = await readLocalAttempts();
      attempts.push(attempt);
      await writeLocalAttempts(attempts);
      return;
    }
    throw formatSupabaseError("save practice attempt", attemptError.message);
  }

  const rows = attempt.answers.map((answer, index) => ({
    id: randomUUID(),
    attempt_id: attempt.id,
    question_id: answer.questionId,
    selected_index: answer.selectedIndex,
    correct_index: answer.correctIndex,
    is_correct: answer.isCorrect,
    position: index + 1,
  }));

  const { error: answerError } = await supabase
    .from("practice_attempt_answers")
    .insert(rows);

  if (answerError) {
    // The two PostgREST inserts are not automatically transactional. Remove
    // the parent attempt before falling back or surfacing the error so a
    // partially saved attempt cannot corrupt progress totals.
    await supabase.from("practice_attempts").delete().eq("id", attempt.id);

    if (
      isMissingPracticeSchema(answerError.message) ||
      isSupabaseConnectionError(answerError.message)
    ) {
      const attempts = await readLocalAttempts();
      attempts.push(attempt);
      await writeLocalAttempts(attempts);
      return;
    }
    throw formatSupabaseError("save practice answers", answerError.message);
  }
}

export const practiceStore = {
  async getAdminBank(): Promise<AdminQuestionBank> {
    return getBank();
  },

  async upsertQuestion(input: QuestionDraft): Promise<Question> {
    const bank = await getBank();
    const question = cleanQuestionDraft(input, bank);
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { error } = await supabase.from("questions").upsert({
        id: question.id,
        subject_id: question.subjectId,
        topic_id: question.topicId,
        prompt: question.prompt,
        options: question.options,
        correct_index: question.correctIndex,
        explanation: question.explanation,
        difficulty: question.difficulty,
        position: 999,
      });

      if (error) {
        if (
          !isMissingPracticeSchema(error.message) &&
          !isSupabaseConnectionError(error.message)
        ) {
          throw formatSupabaseError("upsert question", error.message);
        }
      } else {
        return question;
      }
    }

    return upsertLocalQuestion(question);
  },

  async deleteQuestion(questionId: string): Promise<void> {
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { error } = await supabase
        .from("questions")
        .delete()
        .eq("id", questionId);

      if (error) {
        if (
          !isMissingPracticeSchema(error.message) &&
          !isSupabaseConnectionError(error.message)
        ) {
          throw formatSupabaseError("delete question", error.message);
        }
      } else {
        return;
      }
    }

    await deleteLocalQuestion(questionId);
  },

  async getCatalog(userId: string): Promise<PracticeCatalog> {
    const [bank, attempts] = await Promise.all([getBank(), getAttempts(userId)]);
    const progress = buildProgress(attempts, bank.subjects, bank.topics);

    return {
      subjects: bank.subjects,
      topics: progress.topicProgress,
      progress,
    };
  },

  async getProgress(userId: string): Promise<PracticeProgress> {
    const [bank, attempts] = await Promise.all([getBank(), getAttempts(userId)]);
    return buildProgress(attempts, bank.subjects, bank.topics);
  },

  async getQuestionsForTopic(topicId: string, limit = 5) {
    const bank = await getBank();
    return bank.questions
      .filter((question) => question.topicId === topicId)
      .slice(0, limit)
      .map(publicQuestion);
  },

  async getQuestionsByTopic(limit = 5) {
    const bank = await getBank();
    return Object.fromEntries(
      bank.topics.map((topic) => [
        topic.id,
        bank.questions
          .filter((question) => question.topicId === topic.id)
          .slice(0, limit)
          .map(publicQuestion),
      ])
    );
  },

  async getMockTestQuestions(limit = 10) {
    const bank = await getBank();
    const ordered = bank.questions
      .slice()
      .sort((a, b) => {
        if (a.subjectId === b.subjectId) return a.id.localeCompare(b.id);
        return a.subjectId.localeCompare(b.subjectId);
      });
    return ordered.slice(0, limit).map(publicQuestion);
  },

  async recordAttempt(input: {
    userId: string;
    mode: PracticeMode;
    topicId?: string;
    questionIds: string[];
    answers: SubmittedAnswer[];
    startedAt?: string;
  }): Promise<AttemptResult> {
    const bank = await getBank();
    const { questions, topic, submitted } = validateAttemptSubmission(bank, input);

    const subjectId =
      input.mode === "mock_test" ? undefined : topic?.subjectId;
    const completedAt = new Date().toISOString();
    const answers = questions.map((question) => {
      const selectedIndex = submitted.get(question.id);
      const safeSelected = selectedIndex as number;
      return {
        questionId: question.id,
        selectedIndex: safeSelected,
        correctIndex: question.correctIndex,
        isCorrect: safeSelected === question.correctIndex,
        explanation: question.explanation,
      };
    });
    const correctCount = answers.filter((answer) => answer.isCorrect).length;
    const total = questions.length;
    const score = Math.round((correctCount / total) * 100);

    const attempt: AttemptRecord = {
      id: randomUUID(),
      userId: input.userId,
      mode: input.mode,
      subjectId,
      topicId: input.mode === "practice" ? input.topicId : undefined,
      score,
      total,
      correctCount,
      startedAt: input.startedAt ?? completedAt,
      completedAt,
      answers: answers.map((answer) => ({
        questionId: answer.questionId,
        selectedIndex: answer.selectedIndex,
        correctIndex: answer.correctIndex,
        isCorrect: answer.isCorrect,
      })),
    };

    await saveAttempt(attempt);

    return {
      attemptId: attempt.id,
      mode: attempt.mode,
      subjectId: attempt.subjectId,
      topicId: attempt.topicId,
      score,
      total,
      correctCount,
      completedAt,
      answers,
    };
  },
};
