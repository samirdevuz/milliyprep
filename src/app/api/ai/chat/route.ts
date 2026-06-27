import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { userStore } from "@/lib/server/db";
import {
  getClientIp,
  normalizedRateKey,
  rateLimit,
} from "@/lib/server/rate-limit";
import { MockProvider } from "@/lib/ai/providers/mock";
import { OpenAIProvider } from "@/lib/ai/providers/openai";
import type { ChatContext, ChatMessage } from "@/lib/ai/types";
import { subjectById } from "@/lib/onboarding/certificate";

export const runtime = "nodejs";

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 4000;

interface ChatRequestBody {
  messages?: ChatMessage[];
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const msg = value as Partial<ChatMessage>;
  return (
    (msg.role === "user" || msg.role === "assistant") &&
    typeof msg.content === "string" &&
    msg.content.trim().length > 0
  );
}

function sanitizeMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(isChatMessage)
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, MAX_CONTENT_LENGTH),
    }))
    .slice(-MAX_MESSAGES);
}

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const list = value.filter((item): item is string => typeof item === "string");
  return list.length ? list : undefined;
}

function toContext(onboarding?: Record<string, unknown>): ChatContext {
  if (!onboarding) return {};
  const subjectId =
    typeof onboarding.subjectId === "string" ? onboarding.subjectId : undefined;
  const subject = subjectById(subjectId);
  return {
    subjectId,
    subjectLabel: subject?.label,
    currentScore:
      typeof onboarding.currentScore === "number"
        ? onboarding.currentScore
        : undefined,
    targetScore:
      typeof onboarding.targetScore === "number"
        ? onboarding.targetScore
        : undefined,
    resultStatus:
      typeof onboarding.resultStatus === "string"
        ? onboarding.resultStatus
        : undefined,
    focusSkills: stringArray(onboarding.focusSkills),
    worries:
      typeof onboarding.worries === "string" ? onboarding.worries : undefined,
    language: "uz",
  };
}

function getProvider() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return new MockProvider();
  return new OpenAIProvider(apiKey);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Avval hisobga kiring." }, { status: 401 });
  }

  const limit = rateLimit(
    `ai-chat:${normalizedRateKey(session.userId)}:${getClientIp(req)}`,
    30,
    10 * 60 * 1000
  );
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Juda ko'p so'rov. Birozdan so'ng qayta urinib ko'ring." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov." }, { status: 400 });
  }

  const messages = sanitizeMessages(body.messages);
  if (!messages.length || messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json(
      { error: "Savol matnini yuboring." },
      { status: 422 }
    );
  }

  const user = await userStore.getById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "Hisob topilmadi." }, { status: 401 });
  }

  const provider = getProvider();
  const context = toContext(user.onboarding);
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of provider.stream(messages, context)) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (error) {
        console.error("AI chat error", error);
        controller.enqueue(
          encoder.encode(
            "\n\nKechirasiz, hozir javob berishda muammo bo'ldi. Birozdan so'ng qayta urinib ko'ring."
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-MilliyPrep-AI-Provider": provider.name,
    },
  });
}
