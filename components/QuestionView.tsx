"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Question } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuestionViewProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export function QuestionView({ question, onAnswer }: QuestionViewProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const correct = selectedOption === question.correctIndex;
    setIsCorrect(correct);
    setHasSubmitted(true);
  };

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{question.text}</h3>

      <RadioGroup
        value={selectedOption?.toString()}
        onValueChange={(value) => !hasSubmitted && setSelectedOption(parseInt(value))}
        className="space-y-3"
      >
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrectOption = index === question.correctIndex;

          return (
            <Card
              key={index}
              className={cn(
                "cursor-pointer transition-colors",
                !hasSubmitted && isSelected && "border-primary",
                hasSubmitted && isCorrectOption && "border-green-500 bg-green-50",
                hasSubmitted && isSelected && !isCorrectOption && "border-red-500 bg-red-50"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    disabled={hasSubmitted}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option}
                  </Label>
                  {hasSubmitted && isCorrectOption && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {hasSubmitted && isSelected && !isCorrectOption && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </RadioGroup>

      {hasSubmitted && question.explanation && (
        <Card className="bg-muted">
          <CardContent className="p-4">
            <p className="text-sm">
              <span className="font-medium">Explanation: </span>
              {question.explanation}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="pt-4">
        {!hasSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="w-full"
          >
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full">
            {isCorrect ? "Continue" : "Got it, Next Question"}
          </Button>
        )}
      </div>
    </div>
  );
}
