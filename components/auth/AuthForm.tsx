"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthFormProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthForm({ title, description, children, footer }: AuthFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--landing-cream)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <span className="font-serif text-2xl font-semibold text-[var(--landing-navy)]">
              Inburgering Prep
            </span>
          </Link>
          <CardTitle className="text-xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {children}
          {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
