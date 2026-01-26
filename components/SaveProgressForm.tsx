"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Loader2, Check } from "lucide-react";

interface SaveProgressFormProps {
  currentEmail?: string;
  onSave: (email: string) => Promise<void>;
}

export function SaveProgressForm({
  currentEmail,
  onSave,
}: SaveProgressFormProps) {
  const [email, setEmail] = useState(currentEmail || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await onSave(email);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      setError("Failed to save progress. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Cloud className="h-4 w-4" />
          Save Progress to Cloud
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Enter your email to back up your progress. Use the same email to
            restore it on any device.
          </p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <Button type="submit" disabled={isLoading || !email.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSaved ? (
                <Check className="h-4 w-4" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {isSaved && (
            <p className="text-sm text-green-600">Progress saved!</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
