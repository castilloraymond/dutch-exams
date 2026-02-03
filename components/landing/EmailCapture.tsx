"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface EmailCaptureProps {
    variant?: "hero" | "footer";
    className?: string;
}

export function EmailCapture({ className = "" }: EmailCaptureProps) {
    const router = useRouter();
    const { user } = useAuth();

    // If user is already logged in, redirect to learn
    if (user) {
        router.push("/learn");
        return null;
    }

    return (
        <div className={`font-sans-landing ${className}`}>
            <div className="flex flex-col items-center gap-4">
                <Link
                    href="/try"
                    className="cta-primary px-8 py-4 text-white rounded-full font-semibold cursor-pointer whitespace-nowrap shadow-lg hover:shadow-xl transition-shadow text-lg"
                >
                    Start Free Practice
                </Link>
                <p className="text-sm text-[var(--landing-navy)]/50">
                    No signup required — see your readiness score in 3 minutes
                </p>
            </div>
        </div>
    );
}
