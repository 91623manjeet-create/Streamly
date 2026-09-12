import { isSupabaseConfigured } from "@/lib/env";

/**
 * Demo mode is allowed only in non-production when Supabase is not configured.
 * Production must never fall back to mock creator data.
 */
export function isDemoMode(): boolean {
  return process.env.NODE_ENV !== "production" && !isSupabaseConfigured();
}

export const DEMO_USERNAME = "demo";
