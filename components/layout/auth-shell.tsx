import type { ReactNode } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 bg-[#09090B]">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-[#F4F4F5]">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#F5B800] text-[11px] font-bold text-[#09090B]">⚡</span>
            <span>Streamly</span>
          </Link>
          <h1 className="mt-6 font-sans text-2xl font-semibold text-[#F4F4F5]">{title}</h1>
          <p className="mt-1.5 text-xs text-[#A1A1AA]">{subtitle}</p>
        </div>
        <Card className="p-6">{children}</Card>
      </div>
    </div>
  );
}
