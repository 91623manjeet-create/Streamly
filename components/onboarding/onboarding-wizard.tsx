"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/field";
import { claimUsernameAction, type ClaimUsernameState } from "@/lib/creators/actions";
import { validateUsername } from "@/lib/usernames";

export function OnboardingWizard({
  defaultDisplayName = "",
  origin = "http://localhost:3000",
}: {
  defaultDisplayName?: string;
  origin?: string;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [displayName, setDisplayName] = useState(defaultDisplayName);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");

  const [state, formAction, pending] = useActionState<ClaimUsernameState, FormData>(
    claimUsernameAction,
    { error: null, success: false }
  );

  const router = useRouter();

  // Redirect to dashboard immediately after successful claim
  useEffect(() => {
    if (state.success) {
      window.location.href = "/dashboard";
    }
  }, [state.success, router]);

  const usernameError = username ? validateUsername(username) : null;
  const isHandleValid = username.length >= 3 && !usernameError;

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      {/* Onboarding Header */}
      <div className="text-center">
        <Badge variant="indigo" className="mb-3 py-1 px-3">
          STEP {step} OF 2
        </Badge>
        <h1 className="font-sans text-2xl font-bold text-[#F4F4F5]">
          {step === 1 ? "Create your creator profile" : "Choose your handle"}
        </h1>
        <p className="mt-1 text-xs text-[#A1A1AA]">
          {step === 1
            ? "Set your public display name and creator bio."
            : "Claim a unique @username for your tip page and OBS overlay."}
        </p>
      </div>

      <Card className="p-6 border-[#312E81]/30">
        {step === 1 ? (
          /* Step 1: Create Creator Profile */
          <div className="space-y-4">
            <div>
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Aarav Mehta"
                required
              />
            </div>

            <div>
              <Label htmlFor="bio">Short Bio (Optional)</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell viewers what you stream or create..."
              />
            </div>

            <Button
              type="button"
              variant="primary"
              className="w-full mt-2"
              disabled={displayName.trim().length < 2}
              onClick={() => setStep(2)}
            >
              Continue to handle selection →
            </Button>
          </div>
        ) : (
          /* Step 2: Choose Username & Live Link Preview */
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="display_name" value={displayName} />
            <input type="hidden" name="bio" value={bio} />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="username" className="mb-0">Username Handle</Label>
                <span className="text-[11px] text-[#71717A]">Lowercase letters, numbers, hyphens</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#71717A]">@</span>
                <Input
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                  placeholder="aarav"
                  className="pl-7 font-mono text-xs"
                  required
                />
              </div>
              {usernameError && (
                <p className="mt-1 text-[11px] text-[#EF4444]">{usernameError}</p>
              )}
            </div>

            {/* Live Link Preview */}
            <div className="rounded-lg border border-[#232326] bg-[#141417] p-3 space-y-2">
              <span className="text-[10px] font-mono text-[#818CF8] uppercase tracking-wider font-semibold">Live Link Preview</span>
              <div className="text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#A1A1AA]">Tip Page:</span>
                  <code className="text-[#818CF8] font-mono">
                    {origin}/tip/{username || "username"}
                  </code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#A1A1AA]">OBS Overlay:</span>
                  <code className="text-[#F4F4F5] font-mono">
                    {origin}/overlay/{username || "username"}
                  </code>
                </div>
              </div>
            </div>

            {state.error && (
              <p className="text-xs text-[#EF4444]" role="alert">
                {state.error}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setStep(1)} className="w-1/3">
                ← Back
              </Button>
              <Button type="submit" variant="primary" className="w-2/3" disabled={pending || !isHandleValid}>
                {pending ? "Claiming..." : "Complete setup →"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
