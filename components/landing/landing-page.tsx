"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type DemoAlert = {
  supporter: string;
  amount: number;
  message: string;
  tier: "Silver" | "Gold" | "Diamond";
  badgeColor: string;
  emoji: string;
};

const SAMPLE_ALERTS: DemoAlert[] = [
  {
    supporter: "Rahul M.",
    amount: 100,
    message: "Love the stream bro! Keep crushing it! 🔥",
    tier: "Silver",
    badgeColor: "#818CF8",
    emoji: "⚡",
  },
  {
    supporter: "Neha K.",
    amount: 500,
    message: "That 1v4 clutch was completely insane! 🏆",
    tier: "Gold",
    badgeColor: "#6366F1",
    emoji: "🏆",
  },
  {
    supporter: "Aman S.",
    amount: 1000,
    message: "Supporter of the month! Thanks for all the content 💎",
    tier: "Diamond",
    badgeColor: "#38BDF8",
    emoji: "💎",
  },
];

export function LandingPage() {
  const [activeAlert, setActiveAlert] = useState<DemoAlert | null>(SAMPLE_ALERTS[1]);
  const [animating, setAnimating] = useState(false);

  const triggerDemo = (alertItem: DemoAlert) => {
    setAnimating(true);
    setActiveAlert(alertItem);
    setTimeout(() => setAnimating(false), 500);
  };

  return (
    <div className="space-y-20 py-12 sm:py-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="indigo" pulse className="mb-4 py-1 px-3">
            ✦ CREATOR ENGAGEMENT INFRASTRUCTURE
          </Badge>

          <h1 className="font-sans text-4xl font-extrabold tracking-tight text-[#F4F4F5] sm:text-6xl md:text-7xl leading-[1.1]">
            Elevate your stream with <span className="bg-gradient-to-r from-[#818CF8] via-[#6366F1] to-[#A855F7] bg-clip-text text-transparent">instant alerts & tips</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-[#A1A1AA] sm:text-lg leading-relaxed">
            Set up your custom tip page and OBS browser source in 60 seconds. Clean, minimalist, and built for live broadcasts.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" variant="primary" className="w-full sm:w-auto">
                Get Started Free →
              </Button>
            </Link>
            <Link href="/tip/demo">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Try Demo Tip Page
              </Button>
            </Link>
          </div>
        </div>

        {/* Interactive Live Stream Alert Showcase */}
        <div className="mx-auto mt-14 max-w-3xl">
          <Card variant="elevated" className="overflow-hidden border-[#312E81]/50 shadow-2xl shadow-[#6366F1]/10 bg-[#0F0F12]">
            {/* Window Top Bar */}
            <div className="flex items-center justify-between border-b border-[#232326] bg-[#09090B] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#232326]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#232326]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#232326]" />
                <span className="ml-2 font-mono text-xs text-[#71717A]">OBS Browser Source: /overlay/demo</span>
              </div>
              <Badge variant="indigo">LIVE DEMO</Badge>
            </div>

            {/* Interactive Alert Display Box */}
            <div className="p-8 sm:p-10 flex flex-col items-center text-center justify-center min-h-[220px]">
              {activeAlert && (
                <div
                  className={`w-full max-w-md rounded-2xl border p-6 bg-[#141417] shadow-xl transition-all duration-300 ${
                    animating ? "scale-95 opacity-80" : "scale-100 opacity-100"
                  }`}
                  style={{ borderColor: activeAlert.badgeColor + "66" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[11px] font-mono font-semibold tracking-wider uppercase px-2 py-0.5 rounded border"
                      style={{
                        color: activeAlert.badgeColor,
                        borderColor: activeAlert.badgeColor + "44",
                        backgroundColor: activeAlert.badgeColor + "11",
                      }}
                    >
                      {activeAlert.emoji} {activeAlert.tier} Tip
                    </span>
                    <span className="text-[11px] text-[#71717A]">Just Now</span>
                  </div>

                  <div className="text-left space-y-2">
                    <p className="text-base font-bold text-[#F4F4F5]">
                      {activeAlert.supporter}{" "}
                      <span className="font-normal text-[#A1A1AA]">sent</span>{" "}
                      <span style={{ color: activeAlert.badgeColor }} className="font-extrabold text-lg">
                        ₹{activeAlert.amount}
                      </span>
                    </p>
                    <div className="rounded-lg bg-[#0F0F12] border border-[#232326] p-3">
                      <p className="text-xs text-[#A1A1AA] italic leading-relaxed">
                        &quot;{activeAlert.message}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Control Buttons */}
              <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
                <span className="text-xs text-[#71717A] mr-2">Click to test live alert:</span>
                {SAMPLE_ALERTS.map((sample) => (
                  <button
                    key={sample.tier}
                    type="button"
                    onClick={() => triggerDemo(sample)}
                    className="h-8 px-3 rounded-lg border border-[#232326] bg-[#141417] text-xs font-medium text-[#A1A1AA] hover:text-[#F4F4F5] hover:border-[#6366F1] transition-all active:scale-95"
                  >
                    Test ₹{sample.amount} ({sample.tier})
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 3 Core Pillars (Minimalist & Uncluttered) */}
      <section id="features" className="scroll-mt-20 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-md mx-auto">
            <h2 className="font-sans text-2xl font-bold text-[#F4F4F5] sm:text-3xl">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <p className="mt-2 text-xs text-[#A1A1AA]">
              Purpose-built for live streamers seeking a fast, quiet, premium support system.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Card className="p-6 space-y-3 hover:border-[#6366F1]/50 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#818CF8] text-lg font-bold">
                ⚡
              </div>
              <h3 className="text-base font-semibold text-[#F4F4F5]">Instant OBS Alerts</h3>
              <p className="text-xs leading-relaxed text-[#A1A1AA]">
                Zero-delay browser source alerts trigger seamlessly in OBS, Streamlabs, or vMix the instant a supporter tips.
              </p>
            </Card>

            <Card className="p-6 space-y-3 hover:border-[#6366F1]/50 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#818CF8] text-lg font-bold">
                💳
              </div>
              <h3 className="text-base font-semibold text-[#F4F4F5]">Frictionless Tipping</h3>
              <p className="text-xs leading-relaxed text-[#A1A1AA]">
                Native UPI & card payment chips let supporters leave notes and tips without requiring account creation.
              </p>
            </Card>

            <Card className="p-6 space-y-3 hover:border-[#6366F1]/50 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#818CF8] text-lg font-bold">
                📊
              </div>
              <h3 className="text-base font-semibold text-[#F4F4F5]">Streamer Analytics</h3>
              <p className="text-xs leading-relaxed text-[#A1A1AA]">
                Track earnings, top supporters, transaction logs, and customize widget shapes directly from your dashboard.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Minimalist CTA */}
      <section className="px-4 sm:px-6">
        <Card className="mx-auto max-w-3xl p-8 sm:p-10 text-center border-[#312E81]/40 bg-gradient-to-b from-[#0F0F12] to-[#14141A]">
          <h2 className="font-sans text-2xl font-bold text-[#F4F4F5] sm:text-3xl">
            Ready to level up your broadcast?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs text-[#A1A1AA] leading-relaxed">
            Join live creators who build stronger communities with Streamly. Setup takes under a minute.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/signup">
              <Button size="lg" variant="primary">
                Create your page free →
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
