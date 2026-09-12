import Link from "next/link";

export function CreatorUnavailable() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="text-sm tracking-[0.2em] text-zinc-500 uppercase">Streamly</p>
      <h1 className="mt-4 font-serif text-3xl text-zinc-50">This creator page is unavailable</h1>
      <p className="mt-3 text-zinc-400">
        This page has been temporarily disabled. Check back later, or explore Streamly while you wait.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm font-medium text-amber-300 underline-offset-4 hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}
