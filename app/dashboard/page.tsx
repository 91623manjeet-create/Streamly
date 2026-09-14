import { cookies, headers } from "next/headers";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("streamly_demo_session");
  let demoUser: { email: string; username: string; displayName: string } | null = null;

  if (demoCookie?.value) {
    try {
      demoUser = JSON.parse(demoCookie.value);
    } catch {
      // ignore
    }
  }

  let userEmail = demoUser?.email ?? "";
  let username = demoUser?.username ?? "demo";
  let displayName = demoUser?.displayName ?? "Demo Creator";
  let widgetShape: "rectangle" | "square" | "capsule" = "rectangle";
  let tips: { id: string; amount: number; supporter_name: string; message: string | null; created_at: string }[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userEmail = user.email ?? userEmail;
        const { data: creator } = await supabase
          .from("creators")
          .select("id, username, display_name, widget_shape")
          .eq("user_id", user.id)
          .maybeSingle();

        if (creator) {
          username = creator.username;
          displayName = creator.display_name;
          widgetShape = (creator.widget_shape as "rectangle" | "square" | "capsule") ?? "rectangle";

          const { data: allTips } = await supabase
            .from("tips")
            .select("id, amount, supporter_name, message, created_at")
            .eq("creator_id", creator.id)
            .eq("status", "completed")
            .order("created_at", { ascending: false });

          if (allTips) tips = allTips;
        }
      }
    } catch {
      // fallback to demo data
    }
  }

  // If no email from Supabase and no demo session cookie, default to demo session
  if (!userEmail) {
    userEmail = "demo@streamly.app";
    username = "demo";
    displayName = "Demo Creator";
  }

  // Fallback demo tips if tips array is empty
  if (tips.length === 0) {
    const now = new Date();
    tips = [
      {
        id: "tip-demo-1",
        amount: 500,
        supporter_name: "Neha K.",
        message: "That clutch round was insane! 🏆",
        created_at: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
      },
      {
        id: "tip-demo-2",
        amount: 250,
        supporter_name: "Rohit S.",
        message: "Love the new stream overlay layout! 🔥",
        created_at: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      },
      {
        id: "tip-demo-3",
        amount: 1000,
        supporter_name: "Aman M.",
        message: "Diamond tier supporter alert test! 💎",
        created_at: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
      },
    ];
  }

  // ── Compute stats ──────────────────────────────────────────
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayTips = tips.filter((t) => t.created_at.slice(0, 10) === todayStr);

  const total = tips.reduce((s, t) => s + Number(t.amount), 0);
  const todayTotal = todayTips.reduce((s, t) => s + Number(t.amount), 0);
  const avgTip = tips.length > 0 ? Math.round(total / tips.length) : 0;
  const uniqueSupporters = new Set(tips.map((t) => t.supporter_name?.toLowerCase() ?? "anon")).size;

  const recentTips = tips.slice(0, 10).map((t) => ({
    id: t.id,
    supporter_name: t.supporter_name ?? "Anonymous",
    amount: Number(t.amount),
    message: t.message ?? null,
    timeAgo: relativeTime(t.created_at),
  }));

  // ── Origin for URLs ────────────────────────────────────────
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  const origin = `${proto}://${host}`;

  return (
    <DashboardShell email={userEmail}>
      <DashboardView
        email={userEmail}
        username={username}
        displayName={displayName}
        initialShape={widgetShape}
        origin={origin}
        stats={{
          total,
          today: todayTotal,
          todayCount: todayTips.length,
          supporters: uniqueSupporters,
          avgTip,
          totalCount: tips.length,
        }}
        recentTips={recentTips}
      />
    </DashboardShell>
  );
}
