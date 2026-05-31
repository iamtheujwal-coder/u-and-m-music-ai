"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Music, Menu, X } from "lucide-react";
import { ThemeToggle } from "../shared/theme-toggle";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Music className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold gradient-primary-text">U&M Music AI</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-6 md:flex">
          <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How it Works
          </a>
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </a>
          <a href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            FAQ
          </a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted sm:inline-flex"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="hidden rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md sm:inline-flex"
          >
            Get Started
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-b border-border bg-background px-4 pb-4 md:hidden"
        >
          <div className="space-y-1">
            {["How it Works", "Features", "Pricing", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                {item}
              </a>
            ))}
            <Link
              href="/login"
              className="block rounded-lg gradient-primary px-3 py-2 text-center text-sm font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
