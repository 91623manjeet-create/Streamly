import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: {
    default: "Streamly — Live Creator Engagement Infrastructure",
    template: "%s · Streamly",
  },
  description: "Accept tips, trigger real-time OBS alerts, and elevate your livestream community.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-[#09090B] text-[#F4F4F5] transition-colors duration-300 font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
