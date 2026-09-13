import { type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[#6366F1] text-white hover:bg-[#4F46E5] active:scale-[0.99] font-medium shadow-md shadow-[#6366F1]/20 disabled:bg-[#232326] disabled:text-[#52525B]",
  secondary:
    "border border-[#232326] bg-[#141417] text-[#F4F4F5] hover:bg-[#1B1B1F] hover:border-[#312E81] active:scale-[0.99] shadow-xs disabled:opacity-50",
  ghost:
    "text-[#A1A1AA] hover:bg-[#141417] hover:text-[#F4F4F5] active:scale-[0.99]",
  destructive:
    "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444]/20 active:scale-[0.99]",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-xs tracking-wide rounded-lg",
  md: "h-10 px-4 text-sm tracking-wide rounded-lg",
  lg: "h-11 px-5 text-sm tracking-wide rounded-lg font-medium",
};

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 font-sans transition-all duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1] disabled:cursor-not-allowed disabled:transform-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
