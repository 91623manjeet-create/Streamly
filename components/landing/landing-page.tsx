import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const steps = [
  {
    n: "01",
    title: "Create your Streamly page",
    body: "Claim your handle, set your bio, and configure tip preset amounts. Supporters can leave notes without creating an account.",
  },
  {
    n: "02",
    title: "Share your tip link",
    body: "Add your tip link to your stream overlay, chat commands, social profiles, or stream description.",
  },
  {
    n: "03",
    title: "Receive tips + live alerts",
    body: "Tips trigger real-time OBS browser source alerts live on stream so you can thank supporters immediately.",
  },
];

const features = [
  {
    title: "Real-time alerts",
    body: "WebSocket alert dispatches deliver stream notifications to your OBS browser source in under 50ms.",
  },
  {
    title: "UPI-friendly tipping",
    body: "Native INR preset chips (₹50, ₹100, ₹250, ₹500, ₹1000) optimized for Indian livestreamers.",
  },
  {
    title: "OBS integration",
    body: "Clean browser source link — no desktop software installation or complex plugin configuration required.",
  },
  {
    title: "Creator analytics",
    body: "Track month-to-date tip totals, supporter growth, average tip amounts, and transaction history.",
  },
  {
    title: "Custom alerts",
    body: "Configure alert duration, minimum tip threshold, font sizing, and visual themes to match your broadcast.",
  },
  {
    title: "Supporter engagement",
    body: "Keep track of top supporters and thank them directly on stream to build long-term community trust.",
  },
];

export function LandingPage() {
  return (
    <div className="space-y-24 py-12 sm:py-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-widest text-[#71717A] uppercase">
            CREATOR ENGAGEMENT PLATFORM
          </p>

          <h1 className="mt-4 font-sans text-3xl font-semibold tracking-tight text-[#F4F4F5] sm:text-5xl md:text-6xl leading-[1.15]">
            Turn your audience into your community.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base text-[#A1A1AA] sm:text-lg leading-relaxed">
            Accept tips, trigger real-time OBS alerts, and give your community more ways to support you.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" variant="primary">
                Start for free →
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button size="lg" variant="secondary">
                See how it works
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Product Software Preview */}
        <div className="mx-auto mt-14 max-w-5xl">
          <Card variant="elevated" className="overflow-hidden shadow-2xl">
            {/* Window Top Bar */}
            <div className="flex items-center justify-between border-b border-[#232326] bg-[#09090B] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#232326]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#232326]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#232326]" />
                <span className="ml-2 font-mono text-xs text-[#71717A]">streamly.app/dashboard</span>
              </div>
              <Badge variant="amber">● LIVE SYSTEM</Badge>
            </div>

            {/* Dashboard Mock Preview Interface */}
            <div className="p-6 space-y-6 bg-[#0F0F12]">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-lg border border-[#232326] bg-[#141417] p-4">
                  <p className="text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Total Tips</p>
                  <p className="mt-1 font-sans text-xl font-semibold text-[#F5B800]">₹42,850</p>
                  <p className="mt-0.5 text-[11px] text-[#22C55E]">+18.4% this month</p>
                </div>
                <div className="rounded-lg border border-[#232326] bg-[#141417] p-4">
                  <p className="text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Monthly Tips</p>
                  <p className="mt-1 font-sans text-xl font-semibold text-[#F4F4F5]">₹12,640</p>
                  <p className="mt-0.5 text-[11px] text-[#71717A]">September</p>
                </div>
                <div className="rounded-lg border border-[#232326] bg-[#141417] p-4">
                  <p className="text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Supporters</p>
                  <p className="mt-1 font-sans text-xl font-semibold text-[#F4F4F5]">187</p>
                  <p className="mt-0.5 text-[11px] text-[#71717A]">Active viewers</p>
                </div>
                <div className="rounded-lg border border-[#232326] bg-[#141417] p-4">
                  <p className="text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Average Tip</p>
                  <p className="mt-1 font-sans text-xl font-semibold text-[#F4F4F5]">₹229</p>
                  <p className="mt-0.5 text-[11px] text-[#71717A]">Per supporter</p>
                </div>
              </div>

              {/* Sample Activity & Alert Box */}
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-lg border border-[#232326] bg-[#141417] p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#232326] pb-2">
                    <span className="text-xs font-semibold text-[#F4F4F5]">Recent Activity</span>
                    <span className="text-[11px] text-[#71717A]">Updated 2m ago</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#232326] text-[10px] font-bold text-[#F4F4F5]">N</div>
                        <span className="text-[#F4F4F5]">Neha K.</span>
                        <span className="text-[#71717A]">&quot;That clutch round was insane!&quot;</span>
                      </div>
                      <span className="font-medium text-[#F5B800]">₹250</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#232326] text-[10px] font-bold text-[#F4F4F5]">R</div>
                        <span className="text-[#F4F4F5]">Rohit S.</span>
                        <span className="text-[#71717A]">&quot;Love the new stream overlay layout!&quot;</span>
                      </div>
                      <span className="font-medium text-[#F5B800]">₹100</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-[#232326] bg-[#09090B] p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-[#F5B800] uppercase tracking-wider">OBS Alert Preview</span>
                    <div className="mt-3 rounded border border-[#232326] bg-[#141417] p-3">
                      <p className="text-xs font-semibold text-[#F4F4F5]">Neha K. tipped <span className="text-[#F5B800]">₹250</span></p>
                      <p className="text-[11px] text-[#A1A1AA] mt-0.5">&quot;That clutch round was insane!&quot;</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#71717A] mt-3">Browser source: /overlay/demo</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="scroll-mt-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-md">
            <p className="text-xs font-semibold tracking-widest text-[#71717A] uppercase">HOW IT WORKS</p>
            <h2 className="mt-2 font-sans text-2xl font-semibold text-[#F4F4F5] sm:text-3xl">
              Three steps between going live and getting paid attention.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <Card key={step.n} className="p-6">
                <span className="font-mono text-xs font-semibold text-[#F5B800]">{step.n}</span>
                <h3 className="mt-3 text-base font-semibold text-[#F4F4F5]">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#A1A1AA]">{step.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-md">
            <p className="text-xs font-semibold tracking-widest text-[#71717A] uppercase">CREATOR FEATURES</p>
            <h2 className="mt-2 font-sans text-2xl font-semibold text-[#F4F4F5] sm:text-3xl">
              Built for the stream, not the storefront.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="p-5">
                <h3 className="text-sm font-semibold text-[#F4F4F5]">{feature.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#A1A1AA]">{feature.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6">
        <Card className="mx-auto max-w-4xl p-10 text-center">
          <h2 className="font-sans text-2xl font-semibold text-[#F4F4F5] sm:text-4xl">
            Your audience is already in chat.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-xs text-[#A1A1AA] leading-relaxed">
            Give them a page that takes them seriously. Payments ship in a later phase — the foundation is ready now.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/signup">
              <Button size="lg" variant="primary">
                Create your Streamly page →
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
