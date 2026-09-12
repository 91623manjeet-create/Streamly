import type { ReactNode } from "react";
import Link from "next/link";
import { signOutAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export function DashboardShell({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <header className="border-b border-[#232326] bg-[#09090B]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight text-[#F4F4F5] hover:opacity-90 transition-opacity">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#F5B800] text-[11px] font-bold text-[#09090B]">
              ⚡
            </span>
            <span>Streamly</span>
          </Link>
          <div className="flex items-center gap-4 text-xs text-[#A1A1AA]">
            <span className="hidden sm:inline font-mono">{email}</span>
            <form action={signOutAction}>
              <Button type="submit" variant="secondary" size="sm">
                Log out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
