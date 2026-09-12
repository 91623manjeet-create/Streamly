import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="text-sm tracking-[0.2em] text-zinc-500 uppercase">404 Error</p>
      <h1 className="mt-4 font-serif text-3xl text-zinc-50 sm:text-4xl">Page not found</h1>
      <p className="mt-3 text-zinc-400">
        The creator page or resource you are looking for does not exist or may have been moved.
      </p>
      <Link href="/" className="mt-8">
        <Button variant="secondary">Back to home</Button>
      </Link>
    </div>
  );
}
