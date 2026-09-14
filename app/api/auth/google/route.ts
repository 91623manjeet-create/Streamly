import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const cookieStore = await cookies();
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  // Fallback demo session data for Google OAuth
  const setDemoCookie = () => {
    cookieStore.set(
      "streamly_demo_session",
      JSON.stringify({
        email: "google.creator@gmail.com",
        username: "google_creator",
        displayName: "Google Creator",
      }),
      { path: "/", maxAge: 60 * 60 * 24 * 30 }
    );
  };

  if (!isSupabaseConfigured()) {
    setDemoCookie();
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error || !data?.url) {
      console.warn("Supabase Google OAuth fallback triggered:", error?.message);
      setDemoCookie();
      return NextResponse.redirect(`${origin}/dashboard`);
    }

    // Native HTTP redirect to Google OAuth Consent screen
    return NextResponse.redirect(data.url);
  } catch (err: unknown) {
    console.error("Google Auth Route Error:", err);
    setDemoCookie();
    return NextResponse.redirect(`${origin}/dashboard`);
  }
}

export async function POST() {
  return GET();
}
