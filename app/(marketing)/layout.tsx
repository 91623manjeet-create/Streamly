import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/layout/site-chrome";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
