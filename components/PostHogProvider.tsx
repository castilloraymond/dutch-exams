"use client";
import { useEffect } from "react";
import posthog from "posthog-js";
import { useUser } from "@clerk/nextjs";
import { useConsentStatus } from "./CookieConsent";

export function PostHogProvider() {
  const consent = useConsentStatus();
  const { user } = useUser();

  useEffect(() => {
    if (consent !== "accepted") return;
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    if (!posthog.__loaded) {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
        capture_pageview: true,
        capture_pageleave: true,
        persistence: "localStorage",
        autocapture: false,
      });
    }

    if (user) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        isPremium: user.publicMetadata?.isPremium ?? false,
      });
    } else {
      posthog.reset();
    }
  }, [consent, user]);

  return null;
}
