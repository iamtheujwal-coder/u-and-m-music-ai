import Link from "next/link";

const legalPages = [
  { href: "/legal/privacy", title: "Privacy Policy" },
  { href: "/legal/terms", title: "Terms of Use" },
  { href: "/legal/voice-consent", title: "Voice Consent Policy" },
  { href: "/legal/copyright", title: "Copyright Policy" },
  { href: "/legal/refund", title: "Refund Policy" },
  { href: "/legal/ai-disclaimer", title: "AI Usage Disclaimer" },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap gap-2">
          {legalPages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {p.title}
            </Link>
          ))}
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}
