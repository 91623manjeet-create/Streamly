import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_50%)]">
      <div className="px-4 pt-6">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-200">
          ← Home
        </Link>
      </div>
      {children}
    </div>
  );
}
