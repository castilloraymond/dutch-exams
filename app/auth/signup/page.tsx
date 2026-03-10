import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--cream)] px-4">
      <SignUp
        routing="hash"
        fallbackRedirectUrl="/learn"
      />
    </main>
  );
}
