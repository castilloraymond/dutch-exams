"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase-browser";
import { validateRedirect } from "@/lib/validate-redirect";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";

interface AuthResult {
  error?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signUp: (email: string, password: string, redirectTo?: string) => Promise<AuthResult>;
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const isConfigured = supabase !== null;

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isConfigured);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    // Get initial session
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, newSession: Session | null) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithGoogle = useCallback(async (redirectTo?: string) => {
    if (!supabase) {
      console.warn("Supabase not configured. Authentication is disabled.");
      return;
    }
    const safeRedirect = redirectTo ? validateRedirect(redirectTo) : null;
    const callbackUrl = safeRedirect
      ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(safeRedirect)}`
      : `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });
    if (error) {
      console.error("Error signing in with Google:", error.message);
      throw error;
    }
  }, [supabase]);

  const signUp = useCallback(async (email: string, password: string, redirectTo?: string): Promise<AuthResult> => {
    if (!supabase) {
      return { error: "Authentication is not configured." };
    }
    const safeRedirect = redirectTo ? validateRedirect(redirectTo) : null;
    const callbackUrl = safeRedirect
      ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(safeRedirect)}`
      : `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: callbackUrl,
      },
    });
    if (error) {
      return { error: error.message };
    }
    return {};
  }, [supabase]);

  const signInWithPassword = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) {
      return { error: "Authentication is not configured." };
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error: error.message };
    }
    return {};
  }, [supabase]);

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    if (!supabase) {
      return { error: "Authentication is not configured." };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });
    if (error) {
      return { error: error.message };
    }
    return {};
  }, [supabase]);

  const updatePassword = useCallback(async (password: string): Promise<AuthResult> => {
    if (!supabase) {
      return { error: "Authentication is not configured." };
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return { error: error.message };
    }
    return {};
  }, [supabase]);

  const refreshSession = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase.auth.refreshSession();
    if (data.session) {
      setSession(data.session);
      setUser(data.session.user);
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    if (!supabase) {
      console.warn("Supabase not configured. Authentication is disabled.");
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
    // Always clear local state regardless of signOut success
    setUser(null);
    setSession(null);
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured,
        signInWithGoogle,
        signUp,
        signInWithPassword,
        resetPassword,
        updatePassword,
        refreshSession,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
