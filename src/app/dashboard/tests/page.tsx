import { getSession } from "@/lib/server/auth";
import { practiceStore } from "@/lib/server/practice";
import { PracticeEngine } from "@/components/dashboard/practice-engine";

export default async function TestsPage() {
  const session = await getSession();
  const userId = session?.userId ?? "";
  const [catalog, mockQuestions] = await Promise.all([
    practiceStore.getCatalog(userId),
    practiceStore.getMockTestQuestions(45),
  ]);

  return (
    <PracticeEngine
      mode="mock_test"
      catalog={catalog}
      mockQuestions={mockQuestions}
      mockReadiness={mockQuestions.length}
    />
  );
}
