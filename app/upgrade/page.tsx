"use client";

import Link from "next/link";
import { ArrowLeft, Crown, Mic, PenLine, Brain, Sparkles } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function UpgradePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
      <header className="border-b border-[var(--ink)]/10 sticky top-0 bg-[var(--cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/learn"
              className="text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-[var(--ink)]">
              Pro
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center space-y-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
            <Crown className="h-10 w-10 text-[var(--accent)]" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-3">
              Pro Coming Soon
            </h2>
            <p className="text-[var(--ink)]/60 mb-3">
              We&apos;re building powerful AI features to help you pass your exam.
            </p>
            <div className="inline-flex items-center gap-2 bg-[var(--green-soft)] text-[var(--green)] text-sm font-medium px-4 py-2 rounded-full">
              All current content is free during our beta
            </div>
          </div>

          <div className="landing-card p-6 text-left space-y-4">
            <div className="flex items-start gap-3">
              <Mic className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[var(--ink)]">Speech Analysis</p>
                <p className="text-sm text-[var(--ink)]/60">AI transcription and feedback on pronunciation, grammar, and coherence.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PenLine className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[var(--ink)]">Writing Feedback</p>
                <p className="text-sm text-[var(--ink)]/60">Personalized tips on grammar, vocabulary, and writing style.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[var(--ink)]">Personalized Tips</p>
                <p className="text-sm text-[var(--ink)]/60">Feedback based on your specific mistakes and weaknesses.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[var(--ink)]">Priority Access to New Content</p>
                <p className="text-sm text-[var(--ink)]/60">Be first to access new mock exams and modules as they&apos;re released.</p>
              </div>
            </div>
          </div>

          <Link
            href="/learn"
            className="inline-block bg-[var(--ink)] hover:bg-[var(--ink)]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Practice
          </Link>
        </div>
      </section>
      <LandingFooter />
    </main>
  );
}
