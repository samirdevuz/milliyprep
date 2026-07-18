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
  isAcceptedShortAnswer,
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
  rawScore: number;
  maxScore: number;
  total: number;
  correctCount: number;
  startedAt: string;
  completedAt: string;
  answers: {
    questionId: string;
    selectedIndex?: number;
    textAnswers?: string[];
    correctIndex?: number;
    isCorrect: boolean;
    earnedPoints: number;
    maxPoints: number;
    partResults?: AttemptResult["answers"][number]["partResults"];
  }[];
}

interface PracticeAttemptRow {
  id: string;
  user_id: string;
  mode: PracticeMode;
  subject_id: string | null;
  topic_id: string | null;
  score: number;
  raw_score?: number | null;
  max_score?: number | null;
  total: number;
  correct_count: number;
  started_at: string;
  completed_at: string;
}

interface PracticeAnswerRow {
  question_id: string;
  selected_index: number | null;
  text_answers?: string[] | null;
  correct_index: number | null;
  is_correct: boolean;
  earned_points?: number | null;
  max_points?: number | null;
  part_results?: AttemptResult["answers"][number]["partResults"] | null;
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

async function readLocalQuestions(includeUnpublished = false): Promise<Question[]> {
  requireLocalDataFallback("Local question bank");
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(QUESTION_BANK_FILE, "utf8");
    const parsed = JSON.parse(raw) as Question[];
    const topicIds = new Set(TOPICS.map((topic) => topic.id));
    const subjectIds = new Set(SUBJECTS.map((subject) => subject.id));
    const active = Array.isArray(parsed)
      ? parsed.filter(
          (question) =>
            topicIds.has(question.topicId) &&
            subjectIds.has(question.subjectId) &&
            question.reviewStatus !== "archived"
        )
      : [];
    const questions = active.length ? active : QUESTIONS;
    return includeUnpublished
      ? questions
      : questions.filter((question) => question.reviewStatus === "published");
  } catch {
    return includeUnpublished
      ? QUESTIONS
      : QUESTIONS.filter((question) => question.reviewStatus === "published");
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
    rawScore: Number(row.raw_score ?? row.score),
    maxScore: Number(row.max_score ?? 100),
    total: row.total,
    correctCount: row.correct_count,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    answers: answers.map((answer) => ({
      questionId: answer.question_id,
      selectedIndex: answer.selected_index ?? undefined,
      textAnswers: answer.text_answers ?? undefined,
      correctIndex: answer.correct_index ?? undefined,
      isCorrect: answer.is_correct,
      earnedPoints: Number(answer.earned_points ?? (answer.is_correct ? 1 : 0)),
      maxPoints: Number(answer.max_points ?? 1),
      partResults: answer.part_results ?? undefined,
    })),
  } satisfies AttemptRecord;
}

async function getSupabaseBank(
  includeUnpublished = false
): Promise<AdminQuestionBank | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const subjectsQuery = supabase
    .from("subjects")
    .select("*")
    .eq("status", "published")
    .order("position");
  const topicsQuery = supabase
    .from("topics")
    .select("*")
    .eq("status", "published")
    .order("position");
  const questionsQuery = supabase.from("questions").select("*").order("position");
  const [subjectsResult, topicsResult, questionsResult] = await Promise.all([
    subjectsQuery,
    topicsQuery,
    includeUnpublished
      ? questionsQuery.eq("subject_id", "math").neq("status", "archived")
      : questionsQuery.eq("status", "published"),
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
    examShare: row.exam_share ?? undefined,
    sourceId: row.source_id ?? undefined,
    position: row.position,
  })) as Topic[];

  const questions = (questionsResult.data ?? []).map((row) => ({
    id: row.id,
    subjectId: row.subject_id,
    topicId: row.topic_id,
    prompt: row.prompt,
    options: row.options,
    type: row.question_type ?? "single_choice",
    position: row.blueprint_position ?? row.position,
    points: Number(row.points ?? 1),
    context: row.context ?? undefined,
    groupId: row.group_id ?? undefined,
    correctIndex: row.correct_index,
    explanation: row.explanation,
    difficulty: row.difficulty,
    sourceId: row.source_id ?? undefined,
    origin: row.origin ?? undefined,
    reviewStatus: row.status ?? "draft",
    reviewNote: row.review_note ?? undefined,
    contentVersion: row.content_version ?? undefined,
    parts: row.parts ?? undefined,
  })) as Question[];

  return subjects.length && topics.length && questions.length
    ? { subjects, topics, questions }
    : null;
}

