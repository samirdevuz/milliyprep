export type PracticeMode = "practice" | "mock_test";
export type QuestionType = "single_choice" | "matching" | "short_answer";
export type ReviewStatus = "draft" | "review" | "published" | "archived";

export interface Subject {
  id: string;
  name: string;
  description: string;
  color: "brand" | "accent" | "amber" | "violet" | "sky";
  examWeight: number;
  position: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  level: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  examShare?: number;
  sourceId?: string;
  position: number;
}

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  prompt: string;
  options: string[];
  type: QuestionType;
  position: number;
  points: number;
  context?: string;
  groupId?: string;
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  sourceId?: string;
  origin?: "official" | "original";
  reviewStatus: ReviewStatus;
  reviewNote?: string;
  contentVersion?: string;
  parts?: QuestionPart[];
}

export interface QuestionPart {
  id: "a" | "b";
  prompt: string;
  points: number;
  correctAnswer: string;
  acceptedAnswers: string[];
  explanation: string;
}

export interface PublicQuestionPart {
  id: QuestionPart["id"];
  prompt: string;
  points: number;
}

export type PublicQuestion = Omit<
  Question,
  "correctIndex" | "explanation" | "parts" | "reviewNote"
> & {
  parts?: PublicQuestionPart[];
};

export interface TopicWithProgress extends Topic {
  subjectName: string;
  questionCount?: number;
  attempts: number;
  accuracy: number;
  lastScore?: number;
}

export interface SubjectProgressItem {
  subjectId: string;
  name: string;
  value: number;
  colorClass: string;
  attempts: number;
}

export interface RecentAttempt {
  id: string;
  mode: PracticeMode;
  subjectName: string;
  topicName?: string;
  score: number;
  total: number;
  correctCount: number;
  completedAt: string;
}

export interface PracticeProgress {
  totalAttempts: number;
  totalQuestions: number;
  correctQuestions: number;
  averageScore: number;
  bestScore: number;
  completedToday: number;
  questionsToday: number;
  streakDays: number;
  weeklyCompleted: number;
  weeklyTarget: number;
  subjectProgress: SubjectProgressItem[];
  topicProgress: TopicWithProgress[];
  recentAttempts: RecentAttempt[];
}

export interface PracticeCatalog {
  subjects: Subject[];
  topics: TopicWithProgress[];
  progress: PracticeProgress;
}

export interface SubmittedAnswer {
  questionId: string;
  selectedIndex?: number;
  textAnswers?: string[];
}

export interface AttemptPartResult {
  id: QuestionPart["id"];
  submitted: string;
  correctAnswer: string;
  isCorrect: boolean;
  earnedPoints: number;
  maxPoints: number;
  explanation: string;
}

export interface AttemptAnswerResult extends SubmittedAnswer {
  correctIndex?: number;
  isCorrect: boolean;
  explanation: string;
  earnedPoints: number;
  maxPoints: number;
  partResults?: AttemptPartResult[];
}

export interface AttemptResult {
  attemptId: string;
  mode: PracticeMode;
  subjectId?: string;
  topicId?: string;
  score: number;
  rawScore: number;
  maxScore: number;
  total: number;
  correctCount: number;
  completedAt: string;
  answers: AttemptAnswerResult[];
}


export interface QuestionDraft {
  id?: string;
  subjectId: string;
  topicId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: Question["difficulty"];
  reviewStatus?: ReviewStatus;
  reviewNote?: string;
}

export interface AdminQuestionBank {
  subjects: Subject[];
  topics: Topic[];
  questions: Question[];
}
