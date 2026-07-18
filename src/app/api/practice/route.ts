import { NextResponse } from "next/server";
import { canManageAdmin } from "@/lib/server/admin";
import { getSession } from "@/lib/server/auth";
import { userStore } from "@/lib/server/db";
import { practiceStore } from "@/lib/server/practice";
import type { QuestionDraft } from "@/lib/practice/types";

export const runtime = "nodejs";

async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json(
        { error: "Avval hisobga kiring." },
        { status: 401 }
      ),
    };
  }

  const user = await userStore.getById(session.userId);
  if (!canManageAdmin(user)) {
    return {
      error: NextResponse.json(
        { error: "Admin ruxsati kerak." },
        { status: 403 }
      ),
    };
  }

  return { user };
}

function isDifficulty(value: unknown): value is QuestionDraft["difficulty"] {
  return value === "easy" || value === "medium" || value === "hard";
}

function isReviewStatus(
  value: unknown
): value is NonNullable<QuestionDraft["reviewStatus"]> {
  return (
    value === "draft" ||
    value === "review" ||
    value === "published" ||
    value === "archived"
  );
}

function parseDraft(value: unknown): QuestionDraft {
  if (!value || typeof value !== "object") {
    throw new Error("Savol ma'lumotlari noto'g'ri.");
  }

  const data = value as Partial<QuestionDraft>;
  if (
    typeof data.subjectId !== "string" ||
    typeof data.topicId !== "string" ||
    typeof data.prompt !== "string" ||
    typeof data.explanation !== "string" ||
    !Array.isArray(data.options) ||
    typeof data.correctIndex !== "number" ||
    !isDifficulty(data.difficulty)
  ) {
    throw new Error("Majburiy maydonlar to'liq emas.");
  }

  return {
    id: typeof data.id === "string" ? data.id : undefined,
    subjectId: data.subjectId,
    topicId: data.topicId,
    prompt: data.prompt,
    options: data.options.filter(
      (option): option is string => typeof option === "string"
    ),
    correctIndex: data.correctIndex,
    explanation: data.explanation,
    difficulty: data.difficulty,
    reviewStatus: isReviewStatus(data.reviewStatus)
      ? data.reviewStatus
      : undefined,
    reviewNote:
      typeof data.reviewNote === "string" ? data.reviewNote : undefined,
  };
}

export async function GET() {
  const admin = await requireAdmin();
  if (admin.error) return admin.error;
  if (!admin.user) {
    return NextResponse.json({ error: "Admin topilmadi." }, { status: 403 });
  }

  const bank = await practiceStore.getAdminBank();
  return NextResponse.json(bank);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (admin.error) return admin.error;

  try {
    const draft = parseDraft(await req.json());
    const question = await practiceStore.upsertQuestion(draft);
    const bank = await practiceStore.getAdminBank();
    return NextResponse.json({ question, bank });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Savolni saqlashda muammo bo'ldi.",
      },
      { status: 422 }
    );
  }
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (admin.error) return admin.error;
  if (!admin.user) {
    return NextResponse.json({ error: "Admin topilmadi." }, { status: 403 });
  }

  try {
    const body = (await req.json()) as {
      questionId?: unknown;
      status?: unknown;
      reviewNote?: unknown;
    };
    if (
      typeof body.questionId !== "string" ||
      !isReviewStatus(body.status)
    ) {
      return NextResponse.json(
        { error: "Savol va tekshiruv holati noto‘g‘ri." },
        { status: 422 }
      );
    }

    const question = await practiceStore.reviewQuestion({
      questionId: body.questionId,
      status: body.status,
      reviewNote:
        typeof body.reviewNote === "string" ? body.reviewNote : undefined,
      reviewerId: admin.user.id,
    });
    const bank = await practiceStore.getAdminBank();
    return NextResponse.json({ question, bank });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Tekshiruv holatini saqlashda muammo bo‘ldi.",
      },
      { status: 422 }
    );
  }
}

export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (admin.error) return admin.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Savol ID kerak." }, { status: 422 });
  }

  await practiceStore.deleteQuestion(id);
  const bank = await practiceStore.getAdminBank();
  return NextResponse.json({ bank });
}
