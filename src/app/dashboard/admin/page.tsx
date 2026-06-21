import { redirect } from "next/navigation";
import { canManageAdmin } from "@/lib/server/admin";
import { getSession } from "@/lib/server/auth";
import { userStore } from "@/lib/server/db";
import { practiceStore } from "@/lib/server/practice";
import { QuestionEditor } from "@/components/dashboard/question-editor";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard/admin");

  const user = await userStore.getById(session.userId);
  if (!canManageAdmin(user)) redirect("/dashboard");

  const bank = await practiceStore.getAdminBank();
  return <QuestionEditor initialBank={bank} />;
}
