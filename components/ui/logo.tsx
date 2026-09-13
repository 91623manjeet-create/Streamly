import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  showWordmark?: boolean;
}

export function StreamlyIcon({ size = 28, className = "", ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="streamly-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="streamly-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>

      {/* Rounded Icon Background Container */}
      <rect width="32" height="32" rx="8" fill="url(#streamly-grad)" />

      {/* Broadcast Waves Over 's' */}
      <path
        d="M 9 13 A 4.5 4.5 0 0 1 13.5 8.5"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M 7 10 A 8 8 0 0 1 15 2"
        stroke="#E0E7FF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Stylized 's' center mark */}
      <path
        d="M 17 14 C 17 12 14.5 11.5 13 13 C 11.5 14.5 15.5 16 14 18 C 12.5 20 10 19 10 17"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sparkle Pointer Flourish */}
      <path
        d="M 22 17 L 23 19.5 L 25.5 20.5 L 23 21.5 L 22 24 L 21 21.5 L 18.5 20.5 L 21 19.5 Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function StreamlyLogo({
  size = 28,
  showWordmark = true,
  className = "",
  ...props
}: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Icon Badge */}
      <div className="relative flex items-center justify-center shrink-0">
        <StreamlyIcon size={size} {...props} />
      </div>

      {/* Wordmark Text */}
      {showWordmark && (
        <span className="font-sans text-base font-bold tracking-tight text-[#F4F4F5]">
          stream<span className="text-[#818CF8]">ly</span>
        </span>
      )}
    </div>
  );
}
