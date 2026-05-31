"use client";

import Link from "next/link";
import { Music } from "lucide-react";

const links = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Demo", href: "#demo" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Use", href: "/legal/terms" },
    { label: "Voice Consent", href: "/legal/voice-consent" },
    { label: "Copyright Policy", href: "/legal/copyright" },
    { label: "Refund Policy", href: "/legal/refund" },
  ],
  support: [
    { label: "Help Center", href: "/support" },
    { label: "Contact Us", href: "/support" },
    { label: "FAQ", href: "#faq" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Music className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-primary-text">U&M Music AI</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Your AI Music Studio at Home. Turn raw vocals into professional songs using AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2">
              {links.product.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2">
              {links.legal.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="mt-3 space-y-2">
              {links.support.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} U&M Music AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for singers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
