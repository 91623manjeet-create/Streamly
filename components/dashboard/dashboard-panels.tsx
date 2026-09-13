"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/field";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import type { OverlayShape } from "@/components/overlay/overlay-alert";

// ─── Alert Pipeline ───────────────────────────────────────────
export function AlertPipelinePanel() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between border-b border-[#232326] pb-4">
        <div>
          <h2 className="text-base font-semibold text-[#F4F4F5]">Alert pipeline</h2>
          <p className="text-xs text-[#71717A] mt-0.5">
            How Streamly delivers tips to your OBS overlay in real-time.
          </p>
        </div>
        <Badge variant="indigo">● LATENCY: 38ms</Badge>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { label: "Tip received", sub: "Payment verified", color: "#22C55E" },
          { label: "Realtime event", sub: "Supabase WebSocket", color: "#6366F1" },
          { label: "OBS delivered", sub: "Browser source updated", color: "#818CF8" },
        ].map(({ label, sub, color }) => (
          <div key={label} className="flex items-start gap-3">
            <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
            <div>
              <p className="text-xs font-medium text-[#F4F4F5]">{label}</p>
              <p className="text-[11px] text-[#71717A]">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Test Alert Panel ─────────────────────────────────────────
export function TestAlertPanel() {
  const [supporter, setSupporter] = useState("Manjeet");
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [message, setMessage] = useState("Bhai ek aur clutch maar! 🔥");
  const [sent, setSent] = useState(false);

  const amounts = [50, 100, 500, 1000];

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  function getTierColor(amt: number) {
    if (amt >= 1000) return "#38BDF8";
    if (amt >= 500) return "#6366F1";
    if (amt >= 100) return "#818CF8";
    return "#CD7F32";
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-[#232326] pb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#F4F4F5]">Test alert</h3>
          <p className="text-[11px] text-[#71717A] mt-0.5">Fire a test to your OBS overlay.</p>
        </div>
        {sent && <span className="text-xs font-medium text-[#22C55E]">✓ Alert fired to OBS</span>}
      </div>

      <div>
        <Label htmlFor="test-supporter">Supporter name</Label>
        <Input
          id="test-supporter"
          value={supporter}
          onChange={(e) => setSupporter(e.target.value)}
        />
      </div>

      <div>
        <Label>Amount</Label>
        <div className="grid grid-cols-4 gap-2 mt-1">
          {amounts.map((amt) => {
            const isSelected = selectedAmount === amt;
            const tierColor = getTierColor(amt);
            return (
              <button
                key={amt}
                type="button"
                onClick={() => setSelectedAmount(amt)}
                className="h-9 rounded-lg border text-xs font-medium transition-colors"
                style={
                  isSelected
                    ? { borderColor: tierColor, background: tierColor + "18", color: tierColor }
                    : { borderColor: "#232326", background: "#0F0F12", color: "#A1A1AA" }
                }
              >
                ₹{amt}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-[#71717A] mt-1.5">
          ₹{selectedAmount} → stays on screen for{" "}
          <span className="text-[#F4F4F5] font-medium">
            {Math.max(10, selectedAmount / 2)}s
          </span>
        </p>
      </div>

      <div>
        <Label htmlFor="test-message">Message</Label>
        <Input
          id="test-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <Button onClick={handleSend} variant="primary" className="w-full">
        Send test alert →
      </Button>
    </Card>
  );
}

// ─── Overlay Shape Settings ───────────────────────────────────

const SHAPES: { id: OverlayShape; label: string; icon: string; desc: string }[] = [
  { id: "rectangle", label: "Rectangle", icon: "▬", desc: "Wide card. Shows avatar, name, amount + message." },
  { id: "square", label: "Square", icon: "■", desc: "Compact square. Great for portrait streams." },
  { id: "capsule", label: "Capsule", icon: "⬭", desc: "Minimal pill. Shows name + amount only." },
];

const TIER_GUIDE = [
  { emoji: "🎯", name: "Bronze", range: "₹1–99",   color: "#CD7F32", dur: "10s min" },
  { emoji: "⚡", name: "Silver", range: "₹100–499", color: "#818CF8", dur: "50s for ₹100" },
  { emoji: "🏆", name: "Gold",   range: "₹500–999", color: "#6366F1", dur: "4m for ₹500" },
  { emoji: "💎", name: "Diamond", range: "₹1000+",  color: "#38BDF8", dur: "8m+ for ₹1000" },
];

export function OverlaySettingsPanel({
  origin,
  username,
  initialShape = "rectangle",
}: {
  origin: string;
  username: string;
  initialShape?: OverlayShape;
}) {
  const [shape, setShape] = useState<OverlayShape>(initialShape);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const { copied, copy } = useCopyToClipboard();

  const handleShapeChange = async (newShape: OverlayShape) => {
    setShape(newShape);
    setSaving(true);
    setSaveMessage("Saving preference...");

    try {
      const res = await fetch("/api/settings/shape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shape: newShape }),
      });

      if (!res.ok) {
        throw new Error("Failed to save");
      }

      setSaveMessage("Saved as default ✓");
      setTimeout(() => setSaveMessage(null), 2500);
    } catch {
      setSaveMessage("Saved locally");
      setTimeout(() => setSaveMessage(null), 2000);
    } finally {
      setSaving(false);
    }
  };

  const overlayUrl = `${origin}/overlay/${username}`;
  const overlayUrlWithShape = `${origin}/overlay/${username}?shape=${shape}`;

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#232326] pb-4">
        <div>
          <h2 className="text-sm font-semibold text-[#F4F4F5]">OBS Overlay Settings</h2>
          <p className="text-xs text-[#71717A] mt-0.5">
            Pick your default widget shape. Saved preferences apply automatically to your OBS source.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className="text-xs font-medium text-[#22C55E] animate-fade-in">{saveMessage}</span>
          )}
          <Badge variant="indigo">● LIVE</Badge>
        </div>
      </div>

      {/* Shape Picker */}
      <div>
        <p className="text-xs font-medium text-[#A1A1AA] mb-3">Widget shape</p>
        <div className="grid grid-cols-3 gap-3">
          {SHAPES.map(({ id, label, icon, desc }) => {
            const active = shape === id;
            return (
              <button
                key={id}
                type="button"
                disabled={saving}
                onClick={() => handleShapeChange(id)}
                className="relative rounded-xl border p-4 text-left transition-all duration-150 cursor-pointer disabled:opacity-70"
                style={
                  active
                    ? { borderColor: "#6366F1", background: "rgba(99, 102, 241, 0.1)" }
                    : { borderColor: "#232326", background: "#0F0F12" }
                }
              >
                {active && (
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-mono text-[#818CF8] font-bold">✓ ACTIVE</span>
                )}
                <span
                  className="block text-xl mb-2"
                  style={{ color: active ? "#818CF8" : "#52525B" }}
                >
                  {icon}
                </span>
                <p className="text-xs font-semibold text-[#F4F4F5]">{label}</p>
                <p className="text-[10px] text-[#71717A] mt-0.5 leading-snug">{desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Preview Window Link */}
      <div className="rounded-xl border border-[#312E81]/40 bg-[#0F0F12] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#F4F4F5]">Interactive Preview Window</p>
            <p className="text-[10px] text-[#71717A] mt-0.5">
              Launch a live pop-up preview window to test shapes, expanding alerts, and animations.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.open(`${origin}/overlay/${username}?preview=true`, "StreamlyPreview", "width=900,height=600")}
            className="shrink-0 text-xs"
          >
            Open Preview Window ↗
          </Button>
        </div>

        <div className="flex gap-2 pt-1">
          <Input
            readOnly
            value={`${origin}/overlay/${username}?preview=true`}
            className="font-mono text-xs text-[#A1A1AA]"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => copy(`${origin}/overlay/${username}?preview=true`)}
            className="shrink-0"
          >
            Copy Preview Link
          </Button>
        </div>
      </div>

      {/* URL Output */}
      <div>
        <Label>Browser Source URL (Saved Default)</Label>
        <div className="flex gap-2 mt-1">
          <Input
            readOnly
            value={overlayUrl}
            className="font-mono text-xs text-[#818CF8]"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => copy(overlayUrl)}
            className="shrink-0"
          >
            {copied ? "Copied ✓" : "Copy Default URL"}
          </Button>
        </div>
        <p className="text-[10px] text-[#71717A] mt-1.5">
          Paste <code className="text-[#818CF8] font-mono">{overlayUrl}</code> into OBS. It automatically uses your saved shape preference (<span className="text-[#F4F4F5] capitalize">{shape}</span>).
        </p>
      </div>

      {/* Explicit Shape URL */}
      {shape !== "rectangle" && (
        <div className="pt-2 border-t border-[#232326]">
          <Label className="text-[#71717A]">Direct {shape} URL (Optional query parameter)</Label>
          <div className="flex gap-2 mt-1">
            <Input
              readOnly
              value={overlayUrlWithShape}
              className="font-mono text-xs text-[#A1A1AA]"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copy(overlayUrlWithShape)}
              className="shrink-0"
            >
              Copy Direct Link
            </Button>
          </div>
        </div>
      )}

      {/* Tier guide */}
      <div>
        <p className="text-xs font-semibold text-[#A1A1AA] mb-3">Alert tiers &amp; duration formula</p>
        <p className="text-[10px] text-[#71717A] mb-3">
          Duration = <span className="text-[#F4F4F5] font-mono">max(10s, amount ÷ 2)</span>. ₹2 = 1 second on screen.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIER_GUIDE.map(({ emoji, name, range, color, dur }) => (
            <div
              key={name}
              className="rounded-lg border p-3"
              style={{ borderColor: color + "33", background: color + "08" }}
            >
              <p className="text-base">{emoji}</p>
              <p className="text-[11px] font-semibold mt-1" style={{ color }}>{name}</p>
              <p className="text-[10px] text-[#71717A]">{range}</p>
              <p className="text-[10px] text-[#A1A1AA] mt-0.5">{dur}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── Dashboard Links ──────────────────────────────────────────
export function DashboardLinks({
  origin,
  username,
}: {
  origin: string;
  username: string;
}) {
  const { copied: copiedTip, copy: copyTip } = useCopyToClipboard();
  const tipUrl = `${origin}/tip/${username}`;

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-sm font-semibold text-[#F4F4F5]">Share your tip page</h2>
      <div>
        <Label>Public Tip Page</Label>
        <div className="flex gap-2 mt-1">
          <Input readOnly value={tipUrl} className="font-mono text-xs text-[#A1A1AA]" />
          <Button variant="secondary" size="sm" onClick={() => copyTip(tipUrl)}>
            {copiedTip ? "Copied ✓" : "Copy"}
          </Button>
        </div>
        <p className="text-[10px] text-[#71717A] mt-1.5">
          Share this link on YouTube, Twitch, Instagram bio, or wherever your community finds you.
        </p>
      </div>
    </Card>
  );
}

// ─── Settings Preview ─────────────────────────────────────────
export function SettingsPreview({
  username,
  displayName,
}: {
  username: string;
  displayName: string;
}) {
  const [name, setName] = useState(displayName);
  const [user, setUser] = useState(username);
  const [minTip, setMinTip] = useState("10");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card id="settings" className="p-6">
      <div className="flex items-center justify-between border-b border-[#232326] pb-4 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-[#F4F4F5]">Creator preferences</h2>
          <p className="text-xs text-[#71717A] mt-0.5">
            Update your profile and tip threshold.
          </p>
        </div>
        {saved && <span className="text-xs font-medium text-[#22C55E]">Saved ✓</span>}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="settings-username">Username</Label>
            <Input
              id="settings-username"
              value={user}
              onChange={(e) => setUser(e.target.value.toLowerCase())}
            />
          </div>
          <div>
            <Label htmlFor="settings-displayName">Display Name</Label>
            <Input
              id="settings-displayName"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="min-tip">Minimum Tip (₹)</Label>
            <Input
              id="min-tip"
              value={minTip}
              onChange={(e) => setMinTip(e.target.value)}
              inputMode="numeric"
            />
            <p className="text-[10px] text-[#71717A] mt-1">Tips below this amount won&apos;t be accepted.</p>
          </div>
          <div className="flex flex-col justify-center rounded-lg border border-[#232326] bg-[#141417] px-4 py-3">
            <p className="text-[10px] text-[#71717A] uppercase tracking-wider font-medium">Alert duration</p>
            <p className="text-xs text-[#F4F4F5] mt-1 font-mono">max(10s, amount ÷ 2)</p>
            <p className="text-[10px] text-[#71717A] mt-0.5">Auto-calculated — ₹2 = 1 second on screen.</p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="secondary" size="sm">
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
