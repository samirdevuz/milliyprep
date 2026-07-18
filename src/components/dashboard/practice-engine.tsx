"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock3,
  RotateCcw,
  Send,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconChip } from "@/components/ui/icon-chip";
import { cn } from "@/lib/cn";
import type {
  AttemptResult,
  PracticeCatalog,
  PracticeMode,
  PublicQuestion,
} from "@/lib/practice/types";

interface PracticeEngineProps {
  mode: PracticeMode;
  catalog: PracticeCatalog;
  questionsByTopic?: Record<string, PublicQuestion[]>;
  mockQuestions?: PublicQuestion[];
  initialTopicId?: string;
  mockReadiness?: number;
}

interface AnswerValue {
  selectedIndex?: number;
  textAnswers?: string[];
}

type Answers = Record<string, AnswerValue>;

const FULL_MOCK_QUESTION_COUNT = 45;
const FULL_MOCK_SECONDS = 150 * 60;

function modeCopy(mode: PracticeMode) {
  if (mode === "mock_test") {
    return {
      title: "Matematika to‘liq sinovi",
      eyebrow: "45 topshiriq · 150 daqiqa",
      description:
        "Y-1, Y-2 va ikki qismli ochiq savollar rasmiy blueprint tartibida keladi.",
      icon: ClipboardList,
      tone: "violet" as const,
      button: "Testni yakunlash",
    };
  }

  return {
    title: "Mavzu bo'yicha mashq",
    eyebrow: "Matematika · Milliy Sertifikat",
    description:
      "Spetsifikatsiyadagi ko'nikmani tanlang, savollarni yeching va izohli natijani ko'ring.",
    icon: BookOpen,
    tone: "brand" as const,
    button: "Mashg'ulotni tekshirish",
  };
}

function topicTone(score: number) {
  if (score >= 75) return "text-accent-700 bg-accent-50 ring-accent-100";
  if (score >= 40) return "text-amber-700 bg-amber-50 ring-amber-100";
  return "text-ink-600 bg-ink-50 ring-ink-100";
}

function formatScore(result: AttemptResult | null) {
  if (!result) return "0/0";
  return `${result.correctCount}/${result.total}`;
}

