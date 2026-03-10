import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// Browser client for Supabase Storage uploads (e.g., bug screenshots)
// Returns null if Supabase credentials are not configured
export function createClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === "https://your-project.supabase.co") {
    return null;
  }

  return createSupabaseClient(url, key);
}
