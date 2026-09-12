"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { normalizeUsername, validateUsername } from "@/lib/usernames";

export type ClaimUsernameState = {
  error: string | null;
  success: boolean;
};

export async function claimUsernameAction(
  _prev: ClaimUsernameState,
  formData: FormData,
): Promise<ClaimUsernameState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured.", success: false };
  }

  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const displayName = String(formData.get("display_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const usernameError = validateUsername(username);

  if (usernameError) {
    return { error: usernameError, success: false };
  }

  if (displayName.length < 2) {
    return { error: "Display name must be at least 2 characters.", success: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be signed in.", success: false };
  }

  const { error } = await supabase.from("creators").insert({
    user_id: user.id,
    username,
    display_name: displayName,
    bio: bio || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "That username is taken.", success: false };
    }
    if (error.code === "23514") {
      return { error: "That username is not allowed.", success: false };
    }
    return { error: error.message, success: false };
  }

  revalidatePath("/dashboard");
  return { error: null, success: true };
}
