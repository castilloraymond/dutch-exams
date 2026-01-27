"use client";

import { useState } from "react";

interface EmailCaptureProps {
    variant?: "hero" | "footer";
    className?: string;
}

export function EmailCapture({ variant = "hero", className = "" }: EmailCaptureProps) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return;

        setStatus("loading");

        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage(data.message);
                setEmail("");
            } else {
                setStatus("error");
                setMessage(data.error || "Something went wrong");
            }
        } catch {
            setStatus("error");
            setMessage("Failed to connect. Please try again.");
        }
    };

    if (status === "success") {
        return (
            <div className={`font-sans-landing text-center ${className}`}>
                <div className="inline-flex items-center gap-2 px-6 py-4 bg-[var(--landing-green)]/10 text-[var(--landing-green)] rounded-xl font-medium">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {message}
                </div>
            </div>
        );
    }

    const isHero = variant === "hero";

    return (
        <form onSubmit={handleSubmit} className={`font-sans-landing ${className}`}>
            <div className={`inline-flex flex-col sm:flex-row gap-0 p-1.5 bg-white rounded-full shadow-lg border border-gray-100`}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={status === "loading"}
                    className={`px-6 py-4 rounded-full bg-transparent text-[var(--landing-navy)] placeholder-gray-400 focus:outline-none min-w-[280px] disabled:opacity-50`}
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="cta-primary px-8 py-4 text-white rounded-full font-medium whitespace-nowrap disabled:opacity-50"
                >
                    {status === "loading" ? "Signing up..." : "Start Free Practice"}
                </button>
            </div>

            {status === "error" && (
                <p className="text-sm text-[var(--landing-red)] mt-3">{message}</p>
            )}

            {status === "idle" && (
                <p className="text-sm text-[var(--landing-navy)]/40 mt-4">
                    15-minute free trial • No credit card required
                </p>
            )}
        </form>
    );
}
