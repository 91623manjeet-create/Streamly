import { type HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "elevated" | "interactive";
};

export function Card({
  className = "",
  variant = "default",
  ...props
}: CardProps) {
  const baseStyles = "rounded-xl border transition-colors duration-150 ease-out";

  const variantStyles = {
    default: "border-[#232326] bg-[#0F0F12] text-[#F4F4F5]",
    elevated: "border-[#232326] bg-[#141417] text-[#F4F4F5]",
    interactive:
      "border-[#232326] bg-[#0F0F12] text-[#F4F4F5] hover:border-[#2E2E33] hover:bg-[#141417]",
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
