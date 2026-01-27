"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { getKNMIndex } from "@/lib/content";
import { ArrowLeft, Briefcase, Home, HeartPulse, Landmark, GraduationCap, Scale, MapPin } from "lucide-react";
import { CheckCircle2 } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "briefcase": Briefcase,
  "home": Home,
  "heart-pulse": HeartPulse,
  "landmark": Landmark,
  "graduation-cap": GraduationCap,
  "scale": Scale,
  "map-pin": MapPin,
};

export default function KNMPage() {
  const { progress, isLoaded } = useProgress();
  const knmIndex = getKNMIndex();

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
            <h1 className="text-xl font-bold">KNM (Kennis Nederlandse Maatschappij)</h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Kies een onderwerp</h2>
            <p className="text-muted-foreground">
              Test je kennis over de Nederlandse maatschappij. 8 onderwerpen, 96 vragen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoaded ? (
              knmIndex.topics.map((topic) => {
                const Icon = iconMap[topic.icon] || Landmark;
                const progressKey = `knm-${topic.id}`;
                const topicProgress = progress.passageProgress[progressKey];
                const isComplete = topicProgress?.completed;

                return (
                  <Link key={topic.id} href={`/learn/knm/${topic.id}`}>
                    <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{topic.title}</h3>
                              {isComplete && (
                                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{topic.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {topic.questionCount} vragen
                              {topicProgress && !isComplete && (
                                <> &middot; {topicProgress.questionsAnswered.length}/{topicProgress.totalQuestions} beantwoord</>
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            ) : (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
