import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Reset Password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
