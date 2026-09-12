import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "amber" | "success" | "neutral";
  pulse?: boolean;
};

export function Badge({
  children,
  className = "",
  variant = "default",
  pulse = false,
}: BadgeProps) {
  const variantStyles = {
    default: "border-[#232326] bg-[#141417] text-[#A1A1AA]",
    amber: "border-[#F5B800]/30 bg-[#F5B800]/10 text-[#F5B800]",
    success: "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]",
    neutral: "border-[#232326] bg-[#0F0F12] text-[#71717A]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-medium tracking-tight ${variantStyles[variant]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F5B800] opacity-75"></span>
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#F5B800]"></span>
        </span>
      )}
      {children}
    </span>
  );
}