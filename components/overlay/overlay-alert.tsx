"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PublicCreator } from "@/types/database";

// ─── Types ────────────────────────────────────────────────────
export type OverlayShape = "rectangle" | "square" | "capsule";

export type AlertData = {
  id?: string;
  supporter: string;
  amount: number;
  message?: string;
};

// ─── Duration Formula ─────────────────────────────────────────
// ₹2 = 1 second of display time, minimum 10 seconds
function getDurationMs(amount: number): number {
  return Math.max(10_000, (amount / 2) * 1_000);
}

// ─── Tier System ──────────────────────────────────────────────
type Tier = {
  name: string;
  emoji: string;
  enterClass: string;
  borderClass: string;
  badgeColor: string;
  glowClass?: string;
  showParticles?: boolean;
};

function getTier(amount: number): Tier {
  if (amount >= 1000) {
    return {
      name: "Diamond",
      emoji: "💎",
      enterClass: "obs-diamond-enter",
      borderClass: "obs-diamond-border",
      badgeColor: "#00D4FF",
      showParticles: true,
    };
  }
  if (amount >= 500) {
    return {
      name: "Gold",
      emoji: "🏆",
      enterClass: "obs-gold-enter",
      borderClass: "obs-gold-glow",
      badgeColor: "#F5B800",
      glowClass: "obs-gold-glow",
    };
  }
  if (amount >= 100) {
    return {
      name: "Silver",
      emoji: "⚡",
      enterClass: "obs-silver-enter",
      borderClass: "",
      badgeColor: "#A1A1AA",
    };
  }
  return {
    name: "Bronze",
    emoji: "🎯",
    enterClass: "obs-bronze-enter",
    borderClass: "",
    badgeColor: "#CD7F32",
  };
}

// ─── Shape Configs ────────────────────────────────────────────
function getShapeClasses(shape: OverlayShape) {
  switch (shape) {
    case "square":
      return {
        wrapper: "w-[220px]",
        card: "rounded-2xl p-4",
        layout: "flex-col items-center text-center gap-2",
        avatarSize: "h-14 w-14 text-lg",
        showMessage: true,
      };
    case "capsule":
      return {
        wrapper: "max-w-[420px] w-full",
        card: "rounded-full px-5 py-3",
        layout: "flex-row items-center gap-3",
        avatarSize: "h-9 w-9 text-sm",
        showMessage: false,
      };
    case "rectangle":
    default:
      return {
        wrapper: "max-w-sm w-full",
        card: "rounded-xl p-4",
        layout: "flex-row items-start gap-3",
        avatarSize: "h-11 w-11 text-sm",
        showMessage: true,
      };
  }
}

// ─── Particles Component (Diamond tier) ───────────────────────
const PARTICLE_EMOJIS = ["💎", "✨", "⭐", "🌟", "💫"];
// Fixed particle durations — deterministic to avoid impure render calls
const PARTICLE_DURS = ["0.85s", "1.10s", "0.90s", "1.30s", "0.75s", "1.20s", "0.95s", "1.15s"];

function DiamondParticles({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="obs-particle absolute text-base select-none"
          style={{
            left: `${10 + i * 11}%`,
            bottom: "0%",
            "--particle-dur": PARTICLE_DURS[i],
            animationDelay: `${i * 0.07}s`,
          } as React.CSSProperties}
        >
          {PARTICLE_EMOJIS[i % PARTICLE_EMOJIS.length]}
        </span>
      ))}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────
