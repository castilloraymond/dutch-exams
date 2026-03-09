import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Log In",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--cream)] px-4">
      <SignIn
        routing="hash"
        fallbackRedirectUrl="/learn"
      />
    </main>
  );
}
