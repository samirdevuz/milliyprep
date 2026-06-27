export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatContext {
  /** Optional learner profile, derived from onboarding answers. */
  subjectId?: string;
  subjectLabel?: string;
  currentScore?: number;
  targetScore?: number;
  resultStatus?: string;
  focusSkills?: string[];
  worries?: string;
  language?: "uz" | "ru" | "en";
}

export interface ChatProvider {
  readonly name: string;
  /**
   * Stream a completion. Implementations should yield text chunks as they
   * arrive. Mock provider yields word-by-word to simulate streaming.
   */
  stream(
    messages: ChatMessage[],
    context: ChatContext
  ): AsyncIterable<string>;
}