function ProgressDrainer({ durationMs, tierColor }: { durationMs: number; tierColor: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full overflow-hidden bg-white/5">
      <div
        className="h-full obs-progress-drain rounded-full"
        style={{
          "--drain-duration": `${durationMs}ms`,
          background: tierColor,
        } as React.CSSProperties}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
interface OverlayAlertProps {
  creator: PublicCreator;
  shape?: OverlayShape;
  isPreview?: boolean;
}

export function OverlayAlert({ creator, shape = "rectangle", isPreview = false }: OverlayAlertProps) {
  const [activeShape, setActiveShape] = useState<OverlayShape>(shape);
  const [currentAlert, setCurrentAlert] = useState<AlertData | null>(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const queueRef = useRef<AlertData[]>([]);
  const isDisplayingRef = useRef(false);
  const displayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const expandTimerRef = useRef<NodeJS.Timeout | null>(null);
  const processQueueRef = useRef<(() => void) | null>(null);

  const initial = creator.display_name.slice(0, 1).toUpperCase();
  const shapeConfig = getShapeClasses(activeShape);

  // Audio chime — ascending notes per tier
  const playChime = useCallback((tier: Tier) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const notesByTier: Record<string, number[]> = {
        Bronze: [523.25, 659.25],
        Silver: [523.25, 659.25, 783.99],
        Gold: [523.25, 659.25, 783.99, 1046.5],
        Diamond: [523.25, 659.25, 783.99, 1046.5, 1318.5],
      };

      const notes = notesByTier[tier.name] ?? [523.25, 659.25];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.18, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.6);
      });
    } catch {
      // ignore audio block
    }
  }, []);

  const processQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      isDisplayingRef.current = false;
      return;
    }

    isDisplayingRef.current = true;
    const nextAlert = queueRef.current.shift()!;
    const tier = getTier(nextAlert.amount);
    const durationMs = getDurationMs(nextAlert.amount);

    setExpanded(false);
    setVisible(false);

    setTimeout(() => {
      setCurrentAlert(nextAlert);
      setAnimKey((k) => k + 1);
      setVisible(true);
      playChime(tier);

      // Phase 2: Expand to reveal message after 650ms
      if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
      expandTimerRef.current = setTimeout(() => {
        setExpanded(true);
      }, 650);

      // Phase 3: Collapse and exit towards end of display duration
      if (displayTimerRef.current) clearTimeout(displayTimerRef.current);
      displayTimerRef.current = setTimeout(() => {
        setExpanded(false);
        setTimeout(() => {
          setVisible(false);
          setTimeout(() => processQueueRef.current?.(), 350);
        }, 400);
      }, durationMs);
    }, 300);
  }, [playChime]);

  useLayoutEffect(() => {
    processQueueRef.current = processQueue;
  }, [processQueue]);

  const triggerAlert = useCallback((alertData: AlertData) => {
    queueRef.current.push(alertData);
    if (!isDisplayingRef.current) {
      processQueueRef.current?.();
    }
  }, []);

  // Supabase Realtime subscription
  useEffect(() => {
    try {
      const supabase = createClient();
      const channel = supabase.channel(`overlay:${creator.id}`);

      channel
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "tips",
            filter: `creator_id=eq.${creator.id}`,
          },
          (payload) => {
            const rec = payload.new as {
              status?: string;
              supporter_name?: string;
              amount?: number;
              message?: string;
              id?: string;
            };
            if (rec?.status === "completed" && rec.amount) {
              triggerAlert({
                id: rec.id,
                supporter: rec.supporter_name || "Anonymous Supporter",
                amount: Number(rec.amount),
                message: rec.message || "",
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // demo mode fallback
    }
  }, [creator.id, triggerAlert]);

  useEffect(() => {
    return () => {
      if (displayTimerRef.current) clearTimeout(displayTimerRef.current);
      if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
    };
  }, []);

  const tier = currentAlert ? getTier(currentAlert.amount) : null;
  const currentDurationMs = currentAlert ? getDurationMs(currentAlert.amount) : 10000;
  const isDiamond = tier?.name === "Diamond";
  const isGold = tier?.name === "Gold";

  return (
    <div className="relative flex min-h-screen items-end justify-center p-6 bg-transparent overflow-hidden">

      {/* ── Interactive Preview Bar (when opened in preview mode or standalone browser) ── */}
      {(isPreview || !currentAlert) && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full border border-[#232326] bg-[#09090B]/95 px-4 py-2.5 text-xs backdrop-blur-md shadow-2xl transition-all">
          <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="font-medium text-[#F4F4F5]">
            {isPreview ? "Interactive Preview Mode" : "Streamly Overlay Active"}
          </span>
          <span className="text-[#3F3F46]">|</span>

          {/* Shape Selector in Preview Mode */}
          <div className="flex items-center gap-1 bg-[#141417] p-1 rounded-full border border-[#232326]">
            {(["rectangle", "square", "capsule"] as OverlayShape[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setActiveShape(s)}
                className="px-2 py-0.5 rounded-full text-[10px] font-mono capitalize transition-colors"
                style={
                  activeShape === s
                    ? { background: "#F5B800", color: "#000", fontWeight: 600 }
                    : { color: "#71717A" }
                }
              >
                {s}
              </button>
            ))}
          </div>

          <span className="text-[#3F3F46]">|</span>

          {/* Test Trigger */}
          <button
            type="button"
            onClick={() =>
              triggerAlert({
                id: `test-demo-${Date.now()}`,
                supporter: "Manjeet",
                amount: 500,
                message: "Bhai Streamly 2-phase expanding alert test! 🔥",
              })
            }
            className="rounded-full bg-[#F5B800] px-3 py-1 text-[11px] font-semibold text-black hover:bg-[#E5AC00] transition-colors shrink-0"
          >
            ⚡ Test ₹500 Alert
          </button>
        </div>
      )}

      {/* ── Alert Widget with 2-Phase Expansion ── */}
      {currentAlert && tier && (
        <div
          key={animKey}
          className={`${shapeConfig.wrapper} transition-all duration-300 ${visible ? "opacity-100" : "opacity-0 scale-95"} ${tier.enterClass}`}
        >
          <div
            className={`relative border bg-[#0F0F12] shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300 ${shapeConfig.card} ${isGold ? tier.borderClass : ""} ${isDiamond ? tier.borderClass : ""} ${!isGold && !isDiamond ? "border-[#232326]" : ""}`}
            style={!isGold && !isDiamond ? {} : isGold ? { borderColor: "#F5B800" } : {}}
          >
            {/* Diamond floating particles */}
            {isDiamond && <DiamondParticles active={visible} />}

            {/* Progress drainer */}
            <ProgressDrainer durationMs={currentDurationMs} tierColor={tier.badgeColor} />

            {/* Header row */}
            {activeShape !== "capsule" && (
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: tier.badgeColor }} />
                  <span className="text-[10px] font-mono font-semibold tracking-widest uppercase" style={{ color: tier.badgeColor }}>
                    {tier.emoji} {tier.name} Tip
                  </span>
                </div>
                <span className="text-[10px] text-[#71717A] font-medium">{creator.display_name}</span>
              </div>
            )}

            {/* Body */}
            <div className={`flex ${shapeConfig.layout}`}>
              {/* Avatar */}
              <div
                className={`shrink-0 flex items-center justify-center rounded-full border bg-[#141417] font-bold text-[#F4F4F5] ${shapeConfig.avatarSize}`}
                style={{ borderColor: tier.badgeColor + "55" }}
              >
                {creator.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={creator.avatar} alt="" className="h-full w-full object-cover rounded-full" />
                ) : (
                  initial
                )}
              </div>

              {/* Text info */}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#F4F4F5] leading-tight" style={{ fontSize: activeShape === "capsule" ? "13px" : "13px" }}>
                  {currentAlert.supporter}{" "}
                  <span className="font-normal text-[#A1A1AA]">{activeShape === "capsule" ? "→" : "sent"}</span>{" "}
                  <span className="font-bold" style={{ color: tier.badgeColor, fontSize: activeShape === "square" ? "22px" : "18px" }}>
                    ₹{currentAlert.amount.toLocaleString("en-IN")}
                  </span>
                </p>

                {/* Smooth 2-Phase Expanding Message Box */}
                {shapeConfig.showMessage && currentAlert.message && (
                  <div
                    className={`transition-all duration-500 ease-out overflow-hidden ${
                      expanded
                        ? "max-h-40 opacity-100 mt-2 py-1.5 px-2.5"
                        : "max-h-0 opacity-0 mt-0 py-0 px-2.5"
                    } bg-[#141417] rounded-lg border border-[#232326]/60`}
                  >
                    <p className="text-xs text-[#A1A1AA] leading-snug italic">
                      &quot;{currentAlert.message}&quot;
                    </p>
                  </div>
                )}

                {activeShape === "capsule" && (
                  <p className="text-[10px] font-mono mt-0.5" style={{ color: tier.badgeColor }}>
                    {tier.emoji} {tier.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
