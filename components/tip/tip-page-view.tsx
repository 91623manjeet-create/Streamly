import Link from "next/link";
import { Card } from "@/components/ui/card";
import { DemoBanner } from "@/components/ui/demo-banner";
import { TipForm } from "@/components/tip/tip-form";
import type { PublicCreator } from "@/types/database";

export function TipPageView({
  creator,
  demo,
}: {
  creator: PublicCreator;
  demo?: boolean;
}) {
  const initial = creator.display_name.slice(0, 1).toUpperCase();

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col justify-between py-8 px-4">
      <div>
        {demo ? <DemoBanner /> : null}

        {/* Minimal Top Nav */}
        <div className="mx-auto max-w-md flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center gap-1.5 text-xs font-semibold text-[#F4F4F5]">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-[#F5B800] text-[9px] font-bold text-[#09090B]">⚡</span>
            <span>Streamly</span>
          </Link>
          <span className="text-xs text-[#71717A]">Support Creator</span>
        </div>

        <div className="mx-auto w-full max-w-md">
          <Card className="p-6 sm:p-8">
            {/* Creator Profile Header */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#232326] bg-[#141417] text-xl font-bold text-[#F4F4F5]">
                {creator.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={creator.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  initial
                )}
              </div>

              <h1 className="mt-3 font-sans text-xl font-semibold text-[#F4F4F5]">
                {creator.display_name}
              </h1>
              <p className="text-xs text-[#71717A]">@{creator.username}</p>

              {creator.bio ? (
                <p className="mt-2 text-xs leading-relaxed text-[#A1A1AA] max-w-xs">
                  {creator.bio}
                </p>
              ) : null}
            </div>

            <div className="mt-6 border-t border-[#232326] pt-5">
              <p className="text-xs font-medium text-[#F4F4F5] mb-4">Support this creator</p>
              <TipForm creator={creator} />
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-[#52525B]">
        Powered by Streamly · Quiet confidence for live creators
      </div>
    </div>
  );
}
