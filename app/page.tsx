import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Headphones, GraduationCap } from "lucide-react";

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
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Prepare for Your Inburgering Exam
          </h2>

          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Practice reading, listening, and Dutch society knowledge. Three modules to get you exam-ready.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full px-4">
          <Link href="/learn" className="block">
            <Card className="cursor-pointer hover:border-primary transition-colors h-full">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Lezen</h3>
                <p className="text-sm text-muted-foreground">
                  Reading comprehension with real-world Dutch texts
                </p>
                <Button variant="outline" className="mt-4 w-full">
                  5 passages
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/learn/knm" className="block">
            <Card className="cursor-pointer hover:border-primary transition-colors h-full">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <GraduationCap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">KNM</h3>
                <p className="text-sm text-muted-foreground">
                  Kennis van de Nederlandse Maatschappij — Dutch society quiz
                </p>
                <Button variant="outline" className="mt-4 w-full">
                  8 topics, 96 questions
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/learn/luisteren" className="block">
            <Card className="cursor-pointer hover:border-primary transition-colors h-full">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <Headphones className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Luisteren</h3>
                <p className="text-sm text-muted-foreground">
                  Listening comprehension with audio exercises
                </p>
                <Button variant="outline" className="mt-4 w-full">
                  5 exercises
                </Button>
              </CardContent>
            </Card>
          </Link>
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
