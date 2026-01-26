"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PassageSummary, PassageProgress } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";

interface PassageCardProps {
  passage: PassageSummary;
  progress: PassageProgress | null;
}

export function PassageCard({ passage, progress }: PassageCardProps) {
  const questionsAnswered = progress?.questionsAnswered.length ?? 0;
  const totalQuestions = passage.questionCount;
  const progressPercent = (questionsAnswered / totalQuestions) * 100;
  const isCompleted = progress?.completed ?? false;

  return (
    <Link href={`/learn/${passage.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{passage.title}</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-muted rounded-full font-medium">
                {passage.difficulty}
              </span>
              {isCompleted && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={progressPercent} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {questionsAnswered} / {totalQuestions} questions
              {progress?.correctAnswers !== undefined && questionsAnswered > 0 && (
                <span className="ml-2">
                  ({progress.correctAnswers} correct)
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
