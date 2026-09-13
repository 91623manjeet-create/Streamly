import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StreamlyLogo } from "@/components/ui/logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/tip/demo", label: "Demo Tip Page" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#232326] bg-[#09090B]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <StreamlyLogo size={26} />
        </Link>

        {/* Center Nav */}
        <nav className="hidden items-center gap-6 text-xs font-medium text-[#A1A1AA] md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#F4F4F5] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-xs font-medium text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors">
            Dashboard
          </Link>
          <Link href="/signup">
            <Button size="sm" variant="primary">
              Start for free →
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[#232326] bg-[#09090B]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:justify-between">
        <div>
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <StreamlyLogo size={24} />
          </Link>
          <p className="mt-3 max-w-xs text-xs text-[#71717A] leading-relaxed">
            Infrastructure for live creators. Accept tips, trigger real-time OBS alerts, and engage your audience.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-xs">
          <div className="flex flex-col gap-2 text-[#A1A1AA]">
            <span className="font-medium text-[#F4F4F5]">Product</span>
            <Link href="/#features" className="hover:text-[#F4F4F5] transition-colors">
              Features
            </Link>
            <Link href="/overlay/demo" className="hover:text-[#F4F4F5] transition-colors">
              OBS Overlay Demo
            </Link>
            <Link href="/dashboard" className="hover:text-[#F4F4F5] transition-colors">
              Dashboard
            </Link>
          </div>
          <div className="flex flex-col gap-2 text-[#A1A1AA]">
            <span className="font-medium text-[#F4F4F5]">Account</span>
            <Link href="/login" className="hover:text-[#F4F4F5] transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="hover:text-[#F4F4F5] transition-colors">
              Sign up
            </Link>
            <Link href="/tip/demo" className="hover:text-[#F4F4F5] transition-colors">
              Demo tip page
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[#1B1B1F] px-4 py-4 text-center text-xs text-[#52525B]">
        © {new Date().getFullYear()} Streamly. Creator engagement infrastructure.
      </div>
    </footer>
  );
}
