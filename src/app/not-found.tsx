"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Page Not Found</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 hover:shadow-lg transition-all hover:bg-violet-600"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
