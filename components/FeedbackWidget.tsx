"use client";

import { useState, useRef } from "react";
import { Bug, X, Send, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase-browser";

type FeedbackType = "bug" | "feedback";

const OWNER_EMAIL = "hello@passinburgering.com";

function getScrollPosition(): string {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return "0%";
  return Math.round((scrollY / docHeight) * 100) + "%";
}

function getNearestHeading(): string {
  const headings = Array.from(document.querySelectorAll("h1, h2, h3"));
  const viewportMid = window.scrollY + window.innerHeight / 2;
  let nearest = "";
  for (const el of headings) {
    const top = (el as HTMLElement).offsetTop;
    if (top <= viewportMid) {
      nearest = el.textContent?.trim() ?? "";
    }
  }
  return nearest;
}

async function captureScreenshot(): Promise<string | null> {
  try {
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(document.body, { useCORS: true, logging: false });
    return await new Promise<string | null>((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return resolve(null);
        const supabase = createClient();
        if (!supabase) return resolve(null);
        const filename = `owner/${Date.now()}.png`;
        const { error } = await supabase.storage
          .from("bug-screenshots")
          .upload(filename, blob, { contentType: "image/png" });
        if (error) return resolve(null);
        const { data } = supabase.storage.from("bug-screenshots").getPublicUrl(filename);
        resolve(data?.publicUrl ?? null);
      }, "image/png");
    });
  } catch {
    return null;
  }
}

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("bug");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { user } = useAuth();
  const isOwner = user?.email?.toLowerCase() === OWNER_EMAIL;

  const reset = () => {
    setDescription("");
    setEmail("");
    setFeedbackType("bug");
    setSubmitted(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || submitting || capturing) return;

    let ownerFields: Record<string, string | boolean | null> = {};

    if (isOwner) {
      setCapturing(true);
      const scrollPosition = getScrollPosition();
      const activeSection = getNearestHeading();
      const screenshotUrl = await captureScreenshot();
      setCapturing(false);

      ownerFields = {
        is_owner_report: true,
        email: OWNER_EMAIL,
        scroll_position: scrollPosition,
        active_section: activeSection || null,
        screenshot_url: screenshotUrl,
      };
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          page_url: window.location.href,
          feedback_type: feedbackType,
          email: isOwner ? OWNER_EMAIL : (email.trim() || undefined),
          user_agent: navigator.userAgent,
          screen_size: `${window.innerWidth}x${window.innerHeight}`,
          ...ownerFields,
        }),
      });

      if (!res.ok) throw new Error("API error");

      setSubmitted(true);
      setTimeout(handleClose, 2000);
    } catch {
      // Fallback to mailto
      const subject = encodeURIComponent(
        `[${feedbackType === "bug" ? "Bug" : "Feedback"}] passinburgering`
      );
      const body = encodeURIComponent(
        `${description}\n\nPage: ${window.location.href}\nScreen: ${window.innerWidth}x${window.innerHeight}`
      );
      window.open(`mailto:hello@passinburgering.com?subject=${subject}&body=${body}`);
      handleClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Success state */}
      {isOpen && submitted && (
        <div className="landing-card p-5 mb-3 w-80 text-center animate-in fade-in">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-[var(--ink)]">
            Thanks for your feedback!
          </p>
        </div>
      )}

      {/* Form */}
      {isOpen && !submitted && (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="landing-card p-4 mb-3 w-80 space-y-3 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[var(--ink)]">
                {isOwner ? "My Bug Report" : "Send Feedback"}
              </h3>
              {isOwner && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                  owner
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-[var(--ink)]/40 hover:text-[var(--ink)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Type toggle */}
          <div className="flex gap-1 p-0.5 bg-[var(--ink)]/5 rounded-lg">
            {(["bug", "feedback"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFeedbackType(type)}
                className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${
                  feedbackType === type
                    ? "bg-white text-[var(--ink)] shadow-sm"
                    : "text-[var(--ink)]/50 hover:text-[var(--ink)]/70"
                }`}
              >
                {type === "bug" ? "Bug Report" : "Feedback"}
              </button>
            ))}
          </div>

          {/* Page URL */}
          <p className="text-[10px] text-[var(--ink)]/40 truncate">
            Page: {typeof window !== "undefined" ? window.location.pathname : ""}
          </p>

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              feedbackType === "bug"
                ? "What went wrong? What did you expect to happen?"
                : "What would you like to see improved?"
            }
            required
            rows={3}
            className="w-full text-sm rounded-lg border border-[var(--ink)]/15 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]/50 placeholder:text-[var(--ink)]/30"
          />

          {/* Email — hidden for owner */}
          {!isOwner && (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional, for follow-up)"
              className="w-full text-sm rounded-lg border border-[var(--ink)]/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]/50 placeholder:text-[var(--ink)]/30"
            />
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!description.trim() || submitting || capturing}
            className="w-full cta-primary px-4 py-2 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-3.5 w-3.5" />
            {capturing ? "Capturing..." : submitting ? "Sending..." : "Submit"}
          </button>
        </form>
      )}

      {/* Toggle button */}
      <button
        onClick={() => (isOpen ? handleClose() : setIsOpen(true))}
        className={`ml-auto flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all hover:scale-105 ${
          isOpen
            ? "bg-[var(--ink)] text-white"
            : isOwner
            ? "bg-amber-500 text-white"
            : "bg-[var(--accent)] text-white"
        }`}
        aria-label={isOpen ? "Close feedback" : "Report a bug or give feedback"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Bug className="h-5 w-5" />}
      </button>
    </div>
  );
}
