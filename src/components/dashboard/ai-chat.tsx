"use client";

import { useRef, useState, type FormEvent } from "react";
import { Bot, Loader2, Send, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { ChatMessage } from "@/lib/ai/types";

type UiMessage = ChatMessage & { id: string };

const STARTER_PROMPTS = [
  "Kvadrat tenglamani qadam-baqadam tushuntir.",
  "Geometriyada qaysi mavzudan boshlashim kerak?",
  "Bugungi matematika rejamni tuzib ber.",
];

function newId(): string {
  return crypto.randomUUID();
}

export function AiChat() {
  const [messages, setMessages] = useState<UiMessage[]>([
    {
      id: newId(),
      role: "assistant",
      content:
        "Salom! Bugun Milliy Sertifikat bo'yicha qaysi ko'nikmani birga ochamiz? Savol yoki mashq yuboring, qadam-baqadam tushuntiraman.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;

    const userMessage: UiMessage = { id: newId(), role: "user", content };
    const assistantMessage: UiMessage = {
      id: newId(),
      role: "assistant",
      content: "",
    };
    const nextMessages = [...messages, userMessage, assistantMessage];

    setMessages(nextMessages);
    setDraft("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "AI tutor javob bera olmadi.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: message.content + chunk }
              : message
          )
        );
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessage.id
              ? {
                  ...message,
                  content:
                    error instanceof Error
                      ? error.message
                      : "AI tutor javob bera olmadi.",
                }
              : message
          )
        );
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void send(draft);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-100">
      <header className="flex items-center justify-between border-b border-ink-100 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-ink-900">AI tutor</h1>
            <p className="text-xs text-ink-500">MilliyPrep yordamchisi</p>
          </div>
        </div>
        {loading && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            yozmoqda
          </span>
        )}
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto bg-ink-50/50 px-4 py-5 sm:px-5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm",
                message.role === "user"
                  ? "bg-brand-500 text-white"
                  : "bg-white text-ink-800 ring-1 ring-ink-100"
              )}
            >
              {message.content || (
                <span className="inline-flex items-center gap-1.5 text-ink-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ...
                </span>
              )}
            </div>
            {message.role === "user" && (
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-900 text-white">
                <UserRound className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-ink-100 bg-white p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void send(prompt)}
              disabled={loading}
              className="rounded-full bg-ink-100 px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-ink-200 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit(event);
              }
            }}
            rows={2}
            placeholder="Savolingizni yozing..."
            className="min-h-12 flex-1 resize-none rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
          />
          <Button
            type="submit"
            disabled={!draft.trim() || loading}
            aria-label="Yuborish"
            className="h-12 w-12 shrink-0 rounded-2xl px-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
