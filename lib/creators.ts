import { DEMO_USERNAME, isDemoMode } from "@/lib/demo";
import { isSupabaseConfigured } from "@/lib/env";
import { demoCreator } from "@/lib/mock/dashboard";
import { createClient } from "@/lib/supabase/server";
import { normalizeUsername } from "@/lib/usernames";
import type { PublicCreator } from "@/types/database";

export type CreatorLoadResult =
  | { status: "demo"; creator: PublicCreator }
  | { status: "ok"; creator: PublicCreator }
  | { status: "inactive"; creator: PublicCreator }
  | { status: "not_found" }
  | { status: "error"; message: string };

export async function loadPublicCreator(rawUsername: string): Promise<CreatorLoadResult> {
  const username = normalizeUsername(rawUsername);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("creators")
        .select("id, username, display_name, avatar, bio, widget_shape, is_active")
        .eq("username", username)
        .maybeSingle();

      if (error) {
        return { status: "error", message: error.message };
      }

      if (!data) {
        return { status: "not_found" };
      }

      const creator = data as PublicCreator;
      if (!creator.is_active) {
        return { status: "inactive", creator };
      }

      return { status: "ok", creator };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load creator.";
      return { status: "error", message };
    }
  }

  if (isDemoMode() && username === DEMO_USERNAME) {
    return { status: "demo", creator: demoCreator };
  }

  return { status: "not_found" };
}
