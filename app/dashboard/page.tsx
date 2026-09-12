import { redirect } from "next/navigation";
import { headers } from "next/headers";
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
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");

  const { data: creator } = await supabase
    .from("creators")
    .select("id, username, display_name, widget_shape")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!creator) redirect("/onboarding");

  // ── Real tip data ──────────────────────────────────────────
  const { data: allTips } = await supabase
    .from("tips")
    .select("id, amount, supporter_name, message, created_at")
    .eq("creator_id", creator.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  const tips = allTips ?? [];

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
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  return (
    <DashboardShell email={user.email ?? ""}>
      <DashboardView
        email={user.email ?? ""}
        username={creator.username}
        displayName={creator.display_name}
        initialShape={(creator.widget_shape as "rectangle" | "square" | "capsule") ?? "rectangle"}
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
