import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
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
  return NextResponse.json({ success: true, redirectTo: "/dashboard" });
}
