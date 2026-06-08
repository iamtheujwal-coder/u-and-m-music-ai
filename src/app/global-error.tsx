"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="mt-2 text-sm text-gray-400">
          An unexpected application error has occurred.
        </p>
        <button
          onClick={() => reset()}
          className="mt-6 rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 hover:shadow-lg transition-all hover:bg-violet-600"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
