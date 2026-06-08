"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/lib/store";
import { useState, useEffect } from "react";
import {
  Home, Compass, PlusSquare, Sliders, Library, Search,
  Bell, Beaker, FileText, MoreHorizontal, Music, X, Sparkles
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
      { href: "/voice-dna", label: "Voice DNA", icon: "Search" },
      { href: "/notifications", label: "Notifications", icon: "Bell" },
    ],
  },
  {
    label: "Advanced",
    items: [
      { href: "/labs", label: "Labs", icon: "Beaker" },
    ],
  },
  {
    label: "Account",
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
      setUserProfile({ artist_name: "U&M Artist", credits: 50, plan: "free" });
    }
    loadUser();

    const handleProfileUpdate = () => loadUser();
    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-zinc-950/40 text-zinc-300">
      {/* Brand Header */}
      <div className="p-6 pb-2 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_0_15px_rgba(124,58,237,0.4)] group-hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] transition-all">
              <Music className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              UANM
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-600 shrink-0 shadow-inner flex items-center justify-center text-white font-bold text-sm">
            {userProfile?.artist_name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-zinc-100 truncate group-hover:text-violet-300 transition-colors">
              {userProfile?.artist_name || "Sign In"}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-violet-500/20">
                {userProfile?.plan === "studio" ? "Studio" : userProfile?.plan === "pro" ? "Pro" : "Free"}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono font-medium">
                {userProfile?.credits?.toLocaleString() || 0} cr
              </span>
            </div>
          </div>
        </div>

        {/* Upgrade Button */}
        <Link
          href="/pricing"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 py-2.5 text-xs font-semibold text-violet-200 transition-all hover:bg-violet-500/20 hover:border-violet-400/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Upgrade to Premier
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx}>
            {section.label && (
              <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                {section.label}
              </p>
            )}
            <div className="space-y-1">
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
                      "group relative flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all duration-200",
                      isActive
                        ? "text-white"
                        : "text-zinc-400 hover:text-zinc-100"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-xl bg-zinc-800/60 shadow-inner border border-white/5"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    
                    {/* Hover Background */}
                    {!isActive && (
                      <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}

                    <Icon className={cn("relative z-10 h-4 w-4 transition-colors", isActive ? "text-violet-400" : "group-hover:text-zinc-300")} />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-[280px] shrink-0 border-r border-white/5 bg-zinc-950/80 backdrop-blur-2xl md:block z-20">
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
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/10 bg-zinc-950/90 backdrop-blur-2xl md:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
