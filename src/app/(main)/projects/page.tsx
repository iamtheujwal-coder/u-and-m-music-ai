"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Music, PlusCircle, Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";

const statusColors: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-500",
  processing: "bg-amber-500/10 text-amber-500",
  draft: "bg-muted text-muted-foreground",
  failed: "bg-red-500/10 text-red-500",
};

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects').then(res => res.json()).then(data => {
      if (data.projects) setProjects(data.projects);
      setLoading(false);
    });
  }, []);

  const filtered = projects.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
            <p className="mt-1 text-muted-foreground">{projects.length} projects total</p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            <PlusCircle className="h-4 w-4" /> New Project
          </Link>
        </div>
      </motion.div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted">
          <Filter className="h-4 w-4" /> Filter
        </button>
      </div>

      {/* Project List */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
            <Music className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No projects found</p>
            <p className="mt-1 text-xs text-muted-foreground">Create your first project to get started.</p>
          </div>
        ) : (
          filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/projects/${project.id}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-violet-500/20 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Music className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{project.title}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="capitalize">{project.mode?.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>{project.genre || "No Genre"}</span>
                    <span>•</span>
                    <span>{project.mastering_style || "Clean"}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[project.status] || statusColors.draft}`}>
                    {project.status === "processing" && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />}
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(project.created_at).toLocaleDateString()}</p>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
