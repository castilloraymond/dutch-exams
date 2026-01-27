"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { getContentIndex, getKNMIndex, getListeningIndex } from "@/lib/content";
import { ArrowLeft, BookOpen, Landmark, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const modules = [
  {
    id: "lezen",
    name: "Lezen (Reading)",
    description: "Practice Dutch reading comprehension with real-world passages.",
    icon: BookOpen,
    href: "/learn/lezen",
  },
  {
    id: "knm",
    name: "KNM (Dutch Society)",
    description: "Test your knowledge of Dutch culture, history, and values.",
    icon: Landmark,
    href: "/learn/knm",
  },
  {
    id: "luisteren",
    name: "Luisteren (Listening)",
    description: "Listen to Dutch audio fragments and answer questions.",
    icon: Headphones,
    href: "/learn/luisteren",
  },
];

export default function LearnHubPage() {
  const { progress, isLoaded } = useProgress();
  const contentIndex = getContentIndex();
  const knmIndex = getKNMIndex();
  const listeningIndex = getListeningIndex();

  function getModuleStats(id: string) {
    if (!isLoaded) return null;
    if (id === "lezen") {
      const total = contentIndex.passages.length;
      const completed = contentIndex.passages.filter(
        (p) => progress.passageProgress[p.id]?.completed
      ).length;
      return { total, completed };
    }
    if (id === "knm") {
      const total = knmIndex.topics.length;
      const completed = knmIndex.topics.filter(
        (t) => progress.passageProgress[`knm-${t.id}`]?.completed
      ).length;
      return { total, completed };
    }
    if (id === "luisteren") {
      const total = listeningIndex.exercises.length;
      const completed = listeningIndex.exercises.filter(
        (e) => progress.passageProgress[`luisteren-${e.id}`]?.completed
      ).length;
      return { total, completed };
    }
    return null;
  }

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
            <h1 className="text-xl font-bold">Practice Modules</h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Choose a Module</h2>
            <p className="text-muted-foreground">
              Select a module to start practicing for your inburgering exam.
            </p>
          </div>

          <div className="space-y-4">
            {modules.map((mod) => {
              const Icon = mod.icon;
              const stats = getModuleStats(mod.id);
              return (
                <Link key={mod.id} href={mod.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer mb-4">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{mod.name}</h3>
                          <p className="text-sm text-muted-foreground">{mod.description}</p>
                          {stats && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {stats.completed}/{stats.total} completed
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
