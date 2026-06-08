"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  PlusCircle, Upload, Dna, FolderOpen,
  Clock, Zap, ArrowRight, Music,
  Sliders, Download, TrendingUp
} from "lucide-react";

const quickActions = [
  { title: "Create Song", description: "Text/Lyrics to Song", icon: PlusCircle, href: "/create", gradient: "from-violet-500 to-purple-500" },
  { title: "Upload Raw Vocal", description: "Get a professional song", icon: Upload, href: "/create", gradient: "from-emerald-500 to-teal-500" },
  { title: "Train Voice DNA", description: "Train your voice clone", icon: Dna, href: "/voice-dna", gradient: "from-fuchsia-500 to-pink-500" },
  { title: "Mix & Master", description: "Mastering styles & presets", icon: Sliders, href: "/studio", gradient: "from-blue-500 to-cyan-500" },
  { title: "Downloads Panel", description: "Export MP3, WAV, Stems", icon: Download, href: "/downloads", gradient: "from-amber-500 to-orange-500" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [artistName, setArtistName] = useState("Artist");
  const [stats, setStats] = useState([
    { label: "Credits Left", value: "0", icon: Zap, color: "text-violet-500" },
    { label: "Projects", value: "0", icon: FolderOpen, color: "text-blue-500" },
    { label: "Processing", value: "0", icon: Clock, color: "text-amber-500" },
    { label: "This Month", value: "0", icon: TrendingUp, color: "text-emerald-500" },
  ]);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      // Load user profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('artist_name, name, credits').eq('id', user.id).single();
        if (profile?.artist_name) setArtistName(profile.artist_name);
        else if (profile?.name) setArtistName(profile.name);
        
        // Load projects
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.projects) {
          setRecentProjects(data.projects.slice(0, 3));
          
          setStats([
            { label: "Credits Left", value: profile?.credits?.toString() || "2", icon: Zap, color: "text-violet-500" },
            { label: "Projects", value: data.projects.length.toString(), icon: FolderOpen, color: "text-blue-500" },
            { label: "Processing", value: data.projects.filter((p: any) => p.status === 'processing').length.toString(), icon: Clock, color: "text-amber-500" },
            { label: "This Month", value: `+${data.projects.length}`, icon: TrendingUp, color: "text-emerald-500" },
          ]);
        }
      }
    }
    loadData();
  }, [supabase]);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, <span className="gradient-primary-text">{artistName}</span> 🎵
          </h1>
          <p className="mt-1 text-muted-foreground">
            Ready to create something amazing today?
          </p>
        </div>
        <Link
          href="/create"
          className="group inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition-all hover:shadow-lg hover:scale-[1.02]"
        >
          <PlusCircle className="h-4 w-4" />
          New Project
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="mt-2 text-2xl font-bold">{stat.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        >
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.div key={action.title} variants={fadeUp}>
                <Link
                  href={action.href}
                  className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-0.5"
                >
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold">{action.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{action.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Projects</h2>
          <Link href="/projects" className="text-sm text-violet-500 hover:underline">
            View all
          </Link>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {recentProjects.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
              No projects yet. Start creating!
            </div>
          ) : recentProjects.map((project) => (
            <motion.div key={project.id} variants={fadeUp}>
              <Link
                href={`/projects/${project.id}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-violet-500/20 hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <Music className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{project.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{project.mode.replace('_', ' ')}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    project.status === "completed" ? "bg-emerald-500/10 text-emerald-500" :
                    project.status === "processing" ? "bg-amber-500/10 text-amber-500" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {project.status === "processing" && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />}
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Recommended Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-blue-500/5 p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">🎯 Recommended Next Step</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload your first vocal recording and let AI create a professional version.
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
