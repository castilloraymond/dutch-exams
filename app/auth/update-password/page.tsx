import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Update Password",
  robots: { index: false, follow: false },
};

export default function UpdatePasswordPage() {
  // Clerk handles password update within the SignIn component
  redirect("/auth/login");
}
