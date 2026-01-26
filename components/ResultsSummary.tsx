"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, RotateCcw, ArrowLeft } from "lucide-react";

interface ResultsSummaryProps {
  title: string;
  correctAnswers: number;
  totalQuestions: number;
  onRetry: () => void;
}

export function ResultsSummary({
  title,
  correctAnswers,
  totalQuestions,
  onRetry,
}: ResultsSummaryProps) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const isPassing = percentage >= 60;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle2
              className={`h-16 w-16 ${
                isPassing ? "text-green-500" : "text-yellow-500"
              }`}
            />
          </div>
          <CardTitle className="text-2xl">
            {isPassing ? "Great job!" : "Keep practicing!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">
              {correctAnswers} / {totalQuestions}
            </p>
            <p className="text-muted-foreground">
              {percentage}% correct on &ldquo;{title}&rdquo;
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={onRetry} variant="outline" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Link href="/learn" className="block">
              <Button variant="default" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Passages
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
