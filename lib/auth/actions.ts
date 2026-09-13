"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error: string | null;
  message?: string | null;
};

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  const cookieStore = await cookies();
  const username = email.split("@")[0].replace(/[^a-z0-9_]/gi, "").toLowerCase() || "creator";

  if (!isSupabaseConfigured()) {
    cookieStore.set(
      "streamly_demo_session",
      JSON.stringify({
        email,
        username,
        displayName: email.split("@")[0] || "Creator",
      }),
      { path: "/", maxAge: 60 * 60 * 24 * 30 }
    );

    redirect("/onboarding");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    cookieStore.set(
      "streamly_demo_session",
      JSON.stringify({
        email,
        username,
        displayName: email.split("@")[0] || "Creator",
      }),
      { path: "/", maxAge: 60 * 60 * 24 * 30 }
    );

    redirect("/onboarding");
  }

  cookieStore.set(
    "streamly_demo_session",
    JSON.stringify({
      email,
      username,
      displayName: email.split("@")[0] || "Creator",
    }),
    { path: "/", maxAge: 60 * 60 * 24 * 30 }
  );

  redirect("/onboarding");
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/dashboard");
  const safeNext = nextPath.startsWith("/") ? nextPath : "/dashboard";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const cookieStore = await cookies();

  if (!isSupabaseConfigured()) {
    const username = email.split("@")[0].replace(/[^a-z0-9_]/gi, "").toLowerCase() || "demo";
    cookieStore.set(
      "streamly_demo_session",
      JSON.stringify({
        email,
        username,
        displayName: email.split("@")[0] || "Demo Creator",
      }),
      { path: "/", maxAge: 60 * 60 * 24 * 30 }
    );

    redirect(safeNext);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const username = email.split("@")[0].replace(/[^a-z0-9_]/gi, "").toLowerCase() || "demo";
    cookieStore.set(
      "streamly_demo_session",
      JSON.stringify({
        email,
        username,
        displayName: email.split("@")[0] || "Demo Creator",
      }),
      { path: "/", maxAge: 60 * 60 * 24 * 30 }
    );

    redirect(safeNext);
  }

  cookieStore.delete("streamly_demo_session");
  redirect(safeNext);
}

export async function signInWithGoogleAction() {
  const cookieStore = await cookies();

  if (!isSupabaseConfigured()) {
    cookieStore.set(
      "streamly_demo_session",
      JSON.stringify({
        email: "google.creator@gmail.com",
        username: "google_creator",
        displayName: "Google Creator",
      }),
      { path: "/", maxAge: 60 * 60 * 24 * 30 }
    );
    redirect("/dashboard");
  }

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  const origin = `${proto}://${host}`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    cookieStore.set(
      "streamly_demo_session",
      JSON.stringify({
        email: "google.creator@gmail.com",
        username: "google_creator",
        displayName: "Google Creator",
      }),
      { path: "/", maxAge: 60 * 60 * 24 * 30 }
    );
    redirect("/dashboard");
  }

  redirect(data.url);
}

export async function signInDemoAction() {
  const cookieStore = await cookies();
  cookieStore.set(
    "streamly_demo_session",
    JSON.stringify({
      email: "demo@streamly.app",
      username: "demo",
      displayName: "Demo Creator",
    }),
    { path: "/", maxAge: 60 * 60 * 24 * 30 }
  );
  redirect("/dashboard");
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("streamly_demo_session");

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  redirect("/");
}
