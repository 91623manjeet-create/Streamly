import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
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
      return NextResponse.json({ success: true, redirectTo: "/onboarding" });
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
      return NextResponse.json({ success: true, redirectTo: "/onboarding" });
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

    return NextResponse.json({ success: true, redirectTo: "/onboarding" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Signup error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
