import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { canManageAdmin } from "@/lib/server/admin";
import { getSession } from "@/lib/server/auth";
import { userStore } from "@/lib/server/db";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata: Metadata = {
  title: "Dashboard · MilliyPrep",
  description: "Bugungi reja, mashqlar va statistikangiz bir joyda.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side guard (second layer after middleware).
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/dashboard");
  }

  const user = await userStore.getById(session.userId);
  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return (
    <DashboardShell
      user={{
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: canManageAdmin(user),
      }}
    >
      {children}
    </DashboardShell>
  );
}