export function PracticeEngine({
  mode,
  catalog,
  questionsByTopic = {},
  mockQuestions = [],
  initialTopicId,
  mockReadiness = mockQuestions.length,
}: PracticeEngineProps) {
  const copy = modeCopy(mode);
  const Icon = copy.icon;
  const firstTopic = initialTopicId ?? catalog.topics[0]?.id ?? "";
  const [activeTopic, setActiveTopic] = useState(firstTopic);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(FULL_MOCK_SECONDS);

  const questions = useMemo(() => {
    if (mode === "mock_test") return mockQuestions;
    return questionsByTopic[activeTopic] ?? [];
  }, [activeTopic, mockQuestions, mode, questionsByTopic]);

  const activeQuestion = questions[index];
  const answeredCount = questions.filter((question) => {
    const answer = answers[question.id];
    if (question.type === "short_answer") {
      return Boolean(
        question.parts?.length &&
          answer?.textAnswers?.length === question.parts.length &&
          answer.textAnswers.every((value) => value.trim())
      );
    }
    return Number.isInteger(answer?.selectedIndex);
  }).length;
  const allAnswered = questions.length > 0 && answeredCount === questions.length;
  const mockReady =
    mode !== "mock_test" || mockReadiness === FULL_MOCK_QUESTION_COUNT;
  const canSubmit =
    questions.length > 0 && (mode === "mock_test" || allAnswered);
  const resultByQuestion = useMemo(
    () =>
      new Map(
        (result?.answers ?? []).map((answer) => [answer.questionId, answer])
      ),
    [result]
  );

  const resetRun = (topicId = activeTopic) => {
    setActiveTopic(topicId);
    setIndex(0);
    setAnswers({});
    setStartedAt(new Date().toISOString());
    setSubmitting(false);
    setError("");
    setResult(null);
    setSecondsLeft(FULL_MOCK_SECONDS);
  };

  useEffect(() => {
    if (mode !== "mock_test" || result || !mockReady) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [mockReady, mode, result]);

  const submit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/practice/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          topicId: mode === "practice" ? activeTopic : undefined,
          questionIds: questions.map((question) => question.id),
          answers: questions.map((question) =>
            question.type === "short_answer"
              ? {
                  questionId: question.id,
                  textAnswers:
                    answers[question.id]?.textAnswers ??
                    question.parts?.map(() => "") ??
                    [],
                }
              : {
                  questionId: question.id,
                  selectedIndex:
                    answers[question.id]?.selectedIndex ?? -1,
                }
          ),
          startedAt,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Natija saqlanmadi.");
      }
      setResult(payload as AttemptResult);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Natijani saqlashda muammo bo'ldi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <IconChip tone={copy.tone} size="lg">
              <Icon strokeWidth={2.2} />
            </IconChip>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                {copy.eyebrow}
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-ink-900">
                {copy.title}
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-600">
                {copy.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50 px-4 py-3 text-sm">
            <ShieldCheck className="h-5 w-5 text-accent-600" />
            <div>
              <p className="font-semibold text-ink-800">
                UZBMB spetsifikatsiyasiga mos
              </p>
              <p className="text-xs text-ink-500">
                {mode === "mock_test"
                  ? `${mockReadiness}/45 topshiriq ekspert tasdiqlagan`
                  : `Original bank · ${questions.length} ta savol`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {mode === "practice" && (
        <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-100">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Mavzular
            </p>
            <span className="text-xs text-ink-500">
              {catalog.topics.length} ta mavzu
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {catalog.topics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => resetRun(topic.id)}
                className={cn(
                  "rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft",
                  activeTopic === topic.id
                    ? "border-brand-400 bg-brand-50/50 ring-2 ring-brand-100"
                    : "border-ink-100 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-ink-900">{topic.name}</p>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {topic.questionCount ?? 0} savol · {topic.estimatedMinutes} min
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs font-bold ring-1",
                      topicTone(topic.accuracy)
                    )}
                  >
                    {topic.attempts ? `${topic.accuracy}%` : "Yangi"}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-ink-600">
                  {topic.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === "mock_test" && !mockReady && (
        <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-ink-100">
          <div className="flex items-start gap-4">
            <IconChip tone="amber" size="lg">
              <ShieldCheck strokeWidth={2.2} />
            </IconChip>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Ekspert tekshiruvi davom etmoqda
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-ink-900">
                To‘liq sinov hali nashrga tayyor emas
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-600">
                {mockReadiness} ta topshiriq tasdiqlangan. 45 ta topshiriqning
                barchasi tekshirilgach, 150 daqiqalik sinov shu sahifada ochiladi.
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-100">
                <span
                  className="block h-full rounded-full bg-brand-500"
                  style={{
                    width: `${Math.round(
                      (mockReadiness / FULL_MOCK_QUESTION_COUNT) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {mockReady && (
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
          {activeQuestion ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-600">
                  Savol {index + 1}/{questions.length}
                </span>
                <span className="text-xs font-medium text-ink-500">
                  {activeQuestion.type === "matching"
                    ? "Y-2 · Moslashtirish"
                    : activeQuestion.type === "short_answer"
                      ? "O · Ochiq savol"
                      : activeQuestion.difficulty === "easy"
                    ? "Oson"
                    : activeQuestion.difficulty === "medium"
                      ? "O'rta"
                      : "Qiyin"}
                </span>
              </div>

              {activeQuestion.context && (
                <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50 p-4 text-sm leading-6 text-ink-700">
                  {activeQuestion.context}
                </div>
              )}

              <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-ink-500">
                <ShieldCheck className="h-3.5 w-3.5 text-accent-600" />
                UZBMB 2024 spetsifikatsiyasiga mos original savol
              </p>

              <h2 className="mt-5 text-xl font-extrabold leading-8 text-ink-900">
                {activeQuestion.prompt}
              </h2>

              {activeQuestion.type === "short_answer" ? (
                <div className="mt-5 space-y-4">
                  {activeQuestion.parts?.map((part, partIndex) => {
                    const partResult = resultByQuestion
                      .get(activeQuestion.id)
                      ?.partResults?.find((item) => item.id === part.id);
                    return (
                      <label key={part.id} className="block rounded-xl border border-ink-100 p-4">
                        <span className="text-sm font-bold text-ink-900">
                          {part.id}) {part.prompt}
                        </span>
                        <input
                          value={
                            answers[activeQuestion.id]?.textAnswers?.[
                              partIndex
                            ] ?? ""
                          }
                          disabled={Boolean(result)}
                          onChange={(event) =>
                            setAnswers((current) => {
                              const next = [
                                ...(current[activeQuestion.id]?.textAnswers ??
                                  activeQuestion.parts?.map(() => "") ??
                                  []),
                              ];
                              next[partIndex] = event.target.value;
                              return {
                                ...current,
                                [activeQuestion.id]: { textAnswers: next },
                              };
                            })
                          }
                          className="mt-3 block w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:bg-ink-50"
                          placeholder="Qisqa javobni kiriting"
                        />
                        {partResult && (
                          <p
                            className={cn(
                              "mt-3 text-sm font-medium",
                              partResult.isCorrect
                                ? "text-accent-700"
                                : "text-rose-700"
                            )}
                          >
                            To‘g‘ri javob: {partResult.correctAnswer} · {partResult.explanation}
                          </p>
                        )}
                      </label>
                    );
                  })}
                </div>
              ) : (
              <div className="mt-5 space-y-3">
                      {activeQuestion.options.map((option, optionIndex) => {
                  const checked =
                    answers[activeQuestion.id]?.selectedIndex === optionIndex;
                  const answerResult = resultByQuestion.get(activeQuestion.id);
                  const showCorrect =
                    result && answerResult?.correctIndex === optionIndex;
                  const showWrong =
                    result && checked && answerResult?.correctIndex !== optionIndex;

                  return (
                    <button
                      key={`${activeQuestion.id}-${optionIndex}`}
                      type="button"
                      disabled={Boolean(result)}
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [activeQuestion.id]: { selectedIndex: optionIndex },
                        }))
                      }
                      className={cn(
                        "flex min-h-14 w-full items-center gap-3 rounded-xl border p-3 text-left transition",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                        checked
                          ? "border-brand-400 bg-brand-50 text-brand-900"
                          : "border-ink-200 bg-white text-ink-800 hover:bg-ink-50",
                        showCorrect &&
                          "border-accent-400 bg-accent-50 text-accent-900",
                        showWrong && "border-rose-300 bg-rose-50 text-rose-900"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold",
                          checked
                            ? "border-brand-300 bg-white text-brand-700"
                            : "border-ink-200 bg-ink-50 text-ink-500",
                          showCorrect &&
                            "border-accent-300 bg-white text-accent-700",
                          showWrong && "border-rose-300 bg-white text-rose-700"
                        )}
                      >
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span className="text-sm font-medium">{option}</span>
                      {showCorrect && (
                        <CheckCircle2 className="ml-auto h-5 w-5 text-accent-600" />
                      )}
                      {showWrong && (
                        <XCircle className="ml-auto h-5 w-5 text-rose-600" />
                      )}
                    </button>
                  );
                })}
              </div>
              )}

              {result && (
                <div className="mt-5 rounded-xl bg-ink-50 p-4 ring-1 ring-ink-100">
                  <p className="text-sm font-bold text-ink-900">Izoh</p>
                  <p className="mt-1 text-sm leading-6 text-ink-600">
                    {resultByQuestion.get(activeQuestion.id)?.explanation}
                  </p>
                </div>
              )}

              {error && (
                <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-100">
                  {error}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    leadingIcon={<ArrowLeft className="h-4 w-4" />}
                    disabled={index === 0}
                    onClick={() => setIndex((current) => Math.max(0, current - 1))}
                  >
                    Oldingi
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    trailingIcon={<ArrowRight className="h-4 w-4" />}
                    disabled={index === questions.length - 1}
                    onClick={() =>
                      setIndex((current) =>
                        Math.min(questions.length - 1, current + 1)
                      )
                    }
                  >
                    Keyingi
                  </Button>
                </div>

                {result ? (
                  <Button
                    type="button"
                    variant="subtle"
                    leadingIcon={<RotateCcw className="h-4 w-4" />}
                    onClick={() => resetRun()}
                  >
                    Qayta ishlash
                  </Button>
                ) : (
                  <Button
                    type="button"
                    loading={submitting}
                    disabled={!canSubmit}
                    leadingIcon={<Send className="h-4 w-4" />}
                    onClick={submit}
                  >
                    {copy.button}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-xl bg-ink-50 p-6 text-center">
              <p className="text-sm font-semibold text-ink-800">
                Bu mavzu uchun savol topilmadi.
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Savol bankiga savollar qo&apos;shilgach, mashg&apos;ulot avtomatik
                ko&apos;rinadi.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Progress
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-100">
              <span
                className="block h-full rounded-full bg-brand-500"
                style={{
                  width: questions.length
                    ? `${Math.round((answeredCount / questions.length) * 100)}%`
                    : "0%",
                }}
              />
            </div>
            <p className="mt-2 text-sm text-ink-600">
              {answeredCount}/{questions.length} savol belgilandi.
            </p>
            {mode === "mock_test" && (
              <div className="mt-4 flex items-center gap-2 border-t border-ink-100 pt-4 text-sm font-bold text-ink-800">
                <Clock3 className="h-4 w-4 text-brand-600" />
                {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:
                {String(secondsLeft % 60).padStart(2, "0")}
              </div>
            )}
          </div>

          {result && (
            <div className="rounded-2xl bg-brand-600 p-5 text-white shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Yakuniy natija
              </p>
              <p className="mt-2 text-4xl font-extrabold">{result.score}%</p>
              <p className="mt-1 text-sm font-medium text-white/85">
                {result.rawScore}/{result.maxScore} xom ball · {formatScore(result)} to&apos;g&apos;ri
              </p>
              <p className="mt-4 text-xs leading-5 text-white/75">
                Bu mashq natijasi. Haqiqiy sertifikat bali Agentlikning Rash
                modeli bilan hisoblanadi.
              </p>
            </div>
          )}

          <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Savollar ro&apos;yxati
            </p>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {questions.map((question, questionIndex) => {
                const answerResult = resultByQuestion.get(question.id);
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setIndex(questionIndex)}
                    className={cn(
                      "flex h-10 items-center justify-center rounded-lg text-sm font-bold transition",
                      questionIndex === index
                        ? "bg-brand-600 text-white"
                        : "bg-ink-100 text-ink-600 hover:bg-ink-200",
                      (Number.isInteger(answers[question.id]?.selectedIndex) ||
                        Boolean(
                          answers[question.id]?.textAnswers?.some((value) =>
                            value.trim()
                          )
                        )) &&
                        !result &&
                        "bg-brand-100 text-brand-700",
                      result &&
                        answerResult?.isCorrect &&
                        "bg-accent-100 text-accent-700",
                      result &&
                        answerResult &&
                        !answerResult.isCorrect &&
                        "bg-rose-100 text-rose-700"
                    )}
                  >
                    {questionIndex + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
      )}
    </div>
  );
}
