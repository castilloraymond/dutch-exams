"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "./AuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UpdatePasswordForm() {
  const router = useRouter();
  const { updatePassword, isConfigured, user } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

    const result = await updatePassword(password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/learn");
    }
  };

  if (!isConfigured) {
    return (
      <AuthForm
        title="Update Password"
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

  if (!user) {
    return (
      <AuthForm
        title="Update Password"
        description="Session expired"
        footer={
          <Link href="/auth/reset-password" className="text-primary hover:underline">
            Request a new reset link
          </Link>
        }
      >
        <p className="text-muted-foreground text-sm text-center">
          Your password reset session has expired. Please request a new reset link.
        </p>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Update Password"
      description="Enter your new password"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
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
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </AuthForm>
  );
}
