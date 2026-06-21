import { getSession } from "@/lib/server/auth";
import { practiceStore } from "@/lib/server/practice";
import { PracticeEngine } from "@/components/dashboard/practice-engine";

export default async function PracticePage({
  searchParams,
}: {
  searchParams?: Promise<{ topic?: string; search?: string }>;
}) {
  const session = await getSession();
  const userId = session?.userId ?? "";
  const params = await searchParams;
  const [catalog, questionsByTopic] = await Promise.all([
    practiceStore.getCatalog(userId),
    practiceStore.getQuestionsByTopic(5),
  ]);
  const search = params?.search?.trim().toLowerCase();
  const matchingTopic = search
    ? catalog.topics.find((topic) =>
        [topic.name, topic.subjectName, topic.description]
          .join(" ")
          .toLowerCase()
          .includes(search)
      )
    : undefined;
  const initialTopicId = catalog.topics.some((topic) => topic.id === params?.topic)
    ? params?.topic
    : matchingTopic?.id;

  return (
    <PracticeEngine
      mode="practice"
      catalog={catalog}
      questionsByTopic={questionsByTopic}
      initialTopicId={initialTopicId}
    />
  );
}
