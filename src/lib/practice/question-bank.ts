import {
  CURRICULUM_QUESTIONS,
  CURRICULUM_SUBJECTS,
  CURRICULUM_TOPICS,
} from "@/content/curriculum";
import type { PublicQuestion, Question, Subject, Topic } from "./types";

export const SUBJECTS: Subject[] = CURRICULUM_SUBJECTS.filter(
  (subject) => subject.availability === "live"
).map((subject) => ({
  id: subject.id,
  name: subject.label,
  description: subject.caption,
  color: "brand",
  examWeight: 100,
  position: subject.position,
}));

export const TOPICS: Topic[] = CURRICULUM_TOPICS.map((topic) => ({
  id: topic.id,
  subjectId: topic.subjectId,
  name: topic.name,
  description: topic.description,
  level: topic.level,
  estimatedMinutes: topic.estimatedMinutes,
  examShare: topic.examShare,
  sourceId: topic.sourceId,
  position: topic.position,
}));

export const QUESTIONS: Question[] = CURRICULUM_QUESTIONS.map((question) => ({
  ...question,
}));

export function publicQuestion(question: Question): PublicQuestion {
  return {
    id: question.id,
    subjectId: question.subjectId,
    topicId: question.topicId,
    prompt: question.prompt,
    options: question.options,
    type: question.type,
    position: question.position,
    points: question.points,
    context: question.context,
    groupId: question.groupId,
    difficulty: question.difficulty,
    sourceId: question.sourceId,
    origin: question.origin,
    reviewStatus: question.reviewStatus,
    contentVersion: question.contentVersion,
    parts: question.parts?.map((part) => ({
      id: part.id,
      prompt: part.prompt,
      points: part.points,
    })),
  };
}
