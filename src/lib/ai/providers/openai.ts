import type { ChatContext, ChatMessage, ChatProvider } from "../types";
import { buildSystemPrompt } from "../prompt";

/**
 * OpenAI-compatible streaming provider. Works with the official OpenAI API
 * and any compatible endpoint (set OPENAI_BASE_URL). Uses the Chat
 * Completions streaming format (SSE).
 */
export class OpenAIProvider implements ChatProvider {
  readonly name = "openai";

  constructor(
    private apiKey: string,
    private model = process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    private baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"
  ) {}

  async *stream(
    messages: ChatMessage[],
    context: ChatContext
  ): AsyncIterable<string> {
    const payload = {
      model: this.model,
      stream: true,
      messages: [
        { role: "system", content: buildSystemPrompt(context) },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.4,
    };

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => "");
      throw new Error(`OpenAI xatosi (${res.status}): ${text.slice(0, 200)}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") return;
        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) yield delta as string;
        } catch {
          // Ignore malformed keep-alive chunks.
        }
      }
    }
  }
}
