"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

interface EmailCaptureProps {
    variant?: "hero" | "footer";
    className?: string;
}

export function EmailCapture({ variant = "hero", className = "" }: EmailCaptureProps) {
    const router = useRouter();
    const { user, isConfigured } = useAuth();

    // If user is already logged in, redirect to learn
    if (user) {
        router.push("/learn");
        return null;
    }

    return (
        <div className={`font-sans-landing ${className}`}>
            <div className="flex flex-col items-center gap-4">
                {isConfigured ? (
                    <GoogleSignInButton className="shadow-lg">
                        Start Free Practice
                    </GoogleSignInButton>
                ) : (
                    <Link
                        href="/learn"
                        className="cta-primary px-8 py-4 text-white rounded-full font-medium shadow-lg"
                    >
                        Start Free Practice
                    </Link>
                )}

                <p className="text-sm text-[var(--landing-navy)]/40">
                    15-minute free trial • No credit card required
                </p>
            </div>
        </div>
    );
}
