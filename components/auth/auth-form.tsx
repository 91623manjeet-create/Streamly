"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
      />
    </svg>
  );
}

export function AuthForm({
  mode = "login",
  submitLabel,
  nextPath,
  alternateHref,
  alternateLabel,
}: {
  mode?: "login" | "signup";
  submitLabel: string;
  nextPath?: string;
  alternateHref: string;
  alternateLabel: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || (mode === "signup" && password.length < 8)) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nextPath }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Authentication failed.");
      }

      if (data.redirectTo) {
        window.location.href = data.redirectTo;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred during authentication.";
      setError(msg);
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setDemoLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/demo", { method: "POST" });
      const data = await res.json();
      if (data?.redirectTo) {
        window.location.href = data.redirectTo;
      }
    } catch {
      setDemoLoading(false);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Native Google OAuth Link Button */}
      <a href="/api/auth/google" className="block w-full">
        <Button
          type="button"
          variant="secondary"
          className="w-full justify-center gap-2.5 h-10 border-[#232326] bg-[#141417] hover:bg-[#1B1B20]"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </Button>
      </a>

      {/* Demo Quick Login Button */}
      <Button
        type="button"
        variant="secondary"
        onClick={handleDemoSignIn}
        disabled={demoLoading || loading}
        className="w-full justify-center gap-2 h-10 border-[#312E81]/50 bg-[#6366F1]/10 text-[#818CF8] hover:bg-[#6366F1]/20"
      >
        <span>{demoLoading ? "Entering Dashboard…" : "⚡ Continue as Demo Creator"}</span>
      </Button>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-[#232326]" />
        <span className="absolute bg-[#0F0F12] px-2 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">
          or email
        </span>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="creator@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={8}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? (
          <p className="text-xs text-[#EF4444]" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : submitLabel}
        </Button>

        <p className="text-center text-xs text-[#71717A] pt-1">
          <Link href={alternateHref} className="text-[#818CF8] hover:underline font-medium">
            {alternateLabel}
          </Link>
        </p>
      </form>
    </div>
  );
}