async function getBank() {
  return (
    (await getSupabaseBank(false)) ?? {
      subjects: SUBJECTS,
      topics: TOPICS,
      questions: await readLocalQuestions(),
    }
  );
}

async function getAdminBankData() {
  return (
    (await getSupabaseBank(true)) ?? {
      subjects: SUBJECTS,
      topics: TOPICS,
      questions: await readLocalQuestions(true),
    }
  );
}

function cleanQuestionDraft(
  input: QuestionDraft,
  bank: AdminQuestionBank
): Question {
  const current = input.id
    ? bank.questions.find((question) => question.id === input.id)
    : undefined;
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
    type: current?.type ?? "single_choice",
    position:
      current?.position ??
      Math.max(0, ...bank.questions.map((question) => question.position)) + 1,
    points: current?.points ?? 2.2,
    context: current?.context,
    groupId: current?.groupId,
    correctIndex: input.correctIndex,
    explanation: input.explanation.trim(),
    difficulty: input.difficulty,
    sourceId: "uzbmb-math-spec-2024",
    origin: "original",
    reviewStatus: input.reviewStatus ?? "draft",
    reviewNote: input.reviewNote?.trim() || undefined,
    contentVersion: current?.contentVersion ?? "2026.07.2",
    parts: current?.parts,
  };
}

