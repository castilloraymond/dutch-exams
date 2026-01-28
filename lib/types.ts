export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Passage {
  id: string;
  title: string;
  content: string;
  difficulty: "A0" | "A1";
  questions: Question[];
}

export interface PassageSummary {
  id: string;
  title: string;
  difficulty: "A0" | "A1";
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

export type ExamMode = 'practice' | 'exam';

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
  difficulty: "A0" | "A1";
  transcript: string;
  questions: Question[];
}

export interface ListeningExerciseSummary {
  id: string;
  title: string;
  difficulty: "A0" | "A1";
  questionCount: number;
}

export interface ListeningIndex {
  module: string;
  description: string;
  exercises: ListeningExerciseSummary[];
}
