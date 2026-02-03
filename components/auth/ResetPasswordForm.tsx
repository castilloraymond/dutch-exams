"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "./AuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const { resetPassword, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await resetPassword(email);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <AuthForm
        title="Reset Password"
        description="Authentication is not configured"
        footer={
          <Link href="/learn" className="text-primary hover:underline">
            Continue without signing in
          </Link>
        }
      >
        <p className="text-muted-foreground text-sm text-center">
          Supabase credentials are not set up. You can still use the app with local storage.
        </p>
      </AuthForm>
    );
  }

  if (success) {
    return (
      <AuthForm
        title="Check Your Email"
        description="We sent you a password reset link"
      >
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-sm">
            We&apos;ve sent a password reset link to <strong>{email}</strong>.
            Please click the link in the email to reset your password.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Back to Sign In</Link>
          </Button>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Reset Password"
      description="Enter your email to receive a reset link"
      footer={
        <>
          Remember your password?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </AuthForm>
  );
}
