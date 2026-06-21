import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { userStore } from "@/lib/server/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await userStore.getById(session.userId);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      onboarding: user.onboarding ?? null,
    },
  });
}