async function upsertLocalQuestion(question: Question): Promise<Question> {
  const questions = await readLocalQuestions(true);
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
  const questions = await readLocalQuestions(true);
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
    .select("attempt_id, question_id, selected_index, text_answers, correct_index, is_correct, earned_points, max_points, part_results")
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
    raw_score: attempt.rawScore,
    max_score: attempt.maxScore,
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
    selected_index: answer.selectedIndex ?? null,
    text_answers: answer.textAnswers ?? null,
    correct_index: answer.correctIndex ?? null,
    is_correct: answer.isCorrect,
    earned_points: answer.earnedPoints,
    max_points: answer.maxPoints,
    part_results: answer.partResults ?? null,
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
    return getAdminBankData();
  },

  async upsertQuestion(input: QuestionDraft): Promise<Question> {
    const bank = await getAdminBankData();
    const question = cleanQuestionDraft(input, bank);
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { error } = await supabase.from("questions").upsert({
        id: question.id,
        subject_id: question.subjectId,
        topic_id: question.topicId,
        prompt: question.prompt,
        options: question.options,
        question_type: question.type,
        blueprint_position:
          question.position >= 1 && question.position <= 45
            ? question.position
            : null,
        points: question.points,
        context: question.context ?? null,
        group_id: question.groupId ?? null,
        correct_index: question.correctIndex,
        explanation: question.explanation,
        difficulty: question.difficulty,
        source_id: question.sourceId ?? null,
        origin: question.origin ?? "original",
        status: question.reviewStatus ?? "published",
        review_note: question.reviewNote ?? null,
        content_version: question.contentVersion ?? null,
        parts: question.parts ?? null,
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

  async reviewQuestion(input: {
    questionId: string;
    status: "draft" | "review" | "published" | "archived";
    reviewNote?: string;
    reviewerId: string;
  }): Promise<Question> {
    const bank = await getAdminBankData();
    const existing = bank.questions.find(
      (question) => question.id === input.questionId
    );
    if (!existing) throw new Error("Savol topilmadi.");
    if (
      input.status === "published" &&
      (existing.position < 1 || existing.position > 45)
    ) {
      throw new Error(
        "Savolni nashr qilish uchun 1–45 oralig‘idagi blueprint pozitsiyasi kerak."
      );
    }

    const question: Question = {
      ...existing,
      reviewStatus: input.status,
      reviewNote: input.reviewNote?.trim() || undefined,
    };
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase
        .from("questions")
        .update({
          status: input.status,
          review_note: question.reviewNote ?? null,
          reviewed_by:
            input.status === "published" || input.status === "archived"
              ? input.reviewerId
              : null,
          reviewed_at:
            input.status === "published" || input.status === "archived"
              ? new Date().toISOString()
              : null,
        })
        .eq("id", input.questionId);
      if (error) {
        if (
          !isMissingPracticeSchema(error.message) &&
          !isSupabaseConnectionError(error.message)
        ) {
          throw formatSupabaseError("review question", error.message);
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
    const topics = progress.topicProgress.map((topic) => ({
      ...topic,
      questionCount: bank.questions.filter(
        (question) => question.topicId === topic.id
      ).length,
    }));

    return {
      subjects: bank.subjects,
      topics,
      progress: { ...progress, topicProgress: topics },
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

  async getMockTestQuestions(limit = 45) {
    const bank = await getBank();
    const ordered = bank.questions
      .slice()
      .sort((a, b) => a.position - b.position);
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
      input.mode === "mock_test" ? questions[0]?.subjectId : topic?.subjectId;
    const completedAt = new Date().toISOString();
    const answers = questions.map((question) => {
      const submission = submitted.get(question.id);
      if (question.type === "short_answer") {
        const textAnswers = submission?.textAnswers ?? [];
        const partResults = (question.parts ?? []).map((part, partIndex) => {
          const submittedText = textAnswers[partIndex] ?? "";
          const isCorrect = isAcceptedShortAnswer(
            submittedText,
            part.acceptedAnswers
          );
          return {
            id: part.id,
            submitted: submittedText,
            correctAnswer: part.correctAnswer,
            isCorrect,
            earnedPoints: isCorrect ? part.points : 0,
            maxPoints: part.points,
            explanation: part.explanation,
          };
        });
        const earnedPoints = partResults.reduce(
          (sum, part) => sum + part.earnedPoints,
          0
        );
        return {
          questionId: question.id,
          textAnswers,
          isCorrect: partResults.every((part) => part.isCorrect),
          explanation: question.explanation,
          earnedPoints,
          maxPoints: question.points,
          partResults,
        };
      }

      const selectedIndex = submission?.selectedIndex as number;
      const isCorrect = selectedIndex === question.correctIndex;
      return {
        questionId: question.id,
        selectedIndex,
        correctIndex: question.correctIndex,
        isCorrect,
        explanation: question.explanation,
        earnedPoints: isCorrect ? question.points : 0,
        maxPoints: question.points,
      };
    });
    const correctCount = answers.filter((answer) => answer.isCorrect).length;
    const total = questions.length;
    const rawScore = Number(
      answers
        .reduce((sum, answer) => sum + answer.earnedPoints, 0)
        .toFixed(1)
    );
    const maxScore = Number(
      answers.reduce((sum, answer) => sum + answer.maxPoints, 0).toFixed(1)
    );
    const score = Math.round((rawScore / maxScore) * 100);

    const attempt: AttemptRecord = {
      id: randomUUID(),
      userId: input.userId,
      mode: input.mode,
      subjectId,
      topicId: input.mode === "practice" ? input.topicId : undefined,
      score,
      rawScore,
      maxScore,
      total,
      correctCount,
      startedAt: input.startedAt ?? completedAt,
      completedAt,
      answers: answers.map((answer) => ({
        questionId: answer.questionId,
        selectedIndex: answer.selectedIndex,
        textAnswers: answer.textAnswers,
        correctIndex: answer.correctIndex,
        isCorrect: answer.isCorrect,
        earnedPoints: answer.earnedPoints,
        maxPoints: answer.maxPoints,
        partResults: answer.partResults,
      })),
    };

    await saveAttempt(attempt);

    return {
      attemptId: attempt.id,
      mode: attempt.mode,
      subjectId: attempt.subjectId,
      topicId: attempt.topicId,
      score,
      rawScore,
      maxScore,
      total,
      correctCount,
      completedAt,
      answers,
    };
  },
};
