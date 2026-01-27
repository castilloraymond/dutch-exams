"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { getListeningIndex } from "@/lib/content";
import { ArrowLeft, Headphones, CheckCircle2 } from "lucide-react";

export default function LuisterenPage() {
  const { progress, isLoaded } = useProgress();
  const listeningIndex = getListeningIndex();

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              <h1 className="text-xl font-bold">Luisteren (Listening)</h1>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Luisteroefeningen</h2>
            <p className="text-muted-foreground">
              Luister naar het fragment en beantwoord de vragen. Gebruik de afspeelknop om het fragment te horen.
            </p>
          </div>

          <div className="space-y-4">
            {isLoaded ? (
              listeningIndex.exercises.map((exercise) => {
                const progressKey = `luisteren-${exercise.id}`;
                const exerciseProgress = progress.passageProgress[progressKey];
                const isComplete = exerciseProgress?.completed;

                return (
                  <Link key={exercise.id} href={`/learn/luisteren/${exercise.id}`}>
                    <Card className="cursor-pointer hover:border-primary transition-colors mb-4">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Headphones className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{exercise.title}</h3>
                                {isComplete && (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {exercise.questionCount} vragen
                                {exerciseProgress && !isComplete && (
                                  <> &middot; {exerciseProgress.questionsAnswered.length}/{exerciseProgress.totalQuestions} beantwoord</>
                                )}
                              </p>
                            </div>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            exercise.difficulty === "A0"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {exercise.difficulty}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            ) : (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
