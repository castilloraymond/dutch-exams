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
  Mail,
  Chrome,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useProgress } from "@/hooks/useProgress";
import { usePremium } from "@/hooks/usePremium";
import { Button } from "@/components/ui/button";
import { LandingFooter } from "@/components/landing/LandingFooter";
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
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { progress } = useProgress();
  const { isPremium } = usePremium();
  const [signingOut, setSigningOut] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/learn");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </main>
    );
  }

  const email = user.primaryEmailAddress?.emailAddress || "";
  const isGoogleUser = user.externalAccounts?.some(a => a.provider === "google");

  // Refund eligibility
  const premiumSince = user.publicMetadata?.premiumSince as string | undefined;
  const daysSincePurchase = premiumSince
    ? (Date.now() - new Date(premiumSince).getTime()) / (1000 * 60 * 60 * 24)
    : null;
  const daysRemaining = daysSincePurchase !== null ? Math.ceil(7 - daysSincePurchase) : 0;
  const showRefund = isPremium && premiumSince && daysRemaining > 0;

  const handleRefund = async () => {
    if (!window.confirm("Are you sure? This will revoke your Pro access and issue a full refund.")) return;
    setRefunding(true);
    try {
      const res = await fetch("/api/stripe/refund", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        window.location.reload();
      } else {
        alert(data.error || "Refund failed. Please try again.");
        setRefunding(false);
      }
    } catch {
      alert("Refund failed. Please try again.");
      setRefunding(false);
    }
  };

  // Compute progress per module
  const lezenCompleted = LEZEN_IDS.filter((id) => progress.passageProgress[id]?.completed).length;
  const knmCompleted = KNM_IDS.filter((id) => progress.passageProgress[id]?.completed).length;
  const luisterenCompleted = LUISTEREN_IDS.filter((id) => progress.passageProgress[id]?.completed).length;
  const schrijvenCompleted = SCHRIJVEN_IDS.filter((id) => progress.writingProgress?.[id]?.completedAt).length;
  const sprekenCompleted = SPREKEN_IDS.filter((id) => progress.speakingProgress?.[id]?.completedAt).length;

  const modules = [
    { name: "Lezen (Reading)", icon: BookOpen, completed: lezenCompleted, total: LEZEN_IDS.length, href: "/learn/lezen/select" },
    { name: "KNM (Dutch Society)", icon: Landmark, completed: knmCompleted, total: KNM_IDS.length, href: "/learn/knm/select" },
    { name: "Luisteren (Listening)", icon: Headphones, completed: luisterenCompleted, total: LUISTEREN_IDS.length, href: "/learn/luisteren/select" },
    { name: "Schrijven (Writing)", icon: PenLine, completed: schrijvenCompleted, total: SCHRIJVEN_IDS.length, href: "/learn/schrijven/select" },
    { name: "Spreken (Speaking)", icon: Mic, completed: sprekenCompleted, total: SPREKEN_IDS.length, href: "/learn/spreken/select" },
  ];

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This will permanently delete your account and all your progress. This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (res.ok) {
        await signOut();
        router.push("/");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete account. Please try again.");
        setDeleting(false);
      }
    } catch {
      alert("Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
      <header className="border-b border-[var(--ink)]/10 sticky top-0 bg-[var(--cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-[var(--ink)]">
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
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                <span className="text-xl font-bold text-[var(--accent)]">
                  {email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[var(--ink)]">{email}</p>
                  {isPremium && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                      Pro
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-[var(--ink)]/60">
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

          {/* Money-Back Guarantee Refund */}
          {showRefund && (
            <div className="landing-card p-6">
              <p className="text-sm text-[var(--ink)]/60 mb-1">Money-back guarantee</p>
              <p className="text-sm text-[var(--ink)] mb-4">
                {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining to request a full refund
              </p>
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={handleRefund}
                disabled={refunding}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {refunding ? "Processing refund..." : "Request Refund"}
              </Button>
            </div>
          )}

          {/* Progress Overview */}
          <div className="landing-card p-6">
            <h2 className="font-semibold text-[var(--ink)] mb-4">
              Progress Overview
            </h2>
            <div className="space-y-4">
              {modules.map((mod) => {
                const Icon = mod.icon;
                const pct = mod.total > 0 ? Math.round((mod.completed / mod.total) * 100) : 0;
                return (
                  <Link key={mod.name} href={mod.href} className="flex items-center gap-4 rounded-lg hover:bg-[var(--accent)]/5 transition-colors -mx-2 px-2 py-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[var(--ink)]">
                          {mod.name}
                        </span>
                        <span className="text-xs text-[var(--ink)]/60">
                          {mod.completed}/{mod.total}
                        </span>
                      </div>
                      <div className="h-2 bg-[var(--ink)]/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--accent)] rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </Link>
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

          {/* Danger Zone */}
          <div className="landing-card p-6 border border-red-200">
            <p className="text-sm font-semibold text-red-600 mb-1">Danger Zone</p>
            <p className="text-sm text-[var(--ink)]/60 mb-4">
              Permanently delete your account and all associated data. This cannot be undone.
            </p>
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? "Deleting account..." : "Delete My Account"}
            </Button>
          </div>
        </div>
      </section>
      <LandingFooter />
    </main>
  );
}
