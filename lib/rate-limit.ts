import { createServerSupabaseClient } from "@/lib/supabase-server";

// ---------------------------------------------------------------------------
// Supabase-backed rate limiter for distributed (multi-instance) environments.
// Falls back to in-memory if Supabase is not configured (local dev).
//
// Required Supabase migration (run once in your Supabase SQL editor):
//   CREATE TABLE rate_limits (
//     key      TEXT    PRIMARY KEY,
//     count    INT     NOT NULL DEFAULT 1,
//     reset_at BIGINT  NOT NULL
//   );
// ---------------------------------------------------------------------------

// In-memory fallback store
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryStore) {
    if (now > entry.resetAt) {
      memoryStore.delete(key);
    }
  }
}, 60_000);

/**
 * Rate limiter. Returns whether the request is allowed.
 * @param key       Unique identifier (e.g. "tts:1.2.3.4" or "progress:user@email.com")
 * @param limit     Max requests allowed in the window
 * @param windowMs  Time window in milliseconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfterMs: number }> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return rateLimitMemory(key, limit, windowMs);
  }

  const now = Date.now();

  const { data, error } = await supabase
    .from("rate_limits")
    .select("count, reset_at")
    .eq("key", key)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = row not found — other errors mean DB unavailable, fail open
    console.error("Rate limit DB error:", error.message);
    return { allowed: true, retryAfterMs: 0 };
  }

  if (!data || now > (data.reset_at as number)) {
    // New window — reset the counter
    await supabase
      .from("rate_limits")
      .upsert({ key, count: 1, reset_at: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if ((data.count as number) >= limit) {
    return { allowed: false, retryAfterMs: (data.reset_at as number) - now };
  }

  await supabase
    .from("rate_limits")
    .update({ count: (data.count as number) + 1 })
    .eq("key", key);

  return { allowed: true, retryAfterMs: 0 };
}

function rateLimitMemory(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= limit) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true, retryAfterMs: 0 };
}
