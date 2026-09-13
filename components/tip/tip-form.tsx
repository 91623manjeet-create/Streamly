"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import type { PublicCreator } from "@/types/database";

const AMOUNTS = [50, 100, 250, 500];

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export function TipForm({ creator }: { creator: PublicCreator }) {
  const [supporterName, setSupporterName] = useState("");
  const [supporterEmail, setSupporterEmail] = useState("");
  const [amount, setAmount] = useState<number | null>(250);
  const [custom, setCustom] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [confirmedTip, setConfirmedTip] = useState<{
    amount: number;
    supporterName: string;
    supporterEmail: string;
    message: string;
  } | null>(null);

  const selectedAmount = custom ? Number(custom) : amount;
  const nameToDisplay = isAnonymous ? "Anonymous Supporter" : supporterName.trim() || "Anonymous Supporter";

  useEffect(() => {
    // Load Razorpay Checkout Script dynamically
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmount || selectedAmount <= 0) return;

    if (!supporterEmail.trim() || !supporterEmail.includes("@")) {
      setError("Please enter a valid email address to receive your payment receipt.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create Order via Server API
      const res = await fetch("/api/tips/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creator.username,
          amount: selectedAmount,
          supporter_name: supporterName,
          supporter_email: supporterEmail,
          message,
          is_anonymous: isAnonymous,
        }),
      });

      const orderData = await res.json();
      if (!res.ok || orderData.error) {
        throw new Error(orderData.error || "Failed to initialize payment order.");
      }

      // Step 2: Handle Payment Verification or Razorpay Modal
      if (orderData.isMock || !window.Razorpay) {
        // Mock Mode / Fallback: Verify payment directly
        const verifyRes = await fetch("/api/tips/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_demo_${Date.now()}`,
            razorpay_signature: "demo_signature",
          }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || verifyData.error) {
          throw new Error(verifyData.error || "Payment verification failed.");
        }

        setConfirmedTip({
          amount: selectedAmount,
          supporterName: nameToDisplay,
          supporterEmail: supporterEmail.trim(),
          message: message.trim(),
        });
        setSubmitted(true);
      } else {
        // Real Razorpay Checkout Modal
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: creator.display_name,
          description: `Tip for ${creator.display_name}`,
          order_id: orderData.orderId,
          handler: async function (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) {
            try {
              const verifyRes = await fetch("/api/tips/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok || verifyData.error) {
                throw new Error(verifyData.error || "Payment verification failed.");
              }

              setConfirmedTip({
                amount: selectedAmount,
                supporterName: nameToDisplay,
                supporterEmail: supporterEmail.trim(),
                message: message.trim(),
              });
              setSubmitted(true);
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : "Payment verification failed.";
              setError(msg);
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: nameToDisplay,
            email: supporterEmail.trim(),
          },
          theme: {
            color: "#6366F1",
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred while creating order.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setConfirmedTip(null);
    setMessage("");
    setCustom("");
    setAmount(250);
    setError(null);
  };

  if (submitted && confirmedTip) {
    return (
      <div className="text-center py-4 space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 text-xl font-bold">
          ✓
        </div>
        <div>
          <h2 className="font-sans text-xl font-bold text-[#F4F4F5]">Thank you for supporting!</h2>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Sent <span className="font-bold text-[#818CF8]">₹{confirmedTip.amount}</span> to {creator.display_name}.
          </p>
          <p className="text-[11px] text-[#71717A] mt-0.5">
            Payment receipt sent to <span className="text-[#A1A1AA]">{confirmedTip.supporterEmail}</span>.
          </p>
        </div>

        <div className="rounded-lg border border-[#312E81]/30 bg-[#141417] p-3 text-left">
          <p className="text-[10px] font-mono text-[#818CF8] uppercase tracking-wider mb-1 font-semibold">Live OBS Alert Dispatched</p>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#F4F4F5]">{confirmedTip.supporterName}</span>
            <span className="font-bold text-[#818CF8]">₹{confirmedTip.amount}</span>
          </div>
          {confirmedTip.message && <p className="text-xs text-[#A1A1AA] mt-1 italic">&quot;{confirmedTip.message}&quot;</p>}
        </div>

        <Button variant="secondary" size="sm" onClick={resetForm} className="w-full">
          Send another tip
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Supporter Name & Anonymous Toggle */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label htmlFor="supporter-name" className="mb-0">Your name</Label>
          <label className="flex items-center gap-1.5 text-xs text-[#71717A] cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded border-[#232326] bg-[#141417] text-[#6366F1] focus:ring-0"
            />
            <span>Send anonymously</span>
          </label>
        </div>
        {!isAnonymous && (
          <Input
            id="supporter-name"
            placeholder="e.g. Neha K."
            value={supporterName}
            onChange={(e) => setSupporterName(e.target.value)}
          />
        )}
      </div>

      {/* Supporter Email (Required for Receipt) */}
      <div>
        <Label htmlFor="supporter-email">Your email address (for payment receipt)</Label>
        <Input
          id="supporter-email"
          type="email"
          required
          placeholder="supporter@domain.com"
          value={supporterEmail}
          onChange={(e) => setSupporterEmail(e.target.value)}
        />
      </div>

      {/* Preset Amounts */}
      <div>
        <Label>Select amount (INR)</Label>
        <div className="grid grid-cols-4 gap-2">
          {AMOUNTS.map((value) => {
            const isSelected = !custom && amount === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setAmount(value);
                  setCustom("");
                }}
                className={`h-10 rounded-lg border text-xs font-semibold transition-all ${
                  isSelected
                    ? "border-[#6366F1] bg-[#6366F1]/10 text-[#818CF8] shadow-xs"
                    : "border-[#232326] bg-[#0F0F12] text-[#A1A1AA] hover:border-[#312E81]"
                }`}
              >
                ₹{value}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Amount */}
      <div>
        <Label htmlFor="custom-amount">Custom amount</Label>
        <Input
          id="custom-amount"
          inputMode="numeric"
          placeholder="e.g. 150"
          value={custom}
          onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ""))}
        />
      </div>

      {/* Message */}
      <div>
        <Label htmlFor="message">Message for stream</Label>
        <Textarea
          id="message"
          name="message"
          maxLength={200}
          rows={3}
          placeholder="Say something for the live stream..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-xs text-[#EF4444]" role="alert">
          {error}
        </p>
      )}

      {/* Continue Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        size="lg"
        disabled={loading || !supporterEmail.trim() || !selectedAmount || selectedAmount <= 0}
      >
        {loading ? "Processing Payment…" : `Pay ₹${selectedAmount || 0} via Razorpay →`}
      </Button>
    </form>
  );
}
