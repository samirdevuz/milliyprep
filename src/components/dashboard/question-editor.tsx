"use client";

import { useMemo, useState } from "react";
import {
  BookOpenCheck,
  Check,
  ClipboardList,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconChip } from "@/components/ui/icon-chip";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/cn";
import type {
  AdminQuestionBank,
  Question,
  QuestionDraft,
  Topic,
} from "@/lib/practice/types";

interface QuestionEditorProps {
  initialBank: AdminQuestionBank;
}

interface FormState {
  id?: string;
  subjectId: string;
  topicId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: QuestionDraft["difficulty"];
}

function emptyForm(bank: AdminQuestionBank): FormState {
  const subjectId = bank.subjects[0]?.id ?? "";
  const topicId =
    bank.topics.find((topic) => topic.subjectId === subjectId)?.id ??
    bank.topics[0]?.id ??
    "";

  return {
    subjectId,
    topicId,
    prompt: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: "",
    difficulty: "easy",
  };
}

function formFromQuestion(question: Question): FormState {
  return {
    id: question.id,
    subjectId: question.subjectId,
    topicId: question.topicId,
    prompt: question.prompt,
    options: [...question.options, "", "", "", ""].slice(0, 4),
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    difficulty: question.difficulty,
  };
}

function topicLabel(topic: Topic) {
  const level =
    topic.level === "easy" ? "Oson" : topic.level === "medium" ? "O'rta" : "Qiyin";
  return `${topic.name} · ${level}`;
}

