import { notFound } from "next/navigation";
import { CreatorLoadError } from "@/components/creator-load-error";
import { CreatorUnavailable } from "@/components/creator-unavailable";
import { OverlayAlert, type OverlayShape } from "@/components/overlay/overlay-alert";
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
      title: `Overlay - ${result.creator.display_name} | Streamly`,
    };
  }
  return { title: "Overlay | Streamly" };
}

const VALID_SHAPES: OverlayShape[] = ["rectangle", "square", "capsule"];

export default async function OverlayPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ shape?: string; preview?: string }>;
}) {
  const { username } = await params;
  const { shape: rawShape, preview: rawPreview } = await searchParams;
  const result = await loadPublicCreator(username);

  let shape: OverlayShape = "rectangle";
  if (VALID_SHAPES.includes(rawShape as OverlayShape)) {
    shape = rawShape as OverlayShape;
  } else if (
    (result.status === "ok" || result.status === "demo") &&
    result.creator.widget_shape &&
    VALID_SHAPES.includes(result.creator.widget_shape as OverlayShape)
  ) {
    shape = result.creator.widget_shape as OverlayShape;
  }

  if (result.status === "ok" || result.status === "demo") {
    return <OverlayAlert creator={result.creator} shape={shape} isPreview={Boolean(rawPreview)} />;
  }

  if (result.status === "inactive") {
    return <CreatorUnavailable />;
  }

  if (result.status === "error") {
    return <CreatorLoadError message={result.message} />;
  }

  notFound();
}
