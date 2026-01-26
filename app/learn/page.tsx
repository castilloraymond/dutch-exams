"use client";

import Link from "next/link";
import { PassageCard } from "@/components/PassageCard";
import { SaveProgressForm } from "@/components/SaveProgressForm";
import { useProgress } from "@/hooks/useProgress";
import { getContentIndex } from "@/lib/content";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function LearnPage() {
  const { progress, isLoaded, syncToCloud } = useProgress();
  const contentIndex = getContentIndex();

  const handleSaveProgress = async (email: string) => {
    await syncToCloud(email);
  };

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
              <BookOpen className="h-5 w-5" />
              <h1 className="text-xl font-bold">Lezen (Reading)</h1>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Reading Passages</h2>
            <p className="text-muted-foreground">
              Select a passage to practice your Dutch reading comprehension.
            </p>
          </div>

          <div className="space-y-4">
            {isLoaded ? (
              contentIndex.passages.map((passageSummary) => (
                <PassageCard
                  key={passageSummary.id}
                  passage={passageSummary}
                  progress={progress.passageProgress[passageSummary.id] || null}
                />
              ))
            ) : (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <SaveProgressForm
              currentEmail={progress.email}
              onSave={handleSaveProgress}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
