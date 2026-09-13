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

function buildDynamicCreator(username: string): PublicCreator {
  if (username === "demo") return demoCreator;

  const formattedName =
    username.charAt(0).toUpperCase() + username.slice(1).replace(/[-_]/g, " ");

  return {
    id: `creator-${username}`,
    username,
    display_name: formattedName,
    avatar: null,
    bio: `Live streamer & content creator. Support @${username} on Streamly!`,
    widget_shape: "rectangle",
    is_active: true,
  };
}

export async function loadPublicCreator(rawUsername: string): Promise<CreatorLoadResult> {
  const username = normalizeUsername(rawUsername);

  if (!username) {
    return { status: "not_found" };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("creators")
        .select("id, username, display_name, avatar, bio, widget_shape, is_active")
        .eq("username", username)
        .maybeSingle();

      if (error) {
        console.warn("Supabase loadPublicCreator error, falling back:", error.message);
        return { status: "ok", creator: buildDynamicCreator(username) };
      }

      if (data) {
        const creator = data as PublicCreator;
        if (!creator.is_active) {
          return { status: "inactive", creator };
        }
        return { status: "ok", creator };
      }

      // If creator is not yet in Supabase table, return dynamic fallback creator
      return { status: "ok", creator: buildDynamicCreator(username) };
    } catch (err: unknown) {
      console.warn("Supabase query exception, falling back:", err);
      return { status: "ok", creator: buildDynamicCreator(username) };
    }
  }

  // Fallback when Supabase is pending configuration
  return { status: "ok", creator: buildDynamicCreator(username) };
}
