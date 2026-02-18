"use client";

import { useAuth } from "@/contexts/AuthContext";

export function usePremium() {
  const { user, loading } = useAuth();
  const isPremium = user?.user_metadata?.isPremium === true;
  return { isPremium, loading };
}
