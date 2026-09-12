export function CreatorLoadError({ message }: { message: string }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-3xl text-zinc-50">Something went wrong</h1>
      <p className="mt-3 text-zinc-400">{message}</p>
    </div>
  );
}
