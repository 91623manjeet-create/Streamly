import { notFound } from "next/navigation";
import { CreatorLoadError } from "@/components/creator-load-error";
import { CreatorUnavailable } from "@/components/creator-unavailable";
import { TipPageView } from "@/components/tip/tip-page-view";
import { loadPublicCreator } from "@/lib/creators";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const result = await loadPublicCreator(username);
  if (result.status === "ok" || result.status === "demo") {
    return {
      title: `${result.creator.display_name} (@${result.creator.username}) | Streamly`,
      description: result.creator.bio ?? `Send a tip to ${result.creator.display_name}`,
    };
  }
  return { title: "Creator | Streamly" };
}

export default async function TipPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const result = await loadPublicCreator(username);

  if (result.status === "ok" || result.status === "demo") {
    return <TipPageView creator={result.creator} demo={result.status === "demo"} />;
  }

  if (result.status === "inactive") {
    return <CreatorUnavailable />;
  }

  if (result.status === "error") {
    return <CreatorLoadError message={result.message} />;
  }

  notFound();
}
