import {
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-10 w-full rounded-lg border border-[#232326] bg-[#141417] px-3 text-sm text-[#F4F4F5] placeholder:text-[#52525B] outline-none transition-colors duration-150 focus:border-[#F5B800]/50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}

export function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-24 w-full rounded-lg border border-[#232326] bg-[#141417] px-3 py-2 text-sm text-[#F4F4F5] placeholder:text-[#52525B] outline-none transition-colors duration-150 focus:border-[#F5B800]/50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}

export function Label({
  className = "",
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`mb-1.5 block text-xs font-medium text-[#A1A1AA] ${className}`}
      {...props}
    />
  );
}
