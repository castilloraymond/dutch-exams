"use client";

import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface DutchLanguageBannerProps {
  onContinue: () => void;
  onGoBack: () => void;
}

const BANNER_DISMISSED_KEY = "dutch_banner_dismissed";

export function DutchLanguageBanner({ onContinue, onGoBack }: DutchLanguageBannerProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if banner was already dismissed this session
    const dismissed = sessionStorage.getItem(BANNER_DISMISSED_KEY);
    if (!dismissed) {
      setShow(true);
    } else {
      onContinue();
    }
  }, [onContinue]);

  const handleContinue = () => {
    sessionStorage.setItem(BANNER_DISMISSED_KEY, "true");
    setShow(false);
    onContinue();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--landing-navy)]/90 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header with Dutch flag colors */}
        <div className="h-2 flex">
          <div className="flex-1 bg-[#AE1C28]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#21468B]" />
        </div>

        <div className="p-6 sm:p-8 text-center space-y-6">
          {/* Warning Icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--landing-orange)]/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-[var(--landing-orange)]" />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-xl font-bold font-serif text-[var(--landing-navy)] mb-3">
              Let op!
            </h2>
            <p className="text-[var(--landing-navy)]/70 leading-relaxed">
              De volgende oefeningen zijn volledig in het Nederlands.
            </p>
            <p className="text-[var(--landing-navy)]/50 text-sm mt-2">
              The following exercises will be entirely in Dutch.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onGoBack}
              className="flex-1 py-3 px-6 rounded-lg border-2 border-[var(--landing-navy)]/20 text-[var(--landing-navy)] font-medium hover:border-[var(--landing-navy)]/40 transition-colors cursor-pointer"
            >
              Terug / Go Back
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 cta-primary py-3 px-6 rounded-lg cursor-pointer"
            >
              Doorgaan / Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to check if banner should be shown
export function useDutchBannerState() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(BANNER_DISMISSED_KEY);
    setShouldShow(!dismissed);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(BANNER_DISMISSED_KEY, "true");
    setShouldShow(false);
  };

  const reset = () => {
    sessionStorage.removeItem(BANNER_DISMISSED_KEY);
    setShouldShow(true);
  };

  return { shouldShow, dismiss, reset };
}
