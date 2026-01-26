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
