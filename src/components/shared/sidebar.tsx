"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/lib/store";
import {
  LayoutDashboard,
  PlusCircle,
  FolderOpen,
  Dna,
  GraduationCap,
  CreditCard,
  HelpCircle,
  X,
  Music,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/create", label: "Create Song", icon: PlusCircle },
  { href: "/projects", label: "My Projects", icon: FolderOpen },
  { href: "/voice-dna", label: "Voice DNA", icon: Dna },
  { href: "/coach", label: "AI Vocal Coach", icon: GraduationCap },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/support", label: "Support", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo area — mobile only */}
      <div className="flex items-center justify-between border-b border-border p-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Music className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold gradient-primary-text">U&M Music AI</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-violet-500/10 text-violet-500"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-violet-500/10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className={cn("relative z-10 h-4.5 w-4.5", isActive && "text-violet-500")} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Credits Card */}
      <div className="border-t border-border p-3">
        <div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-3">
          <p className="text-xs font-medium text-muted-foreground">Credits Remaining</p>
          <p className="mt-1 text-2xl font-bold gradient-primary-text">2</p>
          <p className="mt-0.5 text-xs text-muted-foreground">of 2 this month</p>
          <Link
            href="/pricing"
            className="mt-2 inline-flex items-center rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-600"
          >
            Upgrade Plan
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:block">
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
