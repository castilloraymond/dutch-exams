export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  explanationEn?: string;
  image?: string;
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
  correctQuestions?: string[];
  totalQuestions: number;
  lastAttempt: string;
}

export interface ExamCompletion {
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
}

export interface ExamCompletionProgress {
  [examId: string]: ExamCompletion;
}

export interface UserProgress {
  passageProgress: {
    [passageId: string]: PassageProgress;
  };
  examProgress?: ExamCompletionProgress;
  writingProgress?: WritingProgress;
  speakingProgress?: SpeakingProgress;
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
  explanationEn?: string;
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
  image?: string;
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

// Mock Exam types
export type Difficulty = "A1" | "A2";

export interface MockExamSummary {
  id: string;
  title: string;
  difficulty: Difficulty;
  questionCount: number;
  recommendedTime: string;
  isFreePreview?: boolean;
}

export interface MockExamIndex {
  module: string;
  exams: MockExamSummary[];
}

export interface MockExam {
  id: string;
  title: string;
  module: string;
  difficulty: Difficulty;
  questionCount: number;
  recommendedTime: string;
  isFreePreview?: boolean;
  questions: Question[];
  // For lezen exams, passages with their questions
  passages?: {
    id: string;
    title: string;
    content: string;
    contentType?: PassageContentType;
    instruction?: string;
    questions: Question[];
  }[];
  // For luisteren exams, audio content
  transcripts?: {
    id: string;
    title: string;
    transcript: string;
    audioFile?: string;
    image?: string;
    questions: Question[];
  }[];
}

export interface ExamResult {
  id: string;
  examId: string;
  module: string;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timeTakenSeconds: number;
  createdAt: string;
}

// Quick Assessment types
export type QuickAssessmentModule = "lezen" | "knm" | "luisteren" | "schrijven" | "spreken";

export interface QuickAssessmentConfig {
  module: QuickAssessmentModule;
  name: string;
  nameEnglish: string;
  description: string;
  questionIds: string[];
  estimatedMinutes: number;
  icon: string;
}

export interface QuickAssessmentAnswer {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  timeSpentMs: number;
}

export interface QuickAssessmentAttempt {
  module: QuickAssessmentModule;
  answers: QuickAssessmentAnswer[];
  totalTimeMs: number;
  score: number;
  completedAt: string;
}

export interface QuickAssessmentProgress {
  currentQuestionIndex: number;
  answers: QuickAssessmentAnswer[];
  startTime: number;
  lastActiveTime: number;
}

// ============================================
// Schrijven (Writing) Types
// ============================================

export type WritingTaskType = "free-text" | "form";

export interface FormField {
  id: string;
  label: string;
  labelEn: string;
  type: "text" | "date" | "select" | "textarea";
  options?: string[];
  required: boolean;
  placeholder?: string;
}

export interface FormAnswer {
  [fieldId: string]: string;
}

export interface AssessmentCriterion {
  id: string;
  text: string;
  textEn: string;
}

export interface WritingQuestion {
  id: string;
  scenario: string;
  scenarioEn: string;
  prompt: string;
  promptEn: string;
  taskType: WritingTaskType;
  wordRange?: {
    min: number;
    max: number;
  };
  formFields?: FormField[];
  selfAssessmentCriteria: AssessmentCriterion[];
  modelAnswer: string | FormAnswer;
}

export interface WritingTask {
  id: string;
  title: string;
  titleEn: string;
  difficulty: Difficulty;
  taskType: WritingTaskType;
  scenario: string;
  scenarioEn: string;
  prompt: string;
  promptEn: string;
  wordRange?: {
    min: number;
    max: number;
  };
  formFields?: FormField[];
  selfAssessmentCriteria: AssessmentCriterion[];
  modelAnswer: string | FormAnswer;
  tips: string[];
  isFreePreview: boolean;
  questions?: WritingQuestion[];
}

export interface WritingTaskSummary {
  id: string;
  title: string;
  titleEn: string;
  difficulty: Difficulty;
  taskType: WritingTaskType;
  isFreePreview: boolean;
}

export interface WritingIndex {
  module: string;
  description: string;
  tasks: WritingTaskSummary[];
}

export interface WritingSubmission {
  questionId: string;
  submission: string | FormAnswer;
}

export interface WritingAttempt {
  submission: string | FormAnswer;
  submissions?: WritingSubmission[];
  selfAssessmentScore: number;
  selfAssessmentTotal: number;
  checkedCriteria: string[];
  modelAnswerRevealed: boolean;
  completedAt: string;
  timeElapsed: number;
}

export interface WritingProgress {
  [taskId: string]: WritingAttempt;
}

// ============================================
// Spreken (Speaking) Types
// ============================================

export type SpeakingPartNumber = 1 | 2 | 3 | 4;

export interface TaskImage {
  id: string;
  src: string;
  alt: string;
  altNl: string;
  label?: string;
}

export interface SpeakingQuestion {
  id: string;
  questionNl: string;
  questionEn: string;
  questionParts?: string[];
  personStatement?: string;
  personStatementNl?: string;
  images?: TaskImage[];
  recommendedDuration: number;
  softLimitWarning: number;
  modelAnswer: {
    transcript: string;
    transcriptNl: string;
    audioFile?: string;
  };
  sequencingWordsRequired?: boolean;
}

export interface SpeakingTask {
  id: string;
  partNumber: SpeakingPartNumber;
  partTitle: string;
  partTitleNl: string;
  title: string;
  titleNl: string;
  difficulty: Difficulty;
  // Legacy single-question fields (kept for backward compat)
  personStatement?: string;
  personStatementNl?: string;
  images?: TaskImage[];
  questionNl: string;
  questionEn: string;
  questionParts?: string[];
  recommendedDuration: number;
  softLimitWarning: number;
  selfAssessmentCriteria: AssessmentCriterion[];
  modelAnswer: {
    transcript: string;
    transcriptNl: string;
    audioFile?: string;
  };
  tips: string[];
  sequencingWordsRequired?: boolean;
  isFreePreview: boolean;
  // Multi-question support
  questions?: SpeakingQuestion[];
}

export interface SpeakingTaskSummary {
  id: string;
  partNumber: SpeakingPartNumber;
  partTitle: string;
  partTitleNl: string;
  title: string;
  titleNl: string;
  difficulty: Difficulty;
  isFreePreview: boolean;
}

export interface SpeakingIndex {
  module: string;
  description: string;
  tasks: SpeakingTaskSummary[];
}

export interface SpeakingAttempt {
  recordingDuration: number;
  selfAssessmentScore: number;
  selfAssessmentTotal: number;
  checkedCriteria: string[];
  modelAnswerPlayed: boolean;
  completedAt: string;
  attemptCount: number;
}

export interface SpeakingProgress {
  [taskId: string]: SpeakingAttempt;
}
