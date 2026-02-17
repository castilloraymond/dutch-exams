"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "cookie-consent";

export type ConsentStatus = "accepted" | "declined" | null;

export function getConsentStatus(): ConsentStatus {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (value === "accepted" || value === "declined") return value;
  return null;
}

function subscribeToConsent(callback: () => void) {
  window.addEventListener("cookie-consent-changed", callback);
  return () => window.removeEventListener("cookie-consent-changed", callback);
}

function getServerSnapshot(): ConsentStatus {
  return null;
}

export function useConsentStatus(): ConsentStatus {
  return useSyncExternalStore(subscribeToConsent, getConsentStatus, getServerSnapshot);
}

export function CookieConsent() {
  const status = useConsentStatus();

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  // Don't show if user already made a choice (or during SSR)
  if (status !== null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-[var(--cream-dark)] shadow-lg">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <p className="text-sm text-[var(--ink-soft)] flex-1">
          We use cookies for analytics to improve your experience.
          See our{" "}
          <Link href="/privacy" className="text-[var(--accent)] hover:underline">
            privacy policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-[var(--ink-soft)] bg-[var(--cream-dark)] rounded-lg hover:bg-[var(--cream)] transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-[var(--accent)] rounded-lg hover:bg-[var(--accent-glow)] transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
