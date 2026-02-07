import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Update Password",
  robots: { index: false, follow: false },
};

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
