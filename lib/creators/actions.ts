"use server";

import { cookies } from "next/headers";
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

  const cookieStore = await cookies();

  // Read existing demo session if any
  const existingCookie = cookieStore.get("streamly_demo_session");
  let userEmail = "creator@domain.com";

  if (existingCookie?.value) {
    try {
      const parsed = JSON.parse(existingCookie.value);
      if (parsed.email) userEmail = parsed.email;
    } catch {
      // ignore
    }
  }

  // Update session cookie with claimed username & display name
  cookieStore.set(
    "streamly_demo_session",
    JSON.stringify({
      email: userEmail,
      username,
      displayName,
      bio,
    }),
    { path: "/", maxAge: 60 * 60 * 24 * 30 }
  );

  // If Supabase is active, persist to database as well
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("creators").insert({
          user_id: user.id,
          username,
          display_name: displayName,
          bio: bio || null,
        });

        if (error) {
          if (error.code === "23505") {
            return { error: "That username is already taken. Please try another.", success: false };
          }
          if (error.code === "23514") {
            return { error: "That username is not allowed.", success: false };
          }
        }
      }
    } catch {
      // fallback to cookie session
    }
  }

  revalidatePath("/dashboard");
  return { error: null, success: true };
}
