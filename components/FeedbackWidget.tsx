"use client";

import { useState, useRef } from "react";
import { Bug, X, Send, CheckCircle } from "lucide-react";

type FeedbackType = "bug" | "feedback";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("bug");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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
    if (!description.trim() || submitting) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          page_url: window.location.href,
          feedback_type: feedbackType,
          email: email.trim() || undefined,
          user_agent: navigator.userAgent,
          screen_size: `${window.innerWidth}x${window.innerHeight}`,
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
            <h3 className="text-sm font-semibold text-[var(--ink)]">
              Send Feedback
            </h3>
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

          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional, for follow-up)"
            className="w-full text-sm rounded-lg border border-[var(--ink)]/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]/50 placeholder:text-[var(--ink)]/30"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={!description.trim() || submitting}
            className="w-full cta-primary px-4 py-2 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-3.5 w-3.5" />
            {submitting ? "Sending..." : "Submit"}
          </button>
        </form>
      )}

      {/* Toggle button */}
      <button
        onClick={() => (isOpen ? handleClose() : setIsOpen(true))}
        className={`ml-auto flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all hover:scale-105 ${
          isOpen
            ? "bg-[var(--ink)] text-white"
            : "bg-[var(--accent)] text-white"
        }`}
        aria-label={isOpen ? "Close feedback" : "Report a bug or give feedback"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Bug className="h-5 w-5" />}
      </button>
    </div>
  );
}
