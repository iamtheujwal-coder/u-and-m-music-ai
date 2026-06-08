"use client";

import Link from "next/link";
import { Menu, Bell, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useUIStore, useAuthStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const [userProfile, setUserProfile] = useState<{ artist_name?: string, email?: string, credits?: number, plan?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUser() {
      // First try to load demo profile
      const localProfile = localStorage.getItem("demo_profile");
      if (localProfile) {
        try {
          const parsed = JSON.parse(localProfile);
          setUserProfile({
            artist_name: parsed.name || "Demo Artist",
            email: "demo@artist.com",
            credits: parsed.credits || 2500,
            plan: parsed.plan || "pro"
          });
          return;
        } catch (e) {}
      }

      // Fallback to Supabase if not in demo
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from("profiles").select("full_name, credits, plan").eq("id", user.id).single();
          setUserProfile({
            artist_name: profile?.full_name || "Artist",
            email: user.email,
            credits: profile?.credits || 2500,
            plan: profile?.plan || "pro"
          });
        } else {
          // Setup basic demo profile if not logged in
          const defaultDemo = { name: "Demo User", credits: 2500, plan: "pro" };
          localStorage.setItem("demo_profile", JSON.stringify(defaultDemo));
          setUserProfile({
            artist_name: defaultDemo.name,
            email: "demo@user.com",
            credits: defaultDemo.credits,
            plan: defaultDemo.plan
          });
        }
      } catch (e) {
        // Ignored
      }
    }
    loadUser();

    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    
    // Listen for profile updates
    const handleProfileUpdate = () => loadUser();
    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6"
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-muted md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <span className="text-xs font-bold text-white">U&M</span>
          </div>
          <span className="hidden text-lg font-semibold tracking-tight md:inline">
            <span className="gradient-primary-text">Music AI</span>
          </span>
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {userProfile && (
          <div className="hidden sm:flex items-center gap-2 bg-muted/50 border border-border px-3 py-1.5 rounded-full">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-emerald-500">{userProfile.credits?.toLocaleString()} Credits</span>
            <Link href="/pricing" className="text-[10px] bg-background border border-border px-2 py-0.5 rounded-full hover:bg-muted transition-colors uppercase font-bold text-muted-foreground ml-1">
              {userProfile.plan === "studio" ? "Studio" : "Pro"}
            </Link>
          </div>
        )}

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-violet-500 text-[9px] font-bold text-white">
            3
          </span>
        </button>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 transition-colors hover:bg-muted"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500">
              <User className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="hidden max-w-[100px] truncate text-sm font-medium md:inline">
              {userProfile?.artist_name || "Artist"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card p-1 shadow-xl"
            >
              <div className="border-b border-border px-3 py-2">
                <p className="text-sm font-medium">{userProfile?.artist_name || "Artist"}</p>
                <p className="text-xs text-muted-foreground">{userProfile?.email || "artist@email.com"}</p>
              </div>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                onClick={() => setMenuOpen(false)}
              >
                <User className="h-4 w-4" /> Profile
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                onClick={() => setMenuOpen(false)}
              >
                <Settings className="h-4 w-4" /> Settings
              </Link>
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                onClick={async () => {
                  setMenuOpen(false);
                  const { createClient } = await import("@/lib/supabase/client");
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  window.location.href = "/login";
                }}
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
