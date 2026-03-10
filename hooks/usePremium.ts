"use client";

import { useUser } from "@clerk/nextjs";

export function usePremium() {
  const { user, isLoaded } = useUser();
  const isPremium = !!user?.publicMetadata?.isPremium;
  return { isPremium, loading: !isLoaded };
}