export function QuestionEditor({ initialBank }: QuestionEditorProps) {
  const [bank, setBank] = useState(initialBank);
  const [form, setForm] = useState<FormState>(() => emptyForm(initialBank));
  const [activeId, setActiveId] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const topicsForSubject = useMemo(
    () => bank.topics.filter((topic) => topic.subjectId === form.subjectId),
    [bank.topics, form.subjectId]
  );

  const questionsForTopic = useMemo(
    () =>
      bank.questions.filter((question) =>
        form.topicId ? question.topicId === form.topicId : true
      ),
    [bank.questions, form.topicId]
  );

  const subjectOptions = bank.subjects.map((subject) => ({
    value: subject.id,
    label: subject.name,
  }));
  const topicOptions = topicsForSubject.map((topic) => ({
    value: topic.id,
    label: topicLabel(topic),
  }));

  const updateOption = (index: number, value: string) => {
    setForm((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) =>
        optionIndex === index ? value : option
      ),
    }));
  };

  const selectSubject = (subjectId: string) => {
    const nextTopic = bank.topics.find((topic) => topic.subjectId === subjectId);
    setForm((current) => ({
      ...current,
      subjectId,
      topicId: nextTopic?.id ?? "",
    }));
    setActiveId(undefined);
  };

  const startNew = () => {
    setForm(emptyForm(bank));
    setActiveId(undefined);
    setError("");
    setStatus("");
  };

  const selectQuestion = (question: Question) => {
    setForm(formFromQuestion(question));
    setActiveId(question.id);
    setError("");
    setStatus("");
  };

  const save = async () => {
    setSaving(true);
    setError("");
    setStatus("");

    try {
      const response = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Savol saqlanmadi.");

      setBank(payload.bank as AdminQuestionBank);
      setForm(formFromQuestion(payload.question as Question));
      setActiveId((payload.question as Question).id);
      setStatus("Savol saqlandi.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Savolni saqlashda muammo bo'ldi."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteQuestion = async () => {
    if (!activeId || deleting) return;
    setDeleting(true);
    setError("");
    setStatus("");

    try {
      const response = await fetch(`/api/practice?id=${activeId}`, {
        method: "DELETE",
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Savol o'chirilmadi.");

      const nextBank = payload.bank as AdminQuestionBank;
      setBank(nextBank);
      setForm(emptyForm(nextBank));
      setActiveId(undefined);
      setStatus("Savol o'chirildi.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Savolni o'chirishda muammo bo'ldi."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <IconChip tone="violet" size="lg">
              <BookOpenCheck strokeWidth={2.2} />
            </IconChip>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Admin panel
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-ink-900">
                Savol banki
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-600">
                Mavjud fan va mavzular uchun test savollarini boshqaring.
                Saqlangan savollar darhol practice/test engine ichida ishlaydi.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="subtle"
            leadingIcon={<Plus className="h-4 w-4" />}
            onClick={startNew}
          >
            Yangi savol
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-100">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Savollar
            </p>
            <span className="rounded-full bg-ink-50 px-2 py-1 text-xs font-bold text-ink-600">
              {bank.questions.length}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <Select
              label="Fan"
              name="filterSubject"
              value={form.subjectId}
              options={subjectOptions}
              onChange={(event) => selectSubject(event.target.value)}
            />
            <Select
              label="Mavzu"
              name="filterTopic"
              value={form.topicId}
              options={topicOptions}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  topicId: event.target.value,
                }))
              }
            />
          </div>

          <div className="mt-4 max-h-[560px] space-y-2 overflow-y-auto pr-1">
            {questionsForTopic.length ? (
              questionsForTopic.map((question) => (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => selectQuestion(question)}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition hover:bg-ink-50",
                    activeId === question.id
                      ? "border-brand-300 bg-brand-50 ring-2 ring-brand-100"
                      : "border-ink-100 bg-white"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold text-ink-900">
                        {question.prompt}
                      </p>
                      <p className="mt-1 text-xs text-ink-500">
                        {question.options.length} variant ·{" "}
                        {question.difficulty === "easy"
                          ? "oson"
                          : question.difficulty === "medium"
                            ? "o'rta"
                            : "qiyin"}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <p className="rounded-xl bg-ink-50 p-4 text-sm text-ink-600">
                Bu mavzuda savol yo&apos;q. Yangi savol qo&apos;shing.
              </p>
            )}
          </div>
        </aside>

        <section className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Fan"
              name="subjectId"
              value={form.subjectId}
              options={subjectOptions}
              onChange={(event) => selectSubject(event.target.value)}
            />
            <Select
              label="Mavzu"
              name="topicId"
              value={form.topicId}
              options={topicOptions}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  topicId: event.target.value,
                }))
              }
            />
          </div>

          <label className="mt-4 block space-y-1.5">
            <span className="text-sm font-medium text-ink-800">Savol matni</span>
            <textarea
              value={form.prompt}
              onChange={(event) =>
                setForm((current) => ({ ...current, prompt: event.target.value }))
              }
              rows={4}
              className="block w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 transition placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              placeholder="Masalan: 3x + 7 = 22 tenglamani yeching."
            />
          </label>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {form.options.map((option, index) => (
              <div key={index} className="flex items-end gap-2">
                <Input
                  label={`${String.fromCharCode(65 + index)} varianti`}
                  value={option}
                  onChange={(event) => updateOption(index, event.target.value)}
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({ ...current, correctIndex: index }))
                  }
                  className={cn(
                    "mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition",
                    form.correctIndex === index
                      ? "border-accent-400 bg-accent-50 text-accent-700"
                      : "border-ink-200 bg-white text-ink-400 hover:bg-ink-50"
                  )}
                  aria-label="To'g'ri javob sifatida belgilash"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Select
              label="Qiyinlik"
              name="difficulty"
              value={form.difficulty}
              options={[
                { value: "easy", label: "Oson" },
                { value: "medium", label: "O'rta" },
                { value: "hard", label: "Qiyin" },
              ]}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  difficulty: event.target.value as FormState["difficulty"],
                }))
              }
            />
            <Input label="Savol ID" value={form.id ?? "Yangi savol"} disabled />
          </div>

          <label className="mt-4 block space-y-1.5">
            <span className="text-sm font-medium text-ink-800">Izoh</span>
            <textarea
              value={form.explanation}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  explanation: event.target.value,
                }))
              }
              rows={3}
              className="block w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 transition placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              placeholder="Javob nima uchun to'g'ri ekanini qisqa tushuntiring."
            />
          </label>

          {(status || error) && (
            <p
              className={cn(
                "mt-4 rounded-xl px-4 py-3 text-sm font-medium ring-1",
                error
                  ? "bg-rose-50 text-rose-700 ring-rose-100"
                  : "bg-accent-50 text-accent-700 ring-accent-100"
              )}
            >
              {error || status}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="primary"
              loading={saving}
              leadingIcon={<Save className="h-4 w-4" />}
              onClick={save}
            >
              Saqlash
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!activeId}
              loading={deleting}
              leadingIcon={<Trash2 className="h-4 w-4" />}
              onClick={deleteQuestion}
              className="text-rose-700 hover:bg-rose-50"
            >
              O&apos;chirish
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
