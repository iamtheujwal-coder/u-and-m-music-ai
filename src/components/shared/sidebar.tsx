"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/lib/store";
import { useState, useEffect } from "react";
import {
  Home, Compass, PlusSquare, Sliders, Library, Search,
  Bell, Beaker, FileText, MoreHorizontal, Music, X
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
  Home, Compass, PlusSquare, Sliders, Library, Search,
  Bell, Beaker, FileText, MoreHorizontal, Music
};

const NAV_SECTIONS = [
  {
    label: "",
    items: [
      { href: "/dashboard", label: "Home", icon: "Home" },
      { href: "/explore", label: "Explore", icon: "Compass" },
      { href: "/create", label: "Create", icon: "PlusSquare" },
      { href: "/studio", label: "Studio", icon: "Sliders" },
      { href: "/projects", label: "Library", icon: "Library" },
      { href: "/voice-dna", label: "Hooks", icon: "Search" },
      { href: "/notifications", label: "Notifications", icon: "Bell" },
    ],
  },
  {
    label: "",
    items: [
      { href: "/labs", label: "Labs", icon: "Beaker" },
    ],
  },
  {
    label: "",
    items: [
      { href: "/legal/terms", label: "Terms & Policies", icon: "FileText" },
      { href: "/more", label: "More", icon: "MoreHorizontal" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [userProfile, setUserProfile] = useState<{ artist_name?: string, credits?: number, plan?: string } | null>(null);

  useEffect(() => {
    async function loadUser() {
      const localProfile = localStorage.getItem("demo_profile");
      if (localProfile) {
        try {
          const parsed = JSON.parse(localProfile);
          setUserProfile({
            artist_name: parsed.name || "Demo Artist",
            credits: parsed.credits || 2500,
            plan: parsed.plan || "pro"
          });
          return;
        } catch (e) {}
      }
      // Fallback
      setUserProfile({ artist_name: "U&M Artist", credits: 50, plan: "free" });
    }
    loadUser();

    const handleProfileUpdate = () => loadUser();
    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#0A0A0A] text-[#E5E5E5]">
      {/* Brand & User Header */}
      <div className="p-5 border-b border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <Music className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-widest">UANM</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-500 to-blue-500 shrink-0" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-white truncate group-hover:underline">
              {userProfile?.artist_name || "Sign In"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded uppercase font-bold">
                {userProfile?.plan === "studio" ? "Studio" : userProfile?.plan === "pro" ? "Pro Plan" : "Free Plan"}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {userProfile?.credits?.toLocaleString() || 0} cr
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/pricing"
          className="flex w-full items-center justify-center rounded-full border border-zinc-700 bg-transparent py-2.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800"
        >
          Upgrade to Premier
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx}>
            {section.label && (
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = ICON_MAP[item.icon] || Music;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200",
                      isActive
                        ? "bg-zinc-800/80 text-white"
                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-xl bg-zinc-800/80"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon className={cn("relative z-10 h-4 w-4", isActive && "text-white")} />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Spacer instead of credit card */}
      <div className="p-4" />
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-zinc-800 bg-[#0A0A0A] md:block">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-card shadow-2xl md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
