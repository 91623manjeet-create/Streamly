"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { type AuthFormState } from "@/lib/auth/actions";

export function AuthForm({
  action,
  submitLabel,
  nextPath,
  alternateHref,
  alternateLabel,
}: {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  submitLabel: string;
  nextPath?: string;
  alternateHref: string;
  alternateLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="creator@domain.com" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          placeholder="••••••••"
        />
      </div>
      {state.error ? (
        <p className="text-xs text-[#EF4444]" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? "Please wait…" : submitLabel}
      </Button>
      <p className="text-center text-xs text-[#71717A] pt-1">
        <Link href={alternateHref} className="text-[#F5B800] hover:underline">
          {alternateLabel}
        </Link>
      </p>
    </form>
  );
}
