"use client";

import { useState } from "react";
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
    const [email, setEmail] = useState("");

    // If user is already logged in, redirect to learn
    if (user) {
        router.push("/learn");
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder: just redirect to /learn for now (Supabase storage to be added later)
        router.push("/learn");
    };

    return (
        <div className={`font-sans-landing ${className}`}>
            <div className="flex flex-col items-center gap-4">
                {isConfigured ? (
                    <GoogleSignInButton className="shadow-lg cursor-pointer">
                        Start Free Practice
                    </GoogleSignInButton>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full max-w-lg">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl sm:rounded-full shadow-lg border border-[var(--landing-navy)]/10 p-1.5 sm:pl-6">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 bg-transparent border-none outline-none text-[var(--landing-navy)] placeholder:text-[var(--landing-navy)]/40 text-base py-3 px-4 sm:px-0 sm:py-2"
                                required
                            />
                            <button
                                type="submit"
                                className="cta-primary px-6 py-3.5 text-white rounded-xl sm:rounded-full font-semibold cursor-pointer whitespace-nowrap"
                            >
                                Start Free Practice
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
