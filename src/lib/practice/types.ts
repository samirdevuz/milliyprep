export type PracticeMode = "practice" | "mock_test";

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
  position: number;
}

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export type PublicQuestion = Omit<Question, "correctIndex" | "explanation">;

export interface TopicWithProgress extends Topic {
  subjectName: string;
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
  selectedIndex: number;
}

export interface AttemptAnswerResult extends SubmittedAnswer {
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
}

export interface AttemptResult {
  attemptId: string;
  mode: PracticeMode;
  subjectId?: string;
  topicId?: string;
  score: number;
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
}

export interface AdminQuestionBank {
  subjects: Subject[];
  topics: Topic[];
  questions: Question[];
}
