import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, Target } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Dutch Inburgering Prep</h1>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Master Dutch Reading for Your Inburgering Exam
          </h2>

          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Practice reading comprehension with real-world Dutch texts. Build
            your skills one passage at a time, from supermarket signs to
            official letters.
          </p>

          <Link href="/learn">
            <Button size="lg" className="mt-4">
              Start Learning
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full px-4">
          <div className="text-center p-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted mb-3">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="font-semibold mb-1">Exam-Focused</h3>
            <p className="text-sm text-muted-foreground">
              Content aligned with A0-A1 Inburgering reading requirements
            </p>
          </div>

          <div className="text-center p-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted mb-3">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-semibold mb-1">Real-World Topics</h3>
            <p className="text-sm text-muted-foreground">
              Practice with everyday scenarios you will encounter in the
              Netherlands
            </p>
          </div>

          <div className="text-center p-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted mb-3">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold mb-1">Track Progress</h3>
            <p className="text-sm text-muted-foreground">
              Your progress is saved automatically so you can learn at your own
              pace
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Prepare for your Dutch Inburgering exam with confidence.</p>
        </div>
      </footer>
    </main>
  );
}
