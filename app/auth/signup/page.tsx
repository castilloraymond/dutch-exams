import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
