import posthog from "posthog-js";

export type ExamModule = "lezen" | "knm" | "luisteren" | "schrijven" | "spreken";

export function trackExamCompleted(props: {
  module: ExamModule;
  examId: string;
  examType: "free" | "mock";
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timeTakenSeconds?: number;
}) {
  posthog.capture("exam_completed", props);
}

export function trackPurchaseInitiated() {
  posthog.capture("purchase_initiated");
}
