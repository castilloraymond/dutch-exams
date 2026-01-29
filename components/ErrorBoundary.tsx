"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackHref?: string;
  fallbackLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallbackHref = "/learn", fallbackLabel = "Terug naar modules" } = this.props;

      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--landing-cream)] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-8 text-center space-y-5">
            {/* Error Icon */}
            <div className="w-14 h-14 mx-auto rounded-full bg-[var(--landing-red)]/10 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-[var(--landing-red)]" />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-lg font-bold font-serif text-[var(--landing-navy)] mb-2">
                Er is iets misgegaan
              </h2>
              <p className="text-[var(--landing-navy)]/70 text-sm">
                Er is een fout opgetreden. Probeer de pagina te vernieuwen.
              </p>
              <p className="text-[var(--landing-navy)]/50 text-xs mt-1">
                Something went wrong. Please try refreshing the page.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRefresh}
                className="flex-1 py-3 px-4 rounded-lg bg-[var(--landing-orange)] text-white font-medium hover:bg-[var(--landing-orange)]/90 transition-colors cursor-pointer"
              >
                Vernieuwen / Refresh
              </button>
              <Link
                href={fallbackHref}
                className="flex-1 py-3 px-4 rounded-lg border-2 border-[var(--landing-navy)]/20 text-[var(--landing-navy)] font-medium hover:border-[var(--landing-navy)]/40 transition-colors text-center"
              >
                {fallbackLabel}
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
