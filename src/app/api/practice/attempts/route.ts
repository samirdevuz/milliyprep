import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import {
  getClientIp,
  normalizedRateKey,
  rateLimit,
} from "@/lib/server/rate-limit";
import {
  PracticeInputError,
  practiceStore,
} from "@/lib/server/practice";
import type { PracticeMode, SubmittedAnswer } from "@/lib/practice/types";
import {
  entitlementEnforced,
  entitlementStore,
} from "@/lib/server/entitlements";

export const runtime = "nodejs";

interface SubmitAttemptBody {
  mode?: PracticeMode;
  topicId?: string;
  questionIds?: string[];
  answers?: SubmittedAnswer[];
  startedAt?: string;
}

function isMode(value: unknown): value is PracticeMode {
  return value === "practice" || value === "mock_test";
}

function cleanQuestionIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .slice(0, 50);
}

function cleanAnswers(value: unknown): SubmittedAnswer[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is SubmittedAnswer => {
      if (!item || typeof item !== "object") return false;
      const answer = item as Partial<SubmittedAnswer>;
      return (
        typeof answer.questionId === "string" &&
        typeof answer.selectedIndex === "number" &&
        Number.isInteger(answer.selectedIndex)
      );
    })
    .slice(0, 50);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Avval hisobga kiring." }, { status: 401 });
  }

  const limit = await rateLimit(
    `practice:${normalizedRateKey(session.userId)}:${getClientIp(req)}`,
    40,
    10 * 60 * 1000
  );
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: SubmitAttemptBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov." }, { status: 400 });
  }

  if (!isMode(body.mode)) {
    return NextResponse.json({ error: "Test turi noto'g'ri." }, { status: 422 });
  }
  if (
    body.mode === "mock_test" &&
    entitlementEnforced() &&
    !(await entitlementStore.hasPro(session.userId))
  ) {
    return NextResponse.json(
      { error: "Mock testlar Pro tarifda mavjud." },
      { status: 402 }
    );
  }

  const questionIds = cleanQuestionIds(body.questionIds);
  const answers = cleanAnswers(body.answers);
  if (!questionIds.length || !answers.length) {
    return NextResponse.json(
      { error: "Javoblar ro'yxatini yuboring." },
      { status: 422 }
    );
  }

  try {
    const result = await practiceStore.recordAttempt({
      userId: session.userId,
      mode: body.mode,
      topicId: typeof body.topicId === "string" ? body.topicId : undefined,
      questionIds,
      answers,
      startedAt: typeof body.startedAt === "string" ? body.startedAt : undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof PracticeInputError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    console.error("Practice submit error", error);
    return NextResponse.json(
      { error: "Natijani saqlashda muammo bo'ldi." },
      { status: 500 }
    );
  }
}
