"use client";

import { useState } from "react";

interface RecentTip {
  id: string;
  supporter_name: string;
  amount: number;
  message: string | null;
  timeAgo: string;
}

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function RecentTipsModerated({ initialTips }: { initialTips: RecentTip[] }) {
  const [tips, setTips] = useState<RecentTip[]>(initialTips);
  const [bannedSupporters, setBannedSupporters] = useState<Set<string>>(new Set());
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleHideTip = async (tipId: string) => {
    setLoadingId(tipId);
    try {
      const res = await fetch("/api/moderation/tip-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "hide_tip", tipId }),
      });

      if (res.ok) {
        setTips((prev) => prev.filter((t) => t.id !== tipId));
        setStatusMsg("Tip removed from feed ✓");
        setTimeout(() => setStatusMsg(null), 2500);
      }
    } catch {
      // fallback
    } finally {
      setLoadingId(null);
    }
  };

  const handleBanSupporter = async (supporterName: string, tipId: string) => {
    if (supporterName === "Anonymous Supporter" || supporterName === "Anonymous") {
      alert("Cannot ban anonymous supporters.");
      return;
    }

    if (!confirm(`Ban "${supporterName}"? This will hide all their tips and block future tips.`)) {
      return;
    }

    setLoadingId(tipId);
    try {
      const res = await fetch("/api/moderation/tip-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ban_supporter", supporterName }),
      });

      if (res.ok) {
        setBannedSupporters((prev) => new Set(prev).add(supporterName.toLowerCase()));
        setTips((prev) => prev.filter((t) => t.supporter_name.toLowerCase() !== supporterName.toLowerCase()));
        setStatusMsg(`Banned ${supporterName} ✓`);
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch {
      // fallback
    } finally {
      setLoadingId(null);
    }
  };

  const hasTips = tips.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between border-b border-[#232326] pb-4 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-[#F4F4F5]">Recent tips &amp; Moderation</h2>
          <p className="text-[11px] text-[#71717A] mt-0.5">
            Manage recent activity feed, remove inappropriate tips, or ban supporters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {statusMsg && <span className="text-xs text-[#22C55E] font-medium">{statusMsg}</span>}
          <span className="text-xs text-[#71717A]">
            {hasTips ? `${tips.length} transactions` : "Activity feed"}
          </span>
        </div>
      </div>

      {hasTips ? (
        <div className="divide-y divide-[#1B1B1F]">
          {tips.map((tip) => {
            const isBanned = bannedSupporters.has(tip.supporter_name.toLowerCase());
            const tier =
              tip.amount >= 1000 ? "#00D4FF" :
              tip.amount >= 500  ? "#F5B800" :
              tip.amount >= 100  ? "#A1A1AA" : "#CD7F32";

            return (
              <div key={tip.id} className="py-3 flex items-start justify-between gap-4 first:pt-0 last:pb-0 group">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold border"
                    style={{ background: tier + "15", borderColor: tier + "40", color: tier }}
                  >
                    {tip.supporter_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-[#F4F4F5] truncate">{tip.supporter_name}</p>
                      {isBanned && (
                        <span className="rounded bg-[#EF4444]/15 border border-[#EF4444]/30 px-1.5 py-0.5 text-[9px] font-mono text-[#EF4444]">
                          Banned
                        </span>
                      )}
                      <span className="text-[10px] text-[#71717A] shrink-0">{tip.timeAgo}</span>
                    </div>
                    {tip.message && (
                      <p className="text-xs text-[#A1A1AA] mt-0.5 leading-snug truncate">&quot;{tip.message}&quot;</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold" style={{ color: tier }}>
                    {formatInr(tip.amount)}
                  </span>

                  {/* Moderator Controls */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      disabled={loadingId === tip.id}
                      onClick={() => handleHideTip(tip.id)}
                      title="Hide / Delete Tip"
                      className="px-2 py-0.5 rounded text-[10px] font-mono text-[#71717A] hover:text-[#EF4444] hover:bg-[#EF4444]/10 border border-transparent hover:border-[#EF4444]/30 transition-colors"
                    >
                      Hide
                    </button>
                    {tip.supporter_name !== "Anonymous Supporter" && (
                      <button
                        type="button"
                        disabled={loadingId === tip.id}
                        onClick={() => handleBanSupporter(tip.supporter_name, tip.id)}
                        title="Ban Supporter"
                        className="px-2 py-0.5 rounded text-[10px] font-mono text-[#71717A] hover:text-[#EF4444] hover:bg-[#EF4444]/10 border border-transparent hover:border-[#EF4444]/30 transition-colors"
                      >
                        Ban
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-10 w-10 rounded-full bg-[#141417] border border-[#232326] flex items-center justify-center mb-3">
            <span className="text-lg">💸</span>
          </div>
          <p className="text-sm font-medium text-[#F4F4F5]">No active tips in feed</p>
          <p className="text-xs text-[#71717A] mt-1 max-w-[220px]">
            Share your tip page to start receiving support from your community.
          </p>
        </div>
      )}
    </div>
  );
}
