"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Landmark,
  Headphones,
  PenLine,
  Mic,
  LogOut,
  KeyRound,
  Mail,
  Chrome,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";
import {
  getContentIndex,
  getKNMIndex,
  getListeningIndex,
  getWritingIndex,
  getSpeakingIndex,
} from "@/lib/content";

const LEZEN_IDS = getContentIndex().passages.map((p) => p.id);
const KNM_IDS = getKNMIndex().topics.map((t) => t.id);
const LUISTEREN_IDS = getListeningIndex().exercises.map((e) => e.id);
const SCHRIJVEN_IDS = getWritingIndex().tasks.map((t) => t.id);
const SPREKEN_IDS = getSpeakingIndex().tasks.map((t) => t.id);

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, isConfigured, resetPassword, signOut } = useAuth();
  const { progress } = useProgress();
  const [resetStatus, setResetStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--landing-cream)]">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--landing-orange)] border-t-transparent animate-spin" />
      </main>
    );
  }

  const email = user.email || "";
  const isGoogleUser = user.app_metadata?.provider === "google";

  // Compute progress per module
  const lezenCompleted = LEZEN_IDS.filter((id) => progress.passageProgress[id]?.completed).length;
  const knmCompleted = KNM_IDS.filter((id) => progress.passageProgress[id]?.completed).length;
  const luisterenCompleted = LUISTEREN_IDS.filter((id) => progress.passageProgress[id]?.completed).length;
  const schrijvenCompleted = SCHRIJVEN_IDS.filter((id) => progress.writingProgress?.[id]?.completedAt).length;
  const sprekenCompleted = SPREKEN_IDS.filter((id) => progress.speakingProgress?.[id]?.completedAt).length;

  const modules = [
    { name: "Lezen (Reading)", icon: BookOpen, completed: lezenCompleted, total: LEZEN_IDS.length },
    { name: "KNM (Dutch Society)", icon: Landmark, completed: knmCompleted, total: KNM_IDS.length },
    { name: "Luisteren (Listening)", icon: Headphones, completed: luisterenCompleted, total: LUISTEREN_IDS.length },
    { name: "Schrijven (Writing)", icon: PenLine, completed: schrijvenCompleted, total: SCHRIJVEN_IDS.length },
    { name: "Spreken (Speaking)", icon: Mic, completed: sprekenCompleted, total: SPREKEN_IDS.length },
  ];

  const handleResetPassword = async () => {
    setResetStatus("sending");
    const result = await resetPassword(email);
    setResetStatus(result.error ? "error" : "sent");
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.push("/");
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--landing-cream)]">
      <header className="border-b border-[var(--landing-navy)]/10 sticky top-0 bg-[var(--landing-cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold font-sans-landing text-[var(--landing-navy)]">
              Profile
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Account Info */}
          <div className="landing-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[var(--landing-orange)]/10 flex items-center justify-center">
                <span className="text-xl font-bold text-[var(--landing-orange)]">
                  {email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-[var(--landing-navy)]">{email}</p>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-[var(--landing-navy)]/60">
                  {isGoogleUser ? (
                    <>
                      <Chrome className="h-3.5 w-3.5" />
                      <span>Google account</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-3.5 w-3.5" />
                      <span>Email account</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reset Password (email users only) */}
          {!isGoogleUser && (
            <div className="landing-card p-6">
              <h2 className="font-semibold text-[var(--landing-navy)] mb-3 flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-[var(--landing-orange)]" />
                Password
              </h2>
              {resetStatus === "sent" ? (
                <p className="text-sm text-green-700">
                  Password reset email sent! Check your inbox.
                </p>
              ) : resetStatus === "error" ? (
                <p className="text-sm text-red-600">
                  Failed to send reset email. Please try again.
                </p>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleResetPassword}
                  disabled={resetStatus === "sending"}
                >
                  {resetStatus === "sending" ? "Sending..." : "Send Password Reset Email"}
                </Button>
              )}
            </div>
          )}

          {/* Progress Overview */}
          <div className="landing-card p-6">
            <h2 className="font-semibold text-[var(--landing-navy)] mb-4">
              Progress Overview
            </h2>
            <div className="space-y-4">
              {modules.map((mod) => {
                const Icon = mod.icon;
                const pct = mod.total > 0 ? Math.round((mod.completed / mod.total) * 100) : 0;
                return (
                  <div key={mod.name} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--landing-orange)]/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-[var(--landing-orange)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[var(--landing-navy)]">
                          {mod.name}
                        </span>
                        <span className="text-xs text-[var(--landing-navy)]/60">
                          {mod.completed}/{mod.total}
                        </span>
                      </div>
                      <div className="h-2 bg-[var(--landing-navy)]/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--landing-orange)] rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sign Out */}
          <div className="landing-card p-6">
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {signingOut ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
