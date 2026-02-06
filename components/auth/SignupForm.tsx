"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "./AuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export function SignupForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { signUp, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const result = await signUp(email, password, redirect || undefined);

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
        title="Create Account"
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
        description="We sent you a confirmation link"
      >
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-sm">
            We&apos;ve sent a confirmation email to <strong>{email}</strong>.
            Please click the link in the email to verify your account.
          </p>
          {redirect && (
            <p className="text-muted-foreground text-xs">
              After confirming, you&apos;ll be redirected back to your results.
            </p>
          )}
          <Button asChild variant="outline" className="w-full">
            <Link href={redirect ? `/auth/login?redirect=${encodeURIComponent(redirect)}` : "/auth/login"}>Back to Sign In</Link>
          </Button>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Create Account"
      description="Sign up to track your progress across devices"
      footer={
        <>
          Already have an account?{" "}
          <Link href={redirect ? `/auth/login?redirect=${encodeURIComponent(redirect)}` : "/auth/login"} className="text-primary hover:underline">
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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <GoogleSignInButton className="w-full" redirectTo={redirect || undefined} />
      </form>
    </AuthForm>
  );
}
