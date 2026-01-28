export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

// Content types for structured passage rendering
export type PassageContentType = "text" | "list" | "letter" | "notice";

export interface Passage {
  id: string;
  title: string;
  content: string;
  contentType?: PassageContentType;
  instruction?: string;
  difficulty: "A2";
  questions: Question[];
}

export interface PassageSummary {
  id: string;
  title: string;
  difficulty: "A2";
  questionCount: number;
}

export interface ContentIndex {
  module: string;
  description: string;
  passages: PassageSummary[];
}

export interface PassageProgress {
  completed: boolean;
  questionsAnswered: string[];
  correctAnswers: number;
  totalQuestions: number;
  lastAttempt: string;
}

export interface UserProgress {
  passageProgress: {
    [passageId: string]: PassageProgress;
  };
  email?: string;
}

// Exam state for navigation and answer tracking
export interface ExamState {
  answers: Record<string, number | null>;
  bookmarked: Set<string>;
  currentQuestionIndex: number;
  startTime: number;
}

// Answer record for results review
export interface AnswerRecord {
  questionId: string;
  questionText: string;
  options: string[];
  userAnswer: number | null;
  correctAnswer: number;
  explanation?: string;
}

// KNM types
export interface KNMTopic {
  id: string;
  title: string;
  questions: Question[];
}

export interface KNMTopicSummary {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  icon: string;
}

export interface KNMIndex {
  module: string;
  description: string;
  topics: KNMTopicSummary[];
}

// Luisteren types
export interface ListeningExercise {
  id: string;
  title: string;
  difficulty: "A2";
  transcript: string;
  audioFile?: string;
  questions: Question[];
}

export interface ListeningExerciseSummary {
  id: string;
  title: string;
  difficulty: "A2";
  questionCount: number;
}

export interface ListeningIndex {
  module: string;
  description: string;
  exercises: ListeningExerciseSummary[];
}
