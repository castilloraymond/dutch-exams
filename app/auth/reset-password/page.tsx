import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Reset Password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  // Clerk handles password reset within the SignIn component
  redirect("/auth/login");
}
