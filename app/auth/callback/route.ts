import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "localhost:3000";
  const proto = request.headers.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  const cookieStore = await cookies();

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch {
      // fallback to demo cookie
    }
  }

  // Fallback demo session if code exchange fails or is invalid
  cookieStore.set(
    "streamly_demo_session",
    JSON.stringify({
      email: "google.creator@gmail.com",
      username: "google_creator",
      displayName: "Google Creator",
    }),
    { path: "/", maxAge: 60 * 60 * 24 * 30 }
  );

  return NextResponse.redirect(`${origin}${next}`);
}
