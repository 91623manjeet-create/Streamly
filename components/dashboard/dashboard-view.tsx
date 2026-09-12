import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  AlertPipelinePanel,
  DashboardLinks,
  OverlaySettingsPanel,
  SettingsPreview,
  TestAlertPanel,
} from "@/components/dashboard/dashboard-panels";
import { RecentTipsModerated } from "@/components/dashboard/recent-tips-moderated";

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function greet(displayName: string) {
  const h = new Date().getHours();
  const time = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return `${time}, ${displayName}.`;
}

interface RecentTip {
  id: string;
  supporter_name: string;
  amount: number;
  message: string | null;
  timeAgo: string;
}

interface Stats {
  total: number;
  today: number;
  todayCount: number;
  supporters: number;
  avgTip: number;
  totalCount: number;
}

export async function DashboardView({
  email,
  username,
  displayName,
  initialShape = "rectangle",
  origin,
  stats,
  recentTips,
}: {
  email: string;
  username: string;
  displayName: string;
  initialShape?: "rectangle" | "square" | "capsule";
  origin: string;
  stats: Stats;
  recentTips: RecentTip[];
}) {
  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232326] pb-6">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-[#F4F4F5]">{greet(displayName)}</h1>
          <p className="mt-1 text-xs text-[#A1A1AA]">
            Here&apos;s what&apos;s happening with your Streamly account ({email}).
          </p>
        </div>
        <Badge variant="amber">● OVERLAY ACTIVE</Badge>
      </div>

      {/* 4 Metric Cards — real data */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Total Earned</p>
          <p className="mt-1.5 font-sans text-2xl font-semibold text-[#F4F4F5]">
            {stats.total > 0 ? formatInr(stats.total) : "—"}
          </p>
          <p className="mt-1 text-[11px] text-[#71717A]">
            {stats.totalCount > 0 ? `${stats.totalCount} tips total` : "No tips yet"}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Today</p>
          <p className="mt-1.5 font-sans text-2xl font-semibold text-[#F4F4F5]">
            {stats.today > 0 ? formatInr(stats.today) : "—"}
          </p>
          <p className="mt-1 text-[11px] text-[#71717A]">
            {stats.todayCount > 0 ? `${stats.todayCount} tip${stats.todayCount > 1 ? "s" : ""} today` : "No tips today"}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Supporters</p>
          <p className="mt-1.5 font-sans text-2xl font-semibold text-[#F4F4F5]">
            {stats.supporters > 0 ? stats.supporters : "—"}
          </p>
          <p className="mt-1 text-[11px] text-[#71717A]">
            {stats.supporters > 0 ? "Unique supporters" : "None yet"}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Avg Tip</p>
          <p className="mt-1.5 font-sans text-2xl font-semibold text-[#F4F4F5]">
            {stats.avgTip > 0 ? formatInr(stats.avgTip) : "—"}
          </p>
          <p className="mt-1 text-[11px] text-[#71717A]">Per transaction</p>
        </Card>
      </div>

      {/* Alert Pipeline */}
      <AlertPipelinePanel />

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Recent Tips with Moderation */}
        <Card className="p-6 lg:col-span-7">
          <RecentTipsModerated initialTips={recentTips} />
        </Card>

        {/* Test Alert Panel */}
        <div className="lg:col-span-5">
          <TestAlertPanel />
        </div>
      </div>

      {/* Overlay Widget Settings */}
      <OverlaySettingsPanel origin={origin} username={username} initialShape={initialShape} />

      {/* Links & Settings */}
      <DashboardLinks origin={origin} username={username} />
      <SettingsPreview username={username} displayName={displayName} />
    </div>
  );
}
